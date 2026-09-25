/*
 * Tính sao, chuỗi đúng và chi tiết bài nộp sau khi chấm một câu. Hàm thuần (không gọi Firestore)
 * để test được bằng Node. Chạy ở trình duyệt (window.Scoring) và Node (require).
 *
 * Luật: đúng 1 câu +1 ★; mỗi khi chuỗi đúng liên tiếp chia hết cho 5 thì thưởng thêm +5 ★;
 * sai một câu thì chuỗi về 0. Nộp lại câu đã có trong lượt thì không chấm / cộng sao lần nữa.
 * Writing và Reading dùng chung sao, chuỗi và qstats. Câu Reading (đáp án có `choice: true`)
 * chấm bằng choiceGrader thay cho Grader.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.Scoring = api;
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const STREAK_BONUS_EVERY = 5;
  const STREAK_BONUS_STARS = 5;
  const MAX_DETAILS_PER_SUBMISSION = 200;
  // Số sao tối đa một lần trả lời có thể nhận — firestore.rules dùng cùng giới hạn này.
  const MAX_STARS_PER_ANSWER = 1 + STREAK_BONUS_STARS;

  const USER_STATS = ['stars', 'streak', 'bestStreak', 'bonusCount', 'totalAnswered', 'totalCorrect', 'qstats'];
  const EMPTY_STATS = { stars: 0, streak: 0, bestStreak: 0, bonusCount: 0, totalAnswered: 0, totalCorrect: 0, qstats: {} };

  // Câu chọn đáp án (Reading): True/False hoặc A/B/C, không phân biệt hoa thường.
  const normChoice = s => String(s || '').trim().toLowerCase();
  const choiceGrader = {
    grade(key, userAnswer) {
      const correct = normChoice(userAnswer) === normChoice(key.answer);
      return {
        correct, contentOk: correct, sameAsBook: true, error: null, issues: [], wordCount: 0,
        closest: null, userMarks: null, answerMarks: null, diff: { missing: [], wrong: [], extra: [] }, variants: []
      };
    }
  };

  /**
   * @param {object} p
   *   profile  thống kê hiện tại của user (users/{uid})
   *   sub      bài nộp hiện tại { details: [] } hoặc null nếu là lượt mới
   *   questionId, userAnswer, strict
   *   key      đáp án { cues, answer, accept, defs, explanation } — Reading: { choice: true, answer, evidence, explanation }
   *   grader   module Grader (bỏ qua với câu Reading)
   *   now      số ms (thời điểm nộp)
   * @returns {{ result, stats, details, score, starsEarned, duplicate }}
   */
  function applyAnswer({ profile, sub, questionId, userAnswer, strict, key, grader, now }) {
    if (key.choice) grader = choiceGrader;
    const details = sub && Array.isArray(sub.details) ? sub.details.slice() : [];
    const stats = Object.assign({}, EMPTY_STATS, pick(profile, USER_STATS));
    stats.qstats = Object.assign({}, stats.qstats);

    const previous = details.find(d => d.questionId === questionId);
    if (previous) {
      const g = grader.grade(key, previous.userAnswer, previous.strict === true);
      g.correct = previous.correct;
      return {
        result: toResult(questionId, previous.userAnswer, key, g, previous.starsEarned, previous.bonus, true),
        stats: null, details: null, score: null, starsEarned: 0, duplicate: true
      };
    }

    const g = grader.grade(key, userAnswer, strict === true);
    let stars = 0, bonus = false;
    if (g.correct) {
      stars = 1;
      stats.streak += 1;
      if (stats.streak % STREAK_BONUS_EVERY === 0) { stars += STREAK_BONUS_STARS; bonus = true; stats.bonusCount += 1; }
      stats.bestStreak = Math.max(stats.bestStreak, stats.streak);
      stats.totalCorrect += 1;
    } else {
      stats.streak = 0;
    }
    stats.totalAnswered += 1;
    stats.stars += stars;

    // a: số lần làm · c: số lần đúng · last: lần gần nhất đúng/sai · at: thời điểm lần gần nhất (ms)
    const qs = Object.assign({ a: 0, c: 0, last: null }, stats.qstats[questionId]);
    qs.a += 1;
    if (g.correct) qs.c += 1;
    qs.last = g.correct;
    qs.at = now;
    stats.qstats[questionId] = qs;

    details.push({
      questionId,
      userAnswer,
      bookAnswer: key.answer,
      correct: g.correct,
      contentOk: g.contentOk,
      issues: g.issues.map(i => i.code),
      strict: strict === true,
      starsEarned: stars,
      bonus,
      at: now
    });
    if (details.length > MAX_DETAILS_PER_SUBMISSION) throw new Error('Submission is too long, start a new one.');

    return {
      result: toResult(questionId, userAnswer, key, g, stars, bonus, false),
      stats,
      details,
      score: details.filter(d => d.correct).length,
      starsEarned: stars,
      duplicate: false
    };
  }

  function toResult(questionId, userAnswer, key, g, starsEarned, bonus, duplicate) {
    return {
      questionId, userAnswer,
      correct: g.correct, contentOk: g.contentOk, sameAsBook: g.sameAsBook, error: g.error || null, diff: g.diff || { missing: [], wrong: [], extra: [] },
      issues: g.issues, wordCount: g.wordCount,
      closest: g.closest, userMarks: g.userMarks, answerMarks: g.answerMarks, variants: g.variants,
      answer: key.answer,
      explanation: key.explanation || { vi: [], en: [] },
      evidence: key.evidence || [],
      starsEarned, bonus, duplicate
    };
  }

  /*
   * Chọn n câu cho "Luyện mỗi ngày" từ ngân hàng đề, dựa vào qstats:
   *   1. câu lần gần nhất làm sai (sai lâu nhất trước) — tối đa một nửa (làm tròn lên);
   *   2. câu chưa làm bao giờ;
   *   3. câu đã đúng, lâu chưa ôn nhất trước;
   * nếu vẫn chưa đủ thì lấy thêm câu sai. exclude: các câu đã có trong lượt hôm nay.
   * rand: hàm ngẫu nhiên [0,1) (để test cố định được).
   */
  function pickDaily({ questionIds, qstats, n, exclude, rand }) {
    const r = rand || Math.random;
    const skip = new Set(exclude || []);
    const pool = questionIds.filter(id => !skip.has(id));
    const st = id => (qstats || {})[id];
    const at = id => (st(id) && st(id).at) || 0;
    // Trộn trước rồi sắp xếp ổn định → các câu "ngang nhau" ra thứ tự ngẫu nhiên.
    const mixed = pool.map(id => [r(), id]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    const wrong = mixed.filter(id => st(id) && st(id).last === false).sort((a, b) => at(a) - at(b));
    const fresh = mixed.filter(id => !st(id) || !st(id).a);
    const known = mixed.filter(id => st(id) && st(id).a && st(id).last !== false).sort((a, b) => at(a) - at(b));
    const size = Math.max(0, Math.min(n, pool.length));
    const out = wrong.slice(0, Math.ceil(size / 2));
    for (const id of fresh.concat(known, wrong)) {
      if (out.length >= size) break;
      if (!out.includes(id)) out.push(id);
    }
    // Không để các câu sai dồn hết lên đầu lượt.
    return out.map(id => [r(), id]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  }

  function pick(obj, keys) {
    const out = {};
    keys.forEach(k => { if (obj && obj[k] !== undefined) out[k] = obj[k]; });
    return out;
  }

  return {
    applyAnswer, pickDaily, choiceGrader, EMPTY_STATS, USER_STATS,
    STREAK_BONUS_EVERY, STREAK_BONUS_STARS, MAX_STARS_PER_ANSWER, MAX_DETAILS_PER_SUBMISSION
  };
});
