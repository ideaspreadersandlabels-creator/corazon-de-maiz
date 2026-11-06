"""Interfaz del juego (HUD) en estilo ACOGEDOR. SVG con width/height al doble del viewBox (PNG al doble).
Uso: python3 hud_acogedor.py <salida_dir>
"""
import math, os, sys

CAFE = "#7a4a3a"
CAFE2 = "#5a3a2a"
MADERA = "#c8875a"
MADERA2 = "#a86a40"
CREMA = "#fbf4e4"
CREMA2 = "#f2e2c4"
ROSA = "#ec7a8e"
NARANJA = "#e8805a"
OCRE = "#e8a830"
VERDE = "#7ab86a"
AZUL = "#5a9ad8"
ROJO = "#d8503a"


def svg(w, h, c, defs="", esc=2):
    return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w * esc}" height="{h * esc}" viewBox="0 0 {w} {h}"><defs>{defs}</defs>{c}</svg>'


def flor(cx, cy, r, col):
    o = "".join(f'<circle cx="{cx + math.cos(a) * r * 0.62:.1f}" cy="{cy + math.sin(a) * r * 0.62:.1f}" r="{r * 0.5:.1f}" fill="{col}" stroke="{CAFE}" stroke-width="0.8"/>'
                for a in [i * math.tau / 5 - math.pi / 2 for i in range(5)])
    return o + f'<circle cx="{cx}" cy="{cy}" r="{r * 0.36:.1f}" fill="{OCRE}" stroke="{CAFE}" stroke-width="0.7"/>'


def corazon(cx, cy, r, fill):
    return (f'<path d="M{cx},{cy + r * 0.9} C{cx - r * 1.6},{cy - r * 0.2} {cx - r * 0.9},{cy - r * 1.4} {cx},{cy - r * 0.5} '
            f'C{cx + r * 0.9},{cy - r * 1.4} {cx + r * 1.6},{cy - r * 0.2} {cx},{cy + r * 0.9} Z" fill="{fill}" stroke="{CAFE}" stroke-width="1.4" stroke-linejoin="round"/>')


# ---------------------------------------------------------- barra de herramientas
def casilla(activa=False):
    """casilla 48x48 (nine-patch, márgenes 12)"""
    fondo = "#fff6e0" if activa else CREMA
    borde = NARANJA if activa else CAFE
    c = (f'<rect x="2" y="2" width="44" height="44" rx="11" fill="{fondo}" stroke="{borde}" stroke-width="{3.2 if activa else 2.4}"/>'
         f'<rect x="6" y="5" width="36" height="6" rx="3" fill="#ffffff" opacity="0.7"/>'
         f'<path d="M6,42 H42" stroke="{"#f0b890" if activa else "#e8d0b0"}" stroke-width="2" stroke-linecap="round"/>')
    if activa:
        c += f'<path d="M18,-0.5 L24,6 L30,-0.5 Z" fill="{NARANJA}" stroke="{CAFE}" stroke-width="1"/>'
    return svg(48, 48, c)


def barra_fondo():
    """fondo de la barra de herramientas 96x64 (nine-patch, márgenes 24): tabla de madera con florecitas"""
    c = (f'<rect x="2" y="2" width="92" height="60" rx="18" fill="{MADERA}" stroke="{CAFE}" stroke-width="3"/>'
         f'<rect x="6" y="5" width="84" height="6" rx="3" fill="#ffffff" opacity="0.25"/>'
         f'<path d="M24,32 q12,-3 24,0 t24,0" fill="none" stroke="{MADERA2}" stroke-width="1.2"/>')
    c += flor(12, 12, 6, ROSA) + flor(84, 12, 6, "#f0a040")
    return svg(96, 64, c)


def numero_tecla():
    """chapita para el número de la casilla 18x18"""
    return svg(18, 18, f'<circle cx="9" cy="9" r="7.5" fill="{CAFE}" stroke="{CREMA}" stroke-width="1.6"/>')


# ---------------------------------------------------------- vida / energía / agua
def marco_barra():
    """marco de barra 120x24 (nine-patch, márgenes 12 a los lados y 10 arriba/abajo)"""
    c = (f'<rect x="1.5" y="1.5" width="117" height="21" rx="10.5" fill="#e8d6b4" stroke="{CAFE}" stroke-width="2.4"/>'
         f'<rect x="5" y="5" width="110" height="14" rx="7" fill="#d8c4a0"/>')
    return svg(120, 24, c)


