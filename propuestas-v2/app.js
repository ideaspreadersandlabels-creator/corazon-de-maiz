// Assembles the Talavera proposal page: generates the tile textures and landscape,
// then lays out the five screens, the materials and the cast.
"use strict";
(function () {
  const X = window.TlaxTex, S = window.TlaxScreens, { chibi, CAST, PLAYER } = window.TlaxChars;
  const root = document.documentElement.style;
  const deco = X.decoTile(), plain = X.plainTiles(), cobalt = X.cobaltTile();
  root.setProperty('--deco', `url(${deco})`); root.setProperty('--plain', `url(${plain})`); root.setProperty('--cobalt', `url(${cobalt})`);
  // Asset paths are relative to this page; the bundled build swaps them for data URLs.
  const T = { land: X.landscape(), milpa: window.TLAX_ASSETS?.milpa || 'assets/juego-milpa.jpg', plaza: window.TLAX_ASSETS?.plaza || 'assets/juego-plaza.png' };

  const board = (html, cap, cls = '') => `<figure class="board ${cls}"><div class="fit">${html}</div><figcaption>${cap}</figcaption></figure>`;
  const home = ['Tepetícpac', 'Ocotelulco', 'Tizatlán', 'Quiahuiztlán'];
  document.getElementById('app').innerHTML = `
    <section class="sec"><h2>Pantalla de inicio</h2><p>La Malinche (Matlalcueye) al amanecer, con barrancas, nieve en la cumbre, bosque, milpa a contraluz y magueyes. A la derecha, la Basílica de Ocotlán en su cerro, y en el cielo las garzas blancas del estandarte tlaxcalteca. El logo lleva el glifo de Tlaxcallan: dos manos que tortean sobre un cerro.</p>
      <div class="fit fit--hero">${S.inicio(T)}</div></section>
    <section class="sec"><h2>Menús en el juego</h2><p>Cada panel es un marco de azulejos decorados con interior de azulejo blanco esmaltado. Lo seleccionado se vuelve azulejo cobalto con filo dorado, y las casillas del inventario son azulejos sueltos. Los personajes aparecen en nichos de Talavera.</p>
      <div class="boards">${board(S.bolsa(T), '<b>Bolsa</b> · barra 1–0 y 5 bolsas, como en tu juego')}${board(S.tianguis(T), '<b>Tianguis de Ocotelulco</b> · precios en cacao, semillas de la región')}${board(S.vecinos(T), '<b>Vecinos</b> · los 15 personajes, amistad y regalos')}${board(S.pausa(T), '<b>Pausa</b> · fecha en veintenas mexicas y año 1-Tochtli')}</div></section>
    <section class="sec"><h2>Materiales</h2><p>Los azulejos se generan en el navegador con pinceladas imperfectas, esmalte con motas, brillo diagonal, craquelado fino y junta de mortero. Puedes exportarlos como PNG para usarlos en el juego.</p>
      <div class="mats"><div class="mat"><div style="background:url(${deco}) 0 0/100px"></div>Azulejo decorado (marcos)</div><div class="mat"><div style="background:url(${plain}) 0 0/100px"></div>Azulejo blanco (fondos)</div><div class="mat"><div style="background:url(${cobalt}) 0 0/200px"></div>Azulejo cobalto (seleccionado)</div><div class="mat"><div style="background:linear-gradient(90deg,#b8402e 0 12%,#e07a28 12% 20%,#f2c94c 20% 30%,#1a1410 30% 31%,#3d7a46 31% 46%,#f6efe0 46% 49%,#1b3a8a 49% 66%,#1a1410 66% 67%,#7a3a8a 67% 80%,#e05a7a 80% 90%,#b8402e 90%)"></div>Sarape de Chiautempan (separadores)</div></div></section>
    <section class="sec"><h2>Personajes</h2><p>Los 15 de tu reparto, más tu personaje, con ropa tlaxcalteca de antes de la conquista: huipil, quechquémitl, cueitl con greca, cactli (sandalias), ichcahuipilli de algodón para la guerrera y collares de jade. Cada una conserva el tono de piel, el cabello, la complexión y el arma u objeto de tus referencias.</p>
      <div class="cast">${[PLAYER, ...CAST].map((p, i) => `<figure><div class="niche">${chibi(p)}</div><figcaption>${p.name}${p.romance ? ' ♥' : ''}<small>${p.role}${i ? ' · ' + home[(i - 1) % 4] : ''}</small></figcaption></figure>`).join('')}</div></section>`;

  const fits = [...document.querySelectorAll('.fit')];
  const fit = () => fits.forEach(f => f.firstElementChild.style.setProperty('--k', f.clientWidth / 960));
  new ResizeObserver(fit).observe(document.body); fit();

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-sel]'); if (!el) return;
    const k = el.dataset.sel, cls = { tm: 'tm--on', tab: 'tab--on', chip: 'chip--on', pr: 'pr--on', vc: 'vc--on', sl: 'sl--on' }[k];
    const scope = k === 'sl' ? el.closest('.bag') : el.parentElement;
    scope.querySelectorAll(`[data-sel="${k}"]`).forEach(x => x.classList.toggle(cls, x === el));
  });
})();
