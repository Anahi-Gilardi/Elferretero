@echo off
title Iniciando El Ferretero
echo ==========================================
echo    Iniciando servidor local de El Ferretero
echo ==========================================
echo.
start "" "http://localhost:8000"
python -m http.server 8000
if %ERRORLEVEL% NEQ 0 (
    echo No se encontro Python, abriendo index.html directamente...
    start "" "index.html"
)
pause
