import { FormsResponse } from '@/domain/entities/form';
import { FormResponseId } from '@/domain/entities/formId';
import api from './axios';

export const getFormsUseCase = async (
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

export const getFormByIdUseCase = async (formId: string): Promise<FormResponseId> => {
  const { data } = await api.get(`/forms/${formId}`);
  return data;
};

export const getFormsByClientIdUseCase = async (clientId: string): Promise<FormsResponse> => {
  const { data } = await api.get(`/forms/client/${clientId}`);
  return data;
};