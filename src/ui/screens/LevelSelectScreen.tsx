import React from 'react';
import { Lock, Star } from 'lucide-react';
import { TIER_CONFIGS } from '../../core/config';
import { ProgressMap, Tier } from '../../core/types';
import { TopBar } from '../components/TopBar';

interface LevelSelectScreenProps {
  tier: Tier;
  progress: ProgressMap;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
  onOpenSettings: () => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  tier,
  progress,
  onSelectLevel,
  onBack,
  onOpenSettings,
}) => {
  const config = TIER_CONFIGS[tier];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <TopBar
        title={config.name}
        subtitle={`${config.colors} Colors • ${config.tubes} Tubes`}
        onBack={onBack}
        onOpenSettings={onOpenSettings}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '14px',
          margin: 'auto 0',
        }}
      >
        {Array.from({ length: config.totalLevels }).map((_, idx) => {
          const levelId = idx + 1;
          const key = `${tier}-${levelId}`;
          const levelProgress = progress[key];
          const isCompleted = levelProgress?.completed;
          const stars = levelProgress?.stars || 0;

          // Level 1 is always unlocked. Level n is unlocked if level n-1 is completed.
          const isUnlocked = levelId === 1 || progress[`${tier}-${levelId - 1}`]?.completed;

          return (
            <button
              key={levelId}
              className="cyber-panel"
              onClick={() => isUnlocked && onSelectLevel(levelId)}
              disabled={!isUnlocked}
              style={{
                height: '84px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
                opacity: isUnlocked ? 1 : 0.4,
                border: isCompleted
                  ? '1px solid var(--neon-cyan)'
                  : isUnlocked
                  ? '1px solid rgba(0, 240, 255, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                background: isCompleted
                  ? 'rgba(0, 240, 255, 0.08)'
                  : 'rgba(12, 17, 28, 0.8)',
                boxShadow: isCompleted ? '0 0 14px rgba(0, 240, 255, 0.2)' : 'none',
                transition: 'all 0.15s',
              }}
            >
              {isUnlocked ? (
                <>
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.25rem',
                      fontWeight: 800,
                      color: isCompleted ? 'var(--neon-cyan)' : '#FFFFFF',
                    }}
                  >
                    {levelId}
                  </span>

                  {/* Stars Row */}
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        fill={s <= stars ? '#FFD700' : 'none'}
                        color={s <= stars ? '#FFD700' : 'rgba(255, 255, 255, 0.2)'}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Lock size={18} color="var(--text-dim)" />
                  <span
                    style={{
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.8rem',
                      color: 'var(--text-dim)',
                    }}
                  >
                    LVL {levelId}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
