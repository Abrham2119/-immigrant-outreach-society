import { useMutation, useQuery, UseMutationResult } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { 
  Client, 
  ClientsResponse, 
  StatusUpdateRequest, 
  StatusUpdateResponse 
} from '@/domain/entities/client';
import { 
  getClientsUseCase, 
  getClientByIdUseCase, 
  updateClientStatusUseCase, 
  deleteClientUseCase 
} from '@/infrastructure/api/clientService';

export function useClientManagement() {
  const queryClient = useQueryClient();

  // Get clients query
  const useClients = (page: number, pageSize: number, search: string, status: string) => {
    return useQuery({
      queryKey: ['clients', page, pageSize, search, status],
      queryFn: () => getClientsUseCase(page, pageSize, search, status),
    });
  };

  // Get client by ID query
  const useClient = (clientId: string) => {
    return useQuery({
      queryKey: ['client', clientId],
      queryFn: () => getClientByIdUseCase(clientId),
      enabled: !!clientId,
    });
  };

  // Update status mutation
  const updateClientStatusMutation: UseMutationResult<
    StatusUpdateResponse, 
    AxiosError, 
    { clientId: string; statusData: StatusUpdateRequest }
  > = useMutation({
    mutationFn: ({ clientId, statusData }) => updateClientStatusUseCase(clientId, statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error updating client status:", error.message);
    },
  });

  // Delete client mutation
  const deleteClientMutation: UseMutationResult<{ message: string }, AxiosError, string> = useMutation({
    mutationFn: deleteClientUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error deleting client:", error.message);
    },
  });

  return {
    useClients,
    useClient,
    updateClientStatusMutation,
    deleteClientMutation,
  };
}