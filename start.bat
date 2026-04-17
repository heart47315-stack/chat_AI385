@echo off
echo ========================================
echo   🚀 Chat AI - Starting Application
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo ✅ Backend dependencies installed
    echo.
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
    echo ✅ Frontend dependencies installed
    echo.
)

REM Check .env file
if not exist "backend\.env" (
    echo ⚠️  Creating backend\.env file...
    (
        echo DATABASE_URL="file:./prisma/dev.db"
        echo OPENAI_API_KEY="sk-your-api-key-here"
        echo PORT=5000
    ) > backend\.env
    echo ⚠️  Please update backend\.env with your OpenAI API key!
    echo.
)

REM Check if database exists, if not run seed
if not exist "backend\prisma\dev.db" (
    echo 🌱 Initializing database...
    cd backend
    call npm run seed
    cd ..
    echo ✅ Database initialized
    echo.
)

echo ========================================
echo   Starting Backend (Terminal 1)...
echo   Starting Frontend (Terminal 2)...
echo ========================================
echo.
echo 🌐 Frontend will open at: http://localhost:3000
echo 🔌 Backend running at: http://localhost:5000
echo.
echo Press Ctrl+C to stop either server
echo.

REM Start backend in a new terminal
start cmd /k "cd backend && npm run dev"

REM Start frontend in a new terminal
start cmd /k "cd frontend && npm run dev"

echo ✅ Both servers started!
echo   Check the opened terminal windows for server status
pause
