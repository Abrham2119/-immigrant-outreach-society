import { AppointmentsListResponse, AppointmentResponse } from "@/domain/entities/appointmentPersonnel";
import api from "@/infrastructure/api/axios";

export async function getPersonnelAppointmentsApi(
  personnelId: string,
  status: string = 'booked'
): Promise<AppointmentsListResponse> {
  const { data } = await api.get<AppointmentResponse[]>(`/appointments/personnel/${personnelId}?status=${status}`);
  
  return {
    data: data,
    total: data.length
  };
}

export async function updatePersonnelAppointmentStatusApi(
  appointmentId: string, 
  statusData: { status: string; remark?: string }
): Promise<{ message: string }> {
  const { data } = await api.patch(`/appointments/${appointmentId}/status`, statusData);
  return data;
}