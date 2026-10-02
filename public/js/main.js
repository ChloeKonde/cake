import { t, chefLines, nameParts, getLang, setLang } from './i18n.js';
import {
  FILLING_IDS, GLAZE_SWATCH, SPRINKLES, TOPPINGS, MAX_TOPPINGS, EXTRAS,
  EYES, MOUTHS, PAIRINGS, INGREDIENTS, GLAZES,
} from './data.js';
import { cakeSVG, sliceSVG, toppingIcon, eyesIcon, mouthIcon, sprinkleIcon, fillingIcon } from './cake.js';
import { bowlSVG, Bowl, ovenSVG, CHEF_SVG } from './scenes.js';
import { sfx, confetti, sparkleAt, isMuted, setMuted } from './fx.js';
import { renderFactory, newFactory, bestLevel } from './factory.js';
import { extraIcon, ingredientIcon, modeIcon } from './icons.js';
import { rng, pick, clamp, $, $$ } from './util.js';

const STEPS = ['filling', 'mix', 'bake', 'decorate', 'reveal'];
const BAKE_MS = 7000;
const TEMPS = [160, 180, 200, 230, '∞'];
const SHELF_KEY = 'cake-shelf';

const newCake = () => ({
  filling: null, glaze: 'none', sprinkles: 'none', toppings: [], eyes: 'big', mouth: 'smile', extras: [],
  seed: (Math.random() * 2 ** 31) | 0,
});
const freshMix = () => ({ counts: { flour: 0, eggs: 0, butter: 0, sugar: 0, filling: 0 }, lumps: [], stir: 0, theta: 0, done: false });
const freshBake = () => ({ p: 0, running: false, done: false, temp: 1 });

const S = {
  step: 'start',
  cake: newCake(),
  mix: freshMix(),
  bake: freshBake(),
  tab: 'glaze',
  cut: false,
  fromShelf: false,
  stirring: false,
  loop: 0,
  lastSay: 'welcome',
  demo: null,
};

const scene = $('#scene');
const panel = $('#panel');

// ---------- helpers ----------

function say(key) {
  S.lastSay = key;
  const b = $('#bubble');
  $('.btext', b).textContent = pick(Math.random, chefLines(key));
  b.hidden = false;
  b.classList.remove('pop');
  void b.offsetWidth;
  b.classList.add('pop');
}

function stopLoop() {
  cancelAnimationFrame(S.loop);
  S.loop = 0;
}

function loop(fn) {
  stopLoop();
  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(64, now - last);
    last = now;
    fn(dt);
    S.loop = requestAnimationFrame(tick);
  };
  S.loop = requestAnimationFrame(tick);
}

function go(step) {
  stopLoop();
  S.stirring = false;
  S.step = step;
  render(true);
  if (innerWidth < 900) scrollTo({ top: 0, behavior: 'smooth' });
}

const nav = (back, next, nextLabel = t('next'), nextOn = true) =>
  `<div class="nav">` +
  (back ? `<button class="btn ghost" data-go="${back}">${t('back')}</button>` : '<span></span>') +
  (next ? `<button class="btn primary" id="next" data-go="${next}" ${nextOn ? '' : 'disabled'}>${nextLabel}</button>` : '') +
  `</div>`;

function bindNav() {
  $$('[data-go]', panel).forEach((b) => b.addEventListener('click', () => { sfx.click(); go(b.dataset.go); }));
}

function cakeName(c) {
  const r = rng(c.seed);
  const n = nameParts();
  return `${pick(r, n.adj)} ${pick(r, n.noun)} ${n.filling[c.filling]}`;
}

function cakeScore(c) {
  return pick(rng(c.seed + 3), ['11', '12', '15', '100', '∞']);
}

// ---------- shelf (localStorage) ----------

function loadShelf() {
  try {
    const list = JSON.parse(localStorage.getItem(SHELF_KEY) || '[]');
    return Array.isArray(list) ? list.filter((c) => c && FILLING_IDS.includes(c.filling)) : [];
  } catch {
    return [];
  }
}

