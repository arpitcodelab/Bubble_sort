import React from 'react';
import { CAPACITY, CYBER_PALETTE } from '../../core/config';
import { getTopMatchingCount, isTubeSealed } from '../../core/engine';
import { Tube as TubeType } from '../../core/types';
import { Bubble } from './Bubble';

interface TubeProps {
  tubeIndex: number;
  tube: TubeType;
  isSelected: boolean;
  isHintSource?: boolean;
  isHintDest?: boolean;
  isShaking?: boolean;
  isJustSealed?: boolean;
  colorBlindMode?: boolean;
  onTap: () => void;
  scale?: number;
}

export const Tube: React.FC<TubeProps> = ({
  tubeIndex,
  tube,
  isSelected,
  isHintSource = false,
  isHintDest = false,
  isShaking = false,
  isJustSealed = false,
  colorBlindMode = false,
  onTap,
  scale = 1,
}) => {
  const isSealed = isTubeSealed(tube, CAPACITY);
  const sealedColor = isSealed && tube.length > 0 ? CYBER_PALETTE[tube[0].color] : null;
  const matchingCount = isSelected ? getTopMatchingCount(tube) : 0;

  const bubbleSize = 48 * scale;
  const tubeWidth = 64 * scale;
  const tubeHeight = 224 * scale;
  const slotPadding = 6 * scale;

  // ARIA description
  const contentDescription =
    tube.length === 0
      ? 'Empty containment cylinder'
      : `Contains ${tube.length} plasma orbs: ${tube
          .map((b) => CYBER_PALETTE[b.color]?.name || b.color)
          .join(', ')}. Top is ${CYBER_PALETTE[tube[tube.length - 1].color]?.name}`;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Containment Cylinder ${tubeIndex + 1}. ${contentDescription}. ${
        isSelected ? 'Selected.' : ''
      } ${isSealed ? 'Sealed.' : ''}`}
      onClick={onTap}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onTap();
        }
      }}
      className={`cyber-tube-container ${isShaking ? 'animate-shake' : ''}`}
      style={{
        position: 'relative',
        width: `${tubeWidth}px`,
        height: `${tubeHeight + 72 * scale}px`, // extra space at top for lifted bubbles
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        cursor: isSealed ? 'default' : 'pointer',
        touchAction: 'manipulation',
        outline: 'none',
      }}
    >
      {/* Lifted Top Bubbles (when selected) */}
      {isSelected && matchingCount > 0 && (
        <div
          className="animate-ball-lift"
          style={{
            position: 'absolute',
            bottom: `${tubeHeight + 8 * scale}px`,
            display: 'flex',
            flexDirection: 'column-reverse',
            alignItems: 'center',
            gap: `${4 * scale}px`,
            zIndex: 10,
          }}
        >
          {tube.slice(tube.length - matchingCount).map((b) => (
            <Bubble
              key={b.id}
              color={b.color}
              size={bubbleSize}
              isLifted={true}
              className="animate-ball-hover"
              colorBlindMode={colorBlindMode}
            />
          ))}
        </div>
      )}

      {/* Laser Guide Rails / Hint Aura */}
      {(isHintSource || isHintDest) && (
        <div
          style={{
            position: 'absolute',
            inset: `${40 * scale}px 0 0 0`,
            border: `2px dashed ${isHintSource ? 'var(--neon-yellow)' : 'var(--neon-green)'}`,
            borderRadius: `0 0 ${tubeWidth / 2}px ${tubeWidth / 2}px`,
            boxShadow: `0 0 24px ${isHintSource ? 'var(--neon-yellow-glow)' : 'var(--neon-green-glow)'}`,
            animation: 'cyber-pulse 1s infinite alternate',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Sealed Laser Overdrive Pulse */}
      {(isSealed || isJustSealed) && sealedColor && (
        <div
          style={{
            position: 'absolute',
            top: `${56 * scale}px`,
            width: `${tubeWidth * 0.9}px`,
            height: `${8 * scale}px`,
            background: sealedColor.hex,
            borderRadius: '4px',
            boxShadow: `0 0 16px ${sealedColor.glow}, 0 0 32px ${sealedColor.intense}`,
            zIndex: 12,
            animation: isJustSealed ? 'cyber-pulse 0.6s 2' : 'none',
          }}
        />
      )}

      {/* Physical Glass Containment Cylinder Body */}
      <div
        className="cyber-tube-body"
        style={{
          width: `${tubeWidth}px`,
          height: `${tubeHeight}px`,
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(14, 20, 32, 0.45) 0%, rgba(8, 12, 22, 0.85) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: `1.5px solid ${
            isShaking
              ? 'var(--neon-magenta)'
              : isSelected
              ? 'var(--neon-cyan)'
              : isSealed && sealedColor
              ? sealedColor.hex
              : 'rgba(0, 240, 255, 0.25)'
          }`,
          borderTop: 'none',
          borderRadius: `0 0 ${tubeWidth / 2}px ${tubeWidth / 2}px`,
          boxShadow: isShaking
            ? '0 0 25px rgba(255, 0, 127, 0.7), inset 0 0 16px rgba(255, 0, 127, 0.4)'
            : isSelected
            ? '0 0 24px var(--neon-cyan-glow), inset 0 0 16px rgba(0, 240, 255, 0.2)'
            : isSealed && sealedColor
            ? `0 0 24px ${sealedColor.glow}, inset 0 0 16px ${sealedColor.glow}`
            : '0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 12px rgba(0, 240, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          paddingBottom: `${slotPadding}px`,
          gap: `${4 * scale}px`,
          overflow: 'hidden',
          transition: 'border-color 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Top Rim Metallic Collar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${3 * scale}px`,
            background: isShaking
              ? 'var(--neon-magenta)'
              : isSelected
              ? 'var(--neon-cyan)'
              : isSealed && sealedColor
              ? sealedColor.hex
              : 'rgba(0, 240, 255, 0.4)',
            boxShadow: isShaking
              ? '0 0 12px var(--neon-magenta)'
              : isSelected
              ? '0 0 8px var(--neon-cyan)'
              : 'none',
          }}
        />

        {/* Vertical Specular Glass Reflection Sheen */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${8 * scale}px`,
            width: `${4 * scale}px`,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 80%, transparent 100%)',
            pointerEvents: 'none',
          }}
        />

        {/* Laser Capacity Graduation Notches */}
        {[1, 2, 3].map((slot) => (
          <div
            key={slot}
            style={{
              position: 'absolute',
              bottom: `${slot * (bubbleSize + 4 * scale) + slotPadding}px`,
              left: `${3 * scale}px`,
              width: `${4 * scale}px`,
              height: '1px',
              background: 'rgba(0, 240, 255, 0.25)',
              boxShadow: '0 0 4px rgba(0, 240, 255, 0.3)',
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Bubbles currently seated in the tube */}
        {tube.map((bubble, idx) => {
          // If this tube is selected and this bubble is among the lifted top matching stack, it is visually rendered hovering above
          const isLifted = isSelected && idx >= tube.length - matchingCount;
          if (isLifted) {
            return (
              <div
                key={bubble.id}
                style={{
                  width: `${bubbleSize}px`,
                  height: `${bubbleSize}px`,
                  opacity: 0,
                }}
              />
            );
          }

          return (
            <Bubble
              key={bubble.id}
              color={bubble.color}
              size={bubbleSize}
              className="animate-ball-drop"
              colorBlindMode={colorBlindMode}
            />
          );
        })}
      </div>
    </div>
  );
};
