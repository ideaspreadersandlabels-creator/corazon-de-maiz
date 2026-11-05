"""Animales, mascotas y criaturas en estilo ACOGEDOR (mismos nombres y tamaños del paquete anterior).
Todos miran a la derecha. Coordenadas a la mitad del PNG (el PNG sale al doble).
Uso: python3 fauna.py <salida_dir>
"""
import math, os, sys
import anime as A

A.usar_estilo("acogedor")
from anime import elipse, capsula, poli, suave, mezcla

LW = 1.1
OJO = "#2a1a14"
RUBOR = "#ec7a6e"


class C(A.Lienzo):
    def __init__(self, w, h):
        super().__init__(w, h)

    def p(self, d, base, **k):
        k.setdefault("lw", LW)
        k.setdefault("desp", (1.4, 1.0))
        self.parte(d, base, **k)

    def m(self, segs, base):
        self.miembro(segs, base, lw=LW)

    def svg2x(self):
        s = self.svg()
        return s.replace(f'width="{self.w}" height="{self.h}"', f'width="{self.w * 2}" height="{self.h * 2}"', 1)


def ojo(L, x, y, r=2.2, cerrado=False, rubor=True):
    if cerrado:
        L.trazo(f"M{x - r},{y} Q{x},{y + r * 0.9} {x + r},{y}", OJO, 1.0)
    else:
        L.plano(elipse(x, y, r * 0.85, r), OJO)
        L.plano(elipse(x + r * 0.3, y - r * 0.4, r * 0.38, r * 0.38), "#ffffff")
        L.plano(elipse(x - r * 0.3, y + r * 0.45, r * 0.16, r * 0.16), "#ffffff", op=0.9)
    if rubor:
        L.plano(elipse(x - r * 0.4, y + r * 1.6, r * 1.1, r * 0.55), RUBOR, op=0.45)


def sombra(L, cx, y, rx):
    L.raw(f'<ellipse cx="{cx}" cy="{y}" rx="{rx}" ry="{rx * 0.18:.1f}" fill="#000" opacity="0.16"/>')


def patas(L, f, cadera, hombro, y0, largo, ancho, col, casco, suelo, paso=0.32):
    """4 patas: f=0 quieto, 1 y 2 caminando. Lejanas primero (más oscuras)"""
    s = [0, 1, -1][f]
    angs = {"hl": -s * paso, "hc": s * paso, "dl": s * paso, "dc": -s * paso}
    def una(x, a, lejos):
        c = A.lejos(col) if lejos else col
        k = (x + math.sin(a) * largo * 0.5, y0 + math.cos(a) * largo * 0.5)
        fin = (k[0] + math.sin(a * 0.4) * largo * 0.5, min(suelo - 1.2, k[1] + largo * 0.5))
        L.m([((x, y0), k, ancho), (k, fin, ancho * 0.8)], c)
        if casco:
            L.p(elipse(fin[0] + 0.6, fin[1] + 0.6, ancho * 0.55, ancho * 0.35), A.lejos(casco) if lejos else casco)
    una(cadera - 3, angs["hl"], True)
    una(hombro - 3, angs["dl"], True)
    return lambda: (una(cadera, angs["hc"], False), una(hombro, angs["dc"], False))


# ------------------------------------------------------------------ animales de granja y monte
def bisonte(f=0):
    L = C(80, 60)
    sombra(L, 40, 57, 30)
    cerca = patas(L, f, 26, 52, 40, 15, 6, "#4a3226", "#2a1a14", 57, 0.42)
    b = -0.6 if f else 0
    L.p(elipse(30, 32 + b, 22, 14), "#6a4a34")
    L.p(suave([(18, 22), (26, 20), (34, 18), (34, 30), (20, 30)]), "#5a3c2a")
    L.p(elipse(29, 22 + b, 10, 7), "#7a5640")                      # joroba
    L.p(elipse(50, 30 + b, 15, 18), "#4a3226")                      # melena
    for k in range(6):
        L.trazo(f"M{42 + k * 3},{18 + b + (k % 2) * 2} q2,6 0,12", "#3a2418", 0.8, op=0.7)
    L.p(capsula((10, 30 + b), (5, 42 + b), 1.8, 1.4), "#4a3226")
    L.p(elipse(5, 43 + b, 2.6, 3.4), "#2a1a14")
    cerca()
    L.p(elipse(64, 37 + b, 12, 11), "#4a3226")                       # cabeza
    L.p(elipse(70, 42 + b, 5.6, 4.6), "#6a5040")                    # hocico
    L.plano(elipse(73, 41 + b, 1, 0.8), "#2a1a14")
    L.p(suave([(60, 44), (66, 46), (63, 52), (59, 49)]), "#3a2418")  # barba
    for s_ in (-1, 1):
        L.p(f"M{60 + s_ * 3},{30 + b} q{-s_ * 2 + 4},-6 {2 + s_ * 3},-8 q-1,4 -2,7 Z", "#e8dcc0")
    ojo(L, 67, 34 + b, 2.5)
    return L


