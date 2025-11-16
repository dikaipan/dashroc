// src/utils/kpiCardStyles.js
// Reusable styling utilities for KPI cards
import { cn } from '../constants/styles';
import { getKPICardGradient, getBadgeClasses, getShadowClasses } from './themeUtils';

/**
 * Get base KPI card container classes
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getKPICardContainerClasses = (color, isDark) => {
  const gradients = getKPICardGradient(color, isDark);
  const borderClasses = {
    blue: isDark ? 'border border-blue-400/30 hover:border-blue-400/50' : 'border border-blue-300/50 hover:border-blue-400/70',
    orange: isDark ? 'border border-orange-400/30 hover:border-orange-400/50' : 'border border-orange-300/50 hover:border-orange-400/70',
    purple: isDark ? 'border border-purple-400/30 hover:border-purple-400/50' : 'border border-purple-300/50 hover:border-purple-400/70'
  };
  return cn(
    'relative overflow-hidden group flex flex-col engineer-kpi-card',
    'w-full max-w-md',
    'p-4 rounded-xl backdrop-blur-md',
    gradients.card,
    borderClasses[color] || borderClasses.blue,
    'shadow-xl hover:shadow-2xl',
    getShadowClasses(color, isDark),
    'transition-all duration-300 ease-out',
    'hover:scale-[1.02] hover:-translate-y-1',
    'before:absolute before:inset-0 before:rounded-xl before:p-[1px]',
    'before:bg-gradient-to-br before:opacity-0 hover:before:opacity-100',
    'before:transition-opacity before:duration-500',
    color === 'blue' && 'before:from-blue-400/20 before:via-blue-500/10 before:to-transparent',
    color === 'orange' && 'before:from-orange-400/20 before:via-orange-500/10 before:to-transparent',
    color === 'purple' && 'before:from-purple-400/20 before:via-purple-500/10 before:to-transparent'
  );
};

/**
 * Get decorative overlay classes
 * @param {string} color - Color name
 * @returns {string} Combined className string
 */
export const getDecorativeOverlayClasses = (color) => {
  const gradients = getKPICardGradient(color, true);
  return cn(
    'absolute inset-0 opacity-40 pointer-events-none',
    'bg-gradient-to-br transition-opacity duration-700',
    gradients.overlay,
    'group-hover:opacity-50'
  );
};

/**
 * Get glow effect classes
 * @param {string} color - Color name
 * @returns {string} Combined className string
 */
export const getGlowClasses = (color) => {
  const gradients = getKPICardGradient(color, true);
  return cn(
    'absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none',
    'opacity-30 group-hover:opacity-50 transition-all duration-700',
    'animate-pulse',
    gradients.glow
  );
};

/**
 * Get section container classes (for breakdowns, stats, etc.)
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getSectionContainerClasses = (color, isDark) => {
  const badgeClasses = getBadgeClasses(color, isDark);
  return cn(
    'mb-3 p-2.5 rounded-lg',
    'backdrop-blur-sm',
    'transition-all duration-300',
    'hover:scale-[1.01] hover:shadow-md',
    badgeClasses.bg,
    badgeClasses.border,
    'border-opacity-60 hover:border-opacity-100'
  );
};

/**
 * Get progress bar background classes
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getProgressBarBgClasses = (isDark) => {
  return cn(
    'w-full h-2.5 rounded-full overflow-hidden relative',
    'shadow-inner backdrop-blur-sm',
    'transition-all duration-300',
    isDark ? 'bg-slate-700/50 ring-1 ring-slate-600/30' : 'bg-gray-300/80 ring-1 ring-gray-400/20'
  );
};

/**
 * Get badge item classes
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getBadgeItemClasses = (color, isDark) => {
  const badgeClasses = getBadgeClasses(color, isDark);
  return cn(
    'flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg',
    'backdrop-blur-sm transition-all duration-300',
    'hover:scale-[1.02] hover:shadow-md',
    badgeClasses.bg,
    badgeClasses.border
  );
};

/**
 * Get insight button classes
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getInsightButtonClasses = (color, isDark) => {
  const colorClasses = {
    blue: isDark ? 'text-blue-200/70 hover:text-blue-300' : 'text-blue-600/70 hover:text-blue-700',
    orange: isDark ? 'text-orange-200/70 hover:text-orange-300' : 'text-orange-600/70 hover:text-orange-700',
    purple: isDark ? 'text-purple-200/70 hover:text-purple-300' : 'text-purple-600/70 hover:text-purple-700'
  };
  
  return cn(
    'transition-all duration-300 p-2 rounded-lg hover:scale-110',
    colorClasses[color] || colorClasses.blue,
    isDark ? `hover:bg-${color}-500/20 bg-${color}-500/10 border border-${color}-400/20 hover:border-${color}-400/40` : 'hover:bg-gray-100 bg-gray-50 border-none'
  );
};
