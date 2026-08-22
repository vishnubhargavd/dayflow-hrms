import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { signToken } from '../src/utils/jwt.util';
import { Role, AttendanceStatus } from '@prisma/client';
import {
  generatePersonalSmartInsights,
  generateOrganizationSmartInsights,
  SmartInsight,
} from '../src/modules/attendance/attendance.insights.service';

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
    },
  },
}));

describe('Smart HR Intelligence / Smart Insights Engine (TDD)', () => {
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

  describe('Personal Employee Smart Insights Rules', () => {
    it('should generate WARNING insight when employee attendance is below 80%', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({
        id: mockEmployeeId,
        departmentId: 'dept-eng',
      });

      // 10 records: 6 present, 4 absent = 60% attendance
      const currentRecords = [
        ...Array(6).fill({ status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 }),
        ...Array(4).fill({ status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 }),
      ];

      (prisma.attendance.findMany as jest.Mock)
        .mockResolvedValueOnce(currentRecords) // Current month records
        .mockResolvedValueOnce([]); // Previous month records

      const insights = await generatePersonalSmartInsights({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      const lowAttInsight = insights.find((i) => i.id === 'LOW_ATTENDANCE');
      expect(lowAttInsight).toBeDefined();
      expect(lowAttInsight?.type).toBe('WARNING');
      expect(lowAttInsight?.message).toContain('60%');
    });

    it('should generate SUCCESS insight when attendance improved compared to previous period', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({
        id: mockEmployeeId,
        departmentId: 'dept-eng',
      });

      // Current month: 95%
      const currentRecords = [
        ...Array(19).fill({ status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 }),
        { status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 },
      ];
      // Previous month: 85%
      const previousRecords = [
        ...Array(17).fill({ status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 }),
        ...Array(3).fill({ status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 }),
      ];

      (prisma.attendance.findMany as jest.Mock)
        .mockResolvedValueOnce(currentRecords)
        .mockResolvedValueOnce(previousRecords);

      const insights = await generatePersonalSmartInsights({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      const improvedInsight = insights.find((i) => i.id === 'IMPROVED_ATTENDANCE');
      expect(improvedInsight).toBeDefined();
      expect(improvedInsight?.type).toBe('SUCCESS');
      expect(improvedInsight?.message).toContain('improved by 10%');
    });

    it('should generate WARNING insight when attendance decreased compared to previous period', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({
        id: mockEmployeeId,
        departmentId: 'dept-eng',
      });

      // Current month: 80% (16/20)
      const currentRecords = [
        ...Array(16).fill({ status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 }),
        ...Array(4).fill({ status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 }),
      ];
      // Previous month: 95% (19/20)
      const previousRecords = [
        ...Array(19).fill({ status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 }),
        { status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 },
      ];

      (prisma.attendance.findMany as jest.Mock)
        .mockResolvedValueOnce(currentRecords)
        .mockResolvedValueOnce(previousRecords);

      const insights = await generatePersonalSmartInsights({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      const declineInsight = insights.find((i) => i.id === 'DECLINING_ATTENDANCE');
      expect(declineInsight).toBeDefined();
      expect(declineInsight?.type).toBe('WARNING');
      expect(declineInsight?.message).toContain('decreased by 15%');
    });

    it('should generate INFO/WARNING insight when overtime is unusually high (>= 10 hours)', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({
        id: mockEmployeeId,
        departmentId: 'dept-eng',
      });

      const currentRecords = [
        { status: AttendanceStatus.PRESENT, workHours: 12, overtimeHours: 4 },
        { status: AttendanceStatus.PRESENT, workHours: 14, overtimeHours: 6 },
        { status: AttendanceStatus.PRESENT, workHours: 10, overtimeHours: 2 },
      ]; // total overtime = 12 hours

      (prisma.attendance.findMany as jest.Mock)
        .mockResolvedValueOnce(currentRecords)
        .mockResolvedValueOnce([]);

      const insights = await generatePersonalSmartInsights({
        userId: mockEmployeeUserId,
        loginId: 'OIJODO20260001',
        email: 'employee@dayflow.com',
        role: Role.EMPLOYEE,
        employeeId: mockEmployeeId,
        requiresPasswordChange: false,
      });

      const overtimeInsight = insights.find((i) => i.id === 'HIGH_OVERTIME');
      expect(overtimeInsight).toBeDefined();
      expect(overtimeInsight?.type).toBe('WARNING');
      expect(overtimeInsight?.message).toContain('12 hours of overtime');
    });
  });

  describe('Organization & HR Smart Insights Rules', () => {
    it('should generate organization alerts for low-attendance workforce count and top departments', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'emp-1',
          loginId: 'OIJODO20260001',
          firstName: 'John',
          lastName: 'Doe',
          departmentId: 'dept-eng',
          attendanceRecords: [
            { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
            { status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 },
            { status: AttendanceStatus.ABSENT, workHours: 0, overtimeHours: 0 },
          ], // 33.3% attendance (< 80%)
        },
        {
          id: 'emp-2',
          loginId: 'OISASM20260001',
          firstName: 'Sarah',
          lastName: 'Smith',
          departmentId: 'dept-eng',
          attendanceRecords: [
            { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
            { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
            { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
          ], // 100% attendance
        },
      ]);

      (prisma.department.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'dept-eng',
          name: 'Engineering',
          code: 'ENG',
          employees: [
            {
              attendanceRecords: [
                { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
                { status: AttendanceStatus.PRESENT, workHours: 8, overtimeHours: 0 },
              ],
            },
          ],
        },
      ]);

      const orgInsights = await generateOrganizationSmartInsights();

      const lowAttCountInsight = orgInsights.find((i) => i.id === 'ORG_LOW_ATTENDANCE_COUNT');
      expect(lowAttCountInsight).toBeDefined();
      expect(lowAttCountInsight?.message).toContain('1 employee currently has attendance below 80%');
    });
  });

  describe('HTTP Smart Insights Endpoints & RBAC Guards', () => {
    it('should allow EMPLOYEE to fetch their personal smart insights via GET /api/v1/attendance/insights', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: mockEmployeeId });
      (prisma.attendance.findMany as jest.Mock).mockResolvedValue([]);

      const res = await request(app)
        .get('/api/v1/attendance/insights')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('insights');
    });

    it('should FORBID EMPLOYEE from accessing organization insights via GET /api/v1/attendance/insights/overview', async () => {
      const res = await request(app)
        .get('/api/v1/attendance/insights/overview')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should ALLOW HR and ADMIN to access organization insights', async () => {
      (prisma.employee.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.department.findMany as jest.Mock).mockResolvedValue([]);

      const res = await request(app)
        .get('/api/v1/attendance/insights/overview')
        .set('Authorization', `Bearer ${hrToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('insights');
    });
  });
});