function saveToShelf(c) {
  const list = loadShelf().filter((x) => x.seed !== c.seed);
  list.unshift(JSON.parse(JSON.stringify(c)));
  try { localStorage.setItem(SHELF_KEY, JSON.stringify(list.slice(0, 12))); } catch {}
}

function shelfHTML() {
  const list = loadShelf();
  if (!list.length) return '';
  return `<div class="shelf"><h3>${t('reveal.shelf')}</h3><div class="shelf-row">` +
    list.map((c, i) => `<button class="shelf-item" data-shelf="${i}" title="${cakeName(c)}">${cakeSVG(c, { cls: 'thumb' })}</button>`).join('') +
    `</div></div>`;
}

function bindShelf() {
  const list = loadShelf();
  $$('[data-shelf]', panel).forEach((b) => b.addEventListener('click', () => {
    S.cake = { ...newCake(), ...list[+b.dataset.shelf] };
    S.fromShelf = true;
    S.cut = false;
    sfx.pop();
    go('reveal');
  }));
}

// ---------- header ----------

function renderHeader() {
  const idx = STEPS.indexOf(S.step);
  $('#steps').innerHTML = t('steps').map((label, i) =>
    `<li class="${i < idx ? 'done' : i === idx ? 'now' : ''}"><span>${i + 1}</span><em>${label}</em></li>`).join('');
  $('#steps').hidden = idx < 0;
  $('#lang').textContent = getLang() === 'ru' ? 'EN' : 'RU';
  $('#snd').textContent = isMuted() ? '🔇' : '🔊';
  $('#snd').setAttribute('aria-label', t('sound'));
  document.title = t('title');
  $('#home b').textContent = t('title');
}

// ---------- steps ----------

function renderStart() {
  if (!S.demo) {
    S.demo = {
      ...newCake(), filling: pick(Math.random, FILLING_IDS), glaze: 'pink', sprinkles: 'rainbow',
      toppings: ['cherry', 'strawberry', 'cherry', 'strawberry', 'cherry'], extras: ['wings', 'crown'], eyes: 'sparkle', mouth: 'grin',
    };
  }
  scene.innerHTML = `<div class="hero float">${cakeSVG(S.demo)}</div>`;
  panel.innerHTML =
    `<h1 class="logo-big">${t('title')}</h1><p class="sub">${t('subtitle')}</p>` +
    `<div class="modes">` +
    `<button class="mode primary" id="mFactory"><span class="micon">${modeIcon('factory')}</span><span><b>${t('mode.factory')}</b><small>${t('mode.factory.tag')}</small></span></button>` +
    (bestLevel() > 1 ? `<button class="btn small ghost" id="mCont">▶ ${t('f.continue')} ${bestLevel()}</button>` : '') +
    `<button class="mode" id="start"><span class="micon">${modeIcon('free')}</span><span><b>${t('mode.free')}</b><small>${t('mode.free.tag')}</small></span></button>` +
    `</div>` + shelfHTML();
  $('#mFactory').addEventListener('click', () => { sfx.pop(); newFactory(1); go('factory'); });
  const cont = $('#mCont');
  if (cont) cont.addEventListener('click', () => { sfx.pop(); newFactory(bestLevel()); go('factory'); });
  $('#start').addEventListener('click', () => {
    sfx.pop();
    S.cake = newCake();
    S.mix = freshMix();
    S.bake = freshBake();
    S.cut = false;
    S.fromShelf = false;
    say('filling');
    go('filling');
  });
  bindShelf();
}

