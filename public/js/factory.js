// "Кексовая фабрика": a conveyor-belt order game in the spirit of Purble Place's Comfy Cakes.
//
// The belt moves in discrete steps of one slot (PITCH px); every slot is a station, so after
// each step every cake on the belt sits exactly under a machine. The belt then dwells until
// each cake under an active machine has been served (or the level's dwell time runs out).
// A cake that doesn't match its order is still adored by the customer: there is no fail state,
// you only miss the "perfect" pip.

import { t } from './i18n.js';
import { FILLINGS, FILLING_IDS, GLAZES, GLAZE_SWATCH } from './data.js';
import { extraIcon, uiIcon } from './icons.js';
import { cakeSVG, toppingIcon, fillingIcon } from './cake.js';
import { catSVG } from './scenes.js';
import { sfx, confetti, sparkleAt } from './fx.js';
import { rng, pick, star, $, $$ } from './util.js';

const W = 960, H = 540;
const PITCH = 135;
const SLOT_X = [90, 225, 360, 495, 630, 765, 900];
const OVEN = 1, BOX = 6;
const STATIONS = [
  { id: 'dough', slot: 0, opts: FILLING_IDS, color: '#ffe0a3' },
  { id: 'oven', slot: 1, color: '#ff9ec4' },
  { id: 'glaze', slot: 2, opts: ['vanilla', 'pink', 'choco', 'lemon'], color: '#ffc2dc' },
  { id: 'sprinkles', slot: 3, opts: ['rainbow', 'choco', 'stars', 'powder'], color: '#c9f2ff' },
  { id: 'toppings', slot: 4, opts: ['cherry', 'strawberry', 'orange', 'mint'], color: '#d4f7d0' },
  { id: 'magic', slot: 5, opts: ['crown', 'wings', 'halo', 'candles'], color: '#e3d4ff' },
];
const TICKET = ['#ff5d8f', '#5d9cec', '#3bceac', '#ffb703', '#b07cff'];
const FURS = [['#ffb35c', '#e08a2e'], ['#9aa5b1', '#6b7785'], ['#f4f1ea', '#d9cbb5'], ['#4a4a58', '#2e2e38'], ['#f7c59f', '#d9935f'], ['#c8a2ff', '#9a6be0']];
const BEST_KEY = 'cake-factory-best';

const params = (L) => ({
  stations: ['dough', 'oven', 'glaze', ...(L >= 2 ? ['sprinkles'] : []), ...(L >= 3 ? ['toppings'] : []), ...(L >= 4 ? ['magic'] : [])],
  count: Math.min(4 + L, 10),
  gap: L <= 3 ? 7 : L === 4 ? 4 : L <= 6 ? 3 : 2,
  dwell: Math.max(900, 2600 - (L - 1) * 200),
  move: Math.max(420, 850 - (L - 1) * 50),
});

const ease = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);

let F = null;
let env = null;
let els = new Map();
let resizeBound = false;

export function bestLevel() {
  try { return Math.max(1, parseInt(localStorage.getItem(BEST_KEY), 10) || 1); } catch { return 1; }
}

export function newFactory(level = 1) {
  F = {
    level, cakes: [], orders: [], results: [],
    spawned: 0, delivered: 0, matched: 0,
    phase: 'dwell', t: 0, cycle: 0, ff: false,
    over: 'intro', nextId: 1,
  };
}

// ---------- orders & matching ----------

function makeOrder() {
  const st = params(F.level).stations;
  const r = Math.random;
  const opt = (id) => STATIONS.find((s) => s.id === id).opts;
  const top = pick(r, opt('toppings'));
  const cfg = {
    filling: pick(r, FILLING_IDS),
    glaze: pick(r, opt('glaze')),
    sprinkles: st.includes('sprinkles') ? pick(r, opt('sprinkles')) : 'none',
    toppings: st.includes('toppings') ? [top, top, top] : [],
    extras: st.includes('magic') ? [pick(r, opt('magic'))] : [],
    eyes: 'big', mouth: 'smile',
    seed: (r() * 2 ** 31) | 0,
  };
  const id = F.nextId++;
  F.orders.push({ id, cfg, status: 'open', fur: pick(r, FURS) });
  return id;
}

function matches(order, cake) {
  return order.filling === cake.filling &&
    order.glaze === cake.glaze &&
    order.sprinkles === cake.sprinkles &&
    (order.toppings[0] || null) === (cake.toppings[0] || null) &&
    (order.extras[0] || null) === (cake.extras[0] || null);
}

