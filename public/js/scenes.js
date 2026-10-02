// The supporting cast: the mixing bowl, the oven and Chef Murzik. All of them have faces.

import { FILLINGS } from './data.js';
import { chunk } from './cake.js';
import { rng, mix, clamp, star } from './util.js';

const INK = '#3d2314';
const NS = 'http://www.w3.org/2000/svg';

// ---------- bowl ----------

const BOWL_FRONT = 'M 68 170 A 152 32 0 0 0 372 170 Q 370 334 220 334 Q 70 334 68 170 Z';
const SMILE = 'M 206 270 Q 220 282 234 270';
const YUM = 'M 203 266 Q 220 294 237 266 Z';

export function bowlSVG() {
  const sparkles = [[96, 128], [352, 120], [140, 92], [306, 86], [222, 70]]
    .map(([x, y], i) => `<path class="twinkle" style="animation-delay:${i * 0.3}s" d="${star(x, y, 12, 3, 4)}" fill="#fff6a8" stroke="${INK}" stroke-width="1.5"/>`).join('');
  return `<svg id="bowl" viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="220" cy="336" rx="160" ry="14" fill="#000" opacity=".14"/>
    <ellipse cx="220" cy="170" rx="152" ry="32" fill="#6cb4d6" stroke="${INK}" stroke-width="4"/>
    <ellipse cx="220" cy="178" rx="136" ry="24" fill="#4f9cc2"/>
    <g id="bwBatter" opacity="0">
      <ellipse id="bwSurf" cx="220" cy="210" rx="120" ry="24" fill="#fff6dc" stroke="${INK}" stroke-width="2.5"/>
    </g>
    <g id="bwSwirl" opacity="0">
      <path d="M 0 0 C 20 -30, 60 -10, 50 20 C 40 60, -40 60, -60 10 C -80 -50, 10 -90, 80 -40" stroke="#fff" stroke-width="5"
        fill="none" stroke-linecap="round" vector-effect="non-scaling-stroke" opacity=".7"/>
    </g>
    <g id="bwLumps"></g>
    <g id="bwSpoon">
      <ellipse id="bwHead" rx="20" ry="9" fill="#d4955a" stroke="${INK}" stroke-width="3"/>
      <line id="bwH1" stroke="${INK}" stroke-width="18" stroke-linecap="round"/>
      <line id="bwH2" stroke="#d4955a" stroke-width="11" stroke-linecap="round"/>
    </g>
    <path d="${BOWL_FRONT}" fill="#8ecae6" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M 78 214 Q 220 262 362 214" stroke="#fff" stroke-width="9" fill="none" opacity=".55" stroke-linecap="round"/>
    <path d="M 100 296 Q 220 326 340 296" stroke="#ffb3c6" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M 70 172 A 152 32 0 0 0 370 172" stroke="#fff" stroke-width="3" fill="none" opacity=".6"/>
    <g class="blink">
      <ellipse cx="184" cy="252" rx="8" ry="10" fill="#2b1a10"/><ellipse cx="256" cy="252" rx="8" ry="10" fill="#2b1a10"/>
      <circle cx="181" cy="248" r="3" fill="#fff"/><circle cx="253" cy="248" r="3" fill="#fff"/>
    </g>
    <ellipse cx="160" cy="268" rx="11" ry="6" fill="#ff8fa3" opacity=".7"/>
    <ellipse cx="280" cy="268" rx="11" ry="6" fill="#ff8fa3" opacity=".7"/>
    <path id="bwMouth" d="${SMILE}" stroke="${INK}" stroke-width="4.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <g id="bwSparkle" opacity="0">${sparkles}</g>
  </svg>`;
}

function lumpMarkup(ing, fid, seed) {
  const sw = `stroke="${INK}" stroke-width="2"`;
  switch (ing) {
    case 'flour': return `<ellipse rx="15" ry="7" fill="#fffaf0" ${sw}/><ellipse cx="-4" cy="-2" rx="5" ry="2" fill="#fff"/>`;
    case 'eggs': return `<ellipse rx="13" ry="6.5" fill="#fff" ${sw}/><ellipse cx="1" rx="5.5" ry="3.5" fill="#ffc300"/>`;
    case 'butter': return `<rect x="-11" y="-6" width="22" height="11" rx="2" fill="#ffe680" ${sw}/>`;
    case 'sugar': return `<rect x="-9" y="-4" width="6" height="6" rx="1" fill="#fff" ${sw}/><rect x="1" y="-6" width="6" height="6" rx="1" fill="#fff" ${sw}/><rect x="-3" y="1" width="6" height="6" rx="1" fill="#fff" ${sw}/>`;
    default: return chunk(fid, 0, 0, rng(seed), 1.3);
  }
}

