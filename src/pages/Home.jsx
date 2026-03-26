import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trophy, Users, ArrowRight, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { supabase } from '../lib/supabase';
import { THEMES } from '../components/ui/theme';

const Home = () => {
  const theme = THEMES.forestEthos;
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  // 🟢 LOGIC: Redirect if session exists
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
        <p className="font-bold text-xs uppercase tracking-[0.2em] opacity-40 text-white">Verifying Identity</p>
      </div>
    );
  }

  return (
    <div className="w-full transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      {/* Hero Section - Using theme.primary for the Obsidian effect */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-40 overflow-hidden" style={{ backgroundColor: theme.primary }}>
        {/* Background Texture & Gradients */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1593118247619-e2d6f056869e?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        
        {/* Themed Glow Effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[120px] opacity-20" style={{ backgroundColor: theme.accent }}></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-[120px] opacity-10" style={{ backgroundColor: theme.accent }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-white/80 text-sm font-bold mb-8 shadow-2xl">
              <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
              <span className="tracking-wide">Current Prize Pool: ₹50,000+</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-8">
              PLAY WITH <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${theme.accent}, #fff)` }}>PURPOSE.</span><br />
              WIN WITH <span className="opacity-60">PRIDE.</span>
            </h1>
            
            <p className="text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-medium text-white/60">
              Transform your competitive rounds into real-world impact. Join the elite community tracking scores for a greater cause.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-2xl transition-all hover:scale-105 border-none font-black" 
                  style={{ backgroundColor: theme.accent, color: theme.primary }}>
                  Create Account
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button variant="glass" size="lg" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl group border-white/10 text-white font-bold">
                  How it Works <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 relative border-y" style={{ backgroundColor: theme.primary, borderColor: `${theme.accent}20` }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Impact Raised", val: "₹12.5L+" },
              { label: "Active Players", val: "8.2K" },
              { label: "Charity Partners", val: "140+" },
              { label: "Monthly Draws", val: "24" }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: theme.accent }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 relative" style={{ backgroundColor: theme.bg }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4" style={{ color: theme.primary }}>The Impact Cycle</h2>
              <p className="text-lg font-medium opacity-60" style={{ color: theme.primary }}>Professional tracking, transparent distribution.</p>
            </div>
            <div className="hidden md:block h-px flex-1 mx-12 mb-6 opacity-20" style={{ backgroundColor: theme.primary }}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                icon: <Users className="w-7 h-7" />,
                title: "Choose Cause",
                desc: "Select a verified foundation. 10% of your participation fee funds their mission directly.",
                accent: theme.accent
              },
              {
                icon: <Trophy className="w-7 h-7" />,
                title: "Enter Scores",
                desc: "Submit your Stableford scores. Our draw engine validates entries for the monthly prize pool.",
                accent: theme.accent
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: "Drive Change",
                desc: "Whether you win the jackpot or not, your chosen charity receives support every single month.",
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
                <h3 className="text-2xl font-black mb-4" style={{ color: theme.primary }}>{step.title}</h3>
                <p className="leading-relaxed font-medium opacity-60" style={{ color: theme.primary }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundColor: theme.accent }}></div>
             
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block p-5 rounded-3xl mb-8" style={{ backgroundColor: `${theme.accent}10` }}>
            <ShieldCheck className="w-12 h-12" style={{ color: theme.accent }} />
          </div>
          <h2 className="text-5xl font-black mb-8 tracking-tight" style={{ color: theme.primary }}>Ready to make your rounds count?</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-60" style={{ color: theme.primary }}>
            Join the movement of gamers and athletes turning passion into philanthropy. Secure, transparent, and impactful.
          </p>
          <div className="flex justify-center">
            <Link to="/register">
              <Button size="lg" className="text-xl px-12 py-8 rounded-[2rem] shadow-2xl font-black uppercase tracking-widest transition-all hover:scale-105"
                style={{ backgroundColor: theme.primary, color: '#fff' }}>
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;