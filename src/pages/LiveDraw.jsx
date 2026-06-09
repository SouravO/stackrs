import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Play, RotateCcw, Sparkles } from 'lucide-react';

const generateParticipants = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: `STK-001-${String(i + 1).padStart(3, '0')}`,
    number: i + 1,
  }));
};

const LiveDraw = () => {
  const [participants] = useState(generateParticipants);
  const [displayNumber, setDisplayNumber] = useState('???');
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningHighlight, setSpinningHighlight] = useState(null);
  const spinRef = useRef(null);
  const spinningRef = useRef(false);

  useEffect(() => {
    return () => {
      if (spinRef.current) clearTimeout(spinRef.current);
    };
  }, []);

  const startDraw = useCallback(() => {
    if (spinningRef.current) return;
    spinningRef.current = true;

    setIsSpinning(true);
    setWinner(null);
    setDisplayNumber('???');
    setSpinningHighlight(null);

    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winningParticipant = participants[winnerIndex];

    let spinCount = 0;
    const totalSpins = 35 + Math.floor(Math.random() * 15);

    const doSpin = () => {
      if (spinCount < totalSpins) {
        const randomIdx = Math.floor(Math.random() * participants.length);
        setDisplayNumber(participants[randomIdx].id);
        setSpinningHighlight(participants[randomIdx].number);

        spinCount++;
        const progress = spinCount / totalSpins;
        const delay = 40 + progress * progress * 360;

        spinRef.current = setTimeout(doSpin, delay);
      } else {
        setDisplayNumber(winningParticipant.id);
        setWinner(winningParticipant);
        setSpinningHighlight(winningParticipant.number);
        setIsSpinning(false);
        spinningRef.current = false;
      }
    };

    doSpin();
  }, [participants]);

  return (
    <div className="bg-[#0a1120] text-white min-h-screen font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4">
            <Trophy className="w-4 h-4" /> Live Draw
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Stackr <span className="text-[#f9bb1a]">Live Draw</span>
          </h1>
          <p className="text-white/50 mt-3 text-sm">Circle #001 | 20 Members</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-[#121c31] rounded-3xl border border-white/5 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-white/60">Participants</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {participants.map((p) => {
                const isWinner = winner?.number === p.number;
                const isHighlighted = spinningHighlight === p.number;
                return (
                  <motion.div
                    key={p.number}
                    animate={{
                      scale: isWinner ? 1.05 : 1,
                      borderColor: isWinner
                        ? '#f9bb1a'
                        : isHighlighted && isSpinning
                          ? 'rgba(249,187,26,0.5)'
                          : 'rgba(255,255,255,0.05)',
                      backgroundColor: isWinner
                        ? 'rgba(249,187,26,0.15)'
                        : isHighlighted && isSpinning
                          ? 'rgba(249,187,26,0.08)'
                          : 'rgba(0,0,0,0.2)',
                    }}
                    className="p-3 rounded-xl border text-center relative overflow-hidden"
                  >
                    {isWinner && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center"
                      >
                        <Trophy className="w-3 h-3 text-black" />
                      </motion.div>
                    )}
                    <div className="text-xs font-mono font-bold text-white/80">{p.id}</div>
                    <div className={`text-[10px] mt-1 font-mono ${
                      isWinner
                        ? 'text-amber-400'
                        : isHighlighted && isSpinning
                          ? 'text-amber-300/70'
                          : 'text-white/30'
                    }`}>
                      {isWinner ? '★ WINNER' : isHighlighted && isSpinning ? '◉ SELECTING' : '○ PENDING'}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-[#121c31] rounded-3xl border border-white/5 p-8 flex flex-col items-center">
              <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-6">
                {isSpinning ? 'SELECTING...' : winner ? 'WINNER' : 'PRESS START'}
              </div>

              <motion.div
                animate={{
                  scale: winner ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5 }}
                className="text-5xl md:text-6xl lg:text-7xl font-mono font-black tracking-wider text-center mb-4 h-28 flex items-center justify-center"
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={displayNumber}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.07 }}
                    className={winner ? 'text-[#f9bb1a] drop-shadow-[0_0_30px_rgba(249,187,26,0.5)]' : 'text-white'}
                  >
                    {displayNumber}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {winner && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, type: "spring" }}
                  className="flex flex-col items-center gap-2 mt-2"
                >
                  <div className="text-2xl font-black text-[#f9bb1a]">₹50,000</div>
                  <p className="text-xs text-white/40">Prize Amount</p>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={!isSpinning ? { scale: 1.02 } : {}}
              whileTap={!isSpinning ? { scale: 0.98 } : {}}
              onClick={startDraw}
              disabled={isSpinning}
              className={`w-full py-5 rounded-2xl font-bold text-lg tracking-wide flex items-center justify-center gap-3 transition-all ${
                isSpinning
                  ? 'bg-white/5 text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30'
              }`}
            >
              {isSpinning ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Drawing...
                </>
              ) : winner ? (
                <>
                  <RotateCcw className="w-5 h-5" />
                  Draw Again
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Start Draw
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDraw;
