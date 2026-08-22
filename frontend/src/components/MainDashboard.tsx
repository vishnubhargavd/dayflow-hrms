import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  CalendarDays,
  Clock,
  CreditCard,
  AlertCircle,
  TrendingUp,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  Sparkles,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Employee } from '../types';
import { SystrayWidget } from './SystrayWidget';

interface MainDashboardProps {
  onNavigateTab: (tab: string) => void;
  onSelectEmployee?: (emp: Employee) => void;
  onOpenAddEmployee?: () => void;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({ onNavigateTab, onOpenAddEmployee }) => {
  const { user } = useAuth();
  const { employees, leaveRequests, approveLeave, rejectLeave } = useData();

  const isHRorAdmin = user.role === 'ADMIN' || user.role === 'HR';

  const pendingRequests = leaveRequests.filter((r) => r.status === 'PENDING');
  const presentCount = employees.filter((e) => e.todayStatus === 'PRESENT').length;
  const onLeaveCount = employees.filter((e) => e.todayStatus === 'ON_LEAVE').length;

  const kpis = [
    {
      title: 'Total Employees',
      value: `${employees.length}`,
      sub: '+4.2% from last month',
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      color: 'from-indigo-500/10 to-indigo-500/5 border-indigo-500/20',
      badge: `+${employees.length}`,
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    {
      title: 'Present Today',
      value: `${presentCount || 4}`,
      sub: `${Math.round(((presentCount || 4) / (employees.length || 5)) * 100)}% attendance rate`,
      icon: <UserCheck className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
      badge: `${Math.round(((presentCount || 4) / (employees.length || 5)) * 100)}%`,
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    {
      title: 'On Leave',
      value: `${onLeaveCount || 1}`,
      sub: 'Active leave schedule',
      icon: <CalendarDays className="w-5 h-5 text-sky-400" />,
      color: 'from-sky-500/10 to-sky-500/5 border-sky-500/20',
      badge: `${onLeaveCount || 1} Active`,
      badgeColor: 'bg-sky-500/10 text-sky-300 border-sky-500/20',
    },
    {
      title: 'Pending Approvals',
      value: `${pendingRequests.length}`,
      sub: 'Requires HR decision',
      icon: <AlertCircle className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/10 to-amber-500/5 border-amber-500/20',
      badge: pendingRequests.length > 0 ? 'Urgent' : 'All Clear',
      badgeColor: pendingRequests.length > 0 ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    {
      title: 'Average Work Hours',
      value: '7.8 hrs',
      sub: 'Optimal productivity curve',
      icon: <Clock className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-500/10 to-purple-500/5 border-purple-500/20',
      badge: 'Healthy',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    },
    {
      title: 'Monthly Payroll',
      value: `₹${(employees.reduce((acc, e) => acc + (e.monthlyWage || 50000), 0) / 100000).toFixed(1)}L`,
      sub: 'Cycle: August 2026',
      icon: <CreditCard className="w-5 h-5 text-emerald-400" />,
      color: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
      badge: 'Calculated',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
  ];

  const handleQuickApprove = async (id: string) => {
    await approveLeave(id, 'Approved via HR Dashboard');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7'],
    });
  };

  const handleQuickReject = async (id: string) => {
    await rejectLeave(id, 'Declined due to team schedule overlap');
  };

  const recentActivity = [
    { time: '10:32 AM', user: 'Priya Sharma', action: 'applied for 2 days Sick Leave', tag: 'Leave' },
    { time: '10:05 AM', user: 'Sarah Jenkins', action: 'clocked in at 09:04 AM on workstation', tag: 'Attendance' },
    { time: '09:12 AM', user: 'System Engine', action: 'August Payroll estimation calculated', tag: 'Payroll' },
    { time: 'Yesterday', user: 'Ameer Admin', action: 'approved quarterly policy update', tag: 'Policy' },
  ];

  const weeklySchedule = [
    { day: 'Mon', date: '18', status: 'Present (8.5h)', color: 'bg-emerald-500' },
    { day: 'Tue', date: '19', status: 'Present (8.2h)', color: 'bg-emerald-500' },
    { day: 'Wed', date: '20', status: 'Half-Day (4.0h)', color: 'bg-blue-500' },
    { day: 'Thu', date: '21', status: 'Present (9.0h)', color: 'bg-emerald-500' },
    { day: 'Fri', date: '22', status: 'Present (Today)', color: 'bg-emerald-500 ring-2 ring-emerald-400' },
    { day: 'Sat', date: '23', status: 'Weekend', color: 'bg-zinc-700' },
    { day: 'Sun', date: '24', status: 'Weekend', color: 'bg-zinc-700' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Top Banner / Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-900 border border-emerald-500/20 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Dayflow HRMS • HR Command Center
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              {user.name} ({user.role})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Good morning, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Every workday, perfectly aligned. Here's what's happening across your organization today.
          </p>
        </div>

        {/* Date Filter & Quick Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">18 – 24 August 2026</span>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAddEmployee ? (
              <button
                onClick={onOpenAddEmployee}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Employee</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigateTab('employees')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Employee</span>
              </button>
            )}
            <button
              onClick={() => onNavigateTab('reports')}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center gap-1.5 border border-zinc-700 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid (6 Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -3 }}
            className={`p-4 rounded-2xl bg-gradient-to-b ${kpi.color} bg-zinc-900/90 border backdrop-blur-sm shadow-md flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                {kpi.icon}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${kpi.badgeColor}`}>
                {kpi.badge}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-zinc-400">{kpi.title}</span>
              <p className="text-xl font-bold text-white font-mono mt-0.5 tracking-tight">{kpi.value}</p>
              <p className="text-[10px] text-zinc-500 mt-1 font-medium">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Left 2 Columns & Right 1 Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Weekly Attendance & Approvals Queue */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weekly Attendance Tracker */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Weekly Attendance Pulse (August 18 – 24, 2026)</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Real-time presence rate across departments</p>
              </div>
              <button
                onClick={() => onNavigateTab('attendance')}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Full Log</span>
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

          {/* Pending Leave Approvals Fast Action Queue */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-amber-400" />
                  <span>Pending Leave Approvals Queue</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">Requires supervisor or HR signoff before cycle lock</p>
              </div>
              <button
                onClick={() => onNavigateTab('approvals')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Manage All ({pendingRequests.length})</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {pendingRequests.length > 0 ? (
                  pendingRequests.slice(0, 3).map((req) => (
                    <motion.div
                      key={req.id}
                      layout
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-zinc-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.employee?.firstName || 'User'}`}
                          alt={req.employee?.firstName}
                          className="w-10 h-10 rounded-full border border-zinc-700 bg-zinc-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">
                              {req.employee?.firstName} {req.employee?.lastName}
                            </h4>
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                              {req.leaveType?.name}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            {req.startDate} to {req.endDate} ({req.totalDays}d) — <span className="italic">"{req.reason}"</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleQuickReject(req.id)}
                          className="p-1.5 rounded-lg bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition-all cursor-pointer"
                          title="Reject Leave"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleQuickApprove(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1 transition-all cursor-pointer"
                          title="Approve Leave"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center text-xs text-zinc-500">
                    No pending leave requests awaiting approval.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Payroll Audit Snapshot & Activity Stream */}
        <div className="space-y-6">
          {/* Payroll Audit Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/20 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                Monthly Payroll Audit
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                August 2026
              </span>
            </div>

            <div>
              <span className="text-xs text-zinc-400">Total Net Disbursals</span>
              <p className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
                ₹{((employees.reduce((acc, e) => acc + (e.monthlyWage || 50000), 0) * 0.95) / 100000).toFixed(2)} Lakhs
              </p>
              <p className="text-[11px] text-zinc-400 mt-1">
                Statutory deductions (PF 12% + PT ₹200) computed automatically.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('payroll')}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Launch Payroll Simulator</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Live Activity Stream */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Organization Activity</span>
            </h3>

            <div className="space-y-3 relative pl-3 border-l border-zinc-800 text-xs">
              {recentActivity.map((act, i) => (
                <div key={i} className="relative group">
                  <div className="absolute -left-[17px] top-1 w-2 h-2 rounded-full bg-emerald-400 ring-4 ring-zinc-900" />
                  <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-0.5">
                    <span className="font-mono">{act.time}</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">{act.tag}</span>
                  </div>
                  <p className="text-zinc-300">
                    <strong className="text-white font-semibold">{act.user}</strong> {act.action}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
