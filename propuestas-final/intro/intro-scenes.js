// Intro cinematic for Corazón de Maíz: seven scenes painted as Talavera murals
// (cobalt brushwork, ochre and green, on glazed tiles with grout). 960×540 SVG.
// Each returns { svg, figs } — figs are Borgia characters placed over the mural.
"use strict";
(function () {
  const C = '#1b3a8a', C2 = '#2f56b4', W = '#9fb4e0', L = '#c8d4ee', L2 = '#e6ecf8', O = '#d39a26', Y = '#f2c94c', G = '#3d7a46', R = '#b8402e', BG = '#f6f1e6';
  const rnd = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const br = (w = 3.2) => `stroke="${C}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const wave = (y0, amp, f, ph, bottom = 560) => { let d = `M-10 ${bottom}L-10 ${y0}`; for (let x = -10; x <= 970; x += 10) d += `L${x} ${(y0 + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.7 + ph * 2) * amp * .35).toFixed(1)}`; return d + `L970 ${bottom}Z`; };
  // Wraps a scene: brush wobble filter, tile grid with glaze on top.
  function mural(id, body, sky = BG) {
    return `<svg class="mural" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice"><defs>
      <filter id="${id}b" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter>
      <radialGradient id="${id}g" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#5a4a30" stop-opacity=".08"/></radialGradient>
      <pattern id="${id}t" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="url(#${id}g)"/><path d="M0 .75H60M.75 0V60" stroke="#c9bfa8" stroke-width="1.5"/></pattern></defs>
      <rect width="960" height="540" fill="${sky}"/><g filter="url(#${id}b)">${body}</g><rect width="960" height="540" fill="url(#${id}t)"/></svg>`;
  }
  const skyStrokes = (R0, n, col, y0 = 30, op = .5) => Array.from({ length: n }, (_, i) => `<rect x="${R0() * 760}" y="${y0 + i * 13}" width="${120 + R0() * 220}" height="7" rx="3.5" fill="${col}" opacity="${.08 + (n - i) / n * op * .4}"/>`).join('');
  const sun = (x, y, r, rays = 16) => `<g transform="translate(${x} ${y})">${Array.from({ length: rays }, (_, i) => `<path transform="rotate(${i * 360 / rays})" d="M0 ${-r - 6} L0 ${-r - 26}" ${br()}/>`).join('')}<circle r="${r}" fill="${O}" ${br()}/><circle r="${r * .55}" fill="${Y}" stroke="${C}" stroke-width="2"/></g>`;
  const moon = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r + 26}" fill="${L}" opacity=".5"/><circle cx="${x}" cy="${y}" r="${r}" fill="#fbf8f0" ${br()}/><circle cx="${x - 8}" cy="${y - 4}" r="5" fill="${L}"/><circle cx="${x + 9}" cy="${y + 8}" r="3.5" fill="${L}"/>`;
  const MAL = (dx = 0, s = 1) => `M${150 * s + dx} 432 C ${250 * s + dx} 360 ${330 * s + dx} 280 ${400 * s + dx} 220 C ${430 * s + dx} 196 ${452 * s + dx} 184 ${472 * s + dx} 182 C ${492 * s + dx} 184 ${512 * s + dx} 194 ${540 * s + dx} 214 C ${610 * s + dx} 266 ${700 * s + dx} 360 ${820 * s + dx} 432 Z`;
  function malinche(dx = 0) {
    const hatch = Array.from({ length: 26 }, (_, i) => `<path d="M${330 + dx + i * 6} ${330 - i * 4} l-26 ${60 + i}" stroke="${C}" stroke-width="1.6" opacity=".55"/>`).join('');
    return `<path d="${MAL(dx)}" fill="${W}" ${br()}/>${hatch}
      <path d="M${400 + dx} 220 C ${430 + dx} 196 ${452 + dx} 184 ${472 + dx} 182 C ${492 + dx} 184 ${512 + dx} 194 ${540 + dx} 214 C ${528 + dx} 226 ${516 + dx} 222 ${506 + dx} 232 C ${494 + dx} 222 ${484 + dx} 238 ${472 + dx} 228 C ${460 + dx} 238 ${450 + dx} 224 ${438 + dx} 232 C ${428 + dx} 222 ${414 + dx} 228 ${400 + dx} 220Z" fill="#fbf8f0" ${br()}/>
      <path d="M${472 + dx} 186 L${455 + dx} 300 M${472 + dx} 186 L${520 + dx} 290 M${472 + dx} 186 L${600 + dx} 330" stroke="${C}" stroke-width="2" opacity=".7"/>`;
  }
  const volcanoes = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 120 L90 20 L104 16 L118 22 L210 120Z" fill="${L}" ${br()}/><path d="M90 20 L104 16 L118 22 L110 32 L102 26 L94 34Z" fill="#fbf8f0" ${br(2.4)}/><path d="M190 120 C 220 80 280 70 330 80 C 360 86 380 100 400 120Z" fill="${L}" ${br()}/><path d="M250 76 C 270 70 300 70 320 78 L300 86 L282 80 L266 88Z" fill="#fbf8f0" ${br(2.4)}/></g>`;
  const heron = (x, y, s) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-26 -8 C -16 -14 -6 -12 0 0 C 6 -12 16 -14 26 -8 C 16 -8 8 -4 2 4 L14 6 L2 7 C -4 4 -14 -6 -26 -8 Z" fill="#fbf8f0" ${br(2.6 / s)}/>`;
  const corn = (x, y, s, ripe = true) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-46" stroke="${C}" stroke-width="3.4"/><path d="M0 -12 C -10 -20 -18 -18 -22 -10 C -14 -14 -8 -12 0 -8Z M0 -22 C 10 -30 18 -28 22 -20 C 14 -24 8 -22 0 -18Z M0 -32 C -9 -40 -16 -38 -19 -31 C -12 -34 -6 -32 0 -28Z" fill="${G}" stroke="${C}" stroke-width="1.2"/>${ripe ? `<ellipse cx="4" cy="-24" rx="3" ry="7" fill="${O}" transform="rotate(15 4 -24)"/><path d="M0 -46 l-5 -6 M0 -46 l0 -8 M0 -46 l5 -6" stroke="${O}" stroke-width="2.4" stroke-linecap="round"/>` : ''}</g>`;
  const sprout = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-16" stroke="${C}" stroke-width="2.4"/><path d="M0 -8 C -8 -14 -14 -12 -16 -6 C -10 -9 -5 -8 0 -5Z M0 -12 C 8 -18 14 -16 16 -10 C 10 -13 5 -12 0 -9Z" fill="${G}" stroke="${C}" stroke-width="1"/></g>`;
  const agave = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})">${[-64, 64, -40, 40, -18, 18, 0].map((a, i) => `<path transform="rotate(${a})" d="M-6 0 C -6 -24 -2 -40 0 -46 C 2 -40 6 -24 6 0Z" fill="${[C, C2, G][Math.min(2, Math.floor(i / 2))]}" stroke="${C}" stroke-width="1.6"/>`).join('')}</g>`;
  const jacal = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-24" y="-30" width="48" height="30" fill="#fbf8f0" ${br(2.4)}/><path d="M-10 0 V-16 H10 V0Z" fill="${C}"/><path d="M-34 -28 L0 -62 L34 -28Z" fill="${O}" ${br(2.4)}/>${[-20, -10, 0, 10, 20].map(d => `<path d="M${d} -32 L${d * .4} -56" stroke="${C}" stroke-width="1.4"/>`).join('')}</g>`;
  const smoke = (x, y) => `<path d="M${x} ${y} c -8 -12 8 -18 0 -30 c -7 -10 7 -16 2 -26" fill="none" stroke="${C}" stroke-width="2.2" opacity=".6"/>`;
  function teocalli(x, y, s, shrine = O) {
    let g = '';
    [[120, 0], [98, 1], [76, 2], [54, 3]].forEach(([w, i]) => { const ty = y - (i + 1) * 15 * s; g += `<path d="M${x - w / 2 * s} ${ty + 15 * s} L${x - (w / 2 - 6) * s} ${ty} L${x + (w / 2 - 6) * s} ${ty} L${x + w / 2 * s} ${ty + 15 * s} Z" fill="#fbf8f0" ${br(2.6)}/><path d="M${x + (w / 2 - 14) * s} ${ty} L${x + (w / 2 - 6) * s} ${ty} L${x + w / 2 * s} ${ty + 15 * s} L${x + (w / 2 - 12) * s} ${ty + 15 * s}Z" fill="${L}"/>`; });
    g += `<path d="M${x - 12 * s} ${y} L${x - 8 * s} ${y - 60 * s} L${x + 8 * s} ${y - 60 * s} L${x + 12 * s} ${y}Z" fill="${C}"/>`;
    for (let k = 1; k < 12; k++) g += `<path d="M${x - (12 - k * .35) * s} ${y - k * 5 * s} H${x + (12 - k * .35) * s}" stroke="#fbf8f0" stroke-width="${1.2 * s}"/>`;
    const ty = y - 60 * s;
    g += `<rect x="${x - 16 * s}" y="${ty - 22 * s}" width="${32 * s}" height="${22 * s}" fill="#fbf8f0" ${br(2.6)}/><path d="M${x - 5 * s} ${ty} V${ty - 12 * s} H${x + 5 * s} V${ty}Z" fill="${C}"/><path d="M${x - 20 * s} ${ty - 22 * s} L${x} ${ty - 40 * s} L${x + 20 * s} ${ty - 22 * s}Z" fill="${shrine}" ${br(2.6)}/>`;
    return g;
  }
  const banner = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-120" ${br(5)}/><circle cx="0" cy="-130" r="20" fill="${O}" ${br(3)}/>${heron(0, -132, .55)}${[G, C2, R, C2, G].map((c, i) => `<path transform="rotate(${(i - 2) * 22} 0 -130)" d="M0 -150 C -5 -162 -3 -172 0 -178 C 3 -172 5 -162 0 -150Z" fill="${c}" stroke="${C}" stroke-width="1.6"/>`).join('')}</g>`;
  const torch = (x, y) => `<path d="M${x} ${y} V${y - 50}" ${br(4)}/><path d="M${x} ${y - 50} c -12 -8 -8 -22 0 -34 c 2 10 10 12 6 24 c 6 -4 6 -10 4 -14 c 8 10 4 22 -10 24Z" fill="${O}" ${br(2)}/><path d="M${x} ${y - 56} c -4 -4 -2 -10 1 -14 c 2 6 4 8 2 14Z" fill="${Y}"/>`;

  // Guards and villagers: Borgia params reused for background figures (painted cobalt by CSS).
  const guard = (i) => ({ id: 'g' + i, name: 'Guerrero', skin: '#a8683a', hair: '#1a1210', hairStyle: ['coleta', 'largo', 'trenzas'][i % 3], style: 'armadura', top: '#efe3c8', trim: '#2f5fa8', skirt: '#1e3c78', head: i % 2 ? 'plumas' : 'pluma', prop: i % 2 ? 'escudo' : 'lanza', shield: '#2f5fa8' });

  // ---------- 1 · El valle ----------
  function valle() {
    const R0 = rnd(3); let huts = '';
    [[150, 444, .8], [230, 452, .7], [330, 448, .75], [600, 450, .7], [690, 444, .8], [780, 452, .7]].forEach(([x, y, s]) => { huts += jacal(x, y, s) + smoke(x + 6, y - 50 * s); });
    return mural('a', `${skyStrokes(R0, 12, C, 26)}${sun(640, 196, 34)}
      ${volcanoes(-30, 300, 1.1)}${malinche()}
      <path d="${wave(410, 8, .014, 1)}" fill="${L}" ${br()}/>${Array.from({ length: 22 }, (_, i) => `<circle cx="${10 + i * 46}" cy="${404 + Math.sin(i) * 6}" r="12" fill="${G}" opacity=".85" ${br()}/>`).join('')}
      <path d="${wave(446, 6, .02, 2)}" fill="${L2}" ${br()}/>${huts}
      ${Array.from({ length: 34 }, (_, i) => corn(10 + i * 29, 520 + (i % 2) * 8, .9)).join('')}
      ${heron(300, 130, 1)}${heron(350, 152, .8)}${heron(262, 160, .65)}`);
  }

  // ---------- 2 · Tenochtitlan ----------
  function tenochtitlan() {
    const R0 = rnd(5), lake = Array.from({ length: 24 }, (_, i) => `<rect x="${R0() * 860}" y="${372 + i * 7}" width="${60 + R0() * 160}" height="3" rx="1.5" fill="${C}" opacity="${.25 + R0() * .3}"/>`).join('');
    const glints = Array.from({ length: 9 }, (_, i) => `<rect x="${150 + (i % 3) * 12 - i * 2}" y="${380 + i * 12}" width="${60 - i * 4}" height="3" rx="1.5" fill="${O}" opacity=".8"/>`).join('');
    const city = `${Array.from({ length: 14 }, (_, i) => `<rect x="${470 + i * 26}" y="${352 - (i % 3) * 6}" width="22" height="${16 + (i % 3) * 6}" fill="#fbf8f0" ${br(2)}/>`).join('')}
      <path d="M440 372 H880 L870 380 H450Z" fill="${O}" ${br(2.4)}/>${teocalli(660, 352, 1.15, R)}<rect x="644" y="252" width="14" height="14" fill="${C}"/><rect x="664" y="252" width="14" height="14" fill="${R}"/>${teocalli(540, 360, .55)}${teocalli(800, 360, .55)}`;
    const canoe = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0 C -20 8 20 8 30 0Z" fill="${C}"/><path d="M-4 0 V-16 M-4 -16 a5 5 0 1 0 0.1 0 M6 -6 L20 6" ${br(2.4)}/></g>`;
    return mural('b', `${skyStrokes(R0, 14, O, 40, .7)}${sun(170, 300, 30, 14)}
      <path d="M-10 340 C 80 300 160 290 260 316 C 330 280 420 270 500 300 C 600 272 720 280 820 304 C 880 290 930 296 970 306 V372 H-10Z" fill="${L}" ${br()}/>
      <rect x="-10" y="366" width="980" height="180" fill="${L2}"/>${lake}${glints}
      <path d="M200 520 L470 378 M960 470 L860 378" stroke="${O}" stroke-width="6"/><path d="M200 520 L470 378 M960 470 L860 378" stroke="${C}" stroke-width="1.6" stroke-dasharray="4 8"/>
      ${city}${canoe(120, 470, 1.3)}${canoe(360, 500, 1.1)}${canoe(760, 450, .9)}`);
  }

  // ---------- 3 · El cerco ----------
  function cerco() {
    const R0 = rnd(7); let wall = '';
    for (let x = -10; x < 970; x += 48) wall += `<path d="M${x} 330 h44 v-12 h-12 v-10 h-20 v10 h-12Z" fill="#fbf8f0" ${br(2.4)}/>`;
    for (let r = 0; r < 6; r++) for (let x = -20 + (r % 2) * 24; x < 970; x += 48) wall += `<rect x="${x}" y="${330 + r * 20}" width="46" height="20" rx="3" fill="${r % 2 ? L : '#fbf8f0'}" ${br(1.8)}/>`;
    return mural('c', `${skyStrokes(R0, 16, R, 20, .9)}${sun(480, 250, 52, 20)}
      <path d="M-10 330 C 100 290 180 300 260 316 L340 300 L420 320 L520 296 L640 318 L760 300 L860 320 L970 304 V340 H-10Z" fill="${L}" ${br()}/>
      ${wall}${torch(60, 330)}${torch(900, 330)}<rect x="-10" y="450" width="980" height="100" fill="${C}" opacity=".85"/>`, '#f1e4dc');
  }

  // ---------- 4 · Tu milpa ----------
  function milpa() {
    const R0 = rnd(11); let rows = '';
    for (let r = 0; r < 5; r++) { const y = 420 + r * 26; rows += `<path d="M-10 ${y + 4} H970" stroke="${C}" stroke-width="1.6" opacity=".6"/>`; for (let x = 20 + (r % 2) * 20; x < 960; x += 44 + r * 4) rows += sprout(x, y, .8 + r * .12); }
    return mural('d', `${skyStrokes(R0, 8, C, 30, .4)}${sun(820, 110, 30)}
      ${malinche(-230)}<path d="${wave(392, 10, .012, .5)}" fill="${G}" opacity=".85" ${br()}/>
      <rect x="-10" y="400" width="980" height="150" fill="#f3e6cc"/>${rows}
      ${jacal(760, 404, 1.6)}${agave(900, 412, 1.1)}${agave(80, 410, .8)}`);
  }

  // ---------- 5 · Xicohténcatl ----------
  function tlatoani() {
    const R0 = rnd(13);
    return mural('e', `${skyStrokes(R0, 12, C, 20, .6)}
      <path d="M-10 360 C 120 330 240 340 360 320 C 480 300 640 330 760 318 C 860 310 920 322 970 318 V420 H-10Z" fill="${L}" ${br()}/>
      <rect x="-10" y="410" width="980" height="140" fill="#f3e6cc"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${i * 84}" y="${430 + (i % 2) * 30}" width="70" height="4" rx="2" fill="${O}" opacity=".5"/>`).join('')}
      ${teocalli(480, 430, 2.2, G)}${banner(200, 440, 1.1)}${banner(760, 440, 1.1)}`);
  }

  // ---------- 6 · Casas que flotan ----------
  function barco() {
    const R0 = rnd(17), stars = Array.from({ length: 40 }, () => `<circle cx="${R0() * 960}" cy="${R0() * 260}" r="${1 + R0() * 1.4}" fill="${L}"/>`).join('');
    const waves = Array.from({ length: 30 }, (_, i) => `<path d="M${R0() * 940} ${340 + i * 7} q 10 -6 20 0 q 10 -6 20 0" fill="none" stroke="${L}" stroke-width="2" opacity=".8"/>`).join('');
    const ship = `<g transform="translate(470 330)"><path d="M-110 0 L110 0 L84 34 L-90 34Z" fill="${C}" stroke="#fbf8f0" stroke-width="2"/><path d="M-120 -6 L-100 0 M110 0 L126 -14" stroke="#fbf8f0" stroke-width="3"/>
      ${[[-50, 110], [10, 150], [66, 100]].map(([x, h]) => `<path d="M${x} 0 V${-h}" stroke="#fbf8f0" stroke-width="3"/>${[0, 1].map(k => `<path d="M${x - 30 + k * 4} ${-h + 18 + k * 46} h${60 - k * 8} v40 h${-60 + k * 8}Z" fill="#fbf8f0" ${br(2)}/><path d="M${x} ${-h + 28 + k * 46} v20 M${x - 10} ${-h + 38 + k * 46} h20" stroke="${R}" stroke-width="4"/>`).join('')}`).join('')}
      <path d="M10 -150 l18 6 l-18 6Z" fill="${R}"/></g>`;
    return mural('f', `<rect width="960" height="330" fill="#22356e"/>${stars}${moon(780, 110, 34)}
      <rect y="330" width="960" height="220" fill="#2f4a8a"/>${waves}<path d="M700 360 h120" stroke="${L}" stroke-width="3" opacity=".9"/>${ship}
      <path d="M-10 470 C 120 448 260 452 380 470 V560 H-10Z" fill="${C}" stroke="#fbf8f0" stroke-width="2"/>`, '#22356e');
  }

  // ---------- 7 · Amanecer: título ----------
  function amanecer() {
    const R0 = rnd(19);
    return mural('h', `${skyStrokes(R0, 12, O, 30, .8)}${sun(480, 300, 46, 20)}
      ${volcanoes(40, 300, 1.25)}${malinche(150)}
      <path d="${wave(424, 8, .016, 2)}" fill="${L2}" ${br()}/>${Array.from({ length: 34 }, (_, i) => corn(10 + i * 29, 530 + (i % 2) * 6, 1)).join('')}
      ${heron(220, 120, 1.1)}${heron(270, 140, .8)}`);
  }

  // figs: [param or cast index, x%, bottom%, height%, painted?] — painted = cobalt background figure.
  const SCENES = [
    { scene: valle, year: 'Año 1-Ácatl · 1519', text: 'Año 1 Caña. En el valle, a la sombra de la Matlalcueye, vive un pueblo que nunca se ha rendido: el señorío libre de Tlaxcallan.', figs: [] },
    { scene: tenochtitlan, year: 'Al poniente', text: 'Al poniente, Tenochtitlan brilla sobre su lago. Los mexicas cobran tributo a todos los pueblos de la tierra… a todos, menos a nosotros.', figs: [] },
    { scene: cerco, year: 'La frontera', text: 'Por eso nos tienen cercados: sin sal, sin algodón, sin cacao. Cada año vienen por guerreros para sus altares. Pero Tlaxcallan resiste.', figs: [0, 1, 2, 3, 4, 5].map(i => [guard(i), 8 + i * 16.8, 21, 30, true]) },
    { scene: milpa, year: 'Tu herencia', text: 'Tu padre te dejó una milpa pequeña al pie del monte, una choza, unas semillas y una coa. Es poco… pero es tuyo.', figs: [['PLAYER', 46, 21, 42, false]] },
    { scene: tlatoani, year: 'Tizatlán', text: 'El tlatoani Xicohténcatl busca gente valiente: quien dé de comer a los guerreros, quien cuide la frontera, quien se gane un nombre.', figs: [[{ id: 'xico', name: 'Xicohténcatl', skin: '#9a6a44', hair: '#e8e2d8', hairStyle: 'largo', style: 'huipil', top: '#f6efe0', trim: '#b8402e', band2: '#b8402e', skirt: '#f6efe0', hem: '#b8402e', head: 'plumas', jade: true, orejeras: true, prop: 'lanza' }, 49, 38, 26, false], [guard(0), 12, 21, 28, true], [guard(1), 24, 21, 28, true], [guard(2), 74, 21, 28, true], [guard(3), 86, 21, 28, true]] },
    { scene: barco, year: 'El mar del oriente', text: 'Y dicen los ancianos que en el mar del oriente se han visto casas que flotan, con hombres de barba y de piel pálida…', figs: [[guard(5), 8, 21, 24, true], [{ id: 'anc', name: 'Anciano', skin: '#9a6a44', hair: '#e8e2d8', hairStyle: 'chongo', style: 'quech', top: '#7a8a3a', trim: '#e9b33e', skirt: '#5a4a2a' }, 20, 21, 22, true]] },
    { scene: amanecer, year: 'Tu historia', text: 'Los dioses te miran. Las mujeres del valle esperan conocerte. Tu historia empieza al amanecer.', title: true, figs: [4, 5, 8, 9, 12, 14].map((c, i) => [c, [8, 20, 32, 68, 80, 92][i], 21, 28, false]) },
  ];

  window.TlaxIntro = { SCENES, sun };
})();
