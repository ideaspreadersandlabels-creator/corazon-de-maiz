"""Genera los estilos de menú (Talavera, Obsidiana y jade, Terracota y crema, Papel amate) para Godot.
Cada estilo: <tema>_frame.svg (128, nueve cortes, margen 30 / 40 en Talavera), <tema>_button.svg y
<tema>_button_active.svg (64×40, margen 11), <tema>_surface.svg (64, se repite) y <tema>_background.svg
(192×108, se repite). Las partes del medio están hechas para repetirse sin costuras (TILE_FIT).
Uso: python3 temas.py <carpeta de salida>"""
import sys, os, math, random
out = sys.argv[1]; os.makedirs(out, exist_ok=True)
K = '#1a1410'
def svg(w, h, body): return f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{body}</svg>\n'
def guarda(n, s): open(os.path.join(out, n), 'w').write(s)
def r(x, y, w, h, fill, extra=''): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" {extra}/>'
def marco_lineas(m, cols):
    """Líneas concéntricas rectas (se estiran bien en nueve cortes). cols=[(inset, ancho, color)]"""
    return ''.join(f'<rect x="{i + w / 2}" y="{i + w / 2}" width="{128 - 2 * i - w}" height="{128 - 2 * i - w}" fill="none" stroke="{c}" stroke-width="{w}"/>' for i, w, c in cols)
def a_lo_largo(m, periodo, y, motivo):
    """Repite un motivo sobre los 4 lados en la zona que se repite (de m a 128-m)."""
    g = ''
    n = int((128 - 2 * m) / periodo)
    for k in range(n):
        t = m + periodo * (k + .5)
        for (x, yy, rot) in [(t, y, 0), (t, 128 - y, 180), (y, t, -90), (128 - y, t, 90)]:
            g += f'<g transform="translate({x:.1f} {yy:.1f}) rotate({rot})">{motivo}</g>'
    return g
def esquinas(motivo, c):
    return ''.join(f'<g transform="translate({x} {y})">{motivo}</g>' for x, y in [(c, c), (128 - c, c), (c, 128 - c), (128 - c, 128 - c)])
def boton(fondo, borde, interior, adorno=''):
    return svg(64, 40, f'<rect x="1.5" y="1.5" width="61" height="37" rx="7" fill="{fondo}" stroke="{borde}" stroke-width="3"/>'
               f'<rect x="5" y="5" width="54" height="30" rx="4" fill="none" stroke="{interior}" stroke-width="1.4"/>{adorno}')
def puntos_boton(c): return ''.join(f'<circle cx="{x}" cy="{y}" r="1.6" fill="{c}"/>' for x, y in [(8, 8), (56, 8), (8, 32), (56, 32)])

# ---------- TALAVERA (margen 40) ----------
C, O, CR = '#1b3a8a', '#d39a26', '#fbf7ee'
flor = lambda s, c1, c2: ''.join(f'<ellipse cx="0" cy="{-s * .55}" rx="{s * .32}" ry="{s * .48}" transform="rotate({a})" fill="{c1}"/>' for a in (0, 90, 180, 270)) + \
    ''.join(f'<ellipse cx="0" cy="{-s * .5}" rx="{s * .16}" ry="{s * .3}" transform="rotate({a})" fill="{c2}"/>' for a in (45, 135, 225, 315)) + f'<circle r="{s * .22}" fill="{O}"/>'
body = r(0, 0, 128, 128, CR, 'rx="6"') + r(3, 3, 122, 122, C, 'rx="4"') + r(9, 9, 110, 110, CR)
body += a_lo_largo(40, 12, 14.5, f'<path d="M0 -4 L4 0 L0 4 L-4 0Z" fill="{C}"/><circle cx="6" cy="0" r="1.3" fill="{O}"/>')
body += marco_lineas(40, [(20, 2.4, O), (24, 3, C)]) + r(27, 27, 74, 74, CR)
body += esquinas(f'<circle r="11" fill="{CR}" stroke="{C}" stroke-width="2"/>' + flor(16, C, '#3d7a46'), 14.5)
body += '<rect x="1" y="1" width="126" height="126" rx="6" fill="none" stroke="#3a2416" stroke-width="2"/>'
guarda('talavera_frame.svg', svg(128, 128, body))
guarda('talavera_button.svg', boton(CR, O, C, puntos_boton(C)))
guarda('talavera_button_active.svg', boton(C, O, O, puntos_boton(O)))
sup = r(0, 0, 64, 64, CR) + f'<g transform="translate(32 32)" opacity=".2">{flor(26, C, "#3d7a46")}</g>' + ''.join(f'<g transform="translate({x} {y})" opacity=".2"><path d="M0 -6 L6 0 L0 6 L-6 0Z" fill="{C}"/></g>' for x, y in [(0, 0), (64, 0), (0, 64), (64, 64)])
guarda('talavera_surface.svg', svg(64, 64, sup))
bg = r(0, 0, 192, 108, '#f2ead8')
for i in range(4):
    for j in range(2):
        x, y = 24 + i * 48, 27 + j * 54
        bg += f'<g transform="translate({x} {y})"><rect x="-23" y="-26" width="46" height="52" fill="{CR}" stroke="#cfc5b2" stroke-width="1"/><g opacity=".85">{flor(30, C, "#3d7a46")}</g></g>'
        for cx, cy in [(-24, -27), (24, -27), (-24, 27), (24, 27)]:
            bg += f'<circle cx="{x + cx}" cy="{y + cy}" r="7" fill="{C}" opacity=".8"/><circle cx="{x + cx}" cy="{y + cy}" r="3" fill="{O}"/>'
