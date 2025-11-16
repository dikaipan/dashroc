# 🗺️ Regional SO Distribution Card

## 📊 Overview
Regional SO Distribution Card menampilkan distribusi Service Order berdasarkan region/wilayah dengan data real dari CSV.

---

## 🎯 **Features**

### **1. Total SO Count**
- Menampilkan total SO untuk periode yang dipilih
- Real-time update berdasarkan filter periode

### **2. Top Regions Ranking**
- Top 5 regions dengan SO terbanyak
- Ranking badges (🥇🥈🥉)
- Persentase distribusi per region

### **3. Performance Metrics**
- **Average Completion Rate**: Rata-rata % completion rate semua regions
- **Active Regions**: Jumlah regions yang memiliki SO

### **4. Visual Distribution**
- Horizontal bar chart untuk visualisasi distribusi
- Color-coded ranking system
- Hover tooltips untuk detail

### **5. Period Filter**
- Today, This Week, This Month, Last Month, Last 3 Months
- Dynamic date range display
- Auto-refresh data saat periode berubah

---

## 📋 **Data Structure yang Dibutuhkan**

### **Required Fields:**
```javascript
// Field untuk region (akan detect otomatis)
region || wilayah || area || lokasi || region_name

// Field untuk tanggal (untuk period filter)
tanggal || date || created_date || assigned_at

// Field untuk status (untuk completion rate)
status || status_so || state
```

### **Output Data Structure:**
```javascript
{
  totalSO: 1250,                    // Total SO dalam periode
  regionData: [                     // Array semua regions
    {
      name: "Jakarta",              // Nama region
      totalSO: 450,                 // Jumlah SO
      completedSO: 380,             // SO selesai
      pendingSO: 70,                // SO pending
      percentage: "36.0",           // % dari total
      completionRate: "84.4"        // % completion rate
    },
    // ... more regions
  ],
  topRegions: [...],                // Top 5 regions
  periodStart: "2024-11-01T00:00:00.000Z",
  periodEnd: "2024-11-15T23:59:59.999Z"
}
```

---

## 🎨 **Visual Components**

### **Header Section:**
```
📍 Regional SO Distribution    🔍
              1250
      Total Service Orders

📅 1 Nov - 15 Nov 2024    [This Month ▼]
```

### **Top Regions List:**
```
🥇 1 Jakarta        450 (36.0%)
🥈 2 Bandung        320 (25.6%)
🥉 3 Surabaya       280 (22.4%)
4   Semarang        120 (9.6%)
```

### **Performance Metrics:**
```
✅ Avg Completion: 82%      📍 Active Regions: 12
```

### **Distribution Bar:**
```
███████████████████████████████████████ Jakarta (36%)
███████████████████████████ Bandung (26%)
█████████████████████████ Surabaya (22%)
███████ Semarang (10%)
```

---

## 🔧 **Implementation Details**

### **Hook: `useRegionalSOData`**
```javascript
const { data: regionalData, loading, error } = useRegionalSOData('thisMonth');
```

### **Component: `RegionalSODistributionCard`**
```jsx
<RegionalSODistributionCard 
  regionalData={regionalData}
  setInsightModal={setInsightModal}
  onPeriodChange={handlePeriodChange}
/>
```

### **Auto Field Detection:**
Hook akan otomatis mencari field dengan nama:
- **Region**: `region`, `wilayah`, `area`, `lokasi`, `region_name`
- **Tanggal**: `tanggal`, `date`, `created_date`, `assigned_at`
- **Status**: `status`, `status_so`, `state`

---

## 📈 **Data Processing Logic**

### **1. Period Filtering**
```javascript
// Filter berdasarkan tanggal
switch(period) {
  case 'thisMonth':
    filteredData = data.filter(so => {
      const date = getSODate(so);
      return date && date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear();
    });
    break;
  // ... other periods
}
```

### **2. Region Grouping**
```javascript
const regionGroups = data.reduce((acc, so) => {
  const region = getRegionName(so);
  if (!acc[region]) {
    acc[region] = { totalSO: 0, completedSO: 0, pendingSO: 0 };
  }
  acc[region].totalSO++;
  // Count by status...
  return acc;
}, {});
```

### **3. Percentage Calculation**
```javascript
regionData = Object.values(regionGroups).map(region => ({
  ...region,
  percentage: (region.totalSO / totalSO * 100).toFixed(1),
  completionRate: (region.completedSO / region.totalSO * 100).toFixed(1)
}));
```

---

## 🎯 **Use Cases**

### **1. Operations Monitoring**
- Identifikasi regions dengan workload tinggi
- Monitor distribusi SO secara real-time
- Tracking performance per region

### **2. Resource Planning**
- Allocate resources berdasarkan volume SO
- Identify regions yang perlu additional support
- Planning capacity expansion

### **3. Performance Analysis**
- Compare completion rate antar regions
- Identify best performing regions
- Find regions yang perlu improvement

---

## 🚨 **Troubleshooting**

### **Card menampilkan "No Regional data available"**
- Cek apakah CSV memiliki region field
- Console log akan menampilkan field names yang tersedia
- Pastikan ada data SO dalam periode yang dipilih

### **Region menampilkan "Unknown"**
- Hook tidak menemukan field region yang valid
- Cek console untuk field names yang terdeteksi
- Update field mapping di hook jika perlu

### **Persentase tidak akurat**
- Pastikan total SO > 0
- Cek apakah data terfilter dengan benar
- Verify period filter settings

---

## 🔄 **Future Enhancements**

### **Potential Additions:**
1. **Map Visualization**: Pin markers di peta Indonesia
2. **Trend Analysis**: Perubahan distribusi over time
3. **Drill-down**: Click region untuk detail SO
4. **Comparison**: Bandingkan periode berbeda
5. **Alerts**: Notifikasi untuk abnormal distribution

### **Advanced Analytics:**
- Regional performance trends
- Correlation dengan engineer availability
- Predictive distribution modeling
- Seasonal pattern analysis

---

## 📊 **Sample CSV Structure**

### **Minimal Required:**
```csv
no,tanggal,status,region
1,01/11/2024,completed,Jakarta
2,01/11/2024,pending,Bandung
3,02/11/2024,completed,Jakarta
```

### **Complete Example:**
```csv
no,tanggal,status,region,engineer_name,customer
1,01/11/2024,completed,Jakarta,John Doe,Bank ABC
2,01/11/2024,in_progress,Bandung,Jane Smith,Telkom
3,02/11/2024,completed,Jakarta,Bob Wilson,Bank BCA
4,02/11/2024,closed,Surabaya,Alice Brown,Bank Mandiri
```

---

**Regional SO Distribution Card siap digunakan!** 🗺️✨

**Data real dari CSV akan otomatis terdeteksi dan ditampilkan!**
