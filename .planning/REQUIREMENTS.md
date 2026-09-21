# Requirements Specification — Bubble Sort Cyberpunk 2099

## 1. Core Mechanics & Game Rules (FR-1 to FR-8)

- **FR-1 (P0)**: Level contains $T$ tubes with capacity $C=4$. Tubes hold stacked bubbles. Only the top bubble of any tube can be moved.
- **FR-2 (P0)**: Placement Rule — A move takes the top bubble of a source tube and moves it to a destination tube iff: $source \neq destination$, source is not empty, destination is not full, and destination is either empty OR top bubble matches moved bubble color.
- **FR-3 (P0)**: Initial level layouts are pre-mixed according to the verified solvable configuration.
- **FR-4 (P0)**: Win Condition — Level is complete when every tube is either completely empty or completely full with 4 bubbles of a single color.
- **FR-5 (P0)**: Undo System — Each level grants up to 5 undos. Reverses the latest move accurately. Restart resets the board, moves, and restores 5 undos.
- **FR-6 (P0)**: Three distinct difficulty tiers: Easy (5 tubes, 3 colours, 2 empty), Medium (7 tubes, 5 colours, 2 empty), Hard (9 tubes, 7 colours, 2 empty).
- **FR-7 (P0)**: 36 deterministic, verified-solvable levels (12 per tier).
- **FR-8 (P0)**: Stuck Detection — When no legal move exists and level is unsolved, display non-intrusive alert offering Undo or Restart.

---

## 2. Interaction & Controls (FR-10 to FR-14)

- **FR-10 (P0)**: Two-tap interaction model: Tap source tube to lift top bubble; tap destination tube to transfer bubble.
- **FR-11 (P0)**: Matrix tap behaviors (Deselect on same tube tap; switch selection on non-empty invalid destination tap; shake/reject feedback on full/mismatched destination).
- **FR-12 (P0)**: Generous touch targets ($\ge 48 \times 48\text{ px}$ per tube column).
- **FR-13 (P1)**: Full keyboard support (`Tab`, `Left`/`Right` arrows, `Enter`/`Space` to select/drop, `Esc` to deselect, `U` to undo, `R` to restart).
- **FR-14 (P2)**: Drag-and-drop support as secondary intuitive gesture.

---

## 3. UI Screens & Navigation (FR-20 to FR-46)

- **FR-20 (P0)**: Game HUD Layout — Top bar (Back, Level Title, Restart), Status row (Moves, Par, Undos Left [5]), Board (Tubes), Bottom bar (Undo, Restart, Hint).
- **FR-21 (P0)**: Responsive Tube Arrangement — 1 row for $\le 5$ tubes; 2 centered staggered rows for $>5$ tubes ($7 \to 4+3$, $9 \to 5+4$).
- **FR-22 (P0)**: Real-time move counter.
- **FR-23 (P0)**: Undo button badge showing remaining count (disabled and dimmed when 0).
- **FR-24 (P0)**: Restart button with confirmation guard if moves $>0$.
- **FR-25 (P0)**: Zero-lag instant logic state updates with concurrent smooth visual animations.
- **FR-30 (P0)**: Level Complete Celebration Sheet — Stars earned (1-3★), moves taken vs best score, Replay, Next Level, Level Select.
- **FR-31 (P0)**: Sealed Tube Effect — Full single-colour tubes become sealed with glowing energy caps and chime feedback.
- **FR-32 (P0)**: Tier Completion celebration and return to Level List.
- **FR-33 (P1)**: Star rating criteria (3★ $\le 125\%$ par, 2★ $\le 175\%$ par, 1★ otherwise).
- **FR-40 (P0)**: App Navigation Flow: Splash Screen $\to$ Arcade Home $\to$ Difficulty Select $\to$ Level Select $\to$ Gameplay HUD $\to$ Level Complete.
- **FR-41 (P0)**: Difficulty Select Cards displaying tube count, colour count, and completion badge (e.g. `7/12`).
- **FR-42 (P0)**: Level Select Grid ($3 \times 4$ cells per tier) with level number, stars, and lock state.
- **FR-43 (P0)**: Sequential level unlocking per tier with optional dev config toggle.
- **FR-44 (P0)**: Robust `localStorage` persistence of progress and settings.
- **FR-45 (P0)**: Interactive Cyberpunk "How to Play" HUD modal.
- **FR-46 (P1)**: "Continue" quick-action on Home screen routing to first uncompleted level.

---

