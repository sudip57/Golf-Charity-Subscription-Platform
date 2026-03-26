import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Search, 
  DollarSign, 
  Clock, 
  ExternalLink, 
  User, 
  Calendar, 
  Trophy,
  Filter
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { THEMES } from '../../components/ui/theme';

const Winners = () => {
  const theme = THEMES.forestEthos;
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("winners")
      .select(`
        id,
        match_type,
        prize,
        verification_status,
        payment_status,
        proof_url,
        users ( email ),
        draws ( created_at )
      `)
      .order("created_at", { ascending: false });

    if (!error) setWinners(data || []);
    setLoading(false);
  };

  const handleVerify = async (winnerId) => {
    const { error } = await supabase
      .from("winners")
      .update({ verification_status: "approved" })
      .eq("id", winnerId);
    if (!error) fetchWinners();
  };

  const handlePayout = async (winnerId) => {
    const { error } = await supabase
      .from("winners")
      .update({ payment_status: "paid" })
      .eq("id", winnerId);
    if (!error) fetchWinners();
  };

  const filteredWinners = winners.filter(w =>
    w.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.match_type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 px-4 pt-4 md:pt-8">
      
      {/* HEADER & SEARCH */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: theme.primary }}>
            Winners
          </h1>
          <p className="text-sm font-medium opacity-50" style={{ color: theme.primary }}>
            Verify claims and manage prize distributions.
          </p>
        </div>

        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <Input
            className="pl-11 pr-4 py-6 rounded-2xl border-slate-100 bg-white shadow-sm focus:ring-2 transition-all"
            placeholder="Search email or match type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="w-full">
        {loading ? (
          <div className="py-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest text-xs">
            Syncing Ledger...
          </div>
        ) : filteredWinners.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
            <Filter className="w-10 h-10 mx-auto text-slate-200 mb-3" />
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No matching records found</p>
          </div>
        ) : (
          <>
            {/* MOBILE VIEW: CARD LIST (Hidden on MD+) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredWinners.map(w => (
                <div key={w.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">User Account</p>
                      <p className="text-sm font-bold truncate max-w-[180px]" style={{ color: theme.primary }}>{w.users?.email || "Guest"}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Prize</p>
                      <p className="text-lg font-black text-emerald-600">₹{w.prize || 0}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase">Match Type</p>
                      <p className="text-xs font-bold" style={{ color: theme.primary }}>{w.match_type}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-300 uppercase">Draw Date</p>
                      <p className="text-xs font-bold" style={{ color: theme.primary }}>
                        {w.draws?.created_at ? new Date(w.draws.created_at).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    {w.proof_url ? (
                      <a href={w.proof_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-500 bg-blue-50 px-3 py-2 rounded-xl">
                        <ExternalLink className="w-3 h-3" /> Proof
                      </a>
                    ) : <div />}

                    <div className="flex gap-2">
                      {w.verification_status !== "approved" ? (
                        <Button onClick={() => handleVerify(w.id)} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase" style={{ backgroundColor: theme.primary }}>
                          Verify
                        </Button>
                      ) : w.payment_status !== "paid" ? (
                        <Button onClick={() => handlePayout(w.id)} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase" style={{ backgroundColor: theme.accent }}>
                          Pay
                        </Button>
                      ) : (
                        <span className="text-[10px] font-black text-emerald-500 uppercase bg-emerald-50 px-3 py-2 rounded-xl">Settled ✅</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP VIEW: TABLE (Hidden on Mobile) */}
            <div className="hidden md:block bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Winner</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Evidence</th>
                    <th className="p-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                    <th className="p-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredWinners.map(w => (
                    <tr key={w.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ color: theme.primary }}>{w.users?.email || "Guest"}</p>
                            <div className="flex items-center gap-1.5 opacity-40 text-[10px] font-bold">
                              <Calendar className="w-3 h-3" />
                              {w.draws?.created_at ? new Date(w.draws.created_at).toLocaleDateString() : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black uppercase tracking-tight" style={{ color: theme.primary }}>{w.match_type}</span>
                          <span className="text-emerald-600 font-black text-lg">₹{w.prize || 0}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        {w.proof_url ? (
                          <a href={w.proof_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-[10px] font-black uppercase text-blue-500 hover:underline">
                            <ExternalLink className="w-3 h-3" /> View Proof
                          </a>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-300 uppercase">No File</span>
                        )}
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block w-fit ${w.verification_status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                            {w.verification_status === 'approved' ? 'Verified' : 'Pending'}
                          </span>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block w-fit ${w.payment_status === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                            {w.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                      </td>
                      <td className="p-6 text-right text-white">
                        {w.verification_status !== "approved" ? (
                          <Button onClick={() => handleVerify(w.id)} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: theme.primary }}>
                            <CheckCircle className="w-3 h-3 mr-2" /> Approve
                          </Button>
                        ) : w.payment_status !== "paid" ? (
                          <Button onClick={() => handlePayout(w.id)} className="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest" style={{ backgroundColor: theme.accent }}>
                            <DollarSign className="w-3 h-3 mr-1" /> Disburse
                          </Button>
                        ) : (
                          <div className="flex items-center justify-end gap-2 text-emerald-500 font-black text-[10px] uppercase">
                            <CheckCircle className="w-4 h-4" /> Settled
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Winners;