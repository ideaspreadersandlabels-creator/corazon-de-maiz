"""Burbujas de emoción, efectos, cuadro de diálogo y fondo de título en estilo ACOGEDOR.
Uso: python3 interfaz_acogedor.py <salida_svg_dir> <dir_personajes_svg>
Los SVG salen con width/height al doble del viewBox (el PNG queda al doble).
"""
import math, os, sys, random

CAFE = "#7a4a3a"
CREMA = "#fbf4e4"
CREMA2 = "#f2e2c4"
ROJO = "#d8503a"
ROSA = "#ec7a8e"
AZUL = "#5a9ad8"
OCRE = "#e8a830"
VERDE = "#5aa85a"


def svg(w, h, cuerpo, defs="", escala=2):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w * escala}" height="{h * escala}" viewBox="0 0 {w} {h}">'
            f'<defs>{defs}</defs>{cuerpo}</svg>')


def corazon(cx, cy, r, fill, st=None, sw=1.2):
    d = (f"M{cx},{cy + r * 0.9} C{cx - r * 1.6},{cy - r * 0.2} {cx - r * 0.9},{cy - r * 1.4} {cx},{cy - r * 0.5} "
         f"C{cx + r * 0.9},{cy - r * 1.4} {cx + r * 1.6},{cy - r * 0.2} {cx},{cy + r * 0.9} Z")
    s = f' stroke="{st}" stroke-width="{sw}" stroke-linejoin="round"' if st else ""
    return f'<path d="{d}" fill="{fill}"{s}/>'


def estrella(cx, cy, r, fill, puntas=4, st=None):
    pts = []
    for i in range(puntas * 2):
        a = -math.pi / 2 + i * math.pi / puntas
        rr = r if i % 2 == 0 else r * 0.38
        pts.append(f"{cx + math.cos(a) * rr:.2f},{cy + math.sin(a) * rr:.2f}")
    s = f' stroke="{st}" stroke-width="1" stroke-linejoin="round"' if st else ""
    return f'<polygon points="{" ".join(pts)}" fill="{fill}"{s}/>'


def gota(cx, cy, r, fill, st=None):
    s = f' stroke="{st}" stroke-width="1"' if st else ""
    return f'<path d="M{cx},{cy - r * 1.6} Q{cx + r * 1.1},{cy - r * 0.2} {cx + r},{cy + r * 0.3} A{r},{r} 0 1 1 {cx - r},{cy + r * 0.3} Q{cx - r * 1.1},{cy - r * 0.2} {cx},{cy - r * 1.6} Z" fill="{fill}"{s}/>'


# ------------------------------------------------------------------ burbujas (48x48)
def burbuja(simbolo):
    fondo = (f'<path d="M8,4 H40 Q46,4 46,10 V30 Q46,36 40,36 H28 L22,44 L22,36 H8 Q2,36 2,30 V10 Q2,4 8,4 Z" '
             f'fill="{CREMA}" stroke="{CAFE}" stroke-width="2.2" stroke-linejoin="round"/>'
             f'<path d="M8,7 H30" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>')
    t = lambda txt, col, fs=24: (f'<text x="24" y="{20 + fs * 0.35}" text-anchor="middle" font-family="Arial Rounded MT Bold, Arial, sans-serif" '
                                 f'font-weight="900" font-size="{fs}" fill="{col}" stroke="{CAFE}" stroke-width="1.2" paint-order="stroke">{txt}</text>')
    c = {
        "alerta": t("!", ROJO, 26),
        "pregunta": t("?", AZUL, 26),
        "corazon": corazon(24, 20, 9, ROSA, CAFE),
        "dormir": ('<text x="16" y="28" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="13" fill="#6a8ac8" stroke="' + CAFE + '" stroke-width="1" paint-order="stroke">z</text>'
                   '<text x="29" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#6a8ac8" stroke="' + CAFE + '" stroke-width="1.2" paint-order="stroke">Z</text>'),
        "musica": ('<path d="M18,28 V12 L32,9 V25" fill="none" stroke="#5a3a6a" stroke-width="2.4" stroke-linejoin="round"/>'
                   '<ellipse cx="15.5" cy="28" rx="3.6" ry="2.8" fill="#8a5aa8" stroke="#5a3a6a" stroke-width="1.2"/>'
                   '<ellipse cx="29.5" cy="25" rx="3.6" ry="2.8" fill="#8a5aa8" stroke="#5a3a6a" stroke-width="1.2"/>'),
        "enojo": "".join(f'<path d="M{24 + dx},{20 + dy} q{dx * 0.2},{dy * -0.6} {dx * 0.9},{dy * -0.2}" stroke="{ROJO}" stroke-width="3" fill="none" stroke-linecap="round"/>'
                         for dx, dy in ((-6, -6), (6, -6), (-6, 6), (6, 6))),
        "idea": estrella(24, 20, 11, OCRE, 4, CAFE) + estrella(35, 11, 4, "#fff6c0", 4),
        "sudor": gota(24, 22, 6, "#8ac8f0", CAFE),
        "puntos": "".join(f'<circle cx="{14 + i * 10}" cy="20" r="3.4" fill="{CAFE}"/>' for i in range(3)),
        "feliz": ('<circle cx="24" cy="20" r="11" fill="#ffd860" stroke="' + CAFE + '" stroke-width="1.4"/>'
                  '<path d="M18,18 q2,-3 4,0 M26,18 q2,-3 4,0" stroke="' + CAFE + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>'
                  '<path d="M18.5,23 Q24,29 29.5,23 Z" fill="#c0503a"/><ellipse cx="16.5" cy="23" rx="2.4" ry="1.4" fill="' + ROSA + '" opacity="0.6"/>'
                  '<ellipse cx="31.5" cy="23" rx="2.4" ry="1.4" fill="' + ROSA + '" opacity="0.6"/>'),
    }[simbolo]
    return svg(48, 48, fondo + c)


