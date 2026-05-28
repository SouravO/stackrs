import React, { useState, useEffect } from 'react';
import { Trophy, ShieldCheck, Users, CalendarDays, Zap, Award } from 'lucide-react';

const StackrLanding = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 12, mins: 45, secs: 30 });

  // Simple countdown logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const features = [
    { icon: <Zap size={24} />, title: "Live Auditable Draws", desc: "One winner selected monthly via a verifiable random draw on the Stackr ledger." },
    { icon: <ShieldCheck size={24} />, title: "Transparent & Fair", desc: "No fine print, no hidden fees. Members can only win once per circle." },
    { icon: <Users size={24} />, title: "Fixed 200-Member Circles", desc: "Limited, structured groups running for 25 consecutive months." },
    { icon: <Award size={24} />, title: "Instant ₹50,000 Payout", desc: "Transferred directly to the winner's registered bank account within 24 hours." },
  ];

  const rules = [
    { title: "Fixed Membership", value: "Exactly 200 members per circle." },
    { title: "Contribution", value: "₹2,000 auto-debited on the 1st of every month." },
    { title: "Duration", value: "Runs for 25 consecutive months." },
    { title: "Eligibility", value: "Missed contributions forfeit eligibility for that month's draw." },
  ];

  return (
    <div className="bg-[#0a1120] text-white min-h-screen font-sans antialiased">
      

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-block bg-white/5 border border-white/10 px-4 py-1 rounded-full text-xs font-medium text-[#f9bb1a] mb-4">
            Transparent. Fair. Boring on purpose.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none mb-6">
            Save Small.<br/><span className="text-[#f9bb1a]">Receive Big.</span>
          </h1>
          <p className="text-base md:text-lg opacity-70 mb-8 max-w-md leading-relaxed">
            A smarter, predictable way to save together. Contribute ₹2,000 monthly, participate in verifiable live draws, and receive a payout of ₹50,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-[#f9bb1a] text-black px-8 py-4 rounded-full font-bold hover:bg-yellow-400 transition-colors text-center">
              Join Stackr Now →
            </button>
            <button className="border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors text-center">
              Watch Live Draw
            </button>
          </div>
        </div>

        {/* Live Draw Dashboard Card */}
        <div className="bg-[#121c31] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#f9bb1a]/10 text-[#f9bb1a] px-4 py-1 text-xs font-mono rounded-bl-xl border-l border-b border-white/5">
            LIVE DRAW
          </div>
          <div className="text-xs font-semibold tracking-wider uppercase opacity-50 mb-3">Next Draw Countdown</div>
          <div className="flex gap-3 mb-8">
            {Object.entries(timeLeft).map(([unit, val]) => (
              <div key={unit} className="bg-black/40 flex-1 py-3 rounded-xl text-center border border-white/5">
                <div className="text-2xl md:text-3xl font-mono font-bold text-white">{val.toString().padStart(2, '0')}</div>
                <div className="text-[9px] uppercase tracking-wider opacity-40 mt-1">{unit}</div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs opacity-50 mb-1">Guaranteed Payout</p>
                <h2 className="text-3xl md:text-4xl font-black text-[#f9bb1a]">₹50,000</h2>
              </div>
              <div className="bg-[#f9bb1a]/10 p-3 rounded-2xl">
                <Trophy size={36} className="text-[#f9bb1a]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Circle Rules / Mechanics */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="bg-[#121c31]/50 border border-white/5 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-2">No fine print.</h2>
          <p className="text-sm opacity-60 mb-8">Exactly how every Stackr circle operates:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rules.map((rule, idx) => (
              <div key={idx} className="bg-black/20 p-5 rounded-xl border border-white/5">
                <div className="text-xs font-mono text-[#f9bb1a] mb-2">0{idx + 1}. {rule.title}</div>
                <div className="text-base font-semibold text-white/90">{rule.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="transparency" className="bg-[#0f182c] py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2">Built for Absolute Trust</h2>
            <p className="text-sm opacity-60">Publicly auditable math replacing empty financial promises.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {features.map((f, i) => (
              <div key={i} className="flex flex-col gap-4 p-2">
                <div className="text-[#f9bb1a] w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm opacity-60 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StackrLanding;