import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Plus,
  FileText,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { SystrayWidget } from './SystrayWidget';

interface EmployeeDashboardProps {
  onNavigateTab: (tab: string) => void;
  onOpenApplyLeave: () => void;
  onOpenPayslip: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({
  onNavigateTab,
  onOpenApplyLeave,
  onOpenPayslip,
}) => {
  const { user } = useAuth();
  const { leaveBalances, leaveRequests } = useData();

  const myRequests = leaveRequests.filter(
    (r) =>
      r.employeeId === user.employeeId ||
      r.employee?.loginId === user.loginId ||
      r.employee?.firstName?.toLowerCase() === user.name.split(' ')[0]?.toLowerCase()
  );

  const myLeaveBalances = [
    {
      type: 'Paid Annual Leave',
      remaining: leaveBalances.paidAvailable,
      total: leaveBalances.paidTotal,
      pct: `${Math.round((leaveBalances.paidAvailable / leaveBalances.paidTotal) * 100)}%`,
      color: 'bg-emerald-500',
      text: 'text-emerald-400',
    },
    {
      type: 'Medical & Sick Leave',
      remaining: leaveBalances.sickAvailable,
      total: leaveBalances.sickTotal,
      pct: `${Math.round((leaveBalances.sickAvailable / leaveBalances.sickTotal) * 100)}%`,
      color: 'bg-teal-500',
      text: 'text-teal-400',
    },
    {
      type: 'Unpaid Special Leave',
      remaining: 'Unlimited',
      total: 'As Needed',
      pct: '100%',
      color: 'bg-indigo-500',
      text: 'text-indigo-400',
    },
  ];

  const myActivity = [
    { time: '09:12 AM', action: 'Logged on-time check-in via workstation terminal', tag: 'Attendance' },
    { time: 'Yesterday', action: 'Worked 8h 15m shift (+15m overtime accrued)', tag: 'Shift' },
    { time: 'Aug 18', action: 'July 2026 Payslip generated and credited to Bank', tag: 'Payroll' },
  ];

  const weeklySchedule = [
    { day: 'Mon', date: '18', status: 'Present (8.5h)', color: 'bg-emerald-500' },
    { day: 'Tue', date: '19', status: 'Present (8.2h)', color: 'bg-emerald-500' },
    { day: 'Wed', date: '20', status: 'Half-Day (4.0h)', color: 'bg-blue-500' },
    { day: 'Thu', date: '21', status: 'Present (9.5h)', color: 'bg-emerald-500' },
    { day: 'Fri', date: '22', status: 'Present (Today)', color: 'bg-emerald-500 ring-2 ring-emerald-400' },
    { day: 'Sat', date: '23', status: 'Weekend', color: 'bg-zinc-700' },
    { day: 'Sun', date: '24', status: 'Weekend', color: 'bg-zinc-700' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-zinc-900 to-zinc-900 border border-teal-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Employee Self-Service Portal
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              {user.loginId}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Every workday, perfectly aligned. Here's your personal schedule, shift status, and leave balances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenApplyLeave}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Time Off</span>
          </button>
          <SystrayWidget />
        </div>
      </div>

      {/* 3 Metric Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {myLeaveBalances.map((bal, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-lg space-y-3"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-zinc-300">{bal.type}</span>
              <span className={`text-xs font-bold font-mono ${bal.text}`}>
                {bal.remaining} {typeof bal.remaining === 'number' ? 'Days Left' : ''}
              </span>
            </div>
            <p className="text-2xl font-black text-white font-mono">
              {bal.remaining} <span className="text-xs text-zinc-500 font-sans font-normal">/ {bal.total} Total</span>
            </p>
            <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
              <div style={{ width: bal.pct }} className={`h-full ${bal.color} rounded-full`} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Shift & Weekly Tracker + Compensation Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Shift Station & Weekly Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Attendance Heatmap */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>My Attendance & Shift Logs (This Week)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">8.0 hrs standard daily workday target</p>
              </div>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Full Shift Log</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 pt-2">
              {weeklySchedule.map((item, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col items-center justify-center text-center gap-1.5"
                >
                  <span className="text-[10px] font-bold text-zinc-400 uppercase">{item.day}</span>
                  <span className="text-sm font-bold text-white font-mono">{item.date}</span>
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-[9px] text-zinc-500 truncate max-w-full font-medium">{item.status.split(' ')[0]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Recent Leave Requests */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-400" />
                  <span>My Recent Leave Applications</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time status updates from HR management</p>
              </div>
              <button
                onClick={() => onNavigateTab('timeoff')}
                className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All In Calendar</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {myRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{req.leaveType?.name || 'Leave'}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          req.status === 'APPROVED'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5 font-mono">
                      {req.startDate} to {req.endDate} ({req.totalDays}d)
                    </p>
                    <p className="text-[10px] text-zinc-500 italic mt-0.5">"{req.reason}"</p>
                    {req.reviewerComment && (
                      <p className="text-[10px] text-emerald-400 font-medium mt-1">HR Note: {req.reviewerComment}</p>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500 self-end sm:self-center">
                    Ref: {req.id}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: My Read-Only Compensation & Personal Timeline */}
        <div className="space-y-6">
          {/* Read-Only Salary Breakdown Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/20 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                My Compensation (Read-Only)
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Aug 2026
              </span>
            </div>

            <div>
              <span className="text-xs text-zinc-400">Monthly Net Payout</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">₹61,800</p>
              <p className="text-[11px] text-zinc-400 mt-1">Directly disbursed to HDFC Bank (••••4829).</p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-zinc-300">
                <span className="font-sans">Basic Salary (50%)</span>
                <span>₹32,500</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span className="font-sans">HRA & Allowances</span>
                <span>₹32,500</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span className="font-sans">Deductions (PF/PT)</span>
                <span>-₹3,200</span>
              </div>
            </div>

            <button
              onClick={onOpenPayslip}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Official Payslip (PDF)</span>
            </button>
          </div>

          {/* Personal Activity Timeline */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-teal-400" />
              <span>My Recent Activity</span>
            </h3>

            <div className="space-y-3 relative pl-3 border-l border-zinc-800 text-xs">
              {myActivity.map((act, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-teal-400 ring-4 ring-zinc-900" />
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                    <span className="font-mono">{act.time}</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">{act.tag}</span>
                  </div>
                  <p className="text-zinc-300">{act.action}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
