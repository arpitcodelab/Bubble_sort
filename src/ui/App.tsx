import React from 'react';
import { useGameStore } from '../store/gameStore';
import { DifficultyScreen } from './screens/DifficultyScreen';
import { GameScreen } from './screens/GameScreen';
import { HomeScreen } from './screens/HomeScreen';
import { LevelSelectScreen } from './screens/LevelSelectScreen';
import { HowToPlay } from './components/HowToPlay';
import { SettingsSheet } from './components/SettingsSheet';
import { CyberBackground } from './components/CyberBackground';

export const App: React.FC = () => {
  const {
    screen,
    currentTier,
    progress,
    settings,
    setScreen,
    selectTier,
    loadLevel,
    updateSettings,
    resetProgress,
  } = useGameStore();

  const [showGlobalSettings, setShowGlobalSettings] = React.useState(false);

  return (
    <main
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Ambient Cyberpunk Atmospheric Layers */}
      <div className="cyber-bg" />
      <div className="cyber-grid" />
      <div className="cyber-scanlines" />
      <CyberBackground />

      {/* Screen Router */}
      {screen === 'home' && (
        <HomeScreen
          onPlay={() => setScreen('difficulty')}
          onSettings={() => setShowGlobalSettings(true)}
        />
      )}

      {screen === 'difficulty' && (
        <DifficultyScreen
          progress={progress}
          onSelectTier={(tier) => selectTier(tier)}
          onBack={() => setScreen('home')}
          onOpenSettings={() => setShowGlobalSettings(true)}
        />
      )}

      {screen === 'levelSelect' && (
        <LevelSelectScreen
          tier={currentTier}
          progress={progress}
          onSelectLevel={(levelId) => loadLevel(currentTier, levelId)}
          onBack={() => setScreen('difficulty')}
          onOpenSettings={() => setShowGlobalSettings(true)}
        />
      )}

      {screen === 'game' && <GameScreen />}

      {screen === 'howToPlay' && (
        <HowToPlay onClose={() => setScreen('home')} />
      )}

      {showGlobalSettings && (
        <SettingsSheet
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetProgress={() => {
            resetProgress();
            setShowGlobalSettings(false);
            setScreen('home');
          }}
          onClose={() => setShowGlobalSettings(false)}
        />
      )}
    </main>
  );
};
export default App;
