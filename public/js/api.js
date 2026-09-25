/*
 * Lớp gọi Firebase cho frontend (gói Spark: chỉ Auth + Firestore, không có Cloud Functions).
 *
 * Luồng Check một câu:
 *   1. Ghi câu trả lời vào answerUnlocks/{uid}_{qid} (chỉ tạo được một lần, không sửa được).
 *   2. Đọc answers/{qid} — rules chỉ cho đọc khi đã có bước 1.
 *   3. Chấm bằng Grader, tính sao bằng Scoring.
 *   4. Ghi submissions + users/{uid} trong một batch (rules giới hạn mức cộng sao).
 */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import {
  getAuth, signInWithEmailAndPassword, signOut, connectAuthEmulator
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import {
  getFirestore, connectFirestoreEmulator, collection, doc, getDoc, getDocs, setDoc, updateDoc,
  query, where, orderBy, limit, serverTimestamp, writeBatch
} from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';
import { firebaseConfig, USE_EMULATORS } from './firebase-config.js';

const Grader = window.Grader;
const Scoring = window.Scoring;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

if (USE_EMULATORS) {
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

export const PROFILE_DEFAULTS = Object.assign({ name: '' }, Scoring.EMPTY_STATS);

/* ---------- Đăng nhập ---------- */

// Tài khoản Email/Password do admin tạo sẵn trong Firebase Authentication.
export async function currentUser() {
  await auth.authStateReady();
  return auth.currentUser;
}

// Đăng nhập bằng username: tra usernames/{username} → email (rules cho phép get công khai),
// rồi mới gọi signInWithEmailAndPassword. Nhập email trực tiếp (có "@") vẫn được.
export async function login(username, password) {
  const id = String(username).trim().toLowerCase();
  let email = id;
  if (!id.includes('@')) {
    let snap = null;
    // Username không hợp lệ làm đường dẫn Firestore lỗi → coi như sai tên đăng nhập.
    if (/^[a-z0-9][a-z0-9._-]{1,29}$/.test(id)) snap = await getDoc(doc(db, 'usernames', id));
    if (!snap || !snap.exists()) {
      const err = new Error('Unknown username');
      err.code = 'auth/invalid-credential';   // cùng thông báo với sai mật khẩu
      throw err;
    }
    email = snap.data().email;
  }
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
}

export function logout() {
  return signOut(auth);
}

const uid = () => {
  if (!auth.currentUser) throw new Error('Not signed in');
  return auth.currentUser.uid;
};

/* ---------- Đọc dữ liệu ---------- */

// Chỉ đề bài: collection `questions` không có đáp án.
export async function fetchCatalog() {
  const [qSnap, eSnap] = await Promise.all([getDocs(collection(db, 'questions')), getDocs(collection(db, 'exams'))]);
  const questions = qSnap.docs
    .map(d => ({ id: d.id, cues: d.data().cues, topics: d.data().topics || [], source: d.data().source || [], order: d.data().order || 0 }))
    .sort((a, b) => a.order - b.order);
  const exams = Object.fromEntries(eSnap.docs.map(d => [d.id, Object.assign({ id: d.id }, d.data())]));
  return { questions, exams };
}

export async function fetchProfile() {
  const snap = await getDoc(doc(db, 'users', uid()));
  return Object.assign({}, PROFILE_DEFAULTS, snap.exists() ? snap.data() : {});
}

export function saveName(name) {
  return updateDoc(doc(db, 'users', uid()), { name, updatedAt: serverTimestamp() });
}

export async function fetchHistory(max = 10) {
  const q = query(collection(db, 'submissions'), where('userId', '==', uid()), orderBy('updatedAt', 'desc'), limit(max));
  const snap = await getDocs(q);
  return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
}

/* ---------- Chấm bài ---------- */

const isDenied = err => err && (err.code === 'permission-denied' || err.code === 'firestore/permission-denied');

// Lấy đáp án một câu. Lần đầu: ghi câu trả lời vào answerUnlocks rồi mới đọc được.
async function fetchAnswerKey(questionId, userAnswer) {
  const ref = doc(db, 'answers', questionId);
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data();
  } catch (err) {
    if (!isDenied(err)) throw err;
  }
  await setDoc(doc(db, 'answerUnlocks', `${uid()}_${questionId}`), {
    userId: uid(), questionId, userAnswer, createdAt: serverTimestamp()
  });
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error(`Answer for ${questionId} is missing.`);
  return snap.data();
}

/**
 * Chấm một câu và lưu kết quả.
 * @returns {{ submissionId: string, result: object, profile: object }}
 */
export async function checkAnswer({ examId, submissionId, questionId, userAnswer, strict, final }) {
  const key = await fetchAnswerKey(questionId, userAnswer);

  // Đọc bản mới nhất để không ghi đè khi học sinh mở hai tab.
  const subRef = submissionId ? doc(db, 'submissions', submissionId) : null;
  const [profile, subSnap] = await Promise.all([fetchProfile(), subRef ? getDoc(subRef) : Promise.resolve(null)]);
  const sub = subSnap && subSnap.exists() && subSnap.data().status !== 'completed' && subSnap.data().examId === examId
    ? subSnap.data() : null;

  const out = Scoring.applyAnswer({ profile, sub, questionId, userAnswer, strict, key, grader: Grader, now: Date.now() });
  if (out.duplicate) return { submissionId, result: out.result, profile };

  const batch = writeBatch(db);
  const ref = sub ? subRef : doc(collection(db, 'submissions'));
  const subData = {
    score: out.score,
    total: out.details.length,
    starsEarned: (sub ? sub.starsEarned : 0) + out.starsEarned,
    status: final ? 'completed' : 'in_progress',
    details: out.details,
    updatedAt: serverTimestamp()
  };
  if (sub) batch.update(ref, subData);
  else batch.set(ref, Object.assign({ userId: uid(), examId, createdAt: serverTimestamp() }, subData));

  const stats = {};
  Scoring.USER_STATS.forEach(k => { stats[k] = out.stats[k]; });
  batch.update(doc(db, 'users', uid()), Object.assign(stats, { updatedAt: serverTimestamp() }));
  await batch.commit();

  return { submissionId: ref.id, result: out.result, profile: Object.assign({}, profile, out.stats) };
}

/* ---------- Làm thử (khách chưa đăng nhập) ---------- */

// Chỉ các câu trong exams/trial — rules cho khách get đúng những document này.
export async function fetchTrialCatalog() {
  const exam = await getDoc(doc(db, 'exams', 'trial'));
  if (!exam.exists()) throw new Error('Trial exam is missing.');
  const snaps = await Promise.all(exam.data().questionIds.map(id => getDoc(doc(db, 'questions', id))));
  const questions = snaps.filter(d => d.exists())
    .map(d => ({ id: d.id, cues: d.data().cues, topics: d.data().topics || [], source: d.data().source || [], order: d.data().order || 0 }));
  return { questions, exams: { trial: Object.assign({ id: 'trial' }, exam.data()) } };
}

/**
 * Chấm một câu làm thử. Không ghi gì lên Firestore: thống kê (profile) và bài nộp (sub)
 * do app giữ ở localStorage.
 * @returns {{ submissionId: null, result: object, profile: object, sub: object }}
 */
export async function checkTrialAnswer({ profile, sub, questionId, userAnswer, strict }) {
  const snap = await getDoc(doc(db, 'answers', questionId));
  if (!snap.exists()) throw new Error(`Answer for ${questionId} is missing.`);
  const out = Scoring.applyAnswer({ profile, sub, questionId, userAnswer, strict, key: snap.data(), grader: Grader, now: Date.now() });
  if (out.duplicate) return { submissionId: null, result: out.result, profile, sub };
  return {
    submissionId: null,
    result: out.result,
    profile: Object.assign({}, profile, out.stats),
    sub: { details: out.details, score: out.score }
  };
}

// Xoá lịch sử và thống kê của chính mình (đáp án đã mở vẫn giữ nguyên).
export async function resetProgress() {
  for (;;) {
    const snap = await getDocs(query(collection(db, 'submissions'), where('userId', '==', uid()), limit(400)));
    if (snap.empty) break;
    const batch = writeBatch(db);
    snap.docs.forEach(d => batch.delete(d.ref));
    await batch.commit();
  }
  const stats = Object.assign({}, Scoring.EMPTY_STATS, { qstats: {}, updatedAt: serverTimestamp() });
  await updateDoc(doc(db, 'users', uid()), stats);
}
