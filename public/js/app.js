/*
 * Giao diện app luyện thi (gói Spark, không có Cloud Functions). Đề bài lấy từ Firestore
 * `questions` (và `passages` — bài đọc của Reading); khi bấm Check mới lấy đáp án của đúng câu đó
 * từ `answers`, chấm bằng Grader (Writing) hoặc so đáp án (Reading) rồi lưu vào `submissions`
 * (xem api.checkAnswer). localStorage chỉ giữ cài đặt giao diện và lượt đang làm dở.
 *
 * 3 mảng luyện tập (MODS): Writing, Reading › Read a letter, Reading › Read a text. Mỗi mảng có
 * Learn + Practice, lượt làm dở và "Luyện mỗi ngày" riêng; sao, chuỗi đúng và qstats dùng chung.
 *
 * Khách chưa đăng nhập được dùng thử (guest): xem TRIAL.lessons bài học đầu của mỗi mảng và làm các câu
 * trong exams/trial. Kết quả của khách chỉ lưu ở localStorage (local.guestProfile).
 */
import * as api from './api.js';

const LESSONS = window.LESSONS;
const READING_LESSONS = window.READING_LESSONS;
const TRIAL = window.TRIAL;
const { STREAK_BONUS_EVERY, STREAK_BONUS_STARS } = window.Scoring;
const MAX_WORDS = 15;
const APP_VERSION = '1.0.0';
// Số câu làm thử: TRIAL.questions câu Writing + TRIAL.passages bài đọc (4 câu) của mỗi phần Reading.
const TRIAL_QUESTIONS = TRIAL.questions + (TRIAL.passages || 0) * 4 * 2;

let QUESTIONS = [];   // Writing: { id, cues, topics, source } · Reading: { id, part, passage, num, prompt?, options?, topics, source } — không có đáp án
let Q_BY_ID = {};
let PASSAGES = {};    // passageId -> { part, title, paragraphs | text, questionIds }
let EXAMS = {};       // examId -> { questionIds, kind, ... }
let profile = Object.assign({}, api.PROFILE_DEFAULTS);   // thống kê trong users/{uid}
let user = null;      // tài khoản Firebase đang đăng nhập
let guest = false;    // đang dùng thử, không đăng nhập

/* ---------- Các mảng luyện tập ---------- */

// Câu hỏi thuộc mảng theo q.part ('letter' / 'text'); không có part là Writing.
// key: tiền tố khoá i18n của mảng · prefix: tiền tố id đề / bài đọc trong Firestore (seed.js).
const MODS = {
  writing: { base: '#/writing', lessons: LESSONS, key: 'writing', allExam: 'all', examPrefix: '' },
  letter: { base: '#/reading/letter', lessons: READING_LESSONS.letter, key: 'letter', allExam: 'rl-all', examPrefix: 'rl-' },
  text: { base: '#/reading/text', lessons: READING_LESSONS.text, key: 'text', allExam: 'rt-all', examPrefix: 'rt-' }
};
const MOD_IDS = Object.keys(MODS);
const isReading = m => m !== 'writing';
const modOf = q => (q && q.part) || 'writing';
const modQuestions = m => QUESTIONS.filter(q => modOf(q) === m);
const modPassages = m => Object.values(PASSAGES).filter(p => p.part === m).sort((a, b) => a.order - b.order);
const ALL_LESSONS = MOD_IDS.flatMap(m => MODS[m].lessons);
const lessonMod = id => MOD_IDS.find(m => MODS[m].lessons.some(l => l.id === id)) || 'writing';
const lessonHref = id => `${MODS[lessonMod(id)].base}/learn/${id}`;

/* ---------- Trạng thái cục bộ (localStorage) ---------- */

const STORAGE_KEY = 'tdn-english-v2';

function localDefaults() {
  // sessions: lượt đang làm của từng mảng { writing, letter, text }
  // daily: bộ câu "Luyện mỗi ngày" đã giao hôm nay theo mảng { [mảng]: { uid, date, ids } }
  // pool: nguồn câu Writing khi luyện — 'book' (trong sách) | 'gen' (tạo bởi AI) | 'all'
  return { settings: { strict: false, order: 'random', lang: 'vi', guest: false, dailyN: 10, pool: 'all', sound: true, music: true }, sessions: {}, guestProfile: null, daily: {} };
}

let storageOk = true;
function loadLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return localDefaults();
    const data = JSON.parse(raw);
    // Bản cũ chỉ có Writing: một lượt (session) và một bộ câu mỗi ngày (daily).
    const sessions = data.sessions || (data.session ? { writing: data.session } : {});
    Object.entries(sessions).forEach(([m, s]) => { if (s && !s.mod) s.mod = m; });
    const daily = data.daily && data.daily.uid ? { writing: data.daily } : data.daily || {};
    return {
      settings: Object.assign(localDefaults().settings, data.settings),
      sessions,
      guestProfile: data.guestProfile || null,
      daily
    };
  } catch (e) {
    storageOk = false;
    return localDefaults();
  }
}
const local = loadLocal();
window.Sound.setMuted(!local.settings.sound);
window.Sound.setMusic(local.settings.music);
function saveLocal() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(local)); storageOk = true; }
  catch (e) { storageOk = false; }
}
const sess = m => local.sessions[m] || null;

/* ---------- Ngôn ngữ ---------- */

const lang = () => (local.settings.lang === 'en' ? 'en' : 'vi');
function t(key, params) {
  const dict = window.I18N[lang()];
  let s = key in dict ? dict[key] : window.I18N.vi[key];
  if (s === undefined) return key;
  if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m));
  return s;
}
// Khoá i18n riêng của từng mảng: mt('learn_title', 'letter') → 'learn_title_letter' (Writing: 'learn_title').
const mt = (key, m, params) => t(m === 'writing' ? key : `${key}_${m}`, params);
const lessonText = l => (lang() === 'en' && window.LESSONS_EN[l.id]) || l;
const lessonById = id => ALL_LESSONS.find(l => l.id === id);
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
const sourceLabel = source => source.map(s => (s.gen ? t('src_gen') : t('src_item', { b: s.book, d: s.test }))).join(' | ');
const questionsForTopic = id => QUESTIONS.filter(q => q.topics.includes(id));
const POOLS = ['book', 'gen', 'all'];
const pool = () => (POOLS.includes(local.settings.pool) ? local.settings.pool : 'all');
const isGen = q => q.source.some(s => s.gen);
const inPool = (q, p = pool()) => p === 'all' || (p === 'gen') === isGen(q);
const poolQuestions = (p = pool()) => modQuestions('writing').filter(q => inPool(q, p));
const poolTopic = id => questionsForTopic(id).filter(q => inPool(q));
// Nguồn câu (sách / tạo bởi AI) chỉ có ở Writing; Reading luôn lấy mọi câu.
const modPool = m => (m === 'writing' ? pool() : 'all');
// Lượt làm dở thuộc nguồn câu đang chọn không (lượt theo đề / ôn câu sai thì luôn thuộc).
const sessionInPool = s => !s.kind || !['all', 'topic', 'daily'].includes(s.kind.mode) || (s.kind.pool || 'all') === modPool(s.mod);
const qstat = id => (profile.qstats || {})[id];
const wrongIds = m => modQuestions(m).filter(q => qstat(q.id) && qstat(q.id).last === false).map(q => q.id);
const cuesHtml = cues => cues.replace(/\s*\/\/\s*$/, '').split('/').map(c => `<span class="cue">${esc(c.trim())}</span>`).join('<span class="slash">/</span>');
const examKey = (b, d) => `b${b}-t${String(d).padStart(2, '0')}`;
const optionText = (q, letter) => (q.options ? q.options['ABC'.indexOf(letter)] : undefined);
// Đáp án kèm nội dung phương án: "B. excited" (câu True/False: chính là "True" / "False").
const choiceLabel = (q, a) => { const o = q && optionText(q, a); return o === undefined ? a : `${a}. ${o}`; };

