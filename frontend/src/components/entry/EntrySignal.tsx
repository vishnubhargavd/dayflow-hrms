import React from 'react';

interface EntrySignalProps {
  scene: number;
}

export const EntrySignal: React.FC<EntrySignalProps> = ({ scene }) => {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Central 2px Mint Point */}
      <div
        style={{
          width: '3px',
          height: '3px',
          borderRadius: '50%',
          background: '#7CFFB2',
          boxShadow: '0 0 10px #7CFFB2',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: scene >= 0 ? 'scale(1)' : 'scale(0)',
          opacity: scene >= 0 ? 1 : 0,
          zIndex: 15,
        }}
      />

      {/* Expanding Concentric Mint Ripples */}
      {scene >= 1 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              border: '1px solid rgba(124, 255, 178, 0.18)',
              transform: 'translate(-50%, -50%)',
              animation: 'expandRipple1 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '1px stroke rgba(124, 255, 178, 0.10)',
              transform: 'translate(-50%, -50%)',
              animation: 'expandRipple2 2.0s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards',
            }}
          />
        </>
      )}

      {/* Architectural Coordinate Axes */}
      {scene >= 1 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '50%',
              width: '1px',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(to bottom, transparent, rgba(124, 255, 178, 0.14) 50%, transparent)',
              opacity: scene >= 1 ? 0.6 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              transform: 'translateY(-50%)',
              background: 'linear-gradient(to right, transparent, rgba(124, 255, 178, 0.14) 50%, transparent)',
              opacity: scene >= 1 ? 0.6 : 0,
              transition: 'opacity 0.5s ease',
            }}
          />
        </>
      )}

      <style>{`
        @keyframes expandRipple1 {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2.0); opacity: 0; }
        }
        @keyframes expandRipple2 {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
