# -*- coding: utf-8 -*-
"""Placeholder GRAPHIC menarik (tanpa teks) — gradient mesh + bokeh berlapis + ring emas + arc."""
import io, sys, os, math
from PIL import Image, ImageDraw, ImageFilter
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

OUT = r"C:\Claude\MARSHELLA EUNIKE\tammia-online\assets\img\placeholders"
os.makedirs(OUT, exist_ok=True)

RED   = (225, 29, 37)
BLUSH = (240, 194, 196)
GOLD  = (211, 172, 80)
CREAM = (250, 246, 241)
OFF   = (244, 242, 240)
DEEP  = (162, 42, 52)
PINK  = (247, 222, 223)
WHITE = (255, 255, 255)


def diag_gradient(w, h, c1, c2, angle=35):
    diag = int(math.hypot(w, h)) + 4
    g = Image.linear_gradient("L").resize((diag, diag)).rotate(angle, expand=True)
    gx = (g.width - w) // 2
    gy = (g.height - h) // 2
    mask = g.crop((gx, gy, gx + w, gy + h))
    base = Image.new("RGB", (w, h), c1)
    top = Image.new("RGB", (w, h), c2)
    return Image.composite(top, base, mask)


def blob(img, fx, fy, fr, color, alpha, blur_factor):
    w, h = img.size
    cx, cy, r = int(fx * w), int(fy * h), int(fr * min(w, h))
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], fill=color + (alpha,))
    layer = layer.filter(ImageFilter.GaussianBlur(max(1, r * blur_factor)))
    img.alpha_composite(layer)


def ring(img, fx, fy, fr, color, width, alpha):
    w, h = img.size
    cx, cy, r = int(fx * w), int(fy * h), int(fr * min(w, h))
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).ellipse([cx - r, cy - r, cx + r, cy + r], outline=color + (alpha,), width=width)
    layer = layer.filter(ImageFilter.GaussianBlur(0.5))
    img.alpha_composite(layer)


def arc(img, fx, fy, fr, a0, a1, color, width, alpha):
    w, h = img.size
    cx, cy, r = int(fx * w), int(fy * h), int(fr * min(w, h))
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    ImageDraw.Draw(layer).arc([cx - r, cy - r, cx + r, cy + r], a0, a1, fill=color + (alpha,), width=width)
    layer = layer.filter(ImageFilter.GaussianBlur(0.6))
    img.alpha_composite(layer)


def finish(img, w, h, path):
    # highlight sudut & vignette tepi DIHAPUS (request klien: tak boleh ada
    # perbedaan terang/gelap di sisi kiri-kanan). Background rata horizontal.
    img.convert("RGB").save(path, quality=88, optimize=True)
    print("ok", os.path.basename(path), f"{w}x{h}")


def make(path, w, h, c1, c2, ambient, bokeh, rings, arcs, angle=35):
    img = diag_gradient(w, h, c1, c2, angle).convert("RGBA")
    for (fx, fy, fr, col, a) in ambient:          # glow besar lembut
        blob(img, fx, fy, fr, col, a, 0.55)
    for (fx, fy, fr, col, a) in bokeh:            # lingkaran translusen terlihat
        blob(img, fx, fy, fr, col, a, 0.10)
    for r in rings:
        ring(img, *r)
    for a in arcs:
        arc(img, *a)
    finish(img, w, h, path)


# ---------- Header slides (800x1000) ----------
make(os.path.join(OUT, "header-1.jpg"), 800, 1000, CREAM, BLUSH,
     ambient=[(0.75, 0.25, 0.55, GOLD, 60), (0.2, 0.78, 0.55, RED, 38)],
     bokeh=[(0.7, 0.34, 0.20, GOLD, 70), (0.34, 0.6, 0.14, WHITE, 120),
            (0.58, 0.72, 0.10, BLUSH, 150), (0.8, 0.6, 0.07, RED, 90)],
     rings=[(0.32, 0.3, 0.26, GOLD, 6, 150), (0.66, 0.74, 0.16, RED, 5, 110)],
     arcs=[(0.5, 0.5, 0.42, 200, 320, GOLD, 5, 90)], angle=42)

