// domain/use-cases/rule.ts - Complete file
import { Exception, Rule } from "@/domain/entities/appointment";
import {  createExceptionUseCase, createRuleApi, deleteExceptionUseCase } from "@/infrastructure/api/appointmentService";
import api from "@/infrastructure/api/axios";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

// Use case functions
export async function createRuleUseCase(form: Rule): Promise<{ message: string }> {
  return createRuleApi(form);
}


export async function createHolidayExceptionUseCase(exception: Exception): Promise<{ message: string }> {
  return createHolidayExceptionUseCase(exception);
}
// React Query hooks
export function useRuleManagement() {
  const queryClient = useQueryClient();

  // Create Rule Mutation
  const createRuleMutation: UseMutationResult<{ message: string }, AxiosError, Rule> = useMutation({
    mutationFn: createRuleUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error creating rule:", error.message);
    },
  });

  // Create Exception Mutation
 const createExceptionMutation: UseMutationResult<Exception, AxiosError, Exception> = useMutation({
    mutationFn: createExceptionUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error creating exception:", error.message);
    },
  });

  const deleteExceptionMutation: UseMutationResult<{ message: string }, AxiosError, string> = useMutation({
    mutationFn: deleteExceptionUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
    },
    onError: (error: AxiosError) => {
      console.error("Error deleting exception:", error.message);
    },
  });


  // Get Rules Query
  const useRules = (personnelId?: string) => {
    return useQuery({
      queryKey: ['rules', personnelId],
      queryFn: async () => {
        const { data } = await api.get(`/rules${personnelId ? `?personnelId=${personnelId}` : ''}`);
        return data;
      },
      enabled: !!personnelId,
    });
  };

  // Get Exceptions Query
  const useExceptions = (personnelId?: string) => {
    return useQuery({
      queryKey: ['exceptions', personnelId],
      queryFn: async () => {
        const { data } = await api.get(`/exceptions${personnelId ? `?personnelId=${personnelId}` : ''}`);
        return data;
      },
      enabled: !!personnelId,
    });
  };

  return { 
    createRuleMutation, 
    createExceptionMutation,
    useRules,
    deleteExceptionMutation,
    useExceptions
  };
}

