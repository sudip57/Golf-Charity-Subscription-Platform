import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trophy, Users, ArrowRight, ShieldCheck, Loader2, Sparkles, Target, BarChart3 } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { THEMES } from '../components/ui/theme';

const Home = () => {
  const theme = THEMES.forestEthos;
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      } else {
        setCheckingSession(false);
      }
    };
    checkUser();
  }, [navigate]);

  if (checkingSession) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center" style={{ backgroundColor: theme.primary }}>
        <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: theme.accent }} />
        <p className="font-bold text-xs uppercase tracking-[0.2em] opacity-40 text-white">Initializing Platform</p>
      </div>
    );
  }

  return (
    <div className="w-full transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      {/* 🟢 HERO SECTION: Emotion-driven, avoiding golf clichés [cite: 12, 120] */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden" style={{ backgroundColor: theme.primary }}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"></div>
        
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: theme.accent }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-sm font-bold mb-8 shadow-2xl">
              <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
              <span className="tracking-wide uppercase text-[10px]">Monthly Draw Rewards & Impact</span>
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              TRACK YOUR <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${theme.accent}, #fff)` }}>PERFORMANCE.</span><br />
              FUND THE <span className="opacity-60 text-white">FUTURE.</span>
            </h1>
            
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium text-white/60">
              The premier subscription platform combining golf performance tracking with a monthly reward engine and charitable giving[cite: 7, 11].
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-2xl transition-all hover:scale-105 border-none font-black" 
                  style={{ backgroundColor: theme.accent, color: theme.primary }}>
                  Join the Mission
                </Button>
              </Link>
              <a href="#impact-cycle">
                <Button variant="glass" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl group border-white/10 text-white font-bold">
                  How it Works <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 🟢 STATS SECTION: Based on PRD Objectives [cite: 17, 115] */}
      <section className="py-12 relative border-y" style={{ backgroundColor: theme.primary, borderColor: `${theme.accent}20` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Tiered Prize Pools", val: "3 Levels" }, // [cite: 52-55]
              { label: "Charity Contribution", val: "10% Min" }, // [cite: 77]
              { label: "Score Format", val: "Stableford" }, // [cite: 45]
              { label: "Verification", val: "Admin-Led" } // [cite: 38, 111]
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.accent }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🟢 CORE MECHANICS: Reflecting Section 05, 06, and 08 [cite: 42, 51, 74] */}
      <section id="impact-cycle" className="py-32 relative" style={{ backgroundColor: theme.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6 text-center md:text-left">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: theme.primary }}>The Golf Charity Loop</h2>
              <p className="text-lg font-medium opacity-60" style={{ color: theme.primary }}>Engage in competitive rounds, support vital causes, and win monthly rewards[cite: 11, 14].</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <BarChart3 className="w-7 h-7" />,
                title: "Log Performance",
                desc: "Enter your latest 5 Stableford scores. Our system automatically retains your most recent rounds for draw eligibility[cite: 44, 48].",
                accent: theme.accent
              },
              {
                icon: <Target className="w-7 h-7" />,
                title: "Enter Monthly Draws",
                desc: "Participate in 3-match, 4-match, or 5-match jackpot tiers. Prizes are split automatically among qualifying subscribers [cite: 52-55, 72].",
                accent: theme.accent
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: "Support Your Mission",
                desc: "Select a charity of your choice. At least 10% of your subscription fee directly funds their specific mission[cite: 15, 77].",
                accent: theme.accent
              }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[3rem] border shadow-xl shadow-black/5 group transition-all"
                style={{ borderColor: theme.border }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110"
                     style={{ backgroundColor: `${step.accent}15`, color: step.accent }}>
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter" style={{ color: theme.primary }}>{step.title}</h3>
                <p className="leading-relaxed font-medium opacity-60 text-sm" style={{ color: theme.primary }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🟢 FINAL CTA: Prominent and Persuasive [cite: 121] */}
      <section className="py-32 bg-white relative overflow-hidden border-t" style={{ borderColor: theme.border }}>
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block p-5 rounded-3xl mb-8" style={{ backgroundColor: `${theme.accent}10` }}>
            <ShieldCheck className="w-12 h-12" style={{ color: theme.accent }} />
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter" style={{ color: theme.primary }}>START YOUR IMPACT JOURNEY</h2>
          <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-60" style={{ color: theme.primary }}>
            Choose between our monthly or yearly plans to unlock full access to score tracking, charity selection, and the reward engine[cite: 41, 142].
          </p>
          <div className="flex justify-center">
            <Link to="/register">
              <Button size="lg" className="text-xl px-12 py-8 rounded-[2rem] shadow-2xl font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
                style={{ backgroundColor: theme.primary, color: '#fff' }}>
                Subscribe Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;