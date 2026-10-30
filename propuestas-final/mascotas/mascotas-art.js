// Mascotas de Corazón de Maíz en estilo códice: gato, perro y xoloitzcuintle.
// CdmMascotas.svg(tipo, cuadro, parpadeo) → SVG 56×44 mirando a la derecha, patas en y=40.
// cuadro: 0 quieto, 1 y 2 caminando.
(function () {
  const K = '#1a1410', I = `stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`, I1 = `stroke="${K}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"`;
  const pata = (x, y0, alto, col, ancho = 4.4) => `<rect x="${x - ancho / 2}" y="${y0}" width="${ancho}" height="${alto}" rx="${ancho / 2}" fill="${col}" ${I1}/>`;
  const patas = (xs, cuadro, y0, col, ancho) => xs.map((x, i) => { const d = cuadro === 0 ? 0 : ((i % 2) ^ (cuadro === 2 ? 1 : 0)) ? -2 : 1.2; return pata(x + d, y0, 40 - y0 - (d < 0 ? 1.4 : 0), col, ancho); }).join('');
  const ojo = (x, y, iris, parpadeo, rasgado) => parpadeo ? `<path d="M${x - 2.6} ${y} q2.6 1.6 5.2 0" stroke="${K}" stroke-width="1.4" fill="none"/>`
    : `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="${rasgado ? 2.8 : 2.4}" fill="${iris}" ${I1}/>` + (rasgado ? `<ellipse cx="${x + .3}" cy="${y}" rx=".8" ry="2.2" fill="${K}"/>` : `<circle cx="${x + .3}" cy="${y}" r="1.4" fill="${K}"/>`) + `<circle cx="${x - .7}" cy="${y - .9}" r=".7" fill="#fff"/>`;
  const sombra = `<ellipse cx="27" cy="40.5" rx="16" ry="2.6" fill="rgba(26,20,16,.22)"/>`;
  const A = {
    // Gato calicó: blanco con manchas naranja y negra, ojos verdes, bigotes.
    gato(cuadro, parp) {
      const by = cuadro ? -0.6 : 0;
      let g = sombra;
      g += `<path d="M10 26 Q2 20 5 10 Q7 6 9 9" fill="none" stroke="${K}" stroke-width="5.4" stroke-linecap="round"/><path d="M10 26 Q2 20 5 10 Q7 6 9 9" fill="none" stroke="#fbf7ee" stroke-width="3.2" stroke-linecap="round"/><path d="M5 12 Q6 8 8.6 9" fill="none" stroke="#e8903a" stroke-width="3.2" stroke-linecap="round"/>`;
      g += patas([14, 19, 31, 36], cuadro, 30, '#fbf7ee', 4.4);
      g += `<ellipse cx="25" cy="${26 + by}" rx="14" ry="8.4" fill="#fbf7ee" ${I}/>`;
      g += `<path d="M17 ${20 + by} Q24 ${15 + by} 31 ${19 + by} Q30 ${25 + by} 22 ${25 + by} Q16 ${24 + by} 17 ${20 + by}Z" fill="#e8903a"/><path d="M12 ${24 + by} Q14 ${20 + by} 18 ${21 + by} Q18 ${27 + by} 13 ${29 + by}Z" fill="#2a2420"/>`;
      g += `<ellipse cx="25" cy="${26 + by}" rx="14" ry="8.4" fill="none" ${I}/>`;
      const hx = 40, hy = 17 + by;
      g += `<path d="M${hx - 8} ${hy - 4} L${hx - 7} ${hy - 13} L${hx - 2} ${hy - 7}Z" fill="#2a2420" ${I1}/><path d="M${hx + 2} ${hy - 7} L${hx + 7} ${hy - 13} L${hx + 8} ${hy - 4}Z" fill="#e8903a" ${I1}/><path d="M${hx + 3.6} ${hy - 7} L${hx + 6.4} ${hy - 10.6} L${hx + 6.8} ${hy - 6}Z" fill="#ffc0b0"/>`;
      g += `<ellipse cx="${hx}" cy="${hy}" rx="9.4" ry="8.4" fill="#fbf7ee" ${I}/><path d="M${hx + 1} ${hy - 8} Q${hx + 9} ${hy - 7} ${hx + 9} ${hy}" fill="#e8903a" stroke="none"/><ellipse cx="${hx}" cy="${hy}" rx="9.4" ry="8.4" fill="none" ${I}/>`;
      g += ojo(hx - 3.4, hy - 1, '#3dba5a', parp, true) + ojo(hx + 3.8, hy - 1, '#3dba5a', parp, true);
      g += `<path d="M${hx - 1} ${hy + 3} h2.4 l-1.2 1.4z" fill="#ff8fa0" ${I1}/><path d="M${hx + .2} ${hy + 4.4} q-1.6 1.8 -3 .6 M${hx + .2} ${hy + 4.4} q1.6 1.8 3 .6" stroke="${K}" stroke-width="1" fill="none"/>`;
      g += `<path d="M${hx + 4} ${hy + 3} l8 -1 M${hx + 4} ${hy + 4.4} l8 1.4 M${hx - 4} ${hy + 3} l-7 -1" stroke="#8a8078" stroke-width=".8"/>`;
      return g;
    },
    // Perro: pelaje leonado con lomo más oscuro, máscara negra, orejas caídas y collar rosa.
    perro(cuadro, parp) {
      const by = cuadro ? -0.8 : 0, cola = cuadro === 2 ? -3 : cuadro === 1 ? 2 : 0;
      let g = sombra;
      g += `<path d="M10 22 Q4 ${16 + cola} 7 ${10 + cola} Q10 ${8 + cola} 11 ${12 + cola}" fill="none" stroke="${K}" stroke-width="5.6" stroke-linecap="round"/><path d="M10 22 Q4 ${16 + cola} 7 ${10 + cola} Q10 ${8 + cola} 11 ${12 + cola}" fill="none" stroke="#e8c99a" stroke-width="3.4" stroke-linecap="round"/>`;
      g += patas([14, 19, 31, 36], cuadro, 28, '#c9a46c', 5);
      g += `<ellipse cx="25" cy="${24 + by}" rx="15" ry="9" fill="#e8c99a" ${I}/><path d="M12 ${21 + by} Q25 ${13 + by} 38 ${20 + by}" stroke="#c9a46c" stroke-width="4.4" fill="none"/><path d="M15 ${29 + by} Q25 ${33 + by} 35 ${29 + by}" stroke="#f3ddb4" stroke-width="3" fill="none"/><ellipse cx="25" cy="${24 + by}" rx="15" ry="9" fill="none" ${I}/>`;
      g += `<path d="M34 ${18 + by} Q37 ${24 + by} 41 ${25 + by}" stroke="#ff7aa8" stroke-width="3.4" fill="none" stroke-linecap="round"/><circle cx="38" cy="${25 + by}" r="1.6" fill="#f2c84a" ${I1}/>`;
      const hx = 42, hy = 14 + by;
      g += `<ellipse cx="${hx}" cy="${hy}" rx="9.4" ry="9" fill="#e8c99a" ${I}/>`;
      g += `<path d="M${hx - 7} ${hy - 6} Q${hx - 13} ${hy - 2} ${hx - 10} ${hy + 7} Q${hx - 6} ${hy + 4} ${hx - 5} ${hy - 3}Z" fill="#2a2420" ${I1}/><path d="M${hx + 5} ${hy - 7} Q${hx + 12} ${hy - 3} ${hx + 10} ${hy + 5} Q${hx + 7} ${hy + 3} ${hx + 4} ${hy - 4}Z" fill="#2a2420" ${I1}/>`;
      g += `<ellipse cx="${hx + 3}" cy="${hy + 4}" rx="6.4" ry="4.4" fill="#2a2420" ${I1}/><ellipse cx="${hx + 5.6}" cy="${hy + 2.4}" rx="2" ry="1.5" fill="#111"/>`;
      g += ojo(hx - 2.8, hy - 2, '#5a3a1e', parp, false) + ojo(hx + 3.6, hy - 2.4, '#5a3a1e', parp, false);
      g += `<path d="M${hx - 3} ${hy - 7} q3 -1.6 6 0" stroke="#c9a46c" stroke-width="1.2" fill="none"/>`;
      if (cuadro) g += `<path d="M${hx + 2} ${hy + 7} q1.4 4 3.4 0z" fill="#ff7a8a" ${I1}/>`;
      return g;
    },
    // Xoloitzcuintle: perro pelón gris pizarra, orejas altas, copete y collar de cuentas de jade.
    xolo(cuadro, parp) {
      const by = cuadro ? -0.6 : 0;
      let g = sombra;
      g += `<path d="M10 23 Q4 20 4 12" fill="none" stroke="${K}" stroke-width="4.4" stroke-linecap="round"/><path d="M10 23 Q4 20 4 12" fill="none" stroke="#4a4448" stroke-width="2.4" stroke-linecap="round"/>`;
      g += patas([14, 19, 30, 35], cuadro, 26, '#4a4448', 3.8);
      g += `<ellipse cx="24" cy="${23 + by}" rx="14" ry="7.4" fill="#4a4448" ${I}/><path d="M14 ${20 + by} Q24 ${15 + by} 34 ${19 + by}" stroke="#6a6468" stroke-width="2.4" fill="none"/><path d="M17 ${26 + by} q4 2 8 0" stroke="#3a3438" stroke-width="1.2" fill="none"/>`;
      const hx = 40, hy = 17 + by;
      g += `<path d="M${hx - 5} ${hy - 4} L${hx - 7} ${hy - 16} L${hx - 1} ${hy - 6}Z M${hx + 1} ${hy - 6} L${hx + 4} ${hy - 17} L${hx + 6} ${hy - 4}Z" fill="#4a4448" ${I1}/><path d="M${hx - 5} ${hy - 7} L${hx - 6} ${hy - 13} L${hx - 2.6} ${hy - 7}Z M${hx + 2} ${hy - 7} L${hx + 3.8} ${hy - 13} L${hx + 4.6} ${hy - 7}Z" fill="#c88a8a"/>`;
      g += `<path d="M${hx - 7} ${hy} Q${hx - 6} ${hy - 7} ${hx} ${hy - 7} Q${hx + 6} ${hy - 7} ${hx + 7} ${hy - 2} L${hx + 14} ${hy + 1} Q${hx + 15} ${hy + 5} ${hx + 11} ${hy + 6} L${hx + 2} ${hy + 6} Q${hx - 6} ${hy + 6} ${hx - 7} ${hy}Z" fill="#4a4448" ${I}/>`;
      g += `<path d="M${hx - 3} ${hy - 7} q2 -4 4 -1 q1 -3 3 0" fill="#e8e0d8" ${I1}/><circle cx="${hx + 14}" cy="${hy + 2}" r="1.6" fill="#111"/>`;
      g += ojo(hx + 3, hy - 1.6, '#c8902a', parp, false);
      g += [33, 35.6, 38.2, 40.8].map((x, i) => `<circle cx="${x}" cy="${hy + 8 + Math.abs(i - 1.5)}" r="1.5" fill="#3fa37a" ${I1}/>`).join('');
      return g;
    },
  };
  const svg = (tipo, cuadro = 0, parp = false) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 44" width="112" height="88">${(A[tipo] || A.perro)(cuadro, parp)}</svg>`;
  window.CdmMascotas = { svg, TIPOS:Object.keys(A) };
})();
