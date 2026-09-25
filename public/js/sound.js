/*
 * Hiệu ứng âm thanh, tạo bằng Web Audio (không cần file âm thanh).
 * Dùng: Sound.play('correct' | 'wrong' | 'star' | 'bonus' | 'tap' | 'finish'); Sound.setMuted(true).
 * Nhạc nền (hộp nhạc nhẹ, lặp lại): Sound.setMusic(true | false).
 * Trình duyệt chỉ cho phát tiếng sau khi người dùng bấm vào trang — các âm đều phát sau một lần bấm.
 */
window.Sound = (() => {
  let ctx = null;
  let muted = false;

  function audio() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // Một nốt: tần số (Hz, hoặc [từ, đến] để trượt), lúc bắt đầu (giây, tính từ bây giờ), độ dài, dạng sóng, âm lượng.
  function note(ac, freq, at, dur, type = 'triangle', vol = 0.22, dest = ac.destination, abs = false) {
    const t0 = abs ? at : ac.currentTime + at;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    if (Array.isArray(freq)) {
      osc.frequency.setValueAtTime(freq[0], t0);
      osc.frequency.exponentialRampToValueAtTime(freq[1], t0 + dur);
    } else {
      osc.frequency.setValueAtTime(freq, t0);
    }
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(dest);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  const C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5, E6 = 1318.5, G6 = 1568, C7 = 2093;

  const SOUNDS = {
    // Chọn phương án: tiếng "póc" nhỏ.
    tap: ac => note(ac, [520, 880], 0, 0.08, 'sine', 0.12),
    // Đúng: ba nốt đi lên vui tai.
    correct: ac => {
      note(ac, C5, 0, 0.14);
      note(ac, E5, 0.09, 0.14);
      note(ac, G5, 0.18, 0.16);
      note(ac, C6, 0.27, 0.32, 'triangle', 0.2);
    },
    // Sai: "ứ ừ" nhẹ nhàng, không doạ bé.
    wrong: ac => {
      note(ac, [392, 370], 0, 0.18, 'sine', 0.2);
      note(ac, [330, 262], 0.2, 0.34, 'sine', 0.2);
    },
    // Được sao: tiếng lấp lánh.
    star: ac => {
      [E6, G6, C7, G6, C7].forEach((f, i) => note(ac, f, 0.05 + i * 0.06, 0.18, 'sine', 0.1));
    },
    // Thưởng chuỗi: kèn chiến thắng.
    bonus: ac => {
      [C5, E5, G5].forEach((f, i) => note(ac, f, i * 0.12, 0.14, 'square', 0.07));
      note(ac, C6, 0.36, 0.5, 'square', 0.08);
      [C5, E5, G5, C6].forEach(f => note(ac, f, 0.36, 0.6, 'triangle', 0.08));
      [E6, G6, C7].forEach((f, i) => note(ac, f, 0.7 + i * 0.07, 0.2, 'sine', 0.08));
    },
    // Xong một lượt.
    finish: ac => {
      [G5, A5, G5, E5, D5, C5].reverse().forEach((f, i) => note(ac, f, i * 0.1, 0.16, 'triangle', 0.16));
      note(ac, C6, 0.62, 0.45, 'triangle', 0.18);
    }
  };

  /* ---------- Nhạc nền ---------- */

  // Vòng hợp âm C – Am – F – G, mỗi ô nhịp 8 nốt móc đơn rải hợp âm + một nốt trầm; giai điệu đổi qua 4 vòng.
  const BEAT = 60 / 76 / 2;          // độ dài một nốt móc đơn (76 nhịp/phút)
  const CHORDS = [
    [261.63, 329.63, 392.0, 523.25],  // C
    [220.0, 261.63, 329.63, 440.0],   // Am
    [174.61, 220.0, 261.63, 349.23],  // F
    [196.0, 246.94, 293.66, 392.0]    // G
  ];
  const ARP = [0, 2, 1, 2, 3, 2, 1, 2];
  // Giai điệu: [ô nhịp, nốt thứ mấy trong ô, tần số, số nốt móc đơn]
  const MELODY = [
    [0, 0, 783.99, 3], [0, 4, 659.25, 2], [0, 6, 587.33, 2], [1, 0, 659.25, 4], [1, 4, 523.25, 4],
    [2, 0, 523.25, 3], [2, 4, 587.33, 2], [2, 6, 659.25, 2], [3, 0, 587.33, 6],
    [4, 0, 659.25, 2], [4, 2, 783.99, 2], [4, 4, 880.0, 4], [5, 0, 783.99, 4], [5, 4, 659.25, 4],
    [6, 0, 698.46, 3], [6, 4, 659.25, 2], [6, 6, 587.33, 2], [7, 0, 523.25, 6]
  ];
  const LOOP_BARS = 8;
  let musicOn = false, musicGain = null, timer = null, nextAt = 0, step = 0;

  function scheduleMusic() {
    const ac = ctx;
    while (nextAt < ac.currentTime + 0.6) {
      const bar = Math.floor(step / 8) % LOOP_BARS, pos = step % 8;
      const chord = CHORDS[bar % 4];
      note(ac, chord[ARP[pos]] * 2, nextAt, BEAT * 2.5, 'sine', 0.05, musicGain, true);
      if (pos === 0) note(ac, chord[0] / 2, nextAt, BEAT * 7, 'triangle', 0.07, musicGain, true);
      MELODY.filter(m => m[0] === bar && m[1] === pos)
        .forEach(m => note(ac, m[2], nextAt, BEAT * m[3], 'triangle', 0.08, musicGain, true));
      nextAt += BEAT;
      step += 1;
    }
  }

  function startMusic() {
    if (timer || !musicOn || document.hidden) return;
    const ac = audio();
    if (!ac) return;
    if (ac.state !== 'running') {   // chưa bấm vào trang: chờ trình duyệt cho phát tiếng
      Promise.resolve(ac.resume()).then(() => { if (ac.state === 'running') startMusic(); }, () => {});
      return;
    }
    if (!musicGain) {
      musicGain = ac.createGain();
      musicGain.gain.value = 0.5;
      musicGain.connect(ac.destination);
    }
    nextAt = ac.currentTime + 0.1;
    step = 0;
    scheduleMusic();
    timer = setInterval(scheduleMusic, 200);
  }

  function stopMusic() {
    clearInterval(timer);
    timer = null;
    if (musicGain) {   // cắt các nốt đã hẹn trước: bỏ bộ khuếch đại cũ
      musicGain.disconnect();
      musicGain = null;
    }
  }

  // Trình duyệt chỉ cho phát tiếng sau khi người dùng tương tác; ẩn tab thì dừng nhạc.
  ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, () => { if (musicOn && !timer) startMusic(); }, true));
  document.addEventListener('visibilitychange', () => (document.hidden ? stopMusic() : startMusic()));

  return {
    setMusic(v) {
      musicOn = !!v;
      if (musicOn) startMusic(); else stopMusic();
    },
    play(name) {
      if (muted || !SOUNDS[name]) return;
      try {
        const ac = audio();
        if (ac) SOUNDS[name](ac);
      } catch (e) { /* không phát được thì thôi */ }
    },
    setMuted(v) { muted = !!v; },
    isMuted: () => muted
  };
})();
