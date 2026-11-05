// Animales con el arte de CdmAnimales.
const ANI_IMG = new Map();
function aniDibuja(t, op, x, y, f, k) {
  const key = t + JSON.stringify(op), [w, h, pie, cx] = CdmAnimales.TAM[t], p = CdmAnimales.PAD[t] || 0;
  let im = ANI_IMG.get(key);
  if (!im) {
    im = new Image(); ANI_IMG.set(key, im);
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = w * 2; c.height = (h + p) * 2; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ANI_IMG.set(key, c); } catch (e) {} };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(CdmAnimales.svg(t, op));
  }
  if (!(im instanceof HTMLCanvasElement)) return false;
  ctx.save(); ctx.translate(x, y); ctx.scale(f < 0 ? -k : k, k); ctx.drawImage(im, -cx, -(pie + p), w, h + p); ctx.restore();
  return true;
}
const corazonAni = (x, y) => { ctx.globalAlpha = 0.8; text('❤', x, y, 10, '#ff6b8a', 'center', false); ctx.globalAlpha = 1; };
const cuadroAni = (mov, x) => mov ? (Math.sin(T * 12 + x) > 0 ? 1 : 2) : 0;
const _drawChickenAni = drawChicken;
drawChicken = function (c) {
  if (inking) return;
  const kid = !isAdult('guajolote', c), walking = c.wait <= 0;
  const op = { fr:cuadroAni(walking, c.x), abanico:!kid && !walking && Math.sin(T * 0.7 + c.x) > 0.7, pica:!walking && Math.sin(T * 3 + c.y) > 0.8 };
  if (!aniDibuja('guajolote', op, Math.round(c.x), Math.round(c.y), c.face, kid ? 0.46 : 0.78)) return _drawChickenAni(c);
  if (c.pet) corazonAni(c.x, c.y - 32);
};
const _drawRabbitAni = drawRabbit;
drawRabbit = function (a) {
  if (inking) return;
  const kid = !isAdult('conejo', a), hop = a.wait <= 0 && Math.abs(Math.sin(T * 10 + a.x)) > 0.5 ? 3 : 0;
  if (!aniDibuja('conejo', { salto:hop }, Math.round(a.x), Math.round(a.y), a.face, kid ? 0.48 : 0.74)) return _drawRabbitAni(a);
  if (a.pet) corazonAni(a.x, a.y - 26);
};
const _drawDuckAni = drawDuck;
drawDuck = function (a) {
  if (inking) return;
  const kid = !isAdult('pato', a), swim = S.ground[Math.floor((a.y - 2) / TS)]?.[Math.floor(a.x / TS)] === G.WATER;
  if (swim) { const w = (T + a.x) % 1; ctx.strokeStyle = `rgba(255,255,255,${0.5 * (1 - w)})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(a.x, a.y - 2, 10 + w * 6, 3 + w * 2, 0, 0, Math.PI * 2); ctx.stroke(); }
  const y = Math.round(a.y) + (swim ? 6 + Math.sin(T * 2 + a.x) : 0);
  if (!aniDibuja('pato', { cria:kid, nada:swim, fr:swim ? 0 : cuadroAni(a.wait <= 0, a.x) }, Math.round(a.x), y, a.face, kid ? 0.46 : 0.74)) return _drawDuckAni(a);
  if (a.pet) corazonAni(a.x, a.y - 26);
};
const _drawDeerAni = drawDeer;
drawDeer = function (d) {
  if (inking) return;
  if (d.hurt > 0 || !aniDibuja('venado', { fr:cuadroAni(d.moving, d.x), macho:!!d.buck }, Math.round(d.x), Math.round(d.y), d.face, 0.78)) return _drawDeerAni(d);
};
const _drawHorseAni = drawHorse;
drawHorse = function (x, y, dir, moving, col = '#7a4a22', mane = '#2a1a10') {
  if (!aniDibuja('caballo', { fr:cuadroAni(moving, x), col, crin:mane }, x, y, dir === 'left' ? -1 : 1, 0.66)) return _drawHorseAni(x, y, dir, moving, col, mane);
};
const _drawObjInnerAni = drawObjInner;
drawObjInner = function (x, y, o, px, py) {
  if (o.k === 'bisonte' && aniDibuja('bisonte', { fr:0 }, px + 16, py + 30, (x + y) % 2 ? -1 : 1, 0.72)) return;
  _drawObjInnerAni(x, y, o, px, py);
};
