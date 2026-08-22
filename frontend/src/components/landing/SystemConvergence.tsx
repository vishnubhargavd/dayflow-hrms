import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SystemConvergenceProps {
  onExplore: () => void;
}

export const SystemConvergence: React.FC<SystemConvergenceProps> = ({ onExplore }) => {
  return (
    <section id="system" style={{ padding: '8rem 0 6rem 0', position: 'relative' }}>
      <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '2.5rem' }}>
        <span className="chapter-num" style={{ color: '#7CFFB2' }}>06 / 06 &bull; SYSTEM CONVERGENCE</span>

        <h2 className="editorial-display" style={{ maxWidth: '900px' }}>
          <span style={{ color: '#F3F1E8' }}>ONE SYSTEM.</span><br />
          <span style={{ background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EVERYTHING CONNECTED.
          </span>
        </h2>

        <p style={{ color: '#A8ADA4', fontSize: '1.25rem', maxWidth: '600px', lineHeight: 1.65 }}>
          Eliminate fragmented HR tools. Dayflow unifies core workforce management, automated payroll, performance tracking, and smart HR intelligence.
        </p>

        {/* Module Convergence Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: '0.8125rem', color: '#F3F1E8', fontWeight: 700 }}>
            ● WORKFORCE DIRECTORY
          </div>
          <div style={{ background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: '0.8125rem', color: '#F3F1E8', fontWeight: 700 }}>
            ● ATTENDANCE TRACKING
          </div>
          <div style={{ background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: '0.8125rem', color: '#F3F1E8', fontWeight: 700 }}>
            ● PRECISION PAYROLL
          </div>
          <div style={{ background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: '0.8125rem', color: '#F3F1E8', fontWeight: 700 }}>
            ● PERFORMANCE OKRS
          </div>
          <div style={{ background: '#131A15', border: '1px solid rgba(243, 241, 232, 0.08)', borderRadius: 'var(--radius-full)', padding: '6px 16px', fontSize: '0.8125rem', color: '#7CFFB2', fontWeight: 700 }}>
            ● SMART HR INTELLIGENCE
          </div>
        </div>

        {/* Final Call to Action */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={onExplore}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 36px',
              borderRadius: 'var(--radius-full)',
              background: '#7CFFB2',
              color: '#060806',
              fontSize: '1rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 35px rgba(124, 255, 178, 0.3)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>ENTER DAYFLOW</span>
            <ArrowRight size={20} />
          </button>
          <span style={{ fontSize: '0.75rem', color: '#8A918A', fontWeight: 600 }}>
            Fully operational local instance running on port 5000 / 5173
          </span>
        </div>
      </div>
    </section>
  );
};
