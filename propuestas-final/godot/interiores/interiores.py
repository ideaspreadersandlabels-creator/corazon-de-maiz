"""Fondos ilustrados (estilo códice) para los interiores de Corazón de Maíz en Godot.

Cada fondo usa EXACTAMENTE las medidas de scripts/interiors.gd (HOME 720x460,
TEMPLE 520x400, EDIF 560x360) para que la cama, el comal, los lugares de muebles,
las personas y las zonas por donde se camina caigan donde ya están.
Lo que se mueve (fuego, humo, velas, personas, mascotas, muebles comprados,
el cofre) lo sigue dibujando el script encima.

Uso: python3 interiores.py <salida_svg_dir>
"""
import sys, os, math, random

INK = "#2b1a0f"
CAL = "#efe3c8"
CAL2 = "#e4d3b0"
ADOBE = "#c9a27a"
ADOBE2 = "#b48a62"
OCRE = "#d39a26"
ROJO = "#b23a22"
ROJO2 = "#8f2c1a"
AZUL = "#2f7fa6"
JADE = "#2a8a6e"
MADERA = "#7a4a24"
MADERA2 = "#a06a38"
PETATE = "#d8b56c"
PETATE2 = "#b8924c"
TIERRA = "#a87a52"
NEGRO = "#1a120b"
BLANCO = "#f7f1e3"
CEMPA = "#f08a1c"
CEMPA2 = "#ffc23a"


class S:
    """Lienzo SVG muy simple."""

    def __init__(self, w, h, semilla=1):
        self.w, self.h = w, h
        self.o = []
        self.defs = []
        self.r = random.Random(semilla)
        self.nid = 0

    def id(self):
        self.nid += 1
        return f"k{self.nid}"

    def add(self, s):
        self.o.append(s)

    def rect(self, x, y, w, h, fill, st=INK, sw=1.4, rx=0, op=1):
        s = f' stroke="{st}" stroke-width="{sw}"' if st else ""
        self.add(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}"{s} opacity="{op}"/>')

    def ell(self, cx, cy, rx, ry, fill, st=INK, sw=1.4, op=1):
        s = f' stroke="{st}" stroke-width="{sw}"' if st else ""
        self.add(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{fill}"{s} opacity="{op}"/>')

    def circ(self, cx, cy, r, fill, st=INK, sw=1.2, op=1):
        self.ell(cx, cy, r, r, fill, st, sw, op)

    def path(self, d, fill, st=INK, sw=1.4, op=1, extra=""):
        s = f' stroke="{st}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round"' if st else ""
        self.add(f'<path d="{d}" fill="{fill}"{s} opacity="{op}" {extra}/>')

    def poly(self, pts, fill, st=INK, sw=1.4, op=1):
        d = "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z"
        self.path(d, fill, st, sw, op)

    def line(self, x0, y0, x1, y1, st=INK, sw=1.4, op=1):
        self.add(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{st}" stroke-width="{sw}" stroke-linecap="round" opacity="{op}"/>')

    def clip(self, x, y, w, h):
        i = self.id()
        self.defs.append(f'<clipPath id="{i}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath>')
        self.add(f'<g clip-path="url(#{i})">')
        return i

    def end(self):
        self.add("</g>")

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w}" height="{self.h}" viewBox="0 0 {self.w} {self.h}">'
                f'<defs>{"".join(self.defs)}</defs>' + "".join(self.o) + "</svg>")


# ------------------------------------------------------------------ texturas
def manchas(s, x, y, w, h, cols, n, tam=(2, 6)):
    for _ in range(n):
        px, py = x + s.r.random() * w, y + s.r.random() * h
        a = s.r.uniform(*tam)
        s.ell(px, py, a, a * s.r.uniform(0.3, 0.6), s.r.choice(cols), None, op=s.r.uniform(0.18, 0.4))


def piso_tierra(s, x, y, w, h, base=TIERRA):
    s.rect(x, y, w, h, base, None)
    manchas(s, x, y, w, h, ["#8e623e", "#c09068", "#7a5232"], int(w * h / 260))
    for _ in range(int(w * h / 1400)):  # piedritas
        px, py = x + s.r.random() * w, y + s.r.random() * h
        s.ell(px, py, 1.6, 1.1, "#d9c3a0", INK, 0.5, op=0.7)


def piso_aplanado(s, x, y, w, h, base, linea):
    """piso de cal pulida (aplanado) con grietas suaves en losas grandes"""
    s.rect(x, y, w, h, base, None)
    manchas(s, x, y, w, h, [linea, "#ffffff"], int(w * h / 500), (4, 12))
    s.clip(x, y, w, h)
    yy = y
    fila = 0
    while yy < y + h:
        alto = 46
        xx = x - (fila % 2) * 30
        while xx < x + w:
            ancho = s.r.choice([60, 70, 80])
            s.rect(xx + 1, yy + 1, ancho - 2, alto - 2, "none", linea, 1, rx=3, op=0.5)
            xx += ancho
        yy += alto
        fila += 1
    s.end()


def losas(s, x, y, w, h, cols, linea=INK):
    """losas de piedra labrada, hiladas desfasadas y de anchos distintos"""
    s.rect(x, y, w, h, cols[0], None)
    s.clip(x, y, w, h)
    yy = y
    fila = 0
    while yy < y + h:
        alto = s.r.choice([24, 28, 30])
        xx = x - s.r.randint(0, 30)
        while xx < x + w:
            ancho = s.r.randint(34, 64)
            c = s.r.choice(cols)
            s.rect(xx + 1.2, yy + 1.2, ancho - 2.4, alto - 2.4, c, linea, 0.9, rx=4)
            if s.r.random() < 0.3:
                s.line(xx + 6, yy + alto * 0.4, xx + ancho * 0.5, yy + alto * 0.55, linea, 0.6, op=0.4)
            xx += ancho
        yy += alto
        fila += 1
    s.end()


def tablas(s, x, y, w, h, base="#8a5a32", alto=18):
    s.rect(x, y, w, h, base, None)
    s.clip(x, y, w, h)
    yy = y
    f = 0
    while yy < y + h:
        xx = x - (f % 3) * 50
        while xx < x + w:
            L = s.r.choice([120, 150, 180])
            c = s.r.choice(["#8a5a32", "#94633a", "#7e512c"])
            s.rect(xx, yy, L, alto, c, INK, 0.8)
            for k in range(3):
                s.line(xx + 10, yy + 4 + k * 5, xx + L - 10, yy + 4 + k * 5 + s.r.uniform(-1, 1), "#6a4022", 0.6, op=0.5)
            s.circ(xx + 4, yy + alto / 2, 1, NEGRO, None)
            s.circ(xx + L - 4, yy + alto / 2, 1, NEGRO, None)
            xx += L
        yy += alto
        f += 1
    s.end()


