@echo off
echo ========================================
echo Ceylon Cargo Transport - Development
echo ========================================
echo.
echo Checking Node.js version...
node --version
echo.
echo Checking npm version...
npm --version
echo.
echo ========================================
echo Starting development servers...
echo ========================================
echo.
echo Admin Dashboard will run on: http://localhost:3001
echo Client Portal will run on: http://localhost:3002
echo Showcase Site will run on: http://localhost:3003
echo API Server will run on: http://localhost:5000
echo.
echo Press Ctrl+C to stop all servers
echo.
npm run dev
