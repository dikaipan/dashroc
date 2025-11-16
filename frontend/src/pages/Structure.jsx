import React, { useState, useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout.jsx';
import FSMCard from '../components/structure/FSMCard.jsx';
import RegionCard from '../components/structure/RegionCard.jsx';
import ConnectionLines from '../components/structure/ConnectionLines.jsx';
import TACoordinatorCard from '../components/structure/TACoordinatorCard.jsx';
import CustomerTAView from '../components/structure/CustomerTAView.jsx';
import RemoteGuidanceMonitoring from '../components/structure/RemoteGuidanceMonitoring.jsx';
import SupportPersonnel from '../components/structure/SupportPersonnel.jsx';
import TAConnectionLines from '../components/structure/TAConnectionLines.jsx';
import { getStructureData } from '../utils/structureUtils.js';
import { getTAAccountData, calculateTAStatistics } from '../utils/taAccountUtils.js';
import { GitBranch, UserCheck } from 'react-feather';
import { useTheme } from '../contexts/ThemeContext';

export default function Structure() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('structure'); // 'structure' or 'ta-account'
  const [selectedCustomer, setSelectedCustomer] = useState(''); // Selected customer name

  // Get structure data
  const structureData = useMemo(() => getStructureData(), []);
  
  // Get TA Account data
  const taAccountData = useMemo(() => getTAAccountData(), []);
  
  // Calculate TA statistics
  const taStatistics = useMemo(() => calculateTAStatistics(taAccountData), [taAccountData]);
  
  // Theme-aware styles
  const tabBorderColor = isDark ? 'border-slate-700' : 'border-gray-300';
  const tabActiveColor = isDark ? 'text-blue-400 border-blue-400' : 'text-blue-600 border-blue-600';
  const tabInactiveColor = isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-500 hover:text-gray-700';
  const cardBg = isDark ? 'bg-slate-800/50' : 'bg-gray-50';
  const cardBorder = isDark ? 'border-slate-700' : 'border-gray-300';
  const textPrimary = isDark ? 'text-slate-100' : 'text-gray-900';
  const textSecondary = isDark ? 'text-slate-300' : 'text-gray-600';
  const textMuted = isDark ? 'text-slate-400' : 'text-gray-500';
  const placeholderBg = isDark ? 'bg-slate-900/50' : 'bg-gray-100';
  const placeholderBorder = isDark ? 'border-slate-700' : 'border-gray-300';

  return (
    <PageLayout
      title="Struktur Organisasi"
      subtitle="Hierarki Field Service Management ROC Indonesia"
    >
      {/* Tabs */}
      <div className="mb-6">
        <div className={`flex gap-2 border-b ${tabBorderColor}`}>
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
              activeTab === 'structure'
                ? `${tabActiveColor} border-b-2`
                : tabInactiveColor
            }`}
          >
            <GitBranch size={18} />
            <span>Struktur Organisasi</span>
          </button>
          <button
            onClick={() => setActiveTab('ta-account')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-all relative ${
              activeTab === 'ta-account'
                ? `${tabActiveColor} border-b-2`
                : tabInactiveColor
            }`}
          >
            <UserCheck size={18} />
            <span>TA Account Responsibility</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'structure' && (
        <div className="flex flex-col items-center space-y-6">
          {/* FSM - Top Level */}
          <FSMCard fsm={structureData.fsm} />

          {/* Connection Lines */}
          <ConnectionLines />

          {/* ROC Regions - Second Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-6xl px-2 sm:px-0">
            {structureData.regions.map((region) => (
              <RegionCard
                key={region.id}
                region={region}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'ta-account' && (
        <div className="space-y-4">
          {/* TA Coordinator - Top Level */}
          <div className="flex flex-col items-center">
            <TACoordinatorCard coordinator={taAccountData.taCoordinator} />
          </div>

          {/* Connection Lines */}
          <TAConnectionLines />

          {/* Customer TA View Section */}
          <div className={`${cardBg} rounded-xl border ${cardBorder} p-6`}>
            <CustomerTAView 
              taAccountData={taAccountData}
              selectedCustomer={selectedCustomer}
              onCustomerChange={setSelectedCustomer}
            />
          </div>

          {/* Remote Guidance Monitoring Section */}
          <div className={`${cardBg} rounded-xl border ${cardBorder} p-6`}>
            <RemoteGuidanceMonitoring data={taAccountData.remoteGuidanceMonitoring} />
          </div>

          {/* Support Personnel Section */}
          <div className={`${cardBg} rounded-xl border ${cardBorder} p-6`}>
            <SupportPersonnel data={taAccountData.supportPersonnel} />
          </div>

          {/* Statistics Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Statistics Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className={`bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border-2 border-cyan-500/40 rounded-xl p-5 text-center shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-300`}>
                <p className="text-3xl font-bold text-white mb-2">{taStatistics.taCoordinator}</p>
                <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">TA Coordinator</p>
              </div>
              <div className={`bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-500/40 rounded-xl p-5 text-center shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:scale-105 transition-all duration-300`}>
                <p className="text-3xl font-bold text-white mb-2">{taStatistics.helpdeskCoordinator}</p>
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Helpdesk Coord</p>
              </div>
              <div className={`bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/40 rounded-xl p-5 text-center shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300`}>
                <p className="text-3xl font-bold text-white mb-2">{taStatistics.helpdeskAllCustomer}</p>
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Helpdesk All</p>
              </div>
              <div className={`bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/40 rounded-xl p-5 text-center shadow-lg shadow-green-500/10 hover:shadow-green-500/20 hover:scale-105 transition-all duration-300`}>
                <p className="text-3xl font-bold text-white mb-2">{taStatistics.groupAreaLeaders}</p>
                <p className="text-xs font-semibold text-green-400 uppercase tracking-wider">Area Leaders</p>
              </div>
              <div className={`bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border-2 border-indigo-500/40 rounded-xl p-5 text-center shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300`}>
                <p className="text-3xl font-bold text-white mb-2">{taStatistics.technicalAnalysts}</p>
                <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Analysts</p>
              </div>
              <div className={`bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-2 border-orange-500/40 rounded-xl p-5 text-center shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-105 transition-all duration-300`}>
                <p className="text-3xl font-bold text-white mb-2">{taStatistics.technicalAssistanceBackup}</p>
                <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider">TA Backup</p>
              </div>
            </div>
          </div>
        </div>
      )}
    
    </PageLayout>
  );
}
