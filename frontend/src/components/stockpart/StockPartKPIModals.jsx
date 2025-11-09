/**
 * Stock Part KPI Modals Component
 * Fullscreen modals for KPI cards (stock-alerts, total-stock, top-parts)
 */
import React from 'react';
import { X } from 'react-feather';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { MODAL_STYLES, BUTTON_STYLES, TEXT_STYLES, getGradientCard, ALERT_STYLES, CARD_STYLES, cn } from '../../constants/styles';

export default function StockPartKPIModals({
  activeKPI,
  onClose,
  stockAlerts,
  totalStockQuantity,
  totalParts,
  totalFSL,
  validParts,
  topPartsByStock,
  onShowAlertDetail
}) {
  if (!activeKPI) return null;

  // Stock Alerts Modal
  if (activeKPI === 'stock-alerts') {
    return (
      <div className={MODAL_STYLES.containerFullscreen} style={{ zIndex: 10000 }}>
        <div className={MODAL_STYLES.contentLarge}>
          <div className={MODAL_STYLES.header}>
            <div>
              <h2 className={MODAL_STYLES.headerTitleLarge}>📊 Stock Alerts - Analisis Lengkap</h2>
              <p className={MODAL_STYLES.headerSubtitle}>Monitoring dan rekomendasi tindakan untuk stok kritis</p>
            </div>
            <button onClick={onClose} className={BUTTON_STYLES.close}>
              <X size={28} />
            </button>
          </div>
          <div className={MODAL_STYLES.body}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Critical */}
              <div className={getGradientCard('red', false)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn(TEXT_STYLES.heading2, 'text-red-300')}>🔴 CRITICAL</h3>
                  <span className={cn('text-4xl font-bold text-red-400')}>{stockAlerts.criticalCount}</span>
                </div>
                <div className="space-y-3">
                  <div className={cn('p-4 rounded-lg border', ALERT_STYLES.critical)}>
                    <p className={cn(TEXT_STYLES.body, 'text-red-200 mb-2')}>⚠️ Status Bahaya</p>
                    <p className={TEXT_STYLES.bodySmall}>Stok 0. Berisiko menghentikan operasional.</p>
                  </div>
                  <div className={cn('p-4 rounded-lg border border-slate-700', CARD_STYLES.baseSmall)}>
                    <p className={cn(TEXT_STYLES.body, 'mb-2')}>💡 Rekomendasi</p>
                    <ul className={cn(TEXT_STYLES.bodySmall, 'space-y-1')}>
                      <li>• <strong>Segera</strong> emergency order ke supplier</li>
                      <li>• Cek stok di FSL terdekat untuk transfer urgent</li>
                      <li>• Koordinasi procurement untuk expedite delivery</li>
                    </ul>
                  </div>
                  <button onClick={() => { onClose(); onShowAlertDetail('critical'); }} className={cn(BUTTON_STYLES.danger, 'w-full')}>Lihat Detail →</button>
                </div>
              </div>
              {/* Priority */}
              <div className={getGradientCard('purple', false)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn(TEXT_STYLES.heading2, 'text-purple-300')}>⭐ PRIORITY</h3>
                  <span className={cn('text-4xl font-bold text-purple-400')}>{stockAlerts.priorityCriticalCount}</span>
                </div>
                <div className="space-y-3">
                  <div className={cn('p-4 rounded-lg border', ALERT_STYLES.priority)}>
                    <p className={cn(TEXT_STYLES.body, 'text-purple-200 mb-2')}>⭐ High Priority</p>
                    <p className={TEXT_STYLES.bodySmall}>Top 20 dengan stok rendah.</p>
                  </div>
                  <div className={cn('p-4 rounded-lg border border-slate-700', CARD_STYLES.baseSmall)}>
                    <p className={cn(TEXT_STYLES.body, 'mb-2')}>💡 Rekomendasi</p>
                    <ul className={cn(TEXT_STYLES.bodySmall, 'space-y-1')}>
                      <li>• <strong>Prioritaskan</strong> restock part ini</li>
                      <li>• Review forecast demand dan adjust safety stock</li>
                      <li>• Set automatic reorder point</li>
                    </ul>
                  </div>
                  <button onClick={() => { onClose(); onShowAlertDetail('priority'); }} className={cn(BUTTON_STYLES.warning, 'w-full')}>Lihat Detail →</button>
                </div>
              </div>
              {/* Urgent */}
              <div className={getGradientCard('orange', false)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn(TEXT_STYLES.heading2, 'text-orange-300')}>🟠 URGENT</h3>
                  <span className={cn('text-4xl font-bold text-orange-400')}>{stockAlerts.urgentCount}</span>
                </div>
                <div className="space-y-3">
                  <div className={cn('p-4 rounded-lg border', ALERT_STYLES.urgent)}>
                    <p className={cn(TEXT_STYLES.body, 'text-orange-200 mb-2')}>⚡ Tindakan Cepat</p>
                    <p className={TEXT_STYLES.bodySmall}>Stok 1-5 unit.</p>
                  </div>
                  <div className={cn('p-4 rounded-lg border border-slate-700', CARD_STYLES.baseSmall)}>
                    <p className={cn(TEXT_STYLES.body, 'mb-2')}>💡 Rekomendasi</p>
                    <ul className={cn(TEXT_STYLES.bodySmall, 'space-y-1')}>
                      <li>• <strong>1-2 hari</strong> lakukan PO</li>
                      <li>• Monitor daily usage</li>
                      <li>• Cek kemungkinan inter-FSL transfer</li>
                    </ul>
                  </div>
                  <button onClick={() => { onClose(); onShowAlertDetail('urgent'); }} className={cn(BUTTON_STYLES.warning, 'w-full')}>Lihat Detail →</button>
                </div>
              </div>
              {/* Warning */}
              <div className={getGradientCard('yellow', false)}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={cn(TEXT_STYLES.heading2, 'text-yellow-300')}>🟡 WARNING</h3>
                  <span className={cn('text-4xl font-bold text-yellow-400')}>{stockAlerts.warningCount}</span>
                </div>
                <div className="space-y-3">
                  <div className={cn('p-4 rounded-lg border', ALERT_STYLES.warning)}>
                    <p className={cn(TEXT_STYLES.body, 'text-yellow-200 mb-2')}>⚠️ Monitoring</p>
                    <p className={TEXT_STYLES.bodySmall}>Stok 6-10 unit.</p>
                  </div>
                  <div className={cn('p-4 rounded-lg border border-slate-700', CARD_STYLES.baseSmall)}>
                    <p className={cn(TEXT_STYLES.body, 'mb-2')}>💡 Rekomendasi</p>
                    <ul className={cn(TEXT_STYLES.bodySmall, 'space-y-1')}>
                      <li>• <strong>Minggu ini</strong> masukkan ke purchase plan</li>
                      <li>• Review historical usage</li>
                      <li>• Update inventory tracking</li>
                    </ul>
                  </div>
                  <button onClick={() => { onClose(); onShowAlertDetail('warning'); }} className={cn(BUTTON_STYLES.warning, 'w-full')}>Lihat Detail →</button>
                </div>
              </div>
            </div>
            <div className={cn('mt-6 p-6 rounded-xl border border-blue-500/30', getGradientCard('blue', false))}>
              <h3 className={cn(TEXT_STYLES.heading3, 'mb-4')}>📋 Ringkasan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={CARD_STYLES.baseSmall}>
                  <p className={cn(TEXT_STYLES.body, 'text-cyan-400 mb-2')}>Total Alert</p>
                  <p className={TEXT_STYLES.kpiValue}>{stockAlerts.totalLowStock}</p>
                </div>
                <div className={CARD_STYLES.baseSmall}>
                  <p className={cn(TEXT_STYLES.body, 'text-red-400 mb-2')}>Action Required</p>
                  <p className={TEXT_STYLES.kpiValue}>{stockAlerts.criticalCount + stockAlerts.urgentCount}</p>
                </div>
                <div className={CARD_STYLES.baseSmall}>
                  <p className={cn(TEXT_STYLES.body, 'text-yellow-400 mb-2')}>Monitoring</p>
                  <p className={TEXT_STYLES.kpiValue}>{stockAlerts.warningCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Total Stock Modal
  if (activeKPI === 'total-stock') {
    return (
      <div className={MODAL_STYLES.containerFullscreen} style={{ zIndex: 10000 }}>
        <div className={MODAL_STYLES.contentLarge}>
          <div className={MODAL_STYLES.header}>
            <div>
              <h2 className={MODAL_STYLES.headerTitleLarge}>📊 Total Stock - Analisis Inventory</h2>
              <p className={MODAL_STYLES.headerSubtitle}>Analisis lengkap total stok dan distribusi inventory</p>
            </div>
            <button onClick={onClose} className={BUTTON_STYLES.close}><X size={28} /></button>
          </div>
          <div className={MODAL_STYLES.body}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={cn(getGradientCard('green', false), 'lg:col-span-2')}>
                <h3 className={cn(TEXT_STYLES.heading2, 'text-green-300 mb-4')}>📈 Inventory Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className={cn('p-4 rounded-lg border', ALERT_STYLES.success)}>
                    <p className={cn(TEXT_STYLES.body, 'text-green-200 mb-2')}>Total Units</p>
                    <p className={TEXT_STYLES.kpiValue}>{totalStockQuantity.toLocaleString()}</p>
                    <p className={TEXT_STYLES.kpiSubtitle}>Unit tersedia di semua FSL</p>
                  </div>
                  <div className={cn('p-4 rounded-lg border', ALERT_STYLES.info)}>
                    <p className={cn(TEXT_STYLES.body, 'text-blue-200 mb-2')}>Total Parts</p>
                    <p className={TEXT_STYLES.kpiValue}>{totalParts}</p>
                    <p className={TEXT_STYLES.kpiSubtitle}>Jenis part berbeda</p>
                  </div>
                  <div className={cn('p-4 rounded-lg border', getGradientCard('purple', false))}>
                    <p className={cn(TEXT_STYLES.body, 'text-purple-200 mb-2')}>Avg/Part</p>
                    <p className={TEXT_STYLES.kpiValue}>{totalParts > 0 ? Math.round(totalStockQuantity / totalParts) : 0}</p>
                    <p className={TEXT_STYLES.kpiSubtitle}>Unit rata-rata per part</p>
                  </div>
                  <div className={cn('p-4 rounded-lg border', getGradientCard('cyan', false))}>
                    <p className={cn(TEXT_STYLES.body, 'text-cyan-200 mb-2')}>FSL Locations</p>
                    <p className={TEXT_STYLES.kpiValue}>{totalFSL}</p>
                    <p className={TEXT_STYLES.kpiSubtitle}>Lokasi FSL aktif</p>
                  </div>
                </div>
              </div>
              <div className={CARD_STYLES.base}>
                <h3 className={cn(TEXT_STYLES.heading3, 'mb-4')}>🏥 Stock Health</h3>
                <div className="space-y-3">
                  <div className={cn('flex items-center justify-between p-3 rounded-lg border', ALERT_STYLES.success)}>
                    <div>
                      <p className={cn(TEXT_STYLES.body, 'text-green-300')}>Healthy Stock</p>
                      <p className={TEXT_STYLES.bodySmall}>Stock 10 units</p>
                    </div>
                    <p className={cn('text-2xl font-bold text-green-400')}>{validParts.length - stockAlerts.totalLowStock}</p>
                  </div>
                  <div className={cn('flex items-center justify-between p-3 rounded-lg border', ALERT_STYLES.critical)}>
                    <div>
                      <p className={cn(TEXT_STYLES.body, 'text-red-300')}>Critical/Urgent</p>
                      <p className={TEXT_STYLES.bodySmall}>Stock 0-5 units</p>
                    </div>
                    <p className={cn('text-2xl font-bold text-red-400')}>{stockAlerts.criticalCount + stockAlerts.urgentCount}</p>
                  </div>
                  <div className={cn('flex items-center justify-between p-3 rounded-lg border', ALERT_STYLES.warning)}>
                    <div>
                      <p className={cn(TEXT_STYLES.body, 'text-yellow-300')}>Warning</p>
                      <p className={TEXT_STYLES.bodySmall}>Stock 6-10 units</p>
                    </div>
                    <p className={cn('text-2xl font-bold text-yellow-400')}>{stockAlerts.warningCount}</p>
                  </div>
                </div>
              </div>
              <div className={CARD_STYLES.base}>
                <h3 className={cn(TEXT_STYLES.heading3, 'mb-4')}>💡 Rekomendasi</h3>
                <div className="space-y-3">
                  <div className={cn('p-3 rounded-lg border', ALERT_STYLES.info)}>
                    <p className={cn(TEXT_STYLES.body, 'text-blue-300 mb-2')}>✅ Optimasi Stock</p>
                    <p className={TEXT_STYLES.bodySmall}>Review stock level. Target: avg {totalParts > 0 ? Math.round(totalStockQuantity / totalParts) : 0} unit/part.</p>
                  </div>
                  <div className={cn('p-3 rounded-lg border', getGradientCard('purple', false))}>
                    <p className={cn(TEXT_STYLES.body, 'text-purple-300 mb-2')}>📊 Distribution</p>
                    <p className={TEXT_STYLES.bodySmall}>Balance stok antar FSL untuk efisiensi.</p>
                  </div>
                  <div className={cn('p-3 rounded-lg border', ALERT_STYLES.success)}>
                    <p className={cn(TEXT_STYLES.body, 'text-green-300 mb-2')}>🎯 Safety Stock</p>
                    <p className={TEXT_STYLES.bodySmall}>Maintain minimum 10 unit untuk part critical.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Top Parts Modal
  if (activeKPI === 'top-parts') {
    return (
      <div className={MODAL_STYLES.containerFullscreen} style={{ zIndex: 10000 }}>
        <div className={MODAL_STYLES.contentLarge}>
          <div className={MODAL_STYLES.header}>
            <div>
              <h2 className={MODAL_STYLES.headerTitleLarge}>🏆 Top Parts - Analisis Detail</h2>
              <p className={MODAL_STYLES.headerSubtitle}>Part dengan stock terbanyak dan strategi inventory management</p>
            </div>
            <button onClick={onClose} className={BUTTON_STYLES.close}><X size={28} /></button>
          </div>
          <div className={MODAL_STYLES.body}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className={cn(CARD_STYLES.base, 'lg:col-span-2')}>
                <h3 className={cn(TEXT_STYLES.heading3, 'mb-4')}>📊 Top 8 Parts dengan Stock Terbanyak</h3>
                {topPartsByStock.length > 0 && (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topPartsByStock} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12, fill: '#94a3b8' }} 
                        angle={-45} 
                        textAnchor="end" 
                        height={120} 
                      />
                      <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #8b5cf6', borderRadius: '8px' }} 
                        formatter={(value, name, props) => [`${value} units`, `Part: ${props.payload.partNumber}`]} 
                      />
                      <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
              <div className={getGradientCard('purple', false)}>
                <h3 className={cn(TEXT_STYLES.heading3, 'text-purple-300 mb-4')}>🔍 Analisis Stock</h3>
                <div className="space-y-3">
                  <div className={cn('p-3 rounded-lg border', getGradientCard('purple', false))}>
                    <p className={cn(TEXT_STYLES.body, 'text-purple-200 mb-2')}>📈 High Stock Parts</p>
                    <p className={TEXT_STYLES.bodySmall}>
                      {topPartsByStock.length} part menyimpan {topPartsByStock.reduce((sum, p) => sum + p.value, 0).toLocaleString()} units ({totalStockQuantity > 0 ? Math.round((topPartsByStock.reduce((sum, p) => sum + p.value, 0) / totalStockQuantity) * 100) : 0}% dari total).
                    </p>
                  </div>
                  <div className={cn('p-3 rounded-lg', CARD_STYLES.baseSmall)}>
                    <p className={cn(TEXT_STYLES.body, 'mb-2')}>💰 Inventory Value</p>
                    <p className={TEXT_STYLES.bodySmall}>Part dengan stock tinggi berpotensi mengikat capital.</p>
                  </div>
                </div>
              </div>
              <div className={CARD_STYLES.base}>
                <h3 className={cn(TEXT_STYLES.heading3, 'mb-4')}>💡 Rekomendasi</h3>
                <div className="space-y-3">
                  <div className={cn('p-3 rounded-lg border', ALERT_STYLES.info)}>
                    <p className={cn(TEXT_STYLES.body, 'text-blue-300 mb-2')}>✅ Review Demand</p>
                    <p className={TEXT_STYLES.bodySmall}>Analisis historical usage untuk part dengan stock tinggi.</p>
                  </div>
                  <div className={cn('p-3 rounded-lg border', ALERT_STYLES.success)}>
                    <p className={cn(TEXT_STYLES.body, 'text-green-300 mb-2')}>🔄 Optimize Distribution</p>
                    <p className={TEXT_STYLES.bodySmall}>Redistribusi excess stock ke FSL yang membutuhkan.</p>
                  </div>
                  <div className={cn('p-3 rounded-lg border', ALERT_STYLES.urgent)}>
                    <p className={cn(TEXT_STYLES.body, 'text-orange-300 mb-2')}>⚖️ Balance Portfolio</p>
                    <p className={TEXT_STYLES.bodySmall}>Fokus procurement ke part dengan stock rendah.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

