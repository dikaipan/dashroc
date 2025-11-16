/**
 * Reusable Bar Chart Component
 * Theme-aware BarChart with consistent styling
 */
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { ChartWrapper } from './ChartWrapper';
import { CHART_COLORS_DARK, CHART_COLORS_LIGHT, getTooltipConfig, getAxisConfig, OPTIMIZED_BAR_PROPS } from '../../utils/chartConfig';
import { limitChartData } from '../../utils/chartOptimization';
import { cn } from '../../constants/styles';

/**
 * ReusableBarChart - Theme-aware BarChart component
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.dataKey - Data key for bars (default: 'value')
 * @param {string} props.nameKey - Data key for X-axis labels (default: 'name')
 * @param {string|Function} props.fill - Bar fill color or function (default: theme-based)
 * @param {number} props.height - Chart height (default: 300)
 * @param {Object} props.margin - Chart margins
 * @param {React.Component} props.tooltipContent - Custom tooltip component
 * @param {boolean} props.showGrid - Show grid (default: true)
 * @param {boolean} props.showLegend - Show legend (default: false)
 * @param {Function} props.renderCell - Custom cell renderer for bars
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.xAxisProps - Additional XAxis props
 * @param {Object} props.yAxisProps - Additional YAxis props
 * @param {boolean} props.isFullscreen - Fullscreen mode for styling (default: false)
 */
export const ReusableBarChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  fill = null,
  height = 300,
  margin = { top: 10, right: 10, left: 0, bottom: 10 },
  tooltipContent = null,
  showGrid = true,
  showLegend = false,
  renderCell = null,
  className = '',
  xAxisProps = {},
  yAxisProps = {},
  isFullscreen = false,
  ...restProps
}) => {
  const { isDark } = useTheme();
  const COLORS = isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  const defaultFill = fill || COLORS[0];
  const tooltipConfig = getTooltipConfig(defaultFill, isFullscreen, isDark);
  const axisConfig = getAxisConfig(isFullscreen, isDark);
  
  // Limit chart data for better performance (max 50 points)
  const optimizedData = limitChartData(data, 50);

  // Default tooltip
  const DefaultTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload[0]) return null;
    
    return (
      <div className={cn(
        'rounded-lg shadow-lg px-3 py-2 border-2',
        isDark ? 'bg-slate-800 border-blue-500' : 'bg-white border-blue-400'
      )}>
        <p className={cn('font-semibold text-sm mb-1', isDark ? 'text-white' : 'text-gray-900')}>
          {label}
        </p>
        <p className={cn('text-xs', isDark ? 'text-slate-300' : 'text-gray-700')}>
          {dataKey}: <span className="font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  };

  if (!optimizedData || optimizedData.length === 0) {
    return (
      <div className={cn('flex items-center justify-center h-full', className)}>
        <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-gray-500')}>
          No data available
        </p>
      </div>
    );
  }

  return (
    <ChartWrapper height={height} className={className}>
      <BarChart data={optimizedData} margin={margin} {...restProps}>
        {showGrid && (
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? '#475569' : '#e2e8f0'} 
            opacity={0.5}
          />
        )}
        <XAxis 
          dataKey={nameKey}
          {...axisConfig}
          {...xAxisProps}
        />
        <YAxis 
          {...axisConfig}
          {...yAxisProps}
        />
        <Tooltip 
          content={tooltipContent || <DefaultTooltip />}
          {...tooltipConfig}
        />
        <Bar 
          dataKey={dataKey} 
          fill={typeof defaultFill === 'string' ? defaultFill : undefined}
          {...OPTIMIZED_BAR_PROPS}
        >
          {renderCell && optimizedData.map((entry, index) => (
            <Cell key={`cell-${index}`} {...renderCell(entry, index)} />
          ))}
        </Bar>
      </BarChart>
    </ChartWrapper>
  );
};

