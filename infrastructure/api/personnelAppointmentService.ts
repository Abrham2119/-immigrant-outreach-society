import { AppointmentsListResponse } from "@/domain/entities/appointmentPersonnel";
import api from "@/infrastructure/api/axios";

export const getPersonnelAppointmentsApi = async (
  personnelId: string,
  status: string = 'booked',
  page: number = 1,
  limit: number = 8,
  search: string = ''
): Promise<AppointmentsListResponse> => {
  const params = new URLSearchParams({
    status,
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  const { data } = await api.get<AppointmentsListResponse>(`/appointments/personnel/${personnelId}?${params}`);  
  return data;
};

export const updatePersonnelAppointmentStatusApi = async (
  appointmentId: string, 
  statusData: { status: string; remark?: string }
): Promise<{ message: string }> => {
  const { data } = await api.put(`/status/${appointmentId}/Personnel`, statusData);
  return data;
};