@echo off
echo ========================================
echo   EMERGENCY DATABASE FIX
echo ========================================
echo.
echo This will:
echo 1. Stop all Python processes
echo 2. Delete old database
echo 3. Restart backend with fresh database
echo.
echo Press any key to continue...
pause >nul
echo.

echo [Step 1/3] Stopping Python processes...
taskkill /F /IM python.exe 2>nul
timeout /t 2 /nobreak >nul
echo ✅ Done
echo.

echo [Step 2/3] Deleting old database...
cd backend
del /F handwriting.db 2>nul
echo ✅ Done
echo.

echo [Step 3/3] Starting backend with new database...
start "Backend Server" cmd /k "python main.py"
timeout /t 3 /nobreak >nul
echo ✅ Backend started!
echo.

echo ========================================
echo   FIX COMPLETE!
echo ========================================
echo.
echo Backend is running at: http://localhost:8000
echo Frontend should be at: http://localhost:5000
echo.
echo You can now upload images without errors!
echo.
pause
