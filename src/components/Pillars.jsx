import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Trophy, Zap, Activity, Cpu, Skull, Rocket } from 'lucide-react'
import Zero from './Zero';

const pillars = [
  { id: "01", title: "Operations", icon: <Zap />, color: "#F9BB1A", desc: "TERMINAL EXECUTION: No bottlenecks. No friction. Only absolute flow." },
  { id: "02", title: "Technology", icon: <Activity />, color: "#1DA89D", desc: "DIGITAL WARFARE: Systems engineered to dominate the competitive landscape." },
  { id: "03", title: "Finance", icon: <Cpu />, color: "#E72132", desc: "MATH FORCE: Calculated aggression. Scalability baked into the DNA." },
  { id: "04", title: "Strategy", icon: <Skull />, color: "#EF6925", desc: "Learn to build a vision, design winning business models, and make data-backed decisions." },
  { id: "05", title: "Marketing", icon: <Trophy />, color: "#A5CB3A", desc: "Build your brand story, understand audience psychology, and learn growth strategies." },
  { id: "06", title: "Sales", icon: <Rocket />, color: "#43646B", desc: "KINETIC CAPTURE: Converting vision into market dominance instantly." }
];

const KineticPillar = ({ pillar, index }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "start start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? "-100%" : "100%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 === 0 ? -15 : 15, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8, 1], [0.8, 1.05, 1]);

  return (
    <div ref={container} className="h-screen sticky top-0 flex items-center justify-center overflow-hidden pointer-events-none px-2 sm:px-4">
      <motion.div 
        style={{ x, rotate, scale }}
        className="pointer-events-auto relative w-full max-w-4xl h-80 sm:h-100 md:h-120 bg-white text-black shadow-[15px_15px_0px_0px_#000] sm:shadow-[20px_20px_0px_0px_#000] md:shadow-[30px_30px_0px_0px_#000] border-2 sm:border-4 border-black flex"
      >
        {/* Clean Sidebar */}
        <div className="w-12 sm:w-16 md:w-20 flex flex-col items-center justify-between py-4 sm:py-6 md:py-8 border-r-2 sm:border-r-4 border-black" style={{ backgroundColor: pillar.color }}>
          <span className="font-black text-xs sm:text-base md:text-2xl rotate-180 [writing-mode:vertical-lr] tracking-tighter">PILLAR_{pillar.id}</span>
          <div className="p-1 sm:p-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]">
            {React.cloneElement(pillar.icon, { size: 20, strokeWidth: 3, className: 'sm:w-7 sm:h-7' })}
          </div>
        </div>

        {/* Content Area */}
        <div className="grow p-3 sm:p-6 md:p-10 flex flex-col justify-between">
          <div className="relative">
            <div className="flex items-center gap-2 mb-2 sm:mb-4">
               <div className="w-1 h-1 sm:w-2 sm:h-2 bg-black animate-square-pulse" />
               <span className="font-mono text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em]">Protocol_Loaded</span>
            </div>
            <h2 className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-[1000] uppercase tracking-tighter leading-[0.8]">
              {pillar.title}
            </h2>
          </div>

          <div>
            <p className="text-xs sm:text-sm md:text-xl lg:text-2xl font-black uppercase leading-tight max-w-md border-l-4 sm:border-l-8 border-black pl-2 sm:pl-6">
              {pillar.desc}
            </p>
            <div className="mt-3 sm:mt-6 md:mt-8 flex items-center gap-2 sm:gap-4">
              <button className="bg-black text-white px-4 sm:px-8 py-2 sm:py-3 font-black uppercase text-[10px] sm:text-xs hover:bg-[#e72132] transition-colors">
                View Specs
              </button>
              <div className="grow border-b-2 border-black/10" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const Pillars = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  // Background parallax movement for the big numbers
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <div ref={targetRef} className="bg-[#f0f0f0] selection:bg-black selection:text-white relative">
      
      {/* --- EXTERNAL BACKGROUND ELEMENTS (The "White Bag" layer) --- */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Massive Parallax ID Numbers */}
        <motion.div 
          style={{ y: bgY }}
          className="absolute -right-20 top-0 text-[40vw] font-[1000] text-black/4 leading-none flex flex-col"
        >
          {pillars.map((p, idx) => (
            <span key={idx}>{p.id}</span>
          ))}
        </motion.div>

        {/* Vertical Data Ticker */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-black/5">
          <motion.div 
            animate={{ y: [0, -500] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-32 py-10"
          >
            {[...Array(15)].map((_, i) => (
              <span key={i} className="font-mono text-[9px] text-black/20 -rotate-90 origin-left whitespace-nowrap uppercase tracking-widest">
                Startup School
              </span>
            ))}
          </motion.div>
        </div>

        {/* Technical Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-size-[60px_60px]" />
      </div>

      {/* --- INTRO --- */}
      <section className="h-screen flex items-center justify-center bg-black relative z-10 px-4">
        <div className="absolute top-6 sm:top-10 w-full overflow-hidden flex whitespace-nowrap border-y border-white/10 py-2 sm:py-3">
          {[...Array(8)].map((_, i) => (
            <motion.span 
              key={i}
              animate={{ x: [0, -1000] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="text-yellow-300 font-mono text-[10px] sm:text-xs px-6 sm:px-12 tracking-[0.3em] sm:tracking-[0.5em] uppercase"
            >
              March Batch Enrollment Open // Limited Slots
            </motion.span>
          ))}
        </div>
        <motion.div className="text-center">
          <h1 className="text-[12vw] sm:text-[14vw] md:text-[16vw] lg:text-[18vw] font-[1000] text-white leading-none uppercase -tracking-widest">
            CORE<br/><span className="text-[#e72132]">06</span>
          </h1>
        </motion.div>
      </section>

      {/* --- THE STACK --- */}
      <div className="relative z-10">
        {pillars.map((pillar, idx) => (
          <KineticPillar key={idx} pillar={pillar} index={idx} />
        ))}
      </div>

      {/* --- OUTRO --- */}
      <Zero />
    </div>
  )
}

export default Pillars