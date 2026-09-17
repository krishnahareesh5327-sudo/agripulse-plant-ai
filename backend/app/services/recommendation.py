"""
AgriPulse AI - Smart Agronomic Recommendation Engine
Combines disease classification, confidence, pathogen biology, and environmental telemetry
to generate a structured, highly actionable intervention strategy.
"""
from typing import Dict, Any, List
from app.ml.disease_data import DISEASE_REGISTRY

class SmartRecommendationEngine:
    def generate(
        self,
        prediction: Dict[str, Any],
        evaluated_sensors: Dict[str, Any],
        compound_risk: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Synthesizes immediate actions, crop management, environmental adjustments,
        responsible treatment advice, and 7-day monitoring protocol.
        """
        key = prediction.get("key")
        registry_data = DISEASE_REGISTRY.get(key, {})

        is_healthy = prediction.get("is_healthy", False)
        condition = prediction.get("condition", "Unknown")
        crop = prediction.get("crop", "Crop")
        confidence = prediction.get("confidence", 75.0)

        # Baseline actions from registry
        immediate_actions = list(registry_data.get("immediate_actions", []))
        crop_management = list(registry_data.get("crop_management", []))
        treatments = registry_data.get("treatments", {})
        prevention = list(registry_data.get("prevention", []))
        monitoring = list(registry_data.get("monitoring_checklist", []))

        # Contextual environmental adjustments based on live telemetry
        env_adjustments: List[str] = []

        hum = evaluated_sensors.get("humidity")
        if hum and hum["value"] > 75:
            env_adjustments.append(
                f"Relative humidity is high ({hum['value']}%). Increase greenhouse sidewall venting or increase plant row spacing to accelerate canopy drying."
            )
        elif hum and hum["value"] < 40:
            env_adjustments.append(
                f"Air is dry ({hum['value']}%). Ensure consistent root-zone moisture to reduce transpiration stress."
            )

        moist = evaluated_sensors.get("soil_moisture")
        if moist and moist["value"] > 78:
            env_adjustments.append(
                f"Soil moisture is high ({moist['value']}%). Pause scheduled irrigation cycle until top 5 cm of root zone partially dries out."
            )
        elif moist and moist["value"] < 50:
            env_adjustments.append(
                f"Soil moisture is low ({moist['value']}%). Schedule targeted drip irrigation in early morning."
            )

        temp = evaluated_sensors.get("temperature")
        if temp and temp["value"] > 30:
            env_adjustments.append(
                f"High ambient temperature ({temp['value']}°C) accelerates pathogen incubation. Deploy shade cloths (30-40% transmission) if feasible."
            )

        ph = evaluated_sensors.get("ph")
        if ph and ph["status"] in ["warning", "critical"]:
            if ph["value"] < 6.0:
                env_adjustments.append(
                    f"Soil is acidic (pH {ph['value']}). Consider applying agricultural limestone or dolomite to buffer root zone toward 6.5."
                )
            else:
                env_adjustments.append(
                    f"Soil is alkaline (pH {ph['value']}). Apply elemental sulfur or acidifying fertilizer (ammonium sulfate) to restore nutrient availability."
                )

        if not env_adjustments:
            env_adjustments.append("Maintain current environmental controls; parameters are well-balanced.")

        # Low-confidence caveat
        if confidence < 60.0:
            immediate_actions.insert(
                0,
                "Model confidence is low (< 60%). Re-capture image in bright indirect light before executing major chemical interventions."
            )

        return {
            "immediate_action": {
                "title": "Immediate Actions (Next 0 - 24 Hours)",
                "steps": immediate_actions
            },
            "crop_management": {
                "title": "Field & Canopy Management",
                "steps": crop_management
            },
            "environmental_adjustment": {
                "title": "Environmental Telemetry Adjustments",
                "steps": env_adjustments
            },
            "treatments": {
                "organic": treatments.get("organic", ["Maintain organic biological soil amendments."]),
                "chemical": treatments.get("chemical", ["Apply regional extension approved fungicides."]),
                "safety_disclaimer": treatments.get(
                    "safety_disclaimer",
                    "Use only products legally authorized for this crop and target pathogen in your country or region. Strictly respect label instructions, personal protective equipment (PPE), and Pre-Harvest Intervals (PHI)."
                )
            },
            "prevention": {
                "title": "Long-Term Prevention & Hygiene",
                "steps": prevention
            },
            "monitoring_protocol": {
                "title": "7-Day Scouting & Monitoring Routine",
                "steps": monitoring
            }
        }
