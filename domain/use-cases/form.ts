import {
  getFormByIdUseCase,
  getFormsByClientIdUseCase,
  getFormsUseCase
} from '@/infrastructure/api/formService';
import { useQuery } from '@tanstack/react-query';

export const useForms = (page: number, pageSize: number, search: string, service: string) => {
  return useQuery({
    queryKey: ['forms', page, pageSize, search, service],
    queryFn: () => getFormsUseCase(page, pageSize, search, service),
  });
};

export const useForm = (formId: string) => {
  return useQuery({
    queryKey: ['form', formId],
    queryFn: () => getFormByIdUseCase(formId),
    enabled: !!formId,
  });
};

export const useFormsByClient = (clientId: string) => {
  return useQuery({
    queryKey: ['forms', 'client', clientId],
    queryFn: () => getFormsByClientIdUseCase(clientId),
  });
};