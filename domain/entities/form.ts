// domain/entities/form.ts
export interface Form {
  _id: string;
  client: Client;
  personnel: Personnel;
  service: string;
  title?: string;
  formData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  mobile: string;
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

export interface FormsResponse {
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

export interface FormResponse {
  success: boolean;
  message: string;
  data: Form;
}