# Snake, Water, Gun — Ultimate Edition

A cyber-arcade web game inspired by the traditional Indian hand game (and classic Rock-Paper-Scissors). Built with modern React 19, TypeScript, Tailwind CSS, and the Web Audio API for a fast, responsive, zero-dependency gaming experience.

---

## 🎮 The Elemental Combat Triangle

| Weapon | Defeats | Outcome Lore |
| :--- | :--- | :--- |
| **🐍 Snake** | **💧 Water** | Snake effortlessly consumes and drinks water to thrive |
| **💧 Water** | **🔫 Gun** | Torrential water douses gunpowder and floods the firing barrel |
| **🔫 Gun** | **🐍 Snake** | High-velocity projectile neutralizes the serpent from a distance |
| **Identical** | **Identical** | Synchronized standoff (Draw) with zero damage/points awarded |

---

## ✨ Features

- **Cyber-Arcade Aesthetic**: Dark neon theme with custom glowing emerald, cyan, and purple accents.
- **Bespoke Vector Graphics**: Handcrafted SVG emblems with dynamic gradient shaders, fangs, cresting water waves, and plasma railgun vents.
- **Synthesized Web Audio Engine**: Zero external audio downloads. Real-time procedural sound effects for snake hisses, water splashes, laser blasts, countdown ticks, and victory fanfares. Includes volume control and instant mute toggle (`[M]`).
- **4 Distinct Game Modes**:
  - **Quick Play**: Endless round-by-round skirmishes to test and push your win streak.
  - **Best of 5**: Tournament format where the first combatant to claim 3 wins takes the match.
  - **Best of 10**: Tactical endurance marathon capped at 10 rounds.
  - **Practice Mode**: Sandbox zone where you can experiment without affecting career statistics.
- **Adaptive AI Difficulties**:
  - **Easy**: Uniform random choice.
  - **Medium**: Reactive counter-picker with subtle human-like bias.
  - **Hard (Markov Predictor)**: Neural-inspired state transition matrix that models your previous moves and counters predicted tendencies.
- **Comprehensive Career Statistics & History**:
  - Tracks total matches, wins, losses, draws, win percentage (excluding draws), and win streaks.
  - Choice distribution breakdown (Snake % vs Water % vs Gun %).
  - Full round-by-round match history log with timestamps and combat explanations.
  - Saved automatically to browser `localStorage` with a safe reset confirmation dialog.
- **Celebratory Confetti**: Multi-stage burst confetti when winning tournament matches.
- **Keyboard Hotkeys**:
  - `[1]` or `[S]`: Select Snake
  - `[2]` or `[W]`: Select Water
  - `[3]` or `[G]`: Select Gun
  - `[Enter]` or `[Space]`: Start / Advance
  - `[M]`: Mute / Unmute audio
  - `[R]`: Restart match
  - `[Esc]`: Close active modal

---

## 🚀 Running the Game Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18+ recommended)
- `npm` (bundled with Node.js)

### Installation & Launch

1. Clone or download the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Running Unit Tests
The core rules, mode win conditions, AI behaviors, and statistics math are tested using Node's built-in test runner:
```bash
npx --yes tsx --test src/game/rules.test.ts
```

### Production Build
To create a production-optimized bundle:
```bash
npm run build
```
The output files will be in the `dist/` directory.

---

## 🌐 Publishing to GitHub Pages

You can host and share this game for free on GitHub Pages:

### Step 1: Configure `vite.config.ts` Base Path
If your repository is named `snake-water-gun`, set the `base` in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/snake-water-gun/', // replace with your repo name
  // ... plugins
});
```
*(If using a custom domain or user page `<username>.github.io`, set `base: '/'`)*.

### Step 2: Add GitHub Actions Deployment Workflow
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run logic unit tests
        run: npx --yes tsx --test src/game/rules.test.ts

      - name: Build project
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Step 3: Enable GitHub Pages in Repo Settings
1. Go to your repository on GitHub.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, choose **GitHub Actions**.
4. Push your changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Deploy Snake Water Gun Ultimate Edition"
   git push origin main
   ```
5. Your game will be live at:
   `https://<your-username>.github.io/<repository-name>/`

---

## 🛡️ License
Apache-2.0
