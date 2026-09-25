/*
 * Giao diện app luyện thi (gói Spark, không có Cloud Functions). Đề bài (cues) lấy từ
 * Firestore `questions`; khi bấm Check mới lấy đáp án của đúng câu đó từ `answers`,
 * chấm bằng Grader rồi lưu vào `submissions` (xem api.checkAnswer).
 * localStorage chỉ giữ cài đặt giao diện và lượt đang làm dở.
 *
 * Khách chưa đăng nhập được dùng thử (guest): xem TRIAL.lessons bài học đầu và làm các câu
 * trong exams/trial. Kết quả của khách chỉ lưu ở localStorage (local.guestProfile).
 */
import * as api from './api.js';

const LESSONS = window.LESSONS;
const TRIAL = window.TRIAL;
const { STREAK_BONUS_EVERY, STREAK_BONUS_STARS } = window.Scoring;
const MAX_WORDS = 15;

let QUESTIONS = [];   // [{ id, cues, topics, source: [{book, test}] }] — không có đáp án
let Q_BY_ID = {};
let EXAMS = {};       // examId -> { questionIds, kind, ... }
let profile = Object.assign({}, api.PROFILE_DEFAULTS);   // thống kê trong users/{uid}
let user = null;      // tài khoản Firebase đang đăng nhập
let guest = false;    // đang dùng thử, không đăng nhập

/* ---------- Trạng thái cục bộ (localStorage) ---------- */

const STORAGE_KEY = 'tdn-english-v2';

function localDefaults() {
  return { settings: { strict: false, order: 'random', lang: 'vi', guest: false }, session: null, guestProfile: null };
}

let storageOk = true;
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return localDefaults();
    const data = JSON.parse(raw);
    return {
      settings: Object.assign(localDefaults().settings, data.settings),
      session: data.session || null,
      guestProfile: data.guestProfile || null
    };
  } catch (e) {
    storageOk = false;
    return localDefaults();
  }
}
const local = loadLocal();
function saveLocal() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(local)); storageOk = true; }
  catch (e) { storageOk = false; }
}

/* ---------- Ngôn ngữ ---------- */

const lang = () => (local.settings.lang === 'en' ? 'en' : 'vi');
function t(key, params) {
  const dict = window.I18N[lang()];
  let s = key in dict ? dict[key] : window.I18N.vi[key];
  if (s === undefined) return key;
  if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m));
  return s;
}
const lessonText = l => (lang() === 'en' && window.LESSONS_EN[l.id]) || l;
const lessonById = id => LESSONS.find(l => l.id === id);
const lessonLocked = idx => guest && idx >= TRIAL.lessons;
const sessionOwner = () => (user ? user.uid : 'guest');
const topicTitle = id => { const l = lessonById(id); return l ? lessonText(l).title : id; };

const FLAG_VN = '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#DA251D"/><polygon fill="#FFFF00" points="15,4 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15"/></svg>';
const FLAG_EN = '<svg viewBox="0 0 60 30" aria-hidden="true"><clipPath id="uk-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="uk-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#uk-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>';

function setLang(l) {
  if (l === lang()) return;
  local.settings.lang = l;
  saveLocal();
  if (ready) route();
  else if (!user && $('#login-form')) viewLogin();
  else renderHeader();
}
let ready = false;   // true khi đã đăng nhập và tải xong đề

/* ---------- Tiện ích ---------- */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = (c, a) => a ? Math.round(c * 100 / a) : 0;
const countWords = text => String(text).trim().split(/\s+/).filter(w => /[\wÀ-ỹ]/.test(w)).length;
const sourceLabel = source => source.map(s => t('src_item', { b: s.book, d: s.test })).join(' | ');
const questionsForTopic = id => QUESTIONS.filter(q => q.topics.includes(id));
const qstat = id => (profile.qstats || {})[id];
const wrongIds = () => QUESTIONS.filter(q => qstat(q.id) && qstat(q.id).last === false).map(q => q.id);
const cuesHtml = cues => cues.replace(/\s*\/\/\s*$/, '').split('/').map(c => `<span class="cue">${esc(c.trim())}</span>`).join('<span class="slash">/</span>');
const examKey = (b, d) => `b${b}-t${String(d).padStart(2, '0')}`;

function totals() {
  const mastered = QUESTIONS.filter(q => qstat(q.id) && qstat(q.id).c > 0).length;
  return { answered: profile.totalAnswered || 0, correct: profile.totalCorrect || 0, mastered };
}

function sessionLabel(s) {
  const k = s.kind || {};
  if (k.mode === 'topic') return t('label_topic', { t: topicTitle(k.value) });
  if (k.mode === 'exam') { const [b, d] = k.value.split('-'); return t('exam', { b, d }); }
  if (k.mode === 'wrong') return t('label_wrong');
  if (k.mode === 'retry') return t('label_retry');
  return t('label_all');
}

/* ---------- Khung trang ---------- */

