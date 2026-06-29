import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { Mail, Lock, User, ArrowRight, LogIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register({ name, email, password });
      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        await useCartStore.getState().mergeGuestCartToServer();
        await useCartStore.getState().loadCart();
        const target = redirect
          ? redirect.startsWith('/')
            ? redirect
            : `/${redirect}`
          : '/profile';
        navigate(target);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-primary min-h-screen">
      <Navbar />

      <main className="pt-44 pb-24 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full max-w-md bg-utility-gray/30 border border-utility-gray/50 p-10 sm:p-12 space-y-10 shadow-2xl backdrop-blur-2xl rounded-2xl"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-serif text-secondary tracking-tight">Register</h1>
            <p className="text-secondary/60 font-light text-sm tracking-wide">
              Join the ELIJAY'S Men's Wear inner circle.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs py-3 px-4 text-center tracking-wide rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-accent font-semibold ml-1 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" size={17} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-sleek w-full py-4 pl-11 pr-6 text-sm placeholder:text-secondary/40 bg-utility-gray/20"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-accent font-semibold ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" size={17} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-sleek w-full py-4 pl-11 pr-6 text-sm placeholder:text-secondary/40 bg-utility-gray/20"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-accent font-semibold ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/50" size={17} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-sleek w-full py-4 pl-11 pr-6 text-sm placeholder:text-secondary/40 bg-utility-gray/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-sm tracking-wider inline-flex items-center justify-center space-x-3 shadow-xl mt-8 disabled:opacity-40 rounded-xl"
            >
              <span>{loading ? 'Processing...' : 'Create Account'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="pt-8 border-t border-utility-gray/50 text-center space-y-6">
            <p className="text-xs text-secondary/60 font-light">Already a member?</p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center space-x-2 text-accent/80 hover:text-accent transition-colors tracking-[0.2em] text-[10px] font-semibold group"
            >
              <LogIn size={15} className="group-hover:-translate-y-0.5 transition-transform" />
              <span>Sign In to Account</span>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;
