import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { JwtPayload } from '../../utils/jwt.util';
import { parsePaginationParams, buildPaginationMeta } from '../../utils/pagination.util';
import { AttendanceStatus, Role, Prisma } from '@prisma/client';

export interface WorkCalculationResult {
  workHours: number;
  overtimeHours: number;
  status: AttendanceStatus;
}

/**
 * Standard Work Hours Policy:
 * - Standard Full Day Shift: 8.0 hours
 * - Minimum Full Day: >= 8.0 hours -> PRESENT
 * - Half Day: >= 4.0 hours and < 8.0 hours -> HALF_DAY
 * - Under 4.0 hours: HALF_DAY (partial shift)
 * - Overtime: any duration exceeding 8.0 hours
 */
export function calculateWorkAndOvertimeHours(
  checkIn: Date,
  checkOut: Date,
  standardWorkHours: number = 8.0
): WorkCalculationResult {
  const durationMs = checkOut.getTime() - checkIn.getTime();
  if (durationMs <= 0) {
    return {
      workHours: 0,
      overtimeHours: 0,
      status: AttendanceStatus.HALF_DAY,
    };
  }

  const rawHours = durationMs / (1000 * 60 * 60);
  const workHours = Math.round(rawHours * 100) / 100;

  const overtimeHours = workHours > standardWorkHours ? Math.round((workHours - standardWorkHours) * 100) / 100 : 0;

  let status: AttendanceStatus = AttendanceStatus.PRESENT;
  if (workHours < 8.0 && workHours >= 4.0) {
    status = AttendanceStatus.HALF_DAY;
  } else if (workHours < 4.0) {
    status = AttendanceStatus.HALF_DAY;
  }

  return {
    workHours,
    overtimeHours,
    status,
  };
}

/**
 * Helper to normalize a date object to UTC midnight (00:00:00.000Z) for PostgreSQL @db.Date mapping.
 */
export function normalizeDate(dateInput?: Date | string): Date {
  const d = dateInput ? new Date(dateInput) : new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0));
}

/**
 * Resolve employee ID for the authenticated user context.
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
 * Employee Check-in:
 * - Server-enforced identity from authenticated user context
 * - Uses server timestamp
 * - Prevents duplicate check-in on the same date
 */
