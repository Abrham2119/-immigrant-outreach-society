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
  gender: string;
  email: string;
  mobile: string;
  emergency_alert?: {
    status: boolean;
    reason?: string;
  };
  nationality: string;
  immigrationStatus: string;
  language: string;
  address: string;
  birthDate: string;
  message?: string;
  services: string[];
  status: string;
  consent?: boolean;
  registeredBy?: string | null;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Personnel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Form {
  _id: string;
  client: Client;
  personnel: Personnel;
  service: string;
  title: string;
  formData: FormData;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PersonnelFormsResponse {
  success: boolean;
  message: string;
  data: Form[];
  meta: {
    total: number;
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}