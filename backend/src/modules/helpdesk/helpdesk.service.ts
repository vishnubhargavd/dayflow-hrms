import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { parsePaginationParams, buildPaginationMeta } from '../../utils/pagination.util';
import { HelpdeskStatus, HelpdeskCategory, HelpdeskPriority, NotificationType, Prisma, Role } from '@prisma/client';
import { createInternalNotification, createBulkNotifications, getHRAndAdminUserIds } from '../notifications/notifications.service';

/**
 * Generate a unique ticket number: HD-YYYY-XXXX (e.g. HD-2026-0001)
 */
export async function generateTicketNumber(tx: Prisma.TransactionClient | typeof prisma): Promise<string> {
  const year = new Date().getFullYear();
  const count = await tx.helpdeskRequest.count({
    where: {
      ticketNumber: {
        startsWith: `HD-${year}-`,
      },
    },
  });

  const formattedSeq = String(count + 1).padStart(4, '0');
  return `HD-${year}-${formattedSeq}`;
}

/**
 * Validate status state transitions
 */
export function validateStatusTransition(currentStatus: HelpdeskStatus, targetStatus: HelpdeskStatus) {
  if (currentStatus === targetStatus) return;

  const validTransitions: Record<HelpdeskStatus, HelpdeskStatus[]> = {
    [HelpdeskStatus.OPEN]: [HelpdeskStatus.IN_PROGRESS, HelpdeskStatus.CANCELLED],
    [HelpdeskStatus.IN_PROGRESS]: [HelpdeskStatus.RESOLVED, HelpdeskStatus.CANCELLED],
    [HelpdeskStatus.RESOLVED]: [HelpdeskStatus.CLOSED],
    [HelpdeskStatus.CLOSED]: [],
    [HelpdeskStatus.CANCELLED]: [],
  };

  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    throw new AppError(
      `Invalid status transition from '${currentStatus}' to '${targetStatus}'.`,
      400,
      'INVALID_STATUS_TRANSITION'
    );
  }
}

/**
 * Employee Self-Service: Create a new HR Helpdesk Request
 */
export async function createHelpdeskRequestService(
  employeeId: string,
  data: {
    category: HelpdeskCategory;
    priority?: HelpdeskPriority;
    subject: string;
    description: string;
  }
) {
  return prisma.$transaction(async (tx) => {
    const ticketNumber = await generateTicketNumber(tx);

    const request = await tx.helpdeskRequest.create({
      data: {
        ticketNumber,
        employeeId,
        category: data.category,
        priority: data.priority || HelpdeskPriority.MEDIUM,
        subject: data.subject.trim(),
        description: data.description.trim(),
        status: HelpdeskStatus.OPEN,
      },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, loginId: true } },
      },
    });

    // Notify HR/Admin team of new helpdesk ticket
    try {
      const hrUserIds = await getHRAndAdminUserIds(tx);
      await createBulkNotifications({
        userIds: hrUserIds,
        type: NotificationType.HELPDESK_CREATED,
        title: 'New Helpdesk Ticket Created',
        message: `Helpdesk request ${request.ticketNumber} (${request.category}) created by ${request.employee.firstName} ${request.employee.lastName}.`,
        tx,
      });
    } catch (notifErr) {
      // Non-blocking notification error handling
    }

    return request;
  });
}

/**
 * Employee Self-Service: Get own helpdesk requests
 */
export async function getEmployeeHelpdeskRequestsService(employeeId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.HelpdeskRequestWhereInput = { employeeId };

  if (queryParams.status) where.status = queryParams.status;
  if (queryParams.category) where.category = queryParams.category;
  if (queryParams.priority) where.priority = queryParams.priority;

  const [requests, total] = await Promise.all([
    prisma.helpdeskRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.helpdeskRequest.count({ where }),
  ]);

  return {
    data: requests,
    meta: buildPaginationMeta(page, limit, total),
  };
}

/**
 * Employee Self-Service: Get own helpdesk request by ID with IDOR protection
 */
