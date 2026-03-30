import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Zap, Heart, ShieldCheck } from 'lucide-react';
import { THEMES } from '../../components/ui/theme';
import Button from '../../components/ui/Button';

// Configuration: Fallback to localhost if the env variable isn't set
const API_BASE_URL = import.meta.env.VITE_STRIPE_PAYMENT_API_URL || 'http://localhost:5000';

const Subscription = () => {
  const theme = THEMES.forestEthos;
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkActiveStatus = async () => {
      if (!user) return;
      
      const { data } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single();

      if (data?.subscription_status === 'active') {
        navigate('/dashboard/overview');
      }
    };
    checkActiveStatus();
  }, [user, navigate]);

  const plans = [
    {
      id: 'monthly',
      name: 'Pro Monthly',
      price: '10',
      period: 'month',
      description: 'Perfect for getting started and short-term projects.',
      priceId: 'price_1TEuPQH13AOhoLvHmey69yWQ',
      highlight: false
    },
    {
      id: 'yearly',
      name: 'Pro Yearly',
      price: '100',
      period: 'year',
      description: 'Best value for long-term growth and dedicated users.',
      priceId: 'price_1TEuQlH13AOhoLvHNR9KBCEa',
      highlight: true 
    }
  ];

  const handleSubscription = async (priceId) => {
    try {
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !currentUser) {
        alert("Please log in to subscribe.");
        return;
      }

      // Updated to use API_BASE_URL variable
      const response = await fetch(`${API_BASE_URL}/create-subscription-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          priceId, 
          userId: currentUser.id, 
          customerEmail: currentUser.email 
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Subscription failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Something went wrong. Please check your connection.");
    }
  };

  const handleClose = () => navigate(-1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
      >
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 z-20 p-2 rounded-full hover:bg-slate-100 transition-colors opacity-50 hover:opacity-100"
        >
          <X className="w-6 h-6" style={{ color: theme.primary }} />
        </button>

        <div className="w-full md:w-2/5 p-8 md:p-12 flex flex-col justify-between bg-slate-50 border-r border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-black text-xl tracking-tighter" style={{ color: theme.primary }}>ImpactLinks</span>
            </div>
            
            <h2 className="text-3xl font-black mb-4 tracking-tight" style={{ color: theme.primary }}>
              Elevate your <span style={{ color: theme.accent }}>experience.</span>
            </h2>
            <p className="font-medium text-sm opacity-60 leading-relaxed" style={{ color: theme.primary }}>
              Join a community of developers turning technical performance into social impact. Choose the plan that fits your workflow.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 mt-1" style={{ color: theme.accent }} />
              <div>
                <p className="font-bold text-sm" style={{ color: theme.primary }}>Secure Billing</p>
                <p className="text-xs opacity-50" style={{ color: theme.primary }}>Payments processed via Stripe.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 mt-1" style={{ color: theme.accent }} />
              <div>
                <p className="font-bold text-sm" style={{ color: theme.primary }}>Instant Activation</p>
                <p className="text-xs opacity-50" style={{ color: theme.primary }}>Unlock all features immediately.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/5 p-8 md:p-12 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-6 rounded-[2rem] border-2 transition-all flex flex-col ${
                  plan.highlight ? 'shadow-xl' : 'opacity-80'
                }`}
                style={{ 
                  borderColor: plan.highlight ? theme.accent : `${theme.primary}10`,
                  backgroundColor: plan.highlight ? '#fff' : 'transparent'
                }}
              >
                {plan.highlight && (
                  <span 
                    className="absolute -top-3 left-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white"
                    style={{ backgroundColor: theme.accent }}
                  >
                    Best Value
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="font-black text-lg tracking-tight" style={{ color: theme.primary }}>{plan.name}</h3>
                  <p className="text-xs font-medium opacity-50 mt-1" style={{ color: theme.primary }}>{plan.description}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black" style={{ color: theme.primary }}>${plan.price}</span>
                    <span className="text-xs font-bold opacity-40" style={{ color: theme.primary }}>/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {["Full API Access", "Custom APM Tools", "10% Charity Gift"].map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-[11px] font-bold" style={{ color: theme.primary }}>
                      <Check className="w-3 h-3 text-emerald-500 stroke-[4px]" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handleSubscription(plan.priceId)}
                  className="w-full py-3 rounded-xl font-black uppercase tracking-widest text-[10px] transition-transform hover:scale-[1.03]"
                  style={{ 
                    backgroundColor: plan.highlight ? theme.primary : `${theme.primary}10`,
                    color: plan.highlight ? '#fff' : theme.primary
                  }}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
          
          <p className="mt-8 text-center text-[10px] font-bold uppercase tracking-widest opacity-30" style={{ color: theme.primary }}>
            10% of your subscription supports local charities.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Subscription;