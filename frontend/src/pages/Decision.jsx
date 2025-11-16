import React, { useState, useMemo, Suspense, lazy } from "react";
import { useEngineerData, useMachineData, useLevelingData } from "../hooks/useEngineerData.js";
import { useDecisionData } from "../hooks/useDecisionData.js";
import { getDecisionCards } from "../utils/decisionUtils.js";
// Lazy load decision components for better code splitting
const DecisionCard = lazy(() => import("../components/decision/DecisionCard.jsx"));
const DecisionModal = lazy(() => import("../components/decision/DecisionModal.jsx"));
import PageLayout from "../components/layout/PageLayout.jsx";
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../constants/styles';

export default function Decision() {
  const { isDark } = useTheme();
  // Always call hooks in the same order, regardless of loading state
  const { rows: engineers, loading: engineersLoading } = useEngineerData();
  const { rows: machines, loading: machinesLoading } = useMachineData();
  const { rows: leveling, loading: levelingLoading } = useLevelingData();
  const [activeModal, setActiveModal] = useState(null);

  // Ensure engineers, machines, and leveling are always arrays to prevent hook issues
  const safeEngineers = Array.isArray(engineers) ? engineers : [];
  const safeMachines = Array.isArray(machines) ? machines : [];
  const safeLeveling = Array.isArray(leveling) ? leveling : [];

  const loading = engineersLoading || machinesLoading || levelingLoading;

  // Use custom hook for data calculations - always called with safe arrays
  const analysisData = useDecisionData(safeEngineers, safeMachines, safeLeveling);

  // Get cards configuration - always called
  const cards = useMemo(() => {
    if (!analysisData) return [];
    return getDecisionCards(analysisData);
  }, [analysisData]);

  // Early return AFTER all hooks are called
  if (loading) {
    return (
      <div className={cn(
        "flex items-center justify-center h-screen",
        isDark ? "bg-slate-900" : "bg-gray-50"
      )}>
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
      <Suspense fallback={<LoadingSkeleton type="spinner" message="Memuat kartu analisis..." />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {cards.map(card => (
            <DecisionCard
              key={card.id}
              card={card}
              onClick={() => setActiveModal(card)}
            />
          ))}
        </div>
      </Suspense>

      {/* Fullscreen Modal */}
      <Suspense fallback={null}>
        <DecisionModal
          card={activeModal}
          onClose={() => setActiveModal(null)}
        />
      </Suspense>
    </PageLayout>
  );
}
