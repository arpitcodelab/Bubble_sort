import React from 'react';
import { X, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { GameSettings } from '../../core/types';

interface SettingsSheetProps {
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  onResetProgress?: () => void;
  onOpenHowToPlay?: () => void;
  onClose: () => void;
}

export const SettingsSheet: React.FC<SettingsSheetProps> = ({
  settings,
  onUpdateSettings,
  onClose,
}) => {
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
        padding: '16px',
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          border: '1px solid var(--neon-cyan)',
          boxShadow: '0 0 30px var(--neon-cyan-glow)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--neon-cyan)',
                margin: 0,
                letterSpacing: '0.08em',
              }}
            >
              SYSTEM CONFIG
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontFamily: 'var(--font-tech)' }}>
              TERMINAL SETTINGS
            </span>
          </div>

          <button
            className="cyber-btn cyber-btn-icon"
            onClick={onClose}
            aria-label="Close settings"
            style={{ width: '38px', height: '38px' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick-Toggle Icon Grid: Audio & Haptics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
          }}
        >
          {/* Audio Synthesizer */}
          <button
            className="cyber-btn"
            onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
            style={{
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              background: settings.soundEnabled
                ? 'linear-gradient(180deg, rgba(0, 240, 255, 0.18) 0%, rgba(0, 120, 200, 0.25) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
              borderColor: settings.soundEnabled ? 'var(--neon-cyan)' : 'var(--metal-border)',
              boxShadow: settings.soundEnabled ? '0 0 14px var(--neon-cyan-glow)' : 'none',
            }}
          >
            {settings.soundEnabled ? (
              <Volume2 size={24} color="var(--neon-cyan)" />
            ) : (
              <VolumeX size={24} color="var(--text-dim)" />
            )}
            <span style={{ fontSize: '0.85rem', color: settings.soundEnabled ? '#FFFFFF' : 'var(--text-dim)' }}>
              AUDIO: {settings.soundEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Haptic Feedback */}
          <button
            className="cyber-btn"
            onClick={() => onUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled })}
            style={{
              padding: '16px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              background: settings.hapticsEnabled
                ? 'linear-gradient(180deg, rgba(0, 240, 255, 0.18) 0%, rgba(0, 120, 200, 0.25) 100%)'
                : 'rgba(255, 255, 255, 0.03)',
              borderColor: settings.hapticsEnabled ? 'var(--neon-cyan)' : 'var(--metal-border)',
              boxShadow: settings.hapticsEnabled ? '0 0 14px var(--neon-cyan-glow)' : 'none',
            }}
          >
            <Smartphone size={24} color={settings.hapticsEnabled ? 'var(--neon-cyan)' : 'var(--text-dim)'} />
            <span style={{ fontSize: '0.85rem', color: settings.hapticsEnabled ? '#FFFFFF' : 'var(--text-dim)' }}>
              HAPTICS: {settings.hapticsEnabled ? 'ON' : 'OFF'}
            </span>
          </button>
        </div>

        {/* Save / Close */}
        <button
          className="cyber-btn cyber-btn-primary"
          onClick={onClose}
          style={{ width: '100%', padding: '12px' }}
        >
          DONE
        </button>
      </div>
    </div>
  );
};
