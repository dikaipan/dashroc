// src/components/charts/LazyChart.jsx
// Lazy load charts using Intersection Observer to improve initial render performance

import React, { useState, useEffect, useRef, memo } from 'react';

/**
 * LazyChart - Only renders chart when it comes into viewport
 * This significantly improves initial page load performance
 */
const LazyChart = memo(function LazyChart({ children, fallback = null, threshold = 0.1 }) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Use Intersection Observer to detect when chart enters viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Disconnect observer once chart is visible (one-time load)
            observer.disconnect();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px', // Start loading 50px before chart enters viewport
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return (
    <div ref={containerRef} style={{ minHeight: '200px' }}>
      {isVisible ? children : (fallback || <div className="flex items-center justify-center h-full text-slate-500">Loading chart...</div>)}
    </div>
  );
});

export default LazyChart;

