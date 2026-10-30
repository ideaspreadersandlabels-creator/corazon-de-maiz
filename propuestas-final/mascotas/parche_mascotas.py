"""Mascotas rediseñadas (gato, perro, xoloitzcuintle) y pueblo otomí con casas de pencas de maguey,
ayates de ixtle y tenangos bordados, para Corazón de Maíz.

Uso:  python3 parche_mascotas.py ruta/a/index.html     (necesita parche_zonas.py; idempotente)
"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'window.CdmMascotas' in s:
    print('ya estaba aplicado'); sys.exit(0)
assert 'TINTA_Z' in s, 'primero aplica parche_zonas.py'
def rep(old, new, count=1):
    global s
    n = s.count(old); assert n == count, f'esperaba {count} y hay {n}: {old[:70]}'
    s = s.replace(old, new)
a = s.find("  } else if (b.t === 'otomihut') { \n"); b = s.find("  } else if (b.t === 'otomistall') { ", a)
assert a > 0 and b > a
s = s[:a] + "  } else if (b.t === 'otomihut') { \n    otomiCasaCdm(b);\n" + s[b:]
rep("    for (let i = 0; i < 4; i++) { const c = ['#c0392b', '#2f8a5a', '#f0b020', '#2f6aa8'][i]; rect(c, px + 10 + i*20, py - 14, 14, 22); for (let k = 0; k < 3; k++) rect('#f4ecd8', px + 10 + i*20, py - 10 + k*7, 14, 1.5); }",
    "    for (let i = 0; i < 4; i++) tenangoCdm(px + 10 + i*20, py - 14, 15, 22, i);")
rep("  if (b.t !== 'casita' && b.t !== 'otomihut') return;", "  if (b.t !== 'casita') return;")
arte = open(os.path.join(aqui, 'mascotas-art.js'), encoding='utf-8').read()
js = open(os.path.join(aqui, 'mascotas-juego.js'), encoding='utf-8').read()
rep('</body>', '<script>\n' + arte + '\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
