// Cada pueblo con su propio estilo: plaza, casas y pieza central de la plaza.
function regionCdm(x, y) {
  if (x >= 64 && x < 133 && y < 34) return 'tlax';
  if (x >= 176 && x < 219 && y < 28) return 'tenoch';
  if (x >= 238 && x < 285 && y < 28) return 'otomi';
  if (x >= 294 && x < 329 && y >= 38 && y < 66) return 'toton';
  if (x >= 354 && x < 403 && y >= 34 && y < 66) return 'villa';
  if (x >= 536 && x < 576) return 'maya';
  return null;
}
// ---------- Plazas ----------
const PLAZA = {
  // Tlaxcallan: aplanado rojo pulido en losas de 2×2 con juntas claras y rombos blancos incrustados.
  tlax(px, py, x, y) {
    const h = hash(x >> 1, y >> 1);
    rect(h < 0.5 ? '#c27552' : '#bb6d4b', px, py, TS, TS);
    rect('rgba(255,230,200,.10)', px, py, TS, TS / 2);
    if (!(x & 1)) rect('#e9d6b8', px, py, 1.5, TS); if (!(y & 1)) rect('#e9d6b8', px, py, TS, 1.5);
    if (!(x & 1) && !(y & 1)) { ctx.fillStyle = '#f4ecd8'; ctx.beginPath(); ctx.moveTo(px, py - 4); ctx.lineTo(px + 4, py); ctx.lineTo(px, py + 4); ctx.lineTo(px - 4, py); ctx.fill(); }
    if (hash(x, y) > 0.86) ell('rgba(255,240,220,.16)', px + 16, py + 14, 9, 2);
  },
  // Tenochtitlan: aplanado blanco bruñido en losas grandes de 3×3, juntas grises.
  tenoch(px, py, x, y) {
    rect(hash(Math.floor(x / 3), Math.floor(y / 3)) < 0.5 ? '#efe9dd' : '#e9e2d4', px, py, TS, TS);
    if (x % 3 === 0) rect('rgba(120,110,95,.35)', px, py, 1.2, TS); if (y % 3 === 0) rect('rgba(120,110,95,.35)', px, py, TS, 1.2);
    if (hash(x, y) > 0.8) ell('rgba(255,255,255,.4)', px + 10 + hash(y, x) * 12, py + 12, 7, 1.6);
  },
  // Pueblo otomí: tierra apisonada con piedritas, sin losas.
  otomi(px, py, x, y) {
    rect(hash(x >> 1, y) < 0.5 ? '#bfa078' : '#b8986f', px, py, TS, TS);
    for (let i = 0; i < 4; i++) { const a = hash(x + i * 7, y), c = hash(y + i * 3, x); ell(i % 2 ? '#a08060' : '#cdb48c', px + 3 + a * 26, py + 3 + c * 26, 1.8 + a, 1.2 + c * .8); }
    if (hash(x, y) > 0.8) { ctx.strokeStyle = 'rgba(110,80,50,.35)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + 4, py + 20); ctx.quadraticCurveTo(px + 16, py + 16, px + 28, py + 22); ctx.stroke(); }
  },
  // Totonacapan: piedra de río redonda con musgo entre las piedras.
  toton(px, py, x, y) {
    rect('#6f7a5a', px, py, TS, TS);
    for (let i = 0; i < 6; i++) { const a = hash(x * 3 + i, y * 5), c = hash(y * 7 + i, x * 2); const r = 4 + hash(i, x + y) * 3;
      ctx.fillStyle = ['#a6a28e', '#b4b09a', '#989482'][i % 3]; ctx.beginPath(); ctx.ellipse(px + 4 + a * 24, py + 4 + c * 24, r, r * .75, a * 3, 0, 7); ctx.fill(); ctx.strokeStyle = 'rgba(40,40,30,.4)'; ctx.lineWidth = .8; ctx.stroke(); }
    if (hash(x, y) > 0.7) circ('rgba(90,140,60,.6)', px + hash(y, x) * 28 + 2, py + 6, 2.4);
  },
  // Villa Rica: empedrado español de piedras grises, con maestra de piedra grande cada 4 filas.
  villa(px, py, x, y) {
    rect('#6e6a62', px, py, TS, TS);
    const big = y % 4 === 0;
    for (let r = 0; r < (big ? 2 : 4); r++) for (let k = 0; k < (big ? 2 : 4); k++) {
      const s = big ? 16 : 8, cx = px + k * s + s / 2 + (r % 2 && !big ? 2 : 0), cy = py + r * s + s / 2, j = hash(x * 4 + k, y * 4 + r);
      ctx.fillStyle = ['#a8a49a', '#9a968c', '#b4b0a6'][Math.floor(j * 3)]; ctx.beginPath(); ctx.ellipse(cx, cy, s / 2 - 1, s / 2 - 1.4, 0, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(cx - 1, cy - 1.4, s / 4, s / 6, 0, 0, 7); ctx.fill();
    }
  },
  // Tierra maya: sascab blanco en bloques rectangulares irregulares, gastados.
  maya(px, py, x, y) {
    rect('#ece4cc', px, py, TS, TS);
    const off = (y % 2) * 16; rect('rgba(150,135,100,.4)', px, py + 15, TS, 1.2);
    rect('rgba(150,135,100,.4)', px + (off + 8) % TS, py, 1.2, 15); rect('rgba(150,135,100,.4)', px + (off + 24) % TS, py + 16, 1.2, 16);
    for (let i = 0; i < 3; i++) rect('rgba(170,150,110,.25)', px + hash(x + i, y) * 28, py + hash(y + i, x) * 28, 3, 2);
    if (hash(x, y) > 0.85) ell('rgba(120,140,80,.35)', px + 6, py + 26, 5, 2);
  },
};
const PLAZA_ORILLA = { tlax:'#76b84b', tenoch:'#76b84b', otomi:'#8aa85a', toton:'#4f8a3a', villa:'#76b84b', maya:'#4f8a3a' };
const _drawGroundPueblos = drawGround;
drawGround = function (x, y) {
  const g = S.ground[y]?.[x];
  if (g !== G.STONE || y >= WORLD_H) return _drawGroundPueblos(x, y);
  const r = regionCdm(x, y); if (!r) return _drawGroundPueblos(x, y);
  const px = x * TS, py = y * TS;
  PLAZA[r](px, py, x, y);
  for (const [dx, dy, side] of NEIGH) { const ng = gAt(x + dx, y + dy, g); if (ng === G.GRASS || ng === G.JUNGLE) grassFringe(px, py, side, x, y, PLAZA_ORILLA[r]); }
};
try { TERRAIN_CACHE.clear(); } catch (e) {}
try { GROUND_CACHE.clear(); } catch (e) {}

// ---------- Casas ----------
// Tlaxcallan: adobe encalado con zócalo rojo (los colores de Tlaxcallan), techo de zacate,
// dintel de madera, la garza blanca pintada en un disco rojo y ristra de chiles.
function casaTlaxCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, faceY = py + TS, faceH = h - TS, base = py + h;
  ell('rgba(0,0,0,.2)', px + w/2, base, w/2 + 4, 6);
  rect('#f2e8d4', px + 4, faceY, w - 8, faceH);
  rect('#b5543a', px + 4, base - faceH * 0.42, w - 8, faceH * 0.42); rect('#f4ecd8', px + 4, base - faceH * 0.42 - 2, w - 8, 2);
  greca(px + 6, base - faceH * 0.42 + 4, w - 12, '#f2c84a', '#b5543a');
  rect('rgba(80,40,20,.14)', px + w - 16, faceY, 12, faceH);
  thatch(px + 2, faceY + 6, w - 4, py - 12);
  rect('#2a1a10', px + w/2 - 10, base - 34, 20, 30); petate(px + w/2 - 8, base - 32, 16, 12);
  rect('#6b4423', px + w/2 - 14, base - 38, 28, 5); rect('#8a5a30', px + w/2 - 14, base - 38, 28, 1.5);
  const dx = px + 18, dy = faceY + 18; circ('#b5352a', dx, dy, 9); circ('#f4ecd8', dx, dy, 7.6); circ('#b5352a', dx, dy, 6.6); garzaCdm(dx - 1, dy + 2, 0.34);
  for (let i = 0; i < 4; i++) circ('#d8261e', px + w - 18, faceY + 10 + i * 5, 2.3);
  if (S.time > 18 * 60) rect('rgba(255,170,70,.45)', px + w/2 - 8, base - 22, 16, 18);
  flowerPot(px + 8, base - 4, b.flower || '#ff8fb0');
  ctx.strokeStyle = 'rgba(26,20,16,.7)'; ctx.lineWidth = 1.4; ctx.strokeRect(px + 4.5, faceY + 8.5, w - 9, faceH - 9);
}
// Totonacapan: muros de bajareque (varas con lodo), techo de palma muy alto con alero,
// sobre una plataforma baja, con vainilla secándose al sol.
function casaTotonacaCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h, wallTop = base - Math.max(28, h * 0.4);
  ell('rgba(0,0,0,.2)', px + w/2, base + 2, w/2 + 6, 6);
  rect('#9a8a70', px + 2, base - 6, w - 4, 6); tinta(px + 2, base - 6, w - 4, 6, .5);
  rect('#b89a6a', px + 6, wallTop, w - 12, base - 6 - wallTop);
  for (let x = px + 8; x < px + w - 8; x += 5) { rect('#8a6a40', x, wallTop, 2, base - 6 - wallTop); }
  for (let i = 0; i < 8; i++) rect('#c8aa7a', px + 8 + hash(i, b.x) * (w - 20), wallTop + 4 + hash(b.y, i) * (base - wallTop - 16), 7, 4);
  rect('#2a1a10', px + w/2 - 8, base - 30, 16, 24); rect('#6b4423', px + w/2 - 11, base - 33, 22, 4);
  tinta(px + 6, wallTop, w - 12, base - 6 - wallTop);
  const peak = py - 28;
  ctx.fillStyle = '#7a8a4a'; ctx.beginPath(); ctx.moveTo(px - 6, wallTop + 6); ctx.lineTo(px + w * 0.35, peak); ctx.lineTo(px + w * 0.65, peak); ctx.lineTo(px + w + 6, wallTop + 6); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); for (let yy = peak; yy < wallTop + 8; yy += 5) { ctx.strokeStyle = 'rgba(50,60,25,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px - 6, yy); ctx.lineTo(px + w + 6, yy + 3); ctx.stroke(); }
  for (let x = px - 6; x < px + w + 6; x += 4) { ctx.strokeStyle = 'rgba(160,170,90,.45)'; ctx.beginPath(); ctx.moveTo(x, wallTop + 6); ctx.lineTo(x + 1, wallTop); ctx.stroke(); } ctx.restore();
  ctx.strokeStyle = 'rgba(26,20,16,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px - 6, wallTop + 6); ctx.lineTo(px + w * 0.35, peak); ctx.lineTo(px + w * 0.65, peak); ctx.lineTo(px + w + 6, wallTop + 6); ctx.closePath(); ctx.stroke();
  // vainilla secándose
  const vx = px + w - 4; rect('#6b4423', vx, base - 22, 2, 22); rect('#6b4423', vx + 14, base - 22, 2, 22); rect('#8a5a30', vx, base - 22, 16, 2);
  for (let i = 0; i < 5; i++) rect('#3a2414', vx + 2 + i * 3, base - 20, 1.6, 9);
}
const _drawTownHousePueblos = drawTownHouse;
drawTownHouse = function (b) {
  if (b.t === 'casita') { const r = regionCdm(b.x, b.y); if (r === 'tlax') return casaTlaxCdm(b); if (r === 'toton') return casaTotonacaCdm(b); }
  return _drawTownHousePueblos(b);
};