// Dòng mô tả câu hỏi trong tóm tắt lượt và lịch sử.
function questionLabel(q) {
  if (!q) return '';
  if (!isReading(modOf(q))) return q.cues;
  const p = PASSAGES[q.passage];
  const where = p ? `${p.title} · ` : '';
  return q.prompt ? `${where}${q.num}. ${q.prompt}` : `${where}(${q.num}) ${q.options.join(' / ')}`;
}
const answerLabel = (q, a) => (q && isReading(modOf(q)) ? choiceLabel(q, a) : a);

function totals(m) {
  const qs = m ? modQuestions(m) : QUESTIONS;
  const mastered = qs.filter(q => qstat(q.id) && qstat(q.id).c > 0).length;
  return { answered: profile.totalAnswered || 0, correct: profile.totalCorrect || 0, mastered, total: qs.length };
}

function sessionLabel(s) {
  const k = s.kind || {};
  const from = k.pool && k.pool !== 'all' ? ` · ${t('pool_' + k.pool)}` : '';
  if (k.mode === 'topic') return t('label_topic', { t: topicTitle(k.value) }) + from;
  if (k.mode === 'exam') {
    const [b, d] = k.value.split('-');
    const p = PASSAGES[MODS[s.mod].examPrefix + examKey(b, d)];
    return t('exam', { b, d }) + (p && isReading(s.mod) ? ` · ${p.title}` : '');
  }
  if (k.mode === 'wrong') return t('label_wrong');
  if (k.mode === 'retry') return t('label_retry');
  if (k.mode === 'daily') return t('label_daily') + from;
  return mt('label_all', s.mod) + from;
}

/* ---------- Khung trang ---------- */

