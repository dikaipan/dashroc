# Refactoring Guide - Struktur Kode yang Lebih Rapih

## 📁 Struktur File Baru

### `/styles/` - CSS Files (Terorganisir)
```
styles/
├── main.css              # Main file - imports semua CSS
├── themes.css            # Theme variables (dark/light)
├── utilities.css         # Utility classes
└── components/
    ├── kpi-cards.css     # KPI Cards styling
    ├── progress-bars.css # Progress bars styling
    ├── charts.css        # Recharts styling
    ├── leaflet.css       # Leaflet map styling
    └── sidebar.css       # Sidebar styling
```

### `/utils/` - Utility Functions
```
utils/
├── themeUtils.js         # Theme-aware styling functions
├── kpiCardStyles.js      # KPI card styling utilities
└── ... (existing utils)
```

### `/components/charts/kpi/` - KPI Card Components
```
components/charts/kpi/
├── TotalEngineersCard.jsx    # Total Engineers KPI card
├── AvgResolutionCard.jsx     # Avg Resolution KPI card (to be created)
└── OverallRateCard.jsx       # Overall Rate KPI card (to be created)
```

## 🎨 CSS Organization

### Theme Variables
Semua theme variables didefinisikan di `themes.css` menggunakan CSS custom properties:
- `--bg-1`, `--bg-2`: Background colors
- `--accent`, `--accent-2`, `--accent-3`: Accent colors
- `--card-bg`, `--muted`, `--shadow`: Component colors

### Component Styles
Setiap komponen besar memiliki file CSS terpisah di `/styles/components/`:
- Styles yang spesifik untuk komponen
- Theme-aware styling
- Tidak ada hardcode values, menggunakan CSS variables

## 🔧 Utility Functions

### `themeUtils.js`
Fungsi-fungsi untuk styling yang aware terhadap theme:
- `getKPICardGradient(color, isDark)`: Gradient classes untuk KPI cards
- `getTextGradient(color, isDark)`: Text gradient classes
- `getBadgeClasses(color, isDark)`: Badge/box classes
- `getIconBoxClasses(color, isDark)`: Icon box classes
- `getShadowClasses(color, isDark)`: Shadow classes

### `kpiCardStyles.js`
Fungsi-fungsi khusus untuk KPI cards:
- `getKPICardContainerClasses(color, isDark)`: Container classes
- `getDecorativeOverlayClasses(color)`: Decorative overlay
- `getSectionContainerClasses(color, isDark)`: Section containers
- `getProgressBarBgClasses(isDark)`: Progress bar backgrounds
- `getBadgeItemClasses(color, isDark)`: Badge item classes

## 📦 Component Structure

### KPI Cards
Setiap KPI card dipisah menjadi komponen terpisah:
- `TotalEngineersCard.jsx`: ~200 lines (dari 949 lines total)
- `AvgResolutionCard.jsx`: (to be created)
- `OverallRateCard.jsx`: (to be created)

### Benefits
1. **Smaller files**: Setiap komponen < 300 lines
2. **Reusable**: Utility functions dapat digunakan di komponen lain
3. **Maintainable**: Mudah untuk maintain dan update
4. **Theme-aware**: Semua styling menggunakan utility functions

## 🚀 Next Steps

1. ✅ Membuat utility files (`themeUtils.js`, `kpiCardStyles.js`)
2. ✅ Membuat struktur CSS baru (`styles/themes.css`, `styles/components/`)
3. ✅ Membuat `TotalEngineersCard.jsx` component
4. ⏳ Membuat `AvgResolutionCard.jsx` component
5. ⏳ Membuat `OverallRateCard.jsx` component
6. ⏳ Update `EngineerTrainingKPICards.jsx` untuk menggunakan komponen baru
7. ⏳ Migrate semua hardcoded CSS ke CSS variables
8. ⏳ Remove old `styles.css` setelah migration selesai

## 📝 Usage Example

```jsx
// Before (hardcoded)
<div className={cn(
  "relative overflow-hidden group flex flex-col",
  isDark 
    ? "bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-blue-600/10"
    : "bg-gradient-to-br from-blue-50/60 via-indigo-50/40 to-blue-100/50"
)}>

// After (using utilities)
import { getKPICardContainerClasses } from '../../../utils/kpiCardStyles';
<div className={getKPICardContainerClasses('blue', isDark)}>
```

