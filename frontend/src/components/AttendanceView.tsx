import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, CheckCircle2, AlertTriangle, TrendingUp, Sparkles, UserCheck } from 'lucide-react';
import { SystrayWidget } from './SystrayWidget';
import { SmartInsightsBanner } from './SmartInsightsBanner';

export const AttendanceView: React.FC = () => {
  const weeklyRecords = [
    { day: 'Monday', date: 'Aug 18', checkIn: '09:02 AM', checkOut: '05:32 PM', workHours: 8.5, overtime: 0.5, status: 'PRESENT' },
    { day: 'Tuesday', date: 'Aug 19', checkIn: '08:55 AM', checkOut: '05:05 PM', workHours: 8.16, overtime: 0.16, status: 'PRESENT' },
    { day: 'Wednesday', date: 'Aug 20', checkIn: '09:15 AM', checkOut: '01:15 PM', workHours: 4.0, overtime: 0, status: 'HALF_DAY' },
    { day: 'Thursday', date: 'Aug 21', checkIn: '08:50 AM', checkOut: '06:20 PM', workHours: 9.5, overtime: 1.5, status: 'PRESENT' },
    { day: 'Friday', date: 'Aug 22', checkIn: '09:00 AM', checkOut: 'In Progress', workHours: 4.5, overtime: 0, status: 'PRESENT' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Smart Insights Banner */}
      <SmartInsightsBanner />

      {/* Header & Systray Action Card */}
      <div className="p-6 rounded-2xl glass-panel border border-zinc-800/80 bg-gradient-to-r from-indigo-950/30 via-zinc-900 to-zinc-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Live Attendance Station
          </span>
          <h2 className="text-xl font-bold text-white tracking-tight">Daily Shift & Attendance Portal</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-lg leading-relaxed">
            Record shifts, calculate exact working hours and overtime against the standard 8.0-hour workday.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 flex flex-col items-center gap-3">
          <span className="text-[10px] text-zinc-400 font-mono font-medium">Quick Punch Station</span>
          <SystrayWidget />
        </div>
      </div>

      {/* Monthly Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl glass-panel border border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Monthly Attendance Rate
          </span>
          <p className="text-2xl font-bold text-emerald-400 font-mono">96.4%</p>
          <span className="text-[10px] text-zinc-400 font-medium">+4.2% from previous period</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5 mb-1">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> Total Present Days
          </span>
          <p className="text-2xl font-bold text-white font-mono">21 <span className="text-xs text-zinc-500">/ 22</span></p>
          <span className="text-[10px] text-zinc-400">1 approved half-day</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5 mb-1">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Average Daily Shift
          </span>
          <p className="text-2xl font-bold text-zinc-200 font-mono">8.22 <span className="text-xs text-zinc-500">hrs</span></p>
          <span className="text-[10px] text-emerald-400 font-medium">Within healthy baseline</span>
        </div>

        <div className="p-4 rounded-xl glass-panel border border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Cumulative Overtime
          </span>
          <p className="text-2xl font-bold text-purple-400 font-mono">4.50 <span className="text-xs text-zinc-500">hrs</span></p>
          <span className="text-[10px] text-zinc-400">Eligible for payroll bonus</span>
        </div>
      </div>

      {/* Weekly History Table */}
      <div className="p-5 rounded-2xl glass-panel border border-zinc-800/80 space-y-4 shadow-xl">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400" />
          <span>Current Week Attendance Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border-b border-zinc-800">
              <tr>
                <th className="py-3 px-4">Day & Date</th>
                <th className="py-3 px-4">Check-In</th>
                <th className="py-3 px-4">Check-Out</th>
                <th className="py-3 px-4">Working Hours</th>
                <th className="py-3 px-4">Overtime</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-mono">
              {weeklyRecords.map((rec, i) => (
                <tr key={i} className="hover:bg-zinc-900/40 transition-colors">
                  <td className="py-3.5 px-4 font-sans">
                    <span className="font-bold text-white">{rec.day}</span>
                    <span className="block text-[10px] text-zinc-400 font-mono">{rec.date}</span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-200">{rec.checkIn}</td>
                  <td className="py-3.5 px-4 text-zinc-200">{rec.checkOut}</td>
                  <td className="py-3.5 px-4 text-zinc-100 font-bold">{rec.workHours} hrs</td>
                  <td className="py-3.5 px-4">
                    {rec.overtime > 0 ? (
                      <span className="text-emerald-400 font-bold">+{rec.overtime} hrs</span>
                    ) : (
                      <span className="text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      rec.status === 'PRESENT'
                        ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {rec.status}
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
