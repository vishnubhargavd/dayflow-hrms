export type Role = 'ADMIN' | 'HR' | 'EMPLOYEE';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'ON_LEAVE' | 'HOLIDAY' | 'WEEKEND';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
export type LeaveCategory = 'PAID' | 'UNPAID' | 'SICK' | 'CASUAL' | 'OPTIONAL';

export interface User {
  id: string;
  loginId: string;
  email: string;
  role: Role;
  employeeId?: string;
  name?: string;
  companyName?: string;
  companyLogo?: string;
}

export interface Employee {
  id: string;
  loginId: string;
  firstName: string;
  lastName: string;
  personalEmail?: string;
  phone?: string;
  company?: string;
  location?: string;
  joiningYear: number;
  dateOfJoining: string;
  employeeStatus: 'ACTIVE' | 'PROBATION' | 'NOTICE_PERIOD' | 'TERMINATED';
  profilePicture?: string;
  department?: { id: string; name: string; code: string } | string;
  designation?: { id: string; title: string } | string;
  jobTitle?: string;
  manager?: { id: string; firstName: string; lastName: string } | string;
  user?: { email: string; role: Role; accountStatus: string };
  monthlyWage?: number;
  
  // Resume / Bio
  about?: string;
  whatILoveAboutJob?: string;
  interestsHobbies?: string;
  skills?: string[];
  certifications?: string[];

  // Private Info
  dateOfBirth?: string;
  residingAddress?: string;
  nationality?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  maritalStatus?: 'SINGLE' | 'MARRIED' | 'DIVORCED';

  // Bank & Statutory
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  uanNumber?: string;
  empCode?: string;

  // Live Presence
  todayStatus?: 'PRESENT' | 'HALF_DAY' | 'ON_LEAVE' | 'ABSENT' | 'NOT_CHECKED_IN';
  status?: 'present' | 'leave' | 'absent' | string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName?: string;
  loginId?: string;
  department?: string;
  date: string;
  checkIn?: string | null;
  checkOut?: string | null;
  status: AttendanceStatus;
  workHours?: number;
  overtimeHours?: number;
}

export interface TodayAttendance {
  date: string;
  status: 'CHECKED_IN' | 'CHECKED_OUT' | 'NOT_CHECKED_IN' | 'ON_LEAVE';
  systrayState: 'present' | 'leave' | 'absent' | 'checked_out';
  badgeColor: 'GREEN' | 'BLUE' | 'YELLOW' | 'GRAY';
  icon: string;
  message?: string;
  checkInTime?: string;
  record?: AttendanceRecord | null;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    loginId: string;
    department?: { name: string } | string;
  };
  leaveTypeId: string;
  leaveType: {
    id: string;
    name: string;
    code: string;
    category: LeaveCategory;
  };
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  attachmentName?: string;
  reviewerComment?: string;
  createdAt: string;
}

export interface SmartInsight {
  id: string;
  type: 'SUCCESS' | 'WARNING' | 'ALERT' | 'INFO';
  category: 'ATTENDANCE' | 'OVERTIME' | 'DEPARTMENT' | 'BENCHMARK';
  title: string;
  message: string;
  metric?: {
    current?: number;
    previous?: number;
    diff?: number;
    unit?: string;
  };
  actionable: boolean;
  recommendation?: string;
  createdAt: string;
}

export interface DynamicWageBreakdown {
  monthlyWage: number;
  yearlyWage: number;
  basicSalary: number;
  hra: number;
  performanceBonus: number;
  leaveTravelAllowance: number;
  standardAllowance: number;
  fixedAllowance: number;
  pfEmployee: number;
  pfEmployer: number;
  professionalTax: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
}
