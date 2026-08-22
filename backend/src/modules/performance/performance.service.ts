import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { parsePaginationParams, buildPaginationMeta } from '../../utils/pagination.util';
import { GoalStatus, ReviewStatus, Prisma } from '@prisma/client';

// ==========================================
// GOAL MANAGEMENT SERVICES
// ==========================================

export async function createGoalService(
  data: {
    employeeId: string;
    title: string;
    description?: string;
    target?: string;
    progress?: number;
    status?: GoalStatus;
    startDate?: string;
    dueDate?: string;
  },
  createdByUserId: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: data.employeeId },
  });
  if (!employee) {
    throw new AppError('Employee profile not found.', 404, 'NOT_FOUND');
  }

  const progress = data.progress ?? 0;
  if (progress < 0 || progress > 100) {
    throw new AppError('Goal progress must be between 0% and 100%.', 400, 'BAD_REQUEST');
  }

  let status = data.status || GoalStatus.NOT_STARTED;
  if (progress === 100) {
    status = GoalStatus.COMPLETED;
  } else if (progress > 0 && status === GoalStatus.NOT_STARTED) {
    status = GoalStatus.IN_PROGRESS;
  }

  const startDate = data.startDate ? new Date(data.startDate) : new Date();
  const dueDate = data.dueDate ? new Date(data.dueDate) : null;

  return prisma.$transaction(async (tx) => {
    const goal = await tx.performanceGoal.create({
      data: {
        employeeId: data.employeeId,
        title: data.title.trim(),
        description: data.description?.trim(),
        target: data.target?.trim(),
        progress,
        status,
        startDate,
        dueDate,
        createdById: createdByUserId,
      },
      include: {
        employee: { select: { id: true, loginId: true, firstName: true, lastName: true } },
        createdBy: { select: { id: true, email: true, role: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: createdByUserId,
        action: 'CREATE_PERFORMANCE_GOAL',
        entity: 'PerformanceGoal',
        entityId: goal.id,
        details: `Assigned goal '${goal.title}' to employee ${employee.loginId}`,
      },
    });

    return goal;
  });
}

export async function getGoalsService(queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.PerformanceGoalWhereInput = {};
  if (queryParams.employeeId) {
    where.employeeId = queryParams.employeeId;
  }
  if (queryParams.status) {
    where.status = queryParams.status as GoalStatus;
  }

  const [goals, total] = await Promise.all([
    prisma.performanceGoal.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: { select: { id: true, loginId: true, firstName: true, lastName: true, department: true } },
        createdBy: { select: { id: true, email: true } },
      },
    }),
    prisma.performanceGoal.count({ where }),
  ]);

  return {
    data: goals,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getEmployeeOwnGoalsService(employeeId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.PerformanceGoalWhereInput = { employeeId };
  if (queryParams.status) {
    where.status = queryParams.status as GoalStatus;
  }

  const [goals, total] = await Promise.all([
    prisma.performanceGoal.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        createdBy: { select: { email: true } },
      },
    }),
    prisma.performanceGoal.count({ where }),
  ]);

  return {
    data: goals,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function updateGoalProgressService(goalId: string, progress: number, requestingEmployeeId: string) {
  const goal = await prisma.performanceGoal.findUnique({
    where: { id: goalId },
  });

  if (!goal) {
    throw new AppError('Performance goal not found.', 404, 'NOT_FOUND');
  }

  // IDOR Protection: Employee can only update progress of their own goals
  if (goal.employeeId !== requestingEmployeeId) {
    throw new AppError('Access denied. You can only update progress on your own goals.', 403, 'FORBIDDEN');
  }

  if (progress < 0 || progress > 100) {
    throw new AppError('Goal progress must be between 0% and 100%.', 400, 'BAD_REQUEST');
  }

  let status = goal.status;
  if (progress === 100) {
    status = GoalStatus.COMPLETED;
  } else if (progress > 0 && status === GoalStatus.NOT_STARTED) {
    status = GoalStatus.IN_PROGRESS;
  }

  return prisma.performanceGoal.update({
    where: { id: goalId },
    data: {
      progress,
      status,
    },
  });
}

export async function updateGoalService(
  goalId: string,
  data: Partial<{
    title: string;
    description: string;
    target: string;
    progress: number;
    status: GoalStatus;
    startDate: string;
    dueDate: string;
  }>,
  updatedByUserId: string
) {
  const goal = await prisma.performanceGoal.findUnique({ where: { id: goalId } });
  if (!goal) {
    throw new AppError('Performance goal not found.', 404, 'NOT_FOUND');
  }

  if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
    throw new AppError('Goal progress must be between 0% and 100%.', 400, 'BAD_REQUEST');
  }

  let status = data.status || goal.status;
  const progress = data.progress !== undefined ? data.progress : goal.progress;

  if (progress === 100) {
    status = GoalStatus.COMPLETED;
  } else if (progress > 0 && status === GoalStatus.NOT_STARTED) {
    status = GoalStatus.IN_PROGRESS;
  }

  return prisma.$transaction(async (tx) => {
    const updatedGoal = await tx.performanceGoal.update({
      where: { id: goalId },
      data: {
        ...(data.title && { title: data.title.trim() }),
        ...(data.description !== undefined && { description: data.description.trim() }),
        ...(data.target !== undefined && { target: data.target.trim() }),
        ...(data.progress !== undefined && { progress: data.progress }),
        status,
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.dueDate && { dueDate: new Date(data.dueDate) }),
      },
    });

    await tx.auditLog.create({
      data: {
        userId: updatedByUserId,
        action: 'UPDATE_PERFORMANCE_GOAL',
        entity: 'PerformanceGoal',
        entityId: goalId,
        details: `Updated performance goal ${goalId}`,
      },
    });

    return updatedGoal;
  });
}