BURBUJAS = ["alerta", "pregunta", "corazon", "dormir", "musica", "enojo", "idea", "sudor", "puntos", "feliz"]


# ------------------------------------------------------------------ efectos (48x48, 4 cuadros)
def efecto(tipo, f):
    t = f / 3.0  # 0..1
    r = random.Random(7)
    o = []
    op = 1.0 - t * 0.85
    if tipo == "polvo":
        for i in range(5):
            a = math.pi * (0.9 + 1.2 * i / 4)
            d = 6 + t * 12
            x, y = 24 + math.cos(a) * d, 36 + math.sin(a) * d * 0.4 - t * 4
            rr = 4 + t * 4 - i * 0.3
            o.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="#e8dcc4" stroke="#c8b08a" stroke-width="1" opacity="{op:.2f}"/>')
    elif tipo == "brillo":
        for i in range(5):
            a = i * math.tau / 5 + t
            d = 4 + t * 16
            x, y = 24 + math.cos(a) * d, 24 + math.sin(a) * d
            o.append(estrella(x, y, 5 - t * 2 + (i % 2), ["#fff6a0", "#ffd860"][i % 2], 4, "#c89a30").replace("/>", f' opacity="{op:.2f}"/>'))
        o.append(estrella(24, 24, 9 * (1 - t), "#ffffff", 4).replace("/>", f' opacity="{op:.2f}"/>'))
    elif tipo == "gotas":
        for i in range(6):
            a = math.pi * (1.1 + 0.8 * i / 5)
            d = 4 + t * 14
            x, y = 24 + math.cos(a) * d, 34 + math.sin(a) * d - (1 - (2 * t - 1) ** 2) * 8 + t * 6
            o.append(gota(x, y, 2.4, "#8ac8f0", "#4a8ab8").replace("/>", f' opacity="{op:.2f}"/>'))
        o.append(f'<ellipse cx="24" cy="40" rx="{6 + t * 12:.1f}" ry="{2 + t * 3:.1f}" fill="none" stroke="#8ac8f0" stroke-width="1.6" opacity="{op:.2f}"/>')
    elif tipo == "hojas":
        for i in range(5):
            x = 10 + i * 7 + math.sin(t * 5 + i) * 4
            y = 14 + i % 2 * 6 + t * 22
            rot = (i * 70 + t * 200) % 360
            col = ["#6aa84a", "#8ac05a", "#c8a040"][i % 3]
            o.append(f'<g transform="translate({x:.1f} {y:.1f}) rotate({rot:.0f})" opacity="{op:.2f}"><path d="M-4,0 Q0,-4 4,0 Q0,4 -4,0 Z" fill="{col}" stroke="#3e6a2a" stroke-width="0.8"/><line x1="-4" y1="0" x2="4" y2="0" stroke="#3e6a2a" stroke-width="0.5"/></g>')
    elif tipo == "corazones":
        for i in range(3):
            x = 14 + i * 10 + math.sin(t * 6 + i * 2) * 3
            y = 38 - t * 26 - i * 4
            o.append(corazon(x, y, 3.4 + (i == 1) * 1.2, ROSA, "#a8405a", 0.9).replace("/>", f' opacity="{op:.2f}"/>'))
    elif tipo == "piedritas":
        for i in range(6):
            a = math.pi * (1.05 + 0.9 * i / 5)
            d = 3 + t * 15
            x, y = 24 + math.cos(a) * d, 32 + math.sin(a) * d + t * t * 14
            o.append(f'<polygon points="{x - 2:.1f},{y:.1f} {x:.1f},{y - 2.4:.1f} {x + 2.2:.1f},{y - 0.4:.1f} {x + 0.6:.1f},{y + 2:.1f}" fill="#a8a094" stroke="#6a645a" stroke-width="0.8" opacity="{op:.2f}"/>')
    return svg(48, 48, "".join(o))


