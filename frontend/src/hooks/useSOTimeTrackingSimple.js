/**
 * Simple SO Time Tracking hook untuk debugging
 * Always return data untuk testing
 */
import { useMemo } from 'react';

export function useSOTimeTracking(period = 'thisMonth') {
  const processedData = useMemo(() => {
    console.log('[useSOTimeTrackingSimple] Always returning test data for period:', period);
    
    // Test data yang akan selalu tampil
    return {
      assignmentToStart: 1.2,
      startToComplete: 4.5,
      completeToClose: 0.8,
      targetTime: 8,
      fastestThisWeek: 2.1,
      slowest: 12.5,
      totalSOThisMonth: 188,
      monthlyTrend: 15.3,
      periodStart: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
      periodEnd: new Date().toISOString()
    };
  }, [period]);

  return {
    data: processedData,
    loading: false,
    error: null
  };
}
