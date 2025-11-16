/**
 * Optimized ResponsiveContainer wrapper
 * Reduces ResizeObserver overhead by debouncing resize events
 * and preventing cascading reflows
 */
import React, { useRef, useEffect, useState } from 'react';
import { ResponsiveContainer } from 'recharts';

/**
 * Optimized wrapper for ResponsiveContainer that:
 * - Debounces resize events (500ms)
 * - Prevents rapid re-renders
 * - Reduces forced reflow violations
 */
export default function OptimizedResponsiveContainer({ 
  children, 
  debounceMs = 500,
  minHeight = 0,
  minWidth = 0,
  ...props 
}) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeTimeoutRef = useRef(null);
  const lastDimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = Math.max(minWidth, rect.width);
      const newHeight = Math.max(minHeight, rect.height);
      
      // Only update if dimensions changed significantly (>10px)
      const widthDiff = Math.abs(newWidth - lastDimensionsRef.current.width);
      const heightDiff = Math.abs(newHeight - lastDimensionsRef.current.height);
      
      if (widthDiff > 10 || heightDiff > 10) {
        lastDimensionsRef.current = { width: newWidth, height: newHeight };
        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    // Initial measurement
    updateDimensions();

    // Debounced resize handler
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      
      resizeTimeoutRef.current = setTimeout(() => {
        updateDimensions();
      }, debounceMs);
    };

    // Use ResizeObserver with debouncing
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [debounceMs, minHeight, minWidth]);

  // If dimensions are not ready, render placeholder
  if (dimensions.width === 0 || dimensions.height === 0) {
    return (
      <div ref={containerRef} style={{ width: '100%', minHeight, minWidth }}>
        <div style={{ width: '100%', height: minHeight || 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-pulse text-slate-400">Loading chart...</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ width: '100%', minHeight, minWidth }}>
      <ResponsiveContainer 
        width="100%" 
        height={dimensions.height}
        {...props}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
}

