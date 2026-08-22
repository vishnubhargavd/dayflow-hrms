import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Users, Clock, CalendarDays, CreditCard, Target, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const STEPS = [
    {
      id: 'employee',
      icon: <Users size={20} />,
      title: '1. Employee Identity',
      metric: '148 Active Profiles',
      desc: 'Employee profile is created with login ID, department, designation, and manager assignment.',
      detail: 'Auto-generates company login ID (e.g. OIJODO20260001) and initializes RBAC credentials.',
      status: 'IDENTITY_VERIFIED',
    },
    {
      id: 'attendance',
      icon: <Clock size={20} />,
      title: '2. Attendance & Hours',
      metric: '94.8% Attendance Rate',
      desc: 'Daily check-in/out tracking with automatic work hour calculations.',
      detail: 'Upserts daily attendance records and tags late arrivals or overtime hours.',
      status: 'WORK_HOURS_CALCULATED',
    },
    {
      id: 'leave',
      icon: <CalendarDays size={20} />,
      title: '3. Leave & Approvals',
      metric: '4 Requests Pending',
      desc: 'Employee applies for leave; balances auto-deduct upon HR approval.',
      detail: 'Approved date ranges automatically sync to attendance records as LEAVE status.',
      status: 'BALANCES_SYNCED',
    },
    {
      id: 'payroll',
      icon: <CreditCard size={20} />,
      title: '4. Automated Payroll',
      metric: '$142,500 Gross Processed',
      desc: 'Monthly payroll batch processes base salaries, allowances, and tax deductions.',
      detail: 'Generates official payslips linked directly to payroll records.',
      status: 'PAYSLIP_GENERATED',
    },
    {
      id: 'performance',
      icon: <Target size={20} />,
      title: '5. Growth & Reviews',
      metric: '88% Goal Completion',
      desc: 'Employee tracks performance goals; HR conducts periodic review evaluations.',
      detail: 'Stores self-assessments, reviewer feedback, and 1.0-5.0 overall rating scores.',
      status: 'REVIEW_COMPLETED',
    },
    {
      id: 'intelligence',
      icon: <Sparkles size={20} />,
      title: '6. Strategic Insights',
      metric: '3 Signals Emitted',
      desc: 'HR leadership receives actionable analytics and capacity warnings.',
      detail: 'High-visibility dashboard summaries drive data-backed workforce decisions.',
      status: 'INSIGHTS_EMITTED',
    },
  ];

  return (
    <section id="workflow" style={{ padding: '6.5rem 0' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <Badge variant="brand" icon={<Sparkles size={12} />}>Workflow 2.0 Signature System Map</Badge>
          <h2 style={{ fontSize: 'clamp(2.25rem, 4vw, 2.75rem)', fontWeight: 800 }}>
            Connected Workforce Architecture.
          </h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Data flows seamlessly between modules. One action automatically updates balances, schedules, and payroll calculations.
          </p>
        </div>

        {/* Workflow 2.0 Connected System Nodes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', position: 'relative' }}>
          {STEPS.map((step, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(idx)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'rgba(99, 102, 241, 0.18)' : 'var(--bg-elevated)',
                  border: isActive ? '1px solid var(--aura-cyan)' : '1px solid var(--border-subtle)',
                  color: isActive ? 'var(--aura-cyan)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: isActive ? 'var(--brand-glow)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-md)',
                      background: isActive ? 'var(--brand-primary)' : 'var(--bg-surface)',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                      display: 'flex',
                    }}
                  >
                    {step.icon}
                  </div>
                  {isActive && <Zap size={16} color="var(--aura-cyan)" />}
                </div>

                <div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'block' }}>
                    {step.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, marginTop: '2px', display: 'block' }}>
                    {step.metric}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Node Detail Inspector Drawer */}
        <div
          className="glass-card"
          style={{
            padding: '2.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '2rem',
            flexWrap: 'wrap',
            borderColor: 'var(--brand-primary)',
            background: 'var(--bg-surface)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', maxWidth: '640px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Badge variant="brand">{STEPS[activeStep].title}</Badge>
              <Badge variant="success" icon={<CheckCircle2 size={10} />}>{STEPS[activeStep].status}</Badge>
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{STEPS[activeStep].desc}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.65' }}>
              {STEPS[activeStep].detail}
            </p>
          </div>

          <div
            style={{
              padding: '1.5rem',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              minWidth: '250px',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
              TRANSACTIONAL BOUNDARY
            </span>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> PostgreSQL Tx Verified
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              Prisma Event Hook &bull; OK
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
