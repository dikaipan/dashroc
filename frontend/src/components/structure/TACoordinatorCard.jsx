/**
 * TA Coordinator Card Component
 * Displays TA Coordinator information
 */
import React from 'react';
import { Award, User } from 'react-feather';
import { getGradientCard, TEXT_STYLES, BADGE_STYLES, cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';

export default function TACoordinatorCard({ coordinator }) {
  const { isDark } = useTheme();
  const colors = {
    bg: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/40',
    text: 'text-cyan-400',
    hover: 'hover:border-cyan-400/60',
    shadow: 'hover:shadow-cyan-500/20',
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <div className={cn(
        'bg-gradient-to-br',
        colors.bg,
        'backdrop-blur-sm',
        'p-4 sm:p-5 lg:p-6',
        'rounded-xl sm:rounded-2xl',
        'border-2',
        colors.border,
        'transition-all duration-300',
        colors.hover,
        'shadow-lg shadow-cyan-500/10'
      )}>
        <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
          {/* Photo */}
          <div className="relative">
            <div className={cn(
              "w-28 h-36 sm:w-32 sm:h-44 lg:w-36 lg:h-48 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 border-cyan-400/60 shadow-xl shadow-cyan-500/40 bg-gradient-to-b",
              isDark ? "from-slate-700 to-slate-800" : "from-gray-200 to-gray-300"
            )}>
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
                <Award size={42} style={{ width: 'clamp(42px, 10.5vw, 56px)', height: 'clamp(42px, 10.5vw, 56px)' }} className="text-cyan-300" />
              </div>
            </div>
            <div className={cn('absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 text-white px-2 py-1 sm:px-4 sm:py-1.5 rounded-full text-[9px] sm:text-xs font-bold shadow-xl border-2 border-cyan-400/50', BADGE_STYLES.cyan, 'bg-cyan-500/30')}>
              TA COORDINATOR
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <h2 className={cn(TEXT_STYLES.heading3, 'mb-1 sm:mb-2 text-lg sm:text-xl lg:text-2xl truncate')}>{coordinator.name}</h2>
            <p className={cn('text-sm sm:text-base font-medium mb-2 sm:mb-3 truncate', colors.text)}>{coordinator.title}</p>
            <div className={cn('inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-cyan-400/30', 'bg-cyan-500/20')}>
              <User size={14} style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }} className="text-cyan-300 flex-shrink-0" />
              <span className={cn('text-xs sm:text-sm font-medium truncate', 'text-cyan-300')}>Technical Analysis Coordinator</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

