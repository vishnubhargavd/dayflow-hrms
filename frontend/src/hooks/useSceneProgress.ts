import { useState, useEffect } from 'react';

export interface SceneProgressState {
  progress00_01: number; // 0 to 1 (Dayflow -> Workforce)
  progress01_02: number; // 0 to 1 (Workforce -> Operations)
  progress02_03: number; // 0 to 1 (Operations -> Money)
  progress03_04: number; // 0 to 1 (Money -> Performance)
  progress04_05: number; // 0 to 1 (Performance -> Intelligence)
  progress05_06: number; // 0 to 1 (Intelligence -> System)
  activeChapter: string;
  scrollVelocity: number;
}

export function useSceneProgress(): SceneProgressState {
  const [progressState, setProgressState] = useState<SceneProgressState>({
    progress00_01: 0,
    progress01_02: 0,
    progress02_03: 0,
    progress03_04: 0,
    progress04_05: 0,
    progress05_06: 0,
    activeChapter: 'chapter-00',
    scrollVelocity: 0,
  });

  useEffect(() => {
    let prevY = window.scrollY;

    const calculateProgress = () => {
      const getProgressBetween = (startId: string, endId: string) => {
        const startEl = document.getElementById(startId);
        const endEl = document.getElementById(endId);
        if (!startEl || !endEl) return 0;

        const startTop = startEl.offsetTop;
        const endTop = endEl.offsetTop;
        const currentY = window.scrollY + window.innerHeight / 2;

        if (currentY < startTop) return 0;
        if (currentY > endTop) return 1;

        const totalDist = endTop - startTop;
        return totalDist > 0 ? (currentY - startTop) / totalDist : 0;
      };

      const currY = window.scrollY;
      const velocity = currY - prevY;
      prevY = currY;

      const p00_01 = getProgressBetween('chapter-00', 'chapter-01');
      const p01_02 = getProgressBetween('chapter-01', 'chapter-02');
      const p02_03 = getProgressBetween('chapter-02', 'chapter-03');
      const p03_04 = getProgressBetween('chapter-03', 'chapter-04');
      const p04_05 = getProgressBetween('chapter-04', 'chapter-05');
      const p05_06 = getProgressBetween('chapter-05', 'chapter-06');

      let active = 'chapter-00';
      if (p05_06 > 0.5) active = 'chapter-06';
      else if (p04_05 > 0.5) active = 'chapter-05';
      else if (p03_04 > 0.5) active = 'chapter-04';
      else if (p02_03 > 0.5) active = 'chapter-03';
      else if (p01_02 > 0.5) active = 'chapter-02';
      else if (p00_01 > 0.5) active = 'chapter-01';

      setProgressState({
        progress00_01: Math.min(1, Math.max(0, Math.round(p00_01 * 100) / 100)),
        progress01_02: Math.min(1, Math.max(0, Math.round(p01_02 * 100) / 100)),
        progress02_03: Math.min(1, Math.max(0, Math.round(p02_03 * 100) / 100)),
        progress03_04: Math.min(1, Math.max(0, Math.round(p03_04 * 100) / 100)),
        progress04_05: Math.min(1, Math.max(0, Math.round(p04_05 * 100) / 100)),
        progress05_06: Math.min(1, Math.max(0, Math.round(p05_06 * 100) / 100)),
        activeChapter: active,
        scrollVelocity: Math.min(50, Math.abs(velocity)),
      });
    };

    window.addEventListener('scroll', calculateProgress);
    calculateProgress();

    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return progressState;
}
