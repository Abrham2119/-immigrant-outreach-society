export interface FormData {
  [key: string]: any;
  data_entry_personnel_full_name?: string;
  client_name?: string;
  client_full_name?: string;
  "Data Entry personnel full name"?: string;
  "Referral Individual's Name"?: string;
  sql_staff_full_name?: string;
  modalities?: string[];
  other_agencies_programs_involved?: string;
  client_wants_for_housing?: string;
  acknowledgement?: boolean;
  ios_staff_full_name?: string;
  signature?: string;
  date_completed?: string;
  scope_of_service?: string[];
}

export interface Client {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Personnel {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export interface Form {
  _id: string;
  client: string | Client; 
  personnel: string | Personnel;
  service: string;
  title: string;
  formData: FormData;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PersonnelFormsResponse {
  success: boolean;
  count: number;
  forms: Form[];
  pages?: number;
  currentPage?: number;
}