import { Appointment, AppointmentsResponse, StatusUpdateRequest, StatusUpdateResponse } from '@/domain/entities/geAppointment';
import api from './axios';

export const getAppointmentsUseCase = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  status: string = 'all'
): Promise<AppointmentsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
    ...(search && { search }),
    ...(status !== 'all' && { status })
  });

  const { data } = await api.get(`/appointments?${params}`);
  return data;
};

export const getAppointmentByIdUseCase = async (appointmentId: string): Promise<Appointment> => {
  const { data } = await api.get(`/appointments/${appointmentId}`);
  return data;
};


export const updateAppointmentStatusUseCase = async (
  appointmentId: string, 
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> => {
  const { data } = await api.put(`/status/${appointmentId}`, statusData);
  return data;
};

export const deleteAppointmentUseCase = async (appointmentId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/appointments/${appointmentId}`);
  return data;
};