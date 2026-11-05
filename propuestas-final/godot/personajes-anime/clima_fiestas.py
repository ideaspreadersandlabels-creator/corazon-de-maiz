"""Clima, ambiente y fiestas en estilo ACOGEDOR para Godot.
Uso: python3 clima_fiestas.py <salida_svg_dir>
Los SVG salen con width/height al doble del viewBox (PNG al doble).
"""
import math, os, random, sys

CAFE = "#7a4a3a"
ROSA = "#ec7a8e"
OCRE = "#e8a830"
CEMPA = "#f08a1c"
CEMPA2 = "#ffc23a"
JADE = "#2f9e78"
ROJO = "#c23a2c"
AZUL = "#2f5fa6"
CREMA = "#fbf4e4"


def svg(w, h, cuerpo, defs="", esc=2):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w * esc}" height="{h * esc}" viewBox="0 0 {w} {h}">'
            f'<defs>{defs}</defs>{cuerpo}</svg>')


def envolver(w, h, x, y, fn):
    """dibuja fn en (x,y) y sus copias desplazadas, para que el mosaico no tenga cortes"""
    return "".join(fn(x + dx, y + dy) for dx in (-w, 0, w) for dy in (-h, 0, h)
                   if -40 < x + dx < w + 40 and -40 < y + dy < h + 40)


# ------------------------------------------------------------------ clima (texturas que se repiten, 128x128)
def lluvia(f):
    r = random.Random(1)
    o = []
    for _ in range(46):
        x, y = r.uniform(0, 128), r.uniform(0, 128)
        L = r.uniform(7, 13)
        y = (y + f * 32) % 128
        o.append(envolver(128, 128, x, y, lambda X, Y: f'<line x1="{X:.1f}" y1="{Y:.1f}" x2="{X - L * 0.25:.1f}" y2="{Y + L:.1f}" stroke="#cfe6ff" stroke-width="1.3" stroke-linecap="round" opacity="0.75"/>'))
    return svg(128, 128, "".join(o))


def nieve(f):
    r = random.Random(2)
    o = []
    for _ in range(36):
        x, y, s = r.uniform(0, 128), r.uniform(0, 128), r.uniform(1.2, 2.8)
        y = (y + f * 32) % 128
        x = x + math.sin(f * 1.57 + y * 0.05) * 3
        o.append(envolver(128, 128, x, y, lambda X, Y: f'<circle cx="{X:.1f}" cy="{Y:.1f}" r="{s:.1f}" fill="#ffffff" opacity="0.9"/>'))
    return svg(128, 128, "".join(o))


def niebla():
    r = random.Random(3)
    o = []
    for _ in range(14):
        x, y = r.uniform(0, 256), r.uniform(0, 256)
        rx, ry = r.uniform(30, 60), r.uniform(12, 22)
        o.append(envolver(256, 256, x, y, lambda X, Y: f'<ellipse cx="{X:.1f}" cy="{Y:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="#ffffff" opacity="0.22" filter="url(#b)"/>'))
    return svg(256, 256, "".join(o), '<filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>')


def sombra_nubes():
    r = random.Random(4)
    o = []
    for _ in range(5):
        x, y = r.uniform(0, 512), r.uniform(0, 512)
        o.append(envolver(512, 512, x, y, lambda X, Y: "".join(
            f'<ellipse cx="{X + k * 30:.1f}" cy="{Y + (k % 2) * 10:.1f}" rx="46" ry="30" fill="#1a2040" opacity="0.10" filter="url(#b)"/>' for k in range(3))))
    return svg(512, 512, "".join(o), '<filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>', esc=1)


def salpica(f):
    t = f / 3
    o = f'<ellipse cx="12" cy="18" rx="{3 + t * 8:.1f}" ry="{1 + t * 2.5:.1f}" fill="none" stroke="#cfe6ff" stroke-width="1.2" opacity="{1 - t * 0.8:.2f}"/>'
    for a in (-1, 0, 1):
        x = 12 + a * (2 + t * 6)
        y = 16 - math.sin(t * math.pi) * 6
        o += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="1.2" fill="#cfe6ff" opacity="{1 - t * 0.7:.2f}"/>'
    return svg(24, 24, o)


