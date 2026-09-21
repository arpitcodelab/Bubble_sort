import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Play, RotateCcw, Grid } from 'lucide-react';
import { calculateStars } from '../../core/config';
import { Stars } from './Stars';

interface ResultSheetProps {
  movesTaken: number;
  parMoves: number;
  bestMoves?: number;
  levelName: string;
  isLastLevel: boolean;
  reducedMotion: boolean;
  onNext: () => void;
  onReplay: () => void;
  onLevelSelect: () => void;
}

export const ResultSheet: React.FC<ResultSheetProps> = ({
  movesTaken,
  parMoves,
  bestMoves,
  levelName,
  isLastLevel,
  reducedMotion,
  onNext,
  onReplay,
  onLevelSelect,
}) => {
  const stars = calculateStars(movesTaken, parMoves);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(3);
  const autoAdvanceRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!reducedMotion) {
      // Trigger Cyberpunk Confetti / Particle Flare
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#0088FF', '#A200FF', '#FF007F', '#00FF66', '#FFE600'],
        });
      } catch {
        // Fallback safely if canvas not available
      }
    }

    // Auto-advance interval
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [reducedMotion, onNext]);

  const handleManualReplay = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    onReplay();
  };

  const handleManualLevelSelect = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current);
    onLevelSelect();
  };

  return (
    <div
      className="cyber-modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 7, 11, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '20px',
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          textAlign: 'center',
          border: '1px solid var(--neon-cyan)',
          boxShadow: '0 0 35px var(--neon-cyan-glow), inset 0 0 20px rgba(0, 240, 255, 0.15)',
          animation: 'cyber-pulse 2s infinite alternate',
        }}
      >
        {/* Luminous Title Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.9rem',
              color: 'var(--neon-cyan)',
              letterSpacing: '0.15em',
              fontWeight: 700,
            }}
          >
            CONTAINMENT MATRIX STABILIZED
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 900,
              color: '#FFFFFF',
              textShadow: '0 0 15px var(--neon-cyan-glow)',
              margin: 0,
            }}
          >
            {isLastLevel ? 'SECTOR CLEARED!' : 'LEVEL COMPLETE'}
          </h2>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{levelName}</span>
        </div>

        {/* Stars Rating */}
        <div style={{ margin: '8px 0' }}>
          <Stars count={stars} size={36} />
        </div>

        {/* Telemetry Stats Card */}
        <div
          style={{
            width: '100%',
            background: 'rgba(12, 17, 28, 0.9)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)' }}>
              MOVES TAKEN
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-display)' }}>
              {movesTaken}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)' }}>
              PAR BENCHMARK
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neon-green)', fontFamily: 'var(--font-display)' }}>
              {parMoves}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)' }}>
              BEST RECORD
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neon-cyan)', fontFamily: 'var(--font-display)' }}>
              {bestMoves ?? movesTaken}
            </span>
          </div>
        </div>

        {/* Auto-Upgrade Indicator */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-tech)', color: 'var(--neon-cyan)' }}>
            <span>UPGRADING TO NEXT LEVEL</span>
            <span>{secondsLeft}s</span>
          </div>
          <div style={{ width: '100%', height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${((3 - secondsLeft) / 3) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, var(--neon-cyan), var(--neon-green))',
                boxShadow: '0 0 8px var(--neon-cyan)',
                transition: 'width 1s linear',
              }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px', marginTop: '4px' }}>
          <button
            className="cyber-btn cyber-btn-primary"
            onClick={onNext}
            style={{ width: '100%', padding: '14px' }}
          >
            <Play size={18} />
            <span>{isLastLevel ? 'SECTOR SELECT' : 'NEXT LEVEL NOW'}</span>
          </button>

          <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
            <button
              className="cyber-btn"
              onClick={handleManualReplay}
              style={{ flex: 1 }}
            >
              <RotateCcw size={16} />
              <span>REPLAY</span>
            </button>

            <button
              className="cyber-btn"
              onClick={handleManualLevelSelect}
              style={{ flex: 1 }}
            >
              <Grid size={16} />
              <span>LEVELS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
