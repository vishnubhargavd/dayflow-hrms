import React, { useState } from 'react';
import { Badge } from '../common/Badge';
import { Clock, Calendar, LifeBuoy, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

export const OperationsChapter: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const STAGES = [
    { title: 'Attendance Sync', desc: 'Real-time check-in and biometric verification', icon: Clock, color: '#7CFFB2', state: 'AUTOMATED' },
    { title: 'Leave Processing', desc: 'Automated balance calculation & manager approval flow', icon: Calendar, color: '#A5FFC8', state: 'WORKFLOW' },
    { title: 'HR Helpdesk', desc: 'SLA ticket routing and SLA escalation tracking', icon: LifeBuoy, color: '#159A68', state: 'ESCALATION' },
    { title: 'Payroll Disbursement', desc: 'Direct bank transfer calculation and tax slip generation', icon: CreditCard, color: '#D6C38A', state: 'DISBURSED' },
  ];

  return (
    <section id="operations" style={{ padding: '6rem 0', background: 'var(--bg-surface)' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
        {/* Chapter Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.5rem' }}>
          <span className="chapter-num" style={{ color: '#7CFFB2' }}>02 / 06 &bull; OPERATIONS</span>
          <h2 className="editorial-heading">
            <span style={{ color: '#F3F1E8' }}>CONNECTED FLOW.</span><br />
            <span style={{ background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              ZERO FRICTION.
            </span>
          </h2>
        </div>

        {/* Operational Timeline Connected Stages */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {STAGES.map((st, idx) => {
            const isSelected = activeStage === idx;
            const Icon = st.icon;
            return (
              <div
                key={st.title}
                onClick={() => setActiveStage(idx)}
                style={{
                  background: isSelected ? '#131A15' : '#0D120F',
                  border: isSelected ? `1px solid ${st.color}` : '1px solid rgba(243, 241, 232, 0.08)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: '#060806', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${st.color}` }}>
                    <Icon size={20} color={st.color} />
                  </div>
                  <Badge variant="brand">{st.state}</Badge>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#F3F1E8' }}>{st.title}</h4>
                  <p style={{ fontSize: '0.8125rem', color: '#A8ADA4', lineHeight: 1.5 }}>{st.desc}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: st.color, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  <span>Stage 0{idx + 1}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Workflow Demonstration */}
        <div style={{ background: '#131A15', padding: '1.25rem 1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(243, 241, 232, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle2 size={20} color="#7CFFB2" />
            <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#F3F1E8' }}>
              Product Workflow Demo: <strong style={{ color: STAGES[activeStage].color }}>{STAGES[activeStage].title}</strong>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#45E69A' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#45E69A', display: 'inline-block' }} />
            REQUEST &rarr; REVIEW &rarr; APPROVED &rarr; RECORDED
          </div>
        </div>
      </div>
    </section>
  );
};
