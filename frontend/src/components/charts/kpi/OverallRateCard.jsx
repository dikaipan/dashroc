// src/components/charts/kpi/OverallRateCard.jsx
// Overall Training Rate KPI Card Component
import React, { memo } from 'react';
import { BookOpen, Target, Award, BarChart2, AlertTriangle } from 'react-feather';
import { TEXT_STYLES, cn } from '../../../constants/styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  getKPICardContainerClasses, 
  getDecorativeOverlayClasses, 
  getGlowClasses,
  getSectionContainerClasses,
  getProgressBarBgClasses,
  getBadgeItemClasses,
} from '../../../utils/kpiCardStyles';
import { getTextGradient, getBadgeClasses, getIconBoxClasses } from '../../../utils/themeUtils';

const OverallRateCard = memo(({ summaryStats, allTrainingTypes = [], setInsightModal }) => {
  const { isDark } = useTheme();
  const color = 'purple';
  
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
              "ring-2 ring-purple-400/20 group-hover:ring-purple-400/40",
              "transition-all duration-300"
            )}>
              <BookOpen className="text-purple-300 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <p className={cn(TEXT_STYLES.cardHeader, "text-purple-100 text-xs")}>
                  Overall Training Rate
                </p>
                {setInsightModal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInsightModal('overall-rate');
                    }}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-300',
                      'hover:scale-110 hover:rotate-12',
                      badgeClasses.bg,
                      badgeClasses.border,
                      isDark ? 'text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/30' : 'text-purple-600 hover:text-purple-700 hover:bg-purple-100'
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
                isDark ? "text-purple-200" : "text-purple-700"
              )}>  
                {summaryStats.overallRate}%
              </h3>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                badgeClasses.bg,
                badgeClasses.border
              )}>
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span className={cn("text-purple-100 font-semibold")}>
                  {allTrainingTypes.length} Programs
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
              <Target size={14} className="text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Completed</div>
                <div className={cn("text-xs font-bold text-emerald-300 truncate")}>
                  {summaryStats.totalCompleted}
                </div>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 p-2 rounded-lg",
              badgeClasses.bg,
              "border border-slate-400/20"
            )}>
              <BookOpen size={14} className="text-slate-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Total Possible</div>
                <div className={cn("text-xs font-bold text-slate-300 truncate")}>
                  {summaryStats.totalPossible}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Training Coverage with Visual Progress */}
        <div className={cn(
          getSectionContainerClasses(color, isDark), 
          "hover:bg-purple-500/5 transition-colors duration-300"
        )}>
          <div className="flex items-center justify-between mb-2 sm:mb-2.5 flex-wrap gap-1 sm:gap-0">
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0 flex-1">
              <div className={cn("p-0.5 sm:p-1 rounded flex-shrink-0", badgeClasses.bg)}>
                <Target size={10} style={{ width: 'clamp(10px, 2.5vw, 12px)', height: 'clamp(10px, 2.5vw, 12px)' }} className={badgeClasses.icon} />
              </div>
              <span className={cn("text-xs sm:text-sm font-semibold truncate", badgeClasses.text)}>
                Coverage Training Programs
              </span>
            </div>
            <span className={cn("text-[10px] sm:text-xs font-medium whitespace-nowrap", isDark ? badgeClasses.text + '/80' : badgeClasses.text + '/80')}>
              {summaryStats.totalCompleted} dari {summaryStats.totalPossible} possible
            </span>
          </div>
          <div className={getProgressBarBgClasses(isDark)}>
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300 transition-all duration-500 shadow-sm shadow-purple-500/30"
              style={{ width: `${summaryStats.overallRate}%` }}
            />
          </div>
        </div>
        
        {/* Top Training Programs */}
        {summaryStats.mostCompletedTraining && (
          <div className={cn(getSectionContainerClasses(color, isDark), "mb-3")}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("p-1 rounded flex-shrink-0", badgeClasses.bg)}>
                <Award size={12} className={badgeClasses.icon} fill="currentColor" />
              </div>
              <span className={cn("text-sm font-semibold", badgeClasses.text)}>
                Top Training
              </span>
            </div>
            <div className={cn(
              "p-2 sm:p-2.5 rounded-lg",
              badgeClasses.bg,
              badgeClasses.border
            )}>
              <div className="flex items-center justify-between mb-1 sm:mb-1.5 gap-1 sm:gap-2">
                <span className={cn(
                  "text-[10px] sm:text-xs flex-1 truncate font-semibold",
                  badgeClasses.text
                )} title={summaryStats.mostCompletedTraining.training}>
                  {summaryStats.mostCompletedTraining.training}
                </span>
                <span className={cn(
                  "text-xs sm:text-sm font-bold px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap",
                  badgeClasses.bg,
                  badgeClasses.text
                )}>
                  {summaryStats.mostCompletedTraining.percentage}%
                </span>
              </div>
              <div className={getProgressBarBgClasses(isDark).replace('w-full h-4', 'h-2')}>
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 rounded-full shadow-sm shadow-emerald-500/30 transition-all duration-500"
                  style={{ width: `${summaryStats.mostCompletedTraining.percentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
        
        {/* Training Programs Breakdown */}
        {summaryStats.trainingStats && summaryStats.trainingStats.length > 0 && (
          <div className={cn(getSectionContainerClasses(color, isDark))}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("p-1 rounded flex-shrink-0", badgeClasses.bg)}>
                <BarChart2 size={12} className={badgeClasses.icon} />
              </div>
              <span className={cn("text-sm font-semibold", badgeClasses.text)}>
                Training Breakdown
              </span>
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              {summaryStats.trainingStats.slice(0, 3).map((stat, idx) => {
                const isTop = idx === 0;
                const isLow = idx === summaryStats.trainingStats.length - 1 && 
                  stat.percentage < summaryStats.mostCompletedTraining?.percentage;
                return (
                  <div key={idx} className={cn(
                    "flex items-center gap-1 sm:gap-2 py-0.5 px-0.5 sm:px-1 rounded",
                    isDark ? "bg-slate-800/30" : "bg-gray-100"
                  )}>
                    <span className={cn(
                      "text-[10px] sm:text-xs w-16 sm:w-20 truncate text-right font-medium",
                      isTop ? "text-emerald-200" :
                      isLow ? "text-amber-200" :
                      "text-purple-200"
                    )} title={stat.training}>
                      {stat.training}
                    </span>
                    <div className={getProgressBarBgClasses(isDark).replace('w-full h-4', 'flex-1 h-1.5 sm:h-2')}>
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-500 shadow-sm",
                          isTop ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-lg shadow-emerald-500/30" :
                          isLow ? "bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-lg shadow-amber-500/30" :
                          "bg-gradient-to-r from-purple-500 via-purple-400 to-purple-300"
                        )}
                        style={{ width: `${stat.percentage}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-[10px] sm:text-xs font-bold w-10 sm:w-12 text-right px-0.5 sm:px-1 py-0.5 rounded whitespace-nowrap",
                      badgeClasses.bg,
                      badgeClasses.text
                    )}>
                      {stat.percentage}%
                    </span>
                  </div>
                );
              })}
            </div>
            {summaryStats.leastCompletedTraining && summaryStats.mostCompletedTraining && 
             summaryStats.leastCompletedTraining.percentage < summaryStats.mostCompletedTraining.percentage && (
              <div className={getSectionContainerClasses(color, isDark)}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className={cn("p-0.5 rounded", badgeClasses.bg)}>
                    <AlertTriangle size={12} className={badgeClasses.icon} />
                  </div>
                  <span className={cn("text-xs font-semibold", badgeClasses.text)}>
                    Needs Focus
                  </span>
                </div>
                {summaryStats.trainingStats
                  .filter(stat => stat.percentage === summaryStats.leastCompletedTraining.percentage)
                  .sort((a, b) => a.training.localeCompare(b.training))
                  .map((stat, idx) => (
                    <div key={idx} className={cn(
                      "py-0.5 px-1 rounded-lg transition-all duration-300 hover:scale-[1.02]",
                      badgeClasses.bg,
                      badgeClasses.border
                    )}>
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-xs flex-1 truncate font-medium",
                          badgeClasses.text
                        )} title={stat.training}>
                          {stat.training}
                        </span>
                        <span className={cn(
                          "text-xs font-bold px-1 py-0.5 rounded",
                          badgeClasses.bg,
                          badgeClasses.text
                        )}>
                          {stat.percentage}%
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

OverallRateCard.displayName = 'OverallRateCard';

export default OverallRateCard;

