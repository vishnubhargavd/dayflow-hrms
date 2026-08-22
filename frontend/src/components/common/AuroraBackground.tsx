import React from 'react';

export const AuroraBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -10,
        overflow: 'hidden',
        background: '#060806',
      }}
    >
      {/* Soft Architectural Atmosphere Orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          right: '15%',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124, 255, 178, 0.07) 0%, rgba(214, 195, 138, 0.025) 45%, transparent 70%)',
          filter: 'blur(90px)',
          animation: 'auroraDrift1 45s ease-in-out infinite alternate',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '-10%',
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(8, 122, 82, 0.06) 0%, transparent 65%)',
          filter: 'blur(100px)',
          animation: 'auroraDrift2 35s ease-in-out infinite alternate',
        }}
      />

      {/* SVG Subtle Orbital System */}
      <svg
        width="100%"
        height="100%"
        style={{ position: 'absolute', inset: 0, opacity: 0.08 }}
      >
        <circle cx="70%" cy="40%" r="350" fill="none" stroke="url(#ringGrad1)" strokeWidth="1.5" strokeDasharray="6 6" />
        <circle cx="70%" cy="40%" r="500" fill="none" stroke="url(#ringGrad2)" strokeWidth="1" />
        <defs>
          <linearGradient id="ringGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7CFFB2" />
            <stop offset="100%" stopColor="#D6C38A" />
          </linearGradient>
          <linearGradient id="ringGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#159A68" />
            <stop offset="100%" stopColor="#7CFFB2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Technical Grid Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '40vh',
          backgroundImage: 'linear-gradient(to right, rgba(243, 241, 232, 0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(243, 241, 232, 0.025) 1px, transparent 1px)',
          backgroundSize: '45px 45px',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 100%)',
        }}
      />

      {/* Micro Data Particles */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.3 }}>
        <span style={{ position: 'absolute', top: '25%', left: '20%', width: '3px', height: '3px', borderRadius: '50%', background: '#7CFFB2', boxShadow: '0 0 8px #7CFFB2', animation: 'floatParticle 12s ease-in-out infinite' }} />
        <span style={{ position: 'absolute', top: '45%', right: '25%', width: '4px', height: '4px', borderRadius: '50%', background: '#D6C38A', boxShadow: '0 0 10px #D6C38A', animation: 'floatParticle 16s ease-in-out infinite 2s' }} />
        <span style={{ position: 'absolute', bottom: '35%', left: '40%', width: '3px', height: '3px', borderRadius: '50%', background: '#159A68', boxShadow: '0 0 8px #159A68', animation: 'floatParticle 14s ease-in-out infinite 4s' }} />
      </div>

      <style>{`
        @keyframes auroraDrift1 {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(50px, 35px) scale(1.05); }
        }
        @keyframes auroraDrift2 {
          0% { transform: translate(0px, 0px) scale(1); }
          100% { transform: translate(-40px, -50px) scale(1.08); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.3); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};
