import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import { Role } from '@prisma/client';

import {
  createSalaryComponentSchema,
  updateSalaryComponentSchema,
  assignSalaryStructureSchema,
  processPayrollSchema,
  updatePayrollStatusSchema,
  payrollQuerySchema,
} from './payroll.validation';

import {
  createSalaryComponentController,
  getSalaryComponentsController,
  updateSalaryComponentController,
  assignSalaryStructureController,
  getSalaryStructureController,
  getSalaryHistoryController,
  processPayrollController,
  getPayrollRecordsController,
  updatePayrollStatusController,
  getEmployeeOwnPayrollController,
  getEmployeeOwnHistoryController,
  getEmployeeOwnPayslipsController,
  getEmployeeOwnPayslipByIdController,
} from './payroll.controller';

const router = Router();

// All payroll routes require authentication
router.use(authenticate);

// ==========================================
// EMPLOYEE SELF-SERVICE ENDPOINTS (READ-ONLY, IDOR PROTECTED)
// ==========================================
router.get('/me', getEmployeeOwnPayrollController);
router.get('/me/history', validateQuery(payrollQuerySchema), getEmployeeOwnHistoryController);
router.get('/me/payslips', validateQuery(payrollQuerySchema), getEmployeeOwnPayslipsController);
router.get('/me/payslips/:id', getEmployeeOwnPayslipByIdController);

// ==========================================
// ADMIN / HR PAYROLL MANAGEMENT ENDPOINTS (RBAC RESTRICTED)
// ==========================================
const adminHrOnly = authorize(Role.ADMIN, Role.HR);

// Salary Components Management
router.post('/components', adminHrOnly, validateBody(createSalaryComponentSchema), createSalaryComponentController);
router.get('/components', adminHrOnly, getSalaryComponentsController);
router.put('/components/:id', adminHrOnly, validateBody(updateSalaryComponentSchema), updateSalaryComponentController);

// Employee Salary Structure & History Management
router.post('/salary-structure', adminHrOnly, validateBody(assignSalaryStructureSchema), assignSalaryStructureController);
router.get('/salary-structure/:employeeId', adminHrOnly, getSalaryStructureController);
router.get('/history/:employeeId', adminHrOnly, validateQuery(payrollQuerySchema), getSalaryHistoryController);

// Payroll Processing & Payslip Management
router.post('/process', adminHrOnly, validateBody(processPayrollSchema), processPayrollController);
router.get('/records', adminHrOnly, validateQuery(payrollQuerySchema), getPayrollRecordsController);
router.patch('/records/:id/status', adminHrOnly, validateBody(updatePayrollStatusSchema), updatePayrollStatusController);

export default router;
