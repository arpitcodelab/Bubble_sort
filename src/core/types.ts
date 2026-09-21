export type ColorId = number; // 0..6

export interface Bubble {
  id: number;
  color: ColorId;
}

/** Array of bubbles in a tube, index 0 is bottom, last element is top */
export type Tube = readonly Bubble[];

export type Tier = 'easy' | 'medium' | 'hard';

/** Simplified color representation for solver/generator */
export type ColorTube = readonly ColorId[];

export interface Move {
  fromTube: number;
  toTube: number;
  bubbles: Bubble[]; // array of bubbles transferred in this move
  color: ColorId;
}

export interface LevelData {
  id: number;
  tier: Tier;
  name: string;
  tubeCount: number;
  colorCount: number;
  capacity: number;
  tubes: ColorId[][]; // initial layout
  par: number; // minimum moves known
  seed?: number;
}

export interface LevelProgress {
  completed: boolean;
  stars: number; // 0..3
  bestMoves?: number;
}

export type ProgressMap = Record<string, LevelProgress>; // key: `${tier}-${levelId}`

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  colorBlindMode: boolean;
  reducedMotion: boolean;
}

export type ScreenType = 'splash' | 'home' | 'difficulty' | 'levelSelect' | 'game' | 'howToPlay';

export interface TierConfig {
  name: string;
  tubes: number;
  colors: number;
  emptyTubes: number;
  totalLevels: number;
  undosAllowed: number;
}
