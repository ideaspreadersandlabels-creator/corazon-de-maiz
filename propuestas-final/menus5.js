// Remaining Tlaxcallan screens in the chosen style (codex pages, Talavera frame,
// Códice Borgia figures): in-game HUD, dialogue, Oficios, Amoxtli (journal) and Mapa.
"use strict";
(function () {
  const { CAST, PLAYER } = window.TlaxChars, F = window.TlaxFigs4, { icon, bean, dots, flower, flowers, calli, keys, bg, page, frame, stat } = window.TlaxMenus4.kit;
  const K = '#1a1410', O = `stroke="${K}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
  const TABS = ['Bolsa', 'Oficios', 'Vecinos', 'Amoxtli', 'Mapa'];
  const tabs = on => `<div class="tabs">${TABS.map(t => `<div class="cb tab${t === on ? ' cb--on' : ''}" data-sel="cb">${t}</div>`).join('')}</div>`;
  const sun = `<svg class="sun" viewBox="0 0 40 40"><g transform="translate(20 20)">${Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 45})" d="M-4 -12 L0 -19 L4 -12Z" fill="#e9b33e" ${O.replace('2.6', '1.6')}/>`).join('')}<circle r="10" fill="#e9b33e" ${O.replace('2.6', '1.8')}/><circle r="5" fill="#c0392b"/></g></svg>`;

  // ---------- HUD en partida ----------
  const BAR = [['coa', 225], ['cantaro', 8], ['hacha', ''], ['obsidiana', 12], ['costal', 24], ['maizAzul', 19], ['frijol', 14], ['chile', 8], ['maiz', 12], ['calabaza', 3]];
  function hud(T) {
    const vbar = (v, c, k, l) => `<div class="vb" title="${l}">${stat(k)}<div class="vb__t"><i style="height:${v}%;background:${c}"></i></div></div>`;
    return `<div class="ab">
      <div class="gbg gbg--sharp" style="background-image:url('${T.milpa}')"></div>
      ${page('clock', `${sun}<div><b>3-Calli</b><small>Tlacaxipehualiztli · 1-Ácatl</small><em>10:00 · ${bean} 900 300</em></div>`)}
      ${page('tut', `<b>Amoxtli 1 de 8</b><span>Abre la tierra: elige la coa (tecla <kbd>1</kbd>) y pulsa <kbd>Espacio</kbd> frente a la hierba.</span>`)}
      ${page('vbs', `${vbar(92, 'linear-gradient(#5fb0f0,#2f7ac0)', 'tonalli', 'Energía')}${vbar(85, 'linear-gradient(#f07060,#c0392b)', 'vida', 'Vida')}${vbar(70, 'linear-gradient(#7cd070,#3f9a3a)', 'animo', 'Ánimo')}`)}
      ${page('hot', `<div class="hot__n">Coa · 225 usos</div><div class="sls sls--hot">${BAR.map((s, i) => `<div class="sl${i === 0 ? ' sl--on' : ''}" data-sel="sl">${icon(s[0])}<span class="sl__k">${dots(i + 1, 'nd nd--k')}</span>${s[1] !== '' ? `<span class="sl__n">${s[1]}</span>` : ''}</div>`).join('')}</div>`)}
    </div>`;
  }

  // ---------- Diálogo ----------
  function dialogo(T) {
    const p = CAST[4];
    return `<div class="ab">${bg(T.plaza).replace('dim"', 'dim dim--soft"')}
      <div class="dlg-fig">${frame(F.borgia(p, { tight: true, speaking: true }), 'cf--dlg')}</div>
      ${page('dlg', `<div class="dlg__h"><b>${p.name}</b><small>${p.role} · Tepetícpac</small>${flowers(9)}</div>
        <p>Dicen que los extranjeros ya pelearon con los otomíes en la frontera. Mi padre fue a Tizatlán a escuchar al consejo. ¿Te quedarás conmigo a ver la puesta del sol junto al río?</p>
        <div class="dlg__o"><div class="cb cb--on" data-sel="cb">▸ Me quedo contigo</div><div class="cb" data-sel="cb">Primero iré al consejo</div><div class="cb" data-sel="cb">Regalarle una flor de cempasúchil</div></div>`)}
      ${keys(['▲▼', 'elegir'], ['Enter', 'responder'], ['Esc', 'adiós'])}</div>`;
  }

  // ---------- Oficios ----------
  const SKILLS = [
    ['maiz', 'Milpa', 'Siembra, riega y cosecha maíz, frijol y calabaza.', 3, 65, 'Las semillas brotan un día antes.'],
    ['cempa', 'Recolección', 'Flores, quelites, tunas y hierbas del monte.', 2, 30, 'A veces encuentras doble.'],
    ['cantaro', 'Alfarería', 'Cántaros, comales y ofrendas de barro.', 1, 55, 'Desbloquea: comal de barro.'],
    ['chimalli', 'Guerra', 'Macuahuitl, escudo y arco. Defiende la frontera.', 2, 10, 'Más vida en combate.'],
    ['copal', 'Ofrendas', 'Templos a Camaxtli y a Matlalcueye.', 1, 17, 'Templos restaurados: 1 de 6.'],
  ];
  function oficios(T) {
    const rows = SKILLS.map(([k, n, d, lv, pr, perk], i) => `<div class="sk${i === 0 ? ' pr--on' : ''}" data-sel="pr"><div class="pr__ic">${icon(k)}</div>
      <div class="sk__t"><b>${n}</b><small>${d}</small><div class="m m--s"><i style="width:${pr}%;background:#3f9a3a"></i></div></div>
      <div class="sk__lv"><small>Nivel</small>${dots(lv, 'nd nd--lv')}</div><div class="sk__p">${perk}</div></div>`).join('');
    return `<div class="ab">${bg(T.milpa)}${tabs('Oficios')}
      ${page('ofi', `<div class="ofi__h"><b>Tus oficios</b><span>Los niveles se cuentan con puntos y barras: ● = 1, ▬ = 5</span></div><div class="sks">${rows}</div>`)}
      ${keys(['Q', 'cerrar'], ['▲▼', 'oficio'], ['◂ ▸', 'pestaña'])}</div>`;
  }

  // ---------- Amoxtli (diario de encargos) ----------
  function amoxtli(T) {
    const Q = [
      ['octli', 'Ofrenda para Camaxtli', 'Lleva 3 jarras de octli al templo de Ocotelulco antes de la fiesta.', '2 / 3', true],
      ['sal', 'Sal para Tizatlán', 'El cerco mexica no deja pasar sal. Busca a los cargadores de la costa.', '0 / 1', false],
      ['obsidiana', 'Navajas para la frontera', 'Nalin necesita 12 navajas de obsidiana para las macuahuitl.', '12 / 12', false],
      ['cempa', 'Flores para Kaya', 'Siembra cempasúchil en la orilla del río Zahuapan.', '0 / 5', false],
    ];
    const list = Q.map(([k, n, d, pr, on], i) => `<div class="qe${on ? ' pr--on' : ''}" data-sel="pr">${icon(k)}<div><b>${n}</b><small>${pr}</small></div></div>`).join('');
    const [k, n, d, pr] = Q[0];
    return `<div class="ab">${bg(T.milpa)}${tabs('Amoxtli')}
      ${page('amo', `<div class="amo__l"><div class="amo__h">Encargos</div>${list}<div class="amo__done">Encargos cumplidos: 3</div></div>
        <div class="amo__r"><div class="amo__glyph">${icon(k)}</div><h4>${n}</h4><p>${d}</p>
          <div class="amo__step"><span>2 de 3 jarras de octli</span><div class="m"><i style="width:66%;background:#3f9a3a"></i></div></div>
          <ul class="amo__todo"><li class="ok">Raspa el aguamiel de tus magueyes</li><li class="ok">Déjalo fermentar en el cántaro</li><li>Lleva las 3 jarras al templo de Ocotelulco</li></ul>
          <div class="amo__rw"><span>Recompensa</span><b>${bean} 120</b><b>${flower(true)} con el sacerdote</b></div>
          <div class="amo__f"><span>${calli} Plazo: día 8-Calli</span><div class="cb cb--on">Seguir encargo</div></div></div>`)}
      ${keys(['Q', 'cerrar'], ['▲▼', 'encargo'], ['Enter', 'seguir'])}</div>`;
  }

  // ---------- Mapa ----------
  function mapa(T) {
    const place = (x, y, n, glyph, cls = '') => `<g class="pl ${cls}" transform="translate(${x} ${y})">${glyph}<text y="34" text-anchor="middle">${n}</text></g>`;
    const hill = (c = '#7aa45a') => `<path d="M-16 14 C -16 -4 -8 -16 0 -16 C 8 -16 16 -4 16 14Z" fill="${c}" ${O}/><rect x="-18" y="12" width="36" height="6" fill="#e9b33e" ${O}/>`;
    const temple = `<path d="M-16 16 L-12 4 H12 L16 16Z M-10 4 L-7 -6 H7 L10 4Z" fill="#f6efe0" ${O}/><rect x="-6" y="-16" width="12" height="10" fill="#c0392b" ${O}/>`;
    const steps = (pts) => pts.map(([x, y, a]) => `<path transform="translate(${x} ${y}) rotate(${a})" d="M0 0 c -3 -7 4 -10 6 -4 c 1 4 -1 8 -6 4Z" fill="${K}"/>`).join('');
    const path = (a, b, n) => { const out = []; for (let i = 1; i < n; i++) { const t = i / n; out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI + 90]); } return steps(out); };
    const map = `<svg class="map" viewBox="0 0 640 380">
      <path d="M0 260 C 120 250 200 300 330 280 C 430 266 520 300 640 290" stroke="#4f86b8" stroke-width="10" fill="none"/><path d="M200 0 C 220 80 260 150 330 280" stroke="#4f86b8" stroke-width="8" fill="none"/>
      <text x="392" y="306" class="gl">Atoyac</text><text x="232" y="70" class="gl">Zahuapan</text>
      <path d="M30 80 L80 20 L130 80Z" fill="#c8d4ee" ${O}/><path d="M64 38 L80 20 L96 38 L88 44 L80 36 L72 44Z" fill="#fff" ${O}/><path d="M20 140 C 50 110 120 110 150 140Z" fill="#c8d4ee" ${O}/>
      <text x="80" y="160" text-anchor="middle" class="gl">Popocatépetl e Iztaccíhuatl</text>
      ${path([300, 150], [380, 110], 6)}${path([300, 150], [190, 250], 9)}${path([300, 150], [392, 196], 6)}${path([380, 110], [560, 70], 9)}${path([190, 250], [80, 330], 7)}
      <path d="M380 210 C 380 170 410 140 450 140 C 490 140 520 170 520 210Z" fill="#7aa45a" ${O}/><path d="M384 196 C 420 186 480 186 516 196 L520 210 H380Z" fill="#4f86b8" ${O}/><text x="450" y="232" text-anchor="middle" class="pln">Matlalcueye</text>
      ${place(300, 150, 'Tlaxcallan', `<g>${[[-14, -10], [14, -10], [-14, 12], [14, 12]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#f6efe0" ${O}/>`).join('')}<circle r="6" fill="#c0392b" ${O}/></g>`, 'pl--home')}
      ${place(380, 110, 'Tu milpa', `<g>${[[-8, 0], [0, -4], [8, 0]].map(([x, y]) => `<path d="M${x} ${y + 12} V${y - 10}" ${O}/><ellipse cx="${x + 3}" cy="${y - 2}" rx="3" ry="6" fill="#f2c94c" ${O}/>`).join('')}</g>`, 'pl--you')}
      ${place(560, 70, 'Tecoac', hill('#c8b48a'), 'pl--war')}
      ${place(190, 250, 'Cacaxtla', temple)}
      ${place(80, 330, 'Cholollan', temple)}
      ${place(590, 190, 'Huamantla', hill())}
      <g transform="translate(26 194)"><path d="M0 0 h56 v30 h-56Z" fill="#f6efe0" ${O}/><path d="M6 24 C 16 6 40 6 50 24" stroke="#4f86b8" stroke-width="4" fill="none"/><text x="28" y="48" text-anchor="middle" class="pln">Tenochtitlan ←</text></g>
      <g transform="translate(560 40)"><circle r="8" fill="#c0392b" ${O}/><text x="14" y="5" class="gl gl--war">extranjeros</text></g>
      <g class="you" transform="translate(398 92)"><circle r="11" fill="#2f5fa8" opacity=".25"/><circle r="6.4" fill="#2f5fa8" stroke="#fff" stroke-width="2.6"/></g>
      <g transform="translate(604 340)"><path d="M0 -20 L5 -5 L20 0 L5 5 L0 20 L-5 5 L-20 0 L-5 -5Z" fill="#f6efe0" ${O}/><path d="M0 -20 L5 -5 L0 0Z M20 0 L5 5 L0 0Z M0 20 L-5 5 L0 0Z M-20 0 L-5 -5 L0 0Z" fill="#1b3a8a"/><text y="-25" text-anchor="middle" class="pln">N</text></g>
    </svg>`;
    return `<div class="ab">${bg(T.milpa)}${tabs('Mapa')}
      ${page('mapa', `${map}<div class="mapa__s"><b>Tlaxcallan</b><p>Los cuatro señoríos gobiernan juntos desde el consejo. Al poniente, tras los volcanes, está Tenochtitlan. Por el oriente, en Tecoac, ya se vio a los extranjeros.</p>
        <ul class="seno"><li>Tepetícpac</li><li>Ocotelulco</li><li>Tizatlán</li><li>Quiahuiztlán</li></ul>
        <div class="leg"><span>${steps([[8, 8, 90]]).replace('<path', '<svg viewBox="0 0 16 16" class="mini"><path') + '</svg>'} Camino</span><span><i class="dot dot--you"></i> Tú</span><span><i class="dot dot--war"></i> Frontera</span></div>
        <div class="cb cb--on">Viajar a Ocotelulco</div></div>`)}
      ${keys(['Q', 'cerrar'], ['▲▼◂▸', 'mover'], ['Enter', 'viajar'])}</div>`;
  }

  window.TlaxMenus5 = { hud, dialogo, oficios, amoxtli, mapa };
})();
