import { 
  DoctorListResponse, 
  CreateDoctorRequest, 
  UpdateDoctorRequest,
  Doctor 
} from "@/domain/entities/doctor";
import api from "./axios";

export async function fetchDoctors(query?: string): Promise<DoctorListResponse> {
  const { data } = await api.get(`/admin/doctors?${query}`);
  return data;
}

export async function createDoctor(doctorData: CreateDoctorRequest): Promise<Doctor> {
  const { data } = await api.post('/admin/doctors', doctorData);
  return data;
}

export async function getDoctorById(id: string): Promise<Doctor> {
  const { data } = await api.get(`/admin/doctors/${id}`);
  return data;
}

export async function updateDoctor(id: string, doctorData: UpdateDoctorRequest): Promise<Doctor> {
  const { data } = await api.put(`/admin/doctors/${id}`, doctorData);
  return data;
}

export async function deleteDoctor(id: string): Promise<void> {
  await api.delete(`/admin/doctors/${id}`);
}

export async function updateDoctorAvailability(id: string, workingHours: any): Promise<Doctor> {
  const { data } = await api.put(`/admin/doctors/${id}/availability`, workingHours);
  return data;
}