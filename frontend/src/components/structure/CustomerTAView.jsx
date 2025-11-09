/**
 * Customer TA View Component
 * Displays sample customers and dropdown to view all customers with TA information
 */
import React from 'react';
import { Home, User, ChevronDown } from 'react-feather';
import { cn } from '../../constants/styles';
import { getAllCustomers, getCustomerByName } from '../../utils/taAccountUtils';
import { useTheme } from '../../contexts/ThemeContext';

export default function CustomerTAView({ taAccountData, selectedCustomer, onCustomerChange }) {
  const { isDark } = useTheme();
  const allCustomers = getAllCustomers(taAccountData);
  const selectedCustomerData = selectedCustomer ? getCustomerByName(taAccountData, selectedCustomer) : null;

  // Get sample customers (first customer from each column) - contoh customer
  const sampleCustomers = taAccountData.customerAccounts.columns.map(col => ({
    name: col.customers[0],
    taName: col.taName
  }));

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3 flex items-center gap-3`}>
          <div className={`p-2 ${isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-300'} rounded-lg border`}>
            <Home size={28} className={isDark ? "text-blue-400" : "text-blue-600"} />
          </div>
          <span>Technical assistance - CUSTOMER ACCOUNT</span>
        </h3>
        
        {/* Dropdown untuk memilih semua customer */}
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <label className={`block text-sm font-semibold ${isDark ? 'text-slate-300' : 'text-gray-700'} mb-2`}>
              Lihat Customer Lainnya
            </label>
            <div className="relative">
              <select
                value={selectedCustomer || ''}
                onChange={(e) => onCustomerChange(e.target.value)}
                className={cn(
                  'w-full md:w-80 px-4 py-3 pr-10',
                  isDark 
                    ? 'bg-slate-800/70 border-2 border-blue-500/40 text-white'
                    : 'bg-white border-2 border-blue-300 text-gray-900',
                  'rounded-xl',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500',
                  'transition-all duration-300',
                  isDark ? 'hover:border-blue-400/60' : 'hover:border-blue-400',
                  'appearance-none cursor-pointer'
                )}
              >
                <option value="">Shorting Customer</option>
                {allCustomers.map((customer, idx) => (
                  <option key={idx} value={customer.name} className={isDark ? "bg-slate-800" : "bg-white"}>
                    {customer.name}
                  </option>
                ))}
              </select>
              <ChevronDown 
                size={20} 
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-blue-400' : 'text-blue-600'} pointer-events-none`} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Display sample customers */}
      {!selectedCustomer && (
        <div className="space-y-4">
          <div className="mb-4">
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'} mb-3`}>Contoh Customer:</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sampleCustomers.map((customer, idx) => (
              <div
                key={idx}
                className={cn(
                  isDark 
                    ? 'bg-gradient-to-br from-blue-500/15 to-blue-600/8 border-blue-500/30'
                    : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300',
                  'border rounded-xl p-4',
                  isDark 
                    ? 'hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20'
                    : 'hover:border-blue-400 hover:shadow-lg hover:shadow-blue-200',
                  'hover:scale-[1.02]',
                  'transition-all duration-300',
                  'backdrop-blur-sm',
                  'cursor-pointer'
                )}
                onClick={() => onCustomerChange(customer.name)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Home size={18} className={isDark ? "text-blue-400" : "text-blue-600"} />
                      <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{customer.name}</h4>
                    </div>
                    <div className={`flex items-center gap-2 mt-3 pt-3 border-t ${isDark ? 'border-blue-500/20' : 'border-blue-300'}`}>
                      <User size={16} className={isDark ? "text-blue-300" : "text-blue-600"} />
                      <div>
                        <p className={isDark ? "text-xs text-slate-400" : "text-xs text-gray-600"}>TA</p>
                        <p className={`text-sm font-semibold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{customer.taName}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Display selected customer and TA info */}
      {selectedCustomerData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>Customer yang Dipilih:</p>
            <button
              onClick={() => onCustomerChange('')}
              className={`text-xs ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'} underline`}
            >
              Kembali ke Contoh
            </button>
          </div>
          <div className={cn(
            isDark 
              ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/40'
              : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300',
            'border-2 rounded-xl p-6',
            isDark ? 'shadow-lg shadow-blue-500/10' : 'shadow-lg shadow-blue-200',
            'backdrop-blur-sm'
          )}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 ${isDark ? 'bg-blue-500/30' : 'bg-blue-200'} rounded-lg`}>
                    <Home size={24} className={isDark ? "text-blue-300" : "text-blue-600"} />
                  </div>
                  <div>
                    <h4 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{selectedCustomerData.name}</h4>
                    <p className={isDark ? "text-sm text-slate-400" : "text-sm text-gray-600"}>Customer Account</p>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-3 p-4 ${isDark ? 'bg-slate-800/50 border-blue-500/30' : 'bg-white border-blue-300'} rounded-lg border`}>
                <div className={`p-2 ${isDark ? 'bg-blue-500/30' : 'bg-blue-200'} rounded-lg`}>
                  <User size={20} className={isDark ? "text-blue-300" : "text-blue-600"} />
                </div>
                <div>
                  <p className={isDark ? "text-xs text-slate-400 mb-1" : "text-xs text-gray-600 mb-1"}>Technical Assistant</p>
                  <p className={`text-lg font-bold ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>{selectedCustomerData.taName}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

