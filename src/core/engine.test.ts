import { describe, it, expect } from 'vitest';
import { canMove, applyMove, undoMove, isSolved, isTubeSealed } from './engine';
import { Tube } from './types';

describe('Core Game Engine Tests', () => {
  it('should only allow legal moves according to color matching and capacity', () => {
    // Tube 0: [Cyan(0), Orange(1)]
    // Tube 1: [Cyan(0)]
    // Tube 2: [Orange(1)]
    // Tube 3: []
    const tubes: Tube[] = [
      [{ id: 1, color: 0 }, { id: 2, color: 1 }],
      [{ id: 3, color: 0 }],
      [{ id: 4, color: 1 }],
      [],
    ];

    // Move top from Tube 0 (Orange) to Tube 2 (Orange) -> Legal
    expect(canMove(tubes, 0, 2)).toBe(true);

    // Move top from Tube 0 (Orange) to Tube 1 (Cyan) -> Illegal (mismatched color)
    expect(canMove(tubes, 0, 1)).toBe(false);

    // Move top from Tube 0 (Orange) to Tube 3 (Empty) -> Legal
    expect(canMove(tubes, 0, 3)).toBe(true);

    // Move from empty tube -> Illegal
    expect(canMove(tubes, 3, 0)).toBe(false);

    // Move from same to same -> Illegal
    expect(canMove(tubes, 0, 0)).toBe(false);
  });

  it('should correctly apply a move and return updated state and move history', () => {
    const tubes: Tube[] = [
      [{ id: 1, color: 0 }, { id: 2, color: 1 }],
      [{ id: 3, color: 1 }],
    ];

    const result = applyMove(tubes, 0, 1);
    expect(result).not.toBeNull();
    expect(result!.newTubes[0].length).toBe(1);
    expect(result!.newTubes[1].length).toBe(2);
    expect(result!.newTubes[1][1].id).toBe(2);
    expect(result!.move.color).toBe(1);
  });

  it('should transfer multiple matching contiguous top bubbles in a single move', () => {
    // Tube 0 has 2 consecutive Orange(1) on top
    // Tube 1 is empty (has space for 4)
    const tubes: Tube[] = [
      [{ id: 1, color: 0 }, { id: 2, color: 1 }, { id: 3, color: 1 }],
      [],
    ];

    const result = applyMove(tubes, 0, 1);
    expect(result).not.toBeNull();
    // 2 orange bubbles moved
    expect(result!.newTubes[0].length).toBe(1);
    expect(result!.newTubes[1].length).toBe(2);
    expect(result!.move.bubbles.length).toBe(2);

    // Test undo restores both bubbles
    const restored = undoMove(result!.newTubes, result!.move);
    expect(restored[0].length).toBe(3);
    expect(restored[1].length).toBe(0);
  });

  it('should transfer matching bubbles up to the available capacity of destination', () => {
    // Tube 0 has 3 consecutive Orange(1) on top
    // Tube 1 already has 2 bubbles (space for 2 more out of 4)
    const tubes: Tube[] = [
      [{ id: 1, color: 0 }, { id: 2, color: 1 }, { id: 3, color: 1 }, { id: 4, color: 1 }],
      [{ id: 5, color: 1 }, { id: 6, color: 1 }],
    ];

    const result = applyMove(tubes, 0, 1);
    expect(result).not.toBeNull();
    // Only 2 orange bubbles can fit in Tube 1
    expect(result!.newTubes[0].length).toBe(2);
    expect(result!.newTubes[1].length).toBe(4);
    expect(result!.move.bubbles.length).toBe(2);
  });

  it('should correctly detect win condition', () => {
    const solvedTubes: Tube[] = [
      [{ id: 1, color: 0 }, { id: 2, color: 0 }, { id: 3, color: 0 }, { id: 4, color: 0 }],
      [{ id: 5, color: 1 }, { id: 6, color: 1 }, { id: 7, color: 1 }, { id: 8, color: 1 }],
      [],
    ];

    expect(isSolved(solvedTubes)).toBe(true);

    const unsolvedTubes: Tube[] = [
      [{ id: 1, color: 0 }, { id: 2, color: 0 }, { id: 3, color: 0 }, { id: 4, color: 1 }],
      [{ id: 5, color: 1 }, { id: 6, color: 1 }, { id: 7, color: 1 }, { id: 8, color: 0 }],
      [],
    ];

    expect(isSolved(unsolvedTubes)).toBe(false);
  });

  it('should identify sealed tubes', () => {
    const fullTube: Tube = [
      { id: 1, color: 2 },
      { id: 2, color: 2 },
      { id: 3, color: 2 },
      { id: 4, color: 2 },
    ];
    expect(isTubeSealed(fullTube)).toBe(true);

    const partialTube: Tube = [
      { id: 1, color: 2 },
      { id: 2, color: 2 },
    ];
    expect(isTubeSealed(partialTube)).toBe(false);
  });
});
