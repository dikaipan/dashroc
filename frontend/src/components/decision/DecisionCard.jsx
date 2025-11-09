/**
 * Decision Card Component
 * Reusable card component for decision analysis
 */
import React from 'react';
import { Maximize2 } from 'react-feather';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, BarChart, Bar } from 'recharts';
import { getGradientCard, TEXT_STYLES, BADGE_STYLES, cn } from '../../constants/styles';

export default function DecisionCard({ card, onClick }) {
  const Icon = card.icon;

  const renderMiniChart = () => {
    if (!card.data || card.data.length === 0) return null;

    return (
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          {card.chartType === 'radar' ? (
            <RadarChart data={card.data.slice(0, 3)}>
              <PolarGrid stroke="#475569" />
              <Radar dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
            </RadarChart>
          ) : (
            <BarChart data={card.data.slice(0, 4)}>
              <Bar dataKey={card.id === 'distance-analysis' ? 'farZone' : card.id === 'zone-optimization' ? 'machines' : 'total'} fill="#3b82f6" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      className={cn(getGradientCard(card.color, true), 'cursor-pointer group')}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Icon className={cn(`text-${card.color}-400`)} size={24} />
            <h3 className={TEXT_STYLES.heading3}>{card.title}</h3>
          </div>
          <p className={TEXT_STYLES.bodySmall}>{card.summary}</p>
        </div>
        <Maximize2 className={cn('text-slate-400 group-hover:text-slate-200 transition-colors')} size={20} />
      </div>

      {/* Mini Chart */}
      {renderMiniChart()}

      {/* Metric */}
      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className={TEXT_STYLES.bodySmall}>{card.metricLabel}</p>
          <p className={cn('text-3xl font-bold', `text-${card.color}-400`)}>{card.metric}</p>
        </div>
        <div className={cn(BADGE_STYLES[card.color] || BADGE_STYLES.blue, 'text-xs font-medium')}>
          Click for details
        </div>
      </div>
    </div>
  );
}

