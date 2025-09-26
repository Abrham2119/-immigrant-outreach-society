import { Appointment, StatusUpdateRequest, StatusUpdateResponse } from '@/domain/entities/geAppointment';
import api from './axios';

// Get all appointments
export async function getAppointmentsUseCase(): Promise<Appointment[]> {
  return getAppointmentsApi();
}

export const getAppointmentsApi = async (): Promise<Appointment[]> => {
  const { data } = await api.get(`/appointments`);
  return data;
};

// Get appointment by ID
export async function getAppointmentByIdUseCase(appointmentId: string): Promise<Appointment> {
  return getAppointmentByIdApi(appointmentId);
}

export const getAppointmentByIdApi = async (appointmentId: string): Promise<Appointment> => {
  const { data } = await api.get(`/appointments/${appointmentId}`);
  return data;
};

// Update appointment status
export async function updateAppointmentStatusUseCase(
  appointmentId: string, 
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> {
  return updateAppointmentStatusApi(appointmentId, statusData);
}

export const updateAppointmentStatusApi = async (
  appointmentId: string, 
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> => {
  const { data } = await api.put(`/appointments/${appointmentId}/status`, statusData);
  return data;
};

// Delete appointment
export async function deleteAppointmentUseCase(appointmentId: string): Promise<{ message: string }> {
  return deleteAppointmentApi(appointmentId);
}

export const deleteAppointmentApi = async (appointmentId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/appointments/${appointmentId}`);
  return data;
};