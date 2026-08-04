@echo off
setlocal

cd /d "%~dp0"
set "PORT=8767"
set "NODE=node"

where node >nul 2>nul
if errorlevel 1 (
  set "NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)

start "AI Health Preview" /min "%NODE%" "%~dp0serve-mobile-preview.mjs"
timeout /t 1 /nobreak >nul
start "" "http://127.0.0.1:%PORT%/"