def caballo(f=0, pelo="#9a5a32", crin="#2a1c18", casco="#3a2a22", modo="", L=None):
    L = L or C(80, 64)
    sombra(L, 38, 61, 28)
    b = -0.6 if f else 0
    echado = modo == "dormir"
    if echado:
        L.ini("translate(0 18)")
        for x in (28, 46):
            L.p(elipse(x, 41, 9, 3.6), A.lejos(pelo))
        cerca = lambda: None
    else:
        cerca = patas(L, f, 24, 48, 37, 23, 5.4, pelo, casco, 61, 0.45)
    L.p(suave([(14, 20 + b), (6, 30), (8, 44), (14, 40), (16, 30)]), crin)   # cola
    L.p(elipse(36, 32 + b, 21, 11.5), pelo)
    L.plano(elipse(36, 39 + b, 14, 4), "#ffffff", op=0.12)
    cerca()
    L.ini("rotate(62 50 28)" if modo == "comer" else ("rotate(20 50 28)" if echado else ""))
    L.m([((50, 28 + b), (60, 14 + b), 11)], pelo)                             # cuello
    L.p(suave([(48, 24 + b), (54, 8 + b), (60, 4 + b), (58, 12 + b), (52, 26 + b)]), crin)
    L.p(elipse(65, 14 + b, 11, 9, 0.35), pelo)                              # cabeza
    L.p(elipse(72, 20 + b, 5.6, 4.8, 0.3), mezcla(pelo, "#ffffff", 0.18))
    L.plano(elipse(73.5, 19 + b, 0.9, 0.7), "#2a1a14")
    L.p(poli([(60, 8 + b), (61, 1 + b), (64, 7 + b)]), pelo)
    L.p(suave([(58, 9 + b), (63, 3 + b), (66, 7 + b), (62, 11 + b)]), crin)  # copete
    ojo(L, 65, 12 + b, 2.6, cerrado=echado)
    L.fin()
    if echado:
        L.fin()
    return L


def conejo(salto=False):
    L = C(40, 42)
    sombra(L, 20, 40, 12)
    y = -6 if salto else 0
    col = "#b8a48a"
    if salto:
        L.m([((12, 30 + y), (4, 36 + y), 4.6)], A.lejos(col))
        L.m([((24, 31 + y), (32, 36 + y), 3.2)], col)
    L.p(elipse(17, 29 + y, 11 if not salto else 12.5, 8.5 if not salto else 7), col)
    L.p(elipse(6.5, 27 + y, 3.4, 3.4), "#f4eee2")                 # colita
    if not salto:
        L.p(elipse(13, 37, 5.4, 2.4), A.lejos(col))
        L.p(elipse(25, 37.5, 3.6, 2), col)
    L.plano(elipse(19, 33 + y, 7, 3), "#f4eee2", op=0.6)
    for x, a in ((23, -0.25), (27, 0.05)):                         # orejas
        L.p(capsula((x, 18 + y), (x + math.sin(a) * 12, 18 + y - 12), 2.6, 2.4), col)
        L.plano(capsula((x, 17 + y), (x + math.sin(a) * 11, 18 + y - 11), 1.1, 1.0), "#e8a8a0")
    L.p(elipse(27, 21 + y, 7.5, 6.5), col)
    L.plano(elipse(33.6, 22.5 + y, 1, 0.8), "#c06070")
    ojo(L, 29, 20 + y, 1.8)
    return L


