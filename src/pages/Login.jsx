import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Lock, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [
      ...otp.map((d, idx) => (idx === index ? element.value : d)),
    ];
    setOtp(newOtp);
    // Focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!formData.email || !formData.name || !formData.phone) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Send OTP to email using Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email: formData.email,
        options: {
          shouldCreateUser: true,
          data: {
            full_name: formData.name,
            phone: formData.phone,
          },
        },
      });

      if (error) {
        console.error("OTP Error:", error);
        throw new Error(error.message || "Failed to send OTP");
      }

      console.log("✅ OTP sent successfully to:", formData.email);
      setShowOTP(true);
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.message ||
          "Error sending OTP. Make sure you configured Supabase email provider.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const enteredOtp = otp.join("");

      if (enteredOtp.length !== 6) {
        alert("Please enter all 6 digits");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.verifyOtp({
        email: formData.email,
        token: enteredOtp,
        type: "signup",
      });

      if (error) throw error;

      console.log("✅ OTP verified successfully!", data);
      alert("Account created and verified successfully! You can now log in.");

      // Reset form and switch to login
      setShowOTP(false);
      setOtp(["", "", "", "", "", ""]);
      setFormData({ name: "", phone: "", email: "", password: "" });
      setIsLogin(true);
    } catch (error) {
      console.error("Verification error:", error);
      alert(error.message || "Verification failed. Please check the OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });
      if (error) throw error;
      alert("Login successful!");
    } catch (error) {
      alert(error.message);
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

          {/* Header & Tabs */}
          {!showOTP && (
            <div className="relative z-10 mb-8">
              <div className="flex bg-black/20 p-1 rounded-2xl mb-8 border border-white/5">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    isLogin
                      ? "bg-[#f9bb1a] text-black shadow-lg shadow-[#f9bb1a]/20"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                    !isLogin
                      ? "bg-[#f9bb1a] text-black shadow-lg shadow-[#f9bb1a]/20"
                      : "text-white/40 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter text-center">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
            </div>
          )}

          {showOTP && (
            <div className="relative z-10 mb-8 text-center">
              <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">
                Verify Email
              </h2>
              <p className="text-white/60 text-sm">
                We've sent a code to your Gmail
              </p>
            </div>
          )}

          <form
            className="relative z-10 space-y-4"
            onSubmit={
              showOTP
                ? handleVerifyOTP
                : isLogin
                  ? handleLogin
                  : handleSignupSubmit
            }
          >
            <AnimatePresence mode="wait">
              {!showOTP ? (
                <motion.div
                  key="form-fields"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {!isLogin && (
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="relative group">
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#f9bb1a] transition-colors"
                          size={18}
                        />
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Full Name"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f9bb1a]/50 transition-all"
                        />
                      </div>

                      <div className="relative group">
                        <Phone
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#f9bb1a] transition-colors"
                          size={18}
                        />
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Phone Number"
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f9bb1a]/50 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  <div className="relative group">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#f9bb1a] transition-colors"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Gmail Address"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f9bb1a]/50 transition-all"
                    />
                  </div>

                  {isLogin && (
                    <div className="relative group">
                      <Lock
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-[#f9bb1a] transition-colors"
                        size={18}
                      />
                      <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Password"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#f9bb1a]/50 transition-all"
                      />
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="otp-fields"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between gap-2">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength="1"
                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl text-center text-white font-bold text-xl focus:outline-none focus:border-[#f9bb1a] transition-all"
                        value={data}
                        onChange={(e) => handleOtpChange(e.target, index)}
                        onFocus={(e) => e.target.select()}
                      />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowOTP(false)}
                    className="text-[#f9bb1a] text-xs font-bold hover:underline"
                  >
                    Change Email / Re-edit
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

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
                  {showOTP
                    ? "Verify & Create Account"
                    : isLogin
                      ? "Log In"
                      : "Send OTP"}
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

export default Login;
