/**
 * Custom hook for data export functionality
 * Handles CSV export with loading state and toast notifications
 * 
 * @param {Object} options - Export options
 * @param {Function} options.exportFunction - Function to call for export (should return {success, fileName, count, error})
 * @param {Function} options.getData - Function to get data to export
 * @param {Function} options.getFileName - Function to generate filename (optional)
 * @param {string} options.emptyMessage - Message to show when no data (optional)
 * @returns {Object} Export state and handlers
 */
import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

export function useExport(options = {}) {
  const {
    exportFunction,
    getData,
    getFileName = null,
    emptyMessage = 'Tidak ada data untuk diekspor'
  } = options;

  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async () => {
    if (!exportFunction || !getData) {
      console.warn('useExport: exportFunction and getData are required');
      return;
    }

    // Get data to export
    const dataToExport = typeof getData === 'function' ? getData() : getData;
    
    if (!dataToExport || (Array.isArray(dataToExport) && dataToExport.length === 0)) {
      toast.error(emptyMessage, {
        icon: '⚠️',
        duration: 3000
      });
      return;
    }

    setIsExporting(true);
    try {
      // Generate filename if function provided
      const fileName = getFileName ? getFileName(dataToExport) : undefined;
      
      // Call export function
      const result = fileName 
        ? await exportFunction(dataToExport, fileName)
        : await exportFunction(dataToExport);

      if (result && result.success) {
        toast.success(
          `Berhasil mengekspor ${result.count?.toLocaleString() || dataToExport.length} item ke ${result.fileName || 'file'}`,
          {
            icon: '✅',
            duration: 4000
          }
        );
      } else {
        toast.error(result?.error || 'Gagal mengekspor data', {
          icon: '❌',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Terjadi kesalahan saat mengekspor data', {
        icon: '❌',
        duration: 4000
      });
    } finally {
      setIsExporting(false);
    }
  }, [exportFunction, getData, getFileName, emptyMessage]);

  return {
    isExporting,
    handleExport
  };
}

// Wrapper hooks for specific entity types
import { exportEngineersToCSV } from '../utils/engineerUtils';
import { exportMachinesToCSV } from '../utils/machineUtils';

/**
 * Hook for exporting engineers to CSV
 * @param {Function} getData - Function that returns engineers array
 * @returns {Object} Export state and handlers
 */
export function useEngineerExport(getData) {
  return useExport({
    exportFunction: exportEngineersToCSV,
    getData,
    emptyMessage: 'Tidak ada data engineer untuk diekspor'
  });
}

/**
 * Hook for exporting machines to CSV
 * @param {Function} getData - Function that returns machines array
 * @returns {Object} Export state and handlers
 */
export function useMachineExport(getData) {
  return useExport({
    exportFunction: exportMachinesToCSV,
    getData,
    emptyMessage: 'Tidak ada data mesin untuk diekspor'
  });
}

/**
 * Hook for exporting stock parts to CSV
 * @param {Function} getData - Function that returns stock parts array
 * @returns {Object} Export state and handlers
 */
export function useStockPartExport(getData) {
  // Generic CSV export for stock parts
  const exportStockPartsToCSV = (data, fileName) => {
    if (!data || data.length === 0) {
      return { success: false, error: 'No data to export' };
    }
    
    const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item)))).sort();
    const csvContent = [
      allKeys.join(','),
      ...data.map(row => allKeys.map(key => `"${String(row[key] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const dateStr = new Date().toISOString().split('T')[0];
    const finalFileName = fileName ? `stockparts_${fileName}_${dateStr}.csv` : `stockparts_${dateStr}.csv`;
    
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = finalFileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
      return { success: true, fileName: finalFileName, count: data.length };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to export CSV' };
    }
  };
  
  return useExport({
    exportFunction: exportStockPartsToCSV,
    getData,
    emptyMessage: 'Tidak ada data stock part untuk diekspor'
  });
}

/**
 * Hook for exporting tools to CSV
 * @param {Function} getData - Function that returns tools array
 * @returns {Object} Export state and handlers
 */
export function useToolExport(getData) {
  // Generic CSV export for tools
  const exportToolsToCSV = (data, fileName) => {
    if (!data || data.length === 0) {
      return { success: false, error: 'No data to export' };
    }
    
    const allKeys = Array.from(new Set(data.flatMap(item => Object.keys(item)))).sort();
    const csvContent = [
      allKeys.join(','),
      ...data.map(row => allKeys.map(key => `"${String(row[key] || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');
    
    const dateStr = new Date().toISOString().split('T')[0];
    const finalFileName = fileName ? `tools_${fileName}_${dateStr}.csv` : `tools_${dateStr}.csv`;
    
    try {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = finalFileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 100);
      return { success: true, fileName: finalFileName, count: data.length };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to export CSV' };
    }
  };
  
  return useExport({
    exportFunction: exportToolsToCSV,
    getData,
    emptyMessage: 'Tidak ada data tools untuk diekspor'
  });
}
