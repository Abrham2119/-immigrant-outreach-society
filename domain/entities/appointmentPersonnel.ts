export type AppointmentStatus =
  | "all"
  | "booked"
  | "accepted"
  | "completed"
  | "rejected"
  |""

interface Meta {
  total: number;
  count: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface ClientFile {
  _id: string;
  fileName: string;
  fileType: string;
  fileUrl: string;
  size?: number;
  uploadedAt: string;
}

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  gender: string;
   emergency_alert: {
    reason: string;
    status: boolean}
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
  consent: boolean;
  registeredBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  files?: ClientFile[]; 
  statusReason?: string;
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
  success: boolean;
  message: string;
  meta: Meta;
  data: AppointmentResponse[];
}