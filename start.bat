@echo off
setlocal
cd /d "%~dp0"

echo ================================================
echo  Honda Civic 8th Gen - Electronic Service Manual
echo ================================================
echo.

:: ── 1. Python installation ────────────────────────
echo [1/4] Instalando Python para ejecutar...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Ya instalado, siguiente paso...
) else (
    echo Python no encontrado. Intentando instalar...
    winget --version >nul 2>&1
    if %errorlevel% equ 0 (
        winget install Python.Python.3 --silent --accept-source-agreements --accept-package-agreements
        if %errorlevel% neq 0 (
            echo ERROR: No se ha podido instalar automáticamente.
            goto :manual_install
        )
        echo Python instalado correctamente. Vuelveme a ejecutar para continuar.
        pause
        exit /b 0
    ) else (
        :manual_install
        echo ERROR: No se ha podido instalar automáticamente.
        echo Descargalo en: https://www.python.org/downloads/
        echo Revisa "Add Python to PATH" durante la instalación.
        pause
        exit /b 1
    )
)
echo.

:: ── 2. Python check ───────────────────────────────
echo [2/4] Verificando Python para ejecutar...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python no encontrado después del intento de instalación.
    echo Reiniciame o instala manualmente Python desde: https://www.python.org/downloads/
    pause
    exit /b 1
)
for /f "tokens=*" %%v in ('python --version 2^>^&1') do echo %%v - OK
echo No se necesíta la librería (usa built-in http.server).
echo.

:: ── 3. HTTP server ────────────────────────────────
echo [3/4] Inicializando servidor para el manual...
netstat -ano 2>nul | findstr ":8080 " >nul 2>&1
if %errorlevel% equ 0 (
    echo Parando servidor anteriormente inicializado 8080...
    for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr ":8080 "') do (
        taskkill /PID %%p /F >nul 2>&1
    )
    timeout /t 1 /nobreak >nul
)
start "Honda ESM - Servidor [ciérrame para acabar]" python -m http.server 8080
timeout /t 2 /nobreak >nul
echo Servidor inicializado en otra ventana.
echo.

:: ── 4. Open browser ───────────────────────────────
echo [4/4] Abriendo manual en el navegador...
start "" http://localhost:8080/index.html
echo.

echo ¡Completado!
echo Cierra la ventana "Honda ESM - Server" para acabar.
