import { prisma } from '../../config/database';
import { comparePassword, hashPassword } from '../../utils/password.util';
import { signToken } from '../../utils/jwt.util';
import { AppError } from '../../middleware/error.middleware';
import { AccountStatus, EmployeeStatus, Role } from '@prisma/client';

export async function loginService(loginIdOrEmail: string, password: string, ipAddress?: string) {
  // 1. Find user by email or loginId
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: loginIdOrEmail.toLowerCase().trim() },
        { loginId: loginIdOrEmail.toUpperCase().trim() },
      ],
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          department: { select: { name: true } },
          designation: { select: { title: true } },
        },
      },
    },
  });

  if (!user) {
    throw new AppError('Invalid credentials provided.', 401, 'INVALID_CREDENTIALS');
  }

  // 2. Check account status
  if (user.accountStatus === AccountStatus.INACTIVE || user.accountStatus === AccountStatus.SUSPENDED) {
    await prisma.loginAttempt.create({
      data: { userId: user.id, ipAddress, successful: false },
    });
    throw new AppError(`Account is ${user.accountStatus.toLowerCase()}. Contact HR.`, 403, 'ACCOUNT_DISABLED');
  }

  // 3. Verify password
  const isValidPassword = await comparePassword(password, user.passwordHash);
  if (!isValidPassword) {
    await prisma.loginAttempt.create({
      data: { userId: user.id, ipAddress, successful: false },
    });
    throw new AppError('Invalid credentials provided.', 401, 'INVALID_CREDENTIALS');
  }

  // 4. Log successful login
  await prisma.loginAttempt.create({
    data: { userId: user.id, ipAddress, successful: true },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  // 5. Generate JWT token
  const token = signToken({
    userId: user.id,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    employeeId: user.employee?.id,
    requiresPasswordChange: user.requiresPasswordChange,
  });

  return {
    token,
    user: {
      id: user.id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      requiresPasswordChange: user.requiresPasswordChange,
      employee: user.employee,
    },
  };
}

export async function registerService(fullName: string, email: string, password: string) {
  const cleanEmail = email.toLowerCase().trim();
  const existingUser = await prisma.user.findFirst({
    where: { email: cleanEmail },
  });

  if (existingUser) {
    throw new AppError('An account with this email already exists.', 400, 'USER_EXISTS');
  }

  const parts = fullName.trim().split(' ');
  const firstName = parts[0] || 'User';
  const lastName = parts.slice(1).join(' ') || '';

  const year = new Date().getFullYear();
  const count = await prisma.user.count();
  const sequenceStr = String(count + 1).padStart(4, '0');
  const loginId = `OIEMP${year}${sequenceStr}`;

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      loginId,
      email: cleanEmail,
      passwordHash,
      role: Role.EMPLOYEE,
      accountStatus: AccountStatus.ACTIVE,
      requiresPasswordChange: false,
      verificationStatus: true,
      employee: {
        create: {
          loginId,
          firstName,
          lastName,
          personalEmail: cleanEmail,
          joiningYear: year,
          dateOfJoining: new Date(),
          employeeStatus: EmployeeStatus.PROBATION,
        },
      },
    },
    include: {
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          department: { select: { name: true } },
          designation: { select: { title: true } },
        },
      },
    },
  });

  const token = signToken({
    userId: user.id,
    loginId: user.loginId,
    email: user.email,
    role: user.role,
    employeeId: user.employee?.id,
    requiresPasswordChange: user.requiresPasswordChange,
  });

  return {
    token,
    user: {
      id: user.id,
      loginId: user.loginId,
      email: user.email,
      role: user.role,
      accountStatus: user.accountStatus,
      requiresPasswordChange: user.requiresPasswordChange,
      employee: user.employee,
    },
  };
}

export async function changePasswordService(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User account not found.', 404, 'NOT_FOUND');
  }

  const isValidCurrent = await comparePassword(currentPassword, user.passwordHash);
  if (!isValidCurrent) {
    throw new AppError('Current password is incorrect.', 400, 'INVALID_PASSWORD');
  }

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: newHash,
      requiresPasswordChange: false,
      accountStatus: AccountStatus.ACTIVE,
    },
  });

  return { message: 'Password updated successfully.' };
}

export async function getCurrentUserService(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      loginId: true,
      email: true,
      role: true,
      accountStatus: true,
      requiresPasswordChange: true,
      createdAt: true,
      employee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          personalEmail: true,
          dateOfBirth: true,
          gender: true,
          joiningYear: true,
          dateOfJoining: true,
          employeeStatus: true,
          profilePicture: true,
          department: { select: { id: true, name: true, code: true } },
          designation: { select: { id: true, title: true } },
          manager: { select: { id: true, firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User profile not found.', 404, 'NOT_FOUND');
  }

  return user;
}
