// domain/use-cases/rule.ts
import { Exception, Rule } from "@/domain/entities/appointment";
import { 
  createExceptionUseCase, 
  createRuleUseCase, 
  deleteExceptionUseCase, 
  deleteRuleUseCase, 
  getRuleByIdUseCase, 
  updateRuleUseCase 
} from "@/infrastructure/api/appointmentService";
import api from "@/infrastructure/api/axios";
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

// React Query hooks
export function useRuleManagement() {
  const queryClient = useQueryClient();

  // Create Rule Mutation
  const createRuleMutation: UseMutationResult<Rule, AxiosError, Rule> = useMutation({
    mutationFn: createRuleUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });

  // Update Rule Mutation
  const updateRuleMutation: UseMutationResult<Rule, AxiosError, { ruleId: string; rule: Rule }> = useMutation({
    mutationFn: ({ ruleId, rule }) => updateRuleUseCase(ruleId, rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });

  // Delete Rule Mutation
  const deleteRuleMutation: UseMutationResult<{ message: string }, AxiosError, string> = useMutation({
    mutationFn: deleteRuleUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });

  // Create Exception Mutation
  const createExceptionMutation: UseMutationResult<Exception, AxiosError, Exception> = useMutation({
    mutationFn: createExceptionUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
    },
  });

  // Delete Exception Mutation
  const deleteExceptionMutation: UseMutationResult<{ message: string }, AxiosError, string> = useMutation({
    mutationFn: deleteExceptionUseCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exceptions'] });
    },
  });

  // Get Rules Query
  const useRules = (personnelId?: string) => {
    return useQuery({
      queryKey: ['rules', personnelId],
      queryFn: async () => {
        const { data } = await api.get(`/rules${personnelId ? `?personnelId=${personnelId}` : ''}`);
        return data.data;
      },
      enabled: !!personnelId,
    });
  };

  // Get Rule by ID Query
  const useRule = (ruleId: string) => {
    return useQuery({
      queryKey: ['rule', ruleId],
      queryFn: () => getRuleByIdUseCase(ruleId),
      enabled: !!ruleId,
    });
  };

  // Get Exceptions Query
  const useExceptions = (personnelId?: string) => {
    return useQuery({
      queryKey: ['exceptions', personnelId],
      queryFn: async () => {
        const { data } = await api.get(`/exceptions${personnelId ? `?personnelId=${personnelId}` : ''}`);
        return data.data;
      },
      enabled: !!personnelId,
    });
  };

  return { 
    createRuleMutation, 
    updateRuleMutation,
    deleteRuleMutation,
    createExceptionMutation,
    deleteExceptionMutation,
    useRules,
    useRule,
    useExceptions
  };
}