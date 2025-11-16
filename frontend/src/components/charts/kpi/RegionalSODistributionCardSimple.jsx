// Simple Regional SO Distribution Card untuk debugging
import React from 'react';
import { MapPin, BarChart, Calendar, CheckCircle } from 'react-feather';
import { cn } from '../../../constants/styles';
import { useTheme } from '../../../contexts/ThemeContext';

const RegionalSODistributionCardSimple = ({ regionalData, setInsightModal, onPeriodChange }) => {
  const { isDark } = useTheme();
  
  console.log('[RegionalSODistributionCardSimple] Props:', { regionalData, hasData: !!regionalData });
  
  if (!regionalData) {
    return (
      <div className="w-full max-w-md h-[340px] rounded-xl bg-slate-800/50 backdrop-blur-sm flex items-center justify-center border border-slate-600/20">
        <div className="text-center text-slate-400">
          <p className="text-sm">No Regional data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "w-full max-w-md rounded-xl p-4 backdrop-blur-sm",
      "bg-gradient-to-br from-blue-900/30 to-blue-800/20",
      "border border-blue-400/20 hover:border-blue-400/40",
      "transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
    )}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-blue-500/20 rounded-lg ring-2 ring-blue-400/20">
            <MapPin className="text-blue-300" size={24} />
          </div>
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <p className="text-blue-100 text-xs font-medium">
                Regional SO Distribution
              </p>
            </div>
            <h3 className="text-3xl font-extrabold tracking-tighter mb-2 text-blue-200">
              {regionalData.totalSO}
            </h3>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-blue-500/20 border border-blue-400/30">
              <BarChart size={12} className="text-blue-300" />
              <span className="text-blue-100 font-semibold">
                Total Service Orders
              </span>
            </div>
          </div>
        </div>
        
        {/* Period Display */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-blue-300" />
            <span className="text-xs font-medium text-slate-300">
              Test Data
            </span>
          </div>
        </div>
      </div>
      
      {/* Top Regions */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300">Top Regions</span>
          <span className="text-xs text-slate-400">
            {regionalData.topRegions?.length || 0} regions
          </span>
        </div>
        
        <div className="space-y-2">
          {(regionalData.topRegions || []).slice(0, 4).map((region, index) => (
            <div key={region.name} className="flex items-center justify-between p-2 rounded-lg bg-slate-700/30 border border-slate-600/20">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                  index === 0 ? "bg-yellow-500/20 text-yellow-300 border border-yellow-400/30" :
                  index === 1 ? "bg-gray-400/20 text-gray-300 border border-gray-400/30" :
                  index === 2 ? "bg-orange-600/20 text-orange-300 border border-orange-400/30" :
                  "bg-slate-500/20 text-slate-300 border border-slate-400/30"
                )}>
                  {index + 1}
                </div>
                <span className="text-xs font-medium text-slate-200">
                  {region.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-blue-300">
                  {region.totalSO}
                </span>
                <span className="text-xs text-slate-400">
                  ({region.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle size={12} className="text-emerald-400" />
            <span className="text-[10px] text-slate-400">Avg Completion</span>
          </div>
          <div className="text-sm font-bold text-emerald-300">
            {regionalData.topRegions?.length > 0 
              ? Math.round(regionalData.topRegions.reduce((sum, r) => sum + parseFloat(r.completionRate), 0) / regionalData.topRegions.length)
              : 0}%
          </div>
        </div>
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-400/20">
          <div className="flex items-center gap-1 mb-1">
            <MapPin size={12} className="text-blue-400" />
            <span className="text-[10px] text-slate-400">Active Regions</span>
          </div>
          <div className="text-sm font-bold text-blue-300">
            {regionalData.regionData?.length || 0}
          </div>
        </div>
      </div>
      
      {/* Regional Distribution Bar */}
      <div className="p-2 rounded-lg bg-slate-700/30 border border-slate-600/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Distribution</span>
          <span className="text-xs text-slate-400">
            {regionalData.topRegions?.length > 0 ? regionalData.topRegions[0].percentage : 0}% top region
          </span>
        </div>
        <div className="flex gap-1 h-2">
          {(regionalData.topRegions || []).slice(0, 5).map((region, index) => (
            <div
              key={region.name}
              className={cn(
                "h-full rounded-sm transition-all duration-300 hover:opacity-80",
                index === 0 ? "bg-blue-500" :
                index === 1 ? "bg-blue-400" :
                index === 2 ? "bg-blue-300" :
                index === 3 ? "bg-slate-400" :
                "bg-slate-500"
              )}
              style={{ 
                width: `${region.percentage}%`,
                minWidth: '2px'
              }}
              title={`${region.name}: ${region.totalSO} SO (${region.percentage}%)`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionalSODistributionCardSimple;
