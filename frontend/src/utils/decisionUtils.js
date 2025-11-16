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
    distanceAnalysisData
  } = data;

  return [
    {
      id: 'engineer-performance',
      title: 'Top Engineer Performance',
      icon: Users,
      color: 'blue',
      summary: `${topEngineersData.length} top engineers analyzed`,
      metric: topEngineersData[0]?.kpiAchievement?.toFixed(1) || topEngineersData[0]?.performance?.toFixed(1) || 0,
      metricLabel: 'Best KPI Achievement %',
      chartType: 'radar',
      data: topEngineersData,
      description: 'Analisis performa engineer berdasarkan data assessment leveling (Total KPI Achievement, Total Score, Qualitative Score, dan jumlah mesin yang ditangani). Data diambil dari leveling.csv yang berisi hasil assessment engineer.',
      analysis: [
        `Engineer terbaik: ${topEngineersData[0]?.name || 'N/A'} dengan Total KPI Achievement ${topEngineersData[0]?.kpiAchievement?.toFixed(2) || topEngineersData[0]?.performance?.toFixed(2) || 0}%`,
        `Rata-rata pengalaman: ${topEngineersData.length > 0 ? (topEngineersData.reduce((a, b) => a + b.experience, 0) / topEngineersData.length).toFixed(1) : 0} tahun`,
        `Rata-rata Total KPI Achievement: ${topEngineersData.length > 0 ? (topEngineersData.reduce((a, b) => a + (b.kpiAchievement || b.performance || 0), 0) / topEngineersData.length).toFixed(2) : 0}%`,
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
      title: 'Area Group - Machine Distance',
      icon: AlertTriangle,
      color: 'orange',
      summary: `${distanceAnalysisData.length} area groups analyzed`,
      metric: distanceAnalysisData.length > 0 
        ? Math.max(...distanceAnalysisData.map(d => d.farZone || 0))
        : 0,
      metricLabel: 'Most Far Zones',
      chartType: 'bar',
      data: distanceAnalysisData,
      description: 'Analisis distribusi zona dan distance mesin berdasarkan area group dari data_mesin.csv. Data zona (1, 2, 3, dll) dan distance (0-60km, 60-120km, >120km) digunakan untuk mengkategorikan mesin per area group. Optimal assignment adalah mesin di zona yang sama atau berdekatan dengan distance minimal.',
      analysis: (() => {
        if (!distanceAnalysisData || distanceAnalysisData.length === 0) {
          return ['Tidak ada data untuk dianalisis'];
        }
        
        const totalMachines = distanceAnalysisData.reduce((a, b) => a + b.total, 0);
        const totalFarZone = distanceAnalysisData.reduce((a, b) => a + b.farZone, 0);
        const totalDistance120kmPlus = distanceAnalysisData.reduce((a, b) => a + (b.distance120kmPlus || 0), 0);
        const totalEngineers = distanceAnalysisData.reduce((a, b) => a + b.engineers, 0);
        const totalSameZone = distanceAnalysisData.reduce((a, b) => a + (b.sameZone || 0), 0);
        const totalNearZone = distanceAnalysisData.reduce((a, b) => a + (b.nearZone || 0), 0);
        
        // Find area group with most far zones
        const areaGroupWithMostFarZones = distanceAnalysisData.reduce((max, current) => 
          (current.farZone > (max?.farZone || 0)) ? current : max, null
        );
        
        // Find area group with most distance >120km
        const areaGroupWithMostDistance = distanceAnalysisData.reduce((max, current) => 
          ((current.distance120kmPlus || 0) > (max?.distance120kmPlus || 0)) ? current : max, null
        );
        
        // Calculate percentages safely
        const farZonePercentage = totalMachines > 0 ? ((totalFarZone / totalMachines) * 100).toFixed(1) : '0.0';
        const avgEngineersPerArea = distanceAnalysisData.length > 0 && totalEngineers > 0 
          ? (totalEngineers / distanceAnalysisData.length).toFixed(1) 
          : '0.0';
        
        const analysisItems = [];
        
        // Add summary
        analysisItems.push(`Total ${totalMachines.toLocaleString()} mesin dianalisis dari ${distanceAnalysisData.length} area group`);
        
        // Add zone distribution
        if (totalMachines > 0) {
          analysisItems.push(`Distribusi zona: ${totalSameZone.toLocaleString()} mesin di zona sama (${((totalSameZone / totalMachines) * 100).toFixed(1)}%), ${totalNearZone.toLocaleString()} mesin di zona dekat (${((totalNearZone / totalMachines) * 100).toFixed(1)}%), ${totalFarZone.toLocaleString()} mesin di zona jauh (${farZonePercentage}%)`);
        }
        
        // Add area group with most far zones
        if (areaGroupWithMostFarZones && areaGroupWithMostFarZones.farZone > 0) {
          analysisItems.push(`Area group dengan zona terjauh: ${areaGroupWithMostFarZones.areaGroup} (${areaGroupWithMostFarZones.farZone} mesin zona jauh, zona utama ${areaGroupWithMostFarZones.zone})`);
        } else {
          analysisItems.push('Tidak ada area group dengan mesin di zona jauh - semua mesin berada di zona yang sama atau berdekatan');
        }
        
        // Add distance information
        if (totalDistance120kmPlus > 0) {
          if (areaGroupWithMostDistance && areaGroupWithMostDistance.distance120kmPlus > 0) {
            analysisItems.push(`Total ${totalDistance120kmPlus.toLocaleString()} mesin dengan distance >120km (terbanyak di ${areaGroupWithMostDistance.areaGroup}: ${areaGroupWithMostDistance.distance120kmPlus || 0} mesin)`);
          } else {
            analysisItems.push(`Total ${totalDistance120kmPlus.toLocaleString()} mesin dengan distance >120km`);
          }
        } else {
          analysisItems.push('Semua mesin berada dalam jarak ≤120km dari area group');
        }
        
        // Add engineer information
        if (totalEngineers > 0) {
          analysisItems.push(`Total ${totalEngineers.toLocaleString()} engineer tersebar di ${distanceAnalysisData.length} area group (rata-rata ${avgEngineersPerArea} engineer per area group)`);
        } else {
          analysisItems.push(`Tidak ada engineer terdeteksi di ${distanceAnalysisData.length} area group`);
        }
        
        return analysisItems;
      })(),
      recommendations: [
        'Reassign mesin di zona jauh ke area group yang lebih dekat',
        'Prioritas immediate: area group dengan >10 mesin di zona berbeda',
        'Consider hiring engineer baru di area group dengan banyak mesin tanpa coverage lokal',
        'Optimize zona assignment untuk mengurangi distance >120km'
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

