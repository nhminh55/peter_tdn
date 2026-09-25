/*
 * Hiệu ứng âm thanh, tạo bằng Web Audio (không cần file âm thanh).
 * Dùng: Sound.play('correct' | 'wrong' | 'star' | 'bonus' | 'tap' | 'finish'); Sound.setMuted(true).
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
  function note(ac, freq, at, dur, type = 'triangle', vol = 0.22) {
    const t0 = ac.currentTime + at;
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
    osc.connect(gain).connect(ac.destination);
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

  return {
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
