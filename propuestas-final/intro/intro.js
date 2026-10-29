// Intro player synced to the song: each mural starts at a cue in the track,
// captions type in, the sung line shows in the caption panel. Enter/click jumps
// to the next scene (and seeks the song), Esc jumps to the title, M mutes.
// Fires `cdm:intro-end` when the player presses Enter on the title.
"use strict";
(function () {
  const X = window.TlaxTex, { SCENES } = window.TlaxIntro, F = window.TlaxFigs4, { CAST, PLAYER } = window.TlaxChars, LYRICS = window.CdmLyrics || [];
  const root = document.documentElement.style;
  root.setProperty('--deco', `url(${X.decoTile()})`); root.setProperty('--plain', `url(${X.plainTiles()})`); root.setProperty('--cobalt', `url(${X.cobaltTile()})`);

  // Seconds into the song where each scene begins, matched to the lyrics:
  // intro shouts · instrumental · verse 1 ("aunque nos cierren la sal") · pre-chorus
  // ("siembra la milpa") · verse 2 · "vienen casas sobre el mar" · last chorus + outro.
  const CUES = [0, 21.8, 51.9, 72.8, 104.7, 132.4, 153.4];
  const SONG_LEN = 212;

  // Logo: a heart of criollo maize kernels between two husk leaves.
  const pal = ['#f2c94c', '#f2c94c', '#f2c94c', '#e9a83a', '#c0392b', '#3d63b8', '#f6efe0', '#f2c94c', '#7a2a6a'];
  let kern = '', n = 0;
  for (let r = 0, y = 28; y < 96; y += 7, r++) for (let x = 18 + (r % 2) * 4; x < 104; x += 8) kern += `<ellipse cx="${x}" cy="${y}" rx="3.6" ry="3.1" fill="${pal[(n++ * 7 + r * 3) % pal.length]}" stroke="#1a1410" stroke-width="1"/>`;
  const heart = id => `<svg viewBox="0 0 120 110"><path d="M60 104 C 20 92 2 60 18 30 C 26 14 44 8 50 26" fill="#7cb04a" stroke="#1a1410" stroke-width="3.4"/><path d="M60 104 C 100 92 118 60 102 30 C 94 14 76 8 70 26" fill="#5fa040" stroke="#1a1410" stroke-width="3.4"/><path d="M60 96 C 30 78 16 58 20 40 C 24 24 44 18 60 34 C 76 18 96 24 100 40 C 104 58 90 78 60 96 Z" fill="#e9b33e" stroke="#1a1410" stroke-width="4"/><clipPath id="${id}"><path d="M60 92 C 32 76 20 58 23 41 C 27 27 44 22 60 38 C 76 22 93 27 97 41 C 100 58 88 76 60 92 Z"/></clipPath><g clip-path="url(#${id})">${kern}</g><path d="M60 34 C 58 18 64 6 72 2" stroke="#e9b33e" stroke-width="3" fill="none"/><path d="M60 34 C 54 20 46 12 38 10" stroke="#d39a26" stroke-width="2.4" fill="none"/></svg>`;

  const stage = document.getElementById('stage');
  const person = p => p === 'PLAYER' ? PLAYER : typeof p === 'number' ? CAST[p] : p;
  const layers = SCENES.map((s, i) => {
    const el = document.createElement('div'); el.className = 'layer';
    el.style.setProperty('--pan', i % 2 ? '-14px' : '14px');
    el.innerHTML = s.scene() + s.figs.map(([p, x, b, h, paint]) => `<div class="fig${paint ? ' fig--paint' : ''}${x > 50 && !s.title && paint ? ' fig--flip' : ''}" style="left:${x}%;bottom:${b}%;height:${h}%">${F.borgia(person(p))}</div>`).join('')
      + (s.title ? `<div class="cx title">${heart('ih')}<div><div class="title__n">Corazón de Maíz</div><div class="title__t">Tlaxcallan · año 1-Ácatl · 1519</div></div></div>` : '');
    stage.appendChild(el); return el;
  });
  stage.insertAdjacentHTML('beforeend', `<div class="start">Enter · comenzar</div>
    <div class="cx cap"><div class="cap__h"><span class="cap__y"></span><span class="cap__l"></span></div><div class="cap__t"></div><div class="cap__more">▼</div></div>
    <div class="dots">${SCENES.map(() => '<i></i>').join('')}</div>
    <div class="keys"><span><kbd>Enter</kbd>seguir</span><span><kbd>Esc</kbd>saltar</span><button class="mute" type="button" aria-pressed="false"><kbd>M</kbd><span>música</span></button></div>
    <div class="cover"><div class="cx cover__p">${heart('ch')}<div class="cover__n">Corazón de Maíz</div><div class="cover__t">Pulsa <kbd>Enter</kbd> o haz clic para comenzar</div><div class="cover__s">♪ con música · <kbd>M</kbd> para silenciar</div></div></div>`);
  const $ = s => stage.querySelector(s);
  const cap = $('.cap'), capY = $('.cap__y'), capL = $('.cap__l'), capT = $('.cap__t'), dots = [...stage.querySelectorAll('.dots i')], start = $('.start'), cover = $('.cover'), muteBtn = $('.mute');
  layers[0].classList.add('on');

  // ---------- Song clock: the audio's time, or a wall clock if audio can't play ----------
  const audio = new Audio(window.CDM_AUDIO || 'assets/corazon-de-maiz-cancion.mp3');
  audio.preload = 'auto';
  let useAudio = false, wallStart = 0, started = false, ended = false;
  const now = () => useAudio ? audio.currentTime : Math.min(SONG_LEN, performance.now() / 1000 - wallStart);
  function seek(t) { if (useAudio) audio.currentTime = t; else wallStart = performance.now() / 1000 - t; }
  function fadeOut(ms = 1500) {
    if (!useAudio) return; const v0 = audio.volume, t0 = performance.now();
    const step = () => { const k = Math.min(1, (performance.now() - t0) / ms); audio.volume = v0 * (1 - k); if (k < 1) requestAnimationFrame(step); else audio.pause(); };
    step();
  }

  // ---------- Scenes and captions ----------
  let cur = -1, typing = null;
  function type(text) {
    clearInterval(typing);
    capT.innerHTML = [...text].map(ch => `<i>${ch}</i>`).join('');
    const chars = [...capT.children]; let k = 0; cap.classList.remove('done');
    typing = setInterval(() => { if (k < chars.length) chars[k++].style.opacity = 1; else finish(); }, 30);
  }
  function finish() { clearInterval(typing); typing = null; capT.querySelectorAll('i').forEach(c => c.style.opacity = 1); cap.classList.add('done'); if (cur === SCENES.length - 1) start.classList.add('on'); }
  function show(i) {
    cur = i; layers.forEach((l, j) => l.classList.toggle('on', j === i)); dots.forEach((d, j) => d.classList.toggle('on', j === i));
    start.classList.remove('on'); capY.textContent = SCENES[i].year; type(SCENES[i].text);
  }
  function end() {
    if (ended) return; ended = true; fadeOut();
    start.textContent = '¡Que empiece tu historia!'; start.classList.add('on');
    window.dispatchEvent(new CustomEvent('cdm:intro-end'));
  }
  // Manual navigation: jump the song to the scene's cue so music and picture stay together.
  function go(i) { if (i >= SCENES.length) return end(); seek(CUES[i]); show(i); }
  function next() { if (!started) return begin(); if (typing) return finish(); go(cur + 1); }

  function tick() {
    if (!started) return;
    const t = now();
    let i = 0; while (i + 1 < CUES.length && t >= CUES[i + 1]) i++;
    if (i !== cur && !ended) show(i);
    const line = LYRICS.find(([a, b]) => t >= a && t < b);
    const txt = ended ? '' : line ? '♪ ' + line[2] : t < SONG_LEN - .5 ? '♪' : '';
    if (capL.textContent !== txt) capL.textContent = txt;
    requestAnimationFrame(tick);
  }

  function begin() {
    if (started) return; started = true;
    cover.classList.add('off');
    audio.volume = .9;
    wallStart = performance.now() / 1000;
    audio.play().then(() => { const t = now(); useAudio = true; if (t > .5) audio.currentTime = t; }).catch(() => { useAudio = false; });
    show(0); requestAnimationFrame(tick);
  }
  function toggleMute(e) { if (e) e.stopPropagation(); audio.muted = !audio.muted; muteBtn.setAttribute('aria-pressed', String(audio.muted)); muteBtn.querySelector('span').textContent = audio.muted ? 'sin música' : 'música'; }

  addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'Escape') { if (!started) begin(); go(SCENES.length - 1); }
    else if (e.key === 'm' || e.key === 'M') toggleMute();
  });
  muteBtn.addEventListener('click', toggleMute);
  stage.addEventListener('click', next);

  const fit = () => { const k = Math.min(innerWidth / 960, innerHeight / 540); stage.style.transform = `translate(-50%, -50%) scale(${k})`; };
  addEventListener('resize', fit); fit();
  window.CdmIntro = { go, next, begin, audio, now };
})();
