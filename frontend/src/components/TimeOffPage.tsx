import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Plus,
  Plane,
  Upload,
  Calendar,
  X,
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
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#017E84', '#10B981', '#714B67'],
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

  const calendarDays = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    let status: 'present' | 'leave' | 'weekend' | 'holiday' | 'none' = 'present';
    if ([2, 8, 9, 15, 16, 22, 23, 29, 30].includes(dayNum)) status = 'weekend';
    if ([22, 23, 24].includes(dayNum)) status = 'leave';
    if (dayNum === 15) status = 'holiday';
    return { day: dayNum, status };
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-5">
      {/* Odoo Control Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Time Off</span>
            <span className="text-xs px-2 py-0.5 rounded bg-[#714B67]/20 text-[#C9A9C2] font-mono border border-[#714B67]/30">
              {isAdmin ? 'Approval Queue' : 'My Leave Balances'}
            </span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Balance quota deduction and automated calendar synchronization.
          </p>
        </div>

        <button
          onClick={() => setIsNewModalOpen(true)}
          className="px-3.5 py-1.5 bg-[#714B67] hover:bg-[#5B3C53] text-white rounded text-xs font-medium shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ NEW Time Off</span>
        </button>
      </div>

      {/* Top Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Paid Time Off Card */}
        <div className="p-5 rounded-lg bg-[#1E1F29] border border-[#2E303E] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#A08098] flex items-center gap-1.5 mb-0.5">
              <CalendarDays className="w-3.5 h-3.5 text-[#714B67]" />
              Paid Time Off
            </span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">
              24 <span className="text-xs font-sans text-zinc-400 font-normal">Days Available</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Financial Year 2026 Allocation</p>
          </div>

          <div className="w-12 h-12 rounded bg-[#714B67]/15 border border-[#714B67]/30 flex items-center justify-center font-mono font-bold text-[#C9A9C2] text-sm">
            24d
          </div>
        </div>

        {/* Sick Time Off Card */}
        <div className="p-5 rounded-lg bg-[#1E1F29] border border-[#2E303E] flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#017E84] flex items-center gap-1.5 mb-0.5">
              <Plane className="w-3.5 h-3.5 text-[#017E84]" />
              Sick Time Off
            </span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">
              07 <span className="text-xs font-sans text-zinc-400 font-normal">Days Available</span>
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">Requires certificate for &gt; 2 days</p>
          </div>

          <div className="w-12 h-12 rounded bg-[#017E84]/15 border border-[#017E84]/30 flex items-center justify-center font-mono font-bold text-[#017E84] text-sm">
            07d
          </div>
        </div>
      </div>

      {/* Admin View: Full Approval Queue Table */}
      {isAdmin ? (
        <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Employee Leave Requests & Actions
            </h3>
            <span className="text-xs text-zinc-400 font-mono">{requests.length} Requests</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#252736] text-zinc-400 uppercase text-[10px] font-semibold border-b border-[#2E303E]">
                <tr>
                  <th className="py-2.5 px-3.5">Employee</th>
                  <th className="py-2.5 px-3.5">Time Off Type</th>
                  <th className="py-2.5 px-3.5">Duration</th>
                  <th className="py-2.5 px-3.5">Reason</th>
                  <th className="py-2.5 px-3.5">Attachment</th>
                  <th className="py-2.5 px-3.5">Status</th>
                  <th className="py-2.5 px-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E303E]">
                <AnimatePresence>
                  {requests.map((req) => {
                    const isPending = req.status === 'PENDING';
                    return (
                      <motion.tr
                        key={req.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-[#16171F] transition-colors"
                      >
                        <td className="py-2.5 px-3.5">
                          <span className="font-medium text-white block">
                            {req.employee.firstName} {req.employee.lastName}
                          </span>
                          <span className="text-[10px] text-[#A08098] font-mono">
                            {req.employee.loginId}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-zinc-200">{req.leaveType.name}</td>
                        <td className="py-2.5 px-3.5 font-mono text-zinc-300">
                          {req.startDate} to {req.endDate}
                          <span className="block text-[10px] text-zinc-400 font-sans">
                            {req.totalDays} {req.totalDays === 1 ? 'day' : 'days'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 max-w-xs text-zinc-300 truncate" title={req.reason}>
                          {req.reason}
                        </td>
                        <td className="py-2.5 px-3.5 text-zinc-400">
                          {req.attachmentName ? (
                            <span className="text-[11px] text-[#017E84] underline font-mono">
                              {req.attachmentName}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="py-2.5 px-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              req.status === 'APPROVED'
                                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                                : req.status === 'REJECTED'
                                ? 'bg-[#DC2626]/15 text-[#EF4444] border border-[#DC2626]/30'
                                : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3.5 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Solid Odoo Teal Approve Button */}
                              <button
                                onClick={() => handleApprove(req.id)}
                                className="px-2.5 py-1 bg-[#017E84] hover:bg-[#00666A] text-white rounded text-xs font-medium cursor-pointer"
                              >
                                Approve
                              </button>
                              {/* Crisp Red Reject Button */}
                              <button
                                onClick={() => handleReject(req.id)}
                                className="px-2.5 py-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded text-xs font-medium cursor-pointer"
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
        <div className="p-4 rounded-lg bg-[#1E1F29] border border-[#2E303E] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#714B67]" />
              <span>August 2026 Time-Off Calendar</span>
            </h3>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                <span className="text-zinc-400">Present</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#017E84]" />
                <span className="text-zinc-400">Leave</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#2E303E]" />
                <span className="text-zinc-400">Weekend</span>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5 pt-1 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day} className="text-[10px] font-semibold text-zinc-500 uppercase py-0.5">
                {day}
              </span>
            ))}

            {calendarDays.map((d) => {
              let markerBg = 'bg-[#16171F] border-[#2E303E] text-zinc-300';
              if (d.status === 'present') markerBg = 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]';
              if (d.status === 'leave') markerBg = 'bg-[#017E84]/20 border-[#017E84]/40 text-[#017E84] font-bold';
              if (d.status === 'weekend') markerBg = 'bg-[#16171F]/50 border-[#2E303E]/40 text-zinc-600';
              if (d.status === 'holiday') markerBg = 'bg-[#714B67]/20 border-[#714B67]/40 text-[#C9A9C2]';

              return (
                <div
                  key={d.day}
                  className={`p-2.5 rounded border text-xs font-mono transition-colors ${markerBg}`}
                >
                  <span className="text-xs font-semibold block">{d.day}</span>
                  <span className="text-[8px] uppercase tracking-wider block mt-0.5">
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
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              className="relative w-full max-w-md bg-[#1E1F29] border border-[#2E303E] rounded-lg p-5 shadow-2xl z-10 space-y-3.5"
            >
              <div className="flex items-center justify-between pb-2.5 border-b border-[#2E303E]">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-[#017E84]" />
                  <span>Request Time Off</span>
                </h3>
                <button
                  onClick={() => setIsNewModalOpen(false)}
                  className="p-1 rounded bg-[#16171F] hover:bg-[#252736] text-zinc-400 hover:text-white border border-[#2E303E] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <form onSubmit={handleCreateLeave} className="space-y-3 text-xs">
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Time Off Type</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                  >
                    <option value="lt-1">Paid Time Off (24 Days Available)</option>
                    <option value="lt-2">Sick Time Off (07 Days Available)</option>
                    <option value="lt-3">Casual Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-400 mb-1 font-medium">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
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
                    className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 font-mono focus:outline-none focus:border-[#714B67]"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Reason for Request</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Provide reason for review..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] rounded text-zinc-200 focus:outline-none focus:border-[#714B67]"
                  />
                </div>

                {/* File Attachment */}
                <div>
                  <label className="block text-zinc-400 mb-1 font-medium">Attachment</label>
                  <label className="px-2.5 py-1.5 bg-[#16171F] border border-[#2E303E] hover:border-zinc-600 rounded text-zinc-300 flex items-center justify-between cursor-pointer">
                    <span className="flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5 text-[#017E84]" />
                      <span>{attachment ? attachment : 'Choose file...'}</span>
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setAttachment(e.target.files?.[0]?.name || 'document.pdf')}
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsNewModalOpen(false)}
                    className="px-3 py-1.5 rounded bg-[#16171F] hover:bg-[#252736] text-zinc-300 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-[#714B67] hover:bg-[#5B3C53] text-white font-medium shadow-sm cursor-pointer"
                  >
                    Submit
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
