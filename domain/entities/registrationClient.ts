export interface RegistrationFormClientsReception {
  _id: string;
  firstName: string;
  lastName: string;
  gender: "male" | "female" | "prefer_not_to_say" | string; // fallback for safety
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
  registeredBy: string;
  createdAt: string;  
  updatedAt: string; 
  __v: number;
}

export interface RegistrationFormClientsReceptForm {
  id?:string
  firstName: string;
  lastName: string;
  gender: string;
  email?: string;
  mobile: string; 
  nationality?: string;
  immigrationStatus?: string;
  language?: string;
  address?: string;
  birthDate?: string;  
  message?: string;
  services: string[];
}

export interface RegisterClientResponse {
  success: boolean;
  message: string;
  client: RegistrationFormClientsReception;
}
