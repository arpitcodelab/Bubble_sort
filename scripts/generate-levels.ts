import fs from 'fs';
import path from 'path';
import { generateLevel } from '../src/core/generator';
import { LevelData, Tier } from '../src/core/types';

const TIERS: Tier[] = ['easy', 'medium', 'hard'];
const LEVELS_PER_TIER = 12;

function generateAllLevels(): Record<Tier, LevelData[]> {
  const result: Record<Tier, LevelData[]> = {
    easy: [],
    medium: [],
    hard: [],
  };

  for (const tier of TIERS) {
    console.log(`Generating levels for sector: ${tier.toUpperCase()}...`);
    let levelNum = 1;
    let seedBase = tier === 'easy' ? 1000 : tier === 'medium' ? 5000 : 9000;

    while (levelNum <= LEVELS_PER_TIER) {
      const level = generateLevel(tier, levelNum, seedBase);
      if (level) {
        result[tier].push(level);
        console.log(`  [OK] Level ${levelNum}: Par = ${level.par} moves (Seed ${seedBase})`);
        levelNum++;
      }
      seedBase += 137;
    }

    // Sort levels in tier by par ascending so difficulty ramps up smoothly
    result[tier].sort((a, b) => a.par - b.par);
    // Re-index IDs 1..12
    result[tier].forEach((lvl, idx) => {
      lvl.id = idx + 1;
      lvl.name = `SECTOR ${tier.toUpperCase()} // LVL ${(idx + 1).toString().padStart(2, '0')}`;
    });
  }

  return result;
}

const allLevels = generateAllLevels();

const outDir = path.join(process.cwd(), 'src', 'data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const targetPath = path.join(outDir, 'levels.json');
fs.writeFileSync(targetPath, JSON.stringify(allLevels, null, 2), 'utf-8');
console.log(`\n✅ Generated 36 verified solvable levels in: ${targetPath}`);
