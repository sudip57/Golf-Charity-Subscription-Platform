import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { THEMES } from '../../components/ui/theme';
import { Heart, Loader2, Search, Coins, Sparkles, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

// Sub-components
import SpotlightCarousel from '../components/SpotlightCarousel';
import CharityCard from '../components/CharityCard';

const Charities = () => {
  const theme = THEMES.forestEthos;
  const { user } = useAuth();

  const [charities, setCharities] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProcessingDonation, setIsProcessingDonation] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [donationAmount, setDonationAmount] = useState(10);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [charitiesRes, userProfileRes] = await Promise.all([
        supabase.from('charities').select('*'),
        supabase.from('users').select('selected_charity_id, charity_percentage, subscription_status').eq('id', user.id).single()
      ]);
      if (!charitiesRes.error) setCharities(charitiesRes.data);
      if (!userProfileRes.error) setUserProfile(userProfileRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCharity = async (charityId) => {
    setIsUpdating(true);
    const { error } = await supabase.from('users').update({ selected_charity_id: charityId }).eq('id', user.id);
    if (!error) setUserProfile(prev => ({ ...prev, selected_charity_id: charityId }));
    setIsUpdating(false);
  };

  const handlePercentageChange = async (val) => {
    const newVal = parseInt(val);
    setUserProfile(prev => ({ ...prev, charity_percentage: newVal }));
    await supabase.from('users').update({ charity_percentage: newVal }).eq('id', user.id);
  };

  const handleDirectDonation = async () => {
    try {
      setIsProcessingDonation(true);
      const response = await fetch('http://localhost:5000/create-donation-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: donationAmount,
          userId: user.id,
          customerEmail: user.email,
          charityId: userProfile?.selected_charity_id || charities[0]?.id
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to initiate session');
      }
    } catch (err) {
      alert("Donation failed to initialize. Check if your backend is running.");
      console.error(err);
    } finally {
      setIsProcessingDonation(false);
    }
  };

  const filteredCharities = charities.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-10 h-10 animate-spin" style={{ color: theme.accent }} />
      <p className="font-bold opacity-40 uppercase tracking-widest text-xs">Syncing Impact Data</p>
    </div>
  );

  const sliderPercentage = (((userProfile?.charity_percentage || 10) - 10) / (50 - 10)) * 100;

  return (
    <div className="min-h-full space-y-12 pb-20 px-4 transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      
      {/* 1. FEATURED SECTION (NOW OPEN TO ALL) */}
      <div className="relative">
        <SpotlightCarousel 
            featuredCharities={charities.filter(c => c.is_featured)}
            userProfile={userProfile}
            isUpdating={isUpdating}
            onUpdateCharity={handleUpdateCharity}
            theme={theme}
        />
      </div>

      {/* 2. IMPACT & SLIDER SECTION (NOW OPEN TO ALL) */}
      <section className="bg-white border rounded-2xl p-8 md:p-10 shadow-xl relative overflow-hidden" style={{ borderColor: theme.border }}>
        <style>{`
          .impact-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 10px;
            border-radius: 20px;
            background: linear-gradient(to right, ${theme.accent} ${sliderPercentage}%, ${theme.primary}15 ${sliderPercentage}%);
            border: 1px solid ${theme.border};
          }
          .impact-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 26px;
            height: 26px;
            border-radius: 50%;
            background: ${theme.accent};
            border: 3px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        `}</style>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-2xl font-black tracking-tight" style={{ color: theme.primary }}>Adjust Your Impact</h3>
            <div className="flex items-center gap-8 p-6 rounded-3xl border" style={{ backgroundColor: `${theme.bg}50`, borderColor: theme.border }}>
              <div className="flex-grow pt-2">
                <input 
                  type="range" min="10" max="50" step="5" 
                  value={userProfile?.charity_percentage || 10} 
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  className="impact-slider cursor-pointer"
                />
              </div>
              <div className="text-center min-w-[85px] py-2 px-4 rounded-2xl bg-white border" style={{ borderColor: theme.border }}>
                <span className="text-3xl font-black block" style={{ color: theme.accent }}>
                    {userProfile?.charity_percentage || 10}%
                </span>
              </div>
            </div>
          </div>

          {/* Direct Donation */}
          <div className="lg:col-span-3 relative overflow-hidden rounded-xl p-8 border group bg-slate-50" style={{ borderColor: theme.border }}>
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2" style={{ color: theme.accent }}>
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Public Contribution</span>
                </div>
                <h4 className="text-xl font-black" style={{ color: theme.primary }}>Make a Direct Donation</h4>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 25, 50].map(amt => (
                    <button key={amt} onClick={() => setDonationAmount(amt)} className="px-5 py-2.5 rounded-xl text-xs font-black transition-all border-2"
                      style={{ 
                        backgroundColor: donationAmount === amt ? theme.accent : "white", 
                        color: donationAmount === amt ? "white" : theme.primary,
                        borderColor: donationAmount === amt ? theme.accent : theme.border
                      }}>
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>
              <Button 
                onClick={handleDirectDonation}
                disabled={isProcessingDonation}
                className="w-full md:w-auto px-8 py-5 rounded-2xl font-black shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105" 
                style={{ backgroundColor: theme.accent, color: "white" }}>
                {isProcessingDonation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Heart className="w-5 h-5 fill-current" />}
                {isProcessingDonation ? "Redirecting..." : `Give $${donationAmount}`}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DIRECTORY SECTION */}
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-4xl font-black tracking-tight" style={{ color: theme.primary }}>Explore charities</h2>
            <p className="text-sm font-medium opacity-50 mt-1">Select a mission to support through your automated impact.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" style={{ color: theme.primary }} />
            <input 
              type="text" 
              placeholder="Search missions..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-4 bg-white border rounded-2xl text-sm w-full outline-none focus:ring-4" 
              style={{ borderColor: theme.border, '--tw-ring-color': `${theme.accent}20` }} 
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCharities.map((charity) => (
              <CharityCard 
                key={charity.id} 
                charity={charity} 
                isSelected={userProfile?.selected_charity_id === charity.id}
                isUpdating={isUpdating}
                onSelect={handleUpdateCharity}
                theme={theme}
                isLocked={false} 
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Charities;