import React, { createContext, useContext, useState, useEffect } from 'react';
import { Employee, LeaveRequest, TodayAttendance, Role } from '../types';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS, api } from '../services/api';
import { useAuth } from './AuthContext';

export interface LeaveBalanceData {
  paidAvailable: number;
  paidTotal: number;
  sickAvailable: number;
  sickTotal: number;
  casualAvailable: number;
  casualTotal: number;
}

interface DataContextType {
  employees: Employee[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalanceData;
  todayAttendance: TodayAttendance;
  applyLeave: (req: {
    leaveTypeId: string;
    leaveTypeName: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
  }) => Promise<void>;
  approveLeave: (id: string, comment?: string) => Promise<void>;
  rejectLeave: (id: string, reason?: string) => Promise<void>;
  addEmployee: (emp: Partial<Employee>) => Promise<void>;
  updateEmployee: (emp: Employee) => Promise<void>;
  punchIn: () => Promise<void>;
  punchOut: () => Promise<void>;
}

const DEFAULT_BALANCES: LeaveBalanceData = {
  paidAvailable: 24,
  paidTotal: 24,
  sickAvailable: 7,
  sickTotal: 7,
  casualAvailable: 5,
  casualTotal: 5,
};

const DataContext = createContext<DataContextType>({
  employees: INITIAL_EMPLOYEES,
  leaveRequests: INITIAL_LEAVE_REQUESTS,
  leaveBalances: DEFAULT_BALANCES,
  todayAttendance: {
    date: new Date().toISOString().split('T')[0],
    status: 'CHECKED_IN',
    systrayState: 'present',
    badgeColor: 'GREEN',
    icon: 'user-check',
  },
  applyLeave: async () => {},
  approveLeave: async () => {},
  rejectLeave: async () => {},
  addEmployee: async () => {},
  updateEmployee: async () => {},
  punchIn: async () => {},
  punchOut: async () => {},
});

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Load from localStorage or fall back to defaults
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('dayflow_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem('dayflow_leave_requests');
    return saved ? JSON.parse(saved) : INITIAL_LEAVE_REQUESTS;
  });

  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceData>(() => {
    const saved = localStorage.getItem('dayflow_leave_balances');
    return saved ? JSON.parse(saved) : DEFAULT_BALANCES;
  });

  const [todayAttendance, setTodayAttendance] = useState<TodayAttendance>(() => {
    const saved = localStorage.getItem('dayflow_today_attendance');
    if (saved) return JSON.parse(saved);
    return {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_IN',
      systrayState: 'present',
      badgeColor: 'GREEN',
      icon: 'user-check',
      message: 'Active shift in progress (09:12 AM)',
      record: {
        id: 'att-live-1',
        employeeId: user.employeeId || 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
        checkOut: null,
        status: 'PRESENT',
        workHours: 3.5,
        overtimeHours: 0,
      },
    };
  });

  // Keep localStorage synchronized
  useEffect(() => {
    localStorage.setItem('dayflow_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('dayflow_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('dayflow_leave_balances', JSON.stringify(leaveBalances));
  }, [leaveBalances]);

  useEffect(() => {
    localStorage.setItem('dayflow_today_attendance', JSON.stringify(todayAttendance));
  }, [todayAttendance]);

  // Attempt initial backend fetch if online
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [empData, leaveData, attData] = await Promise.all([
          api.getEmployees(),
          api.getLeaveRequests(),
          api.getTodayAttendance(),
        ]);
        if (empData && empData.length > 0) setEmployees(empData);
        if (leaveData && leaveData.length > 0) setLeaveRequests(leaveData);
        if (attData) setTodayAttendance(attData);
      } catch (err) {
        // Standalone resilient mode
      }
    };
    fetchData();
  }, []);

  // 1. Apply Leave (Employee Action)
  const applyLeave = async (req: {
    leaveTypeId: string;
    leaveTypeName: string;
    startDate: string;
    endDate: string;
    totalDays: number;
    reason: string;
  }) => {
    const newRequest: LeaveRequest = {
      id: `LR-${Date.now().toString().slice(-4)}`,
      employeeId: user.employeeId || 'emp-4',
      employee: {
        id: user.employeeId || 'emp-4',
        firstName: user.name.split(' ')[0] || 'Priya',
        lastName: user.name.split(' ')[1] || 'Sharma',
        loginId: user.loginId || 'OIPRSH20240004',
        department: { name: user.departmentName || 'Engineering' },
      },
      leaveTypeId: req.leaveTypeId,
      leaveType: {
        id: req.leaveTypeId,
        name: req.leaveTypeName,
        code: req.leaveTypeName.includes('Sick') ? 'SL' : 'PAL',
        category: req.leaveTypeName.includes('Sick') ? 'SICK' : 'PAID',
      },
      startDate: req.startDate,
      endDate: req.endDate,
      totalDays: req.totalDays,
      reason: req.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    // Deduct quota balance immediately
    if (req.leaveTypeName.toLowerCase().includes('sick')) {
      setLeaveBalances((prev) => ({
        ...prev,
        sickAvailable: Math.max(0, prev.sickAvailable - req.totalDays),
      }));
    } else {
      setLeaveBalances((prev) => ({
        ...prev,
        paidAvailable: Math.max(0, prev.paidAvailable - req.totalDays),
      }));
    }

    // Add to shared reactive list (at top)
    setLeaveRequests((prev) => [newRequest, ...prev]);

    // Send to backend API
    try {
      await fetch('/api/v1/leave/me/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'dayflow-mock-jwt-session'}`,
        },
        body: JSON.stringify({
          leaveTypeId: req.leaveTypeId,
          startDate: req.startDate,
          endDate: req.endDate,
          reason: req.reason,
        }),
      });
    } catch (e) {
      // Backend request failure caught gracefully
    }
  };

  // 2. Approve Leave (HR Admin Action)
  const approveLeave = async (id: string, comment?: string) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'APPROVED',
              reviewerComment: comment || 'Approved by HR Management',
            }
          : r
      )
    );

    try {
      await api.approveLeave(id, comment);
    } catch {}
  };

  // 3. Reject Leave (HR Admin Action)
  const rejectLeave = async (id: string, reason?: string) => {
    const target = leaveRequests.find((r) => r.id === id);
    if (target) {
      // Restore quota if rejected
      if (target.leaveType?.name.toLowerCase().includes('sick')) {
        setLeaveBalances((prev) => ({
          ...prev,
          sickAvailable: Math.min(prev.sickTotal, prev.sickAvailable + target.totalDays),
        }));
      } else {
        setLeaveBalances((prev) => ({
          ...prev,
          paidAvailable: Math.min(prev.paidTotal, prev.paidAvailable + target.totalDays),
        }));
      }
    }

    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'REJECTED',
              reviewerComment: reason || 'Declined due to coverage constraints',
            }
          : r
      )
    );

    try {
      await api.rejectLeave(id, reason);
    } catch {}
  };

  // 4. Add Employee
  const addEmployee = async (emp: Partial<Employee>) => {
    const fullEmp: Employee = {
      id: `emp-${Date.now().toString().slice(-4)}`,
      loginId: emp.loginId || `OI${(emp.firstName || 'USR').slice(0, 4).toUpperCase()}2026${Math.floor(1000 + Math.random() * 9000)}`,
      firstName: emp.firstName || 'New',
      lastName: emp.lastName || 'Staff',
      personalEmail: emp.personalEmail || 'staff@dayflow.com',
      phone: emp.phone || '+91 98765 00000',
      joiningYear: emp.joiningYear || new Date().getFullYear(),
      dateOfJoining: emp.dateOfJoining || new Date().toISOString().split('T')[0],
      employeeStatus: 'ACTIVE',
      profilePicture: emp.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${emp.firstName}`,
      department: emp.department || { id: 'd-1', name: 'Engineering', code: 'ENG' },
      designation: emp.designation || { id: 'des-1', title: 'Associate' },
      user: { email: emp.user?.email || emp.personalEmail || 'staff@dayflow.com', role: emp.user?.role || 'EMPLOYEE', accountStatus: 'ACTIVE' },
      monthlyWage: emp.monthlyWage || 50000,
      todayStatus: 'PRESENT',
      bankName: emp.bankName || 'HDFC Bank Ltd.',
      accountNumber: emp.accountNumber || '••••••••4412',
      ifscCode: emp.ifscCode || 'HDFC0001234',
      panNumber: emp.panNumber || 'ABCDE1234F',
    };

    setEmployees((prev) => [fullEmp, ...prev]);

    try {
      await fetch('/api/v1/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'dayflow-mock-jwt-session'}`,
        },
        body: JSON.stringify(fullEmp),
      });
    } catch {}
  };

  // 5. Update Employee
  const updateEmployee = async (emp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)));

    try {
      await fetch(`/api/v1/employees/${emp.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || 'dayflow-mock-jwt-session'}`,
        },
        body: JSON.stringify(emp),
      });
    } catch {}
  };

  // 6. Punch In / Clock In
  const punchIn = async () => {
    const updated: TodayAttendance = {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_IN',
      systrayState: 'present',
      badgeColor: 'GREEN',
      icon: 'user-check',
      message: 'Active shift in progress',
      record: {
        id: `att-${Date.now()}`,
        employeeId: user.employeeId || 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: new Date().toISOString(),
        checkOut: null,
        status: 'PRESENT',
        workHours: 0.1,
        overtimeHours: 0,
      },
    };
    setTodayAttendance(updated);
    try {
      await api.checkIn();
    } catch {}
  };

  // 7. Punch Out / Clock Out
  const punchOut = async () => {
    const updated: TodayAttendance = {
      date: new Date().toISOString().split('T')[0],
      status: 'CHECKED_OUT',
      systrayState: 'checked_out',
      badgeColor: 'GRAY',
      icon: 'check-circle',
      message: 'Shift completed for today (8.2 hrs logged)',
      record: {
        id: todayAttendance.record?.id || `att-${Date.now()}`,
        employeeId: user.employeeId || 'emp-1',
        date: new Date().toISOString().split('T')[0],
        checkIn: todayAttendance.record?.checkIn || new Date(Date.now() - 8.2 * 3600 * 1000).toISOString(),
        checkOut: new Date().toISOString(),
        status: 'PRESENT',
        workHours: 8.2,
        overtimeHours: 0.2,
      },
    };
    setTodayAttendance(updated);
    try {
      await api.checkOut();
    } catch {}
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        leaveRequests,
        leaveBalances,
        todayAttendance,
        applyLeave,
        approveLeave,
        rejectLeave,
        addEmployee,
        updateEmployee,
        punchIn,
        punchOut,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
