"""Convierte el arte del paquete códice al estilo ACOGEDOR.
- SVG: contorno del color de cada pieza, negros suavizados y sombrita (mismo método que los íconos).
- PNG sin SVG (edificios, pisos): los pixeles de tinta negra toman el color de lo que los rodea, oscurecido,
  y el conjunto se calienta un poco.
Uso: python3 convertir_acogedor.py <dir_origen> <dir_salida> <carpeta> [<carpeta> ...]
"""
import os, sys, shutil
import numpy as np
from PIL import Image
from iconos_acogedor import convertir as convertir_svg


def caja(a, r):
    """suma en una ventana (2r+1)x(2r+1) con sumas acumuladas (sin scipy)"""
    p = np.pad(a, ((r + 1, r), (r + 1, r)) + ((0, 0),) * (a.ndim - 2), mode="constant")
    c = p.cumsum(0).cumsum(1)
    return c[2 * r + 1:, 2 * r + 1:] - c[:-2 * r - 1, 2 * r + 1:] - c[2 * r + 1:, :-2 * r - 1] + c[:-2 * r - 1, :-2 * r - 1]


def png_acogedor(src, dst):
    im = np.array(Image.open(src).convert("RGBA")).astype(np.float32)
    rgb, a = im[..., :3], im[..., 3]
    lum = rgb @ np.array([0.299, 0.587, 0.114])
    sat = rgb.max(-1) - rgb.min(-1)
    tinta = (lum < 58) & (sat < 40) & (a > 10)
    color = (~tinta) & (a > 200)
    W = color.astype(np.float32)
    suma = np.zeros_like(rgb)
    peso = np.zeros(W.shape, np.float32)
    for r in (3, 7):  # primero cerca; si no hay color cerca, más lejos
        s = caja(rgb * W[..., None], r)
        w = caja(W, r)
        usar = (peso == 0) & (w > 0)
        suma[usar] = s[usar]
        peso[usar] = w[usar]
    prom = np.where(peso[..., None] > 0, suma / np.maximum(peso, 1)[..., None], np.array([90, 60, 50], np.float32))
    nuevo = prom * 0.62 + np.array([70, 30, 18], np.float32) * 0.2
    out = rgb.copy()
    out[tinta] = nuevo[tinta]
    # calidez ligera
    m = out.mean(-1, keepdims=True)
    out = m + (out - m) * 1.1
    out = out * np.array([1.04, 1.0, 0.95]) + 5
    im[..., :3] = np.clip(out, 0, 255)
    Image.fromarray(im.astype(np.uint8)).save(dst)


def procesar(src_root, dst_root, carpeta, render_svg):
    n_svg = n_png = 0
    for base, _, files in os.walk(os.path.join(src_root, carpeta)):
        rel = os.path.relpath(base, src_root)
        os.makedirs(os.path.join(dst_root, rel), exist_ok=True)
        svgs = {f[:-4] for f in files if f.endswith(".svg")}
        for f in files:
            s, d = os.path.join(base, f), os.path.join(dst_root, rel, f)
            if f.endswith(".svg"):
                open(d, "w").write(convertir_svg(open(s).read(), fuerza=0.36, avivar=True))
                render_svg.append(d)
                n_svg += 1
            elif f.endswith(".png"):
                if f[:-4] in svgs:
                    continue  # se vuelve a pintar desde el SVG
                png_acogedor(s, d)
                n_png += 1
            else:
                shutil.copy(s, d)
    return n_svg, n_png


if __name__ == "__main__":
    src, dst = sys.argv[1:3]
    lista = []
    for c in sys.argv[3:]:
        print(c, procesar(src, dst, c, lista))
    open(os.path.join(dst, "_por_pintar.txt"), "w").write("\n".join(lista))
