// src/utils/mapUtils.js
// Map-related constants and utilities

// City to Province mapping - COMPLETE
export const cityToProvince = {
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
  'Singkawang': 'KALIMANTAN BARAT',
  
  // Kalimantan Tengah
  'Palangka Raya': 'KALIMANTAN TENGAH',
  'Palangkaraya': 'KALIMANTAN TENGAH', // Alias tanpa spasi
  'Sampit': 'KALIMANTAN TENGAH',
  'Pangkalan Bun': 'KALIMANTAN TENGAH',
  
  // Kalimantan Selatan
  'Banjarmasin': 'KALIMANTAN SELATAN',
  'Banjarbaru': 'KALIMANTAN SELATAN',
  
  // Kalimantan Timur
  'Balikpapan': 'KALIMANTAN TIMUR',
  'Samarinda': 'KALIMANTAN TIMUR',
  'Bontang': 'KALIMANTAN TIMUR',
  
  // Kalimantan Utara
  'Tarakan': 'KALIMANTAN UTARA',
  
  // Sulawesi Utara
  'Manado': 'SULAWESI UTARA',
  'Bitung': 'SULAWESI UTARA',
  'Tomohon': 'SULAWESI UTARA',
  
  // Sulawesi Tengah
  'Palu': 'SULAWESI TENGAH',
  'Donggala': 'SULAWESI TENGAH',
  
  // Sulawesi Selatan
  'Makassar': 'SULAWESI SELATAN',
  'Parepare': 'SULAWESI SELATAN',
  'Pare Pare': 'SULAWESI SELATAN',
  'Bulukumba': 'SULAWESI SELATAN',
  
  // Sulawesi Barat
  'Palopo': 'SULAWESI BARAT',
  
  // Sulawesi Tenggara
  'Kendari': 'SULAWESI TENGGARA',
  'Baubau': 'SULAWESI TENGGARA',
  
  // Gorontalo
  'Gorontalo': 'GORONTALO',
  
  // Sulawesi Barat
  'Majene': 'SULAWESI BARAT',
  'Mamuju': 'SULAWESI BARAT',
  
  // Maluku
  'Ambon': 'MALUKU',
  'Tual': 'MALUKU',
  
  // Maluku Utara
  'Ternate': 'MALUKU UTARA',
  'Tidore': 'MALUKU UTARA',
  
  // Papua Barat
  'Sorong': 'PAPUA BARAT',
  'Manokwari': 'PAPUA BARAT',
  
  // Papua
  'Jayapura': 'PAPUA',
  'Timika': 'PAPUA',
  'Merauke': 'PAPUA',
  'Biak': 'PAPUA',
  
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

// Area polygons for major cities
export const areaPolygons = {
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

// Region colors
export const regionColors = {
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

// Get color by region
export const getColorByRegion = (region) => {
  return regionColors[region] || '#94a3b8'; // Default gray
};

// Color palette untuk area groups
export const areaGroupColors = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#f59e0b', // Orange
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange-Red
  '#6366f1', // Indigo
  '#eab308', // Yellow
  '#06b6d4', // Cyan
];

// Get area group color by index
export const getAreaGroupColor = (index) => {
  return areaGroupColors[index % areaGroupColors.length];
};

// Get color with density (for map visualization)
export const getColorWithDensity = (region, engineerCount) => {
  const baseColor = getColorByRegion(region);
  // Adjust opacity based on engineer count
  const density = Math.min(engineerCount / 100, 1); // Normalize to 0-1
  return baseColor;
};

// Create polygon from center point
export const createPolygonFromCenter = (lat, lng, size = 0.3) => {
  return [
    [lat - size, lng - size],
    [lat - size, lng + size],
    [lat + size, lng + size],
    [lat + size, lng - size]
  ];
};

// Create pin icon for area groups
// Note: This function should be called with L (Leaflet) passed from the component
// or imported directly: import L from 'leaflet';
export const createPinIcon = (L) => {
  if (!L) {
    console.warn('createPinIcon: L (Leaflet) is required');
    return null;
  }
  return L.divIcon({
    className: 'custom-pin',
    html: `<div class="marker-pin" style="
      font-size: 16px;
      line-height: 1;
      text-align: center;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      transition: all 0.2s ease;
      cursor: pointer;
    ">📍</div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -16]
  });
};

// Create warehouse icon
export const createWarehouseIcon = (L) => {
  if (!L) {
    console.warn('createWarehouseIcon: L (Leaflet) is required');
    return null;
  }
  return L.divIcon({
    className: 'custom-warehouse-icon',
    html: `<div class="marker-warehouse" style="
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      border: 2px solid #ffffff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      transition: all 0.2s ease;
      cursor: pointer;
    ">📦</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

// Create repair center icon
export const createRepairCenterIcon = (L) => {
  if (!L) {
    console.warn('createRepairCenterIcon: L (Leaflet) is required');
    return null;
  }
  return L.divIcon({
    className: 'custom-repair-center-icon',
    html: `<div class="marker-repair-center" style="
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      border: 3px solid #ffffff;
      border-radius: 6px;
      box-shadow: 0 3px 6px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      transition: all 0.2s ease;
      cursor: pointer;
    ">🔧</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

// City locations with coordinates and marker types
export const cityLocations = [
  // GMT +7 - Sumatra (Red Pins)
  { name: 'Banda Aceh', coords: [5.5483, 95.3238], type: 'red', timezone: '+7' },
  { name: 'Pematang Siantar', coords: [2.9631, 99.0618], type: 'red', timezone: '+7' },
  { name: 'Rantau Prapat', coords: [2.1000, 99.8333], type: 'red', timezone: '+7' },
  { name: 'Dumai', coords: [1.6677, 101.4436], type: 'red', timezone: '+7' },
  { name: 'Tembilahan', coords: [-0.3167, 103.1667], type: 'red', timezone: '+7' },
  { name: 'Lahat', coords: [-3.7867, 103.5333], type: 'red', timezone: '+7' },
  { name: 'Kotabumi', coords: [-4.8333, 104.9000], type: 'red', timezone: '+7' },
  
  // GMT +7 - Sumatra (White Pins)
  { name: 'Medan', coords: [3.5952, 98.6722], type: 'white', timezone: '+7' },
  { name: 'Tarutung', coords: [2.0167, 98.9667], type: 'white', timezone: '+7' },
  { name: 'Pekanbaru', coords: [0.5071, 101.4478], type: 'white', timezone: '+7' },
  { name: 'Padang', coords: [-0.9471, 100.4172], type: 'white', timezone: '+7' },
  { name: 'Payakumbuh', coords: [-0.2167, 100.6333], type: 'white', timezone: '+7' },
  { name: 'Jambi', coords: [-1.6101, 103.6131], type: 'white', timezone: '+7' },
  { name: 'Lubuklinggau', coords: [-3.2967, 102.8617], type: 'white', timezone: '+7' },
  { name: 'Bengkulu', coords: [-3.8004, 102.2655], type: 'white', timezone: '+7' },
  { name: 'Palembang', coords: [-2.9761, 104.7754], type: 'white', timezone: '+7' },
  { name: 'Lampung', coords: [-5.4294, 105.2628], type: 'white', timezone: '+7' },
  
  // GMT +7 - Java (Red Pins)
  { name: 'Jakarta', coords: [-6.2088, 106.8456], type: 'red', timezone: '+7', repairCenter: true },
  { name: 'Bogor', coords: [-6.5971, 106.8060], type: 'red', timezone: '+7' },
  { name: 'Tangerang', coords: [-6.1783, 106.6319], type: 'red', timezone: '+7' },
  { name: 'Bekasi', coords: [-6.2383, 106.9756], type: 'red', timezone: '+7' },
  { name: 'Bandung', coords: [-6.9175, 107.6191], type: 'red', timezone: '+7' },
  { name: 'Cirebon', coords: [-6.7063, 108.5571], type: 'red', timezone: '+7' },
  { name: 'Tasikmalaya', coords: [-7.3274, 108.2208], type: 'red', timezone: '+7' },
  { name: 'Sukabumi', coords: [-6.9277, 106.9300], type: 'red', timezone: '+7' },
  { name: 'Semarang', coords: [-6.9667, 110.4167], type: 'red', timezone: '+7' },
  { name: 'Blora', coords: [-6.9667, 111.4167], type: 'red', timezone: '+7' },
  { name: 'Tegal', coords: [-6.8667, 109.1333], type: 'red', timezone: '+7' },
  { name: 'Purwokerto', coords: [-7.4297, 109.2344], type: 'red', timezone: '+7' },
  { name: 'Yogyakarta', coords: [-7.7956, 110.3695], type: 'red', timezone: '+7' },
  { name: 'Solo', coords: [-7.5667, 110.8167], type: 'red', timezone: '+7' },
  { name: 'Surabaya', coords: [-7.2575, 112.7521], type: 'red', timezone: '+7', repairCenter: true },
  { name: 'Malang', coords: [-7.9797, 112.6304], type: 'red', timezone: '+7' },
  { name: 'Kediri', coords: [-7.8167, 112.0167], type: 'red', timezone: '+7' },
  { name: 'Pamekasan', coords: [-7.1667, 113.4667], type: 'red', timezone: '+7' },
  
  // GMT +7 - Java (White Pins)
  { name: 'D.I Yogyakarta', coords: [-7.7956, 110.3695], type: 'white', timezone: '+7' },
  
  // GMT +7 - West Kalimantan (White Pins)
  { name: 'Pontianak', coords: [-0.0263, 109.3425], type: 'white', timezone: '+7' },
  
  // GMT +8 - Kalimantan (Red Pins)
  { name: 'Tarakan', coords: [3.3167, 117.5833], type: 'red', timezone: '+8' },
  { name: 'Bontang', coords: [0.1333, 117.5000], type: 'red', timezone: '+8' },
  { name: 'Ketapang', coords: [-1.8333, 109.9667], type: 'red', timezone: '+8' },
  
  // GMT +8 - Kalimantan (White Pins)
  { name: 'Sanggau', coords: [0.0667, 110.5833], type: 'white', timezone: '+8' },
  { name: 'Pangkalan Bun', coords: [-2.6833, 111.6167], type: 'white', timezone: '+8' },
  { name: 'Palangkaraya', coords: [-2.2088, 113.9213], type: 'white', timezone: '+8' },
  { name: 'Balikpapan', coords: [-1.2379, 116.8529], type: 'white', timezone: '+8' },
  { name: 'Samarinda', coords: [-0.5022, 117.1536], type: 'white', timezone: '+8' },
  { name: 'Banjarmasin', coords: [-3.3194, 114.5906], type: 'white', timezone: '+8' },
  
  // GMT +8 - Sulawesi (Red Pins)
  { name: 'Manado', coords: [1.4748, 124.8421], type: 'red', timezone: '+8' },
  { name: 'Gorontalo', coords: [0.5333, 123.0667], type: 'red', timezone: '+8' },
  { name: 'Palopo', coords: [-3.0000, 120.2000], type: 'red', timezone: '+8' },
  { name: 'Pare Pare', coords: [-4.0167, 119.6167], type: 'red', timezone: '+8' },
  { name: 'Bulukumba', coords: [-5.5500, 120.2000], type: 'red', timezone: '+8' },
  { name: 'Kendari', coords: [-4.0275, 122.5086], type: 'red', timezone: '+8' },
  
  // GMT +8 - Sulawesi (White Pins)
  { name: 'Palu', coords: [-0.8999, 119.8707], type: 'white', timezone: '+8' },
  { name: 'Makassar', coords: [-5.1477, 119.4327], type: 'white', timezone: '+8', repairCenter: true },
  
  // GMT +8 - Bali & Nusa Tenggara (Red Pins)
  { name: 'Denpasar', coords: [-8.6705, 115.2126], type: 'red', timezone: '+8' },
  { name: 'Bima', coords: [-8.4667, 118.7167], type: 'red', timezone: '+8' },
  { name: 'Ruteng', coords: [-8.6167, 120.4667], type: 'red', timezone: '+8' },
  { name: 'Ende', coords: [-8.8333, 121.6500], type: 'red', timezone: '+8' },
  { name: 'Waikabubak', coords: [-9.6167, 119.4167], type: 'red', timezone: '+8' },
  
  // GMT +8 - Bali & Nusa Tenggara (White Pins)
  { name: 'Mataram', coords: [-8.5833, 116.1167], type: 'white', timezone: '+8' },
  { name: 'Kupang', coords: [-10.1718, 123.6075], type: 'white', timezone: '+8' },
  
  // GMT +9 - Maluku (Red Pins)
  { name: 'Ternate', coords: [0.7833, 127.3667], type: 'red', timezone: '+9' },
  { name: 'Sorong', coords: [-0.8667, 131.2500], type: 'red', timezone: '+9' },
  { name: 'Manokwari', coords: [-0.8667, 134.0833], type: 'red', timezone: '+9' },
  
  // GMT +9 - Maluku (White Pins)
  { name: 'Ambon', coords: [-3.6954, 128.1814], type: 'white', timezone: '+9' },
  
  // GMT +9 - Papua (Red Pins)
  { name: 'Timika', coords: [-4.5500, 136.8833], type: 'red', timezone: '+9' },
  { name: 'Marauke', coords: [-8.4667, 140.3333], type: 'red', timezone: '+9' },
  
  // GMT +9 - Papua (White Pins)
  { name: 'Jayapura', coords: [-2.5916, 140.6692], type: 'white', timezone: '+9' },
];

// Warehouse locations (strategic locations)
export const warehouseLocations = [
  { name: 'Medan Warehouse', coords: [3.5952, 98.6722], timezone: '+7' },
  { name: 'Pekanbaru Warehouse', coords: [0.5071, 101.4478], timezone: '+7' },
  { name: 'Padang Warehouse', coords: [-0.9471, 100.4172], timezone: '+7' },
  { name: 'Jambi Warehouse', coords: [-1.6101, 103.6131], timezone: '+7' },
  { name: 'Palembang Warehouse', coords: [-2.9761, 104.7754], timezone: '+7' },
  { name: 'Lampung Warehouse', coords: [-5.4294, 105.2628], timezone: '+7' },
  { name: 'Batam Warehouse', coords: [1.0456, 104.0305], timezone: '+7' },
  { name: 'Bangka Warehouse', coords: [-2.1333, 106.1167], timezone: '+7' },
  { name: 'Jakarta Warehouse', coords: [-6.2088, 106.8456], timezone: '+7' },
  { name: 'Semarang Warehouse', coords: [-6.9667, 110.4167], timezone: '+7' },
  { name: 'Yogyakarta Warehouse', coords: [-7.7956, 110.3695], timezone: '+7' },
  { name: 'Surabaya Warehouse', coords: [-7.2575, 112.7521], timezone: '+7' },
  { name: 'Pontianak Warehouse', coords: [-0.0263, 109.3425], timezone: '+7' },
  { name: 'Balikpapan Warehouse', coords: [-1.2379, 116.8529], timezone: '+8' },
  { name: 'Samarinda Warehouse', coords: [-0.5022, 117.1536], timezone: '+8' },
  { name: 'Pangkalan Bun Warehouse', coords: [-2.6833, 111.6167], timezone: '+8' },
  { name: 'Palangkaraya Warehouse', coords: [-2.2088, 113.9213], timezone: '+8' },
  { name: 'Banjarmasin Warehouse', coords: [-3.3194, 114.5906], timezone: '+8' },
  { name: 'Manado Warehouse', coords: [1.4748, 124.8421], timezone: '+8' },
  { name: 'Palu Warehouse', coords: [-0.8999, 119.8707], timezone: '+8' },
  { name: 'Makassar Warehouse', coords: [-5.1477, 119.4327], timezone: '+8' },
  { name: 'Mataram Warehouse', coords: [-8.5833, 116.1167], timezone: '+8' },
  { name: 'Bima Warehouse', coords: [-8.4667, 118.7167], timezone: '+8' },
  { name: 'Kupang Warehouse', coords: [-10.1718, 123.6075], timezone: '+8' },
  { name: 'Ambon Warehouse', coords: [-3.6954, 128.1814], timezone: '+9' },
  { name: 'Jayapura Warehouse', coords: [-2.5916, 140.6692], timezone: '+9' },
];


