import { useEffect, useState } from 'react';

interface UseKeyboardBoardProps {
  tubeCount: number;
  onTapTube: (index: number) => void;
  onUndo: () => void;
  onRestart: () => void;
  onDeselect: () => void;
  enabled?: boolean;
}

export function useKeyboardBoard({
  tubeCount,
  onTapTube,
  onUndo,
  onRestart,
  onDeselect,
  enabled = true,
}: UseKeyboardBoardProps) {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (['INPUT', 'TEXTAREA', 'BUTTON'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'u' || e.key === 'U' || e.key === 'r' || e.key === 'R') {
          // let shortcut trigger if not in input field
        }
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % tubeCount);
          break;

        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + tubeCount) % tubeCount);
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          onTapTube(focusedIndex);
          break;

        case 'Escape':
          e.preventDefault();
          onDeselect();
          break;

        case 'u':
        case 'U':
          e.preventDefault();
          onUndo();
          break;

        case 'r':
        case 'R':
          e.preventDefault();
          onRestart();
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tubeCount, focusedIndex, onTapTube, onUndo, onRestart, onDeselect, enabled]);

  return { focusedIndex, setFocusedIndex };
}
