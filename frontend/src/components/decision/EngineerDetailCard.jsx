/**
 * Engineer Detail Card Component
 * Displays detailed performance metrics for a single engineer
 */
import React from 'react';
import { Award, CheckCircle, TrendingUp, ArrowRight } from 'react-feather';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../constants/styles';

export default function EngineerDetailCard({ engineer, rank }) {
  const { isDark } = useTheme();
  
  if (!engineer) return null;
  
  // Medal icons based on rank
  const getMedalIcon = () => {
    if (rank === 1) return <Award className="text-yellow-400" size={24} />;
    if (rank === 2) return <Award className="text-gray-300" size={24} />;
    if (rank === 3) return <Award className="text-amber-600" size={24} />;
    return <span className="text-slate-400 font-bold text-lg">#{rank}</span>;
  };
  
  // Get result type and styling
  const getResultInfo = () => {
    if (!engineer.result) return null;
    const result = String(engineer.result).toUpperCase();
    const assessment = engineer.assessment || engineer.role || '';
    
    if (result.includes('STAY')) {
      return {
        type: 'stay',
        text: `STAY (sudah ${assessment || engineer.role})`,
        bgColor: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
        borderColor: isDark ? 'border-blue-500/50' : 'border-blue-300',
        textColor: isDark ? 'text-blue-400' : 'text-blue-700',
        icon: Award,
        iconColor: 'text-blue-400'
      };
    } else if (result.includes('LEVEL UP') || result.includes('LEVELUP')) {
      return {
        type: 'levelup',
        text: `LEVEL UP → ${assessment || engineer.role}`,
        bgColor: isDark ? 'bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-teal-500/20' : 'bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100',
        borderColor: isDark ? 'border-green-500/50' : 'border-green-400',
        textColor: isDark ? 'text-green-400' : 'text-green-700',
        icon: TrendingUp,
        iconColor: 'text-green-400',
        isAnimated: true
      };
    }
    return {
      type: 'other',
      text: result,
      bgColor: isDark ? 'bg-slate-700/50' : 'bg-gray-100',
      borderColor: isDark ? 'border-slate-600' : 'border-gray-300',
      textColor: isDark ? 'text-slate-300' : 'text-gray-700',
      icon: null,
      iconColor: ''
    };
  };
  
  // Check if metric meets threshold (for green checkmark)
  const meetsThreshold = (percentage, threshold = 80) => {
    return percentage >= threshold;
  };
  
  // Format percentage with parentheses showing KPI Achievement
  const formatMetric = (metric, label) => {
    if (!metric) return null;
    const percentage = metric.percentage || 0;
    const kpiAchievement = metric.kpiAchievement || 0;
    const score = metric.score || 0;
    const hasCheckmark = meetsThreshold(percentage, 80);
    
    return (
      <div className="flex items-center justify-between py-0.5 sm:py-1 gap-2 sm:gap-4">
        <span className={cn(isDark ? "text-slate-400" : "text-gray-600", "text-xs sm:text-sm truncate")}>{label}:</span>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {hasCheckmark && <CheckCircle className="text-green-500 flex-shrink-0" size={14} style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }} />}
          <span className={cn(isDark ? "text-slate-200" : "text-gray-900", "text-xs sm:text-sm font-medium whitespace-nowrap")}>
            {percentage.toFixed(2)}%
            {kpiAchievement > 0 && kpiAchievement !== percentage && (
              <span className={cn(isDark ? "text-slate-400" : "text-gray-500", "ml-0.5 sm:ml-1")}>
                ({kpiAchievement.toFixed(0)}%)
              </span>
            )}
          </span>
        </div>
      </div>
    );
  };
  
  const totalScore = engineer.kpiAchievement || engineer.performance || 0;
  
  return (
    <div className={cn(`${isDark ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6 border mb-3 sm:mb-4`)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0">
            {getMedalIcon()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={cn(`text-base sm:text-lg lg:text-xl font-bold truncate ${isDark ? 'text-slate-100' : 'text-gray-900'}`)}>
              Rank {rank}: {engineer.name} ({totalScore.toFixed(2)}%)
            </h3>
            <p className={cn(isDark ? "text-slate-400" : "text-gray-600", "text-xs sm:text-sm truncate")}>
              {engineer.role || 'Engineer'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Result - Moved below name */}
      {engineer.result && (() => {
        const resultInfo = getResultInfo();
        if (!resultInfo) return null;
        
        const Icon = resultInfo.icon;
        const isLevelUp = resultInfo.type === 'levelup';
        
        return (
          <div className="mb-3 sm:mb-4">
            <div className={cn(`${resultInfo.bgColor} ${resultInfo.borderColor} border-2 rounded-lg p-3 sm:p-4 ${isLevelUp ? 'shadow-lg shadow-green-500/20' : ''}`)}>
              <div className="flex items-center gap-2 sm:gap-3">
                {Icon && (
                  <div className={cn(`${resultInfo.iconColor} ${isLevelUp ? 'animate-pulse' : ''} flex-shrink-0`)}>
                    <Icon size={20} style={{ width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)' }} strokeWidth={2.5} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {isLevelUp ? (
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                      <span className={cn(`${resultInfo.textColor} font-bold text-sm sm:text-base lg:text-lg truncate`)}>
                        LEVEL UP
                      </span>
                      <ArrowRight 
                        className={cn(`${resultInfo.iconColor} ${isLevelUp ? 'animate-bounce' : ''} flex-shrink-0`)} 
                        size={16} 
                        style={{ width: 'clamp(16px, 4vw, 20px)', height: 'clamp(16px, 4vw, 20px)' }}
                        strokeWidth={2.5}
                      />
                      <span className={cn(`${resultInfo.textColor} font-semibold text-xs sm:text-sm lg:text-base truncate`)}>
                        {engineer.assessment || engineer.role}
                      </span>
                    </div>
                  ) : (
                    <p className={cn(`${resultInfo.textColor} font-semibold text-xs sm:text-sm lg:text-base truncate`)}>
                      {resultInfo.text}
                    </p>
                  )}
                </div>
                {isLevelUp && (
                  <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                    <span className="text-[10px] sm:text-xs font-bold text-green-400 animate-pulse">✨</span>
                    <span className="text-[10px] sm:text-xs font-bold text-green-400 animate-pulse" style={{ animationDelay: '0.2s' }}>✨</span>
                    <span className="text-[10px] sm:text-xs font-bold text-green-400 animate-pulse" style={{ animationDelay: '0.4s' }}>✨</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
      
      {/* Metrics */}
      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        {engineer.productivity && formatMetric(engineer.productivity, 'Productivity')}
        {engineer.responseTime && formatMetric(engineer.responseTime, 'Response Time')}
        {engineer.resolutionTime && formatMetric(engineer.resolutionTime, 'Resolution Time')}
        {engineer.competency && formatMetric(engineer.competency, 'Competency')}
        {engineer.qualitative && (
          <div className="flex items-center justify-between py-0.5 sm:py-1 gap-2 sm:gap-4">
            <span className={cn(isDark ? "text-slate-400" : "text-gray-600", "text-xs sm:text-sm truncate")}>Qualitative:</span>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {meetsThreshold(engineer.qualitative.percentage || engineer.qualitative.score || 0, 80) && (
                <CheckCircle className="text-green-500 flex-shrink-0" size={14} style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }} />
              )}
              <span className={cn(isDark ? "text-slate-200" : "text-gray-900", "text-xs sm:text-sm font-medium whitespace-nowrap")}>
                {(engineer.qualitative.percentage || engineer.qualitative.score || 0).toFixed(2)}%
                {engineer.qualitative.percentage && engineer.qualitative.score && engineer.qualitative.percentage !== engineer.qualitative.score && (
                  <span className={cn(isDark ? "text-slate-400" : "text-gray-500", "ml-0.5 sm:ml-1")}>
                    ({engineer.qualitative.score.toFixed(0)}%)
                  </span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

