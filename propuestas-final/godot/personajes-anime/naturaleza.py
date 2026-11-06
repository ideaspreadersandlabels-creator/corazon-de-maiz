"""Naturaleza redibujada en estilo ACOGEDOR, con 3 cuadros de viento para lo que se mece.
Mismos nombres y tamaños que naturaleza/ del paquete. Coordenadas a la mitad del PNG.
Salida: <nombre>.svg (cuadro 0), <nombre>_viento_1.svg, <nombre>_viento_2.svg
Uso: python3 naturaleza.py <salida_dir>
"""
import math, os, random, sys

CAFE = "#6a3e2c"


def osc(c, f=0.75):
    c = c.lstrip("#")
    r, g, b = (int(c[i:i + 2], 16) for i in (0, 2, 4))
    return "#%02x%02x%02x" % (int(r * f), int(g * f), int(b * f))


def svg(w, h, cuerpo):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w * 2}" height="{h * 2}" viewBox="0 0 {w} {h}">{cuerpo}</svg>'


def sombra(cx, y, rx):
    return f'<ellipse cx="{cx}" cy="{y}" rx="{rx}" ry="{rx * 0.22:.1f}" fill="#000" opacity="0.16"/>'


def copa(circulos, base, sombra_c, luz, linea=None, ancho=1.6):
    """copa esponjosa: un contorno que une todos los círculos, sombra abajo-derecha y brillos arriba-izquierda"""
    linea = linea or osc(base, 0.55)
    o = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r + ancho:.1f}" fill="{linea}"/>' for x, y, r in circulos)
    o += "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{sombra_c}"/>' for x, y, r in circulos)
    o += "".join(f'<circle cx="{x - r * 0.18:.1f}" cy="{y - r * 0.2:.1f}" r="{r * 0.82:.1f}" fill="{base}"/>' for x, y, r in circulos)
    o += "".join(f'<ellipse cx="{x - r * 0.38:.1f}" cy="{y - r * 0.42:.1f}" rx="{r * 0.32:.1f}" ry="{r * 0.2:.1f}" fill="{luz}" opacity="0.9"/>' for x, y, r in circulos[:4])
    return o


def tronco(x, y0, y1, w, col="#9a6438"):
    return (f'<path d="M{x - w / 2 - 2},{y1} Q{x - w / 2},{(y0 + y1) / 2} {x - w / 2 + 0.6},{y0} L{x + w / 2 - 0.6},{y0} '
            f'Q{x + w / 2},{(y0 + y1) / 2} {x + w / 2 + 2},{y1} Z" fill="{col}" stroke="{osc(col, 0.55)}" stroke-width="1.4" stroke-linejoin="round"/>'
            f'<path d="M{x - 1},{y0 + 4} L{x - 1.4},{y1 - 3}" stroke="{osc(col, 0.8)}" stroke-width="1" />')


def viento(contenido, base_x, base_y, k, fuerza=1.0):
    """k=0 quieto, 1 se inclina a la derecha, 2 un poquito a la izquierda"""
    ang = [0, 4 * fuerza, -2.5 * fuerza][k]
    dx = [0, 1.2 * fuerza, -0.8 * fuerza][k]
    return f'<g transform="translate({dx:.2f} 0) translate({base_x} {base_y}) skewX({ang:.2f}) translate({-base_x} {-base_y})">{contenido}</g>'


ESTACION = {
    "verano": ("#6ab04a", "#4a8a3c", "#a6d878"),
    "primavera": ("#78b850", "#589a40", "#b0dc84"),
    "otono": ("#e8963a", "#c06a2a", "#f8c070"),
    "invierno": ("#9aae7a", "#7a8a62", "#d8e0c8"),
}