def guajolote(modo="quieto"):
    L = C(48, 50)
    sombra(L, 22, 47, 13)
    cuerpo = "#4a3a34"
    f = {"caminar_1": 1, "caminar_2": 2}.get(modo, 0)
    if modo == "abanico":
        for k in range(9):                                          # cola en abanico
            a = math.pi * (0.95 + 0.9 * k / 8)
            L.p(capsula((16, 28), (16 + math.cos(a) * 22, 28 + math.sin(a) * 20), 2.4, 4.4), ["#6a4a3a", "#5a3c30"][k % 2])
            L.plano(elipse(16 + math.cos(a) * 20, 28 + math.sin(a) * 18, 1.8, 1.8), "#e8d8b0", op=0.9)
    else:
        L.p(suave([(10, 22), (2, 20), (3, 30), (11, 33)]), "#5a3c30")
    s = [0, 1, -1][f]
    for k, x in enumerate((19, 25)):
        dx = (s if k else -s) * 2.5
        c = "#d08a7a" if k else A.lejos("#d08a7a")
        L.m([((x, 38), (x + dx, 45), 2.0)], c)
        L.trazo(f"M{x + dx - 2},{45.5} l4,0", c, 1.4)
    L.p(elipse(21, 30, 13, 10.5), cuerpo)
    for r in range(3):                                              # plumas en escamas
        for k in range(4):
            x, yy = 13 + k * 5 + (r % 2) * 2.5, 25 + r * 4.5
            L.trazo(f"M{x - 2},{yy} q2,2.4 4,0", "#7a8a6a", 0.8, op=0.8)
    L.p(suave([(14, 28), (22, 26), (28, 32), (20, 36)]), "#3a2c28")  # ala
    pico = (40, 40) if modo == "picotea" else (35, 12)
    L.m([((29, 26), (pico[0] - 2, pico[1] + 4), 4.4)], "#9ab0c8")      # cuello pelón azulado
    L.p(elipse(pico[0], pico[1], 5, 4.6), "#a8c0d8")
    L.p(suave([(pico[0] + 1, pico[1] + 2), (pico[0] + 3, pico[1] + 3), (pico[0] + 2, pico[1] + 8), (pico[0], pico[1] + 6)]), "#d03a3a")  # moco
    L.p(poli([(pico[0] + 4, pico[1] - 1), (pico[0] + 8, pico[1] + 0.5), (pico[0] + 4, pico[1] + 1.5)]), "#e0b040")
    ojo(L, pico[0] + 1, pico[1] - 1, 1.6, cerrado=(modo == "dormir"))
    return L


def pato(modo="quieto"):
    L = C(44, 36)
    nada = "nadando" in modo
    cria = "cria" in modo
    f = {"caminar_1": 1, "caminar_2": 2}.get(modo, 0)
    k = 0.62 if cria else 1.0
    ox, oy = (8, 9) if cria else (0, 0)
    sombra(L, 21, 33, 11 * k) if not nada else None
    T = lambda x, y: (ox + x * k, oy + y * k + (33 - 33 * k) * (1 if cria else 0) * 0.6)
    cuerpo, cabeza = ("#f2d65a", "#f2d65a") if cria else ("#2a2a32", "#2a2a32")
    if not nada and modo != "dormir":
        s = [0, 1, -1][f]
        for j, x in enumerate((17, 23)):
            a, b = T(x, 28), T(x + (s if j else -s) * 2.4, 32)
            L.m([(a, b, 2.0 * k)], "#e8902a" if j else A.lejos("#e8902a"))
            L.p(elipse(b[0] + 1.4, b[1] + 0.6, 2.6 * k, 1.1 * k), "#e8902a")
    c = T(20, 23)
    L.p(elipse(c[0], c[1], 11 * k, 7.5 * k), cuerpo)
    if not cria:
        L.p(suave([T(13, 20), T(22, 19), T(26, 24), T(16, 26)]), "#f4eee2")   # ala blanca
    L.p(poli([T(9, 21), T(4, 17), T(10, 25)]), cuerpo)
    h = T(30, 13)
    L.p(elipse(h[0], h[1], 6.4 * k, 6 * k), cabeza)
    if not cria:
        L.plano(elipse(h[0] + 1.6, h[1] + 1, 2.4, 2), "#d04040", op=0.9)
    L.p(suave([(h[0] + 4.6 * k, h[1] + 0.5 * k), (h[0] + 10 * k, h[1] + 1.4 * k), (h[0] + 9.6 * k, h[1] + 3.2 * k), (h[0] + 4.6 * k, h[1] + 3 * k)]), "#e8902a")
    ojo(L, h[0] + 1.2 * k, h[1] - 1.2 * k, 1.7 * k if not cria else 1.4, rubor=True, cerrado=(modo == "dormir"))
    if nada:  # agua
        y = T(20, 27)[1]
        L.raw(f'<rect x="0" y="{y}" width="44" height="{36 - y}" fill="#6ab0d8" opacity="0.85"/>')
        L.trazo(f"M2,{y} q4,-2 8,0 t8,0 t8,0 t8,0 t8,0", "#e8f4fa", 1.2)
    return L