export async function getEmployeeHelpdeskRequestByIdService(requestId: string, employeeId: string) {
  const request = await prisma.helpdeskRequest.findUnique({
    where: { id: requestId },
    include: {
      employee: { select: { id: true, firstName: true, lastName: true, loginId: true } },
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, loginId: true, role: true, employee: { select: { firstName: true, lastName: true } } } },
        },
      },
    },
  });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  // IDOR Protection: Must be owner
  if (request.employeeId !== employeeId) {
    throw new AppError('You are not authorized to access this helpdesk request.', 403, 'FORBIDDEN');
  }

  return request;
}

/**
 * Employee Self-Service: Cancel an open or in-progress request
 */
export async function cancelHelpdeskRequestService(requestId: string, employeeId: string) {
  const request = await prisma.helpdeskRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  if (request.employeeId !== employeeId) {
    throw new AppError('You are not authorized to cancel this helpdesk request.', 403, 'FORBIDDEN');
  }

  validateStatusTransition(request.status, HelpdeskStatus.CANCELLED);

  return prisma.helpdeskRequest.update({
    where: { id: requestId },
    data: { status: HelpdeskStatus.CANCELLED },
  });
}

/**
 * Employee Self-Service: Add comment to own ticket thread
 */
export async function addEmployeeCommentService(requestId: string, userId: string, employeeId: string, message: string) {
  const request = await prisma.helpdeskRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  if (request.employeeId !== employeeId) {
    throw new AppError('You are not authorized to comment on this helpdesk request.', 403, 'FORBIDDEN');
  }

  if (request.status === HelpdeskStatus.CLOSED || request.status === HelpdeskStatus.CANCELLED) {
    throw new AppError(`Cannot comment on a ${request.status.toLowerCase()} request.`, 400, 'TICKET_CLOSED');
  }

  return prisma.helpdeskComment.create({
    data: {
      helpdeskRequestId: requestId,
      authorId: userId,
      message: message.trim(),
    },
    include: {
      author: { select: { id: true, loginId: true, role: true, employee: { select: { firstName: true, lastName: true } } } },
    },
  });
}

/**
 * HR / Admin: List all helpdesk requests across organization
 */
export async function getAllHelpdeskRequestsService(queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.HelpdeskRequestWhereInput = {};

  if (queryParams.status) where.status = queryParams.status;
  if (queryParams.category) where.category = queryParams.category;
  if (queryParams.priority) where.priority = queryParams.priority;
  if (queryParams.assignedToId) where.assignedToId = queryParams.assignedToId;
  if (queryParams.employeeId) where.employeeId = queryParams.employeeId;

  const [requests, total] = await Promise.all([
    prisma.helpdeskRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, loginId: true, department: { select: { name: true } } },
        },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.helpdeskRequest.count({ where }),
  ]);

  return {
    data: requests,
    meta: buildPaginationMeta(page, limit, total),
  };
}

/**
 * HR / Admin: Get helpdesk request details
 */
export async function getHelpdeskRequestByIdHRService(requestId: string) {
  const request = await prisma.helpdeskRequest.findUnique({
    where: { id: requestId },
    include: {
      employee: {
        select: { id: true, firstName: true, lastName: true, loginId: true, department: { select: { name: true } } },
      },
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
      comments: {
        orderBy: { createdAt: 'asc' },
        include: {
          author: { select: { id: true, loginId: true, role: true, employee: { select: { firstName: true, lastName: true } } } },
        },
      },
    },
  });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  return request;
}

/**
 * HR / Admin: Assign request to HR/Admin employee
 */
