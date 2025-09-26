export interface AppointmentClient {
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
  registeredBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface AppointmentPersonnel {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface AppointmentResponse {
  _id: string;
  client: AppointmentClient;
  personnel: AppointmentPersonnel;
  date: string;
  startTime: string;
  endTime: string;
  status: 'booked' | 'completed' | 'cancelled' | 'no-show' | 'arrived' | 'with_personnel';
  remark?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface AppointmentsListResponse {
  appointments: AppointmentResponse[];
  success?: boolean;
  count?: number;
  total?: number;
}