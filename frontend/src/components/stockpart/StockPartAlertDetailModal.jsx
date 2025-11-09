/**
 * Stock Part Alert Detail Modal Component
 * Displays detailed alert information with search and filter
 */
import React, { useState, useMemo } from 'react';
import { X, Search, Edit, ChevronRight, ChevronLeft } from 'react-feather';

export default function StockPartAlertDetailModal({
  isOpen,
  onClose,
  alertData,
  onEdit
}) {
  const [alertSearchQuery, setAlertSearchQuery] = useState('');
  const [alertFilterType, setAlertFilterType] = useState('all');
  const [expandedParts, setExpandedParts] = useState({});

  // Group entries by part number
  const groupedByPart = useMemo(() => {
    const grouped = {};
    alertData.entries.forEach(entry => {
      const partNum = entry.part.part_number || entry.part['part number'];
      if (!grouped[partNum]) {
        grouped[partNum] = {
          part: entry.part,
          fslList: []
        };
      }
      grouped[partNum].fslList.push({
        name: entry.fslName,
        stock: entry.stock
      });
    });
    
    // Sort FSL by stock level (lowest first) within each part
    Object.values(grouped).forEach(item => {
      item.fslList.sort((a, b) => a.stock - b.stock);
    });
    
    return grouped;
  }, [alertData.entries]);

  // Apply search and filter
  const filteredParts = useMemo(() => {
    return Object.values(groupedByPart).filter(item => {
      const part = item.part;
      const partNumber = (part.part_number || part['part number'] || '').toLowerCase();
      const partName = (part.part_name || part['part name'] || '').toLowerCase();
      const partType = (part.type_of_part || part['type of part'] || '').toLowerCase().trim();
      const isTop20 = (part['20_top_usage'] || part['20 top usage'] || '').toLowerCase() === 'yes';
      
      // Search filter
      const query = alertSearchQuery.toLowerCase().trim();
      const matchesSearch = !query || partNumber.includes(query) || partName.includes(query);
      
      // Type filter
      let matchesType = true;
      if (alertFilterType === 'all') {
        matchesType = true;
      } else if (alertFilterType === 'top20') {
        matchesType = isTop20;
      } else {
        matchesType = partType === alertFilterType.toLowerCase().trim();
      }
      
      return matchesSearch && matchesType;
    });
  }, [groupedByPart, alertSearchQuery, alertFilterType]);

  // Get unique part types for filter
  const partTypes = useMemo(() => {
    return [...new Set(Object.values(groupedByPart).map(item => 
      item.part.type_of_part || item.part['type of part'] || 'Other'
    ))].filter(Boolean).sort();
  }, [groupedByPart]);

  const handleClose = () => {
    setAlertSearchQuery('');
    setAlertFilterType('all');
    setExpandedParts({});
    onClose();
  };

  const handleEdit = (part) => {
    onEdit(part);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" style={{ zIndex: 9999 }}>
      <div className="bg-slate-900 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {alertData.title}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {filteredParts.length} parts {filteredParts.length !== Object.values(groupedByPart).length && `(of ${Object.values(groupedByPart).length})`} memerlukan perhatian
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Search and Filter Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search part number or name..."
                value={alertSearchQuery}
                onChange={(e) => setAlertSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
            <select
              value={alertFilterType}
              onChange={(e) => setAlertFilterType(e.target.value)}
              className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 focus:outline-none focus:border-blue-500 text-sm min-w-[180px]"
            >
              <option value="all">All Types</option>
              <option value="top20">⭐ Top 20 Only</option>
              {partTypes.map(type => (
                <option key={type} value={type.toLowerCase()}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="space-y-2">
            {filteredParts.map((item, idx) => {
              const part = item.part;
              const partNumber = part.part_number || part['part number'] || '-';
              const partName = part.part_name || part['part name'] || '-';
              const partType = part.type_of_part || part['type of part'] || 'Other';
              const isTop20 = (part['20_top_usage'] || part['20 top usage'] || '').toLowerCase() === 'yes';
              const total = parseInt(part.grand_total || part['grand total'] || 0);
              const isExpanded = expandedParts[partNumber];
              
              return (
                <div key={idx} className="bg-slate-800/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-all">
                  {/* Header Row */}
                  <div 
                    className="p-4 cursor-pointer flex items-center justify-between"
                    onClick={() => setExpandedParts(prev => ({...prev, [partNumber]: !prev[partNumber]}))}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {/* Expand Icon */}
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronLeft size={16} className="rotate-[-90deg]" /> : <ChevronRight size={16} />}
                      </div>
                      
                      {/* Part Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-blue-400">{partNumber}</span>
                          {isTop20 && <span className="text-yellow-400" title="Top 20 Usage">⭐</span>}
                          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400">
                            {partType}
                          </span>
                        </div>
                        <div className="text-sm text-slate-300">{partName}</div>
                      </div>
                      
                      {/* Total Stock */}
                      <div className="text-center px-4">
                        <div className="text-xs text-slate-400 mb-1">Total Stock</div>
                        <span className={`text-lg font-bold ${
                          total === 0 ? 'text-red-400' :
                          total <= 5 ? 'text-orange-400' :
                          total <= 10 ? 'text-yellow-400' :
                          'text-cyan-400'
                        }`}>{total}</span>
                      </div>
                      
                      {/* FSL Count Badge */}
                      <div className="px-3 py-1 bg-slate-700 rounded-full">
                        <span className="text-xs font-semibold text-slate-300">
                          {item.fslList.length} FSL{item.fslList.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {/* Quick Action */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(part);
                        }}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
                        title="Edit Stock"
                      >
                        <Edit size={12} /> Edit
                      </button>
                    </div>
                  </div>
                  
                  {/* Expanded FSL Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-700">
                      <div className="pt-3">
                        <div className="text-xs font-semibold text-slate-400 mb-2">FSL Locations (sorted by stock level):</div>
                        <div className="grid grid-cols-2 gap-2">
                          {item.fslList.map((fsl, i) => {
                            // Color based on stock level
                            let badgeColor = 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
                            if (fsl.stock === 0) badgeColor = 'bg-red-500/20 text-red-400 border-red-500/30';
                            else if (fsl.stock >= 1 && fsl.stock <= 5) badgeColor = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
                            else if (fsl.stock >= 6 && fsl.stock <= 10) badgeColor = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
                            
                            return (
                              <div key={i} className={`px-3 py-2 rounded-lg border ${badgeColor} flex items-center justify-between`}>
                                <span className="text-xs font-medium">{fsl.name}</span>
                                <span className="text-sm font-bold">{fsl.stock}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredParts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-400 text-sm">No parts found matching your filters.</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-slate-700">
          <div className="text-sm text-slate-400">
            Click on a part to expand FSL details
          </div>
          <button
            onClick={handleClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

