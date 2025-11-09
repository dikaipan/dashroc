// src/components/charts/SkillProgress.jsx
// Simple and informative training progress display
import React, { useState, useMemo } from 'react';

const SkillProgress = React.memo(function SkillProgress({ engineer }) {
  const [showDetails, setShowDetails] = useState(false);
  
  // Parse training data - memoized to avoid recalculation
  const { technicalSkills, softSkills, allSkills, completedCount, total, pct } = useMemo(() => {
    const tech = engineer.technical_skills_training 
      ? engineer.technical_skills_training.split(',').map(s => s.trim()).filter(s => s) 
      : [];
    const soft = engineer.soft_skills_training 
      ? engineer.soft_skills_training.split(',').map(s => s.trim()).filter(s => s) 
      : [];
    
    // Simulasi skill completion status (bisa dari API)
    const completedSkills = new Set([
      'Training CRM', 'Training Komunikasi Dasar', 'Training TCR'
    ]);
    
    const all = [...tech, ...soft];
    const completed = all.filter(skill => completedSkills.has(skill)).length;
    const t = all.length;
    const percentage = t > 0 ? Math.round((completed / t) * 100) : 0;
    
    return {
      technicalSkills: tech,
      softSkills: soft,
      allSkills: all,
      completedCount: completed,
      total: t,
      pct: percentage
    };
  }, [engineer.technical_skills_training, engineer.soft_skills_training]);
  
  // Progress bar color based on percentage
  const getProgressColor = () => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 50) return 'bg-blue-500';
    if (pct >= 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusColor = () => {
    if (pct >= 80) return 'text-green-400';
    if (pct >= 50) return 'text-blue-400';
    if (pct >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all">
      {/* Header - Simple and Clear */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold text-slate-100 truncate pr-2">
            {engineer.name || engineer.CEName}
          </h3>
          <div className={`text-base font-bold ${getStatusColor()}`}>
            {pct}%
          </div>
        </div>
        <div className="text-xs text-slate-400">
          {engineer.area_group || engineer.AreaGroup} • {engineer.region || engineer.Region}
        </div>
      </div>
      
      {/* Progress Bar - Large and Clear */}
      <div className="mb-3">
        <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`${getProgressColor()} h-2.5 rounded-full transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1.5">
          <span className="text-xs text-slate-300 font-medium">
            {completedCount} dari {total} skills
          </span>
          <span className="text-xs text-slate-400">
            {technicalSkills.length} Technical • {softSkills.length} Soft
          </span>
        </div>
      </div>
      
      {/* Quick Stats - Grid Layout */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center bg-slate-700/30 rounded p-2">
          <div className="text-lg font-bold text-green-400">{technicalSkills.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Technical</div>
        </div>
        <div className="text-center bg-slate-700/30 rounded p-2">
          <div className="text-lg font-bold text-blue-400">{softSkills.length}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Soft</div>
        </div>
        <div className="text-center bg-slate-700/30 rounded p-2">
          <div className="text-lg font-bold text-slate-300">{total}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Total</div>
        </div>
      </div>
      
      {/* Toggle Details Button */}
      {total > 0 && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-xs text-slate-400 hover:text-slate-200 transition-colors py-1.5 border-t border-slate-700/30 flex items-center justify-center gap-1.5"
        >
          <span>{showDetails ? 'Sembunyikan' : 'Lihat'} Detail Skills</span>
          <svg 
            className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
      
      {/* Detailed Skills - Table Format */}
      {showDetails && total > 0 && (
        <div className="mt-3 pt-3 border-t border-slate-700/30">
          {/* Technical Skills Table */}
          {technicalSkills.length > 0 && (
            <div className="mb-3">
              <div className="text-xs font-semibold text-green-400 mb-2">
                Technical Skills ({technicalSkills.length})
              </div>
              <div className="space-y-1">
                {technicalSkills.map((skill, idx) => {
                  const isCompleted = completedSkills.has(skill);
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-700/20"
                    >
                      <span className={isCompleted ? 'text-green-400' : 'text-slate-400'}>
                        {isCompleted ? '✓' : '○'} {skill}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-green-400/70">Selesai</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {/* Soft Skills Table */}
          {softSkills.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-blue-400 mb-2">
                Soft Skills ({softSkills.length})
              </div>
              <div className="space-y-1">
                {softSkills.map((skill, idx) => {
                  const isCompleted = completedSkills.has(skill);
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-700/20"
                    >
                      <span className={isCompleted ? 'text-blue-400' : 'text-slate-400'}>
                        {isCompleted ? '✓' : '○'} {skill}
                      </span>
                      {isCompleted && (
                        <span className="text-[10px] text-blue-400/70">Selesai</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default SkillProgress;
