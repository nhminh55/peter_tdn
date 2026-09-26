/*
 * Test logic chấm điểm chạy ở client (Grader + Scoring) với dữ liệu thật từ seed.
 * Chạy: node tests/run.js   (hoặc npm test trong scripts/)
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const Grader = require('../public/js/grader');
const Scoring = require('../public/js/scoring');
const ReadingGrader = require('../public/js/reading-grader');
const { buildDocs, buildPassageDocs, loadBrowserGlobals, writingExtraFiles, addWritingSources } = require('../scripts/seed');

const ROOT = path.resolve(__dirname, '..');
// Ngân hàng Reading (scripts/source/reading.js) chỉ có trên máy như data.js; thiếu thì bỏ qua các test Reading.
const READING_FILE = path.join(ROOT, 'scripts/source/reading.js');
const hasReading = fs.existsSync(READING_FILE);
// Bài đọc dài (Read a passage): scripts/source/passages/*.js, cũng chỉ có trên máy.
const BANK_DIR = path.join(ROOT, 'scripts/source/passages');
const bankFiles = fs.existsSync(BANK_DIR) ? fs.readdirSync(BANK_DIR).filter(f => f.endsWith('.js')).sort().map(f => path.join(BANK_DIR, f)) : [];
const hasBank = hasReading && bankFiles.length > 0;
// Câu Writing lấy thêm từ đề thật / Stemhouse (scripts/source/writing-extra*.js), như seed.js.
const win = loadBrowserGlobals([path.join(ROOT, 'scripts/source/data.js')].concat(writingExtraFiles(),
  [path.join(ROOT, 'public/js/lessons.js'), path.join(ROOT, 'public/js/lessons-reading.js')],
  hasReading ? [READING_FILE] : [], hasBank ? bankFiles : []));
addWritingSources(win.WRITING_QUESTIONS, win.WRITING_EXTRA_SRC);
const built = buildDocs(win.WRITING_QUESTIONS, win.LESSONS, win.TRIAL,
  hasReading ? { passages: win.READING_PASSAGES, bank: win.READING_PASSAGE_BANK || [], lessons: win.READING_LESSONS } : null);
const KEYS = Object.fromEntries(built.answerDocs.map(d => [d.id, d.data]));
const QUESTIONS = Object.fromEntries(built.questionDocs.map(d => [d.id, d.data]));
const isWriting = id => QUESTIONS[id].type === 'writing_cues';
const writingAnswers = built.answerDocs.filter(d => isWriting(d.id));

// Mô phỏng một chuỗi lần bấm Check như api.checkAnswer.
function answer(state, questionId, userAnswer, strict) {
  const out = Scoring.applyAnswer({
    profile: state.profile, sub: state.sub, questionId, userAnswer, strict,
    key: KEYS[questionId], grader: Grader, now: Date.now()
  });
  if (!out.duplicate) {
    state.profile = Object.assign({}, state.profile, out.stats);
    state.sub = { details: out.details, score: out.score };
  }
  return out;
}
const fresh = () => ({ profile: Object.assign({ name: '' }, Scoring.EMPTY_STATS), sub: null });

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

test('seed data has no errors', () => {
  assert.deepStrictEqual(built.errors, []);
});

test('public questions carry no answer data', () => {
  built.questionDocs.forEach(({ id, data }) => {
    if (data.type !== 'writing_cues') {
      const allowed = ['type', 'part', 'passage', 'num', 'prompt', 'options', 'maxWords', 'ideaCount', 'authored', 'topics', 'source', 'order'];
      Object.keys(data).forEach(k => assert.ok(allowed.includes(k), `${id}.${k}`));
      return;
    }
    assert.deepStrictEqual(Object.keys(data).sort(), ['cues', 'order', 'source', 'topics', 'type'], id);
    assert.ok(Array.isArray(data.source) && data.source.length, id);
    const srcOk = s => (s.gen === true && Object.keys(s).length === 1) || (typeof s.book === 'number' && typeof s.test === 'number')
      || (s.kind === 'exam' && typeof s.year === 'number') || (s.kind === 'sh' && typeof s.test === 'number') || s.kind === 'shb';
    assert.ok(data.source.every(srcOk), id);
  });
});

test('answers hold answer, accept, defs and bilingual explanation', () => {
  writingAnswers.forEach(({ id, data }) => {
    ['answer', 'accept', 'defs', 'explanation', 'cues'].forEach(k => assert.ok(k in data, `${id}.${k}`));
    assert.ok(data.explanation.vi.length && data.explanation.en.length, id);
  });
});

test('correct variant: +1 star, detail saved', () => {
  const st = fresh();
  const out = answer(st, 'w05', 'Last summer, our family visited Dalat by car.');
  assert.strictEqual(out.result.correct, true);
  assert.strictEqual(out.result.sameAsBook, false);
  assert.strictEqual(out.starsEarned, 1);
  assert.strictEqual(st.profile.stars, 1);
  assert.strictEqual(st.sub.details[0].bookAnswer, KEYS.w05.answer);
});

test('wrong answer resets the streak and marks the wrong word', () => {
  const st = fresh();
  answer(st, 'w01', KEYS.w01.answer);
  const out = answer(st, 'w15', 'She visit her grandparents twice a month.');
  assert.strictEqual(out.result.correct, false);
  assert.strictEqual(out.result.closest, 'She visits her grandparents twice a month.');
  assert.ok(out.result.userMarks.some(m => m.word === 'visit' && !m.ok));
  assert.strictEqual(st.profile.streak, 0);
  assert.strictEqual(st.sub.score, 1);
});

test('5 in a row gives +5 bonus; stars per answer never exceed the rules limit', () => {
  const st = fresh();
  let prev = 0;
  ['w01', 'w02', 'w03', 'w04', 'w05', 'w06', 'w07', 'w08', 'w09', 'w10'].forEach((id, i) => {
    const out = answer(st, id, KEYS[id].answer);
    assert.ok(st.profile.stars - prev <= Scoring.MAX_STARS_PER_ANSWER);
    prev = st.profile.stars;
    if (i === 4 || i === 9) assert.strictEqual(out.result.bonus, true);
  });
  assert.strictEqual(st.profile.stars, 20);
  assert.strictEqual(st.profile.bonusCount, 2);
  assert.strictEqual(st.profile.bestStreak, 10);
});

test('re-checking a question in the same submission adds nothing', () => {
  const st = fresh();
  answer(st, 'w01', KEYS.w01.answer);
  const out = answer(st, 'w01', 'something else');
  assert.strictEqual(out.duplicate, true);
  assert.strictEqual(out.result.userAnswer, KEYS.w01.answer);
  assert.strictEqual(st.profile.stars, 1);
  assert.strictEqual(st.sub.details.length, 1);
});

test('strict mode: content right but form wrong is not correct', () => {
  const out = answer(fresh(), 'w41', 'the Earth goes around the Sun', true);
  assert.strictEqual(out.result.contentOk, true);
  assert.strictEqual(out.result.correct, false);
  assert.deepStrictEqual(out.result.issues.map(i => i.code), ['cap', 'dot']);
});

test('step 1: more than 15 words is TOO_LONG and wrong', () => {
  const r = Grader.grade(KEYS.w01, 'Why were you late for school this morning when all of your friends were there on time?', false);
  assert.strictEqual(r.correct, false);
  assert.strictEqual(r.error, 'TOO_LONG');
  assert.ok(r.issues.some(i => i.code === 'len' && i.n > 15));
  assert.strictEqual(Grader.grade(KEYS.w01, KEYS.w01.answer, true).error, null);
});

test('step 2: normalization of numbers, a.m./p.m., contractions and sentence breaks', () => {
  assert.strictEqual(Grader.normalize('It takes me 15 minutes.'), Grader.normalize('It takes me fifteen minutes'));
  assert.strictEqual(Grader.normalize('at 8 p.m.'), Grader.normalize('at eight pm'));
  assert.strictEqual(Grader.normalize("Look! It's raining, isn't it?"), 'look it is raining is not it');
  assert.strictEqual(Grader.normalize('I am in 2020'), 'i am in 2020');
  assert.ok(Grader.grade(KEYS.w48, 'It takes me fifteen minutes to walk to school.', true).correct);
});

test('commas in patterns and answers are optional, with or without spaces', () => {
  const key = { cues: 'My sister / like / cats / but / she / not like / dogs', answer: 'My sister likes cats but she does not like dogs.',
    accept: ['My sister likes cats , but she does not like dogs'], defs: {} };
  ['My sister likes cats but she does not like dogs.', 'My sister likes cats, but she does not like dogs.',
   'My sister likes cats , but she does not like dogs.', 'My sister likes cats,but she does not like dogs.',
   'My sister likes cats ,but she doesn\'t like dogs.']
    .forEach(t => assert.ok(Grader.grade(key, t, true).correct, t));
  assert.ok(Grader.grade(KEYS.w05, 'Last summer, my family visited Da Lat by car.', true).correct);
  assert.ok(Grader.grade(KEYS.w05, 'Last summer my family visited Da Lat by car.', true).correct);
});

test('only the order of the cues is accepted: moving a phrase to the front or back is wrong', () => {
  [
    ['w09', 'The boys are playing football in the back yard at the moment.', 'At the moment, the boys are playing football in the back yard.'],
    ['w02', 'Children should wash their hands before meals.', 'Before meals, children should wash their hands.'],
    ['w35', 'She brushes her teeth twice a day.', 'Twice a day, she brushes her teeth.'],
    ['w05', 'Last summer my family visited Da Lat by car.', 'My family visited Da Lat by car last summer.'],
    ['w67', 'At 8 p.m. yesterday, I was doing my homework.', 'I was doing my homework at 8 p.m. yesterday.'],
    ['w129', 'If you study hard, you will pass the exam.', 'You will pass the exam if you study hard.'],
    ['w74', 'When I arrived at the party, everyone was dancing.', 'Everyone was dancing when I arrived at the party.'],
    ['w71', 'I was walking to school when I saw an accident.', 'When I saw an accident, I was walking to school.'],
    ['w185', "Don't talk in class while the teacher is explaining the lesson.", "While the teacher is explaining the lesson, don't talk in class."],
    ['w157', 'There is no water in the bottle.', 'In the bottle, there is no water.']
  ].forEach(([id, inOrder, swapped]) => {
    assert.ok(Grader.grade(KEYS[id], inOrder, true).correct, `${id}: ${inOrder}`);
    assert.strictEqual(Grader.grade(KEYS[id], swapped, true).correct, false, `${id}: ${swapped}`);
  });
});

test('suggested variants keep the order of the cues', () => {
  const vs = Grader.sampleVariants(KEYS.w23, '', 10);
  assert.ok(!vs.some(v => /now in my town|^Now/.test(v)), JSON.stringify(vs));
  assert.ok(!Grader.sampleVariants(KEYS.w05, '', 10).some(v => /^My family|^Our family/.test(v)));
});

test('allowed additions: possessive before a noun, "very" before an adjective', () => {
  [
    ['w04', 'My grandfather is watering his flowers at the moment.'],
    ['w28', 'Minh is very good at playing chess.'],
    ['w52', 'People in my village are very friendly and helpful.'],
    ['w65', 'The students were cleaning their classroom when their teacher came.']
  ].forEach(([id, text]) => assert.ok(Grader.grade(KEYS[id], text, true).correct, text));
  // sai tính từ sở hữu vẫn sai
  assert.strictEqual(Grader.grade(KEYS.w15, 'She visits his grandparents twice a month.', true).correct, false);
  // possessives: chủ ngữ quyết định chủ sở hữu — nhận mạo từ, không nhận sai giống
  ['Nam was reading a comic book in the room at 3 p.m. yesterday.', 'Nam was reading a comic book in his room at 3 p.m. yesterday.']
    .forEach(text => assert.ok(Grader.grade(KEYS.w81, text, true).correct, text));
  ['her', 'my', 'their'].forEach(p => assert.strictEqual(
    Grader.grade(KEYS.w81, `Nam was reading a comic book in ${p} room at 3 p.m. yesterday.`, true).correct, false, p));
});

test('invented time / frequency words are wrong and reported as extra', () => {
  [
    ['w15', 'She usually visits her grandparents twice a month.', 'usually'],
    ['w03', 'Could you please show me the way to the post office?', 'please'],
    ['w14', 'My brother is the tallest student in his class every year.', 'every']
  ].forEach(([id, text, word]) => {
    const r = Grader.grade(KEYS[id], text, false);
    assert.strictEqual(r.correct, false, text);
    assert.ok(r.diff.extra.includes(word), text + ' → ' + JSON.stringify(r.diff));
  });
});

test('step 4: diff sorts differences into missing / wrong / extra', () => {
  const d = Grader.grade(KEYS.w30, 'They watch interesting film on TV last night.', false).diff;
  assert.deepStrictEqual(d.wrong, [{ got: 'watch', want: 'watched' }]);
  assert.deepStrictEqual(d.missing, ['an']);
  assert.deepStrictEqual(d.extra, []);
});

test('present continuous without a "now" cue is wrong', () => {
  assert.strictEqual(Grader.grade(KEYS.w24, 'We are collecting old books to give to poor children.', false).correct, false);
});

test('no accept pattern allows meaning words that are not in the cues', () => {
  const BANNED = ['usually', 'always', 'often', 'really', 'please', 'right', 'about', 'some', 'any', 'again', 'only'];
  writingAnswers.forEach(({ id, data }) => {
    const cues = Grader.normalize(data.cues).split(' ');
    const words = new Set([data.answer].concat(Grader.compile(data).variants).flatMap(v => Grader.normalize(v).split(' ')));
    // allowWords: đáp án chính thức cho phép thêm từ đó (vd. "(some) new clothes" của đề 2025).
    const allow = (win.WRITING_QUESTIONS.find(q => q.id === id) || {}).allowWords || [];
    const fromCue = w => cues.some(c => c.length >= 4 && w.startsWith(c));   // usual → usually
    BANNED.forEach(w => assert.ok(!words.has(w) || cues.includes(w) || fromCue(w) || allow.includes(w), `${id}: "${w}"`));
  });
});

test('every accepted variant keeps the cue words in the order of the book answer', () => {
  writingAnswers.forEach(({ id, data }) => {
    Grader.compile(data).variants.forEach(v => assert.ok(Grader.cueOrderOk(v, data), `${id}: ${v}`));
  });
});

test('a wrong answer is always compared with the book answer, not another accepted sentence', () => {
  writingAnswers.slice(0, 60).forEach(({ id, data }) => {
    const r = Grader.grade(data, 'This is wrong.', false);
    assert.strictEqual(r.closest, data.answer, id);
  });
});

test('swapping the cue words is wrong even when every word is right', () => {
  if (!KEYS.w202) return;
  assert.ok(Grader.grade(KEYS.w202, "Katie's teacher of English is very nice and kind.", true).correct);
  assert.ok(!Grader.grade(KEYS.w202, "Katie's English teacher is very nice and kind.", true).correct);
  assert.ok(!Grader.grade(KEYS.w205, 'I would like to apologize to you for not returning the dictionary.', true).correct);
});

test('qstats records when each question was last answered', () => {
  const st = fresh();
  answer(st, 'w01', KEYS.w01.answer);
  assert.ok(st.profile.qstats.w01.at > 0);
});

test('daily practice: wrong answers first (up to half), then new, then least recently reviewed', () => {
  let seed = 1;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const ids = Array.from({ length: 30 }, (_, i) => 'q' + i);
  const qstats = {
    q0: { a: 1, c: 0, last: false, at: 300 }, q1: { a: 2, c: 1, last: false, at: 100 },
    q2: { a: 1, c: 0, last: false, at: 200 }, q3: { a: 1, c: 1, last: true, at: 50 }
  };
  ids.slice(4, 25).forEach((id, i) => { qstats[id] = { a: 1, c: 1, last: true, at: 1000 + i }; });
  // q25–q29 chưa làm
  const pick = Scoring.pickDaily({ questionIds: ids, qstats, n: 10, rand });
  assert.strictEqual(pick.length, 10);
  assert.strictEqual(new Set(pick).size, 10);
  ['q0', 'q1', 'q2'].forEach(id => assert.ok(pick.includes(id), id));        // cả 3 câu sai (≤ 5)
  ['q25', 'q26', 'q27', 'q28', 'q29'].forEach(id => assert.ok(pick.includes(id), id)); // câu chưa làm
  assert.ok(pick.includes('q3') && pick.includes('q4'));                   // rồi câu lâu chưa ôn nhất
  // Nhiều câu sai: chỉ chiếm một nửa lượt
  const many = Object.fromEntries(ids.map(id => [id, { a: 1, c: 0, last: false, at: 1 }]));
  ids.slice(20).forEach(id => { delete many[id]; });
  const p2 = Scoring.pickDaily({ questionIds: ids, qstats: many, n: 10, rand });
  assert.strictEqual(p2.filter(id => many[id]).length, 5);
  // Không lặp lại câu đã giao hôm nay; ngân hàng nhỏ hơn n
  const p3 = Scoring.pickDaily({ questionIds: ids.slice(0, 6), qstats, n: 10, exclude: ['q0', 'q1'], rand });
  assert.deepStrictEqual(p3.slice().sort(), ['q2', 'q3', 'q4', 'q5']);
});

test('every exam references existing questions', () => {
  built.examDocs.forEach(({ id, data }) => data.questionIds.forEach(q => assert.ok(QUESTIONS[q], `${id}: ${q}`)));
});

test('every book answer and generated variant is accepted', () => {
  writingAnswers.forEach(({ id, data }) => {
    assert.ok(Grader.grade(data, data.answer, true).correct, id);
    Grader.compile(data).variants.forEach(v => assert.ok(Grader.grade(data, v, true).correct, `${id}: ${v}`));
  });
});

test('trial exam: TRIAL.questions questions from the first TRIAL.lessons lessons', () => {
  const trial = built.examDocs.find(e => e.id === 'trial');
  assert.ok(trial, 'exams/trial');
  const writing = trial.data.questionIds.filter(isWriting);
  assert.strictEqual(writing.length, win.TRIAL.questions);
  const topics = win.LESSONS.slice(0, win.TRIAL.lessons).map(l => l.id);
  writing.forEach(id => assert.ok(QUESTIONS[id].topics.some(t => topics.includes(t)), id));
});

/* ---------- Reading ---------- */

