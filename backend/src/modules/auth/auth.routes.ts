import { Router } from 'express';
import { loginController, changePasswordController, getMeController } from './auth.controller';
import { validateBody } from '../../middleware/validation.middleware';
import { loginSchema, changePasswordSchema } from './auth.validation';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public login endpoint
router.post('/login', validateBody(loginSchema), loginController);

// Protected endpoints
router.post('/change-password', authenticate, validateBody(changePasswordSchema), changePasswordController);
router.get('/me', authenticate, getMeController);

export default router;
