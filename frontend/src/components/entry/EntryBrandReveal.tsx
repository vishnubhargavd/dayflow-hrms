import React from 'react';

interface EntryBrandRevealProps {
  scene: number;
}

export const EntryBrandReveal: React.FC<EntryBrandRevealProps> = ({ scene }) => {
  const isVisible = scene === 3;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -46%) scale(0.95)',
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.25rem',
        textAlign: 'center',
        zIndex: 25,
        width: 'min(900px, 92vw)',
        padding: '1rem',
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease',
      }}
    >
      {/* Centered DAYFLOW Wordmark */}
      <div style={{ position: 'relative', padding: '0.5rem 1.5rem', width: '100%' }}>
        <h1
          style={{
            fontSize: 'clamp(3.5rem, 8vw, 7rem)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.04em',
            color: '#F3F1E8',
            margin: 0,
            display: 'inline-block',
            textShadow: '0 0 50px rgba(124, 255, 178, 0.25)',
          }}
        >
          DAYFLOW<span style={{ color: '#7CFFB2' }}>.</span>
        </h1>

        {/* Soft Mint Light Sweep */}
        {isVisible && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              width: '120px',
              background: 'linear-gradient(90deg, transparent, rgba(124, 255, 178, 0.4), transparent)',
              animation: 'sweepLight 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
        )}
      </div>

      {/* Subtitle Metadata */}
      <span
        style={{
          fontSize: 'clamp(0.75rem, 1.8vw, 0.9375rem)',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          color: '#A8ADA4',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7CFFB2' }} />
        ENTERPRISE WORKFORCE INTELLIGENCE SYSTEM
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7CFFB2' }} />
      </span>

      <style>{`
        @keyframes sweepLight {
          0% { left: -120px; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};
