import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, X, RotateCcw, Trophy, Zap } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const GAME_SPEED = 150;

const SnakeGame = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef(null);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake(prevSnake => {
      const newHead = {
        x: prevSnake[0].x + direction.x,
        y: prevSnake[0].y + direction.y
      };

      // Check collision with walls
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, isOpen]);

  useEffect(() => {
    if (!isOpen || gameOver || isPaused) return;

    gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoopRef.current);
  }, [isOpen, moveSnake, gameOver, isPaused]);

  return (
    <>
      {/* Game Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-20 md:bottom-8 md:right-28 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-[#ef6925] to-[#e1ff00] rounded-full flex items-center justify-center text-black shadow-2xl shadow-orange-500/50 border-2 border-black"
        whileHover={{ scale: 1.1, rotate: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Gamepad2 size={28} />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-[#e1ff00] border-2 border-black rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        />
      </motion.button>

      {/* Game Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed inset-0 md:inset-auto md:bottom-8 md:right-28 z-50 bg-black border-0 md:border-4 border-[#ef6925] md:shadow-[15px_15px_0px_0px_rgba(239,105,37,1)] overflow-hidden"
            style={{ width: typeof window !== 'undefined' && window.innerWidth < 768 ? '100vw' : GRID_SIZE * CELL_SIZE + 40, height: typeof window !== 'undefined' && window.innerWidth < 768 ? '100vh' : GRID_SIZE * CELL_SIZE + 180 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#ef6925] to-[#e1ff00] p-3 flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-black rounded-sm flex items-center justify-center">
                  <Gamepad2 className="text-[#e1ff00]" size={20} />
                </div>
                <div>
                  <h3 className="font-black text-black text-sm uppercase">Snake Protocol</h3>
                  <p className="text-[8px] text-black/70 font-mono font-bold">SYSTEM_ACTIVE</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-black hover:bg-black hover:text-[#e1ff00] rounded-sm p-1 transition-colors border-2 border-black"
              >
                <X size={16} />
              </button>
            </div>

            {/* Score Display */}
            <div className="bg-black border-b-2 border-[#ef6925] p-2 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#e1ff00]" />
                <span className="font-mono text-[10px] text-[#e1ff00] font-bold">SCORE: {score}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy size={14} className="text-[#ef6925]" />
                <span className="font-mono text-[10px] text-white font-bold">BEST: {highScore}</span>
              </div>
              <button
                onClick={resetGame}
                className="bg-[#ef6925] text-black p-1 hover:bg-[#e1ff00] transition-colors rounded-sm"
                title="Reset Game"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            {/* Game Board */}
            <div className="p-5 bg-black relative">
              <div 
                className="bg-zinc-900 border-2 border-[#ef6925]/30 relative"
                style={{ 
                  width: GRID_SIZE * CELL_SIZE, 
                  height: GRID_SIZE * CELL_SIZE,
                  backgroundImage: 'linear-gradient(rgba(239, 105, 37, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(239, 105, 37, 0.1) 1px, transparent 1px)',
                  backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                }}
              >
                {/* Snake */}
                {snake.map((segment, index) => (
                  <motion.div
                    key={index}
                    className={`absolute ${index === 0 ? 'bg-[#e1ff00] border-2 border-black' : 'bg-[#ef6925] border border-black'}`}
                    style={{
                      left: segment.x * CELL_SIZE,
                      top: segment.y * CELL_SIZE,
                      width: CELL_SIZE - 2,
                      height: CELL_SIZE - 2
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  />
                ))}

                {/* Food */}
                <motion.div
                  className="absolute bg-white border-2 border-[#e1ff00] rounded-sm"
                  style={{
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                    width: CELL_SIZE - 2,
                    height: CELL_SIZE - 2
                  }}
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                />

                {/* Game Over Overlay */}
                <AnimatePresence>
                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center border-4 border-[#e1ff00]"
                    >
                      <h2 className="text-4xl font-black text-[#ef6925] mb-2 uppercase italic">System</h2>
                      <h2 className="text-4xl font-black text-white mb-4 uppercase italic">Crashed!</h2>
                      <p className="text-[#e1ff00] font-mono text-sm mb-4">FINAL_SCORE: {score}</p>
                      <button
                        onClick={resetGame}
                        className="bg-[#e1ff00] text-black font-black px-6 py-3 uppercase flex items-center gap-2 hover:bg-[#ef6925] hover:text-white transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <RotateCcw size={16} />
                        Reboot
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pause Overlay */}
                <AnimatePresence>
                  {isPaused && !gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 flex items-center justify-center"
                    >
                      <div className="text-center">
                        <h3 className="text-2xl font-black text-[#e1ff00] mb-2 uppercase">PAUSED</h3>
                        <p className="text-white font-mono text-xs">Press SPACE to continue</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls Info */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-[#ef6925]/20 border border-[#ef6925] p-2 text-center">
                  <p className="text-[8px] text-white/60 font-mono uppercase mb-1">Movement</p>
                  <p className="text-[10px] text-[#e1ff00] font-bold font-mono">ARROW_KEYS</p>
                </div>
                <div className="bg-[#e1ff00]/20 border border-[#e1ff00] p-2 text-center">
                  <p className="text-[8px] text-white/60 font-mono uppercase mb-1">Pause</p>
                  <p className="text-[10px] text-white font-bold font-mono">SPACEBAR</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SnakeGame;
