// Two new character styles for the Tlaxcallan cast (params from propuestas-v2/chars.js):
//  borgia — Códice Borgia (Puebla-Tlaxcala codex): big profile head, large eye, ear
//           spool, thick ink contour, flat colour, stepping pose, speech scroll.
//  barro  — Xochitécatl clay figurine (Tlaxcala): burnished terracotta doll with
//           jointed arms and legs, appliqué pellets and mineral paint.
"use strict";
(function () {
  const K = '#1a1410', ink = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
  const sh = (h, k) => '#' + [1, 3, 5].map(i => Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * k)).toString(16).padStart(2, '0')).join('');
  // Xicalcoliuhqui (stepped fret) band.
  const fret = (x0, x1, y, h, c) => { let d = ''; for (let x = x0; x < x1 - 8; x += 10) d += `M${x} ${y + h} v${-h * .5} h4 v${-h * .4} h5`; return `<path d="${d}" fill="none" stroke="${c}" stroke-width="2"/>`; };

  // ---------- Códice Borgia ----------
  function borgia(p) {
    const sk = p.skin, hair = p.hair, hs = p.hairStyle, top = p.top || '#f3ede2', trim = p.trim || '#c0392b', skirt = p.skirt || '#2f5fa8';
    const bw = [0, 4, 9][p.build || 0];
    let g = '';
    // Props behind the body.
    if (p.prop === 'lanza') g += `<path d="M112 196 V14" stroke="${K}" stroke-width="6"/><path d="M112 196 V14" stroke="#b07a3a" stroke-width="3"/><path d="M112 0 l-7 18 h14Z" fill="#3a3a4a" ${ink}/><path d="M106 26 l-6 8 M118 26 l6 8" stroke="#c0392b" stroke-width="4" stroke-linecap="round"/>`;
    if (p.prop === 'arco') g += `<path d="M112 70 C 134 100 134 160 112 190" fill="none" stroke="${K}" stroke-width="6"/><path d="M112 70 C 134 100 134 160 112 190" fill="none" stroke="#9a6438" stroke-width="3"/><path d="M112 70 V190" stroke="${K}" stroke-width="1.2"/>`;
    if (p.prop === 'baston') g += `<path d="M112 196 V28" stroke="${K}" stroke-width="6"/><path d="M112 196 V28" stroke="#b07a3a" stroke-width="3"/>${['#2f8f8a', '#3fa37a', '#c0392b'].map((c, i) => `<path transform="rotate(${-24 + i * 24} 112 30)" d="M112 30 C 107 18 108 6 112 0 C 116 6 117 18 112 30Z" fill="${c}" ${ink}/>`).join('')}<circle cx="112" cy="31" r="4" fill="#e9b33e" ${ink}/>`;
    // Feathers behind the head.
    if (p.head === 'plumas') g += ['#2f8f8a', '#3fa37a', '#7cb04a', '#e9b33e', '#c0392b', '#3fa37a', '#2f8f8a'].map((c, i) => `<g transform="rotate(${-78 + i * 15} 46 26)"><path d="M46 26 C 38 8 40 -18 46 -32 C 52 -18 54 8 46 26Z" fill="${c}" ${ink}/><path d="M46 20 V-24" stroke="${K}" stroke-width="1.2"/><circle cx="46" cy="-22" r="3.4" fill="#f6efe0" stroke="${K}" stroke-width="1.4"/></g>`).join('');
    // Hair mass behind.
    if (hs === 'afro') g += `<circle cx="56" cy="42" r="40" fill="${hair}" ${ink}/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<circle cx="${56 + Math.cos(a) * 38}" cy="${42 + Math.sin(a) * 38}" r="7" fill="${hair}" ${ink}/>`; }).join('')}`;
    else if (hs === 'rizos') g += `<path d="M36 34 C 22 70 22 120 32 138 L60 138 C 56 110 56 70 60 50Z" fill="${hair}" ${ink}/>${[48, 62, 76, 90, 104, 118, 132].map(y => `<circle cx="${28 + (y % 3)}" cy="${y}" r="8" fill="${hair}" ${ink}/>`).join('')}`;
    else if (hs === 'largo') g += `<path d="M36 34 C 24 70 24 116 32 138 L58 138 C 54 110 54 70 58 52Z" fill="${hair}" ${ink}/><path d="M34 60 C 30 90 30 116 34 132" stroke="#4a3a34" stroke-width="1.6" fill="none"/>`;
    else if (hs === 'coleta') g += `<path d="M36 38 C 14 46 8 90 18 116 C 24 96 28 72 42 54Z" fill="${hair}" ${ink}/><rect x="30" y="42" width="10" height="8" fill="${p.acc2 || '#c0392b'}" ${ink} transform="rotate(-30 35 46)"/>`;
    else if (hs === 'trenzas') g += `${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${36 - i * .6}" cy="${70 + i * 9}" rx="6" ry="6" fill="${hair}" ${ink}/>`).join('')}<rect x="28" y="138" width="12" height="6" fill="${p.acc2 || '#c0392b'}" ${ink}/>`;
    else if (hs === 'chongo') g += `<circle cx="38" cy="18" r="11" fill="${hair}" ${ink}/>`;
    // Back arm (behind the torso).
    g += `<path d="M44 96 C 36 112 36 124 40 134" fill="none" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M44 96 C 36 112 36 124 40 134" fill="none" stroke="${sh(sk, .85)}" stroke-width="7.4" stroke-linecap="round"/>`;
    // Legs and feet in profile, stepping forward.
    const foot = x => `<path d="M${x} 182 h9 v6 h14 c 5 0 5 8 0 8 h-25Z" fill="${sk}" ${ink}/><path d="M${x} 190 H${x + 26}" stroke="#7a4a24" stroke-width="3.4"/><path d="M${x + 4} 182 v6" stroke="#7a4a24" stroke-width="3"/>`;
    if (p.legs) {
      // Tilmatli: cape knotted on the front shoulder, hanging behind to the knees.
      if (p.style === 'tilma') g += `<path d="M${46 - bw} 86 C ${28 - bw} 112 ${22 - bw} 150 ${26 - bw} 174 L62 174 L68 94Z" fill="${top}" ${ink}/><path d="M${27 - bw} 162 L62 162 L62 174 L${26 - bw} 174Z" fill="${trim}" ${ink}/>${fret(29 - bw, 62, 163, 10, '#f3ede2')}`;
      g += `<path d="M48 132 L46 186 L57 186 L61 132Z" fill="${sh(sk, .86)}" ${ink}/><path d="M70 132 L75 186 L86 186 L83 132Z" fill="${sk}" ${ink}/>`;
      g += foot(42) + foot(74);
      // Maxtlatl: loincloth band with the front end hanging.
      g += `<path d="M${40 - bw} 126 H${88 + bw} L${88 + bw} 140 H${40 - bw}Z" fill="#f3ede2" ${ink}/><path d="M73 138 L90 138 L88 168 L75 168Z" fill="#f3ede2" ${ink}/><path d="M75 160 H88" stroke="${trim}" stroke-width="4"/>`;
    } else {
      g += foot(42) + foot(74);
      // Cueitl.
      g += `<path d="M${42 - bw} 132 H${88 + bw} L${96 + bw} 184 H${34 - bw}Z" fill="${skirt}" ${ink}/><path d="M${35 - bw} 170 H${95 + bw} L${96 + bw} 184 H${34 - bw}Z" fill="#f3ede2" ${ink}/>${fret(37 - bw, 95 + bw, 171, 12, trim)}`;
    }
    // Torso.
    if (p.style === 'quech') g += `<path d="M${42 - bw} 88 H${86 + bw} L${90 + bw} 132 H${38 - bw}Z" fill="#f3ede2" ${ink}/><path d="M${34 - bw} 88 H${94 + bw} L64 146Z" fill="${top}" ${ink}/><path d="M${42 - bw} 94 L64 136 L${86 + bw} 94" fill="none" stroke="${trim}" stroke-width="4"/>${Array.from({ length: 7 }, (_, i) => `<path d="M${58 + i * 2} 142 v8" stroke="${trim}" stroke-width="2"/>`).join('')}`;
    else if (p.style === 'tilma') g += `<path d="M${40 - bw} 86 H${88 + bw} L${88 + bw} 128 H${40 - bw}Z" fill="${sk}" ${ink}/><path d="M60 104 C 66 110 76 110 82 104" stroke="${sh(sk, .78)}" stroke-width="2" fill="none"/><path d="M44 90 C 58 102 74 102 86 94" stroke="${K}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M44 90 C 58 102 74 102 86 94" stroke="${top}" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="86" cy="94" r="5.5" fill="${top}" ${ink}/><path d="M84 98 L80 112 M88 98 L90 112" stroke="${K}" stroke-width="2.4"/>`;
    else if (p.style === 'armadura') { g += `<path d="M${40 - bw} 86 H${88 + bw} L${90 + bw} 136 H${38 - bw}Z" fill="${top}" ${ink}/>`; for (let y = 94; y < 134; y += 8) g += `<path d="M${40 - bw} ${y} H${88 + bw}" stroke="${K}" stroke-width="1.2"/>`; for (let x = 46 - bw; x < 88 + bw; x += 8) g += `<path d="M${x} 86 V136" stroke="${K}" stroke-width=".8"/>`; g += `<rect x="${38 - bw}" y="130" width="${52 + 2 * bw}" height="8" fill="${trim}" ${ink}/>`; }
    else { g += `<path d="M${38 - bw} 86 H${90 + bw} L${94 + bw} 138 H${34 - bw}Z" fill="${top}" ${ink}/><path d="M54 86 V100 H74 V86" fill="none" stroke="${trim}" stroke-width="3.4"/><path d="M${35 - bw} 126 H${93 + bw} L${94 + bw} 138 H${34 - bw}Z" fill="${p.band2 || trim}" ${ink}/>${fret(37 - bw, 93 + bw, 127, 10, p.hem2 || '#f3ede2')}`; if (p.stars) g += [[50, 112], [78, 108]].map(([x, y]) => `<path d="M${x} ${y - 4} l1.4 2.6 l2.6 1.4 l-2.6 1.4 l-1.4 2.6 l-1.4 -2.6 l-2.6 -1.4 l2.6 -1.4Z" fill="#f2c94c" stroke="${K}" stroke-width=".8"/>`).join(''); }
    if (p.jade) g += [52, 58, 64, 70, 76].map((x, i) => `<circle cx="${x}" cy="${90 + [0, 3, 4, 3, 0][i]}" r="3.4" fill="#3fa37a" ${ink}/>`).join('');
    // Neck and head.
    g += `<path d="M56 76 L56 88 L76 88 L74 78" fill="${sk}" ${ink}/>`;
    g += `<path d="M42 72 C 30 56 30 32 40 22 C 50 10 74 8 88 18 C 94 24 96 32 96 38 L102 48 C 103 50 102 52 100 52 L98 54 C 100 56 100 58 97 59 C 99 62 97 66 93 66 L92 72 C 88 78 76 82 66 82 L50 80Z" fill="${sk}" ${ink}/>`;
    g += `<path d="M76 38 C 80 32 88 32 92 38 C 88 43 80 43 76 38Z" fill="#fff" ${ink}/><circle cx="86" cy="38" r="2.8" fill="${K}"/><path d="M76 29 Q84 25 92 29" stroke="${K}" stroke-width="2.4" fill="none"/>`;
    g += `<path d="M92 63 h6" stroke="${K}" stroke-width="2.4"/>`;
    if (p.paint) g += `<path d="M66 50 H90" stroke="${p.paint}" stroke-width="4" stroke-linecap="round"/>`;
    if (p.freckles) g += [[74, 50], [79, 52], [84, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.2" fill="${sh(sk, .6)}"/>`).join('');
    g += `<circle cx="58" cy="52" r="9" fill="${p.orejeras ? '#e9b33e' : '#3fa37a'}" ${ink}/><circle cx="58" cy="52" r="3.6" fill="#f6efe0" ${ink}/>`;
    // Hair cap.
    if (hs === 'afro' || hs === 'rizos') g += `<path d="M38 60 C 28 32 46 10 72 12 C 84 12 92 18 94 28 C 84 24 74 24 66 28 C 62 36 54 42 46 42 C 42 48 40 54 38 60Z" fill="${hair}" ${ink}/>${[48, 60, 72, 84].map((x, i) => `<circle cx="${x}" cy="${16 + (i % 2) * 3}" r="6" fill="${hair}" ${ink}/>`).join('')}`;
    else g += `<path d="M38 60 C 28 32 46 10 72 12 C 84 12 92 18 94 28 C 84 24 74 24 66 28 C 62 36 54 42 46 42 C 42 48 40 54 38 60Z" fill="${hair}" ${ink}/><path d="M50 20 C 58 15 70 14 80 16" stroke="#4a3a34" stroke-width="2" fill="none"/>`;
    // Headwear.
    const band = c => `<path d="M38 34 C 54 22 76 20 94 28 L92 35 C 76 28 56 30 40 42Z" fill="${c}" ${ink}/>`;
    if (p.head === 'plumas') g += band('#e9b33e') + [50, 62, 74, 86].map(x => `<circle cx="${x}" cy="${30 - (x - 50) * .06}" r="2.4" fill="#3fa37a"/>`).join('');
    if (p.head === 'pluma') g += `<g transform="rotate(-28 44 28)"><path d="M44 28 C 36 10 38 -14 44 -26 C 50 -14 52 10 44 28Z" fill="${p.acc2 || '#c0392b'}" ${ink}/><path d="M44 22 V-20" stroke="${K}" stroke-width="1.2"/></g>` + band(p.band || '#c0392b');
    if (p.head === 'banda') g += band(p.band || '#c0392b') + [52, 64, 76].map(x => `<rect x="${x}" y="27" width="4" height="4" fill="#f6efe0" transform="rotate(45 ${x + 2} 29)"/>`).join('');
    if (p.head === 'flor') g += `<g transform="translate(44 22)">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="-7" rx="5" ry="7" transform="rotate(${a})" fill="${p.flower || '#e05a7a'}" ${ink}/>`).join('')}<circle r="3.6" fill="#e9b33e" ${ink}/></g>`;
    if (p.head === 'cempa') g += [40, 52, 64, 76, 88].map((x, i) => `<circle cx="${x}" cy="${26 - Math.sin(i / 4 * Math.PI) * 8}" r="7" fill="${i % 2 ? '#f29a1e' : '#f6b81e'}" ${ink}/>`).join('');
    if (hs === 'chongo') g += `<path d="M30 18 h16" stroke="${p.acc2 || '#2f5fa8'}" stroke-width="4"/>`;
    // Front arm bent forward, codex hand.
    g += `<path d="M84 94 C 94 104 98 112 108 108" fill="none" stroke="${K}" stroke-width="12" stroke-linecap="round"/><path d="M84 94 C 94 104 98 112 108 108" fill="none" stroke="${sk}" stroke-width="7.4" stroke-linecap="round"/>`;
    g += `<path d="M106 102 C 112 98 118 100 118 106 C 118 112 112 114 106 112 Z" fill="${sk}" ${ink}/><path d="M110 102 C 110 96 116 94 116 100" fill="${sk}" ${ink}/>`;
    // Props in front.
    if (p.prop === 'escudo') g += `<g transform="translate(36 120)"><circle r="22" fill="#f3ede2" ${ink}/><circle r="15" fill="${p.shield || '#2f5fa8'}" ${ink}/><path d="M-15 0 H15 M0 -15 V15" stroke="#f3ede2" stroke-width="3"/><circle r="5" fill="#e9b33e" ${ink}/>${[-14, -5, 4, 13].map((x, i) => `<path d="M${x} 20 l-3 13 h6Z" fill="${['#2f8f8a', '#c0392b', '#e9b33e', '#2f8f8a'][i]}" ${ink}/>`).join('')}</g>`;
    if (p.prop === 'canasta') g += `<g transform="translate(114 126)"><path d="M-10 -14 C -10 -24 10 -24 10 -14" stroke="${K}" stroke-width="2.4" fill="none"/><path d="M-14 -12 H14 L10 10 H-10Z" fill="#d8a85a" ${ink}/><path d="M-12 -4 H12 M-11 3 H11" stroke="${K}" stroke-width="1.2"/>${[-7, 0, 7].map((x, i) => `<circle cx="${x}" cy="-14" r="4.4" fill="${['#c0392b', '#e9b33e', '#7cb04a'][i]}" ${ink}/>`).join('')}</g>`;
    if (p.prop === 'jicara') g += `<g transform="translate(114 98)"><path d="M-14 0 C -14 14 14 14 14 0Z" fill="#a8522e" ${ink}/><ellipse rx="14" ry="3.6" fill="${p.bowl || '#ecd3a0'}" ${ink}/></g>`;
    if (p.prop === 'tambor') g += `<g transform="translate(122 164)"><path d="M-12 -28 H12 L10 20 L4 14 L0 20 L-4 14 L-10 20Z" fill="#a8522e" ${ink}/><ellipse cy="-28" rx="12" ry="4" fill="#ecd3a0" ${ink}/>${fret(-10, 12, -16, 10, '#f3ede2')}</g>`;
    if (p.prop === 'flores') g += `<g transform="translate(114 96)"><path d="M0 12 L-6 -10 M0 12 L6 -12 M0 12 V-14" stroke="#3f7a2e" stroke-width="2.6"/>${[[-6, -12], [6, -14], [0, -18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.4" fill="#f29a1e" ${ink}/>`).join('')}</g>`;
    if (p.prop === 'cacao') g += `<path transform="translate(114 92)" d="M0 -14 C 11 -10 11 10 0 14 C -11 10 -11 -10 0 -14Z" fill="#a8521e" ${ink}/>`;
    if (p.prop === 'red') g += `<g transform="translate(116 124)"><path d="M-12 -14 L12 -14 L8 14 L-8 14Z" fill="rgba(240,230,200,.4)" ${ink}/><path d="M-11 -4 H11 M-10 6 H10 M0 -14 V14" stroke="${K}" stroke-width="1"/><path d="M-6 2 C 0 -4 6 2 0 6Z" fill="#7fa8c8" ${ink}/></g>`;
    if (p.prop === 'panal') g += `<g transform="translate(116 124)"><rect x="-9" y="-16" width="18" height="30" rx="7" fill="#c89a50" ${ink}/><path d="M-9 -6 H9 M-9 4 H9" stroke="${K}" stroke-width="1.2"/><circle cx="12" cy="-20" r="3" fill="#f2c94c" ${ink}/></g>`;
    // Speech scroll (vírgula).
    g += `<path d="M102 60 c 10 -2 14 -12 6 -16 c -6 -2 -9 4 -4 7" fill="none" stroke="${K}" stroke-width="2.4"/>`;
    return `<svg class="fig fig--borgia" viewBox="-4 -38 144 238" role="img" aria-label="${p.name}">${g}</svg>`;
  }

  // ---------- Muñeca de barro de Xochitécatl ----------
  function barro(p) {
    const clay = sh(p.skin, 1.02), dk = sh(p.skin, .68), lt = sh(p.skin, 1.22), hs = p.hairStyle, hair = p.hair;
    const top = p.top || '#f3ede2', trim = p.trim || '#c0392b', skirt = p.skirt || '#2f5fa8', bw = [0, 5, 10][p.build || 0];
    const id = 'b' + p.id, line = `stroke="${dk}" stroke-width="1.6" stroke-linejoin="round"`;
    let g = `<defs><radialGradient id="${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="${lt}"/><stop offset=".55" stop-color="${clay}"/><stop offset="1" stop-color="${dk}"/></radialGradient></defs>`;
    const C = `url(#${id})`, hole = (x, y) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${sh(p.skin, .4)}"/>`;
    g += `<ellipse cx="60" cy="194" rx="34" ry="5" fill="rgba(20,10,5,.3)"/>`;
    // Jointed legs.
    [[46, -3], [74, 3]].forEach(([x, a]) => { g += `<g transform="rotate(${a} ${x} 150)"><rect x="${x - 8}" y="146" width="16" height="44" rx="8" fill="${C}" ${line}/>${hole(x, 152)}<path d="M${x - 8} 186 h16" stroke="${dk}" stroke-width="1.4"/></g>`; });
    // Long hair panels behind.
    if (hs === 'largo' || hs === 'rizos' || hs === 'trenzas') g += `<path d="M30 50 C 26 80 28 110 32 124 L88 124 C 92 110 94 80 90 50Z" fill="${hair}" opacity=".95" ${line}/>${hs === 'rizos' ? [56, 70, 84, 98, 112].map(y => `<circle cx="30" cy="${y}" r="6" fill="${hair}" ${line}/><circle cx="90" cy="${y}" r="6" fill="${hair}" ${line}/>`).join('') : ''}`;
    if (hs === 'afro') g += `<circle cx="60" cy="52" r="38" fill="${hair}" ${line}/>${Array.from({ length: 18 }, (_, i) => { const a = i / 18 * Math.PI * 2; return `<circle cx="${60 + Math.cos(a) * 36}" cy="${52 + Math.sin(a) * 36}" r="5.4" fill="${hair}" ${line}/>`; }).join('')}`;
    // Bell-shaped body.
    g += `<path d="M${38 - bw / 2} 84 C ${30 - bw} 120 ${28 - bw} 148 ${30 - bw} 158 L${90 + bw} 158 C ${92 + bw} 148 ${90 + bw} 120 ${82 + bw / 2} 84Z" fill="${C}" ${line}/>`;
    // Mineral paint: skirt, top, bands (slightly worn: lower opacity).
    g += `<path d="M${33 - bw} 120 C ${30 - bw} 138 ${29 - bw} 150 ${30 - bw} 156 L${90 + bw} 156 C ${91 + bw} 150 ${90 + bw} 138 ${87 + bw} 120Z" fill="${skirt}" opacity=".88"/>`;
    g += `<path d="M${31 - bw} 140 H${89 + bw}" stroke="#f3ede2" stroke-width="5" opacity=".9"/>${Array.from({ length: 9 + Math.round(bw / 3) }, (_, i) => `<circle cx="${34 - bw + i * 6.4}" cy="148" r="1.8" fill="${trim}"/>`).join('')}`;
    if (p.style === 'quech') g += `<path d="M${36 - bw} 88 H${84 + bw} L60 126Z" fill="${top}" opacity=".9"/><path d="M${40 - bw} 92 L60 120 L${80 + bw} 92" fill="none" stroke="${trim}" stroke-width="3"/>`;
    else if (p.style === 'armadura') g += `<path d="M${37 - bw} 88 H${83 + bw} L${86 + bw} 120 H${34 - bw}Z" fill="${top}" opacity=".9"/>${[96, 104, 112].map(y => `<path d="M${36 - bw} ${y} H${84 + bw}" stroke="${dk}" stroke-width="1.2"/>`).join('')}`;
    else g += `<path d="M${37 - bw} 88 H${83 + bw} L${87 + bw} 122 H${33 - bw}Z" fill="${top}" opacity=".88"/><path d="M${34 - bw} 116 H${86 + bw}" stroke="${trim}" stroke-width="4"/><path d="M52 88 V98 H68 V88" fill="none" stroke="${trim}" stroke-width="2.6"/>`;
    // Pellet necklace.
    g += [46, 52, 58, 64, 70, 76].map((x, i) => `<circle cx="${x - 1}" cy="${88 + [0, 3, 4, 4, 3, 0][i]}" r="3" fill="${p.jade ? '#3fa37a' : C}" ${line}/>`).join('');
    // Jointed arms hanging from the shoulders.
    [[36, 14], [84, -14]].forEach(([x, a]) => { g += `<g transform="rotate(${a} ${x} 88)"><rect x="${x - 7}" y="84" width="14" height="46" rx="7" fill="${C}" ${line}/>${hole(x, 90)}<path d="M${x - 5} 126 v4 M${x} 127 v4 M${x + 5} 126 v4" stroke="${dk}" stroke-width="1.2"/></g>`; });
    // Neck and broad head.
    g += `<rect x="52" y="72" width="16" height="16" rx="5" fill="${C}" ${line}/>`;
    g += `<ellipse cx="60" cy="54" rx="27" ry="23" fill="${C}" ${line}/>`;
    // Incised almond eyes with appliqué pellet pupils, nose ridge, mouth.
    g += [49, 71].map(x => `<path d="M${x - 7} 55 C ${x - 3} 50 ${x + 3} 50 ${x + 7} 55 C ${x + 3} 58 ${x - 3} 58 ${x - 7} 55Z" fill="${sh(p.skin, .5)}"/><circle cx="${x}" cy="54.6" r="2" fill="${lt}"/>`).join('');
    g += `<path d="M60 52 C 58 58 58 62 62 63" stroke="${dk}" stroke-width="1.8" fill="none"/><path d="M54 68 Q60 71 66 68" stroke="${sh(p.skin, .45)}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    g += `<circle cx="44" cy="63" r="3.2" fill="#c0392b" opacity=".45"/><circle cx="76" cy="63" r="3.2" fill="#c0392b" opacity=".45"/>`;
    if (p.paint) g += `<path d="M38 58 h8 M74 58 h8" stroke="${p.paint}" stroke-width="3" opacity=".8"/>`;
    // Ear spools.
    g += [32, 88].map(x => `<circle cx="${x}" cy="58" r="6" fill="${p.orejeras ? '#e9b33e' : C}" ${line}/><circle cx="${x}" cy="58" r="2.2" fill="${dk}"/>`).join('');
    // Headdress: clay band with pellets + hair fringe; per style extras.
    g += `<path d="M34 46 C 34 26 46 22 60 22 C 74 22 86 26 86 46 C 78 40 70 38 60 38 C 50 38 42 40 34 46Z" fill="${hair}" ${line}/>`;
    g += `<path d="M30 34 C 40 20 80 20 90 34 L88 42 C 78 32 42 32 32 42Z" fill="${p.band || (p.head === 'plumas' ? '#e9b33e' : C)}" ${line}/>${[40, 50, 60, 70, 80].map(x => `<circle cx="${x}" cy="${33 - Math.sin((x - 40) / 40 * Math.PI) * 4}" r="2.6" fill="${lt}" ${line}/>`).join('')}`;
    if (hs === 'chongo') g += `<circle cx="60" cy="16" r="10" fill="${hair}" ${line}/>`;
    if (hs === 'coleta') g += `<path d="M84 30 C 100 34 102 64 94 84 C 92 66 90 50 82 40Z" fill="${hair}" ${line}/>`;
    if (hs === 'trenzas') g += [30, 90].map(x => Array.from({ length: 6 }, (_, i) => `<circle cx="${x}" cy="${70 + i * 8}" r="5" fill="${hair}" ${line}/>`).join('')).join('');
    if (p.head === 'plumas') g += ['#2f8f8a', '#7cb04a', '#e9b33e', '#c0392b', '#e9b33e', '#7cb04a', '#2f8f8a'].map((c, i) => `<path transform="rotate(${(i - 3) * 16} 60 26)" d="M60 26 C 54 12 55 -2 60 -10 C 65 -2 66 12 60 26Z" fill="${c}" opacity=".9" ${line}/>`).join('');
    if (p.head === 'pluma') g += `<path transform="rotate(20 82 26)" d="M82 26 C 76 12 78 -2 84 -8 C 90 2 88 16 82 26Z" fill="${p.acc2 || '#c0392b'}" opacity=".9" ${line}/>`;
    if (p.head === 'flor') g += `<g transform="translate(84 28)">${[0, 72, 144, 216, 288].map(a => `<circle cy="-5" r="4" transform="rotate(${a})" fill="${p.flower || '#e05a7a'}" opacity=".9" ${line}/>`).join('')}<circle r="3" fill="#e9b33e"/></g>`;
    if (p.head === 'cempa') g += [36, 46, 56, 66, 76, 86].map((x, i) => `<circle cx="${x}" cy="${28 - Math.sin(i / 5 * Math.PI) * 6}" r="5.4" fill="#f29a1e" opacity=".92" ${line}/>`).join('');
    // Small appliqué props at the right hand.
    const px = 98, py = 132;
    if (p.prop === 'lanza') g += `<path d="M${px} 190 V20" stroke="${dk}" stroke-width="4"/><path d="M${px} 10 l-5 12 h10Z" fill="#3a3a4a"/>`;
    if (p.prop === 'escudo') g += `<g transform="translate(22 128)"><circle r="16" fill="${C}" ${line}/><circle r="11" fill="${p.shield || '#2f5fa8'}" opacity=".9"/><circle r="4" fill="#e9b33e"/></g>`;
    if (p.prop === 'arco') g += `<path d="M${px} 80 C ${px + 16} 110 ${px + 16} 160 ${px} 186" stroke="${dk}" stroke-width="4" fill="none"/>`;
    if (p.prop === 'canasta') g += `<path transform="translate(${px} ${py})" d="M-10 -6 H10 L7 10 H-7Z" fill="#d8a85a" ${line}/>`;
    if (p.prop === 'jicara') g += `<path transform="translate(60 128)" d="M-12 0 C -12 10 12 10 12 0Z" fill="#a8522e" ${line}/>`;
    if (p.prop === 'tambor') g += `<rect x="${px - 8}" y="${py - 10}" width="16" height="22" rx="3" fill="#a8522e" ${line}/>`;
    if (p.prop === 'flores') g += `<g transform="translate(${px} ${py - 6})">${[[-4, 0], [4, -2], [0, -6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#f29a1e" ${line}/>`).join('')}</g>`;
    if (p.prop === 'cacao') g += `<path transform="translate(${px} ${py})" d="M0 -10 C 8 -7 8 7 0 10 C -8 7 -8 -7 0 -10Z" fill="#a8521e" ${line}/>`;
    if (p.prop === 'red') g += `<path transform="translate(${px} ${py})" d="M-9 -10 L9 -10 L6 10 L-6 10Z" fill="none" ${line}/>`;
    if (p.prop === 'panal') g += `<rect x="${px - 6}" y="${py - 10}" width="12" height="20" rx="5" fill="#c89a50" ${line}/>`;
    // Burnish highlights and clay speckle.
    g += `<ellipse cx="50" cy="44" rx="10" ry="5" fill="#fff" opacity=".18"/><ellipse cx="46" cy="104" rx="6" ry="14" fill="#fff" opacity=".1"/>`;
    for (let i = 0; i < 24; i++) g += `<circle cx="${30 + ((i * 37) % 60)}" cy="${30 + ((i * 53) % 150)}" r=".8" fill="${dk}" opacity=".5"/>`;
    return `<svg class="fig fig--barro" viewBox="0 -14 120 214" role="img" aria-label="${p.name}">${g}</svg>`;
  }

  window.TlaxFigs4 = { borgia, barro };
})();
