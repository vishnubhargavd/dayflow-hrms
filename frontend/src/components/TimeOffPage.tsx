import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Plane,
  Upload,
  Calendar,
  X,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LeaveRequest, LeaveStatus } from '../types';
import { api, INITIAL_LEAVE_REQUESTS } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const TimeOffPage: React.FC = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState('lt-1');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [allocationDays, setAllocationDays] = useState(1);
  const [reason, setReason] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);

  const isAdmin = user.role === 'ADMIN' || user.role === 'HR';

  useEffect(() => {
    api.getLeaveRequests().then((data) => setRequests(data || INITIAL_LEAVE_REQUESTS));
  }, []);

  const handleApprove = async (id: string) => {
    await api.approveLeave(id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'APPROVED' as LeaveStatus } : r))
    );
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#34d399', '#a855f7'],
    });
  };

  const handleReject = async (id: string) => {
    await api.rejectLeave(id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'REJECTED' as LeaveStatus } : r))
    );
  };

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) return;

    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: user.employeeId || 'emp-1',
      employee: {
        id: user.employeeId || 'emp-1',
        firstName: 'John',
        lastName: 'Doe',
        loginId: user.loginId,
        department: 'Engineering',
      },
      leaveTypeId: leaveType,
      leaveType: {
        id: leaveType,
        name: leaveType === 'lt-1' ? 'Paid Time Off' : 'Sick Time Off',
        code: leaveType === 'lt-1' ? 'PTO' : 'SL',
        category: leaveType === 'lt-1' ? 'PAID' : 'SICK',
      },
      startDate,
      endDate,
      totalDays: Number(allocationDays) || 1,
      reason,
      attachmentName: attachment || undefined,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    setRequests([newReq, ...requests]);
    setIsNewModalOpen(false);
    setReason('');
    setStartDate('');
    setEndDate('');
    setAttachment(null);
  };

  // Mock calendar days for August 2026
  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    let status: 'present' | 'leave' | 'weekend' | 'holiday' | 'none' = 'present';
    if ([2, 8, 9, 15, 16, 22, 23, 29, 30].includes(dayNum)) status = 'weekend';
    if ([22, 23, 24].includes(dayNum)) status = 'leave';
    if (dayNum === 15) status = 'holiday';
    return { day: dayNum, status };
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header & New Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-zinc-900/90 border border-zinc-800 backdrop-blur-xl shadow-xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Time Off & Leave Portal</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-mono border border-purple-500/20">
              {isAdmin ? 'Admin Approval Queue' : 'My Leave Balances'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time balance quota management and automated calendar synchronization.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>+ NEW Time Off</span>
        </button>
      </div>

      {/* Top Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Paid Time Off Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/30 via-zinc-900 to-zinc-900 border border-purple-500/30 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-1">
              <CalendarDays className="w-4 h-4 text-purple-400" />
              Paid Time Off
            </span>
            <h3 className="text-3xl font-black text-white font-mono mt-1">
              24 <span className="text-sm font-sans text-zinc-400 font-normal">Days Available</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Valid across financial year 2026</p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border-2 border-purple-500/30 flex items-center justify-center font-mono font-bold text-purple-300 text-lg">
            80%
          </div>
        </div>

        {/* Sick Time Off Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-sky-950/30 via-zinc-900 to-zinc-900 border border-sky-500/30 flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-1">
              <Plane className="w-4 h-4 text-sky-400" />
              Sick Time Off
            </span>
            <h3 className="text-3xl font-black text-white font-mono mt-1">
              07 <span className="text-sm font-sans text-zinc-400 font-normal">Days Available</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1">Requires medical certificate for &gt; 2 days</p>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border-2 border-sky-500/30 flex items-center justify-center font-mono font-bold text-sky-300 text-lg">
            70%
          </div>
        </div>
      </div>

      {/* Admin View: Full Approval Queue Table */}
      {isAdmin ? (
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
              Employee Leave Requests & Actions
            </h3>
            <span className="text-xs text-zinc-400 font-mono">{requests.length} Requests Total</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-400 uppercase text-[10px] font-bold border-b border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Employee</th>
                  <th className="py-3 px-4">Time Off Type</th>
                  <th className="py-3 px-4">Duration & Dates</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Attachment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                <AnimatePresence>
                  {requests.map((req) => {
                    const isPending = req.status === 'PENDING';
                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-zinc-950/40 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white block">
                            {req.employee.firstName} {req.employee.lastName}
                          </span>
                          <span className="text-[10px] text-purple-300 font-mono">
                            {req.employee.loginId}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-zinc-200">{req.leaveType.name}</td>
                        <td className="py-3.5 px-4 font-mono text-zinc-300">
                          {req.startDate} to {req.endDate}
                          <span className="block text-[10px] text-zinc-400 font-sans">
                            {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs text-zinc-300 truncate" title={req.reason}>
                          {req.reason}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-400">
                          {req.attachmentName ? (
                            <span className="text-[11px] text-purple-300 underline font-mono">
                              {req.attachmentName}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              req.status === 'APPROVED'
                                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                                : req.status === 'REJECTED'
                                ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleApprove(req.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-600/30 cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold shadow-md shadow-rose-600/30 cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-zinc-500 italic">Resolved</span>
                          )}
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Employee View: Calendar with Colored Markers */
        <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>August 2026 Time-Off & Presence Calendar</span>
            </h3>

            {/* Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-zinc-400">Present</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span className="text-zinc-400">On Leave</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                <span className="text-zinc-400">Weekend</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 pt-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day} className="text-[10px] font-bold text-zinc-500 uppercase py-1">
                {day}
              </span>
            ))}

            {calendarDays.map((d) => {
              let markerBg = 'bg-zinc-950/60 border-zinc-800/80 text-zinc-300';
              if (d.status === 'present') markerBg = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300';
              if (d.status === 'leave') markerBg = 'bg-sky-500/20 border-sky-500/40 text-sky-200 font-bold';
              if (d.status === 'weekend') markerBg = 'bg-zinc-900/40 border-zinc-800/40 text-zinc-600';
              if (d.status === 'holiday') markerBg = 'bg-purple-500/20 border-purple-500/40 text-purple-200';

              return (
                <div
                  key={d.day}
                  className={`p-3 rounded-xl border text-xs font-mono transition-all ${markerBg}`}
                >
                  <span className="text-xs font-bold block">{d.day}</span>
                  <span className="text-[9px] uppercase tracking-wider block mt-0.5">
                    {d.status === 'leave' ? 'LEAVE' : d.status === 'holiday' ? 'OFF' : ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* [+ NEW] Leave Request Modal */}
      <AnimatePresence>
        {isNewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Plane className="w-4 h-4 text-purple-400" />
                  <span>Request Time Off</span>
                </h3>
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateLeave} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Time Off Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="lt-1">Paid Time Off (24 Days Available)</option>
                    <option value="lt-2">Sick Time Off (07 Days Available)</option>
                    <option value="lt-3">Casual Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Validity Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Validity End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Allocation Days</label>
                  <input
                    type="number"
                    min="1"
                    max="14"
                    value={allocationDays}
                    onChange={(e) => setAllocationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Reason for Request</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Provide details for manager review..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Attachment (Medical Certificate, etc.)</label>
                  <label className="px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-purple-400" />
                      <span>{attachment ? attachment : 'Choose file...'}</span>
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setAttachment(e.target.files?.[0]?.name || 'document.pdf')}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30 cursor-pointer"
                  >
                    Submit Application
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
