// Seeded PRNG (mulberry32) so a cake renders identically every time from its seed.
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const lerp = (a, b, t) => a + (b - a) * t;

function hex(c) {
  const n = parseInt(c.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
const toHex = (rgb) => '#' + rgb.map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0')).join('');

export const mix = (a, b, t) => {
  const A = hex(a), B = hex(b);
  return toHex(A.map((v, i) => lerp(v, B[i], clamp(t))));
};
// amt > 0 lightens, < 0 darkens
export const shade = (c, amt) => (amt >= 0 ? mix(c, '#ffffff', amt) : mix(c, '#000000', -amt));

export function star(cx, cy, r1, r2, n = 5, rot = -Math.PI / 2) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? r2 : r1;
    const a = rot + (i * Math.PI) / n;
    d += (i ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(1) + ' ' + (cy + r * Math.sin(a)).toFixed(1) + ' ';
  }
  return d + 'Z';
}

export const heart = (cx, cy, s) =>
  `M ${cx} ${cy + s * 0.9} C ${cx - s * 1.6} ${cy - s * 0.1}, ${cx - s * 0.7} ${cy - s * 1.3}, ${cx} ${cy - s * 0.45} ` +
  `C ${cx + s * 0.7} ${cy - s * 1.3}, ${cx + s * 1.6} ${cy - s * 0.1}, ${cx} ${cy + s * 0.9} Z`;

// Point on a cubic bezier
export function bez(p0, p1, p2, p3, t) {
  const u = 1 - t;
  return [0, 1].map((i) => u * u * u * p0[i] + 3 * u * u * t * p1[i] + 3 * u * t * t * p2[i] + t * t * t * p3[i]);
}

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
