// v4 page: codex menus framed in tile, with a Talavera / polychrome switch,
// plus the cast in the two new styles (Códice Borgia, barro de Xochitécatl).
"use strict";
(function () {
  const X = window.TlaxTex, M = window.TlaxMenus4, F = window.TlaxFigs4, { CAST, PLAYER } = window.TlaxChars;
  const root = document.documentElement.style;
  root.setProperty('--deco', `url(${X.decoTile()})`); root.setProperty('--plain', `url(${X.plainTiles()})`); root.setProperty('--cobalt', `url(${X.cobaltTile()})`);
  // Mixteca-Puebla polychrome tile: cream slip, red and black stepped fret, white dots.
  const poli = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="#ecc890"/><rect x="1" y="1" width="46" height="46" fill="#f1d6a2" stroke="#1a1410" stroke-width="2"/><path d="M6 42 V28 H16 V18 H26 V8 H42 V20 H32 V30 H22 V42Z" fill="#b8402e" stroke="#1a1410" stroke-width="2.4" stroke-linejoin="round"/><path d="M32 8 V14 H38" fill="none" stroke="#1a1410" stroke-width="2.4"/><path d="M12 42 V36 H6" fill="none" stroke="#1a1410" stroke-width="2.4"/>${[[38, 34], [42, 40], [34, 40], [8, 10], [14, 6], [6, 16]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fffaf0" stroke="#1a1410" stroke-width="1"/>`).join('')}</svg>`;
  root.setProperty('--poli', `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(poli)}")`);
  // Paper grain.
  const c = document.createElement('canvas'); c.width = c.height = 160; const g = c.getContext('2d'), img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) { const v = 90 + Math.random() * 70; img.data[i] = v; img.data[i + 1] = v * .8; img.data[i + 2] = v * .6; img.data[i + 3] = Math.random() * 26; }
  g.putImageData(img, 0, 0); root.setProperty('--grain', `url(${c.toDataURL()})`);

  const T = { lienzo: window.TlaxScenes.lienzo(), milpa: window.TLAX_ASSETS?.milpa || '../propuestas-v2/assets/juego-milpa.jpg', plaza: window.TLAX_ASSETS?.plaza || '../propuestas-v2/assets/juego-plaza.png' };
  const board = (html, cap) => `<figure class="board"><div class="fit">${html}</div><figcaption>${cap}</figcaption></figure>`;
  const all = [PLAYER, ...CAST];
  const home = ['Tepetícpac', 'Ocotelulco', 'Tizatlán', 'Quiahuiztlán'];
  const row = (k, n, d, fn) => `<div class="srow"><h3><span>ESTILO ${k}</span>${n}</h3><p>${d}</p><div class="line">${all.map((p, i) => `<figure><div class="cf">${fn(p)}</div><figcaption>${p.name}${p.romance ? ' ♥' : ''}<small>${p.role}${i ? ' · ' + home[(i - 1) % 4] : ''}</small></figcaption></figure>`).join('')}</div></div>`;

  document.getElementById('app').innerHTML = `
    <section class="sec"><h2>Inicio</h2><p>El paisaje del Lienzo de Tlaxcala con el logo y el menú como páginas de códice. La fecha usa el calendario mexica: día 3-Calli, año 1-Ácatl (1519).</p>
      <div class="fit fit--hero">${M.inicio(T)}</div></section>
    <section class="sec"><h2>Menús en el juego</h2><p>Cada panel es una página de códice en tira plegada: estuco sobre piel de venado, con dobleces, contorno de tinta y filete rojo que separa las escenas. Los marcos van en azulejo. Los números de la barra se escriben con puntos y barras, la amistad se mide en flores (xóchitl) y los precios en granos de cacao.</p>
      <div class="boards">${board(M.bolsa(T), '<b>Bolsa</b> · el chitatli (morral) con coa, hacha y navajas de obsidiana')}${board(M.tianguis(T), '<b>Tianguis de Ocotelulco</b> · trueque con cacao; la sal no llega por el cerco mexica')}${board(M.vecinos(T), '<b>Vecinos</b> · los 15 en estilo Códice Borgia')}${board(M.pausa(T), '<b>Pausa</b> · volumen contado con puntos y barras')}</div></section>
    <section class="sec"><h2>Muñecos · 2 estilos nuevos</h2>
      <div class="styles">${row('A', 'Códice Borgia', 'El Códice Borgia se pintó en la región Puebla-Tlaxcala antes de la conquista. Sus figuras tienen cabeza grande de perfil, ojo grande, orejera de jade, pie de perfil con sandalia y tinta gruesa, y llevan la vírgula de la palabra (la voluta delante de la boca). Es el estilo que uso en los menús.', F.borgia)}
        ${row('B', 'Muñecas de barro de Xochitécatl', 'Inspiradas en las figurillas articuladas de barro halladas en Xochitécatl, Tlaxcala: muñecas con brazos y piernas sueltos y amarrados, ojos incisos, pastillaje (bolitas de barro pegadas) y pintura mineral gastada. Se verían muy bien animadas, con las extremidades balanceándose al caminar.', F.barro)}</div></section>`;

  const fits = [...document.querySelectorAll('.fit')];
  const fit = () => fits.forEach(f => f.firstElementChild.style.setProperty('--k', f.clientWidth / 960));
  new ResizeObserver(fit).observe(document.body); fit();

  document.querySelectorAll('.toggle button').forEach(b => b.addEventListener('click', () => {
    document.body.classList.toggle('poli', b.dataset.mode === 'poli');
    document.querySelectorAll('.toggle button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-sel]'); if (!el) return;
    const k = el.dataset.sel, cls = { cb: 'cb--on', pr: 'pr--on', vc: 'vc--on', sl: 'sl--on' }[k];
    const scope = k === 'sl' ? el.closest('.bag') : el.parentElement;
    scope.querySelectorAll(`[data-sel="${k}"]`).forEach(x => x.classList.toggle(cls, x === el));
  });
})();
