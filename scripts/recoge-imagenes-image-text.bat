@echo off
REM ===========================================================================
REM  recoge-imagenes-image-text.bat
REM
REM  Copia a static\images\_resize\ todas las imagenes usadas por bloques
REM  image-text, tanto en front matter (- type: image-text ... image: "...")
REM  como en shortcodes ({{< image-text image="..." >}}).
REM
REM  Uso: doble clic, o desde la raiz del repo:  scripts\recoge-imagenes-image-text.bat
REM  No modifica ni borra nada: solo copia. Se puede relanzar las veces que haga falta.
REM ===========================================================================
setlocal
cd /d "%~dp0\.."
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0recoge-imagenes-image-text.ps1"
echo.
pause
