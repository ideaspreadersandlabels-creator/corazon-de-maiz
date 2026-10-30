// Graba las escenas del intro que faltan como clips de 768×768 a 24 fps, con acercamiento lento de cámara (mismo formato que
// los videos animados), cuadro por cuadro con captura.html. Uso: node grabar.js <carpeta-salida>
"use strict";
const { spawn } = require('child_process'), path = require('path'), fs = require('fs');
let chromium; try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const OUT = process.argv[2] || path.join(__dirname, 'clips');
const FPS = 24, FRAMES = 175;                 // 7.29 s, como los clips de 7.296 s
// [archivo, capítulo, segundo de inicio en la canción del intro]
const CLIPS = [
  ['01-malinche', 0, 3.0],     // el corazón de maíz se arma sobre la Malinche de noche
  ['04-valle', 3, 54.6],       // amanece en Tlaxcallan; pasan las garzas
  ['07-maizal', 6, 95.4],      // el viento dobla el maizal: «corazón de maíz»
  ['08-mujeres', 7, 122.3],    // las mujeres del valle junto al río
  ['09-barco', 8, 133.4],      // casas que flotan entre la niebla
  ['10-amanecer', 9, 155.5],   // amanecer y tus huellas en el camino
];
(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 960, height: 960 }, deviceScaleFactor: .8 });
  await p.goto('file://' + path.join(__dirname, 'captura.html')); await p.evaluate(() => document.fonts.ready);
  for (const [name, ch, t0] of CLIPS) {
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-vf', 'format=yuv420p',
      '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', '-r', String(FPS), path.join(OUT, name + '.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = 0; f < FRAMES; f++) {
      const k = f / (FRAMES - 1), z = 1 + .3 * (k * k * (3 - 2 * k));   // acercamiento suave de 1 a 1.3
      await p.evaluate(([ch, t, z]) => renderAt(ch, t, z), [ch, t0 + f / FPS, z]);
      const buf = await p.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
    console.log('listo', name);
  }
  await b.close();
})();
