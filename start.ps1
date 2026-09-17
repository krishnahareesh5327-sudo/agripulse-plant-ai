# AgriPulse AI Launch Script for PowerShell
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "   AgriPulse AI - Agricultural Intelligence & Telemetry Suite" -ForegroundColor Green
Write-Host "======================================================================" -ForegroundColor Green

$env:Path = "C:\Program Files\nodejs;" + $env:Path
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Launching Backend on http://127.0.0.1:8000 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ScriptDir\backend'; python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[2/2] Launching Frontend on http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "$env:Path = 'C:\Program Files\nodejs;' + $env:Path; cd '$ScriptDir\frontend'; npm run dev"

Write-Host "`nServers active:" -ForegroundColor Yellow
Write-Host " - Frontend Application: http://localhost:5173" -ForegroundColor White
Write-Host " - Unified Production:   http://127.0.0.1:8000" -ForegroundColor White
Write-Host " - Interactive API Docs: http://127.0.0.1:8000/docs`n" -ForegroundColor White
