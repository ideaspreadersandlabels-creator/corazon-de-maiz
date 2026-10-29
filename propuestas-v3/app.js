// v3 options page: 4 title landscapes (with the Talavera menu) and 4 character styles.
"use strict";
(function () {
  const X = window.TlaxTex, SC = window.TlaxScenes, F = window.TlaxFigs, { chibi, CAST, PLAYER } = window.TlaxChars;
  const root = document.documentElement.style;
  root.setProperty('--deco', `url(${X.decoTile()})`); root.setProperty('--plain', `url(${X.plainTiles()})`); root.setProperty('--cobalt', `url(${X.cobaltTile()})`);

  const cacao = '<svg class="mini" viewBox="0 0 64 64"><path d="M32 6 C 50 14 50 50 32 58 C 14 50 14 14 32 6Z" fill="#a8521e" stroke="#3a2418" stroke-width="3"/></svg>';
  const glyph = `<svg class="glyph" viewBox="0 0 120 110"><path d="M14 104 C 14 60 34 30 60 30 C 86 30 106 60 106 104 Z" fill="#4f8f4a" stroke="#1a1410" stroke-width="4"/><path d="M14 92 H106 V104 H14Z" fill="#d39a26" stroke="#1a1410" stroke-width="4"/><ellipse cx="60" cy="30" rx="26" ry="7" fill="#f3e2b8" stroke="#1a1410" stroke-width="3"/><path d="M30 10 C 34 6 50 8 56 22 L48 24 C 44 18 38 16 32 18 Z" fill="#c48a5a" stroke="#1a1410" stroke-width="3"/><path d="M90 50 C 86 54 70 52 64 38 L72 36 C 76 42 82 44 88 42 Z" fill="#c48a5a" stroke="#1a1410" stroke-width="3"/></svg>`;
  const inicio = scene => `<div class="ab inicio">${scene}
    <div class="pnl logo">${glyph}<div><div class="logo__n">Tlaxcallan</div><div class="logo__t">Año 1-Ácatl · 1519 · llegan extranjeros por el oriente</div></div></div>
    <div class="pnl tmenu"><div class="tm tm--on" data-sel="tm"><span>Continuar</span><small>Día 3 · veintena Tlacaxipehualiztli · ${cacao} 900 300</small></div>
      <div class="tm" data-sel="tm"><span>Nueva partida</span><small>Hereda la milpa de tu abuela</small></div>
      <div class="tm" data-sel="tm"><span>Opciones</span><small>Volumen, idioma y mensajes</small></div>
      <div class="keys"><span><kbd>▲▼</kbd>elegir</span><span><kbd>Enter</kbd>aceptar</span></div></div>
    <div class="foot">Señorío de Tlaxcallan · Tepetícpac · Ocotelulco · Tizatlán · Quiahuiztlán · en guerra con Tenochtitlan</div></div>`;

  const LAND = [
    ['A', 'Plano geométrico', 'El estilo actual de tu juego, más pulido: facetas de luz y sombra, sol de atardecer, teocalli, casa de adobe con techo de paja y el estandarte de la garza blanca junto a la milpa.', SC.plano()],
    ['B', 'Papel recortado', 'Capas de papel de colores con sombra entre ellas, como un diorama o un papel picado. Se presta a parallax: cada capa puede moverse a distinta velocidad.', SC.papel()],
    ['C', 'Lienzo de Tlaxcala', 'Inspirado en el Lienzo de Tlaxcala, pintado por los tlaxcaltecas sobre la conquista: tinta negra sobre algodón y la Malinche como glifo de cerro con su falda azul. Lleva el río Atoyac, huellas como camino y glosas escritas a mano.', SC.lienzo()],
    ['D', 'Mural de Talavera', 'El paisaje pintado a pincel en cobalto, ocre y verde sobre azulejos con juntas y brillo. Combina directamente con los menús que te gustaron.', SC.talavera()],
  ];
  const SAMPLE = [PLAYER, CAST[2], CAST[4], CAST[8], CAST[9], CAST[11]];
  const cap = p => `<figcaption>${p.name}${p.romance ? ' ♥' : ''}<small>${p.role}</small></figcaption>`;
  const STY = [
    ['1', 'Chibi (el actual)', 'Cabeza grande y cuerpo pequeño, como los vecinos de tu plaza. Es el que te mandé antes, como referencia.', p => `<div class="niche">${chibi(p)}</div>`],
    ['2', 'Cuento ilustrado', 'Proporciones más reales (unas 4½ cabezas), caras más finas, ropa hasta el tobillo y sombreado suave. Más elegante y épico, y queda bien en retratos y escenas de diálogo.', p => `<div class="niche">${F.cuento(p)}</div>`],
    ['3', 'Lienzo de Tlaxcala', 'Como los códices: cabeza de perfil, torso de frente, tinta gruesa y colores planos. Incluye la vírgula de la palabra delante de la boca. Es el más tlaxcalteca y el más original.', p => `<div class="cotton">${F.lienzo(p)}</div>`],
    ['4', 'Azulejo pintado', 'Cada personaje pintado en cobalto sobre azulejo blanco, como una pieza de Talavera. Ideal para retratos en los menús, cartas o la pantalla de Vecinos.', p => `<div class="tilefig">${chibi(p)}</div>`],
  ];

  document.getElementById('app').innerHTML = `
    <section class="sec"><h2>Paisaje de inicio · 4 opciones</h2><p>Todas usan el menú de azulejo y ninguna es realista. Elige una o dime qué combinar.</p>
      <div class="opts">${LAND.map(([k, n, d, s]) => `<figure class="board"><div class="fit">${inicio(s)}</div><figcaption><b>${k} · ${n}</b> — ${d}</figcaption></figure>`).join('')}</div></section>
    <section class="sec"><h2>Personajes · 4 estilos</h2><p>Los mismos seis personajes en cada estilo: Tú, Nalin, Kaya, Naara, Yeyetzi y Yuki.</p>
      <div class="styles">${STY.map(([k, n, d, fn]) => `<div class="srow"><h3><span>ESTILO ${k}</span>${n}</h3><p>${d}</p><div class="line">${SAMPLE.map(p => `<figure>${fn(p)}${cap(p)}</figure>`).join('')}</div></div>`).join('')}</div></section>`;

  const fits = [...document.querySelectorAll('.fit')];
  const fit = () => fits.forEach(f => f.firstElementChild.style.setProperty('--k', f.clientWidth / 960));
  new ResizeObserver(fit).observe(document.body); fit();
  document.addEventListener('click', e => { const el = e.target.closest('[data-sel]'); if (!el) return; el.parentElement.querySelectorAll('[data-sel]').forEach(x => x.classList.toggle('tm--on', x === el)); });
})();
