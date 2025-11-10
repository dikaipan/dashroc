import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation } from 'react-router-dom';
import { useEngineerData } from "../hooks/useEngineerData.js";
import { useCrud } from "../hooks/useCrud.js";
import { useEngineerFilters } from "../hooks/useEngineerFilters.js";
import { useEngineerKPIs } from "../hooks/useEngineerKPIs.js";
import { useEngineerHandlers } from "../hooks/useEngineerHandlers.js";
import { useEngineerExport } from "../hooks/useExport.js";
import toast from 'react-hot-toast';
import { Search, Maximize, Minimize, Edit, Trash2, X, Upload, Download, ChevronDown, ChevronRight, ChevronLeft, Hash, Home, User, MapPin, Calendar, Settings, AlertCircle, Info, Award, Briefcase } from "react-feather";
import SkillProgress from "../components/charts/SkillProgress.jsx";
import { parseExperience } from "../utils/textUtils.js";
import PageLayout from "../components/layout/PageLayout.jsx";
import { SearchFilter, CustomAlert, CustomConfirm } from "../components/common";
import { getKPICard, TEXT_STYLES, cn } from '../constants/styles';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import InlineLoadingSpinner from '../components/common/InlineLoadingSpinner';

export default function Engineers() {
  const location = useLocation();
  const selectedEngineer = location.state?.selectedEngineer;
  const { rows: engineers, loading } = useEngineerData();
  const { create, update, remove, bulkDelete, loading: crudLoading } = useCrud({
    endpoint: '/api/engineers',
    primaryKey: 'id',
    eventName: 'engineerDataChanged'
  });
  const { handleExport, isExporting } = useEngineerExport();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("experience"); // experience, region, vendor, area_group
  const [sortValue, setSortValue] = useState(""); // Value untuk dropdown dinamis
  const [isFullscreen, setIsFullscreen] = useState(false); // Fullscreen mode
  const [selectedEngineers, setSelectedEngineers] = useState([]); // For bulk delete
  const [uploadingCSV, setUploadingCSV] = useState(false); // CSV upload state
  const [expandedRows, setExpandedRows] = useState(new Set()); // For expandable rows
  const [visibleColumns, setVisibleColumns] = useState(new Set(['id', 'name', 'region', 'area_group', 'vendor', 'years_experience'])); // Default visible columns
  
  // Handle ESC key to close fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFullscreen]);
  
  // Get all unique fields from engineers data
  const allEngineerFields = useMemo(() => {
    if (!engineers || engineers.length === 0) return [];
    const fieldsSet = new Set();
    engineers.forEach(eng => {
      Object.keys(eng).forEach(key => {
        fieldsSet.add(key);
      });
    });
    return Array.from(fieldsSet).sort();
  }, [engineers]);

  // Create initial form data with all fields
  const createInitialFormData = useCallback(() => {
    const initialData = {};
    if (allEngineerFields.length > 0) {
      allEngineerFields.forEach(field => {
        initialData[field] = "";
      });
    } else {
      // Fallback: Initialize with basic required fields if allEngineerFields is empty
      initialData.id = "";
      initialData.name = "";
      initialData.region = "";
      initialData.area_group = "";
      initialData.vendor = "";
      initialData.years_experience = "";
      initialData.technical_skills_training = "";
      initialData.soft_skills_training = "";
    }
    return initialData;
  }, [allEngineerFields]);
  
  // CRUD States
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // "create" or "edit"
  const [selectedEngineerForEdit, setSelectedEngineerForEdit] = useState(null);
  const [formData, setFormData] = useState({});
  
  // Update formData when allEngineerFields changes (only on initial load)
  useEffect(() => {
    if (allEngineerFields.length > 0 && Object.keys(formData).length === 0) {
      setFormData(createInitialFormData());
    }
  }, [allEngineerFields, createInitialFormData]); // Remove formData from dependencies

  // Reset form function
  const resetForm = useCallback(() => {
    setFormData(createInitialFormData());
  }, [createInitialFormData]);
  
  // Toggle row expansion
  const toggleRow = useCallback((engineerId) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(engineerId)) {
        newSet.delete(engineerId);
      } else {
        newSet.add(engineerId);
      }
      return newSet;
    });
  }, []);

  // Helper function to get field icon
  const getFieldIcon = useCallback((field) => {
    if (field.includes('id')) return <Hash size={16} className="text-blue-400" />;
    if (field.includes('name')) return <User size={16} className="text-green-400" />;
    if (field.includes('region') || field.includes('area') || field.includes('city') || field.includes('latitude') || field.includes('longitude')) return <MapPin size={16} className="text-orange-400" />;
    if (field.includes('vendor')) return <Briefcase size={16} className="text-purple-400" />;
    if (field.includes('experience') || field.includes('year')) return <Calendar size={16} className="text-cyan-400" />;
    if (field.includes('skill') || field.includes('training')) return <Award size={16} className="text-yellow-400" />;
    return <Info size={16} className="text-slate-400" />;
  }, []);

  // Helper function to get field placeholder
  const getFieldPlaceholder = useCallback((field) => {
    if (field === 'id') return 'ID Engineer (cth: ENG001)';
    if (field === 'name') return 'Nama lengkap engineer';
    if (field === 'region') return 'Region (Region 1/2/3)';
    if (field === 'area_group') return 'Area group (cth: JAKARTA 1)';
    if (field === 'vendor') return 'Nama vendor/perusahaan';
    if (field === 'years_experience') return 'Pengalaman (cth: 5 Tahun 3 Bulan atau 5)';
    if (field.includes('technical_skills')) return 'Keahlian teknis dipisahkan koma (cth: ATM Repair, CRM Maintenance)';
    if (field.includes('soft_skills')) return 'Soft skills dipisahkan koma (cth: Communication, Leadership)';
    if (field === 'latitude') return 'Koordinat latitude (cth: -6.2088)';
    if (field === 'longitude') return 'Koordinat longitude (cth: 106.8456)';
    return `Masukkan ${field.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ').toLowerCase()}`;
  }, []);

  // Extract unique values for dropdown fields from engineers data
  const dropdownOptions = useMemo(() => {
    const options = {};
    if (!engineers || engineers.length === 0) return options;
    
    // Fields that should have dropdowns (repeated values)
    const dropdownFields = ['region', 'area_group', 'vendor'];
    
    dropdownFields.forEach(field => {
      const valuesSet = new Set();
      engineers.forEach(eng => {
        const value = eng[field];
        if (value !== null && value !== undefined && value !== '') {
          valuesSet.add(String(value).trim());
        }
      });
      options[field] = Array.from(valuesSet).sort();
    });
    
    return options;
  }, [engineers]);

  // Create mapping from area_group to latitude/longitude
  const areaGroupCoordinates = useMemo(() => {
    const mapping = {};
    if (!engineers || engineers.length === 0) return mapping;
    
    engineers.forEach(eng => {
      const areaGroup = eng.area_group;
      if (areaGroup && eng.latitude && eng.longitude) {
        // Use first occurrence of valid coordinates for each area_group
        if (!mapping[areaGroup]) {
          mapping[areaGroup] = {
            latitude: eng.latitude,
            longitude: eng.longitude
          };
        }
      }
    });
    
    return mapping;
  }, [engineers]);

  // Handler untuk auto-fill latitude/longitude saat area_group dipilih
  const handleAreaGroupChange = useCallback((areaGroup) => {
    const newFormData = { ...formData, area_group: areaGroup };
    
    // Auto-fill latitude dan longitude jika area_group memiliki koordinat
    if (areaGroup && areaGroupCoordinates[areaGroup]) {
      newFormData.latitude = areaGroupCoordinates[areaGroup].latitude;
      newFormData.longitude = areaGroupCoordinates[areaGroup].longitude;
    }
    
    setFormData(newFormData);
  }, [formData, areaGroupCoordinates]);

  // Handler untuk ID input dengan prefix "IDH"
  const handleIdChange = useCallback((value) => {
    // Hapus prefix "IDH" jika user mengetik manual
    let cleanValue = value.replace(/^IDH/i, '').replace(/\D/g, '');
    
    // Limit maksimal 5 digit
    if (cleanValue.length > 5) {
      cleanValue = cleanValue.substring(0, 5);
    }
    
    // Tambahkan prefix "IDH" jika ada nilai
    const finalValue = cleanValue ? `IDH${cleanValue}` : '';
    
    setFormData({ ...formData, id: finalValue });
  }, [formData]);

  // Validasi form untuk disable button
  const isFormValid = useMemo(() => {
    if (!formData) return false;
    
    // Required fields: id dan name
    const idValue = formData.id || '';
    const hasName = formData.name && formData.name.trim().length > 0;
    
    // Untuk create mode: ID harus memiliki 5 digit setelah IDH
    // Untuk edit mode: ID harus ada (tidak perlu validasi panjang)
    let hasValidId = false;
    if (modalMode === 'create') {
      const idWithoutPrefix = idValue.replace(/^IDH/i, '');
      hasValidId = idWithoutPrefix.length === 5;
    } else {
      hasValidId = idValue.trim().length > 0;
    }
    
    return hasValidId && hasName;
  }, [formData, modalMode]);

  // Helper function to check if field should be date input
  const isDateField = useCallback((field) => {
    return field.includes('date');
  }, []);

  // Helper function to format date for input (YYYY-MM-DD)
  const formatDateForInput = useCallback((dateStr) => {
    if (!dateStr) return '';
    // Try to parse DD-MM-YYYY or DD-MM-YY format
    if (dateStr.includes('-')) {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0');
        const month = parts[1].padStart(2, '0');
        let year = parts[2];
        // Convert 2-digit year to 4-digit
        if (year.length === 2) {
          year = '20' + year;
        }
        return `${year}-${month}-${day}`;
      }
    }
    return '';
  }, []);

  // Helper function to format date for output (DD-MM-YYYY)
  const formatDateForOutput = useCallback((dateStr) => {
    if (!dateStr) return '';
    // If already in YYYY-MM-DD format (from date input)
    if (dateStr.includes('-') && dateStr.length === 10) {
      const parts = dateStr.split('-');
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateStr;
  }, []);

  // Group fields by category
  const engineerFieldGroups = useMemo(() => {
    const groups = {
      basic: ['id', 'name', 'vendor'],
      location: ['region', 'area_group', 'latitude', 'longitude'],
      experience: ['years_experience'],
      skills: ['technical_skills_training', 'soft_skills_training'],
      other: []
    };
    
    allEngineerFields.forEach(field => {
      let categorized = false;
      for (const [group, fields] of Object.entries(groups)) {
        if (fields.some(f => field.includes(f) || f.includes(field))) {
          if (!groups[group].includes(field)) {
            groups[group].push(field);
          }
          categorized = true;
          break;
        }
      }
      if (!categorized) {
        groups.other.push(field);
      }
    });
    
    return groups;
  }, [allEngineerFields]);

  // Use custom hooks for business logic
  const filteredEngineers = useEngineerFilters(engineers, { searchTerm, sortBy, sortValue });
  const kpis = useEngineerKPIs(filteredEngineers, engineers);
  const handlers = useEngineerHandlers({
    create,
    update,
    remove,
    bulkDelete,
    setModalMode,
    setSelectedEngineerForEdit,
    setFormData,
    setShowModal,
    setSelectedEngineers,
    resetForm
  });
  
  // Extract alert and confirm from handlers
  const { alert, confirm } = handlers;

  // Export is now handled by useEngineerExport hook

  // Wrapper handlers for UI
  const handleEdit = (engineer) => {
    handlers.handleEdit(engineer);
  };

  const handleDelete = (engineer) => {
    handlers.handleDelete(engineer);
  };

  const handleSave = async () => {
    await handlers.handleSave(formData, modalMode);
  };

  const handleSelectAll = (e) => {
    handlers.handleSelectAll(e, filteredEngineers);
  };

  const handleSelectOne = (engineerId) => {
    handlers.handleSelectOne(engineerId, selectedEngineers);
  };

  const handleBulkDelete = async () => {
    await handlers.handleBulkDelete(selectedEngineers);
  };

  const handleUploadCSV = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert.warning('Please upload a CSV file');
      return;
    }

    setUploadingCSV(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('target', 'engineers');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload CSV');
      }

      alert.success('CSV uploaded successfully!', 'Upload Berhasil');
      // Trigger data refresh
      window.dispatchEvent(new Event('engineerDataChanged'));
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert.error(`Failed to upload CSV: ${error.message}`);
    } finally {
      setUploadingCSV(false);
    }
  };

  // Reset selection when filters change
  useEffect(() => {
    setSelectedEngineers([]);
  }, [searchTerm, sortBy, sortValue]);

  // Only show full-screen loading on initial load, not during background refresh
  // Don't block UI if there's a modal or confirm dialog open
  const isInitialLoad = loading && engineers.length === 0;
  const hasActiveModal = showModal || confirm.confirmState.isOpen;
  
  if (isInitialLoad && !hasActiveModal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSkeleton type="spinner" message="Memuat data engineer..." size="lg" />
      </div>
    );
  }

  // KPIs are now calculated in useEngineerKPIs hook
  const { 
    totalEngineers, 
    totalAllEngineers, 
    percentageOfTotal, 
    avgExperience, 
    completedTraining, 
    trainingCompletionRate 
  } = kpis;


  return (
    <PageLayout
      title="Engineers Management"
    >

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Engineers */}
        <div className={getKPICard('blue', true)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={TEXT_STYLES.kpiTitle}>Total Engineers</p>
              <div className="flex items-baseline gap-2">
                <h3 className={TEXT_STYLES.kpiValue}>{totalEngineers}</h3>
                <span className={TEXT_STYLES.kpiSubtitle}>/ {totalAllEngineers}</span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-500"
                    style={{ width: `${percentageOfTotal}%` }}
                  ></div>
                </div>
                <span className="text-xs text-blue-400 font-semibold">{percentageOfTotal.toFixed(0)}%</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <span className="text-2xl">👷</span>
            </div>
          </div>
        </div>

        {/* Average Experience */}
        <div className={getKPICard('green', true)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={TEXT_STYLES.kpiTitle}>Avg Experience</p>
              <div className="flex items-baseline gap-2">
                <h3 className={TEXT_STYLES.kpiValue}>{avgExperience.toFixed(1)}</h3>
                <span className={TEXT_STYLES.kpiSubtitle}>years</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    avgExperience >= 4 ? 'bg-green-500/20 text-green-400' : 
                    avgExperience >= 2 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {avgExperience >= 4 ? 'Senior Team' : avgExperience >= 2 ? 'Mid-Level' : 'Junior Team'}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        {/* Training Completion */}
        <div className={getKPICard('purple', true)}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className={TEXT_STYLES.kpiTitle}>Training Completion</p>
              <div className="flex items-baseline gap-2">
                <h3 className={TEXT_STYLES.kpiValue}>{trainingCompletionRate.toFixed(0)}%</h3>
              </div>
              <div className={cn('mt-3 flex items-center gap-2', TEXT_STYLES.kpiSubtitle)}>
                <span>{completedTraining} of {totalEngineers} completed</span>
              </div>
              <div className="mt-2 flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-500"
                  style={{ width: `${trainingCompletionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <span className="text-2xl">📚</span>
            </div>
          </div>
        </div>
      </div>

      {/* Show bulk delete when items selected */}
      {selectedEngineers.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={handleBulkDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Trash2 size={16} /> Hapus ({selectedEngineers.length})
          </button>
        </div>
      )}

      {/* Sort By Section */}
      <div className="flex items-center gap-4 flex-wrap">
        <span className="text-slate-400 text-sm font-medium"></span>
        
        {/* Category Buttons */}
        <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => { setSortBy("experience"); setSortValue(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === "experience"
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Experience
              </button>
              <button
                onClick={() => { setSortBy("region"); setSortValue(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === "region"
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Region
              </button>
              <button
                onClick={() => { setSortBy("vendor"); setSortValue(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === "vendor"
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Vendor
              </button>
              <button
                onClick={() => { setSortBy("area_group"); setSortValue(""); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  sortBy === "area_group"
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                Area Group
              </button>
            </div>

            {/* Dynamic Dropdown - hanya muncul untuk non-experience */}
            {sortBy !== "experience" && (
              <select
                value={sortValue}
                onChange={(e) => setSortValue(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 min-w-[200px]"
              >
                <option value="">All {sortBy === "region" ? "Regions" : sortBy === "vendor" ? "Vendors" : "Area Groups"}</option>
                {sortBy === "region" && (
                  <>
                    <option value="Region 1">Region 1</option>
                    <option value="Region 2">Region 2</option>
                    <option value="Region 3">Region 3</option>
                  </>
                )}
                {sortBy === "vendor" && (
                  [...new Set(engineers.map(e => e.vendor).filter(Boolean))].sort().map(vendor => (
                    <option key={vendor} value={vendor}>{vendor}</option>
                  ))
                )}
                {sortBy === "area_group" && (
                  [...new Set(engineers.map(e => e.area_group).filter(Boolean))].sort().map(areaGroup => (
                    <option key={areaGroup} value={areaGroup}>{areaGroup}</option>
                  ))
                )}
              </select>
            )}
      </div>

      {/* Table & Training Progress Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table - Left Side (Larger) */}
        <div className={isFullscreen ? "fixed inset-0 z-50 p-6 bg-slate-900" : "lg:col-span-8"}>
          <div className={`bg-slate-800 rounded-lg overflow-hidden border border-slate-700 flex flex-col ${
            isFullscreen ? 'h-full' : 'max-h-[600px]'
          }`}>
            {/* Table Header with Search & Actions */}
            <div className="px-4 py-3 bg-slate-900 border-b border-slate-700 space-y-3 relative">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-100">Data Engineer</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{filteredEngineers.length} dari {engineers.length} engineer</p>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setModalMode("create");
                      setSelectedEngineerForEdit(null);
                      const freshForm = createInitialFormData();
                      setFormData(freshForm);
                      setShowModal(true);
                    }}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 sm:gap-1.5"
                  >
                    <span className="text-xs sm:text-sm">+</span> <span className="hidden sm:inline">Tambah</span> <span className="sm:hidden">+</span>
                  </button>
                  <button
                    onClick={() => handleExport(filteredEngineers, null, 'engineer')}
                    disabled={filteredEngineers.length === 0 || isExporting}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1 sm:gap-1.5"
                    title={filteredEngineers.length === 0 ? "Tidak ada data untuk diekspor" : "Export data ke CSV"}
                  >
                    {isExporting ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span className="hidden sm:inline">Exporting...</span>
                      </>
                    ) : (
                      <>
                        <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="hidden sm:inline">Export CSV</span>
                      </>
                    )}
                  </button>
                  <label className="px-2 sm:px-3 py-1 sm:py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 sm:gap-1.5 cursor-pointer">
                    <Upload size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">{uploadingCSV ? 'Uploading...' : 'Upload CSV'}</span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleUploadCSV}
                      className="hidden"
                      disabled={uploadingCSV}
                    />
                  </label>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1 sm:gap-1.5"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? <Minimize size={12} className="sm:w-3.5 sm:h-3.5" /> : <Maximize size={12} className="sm:w-3.5 sm:h-3.5" />}
                  </button>
                </div>
              </div>
              
              {/* Search Bar */}
              <div className="w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  <input
                    type="text"
                    placeholder="Search engineers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    aria-label="Search engineers"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-slate-900/95 backdrop-blur-sm sticky top-0 z-10">
                  <tr>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider w-12 border-b border-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedEngineers.length === filteredEngineers.length && filteredEngineers.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-slate-800 cursor-pointer"
                        aria-label="Select all engineers"
                      />
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-48 border-b border-slate-700">
                      Name
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-32 border-b border-slate-700">
                      Region
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-40 border-b border-slate-700">
                      Area Group
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-32 border-b border-slate-700">
                      Vendor
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-24 border-b border-slate-700">
                      Exp
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider w-40 border-b border-slate-700">
                      Skills
                    </th>
                    <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider w-24 border-b border-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {filteredEngineers.length > 0 ? (
                    filteredEngineers.map((engineer, idx) => {
                      const isExpanded = expandedRows.has(engineer.id);
                      return (
                        <React.Fragment key={idx}>
                          <tr className={`hover:bg-slate-700/40 transition-colors ${
                            idx % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-800/30'
                          }`}>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-center whitespace-nowrap w-12">
                              <input
                                type="checkbox"
                                checked={selectedEngineers.includes(engineer.id)}
                                onChange={() => handleSelectOne(engineer.id)}
                                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-slate-800 cursor-pointer"
                                aria-label={`Select engineer ${engineer.id}`}
                              />
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap w-48">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => toggleRow(engineer.id)}
                                  className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  aria-label={isExpanded ? "Collapse row" : "Expand row"}
                                >
                                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                  {engineer.name?.charAt(0) || "?"}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="text-xs sm:text-sm font-medium text-slate-100 truncate">{engineer.name || "-"}</div>
                                  <div className="text-xs text-slate-400 truncate">{engineer.id || "-"}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap w-32">
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                {engineer.region || "-"}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-slate-300 w-40 truncate" title={engineer.area_group || "-"}>
                              {engineer.area_group || "-"}
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-slate-300 w-32 truncate" title={engineer.vendor || "-"}>
                              {engineer.vendor || "-"}
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap w-24">
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-green-500/20 text-green-400 border border-green-500/30">
                                {engineer.years_experience || "0"}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 w-40">
                              <div className="flex flex-wrap gap-1">
                                {(() => {
                                  const skillsStr = engineer.technical_skills_training || "";
                                  const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
                                  
                                  if (skills.length === 0) {
                                    return <span className="text-xs text-slate-500">No skills</span>;
                                  }
                                  
                                  return (
                                    <>
                                      {skills.slice(0, 2).map((skill, i) => (
                                        <span
                                          key={i}
                                          className="px-2 py-0.5 text-xs rounded bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                        >
                                          {skill.replace('Training ', '')}
                                        </span>
                                      ))}
                                      {skills.length > 2 && (
                                        <span className="px-2 py-0.5 text-xs rounded bg-slate-700 text-slate-400 border border-slate-600">
                                          +{skills.length - 2}
                                        </span>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap w-24">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleEdit(engineer)}
                                  className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  title="Edit"
                                  aria-label={`Edit engineer ${engineer.id}`}
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDelete(engineer)}
                                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                  title="Delete"
                                  aria-label={`Delete engineer ${engineer.id}`}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {isExpanded && (
                            <tr className={`${idx % 2 === 0 ? 'bg-slate-800/50' : 'bg-slate-800/30'}`}>
                              <td colSpan={8} className="px-4 py-3">
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                                  {allEngineerFields.filter(f => !['id', 'name', 'region', 'area_group', 'vendor', 'years_experience', 'technical_skills_training', 'soft_skills_training'].includes(f)).map(field => {
                                    const value = engineer[field] || '-';
                                    const fieldLabel = field.split('_').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ');
                                    return (
                                      <div key={field} className="border-b border-slate-700/50 pb-2">
                                        <div className="text-slate-400 font-medium mb-1">{fieldLabel}</div>
                                        <div className="text-slate-200">{value}</div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="text-5xl">📭</div>
                          <div>
                            <p className="text-sm font-semibold text-slate-200 mb-1">Tidak ada engineer ditemukan</p>
                            <p className="text-xs text-slate-400">Coba ubah filter atau hapus beberapa filter untuk melihat hasil</p>
                          </div>
                          {(sortBy || sortValue || searchTerm) && (
                            <button
                              onClick={() => {
                                setSortBy("experience");
                                setSortValue("");
                                setSearchTerm("");
                              }}
                              className="mt-2 px-4 py-2 text-xs font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                              Hapus Semua Filter
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Training Skill Progress - Right Side - Modern Design */}
        <div className="lg:col-span-4">
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 p-5 rounded-xl border border-slate-700/50 relative min-h-[400px] max-h-[600px] flex flex-col shadow-lg">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
              <div>
                <h2 className="text-lg font-bold text-slate-100 mb-1">Training Skill Progress</h2>
                <p className="text-xs text-slate-400">{filteredEngineers.length} engineers</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800/50">
              {filteredEngineers.length > 0 ? (
                filteredEngineers.map((engineer, idx) => (
                  <SkillProgress key={idx} engineer={engineer} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-500">
                  <div className="w-16 h-16 rounded-full bg-slate-700/30 flex items-center justify-center mb-3">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">No engineers data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
     
      {/* Empty State */}
      {filteredEngineers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">👷</div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">Engineer Tidak Ditemukan</h3>
          <p className="text-slate-400">Coba sesuaikan filter atau kata kunci pencarian Anda</p>
        </div>
      )}

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-100">
                  {modalMode === "create" ? "Tambah Engineer Baru" : "Edit Engineer"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Basic Information Section */}
                {engineerFieldGroups.basic.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                      <User className="text-green-400" size={20} />
                      <h3 className="text-lg font-semibold text-slate-200">Informasi Dasar</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {engineerFieldGroups.basic.map((field) => {
                        const fieldValue = formData[field] || "";
                        const fieldLabel = field.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        const isRequired = field === 'id' || field === 'name';
                        const hasDropdown = dropdownOptions[field] && dropdownOptions[field].length > 0;
                        
                        // Special handling for ID field in create mode
                        if (field === 'id' && modalMode === 'create') {
                          return (
                            <div key={field} className="space-y-1.5">
                              <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                {getFieldIcon(field)}
                                <span>{fieldLabel} {isRequired && <span className="text-red-400">*</span>}</span>
                              </label>
                              <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium pointer-events-none">IDH</span>
                                <input
                                  type="text"
                                  value={fieldValue.replace(/^IDH/i, '')}
                                  onChange={(e) => handleIdChange(e.target.value)}
                                  maxLength={5}
                                  className="w-full pl-14 pr-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all"
                                  placeholder="00000"
                                />
                              </div>
                              <p className="text-xs text-slate-400">
                                Format: IDH + 5 digit angka (contoh: IDH00001)
                                {fieldValue.replace(/^IDH/i, '').length > 0 && (
                                  <span className={`ml-2 ${fieldValue.replace(/^IDH/i, '').length === 5 ? 'text-green-400' : 'text-yellow-400'}`}>
                                    ({fieldValue.replace(/^IDH/i, '').length}/5)
                                  </span>
                                )}
                              </p>
                            </div>
                          );
                        }
                        
                        return (
                          <div key={field} className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                              {getFieldIcon(field)}
                              <span>{fieldLabel} {isRequired && <span className="text-red-400">*</span>}</span>
                            </label>
                            {hasDropdown ? (
                              <select
                                value={fieldValue}
                                onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                                disabled={modalMode === "edit" && field === 'id'}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                              >
                                <option value="">-- Pilih {fieldLabel} --</option>
                                {dropdownOptions[field].map((option, idx) => (
                                  <option key={idx} value={option}>{option}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                                disabled={modalMode === "edit" && field === 'id'}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                placeholder={getFieldPlaceholder(field)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Location Information Section */}
                {engineerFieldGroups.location.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                      <MapPin className="text-orange-400" size={20} />
                      <h3 className="text-lg font-semibold text-slate-200">Informasi Lokasi</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {engineerFieldGroups.location.map((field) => {
                        const fieldValue = formData[field] || "";
                        const fieldLabel = field.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        const hasDropdown = dropdownOptions[field] && dropdownOptions[field].length > 0;
                        const isAutoFilled = (field === 'latitude' || field === 'longitude') && 
                                           formData.area_group && 
                                           areaGroupCoordinates[formData.area_group];
                        
                        return (
                          <div key={field} className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                              {getFieldIcon(field)}
                              <span>{fieldLabel}</span>
                              {isAutoFilled && (
                                <span className="text-xs text-green-400 font-normal">(Auto-filled)</span>
                              )}
                            </label>
                            {hasDropdown ? (
                              <select
                                value={fieldValue}
                                onChange={(e) => {
                                  if (field === 'area_group') {
                                    handleAreaGroupChange(e.target.value);
                                  } else {
                                    setFormData({...formData, [field]: e.target.value});
                                  }
                                }}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                              >
                                <option value="">-- Pilih {fieldLabel} --</option>
                                {dropdownOptions[field].map((option, idx) => (
                                  <option key={idx} value={option}>{option}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                                readOnly={isAutoFilled}
                                className={`w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all ${
                                  isAutoFilled ? 'bg-slate-600/50 cursor-not-allowed' : ''
                                }`}
                                placeholder={getFieldPlaceholder(field)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Experience Section */}
                {engineerFieldGroups.experience.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                      <Calendar className="text-cyan-400" size={20} />
                      <h3 className="text-lg font-semibold text-slate-200">Pengalaman</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {engineerFieldGroups.experience.map((field) => {
                        const fieldValue = formData[field] || "";
                        const fieldLabel = field.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        
                        return (
                          <div key={field} className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                              {getFieldIcon(field)}
                              <span>{fieldLabel}</span>
                            </label>
                            <input
                              type="text"
                              value={fieldValue}
                              onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                              placeholder={getFieldPlaceholder(field)}
                            />
                            <p className="text-xs text-slate-500">Format: "5 Tahun 3 Bulan" atau hanya "5"</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Skills Section */}
                {engineerFieldGroups.skills.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                      <Award className="text-yellow-400" size={20} />
                      <h3 className="text-lg font-semibold text-slate-200">Keahlian & Training</h3>
                    </div>
                    <div className="space-y-4">
                      {engineerFieldGroups.skills.map((field) => {
                        const fieldValue = formData[field] || "";
                        const fieldLabel = field.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        
                        return (
                          <div key={field} className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                              {getFieldIcon(field)}
                              <span>{fieldLabel}</span>
                            </label>
                            <textarea
                              value={fieldValue}
                              onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all resize-none"
                              placeholder={getFieldPlaceholder(field)}
                              rows="3"
                            />
                            <p className="text-xs text-slate-500">Pisahkan setiap keahlian dengan koma (cth: Skill 1, Skill 2, Skill 3)</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Other Fields Section */}
                {engineerFieldGroups.other.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-700">
                      <Info className="text-slate-400" size={20} />
                      <h3 className="text-lg font-semibold text-slate-200">Informasi Lainnya</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {engineerFieldGroups.other.map((field) => {
                        const fieldValue = formData[field] || "";
                        const fieldLabel = field.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');
                        const isDate = isDateField(field);
                        const hasDropdown = dropdownOptions[field] && dropdownOptions[field].length > 0;
                        
                        return (
                          <div key={field} className="space-y-1.5">
                            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                              {getFieldIcon(field)}
                              <span>{fieldLabel}</span>
                            </label>
                            {isDate ? (
                              <input
                                type="date"
                                value={formatDateForInput(fieldValue)}
                                onChange={(e) => setFormData({...formData, [field]: formatDateForOutput(e.target.value)})}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                              />
                            ) : hasDropdown ? (
                              <select
                                value={fieldValue}
                                onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                              >
                                <option value="">-- Pilih {fieldLabel} --</option>
                                {dropdownOptions[field].map((option, idx) => (
                                  <option key={idx} value={option}>{option}</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={fieldValue}
                                onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                                className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                                placeholder={getFieldPlaceholder(field)}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-lg font-medium transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={!isFormValid}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    isFormValid
                      ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {modalMode === "create" ? "Buat" : "Perbarui"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Dialog */}
      <CustomAlert
        isOpen={alert.alertState.isOpen}
        onClose={alert.closeAlert}
        type={alert.alertState.type}
        title={alert.alertState.title}
        message={alert.alertState.message}
        duration={alert.alertState.duration}
      />

      {/* Custom Confirm Dialog */}
      <CustomConfirm
        isOpen={confirm.confirmState.isOpen}
        onClose={confirm.closeConfirm}
        onConfirm={confirm.handleConfirm}
        title={confirm.confirmState.title}
        message={confirm.confirmState.message}
        confirmText={confirm.confirmState.confirmText}
        cancelText={confirm.confirmState.cancelText}
        type={confirm.confirmState.type}
        confirmButtonColor={confirm.confirmState.confirmButtonColor}
      />

      {/* Inline Loading Spinner - Shows during CRUD operations */}
      {crudLoading && <InlineLoadingSpinner size="md" message="Memproses..." />}
    </PageLayout>
  );
}
