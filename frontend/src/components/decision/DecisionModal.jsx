/**
 * Decision Modal Component
 * Fullscreen modal for detailed decision analysis
 */
import React from 'react';
import { X, Award, TrendingUp, AlertTriangle, MapPin, Users, Package } from 'react-feather';
import { 
  ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { getGradientCard, TEXT_STYLES, cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';
import EngineerDetailCard from './EngineerDetailCard';

// Custom Tooltip Component for Distance Analysis
const CustomDistanceTooltip = ({ active, payload, label, cardData }) => {
  const { isDark } = useTheme();
  
  if (!active || !payload || !payload.length) return null;
  
  const areaData = cardData?.find(d => d.areaGroup === label);
  if (!areaData) return null;
  
  // Group payload by category - now zone maps to distance
  const zoneData = payload.filter(p => ['0-60km', '60-120km', '>120km'].includes(p.name));
  
  const getColorForCategory = (name) => {
    const colors = {
      '0-60km': '#10b981',
      '60-120km': '#f59e0b',
      '>120km': '#ef4444'
    };
    return colors[name] || '#94a3b8';
  };
  
  const getIconForCategory = (name) => {
    if (name.includes('km')) return '📏';
    return '📊';
  };
  
  return (
    <div 
      className={cn(
        "rounded-xl shadow-2xl border-2 overflow-hidden backdrop-blur-md",
        isDark 
          ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-slate-600 shadow-blue-500/20" 
          : "bg-gradient-to-br from-white via-blue-50 to-white border-blue-200 shadow-blue-500/10"
      )}
    >
      {/* Header */}
      <div className={cn(
        "px-5 py-4 border-b",
        isDark ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-slate-700" : "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-200"
      )}>
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={18} className={isDark ? "text-blue-400" : "text-blue-600"} />
          <h4 className={cn("font-bold text-lg", isDark ? "text-slate-100" : "text-gray-900")}>
            {label}
          </h4>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Package size={14} className={isDark ? "text-slate-400" : "text-gray-600"} />
            <span className={isDark ? "text-slate-300" : "text-gray-700"}>
              <span className="font-semibold">{areaData.total || 0}</span> Mesin
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className={isDark ? "text-slate-400" : "text-gray-600"} />
            <span className={isDark ? "text-slate-300" : "text-gray-700"}>
              <span className="font-semibold">{areaData.engineers || 0}</span> Engineer
            </span>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="px-5 py-4 space-y-4">
        {/* Zone/Distance Categories (combined) */}
        {zoneData.length > 0 && (
          <div>
            <h5 className={cn("text-xs font-semibold uppercase tracking-wide mb-2", isDark ? "text-slate-400" : "text-gray-600")}>
              Kategori Distance
            </h5>
            <div className="space-y-2">
              {zoneData.map((entry, idx) => {
                const color = getColorForCategory(entry.name);
                return (
                  <div key={idx} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm"
                        style={{ 
                          backgroundColor: color,
                          boxShadow: `0 0 0 2px ${color}40, 0 0 0 4px ${isDark ? '#1e293b' : '#ffffff'}`
                        }}
                      />
                      <span className={cn("text-sm font-medium", isDark ? "text-slate-300" : "text-gray-700")}>
                        {entry.name}
                      </span>
                    </div>
                    <span className={cn("text-sm font-bold", isDark ? "text-slate-100" : "text-gray-900")}>
                      {entry.value?.toLocaleString() || 0} mesin
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function DecisionModal({ card, onClose }) {
  const { isDark } = useTheme();
  if (!card) return null;

  const renderChart = () => {
    if (!card.data || card.data.length === 0) {
      return <div className={isDark ? "text-slate-400 text-center py-20" : "text-gray-600 text-center py-20"}>No data available</div>;
    }

    switch (card.chartType) {
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={card.data}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
              <PolarRadiusAxis stroke="#64748b" />
              <Radar name="Performance" dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Radar name="Experience" dataKey="experience" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        const isDistanceData = card.id === 'distance-analysis';
        const isZoneData = card.id === 'zone-optimization';
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={card.data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey={isDistanceData ? 'areaGroup' : isZoneData ? 'zone' : (card.id === 'regional-efficiency' ? 'region' : 'type')} 
                stroke="#94a3b8" 
                angle={-45} 
                textAnchor="end" 
                height={80}
              />
              <YAxis stroke="#94a3b8" />
              {isDistanceData ? (
                <Tooltip 
                  content={(props) => <CustomDistanceTooltip {...props} cardData={card.data} />}
                  cursor={{ fill: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}
                />
              ) : (
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    border: isDark ? '1px solid #334155' : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                  }}
                />
              )}
              <Legend />
              {isDistanceData ? (
                <>
                  <Bar dataKey="sameZone" fill="#10b981" name="0-60km" />
                  <Bar dataKey="nearZone" fill="#f59e0b" name="60-120km" />
                  <Bar dataKey="farZone" fill="#ef4444" name=">120km" />
                </>
              ) : isZoneData ? (
                <>
                  <Bar dataKey="machines" fill="#3b82f6" name="Total Machines" />
                  <Bar dataKey="engineers" fill="#10b981" name="Engineers" />
                  <Bar dataKey="needsAttention" fill="#ef4444" name="Needs Attention" />
                </>
              ) : card.id === 'regional-efficiency' ? (
                <>
                  <Bar dataKey="engineers" fill="#3b82f6" name="Engineers" />
                  <Bar dataKey="machines" fill="#8b5cf6" name="Machines" />
                  <Bar dataKey="efficiency" fill="#10b981" name="Efficiency %" />
                </>
              ) : (
                <>
                  <Bar dataKey="total" fill="#3b82f6" name="Total Units" />
                  <Bar dataKey="warrantyRate" fill="#10b981" name="Warranty %" />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const Icon = card.icon;

  // Check if this is Top Engineer Performance card
  const isEngineerPerformance = card.id === 'engineer-performance';
  
  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm z-50 flex items-center justify-center ${isEngineerPerformance ? 'p-0' : 'p-4'}`}>
      <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'} ${isEngineerPerformance ? 'rounded-none w-full h-full max-w-none max-h-none' : 'rounded-2xl w-full max-w-7xl max-h-[90vh]'} overflow-y-auto border shadow-2xl`}>
        {/* Modal Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'} border-b ${isEngineerPerformance ? 'px-6 py-4' : 'px-8 py-6'} flex items-center justify-between z-10`}>
          <div className="flex items-center gap-4">
            <Icon className={`text-${card.color}-${isDark ? '400' : '600'}`} size={isEngineerPerformance ? 28 : 32} />
            <div>
              <h2 className={`${isEngineerPerformance ? 'text-2xl' : 'text-3xl'} font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{card.title}</h2>
              <p className={`${isDark ? "text-slate-400" : "text-gray-600"} ${isEngineerPerformance ? "text-sm mt-0.5" : "mt-1"}`}>{card.summary}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`${isEngineerPerformance ? 'p-1.5' : 'p-2'} ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'} rounded-lg transition-colors`}
          >
            <X size={isEngineerPerformance ? 20 : 24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className={`${isEngineerPerformance ? 'p-6 space-y-6' : 'p-8 space-y-8'}`}>
          {/* Description */}
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-3 flex items-center gap-2`}>
              <Award size={20} className={isDark ? "text-blue-400" : "text-blue-600"} />
              Deskripsi
            </h3>
            <p className={isDark ? "text-slate-300 leading-relaxed" : "text-gray-700 leading-relaxed"}>{card.description}</p>
          </div>

          {/* Chart */}
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-6`}>Data Visualization</h3>
            {renderChart()}
          </div>

          {/* Engineer Details (for Top Engineer Performance) */}
          {card.id === 'engineer-performance' && card.data && card.data.length > 0 && (
            <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-6`}>
                Top Engineer Performance Details
              </h3>
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {card.data.map((engineer, index) => (
                  <EngineerDetailCard 
                    key={engineer.name || index} 
                    engineer={engineer} 
                    rank={index + 1} 
                  />
                ))}
              </div>
            </div>
          )}

          {/* Analysis */}
          <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl p-6 border`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
              <TrendingUp size={20} className={isDark ? "text-green-400" : "text-green-600"} />
              Analisa Data
            </h3>
            <ul className="space-y-3">
              {card.analysis.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className={isDark ? "text-green-400 mt-1" : "text-green-600 mt-1"}>•</span>
                  <span className={isDark ? "text-slate-300" : "text-gray-700"}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className={getGradientCard('blue', false)}>
            <h3 className={`${isDark ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-4 flex items-center gap-2`}>
              <AlertTriangle size={20} className={isDark ? "text-yellow-400" : "text-yellow-600"} />
              Rekomendasi & Action Items
            </h3>
            <ul className="space-y-3">
              {card.recommendations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'} flex items-center justify-center text-sm font-semibold`}>
                    {idx + 1}
                  </span>
                  <span className={isDark ? "text-slate-300" : "text-gray-700"}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

