import React from 'react';
import { ChevronRight, Zap, Cpu, Flame } from 'lucide-react';
import { TIER_CONFIGS } from '../../core/config';
import { ProgressMap, Tier } from '../../core/types';
import { TopBar } from '../components/TopBar';
import { Bubble } from '../components/Bubble';

interface DifficultyScreenProps {
  progress: ProgressMap;
  onSelectTier: (tier: Tier) => void;
  onBack: () => void;
  onOpenSettings: () => void;
}

export const DifficultyScreen: React.FC<DifficultyScreenProps> = ({
  progress,
  onSelectTier,
  onBack,
  onOpenSettings,
}) => {
  const tiers: Tier[] = ['easy', 'medium', 'hard'];

  const getTierStats = (tier: Tier) => {
    let completedCount = 0;
    let starCount = 0;
    for (let i = 1; i <= 12; i++) {
      const p = progress[`${tier}-${i}`];
      if (p?.completed) {
        completedCount++;
        starCount += p.stars || 0;
      }
    }
    return { completedCount, starCount };
  };

  const getTierIcon = (tier: Tier) => {
    switch (tier) {
      case 'easy':
        return <Zap size={22} color="var(--neon-green)" />;
      case 'medium':
        return <Cpu size={22} color="var(--neon-cyan)" />;
      case 'hard':
        return <Flame size={22} color="var(--neon-magenta)" />;
    }
  };

  const getTierAccent = (tier: Tier) => {
    switch (tier) {
      case 'easy':
        return 'var(--neon-green)';
      case 'medium':
        return 'var(--neon-cyan)';
      case 'hard':
        return 'var(--neon-magenta)';
    }
  };

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
        title="DIFFICULTY"
        onBack={onBack}
        onOpenSettings={onOpenSettings}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          width: '100%',
          maxWidth: '420px',
          padding: '16px',
          margin: 'auto 0',
        }}
      >
        {tiers.map((tier) => {
          const config = TIER_CONFIGS[tier];
          const { completedCount, starCount } = getTierStats(tier);
          const accent = getTierAccent(tier);

          return (
            <button
              key={tier}
              className="cyber-panel"
              onClick={() => onSelectTier(tier)}
              style={{
                width: '100%',
                padding: '18px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
                border: `1px solid ${accent}40`,
                background: 'rgba(12, 17, 28, 0.85)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.boxShadow = `0 0 20px ${accent}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = `${accent}40`;
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: `${accent}15`,
                    border: `1px solid ${accent}50`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {getTierIcon(tier)}
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      color: '#FFFFFF',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {config.name}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-tech)',
                      fontSize: '0.85rem',
                      color: 'var(--text-dim)',
                      marginTop: '2px',
                    }}
                  >
                    {config.colors} Colors • {config.tubes} Tubes
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginTop: '4px',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-tech)',
                      color: accent,
                      fontWeight: 600,
                    }}
                  >
                    <span>
                      Progress: {completedCount} / {config.totalLevels}
                    </span>
                    <span>★ {starCount}</span>
                  </div>
                </div>
              </div>

              {/* Sample Bubble Preview & Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: Math.min(config.colors, 3) }).map((_, i) => (
                    <Bubble key={i} color={tier === 'easy' ? i : tier === 'medium' ? i + 1 : i + 3} size={18} />
                  ))}
                </div>
                <ChevronRight size={20} color={accent} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
