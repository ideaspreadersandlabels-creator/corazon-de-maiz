// Guerreros (águila y jaguar), tarántula, serpiente de cascabel y cangrejo en estilo códice.
(function () {
  const K = '#1a1410', I = `stroke="${K}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`, I1 = `stroke="${K}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"`;
  const n = v => +(+v).toFixed(1);
  // Guerrero: traje completo (tlahuiztli), yelmo de jaguar o de águila, chimalli y macuahuitl.
  function guerrero({ tipo = 'aguila', fr = 0, golpe = 0 }) {
    const jag = tipo === 'jaguar', traje = jag ? '#e0a830' : '#8a5a30', traje2 = jag ? '#c88a20' : '#6a4224';
    const d = fr === 0 ? 0 : fr === 1 ? 2.4 : -2.4;
    let g = `<ellipse cx="24" cy="62" rx="12" ry="2.6" fill="rgba(26,20,16,.25)"/>`;
    // chimalli (detrás)
    g += `<circle cx="13" cy="36" r="9" fill="#f4ecd8" ${I}/><circle cx="13" cy="36" r="6.4" fill="${jag ? '#2f6aa8' : '#c0392b'}" ${I1}/><path d="M7.6 38 h3 v-3 h4 v3 h3" stroke="#f4ecd8" stroke-width="1.6" fill="none"/>` + [9, 12, 15, 18].map((x, i) => `<path d="M${x} 44 l-1.4 7 h2.8z" fill="${['#3fa37a', '#c0392b', '#f2c84a', '#3fa37a'][i]}" ${I1}/>`).join('');
    // piernas
    g += `<path d="M${20 + d} 46 L${19 + d} 61 M${28 - d} 46 L${29 - d} 61" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M${20 + d} 46 L${19 + d} 61 M${28 - d} 46 L${29 - d} 61" stroke="${traje}" stroke-width="4.6" stroke-linecap="round"/>`;
    g += `<path d="M${17 + d} 61 h5 M${27 - d} 61 h5" stroke="#6b4423" stroke-width="2.6" stroke-linecap="round"/>`;
    // cuerpo
    g += `<path d="M15 27 Q24 23 33 27 L34 47 Q24 50 14 47Z" fill="${traje}" ${I}/>`;
    if (jag) g += [[19, 32], [27, 30], [22, 40], [30, 41], [17, 44]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="none" stroke="${K}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r=".7" fill="${K}"/>`).join('');
    else g += [30, 35, 40, 45].map(y => `<path d="M15 ${y} q4 3 4.6 0 q4 3 4.6 0 q4 3 4.6 0 q4 3 4.6 0" stroke="${traje2}" stroke-width="1.4" fill="none"/>`).join('');
    g += `<path d="M14 44 H34" stroke="#f4ecd8" stroke-width="2.4"/>`;
    // brazo con macuahuitl
    const a = golpe ? -70 : 20, r = a * Math.PI / 180, hx = 33 + Math.cos(r) * 6, hy = 32 + Math.sin(r) * 6, tx = hx + Math.cos(r - .3) * 16, ty = hy + Math.sin(r - .3) * 16;
    g += `<path d="M31 30 L${n(hx)} ${n(hy)}" stroke="${K}" stroke-width="6" stroke-linecap="round"/><path d="M31 30 L${n(hx)} ${n(hy)}" stroke="#b07a4a" stroke-width="3.6" stroke-linecap="round"/>`;
    g += `<path d="M${n(hx)} ${n(hy)} L${n(tx)} ${n(ty)}" stroke="${K}" stroke-width="5.4" stroke-linecap="round"/><path d="M${n(hx)} ${n(hy)} L${n(tx)} ${n(ty)}" stroke="#8a5a30" stroke-width="3.4" stroke-linecap="round"/>`;
    for (let i = 1; i <= 4; i++) { const px = hx + (tx - hx) * i / 4.6, py = hy + (ty - hy) * i / 4.6, ox = -Math.sin(r - .3) * 3.4, oy = Math.cos(r - .3) * 3.4; g += `<path d="M${n(px - ox)} ${n(py - oy)} l${n(-ox * .6)} ${n(-oy * .6)} M${n(px + ox)} ${n(py + oy)} l${n(ox * .6)} ${n(oy * .6)}" stroke="#1a1428" stroke-width="2.4"/>`; }
    // cabeza dentro del yelmo
    g += `<circle cx="25" cy="18" r="6.4" fill="#b07a4a" ${I1}/><circle cx="27.4" cy="17.4" r="1.2" fill="${K}"/><path d="M24 21.6 h4" stroke="#8a4030" stroke-width="1.2"/>`;
    if (jag) g += `<path d="M16 18 Q14 6 25 5 Q36 6 34 16 L34 12 Q30 13 30 18 Q25 10 18 18Z" fill="${traje}" ${I}/><path d="M19 7 L18 2 L22 5Z M29 5 L32 1 L32 6Z" fill="${traje}" ${I1}/><path d="M18 18 q2 4 0 8 M32 17 q-1 4 1 8" stroke="${K}" stroke-width="1.6" fill="none"/><path d="M19 14 l2 2 l2 -2 l2 2 l2 -2 l2 2" stroke="#f4ecd8" stroke-width="1.4" fill="none"/><circle cx="22" cy="9" r="1.4" fill="${K}"/><circle cx="29" cy="9" r="1.4" fill="${K}"/>`;
    else g += `<path d="M16 19 Q14 7 24 6 Q32 6 34 12 L40 15 L34 16 Q31 13 27 12 Q22 12 18 19Z" fill="#6a4224" ${I}/><path d="M33 12 L40 15 L33 16Z" fill="#f2c84a" ${I1}/><circle cx="29" cy="9.6" r="1.4" fill="#f2c84a" ${I1}/><path d="M18 8 q-4 -6 1 -7 M21 6 q-2 -6 3 -6" stroke="#f4ecd8" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    g += [0, 1, 2].map(i => `<path d="M${20 + i * 3} 6 l${-2 + i * 2} -8" stroke="${['#3fa37a', '#c0392b', '#3fa37a'][i]}" stroke-width="2.2" stroke-linecap="round"/>`).join('');
    return g;
  }
  function tarantula({ fr = 0 }) {
    const l = fr ? 1.6 : -1.6;
    let g = `<ellipse cx="16" cy="28" rx="11" ry="2" fill="rgba(26,20,16,.22)"/>`;
    for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const y0 = 18 + i * 1.6, kx = 16 + s * (9 + i * 1.6), ky = 12 + i * 3 + (i % 2 ? l : -l); g += `<path d="M16 ${y0} Q${n(kx)} ${n(ky)} ${n(16 + s * (12 + i * 1.4))} ${n(26 + i * .6)}" stroke="${K}" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M16 ${y0} Q${n(kx)} ${n(ky)} ${n(16 + s * (12 + i * 1.4))} ${n(26 + i * .6)}" stroke="#5a3a28" stroke-width="1.2" fill="none" stroke-linecap="round"/>`; }
    g += `<ellipse cx="16" cy="22" rx="6.4" ry="5.4" fill="#3a2418" ${I1}/><path d="M12 21 q4 3 8 0" stroke="#d9883b" stroke-width="1.6" fill="none"/><circle cx="16" cy="15" r="4.2" fill="#5a3a28" ${I1}/><circle cx="14.6" cy="13.8" r=".9" fill="#ff4040"/><circle cx="17.4" cy="13.8" r=".9" fill="#ff4040"/>`;
    return g;
  }
  function serpiente({ fr = 0 }) {
    const ph = fr * 1.4, pts = [...Array(11)].map((_, i) => [4 + i * 2.4, 22 + Math.sin(i * .9 + ph) * 3.4]);
    const d = 'M' + pts.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L');
    let g = `<ellipse cx="17" cy="27" rx="13" ry="2" fill="rgba(26,20,16,.2)"/><path d="${d}" stroke="${K}" stroke-width="6.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="#a07040" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    g += pts.slice(1, -1).filter((_, i) => i % 2 === 0).map(([x, y]) => `<path d="M${n(x - 1.4)} ${n(y)} l1.4 -1.6 l1.4 1.6 l-1.4 1.6z" fill="#4a2a14"/>`).join('');
    g += [0, 1, 2].map(i => `<ellipse cx="${3.2 - i * 1.6}" cy="${pts[0][1] - 1 - i * .4}" rx="1.4" ry="1.8" fill="#e8d8b0" ${I1}/>`).join('');
    const [hx, hy] = pts[10];
    g += `<ellipse cx="${n(hx + 3)}" cy="${n(hy)}" rx="4.4" ry="3.4" fill="#8a5a30" ${I1}/><circle cx="${n(hx + 4.4)}" cy="${n(hy - 1)}" r=".9" fill="#f2c84a"/><path d="M${n(hx + 7)} ${n(hy + .6)} l3 0 l1 -1 M${n(hx + 10)} ${n(hy + .6)} l1 1" stroke="#d9483b" stroke-width=".9" fill="none"/>`;
    return g;
  }
  function cangrejo({ fr = 0 }) {
    const p = fr ? 1 : -1;
    let g = `<ellipse cx="16" cy="27" rx="11" ry="2" fill="rgba(26,20,16,.2)"/>`;
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) g += `<path d="M${16 + s * 5} ${21 + i} l${s * 5} ${3 + i} l${s * 2} ${2}" stroke="${K}" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M${16 + s * 5} ${21 + i} l${s * 5} ${3 + i} l${s * 2} 2" stroke="#c0301e" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;
    for (const s of [-1, 1]) g += `<path d="M${16 + s * 6} 18 Q${16 + s * 10} ${14 + p} ${16 + s * 11} 12" stroke="${K}" stroke-width="3" fill="none"/><path d="M${16 + s * 11} 12 q${s * 4} -4 ${s * 1} -6 q${-s * 3} 2 ${-s * 1} 6z" fill="#d8402a" ${I1}/>`;
    g += `<ellipse cx="16" cy="20" rx="8" ry="5.4" fill="#d8402a" ${I1}/><path d="M11 19 q5 -3 10 0" stroke="#f08060" stroke-width="1.4" fill="none"/><path d="M13 15 V12 M19 15 V12" stroke="${K}" stroke-width="1.2"/><circle cx="13" cy="11.6" r="1.4" fill="${K}"/><circle cx="19" cy="11.6" r="1.4" fill="${K}"/>`;
    return g;
  }
  const A = { guerrero, tarantula, serpiente, cangrejo };
  const TAM = { guerrero:[58, 64, 62, 24], tarantula:[32, 32, 28, 16], serpiente:[36, 32, 27, 17], cangrejo:[32, 32, 27, 16] };
  const PAD = { guerrero:6 };
  const svg = (t, op = {}) => { const [w, h] = TAM[t], p = PAD[t] || 0; return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${-p} ${w} ${h + p}" width="${w * 2}" height="${(h + p) * 2}">${A[t](op)}</svg>`; };
  window.CdmCriaturas = { svg, TAM, PAD };
})();
