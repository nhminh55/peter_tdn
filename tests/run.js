/*
 * Test logic chấm điểm chạy ở client (Grader + Scoring) với dữ liệu thật từ seed.
 * Chạy: node tests/run.js   (hoặc npm test trong scripts/)
 */
'use strict';

const assert = require('assert');
const path = require('path');
const Grader = require('../public/js/grader');
const Scoring = require('../public/js/scoring');
const { buildDocs, loadBrowserGlobals } = require('../scripts/seed');

const ROOT = path.resolve(__dirname, '..');
const win = loadBrowserGlobals([path.join(ROOT, 'scripts/source/data.js'), path.join(ROOT, 'public/js/lessons.js')]);
const built = buildDocs(win.WRITING_QUESTIONS, win.LESSONS, win.TRIAL);
const KEYS = Object.fromEntries(built.answerDocs.map(d => [d.id, d.data]));
const QUESTIONS = Object.fromEntries(built.questionDocs.map(d => [d.id, d.data]));

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

test('public questions carry no answer data', () => {
  built.questionDocs.forEach(({ id, data }) => {
    assert.deepStrictEqual(Object.keys(data).sort(), ['cues', 'order', 'source', 'topics', 'type'], id);
    assert.ok(Array.isArray(data.source) && data.source.every(s => typeof s.book === 'number' && typeof s.test === 'number'), id);
  });
});

test('answers hold answer, accept, defs and bilingual explanation', () => {
  built.answerDocs.forEach(({ id, data }) => {
    ['answer', 'accept', 'defs', 'explanation', 'cues'].forEach(k => assert.ok(k in data, `${id}.${k}`));
    assert.ok(data.explanation.vi.length && data.explanation.en.length, id);
  });
});

test('correct variant: +1 star, detail saved', () => {
  const st = fresh();
  const out = answer(st, 'w05', 'My family visited Dalat by car last summer.');
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

test('adding meaning words outside the cues is wrong and reported as extra', () => {
  [
    ['w15', 'She usually visits her grandparents twice a month.', ['usually']],
    ['w28', 'Minh is very good at playing chess.', ['very']],
    ['w03', 'Could you please show me the way to the post office?', ['please']],
    ['w04', 'My grandfather is watering his flowers at the moment.', null]
  ].forEach(([id, text, extra]) => {
    const r = Grader.grade(KEYS[id], text, false);
    assert.strictEqual(r.correct, false, text);
    if (extra) assert.deepStrictEqual(r.extra, extra, text);
  });
  assert.deepStrictEqual(Grader.grade(KEYS.w15, KEYS.w15.answer, true).extra, []);
});

test('present continuous without a "now" cue is wrong', () => {
  assert.strictEqual(Grader.grade(KEYS.w24, 'We are collecting old books to give to poor children.', false).correct, false);
});

test('no accept pattern allows meaning words that are not in the cues', () => {
  const BANNED = ['usually', 'always', 'often', 'very', 'really', 'please', 'right', 'about', 'some', 'any', 'again', 'only'];
  built.answerDocs.forEach(({ id, data }) => {
    const cues = Grader.normalize(data.cues).split(' ');
    const words = new Set([data.answer].concat(Grader.compile(data).variants).flatMap(v => Grader.normalize(v).split(' ')));
    BANNED.forEach(w => assert.ok(!words.has(w) || cues.includes(w), `${id}: "${w}"`));
  });
});

test('every exam references existing questions', () => {
  built.examDocs.forEach(({ id, data }) => data.questionIds.forEach(q => assert.ok(QUESTIONS[q], `${id}: ${q}`)));
});

test('every book answer and generated variant is accepted', () => {
  built.answerDocs.forEach(({ id, data }) => {
    assert.ok(Grader.grade(data, data.answer, true).correct, id);
    Grader.compile(data).variants.forEach(v => assert.ok(Grader.grade(data, v, true).correct, `${id}: ${v}`));
  });
});

test('trial exam: TRIAL.questions questions from the first TRIAL.lessons lessons', () => {
  const trial = built.examDocs.find(e => e.id === 'trial');
  assert.ok(trial, 'exams/trial');
  assert.strictEqual(trial.data.questionIds.length, win.TRIAL.questions);
  const topics = win.LESSONS.slice(0, win.TRIAL.lessons).map(l => l.id);
  trial.data.questionIds.forEach(id => assert.ok(QUESTIONS[id].topics.some(t => topics.includes(t)), id));
});

let failed = 0;
for (const t of tests) {
  try { t.fn(); console.log('  ✓ ' + t.name); }
  catch (e) { failed++; console.log('  ✗ ' + t.name + '\n    ' + e.message); }
}
console.log(`\n${tests.length - failed}/${tests.length} passed`);
process.exit(failed ? 1 : 0);
