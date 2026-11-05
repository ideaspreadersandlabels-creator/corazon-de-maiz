"""Muestras de estilos nuevos para los personajes (campesino y Xóchitl).
Un solo modelo de personaje, dibujado con cuatro estilos distintos:
  acogedor  - cabezón tierno, sombreado suave, contorno del mismo color
  caricatura - contorno grueso oscuro, una sombra plana, 4 cabezas
  anime     - proporciones más reales, línea fina, ojos con iris
  pixel     - se dibuja chico sin suavizado y se le pone contorno de 1 px (en vista.js)
Uso: python3 estilos.py <salida_dir>
"""
import sys, os

PIEL, PIEL_S = "#a86b45", "#87512f"
PELO = "#1e1612"
BLANCO, BLANCO_S = "#f6efe0", "#d9cdb4"
ROJO, ROJO_S = "#c0392b", "#8f2a1f"
AZUL, AZUL_S = "#2f5fa6", "#21447a"
INDIGO, INDIGO_S = "#2e3350", "#1f2238"
CUERO, CUERO_S = "#8a5a32", "#6a4224"
MADERA = "#9a6a3a"
OCRE = "#e0a121"
CEMPA = "#f08a1c"

ESTILOS = {
    "acogedor": dict(k=0.40, sw=0.62, hw=0.55, linea="auto", ancho=2.4, sombra="degradado", ojos="tierno"),
    "caricatura": dict(k=0.28, sw=0.95, hw=0.80, linea="#24160d", ancho=4.0, sombra="plana", ojos="caricatura"),
    "anime": dict(k=0.15, sw=1.75, hw=1.45, linea="#3a2418", ancho=1.4, sombra="degradado", ojos="anime"),
    "pixel": dict(k=0.36, sw=0.70, hw=0.62, linea=None, ancho=0, sombra="plana", ojos="pixel"),
}


def oscuro(c, f=0.72):
    c = c.lstrip("#")
    r, g, b = (int(c[i:i + 2], 16) for i in (0, 2, 4))
    return "#%02x%02x%02x" % (int(r * f), int(g * f), int(b * f))


class Dib:
    def __init__(self, est):
        self.e = est
        self.o = []
        self.defs = []
        self.n = 0

    def nid(self):
        self.n += 1
        return f"i{self.n}"

    def parte(self, d, fill, sombra=None, linea=True):
        """dibuja una figura con relleno, sombra según el estilo y contorno"""
        e = self.e
        sombra = sombra or oscuro(fill)
        if e["sombra"] == "degradado":
            g = self.nid()
            self.defs.append(f'<linearGradient id="{g}" x1="0" y1="0" x2="1" y2="0.35">'
                             f'<stop offset="0.35" stop-color="{fill}"/><stop offset="1" stop-color="{sombra}"/></linearGradient>')
            relleno = f"url(#{g})"
        else:
            relleno = fill
        st = ""
        if linea and e["linea"]:
            col = oscuro(fill, 0.55) if e["linea"] == "auto" else e["linea"]
            st = f' stroke="{col}" stroke-width="{e["ancho"]}" stroke-linejoin="round" stroke-linecap="round"'
        self.o.append(f'<path d="{d}" fill="{relleno}"{st}/>')
        if e["sombra"] == "plana" and e["linea"]:
            c = self.nid()
            self.defs.append(f'<clipPath id="{c}"><path d="{d}"/></clipPath>')
            self.o.append(f'<g clip-path="url(#{c})"><rect x="{self._cx + 4}" y="0" width="200" height="400" fill="{sombra}" opacity="0.55"/></g>')
            if st:
                self.o.append(f'<path d="{d}" fill="none"{st}/>')

    def raw(self, s):
        self.o.append(s)


def rect_d(x, y, w, h, r=0):
    r = min(r, w / 2, h / 2)
    return (f"M{x + r},{y} H{x + w - r} Q{x + w},{y} {x + w},{y + r} V{y + h - r} Q{x + w},{y + h} {x + w - r},{y + h} "
            f"H{x + r} Q{x},{y + h} {x},{y + h - r} V{y + r} Q{x},{y} {x + r},{y} Z")


