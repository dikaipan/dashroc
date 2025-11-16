# Fix: Styling Berbeda Antara Python vs npm run dev

## 🔍 Masalah

Styling terlihat berbeda ketika menjalankan via:
- ✅ `npm run dev` - styling benar
- ❌ `python app.py` - styling berbeda/rusak

## 🎯 Penyebab Umum

### 1. **CSS Tidak Ter-Load dengan Benar**

**Gejala:**
- Halaman tanpa styling (plain HTML)
- Beberapa komponen tidak ter-styling
- Tailwind classes tidak bekerja

**Penyebab:**
- CSS files tidak ter-serve oleh Flask
- Path CSS salah di `index.html`
- MIME type CSS tidak benar

**Solusi:**

#### Step 1: Verifikasi CSS Files Ada
```bash
# Check apakah CSS files ada di dist
cd frontend/dist/assets
dir *.css  # Windows
ls *.css   # Linux/Mac
```

Harus ada:
- `index-*.css` (main CSS dengan Tailwind)
- `vendor-maps-*.css` (Leaflet CSS)

#### Step 2: Rebuild Frontend
```bash
# Stop Flask server dulu (Ctrl+C)

cd frontend
npm run clean
npm run build

# Check apakah CSS ter-generate
ls dist/assets/*.css
```

#### Step 3: Hard Refresh Browser
- **Chrome/Edge**: `Ctrl + Shift + R` atau `Ctrl + F5`
- **Firefox**: `Ctrl + Shift + R`
- Atau gunakan **Incognito/Private mode**

### 2. **Tailwind CSS Tidak Ter-Generate**

**Gejala:**
- Tailwind utility classes tidak bekerja (misal: `bg-slate-800`, `text-white`)
- Custom Tailwind config tidak ter-apply

**Penyebab:**
- Tailwind tidak di-process saat build
- PostCSS tidak berjalan dengan benar
- `tailwind.config.js` tidak ter-deteksi

**Solusi:**

#### Check Tailwind Config
```bash
# Pastikan tailwind.config.js ada dan benar
cat frontend/tailwind.config.js
```

#### Check PostCSS Config
```bash
# Pastikan postcss.config.js ada
cat frontend/postcss.config.js
```

Harus berisi:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

#### Rebuild dengan Verbose
```bash
cd frontend
npm run clean
npm run build 2>&1 | tee build.log

# Check log untuk error Tailwind
grep -i tailwind build.log  # Linux/Mac
findstr /i tailwind build.log  # Windows
```

### 3. **Browser Cache CSS Lama**

**Gejala:**
- Styling lama masih muncul
- Perubahan CSS tidak terlihat

**Solusi:**

#### Clear Browser Cache
1. **Chrome/Edge:**
   - Tekan `F12` (Developer Tools)
   - Klik kanan pada tombol refresh
   - Pilih "Empty Cache and Hard Reload"

2. **Firefox:**
   - Tekan `Ctrl + Shift + Delete`
   - Pilih "Cache"
   - Clear

3. **Atau gunakan Incognito/Private Mode:**
   - Chrome: `Ctrl + Shift + N`
   - Firefox: `Ctrl + Shift + P`

#### Disable Cache di DevTools
1. Buka DevTools (`F12`)
2. Go to **Network** tab
3. Check **"Disable cache"**
4. Keep DevTools open saat testing

### 4. **Path CSS Salah di Flask**

**Gejala:**
- CSS files return 404
- Network tab menunjukkan CSS tidak ter-load

**Check di Browser:**
1. Buka **Developer Tools** (`F12`)
2. Go to **Network** tab
3. Refresh page (`F5`)
4. Filter by **CSS**
5. Check apakah CSS files return **200 OK** atau **404**

**Jika 404, check:**

#### Flask Route untuk Assets
File `app.py` harus serve assets dengan benar:
```python
# Di app.py, route serve_frontend harus handle assets
@app.route("/<path:path>")
def serve_frontend(path: str):
    # ... code untuk serve assets dari dist/
```

#### Test CSS Path Langsung
```bash
# Test apakah Flask bisa serve CSS
curl http://localhost:5000/assets/index-D99qJ343.css

# Atau buka di browser:
# http://localhost:5000/assets/index-D99qJ343.css
```

**Jika error, check:**
- Apakah file CSS benar-benar ada di `frontend/dist/assets/`?
- Apakah Flask route handle path `/assets/` dengan benar?

### 5. **MIME Type CSS Salah**

**Gejala:**
- CSS ter-load tapi browser tidak apply
- Console menunjukkan warning tentang MIME type

**Solusi:**

File `app.py` sudah set MIME type untuk CSS:
```python
mimetypes.add_type('text/css', '.css')
```

Tapi jika masih masalah, check response header:
1. Open DevTools → Network tab
2. Click pada CSS file
3. Check **Response Headers**
4. Harus ada: `Content-Type: text/css`

### 6. **Base Path Mismatch**

**Gejala:**
- CSS path di `index.html` menggunakan absolute path `/assets/`
- Flask serve dari root, jadi harusnya OK
- Tapi jika deploy di subdirectory, bisa masalah

