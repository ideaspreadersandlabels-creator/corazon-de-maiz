// Dibuja un instante exacto del intro (capítulo i, segundo t de la canción) para grabar
// video cuadro por cuadro. Mismo arte y animaciones que el intro, sin interfaz.
"use strict";
(function () {
  const X = window.TlaxTex, { CH, CAPTIONS, BEATS } = window.CdmStory;
  const root = document.documentElement.style;
  root.setProperty('--deco', `url(${X.decoTile()})`); root.setProperty('--plain', `url(${X.plainTiles()})`); root.setProperty('--cobalt', `url(${X.cobaltTile()})`);
  const stage = document.getElementById('stage');
  stage.innerHTML = `<div class="chaps"></div><div class="cx cap"><div class="cap__y"></div><div class="cap__t"></div></div>`;
  const chaps = stage.querySelector('.chaps'), cap = stage.querySelector('.cap'), capY = cap.querySelector('.cap__y'), capT = cap.querySelector('.cap__t');
  let cur = -1, el = null;
  function build(i) {
    const c = CH[i], p = c.build(abs => abs - c.t0), [px0, px1, z0, z1, origin] = c.cam, [ox, oy] = origin.split(' ');
    const plane = (k, d) => p[k] ? `<div class="plane" style="--d:${d}">${p[k]}</div>` : '';
    chaps.innerHTML = `<div class="chap on cut" style="--dur:${(c.t1 - c.t0).toFixed(2)}s;--px0:${px0};--px1:${px1};--z0:${z0};--z1:${z1};--ox:${ox};--oy:${oy}">${plane('sky', 0)}${plane('far', .2)}${plane('mid', .45)}${plane('near', .7)}${plane('front', 1)}${p.ui ? `<div class="ui">${p.ui}</div>` : ''}</div>`;
    el = chaps.firstElementChild; cur = i;
    stage.style.setProperty('--punch', c.punch || 0);
  }
  window.renderAt = (i, t, z = 1) => {
    if (i !== cur) build(i);
    document.body.style.setProperty('--z', z);
    el.getAnimations({ subtree: true }).forEach(a => { a.pause(); a.currentTime = (t - CH[i].t0) * 1000; });
    // Golpe de tambor.
    let b = 0; while (b + 1 < BEATS.length && BEATS[b + 1] <= t) b++;
    const ph = t - BEATS[b]; stage.style.setProperty('--beat', (ph >= 0 && ph < .42 ? (1 - ph / .42) ** 2 : 0).toFixed(3));
    // Narración escrita letra por letra, igual que en el intro (28 ms por letra).
    let k = -1; CAPTIONS.forEach((c, j) => { if (t >= c.t) k = j; });
    const c = CAPTIONS[k], end = k >= 0 ? Math.min(CAPTIONS[k + 1] ? CAPTIONS[k + 1].t : Infinity, c.t + (c.hold || 15)) : 0;
    const on = k >= 0 && t < end && t - c.t > 0;
    cap.style.opacity = on ? Math.min(1, (t - c.t) / .4, (end - t) / .4) : 0;
    if (on) { capY.textContent = CH[i].label; const n = Math.floor((t - c.t) / .028), chars = [...c.text]; capT.innerHTML = chars.map((ch, j) => `<i style="opacity:${j < n ? 1 : 0}">${ch}</i>`).join(''); }
  };
})();
