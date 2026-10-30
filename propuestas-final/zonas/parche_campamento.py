"""Campamento apache (wickiups con cuero, humo, canastas; ramadas con pieles y olla) y galeón
(casco con contorno, tablones y franja, faroles, mascarón, estandarte de Castilla y tripulación).

Uso:  python3 parche_campamento.py ruta/a/index.html     (necesita antes parche_zonas.py; idempotente)
"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'function wickiupCdm(' in s:
    print('ya estaba aplicado'); sys.exit(0)
assert 'TINTA_Z' in s, 'primero aplica parche_zonas.py'
def rep(old, new, count=1):
    global s
    n = s.count(old); assert n == count, f'esperaba {count} y hay {n}: {old[:70]}'
    s = s.replace(old, new)
rep("  } else if (b.t === 'ramada') { ", "    wickiupCdm(b);\n  } else if (b.t === 'ramada') { ")
rep("  } else if (b.t === 'tipi') { ", "    ramadaCdm(b);\n  } else if (b.t === 'tipi') { ")
js = open(os.path.join(aqui, 'campamento-juego.js'), encoding='utf-8').read()
rep('</body>', '<script>\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
