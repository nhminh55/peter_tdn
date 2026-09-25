#!/usr/bin/env node
/*
 * Seed chạy một lần: tách ngân hàng câu hỏi trong scripts/source/data.js (Writing) và
 * scripts/source/reading.js (Reading) thành các collection.
 *
 *   questions/{id}  Writing: { type: 'writing_cues', cues, topics, source: [{book, test} | {gen: true}], order }
 *                   Reading: { type: 'reading_tf' | 'reading_mc', part: 'letter' | 'text', passage, num,
 *                              prompt?, options?, topics, source: [{book, test}], order }
 *                   ← đề bài, thành viên đọc được
 *   passages/{id}   bài đọc Reading { part, title, paragraphs | text, source: {book, test}, questionIds, order }
 *   answers/{id}    Writing: { cues, answer, accept, defs, explanation: {vi, en} }
 *                   Reading: { choice: true, answer, evidence, explanation: {vi, en} }
 *                   ← đáp án, chỉ đọc được sau khi đã nộp câu đó (xem firestore.rules)
 *   exams/{id}      Writing: 60 đề (b1-t01 … b2-t30), 'all', 'topic-<id>' cho từng chủ điểm
 *                   Reading: rl-b1-t01 … (thư), rt-b1-t01 … (đoạn văn), 'rl-all', 'rt-all', 'topic-<id>'
 *                   'trial': các câu / bài đọc khách chưa đăng nhập được làm thử (window.TRIAL trong lessons.js)
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
  const args = {
    dryRun: false, project: process.env.GCLOUD_PROJECT || null,
    source: path.join(__dirname, 'source', 'data.js'), reading: path.join(__dirname, 'source', 'reading.js')
  };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--dry-run') args.dryRun = true;
    else if (argv[i] === '--project') args.project = argv[++i];
    else if (argv[i] === '--source') args.source = path.resolve(argv[++i]);
    else if (argv[i] === '--reading') args.reading = path.resolve(argv[++i]);
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

const READING_PARTS = { letter: 'rl', text: 'rt' };
const CHOICES = { tf: ['True', 'False'], mc: ['A', 'B', 'C'] };

/*
 * Reading: mỗi bài đọc (thư / đoạn văn) → passages/{id}; mỗi câu hỏi → questions + answers.
 * lessons: { letter: [...], text: [...] } (window.READING_LESSONS).
 * Câu / bài đọc làm thử: TRIAL.passages bài đầu tiên của mỗi mảng.
 */
function buildReadingDocs(passages, lessons, trial, orderFrom) {
  const errors = [];
  const passageDocs = [], questionDocs = [], answerDocs = [], examDocs = [];
  const trialQuestionIds = [], trialPassageIds = [];
  const ids = new Set();
  let order = orderFrom;

  passages.forEach(p => {
    const prefix = READING_PARTS[p.part];
    if (!prefix) { errors.push(`${p.id}: unknown part ${p.part}`); return; }
    if (ids.has(p.id)) errors.push(`Duplicate passage ${p.id}`);
    ids.add(p.id);
    const [book, test] = p.src || [];
    if (p.id !== `${prefix}-${examIdFor(book, test)}`) errors.push(`${p.id}: id does not match src ${JSON.stringify(p.src)}`);
    const topicIds = new Set((lessons[p.part] || []).map(l => l.id));
    const paras = p.part === 'letter' ? p.paragraphs || [] : [p.text || ''];
    if (!paras.join('')) errors.push(`${p.id}: empty passage`);
    if (!p.questions || p.questions.length !== 4) errors.push(`${p.id}: needs 4 questions`);

    const questionIds = [];
    (p.questions || []).forEach(q => {
      const id = `${p.id}-${q.num}`;
      questionIds.push(id);
      const choices = CHOICES[q.type];
      if (!choices) errors.push(`${id}: unknown type ${q.type}`);
      else if (!choices.includes(q.answer)) errors.push(`${id}: answer ${q.answer} is not one of ${choices.join('/')}`);
      if (q.type === 'mc' && (!Array.isArray(q.options) || q.options.length !== 3)) errors.push(`${id}: needs 3 options`);
      if (p.part === 'letter' && !q.prompt) errors.push(`${id}: missing prompt`);
      if (p.part === 'text' && !p.text.includes(`(${q.num})________`)) errors.push(`${id}: blank (${q.num}) not in text`);
      if (!q.topics || !q.topics.length) errors.push(`${id}: no topics`);
      (q.topics || []).forEach(t => { if (!topicIds.has(t)) errors.push(`${id}: unknown topic ${t}`); });
      (q.evidence || []).forEach(e => { if (!paras.some(par => par.includes(e))) errors.push(`${id}: evidence not in passage: ${e}`); });
      if (!(q.vi || []).length || (q.vi || []).length !== (q.en || []).length) errors.push(`${id}: vi/en explanations missing or differ in length`);

      const data = {
        type: 'reading_' + q.type, part: p.part, passage: p.id, num: q.num,
        topics: q.topics || [], source: [{ book, test }], order: order++
      };
      if (q.prompt) data.prompt = q.prompt;
      if (q.options) data.options = q.options;
      questionDocs.push({ id, data });
      answerDocs.push({ id, data: { choice: true, answer: q.answer, evidence: q.evidence || [], explanation: { vi: q.vi || [], en: q.en || [] } } });
    });

    const passage = { part: p.part, title: p.title || '', source: { book, test }, questionIds, order: passageDocs.length };
    if (p.part === 'letter') passage.paragraphs = p.paragraphs; else passage.text = p.text;
    passageDocs.push({ id: p.id, data: passage });
    examDocs.push({
      id: p.id,
      data: {
        kind: 'test', part: p.part, book, test, passageId: p.id, questionIds,
        title: { vi: `Quyển ${book} — Đề ${test}`, en: `Book ${book} — Test ${test}` }, order: 3000 + passageDocs.length
      }
    });
  });

  Object.entries(READING_PARTS).forEach(([part, prefix]) => {
    const ofPart = passageDocs.filter(d => d.data.part === part);
    if (!ofPart.length) return;
    examDocs.push({
      id: `${prefix}-all`,
      data: { kind: 'all', part, questionIds: ofPart.flatMap(d => d.data.questionIds), title: { vi: 'Tất cả các bài', en: 'All passages' }, order: part === 'letter' ? 1 : 2 }
    });
    (lessons[part] || []).forEach((l, i) => {
      const questionIds = questionDocs.filter(q => q.data.part === part && q.data.topics.includes(l.id)).map(q => q.id);
      if (!questionIds.length) return;
      examDocs.push({ id: `topic-${l.id}`, data: { kind: 'topic', part, topic: l.id, questionIds, title: { vi: l.title }, order: 1500 + i } });
    });
    ofPart.slice(0, trial.passages || 0).forEach(d => { trialPassageIds.push(d.id); trialQuestionIds.push(...d.data.questionIds); });
  });

  return { passageDocs, questionDocs, answerDocs, examDocs, trialQuestionIds, trialPassageIds, errors };
}