def muro(s, x, y, w, h, base=CAL, mancha=CAL2):
    s.rect(x, y, w, h, base, None)
    manchas(s, x, y, w, h, [mancha, "#ffffff", "#d8c49c"], int(w * h / 220), (5, 14))


def greca(s, x, y, w, h, col, fondo):
    """xicalcoliuhqui: greca escalonada"""
    s.rect(x, y, w, h, fondo, INK, 1)
    u = h * 1.8
    s.clip(x, y, w, h)
    n = int(w / u) + 2
    for i in range(n):
        ox = x + i * u
        a, b = h * 0.18, h * 0.82
        d = (f"M{ox:.1f},{y + b:.1f} L{ox:.1f},{y + a:.1f} L{ox + u * 0.55:.1f},{y + a:.1f} L{ox + u * 0.55:.1f},{y + h * 0.62:.1f} "
             f"L{ox + u * 0.3:.1f},{y + h * 0.62:.1f} L{ox + u * 0.3:.1f},{y + h * 0.42:.1f} ")
        s.path(d, "none", col, h * 0.16)
        s.poly([(ox + u * 0.55, y + b), (ox + u, y + a), (ox + u, y + b)], col, None)
    s.end()


def chalchihuites(s, x0, x1, y, r, col, paso=None):
    paso = paso or r * 3.2
    x = x0
    while x <= x1:
        s.circ(x, y, r, col, INK, 0.8)
        s.circ(x, y, r * 0.4, BLANCO, None)
        x += paso


