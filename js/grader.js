/*
 * Chấm câu viết.
 *  1. Chuẩn hoá câu (chữ thường, bỏ dấu câu, mở viết tắt, gộp từ đồng nghĩa).
 *  2. So với các mẫu câu đúng của câu hỏi (xem cú pháp mẫu ở đầu data.js).
 *  3. Nếu sai: sinh các câu đúng từ mẫu, chọn câu gần nhất và dùng LCS theo từ
 *     để tô màu chỗ sai / chỗ thiếu.
 */
(function () {
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
  }

  function displaySentence(words, question) {
    let s = words.join(' ').replace(/\s+,/g, ',').replace(/,\s*$/, '').trim();
    s = s.charAt(0).toUpperCase() + s.slice(1);
    return s + (isQuestion(question.cues) ? '?' : '.');
  }

  const isQuestion = cues => /\?\s*(\/\/)?\s*$/.test(cues);

  const compiled = new Map();
  function compile(question) {
    if (compiled.has(question.id)) return compiled.get(question.id);
    const asts = (question.accept || []).map(p => parse(substitute(p, question.defs)));
    const regexes = asts.map(a => new RegExp('^' + toRegex(a) + '$'));
    const seen = new Set([normalize(question.answer)]);
    const variants = [];
    asts.forEach(a => expand(a).forEach(words => {
      const d = displaySentence(words, question);
      const k = normalize(d);
      if (!seen.has(k) && countWords(d) <= 15) { seen.add(k); variants.push(d); }
    }));
    const c = { regexes, variants };
    compiled.set(question.id, c);
    return c;
  }

  function isAccepted(question, text) {
    const n = normalize(text);
    if (!n) return false;
    if (n === normalize(question.answer)) return true;
    return compile(question).regexes.some(re => re.test(n + ' '));
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

  function countWords(text) {
    return String(text).trim().split(/\s+/).filter(w => /[\wÀ-ỹ]/.test(w)).length;
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
    if (wc > 15) issues.push({ code: 'len', n: wc });
    return issues;
  }

  /* ---------- Chấm ---------- */

  function grade(question, text, strict) {
    const contentOk = isAccepted(question, text);
    const issues = formIssues(text, question.cues);
    const wordCount = countWords(text);
    const correct = contentOk && wordCount <= 15 && (!strict || issues.length === 0);
    const sameAsBook = normalize(text) === normalize(question.answer);

    const userTokens = tokenize(text);
    const userFlat = flatKeys(userTokens);
    let best = null;
    if (!contentOk) {
      [question.answer].concat(compile(question).variants).forEach(a => {
        const ansTokens = tokenize(a);
        const ansFlat = flatKeys(ansTokens);
        const r = lcsMarks(userFlat.keys, ansFlat.keys);
        const dist = userFlat.keys.length + ansFlat.keys.length - 2 * r.len;
        if (!best || dist < best.dist) best = { a, ansTokens, ansFlat, r, dist };
      });
    }

    return {
      correct,
      contentOk,
      sameAsBook,
      issues,
      wordCount,
      closest: best ? best.a : null,
      userMarks: best ? markTokens(userTokens, userFlat, best.r.inA) : null,
      answerMarks: best ? markTokens(best.ansTokens, best.ansFlat, best.r.inB) : null
    };
  }

  // Một vài cách viết đúng khác (ngoài đáp án sách) để hiển thị cho thí sinh.
  function sampleVariants(question, exclude, n) {
    const skip = new Set([normalize(question.answer), normalize(exclude || '')]);
    const vs = compile(question).variants.filter(v => !skip.has(normalize(v)));
    if (vs.length <= n) return vs;
    // Lấy rải đều để thấy được nhiều kiểu biến đổi khác nhau.
    const out = [];
    for (let i = 0; i < n; i++) out.push(vs[Math.floor(i * vs.length / n)]);
    return out;
  }

  window.Grader = { grade, normalize, countWords, isAccepted, sampleVariants, compile };
})();
