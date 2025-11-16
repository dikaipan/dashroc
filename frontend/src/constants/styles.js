/**
 * Reusable Style System
 * Centralized styling classes for consistent UI across the application
 * 
 * Usage:
 * import { CARD_STYLES, BUTTON_STYLES, getGradientCard, cn } from '../constants/styles';
 * 
 * <div className={CARD_STYLES.base}>
 * <button className={BUTTON_STYLES.primary}>
 * <div className={getGradientCard('blue')}>
 */

// ============================================================================
// COLOR SYSTEM - Centralized color definitions
// ============================================================================

export const COLORS = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Accent colors
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

// ============================================================================
// MODAL STYLES
// ============================================================================

export const MODAL_STYLES = {
  // Main modal container - enhanced with vibrant backdrop
  container: 'fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6',
  containerFullscreen: 'fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-6',
  
  // Modal content sizes - enhanced borders with accent gradient
  content: 'bg-slate-900 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20',
  contentLarge: 'bg-slate-900 rounded-xl w-full max-w-7xl max-h-[95vh] flex flex-col border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20',
  contentMedium: 'bg-slate-900 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20',
  contentSmall: 'bg-slate-900 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20',
  contentFullscreen: 'bg-slate-900 rounded-xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col border-2 border-blue-400/30 shadow-2xl shadow-blue-500/20',
  
  // Modal header - enhanced with gradient border
  header: 'flex justify-between items-center p-6 border-b-2 border-blue-400/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5',
  headerTitle: 'text-2xl font-bold text-white bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent',
  headerTitleLarge: 'text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent',
  headerSubtitle: 'text-slate-400',
  
  // Modal body
  body: 'flex-1 p-6 overflow-auto',
  bodyNoPadding: 'flex-1 overflow-auto',
  
  // Modal footer - enhanced with gradient border
  footer: 'flex justify-end gap-3 p-6 border-t-2 border-blue-400/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5',
  footerBetween: 'flex justify-between items-center p-6 border-t-2 border-blue-400/30 bg-gradient-to-r from-blue-500/5 to-purple-500/5',
};

// ============================================================================
// INPUT STYLES
// ============================================================================

export const INPUT_STYLES = {
  base: 'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 transition-colors',
  small: 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 text-sm',
  disabled: 'w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 opacity-50 cursor-not-allowed',
  search: 'w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors',
  select: 'px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 text-sm',
  selectSmall: 'px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-blue-500',
  number: 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 text-sm',
};

// ============================================================================
// BUTTON STYLES
// ============================================================================

export const BUTTON_STYLES = {
  primary: 'px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium',
  secondary: 'px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium',
  danger: 'px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium',
  success: 'px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium',
  warning: 'px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium',
  ghost: 'px-6 py-2 bg-transparent hover:bg-slate-800 text-slate-300 rounded-lg transition-colors font-medium',
  icon: 'p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-slate-100 transition-colors border border-slate-700',
  iconSmall: 'p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors',
  link: 'text-blue-400 hover:text-blue-300 transition-colors',
  close: 'text-slate-400 hover:text-white transition-colors',
  small: 'px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors',
};

// ============================================================================
// CARD STYLES
// ============================================================================

export const CARD_STYLES = {
  base: 'bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700',
  baseSmall: 'bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700',
  hover: 'bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all',
  kpi: 'bg-slate-800/40 backdrop-blur-sm rounded-xl shadow-card p-6 border border-slate-700/30 min-h-[180px] flex flex-col',
  kpiLarge: 'bg-slate-800/40 backdrop-blur-sm rounded-xl shadow-card p-6 border border-slate-700/30 min-h-[200px] flex flex-col',
};

// ============================================================================
// BADGE/PILL STYLES
// ============================================================================

