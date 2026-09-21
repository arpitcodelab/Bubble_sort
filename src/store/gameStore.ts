import { create } from 'zustand';
import levelsJson from '../data/levels.json';
import { calculateStars, CAPACITY, CYBER_PALETTE, MAX_UNDOS_PER_LEVEL } from '../core/config';
import {
  applyMove,
  canMove,
  createTubesFromColors,
  hasLegalMoves,
  isSolved,
  isTubeSealed,
  undoMove,
} from '../core/engine';
import { solve } from '../core/solver';
import {
  GameSettings,
  LevelData,
  Move,
  ProgressMap,
  ScreenType,
  Tier,
  Tube,
} from '../core/types';
import { sound } from '../services/audio';
import { HAPTIC_PATTERNS, triggerHaptic } from '../services/haptics';
import {
  clearAllStorage,
  DEFAULT_SETTINGS,
  loadStoredProgress,
  loadStoredSettings,
  saveStoredProgress,
  saveStoredSettings,
} from '../services/storage';

const ALL_LEVELS = levelsJson as Record<Tier, LevelData[]>;

interface GameStoreState {
  screen: ScreenType;
  currentTier: Tier;
  currentLevelId: number;
  levelData: LevelData | null;
  tubes: Tube[];
  selectedTubeIndex: number | null;
  moveHistory: Move[];
  movesTaken: number;
  undosLeft: number;
  isWon: boolean;
  isStuck: boolean;
  justSealedTube: number | null;
  hintMove: { from: number; to: number } | null;
  shakeTubeIndex: number | null;
  announcement: string;
  progress: ProgressMap;
  settings: GameSettings;

  // Actions
  setScreen: (screen: ScreenType) => void;
  selectTier: (tier: Tier) => void;
  loadLevel: (tier: Tier, levelId: number) => void;
  tapTube: (tubeIndex: number) => void;
  undo: () => void;
  restartLevel: () => void;
  nextLevel: () => void;
  requestHint: () => void;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  resetProgress: () => void;
  dismissStuck: () => void;
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  screen: 'home',
  currentTier: 'easy',
  currentLevelId: 1,
  levelData: null,
  tubes: [],
  selectedTubeIndex: null,
  moveHistory: [],
  movesTaken: 0,
  undosLeft: MAX_UNDOS_PER_LEVEL,
  isWon: false,
  isStuck: false,
  justSealedTube: null,
  hintMove: null,
  shakeTubeIndex: null,
  announcement: 'Bubble Sort Initialized',
  progress: loadStoredProgress(),
  settings: loadStoredSettings(),

  setScreen: (screen) => {
    sound.playClick();
    set({ screen, hintMove: null });
  },

  selectTier: (tier) => {
    sound.playClick();
    set({ currentTier: tier, screen: 'levelSelect' });
  },

  loadLevel: (tier, levelId) => {
    const tierLevels = ALL_LEVELS[tier] || [];
    const target = tierLevels.find((l) => l.id === levelId) || tierLevels[0];
    if (!target) return;

    sound.playClick();
    const tubes = createTubesFromColors(target.tubes);

    set({
      screen: 'game',
      currentTier: tier,
      currentLevelId: target.id,
      levelData: target,
      tubes,
      selectedTubeIndex: null,
      moveHistory: [],
      movesTaken: 0,
      undosLeft: MAX_UNDOS_PER_LEVEL,
      isWon: false,
      isStuck: false,
      justSealedTube: null,
      hintMove: null,
      shakeTubeIndex: null,
      announcement: `Loaded ${target.name}. 4 capacity tubes.`,
    });
  },

