"""Pantallas nuevas en estilo ACOGEDOR: mapa de la región, calendario, álbum de amistades, recetas, diario,
pantalla de carga y pausa. Salen SVG (con fuentes por @font-face) para pintarse con Chromium.
Uso: python3 pantallas_acogedor.py <salida_dir> <dir_fuentes>
"""
import math, os, random, sys

CAFE = "#7a4a3a"
CAFE2 = "#5a3a2a"
CREMA = "#fbf4e4"
CREMA2 = "#f2e2c4"
PAPEL = "#e8d4a8"
ROSA = "#ec7a8e"
NARANJA = "#e8805a"
OCRE = "#e8a830"
VERDE = "#7ab86a"
AZUL = "#5a9ad8"
ROJO = "#d8503a"
JADE = "#3a9a7a"


def flor(cx, cy, r, col):
    o = "".join(f'<circle cx="{cx + math.cos(a) * r * 0.62:.1f}" cy="{cy + math.sin(a) * r * 0.62:.1f}" r="{r * 0.5:.1f}" fill="{col}" stroke="{CAFE}" stroke-width="0.9"/>'
                for a in [i * math.tau / 5 - math.pi / 2 for i in range(5)])
    return o + f'<circle cx="{cx}" cy="{cy}" r="{r * 0.36:.1f}" fill="{OCRE}" stroke="{CAFE}" stroke-width="0.8"/>'


def corazon(cx, cy, r, fill, st=CAFE):
    return (f'<path d="M{cx},{cy + r * 0.9} C{cx - r * 1.6},{cy - r * 0.2} {cx - r * 0.9},{cy - r * 1.4} {cx},{cy - r * 0.5} '
            f'C{cx + r * 0.9},{cy - r * 1.4} {cx + r * 1.6},{cy - r * 0.2} {cx},{cy + r * 0.9} Z" fill="{fill}" stroke="{st}" stroke-width="1.6" stroke-linejoin="round"/>')


class Doc:
    def __init__(self, w, h, fuentes, esc=2):
        self.w, self.h, self.esc = w, h, esc
        self.o = []
        self.defs = [f'<style>@font-face{{font-family:Bree;src:url(file://{fuentes}/BreeSerif.ttf)}}'
                     f'@font-face{{font-family:Nun;src:url(file://{fuentes}/Nunito-Bold.ttf)}}'
                     f'.t{{font-family:Bree;fill:{CAFE}}}.n{{font-family:Nun;fill:{CAFE2}}}</style>']

    def add(self, s):
        self.o.append(s)

    def texto(self, x, y, t, tam=18, clase="t", anchor="middle", fill=None, borde=None):
        f = f' fill="{fill}"' if fill else ""
        b = f' stroke="{borde}" stroke-width="{tam * 0.18:.1f}" paint-order="stroke" stroke-linejoin="round"' if borde else ""
        self.add(f'<text x="{x}" y="{y}" class="{clase}" font-size="{tam}" text-anchor="{anchor}"{f}{b}>{t}</text>')

    def svg(self):
        return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{self.w * self.esc}" height="{self.h * self.esc}" viewBox="0 0 {self.w} {self.h}">'
                f'<defs>{"".join(self.defs)}</defs>{"".join(self.o)}</svg>')


