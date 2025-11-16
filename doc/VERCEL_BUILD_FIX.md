# 🔧 Fix Vercel Build Error - rolldown-vite Issue

## ⚠️ Masalah

Build di Vercel gagal dengan error:
```
Could not resolve "./chunk-JG3XND5A.mjs" from "node_modules/react-router/dist/development/index.mjs"
```

Error ini terjadi karena `package-lock.json` masih mengandung referensi ke `rolldown-vite@7.1.14`, meskipun `package.json` sudah diupdate untuk menggunakan Vite standar (`vite@^5.4.21`).

## ✅ Solusi yang Diterapkan

### 1. Update `package.json`
- ✅ Mengganti `"vite": "npm:rolldown-vite@7.1.14"` menjadi `"vite": "^5.4.21"`
- ✅ Menghapus `"vite-standard"` dependency (tidak diperlukan)
- ✅ Menghapus override untuk vite di `overrides`

### 2. Update `vercel.json`
- ✅ Menambahkan command untuk menghapus `package-lock.json` sebelum `npm install`
- ✅ Memastikan npm install berdasarkan `package.json` (bukan lock file)

### 3. Update `.gitignore`
- ✅ Menambahkan `frontend/package-lock.json` ke `.gitignore`
- ✅ Mencegah lock file yang lama di-commit ke git

## 📋 Langkah untuk Deploy

### 1. Hapus package-lock.json dari Git (jika sudah di-commit)

```bash
# Hapus dari git tracking (tidak menghapus file lokal)
git rm --cached frontend/package-lock.json

# Commit perubahan
git add .gitignore vercel.json frontend/package.json
git commit -m "Fix: Remove package-lock.json and migrate to standard Vite"
git push
```

### 2. Vercel akan Otomatis:
- Menghapus `package-lock.json` sebelum install (dari installCommand)
- Menjalankan `npm install` berdasarkan `package.json` yang baru
- Menginstall Vite standar (`vite@^5.4.21`)
- Build dengan Vite standar (kompatibel dengan react-router)

## 🔍 Verifikasi

Setelah deploy, pastikan:
1. ✅ Build berhasil tanpa error
2. ✅ Tidak ada error module resolution
3. ✅ react-router dapat di-resolve dengan benar
4. ✅ Aplikasi berfungsi normal

## 🚨 Jika Masih Gagal

### Opsi 1: Clear Vercel Build Cache
1. Buka Vercel Dashboard
2. Project Settings → General
3. Clear Build Cache
4. Redeploy

### Opsi 2: Force Fresh Install
Update `vercel.json` installCommand menjadi:
```json
"installCommand": "cd frontend && rm -rf node_modules package-lock.json && npm install --no-package-lock"
```

### Opsi 3: Hapus package-lock.json dari Repository
Jika `package-lock.json` masih di-commit:
```bash
git rm frontend/package-lock.json
git commit -m "Remove package-lock.json"
git push
```

## 📝 Catatan

- `package-lock.json` sekarang di-ignore oleh git (lihat `.gitignore`)
- Vercel akan selalu membuat lock file baru berdasarkan `package.json` saat build
- Ini memastikan konsistensi antara `package.json` dan dependencies yang terinstall

## 🎯 Expected Result

Setelah fix ini:
- ✅ Build akan menggunakan Vite standar (bukan rolldown-vite)
- ✅ react-router dapat di-resolve dengan benar
- ✅ Tidak ada error module resolution
- ✅ Build berhasil di Vercel

