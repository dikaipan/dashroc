# 📋 Struktur CSV File untuk SO Time Tracking

## 📁 File Required: `so_apr_spt.csv`

Lokasi file CSV harus berada di:
- **Backend**: `data/so_apr_spt.csv`
- **Atau**: Sesuai dengan path yang dikonfigurasi di backend API

---

## 📊 Struktur Kolom CSV

### **Kolom Wajib (Required)**

| Column Name    | Type     | Description                          | Example                    |
|----------------|----------|--------------------------------------|----------------------------|
| `id`           | String   | Unique identifier untuk SO           | `SO-2024-001`              |
| `so_number`    | String   | Nomor Service Order                  | `APR/SPT/2024/001`         |
| `status`       | String   | Status SO                            | `completed`, `closed`      |
| `assigned_at`  | DateTime | Waktu SO di-assign ke engineer       | `2024-11-01 08:00:00`      |
| `started_at`   | DateTime | Waktu engineer mulai mengerjakan     | `2024-11-01 09:15:00`      |
| `completed_at` | DateTime | Waktu SO selesai dikerjakan          | `2024-11-01 13:30:00`      |
| `closed_at`    | DateTime | Waktu SO officially closed           | `2024-11-01 14:00:00`      |

### **Kolom Opsional (Optional)**

| Column Name      | Type   | Description                  | Example           |
|------------------|--------|------------------------------|-------------------|
| `engineer_id`    | String | ID engineer yang mengerjakan | `ENG-001`         |
| `engineer_name`  | String | Nama engineer                | `John Doe`        |
| `priority`       | String | Prioritas SO                 | `high`,`medium`   |
| `region`         | String | Region SO                    | `Jakarta`         |
| `area`           | String | Area SO                      | `Senayan`         |
| `customer`       | String | Nama customer                | `Bank ABC`        |
| `created_at`     | DateTime | Waktu SO dibuat            | `2024-11-01 07:00`|

---

## 📝 Contoh Isi CSV

```csv
id,so_number,status,assigned_at,started_at,completed_at,closed_at,engineer_id,engineer_name,priority,region
SO-001,APR/SPT/2024/001,completed,2024-11-01 08:00:00,2024-11-01 09:15:00,2024-11-01 13:30:00,2024-11-01 14:00:00,ENG-001,John Doe,high,Jakarta
SO-002,APR/SPT/2024/002,completed,2024-11-01 08:30:00,2024-11-01 08:45:00,2024-11-01 11:00:00,2024-11-01 11:30:00,ENG-002,Jane Smith,medium,Bandung
SO-003,APR/SPT/2024/003,closed,2024-11-01 09:00:00,2024-11-01 10:00:00,2024-11-01 15:30:00,2024-11-01 16:00:00,ENG-003,Bob Wilson,low,Surabaya
SO-004,APR/SPT/2024/004,in_progress,2024-11-01 10:00:00,2024-11-01 10:30:00,,,ENG-004,Alice Brown,high,Jakarta
```

---

## 🔄 Status Values

| Status        | Description                          |
|---------------|--------------------------------------|
| `pending`     | SO belum di-assign                   |
| `assigned`    | SO sudah di-assign, belum dikerjakan |
| `in_progress` | Sedang dikerjakan                    |
| `completed`   | Sudah selesai, belum di-close        |
| `closed`      | Sudah officially closed              |

---

## ⏱️ Time Calculation

Card menghitung 3 time metrics:

1. **Assignment to Start** = `started_at` - `assigned_at`
2. **Start to Complete** = `completed_at` - `started_at`
3. **Complete to Close** = `closed_at` - `completed_at`

**Total Lifecycle** = `closed_at` - `assigned_at`

---

## 🎯 Data Processing Logic

Hook `useSOTimeTracking` memproses data sebagai berikut:

1. **Filter by Period**: Data difilter berdasarkan periode yang dipilih
2. **Filter Completed**: Hanya SO dengan status `completed` atau `closed` yang dihitung
3. **Calculate Averages**: Menghitung rata-rata untuk setiap time metric
4. **Find Min/Max**: Mencari SO tercepat dan terlambat
5. **Calculate Trend**: Membandingkan dengan periode sebelumnya

---

## 🚨 Validasi Data

Data yang valid harus memenuhi:

- ✅ `assigned_at` < `started_at` < `completed_at` < `closed_at`
- ✅ Semua timestamp dalam format: `YYYY-MM-DD HH:mm:ss`
- ✅ Status harus salah satu dari: pending, assigned, in_progress, completed, closed
- ✅ Untuk perhitungan, SO harus memiliki semua timestamp (kecuali yang in_progress)

---

## 🔌 Backend API Endpoint

Endpoint yang harus menyediakan data:

```
GET /api/so-data
```

Response format:
```json
[
  {
    "id": "SO-001",
    "so_number": "APR/SPT/2024/001",
    "status": "completed",
    "assigned_at": "2024-11-01T08:00:00.000Z",
    "started_at": "2024-11-01T09:15:00.000Z",
    "completed_at": "2024-11-01T13:30:00.000Z",
    "closed_at": "2024-11-01T14:00:00.000Z",
    "engineer_id": "ENG-001",
    "engineer_name": "John Doe",
    "priority": "high",
    "region": "Jakarta"
  },
  ...
]
```

---

## 📦 Deployment Checklist

- [ ] File `so_apr_spt.csv` ada di folder data
- [ ] Backend API endpoint `/api/so-data` berfungsi
- [ ] CSV memiliki semua kolom required
- [ ] Format timestamp konsisten
- [ ] Status values valid
- [ ] Data SO minimal ada 1 bulan untuk trend calculation

---

## 🧪 Testing

### Test dengan Mock Data (Development):

Jika CSV belum tersedia, gunakan data sample:

1. Buat file `data/so_apr_spt.csv`
2. Copy contoh di atas
3. Restart backend server
4. Refresh browser

### Verify Data di Card:

Card akan menampilkan:
- ✅ Total average lifecycle time
- ✅ Breakdown: Assignment→Start, Start→Complete, Complete→Close
- ✅ Fastest & slowest SO
- ✅ Total SO count untuk periode
- ✅ Trend percentage
- ✅ Date range yang aktual

---

## 🐛 Troubleshooting

**Card menampilkan "No SO data available"**
- Cek apakah file CSV ada
- Cek apakah endpoint `/api/so-data` return data
- Cek console untuk error messages

**Time metrics menampilkan 0**
- Pastikan ada SO dengan status `completed` atau `closed`
- Pastikan semua timestamp field terisi
- Cek format timestamp sudah benar

**Trend tidak muncul**
- Perlu data minimal 2 periode (misal: bulan ini + bulan lalu)
- Pastikan `assigned_at` field terisi dengan benar

---

**Ready untuk production dengan data real dari CSV!** 📊✨
