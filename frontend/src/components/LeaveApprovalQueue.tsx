import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Filter,
  User,
  Plane,
  AlertCircle,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { ApplyLeaveModal } from './ApplyLeaveModal';

export const LeaveApprovalQueue: React.FC = () => {
  const { user } = useAuth();
  const { leaveRequests, leaveBalances, approveLeave, rejectLeave } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const isHRorAdmin = user.role === 'ADMIN' || user.role === 'HR';

  const handleApprove = async (id: string) => {
    await approveLeave(id, 'Approved via Leave Dashboard');
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#6ee7b7'],
    });
  };

  const handleReject = async (id: string) => {
    await rejectLeave(id, 'Declined due to team schedule overlap');
  };

  const filteredRequests = leaveRequests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (!isHRorAdmin) {
      // Employees see only their requests
      return (
        r.employeeId === user.employeeId ||
        r.employee?.loginId === user.loginId ||
        r.employee?.firstName?.toLowerCase() === user.name.split(' ')[0]?.toLowerCase()
      );
    }
    return true;
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{isHRorAdmin ? 'Time-Off & Leave Management' : 'My Leave Applications'}</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 font-mono font-medium border border-emerald-500/30">
                {leaveRequests.filter((r) => r.status === 'PENDING').length} Pending
              </span>
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            {isHRorAdmin
              ? 'Review pending time-off applications with instant balance reconciliation and notifications.'
              : 'Submit vacation, sick leave, or casual time off with live quota tracking.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-lg shadow-teal-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Time Off</span>
          </button>
        </div>
      </div>

      {/* Quota Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Paid Annual Leave (PAL)</span>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {leaveBalances.paidAvailable}{' '}
            <span className="text-xs text-zinc-400 font-sans font-normal">/ {leaveBalances.paidTotal} Days</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Sick / Medical Leave (SL)</span>
          <p className="text-2xl font-black text-teal-400 font-mono mt-1">
            {leaveBalances.sickAvailable}{' '}
            <span className="text-xs text-zinc-400 font-sans font-normal">/ {leaveBalances.sickTotal} Days</span>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-[10px] text-zinc-400 uppercase font-bold">Casual / Other Leaves</span>
          <p className="text-2xl font-black text-zinc-300 font-mono mt-1">
            {leaveBalances.casualAvailable}{' '}
            <span className="text-xs text-zinc-400 font-sans font-normal">/ {leaveBalances.casualTotal} Days</span>
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === filter
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        <span className="text-xs text-zinc-500 font-mono">{filteredRequests.length} Applications</span>
      </div>

      {/* Requests Grid */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredRequests.map((req) => (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400">
                  <CalendarDays className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">
                      {req.employee?.firstName} {req.employee?.lastName}
                    </h4>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-zinc-800 text-zinc-400">
                      {req.leaveType?.name}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : req.status === 'REJECTED'
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    <span className="font-mono text-zinc-200">
                      {req.startDate} to {req.endDate}
                    </span>{' '}
                    ({req.totalDays} Total Days) — <span className="italic">"{req.reason}"</span>
                  </p>
                </div>
              </div>

              {/* Action Buttons for HR */}
              {isHRorAdmin && req.status === 'PENDING' && (
                <div className="flex items-center gap-2 self-end md:self-center">
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-semibold border border-rose-500/30 transition-all cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(req.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    Approve
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <ApplyLeaveModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </div>
  );
};
