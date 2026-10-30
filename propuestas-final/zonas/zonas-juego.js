// Tenochtitlan, Villa Rica y tierra maya: edificios con más diseño (estilo códice, contorno de tinta).
const TINTA_Z = '#1a1410';
function tinta(x, y, w, h, a = .75) { ctx.strokeStyle = `rgba(26,20,16,${a})`; ctx.lineWidth = 1.5; ctx.strokeRect(x + .75, y + .75, w - 1.5, h - 1.5); }
function cabezaSerpiente(x, y, dir, col = '#c9c1ae', s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(dir * s, s);
  ctx.fillStyle = col; ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1.4;
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(-10, -12); ctx.quadraticCurveTo(-4, -18, 6, -14); ctx.lineTo(14, -10); ctx.lineTo(14, -2); ctx.quadraticCurveTo(6, 2, -10, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#b5352a'; ctx.beginPath(); ctx.moveTo(4, -6); ctx.lineTo(14, -6); ctx.lineTo(14, -2); ctx.lineTo(6, -2); ctx.fill();
  ctx.fillStyle = '#f4ecd8'; for (const tx of [7, 10, 13]) { ctx.beginPath(); ctx.moveTo(tx, -6); ctx.lineTo(tx + 1, -3.5); ctx.lineTo(tx + 2, -6); ctx.fill(); }
  circ('#f2c84a', 2, -11, 2.4); circ(TINTA_Z, 2.4, -11, 1);
  ctx.strokeStyle = '#2f8a5a'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-8, -13); ctx.lineTo(-12, -19); ctx.moveTo(-4, -15); ctx.lineTo(-6, -21); ctx.stroke();
  ctx.restore();
}
// Templo Mayor: basamento de cuatro cuerpos en talud, doble escalinata con alfardas, cabezas de
// serpiente, la piedra de Coyolxauhqui al pie y los dos adoratorios (Tláloc azul y blanco,
// Huitzilopochtli rojo con calaveras pintadas) con techos altos y almenas.
function temploMayorCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h;
  ell('rgba(30,22,16,.28)', px + w/2, base + 2, w/2 + 12, 9);
  let top = base;
  for (let i = 0; i < 4; i++) {
    const m = i * 12, th = 26, x0 = px + m, x1 = px + w - m;
    ctx.fillStyle = i % 2 ? '#cfc6b2' : '#c4bba6'; ctx.beginPath(); ctx.moveTo(x0, top); ctx.lineTo(x1, top); ctx.lineTo(x1 - 4, top - th); ctx.lineTo(x0 + 4, top - th); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(26,20,16,.7)'; ctx.lineWidth = 1.4; ctx.stroke();
    for (let bx = x0 + 10; bx < x1 - 8; bx += 14) rect('rgba(60,45,30,.18)', bx, top - th + 4, 1, th - 6);
    rect('rgba(60,45,30,.22)', x0 + 4, top - th + 12, x1 - x0 - 8, 1);
    top -= th;
  }
  // doble escalinata
  for (const [sx, col] of [[px + w/2 - 36, '#2f6aa8'], [px + w/2 + 6, '#b5352a']]) {
    rect('#e2dac8', sx, top, 30, base - top);
    for (let yy = top + 4; yy < base; yy += 5) rect('rgba(60,45,30,.22)', sx, yy, 30, 1);
    rect(col, sx - 4, top, 4, base - top); rect(col, sx + 30, top, 4, base - top);
    tinta(sx - 4, top, 38, base - top, .6);
  }
  cabezaSerpiente(px + w/2 - 44, base, -1); cabezaSerpiente(px + w/2 + 44, base, 1);
  // Coyolxauhqui al pie
  ctx.fillStyle = '#d8d0bc'; ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.ellipse(px + w/2, base + 10, 18, 6, 0, 0, 7); ctx.fill(); ctx.stroke();
  circ('#b5352a', px + w/2, base + 10, 3); for (const a of [0.4, 2.2, 3.6, 5.4]) circ('#2f6aa8', px + w/2 + Math.cos(a) * 11, base + 10 + Math.sin(a) * 3.4, 1.6);
  // adoratorios
  const tw = 40, th2 = 34;
  for (const [sx, tlaloc] of [[px + w/2 - 42, true], [px + w/2 + 2, false]]) {
    rect('#f0ebe0', sx, top - th2, tw, th2); tinta(sx, top - th2, tw, th2);
    rect('#1a0e08', sx + 14, top - 22, 12, 22);
    const rt = top - th2 - 26;
    if (tlaloc) { rect('#2f6aa8', sx - 2, rt, tw + 4, 26); for (let i = 0; i < 6; i++) rect('#f0ebe0', sx + 2 + i * 7, rt + 3, 3, 20); for (let i = 0; i < 4; i++) circ('#f0ebe0', sx + 6 + i * 10, rt - 3, 3.4); }
    else { rect('#b5352a', sx - 2, rt, tw + 4, 26); for (let i = 0; i < 3; i++) { circ('#f4ecd8', sx + 8 + i * 12, rt + 12, 3.6); rect(TINTA_Z, sx + 6.6 + i * 12, rt + 11, 1.2, 1.2); rect(TINTA_Z, sx + 8.6 + i * 12, rt + 11, 1.2, 1.2); } for (let i = 0; i < 4; i++) { ctx.fillStyle = '#f4ecd8'; ctx.beginPath(); ctx.moveTo(sx + 2 + i * 10, rt); ctx.lineTo(sx + 6 + i * 10, rt - 8); ctx.lineTo(sx + 10 + i * 10, rt); ctx.fill(); } }
    tinta(sx - 2, rt, tw + 4, 26);
  }
  for (const a of [-1, 1]) {
    const bx = px + w/2 + a * 62, by = base - 10;
    rect('#6d6660', bx - 6, by - 10, 12, 10); tinta(bx - 6, by - 10, 12, 10, .6);
    ctx.fillStyle = '#ff8c28'; ctx.beginPath(); ctx.moveTo(bx - 6, by - 10); ctx.quadraticCurveTo(bx, by - 24 + Math.sin(T * 12 + a) * 2, bx + 6, by - 10); ctx.fill();
  }
  for (const a of [-1, 1]) { const fx = px + w/2 + a * (w/2 - 6); rect('#5a3a1e', fx - 1, top - 6, 2, 30); ctx.fillStyle = a < 0 ? '#2f6aa8' : '#b5352a'; ctx.beginPath(); ctx.moveTo(fx + 1, top - 6); ctx.lineTo(fx + 1 + a * 14, top - 2 + Math.sin(T * 3 + a) * 2); ctx.lineTo(fx + 1, top + 4); ctx.fill(); }
}
// Calli de Tenochtitlan: casa encalada de azotea plana con pretil, plantas en la azotea,
// franja roja, puerta con dintel y contorno de tinta.
function calliCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h;
  ell('rgba(0,0,0,.2)', px + w/2, base, w/2 + 4, 5);
  rect('#f0ebe0', px + 2, py + 12, w - 4, h - 12); rect('rgba(120,100,80,.12)', px + w - 12, py + 12, 10, h - 12);
  rect('#b5352a', px + 2, base - 12, w - 4, 4); greca(px + 4, base - 9, w - 8, '#2f6aa8', '#f0ebe0');
  rect('#d8d0c0', px, py + 6, w, 8); for (let x = px + 2; x < px + w - 4; x += 10) rect('#e8e2d4', x, py, 6, 7);
  for (let x = px + 8; x < px + w - 8; x += 14) { ell('#3f8f30', x, py + 4, 5, 4); circ(['#e8501e', '#f7c623', '#ff8fb0'][Math.floor(x / 14) % 3], x, py + 2, 1.8); }
  rect('#2a1a10', px + w/2 - 7, base - 26, 14, 24); rect('#6b4423', px + w/2 - 10, base - 29, 20, 4);
  rect('#2a1a10', px + 8, py + 20, 9, 7);
  tinta(px + 2, py + 6, w - 4, h - 6);
}
// Villa Rica: casa española encalada con techo de teja, ventana con reja de madera y zócalo.
function casaEspCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h, wallTop = py + Math.max(26, h * 0.34);
  ell('rgba(30,22,16,.2)', px + w/2, base + 2, w/2 + 6, 6);
  rect('#f2ede4', px + 4, wallTop, w - 8, base - wallTop); rect('rgba(120,100,80,.12)', px + w - 16, wallTop, 12, base - wallTop);
  rect('#a89a86', px + 4, base - 8, w - 8, 8); for (let x = px + 6; x < px + w - 8; x += 10) rect('rgba(60,45,30,.25)', x, base - 8, 1, 8);
  // techo de teja a dos aguas
  ctx.fillStyle = '#b5543a'; ctx.beginPath(); ctx.moveTo(px - 2, wallTop + 4); ctx.lineTo(px + w/2, py + 4); ctx.lineTo(px + w + 2, wallTop + 4); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); for (let yy = py + 4; yy < wallTop + 4; yy += 5) for (let x = px - 4 + (Math.floor(yy / 5) % 2) * 4; x < px + w + 4; x += 8) { ctx.fillStyle = 'rgba(120,40,20,.35)'; ctx.beginPath(); ctx.arc(x, yy + 4, 3.6, Math.PI, 0); ctx.fill(); } ctx.restore();
  ctx.strokeStyle = 'rgba(26,20,16,.75)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px - 2, wallTop + 4); ctx.lineTo(px + w/2, py + 4); ctx.lineTo(px + w + 2, wallTop + 4); ctx.closePath(); ctx.stroke();
  // puerta de madera con arco, ventana con reja
  const dx = px + w/2 - 9; rect('#6b4423', dx, base - 30, 18, 22); ctx.fillStyle = '#6b4423'; ctx.beginPath(); ctx.arc(dx + 9, base - 30, 9, Math.PI, 0); ctx.fill(); rect('#4a2f18', dx + 8.5, base - 36, 1, 28); circ('#c8a040', dx + 13, base - 20, 1.4);
  if (w >= 96) for (const wx of [px + 12, px + w - 28]) { rect('#3a2a20', wx, wallTop + 12, 16, 14); for (let i = 1; i < 4; i++) rect('#6b4423', wx + i * 4, wallTop + 12, 1.4, 14); rect('#a89a86', wx - 2, wallTop + 26, 20, 3); }
  else { const wx = px + 8; rect('#3a2a20', wx, wallTop + 10, 12, 12); for (let i = 1; i < 3; i++) rect('#6b4423', wx + i * 4, wallTop + 10, 1.4, 12); }
  if (hash(b.x, b.y) < 0.5) { ell('#b8693c', px + w - 10, base - 4, 6, 5); circ('#d02a2a', px + w - 12, base - 11, 2.6); circ('#f7c623', px + w - 8, base - 12, 2.2); }
  tinta(px + 4, wallTop, w - 8, base - wallTop);
}
// Casa maya (na): muro encalado con esquinas redondeadas, techo de palma alto y empinado,
// franja roja y puerta al centro.
function casaMayaCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h, wallTop = base - Math.max(30, h * 0.42);
  ell('rgba(30,22,16,.2)', px + w/2, base + 2, w/2 + 6, 6);
  ctx.fillStyle = '#f2ede4'; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(px + 6, wallTop, w - 12, base - wallTop, [4, 4, 14, 14]); else ctx.rect(px + 6, wallTop, w - 12, base - wallTop); ctx.fill();
  ctx.strokeStyle = 'rgba(26,20,16,.75)'; ctx.lineWidth = 1.5; ctx.stroke();
  rect('#b5352a', px + 8, base - 10, w - 16, 4);
  rect('#2a1a10', px + w/2 - 8, base - 26, 16, 26); ctx.fillStyle = '#2a1a10'; ctx.beginPath(); ctx.arc(px + w/2, base - 26, 8, Math.PI, 0); ctx.fill();
  // palma
  const peak = py - 18;
  ctx.fillStyle = '#9a7a3a'; ctx.beginPath(); ctx.moveTo(px, wallTop + 8); ctx.lineTo(px + 16, peak); ctx.lineTo(px + w - 16, peak); ctx.lineTo(px + w, wallTop + 8); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip(); for (let yy = peak; yy < wallTop + 8; yy += 6) { ctx.strokeStyle = 'rgba(70,50,20,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, yy); ctx.lineTo(px + w, yy + 2); ctx.stroke(); } for (let x = px; x < px + w; x += 5) { ctx.strokeStyle = 'rgba(190,160,90,.4)'; ctx.beginPath(); ctx.moveTo(x, wallTop + 8); ctx.lineTo(x + 1, wallTop + 2); ctx.stroke(); } ctx.restore();
  ctx.strokeStyle = 'rgba(26,20,16,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px, wallTop + 8); ctx.lineTo(px + 16, peak); ctx.lineTo(px + w - 16, peak); ctx.lineTo(px + w, wallTop + 8); ctx.closePath(); ctx.stroke();
  rect('#6b4423', px + 14, peak - 3, w - 28, 4);
  ell('#3f8f30', px + 4, base - 4, 7, 5); circ('#e8501e', px + 4, base - 8, 2);
}
const _drawTownHouseZonas = drawTownHouse;
drawTownHouse = function (b) {
  if (b.t === 'casita' && b.x >= 360 && b.x <= 400 && b.y >= 36) return casaEspCdm(b);
  if (b.t === 'casita' && b.x >= 540) return casaMayaCdm(b);
  return _drawTownHouseZonas(b);
};
drawCasaEsp = function (b) { casaEspCdm(b); };
// Iglesia: zócalo de piedra, techo de teja, contorno de tinta y cruz atrial.
const _drawIglesiaZonas = drawIglesia;
drawIglesia = function (b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h;
  _drawIglesiaZonas(b);
  rect('#a89a86', px + 6, base - 10, w - 12, 10); for (let x = px + 8; x < px + w - 8; x += 12) rect('rgba(60,45,30,.25)', x, base - 10, 1, 10);
  ctx.save(); ctx.beginPath(); ctx.moveTo(px + 2, py + 38); ctx.lineTo(px + w/2 - 20, py + 14); ctx.lineTo(px + w/2 + 20, py + 14); ctx.lineTo(px + w - 2, py + 38); ctx.closePath(); ctx.clip();
  for (let yy = py + 14; yy < py + 40; yy += 5) for (let x = px + (Math.floor(yy / 5) % 2) * 4; x < px + w; x += 8) { ctx.fillStyle = 'rgba(120,40,20,.3)'; ctx.beginPath(); ctx.arc(x, yy + 4, 3.6, Math.PI, 0); ctx.fill(); }
  ctx.restore();
  tinta(px + 6, py + 34, w - 12, h - 34); tinta(px + w/2 - 16, py - 40, 32, 80);
  const cx = px + w + 18; rect('#a89a86', cx - 8, base - 8, 16, 8); rect('#e8e2d4', cx - 2, base - 40, 4, 32); rect('#e8e2d4', cx - 9, base - 32, 18, 4); tinta(cx - 2, base - 40, 4, 32, .6);
};
// Gran pirámide de Kukulcán: cabezas de serpiente grandes al pie de la escalinata, templo con
// franja roja y contorno de tinta en los cuerpos.
const _drawCastilloZonas = drawCastillo;
drawCastillo = function (b) {
  _drawCastilloZonas(b);
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, base = py + h, steps = 9;
  for (let i = 0; i < steps; i++) { const iw = w - i * (w * 0.08), ix = px + (w - iw) / 2, iy = base - (i + 1) * 20; ctx.strokeStyle = 'rgba(26,20,16,.45)'; ctx.lineWidth = 1; ctx.strokeRect(ix + .5, iy + .5, iw - 1, 20); }
  const sw = 46, sx = px + w/2 - sw/2;
  cabezaSerpiente(sx - 4, base, -1, '#b8ab8a', 1.4); cabezaSerpiente(sx + sw + 4, base, 1, '#b8ab8a', 1.4);
  const tw = w * 0.32, tx = px + w/2 - tw/2, ty = base - steps * 20 - 34;
  rect('#b5352a', tx, ty + 6, tw, 8); for (let k = 0; k < 5; k++) rect('#f2c84a', tx + 6 + k * (tw - 12) / 4, ty + 8, 4, 4);
  tinta(tx, ty, tw, 34);
};
