import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { parsePaginationParams, buildPaginationMeta } from '../../utils/pagination.util';
import { NotificationType, LeaveStatus, LeaveCategory, AttendanceStatus, Prisma } from '@prisma/client';
import { createInternalNotification, createBulkNotifications, getHRAndAdminUserIds } from '../notifications/notifications.service';

/**
 * Calculate total inclusive days between startDate and endDate
 */
export function calculateLeaveDays(startStr: string | Date, endStr: string | Date): { startDate: Date; endDate: Date; totalDays: number } {
  const startDate = new Date(startStr);
  const endDate = new Date(endStr);

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(0, 0, 0, 0);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new AppError('Invalid start or end date format.', 400, 'INVALID_DATE');
  }

  if (endDate.getTime() < startDate.getTime()) {
    throw new AppError('End date cannot be prior to start date.', 400, 'INVALID_DATE_RANGE');
  }

  const diffTime = endDate.getTime() - startDate.getTime();
  const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return { startDate, endDate, totalDays };
}

/**
 * Check for overlapping active (PENDING or APPROVED) leave requests
 */
export async function checkForOverlappingLeave(
  employeeId: string,
  startDate: Date,
  endDate: Date,
  excludeRequestId?: string
) {
  const whereClause: Prisma.LeaveRequestWhereInput = {
    employeeId,
    status: { in: [LeaveStatus.PENDING, LeaveStatus.APPROVED] },
    AND: [
      { startDate: { lte: endDate } },
      { endDate: { gte: startDate } },
    ],
  };

  if (excludeRequestId) {
    whereClause.id = { not: excludeRequestId };
  }

  const overlapping = await prisma.leaveRequest.findFirst({
    where: whereClause,
  });

  if (overlapping) {
    throw new AppError(
      'An active or pending leave request already exists for the selected date range.',
      400,
      'OVERLAPPING_LEAVE_REQUEST'
    );
  }
}

/**
 * Get or initialize leave balance for an employee for a specific leave type & year
 */
async function getOrInitLeaveBalance(tx: Prisma.TransactionClient, employeeId: string, leaveTypeId: string, year: number) {
  let balance = await tx.leaveBalance.findUnique({
    where: {
      employeeId_leaveTypeId_year: {
        employeeId,
        leaveTypeId,
        year,
      },
    },
    include: { leaveType: true },
  });

  if (!balance) {
    const leaveType = await tx.leaveType.findUnique({ where: { id: leaveTypeId } });
    if (!leaveType) {
      throw new AppError('Leave type not found.', 444, 'NOT_FOUND');
    }

    balance = await tx.leaveBalance.create({
      data: {
        employeeId,
        leaveTypeId,
        year,
        allocatedDays: leaveType.maxDaysPerYear,
        usedDays: 0,
        pendingDays: 0,
      },
      include: { leaveType: true },
    });
  }

  return balance;
}

/**
 * Apply for leave (Employee self-service)
 */
export async function applyLeaveService(employeeId: string, data: { leaveTypeId: string; startDate: string; endDate: string; reason: string }) {
  const { startDate, endDate, totalDays } = calculateLeaveDays(data.startDate, data.endDate);
  const year = startDate.getFullYear();

  // 1. Verify leave type
  const leaveType = await prisma.leaveType.findUnique({ where: { id: data.leaveTypeId } });
  if (!leaveType || !leaveType.isActive) {
    throw new AppError('Invalid or inactive leave type selected.', 400, 'INVALID_LEAVE_TYPE');
  }

  // 2. Check for overlapping requests
  await checkForOverlappingLeave(employeeId, startDate, endDate);

  // 3. Execute in transaction: verify balance & create request
  return prisma.$transaction(async (tx) => {
    const balance = await getOrInitLeaveBalance(tx, employeeId, data.leaveTypeId, year);

    // Validate balance for non-UNPAID leave categories
    if (leaveType.category !== LeaveCategory.UNPAID) {
      const remainingAvailable = balance.allocatedDays - balance.usedDays - balance.pendingDays;
      if (remainingAvailable < totalDays) {
        throw new AppError(
          `Insufficient ${leaveType.name} balance. Available: ${remainingAvailable} days, Requested: ${totalDays} days.`,
          400,
          'INSUFFICIENT_LEAVE_BALANCE'
        );
      }
    }

    // Update pending days in balance
    await tx.leaveBalance.update({
      where: { id: balance.id },
      data: { pendingDays: { increment: totalDays } },
    });

    // Create leave request
    const leaveRequest = await tx.leaveRequest.create({
      data: {
        employeeId,
        leaveTypeId: data.leaveTypeId,
        startDate,
        endDate,
        totalDays,
        reason: data.reason.trim(),
        status: LeaveStatus.PENDING,
      },
      include: {
        leaveType: true,
        employee: {
          select: { id: true, firstName: true, lastName: true, loginId: true },
        },
      },
    });

    // Notify HR/Admin team of new leave submission
    try {
      const hrUserIds = await getHRAndAdminUserIds(tx);
      await createBulkNotifications({
        userIds: hrUserIds,
        type: NotificationType.LEAVE_SUBMITTED,
        title: 'New Leave Request Submitted',
        message: `${leaveRequest.employee.firstName} ${leaveRequest.employee.lastName} submitted a request for ${leaveRequest.leaveType.name} (${totalDays} day/s).`,
        tx,
      });
    } catch (notifErr) {
      // Non-blocking notification error handling
    }

    return leaveRequest;
  });
}

