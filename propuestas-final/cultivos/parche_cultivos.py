"""Arte de los 10 cultivos que faltaban (5 etapas) para Corazón de Maíz.
Uso:  python3 parche_cultivos.py ruta/a/index.html     (idempotente)"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'tomate_verde:tomate(' in s:
    print('ya estaba aplicado'); sys.exit(0)
assert 'ARTE_CULTIVO' in s and 'window.CdmMundo' in s
js = open(os.path.join(aqui, 'cultivos-juego.js'), encoding='utf-8').read()
s = s.replace('</body>', '<script>\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
