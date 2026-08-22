import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface EntryTransitionProps {
  scene: number;
  onEnter: () => void;
  onSkip: () => void;
}

export const EntryTransition: React.FC<EntryTransitionProps> = ({ scene, onEnter, onSkip }) => {
  const isVisible = scene >= 6;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -46%) scale(0.96)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        textAlign: 'center',
        zIndex: 35,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1), filter 1s ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(124, 255, 178, 0.1)',
            border: '1px solid rgba(124, 255, 178, 0.3)',
            padding: '6px 18px',
            borderRadius: '9999px',
            color: '#7CFFB2',
            boxShadow: '0 0 20px rgba(124, 255, 178, 0.15)',
          }}
        >
          <Sparkles size={14} className="animate-spin" style={{ animationDuration: '3s' }} />
          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 800, letterSpacing: '0.18em' }}>
            AURA CORE OPERATIONAL &bull; V3.0
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(3rem, 6.5vw, 5.5rem)',
            fontWeight: 800,
            color: '#F3F1E8',
            margin: 0,
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
          }}
        >
          DAYFLOW<span style={{ color: '#7CFFB2' }}>.</span>
        </h2>
      </div>

      <button
        onClick={onEnter}
        className="enter-btn-pulse"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '14px',
          padding: '18px 48px',
          borderRadius: '9999px',
          background: '#7CFFB2',
          color: '#060806',
          fontSize: '1.125rem',
          fontWeight: 800,
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 0 45px rgba(124, 255, 178, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.4)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <span>ENTER DAYFLOW WORKSPACE</span>
        <ArrowRight size={22} />
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8125rem', color: '#A8ADA4', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          Press <strong style={{ color: '#7CFFB2' }}>SPACE</strong>, <strong style={{ color: '#7CFFB2' }}>ENTER ↵</strong>, or scroll to unlock
        </span>
      </div>

      <style>{`
        .enter-btn-pulse:hover {
          transform: scale(1.06);
          box-shadow: 0 0 65px rgba(124, 255, 178, 0.75), inset 0 0 15px rgba(255, 255, 255, 0.6) !important;
        }
        .enter-btn-pulse:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};