function renderFilling(entering) {
  const c = S.cake;
  if (c.filling) {
    scene.innerHTML = `<div class="hero bounce-in" id="preview">${cakeSVG({ ...c, eyes: 'sparkle', mouth: 'grin' })}</div>`;
  } else {
    scene.innerHTML = `<div class="mini-grid">` + FILLING_IDS.map((f) =>
      `<button class="mini" data-fill="${f}" aria-label="${t('filling.' + f)}">${cakeSVG({ ...c, filling: f })}</button>`).join('') + `</div>`;
  }
  panel.innerHTML = `<h2>${t('filling.title')}</h2><div class="cards">` +
    FILLING_IDS.map((f) =>
      `<button class="card ${c.filling === f ? 'on' : ''}" data-fill="${f}">${fillingIcon(f)}` +
      `<span><b>${t('filling.' + f)}</b><small>${t('filling.' + f + '.tag')}</small></span></button>`).join('') +
    `</div>` + nav('start', 'mix', t('next'), !!c.filling);
  $$('[data-fill]').forEach((b) => b.addEventListener('click', () => {
    if (c.filling !== b.dataset.fill) {
      // A new filling means the old batter no longer matches.
      S.mix = freshMix();
      S.bake = freshBake();
    }
    c.filling = b.dataset.fill;
    sfx.pop();
    say('pick.' + c.filling);
    renderFilling();
  }));
  bindNav();
  if (entering && !c.filling) say('filling');
}

// --- mix ---

function renderMix(entering) {
  const m = S.mix;
  scene.innerHTML = bowlSVG();
  const svg = $('#bowl');
  const bowl = new Bowl(svg, S.cake.filling);
  bowl.sync(m);

  const ingIcon = (ing) => (ing.id === 'filling' ? fillingIcon(S.cake.filling) : ingredientIcon(ing.id));
  panel.innerHTML =
    `<h2>${t('mix.title')}</h2><p class="hint">${t('mix.hint')}</p>` +
    `<div class="ings">` + INGREDIENTS.map((ing) =>
      `<button class="ing" data-ing="${ing.id}">${ingIcon(ing)}<span>${t('ing.' + ing.id)}</span>` +
      `<i class="badge" ${m.counts[ing.id] ? '' : 'hidden'}>${m.counts[ing.id]}</i></button>`).join('') + `</div>` +
    `<button class="btn big stir" id="stir">🥄 ${t('mix.stir')}</button>` +
    `<div class="meter"><label>${t('mix.progress')}</label><div class="bar"><i id="mixbar"></i></div></div>` +
    nav('filling', 'bake', t('next'), m.done);

  const drop = (id, btn) => {
    const ing = INGREDIENTS.find((i) => i.id === id);
    fly(btn, ingIcon(ing), () => {
      if (S.step !== 'mix') return;
      if (m.lumps.length < 28) m.lumps.push({ ing: id, r: Math.sqrt(Math.random()), phi: Math.random() * Math.PI * 2, seed: (Math.random() * 1e9) | 0 });
      bowl.sync(m);
      bowl.yum();
      sfx.plop();
    });
  };

  const add = (id, btn, quiet) => {
    if (!btn || S.step !== 'mix') return;
    m.counts[id]++;
    const badge = $('.badge', btn);
    badge.hidden = false;
    badge.textContent = m.counts[id];
    drop(id, btn);
    if (quiet) return;
    if (m.counts[id] === 6) say('tooMuch');
    else if (Math.random() < 0.5) say('add');
  };

  // Stirring with something missing? The bowl quietly adds it. No bad batter, ever.
  const ensureIngredients = () => {
    const missing = INGREDIENTS.filter((i) => !m.counts[i.id]);
    if (!missing.length) return;
    missing.forEach((ing, k) => setTimeout(() => add(ing.id, $(`[data-ing="${ing.id}"]`), true), k * 120));
    say('autoAdd');
  };

  $$('.ing', panel).forEach((b) => b.addEventListener('click', () => { sfx.click(); add(b.dataset.ing, b); }));

  const stirBtn = $('#stir');
  const startStir = (e) => { e.preventDefault(); ensureIngredients(); S.stirring = true; stirBtn.classList.add('on'); };
  const endStir = () => { S.stirring = false; stirBtn.classList.remove('on'); };
  stirBtn.addEventListener('pointerdown', startStir);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => stirBtn.addEventListener(ev, endStir));
  stirBtn.addEventListener('keydown', (e) => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) startStir(e); });
  stirBtn.addEventListener('keyup', endStir);
  stirBtn.addEventListener('contextmenu', (e) => e.preventDefault());

  // Swirl a finger/mouse over the bowl to stir.
  let dragA = null;
  const angle = (e) => {
    const r = svg.getBoundingClientRect();
    return Math.atan2(e.clientY - (r.top + r.height * 0.55), e.clientX - (r.left + r.width / 2));
  };
  svg.addEventListener('pointerdown', (e) => { ensureIngredients(); dragA = angle(e); svg.setPointerCapture(e.pointerId); });
  svg.addEventListener('pointermove', (e) => {
    if (dragA === null) return;
    const a = angle(e);
    let d = a - dragA;
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    dragA = a;
    m.theta += d;
    advance(Math.abs(d) * 0.035);
  });
  ['pointerup', 'pointercancel'].forEach((ev) => svg.addEventListener(ev, () => { dragA = null; }));

  let lastStirSound = 0;
  function advance(amount) {
    m.stir = clamp(m.stir + amount);
    const now = performance.now();
    if (amount > 0 && now - lastStirSound > 220) { sfx.stir(); lastStirSound = now; }
    if (m.stir >= 1 && !m.done) {
      m.done = true;
      sfx.magic();
      sparkleAt(svg, 40);
      say('stirDone');
      $('#next').disabled = false;
      $('#next').classList.add('wiggle');
    }
  }

  loop((dt) => {
    if (S.stirring) {
      m.theta += dt * 0.007;
      advance(dt * 0.00045);
    }
    bowl.sync(m);
    $('#mixbar').style.width = (m.stir * 100).toFixed(1) + '%';
  });

  bindNav();
  if (entering) say('mix');
}

