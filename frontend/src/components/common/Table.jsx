/**
 * Shared Table Component
 * Provides consistent table styling and behavior across all pages
 * 
 * @module Table
 */

import React from 'react';

/**
 * Standard table wrapper with consistent styling
 */
export function Table({ children, className = '' }) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full min-w-[800px] ${className}`}>
        {children}
      </table>
    </div>
  );
}

/**
 * Standard table header with sticky positioning and backdrop blur
 */
export function TableHeader({ children, className = '' }) {
  return (
    <thead className={`bg-slate-900/95 backdrop-blur-sm sticky top-0 z-10 ${className}`}>
      {children}
    </thead>
  );
}

/**
 * Standard table header cell
 */
export function TableHeaderCell({ children, className = '', sticky = false, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const stickyClass = sticky ? 'sticky bg-slate-900/95 backdrop-blur-sm z-20' : '';
  
  return (
    <th className={`px-3 sm:px-4 py-2.5 sm:py-3 ${alignClass} text-xs font-semibold text-slate-300 uppercase tracking-wider border-b border-slate-700 ${stickyClass} ${className}`}>
      {children}
    </th>
  );
}

/**
 * Standard table body
 */
export function TableBody({ children, className = '' }) {
  return (
    <tbody className={`divide-y divide-slate-700/50 ${className}`}>
      {children}
    </tbody>
  );
}

/**
 * Standard table row with alternating colors
 */
export function TableRow({ children, index, className = '', onClick }) {
  const bgClass = index % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-800/30';
  const cursorClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <tr 
      className={`hover:bg-slate-700/40 transition-colors ${bgClass} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

/**
 * Standard table cell
 */
export function TableCell({ children, className = '', sticky = false, align = 'left' }) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  const stickyClass = sticky ? 'sticky bg-slate-800/95 backdrop-blur-sm z-10' : '';
  
  return (
    <td className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm ${alignClass} ${stickyClass} ${className}`}>
      {children}
    </td>
  );
}

/**
 * Empty state row
 */
export function TableEmptyState({ colSpan, message = 'Tidak ada data ditemukan', subMessage = 'Coba ubah filter atau hapus beberapa filter untuk melihat hasil', onClearFilters, showClearButton = false }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="text-5xl">📭</div>
          <div>
            <p className="text-sm font-semibold text-slate-200 mb-1">{message}</p>
            <p className="text-xs text-slate-400">{subMessage}</p>
          </div>
          {showClearButton && onClearFilters && (
            <button
              onClick={onClearFilters}
              className="mt-2 px-4 py-2 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
            >
              Hapus Semua Filter
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