export const BADGE_STYLES = {
  base: 'px-2 py-1 text-xs font-medium rounded-full',
  purple: 'px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400',
  green: 'px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400',
  blue: 'px-2 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400',
  red: 'px-2 py-1 text-xs font-medium rounded-full bg-red-500/20 text-red-400',
  yellow: 'px-2 py-1 text-xs font-medium rounded-full bg-yellow-500/20 text-yellow-400',
  orange: 'px-2 py-1 text-xs font-medium rounded-full bg-orange-500/20 text-orange-400',
  gray: 'px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-400',
  cyan: 'px-2 py-1 text-xs font-medium rounded-full bg-cyan-500/20 text-cyan-400',
  indigo: 'px-2 py-1 text-xs font-medium rounded-full bg-indigo-500/20 text-indigo-400',
  pink: 'px-2 py-1 text-xs font-medium rounded-full bg-pink-500/20 text-pink-400',
};

// ============================================================================
// TABLE STYLES
// ============================================================================

export const TABLE_STYLES = {
  container: 'overflow-x-auto',
  table: 'w-full',
  thead: 'bg-slate-800 border-b border-slate-700 sticky top-0',
  th: 'px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider',
  thCenter: 'px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider',
  tbody: 'divide-y divide-slate-700',
  tr: 'hover:bg-slate-800/50 transition-colors',
  td: 'px-4 py-3 whitespace-nowrap',
  tdText: 'px-4 py-3',
};

// ============================================================================
// TEXT STYLES
// ============================================================================

export const TEXT_STYLES = {
  heading1: 'text-3xl font-bold text-slate-100 tracking-tight font-display',
  heading2: 'text-2xl font-bold text-white tracking-tight font-display',
  heading3: 'text-xl font-bold text-white tracking-tight font-display',
  heading4: 'text-lg font-semibold text-white tracking-tight font-display',
  body: 'text-sm text-slate-300 leading-relaxed font-sans',
  bodySmall: 'text-xs text-slate-400 leading-relaxed font-sans',
  label: 'block text-sm font-medium text-slate-300 mb-2 tracking-wide font-sans',
  labelSmall: 'block text-xs font-medium text-slate-400 mb-1 tracking-wide font-sans',
  muted: 'text-slate-400 leading-relaxed font-sans',
  mutedSmall: 'text-xs text-slate-400 leading-relaxed font-sans',
  link: 'text-blue-400 hover:text-blue-300 transition-colors font-medium font-sans',
  kpiTitle: 'text-sm font-medium text-slate-300 mb-2 tracking-wide uppercase font-sans',
  kpiValue: 'text-3xl font-bold text-white tracking-tight leading-none font-display',
  kpiSubtitle: 'text-xs text-slate-400 mt-1 leading-relaxed tracking-wide font-sans',
  // Enhanced typography for cards
  cardTitle: 'text-sm font-semibold text-slate-200 tracking-wider uppercase font-sans antialiased',
  cardValue: 'text-2xl font-bold text-white tracking-tight leading-none font-display antialiased',
  cardSubtitle: 'text-xs text-slate-300 leading-relaxed tracking-wide font-sans antialiased',
  cardLabel: 'text-xs font-medium text-slate-400 tracking-wider uppercase font-sans antialiased',
  cardMetric: 'text-xs font-bold text-slate-200 tracking-wide font-sans antialiased',
  cardDescription: 'text-xs text-slate-400 leading-relaxed font-sans antialiased',
  // Additional refined styles
  cardHeader: 'text-sm font-semibold tracking-wider uppercase font-sans antialiased',
  cardNumber: 'text-2xl font-bold tracking-tight leading-none font-display antialiased',
  cardInfo: 'text-xs leading-relaxed tracking-wide font-sans antialiased',
  cardBadge: 'text-xs font-bold tracking-wide uppercase font-sans antialiased',
};

// ============================================================================
// LAYOUT STYLES
// ============================================================================

export const LAYOUT_STYLES = {
  page: 'p-6 space-y-6 min-h-screen',
  section: 'space-y-4',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid4: 'grid grid-cols-1 md:grid-cols-4 gap-4',
  flexRow: 'flex items-center gap-3',
  flexRowBetween: 'flex items-center justify-between',
  flexCol: 'flex flex-col gap-4',
  divider: 'border-t border-slate-700',
  dividerVertical: 'border-l border-slate-700',
};

