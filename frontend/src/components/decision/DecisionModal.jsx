/**
 * Decision Modal Component
 * Fullscreen modal for detailed decision analysis
 */
import React from 'react';
import { X, Award, TrendingUp, AlertTriangle } from 'react-feather';
import { 
  ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { getGradientCard, TEXT_STYLES, cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';

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
                dataKey={isDistanceData ? 'engineer' : isZoneData ? 'zone' : (card.id === 'regional-efficiency' ? 'region' : 'type')} 
                stroke="#94a3b8" 
                angle={-45} 
                textAnchor="end" 
                height={80}
              />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
              <Legend />
              {isDistanceData ? (
                <>
                  <Bar dataKey="sameZone" fill="#10b981" name="Same Zone" />
                  <Bar dataKey="nearZone" fill="#f59e0b" name="Near Zone" />
                  <Bar dataKey="farZone" fill="#ef4444" name="Far Zone" />
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

  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-black/80' : 'bg-black/60'} backdrop-blur-sm z-50 flex items-center justify-center p-4`}>
      <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'} rounded-2xl w-full max-w-7xl max-h-[90vh] overflow-y-auto border shadow-2xl`}>
        {/* Modal Header */}
        <div className={`sticky top-0 ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'} border-b px-8 py-6 flex items-center justify-between z-10`}>
          <div className="flex items-center gap-4">
            <Icon className={`text-${card.color}-${isDark ? '400' : '600'}`} size={32} />
            <div>
              <h2 className={`text-3xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>{card.title}</h2>
              <p className={isDark ? "text-slate-400 mt-1" : "text-gray-600 mt-1"}>{card.summary}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'} rounded-lg transition-colors`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-8 space-y-8">
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

