// Corazón de Maíz · intro player. The song is the clock: each chapter is built
// from intro-story.js a moment before its cue, and every CSS animation inside it
// is pinned to the song time (Web Animations currentTime), so seeking, pausing or
// a slow device never lets picture and music drift apart.
// Enter/click: next story beat · Esc: jump to the title · M: mute.
// Fires `cdm:intro-end` when the player starts the game from the title.
"use strict";
(function () {
  const X = window.TlaxTex, S = window.CdmStory, LYRICS = window.CdmLyrics || [];
  const { CH, CAPTIONS, BEATS, TITLE_AT, SONG_LEN, heart } = S;
  const root = document.documentElement.style;
  root.setProperty('--deco', `url(${X.decoTile()})`); root.setProperty('--plain', `url(${X.plainTiles()})`); root.setProperty('--cobalt', `url(${X.cobaltTile()})`);

  const stage = document.getElementById('stage');
  const wipeTiles = Array.from({ length: 144 }, (_, k) => { const c = k % 16, r = Math.floor(k / 16); return `<i style="--i:${c + r};background-position:${(c % 2) * -60}px ${(r % 2) * -60}px"></i>`; }).join('');
  stage.innerHTML = `<div class="chaps"></div><div class="wipe" aria-hidden="true">${wipeTiles}</div><div class="flash" aria-hidden="true"></div>
    <div class="lyr"></div>
    <div class="cx cap hide" aria-live="polite"><div class="cap__y"></div><div class="cap__t"></div><div class="cap__more">▼</div></div>
    <div class="dots">${CH.map((c, i) => `<button type="button" data-ch="${i}" aria-label="Escena ${i + 1}${c.label ? ': ' + c.label : ''}"></button>`).join('')}</div>
    <div class="keys"><span><kbd>Enter</kbd>seguir</span><span><kbd>Esc</kbd>saltar</span><button class="mute" type="button" aria-pressed="false"><kbd>M</kbd><span>música</span></button></div>
    <button class="start" type="button">Enter · comenzar</button>
    <div class="cover"><div class="cx cover__p">${heart('hc')}<div class="cover__n">Corazón de Maíz</div><div class="cover__t">Pulsa <kbd>Enter</kbd> o haz clic para comenzar</div><div class="cover__s">♪ con música · <kbd>M</kbd> para silenciar</div></div></div>`;
  const $ = s => stage.querySelector(s);
  const chapsEl = $('.chaps'), wipeEl = $('.wipe'), flashEl = $('.flash'), lyrEl = $('.lyr'), cap = $('.cap'), capY = $('.cap__y'), capT = $('.cap__t');
  const dots = [...stage.querySelectorAll('.dots button')], startBtn = $('.start'), cover = $('.cover'), muteBtn = $('.mute');

  // ---------- Song clock: the audio's time, or a wall clock if audio can't play ----------
  const audio = new Audio(window.CDM_AUDIO || 'assets/corazon-de-maiz-cancion.mp3');
  audio.preload = 'auto';
  let useAudio = false, wallStart = 0, started = false, ended = false, ending = false, paused = false;
  const wallNow = () => performance.now() / 1000;
  let aT = -1, aWall = 0;
  function now() {
    if (!useAudio) return Math.min(SONG_LEN, wallNow() - wallStart);
    const ct = audio.currentTime, w = wallNow();
    if (audio.paused || audio.ended) { aT = ct; aWall = w; return ct; }
    if (ct !== aT) { const est = aT + (w - aWall); if (aT < 0 || Math.abs(ct - est) > .25) { aT = ct; aWall = w; } else if (ct > est) { aT = ct; aWall = w; } }
    return Math.min(SONG_LEN, aT + (w - aWall));
  }
  function seek(t) { if (useAudio) { audio.currentTime = t; aT = t; aWall = wallNow(); } else wallStart = wallNow() - t; }
  const clockFrozen = () => (useAudio && audio.ended) || now() >= SONG_LEN - .05;

  // ---------- Chapters ----------
  const built = [];
  function chapterHTML(i) {
    if (built[i]) return built[i];
    const c = CH[i], p = c.build(abs => abs - c.t0), [px0, px1, z0, z1, origin] = c.cam, [ox, oy] = origin.split(' ');
    const plane = (k, d) => p[k] ? `<div class="plane" style="--d:${d}">${p[k]}</div>` : '';
    return (built[i] = `<div class="chap" data-i="${i}" style="--dur:${(c.t1 - c.t0).toFixed(2)}s;--px0:${px0};--px1:${px1};--z0:${z0};--z1:${z1};--ox:${ox};--oy:${oy}">${plane('sky', 0)}${plane('far', .2)}${plane('mid', .45)}${plane('near', .7)}${plane('front', 1)}${p.ui ? `<div class="ui">${p.ui}</div>` : ''}</div>`);
  }
  const chapterAt = t => { let i = 0; while (i + 1 < CH.length && t >= CH[i + 1].t0) i++; return i; };
  const live = new Map();
  const anims = el => el.getAnimations({ subtree: true });
  function sync(i, t) { const el = live.get(i); if (!el) return; const ms = (t - CH[i].t0) * 1000; anims(el).forEach(a => { a.currentTime = ms; if (paused) a.pause(); }); }
  function create(i, t) {
    const tpl = document.createElement('template'); tpl.innerHTML = chapterHTML(i);
    const el = tpl.content.firstElementChild, after = [...live.keys()].filter(j => j > i).sort((a, b) => a - b)[0];
    chapsEl.insertBefore(el, after != null ? live.get(after) : null);
    live.set(i, el); sync(i, t);
    return el;
  }
  function drop(i) { const el = live.get(i); if (el) el.remove(); live.delete(i); }

  // ---------- Captions ----------
  let capIdx = -2, typing = null;
  function type(text) {
    clearInterval(typing);
    capT.innerHTML = [...text].map(ch => `<i>${ch}</i>`).join('');
    const chars = [...capT.children]; let k = 0; cap.classList.remove('done');
    typing = setInterval(() => { if (k < chars.length) chars[k++].style.opacity = 1; else finish(); }, 28);
  }
  function finish() { clearInterval(typing); typing = null; capT.querySelectorAll('i').forEach(c => { c.style.opacity = 1; }); cap.classList.add('done'); }
  const captionAt = t => { let k = -1; CAPTIONS.forEach((c, i) => { if (t >= c.t) k = i; }); return k; };

  // ---------- Transitions ----------
  let wipesDone = new Set();
  function playWipe() { wipeEl.classList.remove('go'); void wipeEl.offsetWidth; wipeEl.classList.add('go'); setTimeout(() => wipeEl.classList.remove('go'), 1400); }
  function resync(t, quiet) {
    live.forEach((el, i) => drop(i));
    const ci = chapterAt(t), el = create(ci, t); el.classList.add('on', 'cut');
    wipesDone = new Set(CH.map((c, i) => i).filter(i => CH[i].t0 - .74 <= t));
    capIdx = -2; lastT = t; lastWall = wallNow();
    if (!quiet) flashEl.animate([{ opacity: .85 }, { opacity: 0 }], { duration: 420, easing: 'ease-out' });
  }

  // ---------- Main loop ----------
  let lastT = 0, lastWall = 0, lastDrift = 0, lyrText = null, beatI = 0, punchCh = -1;
  function frame() {
    requestAnimationFrame(frame);
    if (!started) return;
    const t = now(), wall = wallNow(), frozen = clockFrozen();
    // A jump in song time that the wall clock didn't see: seek, scrub, or a background tab.
    if (!frozen && !paused && lastWall && Math.abs(t - (lastT + (wall - lastWall))) > .6) resync(t, true);
    lastT = t; lastWall = wall;

    const ci = chapterAt(t), ni = ci + 1, nc = CH[ni];
    if (!live.has(ci)) create(ci, t).classList.add('on', 'cut');
    if (nc && nc.t0 - t < 1.6 && !live.has(ni)) create(ni, t);
    if (nc && nc.wipe && !wipesDone.has(ni) && t >= nc.t0 - .74) { wipesDone.add(ni); playWipe(); }
    live.forEach((el, i) => {
      const isNext = i === ni && !nc.wipe && t >= nc.t0 - .45;
      if (i === ci || isNext) { if (!el.classList.contains('on')) el.classList.add('on'); if (i === ci && CH[i].wipe && !el.classList.contains('cut')) el.classList.add('cut'); }
      else if (i < ci) { if (CH[ci].wipe) drop(i); else { el.classList.remove('on', 'cut'); if (t > CH[ci].t0 + 1.1) drop(i); } }
      else if (i > ni) drop(i);
    });
    if (!frozen && !paused && wall - lastDrift > .5) {
      lastDrift = wall;
      live.forEach((el, i) => { const a = el.firstElementChild && el.firstElementChild.getAnimations()[0]; if (a && Math.abs(a.currentTime - (t - CH[i].t0) * 1000) > 90) sync(i, t); });
    }

    // Narration panel.
    const k = captionAt(t);
    if (k !== capIdx) { capIdx = k; if (k >= 0) { capY.textContent = CH[chapterAt(CAPTIONS[k].t)].label; type(CAPTIONS[k].text); } }
    const c = CAPTIONS[k], nextT = CAPTIONS[k + 1] ? CAPTIONS[k + 1].t : Infinity;
    cap.classList.toggle('hide', !(k >= 0 && t < Math.min(nextT, c.t + (c.hold || 15))));

    // Sung line, beat pulse, chapter dots, start button.
    const line = LYRICS.find(([a, b]) => t >= a && t < b), lt = line && t >= 21.5 && t < TITLE_AT - .5 ? '♪ ' + line[2] : '';
    if (lt !== lyrText) { lyrText = lt; lyrEl.textContent = lt; lyrEl.classList.toggle('on', !!lt); }
    while (beatI > 0 && BEATS[beatI] > t) beatI--;
    while (beatI + 1 < BEATS.length && BEATS[beatI + 1] <= t) beatI++;
    const ph = t - BEATS[beatI], pulse = ph >= 0 && ph < .42 ? (1 - ph / .42) ** 2 : 0;
    stage.style.setProperty('--beat', pulse.toFixed(3));
    dots.forEach((d, i) => d.classList.toggle('on', i === ci));
    if (punchCh !== ci) { punchCh = ci; stage.style.setProperty('--punch', CH[ci].punch || 0); }
    startBtn.classList.toggle('on', ended || (t >= CAPTIONS[CAPTIONS.length - 1].t && cap.classList.contains('done')));
  }

  // ---------- Controls ----------
  const NAV = [...new Set([...CH.map(c => c.t0), ...CAPTIONS.map(c => c.t)])].sort((a, b) => a - b);
  function seekTo(t) { seek(t); resync(t); }
  function next() {
    if (ended) return;
    if (!started) return begin();
    if (typing) return finish();
    const t = now();
    if (t >= TITLE_AT - .2) return end();
    const nt = NAV.find(v => v > t + .35);
    seekTo(nt != null ? Math.min(nt, TITLE_AT) : TITLE_AT);
  }
  function skip() { if (ended) return; if (!started) begin(); if (now() < TITLE_AT - .2) seekTo(TITLE_AT); else end(); }
  function end() {
    if (ended) return; ended = true; ending = true;
    if (useAudio) { const v0 = audio.volume, t0 = performance.now(); const step = () => { const q = Math.min(1, (performance.now() - t0) / 1500); audio.volume = v0 * (1 - q); if (q < 1) requestAnimationFrame(step); else audio.pause(); }; step(); }
    startBtn.textContent = '¡Que empiece tu historia!';
    window.dispatchEvent(new CustomEvent('cdm:intro-end'));
  }
  function setPaused(p) { if (paused === p) return; paused = p; live.forEach(el => anims(el).forEach(a => (p ? a.pause() : a.play()))); if (!p) live.forEach((el, i) => sync(i, now())); }
  audio.addEventListener('pause', () => { if (!audio.ended && !ending) setPaused(true); });
  audio.addEventListener('play', () => setPaused(false));
  function toggleMute(e) { if (e) e.stopPropagation(); audio.muted = !audio.muted; muteBtn.setAttribute('aria-pressed', String(audio.muted)); muteBtn.querySelector('span').textContent = audio.muted ? 'sin música' : 'música'; }

  function begin() {
    if (started) return; started = true;
    cover.classList.add('off');
    wallStart = wallNow(); audio.volume = .9;
    audio.play().then(() => { const t = now(); useAudio = true; aT = -1; if (t > .5) seek(t); }).catch(() => { useAudio = false; });
    paused = false; resync(0, true);
  }

  addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); next(); }
    else if (e.key === 'Escape') skip();
    else if (e.key === 'm' || e.key === 'M') toggleMute();
  });
  muteBtn.addEventListener('click', toggleMute);
  startBtn.addEventListener('click', e => { e.stopPropagation(); if (!started) begin(); else end(); });
  dots.forEach((d, i) => d.addEventListener('click', e => { e.stopPropagation(); if (ended) return; if (!started) begin(); seekTo(CH[i].t0 + .01); }));
  stage.addEventListener('click', next);

  const fit = () => { const k = Math.min(innerWidth / 960, innerHeight / 540); stage.style.transform = `translate(-50%, -50%) scale(${k})`; };
  addEventListener('resize', fit); fit();
  // The first chapter waits, frozen, behind the cover.
  create(0, 0).classList.add('on', 'cut'); live.forEach(el => anims(el).forEach(a => a.pause()));
  requestAnimationFrame(frame);
  window.CdmIntro = { next, skip, begin, seekTo, audio, now, live };
})();
