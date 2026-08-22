import { Request, Response, NextFunction } from 'express';
import {
  applyLeaveService,
  cancelLeaveRequestService,
  approveLeaveRequestService,
  rejectLeaveRequestService,
  getEmployeeBalancesService,
  getEmployeeRequestsService,
  getEmployeeRequestByIdService,
  getAllLeaveRequestsService,
  getLeaveTypesService,
  createLeaveTypeService,
  allocateLeaveBalanceService,
} from './leave.service';
import { sendSuccess, sendPaginated } from '../../utils/response.util';
import { AppError } from '../../middleware/error.middleware';

/**
 * Employee Self-Service: View own leave balances
 */
export async function getEmployeeBalancesController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const year = req.query.year ? parseInt(String(req.query.year), 10) : undefined;
    const result = await getEmployeeBalancesService(employeeId, year);
    return sendSuccess(res, result, 'Leave balances retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: View own leave requests
 */
export async function getEmployeeRequestsController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const { data, meta } = await getEmployeeRequestsService(employeeId, req.query);
    return sendPaginated(res, data, meta, 'Leave requests retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: View single leave request details (with IDOR check)
 */
export async function getEmployeeRequestByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const requestId = req.params.id;
    const result = await getEmployeeRequestByIdService(requestId, employeeId);
    return sendSuccess(res, result, 'Leave request details retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: Submit new leave request
 */
export async function applyLeaveController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const result = await applyLeaveService(employeeId, req.body);
    return sendSuccess(res, result, 'Leave request submitted successfully', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: Cancel pending leave request
 */
export async function cancelLeaveRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.user?.employeeId;
    if (!employeeId) {
      throw new AppError('Employee profile not linked to user account.', 400, 'NO_EMPLOYEE_PROFILE');
    }
    const requestId = req.params.id;
    const result = await cancelLeaveRequestService(requestId, employeeId);
    return sendSuccess(res, result, 'Leave request cancelled successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: List all leave types
 */
export async function getLeaveTypesController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getLeaveTypesService();
    return sendSuccess(res, result, 'Leave types retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Create new leave type
 */
export async function createLeaveTypeController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await createLeaveTypeService(req.body);
    return sendSuccess(res, result, 'Leave type created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Allocate leave balance to an employee
 */
export async function allocateLeaveBalanceController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await allocateLeaveBalanceService(req.body);
    return sendSuccess(res, result, 'Leave balance allocated successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: List all leave requests across the organization
 */
export async function getAllLeaveRequestsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await getAllLeaveRequestsService(req.query);
    return sendPaginated(res, data, meta, 'All leave requests retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Approve leave request
 */
export async function approveLeaveRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const reviewerEmployeeId = req.user?.employeeId || req.user?.userId;
    const requestId = req.params.id;
    const { reviewerComment } = req.body;
    const result = await approveLeaveRequestService(requestId, reviewerEmployeeId!, reviewerComment);
    return sendSuccess(res, result, 'Leave request approved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Reject leave request
 */
export async function rejectLeaveRequestController(req: Request, res: Response, next: NextFunction) {
  try {
    const reviewerEmployeeId = req.user?.employeeId || req.user?.userId;
    const requestId = req.params.id;
    const { rejectionReason, reviewerComment } = req.body;
    const result = await rejectLeaveRequestService(requestId, reviewerEmployeeId!, rejectionReason, reviewerComment);
    return sendSuccess(res, result, 'Leave request rejected successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * HR / Admin: Get balances for specific employee
 */
export async function getEmployeeBalancesHRController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.params.employeeId;
    const year = req.query.year ? parseInt(String(req.query.year), 10) : undefined;
    const result = await getEmployeeBalancesService(employeeId, year);
    return sendSuccess(res, result, 'Employee leave balances retrieved successfully');
  } catch (error) {
    return next(error);
  }
}
