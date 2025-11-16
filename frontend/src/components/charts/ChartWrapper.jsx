/**
 * Chart Wrapper Component
 * Reusable wrapper for Recharts with theme-aware styling
 */
import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '../../constants/styles';

/**
 * ChartWrapper - Responsive container wrapper with theme support
 * @param {Object} props
 * @param {React.ReactNode} props.children - Chart component (BarChart, LineChart, etc.)
 * @param {string|number} props.width - Width (default: '100%')
 * @param {string|number} props.height - Height (default: 300)
 * @param {string} props.className - Additional CSS classes
 */
export const ChartWrapper = ({ 
  children, 
  width = '100%', 
  height = 300,
  className = ''
}) => {
  const containerRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const heightValue = typeof height === 'number' ? height : parseInt(height, 10) || 300;
  const minHeight = Math.max(heightValue, 200); // Ensure minimum height of 200px

  // Wait for container to be mounted and visible before rendering chart
  // Optimized to reduce forced reflows - use ResizeObserver with debounce
  useEffect(() => {
    if (!containerRef.current) return;
    
    let mounted = true;
    let resizeObserver = null;
    let timeoutId = null;
    
    // Use ResizeObserver instead of polling offsetWidth/offsetHeight
    // ResizeObserver is more efficient and doesn't cause forced reflows
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        // Debounce resize events to batch multiple changes
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          if (!mounted || !containerRef.current) return;
          
          // Check dimensions only once after debounce
          const entry = entries[0];
          if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            setIsReady(true);
          }
        }, 50); // Debounce resize events
      });
      
      resizeObserver.observe(containerRef.current);
    } else {
      // Fallback: use setTimeout with longer delay to avoid forced reflow
      timeoutId = setTimeout(() => {
        if (mounted && containerRef.current) {
          // Only check once after mount, don't poll
          setIsReady(true);
        }
      }, 300);
    }
    
    return () => {
      mounted = false;
      if (resizeObserver && containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
        resizeObserver.disconnect();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={cn('w-full', className)} 
      style={{ 
        height: `${heightValue}px`, 
        minHeight: `${minHeight}px`,
        minWidth: '100px',
        position: 'relative',
        display: 'block'
      }}
    >
      {isReady && (
        <ResponsiveContainer 
          width={width} 
          height={heightValue}
          minHeight={minHeight}
          minWidth={100}
        >
          {children}
        </ResponsiveContainer>
      )}
    </div>
  );
};

