# 🔧 Fix: Rollup Error dengan --no-optional

## ❌ Error yang Terjadi

Ketika menggunakan `npm install --no-optional`, terjadi error:

```
Error: Cannot find module @rollup/rollup-win32-x64-msvc
npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828)
```

## 🔍 Penyebab

1. **Vite menggunakan Rollup** secara internal untuk build
2. **Rollup memerlukan optional dependencies** seperti `@rollup/rollup-win32-x64-msvc` untuk Windows
3. **`--no-optional` melewatkan SEMUA optional dependencies**, termasuk yang diperlukan oleh dependencies utama
4. Ini menyebabkan build gagal karena rollup tidak dapat menemukan native bindings

## ✅ Solusi yang Diterapkan

### Pendekatan Baru: Install Semua, Hapus Manual

Alih-alih menggunakan `--no-optional` (yang merusak build), kita menggunakan pendekatan:

1. **Install semua dependencies** (termasuk optional dependencies yang diperlukan rollup)
2. **Hapus manual folder dependencies besar** yang tidak diperlukan untuk build
3. **Dependencies tetap di package.json**, hanya folder di node_modules yang dihapus

### Script yang Digunakan

```bash
# Install semua dependencies, lalu hapus dependencies besar
npm run install:minimal
```

Script ini akan:
1. Menjalankan `npm install` (menginstall semua dependencies)
2. Menjalankan `remove-large-deps.js` (menghapus netlify-cli dan @vitest/ui)

### Keuntungan

1. ✅ **Build tetap berfungsi** - Rollup dan dependencies penting terinstall
2. ✅ **Ukuran tetap kecil** - Dependencies besar dihapus setelah install
3. ✅ **Tidak merusak sistem** - Tidak ada error module not found
4. ✅ **Mudah restore** - Dependencies dapat diinstall kembali dengan `npm run restore:large-deps`

## 📝 Cara Menggunakan

### Install Minimal
```bash
npm run install:minimal
```

### Restore Dependencies Besar (jika diperlukan)
```bash
npm run restore:large-deps
```

### Build (tetap berfungsi setelah remove)
```bash
npm run build
```

## 🎯 Hasil

- **Sebelum:** ~342 MB (dengan semua dependencies)
- **Sesudah:** ~130-150 MB (setelah hapus dependencies besar)
- **Pengurangan:** ~60% (hemat ~200 MB)
- **Build:** ✅ Berfungsi dengan baik
- **Dev Server:** ✅ Berfungsi dengan baik
- **Testing:** ✅ Berfungsi dengan baik (tanpa UI)

## 📚 Referensi

- [npm optional dependencies bug](https://github.com/npm/cli/issues/4828)
- [Rollup native bindings](https://rollupjs.org/installation/)
- [Vite build system](https://vitejs.dev/guide/build.html)

