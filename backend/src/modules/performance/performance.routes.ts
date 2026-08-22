import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import { Role } from '@prisma/client';

import {
  createGoalSchema,
  updateGoalSchema,
  updateGoalProgressSchema,
  createReviewSchema,
  submitSelfAssessmentSchema,
  evaluateReviewSchema,
  performanceQuerySchema,
} from './performance.validation';

import {
  createGoalController,
  getGoalsController,
  updateGoalController,
  getEmployeeOwnGoalsController,
  updateGoalProgressController,
  createReviewController,
  getReviewsController,
  evaluateReviewController,
  getEmployeePerformanceHistoryController,
  getEmployeeOwnReviewsController,
  getEmployeeOwnReviewByIdController,
  submitSelfAssessmentController,
} from './performance.controller';

const router = Router();

// All performance routes require authentication
router.use(authenticate);

// ==========================================
// EMPLOYEE SELF-SERVICE ENDPOINTS (READ-ONLY / OWNED PROGRESS & SELF-ASSESSMENT)
// ==========================================
router.get('/me/goals', validateQuery(performanceQuerySchema), getEmployeeOwnGoalsController);
router.patch('/me/goals/:id/progress', validateBody(updateGoalProgressSchema), updateGoalProgressController);
router.get('/me/reviews', validateQuery(performanceQuerySchema), getEmployeeOwnReviewsController);
router.get('/me/reviews/:id', getEmployeeOwnReviewByIdController);
router.patch('/me/reviews/:id/self-assessment', validateBody(submitSelfAssessmentSchema), submitSelfAssessmentController);

// ==========================================
// ADMIN / HR PERFORMANCE MANAGEMENT ENDPOINTS (RBAC RESTRICTED)
// ==========================================
const adminHrOnly = authorize(Role.ADMIN, Role.HR);

// Goal Management
router.post('/goals', adminHrOnly, validateBody(createGoalSchema), createGoalController);
router.get('/goals', adminHrOnly, validateQuery(performanceQuerySchema), getGoalsController);
router.put('/goals/:id', adminHrOnly, validateBody(updateGoalSchema), updateGoalController);

// Review & Evaluation Management
router.post('/reviews', adminHrOnly, validateBody(createReviewSchema), createReviewController);
router.get('/reviews', adminHrOnly, validateQuery(performanceQuerySchema), getReviewsController);
router.get('/history/:employeeId', adminHrOnly, validateQuery(performanceQuerySchema), getEmployeePerformanceHistoryController);
router.patch('/reviews/:id/evaluation', adminHrOnly, validateBody(evaluateReviewSchema), evaluateReviewController);

export default router;
