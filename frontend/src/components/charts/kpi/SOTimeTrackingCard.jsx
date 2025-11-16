// src/components/charts/kpi/SOTimeTrackingCard.jsx
// SO Time Tracking KPI Card Component
import React, { useState } from 'react';
import { Clock, Activity, CheckCircle, TrendingUp, AlertCircle, Calendar } from 'react-feather';
import { TEXT_STYLES, cn } from '../../../constants/styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  getKPICardContainerClasses, 
  getDecorativeOverlayClasses, 
  getGlowClasses,
  getSectionContainerClasses,
  getProgressBarBgClasses,
} from '../../../utils/kpiCardStyles';
import { getTextGradient, getBadgeClasses, getIconBoxClasses } from '../../../utils/themeUtils';

const SOTimeTrackingCard = ({ soTimeData, setInsightModal, onPeriodChange }) => {
  const { isDark } = useTheme();
  const color = 'green'; // Theme color for SO cards
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');
  
  if (!soTimeData) return null;

  const badgeClasses = getBadgeClasses(color, isDark);
  const iconBoxClasses = getIconBoxClasses(color, isDark);
  
  // Period options
  const periods = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'lastMonth', label: 'Last Month' },
    { value: 'last3Months', label: 'Last 3 Months' },
  ];
  
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    if (onPeriodChange) {
      onPeriodChange(period);
    }
  };
  
  // Get period label for display
  const getCurrentPeriodLabel = () => {
    const period = periods.find(p => p.value === selectedPeriod);
    return period ? period.label : 'This Month';
  };
  
  // Format date range for display
  const getDateRangeText = () => {
    if (soTimeData.periodStart && soTimeData.periodEnd) {
      const start = new Date(soTimeData.periodStart).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short' 
      });
      const end = new Date(soTimeData.periodEnd).toLocaleDateString('id-ID', { 
        day: 'numeric', 
        month: 'short',
        year: 'numeric'
      });
      return `${start} - ${end}`;
    }
    return getCurrentPeriodLabel();
  };

  // Calculate metrics
  const totalAvgTime = (soTimeData.assignmentToStart || 0) + 
                       (soTimeData.startToComplete || 0) + 
                       (soTimeData.completeToClose || 0);
  
  const targetTime = soTimeData.targetTime || 8;
  const isMeetingTarget = totalAvgTime <= targetTime;

  return (
    <div className={getKPICardContainerClasses(color, isDark)}>
      {/* Decorative elements */}
      <div className={getDecorativeOverlayClasses(color)} />
      <div className={getGlowClasses(color)} />
      
      <div className="relative flex-1 flex flex-col z-10">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className={cn(
              iconBoxClasses, 
              "w-12 h-12 flex items-center justify-center shrink-0",
              "ring-2 ring-emerald-400/20 group-hover:ring-emerald-400/40",
              "transition-all duration-300"
            )}>
              <Clock className="text-emerald-300 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <p className={cn(TEXT_STYLES.cardHeader, "text-emerald-100 text-xs")}>
                  SO Time Tracking
                </p>
                {setInsightModal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInsightModal('so-time-tracking');
                    }}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-300',
                      'hover:scale-110 hover:rotate-12',
                      badgeClasses.bg,
                      badgeClasses.border,
                      isDark ? 'text-emerald-300/70 hover:text-emerald-200 hover:bg-emerald-500/30' : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100'
                    )}
                    title="Lihat Insight Detail"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </button>
                )}
              </div>
              <h3 className={cn(
                "text-3xl font-extrabold tracking-tighter mb-2",
                isDark ? "text-emerald-200" : "text-emerald-700"
              )}>
                {totalAvgTime.toFixed(1)}h
              </h3>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                badgeClasses.bg,
                badgeClasses.border
              )}>
                <Activity size={12} className={badgeClasses.icon} />
                <span className={cn("text-emerald-100 font-semibold")}>
                  Average Lifecycle
                </span>
              </div>
            </div>
          </div>
          
          {/* Period Display & Filter */}
          <div className={cn(
            "flex items-center justify-between p-2 rounded-lg mb-3",
            badgeClasses.bg,
            badgeClasses.border
          )}>
            <div className="flex items-center gap-2">
              <Calendar size={14} className={badgeClasses.icon} />
              <span className="text-xs font-medium text-slate-300">
                {getDateRangeText()}
              </span>
            </div>
            
            {/* Period Dropdown */}
            <select
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className={cn(
                "text-xs font-medium px-2 py-1 rounded cursor-pointer",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-emerald-400/50",
                isDark 
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30"
                  : "bg-emerald-100 text-emerald-700 border border-emerald-300 hover:bg-emerald-200"
              )}
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className={cn(
              "flex flex-col items-center p-2 rounded-lg",
              badgeClasses.bg,
              "border border-cyan-400/20"
            )}>
              <Clock size={14} className="text-cyan-400 mb-1" />
              <div className="text-[10px] text-slate-400 text-center">Assign→Start</div>
              <div className={cn("text-xs font-bold text-cyan-300")}>
                {soTimeData.assignmentToStart?.toFixed(1) || '0.0'}h
              </div>
            </div>
            <div className={cn(
              "flex flex-col items-center p-2 rounded-lg",
              badgeClasses.bg,
              "border border-blue-400/20"
            )}>
              <Activity size={14} className="text-blue-400 mb-1" />
              <div className="text-[10px] text-slate-400 text-center">Start→Done</div>
              <div className={cn("text-xs font-bold text-blue-300")}>
                {soTimeData.startToComplete?.toFixed(1) || '0.0'}h
              </div>
            </div>
            <div className={cn(
              "flex flex-col items-center p-2 rounded-lg",
              badgeClasses.bg,
              "border border-indigo-400/20"
            )}>
              <CheckCircle size={14} className="text-indigo-400 mb-1" />
              <div className="text-[10px] text-slate-400 text-center">Done→Close</div>
              <div className={cn("text-xs font-bold text-indigo-300")}>
                {soTimeData.completeToClose?.toFixed(1) || '0.0'}h
              </div>
            </div>
          </div>
        </div>

        {/* SLA Target Section */}
        <div className={cn(getSectionContainerClasses(color, isDark))}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn("p-1 rounded-lg", badgeClasses.bg)}>
                <TrendingUp size={14} className={cn(badgeClasses.icon, "group-hover:scale-110 transition-transform duration-300")} />
              </div>
              <span className={cn("text-xs font-bold", badgeClasses.text)}>
                SLA Compliance
              </span>
            </div>
            <span className={cn(
              "text-sm font-bold",
              isMeetingTarget 
                ? (isDark ? "text-emerald-300" : "text-emerald-600")
                : (isDark ? "text-amber-300" : "text-amber-600")
            )}>
              {isMeetingTarget ? '✓ Met' : '⚠ Alert'}
            </span>
          </div>
          <div className={cn(getProgressBarBgClasses(isDark), "h-2 mb-1.5")}>
            <div 
              className={cn(
                "h-full transition-all duration-700 shadow-sm rounded-full relative overflow-hidden",
                isMeetingTarget 
                  ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-emerald-500/30"
                  : "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-amber-500/30"
              )}
              style={{ width: `${Math.min((totalAvgTime / targetTime) * 100, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className={cn(
              "font-medium flex items-center gap-1",
              isMeetingTarget ? "text-emerald-400" : "text-amber-400"
            )}>
              <div className={cn(
                "w-1 h-1 rounded-full",
                isMeetingTarget ? "bg-emerald-400" : "bg-amber-400"
              )} />
              Avg: {totalAvgTime.toFixed(1)}h
            </span>
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-slate-400" />
              Target: {targetTime}h
            </span>
          </div>
        </div>

        {/* Performance Highlights */}
        <div className={cn(getSectionContainerClasses(color, isDark))}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-1 rounded-lg", badgeClasses.bg)}>
              <Activity size={14} className={badgeClasses.icon} />
            </div>
            <span className={cn("text-xs font-bold", badgeClasses.text)}>
              Performance Highlights
            </span>
          </div>
          <div className="space-y-2">
            {/* Fastest This Week */}
            <div className={cn(
              "flex items-center justify-between p-2 rounded-lg",
              badgeClasses.bg,
              "border border-emerald-400/20"
            )}>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-400" />
                <span className="text-xs text-slate-300">Fastest This Week</span>
              </div>
              <span className="text-xs font-bold text-emerald-300">
                {soTimeData.fastestThisWeek?.toFixed(1) || '0.0'}h
              </span>
            </div>
            
            {/* Slowest (Escalated) */}
            {soTimeData.slowest && soTimeData.slowest > targetTime && (
              <div className={cn(
                "flex items-center justify-between p-2 rounded-lg",
                badgeClasses.bg,
                "border border-amber-400/20"
              )}>
                <div className="flex items-center gap-2">
                  <AlertCircle size={14} className="text-amber-400" />
                  <span className="text-xs text-slate-300">Slowest (Escalated)</span>
                </div>
                <span className="text-xs font-bold text-amber-300">
                  {soTimeData.slowest.toFixed(1)}h
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Stats */}
        <div className={cn(
          "mt-4 p-2.5 rounded-lg bg-gradient-to-br from-emerald-500/10 to-teal-500/10",
          isDark ? "border border-emerald-400/30" : "border border-emerald-300/40"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-1 rounded flex-shrink-0", isDark ? "bg-emerald-500/20" : "bg-emerald-100/60")}>
              <Activity size={12} className={isDark ? "text-emerald-300" : "text-emerald-600"} />
            </div>
            <span className={cn("text-sm font-semibold", isDark ? "text-emerald-200" : "text-emerald-700")}>
              Total SO This Month
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={cn("text-2xl font-bold", isDark ? "text-emerald-300" : "text-emerald-600")}>
              {soTimeData.totalSOThisMonth || 0}
            </span>
            {soTimeData.monthlyTrend && (
              <div className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold",
                soTimeData.monthlyTrend > 0 
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-red-500/20 text-red-300"
              )}>
                <TrendingUp size={12} className={soTimeData.monthlyTrend < 0 && "rotate-180"} />
                {Math.abs(soTimeData.monthlyTrend)}%
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SOTimeTrackingCard;
