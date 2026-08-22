import React from 'react';

interface EntrySignalProps {
  scene: number;
}

export const EntrySignal: React.FC<EntrySignalProps> = ({ scene }) => {
  const isVisible = scene >= 0 && scene <= 6;
  const isExpanded = scene >= 1;

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
        transition: 'opacity 0.8s ease-in-out',
      }}
    >
      {/* Central 3px Mint Point */}
      <div
        style={{
          width: '4px',
          height: '4px',
          borderRadius: '50%',
          background: '#7CFFB2',
          boxShadow: '0 0 16px #7CFFB2, 0 0 32px #7CFFB2',
          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: scene >= 0 ? 'scale(1)' : 'scale(0)',
          opacity: scene >= 0 && scene < 6 ? 1 : 0,
          zIndex: 15,
        }}
      />

      {/* Expanding Concentric Mint Ripples */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: '1px solid rgba(124, 255, 178, 0.25)',
          transform: 'translate(-50%, -50%)',
          animation: isExpanded ? 'slowRipple1 3.5s cubic-bezier(0.16, 1, 0.3, 1) infinite' : 'none',
          opacity: isExpanded ? 0.7 : 0,
          transition: 'opacity 1s ease',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          border: '1px stroke rgba(124, 255, 178, 0.12)',
          transform: 'translate(-50%, -50%)',
          animation: isExpanded ? 'slowRipple2 4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s infinite' : 'none',
          opacity: isExpanded ? 0.5 : 0,
          transition: 'opacity 1s ease 0.2s',
        }}
      />

      {/* Architectural Coordinate Axes */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '1px',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(to bottom, transparent, rgba(124, 255, 178, 0.18) 50%, transparent)',
          opacity: isExpanded ? 0.6 : 0,
          transition: 'opacity 0.8s ease',
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
          background: 'linear-gradient(to right, transparent, rgba(124, 255, 178, 0.18) 50%, transparent)',
          opacity: isExpanded ? 0.6 : 0,
          transition: 'opacity 0.8s ease',
        }}
      />

      <style>{`
        @keyframes slowRipple1 {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
        }
        @keyframes slowRipple2 {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0.6; }
          100% { transform: translate(-50%, -50%) scale(2.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
