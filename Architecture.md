# Architecture — Bubble Sorting (Mobile-First Puzzle Game)

Companion to `PRD.md`. Requirement IDs (`FR-xx`, `NFR-xx`) refer to that document.
**Audience:** a beginner "vibe coder" and an AI IDE (Cursor, Windsurf, Claude Code, Copilot, etc.). Section 15 has a step-by-step build order with paste-ready prompts.

---

## 1. Architecture Principles

1. **Logic is separate from looks.** Rules, solver and level generator are pure TypeScript with no React or DOM. They are easy to test and cannot be broken by UI changes.
2. **Logic updates instantly; animation is cosmetic.** When the player taps, the state changes *immediately*; bubbles then animate toward their new positions. Animations never block input (FR-25).
3. **One source of truth.** A single store holds the game state. The UI reads state and sends actions.
4. **Levels are data, not code.** 36 levels live in `levels.json`, produced once by a script and *proven solvable* by a solver in CI (FR-80, FR-85).
5. **Position is derived.** Every bubble's screen position is computed from `(tubeIndex, slotIndex)` by one layout function. No hand-placed coordinates.
6. **Small and fast.** DOM/SVG rendering (max 28 bubbles) is plenty; no game engine (bundle ≤ 200 KB gzip).
7. **Zero runtime network.** Fonts, icons and sounds are bundled or synthesised. Works offline.
8. **Everything tunable lives in config.** Capacity, undo count, timings, star thresholds: one file.
9. **Fail soft.** Storage, audio and vibration errors must never crash the game.

---

## 2. Tech Stack (all free & open source)

| Concern | Choice | Licence | Why |
|---|---|---|---|
| Language | **TypeScript** (strict) | Apache-2.0 | Fewer bugs; AI IDEs write better typed code |
| Build tool | **Vite** | MIT | Instant dev server, tiny builds, worker support |
| UI | **React 18** | MIT | Most AI-friendly; screens and components map cleanly |
| State | **Zustand** (+ `persist`) | MIT | ~1 KB, simple, built-in localStorage persistence |
| Rendering | **HTML + SVG + CSS** | – | Crisp at any size, accessible, tiny |
| Animation | **Motion** (`motion` package, formerly Framer Motion) | MIT | Springs + keyframe arcs; imperative `animate()` for bubble flights. *(Native Web Animations API is a zero-dependency fallback.)* |
| Confetti | **canvas-confetti** (lazy-loaded) | ISC | 3 KB effect on level win |
| Icons | **lucide-react** (import only used icons) | ISC | Tree-shakeable SVG icons |
| Font | **@fontsource/fredoka** (self-hosted) | OFL | Friendly rounded font, no Google request |
| Audio | **Web Audio API** (synthesised) | – | No files; "bubble pop" tones via pitch sweeps |
| Solver / generator runtime | **TypeScript** in Node (build time) and **Web Worker** (hints, P2) | – | Same code in both places |
| Script runner | **tsx** | MIT | Run TS scripts (`levels:generate`) without a build step |
| PWA | **vite-plugin-pwa** (Workbox) | MIT | Manifest + offline precache |
| Unit tests | **Vitest** | MIT | Vite-native, fast |
| Component tests | **@testing-library/react** | MIT | Behaviour-focused UI tests |
| E2E (P1) | **Playwright** (mobile viewports) + **axe-core** | Apache-2.0 / MPL-2.0 | Real phone-size tests + accessibility audit |
| Lint/format | **ESLint + Prettier** | MIT | Consistent code |
| CI/CD | **GitHub Actions** → GitHub Pages / Cloudflare Pages / Netlify | Free tier | Auto test, verify levels, deploy |

**Why not Phaser/Pixi/Unity/Godot?** They add weight and complexity for a game with ≤ 28 moving circles and mostly UI. If you later want heavy particle effects or 3D, PixiJS (MIT) can replace only the `Board` renderer, because logic and store are independent.

---

## 3. High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION (React)                       │
│ Screens: Splash · Home · DifficultySelect · LevelSelect · Game     │
│ Components: Board · Tube · Bubble · TopBar · StatusRow · BottomBar  │
│   ResultSheet · HowToPlay · Settings · ConfirmDialog · Announcer    │
└──────────────▲───────────────────────────────┬─────────────────────┘
      reads state│                              │dispatches actions
┌──────────────┴───────────────────────────────▼─────────────────────┐
│                       STATE (Zustand store)                         │
│ progress · settings · session (screen, level, tubes, selected,      │
│ history, undosLeft, status, lastMove)                               │
│ Actions: startLevel, tapTube, undo, restart, nextLevel, nav ...     │
└───────┬──────────────────┬───────────────────────┬─────────────────┘
        │ uses             │ calls                 │ persists via
┌───────▼─────────┐ ┌──────▼───────────┐    ┌──────▼──────────────┐
│ CORE (pure)     │ │ SERVICES         │    │ STORAGE             │
│ types · config  │ │ audio · haptics  │    │ localStorage        │
│ engine          │ │ confetti         │    │ (versioned schema)  │
│ solver          │ │ hintWorker (P2)  │    └─────────────────────┘
│ generator       │ └──────────────────┘
│ layout          │
└───────▲─────────┘
        │ produces (build time)
