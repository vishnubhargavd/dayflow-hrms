import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { JwtPayload } from '../../utils/jwt.util';
import { AttendanceStatus } from '@prisma/client';
import { calculateAttendanceMetrics } from './attendance.analytics.service';
import { normalizeDate } from './attendance.service';

export type InsightType = 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
export type InsightCategory = 'ATTENDANCE' | 'OVERTIME' | 'DEPARTMENT' | 'BENCHMARK';

export interface SmartInsight {
  id: string;
  type: InsightType;
  category: InsightCategory;
  title: string;
  message: string;
  metric?: {
    current?: number;
    previous?: number;
    diff?: number;
    unit?: string;
  };
  actionable: boolean;
  recommendation?: string;
  createdAt: string;
}

/**
 * Helper to resolve employee ID from user token
 */
async function resolveEmployeeId(userContext: JwtPayload): Promise<string> {
  if (userContext.employeeId) {
    return userContext.employeeId;
  }

  const employee = await prisma.employee.findUnique({
    where: { userId: userContext.userId },
    select: { id: true },
  });

  if (!employee) {
    throw new AppError('Employee profile not found for this user account.', 404, 'EMPLOYEE_NOT_FOUND');
  }

  return employee.id;
}

/**
 * Helper to get date boundaries for a given month/year and its previous month
 */
function getPeriodBoundaries(targetMonth?: number, targetYear?: number) {
  const now = new Date();
  const year = targetYear || now.getUTCFullYear();
  const month = targetMonth || now.getUTCMonth() + 1; // 1-12

  // Current Month Start & End
  const currentStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  const currentEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

  // Previous Month Start & End
  const prevMonth = month === 1 ? 12 : month - 1;
  const prevYear = month === 1 ? year - 1 : year;
  const prevStart = new Date(Date.UTC(prevYear, prevMonth - 1, 1, 0, 0, 0, 0));
  const prevEnd = new Date(Date.UTC(prevYear, prevMonth, 0, 23, 59, 59, 999));

  return {
    current: { start: normalizeDate(currentStart), end: normalizeDate(currentEnd), month, year },
    previous: { start: normalizeDate(prevStart), end: normalizeDate(prevEnd), month: prevMonth, year: prevYear },
  };
}

/**
 * 1. Personal Smart Insights Generator for Individual Employees
 */
