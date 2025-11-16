# PowerShell script untuk check CSS build
# Usage: .\check-css-build.ps1

Write-Host "🔍 Checking CSS Build Status..." -ForegroundColor Cyan
Write-Host ""

# Check if dist folder exists
$distPath = "frontend\dist"
if (-not (Test-Path $distPath)) {
    Write-Host "❌ ERROR: dist folder tidak ditemukan!" -ForegroundColor Red
    Write-Host "   Jalankan: cd frontend && npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ dist folder ditemukan" -ForegroundColor Green

# Check CSS files
$cssFiles = Get-ChildItem -Path "$distPath\assets" -Filter "*.css" -ErrorAction SilentlyContinue

if ($cssFiles.Count -eq 0) {
    Write-Host "❌ ERROR: Tidak ada CSS files di dist/assets/" -ForegroundColor Red
    Write-Host "   Jalankan: cd frontend && npm run build" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ CSS files ditemukan:" -ForegroundColor Green
foreach ($css in $cssFiles) {
    $size = [math]::Round($css.Length / 1KB, 2)
    Write-Host "   - $($css.Name) ($size KB)" -ForegroundColor Gray
}

# Check index.html
$indexHtml = Join-Path $distPath "index.html"
if (-not (Test-Path $indexHtml)) {
    Write-Host "❌ ERROR: index.html tidak ditemukan!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ index.html ditemukan" -ForegroundColor Green

# Check if CSS links exist in index.html
$htmlContent = Get-Content $indexHtml -Raw
$cssLinkCount = ([regex]::Matches($htmlContent, 'rel="stylesheet"')).Count

if ($cssLinkCount -eq 0) {
    Write-Host "❌ ERROR: Tidak ada CSS links di index.html!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ CSS links di index.html: $cssLinkCount" -ForegroundColor Green

# Extract CSS file names from index.html
Write-Host ""
Write-Host "📋 CSS files yang direferensikan di index.html:" -ForegroundColor Cyan
$cssLinks = [regex]::Matches($htmlContent, 'href="([^"]*\.css)"')
foreach ($match in $cssLinks) {
    $cssPath = $match.Groups[1].Value
    $cssFile = Split-Path $cssPath -Leaf
    $fullPath = Join-Path $distPath $cssPath.TrimStart('/')
    
    if (Test-Path $fullPath) {
        Write-Host "   ✅ $cssPath" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $cssPath (FILE TIDAK DITEMUKAN!)" -ForegroundColor Red
    }
}

# Check Tailwind classes in CSS
Write-Host ""
Write-Host "🔍 Checking Tailwind CSS..." -ForegroundColor Cyan
$mainCss = Get-ChildItem -Path "$distPath\assets" -Filter "index-*.css" | Select-Object -First 1

if ($mainCss) {
    $cssContent = Get-Content $mainCss.FullName -Raw
    
    # Check for common Tailwind classes
    $hasTailwind = $false
    if ($cssContent -match '\.bg-slate|\.text-white|\.flex|\.grid') {
        $hasTailwind = $true
    }
    
    if ($hasTailwind) {
        Write-Host "✅ Tailwind classes terdeteksi di CSS" -ForegroundColor Green
    } else {
        Write-Host "⚠️  WARNING: Tailwind classes mungkin tidak ter-generate" -ForegroundColor Yellow
    }
    
    # Check CSS size
    $cssSize = [math]::Round($mainCss.Length / 1KB, 2)
    if ($cssSize -lt 10) {
        Write-Host "⚠️  WARNING: CSS file terlalu kecil ($cssSize KB) - mungkin Tailwind tidak ter-generate" -ForegroundColor Yellow
    } else {
        Write-Host "✅ CSS file size normal ($cssSize KB)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✨ Check selesai!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host "   1. Pastikan Flask server tidak running" -ForegroundColor Gray
Write-Host "   2. Jika ada error, jalankan: cd frontend && npm run clean && npm run build" -ForegroundColor Gray
Write-Host "   3. Start Flask: python app.py" -ForegroundColor Gray
Write-Host "   4. Test di browser dengan hard refresh (Ctrl+Shift+R)" -ForegroundColor Gray

