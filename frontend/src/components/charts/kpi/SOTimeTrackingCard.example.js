// Example data structure for SOTimeTrackingCard
// This shows the expected data format from so_apr_spt table

export const exampleSOTimeData = {
  // Time breakdown in hours
  assignmentToStart: 1.2,   // Time from SO assignment to engineer starts working
  startToComplete: 4.5,      // Time from start to completion
  completeToClose: 0.8,      // Time from complete to officially closed
  
  // Performance metrics
  targetTime: 8,             // SLA target in hours (default: 8h)
  fastestThisWeek: 2.1,      // Fastest SO completion this week
  slowest: 12.5,             // Slowest SO (escalated cases)
  
  // Volume metrics
  totalSOThisMonth: 188,     // Total SO handled this month
  monthlyTrend: 15.3,        // Percentage change from last month (positive = increase)
  
  // Period information
  periodStart: '2024-11-01', // Start date of data period
  periodEnd: '2024-11-15',   // End date of data period
  
  // Additional metrics (optional)
  activeCount: 24,           // Currently active SO
  pendingCount: 8,           // Pending SO
  completedCount: 156,       // Completed SO this month
};

// Example API response structure with period
export const exampleAPIResponse = {
  success: true,
  data: {
    soTimeTracking: {
      avgAssignmentToStart: 1.2,
      avgStartToComplete: 4.5,
      avgCompleteToClose: 0.8,
      totalAverage: 6.5,
      target: 8,
      fastestResolution: 2.1,
      slowestResolution: 12.5,
      totalThisMonth: 188,
      trend: {
        current: 188,
        previous: 163,
        change: 15.3,
        direction: 'up'
      },
      period: {
        start: '2024-11-01',
        end: '2024-11-15',
        label: 'This Month'
      }
    }
  }
};

// Period filter options
export const periodFilters = {
  today: {
    sql: "DATE(assigned_at) = CURDATE()",
    label: "Today"
  },
  thisWeek: {
    sql: "YEARWEEK(assigned_at) = YEARWEEK(CURDATE())",
    label: "This Week"
  },
  thisMonth: {
    sql: "YEAR(assigned_at) = YEAR(CURDATE()) AND MONTH(assigned_at) = MONTH(CURDATE())",
    label: "This Month"
  },
  lastMonth: {
    sql: "YEAR(assigned_at) = YEAR(CURDATE() - INTERVAL 1 MONTH) AND MONTH(assigned_at) = MONTH(CURDATE() - INTERVAL 1 MONTH)",
    label: "Last Month"
  },
  last3Months: {
    sql: "assigned_at >= DATE_SUB(CURDATE(), INTERVAL 3 MONTH)",
    label: "Last 3 Months"
  }
};