def particula(tipo):
    if tipo == "hoja_otono":
        return svg(16, 16, f'<path d="M2,8 Q8,0 14,8 Q8,16 2,8 Z" fill="{CEMPA}" stroke="#8a4a1a" stroke-width="1"/><line x1="2" y1="8" x2="14" y2="8" stroke="#8a4a1a" stroke-width="0.7"/>')
    if tipo == "hoja_verde":
        return svg(16, 16, '<path d="M2,8 Q8,0 14,8 Q8,16 2,8 Z" fill="#7ab84a" stroke="#3e6a2a" stroke-width="1"/><line x1="2" y1="8" x2="14" y2="8" stroke="#3e6a2a" stroke-width="0.7"/>')
    if tipo == "petalo":
        return svg(12, 12, f'<path d="M6,1 Q11,6 6,11 Q1,6 6,1 Z" fill="{ROSA}" stroke="#b8506a" stroke-width="0.8"/>')
    if tipo == "luciernaga":
        return svg(24, 24, '<circle cx="12" cy="12" r="10" fill="url(#g)"/><circle cx="12" cy="12" r="2.2" fill="#fffbd0"/>',
                   '<radialGradient id="g"><stop offset="0" stop-color="#f8ff9a" stop-opacity="0.9"/><stop offset="1" stop-color="#f8ff9a" stop-opacity="0"/></radialGradient>')
    if tipo == "chispa":
        return svg(12, 12, '<circle cx="6" cy="6" r="5" fill="url(#g)"/><circle cx="6" cy="6" r="1.4" fill="#fff0b0"/>',
                   '<radialGradient id="g"><stop offset="0" stop-color="#ffb040" stop-opacity="1"/><stop offset="1" stop-color="#ff7020" stop-opacity="0"/></radialGradient>')
    if tipo == "humo":
        return svg(32, 32, '<circle cx="16" cy="16" r="13" fill="#e8e4e0" opacity="0.55" filter="url(#b)"/>',
                   '<filter id="b"><feGaussianBlur stdDeviation="2.4"/></filter>')


def arcoiris():
    cols = ["#e85a5a", "#f0a040", "#f8d860", "#7ac06a", "#5a9ad8", "#8a6ac8"]
    o = ""
    for i, c in enumerate(cols):
        r = 180 - i * 9
        o += f'<path d="M{200 - r},205 A{r},{r} 0 0 1 {200 + r},205" fill="none" stroke="{c}" stroke-width="9.5" opacity="0.5"/>'
    return svg(400, 210, o, esc=2)


# ------------------------------------------------------------------ fiestas
def guirnalda_cempasuchil():
    """tira que se repite a lo ancho (128x40): cordón con flores de cempasúchil colgando"""
    o = '<path d="M0,6 Q32,22 64,10 T128,6" fill="none" stroke="#6a8a3a" stroke-width="2"/>'
    for k in range(9):
        x = k * 16
        y = 6 + math.sin(x / 128 * math.tau) * 0 + (8 if k % 2 else 12)
        o += f'<circle cx="{x}" cy="{y}" r="5.4" fill="{CEMPA}" stroke="#a85a10" stroke-width="1"/><circle cx="{x}" cy="{y}" r="2.8" fill="{CEMPA2}"/>'
        if k % 2 == 0:
            o += f'<line x1="{x}" y1="{y + 5}" x2="{x}" y2="{y + 20}" stroke="#6a8a3a" stroke-width="1"/><circle cx="{x}" cy="{y + 23}" r="3.6" fill="{CEMPA}" stroke="#a85a10" stroke-width="0.8"/>'
    return svg(128, 40, o)