// ==========================================
// PERFORMANCE REVIEW SERVICES
// ==========================================

export async function createReviewService(
  data: {
    employeeId: string;
    reviewPeriod: string;
    reviewerId?: string;
    status?: ReviewStatus;
  },
  createdByUserId: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: data.employeeId },
  });
  if (!employee) {
    throw new AppError('Employee profile not found.', 404, 'NOT_FOUND');
  }

  // Prevent duplicate performance review cycles for the same employee and period
  const existingReview = await prisma.performanceReview.findUnique({
    where: {
      employeeId_reviewPeriod: {
        employeeId: data.employeeId,
        reviewPeriod: data.reviewPeriod.trim(),
      },
    },
  });

  if (existingReview) {
    throw new AppError(
      `A performance review for employee ${employee.loginId} already exists for period '${data.reviewPeriod}'.`,
      409,
      'DUPLICATE_ENTRY'
    );
  }

  return prisma.$transaction(async (tx) => {
    const review = await tx.performanceReview.create({
      data: {
        employeeId: data.employeeId,
        reviewPeriod: data.reviewPeriod.trim(),
        reviewerId: data.reviewerId || createdByUserId,
        status: data.status || ReviewStatus.DRAFT,
      },
      include: {
        employee: { select: { id: true, loginId: true, firstName: true, lastName: true } },
        reviewer: { select: { id: true, email: true, role: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: createdByUserId,
        action: 'CREATE_PERFORMANCE_REVIEW',
        entity: 'PerformanceReview',
        entityId: review.id,
        details: `Initiated performance review for employee ${employee.loginId} for period ${data.reviewPeriod}`,
      },
    });

    return review;
  });
}

export async function getReviewsService(queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.PerformanceReviewWhereInput = {};
  if (queryParams.employeeId) {
    where.employeeId = queryParams.employeeId;
  }
  if (queryParams.reviewPeriod) {
    where.reviewPeriod = queryParams.reviewPeriod;
  }
  if (queryParams.status) {
    where.status = queryParams.status as ReviewStatus;
  }

  const [reviews, total] = await Promise.all([
    prisma.performanceReview.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        employee: { select: { id: true, loginId: true, firstName: true, lastName: true, department: true, designation: true } },
        reviewer: { select: { id: true, email: true } },
      },
    }),
    prisma.performanceReview.count({ where }),
  ]);

  return {
    data: reviews,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getEmployeeOwnReviewsService(employeeId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.PerformanceReviewWhereInput = { employeeId };
  if (queryParams.status) {
    where.status = queryParams.status as ReviewStatus;
  }

  const [reviews, total] = await Promise.all([
    prisma.performanceReview.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, email: true } },
      },
    }),
    prisma.performanceReview.count({ where }),
  ]);

  return {
    data: reviews,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getEmployeeOwnReviewByIdService(employeeId: string, reviewId: string) {
  const review = await prisma.performanceReview.findUnique({
    where: { id: reviewId },
    include: {
      employee: { select: { id: true, loginId: true, firstName: true, lastName: true, department: true, designation: true } },
      reviewer: { select: { id: true, email: true } },
    },
  });

  if (!review) {
    throw new AppError('Performance review not found.', 404, 'NOT_FOUND');
  }

  // IDOR Protection: Employee can only view their own review
  if (review.employeeId !== employeeId) {
    throw new AppError('Access denied. You do not have permission to access this performance review.', 403, 'FORBIDDEN');
  }

  return review;
}

export async function submitSelfAssessmentService(
  reviewId: string,
  selfAssessment: string,
  requestingEmployeeId: string
) {
  const review = await prisma.performanceReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError('Performance review not found.', 404, 'NOT_FOUND');
  }

  // IDOR Protection: Employee can only update self-assessment on their own review
  if (review.employeeId !== requestingEmployeeId) {
    throw new AppError('Access denied. You can only submit a self-assessment for your own performance review.', 403, 'FORBIDDEN');
  }

  if (review.status === ReviewStatus.COMPLETED) {
    throw new AppError('Cannot update self-assessment on a completed performance review.', 400, 'REVIEW_COMPLETED');
  }

  return prisma.performanceReview.update({
    where: { id: reviewId },
    data: {
      selfAssessment: selfAssessment.trim(),
      status: ReviewStatus.SELF_ASSESSMENT,
    },
  });
}