export async function checkInService(userContext: JwtPayload) {
  const employeeId = await resolveEmployeeId(userContext);
  const now = new Date();
  const todayDate = normalizeDate(now);

  // Check if attendance record already exists for today
  const existingRecord = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: todayDate,
      },
    },
  });

  if (existingRecord && existingRecord.checkIn) {
    throw new AppError('You have already checked in for today.', 400, 'ALREADY_CHECKED_IN');
  }

  const attendance = await prisma.attendance.upsert({
    where: {
      employeeId_date: {
        employeeId,
        date: todayDate,
      },
    },
    create: {
      employeeId,
      date: todayDate,
      checkIn: now,
      status: AttendanceStatus.PRESENT,
    },
    update: {
      checkIn: now,
      status: AttendanceStatus.PRESENT,
    },
    select: {
      id: true,
      employeeId: true,
      date: true,
      checkIn: true,
      checkOut: true,
      status: true,
      workHours: true,
      overtimeHours: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return attendance;
}

/**
 * Employee Check-out:
 * - Server-enforced identity from authenticated user context
 * - Requires prior check-in for the current date
 * - Prevents duplicate check-out
 * - Computes working hours, overtime hours, and attendance status
 */
export async function checkOutService(userContext: JwtPayload) {
  const employeeId = await resolveEmployeeId(userContext);
  const now = new Date();
  const todayDate = normalizeDate(now);

  const existingRecord = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: todayDate,
      },
    },
  });

  if (!existingRecord || !existingRecord.checkIn) {
    throw new AppError('No check-in record found for today. You must check in before checking out.', 400, 'CHECKIN_REQUIRED');
  }

  if (existingRecord.checkOut) {
    throw new AppError('You have already checked out for today.', 400, 'ALREADY_CHECKED_OUT');
  }

  const { workHours, overtimeHours, status } = calculateWorkAndOvertimeHours(existingRecord.checkIn, now);

  const updatedRecord = await prisma.attendance.update({
    where: { id: existingRecord.id },
    data: {
      checkOut: now,
      workHours,
      overtimeHours,
      status,
    },
    select: {
      id: true,
      employeeId: true,
      date: true,
      checkIn: true,
      checkOut: true,
      status: true,
      workHours: true,
      overtimeHours: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedRecord;
}

/**
 * Get Today's Attendance Record for the authenticated employee.
 */
export async function getTodayAttendanceService(userContext: JwtPayload) {
  const employeeId = await resolveEmployeeId(userContext);
  const todayDate = normalizeDate(new Date());

  const record = await prisma.attendance.findUnique({
    where: {
      employeeId_date: {
        employeeId,
        date: todayDate,
      },
    },
    select: {
      id: true,
      employeeId: true,
      date: true,
      checkIn: true,
      checkOut: true,
      status: true,
      workHours: true,
      overtimeHours: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Check if employee is on approved leave today
  const todayLeave = prisma.leaveRequest?.findFirst
    ? await prisma.leaveRequest.findFirst({
        where: {
          employeeId,
          status: 'APPROVED',
          startDate: { lte: todayDate },
          endDate: { gte: todayDate },
        },
        include: { leaveType: true },
      })
    : null;

  if (todayLeave) {
    return {
      date: todayDate,
      status: 'ON_LEAVE',
      systrayState: 'leave',
      badgeColor: 'BLUE',
      icon: 'airplane',
      message: `On approved leave today (${todayLeave.leaveType.name}).`,
      record: record || null,
      leave: todayLeave,
    };
  }

  if (!record || !record.checkIn) {
    return {
      date: todayDate,
      status: 'NOT_CHECKED_IN',
      systrayState: 'absent',
      badgeColor: 'YELLOW',
      icon: 'clock',
      message: 'No check-in record found for today.',
      record: null,
    };
  }

  const isCheckedOut = Boolean(record.checkOut);

  return {
    date: record.date,
    status: isCheckedOut ? 'CHECKED_OUT' : 'CHECKED_IN',
    systrayState: isCheckedOut ? 'checked_out' : 'present',
    badgeColor: isCheckedOut ? 'GRAY' : 'GREEN',
    icon: isCheckedOut ? 'check-circle' : 'user-check',
    record,
  };
}

/**
 * Get Attendance History with pagination, date filters, and role-based scoping:
 * - EMPLOYEE: strictly limited to their own attendance records
 * - ADMIN / HR: can query all records or filter by employeeId / departmentId
 */
export async function getAttendanceHistoryService(userContext: JwtPayload, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);
  const where: Prisma.AttendanceWhereInput = {};

  // Enforce server-side authorization
  if (userContext.role === Role.EMPLOYEE) {
    const employeeId = await resolveEmployeeId(userContext);
    where.employeeId = employeeId;
  } else {
    // ADMIN or HR can filter by employeeId or departmentId
    if (queryParams.employeeId) {
      where.employeeId = queryParams.employeeId;
    }
    if (queryParams.departmentId) {
      where.employee = { departmentId: queryParams.departmentId };
    }
  }

  // Date Range Filtering
  if (queryParams.date) {
    where.date = normalizeDate(queryParams.date);
  } else if (queryParams.startDate || queryParams.endDate) {
    where.date = {};
    if (queryParams.startDate) {
      where.date.gte = normalizeDate(queryParams.startDate);
    }
    if (queryParams.endDate) {
      where.date.lte = normalizeDate(queryParams.endDate);
    }
  }

  // Status Filter
  if (queryParams.status) {
    where.status = queryParams.status as AttendanceStatus;
  }

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      skip,
      take: limit,
      orderBy: { date: 'desc' },
      select: {
        id: true,
        employeeId: true,
        date: true,
        checkIn: true,
        checkOut: true,
        status: true,
        workHours: true,
        overtimeHours: true,
        createdAt: true,
        employee: {
          select: {
            id: true,
            loginId: true,
            firstName: true,
            lastName: true,
            department: { select: { id: true, name: true, code: true } },
            designation: { select: { id: true, title: true } },
          },
        },
      },
    }),
    prisma.attendance.count({ where }),
  ]);

  return {
    data: records,
    meta: buildPaginationMeta(page, limit, total),
  };
}

/**
 * Get Weekly Attendance Summary & Breakdown.
 */
