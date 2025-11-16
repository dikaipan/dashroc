// Engineer-Customer Relationship Card
import React, { memo } from 'react';
import { Users, Briefcase, TrendingUp, AlertTriangle, Award, Target, Zap, Shield } from 'react-feather';
import { TEXT_STYLES, cn } from '../../../constants/styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { 
  getKPICardContainerClasses, 
  getDecorativeOverlayClasses, 
  getGlowClasses,
  getSectionContainerClasses,
  getBadgeItemClasses
} from '../../../utils/kpiCardStyles';
import { getBadgeClasses, getIconBoxClasses } from '../../../utils/themeUtils';

const EngineerCustomerCard = memo(({ relationshipData, setInsightModal }) => {
  const { isDark } = useTheme();
  const color = 'indigo';
  
  const badgeClasses = getBadgeClasses(color, isDark);
  const iconBoxClasses = getIconBoxClasses(color, isDark);
  
  // Use placeholder data if not loaded yet
  const isLoading = !relationshipData;
  const {
    total_engineers = 0,
    total_customers = 0,
    total_so = 0,
    top_pairs = [],
    coverage_stats = {},
    risk_analysis = {},
    top_diverse_engineers = []
  } = relationshipData || {};

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
              "ring-2 ring-indigo-400/20 group-hover:ring-indigo-400/40",
              "transition-all duration-300"
            )}>
              <Users className="text-indigo-300 group-hover:scale-110 transition-transform duration-300" size={24} />
            </div>
            <div className="flex-1 text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <p className={cn(TEXT_STYLES.cardHeader, "text-indigo-100 text-xs")}>
                  Engineer-Customer
                </p>
                {setInsightModal && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setInsightModal('engineer-customer');
                    }}
                    className={cn(
                      'p-1.5 rounded-lg transition-all duration-300',
                      'hover:scale-110 hover:rotate-12',
                      badgeClasses.bg,
                      badgeClasses.border,
                      isDark ? 'text-indigo-300/70 hover:text-indigo-200 hover:bg-indigo-500/30' : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-100'
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
                isDark ? "text-indigo-200" : "text-indigo-700",
                isLoading && "animate-pulse"
              )}>
                {isLoading ? '---' : total_so.toLocaleString()}
              </h3>
              <div className={cn(
                "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs",
                badgeClasses.bg,
                badgeClasses.border
              )}>
                <Briefcase size={12} className="text-indigo-400" />
                <span className={cn("text-indigo-100 font-semibold")}>
                  Service Orders
                </span>
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className={cn(
              "flex items-center gap-1.5 p-2 rounded-lg",
              badgeClasses.bg,
              "border border-blue-400/20"
            )}>
              <Users size={14} className="text-blue-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Engineers</div>
                <div className={cn("text-xs font-bold text-blue-300 truncate", isLoading && "animate-pulse")}>
                  {isLoading ? '--' : total_engineers}
                </div>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-1.5 p-2 rounded-lg",
              badgeClasses.bg,
              "border border-purple-400/20"
            )}>
              <Briefcase size={14} className="text-purple-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-[10px] text-slate-400">Customers</div>
                <div className={cn("text-xs font-bold text-purple-300 truncate", isLoading && "animate-pulse")}>
                  {isLoading ? '--' : total_customers}
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* Coverage Stats */}
        <div className={cn(getSectionContainerClasses(color, isDark), "mb-3")}>
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("p-1 rounded-lg", badgeClasses.bg)}>
              <Target size={14} className={cn(badgeClasses.icon, "group-hover:rotate-180 transition-transform duration-500")} />
            </div>
            <span className={cn("text-xs font-bold", badgeClasses.text)}>
              Coverage Statistics
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                Avg Customers/Engineer
              </span>
              <span className={cn("text-sm font-bold", isDark ? "text-indigo-300" : "text-indigo-600", isLoading && "animate-pulse")}>
                {isLoading ? '--' : coverage_stats.avg_customers_per_engineer}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                Avg Engineers/Customer
              </span>
              <span className={cn("text-sm font-bold", isDark ? "text-purple-300" : "text-purple-600", isLoading && "animate-pulse")}>
                {isLoading ? '--' : coverage_stats.avg_engineers_per_customer}
              </span>
            </div>
          </div>
        </div>

        {/* Top Pairs */}
        <div className={cn(getSectionContainerClasses(color, isDark), "mb-3")}>
          <div className="flex items-center gap-2 mb-3">
            <div className={cn("p-1 rounded-lg", badgeClasses.bg)}>
              <Award size={14} className={cn(badgeClasses.icon)} />
            </div>
            <span className={cn("text-xs font-bold", badgeClasses.text)}>
              Top Partnerships
            </span>
          </div>
          <div className="space-y-2">
            {isLoading ? (
              // Loading placeholders
              [0, 1, 2].map((idx) => (
                <div 
                  key={idx}
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg animate-pulse",
                    badgeClasses.bg,
                    "border border-indigo-400/10"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-base opacity-50">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </span>
                    <div className="flex-1">
                      <div className="h-3 bg-indigo-500/20 rounded w-20 mb-1"></div>
                      <div className="h-2 bg-indigo-500/10 rounded w-16"></div>
                    </div>
                  </div>
                  <div className="h-6 w-8 bg-indigo-500/20 rounded"></div>
                </div>
              ))
            ) : (
              top_pairs.slice(0, 3).map((pair, idx) => (
              <div 
                key={idx}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg transition-all duration-300",
                  "hover:scale-[1.02]",
                  badgeClasses.bg,
                  idx === 0 ? "border border-yellow-400/30" : idx === 1 ? "border border-gray-400/20" : "border border-orange-400/20"
                )}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-base">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-xs font-semibold truncate", isDark ? "text-slate-200" : "text-gray-800")}>
                      {pair.engineer}
                    </div>
                    <div className={cn("text-[10px] truncate", isDark ? "text-slate-400" : "text-gray-600")}>
                      → {pair.customer}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "text-xs font-bold px-2 py-1 rounded-md",
                  idx === 0 ? "bg-yellow-500/20 text-yellow-300" : 
                  idx === 1 ? "bg-gray-500/20 text-gray-300" : 
                  "bg-orange-500/20 text-orange-300"
                )}>
                  {pair.so_count}
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Insights */}
        <div className={cn(
          "p-3 rounded-lg space-y-2",
          badgeClasses.bg,
          "border",
          risk_analysis.risk_count > 0 ? "border-yellow-400/30" : "border-emerald-400/30"
        )}>
          <div className="flex items-start gap-2">
            {risk_analysis.risk_count > 0 ? (
              <>
                <div className={cn("p-1 rounded-lg bg-yellow-500/20 shrink-0")}>
                  <AlertTriangle size={12} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-[10px] font-semibold mb-0.5", isDark ? "text-yellow-300" : "text-yellow-600")}>
                    Risk Alert
                  </p>
                  <p className={cn("text-xs", isDark ? "text-slate-300" : "text-gray-700")}>
                    {risk_analysis.risk_count} customers with single engineer
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={cn("p-1 rounded-lg bg-emerald-500/20 shrink-0")}>
                  <Shield size={12} className="text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className={cn("text-[10px] font-semibold mb-0.5", isDark ? "text-emerald-300" : "text-emerald-600")}>
                    All Clear
                  </p>
                  <p className={cn("text-xs", isDark ? "text-slate-300" : "text-gray-700")}>
                    All customers have backup engineers
                  </p>
                </div>
              </>
            )}
          </div>
          {top_diverse_engineers.length > 0 && (
            <div className="flex items-start gap-2 pt-2 border-t border-indigo-400/10">
              <div className={cn("p-1 rounded-lg bg-blue-500/20 shrink-0")}>
                <Zap size={12} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <p className={cn("text-[10px] font-semibold mb-0.5", isDark ? "text-blue-300" : "text-blue-600")}>
                  Top Performer
                </p>
                <p className={cn("text-xs", isDark ? "text-slate-300" : "text-gray-700")}>
                  {top_diverse_engineers[0].engineer} handles {top_diverse_engineers[0].customer_count} customers
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

EngineerCustomerCard.displayName = 'EngineerCustomerCard';

export default EngineerCustomerCard;
