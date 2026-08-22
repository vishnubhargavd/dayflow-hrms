import {
  Employee,
  TodayAttendance,
  LeaveRequest,
  SmartInsight,
  DynamicWageBreakdown,
  Role,
} from '../types';

export interface ApiError {
  success: false;
  errorCode: string;
  message: string;
  errors?: Record<string, { message: string; field: string }>;
}

export function extractApiErrors(errorPayload: any): {
  message: string;
  fieldErrors: Record<string, string>;
} {
  const fieldErrors: Record<string, string> = {};
  const message = errorPayload?.message || 'An unexpected error occurred.';

  if (errorPayload?.errors && typeof errorPayload.errors === 'object') {
    Object.entries(errorPayload.errors).forEach(([key, val]: [string, any]) => {
      fieldErrors[key] = val?.message || String(val);
    });
  }

  return { message, fieldErrors };
}

const API_BASE = '/api/v1';

// Initial Mock Dataset for rapid interactive testing & offline hackathon resilience
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    loginId: 'OIJODO20220001',
    firstName: 'John',
    lastName: 'Doe',
    personalEmail: 'john.doe@gmail.com',
    phone: '+91 98765 43210',
    joiningYear: 2022,
    dateOfJoining: '2022-04-15',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: { id: 'd-1', name: 'Engineering', code: 'ENG' },
    designation: { id: 'des-1', title: 'Senior Backend Engineer' },
    user: { email: 'john.doe@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 65000,
    todayStatus: 'PRESENT',
    bankName: 'HDFC Bank',
    accountNumber: '••••••••4829',
    ifscCode: 'HDFC0001234',
    panNumber: 'ABCDE1234F',
  },
  {
    id: 'emp-2',
    loginId: 'OISASM20230002',
    firstName: 'Sarah',
    lastName: 'Smith',
    personalEmail: 'sarah.s@gmail.com',
    phone: '+91 98765 43211',
    joiningYear: 2023,
    dateOfJoining: '2023-01-10',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: { id: 'd-2', name: 'Product Design', code: 'DES' },
    designation: { id: 'des-2', title: 'Lead UI/UX Designer' },
    user: { email: 'sarah.smith@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 75000,
    todayStatus: 'PRESENT',
    bankName: 'ICICI Bank',
    accountNumber: '••••••••9182',
    ifscCode: 'ICIC0005678',
    panNumber: 'PQRS5678G',
  },
  {
    id: 'emp-3',
    loginId: 'OIMACH20230003',
    firstName: 'Marcus',
    lastName: 'Chen',
    personalEmail: 'm.chen@gmail.com',
    phone: '+91 98765 43212',
    joiningYear: 2023,
    dateOfJoining: '2023-08-01',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: { id: 'd-3', name: 'Finance & Accounts', code: 'FIN' },
    designation: { id: 'des-3', title: 'Financial Analyst' },
    user: { email: 'marcus.chen@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 52000,
    todayStatus: 'ON_LEAVE',
    bankName: 'State Bank of India',
    accountNumber: '••••••••3341',
    ifscCode: 'SBIN0009988',
    panNumber: 'WXYZ9012K',
  },
  {
    id: 'emp-4',
    loginId: 'OIPRSH20240004',
    firstName: 'Priya',
    lastName: 'Sharma',
    personalEmail: 'priya.sharma@gmail.com',
    phone: '+91 98765 43213',
    joiningYear: 2024,
    dateOfJoining: '2024-02-15',
    employeeStatus: 'PROBATION',
    profilePicture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: { id: 'd-1', name: 'Engineering', code: 'ENG' },
    designation: { id: 'des-4', title: 'Fullstack Developer' },
    user: { email: 'priya.sharma@dayflow.com', role: 'EMPLOYEE', accountStatus: 'ACTIVE' },
    monthlyWage: 48000,
    todayStatus: 'HALF_DAY',
    bankName: 'Axis Bank',
    accountNumber: '••••••••7721',
    ifscCode: 'UTIB0001122',
    panNumber: 'LMNOP3456T',
  },
  {
    id: 'emp-5',
    loginId: 'OIADMN20220000',
    firstName: 'Ameer',
    lastName: 'Admin',
    personalEmail: 'admin@dayflow.com',
    phone: '+91 99999 88888',
    joiningYear: 2022,
    dateOfJoining: '2022-01-01',
    employeeStatus: 'ACTIVE',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: { id: 'd-4', name: 'Executive Leadership', code: 'EXEC' },
    designation: { id: 'des-5', title: 'Principal Architect & HR Director' },
    user: { email: 'admin@dayflow.com', role: 'ADMIN', accountStatus: 'ACTIVE' },
    monthlyWage: 120000,
    todayStatus: 'PRESENT',
    bankName: 'HDFC Bank',
    accountNumber: '••••••••0001',
    ifscCode: 'HDFC0001234',
    panNumber: 'ADMIN0001A',
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
      department: { name: 'Finance & Accounts' },
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
      department: { name: 'Engineering' },
    },
    leaveTypeId: 'lt-2',
    leaveType: {
      id: 'lt-2',
      name: 'Medical & Sick Leave',
      code: 'SL',
      category: 'SICK',
    },
    startDate: '2026-08-25',
    endDate: '2026-08-26',
    totalDays: 2,
    reason: 'Medical appointment and recovery period.',
    status: 'PENDING',
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
      department: { name: 'Engineering' },
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
    reason: 'Personal urgent family work.',
    status: 'PENDING',
    createdAt: '2026-08-22T09:00:00Z',
  },
];

