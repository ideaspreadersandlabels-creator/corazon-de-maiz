"""Losetas acogedoras para terrain.png (32 px). Reemplaza la fila 0, columnas 0..9, con el MISMO orden:
0 pasto, 1 pasto 2, 2 pasto con flores, 3 pasto con flores 2, 4 tierra arada, 5 arada mojada, 6 camino,
7 piedra (plaza), 8 arena, 9 vereda. Todas se repiten sin cortes y los pastos comparten el mismo tono de fondo
(así no se ve el tablero de ajedrez).
Uso: python3 losetas_acogedor.py <terrain.png original> <salida.png> [<vista.png>]
"""
import random, sys, math
from PIL import Image, ImageDraw, ImageFilter

S = 4          # se dibuja a 128 px y se reduce a 32
N = 32 * S


def envuelto(dibuja):
    """dibuja en un lienzo 3x3 y recorta el centro: todo lo que cruza el borde aparece del otro lado"""
    big = Image.new("RGBA", (N * 3, N * 3), (0, 0, 0, 0))
    d = ImageDraw.Draw(big)
    for dx in (0, N, 2 * N):
        for dy in (0, N, 2 * N):
            dibuja(d, dx, dy)
    return big.crop((N, N, 2 * N, 2 * N))


def manchas(base, cols, semilla, n=14, r=(10, 26), blur=10):
    rnd = random.Random(semilla)
    pts = [(rnd.uniform(0, N), rnd.uniform(0, N), rnd.uniform(*r), rnd.choice(cols)) for _ in range(n)]
    capa = envuelto(lambda d, ox, oy: [d.ellipse((ox + x - rr, oy + y - rr * 0.7, ox + x + rr, oy + y + rr * 0.7), fill=c) for x, y, rr, c in pts])
    capa = capa.filter(ImageFilter.GaussianBlur(blur))
    im = Image.new("RGBA", (N, N), base)
    im.alpha_composite(capa)
    return im


def matas(im, semilla, n, col, alto=(6, 11)):
    rnd = random.Random(semilla)
    pts = [(rnd.uniform(0, N), rnd.uniform(0, N), rnd.uniform(*alto)) for _ in range(n)]
    def f(d, ox, oy):
        for x, y, h in pts:
            for k in (-3, 0, 3):
                d.line((ox + x + k, oy + y, ox + x + k * 1.6, oy + y - h + abs(k)), fill=col, width=3)
    im.alpha_composite(envuelto(f))
    return im


def flores(im, semilla, n, cols):
    rnd = random.Random(semilla)
    pts = [(rnd.uniform(0, N), rnd.uniform(0, N), rnd.choice(cols)) for _ in range(n)]
    def f(d, ox, oy):
        for x, y, c in pts:
            for a in range(5):
                ang = a * math.tau / 5
                d.ellipse((ox + x + math.cos(ang) * 4 - 3, oy + y + math.sin(ang) * 4 - 3, ox + x + math.cos(ang) * 4 + 3, oy + y + math.sin(ang) * 4 + 3), fill=c)
            d.ellipse((ox + x - 2.4, oy + y - 2.4, ox + x + 2.4, oy + y + 2.4), fill=(240, 180, 50, 255))
    im.alpha_composite(envuelto(f))
    return im


PASTO = (132, 192, 92, 255)
CLARO = (139, 198, 97, 255)
OSCURO = (126, 186, 88, 255)
MATA = (98, 156, 70, 255)


def pasto(semilla, con_flores=0):
    im = manchas(PASTO, [CLARO, OSCURO], semilla, 7, (18, 34), 16)
    im = matas(im, semilla + 1, 4, MATA)
    if con_flores:
        im = flores(im, semilla + 2, con_flores, [(250, 246, 236, 255), (236, 122, 142, 255), (250, 210, 90, 255)])
    return im


