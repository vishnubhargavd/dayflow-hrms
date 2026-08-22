import { Router } from 'express';
import {
  getUserNotificationsController,
  getUnreadNotificationCountController,
  markNotificationAsReadController,
  markAllNotificationsAsReadController,
} from './notifications.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validateQuery, validateParams } from '../../middleware/validation.middleware';
import {
  notificationQuerySchema,
  markNotificationReadParamsSchema,
} from './notifications.validation';

const router = Router();

// All notification endpoints require authentication
router.use(authenticate);

// GET /api/v1/notifications/me — View paginated notifications for authenticated user
router.get(
  '/me',
  validateQuery(notificationQuerySchema),
  getUserNotificationsController
);

// GET /api/v1/notifications/me/unread-count — View unread notification count
router.get('/me/unread-count', getUnreadNotificationCountController);

// PATCH /api/v1/notifications/read-all — Mark all notifications for authenticated user as read
router.patch('/read-all', markAllNotificationsAsReadController);

// PATCH /api/v1/notifications/:id/read — Mark single notification as read (with IDOR check)
router.patch(
  '/:id/read',
  validateParams(markNotificationReadParamsSchema),
  markNotificationAsReadController
);

export default router;