def papel(D, x, y, w, h, col=PAPEL, semilla=1, fibras=True):
    r = random.Random(semilla)
    D.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="18" fill="{col}" stroke="{CAFE}" stroke-width="4"/>')
    if fibras:
        for _ in range(int(w * h / 900)):
            px, py = x + r.uniform(10, w - 10), y + r.uniform(10, h - 10)
            L = r.uniform(10, 30); a = r.uniform(-0.4, 0.4)
            D.add(f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{px + math.cos(a) * L:.1f}" y2="{py + math.sin(a) * L:.1f}" stroke="#c8a878" stroke-width="1" opacity="0.5"/>')


def cinta(D, cx, y, w, texto, col=NARANJA):
    D.add(f'<path d="M{cx - w / 2 - 22},{y + 6} l14,-12 l-14,-12 h26 v24 Z" fill="{col}" stroke="{CAFE}" stroke-width="2.4" stroke-linejoin="round" opacity="0.9"/>')
    D.add(f'<path d="M{cx + w / 2 + 22},{y + 6} l-14,-12 l14,-12 h-26 v24 Z" fill="{col}" stroke="{CAFE}" stroke-width="2.4" stroke-linejoin="round" opacity="0.9"/>')
    D.add(f'<rect x="{cx - w / 2}" y="{y - 22}" width="{w}" height="34" rx="8" fill="{col}" stroke="{CAFE}" stroke-width="2.6"/>')
    D.texto(cx, y + 3, texto, 24, fill=CREMA)


# ------------------------------------------------------------------ mapa de la región
def mapa(fuentes, con_nombres=True):
    W, H = 960, 540
    D = Doc(W, H, fuentes)
    r = random.Random(5)
    D.add(f'<rect width="{W}" height="{H}" fill="#5a3a2a"/>')
    papel(D, 12, 12, W - 24, H - 24, "#ead8ae", 3)
    X = lambda x: 40 + x / 541 * 880
    Y = lambda y: 96 + y / 72 * 400
    # mar del Golfo y la costa
    D.add(f'<path d="M{X(415)},{Y(-4)} Q{X(405)},{Y(30)} {X(418)},{Y(76)} L{X(482)},{Y(76)} Q{X(470)},{Y(36)} {X(484)},{Y(-4)} Z" fill="#8ac0e0" stroke="{CAFE}" stroke-width="2"/>')
    for k in range(10):
        x, y = X(r.uniform(425, 470)), Y(r.uniform(4, 68))
        D.add(f'<path d="M{x - 6},{y} q3,-3 6,0 t6,0" fill="none" stroke="#e8f4fa" stroke-width="1.6"/>')
    for cx, cy, rx, ry in ((441, 17, 6, 4), (457, 52, 5, 3)):
        D.add(f'<ellipse cx="{X(cx)}" cy="{Y(cy)}" rx="{rx * 1.8}" ry="{ry * 4}" fill="#e0c890" stroke="{CAFE}" stroke-width="1.6"/>')
    # lago de Tenochtitlan con su isla
    D.add(f'<ellipse cx="{X(190)}" cy="{Y(16)}" rx="{17 * 1.7}" ry="{13 * 5}" fill="#8ac0e0" stroke="{CAFE}" stroke-width="2"/>')
    D.add(f'<ellipse cx="{X(192)}" cy="{Y(16)}" rx="13" ry="24" fill="#d8c08a" stroke="{CAFE}" stroke-width="1.6"/>')
    # sierras, volcanes y nieve
    def monte(x, y, s, nieve=False, col="#9a8a7a"):
        D.add(f'<path d="M{x - s},{y} L{x},{y - s * 1.2} L{x + s},{y} Z" fill="{col}" stroke="{CAFE}" stroke-width="1.6" stroke-linejoin="round"/>')
        if nieve:
            D.add(f'<path d="M{x - s * 0.35},{y - s * 0.78} L{x},{y - s * 1.2} L{x + s * 0.35},{y - s * 0.78} q-6,4 -12,0 q-6,4 -11,0 Z" fill="#ffffff" stroke="{CAFE}" stroke-width="1"/>')
    for k in range(5):
        monte(X(165 + k * 13), Y(66), 18 + (k % 2) * 6, k == 2)
    for k in range(6):
        monte(X(292 + k * 10), Y(28), 16 + (k % 3) * 5, True, "#b8c4d8")
    monte(X(48), Y(64), 34, True, "#a87a5a")  # Popocatépetl
    D.add(f'<path d="M{X(48) - 4},{Y(64) - 40} q-4,-14 4,-22 q6,-6 2,-14" fill="none" stroke="#c8c0b8" stroke-width="3" opacity="0.8"/>')
    # árboles, pinos, palmas y milpa
    def arbol(x, y, col=VERDE):
        D.add(f'<rect x="{x - 1.5}" y="{y}" width="3" height="7" fill="#8a5a32"/><circle cx="{x}" cy="{y - 3}" r="7" fill="{col}" stroke="{CAFE}" stroke-width="1.2"/>')
    def pino(x, y):
        D.add(f'<path d="M{x - 7},{y + 4} L{x},{y - 12} L{x + 7},{y + 4} Z" fill="#3e7a4a" stroke="{CAFE}" stroke-width="1.2"/>')
    def palma(x, y):
        D.add(f'<path d="M{x},{y + 6} q2,-8 0,-14" stroke="#8a5a32" stroke-width="2" fill="none"/>' + "".join(
            f'<path d="M{x},{y - 8} q{s * 6},-4 {s * 11},2" stroke="#4a9a4a" stroke-width="3" fill="none" stroke-linecap="round"/>' for s in (-1, 1)))
    for _ in range(26): arbol(X(r.uniform(126, 154)), Y(r.uniform(4, 44)), r.choice([VERDE, "#5a9a4a"]))
    for _ in range(26): pino(X(r.uniform(228, 284)), Y(r.uniform(4, 70)))
    for _ in range(20): palma(X(r.uniform(292, 346)), Y(r.uniform(44, 70)))
    for _ in range(18): palma(X(r.uniform(486, 536)), Y(r.uniform(50, 70)))
    for _ in range(12): arbol(X(r.uniform(486, 536)), Y(r.uniform(6, 46)), "#3e8a4a")
    for k in range(5):  # milpa de la granja
        for j in range(3):
            x, y = X(18 + k * 5), Y(30 + j * 5)
            D.add(f'<path d="M{x},{y + 5} L{x},{y - 6} M{x},{y - 2} l-4,-3 M{x},{y - 3} l4,-3" stroke="#5a9a3a" stroke-width="1.6"/>')
    # desierto
    for _ in range(14):
        x, y = X(r.uniform(4, 150)), Y(r.uniform(52, 70))
        D.add(f'<path d="M{x},{y + 5} v-10 m0,4 h-4 v-3 m4,5 h4 v-4" stroke="#5a8a4a" stroke-width="2" fill="none"/>')
    # lugares
    def casa(x, y, col="#e8d2b0", techo="#e0b860"):
        D.add(f'<rect x="{x - 9}" y="{y - 8}" width="18" height="12" rx="2" fill="{col}" stroke="{CAFE}" stroke-width="1.4"/>'
              f'<path d="M{x - 12},{y - 7} L{x - 5},{y - 16} L{x + 5},{y - 16} L{x + 12},{y - 7} Z" fill="{techo}" stroke="{CAFE}" stroke-width="1.4"/>')
    def piramide(x, y, s=1.0, col="#c8beb0"):
        for k in range(4):
            w = (30 - k * 6) * s
            D.add(f'<rect x="{x - w / 2}" y="{y - (k + 1) * 6 * s}" width="{w}" height="{6 * s}" fill="{col}" stroke="{CAFE}" stroke-width="1.2"/>')
        D.add(f'<rect x="{x - 5 * s}" y="{y - 30 * s}" width="{10 * s}" height="{7 * s}" fill="{ROJO}" stroke="{CAFE}" stroke-width="1.2"/>')
    casa(X(30), Y(18)); D.add(f'<ellipse cx="{X(49)}" cy="{Y(14)}" rx="12" ry="14" fill="#8ac0e0" stroke="{CAFE}" stroke-width="1.4"/>')
    for k, col in enumerate((ROJO, JADE, AZUL, OCRE)):  # los cuatro señoríos
        x, y = X(78 + (k % 2) * 30), Y(14 + (k // 2) * 22)
        casa(x, y, "#f4ecdc", col)
    piramide(X(94), Y(36), 0.9)
    piramide(X(192), Y(20), 0.7)
    for x, y in ((X(250), Y(30)), (X(262), Y(46))):
        D.add(f'<path d="M{x - 9},{y + 4} L{x - 9},{y - 4} Q{x},{y - 6} {x + 9},{y - 4} L{x + 9},{y + 4} Z" fill="#d8b88a" stroke="{CAFE}" stroke-width="1.2"/>'
              f'<path d="M{x - 12},{y - 3} L{x},{y - 16} L{x + 12},{y - 3} Z" fill="#d8b060" stroke="{CAFE}" stroke-width="1.2"/>')
    D.add(f'<line x1="{X(308)}" y1="{Y(52)}" x2="{X(308)}" y2="{Y(52) - 34}" stroke="#8a5a32" stroke-width="3"/>')  # palo volador
    casa(X(368), Y(50), "#f4ecdc", "#c8503a")
    D.add(f'<path d="M{X(398)},{Y(60)} l26,0 l-4,7 l-18,0 Z" fill="#8a5a32" stroke="{CAFE}" stroke-width="1.2"/><path d="M{X(404)},{Y(60)} v-18 l10,10 Z" fill="#f4ecdc" stroke="{CAFE}" stroke-width="1"/>')
    piramide(X(512), Y(40), 1.0, "#d8c8a0")
    D.add(f'<circle cx="{X(527)}" cy="{Y(22)}" r="7" fill="#5ab0c8" stroke="{CAFE}" stroke-width="1.4"/>')
    # caminos punteados
    D.add(f'<path d="M{X(30)},{Y(24)} Q{X(60)},{Y(28)} {X(94)},{Y(40)} T{X(192)},{Y(40)} T{X(300)},{Y(36)} T{X(368)},{Y(54)} M{X(470)},{Y(40)} L{X(512)},{Y(44)}" fill="none" stroke="#a8784a" stroke-width="2.4" stroke-dasharray="6 5"/>')
    # rosa de los vientos y cartela
    cx, cy = 880, 470
    D.add(f'<circle cx="{cx}" cy="{cy}" r="26" fill="{CREMA}" stroke="{CAFE}" stroke-width="2"/>'
          f'<path d="M{cx},{cy - 24} L{cx + 6},{cy} L{cx},{cy + 24} L{cx - 6},{cy} Z" fill="{ROJO}" stroke="{CAFE}" stroke-width="1.2"/>'
          f'<path d="M{cx - 24},{cy} L{cx},{cy - 5} L{cx + 24},{cy} L{cx},{cy + 5} Z" fill="{CAFE}" opacity="0.6"/>')
    if con_nombres:
        D.texto(cx, cy - 30, "N", 14)
        cinta(D, W / 2, 50, 360, "Tlaxcallan y sus tierras")
        nombres = [(30, 6, "Tu granja"), (93, 4, "Tlaxcallan"), (139, 48, "El monte"), (190, 2, "Tenochtitlan"),
                   (190, 72, "La sierra"), (60, 75, "El Popocatépetl"), (255, 4, "Tierra otomí"), (316, 14, "La nieve"),
                   (318, 64, "Totonacapan"), (384, 36, "Villa Rica"), (448, 4, "El Golfo"), (512, 14, "Tierra maya")]
        for x, y, t in nombres:
            D.texto(X(x), Y(y), t, 17, fill=CAFE, borde=CREMA)
        for k, (t, col) in enumerate((("Tepetícpac", AZUL), ("Ocotelulco", JADE), ("Tizatlán", ROJO), ("Quiahuiztlán", OCRE))):
            D.texto(56 + (k % 2) * 110, 66 + (k // 2) * 18, f'<tspan fill="{col}">●</tspan> {t}', 13, clase="n", anchor="start")
    for x, y in ((30, 30), (930, 30), (30, 510), (930, 510)):
        D.add(flor(x, y, 10, ROSA if x == y else "#f0a040"))
    return D


# ------------------------------------------------------------------ libro abierto (álbum y recetas)
def libro(fuentes, titulo, sub):
    W, H = 960, 540
    D = Doc(W, H, fuentes)
    D.add(f'<rect x="40" y="40" width="880" height="470" rx="22" fill="#a8603a" stroke="{CAFE}" stroke-width="4"/>')
    for x0 in (56, 484):
        D.add(f'<rect x="{x0}" y="54" width="420" height="440" rx="14" fill="{CREMA}" stroke="{CAFE}" stroke-width="2.4"/>')
        for k in range(1, 12):
            D.add(f'<line x1="{x0 + 24}" y1="{90 + k * 34}" x2="{x0 + 396}" y2="{90 + k * 34}" stroke="#ead8b8" stroke-width="1.4"/>')
    D.add(f'<path d="M480,54 Q470,270 480,494" fill="none" stroke="#c8a878" stroke-width="5"/>')
    for k in range(6):  # costura del lomo
        D.add(f'<line x1="476" y1="{90 + k * 70}" x2="484" y2="{98 + k * 70}" stroke="{CAFE}" stroke-width="2"/>')
    D.add(f'<rect x="436" y="24" width="18" height="70" fill="{ROJO}" stroke="{CAFE}" stroke-width="1.6"/><path d="M436,94 l9,-8 l9,8 Z" fill="{CREMA}"/>')
    cinta(D, W / 2, 30, 280, titulo)
    D.texto(W / 2, 505, sub, 14, clase="n", fill=CREMA)
    return D


def tarjeta_amigo(fuentes):
    D = Doc(200, 120, fuentes)
    D.add(f'<rect x="3" y="3" width="194" height="114" rx="16" fill="{CREMA2}" stroke="{CAFE}" stroke-width="2.4"/>')
    D.add(f'<circle cx="52" cy="60" r="40" fill="{CREMA}" stroke="{CAFE}" stroke-width="2.4"/>')
    D.add(f'<rect x="102" y="20" width="84" height="18" rx="9" fill="{NARANJA}" stroke="{CAFE}" stroke-width="1.6"/>')
    D.add(flor(14, 14, 7, ROSA))
    return D


def iconos_amistad(fuentes):
    lleno = Doc(32, 32, fuentes); lleno.add(corazon(16, 15, 10, ROSA)); lleno.add('<ellipse cx="11" cy="11" rx="3" ry="2" fill="#fff" opacity="0.6"/>')
    vacio = Doc(32, 32, fuentes); vacio.add(corazon(16, 15, 10, "#ead8c8", "#b8907a"))
    return lleno, vacio


def tarjeta_receta(fuentes):
    D = Doc(200, 140, fuentes)
    D.add(f'<rect x="3" y="3" width="194" height="134" rx="14" fill="{CREMA2}" stroke="{CAFE}" stroke-width="2.4"/>')
    D.add(f'<rect x="12" y="12" width="70" height="70" rx="12" fill="{CREMA}" stroke="#d8a878" stroke-width="1.6"/>')
    for k in range(3):
        D.add(f'<circle cx="{100 + k * 32}" cy="110" r="13" fill="{CREMA}" stroke="#d8a878" stroke-width="1.4"/>')
    D.add(f'<path d="M150,30 q-10,10 0,20 q10,-10 0,-20 Z" fill="#e8e4e0" opacity="0.8"/>')
    return D


# ------------------------------------------------------------------ calendario
def calendario(fuentes):
    W, H = 960, 540
    D = Doc(W, H, fuentes)
    papel(D, 40, 40, 880, 470, CREMA, 9, fibras=False)
    cinta(D, W / 2, 34, 260, "Calendario")
    est = [("Primavera", "#f4c0c8"), ("Verano", "#f8e08a"), ("Otoño", "#f0b07a"), ("Invierno", "#c8dcf0")]
    for i, (n, col) in enumerate(est):
        x = 90 + i * 200
        D.add(f'<rect x="{x}" y="68" width="180" height="34" rx="14" fill="{col}" stroke="{CAFE}" stroke-width="2"/>')
        D.texto(x + 90, 92, n, 19)
    dias = ["1", "2", "3", "4", "5", "6", "7"]
    for f in range(4):
        for c in range(7):
            x, y = 90 + c * 112, 118 + f * 92
            D.add(f'<rect x="{x}" y="{y}" width="104" height="84" rx="12" fill="#fffaf0" stroke="#d8a878" stroke-width="1.8"/>')
            D.texto(x + 12, y + 22, str(f * 7 + c + 1), 16, clase="n", anchor="start")
    return D


def iconos_fiesta(fuentes):
    out = {}
    d = Doc(40, 40, fuentes); d.add(flor(20, 20, 14, "#f08a1c")); out["fiesta_flores"] = d
    d = Doc(40, 40, fuentes)
    d.add(f'<path d="M10,8 L30,8 L28,34 L12,34 Z" fill="#a86a3a" stroke="{CAFE}" stroke-width="1.6"/><ellipse cx="20" cy="8" rx="10" ry="3" fill="#e8d8b0" stroke="{CAFE}" stroke-width="1.4"/><path d="M12,18 l4,4 l4,-4 l4,4 l4,-4" fill="none" stroke="{ROJO}" stroke-width="1.6"/>')
    out["fiesta_tambor"] = d
    d = Doc(40, 40, fuentes)
    d.add(f'<path d="M8,30 L32,30 L28,14 L12,14 Z" fill="#a86a3a" stroke="{CAFE}" stroke-width="1.6"/>' + "".join(f'<circle cx="{10 + k * 5}" cy="14" r="3" fill="#f08a1c" stroke="#a85a10" stroke-width="0.8"/>' for k in range(5))
          + f'<rect x="18" y="4" width="4" height="9" fill="#f6efdc" stroke="{CAFE}" stroke-width="0.8"/><path d="M20,0 q2,3 0,4 q-2,-1 0,-4 Z" fill="#ffc23a"/>')
    out["fiesta_ofrenda"] = d
    d = Doc(40, 40, fuentes); d.add(corazon(20, 19, 12, ROSA)); out["cumpleanos"] = d
    d = Doc(104, 84, fuentes); d.add(f'<rect x="3" y="3" width="98" height="78" rx="12" fill="none" stroke="{NARANJA}" stroke-width="5"/>'); out["marca_hoy"] = d
    return out


# ------------------------------------------------------------------ diario de encargos
def diario(fuentes):
    W, H = 960, 540
    D = Doc(W, H, fuentes)
    D.add(f'<rect x="150" y="44" width="660" height="460" fill="{PAPEL}" stroke="{CAFE}" stroke-width="3"/>')
    for y in (44, 504):  # rodillos del pergamino
        D.add(f'<rect x="120" y="{y - 16}" width="720" height="32" rx="16" fill="#a8703e" stroke="{CAFE}" stroke-width="3"/>')
        for x in (112, 848):
            D.add(f'<circle cx="{x}" cy="{y}" r="14" fill="{OCRE}" stroke="{CAFE}" stroke-width="2.4"/>')
    r = random.Random(4)
    for _ in range(240):
        px, py = r.uniform(160, 800), r.uniform(70, 480)
        D.add(f'<line x1="{px:.1f}" y1="{py:.1f}" x2="{px + r.uniform(8, 24):.1f}" y2="{py + r.uniform(-3, 3):.1f}" stroke="#c8a878" stroke-width="1" opacity="0.5"/>')
    cinta(D, W / 2, 96, 300, "Diario de encargos")
    for k in range(6):
        y = 150 + k * 56
        D.add(f'<line x1="230" y1="{y + 18}" x2="740" y2="{y + 18}" stroke="#c8a878" stroke-width="1.4" stroke-dasharray="5 4"/>')
    return D


def casillas(fuentes):
    v = Doc(32, 32, fuentes); v.add(f'<rect x="4" y="4" width="24" height="24" rx="6" fill="{CREMA}" stroke="{CAFE}" stroke-width="2.4"/>')
    l = Doc(32, 32, fuentes); l.add(f'<rect x="4" y="4" width="24" height="24" rx="6" fill="{CREMA}" stroke="{CAFE}" stroke-width="2.4"/><path d="M9,16 l5,6 l11,-14" fill="none" stroke="{JADE}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>')
    return v, l


# ------------------------------------------------------------------ carga y pausa
def mazorca_girando(fuentes, k, n=8):
    D = Doc(64, 64, fuentes)
    a = k / n * 360
    D.add(f'<g transform="rotate({a:.1f} 32 32)"><ellipse cx="32" cy="32" rx="11" ry="22" fill="{OCRE}" stroke="{CAFE}" stroke-width="2"/>'
          + "".join(f'<circle cx="{27 + (i % 2) * 10}" cy="{18 + (i // 2) * 7}" r="3" fill="#ffe08a"/>' for i in range(8))
          + f'<path d="M32,54 q-14,-4 -16,-20 q10,8 16,20 Z M32,54 q14,-4 16,-20 q-10,8 -16,20 Z" fill="{VERDE}" stroke="{CAFE}" stroke-width="1.6"/></g>')
    return D


def caja_consejo(fuentes):
    D = Doc(320, 80, fuentes)
    D.add(f'<rect x="3" y="3" width="314" height="74" rx="22" fill="{CREMA}" stroke="{CAFE}" stroke-width="3"/>'
          f'<circle cx="40" cy="40" r="24" fill="{CREMA2}" stroke="#d8a878" stroke-width="2"/>'
          f'<text x="40" y="50" text-anchor="middle" class="t" font-size="30">?</text>')
    D.add(flor(14, 14, 8, ROSA))
    return D


def cinta_pausa(fuentes):
    D = Doc(320, 64, fuentes)
    cinta(D, 160, 40, 220, "Pausa")
    return D


def todo(fuentes):
    P = {"mapa/mapa_region": mapa(fuentes), "mapa/mapa_region_sin_nombres": mapa(fuentes, False),
         "album/fondo_album": libro(fuentes, "Álbum de amistades", "Platica, regala y comparte para llenar los corazones"),
         "album/tarjeta_amigo": tarjeta_amigo(fuentes),
         "recetas/fondo_recetas": libro(fuentes, "Libro de recetas", "Tamales, atole, pozole, chocolate…"),
         "recetas/tarjeta_receta": tarjeta_receta(fuentes),
         "calendario/fondo_calendario": calendario(fuentes),
         "diario/fondo_diario": diario(fuentes),
         "carga/caja_consejo": caja_consejo(fuentes), "pausa/cinta_pausa": cinta_pausa(fuentes)}
    l, v = iconos_amistad(fuentes)
    P["album/corazon_lleno"], P["album/corazon_vacio"] = l, v
    for n, d in iconos_fiesta(fuentes).items():
        P[f"calendario/{n}"] = d
    cv, cl = casillas(fuentes)
    P["diario/casilla"], P["diario/casilla_hecha"] = cv, cl
    for k in range(8):
        P[f"carga/mazorca_{k}"] = mazorca_girando(fuentes, k)
    return P


if __name__ == "__main__":
    out, fuentes = sys.argv[1:3]
    for n, d in todo(fuentes).items():
        os.makedirs(os.path.dirname(os.path.join(out, n)), exist_ok=True)
        open(os.path.join(out, n + ".svg"), "w").write(d.svg())
    print("listo")
