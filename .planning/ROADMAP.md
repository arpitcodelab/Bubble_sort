# Roadmap — Bubble Sort Cyberpunk 2099

## Milestones & Execution Phases

```
Phase 1: Project Foundation & Cyberpunk Design System
         ├── Vite + React 18 + TS Setup
         ├── Cyberpunk Design Tokens & CSS System (Glows, Glass, Grid)
         └── Web Audio Synthesizer Engine

Phase 2: Pure Domain Engine & Solver
         ├── Rules Engine (canMove, applyMove, undoMove, isSolved, hasMoves)
         ├── A* Solver with Par Calculator
         └── Comprehensive Vitest Unit Test Suite

Phase 3: Deterministic Level Pipeline
         ├── Seeded Generator & Level Solvability Verifier
         └── Generate & Commit 36-level data/levels.json (12 Easy, 12 Medium, 12 Hard)

Phase 4: Game Board & Cyberpunk Tube/Bubble Visuals
         ├── Containment Tube Component (Glass reflection, laser guides, seal cap)
         ├── Plasma Energy Bubble Component (Radial gradients, specular core, symbol overlay)
         ├── Physics-like Motion Arcs & Responsive Board Auto-Scaler
         └── Touch & Keyboard Input Handlers

Phase 5: Screens, HUD & Progression
         ├── Cyberpunk Splash Screen & Arcade Home Menu
         ├── Difficulty Matrix (Easy/Medium/Hard) & 3x4 Level Select Grid
         ├── Game HUD (TopBar, StatusRow, BottomBar with 5-Undo Badge)
         ├── Level Complete Victory Modal with Star Ratings & Par Metrics
         └── How-To-Play Terminal & Settings Sheet

Phase 6: Audio-Visual FX, Particles & Polish
         ├── Victory Energy Particles / Cyber-Confetti
         ├── Containment Seal Overdrive Animation & Sound
         ├── Synthesised Sound Integration & Haptic Pulses
         └── Accessibility (ARIA live announcer, Colorblind symbols, Reduced Motion)

Phase 7: PWA, Verification & Final Delivery
         ├── PWA Offline Manifest & Service Worker
         ├── End-to-End Visual & Functional Verification
         └── Build Optimization & Documentation
```

---

## Phase Details

### Phase 1: Project Foundation & Cyberpunk Design System
- Initialize Vite project with React 18 and TypeScript in strict mode.
- Establish CSS design tokens in `src/styles/tokens.css` with cyberpunk color palette, luminous bloom variables, smoked glass panels, and grid background.
- Implement Web Audio synthesizer (`src/services/audio.ts`) with zero-asset procedural sound generation.

### Phase 2: Pure Domain Engine & Solver
- Implement `src/core/types.ts`, `src/core/config.ts`, `src/core/engine.ts`.
- Implement `src/core/solver.ts` with A* graph search to calculate shortest path and par moves.
- Write thorough Vitest unit tests verifying placement rules, undo stack, win conditions, and stuck detection.

### Phase 3: Deterministic Level Pipeline
- Implement `src/core/rng.ts` and `src/core/generator.ts`.
- Create scripts `scripts/generate-levels.ts` and `scripts/verify-levels.ts`.
- Generate and verify 36 unique, balanced, solvable levels across Easy, Medium, and Hard tiers in `src/data/levels.json`.

### Phase 4: Game Board & Cyberpunk Tube/Bubble Visuals
- Create `src/ui/components/Tube.tsx` with futuristic containment tube styling, edge rails, and capacity slots.
- Create `src/ui/components/Bubble.tsx` with plasma orb gradients, glowing rim, specular reflections, and colorblind symbols.
- Build `src/ui/components/Board.tsx` with dynamic responsive scaling hook (`useBoardScale.ts`) and motion arc flight animations.
- Integrate Zustand store (`src/store/gameStore.ts`) connecting user taps and keyboard events to game engine.

### Phase 5: Screens, HUD & Progression
- Build screen flow: `SplashScreen.tsx`, `HomeScreen.tsx`, `DifficultyScreen.tsx`, `LevelSelectScreen.tsx`, `GameScreen.tsx`.
- Create HUD components: `TopBar.tsx`, `StatusRow.tsx`, `BottomBar.tsx`, `ResultSheet.tsx`, `HowToPlay.tsx`, `SettingsSheet.tsx`, `ConfirmDialog.tsx`.
- Connect persistent progress (stars, best moves, unlocks) in Zustand store with `localStorage`.

### Phase 6: Audio-Visual FX, Particles & Polish
- Wire Web Audio sound effects to all interactions (tap, select, place, error, undo, seal, win).
- Add canvas energy particle bursts / cyber-confetti on victory.
- Implement tube seal glow and energy pulse animations.
- Implement accessible ARIA live announcements and verify keyboard shortcuts (`Tab`, `Arrows`, `Enter`, `U`, `R`).

### Phase 7: PWA, Verification & Final Delivery
- Configure `vite-plugin-pwa` for offline capability.
- Comprehensive QA verification across portrait and landscape viewports, touch and keyboard input.
- Validate bundle size (<200KB) and 60 FPS performance.