def relleno(col, col2):
    """relleno 110x14 (nine-patch, márgenes 7): se estira según el valor"""
    c = (f'<rect x="0" y="0" width="110" height="14" rx="7" fill="{col}"/>'
         f'<rect x="4" y="2" width="102" height="4" rx="2" fill="#ffffff" opacity="0.45"/>'
         f'<rect x="0" y="9" width="110" height="5" rx="2.5" fill="{col2}" opacity="0.6"/>')
    return svg(110, 14, c)


def icono_vida():
    return svg(32, 32, corazon(16, 15, 9, ROJO) + '<ellipse cx="12" cy="11" rx="3" ry="2" fill="#ffffff" opacity="0.6"/>')


def icono_energia():
    c = (f'<path d="M16,4 C24,8 25,22 16,29 C7,22 8,8 16,4 Z" fill="{OCRE}" stroke="{CAFE}" stroke-width="1.4"/>'
         + "".join(f'<circle cx="{13 + (i % 2) * 6}" cy="{10 + (i // 2) * 5}" r="2" fill="#fff0b0"/>' for i in range(6))
         + f'<path d="M16,4 C10,2 6,6 5,10 C9,8 13,8 16,10 Z" fill="{VERDE}" stroke="{CAFE}" stroke-width="1.2"/>')
    return svg(32, 32, c)


def icono_agua():
    c = (f'<path d="M16,3 Q25,14 25,20 A9,9 0 0 1 7,20 Q7,14 16,3 Z" fill="{AZUL}" stroke="{CAFE}" stroke-width="1.4"/>'
         f'<ellipse cx="12.5" cy="17" rx="2.4" ry="3.4" fill="#ffffff" opacity="0.6"/>')
    return svg(32, 32, c)


def panel_estado():
    """panel 96x96 (nine-patch, márgenes 24) para las tres barras"""
    c = (f'<rect x="2" y="2" width="92" height="92" rx="18" fill="{CREMA}" stroke="{CAFE}" stroke-width="3"/>'
         f'<rect x="7" y="7" width="82" height="82" rx="13" fill="none" stroke="#d8a878" stroke-width="1.2" stroke-dasharray="4 3"/>')
    c += flor(10, 10, 6, ROSA)
    return svg(96, 96, c)


# ---------------------------------------------------------- reloj de sol y luna
def disco_dia_noche():
    """disco 128x128 que gira: mitad de arriba día (sol), mitad de abajo noche (luna). Gira 360° en 24 h.
    A mediodía: rotación 0 (sol arriba). A medianoche: 180°."""
    defs = ('<linearGradient id="dia" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8ac8f0"/><stop offset="1" stop-color="#f8c878"/></linearGradient>'
            '<linearGradient id="noche" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2a3468"/><stop offset="1" stop-color="#8a5a8a"/></linearGradient>')
    c = ('<path d="M64,64 L4,64 A60,60 0 0 1 124,64 Z" fill="url(#dia)"/>'
         '<path d="M64,64 L124,64 A60,60 0 0 1 4,64 Z" fill="url(#noche)"/>')
    c += f'<circle cx="64" cy="22" r="11" fill="#ffe070" stroke="{CAFE}" stroke-width="1.6"/>'
    for i in range(8):
        a = i * math.tau / 8
        c += f'<line x1="{64 + math.cos(a) * 14:.1f}" y1="{22 + math.sin(a) * 14:.1f}" x2="{64 + math.cos(a) * 18:.1f}" y2="{22 + math.sin(a) * 18:.1f}" stroke="#f0a020" stroke-width="2.4" stroke-linecap="round"/>'
    c += f'<path d="M58,96 a12,12 0 1 0 14,14 a9,9 0 1 1 -14,-14 Z" fill="#f4f0d8" stroke="{CAFE}" stroke-width="1.4"/>'
    for (x, y) in ((40, 92), (88, 98), (50, 112), (80, 84)):
        c += f'<circle cx="{x}" cy="{y}" r="1.6" fill="#fff8d0"/>'
    c += '<path d="M24,40 q8,-6 16,0 q6,-4 10,2" fill="#ffffff" opacity="0.8"/>'
    c += f'<circle cx="64" cy="64" r="60" fill="none" stroke="{CAFE}" stroke-width="3"/>'
    return svg(128, 128, c)


