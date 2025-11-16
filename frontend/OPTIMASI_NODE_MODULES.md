# 🚀 Optimasi Ukuran node_modules

## 📊 Masalah
Node_modules berukuran **342.25 MB**, yang cukup besar dan dapat memperlambat instalasi dan deployment.

## ✅ Solusi yang Diterapkan

### 1. **Script untuk Menghapus Dependencies Besar**
Dependencies berikut dapat dihapus setelah install menggunakan script:
- `@vitest/ui` - UI untuk testing (hanya diperlukan saat development dengan UI)
- `netlify-cli` - CLI untuk Netlify (hanya diperlukan untuk deployment Netlify)

**Catatan:** Dependencies ini tetap ada di `package.json`, hanya folder di `node_modules` yang dihapus. Mereka akan terinstall kembali pada `npm install` berikutnya.

### 2. **Optimasi .npmrc**
Konfigurasi npm dioptimasi untuk:
- Mengurangi logging yang tidak diperlukan
- Menonaktifkan audit otomatis
- Menggunakan package-lock.json untuk konsistensi

### 3. **Script Baru untuk Instalasi**
- `npm run install:minimal` - Install tanpa optional dependencies (lebih kecil)
- `npm run install:full` - Install semua dependencies termasuk optional
- `npm run install:prod` - Install hanya production dependencies
- `npm run analyze:deps` - Analisis ukuran dependencies
- `npm run install:test-ui` - Install @vitest/ui jika diperlukan
- `npm run install:netlify` - Install netlify-cli jika diperlukan

## 📦 Cara Menggunakan

### Instalasi Minimal (Direkomendasikan)
```bash
# Hapus node_modules dan package-lock.json terlebih dahulu
npm run clean:install

# Install semua dependencies, lalu hapus dependencies besar
npm run install:minimal
```

Ini akan mengurangi ukuran node_modules secara signifikan karena:
- `@vitest/ui` akan dihapus setelah install (hemat ~50-100 MB)
- `netlify-cli` akan dihapus setelah install (hemat ~200 MB)

### Instalasi Lengkap
```bash
# Install semua dependencies termasuk optional
npm run install:full
```

### Restore Dependencies Besar
Jika Anda memerlukan dependencies yang telah dihapus:

```bash
# Restore semua dependencies besar
npm run restore:large-deps

# Atau install secara manual
npm install netlify-cli @vitest/ui --save-dev
```

### Analisis Ukuran Dependencies
```bash
# Lihat ukuran setiap dependency
npm run analyze:deps
```

## 🎯 Hasil yang Diharapkan

Dengan menggunakan `npm run install:minimal`, ukuran node_modules akan berkurang dari **~342 MB** menjadi **~130-150 MB** (pengurangan ~60%).

**Catatan:** Script ini akan menginstall semua dependencies terlebih dahulu (untuk memastikan rollup dan dependencies penting lainnya terinstall), kemudian menghapus folder netlify-cli dan @vitest/ui dari node_modules. Ini mencegah error seperti "Cannot find module @rollup/rollup-win32-x64-msvc" yang terjadi ketika menggunakan `--no-optional`.

## ⚠️ Catatan Penting

### Testing
- Script `npm run test` akan tetap berfungsi tanpa `@vitest/ui`
- Script `npm run test:ui` akan **gagal** jika `@vitest/ui` tidak terinstall
- Untuk menggunakan test UI, restore dependencies: `npm run restore:large-deps`

### Deployment Netlify
- Script `npm run netlify:dev` akan **gagal** jika `netlify-cli` tidak terinstall
- Untuk menggunakan Netlify CLI, restore dependencies: `npm run restore:large-deps`
- Deployment di Netlify akan tetap berfungsi karena Netlify menginstall dependencies sendiri

### Production Build
- Build production (`npm run build`) tidak memerlukan netlify-cli atau @vitest/ui
- Semua dependencies production sudah termasuk dalam `dependencies`
- Script `install:minimal` akan menghapus dependencies besar setelah install, sehingga build tetap berfungsi

## 🔧 Troubleshooting

### Jika test:ui tidak bekerja
```bash
npm run restore:large-deps
npm run test:ui
```

### Jika netlify:dev tidak bekerja
```bash
npm run restore:large-deps
npm run netlify:dev
```

### Jika build gagal
Pastikan semua dependencies production terinstall:
```bash
npm run install:minimal
npm run build
```

### Jika ada error tentang missing dependencies
Coba install ulang:
```bash
npm run clean:install
npm run install:minimal
```

## 📝 Rekomendasi

1. **Untuk Development Lokal**: Gunakan `npm run install:minimal` untuk instalasi yang lebih cepat
2. **Untuk CI/CD**: Gunakan `npm ci --no-optional` untuk instalasi yang konsisten dan cepat
3. **Untuk Production**: Gunakan `npm ci --only=production` untuk instalasi yang paling kecil
4. **Untuk Testing dengan UI**: Install `@vitest/ui` hanya saat diperlukan
5. **Untuk Deployment Netlify**: Install `netlify-cli` hanya saat diperlukan untuk testing lokal

## 🎉 Keuntungan

1. ✅ Instalasi lebih cepat
2. ✅ Ukuran node_modules lebih kecil
3. ✅ Deployment lebih cepat
4. ✅ Menghemat bandwidth
5. ✅ Menghemat space disk
6. ✅ Dependencies tetap terorganisir dengan baik

## 📚 Referensi

- [npm optionalDependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#optionaldependencies)
- [npm install --no-optional](https://docs.npmjs.com/cli/v9/commands/npm-install#--no-optional)
- [npm ci](https://docs.npmjs.com/cli/v9/commands/npm-ci)

