import React from 'react';
import { Badge } from '../common/Badge';
import { ShieldCheck, Key, Lock, FileText, Database } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  return (
    <section id="security" style={{ padding: '6rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="brand" icon={<ShieldCheck size={12} />}>Enterprise Protection</Badge>
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.5rem)', fontWeight: 800 }}>
            Built for security and compliance.
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Protect sensitive employee compensation, attendance records, and personal identity data with strict enterprise access controls.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', width: 'fit-content' }}>
              <Key size={20} />
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Strict Role-Based Access Control</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Fine-grained ADMIN, HR, and EMPLOYEE permission scopes prevent unauthorized data exposure.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', width: 'fit-content' }}>
              <Lock size={20} />
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>IDOR & API Security Guard</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All self-service endpoints derive recipient identity strictly from verified Bearer JWT tokens.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', width: 'fit-content' }}>
              <FileText size={20} />
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Full Audit Trail Logging</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Track logins, salary updates, leave approvals, and privilege changes with immutable audit logs.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '10px', borderRadius: 'var(--radius-md)', background: 'var(--brand-primary-light)', color: 'var(--brand-primary)', width: 'fit-content' }}>
              <Database size={20} />
            </div>
            <h4 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Relational Integrity & Transactions</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              PostgreSQL database with Prisma ORM transactional boundaries prevents partial payroll or balance updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
