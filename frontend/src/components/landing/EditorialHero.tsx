import React from 'react';
import { Badge } from '../common/Badge';
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react';

interface EditorialHeroProps {
  onExplore: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onExplore }) => {
  return (
    <section
      id="dayflow"
      style={{
        minHeight: 'calc(100vh - 80px)',
        padding: '4rem 0 3rem 0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2.5rem',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        {/* System Metadata Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span className="chapter-num" style={{ margin: 0, color: '#7CFFB2' }}>00 / 06 &bull; DAYFLOW SYSTEM</span>
          <Badge variant="brand" icon={<Sparkles size={12} />}>
            ✧ DAYFLOW AURA &bull; WORKFORCE IN MOTION
          </Badge>
        </div>

        {/* Display Headline */}
        <h1 className="editorial-display" style={{ margin: 0, fontSize: 'clamp(3.5rem, 7.5vw, 7.25rem)', lineHeight: 0.92, letterSpacing: '-0.05em' }}>
          <span style={{ color: '#F3F1E8' }}>YOUR WORKFORCE</span><br />
          <span style={{ background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            IN MOTION.
          </span>
        </h1>

        {/* Description Copy */}
        <p style={{ color: '#A8ADA4', fontSize: '1.25rem', maxWidth: '640px', lineHeight: 1.65, margin: '0 auto' }}>
          Dayflow unifies every part of your HR operations — workforce, attendance, leave, payroll, performance, and intelligence — into one unified system.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
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
              boxShadow: '0 0 35px rgba(124, 255, 178, 0.25)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>ENTER DAYFLOW</span>
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Capability Pills Strip */}
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', opacity: 0.75, fontSize: '0.8125rem', fontFamily: 'var(--font-mono)', color: '#A8ADA4' }}>
          <span>WORKFORCE ENGINE</span>
          <span>&bull;</span>
          <span>ATTENDANCE PIPELINE</span>
          <span>&bull;</span>
          <span>PAYROLL SYSTEM</span>
          <span>&bull;</span>
          <span>INTELLIGENCE CORE</span>
        </div>

        {/* Minimalist Scroll Indicator */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', marginTop: '2rem', opacity: 0.6 }}>
          <span style={{ fontSize: '0.6875rem', color: '#8A918A', fontWeight: 700, letterSpacing: '0.1em' }}>
            SCROLL TO EXPLORE THE SYSTEM
          </span>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid rgba(243, 241, 232, 0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronDown size={14} color="#7CFFB2" />
          </div>
        </div>
      </div>
    </section>
  );
};