function renderHeader() {
  const route = location.hash || '#/';
  const inside = user || guest;
  const active = p => route === p || (p !== '#/' && route.startsWith(p)) ? ' class="active"' : '';
  document.documentElement.lang = t('html_lang');
  document.title = t('doc_title');
  $('#header').innerHTML = `
    <a class="brand" href="#/"><span class="brand-mark">TĐN</span><span class="brand-text">${t('brand_title')}<small>${t('brand_sub')}</small></span></a>
    ${inside ? `<nav class="nav">
      <a href="#/"${active('#/')}>${t('nav_home')}</a>
      <a href="#/writing"${active('#/writing')}>${t('nav_writing')}</a>
      ${guest ? '' : `<a href="#/results"${active('#/results')}>${t('nav_results')}</a>`}
    </nav>` : '<span class="nav"></span>'}
    <div class="lang" role="group" aria-label="${t('lang_switch')}">
      <button type="button" class="flag ${lang() === 'vi' ? 'on' : ''}" data-lang="vi" title="${t('lang_vi')}" aria-label="${t('lang_vi')}" aria-pressed="${lang() === 'vi'}">${FLAG_VN}</button>
      <button type="button" class="flag ${lang() === 'en' ? 'on' : ''}" data-lang="en" title="${t('lang_en')}" aria-label="${t('lang_en')}" aria-pressed="${lang() === 'en'}">${FLAG_EN}</button>
    </div>
    ${guest ? `
    <span class="star-pill" title="${t('stars_title')}">
      <span class="star-icon">★</span><b id="star-total">${profile.stars}</b>
    </span>
    <button type="button" class="logout" data-login>
      <span class="logout-name">${t('guest_name')}</span><span class="logout-label">${t('login_btn')}</span>
    </button>` : ''}
    ${user ? `
    <a class="star-pill" href="#/results" title="${t('stars_title')}">
      <span class="star-icon">★</span><b id="star-total">${profile.stars}</b>
    </a>
    <button type="button" class="logout" id="logout" title="${esc(profile.username || user.email || '')}">
      <span class="logout-name">${esc(profile.name || profile.username || user.email || '')}</span><span class="logout-label">${t('logout')}</span>
    </button>` : ''}`;
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  const out = $('#logout');
  if (out) out.addEventListener('click', doLogout);
  $('#footer').textContent = t('footer');
}

function page(html) {
  $('#app').innerHTML = html + (storageOk ? '' : `<p class="storage-warn">${t('storage_warn')}</p>`);
  window.scrollTo(0, 0);
}

