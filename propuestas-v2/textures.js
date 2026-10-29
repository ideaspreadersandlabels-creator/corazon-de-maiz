// Procedural "realistic" materials for Tlaxcallan v2, drawn on canvas at load:
// glazed Talavera tiles (decorated + plain, with grout), a glazed cobalt tile for
// primary buttons, and a matte-painting style title landscape of La Malinche.
"use strict";
(function () {
  const rnd = s => () => (s = (s * 16807) % 2147483647) / 2147483647;

  // 2D value noise + fbm.
  function noise2(seed) {
    const R = rnd(seed), P = new Float32Array(256 * 256).map(R);
    const at = (x, y) => P[(y & 255) * 256 + (x & 255)];
    const n = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), tx = x - xi, ty = y - yi, sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
      return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
    };
    return (x, y, oct = 5) => { let s = 0, amp = .5, f = 1; for (let i = 0; i < oct; i++) { s += amp * n(x * f, y * f); f *= 2.03; amp *= .5; } return s; };
  }
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const mix = (a, b, t) => a + (b - a) * t;

  // Shape drawn as if with a loaded brush: jittered outline, darker pooled rim, uneven fill.
  function brush(g, R, fn, color, alpha = .92) {
    g.save(); g.fillStyle = color;
    g.globalAlpha = alpha * (.82 + R() * .18); g.beginPath(); fn(0, 0); g.fill();
    g.globalAlpha = .22; g.translate((R() - .5) * 1.4, (R() - .5) * 1.4); g.beginPath(); fn(); g.fill();
    g.globalAlpha = .35; g.lineWidth = 1.1; g.strokeStyle = color; g.stroke();
    g.restore();
  }
  function glazeFinish(g, S, R, x0 = 0, y0 = 0) {
    // Speckle in the tin glaze, highlight sweep, fine crazing.
    for (let i = 0; i < S * S / 40; i++) { g.fillStyle = `rgba(${R() < .5 ? '90,70,40' : '255,255,255'},${R() * .08})`; g.fillRect(x0 + R() * S, y0 + R() * S, 1, 1); }
    const hl = g.createLinearGradient(x0, y0, x0 + S, y0 + S);
    hl.addColorStop(0, 'rgba(255,255,255,.35)'); hl.addColorStop(.32, 'rgba(255,255,255,.05)'); hl.addColorStop(.5, 'rgba(255,255,255,0)'); hl.addColorStop(1, 'rgba(60,40,20,.08)');
    g.fillStyle = hl; g.fillRect(x0, y0, S, S);
    g.strokeStyle = 'rgba(80,60,40,.07)'; g.lineWidth = .6;
    for (let i = 0; i < 9; i++) { let x = x0 + R() * S, y = y0 + R() * S; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 5; k++) { x += (R() - .5) * S * .3; y += (R() - .5) * S * .3; g.lineTo(x, y); } g.stroke(); }
  }
  function tileBase(g, S, gap, base, R, x0 = 0, y0 = 0) {
    g.fillStyle = '#cfc5b2'; g.fillRect(x0, y0, S, S);
    for (let i = 0; i < S * 2; i++) { g.fillStyle = `rgba(${R() < .5 ? '120,105,85' : '235,228,214'},.5)`; g.fillRect(x0 + R() * S, y0 + R() * S, 1.4, 1.4); }
    const r = S * .04, x = x0 + gap / 2, y = y0 + gap / 2, w = S - gap;
    g.save(); g.beginPath(); g.roundRect(x, y, w, w, r); g.clip();
    const bg = g.createRadialGradient(x + w * .45, y + w * .4, w * .1, x + w / 2, y + w / 2, w * .75);
    bg.addColorStop(0, base[0]); bg.addColorStop(1, base[1]); g.fillStyle = bg; g.fillRect(x, y, w, w);
    return { x, y, w, done() { glazeFinish(g, w, R, x, y); g.restore(); g.strokeStyle = 'rgba(70,55,35,.25)'; g.lineWidth = 1; g.beginPath(); g.roundRect(x + .5, y + .5, w - 1, w - 1, r); g.stroke(); } };
  }

  const COB = '#1b3a8a', OCH = '#d39a26', GRN = '#3d7a46';
  // Decorated Talavera tile: rosette, ochre ring, corner quarter-medallions that join across tiles.
  function decoTile(S = 192, seed = 3) {
    const c = canvas(S, S), g = c.getContext('2d'), R = rnd(seed), gap = 5;
    const t = tileBase(g, S, gap, ['#fbf7ee', '#ece3d0'], R), cx = S / 2, cy = S / 2, u = t.w / 100;
    const jit = () => (R() - .5) * 1.2 * u;
    // Corner quarter circles + ochre dots.
    [[t.x, t.y], [t.x + t.w, t.y], [t.x, t.y + t.w], [t.x + t.w, t.y + t.w]].forEach(([x, y]) => {
      brush(g, R, () => { g.arc(x + jit(), y + jit(), 24 * u, 0, Math.PI * 2); }, COB);
      brush(g, R, () => { g.arc(x, y, 13 * u, 0, Math.PI * 2); }, '#f6f0e2', 1);
      brush(g, R, () => { g.arc(x, y, 8 * u, 0, Math.PI * 2); }, OCH);
    });
    // Edge leaves pointing to the centre.
    [0, 1, 2, 3].forEach(k => { const a = k * Math.PI / 2; g.save(); g.translate(cx, cy); g.rotate(a);
      brush(g, R, () => { g.moveTo(0, -48 * u); g.quadraticCurveTo(9 * u, -40 * u, 0, -30 * u); g.quadraticCurveTo(-9 * u, -40 * u, 0, -48 * u); }, GRN);
      g.restore(); });
    // Rosette: 8 cobalt petals, ochre ring, centre.
    for (let k = 0; k < 8; k++) { g.save(); g.translate(cx, cy); g.rotate(k * Math.PI / 4 + Math.PI / 8);
      brush(g, R, () => { g.moveTo(0, -6 * u); g.bezierCurveTo(14 * u + jit(), -16 * u, 9 * u, -34 * u, 0, -38 * u + jit()); g.bezierCurveTo(-9 * u, -34 * u, -14 * u + jit(), -16 * u, 0, -6 * u); }, COB);
      brush(g, R, () => { g.ellipse(0, -24 * u, 2.6 * u, 6 * u, 0, 0, Math.PI * 2); }, '#f6f0e2', .9);
      g.restore(); }
    brush(g, R, () => { g.arc(cx, cy, 11 * u, 0, Math.PI * 2); }, OCH);
    brush(g, R, () => { g.arc(cx, cy, 5 * u, 0, Math.PI * 2); }, COB);
    // Dotted cobalt frame line near the edge.
    g.fillStyle = COB; for (let k = 0; k < 4; k++) for (let i = 30; i <= 70; i += 6) { g.globalAlpha = .75; const p = [[i, 8], [92, i], [i, 92], [8, i]][k]; g.beginPath(); g.arc(t.x + p[0] * u, t.y + p[1] * u, 1.5 * u, 0, Math.PI * 2); g.fill(); }
    g.globalAlpha = 1; t.done(); return c.toDataURL();
  }
  // Plain white glazed tiles, 2×2 with slight variation so repetition is less visible.
  function plainTiles(S = 128, seed = 9) {
    const c = canvas(S * 2, S * 2), g = c.getContext('2d'), R = rnd(seed);
    const tints = [['#fdfaf3', '#efe7d6'], ['#faf6ec', '#eae0cc'], ['#fefbf5', '#f1e9da'], ['#f9f4ea', '#e9dfcb']];
    for (let i = 0; i < 4; i++) { const t = tileBase(g, S, 4, tints[i], R, (i % 2) * S, Math.floor(i / 2) * S); t.done(); }
    return c.toDataURL();
  }
  // Cobalt-glazed tile for primary buttons and selected states.
  function cobaltTile(S = 128, seed = 5) {
    const c = canvas(S, S), g = c.getContext('2d'), R = rnd(seed);
    const t = tileBase(g, S, 0, ['#2f56b4', '#16306e'], R);
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(10,20,60,${R() * .2})`; g.beginPath(); g.ellipse(R() * S, R() * S, 4 + R() * 12, 2 + R() * 6, R() * 3, 0, Math.PI * 2); g.fill(); }
    t.done(); return c.toDataURL();
  }

  // Matte-painting landscape: sky, fbm clouds, La Malinche with ridges and gullies lit
  // from the right (sunrise), haze, forest belt, valley and milpa silhouettes.
  function landscape(W = 1280, H = 720) {
    const c = canvas(W, H), g = c.getContext('2d'), img = g.createImageData(W, H), d = img.data, N = noise2(7), M = noise2(19), R = rnd(4);
    const sunX = W * .8, sunY = H * .55;
    const sky = y => { const t = y / (H * .72); const st = [[24, 22, 56], [70, 44, 98], [176, 86, 98], [236, 146, 92], [248, 206, 140]]; const f = Math.min(.999, Math.max(0, t)) * (st.length - 1), i = Math.floor(f), k = f - i; return st[i].map((v, j) => mix(v, st[i + 1][j], k)); };
    const malTop = x => { const dx = (x - W * .47) / W; return H * .24 + Math.pow(Math.abs(dx) * 3.2, 1.25) * H * .28 + (N(x / 90, 3) - .5) * H * .06; };
    const farTop = x => { const a = H * .5 - Math.max(0, 1 - Math.abs(x - W * .12) / (W * .14)) * H * .14, b = H * .52 - Math.max(0, 1 - Math.abs(x - W * .24) / (W * .1)) * H * .08; return Math.min(a, b) + (N(x / 40, 9) - .5) * 8; };
    const forest = x => H * .69 + (N(x / 60, 30) - .5) * H * .05;
    const valley = x => H * .76 + (N(x / 200, 50) - .5) * H * .02;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4; let [r, gg, b] = sky(y);
      // Sun glow.
      const sd = Math.hypot(x - sunX, (y - sunY) * 1.3) / W; const glow = Math.exp(-sd * 9) * .9 + Math.exp(-sd * 40) * .6;
      r = mix(r, 255, glow * .8); gg = mix(gg, 236, glow * .7); b = mix(b, 196, glow * .5);
      if (sd < .032) { r = 255; gg = 248; b = 226; }
      // Clouds.
      if (y < H * .45) { const cl = M(x / 260, y / 70, 5); const k = Math.max(0, (cl - .55) * 4) * (1 - y / (H * .45)); const lit = Math.max(0, 1 - Math.abs(x - sunX) / W) * .6; r = mix(r, 220 + lit * 35, k * .7); gg = mix(gg, 120 + lit * 80, k * .7); b = mix(b, 130 + lit * 40, k * .7); }
      // Far volcanoes (Popocatépetl, Iztaccíhuatl), hazy.
      const ft = farTop(x);
      if (y > ft && y < H * .7) { const snow = y < ft + 18 + N(x / 14, y / 14, 3) * 14; r = snow ? 236 : 150; gg = snow ? 222 : 128; b = snow ? 232 : 170; const h = .35; r = mix(r, 240, h); gg = mix(gg, 180, h); b = mix(b, 160, h); }
      // La Malinche.
      const mt = malTop(x);
      if (y > mt) {
        // Gullies radiate from the summit: sample ridged noise in polar coordinates.
        const px = W * .47, py = H * .2, ang = Math.atan2(x - px, y - py), dist = Math.hypot(x - px, y - py) / H;
        const ridge = (a, r) => 1 - Math.abs(2 * N(a * 9, r * 6, 5) - 1);
        const h0 = ridge(ang, dist) * .55 + N(x / 34, y / 34, 5) * .45, h1 = ridge(ang + .006, dist) * .55 + N((x + 1.5) / 34, y / 34, 5) * .45;
        const fine = N(x / 5, y / 5, 3) - .5;
        const slope = (h1 - h0) * 8, side = (x - px) / (W * .25);
        let light = .62 + slope * .7 + side * .28 + fine * .18 + (h0 - .5) * .25;
        light = Math.max(.12, Math.min(1.3, light));
        const veg = Math.min(1, Math.max(0, (dist - .32) / .2));           // pine forest lower down
        let cr = mix(104, 58, veg), cg = mix(84, 84, veg), cb = mix(118, 62, veg);
        const warm = Math.max(0, light - .75);
        r = cr * light + 150 * warm; gg = cg * light + 90 * warm; b = cb * light + 50 * warm;
        const snow = dist < .16 + (h0 - .5) * .1 + N(x / 30, y / 30, 3) * .04 && h0 > .35;
        if (snow) { const s = Math.min(1.08, .55 + slope * .5 + side * .3 + .3); r = 255 * s; gg = 236 * s; b = 240 * s; }
        const haze = Math.min(.6, Math.max(0, (y - H * .42) / (H * .32)));
        r = mix(r, 230, haze * .55); gg = mix(gg, 156, haze * .55); b = mix(b, 140, haze * .55);
      }
      // Forest belt.
      if (y > forest(x)) { const t = N(x / 6, y / 6, 4); const l = .5 + (t - .5) * 1.4 + (x / W) * .2; r = 34 * l + 10; gg = 62 * l + 14; b = 36 * l + 10; }
      // Valley fields in warm light.
      if (y > valley(x)) { const band = Math.sin((y - valley(x)) / 3 + N(x / 50, y / 20, 3) * 6); const l = .8 + band * .08 + (N(x / 10, y / 10, 4) - .5) * .3 + (x / W) * .2; r = 104 * l; gg = 132 * l; b = 58 * l; }
      d[i] = r; d[i + 1] = gg; d[i + 2] = b; d[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    // Village + church catching the sun.
    for (let k = 0; k < 26; k++) { const x = W * .55 + R() * W * .4, y = valley(x) + 2 + R() * 10, w = 6 + R() * 10; g.fillStyle = R() < .5 ? '#e8cfa6' : '#d8b48a'; g.fillRect(x, y - 6, w, 6); g.fillStyle = '#a8432f'; g.fillRect(x - 1, y - 8, w + 2, 2.4); }
    // Basílica de Ocotlán on its hill: white stucco towers over red petatillo bases.
    const cx = W * .83, cy = valley(cx) - 8;
    g.fillStyle = '#5a7a3a'; g.beginPath(); g.ellipse(cx, cy + 14, 90, 22, 0, Math.PI, 0); g.fill();
    const tower = (tx, s) => { g.fillStyle = '#b8432f'; g.fillRect(tx - 7 * s, cy - 22 * s, 14 * s, 22 * s); g.strokeStyle = 'rgba(120,40,30,.8)'; g.lineWidth = .6; for (let k = 0; k < 8; k++) { g.beginPath(); g.moveTo(tx - 7 * s, cy - k * 2.8 * s); g.lineTo(tx + 7 * s, cy - (k + 1) * 2.8 * s); g.stroke(); }
      g.fillStyle = '#f6f0e4'; g.fillRect(tx - 6 * s, cy - 42 * s, 12 * s, 20 * s); g.fillRect(tx - 4.5 * s, cy - 54 * s, 9 * s, 12 * s); g.beginPath(); g.arc(tx, cy - 54 * s, 4.5 * s, Math.PI, 0); g.fill();
      g.fillStyle = '#3a2a3a'; g.fillRect(tx - 2 * s, cy - 38 * s, 4 * s, 8 * s); g.fillRect(tx - 1.5 * s, cy - 51 * s, 3 * s, 6 * s); g.fillStyle = '#e0c070'; g.fillRect(tx - .5 * s, cy - 64 * s, 1 * s, 6 * s); g.fillRect(tx - 2 * s, cy - 62 * s, 4 * s, 1 * s); };
    const s = 1.1; g.fillStyle = '#f6f0e4'; g.fillRect(cx - 14 * s, cy - 40 * s, 28 * s, 40 * s);
    g.fillStyle = '#efe2c8'; g.beginPath(); g.moveTo(cx - 14 * s, cy - 40 * s); g.quadraticCurveTo(cx, cy - 56 * s, cx + 14 * s, cy - 40 * s); g.fill();
    g.fillStyle = '#d8c09a'; g.fillRect(cx - 8 * s, cy - 36 * s, 16 * s, 26 * s); g.fillStyle = '#4a2e2a'; g.beginPath(); g.moveTo(cx - 4 * s, cy); g.lineTo(cx - 4 * s, cy - 10 * s); g.arc(cx, cy - 10 * s, 4 * s, Math.PI, 0); g.lineTo(cx + 4 * s, cy); g.fill();
    tower(cx - 22 * s, s); tower(cx + 22 * s, s);
    g.fillStyle = 'rgba(255,214,150,.25)'; g.fillRect(cx + 4 * s, cy - 56 * s, 22 * s, 56 * s);
    // White herons (the Tlaxcalteca standard) crossing the dawn sky.
    [[W * .3, H * .18, 1], [W * .34, H * .21, .8], [W * .27, H * .23, .7]].forEach(([hx, hy, k]) => { g.strokeStyle = '#f8f4ee'; g.lineWidth = 2.6 * k; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx - 16 * k, hy - 6 * k); g.quadraticCurveTo(hx - 6 * k, hy - 10 * k, hx, hy); g.quadraticCurveTo(hx + 6 * k, hy - 10 * k, hx + 16 * k, hy - 6 * k); g.stroke(); g.lineWidth = 1.6 * k; g.beginPath(); g.moveTo(hx, hy); g.lineTo(hx + 10 * k, hy + 2 * k); g.stroke(); });
    // Milpa: corn stalk silhouettes, back-lit.
    const rowY = [H * .86, H * .93, H * 1.01];
    rowY.forEach((by, ri) => {
      const s = .7 + ri * .3;
      for (let x = -10; x < W * .62 - ri * 30; x += 11 * s + R() * 6) {
        const h = (60 + R() * 30) * s, lean = (R() - .5) * 6;
        g.strokeStyle = `rgb(${30 + ri * 6},${52 + ri * 8},${26})`; g.lineWidth = 2.2 * s; g.beginPath(); g.moveTo(x, by); g.quadraticCurveTo(x + lean, by - h * .5, x + lean * 1.6, by - h); g.stroke();
        for (let k = 0; k < 4; k++) { const ly = by - h * (.3 + k * .16), dd = k % 2 ? 1 : -1, L = (24 - k * 3) * s; g.fillStyle = `rgba(${44 + ri * 10},${78 + ri * 12},${34},.95)`; g.beginPath(); g.moveTo(x, ly); g.quadraticCurveTo(x + dd * L * .6, ly - 10 * s, x + dd * L, ly + 4 * s); g.quadraticCurveTo(x + dd * L * .5, ly - 3 * s, x, ly + 3 * s); g.fill(); }
        g.strokeStyle = 'rgba(240,200,110,.9)'; g.lineWidth = 1.2 * s; g.beginPath(); g.moveTo(x + lean * 1.6, by - h); g.lineTo(x + lean * 1.6 - 4 * s, by - h - 7 * s); g.moveTo(x + lean * 1.6, by - h); g.lineTo(x + lean * 1.6 + 4 * s, by - h - 7 * s); g.stroke();
        g.strokeStyle = 'rgba(255,214,140,.5)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 1, by); g.quadraticCurveTo(x + lean + 1, by - h * .5, x + lean * 1.6 + 1, by - h); g.stroke();
      }
    });
    // Magueyes.
    [[W * .72, H * 1.0, 1.4], [W * .9, H * 1.02, 1.8], [W * .62, H * .98, 1]].forEach(([mx, my, s]) => {
      [-70, 70, -48, 48, -26, 26, -8, 8, 0].forEach((a, i) => { g.save(); g.translate(mx, my); g.rotate(a * Math.PI / 180); const L = (90 - Math.abs(a) * .4) * s, w = 10 * s;
        const gr = g.createLinearGradient(-w, 0, w, 0); gr.addColorStop(0, i < 4 ? '#24453c' : '#3d6e5c'); gr.addColorStop(1, i < 4 ? '#183028' : '#6e9a84');
        g.fillStyle = gr; g.beginPath(); g.moveTo(-w, 0); g.quadraticCurveTo(-w, -L * .6, 0, -L); g.quadraticCurveTo(w, -L * .6, w, 0); g.fill();
        g.strokeStyle = 'rgba(220,200,120,.45)'; g.lineWidth = 1.2; g.stroke(); g.restore(); });
    });
    // Film grain + vignette.
    const v = g.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, W * .7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,5,20,.45)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
    for (let i = 0; i < W * H / 30; i++) { g.fillStyle = `rgba(${R() < .5 ? 0 : 255},${R() < .5 ? 0 : 255},${R() < .5 ? 0 : 255},.035)`; g.fillRect(R() * W, R() * H, 1, 1); }
    return c.toDataURL('image/jpeg', .9);
  }

  window.TlaxTex = { decoTile, plainTiles, cobaltTile, landscape };
})();
