import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_ALL_ATTENDANCE } from '../services/api';

export const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'date' | 'day'>('date');

  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';

  const dates = ['Aug 22, 2026', 'Aug 21, 2026', 'Aug 20, 2026', 'Aug 19, 2026', 'Aug 18, 2026'];
  const activeDateString = dates[currentDateIndex];

  // Employee's personal logs
  const myLogs = [
    { date: 'Aug 22, 2026', day: 'Friday', checkIn: '09:00 AM', checkOut: '05:30 PM', workHours: 8.5, extraHours: 0.5, status: 'PRESENT' },
    { date: 'Aug 21, 2026', day: 'Thursday', checkIn: '08:50 AM', checkOut: '06:20 PM', workHours: 9.5, extraHours: 1.5, status: 'PRESENT' },
    { date: 'Aug 20, 2026', day: 'Wednesday', checkIn: '09:15 AM', checkOut: '01:15 PM', workHours: 4.0, extraHours: 0, status: 'HALF_DAY' },
    { date: 'Aug 19, 2026', day: 'Tuesday', checkIn: '08:55 AM', checkOut: '05:05 PM', workHours: 8.16, extraHours: 0.16, status: 'PRESENT' },
    { date: 'Aug 18, 2026', day: 'Monday', checkIn: '09:02 AM', checkOut: '05:32 PM', workHours: 8.5, extraHours: 0.5, status: 'PRESENT' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
      {/* Odoo Control Header & Date Navigator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Attendance</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#714B67]/20 text-[#C9A9C2] font-mono border border-[#714B67]/30">
              {isAdmin ? 'Admin Overview' : 'My Shifts'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Standard 8.0-hour workday shift tracking and overtime calculation.
          </p>
        </div>

        {/* Date Navigator + View Mode */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 bg-[#16171F] px-2 py-1 rounded border border-[#2E303E]">
            <button
              onClick={() => setCurrentDateIndex((prev) => Math.min(dates.length - 1, prev + 1))}
              disabled={currentDateIndex === dates.length - 1}
              className="p-1 rounded hover:bg-[#252736] text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-medium text-zinc-200 px-2 min-w-[95px] text-center">
              {activeDateString}
            </span>

            <button
              onClick={() => setCurrentDateIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentDateIndex === 0}
              className="p-1 rounded hover:bg-[#252736] text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center bg-[#16171F] p-0.5 rounded border border-[#2E303E] text-xs">
            <button
              onClick={() => setViewMode('date')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                viewMode === 'date' ? 'bg-[#714B67] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded font-medium transition-colors cursor-pointer ${
                viewMode === 'day' ? 'bg-[#714B67] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Employee Top Summary Metrics */}
      {!isAdmin ? (
        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] text-center space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#10B981] flex items-center justify-center gap-1">
                <UserCheck className="w-3.5 h-3.5" />
                Count of Days Present
              </span>
              <p className="text-2xl font-bold text-white font-mono">21 <span className="text-xs text-zinc-500 font-sans font-normal">Days</span></p>
              <span className="text-[10px] text-zinc-400">96.4% on-time check-ins</span>
            </div>

            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] text-center space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#017E84] flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Leaves Count
              </span>
              <p className="text-2xl font-bold text-white font-mono">03 <span className="text-xs text-zinc-500 font-sans font-normal">Days</span></p>
              <span className="text-[10px] text-zinc-400">Approved time off</span>
            </div>

            <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] text-center space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A08098] flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Total Working Days
              </span>
              <p className="text-2xl font-bold text-white font-mono">24 <span className="text-xs text-zinc-500 font-sans font-normal">Days</span></p>
              <span className="text-[10px] text-zinc-400">August 2026 Cycle</span>
            </div>
          </div>

          {/* Personal Table */}
          <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">My Shift History Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#252736] text-zinc-400 uppercase text-[10px] font-semibold border-b border-[#2E303E]">
                  <tr>
                    <th className="py-2.5 px-3.5">Date</th>
                    <th className="py-2.5 px-3.5">Day</th>
                    <th className="py-2.5 px-3.5">Check In</th>
                    <th className="py-2.5 px-3.5">Check Out</th>
                    <th className="py-2.5 px-3.5">Work Hours</th>
                    <th className="py-2.5 px-3.5">Extra Hours</th>
                    <th className="py-2.5 px-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2E303E] font-mono">
                  {myLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-[#16171F] transition-colors">
                      <td className="py-2.5 px-3.5 font-bold text-white">{log.date}</td>
                      <td className="py-2.5 px-3.5 font-sans text-zinc-300">{log.day}</td>
                      <td className="py-2.5 px-3.5 text-zinc-200">{log.checkIn}</td>
                      <td className="py-2.5 px-3.5 text-zinc-200">{log.checkOut}</td>
                      <td className="py-2.5 px-3.5 text-[#10B981] font-semibold">{log.workHours} hrs</td>
                      <td className="py-2.5 px-3.5 text-[#C9A9C2]">+{log.extraHours} hrs</td>
                      <td className="py-2.5 px-3.5 font-sans">
                        <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-medium">
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Admin View: Full Employee Table */
        <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              All Employee Attendance — {activeDateString}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">5 Employees Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#252736] text-zinc-400 uppercase text-[10px] font-semibold border-b border-[#2E303E]">
                <tr>
                  <th className="py-2.5 px-3.5">Date</th>
                  <th className="py-2.5 px-3.5">Emp</th>
                  <th className="py-2.5 px-3.5">Department</th>
                  <th className="py-2.5 px-3.5">Check In</th>
                  <th className="py-2.5 px-3.5">Check Out</th>
                  <th className="py-2.5 px-3.5">Work Hours</th>
                  <th className="py-2.5 px-3.5">Extra Hours</th>
                  <th className="py-2.5 px-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E303E] font-mono">
                {INITIAL_ALL_ATTENDANCE.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#16171F] transition-colors">
                    <td className="py-2.5 px-3.5 text-zinc-400">{rec.date}</td>
                    <td className="py-2.5 px-3.5 font-sans">
                      <span className="font-medium text-white block">{rec.employeeName}</span>
                      <span className="text-[10px] text-[#A08098] font-mono">{rec.loginId}</span>
                    </td>
                    <td className="py-2.5 px-3.5 font-sans text-zinc-300">{rec.department}</td>
                    <td className="py-2.5 px-3.5 text-zinc-200">{rec.checkIn || '—'}</td>
                    <td className="py-2.5 px-3.5 text-zinc-200">{rec.checkOut || '—'}</td>
                    <td className="py-2.5 px-3.5 font-semibold text-[#10B981]">
                      {rec.workHours ? `${rec.workHours} hrs` : '0 hrs'}
                    </td>
                    <td className="py-2.5 px-3.5 text-[#C9A9C2]">
                      {rec.overtimeHours ? `+${rec.overtimeHours} hrs` : '—'}
                    </td>
                    <td className="py-2.5 px-3.5 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          rec.status === 'PRESENT'
                            ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                            : rec.status === 'LEAVE'
                            ? 'bg-[#017E84]/20 text-[#017E84] border border-[#017E84]/40'
                            : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
