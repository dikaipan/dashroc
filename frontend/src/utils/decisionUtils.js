/**
 * Decision page utility functions and configurations
 */
import { Users, Cpu, TrendingUp, AlertTriangle } from 'react-feather';
import { getGradientCard } from '../constants/styles';

/**
 * Get decision cards configuration
 * @param {Object} data - Analysis data from useDecisionData hook
 * @returns {Array} Cards configuration array
 */
export function getDecisionCards(data) {
  const {
    topEngineersData,
    machinePerformanceData,
    regionalComparisonData,
    distanceAnalysisData,
    zoneOptimizationData
  } = data;

  return [
    {
      id: 'engineer-performance',
      title: 'Top Engineer Performance',
      icon: Users,
      color: 'blue',
      summary: `${topEngineersData.length} top engineers analyzed`,
      metric: topEngineersData[0]?.performance || 0,
      metricLabel: 'Best Score',
      chartType: 'radar',
      data: topEngineersData,
      description: 'Analisis performa engineer berdasarkan pengalaman, training completion, skill level, dan jumlah mesin yang ditangani.',
      analysis: [
        `Engineer terbaik: ${topEngineersData[0]?.name || 'N/A'} dengan score ${topEngineersData[0]?.performance || 0}`,
        `Rata-rata pengalaman: ${topEngineersData.length > 0 ? (topEngineersData.reduce((a, b) => a + b.experience, 0) / topEngineersData.length).toFixed(1) : 0} tahun`,
        `${topEngineersData.filter(e => e.training === 100).length} dari ${topEngineersData.length} engineer sudah complete training`,
      ],
      recommendations: [
        'Assign high-priority machines ke engineer dengan performance tertinggi',
        'Berikan additional training untuk engineer dengan score < 70',
        'Balance workload berdasarkan jumlah mesin yang ditangani'
      ]
    },
    {
      id: 'machine-comparison',
      title: 'Machine Type Comparison',
      icon: Cpu,
      color: 'purple',
      summary: `${machinePerformanceData.length} machine types compared`,
      metric: machinePerformanceData[0]?.warrantyRate || 0,
      metricLabel: 'Best Warranty %',
      chartType: 'bar',
      data: machinePerformanceData,
      description: 'Perbandingan tipe mesin berdasarkan warranty coverage, umur rata-rata, dan total unit. Skor dihitung dari kombinasi warranty rate dan kondisi mesin.',
      analysis: [
        `Tipe mesin terbaik: ${machinePerformanceData[0]?.type || 'N/A'} (warranty ${machinePerformanceData[0]?.warrantyRate}%)`,
        `Umur rata-rata mesin: ${machinePerformanceData.length > 0 ? (machinePerformanceData.reduce((a, b) => a + parseFloat(b.avgAge), 0) / machinePerformanceData.length).toFixed(1) : 0} tahun`,
        `${machinePerformanceData.filter(m => parseFloat(m.warrantyRate) > 70).length} tipe mesin dengan warranty > 70%`
      ],
      recommendations: [
        'Fokus pembelian pada tipe mesin dengan warranty rate tertinggi',
        'Plan replacement untuk mesin dengan umur > 5 tahun',
        'Negotiasi warranty extension untuk tipe mesin dengan coverage rendah'
      ]
    },
    {
      id: 'regional-efficiency',
      title: 'Regional Efficiency Analysis',
      icon: TrendingUp,
      color: 'green',
      summary: `${regionalComparisonData.length} regions analyzed`,
      metric: regionalComparisonData[0]?.efficiency || 0,
      metricLabel: 'Best Efficiency',
      chartType: 'bar',
      data: regionalComparisonData,
      description: 'Analisis efisiensi regional berdasarkan ratio engineer:machine, average experience, dan total coverage.',
      analysis: [
        `Region paling efisien: ${regionalComparisonData[0]?.region || 'N/A'} (efficiency ${regionalComparisonData[0]?.efficiency}%)`,
        `Ratio engineer:machine terbaik: ${regionalComparisonData[0]?.ratio || 0}`,
        `Total ${regionalComparisonData.reduce((a, b) => a + parseInt(b.engineers), 0)} engineers handle ${regionalComparisonData.reduce((a, b) => a + parseInt(b.machines), 0)} machines`
      ],
      recommendations: [
        'Redistribute engineer ke region dengan ratio tinggi (overload)',
        'Hire additional engineers untuk region dengan efficiency < 50%',
        'Share best practices dari region dengan efficiency tertinggi'
      ]
    },
    {
      id: 'distance-analysis',
      title: 'Engineer-Machine Distance',
      icon: AlertTriangle,
      color: 'orange',
      summary: `${distanceAnalysisData.length} engineers analyzed`,
      metric: distanceAnalysisData[0]?.farZone || 0,
      metricLabel: 'Most Far Zones',
      chartType: 'bar',
      data: distanceAnalysisData,
      description: 'Analisis jarak antara lokasi engineer dengan mesin yang ditangani berdasarkan zona. Semakin tinggi zona, semakin jauh jaraknya. Optimal assignment adalah mesin di zona yang sama atau berdekatan.',
      analysis: [
        `Engineer dengan jarak terjauh: ${distanceAnalysisData[0]?.engineer || 'N/A'} (${distanceAnalysisData[0]?.farZone || 0} mesin zona jauh)`,
        `Total ${distanceAnalysisData.reduce((a, b) => a + b.farZone, 0)} mesin ditangani engineer zona berbeda jauh`,
        `${distanceAnalysisData.filter(e => e.farZone > 0).length} engineer handle mesin di luar zona mereka`
      ],
      recommendations: [
        'Reassign mesin di zona jauh ke engineer lokal yang lebih dekat',
        'Prioritas immediate: engineer dengan >3 mesin di zona berbeda',
        'Consider hiring engineer baru di zona dengan banyak mesin tanpa coverage lokal'
      ]
    },
    {
      id: 'zone-optimization',
      title: 'Zone Coverage Optimization',
      icon: TrendingUp,
      color: 'yellow',
      summary: `${zoneOptimizationData.length} zones mapped`,
      metric: zoneOptimizationData[0]?.needsAttention || 0,
      metricLabel: 'Priority Machines',
      chartType: 'bar',
      data: zoneOptimizationData,
      description: 'Optimasi coverage engineer per zona berdasarkan jumlah mesin, engineer assigned, dan mesin yang butuh perhatian. Priority score dihitung dari rasio mesin critical per total mesin di zona.',
      analysis: [
        `Zona prioritas tertinggi: ${zoneOptimizationData[0]?.zone || 'N/A'} (${zoneOptimizationData[0]?.needsAttention || 0} mesin perlu attention)`,
        `Ratio engineer:machine tertinggi: ${zoneOptimizationData.length > 0 ? Math.max(...zoneOptimizationData.map(z => parseFloat(z.ratio) || 0)).toFixed(1) : 0}`,
        `Total ${zoneOptimizationData.reduce((a, b) => a + b.machines, 0)} mesin across ${zoneOptimizationData.length} zones`
      ],
      recommendations: [
        'Deploy additional engineers ke zona dengan ratio >10 machines per engineer',
        'Focus maintenance resources pada zona dengan high needsAttention count',
        'Optimize travel routes untuk engineer yang cover multiple zones'
      ]
    }
  ];
}

/**
 * Get color classes for cards
 * @param {string} color - Color name
 * @returns {string} Tailwind classes
 */
/**
 * Get color classes for decision cards
 * Uses centralized style system
 */
export function getColorClasses(color) {
  // Use light intensity gradient for decision cards
  return getGradientCard(color, true).replace('/20', '/10').replace('/10', '/5').replace('/30', '/20');
}

