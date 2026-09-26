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
 *   answers/{id}    Writing: { cues, answer, accept, defs, possessives?, explanation: {vi, en} }
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
const readingGrader = require('../public/js/reading-grader');

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

/*
 * Reading › Read a passage: bài đọc dài kiểu đề thật 2023–2026 và Stemhouse (scripts/source/passages/*.js,
 * window.READING_PASSAGE_BANK). Một đề (exam) có thể gồm nhiều bài đọc (vd. thư câu 1–4 + đoạn văn câu 5–8).
 *
 *   { id: 'rp-…', exam?: 'rp-…' (mặc định = id), src: { kind: 'exam', year } | { kind: 'sh', test } | { kind: 'shb', n },
 *     title, genre: 'letter' | 'email' | 'article' | 'story', intro, paragraphs: [...] ("# Tiêu đề" = tiêu đề nhỏ),
 *     box?: [từ trong khung], questions: [...] }
 *   Câu hỏi: { num, type, prompt?, topics, evidence, vi, en } và
 *     tf   answer: 'True' | 'False'
 *     mc   options (3–4), answer: 'A'…'D'; không có prompt = chỗ trống "(num)________" trong bài
 *     word answers: [các cách viết được chấp nhận], maxWords
 *     gap  answers, options? (3 lựa chọn); không có prompt = chỗ trống trong bài
 *     open answer (câu mẫu), ideas: [{ any: [...], vi, en }], need?, maxWords?
 *   alsoIn?: { part: 'letter' | 'text', topics: { [số câu]: [chủ điểm của phần đó] } } — đề thật cùng dạng sách 8020
 *     (2025–2026): chép thêm bài này vào Read a letter / Read a text (id rl-e2025 / rt-e2025, câu hỏi riêng).
 */
const PASSAGE_TYPES = ['tf', 'mc', 'word', 'gap', 'open'];
const SOURCE_GROUPS = { exam: 1, sh: 2, shb: 3 };
const LETTERS = ['A', 'B', 'C', 'D'];

function sourceTitle(src) {
  if (src.kind === 'exam') return { vi: `Đề thi ${src.year}`, en: `Exam ${src.year}` };
  if (src.kind === 'sh') return { vi: `Stemhouse — Đề ${src.test}`, en: `Stemhouse — Test ${src.test}` };
  if (src.n) return { vi: `Stemhouse — Tuyển tập, bài ${src.n}`, en: `Stemhouse — Collection, passage ${src.n}` };
  return { vi: 'Stemhouse — Tuyển tập', en: 'Stemhouse — Collection' };
}

