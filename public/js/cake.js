// SVG renderer for the loaf cake. Everything is generated as markup strings with
// inline fill attributes (no CSS variables) so the same SVG can be rasterised to PNG.
//
// Geometry: a classic loaf cake is ~20 (long) x 10 (deep) x 13 (tall). The front face
// is the 20x13 side, the right side face shows the foreshortened 10cm depth, and the
// domed top ("cap") carries the signature crack.

import { FILLINGS, GLAZES } from './data.js';
import { rng, pick, mix, shade, star, heart, bez, clamp } from './util.js';

let uid = 0;
const INK = '#3d2314';

const CAP = 'M 62 150 C 56 112, 96 90, 150 84 C 210 76, 300 74, 350 84 C 384 90, 392 116, 376 132 C 366 142, 350 150, 338 154 C 300 164, 110 164, 62 150 Z';
const BODY = 'M 72 148 L 330 148 L 322 292 Q 320 300 312 300 L 90 300 Q 82 300 80 292 Z';
const SIDE = 'M 326 150 L 374 124 L 366 268 Q 364 276 356 280 L 318 298 Z';
const GLAZE = 'M 70 147 C 64 114, 102 95, 152 89 C 212 81, 300 79, 346 89 C 374 95, 384 116, 370 130 C 360 140, 346 147, 334 151 C 300 161, 110 161, 70 147 Z';
const GLAZE_EDGE = [[334, 151], [300, 161], [110, 161], [70, 147]];
const CRACK = [[118, 112], [170, 100], [262, 96], [336, 104]];
const PAN = 'M 64 236 L 338 236 L 328 306 Q 326 312 318 312 L 84 312 Q 76 312 74 306 Z';
const PAN_SIDE = 'M 336 236 L 382 210 L 372 280 Q 370 286 362 290 L 326 310 Z';

const ridgeY = (x) => bez(...CRACK, clamp((x - 118) / 218))[1];

// ---------- filling chunks ----------

export function chunk(fid, x, y, r, s = 1) {
  const f = FILLINGS[fid];
  const c = pick(r, f.chunks);
  const rot = Math.round(r() * 360);
  const g = (inner) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot}) scale(${s})">${inner}</g>`;
  switch (fid) {
    case 'apple':
      return g(`<rect x="-6" y="-6" width="12" height="12" rx="3" fill="${c}" stroke="${INK}" stroke-width="1.6"/>` +
        `<path d="M -6 -2 Q -6 -6 -2 -6 L 6 -6" stroke="${f.accent}" stroke-width="3" fill="none" stroke-linecap="round"/>`);
    case 'citrus':
      return g(`<circle r="5.5" fill="${c}" stroke="${INK}" stroke-width="1.4"/><circle r="2.4" fill="${shade(c, 0.5)}"/>`);
    case 'chocolate':
      return g(`<path d="M 0 -7 C 4 -2, 7 3, 0 6 C -7 3, -4 -2, 0 -7 Z" fill="${c}" stroke="${INK}" stroke-width="1.4"/>`);
    default:
      return g(`<ellipse rx="7" ry="5" fill="${c}" stroke="${INK}" stroke-width="1.4"/><ellipse cx="-2" cy="-1.5" rx="2.2" ry="1.4" fill="#fff" opacity=".5"/>`);
  }
}

function frontChunks(fid, r, n) {
  const pts = [];
  let guard = 0;
  while (pts.length < n && guard++ < 500) {
    const x = 94 + r() * 220, y = 172 + r() * 116;
    if (x > 116 && x < 288 && y > 186 && y < 268) continue; // keep the face clear
    if (pts.some((p) => Math.hypot(p[0] - x, p[1] - y) < 28)) continue;
    pts.push([x, y]);
  }
  return pts.map(([x, y]) => chunk(fid, x, y, r)).join('');
}

// ---------- face ----------

