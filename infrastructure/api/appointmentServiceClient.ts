import { AvailableSpot, Exception, Appointment, BookAppointmentRequest, BookAppointmentResponse } from '@/domain/entities/appointment';
import api from './axios';

// Get available slots
export async function getAvailableSlotsUseCase(
  personnelId: string, 
  startDate: string, 
  endDate: string
): Promise<AvailableSpot[]> {
  return getAvailableSlotsApi(personnelId, startDate, endDate);
}

export const getAvailableSlotsApi = async (
  personnelId: string, 
  startDate: string, 
  endDate: string
): Promise<AvailableSpot[]> => {
  const { data } = await api.get(`/availability?personnelId=${personnelId}&startDate=${startDate}&endDate=${endDate}`);
  return data;
};

// Get exceptions
export async function getExceptionsUseCase(): Promise<Exception[]> {
  return getExceptionsApi();
}

export const getExceptionsApi = async (): Promise<Exception[]> => {
  const { data } = await api.get(`/exceptions`);
  return data;
};

// Get booked appointments
export async function getBookedAppointmentsUseCase(): Promise<Appointment[]> {
  return getBookedAppointmentsApi();
}

export const getBookedAppointmentsApi = async (): Promise<Appointment[]> => {
  const { data } = await api.get(`/appointments/booked`);
  return data;
};

// Book appointment
export async function bookAppointmentUseCase(appointment: BookAppointmentRequest): Promise<BookAppointmentResponse> {
  return bookAppointmentApi(appointment);
}

export const bookAppointmentApi = async (appointment: BookAppointmentRequest): Promise<BookAppointmentResponse> => {
  const { data } = await api.post(`/appointments`, appointment);
  return data;
};