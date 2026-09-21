import { useState, useEffect } from 'react';

interface UseBoardScaleProps {
  totalTubes: number;
  rowCount: number;
}

export function useBoardScale({ totalTubes, rowCount }: UseBoardScaleProps): number {
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    function computeScale() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // Available area for board (subtracting top bar ~80px, status ~50px, bottom bar ~90px, padding ~40px)
      const availableWidth = Math.min(vw - 24, 720);
      const availableHeight = vh - 260;

      // Base unscaled dimensions
      // Unscaled tube width: ~64px + 16px gap = 80px per column
      // Unscaled tube height + lift area: ~290px
      const maxColumns = rowCount === 1 ? totalTubes : Math.ceil(totalTubes / 2);
      const neededWidth = maxColumns * 76 + 20;
      const neededHeight = rowCount * 270 + (rowCount - 1) * 20;

      const scaleW = availableWidth / neededWidth;
      const scaleH = availableHeight / neededHeight;

      // Bound between 0.55 (small mobile) and 1.25 (large desktop)
      const computed = Math.max(0.55, Math.min(1.2, Math.min(scaleW, scaleH)));
      setScale(computed);
    }

    computeScale();
    window.addEventListener('resize', computeScale);
    return () => window.removeEventListener('resize', computeScale);
  }, [totalTubes, rowCount]);

  return scale;
}
