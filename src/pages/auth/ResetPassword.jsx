import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Sun, Eye, EyeOff, CheckCircle, Lock, ArrowLeft } from 'lucide-react';
import { api } from '../../utils/api';

export default function ResetPassword() {
  const [show, setShow]     = useState({ p: false, c: false });
  const [done, setDone]     = useState(false);
  const [form, setForm]     = useState({ password: '', confirm: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const rules = [
    { label: 'At least 8 characters',    ok: form.password.length >= 8 },
    { label: 'Contains uppercase letter', ok: /[A-Z]/.test(form.password) },
    { label: 'Contains a number',         ok: /\d/.test(form.password) },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!token) { setError('Invalid or missing reset token'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/reset-password', { token, password: form.password });
      setDone(true);
    } catch (err) {
      setError(err.message || 'Reset failed');
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
          {!done ? (
            <>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Security Update
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Set New Password</h2>
                <p className="text-sm text-slate-500 mt-1">Choose a strong password to protect your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { key: 'password', label: 'New Password', showKey: 'p', placeholder: 'Enter new password' },
                  { key: 'confirm', label: 'Confirm Password', showKey: 'c', placeholder: 'Re-enter new password' },
                ].map(({ key, label, showKey, placeholder }) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
                    <div className="relative">
                      <input
                        type={show[showKey] ? 'text' : 'password'}
                        placeholder={placeholder}
                        value={form[key]}
                        onChange={e => { setForm({ ...form, [key]: e.target.value }); setError(''); }}
                        className="w-full px-4 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-600 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 transition-all"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShow(s => ({ ...s, [showKey]: !s[showKey] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {show[showKey] ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                ))}

                {/* Password strength checklist */}
                <div className="space-y-1.5 pt-1">
                  {rules.map(({ label, ok }) => (
                    <div key={label} className="flex items-center gap-2 text-xs">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${ok ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                        {ok ? '✓' : '•'}
                      </div>
                      <span className={ok ? 'text-emerald-700 font-medium' : 'text-slate-400'}>{label}</span>
                    </div>
                  ))}
                </div>

                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#166534] to-[#15803d] hover:from-[#14532d] hover:to-[#166534] text-white py-3 rounded-2xl text-sm font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                >
                  {loading ? 'Updating Password...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Password Changed!</h3>
              <p className="text-sm text-slate-500 mt-2">Your password has been successfully updated.</p>
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 text-sm font-bold transition-all shadow-sm"
              >
                Proceed to Sign In
              </button>
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
