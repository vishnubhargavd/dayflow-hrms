import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plane,
  HeartPulse,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';

interface EmployeeTimeOffViewProps {
  onOpenApplyLeave: () => void;
}

export const EmployeeTimeOffView: React.FC<EmployeeTimeOffViewProps> = ({ onOpenApplyLeave }) => {
  const { user } = useAuth();
  const { leaveBalances, leaveRequests } = useData();

  // Filter requests belonging to current employee
  const myRequests = leaveRequests.filter(
    (r) =>
      r.employeeId === user.employeeId ||
      r.employee?.loginId === user.loginId ||
      r.employee?.firstName?.toLowerCase() === user.name.split(' ')[0]?.toLowerCase()
  );

  // Month navigation state
  const [currentMonth, setCurrentMonth] = useState<'AUGUST 2026' | 'SEPTEMBER 2026'>('AUGUST 2026');

  // Days in August 2026: Aug 1 is Saturday (day offset 5 if Mon is 0)
  // Let's create an accurate 31-day layout for August 2026
  // Days of week: Mon, Tue, Wed, Thu, Fri, Sat, Sun
  // Aug 1 is Saturday (Index 5 in Mon-Sun grid)
  const augustDays = [
    { day: 1, type: 'present', label: '' },
    { day: 2, type: 'weekend', label: '' },
    { day: 3, type: 'present', label: '' },
    { day: 4, type: 'present', label: '' },
    { day: 5, type: 'present', label: '' },
    { day: 6, type: 'present', label: '' },
    { day: 7, type: 'present', label: '' },
    { day: 8, type: 'weekend', label: '' },
    { day: 9, type: 'weekend', label: '' },
    { day: 10, type: 'present', label: '' },
    { day: 11, type: 'present', label: '' },
    { day: 12, type: 'present', label: '' },
    { day: 13, type: 'present', label: '' },
    { day: 14, type: 'present', label: '' },
    { day: 15, type: 'holiday', label: 'OFF' },
    { day: 16, type: 'weekend', label: '' },
    { day: 17, type: 'present', label: '' },
    { day: 18, type: 'present', label: '' },
    { day: 19, type: 'present', label: '' },
    { day: 20, type: 'present', label: '' },
    { day: 21, type: 'present', label: '' },
    { day: 22, type: 'leave', label: 'LEAVE' },
    { day: 23, type: 'leave', label: 'LEAVE' },
    { day: 24, type: 'leave', label: 'LEAVE' },
    { day: 25, type: 'present', label: '' },
    { day: 26, type: 'present', label: '' },
    { day: 27, type: 'present', label: '' },
    { day: 28, type: 'present', label: '' },
    { day: 29, type: 'weekend', label: '' },
    { day: 30, type: 'weekend', label: '' },
    { day: 31, type: 'present', label: '' },
  ];

  // Dynamically overlay all approved/pending leave requests onto the calendar
  const computedDays = augustDays.map((d) => {
    const dateStr = `2026-08-${d.day.toString().padStart(2, '0')}`;
    const matchedLeave = myRequests.find((req) => {
      return dateStr >= req.startDate && dateStr <= req.endDate;
    });

    if (matchedLeave) {
      return {
        ...d,
        type: 'leave',
        label: 'LEAVE',
        status: matchedLeave.status,
      };
    }
    return d;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header matching reference image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Time Off</h1>
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-800/90 text-zinc-300 border border-zinc-700/80 text-xs font-semibold">
              My Leave Balances
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Balance quota deduction and automated calendar synchronization.
          </p>
        </div>

        {/* Gradient "New Time Off Request" button */}
        <button
          onClick={onOpenApplyLeave}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500/80 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all self-start sm:self-center cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New Time Off Request</span>
        </button>
      </div>

      {/* 2 Big Quota Cards from reference image */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Paid Time Off */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <span>Paid Time Off</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                {leaveBalances.paidAvailable.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">Days Available</span>
            </div>
            <p className="text-[11px] text-zinc-500">Financial Year 2026 Allocation</p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-center">
            <span className="text-lg font-black text-zinc-300 font-mono">
              {leaveBalances.paidAvailable}d
            </span>
          </div>
        </div>

        {/* Card 2: Sick Time Off */}
        <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Plane className="w-4 h-4 text-teal-400 -rotate-45" />
              <span>Sick Time Off</span>
            </div>
            <div className="flex items-baseline gap-2 pt-1">
              <span className="text-3xl sm:text-4xl font-black text-teal-300 font-mono">
                {leaveBalances.sickAvailable.toString().padStart(2, '0')}
              </span>
              <span className="text-xs text-zinc-400 font-semibold">Days Available</span>
            </div>
            <p className="text-[11px] text-zinc-500">Requires certificate for &gt; 2 days</p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-teal-950/40 border border-teal-500/30 flex items-center justify-center">
            <span className="text-lg font-black text-teal-300 font-mono">
              {leaveBalances.sickAvailable.toString().padStart(2, '0')}d
            </span>
          </div>
        </div>
      </div>

      {/* Main Big Calendar Container matching reference image */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-4">
        {/* Calendar Header with Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                {currentMonth} Time-Off Calendar
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentMonth('AUGUST 2026')}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentMonth('SEPTEMBER 2026')}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Present</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400" />
              <span>Leave</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-zinc-700" />
              <span>Weekend / Off</span>
            </div>
          </div>
        </div>

        {/* Days of Week Headers */}
        <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-zinc-400 uppercase tracking-wider py-1">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span>SAT</span>
          <span>SUN</span>
        </div>

        {/* 31 Calendar Grid Tiles */}
        <div className="grid grid-cols-7 gap-2 pt-1">
          {computedDays.map((cell) => {
            const isPresent = cell.type === 'present';
            const isLeave = cell.type === 'leave';
            const isHoliday = cell.type === 'holiday';
            const isWeekend = cell.type === 'weekend';

            return (
              <div
                key={cell.day}
                onClick={onOpenApplyLeave}
                title={`Click to apply time off for August ${cell.day}`}
                className={`min-h-[58px] sm:min-h-[68px] p-2 rounded-xl border flex flex-col justify-between transition-all cursor-pointer group ${
                  isLeave
                    ? 'bg-teal-950/40 border-teal-500/60 shadow-lg shadow-teal-500/10 hover:border-teal-400'
                    : isPresent
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/30'
                    : isHoliday
                    ? 'bg-purple-950/30 border-purple-500/40 hover:border-purple-300'
                    : 'bg-zinc-950/60 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-xs sm:text-sm font-bold font-mono ${
                      isLeave
                        ? 'text-teal-300'
                        : isPresent
                        ? 'text-emerald-300'
                        : isHoliday
                        ? 'text-purple-300'
                        : 'text-zinc-500'
                    }`}
                  >
                    {cell.day}
                  </span>
                  <span className="text-[9px] text-zinc-600 group-hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100">
                    +
                  </span>
                </div>

                {/* Status Label Chip inside Cell */}
                <div className="mt-1">
                  {isLeave && (
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-teal-300 font-mono">
                      {cell.label}
                    </span>
                  )}
                  {isHoliday && (
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-purple-300 font-mono">
                      {cell.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* My Submitted Leave History Table */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" />
            <h3 className="text-sm font-bold text-white">My Leave Requests & Status History</h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">{myRequests.length} Total Requests</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-zinc-400 text-[10px] font-bold uppercase border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Request Ref</th>
                <th className="py-3 px-4">Leave Type</th>
                <th className="py-3 px-4">Dates & Duration</th>
                <th className="py-3 px-4">Application Reason</th>
                <th className="py-3 px-4">Reviewer Remarks</th>
                <th className="py-3 px-4 text-right">Approval Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {myRequests.map((req) => (
                <tr key={req.id} className="hover:bg-zinc-950/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-zinc-300">{req.id}</td>
                  <td className="py-3.5 px-4 font-semibold text-white">{req.leaveType?.name}</td>
                  <td className="py-3.5 px-4 font-mono text-zinc-300">
                    {req.startDate} to {req.endDate} ({req.totalDays}d)
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 italic max-w-xs truncate">"{req.reason}"</td>
                  <td className="py-3.5 px-4 text-zinc-400 text-[11px]">
                    {req.reviewerComment ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {req.reviewerComment}
                      </span>
                    ) : (
                      <span className="text-zinc-600">Pending Review</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {req.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                      {req.status === 'PENDING' && <AlertCircle className="w-3 h-3" />}
                      {req.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      <span>{req.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
