// NEW — POS seller login
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../../store/useAuthStore';
import { posAuthAPI } from '../../services/api';

const PosLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const posLogin = useAuthStore((s) => s.posLogin);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await posAuthAPI.login({ email, password });
      if (res.data.success) {
        posLogin(res.data.data.user, res.data.data.token);
        toast.success('Welcome to POS');
        navigate('/pos');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-utility-gray/10 border border-accent/30 rounded-2xl p-8 space-y-6"
      >
        <div className="text-center">
          <Store className="mx-auto text-accent mb-3" size={40} />
          <h1 className="text-white text-xl font-semibold">ELIJAY'S POS</h1>
          <p className="text-secondary/50 text-sm mt-1">Seller login</p>
        </div>
        <div>
          <label className="text-secondary/60 text-xs tracking-wider">Email</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-primary border border-white/10 rounded-lg py-3 pl-10 pr-4 text-secondary"
            />
          </div>
        </div>
        <div>
          <label className="text-secondary/60 text-xs tracking-wider">Password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/30" size={18} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-primary border border-white/10 rounded-lg py-3 pl-10 pr-4 text-secondary"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-3 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Start shift'}
        </button>
      </motion.form>
    </div>
  );
};

export default PosLogin;