def arada(mojada=False):
    base = (150, 104, 66, 255) if not mojada else (112, 74, 48, 255)
    im = manchas(base, [(162, 114, 74, 255) if not mojada else (122, 82, 54, 255), (138, 94, 60, 255) if not mojada else (100, 66, 42, 255)], 40, 10, (12, 22), 8)
    d = ImageDraw.Draw(im)
    for k in range(4):  # surcos
        y = 16 + k * 32
        d.rounded_rectangle((6, y - 5, N - 6, y + 9), radius=7, fill=(126, 84, 52, 255) if not mojada else (92, 60, 40, 255))
        d.line((10, y - 4, N - 10, y - 4), fill=(176, 128, 86, 255) if not mojada else (136, 96, 66, 255), width=3)
    return im


def camino(base=(222, 192, 140, 255), semilla=60, piedras=True):
    im = manchas(base, [(230, 202, 152, 255), (208, 176, 126, 255)], semilla, 12, (10, 24), 9)
    if piedras:
        rnd = random.Random(semilla + 1)
        pts = [(rnd.uniform(0, N), rnd.uniform(0, N), rnd.uniform(3, 6)) for _ in range(9)]
        def f(d, ox, oy):
            for x, y, r in pts:
                d.ellipse((ox + x - r, oy + y - r * 0.7, ox + x + r, oy + y + r * 0.7), fill=(186, 158, 116, 255))
                d.ellipse((ox + x - r * 0.5, oy + y - r * 0.5, ox + x + r * 0.2, oy + y), fill=(240, 222, 186, 255))
        im.alpha_composite(envuelto(f))
    return im


def lajas():
    """piso de plaza: lajas cálidas de tamaños distintos, junta suave"""
    im = Image.new("RGBA", (N, N), (196, 172, 140, 255))
    d = ImageDraw.Draw(im)
    rnd = random.Random(70)
    filas = [(0, 44), (44, 40), (84, 44)]
    for i, (y0, h) in enumerate(filas):
        x = -20 if i % 2 else 0
        while x < N:
            w = rnd.choice([40, 48, 56])
            c = rnd.choice([(232, 214, 184), (226, 206, 174), (238, 222, 194), (222, 200, 168)])
            for ox in (0, N, -N):  # que cruce el borde
                d.rounded_rectangle((x + ox + 3, y0 + 3, x + ox + w - 3, y0 + h - 3), radius=7, fill=c + (255,))
                d.line((x + ox + 8, y0 + 7, x + ox + w - 12, y0 + 7), fill=(250, 240, 222, 255), width=3)
            x += w
    return im


def arena():
    im = manchas((236, 212, 160, 255), [(244, 224, 176, 255), (226, 198, 146, 255)], 80, 12, (10, 24), 9)
    d = ImageDraw.Draw(im)
    for k in range(3):
        y = 24 + k * 40
        d.arc((10, y, 118, y + 26), 200, 340, fill=(212, 184, 134, 255), width=3)
    return im


def vereda():
    im = pasto(90)
    v = camino((214, 182, 132, 255), 91, piedras=False)
    m = Image.new("L", (N, N), 0)
    ImageDraw.Draw(m).rounded_rectangle((20, -10, N - 20, N + 10), radius=30, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(6))
    im.paste(v, (0, 0), m)
    return im


def generar(orig, salida):
    atlas = Image.open(orig).convert("RGBA")
    piezas = [pasto(1), pasto(2), pasto(3, 6), pasto(4, 9), arada(), arada(True), camino(), lajas(), arena(), vereda()]
    for i, p in enumerate(piezas):
        atlas.paste(p.resize((32, 32), Image.LANCZOS), (i * 32, 0))
    atlas.save(salida)
    return piezas


# ---------------------------------------------------------- regiones y agua
def cueva():
    im = manchas((110, 92, 84, 255), [(122, 104, 94, 255), (98, 82, 76, 255)], 101, 9, (14, 28), 10)
    rnd = random.Random(102)
    pts = [(rnd.uniform(0, N), rnd.uniform(0, N), rnd.uniform(4, 8)) for _ in range(6)]
    im.alpha_composite(envuelto(lambda d, ox, oy: [d.ellipse((ox + x - r, oy + y - r * 0.6, ox + x + r, oy + y + r * 0.6), fill=(86, 72, 66, 255)) for x, y, r in pts]))
    return im


