# CarbonX Unified Launch Script
Write-Host "CarbonX Intelligence Terminal Launching..." -ForegroundColor Cyan

# 1. Start Python ML Engine
Write-Host "Starting Python ML Engine on Port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'python-ml'; python main.py"

# 2. Start Backend Server
Write-Host "Starting Node.js Backend on Port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'server'; npm run dev"

# 3. Start Satellite Worker
Write-Host "Starting Satellite Analysis Worker..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'server'; node workers/satelliteWorker.js"

# 4. Start Frontend
Write-Host "Starting Frontend on Port 5174..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'client'; npm run dev"

Write-Host "All systems deployed. Please check the new terminal windows." -ForegroundColor Green
