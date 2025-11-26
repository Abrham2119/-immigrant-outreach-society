export interface RegisteredBy {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
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
  registeredBy: RegisteredBy | null;
  createdAt: string;
  updatedAt: string;  
  __v?: number;
}

export interface ClientGetByID {
  client: Client;
  success: boolean;
}
export interface ClientsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  pages: number;
  clients: Client[];
}
export interface StatusUpdateRequest {
  status: string;
}
export interface StatusUpdateResponse {
  status: string;
}