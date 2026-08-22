import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { signToken } from '../src/utils/jwt.util';
import { Role, AttendanceStatus } from '@prisma/client';
import {
  calculateAttendanceMetrics,
  getPersonalAttendanceAnalyticsService,
  getOrganizationOverviewAnalyticsService,
  getDepartmentAnalyticsService,
  getAttendanceTrendService,
  getLowAttendanceEmployeesService,
} from '../src/modules/attendance/attendance.analytics.service';

// Mock database
jest.mock('../src/config/database', () => ({
  prisma: {
    employee: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    department: {
      findMany: jest.fn(),
    },
    attendance: {
      findMany: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  },
}));

describe('Attendance Analytics Module (TDD)', () => {
  const mockEmployeeUserId = 'user-emp-123';
  const mockEmployeeId = 'emp-profile-123';

  const employeeToken = signToken({
    userId: mockEmployeeUserId,
    loginId: 'OIJODO20260001',
    email: 'employee@dayflow.com',
    role: Role.EMPLOYEE,
    employeeId: mockEmployeeId,
    requiresPasswordChange: false,
  });

  const hrToken = signToken({
    userId: 'user-hr-123',
    loginId: 'OIHRMG20260001',
    email: 'hr@dayflow.com',
    role: Role.HR,
    employeeId: 'emp-hr-123',
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

  describe('Calculation Formulas & Helper Logic', () => {
    it('should correctly calculate attendanceRate, absenteeismRate, and averageWorkingHours', () => {
      const records = [
        { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
        { status: AttendanceStatus.PRESENT, workHours: 9, overtimeHours: 1 },
        { status: AttendanceStatus.HALF_DAY, workHours: 4, overtimeHours: 0 },
        { status: AttendanceStatus.LEAVE, workHours: 0, overtimeHours: 0 },
        { status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 },
      ];

      const metrics = calculateAttendanceMetrics(records);

      expect(metrics.totalRecords).toBe(5);
      expect(metrics.presentDays).toBe(2);
      expect(metrics.halfDays).toBe(1);
      expect(metrics.leaveDays).toBe(1);
      expect(metrics.absentDays).toBe(1);
      expect(metrics.totalWorkingHours).toBe(21);
      expect(metrics.totalOvertimeHours).toBe(1);
      // attendanceRate: (2 + 1*0.5) / 5 = 2.5/5 = 50.0%
      expect(metrics.attendanceRate).toBe(50.0);
      // absenteeismRate: 1 / 5 = 20.0%
      expect(metrics.absenteeismRate).toBe(20.0);
      // averageWorkingHours on active days (2 present + 1 half day = 3): 21 / 3 = 7.0
      expect(metrics.averageWorkingHours).toBe(7.0);
    });

    it('should handle zero attendance records gracefully without division by zero', () => {
      const metrics = calculateAttendanceMetrics([]);
      expect(metrics.totalRecords).toBe(0);
      expect(metrics.attendanceRate).toBe(0);
      expect(metrics.absenteeismRate).toBe(0);
      expect(metrics.averageWorkingHours).toBe(0);
    });
  });

  describe('RBAC Guards on Analytics Endpoints', () => {
    it('should permit EMPLOYEE to access their own analytics (/api/v1/attendance/analytics)', async () => {
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([]);

      const res = await request(app)
        .get('/api/v1/attendance/analytics')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should FORBID EMPLOYEE from accessing organization overview (/analytics/overview)', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics/overview')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should FORBID EMPLOYEE from accessing department analytics (/analytics/departments)', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics/departments')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should FORBID EMPLOYEE from accessing attendance trends (/analytics/trend)', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics/trend')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should FORBID EMPLOYEE from accessing low attendance reports (/analytics/low-attendance)', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics/low-attendance')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should ALLOW HR and ADMIN to access organization overview', async () => {
      (prisma.employee.count as jest.Mock).mockResolvedValue(50);
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([]);

      const hrRes = await request(app)
        .get('/api/v1/attendance/analytics/overview')
        .set('Authorization', `Bearer ${hrToken}`);
      expect(hrRes.status).toBe(200);

      const adminRes = await request(app)
        .get('/api/v1/attendance/analytics/overview')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(adminRes.status).toBe(200);
    });
  });

  describe('Date Validation & Constraint Handling', () => {
    it('should reject invalid date format in from/to parameters', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics?from=invalid-date')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject date range where from > to', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics?from=2026-08-25&to=2026-08-20')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid threshold value on low-attendance endpoint', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/analytics/low-attendance?threshold=150')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });

  describe('Department Analytics Service', () => {
    it('should aggregate attendance statistics per department', async () => {
      (prisma.department.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'dept-eng',
          name: 'Engineering',
          code: 'ENG',
          employees: [
            {
              id: 'emp-1',
              attendanceRecords: [
                { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
                { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
              ],
            },
            {
              id: 'emp-2',
              attendanceRecords: [
                { status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 },
              ],
            },
          ],
        },
      ]);

      const result = await getDepartmentAnalyticsService({
        from: '2026-08-01',
        to: '2026-08-22',
      });

      expect(result).toHaveLength(1);
      expect(result[0].departmentName).toBe('Engineering');
      expect(result[0].employeeCount).toBe(2);
      expect(result[0].present).toBe(2);
      expect(result[0].absent).toBe(1);
      expect(result[0].attendanceRate).toBe(66.67);
      expect(result[0].totalWorkingHours).toBe(16);
    });
  });

  describe('Attendance Trend Service', () => {
    it('should generate daily trend records across date range', async () => {
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([
        { date: new Date('2026-08-20'), status: AttendanceStatus.PRESENT, workHours: 8 },
        { date: new Date('2026-08-20'), status: AttendanceStatus.ABSENT, workHours: 0 },
        { date: new Date('2026-08-21'), status: AttendanceStatus.PRESENT, workHours: 9 },
      ]);

      const trend = await getAttendanceTrendService({
        from: '2026-08-20',
        to: '2026-08-21',
      });

      expect(trend).toBeInstanceOf(Array);
      expect(trend.length).toBe(2);
      expect(trend[0].date).toBe('2026-08-20');
      expect(trend[0].present).toBe(1);
      expect(trend[0].absent).toBe(1);
      expect(trend[1].date).toBe('2026-08-21');
      expect(trend[1].present).toBe(1);
    });
  });

  describe('Low Attendance Identification Service', () => {
    it('should filter and return employees with attendance below threshold', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'emp-1',
          loginId: 'OIJODO20260001',
          firstName: 'John',
          lastName: 'Doe',
          department: { name: 'Engineering' },
          attendanceRecords: [
            { status: AttendanceStatus.PRESENT, workHours: 8 },
            { status: AttendanceStatus.ABSENT, workHours: 0 },
            { status: AttendanceStatus.ABSENT, workHours: 0 },
            { status: AttendanceStatus.ABSENT, workHours: 0 },
          ], // 1 present out of 4 = 25%
        },
        {
          id: 'emp-2',
          loginId: 'OISASM20260001',
          firstName: 'Sarah',
          lastName: 'Smith',
          department: { name: 'HR' },
          attendanceRecords: [
            { status: AttendanceStatus.PRESENT, workHours: 8 },
            { status: AttendanceStatus.PRESENT, workHours: 8 },
            { status: AttendanceStatus.PRESENT, workHours: 8 },
            { status: AttendanceStatus.PRESENT, workHours: 8 },
          ], // 100%
        },
      ]);

      const result = await getLowAttendanceEmployeesService({
        from: '2026-08-01',
        to: '2026-08-22',
        threshold: 80,
      });

      expect(result.threshold).toBe(80);
      expect(result.count).toBe(1);
      expect(result.employees[0].employeeId).toBe('emp-1');
      expect(result.employees[0].employeeName).toBe('John Doe');
      expect(result.employees[0].attendanceRate).toBe(25.0);
    });
  });
});
