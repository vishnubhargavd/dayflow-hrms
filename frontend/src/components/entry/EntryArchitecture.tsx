import React from 'react';

interface EntryArchitectureProps {
  scene: number;
}

export const EntryArchitecture: React.FC<EntryArchitectureProps> = ({ scene }) => {
  const isVisible = scene >= 2 && scene <= 5;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.96)',
        transition: 'opacity 0.8s ease-in-out, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Primary Architectural Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(62vw, 800px)',
          height: 'min(62vw, 800px)',
          borderRadius: '50%',
          border: '1px solid rgba(243, 241, 232, 0.10)',
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* Secondary Inner Architectural Ring */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 'min(44vw, 560px)',
          height: 'min(44vw, 560px)',
          borderRadius: '50%',
          border: '1px dashed rgba(124, 255, 178, 0.16)',
          transform: 'translate(-50%, -50%)',
          transition: 'opacity 0.6s ease 0.1s',
        }}
      />

      {/* 4 Corner Brackets (Offset) */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 250px)',
          left: 'calc(50% - 250px)',
          width: '24px',
          height: '24px',
          borderTop: '2px solid rgba(124, 255, 178, 0.35)',
          borderLeft: '2px solid rgba(124, 255, 178, 0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 250px)',
          right: 'calc(50% - 250px)',
          width: '24px',
          height: '24px',
          borderTop: '2px solid rgba(124, 255, 178, 0.35)',
          borderRight: '2px solid rgba(124, 255, 178, 0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(50% - 250px)',
          left: 'calc(50% - 250px)',
          width: '24px',
          height: '24px',
          borderBottom: '2px solid rgba(124, 255, 178, 0.35)',
          borderLeft: '2px solid rgba(124, 255, 178, 0.35)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 'calc(50% - 250px)',
          right: 'calc(50% - 250px)',
          width: '24px',
          height: '24px',
          borderBottom: '2px solid rgba(124, 255, 178, 0.35)',
          borderRight: '2px solid rgba(124, 255, 178, 0.35)',
        }}
      />

      {/* Monospace Metadata Marker */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(50% - 242px)',
          left: 'calc(50% - 215px)',
          fontSize: '0.6875rem',
          fontFamily: 'var(--font-mono)',
          color: '#7CFFB2',
          letterSpacing: '0.14em',
          fontWeight: 700,
        }}
      >
        SYS.ARCH // AURA-NODE.01
      </div>
    </div>
  );
};