export async function generatePersonalSmartInsights(
  userContext: JwtPayload,
  options?: { month?: number; year?: number }
): Promise<SmartInsight[]> {
  const employeeId = await resolveEmployeeId(userContext);
  const { current, previous } = getPeriodBoundaries(options?.month, options?.year);
  const nowIso = new Date().toISOString();

  // 1. Fetch current and previous attendance records
  const [currentRecords, prevRecords, employeeProfile] = await Promise.all([
    prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: current.start, lte: current.end },
      },
      select: { date: true, status: true, workHours: true, overtimeHours: true, checkIn: true, checkOut: true },
    }),
    prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: previous.start, lte: previous.end },
      },
      select: { status: true, workHours: true, overtimeHours: true },
    }),
    prisma.employee.findUnique({
      where: { id: employeeId },
      select: {
        id: true,
        departmentId: true,
        department: { select: { id: true, name: true } },
      },
    }),
  ]);

  const currentMetrics = calculateAttendanceMetrics(currentRecords);
  const prevMetrics = calculateAttendanceMetrics(prevRecords);
  const insights: SmartInsight[] = [];

  // RULE 1: Low Attendance Warning (< 80%)
  if (currentMetrics.totalRecords >= 3 && currentMetrics.attendanceRate < 80) {
    insights.push({
      id: 'LOW_ATTENDANCE',
      type: 'WARNING',
      category: 'ATTENDANCE',
      title: 'Attendance Alert',
      message: `Your attendance is ${currentMetrics.attendanceRate}% this month, which is below the 80% target.`,
      metric: { current: currentMetrics.attendanceRate, unit: '%' },
      actionable: true,
      recommendation: 'Regularize any missed punch-ins or request approval for recorded absences with your HR manager.',
      createdAt: nowIso,
    });
  }

  // RULE 2: Perfect Attendance Milestone (100% with >= 5 recorded days)
  if (currentMetrics.totalRecords >= 5 && currentMetrics.attendanceRate === 100) {
    insights.push({
      id: 'PERFECT_ATTENDANCE',
      type: 'SUCCESS',
      category: 'ATTENDANCE',
      title: 'Flawless Attendance Streak',
      message: 'You have maintained 100% perfect attendance this month. Excellent consistency!',
      metric: { current: 100, unit: '%' },
      actionable: false,
      recommendation: 'Keep up the exemplary record for monthly attendance recognition.',
      createdAt: nowIso,
    });
  }

  // RULE 3 & 4: Period-over-Period Attendance Comparison
  if (currentMetrics.totalRecords >= 3 && prevMetrics.totalRecords >= 3) {
    const diff = Math.round((currentMetrics.attendanceRate - prevMetrics.attendanceRate) * 100) / 100;
    if (diff > 0) {
      insights.push({
        id: 'IMPROVED_ATTENDANCE',
        type: 'SUCCESS',
        category: 'BENCHMARK',
        title: 'Attendance Improvement',
        message: `Your attendance improved by ${diff}% compared with the previous period.`,
        metric: { current: currentMetrics.attendanceRate, previous: prevMetrics.attendanceRate, diff, unit: '%' },
        actionable: false,
        recommendation: 'Great progress! Continue maintaining this positive attendance trend.',
        createdAt: nowIso,
      });
    } else if (diff < -2) {
      insights.push({
        id: 'DECLINING_ATTENDANCE',
        type: 'WARNING',
        category: 'BENCHMARK',
        title: 'Attendance Dip',
        message: `Your attendance decreased by ${Math.abs(diff)}% compared with the previous period.`,
        metric: { current: currentMetrics.attendanceRate, previous: prevMetrics.attendanceRate, diff, unit: '%' },
        actionable: true,
        recommendation: 'Review your upcoming schedule and plan time off in advance via Leave Requests.',
        createdAt: nowIso,
      });
    }
  }

  // RULE 5: High Overtime Alert (>= 10 hours)
  if (currentMetrics.totalOvertimeHours >= 10) {
    insights.push({
      id: 'HIGH_OVERTIME',
      type: 'WARNING',
      category: 'OVERTIME',
      title: 'Elevated Overtime Logged',
      message: `You recorded ${currentMetrics.totalOvertimeHours} hours of overtime this month. Ensure you maintain healthy work-life balance.`,
      metric: { current: currentMetrics.totalOvertimeHours, unit: 'hours' },
      actionable: true,
      recommendation: 'Ensure your overtime hours are approved for accurate payroll processing.',
      createdAt: nowIso,
    });
  }

  // RULE 6: Department Comparison Benchmark
  if (employeeProfile?.departmentId && currentMetrics.totalRecords >= 3) {
    const deptEmployees = await prisma.employee.findMany({
      where: { departmentId: employeeProfile.departmentId },
      select: {
        attendanceRecords: {
          where: { date: { gte: current.start, lte: current.end } },
          select: { status: true, workHours: true, overtimeHours: true },
        },
      },
    });

    const allDeptRecords = (deptEmployees || []).flatMap((e) => e.attendanceRecords || []);
    if (allDeptRecords && allDeptRecords.length >= 5) {
      const deptMetrics = calculateAttendanceMetrics(allDeptRecords);
      const diffDept = Math.round((currentMetrics.attendanceRate - deptMetrics.attendanceRate) * 100) / 100;

      if (diffDept > 3) {
        insights.push({
          id: 'ABOVE_DEPT_AVERAGE',
          type: 'SUCCESS',
          category: 'DEPARTMENT',
          title: 'Top Department Performer',
          message: `Your attendance is ${diffDept}% above the ${employeeProfile.department?.name || 'department'} average (${deptMetrics.attendanceRate}%).`,
          metric: { current: currentMetrics.attendanceRate, previous: deptMetrics.attendanceRate, diff: diffDept, unit: '%' },
          actionable: false,
          createdAt: nowIso,
        });
      }
    }
  }

  // Default insight if no other insights generated
  if (insights.length === 0) {
    insights.push({
      id: 'STEADY_ATTENDANCE',
      type: 'INFO',
      category: 'ATTENDANCE',
      title: 'Attendance on Track',
      message: `Your attendance is steady at ${currentMetrics.attendanceRate || 100}% this period.`,
      metric: { current: currentMetrics.attendanceRate || 100, unit: '%' },
      actionable: false,
      createdAt: nowIso,
    });
  }

  return insights;
}

/**
 * 2. Organization & HR Smart Insights Generator (ADMIN / HR)
 */
