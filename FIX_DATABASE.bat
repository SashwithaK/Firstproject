@echo off
echo ========================================
echo   Database Migration Tool
echo ========================================
echo.
echo This will update your database schema
echo to include the new columns.
echo.
echo IMPORTANT: Stop the backend server first!
echo Press Ctrl+C now if backend is still running.
echo.
pause
echo.
cd backend
python migrate_database.py
echo.
echo ========================================
echo   Migration Complete
echo ========================================
echo.
echo You can now restart the backend server.
echo.
pause
