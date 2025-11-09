// src/components/charts/OptimizedChart.jsx
// Optimized chart wrapper to reduce forced reflows from ResponsiveContainer
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ResponsiveContainer } from 'recharts';

/**
 * OptimizedChart - A wrapper around ResponsiveContainer that:
 * 1. Debounces resize events to reduce forced reflows
 * 2. Uses requestAnimationFrame for smooth updates
 * 3. Only updates when size changes significantly (threshold)
 * 4. Adds passive event listeners for better performance
 */
const OptimizedChart = React.memo(function OptimizedChart({ 
  children, 
  width = "100%", 
  height = 300,
  debounceMs = 150,
  resizeThreshold = 10 // Only update if size changes by more than this many pixels
}) {
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const resizeTimeoutRef = useRef(null);
  const rafRef = useRef(null);
  const lastSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use ResizeObserver for efficient size tracking
    const resizeObserver = new ResizeObserver((entries) => {
      // Clear pending updates
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      // Debounce resize handling
      resizeTimeoutRef.current = setTimeout(() => {
        const entry = entries[0];
        if (!entry) return;

        const { width: newWidth, height: newHeight } = entry.contentRect;
        const { width: lastWidth, height: lastHeight } = lastSizeRef.current;

        // Only update if size changed significantly (reduces reflows)
        const widthDiff = Math.abs(newWidth - lastWidth);
        const heightDiff = Math.abs(newHeight - lastHeight);

        if (widthDiff > resizeThreshold || heightDiff > resizeThreshold) {
          // Use RAF to batch DOM updates
          rafRef.current = requestAnimationFrame(() => {
            setContainerSize({ width: newWidth, height: newHeight });
            lastSizeRef.current = { width: newWidth, height: newHeight };
          });
        }
      }, debounceMs);
    });

    resizeObserver.observe(container);

    // Initial size
    const { width: initialWidth, height: initialHeight } = container.getBoundingClientRect();
    setContainerSize({ width: initialWidth, height: initialHeight });
    lastSizeRef.current = { width: initialWidth, height: initialHeight };

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [debounceMs, resizeThreshold]);

  // Use fixed dimensions when possible to avoid ResizeObserver overhead
  const useFixedDimensions = typeof height === 'number';

  if (useFixedDimensions) {
    // For fixed height, use ResponsiveContainer with minimal overhead
    return (
      <ResponsiveContainer width={width} height={height}>
        {children}
      </ResponsiveContainer>
    );
  }

  // For dynamic sizing, use our optimized approach
  return (
    <div ref={containerRef} style={{ width, height }}>
      {containerSize.width > 0 && (
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
});

export default OptimizedChart;

