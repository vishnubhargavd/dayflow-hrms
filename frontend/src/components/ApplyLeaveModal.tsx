import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLeave?: (req: any) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose, onApplyLeave }) => {
  const { leaveBalances, applyLeave } = useData();
  const [leaveType, setLeaveType] = useState('PAID');
  const [startDate, setStartDate] = useState('2026-08-28');
  const [endDate, setEndDate] = useState('2026-08-29');
  const [reason, setReason] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const calculateDays = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
    return Math.max(1, diff || 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    const typeNames: Record<string, string> = {
      PAID: 'Paid Annual Leave',
      SICK: 'Medical & Sick Leave',
      UNPAID: 'Unpaid Special Leave',
    };

    const totalDays = calculateDays(startDate, endDate);

    await applyLeave({
      leaveTypeId: `lt-${leaveType.toLowerCase()}`,
      leaveTypeName: typeNames[leaveType] || 'Paid Annual Leave',
      startDate,
      endDate,
      totalDays,
      reason,
    });

    if (onApplyLeave) {
      onApplyLeave({ startDate, endDate, totalDays, reason });
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-teal-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Apply for Time Off</h3>
              <p className="text-xs text-zinc-400">Submit requests for HR review & immediate quota update.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Leave Balances Bar */}
        <div className="px-6 py-3 bg-zinc-950/80 border-b border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">Paid Leave</span>
            <span className="font-bold text-emerald-400 font-mono">
              {leaveBalances.paidAvailable} / {leaveBalances.paidTotal} left
            </span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">Sick Leave</span>
            <span className="font-bold text-sky-400 font-mono">
              {leaveBalances.sickAvailable} / {leaveBalances.sickTotal} left
            </span>
          </div>
          <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
            <span className="text-[10px] text-zinc-400 block">Unpaid Leave</span>
            <span className="font-bold text-zinc-300 font-mono">Available</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Leave Category *</label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors cursor-pointer"
            >
              <option value="PAID">Paid Annual Leave ({leaveBalances.paidAvailable}d remaining)</option>
              <option value="SICK">Medical & Sick Leave ({leaveBalances.sickAvailable}d remaining)</option>
              <option value="UNPAID">Unpaid Special Leave</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">End Date *</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Remarks & Reason *</label>
            <textarea
              rows={3}
              required
              placeholder="Please describe reason for leave and handover delegate..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSuccess}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg shadow-teal-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Request Submitted!</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
