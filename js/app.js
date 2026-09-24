(function () {
  'use strict';

  const QUESTIONS = window.WRITING_QUESTIONS;
  const LESSONS = window.LESSONS;
  const Q_BY_ID = Object.fromEntries(QUESTIONS.map(q => [q.id, q]));
  const STREAK_BONUS_EVERY = 5;
  const STREAK_BONUS_STARS = 5;
  const HISTORY_LIMIT = 1000;

  /* ---------- Lưu trữ trên máy (localStorage) ---------- */

  const STORAGE_KEY = 'tdn-english-v1';

  function defaults() {
    return {
      version: 1,
      name: '',
      stars: 0,
      streak: 0,
      bestStreak: 0,
      bonusCount: 0,
      qstats: {},     // id -> { a: số lần làm, c: số lần đúng, last: lần gần nhất đúng? }
      history: [],    // { id, text, correct, stars, t }
      settings: { strict: false, order: 'random', lang: 'vi' },
      session: null
    };
  }

  function merge(data) {
    return Object.assign(defaults(), data, { settings: Object.assign(defaults().settings, data.settings) });
  }

  let storageOk = true;
  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? merge(JSON.parse(raw)) : defaults();
    } catch (e) {
      storageOk = false;
      return defaults();
    }
  }
  let state = load();
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); storageOk = true; }
    catch (e) { storageOk = false; }
  }

  /* ---------- Ngôn ngữ ---------- */

  const lang = () => (state.settings.lang === 'en' ? 'en' : 'vi');
  function t(key, params) {
    const dict = window.I18N[lang()];
    let s = key in dict ? dict[key] : window.I18N.vi[key];
    if (s === undefined) return key;
    if (params) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? params[k] : m));
    return s;
  }
  const lessonText = l => (lang() === 'en' && window.LESSONS_EN[l.id]) || l;
  const lessonById = id => LESSONS.find(l => l.id === id);
  const topicTitle = id => { const l = lessonById(id); return l ? lessonText(l).title : id; };
  const stepsOf = q => q[lang()] || q.vi;

  const FLAG_VN = '<svg viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#DA251D"/><polygon fill="#FFFF00" points="15,4 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15"/></svg>';
  const FLAG_EN = '<svg viewBox="0 0 60 30" aria-hidden="true"><clipPath id="uk-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="uk-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath><g clip-path="url(#uk-s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#uk-t)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></svg>';

  function setLang(l) {
    if (l === lang()) return;
    state.settings.lang = l;
    save();
    route();
  }

  /* ---------- Tiện ích ---------- */

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pct = (c, a) => a ? Math.round(c * 100 / a) : 0;
  const srcLabel = src => src.map(([b, d]) => t('src_item', { b, d })).join(' | ');
  const questionsForTopic = id => QUESTIONS.filter(q => q.topics.includes(id));
  const wrongIds = () => QUESTIONS.filter(q => state.qstats[q.id] && state.qstats[q.id].last === false).map(q => q.id);
  const cuesHtml = cues => cues.replace(/\s*\/\/\s*$/, '').split('/').map(c => `<span class="cue">${esc(c.trim())}</span>`).join('<span class="slash">/</span>');

  function totals() {
    const answered = state.history.length;
    const correct = state.history.filter(h => h.correct).length;
    const mastered = QUESTIONS.filter(q => state.qstats[q.id] && state.qstats[q.id].c > 0).length;
    return { answered, correct, mastered };
  }

  // Nhãn lượt luyện được lưu dạng mô tả để đổi ngôn ngữ vẫn hiển thị đúng.
  function sessionLabel(s) {
    const k = s.kind || {};
    if (k.mode === 'topic') return t('label_topic', { t: topicTitle(k.value) });
    if (k.mode === 'exam') { const [b, d] = k.value.split('-'); return t('exam', { b, d }); }
    if (k.mode === 'wrong') return t('label_wrong');
    if (k.mode === 'retry') return t('label_retry');
    if (k.mode === 'all') return t('label_all');
    return s.label || '';
  }

  /* ---------- Khung trang ---------- */

  function renderHeader() {
    const route = location.hash || '#/';
    const active = p => route === p || (p !== '#/' && route.startsWith(p)) ? ' class="active"' : '';
    document.documentElement.lang = t('html_lang');
    document.title = t('doc_title');
    $('#header').innerHTML = `
      <a class="brand" href="#/"><span class="brand-mark">TĐN</span><span class="brand-text">${t('brand_title')}<small>${t('brand_sub')}</small></span></a>
      <nav class="nav">
        <a href="#/"${active('#/')}>${t('nav_home')}</a>
        <a href="#/writing"${active('#/writing')}>${t('nav_writing')}</a>
        <a href="#/results"${active('#/results')}>${t('nav_results')}</a>
      </nav>
      <div class="lang" role="group" aria-label="${t('lang_switch')}">
        <button type="button" class="flag ${lang() === 'vi' ? 'on' : ''}" data-lang="vi" title="${t('lang_vi')}" aria-label="${t('lang_vi')}" aria-pressed="${lang() === 'vi'}">${FLAG_VN}</button>
        <button type="button" class="flag ${lang() === 'en' ? 'on' : ''}" data-lang="en" title="${t('lang_en')}" aria-label="${t('lang_en')}" aria-pressed="${lang() === 'en'}">${FLAG_EN}</button>
      </div>
      <a class="star-pill" href="#/results" title="${t('stars_title')}">
        <span class="star-icon">★</span><b id="star-total">${state.stars}</b>
      </a>`;
    $$('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
    $('#footer').textContent = t('footer');
  }

  function page(html) {
    const app = $('#app');
    app.innerHTML = html + (storageOk ? '' : `<p class="storage-warn">${t('storage_warn')}</p>`);
    window.scrollTo(0, 0);
  }

  function crumbs(items) {
    return `<div class="crumbs">${items.map(([label, href]) => href ? `<a href="${href}">${esc(label)}</a>` : `<span>${esc(label)}</span>`).join('<span class="sep">›</span>')}</div>`;
  }

  /* ---------- Trang chủ ---------- */

  function viewHome() {
    const s = totals();
    const hello = state.name ? t('hello_name', { name: esc(state.name) }) : t('hello');
    page(`
      <section class="hero">
        <h1>${t('home_title', { hello })}</h1>
        <p>${t('home_desc')}</p>
        <div class="hero-stats">
          <div><b>${state.stars}</b><span>${t('stat_stars')}</span></div>
          <div><b>${s.answered}</b><span>${t('stat_answered')}</span></div>
          <div><b>${pct(s.correct, s.answered)}%</b><span>${t('stat_accuracy')}</span></div>
        </div>
      </section>
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
          <span class="badge go">${t('writing_badge', { q: QUESTIONS.length, l: LESSONS.length })}</span>
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
        <div><b>${state.streak}</b><span>${t('mini_streak')}</span></div>
        <div><b>${state.bestStreak}</b><span>${t('mini_best')}</span></div>
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
      <section class="lesson-grid">
        ${LESSONS.map((l, i) => {
          const n = questionsForTopic(l.id).length;
          const lt = lessonText(l);
          return `<a class="lesson-card" href="#/writing/learn/${l.id}">
            <span class="lc-icon">${l.icon}</span>
            <span class="lc-body"><span class="lc-num">${t('lesson_n', { n: i + 1 })}</span><span class="lc-title">${esc(lt.title)}</span><span class="lc-short">${esc(lt.short)}</span></span>
            ${n ? `<span class="lc-count">${t('n_questions', { n })}</span>` : ''}
          </a>`;
        }).join('')}
      </section>`);
  }

  function viewLesson(id) {
    const idx = LESSONS.findIndex(l => l.id === id);
    if (idx < 0) return go('#/writing/learn');
    const l = LESSONS[idx], prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    const lt = lessonText(l);
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
        ${next ? `<a class="btn ghost" href="#/writing/learn/${next.id}">${esc(lessonText(next).title)} →</a>` : '<span></span>'}
      </nav>`);
    const btn = $('#practice-topic');
    if (btn) btn.addEventListener('click', () => startSession('topic', id));
  }

  /* ---------- Practice: chọn cách luyện ---------- */

  function viewPracticeSetup() {
    const s = state.session;
    const unfinished = s && s.i < s.ids.length;
    const wrong = wrongIds().length;
    const topicOptions = LESSONS.filter(l => questionsForTopic(l.id).length)
      .map(l => `<option value="${l.id}">${esc(t('topic_option', { title: lessonText(l).title, n: questionsForTopic(l.id).length }))}</option>`).join('');
    const examOptions = [1, 2].map(b => `<optgroup label="${t('book', { b })}">${
      Array.from({ length: 30 }, (_, i) => `<option value="${b}-${i + 1}">${t('exam', { b, d: i + 1 })}</option>`).join('')
    }</optgroup>`).join('');

    page(`
      ${crumbs([[t('crumb_home'), '#/'], [t('crumb_writing'), '#/writing'], [t('crumb_practice')]])}
      <section class="section-head">
        <h1>${t('practice_title')}</h1>
        <p>${t('practice_intro')}</p>
      </section>
      ${unfinished ? `
        <div class="resume">
          <div>${t('resume_label', { label: esc(sessionLabel(s)), i: s.i + 1, n: s.ids.length })}</div>
          <a class="btn primary" href="#/writing/practice/run">${t('resume_btn')}</a>
        </div>` : ''}
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
        <div class="setup-card ${wrong ? '' : 'muted'}">
          <h3>${t('setup_wrong')}</h3>
          <p>${wrong ? t('setup_wrong_desc', { n: wrong }) : t('setup_wrong_none')}</p>
          <button class="btn primary" data-mode="wrong" ${wrong ? '' : 'disabled'}>${t('setup_wrong_btn')}</button>
        </div>
      </section>
      <section class="options">
        <label class="opt"><input type="checkbox" id="opt-random" ${state.settings.order === 'random' ? 'checked' : ''}> ${t('opt_random')}</label>
        <label class="opt"><input type="checkbox" id="opt-strict" ${state.settings.strict ? 'checked' : ''}> <span>${t('opt_strict')}</span></label>
      </section>`);

    $('#opt-random').addEventListener('change', e => { state.settings.order = e.target.checked ? 'random' : 'seq'; save(); });
    $('#opt-strict').addEventListener('change', e => { state.settings.strict = e.target.checked; save(); });
    $$('[data-mode]').forEach(b => b.addEventListener('click', () => {
      const mode = b.dataset.mode;
      if (mode === 'topic') startSession('topic', $('#sel-topic').value);
      else if (mode === 'exam') startSession('exam', $('#sel-exam').value);
      else startSession(mode);
    }));
  }

  // "quyển-đề" -> [id Câu 1, id Câu 2], theo đáp án trong sách.
  const EXAM_ORDER = (() => {
    const map = {
      1: ['w01w02', 'w03w04', 'w05w06', 'w07w08', 'w01w09', 'w10w11', 'w12w13', 'w14w15', 'w16w17', 'w18w19',
          'w20w21', 'w22w23', 'w24w25', 'w26w27', 'w28w29', 'w30w31', 'w32w33', 'w34w35', 'w06w36', 'w07w37',
          'w08w38', 'w02w03', 'w39w40', 'w41w05', 'w42w43', 'w04w44', 'w45w46', 'w47w48', 'w49w50', 'w51w52'],
      2: ['w53w15', 'w47w12', 'w18w02', 'w54w03', 'w11w37', 'w45w36', 'w04w31', 'w08w50', 'w42w24', 'w21w40',
          'w07w48', 'w13w55', 'w20w56', 'w41w35', 'w57w58', 'w59w60', 'w16w30', 'w52w19', 'w09w06', 'w29w17',
          'w61w44', 'w22w49', 'w32w05', 'w27w62', 'w34w25', 'w43w26', 'w51w63', 'w64w14', 'w65w23', 'w66w10']
    };
    const out = {};
    Object.entries(map).forEach(([b, arr]) => arr.forEach((pair, i) => { out[`${b}-${i + 1}`] = [pair.slice(0, 3), pair.slice(3)]; }));
    return out;
  })();

  function startSession(mode, value) {
    let ids;
    if (mode === 'topic') ids = questionsForTopic(value).map(q => q.id);
    else if (mode === 'exam') ids = (EXAM_ORDER[value] || []).slice();
    else if (mode === 'wrong') ids = wrongIds();
    else if (mode === 'retry') ids = value;
    else { mode = 'all'; ids = QUESTIONS.map(q => q.id); }
    if (!ids.length) return;
    if (state.settings.order === 'random' && mode !== 'exam') ids = shuffle(ids);
    state.session = { kind: { mode, value: mode === 'retry' ? null : value }, ids, i: 0, results: [], starsEarned: 0, pending: null };
    save();
    go('#/writing/practice/run');
  }

  /* ---------- Practice: làm bài ---------- */

  function streakSlots() {
    const r = state.streak % STREAK_BONUS_EVERY;
    const filled = state.streak > 0 && r === 0 ? STREAK_BONUS_EVERY : r;
    return Array.from({ length: STREAK_BONUS_EVERY }, (_, i) => `<span class="slot ${i < filled ? 'on' : ''}">★</span>`).join('');
  }

  function viewPracticeRun() {
    const s = state.session;
    if (!s) return go('#/writing/practice');
    if (s.i >= s.ids.length) return viewSummary();

    const q = Q_BY_ID[s.ids[s.i]];
    const pending = s.pending && s.pending.i === s.i ? s.pending : null;
    const need = STREAK_BONUS_EVERY - (state.streak % STREAK_BONUS_EVERY);
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
          <div class="streak-text">${t('streak_text', { s: state.streak, n: need, b: STREAK_BONUS_STARS })}</div>
        </div>
      </section>

      <section class="q-card">
        <div class="q-head">
          <span class="q-label">${t('q_label')}</span>
          <span class="q-src">${srcLabel(q.src)}</span>
        </div>
        <div class="cues">${cuesHtml(q.cues)}</div>
        <textarea id="answer" rows="2" placeholder="${t('placeholder')}" spellcheck="false" autocomplete="off" autocapitalize="off" ${pending ? 'readonly' : ''}>${pending ? esc(pending.text) : ''}</textarea>
        <div class="q-meta">
          <span id="wc" class="wc"></span>
          <span class="kbd-hint">${pending ? t('enter_next') : t('enter_check')}</span>
        </div>
        <div id="hint" class="hint" hidden></div>
        <div class="q-actions">
          ${pending ? `
            <span></span>
            <button class="btn primary big" id="btn-next">${s.i + 1 < s.ids.length ? t('btn_next') : t('btn_finish')}</button>` : `
            <button class="btn ghost" id="btn-hint">${t('btn_hint')}</button>
            <button class="btn primary big" id="btn-check">${t('btn_check')}</button>`}
        </div>
      </section>
      <div id="feedback">${pending ? feedbackHtml(q, pending) : ''}</div>`);

    const ta = $('#answer');
    const wc = $('#wc');
    const updateWc = () => {
      const n = Grader.countWords(ta.value);
      wc.textContent = t('words', { n });
      wc.classList.toggle('over', n > 15);
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

    ta.focus();
    ta.addEventListener('input', updateWc);
    ta.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); check(); } });
    $('#btn-check').addEventListener('click', check);
    $('#btn-hint').addEventListener('click', () => {
      const h = $('#hint');
      h.innerHTML = t('hint', {
        n: Grader.countWords(q.answer),
        w: esc(q.answer.split(' ')[0]),
        topics: q.topics.map(id => `<a href="#/writing/learn/${id}" target="_blank">${esc(topicTitle(id))}</a>`).join(', ')
      });
      h.hidden = !h.hidden;
    });

    function check() {
      const text = ta.value.trim();
      if (!text) { ta.classList.add('shake'); setTimeout(() => ta.classList.remove('shake'), 400); ta.focus(); return; }
      const result = Grader.grade(q, text, state.settings.strict);
      let earned = 0, bonus = false;
      if (result.correct) {
        earned = 1;
        state.streak += 1;
        if (state.streak % STREAK_BONUS_EVERY === 0) { earned += STREAK_BONUS_STARS; bonus = true; state.bonusCount += 1; }
        state.bestStreak = Math.max(state.bestStreak, state.streak);
      } else {
        state.streak = 0;
      }
      state.stars += earned;
      const qs = state.qstats[q.id] || { a: 0, c: 0, last: null };
      qs.a += 1; if (result.correct) qs.c += 1; qs.last = result.correct;
      state.qstats[q.id] = qs;
      state.history.unshift({ id: q.id, text, correct: result.correct, stars: earned, t: Date.now() });
      if (state.history.length > HISTORY_LIMIT) state.history.length = HISTORY_LIMIT;
      s.results.push({ id: q.id, correct: result.correct });
      s.starsEarned += earned;
      s.pending = { i: s.i, text, correct: result.correct, earned, bonus };
      save();
      renderHeader();
      viewPracticeRun();
      if (result.correct) bumpStars();
      if (bonus) celebrate(state.streak);
    }
  }

  function nextQuestion() {
    const s = state.session;
    s.i += 1;
    s.pending = null;
    save();
    viewPracticeRun();
  }

  function markedSentence(marks, cls) {
    return marks.map(m => `<span class="${m.ok ? 'w' : 'w ' + cls}">${esc(m.word)}</span>`).join(' ');
  }

  function issueText(issue) {
    return t('issue_' + issue.code, { n: issue.n });
  }

  function feedbackHtml(q, p) {
    // Chấm lại từ câu đã lưu để phản hồi luôn khớp với bộ chấm và ngôn ngữ hiện tại.
    const r = Grader.grade(q, p.text, state.settings.strict);
    const correct = typeof p.correct === 'boolean' ? p.correct : (p.result ? p.result.correct : r.correct);
    let banner;
    if (correct) {
      banner = `<div class="banner ok"><span class="b-icon">🎉</span><div><b>${t('fb_ok')}</b> +1 ★${p.bonus ? ` <span class="bonus">${t('fb_bonus', { b: STREAK_BONUS_STARS, e: STREAK_BONUS_EVERY })}</span>` : ''}${r.sameAsBook ? '' : `<div class="banner-sub">${t('fb_ok_variant')}</div>`}</div></div>`;
    } else if (r.contentOk) {
      banner = `<div class="banner bad"><span class="b-icon">✋</span><div>${t('fb_form')}</div></div>`;
    } else {
      banner = `<div class="banner bad"><span class="b-icon">💪</span><div>${t('fb_bad')}</div></div>`;
    }

    const shown = r.contentOk ? p.text : r.closest;
    const others = Grader.sampleVariants(q, shown, 3);

    let compare;
    if (!r.contentOk) {
      compare = `
        <div class="compare">
          <div class="cmp-row"><span class="cmp-label">${t('cmp_yours')}</span><div class="cmp-text">${markedSentence(r.userMarks, 'wrong')}</div></div>
          <div class="cmp-row"><span class="cmp-label">${t('cmp_closest')}</span><div class="cmp-text">${markedSentence(r.answerMarks, 'missing')}</div></div>
          ${r.closest !== q.answer ? `<div class="cmp-row"><span class="cmp-label">${t('cmp_book')}</span><div class="cmp-text book">${esc(q.answer)}</div></div>` : ''}
          <div class="legend">${t('legend')}</div>
        </div>`;
    } else {
      compare = `<div class="compare"><div class="cmp-row"><span class="cmp-label">${t('cmp_book')}</span><div class="cmp-text">${esc(q.answer)}</div></div></div>`;
    }

    return `
      <section class="feedback ${correct ? 'is-ok' : 'is-bad'}">
        ${banner}
        ${r.issues.length ? `<div class="issues"><b>${correct ? t('issues_note') : t('issues_err')}</b><ul>${r.issues.map(i => `<li>${issueText(i)}</li>`).join('')}</ul></div>` : ''}
        ${compare}
        ${others.length ? `<div class="alts"><b>${t('alts_title')}</b><ul>${others.map(a => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}
        <div class="why">
          <h3>${t('why_title')}</h3>
          <ol>${stepsOf(q).map(st => `<li>${st}</li>`).join('')}</ol>
          <div class="why-topics">${t('review')} ${q.topics.map(id => `<a class="chip" href="#/writing/learn/${id}">${esc(topicTitle(id))}</a>`).join('')}</div>
        </div>
      </section>`;
  }

  function viewSummary() {
    const s = state.session;
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
          <a class="btn ghost" href="#/results">${t('sum_total')}</a>
        </div>
      </section>
      <section class="sum-list">
        ${s.results.map((r, i) => {
          const q = Q_BY_ID[r.id];
          return `<div class="sum-item ${r.correct ? 'ok' : 'bad'}"><span class="mark">${r.correct ? '✓' : '✗'}</span><div><div class="sum-cue">${i + 1}. ${esc(q.cues)}</div><div class="sum-ans">${esc(q.answer)}</div></div></div>`;
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
      state.history.forEach(h => { const q = Q_BY_ID[h.id]; if (q && q.topics.includes(l.id)) { a++; if (h.correct) c++; } });
      return { l, a, c };
    });
    const recent = state.history.slice(0, 40);
    const fmt = ts => new Date(ts).toLocaleString(t('date_locale'), { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

    page(`
      ${crumbs([[t('crumb_home'), '#/'], [t('crumb_results')]])}
      <section class="section-head">
        <h1>${t('results_title')}</h1>
        <p>${t('results_intro')}</p>
      </section>
      <section class="profile">
        <label for="name">${t('name_label')}</label>
        <input id="name" type="text" maxlength="40" placeholder="${t('name_ph')}" value="${esc(state.name)}">
      </section>
      <section class="tiles">
        <div class="tile star"><b>${state.stars}</b><span>${t('tile_stars')}</span></div>
        <div class="tile"><b>${s.answered}</b><span>${t('tile_answers')}</span></div>
        <div class="tile"><b>${pct(s.correct, s.answered)}%</b><span>${t('tile_acc')}</span></div>
        <div class="tile"><b>${s.mastered}/${QUESTIONS.length}</b><span>${t('tile_mastered')}</span></div>
        <div class="tile"><b>${state.bestStreak}</b><span>${t('tile_best')}</span></div>
        <div class="tile"><b>${state.bonusCount}</b><span>${t('tile_bonus')}</span></div>
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
        ${recent.length ? `<div class="history">${recent.map(h => {
          const q = Q_BY_ID[h.id];
          if (!q) return '';
          return `<div class="h-item ${h.correct ? 'ok' : 'bad'}">
            <span class="mark">${h.correct ? '✓' : '✗'}</span>
            <div class="h-body"><div class="h-cue">${esc(q.cues)}</div><div class="h-text">${esc(h.text)}</div>${h.correct ? '' : `<div class="h-ans">→ ${esc(q.answer)}</div>`}</div>
            <span class="h-meta">${h.stars ? `+${h.stars} ★<br>` : ''}${fmt(h.t)}</span>
          </div>`;
        }).join('')}</div>` : `<p class="empty">${t('history_empty')}</p>`}
      </section>

      <section class="panel data-actions">
        <h2>${t('backup')}</h2>
        <div class="row">
          <button class="btn primary" id="export">${t('export')}</button>
          <label class="btn ghost file-btn">${t('import')}<input type="file" id="import" accept="application/json,.json" hidden></label>
          <button class="btn danger" id="reset">${t('reset')}</button>
        </div>
      </section>`);

    $('#name').addEventListener('input', e => { state.name = e.target.value.trim(); save(); });
    $('#export').addEventListener('click', exportData);
    $('#import').addEventListener('change', importData);
    $('#reset').addEventListener('click', () => {
      if (!confirm(t('reset_confirm'))) return;
      const keep = { name: state.name, lang: state.settings.lang };
      state = defaults();
      state.name = keep.name;
      state.settings.lang = keep.lang;
      save();
      renderHeader();
      viewResults();
    });
  }

  function exportData() {
    const data = Object.assign({}, state, { exportedAt: new Date().toISOString() });
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    const who = (state.name || 'thi-sinh').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').replace(/[^\w]+/g, '-').toLowerCase();
    a.href = URL.createObjectURL(blob);
    a.download = `ket-qua-tdn-${who}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (typeof data !== 'object' || !Array.isArray(data.history) || typeof data.stars !== 'number') throw new Error('bad');
        if (!confirm(t('import_confirm', { name: data.name || t('no_name'), s: data.stars, h: data.history.length }))) return;
        delete data.exportedAt;
        const currentLang = state.settings.lang;
        state = merge(data);
        state.settings.lang = currentLang;
        save();
        renderHeader();
        viewResults();
      } catch (err) {
        alert(t('import_bad'));
      }
    };
    reader.readAsText(file);
  }

  /* ---------- Điều hướng ---------- */

  function go(hash) {
    if (location.hash === hash) route(); else location.hash = hash;
  }

  function route() {
    const h = location.hash || '#/';
    renderHeader();
    const parts = h.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (!parts.length) return viewHome();
    if (parts[0] === 'results') return viewResults();
    if (parts[0] === 'writing') {
      if (!parts[1]) return viewWriting();
      if (parts[1] === 'learn') return parts[2] ? viewLesson(parts[2]) : viewLearnList();
      if (parts[1] === 'practice') return parts[2] === 'run' ? viewPracticeRun() : viewPracticeSetup();
    }
    viewHome();
  }

  window.addEventListener('hashchange', route);
  route();
})();