// ============================================================================
// GRADIENT COLOR SYSTEM
// ============================================================================

export const GRADIENT_COLORS = {
  // Dark mode: More vibrant and glowing gradients with multi-color stops
  blue: 'from-blue-500/30 via-blue-400/20 to-indigo-500/30 border-blue-400/40 text-blue-300 shadow-blue-500/20',
  purple: 'from-purple-500/30 via-purple-400/20 to-pink-500/30 border-purple-400/40 text-purple-300 shadow-purple-500/20',
  green: 'from-emerald-500/30 via-green-400/20 to-teal-500/30 border-emerald-400/40 text-emerald-300 shadow-emerald-500/20',
  red: 'from-red-500/30 via-rose-400/20 to-pink-500/30 border-red-400/40 text-red-300 shadow-red-500/20',
  orange: 'from-orange-500/30 via-amber-400/20 to-yellow-500/30 border-orange-400/40 text-orange-300 shadow-orange-500/20',
  yellow: 'from-yellow-500/30 via-amber-400/20 to-orange-500/30 border-yellow-400/40 text-yellow-300 shadow-yellow-500/20',
  indigo: 'from-indigo-500/30 via-blue-400/20 to-purple-500/30 border-indigo-400/40 text-indigo-300 shadow-indigo-500/20',
  cyan: 'from-cyan-500/30 via-blue-400/20 to-teal-500/30 border-cyan-400/40 text-cyan-300 shadow-cyan-500/20',
  pink: 'from-pink-500/30 via-rose-400/20 to-fuchsia-500/30 border-pink-400/40 text-pink-300 shadow-pink-500/20',
};

// Gradient with hover effects - enhanced with glow
export const GRADIENT_COLORS_HOVER = {
  blue: 'from-blue-500/30 via-blue-400/20 to-indigo-500/30 border-blue-400/40 hover:border-blue-300/60 hover:shadow-blue-500/40 hover:shadow-xl',
  purple: 'from-purple-500/30 via-purple-400/20 to-pink-500/30 border-purple-400/40 hover:border-purple-300/60 hover:shadow-purple-500/40 hover:shadow-xl',
  green: 'from-emerald-500/30 via-green-400/20 to-teal-500/30 border-emerald-400/40 hover:border-emerald-300/60 hover:shadow-emerald-500/40 hover:shadow-xl',
  red: 'from-red-500/30 via-rose-400/20 to-pink-500/30 border-red-400/40 hover:border-red-300/60 hover:shadow-red-500/40 hover:shadow-xl',
  orange: 'from-orange-500/30 via-amber-400/20 to-yellow-500/30 border-orange-400/40 hover:border-orange-300/60 hover:shadow-orange-500/40 hover:shadow-xl',
  yellow: 'from-yellow-500/30 via-amber-400/20 to-orange-500/30 border-yellow-400/40 hover:border-yellow-300/60 hover:shadow-yellow-500/40 hover:shadow-xl',
  indigo: 'from-indigo-500/30 via-blue-400/20 to-purple-500/30 border-indigo-400/40 hover:border-indigo-300/60 hover:shadow-indigo-500/40 hover:shadow-xl',
  cyan: 'from-cyan-500/30 via-blue-400/20 to-teal-500/30 border-cyan-400/40 hover:border-cyan-300/60 hover:shadow-cyan-500/40 hover:shadow-xl',
  pink: 'from-pink-500/30 via-rose-400/20 to-fuchsia-500/30 border-pink-400/40 hover:border-pink-300/60 hover:shadow-pink-500/40 hover:shadow-xl',
};

// ============================================================================
// KPI CARD STYLES
// ============================================================================

export const KPI_CARD_STYLES = {
  base: 'bg-gradient-to-br backdrop-blur-sm p-5 rounded-xl border min-h-[200px] transition-all duration-300',
  title: 'text-slate-200 text-sm font-semibold mb-1.5',
  value: 'text-3xl font-bold text-white',
  subtitle: 'text-xs text-slate-300 mt-1',
  icon: 'text-3xl',
};

