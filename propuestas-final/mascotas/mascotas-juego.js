// Mascotas con el arte de CdmMascotas (gato, perro y xoloitzcuintle).
const MASC_IMG = new Map();
function mascImg(tipo, cuadro, parp) {
  const key = `${tipo}|${cuadro}|${parp ? 1 : 0}`; let im = MASC_IMG.get(key);
  if (!im) {
    im = new Image(); MASC_IMG.set(key, im);
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = 112; c.height = 88; c.getContext('2d').drawImage(im, 0, 0, 112, 88); MASC_IMG.set(key, c); } catch (e) {} };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(CdmMascotas.svg(tipo, cuadro, parp));
  }
  return im instanceof HTMLCanvasElement ? im : null;
}
function mascDibuja(tipo, x, y, f, moving, k = 0.64) {
  const cuadro = moving ? (Math.sin(T * 16 + x) > 0 ? 1 : 2) : 0, parp = typeof blinking === 'function' && !moving && blinking(x + (tipo === 'perro' ? 3 : 0));
  const im = mascImg(tipo, cuadro, parp); if (!im) return false;
  ctx.save(); ctx.translate(x, y); ctx.scale(f < 0 ? -1 : 1, 1); ctx.drawImage(im, -27 * k, -40 * k, 56 * k, 44 * k); ctx.restore();
  return true;
}
const _drawPetMascotas = drawPet;
drawPet = function (type, x, y, f, moving, hearts, armor) {
  if (type !== 'gato' && type !== 'perro') return _drawPetMascotas(type, x, y, f, moving, hearts, armor);
  if (inking) return;
  if (!mascDibuja(type, x, y, f, moving)) return _drawPetMascotas(type, x, y, f, moving, hearts, armor);
  if (armor) try { drawPetArmor(type, x, y, f, 0, armor); } catch (e) {}
  if (hearts) { ctx.globalAlpha = 0.8; text('❤', x, y - 34, 10, '#ff6b8a', 'center', false); ctx.globalAlpha = 1; }
};
const _drawXoloMascotas = drawXolo;
drawXolo = function (d) {
  if (inking) return;
  const x = Math.round(d.x), y = Math.round(d.y);
  if (!mascDibuja('xolo', x, y, d.face, d.moving, 0.68)) return _drawXoloMascotas(d);
  if (S.xolo?.petDay === S.day) { ctx.globalAlpha = 0.8; text('❤', x, y - 36, 10, '#ff6b8a', 'center', false); ctx.globalAlpha = 1; }
};
for (const t of CdmMascotas.TIPOS) for (const c of [0, 1, 2]) for (const p of [false, true]) mascImg(t, c, p);

