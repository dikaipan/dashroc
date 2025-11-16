# 🔍 Regional SO Distribution - Debug Guide

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
[useRegionalSOData] Sample SO field names: ['no', 'tanggal', 'status', 'region', 'engineer_name', ...]
[useRegionalSOData] Sample SO data: {no: 1, tanggal: '01/11/2024', status: 'completed', region: 'Jakarta', ...}
[useRegionalSOData] Region-related fields found: ['region']
[useRegionalSOData] Date-related fields found: ['tanggal']
[useRegionalSOData] Processing 150 SO records for period: thisMonth
[useRegionalSOData] Filtered to 150 SO records
[useRegionalSOData] Region mapping: {
  searchedFields: ['region', 'wilayah', 'area', 'lokasi'],
  foundField: 'region',
  originalValue: 'Jakarta',
  finalRegion: 'Jakarta'
}
[useRegionalSOData] Region groups created: 5 regions
[useRegionalSOData] Sample region data: [
  {name: 'Jakarta', totalSO: 45, completedSO: 40, pendingSO: 5},
  {name: 'Bandung', totalSO: 32, completedSO: 30, pendingSO: 2},
  {name: 'Surabaya', totalSO: 28, completedSO: 25, pendingSO: 3}
]
[useRegionalSOData] Processed 5 regions
[useRegionalSOData] Top 5 regions: ['Jakarta', 'Bandung', 'Surabaya', 'Semarang', 'Medan']
```

### **Jika Fallback Data Digunakan:**
```
[useRegionalSOData] No SO data received, using fallback test data
[EngineerTrainingKPICards] regionalData: {totalSO: 1250, regionData: [...]}
```

---

## 🔧 **Field Detection:**

### **Region Fields yang Dicari:**
```javascript
// Priority order:
1. 'region'
2. 'wilayah' 
3. 'area'
4. 'lokasi'
5. 'region_name'
```

### **Date Fields yang Dicari:**
```javascript
// Priority order:
1. 'tanggal'
2. 'date'
3. 'created_date'
4. 'assigned_at'
5. 'created_at'
```

### **Status Fields yang Dicari:**
```javascript
// Priority order:
1. 'status'
2. 'status_so'
3. 'state'
```

---

## 🎯 **Troubleshooting:**

### **Problem: "Unknown" Regions**
**Console akan menunjukkan:**
```
[useRegionalSOData] Region mapping: {
  searchedFields: ['region', 'wilayah', 'area', 'lokasi'],
  foundField: null,
  originalValue: null,
  finalRegion: 'Unknown'
}
```

**Solution:**
1. Cek field names dari console
2. Tambahkan field name ke getRegionName function
3. Example: Jika CSV punya 'kota', tambahkan ke search

### **Problem: No Data Filtered**
**Console akan menunjukkan:**
```
[useRegionalSOData] Filtered to 0 SO records
```

**Solution:**
1. Cek date field detection
2. Pastikan format tanggal benar (DD/MM/YYYY)
3. Verify period filter settings

### **Problem: All SO in "Unknown"**
**Console akan menunjukkan:**
```
[useRegionalSOData] Region groups created: 1 regions
[useRegionalSOData] Sample region data: [{name: 'Unknown', totalSO: 150, ...}]
```

**Solution:**
1. Region field tidak ditemukan
2. Cek console untuk field names yang tersedia
3. Update field mapping

---

## 📋 **Quick Fix Templates:**

### **Add New Region Field:**
```javascript
// Di getRegionName function, tambahkan:
const regionField = Object.keys(so).find(key => 
  key.toLowerCase().includes('region') || 
  key.toLowerCase().includes('wilayah') || 
  key.toLowerCase().includes('area') ||
  key.toLowerCase().includes('lokasi') ||
  key.toLowerCase().includes('kota') || // Tambahkan ini
  key.toLowerCase().includes('city')    // Tambahkan ini
);
```

### **Add New Date Field:**
```javascript
// Di getSODate function, tambahkan:
const dateStr = so.tanggal || so.date || so.created_date || 
               so.assigned_at || so.created_at || so.tgl_so; // Tambahkan ini
```

---

## 🎯 **Expected Results:**

### **Card akan menampilkan:**
```
📍 Regional SO Distribution
              [Real Total]
      Total Service Orders

📅 [Date Range]

🥇 1 [Top Region]    [Count] ([%])
🥈 2 [2nd Region]    [Count] ([%])
🥉 3 [3rd Region]    [Count] ([%])
4   [4th Region]     [Count] ([%])

✅ Avg Completion: [%]      📍 Active Regions: [N]

[Distribution Bar dengan real data]
```

---

## 📞 **Need Help?**

**Bagikan console output jika:**
- Data tidak tampil
- Regions menampilkan "Unknown"
- Period filter tidak berfungsi
- Error message muncul

**Saya akan adjust field mapping berdasarkan CSV structure Anda!** 🔧✨
