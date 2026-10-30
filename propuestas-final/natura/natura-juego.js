// Integración: árboles, piedras y plantas con el arte de CdmNatura, y techos de zacate nuevos.
const NAT_IMG = new Map();
function natImg(key, mk, w, h) {
  let im = NAT_IMG.get(key);
  if (!im) {
    im = new Image(); NAT_IMG.set(key, im);
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = w; c.height = h; c.getContext('2d').drawImage(im, 0, 0, w, h); NAT_IMG.set(key, c); } catch (e) {} };
    try { im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(mk()); } catch (e) { console.warn('[natura]', key, e); }
  }
  return im instanceof HTMLCanvasElement ? im : null;
}
function natDibuja(tipo, op, key, px, py, k, sway) {
  const [w, h] = CdmNatura.TAM[tipo], im = natImg(key, () => CdmNatura.svg(tipo, op), w * 2, h * 2);
  if (!im) return false;
  const W = w * k, H = h * k;
  ctx.save(); ctx.translate(px + 16, py + 30);
  if (sway) ctx.transform(1, 0, -sway * 0.025, 1, 0, 0);
  ctx.drawImage(im, -W / 2, -H + 4 * k, W, H);
  ctx.restore();
  return true;
}
const FRUTA_ESTACION = ['#ff9ac0', '#e2403a', '#e8781e', '#c4a574'];
const _drawObjInnerNatura = drawObjInner;
drawObjInner = function (x, y, o, px, py) {
  let ok = false;
  try {
    const L = seasonLook(), si = seasonIdx(), h = hash(x, y), nieve = !!L.frost || S.ground[y]?.[x] === G.SNOW, v3 = Math.floor(h * 3) % 3;
    switch (o.k) {
      case 'tree':
        if (x < FARM_W) ok = natDibuja('frutal', { fruta:FRUTA_ESTACION[si], flor:si === 0 ? '#ffb0d0' : null, n:si === 3 ? 2 : 5 }, 'fr' + si, px, py, 0.72, wind(px, py));
        else ok = natDibuja('arbol', { c:L.tree, flor:si === 0 ? (L.blossom || '#ffb0d0') : null, desnudo:si === 3, v:h < 0.5 ? 0 : 1 }, `ar${si}${h < 0.5 ? 0 : 1}`, px, py, 0.72, wind(px, py));
        break;
      case 'pine': ok = natDibuja('pino', { nieve }, 'pi' + (nieve ? 1 : 0), px, py, 0.75, wind(px, py) * 0.5); break;
      case 'palm': ok = natDibuja('palma', {}, 'pa', px, py, 0.72, wind(px, py)); break;
      case 'bush': ok = natDibuja('arbusto', { c:L.tree, flor:si < 2 && h > 0.5 ? '#f2c84a' : null }, `bu${si}${si < 2 && h > 0.5 ? 1 : 0}`, px, py, 0.72, wind(px, py) * 0.5); break;
      case 'weed': ok = natDibuja('zacate', { v:v3, c:L.grass[0] }, `ze${si}${v3}`, px, py, 0.85, wind(px, py)); break;
      case 'rock': ok = natDibuja('piedra', { v:v3 }, 'pd' + v3, px, py, 0.8, 0); if (ok && nieve) ell('rgba(248,251,255,.92)', px + 16, py + 17, 9, 3); break;
      case 'cactus': ok = natDibuja('cactus', { v:v3 }, 'ca' + v3, px, py, 0.68, 0); break;
    }
  } catch (e) { ok = false; }
  if (!ok) _drawObjInnerNatura(x, y, o, px, py);
};
// Techo de zacate: hileras de manojos encimados, fleco en el alero, contorno de tinta y una
// olla de barro en la cumbrera, como en los jacales de la región.
thatch = function (x0, yBase, w, peak, col = '#c9a24e', dark = '#a8823a') {
  const L = x0 - 10, R = x0 + w + 10, cx = x0 + w / 2, H = yBase - peak;
  ctx.save();
  ctx.beginPath(); ctx.moveTo(L, yBase); ctx.lineTo(cx, peak); ctx.lineTo(R, yBase); ctx.closePath();
  const g = ctx.createLinearGradient(0, peak, 0, yBase); g.addColorStop(0, anMix(col, 0.12)); g.addColorStop(1, anMix(col, -0.2));
  ctx.fillStyle = g; ctx.fill(); ctx.clip();
  const filas = Math.max(3, Math.round(H / 8));
  for (let r = 0; r < filas; r++) {
    const yy = peak + H * (r + 1) / filas, half = (R - L) / 2 * (r + 1) / filas, off = (r % 2) * 4;
    for (let x = cx - half - 8 + off; x < cx + half + 8; x += 8) {
      ctx.fillStyle = ((x + r * 3) / 8 | 0) % 3 ? anMix(col, -0.04) : anMix(col, 0.06);
      ctx.beginPath(); ctx.moveTo(x, yy - H / filas - 1); ctx.lineTo(x + 8, yy - H / filas - 1); ctx.lineTo(x + 8, yy - 3); ctx.quadraticCurveTo(x + 4, yy + 2, x, yy - 3); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = anMix(dark, -0.1); ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x + 8, yy - 3); ctx.quadraticCurveTo(x + 4, yy + 2, x, yy - 3); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,240,200,.25)'; ctx.beginPath(); ctx.moveTo(x + 2, yy - H / filas + 1); ctx.lineTo(x + 3, yy - 4); ctx.stroke();
    }
  }
  ctx.restore();
  // fleco del alero
  ctx.strokeStyle = anMix(dark, -0.05); ctx.lineWidth = 1;
  for (let x = L + 1; x < R - 1; x += 3) { ctx.beginPath(); ctx.moveTo(x, yBase - 1); ctx.lineTo(x + 0.5, yBase + 3 + ((x * 7) % 3)); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(26,20,16,.8)'; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(L, yBase); ctx.lineTo(cx, peak); ctx.lineTo(R, yBase); ctx.closePath(); ctx.stroke();
  // cumbrera con amarre y olla
  rect(dark, cx - 6, peak + 2, 12, 4); rect('#6b4423', cx - 1, peak, 2, 6);
  ctx.fillStyle = '#b8693c'; ctx.strokeStyle = '#1a1410'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(cx, peak - 3, 4.4, 4, 0, 0, 7); ctx.fill(); ctx.stroke(); rect('#b8693c', cx - 2, peak - 9, 4, 3);
};
try { TERRAIN_CACHE.clear(); } catch (e) {}
// El caché de objetos (R27) guardaba el dibujo viejo y recortaba lo alto: estos tipos se dibujan directo.
const NAT_TIPOS = new Set(['tree', 'rock', 'pine', 'palm', 'cactus', 'bush', 'weed']);
const _drawObjNatura = drawObj;
drawObj = function (x, y, o) {
  if (o && NAT_TIPOS.has(o.k) && typeof _drawObjCacheR27 === 'function') return _drawObjCacheR27(x, y, o);
  return _drawObjNatura(x, y, o);
};
try { R27_OBJ_CACHE.clear(); } catch (e) {}
// Tu casa por fuera: fachada cerrada de adobe encalado con zócalo rojo (o de piedra labrada en la
// casa de piedra), puerta con dintel y cortina de petate, ventanas con celosía y ristras de chile.
function casaJugadorCdm(f) {
  const { x, y, w, h, stone } = f, noche = S.time > 18 * 60 || S.time < 6 * 60, base = y + h;
  if (stone) {
    rect('#b3ab99', x, y, w, h);
    for (let r = 0; r * 10 < h; r++) for (let c = 0; c * 24 < w + 24; c++) { const bx = x + c * 24 - (r % 2) * 12; rect('rgba(70,60,45,.28)', Math.max(x, bx), y + r * 10, 1, 10); }
    for (let r = 1; r * 10 < h; r++) rect('rgba(70,60,45,.28)', x, y + r * 10, w, 1);
    rect('#a8392b', x, y + 6, w, 6); greca(x, y + 7, w, '#f2c84a', '#a8392b');
  } else {
    rect('#f0e4cc', x, y, w, h);
    for (let i = 0; i < 30; i++) rect('rgba(150,110,70,.14)', x + hash(i, 3) * (w - 10), y + hash(3, i) * (h - 6), 8, 2);
    const z = Math.round(h * 0.36); rect('#b5543a', x, base - z, w, z); rect('#f4ecd8', x, base - z - 2, w, 2);
    greca(x + 2, base - z + 4, w - 4, '#f2c84a', '#b5543a');
  }
  const dw = 30, dh = Math.min(48, h * 0.7), dx = x + w / 2 - dw / 2;
  rect('#2a1a10', dx, base - dh, dw, dh);
  if (noche) rect('rgba(255,170,70,.5)', dx + 2, base - dh + 14, dw - 4, dh - 14);
  petate(dx + 2, base - dh + 2, dw - 4, 14);
  rect('#6b4423', dx - 6, base - dh - 6, dw + 12, 6); rect('#8a5a30', dx - 6, base - dh - 6, dw + 12, 2);
  for (const wx of [x + w * 0.2 - 12, x + w * 0.8 - 12]) {
    const wy = y + h * 0.28; rect('#6b4423', wx - 2, wy - 2, 28, 20); rect(noche ? '#ffcf80' : '#2a1a10', wx, wy, 24, 16);
    for (let i = 1; i < 4; i++) rect('#8a5a30', wx + i * 6, wy, 1.6, 16); rect('#8a5a30', wx, wy + 7, 24, 1.6);
  }
  for (const rx of [dx - 14, dx + dw + 10]) for (let i = 0; i < 5; i++) ell('#c0261e', rx + Math.sin(i) * 1.4, base - dh + 4 + i * 6, 2.6, 3.2);
  ctx.strokeStyle = 'rgba(26,20,16,.75)'; ctx.lineWidth = 1.6; ctx.strokeRect(x + .8, y + .8, w - 1.6, h - 1.6);
}