function crumbs(items) {
  return `<div class="crumbs">${items.map(([label, href]) => href ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`).join('<span class="sep">›</span>')}</div>`;
}

/* ---------- Trang chủ ---------- */

// Thanh nhắc khách: đang dùng thử, đăng nhập để mở toàn bộ.
function guestBanner() {
  return `
    <div class="guest-banner">
      <div>${t('guest_banner', { l: TRIAL.lessons, q: QUESTIONS.length })}</div>
      <button class="btn primary" data-login>${t('login_btn')}</button>
    </div>`;
}

function lockedHtml(textKey) {
  return `
    <section class="locked">
      <div class="locked-icon">🔒</div>
      <p>${t(textKey, { l: TRIAL.lessons, q: QUESTIONS.length })}</p>
      <button class="btn primary big" data-login>${t('login_btn')}</button>
    </section>`;
}

function viewHome() {
  const s = totals();
  const hello = profile.name ? t('hello_name', { name: esc(profile.name) }) : t('hello');
  page(`
    <section class="hero">
      <h1>${t('home_title', { hello })}</h1>
      <p>${t('home_desc')}</p>
      <div class="hero-stats">
        <div><b>${profile.stars}</b><span>${t('stat_stars')}</span></div>
        <div><b>${s.answered}</b><span>${t('stat_answered')}</span></div>
        <div><b>${pct(s.correct, s.answered)}%</b><span>${t('stat_accuracy')}</span></div>
      </div>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="skills">
      <div class="skill disabled">
        <div class="skill-icon">🎧</div>
        <h2>Listening</h2><p>${t('listening_desc')}</p>
        <span class="badge">${t('coming_soon')}</span>
      </div>
      <div class="skill disabled">
        <div class="skill-icon">📖</div>
        <h2>Reading</h2><p>${t('reading_desc')}</p>
        <span class="badge">${t('coming_soon')}</span>
      </div>
      <a class="skill" href="#/writing">
        <div class="skill-icon">✍️</div>
        <h2>Writing</h2><p>${t('writing_desc')}</p>
        <span class="badge go">${guest ? t('writing_badge_guest', { q: QUESTIONS.length, l: TRIAL.lessons }) : t('writing_badge', { q: QUESTIONS.length, l: LESSONS.length })}</span>
      </a>
    </section>`);
}

/* ---------- Writing ---------- */

function viewWriting() {
  const s = totals();
  const wrong = wrongIds().length;
  page(`
    ${crumbs([[t('crumb_home'), '#/'], [t('crumb_writing')]])}
    <section class="section-head">
      <h1>${t('writing_title')}</h1>
      <p>${t('writing_intro')}</p>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="big-choices">
      <a class="big-choice learn" href="#/writing/learn">
        <span class="bc-icon">📘</span>
        <span class="bc-title">Learn</span>
        <span class="bc-desc">${t('learn_card', { n: LESSONS.length })}</span>
      </a>
      <a class="big-choice practice" href="#/writing/practice">
        <span class="bc-icon">🎯</span>
        <span class="bc-title">Practice</span>
        <span class="bc-desc">${t('practice_card')}</span>
      </a>
    </section>
    <section class="mini-stats">
      <div><b>${s.mastered}/${QUESTIONS.length}</b><span>${t('mini_mastered')}</span></div>
      <div><b>${profile.streak}</b><span>${t('mini_streak')}</span></div>
      <div><b>${profile.bestStreak}</b><span>${t('mini_best')}</span></div>
      ${wrong ? `<a class="mini-cta" href="#/writing/practice" data-start="wrong">${t('mini_wrong', { n: wrong })}</a>` : ''}
    </section>`);
  const cta = $('[data-start="wrong"]');
  if (cta) cta.addEventListener('click', e => { e.preventDefault(); startSession('wrong'); });
}

function viewLearnList() {
  page(`
    ${crumbs([[t('crumb_home'), '#/'], [t('crumb_writing'), '#/writing'], [t('crumb_learn')]])}
    <section class="section-head">
      <h1>${t('learn_title')}</h1>
      <p>${t('learn_intro')}</p>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="lesson-grid">
      ${LESSONS.map((l, i) => {
        const n = questionsForTopic(l.id).length;
        const lt = lessonText(l);
        const locked = lessonLocked(i);
        return `<a class="lesson-card${locked ? ' locked' : ''}" href="#/writing/learn/${l.id}">
          <span class="lc-icon">${l.icon}</span>
          <span class="lc-body"><span class="lc-num">${t('lesson_n', { n: i + 1 })}</span><span class="lc-title">${esc(lt.title)}</span><span class="lc-short">${esc(lt.short)}</span></span>
          ${locked ? `<span class="lc-count">🔒 ${t('locked')}</span>` : n ? `<span class="lc-count">${t('n_questions', { n })}</span>` : ''}
        </a>`;
      }).join('')}
    </section>`);
}

function viewLesson(id) {
  const idx = LESSONS.findIndex(l => l.id === id);
  if (idx < 0) return go('#/writing/learn');
  const l = LESSONS[idx], prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
  const lt = lessonText(l);
  if (lessonLocked(idx)) {
    return page(`
      ${crumbs([[t('crumb_home'), '#/'], [t('crumb_writing'), '#/writing'], [t('crumb_learn'), '#/writing/learn'], [lt.title]])}
      ${lockedHtml('locked_lesson')}`);
  }
  const qs = questionsForTopic(id);
  page(`
    ${crumbs([[t('crumb_home'), '#/'], [t('crumb_writing'), '#/writing'], [t('crumb_learn'), '#/writing/learn'], [lt.title]])}
    <article class="lesson">
      <header><span class="lesson-icon">${l.icon}</span><div><div class="lc-num">${t('lesson_n_of', { n: idx + 1, t: LESSONS.length })}</div><h1>${esc(lt.title)}</h1></div></header>
      <div class="lesson-body">${lt.body}</div>
      ${qs.length ? `
        <div class="lesson-practice">
          <div><b>${t('lesson_practice_title')}</b><span>${t('lesson_practice_desc', { n: qs.length })}</span></div>
          <button class="btn primary" id="practice-topic">${t('lesson_practice_btn', { n: qs.length })}</button>
        </div>` : `
        <div class="lesson-practice">
          <div><b>${t('lesson_ready_title')}</b><span>${t('lesson_ready_desc')}</span></div>
          <a class="btn primary" href="#/writing/practice">${t('go_practice')}</a>
        </div>`}
    </article>
    <nav class="lesson-nav">
      ${prev ? `<a class="btn ghost" href="#/writing/learn/${prev.id}">← ${esc(lessonText(prev).title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn ghost" href="#/writing/learn/${next.id}">${lessonLocked(idx + 1) ? '🔒 ' : ''}${esc(lessonText(next).title)} →</a>` : '<span></span>'}
    </nav>`);
  const btn = $('#practice-topic');
  if (btn) btn.addEventListener('click', () => startSession('topic', id));
}

/* ---------- Practice: chọn cách luyện ---------- */

function viewPracticeSetup() {
  const s = local.session;
  const unfinished = s && s.i < s.ids.length;
  const wrong = wrongIds().length;
  const topicOptions = LESSONS.filter(l => questionsForTopic(l.id).length)
    .map(l => `<option value="${l.id}">${esc(t('topic_option', { title: lessonText(l).title, n: questionsForTopic(l.id).length }))}</option>`).join('');
  const options = `
    <section class="options">
      <label class="opt"><input type="checkbox" id="opt-random" ${local.settings.order === 'random' ? 'checked' : ''}> ${t('opt_random')}</label>
      <label class="opt"><input type="checkbox" id="opt-strict" ${local.settings.strict ? 'checked' : ''}> <span>${t('opt_strict')}</span></label>
    </section>`;
  const resume = unfinished ? `
    <div class="resume">
      <div>${t('resume_label', { label: esc(sessionLabel(s)), i: s.i + 1, n: s.ids.length })}</div>
      <a class="btn primary" href="#/writing/practice/run">${t('resume_btn')}</a>
    </div>` : '';
  const wrongCard = `
      <div class="setup-card ${wrong ? '' : 'muted'}">
        <h3>${t('setup_wrong')}</h3>
        <p>${wrong ? t('setup_wrong_desc', { n: wrong }) : t('setup_wrong_none')}</p>
        <button class="btn primary" data-mode="wrong" ${wrong ? '' : 'disabled'}>${t('setup_wrong_btn')}</button>
      </div>`;
  const head = `
    ${crumbs([[t('crumb_home'), '#/'], [t('crumb_writing'), '#/writing'], [t('crumb_practice')]])}
    <section class="section-head">
      <h1>${t('practice_title')}</h1>
      <p>${t('practice_intro')}</p>
    </section>
    ${resume}`;

  if (guest) {
    page(`
      ${head}
      <section class="setup-grid">
        <div class="setup-card">
          <h3>${t('setup_trial')}</h3>
          <p>${t('setup_trial_desc', { n: QUESTIONS.length })}</p>
          <button class="btn primary" data-mode="all">${t('start')}</button>
        </div>
        ${wrongCard}
        <div class="setup-card">
          <h3>${t('setup_more')}</h3>
          <p>${t('setup_more_desc')}</p>
          <button class="btn ghost" data-login>${t('login_btn')}</button>
        </div>
      </section>
      ${options}`);
    return bindPracticeSetup();
  }

  const examOptions = [1, 2].map(b => `<optgroup label="${t('book', { b })}">${
    Array.from({ length: 30 }, (_, i) => i + 1).filter(d => EXAMS[examKey(b, d)])
      .map(d => `<option value="${b}-${d}">${t('exam', { b, d })}</option>`).join('')
  }</optgroup>`).join('');

  page(`
    ${head}
    <section class="setup-grid">
      <div class="setup-card">
        <h3>${t('setup_all')}</h3>
        <p>${t('setup_all_desc', { n: QUESTIONS.length })}</p>
        <button class="btn primary" data-mode="all">${t('start')}</button>
      </div>
      <div class="setup-card">
        <h3>${t('setup_topic')}</h3>
        <select id="sel-topic">${topicOptions}</select>
        <button class="btn primary" data-mode="topic">${t('start')}</button>
      </div>
      <div class="setup-card">
        <h3>${t('setup_exam')}</h3>
        <select id="sel-exam">${examOptions}</select>
        <button class="btn primary" data-mode="exam">${t('setup_exam_btn')}</button>
      </div>
      ${wrongCard}
    </section>
    ${options}`);
  bindPracticeSetup();
}

function bindPracticeSetup() {
  $('#opt-random').addEventListener('change', e => { local.settings.order = e.target.checked ? 'random' : 'seq'; saveLocal(); });
  $('#opt-strict').addEventListener('change', e => { local.settings.strict = e.target.checked; saveLocal(); });
  $$('[data-mode]').forEach(b => b.addEventListener('click', () => {
    const mode = b.dataset.mode;
    if (mode === 'topic') startSession('topic', $('#sel-topic').value);
    else if (mode === 'exam') startSession('exam', $('#sel-exam').value);
    else startSession(mode);
  }));
}

// Mỗi lượt gắn với một bộ đề (exams); ôn câu sai dùng bộ 'all' (chứa mọi câu).
function startSession(mode, value) {
  let examId, ids;
  if (mode === 'topic') { examId = 'topic-' + value; ids = (EXAMS[examId] || {}).questionIds || questionsForTopic(value).map(q => q.id); }
  else if (mode === 'exam') { const [b, d] = value.split('-'); examId = examKey(b, d); ids = (EXAMS[examId] || {}).questionIds || []; }
  else if (mode === 'wrong') { examId = 'all'; ids = wrongIds(); }
  else if (mode === 'retry') { examId = 'all'; ids = value; }
  else { mode = 'all'; examId = 'all'; ids = (EXAMS.all || {}).questionIds || QUESTIONS.map(q => q.id); }
  ids = ids.filter(id => Q_BY_ID[id]);
  if (!ids.length) return;
  if (guest) examId = 'trial';
  if (local.settings.order === 'random' && mode !== 'exam') ids = shuffle(ids);
  local.session = {
    uid: sessionOwner(),
    kind: { mode, value: mode === 'retry' ? null : value },
    examId, ids, i: 0, results: [], starsEarned: 0, submissionId: null, pending: null, guestSub: null
  };
  saveLocal();
  go('#/writing/practice/run');
}

/* ---------- Practice: làm bài ---------- */

function streakSlots() {
  const r = profile.streak % STREAK_BONUS_EVERY;
  const filled = profile.streak > 0 && r === 0 ? STREAK_BONUS_EVERY : r;
  return Array.from({ length: STREAK_BONUS_EVERY }, (_, i) => `<span class="slot ${i < filled ? 'on' : ''}">★</span>`).join('');
}

function viewPracticeRun() {
  const s = local.session;
  if (!s || !s.examId) return go('#/writing/practice');
  if (s.i >= s.ids.length) return viewSummary();

  const q = Q_BY_ID[s.ids[s.i]];
  if (!q) { s.i += 1; saveLocal(); return viewPracticeRun(); }
  const pending = s.pending && s.pending.i === s.i ? s.pending : null;
  const need = STREAK_BONUS_EVERY - (profile.streak % STREAK_BONUS_EVERY);
  const progress = pct(s.i + (pending ? 1 : 0), s.ids.length);

  page(`
    ${crumbs([[t('crumb_writing'), '#/writing'], [t('crumb_practice'), '#/writing/practice'], [sessionLabel(s)]])}
    <section class="run-top">
      <div class="run-progress">
        <div class="run-count">${t('q_count', { i: s.i + 1, n: s.ids.length })}</div>
        <div class="bar"><span style="width:${progress}%"></span></div>
      </div>
      <div class="streak" title="${t('streak_tip', { e: STREAK_BONUS_EVERY, b: STREAK_BONUS_STARS })}">
        <div class="slots">${streakSlots()}</div>
        <div class="streak-text">${t('streak_text', { s: profile.streak, n: need, b: STREAK_BONUS_STARS })}</div>
      </div>
    </section>

    <section class="q-card">
      <div class="q-head">
        <span class="q-label">${t('q_label')}</span>
        <span class="q-src">${sourceLabel(q.source)}</span>
      </div>
      <div class="cues">${cuesHtml(q.cues)}</div>
      <textarea id="answer" rows="2" placeholder="${t('placeholder')}" spellcheck="false" autocomplete="off" autocapitalize="off" ${pending ? 'readonly' : ''}>${pending ? esc(pending.result.userAnswer) : ''}</textarea>
      <div class="q-meta">
        <span id="wc" class="wc"></span>
        <span class="kbd-hint">${pending ? t('enter_next') : t('enter_check')}</span>
      </div>
      <div id="hint" class="hint" hidden></div>
      <div id="submit-error" class="submit-error" hidden></div>
      <div class="q-actions">
        ${pending ? `
          <span></span>
          <button class="btn primary big" id="btn-next">${s.i + 1 < s.ids.length ? t('btn_next') : t('btn_finish')}</button>` : `
          <button class="btn ghost" id="btn-hint">${t('btn_hint')}</button>
          <button class="btn primary big" id="btn-check">${t('btn_check')}</button>`}
      </div>
    </section>
    <div id="feedback">${pending ? feedbackHtml(pending.result) : ''}</div>`);

  const ta = $('#answer');
  const wc = $('#wc');
  const updateWc = () => {
    const n = countWords(ta.value);
    wc.textContent = t('words', { n });
    wc.classList.toggle('over', n > MAX_WORDS);
  };
  updateWc();

  if (pending) {
    const next = $('#btn-next');
    next.addEventListener('click', nextQuestion);
    ta.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); nextQuestion(); } });
    next.focus({ preventScroll: true });
    $('#feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  const btnCheck = $('#btn-check');
  ta.focus();
  ta.addEventListener('input', updateWc);
  ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } });
  btnCheck.addEventListener('click', check);
  $('#btn-hint').addEventListener('click', () => {
    const h = $('#hint');
    h.innerHTML = t('hint', {
      topics: q.topics.map(id => `<a href="#/writing/learn/${id}" target="_blank">${esc(topicTitle(id))}</a>`).join(', ')
    });
    h.hidden = !h.hidden;
  });

  let busy = false;
  async function check() {
    if (busy) return;
    const text = ta.value.trim();
    if (!text) { ta.classList.add('shake'); setTimeout(() => ta.classList.remove('shake'), 400); ta.focus(); return; }
    busy = true;
    btnCheck.disabled = true;
    btnCheck.textContent = t('checking');
    $('#submit-error').hidden = true;
    try {
      const res = guest
        ? await api.checkTrialAnswer({ profile, sub: s.guestSub, questionId: q.id, userAnswer: text, strict: local.settings.strict })
        : await api.checkAnswer({
          examId: s.examId,
          submissionId: s.submissionId,
          questionId: q.id,
          userAnswer: text,
          strict: local.settings.strict,
          final: s.i === s.ids.length - 1
        });
      applyResult(s, res);
    } catch (err) {
      console.error(err);
      busy = false;
      btnCheck.disabled = false;
      btnCheck.textContent = t('btn_check');
      const box = $('#submit-error');
      box.textContent = t('submit_error');
      box.hidden = false;
    }
  }
}

function applyResult(s, res) {
  const r = res.result;
  s.submissionId = res.submissionId;
  profile = res.profile;
  if (guest) { s.guestSub = res.sub; local.guestProfile = profile; }
  if (!r.duplicate) s.starsEarned += r.starsEarned;
  s.results.push({ id: r.questionId, correct: r.correct, answer: r.answer });
  s.pending = { i: s.i, result: r };
  saveLocal();
  renderHeader();
  viewPracticeRun();
  if (r.correct && r.starsEarned) bumpStars();
  if (r.bonus && !r.duplicate) celebrate(profile.streak);
}

function nextQuestion() {
  const s = local.session;
  s.i += 1;
  s.pending = null;
  saveLocal();
  viewPracticeRun();
}

function markedSentence(marks, cls) {
  return marks.map(m => `<span class="${m.ok ? 'w' : 'w ' + cls}">${esc(m.word)}</span>`).join(' ');
}

const issueText = issue => t('issue_' + issue.code, { n: issue.n });

// r: kết quả chấm một câu (Scoring.applyAnswer → result).
function feedbackHtml(r) {
  let banner;
  if (r.correct) {
    banner = `<div class="banner ok"><span class="b-icon">🎉</span><div><b>${t('fb_ok')}</b> +1 ★${r.bonus ? ` <span class="bonus">${t('fb_bonus', { b: STREAK_BONUS_STARS, e: STREAK_BONUS_EVERY })}</span>` : ''}${r.sameAsBook ? '' : `<div class="banner-sub">${t('fb_ok_variant')}</div>`}</div></div>`;
  } else if (r.contentOk) {
    banner = `<div class="banner bad"><span class="b-icon">✋</span><div>${t('fb_form')}</div></div>`;
  } else {
    banner = `<div class="banner bad"><span class="b-icon">💪</span><div>${t('fb_bad')}</div></div>`;
  }

  const compare = !r.contentOk && r.userMarks ? `
    <div class="compare">
      <div class="cmp-row"><span class="cmp-label">${t('cmp_yours')}</span><div class="cmp-text">${markedSentence(r.userMarks, 'wrong')}</div></div>
      <div class="cmp-row"><span class="cmp-label">${t('cmp_closest')}</span><div class="cmp-text">${markedSentence(r.answerMarks, 'missing')}</div></div>
      ${r.closest !== r.answer ? `<div class="cmp-row"><span class="cmp-label">${t('cmp_book')}</span><div class="cmp-text book">${esc(r.answer)}</div></div>` : ''}
      <div class="legend">${t('legend')}</div>
    </div>` : `
    <div class="compare"><div class="cmp-row"><span class="cmp-label">${t('cmp_book')}</span><div class="cmp-text">${esc(r.answer)}</div></div></div>`;

  const steps = (r.explanation && (r.explanation[lang()] || r.explanation.vi)) || [];
  const q = Q_BY_ID[r.questionId];
  const topics = q ? q.topics : [];

  return `
    <section class="feedback ${r.correct ? 'is-ok' : 'is-bad'}">
      ${banner}
      ${r.issues.length ? `<div class="issues"><b>${r.correct ? t('issues_note') : t('issues_err')}</b><ul>${r.issues.map(i => `<li>${issueText(i)}</li>`).join('')}</ul></div>` : ''}
      ${r.extra && r.extra.length ? `<div class="issues"><b>${t('extra_title')}</b> ${t('extra_body', { w: r.extra.map(w => `<span class="w wrong">${esc(w)}</span>`).join(' ') })}</div>` : ''}
      ${compare}
      ${r.variants && r.variants.length ? `<div class="alts"><b>${t('alts_title')}</b><ul>${r.variants.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
      <div class="why">
        <h3>${t('why_title')}</h3>
        <ol>${steps.map(st => `<li>${st}</li>`).join('')}</ol>
        <div class="why-topics">${t('review')} ${topics.map(id => `<a class="chip" href="#/writing/learn/${id}">${esc(topicTitle(id))}</a>`).join('')}</div>
      </div>
    </section>`;
}

