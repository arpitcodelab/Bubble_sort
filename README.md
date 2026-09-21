# 🔮 Bubble Sort

A modern, responsive, cyber-luminous color sorting puzzle game built with React, TypeScript, and Vite.

---

## ✨ Features

- **Intuitive Core Gameplay**: 3 Difficulty Tiers (Easy, Medium, Hard) with 36 deterministic, solver-verified solvable levels.
- **Smart Batch Transfer**: Contiguous matching top balls lift and transfer together in a single fluid move.
- **5-Charge Rewind**: Undo past moves with a single tap.
- **Single-Page Entrance**: Clean, minimalist mobile-first entrance with instant Play access.
- **Procedural Web Audio**: Zero-asset procedural synthesizer producing crisp pops, chimes, and victory fanfares.
- **Accessibility**: Full keyboard support, screen-reader live region announcements, and holographic color-blind glyphs.
- **Interactive Cyber Background**: Particle canvas with laser scanlines and interactive touch/pointer reactivity.

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run unit tests
npm test

# Build production bundle
npm run build
```

---

## 🐳 Docker & Render Deployment

### 1. Build and Run via Docker locally
```bash
# Build image
docker build -t bubble-sort .

# Run container
docker run -p 8080:80 bubble-sort
# Open http://localhost:8080
```

### 2. Deploy to Render
This project includes a `Dockerfile` and `render.yaml`:
1. Connect your GitHub repository on [Render](https://render.com/).
2. Create a **New Web Service** and select **Docker** environment (or use **Blueprints** with `render.yaml`).
3. Render will build and deploy the container automatically with full HTTPS and custom domain support on their free tier.

---

## 🌐 GitHub Pages Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`):
1. In your GitHub repository, navigate to **Settings** → **Pages**.
2. Under **Build and deployment** → **Source**, select **GitHub Actions**.
3. Push to `main` branch to automatically trigger build and deployment.
