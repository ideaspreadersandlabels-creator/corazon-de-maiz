// Íconos estilo códice en lugar de emojis (sólo donde el juego no tenía ya un dibujo propio).
const ICONO_IMG = new Map();
function iconoImg(e) {
  let im = ICONO_IMG.get(e);
  if (!im) {
    im = new Image(); ICONO_IMG.set(e, im);
    im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 64; c.getContext('2d').drawImage(im, 0, 0, 64, 64); ICONO_IMG.set(e, c); } catch (er) {} };
    im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(CdmIconos.svg(e));
  }
  return im instanceof HTMLCanvasElement ? im : null;
}
for (const e of CdmIconos.LISTA) if (!ICON_DRAW[e]) {
  iconoImg(e);
  ICON_DRAW[e] = (cx, cy) => { const c = iconoImg(e); if (c) ctx.drawImage(c, cx - 13, cy - 13, 26, 26); else text(e, cx, cy + 8, 22, '#000', 'center', false); };
}