def venado(macho=False, f=0, modo="", manchas=False, L=None):
    L = L or C(64, 70)
    sombra(L, 30, 67, 18)
    col = "#b07a4a"
    b = -0.5 if f else 0
    cerca = patas(L, f, 20, 40, 42, 23, 3.8, col, "#3a2a22", 67, 0.45)
    L.p(elipse(10, 36 + b, 3, 3.6), "#f4eee2")
    L.p(elipse(30, 38 + b, 17, 9.5), col)
    L.plano(elipse(30, 44 + b, 12, 3), "#f4e6d0", op=0.7)
    if manchas:
        for (x, y) in ((22, 34), (28, 32), (34, 34), (26, 38), (38, 33), (31, 37)):
            L.plano(elipse(x, y + b, 1.6, 1.3), "#f8eedc")
    cerca()
    L.ini("rotate(70 42 33)" if modo == "comer" else "")
    L.m([((42, 33 + b), (47, 22 + b), 7.5)], col)
    L.p(elipse(49, 20 + b, 9.4, 8.4, 0.25), col)
    L.p(elipse(56, 24 + b, 4.2, 3.4), mezcla(col, "#ffffff", 0.25))
    L.plano(elipse(57.6, 22.5 + b, 1, 0.8), "#2a1a14")
    for x, a in ((44, -0.9), (47, -0.55)):
        L.p(elipse(x + math.sin(a) * 5, 14 + b, 2.4, 5, a), col)
        L.plano(elipse(x + math.sin(a) * 5, 14.4 + b, 1.0, 3, a), "#e8b8a0")
    if macho:
        for s_, x in ((-1, 45), (1, 50)):
            L.trazo(f"M{x},{14 + b} q{s_ * 2},-8 {s_ * 1},-12 M{x + s_ * 1},{8 + b} l{s_ * 4},-3 M{x + s_ * 1.4},{4 + b} l{-s_ * 3},-3", "#5a3a22", 2.6)
            L.trazo(f"M{x},{14 + b} q{s_ * 2},-8 {s_ * 1},-12 M{x + s_ * 1},{8 + b} l{s_ * 4},-3 M{x + s_ * 1.4},{4 + b} l{-s_ * 3},-3", "#e8dcc0", 1.4)
    ojo(L, 50.5, 18.5 + b, 2.6)
    L.fin()
    return L


