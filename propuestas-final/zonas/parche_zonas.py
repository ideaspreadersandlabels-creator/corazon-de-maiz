"""Tenochtitlan, Villa Rica y tierra maya con más diseño, para Corazón de Maíz.

Templo Mayor con doble escalinata, cabezas de serpiente, Coyolxauhqui y adoratorios de Tláloc y
Huitzilopochtli; calli de azotea con plantas; casas españolas encaladas con techo de teja y la
iglesia con zócalo, teja y cruz atrial; casas mayas de palma alta y la pirámide de Kukulcán con
cabezas de serpiente y templo pintado.

Uso:  python3 parche_zonas.py ruta/a/index.html     (modifica el archivo; idempotente)
"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'function temploMayorCdm(' in s:
    print('ya estaba aplicado'); sys.exit(0)
def rep(old, new, count=1):
    global s
    n = s.count(old); assert n == count, f'esperaba {count} y hay {n}: {old[:70]}'
    s = s.replace(old, new)
a = s.find("  } else if (b.t === 'templomayor') { \n"); b = s.find("  } else if (b.t === 'armeria') { ", a)
assert a > 0 and b > a
s = s[:a] + "  } else if (b.t === 'templomayor') { \n    temploMayorCdm(b);\n" + s[b:]
a = s.find("  } else if (b.t === 'calli') { \n"); b = s.find("  } else if (b.t === 'campfire') {", a)
assert a > 0 and b > a
s = s[:a] + "  } else if (b.t === 'calli') { \n    calliCdm(b);\n" + s[b:]
# Las casas españolas y mayas no llevan los adornos de las casas tlaxcaltecas (cimiento, olla).
rep("  if (b.t !== 'casita' && b.t !== 'otomihut') return;", "  if (b.t !== 'casita' && b.t !== 'otomihut') return;\n  if (b.t === 'casita' && (b.x >= 540 || (b.x >= 360 && b.x <= 400 && b.y >= 36))) return;")
js = open(os.path.join(aqui, 'zonas-juego.js'), encoding='utf-8').read()
rep('</body>', '<script>\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
