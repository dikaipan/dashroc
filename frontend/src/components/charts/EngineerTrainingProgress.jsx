// src/components/charts/EngineerTrainingProgress.jsx
// Training Progress Detail Section - Separated Component
import React, { useMemo, startTransition } from 'react';
import { User, MapPin, Briefcase, Award, CheckCircle, Circle, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, AlertTriangle } from 'react-feather';
import { cn } from '../../constants/styles';
import SearchableFilter from '../ui/SearchableFilter';
import { useTheme } from '../../contexts/ThemeContext';

const EngineerTrainingProgress = ({
  filteredEngineers = [],
  engineersWithTraining = [],
  allTrainingTypes = [],
  category = "REGION",
  setCategory = () => {},
  filterValue = "",
  setFilterValue = () => {},
  filterOptions = [],
  engineersWithoutTraining = [],
  showEngineersWithoutTrainingModal = false,
  setShowEngineersWithoutTrainingModal = () => {},
  modalAreaGroupFilter = "",
  setModalAreaGroupFilter = () => {},
  modalAreaGroupOptions = [],
  filteredEngineersInModal = [],
  handleExportToCSV = () => {},
  expandedCards = new Set(),
  toggleCard = () => {},
  currentPage = 1,
  setCurrentPage = () => {},
  itemsPerPage = 10,
  getStatusColor = () => {}
}) => {
  const { isDark } = useTheme();

  // Sort engineers by completion rate (descending), then by name (ascending)
  // This ensures engineers are always displayed in a consistent, predictable order
  const sortedEngineers = useMemo(() => {
    // Use engineersWithTraining if available (it has completionRate calculated)
    // Otherwise fall back to filteredEngineers
    const sourceArray = (Array.isArray(engineersWithTraining) && engineersWithTraining.length > 0)
      ? engineersWithTraining
      : (Array.isArray(filteredEngineers) && filteredEngineers.length > 0)
        ? filteredEngineers
        : [];

    if (sourceArray.length === 0) {
      return [];
    }

    // Create a new array to avoid mutating the original
    const sorted = sourceArray.map((eng, index) => ({
      ...eng,
      _originalIndex: index // Preserve original index for stable sort
    }));

    // Sort by completion rate (descending), then by name (ascending)
    sorted.sort((a, b) => {
      // Extract completion rate - prioritize existing completionRate property
      const getCompletionRate = (engineer) => {
        // First try: use existing completionRate
        if (typeof engineer.completionRate === 'number' && !isNaN(engineer.completionRate)) {
          return engineer.completionRate;
        }
        
        // Second try: calculate from completedCount and totalTrainings
        if (typeof engineer.completedCount === 'number' && 
            typeof engineer.totalTrainings === 'number' && 
            engineer.totalTrainings > 0) {
          return Math.round((engineer.completedCount / engineer.totalTrainings) * 100);
        }
        
        // Third try: calculate from allSkills array length
        if (Array.isArray(engineer.allSkills) && allTrainingTypes.length > 0) {
          return Math.round((engineer.allSkills.length / allTrainingTypes.length) * 100);
        }
        
        // Fallback: return 0
        return 0;
      };

      const aRate = getCompletionRate(a);
      const bRate = getCompletionRate(b);

      // Primary sort: completion rate (descending - highest first)
      if (bRate !== aRate) {
        return bRate - aRate;
      }

      // Secondary sort: name (ascending - A to Z)
      const getEngineerName = (engineer) => {
        return (engineer.name || engineer.CEName || engineer.id || '').toString().toLowerCase().trim();
      };

      const aName = getEngineerName(a);
      const bName = getEngineerName(b);

      if (aName !== bName) {
        return aName.localeCompare(bName, 'en', { sensitivity: 'base', numeric: true });
      }

      // Tertiary sort: maintain original order (stable sort)
      return (a._originalIndex || 0) - (b._originalIndex || 0);
    });

    // Remove the temporary _originalIndex property
    return sorted.map(({ _originalIndex, ...eng }) => eng);
  }, [filteredEngineers, engineersWithTraining, allTrainingTypes.length]);

  // Calculate pagination
  const totalPages = Math.ceil(sortedEngineers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEngineers = sortedEngineers.slice(startIndex, endIndex);

  // Get engineer data - sortedEngineers already has all training data from engineersWithTraining
  const getEngineerData = (engineer) => {
    // engineer is already from engineersWithTraining (sorted), has all training data
    return engineer;
  };

  return (
    <div 
      id="engineer-training-progress-detail" 
      className={cn(
        "relative overflow-hidden rounded-xl border p-6 backdrop-blur-sm mb-8",
        isDark
          ? "bg-gradient-to-br from-slate-800/80 via-slate-800/60 to-slate-900/80 border-slate-700/50"
          : "bg-white border-gray-200"
      )}
    >
      {/* Background Pattern */}
      <div 
        className={cn(
          "absolute inset-0",
          isDark 
            ? "bg-gradient-to-br from-blue-500/5 to-purple-500/5" 
            : "bg-gradient-to-br from-blue-50/30 to-purple-50/30"
        )}
      />
      
      {/* Header with Title */}
      <div className="relative mb-6">
        <h2 className={cn(
          "text-2xl font-bold mb-4",
          isDark
            ? "bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
            : "text-gray-900"
        )}>
          Training Progress Detail
        </h2>
      </div>
      
      {/* Header with Filter */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <p className={cn(
              "text-sm",
              isDark ? "text-slate-400" : "text-gray-600"
            )}>
              {sortedEngineers.length} engineers • {allTrainingTypes.length} training programs
            </p>
            {filterValue && (
              <p className={cn(
                "text-sm mt-1",
                isDark ? "text-blue-400" : "text-blue-600"
              )}>
                • Filter: {category === "REGION" ? "Region" : category === "VENDOR" ? "Vendor" : category === "AREA GROUP" ? "Area" : "Training"} = {filterValue}
                {category === "TRAINING" && engineersWithoutTraining.length > 0 && (
                  <span>
                    {" "}
                    (<span className={cn("font-semibold", isDark ? "text-red-400" : "text-red-600")}>{engineersWithoutTraining.length}</span>{" "}
                    <span className={cn(isDark ? "text-red-400" : "text-red-600")}>belum melakukan training</span>{" "}
                    <button
                      onClick={() => setShowEngineersWithoutTrainingModal(true)}
                      className={cn(
                        "underline hover:no-underline font-semibold transition-colors",
                        isDark ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                      )}
                    >
                      klik detail
                    </button>)
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        
        {/* Filter Controls - Same style as maps dashboard */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {/* Filter Tabs for REGION, VENDOR, AREA GROUP */}
          {[
            { name: "REGION", label: "Region" },
            { name: "VENDOR", label: "Vendor" },
            { name: "AREA GROUP", label: "Area" },
            { name: "TRAINING", label: "Training" }
          ].map((tab) => (
            <button
              key={tab.name}
              onClick={() => {
                startTransition(() => {
                  setCategory(tab.name);
                  setFilterValue("");
                });
              }}
              className={cn(
                "px-2 py-1 text-xs rounded transition-colors",
                category === tab.name
                  ? isDark 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-600 text-white"
                  : isDark
                    ? "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              {tab.label}
            </button>
          ))}
          
          {/* SearchableFilter */}
          <div className="w-auto min-w-[120px] max-w-[160px]">
            <SearchableFilter
              options={Array.isArray(filterOptions) ? filterOptions : []}
              value={filterValue}
              onChange={(value) => {
                startTransition(() => {
                  setFilterValue(value);
                });
              }}
              placeholder={`${category === "REGION" ? "Region" : category === "VENDOR" ? "Vendor" : category === "AREA GROUP" ? "Area" : "Training"}...`}
              searchPlaceholder="Cari..."
              label=""
              icon={null}
              showCount={false}
            />
          </div>
        </div>
      </div>

      {/* Engineer Cards */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[800px] overflow-y-auto">
        {currentEngineers.length === 0 ? (
          <div className={cn(
            "col-span-1 md:col-span-2 p-8 text-center rounded-lg border",
            isDark ? "bg-slate-800/50 border-slate-700" : "bg-gray-50 border-gray-200"
          )}>
            <p className={cn(isDark ? "text-slate-400" : "text-gray-600")}>
              No engineers found
            </p>
          </div>
        ) : (
          currentEngineers.map((engineer, idx) => {
            const engineerData = getEngineerData(engineer);
            const engineerId = engineer.id || engineerData?.id || `engineer-${idx}`;
            const isExpanded = expandedCards.has(engineerId);
            const statusColor = getStatusColor(engineerData.completionRate || 0);
            
            const getCardBorder = () => {
              if (statusColor.colorName === 'emerald') {
                return isDark ? "border-emerald-500/20 hover:border-emerald-500/30" : "border-emerald-200 hover:border-emerald-300";
              } else if (statusColor.colorName === 'blue') {
                return isDark ? "border-blue-500/20 hover:border-blue-500/30" : "border-blue-200 hover:border-blue-300";
              } else if (statusColor.colorName === 'amber') {
                return isDark ? "border-amber-500/20 hover:border-amber-500/30" : "border-amber-200 hover:border-amber-300";
              } else {
                return isDark ? "border-red-500/20 hover:border-red-500/30" : "border-red-200 hover:border-red-300";
              }
            };

            return (
              <div
                key={engineerId}
                className={cn(
                  "rounded-lg border p-3 transition-all duration-200 hover:shadow-md",
                  isDark ? "bg-slate-800/40 hover:bg-slate-800/50" : "bg-white hover:bg-gray-50",
                  getCardBorder()
                )}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                      statusColor.bg,
                      statusColor.border
                    )}>
                      <User className={statusColor.text} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={cn(
                        "font-semibold text-sm truncate",
                        isDark ? "text-slate-200" : "text-gray-900"
                      )}>
                        {engineer.name || engineer.CEName || 'Unknown'}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-0.5 text-xs">
                        <span className={cn(isDark ? "text-slate-400" : "text-gray-500")}>
                          {engineer.area_group || 'N/A'}
                        </span>
                        <span className={cn(isDark ? "text-slate-600" : "text-gray-300")}>•</span>
                        <span className={cn(isDark ? "text-slate-400" : "text-gray-500")}>
                          {engineer.region || 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <div className={cn(
                        "text-lg font-bold",
                        statusColor.text
                      )}>
                        {engineerData.completionRate || 0}%
                      </div>
                      <div className={cn(
                        "text-[10px]",
                        isDark ? "text-slate-400" : "text-gray-500"
                      )}>
                        {engineerData.completedCount || 0}/{allTrainingTypes.length}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleCard(engineerId)}
                      className={cn(
                        "p-1.5 rounded-lg transition-colors flex-shrink-0",
                        isDark ? "hover:bg-slate-700/50" : "hover:bg-gray-100"
                      )}
                    >
                      {isExpanded ? (
                        <ChevronUp className={cn(isDark ? "text-slate-400" : "text-gray-600")} size={16} />
                      ) : (
                        <ChevronDown className={cn(isDark ? "text-slate-400" : "text-gray-600")} size={16} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className={cn(
                  "h-1.5 rounded-full overflow-hidden",
                  isDark ? "bg-slate-700/30" : "bg-gray-200"
                )}>
                  <div
                    className={cn("h-full rounded-full transition-all duration-500", statusColor.bar)}
                    style={{ width: `${engineerData.completionRate || 0}%` }}
                  />
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className={cn(
                    "mt-3 pt-3 border-t",
                    isDark ? "border-slate-700/50" : "border-gray-200"
                  )}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Training List */}
                      <div>
                        <h4 className={cn(
                          "text-xs font-semibold mb-2 flex items-center gap-1.5",
                          isDark ? "text-slate-300" : "text-gray-700"
                        )}>
                          <Award className={cn(statusColor.text)} size={12} />
                          Training Programs
                        </h4>
                        <div className="space-y-1.5 max-h-[250px] overflow-y-auto">
                          {allTrainingTypes.map((training, trainingIdx) => {
                            const hasTraining = engineerData.trainingStatus?.[training] || false;
                            return (
                              <div
                                key={trainingIdx}
                                className={cn(
                                  "flex items-center gap-2 py-1.5 px-2 rounded-md",
                                  hasTraining
                                    ? isDark 
                                      ? "bg-emerald-500/10 border border-emerald-500/20" 
                                      : "bg-emerald-50 border border-emerald-200"
                                    : isDark 
                                      ? "bg-slate-700/20 border border-slate-600/20" 
                                      : "bg-gray-50 border border-gray-200"
                                )}
                              >
                                {hasTraining ? (
                                  <CheckCircle className="text-emerald-400 flex-shrink-0" size={14} fill="currentColor" />
                                ) : (
                                  <Circle className={cn(isDark ? "text-slate-500" : "text-gray-400", "flex-shrink-0")} size={14} />
                                )}
                                <span className={cn(
                                  "text-xs flex-1 truncate",
                                  hasTraining
                                    ? isDark ? "text-emerald-200" : "text-emerald-700"
                                    : isDark ? "text-slate-400" : "text-gray-600"
                                )}>
                                  {training.replace('Training ', '')}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Engineer Info */}
                      <div>
                        <h4 className={cn(
                          "text-xs font-semibold mb-2 flex items-center gap-1.5",
                          isDark ? "text-slate-300" : "text-gray-700"
                        )}>
                          <User className={cn(statusColor.text)} size={12} />
                          Information
                        </h4>
                        <div className="space-y-2">
                          <div className={cn(
                            "flex items-center gap-2 py-1.5 px-2 rounded-md",
                            isDark ? "bg-slate-700/20 border border-slate-600/20" : "bg-gray-50 border border-gray-200"
                          )}>
                            <MapPin className={cn(isDark ? "text-blue-400" : "text-blue-600", "flex-shrink-0")} size={12} />
                            <div className="flex-1 min-w-0">
                              <div className={cn("text-[10px] font-medium mb-0.5", isDark ? "text-slate-400" : "text-gray-500")}>
                                Area
                              </div>
                              <span className={cn("text-xs font-medium truncate block", isDark ? "text-slate-200" : "text-gray-700")}>
                                {engineer.area_group || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 py-1.5 px-2 rounded-md",
                            isDark ? "bg-slate-700/20 border border-slate-600/20" : "bg-gray-50 border border-gray-200"
                          )}>
                            <Briefcase className={cn(isDark ? "text-purple-400" : "text-purple-600", "flex-shrink-0")} size={12} />
                            <div className="flex-1 min-w-0">
                              <div className={cn("text-[10px] font-medium mb-0.5", isDark ? "text-slate-400" : "text-gray-500")}>
                                Vendor
                              </div>
                              <span className={cn("text-xs font-medium truncate block", isDark ? "text-slate-200" : "text-gray-700")}>
                                {engineer.vendor || 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 py-1.5 px-2 rounded-md",
                            isDark ? "bg-slate-700/20 border border-slate-600/20" : "bg-gray-50 border border-gray-200"
                          )}>
                            <Award className={cn(isDark ? "text-amber-400" : "text-amber-600", "flex-shrink-0")} size={12} />
                            <div className="flex-1 min-w-0">
                              <div className={cn("text-[10px] font-medium mb-0.5", isDark ? "text-slate-400" : "text-gray-500")}>
                                Experience
                              </div>
                              <span className={cn("text-xs font-medium truncate block", isDark ? "text-slate-200" : "text-gray-700")}>
                                {engineer.years_experience || 'N/A'} years
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className={cn(
          "relative mt-6 pt-6 border-t flex items-center justify-between",
          isDark ? "border-slate-700/50" : "border-gray-200"
        )}>
          <div className={cn(
            "text-sm",
            isDark ? "text-slate-400" : "text-gray-600"
          )}>
            Showing {startIndex + 1} to {Math.min(endIndex, sortedEngineers.length)} of {sortedEngineers.length} engineers
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentPage === 1
                  ? isDark ? "bg-slate-800/30 text-slate-600 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isDark ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
            >
              <ChevronLeft size={16} />
            </button>
            <div className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium",
              isDark ? "bg-slate-800/50 text-slate-300" : "bg-gray-100 text-gray-700"
            )}>
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                "p-2 rounded-lg transition-colors",
                currentPage === totalPages
                  ? isDark ? "bg-slate-800/30 text-slate-600 cursor-not-allowed" : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isDark ? "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50" : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              )}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EngineerTrainingProgress;


