import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FunkyShatterHero = ({ onComplete }) => {
  const colors = {
    yellow: '#f9bb1a',
    orange: '#f79e27',
    deepOrange: '#ef6925',
    red: '#e72132',
    teal: '#1da89d',
    lime: '#a5cb3a',
    darkSlate: '#43646b'
  };

  const [phase, setPhase] = useState('initial');

  useEffect(() => {
    // Slower timing to appreciate the H coming down
    const slamTimer = setTimeout(() => setPhase('slam'), 1200);
    const shatterTimer = setTimeout(() => setPhase('shatter'), 3200);
    const completeTimer = setTimeout(onComplete, 4500);

    return () => {
      clearTimeout(slamTimer);
      clearTimeout(shatterTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const textStyle = {
    textShadow: `6px 6px 0px ${colors.darkSlate}`,
    color: colors.yellow,
    display: 'inline-block'
  };

  // Spark Component for the impact moment
  const ImpactSpark = () => (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 1.5, 0], 
            x: Math.cos(i * 30) * 150, 
            y: Math.sin(i * 30) * 150,
            rotate: 45 
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute w-2 h-8 rounded-full"
          style={{ backgroundColor: colors.yellow, boxShadow: `0 0 15px ${colors.yellow}` }}
        />
      ))}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 z-[1000] flex items-center justify-center overflow-hidden select-none"
      style={{ backgroundColor: colors.red }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-20">
         {/* Simplified background for focus on main action */}
         <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} 
            className="absolute -top-20 -left-20 w-96 h-96 border-[40px] border-teal-500 rounded-full" />
      </div>

      <div className="relative flex items-center justify-center z-10">
        <AnimatePresence>
          {phase !== 'shatter' ? (
            <motion.div key="word" className="flex items-center">
              <div className="relative w-[15vw] h-[18vw] flex items-center justify-center">
                
                {/* Z - THE TARGET */}
                <motion.span
                  animate={phase === 'slam' ? { 
                    y: 1000, 
                    rotate: 45, 
                    opacity: 0,
                    filter: 'blur(5px)'
                  } : { y: 0 }}
                  transition={{ duration: 0.8, ease: [0.36, 0, 0.66, -0.56] }} // Accelerates away
                  className="absolute text-[18vw] font-[1000] italic"
                  style={textStyle}
                >
                  Z
                </motion.span>

                {/* H - THE SLAMMER */}
                <motion.span
                  initial={{ y: -1000, opacity: 0 }}
                  animate={phase === 'slam' ? { 
                    y: 0, 
                    opacity: 1,
                    scale: [1, 1, 0.9, 1], // Impact compression
                  } : { y: -1000, opacity: 1 }}
                  transition={{ 
                    y: { duration: 1.2, ease: "easeIn" }, // Slower, weighted fall
                    scale: { duration: 0.2, delay: 1.2 } 
                  }}
                  className="absolute text-[18vw] font-[1000] italic"
                  style={textStyle}
                >
                  H
                </motion.span>

                {/* THE SPARK - Triggers on impact */}
                {phase === 'slam' && <ImpactSpark />}
              </div>

              {/* ERO LETTERS - Jiggle on impact */}
              <div className="flex -ml-4">
                {"ERO".split("").map((letter, i) => (
                  <motion.span
                    key={i}
                    animate={phase === 'slam' ? { 
                        y: [0, -40, 0],
                        rotate: [0, -5, 0] 
                    } : {}}
                    transition={{ delay: 1.2 + (i * 0.05), duration: 0.3 }}
                    className="text-[18vw] font-[1000] italic"
                    style={textStyle}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ) : (
            /* SHATTER DEBRIS */
            <div className="relative">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1 }}
                  animate={{
                    x: (Math.random() - 0.5) * 1800,
                    y: (Math.random() - 0.5) * 1200,
                    rotate: Math.random() * 720,
                    scale: 0,
                    opacity: 0
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-8 h-8"
                  style={{ 
                    backgroundColor: Object.values(colors)[i % 6],
                    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' // Shard shapes
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FunkyShatterHero;