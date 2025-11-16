# Cara Akses Dokumentasi ROC Dashboard

Dokumentasi HTML (`PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html`) dapat diakses melalui beberapa cara:

## 🌐 Cara Akses

### 1. Melalui Flask Server (Python)

Ketika menjalankan aplikasi dengan Flask:

```bash
python app.py
```

Akses dokumentasi melalui URL:
- **http://localhost:5000/docs**
- **http://localhost:5000/panduan**
- **http://localhost:5000/documentation**

### 2. Melalui Vite Dev Server (npm run dev)

Ketika menjalankan development server:

```bash
cd frontend
npm run dev
```

**Catatan**: File HTML dokumentasi tidak secara otomatis di-serve oleh Vite dev server karena berada di root folder.

**Solusi**:
1. **Buka langsung di browser**: Double-click file `PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html` di file explorer
2. **Atau copy ke folder public**: Copy file ke `frontend/public/` dan akses via `http://localhost:5173/docs.html`
3. **Atau gunakan Flask**: Jalankan Flask server untuk akses via `/docs`

### 3. Buka Langsung di Browser (Paling Mudah)

1. Buka File Explorer
2. Navigate ke folder `rocdash`
3. Double-click file `PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html`
4. File akan terbuka di browser default

## 🔧 Mengapa Tampilan Berbeda?

### Perbedaan Environment:

1. **Flask Server (Python)**:
   - Serve file dari `frontend/dist` (build production)
   - File HTML dokumentasi di-serve via route `/docs`
   - Path relatif untuk screenshot: `/screenshots/`

2. **Vite Dev Server (npm run dev)**:
   - Serve aplikasi React dari `frontend/src`
   - File HTML dokumentasi tidak di-serve (kecuali di-copy ke `public/`)
   - Path relatif berbeda karena base URL berbeda

### Solusi untuk Konsistensi:

#### Opsi 1: Copy ke Public Folder (Recommended untuk Development)

```bash
# Copy file HTML ke public folder
cp PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html frontend/public/

# Copy folder screenshots
cp -r screenshots frontend/public/
```

Kemudian akses via: `http://localhost:5173/PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html`

#### Opsi 2: Gunakan Flask Server

Jalankan Flask server untuk akses yang konsisten:

```bash
python app.py
```

Akses via: `http://localhost:5000/docs`

#### Opsi 3: Buka Langsung

Double-click file HTML di file explorer - ini akan selalu bekerja dengan benar.

## 📸 Screenshot Path

Untuk screenshot agar ter-load dengan benar:

### Di Flask Server:
- Path: `/screenshots/filename.png`
- URL: `http://localhost:5000/screenshots/filename.png`

### Di Vite Dev Server (jika di-copy ke public):
- Path: `/screenshots/filename.png`
- URL: `http://localhost:5173/screenshots/filename.png`

### Buka Langsung:
- Path: `screenshots/filename.png` (relative path)
- File harus ada di folder `screenshots/` di root project

## 🎯 Rekomendasi

Untuk development dan testing:
- **Gunakan Flask server** untuk konsistensi penuh
- Atau **buka langsung** file HTML di browser

Untuk production:
- File HTML bisa di-deploy bersama aplikasi
- Atau di-host secara terpisah sebagai dokumentasi

## 🔍 Troubleshooting

### Screenshot tidak muncul:
1. Pastikan file screenshot ada di folder `screenshots/`
2. Pastikan nama file sesuai dengan `data-label` di HTML
3. Check browser console untuk error loading gambar
4. Pastikan path relatif benar sesuai environment

### CSS tidak ter-load:
- File HTML menggunakan inline CSS, jadi tidak ada masalah dengan CSS
- Jika ada masalah, pastikan browser support CSS modern

### Font tidak ter-load:
- File HTML menggunakan Google Fonts (Inter)
- Pastikan koneksi internet aktif untuk load font
- Atau download font dan gunakan local font

## 📝 Catatan

- File HTML dokumentasi adalah file statis independen
- Tidak memerlukan server untuk dibuka langsung
- Screenshot akan auto-load jika file ada di folder `screenshots/`
- Semua styling menggunakan inline CSS, jadi tidak ada dependency eksternal




