// src/components/charts/TrainingProgressInsight.jsx
// Comprehensive training progress insight card
import React, { useMemo } from 'react';
import { Award, TrendingUp, Users, CheckCircle, AlertCircle, Target, BarChart2 } from 'react-feather';

const TrainingProgressInsight = ({ engineers = [] }) => {
  // Analyze training data
  const trainingStats = useMemo(() => {
    if (!engineers || engineers.length === 0) {
      return {
        total: 0,
        withTraining: 0,
        withoutTraining: 0,
        completionRate: 0,
        trainingBreakdown: {},
        regionStats: {},
        topTrainings: []
      };
    }

    const stats = {
      total: engineers.length,
      withTraining: 0,
      withoutTraining: 0,
      trainingBreakdown: {},
      regionStats: {},
      trainingCounts: {}
    };

    // Common training types
    const trainingTypes = [
      'Training CRM',
      'Training TCR',
      'Training Cash Sorter',
      'Training EDC',
      'Training POS',
      'Training Komunikasi Dasar'
    ];

    engineers.forEach(engineer => {
      // Get technical skills - handle multiple columns and comma-separated values
      let techSkills = [];
      if (engineer.technical_skills_training) {
        const techStr = String(engineer.technical_skills_training);
        techSkills = techStr.split(',').map(s => s.trim()).filter(s => s && s !== '');
      }
      
      // Get soft skills
      let softSkills = [];
      if (engineer.soft_skills_training) {
        const softStr = String(engineer.soft_skills_training);
        softSkills = softStr.split(',').map(s => s.trim()).filter(s => s && s !== '');
      }
      
      const allSkills = [...techSkills, ...softSkills];
      const hasTraining = allSkills.length > 0;

      if (hasTraining) {
        stats.withTraining++;
      } else {
        stats.withoutTraining++;
      }

      // Count each training type
      trainingTypes.forEach(training => {
        const trainingKey = training.toLowerCase().replace('training ', '').trim();
        const hasTraining = allSkills.some(skill => {
          const skillLower = skill.toLowerCase().trim();
          return skillLower === training.toLowerCase() || 
                 skillLower.includes(trainingKey) ||
                 trainingKey.includes(skillLower.replace('training ', ''));
        });
        
        if (hasTraining) {
          stats.trainingCounts[training] = (stats.trainingCounts[training] || 0) + 1;
        }
      });

      // Region stats
      const region = engineer.region || 'Unknown';
      if (!stats.regionStats[region]) {
        stats.regionStats[region] = {
          total: 0,
          withTraining: 0,
          trainings: {}
        };
      }
      stats.regionStats[region].total++;
      if (hasTraining) {
        stats.regionStats[region].withTraining++;
      }
    });

    // Calculate completion rate
    const completionRate = stats.total > 0 
      ? Math.round((stats.withTraining / stats.total) * 100) 
      : 0;

    // Get top trainings
    const topTrainings = Object.entries(stats.trainingCounts)
      .map(([name, count]) => ({
        name,
        count,
        percentage: Math.round((count / stats.total) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    return {
      total: stats.total,
      withTraining: stats.withTraining,
      withoutTraining: stats.withoutTraining,
      completionRate,
      trainingBreakdown: stats.trainingCounts,
      regionStats: stats.regionStats,
      topTrainings
    };
  }, [engineers]);

  const { 
    total, 
    withTraining, 
    withoutTraining, 
    completionRate, 
    topTrainings,
    regionStats 
  } = trainingStats;

  // Get status color
  const getStatusColor = (rate) => {
    if (rate >= 80) return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', bar: 'from-emerald-500 to-green-600' };
    if (rate >= 60) return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', bar: 'from-blue-500 to-cyan-600' };
    if (rate >= 40) return { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', bar: 'from-amber-500 to-yellow-600' };
    return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', bar: 'from-red-500 to-orange-600' };
  };

  const statusColors = getStatusColor(completionRate);

  return (
    <div className={`bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-2xl border-2 ${statusColors.border} p-6 shadow-xl backdrop-blur-sm`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-14 h-14 rounded-xl ${statusColors.bg} flex items-center justify-center border-2 ${statusColors.border}`}>
            <Award className={statusColors.text} size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Training Progress Insight</h2>
            <p className="text-xs text-slate-400 mt-0.5">Comprehensive training analysis</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${statusColors.bg} border ${statusColors.border}`}>
          <div className={`text-2xl font-bold ${statusColors.text}`}>{completionRate}%</div>
          <div className="text-xs text-slate-400">Completion</div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target size={16} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-200">Overall Training Coverage</span>
          </div>
          <span className="text-sm font-bold text-slate-300">
            {withTraining} / {total} Engineers
          </span>
        </div>
        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${statusColors.bar} rounded-full transition-all duration-700`}
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className="text-slate-400">With Training: <span className="text-green-400 font-semibold">{withTraining}</span></span>
          <span className="text-slate-400">Without: <span className="text-red-400 font-semibold">{withoutTraining}</span></span>
        </div>
      </div>

      {/* Top Training Types */}
      {topTrainings.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Training Distribution</h3>
          </div>
          <div className="space-y-3">
            {topTrainings.map((training, idx) => {
              const trainingName = training.name.replace('Training ', '');
              const barColor = idx === 0 ? 'from-blue-500 to-cyan-600' :
                             idx === 1 ? 'from-purple-500 to-pink-600' :
                             idx === 2 ? 'from-emerald-500 to-green-600' :
                             'from-amber-500 to-yellow-600';
              
              return (
                <div key={training.name} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${barColor}`}></div>
                      <span className="text-xs font-medium text-slate-300">{trainingName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">{training.count}</span>
                      <span className="text-xs font-semibold text-blue-400">{training.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-700`}
                      style={{ width: `${training.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Region Breakdown */}
      {Object.keys(regionStats).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-purple-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">By Region</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(regionStats)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 6)
              .map(([region, stats]) => {
                const regionRate = stats.total > 0 
                  ? Math.round((stats.withTraining / stats.total) * 100) 
                  : 0;
                const regionColors = getStatusColor(regionRate);
                
                return (
                  <div 
                    key={region} 
                    className={`p-3 rounded-lg border ${regionColors.border} ${regionColors.bg} backdrop-blur-sm`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-300 truncate">{region}</span>
                      <span className={`text-xs font-bold ${regionColors.text}`}>{regionRate}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden mb-1.5">
                      <div 
                        className={`h-full bg-gradient-to-r ${regionColors.bar} rounded-full`}
                        style={{ width: `${regionRate}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{stats.withTraining}/{stats.total}</span>
                      <span className={regionColors.text}>trained</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-700/50">
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle size={14} className="text-green-400" />
              <span className="text-lg font-bold text-green-400">{withTraining}</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Trained</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertCircle size={14} className="text-amber-400" />
              <span className="text-lg font-bold text-amber-400">{withoutTraining}</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Pending</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="flex items-center justify-center gap-1 mb-1">
              <TrendingUp size={14} className="text-blue-400" />
              <span className="text-lg font-bold text-blue-400">{topTrainings.length}</span>
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider">Programs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingProgressInsight;

