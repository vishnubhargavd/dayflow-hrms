import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { JwtPayload } from '../../utils/jwt.util';
import { AttendanceStatus, Role } from '@prisma/client';
import { normalizeDate } from './attendance.service';

export interface AttendanceMetrics {
  totalRecords: number;
  presentDays: number;
  halfDays: number;
  leaveDays: number;
  absentDays: number;
  totalWorkingHours: number;
  totalOvertimeHours: number;
  attendanceRate: number;
  absenteeismRate: number;
  averageWorkingHours: number;
}

/**
 * Standard Attendance Metric Calculator
 * - attendanceRate = ((presentDays + 0.5 * halfDays) / totalRecords) * 100
 * - absenteeismRate = (absentDays / totalRecords) * 100
 * - averageWorkingHours = totalWorkingHours / (presentDays + halfDays)
 */
export function calculateAttendanceMetrics(records: Array<{ status: AttendanceStatus; workHours?: number | null; overtimeHours?: number | null }>): AttendanceMetrics {
  const totalRecords = records.length;
  if (totalRecords === 0) {
    return {
      totalRecords: 0,
      presentDays: 0,
      halfDays: 0,
      leaveDays: 0,
      absentDays: 0,
      totalWorkingHours: 0,
      totalOvertimeHours: 0,
      attendanceRate: 0,
      absenteeismRate: 0,
      averageWorkingHours: 0,
    };
  }

  const presentDays = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
  const halfDays = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;
  const leaveDays = records.filter((r) => r.status === AttendanceStatus.LEAVE || r.status === AttendanceStatus.ON_LEAVE).length;
  const absentDays = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;

  const totalWorkingHours = Math.round(records.reduce((sum, r) => sum + (r.workHours || 0), 0) * 100) / 100;
  const totalOvertimeHours = Math.round(records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0) * 100) / 100;

  const effectivePresentDays = presentDays + halfDays * 0.5;
  const attendanceRate = Math.round((effectivePresentDays / totalRecords) * 10000) / 100;
  const absenteeismRate = Math.round((absentDays / totalRecords) * 10000) / 100;

  const activeDays = presentDays + halfDays;
  const averageWorkingHours = activeDays > 0 ? Math.round((totalWorkingHours / activeDays) * 100) / 100 : 0;

  return {
    totalRecords,
    presentDays,
    halfDays,
    leaveDays,
    absentDays,
    totalWorkingHours,
    totalOvertimeHours,
    attendanceRate,
    absenteeismRate,
    averageWorkingHours,
  };
}

/**
 * Standard date range parser defaulting to past 30 days if not provided
 */
export function parseDateRange(from?: string, to?: string) {
  const now = new Date();
  const endDate = to ? normalizeDate(to) : normalizeDate(now);

  let startDate: Date;
  if (from) {
    startDate = normalizeDate(from);
  } else {
    // Default 30 days prior
    const d = new Date(endDate);
    d.setUTCDate(d.getUTCDate() - 29);
    startDate = normalizeDate(d);
  }

  return {
    startDate,
    endDate,
    fromString: startDate.toISOString().split('T')[0],
    toString: endDate.toISOString().split('T')[0],
  };
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
 * 1. Personal Employee Attendance Analytics
 * - Strictly scoped to authenticated employee
 */
export async function getPersonalAttendanceAnalyticsService(userContext: JwtPayload, query: { from?: string; to?: string }) {
  const employeeId = await resolveEmployeeId(userContext);
  const { startDate, endDate, fromString, toString } = parseDateRange(query.from, query.to);

  const records = await prisma.attendance.findMany({
    where: {
      employeeId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      status: true,
      workHours: true,
      overtimeHours: true,
    },
  });

  const metrics = calculateAttendanceMetrics(records);

  return {
    employeeId,
    dateRange: {
      from: fromString,
      to: toString,
    },
    metrics,
  };
}

/**
 * 2. Organization-level Attendance Overview (ADMIN / HR)
 */
export async function getOrganizationOverviewAnalyticsService(query: { from?: string; to?: string }) {
  const { startDate, endDate, fromString, toString } = parseDateRange(query.from, query.to);

  const [totalEmployees, records] = await Promise.all([
    prisma.employee.count(),
    prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        status: true,
        workHours: true,
        overtimeHours: true,
      },
    }),
  ]);

  const metrics = calculateAttendanceMetrics(records);

  return {
    dateRange: {
      from: fromString,
      to: toString,
    },
    metrics: {
      totalEmployees,
      ...metrics,
    },
  };
}

/**
 * 3. Department-Level Attendance Analytics (ADMIN / HR)
 */