function spawn() {
  const orderId = makeOrder();
  const order = F.orders.find((o) => o.id === orderId);
  F.cakes.push({
    id: orderId, orderId, slot: -1, baked: false, done: new Set(), dirty: true,
    cfg: { filling: null, glaze: 'none', sprinkles: 'none', toppings: [], extras: [], eyes: 'big', mouth: 'smile', seed: order.cfg.seed },
  });
  F.spawned++;
  renderOrders();
}

// ---------- belt loop ----------

const cakeX = (c, off) => SLOT_X[0] + (c.slot + off) * PITCH;
const stationAt = (slot) => STATIONS.find((s) => s.slot === slot);
const moveOffset = (p) => (F.phase === 'move' ? ease(Math.min(1, F.t / p.move)) : 0);

function dwellNeeded(p) {
  let need = 0;
  for (const c of F.cakes) {
    if (c.slot === BOX) { need = Math.max(need, 950); continue; }
    const st = stationAt(c.slot);
    if (!st || !p.stations.includes(st.id)) continue;
    if (st.id === 'oven') need = Math.max(need, 600);
    else need = Math.max(need, c.done.has(st.id) ? 380 : p.dwell);
  }
  return need || 220;
}

function startMove(p) {
  F.cakes = F.cakes.filter((c) => !c.gone);
  if (F.spawned < p.count && F.cycle % p.gap === 0) spawn();
  if (!F.cakes.length) return; // level wrapping up; deliver() finishes it
  F.phase = 'move';
  F.t = 0;
  F.cycle++;
}

function arrive() {
  for (const c of F.cakes) {
    if (c.slot === OVEN && !c.baked) {
      if (!c.cfg.filling) {
        // Empty pan reached the oven? The oven pours something delicious itself.
        c.cfg.filling = pick(Math.random, FILLING_IDS);
        env.say('fAutoDough');
      }
      c.baked = true;
      c.dirty = true;
    }
    if (c.slot === BOX && !c.boxing) deliver(c);
  }
}

function tick(dt) {
  if (F.over) return;
  const p = params(F.level);
  F.t += dt;
  if (F.phase === 'move') {
    if (F.t >= p.move) {
      F.cakes.forEach((c) => c.slot++);
      F.phase = 'dwell';
      F.t = 0;
      F.ff = false;
      arrive();
    }
  } else if (F.ff || F.t >= dwellNeeded(p)) {
    F.ff = false;
    startMove(p);
  }
  draw(p);
}

function deliver(c) {
  c.boxing = true;
  const open = F.orders.filter((o) => o.status === 'open');
  const own = open.find((o) => o.id === c.orderId);
  // Forgiving: if the cake exactly matches some other open order, it goes to that customer.
  const target = (own && matches(own.cfg, c.cfg) ? own : open.find((o) => matches(o.cfg, c.cfg))) || own || open[0];
  const ok = !!target && matches(target.cfg, c.cfg);
  if (target) target.status = ok ? 'ok' : 'love';
  F.results.push(ok ? 'ok' : 'love');
  F.delivered++;
  if (ok) F.matched++;

  c.cfg.eyes = ok ? 'hearts' : 'happy';
  c.cfg.mouth = 'grin';
  c.dirty = true;
  if (ok) sfx.magic(); else sfx.pop();
  env.say(ok ? 'fMatch' : 'fLove');
  renderOrders();
  renderHud();
  const card = target && $(`[data-order="${target.id}"]`);
  if (card && ok) sparkleAt(card, 24);

  setTimeout(() => {
    const el = els.get(c.id);
    if (el) el.classList.add('boxing');
    const box = $('#fbox');
    if (box) { box.classList.add('close'); setTimeout(() => box.classList.remove('close'), 700); }
  }, 280);
  setTimeout(() => { c.gone = true; }, 820);
  setTimeout(() => {
    if (!F || !target) return;
    F.orders = F.orders.filter((o) => o !== target);
    renderOrders();
    if (F.delivered >= params(F.level).count) levelDone();
  }, 1400);
}

function levelDone() {
  if (F.over) return;
  F.over = 'done';
  try { if (F.level + 1 > bestLevel()) localStorage.setItem(BEST_KEY, String(F.level + 1)); } catch {}
  sfx.fanfare();
  confetti(160);
  env.say('fDone');
  renderOverlay();
}

// ---------- input ----------

