/**
 * TA Coordinator Card Component
 * Displays TA Coordinator information
 */
import React from 'react';
import { Award, User } from 'react-feather';
import { getGradientCard, TEXT_STYLES, BADGE_STYLES, cn } from '../../constants/styles';

export default function TACoordinatorCard({ coordinator }) {
  const colors = {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    hover: 'hover:border-cyan-400/60',
    shadow: 'hover:shadow-cyan-500/20',
  };

  return (
    <div className="w-full max-w-2xl">
      <div className={cn(
        'bg-gradient-to-br',
        colors.bg,
        'backdrop-blur-sm',
        'p-6',
        'rounded-2xl',
        'border-2',
        colors.border,
        'transition-all duration-300',
        colors.hover,
        'shadow-lg shadow-cyan-500/10'
      )}>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Photo */}
          <div className="relative">
            <div className="w-36 h-48 rounded-2xl overflow-hidden border-3 border-cyan-400/60 shadow-xl shadow-cyan-500/40 bg-gradient-to-b from-slate-700 to-slate-800">
              {coordinator.photo ? (
                <img 
                  src={coordinator.photo} 
                  alt={coordinator.name}
                  className="w-full h-full object-contain object-center"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={cn(
                  coordinator.photo ? 'hidden' : 'flex',
                  'w-full h-full items-center justify-center bg-gradient-to-br from-cyan-500/40 to-cyan-600/20'
                )}
              >
                <Award size={56} className="text-cyan-300" />
              </div>
            </div>
            <div className={cn('absolute -bottom-3 -right-3 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-xl border-2 border-cyan-400/50', BADGE_STYLES.cyan, 'bg-cyan-500/30')}>
              TA COORDINATOR
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className={cn(TEXT_STYLES.heading3, 'mb-2')}>{coordinator.name}</h2>
            <p className={cn('text-base font-medium mb-3', colors.text)}>{coordinator.title}</p>
            <div className={cn('inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30', 'bg-cyan-500/20')}>
              <User size={16} className="text-cyan-300" />
              <span className={cn('text-sm font-medium', 'text-cyan-300')}>Technical Analysis Coordinator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

