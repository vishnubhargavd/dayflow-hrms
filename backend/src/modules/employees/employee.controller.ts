import { Request, Response, NextFunction } from 'express';
import { createEmployeeService, getEmployeesService, getEmployeeByIdService } from './employee.service';
import { sendSuccess, sendPaginated } from '../../utils/response.util';

export async function createEmployeeController(req: Request, res: Response, next: NextFunction) {
  try {
    const createdByUserId = req.user!.userId;
    const result = await createEmployeeService(req.body, createdByUserId);
    return sendSuccess(res, result, 'Employee account created successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeesController(req: Request, res: Response, next: NextFunction) {
  try {
    const { data, meta } = await getEmployeesService(req.query);
    return sendPaginated(res, data, meta, 'Employees retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getEmployeeByIdController(req: Request, res: Response, next: NextFunction) {
  try {
    const employeeId = req.params.id;
    const result = await getEmployeeByIdService(employeeId, req.user);
    return sendSuccess(res, result, 'Employee details retrieved successfully');
  } catch (error) {
    return next(error);
  }
}
