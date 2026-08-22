import { Router } from 'express';
import {
  getEmployeeBalancesController,
  getEmployeeRequestsController,
  getEmployeeRequestByIdController,
  applyLeaveController,
  cancelLeaveRequestController,
  getLeaveTypesController,
  createLeaveTypeController,
  allocateLeaveBalanceController,
  getAllLeaveRequestsController,
  approveLeaveRequestController,
  rejectLeaveRequestController,
  getEmployeeBalancesHRController,
} from './leave.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import {
  applyLeaveSchema,
  createLeaveTypeSchema,
  allocateBalanceSchema,
  approveLeaveSchema,
  rejectLeaveSchema,
  leaveQuerySchema,
} from './leave.validation';
import { Role } from '@prisma/client';

const router = Router();

// All leave endpoints require authentication
router.use(authenticate);

// ==========================================
// EMPLOYEE SELF-SERVICE ENDPOINTS (/me/*)
// ==========================================

// GET /api/v1/leave/me/balances — View own leave balances
router.get('/me/balances', getEmployeeBalancesController);

// GET /api/v1/leave/me/requests — View own leave requests (paginated & filtered)
router.get('/me/requests', validateQuery(leaveQuerySchema), getEmployeeRequestsController);

// GET /api/v1/leave/me/requests/:id — View single leave request details (with IDOR check)
router.get('/me/requests/:id', getEmployeeRequestByIdController);

// POST /api/v1/leave/me/requests — Submit a new leave request
router.post('/me/requests', validateBody(applyLeaveSchema), applyLeaveController);

// PATCH /api/v1/leave/me/requests/:id/cancel — Cancel pending leave request
router.patch('/me/requests/:id/cancel', cancelLeaveRequestController);

// ==========================================
// LEAVE TYPE CONFIGURATION
// ==========================================

// GET /api/v1/leave/types — List active leave types (Public to authenticated users)
router.get('/types', getLeaveTypesController);

// POST /api/v1/leave/types — Create new leave type (ADMIN / HR)
router.post('/types', authorize(Role.ADMIN, Role.HR), validateBody(createLeaveTypeSchema), createLeaveTypeController);

// ==========================================
// HR / ADMIN MANAGEMENT ENDPOINTS
// ==========================================

// POST /api/v1/leave/balances/allocate — Allocate/Update employee leave balance (ADMIN / HR)
router.post(
  '/balances/allocate',
  authorize(Role.ADMIN, Role.HR),
  validateBody(allocateBalanceSchema),
  allocateLeaveBalanceController
);

// GET /api/v1/leave/balances/:employeeId — View balances of specific employee (ADMIN / HR)
router.get('/balances/:employeeId', authorize(Role.ADMIN, Role.HR), getEmployeeBalancesHRController);

// GET /api/v1/leave/requests — View all leave requests in organization (ADMIN / HR)
router.get(
  '/requests',
  authorize(Role.ADMIN, Role.HR),
  validateQuery(leaveQuerySchema),
  getAllLeaveRequestsController
);

// PATCH /api/v1/leave/requests/:id/approve — Approve leave request (ADMIN / HR)
router.patch(
  '/requests/:id/approve',
  authorize(Role.ADMIN, Role.HR),
  validateBody(approveLeaveSchema),
  approveLeaveRequestController
);

// PATCH /api/v1/leave/requests/:id/reject — Reject leave request (ADMIN / HR)
router.patch(
  '/requests/:id/reject',
  authorize(Role.ADMIN, Role.HR),
  validateBody(rejectLeaveSchema),
  rejectLeaveRequestController
);

export default router;
