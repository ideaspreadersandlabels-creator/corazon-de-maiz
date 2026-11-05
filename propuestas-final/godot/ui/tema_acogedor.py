"""5.º estilo de menú: ACOGEDOR (madera clara, crema, florecitas). Mismas piezas y medidas que los otros temas:
frame 128x128 (margen 30), button/button_active 64x40 (margen 11), surface 64x64 y background 192x108 (mosaicos).
Uso: python3 tema_acogedor.py <salida_dir>
"""
import math, os, sys

CAFE = "#7a4a3a"
MADERA = "#c8875a"
MADERA2 = "#a86a40"
CREMA = "#fbf4e4"
CREMA2 = "#f2e2c4"
ROSA = "#ec7a8e"
OCRE = "#e8a830"
VERDE = "#7ab86a"


def flor(cx, cy, r, col):
    o = "".join(f'<circle cx="{cx + math.cos(a) * r * 0.62:.1f}" cy="{cy + math.sin(a) * r * 0.62:.1f}" r="{r * 0.5:.1f}" fill="{col}" stroke="{CAFE}" stroke-width="0.9"/>'
                for a in [i * math.tau / 5 - math.pi / 2 for i in range(5)])
    return o + f'<circle cx="{cx}" cy="{cy}" r="{r * 0.36:.1f}" fill="{OCRE}" stroke="{CAFE}" stroke-width="0.8"/>'


def svg(w, h, c):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{c}</svg>'


def frame():
    c = (f'<rect x="2" y="2" width="124" height="124" rx="18" fill="{MADERA}" stroke="{CAFE}" stroke-width="3"/>'
         f'<rect x="5" y="5" width="118" height="5" rx="2.5" fill="#ffffff" opacity="0.3"/>')
    # vetas de madera en el borde (en la zona que se repite: entre 30 y 98)
    for y in (16, 112):
        c += f'<path d="M30,{y} q17,-3 34,0 t34,0" fill="none" stroke="{MADERA2}" stroke-width="1.2"/>'
    for x in (16, 112):
        c += f'<path d="M{x},30 q-3,17 0,34 t0,34" fill="none" stroke="{MADERA2}" stroke-width="1.2"/>'
    c += (f'<rect x="22" y="22" width="84" height="84" rx="10" fill="{CREMA}" stroke="{CAFE}" stroke-width="2.4"/>'
          f'<rect x="27" y="27" width="74" height="74" rx="7" fill="none" stroke="#d8a878" stroke-width="1.2" stroke-dasharray="4 3"/>')
    for x, y in ((14, 14), (114, 14), (14, 114), (114, 114)):
        c += flor(x, y, 9, ROSA if x == y else "#f0a040")
    return svg(128, 128, c)


def boton(activo=False):
    fondo, borde = ("#e8805a", CAFE) if activo else (CREMA, CAFE)
    c = (f'<rect x="2" y="2" width="60" height="36" rx="12" fill="{fondo}" stroke="{borde}" stroke-width="2.4"/>'
         f'<rect x="6" y="5" width="52" height="7" rx="3.5" fill="#ffffff" opacity="{0.45 if activo else 0.8}"/>'
         f'<path d="M6,33 H58" stroke="{"#c0603a" if activo else "#e8d0b0"}" stroke-width="2" stroke-linecap="round"/>')
    return svg(64, 40, c)


def surface():
    c = f'<rect width="64" height="64" fill="{CREMA2}"/>'
    for x, y in ((16, 16), (48, 48)):
        c += f'<circle cx="{x}" cy="{y}" r="3" fill="#e8c8a0" opacity="0.6"/>'
    for x, y in ((48, 16), (16, 48)):
        c += f'<path d="M{x - 3},{y} q3,-4 6,0 q-3,4 -6,0 Z" fill="{VERDE}" opacity="0.35"/>'
    return svg(64, 64, c)


def background():
    c = f'<rect width="192" height="108" fill="#f6e6c8"/>'
    for k in range(4):  # tablas de madera clara
        c += f'<rect x="0" y="{k * 27}" width="192" height="27" fill="{["#f2dcb4", "#f6e2c0"][k % 2]}"/>'
        c += f'<line x1="0" y1="{k * 27}" x2="192" y2="{k * 27}" stroke="#e0c090" stroke-width="1.2"/>'
    for x, y, col in ((24, 13, ROSA), (120, 40, "#f0a040"), (72, 67, "#f4f0ff"), (168, 94, ROSA)):
        c += f'<g opacity="0.55">{flor(x, y, 6, col)}</g>'
    return svg(192, 108, c)


if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for n, s in (("acogedor_frame", frame()), ("acogedor_button", boton()), ("acogedor_button_active", boton(True)),
                 ("acogedor_surface", surface()), ("acogedor_background", background())):
        open(os.path.join(out, n + ".svg"), "w").write(s)
    print("listo")
