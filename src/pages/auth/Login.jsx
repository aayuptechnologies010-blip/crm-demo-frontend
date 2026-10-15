import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Users,
  ClipboardList,
  Wrench,
  TrendingUp,
  Leaf,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { requestNotificationPermission } from '../../utils/firebase';

const OLD_KEYS = ['crm_leads', 'crm_followups', 'crm_activities', 'crm_seeded', 'crm_migrated_v2', 'crm_migrated_v3'];
if (!localStorage.getItem('crm_cleaned_v1')) {
  OLD_KEYS.forEach(k => localStorage.removeItem(k));
  localStorage.setItem('crm_cleaned_v1', '1');
}

const FEATURES = [
  { icon: Users,         label: 'Manage Leads', sub: '& Customers' },
  { icon: ClipboardList, label: 'Track Site Surveys', sub: '& Proposals' },
  { icon: Wrench,        label: 'Monitor Installations', sub: '& Payments' },
  { icon: TrendingUp,    label: 'Grow Your Solar Business', sub: 'with Smart Insights' },
];

const STATS = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '50+',     label: 'Projects Completed' },
  { value: '100+',    label: 'Channel Partners' },
  { value: '95%',     label: 'Satisfaction Rate' },
];

export default function Login() {
  const [show, setShow]           = useState(false);
  const [form, setForm]           = useState({ email: '', password: '' });
  const [error, setError]         = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [remember, setRemember]   = useState(true);
  const navigate = useNavigate();
  const { login, currentUser }   = useAuth();

  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true });
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoggingIn(true);
    try {
      const result = await login(form.email, form.password);
      if (result.success) {
        requestNotificationPermission().catch(() => {});
        navigate('/dashboard');
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Check your network connection.');
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row bg-[#082813] font-sans select-none">

      {/* ───────────── LEFT PANEL ───────────── */}
      <div className="relative lg:flex-1 flex flex-col justify-between overflow-hidden h-full">
        
        {/* Background Solar House Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/solar_house.jpg')" }}
        />
        
        {/* High contrast dark emerald gradient overlay so white/gold text is crystal clear */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#041a0b]/95 via-[#082d15]/85 to-[#0b381a]/70" />

        {/* Italic tagline top right */}
        <div className="absolute top-6 right-8 text-right z-10 hidden sm:block">
          <p className="italic font-bold text-emerald-300 text-sm leading-tight drop-shadow-md">
            Clean Energy<br />
            <span className="text-[#FACC15] not-italic font-black text-base">Bright Future</span>
          </p>
        </div>

        {/* TOP: Logo + Headline + Features */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col justify-center flex-1">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative w-12 h-12 flex-shrink-0 bg-white/10 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-lg">
              <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="28" cy="26" r="16" fill="#FACC15" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                  <line
                    key={i}
                    x1="28"
                    y1="26"
                    x2={28 + 20 * Math.cos((deg - 90) * Math.PI / 180)}
                    y2={26 + 20 * Math.sin((deg - 90) * Math.PI / 180)}
                    stroke="#FACC15"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                ))}
                <rect x="20" y="18" width="16" height="12" rx="2" fill="#1d4ed8" opacity="0.95" />
                <line x1="20" y1="22" x2="36" y2="22" stroke="white" strokeWidth="0.8" opacity="0.6" />
                <line x1="20" y1="26" x2="36" y2="26" stroke="white" strokeWidth="0.8" opacity="0.6" />
                <line x1="26" y1="18" x2="26" y2="30" stroke="white" strokeWidth="0.8" opacity="0.6" />
                <line x1="30" y1="18" x2="30" y2="30" stroke="white" strokeWidth="0.8" opacity="0.6" />
                <path d="M16 40 Q20 32 28 34 Q24 42 16 40Z" fill="#22C55E" />
              </svg>
            </div>
            <div>
              <span className="text-white font-extrabold text-lg leading-tight block drop-shadow-md">
                Devagyadi Bharat Solar
              </span>
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mt-0.5">
                CRM Portal
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <div className="mt-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white drop-shadow-lg">
              Powering a<br />
              <span className="text-emerald-400">Greener</span>{' '}
              <span className="text-[#FACC15]">Bharat</span>
            </h1>
            <div className="w-14 h-1.5 bg-[#FACC15] rounded-full mt-3 mb-4 shadow-sm" />
            <p className="text-sm text-emerald-100 font-medium max-w-md drop-shadow">
              Complete Solar Business & Lifecycle Management in One Unified Platform
            </p>
          </div>

          {/* Feature List */}
          <ul className="mt-6 space-y-3">
            {FEATURES.map(({ icon: Icon, label, sub }) => (
              <li key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center flex-shrink-0 shadow">
                  <Icon size={18} className="text-[#FACC15]" />
                </div>
                <span className="text-sm font-semibold text-white drop-shadow">
                  {label} <span className="font-normal text-emerald-200">{sub}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* BOTTOM: Stats Bar */}
        <div className="relative z-10 bg-[#041a0b]/80 backdrop-blur-md border-t border-white/10 px-6 py-4">
          <div className="grid grid-cols-4 gap-2">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-base lg:text-lg font-black text-white">{value}</div>
                <div className="text-[10px] text-emerald-300 font-medium leading-tight mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────── RIGHT PANEL: LOGIN CARD ───────────── */}
      <div className="flex items-center justify-center p-6 lg:p-8 lg:w-[480px] h-full bg-[#f4f8f2] flex-shrink-0 overflow-y-auto">
        <div className="w-full max-w-sm">
          
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-7 sm:p-8">
            
            {/* Logo in Card */}
            <div className="flex items-center gap-2.5 mb-5">
              <div className="relative w-10 h-10 flex-shrink-0 bg-emerald-50 rounded-xl p-1 border border-emerald-100">
                <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <circle cx="28" cy="26" r="16" fill="#FACC15" />
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
                    <line key={i} x1="28" y1="26"
                      x2={28 + 19 * Math.cos((deg - 90) * Math.PI / 180)}
                      y2={26 + 19 * Math.sin((deg - 90) * Math.PI / 180)}
                      stroke="#FACC15" strokeWidth="2" strokeLinecap="round" opacity="0.5"
                    />
                  ))}
                  <rect x="20" y="18" width="16" height="12" rx="2" fill="#1d4ed8" opacity="0.9" />
                  <line x1="20" y1="22" x2="36" y2="22" stroke="white" strokeWidth="0.8" opacity="0.5" />
                  <line x1="20" y1="26" x2="36" y2="26" stroke="white" strokeWidth="0.8" opacity="0.5" />
                  <line x1="26" y1="18" x2="26" y2="30" stroke="white" strokeWidth="0.8" opacity="0.5" />
                  <line x1="30" y1="18" x2="30" y2="30" stroke="white" strokeWidth="0.8" opacity="0.5" />
                  <path d="M16 42 Q20 34 28 36 Q24 44 16 42Z" fill="#22C55E" />
                </svg>
              </div>
              <div>
                <span className="text-[#0a3d1f] font-black text-sm leading-tight block">Devagyadi<br />Bharat Solar</span>
                <div className="text-[9px] font-bold uppercase tracking-widest text-[#166534]">CRM Portal</div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl font-black text-gray-900 mb-1">Welcome Back!</h2>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Login to your CRM account to manage<br />your solar business.
            </p>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-medium">
                ⚠️ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Email / Mobile Number</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="Enter email or mobile number"
                    value={form.email}
                    onChange={e => { setForm({ ...form, email: e.target.value }); setError(''); }}
                    required
                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#166534] focus:ring-3 focus:ring-[#166534]/10 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-gray-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type={show ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => { setForm({ ...form, password: e.target.value }); setError(''); }}
                    required
                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#166534] focus:ring-3 focus:ring-[#166534]/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute inset-y-0 right-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 accent-[#166534] rounded border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs font-medium text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-[#166534] hover:text-[#0a3d1f] transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full flex items-center justify-center gap-2 bg-[#166534] hover:bg-[#0a3d1f] active:scale-[0.99] text-white py-3 rounded-xl text-sm font-bold shadow-md shadow-[#166534]/30 transition-all disabled:opacity-60 cursor-pointer mt-2"
              >
                {loggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Bottom Support / Notice */}
            <div className="mt-6 flex items-center gap-2.5 p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl">
              <div className="w-8 h-8 rounded-xl bg-[#22C55E]/10 flex items-center justify-center flex-shrink-0">
                <Leaf size={16} className="text-[#16a34a]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-[#14532d]">Devagyadi Bharat Solar</p>
                <p className="text-[11px] text-[#166534]/80">Contact admin for new access or support.</p>
              </div>
              <div className="text-lg">🤝</div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
