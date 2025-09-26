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
  selected: string | string[];
  onChange: (value: any) => void;
  error?: string;
  placeholder?: string;
  multiple?: boolean;
  required?: boolean;
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
      const newSelected = currentSelected.includes(option.value)
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

  return (
    <div className="flex flex-col relative" ref={dropdownRef}>
      <label className="text-[14px] font-[500] text-[#6C6C6C] mb-2">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      
      <div
        className={`w-full border-[1px] border-[#DADADA] rounded-[8px] px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex items-center justify-between ${
          error ? "border-red-500" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm ${!selected || (multiple && Array.isArray(selected) && selected.length === 0) ? "text-gray-400" : "text-gray-700"}`}>
          {getDisplayText()}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#DADADA] rounded-[8px] shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                isSelected(option) ? "bg-blue-50 text-blue-600" : "text-gray-700"
              }`}
              onClick={() => handleSelect(option)}
            >
              {multiple && (
                <input
                  type="checkbox"
                  checked={isSelected(option)}
                  readOnly
                  className="mr-2 h-4 w-4 text-blue-600 rounded"
                />
              )}
              {option.label}
            </div>
          ))}
        </div>
      )}

      {error && (
        <span className="text-red-500 text-xs mt-1">{error}</span>
      )}
    </div>
  );
}