// ============================================================================
// ALERT/STATUS STYLES
// ============================================================================

export const ALERT_STYLES = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  urgent: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  priority: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Combine multiple class names
 * @param {...string} classes - Class names to combine
 * @returns {string} Combined class names
 */
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Get conditional class names
 * @param {Object} conditions - Object with condition as key and class as value
 * @returns {string} Class names based on conditions
 */
export const conditionalClasses = (conditions) => {
  return Object.entries(conditions)
    .filter(([condition]) => condition)
    .map(([, className]) => className)
    .join(' ');
};

/**
 * Get gradient card classes
 * @param {string} color - Color name (blue, purple, green, etc.)
 * @param {boolean} hover - Include hover effects
 * @returns {string} Gradient card classes
 */
export const getGradientCard = (color, hover = false) => {
  const gradients = hover ? GRADIENT_COLORS_HOVER : GRADIENT_COLORS;
  const gradient = gradients[color] || gradients.blue;
  return `bg-gradient-to-br ${gradient} backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 overflow-hidden`;
};

/**
 * Get gradient card with custom intensity
 * @param {string} color - Color name
 * @param {string} intensity - 'light' (10/5), 'medium' (20/10), 'strong' (30/20)
 * @returns {string} Gradient card classes
 */
export const getGradientCardIntensity = (color, intensity = 'medium') => {
  const intensities = {
    light: { from: '10', to: '5', border: '20' },
    medium: { from: '20', to: '10', border: '30' },
    strong: { from: '30', to: '20', border: '40' },
  };
  const int = intensities[intensity] || intensities.medium;
  return `bg-gradient-to-br from-${color}-500/${int.from} to-${color}-600/${int.to} border-${color}-500/${int.border} backdrop-blur-sm p-6 rounded-xl border transition-all duration-300`;
};

/**
 * Get color map for regions/components
 * @param {string} color - Color name
 * @returns {Object} Color map with bg, border, text, hover, shadow
 */
export const getColorMap = (color) => {
  const colorMaps = {
    blue: {
      bg: 'from-blue-500/20 to-blue-600/10',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      hover: 'hover:border-blue-400/60',
      shadow: 'hover:shadow-blue-500/20',
    },
    purple: {
      bg: 'from-purple-500/20 to-purple-600/10',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      hover: 'hover:border-purple-400/60',
      shadow: 'hover:shadow-purple-500/20',
    },
    green: {
      bg: 'from-green-500/20 to-green-600/10',
      border: 'border-green-500/40',
      text: 'text-green-400',
      hover: 'hover:border-green-400/60',
      shadow: 'hover:shadow-green-500/20',
    },
    red: {
      bg: 'from-red-500/20 to-red-600/10',
      border: 'border-red-500/40',
      text: 'text-red-400',
      hover: 'hover:border-red-400/60',
      shadow: 'hover:shadow-red-500/20',
    },
    orange: {
      bg: 'from-orange-500/20 to-orange-600/10',
      border: 'border-orange-500/40',
      text: 'text-orange-400',
      hover: 'hover:border-orange-400/60',
      shadow: 'hover:shadow-orange-500/20',
    },
    yellow: {
      bg: 'from-yellow-500/20 to-yellow-600/10',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      hover: 'hover:border-yellow-400/60',
      shadow: 'hover:shadow-yellow-500/20',
    },
    indigo: {
      bg: 'from-indigo-500/20 to-indigo-600/10',
      border: 'border-indigo-500/40',
      text: 'text-indigo-400',
      hover: 'hover:border-indigo-400/60',
      shadow: 'hover:shadow-indigo-500/20',
    },
    cyan: {
      bg: 'from-cyan-500/20 to-cyan-600/10',
      border: 'border-cyan-500/40',
      text: 'text-cyan-400',
      hover: 'hover:border-cyan-400/60',
      shadow: 'hover:shadow-cyan-500/20',
    },
    pink: {
      bg: 'from-pink-500/20 to-pink-600/10',
      border: 'border-pink-500/40',
      text: 'text-pink-400',
      hover: 'hover:border-pink-400/60',
      shadow: 'hover:shadow-pink-500/20',
    },
  };
  return colorMaps[color] || colorMaps.blue;
};

