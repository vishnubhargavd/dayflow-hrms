import { z } from 'zod';
import { SalaryComponentType, PayrollStatus } from '@prisma/client';

export const createSalaryComponentSchema = z.object({
  name: z.string().min(2, 'Component name must be at least 2 characters').max(100),
  type: z.nativeEnum(SalaryComponentType, {
    errorMap: () => ({ message: 'Component type must be EARNING or DEDUCTION' }),
  }),
  description: z.string().optional(),
  isTaxable: z.boolean().optional().default(true),
  isActive: z.boolean().optional().default(true),
});

export const updateSalaryComponentSchema = createSalaryComponentSchema.partial();

export const salaryStructureItemSchema = z.object({
  salaryComponentId: z.string().uuid('Invalid salary component ID'),
  amount: z.number().min(0, 'Component amount cannot be negative'),
});

export const assignSalaryStructureSchema = z.object({
  employeeId: z.string().uuid('Invalid employee ID'),
  baseSalary: z.number().min(0, 'Base salary cannot be negative'),
  effectiveDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  reason: z.string().min(2, 'Reason for salary update is required').default('Salary structure assignment'),
  items: z.array(salaryStructureItemSchema).default([]),
});

export const processPayrollSchema = z.object({
  employeeId: z.string().uuid('Invalid employee ID'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2000).max(2100),
  paymentDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  attendanceData: z
    .object({
      workingDays: z.number().min(0).optional(),
      presentDays: z.number().min(0).optional(),
      paidLeaveDays: z.number().min(0).optional(),
      unpaidLeaveDays: z.number().min(0).optional(),
      absentDays: z.number().min(0).optional(),
      overtimeHours: z.number().min(0).optional(),
    })
    .optional(),
});

export const updatePayrollStatusSchema = z.object({
  status: z.nativeEnum(PayrollStatus, {
    errorMap: () => ({ message: 'Status must be DRAFT, PROCESSING, APPROVED, or PAID' }),
  }),
  paymentDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const payrollQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  employeeId: z.string().uuid().optional(),
  month: z.string().optional(),
  year: z.string().optional(),
  status: z.nativeEnum(PayrollStatus).optional(),
});
