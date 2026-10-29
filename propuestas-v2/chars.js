// Flat-vector chibi characters for Tlaxcallan, matching the game's current look
// (plaza NPCs): big head, small body, clean fills with a soft brown outline.
// One parametric builder draws the whole cast; see CAST for each character.
"use strict";
(function () {
  const L = '#4a2e22';           // outline
  const sw = 'stroke="' + L + '" stroke-width="1.6" stroke-linejoin="round"';
  const shade = (h, k) => '#' + [1, 3, 5].map(i => Math.round(parseInt(h.slice(i, i + 2), 16) * k)).map(v => Math.min(255, v).toString(16).padStart(2, '0')).join('');

  // Embroidery strip: alternating triangles, the most common huipil/cueitl motif.
  const tri = (x0, x1, y, h, c) => { let d = ''; for (let x = x0; x < x1 - 1; x += 6) d += `M${x} ${y + h}l3 ${-h}l3 ${h}Z`; return `<path d="${d}" fill="${c}"/>`; };

  function hairBack(p) {
    const c = p.hair, s = p.hairStyle;
    if (s === 'afro') return `<circle cx="60" cy="56" r="47" fill="${c}" ${sw}/>${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return `<circle cx="${60 + Math.cos(a) * 43}" cy="${56 + Math.sin(a) * 43}" r="9" fill="${c}"/>`; }).join('')}`;
    if (s === 'rizos') return Array.from({ length: 22 }, (_, i) => { const side = i % 2 ? 1 : -1, k = Math.floor(i / 2); return `<circle cx="${60 + side * (30 + (k % 3) * 4)}" cy="${48 + k * 7}" r="11" fill="${c}" ${sw}/>`; }).join('') + `<path d="M24 50 C 24 110 96 110 96 50 Z" fill="${c}"/>`;
    if (s === 'largo') return `<path d="M24 52 C 22 90 24 112 28 124 L92 124 C 96 112 98 90 96 52 Z" fill="${c}" ${sw}/>`;
    if (s === 'coleta') return `<path d="M88 40 C 108 46 110 80 100 104 C 96 90 92 70 84 56 Z" fill="${c}" ${sw}/>`;
    if (s === 'chongo') return `<circle cx="60" cy="20" r="14" fill="${c}" ${sw}/><path d="M48 22 h24" stroke="${p.acc2 || '#c0392b'}" stroke-width="4"/>`;
    return '';
  }
  function hairFront(p) {
    const c = p.hair, hi = shade(c === '#1a1210' ? '#3a2a24' : c, 1.25), s = p.hairStyle;
    let g = `<path d="M26 58 C 22 26 44 16 60 16 C 78 16 98 26 94 58 C 88 44 78 38 70 36 C 64 42 52 44 44 40 C 38 44 32 50 26 58 Z" fill="${c}" ${sw}/>`;
    if (s === 'rizos' || s === 'afro') g = `<path d="M26 58 C 22 26 44 16 60 16 C 78 16 98 26 94 58 C 86 46 78 42 60 42 C 42 42 34 46 26 58 Z" fill="${c}" ${sw}/>` + [30, 40, 50, 60, 70, 80, 90].map((x, i) => `<circle cx="${x}" cy="${26 + Math.abs(i - 3) * 4}" r="${8}" fill="${c}"/>`).join('');
    g += `<path d="M40 24 C 48 19 58 18 66 20" stroke="${hi}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    // Ixtlapalli: hair twisted into two "horns" over the forehead.
    if (s === 'cuernos') g += [46, 74].map(x => `<path d="M${x - 7} 22 C ${x - 8} 8 ${x + 8} 8 ${x + 7} 22 Z" fill="${c}" ${sw}/>`).join('');
    if (s === 'trenzas') g += [24, 96].map(x => `${Array.from({ length: 7 }, (_, i) => `<ellipse cx="${x + (x < 60 ? 2 : -2)}" cy="${62 + i * 9}" rx="6" ry="6" fill="${c}" ${sw}/>`).join('')}<path d="M${x - 4} 124 l4 8 l4 -8" fill="${p.acc2 || '#c0392b'}"/><rect x="${x - 5}" y="120" width="10" height="4" fill="${p.acc2 || '#c0392b'}"/>`).join('');
    return g;
  }
  function headwear(p) {
    const h = p.head; if (!h) return '';
    if (h === 'plumas') { const cs = p.feathers || ['#2f8f8a', '#7cb04a', '#e9b33e', '#c0392b', '#e9b33e', '#7cb04a', '#2f8f8a']; return cs.map((c, i) => { const a = (i - (cs.length - 1) / 2) * 15; return `<path transform="rotate(${a} 60 36)" d="M60 36 C 52 22 54 6 60 -2 C 66 6 68 22 60 36 Z" fill="${c}" ${sw}/>`; }).join('') + `<path d="M28 40 C 44 32 76 32 92 40 L92 47 C 76 40 44 40 28 47 Z" fill="#e9b33e" ${sw}/>${[38, 50, 60, 70, 82].map(x => `<circle cx="${x}" cy="41" r="2.2" fill="#2f8f8a"/>`).join('')}`; }
    if (h === 'pluma') return `<path transform="rotate(20 86 34)" d="M86 34 C 78 20 80 4 88 -4 C 96 6 94 22 86 34 Z" fill="${p.acc2 || '#c0392b'}" ${sw}/><path d="M28 40 C 44 32 76 32 92 40 L92 46 C 76 39 44 39 28 46 Z" fill="${p.band || '#c0392b'}" ${sw}/>`;
    if (h === 'banda') return `<path d="M27 42 C 44 34 76 34 93 42 L93 49 C 76 41 44 41 27 49 Z" fill="${p.band || '#c0392b'}" ${sw}/>${[40, 52, 64, 76].map(x => `<rect x="${x}" y="40" width="4" height="4" fill="#f6efe2" transform="rotate(45 ${x + 2} 42)"/>`).join('')}`;
    if (h === 'flor') return `<g transform="translate(86 30)">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="-6" rx="5" ry="7" transform="rotate(${a})" fill="${p.flower || '#e05a7a'}" ${sw}/>`).join('')}<circle r="3.6" fill="#f2c94c" ${sw}/></g>`;
    if (h === 'cempa') return [26, 38, 50, 62, 74, 86, 94].map((x, i) => `<circle cx="${x}" cy="${34 - Math.sin(i / 6 * Math.PI) * 8}" r="7" fill="${i % 2 ? '#f29a1e' : '#f6b81e'}" ${sw}/><circle cx="${x}" cy="${34 - Math.sin(i / 6 * Math.PI) * 8}" r="2.4" fill="#d06a12"/>`).join('');
    return '';
  }

  function body(p) {
    const bw = [0, 7, 14][p.build || 0], sk = p.skin, skS = shade(sk, .82);
    const top = p.top || '#f3ede2', topS = shade(top, .86), trim = p.trim || '#c0392b', skirt = p.skirt || '#2f5fa8';
    let g = '';
    // Legs + sandals (cactli).
    g += `<rect x="47" y="140" width="10" height="17" rx="4" fill="${sk}" ${sw}/><rect x="63" y="140" width="10" height="17" rx="4" fill="${skS}" ${sw}/>`;
    g += `<ellipse cx="51" cy="158" rx="8" ry="3.6" fill="#8a5a34" ${sw}/><ellipse cx="69" cy="158" rx="8" ry="3.6" fill="#8a5a34" ${sw}/>`;
    // Cueitl (wrap skirt) with embroidered hem.
    const w0 = 20 + bw / 2, w1 = 26 + bw / 2;
    g += `<path d="M${60 - w0} 110 L${60 + w0} 110 L${60 + w1} 146 L${60 - w1} 146 Z" fill="${skirt}" ${sw}/><path d="M${60 + w0 - 6} 112 L${60 + w1 - 8} 145" stroke="${shade(skirt, .75)}" stroke-width="2"/>`;
    g += `<rect x="${60 - w1 + 1}" y="137" width="${2 * w1 - 2}" height="8" fill="${p.hem || '#f3ede2'}"/>${tri(60 - w1 + 2, 60 + w1 - 2, 137, 7, trim)}`;
    // Arms (behind the top's sleeves).
    const ax = 21 + bw / 2;
    g += `<path d="M${60 - ax} 94 C ${60 - ax - 6} 104 ${60 - ax - 6} 116 ${60 - ax - 2} 124" stroke="${L}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M${60 - ax} 94 C ${60 - ax - 6} 104 ${60 - ax - 6} 116 ${60 - ax - 2} 124" stroke="${sk}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    g += `<path d="M${60 + ax} 94 C ${60 + ax + 6} 104 ${60 + ax + 6} 116 ${60 + ax + 2} 124" stroke="${L}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M${60 + ax} 94 C ${60 + ax + 6} 104 ${60 + ax + 6} 116 ${60 + ax + 2} 124" stroke="${skS}" stroke-width="8" stroke-linecap="round" fill="none"/>`;
    // Top: huipil, quechquémitl over a blouse, or ichcahuipilli (quilted cotton armour).
    const tw = 22 + bw / 2;
    if (p.style === 'quech') {
      g += `<path d="M${60 - tw + 2} 90 L${60 + tw - 2} 90 L${60 + tw} 118 L${60 - tw} 118 Z" fill="${p.blouse || '#f3ede2'}" ${sw}/>`;
      g += `<path d="M${60 - tw - 6} 92 C ${60 - tw} 88 ${60 + tw} 88 ${60 + tw + 6} 92 L60 128 Z" fill="${top}" ${sw}/><path d="M${60 - tw - 2} 96 L60 124 L${60 + tw + 2} 96" stroke="${trim}" stroke-width="3" fill="none"/><path d="M60 128 l-3 6 h6Z" fill="${trim}"/>`;
      g += `<path d="M${60 + tw - 4} 92 L60 128 L${60 + tw + 6} 92Z" fill="${topS}" opacity=".6"/>`;
    } else if (p.style === 'armadura') {
      g += `<path d="M${60 - tw} 88 L${60 + tw} 88 L${60 + tw + 2} 124 L${60 - tw - 2} 124 Z" fill="${top}" ${sw}/>`;
      for (let y = 94; y < 124; y += 7) g += `<path d="M${60 - tw} ${y} H${60 + tw}" stroke="${topS}" stroke-width="1.6"/>`;
      for (let x = 60 - tw + 7; x < 60 + tw; x += 8) g += `<path d="M${x} 88 V124" stroke="${topS}" stroke-width="1.2"/>`;
      g += `<rect x="${60 - tw - 2}" y="118" width="${2 * tw + 4}" height="7" fill="${trim}" ${sw}/>${Array.from({ length: Math.floor((2 * tw) / 7) }, (_, i) => `<path d="M${60 - tw + 2 + i * 7} 125 v8" stroke="${trim}" stroke-width="3"/>`).join('')}`;
    } else {
      g += `<path d="M${60 - tw - 4} 90 C ${60 - tw} 86 ${60 + tw} 86 ${60 + tw + 4} 90 L${60 + tw + 2} 126 L${60 - tw - 2} 126 Z" fill="${top}" ${sw}/><path d="M${60 + tw - 6} 90 L${60 + tw - 2} 126 L${60 + tw + 2} 126 L${60 + tw + 4} 90Z" fill="${topS}"/>`;
      g += `<path d="M50 88 L50 100 L70 100 L70 88" fill="none" stroke="${trim}" stroke-width="3.4"/>`;
      g += `<rect x="${60 - tw - 1}" y="117" width="${2 * tw + 2}" height="7" fill="${p.band2 || trim}"/>${tri(60 - tw, 60 + tw, 117, 6, p.hem2 || '#f3ede2')}`;
      if (p.stars) g += [[48, 108], [72, 106], [60, 112]].map(([x, y]) => `<path d="M${x} ${y - 3} l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1Z" fill="#f2c94c"/>`).join('');
    }
    // Hands.
    g += `<circle cx="${60 - ax - 2}" cy="125" r="4.6" fill="${sk}" ${sw}/><circle cx="${60 + ax + 2}" cy="125" r="4.6" fill="${skS}" ${sw}/>`;
    // Jade bead necklace.
    if (p.jade) g += `<path d="M48 90 C 52 98 68 98 72 90" fill="none" stroke="${L}" stroke-width="1"/>` + [50, 55, 60, 65, 70].map((x, i) => `<circle cx="${x}" cy="${91 + (i === 0 || i === 4 ? 0 : i === 2 ? 5 : 3.5)}" r="2.6" fill="#3fa37a" ${sw}/>`).join('');
    return g;
  }

  function face(p) {
    const sk = p.skin, skS = shade(sk, .82), ey = 64;
    let g = `<rect x="54" y="80" width="12" height="10" fill="${skS}"/>`;
    g += `<ellipse cx="27" cy="62" rx="5" ry="7" fill="${sk}" ${sw}/><ellipse cx="93" cy="62" rx="5" ry="7" fill="${skS}" ${sw}/>`;
    if (p.orejeras) g += [27, 93].map(x => `<circle cx="${x}" cy="66" r="4" fill="#e9b33e" ${sw}/><circle cx="${x}" cy="66" r="1.6" fill="#2f8f8a"/>`).join('');
    g += `<path d="M60 22 C 84 22 94 38 94 58 C 94 78 80 88 60 88 C 40 88 26 78 26 58 C 26 38 36 22 60 22 Z" fill="${sk}" ${sw}/>`;
    g += `<path d="M84 34 C 92 44 94 60 88 74 C 86 70 86 60 84 52 Z" fill="${skS}" opacity=".7"/>`;
    g += [46, 74].map(x => `<ellipse cx="${x}" cy="${ey}" rx="5" ry="6.2" fill="#fff"/><ellipse cx="${x}" cy="${ey + .6}" rx="3.8" ry="5" fill="${p.eye || '#2a1712'}"/><circle cx="${x + 1.6}" cy="${ey - 1.6}" r="1.6" fill="#fff"/><path d="M${x - 6} ${ey - 3} C ${x - 3} ${ey - 8} ${x + 3} ${ey - 8} ${x + 6} ${ey - 4}" stroke="${L}" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M${x + (x < 60 ? -6 : 6)} ${ey - 3} l${x < 60 ? -3 : 3} -2" stroke="${L}" stroke-width="1.8" stroke-linecap="round"/>`).join('');
    g += [46, 74].map(x => `<path d="M${x - 5} ${ey - 12} q5 -3 10 0" stroke="${shade(p.hair, 1)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`).join('');
    g += `<ellipse cx="38" cy="74" rx="5.5" ry="3" fill="#e0846e" opacity=".5"/><ellipse cx="82" cy="74" rx="5.5" ry="3" fill="#e0846e" opacity=".5"/>`;
    if (p.freckles) g += [[36, 70], [40, 72], [34, 73], [80, 70], [84, 72], [86, 69]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="${shade(sk, .6)}"/>`).join('');
    g += `<path d="M56 78 Q60 82 64 78" stroke="#8a3a2a" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
    if (p.paint) g += `<path d="M30 66 h8 M82 66 h8" stroke="${p.paint}" stroke-width="2.4" stroke-linecap="round"/>`;
    return g;
  }

  function prop(p, phase) {
    const a = p.prop, bw = [0, 7, 14][p.build || 0], rx = 60 + 21 + bw / 2 + 2, lx = 60 - 21 - bw / 2 - 2;
    if (!a) return '';
    if (a === 'lanza' && phase === 'back') return `<path d="M${rx + 2} 158 L${rx + 2} 10" stroke="${L}" stroke-width="5.4" stroke-linecap="round"/><path d="M${rx + 2} 158 L${rx + 2} 10" stroke="#9a6438" stroke-width="3"/><path d="M${rx + 2} -2 l-6 14 h12Z" fill="#2a2a3a" ${sw}/><path d="M${rx - 3} 20 l-4 6 M${rx + 7} 20 l4 6" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>`;
    if (a === 'arco' && phase === 'back') return `<path d="M${rx + 6} 70 C ${rx + 24} 96 ${rx + 24} 136 ${rx + 6} 160" stroke="${L}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M${rx + 6} 70 C ${rx + 24} 96 ${rx + 24} 136 ${rx + 6} 160" stroke="#8a5a34" stroke-width="3" fill="none"/><path d="M${rx + 6} 70 L${rx + 6} 160" stroke="#f3ede2" stroke-width="1.2"/>`;
    if (a === 'escudo' && phase === 'front') return `<g transform="translate(${lx - 4} 116)"><circle r="20" fill="#f3ede2" ${sw}/><circle r="15" fill="${p.shield || '#2f5fa8'}" ${sw}/><path d="M-15 0 H15 M0 -15 V15" stroke="#f3ede2" stroke-width="3"/><circle r="5" fill="#e9b33e" ${sw}/>${[-12, -4, 4, 12].map(x => `<path d="M${x} 18 l-2 10 h4Z" fill="${['#2f8f8a', '#c0392b', '#e9b33e', '#2f8f8a'][(x + 12) / 8]}" ${sw}/>`).join('')}</g>`;
    if (a === 'canasta' && phase === 'front') return `<g transform="translate(${lx - 6} 122)"><path d="M-14 -4 C -14 -26 14 -26 14 -4" stroke="#8a5a34" stroke-width="3.4" fill="none"/><path d="M-16 -4 H16 L12 16 H-12 Z" fill="#d8a85a" ${sw}/><path d="M-14 3 H14 M-13 9 H13" stroke="#a87a3a" stroke-width="2"/>${[-8, 0, 8].map((x, i) => `<circle cx="${x}" cy="-6" r="5" fill="${['#c0392b', '#f2c94c', '#7cb04a'][i]}" ${sw}/>`).join('')}</g>`;
    if (a === 'jicara' && phase === 'front') return `<g transform="translate(60 124)"><path d="M-16 -4 C -16 10 16 10 16 -4 Z" fill="#a8522e" ${sw}/><ellipse cy="-4" rx="16" ry="4" fill="${p.bowl || '#ecd3a0'}" ${sw}/><path d="M-10 2 h20" stroke="#f1dcb0" stroke-width="2"/></g>`;
    if (a === 'flores' && phase === 'front') return `<g transform="translate(${lx - 2} 116)"><path d="M0 12 L-4 -8 M0 12 L4 -10 M0 12 L0 -12" stroke="#4f8a36" stroke-width="2.4"/>${[[-4, -10], [4, -12], [0, -15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f6a81e" ${sw}/><circle cx="${x}" cy="${y}" r="1.8" fill="#d06a12"/>`).join('')}</g>`;
    if (a === 'cacao' && phase === 'front') return `<g transform="translate(${lx - 4} 118)"><path d="M0 -14 C 10 -10 10 10 0 14 C -10 10 -10 -10 0 -14 Z" fill="#a8521e" ${sw}/><path d="M0 -12 V12 M-4 -10 C -6 0 -6 6 -4 10 M4 -10 C 6 0 6 6 4 10" stroke="#7a3418" stroke-width="1.4" fill="none"/></g>`;
    if (a === 'red' && phase === 'front') return `<g transform="translate(${lx - 6} 120)"><path d="M-12 -14 L12 -14 L8 14 L-8 14 Z" fill="none" stroke="#c8b48a" stroke-width="2"/>${[-8, -2, 4, 10].map(y => `<path d="M-11 ${y} H11" stroke="#c8b48a" stroke-width="1.4"/>`).join('')}${[-6, 0, 6].map(x => `<path d="M${x} -14 V14" stroke="#c8b48a" stroke-width="1.4"/>`).join('')}<path d="M-6 4 C 0 -2 6 4 0 8 C -2 8 -4 6 -6 4 Z" fill="#7fa8c8" ${sw}/></g>`;
    if (a === 'tambor' && phase === 'front') return `<g transform="translate(${lx - 2} 124)"><rect x="-11" y="-12" width="22" height="26" rx="4" fill="#a8522e" ${sw}/><ellipse cy="-12" rx="11" ry="4" fill="#ecd3a0" ${sw}/><path d="M-11 0 H11" stroke="#f1dcb0" stroke-width="2"/></g>`;
    if (a === 'panal' && phase === 'front') return `<g transform="translate(${lx - 4} 120)"><rect x="-8" y="-14" width="16" height="28" rx="6" fill="#c89a50" ${sw}/><path d="M-8 -6 H8 M-8 2 H8" stroke="#8a5a34" stroke-width="1.6"/><circle cx="12" cy="-16" r="2.4" fill="#f2c94c" ${sw}/><circle cx="-12" cy="-20" r="2" fill="#f2c94c" ${sw}/></g>`;
    return '';
  }

  // Returns an inline <svg> string. viewBox fits headdresses and props.
  function chibi(p, cls = '') {
    return `<svg class="chibi ${cls}" viewBox="-14 -14 148 182" role="img" aria-label="${p.name}">
      <ellipse cx="60" cy="160" rx="34" ry="6" fill="rgba(30,20,10,.22)"/>
      ${prop(p, 'back')}${hairBack(p)}${body(p)}${face(p)}${hairFront(p)}${headwear(p)}${prop(p, 'front')}
    </svg>`;
  }

  // Cast from the game's roster. Look (skin, hair, build, props) follows the reference
  // art; clothing is pre-Hispanic Tlaxcalteca: huipil or quechquémitl over a cueitl.
  const CAST = [
    { id: 'nizhoni', name: 'Nizhoni', role: 'Cazadora', line: 'Conoce cada vereda del monte.', skin: '#b07040', hair: '#1a1210', hairStyle: 'largo', style: 'quech', top: '#b8763a', trim: '#2f8f8a', skirt: '#8a5a34', head: 'banda', band: '#c0392b', prop: 'lanza', jade: true },
    { id: 'doli', name: 'Doli', role: 'Recolectora', line: 'Vuelve del cerro con la canasta llena.', skin: '#a8683a', hair: '#1a1210', hairStyle: 'trenzas', style: 'huipil', top: '#f3ede2', trim: '#c0392b', skirt: '#a8522e', head: 'banda', band: '#e07a28', prop: 'canasta' },
    { id: 'nalin', name: 'Nalin', role: 'Guerrera', line: 'Defiende las fronteras del señorío.', skin: '#9a5e34', hair: '#1a1210', hairStyle: 'coleta', style: 'armadura', top: '#efe3c8', trim: '#2f5fa8', skirt: '#1e3c78', head: 'plumas', prop: 'escudo', shield: '#2f5fa8', paint: '#2f5fa8' },
    { id: 'nascha', name: 'Nascha', role: 'Arquera', line: 'Nunca falla un tiro, ni un chiste.', skin: '#b37a4c', hair: '#1a1210', hairStyle: 'largo', style: 'quech', top: '#7a8a3a', trim: '#e9b33e', skirt: '#5a4a2a', head: 'pluma', acc2: '#2f8f8a', band: '#7a8a3a', prop: 'arco', orejeras: true },
    { id: 'kaya', name: 'Kaya', role: 'Tu amor', line: 'Te espera cada tarde junto al río.', skin: '#c08454', hair: '#1a1210', hairStyle: 'largo', style: 'huipil', top: '#3a9ab0', trim: '#f3ede2', band2: '#1e5a78', skirt: '#1e5a78', hem: '#3a9ab0', head: 'banda', band: '#1e3c78', prop: 'lanza', jade: true, romance: true },
    { id: 'citlali', name: 'Citlali', role: 'Tejedora', line: 'Borda estrellas en cada huipil.', skin: '#b8855a', hair: '#1a1210', hairStyle: 'largo', style: 'huipil', top: '#2a2440', trim: '#2f8f8a', band2: '#2f8f8a', skirt: '#1e2a4a', head: 'flor', flower: '#e05a7a', stars: true },
    { id: 'tlalli', name: 'Tlalli', role: 'Alfarera', line: 'Sus cántaros no gotean nunca.', skin: '#c89468', hair: '#1a1210', hairStyle: 'chongo', acc2: '#2f5fa8', style: 'huipil', top: '#2f4a8a', trim: '#f3ede2', band2: '#f3ede2', hem2: '#2f4a8a', skirt: '#1e2a5a', prop: 'jicara', bowl: '#c46a32' },
    { id: 'malinalli', name: 'Malinalli', role: 'Curandera', line: 'Sabe qué hierba cura cada mal.', skin: '#8a5430', hair: '#1a1210', hairStyle: 'trenzas', acc2: '#e9b33e', style: 'quech', top: '#d9a03a', trim: '#7a2a1e', skirt: '#6a3a1e', head: 'pluma', acc2: '#c0392b', band: '#e9b33e', jade: true, orejeras: true, prop: 'flores' },
    { id: 'naara', name: 'Naara', role: 'Cantora', line: 'Su voz abre las fiestas del pueblo.', skin: '#5a3420', hair: '#120c0a', hairStyle: 'afro', style: 'huipil', top: '#4f7a3a', trim: '#e9b33e', band2: '#e9b33e', hem2: '#4f7a3a', skirt: '#2e4a24', orejeras: true, jade: true, prop: 'tambor' },
    { id: 'yeyetzi', name: 'Yeyetzi', role: 'Pescadora', line: 'Pesca charales en la laguna.', skin: '#e2b48c', hair: '#c8502a', hairStyle: 'rizos', style: 'huipil', top: '#5f8a4a', trim: '#e07a28', skirt: '#3a5a30', freckles: true, prop: 'red', eye: '#3a6a3a' },
    { id: 'isabel', name: 'Isabel', role: 'Viajera', line: 'Llegó de muy lejos siguiendo un mapa.', skin: '#f0c8a0', hair: '#e8c070', hairStyle: 'rizos', build: 2, style: 'huipil', top: '#ecd8b0', trim: '#a8522e', skirt: '#8a6a4a', eye: '#3a5a8a' },
    { id: 'yuki', name: 'Yuki', role: 'Tortillera', line: 'Sus tortillas salen infladitas del comal.', skin: '#c88a5a', hair: '#3a2418', hairStyle: 'rizos', build: 2, style: 'huipil', top: '#e07a28', trim: '#7a2a1e', band2: '#7a2a1e', skirt: '#7a3a1e', prop: 'jicara' },
    { id: 'mei', name: 'Mei', role: 'Comerciante de cacao', line: 'Nadie regatea mejor en el tianguis.', skin: '#e0b088', hair: '#1a1210', hairStyle: 'largo', build: 2, style: 'huipil', top: '#7ab0d8', trim: '#f3ede2', band2: '#2f5fa8', skirt: '#2f5fa8', prop: 'cacao' },
    { id: 'iyari', name: 'Iyari', role: 'Apicultora', line: 'Cuida abejas meliponas sin aguijón.', skin: '#a8683a', hair: '#2a1a14', hairStyle: 'rizos', build: 2, style: 'quech', top: '#c0392b', trim: '#f2c94c', skirt: '#6a2a1e', prop: 'panal' },
    { id: 'ayelen', name: 'Ayelen', role: 'Floricultora', line: 'Siembra cempasúchil para la ofrenda.', skin: '#b07a48', hair: '#1a1210', hairStyle: 'rizos', build: 2, style: 'huipil', top: '#e9b33e', trim: '#c0392b', band2: '#c0392b', skirt: '#a8522e', head: 'cempa', prop: 'flores' },
  ];
  const PLAYER = { id: 'tu', name: 'Tú', role: 'Campesina de la milpa', skin: '#a8683a', hair: '#1a1210', hairStyle: 'largo', style: 'huipil', top: '#f3ede2', trim: '#c0392b', skirt: '#8a5a34', head: 'pluma', band: '#c0392b', acc2: '#e07a28' };

  window.TlaxChars = { chibi, CAST, PLAYER };
})();