def elipse_d(cx, cy, rx, ry):
    return f"M{cx - rx},{cy} A{rx},{ry} 0 1 0 {cx + rx},{cy} A{rx},{ry} 0 1 0 {cx - rx},{cy} Z"


def personaje(nombre_estilo, mujer):
    e = ESTILOS[nombre_estilo]
    D = Dib(e)
    cx = 100
    D._cx = cx
    H, top = 280, 10
    rh = e["k"] * H / 2
    hy = top + rh
    cuello = top + 2 * rh - 3
    B = 290 - cuello
    T = 0.42 * B
    cadera = cuello + T
    pies = 290
    sw = rh * e["sw"] if nombre_estilo != "anime" else rh * e["sw"]
    hw = rh * e["hw"] * (1.12 if mujer else 1.0)
    aw = max(5.0, sw * 0.30)
    lw = hw * 0.44

    # trenzas (detrás)
    if mujer:
        for s in (-1, 1):
            x = cx + s * rh * 0.82
            D.parte(rect_d(x - rh * 0.17, hy, rh * 0.34, cadera - hy + 6, rh * 0.17), PELO, "#000", linea=True)
    # capa (detrás) del campesino
    if not mujer:
        capa = f"M{cx - sw - 2},{cuello + 6} L{cx - sw * 1.35},{cadera + (pies - cadera) * 0.55} L{cx + sw * 1.35},{cadera + (pies - cadera) * 0.55} L{cx + sw + 2},{cuello + 6} Z"
        D.parte(capa, BLANCO, BLANCO_S)
        y = cadera + (pies - cadera) * 0.55
        D.parte(f"M{cx - sw * 1.35},{y} L{cx + sw * 1.35},{y} L{cx + sw * 1.32},{y - 7} L{cx - sw * 1.32},{y - 7} Z", ROJO, ROJO_S)
    # piernas y sandalias
    for s in (-1, 1):
        x = cx + s * hw * 0.48
        D.parte(rect_d(x - lw / 2, cadera - 4, lw, pies - cadera - 2, lw * 0.4), PIEL, PIEL_S)
        D.parte(rect_d(x - lw * 0.62, pies - 7, lw * 1.24, 8, 3), CUERO, CUERO_S)
        D.raw(f'<line x1="{x - lw / 2}" y1="{pies - 13}" x2="{x + lw / 2}" y2="{pies - 9}" stroke="{CUERO_S}" stroke-width="2"/>')
    if mujer:
        # falda (cueitl) añil con faja roja
        falda = f"M{cx - hw},{cadera - 6} L{cx - hw * 1.18},{pies - 10} Q{cx},{pies - 4} {cx + hw * 1.18},{pies - 10} L{cx + hw},{cadera - 6} Z"
        D.parte(falda, INDIGO, INDIGO_S)
        y = pies - 18
        D.parte(f"M{cx - hw * 1.14},{y} Q{cx},{y + 5} {cx + hw * 1.14},{y} L{cx + hw * 1.16},{y + 5} Q{cx},{y + 10} {cx - hw * 1.16},{y + 5} Z", AZUL, AZUL_S)
    else:
        # maxtlatl (taparrabo) con su caída roja al frente
        D.parte(rect_d(cx - hw, cadera - 8, hw * 2, 14, 4), BLANCO, BLANCO_S)
        D.parte(f"M{cx - hw * 0.35},{cadera + 4} L{cx + hw * 0.35},{cadera + 4} L{cx + hw * 0.3},{cadera + (pies - cadera) * 0.38} L{cx - hw * 0.3},{cadera + (pies - cadera) * 0.38} Z", ROJO, ROJO_S)
    # torso: camisa o huipil
    if mujer:
        bajo = cadera + (pies - cadera) * 0.18
        torso = f"M{cx - sw},{cuello + 4} Q{cx},{cuello - 2} {cx + sw},{cuello + 4} L{cx + hw * 1.15},{bajo} L{cx - hw * 1.15},{bajo} Z"
        D.parte(torso, BLANCO, BLANCO_S)
        for k, (c, cs) in enumerate(((ROJO, ROJO_S), (AZUL, AZUL_S))):
            y = bajo - 10 - k * 7
            D.parte(f"M{cx - hw * 1.12 + k},{y} L{cx + hw * 1.12 - k},{y} L{cx + hw * 1.1 - k},{y + 5} L{cx - hw * 1.1 + k},{y + 5} Z", c, cs, linea=False)
        # cuello bordado
        D.parte(f"M{cx - rh * 0.5},{cuello + 2} Q{cx},{cuello + rh * 0.55 + 6} {cx + rh * 0.5},{cuello + 2} Z", ROJO, ROJO_S)
    else:
        torso = f"M{cx - sw},{cuello + 4} Q{cx},{cuello - 2} {cx + sw},{cuello + 4} L{cx + hw},{cadera - 4} L{cx - hw},{cadera - 4} Z"
        D.parte(torso, BLANCO, BLANCO_S)
        # nudo de la tilma en el hombro y borde rojo
        D.parte(elipse_d(cx + sw * 0.75, cuello + 7, aw * 0.7, aw * 0.55), ROJO, ROJO_S)
        D.parte(f"M{cx + sw * 0.75},{cuello + 7} L{cx - sw * 0.9},{cuello + T * 0.55} L{cx - sw * 0.9},{cuello + T * 0.55 + 6} L{cx + sw * 0.75},{cuello + 13} Z", ROJO, ROJO_S)
    # brazos
    largo = T * 1.0
    for s in (-1, 1):
        x = cx + s * (sw + aw * 0.1)
        D.parte(rect_d(x - aw / 2, cuello + 6, aw, largo, aw / 2), PIEL, PIEL_S)
        D.parte(rect_d(x - aw / 2 - 1, cuello + 4, aw + 2, largo * 0.32, aw / 2), BLANCO, BLANCO_S)
        D.parte(elipse_d(x, cuello + 6 + largo, aw * 0.62, aw * 0.58), PIEL, PIEL_S)
    mano_i = (cx - (sw + aw * 0.1), cuello + 6 + largo)
    mano_d = (cx + (sw + aw * 0.1), cuello + 6 + largo)
    # accesorios
    if mujer:
        bx, by = mano_d
        D.parte(f"M{bx - rh * 0.55 - 6},{by - 4} L{bx + rh * 0.55 + 6},{by - 4} L{bx + rh * 0.45 + 4},{by + rh * 0.5 + 8} L{bx - rh * 0.45 - 4},{by + rh * 0.5 + 8} Z", "#c79a52", "#8e6a32")
        for k, c in enumerate((OCRE, "#3a4fa0", ROJO, OCRE)):
            D.parte(elipse_d(bx - rh * 0.33 - 3 + k * (rh * 0.22 + 2), by - 6, rh * 0.12 + 2, rh * 0.18 + 3), c, oscuro(c))
    else:
        x, y = mano_i
        D.parte(rect_d(x - 2.5, y - T * 0.9, 5, (pies - y) + T * 0.9 - 4, 2), MADERA, oscuro(MADERA))
        D.parte(f"M{x - 6},{pies - 18} L{x + 6},{pies - 18} L{x + 2},{pies - 4} L{x - 2},{pies - 4} Z", "#7a7266", "#5a544a")
        D.parte(elipse_d(x, y, aw * 0.62, aw * 0.58), PIEL, PIEL_S)
        bx, by = mano_d
        D.parte(f"M{bx - 8},{by - 6} L{bx + 8},{by - 6} L{bx + 10},{by + 16} Q{bx},{by + 22} {bx - 10},{by + 16} Z", "#c9b07a", "#9a8050")
        D.parte(elipse_d(bx, by - 7, 5, 3), OCRE, oscuro(OCRE))
    # cabeza
    D.parte(rect_d(cx - rh * 0.22, cuello - 6, rh * 0.44, 12, 3), PIEL, PIEL_S)
    for s in (-1, 1):
        D.parte(elipse_d(cx + s * rh * 0.98, hy + rh * 0.08, rh * 0.16, rh * 0.22), PIEL, PIEL_S)
    D.parte(elipse_d(cx, hy, rh * 0.95, rh * (0.98 if nombre_estilo != "anime" else 1.1)), PIEL, PIEL_S)
    # pelo
    pelo = (f"M{cx - rh * 0.98},{hy + rh * 0.15} Q{cx - rh * 1.05},{hy - rh * 1.08} {cx},{hy - rh * 1.02} "
            f"Q{cx + rh * 1.05},{hy - rh * 1.08} {cx + rh * 0.98},{hy + rh * 0.15} "
            f"Q{cx + rh * 0.8},{hy - rh * 0.35} {cx + rh * 0.2},{hy - rh * 0.48} Q{cx},{hy - rh * 0.3} {cx - rh * 0.25},{hy - rh * 0.5} "
            f"Q{cx - rh * 0.8},{hy - rh * 0.35} {cx - rh * 0.98},{hy + rh * 0.15} Z")
    D.parte(pelo, PELO, "#000")
    if mujer:
        # cempasúchil y listones
        D.parte(elipse_d(cx + rh * 0.72, hy - rh * 0.62, rh * 0.22 + 1, rh * 0.22 + 1), CEMPA, oscuro(CEMPA))
        D.parte(elipse_d(cx + rh * 0.72, hy - rh * 0.62, rh * 0.09 + 1, rh * 0.09 + 1), OCRE, oscuro(OCRE), linea=False)
        for s in (-1, 1):
            D.parte(rect_d(cx + s * rh * 0.82 - rh * 0.2, cadera - 4, rh * 0.4, 6, 2), ROJO, ROJO_S)
    else:
        D.parte(rect_d(cx - rh * 0.98, hy - rh * 0.6, rh * 1.96, rh * 0.2 + 2, 2), ROJO, ROJO_S)
    # cara
    ojos(D, e["ojos"], cx, hy, rh, mujer)
    return D


