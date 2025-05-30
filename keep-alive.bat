@echo off
:start
echo Starting server...
node server/server.js
echo.
echo Server stopped or crashed.
echo Checking for port conflicts...
netstat -ano | findstr :3000
echo.
echo Waiting 5 seconds before restarting...
timeout /t 5
goto start 