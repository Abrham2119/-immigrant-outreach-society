"use client";

import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { ChangeEvent, forwardRef, useRef, useEffect } from "react";
import { PhoneInputFieldProps } from "./PhoneInputField.types";

const PhoneInputField = forwardRef<HTMLInputElement, PhoneInputFieldProps>(
  (
    {
      name,
      value = "+251",
      onChange,
      placeholder,
      width = 400,
      height = 45,
      error,
      icon,
      readOnly,
    },
    ref
  ) => {
    const internalRef = useRef<HTMLInputElement>(null);

    // Handle ref forwarding safely
    useEffect(() => {
      const timer = setTimeout(() => {
        if (typeof ref === "function") {
          ref(internalRef.current);
        } else if (ref && internalRef.current) {
          ref.current = internalRef.current;
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

    const handleTelChange = (phone: string) => {
      const syntheticEvent = {
        target: {
          name,
          value: phone,
        },
        currentTarget: {
          name,
          value: phone,
        },
        preventDefault: () => {},
        stopPropagation: () => {},
      } as ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    };
    console.log("PhoneInputField rendered with value:", icon);

    return (
      <div className={`relative z-10 w-full max-w-[${width}px] z-0`}>
        <div className="absolute z-10 inset-y-0 left-0 flex items-center pl-3 text-[#A8A8A8]">
          {icon}
        </div>
        <PhoneInput
          value={value ? String(value) : ""}
          onChange={handleTelChange}
          inputProps={{
            name,
            placeholder,
            readOnly,
            ref: internalRef,
            className: `placeholder:font-montserrat placeholder:text-[14px] placeholder:font-[400] placeholder-[#A8A8A8] border ${
              error
                ? "border border-red-500"
                : "border-[#DADADA] focus:ring-none "
            } focus:outline-none focus:ring-0`,
          }}
          containerStyle={{ width: "100%" }}
          inputStyle={{
            width: "100%",
            height,
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 400,
            paddingLeft: 50,
          }}
          buttonStyle={{
            backgroundColor: "transparent",
            border: "none",
            padding: "10px 12px 10px 10px",
            boxShadow: "none",
            marginRight: "8px",
          }}
          dropdownStyle={{
            marginLeft: "10px",
          }}
        />
      </div>
    );
  }
);

PhoneInputField.displayName = "PhoneInputField";

export default PhoneInputField;
