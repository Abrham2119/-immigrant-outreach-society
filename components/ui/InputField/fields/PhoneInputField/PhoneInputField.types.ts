import { ChangeEvent, ReactNode } from "react";

export interface PhoneInputFieldProps {
  name: string;
  value: string|number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: number;
  height?: number;
  error?: string;
  icon?: ReactNode;
  readOnly?: boolean;
}
