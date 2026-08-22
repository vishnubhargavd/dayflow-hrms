import { prisma } from '../../config/database';
import { AppError } from '../../middleware/error.middleware';
import { parsePaginationParams, buildPaginationMeta } from '../../utils/pagination.util';
import { SalaryComponentType, PayrollStatus, Prisma } from '@prisma/client';

// ==========================================
// SALARY COMPUTATION HELPER FUNCTIONS
// ==========================================

export interface ComponentBreakdown {
  componentId: string;
  name: string;
  type: SalaryComponentType;
  amount: number;
}

export interface PayrollCalculationResult {
  baseSalary: number;
  totalEarnings: number;
  totalDeductions: number;
  grossSalary: number;
  netSalary: number;
  earningsBreakdown: ComponentBreakdown[];
  deductionsBreakdown: ComponentBreakdown[];
}

/**
 * Calculates earnings, deductions, gross salary, and net salary for a given base salary and structure items.
 */
export function calculateSalaryStructure(
  baseSalary: number,
  items: Array<{ amount: number; component: { id: string; name: string; type: SalaryComponentType } }>
): PayrollCalculationResult {
  let totalEarnings = 0;
  let totalDeductions = 0;

  const earningsBreakdown: ComponentBreakdown[] = [];
  const deductionsBreakdown: ComponentBreakdown[] = [];

  for (const item of items) {
    if (item.component.type === SalaryComponentType.EARNING) {
      totalEarnings += item.amount;
      earningsBreakdown.push({
        componentId: item.component.id,
        name: item.component.name,
        type: item.component.type,
        amount: item.amount,
      });
    } else if (item.component.type === SalaryComponentType.DEDUCTION) {
      totalDeductions += item.amount;
      deductionsBreakdown.push({
        componentId: item.component.id,
        name: item.component.name,
        type: item.component.type,
        amount: item.amount,
      });
    }
  }

  const grossSalary = baseSalary + totalEarnings;
  const netSalary = Math.max(0, grossSalary - totalDeductions);

  return {
    baseSalary,
    totalEarnings,
    totalDeductions,
    grossSalary,
    netSalary,
    earningsBreakdown,
    deductionsBreakdown,
  };
}

// ==========================================
// SALARY COMPONENT SERVICES
// ==========================================

export async function createSalaryComponentService(data: {
  name: string;
  type: SalaryComponentType;
  description?: string;
  isTaxable?: boolean;
  isActive?: boolean;
}) {
  const existing = await prisma.salaryComponent.findUnique({
    where: { name: data.name.trim() },
  });

  if (existing) {
    throw new AppError(`Salary component with name '${data.name}' already exists.`, 409, 'DUPLICATE_ENTRY');
  }

  return prisma.salaryComponent.create({
    data: {
      name: data.name.trim(),
      type: data.type,
      description: data.description,
      isTaxable: data.isTaxable ?? true,
      isActive: data.isActive ?? true,
    },
  });
}

