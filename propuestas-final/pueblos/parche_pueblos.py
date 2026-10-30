"""Cada pueblo con su propio estilo para Corazón de Maíz.

Plazas distintas (Tlaxcallan: aplanado rojo con rombos; Tenochtitlan: aplanado blanco bruñido;
otomíes: tierra apisonada; Totonacapan: piedra de río con musgo; Villa Rica: empedrado español;
tierra maya: sascab), casas tlaxcaltecas encaladas con zócalo rojo y la garza, casas totonacas de
bajareque con techo de palma alto, el palo de los Voladores, el rollo de la Villa Rica, el palo del
Xócotl otomí y el momoztli de Tlaxcallan con estandartes de la garza.

Uso:  python3 parche_pueblos.py ruta/a/index.html   (necesita parche_juego.py y parche_zonas.py; idempotente)
"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'function regionCdm(' in s:
    print('ya estaba aplicado'); sys.exit(0)
assert 'function garzaCdm(' in s and 'TINTA_Z' in s, 'faltan parches anteriores'
def rep(old, new, count=1):
    global s
    n = s.count(old); assert n == count, f'esperaba {count} y hay {n}: {old[:70]}'
    s = s.replace(old, new)
# Las casas totonacas no llevan los adornos tlaxcaltecas (cimiento y olla).
rep("  if (b.t === 'casita' && (b.x >= 540 || (b.x >= 360 && b.x <= 400 && b.y >= 36))) return;",
    "  if (b.t === 'casita' && (b.x >= 540 || (b.x >= 360 && b.x <= 400 && b.y >= 36) || (b.x >= 294 && b.x < 329 && b.y >= 38 && b.y < 66))) return;")
js = open(os.path.join(aqui, 'pueblos-juego.js'), encoding='utf-8').read()
rep('</body>', '<script>\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
