import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { loginController, changePasswordController, getMeController } from './auth.controller';
import { validateBody } from '../../middleware/validation.middleware';
import { loginSchema, changePasswordSchema } from './auth.validation';
import { authenticate } from '../../middleware/auth.middleware';
import { sendError } from '../../utils/response.util';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many login attempts from this IP, please try again after 15 minutes.',
      429,
      'TOO_MANY_REQUESTS',
      req.originalUrl
    );
  },
});

const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return sendError(
      res,
      'Too many password change attempts, please try again later.',
      429,
      'TOO_MANY_REQUESTS',
      req.originalUrl
    );
  },
});

// Public login endpoint with rate limiting
router.post('/login', loginLimiter, validateBody(loginSchema), loginController);

// Protected endpoints
router.post('/change-password', authenticate, passwordLimiter, validateBody(changePasswordSchema), changePasswordController);
router.get('/me', authenticate, getMeController);

export default router;