# ------------------------------------------------------------------ mascotas (56x44)
def mascota(tipo, modo="quieto"):
    L = C(56, 44)
    sombra(L, 26, 42, 16)
    f = {"caminar_1": 1, "caminar_2": 2}.get(modo, 0)
    cerrado = modo in ("parpadeo", "dormir")
    if modo == "dormir":
        L.ini("translate(0 10)")
    if tipo == "gato":
        col, cola = "#f4eee2", "#e08a3a"
    elif tipo == "perro":
        col, cola = "#d8b07a", "#d8b07a"
    else:
        col, cola = "#3e3a44", "#3e3a44"
    b = -0.6 if f else 0
    cerca = patas(L, f, 16, 34, 29, 12, 4.4, col, None, 42, 0.48) if modo != "dormir" else (lambda: None)
    # cola
    if tipo == "gato":
        L.p(capsula((10, 26 + b), (4, 12 + b), 2.4, 2.6), cola)
    elif tipo == "perro":
        L.p(capsula((10, 25 + b), (5, 16 + b), 2.4, 2.2), cola)
    else:
        L.p(capsula((10, 26 + b), (3, 30 + b), 1.8, 1.0), cola)
    L.p(elipse(25, 26 + b, 14, 8), col)
    if tipo == "gato":  # manchas de gata calicó
        L.plano(elipse(20, 22 + b, 6, 4), "#e08a3a", op=0.95)
        L.plano(elipse(30, 24 + b, 4, 3), "#3a3236", op=0.9)
    if tipo == "perro":
        L.plano(elipse(25, 31 + b, 9, 3), "#f4eee2", op=0.7)
    cerca()
    hx, hy = 41, 17 + b
    if tipo == "gato":
        for x in (35, 45):
            L.p(poli([(x - 4, hy - 4), (x, hy - 13), (x + 3, hy - 4)]), "#e08a3a" if x == 35 else col)
            L.plano(poli([(x - 2.4, hy - 5), (x, hy - 10.5), (x + 1.6, hy - 5)]), "#f0b0b0")
    elif tipo == "xolo":
        for x in (35, 46):
            L.p(poli([(x - 4, hy - 5), (x - 1, hy - 16), (x + 3, hy - 5)]), col)
            L.plano(poli([(x - 2.4, hy - 6), (x - 1, hy - 13), (x + 1.4, hy - 6)]), "#8a6a7a")
    L.p(elipse(hx, hy, 10, 9), col)
    if tipo == "perro":
        L.p(elipse(hx + 7, hy + 3, 5, 4), "#f4e6d0")
        L.plano(elipse(hx + 11, hy + 1.6, 1.6, 1.3), "#2a1a14")
        L.p(elipse(hx - 6, hy + 1, 3.6, 7, 0.3), "#a8784a")       # oreja caída
        L.plano(elipse(hx + 2, hy - 4, 3, 2), "#a8784a", op=0.8)
    elif tipo == "gato":
        L.plano(elipse(hx + 1, hy - 4, 4, 3), "#3a3236", op=0.85)
        L.plano(poli([(hx + 8.5, hy + 2), (hx + 10, hy + 2), (hx + 9.2, hy + 3.2)]), "#e07080")
        for k in (-1, 1):
            L.trazo(f"M{hx + 8},{hy + 3 + k} l5,{k * 1.5}", "#8a7a70", 0.5)
    else:
        L.p(elipse(hx + 7, hy + 3, 4.6, 3.6), mezcla(col, "#ffffff", 0.12))
        L.plano(elipse(hx + 10.6, hy + 1.8, 1.4, 1.1), "#1a1418")
        L.p(suave([(hx - 4, hy - 9), (hx, hy - 12), (hx + 3, hy - 9), (hx, hy - 7)]), "#d8d0c8")   # copete
        L.raw(f'<path d="M{hx - 8},{hy + 6} Q{hx - 3},{hy + 10} {hx + 3},{hy + 8}" stroke="#2f9e78" stroke-width="2.2" fill="none" stroke-linecap="round"/>')
    if tipo == "perro":
        L.raw(f'<path d="M{hx - 8},{hy + 6} Q{hx - 3},{hy + 10} {hx + 3},{hy + 8}" stroke="#c23a2c" stroke-width="2.2" fill="none" stroke-linecap="round"/>')
    ojo(L, hx + 3.5, hy - 1, 2.3, cerrado=cerrado)
    if tipo == "gato":
        L.trazo(f"M{hx + 7},{hy + 4.5} q1,1 2,0 q1,1 2,0", "#7a2a1e", 0.8)
    else:
        L.trazo(f"M{hx + 8},{hy + 6} q2,1.4 4,0", "#7a2a1e", 0.8)
    if modo == "dormir":
        L.fin()
        L.raw('<text x="46" y="10" font-family="Arial, sans-serif" font-weight="900" font-size="8" fill="#6a8ac8">z</text>')
    return L


