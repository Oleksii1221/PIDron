@echo off
setlocal

cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js / npm not found. Install Node.js first.
  pause
  exit /b 1
)

if not exist "node_modules\electron" (
  echo Installing PIDron dependencies...
  call npm install
  if errorlevel 1 (
    echo Failed to install dependencies.
    pause
    exit /b 1
  )
)

echo Starting PIDron...
call npm start

if errorlevel 1 (
  echo PIDron exited with an error.
  pause
  exit /b 1
)
