# TaskPilot Launch Script
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Launching TaskPilot Full-Stack (Backend + Frontend)" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

$root = Split-Path -Parent $PSScriptRoot

# Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\backend'; .\venv\Scripts\Activate.ps1; uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Start-Sleep -Seconds 3

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$root\frontend'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting up:" -ForegroundColor Green
Write-Host "  Backend API:  http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "  Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor Yellow
Write-Host "  Frontend Web: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
