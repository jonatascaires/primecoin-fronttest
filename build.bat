@echo off
echo ========================================
echo   Build de Producao - PrimeCoin DApp
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

echo Criando build de producao...
echo.

call npm run build

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao criar build!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Build criado com sucesso!
echo ========================================
echo.
echo Os arquivos estao na pasta: dist/
echo.
echo Para testar o build, execute:
echo   npm run preview
echo.
pause
