import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, Layers, Mail, Sparkles, LogIn, LogOut, Lock, Shield, Trophy, Menu, X } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'benefits', path: '/blog', icon: Layers, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'About', path: '/about', icon: User, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'Contact', path: '/contact', icon: Mail, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
  { name: 'Login', path: '/login', icon: Lock, color: 'from-[#f9bb1a] to-[#ffda6a]', shadow: 'shadow-[#f9bb1a]/20' },
];
// import { Home, User, Layers, Mail, Sparkles, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VibrantTopNav = ({ isLightBg = false }) => {
  const [hovered, setHovered] = useState(null);
  const [loginHovered, setLoginHovered] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navBg = isLightBg ? 'rgba(18, 28, 49, 0.95)' : 'rgba(10, 17, 32, 0.85)';
  const borderColor = isLightBg ? 'border-black/10' : 'border-white/10';

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Benefits', path: '/blog', icon: Layers },
    { name: 'About', path: '/about', icon: User },
    { name: 'Contact', path: '/contact', icon: Mail },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const toggleMobile = () => setMobileOpen(prev => !prev);
  const closeMobile = () => setMobileOpen(false);

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
      location.pathname === path
        ? 'bg-[#f9bb1a]/10 text-[#f9bb1a] border border-[#f9bb1a]/20'
        : 'text-white/60 hover:text-white hover:bg-white/5'
    }`;

  return (
    <>
      {/* ===== DESKTOP NAV ===== */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] hidden lg:block">
        <motion.div 
          animate={{ backgroundColor: navBg }}
          className={`relative flex items-center gap-2 p-2.5 px-4 rounded-[2rem] backdrop-blur-3xl border ${borderColor} shadow-2xl transition-colors duration-500 bg-[#121c31]/90`}
        >
          
          <AnimatePresence>
            {hovered !== null && (
              <motion.div
                layoutId="vibrant-blob-top"
                className={`absolute top-2.5 bottom-2.5 z-0 rounded-xl bg-gradient-to-br from-[#f9bb1a] to-[#ffda6a] shadow-lg shadow-[#f9bb1a]/20`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{
                  width: '56px',
                  left: hovered * 64 + 16,
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

                {isActive && !isHovered && (
                  <motion.div 
                    layoutId="active-indicator-top"
                    className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#f9bb1a] shadow-[0_0_12px_rgba(249,187,26,0.8)]"
                  />
                )}
              </Link>
            );
          })}

          {user?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/dashboard"
                onMouseEnter={() => setHovered(null)}
                className="relative z-10 w-14 h-11 flex flex-col items-center justify-center group"
              >
                <motion.div
                  animate={{ color: location.pathname.startsWith('/admin') ? '#f9bb1a' : 'rgba(255, 255, 255, 0.6)' }}
                  className="flex items-center justify-center"
                >
                  <Shield size={20} />
                </motion.div>
              </Link>
              <Link
                to="/admin/winner"
                onMouseEnter={() => setHovered(null)}
                className="relative z-10 w-14 h-11 flex flex-col items-center justify-center group"
              >
                <motion.div
                  animate={{ color: location.pathname === '/admin/winner' ? '#f9bb1a' : 'rgba(255, 255, 255, 0.6)' }}
                  className="flex items-center justify-center"
                >
                  <Trophy size={20} />
                </motion.div>
              </Link>
              <div className="w-[1px] h-6 rounded-full bg-white/10" />
            </>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-[1px] h-6 rounded-full bg-white/10" />
              <Link
                to="/"
                onMouseEnter={() => setHovered(null)}
                className="relative z-10 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#f9bb1a] to-[#ffda6a] flex items-center justify-center text-black text-[10px] font-black">
                  {displayName[0].toUpperCase()}
                </div>
                <span className="text-white/80 text-xs font-medium truncate max-w-[80px]">
                  {displayName}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                onMouseEnter={() => setHovered(null)}
                className="relative z-10 w-10 h-10 flex items-center justify-center text-white/40 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              onMouseEnter={() => { setHovered(null); setLoginHovered(true); }}
              onMouseLeave={() => setLoginHovered(false)}
              className="relative z-10 w-14 h-11 flex flex-col items-center justify-center group"
            >
              <motion.div
                animate={{ color: location.pathname === '/login' ? "#f9bb1a" : "rgba(255, 255, 255, 0.6)" }}
                className="flex items-center justify-center"
              >
                <LogIn size={20} />
              </motion.div>
              <AnimatePresence>
                {loginHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 15 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 px-3 py-1.5 rounded-lg bg-[#121c31] text-white text-[9px] font-black uppercase tracking-widest shadow-2xl border border-white/10 whitespace-nowrap z-50"
                  >
                    <span className="text-[#f9bb1a]">Login</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {location.pathname === '/login' && (
                <motion.div 
                  layoutId="active-indicator-top"
                  className="absolute bottom-0 w-1.5 h-1.5 rounded-full bg-[#f9bb1a] shadow-[0_0_12px_rgba(249,187,26,0.8)]"
                />
              )}
            </Link>
          )}

          <div className="w-[1px] h-6 mx-2 rounded-full bg-white/10" />

          <motion.button 
            whileHover={{ scale: 1.2, rotate: 15 }}
            className="text-white/40 hover:text-[#f9bb1a] flex items-center justify-center w-11 h-11 transition-colors duration-200"
          >
            <Sparkles size={20} />
          </motion.button>
        </motion.div>
      </nav>

      {/* ===== MOBILE HAMBURGER ===== */}
      <nav className="fixed top-6 right-4 z-[100] lg:hidden">
        <button
          onClick={toggleMobile}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-[#121c31]/90 backdrop-blur-3xl border border-white/10 shadow-2xl text-white"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobile}
              className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-[95] w-72 bg-[#0a1120] border-l border-white/10 p-6 pt-24 flex flex-col gap-2 lg:hidden"
            >
              {navItems.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={closeMobile}
                  className={navLinkClass(item.path)}
                >
                  <item.icon size={18} />
                  {item.name}
                </Link>
              ))}

              {user?.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={closeMobile}
                    className={navLinkClass('/admin/dashboard')}
                  >
                    <Shield size={18} />
                    Admin
                  </Link>
                  <Link
                    to="/admin/winner"
                    onClick={closeMobile}
                    className={navLinkClass('/admin/winner')}
                  >
                    <Trophy size={18} />
                    Winner
                  </Link>
                </>
              )}

              <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f9bb1a] to-[#ffda6a] flex items-center justify-center text-black text-xs font-black">
                        {displayName[0].toUpperCase()}
                      </div>
                      <span className="text-white/80 text-sm font-medium truncate">{displayName}</span>
                    </div>
                    <button
                      onClick={() => { handleLogout(); closeMobile(); }}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 text-sm font-bold hover:bg-white/5 transition-all"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#f9bb1a] to-[#ffda6a] text-black font-black text-sm justify-center"
                  >
                    <LogIn size={18} />
                    Login
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default VibrantTopNav;
