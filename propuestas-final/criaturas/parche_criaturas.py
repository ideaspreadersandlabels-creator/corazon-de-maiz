"""Guerreros mexicas, tarántula, serpiente y cangrejo estilo códice para Corazón de Maíz.
Uso:  python3 parche_criaturas.py ruta/a/index.html     (idempotente)"""
import sys, os
path = sys.argv[1]; aqui = os.path.dirname(os.path.abspath(__file__))
s = open(path, encoding='utf-8').read()
if 'window.CdmCriaturas' in s:
    print('ya estaba aplicado'); sys.exit(0)
arte = open(os.path.join(aqui, 'criaturas-art.js'), encoding='utf-8').read()
js = open(os.path.join(aqui, 'criaturas-juego.js'), encoding='utf-8').read()
s = s.replace('</body>', '<script>\n' + arte + '\n' + js + '\n</script>\n</body>')
open(path, 'w', encoding='utf-8').write(s); print('parche aplicado')