/**
 * Cancel pending leave request (Employee self-service)
 */
export async function cancelLeaveRequestService(requestId: string, employeeId: string) {
  const request = await prisma.leaveRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) {
    throw new AppError('Leave request not found.', 404, 'NOT_FOUND');
  }

  // IDOR Protection: Ensure request belongs to requesting employee
  if (request.employeeId !== employeeId) {
    throw new AppError('You are not authorized to cancel this leave request.', 403, 'FORBIDDEN');
  }

  if (request.status !== LeaveStatus.PENDING) {
    throw new AppError('Only pending leave requests can be cancelled.', 400, 'INVALID_STATUS_TRANSITION');
  }

  const year = request.startDate.getFullYear();

  return prisma.$transaction(async (tx) => {
    const updatedRequest = await tx.leaveRequest.update({
      where: { id: requestId },
      data: { status: LeaveStatus.CANCELLED },
      include: { leaveType: true },
    });

    // Decrement pendingDays in leave balance
    const balance = await tx.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId: request.employeeId,
          leaveTypeId: request.leaveTypeId,
          year,
        },
      },
    });

    if (balance) {
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: {
          pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
        },
      });
    }

    return updatedRequest;
  });
}

/**
 * Approve leave request (HR / Admin)
 */
export async function approveLeaveRequestService(requestId: string, reviewerEmployeeId: string, reviewerComment?: string) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.leaveRequest.findUnique({
      where: { id: requestId },
      include: { leaveType: true },
    });

    if (!request) {
      throw new AppError('Leave request not found.', 404, 'NOT_FOUND');
    }

    if (request.status !== LeaveStatus.PENDING) {
      throw new AppError(`Cannot approve request with status '${request.status}'.`, 400, 'INVALID_STATUS_TRANSITION');
    }

    const year = request.startDate.getFullYear();
    const balance = await getOrInitLeaveBalance(tx, request.employeeId, request.leaveTypeId, year);

    // Re-verify balance condition for balance-enforced types
    if (request.leaveType.category !== LeaveCategory.UNPAID) {
      const actualRemaining = balance.allocatedDays - balance.usedDays;
      if (actualRemaining < request.totalDays) {
        throw new AppError(
          `Cannot approve: Employee has insufficient remaining balance (${actualRemaining} days available, ${request.totalDays} days requested).`,
          400,
          'INSUFFICIENT_LEAVE_BALANCE'
        );
      }
    }

    // Update balance: decrement pendingDays, increment usedDays
    await tx.leaveBalance.update({
      where: { id: balance.id },
      data: {
        pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
        usedDays: balance.usedDays + request.totalDays,
      },
    });

    // Update leave request
    const approvedRequest = await tx.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: LeaveStatus.APPROVED,
        reviewerId: reviewerEmployeeId,
        reviewerComment: reviewerComment || null,
      },
      include: {
        leaveType: true,
        employee: { select: { id: true, userId: true, firstName: true, lastName: true, loginId: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Clean Attendance Integration Boundary: Mark attendance records as LEAVE for approved date range
    try {
      const curr = new Date(request.startDate);
      const end = new Date(request.endDate);
      while (curr <= end) {
        const dateOnly = new Date(curr);
        dateOnly.setHours(0, 0, 0, 0);

        await tx.attendance.upsert({
          where: {
            employeeId_date: {
              employeeId: request.employeeId,
              date: dateOnly,
            },
          },
          update: {
            status: AttendanceStatus.LEAVE,
          },
          create: {
            employeeId: request.employeeId,
            date: dateOnly,
            status: AttendanceStatus.LEAVE,
          },
        });
        curr.setDate(curr.getDate() + 1);
      }
    } catch (attErr) {
      console.warn('Attendance sync non-fatal notice:', attErr);
    }

    // Dispatch notification to requesting employee
    try {
      await createInternalNotification({
        userId: approvedRequest.employee.userId,
        type: NotificationType.LEAVE_APPROVED,
        title: 'Leave Request Approved',
        message: `Your request for ${approvedRequest.leaveType.name} (${approvedRequest.totalDays} day/s) has been approved.`,
        tx,
      });
    } catch (notifErr) {
      // Non-blocking notification error handling
    }

    return approvedRequest;
  });
}

