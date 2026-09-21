# PRD — Bubble Sorting (Mobile-First Puzzle Game)

| | |
|---|---|
| **Working title** | Bubble Sorting (final brand name TBD, see §17) |
| **Document version** | 1.0 |
| **Genre** | Logic / sorting puzzle (1 player, single-screen, portrait) |
| **Type** | Free, open-source, browser-based game (installable offline PWA) |
| **Primary platform** | Mobile browsers (phones first), then tablet and desktop |
| **Reference product** | "Bubble Sorting" by Eagle Games on CrazyGames (https://www.crazygames.com/game/bubble-sorting) |

> **How to read this document.** Every requirement has an ID (e.g. `FR-12`) so an AI IDE or a human can reference it precisely ("implement FR-12 and FR-13"). Priority: **P0** = must ship in v1.0, **P1** = should ship in v1.0, **P2** = later / nice to have.

---

## 1. Overview

### 1.1 Summary
A calm, satisfying colour-sorting puzzle. The player sees several glass tubes holding stacks of coloured bubbles. By moving bubbles one at a time between tubes, they must end with **one colour per tube**. A bubble can only be placed on an empty tube or on a bubble of the same colour, so the player has to plan ahead. Three difficulty tiers, 12 hand-picked levels each (36 total), and a small number of undos per level keep it fair and thoughtful.

### 1.2 Vision
"The most satisfying sorting puzzle you can play in 30 seconds or 30 minutes." The rules are simple; quality comes from **feel**: glossy bubbles, springy motion, soft pops, instant response, and levels that are always solvable and steadily more interesting.

### 1.3 Goals
1. Reproduce the full core loop and structure of the reference game (see §2).
2. Feel native on a phone: one-thumb play, big tap targets, no scroll or zoom glitches, works offline.
3. Load in under 2 seconds on a mid-range phone on 4G.
4. Ship **36 original levels that are all verified solvable** by an automated solver.
5. Use only free, open-source tools and original or openly licensed assets.
6. Be playable by colour-blind players (symbols on bubbles).

### 1.3.1 Non-goals (v1.0)
- Ads, in-app purchases, accounts, online leaderboards, analytics or tracking.
- Copying Eagle Games' artwork, sounds, layouts or level designs. We build original assets and generate our own levels.
- 3D graphics, physics simulation, multiplayer.
- Endless/procedural levels at runtime (see Roadmap §16).

---

## 2. Reference Analysis (Bubble Sorting on CrazyGames)

### 2.1 What the reference page explicitly states
| # | Observed fact | How we treat it |
|---|---|---|
| A1 | "Simple logic game": sort bubbles into tubes **until there is only one colour per tube** | Win condition (FR-4) |
| A2 | The game **won't let you place two bubbles of different colours directly next to each other**, so you must think logically | Placement rule (FR-2). Interpreted as: a bubble may only be dropped onto an empty tube or onto a same-coloured top bubble |
| A3 | **3 difficulty levels**, each with **12 unique levels** (36 total) | FR-6, FR-7 |
| A4 | Difficulty is driven by number of tubes and colours: **Easy 5 tubes / 3 colours, Medium 7 tubes / 5 colours, Hard 9 tubes / 7 colours** | Difficulty table in §5.3. Pattern = colours + **2 empty tubes** |
| A5 | **5 chances to reverse a decision per level**, on every difficulty: "put the bubble back where it came from" | Undo rule FR-5 |
| A6 | Controls: **select the bubble/tube, then select the destination tube** (mouse on desktop, tap on mobile) | FR-10..FR-12 |
| A7 | Orientation: **Portrait**. Platforms: browser (desktop, mobile, tablet) and mobile apps. Engine: HTML5 | Portrait-first layout (§10). Web app, no engine needed |
| A8 | Released Dec 2020; rated 8.6/10 by players (last 6 months) | Confirms the simple mechanic is proven and popular |
| A9 | Tags: Puzzle, Sorting, 1 Player, Classic, Colour, Ball, Logic | Genre expectations: calm, colourful, no timer pressure |
| A10 | Sibling games on the same page ("Cups – Water Sort Puzzle", "Nuts Puzzle: Sort By Color", "Screw Sorting") | Same "sort" genre conventions apply (tap source → tap destination, undo, restart) |

### 2.2 What I could NOT verify (the game itself runs in an embedded frame)
These are treated as **design decisions** in this PRD (marked *Decision*). To confirm quickly, open the reference and check the items in the box.

> **5-minute verification checklist (play Easy level 1 in the reference):**
> 1. How many bubbles fit in one tube? *(assumed 4)*
> 2. Does a tap move **one bubble** or **all matching bubbles** on top? *(assumed one bubble, consistent with "put the bubble back")*
> 3. Is there a restart button, hint button, timer, move counter, or star rating? *(assumed: restart yes; hint/timer no; move counter yes)*
> 4. Are all levels unlocked, or must you finish them in order? *(assumed sequential within a difficulty)*
> 5. Does a wrong tap shake/blocked-sound, or do nothing? *(assumed shake + soft buzz)*
>
> If any answer differs, tell your IDE to update the matching constant in `src/core/config.ts` (Architecture §5.4). The design is built so these are one-line changes.

### 2.3 Where we go beyond the reference
Colour-blind symbols, optional hints, stars for efficient solutions, haptics, dark theme, installable offline PWA, keyboard and screen-reader support, and a proven-solvable level pipeline.

---

## 3. Target Users

| Persona | Need | Implication |
|---|---|---|
| **Casual mobile player** (commute, waiting) | Open link, play in seconds, one hand, no pressure | Instant start, no timers, big tubes, gentle feedback |
| **Puzzle fan** | Real challenge, clean logic, "aha" moments | 9-tube / 7-colour Hard tier, solver-verified levels, par scores |
| **Kids / families** | Colourful, forgiving | Easy tier, generous undo, friendly visuals |
| **Colour-blind player** (~1 in 12 men) | Tell colours apart | Symbol mode (FR-62) |
| **Screen-reader / keyboard user** | Full access | Labelled tubes, keyboard controls, live announcements |

---

## 4. Platform & Constraints

- **Delivery:** static website (HTML/JS/CSS) on free hosting (GitHub Pages / Cloudflare Pages / Netlify). No backend.
- **Devices:** phones 320–430 px wide first, then tablets and desktop.
- **Browsers (last 2 versions):** Chrome/Android, Safari/iOS 15+, Firefox, Edge, Samsung Internet.
- **Orientation:** portrait primary (as reference). Landscape must remain usable.
- **Cost:** everything free and open source (licences in Architecture §2).
- **Data:** stored locally only (`localStorage`). No network calls after first load.

---

## 5. Game Rules Specification (authoritative)

### 5.1 Objects
- **FR-1 (P0)** A level contains **T tubes**, each with a **capacity C** (*Decision:* C = 4 by default; configurable per difficulty). Tubes hold bubbles stacked from bottom to top. **Only the top bubble** of a tube can be moved.
- Bubble colours come from a palette of up to 7 distinct colours. Every colour has exactly **C bubbles** in a level (so a finished colour exactly fills one tube).

### 5.2 Moves
- **FR-2 (P0) Placement rule.** A move takes the **top bubble** of a source tube and places it on a destination tube. It is legal only if: source ≠ destination, source is not empty, destination is **not full**, and destination is **empty or its top bubble has the same colour** as the moved bubble. (This is the reference's "no two different colours directly next to each other" rule.) Illegal moves never change the board.
- **FR-3 (P0)** Level start layouts are **pre-mixed**: neighbouring different colours exist at the start. The rule in FR-2 restricts only bubbles the player places.
- **FR-4 (P0) Win.** The level is complete when **every tube is either empty or completely full with a single colour**. (Since each colour has exactly C bubbles, each colour ends up in exactly one tube.)
- **FR-5 (P0) Undo.** Each level grants **5 undos** (*from reference*). One undo reverses the **most recent move**: that bubble returns to its origin tube and position. Undo can be repeated back through history until the allowance is used up. The remaining count is always visible. **Restart** resets the board, moves, and the undo allowance.
- **FR-8 (P0) Stuck detection.** If no legal move exists and the level is unsolved, show a friendly "No moves left" prompt offering **Undo** (if any left) and **Restart**.

### 5.3 Difficulty tiers
| Tier | Tubes | Colours | Empty tubes at start | Bubbles | Levels | Undos per level |
|---|---|---|---|---|---|---|
| **Easy** | 5 | 3 | 2 | 12 | 12 | 5 |
| **Medium** | 7 | 5 | 2 | 20 | 12 | 5 |
| **Hard** | 9 | 7 | 2 | 28 | 12 | 5 |

- **FR-6 (P0)** The three tiers above are all available from the home flow.
- **FR-7 (P0)** There are **36 fixed levels** (12 per tier), identical for every player, always solvable, and ordered from easiest to hardest within a tier. They are generated once at build time by a script and verified by a solver (Architecture §6). **No two levels in a tier are identical.**

---

## 6. Functional Requirements

### 6.1 Controls & input
- **FR-10 (P0)** **Tap a tube** to select it: its top bubble **lifts** above the rim and the tube glows. **Tap another tube** to move the bubble there (if legal).
- **FR-11 (P0)** Tap behaviour matrix:

| Situation | Result |
|---|---|
| Nothing selected, tap a non-empty tube | Select it (lift top bubble) |
| Nothing selected, tap an empty tube | Ignore (subtle tap feedback) |
| Tap the already-selected tube | Deselect (bubble drops back) |
| Something selected, tap a tube where the move is **legal** | Perform move |
| Something selected, tap a **different non-empty** tube where the move is **illegal** | Switch selection to that tube |
| Something selected, tap an **empty or full** tube where move is illegal | Shake that tube + soft "blocked" sound; keep selection |
| Tap a completed (sealed) tube | Ignore |

- **FR-12 (P0)** Each tube's tap area covers the whole tube column plus the space above it (where the lifted bubble sits), with width ≥ 48 px on a 320-px-wide screen.
- **FR-13 (P1)** Keyboard: Tab / Left / Right to focus tubes, Enter/Space to select and drop, Esc to deselect, `U` undo, `R` restart.
- **FR-14 (P2)** Drag-and-drop as an alternative to tap-tap.

### 6.2 Game screen
- **FR-20 (P0)** Layout top→bottom: top bar (back, level name, restart), status row (moves, undo count), board (tubes), bottom bar (Undo, Restart, Hint P2).
- **FR-21 (P0)** Tubes arrange automatically: one row when ≤ 5 tubes; two centred rows otherwise (7 → 4+3, 9 → 5+4). Everything scales to fit the screen with no scrolling.
- **FR-22 (P0)** **Move counter** shows moves made (undo reduces it).
- **FR-23 (P0)** **Undo button** shows remaining undos (e.g. a badge "5"). At 0 it is disabled and visually muted.
- **FR-24 (P0)** **Restart** asks for confirmation only if moves have been made.
- **FR-25 (P0)** Input responds instantly: game logic updates immediately; animation is purely visual and never blocks the next tap (except during the final win celebration).

### 6.3 Level complete
- **FR-30 (P0)** When solved, briefly celebrate (tubes sparkle, bubbles bounce in a wave, confetti), then show a **Level Complete** sheet: moves used, best moves, stars (FR-33), and buttons **Next level** (primary), **Replay**, **Level list**.
- **FR-31 (P0)** A tube that becomes complete (full + one colour) gets a **"sealed" effect** (glow, small chime, cap). Sealed tubes can't be selected as a source.
- **FR-32 (P0)** After the last level of a tier, "Next" leads to the level list with a "Tier complete!" message.
- **FR-33 (P1)** **Stars:** 3★ if moves ≤ 125% of par, 2★ if ≤ 175% of par, otherwise 1★. *Par* = the solver's shortest known solution for that level. The player's best (fewest moves/most stars) is remembered.

### 6.4 Navigation & progression
- **FR-40 (P0)** Flow: Splash ("Tap to play") → Home → Difficulty select → Level select → Game. Back buttons and the system back gesture step back sensibly.
- **FR-41 (P0)** **Difficulty select** shows three cards (Easy, Medium, Hard) with tube and colour counts and progress ("7/12").
- **FR-42 (P0)** **Level select** shows a 3-column × 4-row grid (12 cells) per tier with: level number, stars earned, lock icon for locked levels.
- **FR-43 (P0)** *Decision:* within a tier, level *n+1* unlocks when level *n* is completed. All three tiers are open from the start. A config flag `UNLOCK_ALL` can disable locking.
- **FR-44 (P0)** Progress (completed levels, best moves, stars) persists across sessions.
- **FR-45 (P0)** A **How to play** sheet (3–4 illustrated steps) is shown automatically the first time and reachable from Home.
- **FR-46 (P1)** Home shows a **Continue** button that jumps to the first unfinished level.

### 6.5 Settings
- **FR-50 (P0)** **Sound** on/off (persistent), reachable from Home and Game.
- **FR-51 (P1)** **Haptics** on/off, **Colour-blind symbols** on/off, **Theme** (System / Light / Dark), **Reduce motion** override, **Reset progress** (with confirmation).

### 6.6 Hints (P2)
- **FR-55 (P2)** A **Hint** button asks the solver for the best next move from the *current* board and highlights source and destination tubes. Unlimited, no penalty, but the level is flagged "hint used" (no 3★). Computed in a Web Worker so the UI never freezes.

### 6.7 Feedback: visuals, audio, haptics
- **FR-60 (P0)** Bubbles are glossy spheres (SVG gradients + highlight), tubes are glass with rim highlights. Original artwork only.
- **FR-61 (P0)** Motion: selected bubble lifts and gently bobs (≤ 150 ms up). A move animates as an **arc** (up out of the source, across, down into the destination, with a light squash-and-settle), total ≈ 300–400 ms. Illegal tap → 200 ms horizontal shake.
- **FR-62 (P1)** **Colour-blind mode:** each colour also gets a unique symbol (e.g. dot, triangle, square, star, heart, diamond, plus) drawn on the bubble.
- **FR-63 (P0)** Sound effects (synthesised): select, drop/place, blocked, undo, tube sealed, level complete, UI tap. Audio starts only after the first tap (Splash gate).
- **FR-64 (P1)** Haptic tick on place, double tick on seal, pattern on level complete (Vibration API; ignored where unsupported).
- **FR-65 (P0)** All motion honours `prefers-reduced-motion` (arcs become quick fades/teleports; no confetti; no shake, use a colour flash).
- **FR-66 (P0)** No background music in v1.0 (reduces size and annoyance).

### 6.8 PWA & offline
- **FR-70 (P1)** Installable to the home screen with an app-like standalone display.
- **FR-71 (P1)** Fully playable offline after first load.
- **FR-72 (P1)** Silent auto-update applied on next launch.

---

## 7. Level Design Specification

### 7.1 Requirements
- **FR-80 (P0)** All 36 levels are **solvable**, verified by an automated solver in CI.
- **FR-81 (P0)** No level starts already sorted, and no tube starts as a complete single-colour full tube (would be pointless).
- **FR-82 (P0)** Each level starts with **exactly 2 empty tubes** and fully packed other tubes (bubbles = colours × C, the coloured tubes filled to capacity).
- **FR-83 (P0)** Levels within a tier increase in difficulty: primary metric is the solver's shortest solution length ("par"), secondary is how mixed the tubes are (number of colour changes between neighbouring bubbles).
- **FR-84 (P1)** Levels feel varied: the generator rejects layouts with many near-duplicate tubes and ensures every tube in a level holds at least 2 different colours (except the two empty ones).
- **FR-85 (P0)** Levels are **deterministic**: generated from fixed seeds and committed as `levels.json`, so every player gets the same levels and the game needs no runtime generation.

### 7.2 Expected difficulty feel
| Tier | Feel | Typical par (target, to be tuned) |
|---|---|---|
| Easy | Tutorial-friendly; 2–3 minutes | ~ 10–20 moves |
| Medium | Needs planning; 3–6 minutes | ~ 25–45 moves |
| Hard | Real puzzle; 5–10+ minutes | ~ 50–90 moves |

*These ranges are estimates; final pars come from the solver.*

---

## 8. Screens & Flows

### 8.1 Flow
```
Loading → Tap to Play → Home ─┬─ Play → Difficulty → Level Select → Game ─→ Level Complete
                              │                                       ↑           │
                              │                                       └── Next ───┘
                              ├─ Continue → Game (first unfinished level)
                              ├─ How to play
                              └─ Settings
```

### 8.2 Wireframes (portrait, ~390 × 844)

**Home**
```
┌──────────────────────────┐
│                     🔊 ⚙ │
│                          │
│     ●  ●  ●   (bubbles   │
│     BUBBLE SORTING        │      animated logo)
│                          │
│     [    ▶  Play     ]   │
│     [    Continue    ]   │
│     [   How to play  ]   │
└──────────────────────────┘
```

**Difficulty select**
```
┌──────────────────────────┐
│ ←   Choose difficulty    │
│ ┌──────────────────────┐ │
│ │ Easy      5 tubes    │ │
│ │ ●●● 3 colours  3/12  │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Medium    7 tubes    │ │
│ │ ●●●●● 5 colours 0/12 │ │
│ └──────────────────────┘ │
│ ┌──────────────────────┐ │
│ │ Hard      9 tubes    │ │
│ │ ●●●●●●● 7 colours    │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

**Level select (12 levels)**
```
┌──────────────────────────┐
│ ←        Easy            │
│  ┌────┐ ┌────┐ ┌────┐    │
│  │ 1  │ │ 2  │ │ 3  │    │
│  │★★★ │ │★★☆ │ │ 🔒 │    │
│  └────┘ └────┘ └────┘    │
│   ... 4 rows × 3 cols ...│
└──────────────────────────┘
```

**Game (Hard, 9 tubes, two rows)**
```
┌──────────────────────────┐
│ ←   Hard · Level 4    ⟲  │  ← back / title / restart
│   Moves 12     Undos 5   │
│                          │
│     ●                    │  ← selected bubble lifted
│    ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐   │
│    │●│ │●│ │●│ │●│ │ │   │
│    │●│ │●│ │●│ │●│ │ │   │
│    │●│ │●│ │●│ │●│ │ │   │
│    │●│ │●│ │●│ │●│ │ │   │
│    └─┘ └─┘ └─┘ └─┘ └─┘   │
│      ┌─┐ ┌─┐ ┌─┐ ┌─┐     │
│      │ │ │●│ │ │ │●│     │
│      └─┘ └─┘ └─┘ └─┘     │
│                          │
│  [ ↶ Undo (5) ] [ 💡 ]   │  ← bottom bar
└──────────────────────────┘
```

**Level Complete sheet**
```
┌──────────────────────────┐
│        ★ ★ ☆             │
│     Level complete!      │
│   Moves 18   Best 16     │
│  [   Next level  ▶   ]   │
│  [ Replay ]  [ Levels ]  │
└──────────────────────────┘
```

---

## 9. Visual Design Direction

*Decision:* glossy, cheerful, calm "candy glass" look on a soft gradient background. Original design, not a copy of the reference.

- **Bubbles:** SVG spheres with radial gradient, small white specular highlight, soft inner shadow, subtle drop shadow on the tube floor.
- **Tubes:** semi-transparent glass with lighter rim, rounded bottom, faint reflection stripe. Sealed tubes get a soft coloured glow and a small cap.
- **Background:** deep indigo→violet gradient (dark) / soft lavender→sky gradient (light).
- **Palette (7 colours, all CSS variables, chosen to be far apart in hue and brightness):**

| # | Name | Hex | Symbol (colour-blind mode) |
|---|---|---|---|
| 0 | Red | `#FF4D5E` | ● dot |
| 1 | Orange | `#FF9F2E` | ▲ triangle |
| 2 | Yellow | `#FFD93B` | ■ square |
| 3 | Green | `#34D17A` | ★ star |
| 4 | Blue | `#3EA8FF` | ♥ heart |
| 5 | Purple | `#A66BFF` | ◆ diamond |
| 6 | Pink | `#FF7BC8` | ✚ plus |

- **Typography:** rounded friendly open-licence font (Fredoka, SIL OFL), self-hosted. Body ≥ 16 px; big numerals for moves/undos.
- **Spacing:** 4-px base grid; radius 16 px for cards/buttons.
- **Icons:** inline SVG (Lucide, ISC) so no icon font loads.
- **Level-select cells and buttons** use the same glossy style so the UI matches the game.

---

## 10. Mobile-Specific Requirements

- **FR-90 (P0)** All interactive elements ≥ **48 × 48 px** touch target (tubes: full column, see FR-12).
- **FR-91 (P0)** Uses dynamic viewport units (`dvh`) and safe-area insets so nothing hides behind notches or browser bars.
- **FR-92 (P0)** No double-tap zoom or 300 ms tap delay (`touch-action: manipulation`); no text selection or long-press menus; no pull-to-refresh or scroll bounce during play. Pinch-zoom on the page stays available for accessibility.
- **FR-93 (P0)** The board **auto-scales** to the largest size that fits the available space at any screen size (320 × 568 up to tablet), keeping bubble proportions.
- **FR-94 (P0)** Landscape works: board scales to the available height and UI controls move to the side.
- **FR-95 (P1)** Haptics per FR-64.
- **FR-96 (P1)** Correct `theme-color` and manifest so the browser chrome matches the app.

---

## 11. Accessibility Requirements

- **NFR-A1 (P0)** Each tube is a real `<button>` with a label such as "Tube 3, contents from bottom: red, blue, blue, green. Top: green" and states "selected" / "sealed" / "empty".
- **NFR-A2 (P0)** A polite `aria-live` region announces moves ("Moved green from tube 3 to tube 5"), undo, seals, and level completion.
- **NFR-A3 (P0)** Fully keyboard-playable (FR-13) with a visible focus ring.
- **NFR-A4 (P0)** Colours are never the only signal (symbol mode, FR-62). Text contrast ≥ WCAG AA.
- **NFR-A5 (P0)** Honour `prefers-reduced-motion` (FR-65).
- **NFR-A6 (P1)** Dark and light themes; UI text is scalable with browser font-size settings.

---

## 12. Non-Functional Requirements

### 12.1 Performance
| Metric | Target |
|---|---|
| JS bundle (gzip) | **≤ 200 KB** total |
| First Contentful Paint (4G, mid-range phone) | ≤ 1.5 s |
| Time to Interactive | ≤ 2.0 s |
| Lighthouse (Mobile): Performance / Accessibility / Best Practices | ≥ 95 each; PWA installable |
| Tap-to-visual-feedback latency | ≤ 100 ms |
| Animation frame rate (Hard tier, 28 bubbles) | 60 fps target on mid-range phone |

### 12.2 Reliability
- **NFR-R1** If `localStorage` is unavailable, the game still works (progress just won't persist).
- **NFR-R2** Corrupt or outdated saved data is discarded safely (versioned schema), never crashing the app.
- **NFR-R3** Game logic is deterministic and unit-tested; the solver never runs on the main thread in the shipped app.

### 12.3 Privacy & Security
- **NFR-P1** No cookies, trackers, or third-party requests at runtime. Fonts and assets are self-hosted.
- **NFR-P2** Only data stored: settings and progress, locally on the device. State this in a short in-app note.
- **NFR-P3** Serve over HTTPS with a strict Content-Security-Policy.

### 12.4 Maintainability
- Rules, solver and generator are **pure TypeScript with no UI imports**, ≥ 95% test coverage.
- Strict TypeScript, ESLint, Prettier; CI runs lint, tests, level verification, and build on every push.

---

## 13. Legal & Licensing

- Use permissive open-source dependencies (MIT/ISC/Apache/OFL). List them in `LICENSES.md`.
- **Do not** copy Eagle Games' graphics, sounds, layouts, level data, or branding. Sorting-puzzle mechanics are a common genre; our implementation, art, sounds and levels are original.
- Choose an original final title and logo (not confusingly similar to "Bubble Sorting" on CrazyGames).
- Sound is synthesised in the browser (no files, no licensing issues).
- Project licence for our own code: MIT (suggested).

---

## 14. Release Plan & Milestones

| Milestone | Scope | Definition of done |
|---|---|---|
| **M0 – Foundation** | Repo, tooling, CI, design tokens | `dev / build / test` pass |
| **M1 – Core engine** | Rules, undo, win/stuck detection, solver, tests | All engine and solver tests green |
| **M2 – Level pipeline** | Generator script, `levels.json` with 36 verified levels | CI verifies all 36 solvable, deterministic |
| **M3 – Playable MVP** | Board rendering, tap-tap moves, win, level complete | Full Easy tier playable on a phone |
| **M4 – Full game** | Difficulty/level select, progression, persistence, settings, how-to | FR-40..FR-51 pass |
| **M5 – Polish** | Arc animations, sounds, haptics, seal effects, confetti, symbols, dark mode | FR-60..FR-66 pass; feels great |
| **M6 – PWA & a11y** | Offline, install, keyboard/screen reader, Lighthouse ≥ 95 | NFR-A*, FR-70..72 pass |
| **M7 – Launch** | Deploy, README, screenshots, licence files | Public URL works on iOS + Android |
| **M8 (optional)** | Hints (FR-55), drag-and-drop (FR-14) | P2 items |

---

## 15. QA Acceptance Checklist (v1.0)

**Rules**
- [ ] A bubble can only land on an empty tube or the same colour; never on a full tube or different colour.
- [ ] Only the top bubble moves; source ≠ destination.
- [ ] Win triggers exactly when every tube is empty or full-and-single-colour.
- [ ] Undo returns the bubble to the exact origin; max 5 per level; restart resets the allowance.
- [ ] "No moves left" appears only when there truly is no legal move.

**Levels**
- [ ] All 36 levels are solvable (CI solver).
- [ ] Tier specs match (5/7/9 tubes, 3/5/7 colours, 2 empty tubes, 12 levels each).
- [ ] Levels get harder within each tier; none starts solved.

**Controls**
- [ ] Every row of the FR-11 tap matrix behaves as specified.
- [ ] Rapid tapping during animations never breaks state.

**Progress & persistence**
- [ ] Unlocking is sequential per tier; stars/best moves persist; reload keeps everything.
- [ ] Reset progress works after confirmation. App works with storage disabled.

**Mobile**
- [ ] 320 px (small phone) to tablet: nothing overflows, all tubes visible, targets ≥ 48 px.
- [ ] Portrait and landscape both work; safe areas respected; no page scroll or zoom-on-tap.
- [ ] Installable; works offline in airplane mode after first load.

**Accessibility**
- [ ] Complete a level with keyboard only. Screen reader announces moves and results.
- [ ] Symbol mode makes all 7 colours distinguishable without colour.
- [ ] Reduced motion removes arcs, shakes, and confetti.

---

## 16. Roadmap (post v1.0, P2)
- Hints and "auto-solve" using the in-browser solver.
- Daily challenge (seeded by date) and endless mode using the generator at runtime.
- More tiers (extra colours/tubes), "extra tube" power-ups, varying tube capacities.
- Themes and bubble skins; ambient music (optional).
- Share-result button (Web Share API); localisation.
- Optional publishing to game portals (e.g. CrazyGames) via their SDK; this is a later step and not part of the open-source core.

---

## 17. Open Decisions (defaults chosen; change if you disagree or the reference differs)
1. **Tube capacity = 4** bubbles.
2. **One bubble per move** (vs. moving all same-colour top bubbles at once).
3. **Sequential unlock** within each tier (vs. all levels open).
4. **Stars/par** and **hints** are our additions.
5. **Framework:** React + TypeScript + Framer Motion (see Architecture.md). Alternative: PixiJS for heavier effects.
6. **Final brand name and logo.**
