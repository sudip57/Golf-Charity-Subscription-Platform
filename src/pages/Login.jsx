import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Heart, ArrowLeft, Trophy, Sparkles, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { THEMES } from '../components/ui/theme';

const Login = () => {
  const theme = THEMES.forestEthos;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn({ email, password });
      if (signInError) throw signInError;

      const user = data.user;

      let { data: userData, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!userData) {
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({
            id: user.id,
            email: user.email,
            subscription_status: "active",
            role: "user"
          })
          .select()
          .single();

        if (insertError) throw insertError;
        userData = newUser;
      }

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      
      {/* LEFT SIDE: Authentication Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-10" style={{ backgroundColor: theme.accent }}></div>
        
        <div className="max-w-md w-full mx-auto relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-12"
            style={{ color: theme.primary }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="mb-12 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" 
                 style={{ backgroundColor: theme.primary }}>
              <Heart className="w-6 h-6 fill-white text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter" style={{ color: theme.primary }}>
              ImpactLinks
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-black mb-3 tracking-tight" style={{ color: theme.primary }}>
              Welcome back
            </h1>
            <p className="font-medium opacity-60 mb-10" style={{ color: theme.primary }}>
              Continue your journey of purposeful play.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border-2 focus:ring-0 transition-all"
                style={{ borderColor: `${theme.primary}10` }}
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-2 focus:ring-0 transition-all"
                  style={{ borderColor: `${theme.primary}10` }}
                />
                <div className="flex justify-end">
                  <button type="button" className="text-xs font-bold uppercase tracking-wider opacity-40 hover:opacity-100 transition-opacity" style={{ color: theme.primary }}>
                    Forgot Password?
                  </button>
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-bold flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}

              <Button 
                type="submit" 
                isLoading={loading} 
                className="w-full py-4 rounded-xl shadow-xl font-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: theme.primary, color: '#fff' }}
              >
                Sign In
              </Button>
            </form>

            <p className="mt-10 text-center text-sm font-medium opacity-60" style={{ color: theme.primary }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-black underline underline-offset-4 hover:opacity-70 transition-opacity" style={{ color: theme.accent }}>
                Join the Community
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT SIDE: Branding/Visuals */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden" 
           style={{ backgroundColor: theme.primary }}>
        
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-[150px] opacity-30" style={{ backgroundColor: theme.accent }}></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative z-10 max-w-sm text-center p-12 rounded-[3rem] border border-white/10 backdrop-blur-2xl bg-white/5 shadow-2xl"
        >
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Trophy className="w-10 h-10" style={{ color: theme.accent }} />
          </div>
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Level Up Your Impact</h2>
          <p className="text-white/60 font-medium leading-relaxed mb-8">
            Every login brings you closer to your next milestone and helps provide essential funding to your selected charity.
          </p>
          
          <div className="flex flex-col gap-3 text-left">
             <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40">
                <ShieldCheck className="w-4 h-4" style={{ color: theme.accent }} />
                Verified Secure Access
             </div>
             <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40">
                <Sparkles className="w-4 h-4" style={{ color: theme.accent }} />
                Real-time Stats Sync
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;