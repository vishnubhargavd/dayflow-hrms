import React from 'react';

interface EntryStatementProps {
  scene: number;
}

export const EntryStatement: React.FC<EntryStatementProps> = ({ scene }) => {
  if (scene !== 5) return null;

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
        width: 'min(850px, 92vw)',
        padding: '1rem',
      }}
    >
      <span
        style={{
          fontSize: 'clamp(1.25rem, 3.2vw, 2.5rem)',
          color: '#F3F1E8',
          fontWeight: 800,
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        EVERY PERSON. EVERY PROCESS.
      </span>

      <h2
        style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 800,
          color: '#7CFFB2',
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          margin: 0,
        }}
      >
        ONE SYSTEM.
      </h2>
    </div>
  );
};