function viewSummary() {
  const s = local.session;
  const correct = s.results.filter(r => r.correct).length;
  const wrongInSession = s.results.filter(r => !r.correct).map(r => r.id);
  const total = s.results.length;
  const p = pct(correct, total);
  const msg = p === 100 ? t('sum_100') : p >= 80 ? t('sum_80') : p >= 50 ? t('sum_50') : t('sum_low');
  page(`
    ${crumbs([[t('crumb_writing'), '#/writing'], [t('crumb_practice'), '#/writing/practice'], [t('crumb_summary')]])}
    <section class="summary">
      <div class="sum-stars">★ +${s.starsEarned}</div>
      <h1>${msg}</h1>
      <p>${t('sum_detail', { label: esc(sessionLabel(s)), c: correct, t: total, p })}</p>
      <div class="sum-actions">
        ${wrongInSession.length ? `<button class="btn primary" id="retry">${t('sum_retry', { n: wrongInSession.length })}</button>` : ''}
        <a class="btn ${wrongInSession.length ? 'ghost' : 'primary'}" href="#/writing/practice">${t('sum_new')}</a>
        ${guest ? `<button class="btn ghost" data-login>${t('sum_login')}</button>` : `<a class="btn ghost" href="#/results">${t('sum_total')}</a>`}
      </div>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="sum-list">
      ${s.results.map((r, i) => {
        const q = Q_BY_ID[r.id];
        return `<div class="sum-item ${r.correct ? 'ok' : 'bad'}"><span class="mark">${r.correct ? '✓' : '✗'}</span><div><div class="sum-cue">${i + 1}. ${esc(q ? q.cues : r.id)}</div><div class="sum-ans">${esc(r.answer || '')}</div></div></div>`;
      }).join('')}
    </section>`);
  const retry = $('#retry');
  if (retry) retry.addEventListener('click', () => startSession('retry', wrongInSession));
}

