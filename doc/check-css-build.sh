#!/bin/bash
# Bash script untuk check CSS build
# Usage: ./check-css-build.sh

echo "🔍 Checking CSS Build Status..."
echo ""

# Check if dist folder exists
DIST_PATH="frontend/dist"
if [ ! -d "$DIST_PATH" ]; then
    echo "❌ ERROR: dist folder tidak ditemukan!"
    echo "   Jalankan: cd frontend && npm run build"
    exit 1
fi

echo "✅ dist folder ditemukan"

# Check CSS files
CSS_FILES=$(find "$DIST_PATH/assets" -name "*.css" 2>/dev/null)

if [ -z "$CSS_FILES" ]; then
    echo "❌ ERROR: Tidak ada CSS files di dist/assets/"
    echo "   Jalankan: cd frontend && npm run build"
    exit 1
fi

echo "✅ CSS files ditemukan:"
for css in $CSS_FILES; do
    SIZE=$(du -h "$css" | cut -f1)
    FILENAME=$(basename "$css")
    echo "   - $FILENAME ($SIZE)"
done

# Check index.html
INDEX_HTML="$DIST_PATH/index.html"
if [ ! -f "$INDEX_HTML" ]; then
    echo "❌ ERROR: index.html tidak ditemukan!"
    exit 1
fi

echo ""
echo "✅ index.html ditemukan"

# Check if CSS links exist in index.html
CSS_LINK_COUNT=$(grep -o 'rel="stylesheet"' "$INDEX_HTML" | wc -l)

if [ "$CSS_LINK_COUNT" -eq 0 ]; then
    echo "❌ ERROR: Tidak ada CSS links di index.html!"
    exit 1
fi

echo "✅ CSS links di index.html: $CSS_LINK_COUNT"

# Extract CSS file names from index.html
echo ""
echo "📋 CSS files yang direferensikan di index.html:"
grep -o 'href="[^"]*\.css"' "$INDEX_HTML" | sed 's/href="//;s/"//' | while read -r css_path; do
    FULL_PATH="$DIST_PATH/${css_path#/}"
    if [ -f "$FULL_PATH" ]; then
        echo "   ✅ $css_path"
    else
        echo "   ❌ $css_path (FILE TIDAK DITEMUKAN!)"
    fi
done

# Check Tailwind classes in CSS
echo ""
echo "🔍 Checking Tailwind CSS..."
MAIN_CSS=$(find "$DIST_PATH/assets" -name "index-*.css" | head -n 1)

if [ -n "$MAIN_CSS" ]; then
    # Check for common Tailwind classes
    if grep -q -E '\.bg-slate|\.text-white|\.flex|\.grid' "$MAIN_CSS"; then
        echo "✅ Tailwind classes terdeteksi di CSS"
    else
        echo "⚠️  WARNING: Tailwind classes mungkin tidak ter-generate"
    fi
    
    # Check CSS size
    CSS_SIZE=$(du -h "$MAIN_CSS" | cut -f1)
    CSS_SIZE_KB=$(du -k "$MAIN_CSS" | cut -f1)
    if [ "$CSS_SIZE_KB" -lt 10 ]; then
        echo "⚠️  WARNING: CSS file terlalu kecil ($CSS_SIZE) - mungkin Tailwind tidak ter-generate"
    else
        echo "✅ CSS file size normal ($CSS_SIZE)"
    fi
fi

echo ""
echo "✨ Check selesai!"
echo ""
echo "📝 Next steps:"
echo "   1. Pastikan Flask server tidak running"
echo "   2. Jika ada error, jalankan: cd frontend && npm run clean && npm run build"
echo "   3. Start Flask: python app.py"
echo "   4. Test di browser dengan hard refresh (Ctrl+Shift+R)"

