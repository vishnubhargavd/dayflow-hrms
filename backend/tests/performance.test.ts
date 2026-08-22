import request from 'supertest';
import app from '../src/app';
import { Role } from '@prisma/client';
import { signToken } from '../src/utils/jwt.util';

describe('Performance Management API & Validation Tests', () => {
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

  describe('Unauthenticated & RBAC Security Tests', () => {
    it('should reject unauthenticated access to performance endpoints with 401', async () => {
      const res = await request(app).get('/api/v1/performance/me/goals');
      expect(res.status).toBe(401);
      expect(res.body.errorCode).toBe('UNAUTHORIZED');
    });

    it('should reject regular EMPLOYEE from creating a goal with 403', async () => {
      const res = await request(app)
        .post('/api/v1/performance/goals')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          employeeId: '00000000-0000-0000-0000-000000000001',
          title: 'Unauthorized Goal Assignment',
        });

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });

    it('should reject regular EMPLOYEE from evaluating a performance review with 403', async () => {
      const res = await request(app)
        .patch('/api/v1/performance/reviews/00000000-0000-0000-0000-000000000001/evaluation')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({
          overallRating: 4.5,
          reviewerFeedback: 'Unauthorized Evaluation',
        });

      expect(res.status).toBe(403);
      expect(res.body.errorCode).toBe('FORBIDDEN');
    });
  });

  describe('Zod Validation & Progress Bounds Tests', () => {
    it('should reject progress less than 0%', async () => {
      const res = await request(app)
        .patch('/api/v1/performance/me/goals/00000000-0000-0000-0000-000000000001/progress')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ progress: -10 });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject progress greater than 100%', async () => {
      const res = await request(app)
        .patch('/api/v1/performance/me/goals/00000000-0000-0000-0000-000000000001/progress')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ progress: 120 });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject overall rating below 1.0', async () => {
      const res = await request(app)
        .patch('/api/v1/performance/reviews/00000000-0000-0000-0000-000000000001/evaluation')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          overallRating: 0.5,
          reviewerFeedback: 'Rating too low',
        });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject overall rating above 5.0', async () => {
      const res = await request(app)
        .patch('/api/v1/performance/reviews/00000000-0000-0000-0000-000000000001/evaluation')
        .set('Authorization', `Bearer ${hrToken}`)
        .send({
          overallRating: 5.5,
          reviewerFeedback: 'Rating too high',
        });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should reject self-assessment submission without required content', async () => {
      const res = await request(app)
        .patch('/api/v1/performance/me/reviews/00000000-0000-0000-0000-000000000001/self-assessment')
        .set('Authorization', `Bearer ${employeeToken}`)
        .send({ selfAssessment: '' });

      expect(res.status).toBe(400);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });
  });
});
