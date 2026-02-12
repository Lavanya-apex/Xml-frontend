#!/usr/bin/env pwsh
# Integration Setup Script for XML Validator Project
# This script automates the setup of both backend and frontend

$projectRoot = "C:\Users\lavanyat\Desktop\Validatior"
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  XML Validator - Local Integration Setup" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Step 1: Backend Setup
Write-Host "`n[1/4] Setting up Backend..." -ForegroundColor Yellow

Set-Location $backendDir

if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Gray
    python -m venv venv
}

Write-Host "Activating virtual environment..." -ForegroundColor Gray
& .\venv\Scripts\Activate.ps1

Write-Host "Installing Python dependencies..." -ForegroundColor Gray
pip install -r requirements.txt -q

Write-Host "✅ Backend setup complete!" -ForegroundColor Green

# Step 2: Frontend Setup
Write-Host "`n[2/4] Setting up Frontend..." -ForegroundColor Yellow

Set-Location $frontendDir

Write-Host "Installing Node dependencies..." -ForegroundColor Gray
npm install 2>&1 | Out-Null

Write-Host "✅ Frontend setup complete!" -ForegroundColor Green

# Step 3: Environment Check
Write-Host "`n[3/4] Checking Environment Configuration..." -ForegroundColor Yellow

$backendEnvPath = Join-Path $backendDir ".env"
$frontendEnvPath = Join-Path $frontendDir ".env"

$backendEnvOk = Test-Path $backendEnvPath
$frontendEnvOk = Test-Path $frontendEnvPath

if ($backendEnvOk) {
    Write-Host "✅ Backend .env exists" -ForegroundColor Green
} else {
    Write-Host "❌ Backend .env missing" -ForegroundColor Red
}

if ($frontendEnvOk) {
    Write-Host "✅ Frontend .env exists" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend .env missing" -ForegroundColor Red
}

# Step 4: Display Next Steps
Write-Host "`n[4/4] Ready to Start!" -ForegroundColor Yellow

Write-Host @"

────────────────────────────────────────────────────────────────

🚀 TO START THE APPLICATION:

Terminal 1 (Backend):
  cd $backendDir
  & .\venv\Scripts\Activate.ps1
  uvicorn app.main:app --reload --port 8000

Terminal 2 (Frontend):
  cd $frontendDir
  npm run dev

Terminal 3 (Database - if needed):
  mysql -u root -p
  CREATE DATABASE validator_db;

────────────────────────────────────────────────────────────────

✨ URLs:
  Backend:  http://localhost:8000
  Frontend: http://localhost:5173
  API Docs: http://localhost:8000/api/v1/openapi.json

📝 First Time:
  1. Register a new account
  2. Login
  3. Upload an XML file or validate from URL
  4. Check Dashboard for statistics

────────────────────────────────────────────────────────────────
"@ -ForegroundColor Cyan

Write-Host "Setup complete! 🎉" -ForegroundColor Green
