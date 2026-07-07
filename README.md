# Super Breakout

An arcade-style, retro-inspired game built with **React**, **TypeScript**, and the **HTML5 Canvas API**. This project brings the classic brick-breaking gameplay to your browser with modern web technologies, featuring a CRT aesthetic, rainbow power-ups, and level-based progression.

## 🚀 Features

* **Retro Aesthetics**: Immersive CRT scanline effect with 8-bit inspired visuals.
* **Dynamic Gameplay**: 
    * **Blue Blocks**: Standard scoring bricks.
    * **Yellow Blocks**: Rare power-up bricks that trigger "Rainbow Mode" for 5 seconds (increased speed + visual flair).
    * **Red Blocks**: The win condition! Destroy all 5 top-row red bricks to win.
* **Procedural Difficulty**: Levels grow as you play. If you miss the ball, the bricks descend; if they reach the bottom, it's Game Over.
* **Responsive Controls**: Smooth mouse-based paddle movement with a "teleporting" reset mechanic upon losing a life.
* **Sound Effects**: Integrated audio feedback for bounces, breaks, and losses.

## 🛠️ Tech Stack

* **Framework**: [Next.js](https://nextjs.org/) (React)
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Rendering**: HTML5 Canvas API
* **Language**: TypeScript

## 🎮 How to Play

1.  **Clone the repository**: `git clone <repository-url>`
2.  **Install dependencies**: `npm install`
3.  **Run the development server**: `npm run dev`
4.  **Open in Browser**: Navigate to `http://localhost:3000`.
5.  **Controls**: Move your **mouse** to control the paddle. Click the **"PLAY"** button on the splash screen to start.

## 🎵 Sound Setup
To enable audio, add your `.wav` or `.mp3` files into the `/public` directory:
- `bounce.wav`
- `break.wav`
- `lose.wav`

## 🏗️ Architecture

The game runs on a `requestAnimationFrame` loop that updates at 60FPS. 
* **Game State**: Managed via `useRef` to ensure high-performance updates without triggering unnecessary React re-renders.
* **Render Pipeline**: Uses the `canvas` 2D context to draw bricks, the paddle, and the ball, with HSL color cycling for the "Rainbow Mode" effect.

## 📜 License
This project is open-source and free to play. Enjoy the challenge!
