# ROC Dashboard Netlify Deployment Script

Write-Host "Starting Netlify deployment..." -ForegroundColor Green

# Check if Netlify CLI is installed
if (!(Get-Command netlify -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Netlify CLI..." -ForegroundColor Yellow
    npm install -g netlify-cli
}

# Build frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location frontend
npm install
npm run build
Set-Location ..

# Copy data files to functions directory
Write-Host "Copying data files..." -ForegroundColor Yellow
if (Test-Path "netlify\functions\data") {
    Remove-Item "netlify\functions\data" -Recurse -Force
}
Copy-Item "data" "netlify\functions\data" -Recurse -Force

# Install function dependencies
Write-Host "Installing function dependencies..." -ForegroundColor Yellow
pip install -r netlify/functions/requirements.txt

# Deploy to Netlify
Write-Host "Deploying to Netlify..." -ForegroundColor Yellow
netlify deploy --prod --dir=frontend/dist --functions=netlify/functions

Write-Host "Deployment complete!" -ForegroundColor Green
