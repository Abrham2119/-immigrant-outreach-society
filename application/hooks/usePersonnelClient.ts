import { PersonnelFormsResponse } from '@/domain/entities/assesments/personnelClient';
import { getClientsByPersonnelUseCase } from '@/domain/use-cases/personnelClient';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useClientsByPersonnel = (
  page: number = 1,
  pageSize: number = 10,
  search: string = ''
) => {
  const { data: session } = useSession();
  const personnelId = session?.user?.id;

  return useQuery<PersonnelFormsResponse, Error>({
    queryKey: ['personnelClients', personnelId, page, pageSize, search],
    queryFn: () => getClientsByPersonnelUseCase(personnelId!, page, pageSize, search),
    enabled: !!personnelId,
  });
};