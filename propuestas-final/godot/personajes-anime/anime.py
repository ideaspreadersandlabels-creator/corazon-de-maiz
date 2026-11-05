"""Personajes de Corazón de Maíz en estilo ANIMACIÓN (cel shading de anime).

Mismo formato que el paquete anterior para Godot:
  personajes/<id>/caminar_<dir>_<0..3>.svg   (128x192, dir = abajo/izquierda/derecha/arriba)
  personajes/<id>/quieto_<dir>.svg
  personajes/player/{arar,regar,cosechar}_<dir>_<0..1>.svg
  personajes/<id>/retrato.svg               (busto para diálogos)
Uso: python3 anime.py <salida_dir>
"""
import math, os, sys

W, Hh = 128, 192
ESTILO = "anime"          # "anime" o "acogedor"
CABEZA = 1.0              # escala de la cabeza (acogedor: cabezón)
LARGO = 1.0               # largo de trenzas/pelo largo
SUELO = 186
LINEA = "#3b2418"
LW = 1.6


# ------------------------------------------------------------------ colores
def hx(c):
    c = c.lstrip("#")
    return [int(c[i:i + 2], 16) for i in (0, 2, 4)]


def hexc(r):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(v))) for v in r)


def mezcla(a, b, t):
    A, B = hx(a), hx(b)
    return hexc([A[i] * (1 - t) + B[i] * t for i in range(3)])


FILTRO = ""


def color_linea(base):
    if ESTILO == "acogedor":  # contorno del mismo color, más oscuro
        return mezcla(mezcla(base, "#000000", 0.5), "#3a1a10", 0.25)
    return LINEA


def sombra_de(c):
    # sombra de anime: más oscura y un poco hacia el violeta
    if ESTILO == "acogedor":
        return mezcla(mezcla(c, "#000000", 0.14), "#b04a3a", 0.10)
    return mezcla(mezcla(c, "#000000", 0.22), "#5a3a7a", 0.18)


def lejos(c):
    return mezcla(c, "#2a2040", 0.16)


# ------------------------------------------------------------------ formas
def capsula(a, b, ra, rb):
    (ax, ay), (bx, by) = a, b
    dx, dy = bx - ax, by - ay
    L = math.hypot(dx, dy) or 0.01
    nx, ny = -dy / L, dx / L
    p1 = (ax + nx * ra, ay + ny * ra)
    p2 = (bx + nx * rb, by + ny * rb)
    p3 = (bx - nx * rb, by - ny * rb)
    p4 = (ax - nx * ra, ay - ny * ra)
    return (f"M{p1[0]:.2f},{p1[1]:.2f} L{p2[0]:.2f},{p2[1]:.2f} A{rb:.2f},{rb:.2f} 0 0 1 {p3[0]:.2f},{p3[1]:.2f} "
            f"L{p4[0]:.2f},{p4[1]:.2f} A{ra:.2f},{ra:.2f} 0 0 1 {p1[0]:.2f},{p1[1]:.2f} Z")


def elipse(cx, cy, rx, ry, rot=0):
    if rot:
        pts = [(cx + rx * math.cos(t) * math.cos(rot) - ry * math.sin(t) * math.sin(rot),
                cy + rx * math.cos(t) * math.sin(rot) + ry * math.sin(t) * math.cos(rot)) for t in [i * math.tau / 24 for i in range(24)]]
        return suave(pts)
    return f"M{cx - rx:.2f},{cy:.2f} A{rx:.2f},{ry:.2f} 0 1 0 {cx + rx:.2f},{cy:.2f} A{rx:.2f},{ry:.2f} 0 1 0 {cx - rx:.2f},{cy:.2f} Z"


def poli(pts):
    return "M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z"


def suave(pts):
    """curva cerrada suave que pasa cerca de los puntos (cuadráticas por puntos medios)"""
    n = len(pts)
    mid = [((pts[i][0] + pts[(i + 1) % n][0]) / 2, (pts[i][1] + pts[(i + 1) % n][1]) / 2) for i in range(n)]
    d = f"M{mid[-1][0]:.2f},{mid[-1][1]:.2f}"
    for i in range(n):
        d += f" Q{pts[i][0]:.2f},{pts[i][1]:.2f} {mid[i][0]:.2f},{mid[i][1]:.2f}"
    return d + " Z"


def rot(p, c, ang):
    s, co = math.sin(ang), math.cos(ang)
    x, y = p[0] - c[0], p[1] - c[1]
    return (c[0] + x * co - y * s, c[1] + x * s + y * co)


class Lienzo:
    def __init__(self, w=W, h=Hh):
        self.w, self.h = w, h
        self.defs, self.o = [], []
        self.n = 0

    def id(self):
        self.n += 1
        return f"p{self.n}"

    def parte(self, d, base, sombra=None, linea=True, desp=(2.2, 1.4), lw=LW, op=1):
        """relleno + sombra de anime (franja derecha/abajo) + contorno"""
        i = self.id()
        sombra = sombra or sombra_de(base)
        self.defs.append(f'<path id="{i}" d="{d}"/>')
        self.defs.append(f'<clipPath id="c{i}"><use href="#{i}"/></clipPath>')
        g = f'<g opacity="{op}">' if op != 1 else "<g>"
        g += (f'<g clip-path="url(#c{i})"><rect x="-50" y="-50" width="{self.w + 100}" height="{self.h + 100}" fill="{sombra}"/>'
              f'<use href="#{i}" fill="{base}" transform="translate({-desp[0]} {-desp[1]})"{FILTRO}/></g>')
        if linea:
            g += f'<use href="#{i}" fill="none" stroke="{color_linea(base)}" stroke-width="{lw}" stroke-linejoin="round"/>'
        self.o.append(g + "</g>")

    def miembro(self, segs, base, sombra=None, lw=LW):
        """brazo o pierna de una pieza: trazos redondos (contorno, sombra, luz) sin círculos en las uniones"""
        sombra = sombra or sombra_de(base)
        seg = lambda a, b, w, c, dx=0, dy=0: (f'<line x1="{a[0] + dx:.2f}" y1="{a[1] + dy:.2f}" x2="{b[0] + dx:.2f}" y2="{b[1] + dy:.2f}" '
                                             f'stroke="{c}" stroke-width="{w:.2f}" stroke-linecap="round"/>')
        g = "<g>"
        g += "".join(seg(a, b, w + 2 * lw, color_linea(base)) for a, b, w in segs)
        g += "".join(seg(a, b, w, sombra) for a, b, w in segs)
        g += f"<g{FILTRO}>" + "".join(seg(a, b, w * 0.6, base, -w * 0.18, -0.3) for a, b, w in segs) + "</g>"
        self.o.append(g + "</g>")

    def ini(self, t):
        self.o.append(f'<g transform="{t}">' if t else "<g>")

    def fin(self):
        self.o.append("</g>")

    def plano(self, d, fill, linea=False, lw=LW, op=1):
        st = f' stroke="{LINEA}" stroke-width="{lw}" stroke-linejoin="round" stroke-linecap="round"' if linea else ""
        self.o.append(f'<path d="{d}" fill="{fill}"{st} opacity="{op}"/>')

    def trazo(self, d, col=LINEA, lw=LW, op=1):
        self.o.append(f'<path d="{d}" fill="none" stroke="{col}" stroke-width="{lw}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>')

    def raw(self, s):
        self.o.append(s)

    def svg(self, transform=None):
        body = "".join(self.o)
        if transform:
            body = f'<g transform="{transform}">{body}</g>'
        return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{self.w}" height="{self.h}" '
                f'viewBox="0 0 {self.w} {self.h}"><defs><filter id="suave" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.1"/></filter>{"".join(self.defs)}</defs>{body}</svg>')


# ------------------------------------------------------------------ personajes
PIEL = "#b07650"
PIEL_CLARA = "#c08a62"
PIEL_OSC = "#8a5638"
NEGRO_PELO = "#231a1c"
BLANCO = "#f4eee2"
ROJO = "#c23a2c"
AZUL = "#2f5fa6"
JADE = "#2f9e78"
OCRE = "#e0a121"
MORADO = "#6a4a9a"
CUERO = "#8a5a32"

PERSONAJES = {
    "player": dict(nombre="Campesino", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="corto", banda=ROJO,
                   arriba="camisa", c_arriba=BLANCO, bordado=ROJO, abajo="maxtlatl", c_abajo=BLANCO, colgajo=ROJO,
                   capa=BLANCO, capa_borde=ROJO, mano="bolsa", ojos="#5a3418"),
    "xochitl": dict(nombre="Xóchitl", mujer=True, piel=PIEL_CLARA, pelo=NEGRO_PELO, peinado="trenzas", flor="#e8507a",
                    arriba="huipil", c_arriba=BLANCO, bordado="#e8507a", bordado2=AZUL, abajo="falda", c_abajo=AZUL,
                    mano="flores", ojos="#6a3a1e", aretes=OCRE),
    "citlalli": dict(nombre="Citlalli", mujer=True, piel=PIEL, pelo=NEGRO_PELO, peinado="chongo", flor="#e8507a",
                     arriba="huipil", c_arriba=BLANCO, bordado=JADE, bordado2=OCRE, abajo="falda", c_abajo="#7a2a2a",
                     mandil="#e8dcc0", mano=None, ojos="#5a3418", aretes=OCRE, collar=JADE),
    "ameyalli": dict(nombre="Ameyalli", mujer=True, piel=PIEL, pelo=NEGRO_PELO, peinado="trenza", listón=MORADO,
                     arriba="huipil", c_arriba="#e6def0", bordado=MORADO, bordado2=OCRE, abajo="falda", c_abajo="#4a3a6a",
                     mano="cantaro", ojos="#4a2a1e", aretes=OCRE, collar=JADE),
    "doni": dict(nombre="Doni", mujer=True, piel=PIEL_OSC, pelo=NEGRO_PELO, peinado="chongo", flor="#d0408a",
                 arriba="quechquemitl", c_arriba=BLANCO, bordado="#8a2a6a", bordado2=OCRE, abajo="falda", c_abajo="#2a2a3a",
                 mano=None, ojos="#4a2a1e", aretes=OCRE, collar="#c0392b"),
    "ocelotl": dict(nombre="Ocelotl", mujer=False, piel=PIEL_OSC, pelo=NEGRO_PELO, peinado="coleta", banda=AZUL,
                    arriba="camisa", c_arriba="#d0a050", bordado=AZUL, abajo="maxtlatl", c_abajo=BLANCO, colgajo=AZUL,
                    mandil=CUERO, mano="martillo", ojos="#3a2418", ancho=1.12, barba=False),
    "guard": dict(nombre="Guardia", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="temillotl", banda=ROJO,
                  arriba="armadura", c_arriba=BLANCO, bordado=ROJO, abajo="maxtlatl", c_abajo=BLANCO, colgajo=ROJO,
                  mano="lanza", escudo=ROJO, ojos="#3a2418", ancho=1.06),
    "yaotl": dict(nombre="Yáotl", mujer=False, piel=PIEL_OSC, pelo=NEGRO_PELO, peinado="temillotl", banda=OCRE,
                  arriba="armadura", c_arriba=ROJO, bordado=OCRE, abajo="maxtlatl", c_abajo=BLANCO, colgajo="#222222",
                  mano="macuahuitl", escudo=OCRE, ojos="#3a2418", ancho=1.1, cicatriz=True),
    "priest": dict(nombre="Tlamacazqui", mujer=False, piel="#4a3a3a", pelo="#141012", peinado="largo", banda=BLANCO,
                   arriba="tunica", c_arriba="#1e1a1e", bordado="#e8e0d0", abajo="larga", c_abajo="#1e1a1e",
                   mano="copal", ojos="#2a1a10"),
    "tlatoani": dict(nombre="Xicohténcatl", mujer=False, piel=PIEL, pelo="#e6e2da", peinado="anciano", diadema="#3fb5a4",
                     arriba="tunica", c_arriba=BLANCO, bordado=ROJO, abajo="larga", c_abajo=BLANCO,
                     capa="#2a9a8a", capa_borde=OCRE, mano="baston", ojos="#3a2418", anciano=True),
    "g_jaguar": dict(nombre="Guerrero jaguar", mujer=False, piel="#e0a830", cara=PIEL, pelo=NEGRO_PELO, peinado="corto",
                     arriba="armadura", c_arriba="#e0a830", bordado="#2a2420", abajo="maxtlatl", c_abajo="#e0a830", colgajo=ROJO,
                     manchas=True, casco="jaguar", mano="macuahuitl", escudo=AZUL, ojos="#3a2418", ancho=1.08),
    "g_aguila": dict(nombre="Guerrero águila", mujer=False, piel="#8a6440", cara=PIEL, pelo=NEGRO_PELO, peinado="corto",
                     arriba="armadura", c_arriba="#8a6440", bordado=OCRE, abajo="maxtlatl", c_abajo=BLANCO, colgajo=ROJO,
                     casco="aguila", mano="macuahuitl", escudo=ROJO, ojos="#3a2418", ancho=1.08),
    "daniel": dict(nombre="Daniel", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="corto", banda=BLANCO,
                   arriba="camisa", c_arriba=BLANCO, bordado=JADE, abajo="maxtlatl", c_abajo=BLANCO, colgajo=JADE,
                   capa="#e8e0c8", capa_borde=JADE, mano="hierbas", ojos="#4a2a1e"),
}


