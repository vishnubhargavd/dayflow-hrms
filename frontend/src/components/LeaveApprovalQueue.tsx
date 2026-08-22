import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeaveRequest, LeaveStatus } from '../types';
import { api, INITIAL_LEAVE_REQUESTS } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LeaveApprovalQueue: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    leaveTypeId: 'lt-1',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const isHRorAdmin = user.role === 'ADMIN' || user.role === 'HR';

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    const data = await api.getLeaveRequests();
    setRequests(data);
  };

  const handleApprove = async (id: string) => {
    const success = await api.approveLeave(id);
    if (success) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' as LeaveStatus } : r))
      );
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
    }
  };

  const handleReject = async (id: string) => {
    const success = await api.rejectLeave(id);
    if (success) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' as LeaveStatus } : r))
      );
    }
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) return;

    const start = new Date(newLeave.startDate);
    const end = new Date(newLeave.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const created: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: user.employeeId || 'emp-1',
      employee: {
        id: user.employeeId || 'emp-1',
        firstName: 'Current',
        lastName: 'User',
        loginId: user.loginId,
        department: { name: 'Engineering' },
      },
      leaveTypeId: newLeave.leaveTypeId,
      leaveType: {
        id: newLeave.leaveTypeId,
        name: newLeave.leaveTypeId === 'lt-1' ? 'Paid Annual Leave' : 'Medical Sick Leave',
        code: newLeave.leaveTypeId === 'lt-1' ? 'PAL' : 'SL',
        category: newLeave.leaveTypeId === 'lt-1' ? 'PAID' : 'SICK',
      },
      startDate: newLeave.startDate,
      endDate: newLeave.endDate,
      totalDays,
      reason: newLeave.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setRequests([created, ...requests]);
    setIsSubmitModalOpen(false);
    setNewLeave({ leaveTypeId: 'lt-1', startDate: '', endDate: '', reason: '' });
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'APPROVED':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'REJECTED':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
        };
      case 'CANCELLED':
        return {
          bg: 'bg-zinc-800 border-zinc-700 text-zinc-400',
          icon: <Clock className="w-3.5 h-3.5 text-zinc-400" />,
        };
      default:
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
          icon: <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />,
        };
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header & New Request Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Time Off & Leave Approvals</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-mono font-medium border border-zinc-700">
              {filteredRequests.length} Requests
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Transactional leave allocation deduction and automated attendance status synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            <span>Apply for Time Off</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((filter) => {
          const isSelected = statusFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-zinc-800 text-white border border-zinc-700 shadow-sm'
                  : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80 hover:bg-zinc-800'
              }`}
            >
              {filter === 'ALL' ? 'All Requests' : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* Requests Table */}
      <div className="rounded-2xl glass-panel border border-zinc-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-900/90 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Category</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Reason</th>
                <th className="py-3.5 px-4">Status</th>
                {isHRorAdmin && <th className="py-3.5 px-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              <AnimatePresence>
                {filteredRequests.map((req) => {
                  const statusConfig = getStatusBadge(req.status);
                  const isPending = req.status === 'PENDING';

                  return (
                    <motion.tr
                      key={req.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-zinc-900/50 transition-colors"
                    >
                      {/* Employee Info */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center border border-indigo-500/30">
                            {req.employee.firstName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">
                              {req.employee.firstName} {req.employee.lastName}
                            </p>
                            <span className="text-[10px] font-mono text-zinc-400">
                              {req.employee.loginId} • {typeof req.employee.department === 'string' ? req.employee.department : req.employee.department?.name || 'Engineering'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 font-medium">
                          {req.leaveType.name}
                        </span>
                      </td>

                      {/* Dates */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-zinc-200">
                          <span>{req.startDate} to {req.endDate}</span>
                          <span className="block text-[10px] text-zinc-400 mt-0.5">
                            {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                          </span>
                        </div>
                      </td>

                      {/* Reason */}
                      <td className="py-4 px-4 max-w-xs truncate text-zinc-300">
                        <span title={req.reason}>{req.reason}</span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusConfig.bg}`}>
                          {statusConfig.icon}
                          <span>{req.status}</span>
                        </span>
                      </td>

                      {/* Actions for Admin / HR */}
                      {isHRorAdmin && (
                        <td className="py-4 px-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleApprove(req.id)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold flex items-center gap-1 hover:glow-emerald transition-all"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleReject(req.id)}
                                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-semibold flex items-center gap-1 hover:glow-rose transition-all"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </motion.button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-400 font-mono italic">
                              Processed
                            </span>
                          )}
                        </td>
                      )}
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      <AnimatePresence>
        {isSubmitModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSubmitModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-white/10 shadow-2xl space-y-4"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-indigo-400" />
                <span>Submit Time Off Application</span>
              </h3>

              <form onSubmit={handleCreateLeave} className="space-y-4 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Leave Type</label>
                  <select
                    value={newLeave.leaveTypeId}
                    onChange={(e) => setNewLeave({ ...newLeave, leaveTypeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="lt-1">Paid Annual Leave (PAL)</option>
                    <option value="lt-2">Medical Sick Leave (SL)</option>
                    <option value="lt-3">Casual Time Off (CL)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Start Date</label>
                    <input
                      type="date"
                      required
                      value={newLeave.startDate}
                      onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">End Date</label>
                    <input
                      type="date"
                      required
                      value={newLeave.endDate}
                      onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Reason for Leave</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details for your manager..."
                    value={newLeave.reason}
                    onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
