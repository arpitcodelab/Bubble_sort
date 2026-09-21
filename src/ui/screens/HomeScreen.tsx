import React from 'react';
import { Play, Settings } from 'lucide-react';
import { Bubble } from '../components/Bubble';

interface HomeScreenProps {
  onPlay: () => void;
  onSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlay,
  onSettings,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '24px 20px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      {/* Top Right Settings Icon */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          zIndex: 10,
        }}
      >
        <button
          className="cyber-btn cyber-btn-icon"
          onClick={onSettings}
          aria-label="Settings"
          title="Settings"
          style={{ width: '44px', height: '44px' }}
        >
          <Settings size={20} color="var(--neon-cyan)" />
        </button>
      </div>

      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '380px',
          padding: '44px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '32px',
          textAlign: 'center',
          border: '1px solid var(--neon-cyan)',
          boxShadow: '0 0 35px var(--neon-cyan-glow)',
        }}
      >
        {/* Luminous Glowing Plasma Bubbles */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          <div className="animate-float" style={{ animationDelay: '0s' }}>
            <Bubble color={0} size={46} />
          </div>
          <div className="animate-float" style={{ animationDelay: '0.3s' }}>
            <Bubble color={4} size={58} isLifted={true} />
          </div>
          <div className="animate-float" style={{ animationDelay: '0.6s' }}>
            <Bubble color={2} size={46} />
          </div>
        </div>

        {/* Clean, Modern Game Title */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              textShadow: '0 0 20px var(--neon-cyan-glow)',
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            BUBBLE SORT
          </h1>
        </div>

        {/* Big Sleek Play Button */}
        <button
          className="cyber-btn cyber-btn-primary"
          onClick={onPlay}
          style={{
            width: '100%',
            maxWidth: '280px',
            padding: '16px 24px',
            fontSize: '1.25rem',
            fontWeight: 800,
            borderRadius: 'var(--radius-md)',
            letterSpacing: '0.08em',
          }}
        >
          <Play size={22} fill="#FFFFFF" />
          <span>PLAY</span>
        </button>
      </div>
    </div>
  );
};
