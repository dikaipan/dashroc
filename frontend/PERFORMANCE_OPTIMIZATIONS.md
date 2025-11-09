# Performance Optimizations Applied

## Overview
This document tracks all performance optimizations applied to the ROC Dashboard to address performance violations, specifically:
- `[Violation] 'message' handler took Xms` (high values: 300-400ms)
- `[Violation] Forced reflow while executing JavaScript took Yms` (high values: 150-200ms)

## Optimizations Applied

### 1. Chart Rendering Optimizations

#### A. Limit Chart Data Points
**File:** `frontend/src/utils/chartOptimization.js`
- Created `limitChartData()` function to sample or aggregate data when there are too many points
- Reduces rendering overhead by limiting charts to 20-50 points max
- Strategies:
  - **Sample**: Evenly spaced point selection (good for line charts)
  - **Aggregate**: Group and average values (good for bar charts)

**Applied to:**
- `monthlyActivationData` - Limited to 36 points (3 years)
- `installYearData` - Limited to 20 most recent years

#### B. Debounce Chart Updates
**File:** `frontend/src/utils/chartOptimization.js`
- Created `debounceChartUpdate()` to batch chart updates using `requestAnimationFrame`
- Prevents rapid re-renders during resize or data updates
- Default delay: 150ms

#### C. Throttle Chart Interaction Handlers
**File:** `frontend/src/utils/chartOptimization.js`
- Created `throttleChartHandler()` to limit hover/click handler execution
- Uses `requestAnimationFrame` for smooth 60fps updates
- Limit: 16ms (~60fps)

#### D. Optimized Chart Component
**File:** `frontend/src/components/charts/OptimizedChart.jsx`
- Wrapper around `ResponsiveContainer` with:
  - Debounced resize events (150ms)
  - `requestAnimationFrame` for updates
  - Resize threshold (10px) to avoid micro-updates
  - Uses `ResizeObserver` efficiently

**Benefits:**
- Reduces forced reflows from continuous size recalculation
- Batches DOM updates to avoid layout thrashing
- Only updates when size changes significantly

### 2. Event Handling Optimizations

#### A. Debounced Data Fetching
**File:** `frontend/src/hooks/useDataFetch.js`
- Added 100ms debounce to `handleDataChange` event listener
- Added `isPending` flag to prevent concurrent fetches
- Used `{ passive: true }` for event listeners
- Wraps fetch in `requestAnimationFrame` for better scheduling

**Benefits:**
- Prevents rapid, consecutive API calls
- Reduces "message handler" violation duration
- Batches multiple events into single fetch

#### B. Debounced State Updates in Dashboard
**File:** `frontend/src/pages/Dashboard.jsx`
- Wrapped `setMonthlyMachineData` and `setLoadingMonthly` in `requestAnimationFrame`
- Added 100ms debounce to `fetchMonthlyData`
- Defers loading state updates to avoid blocking render

**Benefits:**
- Batches multiple state updates
- Reduces render blocking
- Smoother UX during data loading

### 3. Context Optimizations

#### A. Optimized Theme Context
**File:** `frontend/src/contexts/ThemeContext.jsx`
- Wrapped theme class list modifications in `requestAnimationFrame`
- Added `try...catch` for `localStorage` operations (non-blocking)
- Batches DOM updates to document root

**Benefits:**
- Prevents forced reflow from synchronous class list changes
- Reduces layout thrashing
- Non-blocking localStorage saves

### 4. Component Re-render Optimizations

#### A. Memoized Event Handlers
**File:** `frontend/src/pages/Dashboard.jsx`
- Used `useCallback` for `handleEngineerClick`
- Ensures stable reference, prevents child re-renders

#### B. Memoized Chart Calculations
**File:** `frontend/src/pages/Dashboard.jsx`
- Moved `topRegionsChart` calculation to component top-level with `useMemo`
- Prevents recalculation on every render
- Adheres to Rules of Hooks

#### C. React.memo on Heavy Components

