// Simple SO Time Tracking Card untuk debugging
import React from 'react';
import { Clock, Activity, Calendar } from 'react-feather';
import { cn } from '../../../constants/styles';
import { useTheme } from '../../../contexts/ThemeContext';

const SOTimeTrackingCardSimple = ({ soTimeData, setInsightModal, onPeriodChange }) => {
  const { isDark } = useTheme();
  
  if (!soTimeData) {
    return (
      <div className="w-full max-w-md h-[340px] rounded-xl bg-slate-800/50 backdrop-blur-sm flex items-center justify-center border border-slate-600/20">
        <div className="text-center text-slate-400">
          <p className="text-sm">No SO data available</p>
        </div>
      </div>
    );
  }

  const totalAvgTime = (soTimeData.assignmentToStart || 0) + 
                       (soTimeData.startToComplete || 0) + 
                       (soTimeData.completeToClose || 0);

  return (
    <div className={cn(
      "w-full max-w-md rounded-xl p-4 backdrop-blur-sm",
      "bg-gradient-to-br from-emerald-900/30 to-emerald-800/20",
      "border border-emerald-400/20 hover:border-emerald-400/40",
      "transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
    )}>
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="w-12 h-12 flex items-center justify-center shrink-0 bg-emerald-500/20 rounded-lg ring-2 ring-emerald-400/20">
            <Clock className="text-emerald-300" size={24} />
          </div>
          <div className="flex-1 text-right">
            <div className="flex items-center justify-end gap-2 mb-1">
              <p className="text-emerald-100 text-xs font-medium">
                SO Time Tracking
              </p>
            </div>
            <h3 className="text-3xl font-extrabold tracking-tighter mb-2 text-emerald-200">
              {totalAvgTime.toFixed(1)}h
            </h3>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs bg-emerald-500/20 border border-emerald-400/30">
              <Activity size={12} className="text-emerald-300" />
              <span className="text-emerald-100 font-semibold">
                Average Lifecycle
              </span>
            </div>
          </div>
        </div>
        
        {/* Period Display */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-500/20 border border-emerald-400/30">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-emerald-300" />
            <span className="text-xs font-medium text-slate-300">
              Test Data
            </span>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="flex flex-col items-center p-2 rounded-lg bg-cyan-500/20 border border-cyan-400/20">
          <div className="text-xs font-bold text-cyan-300">
            {soTimeData.assignmentToStart}h
          </div>
          <div className="text-[10px] text-slate-400 text-center">Assign→Start</div>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-blue-500/20 border border-blue-400/20">
          <div className="text-xs font-bold text-blue-300">
            {soTimeData.startToComplete}h
          </div>
          <div className="text-[10px] text-slate-400 text-center">Start→Done</div>
        </div>
        <div className="flex flex-col items-center p-2 rounded-lg bg-purple-500/20 border border-purple-400/20">
          <div className="text-xs font-bold text-purple-300">
            {soTimeData.completeToClose}h
          </div>
          <div className="text-[10px] text-slate-400 text-center">Done→Close</div>
        </div>
      </div>
      
      {/* SLA Compliance */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300">SLA Compliance</span>
          <span className={cn(
            "text-xs font-bold px-2 py-1 rounded",
            totalAvgTime <= 8 
              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
          )}>
            {totalAvgTime <= 8 ? "✓ Met" : "⚠ Exceeded"}
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              totalAvgTime <= 8 
                ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                : "bg-gradient-to-r from-amber-500 to-amber-400"
            )}
            style={{ width: `${Math.min((totalAvgTime / 8) * 100, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Performance Highlights */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-400/20">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
            <span className="text-[10px] text-slate-400">Fastest SO</span>
          </div>
          <div className="text-sm font-bold text-emerald-300">
            {soTimeData.fastestThisWeek}h
          </div>
        </div>
        <div className="p-2 rounded-lg bg-red-500/10 border border-red-400/20">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-[10px] text-slate-400">Slowest SO</span>
          </div>
          <div className="text-sm font-bold text-red-300">
            {soTimeData.slowest}h
          </div>
        </div>
      </div>
      
      {/* Monthly Stats */}
      <div className="p-2 rounded-lg bg-slate-700/30 border border-slate-600/20">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Total SO This Month</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-slate-200">
              {soTimeData.totalSOThisMonth}
            </span>
            <span className={cn(
              "text-xs font-medium px-1.5 py-0.5 rounded",
              soTimeData.monthlyTrend > 0 
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-red-500/20 text-red-300"
            )}>
              {soTimeData.monthlyTrend > 0 ? '↑' : '↓'} {Math.abs(soTimeData.monthlyTrend)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOTimeTrackingCardSimple;
