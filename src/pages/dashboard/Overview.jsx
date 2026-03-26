import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, Globe, Zap, ShieldCheck, Award, Activity 
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { THEMES } from '../../components/ui/theme';
import SpotlightCarousel from '../components/SpotlightCarousel'; 
import { Link } from 'react-router-dom';
const THEME = THEMES.forestEthos;

const Overview = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('loading');
  const [featuredCharities, setFeaturedCharities] = useState([]);
  const [charityLoading, setCharityLoading] = useState(true);

  const isPro = status === 'active';

  const impactStats = [
    { label: "Lives Impacted", value: "12,402", icon: Users, isAccent: false },
    { label: "Clean Water", value: "850k+", icon: Activity, isAccent: true },
    { label: "Trees Planted", value: "4,200", icon: Globe, isAccent: false },
    { label: "Community", value: "Top 5%", icon: Award, isAccent: true },
  ];

  const recentActivity = [
    { id: 1, user: "Alex M.", action: "donated $50", target: "Ocean Cleanup", time: "2m ago" },
    { id: 2, user: "Sarah K.", action: "started a monthly sub", target: "Save the Children", time: "15m ago" },
    { id: 3, user: "James W.", action: "reached Gold Impact", target: "", time: "1h ago" },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      const { data: userData } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single();
      
      setStatus(userData?.subscription_status || 'inactive');
      setCharityLoading(true);

      const { data: charities } = await supabase
        .from('charities')
        .select('*')
        .eq('is_featured', true);

      if (charities) setFeaturedCharities(charities);
      setCharityLoading(false);
    };
    fetchDashboardData();
  }, [user]);

  // Mock function for the carousel prop (since Overview doesn't update user charity usually)
  const handleNoOp = () => console.log("Navigation only mode");

  return (
    <div 
      className="min-h-full space-y-10 md:space-y-16 pb-24 px-4 md:px-8 overflow-x-hidden"
      style={{ backgroundColor: THEME.bg }}
    >
      {/* HEADER SECTION */}
      <header className="pt-6 md:pt-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{delay:0.300}}>
            <div className="flex items-center gap-2 font-black text-[10px] uppercase tracking-[0.3em] mb-3" style={{ color: THEME.primary }}>
              <span className="w-8 h-[2px]" style={{ backgroundColor: THEME.accent }}></span>
              Impact Hub
            </div>
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none" style={{ color: THEME.primary }}>
              The world is <span style={{ color: THEME.accent }}>better</span> <br className="hidden md:block"/> with you.
            </h1>
          </motion.div>

          <div 
            className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-md p-2 pl-5 rounded-[2rem] border shadow-sm"
            style={{ borderColor: THEME.border }}
          >
             <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest leading-none opacity-60" style={{ color: THEME.primary }}>Rank</p>
                <p className="text-sm font-black" style={{ color: THEME.primary }}>{isPro ? 'Pro Contributor' : 'Member'}</p>
             </div>
             <div 
                className="p-3 rounded-2xl text-white"
                style={{ backgroundColor: isPro ? THEME.accent : THEME.border, color: isPro ? 'white' : THEME.primary }}
             >
                {isPro ? <ShieldCheck className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
             </div>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {impactStats.map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white border p-6 rounded-[2.5rem] shadow-xl shadow-black/5 group"
              style={{ borderColor: THEME.border }}
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:rotate-12"
                style={{ 
                    backgroundColor: stat.isAccent ? `${THEME.accentLight}50` : `${THEME.border}50`,
                    color: stat.isAccent ? THEME.accent : THEME.primary 
                }}
              >
                <stat.icon className="w-6 h-6" />
              </div>
              <p className="text-3xl font-black tracking-tighter" style={{ color: THEME.primary }}>{stat.value}</p>
              <p className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-50" style={{ color: THEME.primary }}>{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </header>

      {/* MODULAR SPOTLIGHT CAROUSEL */}
      {!charityLoading && (
        <SpotlightCarousel 
          featuredCharities={featuredCharities}
          userProfile={null} // Passing null keeps it in "CTA" mode rather than "Selection" mode
          isUpdating={false}
          onUpdateCharity={handleNoOp}
          theme={THEME}
        />
      )}

      {/* ACTIVITY & PRO SECTION */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border rounded-[3rem] p-8 md:p-12 shadow-xl shadow-black/5" style={{ borderColor: THEME.border }}>
          <h3 className="text-3xl font-black tracking-tighter mb-10" style={{ color: THEME.primary }}>Community Pulse</h3>
          <div className="space-y-8">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex items-center justify-between py-2 border-b last:border-0 group" style={{ borderBottomColor: THEME.bg }}>
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-2xl border flex items-center justify-center font-black transition-colors" style={{ backgroundColor: THEME.bg, borderColor: THEME.border, color: THEME.primary }}>
                    {act.user[0]}
                  </div>
                  <div>
                    <p className="text-base font-black leading-tight" style={{ color: THEME.primary }}>
                      {act.user} <span className="font-medium opacity-60">{act.action}</span>
                    </p>
                    <p className="text-xs font-black uppercase tracking-tighter mt-1" style={{ color: THEME.accent }}>{act.target}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: THEME.primary }}>{act.time}</span>
              </div>
            ))}
          </div>
        </div>

       { !isPro ? (<div 
          className="rounded-[3rem] p-10 flex flex-col justify-between relative overflow-hidden shadow-2xl"
          style={{ backgroundColor: isPro ? THEME.primary : THEME.accent, color: THEME.textOnDark }}
        >
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-8 border border-white/20">
               {isPro ? <Award className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
            </div>
            <h3 className="text-4xl font-black leading-none tracking-tighter mb-6">
              {isPro ? "The Impact Master." : "Fuel the Future."}
            </h3>
            <p className="opacity-80 text-base font-medium leading-relaxed">
              {isPro ? "Access bespoke impact dossiers." : "Unlock 10x impact multiplier."}
            </p>
          </div>
           <Link to="/payment">
          <button 
            className="mt-12 w-full py-5 rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-sm"
            style={{ backgroundColor: THEME.bg, color: isPro ? THEME.primary : THEME.accent }}
          >
            Upgrade Now
          </button>
          </Link>
        </div>):""}
      </div>
    </div>
  );
};

export default Overview;