import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { StatCard } from '../common/StatCard';
import { Clock, CreditCard, Target, CheckCircle2, TrendingUp, Sparkles } from 'lucide-react';

export const FeatureShowcase: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState<'eng' | 'hr' | 'sales'>('eng');
  const [includeAllowance, setIncludeAllowance] = useState<boolean>(true);
  const [goalProgress, setGoalProgress] = useState<number>(88);

  const calculateNetSalary = () => {
    const base = 8500;
    const allowance = includeAllowance ? 1850 : 0;
    const tax = 850;
    return base + allowance - tax;
  };

  return (
    <section id="features" style={{ padding: '6rem 0', display: 'flex', flexDirection: 'column', gap: '7rem' }}>
      <div className="container">
        {/* Section 1: Attendance Analytics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Badge variant="brand" icon={<Clock size={12} />}>Attendance & Analytics</Badge>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.6rem)', fontWeight: 800 }}>
              Understand your workforce in real time.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Eliminate attendance ambiguity with live check-ins, automated work hour calculations, overtime tracking, and department trend analytics.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>Geofenced check-in & check-out verification</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>Automated attendance correction request workflow</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>Department attendance rate & overtime trend reports</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <StatCard title="Average Weekly Work Hours" value="41.2 hrs" change="+1.4%" trend="up" icon={<TrendingUp size={16} />} />
            
            {/* Interactive Department Bar Graph */}
            <div style={{ background: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SELECT DEPARTMENT DEMO</span>
                <Badge variant="success">96.4% OPTIMAL</Badge>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  onClick={() => setSelectedDept('eng')}
                  style={{
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedDept === 'eng' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: selectedDept === 'eng' ? '1px solid var(--brand-primary)' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Engineering Team</span>
                    <span style={{ color: 'var(--brand-primary)', fontWeight: 700 }}>98.2%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '98.2%', background: 'var(--brand-gradient)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>

                <div
                  onClick={() => setSelectedDept('hr')}
                  style={{
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedDept === 'hr' ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                    border: selectedDept === 'hr' ? '1px solid var(--brand-primary)' : '1px solid transparent',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600 }}>Human Resources</span>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>95.0%</span>
                  </div>
                  <div style={{ height: '8px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '95%', background: 'var(--color-success)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Automated Payroll */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', order: 2 }}>
            <StatCard title="August Gross Disbursement" value="$142,500.00" change="Calculated" trend="neutral" icon={<CreditCard size={16} />} />
            
            {/* Interactive Salary Component Calculator */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>INTERACTIVE SALARY CALCULATOR</span>
                <label style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeAllowance}
                    onChange={(e) => setIncludeAllowance(e.target.checked)}
                  />
                  <span>HRA Allowance</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Basic Base Salary:</span>
                <span style={{ fontWeight: 700 }}>$8,500.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>HRA & Allowances:</span>
                <span style={{ fontWeight: 700, color: includeAllowance ? 'var(--color-success)' : 'var(--text-muted)' }}>
                  {includeAllowance ? '+$1,850.00' : '$0.00'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Tax & Provident Fund:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-error)' }}>-$850.00</span>
              </div>
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9375rem', fontWeight: 800 }}>
                <span>Net Disbursement:</span>
                <span style={{ color: 'var(--brand-primary)' }}>${calculateNetSalary().toLocaleString()}.00</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', order: 1 }}>
            <Badge variant="brand" icon={<CreditCard size={12} />}>Payroll & Compensation</Badge>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.6rem)', fontWeight: 800 }}>
              Make every payroll cycle simpler.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Configure custom salary components, earning and deduction rules, and automated payslip generation with zero payroll processing errors.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>Custom Salary Structures with percentage/fixed components</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>One-click monthly payroll batch processing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="var(--color-success)" />
                <span>Self-service employee payslip portal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Performance Goals */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Badge variant="brand" icon={<Target size={12} />}>Performance & Growth</Badge>
            <h2 style={{ fontSize: 'clamp(1.85rem, 3vw, 2.6rem)', fontWeight: 800 }}>
              Help your people achieve more.
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Set measurable OKRs, track progress, conduct self-assessments, and evaluate review cycles with multi-dimensional rating scores.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Interactive Goal Progress Simulator</span>
              <Badge variant="success" icon={<Sparkles size={10} />}>{goalProgress}% COMPLETED</Badge>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 700 }}>
                <span>Migrate HRMS Backend to Microservices</span>
                <span style={{ color: 'var(--brand-primary)' }}>{goalProgress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={goalProgress}
                onChange={(e) => setGoalProgress(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--brand-primary)' }}
              />
              <div style={{ height: '6px', width: '100%', background: 'rgba(255,255,255,0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${goalProgress}%`, background: 'var(--brand-gradient)', transition: 'width 0.1s linear' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Evaluated Rating Score: {(3.0 + (goalProgress / 100) * 2.0).toFixed(1)} / 5.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
