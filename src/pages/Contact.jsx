import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Tv, Send, Phone, Mail, Globe, AlertCircle, ShieldCheck, Crosshair, Zap, CheckCircle2 } from 'lucide-react';

const StackrContactPortal = () => {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const updateMouse = (e) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgTextX = useTransform(smoothProgress, [0, 1], ["0%", "-15%"]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div ref={containerRef} className="bg-[#020813] text-slate-100 selection:bg-[#FFC700] selection:text-black overflow-x-hidden min-h-screen font-sans antialiased cursor-none relative">
      
      {/* MATCHING GOLD GLOW CURSOR */}
      <motion.div 
        className="fixed z-[999] pointer-events-none hidden md:block"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: "spring", stiffness: 1000, damping: 40 }}
      >
        <motion.div
          animate={{ scale: isHovered ? 1.8 : 1 }}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFC700] to-amber-500 opacity-40 blur-[4px] flex items-center justify-center"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </motion.div>
      </motion.div>

      {/* 1. PERSISTENT FLOATING STATUS HUD */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none p-6 flex justify-between items-center">
        <div className="flex items-center gap-2 bg-[#0b1329]/80 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl pointer-events-auto shadow-lg shadow-black/40">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Slots Available: 200 Only</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 bg-[#0b1329]/80 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl pointer-events-auto">
          <ShieldCheck size={14} className="text-[#FFC700]" />
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Verified Secure Program</span>
        </div>
      </div>

      {/* 2. PREMIUM AMBIENT HERO HEADER */}
      <section className="min-h-[60vh] flex flex-col items-center justify-center relative border-b border-slate-900 px-4 pt-20 overflow-hidden bg-gradient-to-b from-[#041026] to-[#020813]">
        <div className="absolute top-[-30%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#FFC700]/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/[0.03] blur-[100px] pointer-events-none" />

        {/* Dynamic Background Kinetic Text */}
        <motion.div 
          style={{ x: bgTextX }} 
          className="absolute top-1/3 left-0 flex whitespace-nowrap opacity-[0.02] pointer-events-none select-none"
        >
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-[14vh] sm:text-[18vh] md:text-[22vh] font-black mr-20 text-white uppercase tracking-tighter">
              SAVE // INVEST // DISCIPLINE // GROWTH //
            </span>
          ))}
        </motion.div>

        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="z-10 text-center space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFC700]/10 border border-[#FFC700]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC700]" />
            <span className="text-[10px] font-bold uppercase text-[#FFC700] tracking-widest">Stacker Force Investment</span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-none text-white">
            Join the <span className="text-[#FFC700]">Force.</span>
          </h1>

          <div className="pt-4 flex flex-col items-center">
            <div className="h-1 w-12 bg-[#FFC700] rounded-full mb-4" />
            <p className="text-xs sm:text-sm uppercase font-bold text-slate-400 tracking-[0.25em]">
              ₹2000 Monthly • 25 Months Program
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5 font-medium max-w-md mx-auto">
              Build a strong saving habit and secure financial discipline with structured returns and live monthly rewards.
            </p>
          </div>
        </motion.div>
      </section>

      {/* 3. CORE COMMUNICATION & FORM INTERACTION SECTION */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Layout Information Panel */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest font-black text-[#FFC700]">Direct Support Lines</span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none">
                Get In Touch
              </h2>
              <p className="text-slate-400 text-sm sm:text-base font-normal leading-relaxed pt-2">
               A smart opportunity! Have questions about our 25-month program, monthly live selection draws, or multiple slot options? Contact us directly.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <ContactDetail icon={<Phone size={18} />} label="Primary Enrollment Hotline" value="8714922199" highlightColor="border-amber-500/20" />
              <ContactDetail icon={<Mail size={18} />} label="Inquiry Email Desk" value="stackrsavings@gmail.com" highlightColor="border-emerald-500/20" />
              <ContactDetail icon={<Globe size={18} />} label="Corporate Node Location" value="Calicut" highlightColor="border-slate-500/20" />
            </div>
          </div>

          {/* Right Layout Stateful Registration / Comms Form */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  initial={{ opacity: 1, y: 10 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#0b1329] border border-slate-800/80 p-6 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-[-10%] right-[-10%] w-40 h-40 rounded-full bg-[#FFC700]/5 blur-2xl pointer-events-none" />
                  
                  <form className="space-y-6 relative z-10" onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                        <input 
                          type="text" 
                          required 
                          placeholder="Enter your full name"
                          onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                          className="w-full bg-[#020813] border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FFC700] transition-colors placeholder:text-slate-600 font-medium"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Contact Number</label>
                        <input 
                          type="tel" 
                          required 
                          placeholder="Your active mobile number"
                          onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                          className="w-full bg-[#020813] border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FFC700] transition-colors placeholder:text-slate-600 font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Desired Slots</label>
                        <select 
                          onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                          className="w-full bg-[#020813] border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-slate-300 focus:outline-none focus:border-[#FFC700] transition-colors font-medium appearance-none cursor-pointer"
                        >
                          <option className="bg-[#0b1329]">1 Slot (₹2,000/month)</option>
                          <option className="bg-[#0b1329]">2 Slots (₹4,000/month)</option>
                          <option className="bg-[#0b1329]">3 Slots (₹6,000/month)</option>
                          <option className="bg-[#0b1329]">4+ Slots (Multiple Slots Allowed)</option>
                        </select>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inquiry Profile</label>
                        <select 
                          onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                          className="w-full bg-[#020813] border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-slate-300 focus:outline-none focus:border-[#FFC700] transition-colors font-medium appearance-none cursor-pointer"
                        >
                          <option className="bg-[#0b1329]">New Program Registration</option>
                          <option className="bg-[#0b1329]">Live Monthly Draw Info</option>
                          <option className="bg-[#0b1329]">Skipping / Exit Policy Rules</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Message / Notes</label>
                      <textarea 
                        rows="4" 
                        placeholder="Add any specific questions about your investment setup..."
                        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                        className="w-full bg-[#020813] border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-[#FFC700] transition-colors placeholder:text-slate-600 font-medium resize-none"
                      />
                    </div>

                    <button 
                      type="submit"
                      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
                      className="w-full bg-[#FFC700] text-black font-black py-4 rounded-xl shadow-xl shadow-[#FFC700]/5 hover:bg-amber-400 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2 group"
                    >
                      Book Slot / Send Request
                      <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-[#0b1329] border border-slate-800 p-10 rounded-3xl text-center shadow-xl space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 animate-bounce">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold text-white">Slot Request Sent Successfully</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    Thank you! Your registration framework has been logged. Our program operators will contact you on your registered phone number shortly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4. GEOSPATIAL MAP COMPONENT */}
      <section className="py-20 border-t border-slate-900 bg-[#050c1a]/50 relative z-10">
        <div className="absolute top-0 right-6 sm:right-12 -translate-y-1/2 bg-[#0b1329] border border-slate-800 text-slate-300 px-4 py-2 rounded-xl flex items-center gap-2.5 shadow-lg shadow-black/40">
          <Crosshair className="animate-spin text-[#FFC700]" size={16} />
          <span className="font-mono text-[10px] font-bold tracking-tight text-slate-400">LOC: Calicut</span>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-black text-[#FFC700]">Physical Headquarters</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Geospatial Target</h2>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold uppercase text-slate-500 tracking-wider">
              <span>Verified Hub Terminal</span>
              <Zap size={14} className="text-amber-500 fill-amber-500" />
            </div>
          </div>
          
          <div className="h-[480px] w-full bg-[#020813] border border-slate-800 rounded-[24px] relative overflow-hidden group shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#020813] via-transparent to-transparent opacity-80 z-10 pointer-events-none" />
            <iframe 
              title="Stackr Node Mapping Location"
              src="https://maps.google.com/maps?q=12.9893,77.6620&z=15&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)' }} 
              allowFullScreen="" 
              loading="lazy"
              className="opacity-70 group-hover:opacity-90 transition-opacity duration-500"
            />
          </div>
        </div>
      </section>

      {/* 5. LIVE RUNNING SYSTEM BANNER */}
      <div className="bg-[#020813] py-5 overflow-hidden whitespace-nowrap border-y border-slate-900 relative z-10">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="flex gap-16 text-[10px] tracking-[0.2em] font-bold text-slate-500 uppercase"
        >
          {[...Array(5)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              <AlertCircle size={12} className="text-[#FFC700]" /> 
              <span>Stacker Force Investment Active</span> 
              <span className="text-slate-700">//</span> 
              <span>No Hidden Charges</span> 
              <span className="text-slate-700">//</span> 
              <span>No Service Charges</span>
              <span className="text-slate-700">//</span> 
              <span>Every Month LIVE Selection Draw</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* COMPONENT FOOTER */}
      <footer className="bg-gradient-to-b from-[#020813] to-[#01040a] py-16 flex flex-col items-center border-t border-slate-950 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#FFC700]/10 border border-[#FFC700]/20 flex items-center justify-center text-[#FFC700] mb-4">
          <Tv size={18} />
        </div>
        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase text-center px-6">
          Stacker Force Portal <span className="text-slate-700">|</span> Save small. Receive big.
        </p>
        <p className="text-[10px] text-slate-600 font-medium mt-2">© 2026 Stackr Savings Program. All rights reserved.</p>
      </footer>
    </div>
  );
};

const ContactDetail = ({ icon, label, value, highlightColor }) => (
  <div className={`group border border-slate-800/80 p-5 rounded-2xl flex items-center gap-4 bg-[#0b1329]/40 hover:bg-[#0b1329]/80 border-l-2 hover:border-l-[#FFC700] transition-all duration-300 ${highlightColor}`}>
    <div className="p-3 rounded-xl bg-[#020813] border border-slate-800 text-[#FFC700] group-hover:scale-105 transition-transform duration-300">
      {icon}
    </div>
    <div>
      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
      <p className="text-sm sm:text-base font-bold text-white tracking-tight break-all">{value}</p>
    </div>
  </div>
);

export default StackrContactPortal;