// ---------- Piezas centrales de las plazas ----------
// Totonacapan: el palo de los Voladores, con el caporal tocando arriba y cuatro voladores girando.
function voladorCdm(b) {
  const cx = b.x*TS + 16, base = b.y*TS + 30, top = base - 170;
  ell('rgba(0,0,0,.22)', cx, base, 12, 4);
  rect('#7a5a38', cx - 3, top, 6, base - top); rect('#9a7a50', cx - 3, top, 2, base - top);
  for (let y = top + 10; y < base - 6; y += 14) { ctx.strokeStyle = '#4a3420'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx - 4, y); ctx.lineTo(cx + 4, y + 5); ctx.stroke(); }
  rect('#5a3a1e', cx - 9, top - 4, 18, 5); tinta(cx - 9, top - 4, 18, 5, .7);
  // caporal
  circ('#a8683a', cx, top - 12, 3.4); rect('#f4ecd8', cx - 3, top - 9, 6, 6); rect('#b5352a', cx - 4, top - 16, 8, 2);
  const a0 = T * 1.2, desc = (Math.sin(T * 0.25) + 1) / 2;
  for (let i = 0; i < 4; i++) {
    const a = a0 + i * Math.PI / 2, r = 14 + desc * 36, x = cx + Math.cos(a) * r, y = top + 10 + desc * 110 + Math.sin(a) * r * 0.25;
    ctx.strokeStyle = 'rgba(80,60,40,.6)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(x, y); ctx.stroke();
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI);
    circ('#a8683a', 0, 6, 3); rect('#b5352a', -3, -2, 6, 7); rect('#f4ecd8', -3, -5, 6, 3);
    ctx.strokeStyle = ['#2f8a5a', '#f2c84a', '#2f6aa8', '#e05a8a'][i]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-3, 0); ctx.lineTo(-7, 4); ctx.moveTo(3, 0); ctx.lineTo(7, 4); ctx.stroke();
    ctx.restore();
  }
}
// Villa Rica: el rollo de justicia, columna de piedra sobre gradas con argollas y cruz.
function rolloCdm(b) {
  const cx = b.x*TS + 16, base = b.y*TS + 30;
  ell('rgba(0,0,0,.22)', cx, base, 22, 5);
  for (const [w, h, y] of [[40, 6, base - 6], [30, 6, base - 12]]) { rect('#9a948a', cx - w/2, y, w, h); tinta(cx - w/2, y, w, h, .6); }
  rect('#b4aea2', cx - 5, base - 62, 10, 50); rect('#c8c2b6', cx - 5, base - 62, 3, 50); tinta(cx - 5, base - 62, 10, 50, .7);
  rect('#9a948a', cx - 8, base - 66, 16, 5); tinta(cx - 8, base - 66, 16, 5, .6);
  rect('#6a6660', cx - 1.5, base - 82, 3, 16); rect('#6a6660', cx - 6, base - 77, 12, 3);
  for (const s of [-1, 1]) { ctx.strokeStyle = '#3a3a3a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx + s * 7, base - 46, 3, 0, 7); ctx.stroke(); }
}
// Pueblo otomí: el palo del Xócotl, con guirnaldas de papel y la figura de masa en la punta.
function xocotlCdm(b) {
  const cx = b.x*TS + 16, base = b.y*TS + 30, top = base - 150;
  ell('rgba(0,0,0,.22)', cx, base, 12, 4);
  rect('#8a6a40', cx - 3, top, 6, base - top); rect('#a8865a', cx - 3, top, 2, base - top);
  for (let i = 0; i < 5; i++) { const y = top + 20 + i * 24; ctx.strokeStyle = ['#f4ecd8', '#b5352a', '#f2c84a', '#2f6aa8', '#2f8a5a'][i]; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 12, y + Math.sin(T * 2 + i) * 2); ctx.quadraticCurveTo(cx, y + 8, cx + 12, y + Math.sin(T * 2 + i + 1) * 2); ctx.stroke(); }
  for (const s of [-1, 1]) { const sw = Math.sin(T * 2.4 + s) * 3; ctx.fillStyle = '#f4ecd8'; ctx.beginPath(); ctx.moveTo(cx, top + 6); ctx.lineTo(cx + s * 16, top + 20 + sw); ctx.lineTo(cx + s * 4, top + 24); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = .8; ctx.stroke(); }
  ctx.fillStyle = '#d8b070'; ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(cx, top - 4, 7, 9, 0, 0, 7); ctx.fill(); ctx.stroke();
  circ('#d8b070', cx, top - 15, 4.4); ctx.stroke(); circ(TINTA_Z, cx - 1.4, top - 16, .8); circ(TINTA_Z, cx + 1.4, top - 16, .8);
  for (const s of [-1, 1]) { ctx.fillStyle = '#2f8a5a'; ctx.beginPath(); ctx.moveTo(cx, top - 4); ctx.lineTo(cx + s * 12, top - 10); ctx.lineTo(cx + s * 4, top + 2); ctx.fill(); }
}
// Tlaxcallan: el momoztli (altar de ofrendas) con estandartes de la garza y flores.
function momoztliExtraCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, cx = px + w/2;
  for (const s of [-1, 1]) { const fx = cx + s * (w/2 + 6); rect('#5a3a1e', fx - 1, py + h - 70, 2, 66); const sw = Math.sin(T * 2 + s) * 2;
    ctx.fillStyle = '#b5352a'; ctx.beginPath(); ctx.moveTo(fx + 1, py + h - 70); ctx.lineTo(fx + 1 + s * 22, py + h - 70 + sw); ctx.lineTo(fx + 1 + s * 22, py + h - 50 + sw); ctx.lineTo(fx + 1, py + h - 50); ctx.closePath(); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1; ctx.stroke();
    garzaCdm(fx + s * 11, py + h - 58, 0.36); }
  for (let i = 0; i < 6; i++) { const a = hash(i, 4) * w - w/2; circ('#e8862a', cx + a, py + h - 2 + hash(4, i) * 4, 2.6); circ('#f7c623', cx + a, py + h - 2 + hash(4, i) * 4, 1.2); }
  ctx.strokeStyle = 'rgba(26,20,16,.6)'; ctx.lineWidth = 1.2; ctx.strokeRect(px + .6, py + h - 20.4, w - 1.2, 20); ctx.strokeRect(px + 8.6, py + h - 36.4, w - 17.2, 16); ctx.strokeRect(px + 16.6, py + h - 52.4, w - 33.2, 16);
}
for (const d of [{ t:'volador', x:305, y:51, w:1, h:1, name:'Palo de los Voladores' }, { t:'rollo', x:378, y:50, w:1, h:1, name:'Rollo de la Villa Rica' }, { t:'xocotl', x:258, y:13, w:1, h:1, name:'Palo del Xócotl' }])
  if (!BUILD.some(b => b.t === d.t) && S0libre(d.x, d.y)) BUILD.push(d);
function S0libre(x, y) { try { return !BUILD.some(b => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h); } catch (e) { return false; } }
const _drawBuildingPueblos = drawBuilding;
drawBuilding = function (b) {
  if (b.t === 'volador') return voladorCdm(b);
  if (b.t === 'rollo') return rolloCdm(b);
  if (b.t === 'xocotl') return xocotlCdm(b);
  _drawBuildingPueblos(b);
  if (b.t === 'fountain' && regionCdm(b.x, b.y) === 'tlax') momoztliExtraCdm(b);
};
