import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, Filter, Check } from 'react-feather';

/**
 * SearchableFilter - Komponen filter dengan pencarian dan UI yang user-friendly
 * 
 * Features:
 * - Searchable dropdown dengan pencarian real-time
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Clear filter button
 * - Visual feedback untuk filter aktif
 * - Mobile responsive
 * - Accessible (ARIA labels)
 */
function SearchableFilterComponent({
  options = [],
  value = '',
  onChange,
  placeholder = 'Pilih filter...',
  searchPlaceholder = 'Cari...',
  label = '',
  icon,
  showCount = false,
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const optionRefs = useRef([]);

  // Filter options berdasarkan search term
  const filteredOptions = useMemo(() => {
    if (!searchTerm.trim()) return options;
    const term = searchTerm.toLowerCase();
    return options.filter(opt => 
      opt.toLowerCase().includes(term)
    );
  }, [options, searchTerm]);

  // Reset highlighted index ketika options berubah
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
    }
  }, [filteredOptions, isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input when dropdown opens
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleSelect(filteredOptions[highlightedIndex]);
        } else if (filteredOptions.length === 1) {
          handleSelect(filteredOptions[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Scroll highlighted option into view
  useEffect(() => {
    if (highlightedIndex >= 0 && optionRefs.current[highlightedIndex]) {
      optionRefs.current[highlightedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [highlightedIndex]);

  const handleSelect = (option) => {
    onChange(option === value ? '' : option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const selectedOption = value;
  const hasValue = Boolean(value);
  const hasOptions = filteredOptions.length > 0;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Label (optional) */}
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          {label}
        </label>
      )}

      {/* Filter Button/Input */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`
            w-full flex items-center justify-between gap-2
            ${label ? 'px-3 py-2.5' : 'px-2 py-1.5'}
            bg-slate-800/70 hover:bg-slate-700/70
            border border-slate-600/50 hover:border-blue-500/50
            rounded
            text-left ${label ? 'text-sm' : 'text-xs'} text-slate-200
            transition-all duration-200
            focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500
            ${isOpen ? 'ring-1 ring-blue-500/50 border-blue-500' : ''}
            ${hasValue ? 'border-blue-500/70 bg-blue-900/20' : ''}
          `}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={label || placeholder}
        >
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {icon && (
              <span className="flex-shrink-0 text-slate-400">
                {icon}
              </span>
            )}
            <span className={`truncate flex-1 ${hasValue ? 'text-blue-300 font-medium' : 'text-slate-400'}`}>
              {hasValue ? selectedOption : placeholder}
            </span>
            {showCount && hasValue && options.length > 0 && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs bg-blue-600/30 text-blue-300 rounded-full">
                {options.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {hasValue && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 text-slate-400 hover:text-red-400 transition-colors rounded"
                aria-label="Clear filter"
                title="Hapus filter"
              >
                <X size={14} />
              </button>
            )}
            <ChevronDown 
              size={14} 
              className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-600/50 rounded-lg shadow-xl overflow-hidden">
            {/* Search Input */}
            <div className="p-1.5 border-b border-slate-700/50 bg-slate-800/90">
              <div className="relative">
                <Search 
                  size={14} 
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(-1);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={searchPlaceholder}
                  className="w-full pl-7 pr-2 py-1.5 bg-slate-700/50 border border-slate-600/50 rounded text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Options List */}
            <div 
              className="max-h-48 overflow-y-auto overscroll-contain"
              role="listbox"
            >
              {/* "All" option */}
              <button
                type="button"
                onClick={() => handleSelect('')}
                className={`
                  w-full px-2 py-1.5 text-left text-xs
                  flex items-center justify-between gap-2
                  transition-colors
                  ${!hasValue 
                    ? 'bg-blue-600/20 text-blue-300 font-medium' 
                    : 'text-slate-300 hover:bg-slate-700/50'
                  }
                  ${highlightedIndex === -1 && searchTerm === '' ? 'bg-slate-700/30' : ''}
                `}
                onMouseEnter={() => setHighlightedIndex(-1)}
                ref={(el) => {
                  if (searchTerm === '') {
                    optionRefs.current[-1] = el;
                  }
                }}
              >
                <span>Semua</span>
                {!hasValue && (
                  <Check size={14} className="text-blue-400" />
                )}
              </button>

              {/* Filtered Options */}
              {hasOptions ? (
                filteredOptions.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`
                      w-full px-2 py-1.5 text-left text-xs
                      flex items-center justify-between gap-2
                      transition-colors
                      ${value === option 
                        ? 'bg-blue-600/20 text-blue-300 font-medium' 
                        : 'text-slate-300 hover:bg-slate-700/50'
                      }
                      ${highlightedIndex === index ? 'bg-slate-700/70' : ''}
                    `}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    ref={(el) => {
                      optionRefs.current[index] = el;
                    }}
                  >
                    <span className="truncate">{option}</span>
                    {value === option && (
                      <Check size={14} className="text-blue-400 flex-shrink-0" />
                    )}
                  </button>
                ))
              ) : (
                <div className="px-2 py-3 text-center text-xs text-slate-400">
                  {searchTerm ? `Tidak ada hasil` : 'Tidak ada data'}
                </div>
              )}
            </div>

            {/* Footer with count */}
            {hasOptions && searchTerm && (
              <div className="px-2 py-1 text-xs text-slate-400 border-t border-slate-700/50 bg-slate-800/50">
                {filteredOptions.length}/{options.length}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filter Badge - Only show when label exists */}
      {hasValue && label && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs text-blue-300">
          <Filter size={12} />
          <span>Filter aktif: {selectedOption}</span>
        </div>
      )}
    </div>
  );
}

const SearchableFilter = React.memo(SearchableFilterComponent);
SearchableFilter.displayName = 'SearchableFilter';

export default SearchableFilter;
export { SearchableFilter };