const readingTest = (name, fn) => test(name, () => { if (hasReading) fn(); else console.log('    (skipped: no scripts/source/reading.js)'); });
// Câu của 2 phần theo sách 8020 (thư, đoạn văn); bài đọc dài có test riêng bên dưới.
const readingIds = () => built.questionDocs.filter(d => d.data.type !== 'writing_cues' && d.data.part !== 'passage').map(d => d.id);

readingTest('reading bank: 60 letters and 60 texts, 4 questions each, answers only in answers/', () => {
  const bookPassages = built.passageDocs.filter(d => d.data.part !== 'passage');
  const parts = bookPassages.map(d => d.data.part);
  assert.strictEqual(parts.filter(p => p === 'letter').length, 60);
  assert.strictEqual(parts.filter(p => p === 'text').length, 60);
  bookPassages.forEach(({ id, data }) => {
    assert.strictEqual(data.questionIds.length, 4, id);
    assert.ok(!('answer' in data) && !('questions' in data), id);
    data.questionIds.forEach(q => assert.strictEqual(QUESTIONS[q].passage, id, q));
  });
  readingIds().forEach(id => {
    const key = KEYS[id];
    assert.strictEqual(key.choice, true, id);
    assert.ok(key.explanation.vi.length && key.explanation.vi.length === key.explanation.en.length, id);
    assert.ok(key.evidence.length, id);
  });
});