make(os.path.join(OUT, "header-2.jpg"), 800, 1000, OFF, (236, 222, 196),
     ambient=[(0.28, 0.3, 0.55, GOLD, 75), (0.78, 0.66, 0.5, BLUSH, 80)],
     bokeh=[(0.3, 0.32, 0.18, WHITE, 130), (0.72, 0.6, 0.16, GOLD, 80),
            (0.52, 0.8, 0.12, RED, 70), (0.2, 0.7, 0.08, GOLD, 100)],
     rings=[(0.66, 0.3, 0.22, RED, 6, 110), (0.34, 0.66, 0.18, GOLD, 5, 150)],
     arcs=[(0.5, 0.5, 0.4, 30, 150, RED, 5, 80)], angle=26)

make(os.path.join(OUT, "header-3.jpg"), 800, 1000, (252, 240, 240), BLUSH,
     ambient=[(0.72, 0.3, 0.6, RED, 45), (0.26, 0.7, 0.55, GOLD, 60)],
     bokeh=[(0.66, 0.36, 0.20, GOLD, 80), (0.36, 0.62, 0.16, WHITE, 130),
            (0.56, 0.78, 0.10, RED, 80), (0.8, 0.66, 0.08, BLUSH, 150)],
     rings=[(0.34, 0.32, 0.26, GOLD, 6, 150), (0.68, 0.72, 0.18, RED, 5, 110)],
     arcs=[(0.5, 0.48, 0.42, 210, 340, GOLD, 5, 90)], angle=52)

# ---------- Lifestyle (900x1100) ----------
make(os.path.join(OUT, "lifestyle-1.jpg"), 900, 1100, CREAM, BLUSH,
     ambient=[(0.72, 0.28, 0.6, GOLD, 70), (0.28, 0.72, 0.58, RED, 40), (0.5, 0.5, 0.4, BLUSH, 60)],
     bokeh=[(0.68, 0.32, 0.2, GOLD, 80), (0.34, 0.6, 0.15, WHITE, 130),
            (0.56, 0.74, 0.11, RED, 75), (0.22, 0.32, 0.1, GOLD, 90)],
     rings=[(0.32, 0.36, 0.27, GOLD, 7, 150), (0.7, 0.66, 0.2, RED, 6, 110)],
     arcs=[(0.5, 0.5, 0.43, 200, 330, GOLD, 6, 90)], angle=38)

