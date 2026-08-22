import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { requestLogger } from './middleware/logger.middleware';
import { globalErrorHandler } from './middleware/error.middleware';
import { sendSuccess, sendError } from './utils/response.util';

// Import Module Routers
import authRoutes from './modules/auth/auth.routes';
import employeeRoutes from './modules/employees/employee.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import leaveRoutes from './modules/leave/leave.routes';
import payrollRoutes from './modules/payroll/payroll.routes';
import performanceRoutes from './modules/performance/performance.routes';
import recruitmentRoutes from './modules/recruitment/recruitment.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import helpdeskRoutes from './modules/helpdesk/helpdesk.routes';
import reportRoutes from './modules/reports/reports.routes';
import auditRoutes from './modules/audit/audit.routes';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
    ];

// Global Middleware
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Health Check Endpoint
app.get('/api/v1/health', (req: Request, res: Response) => {
  return sendSuccess(
    res,
    {
      status: 'UP',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'Dayflow HRMS Backend API Service is active and healthy'
  );
});

// API v1 Router Mounts
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/leave', leaveRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/recruitment', recruitmentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/helpdesk', helpdeskRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/audit', auditRoutes);

// 404 Route Handler
app.use((req: Request, res: Response) => {
  return sendError(res, `Endpoint ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND', req.originalUrl);
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
