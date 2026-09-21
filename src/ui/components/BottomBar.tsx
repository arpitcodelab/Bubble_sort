import React from 'react';
import { Undo2, Lightbulb, RotateCcw } from 'lucide-react';

interface BottomBarProps {
  undosLeft: number;
  canUndo: boolean;
  onUndo: () => void;
  onHint: () => void;
  onRestart: () => void;
}

export const BottomBar: React.FC<BottomBarProps> = ({
  undosLeft,
  canUndo,
  onUndo,
  onHint,
  onRestart,
}) => {
  return (
    <footer
      className="cyber-bottombar"
      style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '12px 20px',
        marginTop: 'auto',
        zIndex: 10,
      }}
    >
      {/* Undo Button with Dynamic Badge */}
      <button
        className="cyber-btn"
        onClick={onUndo}
        disabled={!canUndo || undosLeft <= 0}
        aria-label={`Rewind move. ${undosLeft} charges left.`}
        style={{
          flex: 1,
          maxWidth: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <Undo2 size={18} />
        <span>REWIND</span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.85rem',
            padding: '2px 6px',
            borderRadius: '4px',
            background: undosLeft > 0 ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.1)',
            color: undosLeft > 0 ? '#05070D' : 'var(--text-dim)',
            fontWeight: 900,
          }}
        >
          {undosLeft}
        </span>
      </button>

      {/* Solver Hint Assistant Button */}
      <button
        className="cyber-btn"
        onClick={onHint}
        aria-label="Compute neural solver hint"
        style={{
          flex: 1,
          maxWidth: '160px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
        }}
      >
        <Lightbulb size={18} color="var(--neon-yellow)" />
        <span>NEURAL HINT</span>
      </button>

      {/* Quick Restart Button */}
      <button
        className="cyber-btn cyber-btn-icon"
        onClick={onRestart}
        aria-label="Restart puzzle"
        title="Restart Sector"
      >
        <RotateCcw size={18} />
      </button>
    </footer>
  );
};