/* ---------- Hiệu ứng ---------- */

function bumpStars() {
  const pill = $('.star-pill');
  if (!pill) return;
  pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
}

function celebrate(streak) {
  const el = document.createElement('div');
  el.className = 'celebrate';
  el.innerHTML = `<div class="cel-card"><div class="cel-stars">${'★'.repeat(STREAK_BONUS_STARS)}</div><b>${t('cel_title', { n: streak })}</b><span>${t('cel_sub', { b: STREAK_BONUS_STARS })}</span></div>`;
  document.body.appendChild(el);
  el.addEventListener('click', () => el.remove());
  setTimeout(() => el.remove(), 2600);
}

/* ---------- Kết quả ---------- */

function viewResults() {
  const s = totals();
  const byTopic = LESSONS.filter(l => questionsForTopic(l.id).length).map(l => {
    let a = 0, c = 0;
    questionsForTopic(l.id).forEach(q => { const st = qstat(q.id); if (st) { a += st.a; c += st.c; } });
    return { l, a, c };
  });

  page(`
    ${crumbs([[t('crumb_home'), '#/'], [t('crumb_results')]])}
    <section class="section-head">
      <h1>${t('results_title')}</h1>
      <p>${t('results_intro')}</p>
    </section>
    <section class="profile">
      <label for="name">${t('name_label')}</label>
      <input id="name" type="text" maxlength="40" placeholder="${t('name_ph')}" value="${esc(profile.name || '')}">
    </section>
    <section class="tiles">
      <div class="tile star"><b>${profile.stars}</b><span>${t('tile_stars')}</span></div>
      <div class="tile"><b>${s.answered}</b><span>${t('tile_answers')}</span></div>
      <div class="tile"><b>${pct(s.correct, s.answered)}%</b><span>${t('tile_acc')}</span></div>
      <div class="tile"><b>${s.mastered}/${QUESTIONS.length}</b><span>${t('tile_mastered')}</span></div>
      <div class="tile"><b>${profile.bestStreak}</b><span>${t('tile_best')}</span></div>
      <div class="tile"><b>${profile.bonusCount}</b><span>${t('tile_bonus')}</span></div>
    </section>

    <section class="panel">
      <h2>${t('by_topic')}</h2>
      ${s.answered ? `<div class="topic-rows">${byTopic.map(({ l, a, c }) => `
        <a class="topic-row" href="#/writing/learn/${l.id}">
          <span class="tr-name">${l.icon} ${esc(lessonText(l).title)}</span>
          <span class="tr-bar"><span style="width:${pct(c, a)}%" class="${a && pct(c, a) < 60 ? 'low' : ''}"></span></span>
          <span class="tr-num">${a ? `${c}/${a} · ${pct(c, a)}%` : t('not_done')}</span>
        </a>`).join('')}</div>` : `<p class="empty">${t('empty_start')}</p>`}
    </section>

    <section class="panel">
      <h2>${t('history')}</h2>
      <div id="history"><p class="empty">${t('history_loading')}</p></div>
    </section>

    <section class="panel data-actions">
      <h2>${t('backup')}</h2>
      <div class="row">
        <button class="btn primary" id="export">${t('export')}</button>
        <button class="btn danger" id="reset">${t('reset')}</button>
      </div>
    </section>`);

  let nameTimer = null;
  $('#name').addEventListener('input', e => {
    profile.name = e.target.value.trim();
    clearTimeout(nameTimer);
    nameTimer = setTimeout(() => api.saveName(profile.name).catch(console.error), 600);
  });
  $('#export').addEventListener('click', exportData);
  $('#reset').addEventListener('click', async () => {
    if (!confirm(t('reset_confirm'))) return;
    try {
      await api.resetProgress();
      profile = Object.assign({}, api.PROFILE_DEFAULTS, { name: profile.name });
      local.session = null;
      saveLocal();
      renderHeader();
      viewResults();
    } catch (err) {
      console.error(err);
      alert(t('reset_error'));
    }
  });

  renderHistory();
}

