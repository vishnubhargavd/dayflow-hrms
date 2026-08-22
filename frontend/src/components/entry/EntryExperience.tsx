import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EntrySignal } from './EntrySignal';
import { EntryArchitecture } from './EntryArchitecture';
import { EntryBrandReveal } from './EntryBrandReveal';
import { EntrySystemStatus } from './EntrySystemStatus';
import { EntryStatement } from './EntryStatement';
import { EntryTransition } from './EntryTransition';
import { Sparkles, ChevronDown } from 'lucide-react';

interface EntryExperienceProps {
  onComplete: () => void;
}

const STAGES = [
  { id: 1, label: '01 SIGNAL' },
  { id: 2, label: '02 ARCHITECTURE' },
  { id: 3, label: '03 BRAND' },
  { id: 4, label: '04 TELEMETRY' },
  { id: 5, label: '05 MANIFESTO' },
  { id: 6, label: '06 THRESHOLD' },
];

export const EntryExperience: React.FC<EntryExperienceProps> = ({ onComplete }) => {
  const [scene, setScene] = useState<number>(0);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const triggerExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);

    // Restore normal page scrolling cleanly
    document.body.style.overflow = '';
    document.body.style.overflowY = 'auto';
    document.documentElement.style.overflow = '';
    document.documentElement.style.overflowY = 'auto';

    // 800ms smooth high-energy portal reveal transition
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 800);
    timersRef.current.push(exitTimer);
  }, [isExiting, onComplete]);

  // Master State Machine Timeline with Slow, Elegant Pacing
  useEffect(() => {
    // Lock body scrolling during active intro
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Clear any existing timers on mount/remount
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // Slow, refined cinematic pacing:
    // Scene 0: Void / Pulse Point (0.0s - 1.2s)
    // Scene 1: Signal & Telemetry Coordinate Ring (1.2s - 2.8s)
    // Scene 2: System Architecture Mesh (2.8s - 4.6s)
    // Scene 3: DAYFLOW Aura Brand Reveal (4.6s - 6.6s)
    // Scene 4: Live Subsystem Telemetry Status (6.6s - 8.6s)
    // Scene 5: Editorial Manifesto / Statement (8.6s - 10.6s)
    // Scene 6: Threshold / Portal Ready (10.6s -> smooth scroll or click/skip anytime)
    const schedule = [
      { t: 1200, s: 1 },
      { t: 2800, s: 2 },
      { t: 4600, s: 3 },
      { t: 6600, s: 4 },
      { t: 8600, s: 5 },
      { t: 10600, s: 6 },
    ];

    schedule.forEach(({ t, s }) => {
      const timer = setTimeout(() => setScene(s), t);
      timersRef.current.push(timer);
    });

    // Auto-exit after cinematic completes at 13.5s so user effortlessly transitions to landing scroll
    const autoExitTimer = setTimeout(() => {
      triggerExit();
    }, 13500);
    timersRef.current.push(autoExitTimer);

    return () => {
      timersRef.current.forEach((t) => clearTimeout(t));
      timersRef.current = [];
      document.body.style.overflow = '';
      document.body.style.overflowY = 'auto';
      document.documentElement.style.overflow = '';
      document.documentElement.style.overflowY = 'auto';
    };
  }, [triggerExit]);

  // Wheel and Keyboard support: any scroll down or key press triggers seamless exit to landing scroll!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        triggerExit();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 15) {
        triggerExit();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (touchStartY - touchEndY > 20) {
        triggerExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [triggerExit]);

  return (
    <div
      className="entry-stage"
      aria-label="Dayflow Cinematic Entry Stage"
      onClick={triggerExit}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100svh',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        zIndex: 999999,
        background: '#040604',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.04) translateY(-10px)' : 'scale(1) translateY(0)',
        filter: isExiting ? 'blur(10px)' : 'none',
        transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s ease',
        pointerEvents: isExiting ? 'none' : 'auto',
        cursor: 'pointer',
      }}
    >
      {/* Layer 1: Atmospheric Deep Ambient Lights */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '750px',
          height: '750px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(124, 255, 178, 0.07) 0%, rgba(13, 18, 15, 0.4) 40%, transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      {/* Layer 2: Top Floating Timeline Stage Bar */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 40,
          background: 'rgba(13, 18, 15, 0.7)',
          backdropFilter: 'blur(16px)',
          padding: '6px 16px',
          borderRadius: '9999px',
          border: '1px solid rgba(243, 241, 232, 0.08)',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7CFFB2' }}>
          <Sparkles size={12} className="animate-pulse" />
          <span style={{ fontSize: '0.6875rem', fontWeight: 800, fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
            DAYFLOW CORE
          </span>
        </div>

        <div style={{ width: '1px', height: '12px', background: 'rgba(243, 241, 232, 0.15)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {STAGES.map((st) => {
            const isActive = scene >= st.id;
            return (
              <span
                key={st.id}
                style={{
                  fontSize: '0.625rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: isActive ? '#7CFFB2' : '#59615A',
                  transition: 'color 0.4s ease',
                  letterSpacing: '0.05em',
                }}
              >
                {st.label}
              </span>
            );
          })}
        </div>
      </div>

      {/* Layer 3: Top-Right Skip Control */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          triggerExit();
        }}
        style={{
          position: 'absolute',
          top: '22px',
          right: '24px',
          zIndex: 45,
          background: 'rgba(19, 26, 21, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(124, 255, 178, 0.25)',
          color: '#F3F1E8',
          fontSize: '0.6875rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: 700,
          padding: '8px 16px',
          borderRadius: '9999px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#7CFFB2';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(124, 255, 178, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(124, 255, 178, 0.25)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        }}
      >
        <span>SKIP INTRO [ESC]</span>
        <span style={{ color: '#7CFFB2' }}>&rarr;</span>
      </button>

      {/* Shockwave Burst on Exit */}
      {isExiting && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            border: '2px solid #7CFFB2',
            boxShadow: '0 0 60px #7CFFB2, inset 0 0 40px #7CFFB2',
            animation: 'shockwaveBurst 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Smooth Sub-scene Layers */}
      <EntrySignal scene={scene} />
      <EntryArchitecture scene={scene} />
      <EntryBrandReveal scene={scene} />
      <EntrySystemStatus scene={scene} />
      <EntryStatement scene={scene} />
      <EntryTransition scene={scene} onEnter={triggerExit} onSkip={triggerExit} />

      {/* Bottom Subtle Scroll / Keypress Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          opacity: 0.7,
        }}
      >
        <span style={{ fontSize: '0.6875rem', color: '#8A918A', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}>
          SCROLL DOWN OR CLICK ANYWHERE TO ENTER WORKSPACE
        </span>
        <ChevronDown size={14} color="#7CFFB2" className="animate-bounce" />
      </div>

      <style>{`
        @keyframes shockwaveBurst {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(35); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
