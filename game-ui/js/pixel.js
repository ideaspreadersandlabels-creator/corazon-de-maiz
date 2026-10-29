// Pixel-art renderer for Tlaxcallan's UI: item icons, character portraits and the
// title-screen landscape. Ported verbatim from the Claude Design prototype
// (project/Tlaxcallan Pantalla de Inicio.dc.html) so the output matches pixel for pixel.
"use strict";
(function () {
class PixelArt {
  PAL = { Y: '#f2c94c', y: '#c8962e', W: '#fff1b8', G: '#7cc04a', g: '#4f8a36', L: '#a8dc6a', B: '#2f5fa8', b: '#1e3c78', N: '#7fa8e8', R: '#b8432f', r: '#7a2a1e', P: '#e86a5a', O: '#e07a28', o: '#a8521e', C: '#f1e3c2', c: '#cfb68a', T: '#8a5a34', t: '#5a3a22', K: '#5f8f7a', k: '#355a4c', M: '#9cccb0', U: '#7a3a8a', u: '#4a2058', V: '#c86aa8', S: '#9a9aa6', s: '#5a5a6a', Z: '#d0d4dc', X: '#3a2a2a' };
  ICONS = {
    maiz: ['................', '..........gG....', '.........gGG....', '........gYYG....', '.......gYWYYG...', '......gYWYYYG...', '.....gYWYYYyG...', '....gYWYYYyG....', '...gYYYYYyG.....', '...gYYYYyGg.....', '..gGYYyyGg......', '..gGGyyGg.......', '.gGGGGGg........', '.gGg.gg.........', '..g.............'],
    frijol: ['................', '................', '.....rrr........', '....rRRPr.......', '....rRRRr.......', '.....rrr..rrr...', '.........rRRPr..', '...rrr...rRRRr..', '..rRRPr...rrr...', '..rRRRr.........', '...rrr...rrr....', '........rRRPr...', '........rRRRr...', '.........rrr....'],
    calabaza: ['................', '.......tt.......', '........t.G.....', '.....OOOOOOGG...', '...OOYOOYOOO....', '..OOYOOYOOYOO...', '..OYOOYOOYOOOo..', '.OOYOOYOOYOOOo..', '.OOYOOYOOYOOOo..', '.OOYOOYOOYOOoo..', '..OOYOOYOOOoo...', '..oOOOOOOOooo...', '...ooooooooo....'],
    chile: ['................', '........g.......', '.......gGg......', '......gRRR......', '.....RRPRR......', '.....RPRRr......', '....RRPRRr......', '....RPRRr.......', '...RRPRRr.......', '...RPRRr........', '..RRRRr.........', '..RRRr..........', '.RRr............', '.r..............'],
    nopal: ['................', '......KK........', '.....KMKK.......', '.....KMKK..KK...', '.....KKKK.KMKK..', '......KK..KKKK..', '...KK.KK...KK...', '..KMKKKKKKKK....', '..KKKKKKKKK.....', '...KKKKKKkk.....', '....KKKKkk......', '.....kKkk.......', '......kk........'],
    tuna: ['................', '................', '.......G........', '......UUUU......', '.....UVUUUU.....', '....UVVUUUUU....', '....UVUUUUuU....', '....UUUUUUuU....', '....UUUUUuuU....', '.....UUUuuU.....', '......UUUU......'],
    maguey: ['................', '.......K........', '......KMK.......', '..K...KMK...K...', '..KK..KMK..KK...', '...KK.KMK.KK....', '...KMKKMKKMK....', 'K...KMKMKMK...K.', 'KK..KMKMKMK..KK.', '.KKKKKMMMKKKKK..', '..KKKKKMKKKKK...', '...kKKKKKKKk....', '....kkkkkkk.....'],
    pulque: ['................', '................', '....CCCCCC......', '...CWCCCCCC.....', '...oOOOOOOOo....', '..oOOOOOOOOOo.o.', '..oOOYOOYOOOooo.', '..oOOOOOOOOOo.o.', '..oOOOOOOOOOoo..', '...oOOOOOOOo....', '....oooooo......'],
    tortilla: ['................', '................', '................', '....cCCCCCc.....', '..cCCYCCCCCCc...', '.cCCCCCCCYCCCc..', '.ccCCCCCCCCCcc..', '.cCcccccccccCc..', '.ccCCCCCCCCCcc..', '..ccccccccccc...', '..ccCCCCCCCcc...', '...ccccccccc....'],
    coa: ['................', '.............t..', '............tT..', '...........tT...', '..........tT....', '.........tT.....', '........tT......', '.......tT.......', '......tT........', '.....tT.........', '...ssTs.........', '..sZZSs.........', '.sZZSSs.........', '.sZSSs..........', '..sss...........'],
    cantaro: ['................', '................', '.....oooo.......', '....oOOOOo......', '.....oOOo.......', '...oOOOOOOo.....', '..oOOYYYYOOo....', '..oOOOOOOOOo....', '..oOOOOOOOOo..N.', '..oOOOOOOOOo.N..', '...oOOOOOOo.....', '....oooooo......'],
  };
  tint(h, k) { const v = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)); return '#' + v.map(c => Math.max(0, Math.min(255, Math.round(k > 1 ? c + (255 - c) * (k - 1) : c * k))).toString(16).padStart(2, '0')).join(''); }
  dark(h) { const v = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), b = [26, 16, 16]; return '#' + v.map((c, i) => Math.round(c * 0.38 + b[i] * 0.62).toString(16).padStart(2, '0')).join(''); }
  outlinedSel(grid) {
    const H = grid.length, W = grid[0].length, out = grid.map(r => r.slice());
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!grid[y][x]) {
      const n = [[0, 1], [1, 0], [-1, 0], [0, -1]].map(([a, b]) => grid[y + b] && grid[y + b][x + a]).find(Boolean);
      if (n) out[y][x] = this.dark(n);
    }
    return out;
  }
  blit(g, grid, ox, oy) { grid.forEach((row, y) => row.forEach((c, x) => c && g.p(ox + x, oy + y, c))); }
  drawIcon(el, key) {
    const ctx = el.getContext('2d'), img = ctx.createImageData(16, 16), g = this.makeG(img.data, 16, 16);
    const remap = key === 'maizAzul' ? { Y: 'B', W: 'N', y: 'b' } : null, map = this.ICONS[key === 'maizAzul' ? 'maiz' : key];
    const grid = map.map(r => [...r].map(ch => { ch = (remap && remap[ch]) || ch; return ch === '.' ? null : this.PAL[ch]; }));
    const full = Array.from({ length: 16 }, (_, y) => Array.from({ length: 16 }, (_, x) => (grid[y] && grid[y][x]) || null));
    const sh = full.map((r, y) => r.map((c, x) => { if (!c) return c; const up = !(full[y - 1] && full[y - 1][x]) || !full[y][x - 1], dn = !(full[y + 1] && full[y + 1][x]) || !full[y][x + 1]; return up && !dn ? this.tint(c, 1.22) : dn && !up ? this.tint(c, 0.78) : c; }));
    for (let x = 3; x < 13; x++) if (!sh[15][x]) sh[15][x] = '#b89a6a';
    this.blit(g, this.outlinedSel(sh), 0, 0);
    ctx.putImageData(img, 0, 0);
  }
  spriteHD(kind) {
    const W = 28, H = 42, ox = 2, oy = 4, grid = Array.from({ length: H }, () => Array(W).fill(null));
    const set = (x, y, c) => { x += ox; y += oy; if (x >= 0 && y >= 0 && x < W && y < H) grid[y][x] = c; };
    const fill = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) set(x + i, y + j, c); };
    const ell = (cx, cy, rx, ry, c) => { for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx + 0.6) + (y * y) / (ry * ry + 0.6) <= 1) set(cx + x, cy + y, c); };
    const get = (x, y) => grid[y + oy] && grid[y + oy][x + ox];
    const C = {
      hero: { skin: '#c98a5a', skinS: '#a06a40', skinH: '#e0a878', hair: '#2a1a14', hairH: '#5a3a2a', top: '#f1e3c2', topS: '#cfb68a', topH: '#fff8e4', low: '#3a4a7a', lowS: '#2a3660', shoe: '#8a5a34', shoeS: '#5a3a22', belt: '#b8432f' },
      abuela: { skin: '#b97a50', skinS: '#946038', skinH: '#d4966a', hair: '#d8d0cc', hairH: '#f6f2f0', top: '#f1e3c2', topS: '#cfb68a', topH: '#fff8e4', low: '#2f5fa8', lowS: '#1e3c78', shoe: '#5a3a22', shoeS: '#3a2214', belt: '#7a3a8a' },
      guerrero: { skin: '#a8704a', skinS: '#845436', skinH: '#c48a60', hair: '#1a1010', hairH: '#3a2a2a', top: '#f1e3c2', topS: '#cfb68a', topH: '#fff8e4', low: '#a8704a', lowS: '#845436', shoe: '#8a5a34', shoeS: '#5a3a22', belt: '#f2c94c' },
      jugador: { skin: '#a8683a', skinS: '#844e2a', skinH: '#c4844e', hair: '#1a1010', hairH: '#3e2e2e', top: '#f6f2ea', topS: '#d4cabb', topH: '#ffffff', low: '#a8683a', lowS: '#844e2a', shoe: '#6a4428', shoeS: '#4a2e1a', belt: '#c0392b' },
      citlalmina: { skin: '#b07040', skinS: '#8c5630', skinH: '#c88a58', hair: '#1a1010', hairH: '#3e2e2e', top: '#f6f2ea', topS: '#d4cabb', topH: '#ffffff', low: '#2f5fa8', lowS: '#1e3c78', shoe: '#5a3a22', shoeS: '#3a2214', belt: '#2f8f8a' },
    }[kind];
    const skirt = kind === 'abuela' || kind === 'citlalmina', bare = kind === 'guerrero';
    const backLen = { jugador: 13, citlalmina: 19, guerrero: 10 }[kind];
    if (backLen) { fill(2, 8, 20, backLen, C.hair); for (let y = 8; y < 8 + backLen; y += 3) { set(3, y, C.hairH); set(20, y + 1, C.hairH); } }
    if (skirt) {
      for (let y = 27; y <= 34; y++) { const hw = 6 + Math.floor((y - 27) / 3); for (let x = 12 - hw; x < 12 + hw; x++) set(x, y, x >= 12 + hw - 2 ? C.lowS : x === 12 - hw + 1 ? '#4a7cc4' : C.low); }
      for (let x = 4; x < 20; x++) set(x, 32, kind === 'abuela' ? (x % 2 ? '#f2c94c' : '#b8432f') : (x % 2 ? '#f6f2ea' : '#3aa0a8'));
      fill(7, 35, 4, 1, C.shoe); fill(13, 35, 4, 1, C.shoe);
    } else {
      fill(7, 28, 4, 6, C.low); fill(13, 28, 4, 6, C.low); fill(10, 28, 1, 6, C.lowS); fill(16, 28, 1, 6, C.lowS);
      fill(6, 34, 5, 2, C.shoe); fill(13, 34, 5, 2, C.shoe); fill(6, 35, 5, 1, C.shoeS); fill(13, 35, 5, 1, C.shoeS); set(7, 34, '#a87a4a'); set(14, 34, '#a87a4a');
    }
    fill(6, 18, 12, 9, C.top); fill(16, 18, 2, 9, C.topS); fill(7, 19, 1, 6, C.topH); set(11, 22, C.topS); set(12, 23, C.topS); set(9, 24, C.topS);
    const sl = bare ? C.skin : C.top, slS = bare ? C.skinS : C.topS;
    fill(4, 18, 2, 4, sl); fill(18, 18, 2, 4, slS); fill(4, 22, 2, 4, C.skin); fill(18, 22, 2, 4, C.skinS);
    fill(4, 26, 2, 2, C.skin); fill(18, 26, 2, 2, C.skin); set(5, 27, C.skinS); set(19, 27, C.skinS); set(4, 22, C.skinH);
    fill(6, 26, 12, 1, C.belt);
    fill(10, 17, 4, 1, C.skinS);
    ell(12, 10, 8, 7, C.skin);
    for (let y = 2; y <= 17; y++) for (let x = 17; x <= 20; x++) if (get(x, y) === C.skin) set(x, y, C.skinS);
    for (let x = 6; x <= 18; x++) if (get(x, 16) === C.skin) set(x, 16, C.skinS);
    set(6, 9, C.skinH); set(6, 10, C.skinH); set(7, 14, C.skinH);
    fill(3, 10, 1, 2, C.skin); fill(21, 10, 1, 2, C.skinS);
    for (let y = 2; y <= 7; y++) for (let x = 3; x <= 21; x++) { const dx = (x - 12) / 9.2, dy = (y - 9) / 7; if (dx * dx + dy * dy <= 1) set(x, y, C.hair); }
    for (let x = 4; x <= 20; x++) if (![7, 11, 16].includes(x)) set(x, 8, C.hair);
    [5, 9, 13, 18].forEach(x => set(x, 9, C.hair));
    fill(3, 8, 2, 6, C.hair); fill(20, 8, 2, 6, C.hair);
    for (let x = 7; x <= 12; x++) set(x, 4, C.hairH); set(6, 5, C.hairH); set(13, 5, C.hairH); set(5, 6, C.hairH);
    [8, 15].forEach(x => { fill(x, 10, 2, 3, '#1a1010'); set(x, 10, '#fff8e4'); set(x + 1, 12, '#4a2a1a'); });
    fill(6, 13, 2, 1, '#e0846e'); fill(16, 13, 2, 1, '#e0846e'); set(12, 12, C.skinS); fill(11, 14, 2, 1, '#8a3a2a');
    if (kind === 'hero') {
      for (let k = 0; k < 9; k++) { set(6 + k, 18 + k, '#b8432f'); set(7 + k, 18 + k, '#f2c94c'); set(8 + k, 18 + k, '#2f8f8a'); }
      ell(12, 1, 5, 3, '#e0b46a'); for (let y = -2; y <= 4; y++) for (let x = 15; x <= 17; x++) if (get(x, y) === '#e0b46a') set(x, y, '#c89a50');
      fill(9, -1, 3, 1, '#f0cc84'); fill(7, 3, 11, 1, '#b8432f');
      fill(0, 4, 25, 1, '#e0b46a'); fill(1, 5, 23, 1, '#c89a50'); fill(2, 4, 7, 1, '#f0cc84');
    } else if (kind === 'abuela') {
      ell(12, 1, 3, 2, C.hair); set(11, 0, C.hairH); set(12, 0, C.hairH);
      fill(4, 18, 16, 5, '#7a3a8a'); for (let x = 4; x < 20; x++) { if (x % 2) { set(x, 19, '#c86aa8'); set(x, 21, '#c86aa8'); } if (x % 2 === 0) set(x, 23, '#7a3a8a'); }
      fill(17, 18, 3, 5, '#5a2468');
      [6, 16].forEach(x => { for (let y = 13; y < 23; y++) set(x + (y % 2), y, y % 2 ? C.hair : C.hairH); set(x, 23, '#b8432f'); set(x + 1, 23, '#b8432f'); });
      set(3, 12, '#f2c94c'); set(21, 12, '#f2c94c');
    } else if (kind === 'guerrero') {
      for (let x = 6; x < 18; x++) for (let y = 18; y < 26; y++) set(x, y, (x - 6) + (y - 18) < 9 ? (x >= 16 ? '#8f3324' : '#b8432f') : (x >= 16 ? C.topS : C.top));
      fill(8, 18, 8, 1, '#f2c94c'); fill(10, 26, 4, 5, '#b8432f'); fill(13, 26, 1, 5, '#8f3324');
      const pc = ['#2f8f8a', '#7cc04a', '#f2c94c', '#b8432f', '#2f8f8a', '#b8432f', '#f2c94c', '#7cc04a', '#2f8f8a'];
      for (let k = 0; k < 9; k++) { const x = 4 + k * 2, top = -4 + Math.abs(k - 4); for (let y = top; y <= 5; y++) { set(x, y, pc[k]); set(x + 1, y, y === top ? null : this.dark(pc[k]) === pc[k] ? pc[k] : pc[k]); } set(x, top, '#fff1b8'); }
      fill(4, 6, 17, 2, '#f2c94c'); for (let x = 5; x < 21; x += 3) set(x, 6, '#2f8f8a');
      for (let y = -3; y <= 35; y++) set(21, y, y < 0 ? (y === -3 ? '#6a6a7a' : '#3a3a4a') : '#8a5a34'); set(20, -1, '#3a3a4a'); set(22, -1, '#3a3a4a');
      for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const r2 = dx * dx + dy * dy; if (r2 <= 18) set(2 + dx, 25 + dy, r2 <= 3 ? '#f1e3c2' : r2 <= 9 ? '#b8432f' : '#f2c94c'); }
      [-1, 1, 3, 5].forEach((x, i) => { set(x, 30, i % 2 ? '#2f8f8a' : '#f1e3c2'); set(x, 31, i % 2 ? '#2f8f8a' : '#f1e3c2'); });
    } else if (kind === 'jugador') {
      fill(6, 27, 12, 4, C.top); fill(16, 27, 2, 4, C.topS); fill(6, 30, 12, 1, '#c0392b'); fill(8, 27, 1, 3, '#c0392b');
      fill(3, 7, 19, 1, '#c0392b'); set(4, 7, '#e05a4a'); set(5, 7, '#e05a4a'); fill(21, 8, 2, 1, '#c0392b'); set(22, 9, '#c0392b');
      for (let y = -1; y < 7; y++) { set(20, y, y < 2 ? '#c0392b' : '#e07a28'); if (y > 0 && y < 5) set(21, y - 1, y < 3 ? '#e05a4a' : '#f2a04a'); }
    } else if (kind === 'citlalmina') {
      set(12, 3, C.skinS); set(12, 4, C.skinS);
      fill(9, 18, 6, 1, '#2f5fa8'); for (let x = 8; x < 16; x++) for (let y = 19; y < 24; y++) if ((x + y) % 2) set(x, y, y === 21 ? '#2f5fa8' : '#3aa0a8');
      set(3, 12, '#f2c94c'); set(21, 12, '#f2c94c');
      set(19, 3, '#e05a7a'); set(20, 4, '#e05a7a'); set(18, 4, '#e05a7a'); set(19, 5, '#e05a7a'); set(19, 4, '#f2c94c');
    }
    return this.outlinedSel(grid);
  }
  drawChar(el, kind) {
    const W = 36, H = 42, ctx = el.getContext('2d'), img = ctx.createImageData(W, H), g = this.makeG(img.data, W, H);
    const grass = kind === 'jugador' || kind === 'citlalmina';
    if (grass) {
      g.rect(0, 0, W, H, '#6db84a');
      for (let i = 0; i < W; i += 12) g.rect(i, 0, 1, H, '#64ac44');
      for (let j = 6; j < H; j += 12) g.rect(0, j, W, 1, '#64ac44');
      [[4, 10], [31, 6], [32, 22], [3, 30], [17, 3], [10, 20]].forEach(([x, y]) => [[0, 0], [-1, -1], [1, -1], [0, -1], [0, -2]].forEach(([a, b]) => g.p(x + a, y + b, '#4f9a38')));
      [[7, 36], [27, 13], [33, 33], [2, 18]].forEach(([x, y], i) => { g.p(x, y, i % 2 ? '#f2c94c' : '#f6f2ea'); g.p(x + 1, y + 1, '#f6f2ea'); });
    } else {
      g.grad(['#3a2a58', '#4e2f62', '#7a3a68', '#a8475f', '#d4604f', '#ec8a4c', '#f6b25c'], 0, 33);
      g.disc(28, 25, 4, '#fff0c0'); g.disc(28, 25, 2, '#fffbe8');
      const n = this.noise(4);
      this.mountain(g, x => 20 + Math.abs(x - 12) * 0.55 + (n(x * 3) - 0.5) * 4, 34, { lit: '#94607e', mid: '#6e4c74', shade: '#4c3862', rim: '#f6a87e' }, true, { y: 22, n, lit: '#ffe6d4', shade: '#b4a2cc' });
      g.rect(0, 32, W, 10, '#64a040'); g.rect(0, 32, W, 1, '#8ccc5a');
      for (let i = 0; i < 24; i++) g.p((i * 7) % W, 34 + (i * 3) % 8, i % 2 ? '#8ccc5a' : '#4f8836');
    }
    const cx = kind === 'jugador' ? 14 : 18;
    for (let y = -1; y <= 1; y++) for (let x = -9; x <= 9; x++) if (x * x / 81 + y * y <= 1) g.p(cx + x, 40 + y, grass ? '#559a3a' : '#4f8836');
    if (kind === 'jugador') {
      this.blit(g, this.spriteHD(kind), 0, 0);
      const gato = ['................', '.X..X...........', '.XOOX...........', '.OCCCC.....O....', '.CXCXC....O.....', '.CCVCC...CO.....', '..CCCCCCOOCC....', '..CCCCCCOOXCC...', '..CCCCCCCCCCC...', '...C.C....C.C...', '...C.C....C.C...', '................'];
      for (let x = -6; x <= 6; x++) g.p(29 + x, 40, '#559a3a');
      this.blit(g, this.outlinedSel(gato.map(r => [...r].map(ch => ch === '.' ? null : this.PAL[ch]))), 21, 29);
    } else this.blit(g, this.spriteHD(kind), 4, 0);
    ctx.putImageData(img, 0, 0);
  }
  rnd(seed) { let s = seed; return () => (s = (s * 9301 + 49297) % 233280) / 233280; }
  noise(seed) {
    const R = this.rnd(seed), pts = Array.from({ length: 128 }, R);
    const n = x => { const xi = Math.floor(x), t = x - xi, a = pts[((xi % 128) + 128) % 128], b = pts[(((xi + 1) % 128) + 128) % 128], s = t * t * (3 - 2 * t); return a + (b - a) * s; };
    return x => n(x / 24) * 0.55 + n(x / 9 + 40) * 0.3 + n(x / 3 + 80) * 0.15;
  }
  makeG(d, W, H) {
    const cache = {}, B = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
    const rgb = h => cache[h] || (cache[h] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)));
    const g = {
      W, H,
      p(x, y, c) { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= W || y >= H) return; const v = rgb(c), i = (y * W + x) * 4; d[i] = v[0]; d[i + 1] = v[1]; d[i + 2] = v[2]; d[i + 3] = 255; },
      rect(x, y, w, h, c) { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) g.p(x + i, y + j, c); },
      on(x, y, t) { x = Math.round(x); y = Math.round(y); return t * 16 > B[((y & 3) << 2) + (x & 3)] + 0.5; },
      dp(x, y, c, t) { if (g.on(x, y, t)) g.p(x, y, c); },
      disc(cx, cy, r, c) { for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r) g.p(cx + x, cy + y, c); },
      glow(cx, cy, r0, r1, c, k) { for (let y = -r1; y <= r1; y++) for (let x = -r1; x <= r1; x++) { const dd = Math.hypot(x, y); if (dd > r0 && dd <= r1) g.dp(cx + x, cy + y, c, k * (1 - (dd - r0) / (r1 - r0))); } },
      grad(stops, y0, y1) { for (let y = y0; y < y1; y++) { const f = (y - y0) / (y1 - y0) * (stops.length - 1), i = Math.min(stops.length - 2, Math.floor(f)), t = f - i; for (let x = 0; x < W; x++) g.p(x, y, g.on(x, y, t) ? stops[i + 1] : stops[i]); } },
    };
    return g;
  }
  mountain(g, hf, base, c, lightRight, snow) {
    for (let x = 0; x < g.W; x++) {
      const top = Math.round(hf(x)); if (top >= base) continue;
      const s = (hf(x + 1) - hf(x - 1)) * (lightRight ? 1 : -1);
      const col = s > 0.6 ? c.lit : s < -0.6 ? c.shade : c.mid;
      const alt = s > 0 ? c.lit : c.shade;
      for (let y = top; y < base; y++) {
        let cc = col;
        if (Math.abs(s) > 0.25 && Math.abs(s) <= 0.6 && g.on(x, y, 0.5)) cc = alt;
        if (snow && y < snow.y + snow.n(x * 3) * 9) cc = s > -0.2 ? snow.lit : snow.shade;
        else if (c.haze && g.on(x, y, Math.min(0.75, (y - top) / (base - top) * c.hazeK))) cc = c.haze;
        if (y === top && c.rim && s > 0.1) cc = c.rim;
        g.p(x, y, cc);
      }
    }
  }
  cloud(g, cx, cy, w, h, dark, light, R) {
    for (let i = 0; i < 5; i++) {
      const lx = cx - w / 2 + (i + 0.5) * w / 5 + (R() - 0.5) * 4, rx = w / 5 * 0.8 + R() * 4, ry = h * (0.5 + R() * 0.5), ly = cy - ry * 0.4;
      for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) {
        const yy = ly + y; if (yy > cy + 1 || (x * x) / (rx * rx) + (y * y) / (ry * ry) > 1) continue;
        g.p(lx + x, yy, g.on(lx + x, yy, (yy - (cy - h)) / (h + 1) * 0.95) ? light : dark);
      }
    }
  }
  maize(g, x, y, s, R) {
    const h = Math.round((15 + R() * 5) * s);
    for (let i = 0; i < h; i++) g.p(x, y - i, i < h * 0.35 ? '#4a7a2e' : '#62a03c');
    for (let k = 0; k < 4; k++) {
      const ly = y - Math.round(h * (0.22 + k * 0.17)), dir = k % 2 ? 1 : -1, L = Math.round((7 + R() * 3) * s * (1 - k * 0.15));
      for (let j = 1; j <= L; j++) {
        const t = j / L, yy = ly - Math.round(Math.sin(t * 2.2) * 2.5 * s) + Math.round(t * t * 2 * s);
        g.p(x + dir * j, yy, t < 0.5 ? '#8ccc52' : '#62a03c');
        if (s > 1 && t < 0.6) g.p(x + dir * j, yy + 1, '#4a7a2e');
      }
    }
    const ty = y - h;
    g.p(x, ty - 1, '#f2d36a'); g.p(x, ty - 2, '#f2d36a'); g.p(x - 1, ty, '#e0b04a'); g.p(x + 1, ty, '#e0b04a'); g.p(x - 2, ty + 1, '#c8963a'); g.p(x + 2, ty + 1, '#c8963a');
    const ey = y - Math.round(h * 0.45);
    g.rect(x + 1, ey, 2, Math.max(2, Math.round(3 * s)), '#f2c94c'); g.p(x + 1, ey - 1, '#9ccf6a'); g.p(x + 2, ey + 1, '#d9a83a');
  }
  maguey(g, x, y, s) {
    [-75, 75, -55, 55, -35, 35, -15, 15, 0].forEach((a, i) => {
      const r = a * Math.PI / 180, L = (16 - Math.abs(a) / 12) * s, back = i < 4;
      for (let j = 0; j < L; j++) {
        const t = j / L, w = Math.max(0, Math.round(2.4 * s * (1 - t))), cx = x + Math.sin(r) * j, cy = y - Math.cos(r) * j + (Math.abs(a) > 50 ? t * t * 4 * s : 0);
        for (let k = -w; k <= w; k++) g.p(cx + k * Math.cos(r), cy + k * Math.sin(r), k < 0 ? (back ? '#5f8f7a' : '#9cccb0') : (back ? '#355a4c' : '#5f8f7a'));
        if (t > 0.88) g.p(cx, cy, '#2a3a30');
      }
    });
  }
  house(g, x, y) {
    g.rect(x, y - 15, 28, 15, '#dcb88c'); g.rect(x + 28, y - 15, 9, 15, '#b48a62');
    for (let i = 0; i < 24; i++) g.p(x + 1 + (i * 7) % 26, y - 2 - (i * 5) % 12, '#c9a274');
    g.rect(x, y - 14, 37, 1, '#9a7452');
    for (let r = 0; r < 7; r++) for (let i = x - 3; i < x + 41; i++) g.p(i, y - 21 + r, r === 0 ? '#6a2018' : r === 6 ? '#7a2a1e' : (((i - x) >> 1) & 1) ? '#c4503a' : '#8f3324');
    g.rect(x + 11, y - 10, 6, 10, '#5a3420'); g.rect(x + 10, y - 11, 8, 1, '#3a2214'); g.rect(x + 13, y - 10, 1, 10, '#3a2214');
    g.rect(x + 3, y - 11, 5, 4, '#3a2a3a'); g.rect(x + 2, y - 7, 7, 1, '#f1e3c2');
    g.rect(x + 30, y - 11, 4, 4, '#2a1e2a');
    g.rect(x + 21, y - 4, 4, 4, '#b8432f'); g.p(x + 21, y - 5, '#e05a7a'); g.p(x + 23, y - 6, '#f2c94c'); g.p(x + 24, y - 5, '#e05a7a'); g.p(x + 22, y - 5, '#5f9e3a');
  }
  church(g, x, y) {
    const Wt = '#f4ead6', Ws = '#cfc2a6', Rd = '#c4583a', Rk = '#9a3a28';
    g.disc(x, y - 16, 4, '#e8d8b8'); g.rect(x, y - 23, 1, 3, Wt);
    g.rect(x - 6, y - 13, 12, 13, Wt); g.rect(x + 3, y - 13, 3, 13, Ws);
    g.rect(x - 2, y - 7, 4, 7, '#3a2a3a'); g.p(x - 1, y - 8, '#3a2a3a'); g.p(x, y - 8, '#3a2a3a');
    [-10, 6].forEach(o => {
      g.rect(x + o, y - 24, 4, 24, Wt); g.rect(x + o + 3, y - 24, 1, 24, Ws);
      for (let j = 0; j < 12; j++) for (let i = 0; i < 4; i++) g.p(x + o + i, y - 12 + j, (i + j) % 2 ? Rd : Rk);
      g.rect(x + o + 1, y - 21, 2, 3, '#3a2a3a'); g.rect(x + o + 1, y - 26, 2, 2, Wt); g.p(x + o + 1, y - 28, '#3a2a3a'); g.p(x + o + 1, y - 27, '#3a2a3a');
    });
  }
  tree(g, x, y, s) {
    g.rect(x - 1, y - 8 * s, Math.max(1, 2 * s), 8 * s, '#5a3a22');
    [[0, -12, 6], [-4, -9, 5], [4, -9, 5], [0, -7, 5]].forEach(([dx, dy, r]) => g.disc(x + dx * s, y + dy * s, Math.round(r * s), '#3f7a3a'));
    [[2, -13, 3], [5, -10, 2]].forEach(([dx, dy, r]) => g.disc(x + dx * s, y + dy * s, Math.max(1, Math.round(r * s)), '#62a04a'));
  }
  sceneA(g) {
    const R = this.rnd(7);
    g.grad(['#1c1838', '#2e2450', '#4e2f62', '#7a3a68', '#a8475f', '#d4604f', '#ec8a4c', '#f6b25c', '#fbd68a'], 0, 132);
    for (let i = 0; i < 40; i++) g.p(R() * 320, R() * 24, R() < 0.3 ? '#ffffff' : '#a99ad8');
    g.glow(252, 100, 12, 60, '#f7c46a', 0.5); g.glow(252, 100, 12, 26, '#fde3a0', 0.8); g.disc(252, 100, 12, '#fff0c0'); g.disc(252, 100, 9, '#fffbe8');
    [[60, 62, 56, 7], [206, 52, 80, 9], [130, 80, 44, 5], [296, 72, 44, 6], [20, 88, 30, 4]].forEach(([x, y, w, h]) => this.cloud(g, x, y, w, h, '#8a3f62', '#f2986c', R));
    const n1 = this.noise(3), n2 = this.noise(9);
    const far = x => Math.min(76 + Math.abs(x - 36) * 0.8 + (n1(x * 2) - 0.5) * 4, 90 + (n2(x * 2) - 0.5) * 8 + Math.max(0, Math.abs(x - 98) - 30) * 0.7);
    this.mountain(g, far, 132, { lit: '#a66e8c', mid: '#8e5d80', shade: '#744c70' }, true, { y: 88, n: n2, lit: '#f8dcd8', shade: '#c8a8c4' });
    const n3 = this.noise(5), mal = x => 60 + Math.pow(Math.abs(x - 152) / 70, 1.3) * 46 + (n3(x * 1.5) - 0.5) * 12;
    this.mountain(g, mal, 140, { lit: '#94607e', mid: '#6e4c74', shade: '#4c3862', rim: '#f6a87e', haze: '#a8607a', hazeK: 0.9 }, true, { y: 72, n: n3, lit: '#ffe6d4', shade: '#b4a2cc' });
    const n4 = this.noise(12), h1 = x => 114 + (n4(x * 1.2) - 0.5) * 24;
    this.mountain(g, h1, 180, { lit: '#7a9a52', mid: '#627f48', shade: '#4a663e', rim: '#c8b46a' }, true);
    for (let i = 0; i < 16; i++) { const x = R() * 320; if (Math.abs(x - 284) > 14) this.tree(g, x, h1(x) + 5, 0.5); }
    this.church(g, 284, Math.round(h1(284)) + 3);
    const n5 = this.noise(21), h2 = x => 138 + (n5(x * 1.4) - 0.5) * 14;
    this.mountain(g, h2, 180, { lit: '#7ab84c', mid: '#64a040', shade: '#4f8836', rim: '#d8d070' }, true);
    for (let i = 0; i < 500; i++) { const x = R() * 320; g.p(x, h2(x) + 3 + R() * 40, R() < 0.5 ? '#8ccc5a' : '#4a7c32'); }
    for (let y = 180; y > 150; y--) {
      const k = 180 - y, cx = 186 + k * 1.5 + Math.sin(k / 8) * 3, w = 2 + (y - 150) * 0.32;
      for (let x = -w; x <= w; x++) g.p(cx + x, y, Math.abs(x) > w - 1 ? '#a5733f' : '#cf9e62');
      if (R() < 0.4) g.p(cx + (R() - 0.5) * w, y, '#e6bc82');
    }
    this.tree(g, 214, 153, 1);
    this.house(g, 226, 153);
    for (let x = 270; x < 320; x += 6) g.rect(x, 146, 1, 8, '#6a4428');
    g.rect(270, 148, 50, 1, '#8a5a34'); g.rect(270, 151, 50, 1, '#8a5a34');
    [[150, 0.75], [162, 0.95], [176, 1.25]].forEach(([y, s]) => {
      g.rect(0, y, 150 - (y - 150), 2, '#6a4a2c'); g.rect(0, y, 150 - (y - 150), 1, '#8a6238');
      for (let x = 4 + R() * 4; x < 150 - (y - 150); x += 7 * s + R() * 2) this.maize(g, Math.round(x), y, s, R);
    });
    this.maguey(g, 300, 179, 1.3); this.maguey(g, 262, 172, 0.8); this.maguey(g, 166, 179, 0.9);
    [[96, 30], [104, 34], [90, 37]].forEach(([x, y]) => [[0, 0], [-1, -1], [1, -1], [-2, -1], [2, -1]].forEach(([a, b]) => g.p(x + a, y + b, '#2a1a38')));
  }
  // Paints a scene method (e.g. 'sceneA') into a canvas at its native resolution.
  paint(cv, scene) {
    const ctx = cv.getContext('2d'), img = ctx.createImageData(cv.width, cv.height);
    this[scene](this.makeG(img.data, cv.width, cv.height));
    ctx.putImageData(img, 0, 0);
  }
}
window.Tlax = window.Tlax || {};
window.Tlax.pixel = new PixelArt();
})();