export async function getDepartmentAnalyticsService(query: { from?: string; to?: string }) {
  const { startDate, endDate, fromString, toString } = parseDateRange(query.from, query.to);

  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      employees: {
        select: {
          id: true,
          attendanceRecords: {
            where: {
              date: {
                gte: startDate,
                lte: endDate,
              },
            },
            select: {
              status: true,
              workHours: true,
              overtimeHours: true,
            },
          },
        },
      },
    },
  });

  return departments.map((dept) => {
    const employeeCount = dept.employees.length;
    const allDeptRecords = dept.employees.flatMap((e) => e.attendanceRecords);
    const metrics = calculateAttendanceMetrics(allDeptRecords);

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      departmentCode: dept.code,
      employeeCount,
      dateRange: {
        from: fromString,
        to: toString,
      },
      present: metrics.presentDays,
      absent: metrics.absentDays,
      leave: metrics.leaveDays,
      halfDay: metrics.halfDays,
      attendanceRate: metrics.attendanceRate,
      absenteeismRate: metrics.absenteeismRate,
      totalWorkingHours: metrics.totalWorkingHours,
      averageWorkingHours: metrics.averageWorkingHours,
    };
  });
}

/**
 * 4. Daily Attendance Trend over Date Range (ADMIN / HR)
 */
export async function getAttendanceTrendService(query: { from?: string; to?: string }) {
  const { startDate, endDate, fromString, toString } = parseDateRange(query.from, query.to);

  const records = await prisma.attendance.findMany({
    where: {
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
    select: {
      date: true,
      status: true,
      workHours: true,
      overtimeHours: true,
    },
  });

  // Group by date string (YYYY-MM-DD)
  const groupedByDate: { [dateStr: string]: Array<{ status: AttendanceStatus; workHours?: number | null; overtimeHours?: number | null }> } = {};

  // Initialize all dates in range to guarantee continuous trendline
  const curr = new Date(startDate);
  while (curr.getTime() <= endDate.getTime()) {
    const dStr = curr.toISOString().split('T')[0];
    groupedByDate[dStr] = [];
    curr.setUTCDate(curr.getUTCDate() + 1);
  }

  for (const r of records) {
    const dStr = new Date(r.date).toISOString().split('T')[0];
    if (!groupedByDate[dStr]) {
      groupedByDate[dStr] = [];
    }
    groupedByDate[dStr].push(r);
  }

  const trend = Object.entries(groupedByDate).map(([dateStr, dayRecords]) => {
    const metrics = calculateAttendanceMetrics(dayRecords);
    return {
      date: dateStr,
      present: metrics.presentDays,
      absent: metrics.absentDays,
      leave: metrics.leaveDays,
      halfDay: metrics.halfDays,
      totalRecorded: metrics.totalRecords,
      attendanceRate: metrics.attendanceRate,
      averageWorkingHours: metrics.averageWorkingHours,
      totalWorkingHours: metrics.totalWorkingHours,
    };
  });

  return trend;
}

/**
 * 5. Low Attendance Identification (ADMIN / HR)
 */
export async function getLowAttendanceEmployeesService(query: { from?: string; to?: string; threshold?: string | number }) {
  const { startDate, endDate, fromString, toString } = parseDateRange(query.from, query.to);
  const threshold = query.threshold !== undefined ? Number(query.threshold) : 80.0;

  const employees = await prisma.employee.findMany({
    select: {
      id: true,
      loginId: true,
      firstName: true,
      lastName: true,
      department: {
        select: {
          name: true,
        },
      },
      attendanceRecords: {
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          status: true,
          workHours: true,
          overtimeHours: true,
        },
      },
    },
  });

  const lowAttendanceList: any[] = [];

  for (const emp of employees) {
    const metrics = calculateAttendanceMetrics(emp.attendanceRecords);
    // Only flag if there are records and attendanceRate is below threshold
    if (emp.attendanceRecords.length > 0 && metrics.attendanceRate < threshold) {
      lowAttendanceList.push({
        employeeId: emp.id,
        loginId: emp.loginId,
        employeeName: `${emp.firstName} ${emp.lastName}`.trim(),
        department: emp.department?.name || 'Unassigned',
        totalRecordedDays: metrics.totalRecords,
        presentDays: metrics.presentDays,
        absentDays: metrics.absentDays,
        halfDays: metrics.halfDays,
        leaveDays: metrics.leaveDays,
        attendanceRate: metrics.attendanceRate,
        averageWorkingHours: metrics.averageWorkingHours,
      });
    }
  }

  // Sort lowest attendance first
  lowAttendanceList.sort((a, b) => a.attendanceRate - b.attendanceRate);

  return {
    threshold,
    dateRange: {
      from: fromString,
      to: toString,
    },
    count: lowAttendanceList.length,
    employees: lowAttendanceList,
  };
}
