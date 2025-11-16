// src/components/charts/DashboardEngineerKPICards.jsx
// Wrapper untuk EngineerTrainingKPICards di Dashboard
import React, { useMemo, useState, useCallback } from 'react';
import EngineerTrainingKPICards from './EngineerTrainingKPICards.jsx';
import { useSOData } from '../../hooks/useEngineerData';

const DashboardEngineerKPICards = ({ engineers = [], setInsightModal }) => {
  // Use local state if setInsightModal not provided from parent
  const [localInsightModal, setLocalInsightModal] = useState(null);
  const modalSetter = setInsightModal || setLocalInsightModal;
  
  // Fetch SO data for April-September
  const { data: soData } = useSOData(['April', 'May', 'June', 'July', 'August', 'September']);
  
  // Helper function to get engineer trainings
  const getEngineerTrainings = useCallback((engineer) => {
    const trainings = new Set();
    
    if (engineer.technical_skills_training) {
      const techStr = String(engineer.technical_skills_training);
      const techSkills = techStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
      techSkills.forEach(skill => {
        const cleaned = skill.trim();
        if (cleaned && cleaned.length > 0) {
          const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
          trainings.add(normalized);
        }
      });
    }
    
    if (engineer.soft_skills_training) {
      const softStr = String(engineer.soft_skills_training);
      const softSkills = softStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
      softSkills.forEach(skill => {
        const cleaned = skill.trim();
        if (cleaned && cleaned.length > 0) {
          const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
          trainings.add(normalized);
        }
      });
    }
    
    Object.keys(engineer).forEach(key => {
      if (key === 'id' || key === 'name' || key === 'area_group' || key === 'region' || 
          key === 'vendor' || key === 'join_date' || key === 'years_experience' || 
          key === 'latitude' || key === 'longitude' || key === 'soft_skills_training' || 
          key === 'technical_skills_training') {
        return;
      }
      
      const value = String(engineer[key] || '').trim();
      if (value && value.length > 0 && 
          value !== 'null' && value !== 'undefined' && 
          !value.match(/^-?\d+\.?\d*$/) && 
          (value.toLowerCase().includes('training') || value.toLowerCase().includes('crm') || 
           value.toLowerCase().includes('tcr') || value.toLowerCase().includes('edc') || 
           value.toLowerCase().includes('pos') || value.toLowerCase().includes('cash') ||
           value.toLowerCase().includes('edisi'))) {
        const normalized = value.startsWith('Training ') ? value : `Training ${value}`;
        trainings.add(normalized);
      }
    });
    
    return Array.from(trainings);
  }, []);
  
  // Extract all unique training types
  const allTrainingTypes = useMemo(() => {
    const trainingSet = new Set();
    
    if (!Array.isArray(engineers)) return [];
    
    engineers.forEach(engineer => {
      const trainings = getEngineerTrainings(engineer);
      trainings.forEach(training => trainingSet.add(training));
    });
    
    return Array.from(trainingSet).sort();
  }, [engineers, getEngineerTrainings]);
  
  // Calculate engineers with training
  const engineersWithTraining = useMemo(() => {
    if (!Array.isArray(engineers)) return [];
    
    return engineers.filter(engineer => {
      if (!engineer || typeof engineer !== 'object') return false;
      const trainings = getEngineerTrainings(engineer);
      return trainings.length > 0;
    }).map(engineer => {
      const trainings = getEngineerTrainings(engineer);
      const trainingStatus = {};
      allTrainingTypes.forEach(training => {
        trainingStatus[training] = trainings.some(t => 
          t.toLowerCase().trim() === training.toLowerCase().trim()
        );
      });
      return {
        ...engineer,
        trainings,
        trainingStatus
      };
    });
  }, [engineers, allTrainingTypes, getEngineerTrainings]);
  
  // Calculate summaryStats
  const summaryStats = useMemo(() => {
    const total = engineers.length;
    const withTraining = engineersWithTraining.length;
    const withoutTraining = total - withTraining;
    
    // Calculate overall rate
    let totalCompleted = 0;
    let totalPossible = 0;
    
    engineersWithTraining.forEach(engineer => {
      allTrainingTypes.forEach(training => {
        totalPossible++;
        if (engineer.trainingStatus && engineer.trainingStatus[training]) {
          totalCompleted++;
        }
      });
    });
    
    const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    
    // Calculate by region
    const byRegion = {};
    engineersWithTraining.forEach(eng => {
      const region = eng.region || 'Unknown';
      byRegion[region] = (byRegion[region] || 0) + 1;
    });
    
    // Calculate by vendor
    const byVendor = {};
    engineersWithTraining.forEach(eng => {
      const vendor = eng.vendor || 'Unknown';
      byVendor[vendor] = (byVendor[vendor] || 0) + 1;
    });
    
    // Calculate by experience level
    const byExperienceLevel = { junior: 0, mid: 0, senior: 0 };
    engineersWithTraining.forEach(eng => {
      let years = 0;
      const expStr = String(eng.years_experience || '0');
      // Try to parse from "X Tahun Y Bulan" format first
      const yearsMatch = expStr.match(/(\d+)\s+Tahun/);
      if (yearsMatch) {
        years = parseInt(yearsMatch[1]);
      } else {
        // Fallback to numeric value
        years = parseFloat(expStr) || 0;
      }
      if (years < 2) byExperienceLevel.junior++;
      else if (years < 5) byExperienceLevel.mid++;
      else byExperienceLevel.senior++;
    });
    
    // Top region
    const topRegion = Object.keys(byRegion).length > 0 
      ? Object.entries(byRegion).sort((a, b) => b[1] - a[1])[0]
      : null;
    
    // Top vendor
    const topVendor = Object.keys(byVendor).length > 0
      ? Object.entries(byVendor).sort((a, b) => b[1] - a[1])[0]
      : null;
    
    // Calculate avg completion and completion distribution
    const completionCounts = engineersWithTraining.map(eng => {
      const engTrainings = getEngineerTrainings(eng);
      return engTrainings.length;
    });
    const avgCompletion = completionCounts.length > 0 
      ? Math.round(completionCounts.reduce((sum, count) => sum + count, 0) / completionCounts.length * 10) / 10
      : 0;
    
    const completionDistribution = {
      0: engineersWithTraining.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.length === 0;
      }).length,
      1: engineersWithTraining.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.length === 1;
      }).length,
      2: engineersWithTraining.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.length === 2;
      }).length,
      3: engineersWithTraining.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.length === 3;
      }).length,
      4: engineersWithTraining.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.length === 4;
      }).length,
      '5+': engineersWithTraining.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.length >= 5;
      }).length
    };
    
    // Calculate avg completion by region
    const avgCompletionByRegion = {};
    Object.keys(byRegion).forEach(region => {
      const regionEngineers = engineersWithTraining.filter(eng => (eng.region || 'Unknown') === region);
      const regionCompletions = regionEngineers.map(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.length;
      });
      avgCompletionByRegion[region] = regionCompletions.length > 0
        ? Math.round(regionCompletions.reduce((sum, count) => sum + count, 0) / regionCompletions.length * 10) / 10
        : 0;
    });
    
    // Training Gaps Analysis
    const trainingGaps = allTrainingTypes.map(training => {
      const engineersWithTrainingCount = engineersWithTraining.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.some(t => t.toLowerCase().trim() === training.toLowerCase().trim());
      }).length;
      const engineersWithoutTrainingCount = total - engineersWithTrainingCount;
      const percentage = total > 0 ? Math.round((engineersWithTrainingCount / total) * 100) : 0;
      
      return {
        training: training.replace('Training ', ''),
        trainingFull: training,
        withTraining: engineersWithTrainingCount,
        withoutTraining: engineersWithoutTrainingCount,
        percentage: percentage,
        gapPercentage: 100 - percentage
      };
    }).sort((a, b) => {
      if (b.gapPercentage !== a.gapPercentage) {
        return b.gapPercentage - a.gapPercentage;
      }
      return a.training.localeCompare(b.training);
    });
    
    const totalTrainingGaps = trainingGaps.reduce((sum, gap) => sum + gap.withoutTraining, 0);
    const topTrainingGaps = trainingGaps.slice(0, 3);
    const criticalTrainingGaps = trainingGaps.filter(gap => gap.gapPercentage >= 50);
    
    // Area/Region with most training gaps
    const gapsByArea = {};
    const gapsByRegion = {};
    
    allTrainingTypes.forEach(training => {
      engineers.forEach(eng => {
        if (!eng || typeof eng !== 'object') return;
        const engTrainings = getEngineerTrainings(eng);
        const hasTraining = engTrainings.some(t => t.toLowerCase().trim() === training.toLowerCase().trim());
        
        if (!hasTraining) {
          const area = eng.area_group || 'Unknown';
          const region = eng.region || 'Unknown';
          
          gapsByArea[area] = (gapsByArea[area] || 0) + 1;
          gapsByRegion[region] = (gapsByRegion[region] || 0) + 1;
        }
      });
    });
    
    const topAreaGap = Object.keys(gapsByArea).length > 0 
      ? Object.entries(gapsByArea).sort((a, b) => b[1] - a[1])[0]
      : null;
    const topRegionGap = Object.keys(gapsByRegion).length > 0
      ? Object.entries(gapsByRegion).sort((a, b) => b[1] - a[1])[0]
      : null;
    
    // Training stats
    const trainingCompletionCount = {};
    allTrainingTypes.forEach(training => {
      trainingCompletionCount[training] = engineersWithTraining.filter(e => 
        e.trainingStatus && e.trainingStatus[training]
      ).length;
    });
    
    const trainingStats = Object.entries(trainingCompletionCount)
      .map(([training, count]) => ({
        training: training.replace('Training ', ''),
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        return a.training.localeCompare(b.training);
      });
    
    const mostCompletedTraining = trainingStats[0];
    const lowestPercentage = trainingStats.length > 0 ? trainingStats[trainingStats.length - 1].percentage : 0;
    const leastCompletedTrainings = trainingStats.filter(stat => stat.percentage === lowestPercentage);
    const leastCompletedTraining = leastCompletedTrainings.length > 0 
      ? leastCompletedTrainings.sort((a, b) => a.training.localeCompare(b.training))[0]
      : null;
    
    return {
      total,
      withTraining,
      withoutTraining,
      avgCompletion,
      overallRate,
      // Total Engineers insights
      byRegion,
      byVendor,
      byExperienceLevel,
      topRegion: topRegion ? { name: topRegion[0], count: topRegion[1] } : null,
      topVendor: topVendor ? { name: topVendor[0], count: topVendor[1] } : null,
      // Avg Completion insights
      completionDistribution,
      avgCompletionByRegion,
      // Overall Rate insights
      trainingStats,
      mostCompletedTraining,
      leastCompletedTraining,
      // Training Gaps insights
      trainingGaps,
      totalTrainingGaps,
      topTrainingGaps,
      criticalTrainingGaps,
      topAreaGap: topAreaGap ? { name: topAreaGap[0], count: topAreaGap[1] } : null,
      topRegionGap: topRegionGap ? { name: topRegionGap[0], count: topRegionGap[1] } : null,
      totalCompleted,
      totalPossible,
      // Average Resolution Time insights (from SO data)
      avgResolutionTime: soData || null
    };
  }, [engineers, engineersWithTraining, allTrainingTypes, soData, getEngineerTrainings]);
  
  if (!summaryStats || summaryStats.total === 0) {
    return null;
  }
  
  return (
    <EngineerTrainingKPICards 
      summaryStats={summaryStats}
      engineersWithTraining={engineersWithTraining}
      allTrainingTypes={allTrainingTypes}
      setInsightModal={modalSetter}
    />
  );
};

export default React.memo(DashboardEngineerKPICards);

