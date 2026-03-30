import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { 
  CreditCard, CheckCircle2, ShieldCheck, Zap, 
  Star, Crown, ArrowRight, Loader2, Gift, HeartHandshake,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Using navigate for programmatic redirects
import Button from '../../components/ui/Button';
import { THEMES } from '../../components/ui/theme';
const API_BASE_URL = import.meta.env.VITE_STRIPE_PAYMENT_API_URL;
const Membership = () => {
  const theme = THEMES.forestEthos;
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('loading');
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single();
      
      setStatus(data?.subscription_status || 'inactive');
      setLoading(false);
    };
    fetchStatus();
  }, [user]);

  const isPro = status === 'active';

  // HANDLE BILLING LOGIC
  const handleBillingAction = async () => {
    setIsRedirecting(true);
    try {
      if (!isPro) {
        // Option A: Navigate to your internal pricing/payment page
        navigate('/payment');
      } else {
        /** * Option B: Redirect to Stripe Customer Portal
         * This requires a backend endpoint (Edge Function or Node.js)
         * that creates a portal session using stripe.billingPortal.sessions.create()
         */
        const response = await fetch(`${API_BASE_URL}/create-portal-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, customerEmail: user.email }),
        });
        const { url } = await response.json();
        if (url) {
          window.location.href = url; // Redirect to Stripe's hosted management page
        } else {
          throw new Error("Could not load billing portal");
        }
      }
    } catch (err) {
      console.error("Billing Error:", err);
      alert("Billing service is temporarily unavailable.");
    } finally {
      setIsRedirecting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: theme.accent }} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 px-4">
      {/* HEADER */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border" 
             style={{ backgroundColor: `${theme.accent}10`, color: theme.accent, borderColor: `${theme.accent}20` }}>
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Account Security & Billing</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight" style={{ color: theme.primary }}>Your Membership</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* LEFT: CURRENT STATUS */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border shadow-xl shadow-black/5" style={{ borderColor: theme.border }}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-5 rounded-3xl" style={{ backgroundColor: theme.bg, color: isPro ? theme.accent : 'rgba(0,0,0,0.2)' }}>
                {isPro ? <Crown className="w-10 h-10" /> : <CreditCard className="w-10 h-10" />}
              </div>
              <div>
                <h2 className="text-2xl font-black" style={{ color: theme.primary }}>
                  {isPro ? "Pro Member" : "Free Tier"}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mt-2"
                      style={{ 
                        backgroundColor: isPro ? `${theme.accent}20` : theme.bg, 
                        color: isPro ? theme.accent : 'rgba(0,0,0,0.4)' 
                      }}>
                  {isPro && <CheckCircle2 className="w-3.5 h-3.5" />} {status}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t space-y-3" style={{ borderColor: theme.border }}>
              <Button 
                onClick={handleBillingAction}
                disabled={isRedirecting}
                className="w-full py-4 rounded-2xl font-black text-sm shadow-lg flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.accent, color: theme.textOnDark }}
              >
                {isRedirecting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPro ? (
                  <>Manage Billing <ExternalLink className="w-4 h-4" /></>
                ) : (
                  <>Upgrade to Pro <ArrowRight className="w-4 h-4" /></>
                )}
              </Button>
              <p className="text-[10px] text-center font-medium px-4 opacity-40" style={{ color: theme.primary }}>
                {isPro ? "Next billing date: April 26, 2026" : "Upgrade to unlock full platform features."}
              </p>
            </div>
          </div>

          {/* REFERRAL CARD */}
          <div className="rounded-[2rem] p-6 overflow-hidden relative group cursor-pointer" style={{ backgroundColor: theme.primary, color: theme.textOnDark }}>
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5" style={{ color: theme.accent }} />
                <span className="text-xs font-bold uppercase tracking-widest">Refer a Friend</span>
              </div>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>

        {/* RIGHT: PERKS */}
        <div className="md:col-span-7 bg-white rounded-[2.5rem] p-10 border shadow-xl shadow-black/5" style={{ borderColor: theme.border }}>
          <h3 className="text-xl font-black mb-8 flex items-center gap-3" style={{ color: theme.primary }}>
            <Zap className="w-6 h-6 fill-current" style={{ color: theme.accent }} />
            Pro Member Perks
          </h3>
          
          <div className="grid gap-6">
            {[
              { title: "Daily Draw Eligibility", desc: "Enter every daily lottery draw for maximum winning chances.", icon: Star },
              { title: "Impact Multiplier", desc: "Your membership fee fuels 10% more to selected charities.", icon: HeartHandshake },
              { title: "Custom Dashboard", desc: "Access high-performance analytics and visual trackers.", icon: Zap },
              { title: "Priority Verification", desc: "Instant payout verification for all winnings.", icon: ShieldCheck },
            ].map((benefit, i) => (
              <div key={i} className="flex gap-5 group items-start">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110"
                     style={{ backgroundColor: theme.bg, color: theme.accent }}>
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold" style={{ color: theme.primary }}>{benefit.title}</h4>
                  <p className="text-sm opacity-60 leading-relaxed" style={{ color: theme.primary }}>{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;