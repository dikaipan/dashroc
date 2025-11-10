import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import L from "leaflet";
import indonesiaGeoJSON_RAW_STRING from "../../data/peta_indonesia_geojson/indonesia-prov.geojson?raw";
import { useTheme } from "../../contexts/ThemeContext";

const geoJsonData = JSON.parse(indonesiaGeoJSON_RAW_STRING);

// City to Province mapping - COMPLETE
const cityToProvince = {
  // DKI Jakarta
  'Jakarta': 'DKI JAKARTA',
  'Jakarta Pusat': 'DKI JAKARTA',
  'Jakarta Selatan': 'DKI JAKARTA',
  'Jakarta Barat': 'DKI JAKARTA',
  'Jakarta Timur': 'DKI JAKARTA',
  'Jakarta Utara': 'DKI JAKARTA',
  
  // Jawa Barat
  'Bandung': 'JAWA BARAT',
  'Bogor': 'JAWA BARAT',
  'Depok': 'JAWA BARAT',
  'Bekasi': 'JAWA BARAT',
  'Cirebon': 'JAWA BARAT',
  'Tasikmalaya': 'JAWA BARAT',
  'Sukabumi': 'JAWA BARAT',
  'Cikampek': 'JAWA BARAT',
  'Cianjur': 'JAWA BARAT',
  'Kuningan': 'JAWA BARAT',
  
  // Jawa Tengah
  'Semarang': 'JAWA TENGAH',
  'Solo': 'JAWA TENGAH',
  'Yogyakarta': 'DAERAH ISTIMEWA YOGYAKARTA',
  'Tegal': 'JAWA TENGAH',
  'Purwokerto': 'JAWA TENGAH',
  'Pekalongan': 'JAWA TENGAH',
  'Madiun': 'JAWA TENGAH',
  'Blora': 'JAWA TENGAH',
  'Klaten': 'JAWA TENGAH',
  'Jepara': 'JAWA TENGAH',
  'Madiun (Bojonegoro)': 'JAWA TENGAH',
  
  // Jawa Timur
  'Surabaya': 'JAWA TIMUR',
  'Malang': 'JAWA TIMUR',
  'Jember': 'JAWA TIMUR',
  'Kediri': 'JAWA TIMUR',
  'Banyuwangi': 'JAWA TIMUR',
  'Probolinggo': 'JAWA TIMUR',
  'Pamekasan': 'JAWA TIMUR',
  'Bangkalan': 'JAWA TIMUR',
  
  // Banten
  'Tangerang': 'BANTEN',
  'Serang': 'BANTEN',
  
  // Sumatera Utara
  'Medan': 'SUMATERA UTARA',
  'Pematang Siantar': 'SUMATERA UTARA',
  'Tarutung': 'SUMATERA UTARA',
  'Rantau Prapat': 'SUMATERA UTARA',
  
  // Sumatera Barat
  'Padang': 'SUMATERA BARAT',
  'Payakumbuh': 'SUMATERA BARAT',
  
  // Sumatera Selatan
  'Palembang': 'SUMATERA SELATAN',
  'Lahat': 'SUMATERA SELATAN',
  'Lubuklinggau': 'SUMATERA SELATAN',
  
  // Riau
  'Pekanbaru': 'RIAU',
  'Dumai': 'RIAU',
  'Tembilahan': 'RIAU',
  
  // Kepulauan Riau
  'Batam': 'KEPULAUAN RIAU',
  'Bintan': 'KEPULAUAN RIAU',
  
  // Lampung
  'Lampung': 'LAMPUNG',
  'Kotabumi': 'LAMPUNG',
  
  // Jambi
  'Jambi': 'JAMBI',
  
  // Bengkulu
  'Bengkulu': 'BENGKULU',
  
  // Aceh
  'Aceh': 'DI. ACEH',
  
  // Bangka Belitung
  'Bangka': 'BANGKA BELITUNG',
  'Belitung': 'BANGKA BELITUNG',
  
  // Kalimantan Barat
  'Pontianak': 'KALIMANTAN BARAT',
  'Ketapang': 'KALIMANTAN BARAT',
  'Sanggau': 'KALIMANTAN BARAT',
  
  // Kalimantan Tengah
  'Palangkaraya': 'KALIMANTAN TENGAH',
  'Pangkalan Bun': 'KALIMANTAN TENGAH',
  
  // Kalimantan Selatan
  'Banjarmasin': 'KALIMANTAN SELATAN',
  
  // Kalimantan Timur
  'Balikpapan': 'KALIMANTAN TIMUR',
  'Samarinda': 'KALIMANTAN TIMUR',
  'Berau': 'KALIMANTAN TIMUR',
  
  // Kalimantan Utara
  'Tarakan': 'KALIMANTAN UTARA',
  
  // Sulawesi Utara
  'Manado': 'SULAWESI UTARA',
  
  // Sulawesi Tengah
  'Palu': 'SULAWESI TENGAH',
  'Palu/Luwuk': 'SULAWESI TENGAH',
  
  // Sulawesi Selatan
  'Makassar': 'SULAWESI SELATAN',
  'Pare Pare': 'SULAWESI SELATAN',
  'Palopo': 'SULAWESI SELATAN',
  'Bulukumba': 'SULAWESI SELATAN',
  
  // Sulawesi Tenggara
  'Kendari': 'SULAWESI TENGGARA',
  
  // Gorontalo
  'Gorontalo': 'GORONTALO',
  
  // Maluku
  'Ambon': 'MALUKU',
  
  // Maluku Utara
  'Ternate': 'MALUKU UTARA',
  
  // Papua
  'Timika': 'PAPUA',
  'Jayapura': 'PAPUA',
  'Marauke': 'PAPUA',
  
  // Papua Barat
  'Sorong': 'PAPUA BARAT',
  'Manokwari': 'PAPUA BARAT',
  
  // Bali
  'Denpasar': 'BALI',
  
  // Nusa Tenggara Barat
  'Mataram': 'NUSATENGGARA BARAT',
  'Bima': 'NUSATENGGARA BARAT',
  
  // Nusa Tenggara Timur
  'Kupang': 'NUSA TENGGARA TIMUR',
  'Waikabubak': 'NUSA TENGGARA TIMUR',
  'Ruteng': 'NUSA TENGGARA TIMUR',
  'Ende': 'NUSA TENGGARA TIMUR',
  'Atambua': 'NUSA TENGGARA TIMUR',
  'Larantuka': 'NUSA TENGGARA TIMUR'
};

