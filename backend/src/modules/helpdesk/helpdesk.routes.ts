import { Router } from 'express';
import {
  createHelpdeskRequestController,
  getEmployeeHelpdeskRequestsController,
  getEmployeeHelpdeskRequestByIdController,
  cancelHelpdeskRequestController,
  addEmployeeCommentController,
  getAllHelpdeskRequestsController,
  getHelpdeskRequestByIdHRController,
  assignHelpdeskRequestController,
  updateHelpdeskStatusController,
  resolveHelpdeskRequestController,
  closeHelpdeskRequestController,
  addHRCommentController,
} from './helpdesk.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import {
  createHelpdeskRequestSchema,
  addCommentSchema,
  assignHelpdeskRequestSchema,
  updateHelpdeskStatusSchema,
  resolveHelpdeskRequestSchema,
  helpdeskQuerySchema,
} from './helpdesk.validation';
import { Role } from '@prisma/client';

const router = Router();

// All helpdesk routes require authentication
router.use(authenticate);

// ==========================================
// EMPLOYEE SELF-SERVICE ENDPOINTS (/me/*)
// ==========================================

// POST /api/v1/helpdesk/me/requests — Create a new helpdesk request
router.post(
  '/me/requests',
  validateBody(createHelpdeskRequestSchema),
  createHelpdeskRequestController
);

// GET /api/v1/helpdesk/me/requests — View own helpdesk requests
router.get(
  '/me/requests',
  validateQuery(helpdeskQuerySchema),
  getEmployeeHelpdeskRequestsController
);

// GET /api/v1/helpdesk/me/requests/:id — View own request details & comments (with IDOR protection)
router.get('/me/requests/:id', getEmployeeHelpdeskRequestByIdController);

// PATCH /api/v1/helpdesk/me/requests/:id/cancel — Cancel eligible request
router.patch('/me/requests/:id/cancel', cancelHelpdeskRequestController);

// POST /api/v1/helpdesk/me/requests/:id/comments — Add comment to own request thread
router.post(
  '/me/requests/:id/comments',
  validateBody(addCommentSchema),
  addEmployeeCommentController
);

// ==========================================
// HR / ADMIN MANAGEMENT ENDPOINTS
// ==========================================

// GET /api/v1/helpdesk/requests — View all helpdesk requests across organization (ADMIN / HR)
router.get(
  '/requests',
  authorize(Role.ADMIN, Role.HR),
  validateQuery(helpdeskQuerySchema),
  getAllHelpdeskRequestsController
);

// GET /api/v1/helpdesk/requests/:id — View ticket details & comment thread (ADMIN / HR)
router.get(
  '/requests/:id',
  authorize(Role.ADMIN, Role.HR),
  getHelpdeskRequestByIdHRController
);

// PATCH /api/v1/helpdesk/requests/:id/assign — Assign ticket to HR/Admin user (ADMIN / HR)
router.patch(
  '/requests/:id/assign',
  authorize(Role.ADMIN, Role.HR),
  validateBody(assignHelpdeskRequestSchema),
  assignHelpdeskRequestController
);

// PATCH /api/v1/helpdesk/requests/:id/status — Update ticket status following state machine (ADMIN / HR)
router.patch(
  '/requests/:id/status',
  authorize(Role.ADMIN, Role.HR),
  validateBody(updateHelpdeskStatusSchema),
  updateHelpdeskStatusController
);

// PATCH /api/v1/helpdesk/requests/:id/resolve — Resolve request with resolution notes (ADMIN / HR)
router.patch(
  '/requests/:id/resolve',
  authorize(Role.ADMIN, Role.HR),
  validateBody(resolveHelpdeskRequestSchema),
  resolveHelpdeskRequestController
);

// PATCH /api/v1/helpdesk/requests/:id/close — Close resolved request (ADMIN / HR)
router.patch(
  '/requests/:id/close',
  authorize(Role.ADMIN, Role.HR),
  closeHelpdeskRequestController
);

// POST /api/v1/helpdesk/requests/:id/comments — Add HR comment to ticket thread (ADMIN / HR)
router.post(
  '/requests/:id/comments',
  authorize(Role.ADMIN, Role.HR),
  validateBody(addCommentSchema),
  addHRCommentController
);

export default router;
