import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { sendError, FieldError } from '../utils/response.util';

function formatZodErrors(error: ZodError): { issues: string; structuredErrors: Record<string, FieldError> } {
  const structuredErrors: Record<string, FieldError> = {};
  error.errors.forEach((err) => {
    const field = err.path.join('.') || 'root';
    structuredErrors[field] = {
      message: err.message,
      field,
    };
  });
  const issues = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join('; ');
  return { issues, structuredErrors };
}

export function validateBody(schema: ZodTypeAny) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const { issues, structuredErrors } = formatZodErrors(error);
        return sendError(
          res,
          `Validation failed: ${issues}`,
          400,
          'VALIDATION_ERROR',
          req.originalUrl,
          structuredErrors
        );
      }
      return next(error);
    }
  };
}

export function validateQuery(schema: ZodTypeAny) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = await schema.parseAsync(req.query);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const { issues, structuredErrors } = formatZodErrors(error);
        return sendError(
          res,
          `Query validation failed: ${issues}`,
          400,
          'VALIDATION_ERROR',
          req.originalUrl,
          structuredErrors
        );
      }
      return next(error);
    }
  };
}

export function validateParams(schema: ZodTypeAny) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params = await schema.parseAsync(req.params);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const { issues, structuredErrors } = formatZodErrors(error);
        return sendError(
          res,
          `Params validation failed: ${issues}`,
          400,
          'VALIDATION_ERROR',
          req.originalUrl,
          structuredErrors
        );
      }
      return next(error);
    }
  };
}