def estandartes():
    """tira de estandartes de plumas (amacuexpalli) y papel amate pintado, 128x48, se repite"""
    o = '<path d="M0,4 Q64,14 128,4" fill="none" stroke="#5a3a2a" stroke-width="1.6"/>'
    cols = [ROJO, JADE, OCRE, AZUL]
    for k in range(4):
        x = 16 + k * 32
        y = 4 + 10 * math.sin((x / 128) * math.pi) ** 1
        c = cols[k]
        o += (f'<path d="M{x - 9},{y} L{x + 9},{y} L{x + 9},{y + 24} L{x},{y + 32} L{x - 9},{y + 24} Z" fill="#efe0c0" stroke="{CAFE}" stroke-width="1.4"/>'
              f'<circle cx="{x}" cy="{y + 12}" r="5" fill="{c}" stroke="{CAFE}" stroke-width="1"/>'
              f'<circle cx="{x}" cy="{y + 12}" r="2" fill="#fff"/>')
        for j in range(3):
            o += f'<path d="M{x - 6 + j * 6},{y + 26 + (j == 1) * 3} l0,8" stroke="{[JADE, c, JADE][j]}" stroke-width="2.6" stroke-linecap="round"/>'
    return svg(128, 48, o)


def arco_flores():
    """arco de flores (xochimanqui) para la entrada de la plaza en fiesta, 128x128"""
    o = ''
    for side in (-1, 1):
        x = 64 + side * 50
        o += f'<rect x="{x - 5}" y="40" width="10" height="86" rx="3" fill="#8a5a32" stroke="{CAFE}" stroke-width="1.6"/>'
    o += '<path d="M14,48 Q64,-6 114,48" fill="none" stroke="#6a8a3a" stroke-width="10" stroke-linecap="round"/>'
    for k in range(13):
        t = k / 12
        x = 14 + t * 100
        y = 48 - math.sin(t * math.pi) * 40
        c = [CEMPA, ROSA, CEMPA2, "#f4f0ff"][k % 4]
        o += f'<circle cx="{x:.1f}" cy="{y:.1f}" r="6.4" fill="{c}" stroke="{CAFE}" stroke-width="1"/><circle cx="{x:.1f}" cy="{y:.1f}" r="2.4" fill="{OCRE}"/>'
    for side in (-1, 1):
        x = 64 + side * 50
        for j in range(5):
            o += f'<circle cx="{x + (j % 2) * side * 4:.1f}" cy="{58 + j * 14}" r="4.4" fill="{[CEMPA, ROSA][j % 2]}" stroke="{CAFE}" stroke-width="0.9"/>'
    return svg(128, 128, o)


def ofrenda():
    """altar de ofrenda con cempasúchil, copal, mazorcas y velas (96x96)"""
    o = (f'<rect x="10" y="56" width="76" height="34" rx="3" fill="#a86a3a" stroke="{CAFE}" stroke-width="1.6"/>'
         f'<rect x="18" y="38" width="60" height="20" rx="3" fill="#b87a44" stroke="{CAFE}" stroke-width="1.6"/>'
         f'<rect x="10" y="56" width="76" height="8" fill="#e8dcc0" stroke="{CAFE}" stroke-width="1"/>'
         f'<path d="M10,64 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6 l6,6 l6,-6" fill="none" stroke="{ROJO}" stroke-width="1.6"/>')
    for k in range(9):
        o += f'<circle cx="{14 + k * 8.5}" cy="54" r="4" fill="{CEMPA}" stroke="#a85a10" stroke-width="0.8"/>'
    o += f'<path d="M40,36 Q48,46 56,36 Z" fill="#b05a32" stroke="{CAFE}" stroke-width="1.2"/><ellipse cx="48" cy="36" rx="8" ry="2.4" fill="#3a2a20"/>'
    for k in range(3):
        o += f'<circle cx="{46 + k * 2}" cy="{30 - k * 7}" r="{3 + k}" fill="#e8e4e0" opacity="{0.6 - k * 0.15}"/>'
    for x in (24, 72):
        o += (f'<rect x="{x - 2.4}" y="22" width="4.8" height="16" fill="#f6efdc" stroke="{CAFE}" stroke-width="0.9"/>'
              f'<path d="M{x},14 q3,5 0,8 q-3,-3 0,-8 Z" fill="{CEMPA2}" stroke="#c87a10" stroke-width="0.6"/>')
    for k, c in enumerate((OCRE, "#3a4fa0", ROJO)):
        o += f'<ellipse cx="{30 + k * 18}" cy="78" rx="4" ry="9" fill="{c}" stroke="{CAFE}" stroke-width="1" transform="rotate(70 {30 + k * 18} 78)"/>'
    return svg(96, 96, o)


