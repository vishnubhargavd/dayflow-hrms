import { useState, useEffect } from 'react';

export interface VisualEngineState {
  pointer: {
    x: number;
    y: number;
    normX: number; // -1 to 1
    normY: number; // -1 to 1
  };
  velocity: {
    vx: number;
    vy: number;
    speed: number;
  };
  scrollProgress: number; // 0 to 100
  isTouchDevice: boolean;
  prefersReducedMotion: boolean;
}

export function useVisualEngine(): VisualEngineState {
  const [engine, setEngine] = useState<VisualEngineState>({
    pointer: { x: 0, y: 0, normX: 0, normY: 0 },
    velocity: { vx: 0, vy: 0, speed: 0 },
    scrollProgress: 0,
    isTouchDevice: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouch || reducedMotion) {
      setEngine((prev) => ({
        ...prev,
        isTouchDevice: isTouch,
        prefersReducedMotion: reducedMotion,
      }));
      return;
    }

    let prevX = 0;
    let prevY = 0;
    let frameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;

      const vx = e.clientX - prevX;
      const vy = e.clientY - prevY;
      const speed = Math.sqrt(vx * vx + vy * vy);

      prevX = e.clientX;
      prevY = e.clientY;

      frameId = requestAnimationFrame(() => {
        setEngine((prev) => ({
          ...prev,
          pointer: {
            x: e.clientX,
            y: e.clientY,
            normX: Math.round(normX * 100) / 100,
            normY: Math.round(normY * 100) / 100,
          },
          velocity: {
            vx: Math.round(vx * 10) / 10,
            vy: Math.round(vy * 10) / 10,
            speed: Math.min(50, Math.round(speed * 10) / 10),
          },
          isTouchDevice: false,
          prefersReducedMotion: false,
        }));
      });
    };

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setEngine((prev) => ({
        ...prev,
        scrollProgress: Math.min(100, Math.max(0, Math.round(progress * 10) / 10)),
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return engine;
}
