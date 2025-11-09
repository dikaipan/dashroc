// Chart colors and configurations - More vibrant and modern colors

// Dark mode colors - brighter and more vibrant
export const CHART_COLORS_DARK = [
  '#60a5fa', // Bright blue
  '#34d399', // Emerald green
  '#fbbf24', // Amber
  '#f87171', // Light red
  '#a78bfa', // Violet
  '#f472b6', // Pink
  '#22d3ee', // Cyan
  '#fb923c', // Orange
  '#818cf8', // Indigo
  '#84cc16', // Lime
];

// Light mode colors - richer and more saturated
export const CHART_COLORS_LIGHT = [
  '#2563eb', // Deep blue
  '#059669', // Deep green
  '#d97706', // Deep amber
  '#dc2626', // Deep red
  '#7c3aed', // Deep purple
  '#db2777', // Deep pink
  '#0891b2', // Deep cyan
  '#ea580c', // Deep orange
  '#4f46e5', // Deep indigo
  '#65a30d', // Deep lime
];

// Default export (will be used based on theme)
export const CHART_COLORS = CHART_COLORS_DARK;

export const TOOLTIP_STYLES = {
  default: {
    backgroundColor: '#1e293b',
    border: '2px solid #60a5fa',
    borderRadius: '10px',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(96, 165, 250, 0.3)',
  },
  fullscreen: {
    backgroundColor: '#0f172a',
    border: '2px solid #60a5fa',
    borderRadius: '12px',
    color: '#ffffff',
    boxShadow: '0 8px 24px rgba(96, 165, 250, 0.4)',
    padding: '12px 16px',
  },
};

// Light mode tooltip styles
export const TOOLTIP_STYLES_LIGHT = {
  default: {
    backgroundColor: '#ffffff',
    border: '2px solid #2563eb',
    borderRadius: '10px',
    padding: '8px 12px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
    color: '#0f172a',
  },
  fullscreen: {
    backgroundColor: '#f8fafc',
    border: '2px solid #2563eb',
    borderRadius: '12px',
    color: '#0f172a',
    boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
    padding: '12px 16px',
  },
};

export const CHART_MARGINS = {
  default: { top: 10, right: 10, left: 0, bottom: 10 },
  fullscreen: { top: 20, right: 30, left: 20, bottom: 60 },
};

/**
 * Get tooltip config for charts
 */
export const getTooltipConfig = (color = '#60a5fa', isFullscreen = false, isDark = true) => {
  const tooltipStyles = isDark ? TOOLTIP_STYLES : TOOLTIP_STYLES_LIGHT;
  return {
    contentStyle: isFullscreen ? {
      ...tooltipStyles.fullscreen,
      border: `2px solid ${color}`,
      boxShadow: `0 ${isFullscreen ? '8px 24px' : '4px 12px'} ${color}${isDark ? '66' : '33'}`,
    } : {
      ...tooltipStyles.default,
      border: `2px solid ${color}`,
      boxShadow: `0 4px 12px ${color}${isDark ? '4d' : '33'}`,
    },
    labelStyle: { 
      color: isDark ? '#e2e8f0' : '#0f172a', 
      fontSize: isFullscreen ? '16px' : '12px', 
      fontWeight: 'bold' 
    },
    itemStyle: { 
      color: isDark ? (isFullscreen ? '#ffffff' : '#93c5fd') : (isFullscreen ? '#1e293b' : '#2563eb'), 
      fontSize: isFullscreen ? '16px' : '12px',
      fontWeight: '500',
    },
  };
};

/**
 * Get axis config for charts
 */
export const getAxisConfig = (isFullscreen = false, isDark = true) => ({
  tick: { 
    fill: isDark ? '#94a3b8' : '#475569', 
    fontSize: isFullscreen ? 14 : 12,
    fontWeight: '500',
  },
  stroke: isDark ? '#64748b' : '#cbd5e1',
  strokeWidth: 1.5,
});