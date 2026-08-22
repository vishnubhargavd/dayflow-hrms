import { parsePaginationParams, buildPaginationMeta } from '../src/utils/pagination.util';

describe('Pagination Utilities', () => {
  it('should parse valid pagination parameters', () => {
    const result = parsePaginationParams('2', '10');

    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.skip).toBe(10);
  });

  it('should apply fallback defaults for invalid parameters', () => {
    const result = parsePaginationParams('-5', 'invalid');

    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.skip).toBe(0);
  });

  it('should cap limit to maximum allowable limit', () => {
    const result = parsePaginationParams('1', '500', 20, 100);

    expect(result.limit).toBe(100);
  });

  it('should calculate metadata correctly', () => {
    const meta = buildPaginationMeta(1, 20, 45);

    expect(meta.page).toBe(1);
    expect(meta.limit).toBe(20);
    expect(meta.total).toBe(45);
    expect(meta.totalPages).toBe(3);
  });
});