def ojos(D, tipo, cx, hy, rh, mujer):
    ey = hy + rh * 0.12
    dx = rh * 0.38
    if tipo == "tierno":
        for s in (-1, 1):
            x = cx + s * dx
            D.raw(f'<ellipse cx="{x}" cy="{ey}" rx="{rh * 0.13}" ry="{rh * 0.19}" fill="#24160d"/>')
            D.raw(f'<circle cx="{x + rh * 0.04}" cy="{ey - rh * 0.07}" r="{rh * 0.055}" fill="#fff"/>')
            D.raw(f'<circle cx="{x - rh * 0.04}" cy="{ey + rh * 0.07}" r="{rh * 0.025}" fill="#fff"/>')
            D.raw(f'<ellipse cx="{x + s * rh * 0.12}" cy="{ey + rh * 0.3}" rx="{rh * 0.14}" ry="{rh * 0.07}" fill="#e2706a" opacity="0.55"/>')
            D.raw(f'<path d="M{x - rh * 0.1},{ey - rh * 0.3} q{rh * 0.1},-{rh * 0.06} {rh * 0.2},0" stroke="#24160d" stroke-width="2" fill="none" stroke-linecap="round"/>')
        D.raw(f'<path d="M{cx - rh * 0.12},{ey + rh * 0.36} q{rh * 0.12},{rh * 0.12} {rh * 0.24},0" stroke="#5a2a1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>')
    elif tipo == "caricatura":
        for s in (-1, 1):
            x = cx + s * dx
            D.raw(f'<ellipse cx="{x}" cy="{ey}" rx="{rh * 0.16}" ry="{rh * 0.2}" fill="#fff" stroke="#24160d" stroke-width="2.5"/>')
            D.raw(f'<ellipse cx="{x + s * -rh * 0.03}" cy="{ey + rh * 0.03}" rx="{rh * 0.08}" ry="{rh * 0.12}" fill="#24160d"/>')
            D.raw(f'<circle cx="{x}" cy="{ey - rh * 0.03}" r="{rh * 0.03}" fill="#fff"/>')
            D.raw(f'<path d="M{x - rh * 0.16},{ey - rh * 0.3 + (0 if s < 0 else 0)} q{rh * 0.16},-{rh * 0.1} {rh * 0.3},{rh * 0.02}" stroke="#24160d" stroke-width="{rh * 0.07}" fill="none" stroke-linecap="round"/>')
        D.raw(f'<path d="M{cx - rh * 0.22},{ey + rh * 0.34} q{rh * 0.22},{rh * 0.22} {rh * 0.44},0 Z" fill="#7a2a20" stroke="#24160d" stroke-width="2.5" stroke-linejoin="round"/>')
    elif tipo == "anime":
        for s in (-1, 1):
            x = cx + s * dx
            D.raw(f'<path d="M{x - rh * 0.2},{ey} q{rh * 0.2},-{rh * 0.2} {rh * 0.4},0 q-{rh * 0.2},{rh * 0.14} -{rh * 0.4},0 Z" fill="#fff" stroke="#3a2418" stroke-width="1"/>')
            D.raw(f'<circle cx="{x}" cy="{ey - rh * 0.02}" r="{rh * 0.1}" fill="#5a3418"/>')
            D.raw(f'<circle cx="{x}" cy="{ey - rh * 0.02}" r="{rh * 0.05}" fill="#1a0e08"/>')
            D.raw(f'<circle cx="{x + rh * 0.04}" cy="{ey - rh * 0.06}" r="{rh * 0.03}" fill="#fff"/>')
            D.raw(f'<path d="M{x - rh * 0.22},{ey - rh * 0.02} q{rh * 0.22},-{rh * 0.24} {rh * 0.44},-{rh * 0.02}" stroke="#1a0e08" stroke-width="2" fill="none"/>')
            D.raw(f'<path d="M{x - rh * 0.18},{ey - rh * 0.3} q{rh * 0.18},-{rh * 0.08} {rh * 0.36},0" stroke="#1e1612" stroke-width="1.6" fill="none"/>')
        D.raw(f'<path d="M{cx + rh * 0.02},{ey + rh * 0.18} l-{rh * 0.05},{rh * 0.12} l{rh * 0.06},0" stroke="#7a4a30" stroke-width="1.1" fill="none"/>')
        D.raw(f'<path d="M{cx - rh * 0.12},{ey + rh * 0.48} q{rh * 0.12},{rh * 0.06} {rh * 0.24},0" stroke="#6a2a1a" stroke-width="1.4" fill="none" stroke-linecap="round"/>')
    else:  # pixel: ojos de 2 px que se ven bien al achicar
        for s in (-1, 1):
            x = cx + s * dx
            D.raw(f'<rect x="{x - rh * 0.09}" y="{ey - rh * 0.14}" width="{rh * 0.18}" height="{rh * 0.3}" fill="#1a0e08"/>')
            D.raw(f'<rect x="{x - rh * 0.09}" y="{ey - rh * 0.14}" width="{rh * 0.09}" height="{rh * 0.1}" fill="#fff"/>')
        D.raw(f'<rect x="{cx - rh * 0.15}" y="{ey + rh * 0.36}" width="{rh * 0.3}" height="{rh * 0.07}" fill="#5a2a1a"/>')


if __name__ == "__main__":
    d = sys.argv[1]
    os.makedirs(d, exist_ok=True)
    for n in ESTILOS:
        # ids únicos: renombrar los de la mujer
        h, m = personaje(n, False), personaje(n, True)
        def ren(D, p):
            defs = "".join(D.defs).replace('id="i', f'id="{p}')
            body = "".join(D.o).replace("url(#i", f"url(#{p}")
            return defs, body
        dh, bh = ren(h, "h")
        dm, bm = ren(m, "m")
        rend = ' shape-rendering="crispEdges"' if n == "pixel" else ""
        open(os.path.join(d, n + ".svg"), "w").write(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"{rend}><defs>{dh}{dm}</defs>'
            f'{bh}<g transform="translate(200 0)">{bm}</g></svg>')
    print("listo")
