import { useMutation, useQuery, UseMutationResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { 
  getPersonnelAppointmentsUseCase, 
  updatePersonnelAppointmentStatusUseCase 
} from '@/infrastructure/api/personnelAppointmentService';
import { useSession } from 'next-auth/react';
import { AppointmentResponse } from '../entities/appointmentPersonnel';

export function usePersonnelAppointmentManagement() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Get personnel ID from session
  const personnelId = session?.user?.id;

  // Get personnel appointments query
  const usePersonnelAppointments = (status: string = 'booked') => {
    return useQuery<AppointmentResponse[], Error>({
      queryKey: ['personnelAppointments', personnelId, status],
      queryFn: () => getPersonnelAppointmentsUseCase(personnelId!, status),
      enabled: !!personnelId,
    });
  };

  // Update appointment status mutation
  const updateAppointmentStatusMutation: UseMutationResult<
    { message: string }, 
    AxiosError, 
    { appointmentId: string; statusData: { status: string; remark?: string } }
  > = useMutation({
    mutationFn: ({ appointmentId, statusData }) => 
      updatePersonnelAppointmentStatusUseCase(appointmentId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personnelAppointments'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error updating appointment status:", error.message);
    },
  });

  return {
    usePersonnelAppointments,
    updateAppointmentStatusMutation,
    personnelId,
  };
}