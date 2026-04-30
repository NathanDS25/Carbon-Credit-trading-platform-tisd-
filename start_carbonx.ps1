# CarbonX Unified Launch Script
Write-Host "🚀 Launching CarbonX Intelligence Terminal..." -ForegroundColor Cyan

# 1. Start Python ML Engine
Write-Host "📡 Starting Python ML Engine on Port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd python-ml; python main.py"

# 2. Start Backend Server
Write-Host "💻 Starting Node.js Backend on Port 5000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; npm run dev"

# 3. Start Satellite Worker
Write-Host "⚙️ Starting Satellite Analysis Worker..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; node workers/satelliteWorker.js"

# 4. Start Frontend
Write-Host "🌐 Launching Frontend on Port 5174..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd client; npm run dev"

Write-Host "✅ All systems are being deployed in separate terminals." -ForegroundColor Green
Write-Host "Please check the new windows for status logs." -ForegroundColor White