export async function getSalaryComponentsService() {
  return prisma.salaryComponent.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function updateSalaryComponentService(
  id: string,
  data: Partial<{
    name: string;
    type: SalaryComponentType;
    description: string;
    isTaxable: boolean;
    isActive: boolean;
  }>
) {
  const component = await prisma.salaryComponent.findUnique({ where: { id } });
  if (!component) {
    throw new AppError('Salary component not found.', 404, 'NOT_FOUND');
  }

  if (data.name && data.name.trim() !== component.name) {
    const existing = await prisma.salaryComponent.findUnique({
      where: { name: data.name.trim() },
    });
    if (existing) {
      throw new AppError(`Salary component with name '${data.name}' already exists.`, 409, 'DUPLICATE_ENTRY');
    }
  }

  return prisma.salaryComponent.update({
    where: { id },
    data: {
      ...(data.name && { name: data.name.trim() }),
      ...(data.type && { type: data.type }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.isTaxable !== undefined && { isTaxable: data.isTaxable }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
  });
}

// ==========================================
// SALARY STRUCTURE & HISTORY SERVICES
// ==========================================

export async function assignSalaryStructureService(
  data: {
    employeeId: string;
    baseSalary: number;
    effectiveDate?: string;
    reason?: string;
    items: Array<{ salaryComponentId: string; amount: number }>;
  },
  changedByUserId: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: data.employeeId },
  });
  if (!employee) {
    throw new AppError('Employee record not found.', 404, 'NOT_FOUND');
  }

  // Validate component IDs
  const componentIds = data.items.map((i) => i.salaryComponentId);
  if (componentIds.length > 0) {
    const existingComponents = await prisma.salaryComponent.findMany({
      where: { id: { in: componentIds }, isActive: true },
    });
    if (existingComponents.length !== componentIds.length) {
      throw new AppError('One or more specified salary components are invalid or inactive.', 400, 'BAD_REQUEST');
    }
  }

  // Fetch existing structure for history calculation
  const existingStructure = await prisma.salaryStructure.findUnique({
    where: { employeeId: data.employeeId },
    include: {
      items: {
        include: { salaryComponent: true },
      },
    },
  });

  let previousBaseSalary: number | null = null;
  let previousNetSalary: number | null = null;

  if (existingStructure) {
    previousBaseSalary = existingStructure.baseSalary;
    const oldCalc = calculateSalaryStructure(
      existingStructure.baseSalary,
      existingStructure.items.map((i) => ({ amount: i.amount, component: i.salaryComponent }))
    );
    previousNetSalary = oldCalc.netSalary;
  }

  // Fetch component details for new calculation
  const components = await prisma.salaryComponent.findMany({
    where: { id: { in: componentIds } },
  });
  const componentMap = new Map(components.map((c) => [c.id, c]));

  const newCalc = calculateSalaryStructure(
    data.baseSalary,
    data.items.map((i) => ({
      amount: i.amount,
      component: componentMap.get(i.salaryComponentId)!,
    }))
  );

  const effectiveDate = data.effectiveDate ? new Date(data.effectiveDate) : new Date();

  return prisma.$transaction(async (tx) => {
    // 1. Delete existing structure items if structure exists
    if (existingStructure) {
      await tx.salaryStructureItem.deleteMany({
        where: { salaryStructureId: existingStructure.id },
      });
    }

    // 2. Upsert SalaryStructure
    const salaryStructure = await tx.salaryStructure.upsert({
      where: { employeeId: data.employeeId },
      update: {
        baseSalary: data.baseSalary,
        effectiveDate,
        items: {
          create: data.items.map((item) => ({
            salaryComponentId: item.salaryComponentId,
            amount: item.amount,
          })),
        },
      },
      create: {
        employeeId: data.employeeId,
        baseSalary: data.baseSalary,
        effectiveDate,
        items: {
          create: data.items.map((item) => ({
            salaryComponentId: item.salaryComponentId,
            amount: item.amount,
          })),
        },
      },
      include: {
        items: {
          include: { salaryComponent: true },
        },
      },
    });

    // 3. Create SalaryHistory record
    const history = await tx.salaryHistory.create({
      data: {
        employeeId: data.employeeId,
        previousBaseSalary,
        newBaseSalary: data.baseSalary,
        previousNetSalary,
        newNetSalary: newCalc.netSalary,
        effectiveDate,
        reason: data.reason || 'Salary structure updated',
        changedById: changedByUserId,
      },
    });

    // 4. Create Audit Log
    await tx.auditLog.create({
      data: {
        userId: changedByUserId,
        action: 'UPDATE_SALARY_STRUCTURE',
        entity: 'SalaryStructure',
        entityId: salaryStructure.id,
        details: `Updated salary structure for employee ${employee.loginId}. Base salary: ${data.baseSalary}, Net: ${newCalc.netSalary}`,
      },
    });

    return {
      salaryStructure,
      history,
      calculation: newCalc,
    };
  });
}

export async function getSalaryStructureService(employeeId: string) {
  const structure = await prisma.salaryStructure.findUnique({
    where: { employeeId },
    include: {
      employee: { select: { id: true, loginId: true, firstName: true, lastName: true } },
      items: {
        include: { salaryComponent: true },
      },
    },
  });

  if (!structure) {
    throw new AppError('Salary structure not assigned for this employee.', 404, 'NOT_FOUND');
  }

  const calculation = calculateSalaryStructure(
    structure.baseSalary,
    structure.items.map((i) => ({ amount: i.amount, component: i.salaryComponent }))
  );

  return { structure, calculation };
}

export async function getSalaryHistoryService(employeeId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const [history, total] = await Promise.all([
    prisma.salaryHistory.findMany({
      where: { employeeId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        changedBy: { select: { id: true, email: true, role: true } },
      },
    }),
    prisma.salaryHistory.count({ where: { employeeId } }),
  ]);

  return {
    data: history,
    meta: buildPaginationMeta(page, limit, total),
  };
}

// ==========================================
// PAYROLL PROCESSING & PAYSLIP SERVICES
// ==========================================

