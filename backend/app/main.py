"""
AgriPulse AI - Backend Application
FastAPI Server with CORS, Database Initialization, Static Asset Mounts,
and Single-Page Application (SPA) production distribution serving.
"""
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app import database
from app.api.routes import router

BASE_DIR = Path(__file__).resolve().parent
UPLOADS_DIR = BASE_DIR / "uploads"
SAMPLES_DIR = BASE_DIR / "samples"
FRONTEND_DIST = BASE_DIR.parent.parent / "frontend" / "dist"

UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

app = FastAPI(
    title="AgriPulse AI - Plant Disease Detection & Smart Monitoring API",
    description="Production-grade agricultural AI SaaS backend with modular inference, image quality checks, and environmental intelligence.",
    version="1.0.0"
)

# CORS configuration allowing frontend development & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database schema
database.init_db()

# Mount API router
app.include_router(router)

# Mount static asset routes for uploaded scans and preloaded test samples
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
app.mount("/samples", StaticFiles(directory=str(SAMPLES_DIR)), name="samples")

# If production frontend build exists, serve static assets & SPA index.html
if FRONTEND_DIST.exists():
    assets_dir = FRONTEND_DIST / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        target = FRONTEND_DIST / full_path
        if target.is_file():
            return FileResponse(target)
        return FileResponse(FRONTEND_DIST / "index.html")
else:
    @app.get("/")
    def root():
        return {
            "status": "healthy",
            "service": "AgriPulse AI API",
            "version": "1.0.0",
            "docs_url": "/docs"
        }