function fly(fromEl, html, onDone) {
  const target = $('#bowl');
  if (!fromEl || !target) return onDone();
  const a = fromEl.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const x0 = a.left + a.width / 2, y0 = a.top + a.height / 2;
  const x1 = b.left + b.width / 2, y1 = b.top + b.height * 0.5;
  const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - 110;
  const el = document.createElement('div');
  el.className = 'flyer';
  el.innerHTML = html;
  document.body.append(el);
  const tf = (x, y, s, r) => `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${s}) rotate(${r}deg)`;
  const anim = el.animate([
    { transform: tf(x0, y0, 1, 0) },
    { transform: tf(mx, my, 1.4, 200), offset: 0.5 },
    { transform: tf(x1, y1, 0.6, 400) },
  ], { duration: 650, easing: 'ease-in-out' });
  anim.onfinish = () => { el.remove(); onDone(); };
}

// --- bake ---

function renderBake(entering) {
  const b = S.bake;
  if (b.done) {
    scene.innerHTML = `<div class="board bounce-in"><div class="steam"><span></span><span></span><span></span></div>${cakeSVG(S.cake)}</div>`;
    panel.innerHTML = `<h2>${t('bake.title')}</h2><p class="hint big-hint">✨ ${pick(Math.random, chefLines('good'))}</p>` +
      nav('mix', 'decorate', t('next'), true);
    $('#next').classList.add('wiggle');
    bindNav();
    return;
  }

  scene.innerHTML = ovenSVG();
  const tempLabel = () => (TEMPS[b.temp] === '∞' ? '∞°' : TEMPS[b.temp] + '°');
  panel.innerHTML =
    `<h2>${t('bake.title')}</h2><p class="hint">${t('bake.hint')}</p>` +
    `<button class="btn knob" id="temp">🌡️ ${t('bake.temp')}: <b id="tempv">${TEMPS[b.temp] === '∞' ? t('bake.magic') : tempLabel()}</b></button>` +
    `<div class="meter"><label>${t('bake.progress')}</label><div class="bar warm"><i id="bakebar"></i></div></div>` +
    `<button class="btn big primary" id="bakebtn">${b.running ? t('bake.take') : t('bake.start')}</button>` +
    nav('mix', null);

  const box = $('#ovCake');
  let lastDraw = -1;
  const draw = () => {
    box.innerHTML = cakeSVG(S.cake, { bake: b.p, rise: b.p, pan: true });
    $('#ovGlow').setAttribute('opacity', b.running ? (0.18 + 0.12 * Math.sin(performance.now() / 300)).toFixed(2) : 0);
    $('#ovCoil').setAttribute('opacity', b.running ? 1 : 0.25);
    $('#ovPupils').setAttribute('transform', b.running ? 'translate(0 7)' : '');
    $('#ovTemp').textContent = tempLabel();
    $('#bakebar').style.width = (b.p * 100).toFixed(1) + '%';
  };
  draw();

  $('#temp').addEventListener('click', () => {
    b.temp = (b.temp + 1) % TEMPS.length;
    $('#tempv').textContent = TEMPS[b.temp] === '∞' ? t('bake.magic') : tempLabel();
    sfx.click();
    draw();
  });

  const finish = (kind) => {
    b.running = false;
    b.done = true;
    b.p = 1;
    draw();
    sfx.ding();
    say(kind);
    setTimeout(() => { if (S.step === 'bake') render(); }, 900);
  };

  let magicTo = null;
  $('#bakebtn').addEventListener('click', (e) => {
    if (!b.running) {
      b.running = true;
      e.currentTarget.textContent = t('bake.take');
      sfx.pop();
      say('bake');
      return;
    }
    if (magicTo !== null) return;
    if (b.p < 0.6) {
      // Too early? The oven fairies finish it.
      magicTo = performance.now();
      sfx.magic();
      sparkleAt($('#oven'), 50);
    } else {
      finish('good');
    }
  });

  loop((dt) => {
    if (!b.running) return;
    if (magicTo !== null) {
      b.p = clamp(b.p + dt / 500);
      if (b.p >= 1) return finish('early');
    } else {
      b.p = clamp(b.p + dt / BAKE_MS);
      if (b.p >= 1) return finish('auto');
    }
    const now = performance.now();
    if (now - lastDraw > 80) { lastDraw = now; draw(); }
  });

  bindNav();
  if (entering) say('bake');
}

