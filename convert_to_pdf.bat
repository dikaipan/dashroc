@echo off
echo ========================================
echo Konversi HTML ke PDF - ROC Dashboard
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python tidak terinstall!
    echo Silakan install Python terlebih dahulu.
    pause
    exit /b 1
)

REM Check if HTML file exists
if not exist "PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html" (
    echo ERROR: File PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html tidak ditemukan!
    pause
    exit /b 1
)

REM Run Python script
echo Menjalankan script konversi...
python convert_to_pdf.py

echo.
echo ========================================
echo Selesai!
echo ========================================
pause