EFECTOS = ["polvo", "brillo", "gotas", "hojas", "corazones", "piedritas"]


# ------------------------------------------------------------------ cuadro de diálogo
def flor(cx, cy, r, col):
    o = "".join(f'<circle cx="{cx + math.cos(a) * r * 0.62:.1f}" cy="{cy + math.sin(a) * r * 0.62:.1f}" r="{r * 0.48:.1f}" fill="{col}" stroke="{CAFE}" stroke-width="0.9"/>'
                for a in [i * math.tau / 5 - math.pi / 2 for i in range(5)])
    return o + f'<circle cx="{cx}" cy="{cy}" r="{r * 0.36:.1f}" fill="{OCRE}" stroke="{CAFE}" stroke-width="0.8"/>'


def panel_dialogo():
    """nine-patch 96x96, márgenes de 24: crema, doble borde café, florecitas en las esquinas"""
    w = 96
    c = (f'<rect x="3" y="3" width="90" height="90" rx="16" fill="{CREMA}" stroke="{CAFE}" stroke-width="3"/>'
         f'<rect x="9" y="9" width="78" height="78" rx="11" fill="none" stroke="#c89a6a" stroke-width="1.4" stroke-dasharray="4 3"/>'
         f'<rect x="12" y="10" width="72" height="5" rx="2.5" fill="#ffffff" opacity="0.7"/>')
    for x, y in ((10, 10), (86, 10), (10, 86), (86, 86)):
        c += flor(x, y, 7, ROSA if (x + y) % 3 else "#f0a040")
    return svg(w, w, c)


def placa_nombre():
    """nine-patch 64x32, márgenes 14 izquierda/derecha y 10 arriba/abajo"""
    c = (f'<rect x="2" y="3" width="60" height="26" rx="13" fill="#e88a5a" stroke="{CAFE}" stroke-width="2.4"/>'
         f'<rect x="8" y="6" width="48" height="5" rx="2.5" fill="#ffffff" opacity="0.45"/>'
         f'<circle cx="10" cy="16" r="2.4" fill="{CREMA}"/><circle cx="54" cy="16" r="2.4" fill="{CREMA}"/>')
    return svg(64, 32, c)


def marco_retrato():
    c = (f'<circle cx="70" cy="70" r="66" fill="{CREMA2}" stroke="{CAFE}" stroke-width="4"/>'
         f'<circle cx="70" cy="70" r="58" fill="none" stroke="#c89a6a" stroke-width="2" stroke-dasharray="6 4"/>')
    for i in range(8):
        a = i * math.tau / 8
        c += flor(70 + math.cos(a) * 66, 70 + math.sin(a) * 66, 6, [ROSA, OCRE, "#7ac0a8"][i % 3])
    return svg(140, 140, c)


def flechita(k):
    y = 4 + k * 3
    c = f'<path d="M4,{y} L20,{y} L12,{y + 10} Z" fill="{ROJO}" stroke="{CAFE}" stroke-width="1.6" stroke-linejoin="round"/>'
    return svg(24, 20, c)


