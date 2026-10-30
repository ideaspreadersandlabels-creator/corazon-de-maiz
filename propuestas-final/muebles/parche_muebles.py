"""Muebles con diseño y estructura de la casa para Corazón de Maíz.

Agrega 38 muebles y 29 tipos de «muebles que se ponen solos» dibujados en estilo códice
(muebles-art.js), los íconos de las tiendas de muebles, nuevos pisos por cuarto (petate,
aplanado blanco con cenefa, aplanado rojo pulido, lajas de piedra), muros de adobe con
remate y franja roja, y tapetes con greca.

Uso:  python3 parche_muebles.py ruta/a/index.html     (modifica el archivo; idempotente)
"""
import sys, os

path = sys.argv[1]
aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'window.CdmMuebles' in s:
    print('ya estaba aplicado'); sys.exit(0)

def rep(old, new, count=1):
    global s
    n = s.count(old)
    assert n == count, f'esperaba {count} y hay {n}: {old[:70]}'
    s = s.replace(old, new)

arte = open(os.path.join(aqui, 'muebles-art.js'), encoding='utf-8').read()
juego = open(os.path.join(aqui, 'muebles-juego.js'), encoding='utf-8').read()

# 1. Pisos nuevos por cuarto (misma distribución de cuartos que antes).
i0 = s.find('function drawCasaPisos() {')
i1 = s.find('function drawCasaAdornos() {', i0)
assert i0 > 0 and i1 > i0
s = s[:i0] + """function drawCasaPisos() {
  const H = CASA_ALTO;
  pisoPetate(14, 14, 232, ALA_Y); pisoPetate(14, ALA_Y + 16, 232, H - 14);
  pisoOratorio(254, 14, 474, 192);
  pisoRojo(254, 214, 474, ALA_Y); pisoRojo(254, ALA_Y + 16, 474, H - 14);
  pisoLajas(494, 14, 706, ALA_Y); pisoLajas(494, ALA_Y + 16, 706, H - 14);
  for (const [x, y, w, h, c] of [[60, 330, 120, 60, '#8a3038'], [290, 300, 140, 70, '#2f6aa8'], [40, 560, 170, 50, '#5a2a7a']]) tapeteCasa(x, y, w, h, c);
  petate(300, 400, 120, 28);
}
""" + s[i1:]

# 2. Muros de adobe con remate (los dos dibujos de muros de la casa).
rep("  const wall = (x, y, w, h) => { rect('#c9a27a', x, y, w, h); rect('rgba(90,55,30,.18)', x, y, w, 1); rect('rgba(255,240,210,.2)', x, y + h - 2, w, 2); };",
    "  const wall = (x, y, w, h) => muroCasaCdm(x, y, w, h);")
j0 = s.find("  const wall = (x, y, w, h) => { rect('#d9bf96', x, y, w, h);")
j1 = s.find('};', s.find("ctx.strokeRect(x + .75, y + .75, w - 1.5, h - 1.5);", j0)) + 2
assert j0 > 0 and j1 > j0
s = s[:j0] + "  const wall = (x, y, w, h) => muroCasaCdm(x, y, w, h);" + s[j1:]

# 3. Los nombres de los muebles puestos van en una pastilla, arriba del dibujo.
rep("if (!inking) text(FURNITURE.find(f => f.id === id).name, sp.x, sp.y - 28, 9, '#f4ecd8', 'center');",
    "if (!inking) { const nm = FURNITURE.find(f => f.id === id).name; ctx.font = `bold 9px ${FONT}`; const tw = ctx.measureText(nm).width + 10; rect('rgba(26,20,16,.6)', sp.x - tw / 2, sp.y - 58, tw, 13); text(nm, sp.x, sp.y - 48.5, 9, '#fff6d8', 'center'); }")

# 4. El arte y la integración van al final.
rep('</body>', '<script>\n' + arte + '\n' + juego + '\n</script>\n</body>')

open(path, 'w', encoding='utf-8').write(s)
print('parche aplicado')