function buildDocs(questions, lessons, trial = { lessons: 2, questions: 5 }, reading = null) {
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
        // Firestore không lưu được mảng lồng nhau → [{book, test}]; câu tự soạn: 'gen' → {gen: true}
        source: q.src.map(s => (s === 'gen' ? { gen: true } : { book: s[0], test: s[1] })),
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
      if (q && !q.src.some(s => Array.isArray(s) && s[0] === Number(book) && s[1] === test)) errors.push(`Exam b${book}-t${test}: ${id} src mismatch`);
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

  const passageDocs = [];
  const trialPassageIds = [];
  if (reading) {
    const r = buildReadingDocs(reading.passages, reading.lessons, trial, questions.length);
    r.questionDocs.forEach(d => { if (ids.has(d.id)) errors.push(`Duplicate id ${d.id}`); ids.add(d.id); });
    r.examDocs.forEach(d => { if (examDocs.some(e => e.id === d.id)) errors.push(`Duplicate exam ${d.id}`); });
    questionDocs.push(...r.questionDocs);
    answerDocs.push(...r.answerDocs);
    examDocs.push(...r.examDocs);
    passageDocs.push(...r.passageDocs);
    trialIds.push(...r.trialQuestionIds);
    trialPassageIds.push(...r.trialPassageIds);
    errors.push(...r.errors);
  }
  examDocs.push({
    id: 'trial',
    data: { kind: 'trial', questionIds: trialIds, passageIds: trialPassageIds, title: { vi: 'Làm thử', en: 'Free trial' }, order: 2000 }
  });

  return { questionDocs, answerDocs, examDocs, passageDocs, errors };
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
  const hasReading = fs.existsSync(args.reading);
  const win = loadBrowserGlobals([args.source, path.join(ROOT, 'public', 'js', 'lessons.js'), path.join(ROOT, 'public', 'js', 'lessons-reading.js')]
    .concat(hasReading ? [args.reading] : []));
  const questions = win.WRITING_QUESTIONS;
  const lessons = win.LESSONS;
  if (!Array.isArray(questions) || !questions.length) throw new Error('WRITING_QUESTIONS not found in ' + args.source);
  if (!hasReading) console.warn(`No reading bank at ${path.relative(ROOT, args.reading)} — seeding Writing only.`);
  const reading = hasReading ? { passages: win.READING_PASSAGES, lessons: win.READING_LESSONS } : null;

  const { questionDocs, answerDocs, examDocs, passageDocs, errors } = buildDocs(questions, lessons, win.TRIAL, reading);
  console.log(`Loaded ${questions.length} writing questions from ${path.relative(ROOT, args.source)}`);
  if (reading) console.log(`Loaded ${passageDocs.length} reading passages (${questionDocs.length - questions.length} questions) from ${path.relative(ROOT, args.reading)}`);
  console.log(`${examDocs.length} exams`);
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
  if (passageDocs.length) await write(db, 'passages', passageDocs);
  console.log('Done.');
}

if (require.main === module) {
  main().catch(err => { console.error(err.message || err); process.exit(1); });
}

module.exports = { buildDocs, buildReadingDocs, loadBrowserGlobals, EXAM_ORDER };