export async function generateOrganizationSmartInsights(
  options?: { month?: number; year?: number }
): Promise<SmartInsight[]> {
  const { current, previous } = getPeriodBoundaries(options?.month, options?.year);
  const nowIso = new Date().toISOString();

  // 1. Fetch all employees with attendance records
  const [employees, departments] = await Promise.all([
    prisma.employee.findMany({
      select: {
        id: true,
        loginId: true,
        firstName: true,
        lastName: true,
        departmentId: true,
        attendanceRecords: {
          where: { date: { gte: current.start, lte: current.end } },
          select: { status: true, workHours: true, overtimeHours: true },
        },
      },
    }),
    prisma.department.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        employees: {
          select: {
            attendanceRecords: {
              where: { date: { gte: current.start, lte: current.end } },
              select: { status: true, workHours: true, overtimeHours: true },
            },
          },
        },
      },
    }),
  ]);

  const insights: SmartInsight[] = [];

  // RULE 1: Organization Low Attendance Workforce Count
  let lowAttendanceCount = 0;
  for (const emp of employees) {
    if (emp.attendanceRecords.length >= 3) {
      const empMetrics = calculateAttendanceMetrics(emp.attendanceRecords);
      if (empMetrics.attendanceRate < 80) {
        lowAttendanceCount++;
      }
    }
  }

  if (lowAttendanceCount > 0) {
    insights.push({
      id: 'ORG_LOW_ATTENDANCE_COUNT',
      type: 'WARNING',
      category: 'ATTENDANCE',
      title: 'Workforce Attendance Watchlist',
      message: `${lowAttendanceCount} ${lowAttendanceCount === 1 ? 'employee currently has' : 'employees currently have'} attendance below 80% this month.`,
      metric: { current: lowAttendanceCount, unit: 'employees' },
      actionable: true,
      recommendation: 'Review low attendance list via /api/v1/attendance/analytics/low-attendance for HR follow-up.',
      createdAt: nowIso,
    });
  }

  // RULE 2: Department Performance Rankings
  if (departments.length > 0) {
    const deptStats = departments
      .map((d) => {
        const records = d.employees.flatMap((e) => e.attendanceRecords);
        const metrics = calculateAttendanceMetrics(records);
        return {
          name: d.name,
          employeeCount: d.employees.length,
          totalRecords: metrics.totalRecords,
          attendanceRate: metrics.attendanceRate,
          totalOvertime: metrics.totalOvertimeHours,
        };
      })
      .filter((d) => d.totalRecords >= 3);

    if (deptStats.length > 0) {
      deptStats.sort((a, b) => b.attendanceRate - a.attendanceRate);
      const topDept = deptStats[0];
      const lowestDept = deptStats[deptStats.length - 1];

      // Top Department Insight
      if (topDept && topDept.attendanceRate >= 85) {
        insights.push({
          id: 'ORG_TOP_DEPT',
          type: 'SUCCESS',
          category: 'DEPARTMENT',
          title: 'Leading Department Attendance',
          message: `${topDept.name} department achieved the highest attendance rate (${topDept.attendanceRate}%) this month.`,
          metric: { current: topDept.attendanceRate, unit: '%' },
          actionable: false,
          createdAt: nowIso,
        });
      }

      // Lowest Department Insight
      if (lowestDept && lowestDept.attendanceRate < 80 && lowestDept.name !== topDept.name) {
        insights.push({
          id: 'ORG_LOW_DEPT_ALERT',
          type: 'WARNING',
          category: 'DEPARTMENT',
          title: 'Department Attendance Concern',
          message: `${lowestDept.name} department has the lowest attendance rate (${lowestDept.attendanceRate}%) this month.`,
          metric: { current: lowestDept.attendanceRate, unit: '%' },
          actionable: true,
          recommendation: `Engage with ${lowestDept.name} department leads to investigate operational bottlenecks or scheduled time-off patterns.`,
          createdAt: nowIso,
        });
      }

      // Department Overtime Anomaly Check
      const highOvertimeDept = [...deptStats].sort((a, b) => b.totalOvertime - a.totalOvertime)[0];
      if (highOvertimeDept && highOvertimeDept.totalOvertime >= 20) {
        insights.push({
          id: 'ORG_HIGH_DEPT_OVERTIME',
          type: 'INFO',
          category: 'OVERTIME',
          title: 'Department Overtime Surge',
          message: `${highOvertimeDept.name} department logged the highest overtime (${highOvertimeDept.totalOvertime} hours) this period.`,
          metric: { current: highOvertimeDept.totalOvertime, unit: 'hours' },
          actionable: true,
          recommendation: `Verify staffing capacity in ${highOvertimeDept.name} to avoid employee burnout.`,
          createdAt: nowIso,
        });
      }
    }
  }

  // Default organization insight if no alerts
  if (insights.length === 0) {
    insights.push({
      id: 'ORG_HEALTHY_STATUS',
      type: 'INFO',
      category: 'ATTENDANCE',
      title: 'Healthy Workforce Operations',
      message: 'Overall organization attendance is healthy with no critical anomalies detected.',
      actionable: false,
      createdAt: nowIso,
    });
  }

  return insights;
}
