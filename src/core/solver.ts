import { ColorId, ColorTube } from './types';
import { CAPACITY } from './config';

interface SolverState {
  tubes: ColorId[][];
  moves: Array<{ from: number; to: number }>;
  cost: number;
}

/**
 * Creates a canonical hash key for a tube configuration to avoid duplicate search states.
 * Empty tubes and identically colored tubes are canonicalized.
 */
function serializeState(tubes: readonly ColorTube[]): string {
  // Sort tubes strings to avoid visiting symmetrical states
  return tubes
    .map((t) => t.join(','))
    .sort()
    .join('|');
}

/**
 * Checks if a ColorTube configuration is solved.
 */
function isColorTubesSolved(tubes: readonly ColorTube[], capacity: number): boolean {
  return tubes.every((t) => {
    if (t.length === 0) return true;
    if (t.length !== capacity) return false;
    const first = t[0];
    return t.every((c) => c === first);
  });
}

/**
 * Solves a puzzle board using Breadth-First / A* Search to find the minimal shortest path.
 * Returns the shortest list of moves and par move count, or null if unsolvable.
 */
export function solve(
  initialTubes: readonly ColorTube[],
  capacity: number = CAPACITY,
  maxExplored: number = 30000
): { moves: Array<{ from: number; to: number }>; par: number } | null {
  if (isColorTubesSolved(initialTubes, capacity)) {
    return { moves: [], par: 0 };
  }

  const initialCopy = initialTubes.map((t) => [...t]);
  const queue: SolverState[] = [
    {
      tubes: initialCopy,
      moves: [],
      cost: 0,
    },
  ];

  const visited = new Set<string>();
  visited.add(serializeState(initialCopy));

  let exploredCount = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    exploredCount++;

    if (exploredCount > maxExplored) {
      // Timeout/limit reached
      return null;
    }

    const { tubes, moves, cost } = current;

    // Generate all legal transitions
    for (let from = 0; from < tubes.length; from++) {
      const fromTube = tubes[from];
      if (fromTube.length === 0) continue;

      // Don't move out of an already completed tube
      if (fromTube.length === capacity && fromTube.every((c) => c === fromTube[0])) {
        continue;
      }

      const topColor = fromTube[fromTube.length - 1];

      // Try moving to each destination
      for (let to = 0; to < tubes.length; to++) {
        if (from === to) continue;
        const toTube = tubes[to];

        if (toTube.length >= capacity) continue;

        // Legal check
        const isLegal = toTube.length === 0 || toTube[toTube.length - 1] === topColor;
        if (!isLegal) continue;

        // Skip moving to an empty tube if fromTube is already mono-colored
        if (toTube.length === 0 && fromTube.every((c) => c === topColor)) {
          continue;
        }

        // Apply move
        const newTubes = tubes.map((t, idx) => {
          if (idx === from) return t.slice(0, t.length - 1);
          if (idx === to) return [...t, topColor];
          return t;
        });

        if (isColorTubesSolved(newTubes, capacity)) {
          const finalMoves = [...moves, { from, to }];
          return {
            moves: finalMoves,
            par: finalMoves.length,
          };
        }

        const serialized = serializeState(newTubes);
        if (!visited.has(serialized)) {
          visited.add(serialized);
          queue.push({
            tubes: newTubes,
            moves: [...moves, { from, to }],
            cost: cost + 1,
          });
        }
      }
    }
  }

  return null;
}
