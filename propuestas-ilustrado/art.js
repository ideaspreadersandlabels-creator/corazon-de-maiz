// Illustrated (non-pixel) art for the Tlaxcallan style proposals: three title
// scenes, twelve item icons and two character portraits. Every piece is a
// standalone SVG turned into a data URL, so the browser rasterises it once and
// the painterly filters (turbulence + displacement) don't re-run per element.
"use strict";
(function () {
  const O = '#3a2418';
  const url = (vb, body, defs = '') => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}">${defs}${body}</svg>`);
  const rnd = seed => () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  // Wobbly "hand-drawn" edge: displaces the shape by fractal noise.
  const wob = (id, freq, scale, seed = 3) => `<filter id="${id}" x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/></filter>`;
  // Paper/brush grain laid over a whole scene.
  const grain = (id, op) => `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="11" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0.24 0 0 0 0 0.16 0 0 0 0 0.1 0 0 0 -2.4 1.25"/><feComponentTransfer><feFuncA type="linear" slope="${op}"/></feComponentTransfer></filter>`;
  const path = (pts) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  const ridge = (f, y1 = 540, step = 8) => { const p = []; for (let x = -10; x <= 970; x += step) p.push([x, f(x)]); return path(p) + `L970 ${y1}L-10 ${y1}Z`; };

  // ---------- Shared painted elements ----------
  function maize(x, y, s, R, pal = { stem: '#4f7f2e', leaf: '#6fa23e', hi: '#9cc95a', cob: '#f0bd45', tas: '#e3b45a' }) {
    const h = (100 + R() * 30) * s; let g = '';
    g += `<path d="M${x} ${y} C ${x - 3 * s} ${y - h * .4} ${x + 3 * s} ${y - h * .7} ${x + 1 * s} ${y - h}" stroke="${pal.stem}" stroke-width="${3.4 * s}" fill="none" stroke-linecap="round"/>`;
    for (let k = 0; k < 4; k++) {
      const ly = y - h * (.25 + k * .17), d = k % 2 ? 1 : -1, L = (44 - k * 6) * s * (.85 + R() * .3);
      g += `<path d="M${x} ${ly} C ${x + d * L * .35} ${ly - 18 * s} ${x + d * L * .75} ${ly - 14 * s} ${x + d * L} ${ly + 6 * s} C ${x + d * L * .7} ${ly - 6 * s} ${x + d * L * .35} ${ly - 8 * s} ${x} ${ly + 5 * s} Z" fill="${k % 2 ? pal.leaf : pal.hi}" opacity=".95"/>`;
    }
    const ey = y - h * .48;
    g += `<ellipse cx="${x + 5 * s}" cy="${ey}" rx="${4 * s}" ry="${9 * s}" fill="${pal.cob}" transform="rotate(18 ${x + 5 * s} ${ey})"/><path d="M${x} ${ey + 8 * s} C ${x + 8 * s} ${ey + 2 * s} ${x + 9 * s} ${ey - 6 * s} ${x + 8 * s} ${ey - 10 * s}" stroke="${pal.hi}" stroke-width="${2.4 * s}" fill="none"/>`;
    const tx = x + s, ty = y - h;
    for (let k = -2; k <= 2; k++) g += `<path d="M${tx} ${ty} q ${k * 4 * s} ${-6 * s} ${k * 7 * s} ${-3 * s}" stroke="${pal.tas}" stroke-width="${1.6 * s}" fill="none"/>`;
    return g;
  }
  function maguey(x, y, s, back = '#3f6f5e', front = '#7fb09a', rim = '#d8c26a') {
    let g = '';
    [-72, 72, -52, 52, -30, 30, -12, 12, 0].forEach((a, i) => {
      const L = (78 - Math.abs(a) * .35) * s, w = 9 * s, b = i < 4;
      g += `<path transform="rotate(${a} ${x} ${y})" d="M${x - w} ${y} C ${x - w} ${y - L * .5} ${x - 2 * s} ${y - L * .85} ${x} ${y - L} C ${x + 2 * s} ${y - L * .85} ${x + w} ${y - L * .5} ${x + w} ${y} Z" fill="${b ? back : front}" stroke="${b ? '#2d4a40' : rim}" stroke-width="${1.2 * s}"/>`;
      if (!b) g += `<path transform="rotate(${a} ${x} ${y})" d="M${x - w * .3} ${y - 6 * s} C ${x - w * .3} ${y - L * .5} ${x - 1 * s} ${y - L * .8} ${x} ${y - L * .95}" stroke="#b9dccb" stroke-width="${1.4 * s}" fill="none" opacity=".7"/>`;
    });
    return g;
  }

  // ---------- A · Acuarela del amanecer ----------
  function sceneA() {
    const R = rnd(7);
    const h1 = x => 368 + 12 * Math.sin(x / 90) + 8 * Math.sin(x / 37 + 1);
    const h2 = x => 432 + 14 * Math.sin(x / 120 + 2) + 6 * Math.sin(x / 45);
    let trees = '';
    for (let x = 10; x < 960; x += 26 + R() * 30) {
      if (x > 820 && x < 900) continue;
      const y = h1(x) + 4, r = 9 + R() * 8;
      trees += `<circle cx="${x}" cy="${y - r * .6}" r="${r}" fill="#4c7038"/><circle cx="${x - r * .5}" cy="${y - r * .2}" r="${r * .7}" fill="#5c8440"/><circle cx="${x + r * .3}" cy="${y - r}" r="${r * .45}" fill="#7a9e4e"/>`;
    }
    let milpa = '';
    [[468, .62], [500, .8], [540, 1]].forEach(([y, s]) => {
      milpa += `<path d="M-10 ${y - 4 * s} C 150 ${y - 10 * s} 330 ${y - 6 * s} ${520 - (y - 468) * 2} ${y} L-10 ${y + 10} Z" fill="#7a5232" opacity=".9"/>`;
      for (let x = 6 + R() * 10; x < 500 - (y - 468) * 2.2; x += 26 * s + R() * 8) milpa += maize(x, y, s, R);
    });
    const stars = Array.from({ length: 40 }, () => `<circle cx="${R() * 960}" cy="${R() * 120}" r="${.6 + R() * 1.2}" fill="#fff" opacity="${.3 + R() * .5}"/>`).join('');
    const clouds = [[180, 150, 150, 18, '#f3a07f', .55], [430, 104, 210, 22, '#d97a85', .42], [700, 190, 170, 16, '#ffc28a', .6], [890, 120, 120, 14, '#e98a7a', .5], [90, 236, 100, 10, '#f0b090', .45]]
      .map(([x, y, w, h, c, o]) => `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${c}" opacity="${o}"/><ellipse cx="${x + w * .2}" cy="${y - h * .6}" rx="${w * .5}" ry="${h * .8}" fill="${c}" opacity="${o * .8}"/>`).join('');
    const hy = h2(735);
    const defs = `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2853"/><stop offset=".28" stop-color="#5d3c6c"/><stop offset=".5" stop-color="#b85c5f"/><stop offset=".66" stop-color="#ee9b5a"/><stop offset=".78" stop-color="#f8d18a"/></linearGradient>
      <radialGradient id="glow"><stop offset="0" stop-color="#ffe2a6" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc276" stop-opacity=".45"/><stop offset="1" stop-color="#ffc276" stop-opacity="0"/></radialGradient>
      <linearGradient id="mal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#4b3866"/><stop offset=".47" stop-color="#6b4b78"/><stop offset=".55" stop-color="#9a6683"/><stop offset="1" stop-color="#c98a8a"/></linearGradient>
      <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6b48a" stop-opacity="0"/><stop offset=".5" stop-color="#f6b48a" stop-opacity=".5"/><stop offset="1" stop-color="#f6b48a" stop-opacity="0"/></linearGradient>
      <linearGradient id="near" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8cb655"/><stop offset="1" stop-color="#557f36"/></linearGradient>
      ${wob('wc', .013, 16)}${wob('wc2', .03, 6, 5)}<filter id="cl"><feGaussianBlur stdDeviation="6"/></filter>${grain('gr', .5)}
    </defs>`;
    const body = `<rect width="960" height="540" fill="url(#sky)"/>${stars}
      <circle cx="760" cy="330" r="280" fill="url(#glow)"/><circle cx="760" cy="330" r="50" fill="#fff3cf"/><circle cx="760" cy="330" r="38" fill="#fffbe8"/>
      <g filter="url(#cl)">${clouds}</g>
      <g filter="url(#wc)">
        <path d="M-10 368 L50 304 C 74 292 98 290 128 302 L196 334 C 236 312 262 302 300 322 L380 380 Z" fill="#b28caa" opacity=".9"/>
        <path d="M50 304 C 70 296 84 291 98 292 C 108 297 116 301 126 302 L108 314 L96 305 L82 316 Z" fill="#f6e2e6"/>
        <path d="M200 412 C 290 368 360 254 440 198 C 458 186 474 184 490 192 C 570 240 650 346 790 412 Z" fill="url(#mal)"/>
        <path d="M462 196 C 450 244 428 294 392 346 M446 206 C 420 250 380 300 330 356" stroke="#3f2d58" stroke-width="4" fill="none" opacity=".45"/>
        <path d="M482 196 C 504 252 536 304 580 354 M494 202 C 540 250 590 300 660 350" stroke="#f3ad94" stroke-width="4" fill="none" opacity=".5"/>
        <path d="M440 198 C 458 186 474 184 490 192 C 504 202 516 214 526 226 L510 220 L500 234 L488 218 L476 236 L464 216 L452 232 L444 214 L428 226 C 432 214 436 206 440 198 Z" fill="#fbe9e4"/>
        <path d="M440 198 C 450 192 458 188 466 187 L464 216 L452 232 L444 214 L428 226 C 432 214 436 206 440 198 Z" fill="#cdb6d2"/>
      </g>
      <rect x="0" y="320" width="960" height="110" fill="url(#haze)"/>
      <g filter="url(#wc2)">
        <path d="${ridge(h1)}" fill="#6f8f4a"/>${trees}
        <g transform="translate(860 ${h1(860) + 6})"><rect x="-22" y="-26" width="44" height="26" fill="#f4ead6"/><rect x="8" y="-26" width="14" height="26" fill="#d8c8aa"/><path d="M-7 0 V-12 a7 7 0 0 1 14 0 V0Z" fill="#3a2a3a"/><circle cx="0" cy="-30" r="10" fill="#e8d0b0"/><rect x="-1" y="-48" width="2" height="10" fill="#f4ead6"/>${[-30, 22].map(o => `<rect x="${o}" y="-56" width="10" height="56" fill="#f4ead6"/><rect x="${o + 7}" y="-56" width="3" height="56" fill="#d8c8aa"/><rect x="${o}" y="-26" width="10" height="26" fill="#c4583a"/><rect x="${o + 3}" y="-50" width="4" height="7" rx="2" fill="#3a2a3a"/><path d="M${o} -56 l5 -8 l5 8Z" fill="#c4583a"/>`).join('')}</g>
        <path d="${ridge(h2)}" fill="url(#near)"/><path d="${path(Array.from({ length: 124 }, (_, i) => [i * 8 - 10, h2(i * 8 - 10)]))}" stroke="#c4d77a" stroke-width="3" fill="none" opacity=".7"/>
        <path d="M560 540 C 600 500 650 470 700 ${hy + 8} L716 ${hy + 8} C 686 474 644 506 624 540 Z" fill="#dcb07a"/>
        <g transform="translate(735 ${hy + 10})"><rect x="-6" y="-44" width="78" height="44" fill="#e3c194"/><rect x="72" y="-44" width="22" height="44" fill="#c49c6c"/><path d="M-14 -40 L102 -40 L88 -64 L-2 -64 Z" fill="#b4482f"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${-10 + i * 11} -40 L${i * 9.4} -64" stroke="#8a2f20" stroke-width="2"/>`).join('')}<rect x="26" y="-30" width="16" height="30" fill="#6a3e24"/><rect x="2" y="-32" width="14" height="12" fill="#3a2a3a"/><rect x="0" y="-20" width="18" height="3" fill="#f1e3c2"/><rect x="52" y="-12" width="10" height="12" fill="#b8432f"/><circle cx="54" cy="-15" r="3" fill="#e05a7a"/><circle cx="60" cy="-16" r="3" fill="#f2c94c"/></g>
        ${Array.from({ length: 8 }, (_, i) => `<rect x="${840 + i * 16}" y="${hy - 6}" width="3" height="22" fill="#6a4428"/>`).join('')}<rect x="840" y="${hy}" width="120" height="3" fill="#8a5a34"/><rect x="840" y="${hy + 8}" width="120" height="3" fill="#8a5a34"/>
        ${milpa}
        ${maguey(912, 548, 1.3)}${maguey(820, 540, .85)}${maguey(530, 548, .8)}
        ${Array.from({ length: 50 }, () => { const x = 520 + R() * 440, y = 470 + R() * 70; return `<circle cx="${x}" cy="${y}" r="${1.5 + R() * 2}" fill="${R() < .5 ? '#f2c94c' : '#f6f2ea'}"/>`; }).join('')}
      </g>
      <path d="M300 140 q6 -6 12 0 q6 -6 12 0 M330 156 q5 -5 10 0 q5 -5 10 0 M286 160 q4 -4 8 0 q4 -4 8 0" stroke="#2a1a38" stroke-width="2.4" fill="none"/>
      <rect width="960" height="540" filter="url(#gr)"/>`;
    return url('0 0 960 540', body, defs);
  }

  // ---------- B · Talavera al anochecer ----------
  function sceneB() {
    const R = rnd(21);
    const stars = Array.from({ length: 70 }, () => `<circle cx="${R() * 960}" cy="${R() * 200}" r="${.6 + R() * 1.3}" fill="#fff" opacity="${.3 + R() * .6}"/>`).join('');
    const pal = ['#e4b05a', '#c8553d', '#e9dcc0', '#3f6fb0', '#d98a4a', '#f1e3c2', '#7a9a6a'];
    let town = '', x = -10;
    while (x < 970) {
      const w = 70 + R() * 60, h = 64 + R() * 54, c = pal[Math.floor(R() * pal.length)], top = 432 - h;
      if (x > 560 && x < 640) { x = 650; continue; }
      town += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${c}"/><rect x="${x - 3}" y="${top - 6}" width="${w + 6}" height="8" fill="#5a3a2a" opacity=".55"/>`;
      for (let wx = x + 12; wx < x + w - 18; wx += 26) {
        const lit = R() < .65;
        town += `<path d="M${wx} ${top + 46} v-16 a7 7 0 0 1 14 0 v16Z" fill="${lit ? '#f8cf6a' : '#2a2a4a'}"/>${lit ? `<circle cx="${wx + 7}" cy="${top + 38}" r="16" fill="#ffd57a" opacity=".18"/>` : ''}`;
      }
      if (h > 90) town += `<path d="M${x + w / 2 - 10} 432 v-26 a10 10 0 0 1 20 0 v26Z" fill="#3a2430"/>`;
      x += w + 2;
    }
    // Convent tower with Talavera dome.
    town += `<rect x="572" y="232" width="56" height="200" fill="#efe3c8"/><rect x="612" y="232" width="16" height="200" fill="#cdbd9e"/><path d="M584 300 v-26 a16 16 0 0 1 32 0 v26Z" fill="#2a2a4a"/><path d="M590 296 v-18 a10 10 0 0 1 20 0 v18Z" fill="#f8cf6a" opacity=".85"/><rect x="566" y="226" width="68" height="10" fill="#d8c8aa"/>
      <path d="M572 226 C 572 186 628 186 628 226 Z" fill="#2f5fa8"/>${Array.from({ length: 5 }, (_, i) => `<path d="M${578 + i * 11} 224 C ${580 + i * 11} 202 ${588 + i * 9} 194 600 190" stroke="#f6f1e6" stroke-width="2" fill="none"/>`).join('')}<rect x="598" y="166" width="4" height="22" fill="#e0a526"/><rect x="592" y="172" width="16" height="4" fill="#e0a526"/>`;
    const strings = [[0, 250, 480, 300], [480, 300, 960, 240]].map(([x1, y1, x2, y2], si) => {
      const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 50; let s = `<path d="M${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}" stroke="#2a2440" stroke-width="2" fill="none"/>`;
      for (let t = .04; t < 1; t += .055) {
        const px = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t * t * x2, py = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t * t * y2;
        const c = ['#e05a7a', '#f2c94c', '#2f8f8a', '#f6f1e6', '#e07a28'][Math.floor(t * 18 + si) % 5];
        s += `<path d="M${px - 9} ${py} h18 v20 l-4.5 -4 l-4.5 4 l-4.5 -4 l-4.5 4Z" fill="${c}" opacity=".95"/><circle cx="${px}" cy="${py + 9}" r="2.5" fill="#1a2244" opacity=".5"/>`;
      }
      return s;
    }).join('');
    const lanterns = [[150, 300], [330, 330], [690, 320], [840, 290]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="40" fill="url(#lg)"/><path d="M${x} ${y - 30} v14" stroke="#2a2440" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="11" ry="14" fill="#f6a640"/><ellipse cx="${x - 3}" cy="${y - 3}" rx="4" ry="6" fill="#ffe2a0"/>`).join('');
    const kiosko = `<g transform="translate(300 470)"><ellipse cx="0" cy="8" rx="110" ry="16" fill="#2a2440" opacity=".5"/><rect x="-92" y="-12" width="184" height="18" fill="#d8c8aa"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${-84 + i * 28}" y="-70" width="6" height="60" fill="#efe3c8"/>`).join('')}<path d="M-100 -70 L100 -70 L70 -102 L-70 -102 Z" fill="#c8553d"/><path d="M-70 -102 C -40 -136 40 -136 70 -102Z" fill="#2f5fa8"/><circle cx="0" cy="-132" r="6" fill="#e0a526"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${-88 + i * 16}" cy="-66" r="3.4" fill="#ffd57a"/>`).join('')}</g>`;
    const defs = `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d1a40"/><stop offset=".38" stop-color="#22397a"/><stop offset=".62" stop-color="#5b6db0"/><stop offset=".82" stop-color="#d9a27e"/></linearGradient>
      <radialGradient id="mg"><stop offset="0" stop-color="#fff6dc" stop-opacity=".7"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></radialGradient>
      <radialGradient id="lg"><stop offset="0" stop-color="#ffcf70" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf70" stop-opacity="0"/></radialGradient>
      <linearGradient id="pl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a6488"/><stop offset="1" stop-color="#2e2444"/></linearGradient>
      ${wob('wc', .014, 14, 8)}${wob('wc2', .035, 5, 2)}${grain('gr', .45)}
    </defs>`;
    const body = `<rect width="960" height="540" fill="url(#sky)"/>${stars}
      <circle cx="180" cy="116" r="120" fill="url(#mg)"/><circle cx="180" cy="116" r="32" fill="#f6ecd2"/><circle cx="170" cy="108" r="6" fill="#e2d6b8"/><circle cx="192" cy="126" r="4" fill="#e2d6b8"/>
      <g filter="url(#wc)">
        <path d="M-10 380 C 120 352 220 300 330 236 C 380 210 420 204 460 226 C 560 282 700 340 970 360 L970 440 L-10 440 Z" fill="#26346a"/>
        <path d="M330 236 C 380 210 420 204 460 226 C 520 262 600 300 700 330" stroke="#4a5ea0" stroke-width="5" fill="none" opacity=".6"/>
        <path d="M-10 410 C 200 380 400 396 600 384 C 760 376 880 390 970 380 L970 450 L-10 450 Z" fill="#33407a"/>
      </g>
      <g filter="url(#wc2)">${town}<rect x="-10" y="226" width="980" height="210" fill="#1b2a5c" opacity=".2"/>
        <rect x="-10" y="430" width="980" height="120" fill="url(#pl)"/>
        ${Array.from({ length: 90 }, () => `<ellipse cx="${R() * 960}" cy="${440 + R() * 100}" rx="${6 + R() * 8}" ry="${2 + R() * 2}" fill="#8f7aa0" opacity=".35"/>`).join('')}
        ${kiosko}${strings}${lanterns}
        <g transform="translate(760 540)">${maguey(0, 0, .9, '#24485a', '#3f6f8a', '#8fb0c0')}</g>
        <g transform="translate(70 470)"><path d="M-30 0 h60 l-8 70 h-44Z" fill="#c8553d"/><path d="M-30 0 h60 v8 h-60Z" fill="#e9dcc0"/><path d="M-22 18 h44" stroke="#2f5fa8" stroke-width="5"/>${[-14, 0, 14].map((d, i) => `<circle cx="${d}" cy="${-14 - (i % 2) * 8}" r="9" fill="${['#e05a7a', '#f2c94c', '#e07a28'][i]}"/>`).join('')}<path d="M-10 -4 C -20 -20 -26 -24 -32 -22 M10 -4 C 22 -22 30 -24 34 -20" stroke="#4f7f2e" stroke-width="4" fill="none"/></g>
      </g>
      <rect width="960" height="540" filter="url(#gr)"/>`;
    return url('0 0 960 540', body, defs);
  }

  // ---------- C · Mural de Cacaxtla ----------
  function sceneC(withHero = true) {
    const R = rnd(33);
    const spiral = (x, y, s, c) => `<path d="M${x} ${y} c 0 ${-12 * s} ${18 * s} ${-12 * s} ${18 * s} 0 c 0 ${8 * s} ${-10 * s} ${8 * s} ${-10 * s} ${2 * s}" stroke="${c}" stroke-width="${3.2 * s}" fill="none" stroke-linecap="round"/>`;
    const band = y => `<rect x="-10" y="${y}" width="980" height="44" fill="#2e7896"/><path d="M-10 ${y} H970 M-10 ${y + 44} H970" stroke="#1a1410" stroke-width="5"/>${Array.from({ length: 17 }, (_, i) => spiral(-6 + i * 60, y + 30, 1, '#e9dcc3') + `<circle cx="${30 + i * 60}" cy="${y + 13}" r="3" fill="#e9dcc3"/>`).join('')}`;
    const patches = Array.from({ length: 40 }, () => `<ellipse cx="${R() * 960}" cy="${60 + R() * 420}" rx="${10 + R() * 50}" ry="${6 + R() * 26}" fill="${R() < .6 ? '#c46a4e' : '#7e2a1e'}" opacity="${.18 + R() * .2}"/>`).join('');
    const kern = (x, y) => Array.from({ length: 4 }, (_, r) => Array.from({ length: 3 }, (_, c) => `<circle cx="${x - 7 + c * 7}" cy="${y - 14 + r * 9}" r="3.2" fill="#f6d36a" stroke="#1a1410" stroke-width="1.2"/>`).join('')).join('');
    const plant = (x, flip) => {
      const f = flip ? -1 : 1; let g = `<path d="M${x} 480 C ${x - 8 * f} 380 ${x + 10 * f} 300 ${x} 150" stroke="#1a1410" stroke-width="16" fill="none"/><path d="M${x} 480 C ${x - 8 * f} 380 ${x + 10 * f} 300 ${x} 150" stroke="#4f8f4a" stroke-width="10" fill="none"/>`;
      [[420, 1, 90], [360, -1, 84], [300, 1, 74], [240, -1, 62], [190, 1, 48]].forEach(([y, d, L]) => {
        const dd = d * f;
        g += `<path d="M${x} ${y} C ${x + dd * L * .4} ${y - 50} ${x + dd * L} ${y - 40} ${x + dd * L * 1.1} ${y + 10} C ${x + dd * L * .8} ${y - 14} ${x + dd * L * .4} ${y - 18} ${x} ${y + 14} Z" fill="#5fa35a" stroke="#1a1410" stroke-width="4" stroke-linejoin="round"/><path d="M${x + dd * 10} ${y} C ${x + dd * L * .45} ${y - 32} ${x + dd * L * .8} ${y - 26} ${x + dd * L} ${y + 4}" stroke="#a8d77a" stroke-width="3" fill="none"/>`;
      });
      [[330, 1], [270, -1]].forEach(([y, d]) => { const cx = x + d * f * 26; g += `<path d="M${cx - 13} ${y + 20} C ${cx - 16} ${y - 10} ${cx - 8} ${y - 26} ${cx} ${y - 30} C ${cx + 8} ${y - 26} ${cx + 16} ${y - 10} ${cx + 13} ${y + 20} Z" fill="#e9b33e" stroke="#1a1410" stroke-width="4"/>${kern(cx, y)}<path d="M${cx - 14} ${y + 22} C ${cx - 22} ${y} ${cx - 18} ${y - 14} ${cx - 10} ${y - 20} M${cx + 14} ${y + 22} C ${cx + 22} ${y} ${cx + 18} ${y - 14} ${cx + 10} ${y - 20}" stroke="#1a1410" stroke-width="4" fill="#5fa35a"/>`; });
      g += `<path d="M${x} 150 l-14 -26 M${x} 150 l0 -32 M${x} 150 l14 -26" stroke="#1a1410" stroke-width="9" stroke-linecap="round"/><path d="M${x} 150 l-14 -26 M${x} 150 l0 -32 M${x} 150 l14 -26" stroke="#e9c46a" stroke-width="5" stroke-linecap="round"/>`;
      return g;
    };
    // Matlalcueye ("la de la falda azul"): the Malinche as a tepetl glyph.
    const tepetl = `<g transform="translate(480 0)">
      <path d="M-170 470 C -170 360 -110 236 0 228 C 110 236 170 360 170 470 Z" fill="#4f8f4a" stroke="#1a1410" stroke-width="7"/>
      <path d="M-160 390 C -100 372 100 372 160 390 C 166 420 170 450 170 470 L-170 470 C -170 450 -166 420 -160 390 Z" fill="#2f6fae" stroke="#1a1410" stroke-width="6"/>
      ${Array.from({ length: 6 }, (_, i) => spiral(-142 + i * 52, 436, 1.25, '#e9dcc3')).join('')}
      <path d="M-120 400 C -60 390 60 390 120 400" stroke="#e9dcc3" stroke-width="4" fill="none" stroke-dasharray="2 12" stroke-linecap="round"/>
      ${[[-60, 300], [10, 270], [60, 330], [-20, 350], [100, 360], [-100, 350]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#a8d77a" stroke="#1a1410" stroke-width="3"/>`).join('')}
      <path d="M-30 236 C -20 210 20 210 30 236" stroke="#1a1410" stroke-width="6" fill="#e9dcc3"/>
      <rect x="-180" y="466" width="360" height="22" fill="#e9b33e" stroke="#1a1410" stroke-width="6"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${-172 + i * 40}" y="470" width="20" height="14" fill="#b8402e"/>`).join('')}
    </g>`;
    const steps = Array.from({ length: 9 }, (_, i) => { const x = 250 + i * 30, y = 512 - (i % 2) * 8; return `<path d="M${x} ${y} c -4 -10 6 -14 9 -6 c 2 6 -2 12 -9 6Z" fill="#1a1410"/>`; }).join('');
    const defs = `<defs>${wob('wc', .02, 10, 4)}${wob('wc2', .05, 4, 6)}${grain('gr', .7)}</defs>`;
    const body = `<rect width="960" height="540" fill="#a63a2b"/><g filter="url(#wc)">${patches}</g>
      <g filter="url(#wc2)">${withHero ? tepetl + plant(110, false) : ''}${band(0)}${band(496)}</g>
      <rect width="960" height="540" filter="url(#gr)"/>`;
    return url('0 0 960 540', body, defs);
  }

  // ---------- Item icons (64×64) ----------
  const icoDefs = `<defs>${wob('r', .08, 2.2, 2)}</defs>`;
  function corn(k1, k2, k3) {
    let kern = '';
    for (let y = 12, row = 0; y <= 48; y += 4.2, row++) {
      const half = 11 * Math.sqrt(Math.max(0, 1 - ((y - 30) / 22) ** 2));
      for (let x = 36 - half + 2.6 + (row % 2) * 2.2; x <= 36 + half - 2.4; x += 4.4) kern += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="${x < 36 ? k1 : k2}"/>`;
    }
    return `<path d="M14 58 C 10 42 16 24 30 10 C 27 28 28 42 24 58 Z" fill="#5f8f36" stroke="${O}" stroke-width="1.5" stroke-linejoin="round"/>
      <g transform="rotate(24 36 30)"><ellipse cx="36" cy="30" rx="11.5" ry="22" fill="${k3}" stroke="${O}" stroke-width="1.5"/>${kern}<path d="M29 15 C 27 25 27 36 29 45" stroke="#fff" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/></g>
      <path d="M20 60 C 24 46 34 36 50 30 C 44 42 38 52 32 62 Z" fill="#7fb04a" stroke="${O}" stroke-width="1.5" stroke-linejoin="round"/><path d="M26 57 C 30 48 38 40 46 35" stroke="#c8e08a" stroke-width="1.6" fill="none" opacity=".8"/>
      <path d="M45 10 C 47 5 50 4 53 3 M45 11 C 49 8 53 8 57 7" stroke="#d9a35a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
  }
  const bean = (cx, cy, a) => `<g transform="rotate(${a} ${cx} ${cy})"><path d="M${cx - 10} ${cy} C ${cx - 10} ${cy - 8} ${cx + 10} ${cy - 8} ${cx + 10} ${cy} C ${cx + 10} ${cy + 6} ${cx + 3} ${cy + 3} ${cx} ${cy + 6} C ${cx - 3} ${cy + 8} ${cx - 10} ${cy + 6} ${cx - 10} ${cy} Z" fill="#8f2a24" stroke="${O}" stroke-width="1.5"/><ellipse cx="${cx - 3}" cy="${cy - 3}" rx="3.6" ry="1.6" fill="#e88a7a" opacity=".85"/><path d="M${cx + 2} ${cy + 3.5} q 2 -1 3 -3" stroke="#f1dcc0" stroke-width="1.2" fill="none"/></g>`;
  const ICONS = {
    maiz: corn('#fbd969', '#e9b23a', '#c98a1e'),
    maizAzul: corn('#7aa0e6', '#3d63b8', '#22397a'),
    frijol: bean(22, 24, -20) + bean(42, 30, 25) + bean(28, 44, 8),
    calabaza: `<path d="M30 16 C 30 10 34 6 38 6" stroke="#6a4428" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M38 12 C 46 6 56 10 56 18 C 48 20 42 18 38 12 Z" fill="#6fa23e" stroke="${O}" stroke-width="1.4"/>
      <ellipse cx="32" cy="38" rx="25" ry="19" fill="#e07a28" stroke="${O}" stroke-width="1.6"/><ellipse cx="32" cy="38" rx="15" ry="19" fill="#ec8f3a" stroke="#a8521e" stroke-width="1.3"/><ellipse cx="32" cy="38" rx="5.5" ry="19" fill="#f2a24a" stroke="#a8521e" stroke-width="1.3"/>
      <path d="M14 32 C 16 26 20 23 24 22" stroke="#ffd6a0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>`,
    chile: `<path d="M42 14 C 52 18 52 32 44 42 C 36 54 22 59 10 58 C 20 52 28 44 32 34 C 35 26 36 18 42 14 Z" fill="#c8302a" stroke="${O}" stroke-width="1.6"/><path d="M40 22 C 40 30 36 40 28 47" stroke="#f08a7a" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".8"/>
      <path d="M38 16 C 40 12 46 10 50 14 C 46 18 42 18 38 16 Z" fill="#4f8a36" stroke="${O}" stroke-width="1.4"/><path d="M45 12 C 46 7 49 5 53 4" stroke="#4f8a36" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    nopal: `<ellipse cx="30" cy="40" rx="15" ry="19" transform="rotate(-10 30 40)" fill="#5f9a54" stroke="${O}" stroke-width="1.6"/><ellipse cx="45" cy="20" rx="9" ry="12" transform="rotate(25 45 20)" fill="#6fae60" stroke="${O}" stroke-width="1.4"/><ellipse cx="17" cy="18" rx="7" ry="10" transform="rotate(-30 17 18)" fill="#6fae60" stroke="${O}" stroke-width="1.4"/>
      <ellipse cx="52" cy="9" rx="4" ry="5" fill="#c2307a" stroke="${O}" stroke-width="1.2"/>${[[24, 32], [34, 30], [28, 44], [38, 46], [22, 52], [44, 18], [16, 16]].map(([x, y]) => `<path d="M${x - 2} ${y} h4 M${x} ${y - 2} v4" stroke="#f1e8c8" stroke-width="1.3"/>`).join('')}<path d="M22 26 C 20 32 20 40 22 48" stroke="#a8d690" stroke-width="2" fill="none" opacity=".6"/>`,
    tuna: `<defs><radialGradient id="t" cx=".38" cy=".35"><stop offset="0" stop-color="#e45a9a"/><stop offset=".6" stop-color="#b42870"/><stop offset="1" stop-color="#6e1846"/></radialGradient></defs>
      <path d="M24 16 C 26 10 30 12 32 8 C 34 12 38 10 40 16 Z" fill="#7cb04a" stroke="${O}" stroke-width="1.3"/><ellipse cx="32" cy="37" rx="17" ry="21" fill="url(#t)" stroke="${O}" stroke-width="1.6"/>
      ${[[24, 28], [38, 26], [30, 38], [42, 40], [24, 46], [34, 52]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#f6d36a"/>`).join('')}<path d="M22 26 C 20 32 21 40 24 46" stroke="#ffc0dc" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>`,
    maguey: maguey(32, 58, .62),
    pulque: `<path d="M10 30 C 10 48 20 58 32 58 C 44 58 54 48 54 30 Z" fill="#a8522e" stroke="${O}" stroke-width="1.6"/><path d="M14 40 C 20 44 26 38 32 42 C 38 46 44 40 50 42" stroke="#f1dcb0" stroke-width="2.2" fill="none"/>${[18, 26, 34, 42].map(x => `<circle cx="${x + 2}" cy="49" r="1.6" fill="#f1dcb0"/>`).join('')}
      <ellipse cx="32" cy="30" rx="22" ry="7" fill="#f7f2e6" stroke="${O}" stroke-width="1.5"/><ellipse cx="28" cy="29" rx="10" ry="3" fill="#fff"/><circle cx="40" cy="30" r="1.6" fill="#e8e0cc"/><circle cx="20" cy="31" r="1.2" fill="#e8e0cc"/><path d="M14 36 C 15 44 18 50 22 53" stroke="#d8834e" stroke-width="2" fill="none" opacity=".8"/>`,
    tortilla: `<path d="M6 44 L32 60 L58 44 L32 34 Z" fill="#f1e3c2" stroke="${O}" stroke-width="1.3"/><path d="M12 47 L38 37 M19 51 L45 41 M26 55 L52 45" stroke="#c0392b" stroke-width="2"/>
      ${[46, 40, 34].map(y => `<ellipse cx="32" cy="${y}" rx="22" ry="8" fill="#ecd3a0" stroke="#a8824a" stroke-width="1.5"/>`).join('')}${[[24, 33], [36, 31], [42, 35], [30, 36]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="#c8955a" opacity=".8"/>`).join('')}`,
    coa: `<path d="M18 52 L50 10" stroke="${O}" stroke-width="7.5" stroke-linecap="round"/><path d="M18 52 L50 10" stroke="#9a6438" stroke-width="5" stroke-linecap="round"/><path d="M22 46 L46 14" stroke="#cf9a62" stroke-width="1.6" stroke-linecap="round"/><circle cx="50" cy="10" r="4" fill="#6a4428" stroke="${O}" stroke-width="1.4"/>
      <path d="M8 50 C 6 58 10 62 18 60 L24 52 L14 46 Z" fill="#a8b0b8" stroke="${O}" stroke-width="1.6" stroke-linejoin="round"/><path d="M10 52 C 9 56 11 58 15 58" stroke="#eef2f6" stroke-width="1.6" fill="none"/>`,
    cantaro: `<defs><radialGradient id="c" cx=".38" cy=".38"><stop offset="0" stop-color="#e8975a"/><stop offset=".6" stop-color="#c46a32"/><stop offset="1" stop-color="#8a3e1c"/></radialGradient></defs>
      <path d="M46 26 C 58 26 58 42 48 44" stroke="${O}" stroke-width="6" fill="none"/><path d="M46 26 C 58 26 58 42 48 44" stroke="#a8522e" stroke-width="3.6" fill="none"/>
      <path d="M32 16 C 18 18 10 30 12 42 C 14 54 24 60 32 60 C 40 60 50 54 52 42 C 54 30 46 18 32 16 Z" fill="url(#c)" stroke="${O}" stroke-width="1.6"/><path d="M25 7 L39 7 L37 18 L27 18 Z" fill="#b8622e" stroke="${O}" stroke-width="1.4"/><ellipse cx="32" cy="7" rx="9" ry="2.6" fill="#7a3418" stroke="${O}" stroke-width="1.2"/>
      <path d="M14 36 C 20 32 26 40 32 36 C 38 32 44 40 50 36" stroke="#f1dcb0" stroke-width="2.4" fill="none"/>${[18, 26, 34, 42].map(x => `<circle cx="${x + 2}" cy="44" r="1.5" fill="#f1dcb0"/>`).join('')}<path d="M18 30 C 18 26 20 23 24 21" stroke="#ffd0a0" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".7"/>
      <path d="M50 8 C 52 12 50 14 48 13 C 46 12 48 10 50 8 Z M56 16 C 57 19 56 20 54 20 C 53 19 54 18 56 16Z" fill="#7fb4ea" stroke="#2f5fa8" stroke-width=".8"/>`,
  };
  const iconCache = {};
  const icon = key => iconCache[key] || (iconCache[key] = url('0 0 64 64', `<g filter="url(#r)">${ICONS[key]}</g>`, icoDefs));

  // ---------- Character portraits (200×240 bust) ----------
  function eyes(lash) {
    return [82, 118].map(x => `<path d="M${x - 11} 108 C ${x - 6} 99 ${x + 6} 99 ${x + 11} 108 C ${x + 6} 114 ${x - 6} 114 ${x - 11} 108 Z" fill="#fff8ef"/><circle cx="${x}" cy="107.5" r="6" fill="#4a2a1a"/><circle cx="${x}" cy="107.5" r="3.4" fill="#120a08"/><circle cx="${x + 2.2}" cy="105.2" r="1.8" fill="#fff"/>
      <path d="M${x - 12} 107 C ${x - 6} 98 ${x + 6} 98 ${x + 12} 106" stroke="#1a1010" stroke-width="2.8" fill="none" stroke-linecap="round"/>${lash ? `<path d="M${x + (x < 100 ? -12 : 12)} 106 l${x < 100 ? -4 : 4} -3" stroke="#1a1010" stroke-width="2.4" stroke-linecap="round"/>` : ''}
      <path d="M${x - 11} 92 C ${x - 5} ${lash ? 87 : 88} ${x + 5} ${lash ? 87 : 88} ${x + 11} 91" stroke="#1d1513" stroke-width="${lash ? 3 : 4.2}" fill="none" stroke-linecap="round"/>`).join('');
  }
  function face(sk, mouth) {
    return `<defs><radialGradient id="f" cx=".42" cy=".4" r=".7"><stop offset="0" stop-color="${sk.h}"/><stop offset=".55" stop-color="${sk.b}"/><stop offset="1" stop-color="${sk.s}"/></radialGradient></defs>
      <path d="M84 148 L84 182 C 92 190 108 190 116 182 L116 148 Z" fill="${sk.b}"/><path d="M84 152 C 92 168 108 168 116 152 L116 150 L84 150 Z" fill="${sk.s}"/>
      <ellipse cx="60" cy="112" rx="8" ry="12" fill="${sk.b}"/><ellipse cx="140" cy="112" rx="8" ry="12" fill="${sk.s}"/>
      <path d="M100 52 C 128 52 142 74 142 104 C 142 136 124 160 100 160 C 76 160 58 136 58 104 C 58 74 72 52 100 52 Z" fill="url(#f)" stroke="${O}" stroke-width="1.2"/>
      <ellipse cx="75" cy="126" rx="9" ry="5" fill="#e0846e" opacity=".45"/><ellipse cx="125" cy="126" rx="9" ry="5" fill="#e0846e" opacity=".45"/>
      <path d="M101 112 C 99 121 96 126 100 128 C 103 128 105 127 107 125" stroke="${sk.s}" stroke-width="2.2" fill="none" stroke-linecap="round"/>${mouth}`;
  }
  function portraitTu(bg) {
    const sk = { b: '#a8683a', s: '#7e4a26', h: '#c4844e' }, H = '#1d1513';
    const zig = Array.from({ length: 16 }, (_, i) => `${i ? 'L' : 'M'}${30 + i * 9} ${i % 2 ? 222 : 230}`).join('');
    const body = `${bg}<path d="M50 90 C 44 140 46 190 40 240 L160 240 C 154 190 156 140 150 90 C 150 46 50 46 50 90 Z" fill="${H}"/>
      <path d="M16 240 C 20 200 50 182 80 176 L120 176 C 150 182 180 200 184 240 Z" fill="#f3ede2" stroke="${O}" stroke-width="1.6"/><path d="M140 182 C 162 192 178 210 184 240 L152 240 C 152 214 150 196 140 182 Z" fill="#d9cfbf"/>
      <path d="M22 216 C 70 208 130 208 178 216 L180 234 C 130 226 70 226 20 234 Z" fill="#c0392b"/><path d="${zig}" stroke="#f3ede2" stroke-width="2.4" fill="none"/>
      ${face(sk, `<path d="M90 140 C 96 145 104 145 110 140" stroke="#6a2e22" stroke-width="3" fill="none" stroke-linecap="round"/>`)}
      <path d="M78 178 C 88 198 112 198 122 178" fill="none" stroke="#c0392b" stroke-width="7"/>
      ${eyes(false)}
      <path d="M58 100 C 54 130 56 160 48 196 L62 196 C 62 160 62 130 64 104 Z M142 100 C 146 130 144 160 152 196 L138 196 C 138 160 138 130 136 104 Z" fill="${H}"/>
      <path d="M56 106 C 52 70 70 46 100 46 C 132 46 150 70 144 108 C 138 92 132 82 124 76 C 118 86 106 90 96 86 C 90 92 78 94 70 88 C 64 94 60 100 56 106 Z" fill="${H}"/>
      <path d="M72 62 C 86 52 104 50 118 55 M64 76 C 70 66 78 60 88 58" stroke="#4a3a35" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>
      <path d="M57 86 C 80 74 120 74 143 86 L143 97 C 120 85 80 85 57 97 Z" fill="#c0392b" stroke="${O}" stroke-width="1.5"/><path d="M58 91 C 80 80 120 80 142 91" stroke="#e8c070" stroke-width="2.2" fill="none"/>
      <g transform="rotate(16 140 82)"><path d="M140 84 C 126 60 130 28 146 12 C 158 34 156 62 140 84 Z" fill="#e07a28" stroke="${O}" stroke-width="1.5"/><path d="M146 16 C 151 24 153 34 152 42 C 146 36 143 26 146 16 Z" fill="#c0392b"/><path d="M140 84 C 142 60 144 38 146 14" stroke="#7a3a1e" stroke-width="1.6" fill="none"/></g>
      <g transform="translate(140 182)"><path d="M40 50 C 58 50 60 32 50 28" stroke="${O}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M40 50 C 58 50 60 32 50 28" stroke="#e0893a" stroke-width="4.4" fill="none" stroke-linecap="round"/>
        <path d="M8 58 C 4 38 10 24 24 22 C 38 24 44 38 40 58 Z" fill="#f6efe4" stroke="${O}" stroke-width="1.6"/><path d="M26 26 C 36 28 42 40 40 58 L31 58 C 33 42 31 34 26 26 Z" fill="#e0893a"/>
        <circle cx="22" cy="18" r="13" fill="#f6efe4" stroke="${O}" stroke-width="1.6"/><path d="M11 12 L12 0 L20 7 Z" fill="#e0893a" stroke="${O}" stroke-width="1.4"/><path d="M24 7 L33 0 L34 12 Z" fill="#f6efe4" stroke="${O}" stroke-width="1.4"/><path d="M10 15 C 12 6 18 6 21 8 C 18 12 14 16 10 15Z" fill="#e0893a"/>
        <ellipse cx="17" cy="18" rx="1.7" ry="2.5" fill="#2a1712"/><ellipse cx="27" cy="18" rx="1.7" ry="2.5" fill="#2a1712"/><path d="M21 22 L23.4 22 L22.2 23.6 Z" fill="#d06a6a"/></g>`;
    return url('0 0 200 240', `<g filter="url(#r)">${body}</g>`, `<defs>${wob('r', .05, 2.4, 3)}</defs>`);
  }
  function portraitCit(bg) {
    const sk = { b: '#b07a48', s: '#875630', h: '#cc955f' }, H = '#1a1010';
    const dia = Array.from({ length: 7 }, (_, i) => `<path d="M${77 + i * 8} 196 l4 -5 l4 5 l-4 5Z" fill="${i % 2 ? '#e05a7a' : '#2f5fa8'}"/>`).join('');
    const body = `${bg}<path d="M52 92 C 44 140 44 196 36 240 L164 240 C 156 196 156 140 148 92 C 146 46 54 46 52 92 Z" fill="${H}"/>
      <path d="M16 240 C 20 202 50 184 80 178 L120 178 C 150 184 180 202 184 240 Z" fill="#f6f2ea" stroke="${O}" stroke-width="1.6"/><path d="M142 184 C 162 194 178 212 184 240 L154 240 C 154 214 152 198 142 184 Z" fill="#dcd2c2"/>
      ${face(sk, `<path d="M91 139 C 96 143 104 143 109 139 C 105 146 95 146 91 139 Z" fill="#a8483e"/>`)}
      <path d="M72 180 L128 180 L124 204 L76 204 Z" fill="none" stroke="#2f8f8a" stroke-width="6" stroke-linejoin="round"/>${dia}
      <path d="M24 226 C 70 218 130 218 176 226 L178 240 L22 240 Z" fill="#2f5fa8"/><path d="M24 226 C 70 218 130 218 176 226" stroke="#f2c94c" stroke-width="3" fill="none" stroke-dasharray="6 5"/>
      ${eyes(true)}
      <path d="M58 98 C 52 134 54 170 46 214 L60 214 C 62 170 62 134 66 104 Z M142 98 C 148 134 146 170 154 214 L140 214 C 138 170 138 134 134 104 Z" fill="${H}"/>
      <path d="M100 47 C 72 47 54 70 56 106 C 62 88 76 72 100 64 Z M100 47 C 128 47 146 70 144 106 C 138 88 124 72 100 64 Z" fill="${H}"/><path d="M100 48 L100 64" stroke="${sk.s}" stroke-width="2"/>
      <path d="M86 54 C 74 60 66 72 62 86 M114 54 C 126 60 134 72 138 86" stroke="#3e2e2e" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g transform="translate(140 70)"><path d="M-4 6 C -14 10 -18 18 -16 22 C -8 20 -4 14 -4 6Z" fill="#4f8a36"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-8" rx="6" ry="9" transform="rotate(${a})" fill="#e05a7a" stroke="${O}" stroke-width="1.2"/>`).join('')}<circle r="4.5" fill="#f2c94c" stroke="${O}" stroke-width="1.2"/></g>
      ${[60, 140].map(x => `<circle cx="${x}" cy="126" r="3.4" fill="#e9b33e" stroke="${O}" stroke-width="1"/><path d="M${x} 129 l-4 9 h8Z" fill="#e9b33e" stroke="${O}" stroke-width="1"/>`).join('')}`;
    return url('0 0 200 240', `<g filter="url(#r)">${body}</g>`, `<defs>${wob('r', .05, 2.4, 5)}</defs>`);
  }

  // Runtime textures used by the CSS (grain, Talavera tile, stepped fret).
  function grainTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 220;
    const g = c.getContext('2d'), img = g.createImageData(220, 220), R = rnd(5);
    for (let i = 0; i < img.data.length; i += 4) { const v = 60 + R() * 80; img.data[i] = v; img.data[i + 1] = v * .85; img.data[i + 2] = v * .7; img.data[i + 3] = R() * 34; }
    g.putImageData(img, 0, 0);
    for (let k = 0; k < 26; k++) { g.strokeStyle = `rgba(120,90,60,${.05 + R() * .08})`; g.lineWidth = .6; g.beginPath(); const x = R() * 220, y = R() * 220; g.moveTo(x, y); g.quadraticCurveTo(x + 10, y + R() * 8, x + 12 + R() * 14, y + R() * 6); g.stroke(); }
    return `url(${c.toDataURL()})`;
  }
  const svgCss = s => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}")`;
  const tile = (bg, blue, gold) => svgCss(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><rect width="24" height="24" fill="${bg}"/><path d="M12 3C15 7 15 9 12 12C9 9 9 7 12 3ZM12 21C9 17 9 15 12 12C15 15 15 17 12 21ZM3 12C7 9 9 9 12 12C9 15 7 15 3 12ZM21 12C17 15 15 15 12 12C15 9 17 9 21 12Z" fill="${blue}"/><circle cx="12" cy="12" r="2.2" fill="${gold}"/><path d="M0 0h5a5 5 0 0 1-5 5zM24 0v5a5 5 0 0 1-5-5zM0 24v-5a5 5 0 0 1 5 5zM24 24h-5a5 5 0 0 1 5-5z" fill="${blue}"/></svg>`);
  const fret = svgCss(`<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16"><rect width="32" height="16" fill="#b8402e"/><path d="M0 14h8v-8h8v-4h4v12h8v-8h4" stroke="#1a1410" stroke-width="2.4" fill="none"/><path d="M0 14h8v-8h8v-4h4v12h8v-8h4" stroke="#e9b33e" stroke-width="1" fill="none"/></svg>`);

  window.TlaxArt = { sceneA, sceneB, sceneC, icon, portraitTu, portraitCit, grainTexture, tile, fret };
})();
