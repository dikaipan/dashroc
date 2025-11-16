/**
 * FSM Card Component
 * Displays Field Service Manager information
 */
import React from 'react';
import { Users, Award } from 'react-feather';
import { getGradientCard, TEXT_STYLES, BADGE_STYLES, cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';

export default function FSMCard({ fsm }) {
  const { isDark } = useTheme();
  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <div className={cn(getGradientCard('indigo', true), 'p-4 sm:p-5 lg:p-6 rounded-xl sm:rounded-2xl border-2')}>
        <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4">
          {/* Photo */}
          <div className="relative">
            <div className={cn(
              "w-24 h-32 sm:w-28 sm:h-40 lg:w-32 lg:h-44 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-3 border-indigo-400/50 shadow-lg shadow-indigo-500/30 bg-gradient-to-b",
              isDark ? "from-slate-700 to-slate-800" : "from-gray-200 to-gray-300"
            )}>
              {fsm.photo ? (
                <img 
                  src={fsm.photo} 
                  alt={fsm.name}
                  className="w-full h-full object-contain object-center"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={cn(
                  fsm.photo ? 'hidden' : 'flex',
                  'w-full h-full items-center justify-center bg-indigo-500/30'
                )}
              >
                <Award size={36} style={{ width: 'clamp(36px, 9vw, 48px)', height: 'clamp(36px, 9vw, 48px)' }} className="text-indigo-300" />
              </div>
            </div>
            <div className={cn('absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg', BADGE_STYLES.indigo)}>
              FSM
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center md:text-left min-w-0">
            <h2 className={cn(TEXT_STYLES.heading3, 'mb-1 text-lg sm:text-xl lg:text-2xl truncate')}>{fsm.name}</h2>
            <p className={cn('text-sm sm:text-base font-medium mb-2 truncate', 'text-indigo-300')}>{fsm.title}</p>
            <div className={cn('inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-indigo-400/30', 'bg-indigo-500/20')}>
              <Users size={14} style={{ width: 'clamp(14px, 3.5vw, 16px)', height: 'clamp(14px, 3.5vw, 16px)' }} className="text-indigo-300 flex-shrink-0" />
              <span className={cn('text-xs sm:text-sm font-medium truncate', 'text-indigo-300')}>Field Service Manager</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

