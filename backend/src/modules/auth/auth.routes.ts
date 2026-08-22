import { Router } from 'express';
import { loginController, registerController, changePasswordController, getMeController } from './auth.controller';
import { validateBody } from '../../middleware/validation.middleware';
import { loginSchema, registerSchema, changePasswordSchema } from './auth.validation';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Public auth endpoints
router.post('/login', validateBody(loginSchema), loginController);
router.post('/register', validateBody(registerSchema), registerController);

// Protected endpoints
router.post('/change-password', authenticate, validateBody(changePasswordSchema), changePasswordController);
router.get('/me', authenticate, getMeController);

export default router;
