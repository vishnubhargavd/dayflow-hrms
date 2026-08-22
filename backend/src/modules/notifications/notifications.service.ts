import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { parsePaginationParams, buildPaginationMeta } from '../../utils/pagination.util';
import { NotificationType, Role, Prisma } from '@prisma/client';

/**
 * Internal Helper: Get user IDs of all active HR and Admin users
 */
export async function getHRAndAdminUserIds(tx?: Prisma.TransactionClient | typeof prisma): Promise<string[]> {
  const db = tx || prisma;
  const users = await db.user.findMany({
    where: {
      role: { in: [Role.ADMIN, Role.HR] },
      accountStatus: 'ACTIVE',
    },
    select: { id: true },
  });
  return users.map((u) => u.id);
}

/**
 * Internal Service: Create a single notification for a user
 */
export async function createInternalNotification(params: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  tx?: Prisma.TransactionClient | typeof prisma;
}) {
  const db = params.tx || prisma;
  return db.notification.create({
    data: {
      userId: params.userId,
      type: params.type,
      title: params.title.trim(),
      message: params.message.trim(),
    },
  });
}

/**
 * Internal Service: Create bulk notifications for multiple users efficiently
 */
export async function createBulkNotifications(params: {
  userIds: string[];
  type: NotificationType;
  title: string;
  message: string;
  tx?: Prisma.TransactionClient | typeof prisma;
}) {
  if (!params.userIds || params.userIds.length === 0) return;

  const db = params.tx || prisma;
  const records = params.userIds.map((userId) => ({
    userId,
    type: params.type,
    title: params.title.trim(),
    message: params.message.trim(),
  }));

  return db.notification.createMany({
    data: records,
  });
}

/**
 * Employee Self-Service: Get paginated notifications for authenticated user
 */
export async function getUserNotificationsService(userId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.NotificationWhereInput = { userId };

  if (typeof queryParams.isRead === 'boolean') {
    where.isRead = queryParams.isRead;
  }
  if (queryParams.type) {
    where.type = queryParams.type;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    data: notifications,
    meta: buildPaginationMeta(page, limit, total),
  };
}

/**
 * Employee Self-Service: Get unread notification count
 */
export async function getUnreadNotificationCountService(userId: string) {
  const unreadCount = await prisma.notification.count({
    where: {
      userId,
      isRead: false,
    },
  });

  return { unreadCount };
}

/**
 * Employee Self-Service: Mark a single notification as read (with IDOR check)
 */
export async function markNotificationAsReadService(notificationId: string, userId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new AppError('Notification not found.', 404, 'NOT_FOUND');
  }

  // IDOR Protection: Check recipient ownership
  if (notification.userId !== userId) {
    throw new AppError('You are not authorized to access this notification.', 403, 'FORBIDDEN');
  }

  if (notification.isRead) {
    return notification;
  }

  return prisma.notification.update({
    where: { id: notificationId },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

/**
 * Employee Self-Service: Mark all unread notifications for user as read
 */
export async function markAllNotificationsAsReadService(userId: string) {
  const now = new Date();
  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: now,
    },
  });

  return { markedCount: result.count };
}
