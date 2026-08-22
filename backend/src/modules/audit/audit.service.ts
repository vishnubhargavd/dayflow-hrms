import { prisma } from '../../config/database';
import { parsePaginationParams, buildPaginationMeta } from '../../utils/pagination.util';

export async function logAuditEvent(
  userId: string | null,
  action: string,
  entity: string,
  entityId?: string,
  details?: string,
  ipAddress?: string
) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
        ipAddress,
      },
    });
  } catch (error) {
    console.error('Failed to record audit log:', error);
  }
}

export async function getAuditLogsService(queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { loginId: true, email: true, role: true } },
      },
    }),
    prisma.auditLog.count(),
  ]);

  return {
    data: logs,
    meta: buildPaginationMeta(page, limit, total),
  };
}
