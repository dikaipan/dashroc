# 📋 Mapping Field CSV untuk SO Time Tracking

## 🎯 Field Names yang Dicari oleh Hook

Hook `useSOTimeTracking` akan mencoba mencari field dengan nama-nama berikut:

---

### 📅 **Tanggal/Date Field**

Hook mencari field untuk tanggal dengan prioritas berikut:
1. `tanggal`
2. `date`
3. `created_date`
4. `assigned_at`
5. `created_at`

**Format yang didukung:**
- `DD/MM/YYYY` (format Indonesia)
- `YYYY-MM-DD` (format ISO)
- Timestamp standar

---

### ⏱️ **Time Tracking Fields**

#### **1. Waktu Assignment**
```
Prioritas pencarian:
- assigned_at
- waktu_assign
- assign_time
- tanggal_assign
```

#### **2. Waktu Mulai Kerja**
```
Prioritas pencarian:
- started_at
- waktu_mulai
- start_time
- tanggal_mulai
```

#### **3. Waktu Selesai**
```
Prioritas pencarian:
- completed_at
- waktu_selesai
- complete_time
- tanggal_selesai
```

#### **4. Waktu Close**
```
Prioritas pencarian:
- closed_at
- waktu_close
- close_time
- tanggal_close
```

---

### 📊 **Status Field**

Hook mencari status dengan prioritas berikut:
1. `status`
2. `status_so`
3. `state`

**Status values yang valid:**
- `completed` / `Completed` / `COMPLETED`
- `closed` / `Closed` / `CLOSED`
- `selesai` / `Selesai` / `SELESAI`
- `done` / `Done` / `DONE`

---

## 🔧 Cara Menggunakan

### **Option 1: Sesuaikan Nama Kolom CSV**

Rename kolom di CSV Anda menjadi salah satu nama yang dicari:

```csv
no,tanggal,status,assigned_at,started_at,completed_at,closed_at,engineer
1,01/11/2024,completed,01/11/2024 08:00,01/11/2024 09:00,01/11/2024 13:00,01/11/2024 14:00,John
```

### **Option 2: Tambahkan Field Names ke Hook**

Edit file `src/hooks/useSOTimeTracking.js`:

```javascript
// Contoh: Jika CSV Anda menggunakan "tgl_mulai" untuk started_at
case 'started':
  value = so.started_at || so.waktu_mulai || so.start_time || so.tgl_mulai; // Tambahkan disini
  break;
```

---

## 🧪 Debugging

### **Check Field Names di Console**

Setelah hard reload (`Ctrl+Shift+R`), lihat console browser:

```
[useSOTimeTracking] Sample SO field names: ['no', 'tanggal', 'status', ...]
[useSOTimeTracking] Sample SO data: {no: 1, tanggal: '01/11/2024', ...}
```

### **Verifikasi Data**

Console akan menampilkan:
1. **Field names** yang tersedia di CSV
2. **Sample data** dari record pertama
3. **Jumlah record** yang diproses
4. **Filtered count** per periode

---

## 📝 Contoh Struktur CSV yang Ideal

### **Format 1: English Fields**
```csv
no,date,status,assigned_at,started_at,completed_at,closed_at,engineer_name,region
1,01/11/2024,completed,01/11/2024 08:00,01/11/2024 09:00,01/11/2024 13:00,01/11/2024 14:00,John Doe,Jakarta
2,02/11/2024,closed,02/11/2024 08:30,02/11/2024 08:45,02/11/2024 11:00,02/11/2024 11:30,Jane Smith,Bandung
```

### **Format 2: Indonesian Fields**
```csv
no,tanggal,status,waktu_assign,waktu_mulai,waktu_selesai,waktu_close,nama_engineer,wilayah
1,01/11/2024,selesai,01/11/2024 08:00,01/11/2024 09:00,01/11/2024 13:00,01/11/2024 14:00,John Doe,Jakarta
2,02/11/2024,done,02/11/2024 08:30,02/11/2024 08:45,02/11/2024 11:00,02/11/2024 11:30,Jane Smith,Bandung
```

### **Format 3: Mixed (akan tetap berfungsi)**
```csv
no,tanggal,status_so,assigned_at,waktu_mulai,completed_at,waktu_close,engineer
1,01/11/2024,completed,01/11/2024 08:00,01/11/2024 09:00,01/11/2024 13:00,01/11/2024 14:00,John
```

---

## ⚠️ Troubleshooting

### **Card menampilkan 0h**

**Penyebab**: Field time tidak ditemukan atau formatnya salah

**Solusi**:
1. Cek console untuk melihat field names yang tersedia
2. Pastikan field names sesuai dengan yang dicari
3. Pastikan format datetime benar (DD/MM/YYYY HH:mm atau YYYY-MM-DD HH:mm:ss)

### **No data available**

**Penyebab**: Tidak ada record dengan status completed/closed/selesai/done

**Solusi**:
1. Periksa kolom status di CSV
2. Pastikan ada minimal 1 record dengan status completed
3. Cek console untuk melihat sample data

### **Filter period tidak berfungsi**

**Penyebab**: Field tanggal tidak ditemukan

**Solusi**:
1. Pastikan ada kolom `tanggal` atau `date` di CSV
2. Format harus DD/MM/YYYY atau YYYY-MM-DD
3. Cek console log untuk error parsing date

---

## 📧 Support

Jika masih ada masalah, kirimkan:
1. Screenshot field names dari console
2. Sample 1-2 baris dari CSV (pastikan tidak ada data sensitif)
3. Error message dari console (jika ada)

Hook akan otomatis detect dan adapt ke struktur CSV Anda! 🎯✨
