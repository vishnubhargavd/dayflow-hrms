import { z } from 'zod';
import { Role, Gender, MaritalStatus, EmployeeStatus } from '@prisma/client';

export const createEmployeeSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  role: z.nativeEnum(Role).optional().default(Role.EMPLOYEE),
  phone: z.string().optional(),
  personalEmail: z.string().email().optional(),
  dateOfBirth: z.string().optional(),
  gender: z.nativeEnum(Gender).optional(),
  maritalStatus: z.nativeEnum(MaritalStatus).optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  dateOfJoining: z.string().optional(),
  employeeStatus: z.nativeEnum(EmployeeStatus).optional().default(EmployeeStatus.PROBATION),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  managerId: z.string().optional(),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ifscCode: z.string().optional(),
  panNumber: z.string().optional(),
});

export const getEmployeesQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  departmentId: z.string().optional(),
  status: z.nativeEnum(EmployeeStatus).optional(),
});
