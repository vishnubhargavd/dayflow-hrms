import { Request, Response, NextFunction } from 'express';
import {
  createSalaryComponentService,
  getSalaryComponentsService,
  updateSalaryComponentService,
  assignSalaryStructureService,
  getSalaryStructureService,
  getSalaryHistoryService,
  processPayrollService,
  getPayrollRecordsService,
  updatePayrollStatusService,
  getEmployeeOwnPayrollService,
  getEmployeeOwnHistoryService,
  getEmployeeOwnPayslipsService,
  getEmployeeOwnPayslipByIdService,
} from './payroll.service';
import { sendSuccess, sendPaginated } from '../../utils/response.util';
import { AppError } from '../../middleware/error.middleware';

// Helper to get authenticated employee ID safely from JWT
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
// SALARY COMPONENT CONTROLLERS (ADMIN/HR)
// ==========================================

export async function createSalaryComponentController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await createSalaryComponentService(req.body);
    return sendSuccess(res, result, 'Salary component created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function getSalaryComponentsController(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await getSalaryComponentsService();
    return sendSuccess(res, result, 'Salary components retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function updateSalaryComponentController(req: Request, res: Response, next: NextFunction) {
  try {
    const componentId = req.params.id;
    const result = await updateSalaryComponentService(componentId, req.body);
    return sendSuccess(res, result, 'Salary component updated successfully');
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// SALARY STRUCTURE CONTROLLERS (ADMIN/HR)
// ==========================================

export async function assignSalaryStructureController(req: Request, res: Response, next: NextFunction) {
  try {
    const changedByUserId = req.user!.userId;
    const result = await assignSalaryStructureService(req.body, changedByUserId);
    return sendSuccess(res, result, 'Employee salary structure updated and recorded in history');
  } catch (error) {
    return next(error);
  }
}

export async function getSalaryStructureController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.params.employeeId;
    const result = await getSalaryStructureService(employeeId);
    return sendSuccess(res, result, 'Employee salary structure retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getSalaryHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.params.employeeId;
    const { data, meta } = await getSalaryHistoryService(employeeId, req.query);
    return sendPaginated(res, data, meta, 'Salary history retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// PAYROLL PROCESSING CONTROLLERS (ADMIN/HR)
// ==========================================

export async function processPayrollController(req: Request, res: Response, next: NextFunction) {
  try {
    const processedByUserId = req.user!.userId;
    const result = await processPayrollService(req.body, processedByUserId);
    return sendSuccess(res, result, 'Payroll processed and payslip generated successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function getPayrollRecordsController(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await getPayrollRecordsService(req.query);
    return sendPaginated(res, data, meta, 'Payroll records retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function updatePayrollStatusController(req: Request, res: Response, next: NextFunction) {
  try {
    const payrollRecordId = req.params.id;
    const { status, paymentDate } = req.body;
    const updatedByUserId = req.user!.userId;
    const result = await updatePayrollStatusService(payrollRecordId, status, paymentDate, updatedByUserId);
    return sendSuccess(res, result, `Payroll record status updated to ${status}`);
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// EMPLOYEE SELF-SERVICE CONTROLLERS (READ-ONLY, IDOR PROTECTED)
// ==========================================

export async function getEmployeeOwnPayrollController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const result = await getEmployeeOwnPayrollService(employeeId);
    return sendSuccess(res, result, 'Current payroll and structure retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeOwnHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const { data, meta } = await getEmployeeOwnHistoryService(employeeId, req.query);
    return sendPaginated(res, data, meta, 'Personal payroll history retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeOwnPayslipsController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const { data, meta } = await getEmployeeOwnPayslipsService(employeeId, req.query);
    return sendPaginated(res, data, meta, 'Personal payslips retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeOwnPayslipByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = getAuthenticatedEmployeeId(req);
    const payslipId = req.params.id;
    const result = await getEmployeeOwnPayslipByIdService(employeeId, payslipId);
    return sendSuccess(res, result, 'Payslip details retrieved successfully');
  } catch (error) {
    return next(error);
  }
}