// --- decorate ---

function renderDecorate(entering) {
  const c = S.cake;
  scene.innerHTML = `<div class="hero" id="decoCake">${cakeSVG(c)}</div>`;
  const tabs = ['glaze', 'sprinkles', 'toppings', 'face', 'magic'];
  panel.innerHTML =
    `<h2>${t('deco.title')}</h2>` +
    `<div class="tabs" role="tablist">` + tabs.map((k) =>
      `<button role="tab" class="tab ${S.tab === k ? 'on' : ''}" data-tab="${k}" aria-selected="${S.tab === k}">${t('tab.' + k)}</button>`).join('') + `</div>` +
    `<div class="tabbody" id="tabbody">${tabBody()}</div>` +
    `<div class="row"><button class="btn" id="surprise">${t('deco.surprise')}</button><button class="btn ghost" id="reset">${t('deco.reset')}</button></div>` +
    nav('bake', 'reveal', t('deco.done'), true);

  $$('[data-tab]', panel).forEach((b) => b.addEventListener('click', () => { S.tab = b.dataset.tab; sfx.click(); renderDecorate(); }));
  bindTab();
  $('#surprise').addEventListener('click', (e) => {
    surprise();
    sfx.magic();
    sparkleAt($('#decoCake'), 40);
    say('surprise');
    renderDecorate();
  });
  $('#reset').addEventListener('click', () => {
    Object.assign(c, { glaze: 'none', sprinkles: 'none', toppings: [], extras: [], eyes: 'big', mouth: 'smile' });
    sfx.swish();
    renderDecorate();
  });
  bindNav();
  if (entering) say('deco');
}

function opt(attr, val, on, inner, label) {
  return `<button class="opt ${on ? 'on' : ''}" data-${attr}="${val}" aria-pressed="${on}">${inner}<span>${label}</span></button>`;
}

