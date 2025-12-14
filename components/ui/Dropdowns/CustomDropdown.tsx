"use client";
import { useTranslatedText } from "@/application/hooks/use-translated-text";
import classNames from "classnames";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CustomDropdownProps, Status } from "./types";

export default function CustomDropdown({
  selected,
  onChange,
  options,
}: CustomDropdownProps) {
  const translatedText = useTranslatedText();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (value: Status | string) => {
    onChange(value);
    setIsOpen(false);
  };
  const getLabel = (value: string) => {
    return options.find((o) => o.value === value)?.label ?? value;
  };
  return (
    <div className="relative inline-flex flex-col items-start gap-2 text-sm font-bold text-[#252631]">
      <div
        onClick={toggleDropdown}
        className="flex items-center gap-4 px-1 cursor-pointer justify-between flex-row"
      >
        <p className="text-[#252631] gap-2 text-[12px] flex items-center justify-center flex-row">
          <ChevronDown
            className={`w-4 h-4 text-[#98A9BC] right-2${
              isOpen ? " rotate-180" : ""
            }`}
          />
          <span className="font-extrabold">{getLabel(selected)}</span>
        </p>     
      </div>
      {isOpen && (
        <div className="absolute top-full mt-[2px] px-1 pb-2 max-w-[180px] right-0  bg-white  border border-[#F2F2F2] rounded-lg z-10">
          <div className="w-full h-full gap-1">
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={classNames(
                  "p-1 cursor-pointer m-[3px] text-nowrap text-sm font-medium hover:bg-[#F4F5F6] text-[#1A1A1A] rounded-md",
                  selected === option.value ? "bg-[#F4F5F6]" : ""
                )}
              >
                {getLabel(option.value)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