export class Bowl {
  constructor(svg, fid) {
    this.svg = svg;
    this.fid = fid;
    this.lumpEls = [];
    this.q = (id) => svg.querySelector('#' + id);
  }

  sync(m) {
    const g = this.q('bwLumps');
    while (this.lumpEls.length < m.lumps.length) {
      const L = m.lumps[this.lumpEls.length];
      const el = document.createElementNS(NS, 'g');
      el.innerHTML = lumpMarkup(L.ing, this.fid, L.seed);
      g.append(el);
      this.lumpEls.push(el);
    }

    const total = Object.values(m.counts).reduce((a, b) => a + b, 0);
    const level = total ? clamp(0.25 + total * 0.06) : 0;
    const cy = 222 - level * 46;
    const rx = 104 + level * 34;
    const ry = rx * 0.2;
    const surf = this.q('bwSurf');
    surf.setAttribute('cy', cy.toFixed(1));
    surf.setAttribute('rx', rx.toFixed(1));
    surf.setAttribute('ry', ry.toFixed(1));
    surf.setAttribute('fill', mix('#fff6dc', FILLINGS[this.fid].raw, m.stir));
    this.q('bwBatter').setAttribute('opacity', total ? 1 : 0);

    const th = m.theta;
    this.lumpEls.forEach((el, i) => {
      const L = m.lumps[i];
      const a = L.phi + th * 0.7;
      el.setAttribute('transform', `translate(${(220 + Math.cos(a) * L.r * rx * 0.8).toFixed(1)} ${(cy + Math.sin(a) * L.r * ry * 0.8).toFixed(1)})`);
    });
    g.setAttribute('opacity', clamp(1 - m.stir * 1.25).toFixed(2));

    const sw = this.q('bwSwirl');
    sw.setAttribute('transform', `translate(220 ${cy.toFixed(1)}) scale(${(rx / 100).toFixed(3)} ${(ry / 100).toFixed(3)}) rotate(${((th * 180) / Math.PI).toFixed(1)})`);
    sw.setAttribute('opacity', total ? clamp(m.stir * 1.5).toFixed(2) : 0);

    const tx = 220 + Math.cos(th) * rx * 0.5, ty = cy + Math.sin(th) * ry * 0.5;
    const hx = 316 + Math.cos(th) * 26, hy = 44 + Math.sin(th) * 8;
    const head = this.q('bwHead');
    head.setAttribute('cx', tx.toFixed(1));
    head.setAttribute('cy', ty.toFixed(1));
    for (const id of ['bwH1', 'bwH2']) {
      const l = this.q(id);
      l.setAttribute('x1', tx.toFixed(1)); l.setAttribute('y1', ty.toFixed(1));
      l.setAttribute('x2', hx.toFixed(1)); l.setAttribute('y2', hy.toFixed(1));
    }
    this.q('bwSparkle').setAttribute('opacity', m.stir >= 1 ? 1 : 0);
  }

  yum() {
    const mouth = this.q('bwMouth');
    mouth.setAttribute('d', YUM);
    mouth.setAttribute('fill', '#5a1e1e');
    clearTimeout(this.yt);
    this.yt = setTimeout(() => {
      mouth.setAttribute('d', SMILE);
      mouth.setAttribute('fill', 'none');
    }, 380);
  }
}

// ---------- oven ----------
// The two knobs are its eyes and the temperature display is its mouth.

