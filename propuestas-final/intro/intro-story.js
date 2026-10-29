// Corazón de Maíz · intro storyboard. Eleven chapters laid over the theme song:
// chapter cuts land on song beats and story moments land on the sung lines
// (herons on "va la garza", sprouts on "siembra la milpa", the ship on "vienen
// casas sobre el mar", the path on "Tlaxcallan abre sus caminos"…).
// Times are seconds into the song; builders turn them into chapter-relative delays.
"use strict";
(function () {
  const A = window.CdmArt, F = window.TlaxFigs4, { CAST, PLAYER } = window.TlaxChars, P = A.P;

  // Beat grid of the song (librosa beat tracking, ~92 BPM) for beat-synced pulses.
  const BEATS = [0.3,1.09,1.72,2.35,3,3.67,4.32,4.97,5.64,6.29,6.92,7.57,8.22,8.87,9.54,10.22,10.87,11.49,12.19,12.82,13.47,14.1,14.74,15.37,16.02,16.67,17.32,17.97,18.62,19.25,19.9,20.55,21.2,21.83,22.52,23.17,23.82,24.45,25.1,25.73,26.38,27,27.66,28.28,28.93,29.56,30.19,30.84,31.46,32.09,32.76,33.39,34.04,34.67,35.32,35.97,36.59,37.24,37.87,38.52,39.17,39.82,40.45,41.1,41.75,42.4,43.05,43.68,44.33,44.95,45.6,46.23,46.88,47.53,48.16,48.78,49.44,50.06,50.71,51.34,51.99,52.64,53.31,53.96,54.61,55.26,55.91,56.56,57.21,57.84,58.51,59.16,59.81,60.47,61.12,61.77,62.41,63.06,63.72,64.39,65.04,65.69,66.34,66.99,67.64,68.29,68.94,69.59,70.24,70.91,71.54,72.19,72.84,73.47,74.12,74.77,75.42,76.07,76.74,77.39,78.04,78.67,79.32,79.95,80.62,81.27,81.92,82.59,83.24,83.89,84.52,85.19,85.82,86.47,87.12,87.77,88.42,89.07,89.72,90.35,91,91.65,92.32,92.95,93.6,94.27,94.92,95.57,96.22,96.87,97.52,98.17,98.8,99.47,100.1,100.73,101.38,102,102.66,103.28,103.93,104.56,105.19,105.81,106.46,107.09,107.74,108.37,109.02,109.67,110.32,110.94,111.59,112.25,112.87,113.52,114.15,114.8,115.45,116.1,116.75,117.4,118.03,118.65,119.3,119.95,120.58,121.21,121.86,122.53,123.18,123.83,124.46,125.11,125.76,126.39,127.04,127.69,128.34,128.99,129.61,130.26,130.91,131.54,132.19,132.84,133.49,134.14,134.77,135.4,136.05,136.7,137.35,138,138.62,139.27,139.9,140.55,141.2,141.85,142.5,143.13,143.78,144.43,145.08,145.71,146.35,147.01,147.66,148.26,148.91,149.56,150.21,150.84,151.49,152.14,152.76,153.41,154.06,154.69,155.34,155.99,156.64,157.29,157.92,158.57,159.2,159.85,160.5,161.12,161.77,162.4,163.05,163.7,164.35,164.98,165.63,166.25,166.88,167.51,168.16,168.79,169.44,170.06,170.71,171.34,171.99,172.64,173.27,173.92,174.57,175.19,175.84,176.47,177.12,177.75,178.4,179.03,179.68,180.3,180.95,181.6,182.23,182.88,183.51,184.13,184.76,185.41,186.06,186.71,187.34,187.99,188.62,189.24,189.89,190.52,191.17,191.82,192.45,193.07,193.72,194.37,195,195.65,196.28,196.91,197.56,198.18,198.86,199.51,200.16,200.81,201.43,202.08,202.71,203.36,203.99,204.64,205.26,205.91,206.54,207.19,207.84,208.47,209.1,209.72];

  // ---------- Placement helpers ----------
  // An animation shorthand: name, start (chapter seconds), duration…
  const an = (name, at, dur = .7, ease = 'ease-out', fill = 'both', iter = 1, dir = 'normal') => `${name} ${dur}s ${ease} ${(+at).toFixed(2)}s ${iter} ${dir} ${fill}`;
  const loop = (name, dur, ph = 0, ease = 'ease-in-out', dir = 'alternate') => `${name} ${dur}s ${ease} ${(-ph).toFixed(2)}s infinite ${dir}`;
  // Places a sprite with its local origin at (x, y). o.anim animates the wrapper, o.loop the image.
  function put(s, x, y, o = {}) {
    const [bx, by, bw, bh] = s.box;
    return `<div class="it${o.cls ? ' ' + o.cls : ''}" style="left:${(x + bx).toFixed(1)}px;top:${(y + by).toFixed(1)}px;width:${bw}px;height:${bh}px;${o.origin ? `transform-origin:${o.origin};` : ''}${o.anim ? `animation:${o.anim};` : ''}${o.vars || ''}"><img alt="" src="${s.url}" style="${o.loop ? `animation:${o.loop};` : ''}${o.lorigin ? `transform-origin:${o.lorigin};` : ''}"></div>`;
  }
  // Borgia figure with its feet at (x, feetY), h px tall.
  function fig(p, x, feetY, h, o = {}) {
    const w = h * 144 / 238, left = x - w * 68 / 144, top = feetY - h * 234 / 238;
    const svg = o.flip ? `<div class="flip">${F.borgia(p)}</div>` : F.borgia(p);
    return `<div class="it fig${o.paint ? ' paint' : ''}${o.dim ? ' dim' : ''}" style="left:${left.toFixed(1)}px;top:${top.toFixed(1)}px;width:${w.toFixed(1)}px;height:${h}px;${o.anim ? `animation:${o.anim};` : ''}${o.vars || ''}"><div class="figi" style="${o.loop ? `animation:${o.loop};` : ''}">${svg}</div></div>`;
  }
  const html = (markup, o = {}) => `<div class="it ${o.cls || ''}" style="${o.style || ''}${o.anim ? `animation:${o.anim};` : ''}${o.vars || ''}">${markup}</div>`;

  // Logo: a heart of criollo maize kernels between two husk leaves. With t0 the
  // leaves unfold and the kernels pop in from the tip up.
  function heart(id, t0) {
    const pal = ['#f2c94c', '#f2c94c', '#f2c94c', '#e9a83a', '#c0392b', '#3d63b8', '#f6efe0', '#f2c94c', '#7a2a6a'], ks = [];
    let n = 0;
    for (let r = 0, y = 28; y < 96; y += 7, r++) for (let x = 18 + (r % 2) * 4; x < 104; x += 8) ks.push([x, y, pal[(n++ * 7 + r * 3) % pal.length]]);
    const order = ks.map((k, i) => [Math.hypot(k[0] - 60, (k[1] - 92) * 1.3), i]).sort((a, b) => a[0] - b[0]).map(([, i], rank) => [i, rank]);
    const rank = []; order.forEach(([i, r]) => { rank[i] = r; });
    const anim = (name, at, dur = .5, ease = 'cubic-bezier(.2,1.4,.4,1)') => t0 == null ? '' : ` style="animation:${an(name, t0 + at, dur, ease)}"`;
    const kern = ks.map(([x, y, c], i) => `<ellipse class="k" cx="${x}" cy="${y}" rx="3.6" ry="3.1" fill="${c}" stroke="#1a1410" stroke-width="1"${anim('kpop', .3 + rank[i] * .0055, .32)}/>`).join('');
    return `<svg class="heart" viewBox="0 0 120 110" aria-hidden="true"><g class="lf lf--l"${anim('leaf', 0, .7)}><path d="M60 104 C 20 92 2 60 18 30 C 26 14 44 8 50 26" fill="#7cb04a" stroke="#1a1410" stroke-width="3.4"/></g><g class="lf lf--r"${anim('leaf', .08, .7)}><path d="M60 104 C 100 92 118 60 102 30 C 94 14 76 8 70 26" fill="#5fa040" stroke="#1a1410" stroke-width="3.4"/></g><g class="hb"${anim('kpop', .12, .5)}><path d="M60 96 C 30 78 16 58 20 40 C 24 24 44 18 60 34 C 76 18 96 24 100 40 C 104 58 90 78 60 96 Z" fill="#e9b33e" stroke="#1a1410" stroke-width="4"/></g><clipPath id="${id}"><path d="M60 92 C 32 76 20 58 23 41 C 27 27 44 22 60 38 C 76 22 93 27 97 41 C 100 58 88 76 60 92 Z"/></clipPath><g clip-path="url(#${id})">${kern}</g><g class="silk"${anim('fadeIn', 1.1, .6, 'ease-out')}><path d="M60 34 C 58 18 64 6 72 2" stroke="#e9b33e" stroke-width="3" fill="none"/><path d="M60 34 C 54 20 46 12 38 10" stroke="#d39a26" stroke-width="2.4" fill="none"/></g></svg>`;
  }
  function titleCard(id, t0, extra = '') {
    return `<div class="tc${extra}"><div class="tc__h pulse">${heart(id, t0)}</div><div class="tc__n" style="animation:${an('titleIn', t0 + .35, 1.1, 'cubic-bezier(.2,.8,.2,1)')}"><span class="tc__w" style="animation:${an('shine', t0 + 1.5, 1.6, 'ease-in-out', 'both')}">Corazón de Maíz</span></div><div class="tc__s" style="animation:${an('riseIn', t0 + 2.2, .9)}">Tlaxcallan · año 1-Ácatl · 1519</div></div>`;
  }
  // Talavera medallion with an icon; an optional red X is painted over it (the blockade).
  function roundel(icon, x, y, at, out, cross) {
    return html(`<div class="rd">${A.icon(icon)}${cross != null ? `<svg class="rd__x" viewBox="0 0 64 64"><path d="M12 12 L52 52 M52 12 L12 52" style="animation:${an('xdraw', cross, .45, 'ease-in')}"/></svg>` : ''}</div>`,
      { cls: 'rdw', style: `left:${x - 46}px;top:${y - 46}px;`, anim: `${an('popIn', at, .55, 'cubic-bezier(.2,1.5,.4,1)')}, ${an('popOut', out, .5, 'ease-in', 'forwards')}` });
  }
  const sum = (...a) => a.join('');

  // ---------- Reusable pieces ----------
  const clouds = (seed, list) => list.map(([x, y, s, dx, dur]) => put(A.cloud(s), x, y, { anim: an('drift', 0, dur, 'linear'), vars: `--dx:${dx}px;` })).join('');
  const herons = (at, y0, dur = 7) => [[-60, y0, 1.4], [-120, y0 + 30, 1.12], [-170, y0 - 18, .92]].map(([x, y, s], i) => html(
    `<img alt="" class="flapA" src="${A.heron(true, s).url}" style="animation:${loop('flapA', .52, i * .17, 'steps(1)', 'normal')}"><img alt="" class="flapB" src="${A.heron(false, s).url}" style="animation:${loop('flapB', .52, i * .17, 'steps(1)', 'normal')}">`,
    { cls: 'heron', style: `left:${x - 30 * s}px;top:${y - 18 * s}px;width:${60 * s}px;height:${32 * s}px;`, anim: an('fly', at + i * .35, dur, 'linear'), vars: `--dx:${1160 + i * 40}px;--dy:${-30 + i * 12}px;` })).join('');
  const village = (list) => list.map(([x, y, s], i) => put(A.jacal(s), x, y) + put(A.smoke(), x + 8 * s, y - 56 * s, { loop: loop('smoke', 3.4, i * .9, 'ease-out', 'normal'), lorigin: '50% 100%' })).join('');
  const segs = (x0, x1, n, s, y, o) => Array.from({ length: n }, (_, i) => {
    const a = x0 + (x1 - x0) * i / n - 20, b = x0 + (x1 - x0) * (i + 1) / n + 20;
    return put(A.cornRow(a, b, s, { seed: 11 + i * 3 + Math.round(s * 10), gap: o.gap || 28, ...(o.colors || {}) }), 0, y, {
      loop: `${loop('sway', o.sway || 3.4, i * .45 + (o.ph || 0))}${o.gust != null ? `, ${an('gust', o.gust + i * .16, 1.5, 'ease-in-out', 'none')}` : ''}`, lorigin: '50% 100%' });
  }).join('');
  const cornNight = { colors: { stem: '#14285e', leaf: '#2a4486', cob: P.O, tassel: P.O } };
  const valley = (y, opts = {}) => sum(
    put(A.volcanoes(.9, opts.far || P.L), -40, y - 18, {}),
    put(A.malinche(opts.ms || 1.05, { fill: opts.mal || P.W, night: opts.night }), opts.mx || 470, y));

  // ---------- Chapters ----------
  // Each build gets T(abs) → chapter seconds, returns planes from back to front.
  const CH = [
    { t0: 0, label: '', cam: [0, 0, 0, .05, '50% 38%'], build: T => ({
      sky: sum(put(A.sky('predawn', 3), 0, 0), put(A.sky('dawn', 4), 0, 0, { anim: an('fadeIn', T(9), 12, 'linear') }),
        put(A.stars(5, 80), 0, 0, { anim: an('fadeOut', T(10), 8, 'linear', 'both'), loop: loop('twinkle', 2.6) }),
        put(A.sprite('<circle r="300" fill="url(#fl)"/>', [-300, -300, 600, 600], { wobble: 0, defs: '<radialGradient id="fl"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".95"/><stop offset=".45" stop-color="#f7b878" stop-opacity=".45"/><stop offset="1" stop-color="#f7b878" stop-opacity="0"/></radialGradient>' }), 480, 300, { anim: an('fadeIn', T(8), 12, 'ease-in-out') })),
      far: valley(402, { mal: '#7f95cf', far: '#9fb0dc', ms: 1, mx: 480, night: true }),
      mid: put(A.hills({ amp: 9, fill: '#9fb0dc', trees: 20, treeFill: '#34508f', seed: 7 }), 0, 396),
      front: segs(-160, 1120, 4, 1.45, 552, { ...cornNight, sway: 4 }),
      ui: titleCard('h0', T(3.67), ' tc--hero'),
    }) },
    { t0: 21.83, label: 'Año 1-Ácatl · 1519', wipe: true, punch: .012, cam: [10, -30, 0, .06, '66% 62%'], build: T => ({
      sky: sum(put(A.sky('sunset', 6), 0, 0), put(A.sun(30, 14), 210, 300, { cls: 'pulse', anim: an('sink', 0, 15, 'linear'), vars: '--dy:44px;' }),
        clouds(6, [[150, 120, 1, 60, 15], [600, 84, 1.3, 50, 15], [860, 150, .9, 40, 15]])),
      far: put(A.hills({ amp: 22, freq: .009, fill: '#c3cdea', seed: 4, depth: 120 }), 0, 316),
      mid: sum(put(A.sprite(`<rect x="-160" y="0" width="1280" height="260" fill="#d6dff2"/><path d="M-160 0 H1120" stroke="${P.C}" stroke-width="3"/>`, [-166, -6, 1292, 270], { wobble: 3 }), 0, 334),
        put(A.waterLines(1440, 200, 9), -120, 340, { loop: loop('flow', 9, 0, 'linear', 'normal') }),
        put(A.sprite(`<path d="M-40 230 L330 30 M60 240 L380 36" stroke="${P.O}" stroke-width="7" stroke-linecap="round"/><path d="M-40 230 L330 30 M60 240 L380 36" stroke="${P.C}" stroke-width="1.6" stroke-dasharray="4 8"/>`, [-50, 20, 440, 230], { wobble: 2 }), 120, 330),
        put(A.city(460), 420, 352), put(A.teocalli(.5, P.O), 500, 352), put(A.teocalli(.5, P.G), 800, 352), put(A.temploMayor(1.25), 650, 352),
        put(A.smoke(), 616, 214, { loop: loop('smoke', 3.2, 0, 'ease-out', 'normal'), lorigin: '50% 100%' }), put(A.smoke(), 684, 214, { loop: loop('smoke', 3.2, 1.6, 'ease-out', 'normal'), lorigin: '50% 100%' })),
      near: sum(put(A.canoe(1.2), 110, 394, { anim: an('drift', 0, 15, 'linear'), vars: '--dx:170px;', loop: loop('bob', 1.6) }),
        put(A.canoe(1), 330, 408, { anim: an('drift', 0, 15, 'linear'), vars: '--dx:120px;', loop: loop('bob', 1.9, .5) }),
        put(A.canoe(.8), 900, 380, { anim: an('drift', 0, 15, 'linear'), vars: '--dx:-150px;', loop: loop('bob', 1.7, .3) })),
      front: sum(put(A.reeds(1.2, 3), 30, 430, { loop: loop('sway', 3, 0), lorigin: '50% 100%' }), put(A.reeds(1.3, 8), 940, 434, { loop: loop('sway', 3.3, .7), lorigin: '50% 100%' })),
      ui: html(`<span class="kin__ic">${A.icon('huehuetl')}</span>¡Que retumbe el huéhuetl!`, { cls: 'kin pulse', anim: `${an('kinIn', T(22.0), .55, 'cubic-bezier(.2,1.4,.4,1)')}, ${an('kinOut', T(25.0), .6, 'ease-in', 'forwards')}` }),
    }) },
    { t0: 36.78, label: 'La frontera', cam: [40, -40, .02, .04, '50% 55%'], build: T => {
      const guard = i => ({ id: 'g' + i, skin: ['#a8683a', '#9a5e34', '#b07a48'][i % 3], hair: '#1a1210', hairStyle: ['coleta', 'largo', 'trenzas'][i % 3], style: 'armadura', legs: true, top: '#efe3c8', trim: '#2f5fa8', head: i % 2 ? 'plumas' : 'pluma', prop: i % 2 ? 'escudo' : 'lanza', shield: '#2f5fa8' });
      return {
        sky: sum(put(A.sky('ember', 8), 0, 0), put(A.sun(54, 20), 480, 262, { cls: 'pulse', anim: an('sink', 0, 15.2, 'linear'), vars: '--dy:96px;' })),
        far: sum(put(A.hills({ amp: 14, fill: '#c7cde6', seed: 9, depth: 80 }), 0, 300),
          put(A.banner(.95), 480, 330, { anim: an('rise', T(46.1), 1.6, 'cubic-bezier(.2,.9,.2,1)'), vars: '--dy:150px;', loop: loop('wave', 2.4), lorigin: '50% 100%' })),
        mid: sum(put(A.wall(), 0, 318), [60, 330, 630, 900].map((x, i) => put(A.torchPole(), x, 296) + put(A.flame(1.1), x, 242, { loop: loop('flick', .18 + i * .03, i * .1), lorigin: '50% 100%' })).join(''),
          [150, 245, 410, 560, 735, 830].map((x, i) => fig(guard(i), x, 296, 104, { paint: true, flip: i % 2 === 1, loop: loop('breathe', 2.6, i * .4) })).join('')),
        front: put(A.sprite(`<rect x="-160" y="0" width="1280" height="200" fill="${P.C}"/>`, [-166, -6, 1292, 210], { wobble: 3 }), 0, 438),
        ui: sum(roundel('sal', 330, 132, T(38.0), T(43.9), T(38.45)), roundel('algodon', 480, 132, T(38.65), T(43.95), T(39.1)), roundel('cacao', 630, 132, T(39.3), T(44.0), T(39.75))),
      };
    } },
    { t0: 51.99, label: 'Tlaxcallan', cam: [0, 0, 0, .07, '50% 46%'], build: T => ({
      sky: sum(put(A.sky('dawn', 10), 0, 0), put(A.sun(34), 690, 340, { cls: 'pulse', anim: an('sunRise', T(52.1), 6.5, 'cubic-bezier(.3,.6,.3,1)'), vars: '--dy:-160px;' }),
        clouds(10, [[140, 110, 1, 40, 10.5], [820, 90, 1.1, 30, 10.5]])),
      far: valley(392),
      mid: sum(put(A.hills({ amp: 8, fill: '#c9dcc0', trees: 22, seed: 12 }), 0, 382), village([[170, 404, .7], [252, 412, .62], [690, 406, .7], [772, 414, .6], [852, 406, .68]])),
      near: sum(put(A.maguey(1.3), 60, 452), put(A.maguey(1.1), 905, 448)),
      front: segs(-160, 1120, 4, 1.5, 548, { sway: 3.8 }),
      ui: herons(T(59.5), 150, 7.5),
    }) },
    { t0: 62.41, label: 'Tu herencia', cam: [10, -40, 0, .04, '60% 60%'], build: T => {
      const sprouts = []; [[372, 150, 640], [390, 135, 655], [408, 120, 670]].forEach(([y, x0, x1], r) => { for (let x = x0, k = 0; x <= x1; x += 58, k++) sprouts.push(put(A.sprout(.9 + r * .15), x + (r % 2) * 20, y, { anim: an('grow', T(72.84) + (k + r * 3) * .07, .7, 'cubic-bezier(.2,1.4,.4,1)'), origin: '50% 100%' })); });
      const prints = Array.from({ length: 8 }, (_, i) => put(A.footprint(i % 2 === 0), 120 + i * 24, 414 - (i % 2) * 6, { anim: an('fadeIn', T(62.7) + i * .3, .3) })).join('');
      return {
        sky: sum(put(A.sky('day', 12), 0, 0), put(A.sun(28), 830, 96, { loop: loop('spin', 60, 0, 'linear', 'normal') }), clouds(12, [[300, 80, 1, 50, 17.5], [600, 140, .8, 40, 17.5]])),
        far: sum(put(A.malinche(.75), 190, 360), put(A.hills({ amp: 16, freq: .01, fill: '#d7e3cf', trees: 10, seed: 14, x0: 600 }), 0, 342),
          put(A.conchBlower(1.6), 878, 318, { anim: an('fadeIn', T(74.9), .8) }),
          [0, 1, 2].map(i => put(A.virgula(1.2 + i * .35), 918 + i * 5, 236 - i * 18, { anim: an('fadeIn', T(75.3) + i * .65, .3), loop: loop('vir', 1.95, -i * .65, 'ease-out', 'normal'), lorigin: '0% 100%' })).join('')),
        mid: sum(put(A.sprite(`<path d="M80 0 L700 0 L740 70 L40 70Z" fill="#d9b98a"/>${[14, 32, 50].map(y => `<path d="M${76 - y * .5} ${y} L${704 + y * .5} ${y}" stroke="${P.BR}" stroke-width="5" opacity=".7"/>`).join('')}<path d="M80 0 L700 0" stroke="${P.C}" stroke-width="2.4"/>`, [30, -8, 720, 86], { wobble: 3 }), 0, 352),
          sprouts.join(''), put(A.jacal(1.5), 770, 408), put(A.smoke(), 782, 324, { loop: loop('smoke', 3.4, 0, 'ease-out', 'normal'), lorigin: '50% 100%' })),
        near: sum(prints, fig(PLAYER, 330, 414, 196, { anim: an('walkIn', T(62.5), 2.6, 'cubic-bezier(.3,.6,.4,1)'), vars: '--dx:-220px;', loop: an('step', T(62.5), .325, 'ease-in-out', 'none', 8, 'alternate') })),
        front: sum(put(A.maguey(1.4), 40, 460), put(A.maguey(1.2), 930, 456)),
        ui: sum(roundel('milpa', 300, 96, T(63.4), T(68.6)), roundel('choza', 420, 96, T(64.05), T(68.65)), roundel('semillas', 540, 96, T(64.7), T(68.7)), roundel('coa', 660, 96, T(65.35), T(68.75))),
      };
    } },
    { t0: 79.95, label: 'Tizatlán', punch: .009, cam: [0, 0, 0, .08, '50% 42%'], build: T => {
      const xico = { id: 'xico', name: 'Xicohténcatl', skin: '#9a6a44', hair: '#e8e2d8', hairStyle: 'largo', style: 'tilma', legs: true, top: '#f6efe0', trim: '#b8402e', head: 'plumas', jade: true, orejeras: true, prop: 'baston' };
      const war = i => ({ id: 'w' + i, skin: ['#a8683a', '#9a5e34', '#b07a48'][i % 3], hair: '#1a1210', hairStyle: ['coleta', 'largo', 'trenzas'][i % 3], style: 'armadura', legs: true, top: '#efe3c8', trim: '#2f5fa8', head: i % 2 ? 'plumas' : 'pluma', prop: i % 2 ? 'escudo' : 'lanza', shield: '#2f5fa8' });
      const march = (i, x, from) => fig(war(i), x, 412, 112, { paint: true, flip: from > 0, anim: an('walkIn', T(80.3) + (i % 3) * .2, 3.2, 'cubic-bezier(.3,.6,.4,1)'), vars: `--dx:${from}px;`, loop: `${an('step', T(80.3), .325, 'ease-in-out', 'none', 10, 'alternate')}, ${an('hop3', T(89.0), 1.95, 'linear', 'none')}` });
      return {
        sky: sum(put(A.sky('day', 14), 0, 0), clouds(14, [[160, 90, 1.1, 40, 15], [760, 70, 1, 30, 15]])),
        far: put(A.hills({ amp: 18, fill: '#d2dcef', trees: 14, seed: 16 }), 0, 336),
        mid: sum(put(A.teocalli(2, P.G), 480, 404), fig(xico, 482, 286, 120, { loop: loop('breathe', 3, 0) }),
          put(A.banner(1.1), 300, 404, { loop: loop('wave', 2.2), lorigin: '50% 100%' }), put(A.banner(1.1), 660, 404, { loop: loop('wave', 2.4, .6), lorigin: '50% 100%' })),
        near: sum(march(0, 110, -320), march(1, 185, -320), march(2, 260, -320), march(3, 700, 320), march(4, 775, 320), march(5, 850, 320)),
        front: put(A.ground('#eadcbc', { seed: 5 }), 0, 412),
      };
    } },
    { t0: 94.92, label: 'Corazón de maíz', punch: .006, cam: [30, -40, 0, .05, '50% 70%'], build: T => ({
      sky: sum(put(A.sky('day', 16), 0, 0), put(A.sky('dusk', 17), 0, 0, { anim: an('fadeIn', T(101), 16, 'linear') }),
        put(A.stars(18, 40, [-80, -40, 1120, 200]), 0, 0, { anim: an('fadeIn', T(115), 6, 'linear'), loop: loop('twinkle', 2.4) }),
        put(A.sun(30), 720, 130, { anim: an('sink', T(97), 24, 'linear'), vars: '--dy:240px;' })),
      far: put(A.hills({ amp: 12, fill: '#c6d2ea', trees: 16, seed: 18 }), 0, 330),
      mid: segs(-160, 1120, 5, 1.6, 372, { gap: 24, gust: T(96.6), sway: 3.2 }),
      near: segs(-200, 1160, 4, 2.6, 456, { gap: 24, gust: T(96.9), sway: 3.6, ph: 1 }),
      front: sum(segs(-260, 1220, 3, 4, 564, { gap: 26, gust: T(97.2), sway: 4.2, ph: 2 }),
        Array.from({ length: 18 }, (_, i) => `<i class="ff" style="left:${60 + (i * 53) % 860}px;top:${150 + (i * 37) % 230}px;animation:${an('fadeIn', T(112) + i * .35, 1.2, 'ease-out')}, ${loop('ffly', 3 + (i % 4) * .7, i * .4)}"></i>`).join('')),
    }) },
    { t0: 121.86, label: 'El valle', cam: [-30, 30, .02, .03, '50% 60%'], build: T => {
      const women = [4, 5, 8, 9, 12, 14];
      return {
        sky: sum(put(A.sky('dusk', 20), 0, 0), put(A.moon(24), 150, 120, { anim: an('sunRise', 0, 9, 'ease-out'), vars: '--dy:-40px;' })),
        far: sum(put(A.malinche(.62, { fill: '#8a9ad0' }), 700, 322), put(A.sprite([0, 1, 2, 3, 4].map(i => `<g transform="translate(${i * 70} 0)"><path d="M0 0 V-22 M44 0 V-22" stroke="${P.C}" stroke-width="2.4"/><path d="M-6 -22 L50 -22 L42 -32 L2 -32Z" fill="${[P.R, P.O, P.C2, P.G, P.O][i]}" stroke="${P.C}" stroke-width="2"/></g>`).join(''), [-10, -40, 360, 46], { wobble: 2 }), 470, 330)),
        mid: sum(put(A.sprite(`<rect x="-160" y="0" width="1280" height="44" fill="#cbd6ee"/><path d="M-160 0 H1120 M-160 44 H1120" stroke="${P.C}" stroke-width="2.6"/>`, [-166, -6, 1292, 56], { wobble: 3 }), 0, 330),
          put(A.waterLines(1440, 36, 21), -120, 334, { loop: loop('flow', 7, 0, 'linear', 'normal') }), put(A.ground('#efe2c4', { seed: 9 }), 0, 374)),
        near: sum(put(A.reeds(1.2, 4), 40, 400, { loop: loop('sway', 3, 0), lorigin: '50% 100%' }), put(A.reeds(1.3, 9), 920, 404, { loop: loop('sway', 3.4, .6), lorigin: '50% 100%' }),
          women.map((c, i) => fig(CAST[c], 150 + i * 132, 412, 150, { anim: an('riseIn', T(122.5) + i * 1.3, .9), loop: loop('breathe', 2.8, i * .5) })).join('')),
      };
    } },
    { t0: 132.19, label: 'El mar del oriente', cam: [0, 0, 0, .09, '49% 56%'], build: T => {
      const elder = { id: 'anc', name: 'Anciano', skin: '#9a6a44', hair: '#e8e2d8', hairStyle: 'chongo', style: 'tilma', legs: true, top: '#7a8a3a', trim: '#e9b33e', prop: 'baston' };
      const guard = { id: 'gs', skin: '#a8683a', hair: '#1a1210', hairStyle: 'coleta', style: 'armadura', legs: true, top: '#efe3c8', trim: '#2f5fa8', head: 'pluma', prop: 'lanza' };
      return {
        sky: sum(put(A.sky('night', 22), 0, 0), put(A.stars(23, 70), 0, 0, { loop: loop('twinkle', 2.2) }), put(A.moon(30), 790, 104)),
        mid: sum(put(A.sprite(`<rect x="-160" y="0" width="1280" height="300" fill="#2a4486"/><path d="M-160 0 H1120" stroke="#fbf8f0" stroke-width="2"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${770 - i * 3}" y="${10 + i * 12}" width="${40 + i * 6}" height="3" rx="1.5" fill="#fbf8f0" opacity="${.7 - i * .06}"/>`).join('')}`, [-166, -6, 1292, 310], { wobble: 2 }), 0, 302),
          put(A.waterLines(1440, 240, 24, '#c8d4ee'), -120, 306, { loop: loop('flow', 12, 0, 'linear', 'normal') }),
          put(A.ship(), 470, 330, { anim: an('shipIn', T(134.6), 3.2, 'ease-out'), loop: loop('rock', 3.2) }),
          [[-60, 284, 560], [260, 304, 600], [-120, 324, 700]].map(([x, y, w], i) => put(A.fog(w), x, y, { anim: `${an('drift', T(134.4) + i * .3, 7, 'ease-in')}, ${an('fadeOut', T(135.2) + i * .4, 4, 'ease-in', 'both')}`, vars: `--dx:${i % 2 ? -260 : 280}px;` })).join('')),
        front: sum(put(A.shore(), 0, 380), put(A.campfire(), 300, 426), put(A.flame(1.2), 300, 422, { loop: loop('flick', .2, 0), lorigin: '50% 100%' }),
          fig(elder, 175, 420, 118, { dim: true, loop: loop('breathe', 3, 0) }), fig(guard, 238, 420, 124, { dim: true, loop: loop('breathe', 2.7, .8) })),
      };
    } },
    { t0: 153.41, label: 'Amanecer', punch: .006, cam: [-20, 20, 0, .05, '52% 50%'], build: T => {
      const bz = (t, a, b, c) => (1 - t) * (1 - t) * a + 2 * (1 - t) * t * b + t * t * c, P0 = [205, 430], P1 = [380, 372], P2 = [690, 392];
      const at3 = t => [bz(t, P0[0], P1[0], P2[0]), bz(t, P0[1], P1[1], P2[1])], halfW = t => 34 * (1 - t) + 6 * t;
      const edge = side => Array.from({ length: 25 }, (_, k) => { const t = k / 24, [x, y] = at3(t), [x2, y2] = at3(Math.min(1, t + .01)), [x1, y1] = at3(Math.max(0, t - .01)), dx = x2 - x1, dy = y2 - y1, n = Math.hypot(dx, dy) || 1; return [x - side * dy / n * halfW(t), y + side * dx / n * halfW(t)]; });
      const L = edge(1), Rr = edge(-1).reverse(), road = A.sprite(`<path d="M${[...L, ...Rr].map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}Z" fill="#e3c99a"/><path d="M${L.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}" fill="none" stroke="${P.C}" stroke-width="2.4"/><path d="M${Rr.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join('L')}" fill="none" stroke="${P.C}" stroke-width="2.4"/>`, [150, 340, 580, 120], { wobble: 2.5 });
      const path = put(road, 0, 0) + Array.from({ length: 14 }, (_, i) => { const t = .06 + i * .066, [x, y] = at3(t), o = (i % 2 ? -1 : 1) * halfW(t) * .32; return put(A.footprint(i % 2 === 0), x, y + o, { anim: an('popIn', T(161.8) + i * .22, .35) }); }).join('');
      return {
        sky: sum(put(A.sky('predawn', 25), 0, 0), put(A.sky('dawn', 26), 0, 0, { anim: an('fadeIn', T(153.6), 6.5, 'linear') }),
          put(A.stars(27, 60), 0, 0, { anim: an('fadeOut', T(153.6), 5, 'linear') }),
          put(A.sun(36), 600, 330, { cls: 'pulse', anim: an('sunRise', T(154), 8, 'cubic-bezier(.3,.6,.3,1)'), vars: '--dy:-175px;' })),
        far: valley(392, { mx: 520 }),
        mid: sum(put(A.hills({ amp: 8, fill: '#c9dcc0', trees: 22, seed: 28 }), 0, 382), village([[700, 406, .7], [780, 414, .62], [860, 406, .66]])),
        near: sum(put(A.sprite(`<path d="M-160 30 C 40 6 200 0 330 12 C 380 16 420 24 440 40 L440 200 L-160 200Z" fill="#d7c497" stroke="${P.C}" stroke-width="3"/>`, [-166, -6, 612, 212], { wobble: 3 }), 0, 384), path,
          fig(PLAYER, 170, 412, 204, { loop: loop('breathe', 3, 0) })),
        front: segs(-160, 1120, 4, 1.5, 552, { sway: 3.8 }),
        ui: herons(T(157), 140, 8),
      };
    } },
    { t0: 171.34, label: 'Corazón de Maíz', wipe: true, punch: .009, cam: [0, 0, 0, .03, '50% 50%'], build: T => {
      const tiles = [['milpa', 'Siembra tu milpa'], ['cacao', 'Comercia en el tianguis'], ['escudo', 'Defiende la frontera'], ['copal', 'Honra a los dioses'], ['xochitl', 'Encuentra el amor']];
      const at = [171.99, 175.89, 179.79, 183.69, 187.59];
      const lineup = [[4, 150], [5, 250], [8, 350], ['P', 480], [9, 610], [12, 710], [14, 810]];
      return {
        sky: sum(put(A.sky('day', 30), 0, 0), clouds(30, [[150, 100, 1, 60, 41], [520, 70, 1.2, 50, 41], [850, 120, .9, 40, 41]])),
        far: valley(392),
        mid: sum(put(A.hills({ amp: 8, fill: '#c9dcc0', trees: 22, seed: 31 }), 0, 382), village([[170, 404, .7], [690, 406, .7], [852, 406, .68]])),
        near: lineup.map(([c, x], i) => fig(c === 'P' ? PLAYER : CAST[c], x, 412, c === 'P' ? 178 : 150, { anim: an('riseIn', T(192.1) + i * .14, .8), loop: loop('breathe', 2.8, i * .4) })).join(''),
        front: segs(-160, 1120, 4, 1.5, 552, { sway: 3.8 }),
        ui: sum(tiles.map(([ic, label], i) => html(`<div class="ft__t pulse">${A.icon(ic)}</div><div class="ft__l">${label}</div>`, { cls: 'ft', style: `left:${180 + i * 150 - 66}px;`, anim: `${an('flipIn', T(at[i]), .8, 'cubic-bezier(.2,1.3,.4,1)')}, ${an('flipOut', T(190.6) + i * .08, .5, 'ease-in', 'forwards')}` })).join(''),
          titleCard('h10', T(191.82), ' tc--end')),
      };
    } },
  ];

  // Narration, in story order. hold: seconds the panel stays up (default 15).
  const CAPTIONS = [
    { t: 25.0, text: 'Año 1 Caña. Al poniente, Tenochtitlan brilla sobre su lago. Los mexicas cobran tributo a todos los pueblos de la tierra… a todos, menos a nosotros.' },
    { t: 37.0, text: 'Por eso nos tienen cercados: sin sal, sin algodón, sin cacao.' },
    { t: 44.4, text: 'Cada año vienen por guerreros para sus altares. Pero Tlaxcallan resiste.' },
    { t: 52.2, text: 'En el valle, a la sombra de la Matlalcueye, vive un pueblo que nunca se ha rendido: el señorío libre de Tlaxcallan.' },
    { t: 62.6, text: 'Tu padre te dejó una milpa pequeña al pie del monte, una choza, unas semillas y una coa.' },
    { t: 68.8, text: 'Es poco… pero es tuyo.' },
    { t: 73.2, text: 'Y esta mañana, desde Tizatlán, suena el caracol.' },
    { t: 80.2, text: 'El viejo tlatoani Xicohténcatl busca gente valiente: quien dé de comer a los guerreros, quien cuide la frontera, quien se gane un nombre.' },
    { t: 95.3, text: 'Dicen los abuelos que tenemos corazón de maíz: se dobla con el viento, pero no se quiebra.' },
    { t: 122.2, text: 'En el tianguis, en el río y en la milpa, las mujeres del valle esperan conocerte.' },
    { t: 132.6, text: 'Y dicen los ancianos que en el mar del oriente se han visto casas que flotan, con hombres de barba y de piel pálida…' },
    { t: 142.6, text: 'Nadie sabe qué traen. Pero el maíz no espera: al amanecer, hay que sembrar.' },
    { t: 153.7, text: 'Los dioses te miran: Camaxtli desde su templo, la Matlalcueye desde su monte.' },
    { t: 197.0, text: 'Tu historia empieza al amanecer.', hold: 999 },
  ];

  CH.forEach((c, i) => { c.t1 = i + 1 < CH.length ? CH[i + 1].t0 : 212; });
  window.CdmStory = { CH, CAPTIONS, BEATS, heart, TITLE_AT: 191.82, SONG_LEN: 212 };
})();
