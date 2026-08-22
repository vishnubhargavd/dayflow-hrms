import React from 'react';

interface EntryBrandRevealProps {
  scene: number;
}

export const EntryBrandReveal: React.FC<EntryBrandRevealProps> = ({ scene }) => {
  if (scene !== 3) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        zIndex: 25,
        width: 'min(900px, 92vw)',
        padding: '1rem',
      }}
    >
      {/* Centered DAYFLOW Wordmark */}
      <div style={{ position: 'relative', padding: '0.5rem 1.5rem', width: '100%' }}>
        <h1
          style={{
            fontSize: 'clamp(3rem, 7vw, 6.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#F3F1E8',
            margin: 0,
            animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            display: 'inline-block',
          }}
        >
          DAYFLOW<span style={{ color: '#7CFFB2' }}>.</span>
        </h1>

        {/* Soft Mint Light Sweep */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '60px',
            background: 'linear-gradient(90deg, transparent, rgba(124, 255, 178, 0.35), transparent)',
            animation: 'sweepLight 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards',
          }}
        />
      </div>

      {/* Subtitle Metadata */}
      <span
        style={{
          fontSize: 'clamp(0.6875rem, 1.5vw, 0.8125rem)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: '#8A918A',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          animation: 'fadeIn 0.5s ease 0.15s forwards',
        }}
      >
        WORKFORCE OPERATING SYSTEM
      </span>

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 0.9; }
        }
        @keyframes sweepLight {
          0% { left: -60px; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};