export async function assignHelpdeskRequestService(requestId: string, assignedToId: string) {
  const request = await prisma.helpdeskRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  // Validate target employee has ADMIN or HR role
  const targetEmployee = await prisma.employee.findUnique({
    where: { id: assignedToId },
    include: { user: { select: { role: true } } },
  });

  if (!targetEmployee || (targetEmployee.user.role !== Role.ADMIN && targetEmployee.user.role !== Role.HR)) {
    throw new AppError('Target assigned user must have ADMIN or HR authorization.', 400, 'INVALID_ASSIGNMENT');
  }

  const nextStatus = request.status === HelpdeskStatus.OPEN ? HelpdeskStatus.IN_PROGRESS : request.status;

  const updated = await prisma.helpdeskRequest.update({
    where: { id: requestId },
    data: {
      assignedToId,
      status: nextStatus,
    },
    include: {
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  // Notify assigned HR officer
  try {
    await createInternalNotification({
      userId: targetEmployee.userId,
      type: NotificationType.HELPDESK_ASSIGNED,
      title: 'Helpdesk Ticket Assigned',
      message: `Helpdesk request ${request.ticketNumber} has been assigned to you.`,
    });
  } catch (notifErr) {
    // Non-blocking notification error handling
  }

  return updated;
}

/**
 * HR / Admin: Update request status
 */
export async function updateHelpdeskStatusService(requestId: string, targetStatus: HelpdeskStatus) {
  const request = await prisma.helpdeskRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  validateStatusTransition(request.status, targetStatus);

  const data: Prisma.HelpdeskRequestUpdateInput = { status: targetStatus };

  if (targetStatus === HelpdeskStatus.RESOLVED) {
    data.resolvedAt = new Date();
  } else if (targetStatus === HelpdeskStatus.CLOSED) {
    data.closedAt = new Date();
  }

  return prisma.helpdeskRequest.update({
    where: { id: requestId },
    data,
  });
}

/**
 * HR / Admin: Resolve helpdesk request with resolution notes
 */
export async function resolveHelpdeskRequestService(requestId: string, resolution: string) {
  const request = await prisma.helpdeskRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  validateStatusTransition(request.status, HelpdeskStatus.RESOLVED);

  const updated = await prisma.helpdeskRequest.update({
    where: { id: requestId },
    data: {
      status: HelpdeskStatus.RESOLVED,
      resolution: resolution.trim(),
      resolvedAt: new Date(),
    },
    include: {
      employee: { select: { userId: true } },
    },
  });

  // Notify requesting employee of resolution
  try {
    await createInternalNotification({
      userId: updated.employee.userId,
      type: NotificationType.HELPDESK_RESOLVED,
      title: 'Helpdesk Ticket Resolved',
      message: `Your helpdesk request ${request.ticketNumber} has been resolved.`,
    });
  } catch (notifErr) {
    // Non-blocking notification error handling
  }

  return updated;
}

/**
 * HR / Admin: Close resolved helpdesk request
 */
export async function closeHelpdeskRequestService(requestId: string) {
  const request = await prisma.helpdeskRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  validateStatusTransition(request.status, HelpdeskStatus.CLOSED);

  const updated = await prisma.helpdeskRequest.update({
    where: { id: requestId },
    data: {
      status: HelpdeskStatus.CLOSED,
      closedAt: new Date(),
    },
    include: {
      employee: { select: { userId: true } },
    },
  });

  // Notify requesting employee of closure
  try {
    await createInternalNotification({
      userId: updated.employee.userId,
      type: NotificationType.HELPDESK_CLOSED,
      title: 'Helpdesk Ticket Closed',
      message: `Your helpdesk request ${request.ticketNumber} has been closed.`,
    });
  } catch (notifErr) {
    // Non-blocking notification error handling
  }

  return updated;
}

/**
 * HR / Admin: Add HR comment to ticket thread
 */
export async function addHRCommentService(requestId: string, userId: string, message: string) {
  const request = await prisma.helpdeskRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError('Helpdesk request not found.', 404, 'NOT_FOUND');
  }

  return prisma.helpdeskComment.create({
    data: {
      helpdeskRequestId: requestId,
      authorId: userId,
      message: message.trim(),
    },
    include: {
      author: { select: { id: true, loginId: true, role: true, employee: { select: { firstName: true, lastName: true } } } },
    },
  });
}

/**
 * Integration Point for Smart HR Intelligence: Get unresolved ticket metrics
 */
export async function getHelpdeskUnresolvedSummary() {
  const count = await prisma.helpdeskRequest.count({
    where: { status: { in: [HelpdeskStatus.OPEN, HelpdeskStatus.IN_PROGRESS] } },
  });

  return { unresolvedTicketsCount: count };
}
