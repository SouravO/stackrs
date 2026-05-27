import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

export default function EnhancedHero({ onJoinClick, onWatchDrawClick }) {
  const canvasRef = useRef(null);
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const [countdownValues, setCountdownValues] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // --- Live Draw Section States ---
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnTicket, setDrawnTicket] = useState("STK-9482-IN");
  const [recentDraws, setRecentDraws] = useState([
    { id: "STK-1084-IN", status: "Paid", pool: "#093" },
    { id: "STK-7741-IN", status: "Paid", pool: "#092" },
    { id: "STK-3391-IN", status: "Paid", pool: "#091" },
  ]);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 150]);
  const phoneY = useTransform(scrollY, [0, 800], [0, -80]);
  const textY = useTransform(scrollY, [0, 800], [0, 30]);
  const opacityFade = useTransform(scrollY, [0, 400], [1, 0]);

  // Mouse Tracking for 3D Tilt Wrapper & Custom Cursor Glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const cardRotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 100, damping: 20 });
  const cardRotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), { stiffness: 100, damping: 20 });

  function handleMouseMove(e) {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    mouseX.set(clientX - width / 2);
    mouseY.set(clientY - height / 2);
  }

  // Falling Money & Confetti Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 14 + 10,
      speed: Math.random() * 2.5 + 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 2 - 1,
      opacity: Math.random() * 0.4 + 0.2,
      type: Math.random() > 0.4 ? 'rupee' : 'sparkle',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speed;
        p.rotation += p.rotationSpeed;

        if (p.y > height) {
          p.y = -30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;

        if (p.type === 'rupee') {
          ctx.fillStyle = '#f2c12e';
          ctx.font = `bold ${p.size}px sans-serif`;
          ctx.fillText('₹', 0, 0);
        } else {
          ctx.fillStyle = '#fcd96d';
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * (p.size / 2), Math.sin(((18 + i * 72) * Math.PI) / 180) * (p.size / 2));
            ctx.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (p.size / 4), Math.sin(((54 + i * 72) * Math.PI) / 180) * (p.size / 4));
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Live Simulated Lot Selection Engine
  useEffect(() => {
    const triggerLotSelection = () => {
      setIsDrawing(true);
      let counter = 0;
      const interval = setInterval(() => {
        const randomID = `STK-${Math.floor(1000 + Math.random() * 9000)}-IN`;
        setDrawnTicket(randomID);
        counter++;

        if (counter > 15) {
          clearInterval(interval);
          setIsDrawing(false);
          // Push old winner to history board
          setRecentDraws(prev => [
            { id: randomID, status: "Paid", pool: `#09${Math.floor(4 + Math.random() * 5)}` },
            ...prev.slice(0, 2)
          ]);
        }
      }, 120);
    };

    // Auto run the rolling display simulation every 7 seconds
    const loopInterval = setInterval(triggerLotSelection, 7000);
    return () => clearInterval(loopInterval);
  }, []);

  // Auto-slide testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % 3);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate countdown to 10th of next month at 12 PM
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      let targetDate = new Date(now.getFullYear(), now.getMonth(), 10, 12, 0, 0);
      
      if (now > targetDate) {
        targetDate = new Date(now.getFullYear(), now.getMonth() + 1, 10, 12, 0, 0);
      }

      const diff = targetDate - now;
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setCountdownValues({
          days: String(days).padStart(2, '0'),
          hours: String(hours).padStart(2, '0'),
          minutes: String(minutes).padStart(2, '0'),
          seconds: String(seconds).padStart(2, '0')
        });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    }
  };

  const winners = [
    {
      name: "Aravind Sharma",
      location: "Bengaluru",
      amount: "₹50,000",
      cycle: "Pool #082",
      month: "Month 3 Draw",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&fit=crop&auto=format&q=80",
      quote: "Stackr completely changed how I look at chit funds. Transparent, automatic, and I got my payout right when my business needed it."
    },
    {
      name: "Priya Patel",
      location: "Mumbai",
      amount: "₹50,000",
      cycle: "Pool #089",
      month: "Month 2 Draw",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&fit=crop&auto=format&q=80",
      quote: "Super skeptical at first, but watching the provably-fair draw live blew me away. Got the full pool early to clear my college semester dues!"
    },
    {
      name: "Rohan Malhotra",
      location: "Delhi NCR",
      amount: "₹50,000",
      cycle: "Pool #091",
      month: "Month 4 Draw",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&fit=crop&auto=format&q=80",
      quote: "Saving ₹2,000 a month felt effortless. Winning the draw gave me a massive lump sum to upgrade my tech setup without any heavy loans."
    }
  ];

  return (
    <div className="bg-[#010614] overflow-hidden">
      {/* ================= HERO SECTION ================= */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative text-white pt-32 pb-24 px-4 md:px-12 lg:px-20 min-h-screen flex items-center select-none"
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

        <motion.div style={{ y: backgroundY, opacity: opacityFade }} className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c152b_1px,transparent_1px),linear-gradient(to_bottom,#0c152b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.2)_0%,transparent_70%)] blur-[80px]" />
          <div className="absolute top-[20%] right-[-5%] w-[700px] h-[700px] bg-[radial-gradient(circle_at_center,rgba(242,193,46,0.06)_0%,transparent_60%)] blur-[100px]" />
        </motion.div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10 w-full">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ y: textY }} className="lg:col-span-7 text-left flex flex-col justify-center">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full w-fit mb-6 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-widest">Chit Phase IV Now Active</span>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-2 mb-6">
              <div className="bg-[#f2c12e] text-[#02091d] font-black p-2.5 rounded-xl text-2xl tracking-tighter shadow-[0_0_25px_rgba(242,193,46,0.3)] animate-pulse">S</div>
              <span className="text-3xl font-extrabold tracking-tight text-white">Stackr<span className="text-[#f2c12e]">.</span></span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] text-white mb-6">
              Save Small. <br />
              <span className="text-[#f2c12e] bg-gradient-to-r from-[#f2c12e] via-[#ffe494] to-[#fcd96d] bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(242,193,46,0.15)]">Receive Big.</span>
            </motion.h1>
            
            <motion.h2 variants={itemVariants} className="text-xl md:text-2xl font-bold text-slate-200 tracking-wide mb-4 flex items-center gap-2">
              The Ultimate Gamified Rosca Savings Network.
            </motion.h2>

            <motion.p variants={itemVariants} className="text-slate-400 text-base md:text-xl max-w-xl mb-10 leading-relaxed">
              Commit just <span className="text-white font-semibold underline decoration-[#f2c12e] decoration-2">₹2,000 monthly</span>. Step into highly transparent, provably-fair live cycles to take home a massive pool of <span className="text-[#f2c12e] font-extrabold">₹50,000</span> early. 
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-12">
              <motion.button onClick={onJoinClick} whileHover={{ scale: 1.04, backgroundColor: "#e2b122", boxShadow: "0 15px 30px -5px rgba(242,193,46,0.4)" }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto bg-[#f2c12e] text-[#02091d] font-extrabold px-8 py-4.5 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 text-lg shadow-lg">
                Secure My Slot
                <svg className="w-5 h-5 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </motion.button>
              
              <motion.button onClick={onWatchDrawClick} whileHover={{ scale: 1.04, borderColor: "rgba(255,255,255,0.6)", backgroundColor: "rgba(255,255,255,0.05)" }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto bg-transparent text-white font-bold px-7 py-4.5 rounded-xl border-2 border-slate-700 transition-all duration-200 flex items-center justify-center gap-3 group">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-[#f2c12e] group-hover:scale-110 transition-transform fill-none stroke-current" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                  <path d="M10 8l6 4-6 4V8z" fill="currentColor"/>
                </svg>
                Watch Live Draw Room
              </motion.button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4 bg-[#06122c]/40 border border-slate-800/60 p-3.5 rounded-2xl max-w-sm backdrop-blur-xl">
              <div className="flex -space-x-2.5 overflow-hidden">
                {[
                  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&auto=format&q=80",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&auto=format&q=80",
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&auto=format&q=80",
                  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&fit=crop&auto=format&q=80"
                ].map((src, i) => (
                  <img key={i} className="inline-block h-9 w-9 rounded-full ring-2 ring-[#010614] object-cover" src={src} alt="Pool Member" />
                ))}
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-white font-bold">Over 4.8 Lakhs Pooled Today</p>
                <p className="text-[11px] text-slate-400 font-medium">Joined by 200+ verified Indian savers</p>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT COLUMN: 3D PERSPECTIVE INTERACTIVE LIVECARD */}
          <motion.div style={{ y: phoneY, rotateX: cardRotateX, rotateY: cardRotateY, transformStyle: "preserve-3d" }} initial={{ opacity: 0, scale: 0.9, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ type: "spring", stiffness: 50, damping: 18, delay: 0.25 }} className="lg:col-span-5 hidden lg:flex justify-center relative perspective-[1000px]">
            <div className="w-[400px] bg-gradient-to-b from-[#081533] to-[#030a1a] rounded-[40px] border-[3px] border-slate-800/80 p-6 shadow-[0_30px_70px_-10px_rgba(0,0,0,0.9)] relative overflow-hidden backdrop-blur-md group">
              <div className="absolute top-0 left-[-50%] w-full h-[2px] bg-gradient-to-r from-transparent via-[#f2c12e]/40 to-transparent group-hover:left-[100%] transition-all duration-1000 ease-in-out" />

              <div className="flex justify-between items-center mb-6 border-b border-slate-800/60 pb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-[#f2c12e] w-5 h-5 rounded-md text-[11px] font-black text-black flex items-center justify-center shadow-md">S</div>
                  <span className="text-sm font-black tracking-wider text-slate-200">STACKR ESCROW</span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-widest">PROVABLY FAIR</span>
                </div>
              </div>

              <div className="bg-[#040e24] border border-slate-800/90 rounded-2xl p-4 mb-4 relative">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs text-slate-400 font-bold tracking-wide">Next Live Draw Matrix</span>
                  <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded">POOL #094</span>
                </div>
                
                <div className="grid grid-cols-4 gap-2.5 text-center">
                  {[
                    { value: countdownValues.days, label: 'Days' },
                    { value: countdownValues.hours, label: 'Hrs' },
                    { value: countdownValues.minutes, label: 'Mins' },
                    { value: countdownValues.seconds, label: 'Secs' }
                  ].map((item, i) => (
                    <div key={i} className="bg-[#081533] p-2.5 rounded-xl border border-slate-800/40 relative group/time">
                      <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-slate-700 flex items-center justify-center">
                        <div className="w-1 h-[1px] bg-[#f2c12e] origin-left animate-[spin_3s_linear_infinite]" />
                      </div>
                      <div className="text-2xl font-black font-mono text-white tracking-tight">{item.value}</div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#061535] to-[#040d21] border border-slate-800/90 rounded-2xl p-5 mb-4 relative overflow-hidden flex justify-between items-center shadow-inner">
                <div className="z-10">
                  <span className="text-xs text-slate-400 block font-bold tracking-wide mb-0.5">Yield-Augmented Prize</span>
                  <span className="text-4xl font-black text-[#f2c12e] tracking-tighter drop-shadow-md">₹50,000</span>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Guaranteed payout to drawn member</p>
                </div>
                
                <div className="w-16 h-16 bg-[#0a1b3f] rounded-2xl flex items-center justify-center border border-slate-700/50 shadow-md relative group-hover:rotate-6 transition-transform duration-300">
                  <div className="absolute inset-0 bg-[#f2c12e]/5 rounded-2xl animate-pulse" />
                  <svg className="w-9 h-9 text-[#f2c12e]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v3c0 2.42 1.72 4.44 4.00 4.90C7.79 14.12 9.69 15 12 15s4.21-.88 4.99-2.10C19.28 12.44 21 10.42 21 8V7c0-1.1-.9-2-2-2zM5 10V7h2v3H5zm14 0h-2V7h2v3zm-7 7c-1.66 0-3-1.34-3-3h6c0 1.66-1.34 3-3 3z"/><path d="M6 20h12v2H6z"/>
                  </svg>
                </div>
              </div>

              <div className="bg-[#040e24]/90 rounded-2xl p-4.5 border border-slate-800/50 text-xs flex flex-col gap-3 backdrop-blur-md">
                <div className="flex justify-between items-center border-b border-slate-800/60 pb-2.5">
                  <span className="text-slate-400 font-bold tracking-wide">My Allocation</span>
                  <span className="text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md text-[10px]">Verified Active</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Cycle Seniority</span>
                  <span className="text-white font-bold bg-slate-800 px-2 py-0.5 rounded">Tier-1 Saver</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Next Automated Draw</span>
                  <span className="text-white font-mono font-bold">01 Jun 2026</span>
                </div>
              </div>

              <div className="mt-5 bg-[#f2c12e] text-[#02091d] font-black text-center py-4 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-[#ffe082] transition-all transform hover:translate-y-[-2px] shadow-lg">
                Launch Live Dashboard
                <svg className="w-4 h-4 stroke-[3]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= NEW: LIVE LOT SELECTION ENGINE (IN-BETWEEN SECTION) ================= */}
      <section className="relative bg-gradient-to-b from-[#010614] via-[#05112e] to-[#010614] py-20 px-4 md:px-12 border-t border-b border-slate-900/80 overflow-hidden">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Section Info / Left Block */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Provably Fair Consensus</span>
            </div>
            <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
              The Live <span className="text-[#f2c12e]">Lot Room</span>
            </h3>
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md mx-auto lg:mx-0">
              No behind-the-door decisions. When the timer strikes zero, an encrypted decentralized poll selects the winning Unique Chit ID live. Watch the ticket visualizer cycle through transparent allocations.
            </p>

            {/* Quick Micro Statistics */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mt-8 border-t border-slate-800/60 pt-6">
              <div>
                <p className="text-2xl font-black text-white font-mono">100%</p>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Algorithmic</p>
              </div>
              <div className="border-l border-slate-800 h-8" />
              <div>
                <p className="text-2xl font-black text-emerald-400 font-mono">0ms</p>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Payout Delay</p>
              </div>
            </div>
          </div>

          {/* Dynamic Visualizer Core / Right Block */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 items-stretch">
            
            {/* The Rolling Screen Simulator */}
            <div className="flex-1 bg-[#020a1f] border-2 border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              
              {/* Header inside monitor */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[11px] font-mono text-slate-500 tracking-widest uppercase">ID Poll Scraper V2.0</span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${isDrawing ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {isDrawing ? "SCRAPING POLLS..." : "ID SELECTED"}
                </span>
              </div>

              {/* Central Rolling Ticket Showcase */}
              <div className="my-8 text-center bg-[#051438] border border-slate-800/80 rounded-2xl py-8 px-4 shadow-inner relative">
                <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-[#020a1f]/30 to-transparent pointer-events-none" />
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={drawnTicket}
                    initial={{ opacity: 0, y: isDrawing ? 15 : 0, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: isDrawing ? -15 : 0 }}
                    transition={{ duration: 0.1 }}
                    className="text-2xl md:text-4xl font-mono font-black tracking-widest text-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)]"
                  >
                    {drawnTicket.split('-').map((segment, i) => (
                      <span key={i} className={i === 1 ? "text-[#f2c12e]" : "text-slate-300"}>
                        {segment}{i < 2 ? '-' : ''}
                      </span>
                    ))}
                  </motion.div>
                </AnimatePresence>

                <p className="text-[10px] text-slate-500 font-medium mt-3 tracking-wide uppercase">
                  {isDrawing ? "Hashing active network slots..." : "Matching Verification Hash string"}
                </p>
              </div>

              {/* Progress visualizer footer bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Pool Allotment Weight</span>
                  <span>45 Savers Active</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={isDrawing ? { x: ["-100%", "100%"] } : { x: "0%" }}
                    transition={isDrawing ? { repeat: Infinity, duration: 1.2, ease: "linear" } : { duration: 0.5 }}
                    className="w-1/2 bg-gradient-to-r from-blue-500 to-[#f2c12e] h-full rounded-full" 
                  />
                </div>
              </div>
            </div>

            {/* Side Ledger / Quick History Board */}
            <div className="w-full md:w-64 bg-[#030d26]/60 border border-slate-800/80 backdrop-blur-md rounded-3xl p-5 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-4">
                  Recent Disbursals
                </h4>
                <div className="space-y-3">
                  {recentDraws.map((draw, idx) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -10 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      key={draw.id + idx}
                      className="flex items-center justify-between bg-[#041233] border border-slate-800 p-2.5 rounded-xl text-xs"
                    >
                      <div>
                        <p className="font-mono text-slate-200 font-bold">{draw.id}</p>
                        <p className="text-[10px] text-slate-500">{draw.pool}</p>
                      </div>
                      <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 font-mono text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                        {draw.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 text-center text-[10px] text-slate-500 font-medium">
                Live updates synced securely via Stackr Escrow node.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= WINNERS TESTIMONIALS SECTION ================= */}
      <section className="relative text-white py-24 px-4 md:px-12 lg:px-20 border-t border-slate-900/60 bg-gradient-to-b from-[#010614] to-[#020b21]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-[#f2c12e]/10 border border-[#f2c12e]/20 px-3.5 py-1.5 rounded-full w-fit mb-4">
              <span className="text-xs font-bold text-[#f2c12e] uppercase tracking-widest">Real Payouts, Proven On-Chain</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              Meet Our <span className="text-[#f2c12e]">Latest Winners</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base md:text-lg">
              No guesswork. Regular transparent cycles distributing funds instantly into bank accounts.
            </p>
          </div>

          <div className="relative min-h-[700px] flex items-center justify-center">
            {winners.map((winner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 100 }}
                animate={index === currentTestimonialIndex ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }}
                transition={{ type: "spring", stiffness: 60, damping: 14, duration: 0.6 }}
                className={`absolute w-full max-w-md ${index === currentTestimonialIndex ? "pointer-events-auto" : "pointer-events-none"}`}
              >
                <div className="group relative bg-[#040e24] border border-slate-800/80 rounded-[32px] p-4 flex flex-col justify-between overflow-hidden shadow-2xl transition-all duration-300 hover:border-slate-700 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden mb-5 bg-slate-900 shadow-md">
                    <img src={winner.image} alt={winner.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040e24] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center pointer-events-none">
                      <span className="bg-[#02091d]/80 backdrop-blur-md border border-slate-700/50 text-white font-mono text-xs font-bold px-2.5 py-1 rounded-lg">{winner.cycle}</span>
                      <span className="bg-emerald-500 text-black font-extrabold text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-black animate-ping" /> Disbursed
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-[#02091d]/90 to-[#041230]/90 border border-slate-700/50 backdrop-blur-lg p-3 rounded-xl flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-black text-white tracking-wide">{winner.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium">{winner.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-amber-400">{winner.month}</div>
                        <div className="text-lg font-black text-[#f2c12e] font-mono leading-tight">{winner.amount}</div>
                      </div>
                    </div>
                  </div>

                  <div className="px-2 pb-2 flex-grow flex flex-col justify-between">
                    <div className="relative">
                      <span className="absolute -top-3 -left-2 text-5xl font-serif font-black text-slate-800/40 select-none pointer-events-none">“</span>
                      <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium relative z-10 pl-4 italic">{winner.quote}</p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                      <span className="flex items-center gap-1 text-slate-400 font-semibold">
                        <svg className="w-3.5 h-3.5 text-blue-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        KYC Verified Account
                      </span>
                      <span>TX_#8291A</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {winners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentTestimonialIndex ? "w-8 bg-[#f2c12e]" : "w-2 bg-slate-600 hover:bg-slate-500"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}