// Integración de los muebles y la estructura de la casa en el juego (va después de muebles-art.js).
const MUEBLE_IMG = new Map();
function muebleImg(key, mk, w, h) {
  let im = MUEBLE_IMG.get(key);
  if (!im) {
    im = new Image(); MUEBLE_IMG.set(key, im);
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h); MUEBLE_IMG.set(key, c); } catch (e) {} };
    try { const s = mk(); if (s) im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); } catch (e) { console.warn('[muebles]', key, e); }
  }
  return im instanceof HTMLCanvasElement ? im : null;
}
function muebleFuego(id, x0, y0, s) {
  for (const [fx, fy] of CdmMuebles.FUEGO[id] || []) {
    const x = x0 + fx * s, y = y0 + fy * s, k = 1 + Math.sin(T * 11 + fx) * 0.12;
    ctx.fillStyle = 'rgba(255,190,90,.16)'; ctx.beginPath(); ctx.arc(x, y - 4 * s, 12 * s, 0, 7); ctx.fill();
    ctx.fillStyle = '#f08a24'; ctx.beginPath(); ctx.moveTo(x, y - 11 * s * k); ctx.quadraticCurveTo(x + 5 * s, y - 3 * s, x, y); ctx.quadraticCurveTo(x - 5 * s, y - 3 * s, x, y - 11 * s * k); ctx.fill();
    ctx.fillStyle = '#f7d040'; ctx.beginPath(); ctx.moveTo(x, y - 6 * s * k); ctx.quadraticCurveTo(x + 2.5 * s, y - 2 * s, x, y); ctx.quadraticCurveTo(x - 2.5 * s, y - 2 * s, x, y - 6 * s * k); ctx.fill();
  }
  for (const [fx, fy] of CdmMuebles.HUMO[id] || []) for (let i = 0; i < 3; i++) {
    const t = (T * 0.4 + i / 3 + fx * 0.01) % 1;
    ctx.fillStyle = `rgba(235,230,222,${0.32 * (1 - t)})`; ctx.beginPath(); ctx.arc(x0 + fx * s + Math.sin(T * 1.3 + i) * 3 * s, y0 + fy * s - t * 26 * s, (3 + t * 6) * s, 0, 7); ctx.fill();
  }
}
const _drawFurnArte = drawFurn;
drawFurn = function (id, x, y) {
  if (!CdmMuebles.IDS.includes(id)) return _drawFurnArte(id, x, y);
  const w = CdmMuebles.ANCHO[id] || 64, im = muebleImg('f|' + id, () => CdmMuebles.svg(id), w * 2, 128);
  if (!im) return _drawFurnArte(id, x, y);
  const s = 0.8, x0 = x - w * s / 2, y0 = y + 4 - 60 * s;
  ctx.drawImage(im, x0, y0, w * s, 64 * s);
  muebleFuego(id, x0, y0, s);
};
const _drawMueble50Arte = drawMueble50;
drawMueble50 = function (m, x, y) {
  if (!CdmMuebles.TIPOS.includes(m.k)) return _drawMueble50Arte(m, x, y);
  const w = m.k === 'hamaca' ? 96 : 64, im = muebleImg(`t|${m.k}|${m.c}`, () => CdmMuebles.tipo(m.k, m.c), w * 2, 128);
  if (!im) return _drawMueble50Arte(m, x, y);
  const s = 0.62, x0 = x - w * s / 2, y0 = y + 3 - 60 * s;
  ctx.drawImage(im, x0, y0, w * s, 64 * s);
  muebleFuego(m.k === 'lampara' ? 'lampara' : m.k === 'comal' ? '' : '', x0, y0, s);
};
// Íconos de las tiendas de muebles con el mismo dibujo.
function iconoMueble(key, mk, w) { return (cx, cy) => { const im = muebleImg(key, mk, w * 2, 128); if (im) ctx.drawImage(im, cx - w * 0.22, cy - 15, w * 0.44, 28); else text('🛋', cx, cy + 5, 14, '#000', 'center', false); }; }
for (const [shop, buscar] of [['muebles', r => FURNITURE.find(f => f.name === r.name)], ['muebles50', r => MUEBLES50.concat(typeof MUEBLES_ALA !== 'undefined' ? MUEBLES_ALA : []).find(m => m.n === r.name)]]) {
  const S0 = SHOPS[shop]; if (!S0) continue;
  const base = S0.rows;
  S0.rows = () => base().map(r => {
    const f = buscar(r); if (!f) return r;
    if (shop === 'muebles' && CdmMuebles.IDS.includes(f.id)) { const w = CdmMuebles.ANCHO[f.id] || 64; return { ...r, icon:iconoMueble('f|' + f.id, () => CdmMuebles.svg(f.id), w) }; }
    if (shop === 'muebles50' && CdmMuebles.TIPOS.includes(f.k)) { const w = f.k === 'hamaca' ? 96 : 64; return { ...r, icon:iconoMueble(`t|${f.k}|${f.c}`, () => CdmMuebles.tipo(f.k, f.c), w) }; }
    return r;
  });
}
// Muros de la casa: adobe con remate claro arriba, cara con franja roja y contorno de tinta.
function muroCasaCdm(x, y, w, h) {
  const hz = w >= h;
  rect('#b98a5c', x, y, w, h);
  if (hz) { rect('#e6cfa2', x, y, w, h * 0.55); rect('#a8392b', x, y + h * 0.55, w, 2); for (let i = 4; i < w - 4; i += 12) rect('rgba(90,55,30,.22)', x + i, y + h * 0.55 + 4, 6, 2); }
  else { rect('#e6cfa2', x, y, w * 0.6, h); rect('#a8392b', x + w * 0.6, y, 2, h); for (let i = 4; i < h - 4; i += 12) rect('rgba(90,55,30,.22)', x + w * 0.6 + 4, y + i, 2, 6); }
  for (let i = 0; i < Math.max(w, h) / 14; i++) rect('rgba(150,100,60,.2)', x + (hz ? i * 14 + 3 : 2), y + (hz ? 2 : i * 14 + 3), hz ? 5 : 3, hz ? 2 : 5);
  ctx.strokeStyle = 'rgba(26,20,16,.75)'; ctx.lineWidth = 1.4; ctx.strokeRect(x + .7, y + .7, w - 1.4, h - 1.4);
}
// Pisos: petate en las recámaras, aplanado blanco con cenefa en el oratorio, aplanado rojo
// pulido en la sala y el comedor, y lajas de piedra en la cocina y el baño.
function sombraMuro(x0, y0, x1, y1) {
  const g = ctx.createLinearGradient(0, y0, 0, y0 + 14); g.addColorStop(0, 'rgba(40,20,10,.28)'); g.addColorStop(1, 'rgba(40,20,10,0)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, 14);
  const g2 = ctx.createLinearGradient(x0, 0, x0 + 8, 0); g2.addColorStop(0, 'rgba(40,20,10,.18)'); g2.addColorStop(1, 'rgba(40,20,10,0)'); ctx.fillStyle = g2; ctx.fillRect(x0, y0, 8, y1 - y0);
}
function pisoPetate(x0, y0, x1, y1) {
  rect('#d4b06c', x0, y0, x1 - x0, y1 - y0);
  for (let y = y0, r = 0; y < y1; y += 18, r++) for (let x = x0, c = 0; x < x1; x += 18, c++) {
    const v = (r + c) % 2, w = Math.min(18, x1 - x), h = Math.min(18, y1 - y);
    for (let k = 3; k < (v ? w : h); k += 4) v ? rect('rgba(140,100,40,.35)', x + k, y + 1, 1.4, h - 2) : rect('rgba(140,100,40,.35)', x + 1, y + k, w - 2, 1.4);
    rect('rgba(110,75,30,.28)', x, y, w, 1); rect('rgba(110,75,30,.28)', x, y, 1, h);
  }
  ctx.strokeStyle = '#8a6a34'; ctx.lineWidth = 3; ctx.strokeRect(x0 + 6, y0 + 6, x1 - x0 - 12, y1 - y0 - 12);
  sombraMuro(x0, y0, x1, y1);
}
function pisoOratorio(x0, y0, x1, y1) {
  rect('#efe6d2', x0, y0, x1 - x0, y1 - y0);
  for (let i = 0; i < 40; i++) rect('rgba(160,140,110,.12)', x0 + hash(i, 7) * (x1 - x0), y0 + hash(7, i) * (y1 - y0), 10, 2);
  rect('#a8392b', x0 + 8, y0 + 8, x1 - x0 - 16, 8); rect('#a8392b', x0 + 8, y1 - 16, x1 - x0 - 16, 8); rect('#a8392b', x0 + 8, y0 + 8, 8, y1 - y0 - 16); rect('#a8392b', x1 - 16, y0 + 8, 8, y1 - y0 - 16);
  greca(x0 + 16, y1 - 15, x1 - x0 - 32, '#f2c84a', '#a8392b');
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2 + 30;
  ctx.globalAlpha = 0.35; for (let i = 0; i < 8; i++) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(i * Math.PI / 4); ctx.fillStyle = '#d39a26'; ctx.beginPath(); ctx.moveTo(-6, -18); ctx.lineTo(0, -30); ctx.lineTo(6, -18); ctx.fill(); ctx.restore(); }
  circ('#d39a26', cx, cy, 16); circ('#efe6d2', cx, cy, 10); circ('#a8392b', cx, cy, 5); ctx.globalAlpha = 1;
  sombraMuro(x0, y0, x1, y1);
}
function pisoRojo(x0, y0, x1, y1) {
  rect('#b5654a', x0, y0, x1 - x0, y1 - y0);
  const g = ctx.createLinearGradient(x0, y0, x1, y1); g.addColorStop(0, 'rgba(255,230,200,.14)'); g.addColorStop(1, 'rgba(60,20,10,.12)'); ctx.fillStyle = g; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
  for (let y = y0 + 12; y < y1 - 12; y += 40) rect('rgba(90,35,20,.25)', x0 + 12, y, x1 - x0 - 24, 1);
  for (let x = x0 + 12; x < x1 - 12; x += 40) rect('rgba(90,35,20,.25)', x, y0 + 12, 1, y1 - y0 - 24);
  for (let i = 0; i < 18; i++) ell('rgba(255,235,210,.12)', x0 + 20 + hash(i, 4) * (x1 - x0 - 40), y0 + 20 + hash(4, i) * (y1 - y0 - 40), 8, 2);
  ctx.strokeStyle = '#efe0c4'; ctx.lineWidth = 3; ctx.strokeRect(x0 + 8, y0 + 8, x1 - x0 - 16, y1 - y0 - 16);
  sombraMuro(x0, y0, x1, y1);
}
function pisoLajas(x0, y0, x1, y1) {
  rect('#8e7862', x0, y0, x1 - x0, y1 - y0);
  for (let y = y0 + 2, r = 0; y < y1; y += 26, r++) for (let x = x0 + 2 - (r % 2) * 14; x < x1; x += 30) {
    const w = 24 + hash(x, y) * 6, h = 20 + hash(y, x) * 5, xx = Math.max(x0 + 2, x), ww = Math.min(w, x1 - 2 - xx); if (ww < 6) continue;
    ctx.fillStyle = ['#a8927a', '#9e8870', '#b09a80'][(r + Math.floor(x / 30)) % 3]; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(xx, y, ww, Math.min(h, y1 - 2 - y), 5); else ctx.rect(xx, y, ww, Math.min(h, y1 - 2 - y)); ctx.fill();
    ctx.strokeStyle = 'rgba(50,35,25,.45)'; ctx.lineWidth = 1; ctx.stroke();
  }
  sombraMuro(x0, y0, x1, y1);
}
function tapeteCasa(x, y, w, h, c) {
  rect('rgba(26,20,16,.25)', x + 3, y + 4, w, h);
  rect(c, x, y, w, h); rect('#f4ecd8', x + 5, y + 5, w - 10, h - 10); rect(c, x + 9, y + 9, w - 18, h - 18);
  greca(x + 10, y + h / 2 - 4, w - 20, '#f2c84a', c);
  for (let i = 0; i < w; i += 6) { rect('#e8d8b0', x + i, y - 3, 2, 3); rect('#e8d8b0', x + i, y + h, 2, 3); }
  ctx.strokeStyle = 'rgba(26,20,16,.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(x + .6, y + .6, w - 1.2, h - 1.2);
}
