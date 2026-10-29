"""Bundles the intro into one self-contained file: corazon-de-maiz-intro.html.

Inlines the stylesheet, every script and the song (as a data URL), so the
result opens offline by double-click. Run from anywhere:
    python3 propuestas-final/intro/build.py
"""
import base64
import pathlib
import re

HERE = pathlib.Path(__file__).resolve().parent
html = (HERE / 'index.html').read_text(encoding='utf-8')
song = base64.b64encode((HERE / 'assets' / 'corazon-de-maiz-cancion.mp3').read_bytes()).decode()
audio = f'<script>window.CDM_AUDIO="data:audio/mpeg;base64,{song}";</script>\n'

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">',
              lambda m: '<style>\n' + (HERE / m.group(1)).read_text(encoding='utf-8') + '</style>', html)
first = True
def inline(m):
    global first
    code = (HERE / m.group(1)).read_text(encoding='utf-8').replace('</script', '<\\/script')
    out = (audio if first else '') + '<script>\n' + code + '</script>'
    first = False
    return out
html = re.sub(r'<script src="([^"]+)"></script>', inline, html)

out = HERE / 'corazon-de-maiz-intro.html'
out.write_text(html, encoding='utf-8')
print(f'{out.name}: {out.stat().st_size / 1e6:.1f} MB')
