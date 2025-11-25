// domain/entities/employee.ts
export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: EmployeeRole;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: EmployeeRole;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: EmployeeRole;
}

export interface EmployeesResponse {
  success: boolean;
  message: string;
  data: Employee[];
  meta: {
    total: number;
    count: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  employee: Employee;
}

export type EmployeeRole = 
  | "Admin" 
  | "Receptionist" 
  | "PCO" 
  | "Wellness" 
  | "IOCR" 
  | "Settlement" 
  | "Psychosocial" 
  | "Youth" 
  | "SALP" 
  | "GBV" 
  | "Training" 
  | "Policy";