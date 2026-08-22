import {
  Employee,
  TodayAttendance,
  LeaveRequest,
  SmartInsight,
  DynamicWageBreakdown,
  AttendanceRecord,
} from '../types';

const API_BASE = '/api/v1';

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    loginId: 'OIJODO20220001',
    firstName: 'John',
    lastName: 'Doe',
    personalEmail: 'john.doe@gmail.com',
    phone: '+91 98765 43210',
    company: 'Odoo India Technologies',
    location: 'Bangalore Campus, Floor 4',
    joiningYear: 2022,
    dateOfJoining: '2022-04-15',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    department: { id: 'd-1', name: 'Engineering', code: 'ENG' },
    designation: { id: 'des-1', title: 'Senior Backend Engineer' },
    jobTitle: 'Senior Backend Engineer',
    manager: 'Ameer Admin',
    user: { email: 'john.doe@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 65000,
    todayStatus: 'PRESENT',
    status: 'present',

    // Resume / Bio
    about: 'Passionate backend architect specializing in distributed systems, PostgreSQL, and high-throughput microservices.',
    whatILoveAboutJob: 'Solving challenging concurrency challenges and building resilient developer tooling.',
    interestsHobbies: 'Competitive chess, open-source contributing, cycling, and audio engineering.',
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Prisma ORM', 'Redis', 'Docker', 'Kubernetes'],
    certifications: ['AWS Certified Solutions Architect', 'PostgreSQL Advanced DBA Certified'],

    // Private Info
    dateOfBirth: '1996-06-12',
    residingAddress: 'Flat 402, Palm Meadows, Whitefield, Bangalore - 560066',
    nationality: 'Indian',
    gender: 'MALE',
    maritalStatus: 'SINGLE',

    // Bank & Statutory
    bankName: 'HDFC Bank',
    accountNumber: '50100482910394',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
    uanNumber: '101294820194',
    empCode: 'EMP-001',
  },
  {
    id: 'emp-2',
    loginId: 'OISASM20230002',
    firstName: 'Sarah',
    lastName: 'Smith',
    personalEmail: 'sarah.smith.design@gmail.com',
    phone: '+91 98765 43211',
    company: 'Odoo India Technologies',
    location: 'Mumbai Innovation Center',
    joiningYear: 2023,
    dateOfJoining: '2023-01-10',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    department: { id: 'd-2', name: 'Product Design', code: 'DES' },
    designation: { id: 'des-2', title: 'Lead UI/UX Designer' },
    jobTitle: 'Lead UI/UX Designer',
    manager: 'Ameer Admin',
    user: { email: 'sarah.smith@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 75000,
    todayStatus: 'PRESENT',
    status: 'present',

    about: 'Design systems lead creating intuitive human-computer interfaces with dark mode aesthetics and micro-interactions.',
    whatILoveAboutJob: 'Empowering enterprise users with sleek consumer-grade simplicity.',
    interestsHobbies: 'Typography, pottery, generative art, and hiking.',
    skills: ['Figma', 'Design Systems', 'Framer Motion', 'Tailwind CSS', 'User Research', 'Prototyping'],
    certifications: ['Nielsen Norman UX Master Certified', 'Google Interaction Design Specialization'],

    dateOfBirth: '1995-11-23',
    residingAddress: '12B Sea Green Towers, Bandra West, Mumbai - 400050',
    nationality: 'Indian',
    gender: 'FEMALE',
    maritalStatus: 'MARRIED',

    bankName: 'ICICI Bank',
    accountNumber: '00120191823456',
    ifscCode: 'ICIC0005678',
    panNumber: 'PQRS5678G',
    uanNumber: '101294820195',
    empCode: 'EMP-002',
  },
  {
    id: 'emp-3',
    loginId: 'OIMACH20230003',
    firstName: 'Marcus',
    lastName: 'Chen',
    personalEmail: 'm.chen.fin@gmail.com',
    phone: '+91 98765 43212',
    company: 'Odoo India Technologies',
    location: 'Bangalore Campus, Floor 3',
    joiningYear: 2023,
    dateOfJoining: '2023-08-01',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    department: { id: 'd-3', name: 'Finance & Accounts', code: 'FIN' },
    designation: { id: 'des-3', title: 'Financial Controller' },
    jobTitle: 'Financial Controller',
    manager: 'Ameer Admin',
    user: { email: 'marcus.chen@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 52000,
    todayStatus: 'ON_LEAVE',
    status: 'leave',

    about: 'Certified corporate financial analyst managing statutory payroll withholding, reconciliation, and audit reporting.',
    whatILoveAboutJob: 'Ensuring zero discrepancy in complex tax calculations.',
    interestsHobbies: 'Numismatics, trail running, and acoustic guitar.',
    skills: ['Statutory Compliance', 'Payroll Accounting', 'Financial Modeling', 'Excel Macros', 'Tax Audit'],
    certifications: ['Chartered Financial Analyst (CFA Level II)', 'Certified Payroll Professional'],

    dateOfBirth: '1994-03-18',
    residingAddress: '78 Koramangala 4th Block, Bangalore - 560034',
    nationality: 'Indian',
    gender: 'MALE',
    maritalStatus: 'SINGLE',

    bankName: 'State Bank of India',
    accountNumber: '30491033418291',
    ifscCode: 'SBIN0009988',
    panNumber: 'WXYZ9012K',
    uanNumber: '101294820196',
    empCode: 'EMP-003',
  },
  {
    id: 'emp-4',
    loginId: 'OIPRSH20240004',
    firstName: 'Priya',
    lastName: 'Sharma',
    personalEmail: 'priya.sharma99@gmail.com',
    phone: '+91 98765 43213',
    company: 'Odoo India Technologies',
    location: 'Delhi Regional Hub',
    joiningYear: 2024,
    dateOfJoining: '2024-02-15',
    employeeStatus: 'PROBATION',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    department: { id: 'd-1', name: 'Engineering', code: 'ENG' },
    designation: { id: 'des-4', title: 'Fullstack Developer' },
    jobTitle: 'Fullstack Developer',
    manager: 'John Doe',
    user: { email: 'priya.sharma@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 48000,
    todayStatus: 'ABSENT',
    status: 'absent',

    about: 'Fullstack engineer passionate about React, TypeScript, GraphQL, and modern web application development.',
    whatILoveAboutJob: 'Translating design visions into high-performance web components.',
    interestsHobbies: 'Badminton, sci-fi novels, and digital illustration.',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'GraphQL', 'Jest'],
    certifications: ['Meta Certified Front-End Developer'],

    dateOfBirth: '1999-08-30',
    residingAddress: 'C-42 Hauz Khas, New Delhi - 110016',
    nationality: 'Indian',
    gender: 'FEMALE',
    maritalStatus: 'SINGLE',

    bankName: 'Axis Bank',
    accountNumber: '91802007721839',
    ifscCode: 'UTIB0001122',
    panNumber: 'LMNOP3456T',
    uanNumber: '101294820197',
    empCode: 'EMP-004',
  },
  {
    id: 'emp-5',
    loginId: 'OIADMN20220000',
    firstName: 'Ameer',
    lastName: 'Admin',
    personalEmail: 'ameer.lead@dayflow.com',
    phone: '+91 99999 88888',
    company: 'Odoo India Technologies',
    location: 'Bangalore HQ, Executive Wing',
    joiningYear: 2022,
    dateOfJoining: '2022-01-01',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    department: { id: 'd-4', name: 'Executive Leadership', code: 'EXEC' },
    designation: { id: 'des-5', title: 'Principal Architect & HR Director' },
    jobTitle: 'Principal Architect & HR Director',
    manager: 'Board of Directors',
    user: { email: 'admin@dayflow.com', role: 'ADMIN', accountStatus: 'ACTIVE' },
    monthlyWage: 120000,
    todayStatus: 'PRESENT',
    status: 'present',

    about: 'Founding architect leading core infrastructure, security compliance, and engineering culture.',
    whatILoveAboutJob: 'Empowering multidisciplinary teams to build mission-critical enterprise systems.',
    interestsHobbies: 'Marathon training, chess, and aviation.',
    skills: ['System Architecture', 'Security RBAC', 'Cloud Infrastructure', 'Team Leadership', 'Statutory Strategy'],
    certifications: ['CISSP Security Certified', 'AWS Solutions Architect Professional'],

    dateOfBirth: '1989-04-05',
    residingAddress: 'Villa 14, Prestige Golfshire, Bangalore - 562110',
    nationality: 'Indian',
    gender: 'MALE',
    maritalStatus: 'MARRIED',

    bankName: 'HDFC Bank',
    accountNumber: '50100000182910',
    ifscCode: 'HDFC0001234',
    panNumber: 'ADMIN0001A',
    uanNumber: '101294820000',
    empCode: 'EMP-000',
  },
];

export const INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeId: 'emp-3',
    employee: {
      id: 'emp-3',
      firstName: 'Marcus',
      lastName: 'Chen',
      loginId: 'OIMACH20230003',
      department: 'Finance & Accounts',
    },
    leaveTypeId: 'lt-1',
    leaveType: {
      id: 'lt-1',
      name: 'Paid Annual Leave',
      code: 'PAL',
      category: 'PAID',
    },
    startDate: '2026-08-22',
    endDate: '2026-08-24',
    totalDays: 3,
    reason: 'Family wedding attendance and travel out of city.',
    status: 'APPROVED',
    reviewerComment: 'Approved. Ensure quarterly reconciliation tasks are delegated.',
    createdAt: '2026-08-20T10:30:00Z',
  },
  {
    id: 'leave-2',
    employeeId: 'emp-4',
    employee: {
      id: 'emp-4',
      firstName: 'Priya',
      lastName: 'Sharma',
      loginId: 'OIPRSH20240004',
      department: 'Engineering',
    },
    leaveTypeId: 'lt-2',
    leaveType: {
      id: 'lt-2',
      name: 'Sick Time Off',
      code: 'SL',
      category: 'SICK',
    },
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    totalDays: 2,
    reason: 'Medical appointment and doctor advised rest.',
    status: 'PENDING',
    attachmentName: 'medical_prescription.pdf',
    createdAt: '2026-08-22T08:15:00Z',
  },
  {
    id: 'leave-3',
    employeeId: 'emp-1',
    employee: {
      id: 'emp-1',
      firstName: 'John',
      lastName: 'Doe',
      loginId: 'OIJODO20220001',
      department: 'Engineering',
    },
    leaveTypeId: 'lt-3',
    leaveType: {
      id: 'lt-3',
      name: 'Casual Time Off',
      code: 'CL',
      category: 'CASUAL',
    },
    startDate: '2026-09-02',
    endDate: '2026-09-03',
    totalDays: 2,
    reason: 'Personal urgent family commitment.',
    status: 'PENDING',
    createdAt: '2026-08-22T09:00:00Z',
  },
];

