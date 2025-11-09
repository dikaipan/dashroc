/**
 * Custom hook for dashboard KPI calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';

/**
 * Hook for calculating dashboard KPIs
 * @param {Array} filteredMachines - Filtered machine array
 * @param {Array} filteredEngineers - Filtered engineer array
 * @param {Array} allMachines - All machines array
 * @param {Array} allEngineers - All engineers array
 * @param {string} category - Current filter category
 * @param {string} filterValue - Current filter value
 * @returns {Object} KPI data
 */
export function useDashboardKPIs(
  filteredMachines,
  filteredEngineers,
  allMachines,
  allEngineers,
  category,
  filterValue
) {
  return useMemo(() => {
    // Label filter yang sedang aktif (untuk subtitle di KPI card)
    const currentFilter = filterValue || `All ${category}s`;
    
    // Jumlah mesin dan engineer yang terfilter (angka utama di KPI card)
    const currentMachines = filteredMachines.length;
    const currentEngineers = filteredEngineers.length;
    
    // Total keseluruhan tanpa filter (untuk perbandingan di chart)
    const totalMachines = allMachines.length;
    const totalEngineers = allEngineers.length;
    
    /**
     * currentRatio - Rasio mesin per engineer
     * 
     * Metrik penting untuk mengukur beban kerja engineer.
     * Formula: Total Mesin / Total Engineer
     * 
     * Interpretasi:
     * - < 60: Good (beban kerja rendah)
     * - 60-120: Moderate (beban kerja normal)
     * - > 120: High (overload, perlu tambah engineer)
     */
    const currentRatio = currentEngineers > 0 ? currentMachines / currentEngineers : 0;
    
    // Efficiency status based on ratio
    const efficiencyStatus = currentRatio < 60 ? 'Baik' : currentRatio < 120 ? 'Sedang' : 'Tinggi';
    const efficiencyColor = currentRatio < 60 ? 'text-green-300' : currentRatio < 120 ? 'text-yellow-300' : 'text-red-300';
    const efficiencyEmoji = currentRatio < 60 ? '✅' : currentRatio < 120 ? '⚠️' : '🔴';
    const efficiencyPercentage = currentRatio < 60 ? '75%' : currentRatio < 120 ? '45%' : '25%';
    const loadPercentage = currentRatio < 60 ? '25%' : currentRatio < 120 ? '55%' : '75%';
    const efficiencyWidth = currentRatio < 60 ? '75%' : currentRatio < 120 ? '45%' : '25%';
    const loadWidth = currentRatio < 60 ? '25%' : currentRatio < 120 ? '55%' : '75%';
    
    return {
      currentFilter,
      currentMachines,
      currentEngineers,
      totalMachines,
      totalEngineers,
      currentRatio,
      efficiencyStatus,
      efficiencyColor,
      efficiencyEmoji,
      efficiencyPercentage,
      loadPercentage,
      efficiencyWidth,
      loadWidth
    };
  }, [filteredMachines, filteredEngineers, allMachines, allEngineers, category, filterValue]);
}

