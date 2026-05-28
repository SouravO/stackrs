import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Sparkles, 
  Command, 
  Coins, 
  ArrowRight, 
  Youtube, 
  Facebook, 
  Instagram, 
  Linkedin,
  ShieldCheck,
  Tv
} from 'lucide-react';

const Footer = ({ scrollToSection }) => {
  const constraintsRef = useRef(null);

  // Social Media Data Array mapped to Stackr active profiles
  const socialLinks = [
    { icon: Linkedin, url: 'https://www.linkedin.com/company/stackr-savings' },
    { icon: Facebook, url: 'https://www.facebook.com/stackrsavings' },
    { icon: Instagram, url: 'https://www.instagram.com/stackr.savings/' },
    { icon: Youtube, url: 'https://www.youtube.com/@stackrsavings' },
  ];

  return ( 
    <footer className="relative bg-[#020813] text-slate-200 min-h-[90vh] flex flex-col justify-center items-center overflow-hidden py-20 pb-40 font-sans border-t border-slate-900">
      
      {/* 1. PREMIUM AMBER BLUR BACKGROUND AMBIENT LAYER */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[400px] pointer-events-none overflow-hidden z-0 opacity-30">
        <div className="absolute bottom-[-10%] left-[25%] w-[45vw] h-[45vw] rounded-full bg-[#FFC700]/10 blur-[130px]" />
      </div>

      {/* 2. THE FLOATING PHYSICS ZONE (Fintech Glass Widgets) */}
      <div ref={constraintsRef} className="absolute inset-0 z-10 overflow-hidden">
        {[
          { Icon: Coins, top: '20%', left: '12%' },
          { Icon: Sparkles, top: '65%', left: '8%' },
          { Icon: ShieldCheck, top: '15%', left: '82%' },
          { Icon: Tv, top: '72%', left: '84%' },
        ].map((item, i) => (
          <motion.div
            key={i}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.2}
            whileDrag={{ scale: 1.15, cursor: 'grabbing', borderColor: '#FFC700' }}
            initial={{ y: 0 }}
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 3, -3, 0]
            }}
            transition={{ 
              duration: 5 + i, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            style={{ top: item.top, left: item.left }}
            className="absolute p-5 bg-[#0b1329]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl cursor-grab z-20 shadow-2xl transition-colors hover:border-slate-700 select-none hidden sm:block"
          >
            <item.Icon size={24} className="text-[#FFC700]" strokeWidth={2} />
          </motion.div>
        ))}
      </div>

      {/* 3. THE CENTRAL CALL TO ACTION */}
      <div className="relative z-30 text-center space-y-8 px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex justify-center mb-4">
            <span className="px-3 py-1 bg-[#121b2e] text-[#FFC700] border border-slate-800 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Secure Collective Savings
            </span>
          </div>
          <h2 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] text-white">
            Ready to save<br />
            <span className="text-[#FFC700] italic font-normal tracking-normal font-serif lowercase px-2">and</span> win big?
          </h2>
        </motion.div>

        <motion.button
          onClick={() => {
            const element = document.getElementById('waitlist');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="px-10 py-4 bg-[#FFC700] text-black hover:bg-amber-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-[#FFC700]/5 flex items-center gap-2 mx-auto"
        >
          Reserve My Spot Now <ArrowRight size={14} strokeWidth={2.5} />
        </motion.button>
      </div>

      {/* 4. THE REFINED PLATFORM HUD BANNER */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[92%] max-w-7xl z-40 px-4">
        <div className="p-6 bg-[#0b1329]/90 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded bg-[#FFC700] flex flex-col justify-between p-1 shrink-0">
              <div className="w-full h-[2px] bg-black rounded" />
              <div className="w-2/3 h-[2px] bg-black rounded" />
              <div className="w-full h-[2px] bg-black rounded" />
            </div>
            <div className="text-left">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">TRANSPARENT LEDGER</p>
              <p className="text-sm font-black text-white tracking-tight">Stackr Savings.</p>
            </div>
          </div>

          {/* LUXURY AMBER INTERACTIVE SOCIAL LINKS */}
          <div className="flex gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3, color: '#000', backgroundColor: '#FFC700', borderColor: '#FFC700' }}
                className="p-3 bg-[#121b2e] text-slate-400 border border-slate-800/80 rounded-xl cursor-pointer transition-all shadow-inner"
              >
                <social.icon size={16} />
              </motion.a>
            ))}
          </div>
          
          <div className="text-center md:text-right flex items-center gap-4">
             <div className="h-6 w-[1px] bg-slate-800 hidden md:block" />
             <div>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">MAX LIFE UPSIDE</p>
              <p className="text-sm font-black text-[#FFC700] tracking-wider uppercase">25x Return Matrix</p>
             </div>
          </div>

        </div>
      </div>

      {/* Persistent Legal Baseline Meta */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-8 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
        <span>©2026</span>
        <span>Stackr savings circle</span>
        <span>All Rights Reserved</span>
      </div>
    </footer>
  );
};

export default Footer;