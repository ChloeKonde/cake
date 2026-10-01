// Synthesised sound effects (no audio files) and canvas confetti.

let ctx = null;
let muted = (() => {
  try { return localStorage.getItem('cake-muted') === '1'; } catch { return false; }
})();

export const isMuted = () => muted;
export function setMuted(m) {
  muted = m;
  try { localStorage.setItem('cake-muted', m ? '1' : '0'); } catch {}
}

function ac() {
  if (muted) return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, dur, { type = 'sine', vol = 0.15, slide = 0, delay = 0 } = {}) {
  const a = ac();
  if (!a) return;
  const t0 = a.currentTime + delay;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

export const sfx = {
  pop: () => tone(520, 0.12, { type: 'triangle', slide: 420 }),
  plop: () => tone(320, 0.16, { slide: -200, vol: 0.2 }),
  click: () => tone(900, 0.05, { type: 'square', vol: 0.04 }),
  stir: () => tone(180 + Math.random() * 80, 0.09, { type: 'triangle', vol: 0.05 }),
  ding: () => { tone(1320, 0.7, { vol: 0.12 }); tone(1760, 0.6, { vol: 0.07, delay: 0.04 }); },
  magic: () => [660, 880, 990, 1320, 1760].forEach((f, i) => tone(f, 0.2, { type: 'triangle', vol: 0.09, delay: i * 0.07 })),
  fanfare: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i === 3 ? 0.7 : 0.2, { type: 'square', vol: 0.05, delay: i * 0.14 })),
  swish: () => tone(1400, 0.25, { type: 'sawtooth', vol: 0.03, slide: -1100 }),
};

// ---------- confetti ----------

const canvas = document.getElementById('fx');
const c2d = canvas.getContext('2d');
const COLORS = ['#ff5d8f', '#ffd23f', '#3bceac', '#5d9cec', '#b07cff', '#ff8c42', '#ffffff'];
let parts = [];
let running = false;

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth * dpr;
  canvas.height = innerHeight * dpr;
  c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
}
addEventListener('resize', resize);
resize();

/** Burst of confetti from (x, y) in viewport px; defaults to top centre. */
export function confetti(n = 120, x = innerWidth / 2, y = innerHeight * 0.3) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) n = Math.min(n, 20);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const s = 4 + Math.random() * 9;
    parts.push({
      x, y,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s - 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      w: 6 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      c: COLORS[(Math.random() * COLORS.length) | 0],
      star: Math.random() < 0.25,
      life: 1,
    });
  }
  if (!running) { running = true; requestAnimationFrame(step); }
}

function drawStar(x, y, r) {
  c2d.beginPath();
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 ? r * 0.45 : r;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    c2d.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a));
  }
  c2d.closePath();
  c2d.fill();
}

function step() {
  c2d.clearRect(0, 0, innerWidth, innerHeight);
  parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
  for (const p of parts) {
    p.vy += 0.28;
    p.vx *= 0.985;
    p.x += p.vx;
    p.y += p.vy;
    p.r += p.vr;
    p.life -= 0.006;
    c2d.globalAlpha = Math.min(1, p.life * 2);
    c2d.fillStyle = p.c;
    if (p.star) {
      drawStar(p.x, p.y, p.w * 0.8);
    } else {
      c2d.save();
      c2d.translate(p.x, p.y);
      c2d.rotate(p.r);
      c2d.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)) + 1);
      c2d.restore();
    }
  }
  c2d.globalAlpha = 1;
  if (parts.length) requestAnimationFrame(step);
  else running = false;
}

/** Little sparkle burst at a DOM element (used for "magic fixes"). */
export function sparkleAt(el, n = 26) {
  const r = el.getBoundingClientRect();
  confetti(n, r.left + r.width / 2, r.top + r.height / 2);
}
