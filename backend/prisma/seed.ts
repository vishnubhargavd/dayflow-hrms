import { PrismaClient, Role, AccountStatus, EmployeeStatus, Gender, MaritalStatus, LeaveCategory, HelpdeskCategory, HelpdeskPriority, HelpdeskStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Dayflow HRMS database seeding...');

  // 1. Seed Departments
  const engDept = await prisma.department.upsert({
    where: { code: 'ENG' },
    update: {},
    create: {
      code: 'ENG',
      name: 'Engineering',
      description: 'Software development, architecture, and technology operations',
    },
  });

  const hrDept = await prisma.department.upsert({
    where: { code: 'HR' },
    update: {},
    create: {
      code: 'HR',
      name: 'Human Resources',
      description: 'Talent management, employee relations, and HR operations',
    },
  });

  // 2. Seed Designations
  const sdeDesig = await prisma.designation.upsert({
    where: { title: 'Senior Software Engineer' },
    update: {},
    create: {
      title: 'Senior Software Engineer',
      departmentId: engDept.id,
    },
  });

  const hrDesig = await prisma.designation.upsert({
    where: { title: 'HR Lead' },
    update: {},
    create: {
      title: 'HR Lead',
      departmentId: hrDept.id,
    },
  });

  // 3. Password Hashes
  const adminPasswordHash = await bcrypt.hash('AdminPassword123!', 10);
  const hrPasswordHash = await bcrypt.hash('HrPassword123!', 10);
  const empPasswordHash = await bcrypt.hash('EmployeePassword123!', 10);

  // 4. Seed Admin User & Profile
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@dayflow.com' },
    update: {},
    create: {
      loginId: 'OIADMN20260001',
      email: 'admin@dayflow.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      accountStatus: AccountStatus.ACTIVE,
      requiresPasswordChange: false,
      verificationStatus: true,
      employee: {
        create: {
          loginId: 'OIADMN20260001',
          firstName: 'System',
          lastName: 'Admin',
          phone: '+91 9876543210',
          personalEmail: 'admin.personal@dayflow.com',
          dateOfBirth: new Date('1990-01-01'),
          gender: Gender.MALE,
          maritalStatus: MaritalStatus.SINGLE,
          nationality: 'Indian',
          address: 'Dayflow Tech Park, Sector 5',
          joiningYear: 2026,
          dateOfJoining: new Date('2026-01-01'),
          employeeStatus: EmployeeStatus.PERMANENT,
          departmentId: engDept.id,
          designationId: sdeDesig.id,
        },
      },
    },
  });

  // 5. Seed HR User & Profile
  const hrUser = await prisma.user.upsert({
    where: { email: 'hr@dayflow.com' },
    update: {},
    create: {
      loginId: 'OIHRMG20260001',
      email: 'hr@dayflow.com',
      passwordHash: hrPasswordHash,
      role: Role.HR,
      accountStatus: AccountStatus.ACTIVE,
      requiresPasswordChange: false,
      verificationStatus: true,
      employee: {
        create: {
          loginId: 'OIHRMG20260001',
          firstName: 'Sarah',
          lastName: 'Officer',
          phone: '+91 9876543211',
          personalEmail: 'sarah.hr@dayflow.com',
          dateOfBirth: new Date('1992-05-15'),
          gender: Gender.FEMALE,
          maritalStatus: MaritalStatus.MARRIED,
          nationality: 'Indian',
          address: 'Dayflow Heights, Block B',
          joiningYear: 2026,
          dateOfJoining: new Date('2026-01-15'),
          employeeStatus: EmployeeStatus.PERMANENT,
          departmentId: hrDept.id,
          designationId: hrDesig.id,
        },
      },
    },
  });

  // 6. Seed Employee User & Profile
  const empUser = await prisma.user.upsert({
    where: { email: 'employee@dayflow.com' },
    update: {},
    create: {
      loginId: 'OIJODO20260001',
      email: 'employee@dayflow.com',
      passwordHash: empPasswordHash,
      role: Role.EMPLOYEE,
      accountStatus: AccountStatus.ACTIVE,
      requiresPasswordChange: false,
      verificationStatus: true,
      employee: {
        create: {
          loginId: 'OIJODO20260001',
          firstName: 'John',
          lastName: 'Doe',
          phone: '+91 9876543212',
          personalEmail: 'john.doe@gmail.com',
          dateOfBirth: new Date('1995-08-20'),
          gender: Gender.MALE,
          maritalStatus: MaritalStatus.SINGLE,
          nationality: 'Indian',
          address: 'Green Valley Apartments, Apt 402',
          joiningYear: 2026,
          dateOfJoining: new Date('2026-02-01'),
          employeeStatus: EmployeeStatus.PROBATION,
          departmentId: engDept.id,
          designationId: sdeDesig.id,
        },
      },
    },
  });

  // 7. Seed Initial Login Sequences
  await prisma.loginSequence.upsert({
    where: { companyCode_year: { companyCode: 'OI', year: 2026 } },
    update: { currentSequence: 3 },
    create: {
      companyCode: 'OI',
      year: 2026,
      currentSequence: 3,
    },
  });

  // 8. Seed Leave Types
  const paidType = await prisma.leaveType.upsert({
    where: { code: 'PAID' },
    update: {},
    create: {
      name: 'Paid Leave',
      code: 'PAID',
      category: LeaveCategory.PAID,
      maxDaysPerYear: 18,
      description: 'Standard annual paid time off allocation',
      isActive: true,
    },
  });

  const sickType = await prisma.leaveType.upsert({
    where: { code: 'SICK' },
    update: {},
    create: {
      name: 'Sick Leave',
      code: 'SICK',
      category: LeaveCategory.SICK,
      maxDaysPerYear: 12,
      description: 'Medical and health related leave allocation',
      isActive: true,
    },
  });

  const casualType = await prisma.leaveType.upsert({
    where: { code: 'CASUAL' },
    update: {},
    create: {
      name: 'Casual Leave',
      code: 'CASUAL',
      category: LeaveCategory.CASUAL,
      maxDaysPerYear: 6,
      description: 'Short term urgent or personal leave allocation',
      isActive: true,
    },
  });

  const unpaidType = await prisma.leaveType.upsert({
    where: { code: 'UNPAID' },
    update: {},
    create: {
      name: 'Unpaid Leave',
      code: 'UNPAID',
      category: LeaveCategory.UNPAID,
      maxDaysPerYear: 0,
      description: 'Leave without pay for extended absence',
      isActive: true,
    },
  });

  // 9. Seed Helpdesk Request
  if (empUser.employee) {
    await prisma.helpdeskRequest.upsert({
      where: { ticketNumber: 'HD-2026-0001' },
      update: {},
      create: {
        ticketNumber: 'HD-2026-0001',
        employeeId: empUser.employee.id,
        category: HelpdeskCategory.ATTENDANCE_CORRECTION,
        priority: HelpdeskPriority.MEDIUM,
        subject: 'Checkout missing on August 21',
        description: 'My checkout time was not recorded due to biometric scanner glitch.',
        status: HelpdeskStatus.OPEN,
      },
    });
  }

  console.log('✅ Dayflow HRMS Database Seeded Successfully!');
  console.log('   Admin Creds:    loginId: OIADMN20260001 / Pass: AdminPassword123!');
  console.log('   HR Creds:       loginId: OIHRMG20260001 / Pass: HrPassword123!');
  console.log('   Employee Creds: loginId: OIJODO20260001 / Pass: EmployeePassword123!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
