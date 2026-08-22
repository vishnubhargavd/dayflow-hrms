import { apiRequest } from './client';

export interface EmployeeListItem {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  department: {
    id: string;
    name: string;
  } | null;
  joiningDate: string;
  status: string;
}

export interface EmployeesPaginatedData {
  items: EmployeeListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchEmployees(page: number = 1, limit: number = 10): Promise<EmployeesPaginatedData> {
  const res = await apiRequest<EmployeesPaginatedData>(`/employees?page=${page}&limit=${limit}`);
  return res.data || { items: [], total: 0, page: 1, limit: 10, totalPages: 0 };
}
