@echo off
echo ==============================================
echo   Starting TaskPilot Frontend Server (Next.js)
echo ==============================================
cd /d %~dp0\..\frontend
npm run dev