# ---- vecinos de los cuatro señoríos, las muchachas del romance y otros (sin dibujo antes)
# Tizatlán = rojo, Ocotelulco = verde, Tepeticpac = azul, Quiahuiztlán = ocre
VERDE = "#3e8a4a"
PERSONAJES.update({
    "acatl": dict(nombre="Acatl", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="coleta", banda=ROJO,
                  arriba="camisa", c_arriba=BLANCO, bordado=ROJO, abajo="maxtlatl", c_abajo=BLANCO, colgajo=ROJO,
                  capa="#e8d8c0", capa_borde=ROJO, mano=None, ojos="#4a2a1e"),
    "cozca": dict(nombre="Cozca", mujer=False, piel=PIEL_OSC, pelo=NEGRO_PELO, peinado="corto", banda="#8f2a1f",
                  arriba="camisa", c_arriba="#d84a3a", bordado=BLANCO, abajo="maxtlatl", c_abajo=BLANCO, colgajo="#8f2a1f",
                  mano="cantaro", ojos="#3a2418", ancho=1.1),
    "ichtaca": dict(nombre="Ichtaca", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="corto", banda=VERDE,
                    arriba="camisa", c_arriba=BLANCO, bordado=VERDE, abajo="maxtlatl", c_abajo=BLANCO, colgajo=VERDE,
                    capa="#5a7a4a", capa_borde=OCRE, mano="bolsa", ojos="#4a2a1e"),
    "xochico": dict(nombre="Xochico", mujer=True, piel=PIEL_CLARA, pelo=NEGRO_PELO, peinado="chongo", flor="#f08a1c",
                    arriba="huipil", c_arriba="#eef0e0", bordado=VERDE, bordado2=OCRE, abajo="falda", c_abajo="#3a5a3a",
                    mano="flores", ojos="#5a3418", aretes=OCRE),
    "atl": dict(nombre="Atl", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="corto", banda=AZUL,
                arriba="camisa", c_arriba="#cfe0ea", bordado=AZUL, abajo="maxtlatl", c_abajo=BLANCO, colgajo=AZUL,
                mano="hierbas", ojos="#3a2418"),
    "chalchi": dict(nombre="Chalchi", mujer=True, piel=PIEL, pelo=NEGRO_PELO, peinado="trenza", listón=AZUL,
                    arriba="huipil", c_arriba=BLANCO, bordado=AZUL, bordado2="#7ac0e8", abajo="falda", c_abajo="#2a4a7a",
                    mano="cantaro", ojos="#4a2a1e", collar=JADE),
    "tezca": dict(nombre="Tezca", mujer=False, piel=PIEL_OSC, pelo=NEGRO_PELO, peinado="coleta", banda=OCRE,
                  arriba="camisa", c_arriba="#e8d8a8", bordado=OCRE, abajo="maxtlatl", c_abajo=BLANCO, colgajo=OCRE,
                  mandil="#c9a06a", mano="bolsa", ojos="#3a2418"),
    "michin": dict(nombre="Michin", mujer=True, piel=PIEL_OSC, pelo=NEGRO_PELO, peinado="trenzas", flor=OCRE,
                   arriba="quechquemitl", c_arriba="#e0a121", bordado="#8a4a1a", bordado2=BLANCO, abajo="falda", c_abajo="#6a4a2a",
                   mano="cantaro", ojos="#4a2a1e", aretes=OCRE),
    "yolotl": dict(nombre="Yolotl", mujer=True, piel=PIEL, pelo=NEGRO_PELO, peinado="trenzas", flor="#e8507a",
                   arriba="huipil", c_arriba=BLANCO, bordado=ROJO, bordado2="#e8507a", abajo="falda", c_abajo="#8a2a3a",
                   mano="flores", ojos="#5a3418", aretes=OCRE, collar=JADE),
    "xiuhtzin": dict(nombre="Xiuhtzin", mujer=True, piel=PIEL_CLARA, pelo=NEGRO_PELO, peinado="chongo", flor="#3fb5a4",
                     arriba="huipil", c_arriba="#e8f4f0", bordado="#2a9a8a", bordado2=OCRE, abajo="falda", c_abajo="#2a6a6a",
                     mano=None, ojos="#4a2a1e", aretes="#3fb5a4", collar=JADE),
    "quetzalli": dict(nombre="Quetzalli", mujer=True, piel=PIEL, pelo=NEGRO_PELO, peinado="trenza", listón="#2a9a5a",
                      arriba="huipil", c_arriba=BLANCO, bordado="#2a9a5a", bordado2=ROJO, abajo="falda", c_abajo="#1e5a3a",
                      mano="flores", ojos="#4a2a1e", aretes=OCRE, collar="#3fb5a4"),
    "tonalli": dict(nombre="Tonalli", mujer=True, piel=PIEL_OSC, pelo=NEGRO_PELO, peinado="trenzas", flor="#f08a1c",
                    arriba="huipil", c_arriba="#fbf0d8", bordado="#f08a1c", bordado2=ROJO, abajo="falda", c_abajo="#b06a1a",
                    mano=None, ojos="#5a3418", aretes=OCRE),
    "tonatiuh": dict(nombre="Tonatiuh", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="temillotl", banda=OCRE,
                     arriba="armadura", c_arriba=BLANCO, bordado=OCRE, abajo="maxtlatl", c_abajo=BLANCO, colgajo=ROJO,
                     mano="lanza", escudo=OCRE, ojos="#3a2418", ancho=1.08),
    "metztli": dict(nombre="Metztli", mujer=True, piel=PIEL, pelo=NEGRO_PELO, peinado="largo", banda="#e8e0d0",
                    arriba="tunica", c_arriba="#3a3a5a", bordado="#c8c8e8", abajo="larga", c_abajo="#3a3a5a",
                    mano="copal", ojos="#3a2a40", aretes="#d8d8e8"),
    "pochteca": dict(nombre="Pochteca", mujer=False, piel=PIEL, pelo=NEGRO_PELO, peinado="corto", banda=AZUL,
                     arriba="camisa", c_arriba="#e8d8b8", bordado=AZUL, abajo="maxtlatl", c_abajo=BLANCO, colgajo=AZUL,
                     capa="#c8a878", capa_borde=AZUL, mano="baston", ojos="#3a2418", ancho=1.12),
})

# ------------------------------------------------------------------ esqueleto
class Pose:
    """posición de las articulaciones para una dirección y un cuadro"""

    def __init__(self, p, vista, cuadro, accion=None):
        self.p, self.vista, self.cuadro, self.accion = p, vista, cuadro, accion
        m = p["mujer"]
        a = p.get("ancho", 1.0)
        self.cx = 64
        self.sw = (14.5 if m else 16.5) * a      # medio ancho de hombros
        self.ww = (10.5 if m else 12) * a        # cintura
        self.hw = (14 if m else 13) * a          # cadera
        self.cab = (64, 33)
        self.rx, self.ry = 14.5, 16.5
        self.cuello = 52
        self.hombro_y = 59
        self.cadera_y = 101
        self.muslo, self.pierna = 40, 40
        self.brazo, self.antebrazo = 25, 22
        if ESTILO == "acogedor":
            self.cuello, self.hombro_y, self.cadera_y = 96, 101, 134
            self.muslo, self.pierna = 24, 23
            self.brazo, self.antebrazo = 16, 14
            self.cab = (64, 96 - 19)
            self.sw *= 0.86
            self.ww *= 0.92
            self.hw *= 0.95
        if vista == "lado":
            self._lado()
        else:
            self._frente()

    def _frente(self):
        f = self.cuadro
        fase = f * math.pi / 2
        s = math.sin(fase)
        sube = [0, 1, 0, 1][f] if self.accion is None else 0
        self.bob = -1.0 * sube
        cx = self.cx
        self.piernas = []
        for lado in (-1, 1):
            lev = max(0.0, s * lado) * 6 if self.accion is None else 0
            hip = (cx + lado * 6.5, self.cadera_y + self.bob)
            rod = (cx + lado * 7, self.cadera_y + self.muslo - lev * 0.5 + self.bob)
            tob = (cx + lado * 7, SUELO - 5 - lev)
            self.piernas.append((hip, rod, tob, lev))
        self.brazos = []
        fijo = self.p.get("mano") in ("lanza", "baston")
        for lado in (-1, 1):
            sw = -s * lado * 3.5 if self.accion is None else 0
            if fijo and lado == 1:
                sw = 0
            hom = (cx + lado * (self.sw - 3), self.hombro_y + self.bob)
            codo = (cx + lado * (self.sw + 1.5), self.hombro_y + self.brazo + self.bob + sw * 0.3)
            mun = (cx + lado * (self.sw + 0.5), codo[1] + self.antebrazo + sw)
            self.brazos.append([hom, codo, mun])

    def _lado(self):
        f = self.cuadro
        # ángulos (radianes desde la vertical, + = hacia adelante/derecha): (muslo, pierna)
        ciclo = [((0.30, 0.10), (-0.26, -0.48)),
                 ((0.0, -0.02), (0.22, -0.45)),
                 ((-0.26, -0.48), (0.30, 0.10)),
                 ((0.22, -0.45), (0.0, -0.02))]
        cerca, lejos_ = ciclo[f] if self.accion is None else ((0.05, 0.0), (-0.05, -0.02))
        self.angulos = (cerca, lejos_)
        # altura de la cadera para que el pie más bajo toque el suelo
        def baja(a):
            return self.muslo * math.cos(a[0]) + self.pierna * math.cos(a[1])
        alto = max(baja(cerca), baja(lejos_))
        cy = SUELO - 5 - alto
        self.bob = cy - self.cadera_y
        hip = (self.cx - 1, cy)
        self.piernas = []
        for a in (lejos_, cerca):
            rod = (hip[0] + math.sin(a[0]) * self.muslo, hip[1] + math.cos(a[0]) * self.muslo)
            tob = (rod[0] + math.sin(a[1]) * self.pierna, rod[1] + math.cos(a[1]) * self.pierna)
            self.piernas.append((hip, rod, tob, 0))
        self.brazos = []
        fijo = self.p.get("mano") in ("lanza", "baston")
        for i, a in enumerate((lejos_, cerca)):
            sw = -a[0] * 0.95 if self.accion is None else 0
            if fijo and i == 1:
                sw = 0.25
            hom = (self.cx + 1, self.hombro_y + self.bob)
            codo = (hom[0] + math.sin(sw) * self.brazo, hom[1] + math.cos(sw) * self.brazo)
            sw2 = sw + 0.35
            mun = (codo[0] + math.sin(sw2) * self.antebrazo, codo[1] + math.cos(sw2) * self.antebrazo)
            self.brazos.append([hom, codo, mun])


