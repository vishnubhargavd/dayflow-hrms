import { z } from 'zod';
import { HelpdeskCategory, HelpdeskPriority, HelpdeskStatus } from '@prisma/client';

export const createHelpdeskRequestSchema = z.object({
  category: z.nativeEnum(HelpdeskCategory),
  priority: z.nativeEnum(HelpdeskPriority).optional().default(HelpdeskPriority.MEDIUM),
  subject: z.string().min(1, 'Subject is required').max(150, 'Subject cannot exceed 150 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
});

export const addCommentSchema = z.object({
  message: z.string().min(1, 'Comment message is required').max(2000, 'Comment cannot exceed 2000 characters'),
});

export const assignHelpdeskRequestSchema = z.object({
  assignedToId: z.string().uuid('Invalid employee ID for assignment'),
});

export const updateHelpdeskStatusSchema = z.object({
  status: z.nativeEnum(HelpdeskStatus),
});

export const resolveHelpdeskRequestSchema = z.object({
  resolution: z.string().min(1, 'Resolution comment is required').max(2000, 'Resolution cannot exceed 2000 characters'),
});

export const helpdeskQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.nativeEnum(HelpdeskStatus).optional(),
  category: z.nativeEnum(HelpdeskCategory).optional(),
  priority: z.nativeEnum(HelpdeskPriority).optional(),
  assignedToId: z.string().optional(),
  employeeId: z.string().optional(),
});
