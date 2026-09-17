"""
AgriPulse AI - Image Quality Analyzer
Validates incoming plant leaf images for blurriness, exposure, resolution,
and plant vegetation presence before model inference.
"""
from typing import Dict, Any, List
from PIL import Image, ImageStat
import numpy as np

class ImageQualityAnalyzer:
    def __init__(
        self,
        min_width: int = 140,
        min_height: int = 140,
        blur_threshold: float = 35.0,
        min_brightness: float = 30.0,
        max_brightness: float = 238.0,
        min_foliage_ratio: float = 0.07
    ):
        self.min_width = min_width
        self.min_height = min_height
        self.blur_threshold = blur_threshold
        self.min_brightness = min_brightness
        self.max_brightness = max_brightness
        self.min_foliage_ratio = min_foliage_ratio

    def evaluate(self, image: Image.Image) -> Dict[str, Any]:
        rgb_img = image.convert('RGB')
        width, height = rgb_img.size
        issues: List[str] = []
        tips: List[str] = []

        # 1. Resolution Check
        resolution_score = 100.0
        if width < self.min_width or height < self.min_height:
            resolution_score = 30.0
            issues.append(f"Resolution too low ({width}x{height}px). Recommended minimum is 224x224px.")
            tips.append("Capture the leaf at higher resolution and avoid extreme digital cropping.")
        elif width < 280 or height < 280:
            resolution_score = 75.0

        # 2. Exposure & Brightness Check
        gray_img = rgb_img.convert('L')
        stat = ImageStat.Stat(gray_img)
        mean_brightness = float(stat.mean[0])
        std_contrast = float(stat.stddev[0])

        brightness_score = 100.0
        if mean_brightness < self.min_brightness:
            brightness_score = 25.0
            issues.append("Image is severely underexposed (too dark to distinguish lesions).")
            tips.append("Use bright, diffuse daylight or steady indirect lighting.")
        elif mean_brightness > self.max_brightness:
            brightness_score = 30.0
            issues.append("Image is overexposed (washed out by bright flash or harsh glare).")
            tips.append("Shade the leaf from direct sunlight glare and disable close-up flash.")
        elif mean_brightness < 45.0 or mean_brightness > 215.0:
            brightness_score = 70.0

        if std_contrast < 12.0:
            issues.append("Extremely low contrast detected (flat lighting or single tone).")
            tips.append("Ensure the leaf stands out clearly from the background.")

        # 3. Sharpness / Blur Check using discrete Laplacian Operator
        np_gray = np.array(gray_img, dtype=np.float32)
        if np_gray.shape[0] > 10 and np_gray.shape[1] > 10:
            center = np_gray[1:-1, 1:-1]
            top = np_gray[:-2, 1:-1]
            bottom = np_gray[2:, 1:-1]
            left = np_gray[1:-1, :-2]
            right = np_gray[1:-1, 2:]
            laplacian = top + bottom + left + right - (4.0 * center)
            sharpness_variance = float(np.var(laplacian))
        else:
            sharpness_variance = 0.0

        blur_score = min(100.0, max(0.0, (sharpness_variance / 200.0) * 100.0))
        if sharpness_variance < self.blur_threshold:
            blur_score = max(10.0, (sharpness_variance / self.blur_threshold) * 45.0)
            issues.append("Image is out of focus or motion-blurred.")
            tips.append("Hold the camera steady, tap the leaf surface to focus, and hold still.")

        # 4. Foliage / Vegetation Color Check
        arr = np.array(rgb_img, dtype=np.float32) / 255.0
        r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
        green_excess = 2.0 * g - r - b
        foliage_mask = (green_excess > 0.04) | ((r > 0.28) & (g > 0.24) & (b < 0.22) & (r > b))
        foliage_ratio = float(np.mean(foliage_mask))

        vegetation_score = min(100.0, max(0.0, foliage_ratio * 300.0))
        if foliage_ratio < self.min_foliage_ratio:
            vegetation_score = 20.0
            issues.append("Little or no plant foliage detected in frame.")
            tips.append("Center the leaf so it occupies at least 60% of the image frame.")

        overall_score = round(
            0.30 * blur_score +
            0.25 * brightness_score +
            0.25 * vegetation_score +
            0.20 * resolution_score,
            1
        )

        is_valid = (len(issues) == 0) or (
            overall_score >= 48.0 and sharpness_variance >= 22.0 and mean_brightness >= 24.0 and foliage_ratio >= 0.04
        )

        return {
            "is_valid": is_valid,
            "overall_score": overall_score,
            "metrics": {
                "resolution": f"{width}x{height}",
                "sharpness_variance": round(sharpness_variance, 1),
                "blur_score": round(blur_score, 1),
                "mean_brightness": round(mean_brightness, 1),
                "brightness_score": round(brightness_score, 1),
                "foliage_ratio": round(foliage_ratio, 3),
                "vegetation_score": round(vegetation_score, 1)
            },
            "issues": issues,
            "tips": tips if tips else [
                "Good leaf focus and edge contrast.",
                "Sufficient ambient lighting detected.",
                "Foliage cleanly framed."
            ]
        }
