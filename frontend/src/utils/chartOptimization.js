// src/utils/chartOptimization.js
// Utilities for optimizing chart rendering performance

/**
 * Limits the number of data points in a chart to reduce rendering overhead
 * Uses sampling or aggregation to maintain visual accuracy while improving performance
 * 
 * @param {Array} data - Chart data array
 * @param {number} maxPoints - Maximum number of points to display (default: 50)
 * @param {string} strategy - 'sample' (pick evenly spaced points) or 'aggregate' (group and average)
 * @returns {Array} Optimized data array
 */
export function limitChartData(data, maxPoints = 50, strategy = 'sample') {
  if (!Array.isArray(data) || data.length <= maxPoints) {
    return data;
  }

  if (strategy === 'aggregate') {
    // Group data points and aggregate values
    const bucketSize = Math.ceil(data.length / maxPoints);
    const aggregated = [];

    for (let i = 0; i < data.length; i += bucketSize) {
      const bucket = data.slice(i, i + bucketSize);
      
      // Get all numeric keys from first item
      const numericKeys = Object.keys(bucket[0]).filter(key => 
        typeof bucket[0][key] === 'number'
      );
      
      // Average numeric values, keep first non-numeric values
      const aggregatedPoint = { ...bucket[0] };
      
      numericKeys.forEach(key => {
        const sum = bucket.reduce((acc, item) => acc + (item[key] || 0), 0);
        aggregatedPoint[key] = Math.round(sum / bucket.length);
      });
      
      aggregated.push(aggregatedPoint);
    }

    return aggregated;
  } else {
    // Sample evenly spaced points (default strategy)
    const step = data.length / maxPoints;
    const sampled = [];

    for (let i = 0; i < maxPoints; i++) {
      const index = Math.floor(i * step);
      sampled.push(data[index]);
    }

    return sampled;
  }
}

/**
 * Debounces chart updates to reduce rendering frequency
 * Returns a memoization function that batches updates using RAF
 * 
 * @param {Function} updateFn - Function to call with updated data
 * @param {number} delay - Debounce delay in milliseconds (default: 150)
 * @returns {Function} Debounced update function
 */
export function debounceChartUpdate(updateFn, delay = 150) {
  let timeoutId = null;
  let rafId = null;

  return function debouncedUpdate(...args) {
    // Clear pending updates
    if (timeoutId) clearTimeout(timeoutId);
    if (rafId) cancelAnimationFrame(rafId);

    // Debounce the update
    timeoutId = setTimeout(() => {
      // Use RAF to batch DOM updates
      rafId = requestAnimationFrame(() => {
        updateFn(...args);
      });
    }, delay);
  };
}

/**
 * Reduces chart complexity by removing unnecessary details
 * Optimizations include:
 * - Removing labels from pie charts with many slices
 * - Simplifying tooltips
 * - Reducing animation duration
 * 
 * @param {Object} chartConfig - Recharts configuration object
 * @param {number} dataLength - Number of data points
 * @returns {Object} Optimized configuration
 */
export function optimizeChartConfig(chartConfig = {}, dataLength = 0) {
  const optimized = { ...chartConfig };

  // Disable labels for pie charts with many slices (>10)
  if (dataLength > 10 && optimized.label) {
    optimized.label = false;
  }

  // Reduce animation duration for better performance
  if (!optimized.isAnimationActive) {
    optimized.animationDuration = 300; // Shorter animation
  }

  // Simplify stroke/fill for large datasets
  if (dataLength > 30) {
    optimized.dot = false; // Remove dots from line charts
    optimized.strokeWidth = optimized.strokeWidth || 2;
  }

  return optimized;
}

/**
 * Throttles chart interaction handlers (hover, click) to reduce CPU usage
 * 
 * @param {Function} handler - Event handler function
 * @param {number} limit - Minimum time between calls in milliseconds (default: 16ms ≈ 60fps)
 * @returns {Function} Throttled handler
 */
export function throttleChartHandler(handler, limit = 16) {
  let inThrottle = false;
  let rafId = null;

  return function throttled(...args) {
    if (!inThrottle) {
      inThrottle = true;

      // Use RAF for smooth updates at ~60fps
      rafId = requestAnimationFrame(() => {
        handler(...args);
        inThrottle = false;
      });

      // Fallback timeout if RAF doesn't fire
      setTimeout(() => {
        if (inThrottle) {
          if (rafId) cancelAnimationFrame(rafId);
          handler(...args);
          inThrottle = false;
        }
      }, limit);
    }
  };
}

/**
 * Pre-calculates chart dimensions to avoid layout thrashing
 * 
 * @param {HTMLElement} container - Container element
 * @returns {Object} { width, height } dimensions
 */
export function preCalculateChartDimensions(container) {
  if (!container) return { width: 0, height: 0 };

  // Read dimensions once to avoid forced reflow
  const { width, height } = container.getBoundingClientRect();
  
  return {
    width: Math.floor(width),
    height: Math.floor(height)
  };
}