export function ovenSVG() {
  const coil = Array.from({ length: 13 }, (_, i) => `${i ? 'L' : 'M'} ${110 + i * 18} ${i % 2 ? 274 : 284}`).join(' ');
  return `<svg id="oven" viewBox="0 0 440 360" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="ovGlass"><rect x="98" y="138" width="244" height="152" rx="18"/></clipPath></defs>
    <ellipse cx="220" cy="344" rx="170" ry="12" fill="#000" opacity=".14"/>
    <rect x="86" y="318" width="26" height="22" rx="6" fill="#c76b98" stroke="${INK}" stroke-width="3"/>
    <rect x="328" y="318" width="26" height="22" rx="6" fill="#c76b98" stroke="${INK}" stroke-width="3"/>
    <rect x="50" y="26" width="340" height="300" rx="36" fill="#ff9ec4" stroke="${INK}" stroke-width="4"/>
    <rect x="66" y="42" width="308" height="66" rx="20" fill="#ffd1e3" stroke="${INK}" stroke-width="3"/>
    <g>
      <circle cx="116" cy="75" r="22" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <circle cx="324" cy="75" r="22" fill="#fff" stroke="${INK}" stroke-width="3"/>
      <g id="ovPupils">
        <circle cx="116" cy="75" r="10" fill="#2b1a10"/><circle cx="324" cy="75" r="10" fill="#2b1a10"/>
        <circle cx="112" cy="71" r="3.5" fill="#fff"/><circle cx="320" cy="71" r="3.5" fill="#fff"/>
      </g>
    </g>
    <ellipse cx="84" cy="98" rx="9" ry="5" fill="#ff6fa5" opacity=".6"/>
    <ellipse cx="356" cy="98" rx="9" ry="5" fill="#ff6fa5" opacity=".6"/>
    <rect x="170" y="56" width="100" height="38" rx="12" fill="#2b1a3a" stroke="${INK}" stroke-width="3"/>
    <text id="ovTemp" x="220" y="83" text-anchor="middle" font-family="ui-monospace, Menlo, monospace" font-size="22" font-weight="700" fill="#7dffb2">180°</text>
    <rect x="82" y="122" width="276" height="184" rx="28" fill="#ffd1e3" stroke="${INK}" stroke-width="3"/>
    <rect x="98" y="138" width="244" height="152" rx="18" fill="#2a1b33"/>
    <g clip-path="url(#ovGlass)">
      <rect id="ovGlow" x="98" y="138" width="244" height="152" fill="#ffb347" opacity="0"/>
      <path id="ovCoil" d="${coil}" stroke="#ff6b3d" stroke-width="4" fill="none" stroke-linejoin="round" opacity=".25"/>
      <svg id="ovCake" x="104" y="108" width="232" height="190"></svg>
      <path d="M 120 290 L 210 138 L 250 138 L 160 290 Z" fill="#fff" opacity=".08"/>
    </g>
    <rect x="98" y="138" width="244" height="152" rx="18" fill="none" stroke="${INK}" stroke-width="3"/>
    <rect x="140" y="112" width="160" height="12" rx="6" fill="#fff" stroke="${INK}" stroke-width="3"/>
  </svg>`;
}

// ---------- Chef Murzik ----------

// Cats: Chef Murzik wears the hat; factory customers come in other fur colours.
export function catSVG(fur = '#ffb35c', stripe = '#e08a2e', hat = false) {
  return `<svg viewBox="0 ${hat ? 0 : 16} 120 ${hat ? 130 : 114}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M 22 64 L 26 22 L 52 44 Z" fill="${fur}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M 98 64 L 94 22 L 68 44 Z" fill="${fur}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M 28 52 L 30 32 L 44 44 Z M 92 52 L 90 32 L 76 44 Z" fill="#ff9eb5"/>
  <ellipse cx="60" cy="82" rx="46" ry="38" fill="${fur}" stroke="${INK}" stroke-width="3.5"/>
  <path d="M 52 50 l 2 10 M 60 48 v 11 M 68 50 l -2 10" stroke="${stripe}" stroke-width="4" stroke-linecap="round"/>
  <g class="blink">
    <ellipse cx="44" cy="80" rx="6" ry="7.5" fill="#2b1a10"/><ellipse cx="76" cy="80" rx="6" ry="7.5" fill="#2b1a10"/>
    <circle cx="42" cy="77" r="2.3" fill="#fff"/><circle cx="74" cy="77" r="2.3" fill="#fff"/>
  </g>
  <ellipse cx="32" cy="94" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/><ellipse cx="88" cy="94" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/>
  <path d="M 56 90 L 64 90 L 60 95 Z" fill="#ff6f91" stroke="${INK}" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M 51 99 Q 55.5 104 60 99 Q 64.5 104 69 99" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M 14 88 L 34 91 M 14 98 L 34 96 M 106 88 L 86 91 M 106 98 L 86 96" stroke="${INK}" stroke-width="2" stroke-linecap="round"/>
  ${hat ? `<g>
    <rect x="38" y="34" width="44" height="14" rx="4" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <circle cx="44" cy="22" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <circle cx="76" cy="22" r="13" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <circle cx="60" cy="14" r="15" fill="#fff" stroke="${INK}" stroke-width="3"/>
    <path d="M 36 30 Q 60 40 84 30 L 82 36 L 38 36 Z" fill="#fff"/>
  </g>` : ''}
</svg>`;
}

export const CHEF_SVG = catSVG('#ffb35c', '#e08a2e', true);