readingTest('reading: letters ask True/False then A/B/C; texts ask A/B/C for each blank', () => {
  readingIds().forEach(id => {
    const q = QUESTIONS[id];
    if (q.part === 'letter') {
      assert.strictEqual(q.type, q.num <= 2 ? 'reading_tf' : 'reading_mc', id);
      assert.ok(q.prompt, id);
    } else {
      assert.strictEqual(q.type, 'reading_mc', id);
      assert.ok(q.num >= 5 && q.num <= 8, id);
    }
    if (q.type === 'reading_mc') assert.strictEqual(q.options.length, 3, id);
  });
});

readingTest('reading: choice answers are marked case-insensitively and share stars and streak', () => {
  const st = fresh();
  const tf = 'rl-b1-t01-1', mc = 'rl-b1-t01-3', gap = 'rt-b1-t01-5';
  let out = answer(st, tf, KEYS[tf].answer.toLowerCase());
  assert.strictEqual(out.result.correct, true);
  assert.deepStrictEqual(out.result.evidence, KEYS[tf].evidence);
  out = answer(st, mc, KEYS[mc].answer);
  assert.strictEqual(out.result.correct, true);
  assert.strictEqual(st.profile.stars, 2);
  assert.strictEqual(st.profile.streak, 2);
  const wrong = ['A', 'B', 'C'].find(c => c !== KEYS[gap].answer);
  out = answer(st, gap, wrong);
  assert.strictEqual(out.result.correct, false);
  assert.strictEqual(out.result.answer, KEYS[gap].answer);
  assert.strictEqual(st.profile.streak, 0);
  assert.strictEqual(st.sub.details.length, 3);
  assert.strictEqual(st.profile.qstats[gap].last, false);
});

