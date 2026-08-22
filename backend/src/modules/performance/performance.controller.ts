import { Request, Response, NextFunction } from 'express';
import {
  createGoalService,
  getGoalsService,
  updateGoalService,
  updateGoalProgressService,
  getEmployeeOwnGoalsService,
  createReviewService,
  getReviewsService,
  getEmployeeOwnReviewsService,
  getEmployeeOwnReviewByIdService,
  submitSelfAssessmentService,
  evaluateReviewService,
  getEmployeePerformanceHistoryService,
} from './performance.service';
import { sendSuccess, sendPaginated } from '../../utils/response.util';
import { AppError } from '../../middleware/error.middleware';

function getAuthenticatedEmployeeId(req: Request): string {
  const employeeId = req.user?.employeeId;
  if (!employeeId) {
    throw new AppError(
      'Authenticated user is not linked to an employee profile.',
      400,
      'EMPLOYEE_PROFILE_REQUIRED'
    );
  }
  return employeeId;
}

// ==========================================
// ADMIN / HR GOAL CONTROLLERS
// ==========================================

export async function createGoalController(req: Request, res: Response, next: NextFunction) {
  try {
    const createdByUserId = req.user!.userId;
    const result = await createGoalService(req.body, createdByUserId);
    return sendSuccess(res, result, 'Performance goal created and assigned successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function getGoalsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await getGoalsService(req.query);
    return sendPaginated(res, data, meta, 'Performance goals retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function updateGoalController(req: Request, res: Response, next: NextFunction) {
  try {
    const goalId = req.params.id;
    const updatedByUserId = req.user!.userId;
    const result = await updateGoalService(goalId, req.body, updatedByUserId);
    return sendSuccess(res, result, 'Performance goal updated successfully');
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// EMPLOYEE GOAL CONTROLLERS (SELF-SERVICE)
// ==========================================

export async function getEmployeeOwnGoalsController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const { data, meta } = await getEmployeeOwnGoalsService(employeeId, req.query);
    return sendPaginated(res, data, meta, 'Personal performance goals retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function updateGoalProgressController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const goalId = req.params.id;
    const { progress } = req.body;
    const result = await updateGoalProgressService(goalId, progress, employeeId);
    return sendSuccess(res, result, `Goal progress updated to ${progress}%`);
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// ADMIN / HR REVIEW CONTROLLERS
// ==========================================

export async function createReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const createdByUserId = req.user!.userId;
    const result = await createReviewService(req.body, createdByUserId);
    return sendSuccess(res, result, 'Performance review cycle initiated successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function getReviewsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await getReviewsService(req.query);
    return sendPaginated(res, data, meta, 'Performance reviews retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function evaluateReviewController(req: Request, res: Response, next: NextFunction) {
  try {
    const reviewId = req.params.id;
    const reviewerUserId = req.user!.userId;
    const result = await evaluateReviewService(reviewId, req.body, reviewerUserId);
    return sendSuccess(res, result, 'Performance review evaluated and completed successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeePerformanceHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.params.employeeId;
    const result = await getEmployeePerformanceHistoryService(employeeId, req.query);
    return sendSuccess(res, result, 'Employee performance history retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// EMPLOYEE REVIEW CONTROLLERS (SELF-SERVICE)
// ==========================================

export async function getEmployeeOwnReviewsController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const { data, meta } = await getEmployeeOwnReviewsService(employeeId, req.query);
    return sendPaginated(res, data, meta, 'Personal performance reviews retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeOwnReviewByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const reviewId = req.params.id;
    const result = await getEmployeeOwnReviewByIdService(employeeId, reviewId);
    return sendSuccess(res, result, 'Performance review details retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function submitSelfAssessmentController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const reviewId = req.params.id;
    const { selfAssessment } = req.body;
    const result = await submitSelfAssessmentService(reviewId, selfAssessment, employeeId);
    return sendSuccess(res, result, 'Self-assessment submitted successfully');
  } catch (error) {
    return next(error);
  }
}
