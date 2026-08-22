import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface EntryTransitionProps {
  scene: number;
  onEnter: () => void;
  onSkip: () => void;
}

export const EntryTransition: React.FC<EntryTransitionProps> = ({ scene, onEnter, onSkip }) => {
  return (
    <>
      {/* Centered Threshold Stage (Scene 6) */}
      {scene >= 6 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.5rem',
            textAlign: 'center',
            zIndex: 35,
            animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7CFFB2' }}>
              <Sparkles size={14} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', fontWeight: 700, letterSpacing: '0.20em' }}>
                SYSTEM OPERATIONAL
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, color: '#F3F1E8', margin: 0, letterSpacing: '-0.04em' }}>
              DAYFLOW<span style={{ color: '#7CFFB2' }}>.</span>
            </h2>
          </div>

          <button
            onClick={onEnter}
            className="enter-btn-pulse"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 40px',
              borderRadius: 'var(--radius-full)',
              background: '#7CFFB2',
              color: '#060806',
              fontSize: '1.0625rem',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 35px rgba(124, 255, 178, 0.45)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <span>ENTER DAYFLOW</span>
            <ArrowRight size={22} />
          </button>

          <span style={{ fontSize: '0.75rem', color: '#8A918A', fontFamily: 'var(--font-mono)', fontWeight: 600, opacity: 0.85 }}>
            Press <strong style={{ color: '#F3F1E8' }}>ENTER ↵</strong> or click button to unlock
          </span>
        </div>
      )}

      {/* Subtle Skip Button in Lower Right (Visible from Scene 2) */}
      {scene >= 2 && scene < 6 && (
        <button
          onClick={onSkip}
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '28px',
            background: 'transparent',
            border: 'none',
            color: '#8A918A',
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
            zIndex: 30,
            opacity: 0.7,
            transition: 'opacity 0.2s ease',
          }}
        >
          SKIP &rarr;
        </button>
      )}

      <style>{`
        @keyframes fadeInUp {
          0% { transform: translate(-50%, -40%); opacity: 0; }
          100% { transform: translate(-50%, -50%); opacity: 1; }
        }
        .enter-btn-pulse:hover {
          transform: scale(1.05);
          box-shadow: 0 0 50px rgba(124, 255, 178, 0.65) !important;
        }
        .enter-btn-pulse:active {
          transform: scale(0.98);
        }
      `}</style>
    </>
  );
};
