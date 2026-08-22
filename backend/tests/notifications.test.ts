import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { signToken } from '../src/utils/jwt.util';
import { createInternalNotification, createBulkNotifications, getHRAndAdminUserIds } from '../src/modules/notifications/notifications.service';
import { Role, NotificationType } from '@prisma/client';

// Mock Prisma Database Client for Notifications unit & integration tests
jest.mock('../src/config/database', () => {
  const mockPrisma: any = {
    notification: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    leaveRequest: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    leaveBalance: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    leaveType: {
      findUnique: jest.fn(),
    },
    attendance: {
      upsert: jest.fn(),
    },
    helpdeskRequest: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe('Notification Management System Module Tests', () => {
  const employeeUserId = '11111111-1111-1111-1111-111111111111';
  const employeeId = '22222222-2222-2222-2222-222222222222';
  const employeeToken = signToken({
    userId: employeeUserId,
    loginId: 'OIJODO20260001',
    email: 'john.doe@dayflow.com',
    role: Role.EMPLOYEE,
    employeeId,
    requiresPasswordChange: false,
  });

  const otherUserId = '33333333-3333-3333-3333-333333333333';
  const otherEmployeeId = '44444444-4444-4444-4444-444444444444';
  const otherToken = signToken({
    userId: otherUserId,
    loginId: 'OISMITH20260002',
    email: 'jane.smith@dayflow.com',
    role: Role.EMPLOYEE,
    employeeId: otherEmployeeId,
    requiresPasswordChange: false,
  });

  const hrUserId = '55555555-5555-5555-5555-555555555555';
  const hrEmployeeId = '66666666-6666-6666-6666-666666666666';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Internal Notification Service Utilities', () => {
    it('should create a single internal notification', async () => {
      (prisma.notification.create as jest.Mock).mockResolvedValue({
        id: 'notif-1',
        userId: employeeUserId,
        type: NotificationType.LEAVE_APPROVED,
        title: 'Leave Approved',
        message: 'Your leave request was approved.',
      });

      const notif = await createInternalNotification({
        userId: employeeUserId,
        type: NotificationType.LEAVE_APPROVED,
        title: 'Leave Approved',
        message: 'Your leave request was approved.',
      });

      expect(prisma.notification.create).toHaveBeenCalled();
      expect(notif.id).toBe('notif-1');
    });

    it('should create bulk notifications for multiple recipients', async () => {
      (prisma.notification.createMany as jest.Mock).mockResolvedValue({ count: 2 });

      await createBulkNotifications({
        userIds: [hrUserId, otherUserId],
        type: NotificationType.LEAVE_SUBMITTED,
        title: 'New Leave Request',
        message: 'A new leave request requires review.',
      });

      expect(prisma.notification.createMany).toHaveBeenCalledWith({
        data: [
          { userId: hrUserId, type: NotificationType.LEAVE_SUBMITTED, title: 'New Leave Request', message: 'A new leave request requires review.' },
          { userId: otherUserId, type: NotificationType.LEAVE_SUBMITTED, title: 'New Leave Request', message: 'A new leave request requires review.' },
        ],
      });
    });

    it('should retrieve active HR and Admin user IDs', async () => {
      (prisma.user.findMany as jest.Mock).mockResolvedValue([
        { id: hrUserId },
      ]);

      const hrIds = await getHRAndAdminUserIds();
      expect(hrIds).toEqual([hrUserId]);
    });
  });

  describe('2. Employee Self-Service Endpoints (/api/v1/notifications/*)', () => {
    it('GET /api/v1/notifications/me — should require authentication (401)', async () => {
      const response = await request(app).get('/api/v1/notifications/me');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('GET /api/v1/notifications/me — should return paginated notifications for authenticated user', async () => {
      (prisma.notification.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'notif-1',
          userId: employeeUserId,
          type: NotificationType.LEAVE_APPROVED,
          title: 'Leave Approved',
          message: 'Your leave has been approved.',
          isRead: false,
        },
      ]);
      (prisma.notification.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/notifications/me?page=1&limit=10')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.total).toBe(1);
    });

    it('GET /api/v1/notifications/me/unread-count — should return unread notification count', async () => {
      (prisma.notification.count as jest.Mock).mockResolvedValue(3);

      const response = await request(app)
        .get('/api/v1/notifications/me/unread-count')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.unreadCount).toBe(3);
    });

    it('PATCH /api/v1/notifications/:id/read — should mark a single notification as read', async () => {
      const validUuid = '99999999-9999-9999-9999-999999999999';
      (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
        id: validUuid,
        userId: employeeUserId,
        isRead: false,
      });

      (prisma.notification.update as jest.Mock).mockResolvedValue({
        id: validUuid,
        userId: employeeUserId,
        isRead: true,
      });

      const response = await request(app)
        .patch(`/api/v1/notifications/${validUuid}/read`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('PATCH /api/v1/notifications/:id/read — should enforce IDOR protection against other user notifications', async () => {
      const validUuid = '99999999-9999-9999-9999-999999999999';
      (prisma.notification.findUnique as jest.Mock).mockResolvedValue({
        id: validUuid,
        userId: otherUserId, // Belongs to other user
        isRead: false,
      });

      const response = await request(app)
        .patch(`/api/v1/notifications/${validUuid}/read`)
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.errorCode).toBe('FORBIDDEN');
    });

    it('PATCH /api/v1/notifications/read-all — should mark all unread notifications as read', async () => {
      (prisma.notification.updateMany as jest.Mock).mockResolvedValue({ count: 5 });

      const response = await request(app)
        .patch('/api/v1/notifications/read-all')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.markedCount).toBe(5);
    });
  });
});