readingTest('reading: exams per test, per part and per question type', () => {
  ['rl-b1-t01', 'rt-b2-t30', 'rl-all', 'rt-all'].forEach(id => assert.ok(built.examDocs.some(e => e.id === id), id));
  const all = built.examDocs.find(e => e.id === 'rl-all');
  assert.strictEqual(all.data.questionIds.length, 240);
  assert.ok(all.data.questionIds.every(id => QUESTIONS[id].part === 'letter'));
  Object.entries(win.READING_LESSONS).filter(([part]) => part !== 'passage').flatMap(([, ls]) => ls).forEach(l => {
    const n = readingIds().filter(id => QUESTIONS[id].topics.includes(l.id)).length;
    assert.strictEqual(Boolean(built.examDocs.find(e => e.id === 'topic-' + l.id)), n > 0, l.id);
  });
});

readingTest('trial exam: the first passage of each reading part', () => {
  const trial = built.examDocs.find(e => e.id === 'trial').data;
  const passages = ['rl-b1-t01', 'rt-b1-t01'].concat(hasBank ? ['rp-e2023'] : []);
  assert.deepStrictEqual(Array.from(trial.passageIds), passages);
  const reading = Array.from(trial.questionIds).filter(id => !isWriting(id));   // mảng từ sandbox vm: đưa về Array thường
  const expected = ['rl-b1-t01', 'rt-b1-t01'].flatMap(p => [1, 2, 3, 4].map(n => `${p}-${p[1] === 'l' ? n : n + 4}`))
    .concat(hasBank ? [1, 2, 3, 4, 5, 6].map(n => `rp-e2023-${n}`) : []);
  assert.deepStrictEqual(reading, expected);
});

