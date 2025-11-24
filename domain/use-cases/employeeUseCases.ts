// domain/use-cases/employeeUseCases.ts
import { 
  createEmployeeService, 
  getEmployeesService, 
  updateEmployeeService, 
  deleteEmployeeService,
  getEmployeeByIdService 
} from '@/infrastructure/api/employeeService';
import { CreateEmployeeRequest, UpdateEmployeeRequest, Employee } from '../entities/employee';

export async function createEmployeeUseCase(employee: CreateEmployeeRequest) {
  return createEmployeeService(employee);
}

export async function getEmployeesUseCase(page: number = 1, limit: number = 10, search: string = "", role: string = "all") {
  return getEmployeesService(page, limit, search, role);
}

export async function updateEmployeeUseCase(employeeId: string, updates: UpdateEmployeeRequest) {
  return updateEmployeeService(employeeId, updates);
}

export async function deleteEmployeeUseCase(employeeId: string) {
  return deleteEmployeeService(employeeId);
}

export async function getEmployeeByIdUseCase(employeeId: string) {
  return getEmployeeByIdService(employeeId);
}