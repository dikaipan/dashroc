import React, { useState, useMemo } from "react";
import { useEngineerData, useMachineData } from "../hooks/useEngineerData.js";
import { useDecisionData } from "../hooks/useDecisionData.js";
import { getDecisionCards } from "../utils/decisionUtils.js";
import DecisionCard from "../components/decision/DecisionCard.jsx";
import DecisionModal from "../components/decision/DecisionModal.jsx";
import PageLayout from "../components/layout/PageLayout.jsx";
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function Decision() {
  const { rows: engineers, loading: engineersLoading } = useEngineerData();
  const { rows: machines, loading: machinesLoading } = useMachineData();
  const [activeModal, setActiveModal] = useState(null);

  const loading = engineersLoading || machinesLoading;

  // Use custom hook for data calculations
  const analysisData = useDecisionData(engineers, machines);

  // Get cards configuration
  const cards = useMemo(() => getDecisionCards(analysisData), [analysisData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSkeleton type="spinner" message="Memuat analisis data..." size="lg" />
      </div>
    );
  }

  return (
    <PageLayout
      title="Decision Intelligence"
      subtitle="Data comparison, analysis, and decision support"
    >
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => (
          <DecisionCard
            key={card.id}
            card={card}
            onClick={() => setActiveModal(card)}
          />
        ))}
      </div>

      {/* Fullscreen Modal */}
      <DecisionModal
        card={activeModal}
        onClose={() => setActiveModal(null)}
      />
    </PageLayout>
  );
}