def arbol(est, var, k):
    W, H = 64, 80
    base, som, luz = ESTACION[est]
    r = random.Random(var * 7 + 1)
    o = sombra(32, 76, 18) + tronco(32, 40, 76, 7)
    if var == 0:
        cs = [(32, 22, 15), (18, 32, 11), (46, 32, 11), (25, 40, 10), (40, 41, 10), (32, 34, 12)]
    else:
        cs = [(32, 16, 11), (24, 26, 11), (40, 26, 11), (32, 30, 12), (22, 40, 9), (42, 40, 9), (32, 44, 9)]
    c = copa(cs, base, som, luz)
    if est == "invierno":  # ramitas que asoman y escarcha
        c = (f'<path d="M32,44 L22,26 M32,40 L44,22 M32,36 L32,16" stroke="#8a5a32" stroke-width="2" stroke-linecap="round"/>'
             + copa([(x, y, rr * 0.75) for x, y, rr in cs], base, som, luz)
             + "".join(f'<ellipse cx="{x - 2:.1f}" cy="{y - rr * 0.6:.1f}" rx="{rr * 0.4:.1f}" ry="{rr * 0.16:.1f}" fill="#ffffff"/>' for x, y, rr in cs[:4]))
    if est == "primavera":
        for _ in range(12):
            x, y = r.uniform(16, 48), r.uniform(12, 46)
            c += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.8" fill="#f8b0c0" stroke="#d87a90" stroke-width="0.5"/><circle cx="{x:.1f}" cy="{y:.1f}" r="0.6" fill="#ffe080"/>'
    o += viento(c, 32, 46, k)
    if est == "otono":
        for _ in range(3):
            x = r.uniform(14, 50)
            o += f'<ellipse cx="{x:.1f}" cy="{r.uniform(72, 77):.1f}" rx="2.2" ry="1.2" fill="#e8903a" stroke="#a85a20" stroke-width="0.5"/>'
    return svg(W, H, o)


def frutal(est, k):
    W, H = 48, 62
    base, som, luz = ESTACION[est]
    o = sombra(24, 58, 14) + tronco(24, 32, 58, 5.5)
    cs = [(24, 18, 11), (14, 26, 8), (34, 26, 8), (24, 28, 9), (18, 32, 7), (30, 32, 7)]
    c = copa(cs if est != "invierno" else [(x, y, rr * 0.8) for x, y, rr in cs], base, som, luz)
    r = random.Random(3)
    puntos = [(r.uniform(12, 36), r.uniform(12, 34)) for _ in range(9)]
    if est == "primavera":
        c += "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.9" fill="#ffffff" stroke="#d8c8c8" stroke-width="0.5"/>' for x, y in puntos)
    elif est == "verano":
        c += "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2" fill="#a8c84a" stroke="#6a8a2a" stroke-width="0.6"/>' for x, y in puntos)
    elif est == "otono":
        c += "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="2.3" fill="#d8402a" stroke="#8a2a1a" stroke-width="0.6"/><circle cx="{x - 0.7:.1f}" cy="{y - 0.8:.1f}" r="0.6" fill="#fff" opacity="0.7"/>' for x, y in puntos)
    o += viento(c, 24, 36, k, 0.9)
    return svg(W, H, o)


def arbusto(est, k):
    W, H = 48, 40
    base, som, luz = ESTACION[est]
    cs = [(24, 22, 10), (13, 28, 8), (35, 28, 8), (19, 31, 7), (29, 31, 7)]
    c = copa(cs, base, som, luz)
    if est == "primavera":
        c += "".join(f'<circle cx="{x}" cy="{y}" r="1.8" fill="#f8d040" stroke="#c89a20" stroke-width="0.5"/>' for x, y in ((16, 22), (28, 18), (34, 26), (22, 30)))
    if est == "otono":
        c += "".join(f'<circle cx="{x}" cy="{y}" r="1.7" fill="#c8302a"/>' for x, y in ((18, 24), (30, 22), (26, 30)))
    return svg(W, H, sombra(24, 37, 16) + viento(c, 24, 37, k, 0.6))


