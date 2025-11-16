# 🔧 Fix untuk Error __vite_ssr_exportName__

## ⚠️ Masalah
Error `__vite_ssr_exportName__ is not defined` terjadi karena `rolldown-vite` mengaktifkan SSR transformation secara default saat testing dengan Vitest. Error ini muncul di semua test files yang mengimpor module.

## 🔍 Root Cause
`rolldown-vite` (yang digunakan sebagai replacement untuk Vite) memiliki SSR transformation yang diaktifkan oleh default. Saat Vitest mencoba menjalankan tests, transformasi SSR ini menghasilkan kode yang menggunakan `__vite_ssr_exportName__` yang tidak didefinisikan di environment testing (jsdom).

## ✅ Solusi yang Sudah Dicoba

### 1. Konfigurasi Vitest dengan `ssr: false`
- ✅ Ditambahkan `ssr: false` di `vitest.config.js`
- ✅ Ditambahkan `define` untuk menonaktifkan SSR environment variables
- ❌ Masih error karena transformasi SSR terjadi sebelum konfigurasi diterapkan

### 2. Environment Variables
- ✅ Ditambahkan `cross-env NODE_ENV=test VITE_SSR=false` di test scripts
- ❌ Tidak cukup untuk menonaktifkan SSR transformation di rolldown-vite

### 3. Konfigurasi Build
- ✅ Ditambahkan `build: { ssr: false }` di vitest.config.js
- ❌ Tidak berpengaruh pada transformasi yang terjadi saat testing

## 🚀 Solusi yang Direkomendasikan

### Option 1: Gunakan Standard Vite untuk Testing (BEST SOLUTION)

**Langkah 1:** Install standard Vite sebagai dev dependency dengan nama berbeda:
```bash
cd frontend
npm install vite-standard@npm:vite@5.4.11 --save-dev --legacy-peer-deps
```

**Langkah 2:** Update `vitest.config.js` untuk menggunakan standard Vite:
```javascript
// Import dari standard Vite, bukan rolldown-vite
import { defineConfig } from 'vitest/config';
// ... rest of config
```

**Langkah 3:** Buat alias di `vitest.config.js`:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    // Force Vitest to use standard Vite
    'vite': path.resolve(__dirname, './node_modules/vite-standard'),
  },
}
```

### Option 2: Patch rolldown-vite

**Langkah 1:** Install `patch-package`:
```bash
npm install --save-dev patch-package postinstall-postinstall
```

**Langkah 2:** Buat patch untuk menonaktifkan SSR di rolldown-vite:
```bash
# Edit node_modules/rolldown-vite untuk disable SSR
# Kemudian buat patch
npx patch-package rolldown-vite
```

**Langkah 3:** Tambahkan script di `package.json`:
```json
{
  "scripts": {
    "postinstall": "patch-package"
  }
}
```

### Option 3: Tunggu Update rolldown-vite

- Monitor issue di GitHub: https://github.com/rolldown/rolldown
- Atau gunakan standard Vite untuk development dan testing, rolldown-vite hanya untuk production build

### Option 4: Workaround Sementara - Skip Tests dengan SSR

Sementara menunggu solusi permanen, Anda bisa:
1. Menjalankan tests hanya untuk utility functions yang tidak menggunakan React
2. Atau menggunakan testing framework lain (Jest) yang lebih kompatibel dengan rolldown-vite

## 📝 Status Saat Ini

- ✅ Konfigurasi Vitest sudah dibuat
- ✅ Setup file untuk testing sudah dibuat
- ✅ Test files sudah dibuat (textUtils.test.js, CustomAlert.test.jsx)
- ✅ Environment variables sudah ditambahkan
- ✅ cross-env sudah diinstall
- ⚠️ **Masih ada error `__vite_ssr_exportName__`** karena rolldown-vite
- 🔄 **Perlu implementasi salah satu solusi di atas**

## 🎯 Next Steps

1. **Implementasi Option 1** (Recommended): Install standard Vite dan konfigurasi Vitest untuk menggunakannya
2. **Atau implementasi Option 2**: Buat patch untuk rolldown-vite
3. **Atau tunggu update**: Monitor issue di GitHub rolldown-vite

## 📚 Referensi

- [Vitest Configuration](https://vitest.dev/config/)
- [rolldown-vite GitHub](https://github.com/rolldown/rolldown)
- [Vite SSR Guide](https://vitejs.dev/guide/ssr.html)
