#!/usr/bin/env node
/*
 * Tạo / đồng bộ tài khoản thí sinh từ scripts/users.json — không cần thao tác tay trên console.
 * Với mỗi mục { username, email, name?, password? }:
 *   1. Firebase Auth: tạo user nếu email chưa có. Mật khẩu lấy từ `password`, không có thì
 *      sinh ngẫu nhiên và in ra một lần. User đã có thì giữ nguyên mật khẩu
 *      (trừ khi chạy với --reset-passwords và có `password`).
 *   2. users/{uid}: tạo nếu chưa có (= cấp quyền làm bài); đã có thì chỉ cập nhật email,
 *      username — giữ nguyên sao và lịch sử.
 *   3. usernames/{username}: { email } để trang đăng nhập tra email từ username.
 *      Mapping cũ của cùng email (khi đổi username) được xoá.
 *
 *   node sync-users.js --project peter-tdn --dry-run     # xem sẽ làm gì
 *   node sync-users.js --project peter-tdn
 *   node sync-users.js --project peter-tdn --file other.json --reset-passwords
 *
 * Cần GOOGLE_APPLICATION_CREDENTIALS=./service-account.json. users.json chứa email cá nhân
 * nên đã được .gitignore bỏ qua (mẫu: users.example.json).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERNAME_RE = /^[a-z0-9][a-z0-9._-]{1,29}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseArgs(argv) {
  const args = { dryRun: false, resetPasswords: false, project: process.env.GCLOUD_PROJECT || null, file: path.join(__dirname, 'users.json') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--reset-passwords') args.resetPasswords = true;
    else if (argv[i] === '--project') args.project = argv[++i];
    else if (argv[i] === '--file') args.file = path.resolve(argv[++i]);
    else throw new Error('Unknown argument: ' + argv[i]);
  }
  if (!args.project) throw new Error('Pass --project <firebase-project-id>.');
  return args;
}

function loadAccounts(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing ${file} — copy users.example.json to users.json and edit it.`);
  const list = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(list) || !list.length) throw new Error(`${file} must be a non-empty array.`);
  const seenUser = new Set(), seenEmail = new Set();
  return list.map((a, i) => {
    const username = String(a.username || '').trim().toLowerCase();
    const email = String(a.email || '').trim().toLowerCase();
    if (!USERNAME_RE.test(username)) throw new Error(`#${i + 1}: username "${a.username}" must be 2-30 chars: a-z 0-9 . _ -`);
    if (!EMAIL_RE.test(email)) throw new Error(`#${i + 1}: invalid email "${a.email}"`);
    if (seenUser.has(username)) throw new Error(`Duplicate username ${username}`);
    if (seenEmail.has(email)) throw new Error(`Duplicate email ${email}`);
    if (a.password !== undefined && String(a.password).length < 6) throw new Error(`${username}: password must have at least 6 characters`);
    seenUser.add(username); seenEmail.add(email);
    return { username, email, name: String(a.name || '').trim().slice(0, 40), password: a.password !== undefined ? String(a.password) : null };
  });
}

// Mật khẩu dễ đọc cho trẻ: 3 nhóm chữ số/chữ thường, tránh ký tự dễ nhầm (0/o, 1/l).
function generatePassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.randomBytes(12);
  const s = Array.from(bytes, b => chars[b % chars.length]).join('');
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8, 12)}`;
}

const EMPTY_STATS = { stars: 0, streak: 0, bestStreak: 0, bonusCount: 0, totalAnswered: 0, totalCorrect: 0, qstats: {} };

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const accounts = loadAccounts(args.file);
  const { initializeApp, applicationDefault } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore, FieldValue } = require('firebase-admin/firestore');
  const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
  initializeApp(usingEmulator ? { projectId: args.project } : { projectId: args.project, credential: applicationDefault() });
  const auth = getAuth();
  const db = getFirestore();
  const tag = args.dryRun ? ' (dry run)' : '';
  const newPasswords = [];

  for (const acc of accounts) {
    console.log(`\n${acc.username} <${acc.email}>`);

    // 1. Firebase Auth
    let user = null;
    try { user = await auth.getUserByEmail(acc.email); } catch (e) { if (e.code !== 'auth/user-not-found') throw e; }
    if (!user) {
      const password = acc.password || generatePassword();
      console.log(`  + tạo tài khoản Auth${tag}`);
      if (!args.dryRun) {
        user = await auth.createUser({ email: acc.email, password, displayName: acc.name || acc.username });
        if (!acc.password) newPasswords.push({ username: acc.username, password });
      }
    } else {
      console.log(`  = tài khoản Auth đã có (${user.uid})`);
      if (args.resetPasswords && acc.password) {
        console.log(`  ~ đặt lại mật khẩu${tag}`);
        if (!args.dryRun) await auth.updateUser(user.uid, { password: acc.password });
      }
    }

    // 2. users/{uid} — danh sách thành viên + thống kê
    if (user) {
      const ref = db.collection('users').doc(user.uid);
      const snap = await ref.get();
      if (!snap.exists) {
        console.log(`  + cấp quyền làm bài (users/${user.uid})${tag}`);
        if (!args.dryRun) {
          await ref.create(Object.assign({ email: acc.email, username: acc.username, name: acc.name }, EMPTY_STATS, {
            createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp()
          }));
        }
      } else {
        const cur = snap.data();
        const patch = {};
        if (cur.email !== acc.email) patch.email = acc.email;
        if (cur.username !== acc.username) patch.username = acc.username;
        if (!cur.name && acc.name) patch.name = acc.name;   // không ghi đè tên thí sinh tự đặt
        if (Object.keys(patch).length) {
          console.log(`  ~ cập nhật users/${user.uid}: ${Object.keys(patch).join(', ')}${tag}`);
          if (!args.dryRun) await ref.update(patch);
        } else {
          console.log('  = users/ đã đúng');
        }
      }
    }

    // 3. usernames/{username} → { email }
    const mapRef = db.collection('usernames').doc(acc.username);
    const mapSnap = await mapRef.get();
    if (mapSnap.exists && mapSnap.data().email === acc.email) {
      console.log(`  = usernames/${acc.username} đã đúng`);
    } else {
      console.log(`  + usernames/${acc.username} → ${acc.email}${tag}`);
      if (!args.dryRun) await mapRef.set({ email: acc.email });
    }
    const stale = await db.collection('usernames').where('email', '==', acc.email).get();
    for (const d of stale.docs) {
      if (d.id === acc.username) continue;
      console.log(`  - xoá mapping cũ usernames/${d.id}${tag}`);
      if (!args.dryRun) await d.ref.delete();
    }
  }

  if (newPasswords.length) {
    console.log('\nMật khẩu của tài khoản mới (chỉ hiện một lần, hãy ghi lại):');
    newPasswords.forEach(p => console.log(`  ${p.username}: ${p.password}`));
  }
  console.log(`\n${accounts.length} accounts processed${tag}.`);
}

main().catch(err => { console.error(err.message || err); process.exit(1); });