function buildPassageDocs(bank, lessons, trial, orderFrom, bookLessons = {}) {
  const errors = [];
  const passageDocs = [], questionDocs = [], answerDocs = [], examDocs = [];
  const trialQuestionIds = [], trialPassageIds = [];
  const topicIds = new Set((lessons || []).map(l => l.id));
  const ids = new Set();
  const exams = new Map();
  let order = orderFrom;

  bank.forEach(p => {
    if (!/^rp-[a-z0-9-]+$/.test(p.id || '')) errors.push(`${p.id}: passage id must look like rp-…`);
    if (ids.has(p.id)) errors.push(`Duplicate passage ${p.id}`);
    ids.add(p.id);
    const src = p.src || {};
    if (!SOURCE_GROUPS[src.kind]) errors.push(`${p.id}: src.kind must be exam, sh or shb`);
    const paras = p.paragraphs || [];
    const text = paras.join('\n');
    if (!text.trim()) errors.push(`${p.id}: empty passage`);
    if (!p.title) errors.push(`${p.id}: missing title`);
    if (!(p.questions || []).length) errors.push(`${p.id}: no questions`);

    const questionIds = [];
    const nums = new Set();
    (p.questions || []).forEach(q => {
      const id = `${p.id}-${q.num}`;
      if (nums.has(q.num)) errors.push(`${id}: duplicate question number`);
      nums.add(q.num);
      questionIds.push(id);
      if (!PASSAGE_TYPES.includes(q.type)) { errors.push(`${id}: unknown type ${q.type}`); return; }
      const blankInText = text.includes(`(${q.num})________`);
      if (['tf', 'word', 'open'].includes(q.type) && !q.prompt) errors.push(`${id}: missing prompt`);
      if (['mc', 'gap'].includes(q.type) && !q.prompt && !blankInText) errors.push(`${id}: no prompt and blank (${q.num}) not in passage`);
      if (q.type === 'tf' && !['True', 'False'].includes(q.answer)) errors.push(`${id}: answer must be True/False`);
      if (q.type === 'mc') {
        if (!Array.isArray(q.options) || q.options.length < 3 || q.options.length > 4) errors.push(`${id}: needs 3–4 options`);
        else if (!LETTERS.slice(0, q.options.length).includes(q.answer)) errors.push(`${id}: answer ${q.answer} is not a valid letter`);
      }
      if (['word', 'gap'].includes(q.type)) {
        if (!Array.isArray(q.answers) || !q.answers.length) errors.push(`${id}: needs answers`);
        else {
          const g = readingGrader.grade({ kind: q.type, answers: q.answers, maxWords: q.maxWords }, q.answers[0]);
          if (!g.correct) errors.push(`${id}: first answer is rejected by its own key`);
          if (q.type === 'word' && !q.answers.some(a => text.toLowerCase().includes(a.toLowerCase()))) errors.push(`${id}: answer not found in passage`);
          if (q.options && !q.options.some(o => readingGrader.grade({ kind: 'gap', answers: q.answers }, o).correct)) errors.push(`${id}: answer is not one of the options`);
        }
      }
      if (q.type === 'open') {
        if (!q.answer) errors.push(`${id}: open question needs a sample answer`);
        if (!Array.isArray(q.ideas) || !q.ideas.length) errors.push(`${id}: open question needs ideas`);
        else {
          const key = { kind: 'open', answer: q.answer, ideas: q.ideas, need: q.need, maxWords: q.maxWords };
          if (!readingGrader.grade(key, q.answer).correct) errors.push(`${id}: sample answer fails its own ideas`);
          q.ideas.forEach((idea, i) => { if (!idea.vi || !idea.en || !(idea.any || []).length) errors.push(`${id}: idea ${i + 1} needs any, vi, en`); });
        }
      }
      if (!q.topics || !q.topics.length) errors.push(`${id}: no topics`);
      (q.topics || []).forEach(t => { if (!topicIds.has(t)) errors.push(`${id}: unknown topic ${t}`); });
      (q.evidence || []).forEach(e => { if (!paras.some(par => par.includes(e))) errors.push(`${id}: evidence not in passage: ${e}`); });
      if (!(q.vi || []).length || (q.vi || []).length !== (q.en || []).length) errors.push(`${id}: vi/en explanations missing or differ in length`);

      const data = {
        type: 'reading_' + q.type, part: 'passage', passage: p.id, num: q.num,
        topics: q.topics || [], source: [src], order: order++
      };
      ['prompt', 'options', 'maxWords', 'authored'].forEach(k => { if (q[k] !== undefined) data[k] = q[k]; });
      if (q.type === 'open') data.ideaCount = q.ideas.length;
      questionDocs.push({ id, data });
      const explanation = { vi: q.vi || [], en: q.en || [] };
      const evidence = q.evidence || [];
      let key;
      if (q.type === 'tf' || q.type === 'mc') key = { choice: true, answer: q.answer };
      else if (q.type === 'open') {
        key = { kind: 'open', answer: q.answer, ideas: q.ideas.map(i => ({ any: i.any, vi: i.vi, en: i.en })) };
        if (q.need) key.need = q.need;
        if (q.maxWords) key.maxWords = q.maxWords;
      } else {
        key = { kind: q.type, answer: q.answers[0], answers: q.answers };
        if (q.maxWords) key.maxWords = q.maxWords;
      }
      answerDocs.push({ id, data: Object.assign(key, { evidence, explanation }) });
    });

    const passage = {
      part: 'passage', title: p.title, genre: p.genre || 'article', intro: p.intro || '', paragraphs: paras,
      source: src, questionIds, order: passageDocs.length
    };
    if (p.box) passage.box = p.box;
    passageDocs.push({ id: p.id, data: passage });
    if (p.alsoIn) addToBookPart(p, passage);
    const examId = p.exam || p.id;
    if (!exams.has(examId)) exams.set(examId, { src, questionIds: [], passageIds: [] });
    exams.get(examId).questionIds.push(...questionIds);
    exams.get(examId).passageIds.push(p.id);
  });

  // Bản chép sang Read a letter / Read a text: câu hỏi và đáp án riêng (qstats riêng), mỗi bài một đề.
  function addToBookPart(p, passage) {
    const part = p.alsoIn.part;
    const prefix = READING_PARTS[part];
    if (!prefix) { errors.push(`${p.id}: alsoIn.part must be letter or text`); return; }
    const id = `${prefix}-e${p.src.year}`;
    const topicsOk = new Set((bookLessons[part] || []).map(l => l.id));
    const questionIds = [];
    p.questions.forEach(q => {
      const qid = `${id}-${q.num}`;
      const topics = (p.alsoIn.topics || {})[q.num] || [];
      if (!['tf', 'mc'].includes(q.type)) errors.push(`${qid}: only True/False and A/B/C questions fit the ${part} part`);
      if (!topics.length) errors.push(`${qid}: alsoIn needs topics`);
      topics.forEach(t => { if (!topicsOk.has(t)) errors.push(`${qid}: unknown ${part} topic ${t}`); });
      const src = questionDocs.find(d => d.id === `${p.id}-${q.num}`);
      const key = answerDocs.find(d => d.id === `${p.id}-${q.num}`);
      questionDocs.push({ id: qid, data: Object.assign({}, src.data, { part, passage: id, topics, order: order++ }) });
      answerDocs.push({ id: qid, data: key.data });
      questionIds.push(qid);
    });
    passageDocs.push({ id, data: Object.assign({}, passage, { part, questionIds, order: 1000 + passageDocs.length }) });
    examDocs.push({ id, data: { kind: 'test', part, group: 'exam', passageId: id, questionIds, title: sourceTitle(p.src), order: 3900 + p.src.year - 2000 } });
  }

  [...exams.entries()].forEach(([id, e], i) => {
    examDocs.push({
      id,
      data: {
        kind: 'test', part: 'passage', group: e.src.kind, src: e.src, passageIds: e.passageIds, questionIds: e.questionIds,
        title: sourceTitle(e.src), order: 4000 + SOURCE_GROUPS[e.src.kind] * 100 + (e.src.kind === 'exam' ? e.src.year - 2000 : i)
      }
    });
  });
  if (passageDocs.length) {
    examDocs.push({ id: 'rp-all', data: { kind: 'all', part: 'passage', questionIds: questionDocs.filter(q => q.data.part === 'passage').map(q => q.id), title: { vi: 'Tất cả các bài', en: 'All passages' }, order: 3 } });
  }
  (lessons || []).forEach((l, i) => {
    const questionIds = questionDocs.filter(q => q.data.part === 'passage' && q.data.topics.includes(l.id)).map(q => q.id);
    if (!questionIds.length) return;
    examDocs.push({ id: `topic-${l.id}`, data: { kind: 'topic', part: 'passage', topic: l.id, questionIds, title: { vi: l.title }, order: 1800 + i } });
  });
  passageDocs.filter(d => d.data.part === 'passage').slice(0, trial.passages || 0).forEach(d => { trialPassageIds.push(d.id); trialQuestionIds.push(...d.data.questionIds); });

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
      ...(q.possessives ? { possessives: q.possessives } : {}),
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
        // Firestore không lưu được mảng lồng nhau → [{book, test}]; câu tự soạn: 'gen' → {gen: true};
        // đề thật / Stemhouse (writing-extra*.js): { kind: 'exam', year } | { kind: 'sh', test } | { kind: 'shb' }
        source: q.src.map(s => (s === 'gen' ? { gen: true } : Array.isArray(s) ? { book: s[0], test: s[1] } : s)),
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

  // Đề thật / Stemhouse (câu có src dạng object): mỗi đề một exam 'w-e2023', 'w-sh01', 'w-shb' để luyện theo đề.
  const extraExams = new Map();
  questions.forEach(q => q.src.forEach(s => {
    if (!s || typeof s !== 'object' || Array.isArray(s)) return;
    const id = s.kind === 'exam' ? `w-e${s.year}` : s.kind === 'sh' ? `w-sh${pad(s.test)}` : 'w-shb';
    if (!extraExams.has(id)) extraExams.set(id, { src: s, questionIds: [] });
    extraExams.get(id).questionIds.push(q.id);
  }));
  [...extraExams.entries()].forEach(([id, e]) => {
    const rank = e.src.kind === 'exam' ? e.src.year - 2000 : e.src.kind === 'sh' ? e.src.test : 0;
    examDocs.push({
      id,
      data: {
        kind: 'test', group: e.src.kind, questionIds: e.questionIds, title: sourceTitle(e.src),
        order: 500 + SOURCE_GROUPS[e.src.kind] * 100 + rank
      }
    });
  });

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
    const parts = [buildReadingDocs(reading.passages || [], reading.lessons, trial, questions.length)];
    if ((reading.bank || []).length) parts.push(buildPassageDocs(reading.bank, reading.lessons.passage, trial, questions.length + 10000, reading.lessons));
    parts.forEach(r => {
      r.questionDocs.forEach(d => { if (ids.has(d.id)) errors.push(`Duplicate id ${d.id}`); ids.add(d.id); });
      r.examDocs.forEach(d => { if (examDocs.some(e => e.id === d.id)) errors.push(`Duplicate exam ${d.id}`); });
      questionDocs.push(...r.questionDocs);
      answerDocs.push(...r.answerDocs);
      examDocs.push(...r.examDocs);
      passageDocs.push(...r.passageDocs);
      trialIds.push(...r.trialQuestionIds);
      trialPassageIds.push(...r.trialPassageIds);
      errors.push(...r.errors);
    });
    // Đề thật chép sang Read a letter / Read a text: thêm vào "tất cả" và đề theo chủ điểm của phần đó.
    questionDocs.filter(d => /^r[lt]-e\d{4}-/.test(d.id)).forEach(d => {
      const all = examDocs.find(e => e.id === `${READING_PARTS[d.data.part]}-all`);
      if (all) all.data.questionIds.push(d.id);
      d.data.topics.forEach(tp => {
        const ex = examDocs.find(e => e.id === `topic-${tp}`);
        if (ex) ex.data.questionIds.push(d.id);
      });
    });
  }
  examDocs.push(...buildMockDocs(questions, examDocs));
  examDocs.push({
    id: 'trial',
    data: { kind: 'trial', questionIds: trialIds, passageIds: trialPassageIds, title: { vi: 'Làm thử', en: 'Free trial' }, order: 2000 }
  });

  return { questionDocs, answerDocs, examDocs, passageDocs, errors };
}

