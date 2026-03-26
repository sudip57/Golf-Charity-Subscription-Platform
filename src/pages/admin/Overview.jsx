import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Coins, 
  Heart, 
  Dices, 
  Activity, 
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion'; // Added for the carousel effect
import { THEMES } from '../../components/ui/theme';

const Overview = () => {
  const theme = THEMES.forestEthos;
  const [stats, setStats] = useState(null);
  const [recentDraws, setRecentDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const { count: totalUsers } = await supabase.from("users").select("*", { count: "exact", head: true });
      const { count: drawsCompleted } = await supabase.from("draws").select("*", { count: "exact", head: true });
      const { count: activeSubs } = await supabase.from("users").select("*", { count: "exact", head: true }).eq("subscription_status", "active");

      const currentPool = (activeSubs || 0) * 100;
      const charity = currentPool * 0.1;

      setStats({
        totalUsers: totalUsers || 0,
        activeSubs: activeSubs || 0,
        drawsCompleted: drawsCompleted || 0,
        currentPool,
        charity
      });

      const { data: draws } = await supabase
        .from("draws")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      setRecentDraws(draws || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: theme.accent }} />
        <p className="font-medium animate-pulse" style={{ color: theme.primary, opacity: 0.6 }}>Syncing platform data...</p>
      </div>
    </div>
  );

  const statsItems = [
    { label: 'Active Subscribers', value: stats.activeSubs, icon: Users },
    { label: 'Live Prize Pool', value: formatCurrency(stats.currentPool), icon: Coins },
    { label: 'Charity Impact', value: formatCurrency(stats.charity), icon: Heart },
    { label: 'Total Draws', value: stats.drawsCompleted, icon: Dices },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-12 transition-colors duration-500">
      {/* Header */}
      <div className="flex justify-between items-start px-4 sm:px-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: theme.primary }}>System Overview</h1>
          <p className="font-medium opacity-60" style={{ color: theme.primary }}>Real-time platform metrics and prize distributions.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl border" 
             style={{ backgroundColor: `${theme.accent}10`, color: theme.accent, borderColor: `${theme.accent}20` }}>
          <Activity className="w-4 h-4" />
          <span className="text-xs font-black uppercase tracking-widest">Systems Nominal</span>
        </div>
      </div>

      {/* Stats Carousel (Mobile) / Grid (Desktop) */}
      <div className="relative">
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
        <div className="flex overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 sm:px-0 no-scrollbar snap-x snap-mandatory">
          {statsItems.map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="min-w-[280px] md:min-w-0 snap-center bg-white p-6 rounded-[2rem] border shadow-xl shadow-black/5 group transition-all"
              style={{ borderColor: theme.border }}
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                   style={{ backgroundColor: `${theme.accent}10`, color: theme.accent }}>
                <item.icon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1 opacity-40" style={{ color: theme.primary }}>{item.label}</p>
              <h3 className="text-2xl font-black" style={{ color: theme.primary }}>{item.value}</h3>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 sm:px-0">
        {/* Pool Allocation Logic Card */}
        <div className="lg:col-span-7 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden"
             style={{ backgroundColor: theme.primary }}>
          <div className="absolute top-0 right-0 w-64 h-64 blur-[80px]" style={{ backgroundColor: `${theme.accent}20` }} />
          <div className="relative z-10">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" style={{ color: theme.accent }} />
              Automated Distribution Logic
            </h2>
            
            <div className="space-y-6">
              {[
                { label: 'Winners Pool', percent: '90%', desc: 'Distributed among 3, 4, and 5-match tiers.' },
                { label: 'Charity Share', percent: '10%', desc: 'Automatically set aside for foundation partners.' },
                { label: 'Jackpot Rollover', percent: '100%', desc: 'Tier 1 shares carry over if no match is found.' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <p className="font-bold text-sm">{row.label}</p>
                    <p className="text-xs text-white/40">{row.desc}</p>
                  </div>
                  <span className="text-lg font-black" style={{ color: theme.accent }}>{row.percent}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick History Feed */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] p-8 border shadow-xl shadow-black/5"
             style={{ borderColor: theme.border }}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black flex items-center gap-2" style={{ color: theme.primary }}>
              <Zap className="w-6 h-6" style={{ color: '#f59e0b' }} />
              Recent Draws
            </h2>
            <button className="text-xs font-black uppercase tracking-widest hover:underline" style={{ color: theme.accent }}>View All</button>
          </div>

          <div className="space-y-4">
            {recentDraws.map((draw) => (
              <div key={draw.id} className="p-4 rounded-2xl border flex items-center justify-between group transition-all"
                   style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-40" style={{ color: theme.primary }}>
                    {new Date(draw.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </p>
                  <div className="flex gap-1.5 mt-2">
                    {draw.winning_numbers?.map((num, i) => (
                      <span key={i} className="w-7 h-7 flex items-center justify-center bg-white rounded-lg text-[10px] font-black shadow-sm border"
                            style={{ color: theme.primary, borderColor: theme.border }}>
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold opacity-40 uppercase" style={{ color: theme.primary }}>Pool</p>
                  <p className="text-sm font-black" style={{ color: theme.primary }}>₹{draw.total_pool?.toLocaleString() || '0'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;