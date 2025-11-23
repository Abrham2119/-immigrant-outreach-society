import { AvailableSpot, Exception, Appointment, BookAppointmentRequest, BookAppointmentResponse } from '@/domain/entities/appointment';
import api from './axios';

export const getAvailableSlotsUseCase = async (
  personnelId: string, 
  startDate: string, 
  endDate: string
): Promise<AvailableSpot[]> => {
  const { data } = await api.get(`/availability?personnelId=${personnelId}&startDate=${startDate}&endDate=${endDate}&limit=200`);
  return data.data || [];
};

export const getExceptionsUseCase = async (): Promise<Exception[]> => {
  const { data } = await api.get(`/exceptions`);
  return data.data || [];
};

export const getBookedAppointmentsUseCase = async (): Promise<Appointment[]> => {
  const { data } = await api.get(`/appointments/both/boc`);
  return data.data || [];
};

export const bookAppointmentUseCase = async (appointment: BookAppointmentRequest): Promise<BookAppointmentResponse> => {
  const { data } = await api.post(`/appointments`, appointment);
  return data;
};