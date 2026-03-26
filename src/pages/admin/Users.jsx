import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  Plus, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  ShieldCheck,
  MoreVertical,
  Filter
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedUser, setSelectedUser] = useState(null);
  const [userScores, setUserScores] = useState([]);
  const [editForm, setEditForm] = useState({});
  const [newScore, setNewScore] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers(data || []);
    setLoading(false);
  };

  const handleOpenProfile = async (user) => {
    setSelectedUser(user);
    setEditForm(user);
    const { data } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: false });
    setUserScores(data || []);
  };

  const handleClosePanel = () => {
    setSelectedUser(null);
    setUserScores([]);
    setEditForm({});
    setNewScore('');
  };

  const handleSaveUser = async () => {
    setSaving(true);
    await supabase.from("users").update(editForm).eq("id", selectedUser.id);
    await fetchUsers();
    setSaving(false);
    handleClosePanel();
  };

  const handleAddScore = async () => {
    if (!newScore || isNaN(newScore)) return;
    const scoreValue = parseInt(newScore);
    if (scoreValue < 1 || scoreValue > 45) return;

    const { data: existing } = await supabase
      .from("scores")
      .select("*")
      .eq("user_id", selectedUser.id)
      .order("date", { ascending: true });

    if (existing.length >= 5) {
      await supabase.from("scores").delete().eq("id", existing[0].id);
    }

    await supabase.from("scores").insert({
      user_id: selectedUser.id,
      score: scoreValue,
      date: new Date().toISOString()
    });

    handleOpenProfile(selectedUser);
    setNewScore('');
  };

  const handleDeleteScore = async (id) => {
    await supabase.from("scores").delete().eq("id", id);
    setUserScores(userScores.filter(s => s.id !== id));
  };

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Directory</h1>
          <p className="text-slate-500 font-medium">Manage player profiles and entry eligibility.</p>
        </div>
        
        <div className="relative group min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* USER TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-bottom border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Player</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Registration</th>
                <th className="px-8 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center text-slate-400 italic">Synchronizing database...</td></tr>
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {u.first_name?.[0]}{u.last_name?.[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.first_name} {u.last_name}</p>
                        <p className="text-xs text-slate-500 font-medium">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      u.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {u.subscription_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <button 
                      onClick={() => handleOpenProfile(u)}
                      className="p-2 hover:bg-white hover:shadow-md rounded-xl transition-all border border-transparent hover:border-slate-100"
                    >
                      <Edit2 className="w-4 h-4 text-indigo-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAIL SIDE-PANEL (Slide-over Replacement for Modal) */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={handleClosePanel} />
          
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
            {/* PANEL HEADER */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                  <UserIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900">User Profile</h2>
                  <p className="text-xs text-slate-500 font-medium">Modify core data and scores.</p>
                </div>
              </div>
              <button onClick={handleClosePanel} className="p-2 hover:bg-white rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* PANEL CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* BASIC INFO */}
              <section className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Personal Information</span>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">First Name</label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
                      value={editForm.first_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Last Name</label>
                    <input
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
                      value={editForm.last_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600">Subscription Status</label>
                  <select
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-50 outline-none transition-all appearance-none cursor-pointer"
                    value={editForm.subscription_status}
                    onChange={(e) => setEditForm({ ...editForm, subscription_status: e.target.value })}
                  >
                    <option value="active">Active Subscriber</option>
                    <option value="inactive">Inactive / Free</option>
                  </select>
                </div>
              </section>

              {/* SCORE MANAGEMENT */}
              <section className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score History (Queue)</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded">{userScores.length}/5</span>
                </div>

                <div className="flex gap-2">
                  <input
                    placeholder="New score (1-45)..."
                    type="number"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none"
                    value={newScore}
                    onChange={(e) => setNewScore(e.target.value)}
                  />
                  <Button onClick={handleAddScore} className="px-4 py-2.5 rounded-xl">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {userScores.map((s, idx) => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-slate-300">#{idx + 1}</span>
                        <span className="text-lg font-black text-slate-900">{s.score}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-medium text-slate-400">
                          {new Date(s.date).toLocaleDateString()}
                        </span>
                        <button 
                          onClick={() => handleDeleteScore(s.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-white rounded-lg transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {userScores.length === 0 && (
                    <p className="text-center py-6 text-xs text-slate-400 italic">No scores logged yet.</p>
                  )}
                </div>
              </section>
            </div>

            {/* PANEL FOOTER */}
            <div className="p-8 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button 
                onClick={handleClosePanel}
                className="px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-white transition-all border border-transparent hover:border-slate-200"
              >
                Discard
              </button>
              <Button onClick={handleSaveUser} disabled={saving} className="px-6 py-3 rounded-2xl shadow-lg shadow-indigo-100">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Updating..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;