@echo off
echo ========================================
echo   PrimeCoin Staking DApp - Setup
echo ========================================
echo.

cd /d "%~dp0"

echo Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado!
    echo Por favor, instale o Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado!
node --version
echo.

echo Instalando dependencias...
echo Isso pode levar alguns minutos...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo [ERRO] Falha ao instalar dependencias!
    echo Verifique sua conexao com a internet.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Instalacao concluida com sucesso!
echo ========================================
echo.
echo Para iniciar a aplicacao, execute:
echo   npm run dev
echo.
echo Ou clique duas vezes em: start-dev.bat
echo.
pause
