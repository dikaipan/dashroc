/**
 * Custom hook for pagination logic
 * Handles pagination state, page calculation, and reset on filter changes
 * 
 * @param {Array} items - Array of items to paginate
 * @param {number} itemsPerPage - Number of items per page
 * @param {Array} resetDependencies - Dependencies that should reset page to 1 when changed
 * @returns {Object} Pagination state and helpers
 */
import { useState, useEffect, useMemo, useCallback } from 'react';

export function usePagination(items = [], itemsPerPage = 10, resetDependencies = []) {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 when dependencies change
  useEffect(() => {
    setCurrentPage(1);
  }, resetDependencies);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Get paginated items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, currentPage, itemsPerPage]);

  // Navigation helpers
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  // Check if pagination is needed
  const hasPagination = useMemo(() => {
    return items.length > itemsPerPage;
  }, [items.length, itemsPerPage]);

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedItems,
    totalItems: items.length,
    hasPagination,
    goToPage,
    nextPage,
    prevPage,
    goToFirstPage,
    goToLastPage,
    setCurrentPage
  };
}

