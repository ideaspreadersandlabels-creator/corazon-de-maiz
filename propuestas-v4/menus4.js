// Codex-style menus framed in tile (Talavera or pre-Hispanic Mixteca-Puebla polychrome).
// Panels are screenfold codex pages (gesso on deerskin, fold lines, red scene rules);
// counts use dots and bars, friendship uses xochitl flowers, prices the cacao bean.
"use strict";
(function () {
  const { CAST, PLAYER } = window.TlaxChars, F = window.TlaxFigs4;
  const K = '#1a1410', O = `stroke="${K}" stroke-width="2.8" stroke-linejoin="round"`;

  const IC = {
    coa: `<path d="M12 52 L48 10" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M12 52 L48 10" stroke="#9a6438" stroke-width="5" stroke-linecap="round"/><path d="M6 48 C 4 56 8 60 16 58 L20 52 L12 44Z" fill="#3a3a4a" ${O}/>`,
    cantaro: `<path d="M48 24 C 58 24 58 40 50 42" stroke="${K}" stroke-width="5" fill="none"/><path d="M32 16 C 18 18 10 30 12 42 C 14 54 24 60 32 60 C 40 60 50 54 52 42 C 54 30 46 18 32 16Z" fill="#d07a3a" ${O}/><path d="M25 7 H39 L37 18 H27Z" fill="#b8622e" ${O}/><path d="M14 38 h4 v-4 h6 v4 h4 v-4 h6 v4 h4 v-4 h6 v4 h4" fill="none" stroke="#f6e2b8" stroke-width="2.4"/>`,
    hacha: `<path d="M20 58 L40 12" stroke="${K}" stroke-width="9" stroke-linecap="round"/><path d="M20 58 L40 12" stroke="#9a6438" stroke-width="5" stroke-linecap="round"/><path d="M30 18 C 44 10 56 16 56 28 C 48 28 40 26 34 30Z" fill="#3a6a5a" ${O}/>`,
    maiz: `<path d="M14 58 C 12 40 20 28 30 22 C 28 36 26 46 26 58Z" fill="#5fa040" ${O}/><ellipse cx="34" cy="30" rx="11" ry="20" transform="rotate(22 34 30)" fill="#f2c94c" ${O}/><path d="M22 60 C 30 46 40 40 52 36 C 44 46 38 54 34 62Z" fill="#7cb04a" ${O}/>`,
    maizAzul: `<path d="M14 58 C 12 40 20 28 30 22 C 28 36 26 46 26 58Z" fill="#5fa040" ${O}/><ellipse cx="34" cy="30" rx="11" ry="20" transform="rotate(22 34 30)" fill="#3d63b8" ${O}/><path d="M22 60 C 30 46 40 40 52 36 C 44 46 38 54 34 62Z" fill="#7cb04a" ${O}/>`,
    frijol: [[22, 26], [42, 30], [30, 44]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="10" ry="7" fill="#8f2a24" ${O}/>`).join(''),
    calabaza: `<path d="M32 20 C 32 12 36 8 40 8" stroke="${K}" stroke-width="4" fill="none"/><ellipse cx="32" cy="38" rx="24" ry="18" fill="#e07a28" ${O}/><ellipse cx="32" cy="38" rx="9" ry="18" fill="#f29a3e" ${O}/>`,
    chile: `<path d="M42 14 C 52 18 52 32 44 42 C 36 54 22 59 10 58 C 20 52 28 44 32 34 C 35 26 36 18 42 14Z" fill="#d0342a" ${O}/><path d="M38 16 C 40 10 48 10 50 14 C 46 18 42 18 38 16Z" fill="#4f8a36" ${O}/>`,
    cacao: `<path d="M32 6 C 50 14 50 50 32 58 C 14 50 14 14 32 6Z" fill="#a8521e" ${O}/><path d="M32 10 V54" stroke="${K}" stroke-width="2"/>`,
    tlaxcalli: `${[44, 38, 32].map(y => `<ellipse cx="32" cy="${y}" rx="22" ry="8" fill="#ecd3a0" ${O}/>`).join('')}<circle cx="26" cy="31" r="2" fill="#a8743a"/><circle cx="38" cy="33" r="2" fill="#a8743a"/>`,
    octli: `<path d="M10 28 C 10 48 20 58 32 58 C 44 58 54 48 54 28Z" fill="#a8522e" ${O}/><ellipse cx="32" cy="28" rx="22" ry="7" fill="#f7f2e6" ${O}/>`,
    nopal: `<ellipse cx="30" cy="40" rx="14" ry="18" fill="#5f9a54" ${O}/><ellipse cx="45" cy="20" rx="9" ry="12" transform="rotate(25 45 20)" fill="#6fae60" ${O}/><ellipse cx="51" cy="9" rx="4" ry="5" fill="#c2307a" ${O}/>`,
    cempa: `${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<ellipse cx="32" cy="18" rx="7" ry="12" transform="rotate(${a} 32 32)" fill="#f29a1e" ${O}/>`).join('')}<circle cx="32" cy="32" r="10" fill="#f6b81e" ${O}/>`,
    obsidiana: `<path d="M32 4 L46 30 L32 60 L18 30Z" fill="#2a2a3a" ${O}/><path d="M32 8 L40 30 L32 52" stroke="#6a6a8a" stroke-width="2" fill="none"/>`,
  };
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
      ${page('tmenu', `<div class="cb cb--on" data-sel="cb"><span>Continuar</span><small>Día 3-Calli · ${bean} 900 300</small></div><div class="cb" data-sel="cb"><span>Nueva partida</span><small>Hereda la milpa de tu abuela</small></div><div class="cb" data-sel="cb"><span>Opciones</span><small>Volumen, idioma y mensajes</small></div>`)}
      <div class="foot">Señorío de Tlaxcallan · Tepetícpac · Ocotelulco · Tizatlán · Quiahuiztlán · en guerra con Tenochtitlan</div></div>`;
  }

  const TABS = ['Bolsa', 'Oficios', 'Vecinos', 'Amoxtli', 'Mapa'];
  const tabs = on => `<div class="tabs">${TABS.map(t => `<div class="cb tab${t === on ? ' cb--on' : ''}" data-sel="cb">${t}</div>`).join('')}</div>`;

  // ---------- Bolsa ----------
  const BAR = [['coa', 225], ['cantaro', 8], ['hacha', ''], ['obsidiana', 12], ['coa', ''], ['maizAzul', 19], ['frijol', 14], ['chile', 8], ['maiz', 12], ['calabaza', 3]];
  const BAG = [['calabaza', 12], ['nopal', 5], ['tlaxcalli', 6], ['octli', 2], ['cacao', 18], ['maiz', 19], ['cempa', 9], ['frijol', 7]];
  const slot = (s, i, bar, on) => `<div class="sl${s ? '' : ' sl--e'}${on ? ' sl--on' : ''}" data-sel="sl">${s ? icon(s[0]) : ''}${bar ? `<span class="sl__k">${dots(i + 1 > 9 ? 10 : i + 1, 'nd nd--k')}</span>` : ''}${s && s[1] !== '' ? `<span class="sl__n">${s[1]}</span>` : ''}</div>`;
  const meter = (l, v, c) => `<label>${l}</label><div class="m"><i style="width:${v}%;background:${c}"></i></div><em>${v}</em>`;
  function bolsa(T) {
    return `<div class="ab">${bg(T.milpa)}${tabs('Bolsa')}
      ${page('bag', `<div class="bag__l">${frame(F.borgia(PLAYER), 'cf--tall')}<div class="who"><b>Tú</b><span>Macehualli ${flowers(3).replace('xos', 'xos xos--s')}</span></div>
          <div class="ms">${meter('Energía', 92, '#2f7ac0')}${meter('Vida', 85, '#c0392b')}${meter('Ánimo', 70, '#3f9a3a')}</div></div>
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
    const rows = [['maizAzul', 'Maíz azul', 'Semilla · brota en 6 días', 12, 3], ['frijol', 'Frijol ayocote', 'Semilla · trepa por la caña', 6, 0], ['calabaza', 'Calabaza', 'Semilla · cubre la milpa', 10, 0], ['chile', 'Chilli', 'Semilla · para el molli', 8, 0], ['obsidiana', 'Navaja de obsidiana', 'Filo para la macuahuitl', 20, 0]]
      .map(([k, n, d, p, q], i) => `<div class="pr${i ? '' : ' pr--on'}" data-sel="pr"><div class="pr__ic">${icon(k)}</div><div class="pr__t"><b>${n}</b><small>${d}</small></div><span class="pr__p">${bean} ${p}</span><div class="qty"><u>−</u><b>${q}</b><u>+</u></div></div>`).join('');
    return `<div class="ab">${bg(T.plaza)}
      <div class="seller">${frame(F.borgia(seller), 'cf--seller')}
        ${page('talk', `<div class="talk__n">${seller.name}<small>${seller.role}</small></div><p>Llegaron cargadores de la costa con cacao. La sal ya no pasa: los mexicas cerraron los caminos.</p><div class="talk__f">${flowers(6)}<span>▼</span></div>`)}</div>
      ${page('shop', `<div class="shop__h"><b>Tianguis de Ocotelulco</b><span class="purse">${bean} 900 300</span></div>
        <div class="chips"><span class="cb chip cb--on" data-sel="cb">Semillas</span><span class="cb chip" data-sel="cb">Comida</span><span class="cb chip" data-sel="cb">Ofrendas</span><span class="cb chip" data-sel="cb">Armas</span></div>
        <div class="prs">${rows}</div>
        <div class="shop__f"><span>Total <b>${bean} 36</b></span><div class="row2"><div class="cb">Vender</div><div class="cb cb--on">Trocar</div></div></div>`)}
      ${keys(['▲▼', 'producto'], ['◂ ▸', 'cantidad'], ['Enter', 'trocar'], ['Esc', 'salir'])}</div>`;
  }

  // ---------- Vecinos ----------
  const HOME = ['Tepetícpac', 'Ocotelulco', 'Tizatlán', 'Quiahuiztlán'];
  function vecinos(T) {
    const sel = 4, p = CAST[sel];
    const cards = CAST.map((c, i) => `<div class="vc${i === sel ? ' vc--on' : ''}" data-sel="vc"><div class="vc__a">${F.borgia(c)}</div><b>${c.name}${c.romance ? ' <i class="love">♥</i>' : ''}</b></div>`).join('');
    return `<div class="ab">${bg(T.plaza)}${tabs('Vecinos')}
      ${page('vec', `<div class="vec__g">${cards}</div>
        <div class="vec__s">${frame(F.borgia(p), 'cf--big')}
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

  window.TlaxMenus4 = { inicio, bolsa, tianguis, vecinos, pausa, kit: { icon, bean, dots, flower, flowers, calli, keys, bg, page, frame, IC } };
})();
