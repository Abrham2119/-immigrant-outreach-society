export type DoctorStatus = "active" | "inactive" | "busy";
export type Specialization = "psychiatrist" | "psychologist" | "counselor" | "therapist";

export interface WorkingHours {
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Doctor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: Specialization;
  status: DoctorStatus;
  workingHours: WorkingHours[];
  timeZone: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorListResponse {
  data: Doctor[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export interface CreateDoctorRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: Specialization;
  workingHours: WorkingHours[];
  timeZone: string;
}

export interface UpdateDoctorRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  specialization?: Specialization;
  status?: DoctorStatus;
  workingHours?: WorkingHours[];
  timeZone?: string;
}