import { sanitizeNamePrefix, generateConcurrencySafeLoginId } from '../src/utils/login-id-generator.util';

describe('Login ID Generator Utilities', () => {
  it('should sanitize first and last names correctly', () => {
    expect(sanitizeNamePrefix('John')).toBe('JO');
    expect(sanitizeNamePrefix('Doe')).toBe('DO');
    expect(sanitizeNamePrefix('A')).toBe('AX');
    expect(sanitizeNamePrefix('')).toBe('XX');
    expect(sanitizeNamePrefix('O\'Connor')).toBe('OC');
  });

  it('should generate properly formatted Login ID with sequence', async () => {
    // Mock Prisma Transaction Client
    const mockTx: any = {
      loginSequence: {
        upsert: jest.fn().mockResolvedValue({
          companyCode: 'OI',
          year: 2026,
          currentSequence: 1,
        }),
      },
    };

    const loginId = await generateConcurrencySafeLoginId(mockTx, 'John', 'Doe', 2026, 'OI');

    expect(loginId).toBe('OIJODO20260001');
    expect(mockTx.loginSequence.upsert).toHaveBeenCalledWith({
      where: {
        companyCode_year: {
          companyCode: 'OI',
          year: 2026,
        },
      },
      update: {
        currentSequence: {
          increment: 1,
        },
      },
      create: {
        companyCode: 'OI',
        year: 2026,
        currentSequence: 1,
      },
    });
  });

  it('should pad higher sequences to 4 digits correctly', async () => {
    const mockTx: any = {
      loginSequence: {
        upsert: jest.fn().mockResolvedValue({
          companyCode: 'OI',
          year: 2026,
          currentSequence: 42,
        }),
      },
    };

    const loginId = await generateConcurrencySafeLoginId(mockTx, 'Sarah', 'Smith', 2026, 'OI');
    expect(loginId).toBe('OISASM20260042');
  });
});