# ------------------------------------------------------------------ fondo del título (960x540 → PNG 1920x1080)
def fondo_titulo(dir_pers):
    W, H = 960, 540
    r = random.Random(3)
    d = ('<linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a6ab8"/>'
         '<stop offset="0.45" stop-color="#e88a7a"/><stop offset="0.75" stop-color="#f8c878"/></linearGradient>'
         '<radialGradient id="sol" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff4c0"/><stop offset="0.6" stop-color="#ffd870"/>'
         '<stop offset="1" stop-color="#ffd870" stop-opacity="0"/></radialGradient>')
    c = f'<rect width="{W}" height="{H}" fill="url(#cielo)"/>'
    c += '<circle cx="640" cy="300" r="120" fill="url(#sol)"/><circle cx="640" cy="300" r="46" fill="#fff0b0"/>'
    for i in range(6):  # nubes
        x, y = r.randint(40, 900), r.randint(40, 200)
        c += "".join(f'<ellipse cx="{x + k * 22}" cy="{y + (k % 2) * 4}" rx="{30 - abs(k - 1.5) * 6}" ry="14" fill="#fde8e0" opacity="0.85"/>' for k in range(4))
    # Matlalcueye con nieve
    c += '<path d="M120,372 Q250,300 340,232 Q372,206 392,214 Q412,186 438,184 Q462,182 480,200 Q500,192 520,212 Q600,262 820,372 Z" fill="#6a6aa8"/>'
    c += '<path d="M366,222 Q384,206 394,216 Q414,188 438,186 Q462,184 478,202 Q498,194 514,210 L506,214 Q494,206 486,218 Q470,206 458,220 Q444,206 430,222 Q414,210 402,226 Q388,218 378,230 Z" fill="#f4f0ff"/>'
    c += '<path d="M-20,380 Q160,300 330,360 Q520,300 700,350 Q840,310 980,350 L980,540 L-20,540 Z" fill="#6aa86a"/>'
    c += '<path d="M-20,420 Q200,370 420,410 Q640,380 980,410 L980,540 L-20,540 Z" fill="#8ac06a"/>'
    # teocalli lejano
    c += '<g transform="translate(150 336)"><rect x="0" y="20" width="70" height="14" fill="#c8a07a" stroke="#8a6a4a"/><rect x="10" y="8" width="50" height="12" fill="#d8b08a" stroke="#8a6a4a"/><rect x="22" y="-6" width="26" height="14" fill="#c84a3a" stroke="#8a3a2a"/></g>'
    # milpa
    for i in range(70):
        x = i * 14 + r.randint(-4, 4)
        y = 440 + (i % 3) * 18 + r.randint(0, 6)
        h = r.randint(50, 80)
        c += f'<path d="M{x},{y} L{x},{y - h}" stroke="#4a8a3a" stroke-width="3"/>'
        for k in range(3):
            s_ = 1 if (k + i) % 2 else -1
            c += f'<path d="M{x},{y - h * (0.3 + k * 0.22)} q{s_ * 14},-8 {s_ * 22},4" stroke="#5aa04a" stroke-width="4" fill="none" stroke-linecap="round"/>'
        if i % 4 == 0:
            c += f'<ellipse cx="{x + 4}" cy="{y - h * 0.55}" rx="3.4" ry="8" fill="#f2c94c" stroke="#a87a2a"/>'
        c += f'<path d="M{x},{y - h} l-4,-10 m4,10 l4,-10 m-4,10 l0,-12" stroke="#d8b860" stroke-width="1.6"/>'
    # personajes al frente (usa los svg del jugador, Xóchitl y las mascotas)
    def insertar(path, x, y, s_, pref):
        t = open(path).read()
        t = t.replace('id="p', f'id="{pref}p').replace('id="cp', f'id="{pref}cp').replace('href="#p', f'href="#{pref}p').replace('url(#cp', f'url(#{pref}cp')
        cuerpo = t[t.index("<defs>"):t.rindex("</svg>")]
        return f'<g transform="translate({x} {y}) scale({s_})">{cuerpo}</g>'
    c += f'<ellipse cx="480" cy="520" rx="260" ry="24" fill="#4a7a3a" opacity="0.5"/>'
    c += insertar(os.path.join(dir_pers, "player", "saludar_abajo_0.svg"), 330, 250, 1.5, "a")
    c += insertar(os.path.join(dir_pers, "xochitl", "quieto_abajo.svg"), 470, 250, 1.5, "b")
    return svg(W, H, c, d)


if __name__ == "__main__":
    out, dir_pers = sys.argv[1:3]
    for sub in ("burbujas", "efectos", "dialogo", "titulo"):
        os.makedirs(os.path.join(out, sub), exist_ok=True)
    for b in BURBUJAS:
        open(os.path.join(out, "burbujas", b + ".svg"), "w").write(burbuja(b))
    for e in EFECTOS:
        for f in range(4):
            open(os.path.join(out, "efectos", f"{e}_{f}.svg"), "w").write(efecto(e, f))
    open(os.path.join(out, "dialogo", "panel_dialogo.svg"), "w").write(panel_dialogo())
    open(os.path.join(out, "dialogo", "placa_nombre.svg"), "w").write(placa_nombre())
    open(os.path.join(out, "dialogo", "marco_retrato.svg"), "w").write(marco_retrato())
    for k in range(2):
        open(os.path.join(out, "dialogo", f"flechita_{k}.svg"), "w").write(flechita(k))
    open(os.path.join(out, "titulo", "fondo_titulo.svg"), "w").write(fondo_titulo(dir_pers))
    print("listo")
