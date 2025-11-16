/**
 * Engineer Insight Modal Component
 * Fullscreen modal for displaying detailed insights for engineer KPIs
 */
import React from 'react';
import { X } from 'react-feather';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../../contexts/ThemeContext';
import { CHART_COLORS_DARK, CHART_COLORS_LIGHT } from "../../utils/chartConfig.js";

const INSIGHT_DESCRIPTIONS = {
  "total-engineers": {
    title: "Analisis Total Engineers",
    description: "Analisis mendalam tentang distribusi engineer berdasarkan region, vendor, dan area group. Membantu memahami komposisi tim dan identifikasi area yang perlu perhatian khusus.",
    color: "text-blue-400",
    icon: "👷"
  },
  "experience": {
    title: "Analisis Pengalaman Engineer",
    description: "Evaluasi komposisi pengalaman team engineer berdasarkan level (Junior, Mid-Level, Senior). Membantu perencanaan pengembangan tim, mentoring program, dan succession planning.",
    color: "text-green-400",
    icon: "⭐"
  },
  "training": {
    title: "Analisis Training Completion",
    description: "Status completion training engineer untuk technical skills dan soft skills. Identifikasi gap kompetensi, prioritas training program, dan engineer yang membutuhkan pengembangan lebih lanjut.",
    color: "text-purple-400",
    icon: "📚"
  }
};

