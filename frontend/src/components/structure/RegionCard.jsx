/**
 * Region Card Component
 * Displays region coordinator and team information
 */
import React from 'react';
import { Briefcase } from 'react-feather';
import { getColorMap } from '../../utils/structureUtils';
import { cn } from '../../constants/styles';

export default function RegionCard({ region }) {
  const colors = getColorMap()[region.color];

  return (
    <div className="flex flex-col">
      {/* Region Header */}
      <div className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm p-4 rounded-xl border ${colors.border} ${colors.hover} ${colors.shadow} hover:shadow-lg transition-all duration-300`}>
        <div className="text-center">
          {/* Photo */}
          <div className="relative inline-block mb-3">
            <div className="w-20 h-28 rounded-xl overflow-hidden border-2 border-slate-700 shadow-md bg-gradient-to-b from-slate-700 to-slate-800">
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
                  'w-full h-full items-center justify-center bg-slate-800/50'
                )}
              >
                <Briefcase size={32} className={colors.text} />
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-bold text-white mb-1">{region.coordinator}</h3>
          <p className={`text-sm ${colors.text} font-medium mb-1`}>{region.title}</p>
          <p className="text-xs text-slate-400 mb-3">{region.name}</p>
          
        </div>
      </div>
    </div>
  );
}

