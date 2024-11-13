@echo off
echo Starting SWMS Application...

:: Start Ganache GUI (you'll need to start this manually)
echo Please ensure Ganache GUI is running...
timeout 5

:: Deploy Contracts
cd C:\Users\hassa\OneDrive\Desktop\frontend\swms
echo Deploying smart contracts...
start cmd /k "truffle migrate --reset"
timeout 5

:: Start Flask Backend
cd C:\Users\hassa\OneDrive\Desktop\frontend\swms\backend
echo Starting Flask backend...
start cmd /k "python app.py"
timeout 5

:: Start React Frontend
cd C:\Users\hassa\OneDrive\Desktop\frontend\swms
echo Starting React frontend...
start cmd /k "npm start"

echo Application stack started!
echo.
echo Please verify:
echo 1. Ganache GUI is running
echo 2. Smart contracts are deployed
echo 3. Flask backend is running on http://localhost:5000
echo 4. React frontend is running on http://localhost:3000
echo 5. MetaMask is connected to Ganache
pause
