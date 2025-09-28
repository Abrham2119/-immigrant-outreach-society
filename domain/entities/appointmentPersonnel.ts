export type AppointmentStatus = "all" | "booked" | "arrived" | "with_personnel" | "completed" | "cancelled" | "no-show";

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
  role: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AppointmentResponse {
  _id: string;
  client: Client;
  personnel: Personnel;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AppointmentsListResponse {
  data: AppointmentResponse[];
  total: number;
}