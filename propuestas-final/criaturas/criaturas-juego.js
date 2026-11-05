// Integración de CdmCriaturas: guerreros mexicas, tarántula, serpiente y cangrejo.
const CRIA_IMG = new Map();
function criaDibuja(t, op, x, y, f, k) {
  const key = t + JSON.stringify(op), [w, h, pie, cx] = CdmCriaturas.TAM[t], p = CdmCriaturas.PAD[t] || 0;
  let im = CRIA_IMG.get(key);
  if (!im) { im = new Image(); CRIA_IMG.set(key, im);
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = w * 2; c.height = (h + p) * 2; c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); CRIA_IMG.set(key, c); } catch (e) {} };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(CdmCriaturas.svg(t, op)); }
  if (!(im instanceof HTMLCanvasElement)) return false;
  ctx.save(); ctx.translate(x, y); ctx.scale(f < 0 ? -k : k, k); ctx.drawImage(im, -cx, -(pie + p), w, h + p); ctx.restore();
  return true;
}
const _drawWarriorCria = drawWarrior;
drawWarrior = function (w) {
  if (!w || w.dead || w.aliadoMexica || inking) return _drawWarriorCria(w);
  const x = Math.round(w.x), y = Math.round(w.y), f = w.dir === 'left' ? -1 : 1;
  const op = { tipo:w.type === 'jaguar' ? 'jaguar' : 'aguila', fr:w.moving ? (Math.sin(T * 14 + x) > 0 ? 1 : 2) : 0, golpe:(w.swing || 0) > 0 ? 1 : 0 };
  ctx.save(); if (w.hurt > 0) ctx.globalAlpha = 0.5 + Math.sin(T * 60) * 0.4;
  const ok = criaDibuja('guerrero', op, x, y, f, 0.9);
  ctx.restore();
  if (!ok) return _drawWarriorCria(w);
  if (w.hp < WARRIOR.hp[w.type]) { rect('#2a1a0c', x - 12, y - 66, 24, 4); rect('#e04848', x - 12, y - 66, 24 * Math.max(0, w.hp) / WARRIOR.hp[w.type], 4); }
};
const _drawObjInnerCria = drawObjInner;
drawObjInner = function (x, y, o, px, py) {
  const mov = Math.sin(T * 6 + px) > 0 ? 1 : 0;
  if (o.k === 'spider' && criaDibuja('tarantula', { fr:mov }, px + 16, py + 28, 1, 0.9)) return;
  if (o.k === 'snake' && criaDibuja('serpiente', { fr:Math.floor(T * 4 + px) % 3 }, px + 16, py + 28, 1, 0.95)) return;
  if (o.k === 'cangrejo') { const sx = Math.sin(T * 2 + x * 3 + y) * 4; if (criaDibuja('cangrejo', { fr:mov }, px + 16 + sx, py + 28, 1, 0.8)) return; }
  _drawObjInnerCria(x, y, o, px, py);
};
