@echo off
echo Setting up Voice Builder for Windows...

:: Copy the local development package.json
copy package-local.json package.json

:: Install dependencies
echo Installing dependencies...
npm install

:: Check if installation was successful
if %errorlevel% neq 0 (
    echo Installation failed. Please check your Node.js installation.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Voice Builder setup complete!
echo ==========================================
echo.
echo To start the application:
echo   npm run dev
echo.
echo Then open your browser to: http://localhost:5000
echo.
pause