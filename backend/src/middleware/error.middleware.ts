import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response.util';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;

  constructor(message: string, statusCode = 400, errorCode = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.errorCode, req.originalUrl);
  }

  // Handle Prisma Database Known Request Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const target = (err.meta?.target as string[])?.join(', ') || 'field';
      return sendError(res, `A record with this ${target} already exists.`, 409, 'DUPLICATE_ENTRY', req.originalUrl);
    }
    if (err.code === 'P2025') {
      return sendError(res, 'Requested resource was not found.', 404, 'NOT_FOUND', req.originalUrl);
    }
  }

  // Fallback 500 Internal Server Error
  const message = process.env.NODE_ENV === 'development' ? err.message : 'An internal server error occurred';
  return sendError(res, message, 500, 'INTERNAL_SERVER_ERROR', req.originalUrl);
}