# ------------------------------------------------------------------ criaturas
def cangrejo(k=0):
    L = C(32, 32)
    sombra(L, 16, 30, 11)
    col = "#e0503a"
    for s_ in (-1, 1):
        for j in range(3):
            x = 16 + s_ * (6 + j * 2)
            L.m([((16 + s_ * 4, 21), (x + s_ * 3, 25 + j), 1.6), ((x + s_ * 3, 25 + j), (x + s_ * 4, 29), 1.4)], A.lejos(col))
    up = -4 if k else 0
    for s_ in (-1, 1):
        L.m([((16 + s_ * 6, 18), (16 + s_ * 10, 13 + up), 2.4)], col)
        L.p(suave([(16 + s_ * 8, 12 + up), (16 + s_ * 12, 6 + up), (16 + s_ * 14, 10 + up), (16 + s_ * 12, 14 + up)]), col)
        L.p(poli([(16 + s_ * 11, 9 + up), (16 + s_ * 15, 5 + up), (16 + s_ * 13, 11 + up)]), mezcla(col, "#ffffff", 0.15))
    L.p(elipse(16, 21, 9.5, 6.5), col)
    for s_ in (-1, 1):
        L.m([((16 + s_ * 3, 16), (16 + s_ * 3.6, 12), 1.2)], col)
        L.plano(elipse(16 + s_ * 3.6, 11, 1.8, 2.2), OJO)
        L.plano(elipse(16 + s_ * 3.6 + 0.5, 10.3, 0.6, 0.6), "#fff")
    L.plano(elipse(11, 23, 2, 1), RUBOR, op=0.5)
    L.plano(elipse(21, 23, 2, 1), RUBOR, op=0.5)
    L.trazo("M14.5,23.5 q1.5,1.4 3,0", "#7a2a1e", 0.8)
    return L


def tarantula(k=0):
    L = C(32, 32)
    sombra(L, 16, 29, 12)
    col = "#5a3e30"
    for s_ in (-1, 1):
        for j in range(4):
            a = (j - 1.5) * 0.45 + (0.18 if (j + k) % 2 else -0.1)
            x0, y0 = 16 + s_ * 4, 20
            kx, ky = x0 + s_ * (7 + math.cos(a) * 2), y0 - 5 + j * 2.6 + math.sin(a) * 2
            fx, fy = kx + s_ * 4, 28
            L.m([((x0, y0), (kx, ky), 2.2), ((kx, ky), (fx, fy), 1.8)], col if j % 2 else A.lejos(col))
    L.p(elipse(16, 23, 8, 6), "#6a4a3a")
    L.plano(elipse(16, 24.5, 4, 2.4), "#e08a3a", op=0.8)
    L.p(elipse(16, 15, 7, 6), col)
    for s_ in (-1, 1):
        L.plano(elipse(16 + s_ * 2.8, 14, 1.9, 2.2), OJO)
        L.plano(elipse(16 + s_ * 2.8 + 0.6, 13.2, 0.7, 0.7), "#fff")
    L.trazo("M14.6,18 q1.4,1.2 2.8,0", "#2a1a14", 0.8)
    return L


def serpiente(k=0):
    L = C(36, 32)
    sombra(L, 17, 29, 14)
    col, vientre = "#b8884a", "#f0dca0"
    L.p(elipse(15, 25, 12, 4.6), col)                                   # enrollada
    L.p(elipse(14, 21, 9, 4), mezcla(col, "#ffffff", 0.08))
    for j in range(5):
        L.plano(poli([(6 + j * 4, 24), (8 + j * 4, 22), (10 + j * 4, 24), (8 + j * 4, 26)]), "#6a4a2a", op=0.85)
    L.p(capsula((5, 25), (1.5, 18 - k), 1.6, 1.4), col)                 # cascabel
    for j in range(3):
        L.p(elipse(1.5, 17 - k - j * 2.2, 1.6, 1.2), "#e8d8a8")
    sway = [0, 2, -1][k]
    L.m([((18, 20), (24 + sway, 12), 5.4)], col)
    L.p(elipse(26 + sway, 10, 6.6, 5), col)
    L.plano(elipse(27 + sway, 12.5, 4, 1.8), vientre, op=0.8)
    ojo(L, 28 + sway, 8.6, 1.7)
    if k == 1:
        L.trazo(f"M{32.6 + sway},11 l3,0.4 m-1,-0.4 l1.4,-1.2 m-1.4,1.2 l1.4,1.2", "#d03040", 0.8)
    return L


def cria(fn, w, h, suelo, k=0.66, **kw):
    L = C(w, h)
    L.ini(f"translate({w / 2} {suelo}) scale({k}) translate({-w / 2} {-suelo})")
    fn(L=L, **kw)
    L.fin()
    return L