export const INITIAL_ALL_ATTENDANCE: AttendanceRecord[] = [
  { id: 'att-1', employeeId: 'emp-1', employeeName: 'John Doe', loginId: 'OIJODO20220001', department: 'Engineering', date: '2026-08-22', checkIn: '09:00 AM', checkOut: '05:30 PM', status: 'PRESENT', workHours: 8.5, overtimeHours: 0.5 },
  { id: 'att-2', employeeId: 'emp-2', employeeName: 'Sarah Smith', loginId: 'OISASM20230002', department: 'Product Design', date: '2026-08-22', checkIn: '08:50 AM', checkOut: '05:10 PM', status: 'PRESENT', workHours: 8.33, overtimeHours: 0.33 },
  { id: 'att-3', employeeId: 'emp-3', employeeName: 'Marcus Chen', loginId: 'OIMACH20230003', department: 'Finance & Accounts', date: '2026-08-22', checkIn: null, checkOut: null, status: 'LEAVE', workHours: 0, overtimeHours: 0 },
  { id: 'att-4', employeeId: 'emp-4', employeeName: 'Priya Sharma', loginId: 'OIPRSH20240004', department: 'Engineering', date: '2026-08-22', checkIn: null, checkOut: null, status: 'ABSENT', workHours: 0, overtimeHours: 0 },
  { id: 'att-5', employeeId: 'emp-5', employeeName: 'Ameer Admin', loginId: 'OIADMN20220000', department: 'Executive Leadership', date: '2026-08-22', checkIn: '08:30 AM', checkOut: '06:00 PM', status: 'PRESENT', workHours: 9.5, overtimeHours: 1.5 },
];