async function renderHistory() {
  const box = $('#history');
  const fmt = ts => new Date(ts).toLocaleString(t('date_locale'), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  let items;
  try {
    const subs = await api.fetchHistory(15);
    items = subs.flatMap(sub => (sub.details || []).map(d => d)).sort((a, b) => b.at - a.at).slice(0, 40);
  } catch (err) {
    console.error(err);
    if (box.isConnected) box.innerHTML = `<p class="empty">${t('boot_error')}</p>`;
    return;
  }
  if (!box.isConnected) return;   // người dùng đã chuyển trang
  box.innerHTML = items.length ? `<div class="history">${items.map(h => {
    const q = Q_BY_ID[h.questionId];
    return `<div class="h-item ${h.correct ? 'ok' : 'bad'}">
      <span class="mark">${h.correct ? '✓' : '✗'}</span>
      <div class="h-body"><div class="h-cue">${esc(q ? q.cues : h.questionId)}</div><div class="h-text">${esc(h.userAnswer)}</div>${h.correct || !h.bookAnswer ? '' : `<div class="h-ans">→ ${esc(h.bookAnswer)}</div>`}</div>
      <span class="h-meta">${h.starsEarned ? `+${h.starsEarned} ★<br>` : ''}${fmt(h.at)}</span>
    </div>`;
  }).join('')}</div>` : `<p class="empty">${t('history_empty')}</p>`;
}

async function exportData() {
  let submissions = [];
  try { submissions = await api.fetchHistory(100); } catch (err) { console.error(err); }
  const data = { exportedAt: new Date().toISOString(), profile, submissions };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  const who = (profile.name || 'thi-sinh').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^\w]+/g, '-').toLowerCase();
  a.href = URL.createObjectURL(blob);
  a.download = `ket-qua-tdn-${who}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

/* ---------- Điều hướng & khởi động ---------- */

function go(hash) {
  if (location.hash === hash) route(); else location.hash = hash;
}

function route() {
  const h = location.hash || '#/';
  renderHeader();
  const parts = h.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!parts.length) return viewHome();
  if (parts[0] === 'results') return guest ? viewHome() : viewResults();
  if (parts[0] === 'writing') {
    if (!parts[1]) return viewWriting();
    if (parts[1] === 'learn') return parts[2] ? viewLesson(parts[2]) : viewLearnList();
    if (parts[1] === 'practice') return parts[2] === 'run' ? viewPracticeRun() : viewPracticeSetup();
  }
  viewHome();
}

function viewLogin(errorKey) {
  ready = false;
  renderHeader();
  page(`
    <section class="login">
      <h1>${t('login_title')}</h1>
      <p>${t('login_desc')}</p>
      <form id="login-form" novalidate>
        <label for="login-username">${t('username')}</label>
        <input id="login-username" type="text" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required>
        <label for="login-password">${t('password')}</label>
        <input id="login-password" type="password" autocomplete="current-password" required>
        <div id="login-error" class="submit-error" ${errorKey ? '' : 'hidden'}>${errorKey ? t(errorKey) : ''}</div>
        <button class="btn primary big" type="submit" id="login-btn">${t('login_btn')}</button>
      </form>
      <p class="login-help">${t('login_help')}</p>
      <div class="login-trial">
        <p>${t('trial_desc', { l: TRIAL.lessons, q: TRIAL.questions })}</p>
        <button class="btn ghost big" type="button" id="trial-btn">${t('trial_btn')}</button>
      </div>
    </section>`);
  $('#trial-btn').addEventListener('click', startGuest);
  const form = $('#login-form');
  $('#login-username').focus();
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const username = $('#login-username').value.trim();
    const password = $('#login-password').value;
    const btn = $('#login-btn');
    const box = $('#login-error');
    if (!username || !password) { box.textContent = t('login_err_cred'); box.hidden = false; return; }
    btn.disabled = true;
    btn.textContent = t('logging_in');
    box.hidden = true;
    try {
      await api.login(username, password);
      guest = false;
      local.settings.guest = false;
      saveLocal();
      boot();
    } catch (err) {
      console.error(err);
      const code = err && err.code;
      const key = ['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email', 'auth/user-disabled'].includes(code) ? 'login_err_cred'
        : code === 'auth/too-many-requests' ? 'login_err_many'
        : code === 'auth/network-request-failed' ? 'login_err_net'
        : 'login_err_other';
      box.textContent = t(key);
      box.hidden = false;
      btn.disabled = false;
      btn.textContent = t('login_btn');
    }
  });
}

// Khách bấm "Đăng nhập": về trang đăng nhập, vẫn giữ kết quả làm thử để quay lại được.
function showLogin() {
  guest = false;
  local.settings.guest = false;
  saveLocal();
  profile = Object.assign({}, api.PROFILE_DEFAULTS);
  QUESTIONS = []; Q_BY_ID = {}; EXAMS = {};
  viewLogin();
}

function startGuest() {
  guest = true;
  local.settings.guest = true;
  saveLocal();
  boot();
}

async function doLogout() {
  try { await api.logout(); } catch (err) { console.error(err); }
  user = null;
  profile = Object.assign({}, api.PROFILE_DEFAULTS);
  QUESTIONS = []; Q_BY_ID = {}; EXAMS = {};
  location.hash = '#/';
  viewLogin();
}

let routing = false;
async function boot() {
  ready = false;
  page(`<div class="boot"><div class="spinner"></div><p>${t('loading')}</p></div>`);
  try {
    user = await api.currentUser();
  } catch (err) {
    console.error(err);
    user = null;
  }
  if (user) guest = false;
  else if (local.settings.guest) guest = true;
  else return viewLogin();
  renderHeader();
  try {
    const [catalog, prof] = guest
      ? [await api.fetchTrialCatalog(), Object.assign({}, api.PROFILE_DEFAULTS, local.guestProfile)]
      : await Promise.all([api.fetchCatalog(), api.fetchProfile()]);
    QUESTIONS = catalog.questions;
    Q_BY_ID = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
    EXAMS = catalog.exams;
    profile = prof;
  } catch (err) {
    console.error(err);
    // Đăng nhập được nhưng chưa có trong danh sách thành viên (users/{uid}).
    const denied = !guest && err && (err.code === 'permission-denied' || err.code === 'firestore/permission-denied');
    page(denied
      ? `<div class="boot"><p>${t('not_member', { email: esc(user.email || user.uid) })}</p><button class="btn ghost" id="boot-logout">${t('logout')}</button></div>`
      : `<div class="boot"><p>${t('boot_error')}</p><button class="btn primary" id="boot-retry">${t('retry')}</button>${guest ? ` <button class="btn ghost" id="boot-login">${t('login_btn')}</button>` : ''}</div>`);
    if (denied) $('#boot-logout').addEventListener('click', doLogout);
    else $('#boot-retry').addEventListener('click', boot);
    if ($('#boot-login')) $('#boot-login').addEventListener('click', showLogin);
    return;
  }
  // Lượt làm dở của tài khoản khác trên cùng máy thì bỏ.
  if (local.session && local.session.uid !== sessionOwner()) { local.session = null; saveLocal(); }
  ready = true;
  if (!routing) {
    window.addEventListener('hashchange', () => { if (ready) route(); });
    // Nút "Đăng nhập" của chế độ làm thử (header, trang bị khoá, tóm tắt lượt).
    document.addEventListener('click', e => { if (guest && e.target.closest('[data-login]')) { e.preventDefault(); showLogin(); } });
    routing = true;
  }
  route();
}

boot();
