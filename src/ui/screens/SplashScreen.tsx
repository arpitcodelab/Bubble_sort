import React from 'react';
import { Play, Sparkles, Terminal } from 'lucide-react';
import { Bubble } from '../components/Bubble';

interface SplashScreenProps {
  onInitialize: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onInitialize }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        padding: '24px',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '40px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '28px',
          textAlign: 'center',
          border: '1px solid var(--neon-cyan)',
          boxShadow: '0 0 40px var(--neon-cyan-glow), inset 0 0 25px rgba(0, 240, 255, 0.1)',
        }}
      >
        {/* Holographic Header Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 240, 255, 0.12)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
          }}
        >
          <Terminal size={14} color="var(--neon-cyan)" />
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: 'var(--neon-cyan)',
            }}
          >
            ARCADE TERMINAL // YEAR 2099
          </span>
        </div>

        {/* Animated Plasma Orb Showcase */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', margin: '8px 0' }}>
          <div className="animate-float" style={{ animationDelay: '0s' }}>
            <Bubble color={0} size={48} />
          </div>
          <div className="animate-float" style={{ animationDelay: '0.4s' }}>
            <Bubble color={5} size={58} isLifted={true} />
          </div>
          <div className="animate-float" style={{ animationDelay: '0.8s' }}>
            <Bubble color={3} size={48} />
          </div>
        </div>

        {/* Main Display Title */}
        <div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.4rem',
              fontWeight: 900,
              letterSpacing: '0.08em',
              color: '#FFFFFF',
              textShadow: '0 0 20px var(--neon-cyan-glow), 0 0 40px rgba(0, 240, 255, 0.4)',
              lineHeight: 1.1,
              margin: '0 0 8px 0',
            }}
          >
            BUBBLE SORT
          </h1>
          <span
            style={{
              fontFamily: 'var(--font-tech)',
              fontSize: '1.2rem',
              fontWeight: 700,
              letterSpacing: '0.25em',
              color: 'var(--neon-cyan)',
              textShadow: '0 0 10px var(--neon-cyan)',
            }}
          >
            CYBERPUNK 2099
          </span>
        </div>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            maxWidth: '340px',
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Stabilize quantum plasma energy cylinders across high-frequency neural sectors.
        </p>

        {/* Boot Trigger Button */}
        <button
          className="cyber-btn cyber-btn-primary"
          onClick={onInitialize}
          style={{
            width: '100%',
            maxWidth: '320px',
            padding: '16px',
            fontSize: '1.15rem',
            marginTop: '8px',
          }}
        >
          <Play size={20} />
          <span>INITIALIZE TERMINAL</span>
          <Sparkles size={16} />
        </button>
      </div>
    </div>
  );
};