┌───────┴──────────────────────────────┐
│ scripts/generate-levels.ts → data/levels.json  (committed to git)   │
│ scripts/verify-levels.ts   → runs in CI                            │
└──────────────────────────────────────┘
```

**Dependency rule:** `core` imports nothing from other layers. `store` imports `core` and `services`. `ui` imports `store` and `core`. Never the reverse. `scripts` import `core` only.

---

## 4. Folder Structure

```
bubble-sorting/
├─ public/
│  ├─ icons/                    # PWA icons: 192, 512, maskable-512, apple-touch-icon
│  └─ favicon.svg
├─ scripts/
│  ├─ generate-levels.ts        # builds data/levels.json (build-time only)
│  └─ verify-levels.ts          # CI: every level solvable, matches spec
├─ src/
│  ├─ core/                     # PURE LOGIC: no React, no DOM
│  │  ├─ types.ts
│  │  ├─ config.ts              # capacity, undos, timings, star thresholds, palette
│  │  ├─ engine.ts              # canMove, applyMove, undoMove, isSolved, hasMoves
│  │  ├─ engine.test.ts
│  │  ├─ solver.ts              # A* search: solve(), nextHint()
│  │  ├─ solver.test.ts
│  │  ├─ generator.ts           # seeded random level candidate generator
│  │  ├─ rng.ts                 # mulberry32 seeded RNG
│  │  ├─ layout.ts              # tube/slot geometry (logical units)
│  │  └─ layout.test.ts
│  ├─ data/
│  │  └─ levels.json            # 36 verified levels (generated, committed)
│  ├─ store/
│  │  ├─ gameStore.ts
│  │  ├─ selectors.ts
│  │  └─ gameStore.test.ts
│  ├─ services/
│  │  ├─ audio.ts  haptics.ts  confetti.ts  storage.ts
│  │  ├─ hint.worker.ts         # P2: solver in a Web Worker
│  ├─ ui/
│  │  ├─ App.tsx                # screen switcher (no router library needed)
│  │  ├─ screens/
│  │  │  ├─ SplashScreen.tsx  HomeScreen.tsx  DifficultyScreen.tsx
│  │  │  ├─ LevelSelectScreen.tsx  GameScreen.tsx
│  │  ├─ components/
│  │  │  ├─ Board.tsx  Tube.tsx  Bubble.tsx  BubbleSymbol.tsx
│  │  │  ├─ TopBar.tsx  StatusRow.tsx  BottomBar.tsx
│  │  │  ├─ ResultSheet.tsx  HowToPlay.tsx  SettingsSheet.tsx
│  │  │  ├─ ConfirmDialog.tsx  Button.tsx  Announcer.tsx  Stars.tsx
│  │  └─ hooks/
│  │     ├─ useBoardScale.ts  useReducedMotion.ts  useKeyboardBoard.ts
│  ├─ styles/
│  │  ├─ tokens.css  base.css  animations.css
│  ├─ main.tsx
│  └─ vite-env.d.ts
├─ e2e/                         # Playwright specs
├─ .github/workflows/ci.yml
├─ index.html  vite.config.ts  tsconfig.json  package.json
├─ PRD.md  Architecture.md  README.md  LICENSE  LICENSES.md
```

---

## 5. Core Domain (pure TypeScript)

### 5.1 Types: `src/core/types.ts`
```ts
export type ColorId = number;                 // 0..6
export interface Bubble { id: number; color: ColorId }   // id is stable for animation
export type Tube = readonly Bubble[];         // index 0 = bottom, last = top
export type Tier = 'easy' | 'medium' | 'hard';

/** Colour-only view used by solver/generator (no ids). */
export type ColorTube = readonly ColorId[];

export interface LevelData {
  id: string;                // "easy-01"
  tier: Tier;
  number: number;            // 1..12
  par: number;               // best known solution length
  tubes: ColorId[][];        // bottom → top, includes the 2 empty tubes
}

export interface Move { from: number; to: number }   // one bubble per move
export type Rng = () => number;                      // [0,1)
```

### 5.2 Config: `src/core/config.ts`
```ts
export const CAPACITY = 4;                 // bubbles per tube (verify vs reference, PRD §2.2)
export const UNDOS_PER_LEVEL = 5;          // from reference
export const UNLOCK_ALL = false;           // set true to disable sequential unlock
export const LEVELS_PER_TIER = 12;

export const TIERS = {
  easy:   { label: 'Easy',   tubes: 5, colors: 3, empties: 2 },
  medium: { label: 'Medium', tubes: 7, colors: 5, empties: 2 },
  hard:   { label: 'Hard',   tubes: 9, colors: 7, empties: 2 },
} as const;

export const STAR_RULES = { threeStarFactor: 1.25, twoStarFactor: 1.75 } as const;

export const MOTION = {
  liftMs: 140, flightMs: 360, settleMs: 120, shakeMs: 200,
  winCelebrationMs: 900,      // wait before showing the result sheet
} as const;

export const PALETTE = [
  { name: 'Red',    hex: '#FF4D5E', symbol: 'dot' },
  { name: 'Orange', hex: '#FF9F2E', symbol: 'triangle' },
  { name: 'Yellow', hex: '#FFD93B', symbol: 'square' },
  { name: 'Green',  hex: '#34D17A', symbol: 'star' },
  { name: 'Blue',   hex: '#3EA8FF', symbol: 'heart' },
  { name: 'Purple', hex: '#A66BFF', symbol: 'diamond' },
  { name: 'Pink',   hex: '#FF7BC8', symbol: 'plus' },
] as const;
```

### 5.3 Engine: `src/core/engine.ts`
The engine is generic over anything that has a `color`, so the solver can use plain colour arrays and the game can use `Bubble`s.

```ts
import type { Bubble, Move, Tube } from './types';

type HasColor = { color: number };

/** FR-2: the ONLY placement rule. */
export function canMove<T extends HasColor>(
  tubes: readonly (readonly T[])[], from: number, to: number, capacity: number,
): boolean {
  if (from === to) return false;
  const src = tubes[from], dst = tubes[to];
  if (!src || !dst || src.length === 0 || dst.length >= capacity) return false;
  const b = src[src.length - 1];
  return dst.length === 0 || dst[dst.length - 1].color === b.color;
}

/** Returns NEW tubes. Throws on illegal move (programming error). */
export function applyMove<T extends HasColor>(
  tubes: readonly (readonly T[])[], from: number, to: number, capacity: number,
): T[][] {
  if (!canMove(tubes, from, to, capacity)) throw new Error(`Illegal move ${from}->${to}`);
  const next = tubes.map((t) => t.slice());
  next[to].push(next[from].pop()!);
  return next;
}

/** Undo = the reverse move. Always valid for the most recent move (FR-5). */
export function undoMove<T extends HasColor>(tubes: readonly (readonly T[])[], last: Move): T[][] {
  const next = tubes.map((t) => t.slice());
  next[last.from].push(next[last.to].pop()!);
  return next;
}

export const isTubeComplete = (t: readonly HasColor[], capacity: number) =>
  t.length === capacity && t.every((b) => b.color === t[0].color);

/** FR-4: every tube empty, or full with one colour. */
export const isSolved = (tubes: readonly (readonly HasColor[])[], capacity: number) =>
  tubes.every((t) => t.length === 0 || isTubeComplete(t, capacity));

