@echo off
echo ========================================
echo   Iniciando PrimeCoin Staking DApp
echo ========================================
echo.

cd /d "%~dp0"

if not exist "node_modules" (
    echo [AVISO] Dependencias nao instaladas!
    echo Execute install.bat primeiro.
    echo.
    pause
    exit /b 1
)

echo Abrindo servidor de desenvolvimento...
echo.
echo A aplicacao abrira automaticamente no navegador.
echo Pressione Ctrl+C para parar o servidor.
echo.

call npm run dev

pause
