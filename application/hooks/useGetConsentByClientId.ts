import { getConsentByClientIdUseCase } from '@/domain/use-cases/getConsentByClientId';
import { useQuery } from '@tanstack/react-query';

export const useGetConsentByClientId = (clientId: string | null) => {
  return useQuery({
    queryKey: ['consent', clientId],
    queryFn: () => getConsentByClientIdUseCase(clientId!),
    enabled: !!clientId,
  });
};