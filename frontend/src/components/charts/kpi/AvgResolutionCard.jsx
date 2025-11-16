// src/components/charts/kpi/AvgResolutionCard.jsx
// Average Resolution Times KPI Card Component
import React, { memo } from 'react';
import { Clock, Activity, Star, TrendingUp, MapPin, Briefcase } from 'react-feather';
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

const AvgResolutionCard = memo(({ summaryStats, setInsightModal }) => {
  const { isDark } = useTheme();
  const color = 'orange';
  
  if (!summaryStats || !summaryStats.avgResolutionTime) return null;

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
              "ring-2 ring-orange-400/20 group-hover:ring-orange-400/40",
              "transition-all duration-300"
            )}>
              <Clock className="text-orange-300 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <p className={cn(TEXT_STYLES.cardHeader, "text-orange-100 text-xs")}>
                  Avg Resolution Time
                </p>
                {setInsightModal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInsightModal('avg-resolution-time');
                    }}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-300',
                      'hover:scale-110 hover:rotate-12',
                      badgeClasses.bg,
                      badgeClasses.border,
                      isDark ? 'text-orange-300/70 hover:text-orange-200 hover:bg-orange-500/30' : 'text-orange-600 hover:text-orange-700 hover:bg-orange-100'
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
                isDark ? "text-orange-200" : "text-orange-700"
              )}>  
                {summaryStats.avgResolutionTime?.avg_resolution_time_overall ? 
                  `${summaryStats.avgResolutionTime.avg_resolution_time_overall.toFixed(1)}h` : 
                  '0h'}
              </h3>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                badgeClasses.bg,
                badgeClasses.border
              )}>
                <Activity size={12} className="text-orange-400" />
                <span className={cn("text-orange-100 font-semibold")}>
                  {summaryStats.avgResolutionTime?.total_so || 0} SO
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className={cn(
              "flex items-center gap-1.5 p-2 rounded-lg",
              badgeClasses.bg,
              "border border-cyan-400/20"
            )}>
              <Clock size={14} className="text-cyan-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Response</div>
                <div className={cn("text-xs font-bold text-cyan-300 truncate")}>
                  {summaryStats.avgResolutionTime?.avg_response_time_overall ? 
                    `${summaryStats.avgResolutionTime.avg_response_time_overall.toFixed(1)}h` : 
                    '0h'}
                </div>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 p-2 rounded-lg",
              badgeClasses.bg,
              "border border-indigo-400/20"
            )}>
              <Activity size={14} className="text-indigo-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Repair</div>
                <div className={cn("text-xs font-bold text-indigo-300 truncate")}>
                  {summaryStats.avgResolutionTime?.avg_repair_time_overall ? 
                    `${summaryStats.avgResolutionTime.avg_repair_time_overall.toFixed(1)}h` : 
                    '0h'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Top Performers */}
        {summaryStats.avgResolutionTime?.avg_by_engineer && summaryStats.avgResolutionTime.avg_by_engineer.length > 0 && (
          <div className={cn(getSectionContainerClasses(color, isDark), "mb-3")}>
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("p-1 rounded flex-shrink-0", badgeClasses.bg)}>
                <Star size={12} className={badgeClasses.icon} fill="currentColor" />
              </div>
              <span className={cn("text-sm font-semibold", badgeClasses.text)}>
                Top Performers
              </span>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              {summaryStats.avgResolutionTime.avg_by_engineer
                .slice(0, 3)
                .map((eng, idx) => {
                  const resolutionTime = eng.avg_resolution_time || 0;
                  const maxTime = summaryStats.avgResolutionTime.avg_by_engineer[summaryStats.avgResolutionTime.avg_by_engineer.length - 1]?.avg_resolution_time || resolutionTime;
                  const minTime = summaryStats.avgResolutionTime.avg_by_engineer[0]?.avg_resolution_time || 0;
                  const range = maxTime - minTime;
                  const relativePercent = range > 0 ? ((maxTime - resolutionTime) / range) * 100 : 100;
                  const isTop = idx === 0;
                  return (
                    <div key={idx} className={cn(
                      "flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded",
                      isTop ? getBadgeItemClasses(color, isDark).replace('flex items-center gap-1.5 mt-1.5 px-2 py-1', '') : ""
                    )}>
                      {isTop && <Star size={8} style={{ width: 'clamp(8px, 2vw, 10px)', height: 'clamp(8px, 2vw, 10px)' }} className={cn("flex-shrink-0", badgeClasses.icon)} fill="currentColor" />}
                      <span className={cn(
                        "text-[10px] sm:text-xs w-16 sm:w-20 truncate text-right",
                        isTop ? cn(badgeClasses.text, "font-semibold") : (isDark ? "text-slate-400" : "text-gray-600")
                      )} title={eng.engineer}>
                        {eng.engineer}
                      </span>
                      <div className={getProgressBarBgClasses(isDark).replace('w-full h-4', 'flex-1 h-1.5 sm:h-2 rounded-full')}>
                        <div 
                          className={cn(
                            "h-full transition-all duration-500 rounded-full",
                            isTop 
                              ? isDark
                                ? "bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 shadow-lg shadow-orange-500/30"
                                : "bg-gradient-to-r from-orange-500 via-orange-400 to-amber-400 shadow-lg shadow-orange-500/30"
                              : "bg-gradient-to-r from-orange-500 to-amber-400"
                          )}
                          style={{ width: `${relativePercent}%` }}
                        />
                      </div>
                      <span className={cn(
                        "text-[10px] sm:text-xs font-bold w-12 sm:w-16 text-right whitespace-nowrap",
                        isTop ? badgeClasses.text : "text-orange-300"
                      )}>
                        {resolutionTime.toFixed(1)}h
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* By Month Trend */}
        {summaryStats.avgResolutionTime?.by_month && Object.keys(summaryStats.avgResolutionTime.by_month).length > 0 && (
          <div className={cn(getSectionContainerClasses(color, isDark), "mb-2 sm:mb-3 p-2 sm:p-2.5")}>
            <div className="flex items-center gap-1 sm:gap-1.5 mb-1.5">
              <div className={cn("p-0.5 rounded flex-shrink-0", badgeClasses.bg)}>
                <TrendingUp size={10} style={{ width: 'clamp(10px, 2.5vw, 12px)', height: 'clamp(10px, 2.5vw, 12px)' }} className={badgeClasses.icon} />
              </div>
              <span className={cn("text-xs sm:text-sm font-semibold truncate", badgeClasses.text)}>
                Trend Per Bulan
              </span>
            </div>
            <div className="space-y-1 sm:space-y-1.5">
              {Object.entries(summaryStats.avgResolutionTime.by_month)
                .slice(0, 3)
                .map(([month, data]) => (
                  <div key={month} className={cn(
                    "flex items-center justify-between py-0.5 px-0.5 sm:px-1 rounded",
                    isDark ? "bg-slate-800/30" : "bg-gray-100"
                  )}>
                    <span className={cn(
                      "text-[10px] sm:text-xs font-medium truncate",
                      isDark ? badgeClasses.text + '/90' : badgeClasses.text + '/90'
                    )}>{month}</span>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <span className={cn(
                        "text-[10px] sm:text-xs font-bold px-0.5 sm:px-1 py-0.5 rounded whitespace-nowrap",
                        badgeClasses.bg,
                        badgeClasses.text
                      )}>
                        {data.avg_response_time?.toFixed(1) || '0'}h
                      </span>
                      <span className={cn("text-[10px] sm:text-xs", isDark ? badgeClasses.text + '/50' : badgeClasses.text + '/50')}>
                        /
                      </span>
                      <span className={cn(
                        "text-[10px] sm:text-xs font-bold px-0.5 sm:px-1 py-0.5 rounded whitespace-nowrap",
                        badgeClasses.bg,
                        badgeClasses.text
                      )}>
                        {data.avg_repair_time?.toFixed(1) || '0'}h
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* By Region/Area */}
        <div className="grid grid-cols-2 gap-3">
          {summaryStats.avgResolutionTime?.by_region && Object.keys(summaryStats.avgResolutionTime.by_region).length > 0 && (
            <div className={cn(getSectionContainerClasses(color, isDark))}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-1 rounded flex-shrink-0", badgeClasses.bg)}>
                  <MapPin size={12} className={badgeClasses.icon} />
                </div>
                <div className={cn("text-sm font-semibold", badgeClasses.text)}>Best Region</div>
              </div>
              {(() => {
                const bestRegion = Object.entries(summaryStats.avgResolutionTime.by_region)
                  .sort((a, b) => a[1].avg_resolution_time - b[1].avg_resolution_time)[0];
                return bestRegion ? (
                  <>
                    <div className={cn(
                      "text-xs sm:text-sm font-bold truncate mb-0.5",
                      badgeClasses.text
                    )} title={bestRegion[0]}>
                      {bestRegion[0]}
                    </div>
                    <div className={cn(
                      "text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded inline-block whitespace-nowrap",
                      badgeClasses.bg,
                      badgeClasses.text
                    )}>
                      {bestRegion[1].avg_resolution_time?.toFixed(1) || '0'}h
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
          {summaryStats.avgResolutionTime?.by_area && Object.keys(summaryStats.avgResolutionTime.by_area).length > 0 && (
            <div className={cn(getSectionContainerClasses(color, isDark))}>
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("p-1 rounded flex-shrink-0", badgeClasses.bg)}>
                  <Briefcase size={12} className={badgeClasses.icon} />
                </div>
                <div className={cn("text-sm font-semibold", badgeClasses.text)}>Best Area</div>
              </div>
              {(() => {
                const filteredAreas = Object.entries(summaryStats.avgResolutionTime.by_area)
                  .filter(([area, data]) => (data.count || 0) >= 10);
                if (filteredAreas.length === 0) return null;
                const bestArea = filteredAreas.sort((a, b) => a[1].avg_resolution_time - b[1].avg_resolution_time)[0];
                return bestArea ? (
                  <>
                    <div className={cn("text-xs sm:text-sm font-bold truncate mb-0.5", badgeClasses.text)} title={bestArea[0]}>
                      {bestArea[0]}
                    </div>
                    <div className={cn("text-xs px-2 py-1 rounded inline-block whitespace-nowrap", badgeClasses.bg, badgeClasses.text)}>
                      {bestArea[1].avg_resolution_time?.toFixed(1) || '0'}h
                    </div>
                  </>
                ) : null;
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AvgResolutionCard.displayName = 'AvgResolutionCard';

export default AvgResolutionCard;

