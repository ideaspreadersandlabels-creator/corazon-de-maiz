// Cultivos que faltaban (5 etapas cada uno) dentro del arte del mundo (CdmMundo), 64×128, pie en y≈111.
(function () {
  const K = '#1a1410', n = v => +(+v).toFixed(1), I = w => `stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const monte = `<ellipse cx="32" cy="113" rx="17" ry="4.4" fill="#6e4524" ${I(.9)}/><path d="M20 112 q12 -4 24 0" stroke="#8a5a30" stroke-width="1.4" fill="none"/>`;
  const semilla = c => monte + `<ellipse cx="32" cy="110" rx="2.4" ry="1.7" fill="${c}" ${I(.9)}/>`;
  const hoja = (x, y, a, l, c, w = .42) => { const r = a * Math.PI / 180, x2 = x + Math.cos(r) * l, y2 = y + Math.sin(r) * l, nx = -Math.sin(r) * l * w, ny = Math.cos(r) * l * w, mx = (x + x2) / 2, my = (y + y2) / 2;
    return `<path d="M${n(x)} ${n(y)} Q${n(mx + nx)} ${n(my + ny)} ${n(x2)} ${n(y2)} Q${n(mx - nx)} ${n(my - ny)} ${n(x)} ${n(y)}Z" fill="${c}" ${I(1)}/><path d="M${n(x)} ${n(y)} L${n(x2)} ${n(y2)}" stroke="rgba(255,255,230,.45)" stroke-width=".8"/>`; };
  const tallo = (x0, y0, x1, y1, c = '#4f8a36', w = 2.4) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 3} ${(y0 + y1) / 2} ${x1} ${y1}" stroke="${K}" stroke-width="${w + 2}" fill="none" stroke-linecap="round"/><path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 3} ${(y0 + y1) / 2} ${x1} ${y1}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const brote = (c) => monte + tallo(32, 111, 32, 100, c, 2) + hoja(32, 102, -150, 9, c) + hoja(32, 101, -30, 9, c);
  const bola = (x, y, r, c) => `<circle cx="${n(x)}" cy="${n(y)}" r="${r}" fill="${c}" ${I(1)}/><circle cx="${n(x - r * .35)}" cy="${n(y - r * .35)}" r="${n(r * .3)}" fill="rgba(255,255,255,.5)"/>`;
  const florecita = (x, y, c = '#f2c84a') => [0, 72, 144, 216, 288].map(a => `<ellipse cx="${x}" cy="${y - 2}" rx="1.4" ry="2.2" transform="rotate(${a} ${x} ${y})" fill="${c}"/>`).join('') + `<circle cx="${x}" cy="${y}" r="1" fill="#e8862a"/>`;
  const mata = (alto, c, k = 1) => { let g = tallo(32, 111, 32, 111 - alto, c); for (let i = 0; i < 4 + k * 2; i++) { const y = 108 - i * alto / (4 + k * 2); g += hoja(32, y, i % 2 ? -25 : -155, 10 + k * 2, c); } return g; };
  // Jitomate y tomate verde: mata con tutor, flores amarillas y frutos.
  const tomate = (fruta, leaf, verde) => [
    () => semilla('#e8d8a0'), () => brote(leaf),
    () => monte + `<path d="M40 112 V58" stroke="#8a5a30" stroke-width="2.6"/>` + mata(34, leaf),
    () => monte + `<path d="M40 112 V42" stroke="#8a5a30" stroke-width="2.6"/>` + mata(56, leaf, 2) + florecita(26, 70) + florecita(40, 60) + florecita(30, 86),
    () => monte + `<path d="M40 112 V42" stroke="#8a5a30" stroke-width="2.6"/>` + mata(56, leaf, 2) + [[24, 76], [38, 66], [28, 90], [42, 84], [34, 58]].map(([x, y]) => verde ? `<path d="M${x - 5} ${y - 2} Q${x} ${y - 9} ${x + 5} ${y - 2} Q${x + 5} ${y + 5} ${x} ${y + 5} Q${x - 5} ${y + 5} ${x - 5} ${y - 2}Z" fill="#d8e0a0" ${I(.9)}/>` + bola(x, y + 1, 3.4, fruta) : bola(x, y, 4.4, fruta)).join(''),
  ];
  // Camote y cacahuate: mata rastrera; al final se asoma lo que creció bajo tierra.
  const raiz = (fruta, leaf, cora) => [
    () => semilla(fruta), () => brote(leaf),
    () => monte + [[-160, 14], [-120, 12], [-60, 12], [-20, 14]].map(([a, l]) => hoja(32, 108, a, l, leaf, cora ? .6 : .4)).join(''),
    () => monte + [[-170, 18], [-140, 16], [-110, 15], [-70, 15], [-40, 16], [-10, 18], [-90, 14]].map(([a, l]) => hoja(32, 108, a, l, leaf, cora ? .6 : .4)).join('') + (cora ? '' : florecita(24, 96) + florecita(40, 94)),
    () => monte + [[-170, 18], [-140, 16], [-110, 15], [-70, 15], [-40, 16], [-10, 18], [-90, 14]].map(([a, l]) => hoja(32, 106, a, l, leaf, cora ? .6 : .4)).join('') + (cora ? `<ellipse cx="22" cy="112" rx="7" ry="4" fill="${fruta}" ${I(1)}/><ellipse cx="42" cy="113" rx="6" ry="3.4" fill="${fruta}" ${I(1)}/>` : [[22, 112], [30, 114], [40, 112]].map(([x, y]) => `<path d="M${x - 5} ${y} q2.5 -4 5 0 q2.5 -4 5 0 q-2.5 4 -5 0 q-2.5 4 -5 0z" fill="${fruta}" ${I(.9)}/>`).join('')),
  ];
  // Amaranto y huauzontle: planta alta con penachos.
  const penacho = (fruta, leaf) => [
    () => semilla(fruta), () => brote(leaf),
    () => monte + mata(40, leaf),
    () => monte + mata(66, leaf, 2) + `<path d="M32 46 q-4 -8 0 -14 q4 6 0 14z" fill="${leaf}" ${I(.9)}/>`,
    () => monte + mata(70, leaf, 2) + [[32, 30, 0], [24, 44, -25], [40, 44, 25]].map(([x, y, a]) => `<path d="M${x} ${y + 12} q-5 -10 0 -${a ? 14 : 22} q5 10 0 ${a ? 14 : 22}z" transform="rotate(${a} ${x} ${y + 12})" fill="${fruta}" ${I(1)}/>` + [...Array(4)].map((_, i) => `<circle cx="${x + (i % 2 ? 2 : -2)}" cy="${y + 8 - i * 4}" r="1.4" fill="rgba(255,255,255,.35)"/>`).join('')).join(''),
  ];
  // Capulín: arbolito con racimos de capulines.
  const capulin = (fruta, leaf) => [
    () => semilla('#5a3a1e'), () => brote(leaf),
    () => monte + tallo(32, 111, 32, 74, '#6b4423', 3) + [[24, 76], [40, 76], [32, 70]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${leaf}" ${I(1.4)}/>`).join(''),
    () => monte + tallo(32, 111, 32, 60, '#6b4423', 3.6) + [[20, 64], [44, 64], [32, 52], [26, 56], [38, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${leaf}" ${I(1.4)}/>`).join('') + florecita(26, 58, '#f4ecd8') + florecita(40, 52, '#f4ecd8'),
    () => monte + tallo(32, 111, 32, 60, '#6b4423', 3.6) + [[20, 64], [44, 64], [32, 52], [26, 56], [38, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="12" fill="${leaf}" ${I(1.4)}/>`).join('') + [[22, 62], [36, 50], [42, 66], [28, 70]].map(([x, y]) => [0, 1, 2].map(k => bola(x + k * 2.6, y + (k % 2) * 3, 2.2, fruta)).join('')).join(''),
  ];
  // Girasol: tallo alto, hojas grandes, botón y flor.
  const girasol = (fruta, leaf) => [
    () => semilla('#3a2a20'), () => brote(leaf),
    () => monte + mata(40, leaf),
    () => monte + mata(68, leaf, 2) + `<circle cx="32" cy="40" r="6" fill="${leaf}" ${I(1)}/>`,
    () => monte + mata(70, leaf, 2) + [...Array(14)].map((_, i) => `<ellipse cx="32" cy="22" rx="2.6" ry="7" transform="rotate(${i * 360 / 14} 32 31)" fill="${fruta}" ${I(.8)}/>`).join('') + `<circle cx="32" cy="31" r="7" fill="#5a3a1e" ${I(1)}/>` + [...Array(6)].map((_, i) => `<circle cx="${32 + Math.cos(i) * 3.4}" cy="${31 + Math.sin(i) * 3.4}" r=".8" fill="#2a1a10"/>`).join(''),
  ];
  // Nopal: pencas que crecen; al final con tunas.
  const nopal = (fruta, leaf) => {
    const penca = (x, y, rx, ry, a) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${x} ${y})" fill="${leaf}" ${I(1.2)}/>` + [[-2, -3], [2, 1], [-1, 4]].map(([dx, dy]) => `<circle cx="${x + dx}" cy="${y + dy}" r=".7" fill="#e8e0c0"/>`).join('');
    return [() => semilla('#5aa04a'), () => monte + penca(32, 103, 5, 8, 0),
      () => monte + penca(32, 98, 8, 13, 0) + penca(40, 84, 5, 8, 25),
      () => monte + penca(32, 96, 10, 15, 0) + penca(22, 78, 7, 11, -25) + penca(42, 78, 7, 11, 25) + penca(32, 66, 6, 9, 0),
      () => monte + penca(32, 96, 10, 15, 0) + penca(22, 78, 7, 11, -25) + penca(42, 78, 7, 11, 25) + penca(32, 66, 6, 9, 0) + [[17, 68], [26, 66], [38, 66], [47, 68], [32, 56]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="3.4" fill="${fruta}" ${I(.9)}/>`).join('')];
  };
  // Maguey: roseta que crece; al final con su quiote en flor.
  const maguey = (fruta, leaf) => {
    const roseta = (s) => [-170, -150, -125, -100, -80, -55, -30, -10].map((a, i) => { const r = a * Math.PI / 180, l = s * (i % 2 ? 1 : .85), x2 = 32 + Math.cos(r) * l, y2 = 110 + Math.sin(r) * l * .9, nx = -Math.sin(r) * 3.4, ny = Math.cos(r) * 3.4;
      return `<path d="M${n(32 + nx)} ${n(110 + ny)} L${n(x2)} ${n(y2)} L${n(32 - nx)} ${n(110 - ny)}Z" fill="${i % 2 ? leaf : '#6a9a7a'}" ${I(1)}/>`; }).join('');
    return [() => semilla('#5f8f7a'), () => monte + roseta(10), () => monte + roseta(18), () => monte + roseta(26),
      () => monte + roseta(28) + `<path d="M32 104 V20" stroke="${K}" stroke-width="5"/><path d="M32 104 V20" stroke="#8a9a5a" stroke-width="3"/>` + [26, 34, 42].map((y, i) => `<path d="M32 ${y} h${i % 2 ? 9 : -9}" stroke="#8a9a5a" stroke-width="2"/><circle cx="${32 + (i % 2 ? 10 : -10)}" cy="${y - 1}" r="3.4" fill="${fruta}" ${I(.9)}/>`).join('')];
  };
  const NUEVOS = {
    jitomate:tomate('#e2403a', '#3f9a35'), tomate_verde:tomate('#8ac040', '#4f9a3a', true),
    camote:raiz('#b0506a', '#5aa83a', true), cacahuate:raiz('#c8a070', '#5aa83a', false),
    amaranto:penacho('#c0304a', '#4fae3c'), huauzontle:penacho('#6a8a3a', '#4f8a3a'),
    capulin:capulin('#5a0f1e', '#3f9a35'), girasol:girasol('#f7c623', '#4b9e3a'),
    nopal:nopal('#e0407a', '#5aa04a'), maguey:maguey('#efe6c0', '#5f8f7a'),
  };
  for (const [k, v] of Object.entries(NUEVOS)) { CdmMundo.CROPS[k] = v; ARTE_CULTIVO[k] = k; }
})();
