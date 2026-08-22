import React, { useState, useEffect } from 'react';
import { fetchHelpdeskTickets, createHelpdeskTicket, type HelpdeskTicket } from '../api/helpdesk.api';
import { useToast } from '../context/ToastContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { LifeBuoy, Plus, CheckCircle, X } from 'lucide-react';

export const HelpdeskView: React.FC = () => {
  const { showToast } = useToast();
  const [tickets, setTickets] = useState<HelpdeskTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<string>('IT_SUPPORT');
  const [priority, setPriority] = useState<string>('MEDIUM');
  const [description, setDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadTickets = async () => {
    setIsLoading(true);
    try {
      const data = await fetchHelpdeskTickets();
      setTickets(data);
    } catch {
      // Handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      showToast('Please fill out the ticket subject and description', 'warning');
      return;
    }

    setIsSubmitting(true);
    try {
      await createHelpdeskTicket(subject, category, priority, description);
      showToast('Helpdesk ticket created successfully!', 'success');
      setShowCreateModal(false);
      setSubject('');
      setDescription('');
      loadTickets();
    } catch (err: any) {
      showToast(err.message || 'Failed to create ticket', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Helpdesk & Support Workspace</h2>
          <p style={{ color: '#8A918A', fontSize: '0.875rem', margin: '4px 0 0 0' }}>Raise IT support requests, HR queries, and facility tickets with tracking.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
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
          <Plus size={16} /> New Support Ticket
        </button>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard title="Total Support Tickets" value={`${tickets.length}`} change="Active Records" trend="neutral" icon={<LifeBuoy size={16} />} />
        <StatCard title="Open Workspace Tickets" value={`${tickets.filter((t) => t.status === 'OPEN').length}`} change="Pending Resolution" trend="neutral" icon={<LifeBuoy size={16} />} />
        <StatCard title="SLA Response Time" value="< 2.5 hrs" change="Target Met" trend="up" icon={<CheckCircle size={16} />} />
      </div>

      {/* Ticket List */}
      <div style={{ background: '#0D120F', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8', marginBottom: '1rem' }}>Support Ticket Feed</h3>

        {isLoading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#8A918A' }}>Loading support tickets...</div>
        ) : tickets.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#8A918A' }}>
            <LifeBuoy size={32} color="#7CFFB2" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ color: '#F3F1E8', fontWeight: 700, margin: 0 }}>NO HELPDESK TICKETS FILED YET</h4>
            <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>Support tickets filed by you or your team will be displayed here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tickets.map((t) => (
              <div key={t.id} style={{ background: '#131A15', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(243, 241, 232, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#7CFFB2', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>{t.ticketNumber}</span>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#F3F1E8' }}>{t.subject}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#8A918A', display: 'block', marginTop: '4px' }}>Category: {t.category} | Priority: {t.priority}</span>
                </div>
                <Badge variant={t.status === 'RESOLVED' || t.status === 'CLOSED' ? 'success' : 'warning'}>{t.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showCreateModal && (
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
          onClick={() => setShowCreateModal(false)}
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
            <button onClick={() => setShowCreateModal(false)} style={{ position: 'absolute', top: '18px', right: '18px', background: 'transparent', border: 'none', color: '#8A918A', cursor: 'pointer' }}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#F3F1E8', margin: 0 }}>Create Support Ticket</h3>

            <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>SUBJECT</label>
                <input
                  type="text"
                  placeholder="Summary of issue or query..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ padding: '10px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ padding: '10px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  >
                    <option value="IT_SUPPORT">IT Support</option>
                    <option value="HR_QUERY">HR Query</option>
                    <option value="PAYROLL_QUERY">Payroll Query</option>
                    <option value="FACILITIES">Facilities</option>
                  </select>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>PRIORITY</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ padding: '10px', background: '#131A15', border: '1px solid rgba(243,241,232,0.12)', color: '#F3F1E8', borderRadius: 'var(--radius-md)', outline: 'none' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>DESCRIPTION</label>
                <textarea
                  rows={3}
                  placeholder="Detailed description of issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
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
                {isSubmitting ? 'CREATING...' : 'SUBMIT SUPPORT TICKET'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
