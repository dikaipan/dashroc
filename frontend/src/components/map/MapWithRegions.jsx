import "leaflet/dist/leaflet.css";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON, Tooltip as LeafletTooltip, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import indonesiaGeoJSON_RAW_STRING from "../../data/peta_indonesia_geojson/indonesia-prov.geojson?raw";
import { useTheme } from "../../contexts/ThemeContext";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { useFSLLocationData } from "../../hooks/useEngineerData.js";
import MapLegend from "./MapLegend";
import {
  cityToProvince,
  areaPolygons,
  getColorByRegion,
  getAreaGroupColor,
  getColorWithDensity,
  createPolygonFromCenter,
  createPinIcon,
  createWarehouseIcon,
  createRepairCenterIcon,
  cityLocations,
  warehouseLocations
} from "../../utils/mapUtils";

const geoJsonData = JSON.parse(indonesiaGeoJSON_RAW_STRING);

// Helper function to calculate edge point for off-screen markers
// This function is used by OffScreenMarker component
const calculateEdgePoint = (map, lat, lng) => {
  if (!map) return null;
  
  const bounds = map.getBounds();
  const center = map.getCenter();
  
  // Check if point is outside bounds
  if (bounds.contains([lat, lng])) {
    return null; // Point is visible, no edge marker needed
  }
  
  // Get map container size
  const mapSize = map.getSize();
  const mapWidth = mapSize.x;
  const mapHeight = mapSize.y;
  
  // Convert center and marker to container points
  const centerPoint = map.latLngToContainerPoint(center);
  const markerPoint = map.latLngToContainerPoint([lat, lng]);
  
  // Calculate direction vector from center to marker
  const dx = markerPoint.x - centerPoint.x;
  const dy = markerPoint.y - centerPoint.y;
  
  // Calculate intersections with all edges
  const intersections = [];
  
  // Calculate slope (dy/dx)
  const slope = dx !== 0 ? dy / dx : Infinity;
  
  // Top edge (y = 0)
  if (dy < 0) {
    const x = dx !== 0 ? centerPoint.x + (0 - centerPoint.y) / slope : centerPoint.x;
    if (x >= 0 && x <= mapWidth) {
      intersections.push({ x, y: 0 });
    }
  }
  
  // Bottom edge (y = mapHeight)
  if (dy > 0) {
    const x = dx !== 0 ? centerPoint.x + (mapHeight - centerPoint.y) / slope : centerPoint.x;
    if (x >= 0 && x <= mapWidth) {
      intersections.push({ x, y: mapHeight });
    }
  }
  
  // Left edge (x = 0)
  if (dx < 0) {
    const y = slope !== Infinity ? centerPoint.y + (0 - centerPoint.x) * slope : centerPoint.y;
    if (y >= 0 && y <= mapHeight) {
      intersections.push({ x: 0, y });
    }
  }
  
  // Right edge (x = mapWidth)
  if (dx > 0) {
    const y = slope !== Infinity ? centerPoint.y + (mapWidth - centerPoint.x) * slope : centerPoint.y;
    if (y >= 0 && y <= mapHeight) {
      intersections.push({ x: mapWidth, y });
    }
  }
  
  // Find the closest intersection to the center
  if (intersections.length === 0) {
    // Fallback: use center point
    return center;
  }
  
  let closestIntersection = intersections[0];
  let minDistance = Math.sqrt(
    Math.pow(closestIntersection.x - centerPoint.x, 2) + 
    Math.pow(closestIntersection.y - centerPoint.y, 2)
  );
  
  for (let i = 1; i < intersections.length; i++) {
    const dist = Math.sqrt(
      Math.pow(intersections[i].x - centerPoint.x, 2) + 
      Math.pow(intersections[i].y - centerPoint.y, 2)
    );
    if (dist < minDistance) {
      minDistance = dist;
      closestIntersection = intersections[i];
    }
  }
  
  // Convert container point back to lat/lng
  return map.containerPointToLatLng([closestIntersection.x, closestIntersection.y]);
};

// Component to handle off-screen markers with lines
const OffScreenMarker = ({ position, icon, children, map, isDark, eventHandlers }) => {
  const [edgePoint, setEdgePoint] = useState(null);
  const [isOffScreen, setIsOffScreen] = useState(false);
  
  useEffect(() => {
    if (!map) return;
    
    const updateEdgePoint = () => {
      const bounds = map.getBounds();
      const isOutside = !bounds.contains(position);
      setIsOffScreen(isOutside);
      
      if (isOutside) {
        const edge = calculateEdgePoint(map, position[0], position[1]);
        setEdgePoint(edge);
      } else {
        setEdgePoint(null);
      }
    };
    
    updateEdgePoint();
    
    map.on('moveend', updateEdgePoint);
    map.on('zoomend', updateEdgePoint);
    map.on('resize', updateEdgePoint);
    
    return () => {
      map.off('moveend', updateEdgePoint);
      map.off('zoomend', updateEdgePoint);
      map.off('resize', updateEdgePoint);
    };
  }, [map, position]);
  
  if (!isOffScreen || !edgePoint) {
    // Marker is visible, render normally
    return (
      <Marker position={position} icon={icon} eventHandlers={eventHandlers}>
        {children}
      </Marker>
    );
  }
  
  // Marker is off-screen, show edge marker with line
  return (
    <>
      {/* Line from edge to actual position */}
      <Polyline
        positions={[edgePoint, position]}
        pathOptions={{
          color: isDark ? '#94a3b8' : '#64748b',
          weight: 2,
          opacity: 0.6,
          dashArray: '5, 5'
        }}
      />
      {/* Edge marker */}
      <Marker position={edgePoint} icon={icon} eventHandlers={eventHandlers}>
        {children}
      </Marker>
    </>
  );
};

