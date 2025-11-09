/**
 * Custom hook for dashboard chart data calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';
import { parseInstallYear, objectToChartData } from '../utils/dashboardUtils';

/**
 * Hook for calculating chart data
 * @param {Array} filteredEngineers - Filtered engineer array
 * @param {Array} filteredMachines - Filtered machine array
 * @returns {Object} Chart data objects
 */
export function useDashboardCharts(filteredEngineers, filteredMachines) {
  // Experience distribution data
  const experienceData = useMemo(() => {
    const experienceRanges = {
      '0-2 years': 0,
      '3-5 years': 0,
      '6-10 years': 0,
      '10+ years': 0
    };
    
    filteredEngineers.forEach(engineer => {
      const experience = engineer.experience || 0;
      if (experience <= 2) experienceRanges['0-2 years']++;
      else if (experience <= 5) experienceRanges['3-5 years']++;
      else if (experience <= 10) experienceRanges['6-10 years']++;
      else experienceRanges['10+ years']++;
    });
    
    return Object.entries(experienceRanges).map(([range, count]) => ({
      range,
      count
    }));
  }, [filteredEngineers]);

  // Skills distribution data
  const skillsData = useMemo(() => {
    const skillCounts = {};
    filteredEngineers.forEach(engineer => {
      const skills = engineer.skills || [];
      skills.forEach(skill => {
        skillCounts[skill] = (skillCounts[skill] || 0) + 1;
      });
    });
    
    return Object.entries(skillCounts)
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredEngineers]);

  // Training status data
  const trainingData = useMemo(() => {
    const trainingStatus = {
      'Completed': 0,
      'In Progress': 0,
      'Not Started': 0
    };
    
    filteredEngineers.forEach(engineer => {
      const status = engineer.training_status || 'Not Started';
      if (trainingStatus.hasOwnProperty(status)) {
        trainingStatus[status]++;
      }
    });
    
    return Object.entries(trainingStatus).map(([name, value]) => ({
      name,
      value
    }));
  }, [filteredEngineers]);

  // Warranty status data
  const warrantyData = useMemo(() => {
    // Initialize warranty status counters
    const statusCounts = {
      'In Warranty': 0,
      'Out Of Warranty': 0
    };
    
    // Count machines by warranty status
    filteredMachines.forEach(machine => {
      const status = machine.machine_status || 'Unknown';
      
      // Hanya proses yang ada kata 'Warranty'
      if (status.includes('Warranty')) {
        if (status === 'Out Of Warranty') {
          statusCounts['Out Of Warranty']++;
        } else {
          statusCounts['In Warranty']++;
        }
      }
    });
    
    // Convert ke format chart menggunakan helper
    return objectToChartData(statusCounts, 'name', 'value');
  }, [filteredMachines]);

  // Machine age distribution data
  const machineAgeData = useMemo(() => {
    const currentYear = new Date().getFullYear();  // Tahun sekarang untuk kalkulasi age
    
    // Initialize age buckets
    const ageGroups = {
      '0-1 year': 0,
      '1-2 years': 0,
      '2-3 years': 0,
      '3-4 years': 0,
      '4+ years': 0
    };
    
    // Loop setiap machine dan hitung age-nya
    filteredMachines.forEach(machine => {
      // Skip machine tanpa info tanggal instalasi
      if (machine.instal_date || machine.year) {
        const installYearStr = parseInstallYear(machine);
        
        if (installYearStr) {
          const installYear = parseInt(installYearStr);
          
          // Kalkulasi age dan kategorikan jika installYear valid
          if (!isNaN(installYear)) {
            const age = currentYear - installYear;
            
            // Bucket assignment berdasarkan age
            if (age <= 1) ageGroups['0-1 year']++;
            else if (age <= 2) ageGroups['1-2 years']++;
            else if (age <= 3) ageGroups['2-3 years']++;
            else if (age <= 4) ageGroups['3-4 years']++;
            else ageGroups['4+ years']++;
          }
        }
      }
    });
    
    // Transform object ke array format untuk bar chart
    return Object.entries(ageGroups).map(([range, count]) => ({
      range,   // x-axis label
      count    // y-axis value (bar height)
    }));
  }, [filteredMachines]);

  // Installation Year Distribution
  const installYearData = useMemo(() => {
    const yearCounts = {};
    
    filteredMachines.forEach(machine => {
      const installYear = parseInstallYear(machine);
      
      if (installYear) {
        yearCounts[installYear] = (yearCounts[installYear] || 0) + 1;
      }
    });
    
    return Object.entries(yearCounts)
      .map(([year, count]) => ({ year, count }))
      .sort((a, b) => a.year.localeCompare(b.year));
  }, [filteredMachines]);

  return {
    experienceData,
    skillsData,
    trainingData,
    warrantyData,
    machineAgeData,
    installYearData
  };
}

