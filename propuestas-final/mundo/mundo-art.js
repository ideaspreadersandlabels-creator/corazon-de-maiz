// Corazón de Maíz · arte del mundo (vista desde arriba, 3/4).
// Personajes caminando en 4 direcciones y acciones del jugador, terreno sin cuadrícula,
// cultivos por etapas y costales de semilla, en el mismo trazo de tinta y color plano
// que los retratos Códice Borgia y los menús de Talavera.
// Todo se dibuja en SVG a 2× (cuadro de 32 px = 64 unidades). Personaje: 64×96 (32×48 px).
"use strict";
(function () {
  const K = '#1a1410';
  const ink = (w = 3) => `stroke="${K}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const I = ink(), I2 = ink(2.2);
  const sh = (h, k) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('');
  const n = v => +(+v).toFixed(1);
  const limb = (x1, y1, x2, y2, c, w = 5.4, cx, cy) => {
    const d = cx == null ? `M${n(x1)} ${n(y1)} L${n(x2)} ${n(y2)}` : `M${n(x1)} ${n(y1)} Q${n(cx)} ${n(cy)} ${n(x2)} ${n(y2)}`;
    return `<path d="${d}" stroke="${K}" stroke-width="${w + 3}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  };
  const hand = (x, y, c) => `<circle cx="${n(x)}" cy="${n(y)}" r="3.4" fill="${c}" ${I2}/>`;
  const zig = (x0, x1, y, h, c) => { let d = ''; for (let x = x0; x < x1 - 3; x += 4.4) d += `M${n(x)} ${n(y + h)} l2.2 ${-h} l2.2 ${h}`; return `<path d="${d}" fill="none" stroke="${c}" stroke-width="1.6"/>`; };

  // ---------------------------------------------------------------- Personajes
  // dir: 'down' | 'up' | 'right' | 'left'. f: cuadro 0–3 del ciclo de caminar.
  // act: null | 'arar' | 'regar' | 'cosechar' (f = 0 o 1).
  function character(p, dir = 'down', f = 0, act = null) {
    if (dir === 'left') return `<g transform="translate(64 0) scale(-1 1)">${character(p, 'right', f, act)}</g>`;
    const C = {
      sk: p.skin, skS: sh(p.skin, .84), hair: p.hair, hairH: sh(p.hair, p.hair === '#1a1210' || p.hair === '#120c0a' ? 2.6 : 1.25),
      top: p.top || '#f3ede2', trim: p.trim || '#c0392b', skirt: p.skirt || '#2f5fa8', band2: p.band2 || p.trim || '#c0392b',
    };
    const man = !!p.legs, bw = [0, 2, 4][p.build || 0];
    const walk = act ? 0 : f;
    const bob = walk % 2 === 1 ? 1.4 : 0;
    const crouch = act === 'cosechar' && f === 0;
    let back = '', body = '', front = '';
    const shadow = `<ellipse cx="32" cy="91" rx="${16 + bw}" ry="4.2" fill="rgba(26,20,16,.24)"/>`;

    if (dir === 'down' || dir === 'up') {
      const isUp = dir === 'up';
      // Pelo y penacho detrás de la cabeza (de frente) o delante (de espaldas).
      const fan = p.head === 'plumas' ? ['#2f8f8a', '#3fa37a', '#e9b33e', '#c0392b', '#e9b33e', '#3fa37a', '#2f8f8a'].map((c, i) => `<path transform="rotate(${(i - 3) * 19} 32 26)" d="M32 26 C 28 18 29 7 32 2 C 35 7 36 18 32 26Z" fill="${c}" ${I2}/>`).join('') : '';
      const plume = p.head === 'pluma' ? `<path transform="rotate(${isUp ? -24 : 24} 32 24)" d="M32 24 C 28 15 29 5 32 0 C 35 5 36 15 32 24Z" fill="${p.acc2 || '#c0392b'}" ${I2}/>` : '';
      if (!isUp) back += fan + plume;
      if (p.hairStyle === 'afro') back += `<circle cx="32" cy="31" r="22" fill="${C.hair}" ${I}/>${Array.from({ length: 14 }, (_, i) => { const a = i / 14 * Math.PI * 2; return `<circle cx="${n(32 + Math.cos(a) * 21)}" cy="${n(31 + Math.sin(a) * 21)}" r="4.4" fill="${C.hair}"/>`; }).join('')}`;
      if (p.hairStyle === 'chongo') back += `<circle cx="32" cy="15" r="6.4" fill="${C.hair}" ${I}/>`;
      if (!isUp && (p.hairStyle === 'largo' || p.hairStyle === 'rizos')) back += `<path d="M15 34 C 14 46 15 56 17 62 H47 C 49 56 50 46 49 34Z" fill="${C.hair}" ${I}/>${p.hairStyle === 'rizos' ? [40, 47, 54, 61].map(y => `<circle cx="15.6" cy="${y}" r="3.8" fill="${C.hair}" ${I2}/><circle cx="48.4" cy="${y}" r="3.8" fill="${C.hair}" ${I2}/>`).join('') : ''}`;
      if (!isUp && p.hairStyle === 'coleta') back += `<path d="M44 26 C 52 30 53 44 49 52 C 47 44 46 36 42 30Z" fill="${C.hair}" ${I2}/>`;

      // Piernas, pies y prenda de abajo.
      const liftL = walk === 1 ? 3 : 0, liftR = walk === 3 ? 3 : 0;
      const foot = (x, lift) => `<ellipse cx="${x}" cy="${88.6 - lift}" rx="4.6" ry="2.8" fill="#7a4a24" ${I2}/>`;
      if (man) {
        body += `<rect x="23.4" y="66" width="7" height="${21 - liftL}" rx="2.6" fill="${C.skS}" ${I2}/><rect x="33.6" y="66" width="7" height="${21 - liftR}" rx="2.6" fill="${C.sk}" ${I2}/>`;
        body += foot(27, liftL) + foot(37, liftR);
        if (p.style === 'tilma') body += isUp
          ? '' : `<path d="M${14 - bw} 52 L${12 - bw} 78 L18 80 L20 56Z M${50 + bw} 52 L${52 + bw} 78 L46 80 L44 56Z" fill="${C.top}" ${I2}/>`;
        body += `<rect x="${20 - bw}" y="63" width="${24 + 2 * bw}" height="6" rx="1.6" fill="#f3ede2" ${I2}/>`;
        if (!isUp) body += `<path d="M28.6 68 H35.4 L34.6 79 H29.4Z" fill="#f3ede2" ${I2}/><path d="M29.4 75.4 H34.6" stroke="${C.trim}" stroke-width="2.2"/>`;
      } else {
        body += foot(26.4, liftL) + foot(37.6, liftR);
        body += `<path d="M${21 - bw} 62 H${43 + bw} L${46 + bw} 87 H${18 - bw}Z" fill="${C.skirt}" ${I}/><path d="M${40 + bw} 64 L${42 + bw} 85" stroke="${sh(C.skirt, .78)}" stroke-width="2.6"/>`;
        body += `<path d="M${18.6 - bw} 80 H${45.4 + bw} L${46 + bw} 87 H${18 - bw}Z" fill="#f3ede2" ${I2}/>${zig(20 - bw, 45 + bw, 81.4, 3.6, C.trim)}`;
      }
      // Torso y prenda de arriba.
      const torso = `M${20 - bw} 55 C ${20 - bw} 50 ${23 - bw} 48.6 28 48.6 H36 C ${41 + bw} 48.6 ${44 + bw} 50 ${44 + bw} 55`;
      if (p.style === 'tilma') {
        body += isUp
          ? `<path d="${torso} V67 H${20 - bw}Z" fill="${C.sk}" ${I}/><path d="M${18 - bw} 50 C 24 47 40 47 ${46 + bw} 50 L${48 + bw} 80 H${16 - bw}Z" fill="${C.top}" ${I}/><path d="M${16.6 - bw} 73 H${47.4 + bw}" stroke="${C.trim}" stroke-width="4"/>${zig(18 - bw, 47 + bw, 74.4, 3, '#f3ede2')}`
          : `<path d="${torso} V66 H${20 - bw}Z" fill="${C.sk}" ${I}/><path d="M24 56 C 28 59 36 59 40 56" stroke="${C.skS}" stroke-width="1.6" fill="none"/><path d="M22 50 C 30 56 36 56 43 52" stroke="${K}" stroke-width="5.6" fill="none" stroke-linecap="round"/><path d="M22 50 C 30 56 36 56 43 52" stroke="${C.top}" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="43" cy="52" r="3.4" fill="${C.top}" ${I2}/>`;
      } else if (p.style === 'armadura') {
        body += `<path d="${torso} V69 H${20 - bw}Z" fill="${C.top}" ${I}/>${[54, 59, 64].map(y => `<path d="M${21 - bw} ${y} H${43 + bw}" stroke="${K}" stroke-width=".9"/>`).join('')}${[26, 32, 38].map(x => `<path d="M${x} 50 V68" stroke="${K}" stroke-width=".7"/>`).join('')}<rect x="${19 - bw}" y="66" width="${26 + 2 * bw}" height="4.4" fill="${C.trim}" ${I2}/>`;
      } else if (p.style === 'quech') {
        body += `<path d="${torso} V68 H${20 - bw}Z" fill="#f3ede2" ${I}/>`;
        body += isUp
          ? `<path d="M${17 - bw} 51 H${47 + bw} L32 71Z" fill="${C.top}" ${I}/><path d="M${21 - bw} 53 L32 67 L${43 + bw} 53" fill="none" stroke="${C.trim}" stroke-width="2.4"/>`
          : `<path d="M${17 - bw} 51 H${47 + bw} L32 73Z" fill="${C.top}" ${I}/><path d="M${21 - bw} 53 L32 69 L${43 + bw} 53" fill="none" stroke="${C.trim}" stroke-width="2.4"/><path d="M30 73 l2 5 l2 -5" fill="${C.trim}"/>`;
      } else {
        body += `<path d="${torso} V71 H${20 - bw}Z" fill="${C.top}" ${I}/><path d="M${20.6 - bw} 65.6 H${43.4 + bw} V70.4 H${20.6 - bw}Z" fill="${C.band2}"/>${zig(21 - bw, 43 + bw, 66.4, 3.4, p.hem2 || '#f3ede2')}`;
        if (!isUp) body += `<path d="M27 48.8 V53.6 H37 V48.8" fill="none" stroke="${C.trim}" stroke-width="2.2"/>`;
        if (p.pattern || p.stars) { const mc = p.stars ? '#f2c94c' : sh(C.top, C.top === '#f3ede2' || C.top === '#ecd8b0' ? .62 : 1.45); body += [[25, 59], [32, 61], [39, 59]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${mc}"/>`).join(''); }
      }
      if (p.jade && !isUp) body += [27, 29.6, 32, 34.4, 37].map((x, i) => `<circle cx="${x}" cy="${51 + [0, 1.2, 1.6, 1.2, 0][i]}" r="1.5" fill="#3fa37a" stroke="${K}" stroke-width=".9"/>`).join('');

      // Brazos (caminando) — los de las acciones se dibujan aparte.
      if (!act) {
        const sw = walk === 1 ? 1 : walk === 3 ? -1 : 0;
        const armC = p.style === 'tilma' || p.style === 'armadura' ? C.sk : C.sk;
        body += limb(18.6 - bw, 52, 17 - bw, 65 - sw * 2, armC) + hand(17 - bw, 66 - sw * 2, armC);
        body += limb(45.4 + bw, 52, 47 + bw, 65 + sw * 2, C.skS) + hand(47 + bw, 66 + sw * 2, C.skS);
        if (p.style !== 'tilma' && p.style !== 'armadura') body += `<path d="M${16.6 - bw} 51 C ${17 - bw} 49 ${20 - bw} 48.6 ${22 - bw} 49.4 L${21 - bw} 56 L${16.4 - bw} 55.6Z M${47.4 + bw} 51 C ${47 + bw} 49 ${44 + bw} 48.6 ${42 + bw} 49.4 L${43 + bw} 56 L${47.6 + bw} 55.6Z" fill="${C.top}" ${I2}/>`;
      }
      // Cuello y cabeza.
      body += `<rect x="28.4" y="45" width="7.2" height="5.6" fill="${C.skS}"/>`;
      body += `<ellipse cx="32" cy="33" rx="16" ry="15" fill="${C.sk}" ${I}/>`;
      if (isUp) {
        body += `<ellipse cx="32" cy="32.4" rx="16.4" ry="15.4" fill="${C.hair}" ${I}/><path d="M23 22 C 27 19 33 18 38 19.6" stroke="${C.hairH}" stroke-width="2" fill="none" opacity=".75"/>`;
        if (p.hairStyle === 'largo' || p.hairStyle === 'rizos') body += `<path d="M18 38 C 17 48 18 56 20 63 H44 C 46 56 47 48 46 38Z" fill="${C.hair}" ${I}/><path d="M26 44 C 25.4 52 26 58 27 62 M37 44 C 38 52 38 58 37 62" stroke="${C.hairH}" stroke-width="1.4" fill="none" opacity=".6"/>`;
        if (p.hairStyle === 'trenzas') body += [27, 37].map(x => `${[42, 48, 54, 60].map(y => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="3.6" fill="${C.hair}" ${I2}/>`).join('')}<rect x="${x - 2.6}" y="63" width="5.2" height="2.6" fill="${p.acc2 || '#c0392b'}" ${I2}/>`).join('');
        if (p.hairStyle === 'coleta') body += `<path d="M28 40 C 27 48 30 56 33 60 C 36 54 37 46 36 40Z" fill="${C.hair}" ${I2}/><rect x="28.6" y="38" width="7" height="3.4" rx="1" fill="${p.acc2 || '#c0392b'}" ${I2}/>`;
        if (p.hairStyle === 'chongo') body += `<circle cx="32" cy="18" r="6.4" fill="${C.hair}" ${I}/><path d="M26 22 h12" stroke="${p.acc2 || '#2f5fa8'}" stroke-width="2.4"/>`;
        if (p.hairStyle === 'rizos' || p.hairStyle === 'afro') body += [22, 28, 34, 40].map((x, i) => `<circle cx="${x}" cy="${24 + (i % 2) * 3}" r="2.4" fill="${C.hairH}" opacity=".5"/>`).join('');
      } else {
        // Cara: ojos almendrados, cejas, boca y chapas.
        const eye = x => `<path d="M${x - 4.6} 35.4 C ${x - 2} 31.8 ${x + 2} 31.8 ${x + 4.6} 35.4 C ${x + 2} 38 ${x - 2} 38 ${x - 4.6} 35.4Z" fill="#fff" ${ink(1.6)}/><circle cx="${x + .3}" cy="35.2" r="2.3" fill="${p.eye || K}"/><circle cx="${x + 1.1}" cy="34.4" r=".8" fill="#fff"/>`;
        body += eye(25.6) + eye(38.4);
        if (!man) body += `<path d="M20.6 34.6 l-2.2 -1.6 M43.4 34.6 l2.2 -1.6" stroke="${K}" stroke-width="1.4" stroke-linecap="round"/>`;
        const fierce = p.mood === 'fierce';
        body += fierce ? `<path d="M21 29 L29.4 31 M43 29 L34.6 31" stroke="${K}" stroke-width="1.9" stroke-linecap="round"/>` : `<path d="M21.6 30.6 Q25.6 28.4 29.4 30.4 M34.6 30.4 Q38.4 28.4 42.4 30.6" stroke="${K}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
        body += p.mood === 'fierce' || p.mood === 'calm' || man && p.mood !== 'smile' ? `<path d="M29.6 42.6 h4.8" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>` : `<path d="M29.2 42 Q32 44.6 34.8 42" stroke="${K}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
        if (!man) body += `<ellipse cx="21.6" cy="40.4" rx="2.8" ry="1.6" fill="#e0624e" opacity=".35"/><ellipse cx="42.4" cy="40.4" rx="2.8" ry="1.6" fill="#e0624e" opacity=".35"/>`;
        if (p.freckles) body += [[21, 39], [23, 40.6], [41, 40.6], [43, 39]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${sh(C.sk, .6)}"/>`).join('');
        if (p.paint) body += `<path d="M18.6 37.4 h4.4 M41 37.4 h4.4" stroke="${p.paint}" stroke-width="2"/>`;
        // Pelo encima de la frente.
        const curly = p.hairStyle === 'rizos' || p.hairStyle === 'afro';
        body += `<path d="M15.4 37 C 13.6 21 22 16.6 32 16.6 C 42 16.6 50.4 21 48.6 37 C 46 30.6 42 27 37 26 C 34.6 28 29.4 28 27 26 C 22 27 18 30.6 15.4 37Z" fill="${C.hair}" ${I}/>`;
        body += curly ? [19, 25, 32, 39, 45].map((x, i) => `<circle cx="${x}" cy="${21 + Math.abs(i - 2) * 1.6}" r="3.6" fill="${C.hair}" ${I2}/>`).join('') : `<path d="M22.6 21.4 C 26 19.4 31 18.8 35.6 19.6" stroke="${C.hairH}" stroke-width="1.8" fill="none" opacity=".75"/>`;
        if (p.hairStyle === 'trenzas') body += [17.4, 46.6].map(x => `${[40, 46, 52, 58].map(y => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="3.4" fill="${C.hair}" ${I2}/>`).join('')}<rect x="${x - 2.6}" y="61" width="5.2" height="2.6" fill="${p.acc2 || '#c0392b'}" ${I2}/>`).join('');
        if (p.hairStyle === 'chongo') body += `<path d="M26 18.6 h12" stroke="${p.acc2 || '#2f5fa8'}" stroke-width="2.4"/>`;
      }
      // Orejeras.
      const spool = p.orejeras ? '#e9b33e' : '#3fa37a';
      body += [15.4, 48.6].map(x => `<circle cx="${x}" cy="40" r="2.8" fill="${spool}" ${ink(1.6)}/>`).join('');
      // Tocados.
      const band = c => `<path d="M16.4 28.6 C 22 24.4 42 24.4 47.6 28.6 L47.4 32 C 42 28 22 28 16.6 32Z" fill="${c}" ${I2}/>`;
      if (p.head === 'banda' || p.head === 'pluma') body += band(p.band || '#c0392b') + (p.head === 'banda' ? [24, 32, 40].map(x => `<rect x="${x - 1.4}" y="27.2" width="2.8" height="2.8" transform="rotate(45 ${x} 28.6)" fill="#f6efe0"/>`).join('') : '');
      if (p.head === 'plumas') body += band('#e9b33e') + [22, 28, 36, 42].map(x => `<circle cx="${x}" cy="28.4" r="1.2" fill="#3fa37a"/>`).join('');
      if (p.head === 'flor') body += `<g transform="translate(${isUp ? 19 : 45} 23)">${[0, 72, 144, 216, 288].map(a => `<circle cy="-3.4" r="2.8" transform="rotate(${a})" fill="${p.flower || '#e05a7a'}" stroke="${K}" stroke-width="1.2"/>`).join('')}<circle r="2" fill="#f2c94c" stroke="${K}" stroke-width="1"/></g>`;
      if (p.head === 'cempa') body += [19, 25.4, 32, 38.6, 45].map((x, i) => `<circle cx="${x}" cy="${21.6 - Math.sin(i / 4 * Math.PI) * 3.6}" r="3.8" fill="${i % 2 ? '#f29a1e' : '#f6b81e'}" ${I2}/>`).join('');
      if (isUp) front += fan + plume;
    } else {
      // ---------------- De perfil (mira a la derecha).
      const st = walk === 1 ? 1 : walk === 3 ? -1 : 0; // zancada
      if (p.head === 'plumas') back += ['#2f8f8a', '#3fa37a', '#e9b33e', '#c0392b', '#e9b33e', '#3fa37a', '#2f8f8a'].map((c, i) => `<path transform="rotate(${-70 + i * 14} 28 24)" d="M28 24 C 24 16 25 6 28 1 C 31 6 32 16 28 24Z" fill="${c}" ${I2}/>`).join('');
      if (p.head === 'pluma') back += `<path transform="rotate(-30 24 24)" d="M24 24 C 20 15 21 5 24 0 C 27 5 28 15 24 24Z" fill="${p.acc2 || '#c0392b'}" ${I2}/>`;
      if (p.hairStyle === 'afro') back += `<circle cx="29" cy="30" r="21" fill="${C.hair}" ${I}/>${Array.from({ length: 13 }, (_, i) => { const a = i / 13 * Math.PI * 2; return `<circle cx="${n(29 + Math.cos(a) * 20)}" cy="${n(30 + Math.sin(a) * 20)}" r="4.2" fill="${C.hair}"/>`; }).join('')}`;
      if (p.hairStyle === 'largo' || p.hairStyle === 'rizos') back += `<path d="M17 30 C 14 42 15 54 18 63 H29 C 27 54 27 42 28 34Z" fill="${C.hair}" ${I}/>${p.hairStyle === 'rizos' ? [38, 45, 52, 59].map(y => `<circle cx="16.4" cy="${y}" r="3.8" fill="${C.hair}" ${I2}/>`).join('') : ''}`;
      if (p.hairStyle === 'trenzas') back += `${[38, 44, 50, 56, 62].map(y => `<ellipse cx="${20 - (y - 38) * .05}" cy="${y}" rx="3.4" ry="3.4" fill="${C.hair}" ${I2}/>`).join('')}<rect x="17" y="65" width="5.4" height="2.6" fill="${p.acc2 || '#c0392b'}" ${I2}/>`;
      if (p.hairStyle === 'coleta') back += `<path d="M20 26 C 10 30 8 44 12 54 C 15 46 17 38 24 32Z" fill="${C.hair}" ${I2}/>`;
      if (p.hairStyle === 'chongo') back += `<circle cx="20" cy="19" r="6.4" fill="${C.hair}" ${I}/>`;
      // Brazo de atrás.
      if (!act) back += limb(30, 52, 30 - st * 6, 64, sh(C.sk, .74)) + hand(30 - st * 6, 65, sh(C.sk, .74));
      // Piernas.
      const foot = (x, c) => `<path d="M${x - 3} 86 h7 c 3 0 3 4.4 0 4.4 h-7Z" fill="#7a4a24" ${I2}/>`;
      if (man) {
        const lx = 32 - st * 5, rx = 32 + st * 5;
        body += limb(31, 66, lx, 86, C.skS, 6.4) + foot(lx);
        body += limb(33, 66, rx, 86, C.sk, 6.4) + foot(rx);
        if (p.style === 'tilma') body += `<path d="M27 50 C 20 58 19 72 21 80 L28 80 L30 52Z" fill="${C.top}" ${I2}/><path d="M20.6 74 H28" stroke="${C.trim}" stroke-width="3.4"/>`;
        body += `<rect x="${24 - bw}" y="62.6" width="${17 + bw}" height="6" rx="1.6" fill="#f3ede2" ${I2}/><path d="M38.4 67 L42.4 67 L41.6 77 L38.4 77Z" fill="#f3ede2" ${I2}/>`;
      } else {
        body += foot(32 - st * 5) + foot(32 + st * 5);
        const sway = st * 1.4;
        body += `<path d="M${25 - bw} 62 H${40 + bw} L${43 + bw + sway} 87 H${22 - bw + sway}Z" fill="${C.skirt}" ${I}/><path d="M${37 + bw} 64 L${40 + bw + sway} 85" stroke="${sh(C.skirt, .78)}" stroke-width="2.4"/>`;
        body += `<path d="M${22.6 - bw + sway} 80 H${42.4 + bw + sway} L${43 + bw + sway} 87 H${22 - bw + sway}Z" fill="#f3ede2" ${I2}/>${zig(24 - bw + sway, 42 + bw + sway, 81.4, 3.6, C.trim)}`;
      }
      // Torso de perfil.
      const tor = `M${24 - bw} 53 C ${24 - bw} 49.6 26 48.6 29 48.6 H35 C ${38 + bw} 48.6 ${41 + bw} 50 ${41 + bw} 54`;
      if (p.style === 'tilma') body += `<path d="${tor} V66 H${24 - bw}Z" fill="${C.sk}" ${I}/><path d="M27 50 L38 56" stroke="${K}" stroke-width="5" stroke-linecap="round"/><path d="M27 50 L38 56" stroke="${C.top}" stroke-width="2.6" stroke-linecap="round"/>`;
      else if (p.style === 'armadura') body += `<path d="${tor} V69 H${24 - bw}Z" fill="${C.top}" ${I}/>${[54, 59, 64].map(y => `<path d="M${25 - bw} ${y} H${40 + bw}" stroke="${K}" stroke-width=".9"/>`).join('')}<rect x="${23 - bw}" y="66" width="${19 + 2 * bw}" height="4.4" fill="${C.trim}" ${I2}/>`;
      else if (p.style === 'quech') body += `<path d="${tor} V68 H${24 - bw}Z" fill="#f3ede2" ${I}/><path d="M${22 - bw} 51 H${43 + bw} L36 72Z" fill="${C.top}" ${I}/><path d="M${25 - bw} 53 L36 68 L${41 + bw} 53" fill="none" stroke="${C.trim}" stroke-width="2.4"/>`;
      else body += `<path d="${tor} V71 H${24 - bw}Z" fill="${C.top}" ${I}/><path d="M${24.6 - bw} 65.6 H${40.4 + bw} V70.4 H${24.6 - bw}Z" fill="${C.band2}"/>${zig(25 - bw, 40 + bw, 66.4, 3.4, p.hem2 || '#f3ede2')}${p.pattern || p.stars ? [[30, 59], [36, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="${p.stars ? '#f2c94c' : sh(C.top, C.top === '#f3ede2' || C.top === '#ecd8b0' ? .62 : 1.45)}"/>`).join('') : ''}`;
      if (p.jade) body += [34, 36.6, 39].map((x, i) => `<circle cx="${x}" cy="${51 + i * .8}" r="1.5" fill="#3fa37a" stroke="${K}" stroke-width=".9"/>`).join('');
      // Cabeza de perfil, con nariz al estilo del códice.
      body += `<rect x="29" y="45" width="7" height="5.6" fill="${C.skS}"/>`;
      body += `<path d="M18 33 C 18 22 25 17 33 17 C 41 17 46 22 47 29.6 L50.4 35.6 C 51 37 50 38 48.6 38 L47.2 38.4 C 47.6 40.4 46.8 41.6 45.2 42 L44.8 44 C 43 47 39 48.6 34 48.6 C 25 48.6 18 43 18 33Z" fill="${C.sk}" ${I}/>`;
      body += `<path d="M37.6 32.4 C 39 29.8 42.8 29.6 44.4 31.8 C 42.6 34 39 34.2 37.6 32.4Z" fill="#fff" ${ink(1.5)}/><circle cx="41.6" cy="32" r="1.9" fill="${p.eye || K}"/><circle cx="42.2" cy="31.3" r=".7" fill="#fff"/>`;
      body += p.mood === 'fierce' ? `<path d="M36.6 26.4 L45 28.6" stroke="${K}" stroke-width="1.8" stroke-linecap="round"/>` : `<path d="M37 27.6 Q41 25.6 44.6 27.4" stroke="${K}" stroke-width="1.5" fill="none" stroke-linecap="round"/>`;
      if (!man) body += `<path d="M37.8 32 l-2.4 -1.4" stroke="${K}" stroke-width="1.3" stroke-linecap="round"/><ellipse cx="40" cy="39.4" rx="2.6" ry="1.5" fill="#e0624e" opacity=".35"/>`;
      body += p.mood === 'smile' || (!man && !p.mood) ? `<path d="M44.4 43.2 q1.6 1.2 3.2 -.2" stroke="${K}" stroke-width="1.5" fill="none" stroke-linecap="round"/>` : `<path d="M44.6 43.4 h2.8" stroke="${K}" stroke-width="1.5" stroke-linecap="round"/>`;
      if (p.freckles) body += [[38, 37.6], [41, 38.4]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".7" fill="${sh(C.sk, .6)}"/>`).join('');
      if (p.paint) body += `<path d="M34 36.6 H44" stroke="${p.paint}" stroke-width="2"/>`;
      body += `<path d="M28 33 C 25 33.6 24.6 39 27.4 40.4 C 29.4 41.4 31 40 31 38.4" fill="${C.sk}" ${ink(1.6)}/>`;
      const curly = p.hairStyle === 'rizos' || p.hairStyle === 'afro';
      body += `<path d="M17 37 C 14.6 22 24 15.6 34 16.2 C 41 16.6 46 20 47 26.4 C 42.6 24.4 37.6 24.4 34.6 26 C 33 30 29 32.4 25.6 32.4 C 22.6 34.4 20.4 37 19 40Z" fill="${C.hair}" ${I}/>`;
      body += curly ? [22, 28, 34, 40].map((x, i) => `<circle cx="${x}" cy="${20 + (i % 2) * 2}" r="3.4" fill="${C.hair}" ${I2}/>`).join('') : `<path d="M25 20 C 30 18 36 17.6 41 19" stroke="${C.hairH}" stroke-width="1.8" fill="none" opacity=".75"/>`;
      body += `<circle cx="28.4" cy="42.4" r="2.8" fill="${p.orejeras ? '#e9b33e' : '#3fa37a'}" ${ink(1.6)}/>`;
      const band = c => `<path d="M17.6 30 C 24 23.6 38 22 46.6 25.6 L46 28.8 C 38 25.6 25 27.4 18.4 33.6Z" fill="${c}" ${I2}/>`;
      if (p.head === 'banda' || p.head === 'pluma') body += band(p.band || '#c0392b');
      if (p.head === 'plumas') body += band('#e9b33e');
      if (p.head === 'flor') body += `<g transform="translate(25 23)">${[0, 72, 144, 216, 288].map(a => `<circle cy="-3.4" r="2.8" transform="rotate(${a})" fill="${p.flower || '#e05a7a'}" stroke="${K}" stroke-width="1.2"/>`).join('')}<circle r="2" fill="#f2c94c" stroke="${K}" stroke-width="1"/></g>`;
      if (p.head === 'cempa') body += [20, 26, 32.6, 39].map((x, i) => `<circle cx="${x}" cy="${21 - Math.sin(i / 3 * Math.PI) * 3}" r="3.8" fill="${i % 2 ? '#f29a1e' : '#f6b81e'}" ${I2}/>`).join('');
      if (p.hairStyle === 'chongo') body += `<path d="M14 20 h10" stroke="${p.acc2 || '#2f5fa8'}" stroke-width="2.4"/>`;
      // Brazo de enfrente.
      if (!act) front += limb(34, 52, 34 + st * 6, 64, C.sk) + hand(34 + st * 6, 65, C.sk);
    }

    // ---------------- Acciones del jugador: brazos y herramienta.
    if (act) {
      const S = C.sk, side = dir === 'right';
      const coa = (x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; return limb(x1, y1, x2, y2, '#a8743a', 3.2) + `<g transform="translate(${n(x2)} ${n(y2)}) rotate(${n(a - 90)})"><path d="M-4 -2 h8 l1.6 11 c 0 4 -11.2 4 -11.2 0Z" fill="#7a4a24" ${I2}/></g>`; };
      const jar = (x, y, tilt) => `<g transform="translate(${x} ${y}) rotate(${tilt})"><path d="M-7 -6 C -10 -2 -10 6 -6 9 H6 C 10 6 10 -2 7 -6Z" fill="#d07a3a" ${I2}/><path d="M-4 -10 H4 L3.4 -6 H-3.4Z" fill="#b8622e" ${I2}/><path d="M-8 1 h3 v-2.4 h3 v2.4 h3 v-2.4 h3 v2.4 h3" fill="none" stroke="#f6e2b8" stroke-width="1.4"/></g>`;
      const drops = (pts) => pts.map(([x, y]) => `<path d="M${x} ${y - 3} C ${x + 2.4} ${y + 1} ${x + 2} ${y + 3} ${x} ${y + 3} C ${x - 2} ${y + 3} ${x - 2.4} ${y + 1} ${x} ${y - 3}Z" fill="#7fb4ea" stroke="#2f5fa8" stroke-width="1"/>`).join('');
      const cob = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-6 6 C -9 -2 -6 -10 0 -13 C 6 -10 9 -2 6 6Z" fill="#5fa040" ${I2}/><ellipse cx="0" cy="-3" rx="4.4" ry="9" fill="#f2c94c" ${I2}/>${[-7, -3, 1].map(yy => `<path d="M-3 ${yy} h6" stroke="#c8962e" stroke-width="1"/>`).join('')}<path d="M0 -12 C -1 -16 1 -18 3 -19 M0 -12 C 2 -15 4 -16 6 -16" stroke="#d9a35a" stroke-width="1.2" fill="none"/></g>`;
      let A = '';
      if (act === 'arar') {
        if (dir === 'down') A = f === 0 ? limb(19, 52, 28, 22, S) + limb(45, 52, 36, 22, S) + coa(32, 34, 32, 6) + hand(28, 21, S) + hand(36, 21, S)
          : limb(19, 52, 29, 66, S) + limb(45, 52, 35, 66, S) + coa(32, 60, 32, 88) + hand(29.4, 66, S) + hand(34.6, 66, S);
        else if (dir === 'up') A = f === 0 ? coa(32, 30, 32, 4) + limb(19, 52, 28, 22, S) + limb(45, 52, 36, 22, S) + hand(28, 21, S) + hand(36, 21, S)
          : limb(19, 52, 24, 44, S) + limb(45, 52, 40, 44, S) + hand(24, 43, S) + hand(40, 43, S);
        else A = f === 0 ? limb(33, 52, 27, 34, S) + coa(31, 42, 18, 14) + hand(27, 33, S)
          : limb(33, 52, 43, 62, S) + coa(41, 56, 49, 82) + hand(43, 62, S);
        if (dir === 'up' && f === 1) back += coa(32, 48, 32, 30);
      } else if (act === 'regar') {
        const d0 = f === 0;
        if (dir === 'down') A = limb(19, 52, 26, 63, S) + limb(45, 52, 38, 63, S) + jar(32, 66, 24) + hand(26, 63, S) + hand(38, 63, S) + drops(d0 ? [[37, 78], [34, 84]] : [[38, 82], [35, 89], [40, 88]]);
        else if (dir === 'up') A = limb(19, 52, 24, 44, S) + limb(45, 52, 40, 44, S) + jar(44, 40, 40) + hand(24, 43, S) + hand(40, 43, S) + drops(d0 ? [[50, 30], [48, 24]] : [[52, 26], [49, 18], [54, 18]]);
        else A = limb(33, 52, 44, 58, S) + jar(49, 58, 48) + hand(44, 58, S) + drops(d0 ? [[56, 70], [54, 76]] : [[57, 74], [55, 82], [59, 82]]);
      } else if (act === 'cosechar') {
        if (f === 0) A = dir === 'right' ? limb(33, 52, 44, 76, S) + hand(44, 77, S) : limb(19, 52, 24, 76, S) + limb(45, 52, 40, 76, S) + hand(24, 77, S) + hand(40, 77, S);
        else A = (dir === 'right' ? limb(33, 52, 37, 20, S, 5.4, 46, 34) : limb(19, 52, 27, 18, S, 5.4, 8, 30) + limb(45, 52, 37, 18, S, 5.4, 56, 30)) + cob(32, 13) + (dir === 'right' ? hand(36, 19, S) : hand(27, 18, S) + hand(37, 18, S)) + `<path d="M18 8 l-3 -3 M46 8 l3 -3 M32 -3 v-3" stroke="#e9b33e" stroke-width="2" stroke-linecap="round"/>`;
      }
      front += A;
    }
    const all = back + body + front;
    // Agachado: se aplasta hacia los pies (y = 90 queda fijo).
    return shadow + (crouch ? `<g transform="translate(0 9) scale(1 .9)">${all}</g>` : bob ? `<g transform="translate(0 ${bob})">${all}</g>` : all);
  }

  // ---------------------------------------------------------------- Terreno (64×64 = 1 cuadro)
  const rnd = s => () => (s = (s * 9301 + 49297) % 233280) / 233280;
  const tuft = (x, y, c) => `<path d="M${n(x - 3)} ${n(y)} l1.4 -4.6 M${n(x)} ${n(y)} l0 -6 M${n(x + 3)} ${n(y)} l-1.4 -4.6" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/>`;
  const G = { base: '#7dbf52', dark: '#5f9e3c', light: '#a2d46e', soil: '#9a6a42', soilD: '#6e4628', soilL: '#b9875a', wet: '#6b4630', wetL: '#87603f', wetD: '#4a2e1c', path: '#dcc28c', pathD: '#b89a64', water: '#4f86b8', waterL: '#8fbbe0' };
  function pasto(seed = 1, extra = '') {
    const R = rnd(seed); let m = `<rect width="64" height="64" fill="${G.base}"/>`;
    for (let i = 0; i < 4; i++) m += `<ellipse cx="${n(8 + R() * 48)}" cy="${n(8 + R() * 48)}" rx="${n(6 + R() * 7)}" ry="${n(3 + R() * 3)}" fill="${R() < .5 ? '#77b84c' : '#84c658'}"/>`;
    for (let i = 0; i < 5; i++) m += tuft(8 + R() * 48, 12 + R() * 46, R() < .6 ? G.dark : G.light);
    if (extra === 'flores') for (let i = 0; i < 4; i++) { const x = n(8 + R() * 48), y = n(8 + R() * 48), c = ['#f6efe0', '#f2c94c', '#e05a7a', '#f29a1e'][i]; m += `<g transform="translate(${x} ${y})">${[0, 90, 180, 270].map(a => `<circle cy="-1.8" r="1.5" transform="rotate(${a})" fill="${c}"/>`).join('')}<circle r="1" fill="#e07a12"/></g>`; }
    if (extra === 'piedras') for (let i = 0; i < 3; i++) { const x = n(10 + R() * 44), y = n(10 + R() * 44), r = n(2.4 + R() * 2.4); m += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${n(r * .7)}" fill="#a8a094" stroke="${K}" stroke-width="1.2"/><ellipse cx="${n(x - r * .3)}" cy="${n(y - r * .25)}" rx="${n(r * .4)}" ry="${n(r * .25)}" fill="#d0c8bc"/>`; }
    return m;
  }
  // Tierra arada: 4 surcos por cuadro, continuos de un cuadro a otro.
  function tierra(mojada = false) {
    const b = mojada ? G.wet : G.soil, l = mojada ? G.wetL : G.soilL, d = mojada ? G.wetD : G.soilD;
    let m = `<rect width="64" height="64" fill="${b}"/>`;
    for (let y = 0; y < 64; y += 16) m += `<path d="M0 ${y + 3} H64 V${y + 9} H0Z" fill="${l}"/><path d="M0 ${y + 3} H64" stroke="${sh(l, 1.12)}" stroke-width="1.6"/><path d="M0 ${y + 13.4} H64" stroke="${d}" stroke-width="2.6"/>`;
    const R = rnd(mojada ? 7 : 3);
    for (let i = 0; i < 10; i++) m += `<circle cx="${n(3 + R() * 58)}" cy="${n(3 + R() * 58)}" r="${n(.8 + R() * 1)}" fill="${d}" opacity=".6"/>`;
    if (mojada) for (let i = 0; i < 4; i++) { const x = n(6 + R() * 50), y = 16 * Math.floor(R() * 4) + 11; m += `<ellipse cx="${x}" cy="${y}" rx="${n(3 + R() * 3)}" ry="1.4" fill="#8fb4d8" opacity=".75"/>`; }
    return m;
  }
  function camino(seed = 4) {
    const R = rnd(seed); let m = `<rect width="64" height="64" fill="${G.path}"/>`;
    for (let i = 0; i < 18; i++) m += `<circle cx="${n(2 + R() * 60)}" cy="${n(2 + R() * 60)}" r="${n(.7 + R() * .9)}" fill="${G.pathD}"/>`;
    for (let i = 0; i < 3; i++) { const x = n(8 + R() * 48), y = n(8 + R() * 48), r = n(2 + R() * 1.6); m += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${n(r * .7)}" fill="#c4ad7e" stroke="${sh(G.pathD, .8)}" stroke-width="1"/>`; }
    return m;
  }
  function agua(frame = 0) {
    let m = `<rect width="64" height="64" fill="${G.water}"/>`;
    const o = frame ? 8 : 0;
    for (const [y, x0] of [[10, 4], [26, 30], [42, 10], [58, 36]]) { const x = (x0 + o) % 64; m += `<path d="M${x} ${y} q4 -3.4 8 0 t8 0" fill="none" stroke="${G.waterL}" stroke-width="2" stroke-linecap="round"/>${x > 44 ? `<path d="M${x - 64} ${y} q4 -3.4 8 0 t8 0" fill="none" stroke="${G.waterL}" stroke-width="2" stroke-linecap="round"/>` : ''}`; }
    return m;
  }
  // Orilla de pasto que se pone encima de la tierra o el camino ('n','s','e','w').
  function orilla(side) {
    const R = rnd({ n: 11, s: 12, e: 13, w: 14 }[side]);
    let tips = '';
    for (let i = 0; i <= 8; i++) { const a = i * 8, h = n(3 + R() * 4); tips += ` L${a} ${n(7 + h)} L${a + 4} 6`; }
    const shape = `<path d="M0 0 H64 V6${tips.replace(/^ L0/, ' L0')} L64 6 V0Z" fill="${G.base}"/><path d="M0 6.4${tips} L64 6.4" fill="none" stroke="${G.dark}" stroke-width="1.6" stroke-linejoin="round"/>`;
    const rot = { n: '', s: 'rotate(180 32 32)', e: 'rotate(90 32 32)', w: 'rotate(-90 32 32)' }[side];
    return `<g transform="${rot}">${shape}</g>`;
  }

  // ---------------------------------------------------------------- Cultivos (64×128: dos cuadros de alto, base en y=112)
  const corn = (x, y, h, { leaves = 4, cobs = 0, tassel = false, s = 1 } = {}) => {
    let m = `<path d="M${x} ${y} C ${x - 1} ${y - h * .4} ${x + 1} ${y - h * .7} ${x} ${y - h}" stroke="${K}" stroke-width="${n(4.6 * s)}" fill="none" stroke-linecap="round"/><path d="M${x} ${y} C ${x - 1} ${y - h * .4} ${x + 1} ${y - h * .7} ${x} ${y - h}" stroke="#5f9a3e" stroke-width="${n(2.4 * s)}" fill="none" stroke-linecap="round"/>`;
    for (let k = 0; k < leaves; k++) {
      const ly = y - h * (.18 + k * (.7 / leaves)), d = k % 2 ? 1 : -1, L = (20 - k * 1.6) * s;
      m += `<path d="M${x} ${n(ly)} C ${n(x + d * L * .5)} ${n(ly - 10 * s)} ${n(x + d * L)} ${n(ly - 6 * s)} ${n(x + d * L * 1.1)} ${n(ly + 3 * s)} C ${n(x + d * L * .7)} ${n(ly - 3 * s)} ${n(x + d * L * .35)} ${n(ly - 2 * s)} ${x} ${n(ly + 3 * s)}Z" fill="${k % 2 ? '#6fae48' : '#86c25a'}" ${ink(1.6)}/>`;
    }
    for (let c = 0; c < cobs; c++) { const cy = y - h * (.42 + c * .16), d = c % 2 ? -1 : 1; m += `<g transform="translate(${n(x + d * 3)} ${n(cy)}) rotate(${d * 18})"><path d="M-3.4 6 C -5 -2 -3 -8 0 -10 C 3 -8 5 -2 3.4 6Z" fill="#f2c94c" ${ink(1.6)}/><path d="M-4.6 6 C -5 0 -4 -5 -2 -7 L-1 4Z M4.6 6 C 5 0 4 -5 2 -7 L1 4Z" fill="#7cb04a" ${ink(1.2)}/><path d="M0 -10 C -1 -13 1 -15 2 -16" stroke="#b8642e" stroke-width="1.4" fill="none"/></g>`; }
    if (tassel) m += `<path d="M${x} ${y - h} l-5 -7 M${x} ${y - h} l0 -9 M${x} ${y - h} l5 -7 M${x} ${y - h} l-2.6 -8 M${x} ${y - h} l2.6 -8" stroke="#d9a33e" stroke-width="2" stroke-linecap="round"/>`;
    return m;
  };
  const mound = `<ellipse cx="32" cy="113" rx="11" ry="4" fill="${G.soilD}" ${ink(1.6)}/><ellipse cx="32" cy="111.6" rx="8" ry="2.6" fill="${G.soilL}"/>`;
  const sproutAt = (x, y, s = 1, c = '#86c25a') => `<path d="M${x} ${y} V${y - 8 * s}" stroke="#4f8a36" stroke-width="2.2" stroke-linecap="round"/><path d="M${x} ${y - 6 * s} C ${x - 7 * s} ${y - 12 * s} ${x - 11 * s} ${y - 9 * s} ${x - 11 * s} ${y - 5 * s} C ${x - 7 * s} ${y - 6 * s} ${x - 4 * s} ${y - 5 * s} ${x} ${y - 3 * s}Z M${x} ${y - 7 * s} C ${x + 7 * s} ${y - 13 * s} ${x + 11 * s} ${y - 10 * s} ${x + 11 * s} ${y - 6 * s} C ${x + 7 * s} ${y - 7 * s} ${x + 4 * s} ${y - 6 * s} ${x} ${y - 4 * s}Z" fill="${c}" ${ink(1.4)}/>`;
  const leafRound = (x, y, r, c = '#5f9a3e') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${ink(1.6)}/><path d="M${x} ${y} l${n(-r * .6)} ${n(-r * .4)} M${x} ${y} l${n(r * .6)} ${n(-r * .4)} M${x} ${y} l0 ${n(r * .7)}" stroke="${sh(c, .7)}" stroke-width="1.2"/>`;
  const pole = `<path d="M44 112 V40" stroke="${K}" stroke-width="4.6" stroke-linecap="round"/><path d="M44 112 V40" stroke="#a8743a" stroke-width="2.4" stroke-linecap="round"/>`;
  const vine = (pts, leafC = '#6fae48') => `<path d="M${pts.map(([x, y]) => `${x} ${y}`).join(' L')}" stroke="#4f8a36" stroke-width="2" fill="none" stroke-linejoin="round"/>${pts.slice(1).map(([x, y], i) => `<path d="M${x} ${y} c ${i % 2 ? 6 : -6} -2 ${i % 2 ? 8 : -8} -6 ${i % 2 ? 6 : -6} -9 c ${i % 2 ? -4 : 4} 0 ${i % 2 ? -6 : 6} 4 ${i % 2 ? -6 : 6} 9Z" fill="${leafC}" ${ink(1.2)}/>`).join('')}`;
  const pod = (x, y, r = 0) => `<path transform="rotate(${r} ${x} ${y})" d="M${x - 1.6} ${y} C ${x - 2.6} ${y + 6} ${x - 1} ${y + 11} ${x + 1.6} ${y + 12} C ${x + 1.4} ${y + 7} ${x + 1.6} ${y + 4} ${x + 1.6} ${y}Z" fill="#8cc95a" ${ink(1.2)}/>`;
  const smallFlower = (x, y, c, r = 2.2) => `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<circle cy="${-r}" r="${r * .9}" transform="rotate(${a})" fill="${c}" stroke="${K}" stroke-width=".9"/>`).join('')}<circle r="${r * .6}" fill="#f2c94c"/></g>`;
  const CROPS = {
    maiz: [
      () => mound + [[29, 110], [33, 111], [36, 109.6]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.8" ry="1.4" fill="#f2c94c" stroke="${K}" stroke-width=".8"/>`).join(''),
      () => mound + sproutAt(32, 111),
      () => mound + corn(32, 111, 34, { leaves: 4, s: .9 }),
      () => mound + corn(32, 111, 62, { leaves: 6 }) + `<path d="M32 49 l-3 -5 M32 49 l0 -6 M32 49 l3 -5" stroke="#9cc95a" stroke-width="1.8" stroke-linecap="round"/>`,
      () => mound + corn(32, 111, 88, { leaves: 7, cobs: 2, tassel: true }),
    ],
    frijol: [
      () => mound + `<ellipse cx="32" cy="110" rx="2.4" ry="1.8" fill="#8f2a24" stroke="${K}" stroke-width=".9"/>`,
      () => mound + sproutAt(32, 111, 1, '#7cb04a'),
      () => mound + pole + vine([[32, 111], [38, 98], [44, 88], [41, 76], [45, 66]]),
      () => mound + pole + vine([[32, 111], [38, 98], [44, 88], [41, 76], [45, 66], [43, 54], [45, 46]]) + smallFlower(38, 82, '#f6c8e0') + smallFlower(48, 62, '#f6c8e0') + smallFlower(40, 52, '#f6efe0'),
      () => mound + pole + vine([[32, 111], [38, 98], [44, 88], [41, 76], [45, 66], [43, 54], [45, 46]]) + pod(37, 84, 10) + pod(48, 70, -14) + pod(40, 58, 12) + pod(48, 50, -8),
    ],
    calabaza: [
      () => mound + `<ellipse cx="32" cy="110" rx="2.6" ry="1.6" fill="#f3ede2" stroke="${K}" stroke-width=".9"/>`,
      () => mound + `<path d="M32 111 V104" stroke="#4f8a36" stroke-width="2.2"/>` + leafRound(26, 103, 5.4, '#7cb04a') + leafRound(38, 103, 5.4, '#7cb04a'),
      () => `<path d="M14 110 C 22 104 42 104 52 108" stroke="#4f8a36" stroke-width="2.2" fill="none"/>` + leafRound(18, 104, 8) + leafRound(34, 100, 9.4, '#6fae48') + leafRound(48, 105, 7.4),
      () => `<path d="M12 111 C 22 104 42 104 54 109" stroke="#4f8a36" stroke-width="2.2" fill="none"/>` + leafRound(16, 104, 8.4) + leafRound(48, 105, 8) + leafRound(32, 99, 10, '#6fae48') + `<g transform="translate(36 108)">${[0, 72, 144, 216, 288].map(a => `<path transform="rotate(${a})" d="M0 0 C -3 -3 -3 -7 0 -8 C 3 -7 3 -3 0 0Z" fill="#f6b81e" stroke="${K}" stroke-width="1.1"/>`).join('')}<circle r="2" fill="#e07a12"/></g>`,
      () => `<path d="M10 111 C 20 104 44 104 56 109" stroke="#4f8a36" stroke-width="2.2" fill="none"/>` + leafRound(14, 104, 8) + leafRound(50, 104, 8) + leafRound(24, 98, 8.4, '#6fae48') + `<g transform="translate(34 104)"><ellipse rx="14" ry="10" fill="#e07a28" ${ink(2)}/><ellipse rx="7.6" ry="10" fill="#ee8d36" stroke="#a8521e" stroke-width="1.4"/><ellipse rx="2.6" ry="10" fill="#f6a24a" stroke="#a8521e" stroke-width="1.4"/><path d="M-1 -10 C -1 -14 2 -16 4 -16" stroke="#5a3a22" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M-10 -4 C -9 -7 -7 -8 -5 -8.6" stroke="#ffd6a0" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`,
    ],
    chile: [
      () => mound + `<circle cx="32" cy="110" r="1.6" fill="#f3e2b8" stroke="${K}" stroke-width=".8"/>`,
      () => mound + sproutAt(32, 111, .9, '#6fae48'),
      () => mound + `<path d="M32 111 V88 M32 100 L24 92 M32 96 L40 88" stroke="#4f8a36" stroke-width="2.4" stroke-linecap="round" fill="none"/>` + [[24, 90], [40, 86], [32, 86], [28, 98], [37, 97]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="5.4" ry="3" transform="rotate(${i % 2 ? 30 : -30} ${x} ${y})" fill="${i % 2 ? '#6fae48' : '#86c25a'}" ${ink(1.2)}/>`).join(''),
      () => mound + `<path d="M32 111 V82 M32 100 L22 90 M32 94 L42 84" stroke="#4f8a36" stroke-width="2.4" stroke-linecap="round" fill="none"/>` + [[22, 88], [42, 82], [32, 80], [27, 97], [38, 94]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="5.6" ry="3" transform="rotate(${i % 2 ? 30 : -30} ${x} ${y})" fill="${i % 2 ? '#6fae48' : '#86c25a'}" ${ink(1.2)}/>`).join('') + smallFlower(26, 92, '#fbf8f0', 1.8) + smallFlower(38, 88, '#fbf8f0', 1.8),
      () => mound + `<path d="M32 111 V82 M32 100 L22 90 M32 94 L42 84" stroke="#4f8a36" stroke-width="2.4" stroke-linecap="round" fill="none"/>` + [[22, 88], [42, 82], [32, 80], [27, 97], [38, 94]].map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="5.6" ry="3" transform="rotate(${i % 2 ? 30 : -30} ${x} ${y})" fill="${i % 2 ? '#6fae48' : '#86c25a'}" ${ink(1.2)}/>`).join('') + [[24, 93, 14], [40, 88, -12], [33, 90, 4], [29, 102, 20]].map(([x, y, r]) => `<path transform="rotate(${r} ${x} ${y})" d="M${x - 1.8} ${y} C ${x - 2.4} ${y + 6} ${x - 1} ${y + 10} ${x + 1} ${y + 11} C ${x + 1.4} ${y + 7} ${x + 2} ${y + 3} ${x + 1.8} ${y}Z" fill="#d0342a" ${ink(1.2)}/>`).join(''),
    ],
    cempa: [
      () => mound + `<path d="M31 110 l2.6 -1" stroke="${K}" stroke-width="1.4"/>`,
      () => mound + sproutAt(32, 111, .9, '#5f9a3e'),
      () => mound + `<path d="M32 111 V84 M32 100 L24 90 M32 96 L40 88" stroke="#4f8a36" stroke-width="2.2" stroke-linecap="round" fill="none"/>` + [[26, 100], [38, 98], [24, 90], [40, 88]].map(([x, y], i) => `<path d="M${x} ${y} l${i % 2 ? 6 : -6} -2 l${i % 2 ? -2 : 2} 4Z" fill="#5f9a3e" ${ink(1)}/>`).join('') + [[32, 82], [24, 88], [40, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#7cb04a" ${ink(1.2)}/>`).join(''),
      () => mound + `<path d="M32 111 V84 M32 100 L24 90 M32 96 L40 88" stroke="#4f8a36" stroke-width="2.2" stroke-linecap="round" fill="none"/>` + [[26, 100], [38, 98]].map(([x, y], i) => `<path d="M${x} ${y} l${i % 2 ? 6 : -6} -2 l${i % 2 ? -2 : 2} 4Z" fill="#5f9a3e" ${ink(1)}/>`).join('') + [[32, 80, 7.4], [22, 88, 6.4], [42, 86, 6.4]].map(([x, y, r]) => `<g transform="translate(${x} ${y})">${Array.from({ length: 10 }, (_, i) => `<ellipse cy="${-r * .55}" rx="${r * .36}" ry="${r * .5}" transform="rotate(${i * 36})" fill="#f29a1e" stroke="${K}" stroke-width="1"/>`).join('')}<circle r="${r * .5}" fill="#f6b81e" stroke="${K}" stroke-width="1"/></g>`).join(''),
    ],
    // Milpa: las tres hermanas en un solo cuadro.
    milpa: [
      () => `<path d="M8 112 C 20 106 44 106 58 110" stroke="#4f8a36" stroke-width="2.2" fill="none"/>` + leafRound(12, 106, 7) + leafRound(54, 106, 7) + corn(30, 111, 88, { leaves: 7, cobs: 2, tassel: true }) + vine([[31, 106], [27, 94], [32, 82], [27, 70], [31, 58], [28, 48]], '#7cc44c') + pod(26, 86, 14) + pod(34, 66, -12) + `<g transform="translate(44 106)"><ellipse rx="9.4" ry="7" fill="#e07a28" ${ink(1.8)}/><ellipse rx="4.8" ry="7" fill="#ee8d36" stroke="#a8521e" stroke-width="1.2"/></g>`,
    ],
  };
  const crop = (tipo, etapa) => CROPS[tipo][Math.min(etapa, CROPS[tipo].length - 1)]();

  // ---------------------------------------------------------------- Costales de semilla (íconos 64×64)
  const O = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
  const SEEDS = {
    maiz: { bag: '#e8cf98', tie: '#c0392b', seed: (x, y) => `<path d="M${x - 2.6} ${y + 2} C ${x - 3} ${y - 2} ${x - 1} ${y - 3.6} ${x} ${y - 3.6} C ${x + 1} ${y - 3.6} ${x + 3} ${y - 2} ${x + 2.6} ${y + 2}Z" fill="#f2c94c" stroke="${K}" stroke-width="1.1"/>`, tag: `<ellipse cx="0" cy="0" rx="5" ry="9" transform="rotate(20)" fill="#f2c94c" stroke="${K}" stroke-width="1.6"/>` },
    maizAzul: { bag: '#c8d4ee', tie: '#2f5fa8', seed: (x, y) => `<path d="M${x - 2.6} ${y + 2} C ${x - 3} ${y - 2} ${x - 1} ${y - 3.6} ${x} ${y - 3.6} C ${x + 1} ${y - 3.6} ${x + 3} ${y - 2} ${x + 2.6} ${y + 2}Z" fill="#3d63b8" stroke="${K}" stroke-width="1.1"/>`, tag: `<ellipse cx="0" cy="0" rx="5" ry="9" transform="rotate(20)" fill="#3d63b8" stroke="${K}" stroke-width="1.6"/>` },
    frijol: { bag: '#ead8b4', tie: '#8f2a24', seed: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="2.4" fill="#8f2a24" stroke="${K}" stroke-width="1.1"/><path d="M${x - 1} ${y - .6} h1.6" stroke="#f1dcc0" stroke-width="1"/>`, tag: `<path d="M-2 -9 C -4 -1 -3 6 1 9 C 2 4 2 -2 2 -9Z" fill="#8cc95a" stroke="${K}" stroke-width="1.4"/>` },
    calabaza: { bag: '#efe2c4', tie: '#e07a28', seed: (x, y) => `<ellipse cx="${x}" cy="${y}" rx="2.2" ry="3.4" transform="rotate(30 ${x} ${y})" fill="#fbf8f0" stroke="${K}" stroke-width="1.1"/>`, tag: `<ellipse rx="8" ry="6" fill="#e07a28" stroke="${K}" stroke-width="1.6"/><ellipse rx="3.4" ry="6" fill="#ee8d36" stroke="#a8521e" stroke-width="1"/>` },
    chile: { bag: '#efdcc0', tie: '#d0342a', seed: (x, y) => `<circle cx="${x}" cy="${y}" r="2.2" fill="#f3e2b8" stroke="${K}" stroke-width="1"/>`, tag: `<path d="M3 -8 C 7 -4 6 2 2 5 C -1 8 -5 9 -8 8 C -4 6 -2 2 -1 -2 C 0 -5 1 -7 3 -8Z" fill="#d0342a" stroke="${K}" stroke-width="1.4"/>` },
    cempa: { bag: '#f0e2b8', tie: '#f29a1e', seed: (x, y) => `<path d="M${x - 3} ${y + 2} L${x + 3} ${y - 2}" stroke="${K}" stroke-width="2" stroke-linecap="round"/><path d="M${x + 3} ${y - 2} l1.4 -1" stroke="#f6efe0" stroke-width="1.4"/>`, tag: `${Array.from({ length: 8 }, (_, i) => `<ellipse cy="-4.6" rx="2.6" ry="3.6" transform="rotate(${i * 45})" fill="#f29a1e" stroke="${K}" stroke-width="1"/>`).join('')}<circle r="3.2" fill="#f6b81e" stroke="${K}" stroke-width="1"/>` },
  };
  function semilla(tipo) {
    const s = SEEDS[tipo];
    const seeds = [[22, 22], [28, 18], [34, 21], [40, 18], [26, 25], [38, 25], [31, 25]].map(([x, y]) => s.seed(x, y)).join('');
    return `<path d="M16 26 C 8 36 8 52 16 59 H48 C 56 52 56 36 48 26 Z" fill="${s.bag}" ${O}/><path d="M48 30 C 54 38 54 50 46 57" stroke="${sh(s.bag, .78)}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M14 22 C 20 12 44 12 50 22 C 44 28 20 28 14 22Z" fill="${sh(s.bag, .9)}" ${O}/>${seeds}
      <path d="M16 28 C 26 32 38 32 48 28" stroke="${s.tie}" stroke-width="3.4" fill="none" stroke-linecap="round"/>
      <g transform="translate(32 44)"><circle r="11" fill="#fbf8f0" stroke="#1b3a8a" stroke-width="2"/><circle r="12.6" fill="none" stroke="#d39a26" stroke-width="1.4"/>${s.tag}</g>
      <path d="M17 36 C 16 44 17 50 20 54" stroke="#fff6dc" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
  }

  const svg = (inner, w, h, px = w, py = h) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${px}" height="${py}">${inner}</svg>`;
  const url = s => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);

  window.CdmMundo = {
    character, pasto, tierra, camino, agua, orilla, crop, CROPS, semilla, SEEDS, svg, url,
    DIRS: ['down', 'left', 'right', 'up'], ACTS: ['arar', 'regar', 'cosechar'],
    TILES: {
      pasto: () => pasto(1), 'pasto-2': () => pasto(5), 'pasto-flores': () => pasto(9, 'flores'), 'pasto-piedras': () => pasto(13, 'piedras'),
      tierra: () => tierra(false), 'tierra-mojada': () => tierra(true), camino: () => camino(4), 'camino-2': () => camino(8),
      'agua-1': () => agua(0), 'agua-2': () => agua(1),
      'orilla-n': () => orilla('n'), 'orilla-s': () => orilla('s'), 'orilla-e': () => orilla('e'), 'orilla-w': () => orilla('w'),
    },
  };
})();
