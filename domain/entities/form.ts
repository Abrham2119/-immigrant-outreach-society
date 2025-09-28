// domain/entities/form.ts
export interface Form {
  _id: string;
  client?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    gender: string;
    nationality: string;
    immigrationStatus: string;
    language: string;
    address: string;
    birthDate: string;
    services: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  personnel?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  service: string;
  formData: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface FormsResponse {
  success: boolean;
  count: number;
  forms: Form[];
  pages?: number;
}

export interface FormResponse {
  success: boolean;
  form: Form;
}