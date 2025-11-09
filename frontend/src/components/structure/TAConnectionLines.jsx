/**
 * TA Connection Lines Component
 * SVG lines connecting TA Coordinator to sections in organization chart
 */
import React from 'react';

export default function TAConnectionLines() {
  return (
    <div className="relative w-full max-w-5xl h-12 my-2">
      <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        {/* Main vertical line from TA Coordinator with gradient effect */}
        <defs>
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main vertical line from TA Coordinator */}
        <line 
          x1="50%" 
          y1="0" 
          x2="50%" 
          y2="65%" 
          stroke="url(#cyanGradient)" 
          strokeWidth="3" 
          strokeDasharray="6 4"
          filter="url(#glow)"
        />
        
        {/* Horizontal line connecting to sections */}
        <line 
          x1="10%" 
          y1="65%" 
          x2="90%" 
          y2="65%" 
          stroke="url(#cyanGradient)" 
          strokeWidth="3"
          filter="url(#glow)"
        />
        
        {/* Vertical lines to each section */}
        <line 
          x1="10%" 
          y1="65%" 
          x2="10%" 
          y2="100%" 
          stroke="url(#cyanGradient)" 
          strokeWidth="2" 
          strokeDasharray="4 4"
          opacity="0.7"
        />
        <line 
          x1="50%" 
          y1="65%" 
          x2="50%" 
          y2="100%" 
          stroke="url(#cyanGradient)" 
          strokeWidth="2" 
          strokeDasharray="4 4"
          opacity="0.7"
        />
        <line 
          x1="90%" 
          y1="65%" 
          x2="90%" 
          y2="100%" 
          stroke="url(#cyanGradient)" 
          strokeWidth="2" 
          strokeDasharray="4 4"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

