import { AppointmentStatus } from "@/domain/entities/appointmentPersonnel";
import { 
  getPersonnelAppointmentsAllClientsUseCase, 
  updatePersonnelAppointmentStatusAllClientsUseCase,
  getAllAppointmentsAllClientsUseCase 
} from "@/infrastructure/api/personnelAppointmentAllClientsService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

interface UsePersonnelAppointmentsAllClientsParams {
  personnelId: string;
  status: AppointmentStatus;
  page?: number;
  limit?: number;
  search?: string;
  date?:string
}

interface UseAllAppointmentsAllClientsParams {
  date?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const usePersonnelAppointmentsAllClients = (params: UsePersonnelAppointmentsAllClientsParams) => {  
  return useQuery({
    queryKey: ["personnelAppointmentsAllClients", params],
    queryFn: () => getPersonnelAppointmentsAllClientsUseCase(
      params.personnelId, 
      params.status, 
      params.date, 
      params.page, 
      params.limit, 
      params.search
    ),
    enabled: !!params.personnelId,
  });
};

export const useAllAppointmentsAllClients = (params: UseAllAppointmentsAllClientsParams) => {  
  return useQuery({
    queryKey: ["allAppointmentsAllClients", params],
    queryFn: () => getAllAppointmentsAllClientsUseCase(params.date, params.status, params.search, params.page, params.limit),
  });
};

export const useUpdateAppointmentStatusAllClients = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      appointmentId, 
      statusData 
    }: { 
      appointmentId: string; 
      statusData: { status: string; remark?: string } 
    }) => updatePersonnelAppointmentStatusAllClientsUseCase(appointmentId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personnelAppointmentsAllClients"] });
      queryClient.invalidateQueries({ queryKey: ["allAppointmentsAllClients"] });
    },
  });
};

export const usePersonnelIdAllClients = () => {
  const { data: session } = useSession();
  return session?.user?.id;
};

export const usePersonnelAppointmentManagementAllClients = () => {
  const personnelId = usePersonnelIdAllClients();

  return {
    personnelId,
    usePersonnelAppointmentsAllClients,
    useAllAppointmentsAllClients,
    useUpdateAppointmentStatusAllClients
  };
};