function eye(type, x, y) {
  switch (type) {
    case 'sparkle':
      return `<ellipse cx="${x}" cy="${y}" rx="15" ry="17" fill="#fff" stroke="${INK}" stroke-width="3"/>` +
        `<path d="${star(x + 1, y + 2, 11, 4.6)}" fill="#ffb703" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>` +
        `<circle cx="${x - 5}" cy="${y - 7}" r="2.6" fill="#fff"/>`;
    case 'happy':
      return `<path d="M ${x - 12} ${y + 4} Q ${x} ${y - 12} ${x + 12} ${y + 4}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    case 'hearts':
      return `<path d="${heart(x, y, 12)}" fill="#ff4f7b" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>` +
        `<circle cx="${x - 5}" cy="${y - 5}" r="2.6" fill="#fff" opacity=".85"/>`;
    case 'sleep':
      return `<path d="M ${x - 12} ${y} Q ${x} ${y + 9} ${x + 12} ${y}" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
    default:
      return `<ellipse cx="${x}" cy="${y}" rx="15" ry="17" fill="#fff" stroke="${INK}" stroke-width="3"/>` +
        `<circle cx="${x + 2}" cy="${y + 3}" r="9" fill="#2b1a10"/>` +
        `<circle cx="${x - 1}" cy="${y - 1}" r="3.6" fill="#fff"/><circle cx="${x + 6}" cy="${y + 7}" r="1.8" fill="#fff"/>`;
  }
}

const EYE_L = [160, 214], EYE_R = [242, 214];

function eyes(type) {
  const blink = type === 'big' || type === 'sparkle' ? ' class="blink"' : '';
  return `<g${blink}>${eye(type, ...EYE_L)}${eye(type, ...EYE_R)}</g>`;
}

function mouth(type) {
  const stroke = `stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  switch (type) {
    case 'grin':
      return `<path d="M 181 240 Q 201 270 221 240 Z" fill="#5a1e1e" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>` +
        `<path d="M 191 251 Q 201 243 211 251 Q 201 258 191 251 Z" fill="#ff7096"/>`;
    case 'cat':
      return `<path d="M 185 243 Q 193 253 201 243 Q 209 253 217 243" ${stroke}/>`;
    case 'tongue':
      return `<path d="M 205 248 Q 205 264 213 263 Q 220 260 216 246" fill="#ff7096" stroke="${INK}" stroke-width="2.5"/>` +
        `<path d="M 183 242 Q 201 260 219 242" ${stroke}/>`;
    case 'wow':
      return `<ellipse cx="201" cy="248" rx="7" ry="9" fill="#5a1e1e" stroke="${INK}" stroke-width="3"/>`;
    default:
      return `<path d="M 183 242 Q 201 262 219 242" ${stroke}/>`;
  }
}

const GLASSES =
  `<g><path d="M 136 202 h 48 v 12 q 0 18 -24 18 q -24 0 -24 -18 z" fill="#1b1b2f" stroke="${INK}" stroke-width="3"/>` +
  `<path d="M 218 202 h 48 v 12 q 0 18 -24 18 q -24 0 -24 -18 z" fill="#1b1b2f" stroke="${INK}" stroke-width="3"/>` +
  `<path d="M 184 207 Q 201 200 218 207" stroke="${INK}" stroke-width="4" fill="none"/>` +
  `<path d="M 146 208 l 10 -4 M 228 208 l 10 -4" stroke="#fff" stroke-width="3.5" stroke-linecap="round" opacity=".75"/></g>`;

function face(c, mood, glasses) {
  const e = mood === 'sleep' ? 'sleep' : c.eyes || 'big';
  const m = mood === 'wow' ? 'wow' : c.mouth || 'smile';
  return `<g class="face">` +
    `<ellipse cx="128" cy="242" rx="13" ry="8" fill="#ff8fa3" opacity=".6"/>` +
    `<ellipse cx="274" cy="242" rx="13" ry="8" fill="#ff8fa3" opacity=".6"/>` +
    (glasses ? GLASSES : eyes(e)) + mouth(m) + `</g>`;
}

// ---------- glaze & sprinkles ----------

function glaze(type, r, idp, defs) {
  if (!type || type === 'none') return '';
  let fill = GLAZES[type];
  if (type === 'rainbow') {
    defs.push(`<linearGradient id="${idp}rb" x1="0" x2="1" y1="0" y2="0">` +
      ['#ff7aa8', '#ffb86b', '#ffe066', '#7be0ad', '#74b9ff', '#c49bff']
        .map((col, i) => `<stop offset="${i / 5}" stop-color="${col}"/>`).join('') + `</linearGradient>`);
    fill = `url(#${idp}rb)`;
  } else if (type === 'galaxy') {
    defs.push(`<radialGradient id="${idp}gx" cx="40%" cy="30%" r="80%">` +
      `<stop offset="0" stop-color="#9b7bff"/><stop offset=".5" stop-color="#4b2c9e"/><stop offset="1" stop-color="#1d1145"/></radialGradient>`);
    fill = `url(#${idp}gx)`;
  }
  const shapes = [GLAZE];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const t = 0.06 + (i / (n - 1)) * 0.88 + (r() - 0.5) * 0.05;
    const [x, y] = bez(...GLAZE_EDGE, t);
    const len = 10 + r() * 28;
    shapes.push(`M ${x - 7} ${y - 8} L ${x - 7} ${y + len} a 7 7 0 0 0 14 0 L ${x + 7} ${y - 8} Z`);
  }
  // Stroke everything first, then fill on top, so drips merge into one outline.
  let out = shapes.map((d) => `<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`).join('');
  out += shapes.map((d) => `<path d="${d}" fill="${fill}"/>`).join('');
  if (type === 'galaxy') {
    for (let i = 0; i < 14; i++) {
      const [x, y] = ellipsePoint(r, 218, 118, 130, 26);
      out += `<path d="${star(x, y, 3 + r() * 3, 1.3, 4)}" fill="#fff" opacity="${(0.6 + r() * 0.4).toFixed(2)}"/>`;
    }
  }
  out += `<path d="M 104 108 C 140 94, 196 88, 244 88" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity="${type === 'choco' || type === 'galaxy' ? 0.3 : 0.6}"/>`;
  return out;
}

