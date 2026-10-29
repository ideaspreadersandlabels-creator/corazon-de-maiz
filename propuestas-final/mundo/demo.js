// Escena de prueba del arte del mundo: terreno, cultivos, vecinas caminando y el jugador
// arando, regando y cosechando en un ciclo. También arma las hojas de sprites de abajo.
"use strict";
(function () {
  const M = window.CdmMundo, { CAST, PLAYER } = window.TlaxChars;
  const T = 48, COLS = 20, ROWS = 12;                 // cuadro de 32 px mostrado a 1.5×
  const cache = new Map();
  const img = (key, make, w, h) => { if (!cache.has(key)) cache.set(key, M.url(M.svg(make(), w, h))); return cache.get(key); };
  const frameUrl = (p, dir, f, act) => img(`${p.id}|${dir}|${f}|${act || ''}`, () => M.character(p, dir, f, act), 64, 96);

  // ---------------- Mapa
  const map = [];
  for (let y = 0; y < ROWS; y++) { map.push([]); for (let x = 0; x < COLS; x++) map[y].push(((x * 7 + y * 13) % 11 === 0) ? 'pasto-flores' : ((x * 5 + y * 3) % 13 === 0) ? 'pasto-piedras' : (x + y) % 3 ? 'pasto' : 'pasto-2'); }
  for (let x = 0; x < COLS; x++) map[3][x] = x % 4 ? 'camino' : 'camino-2';
  for (let y = 4; y < ROWS; y++) map[y][4] = y % 3 ? 'camino' : 'camino-2';
  for (let y = 0; y < ROWS; y++) map[y][17] = 'agua';
  const FIELD = { x0: 7, x1: 14, y0: 5, y1: 9 };
  for (let y = FIELD.y0; y <= FIELD.y1; y++) for (let x = FIELD.x0; x <= FIELD.x1; x++) map[y][x] = x <= 9 ? 'tierra-mojada' : 'tierra';
  const inField = (x, y) => x >= FIELD.x0 && x <= FIELD.x1 && y >= FIELD.y0 && y <= FIELD.y1;
  const isGrass = (x, y) => y >= 0 && y < ROWS && x >= 0 && x < COLS && map[y][x].startsWith('pasto');

  let ground = '';
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const t = map[y][x];
    let tile = t === 'agua' ? '' : M.TILES[t]();
    if (!t.startsWith('pasto') && t !== 'agua') ['n', 's', 'e', 'w'].forEach(d => { const [dx, dy] = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] }[d]; if (isGrass(x + dx, y + dy) && (inField(x, y) || t.startsWith('camino'))) tile += M.TILES['orilla-' + d](); });
    if (t !== 'agua') ground += `<g transform="translate(${x * 64} ${y * 64})">${tile}</g>`;
  }
  const stage = document.getElementById('mundo');
  stage.style.width = COLS * T + 'px'; stage.style.height = ROWS * T + 'px';
  stage.innerHTML = `<div class="agua" style="left:${17 * T}px;width:${T}px;height:${ROWS * T}px"></div><img class="ground" alt="" src="${M.url(M.svg(ground, COLS * 64, ROWS * 64))}"><div class="actors"></div><div class="fx"></div>`;
  const agua = stage.querySelector('.agua'), actors = stage.querySelector('.actors'), fx = stage.querySelector('.fx');
  const water = [img('agua1', () => M.TILES['agua-1'](), 64, 64), img('agua2', () => M.TILES['agua-2'](), 64, 64)];
  let wf = 0; setInterval(() => { agua.style.backgroundImage = `url("${water[wf ^= 1]}")`; }, 600); agua.style.backgroundImage = `url("${water[0]}")`;

  // ---------------- Cultivos
  const crops = new Map();
  const cropEl = (x, y, tipo, etapa) => {
    const k = `${x},${y}`; let el = crops.get(k);
    if (!el) { el = document.createElement('img'); el.className = 'crop'; el.alt = ''; actors.appendChild(el); crops.set(k, el); }
    el.src = img(`c|${tipo}|${etapa}`, () => M.crop(tipo, etapa), 64, 128);
    Object.assign(el.style, { left: x * T + 'px', top: (y - 1) * T + 'px', width: T + 'px', height: 2 * T + 'px', zIndex: y * 10 + 5 });
    return el;
  };
  const removeCrop = (x, y) => { const k = `${x},${y}`; const el = crops.get(k); if (el) el.remove(); crops.delete(k); };
  const layout = [['maiz', 4], ['maiz', 4], ['milpa', 0], ['maiz', 3], ['frijol', 4], ['frijol', 3], ['calabaza', 4], ['calabaza', 3], ['chile', 4], ['cempa', 3], ['maiz', 2], ['frijol', 2], ['calabaza', 2], ['chile', 3], ['cempa', 2], ['maiz', 1]];
  let li = 0;
  for (let y = FIELD.y0 + 1; y <= FIELD.y1; y++) for (let x = FIELD.x0; x <= FIELD.x1; x++) { if ((x + y) % 2 && li < layout.length * 2) { const [t, e] = layout[li++ % layout.length]; cropEl(x, y, t, e); } }
  removeCrop(8, 5); removeCrop(12, 5);
  cropEl(12, 5, 'maiz', 4);

  // ---------------- Personajes
  class Actor {
    constructor(p, x, y, dir = 'down') {
      this.p = p; this.x = x; this.y = y; this.dir = dir; this.f = 0; this.act = null; this.af = 0;
      this.el = document.createElement('img'); this.el.className = 'actor'; this.el.alt = p.name || '';
      Object.assign(this.el.style, { width: T + 'px', height: T * 1.5 + 'px' }); actors.appendChild(this.el);
    }
    draw() {
      this.el.src = frameUrl(this.p, this.dir, this.act ? this.af : this.f, this.act);
      this.el.style.transform = `translate(${(this.x * T).toFixed(1)}px, ${((this.y - .5) * T).toFixed(1)}px)`;
      this.el.style.zIndex = Math.round(this.y * 10 + 6);
    }
  }
  const dirTo = (dx, dy) => Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
  // A script is a list of steps; each actor runs its own, looping.
  function run(actor, steps) {
    let i = 0, t0 = 0, from = null;
    return (now, dt) => {
      const s = steps[i];
      if (!from) { from = [actor.x, actor.y]; t0 = now; if (s.start) s.start(actor); }
      const el = (now - t0) / 1000;
      if (s.to) {
        const [tx, ty] = s.to, dx = tx - from[0], dy = ty - from[1], dist = Math.hypot(dx, dy), dur = dist / (s.speed || 2.4);
        const k = Math.min(1, el / dur);
        actor.x = from[0] + dx * k; actor.y = from[1] + dy * k; actor.dir = dirTo(dx, dy); actor.act = null;
        actor.f = Math.floor(el * 8) % 4;
        if (k >= 1) next();
      } else if (s.act) {
        actor.dir = s.dir; actor.act = s.act;
        actor.af = s.act === 'cosechar' ? (el < .5 ? 0 : 1) : Math.floor(el / (s.act === 'arar' ? .32 : .28)) % 2;
        if (el >= s.dur) { actor.act = null; next(); }
      } else if (s.wait != null) {
        actor.dir = s.dir || actor.dir; actor.act = null; actor.f = 0;
        if (el >= s.wait) next();
      }
      actor.draw();
      function next() { if (s.end) s.end(actor); i = (i + 1) % steps.length; from = null; }
    };
  }
  const pop = (x, y, html) => { const el = document.createElement('div'); el.className = 'pop'; el.innerHTML = html; el.style.left = x * T + 'px'; el.style.top = (y - 1.6) * T + 'px'; fx.appendChild(el); setTimeout(() => el.remove(), 1600); };
  const dust = (x, y, cls) => { for (let i = 0; i < 6; i++) { const d = document.createElement('i'); d.className = cls; d.style.left = (x + .2 + Math.random() * .6) * T + 'px'; d.style.top = (y + .4 + Math.random() * .4) * T + 'px'; d.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px'); fx.appendChild(d); setTimeout(() => d.remove(), 800); } };
  const cob = `<svg viewBox="0 0 64 64" width="22" height="22">${'<ellipse cx="32" cy="30" rx="11" ry="20" transform="rotate(22 32 30)" fill="#f2c94c" stroke="#1a1410" stroke-width="3"/>'}</svg>`;

  const tu = new Actor(PLAYER, 5, 4, 'right');
  const scripts = [run(tu, [
    { wait: .6, dir: 'right' },
    { to: [8, 4] }, { wait: .3, dir: 'down' },
    { act: 'arar', dir: 'down', dur: 1.9, start: () => setTimeout(() => dust(8, 5, 'polvo'), 300), end: () => { cropEl(8, 5, 'maiz', 0); } },
    { act: 'regar', dir: 'down', dur: 1.7, start: () => dust(8, 5, 'gota'), end: () => { cropEl(8, 5, 'maiz', 1); pop(8, 5, '¡Sembrado!'); } },
    { to: [12, 4] }, { wait: .3, dir: 'down' },
    { act: 'cosechar', dir: 'down', dur: 1.8, start: () => setTimeout(() => removeCrop(12, 5), 450), end: () => pop(12, 5, `${cob} +1 maíz`) },
    { to: [12, 4.01] }, { to: [5, 4] }, { wait: 1.2, dir: 'down', end: () => { removeCrop(8, 5); cropEl(12, 5, 'maiz', 4); } },
  ])];
  const kaya = new Actor(CAST[4], 0, 3.4, 'right');
  scripts.push(run(kaya, [{ to: [15, 3.4], speed: 1.6 }, { wait: 1.4, dir: 'down' }, { to: [0.5, 3.4], speed: 1.6 }, { wait: 1, dir: 'down' }]));
  const yey = new Actor(CAST[9], 4, 11, 'up');
  scripts.push(run(yey, [{ to: [4, 4.4], speed: 1.4 }, { wait: 1.6, dir: 'right' }, { to: [4, 11], speed: 1.4 }, { wait: 1.2, dir: 'up' }]));
  const mei = new Actor(CAST[12], 15.4, 1.6, 'left'), naara = new Actor(CAST[8], 2, 1.4, 'right');
  scripts.push(run(mei, [{ wait: 3, dir: 'left' }, { wait: 2, dir: 'down' }]), run(naara, [{ wait: 2.5, dir: 'right' }, { wait: 2.5, dir: 'down' }]));

  let last = performance.now();
  const loop = now => { const dt = now - last; last = now; scripts.forEach(s => s(now, dt)); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);

  // ---------------- Hojas de sprites
  const sheet = (inner, w, h, scale = 1) => `<img alt="" src="${M.url(M.svg(inner, w, h, w * scale / 2, h * scale / 2))}">`;
  const charSheet = p => { let s = ''; M.DIRS.forEach((d, r) => { for (let f = 0; f < 4; f++) s += `<g transform="translate(${f * 64} ${r * 96})">${M.character(p, d, f)}</g>`; }); return sheet(s, 256, 384, 1); };
  const actSheet = () => { let s = ''; M.DIRS.forEach((d, r) => M.ACTS.forEach((a, ai) => [0, 1].forEach(f => { s += `<g transform="translate(${(ai * 2 + f) * 64} ${r * 96})">${M.character(PLAYER, d, f, a)}</g>`; }))); return sheet(s, 384, 384, 2); };
  const tileSheet = () => Object.keys(M.TILES).map(k => `<figure><img alt="" src="${M.url(M.svg(M.TILES[k](), 64, 64, 64, 64))}"><figcaption>${k}</figcaption></figure>`).join('');
  const cropSheet = () => Object.keys(M.CROPS).map(t => `<div class="row"><b>${t}</b>${M.CROPS[t].map((_, e) => `<img alt="" src="${M.url(M.svg(M.crop(t, e), 64, 128, 48, 96))}">`).join('')}</div>`).join('');
  document.getElementById('hojas').innerHTML = `
    <h2>Jugador · acciones</h2><p>Por fila: abajo, izquierda, derecha, arriba. Por columna: arar ×2, regar ×2, cosechar ×2.</p><div class="sheet">${actSheet()}</div>
    <h2>Personajes caminando</h2><p>Cada hoja: 4 filas (abajo, izquierda, derecha, arriba) × 4 cuadros de caminar. Cuadro de 32×48 px.</p>
    <div class="chars">${[PLAYER, ...CAST].map(p => `<figure>${charSheet(p)}<figcaption>${p.name}</figcaption></figure>`).join('')}</div>
    <h2>Terreno</h2><p>Cuadros de 32×32 px. Las orillas de pasto se ponen encima de la tierra o el camino donde tocan pasto.</p><div class="tiles">${tileSheet()}</div>
    <h2>Cultivos por etapa</h2><p>Cada etapa mide 32×64 px y se apoya en la parte de abajo del cuadro.</p><div class="crops">${cropSheet()}</div>
    <h2>Costales de semilla</h2><div class="seeds">${Object.keys(M.SEEDS).map(k => `<figure><svg viewBox="0 0 64 64" width="88" height="88">${M.semilla(k)}</svg><figcaption>${k}</figcaption></figure>`).join('')}</div>`;
})();
