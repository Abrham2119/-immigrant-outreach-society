// components/ui/InputField/fields/DateInputField/DateInputField.tsx
"use client";

import { forwardRef } from "react";

interface DateInputFieldProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: number;
  height?: number;
  icon?: React.ReactNode;
  error?: string;
  min?: string;
  rest?: any;
}

const DateInputField = forwardRef<HTMLInputElement, DateInputFieldProps>(
  ({ name, value, onChange, placeholder, width = 400, height = 45, icon, error, min, ...rest }, ref) => {
    
    // Format the value for display (YYYY-MM-DD format required for date inputs)
    const formatDateValue = (dateValue: string): string => {
      if (!dateValue) return '';
      
      try {
        // Handle various date formats that might come from React Hook Form
        const date = new Date(dateValue);
        
        // Check if the date is valid
        if (isNaN(date.getTime())) return '';
        
        // Format to YYYY-MM-DD for the date input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };
    
    const formattedValue = formatDateValue(value);
    
    return (
      <div className="relative w-full" style={{ maxWidth: width }}>
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#A8A8A8]">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type="date"
            name={name}
            value={formattedValue}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className={`w-full border-[1px] rounded-[8px] pl-10 pr-3 text-sm outline-none placeholder-[#A8A8A8] ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-[#DADADA] focus:ring-primary"
            }`}
            style={{ height }}
            {...rest}
          />
        </div>

        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }
);

DateInputField.displayName = "DateInputField";

export default DateInputField;