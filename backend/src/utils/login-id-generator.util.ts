import { Prisma, PrismaClient } from '@prisma/client';

export function sanitizeNamePrefix(name: string, fallbackChar = 'X'): string {
  const clean = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
  if (clean.length === 0) return fallbackChar + fallbackChar;
  if (clean.length === 1) return clean + fallbackChar;
  return clean.substring(0, 2);
}

export async function generateConcurrencySafeLoginId(
  tx: Prisma.TransactionClient | PrismaClient,
  firstName: string,
  lastName: string,
  joiningYear: number,
  companyCode = 'OI'
): Promise<string> {
  const firstPrefix = sanitizeNamePrefix(firstName);
  const lastPrefix = sanitizeNamePrefix(lastName);
  const nameComponent = `${firstPrefix}${lastPrefix}`;

  // Atomic increment or creation of sequence counter for the specific company & year
  const sequenceRecord = await tx.loginSequence.upsert({
    where: {
      companyCode_year: {
        companyCode,
        year: joiningYear,
      },
    },
    update: {
      currentSequence: {
        increment: 1,
      },
    },
    create: {
      companyCode,
      year: joiningYear,
      currentSequence: 1,
    },
  });

  const formattedSequence = String(sequenceRecord.currentSequence).padStart(4, '0');
  return `${companyCode}${nameComponent}${joiningYear}${formattedSequence}`;
}
