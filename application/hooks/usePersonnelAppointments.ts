import { AppointmentStatus } from "@/domain/entities/appointmentPersonnel";
import { getPersonnelAppointmentsUseCase, updatePersonnelAppointmentStatusUseCase } from "@/domain/use-cases/personnelAppointment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UsePersonnelAppointmentsParams {
  personnelId: string;
  status: AppointmentStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export const usePersonnelAppointments = (params: UsePersonnelAppointmentsParams, p0: { enabled: boolean; }) => {  
  return useQuery({
    queryKey: ["personnelAppointments", params],
    queryFn: () => getPersonnelAppointmentsUseCase(params.personnelId, params.status, params.page, params.limit, params.search),
    enabled: !!params.personnelId,
  });
};

export const useUpdateAppointmentStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      appointmentId, 
      statusData 
    }: { 
      appointmentId: string; 
      statusData: { status: string; remark?: string } 
    }) => updatePersonnelAppointmentStatusUseCase(appointmentId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnelAppointments"] });
    },
  });
};

export const usePersonnelAppointmentManagement = () => {
  const { data: session } = useSession();
  const personnelId = session?.user?.id;

  return {
    personnelId,
    usePersonnelAppointments,
    useUpdateAppointmentStatus
  };
};