function ellipsePoint(r, cx, cy, rx, ry) {
  const a = r() * Math.PI * 2, d = Math.sqrt(r());
  return [cx + Math.cos(a) * rx * d, cy + Math.sin(a) * ry * d];
}

const SPRINKLE_COLORS = {
  rainbow: ['#ff5d8f', '#ffd23f', '#3bceac', '#5d9cec', '#b07cff', '#ff8c42'],
  choco: ['#4a2511', '#6b3a1e', '#2e1608'],
};

function sprinkles(type, r) {
  if (!type || type === 'none') return '';
  let out = '';
  const at = () => ellipsePoint(r, 222, 116, 128, 24);
  if (type === 'rainbow' || type === 'choco') {
    for (let i = 0; i < 46; i++) {
      const [x, y] = at();
      out += `<rect x="${(x - 4.5).toFixed(1)}" y="${(y - 1.75).toFixed(1)}" width="9" height="3.5" rx="1.75" ` +
        `fill="${pick(r, SPRINKLE_COLORS[type])}" transform="rotate(${Math.round(r() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
  } else if (type === 'stars') {
    for (let i = 0; i < 18; i++) {
      const [x, y] = at();
      out += `<path d="${star(x, y, 6, 2.7)}" fill="#ffd23f" stroke="#d99a00" stroke-width="1"/>`;
    }
  } else if (type === 'hearts') {
    for (let i = 0; i < 18; i++) {
      const [x, y] = at();
      out += `<path d="${heart(x, y, 4.5)}" fill="${pick(r, ['#ff4f7b', '#ff8fb8', '#ff2e63'])}"/>`;
    }
  } else if (type === 'powder') {
    out += `<path d="${CAP}" fill="#fff" opacity=".3"/>`;
    for (let i = 0; i < 130; i++) {
      const [x, y] = ellipsePoint(r, 222, 118, 150, 34);
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(0.9 + r() * 1.5).toFixed(1)}" fill="#fff" opacity=".9"/>`;
    }
  } else if (type === 'gold') {
    for (let i = 0; i < 34; i++) {
      const [x, y] = at();
      out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.2 + r() * 1.8).toFixed(1)}" fill="${pick(r, ['#ffd23f', '#ffe98a', '#e8b100'])}"/>`;
    }
    for (let i = 0; i < 7; i++) {
      const [x, y] = at();
      out += `<path class="twinkle" style="animation-delay:${(r() * 2).toFixed(2)}s" d="${star(x, y - 6, 8, 1.8, 4)}" fill="#fff8c4"/>`;
    }
  }
  return out;
}

// ---------- toppings ----------

