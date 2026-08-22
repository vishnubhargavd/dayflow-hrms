import React from 'react';
import { useVisualEngine } from '../../hooks/useVisualEngine';

export const MouseLightOverlay: React.FC = () => {
  const { pointer, velocity, isTouchDevice, prefersReducedMotion } = useVisualEngine();

  if (isTouchDevice || prefersReducedMotion || (pointer.x === 0 && pointer.y === 0)) {
    return null;
  }

  // Calculate velocity scale (size expands when moving faster)
  const size = 450 + Math.min(100, velocity.speed * 4);
  const opacity = 0.08 + Math.min(0.06, velocity.speed * 0.003);

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
        zIndex: -5,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: pointer.y - size / 2,
          left: pointer.x - size / 2,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(6, 182, 212, ${opacity}) 0%, rgba(99, 102, 241, ${opacity * 0.5}) 45%, transparent 70%)`,
          filter: 'blur(35px)',
          transition: 'width 0.2s ease-out, height 0.2s ease-out, background 0.2s ease-out',
        }}
      />
    </div>
  );
};