export async function processPayrollService(
  data: {
    employeeId: string;
    month: number;
    year: number;
    paymentDate?: string;
    attendanceData?: {
      workingDays?: number;
      presentDays?: number;
      paidLeaveDays?: number;
      unpaidLeaveDays?: number;
      absentDays?: number;
      overtimeHours?: number;
    };
  },
  processedByUserId: string
) {
  const employee = await prisma.employee.findUnique({
    where: { id: data.employeeId },
  });
  if (!employee) {
    throw new AppError('Employee record not found.', 404, 'NOT_FOUND');
  }

  // Check for duplicate payroll record for the same employee and period
  const existingRecord = await prisma.payrollRecord.findUnique({
    where: {
      employeeId_month_year: {
        employeeId: data.employeeId,
        month: data.month,
        year: data.year,
      },
    },
  });

  if (existingRecord) {
    throw new AppError(
      `A payroll record already exists for employee ${employee.loginId} for period ${data.month}/${data.year}.`,
      409,
      'DUPLICATE_ENTRY'
    );
  }

  // Fetch employee salary structure
  const structure = await prisma.salaryStructure.findUnique({
    where: { employeeId: data.employeeId },
    include: {
      items: {
        include: { salaryComponent: true },
      },
    },
  });

  if (!structure) {
    throw new AppError(
      `Cannot process payroll. Employee ${employee.loginId} does not have an active salary structure assigned.`,
      400,
      'NO_SALARY_STRUCTURE'
    );
  }

  const calculation = calculateSalaryStructure(
    structure.baseSalary,
    structure.items.map((i) => ({ amount: i.amount, component: i.salaryComponent }))
  );

  const payslipNumber = `PAY-${data.year}${String(data.month).padStart(2, '0')}-${employee.loginId}`;

  const breakdownJson = JSON.stringify({
    baseSalary: calculation.baseSalary,
    totalEarnings: calculation.totalEarnings,
    totalDeductions: calculation.totalDeductions,
    grossSalary: calculation.grossSalary,
    netSalary: calculation.netSalary,
    earnings: calculation.earningsBreakdown,
    deductions: calculation.deductionsBreakdown,
    attendanceSummary: data.attendanceData || null,
  });

  const paymentDate = data.paymentDate ? new Date(data.paymentDate) : null;

  return prisma.$transaction(async (tx) => {
    // 1. Create Payroll Record
    const payrollRecord = await tx.payrollRecord.create({
      data: {
        employeeId: data.employeeId,
        month: data.month,
        year: data.year,
        baseSalary: calculation.baseSalary,
        totalEarnings: calculation.totalEarnings,
        totalDeductions: calculation.totalDeductions,
        grossSalary: calculation.grossSalary,
        netSalary: calculation.netSalary,
        status: PayrollStatus.DRAFT,
        paymentDate,
      },
    });

    // 2. Create Payslip
    const payslip = await tx.payslip.create({
      data: {
        payrollRecordId: payrollRecord.id,
        employeeId: data.employeeId,
        payslipNumber,
        month: data.month,
        year: data.year,
        basicSalary: calculation.baseSalary,
        allowances: calculation.totalEarnings,
        deductions: calculation.totalDeductions,
        netSalary: calculation.netSalary,
        status: PayrollStatus.DRAFT,
        paymentDate,
        breakdownJson,
      },
    });

    // 3. Audit Log
    await tx.auditLog.create({
      data: {
        userId: processedByUserId,
        action: 'PROCESS_PAYROLL',
        entity: 'PayrollRecord',
        entityId: payrollRecord.id,
        details: `Processed payroll for employee ${employee.loginId} for period ${data.month}/${data.year}. Net salary: ${calculation.netSalary}`,
      },
    });

    return { payrollRecord, payslip, calculation };
  });
}

