import React, { useState } from 'react';
import { TIER_CONFIGS } from '../../core/config';
import { useGameStore } from '../../store/gameStore';
import { Announcer } from '../components/Announcer';
import { Board } from '../components/Board';
import { BottomBar } from '../components/BottomBar';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { HowToPlay } from '../components/HowToPlay';
import { ResultSheet } from '../components/ResultSheet';
import { SettingsSheet } from '../components/SettingsSheet';
import { StatusRow } from '../components/StatusRow';
import { TopBar } from '../components/TopBar';
import { useKeyboardBoard } from '../hooks/useKeyboardBoard';

export const GameScreen: React.FC = () => {
  const {
    currentTier,
    currentLevelId,
    levelData,
    tubes,
    selectedTubeIndex,
    movesTaken,
    undosLeft,
    moveHistory,
    isWon,
    isStuck,
    justSealedTube,
    hintMove,
    shakeTubeIndex,
    announcement,
    progress,
    settings,
    setScreen,
    tapTube,
    undo,
    restartLevel,
    nextLevel,
    requestHint,
    updateSettings,
    resetProgress,
    dismissStuck,
  } = useGameStore();

  const [showRestartConfirm, setShowRestartConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  // Keyboard navigation hook
  useKeyboardBoard({
    tubeCount: tubes.length,
    onTapTube: tapTube,
    onUndo: undo,
    onRestart: () => {
      if (movesTaken > 0) setShowRestartConfirm(true);
      else restartLevel();
    },
    onDeselect: () => {
      if (selectedTubeIndex !== null) tapTube(selectedTubeIndex);
    },
    enabled: !isWon && !isStuck && !showRestartConfirm && !showSettings && !showHowToPlay,
  });

  if (!levelData) return null;

  const tierConfig = TIER_CONFIGS[currentTier];
  const progressKey = `${currentTier}-${currentLevelId}`;
  const currentLevelProgress = progress[progressKey];

  const handleRestartClick = () => {
    if (movesTaken > 0) {
      setShowRestartConfirm(true);
    } else {
      restartLevel();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '100%',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
      }}
    >
      <Announcer message={announcement} />

      {/* Top HUD */}
      <TopBar
        title={`LEVEL ${currentLevelId.toString().padStart(2, '0')}`}
        subtitle={`${currentTier.toUpperCase()} // PAR: ${levelData.par}`}
        onBack={() => setScreen('levelSelect')}
        onRestart={handleRestartClick}
        onOpenSettings={() => setShowSettings(true)}
      />

      {/* Telemetry Status Bar */}
      <StatusRow
        movesTaken={movesTaken}
        par={levelData.par}
        undosLeft={undosLeft}
        tierName={tierConfig.name}
      />

      {/* Interactive Containment Board */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Board
          tubes={tubes}
          selectedTubeIndex={selectedTubeIndex}
          hintMove={hintMove}
          shakeTubeIndex={shakeTubeIndex}
          justSealedTube={justSealedTube}
          colorBlindMode={settings.colorBlindMode}
          onTapTube={tapTube}
        />
      </div>

      {/* Bottom Tactical Controls */}
      <BottomBar
        undosLeft={undosLeft}
        canUndo={moveHistory.length > 0}
        onUndo={undo}
        onHint={requestHint}
        onRestart={handleRestartClick}
      />

      {/* Level Complete Sheet Modal */}
      {isWon && (
        <ResultSheet
          movesTaken={movesTaken}
          parMoves={levelData.par}
          bestMoves={currentLevelProgress?.bestMoves}
          levelName={levelData.name}
          isLastLevel={currentLevelId === 12}
          reducedMotion={settings.reducedMotion}
          onNext={nextLevel}
          onReplay={restartLevel}
          onLevelSelect={() => setScreen('levelSelect')}
        />
      )}

      {/* Stuck Alert Modal */}
      {isStuck && !isWon && (
        <ConfirmDialog
          title="NO LEGAL MOVES AVAILABLE"
          message="The quantum containment flow is blocked. Rewind your recent moves or reset the containment matrix."
          confirmLabel={undosLeft > 0 ? "REWIND MOVE" : "RESET SECTOR"}
          cancelLabel="DISMISS"
          onConfirm={() => {
            if (undosLeft > 0) undo();
            else restartLevel();
          }}
          onCancel={dismissStuck}
        />
      )}

      {/* Restart Confirmation Guard */}
      {showRestartConfirm && (
        <ConfirmDialog
          title="RESET CONTAINMENT MATRIX?"
          message="All moves in this sector will be reset and 5 rewind charges will be restored."
          confirmLabel="RESET"
          cancelLabel="CANCEL"
          onConfirm={() => {
            setShowRestartConfirm(false);
            restartLevel();
          }}
          onCancel={() => setShowRestartConfirm(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsSheet
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetProgress={() => {
            resetProgress();
            setShowSettings(false);
            setScreen('home');
          }}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* How to Play Modal */}
      {showHowToPlay && <HowToPlay onClose={() => setShowHowToPlay(false)} />}
    </div>
  );
};
