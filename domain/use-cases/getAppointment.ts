import { deleteAppointmentUseCase, getAppointmentByIdUseCase, getAppointmentsUseCase, updateAppointmentStatusUseCase } from '@/infrastructure/api/getAppointmentService';
import { useMutation, UseMutationResult, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { StatusUpdateRequest, StatusUpdateResponse } from '../entities/geAppointment';


export function useAppointmentManagement() {
  const queryClient = useQueryClient();

  // Get appointments query
  const useAppointments = (pageNum: number, pageSize: number, search: string, status: string) => {
    return useQuery({
      queryKey: ['appointments'],
      queryFn: getAppointmentsUseCase,
    });
  };

  // Get appointment by ID query
  const useAppointment = (appointmentId: string) => {
    return useQuery({
      queryKey: ['appointment', appointmentId],
      queryFn: () => getAppointmentByIdUseCase(appointmentId),
      enabled: !!appointmentId,
    });
  };

  // Update appointment status mutation
  const updateAppointmentStatusMutation: UseMutationResult<
    StatusUpdateResponse, 
    AxiosError, 
    { appointmentId: string; statusData: StatusUpdateRequest }
  > = useMutation({
    mutationFn: ({ appointmentId, statusData }) => updateAppointmentStatusUseCase(appointmentId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error updating appointment status:", error.message);
    },
  });

  // Delete appointment mutation
  const deleteAppointmentMutation: UseMutationResult<{ message: string }, AxiosError, string> = useMutation({
    mutationFn: deleteAppointmentUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error deleting appointment:", error.message);
    },
  });

  return {
    useAppointments,
    useAppointment,
    updateAppointmentStatusMutation,
    deleteAppointmentMutation,
  };
}