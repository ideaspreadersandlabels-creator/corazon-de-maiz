// Animales de Corazón de Maíz en estilo códice. Todos miran a la derecha; las patas tocan el piso en P (pie).
// CdmAnimales.svg(tipo, op) → SVG; CdmAnimales.TAM[tipo] = [ancho, alto, pieY, centroX].
(function () {
  const K = '#1a1410', I = `stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`, I1 = `stroke="${K}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"`;
  const n = v => +(+v).toFixed(1);
  const pata = (x, y0, y1, col, w = 3) => `<path d="M${n(x)} ${n(y0)} L${n(x)} ${n(y1)}" stroke="${K}" stroke-width="${w + 2}" stroke-linecap="round"/><path d="M${n(x)} ${n(y0)} L${n(x)} ${n(y1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/>`;
  const zancada = (fr, i) => fr === 0 ? 0 : ((i % 2) ^ (fr === 2 ? 1 : 0)) ? -2.4 : 2.4;
  const ojo = (x, y, r = 1.4) => `<circle cx="${x}" cy="${y}" r="${r + .5}" fill="#fff"/><circle cx="${x + .3}" cy="${y}" r="${r}" fill="${K}"/>`;
  const A = {
    // Guajolote: plumaje café con brillo, cola abierta (abanico) o cerrada, cabeza azul con moco rojo.
    guajolote({ fr = 0, abanico = false, pica = false }) {
      let g = `<ellipse cx="22" cy="44" rx="12" ry="2.4" fill="rgba(26,20,16,.22)"/>`;
      g += pata(19 + zancada(fr, 0) * .6, 37, 44, '#c98a7a', 2.6) + pata(25 + zancada(fr, 1) * .6, 37, 44, '#c98a7a', 2.6);
      if (abanico) g += [...Array(9)].map((_, i) => { const a = (-150 + i * 15) * Math.PI / 180, x2 = 16 + Math.cos(a) * 18, y2 = 24 + Math.sin(a) * 18; return `<path d="M16 26 L${n(x2 - 3)} ${n(y2)} L${n(x2 + 3)} ${n(y2 - 1)}Z" fill="${i % 2 ? '#5a4030' : '#3a2a20'}" ${I1}/><circle cx="${n(x2)}" cy="${n(y2)}" r="1.8" fill="#e8d8b0" ${I1}/>`; }).join('');
      else g += `<path d="M14 26 Q4 24 6 32 Q10 34 14 31Z" fill="#3a2a20" ${I}/><path d="M7 30 l4 -1" stroke="#e8d8b0" stroke-width="1.2"/>`;
      g += `<ellipse cx="22" cy="29" rx="14" ry="10" fill="#4a3628" ${I}/><path d="M12 26 Q22 20 33 25" stroke="#6a5040" stroke-width="2" fill="none"/>`;
      g += [13, 17, 21, 25, 29].map((x, i) => `<path d="M${x} 25 q2 5 0 10" stroke="${i % 2 ? '#7a6050' : '#2f8a7a'}" stroke-width="1.4" fill="none"/>`).join('');
      const hy = pica ? 6 : 0;
      g += `<path d="M28 24 Q31 18 31 ${12 + hy}" stroke="${K}" stroke-width="5.4" fill="none" stroke-linecap="round"/><path d="M28 24 Q31 18 31 ${12 + hy}" stroke="#4a3628" stroke-width="3.4" fill="none" stroke-linecap="round"/>`;
      g += `<circle cx="32" cy="${10 + hy}" r="4" fill="#b8c8e0" ${I1}/><path d="M35 ${9 + hy} l4 1 l-4 1.4z" fill="#e8b070" ${I1}/><path d="M33 ${13 + hy} q2 4 0 7 q-2 -3 0 -7z" fill="#d9483b" ${I1}/><path d="M31 ${6 + hy} q2 -4 3 0" fill="#d9483b" ${I1}/>` + ojo(32.6, 9 + hy, 1);
      return g;
    },
    // Conejo: café claro, panza crema, cola blanca, orejas largas.
    conejo({ salto = 0 }) {
      const y = -salto; let g = `<ellipse cx="20" cy="33" rx="10" ry="2" fill="rgba(26,20,16,.22)"/>`;
      g += `<ellipse cx="12" cy="${24 + y}" rx="3.4" ry="3.2" fill="#f4ecd8" ${I1}/><ellipse cx="18" cy="${24 + y}" rx="10" ry="7.4" fill="#b89a78" ${I}/><ellipse cx="21" cy="${27 + y}" rx="5" ry="3" fill="#e0ccae"/>`;
      g += `<ellipse cx="14" cy="${30 + y}" rx="5" ry="2.4" fill="#a8896a" ${I1}/><ellipse cx="25" cy="${30 + y}" rx="2.6" ry="2" fill="#a8896a" ${I1}/>`;
      g += `<ellipse cx="26.6" cy="${7 + y}" rx="2.4" ry="7" transform="rotate(10 26.6 ${7 + y})" fill="#b89a78" ${I1}/><ellipse cx="30.6" cy="${8 + y}" rx="2.4" ry="7" transform="rotate(24 30.6 ${8 + y})" fill="#b89a78" ${I1}/><ellipse cx="30.6" cy="${8 + y}" rx="1" ry="4.4" transform="rotate(24 30.6 ${8 + y})" fill="#e8b8b0"/>`;
      g += `<circle cx="28" cy="${18 + y}" r="6" fill="#b89a78" ${I}/>` + ojo(30, 17 + y, 1.2) + `<circle cx="33.6" cy="${19.4 + y}" r="1" fill="#e08a9a"/><path d="M33 ${20.4 + y} l3 -0.6 M33 ${21 + y} l3 1" stroke="#8a7a68" stroke-width=".6"/>`;
      return g;
    },
    // Pato: adulto negro con pecho blanco, carúncula roja; cría amarilla. «nada» oculta las patas.
    pato({ cria = false, nada = false, fr = 0 }) {
      const cu = cria ? '#f0d860' : '#2a2a30', pe = cria ? '#f8e890' : '#f4ecd8';
      let g = nada ? '' : `<ellipse cx="20" cy="33" rx="11" ry="2" fill="rgba(26,20,16,.22)"/>` + pata(17 + zancada(fr, 0) * .5, 26, 33, '#e8a040', 2) + pata(22 + zancada(fr, 1) * .5, 26, 33, '#e8a040', 2);
      g += `<path d="M7 20 L3 15 L10 18Z" fill="${cu}" ${I1}/><ellipse cx="18" cy="22" rx="12" ry="7" fill="${cu}" ${I}/><ellipse cx="22" cy="24" rx="6.4" ry="3.6" fill="${pe}"/><path d="M12 20 q6 -3 11 0" stroke="${cria ? '#d8c040' : '#4a4a58'}" stroke-width="1.4" fill="none"/>`;
      g += `<circle cx="29" cy="13" r="5.4" fill="${cu}" ${I}/><path d="M33 13 Q39 12 39 14.6 Q36 16 33 15.4Z" fill="#e8a040" ${I1}/>` + ojo(30, 11.6, 1.1);
      if (!cria) g += `<ellipse cx="31" cy="15" rx="2.6" ry="2" fill="#c0392b" ${I1}/>`;
      return g;
    },
    // Venado cola blanca: hembra o macho con astas.
    venado({ fr = 0, macho = false }) {
      let g = `<ellipse cx="30" cy="60" rx="16" ry="3" fill="rgba(26,20,16,.22)"/>`;
      g += [[19, 0], [24, 1], [36, 0], [41, 1]].map(([x, i]) => pata(x + zancada(fr, i), 40, 60, '#7a5838', 3.8)).join('');
      g += `<ellipse cx="14" cy="32" rx="3.6" ry="4" fill="#f4ecd8" ${I1}/><ellipse cx="30" cy="35" rx="17" ry="10" fill="#a07850" ${I}/><ellipse cx="30" cy="40" rx="11" ry="3.4" fill="#c8a07a"/>` + [22, 27, 33].map(x => `<circle cx="${x}" cy="31" r="1.2" fill="#e8d8b8"/>`).join('');
      g += `<path d="M40 30 L44 16" stroke="${K}" stroke-width="8" stroke-linecap="round"/><path d="M40 30 L44 16" stroke="#a07850" stroke-width="5.6" stroke-linecap="round"/>`;
      g += `<path d="M42 10 Q50 9 53 14 Q51 17 45 17 Q41 16 42 10Z" fill="#a07850" ${I}/><circle cx="53" cy="14" r="1.4" fill="${K}"/>` + ojo(46, 12, 1.1) + `<path d="M41 10 L38 4 L43 8Z" fill="#7a5838" ${I1}/>`;
      if (macho) g += `<path d="M44 9 L42 0 L38 -3 M42 4 L46 -1 M42 1 L40 -4" stroke="${K}" stroke-width="3" fill="none" stroke-linecap="round" transform="translate(0 6)"/><path d="M44 9 L42 0 L38 -3 M42 4 L46 -1 M42 1 L40 -4" stroke="#e8d8b8" stroke-width="1.6" fill="none" stroke-linecap="round" transform="translate(0 6)"/>`;
      return g;
    },
    // Caballo (de los españoles): pelaje del color dado, crin y cola oscuras, silla roja si lleva jinete.
    caballo({ fr = 0, col = '#7a4a22', crin = '#2a1a10' }) {
      let g = `<ellipse cx="38" cy="60" rx="22" ry="3.4" fill="rgba(26,20,16,.22)"/>`;
      g += `<path d="M18 30 Q8 34 10 48" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M18 30 Q8 34 10 48" stroke="${crin}" stroke-width="4.6" fill="none" stroke-linecap="round"/>`;
      g += [[24, 0], [30, 1], [48, 0], [54, 1]].map(([x, i]) => pata(x + zancada(fr, i) * 1.3, 38, 58, col, 4.4) + `<rect x="${x + zancada(fr, i) * 1.3 - 3}" y="56" width="6" height="4" fill="${K}"/>`).join('');
      g += `<ellipse cx="38" cy="34" rx="20" ry="10" fill="${col}" ${I}/><path d="M24 30 Q38 26 52 30" stroke="rgba(255,255,255,.15)" stroke-width="3" fill="none"/>`;
      g += `<path d="M50 30 L58 12 L66 14 L58 34Z" fill="${col}" ${I}/><path d="M57 11 Q64 6 72 14 Q74 20 70 22 Q66 22 62 18Z" fill="${col}" ${I}/><path d="M56 12 Q52 20 52 28" stroke="${crin}" stroke-width="4" fill="none"/><path d="M60 8 L59 3 L63 7Z" fill="${col}" ${I1}/>` + ojo(64, 12, 1.2) + `<circle cx="71" cy="18" r="1" fill="${K}"/>`;
      return g;
    },
    // Bisonte: lomo alto y peludo, cuernos cortos.
    bisonte({ fr = 0 }) {
      let g = `<ellipse cx="40" cy="56" rx="26" ry="3.4" fill="rgba(26,20,16,.25)"/>`;
      g += [[22, 0], [28, 1], [50, 0], [56, 1]].map(([x, i]) => pata(x + zancada(fr, i), 38, 55, '#3a2418', 5)).join('');
      g += `<path d="M14 34 Q12 22 26 20 Q40 10 54 16 Q62 20 62 32 Q60 42 40 42 Q18 44 14 34Z" fill="#6a4a30" ${I}/><path d="M40 12 Q56 12 62 24 Q66 38 58 44 Q50 44 48 30 Q46 20 40 12Z" fill="#4a3020" ${I}/>`;
      g += [...Array(10)].map((_, i) => `<path d="M${44 + (i % 5) * 4} ${18 + Math.floor(i / 5) * 10} q2 3 0 6" stroke="#2a1a10" stroke-width="1.2" fill="none"/>`).join('');
      g += `<ellipse cx="66" cy="38" rx="8" ry="9" fill="#3a2418" ${I}/><path d="M61 30 Q58 24 63 24 M71 30 Q74 24 69 24" stroke="#e8e0d0" stroke-width="2.4" fill="none"/>` + ojo(68, 35, 1.1) + `<path d="M64 46 q2 4 4 0" fill="#3a2418" ${I1}/><path d="M14 32 q-6 2 -6 8" stroke="${K}" stroke-width="2" fill="none"/>`;
      return g;
    },
  };
  const TAM = { guajolote:[48, 48, 44, 22], conejo:[40, 36, 33, 20], pato:[44, 36, 33, 20], venado:[64, 64, 60, 30], caballo:[80, 64, 60, 38], bisonte:[80, 60, 56, 40] };
  // Aire arriba para orejas y astas.
  const PAD = { conejo:6, venado:6, guajolote:2 };
  const svg = (t, op = {}) => { const [w, h] = TAM[t], p = PAD[t] || 0; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${-p} ${w} ${h + p}" width="${w * 2}" height="${(h + p) * 2}">${A[t](op)}</svg>`; };
  window.CdmAnimales = { svg, TAM, PAD };
})();
