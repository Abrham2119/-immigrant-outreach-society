import { AppointmentsListResponse } from "@/domain/entities/appointmentPersonnel";
import { getPersonnelAppointmentsApi, updatePersonnelAppointmentStatusApi } from "@/infrastructure/api/personnelAppointmentService";

export const getPersonnelAppointmentsUseCase = async (
  personnelId: string,
  status: string = 'booked'
): Promise<AppointmentsListResponse> => {
  return getPersonnelAppointmentsApi(personnelId, status);
};

export const updatePersonnelAppointmentStatusUseCase = async (
  appointmentId: string,
  statusData: { status: string; remark?: string }
): Promise<{ message: string }> => {
  return updatePersonnelAppointmentStatusApi(appointmentId, statusData);
};