// Hand-drawn SVG icons for UI buttons, in the same outlined cartoon style as the cake.
// These replace emoji, which render differently on every platform and don't match the art.

const INK = '#3d2314';
const sw = (w = 2.5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const svg = (inner, vb = '0 0 48 48') => `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${inner}</svg>`;

const WING = 'M 0 0 C -18 -46, -78 -70, -86 -26 C -98 -14, -90 6, -70 4 C -82 20, -64 34, -48 22 C -46 38, -22 38, -16 22 C -8 28, 2 18, 0 0 Z';

const EXTRAS = {
  crown:
    `<path d="M 7 37 L 4 14 L 15 24 L 24 8 L 33 24 L 44 14 L 41 37 Z" fill="#ffd23f" ${sw()}/>` +
    `<rect x="6" y="33" width="36" height="8" rx="2.5" fill="#ffb703" ${sw()}/>` +
    `<circle cx="24" cy="26" r="3.6" fill="#ff4f7b" ${sw(1.6)}/>` +
    `<circle cx="14" cy="30" r="2.2" fill="#3bceac"/><circle cx="34" cy="30" r="2.2" fill="#5d9cec"/>` +
    `<circle cx="4" cy="14" r="2.6" fill="#fff4b0" ${sw(1.6)}/><circle cx="24" cy="8" r="2.6" fill="#fff4b0" ${sw(1.6)}/><circle cx="44" cy="14" r="2.6" fill="#fff4b0" ${sw(1.6)}/>` +
    `<path d="M 12 22 L 13 30" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".6"/>`,
  wings:
    `<g transform="translate(22 32) scale(.24)"><path d="${WING}" fill="#fff" stroke="#6f9fd6" stroke-width="11" stroke-linejoin="round"/>` +
    `<path d="M -12 -6 C -30 -24, -56 -34, -72 -24 M -14 6 C -30 0, -46 4, -58 12" stroke="#bcd5f0" stroke-width="8" fill="none" stroke-linecap="round"/></g>` +
    `<g transform="translate(26 32) scale(-.24 .24)"><path d="${WING}" fill="#fff" stroke="#6f9fd6" stroke-width="11" stroke-linejoin="round"/>` +
    `<path d="M -12 -6 C -30 -24, -56 -34, -72 -24 M -14 6 C -30 0, -46 4, -58 12" stroke="#bcd5f0" stroke-width="8" fill="none" stroke-linecap="round"/></g>`,
  halo:
    `<ellipse cx="24" cy="24" rx="19" ry="8" fill="none" stroke="${INK}" stroke-width="9"/>` +
    `<ellipse cx="24" cy="24" rx="19" ry="8" fill="none" stroke="#ffd23f" stroke-width="5.5"/>` +
    `<path d="M 10 21 Q 16 17.5 24 17" stroke="#fff7c2" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path d="M 40 8 l 1.5 3.5 l 3.5 1.5 l -3.5 1.5 l -1.5 3.5 l -1.5 -3.5 l -3.5 -1.5 l 3.5 -1.5 Z" fill="#ffd23f" ${sw(1.4)}/>`,
  candles: [[12, '#ff8fb8'], [24, '#7be0ad'], [36, '#74b9ff']].map(([x, c], i) => {
    const top = i === 1 ? 18 : 22;
    return `<rect x="${x - 4}" y="${top}" width="8" height="${44 - top}" rx="2" fill="${c}" ${sw(2)}/>` +
      `<path d="M ${x - 4} ${top + 8} L ${x + 4} ${top + 4} M ${x - 4} ${top + 16} L ${x + 4} ${top + 12}" stroke="#fff" stroke-width="2" opacity=".85"/>` +
      `<path d="M ${x} ${top - 13} C ${x + 5} ${top - 7}, ${x + 4} ${top - 2}, ${x} ${top - 1} C ${x - 4} ${top - 2}, ${x - 5} ${top - 7}, ${x} ${top - 13} Z" fill="#ffb703" stroke="#ff7b00" stroke-width="1.4"/>` +
      `<path d="M ${x} ${top - 8} C ${x + 1.8} ${top - 5}, ${x + 1.8} ${top - 3}, ${x} ${top - 2.5} C ${x - 1.8} ${top - 3}, ${x - 1.8} ${top - 5}, ${x} ${top - 8} Z" fill="#fff4b0"/>`;
  }).join(''),
  rainbow:
    ['#ff5d8f', '#ffd23f', '#3bceac', '#5d9cec'].map((c, i) => {
      const r = 19 - i * 4.5;
      return `<path d="M ${24 - r} 34 A ${r} ${r} 0 0 1 ${24 + r} 34" stroke="${c}" stroke-width="4.5" fill="none"/>`;
    }).join('') +
    `<g fill="#fff" ${sw(2)}><circle cx="6" cy="35" r="5"/><circle cx="12" cy="36" r="4.5"/><circle cx="36" cy="36" r="4.5"/><circle cx="42" cy="35" r="5"/></g>`,
  glasses:
    `<path d="M 3 18 h 18 v 5 q 0 9 -9 9 q -9 0 -9 -9 z" fill="#1b1b2f" ${sw()}/>` +
    `<path d="M 27 18 h 18 v 5 q 0 9 -9 9 q -9 0 -9 -9 z" fill="#1b1b2f" ${sw()}/>` +
    `<path d="M 21 20 Q 24 17.5 27 20" stroke="${INK}" stroke-width="2.5" fill="none"/>` +
    `<path d="M 7 22 l 5 -2 M 31 22 l 5 -2" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>`,
};

const INGREDIENTS = {
  flour:
    `<path d="M 12 16 C 8 24, 7 36, 10 42 Q 24 46 38 42 C 41 36, 40 24, 36 16 Z" fill="#fff6e3" ${sw()}/>` +
    `<path d="M 12 16 Q 24 20 36 16 L 33 10 Q 24 13 15 10 Z" fill="#f2e2c0" ${sw()}/>` +
    `<path d="M 16 15 Q 24 17 32 15" stroke="#d98c3c" stroke-width="2.5" fill="none"/>` +
    `<path d="M 24 40 V 26 M 24 30 l -4 -3 M 24 30 l 4 -3 M 24 35 l -4 -3 M 24 35 l 4 -3" stroke="#e0a042" stroke-width="2" fill="none" stroke-linecap="round"/>` +
    `<path d="M 30 6 q 2 -3 4 0 M 35 8 q 2 -3 4 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".9"/>`,
  eggs:
    `<path d="M 17 8 C 8 8, 5 24, 6 31 C 7 39, 12 43, 18 43 C 24 43, 29 39, 29 31 C 29 22, 26 8, 17 8 Z" fill="#fff8ee" ${sw()}/>` +
    `<path d="M 32 14 C 25 14, 22 26, 23 32 C 24 39, 28 43, 33 43 C 38 43, 43 39, 43 32 C 43 25, 39 14, 32 14 Z" fill="#f5d9b4" ${sw()}/>` +
    `<ellipse cx="12" cy="20" rx="2.5" ry="4.5" fill="#fff" transform="rotate(15 12 20)"/>` +
    `<ellipse cx="29" cy="24" rx="2" ry="3.6" fill="#fff" opacity=".8" transform="rotate(15 29 24)"/>`,
  butter:
    `<path d="M 6 26 L 28 34 L 44 24 L 22 17 Z" fill="#fff3a6" ${sw()}/>` +
    `<path d="M 6 26 L 6 34 L 28 42 L 28 34 Z" fill="#ffe066" ${sw()}/>` +
    `<path d="M 28 34 L 28 42 L 44 32 L 44 24 Z" fill="#f2c94c" ${sw()}/>` +
    `<path d="M 6 30 L 6 34 L 28 42 L 28 38 Z M 28 38 L 28 42 L 44 32 L 44 28 Z" fill="#8ecae6" opacity=".85"/>` +
    `<path d="M 14 24 L 24 21" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".85"/>`,
  sugar: [[8, 26], [24, 26], [16, 12]].map(([x, y]) =>
    `<path d="M ${x} ${y + 4} L ${x + 8} ${y} L ${x + 16} ${y + 4} L ${x + 8} ${y + 8} Z" fill="#ffffff" ${sw(2)}/>` +
    `<path d="M ${x} ${y + 4} L ${x} ${y + 14} L ${x + 8} ${y + 18} L ${x + 8} ${y + 8} Z" fill="#f1ecf7" ${sw(2)}/>` +
    `<path d="M ${x + 8} ${y + 8} L ${x + 8} ${y + 18} L ${x + 16} ${y + 14} L ${x + 16} ${y + 4} Z" fill="#ddd6ea" ${sw(2)}/>`).join('') +
    `<path d="M 40 8 l 1.2 2.8 l 2.8 1.2 l -2.8 1.2 l -1.2 2.8 l -1.2 -2.8 l -2.8 -1.2 l 2.8 -1.2 Z" fill="#fff" ${sw(1.2)}/>`,
};

const MODES = {
  // mini conveyor carrying a loaf
  factory:
    `<rect x="4" y="34" width="40" height="7" rx="3.5" fill="#616b7c" ${sw()}/>` +
    `<circle cx="11" cy="44" r="3" fill="#c9d4df" ${sw(2)}/><circle cx="24" cy="44" r="3" fill="#c9d4df" ${sw(2)}/><circle cx="37" cy="44" r="3" fill="#c9d4df" ${sw(2)}/>` +
    `<path d="M 12 22 L 34 22 L 33 34 L 13 34 Z" fill="#eeb25a" ${sw()}/>` +
    `<path d="M 10 23 C 9 14, 16 11, 23 11 C 31 11, 38 14, 36 23 C 30 26, 16 26, 10 23 Z" fill="#ffa3d1" ${sw()}/>` +
    `<circle cx="23" cy="9" r="3.5" fill="#e5243b" ${sw(1.8)}/>` +
    `<circle cx="19" cy="28" r="1.6" fill="${INK}"/><circle cx="27" cy="28" r="1.6" fill="${INK}"/>` +
    `<path d="M 6 6 h 6 v 10 h -6 Z" fill="#b8c4d0" ${sw(2)}/><path d="M 9 16 v 5" stroke="#ffe080" stroke-width="3" stroke-linecap="round"/>`,
  // mixing bowl with a whisk
  free:
    `<path d="M 30 4 L 22 26" stroke="#c98a4b" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M 22 26 C 14 22, 16 14, 24 18 C 32 22, 28 30, 22 26 Z" fill="none" stroke="#b8c4d0" stroke-width="2.5"/>` +
    `<ellipse cx="24" cy="26" rx="19" ry="5" fill="#fbe6a6" ${sw()}/>` +
    `<path d="M 5 26 A 19 5 0 0 0 43 26 Q 42 44 24 44 Q 6 44 5 26 Z" fill="#8ecae6" ${sw()}/>` +
    `<path d="M 9 33 Q 24 38 39 33" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/>` +
    `<circle cx="19" cy="37" r="1.6" fill="${INK}"/><circle cx="29" cy="37" r="1.6" fill="${INK}"/>`,
};

export const extraIcon = (type) => svg(EXTRAS[type] || '');
export const ingredientIcon = (id) => svg(INGREDIENTS[id] || '');
export const modeIcon = (id) => svg(MODES[id] || '');
