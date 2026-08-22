import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle2, UserCheck, Sparkles, UserX, AlertCircle } from 'lucide-react';
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & Date Navigation Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Attendance Station</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
              {isAdmin ? 'Organization View' : 'My Attendance'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Standard 8.0-hour shift calculation with automatic overtime bonus tracking.
          </p>
        </div>

        {/* Date Navigator + View Mode Toggle */}
        <div className="flex items-center gap-3">
          {/* < Date > */}
          <div className="flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => setCurrentDateIndex((prev) => Math.min(dates.length - 1, prev + 1))}
              disabled={currentDateIndex === dates.length - 1}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono font-bold text-zinc-200 px-2 min-w-[100px] text-center">
              {activeDateString}
            </span>

            <button
              onClick={() => setCurrentDateIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentDateIndex === 0}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Date / Day Mode Button */}
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setViewMode('date')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'date' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'day' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Employee Top Summary Metrics */}
      {!isAdmin ? (
        <div className="space-y-6">
          {/* 3 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center justify-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Count of Days Present
              </span>
              <p className="text-3xl font-black text-white font-mono">21 <span className="text-xs text-zinc-500 font-sans font-normal">Days</span></p>
              <span className="text-[10px] text-zinc-400">96.4% on-time record</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 flex items-center justify-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Leaves Count
              </span>
              <p className="text-3xl font-black text-white font-mono">03 <span className="text-xs text-zinc-500 font-sans font-normal">Days</span></p>
              <span className="text-[10px] text-zinc-400">Approved time-off</span>
            </div>

            <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-center space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center justify-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Total Working Days
              </span>
              <p className="text-3xl font-black text-white font-mono">24 <span className="text-xs text-zinc-500 font-sans font-normal">Days</span></p>
              <span className="text-[10px] text-zinc-400">Cycle: August 2026</span>
            </div>
          </div>

          {/* Personal Shift Table */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">My Shift History Log</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Check In</th>
                    <th className="py-3 px-4">Check Out</th>
                    <th className="py-3 px-4">Work Hours</th>
                    <th className="py-3 px-4">Extra Hours</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {myLogs.map((log, i) => (
                    <tr key={i} className="hover:bg-zinc-950/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">{log.date}</td>
                      <td className="py-3.5 px-4 font-sans text-zinc-300">{log.day}</td>
                      <td className="py-3.5 px-4 text-zinc-200">{log.checkIn}</td>
                      <td className="py-3.5 px-4 text-zinc-200">{log.checkOut}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{log.workHours} hrs</td>
                      <td className="py-3.5 px-4 text-purple-400">+{log.extraHours} hrs</td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
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
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              All Employee Attendance Records — {activeDateString}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">5 Employees Logged</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Emp</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Check In</th>
                  <th className="py-3 px-4">Check Out</th>
                  <th className="py-3 px-4">Work Hours</th>
                  <th className="py-3 px-4">Extra Hours</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {INITIAL_ALL_ATTENDANCE.map((rec) => (
                  <tr key={rec.id} className="hover:bg-zinc-950/40 transition-colors">
                    <td className="py-3.5 px-4 text-zinc-400">{rec.date}</td>
                    <td className="py-3.5 px-4 font-sans">
                      <span className="font-bold text-white block">{rec.employeeName}</span>
                      <span className="text-[10px] text-purple-300 font-mono">{rec.loginId}</span>
                    </td>
                    <td className="py-3.5 px-4 font-sans text-zinc-300">{rec.department}</td>
                    <td className="py-3.5 px-4 text-zinc-200">{rec.checkIn || '—'}</td>
                    <td className="py-3.5 px-4 text-zinc-200">{rec.checkOut || '—'}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {rec.workHours ? `${rec.workHours} hrs` : '0 hrs'}
                    </td>
                    <td className="py-3.5 px-4 text-purple-300">
                      {rec.overtimeHours ? `+${rec.overtimeHours} hrs` : '—'}
                    </td>
                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.status === 'PRESENT'
                            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                            : rec.status === 'LEAVE'
                            ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                            : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
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
