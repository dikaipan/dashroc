# 🔍 CSV Data Analysis Guide

## 🚀 **Test Sekarang:**

### **Step 1: Hard Reload**
```
Ctrl + Shift + R
```

### **Step 2: Buka Console (F12)**
Lihat output debug berikut:

---

## 📊 **Expected Console Output:**

### **Jika Real Data Tersedia:**
```
[useRegionalSOData] ============================================
[useRegionalSOData] CSV DATA ANALYSIS:
[useRegionalSOData] Total records: 150
[useRegionalSOData] ALL field names: ['no', 'tanggal', 'status', 'nama_customer', 'alamat', 'kota', 'propinsi', 'engineer_name']
[useRegionalSOData] Sample SO data: {
  no: 1,
  tanggal: '01/11/2024',
  status: 'completed',
  nama_customer: 'Bank ABC',
  alamat: 'Jl. Sudirman No. 123',
  kota: 'Jakarta',
  propinsi: 'DKI Jakarta',
  engineer_name: 'John Doe'
}
[useRegionalSOData] Sample SO data (2nd): {
  no: 2,
  tanggal: '01/11/2024',
  status: 'pending',
  nama_customer: 'Telkom',
  alamat: 'Jl. Gatot Subroto',
  kota: 'Bandung',
  propinsi: 'Jawa Barat',
  engineer_name: 'Jane Smith'
}
[useRegionalSOData] Region-related fields found: ['kota', 'propinsi']
[useRegionalSOData] Date-related fields found: ['tanggal']
[useRegionalSOData] Status-related fields found: ['status']
[useRegionalSOData] Unique regions in kota: ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Medan']
[useRegionalSOData] ============================================
[useRegionalSOData] Region mapping #1: {
  allFields: ['no', 'tanggal', 'status', 'nama_customer', 'alamat', 'kota', 'propinsi', 'engineer_name'],
  searchedPatterns: ['region', 'wilayah', 'area', 'lokasi', 'kota', 'city', 'cabang', 'branch'],
  foundField: 'kota',
  originalValue: 'Jakarta',
  finalRegion: 'Jakarta'
}
[useRegionalSOData] Region mapping #2: {
  allFields: ['no', 'tanggal', 'status', 'nama_customer', 'alamat', 'kota', 'propinsi', 'engineer_name'],
  searchedPatterns: ['region', 'wilayah', 'area', 'lokasi', 'kota', 'city', 'cabang', 'branch'],
  foundField: 'kota',
  originalValue: 'Bandung',
  finalRegion: 'Bandung'
}
[useRegionalSOData] Filtered to 150 SO records
[useRegionalSOData] Region groups created: 5 regions
[useRegionalSOData] Sample region data: [
  {name: 'Jakarta', totalSO: 45, completedSO: 40, pendingSO: 5},
  {name: 'Bandung', totalSO: 32, completedSO: 30, pendingSO: 2},
  {name: 'Surabaya', totalSO: 28, completedSO: 25, pendingSO: 3}
]
[useRegionalSOData] Processed 5 regions
[useRegionalSOData] Top 5 regions: ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Medan']
```

---

## 🎯 **Analisis Field CSV:**

### **Cari Informasi Penting:**

#### **1. Field untuk Region:**
```javascript
// Akan otomatis detect salah satu dari:
- 'region' atau 'Region'
- 'wilayah' atau 'Wilayah'  
- 'area' atau 'Area'
- 'lokasi' atau 'Lokasi'
- 'kota' atau 'Kota' ⭐ (Most likely)
- 'city' atau 'City'
- 'cabang' atau 'Cabang'
- 'branch' atau 'Branch'
```

#### **2. Field untuk Tanggal:**
```javascript
// Akan otomatis detect salah satu dari:
- 'tanggal' atau 'Tanggal' ⭐ (Most likely)
- 'date' atau 'Date'
- 'created_date' atau 'Created Date'
- 'assigned_at' atau 'Assigned At'
- 'created_at' atau 'Created At'
```

#### **3. Field untuk Status:**
```javascript
// Akan otomatis detect salah satu dari:
- 'status' atau 'Status' ⭐ (Most likely)
- 'status_so' atau 'Status SO'
- 'state' atau 'State'
```

---

## 🔧 **Quick Fix Templates:**

### **Jika Field Tidak Terdeteksi:**

#### **Contoh 1: Field 'kota' tidak ditemukan**
```javascript
// Di getRegionName function, tambahkan:
const regionField = Object.keys(so).find(key => 
  key.toLowerCase().includes('region') || 
  key.toLowerCase().includes('wilayah') || 
  key.toLowerCase().includes('area') ||
  key.toLowerCase().includes('lokasi') ||
  key.toLowerCase().includes('kota') || // Sudah ada
  key.toLowerCase().includes('city') ||
  key.toLowerCase().includes('daerah') || // Tambahkan ini
  key.toLowerCase().includes('zone')     // Tambahkan ini
);
```

#### **Contoh 2: Field 'tgl_so' tidak ditemukan**
```javascript
// Di getSODate function, tambahkan:
const dateStr = so.tanggal || so.date || so.created_date || 
               so.assigned_at || so.created_at || so.tgl_so; // Tambahkan ini
```

---

## 📋 **What to Look For:**

### **1. Field Names yang Sebenarnya:**
```
[useRegionalSOData] ALL field names: ['no', 'tanggal', 'status', 'nama_customer', 'alamat', 'kota', 'propinsi', 'engineer_name']
```
→ **Cari yang mirip dengan region/wilayah/area**

### **2. Sample Data Values:**
```
[useRegionalSOData] Sample SO data: {
  no: 1,
  tanggal: '01/11/2024',
  status: 'completed',
  kota: 'Jakarta',      ← Ini nilai region!
  propinsi: 'DKI Jakarta' ← Ini juga bisa region!
}
```

### **3. Unique Region Values:**
```
[useRegionalSOData] Unique regions in kota: ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Medan']
```
→ **Ini adalah data region yang akan ditampilkan**

---

## 🎯 **Expected Results:**

### **Jika CSV memiliki field 'kota':**
```
📍 Regional SO Distribution
              150
      Total Service Orders

📅 SO Period          150
   1 Nov 2024 - 15 Nov 2024   Total SO

🥇 1 Jakarta        45 (30.0%)
🥈 2 Bandung        32 (21.3%)
🥉 3 Surabaya       28 (18.7%)
4   Semarang        25 (16.7%)
5   Medan           20 (13.3%)
```

---

## 📞 **Next Steps:**

### **1. Hard Reload & Check Console**
- Lihat "ALL field names" dari CSV Anda
- Identifikasi field yang mengandung data region

### **2. Share Console Output**
- Copy paste "CSV DATA ANALYSIS" section
- Saya akan adjust field mapping berdasarkan data Anda

### **3. Automatic Detection**
- Hook akan otomatis detect field yang sesuai
- Jika tidak berhasil, saya akan manual adjust

---

**Hard reload sekarang dan bagikan console output untuk analisis CSV structure!** 🔍✨
