"""Efectos de sonido y música de Corazón de Maíz, sintetizados con numpy (sin muestras ajenas).
Instrumentos: flauta de barro, ocarina, huéhuetl (tambor grave), teponaztli (tambor de lengüetas de dos tonos),
ayacachtli (sonaja) y caracol. Escala pentatónica.
Uso: python3 sonido.py <salida_dir>   -> <salida>/sfx/*.wav y <salida>/musica/*.wav
"""
import os, sys, wave
import numpy as np

SR = 44100
rng = np.random.default_rng(7)


def t(d):
    return np.arange(int(SR * d)) / SR


def env(n, a=0.005, d=0.1, s=0.0, r=0.05, dur=None):
    """envolvente ADSR simple de n muestras"""
    e = np.zeros(n)
    A, D, R = int(a * SR), int(d * SR), int(r * SR)
    A = max(1, min(A, n)); e[:A] = np.linspace(0, 1, A)
    D = max(1, min(D, n - A)); e[A:A + D] = np.linspace(1, s, D)
    e[A + D:] = s
    if R > 0 and s > 0:
        R = min(R, n); e[-R:] *= np.linspace(1, 0, R)
    return e


def ruido(n):
    return rng.uniform(-1, 1, n)


def pasabajos(x, k):
    """filtro de un polo (k 0..1, más chico = más oscuro); vectorizado por bloques no hace falta: usamos IIR con lfilter casero"""
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += k * (x[i] - acc)
        y[i] = acc
    return y


def lp(x, corte):
    """pasabajos rápido por FFT (corte en Hz, caída suave)"""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / corte) ** 4)
    return np.fft.irfft(X, len(x))


def bp(x, centro, ancho):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= np.exp(-((f - centro) / ancho) ** 2)
    return np.fft.irfft(X, len(x))


def reverb(x, seg=1.4, mezcla=0.22):
    n = int(SR * seg)
    ir = ruido(n) * np.exp(-np.linspace(0, 7, n))
    ir = lp(ir, 5000)
    ir /= np.abs(ir).sum() ** 0.5 * 4
    L = len(x) + n
    N = 1 << int(np.ceil(np.log2(L)))
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N), N)[:len(x)]
    return x * (1 - mezcla) + y * mezcla


def normal(x, pico=0.9):
    m = np.abs(x).max() or 1
    return x / m * pico


def guarda(x, path):
    x = np.clip(x, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


# ------------------------------------------------------------------ instrumentos
def flauta(f, d, vol=1.0, vib=5.5):
    tt = t(d)
    fm = f * (1 + 0.006 * np.sin(2 * np.pi * vib * tt) * np.clip(tt * 3, 0, 1))
    ph = 2 * np.pi * np.cumsum(fm) / SR
    x = np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.06 * np.sin(3 * ph)
    soplo = bp(ruido(len(tt)), f * 1.5, 900) * 0.25
    e = env(len(tt), 0.04, 0.1, 0.8, 0.12)
    return (x + soplo) * e * vol


def ocarina(f, d, vol=1.0):
    tt = t(d)
    ph = 2 * np.pi * f * tt
    x = np.sin(ph) + 0.05 * np.sin(2 * ph)
    x += bp(ruido(len(tt)), f, 400) * 0.12
    return x * env(len(tt), 0.03, 0.15, 0.7, 0.1) * vol


def huehuetl(vol=1.0, f0=95):
    tt = t(0.6)
    f = f0 * (0.55 + 0.45 * np.exp(-tt * 18))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 6)
    x += lp(ruido(len(tt)), 900) * np.exp(-tt * 40) * 0.5
    return x * vol


def teponaztli(f=330, vol=1.0):
    tt = t(0.35)
    x = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 14) + 0.4 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 30)
    x += bp(ruido(len(tt)), f * 3, 600) * np.exp(-tt * 80) * 0.4
    return x * vol


def sonaja(vol=1.0, d=0.12):
    tt = t(d)
    x = bp(ruido(len(tt)), 6500, 2500) * np.exp(-tt * 30)
    return x * vol


def caracol(f=147, d=1.6, vol=1.0):
    tt = t(d)
    fm = f * (0.97 + 0.03 * np.clip(tt * 2, 0, 1))
    ph = 2 * np.pi * np.cumsum(fm) / SR
    x = sum(np.sin(k * ph) / k ** 0.9 for k in range(1, 8))
    x += bp(ruido(len(tt)), f * 4, 500) * 0.3
    return x * env(len(tt), 0.25, 0.3, 0.75, 0.4) * vol


