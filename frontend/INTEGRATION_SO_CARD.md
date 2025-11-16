# 🎯 SO Time Tracking Card - Integration Guide

## ✅ File yang Sudah Dibuat

1. **`src/components/charts/kpi/SOTimeTrackingCard.jsx`** - Main component
2. **`src/components/charts/kpi/SOTimeTrackingCard.example.js`** - Example data structure

---

## 📋 Cara Integrasi ke Engineer Page

### **Step 1: Import Component**

Edit file: `src/components/charts/EngineerTrainingKPICards.jsx`

```jsx
// Tambahkan import
import SOTimeTrackingCard from './kpi/SOTimeTrackingCard';
```

### **Step 2: Add Card to Grid**

Tambahkan card ke dalam grid (pilih salah satu layout):

#### **Option A: Grid 4 Kolom (Recommended)**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-fr">
  {/* Existing cards */}
  <div className="flex justify-center">
    <TotalEngineersCard {...} />
  </div>
  <div className="flex justify-center">
    <AvgResolutionCard {...} />
  </div>
  <div className="flex justify-center">
    <OverallRateCard {...} />
  </div>
  
  {/* NEW: SO Time Tracking Card */}
  <div className="flex justify-center">
    <SOTimeTrackingCard 
      soTimeData={soTimeData}
      setInsightModal={setInsightModal}
    />
  </div>
</div>
```

#### **Option B: Separate Row**
```jsx
{/* Existing 3 KPI cards */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <TotalEngineersCard {...} />
  <AvgResolutionCard {...} />
  <OverallRateCard {...} />
</div>

{/* NEW: SO Time Tracking Card (full width or separate section) */}
<div className="mt-6">
  <SOTimeTrackingCard 
    soTimeData={soTimeData}
    setInsightModal={setInsightModal}
  />
</div>
```

---

## 🔌 API Integration

### **Step 3: Fetch SO Time Data**

Edit file: `src/pages/Engineers.jsx` atau parent component

```jsx
import { useState, useEffect } from 'react';

const Engineers = () => {
  const [soTimeData, setSOTimeData] = useState(null);
  
  useEffect(() => {
    // Fetch SO time tracking data
    const fetchSOTimeData = async () => {
      try {
        const response = await fetch('/api/engineers/so-time-tracking');
        const data = await response.json();
        
        setSOTimeData({
          assignmentToStart: data.avgAssignmentToStart,
          startToComplete: data.avgStartToComplete,
          completeToClose: data.avgCompleteToClose,
          targetTime: 8,
          fastestThisWeek: data.fastestResolution,
          slowest: data.slowestResolution,
          totalSOThisMonth: data.totalThisMonth,
          monthlyTrend: data.trend?.change || 0
        });
      } catch (error) {
        console.error('Error fetching SO time data:', error);
      }
    };
    
    fetchSOTimeData();
  }, []);
  
  return (
    // ... pass soTimeData to EngineerTrainingKPICards
  );
};
```

---

## 🗄️ Backend API Endpoint (Example)

### **Create endpoint: `/api/engineers/so-time-tracking`**

```javascript
// backend/routes/engineers.js
router.get('/so-time-tracking', async (req, res) => {
  try {
    // Query so_apr_spt table
    const result = await db.query(`
      SELECT 
        AVG(TIMESTAMPDIFF(HOUR, assigned_at, started_at)) as avgAssignmentToStart,
        AVG(TIMESTAMPDIFF(HOUR, started_at, completed_at)) as avgStartToComplete,
        AVG(TIMESTAMPDIFF(HOUR, completed_at, closed_at)) as avgCompleteToClose,
        MIN(TIMESTAMPDIFF(HOUR, assigned_at, closed_at)) as fastestResolution,
        MAX(TIMESTAMPDIFF(HOUR, assigned_at, closed_at)) as slowestResolution,
        COUNT(*) as totalThisMonth
      FROM so_apr_spt
      WHERE MONTH(assigned_at) = MONTH(CURRENT_DATE())
        AND YEAR(assigned_at) = YEAR(CURRENT_DATE())
    `);
    
    // Calculate trend
    const lastMonthResult = await db.query(`
      SELECT COUNT(*) as count
      FROM so_apr_spt
      WHERE MONTH(assigned_at) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH)
    `);
    
    const currentCount = result[0].totalThisMonth;
    const lastCount = lastMonthResult[0].count;
    const trend = ((currentCount - lastCount) / lastCount * 100).toFixed(1);
    
    res.json({
      success: true,
      data: {
        avgAssignmentToStart: result[0].avgAssignmentToStart,
        avgStartToComplete: result[0].avgStartToComplete,
        avgCompleteToClose: result[0].avgCompleteToClose,
        fastestResolution: result[0].fastestResolution,
        slowestResolution: result[0].slowestResolution,
        totalThisMonth: result[0].totalThisMonth,
        trend: {
          current: currentCount,
          previous: lastCount,
          change: parseFloat(trend)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

## 🎨 Styling Reference

Card menggunakan theme **GREEN/EMERALD** untuk membedakan dari KPI cards lain:

- **Blue**: Total Engineers
- **Orange**: Avg Resolution Time
- **Purple**: Overall Training Rate
- **Green/Emerald**: SO Time Tracking ✨

---

## 🧪 Testing dengan Mock Data

Untuk testing tanpa API:

```jsx
// Temporary mock data
const mockSOTimeData = {
  assignmentToStart: 1.2,
  startToComplete: 4.5,
  completeToClose: 0.8,
  targetTime: 8,
  fastestThisWeek: 2.1,
  slowest: 12.5,
  totalSOThisMonth: 188,
  monthlyTrend: 15.3
};

<SOTimeTrackingCard 
  soTimeData={mockSOTimeData}
  setInsightModal={setInsightModal}
/>
```

---

## 📊 Features Included

✅ **Time Breakdown**: Assignment → Start → Complete → Close
✅ **SLA Compliance**: Visual indicator if meeting target
✅ **Performance Highlights**: Fastest & slowest SO
✅ **Monthly Volume**: Total SO with trend indicator
✅ **Quick Stats Grid**: 3-column breakdown
✅ **Animations**: Shimmer effect on progress bar
✅ **Hover Effects**: Icon scaling and card lifting
✅ **Responsive**: Works on all screen sizes
✅ **Theme Aware**: Dark/light mode support
✅ **Consistent Styling**: Matches existing KPI cards

---

## 🚀 Next Steps

1. ✅ Component created
2. ⏳ Integrate to Engineer page
3. ⏳ Create API endpoint
4. ⏳ Connect to so_apr_spt table
5. ⏳ Test with real data
6. ⏳ Add insight modal (optional)

---

## 💡 Optional Enhancements

- Add drill-down modal for detailed SO breakdown
- Add filter by region/engineer
- Add date range picker
- Add export to CSV functionality
- Add real-time updates with WebSocket

---

**Ready to integrate!** 🎉
