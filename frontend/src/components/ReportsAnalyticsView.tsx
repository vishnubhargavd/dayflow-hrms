import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  FileSpreadsheet,
  Download,
  TrendingUp,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const ReportsAnalyticsView: React.FC = () => {
  const departmentBreakdown = [
    { dept: 'Engineering', count: 48, cost: '₹93.5K', pct: 42, color: 'bg-emerald-500' },
    { dept: 'Sales', count: 26, cost: '₹49.3K', pct: 24, color: 'bg-emerald-400' },
    { dept: 'Marketing', count: 18, cost: '₹33.5K', pct: 15, color: 'bg-teal-400' },
    { dept: 'HR & Admin', count: 14, cost: '₹32.7K', pct: 12, color: 'bg-indigo-400' },
    { dept: 'Finance', count: 12, cost: '₹32.3K', pct: 10, color: 'bg-blue-400' },
    { dept: 'Operations', count: 10, cost: '₹28.5K', pct: 8, color: 'bg-purple-400' },
  ];

  const leaveDistribution = [
    { type: 'Sick Leave', pct: '32%', color: 'bg-emerald-500' },
    { type: 'Annual / Paid Leave', pct: '28%', color: 'bg-emerald-400' },
    { type: 'Casual Leave', pct: '18%', color: 'bg-teal-400' },
    { type: 'Paternity / Maternity', pct: '12%', color: 'bg-indigo-400' },
    { type: 'Bereavement / Special', pct: '10%', color: 'bg-amber-400' },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-zinc-900 to-zinc-900 border border-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Executive Intelligence & BI
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Reports & Analytics Suite</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Real-time workforce intelligence covering attendance patterns, statutory payroll liabilities, and leave utilization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>August 2026</span>
          </div>
        </div>
      </div>

      {/* Summary KPI Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Total Employees</span>
          <p className="text-xl font-bold text-white font-mono mt-1">128 <span className="text-[10px] text-emerald-400 font-sans">+2.1%</span></p>
          <span className="text-[10px] text-zinc-500">119 Active today</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Average Attendance</span>
          <p className="text-xl font-bold text-emerald-400 font-mono mt-1">94.2% <span className="text-[10px] text-emerald-300 font-sans">+1.5%</span></p>
          <span className="text-[10px] text-zinc-500">Benchmark: 90%</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Attrition Rate</span>
          <p className="text-xl font-bold text-sky-400 font-mono mt-1">3.2%</p>
          <span className="text-[10px] text-zinc-500">Industry low</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Days Taken (YTD)</span>
          <p className="text-xl font-bold text-purple-400 font-mono mt-1">2,450</p>
          <span className="text-[10px] text-zinc-500">Across 128 staff</span>
        </div>
        <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800">
          <span className="text-[10px] font-bold text-zinc-400 uppercase">Avg Leave Balance</span>
          <p className="text-xl font-bold text-amber-400 font-mono mt-1">12 Days</p>
          <span className="text-[10px] text-zinc-500">Per employee</span>
        </div>
      </div>

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend Line Chart Visualization */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Monthly Attendance Curve</span>
              </h3>
              <p className="text-[11px] text-zinc-400">Daily presence % across August</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
              94.2% Avg
            </span>
          </div>

          {/* SVG Line Chart Representation */}
          <div className="h-44 w-full pt-4 flex flex-col justify-between">
            <div className="relative h-32 w-full flex items-end justify-between px-2 border-b border-l border-zinc-800">
              {/* Simulated bars/points */}
              {[75, 88, 92, 95, 94, 91, 89, 93, 96, 94, 95, 92, 94].map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group">
                  <div
                    style={{ height: `${(h - 50) * 2.2}px` }}
                    className="w-3.5 rounded-t-sm bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 transition-all cursor-pointer"
                    title={`Day ${i * 2 + 1}: ${h}%`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-zinc-500 font-mono px-2 pt-1">
              <span>Aug 1</span>
              <span>Aug 8</span>
              <span>Aug 15</span>
              <span>Aug 22</span>
              <span>Aug 31</span>
            </div>
          </div>
        </div>

        {/* Leave Distribution Donut / Breakdown */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-teal-400" />
                <span>Leave Category Distribution (YTD)</span>
              </h3>
              <p className="text-[11px] text-zinc-400">2,450 total days approved</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {leaveDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-300 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
                    {item.type}
                  </span>
                  <span className="font-bold font-mono text-white">{item.pct}</span>
                </div>
                <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                  <div
                    style={{ width: item.pct }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Department-wise Payroll Breakdown */}
        <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Department Payroll Cost</span>
              </h3>
              <p className="text-[11px] text-zinc-400">Monthly expense breakdown</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {departmentBreakdown.map((dept, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/40">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dept.color}`} />
                  <span className="text-zinc-200">{dept.dept}</span>
                  <span className="text-[10px] text-zinc-500">({dept.count} staff)</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">{dept.cost}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Reports Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 shadow-xl">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Generate & Export Statutory Reports</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Download pre-formatted audit reports with digital cryptographic hash for compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* Card 1: Attendance Report */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white">Monthly Attendance & Shift Log</span>
              <p className="text-[11px] text-zinc-400 mt-1">Full shift records, daily check-in/out timestamps, overtime hours.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-200 border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>PDF</span>
              </button>
              <button className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-xs font-bold text-emerald-300 hover:text-white border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Card 2: Leave & Balance Report */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white">Leave Accrual & Balance Audit</span>
              <p className="text-[11px] text-zinc-400 mt-1">Employee-wise leave quota, approved requests, pending leaves.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-200 border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>PDF</span>
              </button>
              <button className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-xs font-bold text-emerald-300 hover:text-white border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel</span>
              </button>
            </div>
          </div>

          {/* Card 3: Payroll Summary */}
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-white">August Statutory Payroll Summary</span>
              <p className="text-[11px] text-zinc-400 mt-1">Gross salary, PF employee/employer, Professional Tax & net disbursements.</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-bold text-zinc-200 border border-zinc-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>PDF</span>
              </button>
              <button className="flex-1 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-xs font-bold text-emerald-300 hover:text-white border border-emerald-500/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Excel</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
