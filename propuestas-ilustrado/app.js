// Builds the proposal page: 3 directions × (Inicio, Bolsa, Tienda, Pausa).
// Screens are static mockups; hover states are live, slots/rows/options are clickable.
"use strict";
(function () {
  const A = window.TlaxArt, root = document.documentElement.style;
  root.setProperty('--grain', A.grainTexture());
  root.setProperty('--tileB', A.tile('#f6f1e6', '#1f3f8f', '#e0a526'));
  root.setProperty('--fret', A.fret);

  const DIRS = [
    { id: 'A', k: 'DIRECCIÓN A', name: 'Acuarela del amanecer', desc: 'La Malinche al amanecer pintada en acuarela. Paneles de papel con bordes rasgados y manchas de color, tipografía suave y redondeada. Cálido, sereno, de cuento.', sw: ['#c8553d', '#e3a83b', '#7a9a6a', '#6b4b78', '#f7efe0'], type: 'Fraunces + Alegreya Sans', scene: A.sceneA() },
    { id: 'B', k: 'DIRECCIÓN B', name: 'Talavera al anochecer', desc: 'La plaza de Tlaxcala en la hora azul, con kiosco, papel picado y faroles. Los menús son azulejos de Talavera pintados a mano en azul cobalto con toques de oro.', sw: ['#1f3f8f', '#e0a526', '#f6f1e6', '#c8553d', '#0d1a40'], type: 'Alegreya cursiva + Alegreya Sans', scene: A.sceneB() },
    { id: 'C', k: 'DIRECCIÓN C', name: 'Mural de Cacaxtla', desc: 'Fresco rojo ocre como los murales de Cacaxtla. La Malinche aparece como glifo de cerro con su falda azul (Matlalcueye). Contornos negros gruesos, azul maya y greca escalonada; las teclas se numeran con puntos y barras.', sw: ['#a63a2b', '#2e7896', '#e9b33e', '#4f8f4a', '#1a1410'], type: 'Yeseva One + Alegreya Sans', scene: A.sceneC(), bg: A.sceneC(false) },
  ];
  const bgTile = { A: '#f3e2c8', B: '#dfe6f6', C: '#e9b33e' };
  const portrait = (fn, id) => fn(`<rect width="200" height="240" fill="${bgTile[id]}"/>` + (id === 'A' ? '<circle cx="150" cy="60" r="70" fill="#f6c88a" opacity=".6"/><circle cx="40" cy="200" r="60" fill="#b9cf8a" opacity=".5"/>' : id === 'B' ? '<path d="M0 0h200v240H0z" fill="none"/><circle cx="100" cy="100" r="90" fill="#c5d2f0"/>' : '<circle cx="100" cy="96" r="84" fill="#d98a3a"/>'));

  const ITEMS = {
    maiz: 'Maíz', maizAzul: 'Maíz azul', frijol: 'Frijol', calabaza: 'Calabaza', chile: 'Chile', nopal: 'Nopal',
    tuna: 'Tuna', maguey: 'Maguey', pulque: 'Pulque', tortilla: 'Tortillas', coa: 'Coa', cantaro: 'Cántaro',
  };
  const BAR = [['coa', ''], ['cantaro', ''], ['maiz', 12], ['frijol', 19], ['calabaza', 3], ['chile', 8], ['tuna', 7], ['nopal', 5], ['pulque', 2], ['tortilla', 6]];
  const BAG = [['maizAzul', 4], ['maguey', 1], ['frijol', 6], ['tortilla', 3], ['coa', '']];
  const SHOP = [['maizAzul', 'Semilla de maíz azul', 'Brota en 6 días', 12, 3], ['frijol', 'Semilla de frijol', 'Junto al maíz', 6, 0], ['calabaza', 'Semilla de calabaza', 'Cubre la milpa', 10, 0], ['chile', 'Semilla de chile', 'Para la salsa', 8, 0], ['nopal', 'Penca de nopal', 'Crece en cualquier tierra', 5, 0]];

  const ic = (k, cls = 'ic') => `<img class="${cls}" src="${A.icon(k)}" alt="${ITEMS[k]}">`;
  // Mesoamerican numerals: bars are 5, dots are units; 0 key = 10 (two bars).
  const dotBar = n => { const bars = Math.floor(n / 5), dots = n % 5; return `<span class="db">${'<u></u>'.repeat(bars)}${dots ? `<span>${'<i></i>'.repeat(dots)}</span>` : ''}</span>`; };
  const slot = (d, s, i, bar) => `<div class="slot${s ? '' : ' slot--empty'}${bar && i === 1 ? ' slot--sel' : ''}" data-sel="slot">${s ? ic(s[0]) : ''}${bar ? (d === 'C' ? dotBar(i + 1) : `<span class="k">${(i + 1) % 10}</span>`) : ''}${s && s[1] !== '' ? `<span class="n">${s[1]}</span>` : ''}</div>`;
  const meter = (w, c) => `<div class="meter"><i style="width:${w}%;background:${c}"></i></div>`;
  const band = d => d === 'C' ? ' panel--band' : '';

  function title(d) {
    const opts = ['Nueva partida', 'Continuar', 'Opciones'].map((t, i) => `<div class="opt${i ? '' : ' opt--on'}" data-sel="opt">${t}</div>`).join('');
    const frame = d.id === 'B' ? '<div class="strip strip--t"></div><div class="strip strip--b"></div><div class="strip strip--l"></div><div class="strip strip--r"></div><div class="rim"></div>' : '';
    const menu = d.id === 'B' ? `<div class="tmenu">${opts}</div><div class="tmenu__hint">◂ ▸ + Enter</div>` : `<div class="tmenu panel${band(d.id)}">${opts}<div class="tmenu__hint">${d.id === 'C' ? '▲▼ + Enter' : '▲▼ + Enter'}</div></div>`;
    return `<div class="ab title ${d.id}"><div class="bg" style="--scene:url('${d.scene}')"></div>${frame}
      <div class="logo"><div class="logo__name">Tlaxcallan</div><div class="logo__tag">Tierra del maíz</div></div>${menu}</div>`;
  }

  function bag(d) {
    const tabs = ['Bolsa', 'Habilidades', 'Vecinos', 'Mapa', 'Diario'].map((t, i) => `<div class="tab${i ? '' : ' tab--on'}" data-sel="tab">${t}</div>`).join('');
    const bagSlots = Array.from({ length: 20 }, (_, i) => slot(d.id, BAG[i], i, false)).join('');
    return `<div class="ab menu ${d.id}"><div class="bg" style="--scene:url('${d.bg || d.scene}')"></div><div class="veil"></div>
      <div class="tabs">${tabs}</div>
      <div class="panel bag${band(d.id)}">
        <div class="who">
          <img class="portrait" src="${portrait(A.portraitTu, d.id)}" alt="Tu personaje">
          <div class="who__line"><span class="who__name">Tú</span><span class="who__rep">Respetado +43</span></div>
          <div class="stat-h">Estado</div>
          <div class="mrow"><span>Vida</span>${meter(85, '#d94a3a')}<span>85</span></div>
          <div class="mrow"><span>Energía</span>${meter(92, '#5aa84a')}<span>92</span></div>
          <div class="stat-h">Oficios</div>
          <div class="mrow"><span>Milpa</span>${meter(65, '#7cb04a')}<span>Nv. 3</span></div>
          <div class="mrow"><span>Recolección</span>${meter(30, '#e3a83b')}<span>Nv. 2</span></div>
          <div class="mrow"><span>Templos</span>${meter(17, '#2f5fa8')}<span>1/6</span></div>
        </div>
        <div class="bag-right">
          <div class="card"><div class="card__ic">${ic('cantaro')}</div>
            <div><div class="card__name">Cántaro</div><div class="card__kind">Herramienta</div><div class="card__desc">Riega 3 surcos por llenada. Rellénalo en el río o en el apantle.</div></div>
            <div class="card__side"><div class="card__info"><span>Agua</span><b>8 / 10</b></div><div class="card__btns"><div class="btn btn--main">Usar</div><div class="btn">Soltar</div></div></div>
          </div>
          <div class="slots-h"><b>Barra</b><span>teclas 1–0 · Q ⇄ bolsa</span></div>
          <div class="slots">${BAR.map((s, i) => slot(d.id, s, i, true)).join('')}</div>
          <div class="slots-h"><b>Bolsa 1/3</b><span>◂ ▸ cambiar bolsa</span></div>
          <div class="slots">${bagSlots}</div>
        </div>
      </div></div>`;
  }

  const heart = on => `<svg viewBox="0 0 20 18"><path d="M10 17 C 4 12 1 9 1 5.5 C 1 3 3 1 5.5 1 C 7.5 1 9 2.2 10 4 C 11 2.2 12.5 1 14.5 1 C 17 1 19 3 19 5.5 C 19 9 16 12 10 17 Z" fill="${on ? '#d94a3a' : 'rgba(120,80,50,.18)'}" stroke="${on ? '#8f2a24' : 'rgba(120,80,50,.4)'}" stroke-width="1.4"/></svg>`;
  function shop(d) {
    const rows = SHOP.map(([k, n, desc, p, q], i) => `<div class="row${i ? '' : ' row--sel'}" data-sel="row">${ic(k)}<div><div class="row__name">${n}</div><div class="row__desc">${desc}</div></div><span class="row__price">${p} cacao</span><div class="qty"><u>−</u><span>${q}</span><u>+</u></div></div>`).join('');
    return `<div class="ab menu ${d.id}"><div class="bg" style="--scene:url('${d.bg || d.scene}')"></div><div class="veil"></div>
      <div class="shop-left">
        <img class="portrait" src="${portrait(A.portraitCit, d.id)}" alt="Citlalmina">
        <div class="talk panel${band(d.id)}"><div class="talk__who">Citlalmina</div><div class="talk__line">Ya casi es la fiesta de Nezahual. ¿Llevas algo para la ofrenda?</div><div class="talk__more">▼</div></div>
        <div class="friend panel"><span>Amistad</span><div class="hearts">${Array.from({ length: 8 }, (_, i) => heart(i < 5)).join('')}</div></div>
      </div>
      <div class="panel shop${band(d.id)}">
        <div class="shop-head"><span class="shop-head__t">Puesto del tianguis</span><span class="purse">1888 cacao</span></div>
        <div class="chips"><span class="chip chip--on" data-sel="chip">Semillas</span><span class="chip" data-sel="chip">Comida</span><span class="chip" data-sel="chip">Ofrendas</span></div>
        <div class="rows">${rows}</div>
        <div class="shop-foot"><span class="shop-foot__t">Total: <b>36 cacao</b></span><div class="card__btns"><div class="btn">Vender</div><div class="btn btn--main">Comprar</div></div></div>
      </div></div>`;
  }

  function pause(d) {
    const list = ['Reanudar', 'Guardar partida', 'Opciones', 'Controles', 'Salir al menú'].map((t, i) => `<div class="opt${i === 2 ? ' opt--on' : ''}${i === 4 ? ' opt--danger' : ''}" data-sel="opt">${t}</div>`).join('');
    const slider = (l, v) => `<div class="set set--num"><span>${l}</span><div class="slider"><i style="width:${v * 10}%"></i><b style="left:${v * 10}%"></b></div><span>${v}</span></div>`;
    return `<div class="ab menu ${d.id}"><div class="bg" style="--scene:url('${d.bg || d.scene}')"></div><div class="veil"></div>
      <div class="phead"><div class="phead__t">Pausa</div><div class="phead__d">Verano 2 · Año 1 · 12:30 pm · Tormenta</div></div>
      <div class="panel plist${band(d.id)}">${list}</div>
      <div class="panel popts${band(d.id)}">
        ${slider('Música', 7)}${slider('Efectos', 5)}
        <div class="set set--rule"><span>Pantalla</span><div class="chips"><span class="chip chip--on" data-sel="chip">Completa</span><span class="chip" data-sel="chip">Ventana</span></div></div>
        <div class="set"><span>Idioma</span><div class="cycle"><u>◂</u><span>Español</span><u>▸</u></div></div>
        <div class="set"><span>Clima</span><div class="chips"><span class="chip chip--on" data-sel="chip">Lluvia y rayos</span><span class="chip" data-sel="chip">Suave</span></div></div>
      </div>
      <div class="hints"><span><b>Esc</b> Volver</span><span><b>Enter</b> Aceptar</span><span><b>◂ ▸</b> Cambiar</span></div></div>`;
  }

  const SCREENS = [['Inicio', title], ['Bolsa', bag], ['Tienda', shop], ['Pausa y opciones', pause]];
  document.getElementById('dirs').innerHTML = DIRS.map(d => `
    <section class="dir" id="dir-${d.id}">
      <div class="dir__head"><div><div class="dir__k">${d.k}</div><h2 class="dir__name">${d.name}</h2><p class="dir__desc">${d.desc}</p></div>
        <div class="dir__spec"><div class="sw">${d.sw.map(c => `<i style="background:${c}"></i>`).join('')}</div><span>${d.type}</span></div></div>
      <div class="boards">${SCREENS.map(([n, fn], i) => `<figure class="board"><div class="fit">${fn(d)}</div><figcaption><b>${d.id}${i + 1}</b> · ${n}</figcaption></figure>`).join('')}</div>
    </section>`).join('');

  // Scale every 960×540 artboard to its column.
  const fits = [...document.querySelectorAll('.fit')];
  const fit = () => fits.forEach(f => f.style.setProperty('--k', f.clientWidth / 960));
  new ResizeObserver(fit).observe(document.body); fit();

  // Click to move the selection inside a group (purely to feel the states).
  document.addEventListener('click', e => {
    const el = e.target.closest('[data-sel]'); if (!el) return;
    const kind = el.dataset.sel, cls = { opt: 'opt--on', tab: 'tab--on', chip: 'chip--on', row: 'row--sel', slot: 'slot--sel' }[kind];
    const scope = kind === 'slot' ? el.closest('.bag') : el.parentElement;
    scope.querySelectorAll(`[data-sel="${kind}"]`).forEach(x => x.classList.toggle(cls, x === el));
  });
})();
