// Alternative character styles for the same cast (params from propuestas-v2/chars.js):
//  cuento — storybook proportions (~4.5 heads), soft shading, finer faces.
//  lienzo — Lienzo de Tlaxcala codex figure: profile head, frontal torso, thick ink line.
// The third style, "azulejo", is the chibi recoloured in cobalt by a CSS/SVG filter.
"use strict";
(function () {
  const sh = (h, k) => '#' + [1, 3, 5].map(i => Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * k)).toString(16).padStart(2, '0')).join('');
  const tri = (x0, x1, y, h, c) => { let d = ''; for (let x = x0; x < x1 - 1; x += 7) d += `M${x} ${y + h}l3.5 ${-h}l3.5 ${h}Z`; return `<path d="${d}" fill="${c}"/>`; };

  // ---------- Cuento ----------
  function cuento(p) {
    const L = '#3a2418', st = `stroke="${L}" stroke-width="1.4" stroke-linejoin="round"`;
    const bw = [0, 6, 13][p.build || 0], sk = p.skin, skS = sh(sk, .8), skH = sh(sk, 1.12), hair = p.hair, hs = p.hairStyle;
    const top = p.top || '#f3ede2', topS = sh(top, .82), trim = p.trim || '#c0392b', skirt = p.skirt || '#2f5fa8';
    let g = `<defs><linearGradient id="cf-${p.id}" x1="0" x2="1"><stop offset="0" stop-color="${skH}"/><stop offset=".6" stop-color="${sk}"/><stop offset="1" stop-color="${skS}"/></linearGradient></defs>`;
    g += `<ellipse cx="60" cy="262" rx="36" ry="6" fill="rgba(30,20,10,.22)"/>`;
    // Props behind.
    if (p.prop === 'lanza') g += `<path d="M98 262 V14" stroke="${L}" stroke-width="5"/><path d="M98 262 V14" stroke="#9a6438" stroke-width="3"/><path d="M98 0 l-6 16 h12Z" fill="#2a2a3a" ${st}/>`;
    if (p.prop === 'arco') g += `<path d="M96 100 C 122 140 122 210 96 250" stroke="${L}" stroke-width="5" fill="none"/><path d="M96 100 C 122 140 122 210 96 250" stroke="#8a5a34" stroke-width="3" fill="none"/><path d="M96 100 V250" stroke="#f3ede2" stroke-width="1"/>`;
    // Back hair.
    if (hs === 'largo') g += `<path d="M34 48 C 30 100 32 140 36 156 L84 156 C 88 140 90 100 86 48Z" fill="${hair}" ${st}/>`;
    if (hs === 'rizos') g += Array.from({ length: 18 }, (_, i) => { const s = i % 2 ? 1 : -1, k = Math.floor(i / 2); return `<circle cx="${60 + s * (26 + (k % 3) * 3)}" cy="${46 + k * 11}" r="11" fill="${hair}" ${st}/>`; }).join('');
    if (hs === 'afro') g += `<circle cx="60" cy="50" r="40" fill="${hair}" ${st}/>`;
    if (hs === 'coleta') g += `<path d="M78 34 C 100 40 100 90 88 120 C 86 100 84 70 76 50Z" fill="${hair}" ${st}/>`;
    if (hs === 'chongo') g += `<circle cx="60" cy="18" r="12" fill="${hair}" ${st}/>`;
    // Legs and sandals.
    g += `<rect x="48" y="236" width="9" height="20" rx="4" fill="${sk}" ${st}/><rect x="63" y="236" width="9" height="20" rx="4" fill="${skS}" ${st}/><path d="M44 256 h16 v4 h-16Z M60 256 h16 v4 h-16Z" fill="#7a4a24" ${st}/>`;
    // Cueitl to the ankles.
    const s0 = 21 + bw / 2, s1 = 28 + bw / 2;
    g += `<path d="M${60 - s0} 140 L${60 + s0} 140 L${60 + s1} 240 L${60 - s1} 240Z" fill="${skirt}" ${st}/><path d="M${60 + s0 - 8} 142 L${60 + s1 - 12} 238" stroke="${sh(skirt, .75)}" stroke-width="2"/><path d="M${60 + s0 - 4} 140 L${60 + s1} 240 L${60 + s1 - 9} 240 L${60 + s0 - 9} 140Z" fill="${sh(skirt, .8)}" opacity=".6"/>`;
    g += `<rect x="${60 - s1 + 1}" y="226" width="${2 * s1 - 2}" height="10" fill="${p.hem || '#f3ede2'}"/>${tri(60 - s1 + 2, 60 + s1 - 2, 226, 9, trim)}`;
    // Arms.
    const ax = 25 + bw / 2;
    [[-1, sk], [1, skS]].forEach(([d, c]) => { g += `<path d="M${60 + d * ax} 94 C ${60 + d * (ax + 6)} 120 ${60 + d * (ax + 6)} 146 ${60 + d * (ax + 2)} 166" stroke="${L}" stroke-width="11" stroke-linecap="round" fill="none"/><path d="M${60 + d * ax} 94 C ${60 + d * (ax + 6)} 120 ${60 + d * (ax + 6)} 146 ${60 + d * (ax + 2)} 166" stroke="${c}" stroke-width="8.4" stroke-linecap="round" fill="none"/>`; });
    // Top.
    const tw = 24 + bw / 2;
    if (p.style === 'quech') {
      g += `<path d="M${60 - tw + 3} 86 L${60 + tw - 3} 86 L${60 + tw} 150 L${60 - tw} 150Z" fill="#f3ede2" ${st}/><path d="M${60 - tw - 8} 90 C ${60 - tw} 82 ${60 + tw} 82 ${60 + tw + 8} 90 L60 158Z" fill="${top}" ${st}/><path d="M${60 + tw - 4} 90 L60 158 L${60 + tw + 8} 90Z" fill="${topS}" opacity=".6"/><path d="M${60 - tw - 3} 96 L60 150 L${60 + tw + 3} 96" stroke="${trim}" stroke-width="3" fill="none"/><path d="M60 158 l-4 9 h8Z" fill="${trim}"/>`;
    } else if (p.style === 'armadura') {
      g += `<path d="M${60 - tw} 84 L${60 + tw} 84 L${60 + tw + 2} 152 L${60 - tw - 2} 152Z" fill="${top}" ${st}/>`;
      for (let y = 92; y < 150; y += 8) g += `<path d="M${60 - tw} ${y} H${60 + tw}" stroke="${topS}" stroke-width="1.6"/>`;
      for (let x = 60 - tw + 8; x < 60 + tw; x += 9) g += `<path d="M${x} 84 V150" stroke="${topS}" stroke-width="1.2"/>`;
      g += `<rect x="${60 - tw - 2}" y="146" width="${2 * tw + 4}" height="8" fill="${trim}" ${st}/>${Array.from({ length: Math.floor(2 * tw / 7) }, (_, i) => `<path d="M${60 - tw + 2 + i * 7} 154 v10" stroke="${trim}" stroke-width="3"/>`).join('')}`;
    } else {
      g += `<path d="M${60 - tw - 6} 88 C ${60 - tw} 82 ${60 + tw} 82 ${60 + tw + 6} 88 L${60 + tw + 3} 156 L${60 - tw - 3} 156Z" fill="${top}" ${st}/><path d="M${60 + tw - 6} 86 L${60 + tw - 2} 156 L${60 + tw + 3} 156 L${60 + tw + 6} 88Z" fill="${topS}"/>`;
      g += `<path d="M49 84 L49 100 L71 100 L71 84" fill="none" stroke="${trim}" stroke-width="3.4"/>${tri(60 - tw, 60 + tw, 146, 8, p.hem2 || '#f3ede2').replace('<path', `<path`)}<rect x="${60 - tw - 2}" y="144" width="${2 * tw + 4}" height="3" fill="${p.band2 || trim}"/>`;
      if (p.stars) g += [[50, 120], [70, 116], [60, 132]].map(([x, y]) => `<path d="M${x} ${y - 3} l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1Z" fill="#f2c94c"/>`).join('');
    }
    g += `<circle cx="${60 - ax - 2}" cy="168" r="5" fill="${sk}" ${st}/><circle cx="${60 + ax + 2}" cy="168" r="5" fill="${skS}" ${st}/>`;
    if (p.jade) g += [49, 54, 60, 66, 71].map((x, i) => `<circle cx="${x}" cy="${87 + [0, 3, 5, 3, 0][i]}" r="2.6" fill="#3fa37a" ${st}/>`).join('');
    // Neck and head (about a quarter of the height).
    g += `<path d="M54 70 h12 v16 c -4 3 -8 3 -12 0Z" fill="${skS}" ${st}/>`;
    g += `<ellipse cx="37" cy="52" rx="4" ry="6" fill="${sk}" ${st}/><ellipse cx="83" cy="52" rx="4" ry="6" fill="${skS}" ${st}/>`;
    if (p.orejeras) g += [37, 83].map(x => `<circle cx="${x}" cy="56" r="3.4" fill="#e9b33e" ${st}/>`).join('');
    g += `<path d="M60 22 C 76 22 84 34 84 50 C 84 66 74 78 60 78 C 46 78 36 66 36 50 C 36 34 44 22 60 22Z" fill="url(#cf-${p.id})" ${st}/>`;
    g += [50, 70].map(x => `<path d="M${x - 5} 52 C ${x - 3} 48 ${x + 3} 48 ${x + 5} 52 C ${x + 3} 55 ${x - 3} 55 ${x - 5} 52Z" fill="#fff"/><circle cx="${x}" cy="52" r="2.6" fill="${p.eye || '#2a1712'}"/><circle cx="${x + .9}" cy="51" r=".9" fill="#fff"/><path d="M${x - 6} 51.5 C ${x - 3} 46.5 ${x + 3} 46.5 ${x + 6} 51" stroke="${L}" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M${x - 5} 44 q5 -2.5 10 0" stroke="${hair}" stroke-width="2" fill="none" stroke-linecap="round"/>`).join('');
    g += `<path d="M60 55 C 59 60 58 62 61 63" stroke="${skS}" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M55 68 Q60 71 65 68 Q60 73 55 68Z" fill="#a8483e"/><ellipse cx="44" cy="61" rx="4" ry="2.2" fill="#e0846e" opacity=".4"/><ellipse cx="76" cy="61" rx="4" ry="2.2" fill="#e0846e" opacity=".4"/>`;
    if (p.freckles) g += [[42, 58], [45, 60], [75, 58], [78, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".8" fill="${sh(sk, .6)}"/>`).join('');
    if (p.paint) g += `<path d="M40 56 h6 M74 56 h6" stroke="${p.paint}" stroke-width="2" stroke-linecap="round"/>`;
    // Front hair.
    const cap = hs === 'rizos' || hs === 'afro'
      ? `<path d="M36 50 C 32 24 48 16 60 16 C 74 16 88 24 84 50 C 78 38 70 34 60 34 C 50 34 42 38 36 50Z" fill="${hair}" ${st}/>${[40, 48, 56, 64, 72, 80].map((x, i) => `<circle cx="${x}" cy="${24 + Math.abs(i - 2.5) * 3}" r="6" fill="${hair}"/>`).join('')}`
      : `<path d="M36 50 C 32 24 48 16 60 16 C 74 16 88 24 84 50 C 80 40 72 34 66 32 C 62 36 52 38 46 35 C 42 38 38 44 36 50Z" fill="${hair}" ${st}/>`;
    g += cap + `<path d="M46 22 C 52 19 60 18 66 20" stroke="${sh(hair === '#1a1210' || hair === '#120c0a' ? '#3a2a24' : hair, 1.2)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    if (hs === 'trenzas') g += [34, 86].map(x => `${Array.from({ length: 8 }, (_, i) => `<ellipse cx="${x + (x < 60 ? 2 : -2)}" cy="${58 + i * 10}" rx="5.4" ry="6" fill="${hair}" ${st}/>`).join('')}<rect x="${x - 4}" y="136" width="8" height="5" fill="${p.acc2 || '#c0392b'}"/>`).join('');
    if (hs === 'chongo') g += `<path d="M50 18 h20" stroke="${p.acc2 || '#2f5fa8'}" stroke-width="3.4"/>`;
    // Headwear.
    if (p.head === 'plumas') g += ['#2f8f8a', '#7cb04a', '#e9b33e', '#c0392b', '#e9b33e', '#7cb04a', '#2f8f8a'].map((c, i) => `<path transform="rotate(${(i - 3) * 14} 60 32)" d="M60 32 C 54 20 55 6 60 -2 C 65 6 66 20 60 32Z" fill="${c}" ${st}/>`).join('') + `<path d="M36 34 C 50 28 70 28 84 34 L84 39 C 70 33 50 33 36 39Z" fill="#e9b33e" ${st}/>`;
    if (p.head === 'pluma') g += `<path transform="rotate(18 80 30)" d="M80 30 C 74 18 76 4 82 -2 C 88 6 86 20 80 30Z" fill="${p.acc2 || '#c0392b'}" ${st}/><path d="M36 34 C 50 28 70 28 84 34 L84 39 C 70 33 50 33 36 39Z" fill="${p.band || '#c0392b'}" ${st}/>`;
    if (p.head === 'banda') g += `<path d="M36 35 C 50 29 70 29 84 35 L84 40 C 70 34 50 34 36 40Z" fill="${p.band || '#c0392b'}" ${st}/>`;
    if (p.head === 'flor') g += `<g transform="translate(80 28)">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="-5" rx="4" ry="5.4" transform="rotate(${a})" fill="${p.flower || '#e05a7a'}" ${st}/>`).join('')}<circle r="2.8" fill="#f2c94c"/></g>`;
    if (p.head === 'cempa') g += [38, 46, 54, 62, 70, 78, 84].map((x, i) => `<circle cx="${x}" cy="${28 - Math.sin(i / 6 * Math.PI) * 6}" r="5.4" fill="${i % 2 ? '#f29a1e' : '#f6b81e'}" ${st}/>`).join('');
    // Props in front.
    const lx = 60 - ax - 4;
    if (p.prop === 'escudo') g += `<g transform="translate(${lx} 156)"><circle r="22" fill="#f3ede2" ${st}/><circle r="16" fill="${p.shield || '#2f5fa8'}" ${st}/><path d="M-16 0 H16 M0 -16 V16" stroke="#f3ede2" stroke-width="3"/><circle r="5" fill="#e9b33e" ${st}/>${[-12, -4, 4, 12].map(x => `<path d="M${x} 20 l-2 11 h4Z" fill="#2f8f8a" ${st}/>`).join('')}</g>`;
    if (p.prop === 'canasta') g += `<g transform="translate(${lx - 4} 168)"><path d="M-14 -4 C -14 -24 14 -24 14 -4" stroke="#8a5a34" stroke-width="3" fill="none"/><path d="M-16 -4 H16 L12 16 H-12Z" fill="#d8a85a" ${st}/>${[-8, 0, 8].map((x, i) => `<circle cx="${x}" cy="-6" r="5" fill="${['#c0392b', '#f2c94c', '#7cb04a'][i]}" ${st}/>`).join('')}</g>`;
    if (p.prop === 'jicara') g += `<g transform="translate(60 168)"><path d="M-16 -4 C -16 10 16 10 16 -4Z" fill="#a8522e" ${st}/><ellipse cy="-4" rx="16" ry="4" fill="${p.bowl || '#ecd3a0'}" ${st}/></g>`;
    if (p.prop === 'tambor') g += `<g transform="translate(${lx} 168)"><rect x="-11" y="-14" width="22" height="30" rx="4" fill="#a8522e" ${st}/><ellipse cy="-14" rx="11" ry="4" fill="#ecd3a0" ${st}/></g>`;
    if (p.prop === 'flores') g += `<g transform="translate(${lx} 160)"><path d="M0 14 L-4 -8 M0 14 L4 -10 M0 14 V-12" stroke="#4f8a36" stroke-width="2.4"/>${[[-4, -10], [4, -12], [0, -15]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#f6a81e" ${st}/>`).join('')}</g>`;
    if (p.prop === 'cacao') g += `<g transform="translate(${lx} 162)"><path d="M0 -14 C 10 -10 10 10 0 14 C -10 10 -10 -10 0 -14Z" fill="#a8521e" ${st}/></g>`;
    if (p.prop === 'red') g += `<g transform="translate(${lx - 4} 164)"><path d="M-12 -14 L12 -14 L8 14 L-8 14Z" fill="rgba(200,180,138,.3)" stroke="#c8b48a" stroke-width="2"/><path d="M-6 4 C 0 -2 6 4 0 8Z" fill="#7fa8c8" ${st}/></g>`;
    if (p.prop === 'panal') g += `<g transform="translate(${lx} 164)"><rect x="-8" y="-14" width="16" height="28" rx="6" fill="#c89a50" ${st}/><circle cx="12" cy="-16" r="2.4" fill="#f2c94c"/></g>`;
    return `<svg class="fig fig--cuento" viewBox="-14 -10 148 280" role="img" aria-label="${p.name}">${g}</svg>`;
  }

  // ---------- Lienzo de Tlaxcala ----------
  function lienzo(p) {
    const K = '#2a1a10', ink = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
    const bw = [0, 5, 10][p.build || 0], sk = p.skin, hair = p.hair, hs = p.hairStyle;
    const top = p.top || '#f3ede2', trim = p.trim || '#c0392b', skirt = p.skirt || '#2f5fa8';
    let g = '';
    if (p.prop === 'lanza') g += `<path d="M92 196 V18" ${ink}/><path d="M92 18 V196" stroke="#a8743a" stroke-width="1.4"/><path d="M92 4 l-6 16 h12Z" fill="#3a3a4a" ${ink}/>`;
    if (p.prop === 'arco') g += `<path d="M94 64 C 114 96 114 150 94 182" fill="none" ${ink}/><path d="M94 64 V182" stroke="${K}" stroke-width="1"/>`;
    // Hair mass behind (profile, facing right).
    if (hs === 'afro') g += `<circle cx="52" cy="38" r="30" fill="${hair}" ${ink}/>`;
    else if (hs === 'rizos') g += `<path d="M30 30 C 26 60 28 90 34 104 L62 104 C 60 80 62 50 60 26Z" fill="${hair}" ${ink}/>${[40, 52, 64, 76, 88, 100].map(y => `<circle cx="32" cy="${y}" r="6" fill="${hair}" ${ink}/>`).join('')}`;
    else if (hs === 'largo') g += `<path d="M32 30 C 28 60 30 90 34 104 L58 104 C 56 80 58 50 58 26Z" fill="${hair}" ${ink}/>`;
    else if (hs === 'coleta') g += `<path d="M34 34 C 18 40 14 70 22 90 C 26 74 30 56 40 46Z" fill="${hair}" ${ink}/>`;
    else if (hs === 'trenzas') g += `<path d="M36 50 C 30 70 30 90 34 108" stroke="${K}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M36 50 C 30 70 30 90 34 108" stroke="${hair}" stroke-width="6" fill="none" stroke-linecap="round" stroke-dasharray="5 2"/><rect x="29" y="106" width="10" height="5" fill="${p.acc2 || '#c0392b'}" ${ink}/>`;
    // Feet in profile with sandals.
    g += `<path d="M44 186 h8 v6 h14 c 4 0 4 6 0 6 h-22Z M62 186 h8 v6 h14 c 4 0 4 6 0 6 h-22Z" fill="${sk}" ${ink}/><path d="M44 196 H66 M62 196 H84" stroke="#7a4a24" stroke-width="3"/>`;
    // Cueitl: frontal rectangle with greca band.
    g += `<path d="M${38 - bw} 120 H${82 + bw} L${84 + bw} 188 H${36 - bw}Z" fill="${skirt}" ${ink}/><rect x="${37 - bw}" y="172" width="${46 + 2 * bw}" height="12" fill="#f3ede2" ${ink}/>`;
    let gr = ''; for (let x = 40 - bw; x < 80 + bw; x += 10) gr += `M${x} 182 v-6 h5 v-3 h5`; g += `<path d="${gr}" fill="none" stroke="${trim}" stroke-width="2.2"/>`;
    // Torso frontal: huipil / quechquémitl / quilted armour, with fringe.
    if (p.style === 'quech') g += `<path d="M${36 - bw} 72 H${84 + bw} L60 132Z" fill="${top}" ${ink}/><path d="M${42 - bw} 78 L60 122 L${78 + bw} 78" fill="none" stroke="${trim}" stroke-width="3"/>`;
    else if (p.style === 'armadura') { g += `<rect x="${36 - bw}" y="70" width="${48 + 2 * bw}" height="56" rx="3" fill="${top}" ${ink}/>`; for (let y = 78; y < 124; y += 8) g += `<path d="M${38 - bw} ${y} H${82 + bw}" stroke="${K}" stroke-width="1"/>`; g += `<rect x="${36 - bw}" y="120" width="${48 + 2 * bw}" height="8" fill="${trim}" ${ink}/>`; }
    else { g += `<path d="M${34 - bw} 72 H${86 + bw} L${88 + bw} 132 H${32 - bw}Z" fill="${top}" ${ink}/><path d="M50 72 V86 H70 V72" fill="none" stroke="${trim}" stroke-width="3"/><rect x="${33 - bw}" y="120" width="${54 + 2 * bw}" height="8" fill="${trim}" ${ink}/>`; for (let x = 34 - bw; x < 86 + bw; x += 5) g += `<path d="M${x} 132 v5" stroke="${K}" stroke-width="1.6"/>`; }
    if (p.jade) g += [50, 56, 62, 68].map(x => `<circle cx="${x}" cy="76" r="3" fill="#3fa37a" ${ink}/>`).join('');
    // Arms: back arm down, front arm bent forward holding the prop.
    g += `<path d="M38 76 C 30 92 30 108 34 118" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M38 76 C 30 92 30 108 34 118" fill="none" stroke="${sk}" stroke-width="6" stroke-linecap="round"/>`;
    g += `<path d="M80 76 C 86 90 88 100 92 104" fill="none" stroke="${K}" stroke-width="10" stroke-linecap="round"/><path d="M80 76 C 86 90 88 100 92 104" fill="none" stroke="${sk}" stroke-width="6" stroke-linecap="round"/><circle cx="93" cy="105" r="5" fill="${sk}" ${ink}/>`;
    // Head in profile.
    g += `<path d="M54 62 v10 h12 v-10" fill="${sk}" ${ink}/>`;
    g += `<path d="M40 40 C 40 20 54 12 66 14 C 76 16 80 26 80 34 L84 42 L80 44 C 82 48 80 50 78 50 C 80 54 76 58 70 58 L66 62 C 56 66 44 60 40 50Z" fill="${sk}" ${ink}/>`;
    g += `<path d="M70 32 C 73 30 77 31 78 33 C 76 35 72 35 70 32Z" fill="#fff" stroke="${K}" stroke-width="1.6"/><circle cx="75" cy="32.6" r="1.5" fill="${K}"/><path d="M68 27 q5 -3 10 0" stroke="${K}" stroke-width="2" fill="none"/>`;
    g += `<circle cx="54" cy="38" r="5" fill="#e9b33e" ${ink}/><circle cx="54" cy="38" r="2" fill="#3fa37a"/>`;
    if (p.paint) g += `<path d="M64 40 h10" stroke="${p.paint}" stroke-width="3"/>`;
    // Hair cap.
    if (hs === 'afro') g += `<path d="M38 40 C 30 14 70 2 76 22 C 66 18 56 22 50 32 C 46 34 42 38 38 40Z" fill="${hair}" ${ink}/>`;
    else if (hs === 'rizos') g += `<path d="M38 44 C 32 14 72 6 76 24 C 66 20 58 22 52 30 C 48 30 42 36 38 44Z" fill="${hair}" ${ink}/>${[44, 54, 64, 72].map((x, i) => `<circle cx="${x}" cy="${18 + (i % 2) * 3}" r="5" fill="${hair}" ${ink}/>`).join('')}`;
    else g += `<path d="M38 44 C 34 14 70 6 77 24 C 70 22 62 22 56 26 C 54 30 50 32 46 32 C 44 36 40 40 38 44Z" fill="${hair}" ${ink}/>`;
    if (hs === 'chongo') g += `<circle cx="46" cy="14" r="9" fill="${hair}" ${ink}/>`;
    if (p.head === 'plumas') g += ['#2f8f8a', '#7cb04a', '#e9b33e', '#c0392b', '#2f8f8a'].map((c, i) => `<path transform="rotate(${-40 + i * 16} 50 22)" d="M50 22 C 44 10 46 -4 50 -10 C 54 -4 56 10 50 22Z" fill="${c}" ${ink}/>`).join('') + `<path d="M40 24 C 52 16 66 16 76 22 L74 28 C 64 22 52 22 42 30Z" fill="#e9b33e" ${ink}/>`;
    if (p.head === 'pluma') g += `<path transform="rotate(-30 46 22)" d="M46 22 C 40 10 42 -4 46 -10 C 50 -4 52 10 46 22Z" fill="${p.acc2 || '#c0392b'}" ${ink}/><path d="M40 26 C 52 18 66 18 77 24 L76 29 C 64 24 52 24 42 31Z" fill="${p.band || '#c0392b'}" ${ink}/>`;
    if (p.head === 'banda') g += `<path d="M40 26 C 52 18 66 18 77 24 L76 29 C 64 24 52 24 42 31Z" fill="${p.band || '#c0392b'}" ${ink}/>`;
    if (p.head === 'flor') g += `<g transform="translate(48 20)">${[0, 72, 144, 216, 288].map(a => `<ellipse cy="-5" rx="4" ry="5" transform="rotate(${a})" fill="${p.flower || '#e05a7a'}" ${ink}/>`).join('')}<circle r="2.6" fill="#e9b33e"/></g>`;
    if (p.head === 'cempa') g += [40, 50, 60, 70].map((x, i) => `<circle cx="${x}" cy="${20 - (i === 1 || i === 2 ? 4 : 0)}" r="5.4" fill="#f29a1e" ${ink}/>`).join('');
    // Speech scroll: the codex sign for a speaking figure.
    g += `<path d="M86 44 c 8 -2 10 -10 4 -12 c -4 -1 -6 3 -3 5" fill="none" stroke="${K}" stroke-width="2"/>`;
    // Props in front.
    if (p.prop === 'escudo') g += `<g transform="translate(96 108)"><circle r="18" fill="#f3ede2" ${ink}/><circle r="12" fill="${p.shield || '#2f5fa8'}" ${ink}/><path d="M-12 0 H12 M0 -12 V12" stroke="#f3ede2" stroke-width="2.6"/>${[-10, -3, 4, 11].map(x => `<path d="M${x} 16 l-2 10 h4Z" fill="#2f8f8a" ${ink}/>`).join('')}</g>`;
    if (p.prop === 'canasta') g += `<g transform="translate(98 112)"><path d="M-12 0 H12 L9 16 H-9Z" fill="#d8a85a" ${ink}/>${[-6, 0, 6].map((x, i) => `<circle cx="${x}" cy="-2" r="4" fill="${['#c0392b', '#e9b33e', '#7cb04a'][i]}" ${ink}/>`).join('')}</g>`;
    if (p.prop === 'jicara') g += `<g transform="translate(98 106)"><path d="M-12 0 C -12 12 12 12 12 0Z" fill="#a8522e" ${ink}/></g>`;
    if (p.prop === 'tambor') g += `<g transform="translate(102 112)"><rect x="-9" y="-12" width="18" height="26" fill="#a8522e" ${ink}/><path d="M-9 -12 H9" stroke="#f3ede2" stroke-width="3"/></g>`;
    if (p.prop === 'flores') g += `<g transform="translate(96 98)"><path d="M0 8 V-10" ${ink}/>${[[-5, -10], [5, -12], [0, -16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4.4" fill="#f29a1e" ${ink}/>`).join('')}</g>`;
    if (p.prop === 'cacao') g += `<path transform="translate(98 104)" d="M0 -12 C 9 -8 9 8 0 12 C -9 8 -9 -8 0 -12Z" fill="#a8521e" ${ink}/>`;
    if (p.prop === 'red') g += `<path transform="translate(100 108)" d="M-10 -10 L10 -10 L7 12 L-7 12Z" fill="none" ${ink}/>`;
    if (p.prop === 'panal') g += `<rect x="92" y="96" width="14" height="22" rx="5" fill="#c89a50" ${ink}/>`;
    return `<svg class="fig fig--lienzo" viewBox="0 -14 124 216" role="img" aria-label="${p.name}">${g}</svg>`;
  }

  window.TlaxFigs = { cuento, lienzo };
})();
