// Hacha, pico y cuchillo (técpatl) estilo códice, del color de su material; se ven en la barra y en la mano.
(function () {
  const K = '#1a1410', I = `stroke="${K}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"`;
  const sh = (h, k) => '#' + [1, 3, 5].map(i => Math.max(0, Math.min(255, Math.round(parseInt(h.slice(i, i + 2), 16) * k))).toString(16).padStart(2, '0')).join('');
  const mango = `<path d="M8 36 L29 7" stroke="${K}" stroke-width="5.4" stroke-linecap="round"/><path d="M8 36 L29 7" stroke="#8a5a30" stroke-width="3.4" stroke-linecap="round"/><path d="M9.6 33 L27 9" stroke="#b07a48" stroke-width="1" stroke-linecap="round"/>`;
  const amarre = (x, y) => `<path d="M${x - 3} ${y - 1} l5 3 M${x - 2} ${y - 3} l5 3" stroke="#e8d8b0" stroke-width="1.6"/>`;
  const A = {
    hacha: m => mango + `<path d="M22 6 Q34 2 38 12 Q34 18 26 18 Q24 12 22 6Z" fill="${m}" ${I}/><path d="M26 7 Q33 6 35 11" stroke="${sh(m, 1.35)}" stroke-width="1.6" fill="none"/>` + amarre(27, 11),
    pico: m => mango + `<path d="M12 6 Q26 -1 38 10 Q30 6 27 9 Q24 8 22 11 Q18 7 12 6Z" fill="${m}" ${I}/><path d="M16 6 Q25 2 33 7" stroke="${sh(m, 1.35)}" stroke-width="1.4" fill="none"/>` + amarre(26, 10),
    hoz: m => `<path d="M10 34 L18 24" stroke="${K}" stroke-width="7" stroke-linecap="round"/><path d="M10 34 L18 24" stroke="#8a5a30" stroke-width="5" stroke-linecap="round"/><path d="M11 31 l4 2 M13 28 l4 2" stroke="#e8d8b0" stroke-width="1.4"/><path d="M17 25 Q20 10 34 4 Q30 16 21 28Z" fill="${m}" ${I}/><path d="M21 22 Q24 12 31 7" stroke="${sh(m, 1.4)}" stroke-width="1.4" fill="none"/>`,
  };
  const IMG = new Map();
  const img = (id, m) => { const key = id + m; let im = IMG.get(key);
    if (!im) { im = new Image(); IMG.set(key, im);
      im.onload = () => { try { const c = document.createElement('canvas'); c.width = c.height = 80; c.getContext('2d').drawImage(im, 0, 0, 80, 80); IMG.set(key, c); try { ICON_CACHE.clear(); } catch (e2) {} } catch (e) {} };
      im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="80" height="80">${A[id](m)}</svg>`); }
    return im instanceof HTMLCanvasElement ? im : null; };
  for (const id of Object.keys(A)) for (const m of METALS) img(id, m.col);
  const _drawToolIconHerr = drawToolIcon;
  drawToolIcon = function (id, lvl, cx, cy) {
    if (A[id]) { const c = img(id, METALS[lvl]?.col || METALS[0].col); if (c) { ctx.drawImage(c, cx - 18, cy - 21, 38, 38); return; } }
    return _drawToolIconHerr(id, lvl, cx, cy);
  };
})();
