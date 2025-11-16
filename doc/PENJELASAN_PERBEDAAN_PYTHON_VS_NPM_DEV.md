# Penjelasan: Perbedaan Tampilan Python vs npm run dev

## 🔍 Masalah

Ketika Anda menjalankan website melalui **Python (Flask)** dan **npm run dev**, tampilan bisa berbeda karena beberapa alasan:

## 📊 Perbedaan Utama

### 1. **Mode Development vs Production**

#### `npm run dev` (Development Mode)
- ✅ **Vite dev server** berjalan di port **5173**
- ✅ **Hot Module Replacement (HMR)** - perubahan langsung terlihat
- ✅ **Source maps** aktif untuk debugging
- ✅ **Unminified code** - kode mudah dibaca
- ✅ **Proxy API** - request `/api` di-proxy ke Flask di port 5000
- ✅ **Fast refresh** - React component update tanpa reload

#### `python app.py` (Production Mode)
- ⚙️ **Flask server** berjalan di port **5000**
- ⚙️ **Static files** dari folder `frontend/dist/` (build production)
- ⚙️ **Minified & optimized** - kode di-compress untuk performa
- ⚙️ **No hot reload** - perlu rebuild untuk melihat perubahan
- ⚙️ **API langsung** - request `/api` langsung ke Flask (tidak perlu proxy)

### 2. **Build State**

**Masalah paling umum:** Build production (`frontend/dist/`) mungkin:
- ❌ **Outdated** - tidak di-update setelah perubahan kode
- ❌ **Built dengan konfigurasi berbeda**
- ❌ **Cache browser** masih menyimpan versi lama

### 3. **Environment Variables**

Build production "membekukan" environment variables saat build time:
- `import.meta.env.MODE` = `'production'` (bukan `'development'`)
- `import.meta.env.PROD` = `true`
- `import.meta.env.DEV` = `false`

### 4. **API Configuration**

Keduanya menggunakan `/api` sebagai base URL, tapi:
- **npm run dev**: Proxy Vite mengarahkan ke `http://127.0.0.1:5000/api`
- **Python**: Langsung ke Flask di `http://localhost:5000/api`

## 🔧 Solusi

### Solusi 1: Rebuild Frontend (Paling Umum)

Jika Anda membuat perubahan di frontend, **selalu rebuild** sebelum menjalankan Flask:

```bash
# 1. Stop Flask server (Ctrl+C)

# 2. Build frontend
cd frontend
npm run build

# 3. Kembali ke root dan jalankan Flask
cd ..
python app.py
```

### Solusi 2: Clear Browser Cache

Browser mungkin cache versi lama. Clear cache atau gunakan **Incognito/Private mode**:

**Chrome/Edge:**
- Tekan `Ctrl + Shift + Delete`
- Pilih "Cached images and files"
- Atau gunakan `Ctrl + Shift + N` untuk Incognito

**Firefox:**
- Tekan `Ctrl + Shift + Delete`
- Pilih "Cache"
- Atau gunakan `Ctrl + Shift + P` untuk Private Window

### Solusi 3: Verifikasi Build

Pastikan build berhasil dan folder `dist/` ter-update:

```bash
cd frontend

# Check apakah dist/ ada dan terbaru
ls -la dist/  # Linux/Mac
dir dist\     # Windows

# Jika perlu, clean dan rebuild
npm run clean
npm run build
```

### Solusi 4: Development Workflow yang Benar

**Untuk Development (mengedit kode):**
```bash
# Terminal 1: Flask backend
python app.py

# Terminal 2: Vite dev server
cd frontend
npm run dev
```

Akses via: `http://localhost:5173` (akan proxy ke Flask untuk API)

**Untuk Testing Production Build:**
```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Jalankan Flask (akan serve build production)
cd ..
python app.py
```

Akses via: `http://localhost:5000`

### Solusi 5: Check Console Browser

Buka **Developer Tools** (F12) dan check:
- **Console** - apakah ada error JavaScript?
- **Network** - apakah API calls berhasil?
- **Sources** - apakah file yang di-load benar?

## 🐛 Troubleshooting

### Masalah: Tampilan berbeda setelah rebuild

**Kemungkinan:**
1. Browser cache masih menyimpan versi lama
2. Build tidak berhasil dengan benar
3. File di `dist/` terkunci oleh proses lain

**Solusi:**
```bash
# 1. Stop semua server
# 2. Clear dist folder
cd frontend
npm run clean

# 3. Rebuild
npm run build

# 4. Hard refresh browser (Ctrl + F5)
```

### Masalah: API tidak bekerja di Flask

**Check:**
- Apakah Flask server berjalan?
- Apakah route `/api/*` terdaftar di Flask?
- Check Network tab di browser untuk melihat response

**Test API:**
```bash
# Test langsung ke Flask
curl http://localhost:5000/api/engineers
```

### Masalah: Styling berbeda

**Kemungkinan:**
- CSS tidak ter-build dengan benar
- Tailwind CSS tidak di-generate untuk production
- Path asset salah

**Solusi:**
```bash
cd frontend
npm run build

# Check apakah CSS ada di dist/assets/
ls dist/assets/*.css
```

## 📝 Best Practices

1. **Selalu rebuild setelah perubahan frontend** sebelum test dengan Flask
2. **Gunakan `npm run dev` untuk development** - lebih cepat dan nyaman
3. **Gunakan Flask untuk test production build** sebelum deploy
4. **Clear browser cache** jika melihat masalah aneh
5. **Check console browser** untuk error JavaScript

## 🔄 Workflow yang Disarankan

### Development (Harian)
```bash
# Terminal 1
python app.py

# Terminal 2  
cd frontend
npm run dev
```
→ Edit kode → Auto reload → Test di `http://localhost:5173`

### Pre-Deployment Testing
```bash
# 1. Build production
cd frontend
npm run build

# 2. Test dengan Flask
cd ..
python app.py
```
→ Test di `http://localhost:5000` → Verifikasi semua fitur bekerja

## 📚 Referensi

- **Vite Config**: `frontend/vite.config.js`
- **Flask Config**: `app.py` dan `config.py`
- **API Config**: `frontend/src/utils/apiConfig.js`

## ⚠️ Catatan Penting

- **Jangan edit file di `frontend/dist/`** - folder ini auto-generated
- **Selalu edit di `frontend/src/`** lalu rebuild
- **Build production lebih lambat** tapi lebih optimal untuk production
- **Development mode lebih cepat** tapi tidak optimal untuk production

