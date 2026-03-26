import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getScores, addScore } from '../../lib/api';
import Button from '../../components/ui/Button';
import {
  Calendar,
  Target,
  Trophy,
  History,
  TrendingUp,
  Loader2,
  Zap,
  Ticket,
  ArrowRight,
  Sparkles,
  Lock,
  Crown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { THEMES } from '../../components/ui/theme';
import { Link } from 'react-router-dom';

const Scores = () => {
  const theme = THEMES.forestEthos;
  const { user } = useAuth();
  
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');
  const [hasWon, setHasWon] = useState(false);

  // Form State
  const [scoreInput, setScoreInput] = useState('');
  const [dateInput, setDateInput] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    if (!user?.id) return;
    setLoading(true);
    
    try {
      const [scoresRes, userRes, winnerCheck] = await Promise.all([
        // Always fetch 5 most recent rounds, ordered by date descending
        supabase.from('scores').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(5),
        supabase.from('users').select('subscription_status').eq('id', user.id).single(),
        supabase.from('winners').select('id').eq('user_id', user.id).eq('verification_status', 'pending').limit(1)
      ]);

      if (scoresRes.data) setScores(scoresRes.data);
      setSubscriptionStatus(userRes.data?.subscription_status || 'inactive');
      if (winnerCheck.data?.length > 0) setHasWon(true);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const isPro = subscriptionStatus === 'active';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isPro) return;

    setError(null);
    const parsedScore = parseInt(scoreInput);

    // Validation: 1 - 45 (Stableford)
    if (isNaN(parsedScore) || parsedScore < 1 || parsedScore > 45) {
      setError("Score must be between 1 and 45.");
      return;
    }

    setIsSubmitting(true);
    try {
      // 5 SCORE MANAGEMENT LOGIC
      // 1. Get current scores ordered by date (ascending to find oldest)
      const { data: currentScores } = await supabase
        .from("scores")
        .select("id")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      // 2. If at capacity (5), delete the oldest record
      if (currentScores && currentScores.length >= 5) {
        await supabase.from("scores").delete().eq("id", currentScores[0].id);
      }

      // 3. Add the new record
      await addScore(user.id, parsedScore, dateInput);
      
      setScoreInput('');
      await fetchData(); 
    } catch (err) {
      setError("Failed to sync score. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgScore = scores.length > 0
    ? (scores.reduce((acc, s) => acc + s.score, 0) / scores.length).toFixed(1)
    : 0;

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.accent }} />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: theme.primary }}>Game Center</h1>
          <p className="font-medium opacity-60" style={{ color: theme.primary }}>Manage your active 5-round rotation.</p>
        </div>

        <div className="flex p-2 rounded-[2rem] border shadow-xl shadow-black/5 bg-white" style={{ borderColor: theme.border }}>
          <StatMini theme={theme} label="Average" value={isPro ? avgScore : '--'} icon={<TrendingUp className="w-4 h-4" />} color={theme.accent} />
          <div className="w-px h-10 self-center bg-slate-100" />
          <StatMini theme={theme} label="Active" value={isPro ? `${scores.length}/5` : '0/5'} icon={<Trophy className="w-4 h-4" />} color={theme.primary} />
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: STATUS & INPUT */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* DYNAMIC DRAW STATUS CARD */}
          <section className="rounded-2xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500" 
            style={{ backgroundColor: hasWon ? theme.accent : theme.primary, color: theme.textOnDark }}>
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-2" style={{ color: hasWon ? theme.primary : theme.accent }}>
                {hasWon ? <Trophy className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {hasWon ? 'Reward Detected' : 'Draw Participation'}
                </span>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl font-black leading-tight">
                    {hasWon ? "You're a Winner!" : (!isPro ? 'Subscriber Only' : scores.length >= 3 ? 'Qualified' : 'Log More')}
                </h3>
                <p className="text-xs font-medium opacity-80">
                  {hasWon ? "Your scores matched the draw! Verify now to claim." : "A minimum of 3 rounds is required for draw eligibility."}
                </p>

                {hasWon ? (
                  <Link to="/dashboard/winnings">
                    <Button className="w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group bg-white" style={{ color: theme.accent }}>
                      Verify Prize <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                ) : (
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: isPro ? `${(scores.length / 5) * 100}%` : '0%' }} className="h-full" style={{ backgroundColor: theme.accent }} />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* INPUT FORM */}
          <section className="bg-white rounded-2xl p-8 border shadow-xl shadow-black/5 relative overflow-hidden" style={{ borderColor: theme.border }}>
            {!isPro && <LockedOverlay theme={theme} />}
            <h2 className="text-xl font-black mb-6 flex items-center gap-2" style={{ color: theme.primary }}>
              <Zap className="w-5 h-5 fill-current" style={{ color: theme.accent }} />
              Log Round
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">Stableford (1-45)</label>
                <input
                  type="number"
                  disabled={!isPro}
                  placeholder="Score"
                  className="w-full px-5 py-4 border rounded-2xl text-lg font-black transition-all outline-none"
                  style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.primary }}
                  value={scoreInput}
                  onChange={(e) => setScoreInput(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-40">Date Played</label>
                <input
                  type="date"
                  disabled={!isPro}
                  className="w-full px-5 py-4 border rounded-2xl text-sm font-bold transition-all outline-none"
                  style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.primary }}
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-[10px] font-bold uppercase p-3 bg-red-50 rounded-xl">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}

              <Button type="submit" disabled={!isPro || isSubmitting} className="w-full py-4 rounded-2xl font-black shadow-lg" style={{ backgroundColor: theme.accent, color: theme.textOnDark }}>
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Confirm & Rotate'}
              </Button>
              <p className="text-[9px] text-center opacity-40 font-bold uppercase tracking-tight">New scores automatically replace the oldest entry</p>
            </form>
          </section>
        </div>

        {/* RIGHT COLUMN: REVERSE CHRONOLOGICAL HISTORY */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-2xl p-8 border shadow-xl shadow-black/5 min-h-[600px] relative overflow-hidden" style={{ borderColor: theme.border }}>
            {!isPro && <LockedOverlay theme={theme} title="History Restricted" />}
            
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl" style={{ backgroundColor: theme.bg }}>
                  <History className="w-6 h-6 opacity-30" style={{ color: theme.primary }} />
                </div>
                <h2 className="text-xl font-black" style={{ color: theme.primary }}>Recent Performance</h2>
              </div>
            </div>

            <AnimatePresence mode="popLayout">
              {scores.length === 0 ? (
                <EmptyState key="empty" theme={theme} isPro={isPro} />
              ) : (
                <div className="space-y-4">
                  {scores.map((s, index) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      key={s.id} 
                      className="flex items-center justify-between p-6 rounded-[2rem] border bg-white" 
                      style={{ borderColor: index === 0 ? theme.accent : theme.border }}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 flex items-center justify-center rounded-2xl font-black text-2xl shadow-sm" style={{ backgroundColor: index === 0 ? theme.accent : theme.primary, color: theme.textOnDark }}>
                          {s.score}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{index === 0 ? "Latest Round" : "Stableford Round"}</p>
                          <p className="text-xs font-medium opacity-50">{new Date(s.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                        </div>
                      </div>
                      {index === 0 && (
                        <div className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter bg-emerald-50 text-emerald-600 border border-emerald-100">Active</div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const EmptyState = ({ theme, isPro }) => (
  <div className="flex flex-col items-center justify-center py-24 text-center px-6">
    <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
      <Target className="w-10 h-10 opacity-10" style={{ color: theme.primary }} />
    </div>
    <h3 className="text-xl font-black" style={{ color: theme.primary }}>{isPro ? "Log your first round" : "History is empty"}</h3>
    <p className="text-sm max-w-[280px] mt-2 font-medium opacity-50">Log up to 5 scores. The most recent score determines your standing.</p>
  </div>
);

const LockedOverlay = ({ theme, title = "Pro Feature" }) => (
  <div className="absolute inset-0 z-20 backdrop-blur-[8px] bg-white/40 flex flex-col items-center justify-center p-6 text-center">
    <div className="p-4 rounded-3xl mb-4 shadow-xl bg-white" style={{ color: theme.accent }}>
      <Lock className="w-6 h-6" />
    </div>
    <h4 className="text-lg font-black" style={{ color: theme.primary }}>{title}</h4>
    <Link to="/payment" className="mt-4">
      <Button className="px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2" style={{ backgroundColor: theme.accent, color: 'white' }}>
        <Crown className="w-3 h-3" /> Upgrade
      </Button>
    </Link>
  </div>
);

const StatMini = ({ label, value, icon, color, theme }) => (
  <div className="px-6 py-2 flex items-center gap-3">
    <div className="p-2 rounded-xl" style={{ backgroundColor: `${color}10`, color: color }}>{icon}</div>
    <div>
      <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 opacity-40" style={{ color: theme.primary }}>{label}</p>
      <p className="text-lg font-black leading-none" style={{ color: theme.primary }}>{value}</p>
    </div>
  </div>
);

export default Scores;