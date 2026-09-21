import React from 'react';
import { ArrowLeft, RotateCcw, Settings } from 'lucide-react';

interface TopBarProps {
  title: string;
  subtitle?: string;
  soundEnabled?: boolean;
  onBack: () => void;
  onRestart?: () => void;
  onToggleSound?: () => void;
  onOpenHowToPlay?: () => void;
  onOpenSettings?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  onBack,
  onRestart,
  onOpenSettings,
}) => {
  return (
    <header
      className="cyber-topbar"
      style={{
        width: '100%',
        maxWidth: '720px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        position: 'relative',
        zIndex: 10,
        gap: '8px',
      }}
    >
      {/* Left Back Navigation */}
      <button
        className="cyber-btn cyber-btn-icon"
        onClick={onBack}
        aria-label="Return to navigation menu"
        style={{ width: '40px', height: '40px', flexShrink: 0 }}
      >
        <ArrowLeft size={20} color="var(--neon-cyan)" />
      </button>

      {/* Center Level Title & Tier */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          minWidth: 0,
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.06em',
            color: '#FFFFFF',
            textShadow: '0 0 10px var(--neon-cyan-glow)',
            margin: 0,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.75rem',
              color: 'var(--text-dim)',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      {/* Right Controls (Restart + Settings only) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {onRestart && (
          <button
            className="cyber-btn cyber-btn-icon"
            onClick={onRestart}
            aria-label="Restart Level"
            title="Restart Level"
            style={{ width: '40px', height: '40px' }}
          >
            <RotateCcw size={18} color="#FFFFFF" />
          </button>
        )}

        {onOpenSettings && (
          <button
            className="cyber-btn cyber-btn-icon"
            onClick={onOpenSettings}
            aria-label="Settings"
            title="System Config"
            style={{ width: '40px', height: '40px' }}
          >
            <Settings size={18} color="var(--neon-cyan)" />
          </button>
        )}
      </div>
    </header>
  );
};
