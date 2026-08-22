import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { sendError } from '../utils/response.util';

export function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required', 401, 'UNAUTHORIZED', req.originalUrl);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}`,
        403,
        'FORBIDDEN',
        req.originalUrl
      );
    }

    return next();
  };
}
