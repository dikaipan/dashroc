// src/components/charts/kpi/TotalEngineersCard.jsx
// Total Engineers KPI Card Component
import React, { memo } from 'react';
import { Users, CheckCircle, AlertTriangle, MapPin, Target, Briefcase, BarChart2 } from 'react-feather';
import { TEXT_STYLES, cn } from '../../../constants/styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  getKPICardContainerClasses, 
  getDecorativeOverlayClasses, 
  getGlowClasses,
  getSectionContainerClasses,
  getProgressBarBgClasses,
  getBadgeItemClasses
} from '../../../utils/kpiCardStyles';
import { getTextGradient, getBadgeClasses, getIconBoxClasses } from '../../../utils/themeUtils';

const TotalEngineersCard = memo(({ summaryStats, setInsightModal }) => {
  const { isDark } = useTheme();
  const color = 'blue';
  
  if (!summaryStats) return null;

  const badgeClasses = getBadgeClasses(color, isDark);
  const iconBoxClasses = getIconBoxClasses(color, isDark);

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
              "ring-2 ring-blue-400/20 group-hover:ring-blue-400/40",
              "transition-all duration-300"
            )}>
              <Users className="text-blue-300 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <p className={cn(TEXT_STYLES.cardHeader, "text-blue-100 text-xs")}>
                  Total Engineers
                </p>
                {setInsightModal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInsightModal('total-engineers');
                    }}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-300',
                      'hover:scale-110 hover:rotate-12',
                      badgeClasses.bg,
                      badgeClasses.border,
                      isDark ? 'text-blue-300/70 hover:text-blue-200 hover:bg-blue-500/30' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
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
                isDark ? "text-blue-200" : "text-blue-700"
              )}>
                {summaryStats.total}
              </h3>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                badgeClasses.bg,
                badgeClasses.border
              )}>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className={cn("text-blue-100 font-semibold")}>
                  {summaryStats.total > 0 ? Math.round((summaryStats.withTraining / summaryStats.total) * 100) : 0}% Trained
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className={cn(
              "flex items-center gap-1.5 p-2 rounded-lg",
              badgeClasses.bg,
              "border border-emerald-400/20"
            )}>
              <CheckCircle size={14} className="text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Trained</div>
                <div className={cn("text-xs font-bold text-emerald-300 truncate")}>
                  {summaryStats.withTraining}
                </div>
              </div>
            </div>
            {summaryStats.withoutTraining > 0 && (
              <div className={cn(
                "flex items-center gap-1.5 p-2 rounded-lg",
                badgeClasses.bg,
                "border border-amber-400/20"
              )}>
                <AlertTriangle size={14} className="text-amber-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] text-slate-400">Pending</div>
                  <div className={cn("text-xs font-bold text-amber-300 truncate")}>
                    {summaryStats.withoutTraining}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Training Status Section */}
        <div className={cn(getSectionContainerClasses(color, isDark))}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={cn("p-1 rounded-lg", badgeClasses.bg)}>
                <Target size={14} className={cn(badgeClasses.icon, "group-hover:rotate-180 transition-transform duration-500")} />
              </div>
              <span className={cn("text-xs font-bold", badgeClasses.text)}>
                Training Coverage
              </span>
            </div>
            <span className={cn("text-base font-bold", isDark ? "text-blue-200" : "text-blue-700")}>
              {summaryStats.total > 0 ? Math.round((summaryStats.withTraining / summaryStats.total) * 100) : 0}%
            </span>
          </div>
          <div className={cn(getProgressBarBgClasses(isDark), "h-2 mb-1.5")}>
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 transition-all duration-700 shadow-sm shadow-emerald-500/30 rounded-full relative overflow-hidden"
              style={{ width: `${summaryStats.total > 0 ? (summaryStats.withTraining / summaryStats.total) * 100 : 0}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-emerald-400" />
              {summaryStats.withTraining} Trained
            </span>
            {summaryStats.withoutTraining > 0 && (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-amber-400" />
                {summaryStats.withoutTraining} Pending
              </span>
            )}
          </div>
        </div>

        {/* Region Breakdown */}
        {summaryStats.topRegion && (
          <div className={cn(getSectionContainerClasses(color, isDark), "mb-3")}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn('p-1.5 rounded flex-shrink-0', badgeClasses.bg)}>
                  <MapPin size={14} className={badgeClasses.icon} />
                </div>
                <span className={cn(TEXT_STYLES.cardLabel, badgeClasses.text)}>
                  Top Region
                </span>
              </div>
              <span className={cn(TEXT_STYLES.cardMetric, 'px-2 py-1 rounded', badgeClasses.bg, badgeClasses.text)}>
                {summaryStats.topRegion.name}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                  {summaryStats.topRegion.count} engineers
                </span>
                <span className={cn("text-xs font-medium", isDark ? "text-blue-300" : "text-blue-700")}>
                  {((summaryStats.topRegion.count / summaryStats.total) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-slate-600/20 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-400 rounded-full shadow-sm transition-all duration-500"
                  style={{ width: `${(summaryStats.topRegion.count / summaryStats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Experience Level Breakdown */}
        <div className={cn(
          "mt-4 p-2.5 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10",
          isDark ? "border border-cyan-400/30" : "border border-cyan-300/40"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn("p-1 rounded flex-shrink-0", isDark ? "bg-cyan-500/20" : "bg-cyan-100/60")}>
              <BarChart2 size={12} className={isDark ? "text-cyan-300" : "text-cyan-600"} />
            </div>
            <span className={cn("text-sm font-semibold", isDark ? "text-cyan-200" : "text-cyan-700")}>
              Experience Level
            </span>
          </div>
          <div className="space-y-1.5">
            {[
              { key: 'junior', label: 'Junior', color: 'blue', count: summaryStats.byExperienceLevel?.junior || 0 },
              { key: 'mid', label: 'Mid', color: 'cyan', count: summaryStats.byExperienceLevel?.mid || 0 },
              { key: 'senior', label: 'Senior', color: 'indigo', count: summaryStats.byExperienceLevel?.senior || 0 }
            ].map(({ key, label, color: expColor, count }) => {
              const percentage = summaryStats.total > 0 ? (count / summaryStats.total) * 100 : 0;
              return (
                <div key={key} className={cn('flex items-center gap-1.5 p-1.5 rounded', isDark ? 'bg-slate-800/30' : 'bg-gray-100')}>
                  <span className={cn('text-[10px] w-14 text-right font-medium whitespace-nowrap', isDark ? 'text-cyan-200/90' : 'text-cyan-700/90')}>
                    {label}:
                  </span>
                  <div className={getProgressBarBgClasses(isDark).replace('w-full h-4', 'flex-1 h-1.5')}>
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all duration-500 shadow-sm',
                        expColor === 'blue' ? 'bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300' :
                        expColor === 'cyan' ? 'bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-300' :
                        'bg-gradient-to-r from-indigo-500 via-indigo-400 to-indigo-300'
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={cn(
                    'text-[10px] font-bold w-8 text-right px-1 py-0.5 rounded whitespace-nowrap',
                    expColor === 'blue' ? (isDark ? 'text-blue-300 bg-blue-500/10' : 'text-blue-700 bg-blue-100/60') :
                    expColor === 'cyan' ? (isDark ? 'text-cyan-300 bg-cyan-500/10' : 'text-cyan-700 bg-cyan-100/60') :
                    (isDark ? 'text-indigo-300 bg-indigo-500/10' : 'text-indigo-700 bg-indigo-100/60')
                  )}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Vendor Breakdown */}
        {summaryStats.topVendor && (
          <div className={cn(getSectionContainerClasses(color, isDark), "mt-4")}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn('p-1 rounded flex-shrink-0', badgeClasses.bg)}>
                  <Briefcase size={12} className={badgeClasses.icon} />
                </div>
                <span className={cn('text-xs font-semibold', badgeClasses.text)}>
                  Top Vendor
                </span>
              </div>
              <span className={cn('text-xs font-bold px-2 py-0.5 rounded', badgeClasses.bg, badgeClasses.text)}>
                {summaryStats.topVendor.count}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={cn('text-xs flex-1 truncate font-medium', isDark ? badgeClasses.text + '/90' : badgeClasses.text + '/90')}>
                {summaryStats.topVendor.name}
              </span>
              <div className="w-20 h-2 bg-slate-600/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-400 rounded-full shadow-sm transition-all duration-500"
                  style={{ width: `${(summaryStats.topVendor.count / summaryStats.total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

TotalEngineersCard.displayName = 'TotalEngineersCard';

export default TotalEngineersCard;

