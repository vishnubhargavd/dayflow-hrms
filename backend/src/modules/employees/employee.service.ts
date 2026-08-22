import { prisma } from '../../config/database';
import { generateConcurrencySafeLoginId } from '../../utils/login-id-generator.util';
import { generateTempPassword, hashPassword } from '../../utils/password.util';
import { buildPaginationMeta, parsePaginationParams } from '../../utils/pagination.util';
import { AppError } from '../../middleware/error.middleware';
import { Role, Prisma, AccountStatus } from '@prisma/client';
import { env } from '../../config/env';

export async function createEmployeeService(data: any, createdByUserId: string) {
  const joiningDate = data.dateOfJoining ? new Date(data.dateOfJoining) : new Date();
  const joiningYear = joiningDate.getFullYear();

  // Check email uniqueness
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email.toLowerCase().trim() },
  });
  if (existingUser) {
    throw new AppError('A user account with this email already exists.', 409, 'DUPLICATE_EMAIL');
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  // Execute in isolated Prisma transaction for concurrency safety on sequence generation
  const result = await prisma.$transaction(async (tx) => {
    // 1. Generate unique, concurrency-safe Login ID
    const loginId = await generateConcurrencySafeLoginId(
      tx,
      data.firstName,
      data.lastName,
      joiningYear,
      env.COMPANY_CODE
    );

    // 2. Create User record
    const user = await tx.user.create({
      data: {
        loginId,
        email: data.email.toLowerCase().trim(),
        passwordHash,
        role: data.role || Role.EMPLOYEE,
        accountStatus: AccountStatus.PENDING_FIRST_LOGIN,
        requiresPasswordChange: true,
      },
    });

    // 3. Create Employee Profile record
    const employee = await tx.employee.create({
      data: {
        userId: user.id,
        loginId,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone,
        personalEmail: data.personalEmail,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        gender: data.gender,
        maritalStatus: data.maritalStatus,
        nationality: data.nationality,
        address: data.address,
        joiningYear,
        dateOfJoining: joiningDate,
        employeeStatus: data.employeeStatus || 'PROBATION',
        departmentId: data.departmentId,
        designationId: data.designationId,
        managerId: data.managerId,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        ifscCode: data.ifscCode,
        panNumber: data.panNumber,
      },
    });

    // 4. Audit Log entry
    await tx.auditLog.create({
      data: {
        userId: createdByUserId,
        action: 'CREATE_EMPLOYEE',
        entity: 'Employee',
        entityId: employee.id,
        details: `Created employee ${loginId} (${data.firstName} ${data.lastName})`,
      },
    });

    return { user, employee, loginId };
  });

  // Return generated temporary credentials ONLY in creation response
  return {
    loginId: result.loginId,
    email: result.user.email,
    temporaryPassword: tempPassword,
    employeeId: result.employee.id,
    requiresPasswordChange: true,
  };
}

export async function getEmployeesService(queryParams: any) {
  const { page, limit, skip } = parsePaginationParams(queryParams.page, queryParams.limit);

  const where: Prisma.EmployeeWhereInput = {};

  if (queryParams.departmentId) {
    where.departmentId = queryParams.departmentId;
  }

  if (queryParams.status) {
    where.employeeStatus = queryParams.status;
  }

  if (queryParams.search) {
    const searchStr = queryParams.search.trim();
    where.OR = [
      { firstName: { contains: searchStr, mode: 'insensitive' } },
      { lastName: { contains: searchStr, mode: 'insensitive' } },
      { loginId: { contains: searchStr, mode: 'insensitive' } },
      { user: { email: { contains: searchStr, mode: 'insensitive' } } },
    ];
  }

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        loginId: true,
        firstName: true,
        lastName: true,
        joiningYear: true,
        dateOfJoining: true,
        employeeStatus: true,
        profilePicture: true,
        department: { select: { id: true, name: true, code: true } },
        designation: { select: { id: true, title: true } },
        manager: { select: { id: true, firstName: true, lastName: true } },
        user: { select: { email: true, role: true, accountStatus: true } },
        // Intentionally omitting bankName, accountNumber, ifscCode, panNumber to prevent data leaks
      },
    }),
    prisma.employee.count({ where }),
  ]);

  return {
    data: employees,
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function getEmployeeByIdService(employeeId: string, requestingUser: any) {
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
          accountStatus: true,
          createdAt: true,
        },
      },
      department: { select: { id: true, name: true, code: true } },
      designation: { select: { id: true, title: true } },
      manager: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!employee) {
    throw new AppError('Employee profile not found.', 404, 'NOT_FOUND');
  }

  // IDOR / Financial Data Access Control:
  // Only Admin, HR, or the employee themselves can view private financial data
  const isSelf = requestingUser.employeeId === employee.id || requestingUser.userId === employee.userId;
  const isPrivileged = requestingUser.role === Role.ADMIN || requestingUser.role === Role.HR;

  if (!isSelf && !isPrivileged) {
    // Strip sensitive private fields for non-owners/non-HR
    const { bankName, accountNumber, ifscCode, panNumber, ...safeEmployee } = employee;
    return safeEmployee;
  }

  return employee;
}
