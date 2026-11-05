"""Pasa los íconos del paquete (estilo códice, tinta negra) a estilo ACOGEDOR:
contorno del color de cada pieza, negros suavizados, brillo y sombrita suave.
Uso: python3 iconos_acogedor.py <dir_iconos_svg> <salida_dir>
"""
import os, re, sys

TINTA = "#1a1410"


def hx(c):
    c = c.lstrip("#")
    if len(c) == 3:
        c = "".join(ch * 2 for ch in c)
    return [int(c[i:i + 2], 16) for i in (0, 2, 4)]


def hexc(r):
    return "#%02x%02x%02x" % tuple(max(0, min(255, int(v))) for v in r)


def mezcla(a, b, t):
    A, B = hx(a), hx(b)
    return hexc([A[i] * (1 - t) + B[i] * t for i in range(3)])


def contorno(fill, fuerza=0.52):
    if fill and re.fullmatch(r"#[0-9a-fA-F]{3,6}", fill):
        return mezcla(mezcla(fill, "#000000", fuerza), "#5a2a18", 0.25)
    return "#6a4a3a"


def vivo(c):
    """colores un poco más vivos y cálidos"""
    r, g, b = hx(c)
    m = (r + g + b) / 3
    k = 1.12
    return hexc([m + (r - m) * k + 6, m + (g - m) * k + 3, m + (b - m) * k - 2])


def convertir(svg, fuerza=0.52, avivar=False):
    def tag(m):
        t = m.group(0)
        fm = re.search(r'fill="([^"]+)"', t)
        fill = fm.group(1) if fm else None
        if avivar and fill and re.fullmatch(r"#[0-9a-fA-F]{6}", fill) and fill.lower() != TINTA:
            t = t.replace(f'fill="{fill}"', f'fill="{vivo(fill)}"', 1)
        if fill and fill.lower() == TINTA:  # rellenos negros -> café oscuro suave
            t = t.replace(f'fill="{fill}"', 'fill="#3a2c2a"')
            fill = "#3a2c2a"
        if f'stroke="{TINTA}"' in t:
            t = t.replace(f'stroke="{TINTA}"', f'stroke="{contorno(fill, fuerza)}"')
        return t
    svg = re.sub(r"<(path|ellipse|circle|rect|polygon|polyline|line)\b[^>]*>", tag, svg)
    # sombrita suave y un poco más redondo
    m = re.match(r"(<svg[^>]*>)(.*)(</svg>)\s*$", svg, re.S)
    if not m:
        return svg
    cab, cuerpo, fin = m.groups()
    filtro = ('<defs><filter id="sombra" x="-20%" y="-20%" width="140%" height="150%">'
              '<feDropShadow dx="0" dy="0.7" stdDeviation="0.55" flood-color="#5a3020" flood-opacity="0.35"/></filter></defs>')
    return f'{cab}{filtro}<g filter="url(#sombra)">{cuerpo}</g>{fin}'


if __name__ == "__main__":
    src, out = sys.argv[1:3]
    os.makedirs(out, exist_ok=True)
    n = 0
    for f in sorted(os.listdir(src)):
        if f.endswith(".svg"):
            open(os.path.join(out, f), "w").write(convertir(open(os.path.join(src, f)).read()))
            n += 1
    print("listo", n)
