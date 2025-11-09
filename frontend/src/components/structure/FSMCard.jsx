/**
 * FSM Card Component
 * Displays Field Service Manager information
 */
import React from 'react';
import { Users, Award } from 'react-feather';
import { getGradientCard, TEXT_STYLES, BADGE_STYLES, cn } from '../../constants/styles';

export default function FSMCard({ fsm }) {
  return (
    <div className="w-full max-w-2xl">
      <div className={cn(getGradientCard('indigo', true), 'p-5 rounded-2xl border-2')}>
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Photo */}
          <div className="relative">
            <div className="w-32 h-44 rounded-2xl overflow-hidden border-3 border-indigo-400/50 shadow-lg shadow-indigo-500/30 bg-gradient-to-b from-slate-700 to-slate-800">
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
                <Award size={48} className="text-indigo-300" />
              </div>
            </div>
            <div className={cn('absolute -bottom-2 -right-2 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg', BADGE_STYLES.indigo)}>
              FSM
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <h2 className={cn(TEXT_STYLES.heading3, 'mb-1')}>{fsm.name}</h2>
            <p className={cn('text-base font-medium mb-2', 'text-indigo-300')}>{fsm.title}</p>
            <div className={cn('inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-400/30', 'bg-indigo-500/20')}>
              <Users size={16} className="text-indigo-300" />
              <span className={cn('text-sm font-medium', 'text-indigo-300')}>Field Service Manager</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