# ------------------------------------------------------------------ dibujo
def dibujar(pid, vista, cuadro=0, espejo=False, accion=None, accion_cuadro=0, detalle=False, sin_objeto=False, expresion="normal"):
    p = dict(PERSONAJES[pid], expresion=expresion)
    if sin_objeto:
        p = dict(p, mano=None)
    L = Lienzo()
    po = Pose(p, "lado" if vista in ("derecha", "izquierda") else "frente", cuadro, accion)
    if accion and accion != "quieto":
        aplicar_accion(po, vista, accion, accion_cuadro)
    sombra_suelo(L, po, vista)
    if vista == "abajo":
        frente(L, p, po, detalle)
    elif vista == "arriba":
        espalda(L, p, po)
    else:
        lado(L, p, po, accion)
    tr = None
    if vista == "izquierda":
        tr = f"translate({W} 0) scale(-1 1)"
    return L.svg(tr)


def tcab(po):
    if CABEZA == 1.0:
        return None
    x, y = po.cx, po.cuello + po.bob + 1
    return f"translate({x} {y}) scale({CABEZA}) translate({-x} {-y})"


def sombra_suelo(L, po, vista):
    L.raw(f'<ellipse cx="64" cy="{SUELO - 1}" rx="{20 if vista != "derecha" else 22}" ry="4.5" fill="#000" opacity="0.18"/>')


# --- piezas comunes
def pierna(L, p, h, r, t, col_piel, lejos_=False, lado=False):
    piel = lejos(col_piel) if lejos_ else col_piel
    g = 0.9 if p["mujer"] else 1.0
    L.miembro([(h, r, 10.5 * g), (r, t, 7.6 * g)], piel)
    cuero = lejos(CUERO) if lejos_ else CUERO
    if lado:
        L.parte(elipse(t[0] + 3.5, t[1] + 3.4, 7.0, 2.7), cuero)
        L.trazo(f"M{t[0] - 3},{t[1] - 3} L{t[0] + 3},{t[1] + 1}", "#5a3418", 1.2)
    else:
        L.parte(elipse(t[0], t[1] + 3.4, 4.6, 2.9), cuero)
        L.trazo(f"M{t[0] - 3.4},{t[1] - 2.5} L{t[0] + 3.4},{t[1] + 0.5}", "#5a3418", 1.2)


def brazo(L, p, b, col_piel, manga, lejos_=False, manga_larga=False):
    hom, codo, mun = b
    piel = lejos(col_piel) if lejos_ else col_piel
    g = 0.9 if p["mujer"] else 1.0
    L.miembro([(hom, codo, 8.4 * g), (codo, mun, 6.6 * g)], piel)
    L.parte(elipse(mun[0], mun[1] + 2.2, 3.3, 3.7), piel, lw=1.2, desp=(1.2, 0.8))
    if manga:
        c = lejos(manga) if lejos_ else manga
        if manga_larga:
            L.miembro([(hom, codo, 11.5), (codo, (codo[0] + (mun[0] - codo[0]) * 0.7, codo[1] + (mun[1] - codo[1]) * 0.7), 10)], c)
        else:
            fin = (hom[0] + (codo[0] - hom[0]) * 0.5, hom[1] + (codo[1] - hom[1]) * 0.5)
            fin = (hom[0] + (codo[0] - hom[0]) * 0.42, hom[1] + (codo[1] - hom[1]) * 0.42)
            L.miembro([(hom, fin, 10.2 * g)], c)


def ropa_banda(L, x0, x1, y, h, col, col2=None):
    """franja bordada (grecas y rombos) de huipil o tilma"""
    L.plano(poli([(x0, y), (x1, y), (x1, y + h), (x0, y + h)]), col)
    paso = 4.2
    x = x0 + 1.5
    while x < x1 - 2:
        L.plano(poli([(x, y + h / 2), (x + paso / 2, y + 0.8), (x + paso, y + h / 2), (x + paso / 2, y + h - 0.8)]), col2 or BLANCO)
        x += paso + 0.8


# --- vistas
def frente(L, p, po, detalle):
    cx, b = po.cx, po.bob
    # pelo de atrás y capa de atrás
    L.ini(tcab(po))
    pelo_atras(L, p, po, "abajo")
    L.fin()
    if p.get("capa"):
        y0 = po.hombro_y + b
        hem = 150 if p["peinado"] != "anciano" else 172
        L.parte(poli([(cx - po.sw - 1, y0 + 2), (cx + po.sw + 1, y0 + 2), (cx + po.sw + 9, hem + b), (cx - po.sw - 9, hem + b)]), lejos(p["capa"]))
        ropa_banda(L, cx - po.sw - 9, cx + po.sw + 9, hem + b - 5, 5, p["capa_borde"], BLANCO)
    if p.get("escudo"):
        escudo(L, p, (cx + po.sw + 2, po.hombro_y + b + 22), atras=True)
    # piernas
    for i, (h, r, t, lev) in enumerate(po.piernas):
        pierna(L, p, h, r, t, p["piel"])
    abajo_frente(L, p, po)
    arriba_frente(L, p, po)
    for i, br in enumerate(po.brazos):
        brazo(L, p, br, p["piel"], manga_de(p), manga_larga=p["arriba"] == "tunica")
    if p.get("capa"):  # nudo de la tilma
        L.parte(elipse(cx + po.sw * 0.55, po.hombro_y + b + 1, 4.2, 3.4), p["capa_borde"])
    L.ini(tcab(po))
    cabeza_frente(L, p, po, detalle)
    L.fin()
    objeto_mano(L, p, po, "abajo")


def espalda(L, p, po):
    cx, b = po.cx, po.bob
    for h, r, t, lev in po.piernas:
        pierna(L, p, h, r, t, p["piel"])
    abajo_frente(L, p, po, atras=True)
    arriba_frente(L, p, po, atras=True)
    for br in po.brazos:
        brazo(L, p, br, p["piel"], manga_de(p), manga_larga=p["arriba"] == "tunica")
    objeto_mano(L, p, po, "arriba")
    # cabeza por detrás
    L.ini(tcab(po))
    hy = po.cab[1] + b
    L.parte(capsula((cx, po.cuello + b - 6), (cx, po.cuello + b + 5), 4.4, 4.6), p["piel"])
    L.parte(elipse(cx, hy, po.rx, po.ry), p["piel"])
    pelo_atras(L, p, po, "arriba")
    L.fin()
    if p.get("capa"):
        y0 = po.hombro_y + b
        hem = 150 if p["peinado"] != "anciano" else 172
        L.parte(poli([(cx - po.sw - 2, y0), (cx + po.sw + 2, y0), (cx + po.sw + 9, hem + b), (cx - po.sw - 9, hem + b)]), p["capa"])
        ropa_banda(L, cx - po.sw - 9, cx + po.sw + 9, hem + b - 7, 7, p["capa_borde"], BLANCO)
        L.trazo(f"M{cx - 4},{y0 + 8} L{cx - 6},{hem + b - 10} M{cx + 6},{y0 + 14} L{cx + 7},{hem + b - 12}", sombra_de(p["capa"]), 1.2)
    if p.get("escudo"):
        escudo(L, p, (cx, po.hombro_y + b + 24), atras=False, grande=True)


def manga_de(p):
    return {"camisa": p["c_arriba"], "huipil": p["c_arriba"], "armadura": p["c_arriba"], "tunica": p["c_arriba"],
            "quechquemitl": p["c_arriba"]}.get(p["arriba"])


def abajo_frente(L, p, po, atras=False):
    cx, b = po.cx, po.bob
    y = po.cadera_y + b
    if p["abajo"] == "maxtlatl":
        L.parte(poli([(cx - po.hw, y - 8), (cx + po.hw, y - 8), (cx + po.hw - 1, y + 4), (cx + 4, y + 9), (cx - 4, y + 9), (cx - po.hw + 1, y + 4)]), p["c_abajo"])
        L.parte(poli([(cx - 5, y + 2), (cx + 5, y + 2), (cx + 4.5, y + 30), (cx - 4.5, y + 30)]), p["colgajo"])
        L.plano(poli([(cx - 4.5, y + 25), (cx + 4.5, y + 25), (cx + 4.5, y + 29), (cx - 4.5, y + 29)]), BLANCO, op=0.8)
    elif p["abajo"] in ("falda", "larga"):
        hem = SUELO - 9
        izq = min(t[0] for _, _, t, _ in po.piernas) - 9
        der = max(t[0] for _, _, t, _ in po.piernas) + 9
        lev = [lv for *_, lv in po.piernas]
        L.parte(poli([(cx - po.hw + 1, y - 10), (cx + po.hw - 1, y - 10), (der + 1, hem - lev[1] * 0.3), (izq - 1, hem - lev[0] * 0.3)]), p["c_abajo"])
        for k in (-1, 1):
            L.trazo(f"M{cx + k * 4},{y} L{cx + k * 6},{hem - 4}", sombra_de(p["c_abajo"]), 1.1)
        if p["abajo"] == "falda":
            ropa_banda(L, izq, der, hem - 7, 4, sombra_de(p["c_abajo"]), p.get("bordado2", OCRE))
        # pies por delante del borde
        for h, r, t, lv in po.piernas:
            L.parte(elipse(t[0], t[1] + 3.2, 4.6, 3.0), CUERO)
        # faja
        L.parte(poli([(cx - po.hw + 1, y - 13), (cx + po.hw - 1, y - 13), (cx + po.hw - 1, y - 8), (cx - po.hw + 1, y - 8)]), p.get("bordado", ROJO))


