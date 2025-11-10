/**
 * Custom hook for handling CSV exports with toast notifications
 * Provides consistent export functionality across all pages
 * 
 * @module useExport
 */

import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { exportToCSV } from '../utils/exportUtils.js';
import { exportMachinesToCSV } from '../utils/machineUtils.js';
import { exportEngineersToCSV } from '../utils/engineerUtils.js';

/**
 * Hook for handling CSV exports with toast notifications
 * @param {string} entityName - Name of the entity (e.g., 'engineers', 'machines', 'stock_parts')
 * @param {Function} [customExportFn] - Optional custom export function (for entities with special logic)
 * @returns {{handleExport: Function, isExporting: boolean}}
 */
export function useExport(entityName, customExportFn = null) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = useCallback(async (data, fileName = null, entityLabel = null) => {
    if (!data || data.length === 0) {
      toast.error('Tidak ada data untuk diekspor', {
        icon: '⚠️',
        duration: 3000
      });
      return;
    }
    
    setIsExporting(true);
    try {
      let result;
      
      // Use custom export function if provided, otherwise use generic export
      if (customExportFn) {
        result = customExportFn(data, fileName);
      } else {
        result = exportToCSV(data, entityName, fileName);
      }
      
      if (result.success) {
        const label = entityLabel || entityName;
        toast.success(
          `Berhasil mengekspor ${result.count.toLocaleString()} ${label} ke ${result.fileName}`,
          {
            icon: '✅',
            duration: 4000
          }
        );
      } else {
        toast.error(result.error || 'Gagal mengekspor data', {
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
  }, [entityName, customExportFn]);

  return { handleExport, isExporting };
}

/**
 * Pre-configured hooks for specific entities
 */
export const useMachineExport = () => useExport('machines', exportMachinesToCSV);
export const useEngineerExport = () => useExport('engineers', exportEngineersToCSV);
export const useStockPartExport = () => useExport('stock_parts');
export const useToolExport = () => useExport('tools');
export const useBabyPartExport = () => useExport('baby_parts');

