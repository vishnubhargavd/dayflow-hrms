import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EntrySignal } from './EntrySignal';
import { EntryArchitecture } from './EntryArchitecture';
import { EntryBrandReveal } from './EntryBrandReveal';
import { EntrySystemStatus } from './EntrySystemStatus';
import { EntryStatement } from './EntryStatement';
import { EntryTransition } from './EntryTransition';

interface EntryExperienceProps {
  onComplete: () => void;
}

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
    document.body.style.backgroundColor = '';

    // 700ms high-energy portal reveal transition before unmounting
    const exitTimer = setTimeout(() => {
      onComplete();
    }, 700);
    timersRef.current.push(exitTimer);
  }, [isExiting, onComplete]);

  // Master State Machine Timeline
  useEffect(() => {
    // Hide static HTML shell immediately when React mounts
    const shellEl = document.getElementById('dayflow-entry-shell');
    if (shellEl) {
      shellEl.style.display = 'none';
    }

    // Lock body scrolling during active intro
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Clear any existing timers on mount/remount (StrictMode Safety)
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];

    // Scene Schedule:
    // 00 — VOID (0.0s - 0.6s)
    // 01 — SIGNAL (0.6s - 1.2s)
    // 02 — ARCHITECTURE (1.2s - 1.9s)
    // 03 — DAYFLOW (1.9s - 2.8s)
    // 04 — SYSTEM STATUS (2.8s - 3.8s)
    // 05 — STATEMENT (3.8s - 4.5s)
    // 06 — THRESHOLD (4.5s -> Auto transition to landing scroll at 5.2s)
    const schedule = [
      { t: 600, s: 1 },
      { t: 1200, s: 2 },
      { t: 1900, s: 3 },
      { t: 2800, s: 4 },
      { t: 3800, s: 5 },
      { t: 4500, s: 6 },
    ];

    schedule.forEach(({ t, s }) => {
      const timer = setTimeout(() => setScene(s), t);
      timersRef.current.push(timer);
    });

    // Auto-exit after cinematic completes so user can scroll landing page freely
    const autoExitTimer = setTimeout(() => {
      triggerExit();
    }, 5200);
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
      if (e.key === 'Enter' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        triggerExit();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 2) {
        triggerExit();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      if (touchStartY - touchEndY > 5) {
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
        background: '#030403',
        opacity: isExiting ? 0 : 1,
        transform: isExiting ? 'scale(1.05)' : 'scale(1)',
        clipPath: isExiting ? 'circle(150% at 50% 50%)' : 'circle(100% at 50% 50%)',
        transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), clip-path 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: isExiting ? 'none' : 'auto',
        cursor: 'pointer',
      }}
    >
      {/* Layer 1: Unified Atmospheric Radial Light */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 50% 50%, rgba(124, 255, 178, 0.055) 0%, transparent 45%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Cinematic System Power-On Shockwave Ring on Exit */}
      {isExiting && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            border: '2px solid #7CFFB2',
            boxShadow: '0 0 50px #7CFFB2, inset 0 0 30px #7CFFB2',
            animation: 'shockwaveBurst 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Cinematic Horizontal Light Sweep Beam on Exit */}
      {isExiting && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '200px',
            background: 'linear-gradient(90deg, transparent, rgba(124, 255, 178, 0.45), rgba(214, 195, 138, 0.35), transparent)',
            animation: 'portalSweep 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            zIndex: 1001,
            pointerEvents: 'none',
          }}
        />
      )}

      <EntrySignal scene={scene} />
      <EntryArchitecture scene={scene} />
      <EntryBrandReveal scene={scene} />
      <EntrySystemStatus scene={scene} />
      <EntryStatement scene={scene} />
      <EntryTransition scene={scene} onEnter={triggerExit} onSkip={triggerExit} />

      <style>{`
        @keyframes shockwaveBurst {
          0% { transform: translate(-50%, -50%) scale(0.1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(25); opacity: 0; }
        }
        @keyframes portalSweep {
          0% { left: -200px; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
};
