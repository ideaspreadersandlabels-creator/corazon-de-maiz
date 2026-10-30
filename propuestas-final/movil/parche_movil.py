"""Parche para que Corazón de Maíz se vea bien en el celular.

El juego dibuja toda la interfaz en un canvas pensado para pantallas de computadora
(unos 1280 px de ancho). En un celular (412 px) los paneles se enciman y tapan el campo.
Este parche agrega una escala de interfaz UIK: si la pantalla mide menos de 600 de
ancho o 560 de alto, el juego dibuja como si midiera eso y todo se reduce en proporción.
El mundo conserva su tamaño (el zoom se ajusta solo) y los toques se convierten a la
misma escala, así que los botones siguen respondiendo donde se ven.

Uso:  python3 parche_movil.py ruta/a/index.html     (modifica el archivo; idempotente)
"""
import sys

path = sys.argv[1]
s = open(path, encoding='utf-8').read()
if 'globalThis.UIK' in s:
    print('ya estaba aplicado'); sys.exit(0)

DPR = 'Math.min(2, Math.max(1, Math.round(devicePixelRatio || 1)))'

def rep(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, f'esperaba {count} y hay {n}: {old[:70]}'
    s = s.replace(old, new)

# 1. Escala de interfaz al cambiar el tamaño de la pantalla.
rep(f"""  const dpr = {DPR};
  VW = Math.max(1, innerWidth); VH = Math.max(1, innerHeight); 
  cv.width = VW * dpr; cv.height = VH * dpr; cv.style.width = VW + 'px'; cv.style.height = VH + 'px';""",
f"""  // UIK: en pantallas chicas (celular) la interfaz se dibuja en un lienzo virtual de al
  // menos 640×560 y se reduce en proporción; los toques se convierten con la misma escala.
  // La portada ya se adapta sola: ahí no se escala.
  globalThis.UIK = UI.menu === 'title' ? 1 : Math.min(1, Math.max(1, innerWidth) / 600, Math.max(1, innerHeight) / 560);
  const dpr = {DPR} * UIK;
  VW = Math.max(1, innerWidth) / UIK; VH = Math.max(1, innerHeight) / UIK;
  cv.width = Math.round(VW * dpr); cv.height = Math.round(VH * dpr); cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';""")

# 2. Los demás lugares que dibujan con el dpr: multiplicar por UIK (no en el onResize de R27,
#    que ya trabaja con innerWidth en pixeles reales).
r27 = s.index('const onResize = () => {\n    const w = Math.max(1, innerWidth)')
head, tail = s[:r27], s[r27:]
end = tail.index('};') + 2
protected, tail = tail[:end], tail[end:]
head = head.replace(DPR, f'({DPR} * (globalThis.UIK || 1))')
tail = tail.replace(DPR, f'({DPR} * (globalThis.UIK || 1))')
# el primero (resize) ya quedó reescrito arriba; deshacer el doble escalado ahí
head = head.replace(f'const dpr = ({DPR} * (globalThis.UIK || 1))) * UIK;', f'const dpr = {DPR} * UIK;')
s = head + protected + tail

# 3. Resolución reducida (resWant): mantener el tamaño CSS real.
rep("cv.style.width = VW + 'px'; cv.style.height = VH + 'px'; ctx.imageSmoothingEnabled = false;",
    "cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'; ctx.imageSmoothingEnabled = false;")
rep("Math.round(VW * dpr * sc);", "Math.round(VW * dpr * sc);")  # (ya usa el dpr escalado)
rep("R28.glCv.width !== W || R28.glCv.height !== H) { R28.glCv.width = W; R28.glCv.height = H; }",
    "R28.glCv.width !== Math.round(W) || R28.glCv.height !== Math.round(H)) { R28.glCv.width = Math.round(W); R28.glCv.height = Math.round(H); }")

# 3b. Al salir o volver a la portada, recalcular la escala.
rep("function update(dt) {\n  T += dt;",
    "function update(dt) {\n  T += dt;\n  { const t = UI.menu === 'title'; if (UI._uikTitle !== t) { UI._uikTitle = t; resize(); } }")

# 4. Toques y mouse: el navegador entrega las coordenadas ya convertidas a la escala.
#    También agranda los botones táctiles para que sigan siendo fáciles de tocar.
rep("const JOY = { x:() => 84, y:() => VH - 190, r:54 };",
"""// Coordenadas de toque y mouse en la escala de la interfaz (ver UIK en resize).
{
  // Toques y mouse leen clientX/clientY ya divididos entre UIK (solo cambia en celular).
  for (const proto of [MouseEvent.prototype, typeof Touch !== 'undefined' && Touch.prototype].filter(Boolean))
    for (const prop of ['clientX', 'clientY']) {
      const d = Object.getOwnPropertyDescriptor(proto, prop);
      if (d && d.get) Object.defineProperty(proto, prop, { configurable:true, enumerable:d.enumerable, get() { return d.get.call(this) / (globalThis.UIK || 1); } });
    }
}
const TB = () => (globalThis.UIK || 1) < 1 ? 1.35 : 1;   // botones táctiles más grandes en celular
const JOY = { x:() => 84 * TB(), y:() => VH - 190 * TB(), get r() { return 54 * TB(); } };""")
rep("const big = [['use', 'Usar', VW - 112, VH - 250, 34, inT ? inAct : useTool], ['act', 'E', VW - 186, VH - 196, 28, inT ? inAct : interactFacing], ['atk', 'R', VW - 186, VH - 290, 24, attack]];",
    "const k = TB(), big = [['use', 'Usar', VW - 112*k, VH - 250*k, 34*k, inT ? inAct : useTool], ['act', 'E', VW - 186*k, VH - 196*k, 28*k, inT ? inAct : interactFacing], ['atk', 'R', VW - 186*k, VH - 290*k, 24*k, attack]];")
rep("...small.map(([id, label, act], i) => ({ id, label, x:34, y:180 + i*50, r:20, act }))];",
    "...small.map(([id, label, act], i) => ({ id, label, x:34*k, y:180*k + i*50*k, r:20*k, act }))];")
rep("const dx = t.clientX - JOY.x(), dy = t.clientY - JOY.y(), d = Math.hypot(dx, dy), m = Math.min(d, 46);",
    "const dx = t.clientX - JOY.x(), dy = t.clientY - JOY.y(), d = Math.hypot(dx, dy), m = Math.min(d, 46 * TB());")
rep("circ('rgba(255,246,208,.75)', jx + (UI.joy?.dx || 0), jy + (UI.joy?.dy || 0), 22);",
    "circ('rgba(255,246,208,.75)', jx + (UI.joy?.dx || 0), jy + (UI.joy?.dy || 0), 22 * TB());")

# 5. Menú de Opciones: «Volver» al final, desplazamiento cuando no caben las filas, y las
#    filas genéricas (Gráficos, etc.) muestran su valor y se pueden tocar.
rep("const pRows = SHOPS.pausa.rows(), oRows = SHOPS.ajustes.rows();",
    "const pRows = SHOPS.pausa.rows(), oRows = (rows => [...rows.filter(r => r.name !== 'Volver'), ...rows.filter(r => r.name === 'Volver')])(SHOPS.ajustes.rows());")
rep("""    const rh = 40, h = oRows.length * rh + 26;
    codexPanel(x, top, ow, h);
    const lx = x + 18, cx0 = x + Math.round(ow * 0.42), cw = ow - (cx0 - x) - 40;
    oRows.forEach((r, i) => {
      const ry = top + 14 + i * rh, on = inOpts && i === UI.shopSel;""",
"""    const rh = 40, vis = Math.max(4, Math.min(oRows.length, Math.floor((maxH - 26) / rh))), h = vis * rh + 26;
    if (inOpts) { UI.optScroll = Math.max(0, Math.min(UI.optScroll || 0, oRows.length - vis));
      if (UI.shopSel < UI.optScroll) UI.optScroll = UI.shopSel;
      if (UI.shopSel >= UI.optScroll + vis) UI.optScroll = UI.shopSel - vis + 1; } else UI.optScroll = 0;
    const o0 = UI.optScroll;
    codexPanel(x, top, ow, h);
    if (o0 > 0) text('▲', x + ow/2, top + 11, 10, UIC.muted, 'center');
    if (o0 + vis < oRows.length) text('▼', x + ow/2, top + h - 4, 10, UIC.muted, 'center');
    const lx = x + 18, cx0 = x + Math.round(ow * 0.42), cw = ow - (cx0 - x) - 40;
    oRows.forEach((r, i) => {
      if (i < o0 || i >= o0 + vis) return;
      const ry = top + 14 + (i - o0) * rh, on = inOpts && i === UI.shopSel;""")
rep("""      text((on ? '▸ ' : '') + label, lx, ry + 22, 15, UIC.ink, 'left', on);
      const key = { General:'vol',""",
"""      let lb = (on ? '▸ ' : '') + label; ctx.font = `${on ? 'bold ' : ''}15px ${FONT}`;
      if (ctx.measureText(lb).width > cx0 - lx - 8) { while (lb.length > 4 && ctx.measureText(lb + '…').width > cx0 - lx - 8) lb = lb.slice(0, -1); lb = lb.trimEnd() + '…'; }
      text(lb, lx, ry + 22, 15, UIC.ink, 'left', on);
      const key = { General:'vol',""")
rep("""          if (inOpts) UI.optHits.push({ x:bx, y:ry + 4, w:bw, h:28, act:() => { PREFS[key] = v; savePrefs(); sfx('click'); UI.shopSel = i; } });
        });
      }
    });""",
"""          if (inOpts) UI.optHits.push({ x:bx, y:ry + 4, w:bw, h:28, act:() => { PREFS[key] = v; savePrefs(); sfx('click'); UI.shopSel = i; } });
        });
      } else {
        // Fila genérica: su valor en un botón (◂ ▸ si se puede ajustar); tocar la fila la cambia.
        const ex = x + ow - 18, vw = ex - cx0, val = String(r.price ?? '');
        const fit = (t, w) => { ctx.font = `12px ${FONT}`; if (ctx.measureText(t).width <= w) return t; while (t.length > 3 && ctx.measureText(t + '…').width > w) t = t.slice(0, -1); return t.trimEnd() + '…'; };
        if (r.adj) {
          designBtn(cx0, ry + 4, 26, 28, '◂', false, 12); designBtn(ex - 26, ry + 4, 26, 28, '▸', false, 12);
          if (val) designBtn(cx0 + 30, ry + 4, vw - 60, 28, fit(val, vw - 70), on, 12);
          if (inOpts) { UI.optHits.push({ x:cx0 - 4, y:ry + 2, w:32, h:rh - 4, act:() => { UI.shopSel = i; r.adj(-1); savePrefs?.(); sfx('click'); } });
                        UI.optHits.push({ x:ex - 30, y:ry + 2, w:34, h:rh - 4, act:() => { UI.shopSel = i; r.adj(1); savePrefs?.(); sfx('click'); } }); }
        } else if (val) designBtn(cx0, ry + 4, vw, 28, fit(val, vw - 12), on, 12);
        if (inOpts && r.buy) UI.optHits.push({ x:x + 8, y:ry, w:ow - 16, h:rh - 4, act:() => { UI.shopSel = i; r.buy(); sfx('click'); } });
      }
    });""")

open(path, 'w', encoding='utf-8').write(s)
print('parche aplicado; UIK en', s.count('globalThis.UIK'), 'lugares')
