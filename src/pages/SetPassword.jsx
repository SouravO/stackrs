import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Mail } from "lucide-react";
import { supabase } from "../lib/supabase";

const SetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (!email) {
      navigate("/login", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to set password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a1120] flex items-center justify-center p-4 pt-24">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#121c31]/90 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-[#f9bb1a]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-[#f9bb1a]/10 rounded-full blur-3xl" />

          <div className="relative z-10 mb-8 text-center">
            <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
              Set Your Password
            </h2>
            <p className="text-white/60 text-sm">
              Create a password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
            <div className="relative group">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                size={18}
              />
              <input
                type="email"
                value={email || ""}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white/50 placeholder:text-white/20 focus:outline-none cursor-not-allowed"
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#f9bb1a] transition-colors"
                size={18}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f9bb1a]/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#f9bb1a] transition-colors"
                size={18}
              />
              <input
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f9bb1a]/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#f9bb1a] to-[#ffda6a] text-black font-black py-4 rounded-xl shadow-lg shadow-[#f9bb1a]/20 flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-sm ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Set Password & Continue
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-white/30 text-[10px] uppercase tracking-[0.2em]">
              Powered by Stackr Engine
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SetPassword;
