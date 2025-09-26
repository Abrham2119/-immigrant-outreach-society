export type Status = "all" | "pending" | "approved" | "rejected";
export interface DropdownOption {
  label: string;
  value: string;}

export interface CustomDropdownProps {
  selected: string|Status
  onChange: (value: string|Status) => void;
  options: DropdownOption[];
}