function tabBody() {
  const c = S.cake;
  switch (S.tab) {
    case 'glaze':
      return `<div class="opts">` + Object.keys(GLAZES).map((g) =>
        opt('glaze', g, c.glaze === g, `<i class="swatch ${g === 'none' ? 'none' : ''}" style="background:${GLAZE_SWATCH[g]}"></i>`, t('glaze.' + g))).join('') + `</div>`;
    case 'sprinkles':
      return `<div class="opts wide">` + SPRINKLES.map((s) =>
        opt('spr', s, c.sprinkles === s, sprinkleIcon(s), t('spr.' + s))).join('') + `</div>`;
    case 'toppings':
      return `<div class="opts">` + TOPPINGS.map((tp) => {
        const n = c.toppings.filter((x) => x === tp).length;
        return opt('top', tp, n > 0, toppingIcon(tp) + (n ? `<i class="badge">${n}</i>` : ''), t('top.' + tp));
      }).join('') + `</div><button class="btn ghost small" id="clearTop">${t('top.clear')}</button>`;
    case 'face':
      return `<h4>${t('face.eyes')}</h4><div class="opts">` + EYES.map((e) => opt('eyes', e, c.eyes === e, eyesIcon(e), t('eyes.' + e))).join('') + `</div>` +
        `<h4>${t('face.mouth')}</h4><div class="opts">` + MOUTHS.map((m) => opt('mouth', m, c.mouth === m, mouthIcon(m), t('mouth.' + m))).join('') + `</div>`;
    case 'magic':
      return `<div class="opts">` + EXTRAS.map((x) =>
        opt('extra', x, c.extras.includes(x), extraIcon(x), t('x.' + x))).join('') + `</div>`;
  }
  return '';
}

function bindTab() {
  const c = S.cake;
  const changed = (btn) => {
    $('#decoCake').innerHTML = cakeSVG(c);
    $('#tabbody').innerHTML = tabBody();
    bindTab();
    sfx.pop();
    if (btn) $('#decoCake').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.04, .96)' }, { transform: 'scale(1)' }], { duration: 260 });
  };
  const on = (attr, fn) => $$(`[data-${attr}]`, $('#tabbody')).forEach((b) => b.addEventListener('click', () => { fn(b.dataset[attr]); changed(b); }));
  on('glaze', (v) => { c.glaze = v; });
  on('spr', (v) => { c.sprinkles = v; });
  on('eyes', (v) => { c.eyes = v; });
  on('mouth', (v) => { c.mouth = v; });
  on('extra', (v) => {
    c.extras = c.extras.includes(v) ? c.extras.filter((x) => x !== v) : [...c.extras, v];
  });
  on('top', (v) => {
    if (c.toppings.length >= MAX_TOPPINGS) {
      c.toppings.shift();
      say('full');
    }
    c.toppings.push(v);
  });
  const clear = $('#clearTop');
  if (clear) clear.addEventListener('click', () => { c.toppings = []; changed(); });
}

function surprise() {
  const r = Math.random;
  const c = S.cake;
  c.glaze = pick(r, ['vanilla', 'pink', 'lemon', 'mint', 'choco', 'rainbow', 'galaxy']);
  c.sprinkles = pick(r, SPRINKLES.filter((s) => s !== 'none'));
  // Alternating A-B-A-B pattern always reads as "designed".
  const pool = PAIRINGS[c.filling];
  const a = pick(r, pool), b = pick(r, pool);
  c.toppings = Array.from({ length: 3 + Math.floor(r() * 3) }, (_, i) => (i % 2 ? b : a));
  c.extras = [...EXTRAS].sort(() => r() - 0.5).slice(0, 1 + Math.floor(r() * 3));
  c.eyes = pick(r, EYES);
  c.mouth = pick(r, MOUTHS);
}

// --- reveal ---