// Otomíes (hñähñu): casa de quiotes de maguey con techo de pencas, cortina de ayate bordado,
// ayates de ixtle secándose y cántaro de pulque; y tenangos bordados en el puesto de Doni.
function otomiCasaCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, cx = px + w/2, base = py + h - 4, wallTop = base - 40;
  ell('rgba(0,0,0,.22)', cx, base + 3, w/2 + 6, 7);
  rect('#8a8274', px + 6, base - 6, w - 12, 6); for (let x = px + 8; x < px + w - 8; x += 9) rect('rgba(50,40,30,.3)', x, base - 6, 1, 6);
  rect('#b89a6a', px + 8, wallTop, w - 16, base - 6 - wallTop);
  for (let x = px + 9; x < px + w - 9; x += 5) { rect('#c8a86a', x, wallTop, 3, base - 6 - wallTop); rect('rgba(90,60,30,.35)', x + 3, wallTop, 1, base - 6 - wallTop); }
  for (let i = 0; i < 6; i++) rect('#a8845a', px + 10 + hash(i, b.x) * (w - 30), wallTop + 6 + hash(b.y, i) * 24, 10, 6);
  tinta(px + 8, wallTop, w - 16, base - 6 - wallTop);
  // puerta con cortina de ayate bordado
  rect('#2a1a10', cx - 9, base - 30, 18, 24);
  rect('#e8dcc0', cx - 8, base - 30, 16, 16); for (let i = 0; i < 3; i++) rect(['#c0392b', '#2f6aa8', '#2f8a5a'][i], cx - 8, base - 26 + i * 4, 16, 1.6);
  for (const dx of [-4, 4]) { ctx.fillStyle = '#e05a8a'; ctx.beginPath(); ctx.arc(cx + dx, base - 17, 1.8, 0, 7); ctx.fill(); }
  if (S.time > 18 * 60) rect('rgba(255,150,60,.5)', cx - 8, base - 14, 16, 8);
  // techo a dos aguas de pencas de maguey
  const peak = py - 20, L = px - 4, R = px + w + 4;
  ctx.save(); ctx.beginPath(); ctx.moveTo(L, wallTop + 6); ctx.lineTo(cx, peak); ctx.lineTo(R, wallTop + 6); ctx.closePath(); ctx.fillStyle = '#4f7a62'; ctx.fill(); ctx.clip();
  const filas = 6;
  for (let r = 0; r < filas; r++) { const yy = peak + (wallTop + 6 - peak) * (r + 1) / filas; for (let x = L - 6 + (r % 2) * 5; x < R + 6; x += 10) {
    ctx.fillStyle = ((x / 10 | 0) + r) % 3 ? '#6a9a7a' : '#5e8f72'; ctx.strokeStyle = '#2f4a3a'; ctx.lineWidth = .9;
    ctx.beginPath(); ctx.moveTo(x, yy - 12); ctx.lineTo(x + 10, yy - 12); ctx.lineTo(x + 5, yy + 1); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,230,210,.45)'; ctx.beginPath(); ctx.moveTo(x + 5, yy - 11); ctx.lineTo(x + 5, yy - 2); ctx.stroke(); } }
  ctx.restore();
  ctx.strokeStyle = 'rgba(26,20,16,.85)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(L, wallTop + 6); ctx.lineTo(cx, peak); ctx.lineTo(R, wallTop + 6); ctx.closePath(); ctx.stroke();
  rect('#c8a86a', cx - 1.5, peak - 8, 3, 10); circ('#c8a86a', cx, peak - 9, 2.4);
  // ayates secándose y cántaro de pulque
  const ax = px + w + 2;
  rect('#6b4423', ax, base - 30, 2, 30); rect('#6b4423', ax + 22, base - 30, 2, 30);
  ctx.strokeStyle = '#8a6a40'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(ax + 1, base - 28); ctx.lineTo(ax + 23, base - 28); ctx.stroke();
  const sw = Math.sin(T * 2 + b.x) * 1.4;
  for (const [ox, c] of [[3, '#e8dcc0'], [13, '#d8c89a']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(ax + ox, base - 28); ctx.lineTo(ax + ox + 8, base - 28); ctx.lineTo(ax + ox + 8 + sw, base - 12); ctx.lineTo(ax + ox + sw, base - 12); ctx.closePath(); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = .8; ctx.stroke(); for (let k = 0; k < 3; k++) rect('rgba(140,110,60,.4)', ax + ox + 1, base - 25 + k * 4, 7, 1); }
  ell('rgba(0,0,0,.2)', px + 4, base + 1, 7, 2); ctx.fillStyle = '#a86a3a'; ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(px + 4, base - 7, 6, 7, 0, 0, 7); ctx.fill(); ctx.stroke(); rect('#a86a3a', px + 1.5, base - 16, 5, 3); rect('#f4ecd8', px - 1, base - 8, 10, 1.4);
}
function tenangoCdm(x, y, w, h, seed) {
  rect('#f6f1e4', x, y, w, h); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = .8; ctx.strokeRect(x + .4, y + .4, w - .8, h - .8);
  const cols = ['#c0392b', '#2f6aa8', '#2f8a5a', '#e8862a', '#7a4a9a', '#e05a8a'];
  for (let i = 0; i < 3; i++) { const c = cols[(seed + i) % cols.length], bx = x + 3 + hash(seed, i) * (w - 8), by = y + 3 + i * (h - 4) / 3;
    ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(bx + 2, by + 2.4, 2.6, 1.8, 0, 0, 7); ctx.fill(); ctx.beginPath(); ctx.moveTo(bx - .4, by + 2.4); ctx.lineTo(bx - 2.6, by + .6); ctx.lineTo(bx - 2.6, by + 4); ctx.fill(); circ(c, bx + 4.4, by + 1.2, 1.2); }
  for (let i = 0; i < 2; i++) { const c = cols[(seed + i + 3) % cols.length], fx = x + 4 + hash(i, seed) * (w - 8), fy = y + h - 4 - i * 6; circ(c, fx, fy, 1.6); circ('#f2c84a', fx, fy, .6); }
}