export function topping(type) {
  const sw = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"`;
  const wheel = (rind, flesh, seg) =>
    `<circle cx="0" cy="-14" r="14" fill="${rind}" ${sw}/><circle cx="0" cy="-14" r="10.5" fill="${flesh}"/>` +
    [0, 1, 2, 3, 4, 5].map((i) => {
      const a = (i * Math.PI) / 3;
      return `<line x1="0" y1="-14" x2="${(Math.cos(a) * 10.5).toFixed(1)}" y2="${(-14 + Math.sin(a) * 10.5).toFixed(1)}" stroke="${seg}" stroke-width="2"/>`;
    }).join('') + `<circle cx="0" cy="-14" r="2" fill="#fff" opacity=".8"/>`;
  switch (type) {
    case 'cherry':
      return `<path d="M 0 -18 Q 2 -34 12 -40" stroke="#4e8a2a" stroke-width="3" fill="none" stroke-linecap="round"/>` +
        `<path d="M 12 -40 Q 22 -44 24 -34 Q 16 -32 12 -40 Z" fill="#7cc243" stroke="${INK}" stroke-width="1.5"/>` +
        `<circle cx="0" cy="-11" r="12" fill="#e5243b" ${sw}/><circle cx="-4" cy="-15" r="3.5" fill="#fff" opacity=".8"/>`;
    case 'strawberry':
      return `<path d="M 0 0 C -14 -4, -16 -22, -10 -26 C -4 -29, 4 -29, 10 -26 C 16 -22, 14 -4, 0 0 Z" fill="#ff4d6d" ${sw}/>` +
        [[-5, -18], [4, -20], [-1, -11], [6, -10], [-7, -9]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.2" ry="1.8" fill="#ffe066"/>`).join('') +
        `<path d="M -10 -26 L -7 -34 L 0 -29 L 7 -34 L 10 -26 Z" fill="#58b847" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    case 'orange':
      return wheel('#ff9f1c', '#ffcf86', '#ff9f1c');
    case 'lemon':
      return wheel('#ffd60a', '#fff3a6', '#f2c200');
    case 'apple':
      return `<path d="M -15 -2 Q 0 -36 15 -2 Q 0 4 -15 -2 Z" fill="#fff3c4" ${sw}/>` +
        `<path d="M -13 -5 Q 0 -32 13 -5" stroke="#e5243b" stroke-width="4" fill="none" stroke-linecap="round"/>` +
        `<path d="M -3 -10 q 1 -5 2 0 z M 3 -10 q 1 -5 2 0 z" fill="#6b3a1e"/>`;
    case 'plum':
      return `<ellipse cx="0" cy="-13" rx="12" ry="13" fill="#7b2d8b" ${sw}/>` +
        `<path d="M 0 -26 Q 3 -16 0 -2" stroke="#5e1f6e" stroke-width="2" fill="none" opacity=".7"/>` +
        `<ellipse cx="-5" cy="-17" rx="3" ry="4.5" fill="#fff" opacity=".45"/>` +
        `<path d="M 0 -26 Q 6 -34 13 -30 Q 6 -25 0 -26 Z" fill="#7cc243" stroke="${INK}" stroke-width="1.5"/>`;
    case 'chocolate':
      return `<g transform="rotate(-12)"><rect x="-13" y="-25" width="26" height="23" rx="3" fill="#5a2f1c" ${sw}/>` +
        `<path d="M 0 -25 V -2 M -13 -13.5 H 13" stroke="#3a1c0e" stroke-width="2"/>` +
        `<path d="M -10 -22 h 6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".4"/></g>`;
    case 'marshmallow':
      return `<rect x="-11" y="-25" width="22" height="25" rx="8" fill="#ffd6e7" ${sw}/>` +
        `<ellipse cx="0" cy="-20" rx="8" ry="3.2" fill="#fff" opacity=".85"/>`;
    case 'mint':
      return `<path d="M 0 -2 C -14 -6, -18 -22, -6 -31 C -2 -20, 0 -10, 0 -2 Z" fill="#58c46b" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
        `<path d="M 0 -2 C 14 -6, 18 -22, 6 -31 C 2 -20, 0 -10, 0 -2 Z" fill="#7ad48a" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
    case 'cookie':
      return `<path d="${star(0, -15, 16, 8)}" fill="#f2b25c" ${sw}/>` +
        `<path d="${star(0, -15, 9.5, 4.8)}" fill="#fff4e0"/><circle cx="0" cy="-15" r="2.6" fill="#ff5d8f"/>`;
    default:
      return '';
  }
}

function toppings(list) {
  const n = list.length;
  if (!n) return '';
  return list.map((type, i) => {
    const x = n === 1 ? 228 : 128 + (i * 200) / (n - 1);
    const y = ridgeY(x) + 7;
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(1.15)">${topping(type)}</g>`;
  }).join('');
}

// ---------- magic extras ----------

const WING = 'M 0 0 C -18 -46, -78 -70, -86 -26 C -98 -14, -90 6, -70 4 C -82 20, -64 34, -48 22 C -46 38, -22 38, -16 22 C -8 28, 2 18, 0 0 Z';
const wing = `<g class="flap"><path d="${WING}" fill="#fff" stroke="#6f9fd6" stroke-width="3.5" stroke-linejoin="round"/>` +
  `<path d="M -12 -6 C -30 -24, -56 -34, -72 -24 M -14 6 C -30 0, -46 4, -58 12" stroke="#bcd5f0" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
// Scaled to 0.8 so the wing tips (path spans ~98px) stay inside the 440px viewBox while flapping.
const WINGS = `<g transform="translate(90 196) scale(.8)">${wing}</g><g transform="translate(354 170) scale(-.8 .8)">${wing}</g>`;

function rainbow() {
  const cols = ['#ff5d8f', '#ff9f43', '#ffd23f', '#3bceac', '#5d9cec', '#a66cff'];
  const cx = 226, cy = 262;
  let out = cols.map((col, i) => {
    const rr = 196 - i * 16;
    return `<path d="M ${cx - rr} ${cy} A ${rr} ${rr} 0 0 1 ${cx + rr} ${cy}" stroke="${col}" stroke-width="16" fill="none"/>`;
  }).join('');
  const cloud = (x) => [[-18, 4, 16], [0, -6, 20], [18, 4, 16]]
    .map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${cy + dy}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="3"/>`).join('') +
    [[-18, 4, 13.5], [0, -6, 17.5], [18, 4, 13.5]].map(([dx, dy, r]) => `<circle cx="${x + dx}" cy="${cy + dy}" r="${r}" fill="#fff"/>`).join('');
  return `<g opacity=".95">${out}</g>${cloud(cx - 156)}${cloud(cx + 156)}`;
}

