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
    // Ensure arrays are defined
    const safeFilteredEngineers = Array.isArray(filteredEngineers) ? filteredEngineers : [];
    const safeAllEngineers = Array.isArray(allEngineers) ? allEngineers : [];
    
    const totalEngineers = safeFilteredEngineers.length;
    const totalAllEngineers = safeAllEngineers.length;
    const percentageOfTotal = totalAllEngineers > 0 
      ? (totalEngineers / totalAllEngineers * 100) 
      : 0;
    
    // Experience calculations
    const allExperiences = safeFilteredEngineers.map(eng => parseExperience(eng.years_experience));
    const experiences = allExperiences.filter(exp => exp > 0).sort((a, b) => a - b);
    
    const avgExperience = allExperiences.length > 0
      ? allExperiences.reduce((sum, exp) => sum + exp, 0) / allExperiences.length
      : 0;
    
    const minExperience = experiences.length > 0 ? experiences[0] : 0;
    const maxExperience = experiences.length > 0 ? experiences[experiences.length - 1] : 0;
    const medianExperience = experiences.length > 0
      ? experiences.length % 2 === 0
        ? (experiences[experiences.length / 2 - 1] + experiences[experiences.length / 2]) / 2
        : experiences[Math.floor(experiences.length / 2)]
      : 0;
    
    // Experience distribution (based on all engineers, including 0 experience)
    const juniorCount = allExperiences.filter(exp => exp < 2).length;
    const midLevelCount = allExperiences.filter(exp => exp >= 2 && exp < 4).length;
    const seniorCount = allExperiences.filter(exp => exp >= 4).length;
    
    // Training breakdown
    const onlyTechnical = safeFilteredEngineers.filter(eng => 
      eng.technical_skills_training && !eng.soft_skills_training
    ).length;
    const onlySoftSkills = safeFilteredEngineers.filter(eng => 
      !eng.technical_skills_training && eng.soft_skills_training
    ).length;
    const completedTraining = safeFilteredEngineers.filter(eng => 
      eng.technical_skills_training && eng.soft_skills_training
    ).length;
    const noTraining = safeFilteredEngineers.filter(eng => 
      !eng.technical_skills_training && !eng.soft_skills_training
    ).length;
    
    const trainingCompletionRate = totalEngineers > 0 
      ? (completedTraining / totalEngineers * 100) 
      : 0;
    
    // Region breakdown
    const regionBreakdown = {};
    safeFilteredEngineers.forEach(eng => {
      const region = eng.region || 'Unknown';
      regionBreakdown[region] = (regionBreakdown[region] || 0) + 1;
    });
    const regionStats = Object.entries(regionBreakdown)
      .map(([region, count]) => ({
        region,
        count,
        percentage: totalEngineers > 0 ? (count / totalEngineers * 100) : 0
      }))
      .sort((a, b) => {
        // Sort by Region 1, 2, 3 first, then by count
        const regionOrder = ['Region 1', 'Region 2', 'Region 3'];
        const aIndex = regionOrder.indexOf(a.region);
        const bIndex = regionOrder.indexOf(b.region);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return b.count - a.count;
      });
    
    // Vendor breakdown (top 3)
    const vendorBreakdown = {};
    safeFilteredEngineers.forEach(eng => {
      const vendor = eng.vendor || 'Unknown';
      vendorBreakdown[vendor] = (vendorBreakdown[vendor] || 0) + 1;
    });
    const topVendors = Object.entries(vendorBreakdown)
      .map(([vendor, count]) => ({
        vendor,
        count,
        percentage: totalEngineers > 0 ? (count / totalEngineers * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Generate insights
    const insights = generateInsights({
      totalEngineers,
      totalAllEngineers,
      percentageOfTotal,
      avgExperience,
      minExperience,
      maxExperience,
      medianExperience,
      juniorCount,
      midLevelCount,
      seniorCount,
      completedTraining,
      onlyTechnical,
      onlySoftSkills,
      noTraining,
      trainingCompletionRate,
      regionStats,
      topVendors
    });

    return {
      totalEngineers,
      totalAllEngineers,
      percentageOfTotal,
      avgExperience,
      minExperience,
      maxExperience,
      medianExperience,
      juniorCount,
      midLevelCount,
      seniorCount,
      completedTraining,
      onlyTechnical,
      onlySoftSkills,
      noTraining,
      trainingCompletionRate,
      regionStats,
      topVendors,
      insights,
      allExperiences // Include all experiences array for detailed calculations
    };
  }, [filteredEngineers, allEngineers]);
}

/**
 * Generate insights based on KPI data
 * @param {Object} kpis - KPI data object
 * @returns {Object} Insights object with insights for each card
 */
function generateInsights(kpis) {
  const {
    totalEngineers,
    totalAllEngineers,
    percentageOfTotal,
    avgExperience,
    minExperience,
    maxExperience,
    medianExperience,
    juniorCount,
    midLevelCount,
    seniorCount,
    completedTraining,
    onlyTechnical,
    onlySoftSkills,
    noTraining,
    trainingCompletionRate,
    regionStats,
    topVendors
  } = kpis;

  // Total Engineers Insights
  const totalEngineersInsights = [];
  if (regionStats.length > 0) {
    const topRegion = regionStats[0];
    const regionConcentration = topRegion.percentage;
    if (regionConcentration > 50) {
      totalEngineersInsights.push({
        type: 'info',
        icon: '📍',
        text: `${topRegion.region} memiliki ${regionConcentration.toFixed(0)}% engineer - konsentrasi tinggi`
      });
    }
    if (regionStats.length > 1) {
      const distribution = regionStats.length === 3 ? 'merata' : 'tidak merata';
      totalEngineersInsights.push({
        type: 'info',
        icon: '📊',
        text: `Distribusi engineer ${distribution} di ${regionStats.length} region`
      });
    }
  }
  if (topVendors.length > 0) {
    const topVendor = topVendors[0];
    if (topVendor.percentage > 40) {
      totalEngineersInsights.push({
        type: 'warning',
        icon: '⚠️',
        text: `${topVendor.vendor} mendominasi dengan ${topVendor.percentage.toFixed(0)}% - pertimbangkan diversifikasi`
      });
    }
  }
  if (percentageOfTotal < 100 && totalEngineers < totalAllEngineers) {
    const filteredCount = totalAllEngineers - totalEngineers;
    totalEngineersInsights.push({
      type: 'info',
      icon: '🔍',
      text: `Menampilkan ${totalEngineers} dari ${totalAllEngineers} engineer (${filteredCount} tersembunyi oleh filter)`
    });
  }

  // Default insight if no specific insights
  if (totalEngineersInsights.length === 0) {
    totalEngineersInsights.push({
      type: 'info',
      icon: 'ℹ️',
      text: `Total ${totalEngineers} engineer tersedia untuk operasi`
    });
  }

  // Experience Insights
  const experienceInsights = [];
  if (avgExperience >= 4) {
    experienceInsights.push({
      type: 'success',
      icon: '✅',
      text: 'Team dengan pengalaman tinggi - siap untuk proyek kompleks'
    });
  } else if (avgExperience >= 2 && avgExperience < 4) {
    experienceInsights.push({
      type: 'info',
      icon: '💡',
      text: 'Level pengalaman sedang - pertimbangkan mentoring program'
    });
  } else if (avgExperience > 0 && avgExperience < 2) {
    experienceInsights.push({
      type: 'warning',
      icon: '⚠️',
      text: 'Team masih junior - perlu lebih banyak training dan supervision'
    });
  }

  // Experience distribution insights
  const totalWithExperience = juniorCount + midLevelCount + seniorCount;
  if (totalWithExperience > 0) {
    const juniorPercentage = (juniorCount / totalWithExperience * 100);
    const seniorPercentage = (seniorCount / totalWithExperience * 100);
    
    if (juniorPercentage > 50) {
      experienceInsights.push({
        type: 'warning',
        icon: '📈',
        text: `${juniorPercentage.toFixed(0)}% junior - perlu program pengembangan`
      });
    }
    if (seniorPercentage > 30) {
      experienceInsights.push({
        type: 'success',
        icon: '🎯',
        text: `${seniorPercentage.toFixed(0)}% senior - dapat menjadi mentor`
      });
    }
    
    // Check experience gap
    if (maxExperience > 0 && minExperience >= 0) {
      const experienceGap = maxExperience - minExperience;
      if (experienceGap > 5) {
        experienceInsights.push({
          type: 'info',
          icon: '⚖️',
          text: `Gap experience ${experienceGap.toFixed(1)} tahun - pertimbangkan knowledge sharing`
        });
      }
    }
  }

  // Default insight if no specific insights
  if (experienceInsights.length === 0 && avgExperience > 0) {
    experienceInsights.push({
      type: 'info',
      icon: 'ℹ️',
      text: `Rata-rata pengalaman ${avgExperience.toFixed(1)} tahun`
    });
  }

  // Training Insights
  const trainingInsights = [];
  if (trainingCompletionRate >= 80) {
    trainingInsights.push({
      type: 'success',
      icon: '🎉',
      text: 'Training completion excellent - team siap untuk tugas yang lebih menantang'
    });
  } else if (trainingCompletionRate >= 60) {
    trainingInsights.push({
      type: 'info',
      icon: '📚',
      text: 'Training completion baik - fokus pada engineer yang belum complete'
    });
  } else if (trainingCompletionRate >= 40) {
    trainingInsights.push({
      type: 'warning',
      icon: '⚠️',
      text: 'Training completion perlu ditingkatkan - prioritaskan program training'
    });
  } else {
    trainingInsights.push({
      type: 'error',
      icon: '🚨',
      text: 'Training completion rendah - diperlukan aksi segera untuk meningkatkan kompetensi'
    });
  }

  // Training breakdown insights
  if (onlyTechnical > 0 || onlySoftSkills > 0) {
    const incompleteCount = onlyTechnical + onlySoftSkills;
    const incompletePercentage = (incompleteCount / totalEngineers * 100);
    if (incompletePercentage > 20) {
      trainingInsights.push({
        type: 'info',
        icon: '📋',
        text: `${incompleteCount} engineer belum complete training - ${incompletePercentage.toFixed(0)}% perlu pelatihan tambahan`
      });
    }
  }

  if (noTraining > 0 && totalEngineers > 0) {
    const noTrainingPercentage = (noTraining / totalEngineers * 100);
    if (noTrainingPercentage > 10) {
      trainingInsights.push({
        type: 'error',
        icon: '🔴',
        text: `${noTraining} engineer (${noTrainingPercentage.toFixed(0)}%) belum ada training - urgent!`
      });
    }
  }

  // Default insight if no specific insights
  if (trainingInsights.length === 0 && totalEngineers > 0) {
    trainingInsights.push({
      type: 'info',
      icon: 'ℹ️',
      text: `Training completion rate ${trainingCompletionRate.toFixed(0)}%`
    });
  }

  // Cross-analysis insights
  const crossInsights = [];
  if (juniorCount > 0 && noTraining > 0) {
    crossInsights.push({
      type: 'warning',
      icon: '🎓',
      text: 'Engineer junior perlu prioritas training untuk meningkatkan kompetensi'
    });
  }

  if (avgExperience < 2 && trainingCompletionRate < 50) {
    crossInsights.push({
      type: 'error',
      icon: '⚠️',
      text: 'Team masih junior dengan training rendah - risiko tinggi untuk performa'
    });
  }

  return {
    totalEngineers: totalEngineersInsights,
    experience: experienceInsights,
    training: trainingInsights,
    crossAnalysis: crossInsights
  };
}