function renderHeader() {
  const route = location.hash || '#/';
  const inside = user || guest;
  const active = p => route === p || (p !== '#/' && route.startsWith(p)) ? ' class="active"' : '';
  document.documentElement.lang = t('html_lang');
  document.title = t('doc_title');
  $('#header').innerHTML = `
    <a class="brand" href="#/"><span class="brand-mark" aria-hidden="true">🦉</span><span class="brand-text">${t('brand_title')}<small>${t('brand_sub')}</small></span></a>
    ${inside ? `<nav class="nav">
      <a href="#/"${active('#/')}><span class="nav-ic">🏠</span>${t('nav_home')}</a>
      <a href="#/reading"${active('#/reading')}><span class="nav-ic">📖</span>${t('nav_reading')}</a>
      <a href="#/writing"${active('#/writing')}><span class="nav-ic">✏️</span>${t('nav_writing')}</a>
      ${guest ? '' : `<a href="#/results"${active('#/results')}><span class="nav-ic">🏆</span>${t('nav_results')}</a>`}
    </nav>` : '<span class="nav"></span>'}
    <button type="button" class="sound-btn music-btn ${local.settings.music ? '' : 'off'}" id="music-btn" title="${t(local.settings.music ? 'music_off' : 'music_on')}" aria-label="${t(local.settings.music ? 'music_off' : 'music_on')}" aria-pressed="${!!local.settings.music}">🎵</button>
    <button type="button" class="sound-btn" id="sound-btn" title="${t(local.settings.sound ? 'sound_off' : 'sound_on')}" aria-label="${t(local.settings.sound ? 'sound_off' : 'sound_on')}" aria-pressed="${!local.settings.sound}">${local.settings.sound ? '🔊' : '🔇'}</button>
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
  $('#sound-btn').addEventListener('click', () => {
    local.settings.sound = !local.settings.sound;
    window.Sound.setMuted(!local.settings.sound);
    saveLocal();
    renderHeader();
    window.Sound.play('tap');
  });
  $('#music-btn').addEventListener('click', () => {
    local.settings.music = !local.settings.music;
    window.Sound.setMusic(local.settings.music);
    saveLocal();
    renderHeader();
  });
  const out = $('#logout');
  if (out) out.addEventListener('click', doLogout);
  $('#footer').innerHTML = `${esc(t('footer'))}<br><span class="credit">${esc(t('credit'))} · v${APP_VERSION}</span>`;
}

// Phím tắt của trang đang mở (trang làm bài Reading); đổi trang thì bỏ.
let keyHandler = null;
function setKeys(fn) {
  if (keyHandler) document.removeEventListener('keydown', keyHandler);
  keyHandler = fn;
  if (fn) document.addEventListener('keydown', fn);
}

// keepScroll: giữ vị trí cuộn (sang câu tiếp theo của cùng một bài đọc).
function page(html, keepScroll) {
  setKeys(null);
  $('#app').innerHTML = html + (storageOk ? '' : `<p class="storage-warn">${t('storage_warn')}</p>`);
  if (!keepScroll) window.scrollTo(0, 0);
}

function crumbs(items) {
  return `<div class="crumbs">${items.map(([label, href]) => href ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`).join('<span class="sep">›</span>')}</div>`;
}

// Đường dẫn tới trang chủ của mảng: Trang chủ › Writing | Trang chủ › Reading › Read a letter.
function modCrumbs(m) {
  const home = [t('crumb_home'), '#/'];
  if (m === 'writing') return [home, [t('crumb_writing'), '#/writing']];
  return [home, [t('crumb_reading'), '#/reading'], [t('crumb_' + m), MODS[m].base]];
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
  const readingLessons = READING_LESSONS.letter.length + READING_LESSONS.text.length;
  const readingQs = modQuestions('letter').length + modQuestions('text').length;
  page(`
    <section class="hero">
      <div class="hero-mascot" aria-hidden="true"><span class="mascot">🦉</span><span class="hero-deco d1">⭐</span><span class="hero-deco d2">🎈</span><span class="hero-deco d3">✨</span></div>
      <div class="hero-body">
      <h1>${t('home_title', { hello })}</h1>
      <p>${t('home_desc')}</p>
      <div class="hero-stats">
        <div><b>${profile.stars}</b><span>${t('stat_stars')}</span></div>
        <div><b>${s.answered}</b><span>${t('stat_answered')}</span></div>
        <div><b>${pct(s.correct, s.answered)}%</b><span>${t('stat_accuracy')}</span></div>
      </div>
      </div>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="skills">
      <div class="skill listening disabled">
        <div class="skill-icon">🎧</div>
        <h2>Listening</h2><p>${t('listening_desc')}</p>
        <span class="badge">${t('coming_soon')}</span>
      </div>
      <a class="skill reading" href="#/reading">
        <div class="skill-icon">📖</div>
        <h2>Reading</h2><p>${t('reading_desc')}</p>
        <span class="badge go">${guest ? t('reading_badge_guest', { q: readingQs, l: TRIAL.lessons }) : t('reading_badge', { p: Object.keys(PASSAGES).length, q: readingQs, l: readingLessons })}</span>
      </a>
      <a class="skill writing" href="#/writing">
        <div class="skill-icon">✍️</div>
        <h2>Writing</h2><p>${t('writing_desc')}</p>
        <span class="badge go">${guest ? t('writing_badge_guest', { q: modQuestions('writing').length, l: TRIAL.lessons }) : t('writing_badge', { q: modQuestions('writing').length, l: LESSONS.length })}</span>
      </a>
    </section>`);
}

/* ---------- Reading: chọn mảng ---------- */

function viewReading() {
  const card = m => {
    const n = modQuestions(m).length, p = modPassages(m).length;
    const s = totals(m);
    return `
      <a class="big-choice part ${m}" href="${MODS[m].base}">
        <span class="bc-icon">${m === 'letter' ? '✉️' : '📰'}</span>
        <span class="bc-title">${t('crumb_' + m)}</span>
        <span class="bc-desc">${t(m + '_card', { p, n })}</span>
        <span class="bc-meta">${t('part_progress', { c: s.mastered, n })}</span>
      </a>`;
  };
  page(`
    ${crumbs([[t('crumb_home'), '#/'], [t('crumb_reading')]])}
    <section class="section-head">
      <h1>${t('reading_title')}</h1>
      <p>${t('reading_intro')}</p>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="big-choices">${card('letter')}${card('text')}</section>`);
}

/* ---------- Trang chủ của một mảng: Learn / Practice ---------- */

function viewHub(m) {
  const s = totals(m);
  const wrong = wrongIds(m).length;
  page(`
    ${crumbs(modCrumbs(m).slice(0, -1).concat([[m === 'writing' ? t('crumb_writing') : t('crumb_' + m)]]))}
    <section class="section-head">
      <h1>${t(m + '_title')}</h1>
      <p>${t(m + '_intro')}</p>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="big-choices">
      <a class="big-choice learn" href="${MODS[m].base}/learn">
        <span class="bc-icon">📘</span>
        <span class="bc-title">Learn</span>
        <span class="bc-desc">${mt('learn_card', m, { n: MODS[m].lessons.length })}</span>
      </a>
      <a class="big-choice practice" href="${MODS[m].base}/practice">
        <span class="bc-icon">🎯</span>
        <span class="bc-title">Practice</span>
        <span class="bc-desc">${t(isReading(m) ? 'practice_card_reading' : 'practice_card')}</span>
      </a>
    </section>
    <section class="mini-stats">
      <div><b>${s.mastered}/${s.total}</b><span>${t('mini_mastered')}</span></div>
      <div><b>${profile.streak}</b><span>${t('mini_streak')}</span></div>
      <div><b>${profile.bestStreak}</b><span>${t('mini_best')}</span></div>
      ${wrong ? `<a class="mini-cta" href="${MODS[m].base}/practice" data-start="wrong">${t('mini_wrong', { n: wrong })}</a>` : ''}
    </section>`);
  const cta = $('[data-start="wrong"]');
  if (cta) cta.addEventListener('click', e => { e.preventDefault(); startSession(m, 'wrong'); });
}

function viewLearnList(m) {
  const lessons = MODS[m].lessons;
  page(`
    ${crumbs(modCrumbs(m).concat([[t('crumb_learn')]]))}
    <section class="section-head">
      <h1>${mt('learn_title', m)}</h1>
      <p>${mt('learn_intro', m)}</p>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="lesson-grid">
      ${lessons.map((l, i) => {
        const n = questionsForTopic(l.id).length;
        const lt = lessonText(l);
        const locked = lessonLocked(i);
        return `<a class="lesson-card${locked ? ' locked' : ''}" href="${MODS[m].base}/learn/${l.id}">
          <span class="lc-icon">${l.icon}</span>
          <span class="lc-body"><span class="lc-num">${t('lesson_n', { n: i + 1 })}</span><span class="lc-title">${esc(lt.title)}</span><span class="lc-short">${esc(lt.short)}</span></span>
          ${locked ? `<span class="lc-count">🔒 ${t('locked')}</span>` : n ? `<span class="lc-count">${t('n_questions', { n })}</span>` : ''}
        </a>`;
      }).join('')}
    </section>`);
}

function viewLesson(m, id) {
  const lessons = MODS[m].lessons;
  const base = MODS[m].base;
  const idx = lessons.findIndex(l => l.id === id);
  if (idx < 0) return go(`${base}/learn`);
  const l = lessons[idx], prev = lessons[idx - 1], next = lessons[idx + 1];
  const lt = lessonText(l);
  const head = crumbs(modCrumbs(m).concat([[t('crumb_learn'), `${base}/learn`], [lt.title]]));
  if (lessonLocked(idx)) return page(`${head}${lockedHtml('locked_lesson')}`);
  const qs = questionsForTopic(id);
  page(`
    ${head}
    <article class="lesson">
      <header><span class="lesson-icon">${l.icon}</span><div><div class="lc-num">${t('lesson_n_of', { n: idx + 1, t: lessons.length })}</div><h1>${esc(lt.title)}</h1></div></header>
      <div class="lesson-body">${lt.body}</div>
      ${qs.length ? `
        <div class="lesson-practice">
          <div><b>${t('lesson_practice_title')}</b><span>${t('lesson_practice_desc', { n: qs.length })}</span></div>
          <button class="btn primary" id="practice-topic">${t('lesson_practice_btn', { n: qs.length })}</button>
        </div>` : `
        <div class="lesson-practice">
          <div><b>${t('lesson_ready_title')}</b><span>${t(isReading(m) ? 'lesson_ready_desc_reading' : 'lesson_ready_desc')}</span></div>
          <a class="btn primary" href="${base}/practice">${t('go_practice')}</a>
        </div>`}
    </article>
    <nav class="lesson-nav">
      ${prev ? `<a class="btn ghost" href="${base}/learn/${prev.id}">← ${esc(lessonText(prev).title)}</a>` : '<span></span>'}
      ${next ? `<a class="btn ghost" href="${base}/learn/${next.id}">${lessonLocked(idx + 1) ? '🔒 ' : ''}${esc(lessonText(next).title)} →</a>` : '<span></span>'}
    </nav>`);
  const btn = $('#practice-topic');
  if (btn) btn.addEventListener('click', () => startSession(m, 'topic', id, 'all'));
}

/* ---------- Luyện mỗi ngày ---------- */

const DAILY_MAX = 50;
const pad2 = n => String(n).padStart(2, '0');
const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const dailyN = () => Math.min(DAILY_MAX, Math.max(1, Math.round(Number(local.settings.dailyN) || 10)));
const dailyPlan = m => { const d = local.daily[m]; return d && d.uid === sessionOwner() && d.date === todayKey() ? d : null; };

// Số câu của mảng đã làm hôm nay (mọi chế độ), tính từ qstats trên Firestore nên đổi máy vẫn đúng.
function todayStats(m) {
  const from = startOfToday();
  const done = Object.entries(profile.qstats || {}).filter(([id, s]) => s && s.at >= from && Q_BY_ID[id] && modOf(Q_BY_ID[id]) === m).map(([, s]) => s);
  return { done: done.length, correct: done.filter(s => s.last).length };
}

function dailyCard(m) {
  const s = sess(m);
  const running = s && s.uid === sessionOwner() && s.kind && s.kind.mode === 'daily'
    && s.kind.value === todayKey() && s.i < s.ids.length && sessionInPool(s);
  const plan = dailyPlan(m);
  const today = todayStats(m);
  const wrong = wrongIds(m).filter(id => inPool(Q_BY_ID[id], modPool(m))).length;
  const fresh = modQuestions(m).filter(q => inPool(q, modPool(m)) && (!qstat(q.id) || !qstat(q.id).a)).length;
  let status = '', btn;
  if (running) {
    status = t('daily_running', { i: s.results.length, n: s.ids.length });
    btn = `<a class="btn primary" href="${MODS[m].base}/practice/run">${t('resume_btn')}</a>`;
  } else {
    if (today.done) status = t('daily_today', { n: today.done, c: today.correct });
    btn = `<button class="btn primary" id="daily-start">${t(plan ? 'daily_more' : 'daily_start', { n: dailyN() })}</button>`;
  }
  return `
    <section class="daily">
      <div class="daily-main">
        <h3>${t('daily_title')}</h3>
        <p>${t('daily_desc', { w: wrong, f: fresh })}</p>
        ${status ? `<p class="daily-status">${status}</p>` : ''}
      </div>
      <div class="daily-side">
        <label class="daily-n">${t('daily_n')} <input type="number" id="daily-n" min="1" max="${DAILY_MAX}" value="${dailyN()}" ${running ? 'disabled' : ''}></label>
        ${btn}
      </div>
    </section>`;
}

// Chọn câu cho hôm nay (không lặp lại các câu đã giao trong ngày) rồi bắt đầu lượt.
function startDaily(m) {
  const plan = dailyPlan(m);
  const done = plan ? plan.ids : [];
  let ids;
  if (isReading(m)) {
    // Reading chọn theo bài đọc (mỗi bài 4 câu): bài có câu sai → sai, còn câu chưa làm → mới,
    // còn lại → đã biết, xếp theo lần ôn gần nhất.
    const passages = modPassages(m).map(p => p.id).filter(p => passageQuestionIds(p).length);
    const stats = {};
    passages.forEach(p => {
      const st = passageQuestionIds(p).map(id => qstat(id));
      stats[p] = {
        last: !st.some(s => s && s.last === false),
        a: st.every(s => s && s.a) ? 1 : 0,
        at: Math.max(0, ...st.map(s => (s && s.at) || 0))
      };
    });
    const n = Math.max(1, Math.round(dailyN() / 4));
    const skip = [...new Set(done.filter(id => Q_BY_ID[id]).map(id => Q_BY_ID[id].passage))];
    let picked = window.Scoring.pickDaily({ questionIds: passages, qstats: stats, n, exclude: skip });
    if (!picked.length) picked = window.Scoring.pickDaily({ questionIds: passages, qstats: stats, n });
    ids = picked.flatMap(passageQuestionIds);
  } else {
    const all = modQuestions(m).filter(q => inPool(q, modPool(m))).map(q => q.id);
    ids = window.Scoring.pickDaily({ questionIds: all, qstats: profile.qstats, n: dailyN(), exclude: done });
    if (!ids.length) ids = window.Scoring.pickDaily({ questionIds: all, qstats: profile.qstats, n: dailyN() });
  }
  if (!ids.length) return;
  const fresh = ids.some(id => !done.includes(id));
  local.daily[m] = { uid: sessionOwner(), date: todayKey(), ids: (fresh ? done : []).concat(ids) };
  startSession(m, 'daily', ids);
}

/* ---------- Practice: chọn cách luyện ---------- */

function viewPracticeSetup(m) {
  const s = sess(m);
  const base = MODS[m].base;
  const reading = isReading(m);
  // Lượt dở của nguồn khác thì ẩn (vẫn giữ, chọn lại nguồn đó là thấy) — tránh bấm "Làm tiếp" lại ra câu cũ.
  const unfinished = s && s.i < s.ids.length && sessionInPool(s);
  const wrong = wrongIds(m).length;
  const topicCount = id => (reading ? questionsForTopic(id) : poolTopic(id)).length;
  const topicOptions = MODS[m].lessons.filter(l => topicCount(l.id))
    .map(l => `<option value="${l.id}">${esc(t('topic_option', { title: lessonText(l).title, n: topicCount(l.id) }))}</option>`).join('');
  const poolSwitch = reading ? '' : `
    <section class="pool">
      <span class="pool-label">${t('pool_label')}</span>
      <div class="pool-opts" role="group" aria-label="${t('pool_label')}">
        ${POOLS.map(p => `<button type="button" data-pool="${p}" class="${pool() === p ? 'active' : ''}" aria-pressed="${pool() === p}">${t('pool_' + p)} <small>${poolQuestions(p).length}</small></button>`).join('')}
      </div>
    </section>`;
  const options = `
    <section class="options">
      <label class="opt"><input type="checkbox" id="opt-random" ${local.settings.order === 'random' ? 'checked' : ''}> ${t(reading ? 'opt_random_reading' : 'opt_random')}</label>
      ${reading ? '' : `<label class="opt"><input type="checkbox" id="opt-strict" ${local.settings.strict ? 'checked' : ''}> <span>${t('opt_strict')}</span></label>`}
    </section>`;
  const resume = unfinished ? `
    <div class="resume">
      <div>${t('resume_label', { label: esc(sessionLabel(s)), i: s.i + 1, n: s.ids.length })}</div>
      <a class="btn primary" href="${base}/practice/run">${t('resume_btn')}</a>
    </div>` : '';
  const wrongCard = `
      <div class="setup-card ${wrong ? '' : 'muted'}">
        <h3>${t('setup_wrong')}</h3>
        <p>${wrong ? t('setup_wrong_desc', { n: wrong }) : t('setup_wrong_none')}</p>
        <button class="btn primary" data-mode="wrong" ${wrong ? '' : 'disabled'}>${t('setup_wrong_btn')}</button>
      </div>`;
  const head = `
    ${crumbs(modCrumbs(m).concat([[t('crumb_practice')]]))}
    <section class="section-head">
      <h1>${t(reading ? 'practice_title_' + m : 'practice_title')}</h1>
      <p>${t(reading ? 'practice_intro_reading' : 'practice_intro')}</p>
    </section>
    ${resume}`;

  if (guest) {
    page(`
      ${head}
      <section class="setup-grid">
        <div class="setup-card">
          <h3>${t('setup_trial')}</h3>
          <p>${t(reading ? 'setup_trial_desc_reading' : 'setup_trial_desc', { n: modQuestions(m).length })}</p>
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
    return bindPracticeSetup(m);
  }

  const examOptions = [1, 2].map(b => `<optgroup label="${t('book', { b })}">${
    Array.from({ length: 30 }, (_, i) => i + 1).filter(d => EXAMS[MODS[m].examPrefix + examKey(b, d)])
      .map(d => {
        const p = PASSAGES[MODS[m].examPrefix + examKey(b, d)];
        return `<option value="${b}-${d}">${esc(t('exam', { b, d }) + (reading && p ? ` · ${p.title}` : ''))}</option>`;
      }).join('')
  }</optgroup>`).join('');
  const allCard = reading ? `
      <div class="setup-card">
        <h3>${t('setup_all_' + m)}</h3>
        <p>${t('setup_all_desc_reading', { p: modPassages(m).length, n: modQuestions(m).length })}</p>
        <button class="btn primary" data-mode="all">${t('start')}</button>
      </div>` : `
      <div class="setup-card">
        <h3>${t('setup_all_' + pool())}</h3>
        <p>${t('setup_all_desc_' + pool(), { n: poolQuestions().length, b: poolQuestions('book').length, g: poolQuestions('gen').length })}</p>
        <button class="btn primary" data-mode="all">${t('start')}</button>
      </div>`;

  page(`
    ${head}
    ${poolSwitch}
    ${dailyCard(m)}
    <section class="setup-grid">
      ${allCard}
      <div class="setup-card">
        <h3>${t(reading ? 'setup_topic_reading' : 'setup_topic')}</h3>
        <select id="sel-topic">${topicOptions}</select>
        <button class="btn primary" data-mode="topic">${t('start')}</button>
      </div>
      ${!reading && pool() === 'gen' ? '' : `<div class="setup-card">
        <h3>${t('setup_exam')}</h3>
        <select id="sel-exam">${examOptions}</select>
        <button class="btn primary" data-mode="exam">${t(reading ? 'setup_exam_btn_' + m : 'setup_exam_btn')}</button>
      </div>`}
      ${wrongCard}
    </section>
    ${options}`);
  bindPracticeSetup(m);
}

function bindPracticeSetup(m) {
  $('#opt-random').addEventListener('change', e => { local.settings.order = e.target.checked ? 'random' : 'seq'; saveLocal(); });
  const strict = $('#opt-strict');
  if (strict) strict.addEventListener('change', e => { local.settings.strict = e.target.checked; saveLocal(); });
  const nInput = $('#daily-n');
  if (nInput) {
    nInput.addEventListener('input', () => {
      if (!nInput.value) return;
      local.settings.dailyN = nInput.value;
      saveLocal();
      const b = $('#daily-start');
      if (b) b.textContent = t(dailyPlan(m) ? 'daily_more' : 'daily_start', { n: dailyN() });
    });
    nInput.addEventListener('change', () => { nInput.value = dailyN(); });
  }
  $$('[data-pool]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.pool === pool()) return;
    local.settings.pool = b.dataset.pool;
    saveLocal();
    viewPracticeSetup(m);
  }));
  const daily = $('#daily-start');
  if (daily) daily.addEventListener('click', () => startDaily(m));
  $$('[data-mode]').forEach(b => b.addEventListener('click', () => {
    const mode = b.dataset.mode;
    if (mode === 'topic') startSession(m, 'topic', $('#sel-topic').value);
    else if (mode === 'exam') startSession(m, 'exam', $('#sel-exam').value);
    else startSession(m, mode);
  }));
}

// Câu Reading luôn làm theo cả bài đọc: bài nào có câu trong lượt thì lấy đủ mọi câu của bài đó
// (theo số câu), giữ thứ tự bài xuất hiện; shuffled: xáo thứ tự các bài.
const passageQuestionIds = p => QUESTIONS.filter(q => q.passage === p).sort((a, b) => a.num - b.num).map(q => q.id);
function groupByPassage(ids, shuffled) {
  const list = [...new Set(ids.map(id => Q_BY_ID[id].passage))].map(passageQuestionIds);
  return (shuffled ? shuffle(list) : list).flat();
}

// Mỗi lượt gắn với một bộ đề (exams); ôn câu sai dùng bộ "tất cả" của mảng (chứa mọi câu).
// poolOverride: bỏ qua nguồn câu đang chọn (vd. luyện chủ điểm từ trang bài học → mọi câu).
function startSession(m, mode, value, poolOverride) {
  let examId, ids;
  const mod = MODS[m];
  // Chọn theo nguồn câu (sách / tạo bởi AI) cho lượt tất cả, chủ điểm và luyện mỗi ngày.
  const p = poolOverride || (!guest && ['all', 'topic', 'daily'].includes(mode || 'all') ? modPool(m) : 'all');
  if (mode === 'topic') { examId = 'topic-' + value; ids = (EXAMS[examId] || {}).questionIds || questionsForTopic(value).map(q => q.id); }
  else if (mode === 'exam') { const [b, d] = value.split('-'); examId = mod.examPrefix + examKey(b, d); ids = (EXAMS[examId] || {}).questionIds || []; }
  else if (mode === 'wrong') { examId = mod.allExam; ids = wrongIds(m); }
  else if (mode === 'retry') { examId = mod.allExam; ids = value; }
  else if (mode === 'daily') { examId = mod.allExam; ids = value; value = todayKey(); }
  else { mode = 'all'; examId = mod.allExam; ids = (EXAMS[examId] || {}).questionIds || modQuestions(m).map(q => q.id); }
  ids = ids.filter(id => Q_BY_ID[id] && modOf(Q_BY_ID[id]) === m && inPool(Q_BY_ID[id], p));
  if (!ids.length) return;
  if (guest) examId = 'trial';
  const random = local.settings.order === 'random' && mode !== 'exam' && mode !== 'daily';
  if (isReading(m)) ids = groupByPassage(ids, random);
  else if (random) ids = shuffle(ids);
  local.sessions[m] = {
    uid: sessionOwner(), mod: m,
    kind: { mode, value: mode === 'retry' ? null : value, pool: p },
    examId, ids, i: 0, results: [], starsEarned: 0, submissionId: null, pending: null, guestSub: null
  };
  saveLocal();
  go(`${mod.base}/practice/run`);
}

/* ---------- Practice: làm bài ---------- */

function streakSlots() {
  const r = profile.streak % STREAK_BONUS_EVERY;
  const filled = profile.streak > 0 && r === 0 ? STREAK_BONUS_EVERY : r;
  return Array.from({ length: STREAK_BONUS_EVERY }, (_, i) => `<span class="slot ${i < filled ? 'on' : ''}">★</span>`).join('');
}

function runTop(s, pending) {
  const need = STREAK_BONUS_EVERY - (profile.streak % STREAK_BONUS_EVERY);
  const progress = pct(s.i + (pending ? 1 : 0), s.ids.length);
  return `
    <section class="run-top">
      <div class="run-progress">
        <div class="run-count">${t('q_count', { i: s.i + 1, n: s.ids.length })}</div>
        <div class="bar"><span style="width:${progress}%"></span></div>
      </div>
      <div class="streak" title="${t('streak_tip', { e: STREAK_BONUS_EVERY, b: STREAK_BONUS_STARS })}">
        <div class="slots">${streakSlots()}</div>
        <div class="streak-text">${t('streak_text', { s: profile.streak, n: need, b: STREAK_BONUS_STARS })}</div>
      </div>
    </section>`;
}

// Câu khen / động viên ngẫu nhiên (các câu cách nhau bằng |).
const pick = key => { const list = t(key).split('|'); return list[Math.floor(Math.random() * list.length)]; };

const hintHtml = q => t('hint', {
  topics: q.topics.map(id => `<a href="${lessonHref(id)}" target="_blank">${esc(topicTitle(id))}</a>`).join(', ')
});

function viewPracticeRun(m) {
  const s = sess(m);
  if (!s || !s.examId) return go(`${MODS[m].base}/practice`);
  if (s.i >= s.ids.length) return viewSummary(m);
  const q = Q_BY_ID[s.ids[s.i]];
  if (!q || (isReading(m) && !PASSAGES[q.passage])) { s.i += 1; saveLocal(); return viewPracticeRun(m); }
  return isReading(m) ? viewReadingRun(m, s, q) : viewWritingRun(s, q);
}

// Chấm một câu (Writing: câu viết; Reading: 'A' / 'B' / 'C' / 'True' / 'False') rồi lưu kết quả.
function submitAnswer(s, q, userAnswer) {
  return guest
    ? api.checkTrialAnswer({ profile, sub: s.guestSub, questionId: q.id, userAnswer, strict: local.settings.strict })
    : api.checkAnswer({
      examId: s.examId,
      submissionId: s.submissionId,
      questionId: q.id,
      userAnswer,
      strict: local.settings.strict,
      final: s.i === s.ids.length - 1
    });
}

function viewWritingRun(s, q) {
  const pending = s.pending && s.pending.i === s.i ? s.pending : null;

  page(`
    ${crumbs([[t('crumb_writing'), '#/writing'], [t('crumb_practice'), '#/writing/practice'], [sessionLabel(s)]])}
    ${runTop(s, pending)}

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
          <button class="btn primary big check" id="btn-check">${t('btn_check')}</button>`}
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
    next.addEventListener('click', () => nextQuestion(s.mod));
    ta.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); nextQuestion(s.mod); } });
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
    h.innerHTML = hintHtml(q);
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
      applyResult(s, await submitAnswer(s, q, text));
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

/* ---------- Reading: làm bài ---------- */

let lastPassage = null;   // bài đọc của lần vẽ trước — cùng bài thì giữ vị trí cuộn

// Tô sáng các đoạn bằng chứng (evidence) rồi thay chỗ trống "(5)________" bằng ô điền.
// gaps: { [số câu]: { word, wrong, cls } } — đáp án đúng, phương án sai bạn đã chọn (gạch đi) và kiểu (current / ok / bad).
function passageTextHtml(raw, evidence, gaps) {
  const ranges = [];
  (evidence || []).forEach(e => {
    const at = raw.indexOf(e);
    if (e && at >= 0) ranges.push([at, at + e.length]);
  });
  ranges.sort((a, b) => a[0] - b[0]);
  const merged = [];
  ranges.forEach(r => { const last = merged[merged.length - 1]; if (last && r[0] <= last[1]) last[1] = Math.max(last[1], r[1]); else merged.push(r.slice()); });
  const fill = str => esc(str).replace(/\((\d)\)_{3,}/g, (all, n) => {
    const g = gaps[n] || {};
    const word = g.word ? `${g.wrong ? `<s>${esc(g.wrong)}</s> ` : ''}<span class="gap-word">${esc(g.word)}</span>` : '<span class="gap-line"></span>';
    return `<span class="gap ${g.cls || ''}" data-n="${n}"><b>(${n})</b> ${word}</span>`;
  });
  let out = '', pos = 0;
  merged.forEach(([a, b]) => { out += fill(raw.slice(pos, a)) + `<mark class="evi">${fill(raw.slice(a, b))}</mark>`; pos = b; });
  return out + fill(raw.slice(pos));
}

function passageHtml(p, q, s, pending) {
  const evidence = pending ? pending.result.evidence : [];
  const gaps = {};
  if (p.part === 'text') {
    // Các câu của bài này đã làm trong lượt: điền đáp án đúng vào chỗ trống.
    s.results.forEach(r => {
      const rq = Q_BY_ID[r.id];
      if (rq && rq.passage === p.id) gaps[rq.num] = { word: optionText(rq, r.answer), wrong: r.correct ? null : optionText(rq, r.picked), cls: r.correct ? 'ok' : 'bad' };
    });
    if (!pending) gaps[q.num] = { cls: 'current' };
  }
  const paras = p.part === 'letter' ? p.paragraphs : [p.text];
  const last = paras.length - 1;
  return `
    <article class="passage ${p.part}">
      <div class="passage-head"><span class="passage-label">${t('passage_' + p.part)}</span><span class="q-src">${sourceLabel([p.source])}</span></div>
      ${paras.map((para, i) => {
        const cls = p.part === 'letter' ? (i === 0 ? ' class="greet"' : i === last ? ' class="sign"' : '') : '';
        return `<p${cls}>${passageTextHtml(para, evidence, gaps)}</p>`;
      }).join('')}
    </article>`;
}

function choicesHtml(q, pending, picked) {
  const values = q.type === 'reading_tf' ? ['True', 'False'] : ['A', 'B', 'C'];
  const res = pending && pending.result;
  return `<div class="choices ${q.type === 'reading_tf' ? 'tf' : 'mc'}" role="radiogroup" aria-label="${t('choices_label')}">${values.map(v => {
    const cls = ['choice'];
    if (res) {
      if (v === res.answer) cls.push('right');
      else if (v === res.userAnswer) cls.push('wrong');
    } else if (v === picked) cls.push('picked');
    const text = q.options ? q.options['ABC'.indexOf(v)] : v;
    const key = q.options ? v : v[0];
    return `<button type="button" class="${cls.join(' ')}" data-choice="${v}" role="radio" aria-checked="${res ? v === res.userAnswer : v === picked}" ${res ? 'disabled' : ''}>
      <span class="ch-key">${key}</span><span class="ch-text">${esc(text)}</span></button>`;
  }).join('')}</div>`;
}

function viewReadingRun(m, s, q) {
  const p = PASSAGES[q.passage];
  const pending = s.pending && s.pending.i === s.i ? s.pending : null;
  const samePassage = lastPassage === p.id;
  lastPassage = p.id;
  const label = q.type === 'reading_tf' ? t('q_label_tf') : q.prompt ? t('q_label_mc') : t('q_label_blank', { n: q.num });
  const prompt = q.prompt ? esc(q.prompt).replace(/_{3,}/, '<span class="gap-line"></span>') : t('blank_prompt', { n: q.num });
  let picked = null;

  page(`
    ${crumbs(modCrumbs(m).slice(1).concat([[t('crumb_practice'), `${MODS[m].base}/practice`], [sessionLabel(s)]]))}
    ${runTop(s, pending)}
    <section class="read-run">
      <div class="read-passage">${passageHtml(p, q, s, pending)}</div>
      <div class="read-side">
        <section class="q-card" id="q-card">
          <div class="q-head">
            <span class="q-label">${label}</span>
            <span class="q-src">${t('q_num', { n: q.num })}</span>
          </div>
          <div class="rq-prompt">${prompt}</div>
          ${choicesHtml(q, pending, picked)}
          <div class="q-meta"><span></span><span class="kbd-hint">${pending ? t('enter_next') : t(q.type === 'reading_tf' ? 'keys_tf' : 'keys_mc')}</span></div>
          <div id="hint" class="hint" hidden></div>
          <div id="submit-error" class="submit-error" hidden></div>
          <div class="q-actions">
            ${pending ? `
              <span></span>
              <button class="btn primary big" id="btn-next">${s.i + 1 < s.ids.length ? t('btn_next') : t('btn_finish')}</button>` : `
              <button class="btn ghost" id="btn-hint">${t('btn_hint')}</button>
              <button class="btn primary big check" id="btn-check">${t('btn_check')}</button>`}
          </div>
        </section>
        <div id="feedback">${pending ? readingFeedbackHtml(pending.result, q) : ''}</div>
      </div>
    </section>`, samePassage);

  const typing = e => e.ctrlKey || e.metaKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement && document.activeElement.tagName);

  if (pending) {
    const next = $('#btn-next');
    next.addEventListener('click', () => nextQuestion(m));
    setKeys(e => { if (e.key === 'Enter' && !typing(e)) { e.preventDefault(); nextQuestion(m); } });
    next.focus({ preventScroll: true });
    $('#feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }
  if (samePassage) $('#q-card').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const btnCheck = $('#btn-check');
  const choose = v => {
    if (picked !== v) window.Sound.play('tap');
    picked = v;
    $$('[data-choice]').forEach(b => {
      const on = b.dataset.choice === v;
      b.classList.toggle('picked', on);
      b.setAttribute('aria-checked', on);
    });
  };
  $$('[data-choice]').forEach(b => b.addEventListener('click', () => choose(b.dataset.choice)));
  const keyMap = q.type === 'reading_tf' ? { t: 'True', f: 'False', 1: 'True', 2: 'False' } : { a: 'A', b: 'B', c: 'C', 1: 'A', 2: 'B', 3: 'C' };
  setKeys(e => {
    if (typing(e)) return;
    const v = keyMap[e.key.toLowerCase()];
    if (v) { e.preventDefault(); choose(v); }
    else if (e.key === 'Enter' && !(document.activeElement && document.activeElement.id === 'btn-hint')) { e.preventDefault(); check(); }
  });
  btnCheck.addEventListener('click', check);
  $('#btn-hint').addEventListener('click', () => {
    const h = $('#hint');
    h.innerHTML = hintHtml(q);
    h.hidden = !h.hidden;
  });

  let busy = false;
  async function check() {
    if (busy) return;
    if (!picked) {
      const box = $('.choices');
      box.classList.add('shake');
      setTimeout(() => box.classList.remove('shake'), 400);
      return;
    }
    busy = true;
    btnCheck.disabled = true;
    btnCheck.textContent = t('checking');
    $('#submit-error').hidden = true;
    try {
      applyResult(s, await submitAnswer(s, q, picked));
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

function readingFeedbackHtml(r, q) {
  const banner = r.correct
    ? `<div class="banner ok"><span class="b-icon">🦉</span><div><b>${r.praise || t('fb_ok')}</b> <span class="plus-star">+1 ★</span>${r.bonus ? ` <span class="bonus">${t('fb_bonus', { b: STREAK_BONUS_STARS, e: STREAK_BONUS_EVERY })}</span>` : ''}</div></div>`
    : `<div class="banner bad"><span class="b-icon">🤔</span><div>${t('fb_bad_choice', { a: esc(choiceLabel(q, r.answer)) })}</div></div>`;
  const steps = (r.explanation && (r.explanation[lang()] || r.explanation.vi)) || [];
  return `
    <section class="feedback ${r.correct ? 'is-ok' : 'is-bad'}">
      ${banner}
      <div class="compare">
        <div class="cmp-row"><span class="cmp-label">${t('cmp_picked')}</span><div class="cmp-text ${r.correct ? 'ok' : 'bad'}">${esc(choiceLabel(q, r.userAnswer))}</div></div>
        ${r.correct ? '' : `<div class="cmp-row"><span class="cmp-label">${t('cmp_right')}</span><div class="cmp-text ok">${esc(choiceLabel(q, r.answer))}</div></div>`}
      </div>
      ${r.evidence && r.evidence.length ? `<p class="evi-note">${t('evi_note')}</p>` : ''}
      <div class="why">
        <h3>${t('why_title')}</h3>
        <ol>${steps.map(st => `<li>${st}</li>`).join('')}</ol>
        <div class="why-topics">${t('review')} ${q.topics.map(id => `<a class="chip" href="${lessonHref(id)}">${esc(topicTitle(id))}</a>`).join('')}</div>
      </div>
    </section>`;
}

function applyResult(s, res) {
  const r = res.result;
  if (r.correct) r.praise = pick('praise');
  s.submissionId = res.submissionId;
  profile = res.profile;
  if (guest) { s.guestSub = res.sub; local.guestProfile = profile; }
  if (!r.duplicate) s.starsEarned += r.starsEarned;
  s.results.push({ id: r.questionId, correct: r.correct, answer: r.answer, picked: r.userAnswer });
  s.pending = { i: s.i, result: r };
  saveLocal();
  renderHeader();
  viewPracticeRun(s.mod);
  const bonus = r.bonus && !r.duplicate;
  if (r.correct) {
    window.Sound.play('correct');
    // Bung từ chỗ đang nhìn (đáp án đúng / ô viết câu), vì phần kết quả còn đang cuộn tới.
    confetti($('.choice.right') || $('#answer') || $('.banner.ok'), bonus ? 60 : 24);
  } else {
    window.Sound.play('wrong');
    const card = $('.q-card');
    if (card) { card.classList.remove('wobble'); void card.offsetWidth; card.classList.add('wobble'); }
  }
  if (r.correct && r.starsEarned) { bumpStars(); setTimeout(() => window.Sound.play('star'), 380); }
  if (bonus) setTimeout(() => celebrate(profile.streak), 500);
}

function nextQuestion(m) {
  const s = sess(m);
  s.i += 1;
  s.pending = null;
  saveLocal();
  viewPracticeRun(m);
}

// kind: ok | wrong | extra | missing (xem Grader.lcsDiff).
// Ở câu mẫu (answer), từ "wrong" là từ đúng cần viết → tô xanh như từ thiếu, không gạch.
function markedSentence(marks, answer) {
  const cls = m => (answer ? 'missing' : m.kind || 'wrong');
  return marks.map(m => `<span class="${m.ok ? 'w' : 'w ' + cls(m)}">${esc(m.word)}</span>`).join(' ');
}

// Tóm tắt lỗi theo từ: thiếu / dùng sai / thừa.
function diffHtml(d) {
  if (!d) return '';
  const w = (x, cls) => `<span class="w ${cls}">${esc(x)}</span>`;
  const rows = [];
  if (d.missing.length) rows.push(`<li>${t('diff_missing')} ${d.missing.map(x => w(x, 'missing')).join(' ')}</li>`);
  if (d.wrong.length) rows.push(`<li>${t('diff_wrong')} ${d.wrong.map(p => `${w(p.got, 'wrong')} → ${w(p.want, 'missing')}`).join(', ')}</li>`);
  if (d.extra.length) rows.push(`<li>${t('diff_extra')} ${d.extra.map(x => w(x, 'extra')).join(' ')}</li>`);
  return rows.length ? `<ul class="diff">${rows.join('')}</ul>` : '';
}

const issueText = issue => t('issue_' + issue.code, { n: issue.n });

// r: kết quả chấm một câu Writing (Scoring.applyAnswer → result).
function feedbackHtml(r) {
  let banner;
  if (r.correct) {
    banner = `<div class="banner ok"><span class="b-icon">🦉</span><div><b>${r.praise || t('fb_ok')}</b> <span class="plus-star">+1 ★</span>${r.bonus ? ` <span class="bonus">${t('fb_bonus', { b: STREAK_BONUS_STARS, e: STREAK_BONUS_EVERY })}</span>` : ''}${r.sameAsBook ? '' : `<div class="banner-sub">${t('fb_ok_variant')}</div>`}</div></div>`;
  } else if (r.error === 'TOO_LONG') {
    banner = `<div class="banner bad"><span class="b-icon">✂️</span><div>${t('fb_long', { n: r.wordCount })}</div></div>`;
  } else if (r.contentOk) {
    banner = `<div class="banner bad"><span class="b-icon">✋</span><div>${t('fb_form')}</div></div>`;
  } else {
    banner = `<div class="banner bad"><span class="b-icon">🤔</span><div>${t('fb_bad')}</div></div>`;
  }

  const compare = !r.contentOk && r.userMarks ? `
    <div class="compare">
      <div class="cmp-row"><span class="cmp-label">${t('cmp_yours')}</span><div class="cmp-text">${markedSentence(r.userMarks)}</div></div>
      <div class="cmp-row"><span class="cmp-label">${t('cmp_closest')}</span><div class="cmp-text">${markedSentence(r.answerMarks, true)}</div></div>
      ${diffHtml(r.diff)}
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
      ${r.issues.length ? `<div class="issues"><b>${r.correct ? t('issues_note') : t('issues_err')}</b><ul>${r.issues.filter(i => !(r.error === 'TOO_LONG' && i.code === 'len')).map(i => `<li>${issueText(i)}</li>`).join('')}</ul></div>` : ''}
      ${compare}
      ${r.variants && r.variants.length ? `<div class="alts"><b>${t('alts_title')}</b><ul>${r.variants.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
      <div class="why">
        <h3>${t('why_title')}</h3>
        <ol>${steps.map(st => `<li>${st}</li>`).join('')}</ol>
        <div class="why-topics">${t('review')} ${topics.map(id => `<a class="chip" href="${lessonHref(id)}">${esc(topicTitle(id))}</a>`).join('')}</div>
      </div>
    </section>`;
}

function viewSummary(m) {
  const s = sess(m);
  const base = MODS[m].base;
  const correct = s.results.filter(r => r.correct).length;
  const wrongInSession = s.results.filter(r => !r.correct).map(r => r.id);
  const total = s.results.length;
  const p = pct(correct, total);
  const msg = p === 100 ? t('sum_100') : p >= 80 ? t('sum_80') : p >= 50 ? t('sum_50') : t('sum_low');
  const face = p === 100 ? '🏆' : p >= 80 ? '🥳' : p >= 50 ? '😊' : '💪';
  lastPassage = null;
  page(`
    ${crumbs(modCrumbs(m).slice(1).concat([[t('crumb_practice'), `${base}/practice`], [t('crumb_summary')]]))}
    <section class="summary">
      <div class="sum-face" aria-hidden="true">${face}</div>
      <div class="sum-stars">★ +${s.starsEarned}</div>
      <h1>${msg}</h1>
      <p>${t('sum_detail', { label: esc(sessionLabel(s)), c: correct, t: total, p })}</p>
      ${s.kind && s.kind.mode === 'daily' && wrongInSession.length ? `<p class="sum-note">${t('sum_daily_note', { n: wrongInSession.length })}</p>` : ''}
      <div class="sum-actions">
        ${wrongInSession.length ? `<button class="btn primary" id="retry">${t('sum_retry', { n: wrongInSession.length })}</button>` : ''}
        <a class="btn ${wrongInSession.length ? 'ghost' : 'primary'}" href="${base}/practice">${t('sum_new')}</a>
        ${guest ? `<button class="btn ghost" data-login>${t('sum_login')}</button>` : `<a class="btn ghost" href="#/results">${t('sum_total')}</a>`}
      </div>
    </section>
    ${guest ? guestBanner() : ''}
    <section class="sum-list">
      ${s.results.map((r, i) => {
        const q = Q_BY_ID[r.id];
        return `<div class="sum-item ${r.correct ? 'ok' : 'bad'}"><span class="mark">${r.correct ? '✓' : '✗'}</span><div><div class="sum-cue">${i + 1}. ${esc(q ? questionLabel(q) : r.id)}</div><div class="sum-ans">${esc(answerLabel(q, r.answer || ''))}</div></div></div>`;
      }).join('')}
    </section>`);
  const retry = $('#retry');
  if (retry) retry.addEventListener('click', () => startSession(m, 'retry', wrongInSession));
  // Chỉ chúc mừng ngay sau khi làm xong (không phát lại khi tải lại trang tóm tắt).
  if (s.cheered !== true) {
    s.cheered = true;
    saveLocal();
    window.Sound.play('finish');
    if (p >= 80) confetti($('.sum-face'), 70);
  }
}

/* ---------- Hiệu ứng ---------- */

function bumpStars() {
  const pill = $('.star-pill');
  if (!pill) return;
  pill.classList.remove('bump'); void pill.offsetWidth; pill.classList.add('bump');
}

// Pháo giấy bung ra từ phần tử origin (không có thì từ giữa màn hình).
const CONFETTI_COLORS = ['#ff6b6b', '#ffd43b', '#51cf66', '#339af0', '#cc5de8', '#ff922b', '#22b8cf'];
function confetti(origin, n = 30) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = origin ? origin.getBoundingClientRect() : { left: innerWidth / 2 - 20, top: innerHeight / 3, width: 40, height: 0 };
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < n; i++) {
    const bit = document.createElement('i');
    const angle = Math.random() * Math.PI * 2, dist = 80 + Math.random() * 180;
    bit.style.left = `${r.left + r.width / 2}px`;
    bit.style.top = `${r.top + r.height / 2}px`;
    bit.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    bit.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
    bit.style.setProperty('--dy', `${Math.sin(angle) * dist - 120}px`);
    bit.style.setProperty('--rot', `${Math.random() * 720 - 360}deg`);
    bit.style.animationDelay = `${Math.random() * 0.12}s`;
    if (i % 3 === 0) bit.classList.add('round');
    layer.appendChild(bit);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 1600);
}

function celebrate(streak) {
  window.Sound.play('bonus');
  confetti(null, 90);
  const el = document.createElement('div');
  el.className = 'celebrate';
  el.innerHTML = `<div class="cel-card"><div class="cel-mascot">🦉</div><div class="cel-stars">${'★'.repeat(STREAK_BONUS_STARS)}</div><b>${t('cel_title', { n: streak })}</b><span>${t('cel_sub', { b: STREAK_BONUS_STARS })}</span></div>`;
  document.body.appendChild(el);
  el.addEventListener('click', () => el.remove());
  setTimeout(() => el.remove(), 2600);
}

/* ---------- Kết quả ---------- */

function viewResults() {
  const s = totals();
  const topicRows = m => MODS[m].lessons.filter(l => questionsForTopic(l.id).length).map(l => {
    let a = 0, c = 0;
    questionsForTopic(l.id).forEach(q => { const st = qstat(q.id); if (st) { a += st.a; c += st.c; } });
    return `
        <a class="topic-row" href="${lessonHref(l.id)}">
          <span class="tr-name">${l.icon} ${esc(lessonText(l).title)}</span>
          <span class="tr-bar"><span style="width:${pct(c, a)}%" class="${a && pct(c, a) < 60 ? 'low' : ''}"></span></span>
          <span class="tr-num">${a ? `${c}/${a} · ${pct(c, a)}%` : t('not_done')}</span>
        </a>`;
  }).join('');

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
      <div class="tile"><b>${s.mastered}/${s.total}</b><span>${t('tile_mastered')}</span></div>
      <div class="tile"><b>${profile.bestStreak}</b><span>${t('tile_best')}</span></div>
      <div class="tile"><b>${profile.bonusCount}</b><span>${t('tile_bonus')}</span></div>
    </section>

    <section class="panel">
      <h2>${t('by_topic')}</h2>
      ${s.answered ? ['writing', 'letter', 'text'].map(m => `
        <h3 class="topic-group">${m === 'writing' ? 'Writing' : `Reading · ${t('crumb_' + m)}`} <small>${t('part_progress', { c: totals(m).mastered, n: totals(m).total })}</small></h3>
        <div class="topic-rows">${topicRows(m)}</div>`).join('') : `<p class="empty">${t('empty_start')}</p>`}
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
      local.sessions = {};
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
      <div class="h-body"><div class="h-cue">${esc(q ? questionLabel(q) : h.questionId)}</div><div class="h-text">${esc(answerLabel(q, h.userAnswer))}</div>${h.correct || !h.bookAnswer ? '' : `<div class="h-ans">→ ${esc(answerLabel(q, h.bookAnswer))}</div>`}</div>
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

// Trang con của một mảng: '' | learn[/id] | practice[/run]
function routeMod(m, rest) {
  if (!rest[0]) return viewHub(m);
  if (rest[0] === 'learn') return rest[1] ? viewLesson(m, rest[1]) : viewLearnList(m);
  if (rest[0] === 'practice') return rest[1] === 'run' ? viewPracticeRun(m) : viewPracticeSetup(m);
  return viewHub(m);
}

function route() {
  const h = location.hash || '#/';
  renderHeader();
  const parts = h.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!(parts[0] === 'reading' && parts[3] === 'run')) lastPassage = null;
  if (!parts.length) return viewHome();
  if (parts[0] === 'results') return guest ? viewHome() : viewResults();
  if (parts[0] === 'writing') return routeMod('writing', parts.slice(1));
  if (parts[0] === 'reading') {
    if (!parts[1]) return viewReading();
    if (isReading(parts[1]) && MODS[parts[1]]) return routeMod(parts[1], parts.slice(2));
    return viewReading();
  }
  viewHome();
}

function viewLogin(errorKey) {
  ready = false;
  renderHeader();
  page(`
    <section class="login">
      <div class="login-mascot" aria-hidden="true">🦉</div>
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
        <p>${t('trial_desc', { l: TRIAL.lessons, q: TRIAL_QUESTIONS })}</p>
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

function clearCatalog() {
  profile = Object.assign({}, api.PROFILE_DEFAULTS);
  QUESTIONS = []; Q_BY_ID = {}; EXAMS = {}; PASSAGES = {};
}

// Khách bấm "Đăng nhập": về trang đăng nhập, vẫn giữ kết quả làm thử để quay lại được.
function showLogin() {
  guest = false;
  local.settings.guest = false;
  saveLocal();
  clearCatalog();
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
  clearCatalog();
  location.hash = '#/';
  viewLogin();
}

let routing = false;
async function boot() {
  ready = false;
  page(`<div class="boot"><div class="boot-mascot" aria-hidden="true">🦉</div><div class="spinner"></div><p>${t('loading')}</p></div>`);
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
    PASSAGES = catalog.passages || {};
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
  Object.keys(local.sessions).forEach(m => {
    const s = local.sessions[m];
    if (!MODS[m] || !s || s.uid !== sessionOwner()) delete local.sessions[m];
  });
  saveLocal();
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