## 4. Future-Tech Visual Upgrade (VFR-1 to VFR-10)

- **VFR-1 (P0) Cyberpunk Void & Lighting**: Ultra-dark background (`#07090E` to `#0A0D14`) with subtle digital grid lines, faint scanlines, faint micro-circuits, and controlled atmospheric ambient bloom.
- **VFR-2 (P0) High-Tech Energy Containment Tubes**: Styled as cylindrical glass containment vessels with luminous side guide-rails, laser graduation notches, smoked dark glass bases, and soft reflective gloss.
- **VFR-3 (P0) Plasma Energy Spheres (Bubbles)**: Spherical plasma energy orbs with intense luminous cores, high-gloss specular reflections, rim lighting, chromatic glow, and smooth spring physics.
- **VFR-4 (P0) 7-Colour Cyberpunk Palette**:
  1. Cyan Plasma: `#00F0FF`
  2. Neon Orange: `#FF6B00`
  3. Hyper Yellow / Gold: `#FFE600`
  4. Matrix Green: `#00FF66`
  5. Electric Blue: `#0080FF`
  6. Ultra Violet: `#9D00FF`
  7. Neon Magenta / Pink: `#FF007F`
- **VFR-5 (P0) Futuristic Hardware & Glass UI**: Buttons and panels constructed with smoked glass backgrounds, illuminated neon borders, micro-chamfers, subtle drop shadows, and luminous active states.
- **VFR-6 (P0) Display Typography**: Modern, crisp geometric typography (Rajdhani / Orbitron / Inter) with subtle glow and clear hierarchical weighting.
- **VFR-7 (P0) Fluid Arc Animations & Particle FX**: Trajectory arc for bubble transfers with realistic deceleration, squish & settle, and cyber-confetti / energy particle bursts on level victory.
- **VFR-8 (P1) Holographic Colorblind Glyphs**: Crisp glowing geometric runes/symbols (Circle, Triangle, Square, Star, Heart, Diamond, Plus) rendered on each energy orb.
- **VFR-9 (P0) Containment Seal Overdrive**: Completed tubes trigger an energetic containment seal animation with laser cap lock and resonance pulse.
- **VFR-10 (P0) Premium Feel**: Visual contrast hierarchy prioritizing active energy elements; no flat cheap RGB clutter or excessive uniform glow.

---

## 5. Audio & Haptic Feedback (FR-50, FR-63, FR-64)

- **AFR-1 (P0)**: Pure Web Audio API synthesised sound effects:
  - *Select*: High-tech frequency sweep blip (600Hz $\to$ 900Hz).
  - *Drop/Place*: Satisfying plasma impact pop with low-end thump (250Hz $\to$ 120Hz).
  - *Blocked/Reject*: Short dual-tone warning buzzer (180Hz error pulse).
  - *Undo*: Reverse time warp pitch chirp (400Hz $\to$ 800Hz sweep).
  - *Tube Seal*: Resonant harmonic chord shimmer.
  - *Level Win*: Arpeggiated futuristic victory chord cascade.
  - *UI Tap*: Crisp mechanical glass click.
- **AFR-2 (P1)**: Mobile Haptics via Navigator Vibration API (15ms light tick on select, 25ms place tick, 40ms+40ms seal double-pulse, celebratory win rhythm).
- **AFR-3 (P0)**: Sound & Haptics toggle in Settings and Game HUD.

---

## 6. Accessibility & Non-Functional Requirements (NFR-A1 to NFR-R3)

- **NFR-A1 (P0)**: Tubes accessible as standard `<button>` elements with dynamic ARIA labels indicating position, contents from bottom to top, and sealed/selected state.
- **NFR-A2 (P0)**: Live announcements via `aria-live="polite"` region for every move, undo, seal, and victory.
- **NFR-A3 (P0)**: Full keyboard navigability with luminous neon focus outlines.
- **NFR-A4 (P0)**: Colorblind symbol mode ensuring accessibility across all vision spectrums.
- **NFR-A5 (P0)**: `prefers-reduced-motion` compliance (teleports/quick fades instead of arcs, no particle bursts).
- **NFR-P1 (P0)**: Zero external runtime network dependencies; bundle size $< 200\text{ KB}$ gzipped.
- **NFR-P2 (P0)**: 60 FPS smooth rendering across mobile viewports (320px to tablet/desktop).
- **NFR-R1 (P0)**: Graceful fallback and offline PWA capability with Service Worker precaching.
