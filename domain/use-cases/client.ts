import {
  StatusUpdateRequest,
  StatusUpdateResponse
} from '@/domain/entities/client';
import {
  deleteClientUseCase,
  getClientByIdUseCase,
  getClientsUseCase,
  updateClientStatusUseCase
} from '@/infrastructure/api/clientService';
import { useMutation, UseMutationResult, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';

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
    enabled: !!clientId,
  });
};

// Update status mutation
export const useUpdateClientStatus = (): UseMutationResult<
  StatusUpdateResponse, 
  AxiosError, 
  { clientId: string; statusData: StatusUpdateRequest }
> => {
  return useMutation({
    mutationFn: ({ clientId, statusData }) => updateClientStatusUseCase(clientId, statusData),
  });
};

// Delete client mutation
export const useDeleteClient = (): UseMutationResult<{ message: string }, AxiosError, string> => {
  return useMutation({
    mutationFn: deleteClientUseCase,
  });
};