export const INITIAL_SMART_INSIGHTS: SmartInsight[] = [
  {
    id: 'INS-1',
    type: 'SUCCESS',
    category: 'BENCHMARK',
    title: 'Top Department Attendance',
    message: 'Engineering department achieved 96.4% attendance this month, leading the organization.',
    metric: { current: 96.4, previous: 91.2, diff: 5.2, unit: '%' },
    actionable: false,
    recommendation: 'Recognize team consistency in monthly townhall.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'INS-2',
    type: 'INFO',
    category: 'OVERTIME',
    title: 'Healthy Shift Distribution',
    message: 'Your personal average daily hours (8.2 hrs) are on track with zero overtime burnout risk.',
    metric: { current: 8.2, unit: 'hrs/day' },
    actionable: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'INS-3',
    type: 'SUCCESS',
    category: 'ATTENDANCE',
    title: 'Perfect Attendance Streak',
    message: 'You have logged 100% on-time check-ins for the last 14 consecutive working days.',
    metric: { current: 14, unit: 'days' },
    actionable: false,
    createdAt: new Date().toISOString(),
  },
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

/**
 * Live API Client Bridge
 */
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
    } catch {
      // Fallback
    }
    return INITIAL_EMPLOYEES;
  },

  async getTodayAttendance(): Promise<TodayAttendance> {
    try {
      const res = await fetch(`${API_BASE}/attendance/today`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {
      // Fallback
    }
    return {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_IN',
      systrayState: 'present',
      badgeColor: 'GREEN',
      icon: 'user-check',
      message: 'Active shift in progress',
      record: {
        id: 'att-live-1',
        employeeId: 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date(Date.now() - 3 * 3600 * 1000).toISOString(), // 3 hours ago
        checkOut: null,
        status: 'PRESENT',
        workHours: 3.0,
        overtimeHours: 0,
      },
    };
  },

  async checkIn(): Promise<TodayAttendance> {
    try {
      const res = await fetch(`${API_BASE}/attendance/check-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_IN',
      systrayState: 'present',
      badgeColor: 'GREEN',
      icon: 'user-check',
      record: {
        id: 'att-new',
        employeeId: 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date().toISOString(),
        checkOut: null,
        status: 'PRESENT',
      },
    };
  },

  async checkOut(): Promise<TodayAttendance> {
    try {
      const res = await fetch(`${API_BASE}/attendance/check-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
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

  async getSmartInsights(): Promise<SmartInsight[]> {
    try {
      const res = await fetch(`${API_BASE}/attendance/insights`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data?.insights || INITIAL_SMART_INSIGHTS;
      }
    } catch {}
    return INITIAL_SMART_INSIGHTS;
  },

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    try {
      const res = await fetch(`${API_BASE}/leave/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` },
      });
      if (res.ok) {
        const json = await res.json();
        return json.data || INITIAL_LEAVE_REQUESTS;
      }
    } catch {}
    return INITIAL_LEAVE_REQUESTS;
  },

  async approveLeave(requestId: string, comment?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/leave/requests/${requestId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ reviewerComment: comment || 'Approved' }),
      });
      return res.ok;
    } catch {}
    return true;
  },

  async rejectLeave(requestId: string, reason?: string): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE}/leave/requests/${requestId}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ rejectionReason: reason || 'Rejected due to schedule' }),
      });
      return res.ok;
    } catch {}
    return true;
  },
};
