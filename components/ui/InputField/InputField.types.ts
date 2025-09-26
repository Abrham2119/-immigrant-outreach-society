import { ReactNode, ChangeEvent } from "react";

export type InputFieldProps = {
  label: string;
  type?: "text" | "email" | "tel" | "password" | "date" | "file"|"number";
  value?: string|number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  icon?: ReactNode;
  placeholder: string;
  name?: string;
  width?: number;
  height?: number;
  error?: string;
  min?: string | number;
  onClear?: () => void;
  readOnly?: boolean;
};
