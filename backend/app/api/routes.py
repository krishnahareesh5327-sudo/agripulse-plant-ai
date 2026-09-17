"""
AgriPulse AI - API Router
Exposes endpoints for image analysis, quality validation, scan records,
environmental telemetry, and system metadata.
"""
import io
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, Query
from PIL import Image

from app.ml.quality_checker import ImageQualityAnalyzer
from app.ml.inference import PlantInferenceEngine
from app.ml.disease_data import DISEASE_REGISTRY, SUPPORTED_CROPS
from app.services.environmental import EnvironmentalIntelligence
from app.services.recommendation import SmartRecommendationEngine
from app import database

router = APIRouter(prefix="/api")

quality_analyzer = ImageQualityAnalyzer()
inference_engine = PlantInferenceEngine()
env_intelligence = EnvironmentalIntelligence()
recommendation_engine = SmartRecommendationEngine()

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOADS_DIR = BASE_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
SAMPLES_DIR = BASE_DIR / "samples"

@router.post("/image-quality")
async def check_quality(image: UploadFile = File(...)):
    """Pre-flight endpoint to evaluate image clarity, exposure, and foliage framing."""
    try:
        contents = await image.read()
        pil_img = Image.open(io.BytesIO(contents))
        report = quality_analyzer.evaluate(pil_img)
        return {"success": True, "report": report}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")

