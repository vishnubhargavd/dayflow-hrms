import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { signToken } from '../src/utils/jwt.util';
import { validateStatusTransition } from '../src/modules/helpdesk/helpdesk.service';
import { Role, HelpdeskCategory, HelpdeskPriority, HelpdeskStatus } from '@prisma/client';

// Mock Prisma Database Client for Helpdesk unit & integration tests
jest.mock('../src/config/database', () => {
  const mockPrisma: any = {
    helpdeskRequest: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    helpdeskComment: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrisma)),
  };
  return { prisma: mockPrisma };
});

describe('HR Helpdesk / Employee Request Management Module Tests', () => {
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

  const otherEmployeeUserId = '33333333-3333-3333-3333-333333333333';
  const otherEmployeeId = '44444444-4444-4444-4444-444444444444';
  const otherEmployeeToken = signToken({
    userId: otherEmployeeUserId,
    loginId: 'OISMITH20260002',
    email: 'jane.smith@dayflow.com',
    role: Role.EMPLOYEE,
    employeeId: otherEmployeeId,
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

  describe('1. Status State Machine Transition Rules', () => {
    it('should allow valid status transitions', () => {
      expect(() => validateStatusTransition(HelpdeskStatus.OPEN, HelpdeskStatus.IN_PROGRESS)).not.toThrow();
      expect(() => validateStatusTransition(HelpdeskStatus.IN_PROGRESS, HelpdeskStatus.RESOLVED)).not.toThrow();
      expect(() => validateStatusTransition(HelpdeskStatus.RESOLVED, HelpdeskStatus.CLOSED)).not.toThrow();
      expect(() => validateStatusTransition(HelpdeskStatus.OPEN, HelpdeskStatus.CANCELLED)).not.toThrow();
    });

    it('should reject invalid status transitions', () => {
      expect(() => validateStatusTransition(HelpdeskStatus.CLOSED, HelpdeskStatus.OPEN)).toThrow(
        "Invalid status transition from 'CLOSED' to 'OPEN'."
      );
      expect(() => validateStatusTransition(HelpdeskStatus.RESOLVED, HelpdeskStatus.IN_PROGRESS)).toThrow(
        "Invalid status transition from 'RESOLVED' to 'IN_PROGRESS'."
      );
      expect(() => validateStatusTransition(HelpdeskStatus.CANCELLED, HelpdeskStatus.RESOLVED)).toThrow(
        "Invalid status transition from 'CANCELLED' to 'RESOLVED'."
      );
    });
  });

  describe('2. Employee Self-Service Endpoints (/api/v1/helpdesk/me/*)', () => {
    it('GET /api/v1/helpdesk/me/requests — should require authentication', async () => {
      const response = await request(app).get('/api/v1/helpdesk/me/requests');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('GET /api/v1/helpdesk/me/requests — should return paginated requests for employee', async () => {
      (prisma.helpdeskRequest.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'hd-1',
          ticketNumber: 'HD-2026-0001',
          employeeId,
          category: HelpdeskCategory.ATTENDANCE_CORRECTION,
          subject: 'Checkout missing',
          status: HelpdeskStatus.OPEN,
        },
      ]);
      (prisma.helpdeskRequest.count as jest.Mock).mockResolvedValue(1);

      const response = await request(app)
        .get('/api/v1/helpdesk/me/requests?page=1&limit=10')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.meta.total).toBe(1);
    });

    it('POST /api/v1/helpdesk/me/requests — should validate Zod payload bounds', async () => {
      const response = await request(app)
        .post('/api/v1/helpdesk/me/requests')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          category: 'INVALID_CATEGORY',
          subject: '',
          description: '',
        });

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('POST /api/v1/helpdesk/me/requests — should create helpdesk ticket successfully', async () => {
      (prisma.helpdeskRequest.count as jest.Mock).mockResolvedValue(0);
      (prisma.helpdeskRequest.create as jest.Mock).mockResolvedValue({
        id: 'hd-new',
        ticketNumber: 'HD-2026-0001',
        employeeId,
        category: HelpdeskCategory.SALARY_ISSUE,
        priority: HelpdeskPriority.HIGH,
        subject: 'Payslip discrepancy',
        description: 'Basic salary component calculation mismatch.',
        status: HelpdeskStatus.OPEN,
      });

      const response = await request(app)
        .post('/api/v1/helpdesk/me/requests')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          category: HelpdeskCategory.SALARY_ISSUE,
          priority: HelpdeskPriority.HIGH,
          subject: 'Payslip discrepancy',
          description: 'Basic salary component calculation mismatch.',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.ticketNumber).toBe('HD-2026-0001');
    });

    it('GET /api/v1/helpdesk/me/requests/:id — should enforce IDOR protection against non-owners', async () => {
      (prisma.helpdeskRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'hd-other',
        employeeId: otherEmployeeId,
        subject: 'Other employee ticket',
      });

      const response = await request(app)
        .get('/api/v1/helpdesk/me/requests/hd-other')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.errorCode).toBe('FORBIDDEN');
    });

    it('PATCH /api/v1/helpdesk/me/requests/:id/cancel — should cancel open request', async () => {
      (prisma.helpdeskRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        employeeId,
        status: HelpdeskStatus.OPEN,
      });

      (prisma.helpdeskRequest.update as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        status: HelpdeskStatus.CANCELLED,
      });

      const response = await request(app)
        .patch('/api/v1/helpdesk/me/requests/hd-1/cancel')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe(HelpdeskStatus.CANCELLED);
    });

    it('POST /api/v1/helpdesk/me/requests/:id/comments — should add comment to ticket thread', async () => {
      (prisma.helpdeskRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        employeeId,
        status: HelpdeskStatus.IN_PROGRESS,
      });

      (prisma.helpdeskComment.create as jest.Mock).mockResolvedValue({
        id: 'cm-1',
        helpdeskRequestId: 'hd-1',
        authorId: employeeUserId,
        message: 'Additional details regarding biometric ID.',
      });

      const response = await request(app)
        .post('/api/v1/helpdesk/me/requests/hd-1/comments')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ message: 'Additional details regarding biometric ID.' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('cm-1');
    });
  });

  describe('3. HR / Admin Operations & RBAC Control', () => {
    it('GET /api/v1/helpdesk/requests — should enforce RBAC (403 for EMPLOYEE)', async () => {
      const response = await request(app)
        .get('/api/v1/helpdesk/requests')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(response.status).toBe(403);
      expect(response.body.errorCode).toBe('FORBIDDEN');
    });

    it('GET /api/v1/helpdesk/requests — should list requests for HR / Admin', async () => {
      (prisma.helpdeskRequest.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.helpdeskRequest.count as jest.Mock).mockResolvedValue(0);

      const response = await request(app)
        .get('/api/v1/helpdesk/requests')
        .set('Authorization', `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('PATCH /api/v1/helpdesk/requests/:id/assign — should validate assigned employee role', async () => {
      (prisma.helpdeskRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        status: HelpdeskStatus.OPEN,
      });

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({
        id: employeeId,
        user: { role: Role.EMPLOYEE }, // Regular employee cannot be assigned
      });

      const response = await request(app)
        .patch('/api/v1/helpdesk/requests/hd-1/assign')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ assignedToId: employeeId });

      expect(response.status).toBe(400);
      expect(response.body.errorCode).toBe('INVALID_ASSIGNMENT');
    });

    it('PATCH /api/v1/helpdesk/requests/:id/assign — should assign ticket to HR officer and update status to IN_PROGRESS', async () => {
      (prisma.helpdeskRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        status: HelpdeskStatus.OPEN,
      });

      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({
        id: hrEmployeeId,
        user: { role: Role.HR },
      });

      (prisma.helpdeskRequest.update as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        assignedToId: hrEmployeeId,
        status: HelpdeskStatus.IN_PROGRESS,
      });

      const response = await request(app)
        .patch('/api/v1/helpdesk/requests/hd-1/assign')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ assignedToId: hrEmployeeId });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe(HelpdeskStatus.IN_PROGRESS);
    });

    it('PATCH /api/v1/helpdesk/requests/:id/resolve — should resolve ticket with resolution notes', async () => {
      (prisma.helpdeskRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        status: HelpdeskStatus.IN_PROGRESS,
      });

      (prisma.helpdeskRequest.update as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        status: HelpdeskStatus.RESOLVED,
        resolution: 'Biometric record updated manually.',
      });

      const response = await request(app)
        .patch('/api/v1/helpdesk/requests/hd-1/resolve')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ resolution: 'Biometric record updated manually.' });

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe(HelpdeskStatus.RESOLVED);
    });

    it('PATCH /api/v1/helpdesk/requests/:id/close — should close resolved ticket', async () => {
      (prisma.helpdeskRequest.findUnique as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        status: HelpdeskStatus.RESOLVED,
      });

      (prisma.helpdeskRequest.update as jest.Mock).mockResolvedValue({
        id: 'hd-1',
        status: HelpdeskStatus.CLOSED,
      });

      const response = await request(app)
        .patch('/api/v1/helpdesk/requests/hd-1/close')
        .set('Authorization', `Bearer ${hrToken}`);

      expect(response.status).toBe(200);
      expect(response.body.data.status).toBe(HelpdeskStatus.CLOSED);
    });
  });
});
