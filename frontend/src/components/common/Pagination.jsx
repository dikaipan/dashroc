/**
 * Shared Pagination Component
 * Provides consistent pagination UI across all pages
 * 
 * @module Pagination
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';

/**
 * Standard pagination component
 * @param {Object} props
 * @param {number} props.currentPage - Current page number
 * @param {number} props.totalPages - Total number of pages
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.itemsPerPage - Number of items per page
 * @param {Function} props.onPageChange - Callback when page changes
 * @param {string} props.itemLabel - Label for items (e.g., 'mesin', 'engineers')
 */
export function Pagination({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  itemLabel = 'item'
}) {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-700 flex-shrink-0 bg-slate-800/50">
      <div className="text-xs sm:text-sm text-slate-400 text-center sm:text-left">
        Menampilkan <span className="font-semibold text-slate-300">{startIndex}</span> - <span className="font-semibold text-slate-300">{endIndex}</span> dari <span className="font-semibold text-slate-300">{totalItems.toLocaleString()}</span> {itemLabel}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} className="text-slate-300" />
        </button>
        <span className="text-xs sm:text-sm text-slate-300 px-2">
          Halaman {currentPage} dari {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Next page"
        >
          <ChevronRight size={16} className="text-slate-300" />
        </button>
      </div>
    </div>
  );
}
