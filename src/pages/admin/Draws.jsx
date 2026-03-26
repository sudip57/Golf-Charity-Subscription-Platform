import React, { useState, useEffect } from 'react';
import { 
  Dices, 
  CheckCircle, 
  Play, 
  History, 
  TrendingUp, 
  Coins, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Trash2,
  RefreshCcw,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { simulateDraw, runFinalDraw } from '../../lib/drawEngine';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../../components/ui/theme';

const Draws = () => {
  const theme = THEMES.forestEthos;
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [strategy, setStrategy] = useState('random'); 

  const [drawHistory, setDrawHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    const { data } = await supabase
      .from("draws")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    setDrawHistory(data || []);
    setLoadingHistory(false);
  };

  const handleSimulate = async (customNumbers = null) => {
    setSimulating(true);
    setSimulationResult(null);
    const result = await simulateDraw(supabase, strategy, customNumbers);
    setSimulationResult(result);
    setSimulating(false);
  };

  const handlePublish = async () => {
    if (!simulationResult) return;
    const confirm = window.confirm("CRITICAL: This will distribute real funds and reset the pool. Continue?");
    if (!confirm) return;

    setPublishing(true);
    try {
        await runFinalDraw(supabase, strategy, simulationResult.numbers);
        setSimulationResult(null);
        fetchHistory();
    } catch (err) {
        alert("Error executing final draw.");
    } finally {
        setPublishing(false);
    }
  };

  const handleDeleteDraw = async (id) => {
    if (!window.confirm("Delete this draw record?")) return;
    const { error } = await supabase.from("draws").delete().eq("id", id);
    if (!error) fetchHistory();
  };

  const handleSetAsNewDraw = (numbers) => {
    if (window.confirm("Use these numbers for a new simulation?")) {
        handleSimulate(numbers);
    }
  };

  const getPreviewStats = () => {
    if (!simulationResult) return [];
    const tiers = [
      { id: '5-match', label: 'Jackpot', color: 'text-amber-500 bg-amber-500/10' },
      { id: '4-match', label: 'Tier 2', color: 'text-indigo-400 bg-indigo-400/10' },
      { id: '3-match', label: 'Tier 3', color: 'text-emerald-400 bg-emerald-400/10' },
    ];
    return tiers.map(t => ({
      ...t,
      count: simulationResult.preview.filter(p => p.match_type === t.id).length
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24 px-4 pt-4 md:pt-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: theme.primary }}>
            Draw Engine
          </h1>
          <p className="text-sm md:text-base font-medium opacity-60" style={{ color: theme.primary }}>
            Manage liquidity pools and prize distribution.
          </p>
        </div>

        {/* Strategy Switcher - Full width on mobile */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 w-full md:w-auto">
          {['random', 'algorithmic'].map((s) => (
            <button 
              key={s}
              onClick={() => setStrategy(s)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                strategy === s 
                ? 'bg-white shadow-md' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
              style={{ color: strategy === s ? theme.primary : undefined }}
            >
              {s === 'random' ? <Dices className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: SIMULATION CONTROLS */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <h2 className="text-lg font-black flex items-center justify-center sm:justify-start gap-2" style={{ color: theme.primary }}>
                  <Play className="w-5 h-5 fill-current" style={{ color: theme.accent }} />
                  Live Simulation
                </h2>
                <p className="text-xs font-medium opacity-50 mt-1">Preview winners before committing to chain.</p>
              </div>
              <Button 
                onClick={() => handleSimulate()} 
                disabled={simulating} 
                className="w-full sm:w-auto px-10 py-4 rounded-2xl shadow-lg font-black uppercase tracking-widest text-[11px] text-white"
                style={{ backgroundColor: theme.primary }}
              >
                {simulating ? "Processing..." : "Run Preview"}
              </Button>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {simulationResult && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="rounded-[2.5rem] p-6 md:p-8 text-white shadow-2xl space-y-8"
                style={{ backgroundColor: theme.primary }}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Target Numbers</span>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {simulationResult.numbers.map((n, i) => (
                        <div key={i} className="w-10 h-10 md:w-12 md:h-12 bg-white text-slate-900 flex items-center justify-center rounded-xl md:rounded-2xl font-black text-lg md:text-xl shadow-inner">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50">Total Pool</span>
                    <p className="text-3xl md:text-4xl font-black mt-1" style={{ color: theme.accent }}>
                      ${simulationResult.totalPool.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {getPreviewStats().map((tier) => (
                    <div key={tier.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${tier.color}`}>{tier.label}</span>
                      <p className="text-2xl font-black mt-2">{tier.count}</p>
                      <p className="text-[9px] opacity-40 font-bold uppercase">Winners Found</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full py-5 rounded-2xl text-white font-black text-base flex items-center justify-center gap-3 transition-transform active:scale-95"
                  style={{ backgroundColor: theme.accent }}
                >
                  {publishing ? <RefreshCcw className="animate-spin w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                  {publishing ? "Writing to DB..." : "Execute Final Draw"}
                </Button>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT: HISTORY ARCHIVES */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <h2 className="text-lg font-black mb-6 flex items-center gap-3" style={{ color: theme.primary }}>
              <History className="w-5 h-5 opacity-30" />
              Draw Archives
            </h2>

            <div className="space-y-3">
              {loadingHistory ? (
                <div className="py-20 text-center animate-pulse text-slate-400 text-xs font-bold uppercase tracking-widest">Syncing Records...</div>
              ) : drawHistory.length === 0 ? (
                <div className="py-20 text-center text-slate-300 text-xs font-bold">No history found.</div>
              ) : drawHistory.map((draw) => (
                <div key={draw.id} className="group p-4 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black opacity-30 uppercase tracking-wider" style={{ color: theme.primary }}>
                      {new Date(draw.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <div className="flex gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleSetAsNewDraw(draw.winning_numbers)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                        style={{ color: theme.accent }}
                      >
                        <RefreshCcw className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDraw(draw.id)}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {draw.winning_numbers?.map((num, i) => (
                      <span key={i} className="w-7 h-7 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-[10px] font-black" style={{ color: theme.primary }}>
                        {num}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-black opacity-40 uppercase" style={{ color: theme.primary }}>
                      ${draw.total_pool?.toLocaleString()} Pool
                    </span>
                    {draw.jackpot_rolled && (
                      <div className="flex items-center gap-1 text-[8px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md uppercase">
                        <TrendingUp className="w-2.5 h-2.5" /> Rollover
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Draws;