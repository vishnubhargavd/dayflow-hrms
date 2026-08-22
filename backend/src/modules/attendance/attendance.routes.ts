import { Router } from 'express';
import {
  checkInController,
  checkOutController,
  getTodayAttendanceController,
  getAttendanceHistoryController,
  getWeeklyAttendanceController,
  getMonthlyAttendanceController,
} from './attendance.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateBody, validateQuery } from '../../middleware/validation.middleware';
import {
  checkInSchema,
  checkOutSchema,
  attendanceQuerySchema,
  weeklyAttendanceQuerySchema,
  monthlyAttendanceQuerySchema,
} from './attendance.validation';

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

// Attendance History & Listing
router.get('/', validateQuery(attendanceQuerySchema), getAttendanceHistoryController);

export default router;
