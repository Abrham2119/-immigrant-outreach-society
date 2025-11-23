export interface FormResponseId {
  success: boolean;
  form: Form; 
}

interface Form {
  _id: string;
  client: Client; 
  title: string;
  personnel: Personnel
  service: string;
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
  message: string;
  services: string[];
  status: string;
  registeredBy: string | null;
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