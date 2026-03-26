import { useState, useEffect, useRef } from 'react';
import { 
  UploadCloud, CheckCircle2, Trophy, Wallet, Clock, 
  AlertCircle, FileText, IndianRupee, X, Lock, 
  Crown, ArrowRight, Image as ImageIcon, History
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../../components/ui/theme';
import { Link } from 'react-router-dom';

const Winnings = () => {
  const theme = THEMES.forestEthos;
  const { user } = useAuth();

  const [fileSelected, setFileSelected] = useState(false);
  const [uploadState, setUploadState] = useState('idle');
  const [winnings, setWinnings] = useState([]);
  const [selectedWinnerId, setSelectedWinnerId] = useState(null);
  const [error, setError] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState('loading');

  const fileInputRef = useRef(null);

  // Stats Logic
  const totalWon = winnings.reduce((acc, curr) => acc + (Number(curr.prize) || 0), 0);
  const pendingVerification = winnings.filter(w => !w.proof_url).length;

  const fetchData = async () => {
    try {
      const [winningsRes, userRes] = await Promise.all([
        supabase
          .from("winners")
          .select(`
            id, match_type, verification_status, payment_status, proof_url, prize, created_at,
            draws ( id, winning_numbers, created_at )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from('users').select('subscription_status').eq('id', user.id).single()
      ]);

      if (winningsRes.error) throw winningsRes.error;
      setWinnings(winningsRes.data || []);
      setSubscriptionStatus(userRes.data?.subscription_status || 'inactive');
    } catch (err) {
      setError("Failed to load your winnings history.");
    }
  };

  useEffect(() => { if (user?.id) fetchData(); }, [user]);

  const isPro = subscriptionStatus === 'active';

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Please upload an image (PNG/JPG)"); return; }
    setError(null);
    setFileSelected(true);
  };

  const handleUploadSubmit = async () => {
    if (!isPro || !fileSelected || !selectedWinnerId) return;
    try {
      setUploadState('uploading');
      const file = fileInputRef.current.files[0];
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("proofs").upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("proofs").getPublicUrl(filePath);
      const { error: updateError } = await supabase.from("winners")
        .update({ proof_url: urlData.publicUrl, verification_status: "pending" })
        .eq("id", selectedWinnerId);

      if (updateError) throw updateError;
      setUploadState('success');
      setFileSelected(false);
      setSelectedWinnerId(null);
      fetchData();
      setTimeout(() => setUploadState('idle'), 3000);
    } catch (err) {
      setUploadState('idle');
      setError("Upload failed. Please check your connection.");
    }
  };

  const getStatusUI = (w) => {
    if (!w.proof_url) return { label: "Pending Proof", color: "text-amber-600 bg-amber-50", icon: <AlertCircle className="w-3 h-3"/> };
    if (w.verification_status === "pending") return { label: "Verifying", color: "text-blue-600 bg-blue-50", icon: <Clock className="w-3 h-3"/> };
    if (w.verification_status === "approved") return { label: "Verified", color: "text-emerald-600 bg-emerald-50", icon: <CheckCircle2 className="w-3 h-3"/> };
    return { label: "Rejected", color: "text-rose-600 bg-rose-50", icon: <X className="w-3 h-3"/> };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4">
      
      {/* 1. GUIDED WORKFLOW STEPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <StepCard number="1" title="Select Draw" desc="Choose a winning entry from your list below." active={!selectedWinnerId} done={!!selectedWinnerId} theme={theme} />
        <StepCard number="2" title="Upload Proof" desc="Submit a screenshot of your winning ticket." active={!!selectedWinnerId && !fileSelected} done={fileSelected} theme={theme} />
        <StepCard number="3" title="Submit" desc="Our team will verify and process your payout." active={fileSelected} theme={theme} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* 2. LEFT: DRAW HISTORY (THE SOURCE) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History className="w-6 h-6 opacity-40" />
              <h2 className="text-2xl font-black" style={{ color: theme.primary }}>Latest Draw</h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-bold opacity-50 uppercase tracking-widest">
              <span>{winnings.length} Entries Found</span>
            </div>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {winnings.length === 0 ? (
              <EmptyState theme={theme} />
            ) : (
              winnings.map((w) => {
                const isSelected = selectedWinnerId === w.id;
                const status = getStatusUI(w);
                return (
                  <motion.div 
                    layout 
                    key={w.id} 
                    onClick={() => isPro && setSelectedWinnerId(w.id)}
                    className={`group relative p-6 rounded-2xl border-2 transition-all cursor-pointer bg-white ${isSelected ? 'shadow-xl ' : 'hover:border-gray-200 opacity-80 hover:opacity-100'}`}
                    style={{ borderColor: isSelected ? theme.accent : 'transparent' }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className={`p-4 rounded-3xl transition-colors ${isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-xl" style={{ color: theme.primary }}>₹{w.prize}</h3>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            {w.draws?.winning_numbers?.map((num, i) => (
                              <span key={i} className="w-7 h-7 flex items-center justify-center text-[10px] font-bold rounded-xl border bg-white shadow-sm" style={{ color: theme.primary }}>{num}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <ArrowRight className={`w-5 h-5 transition-transform ${isSelected ? 'translate-x-1 opacity-100' : 'opacity-0'}`} style={{ color: theme.accent }} />
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. RIGHT: ACTION PANEL (SUBMISSION) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-white border-2 rounded-[3rem] p-8 shadow-2xl shadow-emerald-900/5 relative overflow-hidden" style={{ borderColor: theme.border }}>
            
            {!isPro && <ProLockOverlay theme={theme} />}

            <div className="space-y-8">
              <header className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black" style={{ color: theme.primary }}>Verify Win</h2>
                  <p className="text-xs font-medium opacity-50 mt-1">Submit visual proof to claim reward.</p>
                </div>
                <Stat theme={theme} icon={<Trophy className="w-4 h-4 text-amber-500" />} label="Total" value={`₹${totalWon}`} />
              </header>

              <AnimatePresence mode="wait">
                {uploadState === 'success' ? (
                  <SuccessCard theme={theme} />
                ) : (
                  <div className="space-y-6">
                    {/* File Dropzone */}
                    <div className="relative group">
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="proof-upload" disabled={!isPro || !selectedWinnerId} />
                      <label htmlFor="proof-upload" 
                        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-[2.5rem] transition-all
                          ${selectedWinnerId ? 'cursor-pointer hover:bg-slate-50' : 'opacity-30 cursor-not-allowed'}`}
                        style={{ backgroundColor: theme.bg, borderColor: theme.border }}>
                        
                        {fileSelected ? (
                          <div className="text-center">
                            <div className="bg-emerald-500 text-white p-3 rounded-2xl mx-auto w-fit mb-3"><ImageIcon className="w-6 h-6" /></div>
                            <span className="text-xs font-black" style={{ color: theme.primary }}>{fileInputRef.current.files[0].name.slice(0, 20)}...</span>
                          </div>
                        ) : (
                          <div className="text-center px-6">
                            <UploadCloud className="w-10 h-10 mx-auto opacity-20 mb-3" />
                            <p className="text-xs font-bold opacity-40 uppercase tracking-widest">
                              {selectedWinnerId ? "Drop screenshot here" : "Select a draw first"}
                            </p>
                          </div>
                        )}
                      </label>
                    </div>

                    {error && <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1.5"><AlertCircle className="w-3 h-3"/> {error}</p>}

                    <Button 
                      className="w-full py-5 rounded-2xl font-black shadow-lg shadow-emerald-500/10 transition-transform active:scale-95" 
                      style={{ backgroundColor: theme.accent, color: 'white' }}
                      onClick={handleUploadSubmit} 
                      disabled={!isPro || !fileSelected || !selectedWinnerId || uploadState === 'uploading'}
                    >
                      {uploadState === 'uploading' ? <Loader theme={theme} /> : "Submit Claim Request"}
                    </Button>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                      <p className="text-[10px] leading-relaxed opacity-50 font-medium">
                        * Verification usually takes 24-48 hours. Ensure the draw ID and numbers are clearly visible in your screenshot.
                      </p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

const StepCard = ({ number, title, desc, active, done, theme }) => (
  <div className={`p-5 rounded-[2rem] border-2 transition-all ${active ? 'bg-white shadow-lg' : 'bg-transparent opacity-40'}`}
    style={{ borderColor: active ? theme.accent : 'transparent' }}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm transition-colors
        ${done ? 'bg-emerald-500 text-white' : active ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
        {done ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <div>
        <h4 className="font-black text-sm" style={{ color: theme.primary }}>{title}</h4>
        <p className="text-[10px] font-medium opacity-60 leading-tight mt-0.5">{desc}</p>
      </div>
    </div>
  </div>
);

const ProLockOverlay = ({ theme }) => (
  <div className="absolute inset-0 z-30 backdrop-blur-md bg-white/60 flex flex-col items-center justify-center p-8 text-center">
    <div className="p-4 rounded-3xl mb-4 shadow-xl bg-white" style={{ color: theme.accent }}>
      <Crown className="w-8 h-8" />
    </div>
    <h3 className="font-black text-xl mb-2" style={{ color: theme.primary }}>Unlock Payouts</h3>
    <p className="text-xs font-medium opacity-70 mb-8 max-w-[200px]">Only Pro members can verify their wins and claim cash prizes.</p>
    <Link to="/payment">
      <Button className="px-8 py-4 rounded-2xl font-black text-xs shadow-2xl" style={{ backgroundColor: theme.accent, color: 'white' }}>
        Get Pro Membership
      </Button>
    </Link>
  </div>
);

const SuccessCard = ({ theme }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center py-10">
    <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
      <CheckCircle2 className="w-10 h-10" />
    </div>
    <h3 className="text-2xl font-black mb-2" style={{ color: theme.primary }}>Claim Submitted!</h3>
    <p className="text-sm font-medium opacity-50 px-6">Your proof is now being reviewed by our specialists. Check back soon!</p>
  </motion.div>
);

const Stat = ({ theme, icon, label, value }) => (
  <div className="text-right">
    <div className="flex items-center justify-end gap-1.5 opacity-40 mb-1">
      {icon} <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-xl font-black" style={{ color: theme.primary }}>{value}</p>
  </div>
);

const EmptyState = ({ theme }) => (
  <div className="border-4 border-dashed rounded-[3rem] py-24 text-center opacity-30" style={{ borderColor: theme.border }}>
    <Trophy className="w-16 h-16 mx-auto mb-4" />
    <p className="font-black text-lg">No wins recorded yet.</p>
    <p className="text-xs font-bold uppercase tracking-widest">Keep playing to see your name here!</p>
  </div>
);

const Loader = ({ theme }) => (
  <div className="flex items-center gap-2">
    <div className="w-2 h-2 rounded-full animate-bounce bg-white" />
    <div className="w-2 h-2 rounded-full animate-bounce bg-white [animation-delay:-.3s]" />
    <div className="w-2 h-2 rounded-full animate-bounce bg-white [animation-delay:-.5s]" />
  </div>
);

export default Winnings;