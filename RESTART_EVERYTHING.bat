@echo off
echo ========================================
echo   COMPLETE SYSTEM RESTART
echo ========================================
echo.
echo This will restart everything fresh!
echo.
pause
echo.

echo [1/4] Stopping all processes...
taskkill /F /IM python.exe 2>nul
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✅ Stopped
echo.

echo [2/4] Cleaning database...
cd backend
del /F handwriting.db 2>nul
echo ✅ Database cleaned
echo.

echo [3/4] Starting backend...
start "Backend Server - PORT 8000" cmd /k "python main.py"
echo ✅ Backend starting...
echo Waiting for backend to initialize (10 seconds)...
timeout /t 10 /nobreak >nul
echo.

echo [4/4] Starting frontend...
cd ..\frontend
start "Frontend Server - PORT 5000" cmd /k "npm run dev"
echo ✅ Frontend starting...
echo.

echo ========================================
echo   ALL SYSTEMS LAUNCHED!
echo ========================================
echo.
echo Wait 10 seconds, then open:
echo.
echo 🌐 Frontend: http://localhost:5000
echo 🔧 Backend:  http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo ========================================
echo   READY TO USE!
echo ========================================
echo.
echo You can now:
echo 1. Upload images
echo 2. Extract text
echo 3. View in Database Manager
echo 4. Edit/Delete records
echo.
pause
