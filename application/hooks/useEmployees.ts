// application/hooks/useEmployees.ts
import { CreateEmployeeRequest, UpdateEmployeeRequest } from "@/domain/entities/employee";
import {
    createEmployeeUseCase,
    deleteEmployeeUseCase,
    getEmployeeByIdUseCase,
    getEmployeesUseCase,
    updateEmployeeUseCase
} from "@/domain/use-cases/employeeUseCases";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useEmployees(page: number = 1, limit: number = 10, search: string = "", role: string = "all") {
  return useQuery({
    queryKey: ['employees', page, limit, search, role],
    queryFn: () => getEmployeesUseCase(page, limit, search, role),
  });
}

export function useEmployeeById(employeeId: string) {
  return useQuery({
    queryKey: ['employee', employeeId],
    queryFn: () => getEmployeeByIdUseCase(employeeId),
    enabled: !!employeeId,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (employee: CreateEmployeeRequest) => createEmployeeUseCase(employee),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ employeeId, updates }: { employeeId: string; updates: UpdateEmployeeRequest }) => 
      updateEmployeeUseCase(employeeId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (employeeId: string) => deleteEmployeeUseCase(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}