function press(stId, v, btn) {
  if (!F || F.over) return;
  const p = params(F.level);
  const off = moveOffset(p);
  const sx = SLOT_X[STATIONS.find((s) => s.id === stId).slot];
  const c = F.cakes.find((k) => !k.boxing && Math.abs(cakeX(k, off) - sx) < 50);
  if (!c || (stId === 'dough') === c.baked) {
    btn.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], { duration: 220 });
    sfx.click();
    return;
  }
  const cfg = c.cfg;
  if (stId === 'dough') cfg.filling = v;
  else if (stId === 'glaze') cfg.glaze = v;
  else if (stId === 'sprinkles') cfg.sprinkles = v;
  else if (stId === 'toppings') cfg.toppings = [v, v, v];
  else if (stId === 'magic') cfg.extras = [v];
  c.done.add(stId);
  c.dirty = true;
  pour(stId, v);
  sfx.plop();
}

function pour(stId, v) {
  const s = $(`#stream-${stId}`);
  if (!s) return;
  // The stream takes the colour of the chosen option, matching its button.
  const stripes = (...c) => `repeating-linear-gradient(180deg,${c.map((col, i) => `${col} ${i * 6}px ${(i + 1) * 6}px`).join(',')})`;
  const colors = {
    dough: { [v]: FILLINGS[v]?.raw },
    glaze: { [v]: GLAZES[v] },
    sprinkles: {
      rainbow: stripes('#ff5d8f', '#ffd23f', '#3bceac', '#5d9cec'),
      choco: stripes('#4a2511', '#6b3a1e', '#2e1608'),
      stars: stripes('#ffd23f', '#ffe98a'),
      powder: stripes('#ffffff', '#f3ece2'),
    },
    toppings: { cherry: '#e5243b', strawberry: '#ff4d6d', orange: '#ff9f1c', mint: '#58c46b' },
    magic: {
      crown: 'linear-gradient(#ffe98a,#ffb703)',
      wings: 'linear-gradient(#ffffff,#bcd5f0)',
      halo: 'linear-gradient(#fff7c2,#ffd23f)',
      candles: stripes('#ff8fb8', '#7be0ad', '#74b9ff'),
    },
  };
  s.style.background = colors[stId]?.[v] || '#fff';
  s.classList.remove('pour');
  void s.offsetWidth;
  s.classList.add('pour');
}

// ---------- rendering ----------

const SPR = { rainbow: ['#ff5d8f', '#ffd23f', '#3bceac', '#5d9cec', '#b07cff'], choco: ['#4a2511', '#6b3a1e', '#2e1608'] };

function sprBadge(v) {
  const r = rng(11);
  let s = `<svg viewBox="-20 -20 40 40" aria-hidden="true"><circle r="17" fill="${v === 'powder' ? '#d98c3c' : '#fff4e0'}"/>`;
  const n = v === 'powder' ? 22 : v === 'stars' ? 6 : 10;
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 12;
    const x = (Math.cos(a) * d).toFixed(1), y = (Math.sin(a) * d).toFixed(1);
    if (v === 'stars') s += `<path d="${star(+x, +y, 5, 2.2)}" fill="#ffd23f" stroke="#c98a00" stroke-width=".8"/>`;
    else if (v === 'powder') s += `<circle cx="${x}" cy="${y}" r="${(1 + r() * 1.3).toFixed(1)}" fill="#fff"/>`;
    else s += `<rect x="${x - 3}" y="${y - 1.2}" width="6" height="2.4" rx="1.2" fill="${pick(r, SPR[v])}" transform="rotate(${Math.round(r() * 180)} ${x} ${y})"/>`;
  }
  return s + `</svg>`;
}

function badge(stId, v) {
  switch (stId) {
    case 'dough': return fillingIcon(v);
    case 'glaze': return `<i class="dot" style="background:${GLAZE_SWATCH[v]}"></i>`;
    case 'sprinkles': return sprBadge(v);
    case 'toppings': return toppingIcon(v);
    case 'magic': return extraIcon(v);
  }
  return '';
}

const LABEL_KEY = { dough: 'filling.', glaze: 'glaze.', sprinkles: 'spr.', toppings: 'top.', magic: 'x.' };

