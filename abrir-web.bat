@echo off
title El Ferretero - Servidor Local
echo ===================================================
echo     Iniciando servidor local de El Ferretero
echo     San Martin 2395, Rio Cuarto, Cordoba
echo ===================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Iniciando servidor Node.js con API REST y Frontend...
    start "" "http://localhost:8000"
    node server.js
    goto end
)

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Iniciando servidor Python HTTP...
    start "" "http://localhost:8000"
    python -m http.server 8000
    goto end
)

echo No se encontro Node.js ni Python.
echo Abriendo catalogo en el navegador directamente...
start "" "index.html"

:end
pause
