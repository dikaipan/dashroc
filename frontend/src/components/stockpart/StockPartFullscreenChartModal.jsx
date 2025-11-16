/**
 * Stock Part Fullscreen Chart Modal Component
 * Displays fullscreen charts (FSL Map or Region Distribution)
 */
import React from 'react';
import { Maximize2 } from 'react-feather';
import { MapContainer, TileLayer, Marker, Popup, Tooltip as LeafletTooltip } from 'react-leaflet';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CHART_COLORS = {
  region1: '#3b82f6',
  region2: '#10b981', 
  region3: '#f59e0b',
  primary: '#06b6d4',
  secondary: '#8b5cf6'
};

export default function StockPartFullscreenChartModal({
  isOpen,
  onClose,
  chartType,
  fslWithCoords,
  fslIcons,
  regionDistribution
}) {
  if (!isOpen || !chartType) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" style={{ zIndex: 9999 }}>
      <div className="bg-slate-900 rounded-xl w-full h-full max-w-7xl max-h-[90vh] flex flex-col border border-slate-700">
        <div className="flex justify-between items-center p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {chartType === 'fsl-map' && 'Sebaran Lokasi FSL'}
              {chartType === 'region-dist' && 'Distribusi FSL per Region'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Maximize2 size={24} />
          </button>
        </div>
        <div className="flex-1 p-6 overflow-auto">
          {chartType === 'fsl-map' && (
            <div className="h-full rounded-lg overflow-hidden">
              <MapContainer
                center={[-2.5489, 118.0149]}
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {fslWithCoords.map((fsl, idx) => {
                  const region = fsl.region || fsl['region '] || 'Unknown';
                  const icon = fslIcons[region] || fslIcons['Region 1'];
                  return (
                    <Marker
                      key={idx}
                      position={[fsl.latitude, fsl.longitude]}
                      icon={icon}
                    >
                      <LeafletTooltip 
                        direction="top" 
                        offset={[0, -20]}
                        permanent={false}
                        opacity={1}
                        className="custom-tooltip"
                      >
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          padding: '6px 12px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: '10px',
                          boxShadow: '0 6px 16px rgba(0,0,0,0.4)',
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}>
                          <span style={{ 
                            fontSize: '18px',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                          }}>📍</span>
                          <span style={{ 
                            letterSpacing: '0.5px', 
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: '#fff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                          }}>{fsl.fsl_name || fsl.fslname || 'FSL'}</span>
                        </div>
                      </LeafletTooltip>
                      <Popup maxWidth={320}>
                        <div style={{ padding: '12px' }}>
                          <h4 style={{ margin: '0 0 10px 0', color: '#3b82f6', fontSize: '16px', fontWeight: 'bold' }}>
                            {fsl.fsl_name || fsl.fslname || 'FSL Location'}
                          </h4>
                          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                            <strong>ID:</strong> {fsl.fsl_id || fsl.fslid || 'N/A'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                            <strong>Kota:</strong> {fsl.fsl_city || fsl.fslcity || 'N/A'}
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                            <strong>Region:</strong> {region}
                          </div>
                          <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>
                            <strong>PIC:</strong> {fsl.fsl_pic || fsl.fslpic || 'N/A'}
                          </div>
                          <div style={{ fontSize: '12px', color: '#888', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #eee' }}>
                            {fsl.fsl_address || fsl.fsladdress || 'No address'}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          )}
          {chartType === 'region-dist' && (
            <div style={{ width: '100%', height: '400px', minHeight: '400px', minWidth: '100px', position: 'relative', display: 'block' }}>
              <ResponsiveContainer width="100%" height={400} minHeight={400} minWidth={100}>
              <PieChart>
                <Pie
                  data={regionDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={200}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={Object.values(CHART_COLORS)[index % 3]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0', fontSize: 14 }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

