// Tlaxcallan v2 · "Talavera de Tlaxcala": realistic glazed-tile UI over the game.
// Screens (960×540 artboards): Inicio, Bolsa, Tianguis, Vecinos, Pausa.
"use strict";
(function () {
  const { chibi, CAST, PLAYER } = window.TlaxChars;

  // ---------- Item icons (match the in-game flat items) ----------
  const O = 'stroke="#3a2418" stroke-width="2"';
  const IC = {
    coa: `<path d="M12 52 L48 10" stroke="#6a4428" stroke-width="6" stroke-linecap="round"/><path d="M6 48 C 4 56 8 60 16 58 L20 52 L12 44Z" fill="#9aa4b0" ${O}/>`,
    cantaro: `<path d="M48 24 C 58 24 58 40 50 42" stroke="#3a2418" stroke-width="4" fill="none"/><path d="M32 16 C 18 18 10 30 12 42 C 14 54 24 60 32 60 C 40 60 50 54 52 42 C 54 30 46 18 32 16Z" fill="#d07a3a" ${O}/><path d="M25 7 H39 L37 18 H27Z" fill="#b8622e" ${O}/><path d="M14 36 Q 23 30 32 36 T 50 36" stroke="#f6e2b8" stroke-width="3" fill="none"/>`,
    hoz: `<path d="M18 56 L30 36" stroke="#6a4428" stroke-width="6" stroke-linecap="round"/><path d="M30 36 C 30 14 50 6 58 16 C 48 12 38 20 36 36Z" fill="#9aa4b0" ${O}/>`,
    maiz: `<path d="M14 58 C 12 40 20 28 30 22 C 28 36 26 46 26 58Z" fill="#5fa040" ${O}/><ellipse cx="34" cy="30" rx="11" ry="20" transform="rotate(22 34 30)" fill="#f2c94c" ${O}/><path d="M22 60 C 30 46 40 40 52 36 C 44 46 38 54 34 62Z" fill="#7cb04a" ${O}/>`,
    maizAzul: `<path d="M14 58 C 12 40 20 28 30 22 C 28 36 26 46 26 58Z" fill="#5fa040" ${O}/><ellipse cx="34" cy="30" rx="11" ry="20" transform="rotate(22 34 30)" fill="#3d63b8" ${O}/><path d="M22 60 C 30 46 40 40 52 36 C 44 46 38 54 34 62Z" fill="#7cb04a" ${O}/>`,
    frijol: [[22, 26], [42, 30], [30, 44]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="7" fill="#8f2a24" ${O}/><ellipse cx="${x - 3}" cy="${y - 2}" rx="3.4" ry="1.6" fill="#e88a7a"/>`).join(''),
    calabaza: `<path d="M32 20 C 32 12 36 8 40 8" stroke="#5a3a22" stroke-width="4" fill="none"/><ellipse cx="32" cy="38" rx="24" ry="18" fill="#e07a28" ${O}/><ellipse cx="32" cy="38" rx="9" ry="18" fill="#f29a3e" stroke="#a8521e" stroke-width="2"/>`,
    chile: `<path d="M42 14 C 52 18 52 32 44 42 C 36 54 22 59 10 58 C 20 52 28 44 32 34 C 35 26 36 18 42 14Z" fill="#d0342a" ${O}/><path d="M38 16 C 40 10 48 10 50 14 C 46 18 42 18 38 16Z" fill="#4f8a36"/>`,
    cacao: `<path d="M32 6 C 50 14 50 50 32 58 C 14 50 14 14 32 6Z" fill="#a8521e" ${O}/><path d="M32 8 V56 M24 12 C 20 28 20 40 24 52 M40 12 C 44 28 44 40 40 52" stroke="#7a3418" stroke-width="2" fill="none"/>`,
    tortilla: `${[44, 38, 32].map(y => `<ellipse cx="32" cy="${y}" rx="22" ry="8" fill="#ecd3a0" stroke="#a8824a" stroke-width="2"/>`).join('')}<circle cx="26" cy="31" r="2" fill="#c8955a"/><circle cx="38" cy="33" r="2" fill="#c8955a"/>`,
    pulque: `<path d="M10 28 C 10 48 20 58 32 58 C 44 58 54 48 54 28Z" fill="#a8522e" ${O}/><ellipse cx="32" cy="28" rx="22" ry="7" fill="#f7f2e6" ${O}/>`,
    semilla: `<path d="M14 22 C 14 14 50 14 50 22 L46 56 H18Z" fill="#d8b47a" ${O}/><circle cx="32" cy="40" r="7" fill="#7cb04a" ${O}/>`,
    nopal: `<ellipse cx="30" cy="40" rx="14" ry="18" fill="#5f9a54" ${O}/><ellipse cx="45" cy="20" rx="9" ry="12" transform="rotate(25 45 20)" fill="#6fae60" ${O}/><ellipse cx="51" cy="9" rx="4" ry="5" fill="#c2307a"/>`,
    cempa: `${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="32" cy="18" rx="7" ry="12" transform="rotate(${a} 32 32)" fill="#f29a1e" ${O}/>`).join('')}<circle cx="32" cy="32" r="10" fill="#f6b81e" ${O}/>`,
  };
  const icon = (k, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 64 64">${IC[k]}</svg>`;

  // Glyph of Tlaxcallan ("place of tortillas"): two hands patting a tortilla over a hill.
  const glyph = `<svg class="glyph" viewBox="0 0 120 110"><path d="M14 104 C 14 60 34 30 60 30 C 86 30 106 60 106 104 Z" fill="#4f8f4a" stroke="#1a1410" stroke-width="4"/><path d="M14 92 H106 V104 H14Z" fill="#d39a26" stroke="#1a1410" stroke-width="4"/>${[30, 50, 70, 90].map(x => `<rect x="${x - 6}" y="95" width="12" height="7" fill="#b8402e"/>`).join('')}<circle cx="44" cy="62" r="5" fill="#9ccf7a" stroke="#1a1410" stroke-width="2"/><circle cx="76" cy="70" r="5" fill="#9ccf7a" stroke="#1a1410" stroke-width="2"/>
    <ellipse cx="60" cy="30" rx="26" ry="7" fill="#f3e2b8" stroke="#1a1410" stroke-width="3"/><circle cx="52" cy="29" r="2" fill="#c8955a"/><circle cx="66" cy="31" r="2" fill="#c8955a"/>
    <path d="M30 10 C 34 6 50 8 56 22 L48 24 C 44 18 38 16 32 18 Z" fill="#c48a5a" stroke="#1a1410" stroke-width="3"/><path d="M90 50 C 86 54 70 52 64 38 L72 36 C 76 42 82 44 88 42 Z" fill="#c48a5a" stroke="#1a1410" stroke-width="3"/></svg>`;

  const panel = (cls, inner) => `<div class="pnl ${cls}">${inner}</div>`;
  const sarape = '<div class="sarape"></div>';
  const hearts = n => `<span class="hearts">${Array.from({ length: 10 }, (_, i) => `<svg viewBox="0 0 20 18"><path d="M10 17 C 4 12 1 9 1 5.5 C 1 3 3 1 5.5 1 C 7.5 1 9 2.2 10 4 C 11 2.2 12.5 1 14.5 1 C 17 1 19 3 19 5.5 C 19 9 16 12 10 17Z" class="${i < n ? 'on' : ''}"/></svg>`).join('')}</span>`;
  const keys = (...ks) => `<div class="keys">${ks.map(([k, t]) => `<span><kbd>${k}</kbd>${t}</span>`).join('')}</div>`;
  const bg = src => `<div class="gbg" style="background-image:url('${src}')"></div><div class="dim"></div>`;
  const niche = (inner, cls = '') => `<div class="niche ${cls}">${inner}</div>`;

  // ---------- 1 · Inicio ----------
  function inicio(T) {
    return `<div class="ab inicio"><img class="land" src="${T.land}" alt="">
      ${panel('logo', `${glyph}<div><div class="logo__n">Tlaxcallan</div><div class="logo__t">Tierra del maíz · a los pies de Matlalcueye</div></div>`)}
      ${panel('tmenu', `<div class="tm tm--on" data-sel="tm"><span>Continuar</span><small>Día 3 · Tlacaxipehualiztli · ${icon('cacao', 'mini')} 900 300</small></div>
        <div class="tm" data-sel="tm"><span>Nueva partida</span><small>Hereda la milpa de tu abuela</small></div>
        <div class="tm" data-sel="tm"><span>Opciones</span><small>Volumen, idioma y mensajes</small></div>
        ${keys(['▲▼', 'elegir'], ['Enter', 'aceptar'])}`)}
      <div class="foot">Señorío de Tlaxcallan · Tepetícpac · Ocotelulco · Tizatlán · Quiahuiztlán · antes de la llegada de los españoles</div></div>`;
  }

  // ---------- Tabs shared by in-game menus ----------
  const TABS = ['Bolsa', 'Oficios', 'Vecinos', 'Mapa', 'Códice'];
  const tabs = on => `<div class="tabs">${TABS.map(t => `<div class="tab${t === on ? ' tab--on' : ''}" data-sel="tab">${t}</div>`).join('')}</div>`;

  // ---------- 2 · Bolsa ----------
  const BAR = [['coa', '225'], ['cantaro', '8/10'], ['hoz', ''], ['coa', ''], ['hoz', ''], ['semilla', '400k'], ['frijol', '400k'], ['chile', '400k'], ['maiz', '400k'], ['maizAzul', '400k']];
  const BAG = [['calabaza', 12], ['nopal', 5], ['tortilla', 6], ['pulque', 2], ['cacao', 30], ['maiz', 48], ['cempa', 9], ['frijol', 19]];
  const slot = (s, i, bar, on) => `<div class="sl${s ? '' : ' sl--e'}${on ? ' sl--on' : ''}" data-sel="sl">${s ? icon(s[0]) : ''}${bar ? `<span class="sl__k">${(i + 1) % 10}</span>` : ''}${s && s[1] !== '' ? `<span class="sl__n">${s[1]}</span>` : ''}</div>`;
  function bolsa(T) {
    return `<div class="ab">${bg(T.milpa)}${tabs('Bolsa')}
      ${panel('bag', `<div class="bag__l">${niche(chibi(PLAYER), 'niche--tall')}<div class="who"><b>Tú</b><span>Vecina común · 0</span></div>
          <div class="ms"><label>Energía</label><div class="m"><i style="width:92%;background:linear-gradient(#5fb0f0,#2f7ac0)"></i></div><em>92</em>
          <label>Vida</label><div class="m"><i style="width:85%;background:linear-gradient(#f07060,#c0392b)"></i></div><em>85</em>
          <label>Ánimo</label><div class="m"><i style="width:70%;background:linear-gradient(#7cd070,#3f9a3a)"></i></div><em>70</em></div></div>
        <div class="bag__r">
          <div class="item"><div class="item__ic">${icon('coa')}</div><div class="item__t"><b>Coa</b><small>Herramienta de labranza</small><p>Abre la tierra frente a ti. Pulsa Espacio con la coa en la mano.</p></div>
            <div class="item__s"><div class="kv"><span>Usos</span><b>225 / 225</b></div><div class="m m--s"><i style="width:100%;background:linear-gradient(#7cd070,#3f9a3a)"></i></div><div class="row2"><div class="btn btn--main">Usar</div><div class="btn">Soltar</div></div></div></div>
          <div class="sh"><b>Barra</b><span>teclas 1–0 · Q ⇄ bolsa</span></div>
          <div class="sls">${BAR.map((s, i) => slot(s, i, true, i === 0)).join('')}</div>
          <div class="sh"><b>Bolsa 1 de 5</b><span>◂ ▸ cambiar · +151 objetos</span></div>
          <div class="sls">${Array.from({ length: 20 }, (_, i) => slot(BAG[i], i, false, false)).join('')}</div>
        </div>`)}
      ${keys(['Q', 'cerrar'], ['1–0', 'barra'], ['◂ ▸', 'bolsa'])}</div>`;
  }

  // ---------- 3 · Tianguis de Ocotelulco ----------
  function tianguis(T) {
    const seller = CAST[12];
    const rows = [['maizAzul', 'Maíz azul de Tlaxcala', 'Semilla · brota en 6 días', 12, 3], ['frijol', 'Frijol ayocote', 'Semilla · trepa por la caña', 6, 0], ['calabaza', 'Calabaza tamalayota', 'Semilla · cubre la milpa', 10, 0], ['chile', 'Chile de árbol', 'Semilla · para el mole', 8, 0], ['cempa', 'Cempasúchil', 'Semilla · para la ofrenda', 5, 0]]
      .map(([k, n, d, p, q], i) => `<div class="pr${i ? '' : ' pr--on'}" data-sel="pr"><div class="pr__ic">${icon(k)}</div><div class="pr__t"><b>${n}</b><small>${d}</small></div><span class="pr__p">${icon('cacao', 'mini')} ${p}</span><div class="qty"><u>−</u><b>${q}</b><u>+</u></div></div>`).join('');
    return `<div class="ab">${bg(T.plaza)}
      <div class="seller">${niche(chibi(seller), 'niche--tall')}
        ${panel('talk', `<div class="talk__n">${seller.name}<small>${seller.role}</small></div><p>¡Llegó maíz azul de Huamantla! En todo Ocotelulco no lo encuentras más barato.</p><div class="talk__f">${hearts(6)}<span>▼</span></div>`)}</div>
      ${panel('shop', `<div class="shop__h"><b>Tianguis de Ocotelulco</b><span class="purse">${icon('cacao', 'mini')} 900 300</span></div>${sarape}
        <div class="chips"><span class="chip chip--on" data-sel="chip">Semillas</span><span class="chip" data-sel="chip">Comida</span><span class="chip" data-sel="chip">Ofrendas</span><span class="chip" data-sel="chip">Herramientas</span></div>
        <div class="prs">${rows}</div>
        <div class="shop__f"><span>Total <b>${icon('cacao', 'mini')} 36</b></span><div class="row2"><div class="btn">Vender</div><div class="btn btn--main">Comprar</div></div></div>`)}
      ${keys(['▲▼', 'producto'], ['◂ ▸', 'cantidad'], ['Enter', 'comprar'], ['Esc', 'salir'])}</div>`;
  }

  // ---------- 4 · Vecinos ----------
  const HOME = ['Tepetícpac', 'Ocotelulco', 'Tizatlán', 'Quiahuiztlán'];
  const FRIEND = [6, 4, 3, 5, 9, 7, 2, 4, 3, 1, 2, 5, 6, 3, 4];
  function vecinos(T) {
    const sel = 4, p = CAST[sel];
    const cards = CAST.map((c, i) => `<div class="vc${i === sel ? ' vc--on' : ''}" data-sel="vc"><div class="vc__a">${chibi(c)}</div><b>${c.name}${c.romance ? ' <i class="love">♥</i>' : ''}</b></div>`).join('');
    return `<div class="ab">${bg(T.plaza)}${tabs('Vecinos')}
      ${panel('vec', `<div class="vec__g">${cards}</div>
        <div class="vec__s">${niche(chibi(p), 'niche--big')}
          <div class="vec__n">${p.name}</div><div class="vec__r">${p.role}</div>${hearts(FRIEND[sel])}
          <p class="vec__l">«${p.line}»</p>
          <div class="facts"><span>Vive en</span><b>${HOME[sel % 4]}</b><span>Le encanta</span><b>${icon('pulque', 'mini')} Pulque</b><span>Cumpleaños</span><b>Día 14 · Tozoztontli</b></div>
          <div class="btn btn--main">Hacer un regalo</div></div>`)}
      ${keys(['Q', 'cerrar'], ['◂ ▸', 'pestaña'], ['Enter', 'ver'])}</div>`;
  }

  // ---------- 5 · Pausa ----------
  function pausa(T) {
    const sl = (l, v) => `<div class="set set--n"><span>${l}</span><div class="sld"><i style="width:${v * 10}%"></i><b style="left:${v * 10}%"></b></div><em>${v}</em></div>`;
    const tg = (l, a, b) => `<div class="set"><span>${l}</span><div class="chips"><span class="chip chip--on" data-sel="chip">${a}</span><span class="chip" data-sel="chip">${b}</span></div></div>`;
    return `<div class="ab">${bg(T.milpa)}<div class="dim dim--deep"></div>
      ${panel('ph', `<div class="ph__t">Pausa</div><div class="ph__d">Día 3 · veintena Tlacaxipehualiztli · año 1-Tochtli · 10:00 am</div>`)}
      ${panel('plist', ['Reanudar', 'Guardar partida', 'Opciones', 'Controles', 'Salir al menú'].map((t, i) => `<div class="tm${i === 2 ? ' tm--on' : ''}${i === 4 ? ' tm--x' : ''}" data-sel="tm"><span>${t}</span></div>`).join(''))}
      ${panel('popts', `${sl('Música', 7)}${sl('Efectos', 5)}${sarape}${tg('Pantalla', 'Completa', 'Ventana')}${tg('Tutorial', 'Mostrar', 'Ocultar')}${tg('Clima', 'Lluvia y rayos', 'Suave')}
        <div class="set"><span>Idioma</span><div class="cyc"><u>◂</u><b>Español</b><u>▸</u></div></div>`)}
      ${keys(['Esc', 'volver'], ['Enter', 'aceptar'], ['◂ ▸', 'cambiar'])}</div>`;
  }

  window.TlaxScreens = { inicio, bolsa, tianguis, vecinos, pausa };
})();