def marco_reloj():
    """aro de madera 160x88 alrededor de la mitad de arriba del disco (el disco va centrado en (80,80) y se recorta
    en Godot con un Control con clip_contents de 80 px de alto, para que solo se vea el cielo de arriba)"""
    c = (f'<path d="M12,80 A68,68 0 0 1 148,80 L138,80 A58,58 0 0 0 22,80 Z" fill="{MADERA}" stroke="{CAFE}" stroke-width="2.6" stroke-linejoin="round"/>'
         f'<path d="M17,80 A63,63 0 0 1 143,80" fill="none" stroke="#e8b080" stroke-width="1.6"/>'
         f'<rect x="2" y="76" width="156" height="10" rx="5" fill="{MADERA}" stroke="{CAFE}" stroke-width="2.6"/>')
    c += flor(12, 80, 7, ROSA) + flor(148, 80, 7, "#f0a040")
    c += f'<path d="M74,6 L80,16 L86,6 Z" fill="{NARANJA}" stroke="{CAFE}" stroke-width="1.4"/>'
    return svg(160, 88, c)


def panel_fecha():
    """placa 128x40 (nine-patch, márgenes 18) para «Primavera · Día 14 · 9:00»"""
    c = (f'<rect x="2" y="2" width="124" height="36" rx="18" fill="{CREMA}" stroke="{CAFE}" stroke-width="2.6"/>'
         f'<rect x="8" y="5" width="112" height="6" rx="3" fill="#ffffff" opacity="0.8"/>')
    return svg(128, 40, c)


def icono_estacion(est):
    if est == "primavera":
        c = flor(16, 16, 12, ROSA)
    elif est == "verano":
        c = f'<circle cx="16" cy="16" r="8" fill="#ffd040" stroke="{CAFE}" stroke-width="1.4"/>' + "".join(
            f'<line x1="{16 + math.cos(a) * 11:.1f}" y1="{16 + math.sin(a) * 11:.1f}" x2="{16 + math.cos(a) * 14:.1f}" y2="{16 + math.sin(a) * 14:.1f}" stroke="#f0a020" stroke-width="2.4" stroke-linecap="round"/>'
            for a in [i * math.tau / 8 for i in range(8)])
    elif est == "otono":
        c = (f'<path d="M16,3 L19,11 L27,9 L22,16 L28,21 L19,21 L16,29 L13,21 L4,21 L10,16 L5,9 L13,11 Z" fill="#e8803a" stroke="{CAFE}" stroke-width="1.3" stroke-linejoin="round"/>'
             f'<line x1="16" y1="12" x2="16" y2="30" stroke="{CAFE}" stroke-width="1.4"/>')
    else:
        c = "".join(f'<line x1="{16 + math.cos(a) * 3:.1f}" y1="{16 + math.sin(a) * 3:.1f}" x2="{16 + math.cos(a) * 13:.1f}" y2="{16 + math.sin(a) * 13:.1f}" stroke="#7ab0e0" stroke-width="3" stroke-linecap="round"/>'
                    for a in [i * math.tau / 6 for i in range(6)]) + f'<circle cx="16" cy="16" r="3.4" fill="#ffffff" stroke="#7ab0e0" stroke-width="1.4"/>'
    return svg(32, 32, c)


def icono_clima(cl):
    nube = f'<path d="M8,22 a5,5 0 0 1 2,-9 a7,7 0 0 1 13,-1 a5,5 0 0 1 2,10 Z" fill="#f4f4fa" stroke="{CAFE}" stroke-width="1.3"/>'
    if cl == "sol":
        return icono_estacion("verano")
    if cl == "nublado":
        c = f'<circle cx="21" cy="11" r="6" fill="#ffd040" stroke="{CAFE}" stroke-width="1.2"/>' + nube
    elif cl == "lluvia":
        c = nube + "".join(f'<line x1="{11 + i * 5}" y1="25" x2="{9 + i * 5}" y2="30" stroke="{AZUL}" stroke-width="2.2" stroke-linecap="round"/>' for i in range(3))
    elif cl == "tormenta":
        c = nube.replace("#f4f4fa", "#b8b8c8") + f'<path d="M17,22 L13,28 L17,28 L14,32 L21,25 L17,25 L19,22 Z" fill="#ffd040" stroke="{CAFE}" stroke-width="1"/>'
    else:  # nieve
        c = nube + "".join(f'<circle cx="{11 + i * 5}" cy="{27 + (i % 2) * 2}" r="1.8" fill="#ffffff" stroke="#7ab0e0" stroke-width="1"/>' for i in range(3))
    return svg(32, 32, c)


