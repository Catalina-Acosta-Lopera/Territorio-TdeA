@echo off
title Asistente Virtual Territorio TdeA
echo ========================================================
echo   Iniciando Servidor Local - Asistente Territorio TdeA
echo ========================================================
echo.
echo 1. Iniciando servidor en http://localhost:8000 ...
echo 2. Abriendo navegador predeterminado...
echo.
echo [INFO] Deja esta ventana abierta mientras uses la aplicacion.
echo [INFO] Para apagar el servidor, simplemente cierra esta ventana.
echo.
start http://localhost:8000
py -m http.server 8000
if %ERRORLEVEL% NEQ 0 (
    python -m http.server 8000
)
pause
