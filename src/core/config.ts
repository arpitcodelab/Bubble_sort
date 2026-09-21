import { Tier, TierConfig } from './types';

export const CAPACITY = 4;
export const MAX_UNDOS_PER_LEVEL = 5;

export interface CyberColor {
  id: number;
  name: string;
  hex: string;
  glow: string;
  intense: string;
  symbol: string; // for color-blind mode
  symbolName: string;
}

export const CYBER_PALETTE: readonly CyberColor[] = [
  {
    id: 0,
    name: 'Cyan Plasma',
    hex: '#00F0FF',
    glow: 'rgba(0, 240, 255, 0.55)',
    intense: 'rgba(0, 240, 255, 0.95)',
    symbol: '●',
    symbolName: 'Circle',
  },
  {
    id: 1,
    name: 'Neon Orange',
    hex: '#FF7700',
    glow: 'rgba(255, 119, 0, 0.55)',
    intense: 'rgba(255, 119, 0, 0.95)',
    symbol: '▲',
    symbolName: 'Triangle',
  },
  {
    id: 2,
    name: 'Hyper Yellow',
    hex: '#FFE600',
    glow: 'rgba(255, 230, 0, 0.55)',
    intense: 'rgba(255, 230, 0, 0.95)',
    symbol: '■',
    symbolName: 'Square',
  },
  {
    id: 3,
    name: 'Matrix Green',
    hex: '#00FF66',
    glow: 'rgba(0, 255, 102, 0.55)',
    intense: 'rgba(0, 255, 102, 0.95)',
    symbol: '★',
    symbolName: 'Star',
  },
  {
    id: 4,
    name: 'Electric Blue',
    hex: '#0088FF',
    glow: 'rgba(0, 136, 255, 0.55)',
    intense: 'rgba(0, 136, 255, 0.95)',
    symbol: '♥',
    symbolName: 'Heart',
  },
  {
    id: 5,
    name: 'Ultra Violet',
    hex: '#A200FF',
    glow: 'rgba(162, 0, 255, 0.55)',
    intense: 'rgba(162, 0, 255, 0.95)',
    symbol: '◆',
    symbolName: 'Diamond',
  },
  {
    id: 6,
    name: 'Neon Magenta',
    hex: '#FF007F',
    glow: 'rgba(255, 0, 127, 0.55)',
    intense: 'rgba(255, 0, 127, 0.95)',
    symbol: '✚',
    symbolName: 'Cross',
  },
] as const;

export const TIER_CONFIGS: Record<Tier, TierConfig> = {
  easy: {
    name: 'EASY',
    tubes: 5,
    colors: 3,
    emptyTubes: 2,
    totalLevels: 12,
    undosAllowed: 5,
  },
  medium: {
    name: 'MEDIUM',
    tubes: 7,
    colors: 5,
    emptyTubes: 2,
    totalLevels: 12,
    undosAllowed: 5,
  },
  hard: {
    name: 'HARD',
    tubes: 9,
    colors: 7,
    emptyTubes: 2,
    totalLevels: 12,
    undosAllowed: 5,
  },
};

/** Calculate stars from moves taken relative to par */
export function calculateStars(movesTaken: number, parMoves: number): number {
  if (movesTaken <= Math.max(parMoves * 1.25, parMoves + 2)) {
    return 3;
  }
  if (movesTaken <= Math.max(parMoves * 1.75, parMoves + 5)) {
    return 2;
  }
  return 1;
}
