import { Router } from 'express';
import {
  checkInController,
  checkOutController,
  getTodayAttendanceController,
  getAttendanceHistoryController,
  getWeeklyAttendanceController,
  getMonthlyAttendanceController,
  getPersonalAnalyticsController,
  getOverviewAnalyticsController,
  getDepartmentAnalyticsController,
  getTrendAnalyticsController,
  getLowAttendanceController,
  getPersonalInsightsController,
  getOrganizationInsightsController,
} from './attendance.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/role.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import {
  checkInSchema,
  checkOutSchema,
  attendanceQuerySchema,
  weeklyAttendanceQuerySchema,
  monthlyAttendanceQuerySchema,
  analyticsDateRangeSchema,
  lowAttendanceQuerySchema,
} from './attendance.validation';
import { Role } from '@prisma/client';

const router = Router();

// All attendance endpoints require authentication
router.use(authenticate);

// Check-in & Check-out
router.post('/check-in', validateBody(checkInSchema), checkInController);
router.post('/check-out', validateBody(checkOutSchema), checkOutController);

// Today's Attendance
router.get('/today', getTodayAttendanceController);

// Weekly & Monthly Summary Views
router.get('/weekly', validateQuery(weeklyAttendanceQuerySchema), getWeeklyAttendanceController);
router.get('/monthly', validateQuery(monthlyAttendanceQuerySchema), getMonthlyAttendanceController);

// ==========================================
// SMART HR INTELLIGENCE / INSIGHTS ENDPOINTS
// ==========================================

// Organization & Department Level Smart Insights (ADMIN / HR)
router.get(
  '/insights/overview',
  authorize(Role.ADMIN, Role.HR),
  getOrganizationInsightsController
);

// Personal Smart Contextual Insights (Scoped to Self)
router.get('/insights', getPersonalInsightsController);

// ==========================================
// HR ATTENDANCE ANALYTICS ENDPOINTS
// ==========================================

// Organization-Level Overview (ADMIN / HR)
router.get(
  '/analytics/overview',
  authorize(Role.ADMIN, Role.HR),
  validateQuery(analyticsDateRangeSchema),
  getOverviewAnalyticsController
);

// Department-Level Breakdown (ADMIN / HR)
router.get(
  '/analytics/departments',
  authorize(Role.ADMIN, Role.HR),
  validateQuery(analyticsDateRangeSchema),
  getDepartmentAnalyticsController
);

// Daily Trend for Charts (ADMIN / HR)
router.get(
  '/analytics/trend',
  authorize(Role.ADMIN, Role.HR),
  validateQuery(analyticsDateRangeSchema),
  getTrendAnalyticsController
);

// Low Attendance Identification (ADMIN / HR)
router.get(
  '/analytics/low-attendance',
  authorize(Role.ADMIN, Role.HR),
  validateQuery(lowAttendanceQuerySchema),
  getLowAttendanceController
);

// Personal Employee Analytics (Scoped to self)
router.get(
  '/analytics',
  validateQuery(analyticsDateRangeSchema),
  getPersonalAnalyticsController
);

// Attendance History & Listing
router.get('/', validateQuery(attendanceQuerySchema), getAttendanceHistoryController);

export default router;
