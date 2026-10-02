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
    `<rect x="3" y="37" width="42" height="6" rx="3" fill="#616b7c" ${sw()}/>` +
    `<circle cx="10" cy="45.5" r="2.2" fill="#c9d4df" ${sw(1.8)}/><circle cx="24" cy="45.5" r="2.2" fill="#c9d4df" ${sw(1.8)}/><circle cx="38" cy="45.5" r="2.2" fill="#c9d4df" ${sw(1.8)}/>` +
    `<path d="M 30 25 L 36 21 L 35 32 L 29 36 Z" fill="#c98a3c" ${sw()}/>` +
    `<path d="M 6 25 L 31 25 L 30 36 L 7 36 Z" fill="#eeb25a" ${sw()}/>` +
    `<path d="M 5 26 C 4 19, 11 16, 19 16 C 27 16, 37 16, 37 22 C 36 27, 12 29, 5 26 Z" fill="#ffa3d1" ${sw()}/>` +
    `<circle cx="14" cy="31" r="1.6" fill="${INK}"/><circle cx="22" cy="31" r="1.6" fill="${INK}"/>` +
    // glaze nozzle: grey with ink outline, dripping an outlined pink drop so it reads on any background
    `<rect x="16" y="2" width="12" height="6" rx="2" fill="#b8c4d0" ${sw(2)}/>` +
    `<path d="M 19.5 8 h 5 v 2.5 h -5 Z" fill="#9fb0c0" ${sw(1.8)}/>` +
    `<path d="M 22 11.5 C 24.5 14, 24.5 15.5, 22 15.5 C 19.5 15.5, 19.5 14, 22 11.5 Z" fill="#ffa3d1" ${sw(1.6)}/>`,
  // mixing bowl with a whisk
  free:
    `<path d="M 30 4 L 22 26" stroke="#c98a4b" stroke-width="5" stroke-linecap="round"/>` +
    `<path d="M 22 26 C 14 22, 16 14, 24 18 C 32 22, 28 30, 22 26 Z" fill="none" stroke="#b8c4d0" stroke-width="2.5"/>` +
    `<ellipse cx="24" cy="26" rx="19" ry="5" fill="#fbe6a6" ${sw()}/>` +
    `<path d="M 5 26 A 19 5 0 0 0 43 26 Q 42 44 24 44 Q 6 44 5 26 Z" fill="#8ecae6" ${sw()}/>` +
    `<path d="M 9 33 Q 24 38 39 33" stroke="#fff" stroke-width="2.5" fill="none" opacity=".7"/>` +
    `<circle cx="19" cy="37" r="1.6" fill="${INK}"/><circle cx="29" cy="37" r="1.6" fill="${INK}"/>`,
};