const CROWN = `<g transform="translate(228 34)"><g class="bob">` +
  `<path d="M -38 22 L -42 -10 L -20 6 L 0 -22 L 20 6 L 42 -10 L 38 22 Z" fill="#ffd23f" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
  `<rect x="-39" y="16" width="78" height="10" rx="3" fill="#ffb703" stroke="${INK}" stroke-width="3"/>` +
  `<circle cx="0" cy="4" r="5" fill="#ff4f7b" stroke="${INK}" stroke-width="2"/>` +
  `<circle cx="-22" cy="12" r="3.5" fill="#3bceac"/><circle cx="22" cy="12" r="3.5" fill="#5d9cec"/>` +
  [[-42, -10], [0, -22], [42, -10]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#fff4b0" stroke="${INK}" stroke-width="2"/>`).join('') +
  `</g></g>`;

const halo = (y) => `<g transform="translate(228 ${y})"><g class="bob slow">` +
  `<ellipse rx="52" ry="12" fill="none" stroke="#ffd23f" stroke-width="8"/>` +
  `<ellipse rx="52" ry="12" fill="none" stroke="#fff7c2" stroke-width="2.5"/></g></g>`;

function candles() {
  const cols = ['#ff8fb8', '#7be0ad', '#74b9ff'];
  return [178, 228, 278].map((x, i) => {
    const y = ridgeY(x) + 4;
    return `<g transform="translate(${x} ${y.toFixed(1)})">` +
      `<rect x="-6" y="-44" width="12" height="44" rx="3" fill="${cols[i]}" stroke="${INK}" stroke-width="2.5"/>` +
      `<path d="M -6 -34 L 6 -40 M -6 -20 L 6 -26 M -6 -6 L 6 -12" stroke="#fff" stroke-width="3" opacity=".8"/>` +
      `<line x1="0" y1="-44" x2="0" y2="-50" stroke="${INK}" stroke-width="2"/>` +
      `<g class="flicker" style="animation-delay:${i * 0.17}s">` +
      `<path d="M 0 -68 C 9 -57, 8 -50, 0 -48 C -8 -50, -9 -57, 0 -68 Z" fill="#ffb703" stroke="#ff7b00" stroke-width="1.5"/>` +
      `<path d="M 0 -61 C 3 -56, 3 -52, 0 -51 C -3 -52, -3 -56, 0 -61 Z" fill="#fff4b0"/></g></g>`;
  }).join('');
}

// ---------- crack ----------

