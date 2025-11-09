import React from "react";
import { Tool } from "react-feather";
import { getGradientCard, TEXT_STYLES, cn } from '../constants/styles';

export default function Toolbox() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={getGradientCard('purple', false)}>
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Tool className="text-purple-400" size={32} />
          </div>
          <div className="flex-1">
            <h1 className={TEXT_STYLES.heading1}>Toolbox</h1>
            <p className={cn('text-slate-300 text-lg mb-4')}>Developer Utilities & Tools</p>
            <p className={TEXT_STYLES.body}>
              Halaman toolbox untuk utilitas developer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
