import React from 'react';
import { CYBER_PALETTE } from '../../core/config';
import { ColorId } from '../../core/types';

interface BubbleProps {
  color: ColorId;
  size?: number;
  isLifted?: boolean;
  colorBlindMode?: boolean;
  className?: string;
}

export const Bubble: React.FC<BubbleProps> = ({
  color,
  size = 52,
  isLifted = false,
  colorBlindMode = false,
  className = '',
}) => {
  const palette = CYBER_PALETTE[color] || CYBER_PALETTE[0];

  return (
    <div
      className={`cyber-bubble ${isLifted ? 'lifted' : ''} ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        filter: isLifted
          ? `drop-shadow(0 0 16px ${palette.glow}) drop-shadow(0 0 32px ${palette.intense})`
          : `drop-shadow(0 0 8px ${palette.glow})`,
        transition: 'all 0.18s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: isLifted ? 'scale(1.08)' : 'scale(1)',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Internal Plasma Glow Radial Gradient */}
          <radialGradient id={`plasma-${color}`} cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="25%" stopColor={palette.hex} stopOpacity="0.9" />
            <stop offset="70%" stopColor={palette.hex} stopOpacity="0.75" />
            <stop offset="100%" stopColor="#05070D" stopOpacity="0.85" />
          </radialGradient>

          {/* Specular Glint Gradient */}
          <linearGradient id={`specular-${color}`} x1="0%" y1="0%" x2="50%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>

          {/* Rim Light Gradient */}
          <linearGradient id={`rim-${color}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={palette.hex} stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient Outer Halo */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={palette.hex}
          strokeWidth="1.5"
          opacity="0.4"
        />

        {/* Plasma Orb Body */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill={`url(#plasma-${color})`}
          stroke={`url(#rim-${color})`}
          strokeWidth="2.5"
        />

        {/* Core Luminous Specular Reflection */}
        <ellipse
          cx="36"
          cy="28"
          rx="18"
          ry="10"
          fill={`url(#specular-${color})`}
          transform="rotate(-25 36 28)"
        />

        {/* Secondary subtle bottom rim reflection */}
        <path
          d="M 25 75 Q 50 88 75 75"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2"
          opacity="0.3"
          strokeLinecap="round"
        />
      </svg>

      {/* Holographic Color-Blind Mode Rune / Symbol */}
      {colorBlindMode && (
        <span
          style={{
            position: 'absolute',
            fontFamily: 'var(--font-tech)',
            fontSize: `${size * 0.42}px`,
            fontWeight: 900,
            color: '#FFFFFF',
            textShadow: `0 0 8px #000, 0 0 12px ${palette.hex}`,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {palette.symbol}
        </span>
      )}
    </div>
  );
};
