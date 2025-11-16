/**
 * Reusable Pie Chart Component
 * Theme-aware PieChart with consistent styling
 */
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { ChartWrapper } from './ChartWrapper';
import { CHART_COLORS_DARK, CHART_COLORS_LIGHT, getTooltipConfig, OPTIMIZED_PIE_PROPS } from '../../utils/chartConfig';
import { limitChartData } from '../../utils/chartOptimization';
import { cn } from '../../constants/styles';

/**
 * ReusablePieChart - Theme-aware PieChart component
 * @param {Object} props
 * @param {Array} props.data - Chart data array
 * @param {string} props.dataKey - Data key for values (default: 'value')
 * @param {string} props.nameKey - Data key for labels (default: 'name')
 * @param {Array} props.colors - Color array (default: theme-based)
 * @param {number} props.height - Chart height (default: 300)
 * @param {boolean} props.showLegend - Show legend (default: true)
 * @param {React.Component} props.tooltipContent - Custom tooltip component
 * @param {Function} props.renderCell - Custom cell renderer
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.innerRadius - Inner radius for donut chart (default: 0)
 * @param {number} props.outerRadius - Outer radius (default: 80)
 * @param {boolean} props.isFullscreen - Fullscreen mode for styling (default: false)
 */
export const ReusablePieChart = ({
  data = [],
  dataKey = 'value',
  nameKey = 'name',
  colors = null,
  height = 300,
  showLegend = true,
  tooltipContent = null,
  renderCell = null,
  className = '',
  innerRadius = 0,
  outerRadius = 80,
  isFullscreen = false,
  ...restProps
}) => {
  const { isDark } = useTheme();
  const COLORS = colors || (isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT);
  const tooltipConfig = getTooltipConfig(COLORS[0], isFullscreen, isDark);
  
  // Limit chart data for better performance (max 20 slices for pie charts)
  const optimizedData = limitChartData(data, 20);

  // Default tooltip
  const DefaultTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload[0]) return null;
    
    const data = payload[0].payload;
    return (
      <div className={cn(
        'rounded-lg shadow-lg px-3 py-2 border-2',
        isDark ? 'bg-slate-800 border-blue-500' : 'bg-white border-blue-400'
      )}>
        <p className={cn('font-semibold text-sm mb-1', isDark ? 'text-white' : 'text-gray-900')}>
          {data[nameKey] || data.name}
        </p>
        <p className={cn('text-xs', isDark ? 'text-slate-300' : 'text-gray-700')}>
          {dataKey}: <span className="font-bold">{data[dataKey] || data.value}</span>
        </p>
      </div>
    );
  };

  // Default cell renderer
  const defaultRenderCell = (entry, index) => ({
    key: `cell-${index}`,
    fill: COLORS[index % COLORS.length]
  });

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
      <PieChart {...restProps}>
        <Pie
          data={optimizedData}
          cx="50%"
          cy="50%"
          label={optimizedData.length <= 10 ? ({ percent }) => `${(percent * 100).toFixed(0)}%` : false}
          outerRadius={outerRadius}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          {...OPTIMIZED_PIE_PROPS}
        >
          {optimizedData.map((entry, index) => {
            const cellProps = renderCell 
              ? renderCell(entry, index) 
              : defaultRenderCell(entry, index);
            return <Cell key={`cell-${index}`} {...cellProps} />;
          })}
        </Pie>
        <Tooltip 
          content={tooltipContent || <DefaultTooltip />}
          {...tooltipConfig}
        />
        {showLegend && (
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
            formatter={(value) => <span className={cn(isDark ? 'text-slate-300' : 'text-gray-700', 'text-sm')}>{value}</span>}
          />
        )}
      </PieChart>
    </ChartWrapper>
  );
};

