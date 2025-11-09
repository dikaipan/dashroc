/**
 * Custom hook for machine event handlers
 * Separates event handling logic from UI component
 */
import { useCallback, useMemo } from 'react';
import { useAlert } from './useAlert';
import { useConfirm } from './useConfirm';

/**
 * Hook for machine event handlers
 * @param {Object} config - Configuration object
 * @param {Function} config.create - Create function from useCrud
 * @param {Function} config.update - Update function from useCrud
 * @param {Function} config.remove - Remove function from useCrud
 * @param {Function} config.bulkDelete - Bulk delete function from useCrud
 * @param {Function} config.setModalMode - Set modal mode function
 * @param {Function} config.setFormData - Set form data function
 * @param {Function} config.setCrudShowModal - Set show modal function
 * @param {Function} config.setSelectedMachines - Set selected machines function
 * @param {Function} config.resetForm - Reset form function
 * @returns {Object} Event handlers
 */
export function useMachineHandlers({
  create,
  update,
  remove,
  bulkDelete,
  setModalMode,
  setFormData,
  setCrudShowModal,
  setSelectedMachines,
  resetForm
}) {
  const alert = useAlert();
  const confirm = useConfirm();
  
  // Ensure resetForm is always defined and stable
  const safeResetForm = useMemo(() => resetForm || (() => {}), [resetForm]);
  const handleEdit = useCallback((machine) => {
    setModalMode("edit");
    // Include ALL fields from machine object
    const allFields = {};
    Object.keys(machine).forEach(key => {
      allFields[key] = machine[key] || "";
    });
    setFormData(allFields);
    setCrudShowModal(true);
  }, [setModalMode, setFormData, setCrudShowModal]);

  const handleDelete = useCallback(async (machine) => {
    confirm.showConfirm(
      `Apakah Anda yakin ingin menghapus mesin ${machine.wsid}?`,
      async () => {
        try {
          await remove(machine.wsid);
          alert.success('Mesin berhasil dihapus!');
        } catch (error) {
          console.error('Error deleting machine:', error);
          alert.error(`Gagal menghapus mesin: ${error.message || 'Terjadi kesalahan'}`);
        }
      },
      {
        title: 'Hapus Mesin?',
        type: 'danger',
        confirmText: 'Hapus',
        cancelText: 'Batal'
      }
    );
  }, [remove, alert, confirm]);

  const handleSave = useCallback(async (formData, modalMode) => {
    // Validation
    if (!formData || Object.keys(formData).length === 0) {
      alert.warning('Form data tidak valid. Silakan coba lagi.');
      return;
    }

    if (!formData.wsid || formData.wsid.trim() === '') {
      alert.warning('WSID wajib diisi!');
      return;
    }

    if (!formData.branch_name || formData.branch_name.trim() === '') {
      alert.warning('Nama Cabang wajib diisi!');
      return;
    }

    const actionText = modalMode === "create" ? 'menambahkan' : 'memperbarui';
    
    confirm.showConfirm(
      `Apakah Anda yakin ingin ${actionText} mesin ini?\n\n` +
      `WSID: ${formData.wsid}\n` +
      `Nama Cabang: ${formData.branch_name}\n\n` +
      `Data akan ${actionText} ke database.`,
      async () => {
        try {
          if (modalMode === "create") {
            await create(formData);
            alert.success('Mesin berhasil ditambahkan!');
          } else {
            await update(formData.wsid, formData);
            alert.success('Mesin berhasil diperbarui!');
          }
          
          // Close modal
          setCrudShowModal(false);
          // Reset form
          safeResetForm();
        } catch (error) {
          console.error('Error saving machine:', error);
          alert.error(`Gagal ${actionText} mesin: ${error.message || 'Terjadi kesalahan'}`);
        }
      },
      {
        title: `Konfirmasi ${actionText === 'menambahkan' ? 'Tambah' : 'Update'} Mesin`,
        type: 'info',
        confirmText: 'Simpan',
        cancelText: 'Batal'
      }
    );
  }, [create, update, setCrudShowModal, safeResetForm, alert, confirm]);

  const handleSelectAll = useCallback((e, filteredMachines) => {
    setSelectedMachines(e.target.checked ? filteredMachines.map(m => m.wsid) : []);
  }, [setSelectedMachines]);

  const handleSelectOne = useCallback((wsid, selectedMachines) => {
    setSelectedMachines(selectedMachines.includes(wsid) 
      ? selectedMachines.filter(id => id !== wsid) 
      : [...selectedMachines, wsid]);
  }, [setSelectedMachines]);

  const handleBulkDelete = useCallback(async (selectedMachines) => {
    if (selectedMachines.length === 0) {
      alert.warning('Pilih mesin yang ingin dihapus');
      return;
    }

    confirm.showConfirm(
      `Apakah Anda yakin ingin menghapus ${selectedMachines.length} mesin?\n\n` +
      `Tindakan ini tidak dapat dibatalkan.`,
      async () => {
        try {
          await bulkDelete(selectedMachines);
          alert.success(`Berhasil menghapus ${selectedMachines.length} mesin!`);
          setSelectedMachines([]);
        } catch (error) {
          console.error('Error deleting machines:', error);
          alert.error(`Gagal menghapus mesin: ${error.message || 'Terjadi kesalahan'}`);
        }
      },
      {
        title: 'Hapus Multiple Mesin?',
        type: 'danger',
        confirmText: 'Hapus',
        cancelText: 'Batal'
      }
    );
  }, [bulkDelete, setSelectedMachines, alert, confirm]);

  return {
    handleEdit,
    handleDelete,
    handleSave,
    handleSelectAll,
    handleSelectOne,
    handleBulkDelete,
    alert,
    confirm
  };
}