/**
 * Dynamic Statutory Salary Breakdown Engine (Exact Odoo Hackathon Formula)
 */
export function calculateDynamicWage(monthlyWage: number): DynamicWageBreakdown {
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const yearlyWage = round2(monthlyWage * 12);
  const basicSalary = round2(monthlyWage * 0.5);
  const hra = round2(basicSalary * 0.5);
  const performanceBonus = round2(basicSalary * 0.0833);
  const leaveTravelAllowance = round2(basicSalary * 0.08333);
  const standardAllowance = 4167.0;

  const componentSum = basicSalary + hra + performanceBonus + leaveTravelAllowance + standardAllowance;
  const fixedAllowance = round2(monthlyWage - componentSum);

  const pfEmployee = round2(basicSalary * 0.12);
  const pfEmployer = round2(basicSalary * 0.12);
  const professionalTax = 200.0;

  const totalEarnings = round2(
    basicSalary + hra + performanceBonus + leaveTravelAllowance + standardAllowance + Math.max(0, fixedAllowance)
  );
  const totalDeductions = round2(pfEmployee + professionalTax);
  const netSalary = round2(totalEarnings - totalDeductions);

  return {
    monthlyWage,
    yearlyWage,
    basicSalary,
    hra,
    performanceBonus,
    leaveTravelAllowance,
    standardAllowance,
    fixedAllowance,
    pfEmployee,
    pfEmployer,
    professionalTax,
    totalEarnings,
    totalDeductions,
    netSalary,
  };
}

