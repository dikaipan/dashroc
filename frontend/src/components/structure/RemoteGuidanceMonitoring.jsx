/**
 * Remote Guidance Monitoring Component
 * Displays helpdesk coordinators and group area leaders
 */
import React from 'react';
import { Headphones, Users, MapPin, Clock } from 'react-feather';
import { cn } from '../../constants/styles';

export default function RemoteGuidanceMonitoring({ data }) {
  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-500/30">
            <Headphones size={28} className="text-purple-400" />
          </div>
          <span>Remote guidance monitoring</span>
        </h3>
        {data.availability && (
          <div className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/40 rounded-full shadow-lg shadow-green-500/10">
            <Clock size={18} className="text-green-400" />
            <span className="text-sm font-bold text-green-400">{data.availability}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Helpdesk Coordinator */}
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-500/40 rounded-xl p-5 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
          <h4 className="text-base font-bold text-purple-300 mb-4 flex items-center gap-2 pb-3 border-b border-purple-500/30">
            <Headphones size={20} />
            Helpdesk Coordinator
          </h4>
          <div className="space-y-3">
            {data.helpdeskCoordinator.map((person, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/70 to-slate-700/50 rounded-lg p-4 border border-purple-500/30 hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
              >
                <p className="text-white font-semibold text-base">{person.name}</p>
                <p className="text-xs text-purple-300 mt-2">{person.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Helpdesk All Customer */}
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-2 border-blue-500/40 rounded-xl p-5 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300">
          <h4 className="text-base font-bold text-blue-300 mb-4 flex items-center gap-2 pb-3 border-b border-blue-500/30">
            <Users size={20} />
            Helpdesk All Customer
          </h4>
          <div className="space-y-3">
            {data.helpdeskAllCustomer.map((person, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/70 to-slate-700/50 rounded-lg p-4 border border-blue-500/30 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
              >
                <p className="text-white font-semibold text-base">{person.name}</p>
                <p className="text-xs text-blue-300 mt-2">{person.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Group Area Leaders */}
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border-2 border-green-500/40 rounded-xl p-5 shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300">
          <h4 className="text-base font-bold text-green-300 mb-4 flex items-center gap-2 pb-3 border-b border-green-500/30">
            <MapPin size={20} />
            Group Area Leader / Senior Engineer
          </h4>
          <div className="space-y-3">
            {data.groupAreaLeaders.map((leader, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-slate-800/70 to-slate-700/50 rounded-lg p-4 border border-green-500/30 hover:border-green-400/60 hover:shadow-lg hover:shadow-green-500/20 hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
              >
                <p className="text-white font-semibold text-base">{leader.name}</p>
                <p className="text-xs text-green-300 mt-2 flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span className="font-medium">{leader.area}</span>
                </p>
                {leader.customers && leader.customers.length > 0 && (
                  <p className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-700/50">
                    {leader.customers.join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

