import { Request, Response, NextFunction } from 'express';
import { loginService, changePasswordService, getCurrentUserService } from './auth.service';
import { sendSuccess } from '../../utils/response.util';

export async function loginController(req: Request, res: Response, next: NextFunction) {
  try {
    const { loginIdOrEmail, password } = req.body;
    const ipAddress = req.ip || req.socket.remoteAddress;
    const result = await loginService(loginIdOrEmail, password, ipAddress);
    return sendSuccess(res, result, 'Login successful');
  } catch (error) {
    return next(error);
  }
}

export async function changePasswordController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { currentPassword, newPassword } = req.body;
    const result = await changePasswordService(userId, currentPassword, newPassword);
    return sendSuccess(res, result, 'Password changed successfully');
  } catch (error) {
    return next(error);
  }
}

export async function getMeController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await getCurrentUserService(userId);
    return sendSuccess(res, result, 'Current user profile retrieved successfully');
  } catch (error) {
    return next(error);
  }
}
