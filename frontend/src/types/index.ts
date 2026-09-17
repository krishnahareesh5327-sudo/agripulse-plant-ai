export interface QualityMetrics {
  resolution: string;
  sharpness_variance: number;
  blur_score: number;
  mean_brightness: number;
  brightness_score: number;
  foliage_ratio: number;
  vegetation_score: number;
}

export interface QualityReport {
  is_valid: boolean;
  overall_score: number;
  metrics: QualityMetrics;
  issues: string[];
  tips: string[];
}

export interface AlternativePrediction {
  condition: string;
  crop: string;
  probability: number;
  is_healthy: boolean;
}

export interface TechnicalDetails {
  inference_engine: string;
  latency_ms: number;
  input_resolution: string;
  extracted_features: {
    green_coverage: string;
    lesion_density: string;
    chlorosis_halo: string;
    texture_variance: number;
  };
  thresholds: {
    high: number;
    moderate: number;
  };
}

export interface PredictionData {
  key: string;
  crop: string;
  condition: string;
  scientific_name: string;
  pathogen_type: string;
  is_healthy: boolean;
  status_text: string;
  confidence: number;
  confidence_level: 'High' | 'Moderate' | 'Low';
  confidence_description: string;
  severity: string;
  risk_level: string;
  description: string;
  symptoms: string[];
  causes: string;
  favored_environment: {
    temp_range: string;
    humidity: string;
    soil_moisture: string;
    key_vector: string;
  };
  alternatives: AlternativePrediction[];
  technical: TechnicalDetails;
}

export interface EvaluatedSensor {
  name: string;
  value: number;
  unit: string;
  status: 'optimal' | 'suitable' | 'warning' | 'critical';
  reference_range: string;
  interpretation: string;
  trend: string;
}

export interface CompoundRisk {
  risk_level: string;
  compound_score: number;
  summary: string;
  drivers: string[];
}

export interface CropHealthScore {
  score: number;
  label: string;
  breakdown: {
    foliar_condition: number;
    moisture_stability: number;
    thermal_comfort: number;
    humidity_balance: number;
    nutrient_ph: number;
  };
  disclaimer: string;
}

export interface Recommendations {
  immediate_action: {
    title: string;
    steps: string[];
  };
  crop_management: {
    title: string;
    steps: string[];
  };
  environmental_adjustment: {
    title: string;
    steps: string[];
  };
  treatments: {
    organic: string[];
    chemical: string[];
    safety_disclaimer: string;
  };
  prevention: {
    title: string;
    steps: string[];
  };
  monitoring_protocol: {
    title: string;
    steps: string[];
  };
}

export interface AnalysisResponse {
  success: boolean;
  quality_passed: boolean;
  quality_report: QualityReport;
  scan_id?: string;
  created_at?: string;
  image_url?: string;
  thumbnail_url?: string;
  prediction?: PredictionData;
  evaluated_sensors?: Record<string, EvaluatedSensor>;
  compound_risk?: CompoundRisk;
  health_score?: CropHealthScore;
  recommendations?: Recommendations;
  technical?: TechnicalDetails;
  message?: string;
  tips?: string[];
  issues?: string[];
}

export interface ScanRecord {
  id: string;
  created_at: string;
  crop: string;
  condition: string;
  scientific_name: string;
  pathogen_type: string;
  is_healthy: boolean;
  confidence: number;
  confidence_level: 'High' | 'Moderate' | 'Low';
  health_score: number;
  severity: string;
  risk_level: string;
  image_url: string;
  thumbnail_url?: string;
  sensor_data?: Record<string, any>;
  compound_risk?: CompoundRisk;
  notes?: string;
}

export interface SampleLeaf {
  id: string;
  title: string;
  crop: string;
  expected_condition: string;
  image_url: string;
  preset_sensors: Record<string, number>;
  description: string;
}

export interface SystemInfo {
  project_title: string;
  model_architecture: string;
  inference_mode: string;
  demo_mode: boolean;
  demo_mode_explanation: string;
  supported_crops_count: number;
  classes_count: number;
  thresholds: {
    high: number;
    moderate: number;
  };
}
