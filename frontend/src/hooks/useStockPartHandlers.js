/**
 * Custom hook for stock part event handlers
 * Separates event handling logic from UI component
 */
import { useCallback } from 'react';
import { useAlert } from './useAlert';
import { useConfirm } from './useConfirm';

/**
 * Hook for stock part event handlers
 * @param {Object} config - Configuration object
 * @param {Function} config.create - Create function from useCrud
 * @param {Function} config.update - Update function from useCrud
 * @param {Function} config.remove - Remove function from useCrud
 * @param {Function} config.setModalMode - Set modal mode function
 * @param {Function} config.setFormData - Set form data function
 * @param {Function} config.setShowModal - Set show modal function
 * @param {Function} config.resetForm - Reset form function
 * @returns {Object} Event handlers
 */
export function useStockPartHandlers({
  create,
  update,
  remove,
  setModalMode,
  setFormData,
  setShowModal,
  resetForm
}) {
  const alert = useAlert();
  const confirm = useConfirm();
  
  const handleAdd = useCallback(() => {
    setModalMode('create');
    resetForm();
    setShowModal(true);
  }, [setModalMode, resetForm, setShowModal]);
  
  // Note: handlePartNumberSelect is kept in component as it's UI-specific

  const handleEdit = useCallback((part, fslFilter = null) => {
    setModalMode('edit');
    
    // Get all FSL columns from part data
    const partFSLData = {};
    Object.keys(part).forEach(key => {
      if (key.toLowerCase().includes('idfsl') || key.toLowerCase().includes('idccw')) {
        partFSLData[key] = part[key] || 0;
      }
    });
    
    setFormData({
      part_number: part.part_number || part['part number'] || '',
      part_name: part.part_name || part['part name'] || '',
      type_of_part: part.type_of_part || part['type of part'] || '',
      '20_top_usage': part['20_top_usage'] || part['20 top usage'] || 'No',
      grand_total: part.grand_total || part['grand total'] || '0',
      ...partFSLData // Include all FSL stock data
    });
    setShowModal(true);
  }, [setModalMode, setFormData, setShowModal]);

  const handleDelete = useCallback(async (part) => {
    const partNumber = part.part_number || part['part number'];
    const partName = part.part_name || part['part name'];
    
    confirm.showConfirm(
      `Part Number: ${partNumber}\n` +
      `Part Name: ${partName}\n\n` +
      `Data ini akan dihapus secara permanen!`,
      async () => {
        try {
          await remove(partNumber);
          alert.success(`Part ${partNumber} berhasil dihapus!`);
          // Refresh data via event
          window.dispatchEvent(new Event('stockPartDataChanged'));
        } catch (error) {
          console.error('Error deleting part:', error);
          alert.error(`Gagal menghapus part: ${error.message}`);
        }
      },
      {
        title: 'Hapus Part?',
        type: 'danger',
        confirmText: 'Hapus',
        cancelText: 'Batal'
      }
    );
  }, [remove, alert, confirm]);

  const handleSave = useCallback(async (formData, modalMode, metadata = {}, stockParts = []) => {
    if (!formData.part_number || !formData.part_name) {
      alert.warning('Part Number dan Part Name harus diisi!');
      return;
    }
    
    // Check for duplicate part_number in create mode
    if (modalMode === 'create') {
      const partNumber = formData.part_number.trim();
      const existingPart = stockParts.find(p => 
        (p.part_number || p['part number'])?.toString().trim() === partNumber
      );
      
      if (existingPart) {
        const existingPartName = existingPart.part_name || existingPart['part name'] || 'N/A';
        confirm.showConfirm(
          `Part yang sudah ada:\n` +
          `- Part Number: ${partNumber}\n` +
          `- Part Name: ${existingPartName}\n\n` +
          `Apakah Anda ingin mengedit part yang sudah ada ini?`,
          () => {
            // Switch to edit mode
            setModalMode('edit');
            // Load existing part data
            const partFSLData = {};
            Object.keys(existingPart).forEach(key => {
              if (key.toLowerCase().includes('idfsl') || key.toLowerCase().includes('idccw')) {
                partFSLData[key] = existingPart[key] || 0;
              }
            });
            
            setFormData({
              part_number: existingPart.part_number || existingPart['part number'] || '',
              part_name: existingPart.part_name || existingPart['part name'] || '',
              type_of_part: existingPart.type_of_part || existingPart['type of part'] || '',
              '20_top_usage': existingPart['20_top_usage'] || existingPart['20 top usage'] || 'No',
              grand_total: existingPart.grand_total || existingPart['grand total'] || '0',
              ...partFSLData
            });
          },
          {
            title: `Part Number "${partNumber}" sudah ada!`,
            type: 'warning',
            confirmText: 'Edit Part',
            cancelText: 'Batal'
          }
        );
        return; // Don't proceed with create
      }
    }
    
    // Validate stock values are not negative
    const fslColumns = Object.keys(formData).filter(col => 
      col.toLowerCase().includes('idfsl') || col.toLowerCase().includes('idccw')
    );
    
    const hasNegativeStock = fslColumns.some(col => {
      const value = parseInt(formData[col] || 0);
      return value < 0;
    });
    
    if (hasNegativeStock) {
      alert.warning('Stock tidak boleh negatif! Silakan periksa kembali nilai stock.');
      return;
    }
    
    // Confirmation dialog
    const actionText = modalMode === 'create' ? 'menambahkan' : 'mengupdate';
    const adjustmentInfo = metadata.adjustmentMode && metadata.adjustmentMode !== 'set' 
      ? `\nMode: ${metadata.adjustmentMode === 'add' ? 'Tambah Stock' : 'Kurangi Stock'}\nAlasan: ${metadata.reason || '-'}`
      : '';
    
    confirm.showConfirm(
      `Part Number: ${formData.part_number}\n` +
      `Part Name: ${formData.part_name}\n` +
      `Type: ${formData.type_of_part || '-'}\n` +
      `Grand Total: ${formData.grand_total || 0}${adjustmentInfo}\n\n` +
      `Data akan ${modalMode === 'create' ? 'ditambahkan' : 'diperbarui'} ke database.`,
      async () => {
        try {
          if (modalMode === 'create') {
            await create(formData);
            alert.success(`Part ${formData.part_number} berhasil ditambahkan!`);
          } else {
            await update(formData.part_number, formData);
            const modeText = metadata.adjustmentMode === 'add' ? 'ditambahkan' : 
                            metadata.adjustmentMode === 'remove' ? 'dikurangi' : 'diperbarui';
            alert.success(`Part ${formData.part_number} berhasil ${modeText}!`);
          }
          
          // Close modal
          setShowModal(false);
          // Reset form
          resetForm();
          // Refresh data via event
          window.dispatchEvent(new Event('stockPartDataChanged'));
        } catch (error) {
          console.error('Error saving part:', error);
          
          // Better error messages
          let errorMessage = 'Terjadi kesalahan';
          if (error.message) {
            if (error.message.includes('already exists')) {
              errorMessage = `Part Number "${formData.part_number}" sudah ada di database. Silakan gunakan Edit untuk mengubah part yang sudah ada.`;
            } else if (error.message.includes('not found')) {
              errorMessage = `Part Number "${formData.part_number}" tidak ditemukan.`;
            } else {
              errorMessage = error.message;
            }
          }
          
          alert.error(`Gagal ${actionText} part:\n\n${errorMessage}`);
        }
      },
      {
        title: `Konfirmasi ${actionText === 'menambahkan' ? 'Tambah' : 'Update'} Part`,
        type: 'info',
        confirmText: 'Simpan',
        cancelText: 'Batal'
      }
    );
  }, [create, update, setShowModal, resetForm, setModalMode, setFormData, alert, confirm]);

  return {
    handleAdd,
    handleEdit,
    handleDelete,
    handleSave,
    alert,
    confirm
  };
}

