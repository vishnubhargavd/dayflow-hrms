import request from 'supertest';
import app from '../src/app';
import { calculateSalaryStructure } from '../src/modules/payroll/payroll.service';
import { SalaryComponentType, Role } from '@prisma/client';
import { signToken } from '../src/utils/jwt.util';

describe('Payroll Calculation Unit Tests', () => {
  it('should calculate gross salary and net salary with earnings and deductions', () => {
    const result = calculateSalaryStructure(60000, [
      { amount: 15000, component: { id: 'c1', name: 'HRA', type: SalaryComponentType.EARNING } },
      { amount: 5000, component: { id: 'c2', name: 'Transport Allowance', type: SalaryComponentType.EARNING } },
      { amount: 8000, component: { id: 'c3', name: 'Tax Deduction', type: SalaryComponentType.DEDUCTION } },
      { amount: 2000, component: { id: 'c4', name: 'Other Deduction', type: SalaryComponentType.DEDUCTION } },
    ]);

    expect(result.baseSalary).toBe(60000);
    expect(result.totalEarnings).toBe(20000);
    expect(result.totalDeductions).toBe(10000);
    expect(result.grossSalary).toBe(80000);
    expect(result.netSalary).toBe(70000);
  });

  it('should handle zero deductions correctly', () => {
    const result = calculateSalaryStructure(50000, [
      { amount: 10000, component: { id: 'c1', name: 'HRA', type: SalaryComponentType.EARNING } },
    ]);

    expect(result.totalEarnings).toBe(10000);
    expect(result.totalDeductions).toBe(0);
    expect(result.grossSalary).toBe(60000);
    expect(result.netSalary).toBe(60000);
  });

  it('should cap net salary at 0 if deductions exceed gross salary', () => {
    const result = calculateSalaryStructure(10000, [
      { amount: 15000, component: { id: 'c1', name: 'Extreme Tax', type: SalaryComponentType.DEDUCTION } },
    ]);

    expect(result.grossSalary).toBe(10000);
    expect(result.totalDeductions).toBe(15000);
    expect(result.netSalary).toBe(0);
  });
});

describe('Payroll API Integration & RBAC Tests', () => {
  const adminToken = signToken({
    userId: 'admin-user-id-100',
    loginId: 'ADM001',
    email: 'admin@dayflow.com',
    role: Role.ADMIN,
    employeeId: 'admin-emp-id-100',
    requiresPasswordChange: false,
  });

  const hrToken = signToken({
    userId: 'hr-user-id-200',
    loginId: 'HR001',
    email: 'hr@dayflow.com',
    role: Role.HR,
    employeeId: 'hr-emp-id-200',
    requiresPasswordChange: false,
  });

  const employeeToken = signToken({
    userId: 'emp-user-id-300',
    loginId: 'EMP1024',
    email: 'employee@dayflow.com',
    role: Role.EMPLOYEE,
    employeeId: 'emp-id-1024',
    requiresPasswordChange: false,
  });

  describe('Unauthenticated & Authorization Protection', () => {
    it('should reject unauthenticated requests to payroll endpoints with 401', async () => {
      const res = await request(app).get('/api/v1/payroll/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('UNAUTHORIZED');
    });

    it('should reject regular EMPLOYEE from creating salary components with 403', async () => {
      const res = await request(app)
        .post('/api/v1/payroll/components')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          name: 'Unauthorized Component',
          type: 'EARNING',
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should reject regular EMPLOYEE from assigning salary structure with 403', async () => {
      const res = await request(app)
        .post('/api/v1/payroll/salary-structure')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          employeeId: '00000000-0000-0000-0000-000000000001',
          baseSalary: 50000,
        });

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });
  });

  describe('Zod Validation Tests', () => {
    it('should reject negative base salary in salary structure assignment', async () => {
      const res = await request(app)
        .post('/api/v1/payroll/salary-structure')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          employeeId: '00000000-0000-0000-0000-000000000001',
          baseSalary: -5000,
        });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid component type', async () => {
      const res = await request(app)
        .post('/api/v1/payroll/components')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({
          name: 'Invalid Type Component',
          type: 'INVALID_TYPE',
        });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject invalid payroll period month (>12)', async () => {
      const res = await request(app)
        .post('/api/v1/payroll/process')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          employeeId: '00000000-0000-0000-0000-000000000001',
          month: 13,
          year: 2026,
        });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });
});