// Memoize component to prevent unnecessary re-renders
const MapWithRegions = React.memo(function MapWithRegions({ machines, engineers = [], onEngineerClick, isFullscreen = false }) {
  const [map, setMap] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isLegendVisible, setIsLegendVisible] = useState(false); // Hide legend by default
  const [showMarkers, setShowMarkers] = useState(false); // Hide markers by default
  const [selectedProvince, setSelectedProvince] = useState(null); // Selected province for modal
  const [isProvinceModalFullscreen, setIsProvinceModalFullscreen] = useState(false); // Fullscreen mode for province modal
  const { theme, isDark } = useTheme();
  
  // Fetch FSL locations data
  const { rows: fslLocations, loading: fslLoading } = useFSLLocationData();

  // Convert FSL data to warehouse locations
  const warehouseLocationsFromFSL = useMemo(() => {
    if (!fslLocations || fslLocations.length === 0) {
      return [];
    }

    return fslLocations
      .filter(fsl => {
        // Only include Active FSL
        const status = fsl['Status'] || fsl.status || '';
        return status.toLowerCase() === 'active';
      })
      .map(fsl => {
        // Get FSL Name and City
        const fslName = fsl['FSL Name'] || fsl.fsl_name || fsl.fslname || '';
        const fslCity = fsl['FSL City'] || fsl.fsl_city || fsl.fslcity || '';
        
        // Find coordinates from cityLocations
        const cityData = cityLocations.find(city => 
          city.name.toLowerCase() === fslCity.toLowerCase() ||
          city.name.toLowerCase().includes(fslCity.toLowerCase()) ||
          fslCity.toLowerCase().includes(city.name.toLowerCase())
        );
        
        // Use coordinates from cityLocations if found, otherwise try to match by name
        const coords = cityData 
          ? cityData.coords 
          : (cityLocations.find(c => c.name.toLowerCase() === fslCity.toLowerCase())?.coords || null);
        
        // If still no coords, use default Jakarta
        const finalCoords = coords || [-6.2088, 106.8456];
        const timezone = cityData?.timezone || '+7';
        
        return {
          name: fslName,
          coords: finalCoords,
          timezone: timezone,
          city: fslCity,
          fslId: fsl['FSL ID'] || fsl.fsl_id || fsl.fslid || '',
          address: fsl['FSL Address'] || fsl.fsl_address || '',
          region: fsl['Region '] || fsl.region || ''
        };
      })
      .filter(warehouse => warehouse.coords !== null); // Remove warehouses without valid coordinates
  }, [fslLocations]);

  // Calculate unique area groups from data_ce.csv (engineers data only)
  const uniqueAreaGroups = useMemo(() => {
    const areaGroupsSet = new Set();
    
    // Only use area_group from engineers (data_ce.csv)
    (engineers || []).forEach(engineer => {
      // Handle different possible field names and types
      const areaGroup = engineer.area_group || engineer.areaGroup || engineer['area_group'];
      
      // Convert to string and normalize - preserve original case and spacing
      if (areaGroup != null && areaGroup !== undefined) {
        const normalized = String(areaGroup).trim();
        // Include all non-empty values, including 'Unknown' if it exists
        if (normalized !== '' && normalized.toLowerCase() !== 'null' && normalized.toLowerCase() !== 'undefined') {
          areaGroupsSet.add(normalized);
        }
      }
    });
    
    // Removed console.log to prevent infinite re-renders
    // If debugging is needed, use React DevTools Profiler instead
    
    return areaGroupsSet.size;
  }, [engineers]);

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
        
        // Use requestIdleCallback if available, otherwise use single RAF to reduce handler work
        if (window.requestIdleCallback) {
          window.requestIdleCallback(updateBounds, { timeout: 500 });
        } else {
          // Use single RAF with setTimeout to defer heavy work outside RAF handler
          requestAnimationFrame(() => {
            setTimeout(updateBounds, 0);
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
        <div className={isDark ? "text-slate-400" : "text-gray-600"}>No data available</div>
      </div>
    );
  }

  const sortedAreas = Object.values(areaGroupStats)
    .filter(stat => stat.validCoords > 0 || stat.machineCount > 0) // Include areas with machines even without engineers
    .sort((a, b) => (b.engineerCount + b.machineCount) - (a.engineerCount + a.machineCount));
  
  // Calculate region statistics
  const regionStats = useMemo(() => {
    const stats = {};
    
    // Count area groups per region (not provinces)
    const areaGroupCountByRegion = {};
    (engineers || []).forEach(engineer => {
      const areaGroup = engineer.area_group || 'Unknown';
      const region = engineer.region || 'Unknown';
      if (!areaGroupCountByRegion[region]) {
        areaGroupCountByRegion[region] = new Set();
      }
      areaGroupCountByRegion[region].add(areaGroup);
    });
    
    sortedAreas.forEach(area => {
      const region = area.region || 'Unknown';
      if (!stats[region]) {
        stats[region] = {
          region,
          provinceCount: 0,
          areaGroupCount: areaGroupCountByRegion[region]?.size || 0,
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
  }, [sortedAreas, engineers]);
  
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

  // Calculate area group details for selected province
  const provinceAreaGroupDetails = useMemo(() => {
    if (!selectedProvince) return [];
    
    const provinceName = selectedProvince;
    const details = {};
    
    // Group engineers by area_group
    (engineers || []).forEach(engineer => {
      const areaGroup = engineer.area_group || 'Unknown';
      const mappedProvince = cityToProvince[areaGroup] || areaGroup;
      
      if (mappedProvince.toUpperCase() === provinceName.toUpperCase()) {
        if (!details[areaGroup]) {
          details[areaGroup] = {
            areaGroup,
            engineers: [],
            machineCount: 0,
            region: engineer.region || 'Unknown'
          };
        }
        details[areaGroup].engineers.push(engineer);
      }
    });
    
    // Count machines per area_group
    (machines || []).forEach(machine => {
      const areaGroup = machine.area_group || 'Unknown';
      const mappedProvince = cityToProvince[areaGroup] || areaGroup;
      
      if (mappedProvince.toUpperCase() === provinceName.toUpperCase()) {
        if (!details[areaGroup]) {
          details[areaGroup] = {
            areaGroup,
            engineers: [],
            machineCount: 0,
            region: 'Unknown'
          };
        }
        details[areaGroup].machineCount++;
      }
    });
    
    return Object.values(details).sort((a, b) => b.machineCount - a.machineCount);
  }, [selectedProvince, engineers, machines]);

  // Helper function to get city statistics
  const getCityStats = useCallback((cityName) => {
    const normalizedCityName = cityName.trim();
    let engineerCount = 0;
    let machineCount = 0;
    const areaGroups = new Set();
    const regions = new Set();

    // Count engineers in this city/area
    (engineers || []).forEach(engineer => {
      const engineerAreaGroup = (engineer.area_group || '').trim();
      if (engineerAreaGroup && (
        engineerAreaGroup.toLowerCase() === normalizedCityName.toLowerCase() ||
        engineerAreaGroup.toLowerCase().includes(normalizedCityName.toLowerCase()) ||
        normalizedCityName.toLowerCase().includes(engineerAreaGroup.toLowerCase())
      )) {
        engineerCount++;
        if (engineerAreaGroup) areaGroups.add(engineerAreaGroup);
        if (engineer.region) regions.add(engineer.region);
      }
    });

    // Count machines in this city/area
    (machines || []).forEach(machine => {
      const machineAreaGroup = (machine.area_group || '').trim();
      if (machineAreaGroup && (
        machineAreaGroup.toLowerCase() === normalizedCityName.toLowerCase() ||
        machineAreaGroup.toLowerCase().includes(normalizedCityName.toLowerCase()) ||
        normalizedCityName.toLowerCase().includes(machineAreaGroup.toLowerCase())
      )) {
        machineCount++;
        if (machineAreaGroup) areaGroups.add(machineAreaGroup);
        if (machine.region) regions.add(machine.region);
      }
    });

    return {
      engineerCount,
      machineCount,
      areaGroups: Array.from(areaGroups),
      regions: Array.from(regions),
      ratio: engineerCount > 0 ? (machineCount / engineerCount).toFixed(1) : machineCount > 0 ? '∞' : '0'
    };
  }, [engineers, machines]);

  // Calculate province summary statistics
  const provinceSummary = useMemo(() => {
    if (!selectedProvince || provinceAreaGroupDetails.length === 0) {
      return { totalAreaGroups: 0, totalMachines: 0, totalEngineers: 0, region: 'Unknown' };
    }
    
    const totalMachines = provinceAreaGroupDetails.reduce((sum, detail) => sum + detail.machineCount, 0);
    const totalEngineers = provinceAreaGroupDetails.reduce((sum, detail) => sum + detail.engineers.length, 0);
    const region = provinceAreaGroupDetails[0]?.region || 'Unknown';
    
    return {
      totalAreaGroups: provinceAreaGroupDetails.length,
      totalMachines,
      totalEngineers,
      region
    };
  }, [selectedProvince, provinceAreaGroupDetails]);

  // Prepare pie chart data for area group distribution
  const pieChartData = useMemo(() => {
    return provinceAreaGroupDetails.map((detail, idx) => {
      // Setiap area group dapat warna unik
      const areaGroupColor = getAreaGroupColor(idx);
      const regionColor = getColorByRegion(detail.region);
      return {
        name: detail.areaGroup,
        value: detail.machineCount,
        engineers: detail.engineers.length,
        region: detail.region,
        color: areaGroupColor, // Warna unik per area group
        regionColor: regionColor, // Warna region untuk badge
        fullData: detail
      };
    });
  }, [provinceAreaGroupDetails]);

  // State for expanded area groups
  const [expandedAreaGroups, setExpandedAreaGroups] = useState(new Set());

  // Reset expanded area groups when province changes
  useEffect(() => {
    setExpandedAreaGroups(new Set());
  }, [selectedProvince]);

  const toggleAreaGroup = useCallback((areaGroup) => {
    setExpandedAreaGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(areaGroup)) {
        newSet.delete(areaGroup);
      } else {
        newSet.add(areaGroup);
      }
      return newSet;
    });
  }, []);

  // Handle province click
  const handleProvinceClick = useCallback((provinceName) => {
    setSelectedProvince(provinceName);
    setIsProvinceModalFullscreen(false); // Reset fullscreen when opening new province
  }, []);

  // Export province data to CSV
  const handleExportProvinceData = useCallback(() => {
    if (!selectedProvince || provinceAreaGroupDetails.length === 0) return;

    // Prepare CSV data
    const csvRows = [];
    
    // Header
    csvRows.push(['Provinsi', selectedProvince]);
    csvRows.push(['Region', provinceSummary.region]);
    csvRows.push(['Total Area Groups', provinceSummary.totalAreaGroups]);
    csvRows.push(['Total Mesin', provinceSummary.totalMachines]);
    csvRows.push(['Total Engineers', provinceSummary.totalEngineers]);
    csvRows.push([]); // Empty row
    
    // Area Group headers
    csvRows.push(['No', 'Area Group', 'Region', 'Mesin', 'Engineers', 'Rasio']);
    
    // Area Group data
    provinceAreaGroupDetails.forEach((detail, idx) => {
      const ratio = detail.engineers.length > 0 
        ? Math.round(detail.machineCount / detail.engineers.length).toString()
        : detail.machineCount > 0 ? '∞' : '0';
      
      csvRows.push([
        idx + 1,
        detail.areaGroup,
        detail.region,
        detail.machineCount,
        detail.engineers.length,
        ratio
      ]);
    });
    
    csvRows.push([]); // Empty row
    csvRows.push(['TOTAL', '', '', provinceSummary.totalMachines, provinceSummary.totalEngineers, 
      provinceSummary.totalEngineers > 0 
        ? Math.round(provinceSummary.totalMachines / provinceSummary.totalEngineers).toString()
        : '0'
    ]);
    
    csvRows.push([]); // Empty row
    csvRows.push(['DETAIL ENGINEERS PER AREA GROUP']);
    csvRows.push([]);
    
    // Engineers detail
    provinceAreaGroupDetails.forEach((detail, idx) => {
      csvRows.push([`Area Group ${idx + 1}: ${detail.areaGroup}`]);
      csvRows.push(['No', 'Nama Engineer', 'Region']);
      
      if (detail.engineers.length > 0) {
        detail.engineers.forEach((engineer, engIdx) => {
          csvRows.push([
            engIdx + 1,
            engineer.name || engineer.engineer_name || 'Unknown Engineer',
            engineer.region || 'Unknown'
          ]);
        });
      } else {
        csvRows.push(['-', 'Tidak ada engineers', '-']);
      }
      
      csvRows.push([]); // Empty row between area groups
    });
    
    // Convert to CSV string
    const csvContent = csvRows.map(row => 
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma or newline
        const cellStr = String(cell || '');
        if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(',')
    ).join('\n');
    
    // Create blob and download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedProvince.replace(/\s+/g, '_')}_Detail_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedProvince, provinceAreaGroupDetails, provinceSummary]);
  
  // Memoize style function using useCallback for better performance
  const geoJsonStyle = useCallback((feature) => {
    const provinceName = feature.properties.Propinsi || feature.properties.name || '';
    // Normalize province name: remove spaces, dots, and special chars for better matching
    const normalizeProvinceName = (name) => {
      return name.toUpperCase()
        .replace(/\s+/g, '') // Remove all spaces
        .replace(/\./g, '')  // Remove dots
        .replace(/DI\./g, 'DI') // Handle DI. ACEH
        .replace(/DAERAHISTIMEWA/g, 'DI'); // Handle DAERAH ISTIMEWA
    };
    
    const matchingArea = sortedAreas.find(stat => {
      return normalizeProvinceName(provinceName) === normalizeProvinceName(stat.areaGroup);
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
    // Normalize province name: remove spaces, dots, and special chars for better matching
    const normalizeProvinceName = (name) => {
      return name.toUpperCase()
        .replace(/\s+/g, '') // Remove all spaces
        .replace(/\./g, '')  // Remove dots
        .replace(/DI\./g, 'DI') // Handle DI. ACEH
        .replace(/DAERAHISTIMEWA/g, 'DI'); // Handle DAERAH ISTIMEWA
    };
    
    const matchingArea = sortedAreas.find(stat => {
      return normalizeProvinceName(provinceName) === normalizeProvinceName(stat.areaGroup);
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
            <div style="color: ${tooltipText}; font-size: 12px; opacity: 0.9; margin-bottom: 6px;">🗺️ ${matchingArea.region}</div>
            <div style="color: ${tooltipText}; font-size: 11px; opacity: 0.7; margin-top: 8px; padding-top: 8px; border-top: 1px solid ${tooltipBorder}40;">👆 Klik untuk detail area group</div>
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
          click: () => {
            handleProvinceClick(matchingArea.areaGroup);
          },
          mouseover: (e) => {
            // Change cursor to pointer
            if (map) {
              map.getContainer().style.cursor = 'pointer';
            }
            
            // Clear any pending timeout to debounce rapid hover events
            if (hoverTimeout) clearTimeout(hoverTimeout);
            
            // Batch style updates using setTimeout to avoid heavy RAF handler
            hoverTimeout = setTimeout(() => {
              e.target.setStyle({ fillOpacity: 0.95, weight: normalWeight + 2 });
            }, 16); // ~1 frame delay to batch updates and reduce reflow
          },
          mouseout: (e) => {
            // Reset cursor
            if (map) {
              map.getContainer().style.cursor = '';
            }
            
            if (hoverTimeout) clearTimeout(hoverTimeout);
            
            // Immediate style reset on mouseout for better UX
            // Use setTimeout(0) instead of RAF to avoid heavy handler
            setTimeout(() => {
              e.target.setStyle({ fillOpacity: normalOpacity, weight: normalWeight });
            }, 0);
          }
        });
      } else {
        // Provinsi tanpa data engineer - tampilkan tooltip dengan format yang sama
        const baseColor = isDark ? '#64748b' : '#94a3b8'; // slate-500 / slate-400
        const tooltipBg = isDark ? '#0f172a' : '#ffffff';
        const tooltipText = isDark ? '#ffffff' : '#0f172a';
        const tooltipBorder = baseColor;
        const tooltipShadow = isDark ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.2)';
        
        layer.bindTooltip(
          `<div style="background: ${tooltipBg}; padding: 12px 16px; border-radius: 8px; box-shadow: 0 8px 16px ${tooltipShadow}; border: 2px solid ${tooltipBorder}; line-height: 1.8; overflow: hidden;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: ${tooltipText};">📍 ${provinceName}</div>
            <div style="color: ${tooltipText}; margin-bottom: 6px; opacity: 0.7;">🏙️ -</div>
            <div style="color: ${tooltipText}; margin-bottom: 6px;">🖥️ <span style="color: ${tooltipText}; font-weight: 700;">0</span> mesin</div>
            <div style="color: ${tooltipText}; margin-bottom: 6px;">👷 <span style="color: ${tooltipText}; font-weight: 700;">0</span> engineers</div>
            <div style="color: ${tooltipText}; font-size: 12px; opacity: 0.9; margin-bottom: 6px;">🗺️ -</div>
            <div style="color: ${tooltipText}; font-size: 11px; opacity: 0.5; margin-top: 8px; padding-top: 8px; border-top: 1px solid ${tooltipBorder}40;">ℹ️ Belum ada data untuk provinsi ini</div>
          </div>`,
          { 
            sticky: true,
            className: 'custom-map-tooltip',
            direction: 'auto',
            permanent: false
          }
        );
        
        // Add hover effect untuk provinsi tanpa data
        layer.on({
          mouseover: (e) => {
            if (map) {
              map.getContainer().style.cursor = 'help';
            }
            e.target.setStyle({ 
              fillOpacity: 0.5, 
              weight: 2.5 
            });
          },
          mouseout: (e) => {
            if (map) {
              map.getContainer().style.cursor = '';
            }
            e.target.setStyle({ 
              fillOpacity: 0.3, 
              weight: 1.5 
            });
          }
        });
      }
  }, [sortedAreas, maxEngineerCount, isDark, map, handleProvinceClick]);

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
        
        {/* City Markers - Pin (excluding repair centers) */}
        {showMarkers && cityLocations.filter(city => !city.repairCenter).map((city, idx) => {
          const icon = createPinIcon(L);
          return (
            <OffScreenMarker
              key={`city-${idx}`}
              position={city.coords}
              icon={icon}
              map={map}
              isDark={isDark}
              eventHandlers={{
                mouseover: (e) => {
                  const marker = e.target;
                  const iconElement = marker.getElement();
                  if (iconElement) {
                    const pinDiv = iconElement.querySelector('.marker-pin');
                    if (pinDiv) {
                      pinDiv.style.transform = 'scale(1.4) translateY(-2px)';
                      pinDiv.style.filter = 'drop-shadow(0 6px 12px rgba(59, 130, 246, 0.6))';
                      pinDiv.style.zIndex = '1000';
                    }
                  }
                },
                mouseout: (e) => {
                  const marker = e.target;
                  const iconElement = marker.getElement();
                  if (iconElement) {
                    const pinDiv = iconElement.querySelector('.marker-pin');
                    if (pinDiv) {
                      pinDiv.style.transform = 'scale(1) translateY(0)';
                      pinDiv.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
                      pinDiv.style.zIndex = 'auto';
                    }
                  }
                }
              }}
            >
              <LeafletTooltip 
                permanent={false}
                direction="top"
                offset={[0, -10]}
                className="custom-marker-tooltip"
              >
                <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} px-2 py-1 rounded shadow-lg border ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
                  <span className={`${isDark ? 'text-slate-100' : 'text-gray-900'} text-sm font-semibold`}>
                    {city.name}
                  </span>
                </div>
              </LeafletTooltip>
              <Popup className="custom-popup">
                <div className={`${isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-white to-gray-50'} rounded-lg p-4 pr-10 shadow-2xl min-w-[140px] border ${isDark ? 'border-slate-700' : 'border-gray-200'}`}>
                  <div className={`${isDark ? 'text-slate-100' : 'text-gray-900'} text-base font-bold`}>
                    {city.name}
                  </div>
                </div>
              </Popup>
            </OffScreenMarker>
          );
        })}
        
        {/* Warehouse Markers - From FSL Data */}
        {showMarkers && warehouseLocationsFromFSL.map((warehouse, idx) => {
          // Skip warehouses that are in repair center cities (Jakarta, Surabaya, Makassar)
          const cityName = warehouse.city || warehouse.name.replace(' Warehouse', '').replace('FSL ', '');
          const isRepairCenterCity = cityLocations.some(city => 
            city.name.toLowerCase() === cityName.toLowerCase() && city.repairCenter === true
          );
          if (isRepairCenterCity) return null;
          
          return (
            <OffScreenMarker
              key={`warehouse-${idx}`}
              position={warehouse.coords}
              icon={createWarehouseIcon(L)}
              map={map}
              isDark={isDark}
              eventHandlers={{
                mouseover: (e) => {
                  const marker = e.target;
                  const iconElement = marker.getElement();
                  if (iconElement) {
                    const warehouseDiv = iconElement.querySelector('.marker-warehouse');
                    if (warehouseDiv) {
                      warehouseDiv.style.transform = 'scale(1.4)';
                      warehouseDiv.style.boxShadow = '0 4px 12px rgba(251, 191, 36, 0.6)';
                      warehouseDiv.style.border = '3px solid #ffffff';
                      warehouseDiv.style.zIndex = '1000';
                    }
                  }
                },
                mouseout: (e) => {
                  const marker = e.target;
                  const iconElement = marker.getElement();
                  if (iconElement) {
                    const warehouseDiv = iconElement.querySelector('.marker-warehouse');
                    if (warehouseDiv) {
                      warehouseDiv.style.transform = 'scale(1)';
                      warehouseDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
                      warehouseDiv.style.border = '2px solid #ffffff';
                      warehouseDiv.style.zIndex = 'auto';
                    }
                  }
                }
              }}
            >
              <LeafletTooltip 
                permanent={false}
                direction="top"
                offset={[0, -12]}
                className="custom-marker-tooltip"
              >
                <div className={`${isDark ? 'bg-amber-900/90' : 'bg-amber-50'} px-2 py-1 rounded shadow-lg border ${isDark ? 'border-amber-700' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">📦</span>
                    <span className={`${isDark ? 'text-amber-100' : 'text-amber-900'} text-sm font-semibold`}>
                      {warehouse.name.replace('FSL ', '')}
                    </span>
                  </div>
                </div>
              </LeafletTooltip>
              <Popup className="custom-popup">
                <div className={`${isDark ? 'bg-gradient-to-br from-amber-900/95 to-yellow-900/95' : 'bg-gradient-to-br from-amber-50 to-yellow-50'} rounded-lg p-4 pr-10 shadow-2xl min-w-[200px] border-2 ${isDark ? 'border-amber-500/50' : 'border-amber-300'}`}>
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xl">📦</span>
                    <div className={`${isDark ? 'text-amber-100' : 'text-amber-900'} text-base font-bold`}>
                      {warehouse.name}
                    </div>
                  </div>
                  {warehouse.city && (
                    <div className={`${isDark ? 'text-amber-200' : 'text-amber-800'} text-sm font-medium`}>
                      {warehouse.city}
                    </div>
                  )}
                  {warehouse.address && (
                    <div className={`${isDark ? 'text-amber-300' : 'text-amber-700'} text-xs mt-1`}>
                      {warehouse.address}
                    </div>
                  )}
                </div>
              </Popup>
            </OffScreenMarker>
          );
        })}
        
        {/* Repair Center Markers - Jakarta, Surabaya, Makassar */}
        {showMarkers && cityLocations.filter(city => city.repairCenter === true).map((city, idx) => (
          <OffScreenMarker
            key={`repair-center-${idx}`}
            position={city.coords}
            icon={createRepairCenterIcon(L)}
            map={map}
            isDark={isDark}
            eventHandlers={{
              mouseover: (e) => {
                const marker = e.target;
                const iconElement = marker.getElement();
                if (iconElement) {
                  const repairDiv = iconElement.querySelector('.marker-repair-center');
                  if (repairDiv) {
                    repairDiv.style.transform = 'scale(1.5)';
                    repairDiv.style.boxShadow = '0 6px 16px rgba(251, 191, 36, 0.8)';
                    repairDiv.style.border = '4px solid #ffffff';
                    repairDiv.style.zIndex = '1000';
                  }
                }
              },
              mouseout: (e) => {
                const marker = e.target;
                const iconElement = marker.getElement();
                if (iconElement) {
                  const repairDiv = iconElement.querySelector('.marker-repair-center');
                  if (repairDiv) {
                    repairDiv.style.transform = 'scale(1)';
                    repairDiv.style.boxShadow = '0 3px 6px rgba(0,0,0,0.4)';
                    repairDiv.style.border = '3px solid #ffffff';
                    repairDiv.style.zIndex = 'auto';
                  }
                }
              }
            }}
          >
            <LeafletTooltip 
              permanent={false}
              direction="top"
              offset={[0, -14]}
              className="custom-marker-tooltip"
            >
              <div className={`${isDark ? 'bg-amber-900/95' : 'bg-amber-100'} px-3 py-1.5 rounded-lg shadow-xl border-2 ${isDark ? 'border-amber-500' : 'border-amber-400'}`}>
                <div className="flex items-center gap-2">
                  <span className="text-base">🔧</span>
                  <span className={`${isDark ? 'text-amber-100' : 'text-amber-900'} text-sm font-bold`}>
                    Repair Center - {city.name}
                  </span>
                </div>
              </div>
            </LeafletTooltip>
            <Popup className="custom-popup">
              <div className={`${isDark ? 'bg-gradient-to-br from-amber-900/95 to-yellow-900/95' : 'bg-gradient-to-br from-amber-50 to-yellow-50'} rounded-lg p-4 pr-10 shadow-2xl border-2 ${isDark ? 'border-amber-500/50' : 'border-amber-300'} min-w-[200px]`}>
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🔧</span>
                  <div>
                    <div className={`${isDark ? 'text-amber-100' : 'text-amber-900'} text-base font-bold`}>
                      Repair Center
                    </div>
                    <div className={`${isDark ? 'text-amber-200' : 'text-amber-800'} text-sm font-medium mt-0.5`}>
                      {city.name}
                    </div>
                  </div>
                </div>
              </div>
              </Popup>
          </OffScreenMarker>
        ))}
      </MapContainer>
      
      {/* Toggle Button for Markers and Legend - Positioned at top-left */}
      <div className={`absolute top-2 left-2 sm:top-4 sm:left-4 z-[100] flex gap-2`}>
        <button
          onClick={() => setShowMarkers(!showMarkers)}
          className={`${isDark ? 'bg-slate-900/95 hover:bg-slate-800' : 'bg-white/95 hover:bg-gray-50'} backdrop-blur-sm rounded-lg border ${isDark ? 'border-slate-700' : 'border-gray-300'} shadow-xl p-2 transition-colors`}
          title={showMarkers ? "Sembunyikan Marker" : "Tampilkan Marker"}
        >
          {showMarkers ? (
            <svg className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ) : (
            <svg className={`w-5 h-5 ${isDark ? 'text-slate-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0L3 3m3.59 3.59L3 3" />
            </svg>
          )}
        </button>
        <button
          onClick={() => setIsLegendVisible(!isLegendVisible)}
          className={`${isDark ? 'bg-slate-900/95 hover:bg-slate-800' : 'bg-white/95 hover:bg-gray-50'} backdrop-blur-sm rounded-lg border ${isDark ? 'border-slate-700' : 'border-gray-300'} shadow-xl p-2 transition-colors`}
          title={isLegendVisible ? "Sembunyikan Legend" : "Tampilkan Legend"}
        >
          <svg className={`w-5 h-5 ${isDark ? 'text-slate-300' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Map Legend - Bottom Position with Full Marker Legend */}
      <MapLegend
        isLegendVisible={isLegendVisible}
        setIsLegendVisible={setIsLegendVisible}
        regionStats={regionStats}
        topProvinces={topProvinces}
        uniqueAreaGroups={uniqueAreaGroups}
        warehouseLocationsFromFSL={warehouseLocationsFromFSL}
        cityLocations={cityLocations}
        engineers={engineers}
        machines={machines}
      />

      {/* Province Detail Modal */}
      {selectedProvince && (
        <div 
          className={`fixed inset-0 z-[1000] ${isProvinceModalFullscreen ? '' : 'flex items-center justify-center p-4'} backdrop-blur-sm ${
            isDark ? 'bg-black/70' : 'bg-black/50'
          }`}
          onClick={() => {
            if (!isProvinceModalFullscreen) {
              setSelectedProvince(null);
            }
          }}
        >
          <div 
            className={`relative ${isProvinceModalFullscreen ? 'w-full h-full' : 'w-full max-w-4xl max-h-[90vh]'} overflow-hidden ${isProvinceModalFullscreen ? 'rounded-none' : 'rounded-2xl'} ${isProvinceModalFullscreen ? '' : 'shadow-2xl'} ${
              isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Gradient */}
            <div className={`relative p-6 border-b ${
              isDark ? 'border-slate-700 bg-gradient-to-r from-blue-600/20 to-purple-600/20' : 'border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      isDark ? 'bg-blue-600/30' : 'bg-blue-100'
                    }`}>
                      <svg className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {selectedProvince}
                      </h2>
                      {provinceSummary.region !== 'Unknown' && (
                        <div className={`flex items-center gap-2 mt-1 ${
                          isDark ? 'text-slate-300' : 'text-gray-600'
                        }`}>
                          <span className="text-xs">🗺️</span>
                          <span className="text-sm font-medium">{provinceSummary.region}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Export Button */}
                  <button
                    onClick={handleExportProvinceData}
                    className={`p-2 rounded-lg transition-all font-medium ${
                      isDark 
                        ? 'text-slate-300 hover:text-green-300 hover:bg-green-500/20' 
                        : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
                    }`}
                    title="Export Data ke CSV"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </button>
                  
                  {/* Fullscreen Toggle Button */}
                  <button
                    onClick={() => setIsProvinceModalFullscreen(!isProvinceModalFullscreen)}
                    className={`p-2 rounded-lg transition-all font-medium ${
                      isDark 
                        ? 'text-slate-300 hover:text-blue-300 hover:bg-blue-500/20' 
                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                    title={isProvinceModalFullscreen ? "Keluar dari Fullscreen" : "Fullscreen"}
                  >
                    {isProvinceModalFullscreen ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    )}
                  </button>
                  
                  {/* Close Button */}
                  <button
                    onClick={() => {
                      setSelectedProvince(null);
                      setIsProvinceModalFullscreen(false);
                    }}
                    className={`p-2 rounded-lg transition-all font-medium ${
                      isDark 
                        ? 'text-slate-300 hover:text-red-300 hover:bg-red-500/20' 
                        : 'text-gray-600 hover:text-red-700 hover:bg-red-50'
                    }`}
                    title="Tutup"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Summary Cards */}
              {provinceSummary.totalAreaGroups > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className={`p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600' 
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <div className={`text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Area Groups
                    </div>
                    <div className={`text-2xl font-bold ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {provinceSummary.totalAreaGroups}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600' 
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <div className={`text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Total Mesin
                    </div>
                    <div className={`text-2xl font-bold ${
                      isDark ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {provinceSummary.totalMachines.toLocaleString()}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg border ${
                    isDark 
                      ? 'bg-slate-700/50 border-slate-600' 
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <div className={`text-xs font-medium mb-1 ${
                      isDark ? 'text-slate-400' : 'text-gray-500'
                    }`}>
                      Total Engineers
                    </div>
                    <div className={`text-2xl font-bold ${
                      isDark ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {provinceSummary.totalEngineers.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className={`overflow-y-auto ${isProvinceModalFullscreen ? 'h-[calc(100vh-280px)]' : 'max-h-[calc(90vh-280px)]'} p-6`}>
              {provinceAreaGroupDetails.length > 0 ? (
                <div className="space-y-6">
                  {/* Pie Chart Section */}
                  <div className={`p-4 rounded-xl border ${
                    isDark ? 'bg-slate-700/30 border-slate-600' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <h3 className={`text-lg font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      🥧 Distribusi Area Group di {selectedProvince}
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Pie Chart */}
                      <div style={{ width: '100%', height: '350px', minHeight: '350px', minWidth: '100px', position: 'relative' }}>
                        <ResponsiveContainer width="100%" height={350} minHeight={350} minWidth={100}>
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={70}
                              outerRadius={110}
                              labelLine={{ 
                                stroke: isDark ? '#cbd5e1' : '#475569',
                                strokeWidth: 1.5
                              }}
                              label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                const RADIAN = Math.PI / 180;
                                // Position label outside the pie chart
                                const radius = outerRadius + 25;
                                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                const shortName = name.length > 15 ? name.substring(0, 15) + '...' : name;
                                
                                return (
                                  <text 
                                    x={x} 
                                    y={y} 
                                    fill={isDark ? '#f1f5f9' : '#0f172a'} 
                                    textAnchor={x > cx ? 'start' : 'end'} 
                                    dominantBaseline="central"
                                    fontSize={14}
                                    fontWeight="700"
                                    style={{ 
                                      filter: isDark ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.8))' : 'drop-shadow(0 2px 4px rgba(255,255,255,0.8))'
                                    }}
                                  >
                                    {shortName}: {(percent * 100).toFixed(1)}%
                                  </text>
                                );
                              }}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={entry.color}
                                  stroke={isDark ? '#1e293b' : '#ffffff'}
                                  strokeWidth={2}
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                border: isDark ? '1px solid #475569' : '1px solid #e2e8f0',
                                borderRadius: '8px',
                                color: isDark ? '#f1f5f9' : '#0f172a',
                                boxShadow: isDark 
                                  ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' 
                                  : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                              }}
                              formatter={(value, name, props) => {
                                return [
                                  `${value.toLocaleString()} mesin`,
                                  `${props.payload.engineers} engineers`
                                ];
                              }}
                              labelStyle={{ 
                                color: isDark ? '#cbd5e1' : '#475569', 
                                fontWeight: 'bold',
                                fontSize: '13px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Legend */}
                      <div className="flex flex-col justify-center">
                        <h4 className={`text-sm font-semibold mb-3 ${
                          isDark ? 'text-slate-300' : 'text-gray-700'
                        }`}>
                          Detail Area Group:
                        </h4>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {pieChartData.map((item, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border ${
                                isDark ? 'bg-slate-600/30 border-slate-500' : 'bg-white border-gray-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded"
                                    style={{ backgroundColor: item.color }}
                                  ></div>
                                  <span className={`text-sm font-medium ${
                                    isDark ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    {item.name}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <div className={`text-xs font-semibold ${
                                    isDark ? 'text-green-400' : 'text-green-600'
                                  }`}>
                                    {item.value.toLocaleString()} mesin
                                  </div>
                                  <div className={`text-xs ${
                                    isDark ? 'text-blue-400' : 'text-blue-600'
                                  }`}>
                                    {item.engineers} engineers
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown per Area Group */}
                  <div>
                    <h3 className={`text-lg font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      📋 Breakdown Area Group & Anggota ({provinceAreaGroupDetails.length} Area Groups)
                    </h3>
                    <div className="space-y-3">
                      {provinceAreaGroupDetails.map((detail, idx) => {
                        const regionColor = getColorByRegion(detail.region);
                        const ratio = detail.engineers.length > 0 
                          ? Math.round(detail.machineCount / detail.engineers.length).toString()
                          : detail.machineCount > 0 ? '∞' : '0';
                        const isExpanded = expandedAreaGroups.has(detail.areaGroup);
                        
                        return (
                          <div
                            key={idx}
                            className={`rounded-lg border transition-all ${
                              isDark 
                                ? 'bg-slate-700/30 border-slate-600' 
                                : 'bg-white border-gray-200 shadow-sm'
                            }`}
                          >
                            {/* Area Group Header - Clickable */}
                            <button
                              onClick={() => toggleAreaGroup(detail.areaGroup)}
                              className={`group w-full p-4 text-left transition-colors ${
                                isDark 
                                  ? 'hover:bg-slate-600/50' 
                                  : 'hover:bg-gray-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${
                                    isDark ? 'bg-slate-600 text-slate-200' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {idx + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className={`text-base font-bold ${
                                        isDark ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        {detail.areaGroup}
                                      </h4>
                                      <span 
                                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                                        style={{ 
                                          backgroundColor: regionColor + '20',
                                          color: regionColor
                                        }}
                                      >
                                        {detail.region}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className={`font-semibold ${
                                        isDark ? 'text-green-400' : 'text-green-600'
                                      }`}>
                                        🖥️ {detail.machineCount.toLocaleString()} mesin
                                      </span>
                                      <span className={`font-semibold ${
                                        isDark ? 'text-blue-400' : 'text-blue-600'
                                      }`}>
                                        👷 {detail.engineers.length.toLocaleString()} engineers
                                      </span>
                                      <span className={`text-xs ${
                                        isDark ? 'text-slate-400' : 'text-gray-500'
                                      }`}>
                                        Rasio: {ratio}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <svg 
                                  className={`w-5 h-5 transition-all ${
                                    isDark 
                                      ? 'text-slate-300 group-hover:text-white' 
                                      : 'text-gray-600 group-hover:text-gray-900'
                                  } ${isExpanded ? 'transform rotate-180' : ''}`}
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                  strokeWidth={2.5}
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>
                            
                            {/* Expanded Content - Engineers List */}
                            {isExpanded && detail.engineers.length > 0 && (
                              <div className={`border-t ${
                                isDark ? 'border-slate-600 bg-slate-800/30' : 'border-gray-200 bg-gray-50'
                              }`}>
                                <div className="p-4">
                                  <h5 className={`text-sm font-semibold mb-3 ${
                                    isDark ? 'text-slate-300' : 'text-gray-700'
                                  }`}>
                                    👥 Daftar Engineers ({detail.engineers.length}):
                                  </h5>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                    {detail.engineers.map((engineer, engIdx) => {
                                      // Get vendors for this engineer
                                      const vendorSet = new Set();
                                      
                                      // First, try to get vendor directly from engineer
                                      if (engineer.vendor && engineer.vendor.trim() !== '') {
                                        vendorSet.add(engineer.vendor.trim());
                                      }
                                      
                                      // Then, try to get vendors from machines with same area_group
                                      const engineerAreaGroup = engineer.area_group || detail.areaGroup;
                                      (machines || []).forEach(machine => {
                                        const machineAreaGroup = machine.area_group || 'Unknown';
                                        // Match by area_group (case-insensitive)
                                        if (machineAreaGroup && engineerAreaGroup && 
                                            machineAreaGroup.toUpperCase().trim() === engineerAreaGroup.toUpperCase().trim() && 
                                            machine.vendor && machine.vendor.trim() !== '') {
                                          vendorSet.add(machine.vendor.trim());
                                        }
                                      });
                                      
                                      // If still no vendor, try matching by region
                                      if (vendorSet.size === 0 && engineer.region) {
                                        (machines || []).forEach(machine => {
                                          if (machine.region && engineer.region &&
                                              machine.region.toUpperCase().trim() === engineer.region.toUpperCase().trim() &&
                                              machine.vendor && machine.vendor.trim() !== '') {
                                            vendorSet.add(machine.vendor.trim());
                                          }
                                        });
                                      }
                                      
                                      const engineerVendors = Array.from(vendorSet).sort();
                                      
                                      const vendorText = engineerVendors.length > 0 
                                        ? (engineerVendors.length === 1 
                                            ? engineerVendors[0] 
                                            : `${engineerVendors[0]}${engineerVendors.length > 1 ? ` (+${engineerVendors.length - 1})` : ''}`)
                                        : '-';
                                      
                                      return (
                                        <div
                                          key={engIdx}
                                          className={`p-3 rounded-lg border transition-all hover:scale-[1.02] ${
                                            isDark 
                                              ? 'bg-slate-600/30 border-slate-500 hover:bg-slate-600/50' 
                                              : 'bg-white border-gray-200 hover:bg-gray-50'
                                          }`}
                                        >
                                          <div className="flex items-start gap-2">
                                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                                              isDark ? 'bg-blue-600/20' : 'bg-blue-100'
                                            }`}>
                                              <svg className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                              </svg>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <div className={`font-semibold text-sm truncate ${
                                                isDark ? 'text-slate-200' : 'text-gray-800'
                                              }`}>
                                                {engineer.name || engineer.engineer_name || 'Unknown Engineer'}
                                              </div>
                                              <div className={`text-xs mt-1 flex items-center gap-2 flex-wrap ${
                                                isDark ? 'text-slate-400' : 'text-gray-500'
                                              }`}>
                                                {engineer.region && (
                                                  <>
                                                    <span className="flex items-center gap-1">
                                                      <span>🗺️</span>
                                                      <span>{engineer.region}</span>
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                      <span>🏢</span>
                                                      <span className="truncate max-w-[100px]">{vendorText}</span>
                                                    </span>
                                                  </>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            {isExpanded && detail.engineers.length === 0 && (
                              <div className={`p-4 border-t text-center ${
                                isDark ? 'border-slate-600 text-slate-400' : 'border-gray-200 text-gray-500'
                              }`}>
                                Tidak ada engineers di area group ini
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`text-center py-12 ${
                  isDark ? 'text-slate-400' : 'text-gray-500'
                }`}>
                  <svg className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-lg font-medium">Tidak ada data untuk provinsi ini</p>
                  <p className="text-sm mt-2">Data akan muncul setelah service point ditambahkan</p>
                </div>
              )}
            </div>
          </div>
        </div>
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