@echo off
echo ========================================
echo   Starting Frontend Server
echo ========================================
echo.
cd frontend
echo Installing/Updating dependencies...
call npm install
echo.
echo Starting Vite development server...
echo Server will be available at: http://localhost:5000
echo.
npm run dev
pause
