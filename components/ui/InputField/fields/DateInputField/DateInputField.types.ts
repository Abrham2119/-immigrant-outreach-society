import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";

export interface DateInputFieldProps {
  name?: string;
  value?: string|number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  width?: number;
  height?: number;
  rest?: InputHTMLAttributes<HTMLInputElement>;
  icon?: ReactNode;
  error?: string;
  min?: string | number;
}
