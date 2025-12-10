/* eslint-disable jsx-a11y/alt-text */
"use client";

import { Eye, EyeOff, Image, Phone, Upload, X } from "lucide-react";
import { forwardRef, useEffect, useRef, useState } from "react";
import PhoneInputField from "./fields/PhoneInputField/PhoneInputField";
import { InputFieldProps } from "./InputField.types";

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (props, ref) => {
    const {
      label,
      type = "text",
      value,
      onChange,
      icon,
      placeholder,
      name,
      min,
      width = 400, 
      height = 45,
      error,
      onClear,
      readOnly,
      ...rest
    } = props;
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const inputId = `${name}-file-upload`;
    const fileRef = useRef<HTMLInputElement>(null);

    const handleClear = () => {
      if (fileRef.current) {
        fileRef.current.value = "";
      }
      onClear?.();
    };

    // Handle ref forwarding safely for file input
    useEffect(() => {
      const timer = setTimeout(() => {
        if (typeof ref === "function") {
          ref(fileRef.current);
        } else if (ref && fileRef.current) {
          ref.current = fileRef.current;
        }
      }, 0);

      return () => clearTimeout(timer);
    }, [ref]);

    // Cleanup ref on unmount
    useEffect(() => {
      return () => {
        if (typeof ref === "function") {
          ref(null);
        } else if (ref) {
          ref.current = null;
        }
      };
    }, [ref]);

    const renderInput = () => {
      switch (type) {
        case "tel":
          return (
            <PhoneInputField
              name={name ?? ""}
              value={value !== undefined && value !== null ? String(value) : ""}
              onChange={onChange}
              placeholder={placeholder}
              width={width}
              height={height}
              icon={icon}
              error={error}
              readOnly={readOnly}
              ref={ref}
            />
          );

        case "file":
          return (
            <>
              <div className="relative">
                {icon && (
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#A8A8A8]">
                    {icon}
                  </div>
                )}

                <input
                  type="text"
                  readOnly
                  value={value ?? ""}
                  placeholder={placeholder}
                  className={`w-full border-[1px] rounded-[8px] pl-10 pr-3 text-sm outline-none placeholder-[#A8A8A8] ${
                    error ? "border-red-500" : "border-[#DADADA]"
                  }`}
                  style={{ height }}
                />

                <input
                  id={inputId}
                  type="file"
                  name={name}
                  onChange={onChange}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*,application/pdf"
                />
              </div>

              {value ? (
                <div className="flex items-center justify-between bg-[#2463EB]/20 px-3 py-2 max-h-[37px] max-w-[327px] rounded-[4px] mt-2">
                  <div className="flex flex-row items-center gap-[6px] justify-center overflow-x-hidden">
                    <Image size={24} className="text-[#6E6A6A] mr-1" />
                    <span className="text-[14px] text-[#6C6C6C] font-[500] truncate overflow-x-hidden">
                      {value}
                    </span>
                  </div>
                  <button className="ml-2" type="button" onClick={handleClear}>
                    <X size={24} className="cursor-pointer text-black" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor={inputId}
                  className="flex items-center gap-1 text-[14px] font-[500] text-[#2463EB] mt-3 cursor-pointer w-fit"
                >
                  <Upload size={18} />
Upload your                  {label}
                </label>
              )}
            </>
          );

        default:
          return (
            <input
              ref={ref}
              type={inputType}
              name={name}
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              style={{ height }}
              {...rest}
              className={`w-full border-[1px] rounded-[8px] pl-10 text-sm outline-none placeholder:text-[14px] placeholder:font-[400] placeholder-[#A8A8A8] ${
                isPassword ? "pr-10" : "pr-3"
              } ${
                error
                  ? "border-red-500 focus:ring-red-400"
                  : "border-[#DADADA] focus:ring-primary"
              }`}
            />
          );
      }
    };

    return (
      <div className={`flex flex-col gap-1 w-full`} style={{ maxWidth: width }}>
        {label && (
          <label className="text-[14px] font-[500] text-[#6C6C6C]">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && type !== "file" && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#A8A8A8]">
              {icon}
            </div>
          )}

          {renderInput()}

          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#A8A8A8]"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye className="w-[20px] h-[20px]" />
              ) : (
                <EyeOff className="w-[20px] h-[20px]" />
              )}
            </button>
          )}
        </div>

        {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;