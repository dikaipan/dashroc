/**
 * Customer Account Grid Component
 * Displays customer accounts in a grid layout
 */
import React from 'react';
import { Home } from 'react-feather';
import { cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';

export default function CustomerAccountGrid({ columns }) {
  const { isDark } = useTheme();
  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 flex items-center gap-3`}>
          <div className={`p-2 ${isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-300'} rounded-lg border`}>
            <Home size={28} className={isDark ? "text-blue-400" : "text-blue-600"} />
          </div>
          <span>Technical assistance - CUSTOMER ACCOUNT</span>
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {columns.map((column, colIdx) => (
          <div key={column.id} className="flex flex-col gap-3">
            <div className={`text-sm font-bold ${isDark ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-blue-600 bg-blue-100 border-blue-300'} uppercase tracking-wider mb-2 px-3 py-2 rounded-lg border text-center`}>
              Column {colIdx + 1}
            </div>
            <div className="flex flex-col gap-2.5">
              {column.customers.map((customer, idx) => (
                <div
                  key={idx}
                  className={cn(
                    isDark 
                      ? 'bg-gradient-to-br from-blue-500/15 to-blue-600/8 border-blue-500/30 hover:border-blue-400/50 hover:shadow-blue-500/20'
                      : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-400 hover:shadow-blue-200',
                    'border rounded-lg p-3.5',
                    'hover:shadow-lg',
                    'hover:scale-[1.02]',
                    'transition-all duration-300',
                    'cursor-default',
                    'backdrop-blur-sm'
                  )}
                >
                  <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'} text-center`}>
                    {customer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

