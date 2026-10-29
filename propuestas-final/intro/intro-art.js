// Painted-tile art for the Corazón de Maíz intro. Every piece is a small SVG
// sprite (cobalt brushwork on glazed tile, with a brush-wobble filter baked in)
// returned as { url, box } in local coordinates; intro-story.js places and
// animates them. As <img> sprites the browser rasterizes each once and the
// animations only move layers, so motion stays smooth.
"use strict";
(function () {
  const P = { C: '#1b3a8a', C2: '#2f56b4', CD: '#14285e', W: '#9fb4e0', L: '#c8d4ee', L2: '#e6ecf8', O: '#d39a26', Y: '#f2c94c', G: '#3d7a46', G2: '#5f9a54', GL: '#9cc28a', R: '#b8402e', OR: '#e07a28', CR: '#fbf8f0', BG: '#f6f1e6', BR: '#8a5a34' };
  const br = (w = 3, c = P.C) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const rnd = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const n1 = v => +v.toFixed(1);

  function sprite(markup, box, { wobble = 3.5, defs = '' } = {}) {
    const [x, y, w, h] = box.map(n1);
    const filter = wobble ? `<filter id="b" x="${x - 30}" y="${y - 30}" width="${w + 60}" height="${h + 60}" filterUnits="userSpaceOnUse"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="${wobble}"/></filter>` : '';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${w}" height="${h}"><defs>${defs}${filter}</defs><g${wobble ? ' filter="url(#b)"' : ''}>${markup}</g></svg>`;
    return { url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg), box: [x, y, w, h] };
  }

  // ---------- Sky washes ----------
  const SKY = {
    night: [[0, '#16285e'], [.6, '#24397a'], [1, '#3e5a9c']],
    predawn: [[0, '#1b2e68'], [.5, '#4a5f9e'], [.82, '#b9a8b4'], [1, '#efc58c']],
    dawn: [[0, '#cdd8ee'], [.45, '#f3efe6'], [.8, '#f7ddab'], [1, '#f2c07a']],
    day: [[0, '#c3d1ec'], [.55, '#eef0f2'], [1, '#f7f2e8']],
    sunset: [[0, '#e6e1e2'], [.45, '#f3d5a8'], [.8, '#eeaa70'], [1, '#df8650']],
    dusk: [[0, '#6f80bc'], [.45, '#c3a6ba'], [.8, '#eeb37f'], [1, '#e48f5a']],
    ember: [[0, '#e9d9d0'], [.45, '#efb592'], [.8, '#e28656'], [1, '#c45c38']],
  };
  function sky(kind, seed = 3) {
    const R = rnd(seed), dark = kind === 'night' || kind === 'predawn';
    const defs = `<linearGradient id="g" x1="0" y1="-60" x2="0" y2="430" gradientUnits="userSpaceOnUse">${SKY[kind].map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
    let m = `<rect x="-120" y="-80" width="1200" height="700" fill="url(#g)"/>`;
    for (let i = 0; i < 18; i++) m += `<rect x="${n1(-110 + R() * 1060)}" y="${n1(6 + R() * 360)}" width="${n1(150 + R() * 340)}" height="${n1(6 + R() * 9)}" rx="5" fill="${dark ? '#ffffff' : P.C}" opacity="${n1((dark ? .04 : .035) + R() * .05)}"/>`;
    return sprite(m, [-120, -80, 1200, 700], { defs, wobble: 6 });
  }
  function stars(seed = 5, n = 60, [ax, ay, aw, ah] = [-80, -40, 1120, 330]) {
    const R = rnd(seed); let m = '';
    for (let i = 0; i < n; i++) {
      const x = n1(ax + R() * aw), y = n1(ay + R() * ah), r = n1(1.1 + R() * 2.3);
      m += `<path d="M${x} ${y - 2 * r}L${x + r * .45} ${y - r * .45}L${x + 2 * r} ${y}L${x + r * .45} ${y + r * .45}L${x} ${y + 2 * r}L${x - r * .45} ${y + r * .45}L${x - 2 * r} ${y}L${x - r * .45} ${y - r * .45}Z" fill="#fdfaf2" opacity="${n1(.5 + R() * .5)}"/>`;
    }
    return sprite(m, [ax - 10, ay - 10, aw + 20, ah + 20], { wobble: 0 });
  }
  function cloud(s = 1, fill = P.CR, line = P.C) {
    const m = `<g transform="scale(${s})"><path d="M-62 4 C -66 -12 -50 -20 -38 -14 C -36 -34 -8 -40 2 -22 C 12 -36 40 -32 42 -14 C 58 -18 68 -4 58 4 Z" fill="${fill}" ${br(3, line)}/><path d="M-38 -14 c 8 -3 12 6 6 9 c -4 2 -7 -1 -5 -4 M2 -22 c 9 -3 14 7 7 11 c -5 2 -8 -2 -6 -5 M42 -14 c 6 0 8 6 3 8" fill="none" ${br(2.2, line)}/><path d="M-54 1 H52" stroke="${P.W}" stroke-width="4" opacity=".7"/></g>`;
    return sprite(m, [-76 * s, -48 * s, 152 * s, 62 * s], { wobble: 2.5 });
  }
  function sun(r = 34, rays = 16, core = P.Y) {
    let m = '';
    for (let i = 0; i < rays; i++) m += `<path transform="rotate(${n1(i * 360 / rays)})" d="M0 ${-r - 7} L0 ${-r - 26}" ${br(3.2)}/>`;
    m += `<circle r="${r}" fill="${P.O}" ${br(3.2)}/><circle r="${n1(r * .56)}" fill="${core}" stroke="${P.C}" stroke-width="2"/>`;
    return sprite(m, [-r - 34, -r - 34, 2 * r + 68, 2 * r + 68], { wobble: 3 });
  }
  function moon(r = 32) {
    const m = `<circle r="${r + 30}" fill="${P.L}" opacity=".35"/><circle r="${r + 14}" fill="${P.L}" opacity=".35"/><circle r="${r}" fill="#fbf8f0" ${br(3)}/><circle cx="-8" cy="-5" r="5.5" fill="${P.L}"/><circle cx="10" cy="9" r="3.6" fill="${P.L}"/><circle cx="6" cy="-12" r="2.4" fill="${P.L}"/>`;
    return sprite(m, [-r - 34, -r - 34, 2 * r + 68, 2 * r + 68], { wobble: 2 });
  }

  // ---------- Land ----------
  // La Matlalcueye (La Malinche): origin at the base center, peak 250·s above.
  function malinche(s = 1, { fill = P.W, snow = true, night = false } = {}) {
    const k = v => n1(v * s), body = `M${k(-322)} 0 C ${k(-222)} ${k(-72)} ${k(-142)} ${k(-152)} ${k(-72)} ${k(-212)} C ${k(-42)} ${k(-236)} ${k(-20)} ${k(-248)} 0 ${k(-250)} C ${k(20)} ${k(-248)} ${k(40)} ${k(-238)} ${k(68)} ${k(-218)} C ${k(138)} ${k(-166)} ${k(228)} ${k(-72)} ${k(348)} 0 Z`;
    const lit = `M0 ${k(-250)} C ${k(20)} ${k(-248)} ${k(40)} ${k(-238)} ${k(68)} ${k(-218)} C ${k(138)} ${k(-166)} ${k(228)} ${k(-72)} ${k(348)} 0 L${k(60)} 0 C ${k(48)} ${k(-90)} ${k(20)} ${k(-170)} 0 ${k(-250)}Z`;
    let m = `<path d="${body}" fill="${fill}" ${br(3.2)}/><path d="${lit}" fill="${night ? P.C2 : '#fff'}" opacity="${night ? .25 : .32}"/>`;
    for (let i = 0; i < 26; i++) m += `<path d="M${k(-142 + 6 * i)} ${k(-102 - 4 * i)} l${k(-26)} ${k(60 + i)}" stroke="${P.C}" stroke-width="1.6" opacity=".5"/>`;
    m += `<path d="M0 ${k(-246)} L${k(-17)} ${k(-132)} M0 ${k(-246)} L${k(48)} ${k(-142)} M0 ${k(-246)} L${k(128)} ${k(-102)}" stroke="${P.C}" stroke-width="2" opacity=".7"/>`;
    if (snow) m += `<path d="M${k(-72)} ${k(-212)} C ${k(-42)} ${k(-236)} ${k(-20)} ${k(-248)} 0 ${k(-250)} C ${k(20)} ${k(-248)} ${k(40)} ${k(-238)} ${k(68)} ${k(-218)} L${k(56)} ${k(-206)} L${k(44)} ${k(-210)} L${k(34)} ${k(-200)} L${k(22)} ${k(-210)} L${k(12)} ${k(-194)} L0 ${k(-204)} L${k(-12)} ${k(-194)} L${k(-22)} ${k(-208)} L${k(-34)} ${k(-200)} L${k(-44)} ${k(-210)} L${k(-58)} ${k(-204)}Z" fill="#fbf8f0" ${br(3)}/>`;
    return sprite(m, [k(-334), k(-262), k(694), k(270)], { wobble: 3.5 });
  }
  // Popocatépetl and Iztaccíhuatl far to the west. Origin at the left base.
  function volcanoes(s = 1, fill = P.L) {
    const m = `<g transform="scale(${s})"><path d="M0 0 L90 -100 L104 -104 L118 -98 L210 0Z" fill="${fill}" ${br(3)}/><path d="M90 -100 L104 -104 L118 -98 L110 -88 L102 -94 L94 -86Z" fill="#fbf8f0" ${br(2.4)}/><path d="M104 -96 c -6 -10 4 -16 0 -26 c -4 -8 4 -12 2 -18" fill="none" stroke="${P.C}" stroke-width="1.8" opacity=".6"/><path d="M190 0 C 220 -40 280 -50 330 -40 C 360 -34 380 -20 400 0Z" fill="${fill}" ${br(3)}/><path d="M250 -44 C 270 -50 300 -50 320 -42 L300 -34 L282 -40 L266 -32Z" fill="#fbf8f0" ${br(2.4)}/></g>`;
    return sprite(m, [-10, -150 * s, 420 * s, 156 * s], { wobble: 3 });
  }
  // A ridge of hills across the stage; origin at y = ridge baseline.
  function hills({ amp = 10, freq = .012, ph = 0, fill = P.L, trees = 0, treeFill = P.G, depth = 240, seed = 1, x0 = -160, x1 = 1120 } = {}) {
    const R = rnd(seed), ry = x => n1(amp * Math.sin(x * freq + ph) + amp * .35 * Math.sin(x * freq * 2.7 + ph * 2));
    let ridge = '';
    for (let x = x0; x <= x1; x += 10) ridge += `${x === x0 ? 'M' : 'L'}${x} ${ry(x)}`;
    let m = `<path d="${ridge}L${x1} ${depth}L${x0} ${depth}Z" fill="${fill}"/><path d="${ridge}" fill="none" ${br(3)}/>`;
    for (let i = 0; i < trees; i++) {
      const x = n1(x0 + 20 + (i + R() * .6) * (x1 - x0 - 40) / trees), r = n1(10 + R() * 6), y = ry(x) - r * .55;
      m += `<circle cx="${x}" cy="${n1(y)}" r="${r}" fill="${treeFill}" ${br(2.6)}/><path d="M${n1(x - r * .4)} ${n1(y - r * .2)} q ${n1(r * .3)} ${n1(-r * .4)} ${n1(r * .7)} 0" fill="none" stroke="${P.GL}" stroke-width="2"/>`;
    }
    return sprite(m, [x0 - 10, -amp * 1.5 - 30, x1 - x0 + 20, depth + amp * 1.5 + 40], { wobble: 3.5 });
  }
  // Ground band with grass strokes; origin at its top edge.
  function ground(fill = '#f3e6cc', { w0 = -160, w1 = 1120, depth = 260, seed = 2, strokes = P.G2 } = {}) {
    const R = rnd(seed); let m = `<rect x="${w0}" y="0" width="${w1 - w0}" height="${depth}" fill="${fill}"/><path d="M${w0} 0 H${w1}" ${br(3)}/>`;
    for (let i = 0; i < 70; i++) { const x = n1(w0 + R() * (w1 - w0)), y = n1(8 + R() * (depth - 20)); m += `<path d="M${x} ${y} q 3 -8 7 -10 M${n1(x + 5)} ${y} q 2 -6 0 -11" fill="none" stroke="${strokes}" stroke-width="1.8" opacity="${n1(.35 + R() * .4)}"/>`; }
    return sprite(m, [w0 - 6, -8, w1 - w0 + 12, depth + 12], { wobble: 3 });
  }

  // ---------- Plants ----------
  function cornPlant(x, y, s, { stem = P.C, leaf = P.G, cob = P.O, tassel = P.O, ripe = true } = {}) {
    return `<g transform="translate(${n1(x)} ${n1(y)}) scale(${n1(s)})"><path d="M0 0 C -1 -16 1 -30 0 -46" fill="none" stroke="${stem}" stroke-width="3.4"/><path d="M0 -12 C -10 -20 -18 -18 -22 -10 C -14 -14 -8 -12 0 -8Z M0 -22 C 10 -30 18 -28 22 -20 C 14 -24 8 -22 0 -18Z M0 -32 C -9 -40 -16 -38 -19 -31 C -12 -34 -6 -32 0 -28Z M0 -40 C 6 -46 12 -46 14 -42 C 9 -43 5 -41 0 -37Z" fill="${leaf}" stroke="${stem}" stroke-width="1.2"/>${ripe ? `<path d="M2 -20 C 6 -30 9 -30 9 -22 C 9 -16 5 -14 2 -16Z" fill="${cob}" stroke="${stem}" stroke-width="1.1"/><path d="M0 -46 l-5 -6 M0 -46 l0 -8 M0 -46 l5 -6" stroke="${tassel}" stroke-width="2.4" stroke-linecap="round"/>` : ''}</g>`;
  }
  // A row of corn from x0 to x1; origin at the row's base line.
  function cornRow(x0, x1, s, { gap = 30, seed = 4, ...colors } = {}) {
    const R = rnd(seed); let m = '';
    for (let x = x0; x <= x1; x += gap * s * (.85 + R() * .3)) m += cornPlant(x, 0, s * (.9 + R() * .2), colors);
    return sprite(m, [x0 - 30 * s, -66 * s, x1 - x0 + 60 * s, 70 * s], { wobble: 3 });
  }
  function sprout(s = 1) {
    const m = `<g transform="scale(${s})"><path d="M0 0 V-16" stroke="${P.C}" stroke-width="2.4"/><path d="M0 -8 C -8 -14 -14 -12 -16 -6 C -10 -9 -5 -8 0 -5Z M0 -12 C 8 -18 14 -16 16 -10 C 10 -13 5 -12 0 -9Z" fill="${P.G}" stroke="${P.C}" stroke-width="1.1"/></g>`;
    return sprite(m, [-20 * s, -22 * s, 40 * s, 24 * s], { wobble: 1.5 });
  }
  function maguey(s = 1, cs = [P.C, P.C2, P.G]) {
    const m = `<g transform="scale(${s})">${[-64, 64, -40, 40, -18, 18, 0].map((a, i) => `<path transform="rotate(${a})" d="M-6 0 C -6 -24 -2 -40 0 -46 C 2 -40 6 -24 6 0Z" fill="${cs[Math.min(2, Math.floor(i / 2))]}" stroke="${P.C}" stroke-width="1.6"/>`).join('')}</g>`;
    return sprite(m, [-50 * s, -50 * s, 100 * s, 54 * s], { wobble: 2 });
  }
  function reeds(s = 1, seed = 6) {
    const R = rnd(seed); let m = '';
    for (let i = 0; i < 9; i++) { const x = n1((i - 4) * 7 + R() * 4), h = n1(40 + R() * 30); m += `<path d="M${x} 0 Q ${n1(x + (R() - .5) * 10)} ${n1(-h * .6)} ${n1(x + (R() - .5) * 16)} ${-h}" fill="none" stroke="${i % 3 ? P.G : P.C}" stroke-width="2.6"/>${i % 3 === 0 ? `<ellipse cx="${n1(x + (R() - .5) * 8)}" cy="${n1(-h * .8)}" rx="2.6" ry="7" fill="${P.BR}"/>` : ''}`; }
    return sprite(`<g transform="scale(${s})">${m}</g>`, [-46 * s, -80 * s, 92 * s, 84 * s], { wobble: 1.5 });
  }

  // ---------- Buildings ----------
  function jacal(s = 1) {
    const m = `<g transform="scale(${s})"><rect x="-24" y="-30" width="48" height="30" fill="#fbf8f0" ${br(2.4)}/><path d="M-6 0 V-16 H6 V0Z" fill="${P.C}"/><path d="M-34 -28 L0 -62 L34 -28Z" fill="${P.O}" ${br(2.4)}/>${[-20, -10, 0, 10, 20].map(d => `<path d="M${d} -32 L${n1(d * .4)} -56" stroke="${P.C}" stroke-width="1.4"/>`).join('')}</g>`;
    return sprite(m, [-40 * s, -68 * s, 80 * s, 72 * s], { wobble: 2 });
  }
  function smoke() {
    return sprite(`<path d="M0 0 c -8 -12 8 -18 0 -30 c -7 -10 7 -16 2 -26" fill="none" stroke="${P.C}" stroke-width="2.4" opacity=".55"/>`, [-14, -62, 28, 66], { wobble: 1.5 });
  }
  // Teocalli: origin at the base center; shrine roof color by deity.
  function teocalli(s = 1, shrine = P.O, { wall = '#fbf8f0', shade = P.L } = {}) {
    let g = '';
    [[120, 0], [98, 1], [76, 2], [54, 3]].forEach(([w, i]) => { const ty = -(i + 1) * 15; g += `<path d="M${-w / 2} ${ty + 15} L${-(w / 2 - 6)} ${ty} L${w / 2 - 6} ${ty} L${w / 2} ${ty + 15} Z" fill="${wall}" ${br(2.6)}/><path d="M${w / 2 - 14} ${ty} L${w / 2 - 6} ${ty} L${w / 2} ${ty + 15} L${w / 2 - 12} ${ty + 15}Z" fill="${shade}"/>`; });
    g += `<path d="M-12 0 L-8 -60 L8 -60 L12 0Z" fill="${P.C}"/>`;
    for (let k = 1; k < 12; k++) g += `<path d="M${n1(-(12 - k * .35))} ${-k * 5} H${n1(12 - k * .35)}" stroke="#fbf8f0" stroke-width="1.2"/>`;
    g += `<rect x="-16" y="-82" width="32" height="22" fill="${wall}" ${br(2.6)}/><path d="M-5 -60 V-72 H5 V-60Z" fill="${P.C}"/><path d="M-20 -82 L0 -100 L20 -82Z" fill="${shrine}" ${br(2.6)}/>`;
    return sprite(`<g transform="scale(${s})">${g}</g>`, [-66 * s, -106 * s, 132 * s, 112 * s], { wobble: 2.5 });
  }
  // Templo Mayor of Tenochtitlan: twin shrines of Tláloc (blue) and Huitzilopochtli (red).
  function temploMayor(s = 1) {
    let g = '';
    [[170, 0], [146, 1], [122, 2], [98, 3]].forEach(([w, i]) => { const ty = -(i + 1) * 16; g += `<path d="M${-w / 2} ${ty + 16} L${-(w / 2 - 7)} ${ty} L${w / 2 - 7} ${ty} L${w / 2} ${ty + 16} Z" fill="#fbf8f0" ${br(2.6)}/><path d="M${w / 2 - 16} ${ty} L${w / 2 - 7} ${ty} L${w / 2} ${ty + 16} L${w / 2 - 14} ${ty + 16}Z" fill="${P.L}"/>`; });
    [-22, 22].forEach(x => { g += `<path d="M${x - 10} 0 L${x - 7} -64 L${x + 7} -64 L${x + 10} 0Z" fill="${P.C}"/>`; for (let k = 1; k < 12; k++) g += `<path d="M${n1(x - 9 + k * .25)} ${-k * 5.3} H${n1(x + 9 - k * .25)}" stroke="#fbf8f0" stroke-width="1.2"/>`; });
    g += `<rect x="-44" y="-88" width="34" height="24" fill="#fbf8f0" ${br(2.6)}/><path d="M-48 -88 L-27 -108 L-6 -88Z" fill="${P.C2}" ${br(2.6)}/><path d="M-40 -94 H-14 M-36 -100 H-18" stroke="#fbf8f0" stroke-width="2"/>`;
    g += `<rect x="10" y="-88" width="34" height="24" fill="#fbf8f0" ${br(2.6)}/><path d="M6 -88 L27 -108 L48 -88Z" fill="${P.R}" ${br(2.6)}/>${[16, 27, 38].map(x => `<circle cx="${x}" cy="-93" r="2.2" fill="#fbf8f0"/>`).join('')}`;
    return sprite(`<g transform="scale(${s})">${g}</g>`, [-92 * s, -114 * s, 184 * s, 120 * s], { wobble: 2.5 });
  }
  // Island city: rows of white houses on a platform; origin at the platform's left top.
  function city(w = 420, seed = 8) {
    const R = rnd(seed); let m = `<path d="M-14 0 H${w + 14} L${w + 4} 10 H-4Z" fill="${P.O}" ${br(2.4)}/>`;
    for (let x = 0; x < w; x += 20 + R() * 10) { const h = n1(12 + R() * 14); m += `<rect x="${n1(x)}" y="${-h}" width="${n1(16 + R() * 6)}" height="${h}" fill="#fbf8f0" ${br(2)}/>`; if (R() < .4) m += `<rect x="${n1(x + 5)}" y="${n1(-h + 4)}" width="5" height="6" fill="${P.C}"/>`; }
    return sprite(m, [-20, -32, w + 40, 46], { wobble: 2 });
  }
  // The frontier wall; origin at the top of the wall, x across the stage.
  function wall(seed = 3) {
    let m = '';
    for (let x = -160; x < 1130; x += 48) m += `<path d="M${x} 0 h44 v-12 h-12 v-10 h-20 v10 h-12Z" fill="#fbf8f0" ${br(2.4)}/>`;
    for (let r = 0; r < 6; r++) for (let x = -170 + (r % 2) * 24; x < 1130; x += 48) m += `<rect x="${x}" y="${r * 20}" width="46" height="20" rx="3" fill="${r % 2 ? P.L : '#fbf8f0'}" ${br(1.8)}/>`;
    return sprite(m, [-176, -26, 1312, 150], { wobble: 2.5 });
  }
  function torchPole() { return sprite(`<path d="M0 0 V-56" ${br(4.4)}/><path d="M-7 -56 h14 l-3 6 h-8Z" fill="${P.O}" ${br(2)}/>`, [-10, -60, 20, 64], { wobble: 1 }); }
  function flame(s = 1) {
    const m = `<g transform="scale(${s})"><path d="M0 0 c -12 -8 -8 -22 0 -34 c 2 10 10 12 6 24 c 6 -4 6 -10 4 -14 c 8 10 4 22 -10 24Z" fill="${P.OR}" ${br(2)}/><path d="M0 -6 c -4 -4 -2 -12 1 -16 c 2 6 5 9 2 16Z" fill="${P.Y}"/></g>`;
    return sprite(m, [-16 * s, -38 * s, 32 * s, 40 * s], { wobble: 1 });
  }
  function heronShape(up) {
    return up ? 'M-26 -8 C -16 -14 -6 -12 0 0 C 6 -12 16 -14 26 -8 C 16 -8 8 -4 2 4 L14 6 L2 7 C -4 4 -14 -6 -26 -8 Z'
      : 'M-26 8 C -16 2 -6 -2 0 0 C 6 -2 16 2 26 8 C 16 4 8 2 2 4 L14 6 L2 7 C -4 5 -14 4 -26 8 Z';
  }
  function heron(up = true, s = 1) {
    return sprite(`<path transform="scale(${s})" d="${heronShape(up)}" fill="#fbf8f0" ${br(2.6 / s)}/>`, [-30 * s, -18 * s, 60 * s, 32 * s], { wobble: 1 });
  }
  // Garza standard of Tlaxcallan on its pole; origin at the pole base.
  function banner(s = 1) {
    const m = `<g transform="scale(${s})"><path d="M0 0 V-120" ${br(5)}/><circle cx="0" cy="-130" r="20" fill="${P.O}" ${br(3)}/><path transform="translate(0 -132) scale(.55)" d="${heronShape(true)}" fill="#fbf8f0" ${br(4)}/>${[P.G, P.C2, P.R, P.C2, P.G].map((c, i) => `<path transform="rotate(${(i - 2) * 22} 0 -130)" d="M0 -150 C -5 -162 -3 -172 0 -178 C 3 -172 5 -162 0 -150Z" fill="${c}" stroke="${P.C}" stroke-width="1.6"/>`).join('')}</g>`;
    return sprite(m, [-40 * s, -186 * s, 80 * s, 192 * s], { wobble: 2 });
  }

  // ---------- Water ----------
  function waterLines(w = 1440, h = 160, seed = 9, color = P.C, period = 240) {
    const R = rnd(seed); let m = '';
    for (let i = 0; i < 22; i++) { const y = n1(4 + R() * (h - 8)), x = R() * period, len = n1(40 + R() * 110); for (let k = -1; k < w / period + 1; k++) m += `<rect x="${n1(x + k * period)}" y="${y}" width="${len}" height="3" rx="1.5" fill="${color}" opacity="${n1(.25 + R() * .35)}"/>`; }
    return sprite(m, [0, 0, w, h], { wobble: 1 });
  }
  function canoe(s = 1) {
    const m = `<g transform="scale(${s})"><path d="M-30 0 C -20 8 20 8 30 0Z" fill="${P.C}"/><path d="M-4 0 V-16" ${br(2.6)}/><circle cx="-4" cy="-20" r="4.5" fill="${P.C}"/><path d="M4 -10 L20 6" ${br(2.4)}/></g>`;
    return sprite(m, [-34 * s, -28 * s, 68 * s, 38 * s], { wobble: 1 });
  }
  function ship() {
    const m = `<path d="M-110 0 L110 0 L84 34 L-90 34Z" fill="${P.C}" stroke="#fbf8f0" stroke-width="2"/><path d="M-122 -8 L-100 0 M110 0 L128 -16" stroke="#fbf8f0" stroke-width="3"/>${[[-50, 110], [10, 150], [66, 100]].map(([x, h]) => `<path d="M${x} 0 V${-h}" stroke="#fbf8f0" stroke-width="3"/>${[0, 1].map(k => `<path d="M${x - 30 + k * 4} ${-h + 18 + k * 46} h${60 - k * 8} v40 h${-60 + k * 8}Z" fill="#fbf8f0" ${br(2)}/><path d="M${x} ${-h + 28 + k * 46} v20 M${x - 10} ${-h + 38 + k * 46} h20" stroke="${P.R}" stroke-width="4"/>`).join('')}`).join('')}<path d="M10 -150 l18 6 l-18 6Z" fill="${P.R}"/><path d="M-96 18 H84" stroke="#fbf8f0" stroke-width="1.6" stroke-dasharray="4 8"/>`;
    return sprite(m, [-134, -162, 268, 204], { wobble: 2.5 });
  }
  function fog(w = 520, h = 34) {
    return sprite(`<rect x="0" y="0" width="${w}" height="${h}" rx="${h / 2}" fill="#e9edf6" opacity=".85"/><rect x="${w * .15}" y="${h * .25}" width="${w * .6}" height="${h * .5}" rx="${h / 4}" fill="#fff" opacity=".6"/>`, [-10, -10, w + 20, h + 20], { wobble: 6 });
  }
  function shore(fill = P.CD) {
    return sprite(`<path d="M-160 40 C 0 18 160 14 330 30 C 420 38 470 60 500 80 L500 240 L-160 240Z" fill="${fill}" stroke="#fbf8f0" stroke-width="2"/>`, [-166, 10, 672, 236], { wobble: 3 });
  }
  function campfire() { return sprite(`<path d="M-16 0 L12 -6 M-12 -6 L16 0" ${br(5, P.BR)}/><ellipse cx="0" cy="2" rx="20" ry="4" fill="${P.C}" opacity=".5"/>`, [-24, -12, 48, 18], { wobble: 1 }); }

  // ---------- Story props ----------
  function footprint(left = true) {
    const m = `<g transform="scale(${left ? -1 : 1} 1)"><path d="M0 0 c -4 -9 6 -13 8 -5 c 1 5 -2 9 -8 5Z" fill="${P.C}"/><circle cx="1" cy="-10" r="1.6" fill="${P.C}"/><circle cx="5" cy="-11" r="1.4" fill="${P.C}"/></g>`;
    return sprite(m, [-12, -14, 24, 18], { wobble: 0 });
  }
  function conchBlower(s = 1) {
    const m = `<g transform="scale(${s})"><circle cx="0" cy="-38" r="6" fill="${P.C}"/><path d="M-6 -30 L-8 -8 L-4 0 M6 -30 L6 -8 L8 0 M-6 -30 H6" ${br(4 / s)}/><path d="M4 -32 L14 -40" ${br(3 / s)}/><path d="M12 -44 c 8 -4 14 0 12 6 c -2 5 -9 6 -12 2Z" fill="#fbf8f0" ${br(2 / s)}/></g>`;
    return sprite(m, [-14 * s, -52 * s, 44 * s, 56 * s], { wobble: 1 });
  }
  function virgula(s = 1) {
    return sprite(`<g transform="scale(${s})"><path d="M0 0 c 10 -2 14 -12 6 -16 c -6 -2 -9 4 -4 7" fill="none" stroke="${P.C}" stroke-width="2.6" stroke-linecap="round"/></g>`, [-6 * s, -20 * s, 24 * s, 24 * s], { wobble: 0 });
  }

  // ---------- Talavera icons (inline SVG, 64×64) ----------
  const O = `stroke="${P.C}" stroke-width="2.6" stroke-linejoin="round"`;
  const ICON = {
    sal: `<path d="M10 40 C 10 54 54 54 54 40Z" fill="${P.O}" ${O}/><path d="M14 40 L22 26 L28 32 L34 20 L42 30 L46 26 L50 40Z" fill="#fff" ${O}/><path d="M24 34 l3 -3 M36 30 l2 3" stroke="${P.L}" stroke-width="2"/>`,
    algodon: `<path d="M32 58 V40" stroke="${P.G}" stroke-width="3"/><path d="M20 44 C 24 40 28 40 32 44 C 36 40 40 40 44 44" fill="${P.G}" ${O}/>${[[24, 30], [40, 30], [32, 22], [32, 36]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#fff" ${O}/>`).join('')}`,
    cacao: `<path d="M32 6 C 50 14 50 50 32 58 C 14 50 14 14 32 6Z" fill="#a8521e" ${O}/><path d="M32 10 V54 M24 14 C 20 28 20 40 24 50 M40 14 C 44 28 44 40 40 50" fill="none" stroke="#5a2a10" stroke-width="2"/>`,
    milpa: `<path d="M32 58 V14" stroke="${P.C}" stroke-width="3"/><path d="M32 46 C 20 40 12 42 8 48 C 18 44 24 46 32 50Z M32 34 C 44 28 52 30 56 36 C 46 32 40 34 32 38Z M32 24 C 22 18 16 20 14 24 C 22 22 26 24 32 28Z" fill="${P.G}" ${O}/><path d="M34 34 C 40 22 44 24 42 32 C 41 37 37 38 34 36Z" fill="${P.Y}" ${O}/><path d="M32 14 l-5 -7 M32 14 v-9 M32 14 l5 -7" stroke="${P.O}" stroke-width="2.6" stroke-linecap="round"/>`,
    choza: `<rect x="16" y="32" width="32" height="22" fill="#fff" ${O}/><path d="M28 54 V42 H36 V54Z" fill="${P.C}"/><path d="M8 34 L32 10 L56 34Z" fill="${P.O}" ${O}/><path d="M20 30 L27 17 M32 30 V14 M44 30 L37 17" stroke="${P.C}" stroke-width="1.6"/>`,
    semillas: `<path d="M14 24 C 14 16 50 16 50 24 L46 56 H18Z" fill="#e8d4a8" ${O}/><path d="M14 24 C 22 30 42 30 50 24" fill="none" ${O}/>${[[26, 40, P.C2], [36, 38, P.Y], [31, 47, P.R], [40, 47, P.Y], [23, 49, P.C2]].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="4" ry="3" fill="${c}" stroke="${P.C}" stroke-width="1.2"/>`).join('')}`,
    coa: `<path d="M14 54 L48 10" stroke="${P.C}" stroke-width="8" stroke-linecap="round"/><path d="M14 54 L48 10" stroke="${P.BR}" stroke-width="4.4" stroke-linecap="round"/><path d="M6 50 C 4 58 8 62 16 60 L22 52 L12 44Z" fill="${P.L}" ${O}/>`,
    escudo: `<circle cx="32" cy="28" r="20" fill="#fff" ${O}/><circle cx="32" cy="28" r="13" fill="${P.C2}" ${O}/><path d="M19 28 H45 M32 15 V41" stroke="#fff" stroke-width="3"/><circle cx="32" cy="28" r="4.4" fill="${P.Y}" ${O}/>${[20, 28, 36, 44].map((x, i) => `<path d="M${x} 46 l-3 13 h6Z" fill="${[P.G, P.R, P.Y, P.G][i]}" ${O}/>`).join('')}`,
    copal: `<path d="M18 36 H46 L42 54 H22Z" fill="${P.O}" ${O}/><path d="M14 36 H50" ${O}/><path d="M26 32 c -6 -8 6 -12 0 -20 M34 32 c -6 -8 6 -12 0 -20 M42 32 c -5 -6 4 -10 0 -16" fill="none" stroke="${P.C}" stroke-width="2.4" stroke-linecap="round" opacity=".75"/>`,
    xochitl: `${[0, 90, 180, 270].map(a => `<ellipse cx="32" cy="17" rx="9" ry="12" transform="rotate(${a} 32 32)" fill="${P.R}" ${O}/>`).join('')}${[45, 135, 225, 315].map(a => `<ellipse cx="32" cy="19" rx="5" ry="8" transform="rotate(${a} 32 32)" fill="${P.Y}" ${O}/>`).join('')}<circle cx="32" cy="32" r="7" fill="${P.Y}" ${O}/><circle cx="32" cy="32" r="3" fill="${P.C}"/>`,
    huehuetl: `<path d="M18 14 H46 L42 50 L36 44 L32 52 L28 44 L22 50Z" fill="${P.O}" ${O}/><ellipse cx="32" cy="14" rx="14" ry="5" fill="#fff" ${O}/><path d="M20 26 H44 M21 34 H43" stroke="${P.C}" stroke-width="2"/><path d="M24 30 l4 -4 l4 4 l4 -4 l4 4" fill="none" stroke="${P.R}" stroke-width="2"/>`,
  };
  const icon = k => `<svg viewBox="0 0 64 64" aria-hidden="true">${ICON[k]}</svg>`;

  window.CdmArt = { P, rnd, sprite, sky, stars, cloud, sun, moon, malinche, volcanoes, hills, ground, cornPlant, cornRow, sprout, maguey, reeds, jacal, smoke, teocalli, temploMayor, city, wall, torchPole, flame, heron, banner, waterLines, canoe, ship, fog, shore, campfire, footprint, conchBlower, virgula, icon };
})();
