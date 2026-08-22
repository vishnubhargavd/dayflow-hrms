import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.util';
import { sendError } from '../utils/response.util';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. Please provide a valid Bearer token.', 401, 'UNAUTHORIZED', req.originalUrl);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verifyToken(token);
    req.user = payload;
    return next();
  } catch (error) {
    return sendError(res, 'Invalid or expired authentication token', 401, 'TOKEN_EXPIRED', req.originalUrl);
  }
}
