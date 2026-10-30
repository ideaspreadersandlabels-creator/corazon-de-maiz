"""Árboles, piedras, plantas y techos de zacate con más diseño para Corazón de Maíz.

Árbol del bosque por estación (flores en primavera, ocres en otoño, desnudo en invierno), frutal de la
milpa con fruta de la estación, oyamel con nieve, palma de coco, arbusto, zacate (3), piedras (3),
cactus (nopal con tunas, órgano, biznaga con flor), y techo de zacate en hileras de manojos con fleco,
contorno de tinta y olla en la cumbrera.

Uso:  python3 parche_natura.py ruta/a/index.html     (idempotente)
"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'window.CdmNatura' in s:
    print('ya estaba aplicado'); sys.exit(0)
arte = open(os.path.join(aqui, 'natura-art.js'), encoding='utf-8').read()
js = open(os.path.join(aqui, 'natura-juego.js'), encoding='utf-8').read()
assert s.count('</body>') == 1
assert s.count('    drawHouseRoom(houseFace());') == 2
s = s.replace('    drawHouseRoom(houseFace());', '    casaJugadorCdm(houseFace());')
s = s.replace('</body>', '<script>\n' + arte + '\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