def arriba_frente(L, p, po, atras=False):
    cx, b = po.cx, po.bob
    y0 = po.hombro_y + b - 2
    tipo = p["arriba"]
    sw, ww, hw = po.sw, po.ww, po.hw
    if tipo == "camisa":
        hem = po.cadera_y + b - 2
        L.parte(suave([(cx - sw, y0 + 2), (cx - sw + 2, y0), (cx + sw - 2, y0), (cx + sw, y0 + 2), (cx + ww + 1, hem - 14), (cx + hw, hem), (cx - hw, hem), (cx - ww - 1, hem - 14)]), p["c_arriba"])
        ropa_banda(L, cx - hw + 1, cx + hw - 1, hem - 5, 4, p["bordado"], BLANCO)
    elif tipo == "huipil":
        hem = po.cadera_y + b + 16
        L.parte(poli([(cx - sw - 1, y0 + 1), (cx + sw + 1, y0 + 1), (cx + hw + 5, hem), (cx - hw - 5, hem)]), p["c_arriba"])
        ropa_banda(L, cx - hw - 5, cx + hw + 5, hem - 6, 5, p["bordado"], p.get("bordado2"))
        ropa_banda(L, cx - hw - 3.5, cx + hw + 3.5, hem - 13, 3, p.get("bordado2", OCRE), p["bordado"])
        if not atras:
            L.parte(poli([(cx - 9, y0 + 1), (cx + 9, y0 + 1), (cx + 7, y0 + 14), (cx - 7, y0 + 14)]), p["bordado"])
            L.plano(poli([(cx - 4, y0 + 1), (cx + 4, y0 + 1), (cx + 3, y0 + 7), (cx - 3, y0 + 7)]), p["piel"])
    elif tipo == "quechquemitl":
        hem = po.cadera_y + b - 2
        L.parte(poli([(cx - sw, y0 + 1), (cx + sw, y0 + 1), (cx + hw, hem), (cx - hw, hem)]), BLANCO)
        # capa triangular otomí
        L.parte(poli([(cx - sw - 3, y0 + 2), (cx + sw + 3, y0 + 2), (cx, hem + 10)]), p["c_arriba"])
        L.trazo(f"M{cx - sw},{y0 + 6} L{cx},{hem + 4} L{cx + sw},{y0 + 6}", p["bordado"], 3)
        L.trazo(f"M{cx - sw + 5},{y0 + 6} L{cx},{hem - 4} L{cx + sw - 5},{y0 + 6}", p["bordado2"], 1.6)
    elif tipo == "armadura":
        hem = po.cadera_y + b + 10
        L.parte(poli([(cx - sw - 1, y0 + 1), (cx + sw + 1, y0 + 1), (cx + hw + 3, hem), (cx - hw - 3, hem)]), p["c_arriba"])
        for k in range(1, 5):  # acolchado
            yy = y0 + k * (hem - y0) / 5
            L.trazo(f"M{cx - sw + 1},{yy} L{cx + sw - 1},{yy}", sombra_de(p["c_arriba"]), 0.9)
        for k in (-1, 0, 1):
            L.trazo(f"M{cx + k * 7},{y0 + 3} L{cx + k * 8},{hem - 2}", sombra_de(p["c_arriba"]), 0.9)
        ropa_banda(L, cx - hw - 3, cx + hw + 3, hem - 5, 5, p["bordado"], BLANCO)
    elif tipo == "tunica":
        hem = SUELO - 7
        L.parte(poli([(cx - sw - 1, y0 + 1), (cx + sw + 1, y0 + 1), (cx + hw + 7, hem), (cx - hw - 7, hem)]), p["c_arriba"])
        ropa_banda(L, cx - hw - 7, cx + hw + 7, hem - 6, 5, p["bordado"], BLANCO if p["c_arriba"] != BLANCO else OCRE)
        if not atras:
            L.trazo(f"M{cx},{y0 + 12} L{cx},{hem - 8}", sombra_de(p["c_arriba"]), 1.2)
        for h, r, t, lv in po.piernas:
            L.parte(elipse(t[0], t[1] + 3.2, 4.6, 3.0), CUERO)
    if p.get("mandil") and not atras:
        hem = po.cadera_y + b + (24 if not p["mujer"] else 30)
        L.parte(poli([(cx - 9, y0 + 9), (cx + 9, y0 + 9), (cx + 11, hem), (cx - 11, hem)]), p["mandil"])
        L.trazo(f"M{cx - 9},{y0 + 9} L{cx - 5},{y0 - 1} M{cx + 9},{y0 + 9} L{cx + 5},{y0 - 1}", sombra_de(p["mandil"]), 1.4)
    if p.get("collar") and not atras:
        for k in range(7):
            a = math.pi * (0.15 + 0.7 * k / 6)
            L.parte(elipse(cx + math.cos(a) * 8, y0 + 2 + math.sin(a) * 6, 1.6, 1.6), p["collar"], lw=0.8)


# --- cabeza
def cabeza_frente(L, p, po, detalle):
    cx, b = po.cx, po.bob
    hy = po.cab[1] + b
    rx, ry = po.rx, po.ry
    piel = p.get("cara", p["piel"])
    L.parte(capsula((cx, po.cuello + b - 6), (cx, po.cuello + b + 5), 4.4, 4.8), piel, desp=(1.2, -2))
    for k in (-1, 1):  # orejas
        L.parte(elipse(cx + k * (rx - 0.6), hy + 2, 2.6, 3.6), piel, lw=1.2)
    cara = suave([(cx - rx, hy - 4), (cx - rx + 1, hy - ry + 2), (cx, hy - ry - 1), (cx + rx - 1, hy - ry + 2), (cx + rx, hy - 4),
                  (cx + rx - 1.5, hy + 6), (cx + 6, hy + ry - 2.5), (cx, hy + ry + 0.5), (cx - 6, hy + ry - 2.5), (cx - rx + 1.5, hy + 6)])
    L.parte(cara, piel, desp=(2.6, 0.8))
    cara_rasgos(L, p, cx, hy, rx, ry, detalle)
    pelo_frente(L, p, po, hy)
    if p.get("aretes"):
        for k in (-1, 1):
            L.parte(elipse(cx + k * (rx - 0.5), hy + 6.5, 1.8, 1.8), p["aretes"], lw=0.8)


def cara_rasgos(L, p, cx, hy, rx, ry, detalle, perfil=False):
    mujer, anc = p["mujer"], p.get("anciano")
    ey = hy + 3
    dx = 6.0
    ojos = [cx - dx, cx + dx] if not perfil else [cx + 6.5]
    if ESTILO == "acogedor":
        ojos_tiernos(L, p, cx, ey, ojos, perfil)
        return
    for ox in ojos:
        w = 3.6 if mujer else 3.3
        h = 4.6 if mujer else 4.0
        if anc:
            h = 2.6
        # blanco del ojo, iris, pupila, brillos
        L.plano(elipse(ox, ey, w, h), "#fbf7f0")
        L.plano(elipse(ox + (0.6 if perfil else 0), ey + 0.3, w * 0.7, h * 0.85), p["ojos"])
        L.plano(elipse(ox + (0.6 if perfil else 0), ey + 0.6, w * 0.34, h * 0.42), "#140c0a")
        L.plano(elipse(ox + 1.0, ey - h * 0.35, 1.0, 1.1), "#ffffff")
        L.plano(elipse(ox - 0.9, ey + h * 0.4, 0.5, 0.5), "#ffffff", op=0.8)
        # párpado superior grueso (línea de anime) y pestaña
        L.trazo(f"M{ox - w - 0.4},{ey - h * 0.35} Q{ox},{ey - h - 1.3} {ox + w + 0.4},{ey - h * 0.55}", "#1a0e0a", 1.6 if mujer else 1.4)
        if mujer:
            L.trazo(f"M{ox + w},{ey - h * 0.6} l1.8,-1.2", "#1a0e0a", 1.1)
        L.trazo(f"M{ox - w * 0.6},{ey + h + 0.2} Q{ox},{ey + h + 0.8} {ox + w * 0.6},{ey + h + 0.2}", "#6a3a28", 0.6, op=0.7)
        # ceja
        L.trazo(f"M{ox - 3.6},{ey - h - 3.4} Q{ox},{ey - h - (4.6 if mujer else 5.2)} {ox + 3.8},{ey - h - 3.6}",
                p["pelo"] if not anc else "#bdb6aa", 1.3 if mujer else 1.8)
        if anc:
            L.trazo(f"M{ox + 3.6},{ey + 1} l2,1.6", "#6a3a28", 0.7)
    # nariz y boca
    if not perfil:
        L.trazo(f"M{cx + 0.6},{ey + 5} l-0.9,2.2 l1.4,0", "#7a4a32", 0.9)
        L.trazo(f"M{cx - 2.6},{ey + 10.2} Q{cx},{ey + 11.2} {cx + 2.6},{ey + 10.2}", "#6a2a1e", 1.1)
        if mujer:
            for k in (-1, 1):
                L.plano(elipse(cx + k * 8.5, ey + 6.5, 2.6, 1.3), "#e07a6a", op=0.45)
    if p.get("cicatriz"):
        L.trazo(f"M{cx + 9},{ey - 5} l-3,7", "#6a2a1e", 1)


def ojos_tiernos(L, p, cx, ey, ojos, perfil):
    mujer, anc = p["mujer"], p.get("anciano")
    ex = p.get("expresion", "normal")
    OSC = "#2a1a14"
    for ox in ojos:
        dentro = 1 if ox < cx else -1          # hacia la nariz
        w, h = (3.9, 5.2) if mujer else (3.6, 4.8)
        if anc or ex == "feliz":                # ojitos cerrados y sonrientes
            L.trazo(f"M{ox - 3.4},{ey + 0.8} Q{ox},{ey - 3} {ox + 3.4},{ey + 0.8}", OSC, 1.6)
        elif ex == "enojado":
            L.plano(elipse(ox, ey + 0.8, w, h * 0.78), OSC)
            L.plano(elipse(ox, ey + h * 0.45, w * 0.7, h * 0.36), p["ojos"], op=0.9)
            L.plano(elipse(ox + w * 0.3, ey - h * 0.05, w * 0.32, w * 0.32), "#ffffff")
            # párpado recto que tapa la parte de arriba
            L.plano(poli([(ox - w - 1, ey - h - 1), (ox + w + 1, ey - h - 1), (ox + w + 1, ey - h * 0.35 + dentro * -1.6),
                          (ox - w - 1, ey - h * 0.35 + dentro * 1.6)]), p.get("cara", p["piel"]))
        elif ex == "sorprendido":
            L.plano(elipse(ox, ey - 0.4, w * 1.05, h * 1.08), "#fbf7f0", linea=True, lw=1.0)
            L.plano(elipse(ox, ey, w * 0.5, h * 0.55), OSC)
            L.plano(elipse(ox + 0.6, ey - 1.0, 0.8, 0.8), "#ffffff")
        else:
            mira = 1.0 if ex == "apenado" else 0.0
            L.plano(elipse(ox + mira, ey, w, h), OSC)
            L.plano(elipse(ox + mira, ey + h * 0.35, w * 0.72, h * 0.5), p["ojos"], op=0.9)
            L.plano(elipse(ox + mira + w * 0.32, ey - h * 0.38, w * 0.42, w * 0.42), "#ffffff")
            L.plano(elipse(ox + mira - w * 0.38, ey + h * 0.42, w * 0.18, w * 0.18), "#ffffff", op=0.9)
            if ex == "triste":
                L.plano(elipse(ox + mira, ey + h * 0.15, w * 0.95, h * 0.5), "#7ab8e8", op=0.25)
            if mujer:
                sg = 1 if (perfil or ox > cx) else -1
                L.trazo(f"M{ox + sg * (w - 0.6)},{ey - h * 0.55} l{sg * 2},-1.4", OSC, 1.2)
        # cejas según la expresión
        cy_ = ey - (9.0 if mujer else 7.8)
        col_ceja = p["pelo"] if not anc else "#bdb6aa"
        if ex == "enojado":
            L.trazo(f"M{ox - dentro * 2.8},{cy_ - 0.6} L{ox + dentro * 2.6},{cy_ + 2.2}", col_ceja, 1.6)
        elif ex == "triste":
            L.trazo(f"M{ox - dentro * 2.6},{cy_ + 1.0} L{ox + dentro * 2.6},{cy_ - 1.2}", col_ceja, 1.4)
        elif ex == "sorprendido":
            L.trazo(f"M{ox - 2.4},{cy_ - 1.0} Q{ox},{cy_ - 2.8} {ox + 2.4},{cy_ - 1.0}", col_ceja, 1.3)
        else:
            L.trazo(f"M{ox - 2.4},{cy_ + 0.4} Q{ox},{cy_ - 1.0} {ox + 2.4},{cy_ + 0.4}", col_ceja, 1.3)
        rub = (3.8, 2.2, 0.75) if ex == "apenado" else (3.2, 1.7, 0.5)
        L.plano(elipse(ox + (1.5 if perfil else 0) + (0 if perfil else (-1 if ox < cx else 1)), ey + 5.6, rub[0], rub[1]), "#ec7a6e", op=rub[2])
        if ex == "apenado" and not perfil:
            for j in range(3):
                x0 = ox - 2 + j * 1.6
                L.trazo(f"M{x0},{ey + 4.6} l-0.8,1.8", "#c04a3a", 0.6, op=0.8)
    if not perfil:
        bx, by = cx, ey + 7.8
        boca = "#7a2a1e"
        if ex == "feliz":
            L.plano(f"M{bx - 3},{by - 0.4} Q{bx},{by + 4.4} {bx + 3},{by - 0.4} Z", boca, linea=False)
            L.plano(elipse(bx, by + 2.0, 1.4, 0.8), "#e8707a")
        elif ex == "triste":
            L.trazo(f"M{bx - 2.2},{by + 1.2} Q{bx},{by - 0.8} {bx + 2.2},{by + 1.2}", boca, 1.1)
            L.plano(f"M{ojos[0] - 1.6},{ey + 4} q-1.4,2.6 0,3.6 q1.4,-1 0,-3.6 Z", "#8ac8f0", linea=False)
        elif ex == "enojado":
            L.trazo(f"M{bx - 2.4},{by + 1.0} L{bx + 2.4},{by + 0.2}", boca, 1.2)
            L.plano(f"M{cx + 11},{ey - 9} l1.4,1.4 m-2.8,0 l1.4,-1.4 m0,2.8 l1.4,1.4 m-2.8,0 l1.4,-1.4", "none")
            L.trazo(f"M{cx + 10},{ey - 11} l2.4,2.4 M{cx + 12.4},{ey - 11} l-2.4,2.4", "#d03a2a", 1.0)
        elif ex == "sorprendido":
            L.plano(elipse(bx, by + 0.8, 1.6, 2.0), boca)
        elif ex == "apenado":
            L.trazo(f"M{bx - 2.4},{by} q0.8,0.8 1.6,0 t1.6,0 t1.6,0", boca, 1.0)
            L.plano(f"M{cx + 11.5},{ey - 7} q-1.6,3 0,4.2 q1.6,-1.2 0,-4.2 Z", "#9ad0f4", linea=True, lw=0.5)
        else:
            L.trazo(f"M{bx - 2.2},{by - 0.2} Q{bx - 1.1},{by + 1.2} {bx},{by} Q{bx + 1.1},{by + 1.2} {bx + 2.2},{by - 0.2}", boca, 1.1)
    if p.get("cicatriz"):
        L.trazo(f"M{cx + 9},{ey - 5} l-3,7", "#a0503a", 0.9)


