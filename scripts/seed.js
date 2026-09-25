#!/usr/bin/env node
/*
 * Seed chạy một lần: tách ngân hàng câu hỏi trong scripts/source/data.js thành 2 collection.
 *
 *   questions/{id}  { type: 'writing_cues', cues, topics, source: [{book, test}], order }
 *                   ← đề bài, thành viên đọc được
 *   answers/{id}    { cues, answer, accept, defs, explanation: {vi, en} }
 *                   ← đáp án, chỉ đọc được sau khi đã nộp câu đó (xem firestore.rules)
 *   exams/{id}      60 đề (b1-t01 … b2-t30), 'all', 'topic-<id>' cho từng chủ điểm, và 'trial'
 *                   (các câu khách chưa đăng nhập được làm thử — xem window.TRIAL trong lessons.js)
 *
 * Cách chạy (từ thư mục scripts/):
 *   npm install
 *   node seed.js --dry-run                         # chỉ kiểm tra dữ liệu, không ghi
 *   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json node seed.js --project <project-id>
 *   FIRESTORE_EMULATOR_HOST=127.0.0.1:8080 node seed.js --project demo-tdn   # ghi vào emulator
 *
 * Admin SDK + service account dùng được trên gói Spark (không cần Blaze).
 * Chạy lại nhiều lần vẫn an toàn: mỗi document được ghi đè bằng dữ liệu mới nhất.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const grader = require('../public/js/grader');

const ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = { dryRun: false, project: process.env.GCLOUD_PROJECT || null, source: path.join(__dirname, 'source', 'data.js') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--project') args.project = argv[++i];
    else if (argv[i] === '--source') args.source = path.resolve(argv[++i]);
    else throw new Error('Unknown argument: ' + argv[i]);
  }
  return args;
}

// Các file cũ gán vào window.*; chạy trong sandbox để lấy dữ liệu ra.
function loadBrowserGlobals(files) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  files.forEach(f => vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f }));
  return ctx.window;
}

// "quyển-đề" -> [id Câu 1, id Câu 2], theo đáp án trong sách.
const EXAM_ORDER = {
  1: ['w01w02', 'w03w04', 'w05w06', 'w07w08', 'w01w09', 'w10w11', 'w12w13', 'w14w15', 'w16w17', 'w18w19',
      'w20w21', 'w22w23', 'w24w25', 'w26w27', 'w28w29', 'w30w31', 'w32w33', 'w34w35', 'w06w36', 'w07w37',
      'w08w38', 'w02w03', 'w39w40', 'w41w05', 'w42w43', 'w04w44', 'w45w46', 'w47w48', 'w49w50', 'w51w52'],
  2: ['w53w15', 'w47w12', 'w18w02', 'w54w03', 'w11w37', 'w45w36', 'w04w31', 'w08w50', 'w42w24', 'w21w40',
      'w07w48', 'w13w55', 'w20w56', 'w41w35', 'w57w58', 'w59w60', 'w16w30', 'w52w19', 'w09w06', 'w29w17',
      'w61w44', 'w22w49', 'w32w05', 'w27w62', 'w34w25', 'w43w26', 'w51w63', 'w64w14', 'w65w23', 'w66w10']
};

const pad = n => String(n).padStart(2, '0');
const examIdFor = (book, test) => `b${book}-t${pad(test)}`;

function buildDocs(questions, lessons, trial = { lessons: 2, questions: 5 }) {
  const lessonTitles = Object.fromEntries(lessons.map(l => [l.id, l.title]));
  const errors = [];
  const ids = new Set();

  const questionDocs = [];
  const answerDocs = [];
  questions.forEach((q, order) => {
    if (ids.has(q.id)) errors.push(`Duplicate id ${q.id}`);
    ids.add(q.id);
    q.topics.forEach(t => { if (!lessonTitles[t]) errors.push(`${q.id}: unknown topic ${t}`); });

    const key = {
      cues: q.cues,
      answer: q.answer,
      accept: q.accept || [],
      defs: q.defs || {},
      explanation: { vi: q.vi || [], en: q.en || [] }
    };
    // Kiểm tra mẫu câu trước khi đẩy lên: mẫu phải parse được và đáp án sách phải được chấp nhận.
    try {
      grader.compile(key);
      if (!grader.isAccepted(key, q.answer)) errors.push(`${q.id}: book answer is rejected by its own patterns`);
      if (!grader.grade(key, q.answer, true).correct) errors.push(`${q.id}: book answer fails strict marking`);
      if (grader.countWords(q.answer) > grader.MAX_WORDS) errors.push(`${q.id}: book answer has more than 15 words`);
    } catch (e) {
      errors.push(`${q.id}: ${e.message}`);
    }
    if (key.explanation.vi.length !== key.explanation.en.length) errors.push(`${q.id}: vi/en explanations differ in length`);

    questionDocs.push({
      id: q.id,
      data: {
        type: 'writing_cues',
        cues: q.cues,
        topics: q.topics,
        // Firestore không lưu được mảng lồng nhau → [{book, test}]
        source: q.src.map(([book, test]) => ({ book, test })),
        order
      }
    });
    answerDocs.push({ id: q.id, data: key });
  });

  const examDocs = [];
  Object.entries(EXAM_ORDER).forEach(([book, pairs]) => pairs.forEach((pair, i) => {
    const questionIds = [pair.slice(0, 3), pair.slice(3)];
    const test = i + 1;
    questionIds.forEach(id => {
      if (!ids.has(id)) errors.push(`Exam b${book}-t${test}: unknown question ${id}`);
      const q = questions.find(x => x.id === id);
      if (q && !q.src.some(([b, t]) => b === Number(book) && t === test)) errors.push(`Exam b${book}-t${test}: ${id} src mismatch`);
    });
    examDocs.push({
      id: examIdFor(book, test),
      data: {
        kind: 'test', book: Number(book), test, questionIds,
        title: { vi: `Quyển ${book} — Đề ${test}`, en: `Book ${book} — Test ${test}` },
        order: Number(book) * 100 + test
      }
    });
  }));

  examDocs.push({
    id: 'all',
    data: { kind: 'all', questionIds: questions.map(q => q.id), title: { vi: 'Tất cả các câu', en: 'All questions' }, order: 0 }
  });

  lessons.forEach((l, i) => {
    const questionIds = questions.filter(q => q.topics.includes(l.id)).map(q => q.id);
    if (!questionIds.length) return;
    examDocs.push({
      id: `topic-${l.id}`,
      data: { kind: 'topic', topic: l.id, questionIds, title: { vi: l.title }, order: 1000 + i }
    });
  });

  // Làm thử: các câu đầu tiên (theo thứ tự) thuộc chủ điểm của những bài học khách được xem.
  const trialTopics = lessons.slice(0, trial.lessons).map(l => l.id);
  const trialIds = questions.filter(q => q.topics.some(t => trialTopics.includes(t))).slice(0, trial.questions).map(q => q.id);
  if (trialIds.length < trial.questions) errors.push(`Trial: only ${trialIds.length} questions for topics ${trialTopics.join(', ')}`);
  examDocs.push({
    id: 'trial',
    data: { kind: 'trial', questionIds: trialIds, title: { vi: 'Làm thử', en: 'Free trial' }, order: 2000 }
  });

  return { questionDocs, answerDocs, examDocs, errors };
}

async function write(db, collection, docs) {
  // Mỗi batch tối đa 500 thao tác.
  for (let i = 0; i < docs.length; i += 400) {
    const batch = db.batch();
    docs.slice(i, i + 400).forEach(d => batch.set(db.collection(collection).doc(d.id), d.data));
    await batch.commit();
  }
  console.log(`  ✓ ${collection}: ${docs.length} documents`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const win = loadBrowserGlobals([args.source, path.join(ROOT, 'public', 'js', 'lessons.js')]);
  const questions = win.WRITING_QUESTIONS;
  const lessons = win.LESSONS;
  if (!Array.isArray(questions) || !questions.length) throw new Error('WRITING_QUESTIONS not found in ' + args.source);

  const { questionDocs, answerDocs, examDocs, errors } = buildDocs(questions, lessons, win.TRIAL);
  console.log(`Loaded ${questions.length} questions, ${examDocs.length} exams from ${path.relative(ROOT, args.source)}`);
  if (errors.length) {
    console.error('Data errors:\n  ' + errors.join('\n  '));
    process.exit(1);
  }
  console.log('Validation passed.');
  if (args.dryRun) { console.log('Dry run: nothing written.'); return; }

  if (!args.project) throw new Error('Pass --project <firebase-project-id> (or set GCLOUD_PROJECT).');
  const { initializeApp, applicationDefault } = require('firebase-admin/app');
  const { getFirestore } = require('firebase-admin/firestore');
  const usingEmulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST);
  initializeApp(usingEmulator ? { projectId: args.project } : { projectId: args.project, credential: applicationDefault() });
  const db = getFirestore();

  console.log(`Writing to ${usingEmulator ? 'emulator ' + process.env.FIRESTORE_EMULATOR_HOST : 'project ' + args.project}…`);
  await write(db, 'questions', questionDocs);
  await write(db, 'answers', answerDocs);
  await write(db, 'exams', examDocs);
  console.log('Done.');
}

if (require.main === module) {
  main().catch(err => { console.error(err.message || err); process.exit(1); });
}

module.exports = { buildDocs, loadBrowserGlobals, EXAM_ORDER };
