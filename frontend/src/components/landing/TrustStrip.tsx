import React from 'react';
import { Clock, CreditCard, Target, CalendarDays, LifeBuoy, Sparkles } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const CAPABILITIES = [
    { icon: <Clock size={20} />, label: 'Attendance & Hours', desc: 'Real-time check-in, overtime, and work schedule tracking.' },
    { icon: <CreditCard size={20} />, label: 'Automated Payroll', desc: 'Salary structure items, deduction rules, and automated payslips.' },
    { icon: <CalendarDays size={20} />, label: 'Leave Management', desc: 'Balance allocation, multi-level approvals, and attendance sync.' },
    { icon: <Target size={20} />, label: 'Performance Goals', desc: 'Goal progress tracking, self-assessments, and review cycles.' },
    { icon: <LifeBuoy size={20} />, label: 'HR Helpdesk', desc: 'Employee service ticket workflow with assigned HR officers.' },
    { icon: <Sparkles size={20} />, label: 'HR Intelligence', desc: 'Deterministic analytics, overtime warnings, and workforce insights.' },
  ];

  return (
    <section style={{ padding: '3rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
          {CAPABILITIES.map((cap, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                transition: 'transform 0.2s ease',
              }}
            >
              <div style={{ color: 'var(--brand-primary)' }}>{cap.icon}</div>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{cap.label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{cap.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
