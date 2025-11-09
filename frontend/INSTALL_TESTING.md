# 🧪 Installation Guide untuk Testing

## ⚠️ Dependency Conflict dengan React 19

React 19 masih baru dan beberapa testing libraries belum fully support. Ada dependency conflict antara:
- React 19.1.1 (yang digunakan)
- @testing-library/react@14.1.2 (memerlukan React ^18.0.0)

## ✅ Solusi

### Opsi 1: Gunakan --legacy-peer-deps (Recommended)

```bash
cd frontend
npm install --legacy-peer-deps
```

File `.npmrc` sudah dibuat dengan `legacy-peer-deps=true`, jadi cukup jalankan:
```bash
cd frontend
npm install
```

### Opsi 2: Install dengan force (Alternatif)

```bash
cd frontend
npm install --force
```

### Opsi 3: Update @testing-library/react (Jika tersedia)

Jika versi terbaru @testing-library/react sudah support React 19, update package.json:
```json
"@testing-library/react": "^16.0.0"  // atau versi terbaru
```

## 📝 Verifikasi Installation

Setelah install, verifikasi dengan:

```bash
cd frontend
npm test
```

Jika ada error, coba:
```bash
npm test -- --run
```

## 🔧 Troubleshooting

### Error: Cannot find module '@testing-library/react'
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Error: React version mismatch
Pastikan menggunakan `--legacy-peer-deps` atau file `.npmrc` sudah ada.

### Test tidak jalan
Pastikan semua dependencies terinstall:
```bash
npm install --legacy-peer-deps
npm test
```

## 📚 Referensi

- [React Testing Library - React 19 Support](https://github.com/testing-library/react-testing-library/issues)
- [NPM Legacy Peer Deps](https://docs.npmjs.com/cli/v8/configuring-npm/package-json#peerdependencies)