def pelo_atras(L, p, po, vista):
    cx, b = po.cx, po.bob
    hy = po.cab[1] + b
    rx, ry = po.rx, po.ry
    c = p["pelo"]
    pe = p["peinado"]
    if vista == "abajo":
        if pe in ("trenza", "largo", "anciano"):
            L.parte(poli([(cx - rx - 1.5, hy), (cx + rx + 1.5, hy), (cx + rx + 3, hy + 36), (cx - rx - 3, hy + 36)]), lejos(c))
        if pe == "trenzas":
            pass
        return
    # vista de espaldas: el pelo cubre la cabeza
    L.parte(suave([(cx - rx - 1.5, hy + 4), (cx - rx, hy - ry + 1), (cx, hy - ry - 3), (cx + rx, hy - ry + 1), (cx + rx + 1.5, hy + 4),
                   (cx + rx - 1, hy + ry - 2), (cx, hy + ry + 1), (cx - rx + 1, hy + ry - 2)]), c, desp=(2.5, 1.5))
    for k in (-6, -2, 2, 6):
        L.trazo(f"M{cx + k * 0.6},{hy - ry} Q{cx + k * 1.1},{hy} {cx + k * 1.2},{hy + ry - 2}", mezcla(c, "#ffffff", 0.18), 0.9)
    if pe == "trenza":
        trenza(L, c, (cx, hy + ry - 2), (cx + 1, hy + 70 * LARGO), p.get("listón", ROJO))
    elif pe == "trenzas":
        for k in (-1, 1):
            trenza(L, c, (cx + k * 7, hy + ry - 4), (cx + k * 9, hy + 46), ROJO)
    elif pe in ("largo", "anciano"):
        L.parte(poli([(cx - rx, hy + 4), (cx + rx, hy + 4), (cx + rx + 2, hy + 48 * LARGO), (cx - rx - 2, hy + 48 * LARGO)]), c)
        for k in (-8, -3, 3, 8):
            L.trazo(f"M{cx + k},{hy + 8} L{cx + k * 1.15},{hy + 46}", mezcla(c, "#000000", 0.25), 0.9)
    elif pe == "chongo":
        L.parte(elipse(cx, hy - 2, 8, 7), c)
        L.trazo(f"M{cx - 6},{hy - 2} Q{cx},{hy + 2} {cx + 6},{hy - 4}", mezcla(c, "#ffffff", 0.2), 0.9)
        L.parte(elipse(cx + 6, hy - 8, 3.4, 3.4), p.get("flor", ROJO), lw=0.8)
    elif pe == "coleta":
        L.parte(capsula((cx, hy + 6), (cx, hy + 30), 4.5, 2.5), c)
        L.parte(elipse(cx, hy + 7, 3.6, 2.4), p.get("banda", ROJO), lw=0.8)
    elif pe == "temillotl":
        L.parte(capsula((cx, hy - ry), (cx, hy - ry - 9), 4, 5), c)
        L.parte(elipse(cx, hy - ry - 1, 4.2, 2.2), p.get("banda", ROJO), lw=0.8)
    if p.get("banda"):
        L.parte(poli([(cx - rx - 1, hy - 6), (cx + rx + 1, hy - 6), (cx + rx + 1, hy - 2.5), (cx - rx - 1, hy - 2.5)]), p["banda"], lw=1.1)
        L.parte(poli([(cx - 1, hy - 4), (cx - 5, hy + 12), (cx - 1.5, hy + 11)]), p["banda"], lw=0.9)
        L.parte(poli([(cx + 1, hy - 4), (cx + 5, hy + 13), (cx + 1.5, hy + 12)]), p["banda"], lw=0.9)
    if p.get("diadema"):
        L.parte(poli([(cx - rx - 1, hy - 8), (cx + rx + 1, hy - 8), (cx + rx + 1, hy - 4), (cx - rx - 1, hy - 4)]), p["diadema"], lw=1.1)


def trenza(L, c, a, b, liston):
    n = 7
    for k in range(n):
        t = k / n
        x = a[0] + (b[0] - a[0]) * t
        y = a[1] + (b[1] - a[1]) * t
        L.parte(elipse(x + (1 if k % 2 else -1) * 0.8, y + 3, 3.6 - t, 4.2), c, lw=1.0, desp=(1.2, 0.8))
    L.parte(elipse(b[0], b[1] + 1, 2.8, 2.2), liston, lw=0.8)
    L.plano(poli([(b[0] - 1, b[1] + 2), (b[0] - 3, b[1] + 9), (b[0], b[1] + 7), (b[0] + 3, b[1] + 9), (b[0] + 1, b[1] + 2)]), liston, linea=True, lw=0.8)


def mechones(pts, n_corona=5):
    """contorno de pelo: corona redonda (curvas) y fleco con puntas afiladas (rectas)"""
    corona = pts[:n_corona]
    d = f"M{corona[0][0]:.2f},{corona[0][1]:.2f}"
    for i in range(1, len(corona) - 1):
        mx = (corona[i][0] + corona[i + 1][0]) / 2
        my = (corona[i][1] + corona[i + 1][1]) / 2
        d += f" Q{corona[i][0]:.2f},{corona[i][1]:.2f} {mx:.2f},{my:.2f}"
    d += f" L{corona[-1][0]:.2f},{corona[-1][1]:.2f}"
    resto = pts[n_corona:]
    prev = corona[-1]
    for q in resto:  # cada mechón: curva ligera hacia la punta
        cxq = (prev[0] + q[0]) / 2 + (q[1] - prev[1]) * 0.15
        cyq = (prev[1] + q[1]) / 2 - (q[0] - prev[0]) * 0.15
        d += f" Q{cxq:.2f},{cyq:.2f} {q[0]:.2f},{q[1]:.2f}"
        prev = q
    return d + " Z"


def pelo_frente(L, p, po, hy):
    cx = po.cx
    rx, ry = po.rx, po.ry
    c = p["pelo"]
    pe = p["peinado"]
    # casco de pelo con fleco en mechones de anime
    fleco = [(cx - rx - 1.8, hy + 6), (cx - rx - 1.5, hy - ry + 2), (cx - 4, hy - ry - 3.5), (cx + 6, hy - ry - 3), (cx + rx + 1.5, hy - ry + 3),
             (cx + rx + 1.8, hy + 6), (cx + rx - 1.5, hy - 1), (cx + rx - 4, hy - 5.5), (cx + 7, hy - 7), (cx + 4, hy - 3), (cx + 1, hy - 8),
             (cx - 3, hy - 4), (cx - 6, hy - 8.5), (cx - 9, hy - 3.5), (cx - rx + 1.5, hy - 2)]
    if pe in ("trenzas", "trenza", "chongo"):  # raya en medio
        fleco = [(cx - rx - 1.8, hy + 7), (cx - rx - 1.5, hy - ry + 3), (cx - 3, hy - ry - 3), (cx + 3, hy - ry - 3), (cx + rx + 1.5, hy - ry + 3),
                 (cx + rx + 1.8, hy + 7), (cx + rx - 1.5, hy + 1), (cx + 8, hy - 6), (cx + 1, hy - 11), (cx - 1, hy - 11), (cx - 8, hy - 6), (cx - rx + 1.5, hy + 1)]
    if pe == "anciano":
        fleco = [(cx - rx - 2, hy + 10), (cx - rx - 1.5, hy - ry + 3), (cx, hy - ry - 3.5), (cx + rx + 1.5, hy - ry + 3), (cx + rx + 2, hy + 10),
                 (cx + rx - 1, hy - 4), (cx + 4, hy - 10), (cx - 4, hy - 10), (cx - rx + 1, hy - 4)]
    L.parte(mechones(fleco), c, desp=(2.4, 1.2))
    brillo = mezcla(c, "#ffffff", 0.3 if c != "#e6e2da" else 0.6)
    L.trazo(f"M{cx - 9},{hy - ry + 2} Q{cx - 3},{hy - ry - 1} {cx + 2},{hy - ry + 1}", brillo, 1.6, op=0.85)
    if pe == "trenzas":
        for k in (-1, 1):
            trenza(L, c, (cx + k * (rx - 1), hy + 6), (cx + k * (rx + 2), hy + 50), ROJO)
        L.parte(elipse(cx + rx - 1, hy - ry + 4, 3.4, 3.4), p.get("flor", ROJO), lw=0.8)
        L.plano(elipse(cx + rx - 1, hy - ry + 4, 1.2, 1.2), OCRE)
    if pe == "trenza":
        trenza(L, c, (cx + rx - 3, hy + 8), (cx + rx, hy + 52), p.get("listón", ROJO))
    if pe == "chongo":
        L.parte(elipse(cx, hy - ry - 3, 7, 5), c, lw=1.2)
        L.parte(elipse(cx + 7, hy - ry - 1, 3.4, 3.4), p.get("flor", ROJO), lw=0.8)
        L.plano(elipse(cx + 7, hy - ry - 1, 1.2, 1.2), OCRE)
    if pe == "temillotl":
        L.parte(capsula((cx, hy - ry - 1), (cx + 1, hy - ry - 10), 4, 5.4), c)
        L.parte(elipse(cx, hy - ry - 2, 4.4, 2.2), p.get("banda", ROJO), lw=0.8)
    if p.get("banda"):
        L.parte(poli([(cx - rx - 1.2, hy - 7), (cx + rx + 1.2, hy - 7), (cx + rx + 1.2, hy - 3.6), (cx - rx - 1.2, hy - 3.6)]), p["banda"], lw=1.1)
    if p.get("diadema"):
        L.parte(poli([(cx - rx - 1, hy - 9), (cx + rx + 1, hy - 9), (cx + rx + 1, hy - 4.5), (cx + 3, hy - 4.5), (cx, hy - 15), (cx - 3, hy - 4.5), (cx - rx - 1, hy - 4.5)]), p["diadema"], lw=1.1)
        L.plano(elipse(cx, hy - 8.5, 1.4, 1.4), OCRE)


