import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Save, 
  Image as ImageIcon, 
  Star, 
  Globe, 
  Loader2 
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../../components/ui/theme';

const Charities = () => {
  const theme = THEMES.forestEthos;
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCharity, setEditingCharity] = useState(null);
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    image_url: '', 
    category: 'General', 
    is_featured: false,
    website_url: ''
  });

  useEffect(() => {
    fetchCharities();
  }, []);

  const fetchCharities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("charities")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setCharities(data || []);
    setLoading(false);
  };

  const handleOpenModal = (charity = null) => {
    if (charity) {
      setEditingCharity(charity);
      setForm({
        name: charity.name,
        description: charity.description,
        image_url: charity.image_url || '',
        category: charity.category || 'General',
        is_featured: charity.is_featured || false,
        website_url: charity.website_url || ''
      });
    } else {
      setEditingCharity(null);
      setForm({ name: '', description: '', image_url: '', category: 'General', is_featured: false, website_url: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCharity(null);
  };

  const handleSave = async () => {
    if (!form.name || !form.description) return;
    setSaving(true);

    try {
      if (editingCharity) {
        await supabase.from("charities").update(form).eq("id", editingCharity.id);
      } else {
        await supabase.from("charities").insert(form);
      }
      fetchCharities();
      handleCloseModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure? This will remove the charity from all users' profiles.")) return;
    await supabase.from("charities").delete().eq("id", id);
    setCharities(charities.filter(c => c.id !== id));
  };

  if (loading && charities.length === 0) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin" style={{ color: theme.accent }} />
        <p className="font-medium animate-pulse" style={{ color: theme.primary, opacity: 0.6 }}>Loading directory...</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto transition-colors duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between gap-2 sm:items-end bg-white p-8 rounded-[2.5rem] border shadow-xl shadow-black/5"
           style={{ borderColor: theme.border }}>
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: theme.primary }}>Charity Directory</h1>
          <p className="font-medium opacity-60" style={{ color: theme.primary }}>Manage the organizations and impact levels of the platform.</p>
        </div>
        <Button 
          onClick={() => handleOpenModal()} 
          className="rounded-2xl px-6 py-4 shadow-lg transition-transform hover:scale-105"
          style={{ backgroundColor: theme.primary, color: '#fff' }}
        >
          <Plus className="sm:w-5 sm:h-5 mr-2" /> Add New Charity
        </Button>
      </div>

      {/* GRID LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities.map((c, i) => (
          <motion.div 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={c.id} 
            className="group bg-white border rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500"
            style={{ borderColor: theme.border }}
          >
            {/* IMAGE PREVIEW */}
            <div className="h-44 bg-slate-50 relative overflow-hidden" style={{ backgroundColor: theme.bg }}>
              {c.image_url ? (
                <img src={c.image_url} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color: `${theme.primary}20` }}>
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              
              {c.is_featured && (
                <div className="absolute top-4 left-4 p-2 rounded-xl shadow-lg" style={{ backgroundColor: theme.accent }}>
                  <Star className="w-4 h-4 fill-white text-white" />
                </div>
              )}

              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleOpenModal(c)} className="p-3 bg-white/90 backdrop-blur hover:bg-white rounded-2xl shadow-xl text-slate-700 transition-all">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-3 bg-white/90 backdrop-blur hover:bg-red-50 rounded-2xl shadow-xl text-red-500 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full"
                      style={{ backgroundColor: `${theme.accent}15`, color: theme.accent }}>
                  {c.category}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-1" style={{ color: theme.primary }}>{c.name}</h3>
              <p className="text-sm leading-relaxed line-clamp-3 mb-4 opacity-60" style={{ color: theme.primary }}>{c.description}</p>
              
              {c.website_url && (
                <a href={c.website_url} target="_blank" rel="noreferrer" 
                   className="text-xs font-bold flex items-center gap-1 hover:underline"
                   style={{ color: theme.accent }}>
                  <Globe className="w-3 h-3" /> Visit Website
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden border"
              style={{ borderColor: theme.border }}
            >
              <div className="p-8 border-b flex justify-between items-center" style={{ borderColor: theme.border }}>
                <h2 className="text-2xl font-black" style={{ color: theme.primary }}>
                  {editingCharity ? "Refine Charity" : "New Charity Entry"}
                </h2>
                <button onClick={handleCloseModal} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="p-8 grid grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                <div className="col-span-2 md:col-span-1 space-y-4">
                  <Input label="Charity Name" placeholder="e.g. Save the Ocean" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  <Input label="Image URL" placeholder="https://unsplash.com/..." value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
                </div>

                <div className="col-span-2 md:col-span-1 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold opacity-70" style={{ color: theme.primary }}>Category</label>
                    <select 
                      value={form.category} 
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full h-12 border rounded-2xl px-4 focus:ring-2 outline-none transition-all"
                      style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.primary }}
                    >
                      <option>Health</option>
                      <option>Environment</option>
                      <option>Education</option>
                      <option>Animal Welfare</option>
                      <option>General</option>
                    </select>
                  </div>
                  <Input label="Website URL" placeholder="https://..." value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-bold mb-1.5 block opacity-70" style={{ color: theme.primary }}>Full Description</label>
                  <textarea
                    rows={4}
                    className="w-full border rounded-[1.5rem] p-4 focus:ring-2 outline-none transition-all"
                    style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.primary }}
                    placeholder="Tell the story of this charity..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>

                <div className="col-span-2 flex items-center gap-3 p-4 rounded-2xl border" 
                     style={{ backgroundColor: `${theme.accent}05`, borderColor: `${theme.accent}20` }}>
                  <input 
                    type="checkbox" 
                    id="featured"
                    className="w-5 h-5 rounded-lg"
                    style={{ accentColor: theme.accent }}
                    checked={form.is_featured} 
                    onChange={(e) => setForm({...form, is_featured: e.target.checked})}
                  />
                  <label htmlFor="featured" className="text-sm font-bold cursor-pointer" style={{ color: theme.primary }}>
                    Feature this on the Homepage Spotlight
                  </label>
                </div>
              </div>

              <div className="p-8 bg-slate-50 flex gap-3" style={{ backgroundColor: theme.bg }}>
                <Button 
                  className="flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-sm" 
                  onClick={handleSave} 
                  disabled={saving}
                  style={{ backgroundColor: theme.accent, color: '#fff' }}
                >
                  <Save className="w-5 h-5 mr-2" /> {saving ? "Saving Changes..." : "Deploy to Platform"}
                </Button>
                <Button 
                  variant="outline" 
                  className="px-8 rounded-2xl font-bold" 
                  onClick={handleCloseModal}
                  style={{ borderColor: theme.border, color: theme.primary }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Charities;