import { z } from 'zod';
import { AttendanceStatus } from '@prisma/client';

export const checkInSchema = z.object({
  notes: z.string().max(255).optional(),
});

export const checkOutSchema = z.object({
  notes: z.string().max(255).optional(),
});

export const attendanceQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Page must be a positive integer',
    }),
  limit: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100), {
      message: 'Limit must be a positive integer up to 100',
    }),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'startDate must be a valid ISO date string (YYYY-MM-DD)',
    }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'endDate must be a valid ISO date string (YYYY-MM-DD)',
    }),
  date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'date must be a valid ISO date string (YYYY-MM-DD)',
    }),
  status: z
    .nativeEnum(AttendanceStatus, {
      errorMap: () => ({ message: `Invalid status. Must be one of: ${Object.values(AttendanceStatus).join(', ')}` }),
    })
    .optional(),
  employeeId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
});

export const weeklyAttendanceQuerySchema = z.object({
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: 'startDate must be a valid date string (YYYY-MM-DD)',
    }),
  employeeId: z.string().uuid().optional(),
});

export const monthlyAttendanceQuerySchema = z.object({
  month: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 12), {
      message: 'Month must be between 1 and 12',
    }),
  year: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) >= 2000 && Number(val) <= 2100), {
      message: 'Year must be a valid 4-digit year',
    }),
  employeeId: z.string().uuid().optional(),
});
