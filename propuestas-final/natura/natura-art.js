// Árboles, piedras y plantas de Corazón de Maíz en estilo códice (contorno de tinta, colores planos).
// CdmNatura.svg(tipo, opciones) → texto SVG; CdmNatura.TAM[tipo] → [ancho, alto] del SVG (el pie va en alto-4).
(function () {
  const K = '#1a1410', n = v => +(+v).toFixed(1);
  const rnd = s => () => (s = (s * 16807) % 2147483647) / 2147483647;
  // Silueta con contorno: primero todas las formas con trazo grueso, luego el relleno encima.
  const sil = (formas, borde = 4) => formas.map(([f]) => f.replace('/>', ` fill="${K}" stroke="${K}" stroke-width="${borde}" stroke-linejoin="round"/>`)).join('') + formas.map(([f, c]) => f.replace('/>', ` fill="${c}"/>`)).join('');
  const circ = (x, y, r) => `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}"/>`;
  const ell = (x, y, rx, ry, a = 0) => `<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(rx)}" ry="${n(ry)}" transform="rotate(${n(a)} ${n(x)} ${n(y)})"/>`;
  const path = d => `<path d="${d}"/>`;
  const sombra = (x, y, rx) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${n(rx * .26)}" fill="rgba(26,20,16,.25)"/>`;
  const tronco = (x, yb, yt, w) => `<path d="M${x - w} ${yb} Q${x - w * .6} ${(yb + yt) / 2} ${x - w * .5} ${yt} L${x + w * .5} ${yt} Q${x + w * .6} ${(yb + yt) / 2} ${x + w} ${yb} Q${x} ${yb + 2} ${x - w} ${yb}Z" fill="#6b4423" stroke="${K}" stroke-width="2" stroke-linejoin="round"/><path d="M${x - w * .3} ${yb - 2} Q${x - w * .2} ${(yb + yt) / 2} ${x - w * .15} ${yt + 2}" stroke="#9a6a3a" stroke-width="1.6" fill="none"/>`;
  const marcas = (R, cx, cy, rx, ry, col, k = 9) => [...Array(k)].map(() => { const x = cx + (R() - .5) * 2 * rx * .8, y = cy + (R() - .5) * 2 * ry * .8; return `<path d="M${n(x - 2.4)} ${n(y)} q2.4 -2.6 4.8 0" stroke="${col}" stroke-width="1.3" fill="none" stroke-linecap="round"/>`; }).join('');

  const A = {
    // Árbol del bosque (encino/ahuehuete). c = [oscuro, base, medio, claro]; flor = color de flores (primavera); desnudo = invierno.
    arbol({ c, flor, desnudo, v = 0 }) {
      const R = rnd(11 + v * 7);
      let g = sombra(32, 76, 22) + tronco(32, 76, 46, 6);
      g += `<path d="M30 52 L20 40 M34 50 L44 38 M32 48 V34" stroke="#6b4423" stroke-width="3.4" stroke-linecap="round"/>`;
      const bolas = desnudo ? [[22, 36, 9], [42, 34, 9], [32, 26, 10]] : [[18, 40, 12], [46, 40, 12], [26, 28, 14], [40, 26, 14], [32, 16, 12], [32, 38, 13]];
      g += sil(bolas.map(([x, y, r], i) => [circ(x + (R() - .5) * 2, y + (R() - .5) * 2, r), i < 2 ? c[1] : i === 4 ? c[3] : c[2]]));
      if (!desnudo) g += `<g fill="${c[0]}" opacity=".35">${circ(22, 44, 7)}${circ(42, 44, 7)}${circ(32, 42, 8)}</g>`;
      g += marcas(R, 32, 30, 18, 14, c[0], 10) + `<path d="M24 20 q4 -5 10 -5" stroke="rgba(255,255,240,.5)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
      if (flor) g += [...Array(9)].map(() => `<circle cx="${n(16 + R() * 32)}" cy="${n(10 + R() * 34)}" r="2" fill="${flor}" stroke="${K}" stroke-width=".8"/>`).join('');
      if (desnudo) g += `<path d="M20 40 L14 32 M44 38 L50 30 M32 34 L28 22 M32 34 L37 20" stroke="#6b4423" stroke-width="2" stroke-linecap="round"/>`;
      return g;
    },
    // Frutal de la milpa: copa redonda con fruta del color de la estación.
    frutal({ fruta, flor, n: cant = 5 }) {
      const R = rnd(5);
      let g = sombra(24, 58, 15) + tronco(24, 58, 36, 4);
      g += sil([[circ(14, 30, 9), '#3f9a40'], [circ(34, 30, 9), '#3f9a40'], [circ(24, 20, 13), '#2f7d32'], [circ(24, 30, 10), '#3f9a40']]);
      g += marcas(R, 24, 24, 13, 9, '#1f5a28', 7) + `<path d="M17 14 q4 -4 9 -4" stroke="rgba(255,255,240,.5)" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      if (flor) g += [...Array(6)].map(() => `<circle cx="${n(12 + R() * 24)}" cy="${n(12 + R() * 20)}" r="1.8" fill="${flor}"/>`).join('');
      g += [...Array(cant)].map(() => `<circle cx="${n(13 + R() * 22)}" cy="${n(16 + R() * 18)}" r="2.8" fill="${fruta}" stroke="${K}" stroke-width="1"/>`).join('');
      return g;
    },
    // Oyamel / pino: pisos dentados oscuros, con nieve si nieva.
    pino({ nieve }) {
      let g = sombra(24, 68, 15) + tronco(24, 68, 56, 3.6);
      const pisos = [[54, 20, 18], [42, 17, 16], [30, 13, 14], [18, 9, 12]];
      const tri = (y, w, h) => `<path d="M${24 - w} ${y} L${24 - w * .55} ${y - h * .45} L${24 - w * .7} ${y - h * .45} L24 ${y - h} L${24 + w * .7} ${y - h * .45} L${24 + w * .55} ${y - h * .45} L${24 + w} ${y}Z"/>`;
      g += sil(pisos.map(([y, w, h], i) => [tri(y, w, h), ['#1f5a3a', '#26663f', '#2f7448', '#3a8452'][i]]), 3.4);
      g += pisos.map(([y, w]) => `<path d="M${24 - w * .6} ${y - 2} Q24 ${y + 2} ${24 + w * .6} ${y - 2}" stroke="#163f28" stroke-width="1.4" fill="none"/>`).join('');
      if (nieve) g += pisos.map(([y, w, h]) => `<path d="M${24 - w * .45} ${y - h * .5} L24 ${y - h} L${24 + w * .45} ${y - h * .5} Q24 ${y - h * .38} ${24 - w * .45} ${y - h * .5}Z" fill="#f4f6fa" stroke="${K}" stroke-width=".9"/>`).join('');
      return g;
    },
    // Palma de coco: tronco curvo anillado, frondas y cocos.
    palma() {
      let g = sombra(30, 84, 16);
      g += `<path d="M28 84 Q24 60 32 30" stroke="${K}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M28 84 Q24 60 32 30" stroke="#9a7048" stroke-width="6" fill="none" stroke-linecap="round"/>`;
      for (let y = 36; y < 82; y += 5) g += `<path d="M${n(25 + (82 - y) * .06)} ${y} h6" stroke="#6b4a2a" stroke-width="1.2"/>`;
      const fr = [[-155, 32], [-125, 30], [-55, 30], [-25, 32], [-90, 22], [-175, 26], [-5, 26]];
      g += fr.map(([a, L]) => { const r = a * Math.PI / 180, x2 = 32 + Math.cos(r) * L, y2 = 30 + Math.sin(r) * L * .7 + 8, cx = 32 + Math.cos(r) * L * .5, cy = 30 + Math.sin(r) * L * .5 - 6;
        return `<path d="M32 30 Q${n(cx)} ${n(cy - 7)} ${n(x2)} ${n(y2)} Q${n(cx)} ${n(cy + 9)} 32 30Z" fill="#3f9a40" stroke="${K}" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 30 Q${n(cx)} ${n(cy)} ${n(x2)} ${n(y2)}" stroke="#2a6a2c" stroke-width="1" fill="none"/>`; }).join('');
      g += [[29, 34], [35, 35], [32, 37]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#7a5a2a" stroke="${K}" stroke-width="1"/>`).join('');
      return g;
    },
    // Arbusto.
    arbusto({ c, flor }) {
      const R = rnd(3);
      let g = sombra(24, 36, 17);
      g += sil([[circ(14, 26, 9), c[1]], [circ(34, 26, 9), c[1]], [circ(24, 20, 11), c[2]], [circ(24, 28, 9), c[2]]]);
      g += marcas(R, 24, 24, 14, 8, c[0], 6);
      if (flor) g += [...Array(5)].map(() => `<circle cx="${n(12 + R() * 24)}" cy="${n(14 + R() * 14)}" r="2" fill="${flor}" stroke="${K}" stroke-width=".7"/>`).join('');
      return g;
    },
    // Zacate / maleza.
    zacate({ v = 0, c = '#5f9e3a' }) {
      const R = rnd(7 + v);
      let g = sombra(16, 29, 9);
      for (let i = 0; i < 7; i++) { const x = 8 + i * 2.6 + R() * 2, h = 10 + R() * 12, b = (R() - .5) * 8;
        g += `<path d="M${n(x)} 29 Q${n(x + b * .4)} ${n(29 - h * .6)} ${n(x + b)} ${n(29 - h)}" stroke="${K}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M${n(x)} 29 Q${n(x + b * .4)} ${n(29 - h * .6)} ${n(x + b)} ${n(29 - h)}" stroke="${i % 2 ? c : '#7ab84e'}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`; }
      if (v === 1) g += [[10, 12], [20, 10], [15, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#f2c84a" stroke="${K}" stroke-width=".8"/>`).join('');
      if (v === 2) g += [[11, 9], [21, 8]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="3.2" fill="#c8a060" stroke="${K}" stroke-width=".8"/>`).join('');
      return g;
    },
    // Piedras: 0 peñasco, 1 grupo de piedras, 2 laja con musgo.
    piedra({ v = 0 }) {
      if (v === 1) return sombra(20, 29, 15) + sil([[path('M4 28 Q4 18 12 17 Q20 16 21 24 Q21 29 12 29Z'), '#8a8478'], [path('M18 28 Q17 14 27 13 Q36 14 36 24 Q35 29 27 29Z'), '#9a948a']], 3) + `<path d="M22 16 Q27 14 31 16" stroke="#c8c2b6" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M8 20 Q11 18 14 19" stroke="#b4ae a2" stroke-width="1.6" fill="none"/>`.replace('#b4ae a2', '#b4aea2') + `<path d="M27 20 L30 26" stroke="#6a665e" stroke-width="1"/>`;
      if (v === 2) return sombra(20, 29, 17) + sil([[path('M3 27 Q4 19 14 18 L30 17 Q38 19 37 26 Q36 30 20 30 Q4 30 3 27Z'), '#a39d90']], 3) + `<path d="M8 21 Q20 18 32 20" stroke="#c8c2b6" stroke-width="2" fill="none"/><ellipse cx="12" cy="26" rx="5" ry="2" fill="#6a9a4a"/><ellipse cx="28" cy="25" rx="3" ry="1.4" fill="#7aaa5a"/>`;
      return sombra(20, 30, 16) + sil([[path('M4 28 Q2 16 10 10 Q18 4 28 8 Q37 12 36 22 Q36 30 20 30 Q6 30 4 28Z'), '#8f8a7e']], 3)
        + `<path d="M10 12 Q18 6 28 9 L24 16 Q16 15 10 12Z" fill="#b4aea2"/><path d="M28 9 Q36 13 35 22 L28 20 Z" fill="#a39d90"/><path d="M6 26 Q14 24 22 27 Q16 30 8 29Z" fill="#6f6a60"/><path d="M14 16 L18 22 L24 20" stroke="#5f5a52" stroke-width="1.2" fill="none"/><ellipse cx="30" cy="27" rx="4" ry="1.6" fill="#6a9a4a"/>`;
    },
    // Cactus: 0 nopal con tunas, 1 órgano, 2 biznaga con flor.
    cactus({ v = 0 }) {
      if (v === 1) { let g = sombra(24, 52, 13); const cols = [[24, 6, 10], [15, 18, 7], [33, 14, 7]];
        g += sil(cols.map(([x, top, w]) => [`<rect x="${x - w / 2}" y="${top}" width="${w}" height="${52 - top}" rx="${w / 2}"/>`, '#4f8a5a']), 3);
        g += cols.map(([x, top, w]) => `<path d="M${x} ${top + 4} V50" stroke="#2f6a3a" stroke-width="1.2"/><path d="M${x - w / 4} ${top + 5} V50" stroke="#7ab88a" stroke-width="1"/>`).join('');
        return g + `<circle cx="24" cy="7" r="2.4" fill="#f4ecd8" stroke="${K}" stroke-width=".8"/>`; }
      if (v === 2) return sombra(24, 52, 13) + sil([[ell(24, 42, 12, 11), '#5f9a6a']], 3) + [-8, -4, 0, 4, 8].map(d => `<path d="M${24 + d} 32 Q${24 + d * 1.3} 42 ${24 + d} 52" stroke="#2f6a3a" stroke-width="1.2" fill="none"/>`).join('') + [0, 72, 144, 216, 288].map(a => `<ellipse cx="24" cy="27" rx="2.4" ry="4" transform="rotate(${a} 24 31)" fill="#e05a8a" stroke="${K}" stroke-width=".8"/>`).join('') + `<circle cx="24" cy="31" r="2" fill="#f2c84a"/>`;
      let g = sombra(24, 52, 15);
      const pencas = [[24, 40, 9, 12, 0], [14, 26, 7, 9, -25], [33, 24, 7, 9, 25], [24, 16, 6, 8, 5]];
      g += sil(pencas.map(([x, y, rx, ry, a]) => [ell(x, y, rx, ry, a), '#5f9a5a']), 3);
      g += pencas.map(([x, y]) => [[-3, -3], [3, 1], [-1, 4], [2, -5]].map(([a, b]) => `<circle cx="${x + a}" cy="${y + b}" r=".9" fill="#e8e0c0"/>`).join('')).join('');
      g += [[18, 17], [28, 15], [38, 16], [21, 9]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="3" fill="#c0304a" stroke="${K}" stroke-width=".9"/>`).join('');
      return g;
    },
  };
  const TAM = { arbol:[64, 80], frutal:[48, 62], pino:[48, 72], palma:[64, 88], arbusto:[48, 40], zacate:[32, 32], piedra:[40, 32], cactus:[48, 56] };
  const svg = (tipo, op = {}) => { const [w, h] = TAM[tipo]; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w * 2}" height="${h * 2}">${A[tipo](op)}</svg>`; };
  window.CdmNatura = { svg, TAM };
})();
