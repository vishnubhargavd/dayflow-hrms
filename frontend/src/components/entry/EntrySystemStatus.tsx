import React from 'react';

interface EntrySystemStatusProps {
  scene: number;
}

export const EntrySystemStatus: React.FC<EntrySystemStatusProps> = ({ scene }) => {
  const isVisible = scene === 4;

  const ITEMS = [
    { label: 'WORKFORCE DIRECTORY', status: 'SYNCHRONIZED' },
    { label: 'ATTENDANCE ENGINE', status: 'REAL-TIME TRACKING' },
    { label: 'TIME-OFF & APPROVALS', status: 'FLOW READY' },
    { label: 'COMPLIANT PAYROLL', status: 'STATUTORY CALCULATED' },
    { label: 'PERFORMANCE OKRS', status: 'METRICS CALIBRATED' },
    { label: 'HR INTELLIGENCE CORE', status: 'ACTIVE TELEMETRY' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: isVisible ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -46%) scale(0.96)',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        columnGap: '3rem',
        rowGap: '1rem',
        width: 'min(500px, 92vw)',
        margin: '0 auto',
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(0.8125rem, 1.6vw, 0.9375rem)',
        zIndex: 25,
        padding: '1.5rem',
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.9s ease',
        background: 'rgba(13, 18, 15, 0.65)',
        backdropFilter: 'blur(20px)',
        borderRadius: '16px',
        border: '1px solid rgba(124, 255, 178, 0.15)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
      }}
    >
      {ITEMS.map((item, idx) => (
        <React.Fragment key={item.label}>
          {/* Label: Right Aligned */}
          <span
            style={{
              textAlign: 'right',
              color: '#8A918A',
              fontWeight: 700,
              letterSpacing: '0.10em',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s`,
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
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${0.1 + idx * 0.08}s`,
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7CFFB2', display: 'inline-block', boxShadow: '0 0 10px #7CFFB2' }} />
            <span style={{ color: '#7CFFB2', fontWeight: 800, letterSpacing: '0.08em' }}>● {item.status}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};
