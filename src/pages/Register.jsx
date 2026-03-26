import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Heart, ArrowLeft, Users, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { THEMES } from '../components/ui/theme';

const Register = () => {
  const theme = THEMES.forestEthos;
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    selectedCharityId: ''
  });
  
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingCharities, setFetchingCharities] = useState(true);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const { data, error } = await supabase
          .from('charities')
          .select('id, name')
          .order('name', { ascending: true });
        
        if (error) throw error;
        setCharities(data || []);
      } catch (err) {
        console.error('Error fetching charities:', err.message);
      } finally {
        setFetchingCharities(false);
      }
    };
    fetchCharities();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.selectedCharityId) {
      setError('Please select a charity to support.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signUpError } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      });

      if (signUpError) throw signUpError;
      const user = data.user;

      const { error: insertError } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        subscription_status: "inactive",
        role: "user",
        selected_charity_id: formData.selectedCharityId,
        charity_percentage: 10
      });

      if (insertError) throw insertError;
      navigate('/payment');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex transition-colors duration-500" style={{ backgroundColor: theme.bg }}>
      
      {/* LEFT: Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] opacity-10" style={{ backgroundColor: theme.accent }}></div>
        
        <div className="max-w-md w-full mx-auto relative z-10">
          <Link 
            to="/" 
            className="inline-flex items-center text-sm font-bold uppercase tracking-widest opacity-50 hover:opacity-100 transition-opacity mb-8"
            style={{ color: theme.primary }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <div className="mb-8 flex items-center gap-3">
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
            <h1 className="text-4xl font-black mb-2 tracking-tight" style={{ color: theme.primary }}>
              Join the Movement
            </h1>
            <p className="font-medium opacity-60 mb-8" style={{ color: theme.primary }}>
              Create an account to start playing with purpose.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  name="firstName"
                  required
                  placeholder="Jane"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="rounded-xl border-2 transition-all"
                  style={{ borderColor: `${theme.primary}10` }}
                />
                <Input
                  label="Last Name"
                  name="lastName"
                  required
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="rounded-xl border-2 transition-all"
                  style={{ borderColor: `${theme.primary}10` }}
                />
              </div>
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
                className="rounded-xl border-2 transition-all"
                style={{ borderColor: `${theme.primary}10` }}
              />

              <Input
                label="Create Password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="rounded-xl border-2 transition-all"
                style={{ borderColor: `${theme.primary}10` }}
              />

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-widest opacity-70" style={{ color: theme.primary }}>
                  Choose Your Impact
                </label>
                <div className="relative group">
                  <select
                    name="selectedCharityId"
                    required
                    value={formData.selectedCharityId}
                    onChange={handleChange}
                    disabled={fetchingCharities}
                    className="w-full h-12 px-4 py-2 bg-white border-2 rounded-xl text-sm font-bold focus:outline-none transition-all appearance-none disabled:bg-slate-50 disabled:text-slate-400"
                    style={{ borderColor: `${theme.primary}10`, color: theme.primary }}
                  >
                    <option value="" disabled>
                      {fetchingCharities ? 'Synchronizing charities...' : 'Select a foundation...'}
                    </option>
                    {charities.map((charity) => (
                      <option key={charity.id} value={charity.id}>
                        {charity.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none opacity-40">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-center gap-2 px-1">
                  <Sparkles className="w-3 h-3" style={{ color: theme.accent }} />
                  <p className="text-[11px] font-bold opacity-50" style={{ color: theme.primary }}>
                    10% of monthly fees donated automatically.
                  </p>
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
                disabled={loading || fetchingCharities}
                className="w-full py-4 rounded-xl shadow-xl font-black uppercase tracking-widest transition-transform hover:scale-[1.02] active:scale-[0.98] mt-4"
                style={{ backgroundColor: theme.primary, color: '#fff' }}
              >
                Create Account
              </Button>
            </form>

            <p className="mt-8 text-center text-sm font-medium opacity-60" style={{ color: theme.primary }}>
              Already a member?{' '}
              <Link to="/login" className="font-black underline underline-offset-4 hover:opacity-70 transition-opacity" style={{ color: theme.accent }}>
                Sign In
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT: Visual Side */}
      <div className="hidden lg:flex w-1/2 relative items-end p-16 overflow-hidden" 
           style={{ backgroundColor: theme.primary }}>
        
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1535183311679-b1d683de614e?q=80&w=1500&auto=format&fit=crop')] bg-cover"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20" style={{ backgroundColor: theme.accent }}></div>
        
        <div className="relative z-10 max-w-lg">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl mb-8">
              <Users className="w-10 h-10" style={{ color: theme.accent }} />
            </div>
            
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-[1.1]">
              Be part of <br/>something <span style={{ color: theme.accent }}>bigger.</span>
            </h2>
            
            <div className="space-y-6">
              {[
                "Direct impact on verified global charities",
                "Advanced performance tracking dashboard",
                "Exclusive access to monthly prize draws"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white/10">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white/70 font-medium">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;