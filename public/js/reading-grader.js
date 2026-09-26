/*
 * Chấm các câu Reading phải tự gõ đáp án — chạy ở trình duyệt (window.ReadingGrader) và Node (require).
 *
 *   word  Tìm từ trong bài theo định nghĩa: gõ đúng 1–2 từ như trong bài.
 *         Đáp án (key): { kind: 'word', answers: ['priority'], maxWords: 1 }
 *   gap   Điền khuyết tự viết từ (có thể cho sẵn 3 lựa chọn hoặc một khung từ): gõ đúng từ cần điền.
 *         Đáp án: { kind: 'gap', answers: ['reduce'] }
 *   open  Câu hỏi mở: chấm theo ý. Mỗi ý có vài cách diễn đạt (any); câu trả lời có đủ `need` ý là đúng.
 *         Đáp án: { kind: 'open', answer: câu mẫu, ideas: [{ any: ['blind* accept*', …], vi, en }], need }
 *
 * Như cách chấm của đề (Stemhouse): sai chính tả, đổi dạng từ (priorities ≠ priority) hay viết thừa từ
 * đều không được điểm; không phân biệt hoa thường và dấu câu. Chỗ sai được báo trong `issues`.
 *
 * Cú pháp một cách diễn đạt của ý (open): các từ cách nhau bằng dấu cách, phải có đủ (không cần đúng thứ tự);
 * "accept*" khớp mọi từ bắt đầu bằng accept (accepts, accepting, acceptance…); từ không có * vẫn khớp
 * các dạng -s / -es / -ed / -ing của nó.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.ReadingGrader = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const CONTRACTIONS = [
    [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bwon't\b/g, 'will not'],
    [/\b(\w+)n't\b/g, '$1 not'], [/\bi'm\b/g, 'i am'], [/\b(\w+)'re\b/g, '$1 are'],
    [/\b(\w+)'ve\b/g, '$1 have'], [/\b(\w+)'ll\b/g, '$1 will'],
    [/\b(it|he|she|that|what|there|where|who|how)'s\b/g, '$1 is']
  ];

  // Chữ thường, bỏ dấu câu (giữ dấu nháy và gạch nối trong từ: no-one, it's), gộp khoảng trắng.
  function normalize(text) {
    let s = String(text || '').toLowerCase().replace(/[‘’ʼ`´]/g, "'").replace(/[“”]/g, '"');
    CONTRACTIONS.forEach(([re, rep]) => { s = s.replace(re, rep); });
    return s.replace(/[^a-z0-9'\-\s]/g, ' ').replace(/(^|\s)['\-]+|['\-]+(?=\s|$)/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const words = text => (normalize(text) ? normalize(text).split(' ') : []);

  // Gốc từ đơn giản để nhận ra "cùng từ, khác dạng": trades/traded/trading → trad.
  function stem(w) {
    let s = w.replace(/'s$/, '');
    if (s.length > 4 && s.endsWith('ies')) return s.slice(0, -3) + 'y';
    for (const suf of ['ing', 'ed', 'es', 's']) {
      if (s.length > suf.length + 2 && s.endsWith(suf)) { s = s.slice(0, -suf.length); break; }
    }
    return s.replace(/e$/, '');
  }

  function editDistance(a, b) {
    const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) d[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
    }
    return d[a.length][b.length];
  }

  const blank = () => ({
    correct: false, contentOk: false, sameAsBook: false, error: null, issues: [], wordCount: 0,
    closest: null, userMarks: null, answerMarks: null, diff: { missing: [], wrong: [], extra: [] }, variants: [], ideas: null
  });

  // Tìm từ / điền khuyết: phải đúng một trong các đáp án (sau khi chuẩn hoá).
  function gradeExact(key, userAnswer) {
    const r = blank();
    const got = words(userAnswer);
    const answers = (key.answers || []).map(normalize).filter(Boolean);
    r.wordCount = got.length;
    const u = got.join(' ');
    r.closest = key.answers && key.answers[0];
    if (answers.includes(u)) {
      r.correct = r.contentOk = true;
      r.sameAsBook = u === answers[0];
      return r;
    }
    if (!u) { r.issues.push({ code: 'empty' }); return r; }
    // Có đáp án nhưng viết thừa từ ("a washbag", "is priority").
    const hit = answers.find(a => (' ' + u + ' ').includes(' ' + a + ' '));
    if (hit) {
      r.closest = hit;
      r.issues.push({ code: 'extra', n: got.length - hit.split(' ').length });
      return r;
    }
    let best = null;
    answers.forEach(a => {
      const aw = a.split(' ');
      const sameForm = aw.length === got.length && aw.every((w, i) => stem(w) === stem(got[i]));
      const dist = editDistance(a, u);
      if (!best || (sameForm && !best.sameForm) || (sameForm === best.sameForm && dist < best.dist)) best = { a, sameForm, dist };
    });
    if (best) {
      r.closest = best.a;
      if (best.sameForm) r.issues.push({ code: 'form' });
      else if (best.dist <= Math.max(1, Math.floor(best.a.length / 4))) r.issues.push({ code: 'spelling' });
    }
    if (key.maxWords && got.length > key.maxWords) r.issues.push({ code: 'too_many', n: key.maxWords });
    return r;
  }

  // Một từ của mẫu ý khớp một từ trong câu trả lời.
  function tokenMatch(token, word) {
    if (token.endsWith('*')) return word.startsWith(token.slice(0, -1));
    return word === token || stem(word) === stem(token);
  }
  const phraseTokens = phrase => String(phrase).trim().split(/\s+/)
    .map(tok => normalize(tok.replace(/\*$/, '')) + (tok.endsWith('*') ? '*' : '')).filter(tok => tok && tok !== '*');
  const phraseMatch = (phrase, got) => phraseTokens(phrase).every(tok => got.some(w => tokenMatch(tok, w)));

  function ideaHits(key, userAnswer) {
    const got = words(userAnswer);
    return (key.ideas || []).map(idea => (idea.any || []).some(p => phraseMatch(p, got)));
  }

  // Câu hỏi mở: đủ `need` ý (mặc định: mọi ý) là đúng.
  function gradeOpen(key, userAnswer) {
    const r = blank();
    const got = words(userAnswer);
    r.wordCount = got.length;
    r.closest = key.answer;
    if (!got.length) { r.issues.push({ code: 'empty' }); return r; }
    const hits = ideaHits(key, userAnswer);
    const need = key.need || hits.length;
    const n = hits.filter(Boolean).length;
    r.ideas = hits;
    r.correct = r.contentOk = n >= need;
    if (!r.correct) r.issues.push({ code: n ? 'ideas_some' : 'ideas_none', n: need - n });
    if (key.maxWords && got.length > key.maxWords) {
      r.correct = false;
      r.error = 'TOO_LONG';
      r.issues.push({ code: 'too_many', n: key.maxWords });
    }
    return r;
  }

  function grade(key, userAnswer) {
    return key.kind === 'open' ? gradeOpen(key, userAnswer) : gradeExact(key, userAnswer);
  }

  return { grade, gradeExact, gradeOpen, ideaHits, normalize, words, stem, editDistance };
});