function renderReveal(entering) {
  const c = S.cake;
  if (entering && !S.fromShelf) saveToShelf(c);

  scene.innerHTML = `<div class="reveal ${S.cut ? 'cut' : ''}"><div class="rays"></div>` +
    `<div class="hero ${S.cut ? '' : 'float'}">${cakeSVG(c)}</div>` +
    (S.cut ? `<div class="slice-wrap">${sliceSVG(c)}</div>` : '') + `</div>`;

  const score = cakeScore(c);
  panel.innerHTML =
    `<p class="kicker">✨ ${t('steps')[4]} ✨</p><h2 class="cake-name">${cakeName(c)}</h2>` +
    `<div class="score"><span class="stars">${'<i>★</i>'.repeat(5)}</span>` +
    `<span class="num">${t('reveal.score')}: <b>${score}</b> ${t('reveal.outOf')}</span></div>` +
    `<div class="col">` +
    (S.cut ? '' : `<button class="btn big primary" id="cut">${t('reveal.cut')}</button>`) +
    `<button class="btn" id="save">📸 ${t('reveal.save')}</button>` +
    `<button class="btn ghost" id="again">🔁 ${t('reveal.again')}</button></div>` +
    (S.fromShelf ? '' : nav('decorate', null)) + shelfHTML();

  if (entering) {
    sfx.fanfare();
    setTimeout(() => confetti(160), 150);
    say('reveal');
  }
  const cut = $('#cut');
  if (cut) cut.addEventListener('click', () => {
    S.cut = true;
    sfx.swish();
    setTimeout(() => { sfx.pop(); confetti(60); }, 250);
    say('cut');
    renderReveal();
  });
  $('#save').addEventListener('click', savePNG);
  $('#again').addEventListener('click', () => { sfx.pop(); S.fromShelf = false; go('start'); });
  bindNav();
  bindShelf();
}

function svgImage(markup) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(markup);
  });
}

async function savePNG() {
  const c = S.cake;
  const W = 1080, H = 1080;
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const g = cv.getContext('2d');
  const bg = g.createRadialGradient(W / 2, H * 0.55, 50, W / 2, H * 0.55, W * 0.75);
  bg.addColorStop(0, '#fff6d6');
  bg.addColorStop(1, '#ffc2dc');
  g.fillStyle = bg;
  g.fillRect(0, 0, W, H);

  try { await document.fonts.ready; } catch {}
  const cakeImg = await svgImage(cakeSVG(c));
  if (S.cut) {
    const sliceImg = await svgImage(sliceSVG(c));
    g.drawImage(cakeImg, 30, 270, 680, 556);
    g.drawImage(sliceImg, 680, 380, 360, 420);
  } else {
    g.drawImage(cakeImg, 110, 210, 860, 704);
  }

  g.fillStyle = '#3d2314';
  g.textAlign = 'center';
  const name = cakeName(c);
  let size = 64;
  do { g.font = `900 ${size}px Nunito, system-ui, sans-serif`; size -= 2; } while (g.measureText(name).width > W - 100 && size > 28);
  g.fillText(name, W / 2, 120);
  g.font = '800 40px Nunito, system-ui, sans-serif';
  g.fillStyle = '#ffb703';
  g.fillText('★★★★★', W / 2, 180);
  g.fillStyle = '#3d2314';
  g.font = '700 30px Nunito, system-ui, sans-serif';
  g.fillText(`${t('reveal.score')}: ${cakeScore(c)} ${t('reveal.outOf')}  ·  cake.vibecode.cat`, W / 2, H - 50);

  const a = document.createElement('a');
  a.download = 'cake.png';
  a.href = cv.toDataURL('image/png');
  a.click();
  say('saved');
}

// ---------- render ----------

const RENDER = {
  start: renderStart, filling: renderFilling, mix: renderMix, bake: renderBake, decorate: renderDecorate, reveal: renderReveal,
  factory: (entering) => renderFactory({ scene, say, loop, go }, entering),
};

function render(entering = false) {
  stopLoop();
  renderHeader();
  document.body.dataset.step = S.step;
  RENDER[S.step](entering);
}

// ---------- boot ----------

$('#chef').innerHTML = CHEF_SVG;
$('#chef').addEventListener('click', () => { sfx.pop(); say(S.lastSay); });
$('#home').addEventListener('click', () => { sfx.click(); go('start'); });
$('#lang').addEventListener('click', () => {
  setLang(getLang() === 'ru' ? 'en' : 'ru');
  sfx.click();
  stopLoop();
  render();
  say(S.lastSay);
});
$('#snd').addEventListener('click', () => {
  setMuted(!isMuted());
  renderHeader();
  sfx.click();
});

setLang(getLang());
render(true);
say('welcome');
