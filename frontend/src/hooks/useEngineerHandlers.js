/**
 * Custom hook for engineer event handlers
 * Separates event handling logic from UI component
 */
import { useCallback } from 'react';
import { useAlert } from './useAlert';
import { useConfirm } from './useConfirm';

/**
 * Hook for engineer event handlers
 * @param {Object} config - Configuration object
 * @param {Function} config.create - Create function from useCrud
 * @param {Function} config.update - Update function from useCrud
 * @param {Function} config.remove - Remove function from useCrud
 * @param {Function} config.bulkDelete - Bulk delete function from useCrud
 * @param {Function} config.setModalMode - Set modal mode function
 * @param {Function} config.setSelectedEngineerForEdit - Set selected engineer function
 * @param {Function} config.setFormData - Set form data function
 * @param {Function} config.setShowModal - Set show modal function
 * @param {Function} config.setSelectedEngineers - Set selected engineers function
 * @param {Function} config.resetForm - Reset form function
 * @returns {Object} Event handlers
 */
export function useEngineerHandlers({
  create,
  update,
  remove,
  bulkDelete,
  setModalMode,
  setSelectedEngineerForEdit,
  setFormData,
  setShowModal,
  setSelectedEngineers,
  resetForm
}) {
  const alert = useAlert();
  const confirm = useConfirm();
  
  const handleEdit = useCallback((engineer) => {
    setModalMode("edit");
    setSelectedEngineerForEdit(engineer);
    // Include ALL fields from engineer object
    const allFields = {};
    Object.keys(engineer).forEach(key => {
      allFields[key] = engineer[key] || "";
    });
    setFormData(allFields);
    setShowModal(true);
  }, [setModalMode, setSelectedEngineerForEdit, setFormData, setShowModal]);

  const handleDelete = useCallback(async (engineer) => {
    confirm.showConfirm(
      `Are you sure you want to delete ${engineer.name}?`,
      async () => {
        try {
          await remove(engineer.id);
          alert.success('Engineer deleted successfully!');
        } catch (error) {
          console.error('Error deleting engineer:', error);
          alert.error(`Failed to delete engineer: ${error.message}`);
        }
      },
      {
        title: 'Delete Engineer?',
        type: 'danger',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    );
  }, [remove, alert, confirm]);

  const handleSave = useCallback(async (formData, modalMode) => {
    // Validation
    if (!formData || Object.keys(formData).length === 0) {
      alert.warning('Form data is empty. Please fill in the required fields.');
      return;
    }
    
    if (!formData.name || formData.name.trim() === '') {
      alert.warning('Name is required');
      return;
    }
    
    if (!formData.id || formData.id.trim() === '') {
      alert.warning('ID is required');
      return;
    }

    const actionText = modalMode === "create" ? 'create' : 'update';
    
    confirm.showConfirm(
      `Are you sure you want to ${actionText} this engineer?\n\n` +
      `ID: ${formData.id}\n` +
      `Name: ${formData.name}\n\n` +
      `Data will be ${actionText === 'create' ? 'added' : 'updated'} to the database.`,
      async () => {
        try {
          if (modalMode === "create") {
            await create(formData);
            alert.success('Engineer created successfully!');
          } else {
            await update(formData.id, formData);
            alert.success('Engineer updated successfully!');
          }
          
          // Close modal
          setShowModal(false);
          // Reset form
          resetForm();
        } catch (error) {
          console.error('Error saving engineer:', error);
          alert.error(`Failed to ${actionText} engineer: ${error.message}`);
        }
      },
      {
        title: `Confirm ${actionText === 'create' ? 'Create' : 'Update'} Engineer`,
        type: 'info',
        confirmText: 'Save',
        cancelText: 'Cancel'
      }
    );
  }, [create, update, setShowModal, resetForm, alert, confirm]);

  const handleSelectAll = useCallback((e, filteredEngineers) => {
    if (e.target.checked) {
      setSelectedEngineers(filteredEngineers.map(eng => eng.id));
    } else {
      setSelectedEngineers([]);
    }
  }, [setSelectedEngineers]);

  const handleSelectOne = useCallback((engineerId, selectedEngineers) => {
    if (selectedEngineers.includes(engineerId)) {
      setSelectedEngineers(selectedEngineers.filter(id => id !== engineerId));
    } else {
      setSelectedEngineers([...selectedEngineers, engineerId]);
    }
  }, [setSelectedEngineers]);

  const handleBulkDelete = useCallback(async (selectedEngineers) => {
    if (selectedEngineers.length === 0) {
      alert.warning('Please select engineers to delete');
      return;
    }

    confirm.showConfirm(
      `Are you sure you want to delete ${selectedEngineers.length} engineer(s)?\n\n` +
      `This action cannot be undone.`,
      async () => {
        try {
          await bulkDelete(selectedEngineers);
          alert.success(`Successfully deleted ${selectedEngineers.length} engineer(s)!`);
          setSelectedEngineers([]);
        } catch (error) {
          console.error('Error deleting engineers:', error);
          alert.error(`Failed to delete engineers: ${error.message}`);
        }
      },
      {
        title: 'Delete Multiple Engineers?',
        type: 'danger',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    );
  }, [bulkDelete, setSelectedEngineers, alert, confirm]);

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

