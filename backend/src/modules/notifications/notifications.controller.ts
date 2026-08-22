import { Request, Response, NextFunction } from 'express';
import {
  getUserNotificationsService,
  getUnreadNotificationCountService,
  markNotificationAsReadService,
  markAllNotificationsAsReadService,
} from './notifications.service';
import { sendSuccess, sendPaginated } from '../../utils/response.util';
import { AppError } from '../../middleware/error.middleware';

/**
 * Employee Self-Service: Get paginated notifications for authenticated user
 */
export async function getUserNotificationsController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('User authentication context required.', 401, 'UNAUTHORIZED');
    }
    const { data, meta } = await getUserNotificationsService(userId, req.query);
    return sendPaginated(res, data, meta, 'Notifications retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: Get unread notification count
 */
export async function getUnreadNotificationCountController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('User authentication context required.', 401, 'UNAUTHORIZED');
    }
    const result = await getUnreadNotificationCountService(userId);
    return sendSuccess(res, result, 'Unread notification count retrieved successfully');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: Mark single notification as read
 */
export async function markNotificationAsReadController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('User authentication context required.', 401, 'UNAUTHORIZED');
    }
    const notificationId = req.params.id;
    const result = await markNotificationAsReadService(notificationId, userId);
    return sendSuccess(res, result, 'Notification marked as read');
  } catch (error) {
    return next(error);
  }
}

/**
 * Employee Self-Service: Mark all notifications as read
 */
export async function markAllNotificationsAsReadController(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new AppError('User authentication context required.', 401, 'UNAUTHORIZED');
    }
    const result = await markAllNotificationsAsReadService(userId);
    return sendSuccess(res, result, 'All notifications marked as read');
  } catch (error) {
    return next(error);
  }
}
