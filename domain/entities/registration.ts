export interface RegistrationFormClients {
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

export interface RegistrationFormResponse {
  message: string;
}

