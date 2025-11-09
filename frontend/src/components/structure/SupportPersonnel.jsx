/**
 * Support Personnel Component
 * Displays technical assistance backup, technical analysts, and helpdesk + baby part
 */
import React from 'react';
import { Users, UserCheck, Settings, Package } from 'react-feather';
import { cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';

export default function SupportPersonnel({ data }) {
  const { isDark } = useTheme();
  return (
    <div className="w-full">
      <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-3`}>
        <div className={`p-2 ${isDark ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-100 border-orange-300'} rounded-lg border`}>
          <Users size={28} className={isDark ? "text-orange-400" : "text-orange-600"} />
        </div>
        <span>Support Personnel and Roles</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Technical Assistance Backup */}
        <div className={`${isDark ? 'bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/40 shadow-orange-500/10 hover:shadow-orange-500/20' : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300 shadow-orange-200 hover:shadow-orange-300'} border-2 rounded-xl p-5 shadow-lg transition-all duration-300`}>
          <h4 className={`text-base font-bold ${isDark ? 'text-orange-300 border-orange-500/30' : 'text-orange-700 border-orange-300'} mb-4 flex items-center gap-2 pb-3 border-b`}>
            <UserCheck size={20} />
            Technical Assistance Backup
          </h4>
          <div className="space-y-3">
            {data.technicalAssistanceBackup.map((person, idx) => (
              <div
                key={idx}
                className={`${isDark ? 'bg-gradient-to-br from-slate-800/70 to-slate-700/50 border-orange-500/30 hover:border-orange-400/60 hover:shadow-orange-500/20' : 'bg-white border-orange-300 hover:border-orange-400 hover:shadow-orange-200'} rounded-lg p-4 border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm`}
              >
                <p className={isDark ? "text-white font-semibold text-base" : "text-gray-900 font-semibold text-base"}>{person.name}</p>
                <p className={isDark ? "text-xs text-orange-300 mt-2" : "text-xs text-orange-600 mt-2"}>{person.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Analysts */}
        <div className={`${isDark ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border-indigo-500/40 shadow-indigo-500/10 hover:shadow-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-300 shadow-indigo-200 hover:shadow-indigo-300'} border-2 rounded-xl p-5 shadow-lg transition-all duration-300`}>
          <h4 className={`text-base font-bold ${isDark ? 'text-indigo-300 border-indigo-500/30' : 'text-indigo-700 border-indigo-300'} mb-4 flex items-center gap-2 pb-3 border-b`}>
            <Settings size={20} />
            Technical Analyst
          </h4>
          <div className="space-y-3">
            {data.technicalAnalysts.map((analyst, idx) => (
              <div
                key={idx}
                className={`${isDark ? 'bg-gradient-to-br from-slate-800/70 to-slate-700/50 border-indigo-500/30 hover:border-indigo-400/60 hover:shadow-indigo-500/20' : 'bg-white border-indigo-300 hover:border-indigo-400 hover:shadow-indigo-200'} rounded-lg p-4 border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm`}
              >
                <p className={isDark ? "text-white font-semibold text-base" : "text-gray-900 font-semibold text-base"}>{analyst.name}</p>
                {analyst.specialization && (
                  <p className={isDark ? "text-xs text-indigo-300 mt-2 font-medium" : "text-xs text-indigo-600 mt-2 font-medium"}>
                    {analyst.specialization}
                  </p>
                )}
                <p className={isDark ? "text-xs text-slate-400 mt-1" : "text-xs text-gray-600 mt-1"}>{analyst.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Helpdesk + Baby part */}
        <div className={`${isDark ? 'bg-gradient-to-br from-pink-500/20 to-pink-600/10 border-pink-500/40 shadow-pink-500/10 hover:shadow-pink-500/20' : 'bg-gradient-to-br from-pink-50 to-pink-100 border-pink-300 shadow-pink-200 hover:shadow-pink-300'} border-2 rounded-xl p-5 shadow-lg transition-all duration-300`}>
          <h4 className={`text-base font-bold ${isDark ? 'text-pink-300 border-pink-500/30' : 'text-pink-700 border-pink-300'} mb-4 flex items-center gap-2 pb-3 border-b`}>
            <Package size={20} />
            Helpdesk + Baby part
          </h4>
          <div className="space-y-3">
            {data.helpdeskBabyPart.map((person, idx) => (
              <div
                key={idx}
                className={`${isDark ? 'bg-gradient-to-br from-slate-800/70 to-slate-700/50 border-pink-500/30 hover:border-pink-400/60 hover:shadow-pink-500/20' : 'bg-white border-pink-300 hover:border-pink-400 hover:shadow-pink-200'} rounded-lg p-4 border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm`}
              >
                <p className={isDark ? "text-white font-semibold text-base" : "text-gray-900 font-semibold text-base"}>{person.name}</p>
                <p className={isDark ? "text-xs text-pink-300 mt-2" : "text-xs text-pink-600 mt-2"}>{person.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

