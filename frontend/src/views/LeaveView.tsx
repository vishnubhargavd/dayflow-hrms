import React, { useState, useEffect } from 'react';
import { fetchMyLeaveBalances, type LeaveBalanceItem } from '../api/leave.api';
import { apiRequest } from '../api/client';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/common/StatCard';
import { CalendarDays, Plus, X } from 'lucide-react';

export const LeaveView: React.FC = () => {
  const { showToast } = useToast();
  const [balances, setBalances] = useState<LeaveBalanceItem[]>([]);
  const [showApplyModal, setShowApplyModal] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadLeaveBalances = async () => {
    try {
      const data = await fetchMyLeaveBalances();
      setBalances(data);
    } catch {
      // Handled
    }
  };

  useEffect(() => {
    loadLeaveBalances();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      showToast('Please fill out all required leave fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      const leaveTypeId = balances[0]?.leaveTypeId || 'lt-paid';
      await apiRequest('/leave/me/requests', {
        method: 'POST',
        body: JSON.stringify({ leaveTypeId, startDate, endDate, reason }),
      });
      showToast('Leave request submitted successfully!', 'success');
      setShowApplyModal(false);
      loadLeaveBalances();
    } catch (err: any) {
      showToast(err.message || 'Leave application failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Leave & Time-Off Management</h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: '4px 0 0 0' }}>View allocated leave balances, submit vacation requests, and track HR approvals.</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            borderRadius: 'var(--radius-md)',
            background: '#7CFFB2',
            color: '#060806',
            fontWeight: 800,
            fontSize: '0.875rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} /> Apply For Leave
        </button>
      </div>

      {/* Leave Balances Grid */}
      {balances.length === 0 ? (
        <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', padding: '3.5rem', textAlign: 'center', color: '#8A918A' }}>
          <CalendarDays size={36} color="#7CFFB2" style={{ marginBottom: '0.75rem' }} />
          <h4 style={{ color: '#F3F1E8', fontWeight: 800, margin: 0 }}>NO LEAVE BALANCES ALLOCATED YET</h4>
          <p style={{ fontSize: '0.8125rem', marginTop: '6px' }}>Your leave balances will appear once allocated by your HR manager.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {balances.map((bal) => (
            <StatCard
              key={bal.id}
              title={`${bal.leaveType.name} Balance`}
              value={`${bal.remainingDays} Days`}
              change={`${bal.usedDays} Used / ${bal.allocatedDays} Allocated`}
              trend="neutral"
              icon={<CalendarDays size={16} />}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {showApplyModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            background: 'rgba(3,4,3,0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
          onClick={() => setShowApplyModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(460px, 94vw)',
              background: '#0D120F',
              border: '1px solid rgba(124,255,178,0.22)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              position: 'relative',
            }}
          >
            <button onClick={() => setShowApplyModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Submit Leave Application</h3>

            <form onSubmit={handleApplyLeave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>START DATE</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ padding: '10px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>END DATE</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ padding: '10px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>REASON FOR LEAVE</label>
                <textarea
                  rows={3}
                  placeholder="Provide reason for time-off request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  style={{ padding: '10px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  marginTop: '0.5rem',
                  padding: '12px',
                  borderRadius: 'var(--radius-full)',
                  background: '#7CFFB2',
                  color: '#060806',
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  border: 'none',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT LEAVE REQUEST'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
