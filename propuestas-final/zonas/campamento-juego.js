// Campamento apache y galeón con más detalle (contorno de tinta, texturas y vida).
function wickiupCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, cx = px + w/2, base = py + h, top = py - 16;
  ctx.strokeStyle = 'rgba(26,20,16,.8)'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx, top); ctx.quadraticCurveTo(px - 4, py + 8, px + 2, base - 3); ctx.lineTo(px + w - 2, base - 3); ctx.quadraticCurveTo(px + w + 4, py + 8, cx, top); ctx.stroke();
  // manojos de zacate
  for (let i = 0; i < 26; i++) { const t = hash(i, b.x), yy = py + 6 + hash(b.y, i) * (base - py - 14), half = (w / 2 - 6) * Math.min(1, (yy - top) / (base - top) * 1.3), x = cx + (t - 0.5) * 2 * half;
    ctx.strokeStyle = i % 2 ? 'rgba(220,190,130,.6)' : 'rgba(90,60,30,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, yy); ctx.lineTo(x + 2, yy + 6); ctx.stroke(); }
  // cuero en la entrada con diseño geométrico
  ctx.fillStyle = '#b08458'; ctx.beginPath(); ctx.moveTo(cx - 9, base - 2); ctx.lineTo(cx - 9, base - 18); ctx.quadraticCurveTo(cx, base - 26, cx + 9, base - 18); ctx.lineTo(cx + 9, base - 2); ctx.closePath(); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1.2; ctx.stroke();
  ctx.fillStyle = '#3a2418'; ctx.beginPath(); ctx.moveTo(cx - 9, base - 2); ctx.lineTo(cx - 1, base - 2); ctx.lineTo(cx - 9, base - 14); ctx.fill();
  for (let i = 0; i < 3; i++) { ctx.fillStyle = i % 2 ? '#b5352a' : '#1a1410'; ctx.beginPath(); ctx.moveTo(cx - 6 + i * 5, base - 8); ctx.lineTo(cx - 3.5 + i * 5, base - 13); ctx.lineTo(cx - 1 + i * 5, base - 8); ctx.fill(); }
  // humo por el agujero de arriba
  for (let i = 0; i < 3; i++) { const t = (T * 0.4 + i / 3 + b.x * 0.1) % 1; circ(`rgba(220,215,205,${0.35 * (1 - t)})`, cx + Math.sin(T + i) * 4, top - 4 - t * 34, 3 + t * 6); }
  // canasta de carga con flecos y leña
  const kx = px + w - 6, ky = base;
  ctx.fillStyle = '#c8a060'; ctx.beginPath(); ctx.moveTo(kx - 8, ky - 16); ctx.lineTo(kx + 8, ky - 16); ctx.lineTo(kx + 4, ky); ctx.lineTo(kx - 4, ky); ctx.closePath(); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1; ctx.stroke();
  rect('#b5352a', kx - 7, ky - 11, 14, 2); rect('#1a1410', kx - 6, ky - 7, 12, 1.4);
  for (let i = 0; i < 4; i++) rect('#8a5a30', kx - 7 + i * 4, ky - 2, 1, 5);
  for (let i = 0; i < 3; i++) { rect('#6b4423', px + 2 + i * 3, base - 6 - i * 2, 14, 3); }
}
function ramadaCdm(b) {
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS;
  // pieles secándose y carne colgada
  ctx.strokeStyle = '#6b4423'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px + 10, py + 16); ctx.lineTo(px + w - 10, py + 16); ctx.stroke();
  for (let i = 0; i < 4; i++) { const x = px + 22 + i * (w - 44) / 3; ctx.fillStyle = i % 2 ? '#b08458' : '#c89a6a'; ctx.beginPath(); ctx.moveTo(x - 8, py + 16); ctx.lineTo(x + 8, py + 16); ctx.lineTo(x + 6, py + 34); ctx.lineTo(x, py + 30); ctx.lineTo(x - 6, py + 34); ctx.closePath(); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1; ctx.stroke(); }
  // olla de barro y metate
  ell('rgba(0,0,0,.2)', px + w / 2, py + h - 2, 10, 3); ctx.fillStyle = '#9a6a3a'; ctx.beginPath(); ctx.ellipse(px + w / 2, py + h - 10, 9, 8, 0, 0, 7); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1.2; ctx.stroke(); rect('#1a1410', px + w / 2 - 9, py + h - 12, 18, 1.6);
  ctx.strokeStyle = 'rgba(26,20,16,.7)'; ctx.lineWidth = 1.3; ctx.strokeRect(px + 4.5, py + 2.5, w - 9, 9);
}
const _drawGaleonCdm = drawGaleon;
drawGaleon = function (b) {
  _drawGaleonCdm(b);
  const px = b.x*TS, py = b.y*TS, w = b.w*TS, h = b.h*TS, bob = Math.sin(T * 1.2) * 3, roll = Math.sin(T * 0.9) * 0.015;
  ctx.save(); ctx.translate(px + w/2, py + h - 40 + bob); ctx.rotate(roll);
  // contorno del casco, tablones y franja de color
  ctx.save(); ctx.beginPath(); ctx.moveTo(-w/2, -8); ctx.lineTo(w/2 + 10, -14); ctx.quadraticCurveTo(w/2 - 10, 30, w/2 - 40, 34); ctx.lineTo(-w/2 + 30, 34); ctx.quadraticCurveTo(-w/2 - 4, 24, -w/2, -8); ctx.closePath(); ctx.clip();
  for (let y = -6; y < 34; y += 6) { ctx.strokeStyle = 'rgba(40,24,12,.4)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-w/2 - 10, y); ctx.lineTo(w/2 + 20, y - 2); ctx.stroke(); }
  rect('#b5352a', -w/2 - 4, 18, w + 30, 4); rect('#f2c84a', -w/2 - 4, 22, w + 30, 2);
  ctx.restore();
  ctx.strokeStyle = 'rgba(26,20,16,.85)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-w/2, -8); ctx.lineTo(w/2 + 10, -14); ctx.quadraticCurveTo(w/2 - 10, 30, w/2 - 40, 34); ctx.lineTo(-w/2 + 30, 34); ctx.quadraticCurveTo(-w/2 - 4, 24, -w/2, -8); ctx.closePath(); ctx.stroke();
  // castillo de popa: ventanas con luz y faroles
  ctx.strokeStyle = 'rgba(26,20,16,.8)'; ctx.lineWidth = 1.5; ctx.strokeRect(-w/2 - 4, -40, 60, 34);
  const noche = S.time > 18 * 60 || S.time < 6 * 60;
  for (let i = 0; i < 3; i++) rect(noche ? '#ffcf80' : '#3a4a6a', -w/2 + 7 + i * 16, -29, 6, 8);
  for (const lx of [-w/2 - 6, -w/2 + 54]) { rect('#3a2a1a', lx, -52, 2, 12); rect('#c8a040', lx - 3, -58, 8, 8); circ(`rgba(255,${180 + Math.sin(T * 9 + lx) * 30},80,.9)`, lx + 1, -54, 2.4); if (noche) circ('rgba(255,190,90,.18)', lx + 1, -54, 14); }
  // mascarón de proa y bauprés
  ctx.strokeStyle = '#4a2f18'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(w/2 + 6, -14); ctx.lineTo(w/2 + 50, -40); ctx.stroke();
  ctx.fillStyle = '#c8a040'; ctx.beginPath(); ctx.moveTo(w/2 + 8, -10); ctx.quadraticCurveTo(w/2 + 22, -10, w/2 + 18, 2); ctx.quadraticCurveTo(w/2 + 10, 0, w/2 + 8, -10); ctx.fill(); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1; ctx.stroke();
  // estandarte de Castilla en la popa
  rect('#4a2f18', -w/2 + 2, -84, 3, 44);
  const fl = Math.sin(T * 3) * 3; ctx.save(); ctx.translate(-w/2 + 5, -84);
  ctx.fillStyle = '#b5352a'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, fl); ctx.lineTo(34, 22 + fl); ctx.lineTo(0, 22); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f2c84a'; ctx.fillRect(4, 4, 10, 6); ctx.fillRect(18, 12 + fl * .5, 10, 6); ctx.strokeStyle = TINTA_Z; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, fl); ctx.lineTo(34, 22 + fl); ctx.lineTo(0, 22); ctx.closePath(); ctx.stroke();
  ctx.restore();
  // tripulación en cubierta
  for (const [mx, c] of [[-20, '#7a2a2a'], [70, '#3a4a6a'], [160, '#6a5a3a']]) { circ('#d8b090', mx, -18, 4); rect(c, mx - 4, -14, 8, 8); rect('#2a2a2a', mx - 5, -23, 10, 3); }
  ctx.restore();
};
