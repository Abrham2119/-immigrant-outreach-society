import {
  getClientsByPersonnelUseCase
} from '@/infrastructure/api/personnelClientService';
import { useQuery } from '@tanstack/react-query';

export const useClientsByPersonnel = (
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
) => {
  return useQuery({
    queryKey: ['personnelClients', page, pageSize, search],
    queryFn: () => getClientsByPersonnelUseCase( page, pageSize, search),
  });
};