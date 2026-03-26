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
  AlertTriangle
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { simulateDraw, runFinalDraw } from '../../lib/drawEngine';
import { motion, AnimatePresence } from 'framer-motion';

const Draws = () => {
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
    // Modified simulateDraw to optionally accept specific numbers
    const result = await simulateDraw(supabase, strategy, customNumbers);
    setSimulationResult(result);
    setSimulating(false);
  };

  const handlePublish = async () => {
    if (!simulationResult) return;
    const confirm = window.confirm("CRITICAL: This will distribute real funds, reset the winner verification table, and clear the current pool. Continue?");
    
    if (!confirm) return;

    setPublishing(true);
    try {
        // runFinalDraw should be designed to:
        // 1. Insert into 'draws'
        // 2. Clear 'winners' table (resetting for the new draw)
        // 3. Update 'users' balances if applicable
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
    if (!window.confirm("Delete this draw record? This will not undo distributed funds but will remove the history entry.")) return;
    
    const { error } = await supabase.from("draws").delete().eq("id", id);
    if (!error) fetchHistory();
  };

  const handleSetAsNewDraw = (numbers) => {
    const confirm = window.confirm("Use these numbers as the basis for a new Draw Simulation?");
    if (confirm) {
        handleSimulate(numbers);
    }
  };

  const getPreviewStats = () => {
    if (!simulationResult) return [];
    const tiers = [
      { id: '5-match', label: 'Jackpot (5)', color: 'text-amber-500 bg-amber-500/10' },
      { id: '4-match', label: 'Tier 2 (4)', color: 'text-indigo-400 bg-indigo-400/10' },
      { id: '3-match', label: 'Tier 3 (3)', color: 'text-emerald-400 bg-emerald-400/10' },
    ];

    return tiers.map(t => ({
      ...t,
      count: simulationResult.preview.filter(p => p.match_type === t.id).length
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Draw Engine</h1>
          <p className="text-slate-500 font-medium">Manage liquidity pools and prize distribution cycles.</p>
        </div>

        <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {['random', 'algorithmic'].map((s) => (
            <button 
              key={s}
              onClick={() => setStrategy(s)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${strategy === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {s === 'random' ? <Dices className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ACTION & PREVIEW */}
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Play className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                  Live Simulation
                </h2>
                <p className="text-sm text-slate-400 font-medium mt-1">Generate a preview of winners based on current pool.</p>
              </div>
              <Button onClick={() => handleSimulate()} disabled={simulating} className="px-8 py-4 rounded-2xl shadow-lg min-w-[160px]">
                {simulating ? "Processing..." : "Run Preview"}
              </Button>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {simulationResult && (
              <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl space-y-8"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Target Numbers</span>
                    <div className="flex gap-3 mt-3">
                      {simulationResult.numbers.map((n, i) => (
                        <div key={i} className="w-12 h-12 bg-white text-slate-900 flex items-center justify-center rounded-2xl font-black text-xl">
                          {n}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">Total Pool</span>
                    <p className="text-3xl font-black mt-1">${simulationResult.totalPool.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getPreviewStats().map((tier) => (
                    <div key={tier.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${tier.color}`}>{tier.label}</span>
                      <p className="text-2xl font-black mt-3">{tier.count}</p>
                      <p className="text-[10px] text-white/40 font-bold uppercase">Winners Found</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="w-full py-5 rounded-2xl bg-indigo-500 hover:bg-indigo-400 text-white font-black text-lg flex items-center justify-center gap-3"
                >
                  {publishing ? <RefreshCcw className="animate-spin" /> : <ShieldCheck />}
                  {publishing ? "Committing to Database..." : "Execute Final Draw"}
                </Button>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* HISTORY & MANAGEMENT */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 min-h-[600px]">
            <h2 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <History className="w-6 h-6 text-slate-300" />
              Draw Archives
            </h2>

            <div className="space-y-4">
              {loadingHistory ? (
                <div className="py-20 text-center animate-pulse text-slate-400">Loading history...</div>
              ) : drawHistory.map((draw) => (
                <div key={draw.id} className="group p-5 rounded-3xl border border-slate-50 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      {new Date(draw.created_at).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleSetAsNewDraw(draw.winning_numbers)}
                        className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg"
                        title="Re-simulate with these numbers"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteDraw(draw.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {draw.winning_numbers?.map((num, i) => (
                      <span key={i} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-xs font-black">
                        {num}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Pool: ${draw.total_pool?.toLocaleString()}</span>
                    {draw.jackpot_rolled && (
                      <span className="text-[9px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">Rollover</span>
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