/**
 * Reusable Page State Hook
 * Common state management for pages with search, filter, pagination, and CRUD
 */
import { useState, useMemo, useEffect } from 'react';

/**
 * Generic page state hook
 * @param {Object} config - Configuration object
 * @param {Array} config.data - Data array
 * @param {Object} config.searchConfig - Search configuration
 * @param {Object} config.filterConfig - Filter configuration
 * @param {Object} config.paginationConfig - Pagination configuration
 * @returns {Object} Page state and handlers
 */
export function usePageState(config = {}) {
  const {
    data = [],
    searchConfig = {},
    filterConfig = {},
    paginationConfig = {},
  } = config;

  const {
    searchFields = [],
    debounceMs = 300,
  } = searchConfig;

  const {
    defaultFilter = 'all',
    filters = [],
  } = filterConfig;

  const {
    defaultItemsPerPage = 50,
    enablePagination = true,
  } = paginationConfig;

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Filter state
  const [filterBy, setFilterBy] = useState(defaultFilter);
  const [filterValue, setFilterValue] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (enablePagination) {
        setCurrentPage(1); // Reset to first page on search
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs, enablePagination]);

  // Reset page when filter changes
  useEffect(() => {
    if (enablePagination) {
      setCurrentPage(1);
    }
  }, [filterBy, filterValue, enablePagination]);

  // Filtered data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (debouncedSearch && searchFields.length > 0) {
      const search = debouncedSearch.toLowerCase();
      result = result.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && String(value).toLowerCase().includes(search);
        })
      );
    }

    // Apply filter
    if (filterBy !== 'all' && filterValue) {
      const activeFilter = filters.find(f => f.key === filterBy);
      if (activeFilter) {
        result = result.filter(item => {
          const field = activeFilter.field || filterBy;
          return item[field] === filterValue;
        });
      }
    }

    return result;
  }, [data, debouncedSearch, searchFields, filterBy, filterValue, filters]);

  // Paginated data
  const paginatedData = useMemo(() => {
    if (!enablePagination) {
      return filteredData;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage, enablePagination]);

  // Pagination info
  const paginationInfo = useMemo(() => {
    if (!enablePagination) {
      return null;
    }

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startItem = filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, filteredData.length);

    return {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems: filteredData.length,
      startItem,
      endItem,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1,
    };
  }, [filteredData.length, currentPage, itemsPerPage, enablePagination]);

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterBy(defaultFilter);
    setFilterValue('');
    setCurrentPage(1);
  };

  return {
    // Search
    searchTerm,
    setSearchTerm,
    debouncedSearch,

    // Filter
    filterBy,
    setFilterBy,
    filterValue,
    setFilterValue,

    // Pagination
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    paginationInfo,

    // Fullscreen
    isFullscreen,
    toggleFullscreen,

    // Data
    filteredData,
    paginatedData,

    // Utilities
    resetFilters,
  };
}

