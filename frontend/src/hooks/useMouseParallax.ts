import { useState, useEffect } from 'react';

interface MousePosition {
  x: number;
  y: number;
  isTouchDevice: boolean;
}

export function useMouseParallax(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, isTouchDevice: false });

  useEffect(() => {
    // Detect touch or reduced motion preferences
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || prefersReducedMotion) {
      setPosition({ x: 0, y: 0, isTouchDevice: true });
      return;
    }

    let animationFrameId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      // Normalize mouse coordinates to [-1, 1]
      targetX = (e.clientX / innerWidth) * 2 - 1;
      targetY = (e.clientY / innerHeight) * 2 - 1;
    };

    const updatePosition = () => {
      // Smooth dampening interpolation (lerp)
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;

      setPosition({
        x: Math.round(currentX * 100) / 100,
        y: Math.round(currentY * 100) / 100,
        isTouchDevice: false,
      });

      animationFrameId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return position;
}
