// Intro player: crossfades the seven murals, types each caption, Enter/click to
// continue, Esc to jump to the title card. Fires `cdm:intro-end` when finished.
"use strict";
(function () {
  const X = window.TlaxTex, { SCENES } = window.TlaxIntro, F = window.TlaxFigs4, { CAST, PLAYER } = window.TlaxChars;
  const root = document.documentElement.style;
  root.setProperty('--deco', `url(${X.decoTile()})`); root.setProperty('--plain', `url(${X.plainTiles()})`); root.setProperty('--cobalt', `url(${X.cobaltTile()})`);

  // Logo: a heart of criollo maize kernels between two husk leaves.
  const pal = ['#f2c94c', '#f2c94c', '#f2c94c', '#e9a83a', '#c0392b', '#3d63b8', '#f6efe0', '#f2c94c', '#7a2a6a'];
  let kern = '', n = 0;
  for (let r = 0, y = 28; y < 96; y += 7, r++) for (let x = 18 + (r % 2) * 4; x < 104; x += 8) kern += `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="3.1" fill="${pal[(n++ * 7 + r * 3) % pal.length]}" stroke="#1a1410" stroke-width="1"/>`;
  const heart = `<svg viewBox="0 0 120 110"><path d="M60 104 C 20 92 2 60 18 30 C 26 14 44 8 50 26" fill="#7cb04a" stroke="#1a1410" stroke-width="3.4"/><path d="M60 104 C 100 92 118 60 102 30 C 94 14 76 8 70 26" fill="#5fa040" stroke="#1a1410" stroke-width="3.4"/><path d="M60 96 C 30 78 16 58 20 40 C 24 24 44 18 60 34 C 76 18 96 24 100 40 C 104 58 90 78 60 96 Z" fill="#e9b33e" stroke="#1a1410" stroke-width="4"/><clipPath id="ih"><path d="M60 92 C 32 76 20 58 23 41 C 27 27 44 22 60 38 C 76 22 93 27 97 41 C 100 58 88 76 60 92 Z"/></clipPath><g clip-path="url(#ih)">${kern}</g><path d="M60 34 C 58 18 64 6 72 2" stroke="#e9b33e" stroke-width="3" fill="none"/><path d="M60 34 C 54 20 46 12 38 10" stroke="#d39a26" stroke-width="2.4" fill="none"/></svg>`;

  const stage = document.getElementById('stage');
  const person = p => p === 'PLAYER' ? PLAYER : typeof p === 'number' ? CAST[p] : p;
  const layers = SCENES.map((s, i) => {
    const el = document.createElement('div'); el.className = 'layer';
    el.style.setProperty('--pan', i % 2 ? '-14px' : '14px');
    el.innerHTML = s.scene() + s.figs.map(([p, x, b, h, paint]) => `<div class="fig${paint ? ' fig--paint' : ''}${x > 50 && !s.title && paint ? ' fig--flip' : ''}" style="left:${x}%;bottom:${b}%;height:${h}%">${F.borgia(person(p))}</div>`).join('')
      + (s.title ? `<div class="cx title">${heart}<div><div class="title__n">Corazón de Maíz</div><div class="title__t">Tlaxcallan · año 1-Ácatl · 1519</div></div></div>` : '');
    stage.appendChild(el); return el;
  });
  stage.insertAdjacentHTML('beforeend', `<div class="start">Enter · comenzar</div>
    <div class="cx cap"><div class="cap__y"></div><div class="cap__t"></div><div class="cap__more">▼</div></div>
    <div class="dots">${SCENES.map(() => '<i></i>').join('')}</div>
    <div class="keys"><span><kbd>Enter</kbd>seguir</span><span><kbd>Esc</kbd>saltar</span></div>`);
  const cap = stage.querySelector('.cap'), capY = cap.querySelector('.cap__y'), capT = cap.querySelector('.cap__t'), dots = [...stage.querySelectorAll('.dots i')], start = stage.querySelector('.start');

  let cur = -1, typing = null, ended = false;
  function type(text) {
    clearInterval(typing);
    capT.innerHTML = [...text].map(ch => `<i>${ch === ' ' ? ' ' : ch}</i>`).join('');
    const chars = [...capT.children]; let k = 0; cap.classList.remove('done');
    typing = setInterval(() => { if (k < chars.length) chars[k++].style.opacity = 1; else finish(); }, 26);
  }
  function finish() { clearInterval(typing); typing = null; capT.querySelectorAll('i').forEach(c => c.style.opacity = 1); cap.classList.add('done'); if (cur === SCENES.length - 1) start.classList.add('on'); }
  function go(i) {
    if (i >= SCENES.length) { if (!ended) { ended = true; window.dispatchEvent(new CustomEvent('cdm:intro-end')); } return; }
    cur = i; layers.forEach((l, j) => l.classList.toggle('on', j === i)); dots.forEach((d, j) => d.classList.toggle('on', j === i));
    start.classList.remove('on'); capY.textContent = SCENES[i].year; type(SCENES[i].text);
  }
  const next = () => typing ? finish() : go(cur + 1);
  addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); } else if (e.key === 'Escape') go(SCENES.length - 1); });
  stage.addEventListener('click', next);
  window.addEventListener('cdm:intro-end', () => { start.textContent = '¡Que empiece tu historia!'; });

  const fit = () => { const k = Math.min(innerWidth / 960, innerHeight / 540); stage.style.transform = `translate(-50%, -50%) scale(${k})`; };
  addEventListener('resize', fit); fit();
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => go(0));
  window.CdmIntro = { go, next };
})();
