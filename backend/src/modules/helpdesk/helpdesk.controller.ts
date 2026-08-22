import { Request, Response, NextFunction } from 'express';
import {
  createHelpdeskRequestService,
  getEmployeeHelpdeskRequestsService,
  getEmployeeHelpdeskRequestByIdService,
  cancelHelpdeskRequestService,
  addEmployeeCommentService,
  getAllHelpdeskRequestsService,
  getHelpdeskRequestByIdHRService,
  assignHelpdeskRequestService,
  updateHelpdeskStatusService,
  resolveHelpdeskRequestService,
  closeHelpdeskRequestService,
  addHRCommentService,
} from './helpdesk.service';
import { sendSuccess, sendPaginated } from '../../utils/response.util';
import { AppError } from '../../middleware/error.middleware';

/**
 * Employee Self-Service: Create a new Helpdesk Request
 */
export async function createHelpdeskRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const result = await createHelpdeskRequestService(employeeId, req.body);
    return sendSuccess(res, result, 'Helpdesk request created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: View own helpdesk requests
 */
export async function getEmployeeHelpdeskRequestsController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const { data, meta } = await getEmployeeHelpdeskRequestsService(employeeId, req.query);
    return sendPaginated(res, data, meta, 'Helpdesk requests retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: View single helpdesk request details (with IDOR check)
 */
export async function getEmployeeHelpdeskRequestByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const requestId = req.params.id;
    const result = await getEmployeeHelpdeskRequestByIdService(requestId, employeeId);
    return sendSuccess(res, result, 'Helpdesk request details retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: Cancel helpdesk request
 */
export async function cancelHelpdeskRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const requestId = req.params.id;
    const result = await cancelHelpdeskRequestService(requestId, employeeId);
    return sendSuccess(res, result, 'Helpdesk request cancelled successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: Add comment to own helpdesk request
 */
export async function addEmployeeCommentController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    const employeeId = req.user?.employeeId;
    if (!userId || !employeeId) {
      throw new AppError('User profile not linked to request.', 400, 'NO_USER_PROFILE');
    }
    const requestId = req.params.id;
    const { message } = req.body;
    const result = await addEmployeeCommentService(requestId, userId, employeeId, message);
    return sendSuccess(res, result, 'Comment added successfully', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: List all helpdesk requests across organization
 */
export async function getAllHelpdeskRequestsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await getAllHelpdeskRequestsService(req.query);
    return sendPaginated(res, data, meta, 'All helpdesk requests retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: View single helpdesk request details
 */
export async function getHelpdeskRequestByIdHRController(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = req.params.id;
    const result = await getHelpdeskRequestByIdHRService(requestId);
    return sendSuccess(res, result, 'Helpdesk request details retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Assign helpdesk request
 */
export async function assignHelpdeskRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = req.params.id;
    const { assignedToId } = req.body;
    const result = await assignHelpdeskRequestService(requestId, assignedToId);
    return sendSuccess(res, result, 'Helpdesk request assigned successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Update helpdesk request status
 */
export async function updateHelpdeskStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = req.params.id;
    const { status } = req.body;
    const result = await updateHelpdeskStatusService(requestId, status);
    return sendSuccess(res, result, 'Helpdesk request status updated successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Resolve helpdesk request with resolution notes
 */
export async function resolveHelpdeskRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = req.params.id;
    const { resolution } = req.body;
    const result = await resolveHelpdeskRequestService(requestId, resolution);
    return sendSuccess(res, result, 'Helpdesk request resolved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Close resolved helpdesk request
 */
export async function closeHelpdeskRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const requestId = req.params.id;
    const result = await closeHelpdeskRequestService(requestId);
    return sendSuccess(res, result, 'Helpdesk request closed successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Add HR comment to ticket thread
 */
export async function addHRCommentController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('User profile not linked to request.', 400, 'NO_USER_PROFILE');
    }
    const requestId = req.params.id;
    const { message } = req.body;
    const result = await addHRCommentService(requestId, userId, message);
    return sendSuccess(res, result, 'HR comment added successfully', 201);
  } catch (error) {
    return next(error);
  }
}
