import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, Printer, ShieldCheck, FileCheck, Building } from 'lucide-react';
import { calculateDynamicWage } from '../services/api';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeName?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  month?: string;
  wage?: number;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({
  isOpen,
  onClose,
  employeeName = 'Sarah Smith',
  employeeId = 'OISASM20230002',
  department = 'Product Design',
  designation = 'Lead UI/UX Designer',
  month = 'July 2026',
  wage = 75000,
}) => {
  if (!isOpen) return null;

  const breakdown = calculateDynamicWage(wage);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const slipData = `DAYFLOW HRMS - SALARY SLIP\nPay Period: ${month}\nEmployee: ${employeeName} (${employeeId})\nDepartment: ${department}\nDesignation: ${designation}\nGross Earnings: ${formatCurrency(breakdown.totalEarnings)}\nTotal Deductions: ${formatCurrency(breakdown.totalDeductions)}\nNet Disbursed Pay: ${formatCurrency(breakdown.netSalary)}\nAuthorized by: Dayflow Statutory Payroll Engine`;
    const blob = new Blob([slipData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dayflow_Payslip_${employeeId}_${month.replace(' ', '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Top Control Bar */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-300">Salary Slip Preview • {month}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              DISBURSED & VERIFIED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Card */}
        <div className="p-8 bg-zinc-900 text-zinc-100 font-sans space-y-6">
          {/* Slip Header */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  DAYFLOW HRMS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
                  Official Statement
                </span>
              </div>
              <p className="text-xs text-zinc-400">Every workday, perfectly aligned.</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Corporate HQ: Bangalore, India • CIN: U72200KA2022PTC123456</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-400 block uppercase">Payslip Period</span>
              <span className="text-base font-bold text-white font-mono">{month}</span>
              <span className="block text-[11px] text-emerald-400 font-mono mt-0.5">Ref: DF-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>

          {/* Employee & Bank Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Employee Name:</span>
                <span className="font-bold text-white">{employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Employee ID:</span>
                <span className="font-mono text-indigo-300 font-semibold">{employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Department:</span>
                <span className="text-zinc-200">{department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Designation:</span>
                <span className="text-zinc-200">{designation}</span>
              </div>
            </div>

            <div className="space-y-1.5 border-l border-zinc-800/80 pl-4">
              <div className="flex justify-between">
                <span className="text-zinc-400">Bank Name:</span>
                <span className="text-white font-medium">HDFC Bank</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Account No:</span>
                <span className="font-mono text-zinc-200">••••••••4829</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">PAN Number:</span>
                <span className="font-mono text-zinc-200">ABCDE1234F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Days Paid / Worked:</span>
                <span className="font-mono text-emerald-400 font-bold">31 / 31 Days</span>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-2 gap-6 text-xs">
            {/* Earnings */}
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-bold text-emerald-400 flex justify-between uppercase text-[10px]">
                <span>Earnings Breakdown</span>
                <span>Amount (INR)</span>
              </div>
              <div className="space-y-1.5 px-1 font-mono">
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Basic Salary (50%)</span>
                  <span>{formatCurrency(breakdown.basicSalary)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">House Rent Allowance (HRA)</span>
                  <span>{formatCurrency(breakdown.hra)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Performance Bonus</span>
                  <span>{formatCurrency(breakdown.performanceBonus)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Leave Travel Allowance</span>
                  <span>{formatCurrency(breakdown.leaveTravelAllowance)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Standard Allowance</span>
                  <span>{formatCurrency(breakdown.standardAllowance)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Fixed Allowance</span>
                  <span>{formatCurrency(breakdown.fixedAllowance)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-bold text-rose-400 flex justify-between uppercase text-[10px]">
                <span>Statutory Deductions</span>
                <span>Amount (INR)</span>
              </div>
              <div className="space-y-1.5 px-1 font-mono">
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Provident Fund (PF - 12%)</span>
                  <span className="text-rose-400">-{formatCurrency(breakdown.pfEmployee)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Professional Tax (PT)</span>
                  <span className="text-rose-400">-{formatCurrency(breakdown.professionalTax)}</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Income Tax (TDS / Est)</span>
                  <span className="text-zinc-500">₹0</span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span className="font-sans">Loss of Pay (Unpaid Leave)</span>
                  <span className="text-zinc-500">₹0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Totals & Net Pay Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400">Net Take-Home Disbursed</span>
              <p className="text-2xl font-black text-white font-mono mt-0.5">{formatCurrency(breakdown.netSalary)}</p>
              <span className="text-[11px] text-zinc-400">Gross: {formatCurrency(breakdown.totalEarnings)} | Deductions: {formatCurrency(breakdown.totalDeductions)}</span>
            </div>
            <div className="flex items-center gap-2 text-right">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <div className="text-[10px] text-zinc-400">
                <span className="font-bold text-white block">Digitally Certified</span>
                <span>Dayflow Automated Payroll</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
