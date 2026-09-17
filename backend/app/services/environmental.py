"""
AgriPulse AI - Environmental Intelligence Service
Interprets soil moisture, temperature, humidity, pH, light, and NPK against
crop-specific biological envelopes. Computes compounding risk factors and multi-factor
Crop Health Score (0-100).
"""
from typing import Dict, Any, List, Optional

# Crop-specific optimal biological thresholds
CROP_ENV_TARGETS: Dict[str, Dict[str, Any]] = {
    "Tomato": {
        "moisture": {"min": 60, "max": 75, "unit": "%"},
        "temperature": {"min": 20, "max": 28, "unit": "°C"},
        "humidity": {"min": 50, "max": 70, "unit": "%"},
        "ph": {"min": 6.0, "max": 6.8, "unit": ""},
        "light": {"min": 25000, "max": 50000, "unit": "lux"},
        "rainfall": {"min": 20, "max": 60, "unit": "mm"}
    },
    "Potato": {
        "moisture": {"min": 65, "max": 80, "unit": "%"},
        "temperature": {"min": 16, "max": 24, "unit": "°C"},
        "humidity": {"min": 55, "max": 75, "unit": "%"},
        "ph": {"min": 5.2, "max": 6.4, "unit": ""},
        "light": {"min": 20000, "max": 45000, "unit": "lux"},
        "rainfall": {"min": 25, "max": 70, "unit": "mm"}
    },
    "Corn": {
        "moisture": {"min": 60, "max": 75, "unit": "%"},
        "temperature": {"min": 20, "max": 30, "unit": "°C"},
        "humidity": {"min": 50, "max": 75, "unit": "%"},
        "ph": {"min": 5.8, "max": 7.0, "unit": ""},
        "light": {"min": 30000, "max": 60000, "unit": "lux"},
        "rainfall": {"min": 30, "max": 80, "unit": "mm"}
    },
    "Apple": {
        "moisture": {"min": 55, "max": 70, "unit": "%"},
        "temperature": {"min": 18, "max": 26, "unit": "°C"},
        "humidity": {"min": 45, "max": 65, "unit": "%"},
        "ph": {"min": 6.0, "max": 7.0, "unit": ""},
        "light": {"min": 25000, "max": 55000, "unit": "lux"},
        "rainfall": {"min": 25, "max": 65, "unit": "mm"}
    },
    "Pepper": {
        "moisture": {"min": 60, "max": 75, "unit": "%"},
        "temperature": {"min": 21, "max": 29, "unit": "°C"},
        "humidity": {"min": 50, "max": 70, "unit": "%"},
        "ph": {"min": 6.0, "max": 6.8, "unit": ""},
        "light": {"min": 25000, "max": 50000, "unit": "lux"},
        "rainfall": {"min": 20, "max": 55, "unit": "mm"}
    },
    "Grape": {
        "moisture": {"min": 50, "max": 65, "unit": "%"},
        "temperature": {"min": 20, "max": 30, "unit": "°C"},
        "humidity": {"min": 45, "max": 65, "unit": "%"},
        "ph": {"min": 6.0, "max": 7.2, "unit": ""},
        "light": {"min": 30000, "max": 65000, "unit": "lux"},
        "rainfall": {"min": 15, "max": 50, "unit": "mm"}
    }
}

