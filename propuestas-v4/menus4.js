// Codex-style menus framed in tile (Talavera or pre-Hispanic Mixteca-Puebla polychrome).
// Panels are screenfold codex pages (gesso on deerskin, fold lines, red scene rules);
// counts use dots and bars, friendship uses xochitl flowers, prices the cacao bean.
"use strict";
(function () {
  const { CAST, PLAYER } = window.TlaxChars, F = window.TlaxFigs4;
  const K = '#1a1410', O = `stroke="${K}" stroke-width="2.8" stroke-linejoin="round"`;

  // Item icons, 64×64: ink outline, flat colour, one shade and one highlight each.
  const hl = (d, c = '#fff', w = 2.6, o = .85) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" opacity="${o}"/>`;
  const shaft = (d, c = '#b07a3a', w = 4.4) => `<path d="${d}" stroke="${K}" stroke-width="${w + 4}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const cob = (fill, kern, kernLine, shine) => {
    let k = '';
    for (let y = 15; y <= 45; y += 4.6) for (let x = 27; x <= 41; x += 4.6) { const dx = (x - 34) / 9.4, dy = (y - 30) / 17.4; if (dx * dx + dy * dy <= 1) k += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="1.9" fill="${kern}" stroke="${kernLine}" stroke-width=".8"/>`; }
    return `<path d="M14 58 C 12 40 20 28 30 22 C 28 36 26 46 26 58Z" fill="#5fa040" ${O}/><g transform="rotate(22 34 30)"><ellipse cx="34" cy="30" rx="11" ry="20" fill="${fill}" ${O}/>${k}${hl('M27.6 16 C 25 24 25 34 27 42', shine, 2.2)}</g><path d="M22 60 C 30 46 40 40 52 36 C 44 46 38 54 34 62Z" fill="#7cb04a" ${O}/>${hl('M27 57 C 33 48 40 43 47 39.6', '#c4e69a', 1.6)}<path d="M44 10 C 46 5 50 3 54 3 M43 11 C 47 8 51 8 55 8" stroke="#d9a35a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
  };
  const IC = {
    coa: `${shaft('M50 6 L21 43')}${hl('M48.6 8 L22.6 41', '#e8c08a', 1.4)}${shaft('M29 32.6 L35 37.4', '#b07a3a', 2.6)}<path d="M19.3 39.8 L24.7 44.2 L17.1 60 C 13 63 6 58 6.9 52 Z" fill="#7a4a24" ${O}/>${hl('M19 45 L11.6 55', '#b8804a', 1.6)}`,
    cantaro: `<path d="M48 24 C 58 24 58 40 50 42" stroke="${K}" stroke-width="5" fill="none"/><path d="M48 24 C 58 24 58 40 50 42" stroke="#c46a32" stroke-width="2" fill="none"/><path d="M32 16 C 18 18 10 30 12 42 C 14 54 24 60 32 60 C 40 60 50 54 52 42 C 54 30 46 18 32 16Z" fill="#d07a3a" ${O}/><path d="M44 24 C 52 32 52 48 40 57" stroke="#a8521e" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M25 7 H39 L37 18 H27Z" fill="#b8622e" ${O}/><path d="M14 38 h4 v-4 h6 v4 h4 v-4 h6 v4 h4 v-4 h6 v4 h4" fill="none" stroke="#f6e2b8" stroke-width="2.4"/>${hl('M18 30 C 19 25 22 22 26 20', '#ffd0a0', 2.6)}`,
    hacha: `${shaft('M22 60 L43 8')}${hl('M23.6 57 L42 11', '#e8c08a', 1.4)}<path d="M40.6 13 C 31 8 14 11 9 22 C 12 30 27 28 41 24 Z" fill="#3f8a6a" ${O}/><path d="M12 25 C 22 27 32 25 40 22" stroke="#2a6a4e" stroke-width="2.4" fill="none"/>${hl('M13 20 C 17 15 25 13 32 14', '#a8e0c4', 2.2)}<path d="M38.4 10.6 L45.6 17 M36.8 14.6 L44 21" stroke="#c0392b" stroke-width="2.6" stroke-linecap="round"/>`,
    obsidiana: `<path d="M15 57 C 19 41 33 21 50 8 C 52.6 6.6 55 9 53.4 11.4 C 44 26 32 44 22 58 C 20 61.4 14 61 15 57 Z" fill="#2a2a3c" ${O}/><path d="M20 54 C 26 40 38 22 50 10.6" stroke="#6a6a92" stroke-width="1.8" fill="none"/><path d="M24 56 C 31 44 40 30 51 13" stroke="#14141e" stroke-width="1.6" fill="none"/>${hl('M30 34 L37.4 25', '#e8ecff', 2.6, 1)}${hl('M43 18 L46 14.4', '#e8ecff', 2, 1)}`,
    maiz: cob('#f2c94c', '#f8dc74', '#c8962e', '#fff6c8'),
    maizAzul: cob('#3d63b8', '#6f90e0', '#22397a', '#c8d8ff'),
    frijol: [[22, 25, -18], [42, 30, 24], [29, 45, 6]].map(([x, y, a]) => `<g transform="rotate(${a} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="10.4" ry="7.2" fill="#8f2a24" ${O}/><path d="M${x - 8} ${y + 2} C ${x - 4} ${y + 6} ${x + 4} ${y + 6} ${x + 8} ${y + 2}" stroke="#5e1a14" stroke-width="2.2" fill="none"/><ellipse cx="${x - 3}" cy="${y - 2.6}" rx="3.8" ry="1.7" fill="#e88a7a"/><path d="M${x + 1} ${y + 3.4} q 2.4 -.6 3.4 -3" stroke="#f1dcc0" stroke-width="1.5" fill="none"/></g>`).join(''),
    calabaza: `<path d="M31 21 C 31 13 35 9 40 9" stroke="${K}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M31 21 C 31 13 35 9 40 9" stroke="#6a8a36" stroke-width="2.8" fill="none" stroke-linecap="round"/><path d="M39 17 C 45 9 55 11 57 17 C 51 21 43 21 39 17Z" fill="#6fa23e" ${O}/><ellipse cx="32" cy="39" rx="25" ry="18" fill="#e07a28" ${O}/><ellipse cx="32" cy="39" rx="14" ry="18" fill="#ee8d36" stroke="#a8521e" stroke-width="1.8"/><ellipse cx="32" cy="39" rx="5" ry="18" fill="#f6a24a" stroke="#a8521e" stroke-width="1.8"/><path d="M49 27 C 58 33 58 47 47 54" stroke="#b85a18" stroke-width="3.2" fill="none" stroke-linecap="round"/>${hl('M14 33 C 16 27 20 24 24 23', '#ffd6a0', 2.8)}`,
    chile: `<path d="M42 14 C 52 18 52 32 44 42 C 36 54 22 59 10 58 C 20 52 28 44 32 34 C 35 26 36 18 42 14Z" fill="#d0342a" ${O}/><path d="M48 27 C 47 35 42 42 34 49" stroke="#9a2018" stroke-width="3" fill="none" stroke-linecap="round"/>${hl('M39 22 C 38 30 35 37 28.6 45', '#ff9a8a', 2.6)}<path d="M37 16 C 39 10 47 9 50 13 C 46 18 41 18 37 16Z" fill="#4f8a36" ${O}/>${shaft('M45 11 C 46 6 49 4 53 3', '#5f9a3e', 2.4)}`,
    cacao: `<path d="M32 6 C 50 14 50 50 32 58 C 14 50 14 14 32 6Z" fill="#8f4a22" ${O}/><path d="M32 6 C 50 14 50 50 32 58 C 40 46 41 20 32 6Z" fill="#6e3414"/><path d="M32 6 C 50 14 50 50 32 58 C 14 50 14 14 32 6Z" fill="none" ${O}/><path d="M32 11 C 38 22 38 42 32 53" stroke="#4a2008" stroke-width="2" fill="none"/>${hl('M24.6 17 C 21 27 21 38 24.6 47', '#d8946a', 2.8)}`,
    tlaxcalli: `<path d="M6 43 L32 58 L58 43 L32 32Z" fill="#f6efe0" ${O}/><path d="M12 46 L38 35 M19 50 L45 39 M26 54 L52 43" stroke="#c0392b" stroke-width="2.2"/>${[44, 38, 32].map(y => `<ellipse cx="32" cy="${y}" rx="21" ry="7.6" fill="#ecd3a0" ${O}/>`).join('')}${[[24, 31], [36, 30], [42, 33.6], [30, 34]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.6" ry="1.3" fill="#c8955a"/>`).join('')}${hl('M18 30 C 24 27 34 26.4 42 27.6', '#fff6dc', 2)}`,
    octli: `<path d="M13 28 C 7 44 17 60 32 60 C 47 60 57 44 51 28 Z" fill="#b8622e" ${O}/><path d="M47 33 C 51 45 47 54 37 58" stroke="#8a3e18" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M11.6 41 H52.4" stroke="#f6e2b8" stroke-width="2.4"/><path d="M11.4 47 h4 v-3 h5 v3 h4 v-3 h5 v3 h4 v-3 h5 v3 h4 v-3 h5" stroke="#f6e2b8" stroke-width="1.8" fill="none"/>${hl('M16 33 C 15 40 17 47 20 51', '#ffc89a', 2.4)}<ellipse cx="32" cy="27" rx="20" ry="6" fill="#8a3e18" ${O}/><path d="M12 26 C 10 18 18 14 24 18 C 26 12 36 11 39 17 C 44 13 54 17 52 25 C 54 29 50 32 46.4 30 C 44 33 40.6 32.6 40 30.6 C 38 35 33.6 35 32 31 C 28 33.6 24 33.4 22 30.4 C 18 32 12 30 12 26Z" fill="#fbf8f0" ${O}/><path d="M46 30.6 C 47 35 49 37.6 48.2 41 C 47.4 43.4 44.8 42.8 45 40.4 C 45.2 37 44.2 34 44 31.4" fill="#fbf8f0" stroke="${K}" stroke-width="2" stroke-linejoin="round"/>${[[20, 22, 1.6], [30, 19, 1.4], [42, 21, 1.8], [36, 25, 1.1]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#c9c0ae" stroke-width="1"/>`).join('')}`,
    nopal: `<ellipse cx="17" cy="20" rx="7.6" ry="10.4" transform="rotate(-28 17 20)" fill="#6fae60" ${O}/><ellipse cx="46" cy="22" rx="9.6" ry="12.6" transform="rotate(28 46 22)" fill="#6fae60" ${O}/><ellipse cx="30" cy="42" rx="15" ry="19" transform="rotate(-8 30 42)" fill="#5f9a54" ${O}/>${hl('M20 32 C 18 40 19 48 22 54', '#a8d690', 2.4)}${hl('M41 16 C 40 20 40 24 41 27', '#c4e6a8', 2)}${[[25, 33], [35, 31], [28, 44], [38, 47], [23, 52], [33, 54], [44, 17], [49, 26], [15, 16], [19, 23]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#f1e8c8"/><path d="M${x - 2} ${y - 2} l-1.6 -1.6 M${x + 2} ${y - 2} l1.6 -1.6" stroke="#f1e8c8" stroke-width="1"/>`).join('')}<ellipse cx="52" cy="9.6" rx="4.6" ry="5.6" fill="#c2307a" ${O}/><ellipse cx="11" cy="8" rx="3.8" ry="4.8" fill="#e0507a" ${O}/>`,
    cempa: `${Array.from({ length: 12 }, (_, i) => `<ellipse cx="32" cy="15" rx="6.4" ry="10" transform="rotate(${i * 30} 32 32)" fill="#f29a1e" ${O}/>`).join('')}${Array.from({ length: 8 }, (_, i) => `<ellipse cx="32" cy="22" rx="5" ry="7" transform="rotate(${i * 45 + 22} 32 32)" fill="#f6b81e" stroke="${K}" stroke-width="1.8"/>`).join('')}<circle cx="32" cy="32" r="6.4" fill="#e07a12" ${O}/>${[[30, 30], [34, 31], [31, 34.4], [35, 34.6]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1" fill="#8a3a08"/>`).join('')}`,
    sal: `<path d="M8 38 C 8 54 20 60 32 60 C 44 60 56 54 56 38Z" fill="#c46a32" ${O}/><path d="M11.6 47 h5 v-4 h6 v4 h6 v-4 h6 v4 h6 v-4 h6 v4 h4" stroke="#f6e2b8" stroke-width="2" fill="none"/><path d="M48 42 C 50 50 44 56 36 58" stroke="#8a3e18" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M10 38 C 12 28 20 22 26 24 C 30 16 38 16 42 22 C 48 22 54 30 54 38Z" fill="#fbfbf8" ${O}/><path d="M41 24 C 47 26.6 51 32 51.4 37" stroke="#c8d4e6" stroke-width="3.4" fill="none" stroke-linecap="round"/>${[[22, 31], [34, 25], [30, 33], [44, 32]].map(([x, y]) => `<rect x="${x - 2}" y="${y - 2}" width="4" height="4" transform="rotate(45 ${x} ${y})" fill="#e6eef8" stroke="#8aa0c0" stroke-width=".9"/>`).join('')}<path d="M49 7 v9 M44.6 11.6 h9" stroke="#8aa0c0" stroke-width="2.2" stroke-linecap="round"/>`,
    copal: `<path d="M17 29 c -6 -8 6 -12 0 -20 M27 29 c -6 -8 6 -12 0 -21 M37 29 c -5 -6 5 -10 0 -16" stroke="#8a96b4" stroke-width="2.8" fill="none" stroke-linecap="round"/>${shaft('M34 46 L59 56', '#c46a32', 3.6)}<circle cx="59" cy="56" r="3.6" fill="#e9b33e" ${O}/><path d="M8 33 H42 L37.6 51 C 35.6 56 14.4 56 12.4 51 Z" fill="#c46a32" ${O}/>${[[17, 41], [25, 43], [33, 41]].map(([x, y]) => `<path d="M${x - 3} ${y + 3} l3 -6 l3 6Z" fill="${K}"/>`).join('')}<path d="M36 36 C 36 44 34 50 31 53" stroke="#8a3e18" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="M14 33 C 17 28 32 28 36 33" fill="#f2c94c" stroke="${K}" stroke-width="2"/><path d="M6 33 H44" stroke="${K}" stroke-width="3.4" stroke-linecap="round"/>${hl('M13 38 C 13.6 43 15 47 17 50', '#ffc89a', 2.2)}`,
    chimalli: `${['#2f8f8a', '#c0392b', '#e9b33e', '#c0392b', '#2f8f8a'].map((c, i) => `<path d="M${20 + i * 6} 45 l-3.6 15 h7.2Z" fill="${c}" ${O}/>`).join('')}<circle cx="32" cy="28" r="21" fill="#f3ede2" ${O}/><circle cx="32" cy="28" r="15" fill="#2f5fa8" ${O}/><path d="M18.6 31 h6.4 v-6 h7 v6 h7 v-6 h6.4" stroke="#f3ede2" stroke-width="3" fill="none"/><path d="M41 15 C 47 20 49 28 45 36" stroke="#1e3c78" stroke-width="3" fill="none" stroke-linecap="round"/>${hl('M15.4 20 C 18.6 13 24.6 9 31 8.4', '#fff', 2.4)}`,
    costal: `<path d="M16 22 C 9 34 9 52 18 59 H46 C 55 52 55 34 48 22 Z" fill="#d8b47a" ${O}/><path d="M46 26 C 52 36 52 50 44 57" stroke="#a8824a" stroke-width="3" fill="none" stroke-linecap="round"/>${[[24, 14, '#f2c94c'], [32, 12, '#3d63b8'], [40, 14, '#c0392b']].map(([x, y, c]) => `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="3" fill="${c}" ${O}/>`).join('')}<path d="M18 19 C 24 13 40 13 46 19 L44 25 C 38 21 26 21 20 25Z" fill="#c49a5a" ${O}/><path d="M20 25.6 C 28 28.6 36 28.6 44 25.6" stroke="#c0392b" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M32 53 V41 M32 47 C 27 43 23 44.6 22 45 M32 45 C 37 41 41 42.6 42 43" stroke="#3f7a2e" stroke-width="2.4" fill="none" stroke-linecap="round"/>${hl('M17 36 C 16 44 17 50 20 54', '#f6e2b8', 2.4)}`,
  };
  // Small glyphs: stats (tonalli = energy, heart = life, flower = spirit) and fame (quetzal feather).
  const STAT = {
    tonalli: `${Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 45} 32 32)" d="M26 12 L32 2 L38 12Z" fill="#e9b33e" ${O}/>`).join('')}<circle cx="32" cy="32" r="18" fill="#f2c94c" ${O}/><circle cx="32" cy="32" r="9" fill="#e07a28" ${O}/>${hl('M20 26 C 22 21 26 18 30 17', '#fff8d8', 2.6)}`,
    vida: `<path d="M32 58 C 14 44 6 34 6 22 C 6 13 13 7 21 7 C 27 7 30 10 32 14 C 34 10 37 7 43 7 C 51 7 58 13 58 22 C 58 34 50 44 32 58Z" fill="#d0342a" ${O}/><path d="M47 14 C 53 18 54 28 48 36" stroke="#9a2018" stroke-width="3.4" fill="none" stroke-linecap="round"/>${hl('M14 18 C 15 14 18 12 22 12', '#ffb0a4', 3)}`,
    animo: `${[0, 90, 180, 270].map(a => `<ellipse cx="32" cy="16" rx="10" ry="13" transform="rotate(${a} 32 32)" fill="#d9443a" ${O}/>`).join('')}${[45, 135, 225, 315].map(a => `<ellipse cx="32" cy="19" rx="6" ry="9" transform="rotate(${a} 32 32)" fill="#f2c94c" stroke="${K}" stroke-width="2.2"/>`).join('')}<circle cx="32" cy="32" r="7.6" fill="#f6efe0" ${O}/><circle cx="32" cy="32" r="3.4" fill="#e07a28"/>`,
  };
  const stat = (k, cls = 'st') => `<svg class="${cls}" viewBox="0 0 64 64" aria-hidden="true">${STAT[k]}</svg>`;
  const feather = on => `<svg class="qz" viewBox="0 0 14 30" aria-hidden="true"><path d="M7 29 V24" stroke="${K}" stroke-width="2"/><path d="M7 24 C 1 18 1 8 7 1 C 13 8 13 18 7 24Z" fill="${on ? '#2f9a6a' : '#e6dcc4'}" stroke="${K}" stroke-width="1.6"/><path d="M7 22 V6" stroke="${on ? '#a8e0c0' : '#fff'}" stroke-width="1.2"/>${on ? '<circle cx="7" cy="8" r="2" fill="#2f5fa8"/>' : ''}</svg>`;
  const feathers = (n, of = 10) => `<span class="qzs">${Array.from({ length: of }, (_, i) => feather(i < n)).join('')}</span>`;
  const icon = (k, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 64 64">${IC[k]}</svg>`;
  const bean = '<svg class="mini" viewBox="0 0 64 64"><path d="M32 6 C 50 14 50 50 32 58 C 14 50 14 14 32 6Z" fill="#a8521e" stroke="#1a1410" stroke-width="4"/></svg>';
  // Dots-and-bars numeral (1–19).
  const dots = (n, cls = 'nd') => { const b = Math.floor(n / 5), d = n % 5; return `<svg class="${cls}" viewBox="0 0 30 ${6 + b * 6 + (d ? 8 : 0)}">${d ? Array.from({ length: d }, (_, i) => `<circle cx="${15 + (i - (d - 1) / 2) * 6.4}" cy="4" r="2.6" fill="${K}"/>`).join('') : ''}${Array.from({ length: b }, (_, i) => `<rect x="3" y="${(d ? 9 : 1) + i * 6}" width="24" height="4" rx="2" fill="${K}"/>`).join('')}</svg>`; };
  // Xochitl flower glyph: friendship.
  const flower = on => `<svg class="xo" viewBox="0 0 24 24"><g ${O.replace('2.8', '1.6')}>${[0, 90, 180, 270].map(a => `<ellipse cx="12" cy="6" rx="4" ry="5.4" transform="rotate(${a} 12 12)" fill="${on ? '#d9443a' : '#efe3c6'}"/>`).join('')}<circle cx="12" cy="12" r="3.4" fill="${on ? '#e9b33e' : '#efe3c6'}"/></g></svg>`;
  const flowers = n => `<span class="xos">${Array.from({ length: 10 }, (_, i) => flower(i < n)).join('')}</span>`;
  // Calli (house) day sign.
  const calli = `<svg class="day" viewBox="0 0 40 40"><path d="M6 18 L20 6 L34 18Z" fill="#c0392b" ${O}/><rect x="9" y="18" width="22" height="16" fill="#f3ede2" ${O}/><rect x="16" y="24" width="8" height="10" fill="${K}"/></svg>`;
  const keys = (...ks) => `<div class="keys">${ks.map(([k, t]) => `<span><kbd>${k}</kbd>${t}</span>`).join('')}</div>`;
  const bg = src => `<div class="gbg" style="background-image:url('${src}')"></div><div class="dim"></div>`;
  const page = (cls, inner) => `<div class="cx ${cls}">${inner}</div>`;
  const frame = (fig, cls = '') => `<div class="cf ${cls}">${fig}</div>`;

  // ---------- Inicio ----------
  function inicio(T) {
    return `<div class="ab">${T.lienzo}
      ${page('logo', `<svg class="glyph" viewBox="0 0 120 110"><path d="M14 104 C 14 60 34 30 60 30 C 86 30 106 60 106 104 Z" fill="#7aa45a" ${O}/><path d="M14 92 H106 V104 H14Z" fill="#e9b33e" ${O}/><ellipse cx="60" cy="30" rx="26" ry="7" fill="#f3e2b8" ${O}/><path d="M30 10 C 34 6 50 8 56 22 L48 24 C 44 18 38 16 32 18 Z" fill="#c48a5a" ${O}/><path d="M90 50 C 86 54 70 52 64 38 L72 36 C 76 42 82 44 88 42 Z" fill="#c48a5a" ${O}/></svg>
        <div><div class="logo__n">Tlaxcallan</div><div class="logo__t">${calli} Año 1-Ácatl · 1519 · llegan extranjeros por el oriente</div></div>`)}
      ${page('tmenu', `<div class="cb cb--on" data-sel="cb"><span>Continuar</span><small>Día 3-Calli · ${bean} 900 300</small></div><div class="cb" data-sel="cb"><span>Nueva partida</span><small>Hereda la milpa de tu padre</small></div><div class="cb" data-sel="cb"><span>Opciones</span><small>Volumen, idioma y mensajes</small></div>`)}
      <div class="foot">Señorío de Tlaxcallan · Tepetícpac · Ocotelulco · Tizatlán · Quiahuiztlán · en guerra con Tenochtitlan</div></div>`;
  }

  const TABS = ['Bolsa', 'Oficios', 'Vecinos', 'Amoxtli', 'Mapa'];
  const tabs = on => `<div class="tabs">${TABS.map(t => `<div class="cb tab${t === on ? ' cb--on' : ''}" data-sel="cb">${t}</div>`).join('')}</div>`;

  // ---------- Bolsa ----------
  const BAR = [['coa', 225], ['cantaro', 8], ['hacha', ''], ['obsidiana', 12], ['costal', 24], ['maizAzul', 19], ['frijol', 14], ['chile', 8], ['maiz', 12], ['calabaza', 3]];
  const BAG = [['calabaza', 12], ['nopal', 5], ['tlaxcalli', 6], ['octli', 2], ['cacao', 18], ['maiz', 19], ['cempa', 9], ['frijol', 7]];
  const slot = (s, i, bar, on) => `<div class="sl${s ? '' : ' sl--e'}${on ? ' sl--on' : ''}" data-sel="sl">${s ? icon(s[0]) : ''}${bar ? `<span class="sl__k">${dots(i + 1 > 9 ? 10 : i + 1, 'nd nd--k')}</span>` : ''}${s && s[1] !== '' ? `<span class="sl__n">${s[1]}</span>` : ''}</div>`;
  const meter = (k, l, v, c) => `<label>${stat(k)}${l}</label><div class="m"><i style="width:${v}%;background:${c}"></i></div><em>${v}</em>`;
  function bolsa(T) {
    return `<div class="ab">${bg(T.milpa)}${tabs('Bolsa')}
      ${page('bag', `<div class="bag__l">${frame(F.borgia(PLAYER, { tight: true }), 'cf--tall')}<div class="who"><b>Tú</b><span>Macehualli · campesino</span></div>
          <div class="fame"><span>Fama</span>${feathers(3)}</div>
          <div class="ms">${meter('tonalli', 'Energía', 92, '#2f7ac0')}${meter('vida', 'Vida', 85, '#c0392b')}${meter('animo', 'Ánimo', 70, '#3f9a3a')}</div>
          <div class="purse purse--bag">${bean}<b>900 300</b><small>cacao</small></div></div>
        <div class="bag__r">
          <div class="item"><div class="item__ic">${icon('coa')}</div><div class="item__t"><b>Coa</b><small>Huictli · herramienta de labranza</small><p>Abre la tierra frente a ti. Pulsa Espacio con la coa en la mano.</p></div>
            <div class="item__s"><div class="kv"><span>Usos</span><b>225 / 225</b></div><div class="m m--s"><i style="width:100%;background:#3f9a3a"></i></div><div class="row2"><div class="cb cb--on">Usar</div><div class="cb">Soltar</div></div></div></div>
          <div class="sh"><b>Barra</b><span>teclas 1–0 · Q ⇄ bolsa</span></div>
          <div class="sls">${BAR.map((s, i) => slot(s, i, true, i === 0)).join('')}</div>
          <div class="sh"><b>Chitatli 1 de 5</b><span>◂ ▸ cambiar morral · +151</span></div>
          <div class="sls">${Array.from({ length: 20 }, (_, i) => slot(BAG[i], i, false, false)).join('')}</div>
        </div>`)}
      ${keys(['Q', 'cerrar'], ['1–0', 'barra'], ['◂ ▸', 'morral'])}</div>`;
  }

  // ---------- Tianguis ----------
  function tianguis(T) {
    const seller = CAST[12];
    const rows = [['maizAzul', 'Maíz azul', 'Semilla · brota en 6 días', 12, 3], ['frijol', 'Frijol ayocote', 'Semilla · trepa por la caña', 6, 0], ['calabaza', 'Calabaza', 'Semilla · cubre la milpa', 10, 0], ['chile', 'Chile', 'Semilla · para el molli', 8, 0], ['obsidiana', 'Navaja de obsidiana', 'Filo para la macuahuitl', 20, 0]]
      .map(([k, n, d, p, q], i) => `<div class="pr${i ? '' : ' pr--on'}" data-sel="pr"><div class="pr__ic">${icon(k)}</div><div class="pr__t"><b>${n}</b><small>${d}</small></div><span class="pr__p">${bean} ${p}</span><div class="qty"><u>−</u><b>${q}</b><u>+</u></div></div>`).join('');
    return `<div class="ab">${bg(T.plaza)}
      <div class="seller">${frame(F.borgia(seller, { tight: true, speaking: true }), 'cf--seller')}
        ${page('talk', `<div class="talk__n">${seller.name}<small>${seller.role}</small></div><p>Llegaron cargadores de la costa con cacao. La sal ya no pasa: los mexicas cerraron los caminos.</p><div class="talk__f">${flowers(6)}<span>▼</span></div>`)}</div>
      ${page('shop', `<div class="shop__h"><b>Tianguis de Ocotelulco</b><span class="purse">${bean} 900 300</span></div>
        <div class="chips"><span class="cb chip cb--on" data-sel="cb">Semillas</span><span class="cb chip" data-sel="cb">Comida</span><span class="cb chip" data-sel="cb">Ofrendas</span><span class="cb chip" data-sel="cb">Armas</span></div>
        <div class="prs">${rows}</div>
        <div class="shop__f"><span>Total <b>${bean} 36</b></span><div class="row2"><div class="cb">Vender</div><div class="cb cb--on">Comprar</div></div></div>`)}
      ${keys(['▲▼', 'producto'], ['◂ ▸', 'cantidad'], ['Enter', 'comprar'], ['Esc', 'salir'])}</div>`;
  }

  // ---------- Vecinos ----------
  const HOME = ['Tepetícpac', 'Ocotelulco', 'Tizatlán', 'Quiahuiztlán'];
  function vecinos(T) {
    const sel = 4, p = CAST[sel];
    const cards = CAST.map((c, i) => `<div class="vc${i === sel ? ' vc--on' : ''}" data-sel="vc"><div class="vc__a">${F.borgia(c, { top: -26 })}</div><b>${c.name}${c.romance ? ' <i class="love">♥</i>' : ''}</b></div>`).join('');
    return `<div class="ab">${bg(T.plaza)}${tabs('Vecinos')}
      ${page('vec', `<div class="vec__g">${cards}</div>
        <div class="vec__s">${frame(F.borgia(p, { tight: true }), 'cf--big')}
          <div class="vec__n">${p.name}</div><div class="vec__r">${p.role}</div>${flowers(9)}
          <p class="vec__l">«${p.line}»</p>
          <div class="facts"><span>Vive en</span><b>${HOME[sel % 4]}</b><span>Le encanta</span><b>${icon('octli', 'mini')} Octli</b><span>Nació</span><b>${calli} 7-Calli</b></div>
          <div class="cb cb--on">Hacer un regalo</div></div>`)}
      ${keys(['Q', 'cerrar'], ['◂ ▸', 'pestaña'], ['Enter', 'ver'])}</div>`;
  }

  // ---------- Pausa ----------
  function pausa(T) {
    const sl = (l, v) => `<div class="set set--n"><span>${l}</span><div class="sld"><i style="width:${v * 10}%"></i><b style="left:${v * 10}%"></b></div>${dots(v, 'nd nd--v')}</div>`;
    const tg = (l, a, b) => `<div class="set"><span>${l}</span><div class="chips"><span class="cb chip cb--on" data-sel="cb">${a}</span><span class="cb chip" data-sel="cb">${b}</span></div></div>`;
    return `<div class="ab">${bg(T.milpa)}<div class="dim dim--deep"></div>
      ${page('ph', `<div class="ph__t">Pausa</div><div class="ph__d">${calli} Día 3-Calli · veintena Tlacaxipehualiztli · año 1-Ácatl</div>`)}
      ${page('plist', ['Reanudar', 'Guardar en el amoxtli', 'Opciones', 'Controles', 'Salir al menú'].map((t, i) => `<div class="cb${i === 2 ? ' cb--on' : ''}${i === 4 ? ' cb--x' : ''}" data-sel="cb"><span>${t}</span></div>`).join(''))}
      ${page('popts', `${sl('Música', 7)}${sl('Efectos', 5)}${tg('Pantalla', 'Completa', 'Ventana')}${tg('Tutorial', 'Mostrar', 'Ocultar')}${tg('Clima', 'Lluvia y rayos', 'Suave')}
        <div class="set"><span>Idioma</span><div class="cyc"><u>◂</u><b>Español</b><u>▸</u></div></div>`)}
      ${keys(['Esc', 'volver'], ['Enter', 'aceptar'], ['◂ ▸', 'cambiar'])}</div>`;
  }

  window.TlaxMenus4 = { inicio, bolsa, tianguis, vecinos, pausa, kit: { icon, bean, dots, flower, flowers, calli, keys, bg, page, frame, IC, stat, feathers } };
})();