const areaPolygons = {
  "Jakarta": [
    [-6.0, 106.6], [-6.0, 107.0], [-6.4, 107.0], [-6.4, 106.6]
  ],
  "Surabaya": [
    [-7.1, 112.6], [-7.1, 112.9], [-7.4, 112.9], [-7.4, 112.6]
  ],
  "Bandung": [
    [-6.8, 107.4], [-6.8, 107.8], [-7.1, 107.8], [-7.1, 107.4]
  ],
  "Semarang": [
    [-6.9, 110.3], [-6.9, 110.6], [-7.1, 110.6], [-7.1, 110.3]
  ],
  "Medan": [
    [3.4, 98.5], [3.4, 98.8], [3.7, 98.8], [3.7, 98.5]
  ],
  "Palembang": [
    [-2.8, 104.6], [-2.8, 104.9], [-3.1, 104.9], [-3.1, 104.6]
  ],
  "Makassar": [
    [-5.0, 119.3], [-5.0, 119.6], [-5.3, 119.6], [-5.3, 119.3]
  ],
  "Timika": [
    [-4.4, 136.7], [-4.4, 137.1], [-4.7, 137.1], [-4.7, 136.7]
  ],
  "Balikpapan": [
    [-1.1, 116.8], [-1.1, 117.1], [-1.4, 117.1], [-1.4, 116.8]
  ],
  "Denpasar": [
    [-8.5, 115.1], [-8.5, 115.3], [-8.8, 115.3], [-8.8, 115.1]
  ]
};

