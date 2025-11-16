// src/utils/themeUtils.js
// Theme utility functions for consistent styling across the app
import { cn } from '../constants/styles';

/**
 * Get theme-aware gradient classes for KPI cards
 * @param {string} color - Color name (blue, orange, purple)
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getKPICardGradient = (color, isDark) => {
  const gradients = {
    blue: {
      dark: 'bg-gradient-to-br from-slate-800/90 via-blue-900/30 to-slate-800/90',
      light: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100',
      overlay: 'bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5',
      glow: 'bg-blue-400/10'
    },
    orange: {
      dark: 'bg-gradient-to-br from-slate-800/90 via-orange-900/30 to-slate-800/90',
      light: 'bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100',
      overlay: 'bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5',
      glow: 'bg-orange-400/10'
    },
    purple: {
      dark: 'bg-gradient-to-br from-slate-800/90 via-purple-900/30 to-slate-800/90',
      light: 'bg-gradient-to-br from-purple-50 via-indigo-50 to-purple-100',
      overlay: 'bg-gradient-to-br from-purple-500/5 via-transparent to-indigo-500/5',
      glow: 'bg-purple-400/10'
    }
  };
  
  const colorGradients = gradients[color] || gradients.blue;
  return {
    card: isDark ? colorGradients.dark : colorGradients.light,
    overlay: colorGradients.overlay,
    glow: colorGradients.glow
  };
};

/**
 * Get theme-aware text gradient classes
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getTextGradient = (color, isDark) => {
  const gradients = {
    blue: {
      dark: 'bg-gradient-to-r from-blue-400 to-indigo-400',
      light: 'bg-gradient-to-r from-blue-600 to-indigo-600'
    },
    orange: {
      dark: 'bg-gradient-to-r from-orange-400 to-amber-400',
      light: 'bg-gradient-to-r from-orange-600 to-amber-600'
    },
    purple: {
      dark: 'bg-gradient-to-r from-purple-400 to-indigo-400',
      light: 'bg-gradient-to-r from-purple-600 to-indigo-600'
    }
  };
  
  const colorGradients = gradients[color] || gradients.blue;
  return cn(
    'bg-clip-text text-transparent rounded',
    isDark ? colorGradients.dark : colorGradients.light
  );
};

/**
 * Get theme-aware badge/box classes
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getBadgeClasses = (color, isDark) => {
  const badges = {
    blue: {
      bg: isDark ? 'bg-blue-500/10' : 'bg-blue-100/60',
      border: isDark ? 'border border-blue-400/20' : 'border-none',
      text: isDark ? 'text-blue-200' : 'text-blue-700',
      icon: isDark ? 'text-blue-300' : 'text-blue-600'
    },
    orange: {
      bg: isDark ? 'bg-orange-500/10' : 'bg-orange-100/60',
      border: isDark ? 'border border-orange-400/20' : 'border-none',
      text: isDark ? 'text-orange-200' : 'text-orange-700',
      icon: isDark ? 'text-orange-300' : 'text-orange-600'
    },
    purple: {
      bg: isDark ? 'bg-purple-500/10' : 'bg-purple-100/60',
      border: isDark ? 'border border-purple-400/20' : 'border-none',
      text: isDark ? 'text-purple-200' : 'text-purple-700',
      icon: isDark ? 'text-purple-300' : 'text-purple-600'
    }
  };
  
  return badges[color] || badges.blue;
};

/**
 * Get theme-aware icon box classes
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Combined className string
 */
export const getIconBoxClasses = (color, isDark) => {
  const iconBoxes = {
    blue: isDark 
      ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20' 
      : 'bg-gradient-to-br from-blue-100/70 to-indigo-100/70',
    orange: isDark 
      ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20' 
      : 'bg-gradient-to-br from-orange-100/70 to-amber-100/70',
    purple: isDark 
      ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20' 
      : 'bg-gradient-to-br from-purple-100/70 to-indigo-100/70'
  };
  
  return cn(
    'w-14 h-14 rounded-xl flex items-center justify-center border-none shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl backdrop-blur-sm',
    iconBoxes[color] || iconBoxes.blue
  );
};

/**
 * Get theme-aware shadow classes
 * @param {string} color - Color name
 * @param {boolean} isDark - Dark mode flag
 * @returns {string} Shadow className
 */
export const getShadowClasses = (color, isDark) => {
  const shadows = {
    blue: isDark ? 'shadow-blue-500/10' : 'shadow-blue-500/5',
    orange: isDark ? 'shadow-orange-500/10' : 'shadow-orange-500/5',
    purple: isDark ? 'shadow-purple-500/10' : 'shadow-purple-500/5'
  };
  
  return shadows[color] || shadows.blue;
};