export default function EngineerInsightModal({
  insightType,
  onClose,
  kpis,
  insights
}) {
  const { isDark } = useTheme();
  const COLORS = isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  
  if (!insightType || !kpis || !insights) return null;

  const insightInfo = INSIGHT_DESCRIPTIONS[insightType] || { 
    title: "", 
    description: "", 
    color: "text-blue-400",
    icon: "📊"
  };

  // Helper function to get insight styling
  const getInsightStyle = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400';
      case 'error':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      default:
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
    }
  };

  // Prepare chart data based on insight type
  const getChartData = () => {
    switch (insightType) {
      case 'total-engineers':
        return {
          regionData: kpis.regionStats?.map(stat => ({
            name: stat.region,
            value: stat.count,
            percentage: stat.percentage
          })) || [],
          vendorData: kpis.topVendors?.map(vendor => ({
            name: vendor.vendor,
            value: vendor.count,
            percentage: vendor.percentage
          })) || []
        };
      case 'experience':
        return {
          distributionData: [
            { name: 'Junior', value: kpis.juniorCount || 0, color: '#ef4444' },
            { name: 'Mid-Level', value: kpis.midLevelCount || 0, color: '#eab308' },
            { name: 'Senior', value: kpis.seniorCount || 0, color: '#22c55e' }
          ].filter(item => item.value > 0)
        };
      case 'training':
        return {
          trainingData: [
            { name: 'Complete', value: kpis.completedTraining || 0, color: '#a855f7' },
            { name: 'Technical Only', value: kpis.onlyTechnical || 0, color: '#3b82f6' },
            { name: 'Soft Skills Only', value: kpis.onlySoftSkills || 0, color: '#06b6d4' },
            { name: 'No Training', value: kpis.noTraining || 0, color: '#64748b' }
          ].filter(item => item.value > 0)
        };
      default:
        return {};
    }
  };

  const chartData = getChartData();

  // Get recommendations based on insights
  const getRecommendations = () => {
    const recommendations = [];
    
    switch (insightType) {
      case 'total-engineers':
        if (kpis.regionStats && kpis.regionStats.length > 0) {
          const topRegion = kpis.regionStats[0];
          if (topRegion.percentage > 50) {
            recommendations.push(`Konsentrasi tinggi di ${topRegion.region} - pertimbangkan redistribusi engineer untuk balance`);
          }
        }
        if (kpis.topVendors && kpis.topVendors.length > 0) {
          const topVendor = kpis.topVendors[0];
          if (topVendor.percentage > 40) {
            recommendations.push(`Diversifikasi vendor - ${topVendor.vendor} mendominasi dengan ${topVendor.percentage.toFixed(0)}%`);
          }
        }
        recommendations.push('Monitor distribusi engineer per region untuk optimalisasi coverage');
        recommendations.push('Review kebutuhan engineer berdasarkan workload dan area coverage');
        break;
      
      case 'experience':
        if (kpis.avgExperience < 2) {
          recommendations.push('Prioritaskan mentoring program untuk engineer junior');
          recommendations.push('Pertimbangkan hiring engineer senior untuk balance team');
        } else if (kpis.avgExperience >= 4) {
          recommendations.push('Leverage pengalaman senior untuk mentoring junior engineers');
          recommendations.push('Pertimbangkan advanced training untuk maintain competitiveness');
        }
        if (kpis.juniorCount > 0 && kpis.seniorCount > 0) {
          const juniorPercentage = (kpis.juniorCount / (kpis.juniorCount + kpis.midLevelCount + kpis.seniorCount) * 100);
          if (juniorPercentage > 50) {
            recommendations.push(`Setup pairing program: ${kpis.seniorCount} senior dapat mentor ${kpis.juniorCount} junior`);
          }
        }
        if (kpis.maxExperience > 0 && kpis.minExperience >= 0) {
          const gap = kpis.maxExperience - kpis.minExperience;
          if (gap > 5) {
            recommendations.push('Organize knowledge sharing session untuk bridge experience gap');
          }
        }
        break;
      
      case 'training':
        if (kpis.trainingCompletionRate < 80) {
          recommendations.push(`Tingkatkan training completion dari ${kpis.trainingCompletionRate.toFixed(0)}% menjadi target 80%+`);
        }
        if (kpis.noTraining > 0) {
          recommendations.push(`Urgent: ${kpis.noTraining} engineer belum ada training - prioritaskan immediate training`);
        }
        if (kpis.onlyTechnical > 0 || kpis.onlySoftSkills > 0) {
          const incompleteCount = kpis.onlyTechnical + kpis.onlySoftSkills;
          recommendations.push(`${incompleteCount} engineer perlu complete training (${kpis.onlyTechnical} technical only, ${kpis.onlySoftSkills} soft skills only)`);
        }
        recommendations.push('Setup tracking system untuk monitor progress training completion');
        recommendations.push('Implementasi reward system untuk engineer yang complete training');
        break;
    }
    
    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-black/90' : 'bg-black/60'} backdrop-blur-md flex items-center justify-center z-[9999] p-4`} style={{ zIndex: 9999 }}>
      <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'} rounded-2xl w-full max-w-7xl h-[90vh] p-8 relative shadow-2xl border flex flex-col`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors text-2xl font-bold rounded-lg w-10 h-10 flex items-center justify-center z-10`}
          title="Close"
        >
          ✕
        </button>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Title & Description Section */}
          <div className={`mb-6 pb-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 flex items-center gap-2`}>
              <span>{insightInfo.icon}</span> {insightInfo.title}
            </h2>
            <p className={isDark ? "text-slate-300 text-sm leading-relaxed" : "text-gray-700 text-sm leading-relaxed"}>
              {insightInfo.description}
            </p>
          </div>

          {/* Key Insights Section */}
          {insights[insightType] && insights[insightType].length > 0 && (
            <div className={`mb-6 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <span>💡</span> Key Insights
              </h3>
              <div className="space-y-3">
                {insights[insightType].map((insight, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border ${getInsightStyle(insight.type)}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-base flex-shrink-0">{insight.icon}</span>
                      <span className="flex-1 leading-relaxed text-sm">{insight.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Charts Section */}
          {insightType === 'total-engineers' && (chartData.regionData.length > 0 || chartData.vendorData.length > 0) && (
            <div className="mb-6 space-y-6">
              {chartData.regionData.length > 0 && (
                <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl border p-6`}>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4`}>
                    📍 Distribusi per Region
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.regionData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#475569" : "#e5e7eb"} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: isDark ? "#94a3b8" : "#6b7280", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fill: isDark ? "#94a3b8" : "#6b7280", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          border: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          color: isDark ? "#f1f5f9" : "#1f2937"
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              {chartData.vendorData.length > 0 && (
                <div className={`${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl border p-6`}>
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4`}>
                    🏢 Top Vendors
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData.vendorData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#475569" : "#e5e7eb"} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: isDark ? "#94a3b8" : "#6b7280", fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis tick={{ fill: isDark ? "#94a3b8" : "#6b7280", fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? "#1e293b" : "#ffffff",
                          border: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
                          borderRadius: "8px",
                          color: isDark ? "#f1f5f9" : "#1f2937"
                        }}
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {insightType === 'experience' && chartData.distributionData && chartData.distributionData.length > 0 && (
            <div className={`mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl border p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4`}>
                ⭐ Distribusi Experience
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.distributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      border: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      color: isDark ? "#f1f5f9" : "#1f2937"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {insightType === 'training' && chartData.trainingData && chartData.trainingData.length > 0 && (
            <div className={`mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl border p-6`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4`}>
                📚 Distribusi Training
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.trainingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.trainingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1e293b" : "#ffffff",
                      border: `1px solid ${isDark ? "#475569" : "#e5e7eb"}`,
                      borderRadius: "8px",
                      color: isDark ? "#f1f5f9" : "#1f2937"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Breakdown Data Tables */}
          {insightType === 'total-engineers' && kpis.regionStats && kpis.regionStats.length > 0 && (
            <div className={`mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <span>📊</span> Breakdown Detail
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
                      <th className={`text-left p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Region</th>
                      <th className={`text-right p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Jumlah</th>
                      <th className={`text-right p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpis.regionStats.map((stat, idx) => (
                      <tr key={idx} className={`border-b ${isDark ? 'border-slate-700/50 hover:bg-slate-700/30' : 'border-gray-300/50 hover:bg-gray-100'}`}>
                        <td className={`p-2 ${isDark ? 'text-slate-200' : 'text-gray-900'}`}>{stat.region}</td>
                        <td className={`p-2 text-right font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{stat.count}</td>
                        <td className={`p-2 text-right ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{stat.percentage.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Experience Breakdown Table */}
          {insightType === 'experience' && (
            <div className={`mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <span>📊</span> Breakdown Detail
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white'} border ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Average Experience</div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {kpis.avgExperience?.toFixed(1) || '0.0'} years
                  </div>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white'} border ${isDark ? 'border-slate-600' : 'border-gray-200'}`}>
                  <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Median Experience</div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                    {kpis.medianExperience?.toFixed(1) || '0.0'} years
                  </div>
                </div>
                {(kpis.minExperience > 0 || kpis.maxExperience > 0) && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white'} border ${isDark ? 'border-slate-600' : 'border-gray-200'} md:col-span-2`}>
                    <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Experience Range</div>
                    <div className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-gray-900'}`}>
                      {kpis.minExperience?.toFixed(1) || '0.0'} - {kpis.maxExperience?.toFixed(1) || '0.0'} years
                    </div>
                  </div>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
                      <th className={`text-left p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Level</th>
                      <th className={`text-left p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Range Experience</th>
                      <th className={`text-right p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Jumlah</th>
                      <th className={`text-right p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { 
                        level: 'Junior', 
                        count: kpis.juniorCount || 0, 
                        color: 'text-red-400',
                        range: '0 - 2 tahun',
                        min: 0,
                        max: 2
                      },
                      { 
                        level: 'Mid-Level', 
                        count: kpis.midLevelCount || 0, 
                        color: 'text-yellow-400',
                        range: '2 - 4 tahun',
                        min: 2,
                        max: 4
                      },
                      { 
                        level: 'Senior', 
                        count: kpis.seniorCount || 0, 
                        color: 'text-green-400',
                        range: '4+ tahun',
                        min: 4,
                        max: null
                      }
                    ].filter(item => item.count > 0).map((item, idx) => {
                      const total = (kpis.juniorCount || 0) + (kpis.midLevelCount || 0) + (kpis.seniorCount || 0);
                      const percentage = total > 0 ? (item.count / total * 100) : 0;
                      return (
                        <tr key={idx} className={`border-b ${isDark ? 'border-slate-700/50 hover:bg-slate-700/30' : 'border-gray-300/50 hover:bg-gray-100'}`}>
                          <td className={`p-2 ${item.color} font-medium`}>{item.level}</td>
                          <td className={`p-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{item.range}</td>
                          <td className={`p-2 text-right font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{item.count}</td>
                          <td className={`p-2 text-right ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{percentage.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Detail Perhitungan per Level */}
              <div className="mt-6 pt-6 border-t border-slate-700/50">
                <h4 className={`text-md font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                  <span>🔢</span> Detail Perhitungan per Level
                </h4>
                <div className="space-y-4">
                  {(() => {
                    // Calculate min/max experience for each level
                    // allExperiences is already an array of numbers from the hook
                    const allExperiences = Array.isArray(kpis.allExperiences) ? kpis.allExperiences : [];
                    
                    const juniorExps = allExperiences.filter(exp => exp >= 0 && exp < 2);
                    const midLevelExps = allExperiences.filter(exp => exp >= 2 && exp < 4);
                    const seniorExps = allExperiences.filter(exp => exp >= 4);
                    
                    const getMinMax = (exps) => {
                      if (exps.length === 0) return { min: null, max: null };
                      return {
                        min: Math.min(...exps),
                        max: Math.max(...exps)
                      };
                    };
                    
                    const juniorRange = getMinMax(juniorExps);
                    const midLevelRange = getMinMax(midLevelExps);
                    const seniorRange = getMinMax(seniorExps);
                    
                    return [
                      {
                        level: 'Junior',
                        count: kpis.juniorCount || 0,
                        color: 'text-red-400',
                        bgColor: 'bg-red-500/10',
                        borderColor: 'border-red-500/30',
                        range: '0 - 2 tahun',
                        actualRange: juniorRange,
                        engineers: juniorExps.length
                      },
                      {
                        level: 'Mid-Level',
                        count: kpis.midLevelCount || 0,
                        color: 'text-yellow-400',
                        bgColor: 'bg-yellow-500/10',
                        borderColor: 'border-yellow-500/30',
                        range: '2 - 4 tahun',
                        actualRange: midLevelRange,
                        engineers: midLevelExps.length
                      },
                      {
                        level: 'Senior',
                        count: kpis.seniorCount || 0,
                        color: 'text-green-400',
                        bgColor: 'bg-green-500/10',
                        borderColor: 'border-green-500/30',
                        range: '4+ tahun',
                        actualRange: seniorRange,
                        engineers: seniorExps.length
                      }
                    ].filter(item => item.count > 0).map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border ${item.bgColor} ${item.borderColor}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className={`font-semibold ${item.color}`}>{item.level}</h5>
                          <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {item.count} engineer{item.count > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Kriteria Range:</span>
                            <span className={isDark ? 'text-slate-200' : 'text-gray-800'}>{item.range}</span>
                          </div>
                          {item.actualRange.min !== null && item.actualRange.max !== null && (
                            <div className="flex items-center justify-between">
                              <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Range Aktual:</span>
                              <span className={`font-medium ${item.color}`}>
                                {item.actualRange.min.toFixed(1)} - {item.actualRange.max.toFixed(1)} tahun
                              </span>
                            </div>
                          )}
                          {item.actualRange.min === null && item.actualRange.max === null && (
                            <div className="flex items-center justify-between">
                              <span className={isDark ? 'text-slate-400' : 'text-gray-600'}>Range Aktual:</span>
                              <span className={isDark ? 'text-slate-500' : 'text-gray-500'}>Tidak ada data</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Training Breakdown Table */}
          {insightType === 'training' && (
            <div className={`mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <span>📊</span> Breakdown Detail
              </h3>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-slate-700/50' : 'bg-white'} border ${isDark ? 'border-slate-600' : 'border-gray-200'} mb-4`}>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-1`}>Training Completion Rate</div>
                <div className={`text-3xl font-bold ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                  {kpis.trainingCompletionRate?.toFixed(1) || '0.0'}%
                </div>
                <div className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                  {kpis.completedTraining || 0} of {kpis.totalEngineers || 0} engineers completed
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className={`border-b ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
                      <th className={`text-left p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Status</th>
                      <th className={`text-right p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Jumlah</th>
                      <th className={`text-right p-2 ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Persentase</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { status: 'Complete', count: kpis.completedTraining || 0, color: 'text-purple-400' },
                      { status: 'Technical Only', count: kpis.onlyTechnical || 0, color: 'text-blue-400' },
                      { status: 'Soft Skills Only', count: kpis.onlySoftSkills || 0, color: 'text-cyan-400' },
                      { status: 'No Training', count: kpis.noTraining || 0, color: 'text-slate-500' }
                    ].filter(item => item.count > 0).map((item, idx) => {
                      const total = kpis.totalEngineers || 0;
                      const percentage = total > 0 ? (item.count / total * 100) : 0;
                      return (
                        <tr key={idx} className={`border-b ${isDark ? 'border-slate-700/50 hover:bg-slate-700/30' : 'border-gray-300/50 hover:bg-gray-100'}`}>
                          <td className={`p-2 ${item.color} font-medium`}>{item.status}</td>
                          <td className={`p-2 text-right font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{item.count}</td>
                          <td className={`p-2 text-right ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>{percentage.toFixed(1)}%</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cross-Analysis Insights */}
          {insights.crossAnalysis && insights.crossAnalysis.length > 0 && (
            <div className="mb-6 space-y-2">
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <span>🔍</span> Cross-Analysis Insights
              </h3>
              {insights.crossAnalysis.map((insight, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border ${getInsightStyle(insight.type)}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base flex-shrink-0">{insight.icon}</span>
                    <span className="flex-1 leading-relaxed text-sm">{insight.text}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations Section */}
          {recommendations.length > 0 && (
            <div className={`${isDark ? 'bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/30' : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-300'} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <span>🎯</span> Rekomendasi & Action Items
              </h3>
              <ul className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'} flex items-center justify-center text-sm font-semibold`}>
                      {idx + 1}
                    </span>
                    <span className={isDark ? "text-slate-300" : "text-gray-700"}>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

