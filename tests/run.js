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
    assert.ok(Array.isArray(data.source) && data.source.length, id);
    assert.ok(data.source.every(s => (s.gen === true && Object.keys(s).length === 1) || (typeof s.book === 'number' && typeof s.test === 'number')), id);
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

test('time adverbials and if/when/while/before clauses may go first or last', () => {
  [
    ['w67', 'At 8 p.m. yesterday, I was doing my homework.', 'I was doing my homework at 8 p.m. yesterday.'],
    ['w09', 'The boys are playing football in the back yard at the moment.', 'At the moment, the boys are playing football in the back yard.'],
    ['w129', 'If you study hard, you will pass the exam.', 'You will pass the exam if you study hard.'],
    ['w74', 'When I arrived at the party, everyone was dancing.', 'Everyone was dancing when I arrived at the party.'],
    ['w71', 'I was walking to school when I saw an accident.', 'When I saw an accident, I was walking to school.'],
    ['w185', "Don't talk in class while the teacher is explaining the lesson.", "While the teacher is explaining the lesson, don't talk in class."],
    ['w02', 'Children should wash their hands before meals.', 'Before meals, children should wash their hands.'],
    ['w35', 'She brushes her teeth twice a day.', 'Twice a day, she brushes her teeth.']
  ].forEach(([id, ...texts]) => texts.forEach(t => assert.ok(Grader.grade(KEYS[id], t, true).correct, `${id}: ${t}`)));
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
