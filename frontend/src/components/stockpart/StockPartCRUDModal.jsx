/**
 * Stock Part CRUD Modal Component
 * Modal for creating and editing stock parts
 */
import React, { useMemo } from 'react';
import { X, Hash, Package, Tag, AlertCircle, MapPin, Info, CheckCircle, TrendingUp, TrendingDown, Edit3 } from 'react-feather';
import { useAlert } from '../../hooks/useAlert';
import { CustomAlert } from '../common';

export default function StockPartCRUDModal({
  isOpen,
  onClose,
  modalMode,
  formData,
  setFormData,
  stockParts,
  validParts,
  editingFSL,
  onPartNumberSelect,
  onSave
}) {
  if (!isOpen) return null;

  const alert = useAlert();

  // Stock adjustment mode state
  const [adjustmentMode, setAdjustmentMode] = React.useState('set'); // 'set', 'add', 'remove'
  const [stockReason, setStockReason] = React.useState('');
  const [stockNotes, setStockNotes] = React.useState('');
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingSave, setPendingSave] = React.useState(null);

  // Stock thresholds
  const MIN_STOCK_ALERT = 10;
  const MAX_STOCK_WARNING = 1000;
  const LARGE_CHANGE_THRESHOLD = 50;

  // Get FSL columns from first part in stock data
  const fslColumns = useMemo(() => {
    return stockParts.length > 0 
      ? Object.keys(stockParts[0]).filter(col => 
          col.toLowerCase().includes('idfsl') || col.toLowerCase().includes('idccw')
        ).sort()
      : [];
  }, [stockParts]);

  // Extract unique values for dropdown fields from stock parts data
  const dropdownOptions = useMemo(() => {
    const options = {};
    if (!stockParts || stockParts.length === 0) return options;
    
    // Fields that should have dropdowns (repeated values)
    const dropdownFields = ['type_of_part', '20_top_usage'];
    
    dropdownFields.forEach(field => {
      const valuesSet = new Set();
      stockParts.forEach(part => {
        const value = part[field] || part[field.replace('_', ' ')];
        if (value !== null && value !== undefined && value !== '') {
          valuesSet.add(String(value).trim());
        }
      });
      options[field] = Array.from(valuesSet).sort();
    });
    
    return options;
  }, [stockParts]);

  // Stock reason options
  const reasonOptions = [
    'Initial Stock',
    'Stock Replenishment',
    'Physical Count Adjustment',
    'Return from Service',
    'Damaged/Lost',
    'Transfer In',
    'Transfer Out',
    'Emergency Supply',
    'Other'
  ];

  // Get original stock value (for edit mode)
  const getOriginalStock = (fslCol) => {
    if (modalMode === 'edit' && stockParts) {
      const original = stockParts.find(p => p.part_number === formData.part_number);
      return parseInt(original?.[fslCol] || 0);
    }
    return 0;
  };

  // Calculate stock change
  const calculateStockChange = (fslCol, newValue) => {
    const original = getOriginalStock(fslCol);
    return newValue - original;
  };

  // Validate stock level
  const validateStock = (value) => {
    const numValue = parseInt(value) || 0;
    if (numValue < 0) return { valid: false, message: 'Stock tidak boleh negatif' };
    if (numValue > MAX_STOCK_WARNING) return { valid: true, warning: `Stock sangat besar (>${MAX_STOCK_WARNING})` };
    if (numValue < MIN_STOCK_ALERT) return { valid: true, warning: `Stock rendah (<${MIN_STOCK_ALERT})` };
    return { valid: true };
  };

  // Check if large change
  const isLargeChange = () => {
    return fslColumns.some(col => {
      const value = formData[col];
      const numValue = value === '' || value === null || value === undefined ? 0 : parseInt(value) || 0;
      const change = Math.abs(calculateStockChange(col, numValue));
      return change >= LARGE_CHANGE_THRESHOLD;
    });
  };

  // Calculate grand total from FSL stocks
  const calculateGrandTotal = () => {
    return fslColumns.reduce((sum, col) => {
      const value = formData[col];
      return sum + (value === '' || value === null || value === undefined ? 0 : parseInt(value) || 0);
    }, 0);
  };

  // Parse FSL name from column name
  const parseFSLName = (fslCol) => {
    let fslName = fslCol;
    if (fslCol.includes('idfsl') && fslCol.includes('_fsl_')) {
      const cityPart = fslCol.split('_fsl_')[1];
      if (cityPart) {
        fslName = 'FSL ' + cityPart.split('_').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
      }
    } else if (fslCol.includes('idccw')) {
      const descPart = fslCol.replace(/^idccw\d+_/, '');
      if (descPart) {
        fslName = descPart.split('_').map(w => 
          w.charAt(0).toUpperCase() + w.slice(1)
        ).join(' ');
        // Add Jakarta location for Country Central Warehouse
        if (fslCol.toLowerCase().includes('idccw00')) {
          fslName += ' (Jakarta)';
        }
      }
    }
    return fslName;
  };

  const filteredFSLColumns = fslColumns.filter(fslCol => {
    // If editing specific FSL, only show that FSL
    if (!editingFSL) return true;
    return fslCol.toLowerCase().includes(editingFSL.toLowerCase().substring(0, 5));
  });

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-700 border-b border-slate-600 px-6 py-5 flex justify-between items-center shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              {modalMode === 'create' ? (
                <Package className="text-blue-400" size={20} />
              ) : (
                <Edit3 className="text-blue-400" size={20} />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                {modalMode === 'create' ? 'Tambah Part Baru' : 'Edit Part'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {modalMode === 'create' ? 'Isi form di bawah untuk menambahkan part baru' : 'Perbarui informasi part dan stock'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 p-2 rounded-lg transition-all"
            title="Tutup"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-8 max-h-[calc(90vh-180px)] overflow-y-auto custom-scrollbar">
          {/* Basic Information Section */}
          <div className="space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Package className="text-blue-400" size={18} />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Informasi Part</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Hash className="text-blue-400" size={16} />
                  <span>Part Number <span className="text-red-400 ml-1">*</span></span>
                </label>
                {modalMode === 'create' ? (
                  <input
                    type="text"
                    value={formData.part_number}
                    onChange={(e) => {
                      const partNumber = e.target.value;
                      setFormData({...formData, part_number: partNumber});
                      // Auto-fill part info if found in validParts
                      const foundPart = validParts.find(p => 
                        (p.part_number || p['part number']) === partNumber
                      );
                      if (foundPart) {
                        setFormData({
                          ...formData,
                          part_number: partNumber,
                          part_name: foundPart.part_name || foundPart['part name'] || '',
                          type_of_part: foundPart.type_of_part || foundPart['type of part'] || '',
                          '20_top_usage': foundPart['20_top_usage'] || foundPart['20 top usage'] || 'No'
                        });
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all hover:bg-slate-700/80 hover:border-slate-500"
                    placeholder="Masukkan Part Number baru"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.part_number}
                    disabled
                    className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-xl text-slate-400 opacity-50 cursor-not-allowed"
                  />
                )}
                <p className="text-xs text-slate-500">
                  {modalMode === 'create' 
                    ? 'Masukkan Part Number baru (jika part sudah ada, gunakan Edit)' 
                    : 'Part Number tidak dapat diubah'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Tag className="text-green-400" size={16} />
                  <span>Part Name <span className="text-red-400 ml-1">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.part_name}
                  onChange={(e) => setFormData({...formData, part_name: e.target.value})}
                  disabled={modalMode === 'edit'}
                  className={`w-full px-4 py-3 border border-slate-600 rounded-xl transition-all ${
                    modalMode === 'edit' 
                      ? 'bg-slate-700/30 text-slate-400 opacity-50 cursor-not-allowed'
                      : 'bg-slate-700/60 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 hover:bg-slate-700/80 hover:border-slate-500'
                  }`}
                  placeholder={modalMode === 'create' ? "Masukkan Part Name" : "Auto-filled dari Part Number"}
                />
                <p className="text-xs text-slate-500">
                  {modalMode === 'create' 
                    ? 'Masukkan nama part baru' 
                    : 'Otomatis terisi dari Part Number'}
                </p>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Info className="text-purple-400" size={16} />
                  <span>Type of Part</span>
                </label>
                {dropdownOptions.type_of_part && dropdownOptions.type_of_part.length > 0 ? (
                  <select
                    value={formData.type_of_part}
                    onChange={(e) => setFormData({...formData, type_of_part: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all hover:bg-slate-700/80 hover:border-slate-500"
                  >
                    <option value="" className="bg-slate-800">-- Pilih Type of Part --</option>
                    {dropdownOptions.type_of_part.map((option, idx) => (
                      <option key={idx} value={option} className="bg-slate-800">{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData.type_of_part}
                    disabled
                    className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-xl text-slate-400 opacity-50 cursor-not-allowed"
                    placeholder="Auto-filled dari Part Number"
                  />
                )}
                <p className="text-xs text-slate-500">Jenis part (pilih dari daftar atau otomatis terisi)</p>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <CheckCircle className="text-yellow-400" size={16} />
                  <span>Top 20 Usage</span>
                </label>
                {dropdownOptions['20_top_usage'] && dropdownOptions['20_top_usage'].length > 0 ? (
                  <select
                    value={formData['20_top_usage']}
                    onChange={(e) => setFormData({...formData, '20_top_usage': e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all hover:bg-slate-700/80 hover:border-slate-500"
                  >
                    <option value="" className="bg-slate-800">-- Pilih Top 20 Usage --</option>
                    {dropdownOptions['20_top_usage'].map((option, idx) => (
                      <option key={idx} value={option} className="bg-slate-800">{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={formData['20_top_usage']}
                    disabled
                    className="w-full px-4 py-3 bg-slate-700/30 border border-slate-600 rounded-xl text-slate-400 opacity-50 cursor-not-allowed"
                    placeholder="Auto-filled dari Part Number"
                  />
                )}
                <p className="text-xs text-slate-500">Status penggunaan part (Yes/No - pilih dari daftar)</p>
              </div>
            </div>
          </div>

          {/* Stock Adjustment Mode & Reason Section */}
          {modalMode === 'edit' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-700/50">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <TrendingUp className="text-cyan-400" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-slate-200">Stock Adjustment Mode</h3>
              </div>
              
              {/* Adjustment Mode Selector */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setAdjustmentMode('set');
                    // Reset FSL inputs to original values for 'set' mode
                    const originalPart = stockParts.find(p => 
                      (p.part_number || p['part number']) === formData.part_number
                    );
                    if (originalPart) {
                      const updatedFormData = { ...formData };
                      fslColumns.forEach(col => {
                        updatedFormData[col] = parseInt(originalPart[col] || 0);
                      });
                      setFormData(updatedFormData);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    adjustmentMode === 'set'
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300 shadow-lg'
                      : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <Edit3 size={20} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold">Set Stock</div>
                  <div className="text-xs opacity-75 mt-1">Ganti langsung</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdjustmentMode('add');
                    // Reset FSL inputs to 0 for 'add' mode (user will input amount to add)
                    const updatedFormData = { ...formData };
                    fslColumns.forEach(col => {
                      updatedFormData[col] = 0;
                    });
                    setFormData(updatedFormData);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    adjustmentMode === 'add'
                      ? 'border-green-500 bg-green-500/20 text-green-300 shadow-lg'
                      : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <TrendingUp size={20} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold">Stock IN</div>
                  <div className="text-xs opacity-75 mt-1">Tambah stock</div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdjustmentMode('remove');
                    // Reset FSL inputs to 0 for 'remove' mode (user will input amount to remove)
                    const updatedFormData = { ...formData };
                    fslColumns.forEach(col => {
                      updatedFormData[col] = 0;
                    });
                    setFormData(updatedFormData);
                  }}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    adjustmentMode === 'remove'
                      ? 'border-red-500 bg-red-500/20 text-red-300 shadow-lg'
                      : 'border-slate-600 bg-slate-800/50 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  <TrendingDown size={20} className="mx-auto mb-2" />
                  <div className="text-sm font-semibold">Stock OUT</div>
                  <div className="text-xs opacity-75 mt-1">Kurangi stock</div>
                </button>
              </div>

              {/* Reason & Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <AlertCircle className="text-yellow-400" size={16} />
                    <span>Reason <span className="text-red-400 ml-1">*</span></span>
                  </label>
                  <select
                    value={stockReason}
                    onChange={(e) => setStockReason(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all hover:bg-slate-700/80 hover:border-slate-500"
                  >
                    <option value="" className="bg-slate-800">-- Pilih Reason --</option>
                    {reasonOptions.map((reason, idx) => (
                      <option key={idx} value={reason} className="bg-slate-800">{reason}</option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500">Alasan perubahan stock (wajib diisi)</p>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Info className="text-purple-400" size={16} />
                    <span>Notes</span>
                  </label>
                  <textarea
                    value={stockNotes}
                    onChange={(e) => setStockNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-700/60 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all resize-none hover:bg-slate-700/80 hover:border-slate-500"
                    placeholder="Catatan tambahan (opsional)..."
                  />
                  <p className="text-xs text-slate-500">Informasi detail perubahan</p>
                </div>
              </div>
            </div>
          )}
          
          {/* FSL Stock Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <MapPin className="text-orange-400" size={18} />
                </div>
                <h3 className="text-lg font-semibold text-slate-200">
                  {editingFSL ? `Stock di ${editingFSL}` : 'Stock per FSL Location'}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm bg-cyan-500/20 px-4 py-2 rounded-lg border border-cyan-500/30">
                <span className="text-slate-300">Grand Total:</span>
                <span className="text-cyan-400 font-bold text-lg">{calculateGrandTotal()}</span>
                <span className="text-slate-400">units</span>
              </div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50">
              <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                <Info size={14} />
                {modalMode === 'edit' && adjustmentMode === 'set' && 'Masukkan jumlah stock akhir untuk setiap FSL location.'}
                {modalMode === 'edit' && adjustmentMode === 'add' && 'Masukkan jumlah stock yang ingin DITAMBAHKAN untuk setiap FSL location.'}
                {modalMode === 'edit' && adjustmentMode === 'remove' && 'Masukkan jumlah stock yang ingin DIKURANGI untuk setiap FSL location.'}
                {modalMode === 'create' && 'Masukkan jumlah stock untuk setiap FSL location. Nilai akan otomatis dijumlahkan sebagai Grand Total.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
                {filteredFSLColumns.map(fslCol => {
                  const fslName = parseFSLName(fslCol);
                  const formValue = formData[fslCol];
                  const inputValue = formValue === '' || formValue === null || formValue === undefined ? 0 : parseInt(formValue) || 0;
                  const originalValue = getOriginalStock(fslCol);
                  
                  // Calculate preview value based on adjustment mode
                  let previewValue = inputValue;
                  if (modalMode === 'edit' && adjustmentMode === 'add') {
                    previewValue = originalValue + inputValue;
                  } else if (modalMode === 'edit' && adjustmentMode === 'remove') {
                    previewValue = Math.max(0, originalValue - inputValue);
                  } else if (modalMode === 'edit' && adjustmentMode === 'set') {
                    previewValue = inputValue;
                  }
                  
                  return (
                    <div key={fslCol} className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                        <MapPin size={12} className="text-orange-400" />
                        <span className="truncate" title={fslName}>{fslName}</span>
                      </label>
                      {modalMode === 'edit' && (
                        <div className="text-xs text-slate-500 mb-1">
                          Stock saat ini: <span className="text-blue-400 font-semibold">{originalValue}</span>
                        </div>
                      )}
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={formData[fslCol] === undefined || formData[fslCol] === null || formData[fslCol] === '' ? '' : formData[fslCol]}
                        onChange={(e) => {
                          const inputValue = e.target.value;
                          // Allow empty string while typing
                          if (inputValue === '') {
                            setFormData({...formData, [fslCol]: ''});
                          } else {
                            // Only parse if it's a valid number
                            const numValue = parseInt(inputValue);
                            if (!isNaN(numValue) && numValue >= 0) {
                              setFormData({...formData, [fslCol]: numValue});
                            }
                          }
                        }}
                        onBlur={(e) => {
                          // When user leaves the field, ensure it has a valid value
                          const value = e.target.value === '' ? 0 : parseInt(e.target.value) || 0;
                          setFormData({...formData, [fslCol]: value});
                        }}
                        className="w-full px-3 py-2.5 bg-slate-700/60 border border-slate-600 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 text-sm transition-all hover:bg-slate-700/80 hover:border-slate-500"
                        placeholder="0"
                      />
                      {modalMode === 'edit' && adjustmentMode !== 'set' && inputValue > 0 && (
                        <div className="text-xs">
                          <span className="text-slate-400">Akan menjadi: </span>
                          <span className={`font-semibold ${previewValue < originalValue ? 'text-red-400' : previewValue > originalValue ? 'text-green-400' : 'text-slate-300'}`}>
                            {previewValue}
                          </span>
                        </div>
                      )}
                      {modalMode === 'create' && inputValue > 0 && (
                        <p className="text-xs text-green-400 font-medium">{inputValue} unit</p>
                      )}
                      {modalMode === 'edit' && adjustmentMode === 'set' && inputValue > 0 && (
                        <p className="text-xs text-green-400 font-medium">{inputValue} unit</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-slate-700 border-t border-slate-600 px-6 py-5 flex justify-end gap-3 shadow-lg">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700/80 hover:bg-slate-600 text-slate-100 rounded-xl transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105"
          >
            Batal
          </button>
          <button
            onClick={() => {
              // For create mode, send formData directly
              if (modalMode === 'create') {
                onSave(formData);
                return;
              }
              
              // For edit mode, validate reason and send with metadata
              if (!stockReason) {
                alert.warning('Alasan perubahan stock wajib diisi!');
                return;
              }
              
              // Send with wrapper object for edit mode
              onSave({ 
                formData, 
                reason: stockReason, 
                notes: stockNotes, 
                mode: adjustmentMode 
              });
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-xl transition-all font-medium shadow-lg hover:shadow-xl hover:scale-105 flex items-center gap-2"
          >
            {modalMode === 'create' ? (
              <>
                <span>+</span> Tambah Part
              </>
            ) : (
              <>
                <span>✓</span> Update Stock
              </>
            )}
          </button>
        </div>
      </div>

      {/* Custom Alert Dialog */}
      <CustomAlert
        isOpen={alert.alertState.isOpen}
        onClose={alert.closeAlert}
        type={alert.alertState.type}
        title={alert.alertState.title}
        message={alert.alertState.message}
        duration={alert.alertState.duration}
      />
    </div>
  );
}

