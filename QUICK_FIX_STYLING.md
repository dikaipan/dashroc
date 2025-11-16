# ⚡ Quick Fix: Styling Berbeda

## 🎯 Solusi Cepat (5 Menit)

### Step 1: Stop Flask Server
```bash
# Di terminal Flask, tekan Ctrl+C
```

### Step 2: Rebuild Frontend
```bash
cd frontend
npm run clean
npm run build
```

### Step 3: Verify CSS Files
```bash
# Windows PowerShell
.\check-css-build.ps1

# Linux/Mac
chmod +x check-css-build.sh
./check-css-build.sh
```

### Step 4: Start Flask & Test
```bash
cd ..
python app.py
```

### Step 5: Hard Refresh Browser
- Tekan `Ctrl + Shift + R` atau `Ctrl + F5`
- Atau gunakan **Incognito/Private mode**

## 🔍 Diagnosa Cepat

### Check di Browser (F12 → Network Tab):
1. Buka `http://localhost:5000`
2. Tekan `F12` → **Network** tab
3. Filter by **CSS**
4. Refresh page (`F5`)
5. **Check:** Apakah semua CSS files return **200 OK**?

### Jika CSS Return 404:
- ✅ Rebuild frontend (Step 2 di atas)
- ✅ Check apakah file CSS ada di `frontend/dist/assets/`

### Jika CSS Return 200 tapi Styling Masih Salah:
- ✅ Clear browser cache (hard refresh)
- ✅ Check apakah Tailwind classes ter-apply (inspect element)
- ✅ Check theme (dark/light mode) di console: `document.documentElement.classList`

## 📋 Checklist

- [ ] Flask server sudah di-stop sebelum build
- [ ] `npm run build` berhasil tanpa error
- [ ] CSS files ada di `frontend/dist/assets/`
- [ ] `index.html` memiliki link CSS yang benar
- [ ] Browser cache sudah di-clear (hard refresh)
- [ ] Network tab menunjukkan CSS files ter-load (200 OK)

## 🆘 Masih Bermasalah?

Lihat dokumentasi lengkap: **`FIX_STYLING_BERBEDA.md`**

