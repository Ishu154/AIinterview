@echo off
echo Starting AI Video Interviewer...
echo.

REM Check if backend is ready
if not exist backend\node_modules (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if frontend is ready  
if not exist frontend\node_modules (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

echo.
echo ==========================================
echo AI Video Interviewer - Starting...
echo ==========================================
echo.
echo Backend will start on http://localhost:5000
echo Frontend will start on http://localhost:3000
echo.
echo Press Ctrl+C to stop both servers
echo.

REM Start backend in a new window
start "Backend Server" cmd /k "cd backend && npm run dev"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend in a new window
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
