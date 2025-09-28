// domain/use-cases/form.ts
import {
    getFormByIdUseCase,
    getFormsByClientIdUseCase,
    getFormsUseCase
} from '@/infrastructure/api/formService';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export function useFormManagement() {
  const queryClient = useQueryClient();

  // Get forms query
  const useForms = (page: number, pageSize: number, search: string, service: string) => {
    return useQuery({
      queryKey: ['forms', page, pageSize, search, service],
      queryFn: () => getFormsUseCase(page, pageSize, search, service),
    });
  };

  // Get form by ID query
  const useForm = (formId: string) => {
    return useQuery({
      queryKey: ['form', formId],
      queryFn: () => getFormByIdUseCase(formId),
      enabled: !!formId,
    });
  };

  // Get forms by client ID query
  const useFormsByClient = (clientId: string) => {
    return useQuery({
      queryKey: ['forms', 'client', clientId],
      queryFn: () => getFormsByClientIdUseCase(clientId),
      enabled: !!clientId,
    });
  };

  return {
    useForms,
    useForm,
    useFormsByClient,
  };
}