export const api = {
  async getEmployees(): Promise<Employee[]> {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || INITIAL_EMPLOYEES;
      }
    } catch {}
    return INITIAL_EMPLOYEES;
  },

  async createEmployee(empData: Partial<Employee>): Promise<Employee> {
    const firstName = empData.firstName || 'New';
    const lastName = empData.lastName || 'Staff';
    const first2 = firstName.replace(/[^A-Za-z]/g, '').substring(0, 2).toUpperCase().padEnd(2, 'X');
    const last2 = lastName.replace(/[^A-Za-z]/g, '').substring(0, 2).toUpperCase().padEnd(2, 'X');
    const year = new Date().getFullYear();
    const serial = String(Math.floor(1000 + Math.random() * 9000));
    const generatedLoginId = `OI${first2}${last2}${year}${serial}`;

    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      loginId: generatedLoginId,
      firstName,
      lastName,
      personalEmail: empData.personalEmail || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      phone: empData.phone || '+91 98765 00000',
      company: empData.company || 'Odoo India Technologies',
      location: empData.location || 'Bangalore HQ',
      joiningYear: year,
      dateOfJoining: empData.dateOfJoining || new Date().toISOString().split('T')[0],
      employeeStatus: 'ACTIVE',
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`,
      department: empData.department || { id: 'd-1', name: 'Engineering', code: 'ENG' },
      designation: empData.designation || { id: 'des-1', title: 'Software Engineer' },
      jobTitle: typeof empData.designation === 'string' ? empData.designation : empData.jobTitle || 'Software Engineer',
      manager: empData.manager || 'Ameer Admin',
      monthlyWage: empData.monthlyWage || 50000,
      todayStatus: 'PRESENT',
      status: 'present',
      skills: empData.skills || ['React', 'TypeScript', 'Node.js'],
      certifications: empData.certifications || [],
      about: empData.about || 'New team member',
      bankName: empData.bankName || 'HDFC Bank',
      accountNumber: empData.accountNumber || '50100482910394',
      ifscCode: empData.ifscCode || 'HDFC0001234',
      panNumber: empData.panNumber || 'ABCDE1234F',
    };
    return newEmp;
  },

  async getTodayAttendance(): Promise<TodayAttendance> {
    return {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_IN',
      systrayState: 'present',
      badgeColor: 'GREEN',
      icon: 'user-check',
      checkInTime: '09:00 AM',
      record: {
        id: 'att-live-1',
        employeeId: 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
        checkOut: null,
        status: 'PRESENT',
        workHours: 3.5,
        overtimeHours: 0,
      },
    };
  },

  async checkIn(): Promise<TodayAttendance> {
    return {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_IN',
      systrayState: 'present',
      badgeColor: 'GREEN',
      icon: 'user-check',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      record: {
        id: 'att-new',
        employeeId: 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date().toISOString(),
        checkOut: null,
        status: 'PRESENT',
        workHours: 0,
        overtimeHours: 0,
      },
    };
  },

  async checkOut(): Promise<TodayAttendance> {
    return {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_OUT',
      systrayState: 'checked_out',
      badgeColor: 'GRAY',
      icon: 'check-circle',
      record: {
        id: 'att-done',
        employeeId: 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date(Date.now() - 8.5 * 3600 * 1000).toISOString(),
        checkOut: new Date().toISOString(),
        status: 'PRESENT',
        workHours: 8.5,
        overtimeHours: 0.5,
      },
    };
  },

  async getAllAttendanceRecords(): Promise<AttendanceRecord[]> {
    return INITIAL_ALL_ATTENDANCE;
  },

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return INITIAL_LEAVE_REQUESTS;
  },

  async getSmartInsights(): Promise<SmartInsight[]> {
    return [
      {
        id: 'INS-1',
        type: 'SUCCESS',
        category: 'BENCHMARK',
        title: 'Top Department Attendance',
        message: 'Engineering achieved 96.4% attendance this month.',
        metric: { current: 96.4, diff: 5.2, unit: '%' },
        actionable: false,
        createdAt: new Date().toISOString(),
      },
    ];
  },

  async approveLeave(requestId: string): Promise<boolean> {
    return true;
  },

  async rejectLeave(requestId: string): Promise<boolean> {
    return true;
  },
};

