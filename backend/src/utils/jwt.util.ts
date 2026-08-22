import jwt, { Secret } from 'jsonwebtoken';
import { env } from '../config/env';
import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  loginId: string;
  email: string;
  role: Role;
  employeeId?: string;
  requiresPasswordChange: boolean;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET as Secret, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
}
