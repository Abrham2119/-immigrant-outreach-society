import { deleteAppointmentUseCase, getAppointmentByIdUseCase, getAppointmentsUseCase, updateAppointmentStatusUseCase } from '@/infrastructure/api/getAppointmentService';
import { useMutation, useQuery } from '@tanstack/react-query';
import { StatusUpdateRequest } from '../entities/geAppointment';

export const useAppointments = (pageNum: number, pageSize: number, search: string, status: string) => {
  return useQuery({
    queryKey: ['appointments', pageNum, pageSize, search, status],
    queryFn: () => getAppointmentsUseCase(pageNum, pageSize, search, status),
  });
};

export const useAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: ['appointment', appointmentId],
    queryFn: () => getAppointmentByIdUseCase(appointmentId),
  });
};

export const useUpdateAppointmentStatus = () => {
  return useMutation({
    mutationFn: ({ appointmentId, statusData }: { appointmentId: string; statusData: StatusUpdateRequest }) => 
      updateAppointmentStatusUseCase(appointmentId, statusData),
  });
};

export const useDeleteAppointment = () => {
  return useMutation({
    mutationFn: (appointmentId: string) => deleteAppointmentUseCase(appointmentId),
  });
};