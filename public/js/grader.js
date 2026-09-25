/*
 * Bộ chấm câu viết — chạy ở trình duyệt (window.Grader) và Node (require, dùng trong scripts/seed.js).
 *
 * Ràng buộc cứng: tối đa 15 từ; giữ đủ các từ gợi ý (được chia thì / đổi dạng / số nhiều);
 * không tự thêm trạng từ thời gian / tần suất khi đề không có (yesterday, every day, usually…).
 * Được thêm: mạo từ, giới từ, liên từ, trợ động từ, đại từ tân ngữ khi ngữ pháp cần (need it,
 * give them to — ghi trong mẫu), tính từ sở hữu trước danh từ (my sister, their hands) và "very"
 * trước tính từ (hai loại sau được chấp nhận tự động, xem fillerOptions).
 *
 * 4 bước (grade):
 *  1. Đếm từ — quá 15 từ → sai, error 'TOO_LONG'.
 *  2. Chuẩn hoá: chữ thường, bỏ dấu câu (dấu phẩy không bắt buộc), mở viết tắt, số 0–15 → chữ,
 *     a.m./p.m. → am/pm, gộp từ đồng nghĩa.
 *  3. So với các mẫu câu đúng `accept` → khớp là đúng.
 *  4. Không khớp: chọn câu đúng gần nhất, so LCS theo từ để chỉ ra từ thiếu / sai / thừa.
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
  [/\brefrigerator\b/g, 'fridge'], [/\bgymnasium\b/g, 'gym'], [/\b(mom|mum)\b/g, 'mother']
];

// Chữ số 0–15 → chữ (15 → fifteen); số lớn hơn (2020, 50…) giữ nguyên.
const NUMBER_WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
  'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];

function normalize(text) {
  let s = String(text).toLowerCase()
    .replace(/[‘’ʼ`´]/g, "'")
    .replace(/[“”]/g, '"')
    // a.m. / p.m. / a.m / p. m. → am / pm (cần có dấu chấm để không đụng tới "I am")
    .replace(/\b([ap])\.\s?m\b\.?/g, '$1m');
  CONTRACTIONS.forEach(([re, rep]) => { s = s.replace(re, rep); });
  // Dấu câu (kể cả dấu ngắt giữa "Look! …", "Don't worry. …") → một khoảng trắng; dấu phẩy không bắt buộc.
  s = s.replace(/[.,!?;:"()\[\]…–—-]/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/\b(\d+)\b/g, (m, d) => NUMBER_WORDS[Number(d)] || m);
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

/*
 * Hư từ được tự do thêm dù mẫu không liệt kê:
 *  - tính từ sở hữu trước danh từ (my sister, their hands, his flowers) — thay được cho a/an/the hoặc đứng thêm;
 *  - "very" nhấn mạnh tính từ (is very nice, a very small dog) — như câu Example của đề.
 * Chỉ xét các từ không có sẵn trong gợi ý; thử bỏ/thay từng từ rồi so lại với mẫu.
 */
const POSSESSIVES = ['my', 'our', 'their', 'her', 'his'];
const BEFORE_ADJ = ['is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'a', 'an', 'the', 'and',
  'look', 'looks', 'looked', 'feel', 'feels', 'felt', 'seem', 'seems', 'become', 'became'];
const MAX_FILLERS = 4;

function fillerOptions(words, cueWords) {
  const opts = [];
  words.forEach((w, i) => {
    if (cueWords.has(w)) return;
    if (POSSESSIVES.includes(w) && i + 1 < words.length) opts.push({ i, alts: ['', 'the', 'a', 'an'] });
    else if (w === 'very' && i > 0 && i + 1 < words.length && BEFORE_ADJ.includes(words[i - 1])) opts.push({ i, alts: [''] });
  });
  return opts.slice(0, MAX_FILLERS);
}

function isAccepted(key, text) {
  const n = normalize(text);
  if (!n) return false;
  const { regexes } = compile(key);
  const test = s => s === normalize(key.answer) || regexes.some(re => re.test(s + ' '));
  if (test(n)) return true;

  const words = n.split(' ');
  const opts = fillerOptions(words, new Set(normalize(key.cues || '').split(' ')));
  if (!opts.length) return false;
  // Thử mọi tổ hợp giữ / bỏ / thay (tối đa 5^4 = 625 lần).
  const total = opts.reduce((p, o) => p * (o.alts.length + 1), 1);
  for (let c = 1; c < total; c++) {
    const w = words.slice();
    let r = c;
    opts.forEach(o => {
      const k = r % (o.alts.length + 1);
      r = Math.floor(r / (o.alts.length + 1));
      if (k > 0) w[o.i] = o.alts[k - 1];
    });
    if (test(w.filter(Boolean).join(' '))) return true;
  }
  return false;
}

/* ---------- So sánh theo từ ---------- */

function tokenize(text) {
  return String(text).trim().split(/\s+/).filter(Boolean).map(word => ({
    word,
    keys: normalize(word).split(' ').filter(Boolean)
  })).filter(t => t.keys.length || /\w/.test(t.word));
}

