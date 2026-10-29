// Exporta el arte del mundo a PNG (1× = cuadro de 32 px, 2× = 64 px) y mundo.json.
// Uso:  node propuestas-final/mundo/exportar.js   (necesita Playwright con Chromium)
"use strict";
const fs = require('fs'), path = require('path');
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
global.window = {};
require(path.join(__dirname, '../../propuestas-v2/chars.js'));
require(path.join(__dirname, 'mundo-art.js'));
const M = window.CdmMundo, { CAST, PLAYER } = window.TlaxChars;
const OUT = path.join(__dirname, 'export');

// Each job: [file, svg inner, width, height] in 2× units (64 per tile).
const jobs = [];
const cast = [PLAYER, ...CAST];
for (const p of cast) {
  let s = ''; M.DIRS.forEach((d, r) => { for (let f = 0; f < 4; f++) s += `<g transform="translate(${f * 64} ${r * 96})">${M.character(p, d, f)}</g>`; });
  jobs.push([`personajes/${p.id}`, s, 256, 384]);
}
{ let s = ''; M.DIRS.forEach((d, r) => M.ACTS.forEach((a, ai) => [0, 1].forEach(f => { s += `<g transform="translate(${(ai * 2 + f) * 64} ${r * 96})">${M.character(PLAYER, d, f, a)}</g>`; }))); jobs.push(['jugador-acciones', s, 384, 384]); }
const tileNames = Object.keys(M.TILES);
{ const cols = 7; let s = ''; tileNames.forEach((k, i) => { s += `<g transform="translate(${(i % cols) * 64} ${Math.floor(i / cols) * 64})">${M.TILES[k]()}</g>`; }); jobs.push(['terreno', s, cols * 64, Math.ceil(tileNames.length / cols) * 64]); }
const cropNames = Object.keys(M.CROPS), maxStages = Math.max(...cropNames.map(t => M.CROPS[t].length));
{ let s = ''; cropNames.forEach((t, r) => M.CROPS[t].forEach((_, e) => { s += `<g transform="translate(${e * 64} ${r * 128})">${M.crop(t, e)}</g>`; })); jobs.push(['cultivos', s, maxStages * 64, cropNames.length * 128]); }
for (const k of Object.keys(M.SEEDS)) jobs.push([`semillas/semilla-${k}`, M.semilla(k), 64, 64]);

(async () => {
  for (const d of ['personajes', 'semillas']) fs.mkdirSync(path.join(OUT, d), { recursive: true });
  const b = await chromium.launch(), pg = await b.newPage();
  for (const [file, inner, w, h] of jobs) for (const [scale, suf] of [[.5, ''], [1, '@2x']]) {
    await pg.setViewportSize({ width: Math.ceil(w * scale) + 8, height: Math.ceil(h * scale) + 8 });
    await pg.setContent(`<body style="margin:0;background:transparent">${M.svg(inner, w, h, w * scale, h * scale)}</body>`);
    await (await pg.$('svg')).screenshot({ path: path.join(OUT, `${file}${suf}.png`), omitBackground: true });
  }
  await b.close();
  const meta = {
    escala: { '1x': 'cuadro de 32 px', '@2x': 'cuadro de 64 px' },
    personajes: { archivo: 'personajes/<id>.png', cuadro: [32, 48], filas: M.DIRS, columnas: 'caminar 0–3 (el 0 sirve de quieto)', pies: 'centro abajo del cuadro', ids: cast.map(p => p.id) },
    acciones: { archivo: 'jugador-acciones.png', cuadro: [32, 48], filas: M.DIRS, columnas: ['arar-0', 'arar-1', 'regar-0', 'regar-1', 'cosechar-0', 'cosechar-1'] },
    terreno: { archivo: 'terreno.png', cuadro: [32, 32], columnas: 7, orden: tileNames, notas: 'orilla-* va encima de la tierra o el camino del lado que toca pasto; agua-1 y agua-2 alternan cada 0.6 s' },
    cultivos: { archivo: 'cultivos.png', cuadro: [32, 64], filas: cropNames, etapas: Object.fromEntries(cropNames.map(t => [t, M.CROPS[t].length])), apoyo: 'la mitad de abajo del cuadro va sobre la casilla de tierra' },
    semillas: Object.keys(M.SEEDS).map(k => `semillas/semilla-${k}.png`),
  };
  fs.writeFileSync(path.join(OUT, 'mundo.json'), JSON.stringify(meta, null, 2));
  console.log('archivos', jobs.length * 2 + 1);
})();
