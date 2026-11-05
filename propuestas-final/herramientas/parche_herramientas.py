"""Hacha, pico y cuchillo estilo códice (barra y mano) para Corazón de Maíz.
Uso:  python3 parche_herramientas.py ruta/a/index.html     (idempotente)"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'drawToolIconHerr' in s:
    print('ya estaba aplicado'); sys.exit(0)
js = open(os.path.join(aqui, 'herramientas-juego.js'), encoding='utf-8').read()
s = s.replace('</body>', '<script>\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
