"""Orillas de lago (47 tiles 'blob') para Godot.
Cada casilla de AGUA con tierra alrededor usa un tile según una máscara de 8 bits.
Bits (tierra = 1): N=1 NE=2 E=4 SE=8 S=16 SW=32 W=64 NW=128.
Uso: python3 orillas.py <agua.png> <pasto.png> <salida_dir> <nombre>
"""
import sys, math, json
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

S = 4            # superresolución
T = 32 * S
N, NE, E, SE, Sb, SW, W, NW = 1, 2, 4, 8, 16, 32, 64, 128

def canon(m):
    if m & (N | E): m &= ~NE
    if m & (E | Sb): m &= ~SE
    if m & (Sb | W): m &= ~SW
    if m & (W | N): m &= ~NW
    return m

MASKS = sorted({canon(m) for m in range(256)})
assert len(MASKS) == 47

# celdas vecinas como rectángulos (en coordenadas del tile, 0..T)
CELDAS = {N: (0, -T, T, 0), NE: (T, -T, 2*T, 0), E: (T, 0, 2*T, T), SE: (T, T, 2*T, 2*T),
          Sb: (0, T, T, 2*T), SW: (-T, T, 0, 2*T), W: (-T, 0, 0, T), NW: (-T, -T, 0, 0)}

yy, xx = np.mgrid[0:T, 0:T].astype(np.float32) + 0.5

def dist_rect(r):
    x0, y0, x1, y1 = r
    dx = np.maximum(np.maximum(x0 - xx, 0), xx - x1)
    dy = np.maximum(np.maximum(y0 - yy, 0), yy - y1)
    return np.sqrt(dx * dx + dy * dy)

# ruido periódico (periodo = tile) para que los bordes no sean rectos y siempre empaten
def ruido():
    r = np.zeros((T, T), np.float32)
    for k, (a, b, f) in enumerate([(1, 0, 1.0), (0, 1, 1.0), (2, 1, .6), (1, 2, .6), (3, 0, .35), (0, 3, .35)]):
        r += f * np.sin(2 * math.pi * (a * xx + b * yy) / T + k * 1.7)
    return r / 2.5

RU = ruido()

def campo(m):
    d = np.full((T, T), 1e9, np.float32)
    k = 10.0 * S   # mínimo suave: redondea las esquinas
    for bit, r in CELDAS.items():
        if m & bit:
            b = dist_rect(r)
            h = np.clip(0.5 + 0.5 * (b - d) / k, 0, 1)
            d = np.where(d > 1e8, b, b * (1 - h) + d * h - k * h * (1 - h))
    return d + RU * 2.4 * S

def mezcla(a, b, w):
    w = np.clip(w, 0, 1)[..., None]
    return a * (1 - w) + b * w

def tile(m, agua, pasto):
    if m == 0:
        return agua
    d = campo(m) / S          # distancia en px del tile (32)
    sm = lambda e0, e1: np.clip((d - e0) / (e1 - e0), 0, 1)
    out = agua.copy()
    somero = np.array([110, 170, 196], np.float32)
    out = mezcla(out, somero, (1 - sm(13, 21)) * 0.75)           # agua somera
    barro = np.array([150, 112, 70], np.float32)
    arena = np.array([214, 184, 128], np.float32)
    banco = mezcla(barro, arena, sm(6, 11))
    out = mezcla(out, banco, 1 - sm(12.4, 13.4))                  # banco de arena/barro
    espuma = np.array([238, 236, 220], np.float32)
    out = mezcla(out, espuma, np.clip(1 - np.abs(d - 14.4) / 1.0, 0, 1) * 0.9)   # espuma
    tinta = np.array([60, 44, 30], np.float32)
    out = mezcla(out, tinta, np.clip(1 - np.abs(d - 12.9) / 0.6, 0, 1) * 0.85)   # línea de tinta (códice)
    out = mezcla(out, pasto, 1 - sm(4.5, 6.5))                  # pasto que viene del vecino
    return out

def tules(img, m, semilla):
    """juncos/tules en la orilla, solo donde hay pasto/banco"""
    import random
    rnd = random.Random(semilla)
    d = campo(m) / S
    dr = ImageDraw.Draw(img)
    for _ in range(5):
        x, y = rnd.randrange(4, 124), rnd.randrange(4, 124)
        if 7 < d[y, x] < 11:
            h = rnd.randrange(18, 30)
            for k in (-3, 0, 3):
                dr.line([(x + k, y), (x + k * 1.6, y - h + abs(k) * 2)], fill=(52, 92, 46), width=4)
            dr.ellipse([x - 3, y - h - 7, x + 3, y - h + 4], fill=(120, 74, 40))

def main():
    agua_p, pasto_p, out, nombre = sys.argv[1:5]
    up = lambda p: np.array(Image.open(p).convert('RGB').resize((T, T), Image.BICUBIC), np.float32)
    agua, pasto = up(agua_p), up(pasto_p)
    cols = 8
    rows = math.ceil(len(MASKS) / cols)
    atlas = Image.new('RGBA', (cols * 32, rows * 32), (0, 0, 0, 0))
    mapa = {}
    for i, m in enumerate(MASKS):
        im = Image.fromarray(np.clip(tile(m, agua, pasto), 0, 255).astype(np.uint8))
        if m:
            tules(im, m, m)
        im = im.resize((32, 32), Image.LANCZOS)
        cx, cy = i % cols, i // cols
        atlas.paste(im, (cx * 32, cy * 32))
        mapa[m] = [cx, cy]
    atlas.save(f'{out}/{nombre}.png')
    json.dump({'bits': 'N=1 NE=2 E=4 SE=8 S=16 SW=32 W=64 NW=128 (1 = tierra)', 'mascaras': mapa},
              open(f'{out}/{nombre}.json', 'w'), indent=0)
    # GDScript con la tabla
    filas = ', '.join(f'{m}: Vector2i({c[0]}, {c[1]})' for m, c in mapa.items())
    open(f'{out}/{nombre}.gd', 'w').write(
        '# Tabla generada por orillas.py: máscara de 8 bits (tierra=1) -> coordenada en el atlas\n'
        '# N=1 NE=2 E=4 SE=8 S=16 SW=32 W=64 NW=128\n'
        'extends RefCounted\n'
        f'const ATLAS = {{{filas}}}\n\n'
        'static func canon(m: int) -> int:\n'
        '\tif m & (1 | 4): m &= ~2\n'
        '\tif m & (4 | 16): m &= ~8\n'
        '\tif m & (16 | 64): m &= ~32\n'
        '\tif m & (64 | 1): m &= ~128\n'
        '\treturn m\n')
    print('listo', len(MASKS))

main()
