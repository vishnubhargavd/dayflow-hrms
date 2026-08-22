import { Request, Response, NextFunction } from 'express';
import {
  checkInService,
  checkOutService,
  getTodayAttendanceService,
  getAttendanceHistoryService,
  getWeeklyAttendanceService,
  getMonthlyAttendanceService,
} from './attendance.service';
import { sendSuccess, sendPaginated } from '../../utils/response.util';
import { JwtPayload } from '../../utils/jwt.util';

export async function checkInController(req: Request, res: Response, next: NextFunction) {
  try {
    const userContext = req.user as JwtPayload;
    const result = await checkInService(userContext);
    return sendSuccess(res, result, 'Check-in recorded successfully', 201);
  } catch (error) {
    return next(error);
  }
}

export async function checkOutController(req: Request, res: Response, next: NextFunction) {
  try {
    const userContext = req.user as JwtPayload;
    const result = await checkOutService(userContext);
    return sendSuccess(res, result, 'Check-out recorded successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getTodayAttendanceController(req: Request, res: Response, next: NextFunction) {
  try {
    const userContext = req.user as JwtPayload;
    const result = await getTodayAttendanceService(userContext);
    return sendSuccess(res, result, 'Today attendance retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getAttendanceHistoryController(req: Request, res: Response, next: NextFunction) {
  try {
    const userContext = req.user as JwtPayload;
    const { data, meta } = await getAttendanceHistoryService(userContext, req.query);
    return sendPaginated(res, data, meta, 'Attendance records retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getWeeklyAttendanceController(req: Request, res: Response, next: NextFunction) {
  try {
    const userContext = req.user as JwtPayload;
    const result = await getWeeklyAttendanceService(userContext, req.query);
    return sendSuccess(res, result, 'Weekly attendance summary retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getMonthlyAttendanceController(req: Request, res: Response, next: NextFunction) {
  try {
    const userContext = req.user as JwtPayload;
    const result = await getMonthlyAttendanceService(userContext, req.query);
    return sendSuccess(res, result, 'Monthly attendance summary retrieved successfully');
  } catch (error) {
    return next(error);
  }
}
