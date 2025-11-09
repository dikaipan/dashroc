/**
 * Structure Statistics Component
 * Displays summary statistics for organization structure
 */
import React from 'react';
import { Award, Briefcase, Users } from 'react-feather';
import { getGradientCard, TEXT_STYLES, cn } from '../../constants/styles';

export default function StructureStatistics({ statistics }) {
  const statCards = [
    {
      icon: Award,
      value: statistics.fsm,
      label: 'Field Service Manager',
      color: 'indigo'
    },
    {
      icon: Briefcase,
      value: statistics.groupAreaLeaders,
      label: 'Group Area Leaders',
      color: 'blue'
    },
    {
      icon: Users,
      value: statistics.seniorCE,
      label: 'Senior CE',
      color: 'purple'
    },
    {
      icon: Users,
      value: statistics.engineerArea,
      label: 'Engineer Area',
      color: 'green'
    }
  ];

  return (
    <div className="w-full max-w-6xl mt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          
          return (
            <div key={idx} className={getGradientCard(stat.color, false)}>
              <div className="text-center">
                <Icon size={24} className={cn(`text-${stat.color}-400`, 'mx-auto mb-2')} />
                <p className={TEXT_STYLES.kpiValue}>{stat.value}</p>
                <p className={TEXT_STYLES.kpiSubtitle}>{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

