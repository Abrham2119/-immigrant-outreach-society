import { AppointmentsListResponse } from "@/domain/entities/appointmentPersonnel";
import api from "@/infrastructure/api/axios";

export const getPersonnelAppointmentsAllClientsUseCase = async (
  personnelId: string,
  status: string = 'booked',
  date: string = '',
  page: number = 1,
  limit: number = 8,
  search: string = ''
): Promise<AppointmentsListResponse> => {
  const params = new URLSearchParams({
    status,
    page: page.toString(),
    limit: limit.toString(),
    ...(date && { date }),
    ...(search && { search })
  });
  
  const { data } = await api.get<AppointmentsListResponse>(`/appointments?${params}`);  
  return data;
};

export const updatePersonnelAppointmentStatusAllClientsUseCase = async (
  appointmentId: string, 
  statusData: { status: string; remark?: string }
): Promise<{ message: string }> => {
  const { data } = await api.patch(`/status/${appointmentId}`, statusData);
  return data;
};

export const getAllAppointmentsAllClientsUseCase = async (
  date?: string,
  status?: string,
  search?: string,
  page: number = 1,
  limit: number = 20
): Promise<AppointmentsListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(date && { date }),
    ...(status && { status }),
    ...(search && { search })
  });
  
  const { data } = await api.get<AppointmentsListResponse>(`/appointments?${params}`);
  return data;
};