# --- vista de lado (mirando a la derecha)
def lado(L, p, po, accion):
    cx, b = po.cx, po.bob
    hy = po.cab[1] + b
    tipo = p["arriba"]
    falda = p["abajo"] in ("falda", "larga") or tipo == "tunica"
    # pelo largo de atrás
    pe = p["peinado"]
    L.ini(tcab(po))
    if pe in ("largo", "anciano"):
        L.parte(poli([(cx - 12, hy - 2), (cx - 2, hy - 2), (cx - 4, hy + 46 * LARGO), (cx - 16, hy + 44 * LARGO)]), p["pelo"])
    if pe == "trenza":
        trenza(L, p["pelo"], (cx - 8, hy + 8), (cx - 10, hy + 66 * LARGO), p.get("listón", ROJO))
    L.fin()
    if p.get("capa"):
        y0 = po.hombro_y + b
        hem = 150 if pe != "anciano" else 172
        ondea = [3, 6, 3, 6][po.cuadro] if accion is None else 2
        L.parte(poli([(cx - 6, y0), (cx + 2, y0), (cx - 6, hem + b), (cx - 15 - ondea, hem + b - 2)]), p["capa"])
        L.plano(poli([(cx - 6, hem + b - 5), (cx - 15 - ondea, hem + b - 7), (cx - 15 - ondea, hem + b - 2), (cx - 6, hem + b)]), p["capa_borde"], linea=True, lw=1)
    if p.get("escudo"):
        escudo(L, p, (cx - 8, po.hombro_y + b + 20), atras=False, lado=True)
    # brazo y pierna de atrás
    brazo(L, p, po.brazos[0], p["piel"], manga_de(p), lejos_=True, manga_larga=tipo == "tunica")
    h, r, t, _ = po.piernas[0]
    pierna(L, p, h, r, t, p["piel"], lejos_=True, lado=True)
    h, r, t, _ = po.piernas[1]
    pierna(L, p, h, r, t, p["piel"], lado=True)
    # ropa de abajo
    y = po.cadera_y + b
    if p["abajo"] == "maxtlatl":
        L.parte(poli([(cx - 10, y - 8), (cx + 9, y - 8), (cx + 9, y + 4), (cx - 10, y + 4)]), p["c_abajo"])
        L.parte(poli([(cx + 5, y + 2), (cx + 10, y + 2), (cx + 12, y + 26), (cx + 6, y + 26)]), p["colgajo"])
        L.parte(poli([(cx - 10, y + 2), (cx - 5, y + 2), (cx - 9, y + 22), (cx - 14, y + 20)]), p["colgajo"])
    if falda:
        hem = SUELO - 8
        xs = [t[0] for _, _, t, _ in po.piernas]
        L.parte(poli([(cx - 11, y - 12), (cx + 10, y - 12), (max(xs) + 8, hem), (min(xs) - 7, hem)]), p["c_abajo"] if tipo != "tunica" else p["c_arriba"])
        ropa_banda(L, min(xs) - 7, max(xs) + 8, hem - 6, 5, p["bordado"] if tipo == "tunica" else sombra_de(p["c_abajo"]),
                   BLANCO if tipo == "tunica" else p.get("bordado2", OCRE))
        for _, _, t, _ in po.piernas:
            L.parte(elipse(t[0] + 4, t[1] + 3.2, 7.5, 2.8), CUERO)
    # torso de lado
    y0 = po.hombro_y + b - 2
    hems = {"camisa": po.cadera_y + b - 2, "huipil": po.cadera_y + b + 16, "armadura": po.cadera_y + b + 10,
            "quechquemitl": po.cadera_y + b - 2, "tunica": po.cadera_y + b + 4}
    hem = hems[tipo]
    pecho = 11 if not p["mujer"] else 10
    torso = suave([(cx - 8, y0 + 1), (cx + 3, y0), (cx + pecho, y0 + 8), (cx + pecho - 1, y0 + 22), (cx + 9 + (5 if tipo in ("huipil", "armadura") else 0), hem),
                   (cx - 11 - (5 if tipo in ("huipil", "armadura") else 0), hem), (cx - 10, y0 + 22), (cx - 10, y0 + 6)])
    L.parte(torso, p["c_arriba"])
    if p.get("manchas"):
        for (mx_, my_) in ((cx - 5, y0 + 8), (cx + 4, y0 + 14), (cx - 3, y0 + 22), (cx + 6, y0 + 26), (cx - 8, y0 + 17)):
            L.plano(elipse(mx_, my_, 2.2, 1.9), "none", linea=True, lw=1.1)
            L.plano(elipse(mx_, my_, 0.8, 0.8), "#2a2420")
    if tipo == "armadura" and not p.get("manchas"):
        for k in range(1, 5):
            yy = y0 + k * (hem - y0) / 5
            L.trazo(f"M{cx - 10},{yy} L{cx + 10},{yy}", sombra_de(p["c_arriba"]), 0.9)
    if tipo in ("huipil", "armadura", "camisa"):
        ancho = 14 if tipo != "camisa" else 10
        ropa_banda(L, cx - ancho - 1, cx + ancho, hem - 5, 4, p["bordado"], p.get("bordado2", BLANCO))
    if tipo == "quechquemitl":
        L.parte(poli([(cx - 11, y0 + 2), (cx + 11, y0 + 2), (cx + 2, hem + 8)]), p["c_arriba"])
        L.trazo(f"M{cx - 9},{y0 + 5} L{cx + 2},{hem + 2} L{cx + 10},{y0 + 5}", p["bordado"], 2.4)
    if p.get("mandil"):
        L.parte(poli([(cx + 6, y0 + 9), (cx + 12, y0 + 9), (cx + 13, po.cadera_y + b + 24), (cx + 7, po.cadera_y + b + 24)]), p["mandil"])
    # cabeza de perfil 3/4
    L.ini(tcab(po))
    piel = p.get("cara", p["piel"])
    L.parte(capsula((cx + 1, po.cuello + b - 6), (cx, po.cuello + b + 5), 4.4, 4.8), piel, desp=(1.2, -2))
    cara = suave([(cx - 13, hy - 2), (cx - 12, hy - 15), (cx, hy - 18), (cx + 11, hy - 14), (cx + 14, hy - 4), (cx + 14.5, hy + 3),
                  (cx + 13, hy + 9), (cx + 8, hy + 15), (cx + 2, hy + 17), (cx - 4, hy + 13), (cx - 11, hy + 8)])
    L.parte(cara, piel, desp=(2.2, 0.8))
    L.parte(elipse(cx - 3, hy + 2, 2.6, 3.6), piel, lw=1.2)
    cara_rasgos(L, p, cx, hy, 14, 16, False, perfil=True)
    L.trazo(f"M{cx + 14.5},{hy + 4} l1.4,2.6 l-1.8,0.6", "#7a4a32", 0.9)
    L.trazo(f"M{cx + 9},{hy + 11} Q{cx + 11},{hy + 11.6} {cx + 12.6},{hy + 10.8}", "#6a2a1e", 1.0)
    if p["mujer"]:
        L.plano(elipse(cx + 8, hy + 7, 2.6, 1.3), "#e07a6a", op=0.45)
    # pelo
    c = p["pelo"]
    casco = [(cx - 14, hy + 8), (cx - 14, hy - 12), (cx - 2, hy - 20), (cx + 10, hy - 16), (cx + 14, hy - 6), (cx + 11, hy - 4),
             (cx + 7, hy - 9), (cx + 4, hy - 4), (cx, hy - 8), (cx - 3, hy + 2), (cx - 7, hy - 1), (cx - 8, hy + 10)]
    L.parte(mechones(casco, 6), c, desp=(2.2, 1.2))
    L.trazo(f"M{cx - 8},{hy - 14} Q{cx},{hy - 18} {cx + 6},{hy - 14}", mezcla(c, "#ffffff", 0.3), 1.5, op=0.85)
    if pe == "chongo":
        L.parte(elipse(cx - 12, hy - 8, 6, 6), c)
        L.parte(elipse(cx - 7, hy - 15, 3.4, 3.4), p.get("flor", ROJO), lw=0.8)
    if pe == "trenzas":
        trenza(L, c, (cx - 4, hy + 10), (cx - 2, hy + 52), ROJO)
        L.parte(elipse(cx - 6, hy - 14, 3.4, 3.4), p.get("flor", ROJO), lw=0.8)
    if pe == "coleta":
        L.parte(capsula((cx - 12, hy - 2), (cx - 16, hy + 24), 4, 2.4), c)
    if pe == "temillotl":
        L.parte(capsula((cx - 4, hy - 18), (cx - 7, hy - 27), 4, 5), c)
        L.parte(elipse(cx - 4, hy - 19, 4.2, 2.2), p.get("banda", ROJO), lw=0.8)
    if p.get("banda"):
        L.parte(poli([(cx - 14, hy - 9), (cx + 13, hy - 9), (cx + 13, hy - 5.5), (cx - 14, hy - 5.5)]), p["banda"], lw=1.1)
        L.parte(poli([(cx - 13, hy - 8), (cx - 20, hy + 6), (cx - 16, hy + 7)]), p["banda"], lw=0.9)
    if p.get("diadema"):
        L.parte(poli([(cx - 14, hy - 11), (cx + 13, hy - 11), (cx + 13, hy - 6), (cx + 12, hy - 6), (cx + 10, hy - 17), (cx + 7, hy - 6), (cx - 14, hy - 6)]), p["diadema"], lw=1.1)
    if p.get("aretes"):
        L.parte(elipse(cx - 3, hy + 7.5, 1.8, 1.8), p["aretes"], lw=0.8)
    dibujar_casco(L, p, cx, hy)
    L.fin()
    # brazo de adelante
    objeto_mano(L, p, po, "derecha", antes=True)
    brazo(L, p, po.brazos[1], p["piel"], manga_de(p), manga_larga=tipo == "tunica")
    objeto_mano(L, p, po, "derecha")


