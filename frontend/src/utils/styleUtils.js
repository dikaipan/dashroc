/**
 * Style Utility Functions
 * Helper functions for consistent styling across components
 */

import { 
  CARD_STYLES, 
  BUTTON_STYLES, 
  BADGE_STYLES,
  TEXT_STYLES,
  getGradientCard,
  getColorMap,
  cn,
  GRADIENT_COLORS,
  GRADIENT_COLORS_HOVER
} from '../constants/styles';

/**
 * Create a KPI card style
 * @param {string} color - Color name
 * @param {boolean} hover - Include hover effects
 * @returns {string} KPI card classes
 */
export function getKPICard(color = 'blue', hover = true) {
  const gradient = hover ? GRADIENT_COLORS_HOVER[color] : GRADIENT_COLORS[color];
  return cn(
    'bg-gradient-to-br',
    gradient,
    'backdrop-blur-sm p-5 rounded-xl border min-h-[200px] transition-all duration-300'
  );
}

/**
 * Create a card style with optional hover
 * @param {string} variant - 'base', 'small', 'hover', 'kpi'
 * @param {string} color - Optional color for gradient
 * @returns {string} Card classes
 */
export function getCard(variant = 'base', color = null) {
  if (color) {
    return getGradientCard(color, variant === 'hover');
  }
  return CARD_STYLES[variant] || CARD_STYLES.base;
}

/**
 * Create a button style
 * @param {string} variant - Button variant
 * @param {string} size - Optional size override
 * @returns {string} Button classes
 */
export function getButton(variant = 'primary', size = null) {
  const baseStyle = BUTTON_STYLES[variant] || BUTTON_STYLES.primary;
  if (size === 'small') {
    return baseStyle.replace('px-6 py-2', 'px-3 py-1.5').replace('text-', 'text-xs ');
  }
  return baseStyle;
}

/**
 * Create a badge style
 * @param {string} color - Badge color
 * @returns {string} Badge classes
 */
export function getBadge(color = 'gray') {
  return BADGE_STYLES[color] || BADGE_STYLES.gray;
}

/**
 * Create text style
 * @param {string} variant - Text variant
 * @returns {string} Text classes
 */
export function getText(variant = 'body') {
  return TEXT_STYLES[variant] || TEXT_STYLES.body;
}

/**
 * Create modal style
 * @param {string} size - 'small', 'medium', 'large', 'fullscreen'
 * @returns {Object} Modal style object
 */
export function getModalStyles(size = 'medium') {
  const sizes = {
    small: {
      container: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6',
      content: 'bg-slate-900 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-700',
    },
    medium: {
      container: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6',
      content: 'bg-slate-900 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-700',
    },
    large: {
      container: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6',
      content: 'bg-slate-900 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-700',
    },
    fullscreen: {
      container: 'fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6',
      content: 'bg-slate-900 rounded-xl w-full max-w-7xl max-h-[95vh] flex flex-col border border-slate-700',
    },
  };
  return sizes[size] || sizes.medium;
}

/**
 * Create input style
 * @param {string} variant - Input variant
 * @returns {string} Input classes
 */
export function getInput(variant = 'base') {
  const variants = {
    base: 'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 transition-colors',
    small: 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 text-sm',
    search: 'w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors',
    select: 'px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 text-sm',
    disabled: 'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 opacity-50 cursor-not-allowed',
  };
  return variants[variant] || variants.base;
}

/**
 * Create table row style with conditional hover
 * @param {boolean} hover - Enable hover effect
 * @returns {string} Table row classes
 */
export function getTableRow(hover = true) {
  return hover 
    ? 'hover:bg-slate-800/50 transition-colors'
    : '';
}

/**
 * Create status badge based on value
 * @param {number} value - Value to determine status
 * @param {Object} thresholds - Threshold object { critical, warning, good }
 * @returns {string} Badge color
 */
export function getStatusBadge(value, thresholds = { critical: 0, warning: 10, good: 20 }) {
  if (value <= thresholds.critical) return 'red';
  if (value <= thresholds.warning) return 'yellow';
  return 'green';
}

/**
 * Create responsive grid classes
 * @param {Object} config - Grid configuration { cols, gap, responsive }
 * @returns {string} Grid classes
 */
export function getGrid(config = {}) {
  const { cols = 3, gap = 6, responsive = true } = config;
  const baseCols = `grid-cols-${cols}`;
  const baseGap = `gap-${gap}`;
  
  if (!responsive) {
    return `grid ${baseCols} ${baseGap}`;
  }
  
  return `grid grid-cols-1 md:grid-cols-2 lg:${baseCols} ${baseGap}`;
}

