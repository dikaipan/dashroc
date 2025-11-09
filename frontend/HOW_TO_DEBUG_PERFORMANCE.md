# How to Debug Performance Violations

## Quick Start Guide

### Step 1: Verify the Violations Are Real

1. **Test in Incognito Mode**
   ```
   1. Open Chrome
   2. Press Ctrl+Shift+N (Windows) or Cmd+Shift+N (Mac)
   3. Navigate to http://localhost:5000
   4. Open DevTools (F12)
   5. Check Console for violations
   ```
   
   **Why?** Chrome extensions (React DevTools, Redux DevTools, etc.) can cause performance violations that aren't actually your code's fault.

2. **Test in Production Build**
   ```bash
   npm run build
   npm run preview  # Vite's preview server
   ```
   
   **Why?** Development builds are slower due to:
   - Source maps
   - Hot module replacement
   - React DevTools hooks
   - Unminified code

### Step 2: Record a Performance Profile

1. **Open Chrome DevTools Performance Tab**
   - Press F12
   - Click "Performance" tab
   - Click the record button (●) or press Ctrl+E

2. **Interact with the Dashboard**
   - Load the dashboard
   - Change filters
   - Hover over charts
   - Click on map regions
   - Scroll the page

3. **Stop Recording**
   - Click the stop button or press Ctrl+E
   - Wait for analysis to complete

4. **Analyze the Results**
   
   **Look for:**
   
   a) **Long Tasks (Yellow/Red bars > 50ms)**
   ```
   Main > Task
   └─ Long Task (234ms)  <-- These are problems
      ├─ Scripting (180ms)
      ├─ Rendering (34ms)
      └─ Painting (20ms)
   ```
   
   b) **Layout Thrashing (Multiple Layout events)**
   ```
   Layout (15ms)
   Recalculate Style (8ms)
   Layout (12ms)  <-- Bad: multiple layouts
   Recalculate Style (9ms)
   Layout (10ms)  <-- Indicates layout thrashing
   ```
   
   c) **Scripting Time**
   ```
   Function Call > Dashboard.render (120ms)  <-- Heavy component
   Function Call > ResponsiveContainer.resize (80ms)  <-- Chart overhead
   ```

### Step 3: Use React DevTools Profiler

1. **Install React DevTools**
   - Chrome: [React DevTools Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)

2. **Open Profiler Tab**
   - Press F12
   - Click "⚛️ Profiler" tab
   - Click the record button (●)

3. **Interact with Dashboard**
   - Perform actions that feel slow
   - Change filters
   - Interact with charts

4. **Stop and Analyze**
   
   **Look for:**
   
   a) **Long Commit Times**
   ```
   Commit #1: 234ms  <-- Too long (should be <16ms for 60fps)
   └─ Dashboard (180ms)
      ├─ ResponsiveContainer (120ms)  <-- Slow component
      └─ MapWithRegions (60ms)
   ```
   
   b) **Frequent Re-renders**
   ```
   Dashboard rendered 45 times  <-- Too many
   └─ Caused by: props.data changed (45x)  <-- Why?
   ```
   
   c) **Why did this render?**
   ```
   Dashboard rendered because:
   - props.engineers changed
   - props.machines changed  <-- Every change causes re-render
   ```

### Step 4: Identify Specific Culprits

#### Check #1: ResponsiveContainer

1. **Open Console**
2. **Run this code:**
   ```javascript
   // Count ResponsiveContainer instances
   const containers = document.querySelectorAll('[class*="recharts-responsive-container"]');
   console.log('ResponsiveContainer count:', containers.length);
   ```

3. **Expected:** 3-5 instances
4. **Actual:** 8+ instances = Problem!

**Solution:** Replace with fixed-height charts or OptimizedChart component.

#### Check #2: Event Listeners

1. **Open Console**
2. **Run this code:**
   ```javascript
   // Monitor event listener calls
   let resizeCount = 0;
   const originalResize = window.addEventListener;
   window.addEventListener = function(type, listener, options) {
     if (type === 'resize') {
       resizeCount++;
       console.log('Resize listener added. Total:', resizeCount);
       console.trace();
     }
     return originalResize.call(this, type, listener, options);
   };
   ```

3. **Reload page**
4. **Expected:** 1-3 resize listeners
5. **Actual:** 10+ listeners = Problem!

**Solution:** Debounce resize handlers, use single listener.

#### Check #3: Render Frequency

1. **Open Console**
2. **Enable "Paint flashing"** in DevTools:
   - Press Ctrl+Shift+P
   - Type "Show Rendering"
   - Check "Paint flashing"

3. **Interact with dashboard**
4. **Green flashes = area repainted**

**Expected:** Only components you interact with flash
**Actual:** Entire page flashes = Problem!

