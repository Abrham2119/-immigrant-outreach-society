import { PersonnelFormsResponse } from '@/domain/entities/assesments/personnelClient';
import api from './axios';

export const getClientsByPersonnelApi = async (
  personnelId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PersonnelFormsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });

  const { data } = await api.get<PersonnelFormsResponse>(`/forms/client?${params}`);
  return data;
};