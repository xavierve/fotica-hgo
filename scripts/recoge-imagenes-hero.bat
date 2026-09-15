@echo off
REM ===========================================================================
REM  recoge-imagenes-hero.bat
REM
REM  Copia a static\images\_resize\hero\ las imagenes usadas por los bloques
REM  hero del front matter, separadas por rol en tres subcarpetas:
REM      bg\         fondo CSS apaisado (full-bleed)
REM      bg-mobile\  fondo CSS vertical para movil
REM      image\      figura en primer plano dentro del hero
REM  Incluye las variantes _hd cuando existen.
REM
REM  Uso: doble clic, o desde la raiz del repo:  scripts\recoge-imagenes-hero.bat
REM  No modifica ni borra nada: solo copia. Se puede relanzar sin problema.
REM ===========================================================================
setlocal
cd /d "%~dp0\.."
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0recoge-imagenes-hero.ps1"
echo.
pause