export async function getWeeklyAttendanceService(userContext: JwtPayload, queryParams: any) {
  let targetEmployeeId = await resolveEmployeeId(userContext);

  if ((userContext.role === Role.ADMIN || userContext.role === Role.HR) && queryParams.employeeId) {
    targetEmployeeId = queryParams.employeeId;
  }

  const anchorDate = queryParams.startDate ? new Date(queryParams.startDate) : new Date();
  
  // Calculate start of week (Monday) and end of week (Sunday)
  const dayOfWeek = anchorDate.getUTCDay(); // 0 is Sunday
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
  
  const monday = new Date(anchorDate);
  monday.setUTCDate(anchorDate.getUTCDate() + diffToMonday);
  const startDate = normalizeDate(monday);

  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  const endDate = normalizeDate(sunday);

  const records = await prisma.attendance.findMany({
    where: {
      employeeId: targetEmployeeId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      date: true,
      checkIn: true,
      checkOut: true,
      status: true,
      workHours: true,
      overtimeHours: true,
    },
  });

  const totalDays = records.length;
  const presentDays = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
  const halfDays = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;
  const leaveDays = records.filter((r) => r.status === AttendanceStatus.LEAVE || r.status === AttendanceStatus.ON_LEAVE).length;
  const absentDays = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
  const totalWorkHours = Math.round(records.reduce((sum, r) => sum + (r.workHours || 0), 0) * 100) / 100;
  const totalOvertimeHours = Math.round(records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0) * 100) / 100;

  return {
    weekStart: startDate.toISOString().split('T')[0],
    weekEnd: endDate.toISOString().split('T')[0],
    employeeId: targetEmployeeId,
    summary: {
      totalRecords: totalDays,
      presentDays,
      halfDays,
      leaveDays,
      absentDays,
      totalWorkHours,
      totalOvertimeHours,
    },
    records,
  };
}

/**
 * Get Monthly Attendance Summary & Breakdown.
 */
export async function getMonthlyAttendanceService(userContext: JwtPayload, queryParams: any) {
  let targetEmployeeId = await resolveEmployeeId(userContext);

  if ((userContext.role === Role.ADMIN || userContext.role === Role.HR) && queryParams.employeeId) {
    targetEmployeeId = queryParams.employeeId;
  }

  const now = new Date();
  const year = queryParams.year ? parseInt(queryParams.year, 10) : now.getUTCFullYear();
  const month = queryParams.month ? parseInt(queryParams.month, 10) : now.getUTCMonth() + 1; // 1-indexed (1-12)

  const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
  // Last day of month
  const endDate = new Date(Date.UTC(year, month, 0, 0, 0, 0, 0));

  const records = await prisma.attendance.findMany({
    where: {
      employeeId: targetEmployeeId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: { date: 'asc' },
    select: {
      id: true,
      date: true,
      checkIn: true,
      checkOut: true,
      status: true,
      workHours: true,
      overtimeHours: true,
    },
  });

  const totalDaysInMonth = endDate.getUTCDate();
  const recordedDays = records.length;
  const presentDays = records.filter((r) => r.status === AttendanceStatus.PRESENT).length;
  const halfDays = records.filter((r) => r.status === AttendanceStatus.HALF_DAY).length;
  const leaveDays = records.filter((r) => r.status === AttendanceStatus.LEAVE || r.status === AttendanceStatus.ON_LEAVE).length;
  const absentDays = records.filter((r) => r.status === AttendanceStatus.ABSENT).length;
  const totalWorkHours = Math.round(records.reduce((sum, r) => sum + (r.workHours || 0), 0) * 100) / 100;
  const totalOvertimeHours = Math.round(records.reduce((sum, r) => sum + (r.overtimeHours || 0), 0) * 100) / 100;
  const averageDailyWorkHours = recordedDays > 0 ? Math.round((totalWorkHours / recordedDays) * 100) / 100 : 0;

  return {
    year,
    month,
    totalDaysInMonth,
    employeeId: targetEmployeeId,
    summary: {
      recordedDays,
      presentDays,
      halfDays,
      leaveDays,
      absentDays,
      totalWorkHours,
      totalOvertimeHours,
      averageDailyWorkHours,
    },
    records,
  };
}
