import { Client, ClientGetByID, ClientsResponse, StatusUpdateRequest, StatusUpdateResponse } from '@/domain/entities/client';
import api from './axios';

// Get clients with pagination and filters
export async function getClientsUseCase(
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  status: string = 'all'
): Promise<ClientsResponse> {
  return getClientsApi(page, pageSize, search, status);
}

export const getClientsApi = async (
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
export const getClientByIdApi = async (clientId: string): Promise<ClientGetByID> => {
  const { data } = await api.get(`/clients/${clientId}`);
  return data; // Return the entire response object
};

export async function getClientByIdUseCase(clientId: string): Promise<ClientGetByID> {
  return getClientByIdApi(clientId);
}

// Update client status
export async function updateClientStatusUseCase(
  clientId: string, 
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> {
  return updateClientStatusApi(clientId, statusData);
}

export const updateClientStatusApi = async (
  clientId: string, 
  statusData: StatusUpdateRequest
): Promise<StatusUpdateResponse> => {
  const { data } = await api.put(`/status/${clientId}/receptionist`, statusData);
  return data;
};

// Delete client
export async function deleteClientUseCase(clientId: string): Promise<{ message: string }> {
  return deleteClientApi(clientId);
}

export const deleteClientApi = async (clientId: string): Promise<{ message: string }> => {
  const { data } = await api.delete(`/clients/${clientId}`);
  return data;
};