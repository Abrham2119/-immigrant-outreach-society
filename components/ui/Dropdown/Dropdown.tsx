// components/ui/Dropdown/Dropdown.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
selected: string | string[] | undefined;
  onChange: (value: any) => void;
  error?: string;
  placeholder?: string;
  multiple?: boolean;
  required?: boolean;
  displayValue?: string;
}

export default function Dropdown({
  label,
  options,
  selected,
  onChange,
  error,
  placeholder = "Select an option",
  multiple = false,
  required = false,
  displayValue,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: DropdownOption) => {
    if (multiple) {
      const currentSelected = Array.isArray(selected) ? selected : [];
      const isAlreadySelected = currentSelected.includes(option.value);
      
      const newSelected = isAlreadySelected
        ? currentSelected.filter(item => item !== option.value)
        : [...currentSelected, option.value];
      
      onChange(newSelected);
    } else {
      onChange(option.value);
      setIsOpen(false);
    }
  };

  const isSelected = (option: DropdownOption) => {
    if (multiple) {
      return Array.isArray(selected) && selected.includes(option.value);
    }
    return selected === option.value;
  };

  const getDisplayText = () => {
    // Use displayValue prop if provided
    if (displayValue) {
      return displayValue;
    }

    if (multiple && Array.isArray(selected) && selected.length > 0) {
      const selectedLabels = options
        .filter(opt => selected.includes(opt.value))
        .map(opt => opt.label);
      return selectedLabels.join(", ");
    }
    
    if (!multiple && selected) {
      return options.find(opt => opt.value === selected)?.label || selected;
    }
    
    return placeholder;
  };

  const removeSelectedItem = (option: DropdownOption, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple && Array.isArray(selected)) {
      const newSelected = selected.filter(item => item !== option.value);
      onChange(newSelected);
    }
  };

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="text-[14px] font-[500] text-[#6C6C6C] mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      
      <div
        className={`w-full min-h-10 border-[1px] border-[#DADADA] rounded-[8px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between ${
          error ? "border-red-500" : ""
        } ${multiple && Array.isArray(selected) && selected.length > 0 ? 'py-1' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1 flex flex-wrap gap-1">
          {multiple && Array.isArray(selected) && selected.length > 0 ? (
            selected.map((value) => {
              const option = options.find(opt => opt.value === value);
              return (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                >
                  {option ? option.label : value}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newSelected = selected.filter(item => item !== value);
                      onChange(newSelected);
                    }}
                    className="hover:text-blue-900 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              );
            })
          ) : (
            <span className={`text-sm ${!selected ? "text-gray-400" : "text-gray-700"}`}>
              {getDisplayText()}
            </span>
          )}
          
          {multiple && Array.isArray(selected) && selected.length === 0 && (
            <span className="text-sm text-gray-400">
              {/* {getDisplayText()} */}
            </span>
          )}
        </div>
        
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DADADA] rounded-[8px] shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm flex items-center ${
                  isSelected(option) ? "bg-blue-50 text-blue-600" : "text-gray-700"
                }`}
                onClick={() => handleSelect(option)}
              >
                {multiple && (
                  <input
                    type="checkbox"
                    checked={isSelected(option)}
                    readOnly
                    className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                )}
                {option.label}
              </div>
            ))
          )}
        </div>
      )}

      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}