import { AppointmentsListResponse } from "@/domain/entities/appointmentPersonnel";
import { getPersonnelAppointmentsApi, updatePersonnelAppointmentStatusApi } from "@/infrastructure/api/personnelAppointmentService";

export const getPersonnelAppointmentsUseCase = async (
  personnelId: string,
  status: string = 'booked',
  page: number = 1,
  limit: number = 8,
  search: string = ''
): Promise<AppointmentsListResponse> => {
  return getPersonnelAppointmentsApi(personnelId, status, page, limit, search);
};

export const updatePersonnelAppointmentStatusUseCase = async (
  appointmentId: string,
  statusData: { status: string; remark?: string }
): Promise<{ message: string }> => {
  return updatePersonnelAppointmentStatusApi(appointmentId, statusData);
};