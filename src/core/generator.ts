import { ColorId, LevelData, Tier } from './types';
import { CAPACITY, TIER_CONFIGS } from './config';
import { createRNG, shuffle } from './rng';
import { solve } from './solver';

/**
 * Generates a valid, solvable level layout for a given tier and seed.
 */
export function generateLevel(
  tier: Tier,
  levelNumber: number,
  seed: number,
  capacity: number = CAPACITY
): LevelData | null {
  const config = TIER_CONFIGS[tier];
  const { tubes: totalTubes, colors: colorCount, emptyTubes } = config;
  const filledTubes = totalTubes - emptyTubes;

  const rng = createRNG(seed);

  // Pool of bubbles: exactly `capacity` bubbles for each color (0..colorCount-1)
  const pool: ColorId[] = [];
  for (let c = 0; c < colorCount; c++) {
    for (let k = 0; k < capacity; k++) {
      pool.push(c);
    }
  }

  // Attempt shuffling until we find a non-trivial, solvable distribution
  for (let attempt = 0; attempt < 100; attempt++) {
    const shuffled = shuffle(pool, rng);
    const candidateTubes: ColorId[][] = [];

    for (let t = 0; t < filledTubes; t++) {
      candidateTubes.push(shuffled.slice(t * capacity, (t + 1) * capacity));
    }
    // Add empty tubes
    for (let e = 0; e < emptyTubes; e++) {
      candidateTubes.push([]);
    }

    // Check that no tube starts already completely solved/mono-colored
    const hasFullMono = candidateTubes.some(
      (tube) => tube.length === capacity && tube.every((c) => c === tube[0])
    );
    if (hasFullMono) continue;

    // Check solvability with solver
    const solution = solve(candidateTubes, capacity, 15000);
    if (solution && solution.par >= 4) {
      return {
        id: levelNumber,
        tier,
        name: `SECTOR ${tier.toUpperCase()} // LVL ${levelNumber.toString().padStart(2, '0')}`,
        tubeCount: totalTubes,
        colorCount,
        capacity,
        tubes: candidateTubes,
        par: solution.par,
        seed,
      };
    }
  }

  return null;
}
