# Rencana Refactoring - Optimasi Struktur dan Performa

## 🎯 Tujuan
1. Memecah file besar menjadi komponen-komponen kecil yang reusable
2. Mengoptimalkan bundle size dan loading time
3. Meningkatkan maintainability dan code organization
4. Mengurangi duplikasi code

## 📊 Analisis File Besar

### File yang Perlu Dipecah (Priority Tinggi)
1. **Dashboard.jsx** - ~3564 lines
   - Charts, filters, tables, modals
   - Extract: Chart components, Filter components, Table components

2. **EngineerTrainingKPICards.jsx** - ~949 lines  
   - 3 KPI cards (Total Engineers, Avg Resolution, Overall Rate)
   - Extract: Individual KPI card components (✅ TotalEngineersCard sudah ada)

3. **MapWithRegions.jsx** - ~2259 lines
   - Map rendering, legends, markers, modals
   - Extract: Legend component, Marker components, Modal components

### File yang Perlu Optimasi
4. **StockPart.jsx** - Large file
5. Chart components duplikasi
6. CSS files yang bisa dikonsolidasi

## 🏗️ Struktur Baru

```
frontend/src/
├── components/
│   ├── charts/
│   │   ├── kpi/
│   │   │   ├── TotalEngineersCard.jsx ✅ (already exists)
│   │   │   ├── AvgResolutionCard.jsx (NEW)
│   │   │   ├── OverallRateCard.jsx (NEW)
│   │   │   └── index.js (exports)
│   │   ├── dashboard/
│   │   │   ├── DashboardChart.jsx (NEW - reusable chart wrapper)
│   │   │   ├── RegionChart.jsx (NEW)
│   │   │   ├── MachineAgeChart.jsx (NEW)
│   │   │   └── ...
│   │   └── ...
│   ├── map/
│   │   ├── MapLegend.jsx (NEW - extract from MapWithRegions)
│   │   ├── MapMarkers.jsx (NEW)
│   │   ├── ProvinceModal.jsx (already exists)
│   │   └── MapWithRegions.jsx (simplified)
│   └── ...
├── hooks/
│   ├── useChartData.js (NEW - reusable chart data logic)
│   ├── useMapData.js (NEW)
│   └── ...
└── utils/
    ├── chartHelpers.js (NEW - reusable chart utilities)
    └── ...
```

## ✅ Checklist Refactoring

### Phase 1: EngineerTrainingKPICards (Priority 1)
- [x] TotalEngineersCard sudah ada
- [ ] Buat AvgResolutionCard.jsx
- [ ] Buat OverallRateCard.jsx  
- [ ] Update EngineerTrainingKPICards.jsx untuk menggunakan sub-components
- [ ] Test dan verify

### Phase 2: MapWithRegions (Priority 2)
- [ ] Extract MapLegend component
- [ ] Extract MapMarkers component
- [ ] Simplify MapWithRegions.jsx
- [ ] Test dan verify

### Phase 3: Dashboard (Priority 3)
- [ ] Extract chart components
- [ ] Extract filter components
- [ ] Create reusable hooks
- [ ] Test dan verify

### Phase 4: Optimizations
- [ ] Optimize imports (tree-shaking)
- [ ] Improve lazy loading
- [ ] Bundle size analysis
- [ ] Performance testing

## 📦 Bundle Optimization

### Vite Config Improvements
- Better chunk splitting
- Tree-shaking optimization
- Code splitting for routes
- Dynamic imports for heavy components

### Import Optimization
- Use named imports instead of default
- Remove unused imports
- Consolidate utility functions

## 🧪 Testing Strategy
1. Unit test untuk komponen baru
2. Integration test untuk refactored components
3. Performance benchmark (before/after)
4. Bundle size comparison

## 📝 Notes
- Keep backward compatibility
- Document breaking changes
- Gradual migration strategy
