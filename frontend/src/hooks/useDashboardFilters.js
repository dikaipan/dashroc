/**
 * Custom hook for dashboard filtering logic
 * Separates business logic from UI component
 */
import { useMemo } from 'react';
import { normalizeText, toTitleCase } from '../utils/textUtils';
import { groupByField } from '../utils/dashboardUtils';

/**
 * Hook for filtering engineers and machines based on category and filterValue
 * @param {Array} engineers - Array of engineer objects
 * @param {Array} machines - Array of machine objects
 * @param {string} category - Filter category (REGION, VENDOR, AREA GROUP)
 * @param {string} filterValue - Selected filter value
 * @returns {Object} Filtered data and filter options
 */
export function useDashboardFilters(engineers, machines, category, filterValue) {
  // Generate filter options based on category
  const options = useMemo(() => {
    let options = [];
    
    if (category === "REGION") {
      // Hanya tampilkan Region 1, 2, dan 3
      options = ["Region 1", "Region 2", "Region 3"];
    } else if (category === "VENDOR") {
      // Hanya ambil dari engineers, bukan dari customer machines
      const engineerVendors = engineers.map((r) => r.vendor).filter(Boolean);
      options = engineerVendors;
    } else if (category === "AREA GROUP") {
      const engineerAreaGroups = engineers.map((r) => r.area_group).filter(Boolean);
      const machineAreaGroups = machines.map((r) => r.area_group).filter(Boolean);
      options = [...engineerAreaGroups, ...machineAreaGroups];
      
      // Use utility for normalization
      const normalizedMap = new Map();
      options.forEach(opt => {
        const normalized = normalizeText(opt);
        if (!normalizedMap.has(normalized)) {
          normalizedMap.set(normalized, toTitleCase(normalized));
        }
      });
      
      options = Array.from(normalizedMap.values());
    }
    
    const uniqueOptions = [...new Set(options)].filter(Boolean);
    
    return uniqueOptions.sort((a, b) => {
      if (category === "REGION") {
        const regionOrder = ["Region 1", "Region 2", "Region 3"];
        const aIndex = regionOrder.indexOf(a);
        const bIndex = regionOrder.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
      }
      return a.localeCompare(b);
    });
  }, [engineers, machines, category]);

  // Filter engineers based on category and filterValue
  const filteredEngineers = useMemo(() => {
    if (!filterValue) return engineers;
    const key = category === "REGION" ? "region" : category === "VENDOR" ? "vendor" : "area_group";
    
    if (category === "AREA GROUP") {
      // Pattern matching: "Surabaya" akan match dengan "Surabaya 1", "Surabaya 2", dll
      return engineers.filter((r) => {
        const value = r[key]?.toLowerCase().trim().replace(/\s+/g, ' ');
        const filter = filterValue.toLowerCase().trim();
        // Hapus angka di akhir untuk matching
        const valueBase = value.replace(/\s+\d+$/, '');
        return valueBase === filter;
      });
    }
    
    return engineers.filter((r) => r[key] === filterValue);
  }, [engineers, category, filterValue]);

  // Filter machines based on category and filterValue
  const filteredMachines = useMemo(() => {
    if (!filterValue) return machines;
    if (category === "REGION") {
      // Filter berdasarkan region engineer yang terkait dengan machine
      // Atau gunakan area_group sebagai proxy untuk region jika tidak ada mapping
      // Asumsi: machines memiliki field region atau kita filter berdasarkan engineer region
      return machines.filter((machine) => {
        // Cari engineer yang sesuai dengan machine ini
        const relatedEngineer = engineers.find(eng => 
          eng.area_group === machine.area_group || 
          eng.vendor === machine.customer
        );
        return relatedEngineer?.region === filterValue || machine.region === filterValue;
      });
    } else if (category === "VENDOR") {
      return machines.filter((r) => r.customer === filterValue);
    } else if (category === "AREA GROUP") {
      // Pattern matching: "Surabaya" akan match dengan "Surabaya 1", "Surabaya 2", dll
      return machines.filter((r) => {
        const value = r.area_group?.toLowerCase().trim().replace(/\s+/g, ' ');
        const filter = filterValue.toLowerCase().trim();
        // Hapus angka di akhir untuk matching
        const valueBase = value.replace(/\s+\d+$/, '');
        return valueBase === filter;
      });
    }
    return machines;
  }, [machines, engineers, category, filterValue]);

  // Aggregated data for charts
  const machinesByRegion = useMemo(() => 
    groupByField(machines, 'provinsi', 'Unknown'),
    [machines]
  );

  const engineersByRegion = useMemo(() => 
    groupByField(engineers, 'region', 'Unknown'),
    [engineers]
  );

  const machinesByAreaGroup = useMemo(() => 
    groupByField(machines, 'area_group', 'Unknown'),
    [machines]
  );

  return {
    options,
    filteredEngineers,
    filteredMachines,
    machinesByRegion,
    engineersByRegion,
    machinesByAreaGroup
  };
}

