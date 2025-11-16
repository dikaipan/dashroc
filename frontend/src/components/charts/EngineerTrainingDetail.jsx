// src/components/charts/EngineerTrainingDetail.jsx
// Detail training per engineer dengan progress bar
import React, { useMemo, useState, useDeferredValue, startTransition, useEffect, useCallback } from 'react';
import { User, MapPin, Briefcase, Award, CheckCircle, Circle, Users, TrendingUp, BookOpen, ChevronDown, ChevronUp, Filter, Star, Zap, Target, ChevronLeft, ChevronRight, AlertTriangle, X, Download, BarChart2, PieChart, Activity, TrendingDown, ArrowUp, ArrowDown, Minus, Clock, Shield } from 'react-feather';
import { getKPICard, TEXT_STYLES, cn } from '../../constants/styles';
import SearchableFilter from '../ui/SearchableFilter';
import { normalizeText, toTitleCase } from '../../utils/textUtils';
import { useTheme } from '../../contexts/ThemeContext';
import EngineerTrainingKPICards from './EngineerTrainingKPICards';
import EngineerTrainingProgress from './EngineerTrainingProgress';
import toast from "react-hot-toast";
import { useSOData, useEngineerCustomerRelationships } from "../../hooks/useEngineerData";

// Regional Operations Insight Component - REMOVED (card dihapus)

