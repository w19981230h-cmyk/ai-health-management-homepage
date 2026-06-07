@echo off
setlocal

cd /d "%~dp0"
set "PORT=8088"
set "PYTHON=python"

where python >nul 2>nul
if errorlevel 1 (
  set "PYTHON=C:\Users\GUST\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
)

start "AI Health Preview" /min "%PYTHON%" -m http.server %PORT% --bind 127.0.0.1
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/index.html"
