import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

const AdminLogin = () => {
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
      //  Login
      const { data, error: signInError } = await signIn({ email, password });
      if (signInError) throw signInError;

      const user = data.user;

      //  Check role from DB
      const { data: userData, error: roleError } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (roleError) throw roleError;

      //  Verify admin
      if (userData.role !== "admin") {
        throw new Error("Unauthorized: Not an admin");
      }

      //  Redirect
      navigate('/admin');

    } catch (err) {
      setError(err.message || 'Failed to sign in securely.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8"
        >
          <div className="flex justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-emerald-400" />
          </div>

          <h1 className="text-xl font-bold text-white text-center mb-6">
            Admin Login
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              className="w-full p-2 rounded bg-slate-800 text-white"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              required
              className="w-full p-2 rounded bg-slate-800 text-white"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}

            <Button type="submit" isLoading={loading} className="w-full">
              Login <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;