const EngineerTrainingDetail = ({ engineers = [], kpis = null }) => {
  const { isDark } = useTheme();
  const [expandedCards, setExpandedCards] = useState(new Set());
  const [category, setCategory] = useState("REGION");
  const [filterValue, setFilterValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEngineersWithoutTrainingModal, setShowEngineersWithoutTrainingModal] = useState(false);
  const [modalAreaGroupFilter, setModalAreaGroupFilter] = useState("");
  const [insightModal, setInsightModal] = useState(null); // 'total-engineers' | 'avg-resolution-time' | 'engineer-customer' | 'regional-operations' | 'overall-rate'
  
  // Fetch engineer-customer relationship data
  const { data: relationshipData, loading: relationshipLoading } = useEngineerCustomerRelationships();
  const itemsPerPage = 10;
  
  // Fetch SO data for April-September
  const { data: soData, loading: soLoading } = useSOData(['April', 'May', 'June', 'July', 'August', 'September']);
  
  // Helper function to get correct total SO count
  const getCorrectTotalSO = (data) => {
    if (!data) return 0;
    
    let actualArrayLength = 0;
    if (Array.isArray(data.data)) {
      actualArrayLength = data.data.length;
    } else if (Array.isArray(data)) {
      actualArrayLength = data.length;
    }
    
    return actualArrayLength;
  };
  
  // Get total SO count from backend data
  const arrayLength = getCorrectTotalSO(soData);
  
  // Reset expanded cards and page when filter changes
  useEffect(() => {
    setExpandedCards(new Set());
    setCurrentPage(1); // Reset ke page 1 saat filter berubah
  }, [filterValue, category]);

  // Handle ESC key to close modals
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        if (showEngineersWithoutTrainingModal) {
        setShowEngineersWithoutTrainingModal(false);
        setModalAreaGroupFilter("");
        }
        if (insightModal) {
          setInsightModal(null);
        }
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showEngineersWithoutTrainingModal, insightModal]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showEngineersWithoutTrainingModal || insightModal) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [showEngineersWithoutTrainingModal, insightModal]);
  
  const toggleCard = (engineerId) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(engineerId)) {
        newSet.delete(engineerId);
      } else {
        newSet.add(engineerId);
      }
      return newSet;
    });
  };
  
  // Extract all unique training types from all engineers (not just filtered)
  const allTrainingTypesForFilter = useMemo(() => {
    const trainingSet = new Set();
    
    if (!Array.isArray(engineers)) return [];
    
    engineers.forEach(engineer => {
      if (engineer.technical_skills_training) {
        const techStr = String(engineer.technical_skills_training);
        const techSkills = techStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
        techSkills.forEach(skill => {
          const cleaned = skill.trim();
          if (cleaned && cleaned.length > 0) {
            const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
            trainingSet.add(normalized);
          }
        });
      }
      
      if (engineer.soft_skills_training) {
        const softStr = String(engineer.soft_skills_training);
        const softSkills = softStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
        softSkills.forEach(skill => {
          const cleaned = skill.trim();
          if (cleaned && cleaned.length > 0) {
            const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
            trainingSet.add(normalized);
          }
        });
      }
      
      Object.keys(engineer).forEach(key => {
        if (key === 'id' || key === 'name' || key === 'area_group' || key === 'region' || 
            key === 'vendor' || key === 'join_date' || key === 'years_experience' || 
            key === 'latitude' || key === 'longitude' || key === 'soft_skills_training' || 
            key === 'technical_skills_training') {
          return;
        }
        
        const value = String(engineer[key] || '').trim();
        if (value && value.length > 0 && 
            value !== 'null' && value !== 'undefined' && 
            !value.match(/^-?\d+\.?\d*$/) && 
            (value.toLowerCase().includes('training') || value.toLowerCase().includes('crm') || 
             value.toLowerCase().includes('tcr') || value.toLowerCase().includes('edc') || 
             value.toLowerCase().includes('pos') || value.toLowerCase().includes('cash'))) {
          const normalized = value.startsWith('Training ') ? value : `Training ${value}`;
          trainingSet.add(normalized);
        }
      });
    });
    
    const expectedOrder = [
      'Training CRM',
      'Training TCR', 
      'Training Cash Sorter',
      'Training EDC',
      'Training POS',
      'Training Komunikasi Dasar'
    ];
    
    return Array.from(trainingSet).sort((a, b) => {
      const aIndex = expectedOrder.indexOf(a);
      const bIndex = expectedOrder.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [engineers]);

  // Generate filter options based on category
  const filterOptions = useMemo(() => {
    if (!Array.isArray(engineers)) return [];
    
    let options = [];
    
    if (category === "REGION") {
      options = ["Region 1", "Region 2", "Region 3"];
    } else if (category === "VENDOR") {
      const vendors = engineers
        .filter((e) => e && typeof e === 'object' && e.vendor)
        .map((e) => e.vendor)
        .filter((val) => val && typeof val === 'string');
      options = [...new Set(vendors)];
    } else if (category === "AREA GROUP") {
      const areaGroups = engineers
        .filter((e) => e && typeof e === 'object' && e.area_group)
        .map((e) => e.area_group)
        .filter((val) => val && typeof val === 'string');
      
      // Normalize area group names
      const normalizedMap = new Map();
      areaGroups.forEach(opt => {
        if (opt && typeof opt === 'string') {
          try {
            const normalized = normalizeText(opt);
            if (normalized && !normalizedMap.has(normalized)) {
              normalizedMap.set(normalized, toTitleCase(normalized));
            }
          } catch (error) {
            console.warn('Error normalizing option:', opt, error);
          }
        }
      });
      
      options = Array.from(normalizedMap.values()).filter(Boolean);
    } else if (category === "TRAINING") {
      options = allTrainingTypesForFilter;
    }
    
    const uniqueOptions = [...new Set(options)].filter((opt) => opt && typeof opt === 'string');
    
    return uniqueOptions.sort((a, b) => {
      if (category === "REGION") {
        const regionOrder = ["Region 1", "Region 2", "Region 3"];
        const aIndex = regionOrder.indexOf(a);
        const bIndex = regionOrder.indexOf(b);
        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
      }
      if (typeof a === 'string' && typeof b === 'string') {
        return a.localeCompare(b);
      }
      return 0;
    });
  }, [engineers, category, allTrainingTypesForFilter]);
  
  // Helper function to get engineer trainings
  const getEngineerTrainings = useCallback((engineer) => {
    const trainings = new Set();
    
    if (engineer.technical_skills_training) {
      const techStr = String(engineer.technical_skills_training);
      const techSkills = techStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
      techSkills.forEach(skill => {
        const cleaned = skill.trim();
        if (cleaned && cleaned.length > 0) {
          const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
          trainings.add(normalized);
        }
      });
    }
    
    if (engineer.soft_skills_training) {
      const softStr = String(engineer.soft_skills_training);
      const softSkills = softStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
      softSkills.forEach(skill => {
        const cleaned = skill.trim();
        if (cleaned && cleaned.length > 0) {
          const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
          trainings.add(normalized);
        }
      });
    }
    
    Object.keys(engineer).forEach(key => {
      if (key === 'id' || key === 'name' || key === 'area_group' || key === 'region' || 
          key === 'vendor' || key === 'join_date' || key === 'years_experience' || 
          key === 'latitude' || key === 'longitude' || key === 'soft_skills_training' || 
          key === 'technical_skills_training') {
        return;
      }
      
      const value = String(engineer[key] || '').trim();
      if (value && value.length > 0 && 
          value !== 'null' && value !== 'undefined' && 
          !value.match(/^-?\d+\.?\d*$/) && 
          (value.toLowerCase().includes('training') || value.toLowerCase().includes('crm') || 
           value.toLowerCase().includes('tcr') || value.toLowerCase().includes('edc') || 
           value.toLowerCase().includes('pos') || value.toLowerCase().includes('cash') ||
           value.toLowerCase().includes('edisi'))) {
        const normalized = value.startsWith('Training ') ? value : `Training ${value}`;
        trainings.add(normalized);
      }
    });
    
    return Array.from(trainings);
  }, []);

  // Filter engineers based on category and filterValue
  const deferredFilterValue = useDeferredValue(filterValue);
  const filteredEngineers = useMemo(() => {
    if (!Array.isArray(engineers)) return [];
    
    const activeFilter = deferredFilterValue || filterValue;
    if (!activeFilter) return engineers;
    
    if (category === "TRAINING") {
      // Filter engineers who have completed the selected training
      return engineers.filter(engineer => {
        if (!engineer || typeof engineer !== 'object') return false;
        const engineerTrainings = getEngineerTrainings(engineer);
        return engineerTrainings.some(training => 
          training.toLowerCase().trim() === activeFilter.toLowerCase().trim()
        );
      });
    }
    
    const key = category === "REGION" ? "region" : category === "VENDOR" ? "vendor" : "area_group";
    
    if (category === "AREA GROUP") {
      // Pattern matching: "Surabaya" akan match dengan "Surabaya 1", "Surabaya 2", dll
      return engineers.filter(engineer => {
        if (!engineer || typeof engineer !== 'object') return false;
        const value = engineer[key];
        if (!value || typeof value !== 'string') return false;
        
        try {
          const normalizedValue = normalizeText(value);
          const normalizedFilter = normalizeText(activeFilter);
          return normalizedValue.includes(normalizedFilter) || normalizedFilter.includes(normalizedValue);
        } catch (error) {
          return value.toLowerCase().includes(activeFilter.toLowerCase());
        }
      });
    } else {
      // Exact match for REGION and VENDOR
      return engineers.filter(engineer => {
        if (!engineer || typeof engineer !== 'object') return false;
        const value = engineer[key];
        return value && String(value).trim() === activeFilter.trim();
      });
    }
  }, [engineers, category, deferredFilterValue, filterValue, getEngineerTrainings]);

  // Get engineers who haven't completed the selected training
  const engineersWithoutTraining = useMemo(() => {
    if (category !== "TRAINING" || !filterValue) return [];
    
    return engineers.filter(engineer => {
      if (!engineer || typeof engineer !== 'object') return false;
      const engineerTrainings = getEngineerTrainings(engineer);
      return !engineerTrainings.some(training => 
        training.toLowerCase().trim() === filterValue.toLowerCase().trim()
      );
    });
  }, [engineers, category, filterValue, getEngineerTrainings]);

  // Filter engineers in modal by area group
  const filteredEngineersInModal = useMemo(() => {
    if (!modalAreaGroupFilter) return engineersWithoutTraining;
    
    return engineersWithoutTraining.filter(engineer => {
      if (!engineer || typeof engineer !== 'object') return false;
      const areaGroup = engineer.area_group || '';
      try {
        const normalizedValue = normalizeText(areaGroup);
        const normalizedFilter = normalizeText(modalAreaGroupFilter);
        return normalizedValue.includes(normalizedFilter) || normalizedFilter.includes(normalizedValue);
      } catch (error) {
        return areaGroup.toLowerCase().includes(modalAreaGroupFilter.toLowerCase());
      }
    });
  }, [engineersWithoutTraining, modalAreaGroupFilter]);

  // Get unique area groups from engineersWithoutTraining for filter
  const modalAreaGroupOptions = useMemo(() => {
    const areaGroups = engineersWithoutTraining
      .filter((e) => e && typeof e === 'object' && e.area_group)
      .map((e) => e.area_group)
      .filter((val) => val && typeof val === 'string');
    
    const normalizedMap = new Map();
    areaGroups.forEach(opt => {
      if (opt && typeof opt === 'string') {
        try {
          const normalized = normalizeText(opt);
          if (normalized && !normalizedMap.has(normalized)) {
            normalizedMap.set(normalized, toTitleCase(normalized));
          }
        } catch (error) {
          console.warn('Error normalizing option:', opt, error);
        }
      }
    });
    
    return Array.from(normalizedMap.values()).filter(Boolean).sort();
  }, [engineersWithoutTraining]);

  // Export engineers to CSV
  const handleExportToCSV = useCallback(() => {
    if (!filteredEngineersInModal || filteredEngineersInModal.length === 0) {
      toast.error('Tidak ada data untuk diekspor', {
        icon: '❌',
        duration: 3000
      });
      return;
    }

    try {
    const exportData = filteredEngineersInModal.map(engineer => ({
      name: engineer.name || '',
      area_group: engineer.area_group || '',
      region: engineer.region || '',
      vendor: engineer.vendor || '',
      id: engineer.id || '',
      years_experience: engineer.years_experience || '',
      missing_training: filterValue || ''
    }));

    const headers = ['name', 'area_group', 'region', 'vendor', 'id', 'years_experience', 'missing_training'];
    const csvContent = [
      headers.join(","),
      ...exportData.map(row => headers.map(header => {
        const value = row[header] || '';
        return `"${String(value).replace(/"/g, '""')}"`;
      }).join(","))
    ].join("\n");

    const dateStr = new Date().toISOString().split('T')[0];
    const trainingName = filterValue.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const fileName = `engineers_missing_${trainingName}_${dateStr}.csv`;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(link.href), 100);

      toast.success(
        `Berhasil mengekspor ${filteredEngineersInModal.length} engineer ke ${fileName}`,
        {
          icon: '✅',
          duration: 4000
        }
      );
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data', {
        icon: '❌',
        duration: 4000
      });
    }
  }, [filteredEngineersInModal, filterValue]);
  // Extract all unique training types from filtered engineers
  const allTrainingTypes = useMemo(() => {
    const trainingSet = new Set();
    
    filteredEngineers.forEach(engineer => {
      // Parse technical skills - handle comma-separated values and multiple columns
      if (engineer.technical_skills_training) {
        const techStr = String(engineer.technical_skills_training);
        // Split by comma and filter out empty values
        const techSkills = techStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
        techSkills.forEach(skill => {
          const cleaned = skill.trim();
          if (cleaned && cleaned.length > 0) {
            // Normalize training name (ensure it starts with "Training ")
            const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
            trainingSet.add(normalized);
          }
        });
      }
      
      // Check ALL columns for training data (CSV has empty columns in between)
      Object.keys(engineer).forEach(key => {
        // Skip non-training columns
        if (key === 'id' || key === 'name' || key === 'area_group' || key === 'region' || 
            key === 'vendor' || key === 'join_date' || key === 'years_experience' || 
            key === 'latitude' || key === 'longitude' || key === 'soft_skills_training') {
          return;
        }
        
        // Check if this might be a training column
        const value = String(engineer[key] || '').trim();
        if (value && value.length > 0 && 
            value !== 'null' && value !== 'undefined' && 
            !value.match(/^-?\d+\.?\d*$/) && // Not a number
            (value.toLowerCase().includes('training') || value.toLowerCase().includes('crm') || 
             value.toLowerCase().includes('tcr') || value.toLowerCase().includes('edc') || 
             value.toLowerCase().includes('pos') || value.toLowerCase().includes('cash') ||
             value.toLowerCase().includes('edisi'))) {
          const normalized = value.startsWith('Training ') ? value : `Training ${value}`;
          trainingSet.add(normalized);
        }
      });
      
      // Parse soft skills
      if (engineer.soft_skills_training) {
        const softStr = String(engineer.soft_skills_training);
        const softSkills = softStr.split(',').map(s => s.trim()).filter(s => s && s !== '' && s !== 'null' && s !== 'undefined');
        softSkills.forEach(skill => {
          const cleaned = skill.trim();
          if (cleaned && cleaned.length > 0) {
            const normalized = cleaned.startsWith('Training ') ? cleaned : `Training ${cleaned}`;
            trainingSet.add(normalized);
          }
        });
      }
    });
    
    // Define expected training order: 5 technical + 1 soft
    const expectedOrder = [
      'Training CRM',
      'Training TCR', 
      'Training Cash Sorter',
      'Training EDC',
      'Training POS',
      'Training Edisi',
      'Training Komunikasi Dasar'
    ];
    
    // Sort trainings: Use expected order first, then alphabetically for any extras
    const sortedTrainings = Array.from(trainingSet).sort((a, b) => {
      const aIndex = expectedOrder.indexOf(a);
      const bIndex = expectedOrder.indexOf(b);
      
      // If both are in expected order, sort by index
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      // If only a is in expected order, a comes first
      if (aIndex !== -1) return -1;
      // If only b is in expected order, b comes first
      if (bIndex !== -1) return 1;
      // Both not in expected order, sort alphabetically
      return a.localeCompare(b);
    });
    
    return sortedTrainings;
  }, [filteredEngineers]);

  // Parse engineer training data from filtered engineers
  const engineersWithTraining = useMemo(() => {
    return filteredEngineers.map(engineer => {
      // Parse technical skills - handle comma-separated values
      let techSkills = [];
      if (engineer.technical_skills_training) {
        const techStr = String(engineer.technical_skills_training);
        techSkills = techStr.split(',')
          .map(s => s.trim())
          .filter(s => s && s !== '' && s !== 'null' && s !== 'undefined')
          .map(skill => {
            // Normalize training name
            return skill.startsWith('Training ') ? skill : `Training ${skill}`;
          });
      }
      
      // Check ALL columns for training data (CSV has empty columns in between)
      Object.keys(engineer).forEach(key => {
        // Skip non-training columns
        if (key === 'id' || key === 'name' || key === 'area_group' || key === 'region' || 
            key === 'vendor' || key === 'join_date' || key === 'years_experience' || 
            key === 'latitude' || key === 'longitude' || key === 'soft_skills_training' || 
            key === 'technical_skills_training') {
          return;
        }
        
        // Check if this might be a training column
        const value = String(engineer[key] || '').trim();
        if (value && value.length > 0 && 
            value !== 'null' && value !== 'undefined' && 
            !value.match(/^-?\d+\.?\d*$/) && // Not a number
            (value.toLowerCase().includes('training') || value.toLowerCase().includes('crm') || 
             value.toLowerCase().includes('tcr') || value.toLowerCase().includes('edc') || 
             value.toLowerCase().includes('pos') || value.toLowerCase().includes('cash'))) {
          const normalized = value.startsWith('Training ') ? value : `Training ${value}`;
          if (!techSkills.includes(normalized) && !normalized.toLowerCase().includes('komunikasi')) {
            techSkills.push(normalized);
          }
        }
      });
      
      // Parse soft skills
      let softSkills = [];
      if (engineer.soft_skills_training) {
        const softStr = String(engineer.soft_skills_training);
        softSkills = softStr.split(',')
          .map(s => s.trim())
          .filter(s => s && s !== '')
          .map(skill => {
            // Normalize training name
            return skill.startsWith('Training ') ? skill : `Training ${skill}`;
          });
      }
      
      const allSkills = [...techSkills, ...softSkills];
      const completedCount = allSkills.length;
      const totalTrainings = allTrainingTypes.length;
      const completionRate = totalTrainings > 0 ? Math.round((completedCount / totalTrainings) * 100) : 0;
      
      // Create training status map
      const trainingStatus = {};
      allTrainingTypes.forEach(training => {
        trainingStatus[training] = allSkills.some(skill => 
          skill.toLowerCase().trim() === training.toLowerCase().trim()
        );
      });
      
      return {
        ...engineer,
        techSkills,
        softSkills,
        allSkills,
        completedCount,
        totalTrainings,
        completionRate,
        trainingStatus
      };
    });
  }, [filteredEngineers, allTrainingTypes]);

  // Get status color
  const getStatusColor = (rate) => {
    if (rate >= 80) return { 
      bg: 'bg-emerald-500/10', 
      text: 'text-emerald-400', 
      border: 'border-emerald-500/30', 
      bar: 'from-emerald-500 to-green-600',
      colorName: 'emerald',
      rgb: '16, 185, 129'
    };
    if (rate >= 60) return { 
      bg: 'bg-blue-500/10', 
      text: 'text-blue-400', 
      border: 'border-blue-500/30', 
      bar: 'from-blue-500 to-cyan-600',
      colorName: 'blue',
      rgb: '59, 130, 246'
    };
    if (rate >= 40) return { 
      bg: 'bg-amber-500/10', 
      text: 'text-amber-400', 
      border: 'border-amber-500/30', 
      bar: 'from-amber-500 to-yellow-600',
      colorName: 'amber',
      rgb: '245, 158, 11'
    };
    return { 
      bg: 'bg-red-500/10', 
      text: 'text-red-400', 
      border: 'border-red-500/30', 
      bar: 'from-red-500 to-orange-600',
      colorName: 'red',
      rgb: '239, 68, 68'
    };
  };

  if (filteredEngineers.length === 0) {
    return (
      <div className={cn(
        "rounded-2xl border p-8 text-center",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200"
      )}>
        {filterValue ? (
          <>
            <p className={isDark ? "text-slate-400" : "text-gray-600"}>No engineers found for selected filter</p>
            <p className={cn(
              "text-xs mt-2",
              isDark ? "text-slate-500" : "text-gray-500"
            )}>
              {category === "REGION" ? "Region" : category === "VENDOR" ? "Vendor" : "Area"}: {filterValue}
            </p>
            <button
              onClick={() => {
                startTransition(() => {
                  setFilterValue("");
                });
              }}
              className="mt-4 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Clear Filter
            </button>
          </>
        ) : (
          <p className={isDark ? "text-slate-400" : "text-gray-600"}>No engineer data available</p>
        )}
      </div>
    );
  }
  
  if (allTrainingTypes.length === 0) {
    return (
      <div className={cn(
        "rounded-2xl border p-8 text-center",
        isDark
          ? "bg-slate-800 border-slate-700"
          : "bg-white border-gray-200"
      )}>
        <p className={isDark ? "text-slate-400" : "text-gray-600"}>No training data found in engineer records</p>
        <p className={cn(
          "text-xs mt-2",
          isDark ? "text-slate-500" : "text-gray-500"
        )}>Check console for debugging info</p>
        <div className={cn(
          "mt-4 text-left text-xs",
          isDark ? "text-slate-500" : "text-gray-500"
        )}>
          <p>Sample engineer keys: {Object.keys(engineers[0] || {}).join(', ')}</p>
        </div>
      </div>
    );
  }

  // Calculate summary stats from filtered engineers with enhanced insights
  const summaryStats = useMemo(() => {
    const total = filteredEngineers.length;
    const withTraining = engineersWithTraining.filter(e => e.completedCount > 0).length;
    const withoutTraining = total - withTraining;
    const avgCompletion = engineersWithTraining.length > 0
      ? Math.round(engineersWithTraining.reduce((sum, e) => sum + e.completionRate, 0) / engineersWithTraining.length)
      : 0;
    const totalCompleted = engineersWithTraining.reduce((sum, e) => sum + e.completedCount, 0);
    const totalPossible = engineersWithTraining.length * allTrainingTypes.length;
    const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    
    // Enhanced insights for Total Engineers card
    const byRegion = {};
    const byVendor = {};
    const byExperienceLevel = { junior: 0, mid: 0, senior: 0 };
    
    filteredEngineers.forEach(eng => {
      // Region breakdown
      const region = eng.region || 'Unknown';
      byRegion[region] = (byRegion[region] || 0) + 1;
      
      // Vendor breakdown
      const vendor = eng.vendor || 'Unknown';
      byVendor[vendor] = (byVendor[vendor] || 0) + 1;
      
      // Experience level (parse years_experience)
      const expStr = String(eng.years_experience || '0 Tahun 0 Bulan');
      const yearsMatch = expStr.match(/(\d+)\s+Tahun/);
      const years = yearsMatch ? parseInt(yearsMatch[1]) : 0;
      if (years < 2) byExperienceLevel.junior++;
      else if (years < 5) byExperienceLevel.mid++;
      else byExperienceLevel.senior++;
    });
    
    const topRegion = Object.entries(byRegion).sort((a, b) => b[1] - a[1])[0];
    const topVendor = Object.entries(byVendor).sort((a, b) => b[1] - a[1])[0];
    
    // Enhanced insights for Avg Completion card
    const completionDistribution = {
      excellent: engineersWithTraining.filter(e => e.completionRate === 100).length,
      high: engineersWithTraining.filter(e => e.completionRate >= 80 && e.completionRate < 100).length,
      medium: engineersWithTraining.filter(e => e.completionRate >= 60 && e.completionRate < 80).length,
      low: engineersWithTraining.filter(e => e.completionRate >= 40 && e.completionRate < 60).length,
      veryLow: engineersWithTraining.filter(e => e.completionRate < 40).length
    };
    
    const completionByRegion = {};
    engineersWithTraining.forEach(e => {
      const region = e.region || 'Unknown';
      if (!completionByRegion[region]) {
        completionByRegion[region] = { total: 0, sum: 0 };
      }
      completionByRegion[region].total++;
      completionByRegion[region].sum += e.completionRate;
    });
    
    const avgCompletionByRegion = Object.entries(completionByRegion).map(([region, data]) => ({
      region,
      avg: Math.round(data.sum / data.total)
    })).sort((a, b) => b.avg - a.avg);
    
    // Enhanced insights for Overall Rate card
    const trainingCompletionCount = {};
    allTrainingTypes.forEach(training => {
      trainingCompletionCount[training] = engineersWithTraining.filter(e => 
        e.trainingStatus[training]
      ).length;
    });
    
    const trainingStats = Object.entries(trainingCompletionCount)
      .map(([training, count]) => ({
        training: training.replace('Training ', ''),
        count,
        percentage: total > 0 ? Math.round((count / total) * 100) : 0
      }))
      .sort((a, b) => {
        // Sort by percentage descending, then by training name ascending for same percentage
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage;
        }
        return a.training.localeCompare(b.training);
      });
    
    const mostCompletedTraining = trainingStats[0];
    // Find all trainings with the lowest percentage
    const lowestPercentage = trainingStats.length > 0 ? trainingStats[trainingStats.length - 1].percentage : 0;
    const leastCompletedTrainings = trainingStats.filter(stat => stat.percentage === lowestPercentage);
    // If multiple trainings have the same lowest percentage, show the first one alphabetically
    const leastCompletedTraining = leastCompletedTrainings.length > 0 
      ? leastCompletedTrainings.sort((a, b) => a.training.localeCompare(b.training))[0]
      : null;
    
    // Training Gaps Analysis - Calculate engineers missing each training
    const trainingGaps = allTrainingTypes.map(training => {
      const engineersWithTraining = filteredEngineers.filter(eng => {
        const engTrainings = getEngineerTrainings(eng);
        return engTrainings.some(t => t.toLowerCase().trim() === training.toLowerCase().trim());
      });
      const engineersWithoutTraining = total - engineersWithTraining.length;
      const percentage = total > 0 ? Math.round((engineersWithTraining.length / total) * 100) : 0;
      
      return {
        training: training.replace('Training ', ''),
        trainingFull: training,
        withTraining: engineersWithTraining.length,
        withoutTraining: engineersWithoutTraining,
        percentage: percentage,
        gapPercentage: 100 - percentage
      };
    }).sort((a, b) => {
      // Sort by gap percentage (highest first), then by training name
      if (b.gapPercentage !== a.gapPercentage) {
        return b.gapPercentage - a.gapPercentage;
      }
      return a.training.localeCompare(b.training);
    });
    
    const totalTrainingGaps = trainingGaps.reduce((sum, gap) => sum + gap.withoutTraining, 0);
    const topTrainingGaps = trainingGaps.slice(0, 3); // Top 3 training gaps
    const criticalTrainingGaps = trainingGaps.filter(gap => gap.gapPercentage >= 50); // Training with >50% gap
    
    // Area/Region with most training gaps
    const gapsByArea = {};
    const gapsByRegion = {};
    
    allTrainingTypes.forEach(training => {
      filteredEngineers.forEach(eng => {
        const engTrainings = getEngineerTrainings(eng);
        const hasTraining = engTrainings.some(t => t.toLowerCase().trim() === training.toLowerCase().trim());
        
        if (!hasTraining) {
          const area = eng.area_group || 'Unknown';
          const region = eng.region || 'Unknown';
          
          gapsByArea[area] = (gapsByArea[area] || 0) + 1;
          gapsByRegion[region] = (gapsByRegion[region] || 0) + 1;
        }
      });
    });
    
    const topAreaGap = Object.keys(gapsByArea).length > 0 
      ? Object.entries(gapsByArea).sort((a, b) => b[1] - a[1])[0]
      : null;
    const topRegionGap = Object.keys(gapsByRegion).length > 0
      ? Object.entries(gapsByRegion).sort((a, b) => b[1] - a[1])[0]
      : null;
    
    return { 
      total, 
      withTraining, 
      withoutTraining,
      avgCompletion, 
      overallRate,
      // Total Engineers insights
      byRegion,
      byVendor,
      byExperienceLevel,
      topRegion: topRegion ? { name: topRegion[0], count: topRegion[1] } : null,
      topVendor: topVendor ? { name: topVendor[0], count: topVendor[1] } : null,
      // Avg Completion insights (kept for backward compatibility)
      completionDistribution,
      avgCompletionByRegion,
      // Overall Rate insights
      trainingStats,
      mostCompletedTraining,
      leastCompletedTraining,
      // Training Gaps insights (kept for backward compatibility)
      trainingGaps,
      totalTrainingGaps,
      topTrainingGaps,
      criticalTrainingGaps,
      topAreaGap: topAreaGap ? { name: topAreaGap[0], count: topAreaGap[1] } : null,
      topRegionGap: topRegionGap ? { name: topRegionGap[0], count: topRegionGap[1] } : null,
      totalCompleted,
      totalPossible,
      // Average Resolution Time insights (from SO data)
      avgResolutionTime: soData || null
    };
  }, [filteredEngineers.length, engineersWithTraining, allTrainingTypes.length, filteredEngineers, allTrainingTypes, getEngineerTrainings, soData]);
          
          return (
    <>
      {/* KPI Cards Section */}
      <div className="w-full">
        <EngineerTrainingKPICards 
          summaryStats={summaryStats}
          engineersWithTraining={engineersWithTraining}
          allTrainingTypes={allTrainingTypes}
          setInsightModal={setInsightModal}
        />
      </div>
      
      {/* Training Progress Detail Section */}
      <EngineerTrainingProgress
        filteredEngineers={filteredEngineers}
        engineersWithTraining={engineersWithTraining}
        allTrainingTypes={allTrainingTypes}
        category={category}
        setCategory={setCategory}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        filterOptions={filterOptions}
        engineersWithoutTraining={engineersWithoutTraining}
        showEngineersWithoutTrainingModal={showEngineersWithoutTrainingModal}
        setShowEngineersWithoutTrainingModal={setShowEngineersWithoutTrainingModal}
        modalAreaGroupFilter={modalAreaGroupFilter}
        setModalAreaGroupFilter={setModalAreaGroupFilter}
        modalAreaGroupOptions={modalAreaGroupOptions}
        filteredEngineersInModal={filteredEngineersInModal}
        handleExportToCSV={handleExportToCSV}
        expandedCards={expandedCards}
        toggleCard={toggleCard}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        getStatusColor={getStatusColor}
      />

      {/* Modals Section */}
      <div className="space-y-6">
      {/* Modal: Engineers Without Selected Training */}
      {showEngineersWithoutTrainingModal && category === "TRAINING" && filterValue && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          onClick={() => {
            setShowEngineersWithoutTrainingModal(false);
            setModalAreaGroupFilter("");
          }}
        >
          <div 
            className={cn(
              "relative w-full max-w-4xl max-h-[80vh] rounded-xl border shadow-2xl overflow-hidden",
              isDark
                ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-red-700/30"
                : "bg-white border-red-200"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={cn(
              "flex items-center justify-between p-6 border-b",
              isDark ? "border-red-700/30 bg-red-900/20" : "border-red-200 bg-red-50"
            )}>
              <div className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "p-2 rounded-lg",
                  isDark ? "bg-red-500/20" : "bg-red-100"
                )}>
                  <AlertTriangle 
                    className={cn(
                      isDark ? "text-red-400" : "text-red-600"
                    )} 
                    size={24} 
                    strokeWidth={2.5}
                  />
                </div>
                <div className="flex-1">
                  <h2 className={cn(
                    "text-xl font-bold",
                    isDark ? "text-red-300" : "text-red-900"
                  )}>
                    Engineer yang Belum Mengikuti {filterValue}
                  </h2>
                  <p className={cn(
                    "text-sm mt-1",
                    isDark ? "text-red-400/80" : "text-red-700"
                  )}>
                    {filteredEngineersInModal.length} engineer{modalAreaGroupFilter ? ` (filter: ${modalAreaGroupFilter})` : ''} belum mengikuti training ini
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportToCSV}
                  disabled={filteredEngineersInModal.length === 0}
                  className={cn(
                    "px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium",
                    filteredEngineersInModal.length === 0
                      ? isDark
                        ? "bg-slate-800/30 text-slate-600 cursor-not-allowed"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : isDark
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                  title="Export ke CSV"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              <button
                onClick={() => {
                  setShowEngineersWithoutTrainingModal(false);
                  setModalAreaGroupFilter("");
                }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark
                    ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                )}
              >
                <X size={20} />
              </button>
              </div>
            </div>

            {/* Filter Area Group */}
            <div className={cn(
              "px-6 py-4 border-b",
              isDark ? "border-red-700/30 bg-slate-800/30" : "border-red-200 bg-gray-50"
            )}>
              <div className="flex items-center gap-3">
                <label className={cn(
                  "text-sm font-medium whitespace-nowrap",
                  isDark ? "text-slate-300" : "text-gray-700"
                )}>
                  Filter Area Group:
                </label>
                <div className="flex-1 max-w-[300px]">
                  <SearchableFilter
                    options={modalAreaGroupOptions}
                    value={modalAreaGroupFilter}
                    onChange={(value) => {
                      setModalAreaGroupFilter(value);
                    }}
                    placeholder="Semua Area Group..."
                    searchPlaceholder="Cari area group..."
                    label=""
                    icon={null}
                    showCount={false}
                  />
                </div>
                {modalAreaGroupFilter && (
                  <button
                    onClick={() => setModalAreaGroupFilter("")}
                    className={cn(
                      "px-2 py-1 text-xs rounded-md transition-colors",
                      isDark
                        ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                    )}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Modal Content */}
            <div className={cn(
              "p-6 overflow-y-auto",
              "max-h-[calc(80vh-200px)]",
              "scrollbar-thin",
              isDark ? "scrollbar-thumb-slate-600 scrollbar-track-slate-800/50" : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            )}>
              <div className={cn(
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
              )}>
                {filteredEngineersInModal.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center py-12">
                    <div className={cn(
                      "p-4 rounded-full mb-4",
                      isDark ? "bg-slate-700/50" : "bg-gray-100"
                    )}>
                      <User className={cn(
                        isDark ? "text-slate-400" : "text-gray-400"
                      )} size={32} />
                    </div>
                    <p className={cn(
                      "text-sm font-medium",
                      isDark ? "text-slate-400" : "text-gray-600"
                    )}>
                      {modalAreaGroupFilter 
                        ? `Tidak ada engineer di area group "${modalAreaGroupFilter}" yang belum mengikuti training ini`
                        : "Tidak ada data"}
                    </p>
                  </div>
                ) : (
                  filteredEngineersInModal.map((engineer, idx) => (
                  <div
                    key={engineer.id || `missing-${idx}`}
                    className={cn(
                      "p-4 rounded-lg border transition-all hover:scale-[1.02]",
                      isDark
                        ? "bg-slate-800/50 border-red-700/30 hover:border-red-600/50"
                        : "bg-white border-red-200 hover:border-red-300"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-2 rounded-lg flex-shrink-0",
                        isDark ? "bg-red-500/20" : "bg-red-100"
                      )}>
                        <User className={cn(
                          isDark ? "text-red-400" : "text-red-600"
                        )} size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-semibold truncate mb-1",
                          isDark ? "text-slate-200" : "text-gray-900"
                        )}>
                          {engineer.name || engineer.CEName || 'Unknown'}
                        </p>
                        <div className="space-y-1">
                          {engineer.id && (
                            <p className={cn(
                              "text-xs truncate",
                              isDark ? "text-slate-400" : "text-gray-600"
                            )}>
                              ID: {engineer.id}
                            </p>
                          )}
                        {engineer.area_group && (
                            <div className="flex items-center gap-1">
                              <MapPin className={cn(
                                "flex-shrink-0",
                                isDark ? "text-slate-500" : "text-gray-500"
                              )} size={12} />
                          <p className={cn(
                                "text-xs truncate",
                            isDark ? "text-slate-400" : "text-gray-600"
                          )}>
                            {engineer.area_group}
                          </p>
                            </div>
                        )}
                        {engineer.region && (
                          <p className={cn(
                              "text-xs truncate",
                            isDark ? "text-slate-500" : "text-gray-500"
                          )}>
                            {engineer.region}
                          </p>
                        )}
                          {engineer.vendor && (
                            <div className="flex items-center gap-1">
                              <Briefcase className={cn(
                                "flex-shrink-0",
                                isDark ? "text-slate-500" : "text-gray-500"
                              )} size={12} />
                              <p className={cn(
                                "text-xs truncate",
                                isDark ? "text-slate-400" : "text-gray-600"
                              )}>
                                {engineer.vendor}
                              </p>
                      </div>
                          )}
                          {engineer.years_experience && (
                            <div className="flex items-center gap-1">
                              <Award className={cn(
                                "flex-shrink-0",
                                isDark ? "text-slate-500" : "text-gray-500"
                              )} size={12} />
                              <p className={cn(
                                "text-xs truncate",
                                isDark ? "text-slate-400" : "text-gray-600"
                              )}>
                                {engineer.years_experience}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
            </div>
          </div>
        )}

        {/* Insight Modal */}
        {insightModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            onClick={() => setInsightModal(null)}
          >
            <div 
              className={cn(
                "relative w-full max-w-4xl max-h-[90vh] rounded-xl border shadow-2xl overflow-hidden",
                isDark
                  ? "bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 border-blue-700/30"
                  : "bg-white border-blue-200"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={cn(
                "flex items-center justify-between p-6 border-b",
                isDark 
                  ? (insightModal === 'total-engineers' ? "border-blue-700/30 bg-blue-900/20" :
                     insightModal === 'avg-resolution-time' ? "border-orange-700/30 bg-orange-900/20" :
                     insightModal === 'engineer-customer' ? "border-indigo-700/30 bg-indigo-900/20" :
                     insightModal === 'regional-operations' ? "border-purple-700/30 bg-purple-900/20" :
                     "border-purple-700/30 bg-purple-900/20")
                  : (insightModal === 'total-engineers' ? "border-blue-200 bg-blue-50" :
                     insightModal === 'avg-resolution-time' ? "border-orange-200 bg-orange-50" :
                     insightModal === 'engineer-customer' ? "border-indigo-200 bg-indigo-50" :
                     insightModal === 'regional-operations' ? "border-purple-200 bg-purple-50" :
                     "border-purple-200 bg-purple-50")
              )}>
              <div className="flex items-center gap-3 flex-1">
                <div className={cn(
                  "p-3 rounded-lg",
                  isDark 
                    ? (insightModal === 'total-engineers' ? "bg-blue-500/20" :
                       insightModal === 'avg-resolution-time' ? "bg-orange-500/20" :
                       insightModal === 'engineer-customer' ? "bg-indigo-500/20" :
                       insightModal === 'regional-operations' ? "bg-purple-500/20" :
                       "bg-purple-500/20")
                    : (insightModal === 'total-engineers' ? "bg-blue-100" :
                       insightModal === 'avg-resolution-time' ? "bg-orange-100" :
                       insightModal === 'engineer-customer' ? "bg-indigo-100" :
                       insightModal === 'regional-operations' ? "bg-purple-100" :
                       "bg-purple-100")
                )}>
                  {insightModal === 'total-engineers' && <Users className={cn(isDark ? "text-blue-400" : "text-blue-600")} size={24} />}
                  {insightModal === 'avg-resolution-time' && <Clock className={cn(isDark ? "text-orange-400" : "text-orange-600")} size={24} />}
                  {insightModal === 'engineer-customer' && <Users className={cn(isDark ? "text-indigo-400" : "text-indigo-600")} size={24} />}
                  {insightModal === 'regional-operations' && <Target className={cn(isDark ? "text-purple-400" : "text-purple-600")} size={24} />}
                  {insightModal === 'overall-rate' && <BookOpen className={cn(isDark ? "text-purple-400" : "text-purple-600")} size={24} />}
                </div>
                <div className="flex-1">
                  <h2 className={cn(
                    "text-xl font-bold",
                    isDark 
                      ? (insightModal === 'total-engineers' ? "text-blue-300" :
                         insightModal === 'avg-resolution-time' ? "text-orange-300" :
                         insightModal === 'engineer-customer' ? "text-indigo-300" :
                         insightModal === 'regional-operations' ? "text-purple-300" :
                         "text-purple-300")
                      : (insightModal === 'total-engineers' ? "text-blue-900" :
                         insightModal === 'avg-resolution-time' ? "text-orange-900" :
                         insightModal === 'engineer-customer' ? "text-indigo-900" :
                         insightModal === 'regional-operations' ? "text-purple-900" :
                         "text-purple-900")
                  )}>
                    {insightModal === 'total-engineers' && 'Total Engineers Insight'}
                    {insightModal === 'avg-resolution-time' && 'Average Resolution Time Insight'}
                    {insightModal === 'engineer-customer' && 'Engineer-Customer Relationship Insight'}
                    {insightModal === 'regional-operations' && 'Customer Intelligence Hub Insight'}
                    {insightModal === 'overall-rate' && 'Overall Training Rate Insight'}
                  </h2>
                  <p className={cn(
                    "text-sm mt-1",
                    isDark ? "text-slate-400" : "text-gray-600"
                  )}>
                    Analisis detail dan rekomendasi berdasarkan data engineer
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInsightModal(null)}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDark
                    ? "hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                )}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className={cn(
              "p-6 overflow-y-auto",
              "max-h-[calc(90vh-120px)]",
              isDark ? "scrollbar-thumb-slate-600 scrollbar-track-slate-800/50" : "scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            )}>
              {insightModal === 'total-engineers' && (
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-blue-50 border-blue-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Total Engineers</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{summaryStats.total}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Semua engineer di filter
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-emerald-50 border-emerald-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Sudah Training</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-emerald-400" : "text-emerald-600")}>{summaryStats.withTraining}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Engineer yang sudah training
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-amber-50 border-amber-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Belum Training</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-amber-400" : "text-amber-600")}>{summaryStats.withoutTraining}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Engineer yang belum training
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-purple-50 border-purple-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Coverage</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-purple-400" : "text-purple-600")}>
                        {summaryStats.total > 0 ? Math.round((summaryStats.withTraining / summaryStats.total) * 100) : 0}%
                      </div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Persentase engineer training
                      </div>
                    </div>
                  </div>

                  {/* Region Breakdown */}
                  <div>
                    <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                      <MapPin size={16} /> Distribution by Region
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(summaryStats.byRegion)
                        .sort((a, b) => b[1] - a[1])
                        .map(([region, count]) => {
                          const percentage = (count / summaryStats.total) * 100;
                          return (
                            <div key={region} className="flex items-center gap-3">
                              <span className={cn("text-xs w-24", isDark ? "text-slate-400" : "text-gray-600")}>{region}</span>
                              <div className={cn("flex-1 h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700/30" : "bg-gray-200")}>
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className={cn("text-xs font-bold w-16 text-right", isDark ? "text-blue-300" : "text-blue-600")}>
                                {count} ({Math.round(percentage)}%)
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Vendor Breakdown */}
                  <div>
                    <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                      <Briefcase size={16} /> Distribution by Vendor
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(summaryStats.byVendor)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([vendor, count]) => {
                          const percentage = (count / summaryStats.total) * 100;
                          return (
                            <div key={vendor} className="flex items-center gap-3">
                              <span className={cn("text-xs flex-1 truncate", isDark ? "text-slate-400" : "text-gray-600")}>{vendor}</span>
                              <div className={cn("flex-1 h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700/30" : "bg-gray-200")}>
                                <div 
                                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className={cn("text-xs font-bold w-16 text-right", isDark ? "text-cyan-300" : "text-cyan-600")}>
                                {count} ({Math.round(percentage)}%)
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Experience Level Breakdown */}
                  <div>
                    <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                      <BarChart2 size={16} /> Experience Level Distribution
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { key: 'junior', label: 'Junior (<2 years)', count: summaryStats.byExperienceLevel.junior, color: 'blue' },
                        { key: 'mid', label: 'Mid (2-5 years)', count: summaryStats.byExperienceLevel.mid, color: 'cyan' },
                        { key: 'senior', label: 'Senior (5+ years)', count: summaryStats.byExperienceLevel.senior, color: 'indigo' }
                      ].map(({ key, label, count, color }) => {
                        const percentage = summaryStats.total > 0 ? (count / summaryStats.total) * 100 : 0;
                        return (
                          <div key={key} className={cn(
                            "p-3 rounded-lg border",
                            isDark ? "bg-slate-800/50 border-slate-700" :
                            color === 'blue' ? "bg-blue-50 border-blue-200" :
                            color === 'cyan' ? "bg-cyan-50 border-cyan-200" :
                            "bg-indigo-50 border-indigo-200"
                          )}>
                            <div className={cn("text-xs mb-2", isDark ? "text-slate-400" : "text-gray-600")}>{label}</div>
                            <div className={cn(
                              "text-2xl font-bold mb-2",
                              color === 'blue' ? (isDark ? "text-blue-400" : "text-blue-600") :
                              color === 'cyan' ? (isDark ? "text-cyan-400" : "text-cyan-600") :
                              (isDark ? "text-indigo-400" : "text-indigo-600")
                            )}>{count}</div>
                            <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-slate-700/30" : "bg-gray-200")}>
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  color === 'blue' ? "bg-gradient-to-r from-blue-500 to-blue-400" :
                                  color === 'cyan' ? "bg-gradient-to-r from-cyan-500 to-cyan-400" :
                                  "bg-gradient-to-r from-indigo-500 to-indigo-400"
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <div className={cn("text-xs mt-1", isDark ? "text-slate-500" : "text-gray-500")}>{Math.round(percentage)}%</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Insights & Recommendations */}
                  <div className={cn("p-4 rounded-lg border", isDark ? "bg-blue-500/10 border-blue-500/20" : "bg-blue-50 border-blue-200")}>
                    <h3 className={cn("text-sm font-semibold mb-2 flex items-center gap-2", isDark ? "text-blue-300" : "text-blue-800")}>
                      <Zap size={16} /> Key Insights
                    </h3>
                    <ul className={cn("space-y-1.5 text-xs", isDark ? "text-slate-300" : "text-gray-700")}>
                      <li>• Top region: <span className="font-semibold">{summaryStats.topRegion?.name}</span> dengan {summaryStats.topRegion?.count} engineers</li>
                      <li>• Training coverage: {summaryStats.total > 0 ? Math.round((summaryStats.withTraining / summaryStats.total) * 100) : 0}% dari total engineers</li>
                      {summaryStats.withoutTraining > 0 && (
                        <li>• <span className="font-semibold text-amber-400">{summaryStats.withoutTraining} engineers</span> belum memiliki training - perlu perhatian</li>
                      )}
                      <li>• Distribusi experience: {summaryStats.byExperienceLevel.junior} Junior, {summaryStats.byExperienceLevel.mid} Mid, {summaryStats.byExperienceLevel.senior} Senior</li>
                    </ul>
                  </div>
                </div>
              )}

              {insightModal === 'avg-completion' && (
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-emerald-50 border-emerald-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Average Completion</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-emerald-400" : "text-emerald-600")}>{summaryStats.avgCompletion}%</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Rata-rata completion rate
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-yellow-50 border-yellow-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Perfect (100%)</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-yellow-400" : "text-yellow-600")}>{summaryStats.completionDistribution.excellent}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Engineer dengan 100%
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-blue-50 border-blue-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>High (80-99%)</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{summaryStats.completionDistribution.high}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Engineer dengan 80-99%
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-amber-50 border-amber-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Needs Work</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-amber-400" : "text-amber-600")}>
                        {summaryStats.completionDistribution.medium + summaryStats.completionDistribution.low + summaryStats.completionDistribution.veryLow}
                      </div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Engineer di bawah 80%
                      </div>
                    </div>
                  </div>

                  {/* Performance Distribution */}
                  <div>
                    <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                      <PieChart size={16} /> Performance Distribution
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Excellent (100%)', count: summaryStats.completionDistribution.excellent, color: 'emerald', range: '100%' },
                        { label: 'High (80-99%)', count: summaryStats.completionDistribution.high, color: 'blue', range: '80-99%' },
                        { label: 'Medium (60-79%)', count: summaryStats.completionDistribution.medium, color: 'cyan', range: '60-79%' },
                        { label: 'Low (40-59%)', count: summaryStats.completionDistribution.low, color: 'amber', range: '40-59%' },
                        { label: 'Very Low (<40%)', count: summaryStats.completionDistribution.veryLow, color: 'red', range: '<40%' }
                      ].filter(item => item.count > 0).map(({ label, count, color, range }) => {
                        const totalWithTraining = engineersWithTraining.length;
                        const percentage = totalWithTraining > 0 ? (count / totalWithTraining) * 100 : 0;
                        return (
                          <div key={label} className="flex items-center gap-3">
                            <span className={cn("text-xs w-32", isDark ? "text-slate-400" : "text-gray-600")}>{label}</span>
                            <div className={cn("flex-1 h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700/30" : "bg-gray-200")}>
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  color === 'emerald' ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                                  color === 'blue' ? "bg-gradient-to-r from-blue-500 to-blue-400" :
                                  color === 'cyan' ? "bg-gradient-to-r from-cyan-500 to-cyan-400" :
                                  color === 'amber' ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                                  "bg-gradient-to-r from-red-500 to-red-400"
                                )}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className={cn(
                              "text-xs font-bold w-20 text-right",
                              color === 'emerald' ? (isDark ? "text-emerald-300" : "text-emerald-600") :
                              color === 'blue' ? (isDark ? "text-blue-300" : "text-blue-600") :
                              color === 'cyan' ? (isDark ? "text-cyan-300" : "text-cyan-600") :
                              color === 'amber' ? (isDark ? "text-amber-300" : "text-amber-600") :
                              (isDark ? "text-red-300" : "text-red-600")
                            )}>
                              {count} ({Math.round(percentage)}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Region Performance */}
                  {summaryStats.avgCompletionByRegion && summaryStats.avgCompletionByRegion.length > 0 && (
                    <div>
                      <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                        <TrendingUp size={16} /> Average Completion by Region
                      </h3>
                      <div className="space-y-2">
                        {summaryStats.avgCompletionByRegion.map(({ region, avg }, idx) => {
                          const isAboveAverage = avg > summaryStats.avgCompletion;
                          return (
                            <div key={region} className="flex items-center gap-3">
                              <span className={cn("text-xs w-24", isDark ? "text-slate-400" : "text-gray-600")}>{region}</span>
                              <div className={cn("flex-1 h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700/30" : "bg-gray-200")}>
                                <div 
                                  className={cn(
                                    "h-full rounded-full",
                                    isAboveAverage ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                                    "bg-gradient-to-r from-blue-500 to-blue-400"
                                  )}
                                  style={{ width: `${avg}%` }}
                                />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={cn("text-xs font-bold w-16 text-right", isDark ? "text-emerald-300" : "text-emerald-600")}>
                                  {avg}%
                                </span>
                                {isAboveAverage && <ArrowUp size={12} className="text-emerald-400" />}
                                {!isAboveAverage && avg < summaryStats.avgCompletion && <ArrowDown size={12} className="text-amber-400" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Insights & Recommendations */}
                  <div className={cn("p-4 rounded-lg border", isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200")}>
                    <h3 className={cn("text-sm font-semibold mb-2 flex items-center gap-2", isDark ? "text-emerald-300" : "text-emerald-800")}>
                      <Zap size={16} /> Key Insights
                    </h3>
                    <ul className={cn("space-y-1.5 text-xs", isDark ? "text-slate-300" : "text-gray-700")}>
                      <li>• Average completion rate: <span className="font-semibold">{summaryStats.avgCompletion}%</span></li>
                      {summaryStats.avgCompletionByRegion && summaryStats.avgCompletionByRegion.length > 0 && (
                        <li>• Top performing region: <span className="font-semibold">{summaryStats.avgCompletionByRegion[0].region}</span> dengan {summaryStats.avgCompletionByRegion[0].avg}%</li>
                      )}
                      <li>• <span className="font-semibold text-emerald-400">{summaryStats.completionDistribution.excellent} engineers</span> mencapai 100% completion</li>
                      {summaryStats.completionDistribution.medium + summaryStats.completionDistribution.low + summaryStats.completionDistribution.veryLow > 0 && (
                        <li>• <span className="font-semibold text-amber-400">
                          {summaryStats.completionDistribution.medium + summaryStats.completionDistribution.low + summaryStats.completionDistribution.veryLow} engineers
                        </span> perlu peningkatan training (completion &lt;80%)</li>
                      )}
                      {summaryStats.avgCompletion < 80 && (
                        <li>• Rekomendasi: Fokus pada program training untuk meningkatkan average completion ke target 80%+</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {insightModal === 'avg-resolution-time' && summaryStats.avgResolutionTime && (
                <div className="space-y-5">
                  {/* Header with gradient */}
                  <div className={cn(
                    "relative overflow-hidden rounded-xl p-4 mb-4",
                    isDark 
                      ? "bg-gradient-to-br from-orange-500/20 via-amber-500/15 to-orange-600/20 border border-orange-400/30" 
                      : "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border border-orange-200"
                  )}>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn(
                          "p-2 rounded-lg",
                          isDark ? "bg-orange-500/20 border border-orange-400/30" : "bg-orange-100 border border-orange-200"
                        )}>
                          <Clock className={cn("text-orange-400", isDark ? "text-orange-300" : "text-orange-600")} size={20} />
                        </div>
                        <h2 className={cn(
                          "text-lg font-bold",
                          isDark ? "text-orange-200" : "text-orange-800"
                        )}>
                          Average Response & Repair Time
                        </h2>
                      </div>
                      <div className={cn(
                        "text-xs px-3 py-2 rounded-lg",
                        isDark ? "bg-blue-500/10 border border-blue-500/20 text-blue-300" : "bg-blue-50 border border-blue-200 text-blue-700"
                      )}>
                        <span className="font-semibold">Metode Perhitungan:</span> Weighted Average berdasarkan jumlah SO per engineer. Formula: Σ(avg_time_per_engineer × so_count_per_engineer) / Σ(so_count_per_engineer)
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-400/30 shadow-blue-500/10" 
                        : "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-blue-300" : "text-blue-700")}>
                          <Clock size={12} className="text-blue-400" />
                          Avg Response Time
                        </div>
                        <div className={cn(
                          "text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent",
                          isDark ? "from-blue-300 to-cyan-300" : "from-blue-600 to-cyan-600"
                        )}>
                          {summaryStats.avgResolutionTime.avg_response_time_overall?.toFixed(1) || '0.0'}h
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-cyan-500/20 to-teal-500/10 border-cyan-400/30 shadow-cyan-500/10" 
                        : "bg-gradient-to-br from-cyan-50 to-teal-100 border-cyan-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-cyan-300" : "text-cyan-700")}>
                          <Clock size={12} className="text-cyan-400" />
                          Avg Repair Time
                        </div>
                        <div className={cn(
                          "text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent",
                          isDark ? "from-cyan-300 to-teal-300" : "from-cyan-600 to-teal-600"
                        )}>
                          {summaryStats.avgResolutionTime.avg_repair_time_overall?.toFixed(1) || '0.0'}h
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-orange-500/20 to-amber-500/10 border-orange-400/30 shadow-orange-500/10" 
                        : "bg-gradient-to-br from-orange-50 to-amber-100 border-orange-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-orange-300" : "text-orange-700")}>
                          <Clock size={12} className="text-orange-400" />
                          Avg Resolution Time
                        </div>
                        <div className={cn(
                          "text-3xl font-bold mb-2 bg-gradient-to-r bg-clip-text text-transparent",
                          isDark ? "from-orange-300 to-amber-300" : "from-orange-600 to-amber-600"
                        )}>
                          {summaryStats.avgResolutionTime.avg_resolution_time_overall?.toFixed(1) || '0.0'}h
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-400/30 shadow-emerald-500/10" 
                        : "bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-emerald-300" : "text-emerald-700")}>
                          <Activity size={12} className="text-emerald-400" />
                          Total SO
                        </div>
                        <div className={cn(
                          "text-3xl font-bold mb-2",
                          isDark ? "text-emerald-300" : "text-emerald-600"
                        )}>
                          {summaryStats.avgResolutionTime.total_so || 0}
                        </div>
                        <div className={cn("text-[10px] px-2 py-1 rounded-lg", isDark ? "bg-emerald-500/10 text-emerald-300/80" : "bg-emerald-100 text-emerald-600/80")}>
                          Service Order ditangani
                        </div>
                      </div>
                    </div>
                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border-purple-400/30 shadow-purple-500/10" 
                        : "bg-gradient-to-br from-purple-50 to-indigo-100 border-purple-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-purple-300" : "text-purple-700")}>
                          <Users size={12} className="text-purple-400" />
                          Engineers
                        </div>
                        <div className={cn(
                          "text-3xl font-bold mb-2",
                          isDark ? "text-purple-300" : "text-purple-600"
                        )}>
                          {summaryStats.avgResolutionTime.avg_by_engineer?.length || 0}
                        </div>
                        <div className={cn("text-[10px] px-2 py-1 rounded-lg", isDark ? "bg-purple-500/10 text-purple-300/80" : "bg-purple-100 text-purple-600/80")}>
                          Engineer aktif
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Performers */}
                  {summaryStats.avgResolutionTime.avg_by_engineer && summaryStats.avgResolutionTime.avg_by_engineer.length > 0 && (
                    <div>
                      <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                        <Star size={16} className="text-orange-400" /> Top Performers (Fastest Resolution)
                      </h3>
                      <div className="space-y-2">
                        {summaryStats.avgResolutionTime.avg_by_engineer
                          .slice(0, 10)
                          .map((eng, idx) => {
                            const resolutionTime = eng.avg_resolution_time || 0;
                            const responseTime = eng.avg_response_time || 0;
                            const repairTime = eng.avg_repair_time || 0;
                            const maxTime = summaryStats.avgResolutionTime.avg_by_engineer[summaryStats.avgResolutionTime.avg_by_engineer.length - 1]?.avg_resolution_time || resolutionTime;
                            const minTime = summaryStats.avgResolutionTime.avg_by_engineer[0]?.avg_resolution_time || 0;
                            const range = maxTime - minTime;
                            const relativePercent = range > 0 ? ((maxTime - resolutionTime) / range) * 100 : 100;
                            const isTop = idx < 3;
                            return (
                              <div key={idx} className={cn(
                                "p-3.5 rounded-xl border transition-all duration-300 hover:scale-[1.02]",
                                isTop
                                  ? (isDark 
                                      ? "bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10" 
                                      : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-md")
                                  : (isDark 
                                      ? "bg-gradient-to-br from-slate-800/60 to-slate-700/40 border-slate-600/50 hover:border-orange-500/30" 
                                      : "bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-orange-200")
                              )}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {isTop && <Star size={14} className={cn("flex-shrink-0", isDark ? "text-emerald-400" : "text-emerald-600")} />}
                                    <span className={cn(
                                      "text-sm font-semibold truncate",
                                      isDark ? "text-slate-200" : "text-gray-900"
                                    )} title={eng.engineer}>
                                      {eng.engineer}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={cn(
                                      "text-sm font-bold",
                                      isTop
                                        ? (isDark ? "text-emerald-400" : "text-emerald-600")
                                        : (isDark ? "text-orange-400" : "text-orange-600")
                                    )}>
                                      {resolutionTime.toFixed(1)}h
                                    </span>
                                    <span className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                                      res
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-2 text-xs">
                                  <span className={cn(isDark ? "text-slate-400" : "text-gray-600")}>
                                    Res: <span className="font-bold text-blue-400">{responseTime.toFixed(1)}h</span>
                                  </span>
                                  <span className="text-slate-500">/</span>
                                  <span className={cn(isDark ? "text-slate-400" : "text-gray-600")}>
                                    Rep: <span className="font-bold text-cyan-400">{repairTime.toFixed(1)}h</span>
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className={cn("flex-1 h-2.5 rounded-full overflow-hidden shadow-inner", isDark ? "bg-slate-700/40" : "bg-gray-200")}>
                                    <div 
                                      className={cn(
                                        "h-full rounded-full transition-all duration-500 shadow-sm",
                                        isTop 
                                          ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-lg shadow-emerald-500/30"
                                          : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400"
                                      )}
                                      style={{ width: `${relativePercent}%` }}
                                    />
                                  </div>
                                  <span className={cn(
                                    "text-xs font-bold w-20 text-right",
                                    isTop ? (isDark ? "text-emerald-300" : "text-emerald-600") :
                                    (isDark ? "text-orange-300" : "text-orange-600")
                                  )}>
                                    {eng.count} SO
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* By Month Trend */}
                  {summaryStats.avgResolutionTime.by_month && Object.keys(summaryStats.avgResolutionTime.by_month).length > 0 && (
                    <div>
                      <h3 className={cn("text-sm font-semibold mb-2 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                        <TrendingUp size={16} className="text-orange-400" /> Trend Per Bulan
                      </h3>
                      <p className={cn("text-xs mb-3", isDark ? "text-slate-400" : "text-gray-600")}>
                        Weighted average berdasarkan jumlah SO per engineer per bulan
                      </p>
                      <div className="space-y-2">
                        {Object.entries(summaryStats.avgResolutionTime.by_month)
                          .map(([month, data]) => {
                            const maxResTime = Math.max(...Object.values(summaryStats.avgResolutionTime.by_month).map(d => d.avg_resolution_time || 0));
                            const percent = maxResTime > 0 ? ((data.avg_resolution_time || 0) / maxResTime) * 100 : 0;
                            return (
                              <div key={month} className={cn(
                                "p-2.5 rounded-lg border space-y-2 transition-all duration-300 hover:scale-[1.01]",
                                isDark 
                                  ? "bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30" 
                                  : "bg-white border-gray-200 hover:border-orange-200"
                              )}>
                                <div className="flex items-center gap-3">
                                  <span className={cn("text-xs w-24 font-semibold", isDark ? "text-orange-200" : "text-orange-700")}>{month}</span>
                                  <div className={cn("flex-1 h-3 rounded-full overflow-hidden shadow-inner", isDark ? "bg-slate-700/40" : "bg-gray-200")}>
                                    <div 
                                      className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 rounded-full shadow-sm transition-all duration-500"
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={cn("text-xs font-bold w-16 text-right px-1.5 py-0.5 rounded", isDark ? "text-orange-300 bg-orange-500/10" : "text-orange-600 bg-orange-100")}>
                                      {data.avg_resolution_time?.toFixed(1) || '0'}h
                                    </span>
                                    <span className={cn("text-xs w-12 text-right", isDark ? "text-slate-400" : "text-gray-500")}>
                                      ({data.count} SO)
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 pl-28 text-xs">
                                  <span className={cn("px-1.5 py-0.5 rounded", isDark ? "text-blue-300 bg-blue-500/10" : "text-blue-600 bg-blue-100")}>
                                    Res: <span className="font-bold">{data.avg_response_time?.toFixed(1) || '0'}h</span>
                                  </span>
                                  <span className={cn(isDark ? "text-slate-500" : "text-gray-400")}>/</span>
                                  <span className={cn("px-1.5 py-0.5 rounded", isDark ? "text-cyan-300 bg-cyan-500/10" : "text-cyan-600 bg-cyan-100")}>
                                    Rep: <span className="font-bold">{data.avg_repair_time?.toFixed(1) || '0'}h</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* By Region */}
                  {summaryStats.avgResolutionTime.by_region && Object.keys(summaryStats.avgResolutionTime.by_region).length > 0 && (
                    <div className={cn(
                      "p-4 rounded-xl border",
                      isDark 
                        ? "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50" 
                        : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
                    )}>
                      <h3 className={cn("text-sm font-semibold mb-2 flex items-center gap-2", isDark ? "text-orange-200" : "text-orange-700")}>
                        <div className={cn(
                          "p-1.5 rounded-lg",
                          isDark ? "bg-orange-500/20 border border-orange-400/30" : "bg-orange-100 border border-orange-200"
                        )}>
                          <MapPin size={14} className="text-orange-400" />
                        </div>
                        Performance by Region
                      </h3>
                      <p className={cn("text-xs mb-4 px-1", isDark ? "text-orange-200/80" : "text-orange-600/80")}>
                        Weighted average berdasarkan jumlah SO per engineer per region
                      </p>
                      <div className="space-y-2.5">
                        {Object.entries(summaryStats.avgResolutionTime.by_region)
                          .sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))
                          .map(([region, data]) => {
                            const maxTime = Math.max(...Object.values(summaryStats.avgResolutionTime.by_region).map(d => d.avg_resolution_time || 0));
                            const percent = maxTime > 0 ? ((data.avg_resolution_time || 0) / maxTime) * 100 : 0;
                            const isBest = (data.avg_resolution_time || 0) === Math.min(...Object.values(summaryStats.avgResolutionTime.by_region).map(d => d.avg_resolution_time || 0));
                            return (
                              <div key={region} className={cn(
                                "p-2.5 rounded-lg border space-y-2 transition-all duration-300 hover:scale-[1.01]",
                                isBest
                                  ? (isDark 
                                      ? "bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10" 
                                      : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-md")
                                  : (isDark 
                                      ? "bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30" 
                                      : "bg-white border-gray-200 hover:border-orange-200")
                              )}>
                                <div className="flex items-center gap-3">
                                  <span className={cn("text-xs w-24 truncate font-semibold", isDark ? (isBest ? "text-emerald-200" : "text-orange-200") : (isBest ? "text-emerald-700" : "text-orange-700"))} title={region}>{region}</span>
                                  <div className={cn("flex-1 h-3 rounded-full overflow-hidden shadow-inner", isDark ? "bg-slate-700/40" : "bg-gray-200")}>
                                    <div 
                                      className={cn(
                                        "h-full rounded-full shadow-sm transition-all duration-500",
                                        isBest 
                                          ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-lg shadow-emerald-500/30"
                                          : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400"
                                      )}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {isBest && <Star size={12} className="text-emerald-400" fill="currentColor" />}
                                    <span className={cn(
                                      "text-xs font-bold w-16 text-right px-1.5 py-0.5 rounded",
                                      isBest 
                                        ? (isDark ? "text-emerald-300 bg-emerald-500/10" : "text-emerald-600 bg-emerald-100")
                                        : (isDark ? "text-orange-300 bg-orange-500/10" : "text-orange-600 bg-orange-100")
                                    )}>
                                      {data.avg_resolution_time?.toFixed(1) || '0'}h
                                    </span>
                                    <span className={cn("text-xs w-12 text-right", isDark ? "text-slate-400" : "text-gray-500")}>
                                      ({data.count})
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 pl-28 text-xs">
                                  <span className={cn("px-1.5 py-0.5 rounded", isDark ? "text-blue-300 bg-blue-500/10" : "text-blue-600 bg-blue-100")}>
                                    Res: <span className="font-bold">{data.avg_response_time?.toFixed(1) || '0'}h</span>
                                  </span>
                                  <span className={cn(isDark ? "text-slate-500" : "text-gray-400")}>/</span>
                                  <span className={cn("px-1.5 py-0.5 rounded", isDark ? "text-cyan-300 bg-cyan-500/10" : "text-cyan-600 bg-cyan-100")}>
                                    Rep: <span className="font-bold">{data.avg_repair_time?.toFixed(1) || '0'}h</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                      {/* By Area Group */}
                      {summaryStats.avgResolutionTime.by_area && Object.keys(summaryStats.avgResolutionTime.by_area).length > 0 && (
                        <div className={cn(
                          "p-4 rounded-xl border",
                          isDark 
                            ? "bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50" 
                            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
                        )}>
                          <h3 className={cn("text-sm font-semibold mb-2 flex items-center gap-2", isDark ? "text-orange-200" : "text-orange-700")}>
                            <div className={cn(
                              "p-1.5 rounded-lg",
                              isDark ? "bg-orange-500/20 border border-orange-400/30" : "bg-orange-100 border border-orange-200"
                            )}>
                              <Briefcase size={14} className="text-orange-400" />
                            </div>
                            Top 10 Area Groups (Best Performance)
                          </h3>
                          <p className={cn("text-xs mb-2 px-1", isDark ? "text-orange-200/80" : "text-orange-600/80")}>
                            Weighted average berdasarkan jumlah SO per engineer per area. Ditampilkan area dengan minimal 10 SO untuk perhitungan yang lebih representatif.
                          </p>
                          <p className={cn("text-[10px] mb-4 px-3 py-2 rounded-lg border", isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-700")}>
                            <span className="font-semibold">Catatan:</span> Best Performance = Resolution Time TERCEPAT (efisiensi), bukan jumlah SO terbanyak (volume). Area dengan resolution time lebih kecil berarti lebih efisien dalam menyelesaikan SO.
                          </p>
                          <div className="space-y-2.5">
                            {Object.entries(summaryStats.avgResolutionTime.by_area)
                              .filter(([area, data]) => (data.count || 0) >= 10) // Filter: minimal 10 SO
                              .sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))
                              .slice(0, 10)
                              .map(([area, data], idx) => {
                            // Calculate maxTime only from filtered areas (min 10 SO)
                            const filteredAreas = Object.values(summaryStats.avgResolutionTime.by_area).filter(d => (d.count || 0) >= 10);
                            const maxTime = filteredAreas.length > 0 ? Math.max(...filteredAreas.map(d => d.avg_resolution_time || 0)) : 0;
                            const percent = maxTime > 0 ? ((data.avg_resolution_time || 0) / maxTime) * 100 : 0;
                            const isTop = idx < 3;
                            return (
                              <div key={area} className={cn(
                                "p-2.5 rounded-lg border space-y-2 transition-all duration-300 hover:scale-[1.01]",
                                isTop
                                  ? (isDark 
                                      ? "bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500/40 shadow-lg shadow-emerald-500/10" 
                                      : "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-300 shadow-md")
                                  : (isDark 
                                      ? "bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30" 
                                      : "bg-white border-gray-200 hover:border-orange-200")
                              )}>
                                <div className="flex items-center gap-3">
                                  <span className={cn("text-xs w-24 truncate font-semibold", isDark ? (isTop ? "text-emerald-200" : "text-orange-200") : (isTop ? "text-emerald-700" : "text-orange-700"))} title={area}>{area}</span>
                                  <div className={cn("flex-1 h-3 rounded-full overflow-hidden shadow-inner", isDark ? "bg-slate-700/40" : "bg-gray-200")}>
                                    <div 
                                      className={cn(
                                        "h-full rounded-full shadow-sm transition-all duration-500",
                                        isTop 
                                          ? "bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-300 shadow-lg shadow-emerald-500/30"
                                          : "bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400"
                                      )}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {isTop && <Star size={12} className="text-emerald-400" fill="currentColor" />}
                                    <span className={cn(
                                      "text-xs font-bold w-16 text-right px-1.5 py-0.5 rounded",
                                      isTop 
                                        ? (isDark ? "text-emerald-300 bg-emerald-500/10" : "text-emerald-600 bg-emerald-100")
                                        : (isDark ? "text-orange-300 bg-orange-500/10" : "text-orange-600 bg-orange-100")
                                    )}>
                                      {data.avg_resolution_time?.toFixed(1) || '0'}h
                                    </span>
                                    <span className={cn("text-xs w-12 text-right", isDark ? "text-slate-400" : "text-gray-500")}>
                                      ({data.count})
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 pl-28 text-xs">
                                  <span className={cn("px-1.5 py-0.5 rounded", isDark ? "text-blue-300 bg-blue-500/10" : "text-blue-600 bg-blue-100")}>
                                    Res: <span className="font-bold">{data.avg_response_time?.toFixed(1) || '0'}h</span>
                                  </span>
                                  <span className={cn(isDark ? "text-slate-500" : "text-gray-400")}>/</span>
                                  <span className={cn("px-1.5 py-0.5 rounded", isDark ? "text-cyan-300 bg-cyan-500/10" : "text-cyan-600 bg-cyan-100")}>
                                    Rep: <span className="font-bold">{data.avg_repair_time?.toFixed(1) || '0'}h</span>
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Insights & Recommendations */}
                  <div className={cn(
                    "p-5 rounded-xl border relative overflow-hidden",
                    isDark 
                      ? "bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-orange-600/15 border-orange-500/30 shadow-lg shadow-orange-500/10" 
                      : "bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 border-orange-200 shadow-md"
                  )}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl" />
                    <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2 relative z-10", isDark ? "text-orange-200" : "text-orange-800")}>
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        isDark ? "bg-orange-500/20 border border-orange-400/30" : "bg-orange-100 border border-orange-200"
                      )}>
                        <Zap size={14} className="text-orange-400" />
                      </div>
                      Key Insights & Recommendations
                    </h3>
                    <ul className={cn("space-y-1.5 text-xs", isDark ? "text-slate-300" : "text-gray-700")}>
                      <li>• Rata-rata <span className="font-semibold">weighted average</span> (berdasarkan jumlah SO per engineer) untuk periode April-September: Response time <span className="font-semibold text-blue-400">{summaryStats.avgResolutionTime.avg_response_time_overall?.toFixed(1) || '0.0'} jam</span>, Repair time <span className="font-semibold text-cyan-400">{summaryStats.avgResolutionTime.avg_repair_time_overall?.toFixed(1) || '0.0'} jam</span>, Resolution time <span className="font-semibold text-orange-400">{summaryStats.avgResolutionTime.avg_resolution_time_overall?.toFixed(1) || '0.0'} jam</span></li>
                      <li>• <span className="font-semibold">Metode Perhitungan:</span> Weighted Average = Σ(avg_time_per_engineer × so_count_per_engineer) / Σ(so_count_per_engineer). Engineer dengan lebih banyak SO memberikan kontribusi lebih besar ke rata-rata keseluruhan, sehingga perhitungan lebih representatif untuk operasional.</li>
                      <li>• <span className="font-semibold">Konsistensi:</span> Perhitungan menggunakan metode yang sama untuk overall, by month, by region, dan by area. Semua menggunakan weighted average berdasarkan jumlah SO per engineer dalam grup tersebut.</li>
                      <li>• Total <span className="font-semibold text-emerald-400">{summaryStats.avgResolutionTime.total_so || 0} Service Order</span> telah ditangani oleh <span className="font-semibold text-purple-400">{summaryStats.avgResolutionTime.avg_by_engineer?.length || 0} engineers</span></li>
                      {summaryStats.avgResolutionTime.avg_by_engineer && summaryStats.avgResolutionTime.avg_by_engineer.length > 0 && (
                        <li>• Top performer: <span className="font-semibold text-emerald-400">{summaryStats.avgResolutionTime.avg_by_engineer[0].engineer}</span> dengan rata-rata resolution {summaryStats.avgResolutionTime.avg_by_engineer[0].avg_resolution_time?.toFixed(1) || '0'} jam (Res: {summaryStats.avgResolutionTime.avg_by_engineer[0].avg_response_time?.toFixed(1) || '0'}h / Rep: {summaryStats.avgResolutionTime.avg_by_engineer[0].avg_repair_time?.toFixed(1) || '0'}h) - <span className="font-semibold text-blue-400">{summaryStats.avgResolutionTime.avg_by_engineer[0].count} SO</span></li>
                      )}
                      {summaryStats.avgResolutionTime.avg_by_engineer && summaryStats.avgResolutionTime.avg_by_engineer.length >= 3 && (
                        <li>• Top 3 performers: <span className="font-semibold text-emerald-400">
                          {summaryStats.avgResolutionTime.avg_by_engineer.slice(0, 3).map(e => `${e.engineer} (${e.count} SO)`).join(', ')}
                        </span> dengan rata-rata resolution time tercepat</li>
                      )}
                      {summaryStats.avgResolutionTime.by_region && Object.keys(summaryStats.avgResolutionTime.by_region).length > 0 && (
                        <li>• Best region: <span className="font-semibold text-emerald-400">
                          {Object.entries(summaryStats.avgResolutionTime.by_region).sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))[0][0]}
                        </span> dengan rata-rata resolution <span className="font-semibold text-orange-400">{Object.entries(summaryStats.avgResolutionTime.by_region).sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))[0][1].avg_resolution_time?.toFixed(1) || '0'} jam</span> (<span className="font-semibold text-blue-400">{Object.entries(summaryStats.avgResolutionTime.by_region).sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))[0][1].count} SO</span>) - weighted average</li>
                      )}
                      {summaryStats.avgResolutionTime.by_area && Object.keys(summaryStats.avgResolutionTime.by_area).length > 0 && (() => {
                        // Filter area with minimal 10 SO for "Best area"
                        const filteredAreas = Object.entries(summaryStats.avgResolutionTime.by_area)
                          .filter(([area, data]) => (data.count || 0) >= 10);
                        if (filteredAreas.length === 0) return null;
                        const bestArea = filteredAreas.sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))[0];
                        
                        // Get Jakarta 3 and Tangerang for comparison
                        const jakarta3 = filteredAreas.find(([area]) => area === 'Jakarta 3');
                        const tangerang = filteredAreas.find(([area]) => area === 'Tangerang');
                        
                        return (
                          <>
                            <li>• <span className="font-semibold">Best area:</span> <span className="font-semibold text-emerald-400">{bestArea[0]}</span> dengan rata-rata resolution <span className="font-semibold text-orange-400">{bestArea[1].avg_resolution_time?.toFixed(1) || '0'} jam</span> (<span className="font-semibold text-blue-400">{bestArea[1].count} SO</span>) - <span className="font-semibold">resolution time tercepat</span> (bukan berdasarkan jumlah SO terbanyak)</li>
                            {jakarta3 && jakarta3[0] !== bestArea[0] && (
                              <li className="ml-4">→ <span className="font-semibold">{jakarta3[0]}</span>: {jakarta3[1].avg_resolution_time?.toFixed(1) || '0'} jam ({jakarta3[1].count} SO) - lebih banyak SO tapi resolution time lebih lambat {Math.abs((jakarta3[1].avg_resolution_time || 0) - (bestArea[1].avg_resolution_time || 0)).toFixed(1)} jam</li>
                            )}
                            {tangerang && tangerang[0] !== bestArea[0] && (
                              <li className="ml-4">→ <span className="font-semibold">{tangerang[0]}</span>: {tangerang[1].avg_resolution_time?.toFixed(1) || '0'} jam ({tangerang[1].count} SO) - lebih banyak SO tapi resolution time lebih lambat {Math.abs((tangerang[1].avg_resolution_time || 0) - (bestArea[1].avg_resolution_time || 0)).toFixed(1)} jam</li>
                            )}
                            <li className="text-[10px] mt-1.5 opacity-80">* Best area ditentukan berdasarkan resolution time tercepat (efisiensi), bukan jumlah SO terbanyak (volume). Ditampilkan area dengan minimal 10 SO untuk perhitungan yang lebih representatif.</li>
                          </>
                        );
                      })()}
                      {summaryStats.avgResolutionTime.by_month && Object.keys(summaryStats.avgResolutionTime.by_month).length > 0 && (
                        <li>• <span className="font-semibold">Trend bulanan:</span> Menunjukkan variasi performa antar bulan (weighted average per bulan). Bulan terbaik: <span className="font-semibold text-emerald-400">
                          {Object.entries(summaryStats.avgResolutionTime.by_month).sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))[0][0]}
                        </span> dengan rata-rata resolution <span className="font-semibold text-orange-400">{Object.entries(summaryStats.avgResolutionTime.by_month).sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))[0][1].avg_resolution_time?.toFixed(1) || '0'} jam</span> (<span className="font-semibold text-blue-400">{Object.entries(summaryStats.avgResolutionTime.by_month).sort((a, b) => (a[1].avg_resolution_time || 0) - (b[1].avg_resolution_time || 0))[0][1].count} SO</span>)</li>
                      )}
                      {summaryStats.avgResolutionTime.by_month && Object.keys(summaryStats.avgResolutionTime.by_month).length > 0 && (
                        <li>• <span className="font-semibold">Rekomendasi:</span> Fokus pada bulan/region/area dengan resolution time tertinggi untuk analisis lebih lanjut. Semua perhitungan menggunakan weighted average - engineer dengan lebih banyak SO dalam periode/region/area tersebut memiliki bobot lebih besar, sehingga hasil lebih representatif untuk operasional keseluruhan.</li>
                      )}
                    </ul>
                  </div>
                </div>
              )}

              {insightModal === 'engineer-customer' && relationshipData && (
                <div className="space-y-5">
                  {/* Header with gradient */}
                  <div className={cn(
                    "p-6 rounded-xl border relative overflow-hidden",
                    isDark 
                      ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-400/30" 
                      : "bg-gradient-to-br from-indigo-50 to-purple-100 border-indigo-200"
                  )}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/10 rounded-full blur-3xl" />
                    <div className="relative z-10">
                      <h3 className={cn("text-lg font-bold mb-2", isDark ? "text-indigo-300" : "text-indigo-900")}>
                        🤝 Engineer-Customer Relationship Analysis
                      </h3>
                      <p className={cn("text-sm", isDark ? "text-slate-400" : "text-gray-600")}>
                        Analisis mendalam tentang hubungan engineer dengan customer, coverage, dan risk assessment untuk optimasi resource allocation
                      </p>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border-blue-400/30 shadow-blue-500/10" 
                        : "bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-blue-300" : "text-blue-700")}>
                          <Users size={12} className="text-blue-400" />
                          Total Engineers
                        </div>
                        <div className={cn("text-3xl font-bold mb-2", isDark ? "text-blue-300" : "text-blue-600")}>
                          {relationshipData.total_engineers}
                        </div>
                        <div className={cn("text-[10px] px-2 py-1 rounded-lg", isDark ? "bg-blue-500/10 text-blue-300/80" : "bg-blue-100 text-blue-600/80")}>
                          Active engineers
                        </div>
                      </div>
                    </div>

                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-purple-500/20 to-pink-500/10 border-purple-400/30 shadow-purple-500/10" 
                        : "bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-purple-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-purple-300" : "text-purple-700")}>
                          <Briefcase size={12} className="text-purple-400" />
                          Total Customers
                        </div>
                        <div className={cn("text-3xl font-bold mb-2", isDark ? "text-purple-300" : "text-purple-600")}>
                          {relationshipData.total_customers}
                        </div>
                        <div className={cn("text-[10px] px-2 py-1 rounded-lg", isDark ? "bg-purple-500/10 text-purple-300/80" : "bg-purple-100 text-purple-600/80")}>
                          Unique customers
                        </div>
                      </div>
                    </div>

                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-400/30 shadow-emerald-500/10" 
                        : "bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-emerald-300" : "text-emerald-700")}>
                          <Activity size={12} className="text-emerald-400" />
                          Total SO
                        </div>
                        <div className={cn("text-3xl font-bold mb-2", isDark ? "text-emerald-300" : "text-emerald-600")}>
                          {relationshipData.total_so.toLocaleString()}
                        </div>
                        <div className={cn("text-[10px] px-2 py-1 rounded-lg", isDark ? "bg-emerald-500/10 text-emerald-300/80" : "bg-emerald-100 text-emerald-600/80")}>
                          Service orders
                        </div>
                      </div>
                    </div>

                    <div className={cn(
                      "p-4 rounded-xl border relative overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-lg",
                      isDark 
                        ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-400/30 shadow-amber-500/10" 
                        : "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 shadow-md"
                    )}>
                      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-2xl" />
                      <div className="relative z-10">
                        <div className={cn("text-xs mb-2 font-semibold flex items-center gap-1.5", isDark ? "text-amber-300" : "text-amber-700")}>
                          <Target size={12} className="text-amber-400" />
                          Avg Coverage
                        </div>
                        <div className={cn("text-3xl font-bold mb-2", isDark ? "text-amber-300" : "text-amber-600")}>
                          {relationshipData.coverage_stats.avg_customers_per_engineer}
                        </div>
                        <div className={cn("text-[10px] px-2 py-1 rounded-lg", isDark ? "bg-amber-500/10 text-amber-300/80" : "bg-amber-100 text-amber-600/80")}>
                          Customers/Engineer
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Partnerships */}
                  <div className={cn(
                    "p-5 rounded-xl border",
                    isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"
                  )}>
                    <div className="flex items-center gap-2 mb-4">
                      <Award className={cn(isDark ? "text-yellow-400" : "text-yellow-600")} size={20} />
                      <h4 className={cn("text-base font-bold", isDark ? "text-slate-200" : "text-gray-900")}>
                        🏆 Top 10 Engineer-Customer Partnerships
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {relationshipData.top_pairs
                        .filter(pair => pair.engineer && pair.engineer.trim() !== '')
                        .map((pair, idx) => (
                        <div 
                          key={idx}
                          className={cn(
                            "p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02]",
                            isDark ? "bg-slate-700/30 border-slate-600/30" : "bg-gray-50 border-gray-200",
                            idx < 3 && "ring-1",
                            idx === 0 && (isDark ? "ring-yellow-400/30" : "ring-yellow-300"),
                            idx === 1 && (isDark ? "ring-gray-400/30" : "ring-gray-300"),
                            idx === 2 && (isDark ? "ring-orange-400/30" : "ring-orange-300")
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-base shrink-0">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                              </span>
                              <div className="flex-1 min-w-0">
                                <div className={cn("text-xs font-semibold truncate", isDark ? "text-slate-200" : "text-gray-900")}>
                                  {pair.engineer || 'Unknown Engineer'}
                                </div>
                                <div className={cn("text-[10px] truncate flex items-center gap-1", isDark ? "text-slate-400" : "text-gray-600")}>
                                  <span>→</span>
                                  <span className="font-medium">{pair.customer}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className={cn("text-sm font-bold", isDark ? "text-indigo-400" : "text-indigo-600")}>
                                {pair.so_count}
                              </div>
                              <div className={cn("text-[10px]", isDark ? "text-slate-500" : "text-gray-500")}>
                                SO
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coverage Analysis */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Top Diverse Engineers */}
                    <div className={cn(
                      "p-5 rounded-xl border",
                      isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"
                    )}>
                      <div className="flex items-center gap-2 mb-4">
                        <Zap className={cn(isDark ? "text-blue-400" : "text-blue-600")} size={18} />
                        <h4 className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-gray-900")}>
                          ⚡ Most Diverse Engineers
                        </h4>
                      </div>
                      <div className="space-y-2">
                        {relationshipData.top_diverse_engineers.slice(0, 5).map((eng, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg",
                              isDark ? "bg-slate-700/30" : "bg-gray-50"
                            )}
                          >
                            <span className={cn("text-xs font-medium truncate flex-1", isDark ? "text-slate-300" : "text-gray-700")}>
                              {eng.engineer}
                            </span>
                            <span className={cn("text-xs font-bold px-2 py-1 rounded-md", isDark ? "bg-blue-500/20 text-blue-300" : "bg-blue-100 text-blue-600")}>
                              {eng.customer_count} customers
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Top Covered Customers */}
                    <div className={cn(
                      "p-5 rounded-xl border",
                      isDark ? "bg-slate-800/50 border-slate-700" : "bg-white border-gray-200"
                    )}>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className={cn(isDark ? "text-emerald-400" : "text-emerald-600")} size={18} />
                        <h4 className={cn("text-sm font-bold", isDark ? "text-slate-200" : "text-gray-900")}>
                          🛡️ Major Customers (Best Coverage)
                        </h4>
                      </div>
                      <p className={cn("text-[10px] mb-3", isDark ? "text-slate-400" : "text-gray-600")}>
                        Customers dengan engineer coverage terluas - strategic accounts
                      </p>
                      <div className="space-y-2">
                        {relationshipData.top_covered_customers.slice(0, 5).map((cust, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "flex items-center justify-between p-2 rounded-lg",
                              isDark ? "bg-slate-700/30" : "bg-gray-50"
                            )}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={cn("text-xs font-medium truncate", isDark ? "text-slate-300" : "text-gray-700")}>
                                {cust.customer}
                              </span>
                              {cust.engineer_count > 300 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                                  VIP
                                </span>
                              )}
                            </div>
                            <span className={cn("text-xs font-bold px-2 py-1 rounded-md", isDark ? "bg-emerald-500/20 text-emerald-300" : "bg-emerald-100 text-emerald-600")}>
                              {cust.engineer_count}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className={cn("mt-3 pt-3 border-t text-[10px]", isDark ? "border-slate-700 text-slate-400" : "border-gray-200 text-gray-600")}>
                        💡 High coverage = excellent redundancy & no single point of failure
                      </div>
                    </div>
                  </div>

                  {/* Risk Analysis */}
                  {relationshipData.risk_analysis.risk_count > 0 && (
                    <div className={cn(
                      "p-5 rounded-xl border",
                      isDark ? "bg-yellow-500/10 border-yellow-400/30" : "bg-yellow-50 border-yellow-200"
                    )}>
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className={cn(isDark ? "text-yellow-400" : "text-yellow-600")} size={20} />
                        <h4 className={cn("text-base font-bold", isDark ? "text-yellow-300" : "text-yellow-900")}>
                          ⚠️ Risk Alert: Single Point of Failure
                        </h4>
                      </div>
                      <p className={cn("text-sm mb-4", isDark ? "text-slate-300" : "text-gray-700")}>
                        {relationshipData.risk_analysis.risk_count} customers hanya memiliki 1 engineer. Ini adalah single point of failure yang perlu segera ditangani.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {relationshipData.risk_analysis.single_engineer_customers.map((item, idx) => (
                          <div 
                            key={idx}
                            className={cn(
                              "p-3 rounded-lg border",
                              isDark ? "bg-slate-800/50 border-yellow-400/20" : "bg-white border-yellow-200"
                            )}
                          >
                            <div className={cn("text-xs font-semibold mb-1", isDark ? "text-yellow-300" : "text-yellow-700")}>
                              {item.customer}
                            </div>
                            <div className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                              Only: {item.engineer} ({item.so_count} SO)
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Insights & Recommendations */}
                  <div className={cn(
                    "p-5 rounded-xl border",
                    isDark ? "bg-indigo-500/10 border-indigo-400/30" : "bg-indigo-50 border-indigo-200"
                  )}>
                    <div className="flex items-center gap-2 mb-4">
                      <Target className={cn(isDark ? "text-indigo-400" : "text-indigo-600")} size={20} />
                      <h4 className={cn("text-base font-bold", isDark ? "text-indigo-300" : "text-indigo-900")}>
                        💡 Key Insights & Recommendations
                      </h4>
                    </div>
                    <ul className={cn("space-y-3 text-sm", isDark ? "text-slate-300" : "text-gray-700")}>
                      <li>• <span className="font-semibold">Coverage Balance:</span> Rata-rata {relationshipData.coverage_stats.avg_customers_per_engineer} customers per engineer dan {relationshipData.coverage_stats.avg_engineers_per_customer} engineers per customer. Ini menunjukkan distribusi workload yang {relationshipData.coverage_stats.avg_customers_per_engineer > 5 ? 'perlu dioptimasi' : 'cukup baik'}.</li>
                      
                      <li>• <span className="font-semibold">Top Performer:</span> {relationshipData.top_diverse_engineers[0]?.engineer} adalah engineer paling versatile dengan {relationshipData.top_diverse_engineers[0]?.customer_count} customers. Engineer ini bisa menjadi mentor untuk knowledge transfer.</li>
                      
                      <li>• <span className="font-semibold">Customer Loyalty:</span> {relationshipData.top_pairs[0]?.customer} memiliki partnership terkuat dengan {relationshipData.top_pairs[0]?.engineer} ({relationshipData.top_pairs[0]?.so_count} SO). Pertahankan relationship ini untuk customer satisfaction.</li>
                      
                      {relationshipData.risk_analysis.risk_count > 0 && (
                        <li>• <span className="font-semibold text-yellow-400">⚠️ Action Required:</span> {relationshipData.risk_analysis.risk_count} customers dengan single engineer perlu segera di-assign backup engineer untuk mitigasi risk. Prioritaskan customers dengan SO volume tinggi.</li>
                      )}
                      
                      <li>• <span className="font-semibold">Resource Optimization:</span> Engineer dengan customer count rendah bisa di-assign ke customers yang memiliki banyak engineers untuk load balancing. Sebaliknya, engineer dengan customer count tinggi perlu di-review workload-nya.</li>
                      
                      <li>• <span className="font-semibold">Account Management:</span> Pertimbangkan untuk assign dedicated account managers untuk top customers ({relationshipData.top_covered_customers.slice(0, 3).map(c => c.customer).join(', ')}) yang sudah memiliki engineer coverage baik.</li>
                    </ul>
                  </div>
                </div>
              )}

              {insightModal === 'overall-rate' && (
                <div className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-purple-50 border-purple-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Overall Rate</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-purple-400" : "text-purple-600")}>{summaryStats.overallRate}%</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Coverage training programs
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-emerald-50 border-emerald-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Total Completed</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-emerald-400" : "text-emerald-600")}>{summaryStats.totalCompleted}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Training yang sudah diselesaikan
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Total Possible</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-slate-300" : "text-slate-600")}>{summaryStats.totalPossible}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        {engineersWithTraining.length} engineers × {allTrainingTypes.length} programs
                      </div>
                      <div className={cn("text-[10px] mt-0.5", isDark ? "text-slate-500" : "text-gray-500")}>
                        Maksimum jika semua selesai
                      </div>
                    </div>
                    <div className={cn("p-3 rounded-lg border", isDark ? "bg-slate-800/50 border-slate-700" : "bg-blue-50 border-blue-200")}>
                      <div className={cn("text-xs mb-1", isDark ? "text-slate-400" : "text-gray-600")}>Training Programs</div>
                      <div className={cn("text-2xl font-bold", isDark ? "text-blue-400" : "text-blue-600")}>{allTrainingTypes.length}</div>
                      <div className={cn("text-[10px] mt-1", isDark ? "text-slate-500" : "text-gray-500")}>
                        Jumlah program training
                      </div>
                    </div>
                  </div>

                  {/* Training Programs Breakdown */}
                  <div>
                    <h3 className={cn("text-sm font-semibold mb-3 flex items-center gap-2", isDark ? "text-slate-300" : "text-gray-800")}>
                      <BarChart2 size={16} /> Training Programs Completion
                    </h3>
                    <div className="space-y-2">
                      {summaryStats.trainingStats.map((stat, idx) => {
                        const isTop = idx === 0;
                        const isLow = idx === summaryStats.trainingStats.length - 1 && stat.percentage < summaryStats.mostCompletedTraining.percentage;
                        return (
                          <div key={idx} className="flex items-center gap-3">
                            <span className={cn("text-xs flex-1 truncate", isDark ? "text-slate-400" : "text-gray-600")} title={stat.training}>
                              {stat.training}
                            </span>
                            <div className={cn("flex-1 h-3 rounded-full overflow-hidden", isDark ? "bg-slate-700/30" : "bg-gray-200")}>
                              <div 
                                className={cn(
                                  "h-full rounded-full",
                                  isTop ? "bg-gradient-to-r from-emerald-500 to-emerald-400" :
                                  isLow ? "bg-gradient-to-r from-amber-500 to-amber-400" :
                                  "bg-gradient-to-r from-purple-500 to-purple-400"
                                )}
                                style={{ width: `${stat.percentage}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs font-bold w-16 text-right",
                                isTop ? (isDark ? "text-emerald-300" : "text-emerald-600") :
                                isLow ? (isDark ? "text-amber-300" : "text-amber-600") :
                                (isDark ? "text-purple-300" : "text-purple-600")
                              )}>
                                {stat.percentage}%
                              </span>
                              {isTop && <Award size={12} className="text-emerald-400" />}
                              {isLow && <AlertTriangle size={12} className="text-amber-400" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top & Bottom Training */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {summaryStats.mostCompletedTraining && (
                      <div className={cn("p-4 rounded-lg border", isDark ? "bg-emerald-500/10 border-emerald-500/20" : "bg-emerald-50 border-emerald-200")}>
                        <div className="flex items-center gap-2 mb-2">
                          <Award size={16} className="text-emerald-400" />
                          <h4 className={cn("text-sm font-semibold", isDark ? "text-emerald-300" : "text-emerald-800")}>Top Training</h4>
                        </div>
                        <div className={cn("text-lg font-bold mb-2", isDark ? "text-emerald-300" : "text-emerald-600")}>
                          {summaryStats.mostCompletedTraining.training}
                        </div>
                        <div className={cn("text-2xl font-bold mb-2", isDark ? "text-emerald-400" : "text-emerald-600")}>
                          {summaryStats.mostCompletedTraining.percentage}%
                        </div>
                        <div className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                          {summaryStats.mostCompletedTraining.count} engineers completed
                        </div>
                      </div>
                    )}
                    {summaryStats.leastCompletedTraining && summaryStats.mostCompletedTraining && summaryStats.leastCompletedTraining.percentage < summaryStats.mostCompletedTraining.percentage && (
                      <div className={cn("p-4 rounded-lg border", isDark ? "bg-amber-500/10 border-amber-500/20" : "bg-amber-50 border-amber-200")}>
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle size={16} className="text-amber-400" />
                          <h4 className={cn("text-sm font-semibold", isDark ? "text-amber-300" : "text-amber-800")}>Needs Focus</h4>
                        </div>
                        <div className="space-y-2">
                          {summaryStats.trainingStats
                            .filter(stat => stat.percentage === summaryStats.leastCompletedTraining.percentage)
                            .sort((a, b) => a.training.localeCompare(b.training))
                            .map((stat, idx) => (
                              <div key={idx} className={cn("p-3 rounded border", isDark ? "bg-slate-800/50 border-slate-700/50" : "bg-white/50 border-amber-200/50")}>
                                <div className={cn("text-sm mb-1 font-semibold", isDark ? "text-slate-300" : "text-gray-700")}>
                                  {stat.training}
                                </div>
                                <div className={cn("text-xl font-bold mb-1", isDark ? "text-amber-400" : "text-amber-600")}>
                                  {stat.percentage}%
                                </div>
                                <div className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                                  {stat.count} engineers completed
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className={cn("text-xs mt-3 font-semibold", isDark ? "text-amber-300" : "text-amber-600")}>
                          Gap: {summaryStats.mostCompletedTraining.percentage - summaryStats.leastCompletedTraining.percentage}%
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Insights & Recommendations */}
                  <div className={cn("p-4 rounded-lg border", isDark ? "bg-purple-500/10 border-purple-500/20" : "bg-purple-50 border-purple-200")}>
                    <h3 className={cn("text-sm font-semibold mb-2 flex items-center gap-2", isDark ? "text-purple-300" : "text-purple-800")}>
                      <Zap size={16} /> Key Insights
                    </h3>
                    <ul className={cn("space-y-1.5 text-xs", isDark ? "text-slate-300" : "text-gray-700")}>
                      <li>• Overall training rate: <span className="font-semibold">{summaryStats.overallRate}%</span> dari total possible training</li>
                      <li>• <span className="font-semibold">{summaryStats.totalCompleted}</span> training completed dari <span className="font-semibold">{summaryStats.totalPossible}</span> total possible</li>
                      {summaryStats.mostCompletedTraining && (
                        <li>• Training terbaik: <span className="font-semibold text-emerald-400">{summaryStats.mostCompletedTraining.training}</span> dengan {summaryStats.mostCompletedTraining.percentage}% completion</li>
                      )}
                      {summaryStats.leastCompletedTraining && summaryStats.mostCompletedTraining && summaryStats.leastCompletedTraining.percentage < summaryStats.mostCompletedTraining.percentage && (
                        <li>• Training yang perlu fokus: <span className="font-semibold text-amber-400">{summaryStats.leastCompletedTraining.training}</span> dengan {summaryStats.leastCompletedTraining.percentage}% completion</li>
                      )}
                      {summaryStats.overallRate < 80 && (
                        <li>• Rekomendasi: Tingkatkan program training untuk mencapai target 80%+ overall rate</li>
                      )}
                    </ul>
                  </div>

                  {/* Bottom Insight - Match Top Customer Card */}
                  <div className={cn("mt-3 pt-3 border-t flex-shrink-0", isDark ? "border-slate-700/50" : "border-gray-200")}>
                    <div className={cn("text-xs", isDark ? "text-slate-400" : "text-gray-600")}>
                      💡 <span className={cn("font-semibold", isDark ? "text-slate-300" : "text-gray-800")}>
                        {summaryStats.withTraining} engineers</span> telah menyelesaikan training dari {summaryStats.total} total engineers
                    </div>
                  </div>
                </div>
              )}

              {/* Regional Operations Insight - DISABLED
              {insightModal === 'regional-operations' && (
                <RegionalOperationsInsight 
                  summaryStats={summaryStats} 
                  isDark={isDark} 
                />
              )}
              */}
            </div>
          </div>
        </div>
      )}
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(0); }
          100% { transform: translateX(200%) translateY(0); }
        }
        
        @keyframes progressShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
    </>
  );
};

export default EngineerTrainingDetail;