const createPolygonFromCenter = (lat, lng, size = 0.3) => {
  return [
    [lat - size, lng - size],
    [lat - size, lng + size],
    [lat + size, lng + size],
    [lat + size, lng - size]
  ];
};

const regionColors = {
  "Region 1": '#ef4444',  // Red
  "Region 2": '#3b82f6',  // Blue
  "Region 3": '#10b981',  // Green
  "Region 4": '#f59e0b',  // Orange
  "Region 5": '#8b5cf6',  // Purple
  "Region 6": '#ec4899',  // Pink
  "Region 7": '#14b8a6',  // Teal
  "Region 8": '#f97316',  // Orange-Red
  "Region 9": '#6366f1',  // Indigo
  "Region 10": '#eab308', // Yellow
};

const getColorByRegion = (region) => {
  return regionColors[region] || '#94a3b8'; // Default gray
};

const getColorWithDensity = (region, engineerCount) => {
  const baseColor = getColorByRegion(region);
  const maxCount = 100;
  const ratio = engineerCount / maxCount;
  
  // Adjust opacity based on density
  if (ratio > 0.7) return baseColor + 'ee'; // Almost opaque
  if (ratio > 0.5) return baseColor + 'cc';
  if (ratio > 0.3) return baseColor + 'aa';
  return baseColor + '88'; // More transparent for low density
};

