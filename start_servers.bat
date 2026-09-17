@echo off
title AgriPulse AI - Plant Disease Detection & Smart Monitoring
echo ======================================================================
echo    AgriPulse AI - Agricultural Intelligence & Telemetry Suite
echo ======================================================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%

echo [1/2] Starting Python FastAPI Backend Server on http://127.0.0.1:8000 ...
start "AgriPulse Backend" cmd /k "cd /d "%~dp0backend" && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Starting Frontend Vite Dev Server on http://localhost:5173 ...
start "AgriPulse Frontend" cmd /k "cd /d "%~dp0frontend" && set PATH=C:\Program Files\nodejs;%%PATH%% && npm run dev"

echo.
echo ======================================================================
echo Both servers launched!
echo - Web Application:  http://localhost:5173
echo - Unified Prod URL: http://127.0.0.1:8000
echo - Swagger API Docs: http://127.0.0.1:8000/docs
echo ======================================================================
pause