def tambores():
    """huéhuetl (tambor alto) y teponaztli (tambor de lengüetas), 96x96"""
    o = (f'<path d="M14,30 L44,30 L42,78 L38,78 L36,90 L22,90 L20,78 L16,78 Z" fill="#a86a3a" stroke="{CAFE}" stroke-width="1.6"/>'
         f'<ellipse cx="29" cy="30" rx="15" ry="4.4" fill="#e8d8b0" stroke="{CAFE}" stroke-width="1.4"/>'
         f'<path d="M16,44 l6,6 l6,-6 l6,6 l6,-6 l2,2" fill="none" stroke="{ROJO}" stroke-width="2"/>'
         f'<path d="M20,62 h18" stroke="{JADE}" stroke-width="3"/>'
         f'<rect x="52" y="66" width="38" height="18" rx="9" fill="#9a5a2a" stroke="{CAFE}" stroke-width="1.6"/>'
         f'<path d="M58,70 h26 M71,70 v6" stroke="#5a3418" stroke-width="1.6"/>'
         f'<path d="M56,84 l-2,6 M86,84 l2,6" stroke="{CAFE}" stroke-width="2.4" stroke-linecap="round"/>'
         f'<path d="M62,58 l8,10 M80,58 l-8,10" stroke="#8a5a32" stroke-width="2.4" stroke-linecap="round"/>'
         f'<circle cx="62" cy="57" r="2.6" fill="#3a2a20"/><circle cx="80" cy="57" r="2.6" fill="#3a2a20"/>')
    return svg(96, 96, o)


def palo_volador():
    """palo de los voladores (Totonacapan) con el bastidor y las cuerdas, 96x256"""
    o = (f'<rect x="44" y="30" width="8" height="222" rx="3" fill="#9a6a3a" stroke="{CAFE}" stroke-width="1.6"/>'
         f'<rect x="34" y="22" width="28" height="10" rx="2" fill="#7a4a24" stroke="{CAFE}" stroke-width="1.4"/>'
         f'<rect x="42" y="14" width="12" height="9" rx="2" fill="#7a4a24" stroke="{CAFE}" stroke-width="1.2"/>')
    for k in range(10):
        o += f'<path d="M44,{60 + k * 18} l8,-6" stroke="{CAFE}" stroke-width="1" opacity="0.6"/>'
    for s_ in (-1, 1):
        o += f'<path d="M{48 + s_ * 12},32 Q{48 + s_ * 30},80 {48 + s_ * 38},130" fill="none" stroke="#e8dcc0" stroke-width="1.2"/>'
        o += f'<g transform="translate({48 + s_ * 38} 136) rotate({180 + s_ * -20})"><circle r="5" fill="{ROJO}" stroke="{CAFE}" stroke-width="1"/><path d="M-4,4 L0,18 L4,4 Z" fill="{ROJO}" stroke="{CAFE}" stroke-width="1"/><path d="M-6,-4 l-4,-8 m10,8 l4,-8" stroke="{JADE}" stroke-width="2.4" stroke-linecap="round"/></g>'
    for k, c in enumerate((ROJO, JADE, OCRE, AZUL, ROSA)):
        o += f'<path d="M48,26 l{-8 + k * 4},-14" stroke="{c}" stroke-width="2.6" stroke-linecap="round"/>'
    return svg(96, 256, o)


