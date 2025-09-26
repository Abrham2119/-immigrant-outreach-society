export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no-show";
export type AppointmentType = "initial" | "follow-up" | "assessment" | "review";

export interface Appointment {
  client: string;
  personnel: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface Rule {
  _id?: string;
  personnel: string | null;
  weekdays: number[];
  startTime: string;
  endTime: string;
  endDate: string | null;
}

export interface AppointmentListResponse {
  data: Appointment[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateAppointmentRequest {
  clientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: AppointmentType;
  notes?: string;
}

export interface UpdateAppointmentRequest {
  status?: AppointmentStatus;
  notes?: string;
}

export interface AvailableSpot {
  date: string;
  start: string;
  end: string;
  personnel: string;
}

export interface Exception {
  _id?: string;
  personnel: string | null;
  date: string;
  type: 'holiday' | 'personal' | 'emergency' | 'booked';
  reason: string;
  startTime?: string;
  endTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  _id?: string;
  client: string;
  personnel: string;
  date: string;
  startTime: string;
  endTime: string;
  status?: 'booked' | 'cancelled' | 'completed';
  createdAt?: string;
  updatedAt?: string;
}

export interface BookAppointmentRequest {
  client: string;
  personnel: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface BookAppointmentResponse {
  message: string;
  populatedAppointment: Appointment;
}
