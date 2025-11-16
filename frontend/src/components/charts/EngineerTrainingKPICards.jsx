// src/components/charts/EngineerTrainingKPICards.jsx
// KPI Cards untuk Training Engineers (Total Engineers, Avg Resolution Times, Overall Rate, Engineer-Customer)
// Refactored: Uses individual KPI card components for better maintainability
import React, { memo } from 'react';
import { TotalEngineersCard, AvgResolutionCard, OverallRateCard, EngineerCustomerCard } from './kpi';
import { useEngineerCustomerRelationships } from '../../hooks/useEngineerData';

const EngineerTrainingKPICards = memo(({ 
  summaryStats = null,
  engineersWithTraining = [],
  allTrainingTypes = [],
  setInsightModal = null 
}) => {
  // Fetch engineer-customer relationship data
  const { data: relationshipData, loading: relationshipLoading, error: relationshipError } = useEngineerCustomerRelationships();

  if (!summaryStats) {
    return null;
  }

  return (
    <div id="engineer-training-kpi-cards" className="w-full mb-6 md:mb-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-fr">
        {/* Total Engineers KPI */}
        <TotalEngineersCard 
          summaryStats={summaryStats}
          setInsightModal={setInsightModal}
        />

        {/* Average Resolution Times KPI */}
        <AvgResolutionCard 
          summaryStats={summaryStats}
          setInsightModal={setInsightModal}
        />

        {/* Overall Training Rate KPI */}
        <OverallRateCard 
          summaryStats={summaryStats}
          allTrainingTypes={allTrainingTypes}
          setInsightModal={setInsightModal}
        />

        {/* Engineer-Customer Relationship KPI */}
        <EngineerCustomerCard 
          relationshipData={relationshipData}
          setInsightModal={setInsightModal}
        />
      </div>
    </div>
  );
});

EngineerTrainingKPICards.displayName = 'EngineerTrainingKPICards';

export default EngineerTrainingKPICards;
