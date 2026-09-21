# Project: Bubble Sort Cyberpunk 2099 (Future-Tech Visual Upgrade)

## 1. Project Overview & Vision

**Bubble Sort Cyberpunk 2099** is a premium, high-tech evolution of the classic color sorting puzzle game. While preserving 100% of the proven game logic, mechanics, level progression, and mobile-first ergonomics specified in `PRD.md` and `Architecture.md`, the visual presentation and experiential feel are elevated to an ultra-luxury futuristic arcade console in the year 2099.

### Key Tenets
1. **Uncompromised Core Gameplay**: Keep the exact mechanics, tube capacities (C=4), 3 difficulty tiers (Easy 5 tubes/3 colours, Medium 7 tubes/5 colours, Hard 9 tubes/7 colours), 5-undo allowance, solver-verified levels, and fluid single-hand tap interactions.
2. **Future-Tech Cyberpunk Aesthetic**:
   - **Environment**: Deep black / ultra-dark ambient void with fine digital grid lines, subtle scanlines, faint micro-circuitry, and soft indigo/blue atmospheric radiance.
   - **Digital Lighting & Emission**: True luminous radiance (bright electric cyan `#00F0FF`, neon blue `#0070F3`, deep violet `#7928CA`, controlled magenta `#FF0080`, plasma white highlights `#FFFFFF`, energetic cyber gold `#F5A623`).
   - **Materials & Finishes**: Smoked dark glass, polished futuristic metal edges, holographic HUD panels, specular rim highlights, subtle light spill, and glass reflections.
   - **Containment Cylinders**: Tubes styled as illuminated energy containment silos with luminous guide rails, laser graduation notches, glass tube reflections, and glowing energy seal caps upon completion.
   - **Plasma Energy Orbs (Bubbles)**: Luminous cores, high-specular glossy finishes, internal plasma gradient dynamics, distinct chromatic identity, and crisp holographic colorblind symbols.
   - **Hardware Interface & Buttons**: Tactile dark glass keys with illuminated laser-cut borders, energetic hover/active blooms, and haptic feedback.
   - **Futuristic Display Typography**: Sharp, clean geometric typography (Rajdhani / Orbitron / Inter / Exo 2) with subtle digital luminescence.
   - **Sound & Haptics**: High-fidelity synthesized Web Audio soundscape (resonant laser pops, frequency sweeps, plasma hums, harmonic energy chimes) and mobile vibration ticks.

---

## 2. Technical Architecture Summary

- **Framework**: React 18 + TypeScript (Strict)
- **Build Tool**: Vite (Lightning fast HMR & optimized production bundle < 200 KB)
- **State Management**: Zustand with versioned `localStorage` persistence
- **Visual Engine**: HTML5 / SVG / CSS3 Custom Properties with hardware-accelerated transforms & Motion (Framer Motion / WAAPI fallback)
- **Audio Engine**: Pure Web Audio API synthesiser (Zero external audio assets; pitch sweeps, resonating bandpass filters, harmonic chord synthesizers)
- **Level Engine & Solver**: Deterministic A* solver & generator (Build-time verified 36 levels in `data/levels.json`, Web Worker runtime hints)
- **Accessibility & PWA**: ARIA live regions, keyboard navigation (`Tab`, `Arrows`, `Enter`, `U`, `R`), high-contrast symbol overlays, offline Workbox service worker.

---

## 3. Scope & Boundaries

- **In Scope**:
  - Full implementation of all functional requirements (`FR-1` to `FR-96`).
  - Full non-functional accessibility and performance specifications (`NFR-A1`..`NFR-A6`, `NFR-P1`..`NFR-P3`, `NFR-R1`..`NFR-R3`).
  - Complete 36-level dataset verified solvable by automated A* pipeline.
  - Complete Cyberpunk 2099 Future-Tech visual design system and custom audio synthesiser.
  - PWA offline manifest and caching.
- **Out of Scope (v1.0)**:
  - Backend servers, user accounts, ads, monetisation.
  - Heavy 3D engines (WebGL/Three.js) that would compromise battery, load speed, or mobile performance.
