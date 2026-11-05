"""Animales estilo códice (guajolote, conejo, pato, venado, caballo, bisonte) para Corazón de Maíz.
Uso:  python3 parche_animales.py ruta/a/index.html     (idempotente)"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'window.CdmAnimales' in s:
    print('ya estaba aplicado'); sys.exit(0)
arte = open(os.path.join(aqui, 'animales-art.js'), encoding='utf-8').read()
js = open(os.path.join(aqui, 'animales-juego.js'), encoding='utf-8').read()
assert s.count('</body>') == 1
s = s.replace('</body>', '<script>\n' + arte + '\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
