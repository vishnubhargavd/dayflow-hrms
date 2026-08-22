import React from 'react';

interface EntryArchitectureProps {
  scene: number;
}

export const EntryArchitecture: React.FC<EntryArchitectureProps> = ({ scene }) => {
  if (scene < 2 || scene > 5) return null;

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Primary Architectural Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(58vw, 760px)',
          height: 'min(58vw, 760px)',
          borderRadius: '50%',
          border: '1px solid rgba(243, 241, 232, 0.08)',
          transform: 'translate(-50%, -50%)',
          opacity: scene >= 2 ? 0.7 : 0,
          transition: 'opacity 0.5s ease',
        }}
      />

      {/* Secondary Inner Architectural Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(42vw, 540px)',
          height: 'min(42vw, 540px)',
          borderRadius: '50%',
          border: '1px dashed rgba(124, 255, 178, 0.12)',
          transform: 'translate(-50%, -50%)',
          opacity: scene >= 2 ? 0.6 : 0,
          transition: 'opacity 0.5s ease 0.1s',
        }}
      />

      {/* 4 Corner Brackets (Mathematically Offset) */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 240px)',
          left: 'calc(50% - 240px)',
          width: '18px',
          height: '18px',
          borderTop: '1px solid rgba(243, 241, 232, 0.22)',
          borderLeft: '1px solid rgba(243, 241, 232, 0.22)',
          opacity: scene >= 2 ? 0.7 : 0,
          transition: 'opacity 0.4s ease 0.15s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 240px)',
          right: 'calc(50% - 240px)',
          width: '18px',
          height: '18px',
          borderTop: '1px solid rgba(243, 241, 232, 0.22)',
          borderRight: '1px solid rgba(243, 241, 232, 0.22)',
          opacity: scene >= 2 ? 0.7 : 0,
          transition: 'opacity 0.4s ease 0.2s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(50% - 240px)',
          left: 'calc(50% - 240px)',
          width: '18px',
          height: '18px',
          borderBottom: '1px solid rgba(243, 241, 232, 0.22)',
          borderLeft: '1px solid rgba(243, 241, 232, 0.22)',
          opacity: scene >= 2 ? 0.7 : 0,
          transition: 'opacity 0.4s ease 0.25s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(50% - 240px)',
          right: 'calc(50% - 240px)',
          width: '18px',
          height: '18px',
          borderBottom: '1px solid rgba(243, 241, 232, 0.22)',
          borderRight: '1px solid rgba(243, 241, 232, 0.22)',
          opacity: scene >= 2 ? 0.7 : 0,
          transition: 'opacity 0.4s ease 0.3s',
        }}
      />

      {/* Monospace Metadata Marker */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 235px)',
          left: 'calc(50% - 210px)',
          fontSize: '0.625rem',
          fontFamily: 'var(--font-mono)',
          color: '#8A918A',
          letterSpacing: '0.12em',
          opacity: scene >= 2 ? 0.75 : 0,
          transition: 'opacity 0.4s ease 0.35s',
        }}
      >
        SYS.LOC // 00.128.4
      </div>
    </div>
  );
};
