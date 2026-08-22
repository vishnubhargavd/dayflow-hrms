import React from 'react';

interface EntryStatementProps {
  scene: number;
}

export const EntryStatement: React.FC<EntryStatementProps> = ({ scene }) => {
  const isVisible = scene === 5;

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -46%) scale(0.96)',
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
      <span
        style={{
          fontSize: 'clamp(1.5rem, 3.8vw, 3rem)',
          color: '#F3F1E8',
          fontWeight: 800,
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
        }}
      >
        EVERY WORKFORCE. EVERY PROCESS.
      </span>

      <h2
        style={{
          fontSize: 'clamp(3rem, 7vw, 6rem)',
          fontWeight: 800,
          background: 'linear-gradient(135deg, #D6C38A 0%, #7CFFB2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.05,
          letterSpacing: '-0.04em',
          margin: 0,
          textShadow: '0 0 60px rgba(124, 255, 178, 0.25)',
        }}
      >
        ONE UNIFIED SYSTEM.
      </h2>
    </div>
  );
};
