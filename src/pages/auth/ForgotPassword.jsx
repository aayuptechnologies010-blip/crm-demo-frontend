import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { Input, PrimaryButton } from '../../components/shared/FormElements';
import { api } from '../../utils/api';

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[140px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#166534] via-[#22C55E] to-[#FACC15] p-0.5 shadow-lg flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <Sun className="w-6 h-6 text-amber-400 animate-[spin_15s_linear_infinite]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-wide">DEVAGYADI BHARAT</span>
            <div className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase">Solar CRM Portal</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {!sent ? (
            <>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Password Recovery
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Forgot password?</h2>
                <p className="text-sm text-slate-500 mt-1">Enter your registered work email to receive a secure reset link</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input 
                  label="Registered Email Address" 
                  type="email" 
                  placeholder="e.g. employee@devagyadibharat.com"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2.5 rounded-xl">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white py-3 rounded-2xl text-sm font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  {loading ? 'Sending Recovery Link...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail size={24} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Check your email</h3>
              <p className="text-sm text-slate-500 mt-2">We sent a reset instructions link to <strong>{email}</strong></p>
              <Link to="/reset-password"
                className="mt-5 inline-block bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors shadow-sm">
                Open Reset Page
              </Link>
            </div>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 flex justify-center">
            <Link to="/login" className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-700 transition-colors">
              <ArrowLeft size={15} /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