def muro_cueva():
    im = Image.new("RGBA", (N, N), (92, 76, 70, 255))
    d = ImageDraw.Draw(im)
    rnd = random.Random(110)
    for fila, y0 in enumerate((0, 42, 84)):
        x = -24 if fila % 2 else 0
        while x < N:
            w = rnd.choice([44, 52, 60])
            for ox in (0, N, -N):
                d.rounded_rectangle((x + ox + 3, y0 + 3, x + ox + w - 3, y0 + 41), radius=12, fill=rnd.choice([(132, 112, 102, 255), (122, 104, 96, 255), (140, 120, 108, 255)]))
                d.line((x + ox + 10, y0 + 8, x + ox + w - 14, y0 + 8), fill=(166, 146, 134, 255), width=3)
            x += w
    return im


def nieve():
    im = manchas((240, 244, 252, 255), [(250, 252, 255, 255), (222, 230, 244, 255)], 120, 9, (14, 30), 12)
    rnd = random.Random(121)
    pts = [(rnd.uniform(0, N), rnd.uniform(0, N)) for _ in range(7)]
    im.alpha_composite(envuelto(lambda d, ox, oy: [d.ellipse((ox + x - 2, oy + y - 2, ox + x + 2, oy + y + 2), fill=(255, 255, 255, 255)) for x, y in pts]))
    return im


def selva():
    im = manchas((72, 140, 72, 255), [(84, 154, 80, 255), (62, 124, 64, 255)], 130, 8, (16, 30), 14)
    rnd = random.Random(131)
    hojas = [(rnd.uniform(0, N), rnd.uniform(0, N), rnd.uniform(0, 6.28)) for _ in range(7)]
    def f(d, ox, oy):
        for x, y, a in hojas:
            pts = [(ox + x + math.cos(a + k) * r, oy + y + math.sin(a + k) * r * 0.6) for k, r in ((0, 12), (1.4, 4), (3.14, 2), (4.8, 4))]
            d.polygon(pts, fill=(52, 112, 56, 255))
    im.alpha_composite(envuelto(f))
    return im


def hielo():
    im = manchas((196, 226, 244, 255), [(214, 238, 250, 255), (176, 210, 236, 255)], 140, 8, (16, 30), 12)
    d = ImageDraw.Draw(im)
    for (a, b) in (((20, 30), (60, 50)), ((70, 90), (110, 76)), ((30, 100), (50, 120))):
        d.line((a, b), fill=(240, 250, 255, 255), width=3)
    return im


def lava():
    im = manchas((206, 74, 34, 255), [(240, 140, 50, 255), (170, 50, 28, 255)], 150, 9, (12, 26), 9)
    rnd = random.Random(151)
    pts = [(rnd.uniform(0, N), rnd.uniform(0, N), rnd.uniform(5, 10)) for _ in range(6)]
    im.alpha_composite(envuelto(lambda d, ox, oy: [d.ellipse((ox + x - r, oy + y - r * 0.6, ox + x + r, oy + y + r * 0.6), fill=(255, 210, 90, 255)) for x, y, r in pts]))
    return im


AGUA = (92, 160, 210, 255)


def agua(fase):
    """4 cuadros: las olitas se corren a la derecha y vuelven al inicio sin brinco"""
    im = manchas(AGUA, [(108, 176, 222, 255), (80, 146, 198, 255)], 160, 8, (18, 32), 14)
    rnd = random.Random(161)
    olas = [(rnd.uniform(0, N), rnd.uniform(0, N)) for _ in range(5)]
    dx = fase * N / 4
    def f(d, ox, oy):
        for x, y in olas:
            X = (x + dx) % N
            d.arc((ox + X - 10, oy + y - 4, ox + X + 10, oy + y + 6), 200, 340, fill=(226, 244, 252, 255), width=4)
    im.alpha_composite(envuelto(f))
    return im