**File:** `frontend/src/components/map/MapWithRegions.jsx`
- Applied `React.memo` with custom comparison function
- Only re-renders when:
  - `isFullscreen` changes
  - `onEngineerClick` changes
  - `machines` or `engineers` array length changes
- Memoized `geoJsonStyle` and `geoJsonOnEachFeature` with `useCallback`
- Pre-calculated `maxEngineerCount` with `useMemo`
- Throttled mouseover/mouseout events (16ms delay + RAF)

**File:** `frontend/src/components/charts/SkillProgress.jsx`
- Applied `React.memo` to component
- Memoized skill calculations with `useMemo`
- Prevents recalculation unless training data changes

**Benefits:**
- Massive reduction in re-renders for map/chart components
- Faster interactions (hover, click)
- Smoother animations

### 5. Map Optimizations

#### A. Debounced Map Bounds Fitting
**File:** `frontend/src/components/map/MapWithRegions.jsx`
- Debounced `map.fitBounds` with `setTimeout` + `requestAnimationFrame`
- Prevents forced reflow from rapid bounds changes
- Uses `{ passive: true }` for event listeners

#### B. Throttled Layer Style Updates
**File:** `frontend/src/components/map/MapWithRegions.jsx`
- Throttled `mouseover`/`mouseout` handlers with 16ms delay
- Wrapped style changes in `requestAnimationFrame`
- Clears pending timeouts before new updates

**Benefits:**
- Reduces forced reflow from frequent style recalculation
- Smoother hover interactions
- Better map performance with many layers

### 6. Build Optimizations

#### A. Code Splitting
**File:** `frontend/src/App.jsx`
- Implemented lazy loading for all page components
- Used `React.lazy` + `Suspense` with `LoadingSkeleton`
- Reduces initial bundle size

**Benefits:**
- Faster initial page load
- Smaller JavaScript bundle parsed by browser
- Better perceived performance

#### B. Vendor Chunk Strategy
**File:** `frontend/vite.config.js`
- Conservative chunking strategy:
  - `vendor-react`: All React-related packages (prevents context errors)
  - `vendor-maps`: Leaflet core only
  - `data-geojson`: Large GeoJSON files
- Ensures React is always loaded before dependent modules

**Benefits:**
- Prevents "Cannot read properties of undefined (reading 'useState')" errors
- Better caching (vendor chunks rarely change)
- Predictable load order

## Performance Metrics (Expected Improvements)

| Metric | Before | After (Target) | Improvement |
|--------|--------|----------------|-------------|
| Message Handler Duration | 300-400ms | <100ms | ~70% reduction |
| Forced Reflow Duration | 150-200ms | <50ms | ~70% reduction |
| Chart Render Time | High | Low | Significant |
| Map Interaction Lag | Noticeable | Smooth | Qualitative |
| Re-renders per Second | High | Low | Significant |

## Best Practices Applied

1. **Always batch DOM updates** using `requestAnimationFrame`
2. **Debounce/throttle high-frequency events** (resize, scroll, mousemove)
3. **Memoize expensive calculations** with `useMemo`/`useCallback`
4. **Apply React.memo** to heavy components with custom comparison
5. **Limit data points** in charts (20-50 max)
6. **Use passive event listeners** where possible
7. **Lazy load** heavy components and pages
8. **Pre-calculate** values that don't change often
9. **Avoid forced reflows** by reading layout properties before writing
10. **Use fixed dimensions** where possible (avoid continuous ResizeObserver)

## Tools Used for Profiling

- Chrome DevTools Performance tab
- React DevTools Profiler
- Console violations (Chrome)
- Lighthouse audits
- Custom performance marks/measures

## Next Steps

1. **Profile in production** to validate improvements
2. **Add performance monitoring** (e.g., Web Vitals)
3. **Consider virtualization** for long lists (if needed)
4. **Optimize images** with lazy loading and WebP format
5. **Add service worker** for offline caching
6. **Enable compression** (gzip/brotli) on server

## References

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Forced Reflow Prevention](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [Recharts Performance](https://recharts.org/en-US/guide/performance)
- [Leaflet Performance Tips](https://leafletjs.com/examples/geojson/)
