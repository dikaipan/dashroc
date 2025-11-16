# 📚 Dokumentasi ROC Dashboard

Dokumentasi lengkap fitur dan cara penggunaan ROC Dashboard dalam format **HTML** yang dapat dikonversi ke **PDF** atau **PowerPoint**.

## 🎨 Fitur Dokumentasi

- ✨ **Design Modern** - Gradient backgrounds, icons, dan styling yang menarik
- 📄 **Format Fleksibel** - HTML, PDF, atau PowerPoint
- 📸 **Screenshot Ready** - Placeholder untuk screenshot yang mudah diganti
- 🎯 **Struktur Lengkap** - Semua fitur didokumentasikan dengan detail

## 📦 File yang Tersedia

1. **PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html** - Dokumentasi lengkap (format HTML)
2. **convert_to_pdf.py** - Script untuk konversi ke PDF
3. **convert_to_powerpoint.py** - Script untuk konversi ke PowerPoint ⭐ NEW
4. **convert_to_pdf.bat** - Batch file untuk Windows (PDF)
5. **convert_to_powerpoint.bat** - Batch file untuk Windows (PowerPoint) ⭐ NEW
6. **CARA_MENGAMBIL_SCREENSHOT.md** - Panduan mengambil screenshot
7. **requirements_docs.txt** - Dependencies untuk konversi

## 🚀 Cara Menggunakan

### Opsi 1: Buka Langsung di Browser (Paling Mudah)

1. Double-click file `PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html`
2. Dokumentasi akan terbuka di browser default
3. Untuk save sebagai PDF: Tekan **Ctrl+P** → Pilih "Save as PDF"

### Opsi 2: Konversi ke PDF

#### Menggunakan Python Script:

```bash
# Install library (jika belum)
pip install weasyprint

# Jalankan script
python convert_to_pdf.py
```

#### Menggunakan Batch File (Windows):

Double-click `convert_to_pdf.bat`

### Opsi 3: Konversi ke PowerPoint ⭐ NEW!

#### Menggunakan Python Script:

```bash
# Install library (jika belum)
pip install python-pptx beautifulsoup4

# Atau install semua sekaligus
pip install -r requirements_docs.txt

# Jalankan script
python convert_to_powerpoint.py
```

#### Menggunakan Batch File (Windows):

Double-click `convert_to_powerpoint.bat`

Script akan otomatis menginstall library yang diperlukan jika belum ada.

## 📋 Instalasi Dependencies

Untuk konversi otomatis, install dependencies berikut:

```bash
pip install -r requirements_docs.txt
```

Atau install manual:

```bash
# Untuk PDF
pip install weasyprint

# Untuk PowerPoint
pip install python-pptx beautifulsoup4
```

## 📸 Menambahkan Screenshot

### ✨ Auto-Load Feature (Recommended)

Dokumentasi HTML memiliki fitur **auto-load** yang otomatis memuat gambar dari folder `screenshots/`:

1. **Ambil Screenshot** - Ikuti panduan di `CARA_MENGAMBIL_SCREENSHOT.md`
2. **Simpan Screenshot** - Simpan di folder `screenshots/` dengan nama yang sesuai
   - Nama file harus sesuai dengan `data-label` di HTML
   - Contoh: `data-label="Dashboard Overview"` → `dashboard-overview.png`
3. **Refresh Browser** - Gambar akan otomatis ter-load!

**Naming Convention:**
- Convert `data-label` ke lowercase dengan hyphen
- Contoh: "Dashboard Overview" → `dashboard-overview.png`
- Sistem akan mencoba ekstensi: `.png`, `.jpg`, `.jpeg`, `.webp`

### Manual Method

Jika auto-load tidak bekerja, edit HTML secara manual:
```html
<!-- Ganti placeholder dengan -->
<img src="screenshots/dashboard-overview.png" alt="Dashboard Overview" 
     style="width: 100%; border: 2px solid #6366f1; border-radius: 12px; margin: 20px 0;" />
```

Lihat file `screenshots/PLACEHOLDER_IMAGES.md` untuk daftar lengkap screenshot yang diperlukan.

## 📑 Struktur Dokumentasi

Dokumentasi mencakup:

### 1. Pengenalan Sistem
- Tentang ROC Dashboard
- Teknologi yang digunakan
- Fitur utama sistem

### 2. Fitur Utama (Detail)
- 📊 **Dashboard** - Overview, KPI, charts, peta interaktif
- 👥 **Engineers Management** - CRUD, filter, export/import
- ⚙️ **Machines Management** - Manajemen mesin, warranty tracking
- 📦 **Stock Parts Management** - Inventory, FSL locations
- 🏗️ **Structure View** - Visualisasi struktur organisasi
- 🎯 **Decision Support** - Analisis dan decision intelligence
- 🧰 **Toolbox** - Tools dan utilities

### 3. Cara Penggunaan
- Akses sistem
- Navigasi menu
- Operasi CRUD
- Filter dan pencarian
- Export data

### 4. Screenshot Tampilan
- Placeholder untuk screenshot setiap halaman

### 5. Tips & Trik
- Best practices
- Troubleshooting

## 🎨 Fitur Design

Dokumentasi menggunakan design modern dengan:

- ✨ **Gradient Backgrounds** - Background gradient yang menarik
- 🎨 **Color Scheme** - Menggunakan warna yang sesuai dengan aplikasi
- 📱 **Responsive** - Tampilan yang baik di berbagai ukuran layar
- 🖼️ **Icons & Emojis** - Icons untuk memudahkan navigasi
- 📄 **Print Ready** - Optimized untuk print/PDF

## 🔧 Troubleshooting

### Error: Library tidak ditemukan
```bash
pip install python-pptx beautifulsoup4 weasyprint
```

### Error: File HTML tidak ditemukan
Pastikan Anda menjalankan script dari folder yang sama dengan file HTML.

### PowerPoint tidak terbuka
Pastikan file `.pptx` tidak sedang dibuka di aplikasi lain.

### Screenshot tidak muncul
Pastikan path ke file screenshot benar dan file ada di folder `screenshots/`.

## 📝 Catatan

- Dokumentasi ini dibuat berdasarkan analisis kode source
- Screenshot perlu diambil secara manual dari aplikasi yang berjalan
- Pastikan aplikasi berjalan dengan baik sebelum mengambil screenshot
- Review dokumentasi dan sesuaikan dengan kebutuhan spesifik jika diperlukan

## 🆕 Update Terbaru

- ✨ Design HTML yang lebih menarik dengan gradient dan styling modern
- 📊 **Support PowerPoint** - Konversi langsung ke format PPTX
- 🎨 Improved visual design dengan icons dan color scheme yang lebih baik
- 📱 Better responsive layout untuk berbagai ukuran layar

## 💡 Tips

1. **Untuk Presentasi**: Gunakan format PowerPoint untuk presentasi langsung
2. **Untuk Dokumentasi**: Gunakan format PDF untuk distribusi dan print
3. **Untuk Web**: Gunakan format HTML untuk akses online
4. **Screenshot**: Ambil screenshot dengan resolusi tinggi (minimal 1920x1080) untuk kualitas terbaik

## 📞 Support

Untuk pertanyaan tentang dokumentasi atau sistem:
- Lihat `README.md` utama untuk informasi teknis
- Lihat `SPEC_SISTEM.md` untuk spesifikasi sistem
- Lihat file markdown lainnya untuk informasi spesifik

---

**Selamat menggunakan dokumentasi ROC Dashboard! 🚀**
