/*
 * Bộ chấm câu viết — chạy ở trình duyệt (window.Grader) và Node (require, dùng trong scripts/seed.js).
 *  1. Chuẩn hoá câu (chữ thường, bỏ dấu câu, mở viết tắt, gộp từ đồng nghĩa).
 *  2. So với các mẫu câu đúng `accept` của câu hỏi.
 *  3. Nếu sai: sinh các câu đúng từ mẫu, chọn câu gần nhất và dùng LCS theo từ
 *     để đánh dấu chỗ sai / chỗ thiếu.
 *
 * Cú pháp mẫu: (a|b) chọn một · [a] có hoặc không · [a|b] chọn a, b hoặc bỏ
 *              $NAME thay bằng defs.NAME · "," dấu phẩy (không bắt buộc khi chấm)
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Grader = api;
})(typeof self !== 'undefined' ? self : this, function () {
'use strict';

const MAX_WORDS = 15;

const CONTRACTIONS = [
  [/\bcan't\b/g, 'can not'], [/\bcannot\b/g, 'can not'], [/\bwon't\b/g, 'will not'],
  [/\b(\w+)n't\b/g, '$1 not'],
  [/\bi'm\b/g, 'i am'], [/\b(\w+)'re\b/g, '$1 are'], [/\b(\w+)'ve\b/g, '$1 have'],
  [/\b(\w+)'ll\b/g, '$1 will'], [/\b(\w+)'d\b/g, '$1 would'],
  [/\b(it|he|she|that|what|there|where|who|how)'s\b/g, '$1 is']
];

// Cách viết / từ đồng nghĩa → quy về một dạng.
const SYNONYMS = [
  [/\bdalat\b/g, 'da lat'], [/\bhanoi\b/g, 'ha noi'], [/\bdanang\b/g, 'da nang'],
  [/\bphuquoc\b/g, 'phu quoc'], [/\bviet nam\b/g, 'vietnam'],
  [/\bbackyard\b/g, 'back yard'], [/\bfavourite\b/g, 'favorite'], [/\bmaths\b/g, 'math'],
  [/\bmt\b/g, 'mount'], [/\btelevision\b/g, 'tv'], [/\bschool bag\b/g, 'schoolbag'],
  [/\bmovie\b/g, 'film'], [/\bmovies\b/g, 'films'], [/\bill\b/g, 'sick'],
  [/\b(trash|garbage|litter)\b/g, 'rubbish'], [/\bbike\b/g, 'bicycle'],
  [/\brefrigerator\b/g, 'fridge'], [/\bgymnasium\b/g, 'gym'], [/\b(mom|mum)\b/g, 'mother'],
  [/\bfifteen\b/g, '15'], [/\bthree\b/g, '3'], [/\btwo\b/g, '2']
];

function normalize(text) {
  let s = String(text).toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[“”]/g, '"');
  CONTRACTIONS.forEach(([re, rep]) => { s = s.replace(re, rep); });
  s = s.replace(/[.,!?;:"()\[\]…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  SYNONYMS.forEach(([re, rep]) => { s = s.replace(re, rep); });
  return s;
}

function countWords(text) {
  return String(text).trim().split(/\s+/).filter(w => /[\wÀ-ỹ]/.test(w)).length;
}

const isQuestion = cues => /\?\s*(\/\/)?\s*$/.test(cues);

/* ---------- Mẫu câu ---------- */

function substitute(src, defs) {
  let s = src;
  for (let guard = 0; guard < 10 && /\$[A-Z_]+/.test(s); guard++) {
    s = s.replace(/\$([A-Z_]+)/g, (_, k) => {
      if (!defs || !(k in defs)) throw new Error('Unknown pattern macro $' + k);
      return '(' + defs[k] + ')';
    });
  }
  return s;
}

// AST: {t:'w', w} | {t:'seq', items} | {t:'alt', opts} | {t:'opt', node}
function parse(src) {
  const toks = src.match(/[()\[\]|]|[^\s()\[\]|]+/g) || [];
  let i = 0;
  const peek = () => toks[i];
  function parseAlt() {
    const opts = [parseSeq()];
    while (peek() === '|') { i++; opts.push(parseSeq()); }
    return opts.length === 1 ? opts[0] : { t: 'alt', opts };
  }
  function parseSeq() {
    const items = [];
    while (i < toks.length && ![')', ']', '|'].includes(peek())) {
      const tk = toks[i++];
      if (tk === '(') { items.push(parseAlt()); expect(')'); }
      else if (tk === '[') { items.push({ t: 'opt', node: parseAlt() }); expect(']'); }
      else items.push({ t: 'w', w: tk });
    }
    return { t: 'seq', items };
  }
  function expect(c) { if (toks[i++] !== c) throw new Error(`Pattern error, expected "${c}": ${src}`); }
  const ast = parseAlt();
  if (i !== toks.length) throw new Error('Pattern error: ' + src);
  return ast;
}

const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Biên dịch sang regex trên chuỗi đã chuẩn hoá; mỗi từ kết thúc bằng một dấu cách.
function toRegex(node) {
  switch (node.t) {
    case 'w': return normalize(node.w).split(' ').filter(Boolean).map(k => reEsc(k) + ' ').join('');
    case 'seq': return node.items.map(toRegex).join('');
    case 'alt': return '(?:' + node.opts.map(toRegex).join('|') + ')';
    case 'opt': return '(?:' + toRegex(node.node) + ')?';
  }
  throw new Error('Bad node');
}

