@echo off
echo ========================================
echo   Database Reset Tool
echo ========================================
echo.
echo WARNING: This will DELETE all your data!
echo.
echo IMPORTANT: Stop the backend server first!
echo.
set /p confirm="Type YES to confirm: "
if /i not "%confirm%"=="YES" (
    echo.
    echo Operation cancelled.
    pause
    exit
)
echo.
echo Deleting old database...
cd backend
del /f handwriting.db 2>nul
echo.
if exist handwriting.db (
    echo ❌ Failed to delete database.
    echo Please close the backend server and try again.
) else (
    echo ✅ Database deleted successfully!
    echo.
    echo The database will be recreated with the correct
    echo schema when you start the backend server.
)
echo.
pause