def petate(s, x, y, w, h, base=PETATE, osc=PETATE2, borde=True):
    s.rect(x, y, w, h, base, None)
    s.clip(x, y, w, h)
    c = 7
    for j in range(int(h / c) + 1):
        for i in range(int(w / c) + 1):
            px, py = x + i * c, y + j * c
            if (i // 2 + j // 2) % 2 == 0:
                s.rect(px + 0.8, py + 2.2, c - 1.6, c - 4.4, osc, None, op=0.75)
            else:
                s.rect(px + 2.2, py + 0.8, c - 4.4, c - 1.6, osc, None, op=0.45)
    s.end()
    if borde:
        s.rect(x, y, w, h, "none", INK, 1.6, rx=2)
        s.rect(x + 3, y + 3, w - 6, h - 6, "none", "#8e6a32", 1, rx=1, op=0.7)


def sombra(s, cx, cy, rx, ry):
    s.ell(cx, cy, rx, ry, "#000", None, op=0.18)


# ------------------------------------------------------------------ objetos
def olla(s, cx, cy, r, col="#b0582e", boca=True):
    sombra(s, cx, cy + r * 0.9, r * 1.0, r * 0.3)
    s.ell(cx, cy, r, r * 0.85, col)
    s.path(f"M{cx - r * 0.75},{cy - r * 0.1} Q{cx},{cy + r * 0.35} {cx + r * 0.75},{cy - r * 0.1}", "none", BLANCO, 1.2, op=0.8)
    for k in range(3):
        s.circ(cx - r * 0.4 + k * r * 0.4, cy + r * 0.2, r * 0.07, BLANCO, None)
    if boca:
        s.ell(cx, cy - r * 0.7, r * 0.5, r * 0.18, "#5a2a14")


def canasta(s, cx, cy, r, contenido=None):
    sombra(s, cx, cy + r * 0.6, r, r * 0.3)
    s.ell(cx, cy, r, r * 0.7, "#c79a52")
    for k in range(-2, 3):
        s.path(f"M{cx + k * r * 0.35},{cy - r * 0.62} Q{cx + k * r * 0.45},{cy} {cx + k * r * 0.35},{cy + r * 0.62}", "none", "#8e6a32", 0.9)
    s.ell(cx, cy - r * 0.15, r * 0.82, r * 0.42, "#6e4a22")
    if contenido:
        cols = contenido
        for k in range(7):
            a = k / 7 * math.tau
            s.circ(cx + math.cos(a) * r * 0.42, cy - r * 0.18 + math.sin(a) * r * 0.2, r * 0.22, cols[k % len(cols)], INK, 0.7)
        s.circ(cx, cy - r * 0.22, r * 0.22, cols[0], INK, 0.7)


def mazorca(s, cx, cy, ang, col=OCRE, L=14):
    s.add(f'<g transform="translate({cx:.1f} {cy:.1f}) rotate({ang})">')
    s.ell(0, 0, L / 2, L / 5, col, INK, 0.9)
    for k in range(-2, 3):
        s.line(k * L / 7, -L / 7, k * L / 7, L / 7, "#00000044", 0.6)
    s.path(f"M{L / 2 - 1},0 L{L / 2 + 6},-3 L{L / 2 + 4},2 Z", "#d9c48a", INK, 0.7)
    s.end()


def ristra(s, x, y, n, col=ROJO, dy=7):
    s.line(x, y - 4, x, y + n * dy, "#8e6a32", 1)
    for k in range(n):
        lado = -1 if k % 2 else 1
        s.path(f"M{x},{y + k * dy} q{lado * 7},2 {lado * 9},6 q{-lado * 4},-1 {-lado * 9},-4 Z", col, INK, 0.7)


def flor_cempa(s, cx, cy, r):
    s.circ(cx, cy, r, CEMPA, INK, 0.7)
    s.circ(cx, cy, r * 0.55, CEMPA2, None)
    s.circ(cx, cy, r * 0.2, "#c25a10", None)


def vela(s, x, y, h=12):
    s.rect(x - 2, y - h, 4, h, "#f6efdc", INK, 0.8)
    s.line(x, y - h, x, y - h - 2, NEGRO, 0.8)


def sahumador(s, cx, cy):
    s.path(f"M{cx - 8},{cy - 4} Q{cx},{cy + 8} {cx + 8},{cy - 4} Z", "#b0582e", INK, 1)
    s.rect(cx + 7, cy - 3, 14, 3, "#b0582e", INK, 0.8)
    s.ell(cx, cy - 4, 8, 2.4, "#3a2a20", INK, 0.7)
    for k in range(3):
        s.circ(cx - 3 + k * 3, cy - 5, 1.2, CEMPA2, None)


def idolo(s, cx, by, h, piedra="#8f8a7c", acento=JADE):
    """figurita de piedra (dios del hogar) sentada, de perfil"""
    k = h / 40
    s.poly([(cx - 9 * k, by), (cx + 10 * k, by), (cx + 9 * k, by - 14 * k), (cx - 7 * k, by - 15 * k)], piedra)
    s.rect(cx - 8 * k, by - 30 * k, 16 * k, 16 * k, piedra, INK, 1.1, rx=3 * k)
    s.circ(cx + 3 * k, by - 24 * k, 2 * k, BLANCO, INK, 0.6)
    s.circ(cx + 3.6 * k, by - 24 * k, 0.9 * k, NEGRO, None)
    s.rect(cx - 10 * k, by - 36 * k, 20 * k, 7 * k, acento, INK, 1)
    s.circ(cx - 9 * k, by - 22 * k, 2.6 * k, acento, INK, 0.7)


def dios_codice(s, cx, by, sc, col, piedra=None):
    """figura de dios estilo códice (perfil, tocado de plumas). piedra=color para estatua"""
    cuerpo = piedra or "#b77a4c"
    pl = [JADE, col, "#f0d070", JADE, col, "#f0d070", JADE]
    base = (cx, by - 62 * sc)
    for i in range(7):
        a = -math.pi / 2 + (i - 3) * 0.3
        tip = (base[0] + math.cos(a) * 60 * sc, base[1] + math.sin(a) * 60 * sc)
        dx, dy = math.cos(a + math.pi / 2) * 6 * sc, math.sin(a + math.pi / 2) * 6 * sc
        s.poly([(base[0] - dx, base[1] - dy), (tip[0], tip[1]), (base[0] + dx, base[1] + dy)], pl[i] if not piedra else (col if i % 2 else piedra), INK, 1)
        s.circ(tip[0] - math.cos(a) * 8 * sc, tip[1] - math.sin(a) * 8 * sc, 2.2 * sc, BLANCO, None)
    s.rect(cx - 17 * sc, by - 72 * sc, 34 * sc, 11 * sc, "#e0b040" if not piedra else piedra, INK, 1.2, rx=2)
    chalchihuites(s, cx - 12 * sc, cx + 12 * sc, by - 66.5 * sc, 2.4 * sc, JADE, 8 * sc)
    # cara de perfil
    s.path(f"M{cx - 10 * sc},{by - 61 * sc} L{cx + 12 * sc},{by - 61 * sc} L{cx + 15 * sc},{by - 50 * sc} L{cx + 11 * sc},{by - 47 * sc} "
           f"L{cx + 12 * sc},{by - 42 * sc} L{cx - 10 * sc},{by - 38 * sc} Z", cuerpo, INK, 1.3)
    s.rect(cx - 2 * sc, by - 58 * sc, 13 * sc, 4 * sc, col if not piedra else "#6e6a60", None, op=0.9)  # pintura facial
    s.ell(cx + 6 * sc, by - 53 * sc, 2.6 * sc, 1.8 * sc, BLANCO, INK, 0.7)
    s.circ(cx + 6.8 * sc, by - 53 * sc, 1 * sc, NEGRO, None)
    s.circ(cx - 9 * sc, by - 49 * sc, 4 * sc, JADE, INK, 0.9)  # orejera
    # cuerpo, pectoral y faldellín
    s.poly([(cx - 20 * sc, by - 37 * sc), (cx + 20 * sc, by - 37 * sc), (cx + 26 * sc, by), (cx - 26 * sc, by)], col if not piedra else piedra, INK, 1.4)
    s.rect(cx - 22 * sc, by - 37 * sc, 44 * sc, 7 * sc, BLANCO if not piedra else "#cfc8b4", INK, 1)
    for i in range(5):
        s.circ(cx - 16 * sc + i * 8 * sc, by - 33.5 * sc, 2 * sc, ROJO if not piedra else col, None)
    s.rect(cx - 26 * sc, by - 10 * sc, 52 * sc, 10 * sc, "#00000033", INK, 1)
    greca(s, cx - 24 * sc, by - 9 * sc, 48 * sc, 7 * sc, col if not piedra else "#5e5a52", BLANCO if not piedra else "#a9a394")
    # brazo con ofrenda
    s.path(f"M{cx + 8 * sc},{by - 30 * sc} l{14 * sc},{6 * sc} l{3 * sc},{-6 * sc}", "none", INK, 3 * sc)
    s.path(f"M{cx + 8 * sc},{by - 30 * sc} l{14 * sc},{6 * sc} l{3 * sc},{-6 * sc}", "none", cuerpo, 1.8 * sc)
    mazorca(s, cx + 26 * sc, by - 38 * sc, -70, OCRE, 12 * sc)


def ventana(s, x, y, w, h, marco=MADERA):
    """hueco de ventana TRANSPARENTE (el script pinta el cielo de día o de noche detrás)"""
    i = s.id()
    s.defs.append(f'<mask id="{i}"><rect width="{s.w}" height="{s.h}" fill="white"/><rect x="{x + 4}" y="{y + 4}" width="{w - 8}" height="{h - 8}" fill="black"/></mask>')
    return i


def marco_ventana(s, x, y, w, h, marco=MADERA):
    s.rect(x, y, w, h, "none", INK, 5)
    s.rect(x, y, w, h, "none", marco, 3)
    s.line(x + w / 2, y + 2, x + w / 2, y + h - 2, marco, 3)
    s.rect(x - 4, y + h - 1, w + 8, 6, marco, INK, 1.2)


def muro_lateral(s, W, Fpiso, base, mancha, banda=None, guardapolvo=ROJO, tipo="adobe"):
    """pared del fondo (vista de frente) + guardapolvo rojo + vigas"""
    muro(s, 0, 0, W, Fpiso, base, mancha)
    if tipo == "adobe":
        for yy in range(52, Fpiso - 30, 22):
            off = (yy // 22) % 2 * 28
            for xx in range(-off, W, 56):
                s.rect(xx, yy, 56, 22, "none", "#00000014", 1)
    s.rect(0, Fpiso - 30, W, 30, guardapolvo, INK, 1.2)
    s.line(0, Fpiso - 30, W, Fpiso - 30, INK, 1.6)
    s.rect(0, Fpiso - 6, W, 6, "#00000030", None)


# ------------------------------------------------------------------ casa del jugador
def casa_jugador():
    W, H = 720, 460
    s = S(W, H, 7)
    BED, COMAL = (110, 150), (610, 170)
    s.rect(0, 0, W, H, "#6e4a30", None)
    # pisos de cada cuarto
    petate(s, 14, 14, 218, H - 28, "#d2ae66", "#b38b48", borde=False)               # recámara: piso de petates
    for yy in range(14, H - 14, 63):
        s.line(14, yy, 232, yy, "#8e6a32", 1.2, op=0.7)
    piso_aplanado(s, 494, 14, 212, H - 28, "#b98b62", "#8e6440")                     # cocina: tierra apisonada
    manchas(s, 494, 14, 212, H - 28, ["#6e4a30"], 40, (3, 7))
    piso_aplanado(s, 254, 14, 220, 178, "#a8452c", "#7e2e1c")                        # oratorio: aplanado rojo
    piso_aplanado(s, 254, 214, 220, H - 228, "#d8b98a", "#b8956a")                   # sala: cal ocre
    # pasillos bajo los muros (huecos de puerta)
    piso_aplanado(s, 232, 276, 256, 88, "#cdae80", "#b8956a")
    piso_aplanado(s, 328, 192, 84, 22, "#c48a66", "#9a5a3c")
    # muros interiores (vista desde arriba: tapa de cal + cara de adobe)
    for r in [(232, 8, 16, 268), (232, 364, 16, H - 372), (472, 8, 16, 268), (472, 364, 16, H - 372),
              (248, 192, 80, 16), (412, 192, 60, 16)]:
        x, y, w, h = r
        s.rect(x, y, w, h, ADOBE, INK, 1.6)
        s.rect(x + 2, y + 2, w - 4, h - 4, CAL, None)
        if w < h:
            for yy in range(int(y) + 18, int(y + h), 20):
                s.line(x + 2, yy, x + w - 2, yy, "#00000022", 1)
        else:
            for xx in range(int(x) + 18, int(x + w), 20):
                s.line(xx, y + 2, xx, y + h - 2, "#00000022", 1)
        s.rect(x, y + h - 4, w, 4, ROJO, None, op=0.8)
    # muro exterior
    for r in [(0, 0, W, 14), (0, H - 14, W, 14), (0, 0, 14, H), (W - 14, 0, 14, H)]:
        s.rect(*r, ADOBE2, None)
    s.rect(7, 7, W - 14, H - 14, "none", CAL, 6)
    s.rect(0, 0, W, H, "none", INK, 3)
    s.rect(14, 14, W - 28, H - 28, "none", INK, 1.6)
    # puerta (umbral de madera)
    s.rect(W / 2 - 42, H - 16, 84, 16, MADERA, INK, 1.4)
    for k in range(4):
        s.line(W / 2 - 42 + k * 21, H - 16, W / 2 - 42 + k * 21, H, INK, 0.8)

    # ---- recámara
    # cama: tapexco de otate con petate, manta de algodón y almohada
    bx, by = BED
    sombra(s, bx + 3, by + 31, 46, 7)
    s.rect(bx - 44, by - 32, 88, 62, MADERA, INK, 1.8, rx=3)
    for k in range(9):
        s.line(bx - 42 + k * 10.5, by - 30, bx - 42 + k * 10.5, by + 28, "#5a3418", 1)
    petate(s, bx - 38, by - 26, 76, 50)
    s.rect(bx - 36, by - 6, 72, 32, "#f3ead6", INK, 1.2, rx=2)
    for k, c in enumerate([ROJO, AZUL, ROJO]):
        s.rect(bx - 36, by + 2 + k * 8, 72, 3, c, None)
    greca(s, bx - 36, by + 20, 72, 6, ROJO, "#f3ead6")
    s.rect(bx - 30, by - 24, 60, 13, "#e8dcc0", INK, 1.1, rx=6)
    s.path(f"M{bx - 24},{by - 18} Q{bx},{by - 22} {bx + 24},{by - 18}", "none", "#c9b890", 1)
    # petaca (baúl de palma) y huipil doblado, contra la pared
    s.rect(176, 20, 44, 22, "#c9a25a", INK, 1.3, rx=3)
    for k in range(5):
        s.line(180 + k * 9, 21, 180 + k * 9, 41, "#8e6a32", 1)
    s.rect(30, 214, 24, 18, BLANCO, INK, 1, rx=2)
    greca(s, 30, 224, 24, 6, AZUL, BLANCO)
    # ---- oratorio: altar del hogar
    muro(s, 256, 16, 216, 14, "#8a3a26", "#7a2e1e")
    s.rect(330, 16, 60, 14, "#f0e2c0", INK, 1)       # papel de amate pintado en la pared
    dios_codice(s, 360, 30, 0.19, ROJO)
    s.rect(312, 48, 96, 8, MADERA2, INK, 1.4)      # mesa del altar
    s.rect(318, 54, 84, 22, "#5a3a26", INK, 1.4)
    greca(s, 318, 62, 84, 8, OCRE, "#5a3a26")
    for i in range(8):
        flor_cempa(s, 322 + i * 11, 47, 3.6)
    for vx in (326, 394):
        vela(s, vx, 46, 12)
    idolo(s, 360, 46, 16, "#9a9484", JADE)
    sahumador(s, 290, 70)
    for k in range(6):  # pétalos de cempasúchil en el piso (camino)
        flor_cempa(s, 360 + s.r.uniform(-10, 10), 90 + k * 16, 2.4)
    canasta(s, 440, 64, 11, [OCRE, "#f2e6c4", ROJO])
    # ---- cocina
    # tlecuil: tres piedras del fogón, ceniza y comal (el fuego lo pinta el script)
    cx, cy = COMAL
    s.ell(cx, cy + 6, 30, 13, "#4a3a30", INK, 1.2)
    s.ell(cx, cy + 6, 24, 9, "#7a6a5c", None)
    for a in (200, 330, 90):
        s.ell(cx + math.cos(math.radians(a)) * 20, cy + 6 + math.sin(math.radians(a)) * 9, 7, 5, "#6e6660", INK, 1.1)
    s.ell(cx, cy, 20, 7, "#2a2220", INK, 1.4)
    s.ell(cx - 5, cy - 2, 6, 1.8, "#4a403a", None)
    # tortillas y chiquihuite junto al comal
    canasta(s, 662, 150, 11, ["#efe0b0"])
    # metlapil y cántaros contra la pared derecha
    for k, cy2 in enumerate((60, 98, 138)):
        olla(s, 694, cy2, 11, ["#b0582e", "#9a4a26", "#c06a3a"][k])
    # repisa con ollas y jícaras arriba
    s.rect(500, 18, 120, 8, MADERA2, INK, 1.2)
    for k in range(5):
        olla(s, 512 + k * 24, 22, 7, ["#b0582e", "#c06a3a", "#8e3f20"][k % 3], boca=False)
    # mazorcas colgadas y ristra de chiles
    for k in range(5):
        mazorca(s, 636 + k * 9, 34 + (k % 2) * 4, 80 + k * 4, [OCRE, "#3a4fa0", ROJO2, OCRE, "#f2e0a0"][k], 13)
    ristra(s, 690, 180, 6)
    # leña apilada
    for k in range(4):
        for j in range(3):
            s.ell(684 + j * 0, 330 + k * 12 + j * 0, 10, 4, "#7a4a24", INK, 1)
            s.circ(674, 330 + k * 12, 3.4, "#c79a5a", INK, 0.8)
    # ---- sala
    petate(s, 300, 400, 120, 28)
    # camitas de Lina y Luna (canastas con cojín)
    for (px, py), col in (((300, 268), "#e08a3a"), ((420, 268), "#e2c08a")):
        sombra(s, px, py + 8, 22, 5)
        s.ell(px, py, 21, 10, "#c79a52", INK, 1.3)
        for k in range(-2, 3):
            s.line(px + k * 7, py - 9, px + k * 8, py + 9, "#8e6a32", 0.9)
        s.ell(px, py - 2, 15, 6, col, INK, 1)
        s.ell(px - 3, py - 4, 6, 2, "#ffffff", None, op=0.35)
    # amoxtli (catálogo) en su atril junto a la puerta
    x0, y0 = 400, 400
    s.rect(x0 - 2, y0 + 20, 26, 6, MADERA, INK, 1)
    s.rect(x0, y0 - 20, 22, 26, "#f2e6c8", INK, 1.6)
    for k in range(3):
        s.line(x0, y0 - 20 + k * 9, x0 + 22, y0 - 20 + k * 9, "#00000044", 0.8)
    s.rect(x0 + 4, y0 - 16, 6, 5, ROJO, None)
    s.rect(x0 + 12, y0 - 8, 6, 5, AZUL, None)
    s.circ(x0 + 8, y0 - 1, 2.6, OCRE, None)
    # macetas de nopal y maguey en las esquinas de la sala
    for (px, py) in ((268, 440), (456, 440)):
        olla(s, px, py - 4, 9, "#a84e2a")
        for a in (-40, 0, 40):
            s.path(f"M{px},{py - 10} q{a / 6},-14 {a / 3},-18", "none", "#3e7a3a", 3)
    return s


# ------------------------------------------------------------------ templo
DIOSES = {
    "camaxtli": "#bf4033", "tlaloc": "#336ba8", "xochiquetzal": "#d9528a",
    "chicomecoatl": "#e0a121", "matlalcueye": "#2e8a7a", "mayahuel": "#5e8f7a",
}


def templo(dios, col):
    W, H, F = 520, 400, 170
    s = S(W, H, 11)
    losas(s, 0, F, W, H - F, ["#6e665a", "#7a7266", "#665e54", "#827a6c"])
    # camino de tierra roja hacia el altar
    s.rect(W / 2 - 36, 234, 72, H - 234, "#8e3a26", INK, 1, op=0.85)
    greca(s, W / 2 - 36, 234, 72, 7, OCRE, "#8e3a26")
    # pared de piedra estucada
    muro(s, 0, 0, W, F, "#cfc4ab", "#bdb093")
    for yy in range(26, F - 16, 18):
        off = (yy // 18) % 2 * 24
        for xx in range(-off, W, 48):
            s.rect(xx, yy, 48, 18, "none", "#00000018", 1)
    greca(s, 0, 4, W, 14, col, "#efe3c8")
    s.rect(0, F - 16, W, 16, ROJO, INK, 1.2)
    chalchihuites(s, 10, W, F - 8, 3.2, "#efe3c8", 20)
    s.line(0, F, W, F, INK, 2)
    # murales
    for mx in (20.0, W - 144):
        s.rect(mx - 4, 30, 128, 116, "#3a2414", INK, 1.6)
        s.rect(mx, 34, 120, 108, "#efe3c8", INK, 1)
        s.rect(mx + 4, 38, 112, 100, col, INK, 1)
        manchas(s, mx + 4, 38, 112, 100, ["#ffffff", "#000000"], 30, (4, 10))
        chalchihuites(s, mx + 14, mx + 110, 48, 3.6, "#efe3c8", 18)
        for k in range(4):  # huellas de pies (camino del dios) y glifos de días
            s.ell(mx + 18 + k * 7, 128 - k * 5, 2.2, 3.2, NEGRO, None, op=0.6)
        for k in range(3):
            gx, gy = mx + 98, 70 + k * 22
            s.rect(gx - 8, gy - 8, 16, 16, "#efe3c8", INK, 1)
            for d in range(k + 1):
                s.circ(gx - 4 + d * 4, gy + 4, 1.4, ROJO, None)
            s.circ(gx, gy - 1, 3, col, INK, 0.7)
        dios_codice(s, mx + 58, 136, 0.72, col)
    # tarima escalonada
    s.rect(W / 2 - 92, 120, 184, 70, "#6e6860", INK, 1.6)
    s.rect(W / 2 - 82, 112, 164, 12, "#7e786e", INK, 1.4)
    s.rect(W / 2 - 72, 104, 144, 10, "#8a8478", INK, 1.4)
    greca(s, W / 2 - 92, 160, 184, 14, col, "#cfc4ab")
    for k in range(5):  # escalones
        s.line(W / 2 - 92, 176 + k * 3, W / 2 + 92, 176 + k * 3, "#00000033", 1)
    # resplandor y estatua de piedra con pintura del dios
    for r in (62, 46, 30):
        s.circ(W / 2, 62, r, "#ffe0a0", None, op=0.10)
    dios_codice(s, W / 2, 106, 1.0, col, piedra="#9e988a")
    # altar
    s.rect(W / 2 - 78, 186, 156, 10, "#7e786e", INK, 1.4)
    s.rect(W / 2 - 72, 194, 144, 34, "#59534a", INK, 1.4)
    greca(s, W / 2 - 72, 210, 144, 12, col, "#59534a")
    for i in range(14):
        flor_cempa(s, W / 2 - 60 + i * 9, 186 + math.sin(i) * 2, 3.4)
    s.rect(W / 2 - 7, 174, 14, 10, "#b0582e", INK, 1.1)  # sahumerio (el humo lo pinta el script)
    s.ell(W / 2, 174, 7, 2, "#3a2a20", None)
    # columnas pintadas
    for side in (-1, 1):
        cx = W / 2 + side * 150
        sombra(s, cx + 4, 255, 18, 4)
        s.rect(cx - 15, 136, 30, 118, "#a8a090", INK, 1.6)
        s.rect(cx - 19, 132, 38, 8, "#8a8478", INK, 1.2)
        s.rect(cx - 19, 248, 38, 8, "#8a8478", INK, 1.2)
        for yb in (168, 214):
            greca(s, cx - 15, yb, 30, 12, col, "#efe3c8")
        s.rect(cx + 6, 140, 8, 108, "#000000", None, op=0.16)
        # serpiente emplumada enroscada pintada
        s.path(f"M{cx - 15},{190} q15,-10 30,0 M{cx - 15},{236} q15,-10 30,0", "none", JADE, 3)
    # bases de los braseros (la llama la pinta el script)
    for bx in (56.0, W - 56):
        s.rect(bx - 16, 218, 32, 26, "#59534a", INK, 1.4)
        s.rect(bx - 20, 214, 40, 6, "#7e786e", INK, 1.2)
        s.path(f"M{bx - 12},226 l6,6 l6,-6 l6,6 l6,-6", "none", col, 2)
        s.ell(bx, 214, 14, 3.4, "#2a1a10", None)
    # vasijas de ofrenda en el piso
    for (px, py) in ((180, 268), (340, 268)):
        olla(s, px, py, 9, "#9a4a26")
    # umbral de la puerta
    s.rect(W / 2 - 32, H - 12, 64, 12, "#e8d8b0", INK, 1.2)
    return s


# ------------------------------------------------------------------ edificios
EDIF_W, EDIF_H, EDIF_F = 560, 360, 120
VENTANAS = {  # dónde hay hueco de ventana (el script pinta el cielo detrás)
    "tienda": [280], "casa": [220], "casa_maya": [220], "otomi": [220], "tipi": [],
    "palacio": [], "iglesia": [140, 420], "capitan": [440],
}

TIENDAS = {
    "tianguis": ("#e3c9a0", "#bf3828", [[OCRE, "#3a4fa0", ROJO], ["#4a8a3a", "#f2e6c4", OCRE], [ROJO, "#e08a2a", "#6a3a1e"]]),
    "herreria": ("#b5aea6", "#3f3f46", [["#7a7a80", "#a0a0a8", "#5a5a60"], ["#c07030", "#7a7a80", "#3a3a40"], ["#6a6a70", "#b0b0b8", "#8a5a32"]]),
    "bar": ("#e0b38c", "#b35233", [["#b0582e", "#c06a3a", "#8e3f20"], ["#f2e6c4", "#c06a3a", "#6a3a1e"], ["#b0582e", "#e0a121", "#8e3f20"]]),
    "armeria": ("#c7bda8", "#59524c", [["#bf3828", "#efe3c8", "#3a4fa0"], [MADERA2, "#5a5a60", MADERA2], ["#2a8a6e", "#bf3828", OCRE]]),
    "consultorio": ("#f2efe2", "#2e806b", [["#4a8a3a", "#7aa85a", "#a0c070"], ["#b0582e", "#f2e6c4", "#c06a3a"], ["#6a3a8a", "#4a8a3a", "#e0a121"]]),
    "refugio": ("#c4a385", "#2e5ea8", [["#8a6a4a", "#efe3c8", "#5a4030"], ["#bf3828", "#3a4fa0", "#efe3c8"], ["#8a6a4a", "#6a5040", "#a08060"]]),
    "totonaca": ("#e8d1b0", "#2e8a59", [["#3a2a1a", "#4a8a3a", "#3a2a1a"], ["#e0a121", "#f2e6c4", "#bf3828"], ["#4a8a3a", "#7a5030", "#e0a121"]]),
    "espanol": ("#f2ede2", "#b5452e", [["#7a4a24", "#a06a38", "#7a4a24"], ["#3a6a3a", "#5a2a5a", "#c0a040"], ["#efe3c8", "#bf3828", "#3a4fa0"]]),
    "maya": ("#f0e6d8", "#2e8a7a", [["#2a8a6e", "#5ac0a0", "#2a8a6e"], ["#6a3a1e", "#e0a121", "#6a3a1e"], ["#bf3828", "#3a4fa0", "#f2e6c4"]]),
}


def piso_edif(s, kind):
    W, H, F = EDIF_W, EDIF_H, EDIF_F
    y0 = F + 30
    if kind in ("iglesia",):
        # piso de barro cocido colonial (ladrillo en espiga)
        s.rect(0, y0, W, H - y0, "#b8704a", None)
        s.clip(0, y0, W, H - y0)
        for j in range(0, H - y0 + 20, 13):
            for i in range(-1, W // 26 + 2):
                x = i * 26 + (j // 13 % 2) * 13
                c = s.r.choice(["#b8704a", "#c27c54", "#a8643f"])
                s.rect(x, y0 + j, 26, 13, c, "#6e3a22", 0.8)
        s.end()
    elif kind == "capitan":
        tablas(s, 0, y0, W, H - y0)
    elif kind == "palacio":
        piso_aplanado(s, 0, y0, W, H - y0, "#e6dccb", "#c8b89a")
    elif kind == "tipi":
        piso_tierra(s, 0, y0, W, H - y0, "#a68058")
    else:
        piso_tierra(s, 0, y0, W, H - y0)
    s.add(f'<rect x="0" y="{y0}" width="{W}" height="14" fill="#000" opacity="0.15"/>')


def estante(s, sx, cols_filas):
    for r in range(3):
        y = 70 + r * 32
        for j in range(9):
            c = cols_filas[r][(j + r) % 3]
            x = sx + 16 + j * 18
            if r == 1:
                olla(s, x, y - 7, 7, c, boca=False)
            else:
                s.circ(x, y - 8, 7, c, INK, 1)
                s.ell(x - 2, y - 11, 2.4, 1.4, "#ffffff", None, op=0.35)
        s.rect(sx, y, 180, 6, MADERA2, INK, 1.3)
        s.rect(sx + 2, y + 6, 4, 10, MADERA, INK, 0.8)
        s.rect(sx + 174, y + 6, 4, 10, MADERA, INK, 0.8)


def edificio(kind, tienda=None):
    W, H, F = EDIF_W, EDIF_H, EDIF_F
    s = S(W, H, 3 + len(kind) + (len(tienda) if tienda else 0))
    night_win = VENTANAS.get(kind, [])
    pared = {"casa": ("#d9b48a", "#c9a27a"), "casa_maya": ("#e6d6b4", "#d6c49c"), "palacio": ("#ece4d2", "#ddd2ba"),
             "iglesia": ("#f4efe4", "#e6dfd0"), "capitan": ("#f0ebe0", "#e2dccc"), "otomi": ("#c9a77c", "#b8946a"),
             "tipi": ("#d8bc94", "#c6a67a")}
    banda = ROJO
    if kind == "tienda":
        base, banda, filas = TIENDAS[tienda]
        pared[kind] = (base, base)
    piso_edif(s, kind)
    # pared con huecos de ventana
    masks = [ventana(s, x - 30, 56, 60, 44) for x in night_win]
    for m in masks:
        s.add(f'<g mask="url(#{m})">')
    if kind == "tipi":
        # interior de tipi: pieles cosidas en gajos con pinturas
        s.rect(0, 0, W, F + 30, "#d8bc94", None)
        for k in range(9):
            x = k * 70 - 20
            s.poly([(W / 2, -40), (x, F + 30), (x + 70, F + 30)], ["#d8bc94", "#ccae84"][k % 2], "#8e6a42", 1)
        for k, x in enumerate((70, 170, 390, 490)):  # caballos y soles pintados
            s.circ(x, 70, 12, "none", ROJO, 2)
            for a in range(8):
                ang = a * math.pi / 4
                s.line(x + math.cos(ang) * 15, 70 + math.sin(ang) * 15, x + math.cos(ang) * 20, 70 + math.sin(ang) * 20, ROJO, 2)
        s.path(f"M0,{F + 4} " + " ".join(f"L{x},{F + 4 - (8 if (x // 20) % 2 else 0)}" for x in range(0, W + 20, 20)), "none", AZUL, 3)
        s.rect(0, F + 10, W, 20, "#b8946a", INK, 1)
    else:
        b, m2 = pared[kind]
        muro_lateral(s, W, F + 30, b, m2, guardapolvo={"iglesia": "#d8cfbc", "capitan": "#7a4a24", "palacio": ROJO2}.get(kind, banda if kind == "tienda" else ROJO))
        if kind in ("casa", "casa_maya", "otomi", "tienda"):
            greca(s, 0, 30, W, 10, banda if kind == "tienda" else (JADE if kind == "casa_maya" else ROJO), BLANCO)
        # vigas del techo
        if kind in ("casa", "otomi", "tienda", "capitan", "casa_maya"):
            s.rect(0, 0, W, 24, "#5a3418", INK, 1.4)
            for k in range(0, W, 40):
                s.ell(k + 20, 12, 9, 9, "#8a5a32", INK, 1.2)
                s.circ(k + 20, 12, 4, "#6e4424", None)
        if kind == "casa_maya":
            # techo de palma visto desde dentro
            for k in range(0, W, 8):
                s.line(k, 0, k + 6, 24, "#b0904a", 2)
    for _ in masks:
        s.end()
    for x in night_win:
        marco_ventana(s, x - 30, 56, 60, 44, "#5a3418" if kind != "iglesia" else "#8a6a3a")

    if kind == "tienda":
        estante(s, 24, filas)
        estante(s, W - 204, filas)
        # toldo de manta sobre el mostrador
        for k in range(8):
            s.path(f"M{W / 2 - 120 + k * 30},110 l30,0 l-6,12 l-18,0 Z", [banda, BLANCO][k % 2], INK, 1)
        # mostrador (el tendero lo pinta el script detrás)
        sombra(s, W / 2, 186, 116, 6)
        s.rect(W / 2 - 112, 146, 224, 10, MADERA2, INK, 1.4)
        s.rect(W / 2 - 110, 154, 220, 32, "#5a3418", INK, 1.4)
        greca(s, W / 2 - 110, 164, 220, 12, banda, "#e8dcc0")
        canasta(s, W / 2 - 70, 140, 10, filas[0])
        canasta(s, W / 2 + 70, 140, 10, filas[2])
        petate(s, W / 2 - 70, 280, 140, 30)
        # costales y cajas de mercancía en el piso
        for k, (px, py) in enumerate(((60, 300), (96, 316), (W - 70, 304))):
            s.path(f"M{px - 14},{py + 14} q-2,-24 14,-28 q16,4 14,28 Z", "#c9b07a", INK, 1.2)
            s.ell(px, py - 12, 8, 3, filas[k % 3][0], INK, 0.8)
    elif kind in ("casa", "casa_maya", "otomi", "tipi"):
        # tlecuil (fuego y humo los pinta el script) en (420,190)
        s.ell(420, 194, 34, 12, "#4a3a30", INK, 1.2)
        for a in (200, 330, 90):
            s.ell(420 + math.cos(math.radians(a)) * 24, 194 + math.sin(math.radians(a)) * 8, 8, 5, "#6e6660", INK, 1)
        if kind != "tipi":
            s.ell(420, 188, 22, 6, "#2a2220", INK, 1.2)  # comal
        petate(s, 80, 280, 120, 34)
        # metate con su metlapil (470..510, 260..274)
        sombra(s, 490, 276, 24, 4)
        s.poly([(470, 274), (472, 262), (508, 258), (512, 270)], "#8a847a", INK, 1.3)
        s.ell(490, 258, 12, 4, "#e8dcb8", INK, 0.8)
        s.rect(478, 252, 26, 5, "#6e6a60", INK, 1, rx=2)
        # ollas y cántaros contra la pared
        for k, x in enumerate((300, 330, 520)):
            olla(s, x, 160, 12 - k, ["#b0582e", "#9a4a26", "#c06a3a"][k])
        # mazorcas y chiles colgando de las vigas
        if kind != "tipi":
            for k in range(6):
                mazorca(s, 40 + k * 10, 40 + (k % 2) * 5, 82, [OCRE, "#3a4fa0", ROJO2][k % 3], 14)
            ristra(s, 520, 30, 7)
        if kind == "otomi":
            # telar de cintura colgado (90..154, 150..200) con su tejido de colores
            s.rect(88, 146, 70, 6, MADERA2, INK, 1.2)
            s.rect(88, 200, 70, 6, MADERA2, INK, 1.2)
            cols = [ROJO, AZUL, OCRE, JADE, BLANCO, "#8a3a8a"]
            for i in range(6):
                s.rect(94, 153 + i * 8, 58, 6, cols[i], INK, 0.6)
                for j in range(6):
                    s.poly([(96 + j * 10, 156 + i * 8), (100 + j * 10, 154 + i * 8), (104 + j * 10, 156 + i * 8), (100 + j * 10, 158 + i * 8)], BLANCO if i != 4 else ROJO, None)
            for x in (92, 154):
                s.line(x, 130, x, 210, "#5a3418", 2)
            # ayates colgados en la pared
            for k, x in enumerate((300, 360)):
                s.path(f"M{x},50 l40,0 l-4,50 l-32,0 Z", ["#efe3c8", "#d8c49a"][k], INK, 1.2)
                greca(s, x + 3, 86, 34, 8, [ROJO, AZUL][k], "#efe3c8")
        if kind == "tipi":
            # pieles en el piso y escudo de cuero
            s.path("M60,300 q20,-26 70,-20 q30,4 40,26 q-50,22 -110,-6 Z", "#8a6a4a", INK, 1.4)
            s.circ(500, 100, 26, "#c9a87a", INK, 1.6)
            s.circ(500, 100, 14, "none", ROJO, 3)
            for a in (-0.6, 0, 0.6):
                s.line(500 + math.sin(a) * 26, 126, 500 + math.sin(a) * 34, 146, "#f2e6c4", 2)
        if kind == "casa_maya":
            # hamaca colgada en la pared
            s.path("M40,70 Q130,150 220,70", "none", "#d8c49a", 3)
            for k in range(8):
                s.line(50 + k * 22, 74 + abs(4 - k) * -2 + 30, 50 + k * 22, 78 + 40 - abs(4 - k) * 6, ROJO, 1.6, op=0.8)
    elif kind == "palacio":
        # alfombra roja de plumas al trono
        s.rect(W / 2 - 40, F + 30, 80, H - F - 30, "#a62a22", INK, 1.2)
        greca(s, W / 2 - 40, F + 30, 80, 10, OCRE, "#a62a22")
        chalchihuites(s, W / 2 - 30, W / 2 + 30, 300, 3, JADE, 15)
        # mural de guerreros y garza blanca de Tlaxcallan
        s.rect(170, 26, 220, 40, "#efe3c8", INK, 1.2)
        for k in range(5):
            s.circ(190 + k * 45, 46, 9, [ROJO, JADE, OCRE, AZUL, ROJO][k], INK, 1)
        # trono (icpalli) con respaldo de oro y plumas
        for k in range(9):
            a = math.pi + k * math.pi / 8
            s.poly([(W / 2, 110), (W / 2 + math.cos(a) * 60, 110 + math.sin(a) * 60), (W / 2 + math.cos(a + 0.2) * 56, 110 + math.sin(a + 0.2) * 56)],
                   [JADE, "#3fb594", OCRE][k % 3], INK, 1)
        s.rect(W / 2 - 30, 70, 60, 50, "#d8a830", INK, 1.6, rx=6)
        s.circ(W / 2, 92, 12, JADE, INK, 1.2)
        s.circ(W / 2, 92, 5, BLANCO, None)
        s.rect(W / 2 - 70, 110, 140, 46, "#b89a6a", INK, 1.6)
        petate(s, W / 2 - 64, 116, 128, 34)
        # estandartes: garza blanca sobre campo
        for bx in (90.0, W - 90):
            s.rect(bx - 2, 50, 4, 110, MADERA, INK, 1)
            s.rect(bx, 52, 40, 50, "#f4efe4", INK, 1.2)
            s.path(f"M{bx + 8},{90} q8,-20 20,-26 q2,-6 6,-4 l-4,4 q-6,10 -6,22 l4,8 Z", "#ffffff", INK, 1.2)  # garza
            s.line(bx + 18, 90, bx + 16, 100, INK, 1)
            for k in range(4):
                s.poly([(bx + 4 + k * 10, 102), (bx + 9 + k * 10, 114), (bx + 14 + k * 10, 102)], [ROJO, JADE][k % 2], INK, 0.8)
        # braseros de pie
        for bx in (40, W - 40):
            s.rect(bx - 10, 170, 20, 40, "#6e6860", INK, 1.2)
            s.ell(bx, 170, 14, 4, "#2a1a10", INK, 1)
    elif kind == "iglesia":
        # retablo dorado (Fray Bartolomé al frente lo pinta el script)
        s.rect(W / 2 - 70, 30, 140, 124, "#c8a040", INK, 1.6)
        for k in range(3):
            s.rect(W / 2 - 62 + k * 44, 38, 36, 52, "#8a6a2a", INK, 1, rx=16)
            s.circ(W / 2 - 44 + k * 44, 58, 8, "#f0e0c0", INK, 0.8)
        for x in (W / 2 - 66, W / 2 + 60):
            s.rect(x, 30, 6, 124, "#e0c060", INK, 1)
        s.rect(W / 2 - 60, 100, 120, 50, "#b08a30", INK, 1.4)
        s.rect(W / 2 - 64, 96, 128, 8, "#f4efe4", INK, 1.2)
        greca(s, W / 2 - 60, 120, 120, 10, ROJO, "#f4efe4")  # mantel bordado por manos tlaxcaltecas
        s.rect(W / 2 - 2, 40, 4, 56, "#5a3418", INK, 1)
        s.rect(W / 2 - 14, 52, 28, 4, "#5a3418", INK, 1)
        for cx in (W / 2 - 50, W / 2 + 50, W / 2 + 90):
            vela(s, cx, 98, 14)
        for k in range(10):
            flor_cempa(s, W / 2 - 54 + k * 12, 96, 3)
        # bancas
        for py in (250, 300):
            for px in (70.0, W - 230):
                sombra(s, px + 80, py + 12, 82, 4)
                s.rect(px, py - 6, 160, 12, "#7a4a24", INK, 1.3)
                s.rect(px, py + 6, 160, 4, "#5a3418", INK, 1)
                for k in range(4):
                    s.line(px + 10 + k * 46, py - 4, px + 40 + k * 46, py + 4, "#5a3418", 0.8, op=0.5)
    elif kind == "capitan":
        # mapa del Golfo clavado en la pared
        s.rect(100, 60, 90, 70, "#f0e2c0", INK, 1.6)
        s.path("M108,120 L120,96 L132,86 L150,82 L170,88 L184,84", "none", AZUL, 2)
        s.path("M110,72 q30,10 70,0", "none", "#7aa0c0", 1.2)
        s.circ(150, 95, 3.4, ROJO, INK, 0.8)
        for k in range(4):
            s.circ(100 + k * 30, 60, 2, NEGRO, None)
        # rosa de los vientos
        s.circ(240, 90, 16, "#f0e2c0", INK, 1.2)
        s.poly([(240, 72), (244, 90), (240, 108), (236, 90)], ROJO, INK, 0.8)
        s.poly([(222, 90), (240, 86), (258, 90), (240, 94)], "#3a3a40", INK, 0.8)
        # mesa con carta, compás y tintero
        sombra(s, W / 2, 232, 64, 5)
        s.rect(W / 2 - 62, 196, 124, 8, "#8a5a32", INK, 1.4)
        s.rect(W / 2 - 60, 204, 120, 26, "#5a3418", INK, 1.4)
        s.rect(W / 2 - 40, 190, 50, 10, "#f0e2c0", INK, 0.8)
        s.circ(W / 2 + 30, 194, 4, NEGRO, INK, 0.6)
        # cañón pequeño y barril
        s.rect(W - 170, 236, 56, 14, "#3a3a40", INK, 1.4, rx=6)
        for x in (W - 160, W - 128):
            s.circ(x, 252, 7, "#7a4a24", INK, 1.2)
        s.ell(W - 70, 250, 16, 20, "#8a5a32", INK, 1.4)
        for dy in (-10, 10):
            s.line(W - 85, 250 + dy, W - 55, 250 + dy, "#3a3a40", 2)
        # cofre con herrajes
        s.rect(60, 236, 50, 30, "#7a4a24", INK, 1.4, rx=3)
        s.rect(60, 236, 50, 8, "#9a6a3a", INK, 1)
        s.rect(82, 244, 6, 8, "#c0a040", INK, 0.8)
    # puerta (abajo)
    s.rect(W / 2 - 32, H - 8, 64, 8, "#2a1a0e", INK, 1)
    return s


def todos():
    out = {"casa_jugador": casa_jugador()}
    for d, col in DIOSES.items():
        out[f"templo_{d}"] = templo(d, col)
    for t in TIENDAS:
        out[f"tienda_{t}"] = edificio("tienda", t)
    for k in ("casa", "casa_maya", "otomi", "tipi", "palacio", "iglesia", "capitan"):
        out[k] = edificio(k)
    return out


if __name__ == "__main__":
    d = sys.argv[1]
    os.makedirs(d, exist_ok=True)
    for n, s in todos().items():
        open(os.path.join(d, n + ".svg"), "w").write(s.svg())
    print("listo", len(todos()))