def puesto_fiesta():
    """puesto de comida de fiesta con toldo de manta (128x112)"""
    o = ''
    for x in (14, 114):
        o += f'<rect x="{x - 3}" y="30" width="6" height="76" fill="#8a5a32" stroke="{CAFE}" stroke-width="1.2"/>'
    for k in range(6):
        o += f'<path d="M{6 + k * 20},22 l20,0 l-3,14 Q{6 + k * 20 + 10},42 {6 + k * 20 + 3},36 Z" fill="{[ROJO, CREMA][k % 2]}" stroke="{CAFE}" stroke-width="1.2"/>'
    o += f'<path d="M4,22 L64,6 L124,22 Z" fill="{ROJO}" stroke="{CAFE}" stroke-width="1.6"/>'
    o += f'<rect x="10" y="70" width="108" height="34" rx="3" fill="#a86a3a" stroke="{CAFE}" stroke-width="1.6"/>'
    o += f'<rect x="10" y="66" width="108" height="8" rx="2" fill="#c88a4a" stroke="{CAFE}" stroke-width="1.2"/>'
    for k in range(4):  # ollas y comales
        x = 26 + k * 25
        o += f'<ellipse cx="{x}" cy="62" rx="9" ry="7" fill="#b05a32" stroke="{CAFE}" stroke-width="1.2"/><ellipse cx="{x}" cy="56" rx="5" ry="1.8" fill="#5a2a14"/>'
        o += f'<path d="M{x - 2},50 q-3,-6 0,-10 M{x + 2},50 q3,-6 0,-10" stroke="#e8e4e0" stroke-width="1.6" fill="none" opacity="0.8"/>'
    for k in range(5):
        o += f'<circle cx="{20 + k * 22}" cy="88" r="5" fill="{[CEMPA, ROSA][k % 2]}" stroke="{CAFE}" stroke-width="0.9"/>'
    return svg(128, 112, o)


def antorcha_fiesta(f):
    """antorcha de ocote clavada (32x80), 3 cuadros de fuego"""
    fl = [0, 2, -1][f]
    o = (f'<rect x="13" y="30" width="6" height="48" rx="2" fill="#8a5a32" stroke="{CAFE}" stroke-width="1.2"/>'
         f'<rect x="10" y="26" width="12" height="8" rx="2" fill="#5a3418" stroke="{CAFE}" stroke-width="1.2"/>'
         f'<path d="M16,{4 + fl} Q26,16 22,26 L10,26 Q6,16 16,{4 + fl} Z" fill="#ff8a2a" stroke="#c84a10" stroke-width="1"/>'
         f'<path d="M16,{12 + fl} Q21,19 19,26 L13,26 Q11,19 16,{12 + fl} Z" fill="#ffd860"/>')
    return svg(32, 80, o)


if __name__ == "__main__":
    out = sys.argv[1]
    for sub in ("clima", "fiestas"):
        os.makedirs(os.path.join(out, sub), exist_ok=True)
    w = lambda n, s: open(os.path.join(out, n + ".svg"), "w").write(s)
    for f in range(4):
        w(f"clima/lluvia_{f}", lluvia(f))
        w(f"clima/nieve_{f}", nieve(f))
        w(f"clima/salpica_{f}", salpica(f))
    w("clima/niebla", niebla())
    w("clima/sombra_nubes", sombra_nubes())
    w("clima/arcoiris", arcoiris())
    for t in ("hoja_otono", "hoja_verde", "petalo", "luciernaga", "chispa", "humo"):
        w(f"clima/particula_{t}", particula(t))
    w("fiestas/guirnalda_cempasuchil", guirnalda_cempasuchil())
    w("fiestas/estandartes", estandartes())
    w("fiestas/arco_flores", arco_flores())
    w("fiestas/ofrenda", ofrenda())
    w("fiestas/tambores", tambores())
    w("fiestas/palo_volador", palo_volador())
    w("fiestas/puesto_fiesta", puesto_fiesta())
    for f in range(3):
        w(f"fiestas/antorcha_{f}", antorcha_fiesta(f))
    print("listo")
