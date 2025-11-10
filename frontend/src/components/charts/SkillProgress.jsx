// src/components/charts/SkillProgress.jsx
// Innovative, visual-first training progress display
import React, { useState, useMemo } from 'react';
import { ChevronDown, CheckCircle, Circle, Award, User, TrendingUp, Target } from 'react-feather';

const SkillProgress = React.memo(function SkillProgress({ engineer }) {
  const [expanded, setExpanded] = useState(false);
  
  // Simulasi skill completion status (bisa dari API)
  const completedSkillsSet = useMemo(() => {
    return new Set([
      'Training CRM', 
      'Training Komunikasi Dasar', 
      'Training TCR'
    ]);
  }, []);

  // Parse training data - memoized to avoid recalculation
  const { technicalSkills, softSkills, completedCount, total, pct } = useMemo(() => {
    const tech = engineer.technical_skills_training 
      ? engineer.technical_skills_training.split(',').map(s => s.trim()).filter(s => s) 
      : [];
    const soft = engineer.soft_skills_training 
      ? engineer.soft_skills_training.split(',').map(s => s.trim()).filter(s => s) 
      : [];
    
    const all = [...tech, ...soft];
    const completed = all.filter(skill => completedSkillsSet.has(skill)).length;
    const t = all.length;
    const percentage = t > 0 ? Math.round((completed / t) * 100) : 0;
    
    return {
      technicalSkills: tech,
      softSkills: soft,
      completedCount: completed,
      total: t,
      pct: percentage
    };
  }, [engineer.technical_skills_training, engineer.soft_skills_training, completedSkillsSet]);

  // Calculate completion rate for each category
  const techCompleted = technicalSkills.filter(s => completedSkillsSet.has(s)).length;
  const softCompleted = softSkills.filter(s => completedSkillsSet.has(s)).length;
  const techPct = technicalSkills.length > 0 ? Math.round((techCompleted / technicalSkills.length) * 100) : 0;
  const softPct = softSkills.length > 0 ? Math.round((softCompleted / softSkills.length) * 100) : 0;
  
  // Progress ring calculation (for circular progress)
  const circumference = 2 * Math.PI * 18; // radius = 18
  const offset = circumference - (pct / 100) * circumference;

  // Get status color scheme
  const getColorScheme = () => {
    if (pct >= 80) return {
      primary: 'emerald',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      ring: 'stroke-emerald-500',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
    };
    if (pct >= 50) return {
      primary: 'blue',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      ring: 'stroke-blue-500',
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40'
    };
    if (pct >= 30) return {
      primary: 'amber',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      ring: 'stroke-amber-500',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
    };
    return {
      primary: 'red',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
      text: 'text-red-400',
      ring: 'stroke-red-500',
      badge: 'bg-red-500/20 text-red-400 border-red-500/40'
    };
  };

  const colors = getColorScheme();

  return (
    <div className={`group relative overflow-hidden rounded-2xl border-2 ${colors.border} ${colors.bg} backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>

      <div className="relative p-4">
        {/* Header Row - Compact with Circular Progress */}
        <div className="flex items-center gap-4 mb-4">
          {/* Circular Progress Indicator */}
          <div className="relative flex-shrink-0">
            <svg className="transform -rotate-90 w-14 h-14">
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className="text-slate-700/50"
              />
              <circle
                cx="22"
                cy="22"
                r="18"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className={`${colors.ring} transition-all duration-700 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xs font-bold ${colors.text}`}>{pct}%</span>
            </div>
          </div>

          {/* Engineer Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User size={14} className={`${colors.text} flex-shrink-0`} />
              <h3 className="text-sm font-bold text-slate-100 truncate">
                {engineer.name || engineer.CEName || 'Unknown'}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{engineer.area_group || engineer.AreaGroup || 'N/A'}</span>
              <span>•</span>
              <span>{engineer.region || engineer.Region || 'N/A'}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-2.5 py-1 rounded-full border text-xs font-semibold ${colors.badge}`}>
            {pct >= 80 ? '✓' : pct >= 50 ? '→' : '○'}
          </div>
        </div>

        {/* Progress Stats - Horizontal Bars */}
        <div className="space-y-2.5 mb-4">
          {/* Overall Progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Target size={12} className="text-slate-400" />
                <span className="text-xs font-medium text-slate-300">Overall Progress</span>
              </div>
              <span className="text-xs text-slate-400">{completedCount}/{total}</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${
                  pct >= 80 ? 'from-emerald-500 to-green-600' :
                  pct >= 50 ? 'from-blue-500 to-cyan-600' :
                  pct >= 30 ? 'from-amber-500 to-yellow-600' :
                  'from-red-500 to-orange-600'
                } rounded-full transition-all duration-700`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Technical Skills Progress */}
          {technicalSkills.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <Award size={12} className="text-emerald-400" />
                  <span className="text-xs font-medium text-slate-300">Technical</span>
                </div>
                <span className="text-xs text-slate-400">{techCompleted}/{technicalSkills.length}</span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-600 rounded-full transition-all duration-700"
                  style={{ width: `${techPct}%` }}
                />
              </div>
            </div>
          )}

          {/* Soft Skills Progress */}
          {softSkills.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <TrendingUp size={12} className="text-blue-400" />
                  <span className="text-xs font-medium text-slate-300">Soft Skills</span>
                </div>
                <span className="text-xs text-slate-400">{softCompleted}/{softSkills.length}</span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all duration-700"
                  style={{ width: `${softPct}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="text-lg font-bold text-emerald-400">{technicalSkills.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Tech</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="text-lg font-bold text-blue-400">{softSkills.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Soft</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
            <div className="text-lg font-bold text-slate-300">{total}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Total</div>
          </div>
        </div>

        {/* Expandable Details */}
        {total > 0 && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
            >
              <span>{expanded ? 'Hide Details' : 'Show Details'}</span>
              <ChevronDown 
                size={14} 
                className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} 
              />
            </button>

            {expanded && (
              <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4 animate-in slide-in-from-top-2">
                {/* Technical Skills List */}
                {technicalSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                        Technical Skills
                      </span>
                      <span className="text-xs text-slate-500">({technicalSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {technicalSkills.map((skill, idx) => {
                        const isCompleted = completedSkillsSet.has(skill);
                        return (
                          <div
                            key={idx}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                              isCompleted
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                : 'bg-slate-800/40 text-slate-400 border-slate-700/30'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle size={12} className="text-emerald-400" />
                            ) : (
                              <Circle size={12} className="text-slate-500" />
                            )}
                            <span className={isCompleted ? 'line-through opacity-75' : ''}>
                              {skill}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Soft Skills List */}
                {softSkills.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-5 bg-blue-500 rounded-full"></div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                        Soft Skills
                      </span>
                      <span className="text-xs text-slate-500">({softSkills.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {softSkills.map((skill, idx) => {
                        const isCompleted = completedSkillsSet.has(skill);
                        return (
                          <div
                            key={idx}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border transition-all ${
                              isCompleted
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                                : 'bg-slate-800/40 text-slate-400 border-slate-700/30'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle size={12} className="text-blue-400" />
                            ) : (
                              <Circle size={12} className="text-slate-500" />
                            )}
                            <span className={isCompleted ? 'line-through opacity-75' : ''}>
                              {skill}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default SkillProgress;
