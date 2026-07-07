'use client';
import { useEffect, useRef, useState } from 'react';

export default function SuperBreakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('menu'); // 'menu', 'playing', 'win', 'over'

  const game = useRef({
    ball: { x: 400, y: 300, dx: 2, dy: 2, size: 10 },
    paddle: { x: 350, w: 100, h: 10 },
    bricks: [] as any[],
    mouseX: 400,
    hue: 0,
    rainbowTimer: 0,
  });

  const playSound = (src: string) => {
    const audio = new Audio(src);
    audio.play().catch(() => {});
  };

  const addLevel = () => {
    // Move existing blocks down
    game.current.bricks.forEach(b => { if (b.active) b.y += 40; });
    
    // Add new row at the top (spawned at y: 40)
    for (let c = 0; c < 8; c++) {
      const isYellow = Math.random() > 0.85;
      game.current.bricks.push({ 
        x: c * 90 + 50, 
        y: 40, 
        w: 80, 
        h: 20, 
        type: isYellow ? 'yellow' : 'blue', 
        active: true 
      });
    }
  };

  const initGame = () => {
    game.current.bricks = [];
    // Start with 4 rows of bricks
    for(let i = 0; i < 4; i++) addLevel();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    initGame();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      game.current.mouseX = e.clientX - rect.left;
    };
    window.addEventListener('mousemove', handleMouseMove);

    function loop() {
      const g = game.current;

      // WIN CONDITION: Check if all bricks are inactive
      if (g.bricks.length > 0 && g.bricks.every(b => !b.active)) {
        playSound('/win.wav');
        setGameState('win');
        return;
      }
      
      const speedMult = g.rainbowTimer > 0 ? 2.2 : 1.5;
      g.ball.x += g.ball.dx * speedMult;
      g.ball.y += g.ball.dy * speedMult;
      g.paddle.x = g.mouseX - g.paddle.w / 2;

      // Wall and Paddle collisions
      if (g.ball.x <= 0 || g.ball.x >= canvas.width) { g.ball.dx *= -1; playSound('/bounce.wav'); }
      if (g.ball.y <= 0) { g.ball.dy *= -1; playSound('/bounce.wav'); }
      if (g.ball.y + g.ball.size >= 560 && g.ball.x >= g.paddle.x && g.ball.x <= g.paddle.x + g.paddle.w) {
        g.ball.dy = -Math.abs(g.ball.dy);
        playSound('/bounce.wav');
      }

      // Brick collisions
      g.bricks.forEach(b => {
        if (b.active && g.ball.x > b.x && g.ball.x < b.x + b.w && g.ball.y > b.y && g.ball.y < b.y + b.h) {
          b.active = false;
          g.ball.dy *= -1;
          playSound('/break.wav');
          
          if (b.type === 'yellow') {
            g.rainbowTimer = 300;
            setScore(s => s + 50);
          } else { 
            setScore(s => s + 10); 
          }
        }
      });

      // Game Over / Add Level
      if (g.ball.y > canvas.height) {
        if (g.bricks.some(b => b.active && b.y > 520)) { 
          setGameState('over'); 
          playSound('/lose.wav');
          return;
        }
        else { addLevel(); g.ball.x = 400; g.ball.y = 300; g.rainbowTimer = 0; }
      }

      // Render
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      g.bricks.forEach(b => { if (b.active) { ctx.fillStyle = b.type === 'yellow' ? 'yellow' : 'blue'; ctx.fillRect(b.x, b.y, b.w, b.h); } });
      ctx.fillStyle = 'white';
      ctx.fillRect(g.paddle.x, 560, g.paddle.w, g.paddle.h);
      
      if (g.rainbowTimer > 0) { g.hue = (g.hue + 5) % 360; ctx.fillStyle = `hsl(${g.hue}, 100%, 50%)`; g.rainbowTimer--; } 
      else { ctx.fillStyle = 'white'; }
      ctx.fillRect(g.ball.x, g.ball.y, g.ball.size, g.ball.size);
      
      requestAnimationFrame(loop);
    }
    const frameId = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(frameId); window.removeEventListener('mousemove', handleMouseMove); };
  }, [gameState]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 font-mono">
      <div className="relative overflow-hidden border-4 border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]">
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-20" />
        
        {gameState !== 'playing' && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black bg-opacity-80">
            <h1 className="text-6xl font-black text-white mb-8 tracking-widest uppercase">
              {gameState === 'win' ? 'YOU WIN!' : gameState === 'over' ? 'GAME OVER' : 'SUPER BREAKOUT'}
            </h1>
            <button onClick={() => { setGameState('playing'); setScore(0); initGame(); }} className="px-8 py-4 bg-white text-black font-bold text-2xl hover:bg-gray-300">
              {gameState === 'menu' ? 'PLAY' : 'RESTART'}
            </button>
          </div>
        )}
        
        <canvas ref={canvasRef} width={800} height={600} className="bg-black block" />
      </div>
      <h1 className="mt-4 text-white text-2xl">Score: {score}</h1>
    </div>
  );
}