class EnvironmentalIntelligence:
    def evaluate_parameters(
        self,
        crop: str,
        sensors: Dict[str, Optional[float]]
    ) -> Dict[str, Any]:
        """
        Evaluates each sensor parameter against target envelope for the crop.
        Returns status, interpretation, and visual trend indicators.
        """
        targets = CROP_ENV_TARGETS.get(crop, CROP_ENV_TARGETS["Tomato"])
        evaluated: Dict[str, Any] = {}

        # 1. Soil Moisture
        m_val = sensors.get("soil_moisture")
        if m_val is not None:
            t = targets["moisture"]
            if m_val < (t["min"] - 15):
                status, interp = "critical", f"Severe moisture deficit ({m_val}%). Plant is under drought stress."
            elif m_val < t["min"]:
                status, interp = "warning", f"Moisture is below target range ({t['min']}-{t['max']}%). Under-irrigation risk."
            elif m_val <= t["max"]:
                status, interp = "optimal", f"Soil moisture ({m_val}%) is optimal for root water and nutrient uptake."
            elif m_val <= (t["max"] + 12):
                status, interp = "warning", f"Soil moisture ({m_val}%) is elevated. Monitor root aeration."
            else:
                status, interp = "critical", f"Soil is waterlogged ({m_val}%). High risk of root suffocation and damping off."
            evaluated["soil_moisture"] = {
                "name": "Soil Moisture",
                "value": m_val,
                "unit": "%",
                "status": status,
                "reference_range": f"{t['min']}% - {t['max']}%",
                "interpretation": interp,
                "trend": "Stable" if status == "optimal" else ("Low" if m_val < t["min"] else "High")
            }

        # 2. Temperature
        temp_val = sensors.get("temperature")
        if temp_val is not None:
            t = targets["temperature"]
            if temp_val < (t["min"] - 8):
                status, interp = "critical", f"Cold stress detected ({temp_val}°C). Cellular metabolism slowed."
            elif temp_val < t["min"]:
                status, interp = "warning", f"Temperature is cool ({temp_val}°C). Slower growth rate."
            elif temp_val <= t["max"]:
                status, interp = "optimal", f"Temperature ({temp_val}°C) is in the preferred photosynthetic zone."
            elif temp_val <= (t["max"] + 6):
                status, interp = "warning", f"Temperature is elevated ({temp_val}°C). Increases transpiration demand."
            else:
                status, interp = "critical", f"Severe heat stress ({temp_val}°C). Pollen sterility and scorch risk."
            evaluated["temperature"] = {
                "name": "Air Temperature",
                "value": temp_val,
                "unit": "°C",
                "status": status,
                "reference_range": f"{t['min']}°C - {t['max']}°C",
                "interpretation": interp,
                "trend": "Normal" if status == "optimal" else ("Below Target" if temp_val < t["min"] else "Above Target")
            }

        # 3. Humidity
        hum_val = sensors.get("humidity")
        if hum_val is not None:
            t = targets["humidity"]
            if hum_val < (t["min"] - 15):
                status, interp = "warning", f"Very dry air ({hum_val}%). Accelerates water loss through leaves."
            elif hum_val < t["min"]:
                status, interp = "suitable", f"Humidity is slightly low ({hum_val}%). Adequate with sufficient watering."
            elif hum_val <= t["max"]:
                status, interp = "optimal", f"Relative humidity ({hum_val}%) is within optimal transpiration comfort zone."
            elif hum_val <= 82:
                status, interp = "warning", f"Elevated humidity ({hum_val}%). Prolongs dew and spore viability."
            else:
                status, interp = "critical", f"Extremely high humidity ({hum_val}%). Prime conditions for foliar pathogens."
            evaluated["humidity"] = {
                "name": "Relative Humidity",
                "value": hum_val,
                "unit": "%",
                "status": status,
                "reference_range": f"{t['min']}% - {t['max']}%",
                "interpretation": interp,
                "trend": "Normal" if status == "optimal" else ("Low" if hum_val < t["min"] else "Elevated")
            }

        # 4. Soil pH
        ph_val = sensors.get("ph")
        if ph_val is not None:
            t = targets["ph"]
            if ph_val < (t["min"] - 0.8):
                status, interp = "critical", f"Excessively acidic soil (pH {ph_val}). Danger of Aluminum/Manganese toxicity and Calcium lockout."
            elif ph_val < t["min"]:
                status, interp = "warning", f"Soil is slightly acidic (pH {ph_val}). Phosphorus availability reduced."
            elif ph_val <= t["max"]:
                status, interp = "optimal", f"Soil pH ({ph_val}) is optimal for maximum macro and micronutrient uptake."
            elif ph_val <= (t["max"] + 0.8):
                status, interp = "warning", f"Soil is moderately alkaline (pH {ph_val}). Iron chlorosis risk."
            else:
                status, interp = "critical", f"High alkalinity (pH {ph_val}). Severe micronutrient (Fe, Zn, Mn) lockout."
            evaluated["ph"] = {
                "name": "Soil pH",
                "value": ph_val,
                "unit": "",
                "status": status,
                "reference_range": f"{t['min']} - {t['max']}",
                "interpretation": interp,
                "trend": "Neutral / Balanced" if status == "optimal" else ("Acidic" if ph_val < t["min"] else "Alkaline")
            }

        # 5. Light Intensity
        light_val = sensors.get("light")
        if light_val is not None:
            t = targets["light"]
            if light_val < 10000:
                status, interp = "warning", f"Low photosynthetic light ({light_val} lux). Stem elongation / etiolation risk."
            elif light_val <= 65000:
                status, interp = "optimal", f"Light intensity ({light_val} lux) is sufficient for active photosynthesis."
            else:
                status, interp = "warning", f"Intense light radiation ({light_val} lux). Leaf solarization risk under high heat."
            evaluated["light"] = {
                "name": "Light Intensity",
                "value": light_val,
                "unit": "lux",
                "status": status,
                "reference_range": f"{t['min']:,} - {t['max']:,} lux",
                "interpretation": interp,
                "trend": "Optimal" if status == "optimal" else "Deviated"
            }

        # 6. Rainfall
        rain_val = sensors.get("rainfall")
        if rain_val is not None:
            t = targets["rainfall"]
            if rain_val > 80:
                status, interp = "warning", f"Heavy precipitation recorded ({rain_val} mm). Increases splash-borne inocula."
            else:
                status, interp = "optimal", f"Precipitation reading is manageable ({rain_val} mm)."
            evaluated["rainfall"] = {
                "name": "Rainfall",
                "value": rain_val,
                "unit": "mm",
                "status": status,
                "reference_range": f"0 - {t['max']} mm",
                "interpretation": interp,
                "trend": "Normal" if status == "optimal" else "Heavy"
            }

        return evaluated

    def compute_compound_risk(
        self,
        condition: str,
        pathogen_type: str,
        is_healthy: bool,
        evaluated_sensors: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Correlates pathogen biology with microclimate sensors to evaluate compound disease risk.
        """
        if is_healthy:
            return {
                "risk_level": "Low",
                "compound_score": 15,
                "summary": "Low environmental risk. Current sensor parameters support vigorous crop defense.",
                "drivers": []
            }

        drivers: List[str] = []
        risk_points = 35  # Base disease presence

        hum = evaluated_sensors.get("humidity")
        temp = evaluated_sensors.get("temperature")
        moist = evaluated_sensors.get("soil_moisture")
        ph = evaluated_sensors.get("ph")

        # Fungal compounding
        if pathogen_type in ["Fungus", "Oomycete / Water Mold"]:
            if hum and hum["value"] >= 80:
                risk_points += 30
                drivers.append(f"Elevated humidity ({hum['value']}%) drastically speeds up fungal sporulation and germination.")
            if moist and moist["value"] >= 78:
                risk_points += 15
                drivers.append(f"High soil moisture ({moist['value']}%) increases root zone humidity and splash dispersal.")
            if temp and (20 <= temp["value"] <= 30):
                risk_points += 10
                drivers.append(f"Temperature ({temp['value']}°C) sits directly in the pathogen's peak virulence window.")

        # Bacterial compounding
        elif pathogen_type == "Bacterium":
            if moist and moist["value"] >= 75:
                risk_points += 25
                drivers.append(f"Wet foliage and soil facilitate rapid Xanthomonas / bacterial multiplication.")
            if temp and temp["value"] >= 26:
                risk_points += 20
                drivers.append(f"Warm temperatures accelerate bacterial cellular division rates.")

        # pH stress compounding
        if ph and ph["status"] in ["warning", "critical"]:
            risk_points += 10
            drivers.append(f"Suboptimal pH ({ph['value']}) weakens cellular cuticle resistance.")

        compound_score = min(100, risk_points)

        if compound_score >= 75:
            level = "Critical Compound Risk"
            summary = "Critical environmental compounding detected. Microclimate conditions are actively accelerating disease transmission."
        elif compound_score >= 50:
            level = "High Compound Risk"
            summary = "Elevated risk. Microclimate parameters partially amplify pathogen proliferation."
        elif compound_score >= 30:
            level = "Moderate Risk"
            summary = "Moderate risk. Pathogen is present but microclimate is not intensely accelerating spread."
        else:
            level = "Low Risk"
            summary = "Environmental parameters are unfavorable for rapid pathogen progression."

        return {
            "risk_level": level,
            "compound_score": compound_score,
            "summary": summary,
            "drivers": drivers
        }

    def calculate_health_score(
        self,
        is_healthy: bool,
        severity: str,
        confidence: float,
        evaluated_sensors: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates AI-assisted Crop Health Score (0-100) combining visual condition + sensor health.
        """
        # Base score from visual classification
        if is_healthy:
            base_score = 94.0
        else:
            severity_map = {
                "Mild": 75.0,
                "Moderate": 54.0,
                "Severe": 34.0,
                "Critical": 16.0
            }
            base_score = severity_map.get(severity, 50.0)

        # Environmental penalties
        env_deductions = 0.0
        breakdown = {
            "foliar_condition": round(base_score, 1),
            "moisture_stability": 100.0,
            "thermal_comfort": 100.0,
            "humidity_balance": 100.0,
            "nutrient_ph": 100.0
        }

        if "soil_moisture" in evaluated_sensors:
            s = evaluated_sensors["soil_moisture"]["status"]
            if s == "critical":
                env_deductions += 14.0
                breakdown["moisture_stability"] = 40.0
            elif s == "warning":
                env_deductions += 7.0
                breakdown["moisture_stability"] = 70.0

        if "temperature" in evaluated_sensors:
            s = evaluated_sensors["temperature"]["status"]
            if s == "critical":
                env_deductions += 12.0
                breakdown["thermal_comfort"] = 45.0
            elif s == "warning":
                env_deductions += 6.0
                breakdown["thermal_comfort"] = 72.0

        if "humidity" in evaluated_sensors:
            s = evaluated_sensors["humidity"]["status"]
            if s == "critical":
                env_deductions += 12.0
                breakdown["humidity_balance"] = 45.0
            elif s == "warning":
                env_deductions += 6.0
                breakdown["humidity_balance"] = 75.0

        if "ph" in evaluated_sensors:
            s = evaluated_sensors["ph"]["status"]
            if s == "critical":
                env_deductions += 8.0
                breakdown["nutrient_ph"] = 50.0
            elif s == "warning":
                env_deductions += 4.0
                breakdown["nutrient_ph"] = 75.0

        final_score = max(5.0, min(100.0, base_score - (env_deductions * 0.6)))
        rounded_score = int(round(final_score))

        if rounded_score >= 85:
            status_label = "Robust / Healthy"
        elif rounded_score >= 65:
            status_label = "Good / Managed Stress"
        elif rounded_score >= 45:
            status_label = "Compromised / Active Symptoms"
        elif rounded_score >= 25:
            status_label = "Severe Stress / Immediate Action Needed"
        else:
            status_label = "Critical / Imminent Crop Loss"

        return {
            "score": rounded_score,
            "label": status_label,
            "breakdown": breakdown,
            "disclaimer": "AI-assisted health indicator synthesized from visual disease classification and environmental telemetry."
        }
