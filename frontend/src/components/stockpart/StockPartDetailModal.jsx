/**
 * Stock Part Detail Modal Component
 * Displays filtered parts table for a specific FSL/City
 */
import React from 'react';
import { X, Edit } from 'react-feather';

export default function StockPartDetailModal({
  isOpen,
  onClose,
  sortValue,
  filteredStockParts,
  partsDistributionByFSL,
  onEdit
}) {
  if (!isOpen) return null;

  const totalStock = partsDistributionByFSL.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" style={{ zIndex: 9999 }}>
      <div className="bg-slate-900 rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col border border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Parts Stock di {sortValue}
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              {filteredStockParts.length} parts dengan total {totalStock} stock
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800 border-b border-slate-700 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Part Number</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Part Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Top 20</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Stock di {sortValue}</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredStockParts.map((part, idx) => {
                  const partNumber = part.part_number || part['part number'] || '-';
                  const partName = part.part_name || part['part name'] || '-';
                  const typeOfPart = part.type_of_part || part['type of part'] || '-';
                  const topUsage = part['20_top_usage'] || part['20 top usage'] || 'No';
                  
                  // Calculate stock in selected FSL
                  const fslColumns = Object.keys(part).filter(col => 
                    (col.toLowerCase().includes('idfsl') || col.toLowerCase().includes('idccw')) &&
                    col.toLowerCase().includes(sortValue.toLowerCase().substring(0, 5))
                  );
                  const stockInFSL = fslColumns.reduce((sum, col) => sum + parseInt(part[col] || 0), 0);
                  
                  return (
                    <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-400">{partNumber}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-300" title={partName}>
                          {partName}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-400">
                          {typeOfPart}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {topUsage.toLowerCase() === 'yes' ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-500/20 text-green-400">
                            ✓ Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-slate-700 text-slate-400">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <span className="text-sm font-bold text-cyan-400">{stockInFSL}</span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => {
                            onEdit(part, sortValue);
                            onClose();
                          }}
                          className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors"
                          title="Edit Stock di FSL ini"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