def poner(buf, x, inicio):
    i = int(inicio * SR)
    j = min(len(buf), i + len(x))
    if i < len(buf):
        buf[i:j] += x[:j - i]
    # lo que se pasa del final da la vuelta (para que el ciclo no tenga cortes)
    if i + len(x) > len(buf):
        resto = x[len(buf) - i:]
        buf[:len(resto)] += resto


# ------------------------------------------------------------------ efectos
def sfx():
    S = {}
    def paso(color, corte, d=0.09):
        tt = t(d)
        return lp(ruido(len(tt)), corte) * np.exp(-tt * 55) * color
    S["step_grass"] = normal(bp(ruido(len(t(0.1))), 2500, 1800) * np.exp(-t(0.1) * 45), 0.5)
    S["step_stone"] = normal(paso(1, 2600) + np.sin(2 * np.pi * 900 * t(0.09)) * np.exp(-t(0.09) * 90) * 0.4, 0.5)
    S["step_sand"] = normal(bp(ruido(len(t(0.13))), 4500, 2500) * np.exp(-t(0.13) * 28), 0.45)
    tt = t(0.25)
    S["till"] = normal(lp(ruido(len(tt)), 700) * np.exp(-tt * 18) + np.sin(2 * np.pi * 110 * tt) * np.exp(-tt * 25) * 0.6, 0.8)
    # agua: chorrito con burbujas
    tt = t(0.7)
    x = bp(ruido(len(tt)), 3000, 2000) * env(len(tt), 0.05, 0.3, 0.6, 0.25) * 0.5
    for k in range(9):
        f = rng.uniform(500, 1200); s = rng.uniform(0, 0.55)
        b = np.sin(2 * np.pi * np.cumsum(f * (1 + t(0.06) * 8)) / SR) * np.exp(-t(0.06) * 60)
        poner(x, b * 0.5, s)
    S["water"] = normal(x, 0.7)
    tt = t(0.2)
    S["plant"] = normal(lp(ruido(len(tt)), 1200) * np.exp(-tt * 22) * 0.6 + np.sin(2 * np.pi * 520 * tt * (1 + tt * 3)) * np.exp(-tt * 20) * 0.4, 0.7)
    # cosechar: pop + campanita pentatónica
    x = np.zeros(int(SR * 0.6))
    poner(x, np.sin(2 * np.pi * 180 * t(0.08) * (1 + t(0.08) * 20)) * np.exp(-t(0.08) * 40), 0)
    for i, f in enumerate((784, 988, 1175)):
        poner(x, ocarina(f, 0.25, 0.5), 0.05 + i * 0.07)
    S["harvest"] = normal(reverb(x, 0.6, 0.2), 0.75)
    tt = t(0.3)
    S["mine"] = normal(np.sin(2 * np.pi * 1450 * tt) * np.exp(-tt * 30) * 0.6 + np.sin(2 * np.pi * 2330 * tt) * np.exp(-tt * 40) * 0.4 + lp(ruido(len(tt)), 3000) * np.exp(-tt * 50), 0.8)
    # cacao: dos granitos que chocan
    x = np.zeros(int(SR * 0.4))
    for i, f in enumerate((2100, 2600)):
        poner(x, np.sin(2 * np.pi * f * t(0.15)) * np.exp(-t(0.15) * 35) + bp(ruido(len(t(0.15))), f, 400) * np.exp(-t(0.15) * 60), i * 0.08)
    S["coin"] = normal(reverb(x, 0.4, 0.15), 0.7)
    x = np.zeros(int(SR * 0.45))
    for i in range(3):
        poner(x, lp(ruido(len(t(0.08))), 1800) * np.exp(-t(0.08) * 40), i * 0.13)
    S["eat"] = normal(x, 0.6)
    tt = t(0.3)
    S["hurt"] = normal(np.sin(2 * np.pi * np.cumsum(420 - tt * 900) / SR) * np.exp(-tt * 9), 0.7)
    tt = t(0.18)
    S["hit"] = normal(lp(ruido(len(tt)), 1500) * np.exp(-tt * 35) + np.sin(2 * np.pi * 150 * tt) * np.exp(-tt * 30), 0.8)
    # dormir: tres notas de flauta que bajan
    x = np.zeros(int(SR * 2.2))
    for i, f in enumerate((523.3, 440, 392)):
        poner(x, flauta(f, 0.7, 0.6), i * 0.5)
    S["sleep"] = normal(reverb(x, 1.6, 0.35), 0.6)
    S["ui"] = normal(teponaztli(660, 0.7)[:int(SR * 0.12)], 0.5)
    tt = t(3.0)
    tr = lp(ruido(len(tt)), 260) * (np.exp(-tt * 1.2) + 0.5 * np.exp(-((tt - 0.4) * 6) ** 2))
    S["thunder"] = normal(reverb(tr, 2.0, 0.4), 0.9)
    # ---- nuevos
    S["ui_abrir"] = normal(np.concatenate([teponaztli(523, 0.6)[:int(SR * 0.08)], teponaztli(784, 0.6)[:int(SR * 0.15)]]), 0.5)
    S["ui_cerrar"] = normal(np.concatenate([teponaztli(784, 0.6)[:int(SR * 0.08)], teponaztli(523, 0.6)[:int(SR * 0.15)]]), 0.5)
    S["ui_mover"] = normal(teponaztli(988, 0.4)[:int(SR * 0.05)], 0.3)
    S["dialogo_letra"] = normal(np.sin(2 * np.pi * 620 * t(0.03)) * np.exp(-t(0.03) * 120), 0.25)
    x = np.zeros(int(SR * 0.9))
    for i, f in enumerate((659, 784, 1047)):
        poner(x, ocarina(f, 0.35, 0.6), i * 0.1)
    S["amistad"] = normal(reverb(x, 0.8, 0.3), 0.7)
    x = np.zeros(int(SR * 1.6))
    for i, f in enumerate((392, 523, 659, 784, 1047)):
        poner(x, flauta(f, 0.3 if i < 4 else 0.9, 0.6), i * 0.12)
    poner(x, huehuetl(0.7), 0.48)
    S["nivel"] = normal(reverb(x, 1.0, 0.3), 0.8)
    tt = t(0.3)
    S["talar"] = normal(lp(ruido(len(tt)), 2400) * np.exp(-tt * 30) + np.sin(2 * np.pi * 240 * tt) * np.exp(-tt * 22) * 0.8, 0.8)
    tt = t(0.4)
    S["pescar_lanzar"] = normal(bp(ruido(len(tt)), 2600, 900) * (0.4 + tt * 2) * env(len(tt), 0.05, 0.2, 0.3, 0.1), 0.5)
    tt = t(0.5)
    sp = bp(ruido(len(tt)), 2000, 1500) * np.exp(-tt * 12)
    S["pescar_pica"] = normal(sp + np.sin(2 * np.pi * np.cumsum(300 + tt * 400) / SR) * np.exp(-tt * 15) * 0.5, 0.7)
    tt = t(0.12)
    S["burbuja"] = normal(np.sin(2 * np.pi * np.cumsum(400 + tt * 3000) / SR) * np.exp(-tt * 25), 0.5)
    # animales (aproximados y tiernos)
    tt = t(0.6)
    gl = np.sin(2 * np.pi * np.cumsum(520 + 160 * np.sign(np.sin(2 * np.pi * 14 * tt))) / SR)
    S["guajolote"] = normal(bp(gl * env(len(tt), 0.02, 0.2, 0.7, 0.1), 900, 700), 0.6)
    tt = t(0.22)
    cu = np.sign(np.sin(2 * np.pi * np.cumsum(330 - tt * 200) / SR))
    S["pato"] = normal(bp(cu, 1100, 500) * env(len(tt), 0.01, 0.1, 0.6, 0.05), 0.6)
    tt = t(0.16)
    ld = bp(ruido(len(tt)), 700, 400) * 0.6 + np.sin(2 * np.pi * np.cumsum(480 - tt * 900) / SR) * 0.6
    x = np.zeros(int(SR * 0.45)); poner(x, ld * np.exp(-tt * 15), 0); poner(x, ld * np.exp(-tt * 15) * 0.8, 0.2)
    S["perro"] = normal(x, 0.7)
    tt = t(0.6)
    f = 600 + 250 * np.sin(np.pi * np.clip(tt / 0.6, 0, 1)) - tt * 200
    mi = np.sin(2 * np.pi * np.cumsum(f) / SR)
    S["gato"] = normal(bp(mi + 0.4 * np.sin(2 * 2 * np.pi * np.cumsum(f) / SR), 1300, 900) * env(len(tt), 0.05, 0.3, 0.6, 0.15), 0.55)
    tt = t(0.9)
    rel = np.sin(2 * np.pi * np.cumsum(500 + 120 * np.sin(2 * np.pi * 9 * tt) - tt * 250) / SR)
    S["caballo"] = normal(bp(rel * env(len(tt), 0.05, 0.4, 0.5, 0.2), 1000, 800) + lp(ruido(len(tt)), 500) * env(len(tt), 0.01, 0.2, 0.2, 0.2) * 0.3, 0.6)
    S["caracol"] = normal(reverb(caracol(147, 1.8), 1.8, 0.35), 0.8)
    return S