# ---------------------------------------------------------- minimapa, avisos, letreros
def marco_minimapa():
    """marco 160x160 (nine-patch, márgenes 28): madera redondeada con hueco transparente"""
    defs = '<mask id="h"><rect width="160" height="160" fill="white"/><rect x="18" y="18" width="124" height="124" rx="14" fill="black"/></mask>'
    c = (f'<rect x="2" y="2" width="156" height="156" rx="26" fill="{MADERA}" stroke="{CAFE}" stroke-width="3" mask="url(#h)"/>'
         f'<rect x="18" y="18" width="124" height="124" rx="14" fill="none" stroke="{CAFE}" stroke-width="2.6"/>'
         f'<rect x="6" y="6" width="148" height="6" rx="3" fill="#ffffff" opacity="0.25"/>')
    for x, y in ((12, 12), (148, 12), (12, 148), (148, 148)):
        c += flor(x, y, 8, ROSA if x == y else "#f0a040")
    c += f'<path d="M80,4 L86,14 L80,12 L74,14 Z" fill="{ROJO}" stroke="{CAFE}" stroke-width="1"/>'  # norte
    return svg(160, 160, c, defs)


def aviso():
    """aviso emergente 160x48 (nine-patch, márgenes 24) con lugar para un ícono a la izquierda"""
    c = (f'<rect x="2" y="2" width="156" height="44" rx="22" fill="{CREMA}" stroke="{CAFE}" stroke-width="2.6"/>'
         f'<circle cx="24" cy="24" r="16" fill="{CREMA2}" stroke="#d8a878" stroke-width="1.6"/>'
         f'<rect x="44" y="6" width="104" height="6" rx="3" fill="#ffffff" opacity="0.8"/>')
    return svg(160, 48, c)


def letrero():
    """letrero de edificio 128x56 (nine-patch, márgenes 24 a los lados, 16 arriba/abajo): tabla con dos postes y florecitas"""
    c = ''
    for x in (22, 106):
        c += f'<rect x="{x - 3}" y="30" width="6" height="26" rx="2" fill="{MADERA2}" stroke="{CAFE}" stroke-width="1.6"/>'
    c += (f'<rect x="3" y="3" width="122" height="34" rx="10" fill="{MADERA}" stroke="{CAFE}" stroke-width="2.6"/>'
          f'<rect x="8" y="7" width="112" height="26" rx="7" fill="{CREMA}" stroke="#d8a878" stroke-width="1.2"/>')
    c += flor(8, 8, 5, ROSA) + flor(120, 8, 5, "#f0a040")
    return svg(128, 56, c)


def tecla(t="E"):
    """chapita de tecla 28x28 para «E — Hablar»"""
    c = (f'<rect x="2" y="2" width="24" height="24" rx="7" fill="{CREMA}" stroke="{CAFE}" stroke-width="2"/>'
         f'<rect x="2" y="20" width="24" height="6" rx="3" fill="#e8d0b0"/>'
         f'<text x="14" y="19" text-anchor="middle" font-family="Arial, sans-serif" font-weight="900" font-size="14" fill="{CAFE}">{t}</text>')
    return svg(28, 28, c)


def cacao():
    """ícono de la moneda: grano de cacao"""
    c = (f'<ellipse cx="16" cy="16" rx="8" ry="12" fill="#8a4a2a" stroke="{CAFE2}" stroke-width="1.4" transform="rotate(25 16 16)"/>'
         f'<path d="M12,8 Q16,16 20,24" fill="none" stroke="#c8784a" stroke-width="1.6" transform="rotate(5 16 16)"/>'
         f'<ellipse cx="12" cy="11" rx="2" ry="3" fill="#ffffff" opacity="0.4" transform="rotate(25 16 16)"/>')
    return svg(32, 32, c)


PIEZAS = {
    "casilla": casilla(), "casilla_activa": casilla(True), "barra_fondo": barra_fondo(), "numero_tecla": numero_tecla(),
    "marco_barra": marco_barra(), "relleno_vida": relleno(ROJO, "#a83020"), "relleno_energia": relleno(OCRE, "#c08010"),
    "relleno_agua": relleno(AZUL, "#3a6aa8"), "icono_vida": icono_vida(), "icono_energia": icono_energia(), "icono_agua": icono_agua(),
    "panel_estado": panel_estado(), "disco_dia_noche": disco_dia_noche(), "marco_reloj": marco_reloj(), "panel_fecha": panel_fecha(),
    "marco_minimapa": marco_minimapa(), "aviso": aviso(), "letrero": letrero(), "tecla_e": tecla("E"), "tecla_q": tecla("Q"),
    "tecla_esc": tecla("Esc").replace('font-size="14"', 'font-size="9"'), "cacao": cacao(),
}
for e in ("primavera", "verano", "otono", "invierno"):
    PIEZAS[f"estacion_{e}"] = icono_estacion(e)
for cl in ("sol", "nublado", "lluvia", "tormenta", "nieve"):
    PIEZAS[f"clima_{cl}"] = icono_clima(cl)

if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for n, s in PIEZAS.items():
        open(os.path.join(out, n + ".svg"), "w").write(s)
    print("listo", len(PIEZAS))
