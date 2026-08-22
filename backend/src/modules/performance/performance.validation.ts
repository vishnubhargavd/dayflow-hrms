import { z } from 'zod';
import { GoalStatus, ReviewStatus } from '@prisma/client';

export const createGoalSchema = z.object({
  employeeId: z.string().uuid('Invalid employee ID'),
  title: z.string().min(2, 'Title must be at least 2 characters').max(200),
  description: z.string().optional(),
  target: z.string().optional(),
  progress: z
    .number()
    .min(0, 'Progress cannot be less than 0%')
    .max(100, 'Progress cannot exceed 100%')
    .default(0),
  status: z.nativeEnum(GoalStatus).optional().default(GoalStatus.NOT_STARTED),
  startDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  dueDate: z.string().datetime().optional().or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
});

export const updateGoalSchema = createGoalSchema.partial();

export const updateGoalProgressSchema = z.object({
  progress: z
    .number()
    .min(0, 'Progress cannot be less than 0%')
    .max(100, 'Progress cannot exceed 100%'),
});

export const createReviewSchema = z.object({
  employeeId: z.string().uuid('Invalid employee ID'),
  reviewPeriod: z.string().min(2, 'Review period is required (e.g. Q2 2026, 2026-H1)').max(50),
  reviewerId: z.string().uuid('Invalid reviewer user ID').optional(),
  status: z.nativeEnum(ReviewStatus).optional().default(ReviewStatus.DRAFT),
});

export const submitSelfAssessmentSchema = z.object({
  selfAssessment: z.string().min(2, 'Self-assessment content is required'),
});

export const evaluateReviewSchema = z.object({
  overallRating: z
    .number()
    .min(1.0, 'Rating must be at least 1.0')
    .max(5.0, 'Rating cannot exceed 5.0'),
  reviewerFeedback: z.string().min(2, 'Reviewer feedback is required'),
  strengths: z.string().optional(),
  improvementAreas: z.string().optional(),
  status: z.nativeEnum(ReviewStatus).optional().default(ReviewStatus.COMPLETED),
});

export const performanceQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  employeeId: z.string().uuid().optional(),
  status: z.string().optional(),
  reviewPeriod: z.string().optional(),
});
