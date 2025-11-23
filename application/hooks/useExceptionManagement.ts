// /application/hooks/useExceptionManagement.ts
import { StatusUpdateRequest } from '@/domain/entities/assesments/exception';
import { getExceptionsUseCase, updateExceptionStatusUseCase } from '@/infrastructure/api/exceptionService';
import { useMutation, useQuery } from '@tanstack/react-query';

// Get exceptions query - Updated parameters to match API
export const useExceptions = (
  page: number, 
  limit: number, 
  search: string, 
  status: string, 
  type: string,
  personnelId?: string
) => {
  return useQuery({
    queryKey: ['exceptions', page, limit, search, status, type, personnelId],
    queryFn: () => getExceptionsUseCase(page, limit, search, status, type, personnelId),
    retry: 1,
  });
};

// Update status mutation
export const useUpdateExceptionStatus = () => {
  return useMutation({
    mutationFn: ({ 
      exceptionId, 
      statusData 
    }: { 
      exceptionId: string; 
      statusData: StatusUpdateRequest 
    }) => updateExceptionStatusUseCase(exceptionId, statusData),
  });
};