// Small interface glyphs (24x24) for buttons: replaces emoji and Unicode symbols.
const UI = {
  sound:
    `<path d="M 3 9 h 4 l 5 -4.5 v 15 l -5 -4.5 h -4 Z" fill="${INK}" ${sw(2)}/>` +
    `<path d="M 15.5 8.5 Q 18 12 15.5 15.5 M 18.5 5.5 Q 23.5 12 18.5 18.5" fill="none" ${sw(2.2)}/>`,
  mute:
    `<path d="M 3 9 h 4 l 5 -4.5 v 15 l -5 -4.5 h -4 Z" fill="${INK}" ${sw(2)}/>` +
    `<path d="M 15.5 9 l 6 6 M 21.5 9 l -6 6" fill="none" ${sw(2.4)}/>`,
  home:
    `<path d="M 5 11 V 20.5 H 19 V 11" fill="#ffd1e3" ${sw(2.2)}/>` +
    `<path d="M 2.5 12 L 12 3.5 L 21.5 12" fill="none" ${sw(2.4)}/>` +
    `<path d="M 10 20.5 V 15 H 14 V 20.5" fill="#fff" ${sw(2)}/>`,
  ffwd: `<path d="M 3 5.5 L 11.5 12 L 3 18.5 Z M 12 5.5 L 20.5 12 L 12 18.5 Z" fill="${INK}" ${sw(1.6)}/>`,
  play: `<path d="M 7 4.5 L 19.5 12 L 7 19.5 Z" fill="${INK}" ${sw(1.6)}/>`,
  next: `<path d="M 9 5 L 16 12 L 9 19" fill="none" ${sw(3)}/>`,
  back: `<path d="M 15 5 L 8 12 L 15 19" fill="none" ${sw(3)}/>`,
  spoon:
    `<path d="M 14 10 L 21 21" ${sw(4.5)}/><path d="M 14 10 L 21 21" stroke="#d4955a" stroke-width="2" stroke-linecap="round"/>` +
    `<ellipse cx="9.5" cy="6.5" rx="5" ry="3.6" transform="rotate(45 9.5 6.5)" fill="#d4955a" ${sw(2)}/>`,
  thermo:
    `<path d="M 9.5 14.5 V 4.5 a 2.5 2.5 0 0 1 5 0 V 14.5" fill="#fff" ${sw(2)}/>` +
    `<circle cx="12" cy="17.5" r="4" fill="#ff5d5d" ${sw(2)}/><path d="M 12 16 V 8" stroke="#ff5d5d" stroke-width="2.4" stroke-linecap="round"/>`,
  camera:
    `<path d="M 8 6 L 9.5 3.5 H 14.5 L 16 6" fill="#ffd1e3" ${sw(2)}/>` +
    `<rect x="2.5" y="6" width="19" height="14" rx="3" fill="#8ecae6" ${sw(2)}/>` +
    `<circle cx="12" cy="13" r="4" fill="#fff" ${sw(2)}/><circle cx="12" cy="13" r="1.5" fill="${INK}"/>`,
  again:
    `<path d="M 19.5 12 A 7.5 7.5 0 1 1 17.3 6.7" fill="none" ${sw(2.6)}/>` +
    `<path d="M 19.5 3.5 V 8 H 15" fill="none" ${sw(2.6)}/>`,
  knife:
    `<path d="M 3 18 L 15 6 C 18 4, 21 5, 20 8 L 8 20 Z" fill="#dfe6ee" ${sw(2)}/>` +
    `<path d="M 3 18 L 6.5 21.5 L 9.5 18.5 L 6 15 Z" fill="#c98a4b" ${sw(2)}/>`,
  dice:
    `<rect x="3.5" y="3.5" width="17" height="17" rx="4" fill="#fff" ${sw(2.2)}/>` +
    `<circle cx="8.5" cy="8.5" r="1.6" fill="${INK}"/><circle cx="15.5" cy="15.5" r="1.6" fill="${INK}"/><circle cx="12" cy="12" r="1.6" fill="${INK}"/>`,
  flame: `<path d="M 12 2.5 C 17 8, 19 12, 17.5 16 C 16 20, 8 20, 6.5 16 C 5.5 13, 7.5 10, 9 8.5 C 9 11, 10.5 12, 11.5 12 C 10.5 8.5, 11 5.5, 12 2.5 Z" fill="#ffb703" ${sw(2)}/>`,
  star: `<path d="M 12 2.5 L 14.8 8.6 L 21.5 9.3 L 16.5 13.8 L 17.9 20.5 L 12 17.1 L 6.1 20.5 L 7.5 13.8 L 2.5 9.3 L 9.2 8.6 Z" fill="#ffd23f" ${sw(1.8)}/>`,
  starOff: `<path d="M 12 2.5 L 14.8 8.6 L 21.5 9.3 L 16.5 13.8 L 17.9 20.5 L 12 17.1 L 6.1 20.5 L 7.5 13.8 L 2.5 9.3 L 9.2 8.6 Z" fill="#fff" ${sw(1.8)}/>`,
  check: `<path d="M 4.5 12.5 L 10 18 L 19.5 6.5" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="M 4.5 12.5 L 10 18 L 19.5 6.5" fill="none" stroke="#3bceac" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
  heart: `<path d="M 12 20.5 C 4 15, 2 11, 3.5 7.5 C 5 4, 9.5 4, 12 7.5 C 14.5 4, 19 4, 20.5 7.5 C 22 11, 20 15, 12 20.5 Z" fill="#ff5d8f" ${sw(2)}/>`,
};

export const uiIcon = (name) => `<svg class="ui" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${UI[name] || ''}</svg>`;

export const extraIcon = (type) => svg(EXTRAS[type] || '');
export const ingredientIcon = (id) => svg(INGREDIENTS[id] || '');
export const modeIcon = (id) => svg(MODES[id] || '');
