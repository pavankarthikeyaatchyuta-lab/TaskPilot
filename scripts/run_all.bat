@echo off
echo ========================================================
echo   Launching TaskPilot Full-Stack (Backend + Frontend)
echo ========================================================
start "TaskPilot Backend" cmd /k "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul
start "TaskPilot Frontend" cmd /k "%~dp0run_frontend.bat"
echo.
echo Both servers are starting up:
echo   - Backend:  http://127.0.0.1:8000
echo   - Swagger:  http://127.0.0.1:8000/docs
echo   - Frontend: http://localhost:3000
echo.