function machineHTML(st, p) {
  const x = SLOT_X[st.slot];
  const on = p.stations.includes(st.id);
  const head = `<div class="mlabel">${t('f.st.' + st.id)}</div><div class="mface"><i></i><i></i></div>`;
  if (st.id === 'oven') {
    return `<div class="machine m-oven" style="left:${x - 60}px;--mc:${st.color}">${head}` +
      `<div class="dial">180°</div><div class="chimney"><i></i><i></i><i></i></div></div>`;
  }
  return `<div class="machine ${on ? '' : 'off'}" style="left:${x - 60}px;--mc:${st.color}">${head}` +
    `<div class="mbtns">` + st.opts.map((v) =>
      `<button class="mbtn" data-st="${st.id}" data-v="${v}" ${on ? '' : 'disabled'} title="${t(LABEL_KEY[st.id] + v)}" aria-label="${t(LABEL_KEY[st.id] + v)}">${badge(st.id, v)}</button>`).join('') +
    `</div>` + (on ? '' : `<div class="zzz">Zzz</div>`) +
    `<div class="nozzle"><div class="stream" id="stream-${st.id}"></div></div></div>`;
}

function chips(cfg) {
  const st = params(F.level).stations;
  let h = `<i class="chip">${fillingIcon(cfg.filling)}</i><i class="chip">${badge('glaze', cfg.glaze)}</i>`;
  if (st.includes('sprinkles')) h += `<i class="chip">${sprBadge(cfg.sprinkles)}</i>`;
  if (st.includes('toppings')) h += `<i class="chip">${toppingIcon(cfg.toppings[0])}</i>`;
  if (st.includes('magic')) h += `<i class="chip">${badge('magic', cfg.extras[0])}</i>`;
  return h;
}

function renderOrders() {
  const box = $('#orders');
  if (!box) return;
  box.innerHTML = F.orders.map((o) =>
    `<div class="order ${o.status}" data-order="${o.id}">` +
    `<div class="band" style="background:${TICKET[o.id % TICKET.length]}"></div>` +
    `<div class="cust">${catSVG(o.fur[0], o.fur[1])}</div>` +
    `<div class="osvg">${cakeSVG(o.cfg, { cls: 'thumb' })}</div>` +
    `<div class="chips">${chips(o.cfg)}</div>` +
    (o.status === 'open' ? '' : `<div class="mark">${uiIcon(o.status === 'ok' ? 'check' : 'heart')}</div>`) +
    `</div>`).join('');
}

function renderHud() {
  const hud = $('#hud');
  if (!hud) return;
  const p = params(F.level);
  hud.innerHTML =
    `<div class="lvl">${t('f.level')} ${F.level}</div>` +
    `<div class="pips">${Array.from({ length: p.count }, (_, i) => `<i class="${F.results[i] || ''}"></i>`).join('')}</div>` +
    `<div class="hbtns"><button class="pill" id="ffwd" title="${t('f.ffwd')}" aria-label="${t('f.ffwd')}">${uiIcon('ffwd')}</button>` +
    `<button class="pill" id="fquit" title="${t('f.menu')}" aria-label="${t('f.menu')}">${uiIcon('home')}</button></div>`;
  $('#ffwd').addEventListener('click', () => { if (F.phase === 'dwell') F.ff = true; sfx.click(); });
  $('#fquit').addEventListener('click', () => { sfx.click(); env.go('start'); });
}

function renderOverlay() {
  const ov = $('#fover');
  if (!ov) return;
  ov.hidden = !F.over;
  if (!F.over) { ov.innerHTML = ''; return; }
  const p = params(F.level);
  if (F.over === 'intro') {
    const newSt = { 2: 'sprinkles', 3: 'toppings', 4: 'magic' }[F.level];
    const text = F.level === 1 ? t('f.intro') : newSt ? `${t('f.new')}: <b>${t('f.st.' + newSt)}</b>!` : t('f.faster');
    ov.innerHTML = `<div class="fcard bounce-in"><h3>${t('f.level')} ${F.level}</h3><p>${text}</p>` +
      `<p class="small">${t('f.count')}: ${p.count}</p><button class="btn big primary" id="fgo">${t('f.start')}</button></div>`;
    $('#fgo').addEventListener('click', () => {
      sfx.pop();
      F.over = null;
      F.ff = true;
      renderOverlay();
      env.say('fLevel');
    });
  } else {
    const ratio = F.matched / p.count;
    const stars = ratio === 1 ? 3 : ratio >= 0.6 ? 2 : 1;
    ov.innerHTML = `<div class="fcard bounce-in"><h3>${t('f.complete')}</h3>` +
      `<div class="fstars">${[1, 2, 3].map((i) => `<i class="${i <= stars ? 'on' : ''}">${uiIcon(i <= stars ? 'star' : 'starOff')}</i>`).join('')}</div>` +
      `<p>${t('f.perfect')}: <b>${F.matched} / ${p.count}</b></p>` +
      (F.matched < p.count ? `<p class="small">${t('f.loveNote')}</p>` : '') +
      `<div class="row"><button class="btn ghost" id="fmenu">${t('f.menu')}</button>` +
      `<button class="btn big primary" id="fnext">${t('f.next')}</button></div></div>`;
    $('#fnext').addEventListener('click', () => { sfx.pop(); newFactory(F.level + 1); renderFactory(env); });
    $('#fmenu').addEventListener('click', () => { sfx.click(); env.go('start'); });
  }
}

