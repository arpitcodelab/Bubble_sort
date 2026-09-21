import React from 'react';
import { MAX_UNDOS_PER_LEVEL } from '../../core/config';

interface StatusRowProps {
  movesTaken: number;
  par: number;
  undosLeft: number;
  tierName?: string;
}

export const StatusRow: React.FC<StatusRowProps> = ({
  movesTaken,
  par,
  undosLeft,
}) => {
  return (
    <div
      className="cyber-status-row"
      style={{
        width: '100%',
        maxWidth: '720px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 16px',
        margin: '0 auto 6px auto',
        zIndex: 5,
      }}
    >
      {/* Moves / Par Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(12, 17, 28, 0.7)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--metal-border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.08em',
          }}
        >
          MOVES
        </span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 800,
            color: movesTaken <= par ? 'var(--neon-green)' : '#FFFFFF',
            textShadow: movesTaken <= par ? '0 0 8px var(--neon-green-glow)' : 'none',
          }}
        >
          {movesTaken}{' '}
          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 500 }}>
            / {par}
          </span>
        </span>
      </div>

      {/* Rewind Charges Indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(12, 17, 28, 0.7)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--metal-border)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-tech)',
            fontSize: '0.75rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.08em',
          }}
        >
          REWIND
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: MAX_UNDOS_PER_LEVEL }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: i < undosLeft ? 'var(--neon-cyan)' : 'rgba(255, 255, 255, 0.12)',
                boxShadow: i < undosLeft ? '0 0 6px var(--neon-cyan)' : 'none',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
