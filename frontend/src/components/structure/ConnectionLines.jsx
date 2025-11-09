/**
 * Connection Lines Component
 * SVG lines connecting FSM to regions in organization chart
 */
import React from 'react';

export default function ConnectionLines() {
  return (
    <div className="relative w-full max-w-5xl h-12">
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <line x1="50%" y1="0" x2="50%" y2="50%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#475569" strokeWidth="2" />
        <line x1="20%" y1="50%" x2="20%" y2="100%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="50%" y1="50%" x2="50%" y2="100%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="80%" y1="50%" x2="80%" y2="100%" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    </div>
  );
}

