import {
    StatusUpdateRequest
} from '@/domain/entities/client';
import {
    deleteClientUseCase,
    getClientByIdUseCase,
    getClientsUseCase,
    updateClientStatusUseCase
} from '@/infrastructure/api/clientService';
import { useMutation, useQuery } from '@tanstack/react-query';

// Get clients query
export const useClients = (page: number, pageSize: number, search: string, status: string) => {
  return useQuery({
    queryKey: ['clients', page, pageSize, search, status],
    queryFn: () => getClientsUseCase(page, pageSize, search, status),
  });
};

// Get client by ID query
export const useClient = (clientId: string) => {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClientByIdUseCase(clientId),
  });
};

// Update status mutation
export const useUpdateClientStatus = () => {
  return useMutation({
    mutationFn: ({ clientId, statusData }: { clientId: string; statusData: StatusUpdateRequest }) => 
      updateClientStatusUseCase(clientId, statusData),
  });
};

// Delete client mutation
export const useDeleteClient = () => {
  return useMutation({
    mutationFn: (clientId: string) => deleteClientUseCase(clientId),
  });
};