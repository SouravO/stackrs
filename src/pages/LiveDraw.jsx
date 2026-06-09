import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Users, Play, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const PARTICIPANTS_PER_GROUP = 20;

const generateParticipants = () => {
  return Array.from({ length: 200 }, (_, i) => ({
    id: `STK-001-${String(i + 1).padStart(3, '0')}`,
    number: i + 1,
  }));
};

const groupParticipants = (participants) => {
  const groups = [];
  for (let i = 0; i < participants.length; i += PARTICIPANTS_PER_GROUP) {
    groups.push({
      label: `${String(i + 1).padStart(3, '0')} - ${String(Math.min(i + PARTICIPANTS_PER_GROUP, participants.length)).padStart(3, '0')}`,
      items: participants.slice(i, i + PARTICIPANTS_PER_GROUP),
    });
  }
  return groups;
};

const LiveDraw = () => {
  const [participants] = useState(generateParticipants);
  const [groups] = useState(() => groupParticipants(participants));
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

  useEffect(() => {
    if (!winner) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 80,
        origin: { x: 0, y: 0.7 },
        colors: ['#f9bb1a', '#ffda6a', '#ffffff', '#f59e0b'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 80,
        origin: { x: 1, y: 0.7 },
        colors: ['#f9bb1a', '#ffda6a', '#ffffff', '#f59e0b'],
      });

      if (Date.now() < end) requestAnimationFrame(frame);
    };

    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f9bb1a', '#ffda6a', '#ffffff', '#f59e0b', '#f97316'],
    });

    frame();
  }, [winner]);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
            <Trophy className="w-3.5 h-3.5" /> Live Draw
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Stackr <span className="text-[#f9bb1a]">Live Draw</span>
          </h1>
          <p className="text-white/50 mt-2 text-sm">Circle #001 &middot; 200 Members</p>
        </div>

        {/* Draw Section */}
        <div className="max-w-lg mx-auto mb-10">
          <div className="bg-[#121c31] rounded-3xl border border-white/5 p-6 md:p-8 flex flex-col items-center">
            <div className="text-xs font-bold tracking-widest uppercase text-white/30 mb-4">
              {isSpinning ? 'SELECTING...' : winner ? 'WINNER' : 'PRESS START'}
            </div>

            <motion.div
              animate={{
                scale: winner ? [1, 1.08, 1] : 1,
              }}
              transition={{ duration: 0.5 }}
              className="text-4xl sm:text-5xl md:text-6xl font-mono font-black tracking-wider text-center mb-4 h-20 md:h-24 flex items-center justify-center"
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
                className="flex flex-col items-center gap-1 mb-2"
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
            className={`w-full mt-4 py-4 rounded-2xl font-bold text-base tracking-wide flex items-center justify-center gap-3 transition-all ${
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

        {/* Participants Section */}
          <div className="bg-[#121c31] rounded-3xl border border-white/5">
          <div className="flex items-center justify-between px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold tracking-wider uppercase text-white/60">Participants</h2>
            </div>
            <span className="text-xs font-mono text-white/30">{participants.length} IDs</span>
          </div>
          <div className="overflow-y-auto max-h-[420px] px-6 pb-5">
            {groups.map((group) => (
              <div key={group.label} className="mb-4 last:mb-0">
                <div className="text-[10px] font-mono font-bold text-white/20 tracking-wider mb-2 uppercase">
                  {group.label}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 gap-2">
                  {group.items.map((p) => {
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
                        className="p-2 rounded-xl border text-center relative overflow-hidden"
                      >
                        {isWinner && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full flex items-center justify-center"
                          >
                            <Trophy className="w-2.5 h-2.5 text-black" />
                          </motion.div>
                        )}
                        <div className="text-[10px] font-mono font-bold text-white/80 leading-tight">{p.id}</div>
                        <div className={`text-[8px] mt-0.5 font-mono ${
                          isWinner
                            ? 'text-amber-400'
                            : isHighlighted && isSpinning
                              ? 'text-amber-300/70'
                              : 'text-white/30'
                        }`}>
                          {isWinner ? '★ WINNER' : isHighlighted && isSpinning ? '● SELECTING' : '○'}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveDraw;
