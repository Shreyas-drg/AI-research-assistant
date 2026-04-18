@echo off
REM AI Research Assistant - Setup Script for Windows

echo.
echo ╔════════════════════════════════════════════╗
echo ║  AI Research Paper Summarizer - Setup      ║
echo ╚════════════════════════════════════════════╝
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    exit /b 1
)
echo ✅ Node.js found: 
node --version

echo.
echo Setting up Backend...
echo ─────────────────────────────────────────────

cd backend
if %errorlevel% neq 0 (
    echo ❌ Backend folder not found
    exit /b 1
)

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)
echo ✅ Backend dependencies installed

echo Installing PDF types...
call npm install @types/pdf-parse
if %errorlevel% neq 0 (
    echo ⚠️  Warning: Failed to install @types/pdf-parse
)
echo.

echo Frontend setup...
echo ─────────────────────────────────────────────

cd ..\frontend
if %errorlevel% neq 0 (
    echo ❌ Frontend folder not found
    exit /b 1
)

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✅ Frontend dependencies installed

cd ..
echo.
echo ✅ Setup Complete!
echo.
echo Next steps:
echo ─────────────────────────────────────────────
echo.
echo 1. Add Your OpenAI API Key:
echo    - Open: backend\.env
echo    - Add: OPENAI_API_KEY=sk-your-key-here
echo.
echo 2. Start Backend (Terminal 1):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend (Terminal 2):
echo    cd frontend
echo    npm run dev
echo.
echo 4. Open http://localhost:3000 in your browser
echo.
echo For more help, see README.md
echo.
pause