function crack(f, r, fid, bake) {
  if (bake < 0.35) return '';
  const crumb = f.crumb;
  const d = `M ${CRACK[0].join(' ')} C ${CRACK.slice(1).map((p) => p.join(' ')).join(', ')}`;
  let jag = '';
  for (let i = 0; i <= 14; i++) {
    const [x, y] = bez(...CRACK, i / 14);
    jag += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + (y + (i % 2 ? -3 : 3)).toFixed(1) + ' ';
  }
  let peeks = '';
  for (let i = 0; i < 4; i++) {
    const [x, y] = bez(...CRACK, 0.15 + i * 0.23 + r() * 0.05);
    peeks += chunk(fid, x, y, r, 0.8);
  }
  return `<g opacity="${clamp((bake - 0.35) / 0.4).toFixed(2)}">` +
    `<path d="${d}" stroke="${shade(f.top, -0.25)}" stroke-width="17" fill="none" stroke-linecap="round"/>` +
    `<path d="${d}" stroke="${crumb}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
    `<path d="${jag}" stroke="${shade(f.top, -0.2)}" stroke-width="2" fill="none" stroke-linejoin="round"/>${peeks}</g>`;
}

// ---------- public renderers ----------

/**
 * @param c cake config { filling, glaze, sprinkles, toppings[], eyes, mouth, extras[], seed }
 * @param o { bake 0..1, rise 0..1, pan, empty (pan only, no batter), mood: 'sleep'|'wow'|null, cls }
 */
export function cakeSVG(c, o = {}) {
  const { bake = 1, rise = 1, pan = false, empty = false, mood = null, cls = '' } = o;
  const fid = c.filling || 'apple';
  const f = FILLINGS[fid];
  const idp = 'k' + ++uid;
  const r = rng(c.seed || 1);
  const crust = mix(f.raw, f.crust, bake);
  const top = mix(f.raw, f.top, bake);
  const ex = new Set(c.extras || []);
  const defs = [];
  const sy = (0.55 + 0.45 * clamp(rise)).toFixed(3);
  const out = f.out;

  const chunks = frontChunks(fid, r, 8);
  const glazed = glaze(c.glaze, r, idp, defs);
  const spr = sprinkles(c.sprinkles, r);

  const body =
    `<path d="${SIDE}" fill="${shade(crust, -0.16)}" stroke="${out}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="${BODY}" fill="${crust}" stroke="${out}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<path d="M 92 168 L 88 282" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".22"/>` +
    `<path d="M 84 284 L 318 284" stroke="${shade(crust, -0.12)}" stroke-width="10" opacity=".5"/>` +
    chunks + (pan ? '' : face(c, mood, ex.has('glasses')));

  const cap =
    `<path d="${CAP}" fill="${top}" stroke="${out}" stroke-width="3.5" stroke-linejoin="round"/>` +
    `<ellipse cx="160" cy="100" rx="40" ry="9" fill="#fff" opacity=".22" transform="rotate(-6 160 100)"/>` +
    (glazed ? glazed : crack(f, r, fid, bake)) + spr +
    (ex.has('candles') ? candles() : '') + toppings(c.toppings || []);

  const panMarkup = pan
    ? `<path d="${PAN_SIDE}" fill="#9fb0c0" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="${PAN}" fill="#c9d4df" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` +
      `<path d="M 84 248 L 320 248" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".6"/>`
    : '';

  return `<svg class="cake ${cls}" viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg">` +
    `<defs>${defs.join('')}</defs><g transform="translate(0 25)">` +
    (ex.has('rainbow') ? rainbow() : '') +
    `<ellipse cx="222" cy="${pan ? 314 : 304}" rx="172" ry="13" fill="#000" opacity=".14"/>` +
    (ex.has('wings') && !pan ? WINGS : '') +
    (empty ? '' : `<g transform="translate(0 300) scale(1 ${sy}) translate(0 -300)">${body}${cap}</g>`) +
    panMarkup +
    (ex.has('crown') ? CROWN : '') +
    (ex.has('halo') ? halo(ex.has('crown') ? -6 : 30) : '') +
    `</g></svg>`;
}

const SLICE = 'M 56 112 C 54 70, 80 56, 120 56 C 160 56, 186 70, 184 112 L 178 244 Q 177 252 169 252 L 71 252 Q 63 252 62 244 Z';
const SLICE_TOP = 'M 56 112 C 54 70, 80 56, 120 56 C 160 56, 186 70, 184 112';

