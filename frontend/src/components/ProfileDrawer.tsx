import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  CreditCard,
  Calendar,
  Building,
  Mail,
  Phone,
  ShieldAlert,
  ShieldCheck,
  DollarSign,
  TrendingUp,
  Landmark,
  FileText,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Employee, DynamicWageBreakdown } from '../types';
import { useAuth } from '../context/AuthContext';
import { calculateDynamicWage } from '../services/api';

interface ProfileDrawerProps {
  employee: Employee | null;
  onClose: () => void;
  initialTab?: 'profile' | 'salary' | 'attendance';
}

export const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ employee, onClose, initialTab = 'profile' }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'salary' | 'attendance'>(initialTab);
  const [wageInput, setWageInput] = useState<number>(employee?.monthlyWage || 50000);

  if (!employee) return null;

  const isPrivileged = user.role === 'ADMIN' || user.role === 'HR';
  const isSelf = user.employeeId === employee.id;
  const canViewSalary = isPrivileged || isSelf;

  const breakdown: DynamicWageBreakdown = calculateDynamicWage(wageInput);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(val);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-screen max-w-2xl bg-zinc-950/95 border-l border-white/10 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-5 border-b border-zinc-800/80">
                <div className="flex items-center gap-3.5">
                  <img
                    src={employee.profilePicture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${employee.firstName}`}
                    alt={employee.firstName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-indigo-500/50"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">
                        {employee.firstName} {employee.lastName}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                        {employee.loginId}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 font-medium">
                      {employee.designation?.title} • {employee.department?.name}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Tabs */}
              <div className="flex items-center gap-2 mt-5 p-1 rounded-xl bg-zinc-900/90 border border-zinc-800">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'profile'
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Info</span>
                </button>

                <button
                  onClick={() => setActiveTab('salary')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'salary'
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Salary & Statutory</span>
                </button>

                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'attendance'
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Shift & Time Off</span>
                </button>
              </div>

              {/* Tab 1: Profile Details */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl glass-panel border border-zinc-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                        <Building className="w-3 h-3 text-indigo-400" />
                        Department
                      </span>
                      <p className="text-sm font-semibold text-zinc-200">{employee.department?.name || 'General'}</p>
                      <span className="text-[10px] text-zinc-400 font-mono">Code: {employee.department?.code}</span>
                    </div>

                    <div className="p-4 rounded-xl glass-panel border border-zinc-800/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                        <Calendar className="w-3 h-3 text-emerald-400" />
                        Joining Date
                      </span>
                      <p className="text-sm font-semibold text-zinc-200">{employee.dateOfJoining}</p>
                      <span className="text-[10px] text-zinc-400">Cohort: {employee.joiningYear}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl glass-panel border border-zinc-800/80 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Contact & System Identity</h4>
                    
                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/50">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" /> Work Email
                      </span>
                      <span className="text-zinc-200 font-mono font-medium">{employee.user?.email}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/50">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone
                      </span>
                      <span className="text-zinc-200 font-mono">{employee.phone || '+91 98765 00000'}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1.5">
                      <span className="text-zinc-400 flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> System Role
                      </span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-indigo-300 font-mono font-bold text-[10px]">
                        {employee.user?.role || 'EMPLOYEE'}
                      </span>
                    </div>
                  </div>

                  {/* Financial Account Section (Admin / Self only) */}
                  {canViewSalary && (
                    <div className="p-4 rounded-xl glass-panel border border-zinc-800/80 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                        <Landmark className="w-3.5 h-3.5 text-emerald-400" />
                        Disbursement Bank Account
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-zinc-400 text-[10px]">Bank Name</span>
                          <p className="font-semibold text-zinc-200">{employee.bankName || 'HDFC Bank'}</p>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[10px]">Account Number</span>
                          <p className="font-mono font-semibold text-zinc-200">{employee.accountNumber || '••••••••4829'}</p>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[10px]">IFSC Code</span>
                          <p className="font-mono text-zinc-200">{employee.ifscCode || 'HDFC0001234'}</p>
                        </div>
                        <div>
                          <span className="text-zinc-400 text-[10px]">PAN Identifier</span>
                          <p className="font-mono text-zinc-200">{employee.panNumber || 'ABCDE1234F'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 2: Salary & Statutory Breakdown (With RBAC Guard) */}
              {activeTab === 'salary' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-6"
                >
                  {!canViewSalary ? (
                    /* Strict RBAC Guard UI */
                    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-rose-200">Restricted Access (403 Forbidden)</h4>
                      <p className="text-xs text-rose-300/80 leading-relaxed max-w-sm mx-auto">
                        In accordance with Dayflow HRMS security contracts, salary structures and compensation details are confidential. Only Company Administrators and HR managers have access to this module.
                      </p>
                    </div>
                  ) : (
                    /* Admin / Authorized Salary Calculator & Breakdown */
                    <div className="space-y-6">
                      {/* Interactive Monthly Wage Slider */}
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              Dynamic Salary Engine
                            </span>
                            <h4 className="text-base font-bold text-white">Monthly Wage (CTC Base)</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-xl font-mono font-black text-emerald-400">
                              {formatCurrency(wageInput)}
                            </span>
                            <p className="text-[10px] text-zinc-400 font-mono">
                              Yearly: {formatCurrency(breakdown.yearlyWage)}
                            </p>
                          </div>
                        </div>

                        {/* Slider Controller (Admin Only) */}
                        {user.role === 'ADMIN' && (
                          <div className="pt-2">
                            <input
                              type="range"
                              min="15000"
                              max="250000"
                              step="1000"
                              value={wageInput}
                              onChange={(e) => setWageInput(Number(e.target.value))}
                              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between text-[10px] text-zinc-400 font-mono mt-1">
                              <span>₹15,000</span>
                              <span>₹1,00,000</span>
                              <span>₹2,50,000</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Take-Home Pay Highlight Card */}
                      <div className="p-4 rounded-xl glass-panel border border-emerald-500/30 flex items-center justify-between bg-emerald-500/5">
                        <div>
                          <span className="text-xs font-semibold text-emerald-300">Estimated Net Take-Home Pay</span>
                          <p className="text-lg font-mono font-bold text-white">{formatCurrency(breakdown.netSalary)}</p>
                        </div>
                        <div className="text-right text-xs">
                          <span className="text-zinc-400 text-[10px]">Total Statutory Deductions</span>
                          <p className="text-rose-400 font-mono font-semibold">-{formatCurrency(breakdown.totalDeductions)}</p>
                        </div>
                      </div>

                      {/* Statutory Components Detailed Table */}
                      <div className="p-4 rounded-xl glass-panel border border-zinc-800/80 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          Statutory Earnings & Allowances Breakdown
                        </h4>

                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">Basic Salary (50% of Wage)</span>
                            <span className="font-mono font-semibold text-zinc-100">{formatCurrency(breakdown.basicSalary)}</span>
                          </div>

                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">House Rent Allowance - HRA (50% of Basic)</span>
                            <span className="font-mono font-semibold text-zinc-100">{formatCurrency(breakdown.hra)}</span>
                          </div>

                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">Performance Bonus (8.33% of Basic)</span>
                            <span className="font-mono font-semibold text-zinc-100">{formatCurrency(breakdown.performanceBonus)}</span>
                          </div>

                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">Leave Travel Allowance - LTA (8.333% of Basic)</span>
                            <span className="font-mono font-semibold text-zinc-100">{formatCurrency(breakdown.leaveTravelAllowance)}</span>
                          </div>

                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">Standard Allowance (Statutory Fixed)</span>
                            <span className="font-mono font-semibold text-zinc-100">{formatCurrency(breakdown.standardAllowance)}</span>
                          </div>

                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">Fixed Allowance (Balancing Component)</span>
                            <span className={`font-mono font-semibold ${breakdown.fixedAllowance >= 0 ? 'text-zinc-100' : 'text-amber-400'}`}>
                              {formatCurrency(breakdown.fixedAllowance)}
                            </span>
                          </div>

                          {/* Deductions Sub-header */}
                          <div className="pt-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                              Statutory Deductions & Contributions
                            </span>
                          </div>

                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">Provident Fund - Employee (12% of Basic)</span>
                            <span className="font-mono text-rose-400 font-semibold">-{formatCurrency(breakdown.pfEmployee)}</span>
                          </div>

                          <div className="flex justify-between py-1 border-b border-zinc-800/40">
                            <span className="text-zinc-300">Provident Fund - Employer (12% of Basic)</span>
                            <span className="font-mono text-zinc-400 font-semibold">{formatCurrency(breakdown.pfEmployer)}</span>
                          </div>

                          <div className="flex justify-between py-1">
                            <span className="text-zinc-300">Professional Tax (Fixed Statutory)</span>
                            <span className="font-mono text-rose-400 font-semibold">-{formatCurrency(breakdown.professionalTax)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Tab 3: Attendance & Time Off */}
              {activeTab === 'attendance' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 space-y-6"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl glass-panel text-center">
                      <span className="text-[10px] text-zinc-400">Attendance Rate</span>
                      <p className="text-base font-bold text-emerald-400 mt-1">96.4%</p>
                    </div>
                    <div className="p-3.5 rounded-xl glass-panel text-center">
                      <span className="text-[10px] text-zinc-400">Present Days</span>
                      <p className="text-base font-bold text-zinc-200 mt-1">21 / 22</p>
                    </div>
                    <div className="p-3.5 rounded-xl glass-panel text-center">
                      <span className="text-[10px] text-zinc-400">Overtime Logged</span>
                      <p className="text-base font-bold text-indigo-400 mt-1">4.5 hrs</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl glass-panel border border-zinc-800/80 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Annual Leave Balance</h4>
                    
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-300">Paid Annual Leave (PAL)</span>
                        <span className="text-zinc-400 font-mono">11 / 14 Days Remaining</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full w-[78%]" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-zinc-300">Medical / Sick Leave (SL)</span>
                        <span className="text-zinc-400 font-mono">6 / 8 Days Remaining</span>
                      </div>
                      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-sky-500 h-full rounded-full w-[75%]" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-zinc-800/80 mt-6 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 font-mono">ID: {employee.id}</span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-semibold text-zinc-200 border border-zinc-800 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
