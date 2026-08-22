import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, DollarSign, FileText, Download, ShieldAlert, Sparkles, CheckCircle2, TrendingUp, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { calculateDynamicWage } from '../services/api';
import { PayslipModal } from './PayslipModal';

export const PayrollView: React.FC = () => {
  const { user } = useAuth();
  const [testWage, setTestWage] = useState<number>(60000);
  const [selectedPayslip, setSelectedPayslip] = useState<any | null>(null);

  const isPrivileged = user.role === 'ADMIN' || user.role === 'HR';
  const breakdown = calculateDynamicWage(testWage);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);

  const payslips = [
    { id: 'PS-202607-001', month: 'July 2026', gross: 65000, deductions: 3200, net: 61800, status: 'PAID' },
    { id: 'PS-202606-001', month: 'June 2026', gross: 65000, deductions: 3200, net: 61800, status: 'PAID' },
    { id: 'PS-202605-001', month: 'May 2026', gross: 65000, deductions: 3200, net: 61800, status: 'PAID' },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <span>Payroll & Statutory Compensation</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono font-medium border border-emerald-500/30">
            Active Cycle: August 2026
          </span>
        </h2>
        <p className="text-xs text-zinc-400 mt-0.5">
          Standardized statutory compliance engine computing Basic, HRA, Bonus, LTA, Standard Allowance, PF, and Professional Tax.
        </p>
      </div>

      {!isPrivileged ? (
        /* Regular Employee View: Own Payslips Only */
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-zinc-800/80 bg-gradient-to-br from-indigo-950/30 via-zinc-900 to-zinc-900 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400">My Compensation Summary</span>
              <h3 className="text-2xl font-bold text-white font-mono mt-1">{formatCurrency(61800)} <span className="text-xs font-sans text-zinc-400 font-normal">/ month net</span></h3>
              <p className="text-xs text-zinc-400 mt-1">Disbursed to HDFC Bank (••••4829) on the 31st of every month.</p>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>All Dues Cleared</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-zinc-800/80 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>My Disbursed Payslips</span>
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/80 text-zinc-400 text-[10px] font-bold uppercase border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Slip Reference</th>
                    <th className="py-3 px-4">Pay Period</th>
                    <th className="py-3 px-4">Gross Earnings</th>
                    <th className="py-3 px-4">Deductions</th>
                    <th className="py-3 px-4">Net Payout</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {payslips.map((ps) => (
                    <tr key={ps.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-indigo-300">{ps.id}</td>
                      <td className="py-3.5 px-4 font-sans text-zinc-200">{ps.month}</td>
                      <td className="py-3.5 px-4 text-zinc-200">{formatCurrency(ps.gross)}</td>
                      <td className="py-3.5 px-4 text-rose-400">-{formatCurrency(ps.deductions)}</td>
                      <td className="py-3.5 px-4 text-emerald-400 font-bold">{formatCurrency(ps.net)}</td>
                      <td className="py-3.5 px-4 font-sans">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          {ps.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => setSelectedPayslip(ps)}
                          title="View & Download PDF Salary Slip"
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-emerald-600 text-zinc-300 hover:text-white border border-zinc-800 hover:border-emerald-500 transition-all text-xs font-semibold flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>PDF Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Admin / HR View: Full Statutory Simulator & Controls */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Statutory Simulator */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Wage Controller */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Odoo Hackathon Statutory Formula Simulator
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">Monthly Wage Input</h3>
                </div>
                <div className="text-right font-mono">
                  <span className="text-2xl font-black text-emerald-400">{formatCurrency(testWage)}</span>
                  <span className="block text-[10px] text-zinc-400">Yearly: {formatCurrency(breakdown.yearlyWage)}</span>
                </div>
              </div>

              <input
                type="range"
                min="15000"
                max="200000"
                step="1000"
                value={testWage}
                onChange={(e) => setTestWage(Number(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400">Basic (50%)</span>
                  <p className="text-xs font-bold text-white font-mono mt-0.5">{formatCurrency(breakdown.basicSalary)}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400">Total Deductions</span>
                  <p className="text-xs font-bold text-rose-400 font-mono mt-0.5">-{formatCurrency(breakdown.totalDeductions)}</p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400">Net Take-Home</span>
                  <p className="text-xs font-bold text-emerald-400 font-mono mt-0.5">{formatCurrency(breakdown.netSalary)}</p>
                </div>
              </div>
            </div>

            {/* Statutory Table */}
            <div className="p-5 rounded-2xl glass-panel border border-zinc-800/80 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Statutory Breakdown Specifications
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                  <span className="text-zinc-300">Basic Salary (50% of Wage)</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(breakdown.basicSalary)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                  <span className="text-zinc-300">House Rent Allowance (50% of Basic)</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(breakdown.hra)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                  <span className="text-zinc-300">Performance Bonus (8.33% of Basic)</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(breakdown.performanceBonus)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                  <span className="text-zinc-300">Leave Travel Allowance (8.333% of Basic)</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(breakdown.leaveTravelAllowance)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                  <span className="text-zinc-300">Standard Allowance (Fixed)</span>
                  <span className="font-mono font-bold text-white">{formatCurrency(breakdown.standardAllowance)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                  <span className="text-zinc-300">Fixed Allowance (Balancing Figure)</span>
                  <span className="font-mono font-bold text-indigo-300">{formatCurrency(breakdown.fixedAllowance)}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
                  <span className="text-zinc-300">Provident Fund - Employee (12% of Basic)</span>
                  <span className="font-mono font-bold text-rose-400">-{formatCurrency(breakdown.pfEmployee)}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-zinc-300">Professional Tax (Fixed Statutory)</span>
                  <span className="font-mono font-bold text-rose-400">-{formatCurrency(breakdown.professionalTax)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Organization Payroll Actions */}
          <div className="space-y-6">
            <div className="p-5 rounded-2xl glass-panel border border-zinc-800/80 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Cycle Management</h4>

              <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Active Workforce</span>
                  <span className="font-mono font-bold text-white">5 Employees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total Monthly Liability</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(360000)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Statutory PF Withholding</span>
                  <span className="font-mono font-bold text-rose-400">{formatCurrency(21600)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer">
                Run August Batch Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPayslip && (
        <PayslipModal
          isOpen={!!selectedPayslip}
          onClose={() => setSelectedPayslip(null)}
          month={selectedPayslip.month}
          wage={selectedPayslip.gross}
          employeeName="John Doe"
          employeeId="OIJODO20220001"
          department="Engineering"
          designation="Senior Backend Engineer"
        />
      )}
    </div>
  );
};
