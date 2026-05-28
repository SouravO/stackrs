import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Layers, Mail, Sparkles, Lock } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'blog', path: '/blog', icon: Layers, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'About', path: '/about', icon: User, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'Contact', path: '/contact', icon: Mail, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'Login', path: '/login', icon: Lock, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
];

const VibrantTopNav = ({ isLightBg = false }) => {
  const [hovered, setHovered] = useState(null);
  const location = useLocation();

  // Stackr Adaptive Theme Logic
  const navBg = isLightBg ? 'rgba(18, 28, 49, 0.95)' : 'rgba(10, 17, 32, 0.85)';
  const borderColor = isLightBg ? 'border-black/10' : 'border-white/10';

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] hidden lg:block">
      <motion.div 
        animate={{ backgroundColor: navBg }}
        className={`relative flex items-center gap-2 p-2.5 px-4 rounded-[2rem] backdrop-blur-3xl border ${borderColor} shadow-2xl transition-colors duration-500 bg-[#121c31]/90`}
      >
        
        {/* Stackr Golden Animated Background Blob (Horizontal Layout) */}
        <AnimatePresence>
          {hovered !== null && (
            <motion.div
              layoutId="vibrant-blob-top"
              className={`absolute top-2.5 bottom-2.5 z-0 rounded-xl bg-gradient-to-br shadow-lg ${navItems[hovered].color} ${navItems[hovered].shadow}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              style={{
                // Explicit dynamic width sizing based on typical item spacing
                width: '56px',
                left: hovered * 64 + 16, // Calculates horizontal position dynamically
              }}
            />
          )}
        </AnimatePresence>

        {navItems.map((item, idx) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          const isHovered = hovered === idx;

          return (
            <Link
              key={item.name}
              to={item.path}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="relative z-10 w-14 h-11 flex flex-col items-center justify-center group"
            >
              <motion.div
                animate={{ 
                  scale: isHovered || isActive ? 1.1 : 1,
                  color: isHovered ? "#000000" : isActive ? "#f9bb1a" : "rgba(255, 255, 255, 0.6)"
                }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                <Icon size={20} strokeWidth={isActive || isHovered ? 2.5 : 2} />
              </motion.div>
              
              {/* Stackr Minimalist Top-to-Bottom Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 15 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 px-3 py-1.5 rounded-lg bg-[#121c31] text-white text-[9px] font-black uppercase tracking-widest shadow-2xl border border-white/10 whitespace-nowrap z-50"
                  >
                    <span className="text-[#f9bb1a]">
                      {item.name}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stackr Gold Active Bottom Indicator */}
              {isActive && !isHovered && (
                <motion.div 
                  layoutId="active-indicator-top"
                  className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#f9bb1a] shadow-[0_0_12px_rgba(249,187,26,0.8)]"
                />
              )}
            </Link>
          );
        })}

        {/* Separator Line */}
        <div className="w-[1px] h-6 mx-2 rounded-full bg-white/10" />

        {/* Feature Trigger Button */}
        <motion.button 
          whileHover={{ scale: 1.2, rotate: 15 }}
          className="text-white/40 hover:text-[#f9bb1a] flex items-center justify-center w-11 h-11 transition-colors duration-200"
        >
          <Sparkles size={20} />
        </motion.button>
      </motion.div>
    </nav>
  );
};

export default VibrantTopNav;