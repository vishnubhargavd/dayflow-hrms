import { apiRequest } from './client';

export interface PayrollRunItem {
  id: string;
  month: number;
  year: number;
  status: string;
  totalEmployees: number;
  totalGrossSalary: number;
  totalNetSalary: number;
  processedAt?: string;
}

export interface MyPayslipItem {
  id: string;
  month: string;
  year: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: string;
}

export async function fetchPayrollRuns(): Promise<PayrollRunItem[]> {
  try {
    const res = await apiRequest<{ items: PayrollRunItem[] }>('/payroll/runs');
    return res.data?.items || [];
  } catch {
    return [];
  }
}

export async function fetchMyPayslips(): Promise<MyPayslipItem[]> {
  try {
    const res = await apiRequest<{ items: MyPayslipItem[] }>('/payroll/my-payslips');
    return res.data?.items || [];
  } catch {
    return [];
  }
}
