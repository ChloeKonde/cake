// Every option here is curated to look good with every other option:
// that is the "you can't make a bad cake" guarantee.

export const FILLINGS = {
  apple: {
    raw: '#fbe6a6', crust: '#eeb25a', top: '#d98c3c', crumb: '#f8de94', out: '#5a3418',
    chunks: ['#fff3bf', '#cfe58a', '#f5d36b'], accent: '#7cc243',
  },
  citrus: {
    raw: '#fff0a8', crust: '#f2b452', top: '#dc8a2e', crumb: '#ffe28c', out: '#5a3418',
    chunks: ['#ff9f1c', '#ffd60a', '#ffb703'], accent: '#ff9f1c',
  },
  chocolate: {
    raw: '#b98468', crust: '#7c4b2f', top: '#5f3621', crumb: '#8d5938', out: '#2e160a',
    chunks: ['#2f170b', '#4b2614', '#3a1d0e'], accent: '#5a2e1a',
  },
  plum: {
    raw: '#f8dfae', crust: '#eaa955', top: '#cc7e36', crumb: '#f5d699', out: '#5a3418',
    chunks: ['#7b2d8b', '#a54db0', '#5e1f6e'], accent: '#8e3fa0',
  },
};
export const FILLING_IDS = Object.keys(FILLINGS);

export const GLAZES = {
  none: null,
  vanilla: '#fffaf0',
  pink: '#ffa3d1',
  lemon: '#fff38a',
  mint: '#a9f2d5',
  choco: '#5a2f1c',
  rainbow: 'url',
  galaxy: 'url',
};
export const GLAZE_SWATCH = {
  none: 'transparent', vanilla: '#fffaf0', pink: '#ffa3d1', lemon: '#fff38a', mint: '#a9f2d5', choco: '#5a2f1c',
  rainbow: 'linear-gradient(90deg,#ff7aa8,#ffd166,#7be0ad,#74b9ff,#c49bff)',
  galaxy: 'radial-gradient(circle at 35% 35%,#8a6bff,#2b1b5e 70%)',
};

export const SPRINKLES = ['none', 'rainbow', 'choco', 'stars', 'hearts', 'powder', 'gold'];
export const TOPPINGS = ['cherry', 'strawberry', 'orange', 'lemon', 'apple', 'plum', 'chocolate', 'marshmallow', 'mint', 'cookie'];
export const MAX_TOPPINGS = 7;
export const EXTRAS = ['wings', 'crown', 'halo', 'rainbow', 'candles', 'glasses'];
export const EXTRA_ICONS = { wings: '🪽', crown: '👑', halo: '😇', rainbow: '🌈', candles: '🕯️', glasses: '🕶️' };
export const EYES = ['big', 'sparkle', 'happy', 'hearts'];
export const MOUTHS = ['smile', 'grin', 'cat', 'tongue'];

// Toppings that suit each filling; "Surprise!" draws mostly from these.
export const PAIRINGS = {
  apple: ['apple', 'cherry', 'cookie', 'mint', 'marshmallow'],
  citrus: ['orange', 'lemon', 'mint', 'strawberry', 'cookie'],
  chocolate: ['chocolate', 'strawberry', 'cherry', 'marshmallow', 'cookie'],
  plum: ['plum', 'cherry', 'mint', 'chocolate', 'cookie'],
};

export const INGREDIENTS = [
  { id: 'flour', icon: '🌾', color: '#fffaf0' },
  { id: 'eggs', icon: '🥚', color: '#ffd23f' },
  { id: 'butter', icon: '🧈', color: '#ffe680' },
  { id: 'sugar', icon: '🍬', color: '#ffffff' },
  { id: 'filling', icon: null, color: null },
];