function cakeMarkup(c) {
  const flag = `<i class="flag" style="background:${TICKET[c.orderId % TICKET.length]}"></i>`;
  if (!c.baked) {
    return flag + cakeSVG({ ...c.cfg, filling: c.cfg.filling || 'apple' }, { pan: true, bake: 0, rise: 0.1, empty: !c.cfg.filling });
  }
  return flag + cakeSVG(c.cfg);
}

function draw(p) {
  const off = moveOffset(p);
  const belt = $('#belt');
  if (belt) belt.style.backgroundPositionX = ((F.cycle - (F.phase === 'move' ? 1 : 0) + off) * PITCH).toFixed(1) + 'px';
  const layer = $('#fcakes');
  if (!layer) return;
  const alive = new Set();
  for (const c of F.cakes) {
    if (c.gone) continue;
    alive.add(c.id);
    let el = els.get(c.id);
    if (!el) {
      el = document.createElement('div');
      el.className = 'fcake';
      layer.append(el);
      els.set(c.id, el);
      c.dirty = true;
      if (c.boxing) el.classList.add('boxing');
    }
    if (c.dirty) { el.innerHTML = cakeMarkup(c); c.dirty = false; }
    el.style.transform = `translateX(${(cakeX(c, off) - 70).toFixed(1)}px)`;
  }
  for (const [id, el] of els) {
    if (!alive.has(id)) { el.remove(); els.delete(id); }
  }
}

function fit() {
  const wrap = $('#facfit');
  const fac = $('#factory');
  if (!wrap || !fac) return;
  const s = Math.min(1.35, wrap.clientWidth / W);
  fac.style.transform = `scale(${s})`;
  wrap.style.height = (H * s).toFixed(1) + 'px';
}

/** env: { scene, say, loop, go } supplied by main.js */
export function renderFactory(e, entering = false) {
  env = e;
  if (!F) newFactory(1);
  const p = params(F.level);
  els = new Map();
  F.cakes.forEach((c) => { c.dirty = true; });

  e.scene.innerHTML =
    `<p class="rotate-hint">${t('f.rotate')}</p>` +
    `<div class="fac-fit" id="facfit"><div class="factory" id="factory">` +
    `<div class="orders" id="orders"></div><div class="hud" id="hud"></div>` +
    STATIONS.map((st) => machineHTML(st, p)).join('') +
    `<div class="belt" id="belt"></div><div class="rollers">${'<i></i>'.repeat(12)}</div>` +
    `<div class="fcakes" id="fcakes"></div>` +
    `<div class="oven-front" style="left:${SLOT_X[OVEN] - 78}px"><div class="ow"></div></div>` +
    `<div class="fbox" id="fbox" style="left:${SLOT_X[BOX] - 58}px"><div class="lid"></div><div class="front"></div></div>` +
    `<div class="fover" id="fover" hidden></div>` +
    `</div></div>`;

  fit();
  if (!resizeBound) { addEventListener('resize', fit); resizeBound = true; }

  $$('.mbtn', e.scene).forEach((b) => b.addEventListener('click', () => press(b.dataset.st, b.dataset.v, b)));
  renderOrders();
  renderHud();
  renderOverlay();
  draw(p);
  e.loop(tick);
  if (entering) e.say('fWelcome');
}

// Space = fast-forward the belt.
addEventListener('keydown', (ev) => {
  if (ev.code !== 'Space' || !F || F.over || document.body.dataset.step !== 'factory') return;
  if (ev.target.closest && ev.target.closest('button')) return;
  ev.preventDefault();
  if (F.phase === 'dwell') F.ff = true;
});