/*
 * Câu Writing lấy thêm từ đề thật 2023–2026 và Stemhouse: scripts/source/writing-extra*.js (chỉ để trên máy).
 * Mỗi file push thêm câu vào window.WRITING_QUESTIONS (cùng định dạng data.js, src là object nguồn mới) và có thể
 * gắn thêm nguồn cho câu đã có (câu trùng): window.WRITING_EXTRA_SRC = { w06: [{ kind: 'exam', year: 2026 }] }.
 */
function writingExtraFiles() {
  const dir = path.join(__dirname, 'source');
  return fs.readdirSync(dir).filter(f => /^writing-extra.*\.js$/.test(f)).sort().map(f => path.join(dir, f));
}

function addWritingSources(questions, extra) {
  Object.entries(extra || {}).forEach(([id, srcs]) => {
    const q = questions.find(x => x.id === id);
    if (!q) throw new Error(`WRITING_EXTRA_SRC: unknown question ${id}`);
    q.src = q.src.filter(s => s !== 'gen').concat(srcs);
  });
}

/*
 * Thi thử (Mock Test): mỗi đề thật (2022–2026) và mỗi đề Stemhouse thành một đề đủ 3 phần —
 * Listening (chưa có file nghe, chỉ ghi số câu), Reading (các bài Read a passage của đề đó),
 * Writing (các câu có nguồn là đề đó, trừ câu ví dụ `example: true`).
 * 'mock-random': đề ghép ngẫu nhiên ở trình duyệt (1 thư + 1 đoạn văn + 2 câu Writing của sách 8020).
 * Điểm theo đúng bảng điểm trong đáp án của từng đề (MOCK_POINTS): mỗi câu Reading / Writing một mức điểm,
 * cộng các phần app chưa có (Listening, câu sắp xếp từ của Stemhouse) — tổng điểm đề vì vậy khác nhau (20, 22, 30…).
 */
