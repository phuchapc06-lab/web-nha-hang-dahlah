@echo off
chcp 65001 >nul
title KRON-DAHLAH RESTAURANT BACKEND SERVER
cls
echo ===================================================================
echo     HE THONG BACKEND & DATABASE NHA HANG KRON-DAHLAH
echo     De tai: Quan ly du an CNTT - Dai hoc Kinh te Quoc dan (NEU)
echo ===================================================================
echo.
echo [1/3] Kiem tra moi truong Python...
python --version
if errorlevel 1 (
    echo [LOI] Khong tim thay Python tren he thong. Vui long cai dat Python 3.
    pause
    exit /b
)

echo.
echo [2/3] Cai dat thu vien can thiet (Flask, Flask-CORS)...
pip install -r requirements.txt

echo.
echo [3/3] Khoi tao co so du lieu SQLite & du lieu mau...
python seed_data.py

echo.
echo ===================================================================
echo     DANG KHOI CHAY MAY CHU FLASK SERVER...
echo     Trang chu:         http://127.0.0.1:5000/
echo     Trang Quan tri:    http://127.0.0.1:5000/admin
echo     RESTful API:       http://127.0.0.1:5000/api/bookings
echo ===================================================================
echo.
python app.py
pause