  tapTube: (tubeIndex: number) => {
    const {
      tubes,
      selectedTubeIndex,
      isWon,
      levelData,
      moveHistory,
      movesTaken,
      settings,
      progress,
      currentTier,
      currentLevelId,
    } = get();

    if (isWon || !levelData) return;
    if (tubeIndex < 0 || tubeIndex >= tubes.length) return;

    const targetTube = tubes[tubeIndex];

    // 1. If nothing is selected currently
    if (selectedTubeIndex === null) {
      if (targetTube.length === 0) {
        // Tapping an empty tube when nothing selected -> subtle feedback
        return;
      }
      if (isTubeSealed(targetTube, CAPACITY)) {
        // Cannot select a sealed tube
        sound.playBlocked();
        set({ shakeTubeIndex: tubeIndex, announcement: `Tube ${tubeIndex + 1} is already sealed.` });
        setTimeout(() => set({ shakeTubeIndex: null }), 300);
        return;
      }

      // Select this tube (lifts top bubble)
      sound.playSelect();
      triggerHaptic(HAPTIC_PATTERNS.select, settings.hapticsEnabled);
      set({
        selectedTubeIndex: tubeIndex,
        hintMove: null,
        announcement: `Selected tube ${tubeIndex + 1}.`,
      });
      return;
    }

    // 2. If the user taps the ALREADY selected tube -> deselect
    if (selectedTubeIndex === tubeIndex) {
      sound.playSelect();
      set({ selectedTubeIndex: null, announcement: `Deselected tube ${tubeIndex + 1}.` });
      return;
    }

    // 3. User tapped a DIFFERENT tube while having a tube selected
    if (canMove(tubes, selectedTubeIndex, tubeIndex, CAPACITY)) {
      // Execute legal move
      const result = applyMove(tubes, selectedTubeIndex, tubeIndex, CAPACITY);
      if (!result) return;

      sound.playDrop();
      triggerHaptic(HAPTIC_PATTERNS.drop, settings.hapticsEnabled);

      const newTubes = result.newTubes;
      const newMoveHistory = [...moveHistory, result.move];
      const newMovesTaken = movesTaken + 1;

      // Check if the destination tube just became sealed
      const destTube = newTubes[tubeIndex];
      const justSealed = isTubeSealed(destTube, CAPACITY);
      if (justSealed) {
        sound.playTubeSeal();
        triggerHaptic(HAPTIC_PATTERNS.seal, settings.hapticsEnabled);
      }

      // Check for win condition
      const won = isSolved(newTubes, CAPACITY);
      let updatedProgress = progress;

      if (won) {
        sound.playWin();
        triggerHaptic(HAPTIC_PATTERNS.win, settings.hapticsEnabled);

        const stars = calculateStars(newMovesTaken, levelData.par);
        const progressKey = `${currentTier}-${currentLevelId}`;
        const prev = progress[progressKey];

        const bestMoves = prev?.bestMoves
          ? Math.min(prev.bestMoves, newMovesTaken)
          : newMovesTaken;
        const bestStars = prev?.stars ? Math.max(prev.stars, stars) : stars;

        updatedProgress = {
          ...progress,
          [progressKey]: {
            completed: true,
            stars: bestStars,
            bestMoves,
          },
        };
        saveStoredProgress(updatedProgress);
      }

      // Check if stuck (no legal moves and not won)
      const stuck = !won && !hasLegalMoves(newTubes, CAPACITY);

      set({
        tubes: newTubes,
        selectedTubeIndex: null,
        moveHistory: newMoveHistory,
        movesTaken: newMovesTaken,
        isWon: won,
        isStuck: stuck,
        justSealedTube: justSealed ? tubeIndex : null,
        progress: updatedProgress,
        announcement: won
          ? `Sector Complete! Moves: ${newMovesTaken}`
          : `Transferred energy to tube ${tubeIndex + 1}. Total moves: ${newMovesTaken}.`,
      });

      if (justSealed) {
        setTimeout(() => set({ justSealedTube: null }), 1200);
      }
    } else {
      // Move is illegal (different color or full tube)
      // Play blocked feedback and shake the destination tube; KEEP current selection
      sound.playBlocked();
      triggerHaptic(HAPTIC_PATTERNS.blocked, settings.hapticsEnabled);
      const sourceTube = tubes[selectedTubeIndex];
      const movingColor = sourceTube && sourceTube.length > 0 ? sourceTube[sourceTube.length - 1].color : null;
      const colorName = movingColor !== null ? CYBER_PALETTE[movingColor]?.name : 'plasma';

      set({
        shakeTubeIndex: tubeIndex,
        announcement: `Invalid transfer: cannot place ${colorName} into cylinder ${tubeIndex + 1}.`,
      });
      setTimeout(() => set({ shakeTubeIndex: null }), 350);
    }
  },

  undo: () => {
    const { tubes, moveHistory, movesTaken, undosLeft, isWon, settings } = get();
    if (isWon || undosLeft <= 0 || moveHistory.length === 0) {
      sound.playBlocked();
      return;
    }

    const lastMove = moveHistory[moveHistory.length - 1];
    const newTubes = undoMove(tubes, lastMove);
    const newHistory = moveHistory.slice(0, -1);
    const newUndosLeft = undosLeft - 1;
    const newMovesTaken = Math.max(0, movesTaken - 1);

    sound.playUndo();
    triggerHaptic(HAPTIC_PATTERNS.drop, settings.hapticsEnabled);

    set({
      tubes: newTubes,
      moveHistory: newHistory,
      undosLeft: newUndosLeft,
      movesTaken: newMovesTaken,
      selectedTubeIndex: null,
      isStuck: false,
      announcement: `Undid last move. ${newUndosLeft} undos remaining.`,
    });
  },

  restartLevel: () => {
    const { currentTier, currentLevelId } = get();
    get().loadLevel(currentTier, currentLevelId);
  },

  nextLevel: () => {
    const { currentTier, currentLevelId, setScreen, loadLevel } = get();
    if (currentLevelId < 12) {
      loadLevel(currentTier, currentLevelId + 1);
    } else {
      // Completed level 12 in tier: auto-advance to next sector tier
      if (currentTier === 'easy') {
        loadLevel('medium', 1);
      } else if (currentTier === 'medium') {
        loadLevel('hard', 1);
      } else {
        setScreen('levelSelect');
      }
    }
  },

  requestHint: () => {
    const { tubes, settings } = get();
    const colorTubes = tubes.map((t) => t.map((b) => b.color));
    const solution = solve(colorTubes, CAPACITY, 10000);

    if (solution && solution.moves.length > 0) {
      const next = solution.moves[0];
      sound.playSelect();
      triggerHaptic(HAPTIC_PATTERNS.select, settings.hapticsEnabled);
      set({
        hintMove: next,
        announcement: `Hint: Transfer energy from Tube ${next.from + 1} to Tube ${next.to + 1}.`,
      });
    } else {
      sound.playBlocked();
    }
  },

  updateSettings: (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    saveStoredSettings(updated);
    sound.setEnabled(updated.soundEnabled);
    set({ settings: updated });
  },

  resetProgress: () => {
    clearAllStorage();
    set({ progress: {}, settings: DEFAULT_SETTINGS });
    sound.setEnabled(true);
  },

  dismissStuck: () => {
    set({ isStuck: false });
  },
}));
