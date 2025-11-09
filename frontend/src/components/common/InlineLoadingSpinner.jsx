/**
 * Inline Loading Spinner Component
 * Small spinner that appears in the center without covering the page
 */
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

const InlineLoadingSpinner = ({ size = 'md', message = null }) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-14 h-14 border-4'
  };

  const spinnerColor = isDark 
    ? 'border-slate-600 border-t-cyan-400' 
    : 'border-gray-300 border-t-blue-600';

  const textColor = isDark ? 'text-slate-300' : 'text-gray-700';

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] pointer-events-none">
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative">
          <div 
            className={`${sizeClasses[size]} ${spinnerColor} rounded-full animate-spin`}
            style={{ 
              boxShadow: isDark 
                ? '0 0 20px rgba(34, 211, 238, 0.3)' 
                : '0 0 20px rgba(37, 99, 235, 0.3)'
            }}
          ></div>
        </div>
        {message && (
          <div className={`text-sm font-medium ${textColor} animate-pulse bg-opacity-90 px-3 py-1.5 rounded-lg ${
            isDark ? 'bg-slate-800/90' : 'bg-white/90'
          } shadow-lg`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default InlineLoadingSpinner;

