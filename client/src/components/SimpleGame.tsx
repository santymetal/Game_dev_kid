import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";

interface SimpleGameProps {
  gameCode: string;
  gameType: string;
  config: any;
  onBack: () => void;
}

export default function SimpleGame({ gameCode, gameType, config, onBack }: SimpleGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameInstanceRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();
  const [gameReady, setGameReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize the game
    try {
      // Create a function from the game code
      const gameFunction = new Function('return (' + gameCode + ')')();
      gameInstanceRef.current = gameFunction;
      setGameReady(true);

      // Set up event listeners
      const handleKeyDown = (e: KeyboardEvent) => {
        if (gameInstanceRef.current?.game) {
          gameInstanceRef.current.game.keys[e.key] = true;
          e.preventDefault();
        }
      };

      const handleKeyUp = (e: KeyboardEvent) => {
        if (gameInstanceRef.current?.game) {
          gameInstanceRef.current.game.keys[e.key] = false;
          e.preventDefault();
        }
      };

      const handleMouseDown = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (gameInstanceRef.current?.handleMouseDown) {
          gameInstanceRef.current.handleMouseDown(x, y);
        }
        if (gameInstanceRef.current?.handleClick) {
          gameInstanceRef.current.handleClick(x, y);
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (gameInstanceRef.current?.handleMouseMove) {
          gameInstanceRef.current.handleMouseMove(x, y);
        }
      };

      const handleMouseUp = () => {
        if (gameInstanceRef.current?.handleMouseUp) {
          gameInstanceRef.current.handleMouseUp();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);

      // Game loop
      const gameLoop = () => {
        if (gameInstanceRef.current) {
          // Update game state
          if (gameInstanceRef.current.update) {
            gameInstanceRef.current.update();
          }
          
          // Render game
          if (gameInstanceRef.current.render) {
            gameInstanceRef.current.render(ctx, canvas);
          }
        }
        
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      };

      gameLoop();

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };

    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, [gameCode]);

  const restartGame = () => {
    // Reset the game by re-running the initialization
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const gameFunction = new Function('return (' + gameCode + ')')();
      gameInstanceRef.current = gameFunction;
    } catch (error) {
      console.error('Error restarting game:', error);
    }
  };

  return (
    <div className="relative">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="game-canvas w-full max-w-2xl mx-auto block"
        tabIndex={0}
      />
      
      {/* Game Controls */}
      <div className="flex justify-center gap-4 mt-4">
        <Button
          onClick={onBack}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Preview
        </Button>
        
        <Button
          onClick={restartGame}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Restart Game
        </Button>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4">
        <div className="bg-white/80 rounded-lg p-3 inline-block">
          <h5 className="font-bold text-sm text-gray-700 mb-1">How to Play:</h5>
          <div className="text-xs text-gray-600">
            {gameType === 'puzzle' && 'Click on cards to flip them and find matches!'}
            {gameType === 'creative' && 'Click and drag to draw! Select colors at the bottom.'}
            {gameType !== 'puzzle' && gameType !== 'creative' && 'Use arrow keys to move, space to jump!'}
          </div>
        </div>
      </div>

      {!gameReady && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-2">🎮</div>
            <p className="text-gray-600">Loading your game...</p>
          </div>
        </div>
      )}
    </div>
  );
}
