/**
 * Custom hook for engineer filtering and sorting logic
 * Separates business logic from UI component
 */
import { useMemo } from 'react';
import { parseExperience } from '../utils/textUtils';

/**
 * Hook for filtering and sorting engineers
 * @param {Array} engineers - Array of engineer objects
 * @param {Object} filters - Filter configuration
 * @param {string} filters.searchTerm - Search term
 * @param {string} filters.sortBy - Sort field (experience, region, vendor, area_group)
 * @param {string} filters.sortValue - Sort value for filtering
 * @returns {Array} Filtered and sorted engineers
 */
export function useEngineerFilters(engineers, { searchTerm, sortBy, sortValue }) {
  return useMemo(() => {
    let filtered = engineers;

    // Filter by sortValue (when a category dropdown value is selected)
    if (sortValue) {
      if (sortBy === "region") {
        filtered = filtered.filter((eng) => eng.region === sortValue);
      } else if (sortBy === "vendor") {
        filtered = filtered.filter((eng) => eng.vendor === sortValue);
      } else if (sortBy === "area_group") {
        filtered = filtered.filter((eng) => eng.area_group === sortValue);
      }
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((eng) =>
        eng.name?.toLowerCase().includes(term) ||
        eng.area_group?.toLowerCase().includes(term) ||
        eng.region?.toLowerCase().includes(term) ||
        eng.vendor?.toLowerCase().includes(term) ||
        eng.id?.toLowerCase().includes(term)
      );
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === "experience") {
        const expA = parseExperience(a.years_experience);
        const expB = parseExperience(b.years_experience);
        return expB - expA; // Descending order
      } else if (sortBy === "region") {
        return a.region?.localeCompare(b.region || "") || 0;
      } else if (sortBy === "vendor") {
        return a.vendor?.localeCompare(b.vendor || "") || 0;
      } else if (sortBy === "area_group") {
        return a.area_group?.localeCompare(b.area_group || "") || 0;
      }
      return 0;
    });

    return filtered;
  }, [engineers, searchTerm, sortBy, sortValue]);
}

