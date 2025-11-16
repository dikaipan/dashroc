/**
 * Decision Card Component
 * Reusable card component for decision analysis
 */
import React, { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, BarChart, Bar } from 'recharts';
import { getGradientCard, TEXT_STYLES, BADGE_STYLES, cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';
import { OPTIMIZED_RADAR_PROPS, OPTIMIZED_BAR_PROPS } from '../../utils/chartConfig';
import { limitChartData } from '../../utils/chartOptimization';

export default function DecisionCard({ card, onClick }) {
  const { isDark } = useTheme();
  const Icon = card.icon;
  const chartContainerRef = useRef(null);
  const [isChartReady, setIsChartReady] = useState(false);

  // Check if chart container has dimensions before rendering
  // Use ResizeObserver to avoid forced reflows
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    let mounted = true;
    let resizeObserver = null;
    let timeoutId = null;
    
    // Use ResizeObserver instead of polling - more efficient and no forced reflow
    if (window.ResizeObserver) {
      resizeObserver = new ResizeObserver((entries) => {
        // Debounce resize events
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        
        timeoutId = setTimeout(() => {
          if (!mounted || !chartContainerRef.current) return;
          
          const entry = entries[0];
          if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            setIsChartReady(true);
          }
        }, 50);
      });
      
      resizeObserver.observe(chartContainerRef.current);
    } else {
      // Fallback: simple timeout without polling
      timeoutId = setTimeout(() => {
        if (mounted && chartContainerRef.current) {
          setIsChartReady(true);
        }
      }, 300);
    }
    
    return () => {
      mounted = false;
      if (resizeObserver && chartContainerRef.current) {
        resizeObserver.unobserve(chartContainerRef.current);
        resizeObserver.disconnect();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  const renderMiniChart = () => {
    if (!card.data || card.data.length === 0) return null;

    // Limit chart data for better performance
    const maxDataPoints = card.chartType === 'radar' ? 3 : 4;
    const optimizedData = limitChartData(card.data, maxDataPoints);

    return (
      <div 
        ref={chartContainerRef}
        className="h-24 w-full" 
        style={{ 
          height: '96px',
          minHeight: '96px', 
          minWidth: '100px', 
          position: 'relative',
          width: '100%',
          display: 'block'
        }}
      >
        {isChartReady && (
          <ResponsiveContainer 
            width="100%" 
            height={96}
            minHeight={96}
            minWidth={100}
          >
            {card.chartType === 'radar' ? (
              <RadarChart data={optimizedData}>
                <PolarGrid stroke={isDark ? "#475569" : "#9ca3af"} />
                <Radar dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} {...OPTIMIZED_RADAR_PROPS} />
              </RadarChart>
            ) : (
              <BarChart data={optimizedData}>
                {card.id === 'distance-analysis' ? (
                  <>
                    <Bar dataKey="sameZone" fill="#10b981" {...OPTIMIZED_BAR_PROPS} />
                    <Bar dataKey="nearZone" fill="#f59e0b" {...OPTIMIZED_BAR_PROPS} />
                    <Bar dataKey="farZone" fill="#ef4444" {...OPTIMIZED_BAR_PROPS} />
                  </>
                ) : (
                  <Bar dataKey={card.id === 'zone-optimization' ? 'machines' : 'total'} fill="#3b82f6" {...OPTIMIZED_BAR_PROPS} />
                )}
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={cn(getGradientCard(card.color, true), 'cursor-pointer group p-4 sm:p-5 lg:p-6')}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
            <Icon className={cn(`text-${card.color}-400`)} size={20} style={{ width: 'clamp(20px, 5vw, 24px)', height: 'clamp(20px, 5vw, 24px)' }} />
            <h3 className={cn(TEXT_STYLES.heading3, "text-base sm:text-lg lg:text-xl truncate")}>{card.title}</h3>
          </div>
          <p className={cn(TEXT_STYLES.bodySmall, "text-xs sm:text-sm")}>{card.summary}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className={cn(
            "transition-colors p-1.5 sm:p-2 rounded flex-shrink-0",
            isDark 
              ? "text-slate-400 hover:bg-slate-700/50"
              : "text-gray-600 hover:bg-gray-200",
            card.color === 'blue' && (isDark ? "hover:text-blue-400 bg-blue-600/20 hover:bg-blue-600/30" : "hover:text-blue-600 bg-blue-100 hover:bg-blue-200"),
            card.color === 'orange' && (isDark ? "hover:text-orange-400 bg-orange-600/20 hover:bg-orange-600/30" : "hover:text-orange-600 bg-orange-100 hover:bg-orange-200"),
            card.color === 'green' && (isDark ? "hover:text-green-400 bg-green-600/20 hover:bg-green-600/30" : "hover:text-green-600 bg-green-100 hover:bg-green-200"),
            card.color === 'purple' && (isDark ? "hover:text-purple-400 bg-purple-600/20 hover:bg-purple-600/30" : "hover:text-purple-600 bg-purple-100 hover:bg-purple-200"),
            card.color === 'red' && (isDark ? "hover:text-red-400 bg-red-600/20 hover:bg-red-600/30" : "hover:text-red-600 bg-red-100 hover:bg-red-200"),
            card.color === 'cyan' && (isDark ? "hover:text-cyan-400 bg-cyan-600/20 hover:bg-cyan-600/30" : "hover:text-cyan-600 bg-cyan-100 hover:bg-cyan-200"),
            (!card.color || card.color === 'default') && (isDark ? "hover:text-blue-400 bg-blue-600/20 hover:bg-blue-600/30" : "hover:text-blue-600 bg-blue-100 hover:bg-blue-200")
          )}
          title="Lihat Insight Detail"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>

      {/* Mini Chart */}
      {renderMiniChart()}

      {/* Metric */}
      <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <p className={cn(TEXT_STYLES.bodySmall, "text-xs sm:text-sm")}>{card.metricLabel}</p>
          <p className={cn('text-xl sm:text-2xl lg:text-3xl font-bold truncate', `text-${card.color}-400`)}>{card.metric}</p>
        </div>
        <div className={cn(BADGE_STYLES[card.color] || BADGE_STYLES.blue, 'text-[10px] sm:text-xs font-medium whitespace-nowrap flex-shrink-0')}>
          Click for details
        </div>
      </div>
    </div>
  );
}

