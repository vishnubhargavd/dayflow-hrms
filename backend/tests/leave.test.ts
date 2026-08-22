import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { calculateLeaveDays } from '../src/modules/leave/leave.service';
import { signToken } from '../src/utils/jwt.util';
import { Role, LeaveCategory, LeaveStatus } from '@prisma/client';

// Mock Prisma Database Client for unit & integration tests
jest.mock('../src/config/database', () => {
  const mockPrisma: any = {
    leaveType: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    leaveBalance: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    },
    leaveRequest: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
    attendance: {
      upsert: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe('Leave Management Module Tests', () => {
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

  const hrUserId = '55555555-5555-5555-5555-555555555555';
  const hrEmployeeId = '66666666-6666-6666-6666-666666666666';
  const hrToken = signToken({
    userId: hrUserId,
    loginId: 'OIHRMG20260001',
    email: 'hr@dayflow.com',
    role: Role.HR,
    employeeId: hrEmployeeId,
    requiresPasswordChange: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('1. Server-Side Date Calculation Utilities', () => {
    it('should calculate inclusive total days correctly', () => {
      const { startDate, endDate, totalDays } = calculateLeaveDays('2026-08-25', '2026-08-27');
      expect(totalDays).toBe(3);
      expect(startDate.getFullYear()).toBe(2026);
      expect(startDate.getMonth()).toBe(7); // 0-indexed August
      expect(startDate.getDate()).toBe(25);
      expect(endDate.getDate()).toBe(27);
    });

    it('should calculate single day leave as 1 day', () => {
      const { totalDays } = calculateLeaveDays('2026-09-10', '2026-09-10');
      expect(totalDays).toBe(1);
    });

    it('should reject end date prior to start date', () => {
      expect(() => calculateLeaveDays('2026-08-27', '2026-08-25')).toThrow(
        'End date cannot be prior to start date.'
      );
    });

    it('should reject invalid date strings', () => {
      expect(() => calculateLeaveDays('invalid-date', '2026-08-25')).toThrow(
        'Invalid start or end date format.'
      );
    });
  });

  describe('2. Employee Self-Service Endpoints (/api/v1/leave/me/*)', () => {
    it('GET /api/v1/leave/me/balances — should require authentication', async () => {
      const response = await request(app).get('/api/v1/leave/me/balances');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('GET /api/v1/leave/me/balances — should return balances for authenticated employee', async () => {
      (prisma.leaveBalance.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'bal-1',
          leaveTypeId: 'type-paid',
          year: 2026,
          allocatedDays: 18,
          usedDays: 4,
          pendingDays: 2,
          leaveType: { name: 'Paid Leave', code: 'PAID', category: LeaveCategory.PAID },
        },
      ]);

      const response = await request(app)
        .get('/api/v1/leave/me/balances')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0].remainingDays).toBe(12);
    });

    it('GET /api/v1/leave/me/requests — should return paginated leave requests', async () => {
      (prisma.leaveRequest.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.leaveRequest.count as jest.Mock).mockResolvedValue(0);

      const response = await request(app)
        .get('/api/v1/leave/me/requests?page=1&limit=10')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.meta).toBeDefined();
      expect(response.body.meta.page).toBe(1);
    });

    it('POST /api/v1/leave/me/requests — should validate payload format via Zod', async () => {
      const response = await request(app)
        .post('/api/v1/leave/me/requests')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveTypeId: 'not-a-uuid',
          startDate: '2026-08-25',
          endDate: '2026-08-20',
          reason: 'ab',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('POST /api/v1/leave/me/requests — should reject invalid date range (endDate < startDate)', async () => {
      const response = await request(app)
        .post('/api/v1/leave/me/requests')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          leaveTypeId: '00000000-0000-0000-0000-000000000000',
          startDate: '2026-08-27',
          endDate: '2026-08-25',
          reason: 'Personal work',
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('End date cannot be prior to start date.');
    });

    it('PATCH /api/v1/leave/me/requests/:id/cancel — should cancel pending leave request', async () => {
      (prisma.leaveRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'req-1',
        employeeId,
        leaveTypeId: 'type-paid',
        startDate: new Date('2026-08-25'),
        endDate: new Date('2026-08-27'),
        totalDays: 3,
        status: LeaveStatus.PENDING,
      });

      (prisma.leaveRequest.update as jest.Mock).mockResolvedValue({
        id: 'req-1',
        status: LeaveStatus.CANCELLED,
      });

      (prisma.leaveBalance.findUnique as jest.Mock).mockResolvedValue({
        id: 'bal-1',
        pendingDays: 3,
      });

      const response = await request(app)
        .patch('/api/v1/leave/me/requests/req-1/cancel')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(LeaveStatus.CANCELLED);
    });

    it('PATCH /api/v1/leave/me/requests/:id/cancel — should reject non-owner cancellation (IDOR protection)', async () => {
      (prisma.leaveRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'req-other',
        employeeId: 'other-emp-id',
        status: LeaveStatus.PENDING,
      });

      const response = await request(app)
        .patch('/api/v1/leave/me/requests/req-other/cancel')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.errorCode).toBe('FORBIDDEN');
    });
  });

  describe('3. HR / Admin Operations & RBAC Control', () => {
    it('GET /api/v1/leave/requests — should enforce RBAC (403 for EMPLOYEE)', async () => {
      const response = await request(app)
        .get('/api/v1/leave/requests')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.errorCode).toBe('FORBIDDEN');
    });

    it('GET /api/v1/leave/requests — should allow HR / Admin access', async () => {
      (prisma.leaveRequest.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.leaveRequest.count as jest.Mock).mockResolvedValue(0);

      const response = await request(app)
        .get('/api/v1/leave/requests')
        .set('Authorization', `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('GET /api/v1/leave/types — should list configured leave types', async () => {
      (prisma.leaveType.findMany as jest.Mock).mockResolvedValue([
        { id: 'type-paid', name: 'Paid Leave', code: 'PAID', category: LeaveCategory.PAID, maxDaysPerYear: 18, isActive: true },
      ]);

      const response = await request(app)
        .get('/api/v1/leave/types')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('POST /api/v1/leave/types — should enforce HR/Admin RBAC', async () => {
      const response = await request(app)
        .post('/api/v1/leave/types')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Maternity Leave',
          code: 'MATERNITY',
          category: LeaveCategory.MATERNITY,
          maxDaysPerYear: 180,
        });

      expect(response.status).toBe(403);
      expect(response.body.errorCode).toBe('FORBIDDEN');
    });

    it('PATCH /api/v1/leave/requests/:id/approve — should allow HR approval', async () => {
      (prisma.leaveRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'req-1',
        employeeId,
        leaveTypeId: 'type-paid',
        startDate: new Date('2026-08-25'),
        endDate: new Date('2026-08-27'),
        totalDays: 3,
        status: LeaveStatus.PENDING,
        leaveType: { category: LeaveCategory.PAID },
      });

      (prisma.leaveBalance.findUnique as jest.Mock).mockResolvedValue({
        id: 'bal-1',
        allocatedDays: 18,
        usedDays: 0,
        pendingDays: 3,
      });

      (prisma.leaveBalance.update as jest.Mock).mockResolvedValue({});
      (prisma.leaveRequest.update as jest.Mock).mockResolvedValue({
        id: 'req-1',
        status: LeaveStatus.APPROVED,
      });

      const response = await request(app)
        .patch('/api/v1/leave/requests/req-1/approve')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ reviewerComment: 'Approved by HR' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.status).toBe(LeaveStatus.APPROVED);
    });
  });
});