/** FR-8: unpruned; used by the game for the "No moves left" prompt. */
export function hasLegalMove(tubes: readonly (readonly HasColor[])[], capacity: number): boolean {
  for (let f = 0; f < tubes.length; f++)
    for (let t = 0; t < tubes.length; t++)
      if (canMove(tubes, f, t, capacity)) return true;
  return false;
}
```
> Note: because tubes get mutated only on copies, the store can safely keep old arrays.

### 5.4 Solver: `src/core/solver.ts`
Used to (a) prove every shipped level is solvable, (b) compute **par**, and (c) later power hints.

**Approach:** A* search over board states.
- **State key** (canonical): tubes as strings, sorted, joined. Tubes are interchangeable, so this shrinks the search a lot.
- **Heuristic h(state):** count of bubbles sitting directly on a *different-coloured* bubble. Each such bubble must be moved at least once (one bubble per move), so `h` never overestimates → A* returns a shortest solution.
- **Move pruning (solver only):** skip moves out of already-complete tubes; skip moving from a *uniform* tube into an *empty* tube (never helps).
- **Safety limits:** `maxNodes` (e.g. 400k) and optional time limit. If the limit is hit, retry with a weighted heuristic (`f = g + 1.5·h`) which finds a good (not guaranteed shortest) solution; mark par as "best known".

```ts
import type { ColorTube, Move } from './types';

const keyOf = (tubes: readonly ColorTube[]) => tubes.map((t) => t.join('')).sort().join('|');

function heuristic(tubes: readonly ColorTube[]): number {
  let n = 0;
  for (const t of tubes) for (let i = 1; i < t.length; i++) if (t[i] !== t[i - 1]) n++;
  return n;
}

function* candidateMoves(tubes: readonly ColorTube[], cap: number): Generator<Move> {
  for (let from = 0; from < tubes.length; from++) {
    const src = tubes[from];
    if (src.length === 0) continue;
    const uniform = src.every((c) => c === src[0]);
    if (uniform && src.length === cap) continue;            // complete tube: leave it
    const c = src[src.length - 1];
    for (let to = 0; to < tubes.length; to++) {
      if (to === from) continue;
      const dst = tubes[to];
      if (dst.length >= cap) continue;
      if (dst.length > 0 && dst[dst.length - 1] !== c) continue;
      if (uniform && dst.length === 0) continue;            // pointless split
      yield { from, to };
    }
  }
}

export interface SolveResult { solved: boolean; moves: Move[]; optimal: boolean; nodes: number }

export function solve(start: readonly ColorTube[], cap: number, opts = { maxNodes: 400_000, weight: 1 }): SolveResult {
  // 1. push {tubes:start, g:0, parent:null, move:null} on a min-heap ordered by f = g + weight*h
  // 2. pop lowest f; if solved (every tube empty or full+uniform) → rebuild `moves` by following parent links
  // 3. for each candidate move: new state; if bestG.get(key) <= g+1 skip; else store and push
  // 4. stop with solved=false if nodes > maxNodes
  // (Implement a small binary heap; ~30 lines.)
  throw new Error('implement per comments');
}

/** For hints (P2): first move of a solution from the current state. */
export const nextHint = (tubes: readonly ColorTube[], cap: number): Move | null =>
  solve(tubes, cap, { maxNodes: 200_000, weight: 1.5 }).moves[0] ?? null;
