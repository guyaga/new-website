import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, session } = useAuth();
  const navigate = useNavigate();

  // Already logged in
  if (session) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-3">Admin</p>
          <h1 className="font-sans font-bold text-2xl text-white tracking-tight">Sign In</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-signal-red/10 border border-signal-red/30 rounded-lg px-4 py-3 text-sm text-signal-red font-mono">
              {error}
            </div>
          )}

          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm
                focus:outline-none focus:border-signal-red/50 focus:ring-1 focus:ring-signal-red/20 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-sans text-sm
                focus:outline-none focus:border-signal-red/50 focus:ring-1 focus:ring-signal-red/20 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal-red text-white font-mono text-sm uppercase tracking-wider py-3 rounded-lg
              hover:bg-signal-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