def chinampa():
    im = arada(False)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, N, 10), fill=AGUA); d.rectangle((0, N - 10, N, N), fill=AGUA)
    for x in range(8, N, 24):  # estacas de ahuejote en la orilla
        d.rounded_rectangle((x, 6, x + 6, 20), radius=2, fill=(120, 84, 50, 255))
    return im


def muelle():
    im = Image.new("RGBA", (N, N), AGUA)
    d = ImageDraw.Draw(im)
    for k in range(4):
        x = k * 32
        d.rounded_rectangle((x + 2, 0, x + 30, N), radius=4, fill=(176, 126, 80, 255))
        d.line((x + 8, 0, x + 8, N), fill=(150, 104, 64, 255), width=2)
        for y in (16, 112):
            d.ellipse((x + 14, y - 3, x + 20, y + 3), fill=(90, 62, 40, 255))
    return im


def generar_todo(orig, salida, orillas_png=None, orillas_json=None):
    atlas = Image.open(orig).convert("RGBA")
    fila0 = [pasto(1), pasto(2), pasto(3, 6), pasto(4, 9), arada(), arada(True), camino(), lajas(), arena(), vereda(),
             cueva(), muro_cueva(), nieve(), selva(), hielo(), lava()]
    for i, p in enumerate(fila0):
        atlas.paste(p.resize((32, 32), Image.LANCZOS), (i * 32, 0))
    atlas.paste(agua(0).resize((32, 32), Image.LANCZOS), (0, 32))
    atlas.paste(chinampa().resize((32, 32), Image.LANCZOS), (2 * 32, 4 * 32))
    atlas.paste(muelle().resize((32, 32), Image.LANCZOS), (3 * 32, 4 * 32))
    for f in range(4):  # cuadros del agua animada en la fila 6
        atlas.paste(agua(f).resize((32, 32), Image.LANCZOS), (f * 32, 6 * 32))
    if orillas_png:  # orillas sencillas de 8 lados (fila 1, columnas 1..8) tomadas del juego de 47
        import json
        o = Image.open(orillas_png).convert("RGBA")
        m = {int(k): v for k, v in json.load(open(orillas_json))["mascaras"].items()}
        viejas = {1: 1, 2: 16, 4: 4, 8: 64, 5: 5, 9: 65, 6: 20, 10: 80}
        orden = [1, 2, 4, 8, 5, 9, 6, 10]
        for i, vm in enumerate(orden):
            cx, cy = m[viejas[vm]]
            atlas.paste(o.crop((cx * 32, cy * 32, cx * 32 + 32, cy * 32 + 32)), ((i + 1) * 32, 32))
    atlas.save(salida)


if __name__ == "__main__":
    if len(sys.argv) > 4:
        generar_todo(sys.argv[1], sys.argv[2], sys.argv[4], sys.argv[5] if len(sys.argv) > 5 else None)
    else:
        generar_todo(sys.argv[1], sys.argv[2])
    piezas = None
    if len(sys.argv) > 3:  # vista: un campo de 12x7 con pasto mezclado al azar, camino y plaza
        t = Image.open(sys.argv[2]).convert("RGBA")
        tile = lambda i: t.crop((i * 32, 0, i * 32 + 32, 32)).resize((64, 64), Image.NEAREST)
        r = random.Random(3)
        V = Image.new("RGBA", (64 * 14, 64 * 7))
        for y in range(7):
            for x in range(14):
                i = r.choice([0, 1, 1, 0, 0, 1, 2]) if r.random() > 0.06 else 3
                if y == 3: i = 6
                if 9 <= x <= 12 and 0 <= y <= 2: i = 7
                if x <= 3 and y >= 5: i = 4 if (x + y) % 3 else 5
                V.paste(tile(i), (x * 64, y * 64))
        V.save(sys.argv[3])
