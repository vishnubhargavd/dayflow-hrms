export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export function parsePaginationParams(
  queryPage?: string | number,
  queryLimit?: string | number,
  defaultLimit = 20,
  maxLimit = 100
): PaginationOptions {
  const page = Math.max(1, parseInt(String(queryPage || 1), 10) || 1);
  const rawLimit = parseInt(String(queryLimit || defaultLimit), 10) || defaultLimit;
  const limit = Math.min(maxLimit, Math.max(1, rawLimit));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function buildPaginationMeta(page: number, limit: number, total: number) {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    page,
    limit,
    total,
    totalPages,
  };
}
