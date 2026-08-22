import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { sendSuccess } from '../../utils/response.util';
import {
  generatePersonalSmartInsights,
  generateOrganizationSmartInsights,
} from '../attendance/attendance.insights.service';
import { getPersonalAttendanceAnalyticsService, getOrganizationOverviewAnalyticsService } from '../attendance/attendance.analytics.service';
import { Role } from '@prisma/client';

const router = Router();

// Authenticate all AI/Smart insights requests
router.use(authenticate);

/**
 * POST /api/v1/ai/query
 * Role-aware smart contextual assistant querying:
 * - EMPLOYEE: retrieves scoped personal attendance insights and analytics
 * - ADMIN / HR: retrieves organization-wide health, department benchmarks, and low attendance watchlist
 */
router.post('/query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const userQuery = (req.body.query || '').toLowerCase().trim();

    if (user.role === Role.EMPLOYEE) {
      const [insights, analytics] = await Promise.all([
        generatePersonalSmartInsights(user),
        getPersonalAttendanceAnalyticsService(user, {}),
      ]);

      return sendSuccess(
        res,
        {
          role: user.role,
          query: req.body.query || 'Summary of my attendance & smart insights',
          insights,
          analytics: analytics.metrics,
          summary: `You currently have an attendance rate of ${analytics.metrics.attendanceRate}% with ${analytics.metrics.presentDays} present days and ${analytics.metrics.totalOvertimeHours} hours of overtime.`,
        },
        'Smart personal insights retrieved successfully'
      );
    }

    // ADMIN or HR
    const [orgInsights, orgOverview] = await Promise.all([
      generateOrganizationSmartInsights(),
      getOrganizationOverviewAnalyticsService({}),
    ]);

    return sendSuccess(
      res,
      {
        role: user.role,
        query: req.body.query || 'Organization attendance health & insights',
        insights: orgInsights,
        overview: orgOverview.metrics,
        summary: `Organization attendance rate is currently at ${orgOverview.metrics.attendanceRate}% across ${orgOverview.metrics.totalEmployees} employees.`,
      },
      'Smart organization insights retrieved successfully'
    );
  } catch (error) {
    return next(error);
  }
});

export default router;