// Sinh các câu cụ thể từ mẫu (giới hạn số lượng) để gợi ý và so sánh.
const EXPAND_CAP = 600;
function expand(node) {
  switch (node.t) {
    case 'w': return [[node.w]];
    case 'alt': return node.opts.flatMap(expand).slice(0, EXPAND_CAP);
    case 'opt': return [[]].concat(expand(node.node)).slice(0, EXPAND_CAP);
    case 'seq': {
      let acc = [[]];
      for (const it of node.items) {
        const parts = expand(it);
        const next = [];
        outer: for (const a of acc) for (const p of parts) { next.push(a.concat(p)); if (next.length >= EXPAND_CAP) break outer; }
        acc = next;
      }
      return acc;
    }
  }
  throw new Error('Bad node');
}

function displaySentence(words, cues) {
  let s = words.join(' ').replace(/\s+,/g, ',').replace(/,\s*$/, '').trim();
  s = s.charAt(0).toUpperCase() + s.slice(1);
  return s + (isQuestion(cues) ? '?' : '.');
}

// Cache theo nội dung đáp án để instance "ấm" không dùng dữ liệu cũ sau khi migrate lại.
const compiled = new Map();
function compile(key) {
  const cacheKey = JSON.stringify([key.answer, key.accept, key.defs, key.cues]);
  if (compiled.has(cacheKey)) return compiled.get(cacheKey);
  const asts = (key.accept || []).map(p => parse(substitute(p, key.defs)));
  const regexes = asts.map(a => new RegExp('^' + toRegex(a) + '$'));
  const seen = new Set([normalize(key.answer)]);
  const variants = [];
  asts.forEach(a => expand(a).forEach(words => {
    const d = displaySentence(words, key.cues);
    const k = normalize(d);
    if (!seen.has(k) && countWords(d) <= MAX_WORDS) { seen.add(k); variants.push(d); }
  }));
  const c = { regexes, variants };
  if (compiled.size > 500) compiled.clear();
  compiled.set(cacheKey, c);
  return c;
}

function isAccepted(key, text) {
  const n = normalize(text);
  if (!n) return false;
  if (n === normalize(key.answer)) return true;
  return compile(key).regexes.some(re => re.test(n + ' '));
}

/* ---------- So sánh theo từ ---------- */

function tokenize(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).map(word => ({
    word,
    keys: normalize(word).split(' ').filter(Boolean)
  })).filter(t => t.keys.length || /\w/.test(t.word));
}

function lcsMarks(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const inA = new Array(n).fill(false), inB = new Array(m).fill(false);
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { inA[i] = inB[j] = true; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return { inA, inB, len: dp[0][0] };
}

function flatKeys(tokens) {
  const keys = [], owner = [];
  tokens.forEach((t, idx) => t.keys.forEach(k => { keys.push(k); owner.push(idx); }));
  return { keys, owner };
}

function markTokens(tokens, flat, inFlat) {
  const ok = tokens.map(t => t.keys.length > 0);
  flat.owner.forEach((idx, k) => { if (!inFlat[k]) ok[idx] = false; });
  return tokens.map((t, i) => ({ word: t.word, ok: ok[i] }));
}

// Lỗi hình thức, trả về mã để giao diện dịch: cap | q | dot | len
function formIssues(text, cues) {
  const issues = [];
  const t = String(text).trim();
  const first = t.match(/[A-Za-zÀ-ỹ]/);
  if (first && first[0] !== first[0].toUpperCase()) issues.push({ code: 'cap' });
  if (isQuestion(cues)) { if (!/\?$/.test(t)) issues.push({ code: 'q' }); }
  else if (!/[.!]$/.test(t)) issues.push({ code: 'dot' });
  const wc = countWords(t);
  if (wc > MAX_WORDS) issues.push({ code: 'len', n: wc });
  return issues;
}

// Một vài cách viết đúng khác (ngoài đáp án sách), lấy rải đều trong danh sách.
function sampleVariants(key, exclude, n) {
  const skip = new Set([normalize(key.answer), normalize(exclude || '')]);
  const vs = compile(key).variants.filter(v => !skip.has(normalize(v)));
  if (vs.length <= n) return vs;
  const out = [];
  for (let i = 0; i < n; i++) out.push(vs[Math.floor(i * vs.length / n)]);
  return out;
}

/*
 * key: { cues, answer, accept, defs }
 * Trả về kết quả chấm kèm dữ liệu để client hiển thị phản hồi.
 */
function grade(key, text, strict) {
  const contentOk = isAccepted(key, text);
  const issues = formIssues(text, key.cues);
  const wordCount = countWords(text);
  const correct = contentOk && wordCount <= MAX_WORDS && (!strict || issues.length === 0);
  const sameAsBook = normalize(text) === normalize(key.answer);

  let best = null;
  if (!contentOk) {
    const userTokens = tokenize(text);
    const userFlat = flatKeys(userTokens);
    [key.answer].concat(compile(key).variants).forEach(a => {
      const ansTokens = tokenize(a);
      const ansFlat = flatKeys(ansTokens);
      const r = lcsMarks(userFlat.keys, ansFlat.keys);
      const dist = userFlat.keys.length + ansFlat.keys.length - 2 * r.len;
      if (!best || dist < best.dist) best = { a, ansTokens, ansFlat, r, dist, userTokens, userFlat };
    });
  }

  return {
    correct,
    contentOk,
    sameAsBook,
    issues,
    wordCount,
    closest: best ? best.a : null,
    userMarks: best ? markTokens(best.userTokens, best.userFlat, best.r.inA) : null,
    answerMarks: best ? markTokens(best.ansTokens, best.ansFlat, best.r.inB) : null,
    variants: sampleVariants(key, contentOk ? text : best.a, 3)
  };
}

return { grade, normalize, countWords, isAccepted, compile, sampleVariants, MAX_WORDS };
});