export async function getPayrollRecordsService(queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.PayrollRecordWhereInput = {};

  if (queryParams.employeeId) {
    where.employeeId = queryParams.employeeId;
  }
  if (queryParams.month) {
    where.month = parseInt(queryParams.month, 10);
  }
  if (queryParams.year) {
    where.year = parseInt(queryParams.year, 10);
  }
  if (queryParams.status) {
    where.status = queryParams.status as PayrollStatus;
  }

  const [records, total] = await Promise.all([
    prisma.payrollRecord.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ year: 'desc' }, { month: 'desc' }, { createdAt: 'desc' }],
      include: {
        employee: { select: { id: true, loginId: true, firstName: true, lastName: true, department: true } },
        payslip: { select: { id: true, payslipNumber: true, status: true } },
      },
    }),
    prisma.payrollRecord.count({ where }),
  ]);

  return {
    data: records,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function updatePayrollStatusService(
  payrollRecordId: string,
  status: PayrollStatus,
  paymentDate?: string,
  updatedByUserId?: string
) {
  const record = await prisma.payrollRecord.findUnique({
    where: { id: payrollRecordId },
    include: { payslip: true },
  });

  if (!record) {
    throw new AppError('Payroll record not found.', 404, 'NOT_FOUND');
  }

  const parsedPaymentDate = paymentDate ? new Date(paymentDate) : status === PayrollStatus.PAID ? new Date() : record.paymentDate;

  return prisma.$transaction(async (tx) => {
    const updatedRecord = await tx.payrollRecord.update({
      where: { id: payrollRecordId },
      data: {
        status,
        paymentDate: parsedPaymentDate,
      },
    });

    if (record.payslip) {
      await tx.payslip.update({
        where: { id: record.payslip.id },
        data: {
          status,
          paymentDate: parsedPaymentDate,
        },
      });
    }

    if (updatedByUserId) {
      await tx.auditLog.create({
        data: {
          userId: updatedByUserId,
          action: 'UPDATE_PAYROLL_STATUS',
          entity: 'PayrollRecord',
          entityId: payrollRecordId,
          details: `Updated payroll status to ${status} for record ${payrollRecordId}`,
        },
      });
    }

    return updatedRecord;
  });
}

// ==========================================
// EMPLOYEE SELF-SERVICE PAYROLL SERVICES (IDOR PROTECTED)
// ==========================================

export async function getEmployeeOwnPayrollService(employeeId: string) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { id: true, loginId: true, firstName: true, lastName: true },
  });
  if (!employee) {
    throw new AppError('Employee profile not found.', 404, 'NOT_FOUND');
  }

  const structure = await prisma.salaryStructure.findUnique({
    where: { employeeId },
    include: {
      items: {
        include: { salaryComponent: true },
      },
    },
  });

  const latestPayroll = await prisma.payrollRecord.findFirst({
    where: { employeeId },
    orderBy: [{ year: 'desc' }, { month: 'desc' }],
    include: {
      payslip: { select: { id: true, payslipNumber: true, status: true } },
    },
  });

  let calculation: PayrollCalculationResult | null = null;
  if (structure) {
    calculation = calculateSalaryStructure(
      structure.baseSalary,
      structure.items.map((i) => ({ amount: i.amount, component: i.salaryComponent }))
    );
  }

  return {
    employee,
    structure: structure ? { ...structure, calculation } : null,
    latestPayroll,
  };
}

export async function getEmployeeOwnHistoryService(employeeId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.PayrollRecordWhereInput = { employeeId };

  if (queryParams.month) {
    where.month = parseInt(queryParams.month, 10);
  }
  if (queryParams.year) {
    where.year = parseInt(queryParams.year, 10);
  }
  if (queryParams.status) {
    where.status = queryParams.status as PayrollStatus;
  }

  const [records, total] = await Promise.all([
    prisma.payrollRecord.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      select: {
        id: true,
        month: true,
        year: true,
        baseSalary: true,
        totalEarnings: true,
        totalDeductions: true,
        grossSalary: true,
        netSalary: true,
        status: true,
        paymentDate: true,
        createdAt: true,
        payslip: { select: { id: true, payslipNumber: true } },
      },
    }),
    prisma.payrollRecord.count({ where }),
  ]);

  return {
    data: records,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getEmployeeOwnPayslipsService(employeeId: string, queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.PayslipWhereInput = { employeeId };

  if (queryParams.month) {
    where.month = parseInt(queryParams.month, 10);
  }
  if (queryParams.year) {
    where.year = parseInt(queryParams.year, 10);
  }

  const [payslips, total] = await Promise.all([
    prisma.payslip.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ year: 'desc' }, { month: 'desc' }],
      select: {
        id: true,
        payslipNumber: true,
        month: true,
        year: true,
        basicSalary: true,
        allowances: true,
        deductions: true,
        netSalary: true,
        status: true,
        paymentDate: true,
        createdAt: true,
      },
    }),
    prisma.payslip.count({ where }),
  ]);

  return {
    data: payslips,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getEmployeeOwnPayslipByIdService(employeeId: string, payslipId: string) {
  const payslip = await prisma.payslip.findUnique({
    where: { id: payslipId },
    include: {
      employee: {
        select: {
          id: true,
          loginId: true,
          firstName: true,
          lastName: true,
          department: { select: { name: true } },
          designation: { select: { title: true } },
          bankName: true,
          accountNumber: true,
          ifscCode: true,
          panNumber: true,
        },
      },
      payrollRecord: true,
    },
  });

  if (!payslip) {
    throw new AppError('Payslip not found.', 404, 'NOT_FOUND');
  }

  // Enforce strict ownership / IDOR check
  if (payslip.employeeId !== employeeId) {
    throw new AppError('Access denied. You do not have permission to access this payslip.', 403, 'FORBIDDEN');
  }

  let breakdown = null;
  if (payslip.breakdownJson) {
    try {
      breakdown = JSON.parse(payslip.breakdownJson);
    } catch {
      breakdown = null;
    }
  }

  return {
    ...payslip,
    breakdown,
  };
}