# ------------------------------------------------------------------ música
ESCALA = [196.0, 220.0, 261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3, 784.0]  # sol pentatónico menor


def melodia(compases, notas_por_compas, semilla, centro=5, salto=2):
    r = np.random.default_rng(semilla)
    motivo = []
    pos = centro
    for _ in range(notas_por_compas * 2):
        pos = int(np.clip(pos + r.integers(-salto, salto + 1), 2, len(ESCALA) - 1))
        motivo.append(pos)
    out = []
    for c in range(compases // 2):  # repite el motivo con variaciones
        var = list(motivo)
        if c % 2 == 1:
            var = [int(np.clip(v + r.integers(-1, 2), 2, len(ESCALA) - 1)) for v in var]
        if c == compases // 2 - 1:
            var[-1] = centro
        out += var
    return out


def pieza(nombre, bpm, compases, instr, ritmo, semilla, densidad=1.0, bajo=True, reverb_mezcla=0.28, centro=5):
    """ciclo que se repite sin cortes: melodía + bordón + percusión"""
    negra = 60 / bpm
    dur = compases * 4 * negra
    buf = np.zeros(int(SR * dur))
    notas = melodia(compases, 4, semilla, centro)
    r = np.random.default_rng(semilla + 1)
    for i, n in enumerate(notas):
        if r.random() > densidad:
            continue
        largo = negra * (2 if i % 4 == 3 else 1)
        f = ESCALA[n]
        x = flauta(f, largo * 0.95, 0.5) if instr == "flauta" else ocarina(f, largo * 0.9, 0.5)
        poner(buf, x, i * negra)
    if bajo:  # bordón de flauta grave cada compás
        for c in range(compases):
            poner(buf, flauta(98.0 if c % 4 != 3 else 110.0, 4 * negra * 0.98, 0.18, vib=3), c * 4 * negra)
    for c in range(compases):
        for k, golpe in enumerate(ritmo):
            if golpe == "H":
                poner(buf, huehuetl(0.55), c * 4 * negra + k * negra / 2)
            elif golpe == "h":
                poner(buf, huehuetl(0.3, 120), c * 4 * negra + k * negra / 2)
            elif golpe == "T":
                poner(buf, teponaztli(330, 0.35), c * 4 * negra + k * negra / 2)
            elif golpe == "t":
                poner(buf, teponaztli(247, 0.3), c * 4 * negra + k * negra / 2)
            elif golpe == "s":
                poner(buf, sonaja(0.25), c * 4 * negra + k * negra / 2)
    return normal(reverb(buf, 1.8, reverb_mezcla), 0.8)


def musica():
    M = {}
    M["day"] = pieza("día", 96, 16, "flauta", "H.s.T.s.", 11)
    M["primavera"] = pieza("primavera", 100, 16, "flauta", "H.s.TsT.", 21, centro=6)
    M["verano"] = pieza("verano", 108, 16, "ocarina", "HsTsHsTs", 31)
    M["otono"] = pieza("otoño", 88, 16, "flauta", "H...t.s.", 41, centro=4)
    M["invierno"] = pieza("invierno", 72, 12, "ocarina", "h.......", 51, densidad=0.7, centro=4)
    M["night"] = pieza("noche", 64, 12, "ocarina", "h.......", 61, densidad=0.55, bajo=True, reverb_mezcla=0.4, centro=4)
    M["mine"] = pieza("mina", 60, 10, "ocarina", "h...t...", 71, densidad=0.4, bajo=True, reverb_mezcla=0.5, centro=3)
    M["asalto"] = pieza("asalto", 132, 16, "flauta", "HhHsTtTs", 81, centro=5)
    M["fiesta"] = pieza("fiesta", 120, 16, "flauta", "HsTsHTts", 91, centro=6)
    M["titulo"] = pieza("título", 84, 16, "flauta", "H...T.s.", 101, centro=5)
    return M


if __name__ == "__main__":
    out = sys.argv[1]
    os.makedirs(os.path.join(out, "sfx"), exist_ok=True)
    os.makedirs(os.path.join(out, "musica"), exist_ok=True)
    for n, x in sfx().items():
        guarda(x, os.path.join(out, "sfx", n + ".wav"))
    for n, x in musica().items():
        guarda(x, os.path.join(out, "musica", n + ".wav"))
    print("listo")