guarda('talavera_background.svg', svg(192, 108, bg))

# ---------- OBSIDIANA Y JADE (margen 30) ----------
OB, OB2, J, J2, G = '#111e22', '#1d2f34', '#3fb594', '#2a8a6e', '#d8b96c'
body = r(0, 0, 128, 128, '#0a1214', 'rx="8"') + r(4, 4, 120, 120, OB2, 'rx="6"')
body += marco_lineas(30, [(5, 1.4, G), (10, 9, J2), (20, 1.6, G)])
body += a_lo_largo(30, 17, 14.5, f'<circle r="4.2" fill="{J}" stroke="{K}" stroke-width="1"/><circle cx="-1.3" cy="-1.3" r="1.3" fill="#a8f0d8"/>')
body += r(22, 22, 84, 84, OB) + ''.join(f'<path d="M{22 + a} 22 L22 {22 + a}" stroke="#2a4248" stroke-width="1" opacity=".5"/>' for a in (17, 51))
body += esquinas(f'<circle r="11" fill="{J}" stroke="{G}" stroke-width="2.4"/><circle r="5" fill="{OB}" stroke="{G}" stroke-width="1.4"/><circle cx="-3.5" cy="-4" r="2" fill="#a8f0d8"/>', 15)
guarda('obsidian_frame.svg', svg(128, 128, body))
guarda('obsidian_button.svg', boton(OB2, G, J, puntos_boton(J)))
guarda('obsidian_button_active.svg', boton(J2, G, '#a8f0d8', puntos_boton(G)))
sup = r(0, 0, 64, 64, OB) + '<path d="M0 64 L64 0" stroke="#24383e" stroke-width="10" opacity=".55"/><path d="M-16 16 L16 -16 M48 80 L80 48" stroke="#24383e" stroke-width="10" opacity=".55"/><path d="M14 64 L64 14" stroke="#2c444a" stroke-width="1.4" opacity=".7"/>'
sup += ''.join(f'<circle cx="{x}" cy="{y}" r=".9" fill="#3a5a60"/>' for x, y in [(10, 12), (40, 22), (22, 44), (54, 50), (32, 6)])
guarda('obsidian_surface.svg', svg(64, 64, sup))
bg = r(0, 0, 192, 108, '#0d171a')
for i in range(5):
    for j in range(3):
        x, y = i * 48, j * 54
        bg += f'<path d="M{x} {y - 27} L{x + 24} {y} L{x} {y + 27} L{x - 24} {y}Z" fill="none" stroke="{J2}" stroke-width="1.4" opacity=".55"/>'
        bg += f'<circle cx="{x}" cy="{y}" r="4" fill="{J}" opacity=".7"/><circle cx="{x + 24}" cy="{y + 27}" r="2.2" fill="{G}" opacity=".6"/>'
guarda('obsidian_background.svg', svg(192, 108, bg))

# ---------- TERRACOTA Y CREMA (margen 30) ----------
T, T2, CRE, OC = '#9f482e', '#7a3420', '#f2dfc4', '#bc813d'
grec = lambda c: f'<path d="M-8.5 4 h4 v-5 h5 v-3 h-3 v3" fill="none" stroke="{c}" stroke-width="1.8"/><path d="M0 4 h4 v-5 h5 v-3 h-3 v3" fill="none" stroke="{c}" stroke-width="1.8"/>'
body = r(0, 0, 128, 128, T2, 'rx="10"') + r(3, 3, 122, 122, T, 'rx="8"')
body += marco_lineas(30, [(5, 1.6, OC), (21, 2.4, OC), (24, 1.6, T2)])
body += a_lo_largo(30, 17, 14, f'<g transform="translate(-4.25 0)">{grec(CRE)}</g>')
body += r(25, 25, 78, 78, CRE)
body += esquinas(f'<rect x="-10" y="-10" width="20" height="20" fill="{CRE}" stroke="{T2}" stroke-width="1.6"/><path d="M-5 5 V-5 H5 V2 H-1 V-1 H2" fill="none" stroke="{T}" stroke-width="2.2"/>', 14)
guarda('terracotta_frame.svg', svg(128, 128, body))
guarda('terracotta_button.svg', boton(CRE, T, OC, puntos_boton(T)))
guarda('terracotta_button_active.svg', boton('#fbeedc', T2, T, puntos_boton(T2) + '<rect x="9" y="30" width="46" height="2.4" fill="#9f482e"/>'))
sup = r(0, 0, 64, 64, CRE) + ''.join(f'<circle cx="{x}" cy="{y}" r="{rr}" fill="#d9b994" opacity=".55"/>' for x, y, rr in [(8, 10, 1.2), (30, 20, .9), (50, 8, 1.1), (18, 44, 1.3), (44, 38, 1), (58, 56, 1.2), (6, 58, .8)]) + '<path d="M0 32 h64" stroke="#e4c9a4" stroke-width="1"/>'
guarda('terracotta_surface.svg', svg(64, 64, sup))
bg = r(0, 0, 192, 108, '#e9cfab')
for j in range(2):
    y = j * 54
    bg += r(0, y + 18, 192, 18, T, 'opacity=".85"') + ''.join(f'<g transform="translate({4.25 + k * 17} {y + 27})">{grec(CRE)}</g>' for k in range(12))
    bg += ''.join(f'<path d="M{x} {y + 44} l6 -6 l6 6 l-6 6z" fill="{OC}" opacity=".6"/>' for x in range(0, 192, 24))