# ------------------------------------------------------------------ salida
def piezas():
    P = {}
    P["animales/bisonte/quieto"] = bisonte(0)
    P["animales/bisonte/caminar_1"] = bisonte(1)
    P["animales/bisonte/caminar_2"] = bisonte(2)
    P["animales/caballo/quieto"] = caballo(0)
    P["animales/caballo/caminar_1"] = caballo(1)
    P["animales/caballo/caminar_2"] = caballo(2)
    P["animales/caballo/negro"] = caballo(0, "#33303a", "#16141a", "#222222")
    P["animales/caballo/palomino"] = caballo(0, "#d8aa5a", "#f2ead8", "#6a5040")
    P["animales/conejo/quieto"] = conejo(False)
    P["animales/conejo/salto"] = conejo(True)
    for m in ("quieto", "caminar_1", "caminar_2", "picotea", "abanico"):
        P[f"animales/guajolote/{m}"] = guajolote(m)
    for m in ("quieto", "caminar_1", "caminar_2", "nadando", "cria", "cria_nadando"):
        P[f"animales/pato/{m}"] = pato(m)
    for sexo, macho in (("hembra", False), ("macho", True)):
        P[f"animales/venado/{sexo}"] = venado(macho, 0)
        P[f"animales/venado/{sexo}_caminar_1"] = venado(macho, 1)
        P[f"animales/venado/{sexo}_caminar_2"] = venado(macho, 2)
    for t in ("gato", "perro", "xolo"):
        for m in ("quieto", "caminar_1", "caminar_2", "parpadeo"):
            P[f"mascotas/{t}/{m}"] = mascota(t, m)
    # más acciones y crías
    P["animales/caballo/comer"] = caballo(0, modo="comer")
    P["animales/caballo/dormir"] = caballo(0, modo="dormir")
    P["animales/caballo/potrillo"] = cria(caballo, 80, 64, 61, f=0)
    P["animales/caballo/potrillo_caminar_1"] = cria(caballo, 80, 64, 61, f=1)
    P["animales/caballo/potrillo_caminar_2"] = cria(caballo, 80, 64, 61, f=2)
    P["animales/venado/hembra_comer"] = venado(False, 0, modo="comer")
    P["animales/venado/cervatillo"] = cria(venado, 64, 70, 67, macho=False, f=0, manchas=True)
    P["animales/venado/cervatillo_caminar_1"] = cria(venado, 64, 70, 67, macho=False, f=1, manchas=True)
    P["animales/venado/cervatillo_caminar_2"] = cria(venado, 64, 70, 67, macho=False, f=2, manchas=True)
    P["animales/guajolote/dormir"] = guajolote("dormir")
    P["animales/pato/dormir"] = pato("dormir")
    for t in ("gato", "perro", "xolo"):
        P[f"mascotas/{t}/dormir"] = mascota(t, "dormir")
    for k in range(2):
        P[f"criaturas/cangrejo/{k}"] = cangrejo(k)
        P[f"criaturas/tarantula/{k}"] = tarantula(k)
    for k in range(3):
        P[f"criaturas/serpiente/{k}"] = serpiente(k)
    return P


def guerreros():
    """guerreros águila y jaguar hechos con el mismo dibujante de los personajes (116x140)"""
    G = {}
    def recorta(svg):
        return svg.replace(f'width="{A.W}" height="{A.Hh}" viewBox="0 0 {A.W} {A.Hh}"', 'width="116" height="140" viewBox="-6 20 142 171"', 1)
    for t in ("aguila", "jaguar"):
        pid = "g_" + t
        G[f"criaturas/guerrero/{t}_quieto"] = recorta(A.dibujar(pid, "derecha", 0, accion="quieto"))
        G[f"criaturas/guerrero/{t}_caminar_1"] = recorta(A.dibujar(pid, "derecha", 0))
        G[f"criaturas/guerrero/{t}_caminar_2"] = recorta(A.dibujar(pid, "derecha", 2))
        G[f"criaturas/guerrero/{t}_golpe"] = recorta(A.dibujar_accion(pid, "derecha", "golpe", 0))
    return G


if __name__ == "__main__":
    out = sys.argv[1]
    todo = {k: v.svg2x() for k, v in piezas().items()}
    todo.update(guerreros())
    for nombre, svg in todo.items():
        os.makedirs(os.path.dirname(os.path.join(out, nombre)), exist_ok=True)
        open(os.path.join(out, nombre + ".svg"), "w").write(svg)
    print("listo")