def zacate(est, var, k):
    W, H = 32, 32
    cols = {"verano": ("#6aa84a", "#4a8a3a"), "primavera": ("#7ab850", "#5a9a3a"), "otono": ("#c8a84a", "#a8883a"), "invierno": ("#c8b878", "#a89858")}[est]
    r = random.Random(var + 11)
    o = sombra(16, 29, 9)
    hojas = ""
    n = [5, 7, 6][var]
    for i in range(n):
        x = 9 + i * (14 / max(1, n - 1)) + r.uniform(-1, 1)
        h = r.uniform(12, 20)
        lado = (i - n / 2) * 1.6
        hojas += f'<path d="M{x - 1.2:.1f},29 Q{x + lado * 0.5:.1f},{29 - h * 0.6:.1f} {x + lado:.1f},{29 - h:.1f} Q{x + lado * 0.3 + 1:.1f},{29 - h * 0.5:.1f} {x + 1.4:.1f},29 Z" fill="{cols[i % 2]}" stroke="{osc(cols[1], 0.6)}" stroke-width="0.8"/>'
    if est == "primavera" and var == 1:
        hojas += '<circle cx="12" cy="12" r="2" fill="#f8b0c0"/><circle cx="21" cy="14" r="1.8" fill="#f8e070"/>'
    if est == "otono" and var == 2:
        hojas += '<path d="M16,10 l0,-4 m-2,2 l4,0" stroke="#e8d0a0" stroke-width="1.6"/>'
    return svg(W, H, o + viento(hojas, 16, 29, k, 2.2))


def oyamel(nieve, k):
    W, H = 48, 72
    o = sombra(24, 68, 13) + tronco(24, 56, 68, 5)
    c = ""
    for i, (y, w) in enumerate(((54, 20), (42, 17), (30, 14), (18, 10))):
        c += f'<path d="M{24 - w},{y} Q24,{y - 18} {24 + w},{y} Q24,{y + 4} {24 - w},{y} Z" fill="#3e8a4a" stroke="#2a5a32" stroke-width="1.4" stroke-linejoin="round"/>'
        c += f'<path d="M{24 - w * 0.6},{y - 4} Q{24 - w * 0.3},{y - 9} 24,{y - 11}" stroke="#6ab06a" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
        if nieve:
            c += f'<path d="M{24 - w * 0.8},{y - 3} Q24,{y - 16} {24 + w * 0.8},{y - 3} Q{24 + w * 0.3},{y - 6} 24,{y - 4} Q{24 - w * 0.3},{y - 6} {24 - w * 0.8},{y - 3} Z" fill="#ffffff" stroke="#c8d4e8" stroke-width="0.8"/>'
    c += '<path d="M24,1 l1.4,3 l3,0.4 l-2.4,2 l0.8,3 l-2.8,-1.6 l-2.8,1.6 l0.8,-3 l-2.4,-2 l3,-0.4 Z" fill="#f8d040" stroke="#c89a20" stroke-width="0.6"/>' if False else ""
    return svg(W, H, o + viento(c, 24, 58, k, 0.7))


def palma(k):
    W, H = 64, 88
    o = sombra(30, 84, 14)
    o += f'<path d="M28,84 Q24,56 34,26 L38,27 Q30,56 34,84 Z" fill="#b08050" stroke="#6a4a28" stroke-width="1.4"/>'
    for y in range(34, 82, 6):
        o += f'<path d="M{29 + (84 - y) * 0.12:.1f},{y} l6,-1" stroke="#7a5430" stroke-width="1.2"/>'
    hojas = ""
    for a in (-160, -125, -95, -65, -30, 5):
        rad = math.radians(a)
        x1, y1 = 36 + math.cos(rad) * 26, 26 + math.sin(rad) * 16 + 6
        hojas += f'<path d="M36,26 Q{36 + math.cos(rad) * 14:.1f},{26 + math.sin(rad) * 14 - 4:.1f} {x1:.1f},{y1:.1f} Q{36 + math.cos(rad) * 12:.1f},{26 + math.sin(rad) * 8:.1f} 36,28 Z" fill="#4aa04a" stroke="#2a6a2a" stroke-width="1.2"/>'
    hojas += '<circle cx="34" cy="29" r="2.4" fill="#8a6a3a"/><circle cx="38" cy="29.5" r="2.2" fill="#7a5a2a"/>'
    return svg(W, H, o + viento(hojas, 36, 28, k, 1.4))


