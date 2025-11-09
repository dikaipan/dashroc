/**
 * Custom hook for engineer KPI calculations
 * Separates business logic from UI component
 */
import { useMemo } from 'react';
import { parseExperience } from '../utils/textUtils';

/**
 * Hook for calculating engineer KPIs
 * @param {Array} filteredEngineers - Filtered engineer array
 * @param {Array} allEngineers - All engineers array
 * @returns {Object} KPI data
 */
export function useEngineerKPIs(filteredEngineers, allEngineers) {
  return useMemo(() => {
    const totalEngineers = filteredEngineers.length;
    const totalAllEngineers = allEngineers.length;
    const percentageOfTotal = totalAllEngineers > 0 
      ? (totalEngineers / totalAllEngineers * 100) 
      : 0;
    
    const avgExperience = totalEngineers > 0
      ? filteredEngineers.reduce((sum, eng) => sum + parseExperience(eng.years_experience), 0) / totalEngineers
      : 0;
    
    // Calculate training completion (assume completed if has both technical and soft skills training)
    const completedTraining = filteredEngineers.filter(eng => 
      eng.technical_skills_training && eng.soft_skills_training
    ).length;
    const trainingCompletionRate = totalEngineers > 0 
      ? (completedTraining / totalEngineers * 100) 
      : 0;

    return {
      totalEngineers,
      totalAllEngineers,
      percentageOfTotal,
      avgExperience,
      completedTraining,
      trainingCompletionRate
    };
  }, [filteredEngineers, allEngineers]);
}

