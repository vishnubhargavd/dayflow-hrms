import React from 'react';
import { Sparkles, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '4rem 0 2rem 0',
        marginTop: '6rem',
      }}
    >
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {/* Brand Col */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--brand-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sparkles size={16} color="#FFFFFF" />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Dayflow<span style={{ color: 'var(--brand-primary)' }}>.</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Everything your people need. One unified, intelligent HR operating system.
            </p>
          </div>

          {/* Module Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Modules</span>
            <a href="#features" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Attendance & Working Hours</a>
            <a href="#features" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Leave & Time-Off Management</a>
            <a href="#features" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Automated Payroll & Payslips</a>
            <a href="#features" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Performance & Goal Reviews</a>
          </div>

          {/* Platform & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>Platform</span>
            <a href="#intelligence" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Deterministic HR Intelligence</a>
            <a href="#security" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Enterprise RBAC & Security</a>
            <a href="#workflow" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Connected Workflows</a>
            <a href="http://localhost:5000/api/v1/health" target="_blank" rel="noreferrer" style={{ fontSize: '0.875rem', color: 'var(--brand-primary)' }}>
              Backend Health Diagnostics &rarr;
            </a>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '1.5rem',
            fontSize: '0.8125rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span>&copy; {new Date().getFullYear()} Dayflow HRMS. Built for local high-performance enterprise deployments.</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={14} color="var(--brand-primary)" />
            <span>Encrypted local workspace &bull; PostgreSQL &bull; Prisma ORM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