guarda('terracotta_background.svg', svg(192, 108, bg))

# ---------- PAPEL AMATE (margen 30) ----------
P, P2, TI, RO = '#d6bd87', '#c8aa6e', '#382d21', '#9a4b2e'
random.seed(4)
fibras = lambda w, h, n, sx=0, sy=0: ''.join(f'<path d="M{sx + random.uniform(0, w):.1f} {sy + random.uniform(0, h):.1f} q{random.uniform(-6, 6):.1f} {random.uniform(-3, 3):.1f} {random.uniform(8, 18):.1f} {random.uniform(-2, 2):.1f}" stroke="{random.choice(["#b89a62", "#e4cfa0", "#a88a54"])}" stroke-width="{random.uniform(.6, 1.4):.1f}" fill="none" opacity=".7"/>' for _ in range(n))
body = r(0, 0, 128, 128, P2) + r(2, 2, 124, 124, P)
body += marco_lineas(30, [(6, 2.6, TI), (10, 5, RO), (16, 1.4, TI)])
body += a_lo_largo(30, 17, 21, f'<circle r="2" fill="{TI}"/>')
body += esquinas(f'<circle r="10" fill="{P}" stroke="{TI}" stroke-width="2"/>' + ''.join(f'<path d="M0 0 L{7 * math.cos(a):.1f} {7 * math.sin(a):.1f}" stroke="{RO}" stroke-width="2"/>' for a in [k * math.pi / 4 for k in range(8)]) + f'<circle r="3.4" fill="{RO}" stroke="{TI}" stroke-width="1.2"/>', 13)
body += r(25, 25, 78, 78, P) + fibras(68, 68, 22, 30, 30)
guarda('amate_frame.svg', svg(128, 128, body))
guarda('amate_button.svg', boton(P, TI, RO, puntos_boton(TI)))
guarda('amate_button_active.svg', boton('#e6d2a0', RO, TI, puntos_boton(RO) + f'<path d="M10 31 h44" stroke="{RO}" stroke-width="2"/>'))
random.seed(9)
sup = r(0, 0, 64, 64, P)
for _ in range(26):
    x, y = random.uniform(0, 64), random.uniform(0, 64); dx, dy = random.uniform(8, 16), random.uniform(-2, 2); c = random.choice(['#b89a62', '#e4cfa0', '#a88a54']); w = random.uniform(.6, 1.3)
    for ox in (0, -64, 64):
        for oy in (0, -64, 64):
            sup += f'<path d="M{x + ox:.1f} {y + oy:.1f} l{dx:.1f} {dy:.1f}" stroke="{c}" stroke-width="{w:.1f}" opacity=".7"/>'
guarda('amate_surface.svg', svg(64, 64, sup))
random.seed(12)
bg = r(0, 0, 192, 108, P)
for _ in range(70):
    x, y = random.uniform(0, 192), random.uniform(0, 108); dx, dy = random.uniform(10, 22), random.uniform(-3, 3); c = random.choice(['#b89a62', '#e4cfa0', '#a88a54'])
    for ox in (0, -192, 192):
        for oy in (0, -108, 108):
            bg += f'<path d="M{x + ox:.1f} {y + oy:.1f} l{dx:.1f} {dy:.1f}" stroke="{c}" stroke-width="1" opacity=".6"/>'
for x, y in [(48, 27), (144, 81)]:
    bg += f'<g transform="translate({x} {y})" opacity=".22"><circle r="12" fill="none" stroke="{TI}" stroke-width="2"/>' + ''.join(f'<path d="M0 0 L{9 * math.cos(a):.1f} {9 * math.sin(a):.1f}" stroke="{RO}" stroke-width="2"/>' for a in [k * math.pi / 4 for k in range(8)]) + '</g>'
guarda('amate_background.svg', svg(192, 108, bg))
print('listo', len(os.listdir(out)), 'archivos')
