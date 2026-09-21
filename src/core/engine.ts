import { Bubble, ColorId, Move, Tube } from './types';
import { CAPACITY } from './config';

/**
 * Checks if moving the top bubble from fromIndex to toIndex is a valid move.
 * Rule:
 * 1. fromIndex != toIndex
 * 2. fromTube is not empty
 * 3. toTube is not full (length < capacity)
 * 4. toTube is empty OR toTube's top bubble has identical color to fromTube's top bubble
 */
export function canMove(
  tubes: readonly Tube[],
  fromIndex: number,
  toIndex: number,
  capacity: number = CAPACITY
): boolean {
  if (fromIndex === toIndex) return false;
  if (fromIndex < 0 || fromIndex >= tubes.length) return false;
  if (toIndex < 0 || toIndex >= tubes.length) return false;

  const fromTube = tubes[fromIndex];
  const toTube = tubes[toIndex];

  if (!fromTube || fromTube.length === 0) return false;
  if (toTube && toTube.length >= capacity) return false;

  // If fromTube is already sealed (full of identical colors), don't allow picking from it
  if (isTubeSealed(fromTube, capacity)) return false;

  const movingBubble = fromTube[fromTube.length - 1];

  // If destination is empty, moving is legal
  if (!toTube || toTube.length === 0) {
    // Optimization/rule check: if fromTube is all identical color and toTube is empty,
    // moving it to empty doesn't make logical sense, but by game rule it is permitted.
    return true;
  }

  const destinationTop = toTube[toTube.length - 1];
  return destinationTop.color === movingBubble.color;
}

/**
 * Checks if a tube is sealed: completely filled to capacity with 1 single color.
 */
export function isTubeSealed(tube: Tube, capacity: number = CAPACITY): boolean {
  if (tube.length !== capacity) return false;
  const firstColor = tube[0].color;
  return tube.every((b) => b.color === firstColor);
}

/**
 * Returns the number of consecutive identical-color bubbles at the top of a tube.
 */
export function getTopMatchingCount(tube: Tube): number {
  if (tube.length === 0) return 0;
  const topColor = tube[tube.length - 1].color;
  let count = 0;
  for (let i = tube.length - 1; i >= 0; i--) {
    if (tube[i].color === topColor) count++;
    else break;
  }
  return count;
}

/**
 * Applies a move and returns new immutable tubes array along with Move record.
 * Transfers all contiguous matching top bubbles up to the available destination capacity.
 */
export function applyMove(
  tubes: readonly Tube[],
  fromIndex: number,
  toIndex: number,
  capacity: number = CAPACITY
): { newTubes: Tube[]; move: Move } | null {
  if (!canMove(tubes, fromIndex, toIndex, capacity)) return null;

  const fromTube = [...tubes[fromIndex]];
  const toTube = [...tubes[toIndex]];

  const matchingCount = getTopMatchingCount(fromTube);
  const availableSpace = capacity - toTube.length;
  const countToMove = Math.min(matchingCount, availableSpace);

  if (countToMove <= 0) return null;

  const movedBubbles: Bubble[] = [];
  for (let i = 0; i < countToMove; i++) {
    movedBubbles.unshift(fromTube.pop()!);
  }

  for (const b of movedBubbles) {
    toTube.push(b);
  }

  const newTubes = tubes.map((t, idx) => {
    if (idx === fromIndex) return fromTube;
    if (idx === toIndex) return toTube;
    return t;
  });

  const move: Move = {
    fromTube: fromIndex,
    toTube: toIndex,
    bubbles: movedBubbles,
    color: movedBubbles[0].color,
  };

  return { newTubes, move };
}

/**
 * Undoes a previously applied move, restoring all transferred bubbles back to origin tube.
 */
export function undoMove(tubes: readonly Tube[], move: Move): Tube[] {
  const { fromTube: origFrom, toTube: origTo, bubbles } = move;

  const currentToTube = [...tubes[origTo]];
  const currentFromTube = [...tubes[origFrom]];

  const countToReturn = bubbles ? bubbles.length : 1;

  for (let i = 0; i < countToReturn; i++) {
    if (currentToTube.length > 0) {
      const b = currentToTube.pop()!;
      currentFromTube.push(b);
    }
  }

  return tubes.map((t, idx) => {
    if (idx === origFrom) return currentFromTube;
    if (idx === origTo) return currentToTube;
    return t;
  });
}

/**
 * Checks if the entire board is solved.
 * Win condition: every tube is either completely empty (length 0)
 * OR completely full (length === capacity) and all bubbles have identical color.
 */
export function isSolved(tubes: readonly Tube[], capacity: number = CAPACITY): boolean {
  return tubes.every((tube) => {
    if (tube.length === 0) return true;
    if (tube.length !== capacity) return false;
    const color = tube[0].color;
    return tube.every((b) => b.color === color);
  });
}

/**
 * Checks if any legal move exists on the current board.
 */
export function hasLegalMoves(tubes: readonly Tube[], capacity: number = CAPACITY): boolean {
  for (let from = 0; from < tubes.length; from++) {
    for (let to = 0; to < tubes.length; to++) {
      if (canMove(tubes, from, to, capacity)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Helper to convert 2D color numbers to Tube object array with unique bubble IDs
 */
export function createTubesFromColors(layout: readonly ColorId[][]): Tube[] {
  let nextId = 1;
  return layout.map((colorArray) =>
    colorArray.map((color) => ({
      id: nextId++,
      color,
    }))
  );
}
