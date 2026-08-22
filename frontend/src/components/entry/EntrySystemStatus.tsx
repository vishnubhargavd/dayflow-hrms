import React from 'react';

interface EntrySystemStatusProps {
  scene: number;
}

export const EntrySystemStatus: React.FC<EntrySystemStatusProps> = ({ scene }) => {
  if (scene !== 4) return null;

  const ITEMS = [
    { label: 'WORKFORCE', status: 'ONLINE' },
    { label: 'ATTENDANCE', status: 'SYNCED' },
    { label: 'LEAVE', status: 'READY' },
    { label: 'PAYROLL', status: 'READY' },
    { label: 'PERFORMANCE', status: 'READY' },
    { label: 'INTELLIGENCE', status: 'ACTIVE' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: '2.5rem',
        rowGap: '0.75rem',
        width: 'min(440px, 90vw)',
        margin: '0 auto',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(0.75rem, 1.5vw, 0.875rem)',
        zIndex: 25,
        padding: '1rem',
      }}
    >
      {ITEMS.map((item, idx) => (
        <React.Fragment key={item.label}>
          {/* Label: Right Aligned */}
          <span
            style={{
              textAlign: 'right',
              color: '#59615A',
              fontWeight: 700,
              letterSpacing: '0.12em',
              opacity: scene === 4 ? 1 : 0,
              transform: scene === 4 ? 'translateY(0)' : 'translateY(6px)',
              transition: `all 0.25s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s`,
            }}
          >
            {item.label}
          </span>

          {/* Status: Left Aligned */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textAlign: 'left',
              opacity: scene === 4 ? 1 : 0,
              transform: scene === 4 ? 'translateY(0)' : 'translateY(6px)',
              transition: `all 0.25s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.1}s`,
            }}
          >
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7CFFB2', display: 'inline-block' }} />
            <span style={{ color: '#7CFFB2', fontWeight: 800, letterSpacing: '0.08em' }}>● {item.status}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
