import { z } from 'zod';
import { LeaveCategory, LeaveStatus } from '@prisma/client';

export const applyLeaveSchema = z.object({
  leaveTypeId: z.string().uuid('Invalid leave type ID'),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid start date format',
  }),
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid end date format',
  }),
  reason: z.string().min(3, 'Reason must be at least 3 characters').max(500, 'Reason cannot exceed 500 characters'),
});

export const createLeaveTypeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  code: z.string().min(2, 'Code must be at least 2 characters').toUpperCase(),
  category: z.nativeEnum(LeaveCategory),
  maxDaysPerYear: z.number().int().min(0, 'Max days per year must be a positive integer'),
  description: z.string().optional(),
});

export const allocateBalanceSchema = z.object({
  employeeId: z.string().uuid('Invalid employee ID'),
  leaveTypeId: z.string().uuid('Invalid leave type ID'),
  year: z.number().int().min(2020).max(2100).optional(),
  allocatedDays: z.number().min(0, 'Allocated days must be non-negative'),
});

export const approveLeaveSchema = z.object({
  reviewerComment: z.string().optional(),
});

export const rejectLeaveSchema = z.object({
  rejectionReason: z.string().min(2, 'Rejection reason is required'),
  reviewerComment: z.string().optional(),
});

export const leaveQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.nativeEnum(LeaveStatus).optional(),
  employeeId: z.string().optional(),
  leaveTypeId: z.string().optional(),
  year: z.string().optional(),
});
