@echo off
setlocal

echo Starting PM2 with ecosystem.config.js...
cd /d %~dp0

REM Check if PM2 is installed
where pm2 >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] PM2 is not installed. Please install it with: npm install -g pm2
  exit /b 1
)

pm2 start ecosystem.config.js
if %errorlevel% neq 0 (
  echo [ERROR] Failed to start PM2 processes.
  exit /b 1
)

pm2 save
if %errorlevel% neq 0 (
  echo [ERROR] Failed to save PM2 process list.
  exit /b 1
)

echo PM2 processes started and saved successfully.

endlocal
