// infrastructure/api/employeeService.ts
import api from './axios';
import { 
  Employee, 
  CreateEmployeeRequest, 
  UpdateEmployeeRequest, 
  EmployeesResponse, 
  EmployeeResponse 
} from '@/domain/entities/employee';

export async function createEmployeeService(employee: CreateEmployeeRequest): Promise<EmployeeResponse> {
  const { data } = await api.post('/employees/register', employee);
  return data;
}

export async function getEmployeesService(page: number = 1, limit: number = 10, search: string = "", role: string = "all"): Promise<EmployeesResponse> {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('limit', limit.toString());
  if (search) params.append('search', search);
  if (role && role !== 'all') params.append('role', role);
  
  const { data } = await api.get(`/employees/all?${params.toString()}`);
  return data;
}

export async function updateEmployeeService(employeeId: string, updates: UpdateEmployeeRequest): Promise<EmployeeResponse> {
  const { data } = await api.put(`/employees/${employeeId}`, updates);
  return data;
}

export async function deleteEmployeeService(employeeId: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.delete(`/employees/${employeeId}`);
  return data;
}

export async function getEmployeeByIdService(employeeId: string): Promise<EmployeeResponse> {
  const { data } = await api.get(`/employees/${employeeId}`);
  return data;
}