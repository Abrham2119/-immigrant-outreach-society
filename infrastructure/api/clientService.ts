import { ClientGetByID, ClientsResponse, StatusUpdateRequest, StatusUpdateResponse } from '@/domain/entities/client';
import api from './axios';

// Get clients with pagination and filters
export const getClientsUseCase = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  status: string = 'all'
): Promise<ClientsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
    ...(search && { search }),
    ...(status !== 'all' && { status })
  });

  const { data } = await api.get(`/clients?${params}`);
  return data;
};

// Get client by ID
export const getClientByIdUseCase = async (clientId: string): Promise<ClientGetByID> => {
  const { data } = await api.get(`/clients/${clientId}`);
  return data;
};

// Update client status
export const updateClientStatusUseCase = async (
  clientId: string, 
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> => {
  const { data } = await api.put(`/status/${clientId}/Receptionist`, statusData);
  return data;
};

// Delete client
export const deleteClientUseCase = async (clientId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/clients/${clientId}`);
  return data;
};