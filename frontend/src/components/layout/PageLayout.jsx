/**
 * Reusable Page Layout Component
 * Provides consistent page structure with header, content area, and optional actions
 */
import React from 'react';
import { Maximize2, Minimize2 } from 'react-feather';

export default function PageLayout({
  title,
  subtitle,
  children,
  actions,
  isFullscreen = false,
  onToggleFullscreen,
  className = '',
  headerClassName = '',
}) {
  return (
    <div className={`p-3 sm:p-6 space-y-4 sm:space-y-6 min-h-screen ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 overflow-auto' : ''}`}>
      {/* Page Header */}
      {(title || actions || onToggleFullscreen) && (
        <div className={`flex items-center justify-between flex-wrap gap-3 sm:gap-4 ${headerClassName}`}>
          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 mb-1 truncate">{title}</h1>
            )}
            {subtitle && (
              <p className="text-xs sm:text-sm text-slate-400 mt-1">{subtitle}</p>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {actions && (
              <div className="flex items-center gap-2 flex-wrap">
                {actions}
              </div>
            )}
            
            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-slate-100 border border-slate-700"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Page Content */}
      <div className="space-y-4 sm:space-y-6">
        {children}
      </div>
    </div>
  );
}