/* ---------- Read a passage: câu tự gõ ---------- */

test('find the word: exact word only; extra words, another form or a misspelling are wrong', () => {
  const key = { kind: 'word', answers: ['priority'], maxWords: 1 };
  const g = a => ReadingGrader.grade(key, a);
  assert.ok(g('priority').correct);
  assert.ok(g(' Priority. ').correct, 'case and punctuation do not matter');
  assert.deepStrictEqual(g('a priority').issues.map(i => i.code), ['extra']);
  assert.deepStrictEqual(g('priorities').issues.map(i => i.code), ['form']);
  assert.deepStrictEqual(g('prioity').issues.map(i => i.code), ['spelling']);
  assert.ok(!g('sleep').correct);
  const two = { kind: 'word', answers: ['washbag', 'wash bag'], maxWords: 2 };
  assert.ok(ReadingGrader.grade(two, 'wash bag').correct);
  assert.deepStrictEqual(ReadingGrader.grade(two, 'a washbag').issues.map(i => i.code), ['extra']);
});

test('open questions: every idea needed, any wording of an idea counts', () => {
  const key = {
    kind: 'open', answer: 'They help monitor our health, alert us to problems and give useful advice.',
    ideas: [{ any: ['monitor* health'] }, { any: ['alert*', 'warn*'] }, { any: ['advice', 'advise*'] }]
  };
  assert.ok(ReadingGrader.grade(key, 'They monitor our health, warn us about problems and give advice').correct);
  const part = ReadingGrader.grade(key, 'They monitor our health.');
  assert.ok(!part.correct);
  assert.deepStrictEqual(part.ideas, [true, false, false]);
  assert.deepStrictEqual(part.issues.map(i => i.code), ['ideas_some']);
  const one = Object.assign({}, key, { need: 1 });
  assert.ok(ReadingGrader.grade(one, 'They monitor our health.').correct);
  const limited = Object.assign({}, key, { maxWords: 5 });
  assert.strictEqual(ReadingGrader.grade(limited, 'They monitor our health, warn us about problems and give advice').error, 'TOO_LONG');
});

