import { Response } from 'express';

export interface FieldError {
  message: string;
  field: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  errors?: Record<string, FieldError>;
  timestamp: string;
  path?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Operation successful',
  statusCode = 200
): Response {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function sendPaginated<T>(
  res: Response,
  data: T[],
  meta: { page: number; limit: number; total: number; totalPages?: number },
  message = 'Data retrieved successfully',
  statusCode = 200
): Response {
  const limit = meta.limit > 0 ? meta.limit : 20;
  const totalPages = meta.totalPages !== undefined ? meta.totalPages : Math.ceil(meta.total / limit);
  const response: ApiResponse<T[]> = {
    success: true,
    message,
    data,
    meta: {
      page: meta.page,
      limit,
      total: meta.total,
      totalPages,
    },
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 400,
  errorCode = 'BAD_REQUEST',
  path?: string,
  errors?: Record<string, FieldError>
): Response {
  const response: ApiResponse = {
    success: false,
    message,
    errorCode,
    errors,
    timestamp: new Date().toISOString(),
    path,
  };
  return res.status(statusCode).json(response);
}
