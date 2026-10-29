// Four title-landscape options for Tlaxcallan (960×540 SVG), none photoreal:
// plano (flat geometric), papel (layered paper cut), lienzo (Lienzo de Tlaxcala
// codex) and talavera (cobalt mural painted on tiles). All show La Malinche,
// a teocalli, the milpa, magueyes and white herons — Tlaxcallan in 1519.
"use strict";
(function () {
  const rnd = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const svg = (defs, body) => `<svg class="scene" viewBox="0 0 960 540" preserveAspectRatio="xMidYMid slice"><defs>${defs}</defs>${body}</svg>`;
  const wave = (y0, amp, f, ph, bottom = 560) => { let d = `M-10 ${bottom}L-10 ${y0}`; for (let x = -10; x <= 970; x += 10) d += `L${x} ${(y0 + Math.sin(x * f + ph) * amp + Math.sin(x * f * 2.7 + ph * 2) * amp * .35).toFixed(1)}`; return d + `L970 ${bottom}Z`; };
  const MAL = 'M150 432 C 250 360 330 280 400 220 C 430 196 452 184 472 182 C 492 184 512 194 540 214 C 610 266 700 360 820 432 Z';

  // Stepped temple (teocalli) with shrine on top. c: colors {a: tier, b: tier shade, s: stairs, r: shrine roof, w: shrine wall}.
  function teocalli(x, y, s, c, stroke = '') {
    let g = '';
    [[120, 0], [98, 1], [76, 2], [54, 3]].forEach(([w, i]) => { const ty = y - (i + 1) * 15 * s; g += `<path d="M${x - w / 2 * s} ${ty + 15 * s} L${x - (w / 2 - 6) * s} ${ty} L${x + (w / 2 - 6) * s} ${ty} L${x + w / 2 * s} ${ty + 15 * s} Z" fill="${c.a}" ${stroke}/><path d="M${x + (w / 2 - 14) * s} ${ty} L${x + (w / 2 - 6) * s} ${ty} L${x + w / 2 * s} ${ty + 15 * s} L${x + (w / 2 - 12) * s} ${ty + 15 * s}Z" fill="${c.b}"/>`; });
    g += `<path d="M${x - 12 * s} ${y} L${x - 8 * s} ${y - 60 * s} L${x + 8 * s} ${y - 60 * s} L${x + 12 * s} ${y}Z" fill="${c.s}" ${stroke}/>`;
    for (let k = 1; k < 12; k++) g += `<path d="M${x - (12 - k * .35) * s} ${y - k * 5 * s} H${x + (12 - k * .35) * s}" stroke="${c.b}" stroke-width="${1.2 * s}"/>`;
    const ty = y - 60 * s;
    g += `<rect x="${x - 16 * s}" y="${ty - 22 * s}" width="${32 * s}" height="${22 * s}" fill="${c.w}" ${stroke}/><path d="M${x - 5 * s} ${ty} V${ty - 12 * s} H${x + 5 * s} V${ty}Z" fill="#2a1a14"/>`;
    g += `<path d="M${x - 20 * s} ${ty - 22 * s} L${x} ${ty - 40 * s} L${x + 20 * s} ${ty - 22 * s}Z" fill="${c.r}" ${stroke}/>`;
    for (let k = -1; k <= 1; k++) g += `<circle cx="${x + k * 7 * s}" cy="${ty - 26 * s}" r="${1.6 * s}" fill="#f6efe0"/>`;
    return g;
  }
  const corn = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-46" stroke="${c.stem}" stroke-width="3.4"/><path d="M0 -12 C -10 -20 -18 -18 -22 -10 C -14 -14 -8 -12 0 -8Z M0 -22 C 10 -30 18 -28 22 -20 C 14 -24 8 -22 0 -18Z M0 -32 C -9 -40 -16 -38 -19 -31 C -12 -34 -6 -32 0 -28Z" fill="${c.leaf}"/>${c.cob ? `<ellipse cx="4" cy="-24" rx="3" ry="7" fill="${c.cob}" transform="rotate(15 4 -24)"/>` : ''}<path d="M0 -46 l-5 -6 M0 -46 l0 -8 M0 -46 l5 -6" stroke="${c.tas}" stroke-width="2.4" stroke-linecap="round"/></g>`;
  const agave = (x, y, s, cs, stroke = '') => `<g transform="translate(${x} ${y}) scale(${s})">${[-64, 64, -40, 40, -18, 18, 0].map((a, i) => `<path transform="rotate(${a})" d="M-6 0 C -6 -24 -2 -40 0 -46 C 2 -40 6 -24 6 0Z" fill="${cs[Math.min(2, Math.floor(i / 2))]}" ${stroke}/>`).join('')}</g>`;
  const heron = (x, y, s, fill, stroke = 'none', sw = 0) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-26 -8 C -16 -14 -6 -12 0 0 C 6 -12 16 -14 26 -8 C 16 -8 8 -4 2 4 L14 6 L2 7 C -4 4 -14 -6 -26 -8 Z" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  const milpa = (c, R, area = [[420, .7, 520], [450, .86, 470], [482, 1, 430], [516, 1.16, 400]]) => area.map(([y, s, x1], r) => { let g = ''; for (let x = 6 + (r % 2) * 16; x < x1; x += 30 * s + R() * 6) g += corn(x, y, s, c); return g; }).join('');
  // Tlaxcalteca standard: white heron on a gold disc over a pole.
  const banner = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-120" stroke="#5a3a22" stroke-width="5"/><circle cx="0" cy="-130" r="20" fill="#e9b33e" stroke="#7a4a14" stroke-width="3"/>${heron(0, -132, .55, '#fffaf0', '#3a2418', 2)}${['#2f8f8a', '#7cb04a', '#c0392b', '#7cb04a', '#2f8f8a'].map((c, i) => `<path transform="rotate(${(i - 2) * 22} 0 -130)" d="M0 -150 C -5 -162 -3 -172 0 -178 C 3 -172 5 -162 0 -150Z" fill="${c}"/>`).join('')}</g>`;

  // ---------- 1 · Plano geométrico ----------
  function plano() {
    const R = rnd(8);
    const defs = `<linearGradient id="p-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241c4a"/><stop offset=".32" stop-color="#4c2f6a"/><stop offset=".58" stop-color="#b4506a"/><stop offset=".76" stop-color="#ef8f58"/><stop offset=".9" stop-color="#f8cf84"/></linearGradient>`;
    const stars = Array.from({ length: 50 }, () => `<circle cx="${R() * 960}" cy="${R() * 140}" r="${.8 + R()}" fill="#fff" opacity="${.3 + R() * .5}"/>`).join('');
    const body = `<rect width="960" height="540" fill="url(#p-sky)"/>${stars}
      ${[150, 110, 80].map((r, i) => `<circle cx="790" cy="330" r="${r}" fill="#ffd890" opacity="${.12 + i * .08}"/>`).join('')}<circle cx="790" cy="330" r="46" fill="#fff1c8"/>
      ${[[90, 150, 160], [620, 110, 200], [380, 70, 110], [840, 200, 130]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="16" rx="8" fill="#e08a8a" opacity=".5"/><rect x="${x + w * .2}" y="${y - 10}" width="${w * .5}" height="14" rx="7" fill="#e08a8a" opacity=".45"/>`).join('')}
      <path d="M-10 420 L110 296 L132 290 L150 298 L280 420Z" fill="#7c5a8e"/><path d="M132 290 L150 298 L280 420 L170 420Z" fill="#9a76a8"/><path d="M110 296 L132 290 L150 298 L140 312 L128 304 L118 314Z" fill="#f4e8f2"/>
      <path d="${MAL}" fill="#4b3874"/><path d="M472 182 C 492 184 512 194 540 214 C 610 266 700 360 820 432 L530 432 C 520 330 500 250 472 182Z" fill="#6c4f90"/>
      <path d="M472 182 L430 330 L380 432 M472 182 L560 300 L680 432" stroke="#3e2c64" stroke-width="3" fill="none" opacity=".45"/>
      <path d="M400 220 C 430 196 452 184 472 182 C 492 184 512 194 540 214 L520 222 L506 236 L492 222 L478 242 L464 220 L450 236 L436 222 L418 234 Z" fill="#cfc0dc"/><path d="M472 182 C 492 184 512 194 540 214 L520 222 L506 236 L492 222 L478 242 L472 230Z" fill="#fbeef4"/>
      <path d="M-10 412 Q 240 376 480 404 T 970 394 V540 H-10Z" fill="#3f7a3a"/>
      ${Array.from({ length: 22 }, (_, i) => `<circle cx="${20 + i * 44 + R() * 10}" cy="${398 + Math.sin(i) * 6}" r="${12 + R() * 6}" fill="#2f5e2e"/>`).join('')}
      ${teocalli(790, 412, 1, { a: '#e6d2a8', b: '#c8ae80', s: '#b8432f', r: '#3a6a3a', w: '#f2e8d4' })}
      <path d="M-10 442 Q 300 420 560 438 T 970 432 V540 H-10Z" fill="#4f9a3e"/>
      <path d="M560 540 C 600 500 640 470 690 452 L708 452 C 670 474 640 508 620 540Z" fill="#d8b07a"/>
      <g transform="translate(640 452)"><rect x="-10" y="-46" width="110" height="46" fill="#e8c69a"/><rect x="72" y="-46" width="28" height="46" fill="#d4ad7c"/><path d="M-20 -44 L110 -44 L80 -82 L10 -82Z" fill="#c8a050"/><path d="M-20 -44 L110 -44 L104 -50 L-14 -50Z" fill="#a8823a"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${-14 + i * 14} -46 L${12 + i * 8} -80" stroke="#a8823a" stroke-width="1.6"/>`).join('')}<rect x="36" y="-30" width="18" height="30" fill="#5a3a24"/></g>
      ${milpa({ stem: '#3f7a2e', leaf: '#5fa040', cob: '#f2c94c', tas: '#e9b33e' }, R)}
      ${agave(470, 540, 1.2, ['#2f5a4e', '#3f7a68', '#5a9a84'])}${agave(770, 528, .9, ['#2f5a4e', '#3f7a68', '#5a9a84'])}${agave(910, 540, 1.3, ['#2f5a4e', '#3f7a68', '#5a9a84'])}
      ${banner(560, 470, .8)}
      ${heron(300, 120, .9, '#fffaf0')}${heron(340, 140, .7, '#fffaf0')}${heron(270, 150, .6, '#fffaf0')}`;
    return svg(defs, body);
  }

  // ---------- 2 · Papel recortado ----------
  function papel() {
    const R = rnd(14);
    const defs = `<linearGradient id="q-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a2f6e"/><stop offset=".45" stop-color="#d0607a"/><stop offset=".8" stop-color="#f6b07a"/></linearGradient>
      <filter id="q-ds" x="-5%" y="-10%" width="110%" height="130%"><feDropShadow dx="0" dy="4" stdDeviation="3.5" flood-color="#2a1030" flood-opacity=".5"/></filter>
      <filter id="q-gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .4 0 0 0 0 .3 0 0 0 0 .2 0 0 0 -1.6 .9"/><feComponentTransfer><feFuncA type="linear" slope=".35"/></feComponentTransfer></filter>`;
    const cornRow = (y, s, x1, col) => { let d = ''; for (let x = 0; x < x1; x += 26 * s + R() * 5) d += corn(x, y, s, { stem: col, leaf: col, tas: col }); return `<g filter="url(#q-ds)"><path d="${wave(y - 4, 3, .04, 1)}" fill="${col}"/>${d}</g>`; };
    const body = `<rect width="960" height="540" fill="url(#q-sky)"/>
      <g filter="url(#q-ds)">${[120, 90, 64, 44].map((r, i) => `<circle cx="770" cy="300" r="${r}" fill="${['#f9c07a', '#fbd08a', '#fde0a2', '#fff1cc'][i]}"/>`).join('')}</g>
      <g filter="url(#q-ds)">${[[130, 130, 120], [560, 90, 150], [330, 180, 90]].map(([x, y, w]) => `<path d="M${x} ${y} a${w * .25} ${w * .25} 0 0 1 ${w * .4} -${w * .12} a${w * .3} ${w * .3} 0 0 1 ${w * .6} ${w * .12} Z" fill="#f6c2b8"/>`).join('')}</g>
      <g filter="url(#q-ds)"><path d="M-10 420 C 60 360 110 300 140 290 C 170 300 230 360 330 420Z" fill="#b0789a"/><path d="M118 300 C 128 292 152 290 162 298 L150 312 L140 304 L128 312Z" fill="#fbeef4"/></g>
      <g filter="url(#q-ds)"><path d="${MAL}" fill="#7a4a86"/></g>
      <g filter="url(#q-ds)"><path d="M400 220 C 430 196 452 184 472 182 C 492 184 512 194 540 214 C 528 226 516 222 506 232 C 494 222 484 238 472 228 C 460 238 450 224 438 232 C 428 222 414 228 400 220Z" fill="#fbeef4"/></g>
      <g filter="url(#q-ds)"><path d="${wave(400, 8, .012, 1)}" fill="#5a3f7a"/></g>
      <g filter="url(#q-ds)"><path d="${wave(424, 10, .016, 2)}" fill="#3e6e5a"/>${teocalli(780, 424, 1, { a: '#3e6e5a', b: '#335c4a', s: '#335c4a', r: '#c0392b', w: '#3e6e5a' })}</g>
      ${cornRow(468, .9, 560, '#2f5a48')}${cornRow(506, 1.05, 520, '#24463a')}
      <g filter="url(#q-ds)"><path d="${wave(520, 6, .02, 3)}" fill="#183028"/>${agave(700, 540, 1.4, ['#183028', '#183028', '#183028'])}${agave(880, 540, 1.7, ['#183028', '#183028', '#183028'])}${banner(610, 520, .8).replace(/#[0-9a-f]{6}/gi, m => m.toLowerCase() === '#fffaf0' ? m : '#183028')}</g>
      <g filter="url(#q-ds)">${heron(300, 110, 1, '#fffaf0')}${heron(350, 132, .8, '#fffaf0')}${heron(260, 140, .7, '#fffaf0')}</g>
      <rect width="960" height="540" filter="url(#q-gr)"/>`;
    return svg(defs, body);
  }

  // ---------- 3 · Lienzo de Tlaxcala ----------
  function lienzo() {
    const R = rnd(21), K = '#2a1a10', ink = `stroke="${K}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"`;
    const glosa = (x, y, t, s = 17) => `<text x="${x}" y="${y}" font-family="Alegreya, serif" font-style="italic" font-size="${s}" fill="#5a3418">${t}</text>`;
    const spiral = (x, y, s) => `<path d="M${x} ${y} c 0 ${-10 * s} ${15 * s} ${-10 * s} ${15 * s} 0 c 0 ${7 * s} ${-9 * s} ${7 * s} ${-9 * s} ${2 * s}" fill="none" ${ink}/>`;
    const foot = (x, y, a) => `<path transform="rotate(${a} ${x} ${y})" d="M${x} ${y} c -4 -10 6 -14 9 -6 c 2 6 -2 12 -9 6Z" fill="${K}"/>`;
    const plant = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-90" ${ink}/>${[[-20, 1], [-40, -1], [-60, 1]].map(([yy, d]) => `<path d="M0 ${yy} C ${d * 20} ${yy - 22} ${d * 34} ${yy - 14} ${d * 38} ${yy + 4} C ${d * 26} ${yy - 4} ${d * 14} ${yy - 4} 0 ${yy + 6}Z" fill="#7aa45a" ${ink}/>`).join('')}<path d="M8 -50 C 2 -64 6 -76 14 -80 C 22 -76 24 -64 18 -50Z" fill="#e9b33e" ${ink}/><path d="M0 -90 l-8 -12 M0 -90 l0 -14 M0 -90 l8 -12" ${ink}/></g>`;
    const stains = Array.from({ length: 30 }, () => `<ellipse cx="${R() * 960}" cy="${R() * 540}" rx="${20 + R() * 70}" ry="${10 + R() * 40}" fill="#b8925a" opacity="${.05 + R() * .08}"/>`).join('');
    const defs = `<filter id="l-gr" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".7 .9" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 .45 0 0 0 0 .35 0 0 0 0 .2 0 0 0 -1.8 1"/><feComponentTransfer><feFuncA type="linear" slope=".45"/></feComponentTransfer></filter>
      <filter id="l-wob" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>`;
    const body = `<rect width="960" height="540" fill="#ecdfc0"/>${stains}
      <g filter="url(#l-wob)">
        <rect x="14" y="14" width="932" height="512" fill="none" ${ink}/><rect x="22" y="22" width="916" height="496" fill="none" stroke="${K}" stroke-width="1.4"/>
        <g transform="translate(830 92)"><circle r="30" fill="#e9b33e" ${ink}/><circle r="16" fill="#c0392b" ${ink}/>${Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 45})" d="M-8 -32 L0 -50 L8 -32Z" fill="#e9b33e" ${ink}/>`).join('')}</g>
        <g transform="translate(470 0)"><path d="M-170 430 C -170 320 -110 196 0 188 C 110 196 170 320 170 430 Z" fill="#7aa45a" ${ink}/>
          <path d="M-160 350 C -100 332 100 332 160 350 C 166 380 170 410 170 430 L-170 430 C -170 410 -166 380 -160 350Z" fill="#4f86b8" ${ink}/>
          ${Array.from({ length: 6 }, (_, i) => spiral(-140 + i * 50, 398, 1.1)).join('')}
          ${[[-60, 260], [10, 230], [62, 290], [-24, 306], [100, 320], [-104, 316]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#c8e0a0" ${ink}/>`).join('')}
          <path d="M-28 196 C -18 172 18 172 28 196" fill="#f6efe0" ${ink}/>
          <rect x="-180" y="426" width="360" height="20" fill="#e9b33e" ${ink}/>${Array.from({ length: 9 }, (_, i) => `<rect x="${-172 + i * 40}" y="430" width="20" height="12" fill="#c0392b"/>`).join('')}</g>
        ${glosa(390, 178, 'matlalcueye')}
        ${teocalli(780, 446, 1.1, { a: '#f6efe0', b: '#d8c8a8', s: '#c0392b', r: '#c0392b', w: '#f6efe0' }, ink)}
        <path d="M780 300 c -10 -14 10 -22 0 -36 c -8 -12 8 -20 2 -30" fill="none" ${ink}/>
        ${glosa(728, 474, 'tlaxcallan · ocotelulco')}
        ${plant(90, 470, 1.2)}${plant(150, 480, .9)}${plant(210, 474, 1.05)}
        <path d="M30 500 C 200 488 360 520 520 500 C 680 482 800 512 930 498" stroke="#4f86b8" stroke-width="16" fill="none"/><path d="M30 500 C 200 488 360 520 520 500 C 680 482 800 512 930 498" stroke="${K}" stroke-width="2" fill="none" transform="translate(0 -9)"/><path d="M30 500 C 200 488 360 520 520 500 C 680 482 800 512 930 498" stroke="${K}" stroke-width="2" fill="none" transform="translate(0 9)"/>
        ${Array.from({ length: 14 }, (_, i) => `<circle cx="${50 + i * 64}" cy="${500 + Math.sin(i) * 6}" r="3" fill="#f6efe0" stroke="${K}" stroke-width="1.4"/>`).join('')}
        ${glosa(600, 530, 'atoyac', 14)}
        ${Array.from({ length: 10 }, (_, i) => foot(250 + i * 44, 470 - i * 4 + (i % 2) * 8, 80)).join('')}
        ${heron(250, 110, 1.2, '#fffaf0', K, 2.4)}${heron(310, 136, .9, '#fffaf0', K, 2.4)}
        <g transform="translate(660 486)"><path d="M0 0 C -2 -20 6 -34 18 -40 L28 -62 L24 -40 C 30 -30 28 -10 18 0Z" fill="#fffaf0" ${ink}/><path d="M6 0 V20 M14 0 V20" ${ink}/><circle cx="25" cy="-58" r="1.6" fill="${K}"/></g>
        ${glosa(40, 236, 'Tlaxcallan, año 1-ácatl', 20)}
      </g>
      <rect width="960" height="540" filter="url(#l-gr)"/>`;
    return svg(defs, body);
  }

  // ---------- 4 · Mural de Talavera ----------
  function talavera() {
    const R = rnd(31), C = '#1b3a8a', W = '#9fb4e0', O = '#d39a26', G = '#3d7a46';
    const br = `stroke="${C}" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round"`;
    const defs = `<filter id="t-br" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="9"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter>
      <pattern id="t-grid" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="url(#t-gl)"/><path d="M0 0.75 H60 M0.75 0 V60" stroke="#c9bfa8" stroke-width="1.5"/></pattern>
      <radialGradient id="t-gl" cx=".3" cy=".25" r=".9"><stop offset="0" stop-color="#fff" stop-opacity=".35"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#5a4a30" stop-opacity=".08"/></radialGradient>`;
    const hatch = Array.from({ length: 26 }, (_, i) => { const x = 330 + i * 6; return `<path d="M${x} ${330 - i * 4} l-26 ${60 + i}" stroke="${C}" stroke-width="1.6" opacity=".55"/>`; }).join('');
    const sky = Array.from({ length: 12 }, (_, i) => `<rect x="${R() * 700}" y="${30 + i * 13}" width="${120 + R() * 200}" height="7" rx="3.5" fill="${C}" opacity="${.08 + (12 - i) * .02}"/>`).join('');
    const clouds = [[140, 140], [600, 110], [380, 70]].map(([x, y]) => `<path d="M${x} ${y} a18 18 0 0 1 30 -14 a24 24 0 0 1 44 0 a18 18 0 0 1 30 14 Z" fill="#f6f1e6" ${br}/>`).join('');
    const body = `<rect width="960" height="540" fill="#f6f1e6"/>
      <g filter="url(#t-br)">${sky}${clouds}
        <g transform="translate(150 96) scale(.8)">${Array.from({ length: 16 }, (_, i) => `<path transform="rotate(${i * 22.5})" d="M0 -46 L0 -70" ${br}/>`).join('')}<circle r="40" fill="${O}" ${br}/><circle r="22" fill="#f2c94c" stroke="${C}" stroke-width="2"/></g>
        <path d="M-10 420 C 60 360 110 300 140 290 C 170 300 230 360 330 420Z" fill="${W}" opacity=".7" ${br}/>
        <path d="${MAL}" fill="${W}" ${br}/>${hatch}
        <path d="M400 220 C 430 196 452 184 472 182 C 492 184 512 194 540 214 C 528 226 516 222 506 232 C 494 222 484 238 472 228 C 460 238 450 224 438 232 C 428 222 414 228 400 220Z" fill="#fbf8f0" ${br}/>
        <path d="M472 186 L455 300 M472 186 L520 290 M472 186 L600 330" stroke="${C}" stroke-width="2" opacity=".7"/>
        <path d="${wave(408, 8, .014, 1)}" fill="#c8d4ee" ${br}/>
        ${Array.from({ length: 20 }, (_, i) => `<circle cx="${20 + i * 48}" cy="${404 + Math.sin(i) * 6}" r="${12}" fill="${G}" opacity=".85" ${br}/>`).join('')}
        ${teocalli(790, 432, 1, { a: '#fbf8f0', b: '#c8d4ee', s: C, r: O, w: '#fbf8f0' }, br)}
        <path d="${wave(440, 6, .02, 2)}" fill="#e6ecf8" ${br}/>
        ${milpa({ stem: C, leaf: G, cob: O, tas: O }, R, [[470, .8, 540], [500, .95, 500], [532, 1.1, 460]])}
        ${agave(640, 540, 1.3, [C, '#2f56b4', G], `stroke="${C}" stroke-width="1.6"`)}${agave(900, 540, 1.6, [C, '#2f56b4', G], `stroke="${C}" stroke-width="1.6"`)}
        ${heron(300, 120, 1, '#fbf8f0', C, 2.6)}${heron(350, 142, .8, '#fbf8f0', C, 2.6)}
      </g>
      <rect width="960" height="540" fill="url(#t-grid)"/>`;
    return svg(defs, body);
  }

  window.TlaxScenes = { plano, papel, lienzo, talavera };
})();