**Solution:** Use React.memo, prevent unnecessary re-renders.

### Step 5: Measure Specific Functions

Add performance marks to your code:

```javascript
// In Dashboard.jsx or any component
useEffect(() => {
  performance.mark('dashboard-render-start');
  
  // Your rendering logic
  
  performance.mark('dashboard-render-end');
  performance.measure(
    'dashboard-render',
    'dashboard-render-start',
    'dashboard-render-end'
  );
  
  const measure = performance.getEntriesByName('dashboard-render')[0];
  console.log('Dashboard render took:', measure.duration.toFixed(2), 'ms');
  
  if (measure.duration > 16) {
    console.warn('⚠️  Dashboard render is slow!');
  }
}, [/* dependencies */]);
```

### Step 6: Test Individual Components

Create a minimal test page:

```javascript
// test-chart-performance.html
<!DOCTYPE html>
<html>
<head>
  <title>Chart Performance Test</title>
</head>
<body>
  <div id="root"></div>
  
  <script type="module">
    import React from 'react';
    import ReactDOM from 'react-dom';
    import { LineChart, Line, ResponsiveContainer } from 'recharts';
    
    const data = Array.from({ length: 50 }, (_, i) => ({
      x: i,
      y: Math.random() * 100
    }));
    
    performance.mark('chart-render-start');
    
    ReactDOM.render(
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <Line dataKey="y" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>,
      document.getElementById('root')
    );
    
    setTimeout(() => {
      performance.mark('chart-render-end');
      performance.measure('chart-render', 'chart-render-start', 'chart-render-end');
      const measure = performance.getEntriesByName('chart-render')[0];
      console.log('Chart render took:', measure.duration.toFixed(2), 'ms');
    }, 1000);
  </script>
</body>
</html>
```

### Step 7: Compare Before/After

Create a spreadsheet to track metrics:

| Metric | Before | After | Improvement | Notes |
|--------|--------|-------|-------------|-------|
| Message Handler | 373ms | ? | ? | Check after each optimization |
| Forced Reflow | 159ms | ? | ? | |
| Render Time | ? | ? | ? | Use React Profiler |
| Chart Load | ? | ? | ? | Use performance.measure |
| Page Load | ? | ? | ? | Use Lighthouse |

## Common Issues and Solutions

### Issue 1: Violation Only in Development

**Symptom:** Violations disappear in production build

**Cause:** React DevTools, HMR, source maps

**Solution:** Ignore development-only violations, focus on production performance

### Issue 2: Violation Only with Extensions

**Symptom:** Violations disappear in incognito mode

**Cause:** Chrome extensions interfering

**Solution:** Test without extensions, or ask users to disable them

### Issue 3: Violation Only on First Load

**Symptom:** First load is slow, subsequent loads are fast

**Cause:** Initial chart rendering, lazy loading

**Solution:** Add skeleton loaders, optimize first paint

### Issue 4: Violation Only on Specific Interactions

**Symptom:** Hovering over map/chart causes violation

**Cause:** Event handlers not throttled

**Solution:** Throttle mouseover/mouseout events

### Issue 5: Violation Increases Over Time

**Symptom:** App gets slower the longer it runs

**Cause:** Memory leak (listeners not removed, timers not cleared)

**Solution:** Check for memory leaks in DevTools Memory tab

## Advanced Profiling

### Lighthouse Audit

```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse http://localhost:5000 --view --preset=desktop
```

**Look for:**
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Total Blocking Time (TBT) < 200ms
- Cumulative Layout Shift (CLS) < 0.1

### Continuous Monitoring

Add Web Vitals tracking:

```javascript
// In index.html or App.jsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  console.log(metric);
  // Send to analytics service
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Checklist

- [ ] Tested in incognito mode (no extensions)
- [ ] Tested production build
- [ ] Recorded Chrome DevTools performance profile
- [ ] Analyzed long tasks and layout thrashing
- [ ] Used React DevTools Profiler
- [ ] Identified components with long render times
- [ ] Counted ResponsiveContainer instances
- [ ] Checked event listener count
- [ ] Enabled paint flashing
- [ ] Added performance marks to code
- [ ] Created minimal test case
- [ ] Documented before/after metrics
- [ ] Ran Lighthouse audit
- [ ] Added Web Vitals tracking

## Next Steps

After profiling, you should have:
1. **Specific component** causing the issue
2. **Specific function/operation** taking too long
3. **Specific metric** to improve (e.g., "Dashboard render: 234ms → <50ms")

Then apply targeted optimizations:
- Use `React.memo` on slow components
- Debounce/throttle event handlers
- Reduce chart data points
- Replace ResponsiveContainer with fixed heights
- Virtualize long lists
- Lazy load heavy components

## Resources

- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

