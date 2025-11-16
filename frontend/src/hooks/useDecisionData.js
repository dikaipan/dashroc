/**
 * Custom hook for Decision page data calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';

/**
 * Hook for calculating decision analysis data
 * @param {Array} engineers - Array of engineer objects
 * @param {Array} machines - Array of machine objects
 * @param {Array} leveling - Array of leveling/assessment objects
 * @returns {Object} Analysis data objects
 */
export function useDecisionData(engineers, machines, leveling = []) {
  // Ensure inputs are arrays to prevent hook ordering issues
  const safeEngineers = Array.isArray(engineers) ? engineers : [];
  const safeMachines = Array.isArray(machines) ? machines : [];
  const safeLeveling = Array.isArray(leveling) ? leveling : [];

  // Top engineers performance data - using leveling data if available
  const topEngineersData = useMemo(() => {
    // If leveling data is available, use it for more accurate performance metrics
    if (safeLeveling.length > 0) {
      return safeLeveling
        .map(lev => {
          // Parse Total KPI Achievement (remove % and convert to number)
          const kpiAchievement = parseFloat(
            String(lev.total_kpi_achievement || lev['Total KPI Achievement'] || '0')
              .replace('%', '')
              .replace(',', '')
          ) || 0;
          
          // Parse Total Score or use KPI Achievement as performance score
          const totalScore = parseFloat(
            String(lev.total_score || lev['Total Score'] || lev.quantitative_index || '0')
              .replace(',', '')
          ) || kpiAchievement;
          
          // Get other metrics
          const totalMachine = parseFloat(lev.total_machine || lev['Total Machine'] || '0') || 0;
          const qualitativeScore = parseFloat(lev.qualitative_score || lev['Qualitative Score'] || '0') || 0;
          
          // Calculate performance score (0-100 scale)
          // Use Total KPI Achievement as primary metric, or calculate from available data
          const performance = Math.min(100, Math.max(0, kpiAchievement || totalScore || qualitativeScore));
          
          // Parse experience (format: "8 Tahun 3 Bulan 12 Hari" -> extract years)
          let experienceYears = 0;
          const experienceStr = String(lev.experience || lev.Experience || '');
          const yearMatch = experienceStr.match(/(\d+)\s*Tahun/);
          if (yearMatch) {
            experienceYears = parseFloat(yearMatch[1]) || 0;
          } else {
            // Try to parse as number if format is different
            experienceYears = parseFloat(experienceStr) || 0;
          }
          
          // Parse detailed metrics from leveling data
          // Helper function to parse percentage values
          const parsePercentage = (val) => {
            if (val === null || val === undefined || val === '') return 0;
            const str = String(val).replace('%', '').replace(',', '').trim();
            return parseFloat(str) || 0;
          };
          
          const parseScore = (val) => {
            if (val === null || val === undefined || val === '') return 0;
            const str = String(val).replace(',', '').trim();
            return parseFloat(str) || 0;
          };
          
          // Extract metrics based on column structure:
          // After normalization: Score.1 becomes score1 (not score_1)
          // Productivity: score, percentage, kpi_achievement
          // Response Time: score1, percentage1, kpi_achievement1
          // Resolution Time: score2, percentage2, kpi_achievement2
          // Competency: score3, percentage3, kpi_achievement3
          // Qualitative: qualitative_score
          
          // Productivity metrics (first set)
          const productivityScore = parseScore(lev.score || lev.Score || 0);
          const productivityPercentage = parsePercentage(lev.percentage || lev.Percentage || 0);
          const productivityKPI = parsePercentage(lev.kpi_achievement || lev['KPI Achievement'] || lev['kpi achievement'] || 0);
          
          // Response Time metrics (second set - score1, percentage1, kpi_achievement1)
          const responseTimeScore = parseScore(lev.score1 || lev.score_1 || lev['Score.1'] || 0);
          const responseTimePercentage = parsePercentage(lev.percentage1 || lev.percentage_1 || lev['Percentage.1'] || 0);
          const responseTimeKPI = parsePercentage(lev.kpi_achievement1 || lev.kpi_achievement_1 || lev['KPI Achievement.1'] || 0);
          
          // Resolution Time metrics (third set - score2, percentage2, kpi_achievement2)
          const resolutionTimeScore = parseScore(lev.score2 || lev.score_2 || lev['Score.2'] || 0);
          const resolutionTimePercentage = parsePercentage(lev.percentage2 || lev.percentage_2 || lev['Percentage.2'] || 0);
          const resolutionTimeKPI = parsePercentage(lev.kpi_achievement2 || lev.kpi_achievement_2 || lev['KPI Achievement.2'] || 0);
          
          // Competency metrics (fourth set - score3, percentage3, kpi_achievement3)
          const competencyScore = parseScore(lev.score3 || lev.score_3 || lev['Score.3'] || 0);
          const competencyPercentage = parsePercentage(lev.percentage3 || lev.percentage_3 || lev['Percentage.3'] || 0);
          const competencyKPI = parsePercentage(lev.kpi_achievement3 || lev.kpi_achievement_3 || lev['KPI Achievement.3'] || 0);
          
          // Qualitative metrics
          const qualitativePercentage = parsePercentage(lev.qualitative_score || lev['Qualitative Score'] || qualitativeScore);
          
          // Result and Assessment
          const result = lev.result || lev.Result || '';
          const assessment = lev.assesment || lev.Assesment || lev.assessment || lev.Assessment || lev.role || lev.Role || '';
          
          return {
            name: lev.name || lev.Name || 'Unknown',
            experience: experienceYears,
            training: qualitativeScore || 0,
            skills: qualitativeScore || 0,
            machines: totalMachine || 0,
            performance: performance,
            kpiAchievement: kpiAchievement,
            totalScore: totalScore,
            role: lev.role || lev.Role || '',
            region: lev.region || lev.Region || '',
            // Detailed metrics
            productivity: {
              score: productivityScore,
              percentage: productivityPercentage,
              kpiAchievement: productivityKPI
            },
            responseTime: {
              score: responseTimeScore,
              percentage: responseTimePercentage,
              kpiAchievement: responseTimeKPI
            },
            resolutionTime: {
              score: resolutionTimeScore,
              percentage: resolutionTimePercentage,
              kpiAchievement: resolutionTimeKPI
            },
            competency: {
              score: competencyScore,
              percentage: competencyPercentage,
              kpiAchievement: competencyKPI
            },
            qualitative: {
              score: qualitativeScore,
              percentage: qualitativePercentage
            },
            result: result,
            assessment: assessment
          };
        })
        .filter(eng => eng.name !== 'Unknown' && eng.performance > 0) // Filter out invalid entries
        .sort((a, b) => b.performance - a.performance)
        .slice(0, 10); // Show top 10 engineers
    }
    
    // Fallback to engineers data if leveling is not available
    if (!safeEngineers.length) return [];
    
    return safeEngineers
      .map(eng => ({
        name: eng.name || 'Unknown',
        experience: parseInt(eng.experience) || 0,
        training: eng.training_completion === 'completed' ? 100 : 50,
        skills: eng.skill_level === 'Advanced' ? 90 : eng.skill_level === 'Intermediate' ? 70 : 50,
        machines: safeMachines.filter(m => m.engineer_name === eng.name).length,
        performance: Math.min(100, (parseInt(eng.experience) || 0) * 10 + (eng.training_completion === 'completed' ? 20 : 0))
      }))
      .sort((a, b) => b.performance - a.performance)
      .slice(0, 5);
  }, [safeEngineers, safeMachines, safeLeveling]);

  // Machine performance data
  const machinePerformanceData = useMemo(() => {
    if (!safeMachines.length) return [];
    
    const machineTypes = {};
    safeMachines.forEach(m => {
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
  }, [safeMachines]);

  // Regional comparison data
  const regionalComparisonData = useMemo(() => {
    if (!safeEngineers.length || !safeMachines.length) return [];

    const regions = {};
    safeEngineers.forEach(eng => {
      const region = eng.region || 'Unknown';
      if (!regions[region]) {
        regions[region] = { region, engineers: 0, machines: 0, avgExp: 0, expSum: 0 };
      }
      regions[region].engineers++;
      regions[region].expSum += parseInt(eng.experience) || 0;
    });

    safeMachines.forEach(m => {
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
  }, [safeEngineers, safeMachines]);

  // Distance analysis data - Based on area_group using zona and distance from data_mesin.csv
  const distanceAnalysisData = useMemo(() => {
    if (!safeMachines.length) return [];

    // Helper function to normalize area_group for matching
    const normalizeAreaGroup = (ag) => {
      if (!ag) return 'Unknown';
      let normalized = String(ag).trim().toLowerCase().replace(/\s+/g, ' ');
      
      // Normalize Jakarta variations to "jakarta"
      // Jakarta Selatan, Jakarta Utara, Jakarta Timur, Jakarta Barat, Jakarta Pusat -> jakarta
      if (normalized.startsWith('jakarta')) {
        normalized = 'jakarta';
      }
      
      return normalized;
    };

    // First, count engineers per area_group from engineer data (with normalization)
    const engineersByAreaGroup = {};
    safeEngineers.forEach(eng => {
      const areaGroup = eng.area_group || 'Unknown';
      const normalized = normalizeAreaGroup(areaGroup);
      if (!engineersByAreaGroup[normalized]) {
        engineersByAreaGroup[normalized] = {
          original: areaGroup,
          engineers: new Set()
        };
      }
      const engineerName = eng.name || eng.ce_id || eng.engineer_name || '';
      if (engineerName) {
        engineersByAreaGroup[normalized].engineers.add(engineerName);
      }
    });

    // Group machines by area_group
    const areaGroupStats = {};
    
    safeMachines.forEach(m => {
      const areaGroup = m.area_group || 'Unknown';
      const normalized = normalizeAreaGroup(areaGroup);
      
      if (!areaGroupStats[normalized]) {
        const engineerData = engineersByAreaGroup[normalized];
        areaGroupStats[normalized] = {
          areaGroup: areaGroup, // Keep original name for display
          machines: [],
          zonaCounts: {},
          distanceCounts: {},
          engineers: engineerData ? new Set(engineerData.engineers) : new Set()
        };
      }
      
      areaGroupStats[normalized].machines.push(m);
      
      // Count zona
      const zona = parseFloat(m.zona) || 1;
      areaGroupStats[normalized].zonaCounts[zona] = (areaGroupStats[normalized].zonaCounts[zona] || 0) + 1;
      
      // Count distance - improved parsing with numeric value support
      const distance = String(m.distance || '').trim();
      const distanceLower = distance.toLowerCase();
      
      // Try to parse as numeric value first
      const numericDistance = parseFloat(distance);
      const isValidNumeric = !isNaN(numericDistance) && isFinite(numericDistance);
      
      if (isValidNumeric) {
        // If distance is a pure number, categorize by range
        if (numericDistance <= 60) {
          areaGroupStats[normalized].distanceCounts['0-60km'] = (areaGroupStats[normalized].distanceCounts['0-60km'] || 0) + 1;
        } else if (numericDistance > 60 && numericDistance <= 120) {
          areaGroupStats[normalized].distanceCounts['60-120km'] = (areaGroupStats[normalized].distanceCounts['60-120km'] || 0) + 1;
        } else if (numericDistance > 120) {
          areaGroupStats[normalized].distanceCounts['>120km'] = (areaGroupStats[normalized].distanceCounts['>120km'] || 0) + 1;
        }
      } else if (distance && distance.length > 0) {
        // Parse string patterns
        if (distanceLower.includes('0-60') || distanceLower.includes('0_60') || distanceLower === '0-60km' || distanceLower.includes('0 to 60') || distanceLower.includes('0 sampai 60')) {
          areaGroupStats[normalized].distanceCounts['0-60km'] = (areaGroupStats[normalized].distanceCounts['0-60km'] || 0) + 1;
        } else if (
          distanceLower.includes('60-120') || 
          distanceLower.includes('60_120') || 
          distanceLower.includes('60 to 120') || 
          distanceLower.includes('60 sampai 120') ||
          distanceLower.includes('60-120km') ||
          (distanceLower.includes('60') && distanceLower.includes('120') && !distanceLower.includes('0-60'))
        ) {
          areaGroupStats[normalized].distanceCounts['60-120km'] = (areaGroupStats[normalized].distanceCounts['60-120km'] || 0) + 1;
        } else if (
          distanceLower.includes('120') || 
          distanceLower.includes('>') || 
          distanceLower.includes('plus') ||
          distanceLower.includes('lebih dari 120') ||
          distanceLower.includes('>120')
        ) {
          areaGroupStats[normalized].distanceCounts['>120km'] = (areaGroupStats[normalized].distanceCounts['>120km'] || 0) + 1;
        } else {
          // Default to 0-60km if distance exists but doesn't match any pattern
          areaGroupStats[normalized].distanceCounts['0-60km'] = (areaGroupStats[normalized].distanceCounts['0-60km'] || 0) + 1;
        }
      }
    });
    
    // Get most common zona per area group
    const areaGroupData = Object.values(areaGroupStats).map(stat => {
      const machines = stat.machines;
      const totalMachines = machines.length;
      
      // Get most common zona
      const zonaEntries = Object.entries(stat.zonaCounts);
      const mostCommonZona = zonaEntries.length > 0
        ? parseFloat(zonaEntries.reduce((a, b) => stat.zonaCounts[a[0]] > stat.zonaCounts[b[0]] ? a : b)[0])
        : 1;
      
      // Count machines by zona relative to most common zona
      let sameZone = 0;
      let nearZone = 0;
      let farZone = 0;
      let machinesAboveZone1 = 0; // Count machines in zona > 1
      
      machines.forEach(m => {
        const machineZona = parseFloat(m.zona) || 1;
        const zonaDiff = Math.abs(machineZona - mostCommonZona);
        
        // Count machines above zone 1
        if (machineZona > 1) {
          machinesAboveZone1++;
        }
        
        if (zonaDiff === 0) {
          sameZone++;
        } else if (zonaDiff <= 1) {
          nearZone++;
        } else {
          farZone++;
        }
      });
      
      return {
        areaGroup: stat.areaGroup,
        zone: mostCommonZona,
        total: totalMachines,
        sameZone,
        nearZone,
        farZone,
        machinesAboveZone1, // Machines in zona > 1
        engineers: stat.engineers.size,
        // Distance breakdown from data_mesin.csv
        distance0_60km: stat.distanceCounts['0-60km'] || 0,
        distance60_120km: stat.distanceCounts['60-120km'] || 0,
        distance120kmPlus: stat.distanceCounts['>120km'] || 0,
        // Zona distribution
        zonaDistribution: stat.zonaCounts,
        avgZona: totalMachines > 0
          ? (machines.reduce((sum, m) => sum + (parseFloat(m.zona) || 1), 0) / totalMachines).toFixed(1)
          : mostCommonZona.toString(),
        distanceScore: sameZone * 1 + nearZone * 2 + farZone * 4 // Lower is better
      };
    }).filter(ag => ag.total > 0)
      // Sort by machinesAboveZone1 first (descending) - area groups with most machines above zone 1
      .sort((a, b) => {
        // Priority 1: Area groups with most machines above zone 1
        if (b.machinesAboveZone1 !== a.machinesAboveZone1) {
          return b.machinesAboveZone1 - a.machinesAboveZone1;
        }
        // Priority 2: Area groups with most farZone machines
        if (b.farZone !== a.farZone) {
          return b.farZone - a.farZone;
        }
        // Priority 3: Area groups with zone > 1 (above zone 1)
        if (b.zone > 1 && a.zone <= 1) return -1;
        if (a.zone > 1 && b.zone <= 1) return 1;
        // Priority 4: If zone > 1, prefer higher zone
        if (a.zone > 1 && b.zone > 1) {
          return b.zone - a.zone;
        }
        // Priority 5: By distanceScore (higher is worse, so we want to show problematic ones)
        return b.distanceScore - a.distanceScore;
      })
      // Filter: Only show area groups with machines above zone 1 OR farZone > 0 OR zone > 1
      .filter(ag => ag.machinesAboveZone1 > 0 || ag.farZone > 0 || ag.zone > 1)
      .slice(0, 10);

    return areaGroupData;
  }, [safeMachines, safeEngineers]);

  // Zone optimization data
  const zoneOptimizationData = useMemo(() => {
    if (!safeMachines.length) return [];

    const zoneStats = {};
    safeMachines.forEach(m => {
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
  }, [safeMachines]);

  return {
    topEngineersData,
    machinePerformanceData,
    regionalComparisonData,
    distanceAnalysisData,
    zoneOptimizationData
  };
}

