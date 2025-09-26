// components/ui/RadioGroup/RadioGroup.tsx
"use client";

interface RadioGroupOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  options: RadioGroupOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  required?: boolean;
}

export default function RadioGroup({
  options,
  selectedValue,
  onChange,
  label,
  error,
  required = false,
}: RadioGroupProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label className="text-[14px] font-[500] text-[#6C6C6C]">
          {label}
          {required && " *"}
        </label>
      )}
      
      <div className="flex gap-4">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value={option.value}
              checked={selectedValue === option.value}
              onChange={() => onChange(option.value)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
}