# ---------- Home banner memanjang (1600x460) x5 — gambar penuh (tanpa teks), komposisi beda-beda ----------
BANNERS = [
    dict(c1=CREAM, c2=BLUSH, angle=18,
         ambient=[(0.22, 0.32, 0.50, GOLD, 60), (0.80, 0.70, 0.50, RED, 32), (0.50, 0.50, 0.45, BLUSH, 55)],
         bokeh=[(0.20, 0.40, 0.34, GOLD, 65), (0.80, 0.36, 0.30, WHITE, 110), (0.62, 0.70, 0.22, RED, 70),
                (0.42, 0.60, 0.16, BLUSH, 150), (0.90, 0.60, 0.14, GOLD, 90)],
         rings=[(0.30, 0.50, 0.50, GOLD, 6, 130), (0.74, 0.50, 0.40, RED, 5, 100)],
         arcs=[(0.50, 0.50, 0.80, 200, 330, GOLD, 5, 80)]),
    dict(c1=OFF, c2=(236, 222, 196), angle=24,
         ambient=[(0.30, 0.30, 0.55, GOLD, 75), (0.78, 0.66, 0.50, BLUSH, 80)],
         bokeh=[(0.30, 0.40, 0.32, WHITE, 120), (0.70, 0.50, 0.30, GOLD, 80), (0.50, 0.72, 0.20, RED, 65),
                (0.85, 0.34, 0.16, GOLD, 100)],
         rings=[(0.66, 0.45, 0.46, RED, 6, 110), (0.32, 0.55, 0.36, GOLD, 5, 150)],
         arcs=[(0.50, 0.50, 0.78, 30, 160, RED, 5, 75)]),
    dict(c1=(252, 240, 240), c2=BLUSH, angle=14,
         ambient=[(0.74, 0.32, 0.55, RED, 42), (0.26, 0.70, 0.50, GOLD, 58), (0.50, 0.50, 0.40, PINK, 55)],
         bokeh=[(0.70, 0.40, 0.34, GOLD, 75), (0.34, 0.55, 0.26, WHITE, 120), (0.56, 0.72, 0.18, RED, 75),
                (0.20, 0.36, 0.14, GOLD, 90)],
         rings=[(0.36, 0.50, 0.50, GOLD, 6, 140), (0.70, 0.50, 0.40, RED, 5, 105)],
         arcs=[(0.50, 0.50, 0.80, 210, 340, GOLD, 5, 85)]),
    dict(c1=CREAM, c2=PINK, angle=30,
         ambient=[(0.20, 0.30, 0.50, RED, 36), (0.80, 0.70, 0.55, GOLD, 70), (0.55, 0.45, 0.40, BLUSH, 55)],
         bokeh=[(0.78, 0.42, 0.36, GOLD, 70), (0.40, 0.50, 0.26, WHITE, 115), (0.60, 0.74, 0.18, RED, 70),
                (0.24, 0.62, 0.14, GOLD, 90)],
         rings=[(0.70, 0.48, 0.48, GOLD, 6, 130), (0.34, 0.52, 0.34, RED, 5, 100)],
         arcs=[(0.50, 0.50, 0.80, 150, 290, GOLD, 5, 80)]),
    dict(c1=OFF, c2=BLUSH, angle=20,
         ambient=[(0.30, 0.66, 0.50, GOLD, 65), (0.74, 0.32, 0.50, RED, 36), (0.50, 0.50, 0.45, BLUSH, 55)],
         bokeh=[(0.30, 0.46, 0.32, WHITE, 120), (0.72, 0.44, 0.30, GOLD, 78), (0.52, 0.70, 0.20, RED, 68),
                (0.86, 0.62, 0.14, BLUSH, 150)],
         rings=[(0.66, 0.50, 0.46, GOLD, 6, 130), (0.30, 0.50, 0.36, RED, 5, 100)],
         arcs=[(0.50, 0.50, 0.78, 200, 330, GOLD, 5, 80)]),
]
for n, b in enumerate(BANNERS, 1):
    # Banner full-bleed → kecerahan WAJIB rata kiri-kanan (no side band):
    # gradient VERTIKAL (angle 0, tiap kolom x identik), buang blob berisi yang
    # bikin hotspot/pita di sisi; sisakan ring + arc tipis (line-art) sbg aksen.
    make(os.path.join(OUT, f"banner-{n}.jpg"), 1600, 460, b["c1"], b["c2"],
         ambient=[], bokeh=[], rings=b["rings"], arcs=b["arcs"], angle=0)

# ---------- Kategori (400x400) ----------
CAT = {
    "brush":   (CREAM, BLUSH, GOLD),
    "sponge":  (OFF, PINK, RED),
    "lash":    ((252, 240, 240), BLUSH, DEEP),
    "case":    (OFF, (236, 222, 196), GOLD),
    "tweezer": (CREAM, PINK, RED),
    "nail":    ((252, 242, 235), BLUSH, GOLD),
    "hair":    (OFF, BLUSH, DEEP),
    "bath":    (CREAM, (236, 222, 196), RED),
}
for cat, (c1, c2, accent) in CAT.items():
    make(os.path.join(OUT, f"cat-{cat}.jpg"), 400, 400, c1, c2,
         ambient=[(0.74, 0.28, 0.6, accent, 75), (0.26, 0.74, 0.55, BLUSH, 80)],
         bokeh=[(0.68, 0.34, 0.22, accent, 75), (0.36, 0.62, 0.15, WHITE, 130),
                (0.56, 0.74, 0.1, accent, 90)],
         rings=[(0.34, 0.36, 0.27, accent, 5, 140)],
         arcs=[(0.5, 0.5, 0.4, 200, 330, accent, 4, 80)], angle=35)

print("DONE")
