// src/components/charts/PerformanceChart.jsx
// Performance-optimized chart wrapper that disables animations and reduces reflows

import React, { memo } from 'react';
import { ResponsiveContainer } from 'recharts';

/**
 * PerformanceChart - Wrapper that disables animations and optimizes rendering
 * 
 * Props:
 * - children: Chart component (BarChart, LineChart, PieChart, etc.)
 * - width: Container width (default: "100%")
 * - height: Container height (required)
 * - disableAnimation: Disable animations (default: true for performance)
 */
const PerformanceChart = memo(function PerformanceChart({ 
  children, 
  width = "100%", 
  height,
  disableAnimation = true 
}) {
  // Clone children and disable animations for performance
  const optimizedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        isAnimationActive: disableAnimation ? false : child.props.isAnimationActive,
        animationDuration: disableAnimation ? 0 : (child.props.animationDuration || 300),
        // Remove dots from line charts for better performance
        dot: disableAnimation ? false : child.props.dot,
        // Simplify tooltip for better performance
        ...(disableAnimation && child.type?.displayName === 'Line' ? { 
          dot: false,
          activeDot: { r: 4 }
        } : {})
      });
    }
    return child;
  });

  return (
    <ResponsiveContainer width={width} height={height}>
      {optimizedChildren}
    </ResponsiveContainer>
  );
});

export default PerformanceChart;