test('typed reading answers go through ReadingGrader and earn stars like other questions', () => {
  const out = Scoring.applyAnswer({
    profile: Scoring.EMPTY_STATS, sub: null, questionId: 'x-1', userAnswer: 'escape',
    key: { kind: 'word', answer: 'escape', answers: ['escape'], explanation: { vi: [], en: [] } }, grader: Grader, now: 1
  });
  assert.ok(out.result.correct);
  assert.strictEqual(out.starsEarned, 1);
  assert.strictEqual(out.details[0].bookAnswer, 'escape');
});

test('passage bank validation catches broken keys', () => {
  const lessons = [{ id: 'passage-word' }, { id: 'passage-open' }];
  const bad = [{
    id: 'rp-x', src: { kind: 'sh', test: 1 }, title: 'X', paragraphs: ['Cats like to sleep.'],
    questions: [
      { num: 1, type: 'word', prompt: 'Find one word', answers: ['dogs'], topics: ['passage-word'], vi: ['a'], en: ['a'] },
      { num: 2, type: 'open', prompt: 'Why?', answer: 'Because.', ideas: [{ any: ['sleep'], vi: 'ngủ', en: 'sleep' }], topics: ['passage-open'], vi: ['a'], en: ['a'] }
    ]
  }];
  const errors = buildPassageDocs(bad, lessons, { passages: 0 }, 0).errors.join('\n');
  assert.ok(/rp-x-1: answer not found in passage/.test(errors), errors);
  assert.ok(/rp-x-2: sample answer fails its own ideas/.test(errors), errors);
});

const bankTest = (name, fn) => test(name, () => { if (hasBank) fn(); });

bankTest('passage bank: every exam groups its passages, open keys accept their sample answers', () => {
  const exams = built.examDocs.filter(e => e.data.part === 'passage' && e.data.kind === 'test');
  assert.ok(exams.length >= 20, 'expected the real exams and the Stemhouse tests');
  exams.forEach(e => e.data.questionIds.forEach(id => assert.ok(QUESTIONS[id], `${e.id}: ${id} missing`)));
  built.answerDocs.filter(d => d.data.kind).forEach(d => {
    assert.ok(ReadingGrader.grade(d.data, d.data.answer).correct, `${d.id}: key rejects its own answer`);
  });
  assert.deepStrictEqual(Array.from(built.examDocs.find(e => e.id === 'rp-e2025').data.passageIds), ['rp-e2025a', 'rp-e2025b']);
});

let failed = 0;
for (const t of tests) {
  try { t.fn(); console.log('  ✓ ' + t.name); }
  catch (e) { failed++; console.log('  ✗ ' + t.name + '\n    ' + e.message); }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
