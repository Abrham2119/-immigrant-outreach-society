import { getClientsByPersonnelApi } from '@/infrastructure/api/personnelClientService';
import { PersonnelFormsResponse } from '../entities/assesments/personnelClient';

export const getClientsByPersonnelUseCase = async (
  personnelId: string,
  page: number = 1,
  limit: number = 10,
  search: string = ''
): Promise<PersonnelFormsResponse> => {
  return getClientsByPersonnelApi(personnelId, page, limit, search);
};