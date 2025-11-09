/**
 * Custom hook for Decision page data calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';

/**
 * Hook for calculating decision analysis data
 * @param {Array} engineers - Array of engineer objects
 * @param {Array} machines - Array of machine objects
 * @returns {Object} Analysis data objects
 */
export function useDecisionData(engineers, machines) {
  // Top engineers performance data
  const topEngineersData = useMemo(() => {
    if (!engineers.length) return [];
    
    return engineers
      .map(eng => ({
        name: eng.name || 'Unknown',
        experience: parseInt(eng.experience) || 0,
        training: eng.training_completion === 'completed' ? 100 : 50,
        skills: eng.skill_level === 'Advanced' ? 90 : eng.skill_level === 'Intermediate' ? 70 : 50,
        machines: machines.filter(m => m.engineer_name === eng.name).length,
        performance: Math.min(100, (parseInt(eng.experience) || 0) * 10 + (eng.training_completion === 'completed' ? 20 : 0))
      }))
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);
  }, [engineers, machines]);

  // Machine performance data
  const machinePerformanceData = useMemo(() => {
    if (!machines.length) return [];
    
    const machineTypes = {};
    machines.forEach(m => {
      const type = m.machine_type || 'Unknown';
      if (!machineTypes[type]) {
        machineTypes[type] = {
          type,
          total: 0,
          onWarranty: 0,
          avgAge: 0,
          ages: []
        };
      }
      machineTypes[type].total++;
      if (m.machine_status === 'On Warranty' || m.machine_status === 'In Warranty') {
        machineTypes[type].onWarranty++;
      }
      const age = new Date().getFullYear() - (parseInt(m.year) || new Date().getFullYear());
      machineTypes[type].ages.push(age);
    });

    return Object.values(machineTypes)
      .map(mt => ({
        type: mt.type,
        total: mt.total,
        warrantyRate: ((mt.onWarranty / mt.total) * 100).toFixed(1),
        avgAge: (mt.ages.reduce((a, b) => a + b, 0) / mt.ages.length).toFixed(1),
        score: (mt.onWarranty / mt.total) * 50 + (10 - (mt.ages.reduce((a, b) => a + b, 0) / mt.ages.length)) * 5
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [machines]);

  // Regional comparison data
  const regionalComparisonData = useMemo(() => {
    if (!engineers.length || !machines.length) return [];

    const regions = {};
    engineers.forEach(eng => {
      const region = eng.region || 'Unknown';
      if (!regions[region]) {
        regions[region] = { region, engineers: 0, machines: 0, avgExp: 0, expSum: 0 };
      }
      regions[region].engineers++;
      regions[region].expSum += parseInt(eng.experience) || 0;
    });

    machines.forEach(m => {
      const region = m.region || 'Unknown';
      if (!regions[region]) {
        regions[region] = { region, engineers: 0, machines: 0, avgExp: 0, expSum: 0 };
      }
      regions[region].machines++;
    });

    return Object.values(regions)
      .map(r => ({
        region: r.region,
        engineers: r.engineers,
        machines: r.machines,
        avgExp: r.engineers > 0 ? (r.expSum / r.engineers).toFixed(1) : 0,
        ratio: r.engineers > 0 ? (r.machines / r.engineers).toFixed(1) : 0,
        efficiency: r.engineers > 0 ? Math.min(100, (r.machines / r.engineers) * 20) : 0
      }))
      .sort((a, b) => b.efficiency - a.efficiency)
      .slice(0, 5);
  }, [engineers, machines]);

  // Distance analysis data
  const distanceAnalysisData = useMemo(() => {
    if (!engineers.length || !machines.length) return [];

    const engineerDistanceMap = engineers.map(eng => {
      const engineerZone = eng.zone || eng.area_group || 'Unknown';
      const assignedMachines = machines.filter(m => m.engineer_name === eng.name);
      
      let sameZone = 0;
      let nearZone = 0;
      let farZone = 0;
      
      assignedMachines.forEach(m => {
        const machineZone = m.zone || m.area_group || 'Unknown';
        if (machineZone === engineerZone) {
          sameZone++;
        } else if (Math.abs((machineZone.match(/\d+/) || [0])[0] - (engineerZone.match(/\d+/) || [0])[0]) <= 1) {
          nearZone++;
        } else {
          farZone++;
        }
      });

      return {
        engineer: eng.name,
        zone: engineerZone,
        sameZone,
        nearZone,
        farZone,
        total: assignedMachines.length,
        distanceScore: sameZone * 1 + nearZone * 2 + farZone * 4 // Lower is better
      };
    }).filter(e => e.total > 0).sort((a, b) => b.distanceScore - a.distanceScore).slice(0, 6);

    return engineerDistanceMap;
  }, [engineers, machines]);

  // Zone optimization data
  const zoneOptimizationData = useMemo(() => {
    if (!machines.length) return [];

    const zoneStats = {};
    machines.forEach(m => {
      const zone = m.zone || m.area_group || 'Unknown';
      if (!zoneStats[zone]) {
        zoneStats[zone] = {
          zone,
          machines: 0,
          engineersAssigned: new Set(),
          needsAttention: 0
        };
      }
      zoneStats[zone].machines++;
      if (m.engineer_name) {
        zoneStats[zone].engineersAssigned.add(m.engineer_name);
      }
      if (m.machine_status === 'Out Of Warranty' || m.maintenance_status?.includes('Pending')) {
        zoneStats[zone].needsAttention++;
      }
    });

    return Object.values(zoneStats)
      .map(z => ({
        zone: z.zone,
        machines: z.machines,
        engineers: z.engineersAssigned.size,
        ratio: z.engineersAssigned.size > 0 ? (z.machines / z.engineersAssigned.size).toFixed(1) : z.machines,
        needsAttention: z.needsAttention,
        priority: z.needsAttention / z.machines * 100
      }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6);
  }, [machines]);

  return {
    topEngineersData,
    machinePerformanceData,
    regionalComparisonData,
    distanceAnalysisData,
    zoneOptimizationData
  };
}

