# 🎯 Langkah-langkah Mengurangi Ukuran node_modules

## ⚡ Quick Start

Untuk mengurangi ukuran node_modules secara drastis, ikuti langkah berikut:

### 1. Hapus node_modules dan package-lock.json
```bash
cd frontend
npm run clean:install
```

### 2. Install semua dependencies, lalu hapus dependencies besar
```bash
npm run install:minimal
```

Script ini akan:
1. Install semua dependencies (termasuk netlify-cli dan @vitest/ui)
2. Menghapus folder netlify-cli dan @vitest/ui dari node_modules setelah install
3. Mengurangi ukuran node_modules tanpa merusak build

### 3. Verifikasi ukuran
```bash
npm run analyze:deps
```

## 📊 Perbandingan Ukuran

| Metode Instalasi | Ukuran node_modules | Pengurangan |
|------------------|---------------------|-------------|
| **Sebelum** (dengan semua deps) | ~342 MB | - |
| **Sesudah** (tanpa optional) | ~130-150 MB | **~60%** |

## 🎯 Dependencies yang Dapat Dihapus

1. **netlify-cli** (207.93 MB) - Hanya diperlukan untuk Netlify deployment lokal
2. **@vitest/ui** (~50-100 MB) - Hanya diperlukan untuk testing dengan UI

**Catatan:** Dependencies ini tetap ada di `package.json`, hanya folder di `node_modules` yang dihapus. Mereka akan terinstall kembali pada `npm install` berikutnya.

## ✅ Dependencies yang Tetap Terinstall

Semua dependencies production dan development penting tetap terinstall:
- React & React DOM
- Vite
- Tailwind CSS
- Recharts
- Leaflet
- Testing libraries (tanpa UI)
- ESLint
- Dan lainnya

## 🔧 Kapan Perlu Restore Dependencies Besar?

### Restore Dependencies
```bash
npm run restore:large-deps
```

**Kapan diperlukan:**
- Saat ingin menggunakan `npm run test:ui` untuk testing dengan UI
- Saat ingin menggunakan `npm run netlify:dev` untuk testing lokal Netlify
- Untuk development Netlify functions

**Catatan:** Deployment di Netlify tidak memerlukan netlify-cli di local, karena Netlify akan menginstall dependencies sendiri.

## 🚀 Untuk CI/CD

### GitHub Actions / GitLab CI
```yaml
# Install tanpa optional dependencies untuk build yang lebih cepat
- run: npm ci --no-optional
- run: npm run build
```

### Vercel / Netlify
Tidak perlu perubahan, platform akan menginstall dependencies sendiri.

## 📝 Checklist

- [ ] Hapus node_modules lama: `npm run clean:install`
- [ ] Install minimal: `npm run install:minimal`
- [ ] Verifikasi build: `npm run build`
- [ ] Verifikasi dev server: `npm run dev`
- [ ] Verifikasi testing: `npm run test`
- [ ] (Opsional) Restore dependencies besar jika diperlukan: `npm run restore:large-deps`

## 🎉 Keuntungan

1. ✅ **Instalasi lebih cepat** - Mengurangi waktu install dari ~2-3 menit menjadi ~1 menit
2. ✅ **Ukuran lebih kecil** - Menghemat ~200 MB disk space
3. ✅ **Deployment lebih cepat** - CI/CD akan lebih cepat
4. ✅ **Menghemat bandwidth** - Mengurangi data yang didownload
5. ✅ **Tetap fungsional** - Semua fitur utama tetap berfungsi

## ⚠️ Troubleshooting

### Jika build gagal
```bash
# Pastikan semua dependencies terinstall
npm run install:minimal
npm run build
```

### Jika test:ui tidak bekerja
```bash
# Restore @vitest/ui
npm run restore:large-deps
npm run test:ui
```

### Jika netlify:dev tidak bekerja
```bash
# Restore netlify-cli
npm run restore:large-deps
npm run netlify:dev
```

## 📚 Dokumentasi Lengkap

Lihat [OPTIMASI_NODE_MODULES.md](./OPTIMASI_NODE_MODULES.md) untuk dokumentasi lengkap.

