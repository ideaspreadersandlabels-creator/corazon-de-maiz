// Tlaxcallan menus: title screen (1a), Bolsa (4a), Tienda (4b) and Pausa (4c).
// Screens are re-rendered from state on every change; canvases are painted after
// each render from Tlax.pixel. The host game listens to `tlax:*` window events.
"use strict";
(function () {
  const { ITEMS, SHOP, SHOP_LINES, newGame, pixel } = window.Tlax;
  const SAVE_KEY = 'tlaxcallan.partida', OPTS_KEY = 'tlaxcallan.opciones';

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } },
  };

  const S = {
    screen: 'title', pauseFrom: 'game',
    titleSel: 0,
    game: newGame(),
    sel: { area: 'bar', i: 1 }, hand: 1, bagPage: 0, bagTab: 'Bolsa', bagMsg: '',
    shop: { mode: 'buy', tab: 'Semillas', row: 0, qty: {}, line: 0, say: null },
    pause: { sel: 2, panel: 'opciones', focus: 'list', setRow: 0 },
    opts: Object.assign({ musica: 7, efectos: 5, idioma: 'Español', clima: 'Lluvia y rayos' }, store.get(OPTS_KEY)),
  };

  const emit = (name, detail) => window.dispatchEvent(new CustomEvent('tlax:' + name, { detail }));
  const icon = (key, cls = '') => `<canvas data-icon="${key}" width="16" height="16"${cls ? ` class="${cls}"` : ''}></canvas>`;
  const frame = (bg, shade, inner) => `<div class="frame"><img class="backdrop" src="assets/${bg}" alt="">${shade ? `<div class="shade${shade === 'deep' ? ' shade--deep' : ''}"></div>` : ''}<div class="greca greca--top"></div><div class="greca greca--bottom"></div>${inner}</div>`;

  // ---------- Inventory helpers ----------
  const slotAt = (area, i) => area === 'bar' ? S.game.bar[i] : S.game.bags[S.bagPage][i];
  const setSlot = (area, i, v) => { if (area === 'bar') S.game.bar[i] = v; else S.game.bags[S.bagPage][i] = v; };
  const allSlots = () => [S.game.bar, ...S.game.bags];
  function owned(key) { return allSlots().flat().reduce((n, s) => n + (s && s.key === key ? s.n || 0 : 0), 0); }
  // Adds n of key to an existing stack, else to the first empty bag slot, else the bar. Returns false if full.
  function addItem(key, n) {
    for (const list of allSlots()) { const s = list.find(s => s && s.key === key); if (s) { s.n += n; return true; } }
    for (const list of [...S.game.bags, S.game.bar]) { const i = list.indexOf(null); if (i >= 0) { list[i] = { key, n }; return true; } }
    return false;
  }
  function removeItem(key, n) {
    for (const list of allSlots()) for (let i = 0; i < list.length && n > 0; i++) {
      const s = list[i]; if (!s || s.key !== key) continue;
      const take = Math.min(n, s.n); s.n -= take; n -= take; if (!s.n) list[i] = null;
    }
  }

  // ---------- 1a · Title ----------
  const TITLE_OPTS = ['Nueva partida', 'Continuar', 'Opciones'];
  function viewTitle() {
    return `<div class="frame frame--title">
      <canvas class="title-scene" data-scene="sceneA" width="320" height="180"></canvas>
      <div class="logo"><div class="logo__name">TLAXCALLAN</div><div class="logo__tag ss">TIERRA DEL MAÍZ</div></div>
      <div class="title-menu panel">
        ${TITLE_OPTS.map((t, i) => `<div class="opt${i === S.titleSel ? ' opt--on' : ''}" data-act="title" data-i="${i}">${i === S.titleSel ? '▸ ' : ''}${t}</div>`).join('')}
        <div class="title-menu__hint">▲▼ + Enter</div>
      </div>
    </div>`;
  }
  function titleGo(i) {
    S.titleSel = i;
    if (i === 0) { S.game = newGame(); S.sel = { area: 'bar', i: 1 }; S.hand = 1; open('game'); emit('start', { nueva: true }); }
    else if (i === 1) { const g = store.get(SAVE_KEY); if (g) S.game = Object.assign(newGame(), g); open('game'); emit('start', { nueva: !g }); }
    else { S.pauseFrom = 'title'; S.pause = { sel: 1, panel: 'opciones', focus: 'settings', setRow: 0 }; open('pause'); }
  }

  // ---------- Game view (stand-in for the running game) ----------
  function viewGame() {
    return `<div class="frame"><img class="backdrop" src="assets/juego-milpa.jpeg" alt="">
      <div class="hints hints--game"><span>[Q] Bolsa</span><span>[T] Tienda</span><span>[Esc] Pausa</span><span>[1–0] Barra</span></div></div>`;
  }

  // ---------- 4a · Bolsa ----------
  const BAG_TABS = ['Bolsa', 'Habilidades', 'Vecinos', 'Mapa', 'Diario'];
  function slotHTML(s, area, i) {
    const on = S.sel.area === area && S.sel.i === i;
    return `<div class="slot${s ? '' : ' slot--empty'}${on ? ' slot--sel' : ''}" data-act="slot" data-area="${area}" data-i="${i}">
      ${s ? icon(s.key) : ''}${area === 'bar' ? `<span class="slot__num">${(i + 1) % 10}</span>` : ''}<span class="slot__count">${s && s.n != null ? s.n : ''}</span></div>`;
  }
  function cardHTML() {
    const s = slotAt(S.sel.area, S.sel.i);
    if (!s) return `<div class="card"><div class="card__name">Casilla vacía</div><div class="card__desc">Compra semillas en el tianguis o cosecha tu milpa para llenarla.</div>${S.bagMsg ? `<div class="card__msg">${S.bagMsg}</div>` : ''}</div>`;
    const it = ITEMS[s.key];
    const info = s.key === 'cantaro' ? ['Agua', `${S.game.agua} / 10`] : it.tool ? ['Estado', 'Buena'] : ['Cantidad', s.n];
    return `<div class="card">
      <div class="card__head"><div class="card__icon">${icon(s.key)}</div>
        <div style="display:flex;flex-direction:column;gap:2px"><span class="card__name">${it.name}</span><span class="card__kind ss">${it.kind}</span></div></div>
      <div class="card__desc">${it.desc}</div>
      <div class="card__info"><span>${info[0]}</span><span style="font-weight:700">${info[1]}</span></div>
      ${S.bagMsg ? `<div class="card__msg">${S.bagMsg}</div>` : ''}
      <div class="card__btns"><div class="btn btn--main" data-act="use">Usar</div><div class="btn${it.tool ? ' btn--off' : ''}" data-act="drop">Soltar</div></div>
    </div>`;
  }
  function viewBag() {
    const g = S.game, tabs = BAG_TABS.map(t => `<div class="tab${t === S.bagTab ? ' tab--on' : ''}" data-act="bagTab" data-v="${t}">${t}</div>`).join('');
    const body = S.bagTab !== 'Bolsa'
      ? `<div class="soon"><div class="soon__k ss">PRÓXIMAMENTE</div><div class="soon__t">${S.bagTab}</div><div class="soon__d">Esta pestaña todavía no tiene contenido.</div></div>`
      : `<div class="bag-top">
          <div class="who"><canvas class="portrait" data-char="jugador" width="36" height="42"></canvas>
            <div class="who__line"><span class="who__name">Tú</span><span class="who__rep">Respetado +${g.respeto}</span></div></div>
          <div class="stats">
            <div class="stats__h">Estado</div>
            <div class="meter-row"><span>Vida</span><div class="meter"><div style="width:${g.vida}%;background:#d94a3a"></div></div><span>${g.vida}</span></div>
            <div class="meter-row"><span>Energía</span><div class="meter"><div style="width:${g.energia}%;background:#4caf50"></div></div><span>${g.energia}</span></div>
            <div class="stats__h stats__h--rule">Oficios</div>
            <div class="meter-row meter-row--skill"><span>Milpa</span><div class="meter meter--thin"><div style="width:65%;background:#7cc04a"></div></div><span>Nv.3</span></div>
            <div class="meter-row meter-row--skill"><span>Recolección</span><div class="meter meter--thin"><div style="width:30%;background:#f2c94c"></div></div><span>Nv.2</span></div>
            <div class="meter-row meter-row--skill"><span>Templos</span><div class="meter meter--thin"><div style="width:17%;background:#2f5fa8"></div></div><span>1/6</span></div>
          </div>
          ${cardHTML()}
        </div>
        <div class="slots-wrap">
          <div class="slots-head"><span style="font-weight:700">Barra · teclas 1–0</span><span class="slots-head__note">Q ⇄ bolsa</span></div>
          <div class="slots">${g.bar.map((s, i) => slotHTML(s, 'bar', i)).join('')}</div>
          <div class="slots-head slots-head--rule"><span style="font-weight:700">Bolsa ${S.bagPage + 1}/3</span><span class="slots-head__note"><span data-act="page" data-d="-1">◂</span> <span data-act="page" data-d="1">▸</span> cambiar bolsa</span></div>
          <div class="slots">${g.bags[S.bagPage].map((s, i) => slotHTML(s, 'bag', i)).join('')}</div>
        </div>`;
    return frame('juego-milpa.jpeg', 'normal', `<div class="menu-body"><div class="tabs">${tabs}</div><div class="panel bag-panel">${body}</div></div>`);
  }
  function selectSlot(area, i) {
    S.sel = { area, i }; S.bagMsg = '';
    if (area === 'bar') { S.hand = i; emit('hand', { slot: i, item: S.game.bar[i] && S.game.bar[i].key }); }
  }
  function useItem() {
    const { area, i } = S.sel, s = slotAt(area, i); if (!s) return;
    const it = ITEMS[s.key], g = S.game;
    if (it.energy) {
      if (g.energia >= 100) { S.bagMsg = 'Ya tienes toda tu energía.'; return; }
      const gain = Math.min(it.energy, 100 - g.energia); g.energia += gain;
      if (!--s.n) setSlot(area, i, null);
      S.bagMsg = `+${gain} de energía.`; emit('use', { item: s.key });
    } else if (area === 'bar') {
      S.bagMsg = 'Lo llevas en la mano.'; emit('hand', { slot: i, item: s.key });
    } else {
      // Swap the bag item into the bar slot currently in hand.
      setSlot('bag', i, g.bar[S.hand]); g.bar[S.hand] = s;
      S.sel = { area: 'bar', i: S.hand }; S.bagMsg = 'Lo pasaste a la barra.'; emit('hand', { slot: S.hand, item: s.key });
    }
  }
  function dropItem() {
    const { area, i } = S.sel, s = slotAt(area, i); if (!s) return;
    if (ITEMS[s.key].tool) { S.bagMsg = 'Tus herramientas no se tiran.'; return; }
    if (!--s.n) setSlot(area, i, null);
    S.bagMsg = `Soltaste 1 ${ITEMS[s.key].name.toLowerCase()}.`; emit('drop', { item: s.key });
  }

  // ---------- 4b · Tienda ----------
  const sellPrice = key => Math.max(1, Math.floor(ITEMS[key].price / 2));
  function shopRows() {
    const sh = S.shop;
    if (sh.mode === 'buy') return SHOP[sh.tab].map(([key, name, note]) => ({ key, name, note, price: ITEMS[key].price, max: 99 }));
    const keys = Object.values(SHOP).flat().map(r => r[0]).filter(k => owned(k) > 0);
    return keys.map(k => ({ key: k, name: ITEMS[k].name, note: `Tienes ${owned(k)}`, price: sellPrice(k), max: owned(k) }))
      .filter(r => SHOP[sh.tab].some(x => x[0] === r.key));
  }
  const cartTotal = rows => rows.reduce((t, r) => t + r.price * (S.shop.qty[r.key] || 0), 0);
  function viewShop() {
    const sh = S.shop, g = S.game, rows = shopRows(), total = cartTotal(rows);
    const line = sh.say || SHOP_LINES[sh.line % SHOP_LINES.length];
    const list = rows.length ? rows.map((r, i) => `<div class="row${i === sh.row ? ' row--sel' : ''}" data-act="row" data-i="${i}">
        <div class="row__icon">${icon(r.key)}</div>
        <div class="row__text"><span class="row__name">${r.name}</span><span class="row__desc">${r.note}</span></div>
        <span class="row__price">${r.price} cacao</span>
        <div class="qty"><span class="qty__b" data-act="qty" data-key="${r.key}" data-d="-1">−</span><span>${sh.qty[r.key] || 0}</span><span class="qty__b" data-act="qty" data-key="${r.key}" data-d="1">+</span></div>
      </div>`).join('') : `<div class="shop-empty">No tienes nada de esto para vender.</div>`;
    const deal = (mode, label) => `<div class="deal${sh.mode === mode ? ' deal--main' : ''}" data-act="deal" data-mode="${mode}">${label}</div>`;
    return frame('juego-plaza.jpeg', 'normal', `<div class="shop-body">
      <div class="shop-left">
        <canvas class="portrait" data-char="citlalmina" width="36" height="42"></canvas>
        <div class="talk panel" data-act="talk"><div class="talk__who ss">CITLALMINA</div><div class="talk__line">${line}</div><div class="talk__more">▼</div></div>
        <div class="friend"><span style="font-weight:700">Amistad</span><div class="hearts">${Array.from({ length: 8 }, (_, i) => `<div${i < g.amistad ? ' class="on"' : ''}></div>`).join('')}</div></div>
      </div>
      <div class="shop-panel panel">
        <div class="shop-head"><span class="shop-head__t">${sh.mode === 'buy' ? 'Puesto del tianguis' : 'Vender en el tianguis'}</span><span class="purse">${g.cacao} cacao</span></div>
        <div class="chips">${Object.keys(SHOP).map(t => `<span class="chip${t === sh.tab ? ' chip--on' : ''}" data-act="shopTab" data-v="${t}">${t}</span>`).join('')}</div>
        ${list}
        <div class="shop-foot"><span class="shop-foot__total">Total: <b>${total} cacao</b></span>
          <div class="shop-foot__btns">${deal('sell', 'Vender')}${deal('buy', 'Comprar')}</div></div>
      </div></div>`);
  }
  function setQty(key, d) {
    const r = shopRows().find(r => r.key === key); if (!r) return;
    S.shop.qty[key] = Math.max(0, Math.min(r.max, (S.shop.qty[key] || 0) + d));
  }
  function deal(mode) {
    const sh = S.shop, g = S.game;
    if (sh.mode !== mode) { sh.mode = mode; sh.qty = {}; sh.row = 0; sh.say = null; return; }
    const rows = shopRows(), total = cartTotal(rows), items = rows.filter(r => sh.qty[r.key]).map(r => ({ key: r.key, n: sh.qty[r.key] }));
    if (!items.length) { sh.say = mode === 'buy' ? '¿Qué te doy? Elige con + y −.' : '¿Qué me vas a vender?'; return; }
    if (mode === 'buy') {
      if (total > g.cacao) { sh.say = 'Te falta cacao para todo eso.'; return; }
      // Check room before charging: each new item kind needs a free slot.
      const free = allSlots().flat().filter(s => !s).length, need = items.filter(x => !owned(x.key)).length;
      if (need > free) { sh.say = 'Ya no te cabe nada en la bolsa.'; return; }
      g.cacao -= total; items.forEach(x => addItem(x.key, x.n));
      sh.say = '¡Gracias! Que crezca bonita tu milpa.';
    } else {
      g.cacao += total; items.forEach(x => removeItem(x.key, x.n));
      sh.say = 'Esto me sirve para la ofrenda. ¡Gracias!';
    }
    sh.qty = {}; emit(mode === 'buy' ? 'buy' : 'sell', { items, total });
  }

  // ---------- 4c · Pausa / Opciones ----------
  const pauseItems = () => S.pauseFrom === 'title'
    ? [['volver', 'Volver'], ['opciones', 'Opciones'], ['controles', 'Controles']]
    : [['volver', 'Reanudar'], ['guardar', 'Guardar partida'], ['opciones', 'Opciones'], ['controles', 'Controles'], ['salir', 'Salir al menú']];
  const SETTINGS = ['musica', 'efectos', 'pantalla', 'idioma', 'clima'];
  const IDIOMAS = ['Español', 'English'], CLIMAS = ['Lluvia y rayos', 'Suave'];
  const isFull = () => !!document.fullscreenElement;
  function viewPause() {
    const p = S.pause, o = S.opts, fromTitle = S.pauseFrom === 'title';
    const focus = k => p.focus === 'settings' && SETTINGS[p.setRow] === k ? ' set--focus' : '';
    const slider = (k, label) => `<div class="set set--num${focus(k)}"><span>${label}</span>
      <div class="slider" data-slider="${k}"><div class="slider__fill" style="width:${o[k] * 10}%"></div><div class="slider__knob" style="left:${o[k] * 10}%"></div></div><span>${o[k]}</span></div>`;
    const chips = (k, vals, cur) => `<div class="chips">${vals.map(v => `<span class="chip${v === cur ? ' chip--on' : ''}" data-act="set" data-k="${k}" data-v="${v}">${v}</span>`).join('')}</div>`;
    let right;
    if (p.panel === 'controles') right = `<div class="settings panel"><div class="keys">
        <span>▲▼ ◂▸</span><span>Moverse y elegir</span><span>Enter</span><span>Aceptar</span><span>Esc</span><span>Pausa / volver</span>
        <span>Q</span><span>Abrir y cerrar la bolsa</span><span>1 – 0</span><span>Elegir objeto de la barra</span><span>T</span><span>Hablar / tienda</span></div></div>`;
    else if (p.panel === 'guardado') right = `<div class="settings panel"><div class="saved"><span class="saved__t">${p.saveOk ? 'Partida guardada' : 'No se pudo guardar'}</span>
        <span class="saved__d">${p.saveOk ? 'Verano 2 · Año 1 · 12:30 pm. Elige «Continuar» en el menú de inicio para volver aquí.' : 'Tu navegador no permite guardar datos en este sitio.'}</span></div></div>`;
    else right = `<div class="settings panel">
        ${slider('musica', 'Música')}${slider('efectos', 'Efectos')}
        <div class="set set--rule${focus('pantalla')}"><span>Pantalla</span>${chips('pantalla', ['Completa', 'Ventana'], isFull() ? 'Completa' : 'Ventana')}</div>
        <div class="set${focus('idioma')}"><span>Idioma</span><div class="cycle"><span class="cycle__arrow" data-act="cycle" data-k="idioma" data-d="-1">◂</span><span class="cycle__v">${o.idioma}</span><span class="cycle__arrow" data-act="cycle" data-k="idioma" data-d="1">▸</span></div></div>
        <div class="set${focus('clima')}"><span>Clima</span>${chips('clima', CLIMAS, o.clima)}</div>
      </div>`;
    const list = pauseItems().map(([id, label], i) => `<div class="opt${i === p.sel ? ' opt--on' : ''}${id === 'salir' ? ' opt--danger' : ''}" data-act="pause" data-i="${i}">${i === p.sel ? '▸ ' : ''}${label}</div>`).join('');
    return frame(fromTitle ? 'juego-milpa.jpeg' : 'juego-tormenta.jpg', 'deep', `
      <div class="pause-head"><div class="pause-head__t">${fromTitle ? 'OPCIONES' : 'PAUSA'}</div><div class="pause-head__d ss">VERANO 2 · AÑO 1 · 12:30 PM · ${o.clima === 'Suave' ? 'LLOVIZNA' : 'TORMENTA'}</div></div>
      <div class="pause-body"><div class="pause-list panel">${list}</div>${right}</div>
      <div class="hints"><span>[Esc] Volver</span><span>[Enter] Aceptar</span><span>[◂ ▸] Cambiar</span></div>`);
  }
  function pauseGo(i) {
    const p = S.pause, id = pauseItems()[i][0]; p.sel = i;
    if (id === 'volver') return open(S.pauseFrom);
    if (id === 'guardar') { p.saveOk = store.set(SAVE_KEY, S.game); p.panel = 'guardado'; emit('save', { ok: p.saveOk }); }
    else if (id === 'opciones') { p.panel = 'opciones'; p.focus = 'settings'; }
    else if (id === 'controles') { p.panel = 'controles'; p.focus = 'list'; }
    else if (id === 'salir') { open('title'); emit('exit'); }
  }
  function setOpt(k, v) {
    if (k === 'pantalla') {
      const want = v === 'Completa';
      if (want !== isFull()) (want ? document.documentElement.requestFullscreen?.() : document.exitFullscreen?.())?.catch?.(() => {});
      return;
    }
    S.opts[k] = v; store.set(OPTS_KEY, S.opts); emit('settings', { ...S.opts });
  }
  function nudgeSetting(d) {
    const k = SETTINGS[S.pause.setRow], o = S.opts;
    if (k === 'musica' || k === 'efectos') setOpt(k, Math.max(0, Math.min(10, o[k] + d)));
    else if (k === 'pantalla') setOpt(k, isFull() ? 'Ventana' : 'Completa');
    else if (k === 'idioma') setOpt(k, IDIOMAS[(IDIOMAS.indexOf(o.idioma) + d + IDIOMAS.length) % IDIOMAS.length]);
    else setOpt(k, CLIMAS[(CLIMAS.indexOf(o.clima) + 1) % CLIMAS.length]);
  }

  // ---------- Rendering ----------
  const stage = document.getElementById('stage');
  const VIEWS = { title: viewTitle, game: viewGame, bag: viewBag, shop: viewShop, pause: viewPause };
  let sceneCache = null;
  function render() {
    stage.innerHTML = VIEWS[S.screen]();
    stage.querySelectorAll('canvas[data-icon]').forEach(el => pixel.drawIcon(el, el.dataset.icon));
    stage.querySelectorAll('canvas[data-char]').forEach(el => pixel.drawChar(el, el.dataset.char));
    stage.querySelectorAll('canvas[data-scene]').forEach(el => {
      if (!sceneCache) { sceneCache = document.createElement('canvas'); sceneCache.width = el.width; sceneCache.height = el.height; pixel.paint(sceneCache, el.dataset.scene); }
      el.getContext('2d').drawImage(sceneCache, 0, 0);
    });
    fit();
  }
  function fit() {
    const f = stage.firstElementChild; if (!f) return;
    const w = f.offsetWidth, h = f.offsetHeight, k = Math.min(innerWidth / w, innerHeight / h);
    stage.style.transform = `translate(${-w / 2}px, ${-h / 2}px) scale(${k})`;
  }
  function open(screen) {
    if (screen === 'pause' && S.screen !== 'pause' && S.pauseFrom !== 'title') S.pause = { sel: 0, panel: 'opciones', focus: 'list', setRow: 0 };
    if (screen === 'shop') S.shop = { ...S.shop, mode: 'buy', qty: {}, row: 0, say: null };
    if (screen === 'bag') S.bagMsg = '';
    if (screen !== 'pause') S.pauseFrom = screen === 'title' ? 'title' : 'game';
    S.screen = screen; render(); emit('screen', { screen });
  }

  // ---------- Input ----------
  stage.addEventListener('click', e => {
    const t = e.target.closest('[data-act]'); if (!t) return;
    const d = t.dataset, i = +d.i;
    switch (d.act) {
      case 'title': return titleGo(i);
      case 'pause': return pauseGo(i);
      case 'bagTab': S.bagTab = d.v; break;
      case 'slot': selectSlot(d.area, i); break;
      case 'page': S.bagPage = (S.bagPage + +d.d + 3) % 3; if (S.sel.area === 'bag') S.bagMsg = ''; break;
      case 'use': useItem(); break;
      case 'drop': dropItem(); break;
      case 'row': if (!e.target.closest('.qty')) S.shop.row = i; break;
      case 'qty': setQty(d.key, +d.d); S.shop.row = shopRows().findIndex(r => r.key === d.key); break;
      case 'shopTab': S.shop.tab = d.v; S.shop.row = 0; break;
      case 'deal': deal(d.mode); break;
      case 'talk': S.shop.say = null; S.shop.line++; break;
      case 'set': setOpt(d.k, d.v); break;
      case 'cycle': S.pause.setRow = SETTINGS.indexOf(d.k); nudgeSetting(+d.d); break;
    }
    render();
  });

  stage.addEventListener('pointerdown', e => {
    const bar = e.target.closest('[data-slider]'); if (!bar) return;
    const k = bar.dataset.slider;
    S.pause.focus = 'settings'; S.pause.setRow = SETTINGS.indexOf(k);
    const move = ev => {
      const r = stage.querySelector(`[data-slider="${k}"]`).getBoundingClientRect();
      const v = Math.round(Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * 10);
      if (v !== S.opts[k]) setOpt(k, v);
      render();
    };
    const up = () => { removeEventListener('pointermove', move); removeEventListener('pointerup', up); };
    addEventListener('pointermove', move); addEventListener('pointerup', up);
    move(e);
  });

  const KEY_NUM = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7, '9': 8, '0': 9 };
  addEventListener('keydown', e => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    const up = k === 'ArrowUp' || k === 'w', down = k === 'ArrowDown' || k === 's', left = k === 'ArrowLeft' || k === 'a', right = k === 'ArrowRight' || k === 'd';
    const enter = k === 'Enter' || k === ' ';
    let handled = true;
    if (S.screen === 'title') {
      if (up || down) S.titleSel = (S.titleSel + (up ? -1 : 1) + TITLE_OPTS.length) % TITLE_OPTS.length;
      else if (enter) return titleGo(S.titleSel), e.preventDefault();
      else handled = false;
    } else if (S.screen === 'game') {
      if (k === 'q' || k === 'i') return open('bag');
      if (k === 't') return open('shop');
      if (k === 'Escape') return open('pause');
      if (k in KEY_NUM) selectSlot('bar', KEY_NUM[k]); else handled = false;
    } else if (S.screen === 'bag') {
      if (k === 'q' || k === 'i' || k === 'Escape') return open('game');
      if (k in KEY_NUM) selectSlot('bar', KEY_NUM[k]);
      else if (left || right) S.bagPage = (S.bagPage + (left ? -1 : 1) + 3) % 3;
      else handled = false;
    } else if (S.screen === 'shop') {
      const n = shopRows().length, sh = S.shop;
      if (k === 'Escape' || k === 't') return open('game');
      if ((up || down) && n) sh.row = (sh.row + (up ? -1 : 1) + n) % n;
      else if ((left || right) && n) setQty(shopRows()[sh.row].key, left ? -1 : 1);
      else if (enter) deal(sh.mode);
      else handled = false;
    } else if (S.screen === 'pause') {
      const p = S.pause, n = pauseItems().length;
      if (p.focus === 'settings' && p.panel === 'opciones') {
        if (k === 'Escape') p.focus = 'list';
        else if (up || down) p.setRow = (p.setRow + (up ? -1 : 1) + SETTINGS.length) % SETTINGS.length;
        else if (left || right) nudgeSetting(left ? -1 : 1);
        else if (enter) nudgeSetting(1);
        else handled = false;
      } else if (k === 'Escape') return open(S.pauseFrom);
      else if (up || down) p.sel = (p.sel + (up ? -1 : 1) + n) % n;
      else if (enter || right) return pauseGo(p.sel), e.preventDefault();
      else handled = false;
    } else handled = false;
    if (handled) { e.preventDefault(); render(); }
  });

  addEventListener('resize', fit);
  document.addEventListener('fullscreenchange', () => S.screen === 'pause' && render());
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit);

  window.Tlax.ui = { state: S, open, render };
  render();
})();
