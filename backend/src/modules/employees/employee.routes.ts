import { Router } from 'express';
import { createEmployeeController, getEmployeesController, getEmployeeByIdController } from './employee.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import { createEmployeeSchema, getEmployeesQuerySchema } from './employee.validation';
import { Role } from '@prisma/client';

const router = Router();

// All employee routes require authentication
router.use(authenticate);

// POST /api/v1/employees — Only ADMIN and HR can create employees
router.post('/', authorize(Role.ADMIN, Role.HR), validateBody(createEmployeeSchema), createEmployeeController);

// GET /api/v1/employees — Paginated employee directory list
router.get('/', validateQuery(getEmployeesQuerySchema), getEmployeesController);

// GET /api/v1/employees/:id — Employee details (with RBAC & IDOR checks)
router.get('/:id', getEmployeeByIdController);

export default router;
