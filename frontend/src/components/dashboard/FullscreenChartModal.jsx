/**
 * Fullscreen Chart Modal Component
 * Reusable modal for displaying charts in fullscreen mode
 */
import React, { Suspense, lazy } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, PieChart, Pie, Cell, ReferenceLine } from 'recharts';
// Lazy load heavy components for better code splitting
const MapWithRegions = lazy(() => import('../map/MapWithRegions.jsx'));
const SkillProgress = lazy(() => import('../charts/SkillProgress.jsx'));
const BarMachines = lazy(() => import('../charts/BarMachines.jsx'));
import LoadingSkeleton from '../common/LoadingSkeleton';
import { getGradientCard, TEXT_STYLES, cn } from '../../constants/styles';
import { useTheme } from '../../contexts/ThemeContext';
import { CHART_COLORS_DARK, CHART_COLORS_LIGHT, OPTIMIZED_BAR_PROPS, OPTIMIZED_LINE_PROPS, OPTIMIZED_PIE_PROPS } from "../../utils/chartConfig.js";
import { limitChartData } from "../../utils/chartOptimization.js";

const CHART_DESCRIPTIONS = {
  "machines": {
    title: "Distribusi Mesin",
    description: "Grafik batang menampilkan jumlah mesin yang tersebar berdasarkan filter yang dipilih. Membantu memantau distribusi aset mesin di berbagai lokasi untuk optimalisasi perawatan dan alokasi teknisi.",
    color: "text-blue-400"
  },
  "map": {
    title: "Peta Lokasi Service Point",
    description: "Marker berwarna menunjukkan lokasi area group. Klik marker untuk melihat detail mesin dan engineer di area tersebut. Visualisasi geografis untuk perencanaan rute, distribusi tim, dan monitoring coverage area.",
    color: "text-green-400"
  },
  "experience": {
    title: "Distribusi Pengalaman Engineer",
    description: "Grafik menampilkan jumlah engineer berdasarkan rentang pengalaman kerja (tahun). Semakin tinggi batang, semakin banyak engineer di rentang tersebut. Evaluasi komposisi tim untuk balance antara senior dan junior, serta perencanaan succession planning.",
    color: "text-blue-400"
  },
  "skills": {
    title: "Ringkasan Keahlian Teknis",
    description: "Setiap batang menunjukkan jumlah engineer yang menguasai skill teknis tertentu. Identifikasi gap kompetensi, perencanaan training, dan alokasi engineer berdasarkan keahlian spesifik mesin.",
    color: "text-green-400"
  },
  "training": {
    title: "Status Pelatihan",
    description: "Diagram lingkaran menunjukkan proporsi engineer berdasarkan status pelatihan (Completed, In Progress, Not Started). Monitoring progress program pelatihan dan identifikasi engineer yang membutuhkan training.",
    color: "text-blue-400"
  },
  "training-skills": {
    title: "Progress Pelatihan Individual",
    description: "Setiap card menampilkan nama engineer dengan progress bar untuk technical skills dan soft skills (0-100%). Tracking detail perkembangan kemampuan setiap engineer untuk evaluasi kinerja dan perencanaan development.",
    color: "text-purple-400"
  },
  "total-machines": {
    title: "Analisis Total Mesin",
    description: "Perbandingan antara jumlah mesin yang terfilter (Current) dengan total seluruh mesin (Total). Memahami proporsi mesin di region/vendor/area tertentu terhadap keseluruhan aset perusahaan.",
    color: "text-blue-400"
  },
  "total-engineers": {
    title: "Analisis Total Engineer",
    description: "Perbandingan jumlah engineer yang terfilter (Current) dengan total seluruh engineer (Total). Evaluasi distribusi SDM di berbagai region/vendor/area untuk optimalisasi penempatan tim.",
    color: "text-green-400"
  },
  "machine-ratio": {
    title: "Rasio Mesin per Engineer",
    description: "Grafik menunjukkan tiga titik: Optimal (60 mesin/engineer), Current (rasio saat ini), dan High (70 - overload). Indikator beban kerja tim. Rasio tinggi menandakan perlu penambahan engineer, rasio rendah menandakan kapasitas berlebih.",
    color: "text-purple-400"
  },
  "efficiency-status": {
    title: "Status Efisiensi Operasional",
    description: "Diagram donut menampilkan persentase efisiensi (hijau=Good, kuning=Moderate, merah=High Load) vs beban kerja (Load). Quick indicator kesehatan operasional. Status merah memerlukan action plan segera (hiring/redistribusi).",
    color: "text-orange-400"
  },
  "warranty-status": {
    title: "Status Garansi Mesin",
    description: "Diagram lingkaran menampilkan proporsi mesin yang masih dalam garansi (hijau) vs sudah habis garansi (merah). Planning renewal garansi, budgeting maintenance cost, dan identifikasi mesin yang perlu penggantian atau upgrade.",
    color: "text-orange-400"
  },
  "machine-age": {
    title: "Distribusi Usia Mesin",
    description: "Grafik batang menunjukkan jumlah mesin berdasarkan rentang usia sejak instalasi. Semakin tua mesin, semakin tinggi risiko failure. Strategi replacement planning, prioritas preventive maintenance, dan forecasting capital expenditure untuk refresh aset.",
    color: "text-blue-400"
  },
  "install-year": {
    title: "Trend Instalasi per Tahun",
    description: "Grafik garis menampilkan growth jumlah mesin yang diinstal per tahun. Trend naik menunjukkan ekspansi bisnis. Analisis growth pattern, forecast kebutuhan engineer, dan perencanaan scaling infrastruktur support.",
    color: "text-green-400"
  }
};

