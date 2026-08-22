import { checkSystemHealth, type SystemHealthData } from './health.api';
import { fetchTodayAttendance, fetchAttendanceOverview, type TodayAttendanceData, type AttendanceOverviewData } from './attendance.api';
import { fetchMyLeaveBalances, type LeaveBalanceItem } from './leave.api';
import { fetchPayrollRuns, type PayrollRunItem } from './payroll.api';
import { fetchPerformanceGoals, type PerformanceGoal } from './performance.api';
import { fetchHelpdeskTickets, type HelpdeskTicket } from './helpdesk.api';
import { fetchMyNotifications, type NotificationItem } from './notifications.api';
import { fetchEmployees, type EmployeeListItem } from './employees.api';

export interface EmployeeDashboardData {
  todayAttendance: TodayAttendanceData | null;
  leaveBalances: LeaveBalanceItem[];
  performanceGoals: PerformanceGoal[];
  tickets: HelpdeskTicket[];
  notifications: NotificationItem[];
}

export interface HrDashboardData {
  attendanceOverview: AttendanceOverviewData | null;
  employees: EmployeeListItem[];
  totalEmployees: number;
  leaveBalances: LeaveBalanceItem[];
  payrollRuns: PayrollRunItem[];
  tickets: HelpdeskTicket[];
}

export interface AdminDashboardData {
  health: SystemHealthData | null;
  attendanceOverview: AttendanceOverviewData | null;
  totalEmployees: number;
  payrollRuns: PayrollRunItem[];
  tickets: HelpdeskTicket[];
}

export async function fetchEmployeeDashboard(): Promise<EmployeeDashboardData> {
  const [todayAtt, leaves, goals, tickets, notifs] = await Promise.all([
    fetchTodayAttendance().catch(() => null),
    fetchMyLeaveBalances().catch(() => []),
    fetchPerformanceGoals().catch(() => []),
    fetchHelpdeskTickets().catch(() => []),
    fetchMyNotifications().then((r) => r.items).catch(() => []),
  ]);

  return {
    todayAttendance: todayAtt,
    leaveBalances: leaves,
    performanceGoals: goals,
    tickets,
    notifications: notifs,
  };
}

export async function fetchHrDashboard(): Promise<HrDashboardData> {
  const [attOverview, empRes, leaves, payrolls, tickets] = await Promise.all([
    fetchAttendanceOverview().catch(() => null),
    fetchEmployees(1, 10).catch(() => ({ items: [], total: 0 })),
    fetchMyLeaveBalances().catch(() => []),
    fetchPayrollRuns().catch(() => []),
    fetchHelpdeskTickets().catch(() => []),
  ]);

  return {
    attendanceOverview: attOverview,
    employees: empRes.items,
    totalEmployees: empRes.total,
    leaveBalances: leaves,
    payrollRuns: payrolls,
    tickets,
  };
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const [health, attOverview, empRes, payrolls, tickets] = await Promise.all([
    checkSystemHealth().catch(() => null),
    fetchAttendanceOverview().catch(() => null),
    fetchEmployees(1, 10).catch(() => ({ items: [], total: 0 })),
    fetchPayrollRuns().catch(() => []),
    fetchHelpdeskTickets().catch(() => []),
  ]);

  return {
    health,
    attendanceOverview: attOverview,
    totalEmployees: empRes.total,
    payrollRuns: payrolls,
    tickets,
  };
}
