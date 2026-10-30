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

# 3b. Camas: la principal, las ocho camitas del cuarto de abajo y las de las mascotas.
rep("  rect('#6b4423', 70, 118, 70, 16); rect('#f4ecd8', 74, 112, 62, 12); rect('#8a3038', 74, 116, 36, 8); rect('#fff', 100, 108, 22, 10);",
    "  camaCdm(105, 136, 76, '#8a3038');")
rep("    rect('#5a3a22', x - 20, y - 4, 40, 12); rect('#f4ecd8', x - 17, y - 8, 34, 8); rect(['#c0392b', '#2f6aa8', '#2f8a5a', '#7a4a9a', '#e8862a', '#d02a6a', '#3ab0a0', '#c8a040'][i], x - 17, y - 6, 22, 7); rect('#fff', x + 6, y - 10, 10, 6);",
    "    camaCdm(x, y + 8, 46, ['#c0392b', '#2f6aa8', '#2f8a5a', '#7a4a9a', '#e8862a', '#d02a6a', '#3ab0a0', '#c8a040'][i]);")
rep("""  rect('#5a3a22', x - 22, y - 6, 44, 14);
  rect('#f4ecd8', x - 18, y - 10, 36, 10);
  rect(blanket, x - 18, y - 8, 22, 8);
  rect('#fff', x + 6, y - 12, 12, 8);
  text(name, x, y - 36, 9, '#f4ecd8', 'center');""", """  camaMascotaCdm(x, y + 6, blanket);
  text(name, x, y - 36, 9, '#f4ecd8', 'center');""")

# 3c. Patio: piso de tierra apisonada con camino de lajas, muros de adobe, capulín,
#     magueyes y cempasúchil, y el temazcal de piedra con su fogón y vapor.
k0 = s.find('function drawPatio() {')
k1 = s.find('const cisternaDay', k0)
assert k0 > 0 and k1 > k0
s = s[:k0] + """function drawPatio() {
  if (S.houseLvl < 4) return;
  const H = HOME.h;
  rect('#c8a878', 728, 14, 224, H - 28);
  for (let i = 0; i < 140; i++) rect(i % 2 ? 'rgba(120,90,60,.16)' : 'rgba(255,240,210,.14)', 730 + hash(i, 11) * 220, 16 + hash(11, i) * (H - 32), 6, 2);
  for (let x = 728, i = 0; x < 840; x += 22, i++) { ctx.fillStyle = ['#b8a084', '#a89074', '#c0aa8e'][i % 3]; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, 300 + (i % 2) * 6, 19, 26, 5); else ctx.rect(x, 300, 19, 26); ctx.fill(); ctx.strokeStyle = 'rgba(50,35,25,.45)'; ctx.lineWidth = 1; ctx.stroke(); }
  sombraMuro(728, 14, 952, H - 14);
  muroCasaCdm(712, 8, 16, 268); muroCasaCdm(712, 364, 16, H - 372); rect('#e6d2a8', 706, 278, 28, 86);
  arbolPatioCdm(924, 120);
  for (const [id, x, y] of [['magueyes', 748, 60], ['maceta', 930, H - 40], ['magueyes', 748, H - 40], ['maceta', 790, 60]]) drawFurn(id, x, y);
  temazcalCdm(850, 262);
  text('Patio', 840, 40, 13, '#4a2f18', 'center');
  text(S.patioBath === S.day ? 'Temazcal (mañana otra vez)' : 'Temazcal', 850, 292, 10, '#4a2f18', 'center');
}
""" + s[k1:]

# 4. El arte y la integración van al final.
rep('</body>', '<script>\n' + arte + '\n' + juego + '\n</script>\n</body>')

open(path, 'w', encoding='utf-8').write(s)
print('parche aplicado')
