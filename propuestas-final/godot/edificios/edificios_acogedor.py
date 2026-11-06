"""Hoja buildings.png en estilo ACOGEDOR y prehispánico: 8x4 celdas de 192x160, mismo orden que world.gd.
Uso: python3 edificios_acogedor.py <salida.svg> [escala]
"""
import math, sys, random

CW, CH = 192, 160
CAFE = "#6a3e2c"
ADOBE = "#e8d2b0"
ADOBE2 = "#d8bc94"
CAL = "#f6ecd8"
ROJO = "#c8503a"
ROJO2 = "#a03a2a"
OCRE = "#e8a830"
PAJA = "#e0b860"
PAJA2 = "#c89a44"
MADERA = "#a8703e"
MADERA2 = "#7a4a28"
PIEDRA = "#c8beb0"
PIEDRA2 = "#a89e90"
JADE = "#3a9a7a"
AZUL = "#4a7ac0"
ROSA = "#ec7a8e"
VERDE = "#6aa85a"


def osc(c, f=0.78):
    c = c.lstrip("#")
    r, g, b = (int(c[i:i + 2], 16) for i in (0, 2, 4))
    return "#%02x%02x%02x" % (int(r * f), int(g * f), int(b * f))


class Celda:
    def __init__(self, semilla=1):
        self.o = []
        self.r = random.Random(semilla)

    def add(self, s):
        self.o.append(s)

    def rect(self, x, y, w, h, fill, rx=2, sw=2, st=None):
        st = st or osc(fill, 0.55)
        self.add(f'<rect x="{x:.1f}" y="{y:.1f}" width="{w:.1f}" height="{h:.1f}" rx="{rx}" fill="{fill}" stroke="{st}" stroke-width="{sw}"/>')

    def poly(self, pts, fill, sw=2, st=None):
        st = st or osc(fill, 0.55)
        self.add(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in pts)}" fill="{fill}" stroke="{st}" stroke-width="{sw}" stroke-linejoin="round"/>')

    def path(self, d, fill, sw=2, st=None, op=1):
        st = st or (osc(fill, 0.55) if fill != "none" else CAFE)
        self.add(f'<path d="{d}" fill="{fill}" stroke="{st}" stroke-width="{sw}" stroke-linejoin="round" stroke-linecap="round" opacity="{op}"/>')

    def ell(self, cx, cy, rx, ry, fill, sw=1.6, st=None, op=1):
        st = st or osc(fill, 0.55)
        self.add(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{fill}" stroke="{st}" stroke-width="{sw}" opacity="{op}"/>')

    def linea(self, x0, y0, x1, y1, col, w=1.4, op=1):
        self.add(f'<line x1="{x0:.1f}" y1="{y0:.1f}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" opacity="{op}"/>')

    # ------------------------------------------------ piezas
    def sombra(self, cx=96, y=154, rx=80):
        self.add(f'<ellipse cx="{cx}" cy="{y}" rx="{rx}" ry="6" fill="#000" opacity="0.16"/>')

    def muro(self, x, y, w, h, col=ADOBE, banda=ROJO):
        self.rect(x, y, w, h, col, rx=3)
        for _ in range(int(w * h / 500)):  # manchas del aplanado
            px, py = x + self.r.uniform(4, w - 4), y + self.r.uniform(4, h - 12)
            self.ell(px, py, self.r.uniform(2, 5), self.r.uniform(1, 2.4), osc(col, 0.94), sw=0, op=0.7)
        self.rect(x, y + h - 9, w, 9, banda, rx=2)  # guardapolvo rojo
        self.add(f'<rect x="{x + w - 8:.1f}" y="{y + 2:.1f}" width="6" height="{h - 4:.1f}" fill="#000" opacity="0.08"/>')

    def techo_paja(self, x, y, w, h, alero=10, col=PAJA):
        self.poly([(x - alero, y + h), (x + w * 0.18, y), (x + w * 0.82, y), (x + w + alero, y + h)], col, sw=2.2)
        for k in range(1, 5):  # hileras de zacate
            yy = y + h * k / 5
            t = k / 5
            x0 = x + w * 0.18 - (w * 0.18 + alero) * t
            x1 = x + w * 0.82 + (w * 0.18 + alero) * t
            self.path(" ".join(f"{'M' if i == 0 else 'L'}{x0 + (x1 - x0) * i / 12:.1f},{yy + (2 if i % 2 else 0):.1f}" for i in range(13)), "none", 1.4, osc(col, 0.7))
        self.path(f"M{x - alero},{y + h} Q{x + w / 2},{y + h + 8} {x + w + alero},{y + h}", "none", 2.4, osc(col, 0.6))
        self.linea(x + w * 0.2, y + 2, x + w * 0.8, y + 2, "#fff4c8", 2, 0.8)

    def techo_conico(self, cx, y, r, h, col=PAJA):
        self.poly([(cx - r, y + h), (cx, y), (cx + r, y + h)], col, sw=2.2)
        for k in range(1, 4):
            t = k / 4
            self.path(f"M{cx - r * t},{y + h * t} Q{cx},{y + h * t + 6} {cx + r * t},{y + h * t}", "none", 1.4, osc(col, 0.7))
        self.path(f"M{cx - r},{y + h} Q{cx},{y + h + 9} {cx + r},{y + h}", "none", 2.4, osc(col, 0.6))

    def azotea(self, x, y, w, col=CAL, almenas=True, greca=ROJO):
        self.rect(x - 4, y, w + 8, 12, col, rx=2)
        if greca:
            self.greca(x - 2, y + 2, w + 4, 8, greca, col)
        if almenas:
            n = int(w / 18)
            for i in range(n + 1):
                xx = x - 4 + i * (w + 8 - 10) / max(1, n)
                self.rect(xx, y - 8, 10, 9, col, rx=2)

    def greca(self, x, y, w, h, col, fondo):
        u = h * 1.8
        n = int(w / u)
        d = ""
        for i in range(n):
            ox = x + i * u
            d += (f"M{ox:.1f},{y + h:.1f} L{ox:.1f},{y + h * 0.2:.1f} L{ox + u * 0.55:.1f},{y + h * 0.2:.1f} "
                  f"L{ox + u * 0.55:.1f},{y + h * 0.65:.1f} L{ox + u * 0.3:.1f},{y + h * 0.65:.1f} ")
        self.path(d, "none", h * 0.18, col)

    def puerta(self, x, y, w, h, petate=True):
        self.rect(x - 3, y - 4, w + 6, 5, MADERA, rx=1)          # dintel
        self.rect(x, y, w, h, "#3a2418", rx=2)
        if petate:  # cortina de petate enrollada a medias
            self.rect(x + 1, y + 1, w - 2, h * 0.45, "#d8b46c", rx=1, sw=1.4)
            for k in range(1, 4):
                self.linea(x + 2, y + k * h * 0.11, x + w - 2, y + k * h * 0.11, "#b8924c", 1)
            self.ell(x + w / 2, y + h * 0.46, w / 2, 2.4, "#c8a05c", sw=1.2)

    def ventana(self, x, y, s=14, luz=False):
        self.rect(x - 2, y - 3, s + 4, 4, MADERA, rx=1)
        self.rect(x, y, s, s, "#ffe8a0" if luz else "#4a3024", rx=2)
        self.linea(x + s / 2, y, x + s / 2, y + s, MADERA2, 1.6)

    def maceta(self, x, y, flor=ROSA):
        self.path(f"M{x - 6},{y - 8} L{x + 6},{y - 8} L{x + 4},{y} L{x - 4},{y} Z", "#c0603a", 1.4)
        for a in (-0.5, 0, 0.5):
            self.linea(x, y - 8, x + math.sin(a) * 6, y - 15, VERDE, 2)
        self.ell(x, y - 16, 3.4, 3.4, flor, 1)
        self.ell(x, y - 16, 1.3, 1.3, OCRE, 0)

    def olla(self, x, y, r=6, col="#b8603a"):
        self.ell(x, y - r, r, r * 0.9, col)
        self.ell(x, y - r * 1.7, r * 0.5, r * 0.18, osc(col, 0.6), 1)
        self.path(f"M{x - r * 0.7},{y - r} Q{x},{y - r * 0.6} {x + r * 0.7},{y - r}", "none", 1, "#f6ecd8")

    def mazorcas(self, x, y, n=4):
        self.linea(x, y - 4, x + n * 5, y - 4, MADERA2, 1.4)
        for i in range(n):
            self.ell(x + 2 + i * 5, y + 2, 2.2, 5, [OCRE, "#4a5ab0", ROJO, OCRE][i % 4], 1)

    def escalinata(self, cx, y, w, h, col=PIEDRA, n=5):
        for k in range(n):
            ww = w - k * (w * 0.5 / n)
            self.rect(cx - ww / 2, y + h - (k + 1) * h / n, ww, h / n, col if k % 2 == 0 else osc(col, 0.93), rx=1.5, sw=1.6)

    def svg(self):
        return "".join(self.o)


# ------------------------------------------------------------------ edificios (por celda)
def casa_jugador():
    c = Celda(1); c.sombra()
    c.muro(26, 74, 140, 74)
    c.techo_paja(30, 34, 132, 42)
    c.puerta(84, 108, 26, 40)
    c.ventana(44, 96, 18, True); c.ventana(134, 96, 18, True)
    c.mazorcas(42, 82); c.mazorcas(126, 82)
    c.maceta(24, 152); c.maceta(170, 152, OCRE); c.olla(66, 150); c.olla(126, 150, 5, "#9a4a2a")
    c.rect(4, 132, 18, 20, "#c89a5a", rx=3)  # petaca
    return c


def tianguis():
    c = Celda(2); c.sombra()
    for x in (20, 172):
        c.rect(x - 3, 54, 6, 96, MADERA, rx=2)
    for k in range(7):  # toldo de manta a rayas
        c.path(f"M{14 + k * 24},44 l24,0 l-4,18 q-8,6 -16,0 Z", [ROJO, CAL][k % 2], 1.6)
    c.poly([(10, 44), (96, 24), (182, 44)], ROJO, 2)
    c.rect(18, 108, 156, 40, MADERA, rx=4)
    c.rect(18, 102, 156, 10, "#c88a50", rx=3)
    for i, col in enumerate((OCRE, ROJO, VERDE, "#4a5ab0", OCRE, "#e88a3a")):
        x = 36 + i * 24
        c.ell(x, 94, 10, 6, "#c89a52", 1.4)
        for j in range(4):
            c.ell(x - 4 + (j % 2) * 8, 90 - (j // 2) * 4, 3.4, 3.4, col, 1)
    c.rect(24, 120, 144, 8, CAL, rx=2); c.greca(26, 121, 140, 6, ROJO, CAL)
    return c


def herreria():
    c = Celda(3); c.sombra()
    c.muro(24, 72, 144, 76, PIEDRA, ROJO2)
    c.azotea(24, 60, 144, PIEDRA, True, None)
    c.rect(132, 20, 22, 44, "#a8a094", rx=3)  # chimenea del horno
    for k in range(3):
        c.ell(143 - k * 4, 14 - k * 9, 6 + k * 2, 5 + k, "#e8e4e0", 0, op=0.7 - k * 0.15)
    c.puerta(46, 104, 30, 44, False)
    c.rect(96, 100, 52, 36, "#3a2418", rx=6)  # boca del horno
    c.ell(122, 126, 18, 9, "#ff9a3a", 0); c.ell(122, 128, 10, 5, "#ffe070", 0)
    c.rect(150, 128, 26, 20, "#7a7a84", rx=3)  # yunque de piedra
    for x in (30, 40):
        c.linea(x, 120, x, 146, MADERA2, 3)
    c.ell(88, 150, 9, 4, "#c87a3a", 1.2)  # lingotes de cobre
    return c


def casa_comidas():
    c = Celda(4); c.sombra()
    c.muro(20, 72, 152, 76, "#f0d8b4")
    c.techo_paja(24, 34, 144, 40)
    c.puerta(82, 106, 28, 42)
    c.ventana(38, 94, 20, True); c.ventana(134, 94, 20, True)
    for k in range(3):  # humo del comal
        c.ell(150 - k * 3, 22 - k * 8, 7 + k, 5, "#e8e4e0", 0, op=0.6 - k * 0.15)
    c.path("M30,70 Q96,86 162,70", "none", 1.4, CAFE)  # tira de banderitas
    for k in range(9):
        x = 34 + k * 15
        y = 72 + math.sin(k / 8 * math.pi) * 8
        c.poly([(x - 5, y), (x + 5, y), (x, y + 9)], [ROJO, OCRE, JADE, ROSA][k % 4], 1)
    for x in (14, 178):
        c.olla(x, 150, 7)
    c.rect(118, 132, 34, 16, MADERA, rx=3)
    c.ell(135, 130, 12, 3, "#3a2a20", 1)  # comal afuera
    return c


def casa_xoco():
    c = Celda(5); c.sombra()
    c.muro(28, 72, 136, 76, "#f0b8c0", ROJO2)
    c.azotea(28, 60, 136, "#f8d8dc", True, "#c8506a")
    c.puerta(82, 106, 28, 42)
    c.ventana(44, 92, 18, True); c.ventana(130, 92, 18, True)
    for x in (22, 46, 146, 170):
        c.maceta(x, 152, [ROSA, OCRE, "#f4f0ff", ROSA][x % 4])
    c.path("M28,84 Q40,78 52,84 Q64,90 76,84", "none", 2.4, VERDE)  # enredadera
    for x in (34, 50, 66):
        c.ell(x, 83, 3, 3, ROSA, 1)
    return c


def temazcal():
    c = Celda(6); c.sombra(96, 152, 70)
    c.path("M30,148 Q30,52 96,48 Q162,52 162,148 Z", "#c8875a", 2.4)
    for k in range(4):
        y = 70 + k * 20
        c.path(f"M{36 + k * 2},{y} Q96,{y - 8} {156 - k * 2},{y}", "none", 1.2, "#a86a40", )
    c.path("M80,148 L80,124 Q96,110 112,124 L112,148 Z", "#3a2418", 2)
    c.rect(150, 118, 30, 30, "#a86a40", rx=8)  # cuexcomatl del fuego
    c.ell(165, 136, 8, 6, "#ff9a3a", 0)
    c.ell(96, 52, 10, 4, "#a86a40", 1.4)
    for k in range(3):
        c.ell(96 + k * 2, 40 - k * 9, 7 + k * 2, 5, "#f4f0ec", 0, op=0.6 - k * 0.15)
    for x in (24, 60, 132):
        c.add(f'<path d="M{x},148 l3,-12 l3,12" fill="{VERDE}" stroke="#3e6a2a" stroke-width="1"/>')
    return c


def armeria():
    c = Celda(7); c.sombra()
    c.muro(20, 70, 152, 78, PIEDRA, ROJO2)
    c.azotea(20, 58, 152, PIEDRA, True, ROJO)
    c.puerta(80, 102, 32, 46, False)
    for i, x in enumerate((44, 148)):  # escudos (chimalli)
        c.ell(x, 96, 14, 14, [ROJO, OCRE][i], 2)
        c.ell(x, 96, 7, 7, CAL, 1.4)
        for k in range(4):
            c.linea(x - 9 + k * 6, 110, x - 10 + k * 6, 120, [JADE, CAL][k % 2], 2.4)
    for s in (-1, 1):  # lanzas cruzadas sobre la puerta
        c.linea(96 - s * 24, 96, 96 + s * 24, 64, MADERA2, 3)
        c.poly([(96 + s * 24, 64), (96 + s * 30, 56), (96 + s * 20, 60)], "#3a3640", 1)
    return c


def templo():
    c = Celda(8); c.sombra(96, 154, 86)
    c.escalinata(96, 70, 176, 84, PIEDRA2, 4)
    c.rect(78, 82, 36, 72, "#d8d0c4", rx=2)  # escalera central
    for k in range(8):
        c.linea(80, 88 + k * 8, 112, 88 + k * 8, PIEDRA2, 1.2)
    c.rect(60, 34, 72, 40, "#7a3a2a", rx=3)  # adoratorio
    c.rect(54, 22, 84, 14, "#4a4a5a", rx=2)
    c.greca(56, 25, 80, 8, OCRE, "#4a4a5a")
    c.puerta(84, 48, 24, 26, False)
    for x in (48, 144):  # braseros
        c.rect(x - 7, 60, 14, 12, "#6a6058", rx=2)
        c.ell(x, 54, 6, 8, "#ff9a3a", 0); c.ell(x, 57, 3, 4, "#ffe070", 0)
    return c


def consultorio():
    c = Celda(9); c.sombra()
    c.muro(28, 74, 136, 74, "#e8f0e0", "#3a8a6a")
    c.techo_paja(32, 36, 128, 40, col="#d8c070")
    c.puerta(82, 106, 28, 42)
    c.ventana(44, 94, 18); c.ventana(130, 94, 18)
    for i in range(5):  # manojos de hierbas colgando
        x = 40 + i * 28
        c.linea(x, 78, x, 86, MADERA2, 1)
        c.path(f"M{x - 4},{86} l4,10 l4,-10 Z", [VERDE, "#8ab84a", "#6a9a4a"][i % 3], 1)
    c.rect(150, 126, 28, 22, "#c8a05a", rx=3)
    for k in range(3):
        c.olla(156 + k * 9, 128, 4, ["#b8603a", "#3a8a6a", "#c8a03a"][k])
    c.maceta(20, 152, VERDE); c.maceta(172, 152, "#f4f0ff")
    return c


def palacio():
    c = Celda(10); c.sombra(96, 154, 90)
    c.rect(6, 118, 180, 34, PIEDRA, rx=3)      # plataforma
    c.escalinata(96, 118, 50, 34, "#d8d0c4", 4)
    c.muro(18, 60, 156, 60, CAL, ROJO)
    c.azotea(18, 48, 156, CAL, True, ROJO)
    for x in (30, 60, 132, 162):  # columnas pintadas
        c.rect(x - 5, 64, 10, 52, ROJO, rx=2)
    c.puerta(84, 82, 24, 36, False)
    for x in (12, 180):  # estandartes de la garza
        c.linea(x, 30, x, 118, MADERA2, 3)
        c.rect(x - (0 if x < 96 else 20), 32, 20, 26, CAL, rx=2)
        c.path(f"M{x + (4 if x < 96 else -16)},50 q4,-10 10,-13 l1,3 q-3,5 -3,11 Z", "#ffffff", 1.2, CAFE)
    return c


def fuente():
    c = Celda(11); c.sombra(96, 150, 56)
    c.ell(96, 132, 56, 20, PIEDRA, 2.2)
    c.ell(96, 128, 46, 14, "#6ab0d8", 1.6)
    c.path("M60,126 q10,-4 20,0 t20,0 t20,0", "none", 1.6, "#e8f4fa")
    c.rect(88, 84, 16, 44, PIEDRA2, rx=3)
    c.ell(96, 82, 18, 6, PIEDRA, 1.6)
    for k in (-1, 0, 1):
        c.path(f"M96,80 q{k * 12},-14 {k * 22},20", "none", 2, "#8ac8f0")
    c.greca(60, 140, 72, 8, ROJO, PIEDRA)
    return c


def casita():
    c = Celda(12); c.sombra(96, 152, 64)
    c.muro(46, 82, 100, 66, CAL)
    c.techo_paja(50, 48, 92, 36)
    c.puerta(84, 112, 24, 36)
    c.ventana(58, 100, 14); c.ventana(120, 100, 14)
    c.maceta(40, 152); c.olla(156, 150, 6)
    return c


def templo_mayor():
    c = Celda(13); c.sombra(96, 154, 90)
    c.escalinata(96, 40, 184, 114, PIEDRA2, 6)
    c.rect(80, 52, 32, 102, "#d8d0c4", rx=2)
    for k in range(12):
        c.linea(82, 58 + k * 8, 110, 58 + k * 8, PIEDRA2, 1.2)
    c.rect(66, 16, 60, 30, ROJO, rx=3)
    c.rect(62, 8, 68, 10, "#4a4a5a", rx=2)
    c.greca(64, 10, 64, 6, OCRE, "#4a4a5a")
    c.puerta(86, 26, 20, 20, False)
    for x in (20, 172):
        c.rect(x - 4, 120, 8, 30, PIEDRA2, rx=2)
        c.ell(x, 116, 6, 8, "#ff9a3a", 0)
    return c


def calli():
    c = Celda(14); c.sombra(96, 152, 56)
    c.muro(56, 92, 80, 56, ADOBE)
    c.azotea(56, 82, 80, ADOBE2, False, ROJO)
    c.puerta(86, 116, 20, 32)
    c.ventana(64, 104, 12)
    c.maceta(146, 152, OCRE)
    return c


def tipi():
    c = Celda(15); c.sombra(96, 152, 60)
    c.poly([(40, 150), (96, 24), (152, 150)], "#e0c8a0", 2.4)
    for x, a in ((88, -1), (104, 1)):
        c.linea(96, 24, 96 + a * 14, 6, MADERA2, 2.4)
    c.path("M60,110 q36,-10 72,0", "none", 3, ROJO)
    c.path("M68,90 l8,-8 l8,8 l8,-8 l8,8 l8,-8 l8,8", "none", 2.4, AZUL)
    c.poly([(84, 150), (96, 116), (108, 150)], "#3a2418", 2)
    c.ell(130, 66, 6, 6, OCRE, 1.4)
    return c


def ramada():
    c = Celda(16); c.sombra(96, 152, 76)
    for x in (24, 96, 168):
        c.rect(x - 4, 60, 8, 90, MADERA, rx=2)
    c.poly([(10, 64), (34, 40), (158, 40), (182, 64)], "#c8a04a", 2.2)
    for k in range(12):
        c.linea(16 + k * 14, 64, 34 + k * 11, 42, "#a8802a", 1.2)
    c.rect(40, 118, 112, 10, MADERA, rx=3)
    for x in (48, 144):
        c.linea(x, 128, x, 148, MADERA2, 3)
    c.ell(70, 112, 10, 4, "#c89a52", 1.2); c.olla(120, 118, 5)
    return c


def otomi():
    c = Celda(17); c.sombra(96, 152, 60)
    c.path("M44,150 L44,96 Q96,86 148,96 L148,150 Z", "#d8b88a", 2.2)  # muro redondo
    c.add('<rect x="44" y="141" width="104" height="9" fill="#a8603a" opacity="0.9"/>')
    c.techo_conico(96, 22, 66, 76, "#d8b060")
    c.puerta(84, 112, 24, 38)
    c.maceta(36, 152, OCRE)
    c.linea(152, 150, 152, 112, MADERA2, 2); c.rect(152, 112, 20, 26, "#c8506a", rx=2)  # tejido colgado
    for k in range(3):
        c.linea(154, 118 + k * 7, 170, 118 + k * 7, [OCRE, AZUL, CAL][k], 2)
    return c


def puesto_tejidos():
    c = Celda(18); c.sombra()
    c.rect(18, 50, 8, 100, MADERA, rx=2); c.rect(166, 50, 8, 100, MADERA, rx=2)
    c.rect(10, 44, 172, 10, MADERA2, rx=3)
    cols = [ROJO, AZUL, OCRE, JADE, "#8a3a8a", ROSA]
    for i, col in enumerate(cols):
        x = 30 + i * 22
        c.rect(x, 54, 18, 60, col, rx=2, sw=1.6)
        for k in range(4):
            c.linea(x + 2, 62 + k * 12, x + 16, 62 + k * 12, CAL, 1.6)
    c.rect(20, 120, 152, 28, "#c88a50", rx=4)
    for i in range(5):
        c.rect(30 + i * 28, 112, 22, 10, cols[i], rx=3, sw=1.2)
    return c


def manantial():
    c = Celda(19); c.sombra(96, 150, 70)
    c.ell(96, 126, 72, 26, "#8ac06a", 0)
    c.ell(96, 124, 60, 20, "#5aa8d8", 2)
    c.path("M56,122 q8,-4 16,0 t16,0 t16,0 t16,0", "none", 1.6, "#e8f4fa")
    for x in (34, 150, 70):
        c.ell(x, 106 + (x % 3) * 4, 10, 6, PIEDRA, 1.6)
    for x in (30, 160):
        for a in (-0.4, 0, 0.4):
            c.linea(x, 120, x + math.sin(a) * 10, 96, VERDE, 2.4)
    c.ell(128, 118, 8, 3, "#6aa85a", 1)
    return c


def posta():
    c = Celda(20); c.sombra(96, 152, 66)
    c.muro(40, 88, 112, 60, ADOBE)
    c.techo_paja(44, 52, 104, 38)
    c.puerta(82, 114, 28, 34)
    c.rect(150, 116, 34, 32, MADERA, rx=3)  # bebedero
    c.rect(152, 118, 30, 8, "#5aa8d8", rx=2)
    c.linea(8, 110, 40, 110, MADERA2, 2.4); c.linea(8, 128, 40, 128, MADERA2, 2.4)
    c.linea(12, 104, 12, 148, MADERA2, 3)
    return c


def cuexcomate():
    """granero de barro en forma de olla sobre base de piedra, con sombrero de zacate"""
    c = Celda(32); c.sombra(96, 152, 50)
    c.rect(56, 126, 80, 24, PIEDRA, rx=4)
    for x in range(60, 134, 14):
        c.linea(x, 128, x + 4, 148, PIEDRA2, 1.2)
    c.path("M62,128 Q48,90 70,62 Q96,48 122,62 Q144,90 130,128 Z", "#c8875a", 2.4)
    for k in range(3):
        y = 76 + k * 16
        c.path(f"M{60 + k},{y} Q96,{y + 6} {132 - k},{y}", "none", 1.2, "#a86a40")
    c.techo_conico(96, 22, 46, 44, PAJA)
    c.rect(88, 82, 16, 14, "#3a2418", rx=3)   # boca para sacar el maíz
    for i in range(4):  # escalerita
        c.linea(146, 150 - i * 14, 162, 150 - i * 14, MADERA2, 2)
    c.linea(146, 150, 140, 92, MADERA, 2.6); c.linea(162, 150, 156, 92, MADERA, 2.6)
    c.mazorcas(34, 130, 3)
    return c


def farol():
    c = Celda(21)
    c.rect(88, 100, 16, 54, MADERA, rx=3)
    c.path("M76,100 L116,100 L108,84 L84,84 Z", "#7a7a84", 2)
    c.ell(96, 76, 12, 16, "#ff9a3a", 0); c.ell(96, 80, 6, 8, "#ffe070", 0)
    return c


def horno():
    c = Celda(22); c.sombra(96, 150, 56)
    c.path("M44,148 Q40,70 96,64 Q152,70 148,148 Z", "#c8774a", 2.4)
    c.rect(118, 30, 18, 40, "#a8603a", rx=4)
    c.path("M76,148 L76,118 Q96,100 116,118 L116,148 Z", "#3a2418", 2)
    c.ell(96, 136, 14, 8, "#ff9a3a", 0); c.ell(96, 138, 8, 4, "#ffe070", 0)
    for k in range(5):
        c.ell(60 + k * 18, 100 - abs(2 - k) * 6, 6, 3, "#a8603a", 1, op=0.6)
    c.rect(150, 132, 34, 16, MADERA2, rx=3)  # leña
    return c


def corral():
    c = Celda(23); c.sombra()
    c.muro(30, 80, 132, 68, "#e0c49a")
    c.techo_paja(34, 44, 124, 38)
    c.rect(74, 110, 44, 38, "#5a3a24", rx=3)
    for k in range(5):
        c.linea(78 + k * 9, 112, 78 + k * 9, 146, "#8a5a32", 2)
    for x in range(4, 190, 12):  # cerquita de otate
        if 30 < x < 162:
            continue
        c.linea(x, 122, x, 150, MADERA, 2.4)
    c.linea(4, 130, 30, 130, MADERA2, 2); c.linea(162, 130, 188, 130, MADERA2, 2)
    c.ell(176, 146, 8, 3, "#c89a52", 1.2)
    return c


def iglesia():
    c = Celda(24); c.sombra(96, 154, 80)
    c.rect(26, 78, 140, 70, "#f4ecdc", rx=3)
    c.poly([(20, 80), (96, 44), (172, 80)], "#c8503a", 2.2)
    c.rect(78, 20, 36, 64, "#f4ecdc", rx=3)
    c.poly([(74, 22), (96, 6), (118, 22)], "#c8503a", 2)
    c.linea(96, 6, 96, 0, CAFE, 2)
    c.path("M86,40 Q96,26 106,40 L106,56 L86,56 Z", "#4a3024", 1.6)
    c.ell(96, 46, 4, 6, OCRE, 1)
    c.path("M82,148 L82,108 Q96,92 110,108 L110,148 Z", "#7a4a28", 2)
    for x in (44, 140):
        c.path(f"M{x - 8},120 L{x - 8},104 Q{x},94 {x + 8},104 L{x + 8},120 Z", "#4a3024", 1.6)
    c.maceta(30, 152, ROSA); c.maceta(162, 152, OCRE)
    return c


def galeon():
    c = Celda(25)
    c.path("M10,118 L182,118 L164,150 L28,150 Z", "#8a5a32", 2.4)
    c.rect(12, 108, 168, 12, "#a8703e", rx=2)
    for k in range(6):
        c.ell(32 + k * 26, 132, 4, 4, "#3a2a20", 1)
    for x, h in ((56, 76), (100, 96), (146, 70)):
        c.linea(x, 108, x, 108 - h, MADERA2, 3)
        c.path(f"M{x - 22},{112 - h} Q{x},{104 - h} {x + 22},{112 - h} L{x + 20},{136 - h * 0.6} Q{x},{128 - h * 0.6} {x - 20},{136 - h * 0.6} Z", CAL, 1.8)
        c.path(f"M{x - 8},{118 - h * 0.9} l16,0 m-8,-6 l0,14", "none", 3, ROJO)
    c.path("M0,150 q12,-5 24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0 t24,0", "none", 2.4, "#8ac8f0")
    return c


def casa_espanola():
    c = Celda(26); c.sombra(96, 152, 64)
    c.rect(44, 84, 104, 64, "#f4ecdc", rx=2)
    c.poly([(36, 86), (96, 52), (156, 86)], "#c8503a", 2.2)
    for k in range(4):
        c.linea(44 + k * 8, 82 - k * 4.5, 148 - k * 8, 82 - k * 4.5, ROJO2, 1.2)
    c.rect(84, 112, 24, 36, "#7a4a28", rx=10)
    c.ventana(56, 100, 14); c.ventana(122, 100, 14)
    c.maceta(40, 152, ROSA)
    return c


def piramide_escalonada():
    c = Celda(27); c.sombra(96, 154, 90)
    c.escalinata(96, 30, 186, 124, "#c8b898", 7)
    c.rect(82, 40, 28, 114, "#e0d4bc", rx=2)
    for k in range(13):
        c.linea(84, 46 + k * 8, 108, 46 + k * 8, "#b8a888", 1.2)
    c.rect(70, 10, 52, 30, "#e0d4bc", rx=3)
    c.greca(72, 14, 48, 8, ROJO, "#e0d4bc")
    c.puerta(88, 24, 16, 16, False)
    return c


def ruinas():
    c = Celda(28); c.sombra(96, 150, 80)
    c.rect(20, 110, 150, 38, PIEDRA2, rx=3)
    for x, h in ((36, 50), (70, 30), (130, 60), (160, 26)):
        c.rect(x - 9, 110 - h, 18, h, PIEDRA, rx=2)
    c.greca(24, 120, 140, 10, "#8a8070", PIEDRA2)
    for x in (52, 100, 148):
        for a in (-0.5, 0, 0.5):
            c.linea(x, 110, x + math.sin(a) * 9, 96, VERDE, 2.4)
    c.ell(110, 146, 12, 5, "#7aa84a", 1.2)
    return c


def refugio():
    c = Celda(29); c.sombra()
    c.rect(34, 82, 124, 66, "#8a5a32", rx=3)
    for k in range(6):
        c.linea(34, 88 + k * 10, 158, 88 + k * 10, "#6a4024", 1.6)
    c.poly([(24, 86), (96, 40), (168, 86)], "#6a4a3a", 2.2)
    c.path("M24,86 L96,40 L168,86 L160,90 Q96,52 32,90 Z", "#f4f6fc", 1.6)  # nieve en el techo
    c.rect(130, 26, 16, 30, "#8a7a6a", rx=2)
    c.puerta(82, 110, 28, 38, False)
    c.ventana(48, 100, 16, True); c.ventana(130, 100, 16, True)
    c.ell(60, 150, 24, 5, "#f4f6fc", 1)
    return c


def tienda_espanola():
    c = Celda(30); c.sombra()
    c.rect(26, 74, 140, 74, "#f4ecdc", rx=2)
    c.poly([(18, 76), (96, 40), (174, 76)], "#c8503a", 2.2)
    for k in range(6):  # toldo
        c.path(f"M{30 + k * 22},84 l22,0 l-3,14 q-8,5 -16,0 Z", [ROJO, CAL][k % 2], 1.4)
    c.rect(80, 108, 32, 40, "#7a4a28", rx=4)
    for i, x in enumerate((34, 140)):
        c.rect(x, 112, 20, 32, "#8a5a32", rx=3)  # barriles
        c.linea(x, 120, x + 20, 120, "#4a4a54", 2); c.linea(x, 136, x + 20, 136, "#4a4a54", 2)
    return c


def mercado_maya():
    c = Celda(31); c.sombra()
    for x in (16, 96, 176):
        c.rect(x - 4, 60, 8, 90, MADERA, rx=2)
    c.techo_paja(18, 26, 156, 38, 12, "#d8b060")
    c.rect(14, 112, 164, 36, "#a8703e", rx=4)
    cols = [JADE, OCRE, ROJO, "#3a2a1a", VERDE, OCRE]
    for i, col in enumerate(cols):
        x = 30 + i * 26
        c.ell(x, 106, 11, 6, "#c89a52", 1.4)
        for j in range(3):
            c.ell(x - 4 + j * 4, 101, 3.4, 3.4, col, 1)
    c.greca(18, 124, 156, 10, JADE, "#a8703e")
    return c


def casa_nivel(n):
    """los 7 niveles de tu casa, de choza a casa grande"""
    c = Celda(40 + n); c.sombra(96, 154, 50 + n * 6)
    if n == 1:  # choza de zacate
        c.path("M60,150 L60,112 Q96,104 132,112 L132,150 Z", "#c8a070", 2)
        c.techo_conico(96, 50, 58, 64, PAJA)
        c.puerta(86, 122, 20, 28)
        c.olla(146, 150, 5)
        return c
    if n == 2:
        c.muro(50, 96, 92, 52)
        c.techo_paja(54, 64, 84, 34)
        c.puerta(84, 118, 24, 30)
        c.olla(150, 150, 6); c.maceta(42, 152)
        return c
    if n == 3:
        return casa_jugador()
    if n == 4:
        c.muro(14, 82, 110, 66); c.techo_paja(18, 48, 102, 36)
        c.muro(122, 96, 56, 52, ADOBE2); c.techo_paja(124, 70, 52, 28, 6)
        c.puerta(56, 112, 26, 36); c.ventana(26, 100, 16, True); c.ventana(96, 100, 16, True)
        c.puerta(140, 120, 20, 28); c.mazorcas(26, 88); c.maceta(10, 152, OCRE); c.olla(186, 150, 5)
        return c
    if n == 5:
        c.muro(16, 74, 160, 74, CAL); c.azotea(16, 62, 160, CAL, True, ROJO)
        c.puerta(84, 106, 28, 42); c.ventana(34, 92, 18, True); c.ventana(140, 92, 18, True)
        for x in (12, 38, 154, 180):
            c.maceta(x, 152, [ROSA, OCRE, "#f4f0ff", ROSA][x % 4])
        return c
    if n == 6:
        c.muro(10, 90, 172, 58, CAL); c.azotea(10, 78, 172, CAL, False, ROJO)
        c.muro(50, 40, 92, 40, ADOBE); c.azotea(50, 28, 92, ADOBE2, True, JADE)
        c.puerta(82, 110, 28, 38); c.ventana(22, 104, 16, True); c.ventana(154, 104, 16, True)
        c.ventana(64, 52, 14, True); c.ventana(114, 52, 14, True)
        c.maceta(10, 152); c.maceta(182, 152, OCRE)
        return c
    # 7: casa grande con pórtico, columnas pintadas, grecas y jardín
    c.rect(4, 124, 184, 28, PIEDRA, rx=3)
    c.escalinata(96, 124, 44, 28, "#d8d0c4", 3)
    c.muro(14, 56, 164, 70, CAL, ROJO)
    c.azotea(14, 44, 164, CAL, True, ROJO)
    for x in (30, 58, 134, 162):
        c.rect(x - 5, 62, 10, 58, ROJO, rx=2)
    c.puerta(84, 84, 24, 40)
    c.ventana(68, 30, 0) if False else None
    for x in (8, 184):
        c.maceta(x, 150, ROSA)
    c.rect(78, 20, 36, 26, ADOBE, rx=3); c.greca(80, 24, 32, 6, JADE, ADOBE)
    return c


ORDEN = [casa_jugador, tianguis, herreria, casa_comidas, casa_xoco, temazcal, armeria, templo,
         consultorio, palacio, fuente, casita, templo_mayor, calli, tipi, ramada,
         otomi, puesto_tejidos, manantial, cuexcomate, posta, farol, horno, corral,
         iglesia, galeon, casa_espanola, piramide_escalonada, ruinas, refugio, tienda_espanola, mercado_maya]


def hoja(esc=1):
    W, H = CW * 8, CH * 4
    defs, cuerpo = "", ""
    for i, fn in enumerate(ORDEN):
        x, y = (i % 8) * CW, (i // 8) * CH
        defs += f'<clipPath id="c{i}"><rect x="0" y="0" width="{CW}" height="{CH}"/></clipPath>'
        cuerpo += f'<g transform="translate({x} {y})"><g clip-path="url(#c{i})">{fn().svg()}</g></g>'
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W * esc}" height="{H * esc}" viewBox="0 0 {W} {H}"><defs>{defs}</defs>{cuerpo}</svg>'


def hoja_niveles(esc=1):
    W, H = CW * 7, CH
    defs = "".join(f'<clipPath id="n{i}"><rect width="{CW}" height="{CH}"/></clipPath>' for i in range(7))
    cuerpo = "".join(f'<g transform="translate({i * CW} 0)"><g clip-path="url(#n{i})">{casa_nivel(i + 1).svg()}</g></g>' for i in range(7))
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{W * esc}" height="{H * esc}" viewBox="0 0 {W} {H}"><defs>{defs}</defs>{cuerpo}</svg>'


if __name__ == "__main__":
    esc = float(sys.argv[2]) if len(sys.argv) > 2 else 1
    open(sys.argv[1], "w").write(hoja(esc))
    if len(sys.argv) > 3:
        open(sys.argv[3], "w").write(hoja_niveles(esc))
    print("listo")
