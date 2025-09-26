import { AppointmentResponse, AppointmentsListResponse } from '@/domain/entities/appointmentPersonnel';
import api from './axios';

// Get appointments by personnel ID with status filter
export async function getPersonnelAppointmentsUseCase(
  personnelId: string,
  status: string = 'booked'
): Promise<AppointmentResponse[]> {
  return getPersonnelAppointmentsApi(personnelId, status);
}

export const getPersonnelAppointmentsApi = async (
  personnelId: string,
  status: string = 'booked'
): Promise<AppointmentResponse[]> => {
  const { data } = await api.get<AppointmentsListResponse>(`/appointments/personnel/${personnelId}?status=${status}`);
  return data.appointments;
};

// Update appointment status for personnel
export async function updatePersonnelAppointmentStatusUseCase(
  appointmentId: string, 
  statusData: { status: string; remark?: string }
): Promise<{ message: string }> {
  return updatePersonnelAppointmentStatusApi(appointmentId, statusData);
}

export const updatePersonnelAppointmentStatusApi = async (
  appointmentId: string, 
  statusData: { status: string; remark?: string }
): Promise<{ message: string }> => {
  const { data } = await api.put(`/appointments/${appointmentId}/status`, statusData);
  return data;
};