/** Cross-section of one slice: the cut face is 10 (deep) x 13 (tall). */
export function sliceSVG(c) {
  const fid = c.filling || 'apple';
  const f = FILLINGS[fid];
  const idp = 's' + ++uid;
  const r = rng((c.seed || 1) + 7);
  const defs = [`<clipPath id="${idp}c"><path d="${SLICE}"/></clipPath>`];

  let inside = `<rect x="40" y="40" width="160" height="220" fill="${f.crumb}"/>`;
  for (let i = 0; i < 46; i++) {
    const x = 62 + r() * 116, y = 70 + r() * 176;
    inside += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(1.5 + r() * 3).toFixed(1)}" ry="${(1 + r() * 2).toFixed(1)}" fill="${shade(f.crumb, -0.12)}"/>`;
  }
  const scatter = (n, fn) => {
    for (let i = 0; i < n; i++) inside += fn(62 + r() * 116, 76 + r() * 168);
  };
  if (fid === 'apple') {
    scatter(13, (x, y) => chunk('apple', x, y, r, 1.2));
  } else if (fid === 'citrus') {
    inside += `<path d="M 50 205 C 90 170, 100 225, 130 192 S 172 160, 192 182" stroke="#ff9f1c" stroke-width="10" fill="none" stroke-linecap="round" opacity=".85"/>`;
    inside += `<path d="M 50 132 C 88 110, 110 162, 140 130 S 172 112, 192 126" stroke="#ffd60a" stroke-width="10" fill="none" stroke-linecap="round" opacity=".9"/>`;
    scatter(22, (x, y) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(1.5 + r() * 1.5).toFixed(1)}" fill="${pick(r, f.chunks)}"/>`);
  } else if (fid === 'chocolate') {
    inside += `<path d="M 48 150 C 80 120, 110 180, 140 146 S 176 120, 194 140" stroke="#4b2614" stroke-width="14" fill="none" opacity=".55" stroke-linecap="round"/>`;
    inside += `<path d="M 48 214 C 84 196, 104 236, 140 210 S 178 196, 194 206" stroke="#4b2614" stroke-width="10" fill="none" opacity=".45" stroke-linecap="round"/>`;
    scatter(12, (x, y) => chunk('chocolate', x, y, r, 1.2));
  } else {
    scatter(7, (x, y) =>
      `<path d="M ${x - 11} ${y} C ${x - 12} ${y - 9}, ${x + 10} ${y - 11}, ${x + 11} ${y - 1} C ${x + 12} ${y + 8}, ${x - 10} ${y + 10}, ${x - 11} ${y} Z" fill="#8e3fa0" stroke="#5e1f6e" stroke-width="2"/>` +
      `<ellipse cx="${x - 3}" cy="${y - 3}" rx="3" ry="2" fill="#fff" opacity=".45"/>`);
  }
  inside += `<path d="${SLICE}" fill="none" stroke="${f.crust}" stroke-width="16"/>`;
  inside += `<path d="${SLICE_TOP}" fill="none" stroke="${f.top}" stroke-width="20"/>`;

  let top = '';
  if (c.glaze && c.glaze !== 'none') {
    let fill = GLAZES[c.glaze];
    if (c.glaze === 'rainbow' || c.glaze === 'galaxy') {
      const stops = c.glaze === 'rainbow'
        ? ['#ff7aa8', '#ffe066', '#7be0ad', '#74b9ff', '#c49bff']
        : ['#9b7bff', '#4b2c9e', '#1d1145'];
      defs.push(`<linearGradient id="${idp}g" x1="0" x2="1">` + stops.map((s, i) => `<stop offset="${i / (stops.length - 1)}" stop-color="${s}"/>`).join('') + `</linearGradient>`);
      fill = `url(#${idp}g)`;
    }
    const shapes = [
      'M 50 116 C 48 64, 80 48, 120 48 C 160 48, 192 64, 190 116 C 170 100, 70 100, 50 116 Z',
      'M 50 100 L 50 140 a 8 8 0 0 0 16 0 L 66 100 Z',
      'M 174 100 L 174 128 a 8 8 0 0 0 16 0 L 190 100 Z',
    ];
    top += shapes.map((d) => `<path d="${d}" fill="${INK}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>`).join('');
    top += shapes.map((d) => `<path d="${d}" fill="${fill}"/>`).join('');
  }
  if (c.sprinkles && c.sprinkles !== 'none') {
    const cols = SPRINKLE_COLORS[c.sprinkles] || (c.sprinkles === 'hearts' ? ['#ff4f7b'] : c.sprinkles === 'powder' ? ['#ffffff'] : ['#ffd23f']);
    for (let i = 0; i < 16; i++) {
      const [x, y] = bez([58, 100], [56, 58], [184, 58], [182, 100], 0.08 + r() * 0.84);
      top += `<rect x="${(x - 4).toFixed(1)}" y="${(y - 2).toFixed(1)}" width="8" height="3.5" rx="1.75" fill="${pick(r, cols)}" transform="rotate(${Math.round(r() * 180)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
  }

  const tinyFace =
    `<circle cx="102" cy="160" r="5.5" fill="#2b1a10"/><circle cx="138" cy="160" r="5.5" fill="#2b1a10"/>` +
    `<circle cx="100.5" cy="158" r="1.8" fill="#fff"/><circle cx="136.5" cy="158" r="1.8" fill="#fff"/>` +
    `<ellipse cx="92" cy="172" rx="7" ry="4" fill="#ff8fa3" opacity=".6"/><ellipse cx="148" cy="172" rx="7" ry="4" fill="#ff8fa3" opacity=".6"/>` +
    `<path d="M 112 170 Q 120 178 128 170" stroke="#2b1a10" stroke-width="3" fill="none" stroke-linecap="round"/>`;

  return `<svg class="slice" viewBox="0 0 240 280" xmlns="http://www.w3.org/2000/svg"><defs>${defs.join('')}</defs>` +
    `<ellipse cx="120" cy="256" rx="106" ry="18" fill="#fff" stroke="${INK}" stroke-width="3"/>` +
    `<ellipse cx="120" cy="254" rx="80" ry="11" fill="none" stroke="#bfe3ff" stroke-width="3"/>` +
    `<g clip-path="url(#${idp}c)">${inside}</g>` +
    `<path d="${SLICE}" fill="none" stroke="${f.out}" stroke-width="3.5" stroke-linejoin="round"/>` +
    top + tinyFace + `</svg>`;
}

// ---------- small icons for the UI ----------

export const toppingIcon = (type) => `<svg viewBox="-24 -46 48 50" aria-hidden="true">${topping(type)}</svg>`;

export function eyesIcon(type) {
  return `<svg viewBox="134 192 134 44" aria-hidden="true">${eye(type, ...EYE_L)}${eye(type, ...EYE_R)}</svg>`;
}
export function mouthIcon(type) {
  return `<svg viewBox="174 230 54 38" aria-hidden="true">${mouth(type)}</svg>`;
}
export function sprinkleIcon(type) {
  const r = rng(42);
  return `<svg viewBox="88 86 268 62" aria-hidden="true"><ellipse cx="222" cy="117" rx="132" ry="28" fill="#f2c27a"/>${sprinkles(type, r)}</svg>`;
}

export function fillingIcon(fid) {
  const sw = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"`;
  const icons = {
    apple: `<path d="M 24 16 C 14 8, 4 16, 6 28 C 8 40, 18 44, 24 40 C 30 44, 40 40, 42 28 C 44 16, 34 8, 24 16 Z" fill="#e5243b" ${sw}/>` +
      `<path d="M 24 16 Q 24 9 28 5" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>` +
      `<path d="M 26 10 Q 34 4 38 10 Q 32 14 26 10 Z" fill="#7cc243" stroke="${INK}" stroke-width="1.8"/>` +
      `<ellipse cx="15" cy="22" rx="3" ry="5" fill="#fff" opacity=".6"/>`,
    citrus: `<circle cx="18" cy="26" r="14" fill="#ff9f1c" ${sw}/><circle cx="18" cy="26" r="10" fill="#ffcf86"/>` +
      `<path d="M 18 16 V 36 M 8 26 H 28 M 11 19 L 25 33 M 25 19 L 11 33" stroke="#ff9f1c" stroke-width="1.8"/>` +
      `<ellipse cx="33" cy="26" rx="11" ry="9" fill="#ffd60a" ${sw}/><ellipse cx="30" cy="23" rx="3" ry="2" fill="#fff" opacity=".6"/>`,
    chocolate: `<g transform="rotate(-14 24 24)"><rect x="10" y="8" width="28" height="34" rx="4" fill="#5a2f1c" ${sw}/>` +
      `<path d="M 24 8 V 42 M 10 19 H 38 M 10 30 H 38" stroke="#3a1c0e" stroke-width="2"/>` +
      `<path d="M 14 12 h 6" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".45"/></g>`,
    plum: `<ellipse cx="24" cy="28" rx="15" ry="14" fill="#7b2d8b" ${sw}/>` +
      `<path d="M 24 14 Q 28 26 24 42" stroke="#5e1f6e" stroke-width="2" fill="none" opacity=".7"/>` +
      `<ellipse cx="17" cy="23" rx="3.5" ry="5" fill="#fff" opacity=".45"/>` +
      `<path d="M 24 14 Q 31 4 39 9 Q 31 15 24 14 Z" fill="#7cc243" stroke="${INK}" stroke-width="1.8"/>`,
  };
  return `<svg viewBox="0 0 48 48" aria-hidden="true">${icons[fid]}</svg>`;
}
