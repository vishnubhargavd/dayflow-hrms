import React from 'react';
import { motion } from 'framer-motion';
import { X, Download, ShieldCheck, FileCheck, Building } from 'lucide-react';
import { calculateDynamicWage } from '../services/api';
import { generatePayslipPdf } from '../utils/pdfGenerator';

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
  employeeName = 'Sarah Jenkins',
  employeeId = 'OIHRMG20230001',
  department = 'Human Resources',
  designation = 'Human Resources Officer',
  month = 'August 2026',
  wage = 75000,
}) => {
  if (!isOpen) return null;

  const breakdown = calculateDynamicWage(wage);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const handleDownload = () => {
    generatePayslipPdf({
      employeeName,
      employeeId,
      department,
      designation,
      month,
      wage,
      basicSalary: breakdown.basicSalary,
      hra: breakdown.hra,
      performanceBonus: breakdown.performanceBonus,
      leaveTravelAllowance: breakdown.leaveTravelAllowance,
      standardAllowance: breakdown.standardAllowance,
      fixedAllowance: breakdown.fixedAllowance,
      totalEarnings: breakdown.totalEarnings,
      pfEmployee: breakdown.pfEmployee,
      professionalTax: breakdown.professionalTax,
      totalDeductions: breakdown.totalDeductions,
      netSalary: breakdown.netSalary,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto payslip-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden my-4 payslip-modal-card"
      >
        {/* Top Control Bar (Hidden During Print) */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between modal-control-bar">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-300">Salary Slip Preview • {month}</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
              DISBURSED & VERIFIED
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-emerald-600/30 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Payslip Card */}
        <div className="p-6 sm:p-8 bg-zinc-900 text-zinc-100 font-sans space-y-5 printable-payslip-content">
          {/* Slip Header */}
          <div className="flex items-start justify-between border-b border-zinc-800 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent print-text-emerald">
                  DAYFLOW HRMS
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 print-light-card">
                  Official Statement
                </span>
              </div>
              <p className="text-xs text-zinc-400 print-text-muted">Every workday, perfectly aligned.</p>
              <p className="text-[11px] text-zinc-500 print-text-muted mt-0.5">Corporate HQ: Bangalore, India • CIN: U72200KA2022PTC123456</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-zinc-400 print-text-muted block uppercase">Payslip Period</span>
              <span className="text-base font-bold text-white print-text-dark font-mono">{month}</span>
              <span className="block text-[11px] text-emerald-400 print-text-emerald font-mono mt-0.5">Ref: DF-{Date.now().toString().slice(-6)}</span>
            </div>
          </div>

          {/* Employee & Bank Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs print-light-card">
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">Employee Name:</span>
                <span className="font-bold text-white print-text-dark">{employeeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">Employee ID:</span>
                <span className="font-mono text-indigo-300 font-semibold print-text-dark">{employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">Department:</span>
                <span className="text-zinc-200 print-text-dark">{department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">Designation:</span>
                <span className="text-zinc-200 print-text-dark">{designation}</span>
              </div>
            </div>

            <div className="space-y-1.5 border-l border-zinc-800/80 pl-4">
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">Bank Name:</span>
                <span className="text-white print-text-dark font-medium">HDFC Bank Ltd.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">Account No:</span>
                <span className="font-mono text-zinc-200 print-text-dark">••••••••4829</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">PAN Number:</span>
                <span className="font-mono text-zinc-200 print-text-dark">ABCDE1234F</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400 print-text-muted">Days Paid / Worked:</span>
                <span className="font-mono text-emerald-400 print-text-emerald font-bold">31 / 31 Days</span>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            {/* Earnings */}
            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-bold text-emerald-400 print-text-emerald flex justify-between uppercase text-[10px] print-light-table">
                <span>Earnings Breakdown</span>
                <span>Amount (INR)</span>
              </div>
              <div className="space-y-1 px-1 font-mono text-[11px]">
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Basic Salary (50%)</span>
                  <span>{formatCurrency(breakdown.basicSalary)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">HRA Allowance</span>
                  <span>{formatCurrency(breakdown.hra)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Performance Bonus</span>
                  <span>{formatCurrency(breakdown.performanceBonus)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Leave Travel (LTA)</span>
                  <span>{formatCurrency(breakdown.leaveTravelAllowance)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Standard Allowance</span>
                  <span>{formatCurrency(breakdown.standardAllowance)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Fixed Allowance</span>
                  <span>{formatCurrency(breakdown.fixedAllowance)}</span>
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 font-bold text-rose-400 print-text-rose flex justify-between uppercase text-[10px] print-light-table">
                <span>Statutory Deductions</span>
                <span>Amount (INR)</span>
              </div>
              <div className="space-y-1 px-1 font-mono text-[11px]">
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Provident Fund (PF 12%)</span>
                  <span className="text-rose-400 print-text-rose">-{formatCurrency(breakdown.pfEmployee)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Professional Tax (PT)</span>
                  <span className="text-rose-400 print-text-rose">-{formatCurrency(breakdown.professionalTax)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Income Tax (TDS)</span>
                  <span className="text-zinc-500 print-text-muted">₹0</span>
                </div>
                <div className="flex justify-between text-zinc-300 print-text-dark">
                  <span className="font-sans">Loss of Pay (LOP)</span>
                  <span className="text-zinc-500 print-text-muted">₹0</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grand Totals & Net Pay Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-zinc-950 to-zinc-950 border border-emerald-500/30 flex items-center justify-between print-net-card">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-400 print-text-emerald">Net Take-Home Disbursed</span>
              <p className="text-2xl font-black text-white font-mono mt-0.5 print-text-dark">{formatCurrency(breakdown.netSalary)}</p>
              <span className="text-[11px] text-zinc-400 print-text-muted">Gross: {formatCurrency(breakdown.totalEarnings)} | Deductions: {formatCurrency(breakdown.totalDeductions)}</span>
            </div>
            <div className="flex items-center gap-2 text-right">
              <ShieldCheck className="w-8 h-8 text-emerald-400 print-text-emerald" />
              <div className="text-[10px] text-zinc-400 print-text-muted">
                <span className="font-bold text-white print-text-dark block">Digitally Certified</span>
                <span>Dayflow Automated Payroll</span>
              </div>
            </div>
          </div>

          {/* Print Footer Note (Single Page) */}
          <div className="border-t border-zinc-800/80 pt-3 flex justify-between items-center text-[10px] text-zinc-500 print-text-muted font-mono">
            <span>SECURED WITH SHA-256 ENCRYPTION • SYSTEM GENERATED</span>
            <span>PAGE 1 OF 1</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
