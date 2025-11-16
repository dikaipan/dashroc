# Cara Melihat Perubahan Light Mode Engineers Management

## ✅ Build Sudah Selesai

Frontend sudah di-rebuild dengan perubahan light mode untuk Engineers Management.

## 🔄 Langkah-langkah untuk Melihat Perubahan

### Step 1: Stop Flask Server (Jika Masih Running)
```bash
# Di terminal Flask, tekan:
Ctrl+C
```

### Step 2: Start Flask Server Lagi
```bash
python app.py
```

### Step 3: Clear Browser Cache & Hard Refresh

**PENTING:** Browser mungkin masih cache versi lama!

#### Cara 1: Hard Refresh (Paling Mudah)
- Tekan `Ctrl + Shift + R` atau `Ctrl + F5`
- Atau `Shift + F5`

#### Cara 2: Clear Cache via DevTools
1. Buka Developer Tools (`F12`)
2. Klik kanan pada tombol **Refresh** (di browser)
3. Pilih **"Empty Cache and Hard Reload"**

#### Cara 3: Gunakan Incognito/Private Mode (Paling Aman)
- Chrome: `Ctrl + Shift + N`
- Firefox: `Ctrl + Shift + P`
- Edge: `Ctrl + Shift + N`

### Step 4: Test Light Mode

1. Buka `http://localhost:5000/engineers`
2. **Switch ke Light Mode** (gunakan toggle theme di aplikasi)
3. **Verify:**
   - ✅ Teks di tabel harus **terbaca jelas** (dark text on light background)
   - ✅ Header tabel harus **gray-800** (bukan putih)
   - ✅ Background tabel harus **putih** (bukan dark)
   - ✅ Pagination buttons harus **terlihat jelas**
   - ✅ Checkboxes harus **terlihat jelas**

## 🔍 Troubleshooting

### Jika Masih Tidak Terlihat Perubahan:

#### 1. Pastikan Flask Serve File Baru
```bash
# Check apakah file Engineers.js terbaru di dist
dir frontend\dist\assets\Engineers-*.js
```

File terbaru harus: `Engineers-DZwKnT6x.js` (79.30 kB)

#### 2. Check Browser Network Tab
1. Buka DevTools (`F12`)
2. Go to **Network** tab
3. Refresh page (`F5`)
4. Filter by **JS**
5. Check apakah `Engineers-*.js` ter-load dengan benar
6. Check **Status** harus **200 OK**

#### 3. Force Reload JavaScript
1. DevTools → **Network** tab
2. Check **"Disable cache"**
3. Keep DevTools open
4. Refresh page (`F5`)

#### 4. Clear All Browser Data
1. `Ctrl + Shift + Delete`
2. Pilih **"Cached images and files"**
3. Time range: **"All time"**
4. Clear data
5. Restart browser

### Jika Masih Bermasalah:

1. **Stop Flask server** (`Ctrl+C`)
2. **Clear dist folder:**
   ```bash
   cd frontend
   npm run clean
   npm run build
   ```
3. **Start Flask lagi:**
   ```bash
   cd ..
   python app.py
   ```
4. **Hard refresh browser** (`Ctrl + Shift + R`)

## ✅ Checklist Verifikasi

Setelah mengikuti langkah di atas:

- [ ] Flask server sudah di-restart
- [ ] Browser cache sudah di-clear (hard refresh)
- [ ] Light mode sudah diaktifkan
- [ ] Teks di tabel Engineers terbaca jelas
- [ ] Background tabel putih (bukan dark)
- [ ] Header tabel gray-800 (bukan putih)
- [ ] Pagination buttons terlihat jelas
- [ ] Checkboxes terlihat jelas

## 📝 Catatan Penting

- **Selalu hard refresh** setelah rebuild untuk melihat perubahan
- **Gunakan Incognito mode** untuk test tanpa cache
- **Check Network tab** untuk verify file ter-load dengan benar
- **Pastikan Flask serve file terbaru** dari dist folder

## 🎯 Hasil yang Diharapkan

Di **Light Mode**, Engineers Management harus:
- ✅ Background tabel: **Putih**
- ✅ Teks: **Gray-800** (dark, mudah dibaca)
- ✅ Header: **Gray-800** dengan background **Gray-100**
- ✅ Borders: **Gray-200**
- ✅ Hover states: **Gray-50** background
- ✅ Semua elemen **terbaca jelas** dan **kontras**

