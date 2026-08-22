import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckSquare, CheckCircle2, XCircle, Clock, Filter, MessageSquare, AlertCircle, Sparkles, Send } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ApprovalsView: React.FC = () => {
  const { leaveRequests, approveLeave, rejectLeave } = useData();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    await approveLeave(id, commentText || 'Approved by HR Officer');
    setActionFeedback(`Request ${id} Approved successfully`);
    setActiveCommentId(null);
    setCommentText('');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const handleReject = async (id: string) => {
    await rejectLeave(id, commentText || 'Declined due to team schedule overlap');
    setActionFeedback(`Request ${id} Declined and quota restored`);
    setActiveCommentId(null);
    setCommentText('');
    setTimeout(() => setActionFeedback(null), 2500);
  };

  const filteredRequests = leaveRequests.filter((r) => {
    if (filterStatus === 'ALL') return true;
    return r.status === filterStatus;
  });

  const pendingCount = leaveRequests.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="w-full space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              HR Decision Engine
            </span>
            {pendingCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                {pendingCount} Pending Decision
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Time-Off & Leave Approvals Queue</h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Live cross-portal decision stream. Any leaves submitted by employees appear here instantly for 1-click approvals and balance adjustments.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterStatus === status
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionFeedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{actionFeedback}</span>
        </motion.div>
      )}

      {/* Requests List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-5 rounded-2xl bg-zinc-900/90 border transition-all space-y-4 shadow-lg ${
                  req.status === 'PENDING' ? 'border-amber-500/30 ring-1 ring-amber-500/20' : 'border-zinc-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${req.employee?.firstName || 'User'}`}
                      alt={req.employee?.firstName}
                      className="w-11 h-11 rounded-full border border-zinc-700 bg-zinc-800"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {req.employee?.firstName} {req.employee?.lastName}
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          {req.employee?.loginId}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
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
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {req.employee?.department?.name || 'Engineering'} • Category:{' '}
                        <span className="font-semibold text-zinc-200">{req.leaveType?.name}</span>
                      </p>
                    </div>
                  </div>

                  {/* Date & Duration Tag */}
                  <div className="text-left sm:text-right">
                    <span className="text-xs font-bold text-white font-mono block">
                      {req.startDate} to {req.endDate}
                    </span>
                    <span className="text-[11px] text-zinc-400">{req.totalDays} Total Days</span>
                  </div>
                </div>

                {/* Reason Box */}
                <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase block">Application Remarks</span>
                  <p className="text-zinc-200 italic font-medium">"{req.reason}"</p>
                  {req.reviewerComment && (
                    <div className="mt-2 pt-2 border-t border-zinc-800/80 text-[11px] text-emerald-400 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reviewer Note: {req.reviewerComment}</span>
                    </div>
                  )}
                </div>

                {/* Action Controls for Pending Requests */}
                {req.status === 'PENDING' && (
                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-zinc-800/60">
                    {activeCommentId === req.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add decision remarks or handoff notes..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                        <button
                          onClick={() => setActiveCommentId(null)}
                          className="text-xs text-zinc-400 hover:text-white px-2 py-1 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setActiveCommentId(req.id)}
                        className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 transition-colors self-start cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Add approval comment</span>
                      </button>
                    )}

                    <div className="flex items-center gap-2 self-end">
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-4 py-1.5 rounded-xl bg-rose-600/15 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold border border-rose-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve Leave</span>
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="p-8 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 text-xs text-zinc-500">
              No leave requests found for this filter.
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