/**
 * Get alert badge color based on stock level
 * @param {number} stock - Stock quantity
 * @returns {string} Badge color class
 */
export const getStockAlertBadge = (stock) => {
  if (stock === 0) return BADGE_STYLES.red;
  if (stock >= 1 && stock <= 5) return BADGE_STYLES.orange;
  if (stock >= 6 && stock <= 10) return BADGE_STYLES.yellow;
  return BADGE_STYLES.cyan;
};

/**
 * Get alert text color based on stock level
 * @param {number} stock - Stock quantity
 * @returns {string} Text color class
 */
export const getStockAlertText = (stock) => {
  if (stock === 0) return 'text-red-400';
  if (stock >= 1 && stock <= 5) return 'text-orange-400';
  if (stock >= 6 && stock <= 10) return 'text-yellow-400';
  return 'text-cyan-400';
};

/**
 * Get KPI card classes
 * @param {string} color - Color name (blue, purple, green, etc.)
 * @param {boolean} hover - Include hover effects
 * @returns {string} KPI card classes
 */
export const getKPICard = (color = 'blue', hover = true) => {
  const gradients = hover ? GRADIENT_COLORS_HOVER : GRADIENT_COLORS;
  const gradient = gradients[color] || gradients.blue;
  return `bg-gradient-to-br ${gradient} backdrop-blur-sm p-5 rounded-xl border min-h-[200px] transition-all duration-300 overflow-hidden`;
};

// ============================================================================
// RESPONSIVE VARIANTS
// ============================================================================

export const RESPONSIVE_STYLES = {
  // Grid responsive
  grid1to3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  grid1to4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4',
  grid1to2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
  
  // Text responsive
  heading1: 'text-2xl md:text-3xl lg:text-4xl font-bold',
  heading2: 'text-xl md:text-2xl lg:text-3xl font-bold',
  heading3: 'text-lg md:text-xl lg:text-2xl font-bold',
  heading4: 'text-base md:text-lg lg:text-xl font-semibold',
  
  // Spacing responsive
  padding: 'p-4 md:p-6 lg:p-8',
  paddingSmall: 'p-3 md:p-4 lg:p-5',
  margin: 'm-4 md:m-6 lg:m-8',
  
  // Container responsive
  container: 'w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8',
  containerSmall: 'w-full max-w-4xl mx-auto px-4 md:px-6',
  
  // Flex responsive
  flexColToRow: 'flex flex-col md:flex-row gap-4',
  flexColToRowBetween: 'flex flex-col md:flex-row items-start md:items-center justify-between gap-4',
};

// ============================================================================
// THEME SYSTEM
// ============================================================================

export const THEME_COLORS = {
  dark: {
    background: 'bg-slate-900',
    surface: 'bg-slate-800',
    surfaceElevated: 'bg-slate-700',
    text: 'text-slate-100',
    textMuted: 'text-slate-400',
    border: 'border-slate-700',
    card: 'bg-slate-800/50',
  },
  light: {
    background: 'bg-gray-50',
    surface: 'bg-white',
    surfaceElevated: 'bg-gray-100',
    text: 'text-gray-900',
    textMuted: 'text-gray-600',
    border: 'border-gray-300',
    card: 'bg-white/80',
  },
};

/**
 * Get theme-aware classes
 * @param {string} theme - 'dark' or 'light'
 * @param {string} type - 'background', 'surface', 'text', etc.
 * @returns {string} Theme-aware class
 */
export const getThemeClass = (theme = 'dark', type = 'background') => {
  return THEME_COLORS[theme]?.[type] || THEME_COLORS.dark[type];
};

/**
 * Get responsive class
 * @param {string} variant - Responsive variant name
 * @returns {string} Responsive classes
 */
export const getResponsive = (variant) => {
  return RESPONSIVE_STYLES[variant] || '';
};
