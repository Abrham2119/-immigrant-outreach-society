export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;    
  updatedAt: string; 
  __v: number;
}

export interface Personnel {
  success: boolean;
  count: number;
  employees: Employee[];
}
