/**
 * Custom hook for stock part filtering logic
 * Separates business logic from UI component
 */
import { useMemo } from 'react';

/**
 * Hook for filtering stock parts
 * @param {Array} stockParts - Array of stock part objects
 * @param {Array} validParts - Array of valid parts (excluding region rows)
 * @param {string} searchQuery - Search query string
 * @param {string} sortBy - Sort field ('all' or 'city')
 * @param {string} sortValue - Sort value for filtering
 * @returns {Object} Filtered parts and related data
 */
export function useStockPartFilters(stockParts, validParts, { searchQuery, sortBy, sortValue }) {
  // Filter parts based on FSL selection
  const filteredStockParts = useMemo(() => {
    if (sortBy === 'all' || !sortValue) return stockParts;
    
    // Filter parts by checking stock in selected FSL
    return stockParts.filter(part => {
      const partNumber = part.part_number || part['part number'] || '';
      if (partNumber.toLowerCase() === 'region') return false; // Skip region row
      
      // Get all FSL columns
      const fslColumns = Object.keys(part).filter(col => 
        col.toLowerCase().includes('idfsl') || col.toLowerCase().includes('idccw')
      );
      
      // Check if part has stock in selected FSL
      return fslColumns.some(col => {
        if (sortBy === 'city') {
          return col.toLowerCase().includes(sortValue.toLowerCase().substring(0, 5)) && parseInt(part[col] || 0) > 0;
        }
        return false;
      });
    });
  }, [stockParts, sortBy, sortValue]);

  // Filtered and searched parts
  const filteredParts = useMemo(() => {
    if (!searchQuery) return validParts;
    
    const query = searchQuery.toLowerCase();
    return validParts.filter(part => {
      const partNumber = (part.part_number || part['part number'] || '').toLowerCase();
      const partName = (part.part_name || part['part name'] || '').toLowerCase();
      const typeOfPart = (part.type_of_part || part['type of part'] || '').toLowerCase();
      
      return partNumber.includes(query) || partName.includes(query) || typeOfPart.includes(query);
    });
  }, [validParts, searchQuery]);

  return {
    filteredStockParts,
    filteredParts
  };
}

