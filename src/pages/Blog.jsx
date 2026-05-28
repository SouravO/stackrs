import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck, Coins, Tv, Sparkles, Trophy, Users, Calendar, ArrowRight } from 'lucide-react';

// Custom hook to handle scroll animations per section block
function useScrollVisibility(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold]);

  return [ref, isVisible];
}

export default function HowItWorks() {
  const [containerRef, containerVisible] = useScrollVisibility(0.05);
  const [headerRef, headerVisible] = useScrollVisibility(0.15);
  const [statsRef, statsVisible] = useScrollVisibility(0.15);
  const [stepsRef, stepsVisible] = useScrollVisibility(0.1);
  const [highlightRef, highlightVisible] = useScrollVisibility(0.15);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clockDegrees, setClockDegrees] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // 1. Mouse moving spotlight tracking
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // 2. Real-time Clock hand calculation for the interactive clock element
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const secs = now.getSeconds();
      const mins = now.getMinutes();
      const hrs = now.getHours();
      
      setClockDegrees({
        seconds: secs * 6, // 360 / 60
        minutes: mins * 6 + secs * 0.1,
        hours: (hrs % 12) * 30 + mins * 0.5
      });
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: '01',
      title: 'Join the High-Trust Circle',
      subtitle: 'Instant KYC & Slot Allocation',
      icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
      desc: 'Every Stackr saving syndicate is mathematically capped at exactly 200 verified users to preserve structural trust and absolute liquidity. Run through a lightning-fast, biometrically secure KYC pipeline, tie your primary bank stack, and lock your position into the upcoming cycle instantly.',
      badge: 'Secure Entry'
    },
    {
      id: '02',
      title: 'Automate & Escrow Assets',
      subtitle: 'Zero-Friction Bank Mandates',
      icon: <Coins className="w-6 h-6 text-amber-400" />,
      desc: 'On the precise opening bell of the 1st of every calendar month, your fixed micro-contribution of ₹2,000 is automatically debited via institutional-grade NPCI/e-NACH mandates. Your funds bypass external human hands entirely, streaming instantly into a fully locked, legal escrow account.',
      badge: '100% Automated'
    },
    {
      id: '03',
      title: 'The Verifiable Live Draw',
      subtitle: 'Quantum-Grade Transparency',
      icon: <Tv className="w-6 h-6 text-amber-400" />,
      desc: 'Log in live as the timer hits zero. Using a transparent, public-ledger Verifiable Random Function (VRF) engine, one wallet is randomly selected from the group pool live on stream. The structural math ensures 100% predictability of fairness. Winner receives ₹50,000 liquid capital deployed within 24 hours.',
      badge: 'Live Streamed'
    },
    {
      id: '04',
      title: 'Win, Exit, & Compound',
      subtitle: 'The Ultimate Financial Loophole',
      icon: <Sparkles className="w-6 h-6 text-amber-400" />,
      desc: 'The moment your ticket lands, your massive group payout is disbursed—and your dues terminate right there. You are permanently freed from contributing a single rupee more for the duration of the 25-month cycle, maintaining your lump-sum windfall while remaining members keep playing down the timeline.',
      badge: 'Asymmetric Edge'
    }
  ];

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      id="how-it-works" 
      className="relative py-32 bg-[#020712] text-white font-sans selection:bg-amber-500 selection:text-slate-950 overflow-hidden min-h-screen"
    >
      {/* INJECTED CSS STYLES FOR PERFORMANCE-ANIMATIONS */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-105%) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.4; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0; }
        }
        .money-particle {
          position: absolute;
          top: -50px;
          pointer-events: none;
          animation: fall linear infinite;
          font-family: monospace;
          font-weight: bold;
          color: rgba(245, 158, 11, 0.18);
          z-index: 1;
        }
        .clock-pulse {
          animation: clockGlow 4s infinite alternate;
        }
        @keyframes clockGlow {
          0% { filter: drop-shadow(0 0 8px rgba(245,158,11,0.1)); }
          100% { filter: drop-shadow(0 0 25px rgba(245,158,11,0.35)); }
        }
      `}</style>

      {/* DYNAMIC SCROLL BACKGROUND & MOUSE SPOTLIGHT FLUID EFFECT */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000 z-0"
        style={{
          opacity: containerVisible ? 1 : 0,
          background: `
            radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(245, 158, 11, 0.06), transparent 80%),
            radial-gradient(1200px circle at ${mousePos.x}px ${mousePos.y}px, rgba(7, 27, 62, 0.3), transparent 70%)
          `
        }}
      />

      {/* RAINING MONETARY ASSETS ENGINE */}
      {containerVisible && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1 select-none">
          {/* Layered cascading particles with varying speeds, sizes and delay tracks */}
          <div className="money-particle text-xl" style={{ left: '5%', animationDuration: '7s', animationDelay: '0s' }}>₹</div>
          <div className="money-particle text-sm" style={{ left: '15%', animationDuration: '11s', animationDelay: '3s' }}>₹2000</div>
          <div className="money-particle text-lg" style={{ left: '28%', animationDuration: '9s', animationDelay: '1.5s' }}>₹50,000</div>
          <div className="money-particle text-2xl" style={{ left: '42%', animationDuration: '6s', animationDelay: '4s' }}>₹</div>
          <div className="money-particle text-sm" style={{ left: '55%', animationDuration: '12s', animationDelay: '0.5s' }}>₹2000</div>
          <div className="money-particle text-xl" style={{ left: '67%', animationDuration: '8s', animationDelay: '2.5s' }}>₹50,000</div>
          <div className="money-particle text-base" style={{ left: '82%', animationDuration: '10s', animationDelay: '5s' }}>₹</div>
          <div className="money-particle text-lg" style={{ left: '93%', animationDuration: '7.5s', animationDelay: '1.2s' }}>₹2000</div>
        </div>
      )}

      {/* GRID MESH OVERLAY */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0b1528_1px,transparent_1px),linear-gradient(to_bottom,#0b1528_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-60 z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* =========================================
            SECTION 1: HERO HEADER WITH LIVE TIME ENGINE
           ========================================= */}
        <div 
          ref={headerRef}
          className={`grid lg:grid-cols-12 gap-12 items-center mb-28 transform transition-all duration-1000 ease-out ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          <div className="lg:col-span-7 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4 animate-bounce">
              <Trophy className="w-3.5 h-3.5" /> High-Yield Game Theory Mechanics
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8 leading-[1.1] bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
             Why Members <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                Choose Stackr ?
              </span>
            </h2>
            <p className="text-base md:text-xl text-slate-400 max-w-2xl leading-relaxed font-light">
              Stackr strips down administrative bloat and replaces conventional high-fee banking models with an automated, algorithmically balanced saving architecture. 
            </p>
          </div>

          {/* INTERACTIVE MECHANICAL TICKING CLOCK */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-64 h-64 md:w-72 md:h-72 bg-gradient-to-b from-[#09152e] to-[#040b17] border-2 border-slate-800/80 rounded-full flex items-center justify-center clock-pulse shadow-2xl">
              {/* Outer Minute Ticks */}
              <div className="absolute inset-3 border border-dashed border-slate-700/50 rounded-full" />
              <div className="absolute inset-6 border border-slate-800 rounded-full" />
              
              {/* Dynamic Center Hands */}
              <div className="relative w-full h-full">
                {/* Hour Hand */}
                <div 
                  className="absolute w-1.5 h-16 bg-white top-1/2 left-1/2 origin-bottom rounded-full shadow-lg"
                  style={{ transform: `translate(-50%, -100%) rotate(${clockDegrees.hours}deg)`, transition: 'transform 0.5s ease-out' }}
                />
                {/* Minute Hand */}
                <div 
                  className="absolute w-1 h-24 bg-slate-400 top-1/2 left-1/2 origin-bottom rounded-full"
                  style={{ transform: `translate(-50%, -100%) rotate(${clockDegrees.minutes}deg)`, transition: 'transform 0.5s ease-out' }}
                />
                {/* Second Hand (Ticking smoothly) */}
                <div 
                  className="absolute w-0.5 h-24 bg-amber-500 top-1/2 left-1/2 origin-bottom"
                  style={{ transform: `translate(-50%, -100%) rotate(${clockDegrees.seconds}deg)` }}
                />
                {/* Core Hub Cap */}
                <div className="absolute w-4 h-4 bg-amber-400 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-xl ring-4 ring-amber-950" />
              </div>

              {/* Float Indicators */}
              <div className="absolute top-4 text-[10px] text-slate-500 font-mono tracking-widest">CYCLE TIMER</div>
              <div className="absolute bottom-6 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono rounded-md">100% SYNCED</div>
            </div>
          </div>
        </div>

        {/* =========================================
            SECTION 2: METRIC MATRICES STRIP
           ========================================= */}
        <div 
          ref={statsRef}
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-32 transform transition-all duration-1000 delay-200 ease-out ${
            statsVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          {[
            { label: 'Syndicate Size', value: '200 Users', sub: 'Verified Cap', icon: <Users className="w-4 h-4 text-amber-500" /> },
            { label: 'System Inflow', value: '₹2,000 /mo', sub: 'Automated Mandate', icon: <Coins className="w-4 h-4 text-amber-500" /> },
            { label: 'Capital Lump Sum', value: '₹50,000', sub: 'Liquid Payout', icon: <Trophy className="w-4 h-4 text-amber-500" /> },
            { label: 'Cycle Horizon', value: '25 Months', sub: 'Hard Term Limit', icon: <Calendar className="w-4 h-4 text-amber-500" /> }
          ].map((stat, idx) => (
            <div key={idx} className="relative overflow-hidden group bg-[#061124] border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:border-amber-500/40 hover:-translate-y-1 shadow-lg">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-xl group-hover:bg-amber-500/[0.05] transition-all duration-300" />
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                {stat.icon}
              </div>
              <p className="text-2xl md:text-3xl font-black text-white group-hover:text-amber-400 transition-colors duration-300">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-1 font-mono">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* =========================================
            SECTION 3: THE STEP PROGRESSION CARDS
           ========================================= */}
        <div 
          ref={stepsRef}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10"
        >
          {steps.map((step, index) => {
            const delayClasses = ['delay-0', 'delay-100', 'delay-200', 'delay-300'];
            return (
              <div 
                key={step.id} 
                className={`relative bg-[#050e1c] border border-slate-800/90 rounded-2xl p-6 md:p-8 flex flex-col justify-between group hover:border-amber-500/50 hover:bg-[#07152b] transition-all duration-500 transform ${delayClasses[index]} ${
                  stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
                }`}
              >
                {/* Horizontal Connector Paths for Multi-Column Monitors */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-amber-500/20 font-mono text-xl pointer-events-none transform group-hover:translate-x-1 group-hover:text-amber-400 transition-all duration-300">
                    ➔
                  </div>
                )}
                
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500/10 group-hover:border-amber-500/40 transition-all duration-300 shadow-inner">
                      {step.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold text-amber-400/90 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {step.badge}
                    </span>
                  </div>
                  
                  <div className="text-xs font-mono text-slate-500 font-bold mb-1">STAGE {step.id}</div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors duration-300 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mb-5 group-hover:text-slate-300 transition-colors">
                    {step.subtitle}
                  </p>
                  <p className="text-sm text-slate-400 font-light leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {step.desc}
                  </p>
                </div>

                {/* Subtle bottom accent line */}
                <div className="w-full h-0.5 bg-slate-800/60 mt-6 rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================
            SECTION 4: ASYMMETRIC SYSTEM HIGHLIGHT
           ========================================= */}
        <div 
          ref={highlightRef}
          className={`mt-32 p-8 md:p-14 rounded-3xl bg-gradient-to-br from-[#051021] via-[#030a16] to-[#01040a] border border-slate-800/80 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden transform transition-all duration-1000 ease-out ${
            highlightVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
          }`}
        >
          {/* Internal neon ambient glow element */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide mb-5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Asymmetric Mathematical Safeguards Active
            </div>
            <h4 className="text-2xl md:text-4xl font-black text-white mb-5 leading-tight tracking-tight">
              Once you win, your overhead stops.<br />The cycle handles the rest.
            </h4>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed font-light">
              To secure mathematical finality, every verified member is entitled to win exactly one pooled windfall per lifecycle block. Once drawn, you exit your fee structures cleanly with your lump capital in hand, while remaining participants continue systematically down the chronological stream. Total equity, verified by cryptographic random mechanics.
            </p>
          </div>
          
          <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4 shrink-0 z-10">
            <button className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all duration-300 shadow-xl shadow-amber-500/10 hover:shadow-amber-400/20 active:scale-98 tracking-wide">
              Secure Your Slot Now 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="px-8 py-4 bg-[#040b17] border border-slate-800 hover:border-slate-600 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all duration-300 tracking-wide shadow-md">
              Review Escrow Math
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}