/*
 * Căn hai dãy từ (đã chuẩn hoá) theo LCS rồi phân loại phần chênh lệch giữa hai từ khớp liền nhau:
 *   có ở cả hai phía → wrong (dùng sai / chia sai, ghép cặp theo thứ tự)
 *   chỉ ở câu của em → extra (từ thừa)      chỉ ở câu mẫu → missing (từ thiếu)
 * Trả về nhãn cho từng từ của mỗi phía và danh sách cặp sai.
 */
function lcsDiff(a, b) {
  const n = a.length, m = b.length;
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    }
  }
  const kindA = new Array(n).fill('ok'), kindB = new Array(m).fill('ok');
  const pairs = [];
  let gapA = [], gapB = [];
  const flush = () => {
    const k = Math.min(gapA.length, gapB.length);
    for (let x = 0; x < k; x++) { kindA[gapA[x]] = kindB[gapB[x]] = 'wrong'; pairs.push([gapA[x], gapB[x]]); }
    gapA.slice(k).forEach(x => { kindA[x] = 'extra'; });
    gapB.slice(k).forEach(x => { kindB[x] = 'missing'; });
    gapA = []; gapB = [];
  };
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { flush(); i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) gapA.push(i++);
    else gapB.push(j++);
  }
  while (i < n) gapA.push(i++);
  while (j < m) gapB.push(j++);
  flush();
  return { kindA, kindB, pairs, len: dp[0][0] };
}

function flatKeys(tokens) {
  const keys = [], owner = [];
  tokens.forEach((t, idx) => t.keys.forEach(k => { keys.push(k); owner.push(idx); }));
  return { keys, owner };
}

// Nhãn của một từ gõ = nhãn nặng nhất trong các phần của nó ("don't" = do + not).
const KIND_RANK = { ok: 0, missing: 1, extra: 1, wrong: 2 };
function markTokens(tokens, flat, kinds) {
  const kind = tokens.map(t => (t.keys.length ? 'ok' : 'wrong'));
  flat.owner.forEach((idx, k) => { if (KIND_RANK[kinds[k]] > KIND_RANK[kind[idx]]) kind[idx] = kinds[k]; });
  return tokens.map((t, i) => ({ word: t.word, ok: kind[i] === 'ok', kind: kind[i] }));
}

const bare = w => w.replace(/^[^\wÀ-ỹ']+|[^\wÀ-ỹ']+$/g, '');
const uniq = xs => xs.filter((x, i) => xs.indexOf(x) === i);

// Tóm tắt lỗi theo từ: thiếu / sai (em viết → cần viết) / thừa.
function diffSummary(best) {
  const { userTokens, userFlat, ansTokens, ansFlat, d } = best;
  const wrong = uniq(d.pairs.map(([i, j]) => `${bare(userTokens[userFlat.owner[i]].word)}→${bare(ansTokens[ansFlat.owner[j]].word)}`))
    .map(p => { const [got, want] = p.split('→'); return { got, want }; });
  return {
    missing: uniq(ansFlat.owner.filter((_, k) => d.kindB[k] === 'missing').map(t => bare(ansTokens[t].word))),
    wrong,
    extra: uniq(userFlat.owner.filter((_, k) => d.kindA[k] === 'extra').map(t => bare(userTokens[t].word)))
  };
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
 * Chấm theo 4 bước:
 *   1. Đếm từ — quá 15 từ là sai yêu cầu (error: 'TOO_LONG'), không so mẫu nữa.
 *   2. Chuẩn hoá (normalize).
 *   3. Khớp một mẫu accept (kể cả khi thêm hư từ cho phép) → đúng nội dung.
 *   4. Không khớp → tìm câu đúng gần nhất, so LCS theo từ để chỉ ra từ thiếu / sai / thừa.
 * strict: đòi cả hình thức (viết hoa, dấu câu cuối).
 */
function grade(key, text, strict) {
  const wordCount = countWords(text);
  const tooLong = wordCount > MAX_WORDS;
  const contentOk = !tooLong && isAccepted(key, text);
  const issues = formIssues(text, key.cues);
  const correct = contentOk && (!strict || issues.length === 0);
  const sameAsBook = normalize(text) === normalize(key.answer);

  let best = null;
  if (!contentOk) {
    const userTokens = tokenize(text);
    const userFlat = flatKeys(userTokens);
    [key.answer].concat(compile(key).variants).forEach(a => {
      const ansTokens = tokenize(a);
      const ansFlat = flatKeys(ansTokens);
      const d = lcsDiff(userFlat.keys, ansFlat.keys);
      const dist = userFlat.keys.length + ansFlat.keys.length - 2 * d.len;
      if (!best || dist < best.dist) best = { a, ansTokens, ansFlat, d, dist, userTokens, userFlat };
    });
  }

  return {
    correct,
    contentOk,
    error: tooLong ? 'TOO_LONG' : null,
    sameAsBook,
    issues,
    wordCount,
    closest: best ? best.a : null,
    userMarks: best ? markTokens(best.userTokens, best.userFlat, best.d.kindA) : null,
    answerMarks: best ? markTokens(best.ansTokens, best.ansFlat, best.d.kindB) : null,
    diff: best ? diffSummary(best) : { missing: [], wrong: [], extra: [] },
    variants: sampleVariants(key, contentOk ? text : best.a, 3)
  };
}

return { grade, normalize, countWords, isAccepted, compile, sampleVariants, MAX_WORDS };
});
