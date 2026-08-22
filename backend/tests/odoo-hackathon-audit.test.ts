import request from 'supertest';
import app from '../src/app';
import { prisma } from '../src/config/database';
import { signToken } from '../src/utils/jwt.util';
import { Role, AttendanceStatus, LeaveStatus, LeaveCategory } from '@prisma/client';
import { sanitizeNamePrefix, generateConcurrencySafeLoginId } from '../src/utils/login-id-generator.util';
import { calculateWorkAndOvertimeHours } from '../src/modules/attendance/attendance.service';
import { computeDynamicWageBreakdown } from '../src/modules/payroll/payroll.service';

jest.mock('../src/config/database', () => ({
  prisma: {
    $transaction: jest.fn((cb) => cb(prisma)),
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    employee: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    loginSequence: {
      upsert: jest.fn(),
    },
    attendance: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    leaveRequest: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    leaveBalance: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    salaryComponent: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
    salaryStructure: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    salaryStructureItem: {
      deleteMany: jest.fn(),
    },
    salaryHistory: {
      create: jest.fn(),
    },
    payrollRecord: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    payslip: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    auditLog: {
      create: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      createMany: jest.fn(),
    },
  },
}));

describe('Odoo Hackathon HRMS QA Audit Suite', () => {
  const adminToken = signToken({
    userId: 'user-admin-1',
    loginId: 'OIADMN20260001',
    email: 'admin@odooindia.com',
    role: Role.ADMIN,
    employeeId: 'emp-admin-1',
    requiresPasswordChange: false,
  });

  const hrToken = signToken({
    userId: 'user-hr-1',
    loginId: 'OIHRMG20260001',
    email: 'hr@odooindia.com',
    role: Role.HR,
    employeeId: 'emp-hr-1',
    requiresPasswordChange: false,
  });

  const employeeToken = signToken({
    userId: 'user-emp-1',
    loginId: 'OIJODO20220001',
    email: 'john.doe@odooindia.com',
    role: Role.EMPLOYEE,
    employeeId: 'emp-emp-1',
    requiresPasswordChange: false,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================================================
  // 1. DETERMINISTIC LOGIN ID GENERATION AUDIT
  // =========================================================================
  describe('1. Deterministic Login ID Generation Specification', () => {
    it('should correctly sanitize name prefixes to exactly 2 uppercase letters', () => {
      expect(sanitizeNamePrefix('John')).toBe('JO');
      expect(sanitizeNamePrefix('Doe')).toBe('DO');
      expect(sanitizeNamePrefix('A')).toBe('AX');
      expect(sanitizeNamePrefix('')).toBe('XX');
      expect(sanitizeNamePrefix('123!@#')).toBe('XX');
    });

    it('should generate deterministic format: [Company][First2][Last2][Year][4-digit Serial]', async () => {
      (prisma.loginSequence.upsert as jest.Mock).mockResolvedValueOnce({
        companyCode: 'OI',
        year: 2022,
        currentSequence: 1,
      });

      const generatedId = await generateConcurrencySafeLoginId(
        prisma as any,
        'John',
        'Doe',
        2022,
        'OI'
      );

      expect(generatedId).toBe('OIJODO20220001');
    });

    it('should increment serial number sequentially per company and year', async () => {
      (prisma.loginSequence.upsert as jest.Mock)
        .mockResolvedValueOnce({ companyCode: 'OI', year: 2022, currentSequence: 1 })
        .mockResolvedValueOnce({ companyCode: 'OI', year: 2022, currentSequence: 2 })
        .mockResolvedValueOnce({ companyCode: 'OI', year: 2022, currentSequence: 145 });

      const id1 = await generateConcurrencySafeLoginId(prisma as any, 'John', 'Doe', 2022, 'OI');
      const id2 = await generateConcurrencySafeLoginId(prisma as any, 'Jane', 'Smith', 2022, 'OI');
      const id3 = await generateConcurrencySafeLoginId(prisma as any, 'Alice', 'Brown', 2022, 'OI');

      expect(id1).toBe('OIJODO20220001');
      expect(id2).toBe('OIJASM20220002');
      expect(id3).toBe('OIALBR20220145');
    });
  });

  // =========================================================================
  // 2. SECURITY & RBAC AUDIT (401 / 403 STRICT GUARDS)
  // =========================================================================
  describe('2. Security & RBAC Guard Audit', () => {
    it('should reject unauthenticated requests with 401 UNAUTHORIZED', async () => {
      const res = await request(app).get('/api/v1/payroll/components');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('UNAUTHORIZED');
    });

    it('should strictly FORBID regular employees from accessing salary structure endpoints (403)', async () => {
      const res = await request(app)
        .get('/api/v1/payroll/salary-structure/emp-emp-1')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should strictly FORBID regular employees from creating salary components (403)', async () => {
      const res = await request(app)
        .post('/api/v1/payroll/components')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ name: 'Hacked Component', type: 'EARNING' });

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should strictly FORBID regular employees from processing payroll (403)', async () => {
      const res = await request(app)
        .post('/api/v1/payroll/process')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ month: 8, year: 2026 });

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should allow ADMIN and HR to access salary structure endpoints', async () => {
      (prisma.salaryStructure.findUnique as jest.Mock).mockResolvedValue({
        id: 'struct-1',
        employeeId: 'emp-emp-1',
        baseSalary: 50000,
        items: [],
      });

      const res = await request(app)
        .get('/api/v1/payroll/salary-structure/emp-emp-1')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  // =========================================================================
  // 3. SYSTRAY ATTENDANCE & OVERTIME MATH AUDIT
  // =========================================================================
  describe('3. Systray Attendance & Overtime Math Calculation', () => {
    it('should compute exact working hours and zero overtime for <= 8.0 hours', () => {
      const checkIn = new Date('2026-08-22T09:00:00Z');
      const checkOut = new Date('2026-08-22T17:00:00Z'); // Exactly 8 hours

      const result = calculateWorkAndOvertimeHours(checkIn, checkOut, 8.0);
      expect(result.workHours).toBe(8.0);
      expect(result.overtimeHours).toBe(0);
      expect(result.status).toBe(AttendanceStatus.PRESENT);
    });

    it('should compute overtime when work duration exceeds 8.0 hours', () => {
      const checkIn = new Date('2026-08-22T09:00:00Z');
      const checkOut = new Date('2026-08-22T19:30:00Z'); // 10.5 hours

      const result = calculateWorkAndOvertimeHours(checkIn, checkOut, 8.0);
      expect(result.workHours).toBe(10.5);
      expect(result.overtimeHours).toBe(2.5);
      expect(result.status).toBe(AttendanceStatus.PRESENT);
    });

    it('should correctly classify half-day for shifts under 8 hours', () => {
      const checkIn = new Date('2026-08-22T09:00:00Z');
      const checkOut = new Date('2026-08-22T13:00:00Z'); // 4 hours

      const result = calculateWorkAndOvertimeHours(checkIn, checkOut, 8.0);
      expect(result.workHours).toBe(4.0);
      expect(result.overtimeHours).toBe(0);
      expect(result.status).toBe(AttendanceStatus.HALF_DAY);
    });

    it('should report systray indicator as "leave" (Airplane / Blue) when employee is on approved leave today', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: 'emp-emp-1' });
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.leaveRequest.findFirst as jest.Mock).mockResolvedValue({
        id: 'leave-1',
        status: 'APPROVED',
        leaveType: { name: 'Paid Annual Leave' },
      });

      const res = await request(app)
        .get('/api/v1/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.systrayState).toBe('leave');
      expect(res.body.data.badgeColor).toBe('BLUE');
      expect(res.body.data.icon).toBe('airplane');
    });

    it('should report systray indicator as "present" (Green) when employee is checked in without checkout', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: 'emp-emp-1' });
      (prisma.leaveRequest.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue({
        id: 'att-1',
        checkIn: new Date(),
        checkOut: null,
        status: AttendanceStatus.PRESENT,
      });

      const res = await request(app)
        .get('/api/v1/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.systrayState).toBe('present');
      expect(res.body.data.badgeColor).toBe('GREEN');
    });

    it('should report systray indicator as "absent" (Yellow) when employee has no check-in and no approved leave', async () => {
      (prisma.employee.findUnique as jest.Mock).mockResolvedValue({ id: 'emp-emp-1' });
      (prisma.leaveRequest.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.attendance.findUnique as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .get('/api/v1/attendance/today')
        .set('Authorization', `Bearer ${employeeToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.systrayState).toBe('absent');
      expect(res.body.data.badgeColor).toBe('YELLOW');
    });
  });

  // =========================================================================
  // 4. TRANSACTIONAL TIME-OFF & ATTENDANCE SYNC AUDIT
  // =========================================================================
  describe('4. Transactional Time-Off & Attendance Sync Engine', () => {
    it('should approve leave, deduct balance, and sync attendance with LEAVE status', async () => {
      const mockRequest = {
        id: 'leave-req-1',
        employeeId: 'emp-emp-1',
        leaveTypeId: 'type-paid',
        startDate: new Date('2026-08-25T00:00:00Z'),
        endDate: new Date('2026-08-26T00:00:00Z'),
        totalDays: 2,
        status: LeaveStatus.PENDING,
        leaveType: { id: 'type-paid', name: 'Paid Annual Leave', category: LeaveCategory.PAID },
      };

      const mockBalance = {
        id: 'bal-1',
        employeeId: 'emp-emp-1',
        leaveTypeId: 'type-paid',
        allocatedDays: 14,
        usedDays: 2,
        pendingDays: 2,
      };

      (prisma.leaveRequest.findUnique as jest.Mock).mockResolvedValue(mockRequest);
      (prisma.leaveBalance.findUnique as jest.Mock).mockResolvedValue(mockBalance);
      (prisma.leaveBalance.update as jest.Mock).mockResolvedValue({
        ...mockBalance,
        usedDays: 4,
        pendingDays: 0,
      });
      (prisma.leaveRequest.update as jest.Mock).mockResolvedValue({
        ...mockRequest,
        status: LeaveStatus.APPROVED,
        employee: { id: 'emp-emp-1', userId: 'user-emp-1' },
      });
      (prisma.attendance.upsert as jest.Mock).mockResolvedValue({});

      const res = await request(app)
        .patch('/api/v1/leave/requests/leave-req-1/approve')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ reviewerComment: 'Approved for annual vacation' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.leaveBalance.update).toHaveBeenCalled();
      expect(prisma.attendance.upsert).toHaveBeenCalled();
    });

    it('should reject leave request without altering attendance or deducting used balance', async () => {
      const mockRequest = {
        id: 'leave-req-2',
        employeeId: 'emp-emp-1',
        leaveTypeId: 'type-paid',
        startDate: new Date('2026-08-25T00:00:00Z'),
        endDate: new Date('2026-08-26T00:00:00Z'),
        totalDays: 2,
        status: LeaveStatus.PENDING,
        leaveType: { id: 'type-paid', name: 'Paid Annual Leave', category: LeaveCategory.PAID },
      };

      const mockBalance = {
        id: 'bal-1',
        employeeId: 'emp-emp-1',
        leaveTypeId: 'type-paid',
        allocatedDays: 14,
        usedDays: 2,
        pendingDays: 2,
      };

      (prisma.leaveRequest.findUnique as jest.Mock).mockResolvedValue(mockRequest);
      (prisma.leaveBalance.findUnique as jest.Mock).mockResolvedValue(mockBalance);
      (prisma.leaveBalance.update as jest.Mock).mockResolvedValue({
        ...mockBalance,
        pendingDays: 0, // only decrements pendingDays, usedDays unchanged
      });
      (prisma.leaveRequest.update as jest.Mock).mockResolvedValue({
        ...mockRequest,
        status: LeaveStatus.REJECTED,
        employee: { id: 'emp-emp-1', userId: 'user-emp-1' },
      });

      const res = await request(app)
        .patch('/api/v1/leave/requests/leave-req-2/reject')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({ rejectionReason: 'Operational staffing constraints' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(prisma.attendance.upsert).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // 5. DYNAMIC SALARY COMPUTATION MATH AUDIT
  // =========================================================================
  describe('5. Dynamic Salary & Wage Breakdown Computation Math', () => {
    it('should compute exact statutory Odoo Hackathon salary component breakdown', () => {
      const monthlyWage = 50000;
      const breakdown = computeDynamicWageBreakdown(monthlyWage);

      // 1. Basic Salary = 50% of Monthly Wage
      expect(breakdown.basicSalary).toBe(25000.0);

      // 2. HRA = 50% of Basic Salary
      expect(breakdown.hra).toBe(12500.0);

      // 3. Performance Bonus = 8.33% of Basic Salary
      expect(breakdown.performanceBonus).toBe(2082.5);

      // 4. LTA = 8.333% of Basic Salary
      expect(breakdown.leaveTravelAllowance).toBe(2083.25);

      // 5. Standard Allowance = Fixed 4167.00
      expect(breakdown.standardAllowance).toBe(4167.0);

      // 6. Fixed Allowance = monthlyWage - (Basic + HRA + Bonus + LTA + Standard)
      // 50000 - (25000 + 12500 + 2082.5 + 2083.25 + 4167.0) = 50000 - 45832.75 = 4167.25
      expect(breakdown.fixedAllowance).toBe(4167.25);

      // 7. PF Employee = 12% of Basic Salary
      expect(breakdown.pfEmployee).toBe(3000.0);

      // 8. PF Employer = 12% of Basic Salary
      expect(breakdown.pfEmployer).toBe(3000.0);

      // 9. Professional Tax = Fixed 200.00
      expect(breakdown.professionalTax).toBe(200.0);

      // 10. Yearly Wage = Monthly Wage * 12
      expect(breakdown.yearlyWage).toBe(600000.0);

      // 11. Total Deductions = PF Employee + PT = 3000 + 200 = 3200
      expect(breakdown.totalDeductions).toBe(3200.0);

      // 12. Net Salary
      expect(breakdown.netSalary).toBe(46800.0);
    });

    it('should handle edge cases with low monthly wage where fixed allowance drops below 0', () => {
      const lowWage = 10000;
      const breakdown = computeDynamicWageBreakdown(lowWage);

      expect(breakdown.basicSalary).toBe(5000.0);
      expect(breakdown.hra).toBe(2500.0);
      expect(breakdown.standardAllowance).toBe(4167.0);
      // Fixed allowance becomes negative
      expect(breakdown.fixedAllowance).toBeLessThan(0);
      expect(breakdown.yearlyWage).toBe(120000.0);
    });
  });
});