# --- objetos
def escudo(L, p, c, atras=False, grande=False, lado=False):
    r = 13 if grande else 11
    col = p["escudo"]
    if lado:
        L.parte(elipse(c[0], c[1], 5, r), col)
        return
    L.parte(elipse(c[0], c[1], r, r), lejos(col) if atras else col)
    L.plano(elipse(c[0], c[1], r * 0.6, r * 0.6), "none", linea=True, lw=1)
    L.parte(elipse(c[0], c[1], r * 0.32, r * 0.32), BLANCO, lw=0.8)
    for k in range(5):
        L.plano(poli([(c[0] - r * 0.7 + k * r * 0.35, c[1] + r), (c[0] - r * 0.55 + k * r * 0.35, c[1] + r + 7), (c[0] - r * 0.4 + k * r * 0.35, c[1] + r)]), [JADE, BLANCO][k % 2], linea=True, lw=0.7)


def objeto_mano(L, p, po, vista, antes=False):
    m = p.get("mano")
    if po.accion not in (None, "quieto") or not m:
        return
    mano = po.brazos[1][2] if vista != "abajo" else po.brazos[1][2]
    mx, my = mano[0], mano[1] + 3
    if vista == "abajo":
        mx, my = po.brazos[1][2][0], po.brazos[1][2][1] + 3
    if vista == "arriba":
        mx, my = po.brazos[0][2][0], po.brazos[0][2][1] + 3
    lanza = m in ("lanza", "baston")
    if antes and not lanza:
        return
    if not antes and lanza and vista == "derecha":
        return
    if m == "bolsa":
        L.parte(poli([(mx - 6, my - 2), (mx + 6, my - 2), (mx + 8, my + 12), (mx - 8, my + 12)]), "#cdb27a")
        L.plano(elipse(mx, my - 2, 5, 2), OCRE, linea=True, lw=0.8)
    elif m == "flores":
        L.parte(poli([(mx - 9, my), (mx + 9, my), (mx + 7, my + 9), (mx - 7, my + 9)]), "#c79a52")
        for k, c in enumerate(("#e8507a", OCRE, "#f08a1c", "#e8507a", "#f6f0e0")):
            L.parte(elipse(mx - 7 + k * 3.5, my - 2 - (k % 2) * 2, 2.6, 2.6), c, lw=0.7)
    elif m == "cantaro":
        L.parte(elipse(mx, my + 5, 7, 7.5), "#b05a32")
        L.parte(elipse(mx, my - 2, 3.4, 2), "#8a4426", lw=0.8)
        L.trazo(f"M{mx - 6},{my + 4} Q{mx},{my + 8} {mx + 6},{my + 4}", BLANCO, 1.0)
    elif m == "martillo":
        L.parte(capsula((mx, my - 2), (mx, my + 16), 1.6, 1.6), "#8a5a32")
        L.parte(poli([(mx - 6, my + 12), (mx + 6, my + 12), (mx + 6, my + 19), (mx - 6, my + 19)]), "#6a6a72")
    elif m == "copal":
        L.parte(poli([(mx - 5, my), (mx + 5, my), (mx + 6, my + 11), (mx - 6, my + 11)]), "#c9b07a")
        L.trazo(f"M{mx - 4},{my + 4} L{mx + 4},{my + 4}", ROJO, 1.4)
    elif m == "hierbas":
        L.parte(poli([(mx - 6, my), (mx + 6, my), (mx + 7, my + 12), (mx - 7, my + 12)]), "#e8e0c8")
        for k in (-3, 0, 3):
            L.trazo(f"M{mx + k},{my} q{k},-6 {k * 1.6},-9", "#3e8a4a", 1.8)
    elif m in ("lanza", "baston"):
        alto = 150 if m == "lanza" else 128
        x = mx
        L.parte(capsula((x, my + 22), (x, my + 22 - alto + 40), 1.6, 1.6), "#8a5a32")
        top = my + 22 - alto + 40
        if m == "lanza":
            L.parte(poli([(x - 3.4, top + 2), (x, top - 13), (x + 3.4, top + 2)]), "#2a2630")
        else:
            for k in range(5):
                L.parte(elipse(x - 4 + k * 2, top - 3, 1.6, 5, (k - 2) * 0.35), [JADE, OCRE, ROJO, OCRE, JADE][k], lw=0.6)
    elif m == "macuahuitl":
        L.parte(poli([(mx - 2.4, my - 4), (mx + 2.4, my - 4), (mx + 3.4, my + 26), (mx - 3.4, my + 26)]), "#7a4a24")
        for k in range(6):
            yy = my + 2 + k * 4
            for s in (-1, 1):
                L.plano(poli([(mx + s * 3, yy), (mx + s * 6, yy + 1.6), (mx + s * 3, yy + 3)]), "#1a1820", linea=False)


# ------------------------------------------------------------------ acciones del jugador
def aplicar_accion(po, vista, accion, k):
    """cambia la posición de los brazos (2 cuadros por acción). Las medidas están pensadas para
    brazos de 47 px y se escalan al largo real del brazo (el estilo acogedor los tiene más cortos)"""
    cx = po.cx
    y = po.hombro_y + po.bob
    ka = (po.brazo + po.antebrazo) / 47.0
    def esc(hom, codo, fin):
        if accion in ("saludar", "comer", "cargar"):  # medidas ya hechas para el cuerpo actual
            return [hom, codo, fin]
        return [hom, (hom[0] + (codo[0] - hom[0]) * ka, hom[1] + (codo[1] - hom[1]) * ka),
                (hom[0] + (fin[0] - hom[0]) * ka, hom[1] + (fin[1] - hom[1]) * ka)]
    if vista == "lado":
        hom = (cx + 1, y)
        un_brazo = accion in ("saludar", "comer")
        if accion in ("arar", "talar", "picar"):
            fin = [(cx + 6, y - 22), (cx + 20, y + 26)][k]
            codo = [(cx + 4, y - 10), (cx + 14, y + 10)][k]
        elif accion == "regar":
            codo, fin = (cx + 10, y + 12), (cx + 22, y + 14 + k * 3)
        elif accion == "golpe":
            codo, fin = (cx + 12, y - 6), (cx + 24, y - 4)
        elif accion == "saludar":
            codo, fin = (cx + 9, y - 8), [(cx + 15, y - 26), (cx + 8, y - 28)][k]
        elif accion == "comer":
            codo, fin = (cx + 10, y + 10), [(cx + 15, y - 15), (cx + 15, y - 18)][k]
        elif accion == "pescar":
            codo, fin = (cx + 10, y + 14), (cx + 22, y + 10 + k * 2)
        elif accion == "cargar":
            codo, fin = (cx + 8, y + 12), (cx + 6, y + 4 - k)
        else:  # cosechar
            codo, fin = [(cx + 10, y + 18), (cx + 8, y + 6)][k], [(cx + 22, y + 44), (cx + 18, y + 0)][k]
        cerca = esc(hom, codo, fin)
        lejos_ = po.brazos[0] if un_brazo else esc(hom, (codo[0] + 1, codo[1]), (fin[0] + 1, fin[1]))
        po.brazos = [lejos_, cerca]
    else:
        for i, lado in enumerate((-1, 1)):
            hom = (cx + lado * (po.sw - 3), y)
            if accion in ("arar", "talar", "picar"):
                fin = [(cx + lado * 4, y - 26), (cx + lado * 4, y + 38)][k]
                codo = [(cx + lado * 12, y - 10), (cx + lado * 12, y + 16)][k]
            elif accion in ("regar", "pescar"):
                fin = (cx + lado * 6, y + 30 + k * 2)
                codo = (cx + lado * (po.sw + 1), y + 18)
            elif accion == "saludar":
                if lado < 0:
                    continue
                codo, fin = (cx + po.sw + 8, y - 6), [(cx + po.sw + 13, y - 24), (cx + po.sw + 7, y - 26)][k]
            elif accion == "comer":
                if lado < 0:
                    continue
                codo, fin = (cx + po.sw + 3, y + 12), [(cx + 3, y - 14), (cx + 2, y - 17)][k]
            elif accion == "cargar":
                codo, fin = (cx + lado * (po.sw + 1), y + 13), (cx + lado * 4, y + 6 - k)
            else:
                fin = [(cx + lado * 8, y + 52), (cx + lado * 10, y + 16)][k]
                codo = [(cx + lado * (po.sw + 1), y + 26), (cx + lado * (po.sw + 1), y + 12)][k]
            po.brazos[i] = esc(hom, codo, fin)
    po.accion_info = (accion, k)


def dibujar_casco(L, p, cx, hy):
    c = p.get("casco")
    if c == "jaguar":  # cabeza de jaguar sobre el cráneo, la cara asoma por la boca
        amar = "#e0a830"
        L.parte(suave([(cx - 16, hy + 6), (cx - 16, hy - 14), (cx - 2, hy - 23), (cx + 12, hy - 19), (cx + 20, hy - 12), (cx + 19, hy - 7),
                       (cx + 10, hy - 8), (cx + 2, hy - 9), (cx - 6, hy - 4), (cx - 9, hy + 8)]), amar)
        L.parte(poli([(cx - 6, hy - 19), (cx - 2, hy - 28), (cx + 2, hy - 20)]), amar, lw=1.1)
        L.plano(elipse(cx + 14, hy - 15, 2.2, 2.4), "#2a1a14")
        L.plano(elipse(cx + 14.6, hy - 15.8, 0.8, 0.8), "#fff")
        L.plano(elipse(cx + 19, hy - 11, 1.6, 1.2), "#2a1a14")
        for k in range(3):
            L.plano(poli([(cx + 8 - k * 4, hy - 8), (cx + 9.4 - k * 4, hy - 4.6), (cx + 10.6 - k * 4, hy - 8)]), "#fbf7ee", linea=True, lw=0.6)
        for (mx_, my_) in ((cx - 10, hy - 10), (cx - 3, hy - 16), (cx + 5, hy - 18), (cx - 12, hy)):
            L.plano(elipse(mx_, my_, 2.2, 1.9), "none", linea=True, lw=1.0)
    elif c == "aguila":  # cabeza de águila con pico sobre la frente
        caf = "#7a5a3a"
        L.parte(suave([(cx - 16, hy + 6), (cx - 16, hy - 14), (cx - 2, hy - 23), (cx + 12, hy - 18), (cx + 15, hy - 10), (cx + 6, hy - 8),
                       (cx - 6, hy - 4), (cx - 9, hy + 8)]), caf)
        L.parte(suave([(cx + 10, hy - 17), (cx + 24, hy - 13), (cx + 22, hy - 6), (cx + 12, hy - 8)]), "#e8b030")
        L.plano(elipse(cx + 9, hy - 14, 2.2, 2.4), "#2a1a14")
        L.plano(elipse(cx + 9.6, hy - 14.8, 0.8, 0.8), "#fff")
        for k in range(4):
            L.parte(capsula((cx - 12 + k * 2, hy - 18 + k), (cx - 22 + k * 3, hy - 30 + k * 4), 1.6, 2.6), ["#f4eee2", "#2a2420"][k % 2], lw=0.8)