@router.post("/analyze")
async def analyze_plant(
    image: UploadFile = File(...),
    crop: str = Form("auto"),
    force: bool = Form(False),
    soil_moisture: Optional[float] = Form(None),
    temperature: Optional[float] = Form(None),
    humidity: Optional[float] = Form(None),
    ph: Optional[float] = Form(None),
    light: Optional[float] = Form(None),
    rainfall: Optional[float] = Form(None),
    notes: Optional[str] = Form("")
):
    """
    Main workflow endpoint:
    Processes plant image, validates quality, predicts condition, correlates environmental sensors,
    and returns comprehensive actionable agronomic report.
    """
    # 1. Validate file format
    allowed_exts = [".jpg", ".jpeg", ".png", ".webp"]
    file_ext = Path(image.filename).suffix.lower() if image.filename else ".jpg"
    if file_ext not in allowed_exts:
        file_ext = ".jpg"

    try:
        contents = await image.read()
        pil_img = Image.open(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Unable to decode uploaded image: {str(e)}")

    # 2. Image Quality Verification
    quality_report = quality_analyzer.evaluate(pil_img)
    if not quality_report["is_valid"] and not force:
        return {
            "success": False,
            "quality_passed": False,
            "quality_report": quality_report,
            "message": "Image quality is too low for reliable analysis. Please review the guidance below.",
            "tips": quality_report["tips"],
            "issues": quality_report["issues"]
        }

    # 3. Save uploaded image and thumbnail safely
    scan_id = str(uuid.uuid4())
    img_filename = f"{scan_id}{file_ext}"
    thumb_filename = f"{scan_id}_thumb{file_ext}"

    img_path = UPLOADS_DIR / img_filename
    thumb_path = UPLOADS_DIR / thumb_filename

    # Save original (resized to max 1280px for storage efficiency)
    save_img = pil_img.copy()
    save_img.thumbnail((1280, 1280), Image.Resampling.LANCZOS)
    save_img.convert("RGB").save(img_path, quality=85)

    # Save thumbnail
    thumb_img = pil_img.copy()
    thumb_img.thumbnail((256, 256), Image.Resampling.LANCZOS)
    thumb_img.convert("RGB").save(thumb_path, quality=80)

    image_url = f"/uploads/{img_filename}"
    thumb_url = f"/uploads/{thumb_filename}"

    # 4. ML Inference
    prediction = inference_engine.predict(pil_img, crop_hint=crop)

    # 5. Environmental Telemetry Processing
    sensor_inputs = {
        "soil_moisture": soil_moisture,
        "temperature": temperature,
        "humidity": humidity,
        "ph": ph,
        "light": light,
        "rainfall": rainfall
    }
    evaluated_sensors = env_intelligence.evaluate_parameters(prediction["crop"], sensor_inputs)
    compound_risk = env_intelligence.compute_compound_risk(
        condition=prediction["condition"],
        pathogen_type=prediction["pathogen_type"],
        is_healthy=prediction["is_healthy"],
        evaluated_sensors=evaluated_sensors
    )
    health_result = env_intelligence.calculate_health_score(
        is_healthy=prediction["is_healthy"],
        severity=prediction["severity"],
        confidence=prediction["confidence"],
        evaluated_sensors=evaluated_sensors
    )

    # 6. Smart Agronomic Recommendations
    recommendations = recommendation_engine.generate(
        prediction=prediction,
        evaluated_sensors=evaluated_sensors,
        compound_risk=compound_risk
    )

    # 7. Persist to Database
    scan_record = {
        "id": scan_id,
        "created_at": datetime.utcnow().isoformat(),
        "crop": prediction["crop"],
        "condition": prediction["condition"],
        "scientific_name": prediction["scientific_name"],
        "pathogen_type": prediction["pathogen_type"],
        "is_healthy": prediction["is_healthy"],
        "confidence": prediction["confidence"],
        "confidence_level": prediction["confidence_level"],
        "health_score": health_result["score"],
        "severity": prediction["severity"],
        "risk_level": compound_risk["risk_level"],
        "image_url": image_url,
        "thumbnail_url": thumb_url,
        "sensor_data": sensor_inputs,
        "prediction_data": prediction,
        "evaluated_sensors": evaluated_sensors,
        "compound_risk": compound_risk,
        "recommendations": recommendations,
        "technical": prediction["technical"],
        "notes": notes or ""
    }
    database.save_scan(scan_record)

    # Log sensor data if any provided
    if any(v is not None for v in sensor_inputs.values()):
        database.log_sensor_reading({**sensor_inputs, "source": "Scan Upload"})

    return {
        "success": True,
        "quality_passed": True,
        "quality_report": quality_report,
        "scan_id": scan_id,
        "created_at": scan_record["created_at"],
        "image_url": image_url,
        "thumbnail_url": thumb_url,
        "prediction": prediction,
        "evaluated_sensors": evaluated_sensors,
        "compound_risk": compound_risk,
        "health_score": health_result,
        "recommendations": recommendations,
        "technical": prediction["technical"]
    }

@router.get("/scans")
def list_scans(
    filter: str = Query("all"),
    search: str = Query(""),
    limit: int = Query(50),
    offset: int = Query(0)
):
    """Retrieve historical scan entries with flexible filtering and search."""
    items, total, stats = database.get_scans(
        filter_type=filter,
        search=search,
        limit=limit,
        offset=offset
    )
    return {
        "scans": items,
        "total": total,
        "stats": stats
    }

@router.get("/scans/{scan_id}")
def get_scan_details(scan_id: str):
    """Retrieve full details of a specific scan."""
    scan = database.get_scan(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
    return scan

@router.delete("/scans/{scan_id}")
def remove_scan(scan_id: str):
    """Deletes a scan record and its associated image files."""
    scan = database.get_scan(scan_id)
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")

    # Attempt to clean up image files
    for key in ["image_url", "thumbnail_url"]:
        if scan.get(key):
            fname = Path(scan[key]).name
            fpath = UPLOADS_DIR / fname
            if fpath.exists():
                try:
                    fpath.unlink()
                except Exception:
                    pass

    database.delete_scan(scan_id)
    return {"success": True, "message": "Scan record removed successfully"}

@router.delete("/scans")
def clear_scans():
    """Clear all stored scan history."""
    database.clear_all_scans()
    return {"success": True, "message": "All scan records cleared"}

@router.get("/environmental/overview")
def get_environmental_overview(crop: str = "Tomato"):
    """
    Returns current simulated/logged environmental readings,
    7-day sensor trends, and target biological ranges.
    """
    history = database.get_sensor_history(24)
    # Default active reading
    current_sensors = {
        "soil_moisture": 68.0,
        "temperature": 25.4,
        "humidity": 78.0,
        "ph": 6.4,
        "light": 34500.0,
        "rainfall": 12.0
    }
    if history:
        last = history[-1]
        for k in current_sensors:
            if last.get(k) is not None:
                current_sensors[k] = last[k]

    evaluated = env_intelligence.evaluate_parameters(crop, current_sensors)
    return {
        "current": evaluated,
        "raw": current_sensors,
        "history": history,
        "crop": crop
    }

@router.post("/sensor-data")
def ingest_sensor_data(payload: dict):
    """IoT endpoint for ESP32 / Arduino / MQTT data ingestion."""
    record_id = database.log_sensor_reading({
        "soil_moisture": payload.get("soil_moisture"),
        "temperature": payload.get("temperature"),
        "humidity": payload.get("humidity"),
        "ph": payload.get("ph"),
        "light": payload.get("light"),
        "rainfall": payload.get("rainfall"),
        "source": payload.get("source", "IoT Gateway")
    })
    return {"success": True, "record_id": record_id, "message": "Telemetry received"}

@router.get("/crops")
def get_crop_encyclopedia():
    """Returns supported crops and full PlantVillage disease encyclopedia."""
    return {
        "supported_crops": SUPPORTED_CROPS,
        "diseases": DISEASE_REGISTRY
    }

@router.get("/system/info")
def get_system_info():
    """Returns active model mode, demo/sandbox status, and calibrated thresholds."""
    return {
        "project_title": "AgriPulse AI - Plant Disease Detection & Smart Monitoring",
        "model_architecture": "Agronomic Feature Engine (PlantVillage Benchmark Taxonomy)",
        "inference_mode": "Sandbox & Heuristic Feature Engine",
        "demo_mode": True,
        "demo_mode_explanation": "Operating in Agronomic Inference Sandbox Mode with 38 PlantVillage pathology classes and live sensor compounding logic.",
        "supported_crops_count": len(SUPPORTED_CROPS) - 1,
        "classes_count": len(DISEASE_REGISTRY),
        "thresholds": {
            "high": inference_engine.high_threshold,
            "moderate": inference_engine.moderate_threshold
        },
        "target_audience": ["Farmers", "Agronomists", "Students", "Researchers", "Project Evaluators"]
    }

@router.get("/samples")
def list_sample_leaves():
    """Returns sample leaves for quick 1-click evaluation."""
    samples = [
        {
            "id": "tomato_early_blight",
            "title": "Tomato - Early Blight",
            "crop": "Tomato",
            "expected_condition": "Early Blight",
            "image_url": "/samples/sample_tomato_early_blight.jpg",
            "preset_sensors": {
                "soil_moisture": 76.0,
                "temperature": 27.5,
                "humidity": 84.0,
                "ph": 6.3,
                "light": 32000.0,
                "rainfall": 18.0
            },
            "description": "Notice concentric target rings with chlorotic yellow halo. Elevated humidity triggers compound fungal risk."
        },
        {
            "id": "potato_late_blight",
            "title": "Potato - Late Blight",
            "crop": "Potato",
            "expected_condition": "Late Blight",
            "image_url": "/samples/sample_potato_late_blight.jpg",
            "preset_sensors": {
                "soil_moisture": 84.0,
                "temperature": 19.0,
                "humidity": 92.0,
                "ph": 5.8,
                "light": 22000.0,
                "rainfall": 35.0
            },
            "description": "Dark water-soaked lesions under cool, saturated humidity. Triggers critical Phytophthora alert."
        },
        {
            "id": "corn_common_rust",
            "title": "Corn - Common Rust",
            "crop": "Corn",
            "expected_condition": "Common Rust",
            "image_url": "/samples/sample_corn_common_rust.jpg",
            "preset_sensors": {
                "soil_moisture": 65.0,
                "temperature": 23.0,
                "humidity": 82.0,
                "ph": 6.5,
                "light": 45000.0,
                "rainfall": 10.0
            },
            "description": "Elongated reddish-brown powdery pustules erupting through upper and lower leaf surfaces."
        },
        {
            "id": "apple_healthy",
            "title": "Apple - Healthy Leaf",
            "crop": "Apple",
            "expected_condition": "Healthy Plant",
            "image_url": "/samples/sample_apple_healthy.jpg",
            "preset_sensors": {
                "soil_moisture": 62.0,
                "temperature": 22.0,
                "humidity": 58.0,
                "ph": 6.6,
                "light": 38000.0,
                "rainfall": 0.0
            },
            "description": "Clean emerald green leaf with intact cuticle and optimal microclimate parameters."
        },
        {
            "id": "blurry_leaf",
            "title": "Quality Test - Blurry Photo",
            "crop": "Tomato",
            "expected_condition": "Quality Rejection Test",
            "image_url": "/samples/sample_blurry_leaf.jpg",
            "preset_sensors": {},
            "description": "Out-of-focus leaf designed to test the automated Image Quality Analyzer and rejection guidance."
        }
    ]
    return samples
