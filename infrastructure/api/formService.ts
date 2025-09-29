// infrastructure/api/formService.ts
import api from './axios';
import { Form, FormsResponse, FormResponse } from '@/domain/entities/form';

// Get forms with pagination and filters
export async function getFormsUseCase(
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  service: string = 'all'
): Promise<FormsResponse> {
  return getFormsApi(page, pageSize, search, service);
}

export const getFormsApi = async (
  page: number = 1,
  pageSize: number = 10,
  search: string = '',
  service: string = 'all'
): Promise<FormsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: pageSize.toString(),
    ...(search && { search }),
    ...(service !== 'all' && { service })
  });

  const { data } = await api.get(`/forms?${params}`);
  return data;
};

// Get form by ID
export const getFormByIdApi = async (formId: string): Promise<FormResponseId> => {
  const { data } = await api.get(`/forms/client/${formId}`);
  return data;
};

export async function getFormByIdUseCase(formId: string): Promise<FormResponseId> {
  return getFormByIdApi(formId);
}

// Get forms by client ID
export const getFormsByClientIdApi = async (clientId: string): Promise<FormsResponse> => {
  const { data } = await api.get(`/forms/client/${clientId}`);
  return data;
};

export async function getFormsByClientIdUseCase(clientId: string): Promise<FormsResponse> {
  return getFormsByClientIdApi(clientId);
}