**Check `vite.config.js`:**
```js
base: '/',  // Harus '/' untuk root
```

Jika deploy di subdirectory (misal: `/app/`), ubah ke:
```js
base: '/app/',
```

## 🔧 Solusi Lengkap Step-by-Step

### Step 1: Stop Semua Server
```bash
# Stop Flask (Ctrl+C di terminal Flask)
# Stop Vite dev server jika masih running (Ctrl+C)
```

### Step 2: Clean Build
```bash
cd frontend

# Clean dist folder
npm run clean

# Atau manual (Windows PowerShell):
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
```

### Step 3: Rebuild
```bash
# Pastikan di folder frontend
npm run build

# Check output - harus ada CSS files
ls dist/assets/*.css
```

### Step 4: Verify Build
```bash
# Check index.html di dist
cat dist/index.html

# Pastikan ada link CSS:
# <link rel="stylesheet" href="/assets/index-*.css">
# <link rel="stylesheet" href="/assets/vendor-maps-*.css">
```

### Step 5: Start Flask
```bash
cd ..
python app.py
```

### Step 6: Test di Browser
1. Buka `http://localhost:5000`
2. Open DevTools (`F12`)
3. Go to **Network** tab
4. Filter by **CSS**
5. Refresh page (`F5`)
6. Check apakah semua CSS files return **200 OK**

### Step 7: Hard Refresh
- `Ctrl + Shift + R` atau `Ctrl + F5`
- Atau gunakan Incognito mode

## 🐛 Troubleshooting Lanjutan

### Masalah: CSS Ter-Load Tapi Styling Masih Salah

**Kemungkinan:**
1. **CSS Specificity** - Custom CSS override Tailwind
2. **Theme Context** - Dark/Light theme tidak ter-apply
3. **CSS Variables** - CSS custom properties tidak ter-load

**Check:**

#### 1. Check Theme di Browser Console
```javascript
// Buka Console (F12)
document.documentElement.classList
// Harus ada 'dark-theme' atau 'light-theme'
```

#### 2. Check CSS Variables
```javascript
// Di Console
getComputedStyle(document.documentElement).getPropertyValue('--bg-1')
// Harus return warna (bukan kosong)
```

#### 3. Check Tailwind Classes
Inspect element di DevTools, check apakah Tailwind classes ter-apply:
- Right-click element → Inspect
- Check **Styles** tab
- Lihat apakah Tailwind classes ada di computed styles

### Masalah: Font Tidak Ter-Load

**Gejala:**
- Font Inter/Poppins tidak ter-apply
- Font fallback ke system font

**Penyebab:**
- Google Fonts tidak ter-load
- Network issue

**Solusi:**

#### Check Font Loading
1. DevTools → Network tab
2. Filter by **Font**
3. Check apakah Google Fonts ter-load

#### Test Font URL Langsung
```bash
# Test apakah bisa akses Google Fonts
curl "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap"
```

Jika tidak bisa (firewall/proxy), bisa download font dan serve lokal.

### Masalah: Responsive Design Tidak Bekerja

**Gejala:**
- Mobile view tidak responsive
- Breakpoints tidak bekerja

**Penyebab:**
- Viewport meta tag tidak ada
- Tailwind responsive classes tidak ter-generate

**Check:**

#### 1. Viewport Meta Tag
```html
<!-- Harus ada di index.html -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### 2. Tailwind Responsive Classes
Check apakah responsive classes ter-generate di CSS:
```bash
# Search untuk responsive classes di CSS
grep -i "@media" frontend/dist/assets/index-*.css
```

## ✅ Checklist Verifikasi

Setelah rebuild, pastikan:

- [ ] CSS files ada di `frontend/dist/assets/`
- [ ] `index.html` di dist memiliki link CSS yang benar
- [ ] Flask server bisa serve CSS files (test di browser)
- [ ] Network tab menunjukkan CSS files return 200 OK
- [ ] Browser cache sudah di-clear
- [ ] Tailwind classes bekerja (test dengan inspect element)
- [ ] Theme switching bekerja (dark/light mode)
- [ ] Font ter-load dengan benar
- [ ] Responsive design bekerja

## 📝 Best Practices

1. **Selalu rebuild setelah perubahan CSS/Tailwind**
2. **Gunakan hard refresh saat test production build**
3. **Check Network tab untuk verify CSS loading**
4. **Gunakan Incognito mode untuk test tanpa cache**
5. **Keep DevTools open saat development**

## 🔗 File Terkait

- `frontend/tailwind.config.js` - Tailwind configuration
- `frontend/postcss.config.js` - PostCSS configuration
- `frontend/src/index.css` - Main CSS dengan Tailwind directives
- `frontend/src/styles.css` - Custom CSS variables
- `app.py` - Flask server yang serve static files
- `frontend/vite.config.js` - Vite build configuration

## 💡 Tips

- **Development**: Gunakan `npm run dev` untuk hot reload CSS
- **Production Test**: Build dulu, lalu test dengan Flask
- **Debugging**: Selalu check Network tab untuk verify file loading
- **Cache**: Clear cache atau gunakan Incognito untuk test fresh