export async function evaluateReviewService(
  reviewId: string,
  data: {
    overallRating: number;
    reviewerFeedback: string;
    strengths?: string;
    improvementAreas?: string;
    status?: ReviewStatus;
  },
  reviewerUserId: string
) {
  const review = await prisma.performanceReview.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError('Performance review not found.', 404, 'NOT_FOUND');
  }

  if (data.overallRating < 1.0 || data.overallRating > 5.0) {
    throw new AppError('Overall performance rating must be between 1.0 and 5.0.', 400, 'BAD_REQUEST');
  }

  return prisma.$transaction(async (tx) => {
    const updatedReview = await tx.performanceReview.update({
      where: { id: reviewId },
      data: {
        reviewerId: reviewerUserId,
        overallRating: data.overallRating,
        reviewerFeedback: data.reviewerFeedback.trim(),
        strengths: data.strengths?.trim(),
        improvementAreas: data.improvementAreas?.trim(),
        reviewDate: new Date(),
        status: data.status || ReviewStatus.COMPLETED,
      },
      include: {
        employee: { select: { id: true, loginId: true, firstName: true, lastName: true } },
        reviewer: { select: { id: true, email: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId: reviewerUserId,
        action: 'EVALUATE_PERFORMANCE_REVIEW',
        entity: 'PerformanceReview',
        entityId: reviewId,
        details: `Evaluated performance review for employee ${updatedReview.employee.loginId}. Rating: ${data.overallRating}/5.0`,
      },
    });

    return updatedReview;
  });
}

export async function getEmployeePerformanceHistoryService(employeeId: string, queryParams: any) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { id: true, loginId: true, firstName: true, lastName: true, department: true, designation: true },
  });

  if (!employee) {
    throw new AppError('Employee profile not found.', 404, 'NOT_FOUND');
  }

  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const [reviews, totalReviews, goals] = await Promise.all([
    prisma.performanceReview.findMany({
      where: { employeeId, status: ReviewStatus.COMPLETED },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reviewer: { select: { id: true, email: true } },
      },
    }),
    prisma.performanceReview.count({ where: { employeeId, status: ReviewStatus.COMPLETED } }),
    prisma.performanceGoal.findMany({
      where: { employeeId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return {
    employee,
    goals,
    reviews: {
      data: reviews,
      meta: buildPaginationMeta(page, limit, totalReviews),
    },
  };
}
