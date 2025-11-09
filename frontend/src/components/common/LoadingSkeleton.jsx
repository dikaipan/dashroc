import React from 'react';

// ============================================================================
// LOADING MESSAGES - Friendly & Motivational
// ============================================================================
const LOADING_MESSAGES = [
  ' Memuat data...',
  ' Hampir siap...',
  ' Menyiapkan dashboard...',
  ' Mengambil data...',
  ' Loading...',
  ' Sebentar lagi...',
  ' Mohon tunggu...',
  ' Rendering...',
];

const getRandomMessage = () => LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];

// ============================================================================
// SHIMMER EFFECT - Gradient Animation
// ============================================================================
const shimmerStyle = {
  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite'
};

// ============================================================================
// SPINNER LOADING - Beautiful Circular Spinner
// ============================================================================
export const SpinnerLoading = ({ message, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        <div className={`${sizeClasses[size]} border-purple-200 border-t-purple-600 rounded-full animate-spin absolute top-0 left-0`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-slate-300 animate-pulse">{message || getRandomMessage()}</p>
      </div>
    </div>
  );
};

// ============================================================================
// DOTS LOADING - Animated Dots
// ============================================================================
export const DotsLoading = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
    <p className="text-sm font-medium text-slate-300">{message || getRandomMessage()}</p>
  </div>
);

// ============================================================================
// PULSE LOADING - Pulsing Circle
// ============================================================================
export const PulseLoading = ({ message }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 bg-blue-500 rounded-full opacity-75 animate-ping"></div>
      <div className="absolute inset-0 bg-blue-600 rounded-full opacity-75"></div>
    </div>
    <p className="text-sm font-medium text-slate-300">{message || getRandomMessage()}</p>
  </div>
);

// ============================================================================
// TABLE SKELETON - Enhanced with Gradient Animation
// ============================================================================
export const TableSkeleton = ({ rows = 5, cols = 6, message }) => (
  <div className="space-y-3">
    {message && (
      <div className="text-center mb-4">
        <SpinnerLoading message={message} size="sm" />
      </div>
    )}
    {/* Header */}
    <div className="flex gap-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 h-12 rounded-lg overflow-hidden relative">
      <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
    </div>
    {/* Rows */}
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4">
        {[...Array(cols)].map((_, j) => (
          <div 
            key={j} 
            className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 h-10 rounded flex-1 overflow-hidden relative"
            style={{ animationDelay: `${(i + j) * 0.1}s` }}
          >
            <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
          </div>
        ))}
      </div>
    ))}
  </div>
);

// ============================================================================
// CARD SKELETON - Enhanced with Staggered Animation
// ============================================================================
export const CardSkeleton = ({ count = 1 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
        {/* Card Header */}
        <div className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 h-32 rounded-t-xl mb-3 overflow-hidden relative">
          <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-slate-600 rounded-full"></div>
          </div>
        </div>
        {/* Card Body */}
        <div className="space-y-2 px-2">
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 h-6 rounded w-3/4 overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
          </div>
          <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 h-4 rounded w-1/2 overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// CHART SKELETON - Enhanced with Wave Animation
// ============================================================================
export const ChartSkeleton = ({ message }) => (
  <div className="space-y-4">
    {message && (
      <div className="text-center">
        <DotsLoading message={message} />
      </div>
    )}
    <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 h-64 rounded-xl overflow-hidden relative">
      <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
      {/* Chart Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-around px-8 pb-4 gap-2">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i} 
            className="bg-slate-600 rounded-t animate-pulse flex-1"
            style={{ 
              height: `${Math.random() * 60 + 40}%`,
              animationDelay: `${i * 0.1}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================================================
// MAP SKELETON - Loading State for Maps
// ============================================================================
export const MapSkeleton = () => (
  <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 h-full rounded-xl overflow-hidden relative flex items-center justify-center">
    <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
    <div className="text-center z-10">
      <div className="text-6xl mb-4 animate-bounce">🗺️</div>
      <p className="text-sm font-medium text-slate-300">Memuat peta...</p>
    </div>
  </div>
);

// ============================================================================
// LIST SKELETON - For Lists/Menus
// ============================================================================
export const ListSkeleton = ({ items = 5 }) => (
  <div className="space-y-3">
    {[...Array(items)].map((_, i) => (
      <div key={i} className="flex items-center space-x-3 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
        <div className="w-10 h-10 bg-gradient-to-r from-slate-700 to-slate-600 rounded-full overflow-hidden relative">
          <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 h-4 rounded w-3/4 overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
          </div>
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 h-3 rounded w-1/2 overflow-hidden relative">
            <div className="absolute inset-0 animate-shimmer" style={shimmerStyle}></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ============================================================================
// MAIN COMPONENT - Smart Loading Dispatcher
// ============================================================================
export default function LoadingSkeleton({ type = 'spinner', message, ...props }) {
  switch (type) {
    case 'spinner':
      return <SpinnerLoading message={message} {...props} />;
    case 'dots':
      return <DotsLoading message={message} {...props} />;
    case 'pulse':
      return <PulseLoading message={message} {...props} />;
    case 'table':
      return <TableSkeleton message={message} {...props} />;
    case 'card':
      return <CardSkeleton {...props} />;
    case 'chart':
      return <ChartSkeleton message={message} {...props} />;
    case 'map':
      return <MapSkeleton {...props} />;
    case 'list':
      return <ListSkeleton {...props} />;
    default:
      return <SpinnerLoading message={message} {...props} />;
  }
}