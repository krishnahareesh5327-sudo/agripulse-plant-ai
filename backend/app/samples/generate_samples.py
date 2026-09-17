"""
AgriPulse AI - Sample Leaf Generator
Creates high-resolution, botanically distinct test leaf images for evaluator testing:
1. Tomato Early Blight (target spots + chlorotic halo)
2. Potato Late Blight (water-soaked dark lesions)
3. Corn Rust (cinnamon pustules)
4. Apple Healthy (vibrant green foliage)
5. Blurry Leaf (quality rejection test)
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

SAMPLES_DIR = Path(__file__).resolve().parent

def create_leaf_base(width=600, height=600, color=(58, 138, 54), bg=(245, 247, 245)):
    img = Image.new("RGB", (width, height), bg)
    draw = ImageDraw.Draw(img)
    cx, cy = width // 2, height // 2

    # Draw elliptical leaf shape with tapered apex
    points = [
        (cx, cy - 240),
        (cx + 80, cy - 180),
        (cx + 170, cy - 60),
        (cx + 180, cy + 80),
        (cx + 130, cy + 190),
        (cx + 30, cy + 240),
        (cx, cy + 260),
        (cx - 30, cy + 240),
        (cx - 130, cy + 190),
        (cx - 180, cy + 80),
        (cx - 170, cy - 60),
        (cx - 80, cy - 180),
    ]
    draw.polygon(points, fill=color)

    # Draw midrib central vein
    vein_color = (max(0, color[0] - 15), min(255, color[1] + 25), max(0, color[2] - 15))
    draw.line([(cx, cy - 230), (cx, cy + 255)], fill=vein_color, width=4)

    # Draw lateral veins
    for dy in range(-150, 180, 45):
        draw.line([(cx, cy + dy), (cx + 120, cy + dy - 30)], fill=vein_color, width=2)
        draw.line([(cx, cy + dy), (cx - 120, cy + dy - 30)], fill=vein_color, width=2)

    return img

def generate_tomato_early_blight():
    img = create_leaf_base(color=(68, 148, 60))
    draw = ImageDraw.Draw(img)
    cx, cy = 300, 300

    # Draw concentric target lesions with yellow chlorotic halo
    lesion_centers = [(cx - 70, cy - 50), (cx + 80, cy + 40), (cx - 40, cy + 120)]
    for lx, ly in lesion_centers:
        # Yellow chlorotic ring
        draw.ellipse([(lx - 45, ly - 45), (lx + 45, ly + 45)], fill=(195, 180, 45))
        # Dark brown concentric rings
        draw.ellipse([(lx - 34, ly - 34), (lx + 34, ly + 34)], fill=(75, 45, 25))
        draw.ellipse([(lx - 25, ly - 25), (lx + 25, ly + 25)], fill=(105, 65, 35))
        draw.ellipse([(lx - 16, ly - 16), (lx + 16, ly + 16)], fill=(55, 30, 18))
        draw.ellipse([(lx - 8, ly - 8), (lx + 8, ly + 8)], fill=(35, 18, 10))

    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(SAMPLES_DIR / "sample_tomato_early_blight.jpg", quality=90)
    print("Generated sample_tomato_early_blight.jpg")

def generate_potato_late_blight():
    img = create_leaf_base(color=(50, 120, 48))
    draw = ImageDraw.Draw(img)
    cx, cy = 300, 300

    # Water-soaked purplish-black expanding lesions
    lesion_zones = [
        [(cx - 140, cy - 80), (cx - 20, cy - 10), (cx - 90, cy + 60)],
        [(cx + 30, cy + 30), (cx + 150, cy + 80), (cx + 110, cy + 170)]
    ]
    for zone in lesion_zones:
        draw.polygon(zone, fill=(40, 32, 28))
    # Pale greenish border
    draw.ellipse([(cx - 80, cy - 30), (cx - 10, cy + 40)], fill=(70, 75, 55))
    draw.ellipse([(cx - 70, cy - 20), (cx - 20, cy + 30)], fill=(32, 25, 20))

    img = img.filter(ImageFilter.SMOOTH)
    img.save(SAMPLES_DIR / "sample_potato_late_blight.jpg", quality=90)
    print("Generated sample_potato_late_blight.jpg")

def generate_corn_rust():
    # Elongated maize leaf shape
    img = Image.new("RGB", (600, 600), (245, 247, 245))
    draw = ImageDraw.Draw(img)
    cx, cy = 300, 300
    leaf_poly = [
        (cx - 75, 40), (cx + 75, 40),
        (cx + 90, 560), (cx - 90, 560)
    ]
    draw.polygon(leaf_poly, fill=(72, 155, 65))
    # Parallel veins
    for vx in range(cx - 70, cx + 75, 14):
        draw.line([(vx, 40), (vx, 560)], fill=(62, 175, 60), width=1)

    # Cinnamon rust pustules
    np.random.seed(42)
    for _ in range(85):
        px = int(np.random.normal(cx, 35))
        py = int(np.random.uniform(90, 520))
        draw.ellipse([(px - 4, py - 9), (px + 4, py + 9)], fill=(168, 72, 28))
        draw.ellipse([(px - 2, py - 6), (px + 2, py + 6)], fill=(205, 95, 35))

    img.save(SAMPLES_DIR / "sample_corn_common_rust.jpg", quality=90)
    print("Generated sample_corn_common_rust.jpg")

def generate_apple_healthy():
    img = create_leaf_base(color=(48, 145, 52))
    img = img.filter(ImageFilter.SMOOTH)
    img.save(SAMPLES_DIR / "sample_apple_healthy.jpg", quality=92)
    print("Generated sample_apple_healthy.jpg")

def generate_blurry_leaf():
    img = create_leaf_base(color=(60, 130, 50))
    # Severe Gaussian blur to trigger blur detection filter
    blurry = img.filter(ImageFilter.GaussianBlur(radius=18))
    blurry.save(SAMPLES_DIR / "sample_blurry_leaf.jpg", quality=85)
    print("Generated sample_blurry_leaf.jpg")

def generate_all_samples():
    generate_tomato_early_blight()
    generate_potato_late_blight()
    generate_corn_rust()
    generate_apple_healthy()
    generate_blurry_leaf()

if __name__ == "__main__":
    generate_all_samples()
