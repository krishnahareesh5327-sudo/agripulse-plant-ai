# AgriPulse AI: AI-Based Plant Disease Detection & Smart Monitoring System

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-3178C6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Python](https://img.shields.io/badge/Python-3.13+-3776AB.svg?logo=python&logoColor=white)](https://python.org)

**AgriPulse AI** is a production-grade agricultural AI SaaS application that empowers farmers, agricultural students, researchers, and project evaluators to diagnose foliar plant diseases from leaf imagery and correlate microclimate telemetry (soil moisture, temperature, humidity, pH, light, rainfall) for predictive crop health monitoring.

---

## Key Features

1. **Precision Foliar Disease Classification**:
   - Benchmarked on the **PlantVillage 38-class taxonomy** covering key crops (Tomato, Potato, Corn, Apple, Grape, Pepper, etc.).
   - Transparent, calibrated confidence scoring (High $\ge 85\%$, Moderate $60-84\%$, Low $< 60\%$) with explicit inference mode labeling.

2. **Automated Image Quality Inspection**:
   - Evaluates focus/blurriness using high-frequency discrete Laplacian variance.
   - Evaluates luminance exposure (detecting overexposed flash or severely underexposed frames).
   - Computes foliage color presence (green chlorophyll and necrotic chlorosis ratios) before running classification to reject non-plant or severely unusable images.

3. **Environmental Intelligence & Compounding Risk**:
   - Interprets Soil Moisture, Air Temperature, Relative Humidity, Soil pH, Light Intensity, and Rainfall against crop physiological envelopes.
   - Calculates **Compounding Virulence Risk** (e.g. high humidity $\ge 80\%$ combined with warm temperatures accelerating *Alternaria solani* fungal sporulation).

4. **Multi-Factor Crop Health Score (0–100)**:
   - A weighted composite index combining visual foliar damage with environmental stress penalties (moisture deficit, thermal shock, vapor pressure deficit, and pH lockout).

5. **Actionable Agronomic Intervention Plans**:
   - Immediate 0–24 hour containment actions (sanitation, lower leaf pruning, quarantine).
   - Canopy and row management guidelines.
   - Organic bio-fungicides and regional chemical guidance with prominent agricultural extension safety disclaimers.
   - 7-day field monitoring checklist.

6. **IoT-Ready Telemetry Ingestion**:
   - Modular REST endpoint (`/api/sensor-data`) ready for ESP32, Arduino LoRa, or Raspberry Pi microclimate field sensors.
   - Built-in telemetry simulator for real-time demonstration.

7. **1-Click Evaluation Presets**:
   - Pre-loaded botanically distinct leaf samples (Tomato Early Blight, Potato Late Blight, Apple Healthy, Corn Rust, and Blurry Leaf rejection test) for instantaneous testing.

8. **Persistent Scan History**:
   - SQLite-backed history tracking with search, category filtering (Healthy, Diseased, High Risk, Low Confidence), and single-click deletion.

---

## Project Structure

```
agripulse-plant-ai/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── routes.py           # REST endpoints (/api/analyze, /api/scans, etc.)
│   │   ├── ml/
│   │   │   ├── quality_checker.py  # Blur variance, exposure & vegetation analyzer
│   │   │   ├── disease_data.py     # PlantVillage 38-class agronomic knowledge base
│   │   │   └── inference.py        # Modular ML engine & confidence calibrator
│   │   ├── services/
│   │   │   ├── environmental.py    # Biological threshold engine & compounding risk
│   │   │   └── recommendation.py   # IPM action planner & safety disclaimers
│   │   ├── data/
│   │   │   └── scans.db            # SQLite persistence
│   │   ├── uploads/                # Sanitized user image storage & thumbnails
│   │   ├── samples/                # Pre-loaded test leaves for evaluation
│   │   ├── database.py             # SQLite CRUD manager
│   │   └── main.py                 # FastAPI application & SPA static server
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/             # Reusable UI widgets (HealthGauge, ConfidenceMeter, etc.)
│   │   ├── pages/                  # LandingPage, DashboardPage, AnalyzePage, ResultPage, etc.
│   │   ├── services/api.ts         # Type-safe API client
│   │   ├── types/index.ts          # Complete TypeScript interfaces
│   │   ├── App.tsx                 # Core router & state coordinator
│   │   └── index.css               # Tailwind CSS styling
│   ├── dist/                       # Optimized production build
│   └── package.json
├── start_servers.bat               # Windows batch launcher
├── start.ps1                       # PowerShell launch script
└── README.md
```

---

## Quick Start (Local Execution)

### Prerequisites
- **Python 3.10+** (tested on Python 3.13)
- **Node.js 18+** and npm (tested on Node v24.19)

### 1. Launch with One Click (Windows)
Double-click `start_servers.bat` or run:
```powershell
.\start.ps1
```

### 2. Manual Startup

**Backend Server:**
```powershell
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Frontend Server (Vite Development):**
```powershell
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## Production Deployment

The application is engineered so that FastAPI directly serves the production frontend build:

1. Build frontend:
   ```powershell
   cd frontend
   npm run build
   ```
2. Start FastAPI:
   ```powershell
   cd backend
   python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
   ```
3. The unified application is now live at **`http://localhost:8000`** with zero external web server dependencies required.

---

## REST API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/analyze` | Multi-part form: leaf image + optional sensor inputs |
| `POST` | `/api/image-quality` | Pre-flight image sharpness and exposure validation |
| `GET` | `/api/scans` | List scan records with query filters (`healthy`, `diseased`, `high_risk`) |
| `GET` | `/api/scans/{id}` | Detailed scan record with compounding risk & breakdown |
| `DELETE` | `/api/scans/{id}` | Remove scan and associated image files |
| `DELETE` | `/api/scans` | Clear all historical scans |
| `GET` | `/api/environmental/overview` | Live telemetry readings, reference envelopes & trends |
| `POST` | `/api/sensor-data` | IoT gateway payload ingestion (ESP32/LoRa) |
| `GET` | `/api/crops` | Complete PlantVillage crop & disease encyclopedia |
| `GET` | `/api/samples` | 1-click test leaves for evaluator demonstration |
| `GET` | `/api/system/info` | Inference mode status and confidence thresholds |

---

## ML Inference Architecture & Future Integration

The inference layer (`backend/app/ml/inference.py`) implements a modular interface:
- **Active Mode**: *Agronomic Feature & Telemetry Sandbox* (calibrated against PlantVillage colorimetric, lesion, and textural distributions).
- **Extensibility**: To drop in a custom PyTorch (`.pt`) or ONNX model (`.onnx`), inherit from `BasePlantClassifier` and point `self.model_path` to the model weights. The frontend, telemetry engine, and recommendation pipelines will seamlessly receive the model logits without requiring refactoring.

---

## Academic & Presentation Notes

- **Responsible AI**: Predictions are labeled as probabilities (e.g., *"Model confidence is high (93.6%). Visual patterns consistent with Early Blight"*).
- **Compounding Environmental Risk**: Highlighting how humidity and temperature accelerate fungal sporulation provides practical agronomic value beyond standard vision-only classification demos.
- **Image Quality Guard**: Prevents garbage-in/garbage-out by explicitly flagging blurry or out-of-frame images with constructive feedback.