```
> Each node stores its **actual** tubes (not the canonical order) so that move indexes in the reconstructed path are valid for the real board.

### 5.5 Seeded RNG: `src/core/rng.ts`
```ts
export function mulberry32(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function shuffle<T>(arr: readonly T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
```

### 5.6 Generator: `src/core/generator.ts` (build-time candidate maker)
```ts
import { shuffle } from './rng';

/** One random candidate: colours × cap bubbles, packed into `colors` tubes, plus `empties` empty tubes. */
export function randomCandidate(colors: number, empties: number, cap: number, rng: () => number): number[][] {
  const pool = shuffle(Array.from({ length: colors }, (_, c) => Array(cap).fill(c)).flat(), rng);
  const filled = Array.from({ length: colors }, (_, i) => pool.slice(i * cap, (i + 1) * cap));
  return shuffle([...filled, ...Array.from({ length: empties }, () => [] as number[])], rng);
}

/** Quality filters (FR-81, FR-84). */
export function isAcceptable(tubes: number[][], cap: number): boolean {
  const filled = tubes.filter((t) => t.length > 0);
  if (filled.some((t) => t.every((c) => c === t[0]))) return false;        // no uniform tube at start
  const mixedness = filled.reduce((n, t) => n + t.filter((c, i) => i > 0 && c !== t[i - 1]).length, 0);
  return mixedness >= Math.floor(filled.length * (cap - 1) * 0.6);           // well-mixed
}
```

### 5.7 Layout: `src/core/layout.ts`
One pure function converts "N tubes of capacity C" into geometry in **logical units** (independent of screen size). The UI multiplies by a scale factor (§8.2).

```ts
export interface Rect { x: number; y: number; w: number; h: number }
export interface BoardLayout {
  width: number; height: number;
  tubes: Rect[];
  slot: number;                                        // bubble diameter + spacing
  slotCenter(tube: number, slotIndex: number): { x: number; y: number };
  liftCenter(tube: number): { x: number; y: number }; // where the selected bubble floats
}

export function computeLayout(tubeCount: number, capacity: number): BoardLayout {
  const slot = 44, pad = 8, tubeW = slot + pad * 2, gapX = 14, gapY = 56, rimSpace = slot * 1.2;
  const tubeH = capacity * slot + pad * 2;
  const perRow = tubeCount <= 5 ? tubeCount : Math.ceil(tubeCount / 2);   // 7→4+3, 9→5+4
  const rows = Math.ceil(tubeCount / perRow);
  const width = perRow * tubeW + (perRow - 1) * gapX;
  const height = rowsTop(rows) ;   // see below
  const tubes: Rect[] = [];
  for (let i = 0; i < tubeCount; i++) {
    const row = Math.floor(i / perRow);
    const inRow = row === rows - 1 ? tubeCount - row * perRow : perRow;   // last row may be shorter
    const rowW = inRow * tubeW + (inRow - 1) * gapX;
    const x0 = (width - rowW) / 2 + (i % perRow) * (tubeW + gapX);        // centre each row
    tubes.push({ x: x0, y: rimSpace + row * (tubeH + gapY), w: tubeW, h: tubeH });
  }
  function rowsTop(r: number) { return rimSpace + r * tubeH + (r - 1) * gapY; }
  return {
    width, height, tubes, slot,
    slotCenter: (t, k) => ({ x: tubes[t].x + tubeW / 2, y: tubes[t].y + tubeH - pad - slot * (k + 0.5) }),
    liftCenter: (t) => ({ x: tubes[t].x + tubeW / 2, y: tubes[t].y - slot * 0.7 }),
  };
}
```
*(Note for the IDE: declare `rowsTop` before use, or inline the height expression; the snippet shows intent.)* For rows > 1, the lifted bubble of a second-row tube must not overlap the first row: `gapY` (56) is > `slot`, so it fits.

---

## 6. Level Pipeline (build time)

Goal: 36 solvable, ordered, deterministic levels committed as `src/data/levels.json`.

**`scripts/generate-levels.ts` (run with `npm run levels:generate`):**
```
for each tier in [easy, medium, hard]:
  rng = mulberry32(SEED[tier])                 // fixed seeds → reproducible
  candidates = []
  repeat until candidates.length >= N (e.g. 300):
     tubes = randomCandidate(colors, 2, CAPACITY, rng)
     if !isAcceptable(tubes) continue
     result = solve(tubes, CAPACITY)            // A*, node-limited
     if !result.solved continue                 // reject unsolvable / too hard to verify
     candidates.push({ tubes, par: result.moves.length, mixedness })
  sort candidates by (par, mixedness)
  pick 12 at evenly spaced quantiles                 // gentle difficulty ramp (FR-83)
  drop near-duplicates (same canonical key or very similar tube multiset)
  write { id: `${tier}-${nn}`, tier, number, par, tubes } into levels.json
```
- Output JSON:
```json
{
  "version": 1,
  "capacity": 4,
  "levels": {
    "easy":   [ { "id": "easy-01", "tier": "easy", "number": 1, "par": 12,
                  "tubes": [[0,1,2,1],[2,0,0,2],[1,0,1,2],[],[]] } ],
    "medium": [ ],
    "hard":   [ ]
  }
}
```
- **`scripts/verify-levels.ts` (run in CI as `npm run levels:verify`):** loads `levels.json`, checks tier specs (tube/colour counts, exactly 2 empties, exactly `CAPACITY` bubbles per colour, no pre-solved tubes), re-solves every level, and fails if any is unsolvable or if `par` differs from the solver's result.
- **Tuning:** if Easy feels too easy or Hard too brutal, change quantile selection or `SEED`, re-run, and commit the new JSON.
- **Performance note:** the Hard tier's state space is large. Keep `maxNodes` bounded, generate many candidates and discard the ones the solver can't finish, and run the script once, not at runtime.

---

## 7. State Management

### 7.1 Shape: `src/store/gameStore.ts`
```ts
type Screen = 'splash' | 'home' | 'difficulty' | 'levels' | 'game';
type Status = 'playing' | 'won' | 'stuck';

interface LevelProgress { best: number; stars: 0 | 1 | 2 | 3 }   // best = fewest moves

interface GameState {
  // ── persisted ──────────────────────────────────────────
  settings: { sound: boolean; haptics: boolean; symbols: boolean; theme: 'system'|'light'|'dark'; reduceMotion: boolean; seenHowTo: boolean };
  progress: Record<string /* level id */, LevelProgress>;

  // ── session (not persisted) ────────────────────────────
  screen: Screen;
  tier: Tier;                      // last opened tier (for level select)
  level: LevelData | null;
  tubes: Tube[];                   // Bubble objects with stable ids
  selected: number | null;         // tube index or null
  history: Move[];                 // for undo; moves = history.length
  undosLeft: number;
  status: Status;
  lastEvent: null | { type: 'move'|'undo'|'blocked'|'seal'|'win'; nonce: number; move?: Move; tube?: number };

  // ── actions ────────────────────────────────────────────
  goTo(screen: Screen): void;
  startLevel(id: string): void;
  tapTube(i: number): void;
  undo(): void;
  restart(): void;
  nextLevel(): void;
  toggleSetting(key: 'sound'|'haptics'|'symbols'): void;
  resetProgress(): void;
}
```

### 7.2 Key logic
- **`startLevel(id)`:** load `LevelData`, convert colour arrays to `Bubble` objects with unique ids (`id` = running counter), set `undosLeft = UNDOS_PER_LEVEL`, `history = []`, `selected = null`, `status = 'playing'`.
- **`tapTube(i)`:** implements the FR-11 matrix:
```ts
tapTube(i) {
  const s = get();
  if (s.status !== 'playing') return;
  const t = s.tubes[i];
  if (isTubeComplete(t, CAPACITY)) return;                       // sealed tubes ignore taps
  if (s.selected === null) {                                     // nothing selected
    if (t.length > 0) set({ selected: i, lastEvent: ev('select', i) });
    return;
  }
  if (s.selected === i) { set({ selected: null, lastEvent: ev('deselect', i) }); return; }
  if (canMove(s.tubes, s.selected, i, CAPACITY)) {               // legal: do it now
    const move = { from: s.selected, to: i };
    const tubes = applyMove(s.tubes, move.from, move.to, CAPACITY);
    const sealed = isTubeComplete(tubes[i], CAPACITY);
    const solved = isSolved(tubes, CAPACITY);
    set({
      tubes, selected: null, history: [...s.history, move],
      status: solved ? 'won' : hasLegalMove(tubes, CAPACITY) ? 'playing' : 'stuck',
      lastEvent: ev(solved ? 'win' : sealed ? 'seal' : 'move', i, move),
    });
    if (solved) recordWin();                                     // stars + progress (after celebration delay for UI)
  } else if (t.length > 0) {                                     // illegal onto another non-empty tube → switch
    set({ selected: i, lastEvent: ev('select', i) });
  } else {                                                       // illegal onto empty/full → shake
    set({ lastEvent: ev('blocked', i) });
  }
}
```
- **`undo()`:** allowed when `history.length > 0 && undosLeft > 0 && status !== 'won'`. Pops the last move, calls `undoMove`, decrements `undosLeft`, clears `selected`, sets `status = 'playing'` (this is also how the player leaves a "stuck" state).
- **`restart()`:** re-runs `startLevel(level.id)` (resets undos, moves, bubble ids).
- **Stars:** `stars = moves <= ceil(par*1.25) ? 3 : moves <= ceil(par*1.75) ? 2 : 1`. Save `best = min(best, moves)` and `stars = max(stars, new)`.
- **Unlock rule (selector):** level *n* is unlocked if `UNLOCK_ALL || n === 1 || progress[id of n-1]` exists.
- **`lastEvent` + `nonce`:** the UI/services react to events (sounds, haptics, shake, confetti) by watching `lastEvent`. This keeps side effects **out of the store** and out of the pure logic.

### 7.3 Effects layer (in `GameScreen`)
```tsx
useEffect(() => {                 // one place that turns events into feedback
  const e = lastEvent; if (!e) return;
  switch (e.type) {
    case 'select':  audio.play('select');  haptics.tick(); break;
    case 'move':    audio.play('place');   haptics.tick(); break;
    case 'seal':    audio.play('place'); setTimeout(() => audio.play('seal'), 200); haptics.double(); break;
    case 'undo':    audio.play('undo'); break;
    case 'blocked': audio.play('blocked'); break;
    case 'win':     audio.play('win'); haptics.win(); celebrate(); break;
  }
}, [lastEvent?.nonce]);

useEffect(() => {                 // show result sheet after celebration
  if (status !== 'won') return;
  const t = setTimeout(() => setShowResult(true), MOTION.winCelebrationMs);
  return () => clearTimeout(t);
}, [status]);
```

### 7.4 Screen state machine
```
splash ──tap──► home ──Play──► difficulty ──pick tier──► levels ──pick unlocked──► game
                 ▲                 ▲                        ▲                       │
                 └───── back ──────┴────────── back ────────┴─── back / Level list ─┤
                                                                                    ▼
                                            status: playing ⇄ stuck (undo/restart) → won → ResultSheet
                                                                        └─ Next / Replay / Levels
```

---

## 8. UI Architecture

### 8.1 Screen switching
No router library. `App.tsx` renders by `store.screen` with a short CSS fade. Also push a `history.pushState` entry per screen change (or use a tiny `popstate` handler) so the browser/system **back gesture** steps back in-app instead of leaving the site (FR-40).

### 8.2 Board rendering approach
- `Board` is a `position: relative` container. `useBoardScale()` measures the available box with `ResizeObserver` and returns `scale = min(availW / layout.width, availH / layout.height)`. All logical coordinates are multiplied by `scale` (px).
- **Layer 1: Tubes** (SVG/CSS glass shapes) positioned from `layout.tubes`. Each tube also renders an invisible `<button>` hit area covering the tube **plus the space above it** (FR-12).
- **Layer 2: Bubbles.** *All* bubbles render as siblings in one absolutely-positioned layer, keyed by stable `bubble.id`. Each one's target position comes from `layout.slotCenter(tubeIndex, slotIndex)`, or `layout.liftCenter(tubeIndex)` if it is the top bubble of the selected tube.
- Because bubbles are independent elements keyed by id, the same DOM node flies from one tube to another (no unmount/remount) and logic never waits for animation.

```tsx
// selector: id → { tube, slot } for current state
const positions = useMemo(() => {
  const m = new Map<number, { tube: number; slot: number; isTop: boolean }>();
  tubes.forEach((t, ti) => t.forEach((b, si) => m.set(b.id, { tube: ti, slot: si, isTop: si === t.length - 1 })));
  return m;
}, [tubes]);
```

### 8.3 Bubble animation
```tsx
import { animate } from 'motion';       // tiny imperative API

function Bubble({ bubble, target, lifted, size }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const prev = useRef<{ x: number; y: number; tube: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current!, p = prev.current;
    const to = { x: target.x, y: target.y, tube: target.tube };
    prev.current = to;
    if (!p) { el.style.transform = `translate(${to.x}px, ${to.y}px)`; return; }   // first render
    if (reduced) { el.style.transform = `translate(${to.x}px, ${to.y}px)`; return; }
    if (p.tube !== to.tube) {                      // FLIGHT: up → across → down (arc)
      const apex = Math.min(p.y, to.y) - size * 1.2;
      animate(el,
        { x: [p.x, p.x, to.x, to.x], y: [p.y, apex, apex, to.y] },
        { duration: MOTION.flightMs / 1000, times: [0, 0.3, 0.7, 1], ease: 'easeInOut' })
        .then(() => animate(el, { scaleY: [0.9, 1.05, 1] }, { duration: MOTION.settleMs / 1000 })); // settle
    } else {                                       // LIFT / DROP inside the same tube: spring
      animate(el, { x: to.x, y: to.y }, { type: 'spring', stiffness: 500, damping: 30 });
    }
  }, [target.x, target.y, target.tube]);

  return <div ref={ref} className="bubble" data-color={bubble.color}> <BubbleSvg .../> </div>;
}
```
(Illustrative; the IDE may restructure. Keep `transform`/`opacity` only, animated via the GPU.)

- **Bubble visual:** an SVG with a radial gradient fill from CSS variable `--c{n}`, a white specular ellipse, a soft inner shadow. Symbol overlay from `BubbleSymbol` when `settings.symbols` is on.
- **Shake (blocked):** add class `shake` to the tube for 200 ms via `lastEvent`; CSS `@keyframes` translateX ±4 px. Reduced motion → quick colour flash instead.
- **Seal effect:** tube gets `data-sealed` → CSS glow + a small cap slide-in; bubbles do a quick staggered bounce (`animation-delay: n*40ms`).
- **Win celebration:** all tubes pulse in sequence, `celebrate()` fires confetti, then the result sheet slides up after `MOTION.winCelebrationMs`.

### 8.4 Component contracts
| Component | Props | Responsibility |
|---|---|---|
| `SplashScreen` | – | Loader → "Tap to play" → `audio.unlock()` → `goTo('home')` |
| `HomeScreen` | – | Play, Continue (FR-46), How to play, sound/settings icons |
| `DifficultyScreen` | – | 3 tier cards with tube/colour counts and `done/12` from `progress` |
| `LevelSelectScreen` | `tier` | 3×4 grid; number, stars, lock; tap → `startLevel(id)` |
| `GameScreen` | – | Composes game UI; owns the effects in §7.3 |
| `TopBar` | `title, onBack, onRestart` | Back, "Hard · Level 4", restart |
| `StatusRow` | `moves, undosLeft` | Moves counter and undo count |
| `Board` | `tubes, selected, layout` | Layers from §8.2; forwards taps to `tapTube` |
| `Tube` | `index, rect, sealed, selected` | Glass visual + accessible button |
| `Bubble` | see §8.3 | Positioned/animated sphere |
| `BottomBar` | `undosLeft, onUndo, onHint?` | Undo button with badge; Hint (P2) |
| `ResultSheet` | `moves, best, stars, par` | Stars, buttons Next / Replay / Levels |
| `HowToPlay` | `onClose` | 3–4 illustrated steps |
| `SettingsSheet` | – | Sound, haptics, symbols, theme, reduced motion, reset progress |
| `ConfirmDialog` | `title, onConfirm, onCancel` | Restart (if moves > 0), reset progress |
| `Announcer` | – | Visually hidden `aria-live="polite"` region fed by `lastEvent` |

### 8.5 Responsive layout & mobile rules (FR-90..96)
```css
/* base.css */
html, body, #root { height: 100%; }
body {
  margin: 0; overscroll-behavior: none;
  -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; user-select: none;
  font-family: 'Fredoka', system-ui, sans-serif;
  background: var(--bg); color: var(--text);
}
button { touch-action: manipulation; min-width: 48px; min-height: 48px; }

.app {
  height: 100dvh;                                   /* dynamic viewport: handles mobile browser bars */
  padding: env(safe-area-inset-top) env(safe-area-inset-right)
           env(safe-area-inset-bottom) env(safe-area-inset-left);
  display: flex; flex-direction: column;
}
.game { flex: 1; display: flex; flex-direction: column; min-height: 0; }   /* min-height:0 lets the board shrink */
.board-area { flex: 1; min-height: 0; display: grid; place-items: center; }

@media (orientation: landscape) and (max-height: 520px) {
  .game { flex-direction: row; }                    /* controls to the side; board uses full height */
}
```
`index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="theme-color" content="#2B2350" />
```
Do **not** use `user-scalable=no` or `maximum-scale=1` (accessibility).

**Touch target check:** logical tube width = 60 units. At 320 px screen with 5 tubes per row: `scale ≈ 0.85`, tube ≈ 51 px ≥ 48 ✔. The hit area also extends above the tube, so real targets are larger.

### 8.6 Design tokens: `src/styles/tokens.css`
```css
:root {
  --bg: linear-gradient(160deg, #EAF0FF, #D9CCFF);
  --surface: #FFFFFF; --text: #1E1B3A; --muted: #6B6890; --accent: #6C5CE7;
  --glass: rgba(255,255,255,.35); --glass-rim: rgba(255,255,255,.75);
  --c0:#FF4D5E; --c1:#FF9F2E; --c2:#FFD93B; --c3:#34D17A; --c4:#3EA8FF; --c5:#A66BFF; --c6:#FF7BC8;
  --radius: 16px; --shadow: 0 8px 28px rgba(50,40,120,.18);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --bg: linear-gradient(160deg, #1E1B3F, #2B2350);
    --surface: #2A2650; --text: #F3F1FF; --muted: #A8A4D0; --glass: rgba(255,255,255,.10); --glass-rim: rgba(255,255,255,.35);
  }
}
:root[data-theme='dark']  { --bg: linear-gradient(160deg,#1E1B3F,#2B2350); --surface:#2A2650; --text:#F3F1FF; --muted:#A8A4D0; }
```

### 8.7 Accessibility implementation
- Tube = `<button aria-label="Tube 3, from bottom: red, blue, blue, green. Top: green." aria-pressed={selected}>`; sealed tubes `aria-disabled` with "complete".
- `Announcer` writes messages from `lastEvent` ("Moved green from tube 3 to tube 5", "Tube 2 complete", "Level complete in 18 moves").
- `useKeyboardBoard`: ←/→ move focus between tubes, Enter/Space = tap, `Esc` deselect, `U` undo, `R` restart.
- Focus moves into the `ResultSheet` when it opens and returns to the board on close.
- `useReducedMotion` reads `prefers-reduced-motion` **or** the in-app override, and gates arcs, shake, confetti and haptic patterns.
- Symbols: `BubbleSymbol` draws the shape from `PALETTE[color].symbol` in white/dark ink for contrast on every colour.

---

## 9. Services

### 9.1 Audio: `src/services/audio.ts` (synthesised "bubble" sounds)
`AudioContext` is created/resumed on the Splash tap (required on iOS/Android). Sounds are short pitch sweeps: bubbles "bloop" upward when lifted and downward when placed.
```ts
type Sfx = 'tapUi' | 'select' | 'place' | 'blocked' | 'undo' | 'seal' | 'win';

class AudioService {
  private ctx: AudioContext | null = null;
  enabled = true;

  unlock() {
    try {
      this.ctx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
      if (this.ctx.state === 'suspended') void this.ctx.resume();
    } catch { /* unsupported: stay silent */ }
  }

  /** frequency sweep f0→f1 with a soft envelope */
  private sweep(f0: number, f1: number, dur: number, start = 0, type: OscillatorType = 'sine', vol = 0.16) {
    if (!this.ctx) return;
    const t0 = this.ctx.currentTime + start;
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t0);
    o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }

  play(name: Sfx) {
    if (!this.enabled || !this.ctx) return;
    switch (name) {
      case 'tapUi':   this.sweep(500, 620, 0.06, 0, 'triangle'); break;
      case 'select':  this.sweep(300, 620, 0.10); break;                       // bloop up
      case 'place':   this.sweep(620, 260, 0.14); break;                       // bloop down
      case 'blocked': this.sweep(180, 140, 0.16, 0, 'square', 0.07); break;   // soft buzz
      case 'undo':    this.sweep(420, 300, 0.10, 0, 'triangle'); break;
      case 'seal':    [660, 880, 1320].forEach((f, i) => this.sweep(f, f * 1.02, 0.22, i * 0.07, 'triangle')); break;
      case 'win':     [523, 659, 784, 1047, 1319].forEach((f, i) => this.sweep(f, f, 0.26, i * 0.09, 'triangle')); break;
    }
  }
}
export const audio = new AudioService();
```
The store or `SettingsSheet` sets `audio.enabled = settings.sound`. **Alternative:** CC0 sound files (Kenney.nl) in `/public/sfx/` with the same `audio.play(name)` interface.

### 9.2 Haptics: `src/services/haptics.ts`
```ts
export const haptics = {
  enabled: true,
  tick()   { if (this.enabled) navigator.vibrate?.(8); },
  double() { if (this.enabled) navigator.vibrate?.([10, 40, 14]); },
  win()    { if (this.enabled) navigator.vibrate?.([30, 40, 30, 40, 70]); },
};
```
Always optional-chain: iOS Safari has no `vibrate`.

### 9.3 Confetti: `src/services/confetti.ts`
```ts
export async function celebrate(reduced = false) {
  if (reduced) return;
  const { default: confetti } = await import('canvas-confetti');   // lazy chunk
  confetti({ particleCount: 110, spread: 75, origin: { y: 0.65 }, disableForReducedMotion: true });
}
```

### 9.4 Hint worker (P2): `src/services/hint.worker.ts`
```ts
import { solve } from '../core/solver';
self.onmessage = (e: MessageEvent<{ tubes: number[][]; cap: number }>) => {
  const r = solve(e.data.tubes, e.data.cap, { maxNodes: 200_000, weight: 1.5 });
  (self as any).postMessage(r.moves[0] ?? null);
};
```
Used via `new Worker(new URL('./hint.worker.ts', import.meta.url), { type: 'module' })`. The UI highlights source and destination tubes; "hint used" disables 3★ for that run.

---

## 10. Persistence: `src/services/storage.ts`

Single key `bs:v1`, via Zustand `persist` with `partialize` so **only** `settings` and `progress` are saved.
```json
{
  "version": 1,
  "settings": { "sound": true, "haptics": true, "symbols": false, "theme": "system", "reduceMotion": false, "seenHowTo": true },
  "progress": {
    "easy-01": { "best": 13, "stars": 3 },
    "easy-02": { "best": 21, "stars": 2 }
  }
}
```
- Custom `storage` wrapper: `try/catch` around `localStorage`, falling back to in-memory (NFR-R1).
- `version` + `migrate` discard incompatible or corrupt data safely (NFR-R2). Validate numbers (`Number.isFinite`, ≥ 0) and ignore unknown level ids (levels may change between releases).

---

## 11. PWA & Offline (FR-70..72)

`vite.config.ts` (key parts):
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',   // safe for GitHub Pages sub-paths
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Bubble Sorting', short_name: 'Bubbles',
        description: 'A relaxing, offline-ready bubble sorting puzzle.',
        display: 'standalone', orientation: 'portrait', start_url: '.',
        background_color: '#2B2350', theme_color: '#2B2350',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'] },
    }),
  ],
  build: { target: 'es2019', sourcemap: false },
});
```
`orientation: 'portrait'` matches the reference; landscape still works in a normal browser tab. Everything (including `levels.json`) is precached, so the game runs in airplane mode.

---

## 12. Performance Budget & Techniques

- Import only used Lucide icons; load only Fredoka weights 500 and 700 (latin subset).
- Lazy-load `canvas-confetti`, `HowToPlay`, `SettingsSheet`, and the hint worker.
- Animate only `transform` and `opacity`; avoid per-frame React re-renders (bubble motion is imperative via `animate()`, not React state).
- `React.memo` on `Bubble` and `Tube`; select only what each component needs from Zustand (`useGame(s => s.selected)`).
- `font-display: swap` with system fallback.
- Keep the level JSON compact (arrays of small ints; ~10 KB for all 36 levels).
- CI checks: bundle size ≤ 200 KB gzip; Lighthouse CI mobile ≥ 95.

---

## 13. Testing Strategy

| Layer | Tool | What to test |
|---|---|---|
| **engine** | Vitest | `canMove` matrix (empty dst, same colour, different colour, full dst, same tube, empty src); `applyMove` doesn't mutate input; `undoMove` is the exact inverse; `isSolved` (partial tube = not solved; full+uniform = solved); `hasLegalMove` in a real dead-end |
| **solver** | Vitest | Solves hand-made small puzzles with known optimum; solution replays to a solved state; unsolvable puzzle returns `solved:false`; heuristic never exceeds true distance on tiny cases (brute-force compare) |
| **levels** | `levels:verify` + Vitest | All 36 levels: correct spec, exactly 2 empties, `CAPACITY` per colour, solvable, par matches; generation is deterministic (same seed → same JSON) |
| **layout** | Vitest | Tube counts 5/7/9 → rows 1/2/2 (5, 4+3, 5+4); centred rows; slot centres inside tubes; no overlap |
| **store** | Vitest | Full FR-11 matrix; undo limited to 5 and exactly reverses; restart resets everything; win detection and stars; stuck detection; sequential unlock; persistence and corrupt-data fallback |
| **UI** | Testing Library | Tube tap selects and moves; ResultSheet buttons; Undo disabled at 0; ConfirmDialog flows; symbols toggle |
| **E2E** | Playwright (iPhone SE, Pixel 7, iPad, desktop; portrait + landscape) | Solve Easy level 1 by replaying the solver's moves as taps; reload keeps progress; offline works; no scroll; hit areas ≥ 48 px |
| **A11y** | axe-core in Playwright | Zero serious/critical violations |

E2E trick: the test imports `levels.json` + `solve()`, computes the solution for a level, and taps the tubes in order. That guarantees the UI can complete real levels end to end.

---

## 14. Tooling, CI/CD & Deployment

**`package.json` scripts**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc --noEmit && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "lint": "eslint . --max-warnings 0",
    "format": "prettier --write .",
    "levels:generate": "tsx scripts/generate-levels.ts",
    "levels:verify": "tsx scripts/verify-levels.ts",
    "e2e": "playwright test"
  }
}
```

**Setup commands**
```bash
npm create vite@latest bubble-sorting -- --template react-ts
cd bubble-sorting
npm i zustand motion lucide-react canvas-confetti @fontsource/fredoka
npm i -D vite-plugin-pwa vitest jsdom tsx @testing-library/react @testing-library/jest-dom \
         @testing-library/user-event @types/canvas-confetti eslint prettier \
         @playwright/test @axe-core/playwright
```

**CI (`.github/workflows/ci.yml`)**: on push/PR → `npm ci` → `lint` → `test` → **`levels:verify`** → `build` → (optional) Playwright → upload `dist/`. On `main`, deploy to GitHub Pages, or connect the repo to Cloudflare Pages/Netlify (build `npm run build`, publish `dist`).

**Security headers (`_headers` on Cloudflare/Netlify):**
```
/*
  Content-Security-Policy: default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; worker-src 'self' blob:; manifest-src 'self'
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
```
(GitHub Pages can't set headers; a `<meta http-equiv>` CSP is a partial alternative.)

---

## 15. Build Order for the AI IDE (paste-ready prompts)

> **Tip for vibe coding:** put `PRD.md` and `Architecture.md` in the project root and tell the IDE to always follow them. Give it **one step at a time**, run the app and tests after each step, and `git commit` after every green step.

**Step 0: Scaffold**
> "Read PRD.md and Architecture.md. Scaffold the project as in Architecture §4 and §14 (Vite + React + TypeScript strict, Zustand, Motion, Vitest, ESLint, Prettier, tsx). Add `styles/tokens.css` and `base.css` from §8.5–8.6. Make `dev`, `test`, `build` work. No features yet."

**Step 1: Engine + tests**
> "Implement `src/core/types.ts`, `config.ts`, `engine.ts` from Architecture §5.1–5.3 and write `engine.test.ts` per §13 (engine row). No UI."

**Step 2: Solver + tests**
> "Implement `src/core/solver.ts` (A* with canonical state keys, the admissible heuristic, move pruning, node limit, optional weight) per §5.4, including a binary heap. Write `solver.test.ts` per §13."

**Step 3: Level pipeline**
> "Implement `rng.ts`, `generator.ts`, `scripts/generate-levels.ts` and `scripts/verify-levels.ts` per §5.5, §5.6 and §6. Generate `src/data/levels.json` with 12 levels for each of Easy (5 tubes/3 colours), Medium (7/5), Hard (9/7), 2 empty tubes, capacity 4. All must be solvable and ordered by difficulty. Add the levels tests from §13."

**Step 4: Layout**
> "Implement `core/layout.ts` (§5.7) with tests: 5 tubes = 1 row, 7 = 4+3, 9 = 5+4, rows centred, slot centres inside tubes."

**Step 5: Store**
> "Implement `store/gameStore.ts` per §7 (startLevel, tapTube with the full FR-11 matrix, undo with 5-undo limit, restart, stars, stuck detection, sequential unlock, persistence with safe storage and migration). Write the store tests from §13."

**Step 6: Static board UI**
> "Build `Board`, `Tube`, `Bubble`, `useBoardScale` per §8.2 and §8.6: render any level from `levels.json`, mobile-first, auto-scaling, glossy SVG bubbles and glass tubes with colour tokens. Show it at 320, 390 and 768 px widths."

**Step 7: Gameplay wiring**
> "Wire `GameScreen`: tapping tubes calls `tapTube`; TopBar, StatusRow (moves, undos), BottomBar (Undo with badge, Restart with confirm), 'No moves left' prompt, ResultSheet with stars and Next/Replay/Levels."

**Step 8: Navigation & progression**
> "Add SplashScreen, HomeScreen, DifficultyScreen, LevelSelectScreen (3×4 grid, stars, locks), HowToPlay (auto on first run), SettingsSheet, back-gesture support per §8.1. Persist progress and settings."

**Step 9: Animation & juice**
> "Implement the arc flight, lift/drop spring, shake, seal effect, win celebration and lazy confetti per §8.3 and §9.3. Respect reduced motion. Keep 60 fps on the Hard tier."

**Step 10: Audio & haptics**
> "Implement `services/audio.ts` and `haptics.ts` per §9 and connect them to `lastEvent` in GameScreen (§7.3). Unlock audio on the Splash tap."

**Step 11: Accessibility & symbols**
> "Implement §8.7: tube ARIA labels, Announcer, keyboard controls, focus management, colour-blind symbol mode with `BubbleSymbol`, contrast checks. Add axe tests."

**Step 12: PWA & performance**
> "Add vite-plugin-pwa per §11, icons, meta tags. Meet the budgets in §12. Run Lighthouse mobile and fix issues until all scores ≥ 95."

**Step 13: E2E & deploy**
> "Add Playwright tests (§13) including solving Easy level 1 by replaying the solver's moves; add the GitHub Actions workflow with `levels:verify` (§14), README with screenshots, MIT LICENSE and LICENSES.md. Deploy to the chosen free host."

**Step 14 (optional, P2): Hints**
> "Add the hint worker (§9.4) and a Hint button that highlights source and destination tubes; mark the run 'hint used'."

---

## 16. Extensibility Notes (v2)

- **New tiers / sizes:** add an entry to `TIERS` and re-run `levels:generate`. Layout, engine and UI are already parameterised by tube count and capacity.
- **Endless / daily mode:** reuse `randomCandidate` + `solve` at runtime inside a Web Worker, seeding with the date.
- **Skins/themes:** all colours flow through CSS variables and `PALETTE`; a skin = another token set and bubble SVG variant.
- **Renderer swap:** because state, layout and events are UI-independent, `Board` can be re-implemented in PixiJS without touching the rest.
- **Portal publishing (e.g. CrazyGames SDK):** wrap SDK calls (gameplay start/stop, ads) behind a `services/platform.ts` interface so the open-source core stays clean.
- **i18n:** put strings in `src/i18n/en.ts` with a `t()` helper from the start if you plan to localise.

---

## 17. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Reference details differ from assumptions (capacity, one-vs-many bubble moves) | Rules feel different | Constants in `config.ts`; verify checklist in PRD §2.2; generator + solver adapt automatically |
| Unsolvable or too-easy levels | Frustration / boredom | Solver-verified levels in CI; par-based difficulty ordering; regenerate with new seeds |
| Solver too slow on Hard tier | Slow builds / laggy hints | Canonical state keys, admissible heuristic, node limits, weighted fallback, Web Worker |
| Player gets soft-locked (moves exist but level unsolvable) | Confusion | Undo/Restart always available; P2: solver check in worker to warn "This can't be solved, undo or restart" |
| Mis-taps on small phones | Frustration | Tube hit areas ≥ 48 px and extend above tubes; selection can be cancelled; undo |
| Colour confusion | Unplayable for some | Symbol mode; palette spaced by hue and brightness |
| iOS blocks audio until a gesture | No sound | Splash "Tap to play" unlocks `AudioContext` |
| Mobile browser bar changes viewport height | Board clipped | `100dvh`, `min-height: 0` flex layout, auto-scaling board |
| Animation jank on low-end phones | Feels cheap | Transform/opacity only, imperative animation, memoised components, reduced-motion path |
| Accidentally copying reference assets | Legal | Original art, synthesised sound, generated levels; list licences in `LICENSES.md` |
| Scope creep | Delays | Ship M0–M7 before P2 items and §16 |
