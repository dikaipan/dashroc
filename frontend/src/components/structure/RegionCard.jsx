/**
 * Region Card Component
 * Displays region coordinator and team information
 */
import React from 'react';
import { Briefcase } from 'react-feather';
import { getColorMap } from '../../utils/structureUtils';
import { cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';

export default function RegionCard({ region }) {
  const { isDark } = useTheme();
  const colors = getColorMap()[region.color];

  return (
    <div className="flex flex-col w-full">
      {/* Region Header */}
      <div className={cn(`bg-gradient-to-br ${colors.bg} backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border ${colors.border} ${colors.hover} ${colors.shadow} hover:shadow-lg transition-all duration-300`)}>
        <div className="text-center">
          {/* Photo */}
          <div className="relative inline-block mb-2 sm:mb-3">
            <div className={cn(
              "w-16 h-22 sm:w-20 sm:h-28 rounded-lg sm:rounded-xl overflow-hidden border-2 shadow-md bg-gradient-to-b",
              isDark ? "border-slate-700 from-slate-700 to-slate-800" : "border-gray-300 from-gray-200 to-gray-300"
            )}>
              {region.photo ? (
                <img 
                  src={region.photo} 
                  alt={region.coordinator}
                  className="w-full h-full object-contain object-center"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className={cn(
                  region.photo ? 'hidden' : 'flex',
                  'w-full h-full items-center justify-center',
                  isDark ? 'bg-slate-800/50' : 'bg-gray-200/50'
                )}
              >
                <Briefcase size={24} style={{ width: 'clamp(24px, 6vw, 32px)', height: 'clamp(24px, 6vw, 32px)' }} className={colors.text} />
              </div>
            </div>
          </div>
          
          <h3 className={cn(
            "text-base sm:text-lg font-bold mb-1 truncate px-1",
            isDark ? "text-white" : "text-gray-900"
          )}>{region.coordinator}</h3>
          <p className={cn(`text-xs sm:text-sm ${colors.text} font-medium mb-1 truncate px-1`)}>{region.title}</p>
          <p className={cn(
            "text-[10px] sm:text-xs mb-2 sm:mb-3 truncate px-1",
            isDark ? "text-slate-400" : "text-gray-600"
          )}>{region.name}</p>
          
        </div>
      </div>
    </div>
  );
}