def cactus(tipo):
    W, H = 48, 56
    o = sombra(24, 53, 12)
    v, vo = "#5aa060", "#3a7a44"
    if tipo == "organo":
        for x, h in ((16, 30), (24, 44), (32, 34)):
            o += f'<rect x="{x - 4}" y="{52 - h}" width="8" height="{h}" rx="4" fill="{v}" stroke="{vo}" stroke-width="1.4"/><line x1="{x}" y1="{55 - h}" x2="{x}" y2="50" stroke="{vo}" stroke-width="0.8"/>'
        o += '<circle cx="24" cy="8" r="2.6" fill="#f87a90" stroke="#c8506a" stroke-width="0.6"/>'
    elif tipo == "nopal":
        for x, y, rx, ry, a in ((24, 40, 9, 12, 0), (15, 26, 7, 9, -25), (33, 24, 7, 9, 20), (24, 14, 6, 8, 5)):
            o += f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{v}" stroke="{vo}" stroke-width="1.4" transform="rotate({a} {x} {y})"/>'
        for x, y in ((12, 17), (37, 15), (25, 6), (30, 30)):
            o += f'<ellipse cx="{x}" cy="{y}" rx="2.4" ry="3" fill="#d8406a" stroke="#8a2a3a" stroke-width="0.6"/>'
    else:  # biznaga
        o += f'<ellipse cx="24" cy="40" rx="13" ry="12" fill="{v}" stroke="{vo}" stroke-width="1.4"/>'
        for dx in (-8, -4, 0, 4, 8):
            o += f'<path d="M{24 + dx},{29} Q{24 + dx * 1.3},40 {24 + dx},{51}" stroke="{vo}" stroke-width="0.8" fill="none"/>'
        o += '<circle cx="24" cy="28" r="3.6" fill="#f8d040" stroke="#c89a20" stroke-width="0.8"/>'
    o += '<ellipse cx="18" cy="30" rx="2" ry="4" fill="#ffffff" opacity="0.3"/>'
    return svg(W, H, o)


def piedra(tipo):
    W, H = 40, 32
    o = sombra(20, 29, 15)
    if tipo == "grupo":
        for x, y, rx, ry, c in ((14, 22, 9, 7, "#b8b0a4"), (26, 23, 8, 6, "#a8a094"), (20, 16, 7, 6, "#c8c0b4")):
            o += f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{c}" stroke="#6a645a" stroke-width="1.4"/><ellipse cx="{x - 2}" cy="{y - 2}" rx="{rx * 0.4}" ry="{ry * 0.25}" fill="#fff" opacity="0.5"/>'
    elif tipo == "laja":
        o += '<path d="M5,24 L10,14 L30,12 L36,22 L30,27 L9,28 Z" fill="#b8b0a4" stroke="#6a645a" stroke-width="1.4" stroke-linejoin="round"/><path d="M10,15 L30,13 L33,18 L12,19 Z" fill="#d0c8bc"/>'
        o += '<path d="M14,22 q4,-2 8,0" stroke="#7aa84a" stroke-width="1.6" fill="none"/>'
    else:
        o += '<path d="M4,28 L8,10 L18,4 L30,8 L36,20 L34,28 Z" fill="#a8a094" stroke="#5a544a" stroke-width="1.6" stroke-linejoin="round"/><path d="M9,11 L18,5 L28,9 L20,14 Z" fill="#c8c0b4"/>'
        o += '<path d="M8,28 q2,-6 4,0 M28,28 q2,-5 4,0" stroke="#5a9a3a" stroke-width="1.6" fill="none"/>'
    return svg(W, H, o)


def todo():
    P = {}
    for est in ESTACION:
        for var in (0, 1):
            for k in range(3):
                P[f"arbol_{est}_{var}" + ("" if k == 0 else f"_viento_{k}")] = arbol(est, var, k)
        for k in range(3):
            suf = "" if k == 0 else f"_viento_{k}"
            P[f"frutal_{est}{suf}"] = frutal(est, k)
            P[f"arbusto_{est}{suf}"] = arbusto(est, k)
            for var in range(3):
                P[f"zacate_{est}_{var}{suf}"] = zacate(est, var, k)
    for k in range(3):
        suf = "" if k == 0 else f"_viento_{k}"
        P[f"oyamel{suf}"] = oyamel(False, k)
        P[f"oyamel_nieve{suf}"] = oyamel(True, k)
        P[f"palma{suf}"] = palma(k)
    for t in ("organo", "nopal", "biznaga"):
        P[f"cactus_{t}"] = cactus(t)
    for t in ("grupo", "laja", "penasco"):
        P[f"piedra_{t}"] = piedra(t)
    return P


if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for n, s in todo().items():
        open(os.path.join(out, n + ".svg"), "w").write(s)
    print("listo", len(todo()))
