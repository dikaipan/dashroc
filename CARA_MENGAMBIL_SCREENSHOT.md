# Cara Mengambil Screenshot untuk Dokumentasi

## Metode 1: Menggunakan Browser Developer Tools (Recommended)

### Chrome/Edge:
1. Buka aplikasi ROC Dashboard di browser
2. Tekan **F12** untuk membuka Developer Tools
3. Tekan **Ctrl+Shift+P** (Windows) atau **Cmd+Shift+P** (Mac)
4. Ketik "screenshot" dan pilih:
   - **Capture full size screenshot** - untuk screenshot seluruh halaman
   - **Capture node screenshot** - untuk screenshot elemen tertentu
5. Screenshot akan otomatis terunduh

### Firefox:
1. Tekan **F12** untuk membuka Developer Tools
2. Klik icon **Settings** (⚙️) di toolbar
3. Aktifkan "Take a screenshot of the entire page"
4. Klik icon screenshot di toolbar
5. Screenshot akan terunduh

## Metode 2: Menggunakan Snipping Tool (Windows)

1. Tekan **Windows + Shift + S**
2. Pilih area yang ingin di-screenshot
3. Screenshot akan tersalin ke clipboard
4. Paste ke aplikasi image editor (Paint, Photoshop, dll)
5. Save sebagai PNG atau JPG

## Metode 3: Menggunakan Print Screen

1. Tekan **Print Screen** (PrtScn) untuk screenshot seluruh layar
2. Atau **Alt + Print Screen** untuk screenshot window aktif
3. Paste ke Paint atau aplikasi image editor
4. Crop dan save

## Metode 4: Menggunakan Aplikasi Screenshot

### Windows:
- **Snipping Tool** (built-in)
- **Snagit** (premium)
- **Greenshot** (free, open source)
- **ShareX** (free, open source)

### Mac:
- **Cmd + Shift + 3** - Screenshot seluruh layar
- **Cmd + Shift + 4** - Screenshot area tertentu
- **Cmd + Shift + 4 + Space** - Screenshot window tertentu

### Linux:
- **GNOME Screenshot** (built-in)
- **Flameshot** (recommended)
- **Shutter**

## Screenshot yang Diperlukan

Berdasarkan dokumentasi, screenshot berikut diperlukan:

### 1. Dashboard
- [ ] Dashboard Overview dengan KPI Cards
- [ ] Peta Interaktif
- [ ] Charts & Analytics
- [ ] Filter dan Search

### 2. Engineers Management
- [ ] Tabel Data Engineers
- [ ] Form Tambah/Edit Engineer
- [ ] Filter & Search
- [ ] Export Function

### 3. Machines Management
- [ ] Tabel Data Machines
- [ ] Warranty Analytics
- [ ] Form Tambah/Edit Machine
- [ ] Machine Filters

### 4. Stock Parts Management
- [ ] Inventory View
- [ ] FSL Map
- [ ] Stock Alerts
- [ ] Stock Analytics

### 5. Structure View
- [ ] Organizational Chart
- [ ] TA Account View
- [ ] FSM Cards

### 6. Decision Support
- [ ] Analysis Cards
- [ ] Comparison Charts
- [ ] Decision Modal

### 7. Toolbox
- [ ] Inventory Tools Tab
- [ ] Baby Part Tools Tab

### 8. Navigasi
- [ ] Sidebar Menu
- [ ] Login Page (jika ada)

## Tips Screenshot yang Baik

1. **Ukuran Layar**: Gunakan resolusi minimal 1920x1080 untuk kualitas baik
2. **Mode Fullscreen**: Buka browser dalam mode fullscreen untuk hasil maksimal
3. **Hapus Data Sensitif**: Pastikan tidak ada data sensitif dalam screenshot
4. **Konsistensi**: Gunakan ukuran window yang sama untuk semua screenshot
5. **Format**: Simpan sebagai PNG untuk kualitas terbaik, atau JPG untuk ukuran lebih kecil
6. **Naming**: Beri nama file yang jelas, contoh: `dashboard-overview.png`

## Cara Menambahkan Screenshot ke Dokumentasi HTML

### Metode 1: Auto-Load (Recommended) ✨

Dokumentasi HTML memiliki fitur **auto-load** yang otomatis memuat gambar jika file ada di folder `screenshots/`:

1. **Simpan screenshot** di folder `screenshots/` dengan nama yang sesuai
   - Contoh: `dashboard-overview.png`
   - Nama harus sesuai dengan `data-label` di HTML (dikonversi ke lowercase dengan hyphen)

2. **Refresh browser** - Gambar akan otomatis ter-load!

**Naming Convention:**
- `data-label="Dashboard Overview"` → `dashboard-overview.png`
- `data-label="Engineers Management"` → `engineers-management.png`
- Sistem akan mencoba ekstensi: `.png`, `.jpg`, `.jpeg`, `.webp`

### Metode 2: Manual (Jika Auto-Load Tidak Bekerja)

Jika auto-load tidak bekerja, edit file HTML secara manual:

1. Simpan screenshot di folder `screenshots/`
2. Edit file `PANDUAN_PENGGUNAAN_ROC_DASHBOARD.html`
3. Ganti placeholder dengan tag `<img>`:

```html
<!-- Sebelum -->
<div class="screenshot-placeholder" data-label="Dashboard Overview"></div>

<!-- Sesudah -->
<img src="screenshots/dashboard-overview.png" alt="Dashboard Overview" 
     style="width: 100%; border: 2px solid #6366f1; border-radius: 12px; margin: 20px 0;" />
```

4. Pastikan path ke file screenshot benar
5. Refresh browser untuk melihat perubahan

## Alternatif: Menggunakan Base64 Encoding

Jika ingin embed screenshot langsung di HTML:

1. Convert gambar ke base64 (gunakan tool online atau Python)
2. Ganti dengan:

```html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." 
     alt="Dashboard Overview" style="width: 100%;" />
```

**Catatan**: Base64 akan membuat file HTML lebih besar, tapi lebih portabel.