def herramienta(L, po, vista, accion, k):
    if vista in ("derecha", "izquierda"):
        mano = po.brazos[1][2]
    else:
        mano = ((po.brazos[0][2][0] + po.brazos[1][2][0]) / 2, (po.brazos[0][2][1] + po.brazos[1][2][1]) / 2)
    mx, my = mano
    lat = vista in ("derecha", "izquierda")
    if accion == "saludar":
        return
    if accion == "comer":  # tlaxcalli (tortilla) enrollada, mano encima de la cara
        mx, my = po.brazos[1][2]
        L.parte(elipse(mx, my + 2.2, 3.3, 3.7), PIEL, lw=1.2, desp=(1.2, 0.8))
        L.parte(capsula((mx - 5, my + 1), (mx + 5, my - 1), 2.6, 2.6), "#f2e2b0")
        L.trazo(f"M{mx - 3},{my} l5,-1", "#d8b870", 0.8)
        return
    if accion == "pescar":  # caña de carrizo con hilo
        tip = (mx + 34, my - 40 + k * 6) if lat else (mx + 26, my - 46 + k * 6)
        L.parte(capsula((mx, my), tip, 1.4, 0.8), "#c0a060")
        L.trazo(f"M{tip[0]},{tip[1]} L{tip[0] + 2},{my + 46}", "#f4eee2", 0.7)
        L.parte(elipse(tip[0] + 2, my + 46, 1.6, 2.2), "#d03a2a", lw=0.6)
        return
    if accion == "cargar":  # la carga va en la espalda (se dibuja en dibujar_accion)
        return
    if accion in ("talar", "picar"):
        if lat:
            punta = [(mx - 22, my - 30), (mx + 18, my + 22)][k]
        elif vista == "abajo":
            punta = [(mx, my - 40), (mx, my + 28)][k]
        else:
            punta = [(mx, my - 40), (mx, my + 28)][k]
        L.parte(capsula((mx, my), punta, 1.8, 1.8), "#8a5a32")
        ang = math.atan2(punta[1] - my, punta[0] - mx)
        nx, ny = -math.sin(ang), math.cos(ang)
        if accion == "talar":  # hacha de cobre
            L.parte(poli([(punta[0] - nx * 2, punta[1] - ny * 2), (punta[0] + nx * 9 + math.cos(ang) * 4, punta[1] + ny * 9 + math.sin(ang) * 4),
                          (punta[0] + nx * 9 - math.cos(ang) * 4, punta[1] + ny * 9 - math.sin(ang) * 4)]), "#c87a3a", lw=1.0)
        else:  # pico
            L.parte(poli([(punta[0] - nx * 11, punta[1] - ny * 11), (punta[0] + math.cos(ang) * 2.4, punta[1] + math.sin(ang) * 2.4),
                          (punta[0] + nx * 11, punta[1] + ny * 11), (punta[0] - math.cos(ang) * 2.4, punta[1] - math.sin(ang) * 2.4)]), "#7a7a84", lw=1.0)
        return
    if accion == "golpe":  # macuahuitl hacia adelante
        L.parte(poli([(mx - 1, my + 1.6), (mx - 1, my - 2.6), (mx + 30, my - 6), (mx + 30, my - 0.6)]), "#7a4a24")
        for j in range(7):
            x = mx + 3 + j * 4
            for s_ in (-1, 1):
                yb = my - 2 - j * 0.55 + (s_ * 3.2 if s_ > 0 else -3.4)
                L.plano(poli([(x, my - 0.5 - j * 0.55 + s_ * 1.6), (x + 1.6, yb), (x + 3, my - 0.5 - j * 0.55 + s_ * 1.6)]), "#1a1820")
        for j in range(3):
            L.trazo(f"M{mx + 34 + j * 2},{my - 10 + j * 5} l5,{-1 + j}", "#ffffff", 1.4, op=0.8)
        return
    if accion == "arar":  # coa: palo con hoja de madera dura
        if vista in ("derecha", "izquierda"):
            ang = [-0.9, 0.75][k]
        else:
            ang = [0.0, 0.0][k]
        largo = 48
        punta = (mx + math.sin(ang) * largo, my + math.cos(ang) * largo) if not (vista == "abajo" and k == 0) else (mx, my - largo)
        if vista == "arriba":
            punta = (mx, my - largo) if k == 0 else (mx, my + largo * 0.6)
        if vista == "abajo" and k == 1:
            punta = (mx, my + largo * 0.6)
        if vista in ("derecha", "izquierda") and k == 0:
            punta = (mx - 26, my - 36)
        L.parte(capsula((mx, my), punta, 1.8, 1.8), "#8a5a32")
        L.parte(elipse(punta[0], punta[1], 3.6, 6, math.atan2(punta[1] - my, punta[0] - mx) + math.pi / 2), "#6a5a4a", lw=1)
    elif accion == "regar":  # jarra de barro inclinada con chorro
        L.parte(elipse(mx, my + 2, 8, 7), "#b05a32")
        L.parte(elipse(mx + 6, my - 3, 3, 2), "#8a4426", lw=0.8)
        for j in range(4):
            L.plano(elipse(mx + 9 + j * 1.5, my + 4 + j * 6 + k * 2, 1.4, 2.4), "#7ac0e8", linea=False, op=0.9)
    else:
        if k == 1:
            L.parte(elipse(mx, my - 4, 3.6, 9, 0.3), OCRE)
            L.plano(poli([(mx - 2, my + 4), (mx - 7, my + 12), (mx + 1, my + 6)]), "#7aa84a", linea=True, lw=0.8)


# ------------------------------------------------------------------ salida
DIRS = ["abajo", "izquierda", "derecha", "arriba"]


def huacal(L, x, y, w, h, k):
    """huacal de madera con mercancía, cargado a la espalda con mecapal"""
    y += -1 if k else 0
    for j, c in enumerate(("#e0a121", "#3a4fa0", "#c23a2c", "#e0a121", "#7aa84a")):
        L.parte(elipse(x - w / 2 + 5 + j * (w - 10) / 4, y - h / 2 - 2, 3.6, 4.2), c, lw=0.9)
    L.parte(poli([(x - w / 2, y - h / 2), (x + w / 2, y - h / 2), (x + w / 2, y + h / 2), (x - w / 2, y + h / 2)]), "#a8743e")
    for j in range(1, 4):
        L.trazo(f"M{x - w / 2},{y - h / 2 + j * h / 4} L{x + w / 2},{y - h / 2 + j * h / 4}", "#7a4e24", 1.0)
    for xx in (x - w / 2 + 3, x + w / 2 - 3):
        L.trazo(f"M{xx},{y - h / 2 - 1} L{xx},{y + h / 2 + 1}", "#6a4020", 2.0)


def dibujar_accion(pid, vista, accion, k):
    p = PERSONAJES[pid]
    L = Lienzo()
    po = Pose(p, "lado" if vista in ("derecha", "izquierda") else "frente", 0, accion)
    if accion == "cosechar" and k == 0:  # agachado
        po.bob += 10
        po.cab = (po.cab[0], po.cab[1] + 6)
        lat = vista in ("derecha", "izquierda")
        po.piernas = [((h[0], h[1] + 10), (r[0] + (6 if lat else (4 if r[0] > 64 else -4)), r[1] + 2), t, lv) for (h, r, t, lv) in po.piernas]
    aplicar_accion(po, "lado" if vista in ("derecha", "izquierda") else "frente", accion, k)
    sombra_suelo(L, po, vista)
    yh = po.hombro_y + po.bob
    if accion == "cargar" and vista == "abajo":
        huacal(L, po.cx, yh - 2, 40, 30, k)
    if accion == "cargar" and vista in ("derecha", "izquierda"):
        huacal(L, po.cx - 18, yh + 10, 22, 34, k)
    if vista == "abajo":
        frente(L, p, po, False)
        herramienta(L, po, vista, accion, k)
    elif vista == "arriba":
        herramienta(L, po, vista, accion, k)
        espalda(L, p, po)
        if accion == "cargar":
            huacal(L, po.cx, yh + 14, 38, 38, k)
    else:
        lado(L, p, po, accion)
        herramienta(L, po, vista, accion, k)
    tr = f"translate({W} 0) scale(-1 1)" if vista == "izquierda" else None
    return L.svg(tr)


def dibujar_dormir(pid, k):
    """acostado sobre un petate, ojos cerrados; k=1 respira"""
    s = dibujar(pid, "abajo", 0, accion="quieto", sin_objeto=True, expresion="feliz")
    cuerpo = s[s.index("</defs>") + 7:s.rindex("</svg>")]
    cab = s[:s.index("</defs>") + 7]
    esc = 0.72 + (0.012 if k else 0)
    petate = ('<rect x="2" y="114" width="124" height="52" rx="5" fill="#d8b56c" stroke="#8e6a32" stroke-width="1.6"/>'
              + "".join(f'<line x1="{2 + j * 8}" y1="114" x2="{2 + j * 8}" y2="166" stroke="#b8924c" stroke-width="1.4"/>' for j in range(1, 16))
              + '<rect x="94" y="126" width="28" height="28" rx="11" fill="#f4eee2" stroke="#b8a888" stroke-width="1.4"/>')
    grupo = f'<g transform="translate(8 140) rotate(90) scale({esc}) translate(-64 -190)">{cuerpo}</g>'
    manta = '<path d="M4,120 Q46,114 86,122 L86,160 Q46,166 4,160 Z" fill="#c23a2c" stroke="#8f2a1f" stroke-width="1.4"/>'
    rayas = "".join(f'<rect x="{12 + j * 15}" y="120" width="4" height="40" fill="#2f5fa6" opacity="0.85"/>' for j in range(5))
    z = "" if not k else '<text x="100" y="108" font-family="sans-serif" font-weight="bold" font-size="16" fill="#5a7ab0">z</text><text x="112" y="96" font-family="sans-serif" font-weight="bold" font-size="12" fill="#5a7ab0">z</text>'
    return cab + petate + grupo + manta + rayas + z + "</svg>"


EXPRESIONES = ["normal", "feliz", "triste", "enojado", "sorprendido", "apenado"]


def retrato(pid, expresion="normal"):
    """busto para diálogos: el cuadro de frente en grande, recortado del pecho para arriba"""
    s = dibujar(pid, "abajo", 0, accion="quieto", detalle=True, sin_objeto=True, expresion=expresion)
    vb = "36 5 56 56" if ESTILO == "anime" else "24 20 80 80"
    s = s.replace(f'width="{W}" height="{Hh}" viewBox="0 0 {W} {Hh}"', f'width="400" height="400" viewBox="{vb}"')
    return s


def generar(out):
    for pid in PERSONAJES:
        d = os.path.join(out, pid)
        os.makedirs(d, exist_ok=True)
        for v in DIRS:
            for f in range(4):
                open(os.path.join(d, f"caminar_{v}_{f}.svg"), "w").write(dibujar(pid, v, f))
            open(os.path.join(d, f"quieto_{v}.svg"), "w").write(dibujar(pid, v, 0, accion="quieto"))
        open(os.path.join(d, "retrato.svg"), "w").write(retrato(pid))
        if ESTILO == "acogedor":
            for ex in EXPRESIONES[1:]:
                open(os.path.join(d, f"retrato_{ex}.svg"), "w").write(retrato(pid, ex))
    d = os.path.join(out, "player")
    acciones = ("arar", "regar", "cosechar") + (("saludar", "comer", "pescar", "talar", "picar", "cargar") if ESTILO == "acogedor" else ())
    for acc in acciones:
        for v in DIRS:
            for k in range(2):
                open(os.path.join(d, f"{acc}_{v}_{k}.svg"), "w").write(dibujar_accion("player", v, acc, k))
    if ESTILO == "acogedor":
        for k in range(2):
            open(os.path.join(d, f"dormir_{k}.svg"), "w").write(dibujar_dormir("player", k))


def usar_estilo(nombre):
    global ESTILO, CABEZA, LARGO, FILTRO
    ESTILO = nombre
    if nombre == "acogedor":
        CABEZA, LARGO, FILTRO = 1.55, 0.62, ' filter="url(#suave)"'


if __name__ == "__main__":
    if len(sys.argv) > 2:
        usar_estilo(sys.argv[2])
    generar(sys.argv[1])
    print("listo")
