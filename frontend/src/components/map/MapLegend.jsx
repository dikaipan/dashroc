// src/components/map/MapLegend.jsx
// Map Legend Component - Extracted from MapWithRegions.jsx
import React from 'react';
import { getColorByRegion } from '../../utils/mapUtils';
import { useTheme } from '../../contexts/ThemeContext';

const MapLegend = ({
  isLegendVisible,
  setIsLegendVisible,
  regionStats = {},
  topProvinces = [],
  uniqueAreaGroups = 0,
  warehouseLocationsFromFSL = [],
  cityLocations = [],
  engineers = [],
  machines = []
}) => {
  const { isDark } = useTheme();

  if (!isLegendVisible) return null;

  const repairCenterCount = cityLocations.filter(city => city.repairCenter === true).length;

  return (
    <div className={`absolute bottom-4 left-4 right-4 z-[100] ${isDark ? 'bg-black/70' : 'bg-white/80'} backdrop-blur-md rounded-xl border ${isDark ? 'border-slate-700/50' : 'border-gray-300/50'} shadow-2xl p-3 sm:p-4 text-xs sm:text-sm transition-all duration-300 hover:shadow-3xl`}>
      {/* Header with Logo */}
      <div className={`relative flex items-center justify-between mb-2 pb-2 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-300/50'}`}>
        <div className="flex items-center gap-4">
          <div className={`relative ${isDark ? 'bg-gradient-to-br from-red-600 to-red-700' : 'bg-gradient-to-br from-red-600 to-red-700'} px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/20`}>
            <span className={`text-white font-bold text-xs sm:text-sm tracking-wide select-none relative z-10 ${isDark ? '' : 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]'}`}>HITACHI</span>
            <div className={`absolute inset-0 bg-gradient-to-br ${isDark ? 'from-white/20 to-transparent' : 'from-white/10 to-transparent'} rounded-lg pointer-events-none`} />
          </div>
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg transition-all duration-300 ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200'} backdrop-blur-sm transform hover:scale-110`}>
              <svg className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-900'} tracking-tight antialiased`}>
              Map Legend
            </h3>
          </div>
        </div>
        <button
          onClick={() => setIsLegendVisible(false)}
          className={`relative p-1.5 rounded-lg transition-all duration-300 ${isDark ? 'hover:bg-slate-800/80 text-slate-400 hover:text-white' : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'} hover:scale-110 hover:rotate-90 active:scale-95`}
          title="Sembunyikan Legend"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="relative flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Marker Types */}
        <div className={`relative px-2.5 py-1.5 rounded-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex-shrink-0 ${isDark ? 'bg-black/40 border-slate-700/50 hover:bg-black/60 hover:border-slate-600/50' : 'bg-white/50 border-gray-200/50 hover:bg-white/70 hover:border-gray-300/70'}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <div className={`p-0.5 rounded transition-all duration-300 ${isDark ? 'bg-blue-500/20 hover:bg-blue-500/30' : 'bg-blue-100 hover:bg-blue-200'} transform hover:scale-110`}>
              <svg className={`w-2.5 h-2.5 transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className={`text-[11px] sm:text-xs font-bold tracking-wide uppercase ${isDark ? 'text-slate-200' : 'text-gray-800'} antialiased`}>Markers</p>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Pin */}
            <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'hover:bg-slate-700/60 hover:shadow-md' : 'hover:bg-gray-100/80 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
              <span className="text-base filter drop-shadow-sm transition-transform duration-300 group-hover:scale-125">📍</span>
              <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-wide ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>Area Group</span>
            </div>
            
            {/* Warehouse */}
            <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'hover:bg-slate-700/60 hover:shadow-md' : 'hover:bg-gray-100/80 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
              <div className="w-5 h-5 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 rounded border border-white/80 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <span className="text-[10px] transition-transform duration-300 group-hover:scale-125">📦</span>
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-wide ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>Warehouse</span>
            </div>
            
            {/* Repair Center */}
            <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'hover:bg-slate-700/60 hover:shadow-md' : 'hover:bg-gray-100/80 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
              <div className="w-5 h-5 bg-gradient-to-br from-amber-500 via-yellow-500 to-yellow-600 rounded border border-white/80 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <span className="text-[10px] transition-transform duration-300 group-hover:scale-125">🔧</span>
              </div>
              <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-wide ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>RC</span>
            </div>
          </div>
        </div>
        
        {/* Region Colors */}
        <div className={`relative px-2.5 py-1.5 rounded-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex-shrink-0 ${isDark ? 'bg-black/40 border-slate-700/50 hover:bg-black/60 hover:border-slate-600/50' : 'bg-white/50 border-gray-200/50 hover:bg-white/70 hover:border-gray-300/70'}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <div className={`p-0.5 rounded transition-all duration-300 ${isDark ? 'bg-purple-500/20 hover:bg-purple-500/30' : 'bg-purple-100 hover:bg-purple-200'} transform hover:scale-110`}>
              <svg className={`w-2.5 h-2.5 transition-colors duration-300 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className={`text-[11px] sm:text-xs font-bold tracking-wide uppercase ${isDark ? 'text-slate-200' : 'text-gray-800'} antialiased`}>Regions</p>
          </div>
          <div className="flex items-center gap-1.5">
            {['Region 1', 'Region 2', 'Region 3'].map(region => {
              const color = getColorByRegion(region);
              const stats = regionStats[region];
              return (
                <div 
                  key={region} 
                  className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'hover:bg-slate-700/60 hover:shadow-md' : 'hover:bg-gray-100/80 hover:shadow-md'} transform hover:scale-105 active:scale-95`}
                >
                  <div 
                    className="w-4 h-4 rounded border-2 border-white/80 shadow-sm flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg"
                    style={{ backgroundColor: color }}
                  />
                  <span className={`text-[11px] sm:text-xs font-semibold whitespace-nowrap tracking-wide ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>{region}</span>
                  {stats && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold flex-shrink-0 transition-all duration-300 ${isDark ? 'bg-slate-700/50 text-slate-300 group-hover:bg-slate-600/70 group-hover:text-white' : 'bg-gray-200 text-gray-700 group-hover:bg-gray-300 group-hover:text-gray-900'}`}>
                      {stats.areaGroupCount || stats.provinceCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Top Provinces */}
        {topProvinces.length > 0 && (
          <div className={`relative px-2.5 py-1.5 rounded-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex-1 min-w-[150px] ${isDark ? 'bg-black/40 border-slate-700/50 hover:bg-black/60 hover:border-slate-600/50' : 'bg-white/50 border-gray-200/50 hover:bg-white/70 hover:border-gray-300/70'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <div className={`p-0.5 rounded transition-all duration-300 ${isDark ? 'bg-amber-500/20 hover:bg-amber-500/30' : 'bg-amber-100 hover:bg-amber-200'} transform hover:scale-110`}>
                <svg className={`w-2.5 h-2.5 transition-colors duration-300 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className={`text-[11px] sm:text-xs font-bold tracking-wide uppercase ${isDark ? 'text-slate-200' : 'text-gray-800'} antialiased`}>
                Top Provinces
              </p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {topProvinces.slice(0, 4).map((province, idx) => {
                const regionColor = getColorByRegion(province.region);
                return (
                  <div 
                    key={idx} 
                    className={`group flex items-center gap-1.5 text-[11px] sm:text-xs px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'bg-slate-700/40 hover:bg-slate-700/70 hover:shadow-md' : 'bg-gray-50/80 hover:bg-gray-100/90 hover:shadow-md'} transform hover:scale-105 active:scale-95`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] sm:text-xs transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${idx === 0 ? (isDark ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white' : 'bg-gradient-to-br from-yellow-400 to-amber-500 text-white') : idx === 1 ? (isDark ? 'bg-gradient-to-br from-slate-500 to-slate-600 text-white' : 'bg-gradient-to-br from-slate-400 to-slate-500 text-white') : idx === 2 ? (isDark ? 'bg-gradient-to-br from-amber-700 to-amber-800 text-white' : 'bg-gradient-to-br from-amber-600 to-amber-700 text-white') : (isDark ? 'bg-slate-600 text-slate-300' : 'bg-gray-300 text-gray-700')}`}>
                      {idx + 1}
                    </div>
                    <div 
                      className="w-3 h-3 rounded border-2 border-white/80 shadow-sm flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg"
                      style={{ backgroundColor: regionColor }}
                    />
                    <span className={`font-semibold whitespace-nowrap tracking-wide transition-colors duration-300 ${isDark ? 'text-slate-200 group-hover:text-white' : 'text-gray-800 group-hover:text-gray-900'}`}>
                      {province.name.length > 8 ? province.name.substring(0, 7) + '..' : province.name}
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-semibold transition-colors duration-300 ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600 group-hover:text-gray-700'}`}>
                      {province.machines.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Statistics */}
        <div className={`relative px-2.5 py-1.5 rounded-lg border transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex-shrink-0 ${isDark ? 'bg-black/40 border-slate-700/50 hover:bg-black/60 hover:border-slate-600/50' : 'bg-white/50 border-gray-200/50 hover:bg-white/70 hover:border-gray-300/70'}`}>
          <div className="flex items-center gap-1.5 mb-1">
            <div className={`p-0.5 rounded transition-all duration-300 ${isDark ? 'bg-green-500/20 hover:bg-green-500/30' : 'bg-green-100 hover:bg-green-200'} transform hover:scale-110`}>
              <svg className={`w-2.5 h-2.5 transition-colors duration-300 ${isDark ? 'text-green-400' : 'text-green-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className={`text-[11px] sm:text-xs font-bold tracking-wide uppercase ${isDark ? 'text-slate-200' : 'text-gray-800'} antialiased`}>Statistics</p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/60 hover:shadow-md' : 'bg-gray-50/80 hover:bg-gray-100/90 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
              <span className={`text-[10px] sm:text-[11px] font-semibold whitespace-nowrap tracking-wide transition-colors duration-300 ${isDark ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-700 group-hover:text-gray-800'}`}>Area</span>
              <span className={`text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md transition-all duration-300 ${isDark ? 'bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 group-hover:text-blue-300' : 'bg-blue-100 text-blue-700 group-hover:bg-blue-200 group-hover:text-blue-800'}`}>{uniqueAreaGroups}</span>
            </div>
            <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/60 hover:shadow-md' : 'bg-gray-50/80 hover:bg-gray-100/90 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
              <span className={`text-[10px] sm:text-[11px] font-semibold whitespace-nowrap tracking-wide transition-colors duration-300 ${isDark ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-700 group-hover:text-gray-800'}`}>Warehouse</span>
              <span className={`text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md transition-all duration-300 ${isDark ? 'bg-amber-500/20 text-amber-400 group-hover:bg-amber-500/30 group-hover:text-amber-300' : 'bg-amber-100 text-amber-700 group-hover:bg-amber-200 group-hover:text-amber-800'}`}>{warehouseLocationsFromFSL.length}</span>
            </div>
            {repairCenterCount > 0 && (
              <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/60 hover:shadow-md' : 'bg-gray-50/80 hover:bg-gray-100/90 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
                <span className={`text-[10px] sm:text-[11px] font-semibold whitespace-nowrap tracking-wide transition-colors duration-300 ${isDark ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-700 group-hover:text-gray-800'}`}>RC</span>
                <span className={`text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md transition-all duration-300 ${isDark ? 'bg-yellow-500/20 text-yellow-400 group-hover:bg-yellow-500/30 group-hover:text-yellow-300' : 'bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200 group-hover:text-yellow-800'}`}>{repairCenterCount}</span>
              </div>
            )}
            {engineers && engineers.length > 0 && (
              <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/60 hover:shadow-md' : 'bg-gray-50/80 hover:bg-gray-100/90 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
                <span className={`text-[10px] sm:text-[11px] font-semibold whitespace-nowrap tracking-wide transition-colors duration-300 ${isDark ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-700 group-hover:text-gray-800'}`}>Engineer</span>
                <span className={`text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md transition-all duration-300 ${isDark ? 'bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 group-hover:text-purple-300' : 'bg-purple-100 text-purple-700 group-hover:bg-purple-200 group-hover:text-purple-800'}`}>{engineers.length.toLocaleString()}</span>
              </div>
            )}
            {machines && machines.length > 0 && (
              <div className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md transition-all duration-300 cursor-pointer ${isDark ? 'bg-slate-700/30 hover:bg-slate-700/60 hover:shadow-md' : 'bg-gray-50/80 hover:bg-gray-100/90 hover:shadow-md'} transform hover:scale-105 active:scale-95`}>
                <span className={`text-[10px] sm:text-[11px] font-semibold whitespace-nowrap tracking-wide transition-colors duration-300 ${isDark ? 'text-slate-300 group-hover:text-slate-200' : 'text-gray-700 group-hover:text-gray-800'}`}>Machine</span>
                <span className={`text-[11px] sm:text-xs font-bold px-1.5 py-0.5 rounded-md transition-all duration-300 ${isDark ? 'bg-green-500/20 text-green-400 group-hover:bg-green-500/30 group-hover:text-green-300' : 'bg-green-100 text-green-700 group-hover:bg-green-200 group-hover:text-green-800'}`}>{machines.length.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;