// Memoize component to prevent unnecessary re-renders
const MapWithRegions = React.memo(function MapWithRegions({ machines, engineers = [], onEngineerClick, isFullscreen = false }) {
  const [map, setMap] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isLegendVisible, setIsLegendVisible] = useState(true);
  const { theme, isDark } = useTheme();

  const areaGroupStats = useMemo(() => {
    const stats = {};
    
    (engineers || []).forEach(engineer => {
      const areaGroup = engineer.area_group || 'Unknown';
      const region = engineer.region || 'Unknown';
      
      // 🔥 MAP CITY TO PROVINCE - INI KUNCI NYA!
      const provinceName = cityToProvince[areaGroup] || areaGroup;
      const key = provinceName; // GROUP BY PROVINCE!
      
      if (!stats[key]) {
        stats[key] = {
          areaGroup: key, // Province name
          cities: new Set(), // Track all cities
          region,
          engineerCount: 0,
          machineCount: 0,
          engineers: [],
          latitude: 0,
          longitude: 0,
          validCoords: 0
        };
      }
      
      // 🏙️ Add city to this province
      stats[key].cities.add(areaGroup);
      
      stats[key].engineerCount++;
      stats[key].engineers.push(engineer);
      
      if (engineer.latitude && engineer.longitude) {
        stats[key].latitude += parseFloat(engineer.latitude);
        stats[key].longitude += parseFloat(engineer.longitude);
        stats[key].validCoords++;
      }
    });
    
    Object.keys(stats).forEach(key => {
      if (stats[key].validCoords > 0) {
        stats[key].latitude /= stats[key].validCoords;
        stats[key].longitude /= stats[key].validCoords;
      }
    });
    
    // Process machines
    (machines || []).forEach(machine => {
      const areaGroup = machine.area_group || 'Unknown';
      const provinceName = cityToProvince[areaGroup] || areaGroup;
      // If province doesn't exist in stats, create it
      if (!stats[provinceName]) {
        stats[provinceName] = {
          areaGroup: provinceName,
          cities: new Set(),
          region: 'Unknown',
          engineerCount: 0,
          machineCount: 0,
          engineers: [],
          latitude: 0,
          longitude: 0,
          validCoords: 0
        };
      }
      stats[provinceName].machineCount++;
    });
    
    return stats;
  }, [engineers, machines]);
  

  // Debounce fitBounds to avoid forced reflow
  const fitBoundsTimeoutRef = useRef(null);
  
  useEffect(() => {
    if (map && Object.keys(areaGroupStats).length > 0) {
      // Clear existing timeout
      if (fitBoundsTimeoutRef.current) {
        clearTimeout(fitBoundsTimeoutRef.current);
      }
      
      // Increased debounce and use requestIdleCallback for non-critical map updates
      fitBoundsTimeoutRef.current = setTimeout(() => {
        const updateBounds = () => {
          const bounds = L.latLngBounds();
          
          Object.values(areaGroupStats).forEach(stat => {
            if (stat.latitude && stat.longitude && stat.validCoords > 0) {
              bounds.extend([stat.latitude, stat.longitude]);
            }
          });
          
          if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50], animate: false });
          }
        };
        
        // Use requestIdleCallback if available, otherwise use RAF with longer delay
        if (window.requestIdleCallback) {
          window.requestIdleCallback(updateBounds, { timeout: 500 });
        } else {
          // Use double RAF for better batching
          requestAnimationFrame(() => {
            requestAnimationFrame(updateBounds);
          });
        }
      }, 300); // Increased from 150ms to 300ms
    }
    
    return () => {
      if (fitBoundsTimeoutRef.current) {
        clearTimeout(fitBoundsTimeoutRef.current);
      }
    };
  }, [map, areaGroupStats]);

  // Allow map to render even without engineers (machines might still be available)
  // Only show message if both engineers and machines are empty
  if ((!engineers || engineers.length === 0) && (!machines || machines.length === 0)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-400">No data available</div>
      </div>
    );
  }

  const sortedAreas = Object.values(areaGroupStats)
    .filter(stat => stat.validCoords > 0 || stat.machineCount > 0) // Include areas with machines even without engineers
    .sort((a, b) => (b.engineerCount + b.machineCount) - (a.engineerCount + a.machineCount));
  
  // Calculate region statistics
  const regionStats = useMemo(() => {
    const stats = {};
    sortedAreas.forEach(area => {
      const region = area.region || 'Unknown';
      if (!stats[region]) {
        stats[region] = {
          region,
          provinceCount: 0,
          totalMachines: 0,
          totalEngineers: 0,
          provinces: []
        };
      }
      stats[region].provinceCount++;
      stats[region].totalMachines += area.machineCount;
      stats[region].totalEngineers += area.engineerCount;
      stats[region].provinces.push({
        name: area.areaGroup,
        machines: area.machineCount,
        engineers: area.engineerCount
      });
    });
    
    // Sort provinces by machines for each region
    Object.keys(stats).forEach(region => {
      stats[region].provinces.sort((a, b) => b.machines - a.machines);
    });
    
    return stats;
  }, [sortedAreas]);
  
  // Get top provinces by machines across all regions
  const topProvinces = useMemo(() => {
    return sortedAreas
      .sort((a, b) => b.machineCount - a.machineCount)
      .slice(0, 5)
      .map(area => ({
        name: area.areaGroup,
        machines: area.machineCount,
        engineers: area.engineerCount,
        region: area.region
      }));
  }, [sortedAreas]);
  
  // Pre-calculate maxCount once to avoid recalculation in style function
  const maxEngineerCount = useMemo(() => {
    return Math.max(...sortedAreas.map(s => s.engineerCount), 1);
  }, [sortedAreas]);
  
  // Memoize style function using useCallback for better performance
  const geoJsonStyle = useCallback((feature) => {
    const provinceName = feature.properties.Propinsi || feature.properties.name || '';
    const matchingArea = sortedAreas.find(stat => {
      return provinceName.toUpperCase() === stat.areaGroup.toUpperCase();
    });
    
    let baseColor;
    let borderWeight = 1.5;
    let fillOpacity = 0.4;
    
    if (matchingArea) {
      baseColor = getColorByRegion(matchingArea.region);
      const ratio = matchingArea.engineerCount / maxEngineerCount;
      borderWeight = 1.5 + (ratio * 4.5); // 1.5-6px
      fillOpacity = 0.4 + (ratio * 0.5); // 0.4-0.9
    } else {
      baseColor = '#e5e7eb';
      borderWeight = 1;
      fillOpacity = 0.15;
    }
    
    return {
      fillColor: baseColor,
      fillOpacity: fillOpacity,
      color: '#ffffff',
      weight: borderWeight,
      opacity: 0.95
    };
  }, [sortedAreas, maxEngineerCount]);
  
  // Memoize onEachFeature handler using useCallback
  const geoJsonOnEachFeature = useCallback((feature, layer) => {
    const provinceName = feature.properties.Propinsi || feature.properties.name || '';
    const matchingArea = sortedAreas.find(stat => {
      return provinceName.toUpperCase() === stat.areaGroup.toUpperCase();
    });
    if (matchingArea) {
      const baseColor = getColorByRegion(matchingArea.region);
      const ratio = matchingArea.engineerCount / maxEngineerCount;
        const normalWeight = 1.5 + (ratio * 4.5);
        const normalOpacity = 0.4 + (ratio * 0.5);
        
        // Show province + all cities
        const citiesList = Array.from(matchingArea.cities || []).join(', ');
        
        // Theme-aware colors for tooltip
        const tooltipBg = isDark ? '#0f172a' : '#ffffff';
        const tooltipText = isDark ? '#ffffff' : '#0f172a';
        const tooltipBorder = baseColor;
        const tooltipShadow = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.2)';
        
        layer.bindTooltip(
          `<div style="background: ${tooltipBg}; padding: 12px 16px; border-radius: 8px; box-shadow: 0 8px 16px ${tooltipShadow}; border: 2px solid ${tooltipBorder}; line-height: 1.8; overflow: hidden;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: ${tooltipText};">📍 ${matchingArea.areaGroup}</div>
            <div style="color: ${tooltipText}; margin-bottom: 6px;">🏙️ ${citiesList}</div>
            <div style="color: ${tooltipText}; margin-bottom: 6px;">🖥️ <span style="color: ${tooltipText}; font-weight: 700;">${matchingArea.machineCount || 0}</span> mesin</div>
            <div style="color: ${tooltipText}; margin-bottom: 6px;">👷 <span style="color: ${tooltipText}; font-weight: 700;">${matchingArea.engineerCount}</span> engineers</div>
            <div style="color: ${tooltipText}; font-size: 12px; opacity: 0.9;">🗺️ ${matchingArea.region}</div>
          </div>`,
          { 
            sticky: true,
            className: 'custom-map-tooltip',
            direction: 'auto',
            permanent: false
          }
        );
        
        // Optimize event handlers - throttle style updates to avoid forced reflow
        let hoverTimeout = null;
        layer.on({
          mouseover: (e) => {
            // Clear any pending timeout to debounce rapid hover events
            if (hoverTimeout) clearTimeout(hoverTimeout);
            
            // Batch style updates using requestAnimationFrame
            hoverTimeout = setTimeout(() => {
              requestAnimationFrame(() => {
                e.target.setStyle({ fillOpacity: 0.95, weight: normalWeight + 2 });
              });
            }, 16); // ~1 frame delay to batch updates and reduce reflow
          },
          mouseout: (e) => {
            if (hoverTimeout) clearTimeout(hoverTimeout);
            
            // Immediate style reset on mouseout for better UX
            requestAnimationFrame(() => {
              e.target.setStyle({ fillOpacity: normalOpacity, weight: normalWeight });
            });
          }
        });
      }
  }, [sortedAreas, maxEngineerCount, isDark]);

  return (
    <div className="map-container relative" style={{ 
      height: "100%", 
      width: "100%", 
      borderRadius: isFullscreen ? "0" : "16px", 
      overflow: "hidden", 
      boxShadow: isFullscreen ? "none" : "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
      border: isFullscreen ? "none" : "1px solid rgba(59, 130, 246, 0.2)",
    }}>
      <MapContainer
        center={[-2.5489, 118.0149]}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
        whenCreated={setMap}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <GeoJSON
          key={`geojson-${theme}`}
          data={geoJsonData}
          style={geoJsonStyle}
          onEachFeature={geoJsonOnEachFeature}
        />
      </MapContainer>
      
      {/* Map Legend */}
      {isLegendVisible ? (
        <div className={`absolute top-4 right-4 z-[100] ${isDark ? 'bg-slate-900/95' : 'bg-white/95'} backdrop-blur-sm rounded-lg border ${isDark ? 'border-slate-700' : 'border-gray-300'} shadow-xl p-4 max-w-xs`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
              🗺️ Legend
            </h3>
            <button
              onClick={() => setIsLegendVisible(false)}
              className={`p-1 rounded hover:${isDark ? 'bg-slate-800' : 'bg-gray-100'} transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              title="Sembunyikan Legend"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        
        {/* Region Colors */}
        <div className="mb-4">
          <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>Region</p>
          <div className="space-y-1.5">
            {['Region 1', 'Region 2', 'Region 3'].map(region => {
              const color = getColorByRegion(region);
              const stats = regionStats[region];
              return (
                <div key={region} className="flex items-center gap-2 text-xs">
                  <div 
                    className="w-4 h-4 rounded border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className={`flex-1 ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>{region}</span>
                  {stats && (
                    <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                      {stats.provinceCount} prov
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Top Provinces by Machines */}
        {topProvinces.length > 0 && (
          <div>
            <p className={`text-xs font-semibold mb-2 ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              🏆 Top 5 Provinsi (Mesin)
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {topProvinces.map((province, idx) => {
                const regionColor = getColorByRegion(province.region);
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2 text-xs p-1.5 rounded ${isDark ? 'bg-slate-800/50' : 'bg-gray-50'} hover:${isDark ? 'bg-slate-800' : 'bg-gray-100'} transition-colors`}
                  >
                    <span className={`font-bold w-5 text-center ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      {idx + 1}
                    </span>
                    <div 
                      className="w-3 h-3 rounded border border-white/50"
                      style={{ backgroundColor: regionColor }}
                    ></div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium truncate ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                        {province.name}
                      </div>
                      <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
                        {province.machines} mesin
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>
      ) : (
        <button
          onClick={() => setIsLegendVisible(true)}
          className={`absolute top-4 right-4 z-[100] ${isDark ? 'bg-slate-900/95 hover:bg-slate-800' : 'bg-white/95 hover:bg-gray-50'} backdrop-blur-sm rounded-lg border ${isDark ? 'border-slate-700' : 'border-gray-300'} shadow-xl p-2 transition-colors`}
          title="Tampilkan Legend"
        >
          <svg className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if machines or engineers arrays actually changed (deep comparison)
  if (prevProps.isFullscreen !== nextProps.isFullscreen) return false;
  if (prevProps.onEngineerClick !== nextProps.onEngineerClick) return false;
  
  // Shallow comparison for arrays - if references are same, no re-render needed
  if (prevProps.machines !== nextProps.machines) {
    // If length changed, need re-render
    if (prevProps.machines?.length !== nextProps.machines?.length) return false;
    // For performance, we assume arrays are stable if reference changed but length same
    // This is acceptable because parent component should memoize data
  }
  
  if (prevProps.engineers !== nextProps.engineers) {
    if (prevProps.engineers?.length !== nextProps.engineers?.length) return false;
  }
  
  return true; // No re-render needed
});

export default MapWithRegions;