export default function FullscreenChartModal({
  chartType,
  onClose,
  // Data props
  filteredMachines,
  filteredEngineers,
  experienceData,
  skillsData,
  trainingData,
  warrantyData,
  machineAgeData,
  installYearData,
  currentMachines,
  currentEngineers,
  totalMachines,
  totalEngineers,
  currentRatio,
  efficiencyPercentage,
  loadPercentage,
  // Breakdown data for actionable insights
  machinesByRegion,
  engineersByRegion,
  machinesByAreaGroup,
  machinesByVendor,
  engineersByAreaGroup,
  // Handler props
  onEngineerClick,
  // Warranty data
  warrantyPercentage,
  onWarranty,
  outOfWarranty,
  warrantyRemaining
}) {
  const { isDark } = useTheme();
  const COLORS = isDark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  
  if (!chartType) return null;

  const chartInfo = CHART_DESCRIPTIONS[chartType] || { title: "", description: "", color: "text-blue-400" };

  const renderChartContent = () => {
    switch (chartType) {
      case "machines":
        return (
          <div className="w-full h-full">
            <Suspense fallback={<LoadingSkeleton type="spinner" message="Memuat grafik mesin..." />}>
              <BarMachines machinesFiltered={filteredMachines} />
            </Suspense>
          </div>
        );

      case "map":
        return (
          <div className="w-full h-full" style={{ minHeight: '600px', height: '100%' }}>
            <Suspense fallback={<LoadingSkeleton type="spinner" message="Memuat peta..." />}>
              <MapWithRegions 
                machines={filteredMachines || []} 
                engineers={filteredEngineers || []}
                onEngineerClick={onEngineerClick}
              />
            </Suspense>
          </div>
        );

      case "experience":
        return (
          <div className="w-full" style={{ minHeight: '400px', height: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
            <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
              <BarChart data={limitChartData(experienceData, 50)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: "#94a3b8", fontSize: 14 }}
                  label={{ value: 'Experience Range', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                />
                <YAxis 
                  tick={{ fill: "#94a3b8", fontSize: 14 }}
                  label={{ value: 'Number of Engineers', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f172a", 
                    border: "2px solid #3b82f6",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }} 
                  labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} {...OPTIMIZED_BAR_PROPS} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "skills":
        return (
          <div className="w-full" style={{ minHeight: '400px', height: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
            <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
              <BarChart data={limitChartData(skillsData, 50)} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="skill" 
                  tick={{ fill: "#94a3b8", fontSize: 12 }} 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  tick={{ fill: "#94a3b8", fontSize: 14 }}
                  label={{ value: 'Count', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f172a", 
                    border: "2px solid #10b981",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "training":
        return (
          <div className="w-full" style={{ minHeight: '400px', height: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
            <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
              <PieChart>
                <Pie 
                  data={limitChartData(trainingData, 20)} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%"
                  cy="50%"
                  outerRadius="40%"
                  {...OPTIMIZED_PIE_PROPS}
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={true}
                >
                  {trainingData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f172a", 
                    border: "2px solid #3b82f6",
                    borderRadius: "8px",
                    color: "#ffffff"
                  }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  itemStyle={{ color: "#ffffff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case "training-skills":
        return (
          <div className="w-full h-full overflow-y-auto pr-4">
            <Suspense fallback={<LoadingSkeleton type="spinner" message="Memuat progress skills..." />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEngineers.length > 0 ? (
                  filteredEngineers.map((engineer, idx) => (
                    <SkillProgress key={idx} engineer={engineer} />
                  ))
                ) : (
                  <div className="col-span-full flex items-center justify-center h-full text-slate-500">
                    No engineers data available
                  </div>
                )}
              </div>
            </Suspense>
          </div>
        );

      case "total-machines": {
        // Prepare breakdown data for chart
        const regionData = machinesByRegion ? Object.entries(machinesByRegion)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10) : [];
        
        const areaData = machinesByAreaGroup ? Object.entries(machinesByAreaGroup)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10) : [];
        
        return (
        <div className="w-full space-y-6 overflow-y-auto pb-6" style={{ maxHeight: '100%' }}>
            {/* Warranty Breakdown Overview */}
            {warrantyPercentage !== undefined && onWarranty !== undefined && (
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <h4 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span>📊</span> Warranty Status Overview
                </h4>
                
                <div className="space-y-4">
                  {/* Progress Bar - Large */}
                  <div className="w-full h-6 bg-slate-700/50 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500 flex items-center justify-center"
                      style={{ width: `${warrantyPercentage}%` }}
                    >
                      {warrantyPercentage >= 20 && (
                        <span className="text-xs font-bold text-white">{warrantyPercentage.toFixed(1)}%</span>
                      )}
                    </div>
                    <div 
                      className="absolute top-0 right-0 h-full bg-gradient-to-r from-red-500/80 to-red-400/80 transition-all duration-500 flex items-center justify-center"
                      style={{ width: `${100 - warrantyPercentage}%` }}
                    >
                      {(100 - warrantyPercentage) >= 20 && (
                        <span className="text-xs font-bold text-white">{(100 - warrantyPercentage).toFixed(1)}%</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Warranty Stats Grid - Enhanced */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* On Warranty */}
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 hover:bg-green-500/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-2xl">✅</span>
                          <span className="text-sm text-green-300 font-semibold">On Warranty</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-green-400">{onWarranty.toLocaleString()}</span>
                          <span className="text-lg text-green-300/70">mesin</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-green-300/70">Percentage</span>
                          <span className="text-green-400 font-bold">{warrantyPercentage.toFixed(1)}%</span>
                        </div>
                        {warrantyRemaining && warrantyRemaining.avgMonths > 0 && (
                          <div className="flex items-center justify-between text-xs pt-2 border-t border-green-500/20">
                            <span className="text-green-300/70">Avg. Remaining</span>
                            <span className="text-green-400 font-bold">{warrantyRemaining.avgMonths} bulan</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Out of Warranty */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 hover:bg-red-500/20 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 text-2xl">⚠️</span>
                          <span className="text-sm text-red-300 font-semibold">Expired</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-red-400">{outOfWarranty.toLocaleString()}</span>
                          <span className="text-lg text-red-300/70">mesin</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-red-300/70">Percentage</span>
                          <span className="text-red-400 font-bold">{(100 - warrantyPercentage).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-red-500/20">
                          <span className="text-red-300/70">Status</span>
                          <span className={`font-bold ${
                            (100 - warrantyPercentage) > 70 ? "text-red-400" : (100 - warrantyPercentage) > 50 ? "text-yellow-400" : "text-green-400"
                          }`}>
                            {(100 - warrantyPercentage) > 70 ? "Critical" : (100 - warrantyPercentage) > 50 ? "High" : "Normal"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-700">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-slate-200">{currentMachines.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1">Total Mesin</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-400">{onWarranty.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1">Aktif</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-400">{outOfWarranty.toLocaleString()}</p>
                      <p className="text-xs text-slate-400 mt-1">Expired</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Breakdown by Region */}
            {regionData.length > 0 && (
              <div style={{ height: '350px' }}>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Top 10 Region</h4>
                <div style={{ minWidth: '100px', position: 'relative', width: '100%', display: 'block' }}>
                  <ResponsiveContainer width="100%" height={300} minHeight={300} minWidth={100}>
                    <BarChart data={limitChartData(regionData, 50)} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #3b82f6", borderRadius: "8px", color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} {...OPTIMIZED_BAR_PROPS} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
            
            {/* Breakdown by Area */}
            {areaData.length > 0 && (
              <div style={{ height: '350px', minWidth: '100px', position: 'relative', width: '100%', display: 'block' }}>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Top 10 Area Group</h4>
                <ResponsiveContainer width="100%" height={300} minHeight={300} minWidth={100}>
                  <BarChart data={limitChartData(areaData, 50)} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #3b82f6", borderRadius: "8px", color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                    <Bar dataKey="value" fill="#60a5fa" radius={[4, 4, 0, 0]} {...OPTIMIZED_BAR_PROPS} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }

      case "total-engineers": {
        // Valid regions only - filter out area_group names like Jakarta
        const validRegions = ['Region 1', 'Region 2', 'Region 3'];
        
        // Sort by region order (Region 1, Region 2, Region 3)
        const sortByRegionOrder = (a, b) => {
          const orderA = validRegions.indexOf(a.name || a.region);
          const orderB = validRegions.indexOf(b.name || b.region);
          // If not found, put at end
          if (orderA === -1) return 1;
          if (orderB === -1) return -1;
          return orderA - orderB;
        };
        
        // Prepare breakdown data for chart (only valid regions)
        const regionData = engineersByRegion ? Object.entries(engineersByRegion)
          .filter(([name]) => validRegions.includes(name)) // Only include valid regions
          .map(([name, value]) => ({ name, value }))
          .sort(sortByRegionOrder) : []; // Sort by region order
        
        const areaData = engineersByAreaGroup ? Object.entries(engineersByAreaGroup)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10) : [];
        
        // Calculate ratio per region for chart (only valid regions)
        const ratioData = regionData
          .filter(r => validRegions.includes(r.name)) // Only include valid regions
          .map(r => {
            const machines = machinesByRegion?.[r.name] || 0;
            const engineers = r.value;
            return {
              name: r.name,
              machines,
              engineers,
              ratio: engineers > 0 ? Math.round(machines / engineers) : 0
            };
          })
          .sort(sortByRegionOrder); // Sort by region order
        
        return (
          <div className="w-full h-full space-y-6">
            {/* Comparison Chart */}
            <div className="h-1/4">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Perbandingan Filter vs Total</h4>
              <div style={{ minWidth: '100px', minHeight: '200px', height: '200px', position: 'relative', width: '100%', display: 'block' }}>
                <ResponsiveContainer width="100%" height={200} minHeight={200} minWidth={100}>
                  <BarChart data={[
                  { name: 'Filter', value: currentEngineers },
                  { name: 'Total', value: totalEngineers }
                ]} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 14 }} />
                  <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #10b981", borderRadius: "8px", color: "#ffffff" }}
                    labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                    itemStyle={{ color: "#ffffff" }}
                  />
                  <Bar dataKey="value" fill="#10b981" radius={[8, 8, 0, 0]} {...OPTIMIZED_BAR_PROPS} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Breakdown by Region */}
            {regionData.length > 0 && (
              <div style={{ minWidth: '100px', minHeight: '200px', height: '200px', position: 'relative', display: 'block' }}>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Distribusi Engineer per Region</h4>
                <ResponsiveContainer width="100%" height={200} minHeight={200} minWidth={100}>
                  <BarChart data={regionData} margin={{ top: 10, right: 20, left: 10, bottom: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-45} textAnchor="end" height={60} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #10b981", borderRadius: "8px", color: "#ffffff" }}
                      labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                    <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {/* Ratio per Region */}
            {ratioData.length > 0 && (
              <div style={{ minWidth: '100px', minHeight: '300px', height: '300px', position: 'relative', display: 'block' }}>
                <h4 className="text-sm font-semibold text-slate-300 mb-2">Rasio Mesin/Engineer per Region</h4>
                <ResponsiveContainer width="100%" height={300} minHeight={300} minWidth={100}>
                  <BarChart data={limitChartData(ratioData, 50)} margin={{ top: 10, right: 20, left: 10, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} angle={-45} textAnchor="end" height={80} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #10b981", borderRadius: "8px", color: "#ffffff" }}
                      formatter={(value) => [`${value} mesin/engineer`, 'Rasio']}
                      labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                      itemStyle={{ color: "#ffffff" }}
                    />
                    <Bar dataKey="ratio" fill="#34d399" radius={[4, 4, 0, 0]}>
                      {ratioData.map((entry, index) => {
                        const ratio = typeof entry.ratio === 'number' ? entry.ratio : parseInt(entry.ratio);
                        let color = '#34d399'; // green
                        if (ratio > 70) color = '#ef4444'; // red
                        else if (ratio > 60) color = '#f59e0b'; // yellow
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                    <ReferenceLine y={60} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Optimal (60)", position: "right" }} />
                    <ReferenceLine y={70} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Max (70)", position: "right" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        );
      }

      case "machine-ratio":
        return (
          <div className="w-full" style={{ minHeight: '400px', height: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
            <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
              <LineChart data={[
                { name: 'Optimal', value: 60 },
                { name: 'Current', value: currentRatio },
                { name: 'High', value: 70 }
              ]} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 16 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 14 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #8b5cf6", borderRadius: "8px", color: "#ffffff" }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={4} {...OPTIMIZED_LINE_PROPS} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      case "efficiency-status":
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full max-w-2xl">
              <ResponsiveContainer width="100%" height={500}>
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #f59e0b", borderRadius: "8px", color: "#ffffff" }}
                    labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
                    itemStyle={{ color: "#ffffff" }}
                    formatter={(value) => [`${value}%`, '']}
                  />
                  <Pie
                    data={[
                      { name: 'Efficiency', value: parseInt(efficiencyPercentage.replace('%', '')) || 0 },
                      { name: 'Load', value: parseInt(loadPercentage.replace('%', '')) || 0 }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={180}
                    fill="#8884d8"
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={true}
                  >
                    <Cell fill={currentRatio < 60 ? '#10b981' : currentRatio < 70 ? '#f59e0b' : '#ef4444'} />
                    <Cell fill="#334155" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-8 mt-8 text-lg">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded" style={{
                    backgroundColor: currentRatio < 60 ? '#10b981' : currentRatio < 70 ? '#f59e0b' : '#ef4444'
                  }}></div>
                  <span className="text-slate-200">Efficiency</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#334155]"></div>
                  <span className="text-slate-200">Load</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "warranty-status":
        return (
          <div className="w-full h-full flex flex-col">
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className={cn(getGradientCard('green', false), 'p-6')}>
                <div className={cn('text-4xl font-bold text-green-400')}>{warrantyData[0]?.value || 0}</div>
                <div className={cn(TEXT_STYLES.body, 'mt-2')}>Mesin In Warranty</div>
                <div className={TEXT_STYLES.kpiSubtitle}>Masih terlindungi garansi</div>
              </div>
              <div className={cn(getGradientCard('red', false), 'p-6')}>
                <div className={cn('text-4xl font-bold text-red-400')}>{warrantyData[1]?.value || 0}</div>
                <div className={cn(TEXT_STYLES.body, 'mt-2')}>Mesin Out Of Warranty</div>
                <div className={TEXT_STYLES.kpiSubtitle}>Perlu perhatian khusus</div>
              </div>
            </div>
            <div className="flex items-center justify-center" style={{ minHeight: '400px', height: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
              <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
                <PieChart>
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #f59e0b", borderRadius: "8px", color: "#ffffff" }}
                    labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
                    itemStyle={{ color: "#ffffff" }}
                  />
                  <Pie
                    data={limitChartData(warrantyData, 20)}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={140}
                    dataKey="value"
                    label={false}
                    {...OPTIMIZED_PIE_PROPS}
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#ef4444" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-12 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-green-500"></div>
                <div>
                  <div className="text-slate-200 font-semibold">In Warranty</div>
                  <div className="text-2xl font-bold text-green-400">{warrantyData[0]?.value || 0}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded bg-red-500"></div>
                <div>
                  <div className="text-slate-200 font-semibold">Out Of Warranty</div>
                  <div className="text-2xl font-bold text-red-400">{warrantyData[1]?.value || 0}</div>
                </div>
              </div>
            </div>
          </div>
        );

      case "machine-age":
        return (
          <div className="w-full" style={{ minHeight: '400px', height: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
            <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
              <BarChart data={machineAgeData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: "#94a3b8", fontSize: 16 }}
                  label={{ value: 'Rentang Usia Mesin', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 14 }}
                />
                <YAxis 
                  tick={{ fill: "#94a3b8", fontSize: 16 }}
                  label={{ value: 'Jumlah Mesin', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 14 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #3b82f6", borderRadius: "8px", color: "#ffffff" }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]}>
                  {machineAgeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index >= 3 ? '#ef4444' : index >= 2 ? '#f59e0b' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        );

      case "install-year":
        return (
          <div className="w-full" style={{ minHeight: '400px', height: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
            <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
              <LineChart data={installYearData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="year" 
                  tick={{ fill: "#94a3b8", fontSize: 16 }}
                  label={{ value: 'Tahun Instalasi', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 14 }}
                />
                <YAxis 
                  tick={{ fill: "#94a3b8", fontSize: 16 }}
                  label={{ value: 'Jumlah Mesin', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 14 }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "2px solid #10b981", borderRadius: "8px", color: "#ffffff" }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "16px" }}
                  itemStyle={{ color: "#ffffff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#10b981" 
                  strokeWidth={4} 
                  dot={{ fill: '#10b981', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );

      default:
        return null;
    }
  };

  // Calculate insights and recommendations based on chart type
  const getInsights = () => {
    switch (chartType) {
      case "total-machines": {
        const percentage = totalMachines > 0 ? ((currentMachines / totalMachines) * 100).toFixed(1) : 0;
        const diff = totalMachines - currentMachines;
        
        // Calculate breakdown by region
        const regionBreakdown = machinesByRegion ? Object.entries(machinesByRegion)
          .map(([region, count]) => ({ region, count, percentage: ((count / totalMachines) * 100).toFixed(1) }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) : [];
        
        // Calculate breakdown by area group
        const areaBreakdown = machinesByAreaGroup ? Object.entries(machinesByAreaGroup)
          .map(([area, count]) => ({ area, count, percentage: ((count / totalMachines) * 100).toFixed(1) }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) : [];
        
        // Calculate breakdown by vendor/customer
        const vendorBreakdown = machinesByVendor ? Object.entries(machinesByVendor)
          .map(([vendor, count]) => ({ vendor, count, percentage: ((count / totalMachines) * 100).toFixed(1) }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) : [];
        
        const topRegion = regionBreakdown[0];
        const topArea = areaBreakdown[0];
        const concentrationRisk = topRegion && (topRegion.percentage > 30) ? 'Tinggi' : topRegion && (topRegion.percentage > 20) ? 'Sedang' : 'Rendah';
        
        return {
          keyInsights: [
            `Total ${currentMachines.toLocaleString()} mesin (${percentage}% dari ${totalMachines.toLocaleString()} total)`,
            topRegion ? `Top Region: ${topRegion.region} dengan ${topRegion.count.toLocaleString()} mesin (${topRegion.percentage}%)` : 'Data region tidak tersedia',
            topArea ? `Top Area: ${topArea.area} dengan ${topArea.count.toLocaleString()} mesin (${topArea.percentage}%)` : 'Data area tidak tersedia',
            `Risiko konsentrasi: ${concentrationRisk} - ${topRegion && topRegion.percentage > 30 ? 'Terlalu terpusat di satu region' : 'Distribusi cukup merata'}`
          ],
          recommendations: [
            concentrationRisk === 'Tinggi' ? '🚨 URGENT: Redistribusi mesin atau tambahkan engineer di region dengan konsentrasi tinggi untuk mengurangi risiko' : null,
            topRegion && topRegion.percentage > 30 ? `Fokus maintenance planning di ${topRegion.region} karena memiliki ${topRegion.percentage}% total mesin` : null,
            topArea && topArea.count > 100 ? `Prioritaskan preventive maintenance di ${topArea.area} (${topArea.count} mesin)` : null,
            'Setup monitoring khusus untuk top 3 region/area dengan mesin terbanyak',
            'Review spare parts inventory berdasarkan distribusi mesin per region',
            'Optimasi routing engineer berdasarkan density mesin per area'
          ].filter(Boolean),
          alerts: concentrationRisk === 'Tinggi' ? [
            { type: 'warning', message: `Konsentrasi tinggi di ${topRegion?.region} - risiko single point of failure` }
          ] : topArea && topArea.count > 200 ? [
            { type: 'info', message: `${topArea.area} memiliki ${topArea.count} mesin - pastikan coverage engineer memadai` }
          ] : [],
          breakdownData: {
            byRegion: regionBreakdown,
            byArea: areaBreakdown,
            byVendor: vendorBreakdown
          }
        };
      }
      case "total-engineers": {
        const percentage = totalEngineers > 0 ? ((currentEngineers / totalEngineers) * 100).toFixed(1) : 0;
        const diff = totalEngineers - currentEngineers;
        const ratio = currentEngineers > 0 ? Math.round(currentMachines / currentEngineers) : 0;
        
        // Valid regions only - filter out area_group names like Jakarta
        const validRegions = ['Region 1', 'Region 2', 'Region 3'];
        
        // Sort by region order (Region 1, Region 2, Region 3)
        const sortByRegionOrder = (a, b) => {
          const orderA = validRegions.indexOf(a.region || a.name);
          const orderB = validRegions.indexOf(b.region || b.name);
          // If not found, put at end
          if (orderA === -1) return 1;
          if (orderB === -1) return -1;
          return orderA - orderB;
        };
        
        // Calculate breakdown by region (only valid regions)
        const regionBreakdown = engineersByRegion ? Object.entries(engineersByRegion)
          .filter(([region]) => validRegions.includes(region)) // Only include valid regions
          .map(([region, count]) => ({ region, count, percentage: ((count / totalEngineers) * 100).toFixed(1) }))
          .sort(sortByRegionOrder) : []; // Sort by region order
        
        // Calculate breakdown by area group
        const areaBreakdown = engineersByAreaGroup ? Object.entries(engineersByAreaGroup)
          .map(([area, count]) => ({ area, count, percentage: ((count / totalEngineers) * 100).toFixed(1) }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5) : [];
        
        // Calculate ratio per region (only valid regions)
        const regionRatios = regionBreakdown
          .filter(r => validRegions.includes(r.region)) // Only include valid regions
          .map(r => {
            const regionMachines = machinesByRegion?.[r.region] || 0;
            const regionEngineers = r.count;
            return {
              region: r.region,
              machines: regionMachines,
              engineers: regionEngineers,
              ratio: regionEngineers > 0 ? Math.round(regionMachines / regionEngineers) : 0,
              status: regionEngineers > 0 ? (regionMachines / regionEngineers < 60 ? 'Good' : regionMachines / regionEngineers < 70 ? 'Moderate' : 'High') : 'N/A'
            };
          })
          .sort(sortByRegionOrder); // Sort by region order (Region 1, 2, 3)
        
        const topRegion = regionBreakdown[0];
        const overloadedRegions = regionRatios.filter(r => {
          const ratio = typeof r.ratio === 'number' ? r.ratio : parseInt(r.ratio);
          return ratio > 70;
        });
        const underutilizedRegions = regionRatios.filter(r => {
          const ratio = typeof r.ratio === 'number' ? r.ratio : parseInt(r.ratio);
          return ratio < 40;
        });
        
        return {
          keyInsights: [
            `Total ${currentEngineers.toLocaleString()} engineer (${percentage}% dari ${totalEngineers.toLocaleString()} total)`,
            topRegion ? `Top Region: ${topRegion.region} dengan ${topRegion.count} engineer (${topRegion.percentage}%)` : 'Data region tidak tersedia',
            `Rasio keseluruhan: ${ratio} mesin/engineer ${ratio < 60 ? '(Optimal)' : ratio < 70 ? '(Normal)' : '(Tinggi)'}`,
            overloadedRegions.length > 0 ? `⚠️ ${overloadedRegions.length} region dengan beban tinggi (>70 mesin/engineer)` : '✅ Semua region dalam range optimal',
            underutilizedRegions.length > 0 ? `💡 ${underutilizedRegions.length} region dengan kapasitas berlebih (<40 mesin/engineer)` : ''
          ].filter(Boolean),
          recommendations: [
            overloadedRegions.length > 0 ? `🚨 URGENT: Tambahkan engineer di ${overloadedRegions.map(r => r.region).join(', ')} - beban kerja sangat tinggi` : null,
            underutilizedRegions.length > 0 ? `💡 Reassign engineer dari ${underutilizedRegions.map(r => r.region).join(', ')} ke region dengan beban tinggi` : null,
            topRegion && parseFloat(topRegion.percentage) > 40 ? `Fokus training dan development di ${topRegion.region} (${topRegion.percentage}% engineer)` : null,
            'Setup cross-training program untuk meningkatkan fleksibilitas penugasan engineer',
            'Review dan optimasi distribusi engineer berdasarkan density mesin per area',
            'Implementasi rotation program untuk balance workload antar region'
          ].filter(Boolean),
          alerts: currentEngineers === 0 ? [
            { type: 'critical', message: 'Tidak ada engineer dalam filter - perlu action segera' }
          ] : overloadedRegions.length > 0 ? [
            { type: 'critical', message: `${overloadedRegions.length} region overloaded - risiko burnout dan penurunan kualitas service` }
          ] : ratio > 70 ? [
            { type: 'warning', message: 'Beban kerja engineer sangat tinggi - pertimbangkan penambahan SDM' }
          ] : [],
          breakdownData: {
            byRegion: regionBreakdown,
            byArea: areaBreakdown,
            regionRatios: regionRatios,
            overloadedRegions,
            underutilizedRegions
          }
        };
      }
      case "machine-ratio": {
        const status = currentRatio < 60 ? 'Good' : currentRatio < 70 ? 'Moderate' : 'High';
        const optimalDiff = Math.abs(currentRatio - 60);
        return {
          keyInsights: [
            `Rasio saat ini: ${Math.round(currentRatio)} mesin per engineer`,
            `Status: ${status} ${status === 'Good' ? '(Beban kerja optimal)' : status === 'Moderate' ? '(Beban kerja normal)' : '(Beban kerja tinggi - perlu perhatian)'}`,
            `Selisih dari optimal (60): ${Math.round(optimalDiff)} mesin`,
            currentRatio > 70 ? '⚠️ Overload - engineer menangani terlalu banyak mesin' : currentRatio < 40 ? '💡 Underutilized - engineer memiliki kapasitas lebih' : '✅ Rasio dalam range optimal'
          ],
          recommendations: [
            currentRatio > 70 ? '🚨 URGENT: Tambahkan engineer atau redistribusi mesin ke area dengan rasio lebih rendah' : null,
            currentRatio > 100 ? 'Pertimbangkan cross-training engineer untuk meningkatkan efisiensi' : null,
            currentRatio < 40 ? 'Pertimbangkan reassignment engineer ke area dengan beban lebih tinggi' : null,
            'Setup monitoring real-time untuk track rasio dan alert otomatis jika melebihi threshold',
            'Review dan optimasi routing service untuk mengurangi travel time engineer'
          ].filter(Boolean),
          alerts: currentRatio > 70 ? [
            { type: 'critical', message: 'Rasio sangat tinggi - risiko burnout dan penurunan kualitas service' }
          ] : currentRatio < 40 ? [
            { type: 'info', message: 'Rasio rendah - ada opportunity untuk optimasi resource allocation' }
          ] : []
        };
      }
      case "efficiency-status": {
        const efficiency = parseInt(efficiencyPercentage);
        const load = parseInt(loadPercentage);
        const status = currentRatio < 60 ? 'Good' : currentRatio < 70 ? 'Moderate' : 'High Load';
        return {
          keyInsights: [
            `Efisiensi operasional: ${efficiency}% | Beban kerja: ${load}%`,
            `Status: ${status}`,
            efficiency > 80 ? '✅ Efisiensi tinggi - operasional berjalan optimal' : efficiency > 60 ? '⚠️ Efisiensi sedang - ada ruang untuk improvement' : '🚨 Efisiensi rendah - perlu action plan segera',
            `Rasio mesin/engineer: ${Math.round(currentRatio)} (${currentRatio < 60 ? 'Optimal' : currentRatio < 70 ? 'Moderate' : 'High'})`
          ],
          recommendations: [
            efficiency < 60 ? '🚨 URGENT: Review dan optimasi proses operasional, pertimbangkan penambahan SDM atau teknologi' : null,
            load > 80 ? 'Redistribusi workload atau penambahan engineer untuk mengurangi beban kerja' : null,
            'Implementasi automation untuk task repetitive guna meningkatkan efisiensi',
            'Setup KPI tracking untuk monitor trend efisiensi dan beban kerja',
            'Review dan update SOP untuk memastikan best practices diterapkan'
          ].filter(Boolean),
          alerts: efficiency < 60 ? [
            { type: 'critical', message: 'Efisiensi sangat rendah - perlu immediate action' }
          ] : load > 80 ? [
            { type: 'warning', message: 'Beban kerja tinggi - risiko penurunan kualitas service' }
          ] : []
        };
      }
      case "machine-age": {
        const oldMachines = machineAgeData?.slice(3).reduce((sum, item) => sum + item.count, 0) || 0;
        const total = machineAgeData?.reduce((sum, item) => sum + item.count, 0) || 0;
        const oldPercentage = total > 0 ? ((oldMachines / total) * 100).toFixed(1) : 0;
        return {
          keyInsights: [
            `Total mesin: ${total.toLocaleString()}`,
            `Mesin berusia > 5 tahun: ${oldMachines.toLocaleString()} (${oldPercentage}%)`,
            oldPercentage > 30 ? '⚠️ Proporsi mesin tua tinggi - risiko failure meningkat' : oldPercentage < 10 ? '✅ Portfolio mesin relatif baru' : '⚠️ Beberapa mesin mendekati usia replacement',
            'Semakin tua mesin, semakin tinggi kebutuhan maintenance dan risiko downtime'
          ],
          recommendations: [
            oldPercentage > 30 ? '🚨 URGENT: Buat replacement plan untuk mesin berusia > 5 tahun' : null,
            'Prioritaskan preventive maintenance untuk mesin berusia > 3 tahun',
            'Setup monitoring khusus untuk mesin tua dengan alert proaktif',
            'Budget planning untuk capital expenditure replacement dalam 2-3 tahun ke depan',
            'Review warranty status mesin tua dan pertimbangkan extended warranty atau service contract'
          ].filter(Boolean),
          alerts: oldPercentage > 30 ? [
            { type: 'critical', message: 'Proporsi mesin tua sangat tinggi - perlu replacement planning segera' }
          ] : oldPercentage > 20 ? [
            { type: 'warning', message: 'Beberapa mesin mendekati usia replacement - mulai planning' }
          ] : []
        };
      }
      case "install-year": {
        const recentYears = installYearData?.slice(-3) || [];
        const recentTotal = recentYears.reduce((sum, item) => sum + item.count, 0);
        const olderTotal = installYearData?.slice(0, -3).reduce((sum, item) => sum + item.count, 0) || 0;
        const growth = recentYears.length >= 2 ? ((recentYears[recentYears.length - 1].count - recentYears[0].count) / recentYears[0].count * 100).toFixed(1) : 0;
        return {
          keyInsights: [
            `Total instalasi 3 tahun terakhir: ${recentTotal.toLocaleString()} mesin`,
            growth > 0 ? `Growth trend: +${growth}% (pertumbuhan positif)` : growth < 0 ? `Growth trend: ${growth}% (penurunan)` : 'Growth trend: stabil',
            `Rata-rata instalasi per tahun: ${(recentTotal / 3).toFixed(0)} mesin`,
            olderTotal > 0 ? `Instalasi sebelum 3 tahun terakhir: ${olderTotal.toLocaleString()} mesin` : 'Semua mesin terinstal dalam 3 tahun terakhir'
          ],
          recommendations: [
            growth > 20 ? '🚀 Growth tinggi - pastikan resource (engineer, spare parts) mencukupi untuk support ekspansi' : null,
            growth < -10 ? '⚠️ Penurunan instalasi - review faktor penyebab dan strategi recovery' : null,
            'Forecast kebutuhan engineer berdasarkan trend instalasi untuk 2-3 tahun ke depan',
            'Planning inventory spare parts berdasarkan usia mesin dan pola failure',
            'Setup capacity planning untuk mengantisipasi growth atau decline trend'
          ].filter(Boolean),
          alerts: growth < -20 ? [
            { type: 'warning', message: 'Penurunan instalasi signifikan - perlu review strategi' }
          ] : growth > 50 ? [
            { type: 'info', message: 'Growth sangat tinggi - pastikan infrastruktur support mencukupi' }
          ] : []
        };
      }
      case "map": {
        const totalLocations = filteredMachines?.reduce((acc, m) => {
          const key = `${m.area_group || 'Unknown'}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {}) || {};
        const locationCount = Object.keys(totalLocations).length;
        return {
          keyInsights: [
            `Total lokasi service point: ${locationCount}`,
            `Total mesin: ${filteredMachines?.length || 0}`,
            `Total engineer: ${filteredEngineers?.length || 0}`,
            locationCount > 50 ? 'Coverage area sangat luas - pastikan distribusi engineer optimal' : 'Coverage area terpusat - evaluasi kebutuhan ekspansi'
          ],
          recommendations: [
            'Review density mesin per area untuk optimasi penempatan engineer',
            'Analisis jarak antar service point untuk efisiensi routing',
            'Identifikasi area dengan coverage rendah untuk strategi ekspansi',
            'Setup monitoring real-time untuk track service point activity'
          ],
          alerts: []
        };
      }
      case "training-skills": {
        const avgTechSkill = filteredEngineers?.length > 0 
          ? (filteredEngineers.reduce((sum, e) => sum + (e.technical_skills || 0), 0) / filteredEngineers.length).toFixed(1)
          : 0;
        const avgSoftSkill = filteredEngineers?.length > 0
          ? (filteredEngineers.reduce((sum, e) => sum + (e.soft_skills || 0), 0) / filteredEngineers.length).toFixed(1)
          : 0;
        const lowSkillCount = filteredEngineers?.filter(e => (e.technical_skills || 0) < 50 || (e.soft_skills || 0) < 50).length || 0;
        return {
          keyInsights: [
            `Total engineer: ${filteredEngineers?.length || 0}`,
            `Rata-rata technical skills: ${avgTechSkill}%`,
            `Rata-rata soft skills: ${avgSoftSkill}%`,
            lowSkillCount > 0 ? `⚠️ ${lowSkillCount} engineer memerlukan training tambahan` : '✅ Semua engineer memiliki skill level yang memadai'
          ],
          recommendations: [
            avgTechSkill < 70 ? '🚨 URGENT: Prioritaskan technical training untuk engineer dengan skill < 70%' : null,
            avgSoftSkill < 70 ? 'Prioritaskan soft skills training untuk improvement komunikasi dan teamwork' : null,
            lowSkillCount > 0 ? `Setup personalized training plan untuk ${lowSkillCount} engineer dengan skill rendah` : null,
            'Implementasi mentoring program untuk knowledge transfer',
            'Setup skill assessment berkala untuk track progress'
          ].filter(Boolean),
          alerts: avgTechSkill < 50 ? [
            { type: 'critical', message: 'Rata-rata technical skills sangat rendah - perlu immediate training intervention' }
          ] : avgSoftSkill < 50 ? [
            { type: 'warning', message: 'Rata-rata soft skills rendah - fokus pada development program' }
          ] : []
        };
      }
      case "monthly-activation": {
        // This will be handled by the activation modal, but we can add basic insights here
        return {
          keyInsights: [
            'Analisis trend aktivasi mesin per bulan',
            'Identifikasi pola seasonal dan anomaly',
            'Forecast kebutuhan resource berdasarkan trend'
          ],
          recommendations: [
            'Monitor trend untuk capacity planning',
            'Identifikasi bulan dengan aktivasi tinggi untuk resource allocation',
            'Setup alert untuk detect anomaly dalam aktivasi'
          ],
          alerts: []
        };
      }
      default:
        return { keyInsights: [], recommendations: [], alerts: [] };
    }
  };

  const insights = getInsights();
  
  return (
    <div className={`fixed inset-0 ${isDark ? 'bg-black/90' : 'bg-black/60'} backdrop-blur-md flex items-stretch sm:items-center justify-center z-[9999] p-2 sm:p-4`} style={{ zIndex: 9999 }}>
      <div className={`${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-300'} w-full max-w-full sm:max-w-7xl h-screen sm:h-[90vh] p-4 sm:p-8 relative shadow-2xl border-0 sm:border flex flex-col rounded-none sm:rounded-2xl`}>
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors text-2xl font-bold rounded-lg w-10 h-10 flex items-center justify-center z-10`}
          title="Close"
        >
          ✕
        </button>
        
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Title & Description Section */}
          <div className={`mb-6 pb-4 border-b ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2 flex items-center gap-2`}>
              <span>📊</span> {chartInfo.title}
            </h2>
            <p className={isDark ? "text-slate-300 text-sm leading-relaxed" : "text-gray-700 text-sm leading-relaxed"}>
              <span className={`font-semibold ${chartInfo.color}`}>Cara Membaca:</span> {chartInfo.description.split('.')[0]}. 
              <span className={`font-semibold ${chartInfo.color} ml-2`}>Fungsi:</span> {chartInfo.description.split('.')[1] || chartInfo.description.split('.')[0]}.
            </p>
          </div>

          {/* Chart Section */}
          <div className={`mb-6 ${isDark ? 'bg-slate-800/50 border-slate-700' : 'bg-gray-50 border-gray-300'} rounded-xl border ${chartType === 'map' ? 'p-0 overflow-hidden' : 'p-6'}`}>
            {chartType !== 'map' && (
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-gray-900'} mb-4`}>Visualisasi Data</h3>
            )}
            <div 
              className="w-full" 
              style={{ 
                minHeight: chartType === 'map' ? '600px' : '400px', 
                height: chartType === 'map' ? '600px' : (chartType === 'training-skills' ? 'auto' : '400px')
              }}
            >
              {renderChartContent()}
            </div>
          </div>

          {/* Key Insights Section */}
          {insights.keyInsights.length > 0 && (
            <div className={`mb-6 ${isDark ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300'} rounded-xl p-6 border`}>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-gray-900'} mb-4 flex items-center gap-2`}>
                <span>💡</span> Key Insights
              </h3>
              <ul className="space-y-2">
                {insights.keyInsights.map((insight, idx) => (
                  <li key={idx} className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                    <span className={isDark ? "text-blue-400 mt-1" : "text-blue-600 mt-1"}>•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Alerts Section */}
          {insights.alerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {insights.alerts.map((alert, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    alert.type === 'critical' 
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : alert.type === 'warning'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold mb-1">
                    <span>{alert.type === 'critical' ? '🚨' : alert.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
                    <span>{alert.type === 'critical' ? 'Critical' : alert.type === 'warning' ? 'Warning' : 'Info'}</span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Breakdown Data Tables */}
          {insights.breakdownData && (
            <div className="mb-6 space-y-4">
              {/* Region Breakdown */}
              {insights.breakdownData.byRegion && insights.breakdownData.byRegion.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span>📍</span> Breakdown per Region
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2 text-slate-400">Region</th>
                          <th className="text-right p-2 text-slate-400">Jumlah</th>
                          <th className="text-right p-2 text-slate-400">Persentase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insights.breakdownData.byRegion.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="p-2 text-slate-200">{item.region}</td>
                            <td className="p-2 text-right text-slate-300 font-medium">{item.count.toLocaleString()}</td>
                            <td className="p-2 text-right">
                              <span className="text-slate-300">{item.percentage}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Area Breakdown */}
              {insights.breakdownData.byArea && insights.breakdownData.byArea.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span>🏢</span> Top 5 Area Group
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2 text-slate-400">Area</th>
                          <th className="text-right p-2 text-slate-400">Jumlah</th>
                          <th className="text-right p-2 text-slate-400">Persentase</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insights.breakdownData.byArea.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                            <td className="p-2 text-slate-200">{item.area}</td>
                            <td className="p-2 text-right text-slate-300 font-medium">{item.count.toLocaleString()}</td>
                            <td className="p-2 text-right">
                              <span className="text-slate-300">{item.percentage}%</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              {/* Region Ratios (for engineers) */}
              {insights.breakdownData.regionRatios && insights.breakdownData.regionRatios.length > 0 && (
                <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <span>⚖️</span> Rasio Mesin/Engineer per Region
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left p-2 text-slate-400">Region</th>
                          <th className="text-right p-2 text-slate-400">Mesin</th>
                          <th className="text-right p-2 text-slate-400">Engineer</th>
                          <th className="text-right p-2 text-slate-400">Rasio</th>
                          <th className="text-center p-2 text-slate-400">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {insights.breakdownData.regionRatios.map((item, idx) => {
                          const ratio = typeof item.ratio === 'number' ? item.ratio : parseInt(item.ratio);
                          const statusColor = ratio < 60 ? 'text-green-400' : ratio < 70 ? 'text-yellow-400' : 'text-red-400';
                          const statusBg = ratio < 60 ? 'bg-green-500/20' : ratio < 70 ? 'bg-yellow-500/20' : 'bg-red-500/20';
                          return (
                            <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                              <td className="p-2 text-slate-200">{item.region}</td>
                              <td className="p-2 text-right text-slate-300">{item.machines.toLocaleString()}</td>
                              <td className="p-2 text-right text-slate-300">{item.engineers}</td>
                              <td className={`p-2 text-right font-semibold ${statusColor}`}>{ratio}</td>
                              <td className="p-2 text-center">
                                <span className={`px-2 py-1 rounded text-xs ${statusBg} ${statusColor}`}>
                                  {item.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recommendations Section */}
          {insights.recommendations.length > 0 && (
            <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl p-6 border border-green-500/30">
              <h3 className="text-lg font-semibold text-slate-100 mb-4 flex items-center gap-2">
                <span>🎯</span> Rekomendasi & Action Items
              </h3>
              <ul className="space-y-3">
                {insights.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

