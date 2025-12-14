export interface AppointmentClient {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  emergency_alert?: {
    status: boolean;
    reason?: string;
  };
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
  phone: string;
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

export interface Appointment {
  _id: string;
  client: AppointmentClient;
  personnel: AppointmentPersonnel;
  date: string;
  startTime: string;
  endTime: string;
  status: 'booked' | 'completed' | 'cancelled' | 'no-show';
  remark?: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface AppointmentsResponse {
  success: boolean;
  message: string;
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
  data: Appointment[];
}


export interface StatusUpdateRequest {
  status: string;
  remark?: string;
}

export interface StatusUpdateResponse {
  message?: string;
  status?: string;
}

// Additional interface for single appointment response if needed
export interface AppointmentResponse {
  success: boolean;
  message: string;
  data: Appointment;
}