/**
 * Reject leave request (HR / Admin)
 */
export async function rejectLeaveRequestService(
  requestId: string,
  reviewerEmployeeId: string,
  rejectionReason: string,
  reviewerComment?: string
) {
  return prisma.$transaction(async (tx) => {
    const request = await tx.leaveRequest.findUnique({
      where: { id: requestId },
    });

    if (!request) {
      throw new AppError('Leave request not found.', 404, 'NOT_FOUND');
    }

    if (request.status !== LeaveStatus.PENDING) {
      throw new AppError(`Cannot reject request with status '${request.status}'.`, 400, 'INVALID_STATUS_TRANSITION');
    }

    const year = request.startDate.getFullYear();

    // Update balance: decrement pendingDays, usedDays unchanged
    const balance = await tx.leaveBalance.findUnique({
      where: {
        employeeId_leaveTypeId_year: {
          employeeId: request.employeeId,
          leaveTypeId: request.leaveTypeId,
          year,
        },
      },
    });

    if (balance) {
      await tx.leaveBalance.update({
        where: { id: balance.id },
        data: {
          pendingDays: Math.max(0, balance.pendingDays - request.totalDays),
        },
      });
    }

    // Update leave request
    const rejectedRequest = await tx.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: LeaveStatus.REJECTED,
        reviewerId: reviewerEmployeeId,
        rejectionReason: rejectionReason.trim(),
        reviewerComment: reviewerComment || null,
      },
      include: {
        leaveType: true,
        employee: { select: { id: true, userId: true, firstName: true, lastName: true, loginId: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Dispatch notification to requesting employee
    try {
      await createInternalNotification({
        userId: rejectedRequest.employee.userId,
        type: NotificationType.LEAVE_REJECTED,
        title: 'Leave Request Rejected',
        message: `Your request for ${rejectedRequest.leaveType.name} was rejected: ${rejectionReason}`,
        tx,
      });
    } catch (notifErr) {
      // Non-blocking notification error handling
    }

    return rejectedRequest;
  });
}

/**
 * Get balances for employee (Self or HR/Admin)
 */
export async function getEmployeeBalancesService(employeeId: string, year = new Date().getFullYear()) {
  const balances = await prisma.leaveBalance.findMany({
    where: { employeeId, year },
    include: { leaveType: true },
    orderBy: { leaveType: { name: 'asc' } },
  });

  return balances.map((b) => ({
    id: b.id,
    leaveType: b.leaveType,
    year: b.year,
    allocatedDays: b.allocatedDays,
    usedDays: b.usedDays,
    pendingDays: b.pendingDays,
    remainingDays: Math.max(0, b.allocatedDays - b.usedDays - b.pendingDays),
  }));
}

/**
 * Get paginated requests for an employee (Self service)
 */
export async function getEmployeeRequestsService(employeeId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.LeaveRequestWhereInput = { employeeId };

  if (queryParams.status) {
    where.status = queryParams.status;
  }

  const [requests, total] = await Promise.all([
    prisma.leaveRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        leaveType: true,
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.leaveRequest.count({ where }),
  ]);

  return {
    data: requests,
    meta: buildPaginationMeta(page, limit, total),
  };
}

/**
 * Get details of specific leave request with ownership check (Self service IDOR protection)
 */
export async function getEmployeeRequestByIdService(requestId: string, employeeId: string) {
  const request = await prisma.leaveRequest.findUnique({
    where: { id: requestId },
    include: {
      leaveType: true,
      reviewer: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!request) {
    throw new AppError('Leave request not found.', 404, 'NOT_FOUND');
  }

  if (request.employeeId !== employeeId) {
    throw new AppError('You are not authorized to view this leave request.', 403, 'FORBIDDEN');
  }

  return request;
}

/**
 * HR / Admin: List all leave requests across the organization
 */
export async function getAllLeaveRequestsService(queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.LeaveRequestWhereInput = {};

  if (queryParams.status) {
    where.status = queryParams.status;
  }

  if (queryParams.employeeId) {
    where.employeeId = queryParams.employeeId;
  }

  if (queryParams.leaveTypeId) {
    where.leaveTypeId = queryParams.leaveTypeId;
  }

  const [requests, total] = await Promise.all([
    prisma.leaveRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        leaveType: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            loginId: true,
            department: { select: { name: true } },
          },
        },
        reviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.leaveRequest.count({ where }),
  ]);

  return {
    data: requests,
    meta: buildPaginationMeta(page, limit, total),
  };
}

/**
 * List all active leave types
 */
export async function getLeaveTypesService() {
  return prisma.leaveType.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

/**
 * Create a new Leave Type (Admin / HR)
 */
export async function createLeaveTypeService(data: {
  name: string;
  code: string;
  category: LeaveCategory;
  maxDaysPerYear: number;
  description?: string;
}) {
  const existing = await prisma.leaveType.findFirst({
    where: {
      OR: [{ name: data.name }, { code: data.code.toUpperCase() }],
    },
  });

  if (existing) {
    throw new AppError('A leave type with this name or code already exists.', 409, 'DUPLICATE_LEAVE_TYPE');
  }

  return prisma.leaveType.create({
    data: {
      name: data.name.trim(),
      code: data.code.toUpperCase().trim(),
      category: data.category,
      maxDaysPerYear: data.maxDaysPerYear,
      description: data.description?.trim() || null,
      isActive: true,
    },
  });
}

/**
 * Allocate / Update Leave Balance for an employee (Admin / HR)
 */
export async function allocateLeaveBalanceService(data: {
  employeeId: string;
  leaveTypeId: string;
  year?: number;
  allocatedDays: number;
}) {
  const targetYear = data.year || new Date().getFullYear();

  const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
  if (!employee) {
    throw new AppError('Employee not found.', 404, 'NOT_FOUND');
  }

  const leaveType = await prisma.leaveType.findUnique({ where: { id: data.leaveTypeId } });
  if (!leaveType) {
    throw new AppError('Leave type not found.', 404, 'NOT_FOUND');
  }

  return prisma.leaveBalance.upsert({
    where: {
      employeeId_leaveTypeId_year: {
        employeeId: data.employeeId,
        leaveTypeId: data.leaveTypeId,
        year: targetYear,
      },
    },
    update: {
      allocatedDays: data.allocatedDays,
    },
    create: {
      employeeId: data.employeeId,
      leaveTypeId: data.leaveTypeId,
      year: targetYear,
      allocatedDays: data.allocatedDays,
      usedDays: 0,
      pendingDays: 0,
    },
    include: { leaveType: true },
  });
}

/**
 * Integration Point for Payroll: Summarize approved paid vs unpaid leave days
 */
export async function getApprovedLeaveDaysSummary(employeeId: string, startDate: Date, endDate: Date) {
  const approvedRequests = await prisma.leaveRequest.findMany({
    where: {
      employeeId,
      status: LeaveStatus.APPROVED,
      AND: [
        { startDate: { lte: endDate } },
        { endDate: { gte: startDate } },
      ],
    },
    include: { leaveType: true },
  });

  let paidLeaveDays = 0;
  let unpaidLeaveDays = 0;

  for (const req of approvedRequests) {
    if (req.leaveType.category === LeaveCategory.UNPAID) {
      unpaidLeaveDays += req.totalDays;
    } else {
      paidLeaveDays += req.totalDays;
    }
  }

  return { paidLeaveDays, unpaidLeaveDays, totalApprovedLeaveDays: paidLeaveDays + unpaidLeaveDays };
}

/**
 * Integration Point for Smart Insights: Get remaining balances and insights summary
 */
export async function getLeaveInsightsSummary(employeeId: string) {
  const currentYear = new Date().getFullYear();
  const balances = await getEmployeeBalancesService(employeeId, currentYear);
  const pendingRequests = await prisma.leaveRequest.count({
    where: { employeeId, status: LeaveStatus.PENDING },
  });

  return {
    year: currentYear,
    balances,
    pendingRequestsCount: pendingRequests,
  };
}
