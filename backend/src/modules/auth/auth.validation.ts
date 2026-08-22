import { z } from 'zod';

export const loginSchema = z.object({
  loginIdOrEmail: z.string().min(3, 'Login ID or Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});
