#!/usr/bin/env node
/*
 * Thêm các tài khoản trong Firebase Authentication vào danh sách thành viên (users/{uid}).
 * Chỉ thành viên mới đọc được đề và nộp được bài; người tự đăng ký tài khoản khác bị chặn.
 *
 *   node sync-users.js --project peter-tdn --dry-run     # xem sẽ thêm ai
 *   node sync-users.js --project peter-tdn               # tạo document cho user còn thiếu
 *   node sync-users.js --project peter-tdn --only a@x.com,b@y.com   # chỉ thêm các email này
 *
 * Cần GOOGLE_APPLICATION_CREDENTIALS=./service-account.json (hoặc FIRESTORE_EMULATOR_HOST
 * + FIREBASE_AUTH_EMULATOR_HOST khi chạy emulator). User đã có document thì giữ nguyên sao, lịch sử.
 */
'use strict';

function parseArgs(argv) {
  const args = { dryRun: false, project: process.env.GCLOUD_PROJECT || null, only: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--project') args.project = argv[++i];
    else if (argv[i] === '--only') args.only = new Set(argv[++i].split(',').map(s => s.trim().toLowerCase()).filter(Boolean));
    else throw new Error('Unknown argument: ' + argv[i]);
  }
  if (!args.project) throw new Error('Pass --project <firebase-project-id>.');
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { initializeApp, applicationDefault } = require('firebase-admin/app');
  const { getAuth } = require('firebase-admin/auth');
  const { getFirestore, FieldValue } = require('firebase-admin/firestore');
  const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
  initializeApp(usingEmulator ? { projectId: args.project } : { projectId: args.project, credential: applicationDefault() });
  const auth = getAuth();
  const db = getFirestore();

  const accounts = [];
  let pageToken;
  do {
    const page = await auth.listUsers(1000, pageToken);
    accounts.push(...page.users);
    pageToken = page.pageToken;
  } while (pageToken);

  let added = 0;
  for (const u of accounts) {
    const email = (u.email || '').toLowerCase();
    if (args.only && !args.only.has(email)) continue;
    const ref = db.collection('users').doc(u.uid);
    const snap = await ref.get();
    if (snap.exists) { console.log(`  = ${email || u.uid} (đã là thành viên)`); continue; }
    console.log(`  + ${email || u.uid}${args.dryRun ? ' (dry run)' : ''}`);
    if (args.dryRun) continue;
    await ref.create({
      email,
      name: u.displayName || '',
      stars: 0, streak: 0, bestStreak: 0, bonusCount: 0, totalAnswered: 0, totalCorrect: 0, qstats: {},
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    added++;
  }
  console.log(`${accounts.length} auth accounts, ${added} added.`);
}

main().catch(err => { console.error(err.message || err); process.exit(1); });