const MOCK_POINTS = {
  'exam-2022': { listening: 8, reading: [2, 2, 2, 2, 3, 3], writing: [4, 4] },
  'exam-2023': { listening: 8, reading: [2, 2, 2, 2, 3, 3], writing: [4, 4] },
  'exam-2024': { listening: 10, reading: [1, 1, 2, 2, 2, 2], writing: [5, 5] },
  'exam-2025': { listening: 8, reading: [1, 1, 1, 1, 1, 1, 1, 1], writing: [2, 2] },
  'exam-2026': { listening: 6, reading: [1, 1, 1, 1, 1, 1, 1, 1], writing: [3, 3] },
  // Stemhouse: Listening 8; Reading 2 điểm/câu (đề 8: 3,3,3,3,2,2); Writing đề 1, 3: 2 câu × 3 điểm,
  // các đề còn lại: Task 1 sắp xếp từ 2 điểm (app chưa có) + Task 2: 2 câu × 2 điểm.
  sh: test => ({
    listening: 8,
    reading: test === 8 ? [3, 3, 3, 3, 2, 2] : null, readingEach: 2,
    writing: [1, 3].includes(test) ? [3, 3] : [2, 2],
    rearrange: [1, 3].includes(test) ? 0 : 2
  })
};

function mockPoints(src, readingIds, writingIds) {
  const scheme = src.kind === 'exam' ? MOCK_POINTS[`exam-${src.year}`] : MOCK_POINTS.sh(src.test);
  if (!scheme) throw new Error(`No point scheme for ${JSON.stringify(src)}`);
  const perQ = (ids, list, each) => Object.fromEntries(ids.map((id, i) => [id, list ? list[i] : each]));
  const reading = perQ(readingIds, scheme.reading, scheme.readingEach);
  const writing = perQ(writingIds, scheme.writing, null);
  const missing = [{ part: 'listening', pts: scheme.listening }].concat(scheme.rearrange ? [{ part: 'rearrange', pts: scheme.rearrange }] : []);
  if (Object.values(reading).concat(Object.values(writing)).some(v => typeof v !== 'number')) {
    throw new Error(`Point scheme of ${JSON.stringify(src)} does not fit its questions`);
  }
  const sum = o => Object.values(o).reduce((a, b) => a + b, 0);
  return { reading, writing, missing, total: sum(reading) + sum(writing) + missing.reduce((a, m) => a + m.pts, 0) };
}
function buildMockDocs(questions, examDocs) {
  const docs = [];
  examDocs.filter(e => e.data.part === 'passage' && e.data.kind === 'test' && ['exam', 'sh'].includes(e.data.group)).forEach(e => {
    const src = e.data.src;
    const same = s => s && typeof s === 'object' && !Array.isArray(s) && s.kind === src.kind && (src.kind === 'exam' ? s.year === src.year : s.test === src.test);
    const writingIds = questions.filter(q => !q.example && q.src.some(same)).map(q => q.id);
    const id = src.kind === 'exam' ? `mock-e${src.year}` : `mock-sh${pad(src.test)}`;
    docs.push({
      id,
      data: {
        kind: 'mock', group: src.kind, src, title: sourceTitle(src), listening: 4,
        passageIds: e.data.passageIds, readingIds: e.data.questionIds, writingIds,
        points: mockPoints(src, e.data.questionIds, writingIds),
        questionIds: e.data.questionIds.concat(writingIds),
        order: 6000 + SOURCE_GROUPS[src.kind] * 100 + (src.kind === 'exam' ? src.year - 2000 : src.test)
      }
    });
  });
  docs.push({
    id: 'mock-random',
    data: { kind: 'mock', group: 'random', title: { vi: 'Đề ngẫu nhiên từ sách 8020', en: 'Random test from the 8020 books' }, listening: 4, passageIds: [], readingIds: [], writingIds: [], questionIds: [], order: 6900 }
  });
  return docs;
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
  const bankDir = path.join(__dirname, 'source', 'passages');
  const extraFiles = writingExtraFiles();
  const bankFiles = fs.existsSync(bankDir) ? fs.readdirSync(bankDir).filter(f => f.endsWith('.js')).sort().map(f => path.join(bankDir, f)) : [];
  const win = loadBrowserGlobals([args.source].concat(extraFiles, [path.join(ROOT, 'public', 'js', 'lessons.js'), path.join(ROOT, 'public', 'js', 'lessons-reading.js')],
    hasReading ? [args.reading] : [], bankFiles));
  const questions = win.WRITING_QUESTIONS;
  const lessons = win.LESSONS;
  if (!Array.isArray(questions) || !questions.length) throw new Error('WRITING_QUESTIONS not found in ' + args.source);
  addWritingSources(questions, win.WRITING_EXTRA_SRC);
  if (!hasReading) console.warn(`No reading bank at ${path.relative(ROOT, args.reading)} — seeding Writing only.`);
  const bank = win.READING_PASSAGE_BANK || [];
  const reading = hasReading || bank.length ? { passages: win.READING_PASSAGES || [], bank, lessons: win.READING_LESSONS } : null;

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

module.exports = { buildDocs, buildReadingDocs, buildPassageDocs, loadBrowserGlobals, writingExtraFiles, addWritingSources, EXAM_ORDER };
