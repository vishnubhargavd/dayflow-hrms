import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { signToken } from '../src/utils/jwt.util';
import { Role, AttendanceStatus } from '@prisma/client';
import {
  calculateWorkAndOvertimeHours,
  normalizeDate,
  checkInService,
  checkOutService,
  getTodayAttendanceService,
  getAttendanceHistoryService,
  getWeeklyAttendanceService,
  getMonthlyAttendanceService,
} from '../src/modules/attendance/attendance.service';

// Mock Prisma Client
jest.mock('../src/config/database', () => ({
  prisma: {
    employee: {
      findUnique: jest.fn(),
    },
    attendance: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('Attendance Module (TDD)', () => {
  const mockEmployeeUserId = 'user-emp-123';
  const mockEmployeeId = 'emp-profile-123';
  const mockOtherEmployeeId = 'emp-profile-456';

  const employeeToken = signToken({
    userId: mockEmployeeUserId,
    loginId: 'OIJODO20260001',
    email: 'employee@dayflow.com',
    role: Role.EMPLOYEE,
    employeeId: mockEmployeeId,
    requiresPasswordChange: false,
  });

  const adminToken = signToken({
    userId: 'user-admin-123',
    loginId: 'OIADMN20260001',
    email: 'admin@dayflow.com',
    role: Role.ADMIN,
    employeeId: 'emp-admin-123',
    requiresPasswordChange: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Working Hours and Overtime Calculation Unit Logic', () => {
    it('should calculate standard 8 hours working time with 0 overtime', () => {
      const checkIn = new Date('2026-08-22T09:00:00.000Z');
      const checkOut = new Date('2026-08-22T17:00:00.000Z'); // 8 hours

      const result = calculateWorkAndOvertimeHours(checkIn, checkOut);
      expect(result.workHours).toBe(8);
      expect(result.overtimeHours).toBe(0);
      expect(result.status).toBe(AttendanceStatus.PRESENT);
    });

    it('should calculate 9.5 hours working time with 1.5 overtime', () => {
      const checkIn = new Date('2026-08-22T09:00:00.000Z');
      const checkOut = new Date('2026-08-22T18:30:00.000Z'); // 9.5 hours

      const result = calculateWorkAndOvertimeHours(checkIn, checkOut);
      expect(result.workHours).toBe(9.5);
      expect(result.overtimeHours).toBe(1.5);
      expect(result.status).toBe(AttendanceStatus.PRESENT);
    });

    it('should classify working duration between 4 and 8 hours as HALF_DAY', () => {
      const checkIn = new Date('2026-08-22T09:00:00.000Z');
      const checkOut = new Date('2026-08-22T14:00:00.000Z'); // 5 hours

      const result = calculateWorkAndOvertimeHours(checkIn, checkOut);
      expect(result.workHours).toBe(5);
      expect(result.overtimeHours).toBe(0);
      expect(result.status).toBe(AttendanceStatus.HALF_DAY);
    });

    it('should classify working duration under 4 hours as HALF_DAY', () => {
      const checkIn = new Date('2026-08-22T09:00:00.000Z');
      const checkOut = new Date('2026-08-22T11:00:00.000Z'); // 2 hours

      const result = calculateWorkAndOvertimeHours(checkIn, checkOut);
      expect(result.workHours).toBe(2);
      expect(result.overtimeHours).toBe(0);
      expect(result.status).toBe(AttendanceStatus.HALF_DAY);
    });

    it('should normalize date to UTC midnight', () => {
      const d = normalizeDate('2026-08-22T15:30:00.000Z');
      expect(d.getUTCHours()).toBe(0);
      expect(d.getUTCMinutes()).toBe(0);
      expect(d.getUTCDate()).toBe(22);
    });
  });

  describe('HTTP Attendance Endpoints Authentication Guard', () => {
    it('should reject unauthenticated request to /api/v1/attendance/check-in', async () => {
      const res = await request(app).post('/api/v1/attendance/check-in').send({});
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('UNAUTHORIZED');
    });

    it('should reject unauthenticated request to /api/v1/attendance/check-out', async () => {
      const res = await request(app).post('/api/v1/attendance/check-out').send({});
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('UNAUTHORIZED');
    });

    it('should reject unauthenticated request to /api/v1/attendance/today', async () => {
      const res = await request(app).get('/api/v1/attendance/today');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should reject unauthenticated request to /api/v1/attendance', async () => {
      const res = await request(app).get('/api/v1/attendance');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('Validation Middleware on Query Parameters', () => {
    it('should reject invalid page and limit values', async () => {
      const res = await request(app)
        .get('/api/v1/attendance?page=-1&limit=abc')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid date range format in query', async () => {
      const res = await request(app)
        .get('/api/v1/attendance?startDate=invalid-date')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid status filter value', async () => {
      const res = await request(app)
        .get('/api/v1/attendance?status=INVALID_STATUS')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  describe('Check-In Service Flow', () => {
    it('should allow employee check-in when no prior record exists', async () => {
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.attendance.upsert as jest.Mock).mockResolvedValue({
        id: 'att-1',
        employeeId: mockEmployeeId,
        date: normalizeDate(new Date()),
        checkIn: new Date(),
        checkOut: null,
        status: AttendanceStatus.PRESENT,
        workHours: null,
        overtimeHours: 0,
      });

      const result = await checkInService({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      expect(result).toHaveProperty('id', 'att-1');
      expect(result.status).toBe(AttendanceStatus.PRESENT);
      expect(prisma.attendance.upsert).toHaveBeenCalled();
    });

    it('should reject duplicate check-in on the same day', async () => {
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue({
        id: 'att-1',
        employeeId: mockEmployeeId,
        date: normalizeDate(new Date()),
        checkIn: new Date(),
      });

      await expect(
        checkInService({
          userId: mockEmployeeUserId,
          loginId: 'OIJODO20260001',
          email: 'employee@dayflow.com',
          role: Role.EMPLOYEE,
          employeeId: mockEmployeeId,
          requiresPasswordChange: false,
        })
      ).rejects.toThrow('You have already checked in for today.');
    });
  });

  describe('Check-Out Service Flow', () => {
    it('should reject checkout if employee has not checked in today', async () => {
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        checkOutService({
          userId: mockEmployeeUserId,
          loginId: 'OIJODO20260001',
          email: 'employee@dayflow.com',
          role: Role.EMPLOYEE,
          employeeId: mockEmployeeId,
          requiresPasswordChange: false,
        })
      ).rejects.toThrow('No check-in record found for today. You must check in before checking out.');
    });

    it('should reject duplicate checkout if employee already checked out', async () => {
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue({
        id: 'att-1',
        employeeId: mockEmployeeId,
        checkIn: new Date(Date.now() - 8 * 3600 * 1000),
        checkOut: new Date(),
      });

      await expect(
        checkOutService({
          userId: mockEmployeeUserId,
          loginId: 'OIJODO20260001',
          email: 'employee@dayflow.com',
          role: Role.EMPLOYEE,
          employeeId: mockEmployeeId,
          requiresPasswordChange: false,
        })
      ).rejects.toThrow('You have already checked out for today.');
    });

    it('should calculate working hours and overtime on valid checkout', async () => {
      const checkInTime = new Date(Date.now() - 9 * 3600 * 1000); // 9 hours ago
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue({
        id: 'att-1',
        employeeId: mockEmployeeId,
        checkIn: checkInTime,
        checkOut: null,
      });

      (prisma.attendance.update as jest.Mock).mockResolvedValue({
        id: 'att-1',
        employeeId: mockEmployeeId,
        checkIn: checkInTime,
        checkOut: new Date(),
        workHours: 9,
        overtimeHours: 1,
        status: AttendanceStatus.PRESENT,
      });

      const result = await checkOutService({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      expect(result.workHours).toBe(9);
      expect(result.overtimeHours).toBe(1);
      expect(result.status).toBe(AttendanceStatus.PRESENT);
    });
  });

  describe('Get Today Attendance Service', () => {
    it('should return NOT_CHECKED_IN when no record exists for today', async () => {
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await getTodayAttendanceService({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      expect(result.status).toBe('NOT_CHECKED_IN');
      expect(result.record).toBeNull();
    });

    it('should return CHECKED_IN status when check-in exists without checkout', async () => {
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue({
        id: 'att-1',
        employeeId: mockEmployeeId,
        date: normalizeDate(new Date()),
        checkIn: new Date(),
        checkOut: null,
        status: AttendanceStatus.PRESENT,
      });

      const result = await getTodayAttendanceService({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      expect(result.status).toBe('CHECKED_IN');
      expect(result.record).not.toBeNull();
    });
  });

  describe('Attendance History Scoping (RBAC & IDOR Protection)', () => {
    it('should strictly limit regular EMPLOYEE to their own employeeId', async () => {
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.attendance.count as jest.Mock).mockResolvedValue(0);

      // Attempting to query with another employeeId as EMPLOYEE
      await getAttendanceHistoryService(
        {
          userId: mockEmployeeUserId,
          loginId: 'OIJODO20260001',
          email: 'employee@dayflow.com',
          role: Role.EMPLOYEE,
          employeeId: mockEmployeeId,
          requiresPasswordChange: false,
        },
        { employeeId: mockOtherEmployeeId, page: 1, limit: 20 }
      );

      // Verify that prisma.attendance.findMany was called with the authenticated employee's ID, NOT the other ID
      expect(prisma.attendance.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            employeeId: mockEmployeeId,
          }),
        })
      );
    });

    it('should allow ADMIN to filter by specific employeeId', async () => {
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.attendance.count as jest.Mock).mockResolvedValue(0);

      await getAttendanceHistoryService(
        {
          userId: 'user-admin-123',
          loginId: 'OIADMN20260001',
          email: 'admin@dayflow.com',
          role: Role.ADMIN,
          employeeId: 'emp-admin-123',
          requiresPasswordChange: false,
        },
        { employeeId: mockOtherEmployeeId, page: 1, limit: 20 }
      );

      expect(prisma.attendance.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            employeeId: mockOtherEmployeeId,
          }),
        })
      );
    });
  });

  describe('Weekly and Monthly Summary Views', () => {
    it('should calculate weekly summary metrics correctly', async () => {
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([
        { id: '1', date: new Date('2026-08-17'), status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
        { id: '2', date: new Date('2026-08-18'), status: AttendanceStatus.PRESENT, workHours: 9, overtimeHours: 1 },
        { id: '3', date: new Date('2026-08-19'), status: AttendanceStatus.HALF_DAY, workHours: 4, overtimeHours: 0 },
        { id: '4', date: new Date('2026-08-20'), status: AttendanceStatus.LEAVE, workHours: 0, overtimeHours: 0 },
        { id: '5', date: new Date('2026-08-21'), status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 },
      ]);

      const result = await getWeeklyAttendanceService(
        {
          userId: mockEmployeeUserId,
          loginId: 'OIJODO20260001',
          email: 'employee@dayflow.com',
          role: Role.EMPLOYEE,
          employeeId: mockEmployeeId,
          requiresPasswordChange: false,
        },
        { startDate: '2026-08-17' }
      );

      expect(result.summary.totalRecords).toBe(5);
      expect(result.summary.presentDays).toBe(2);
      expect(result.summary.halfDays).toBe(1);
      expect(result.summary.leaveDays).toBe(1);
      expect(result.summary.absentDays).toBe(1);
      expect(result.summary.totalWorkHours).toBe(21);
      expect(result.summary.totalOvertimeHours).toBe(1);
    });

    it('should calculate monthly summary metrics correctly', async () => {
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([
        { id: '1', date: new Date('2026-08-01'), status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
        { id: '2', date: new Date('2026-08-02'), status: AttendanceStatus.PRESENT, workHours: 10, overtimeHours: 2 },
      ]);

      const result = await getMonthlyAttendanceService(
        {
          userId: mockEmployeeUserId,
          loginId: 'OIJODO20260001',
          email: 'employee@dayflow.com',
          role: Role.EMPLOYEE,
          employeeId: mockEmployeeId,
          requiresPasswordChange: false,
        },
        { month: '8', year: '2026' }
      );

      expect(result.month).toBe(8);
      expect(result.year).toBe(2026);
      expect(result.summary.recordedDays).toBe(2);
      expect(result.summary.presentDays).toBe(2);
      expect(result.summary.totalWorkHours).toBe(18);
      expect(result.summary.totalOvertimeHours).toBe(2);
      expect(result.summary.averageDailyWorkHours).toBe(9);
    });
  });
});
