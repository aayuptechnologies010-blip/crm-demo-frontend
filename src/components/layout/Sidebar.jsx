import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings, 
  X, 
  FileText, 
  Sun, 
  Compass, 
  Wrench, 
  ShieldCheck, 
  CreditCard, 
  LifeBuoy, 
  BriefcaseBusiness,
  Zap,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const allNavItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Super Admin', 'Admin', 'Sales Executive', 'Dealer', 'Installer'] },
  { to: '/leads', icon: Users, label: 'Lead Management', roles: ['Super Admin', 'Admin', 'Sales Executive', 'Dealer'] },
  { to: '/customers', icon: Sun, label: 'Customers & Projects', roles: ['Super Admin', 'Admin', 'Sales Executive'] },
  { to: '/site-surveys', icon: Compass, label: 'Site Surveys', roles: ['Super Admin', 'Admin', 'Installer', 'Sales Executive'] },
  { to: '/quotations', icon: FileText, label: 'Solar Quotations', roles: ['Super Admin', 'Admin', 'Sales Executive'] },
  { to: '/orders', icon: ShoppingBag, label: 'Order Management', roles: ['Super Admin', 'Admin', 'Sales Executive', 'Dealer'] },
  { to: '/installations', icon: Wrench, label: 'Installation & BOS', roles: ['Super Admin', 'Admin', 'Installer'] },
  { to: '/subsidy', icon: ShieldCheck, label: 'PM Surya Ghar / Subsidy', roles: ['Super Admin', 'Admin', 'Sales Executive'] },
  { to: '/payments', icon: CreditCard, label: 'Payments & Receipts', roles: ['Super Admin', 'Admin', 'Sales Executive'] },
  { to: '/services', icon: LifeBuoy, label: 'Service & Complaints', roles: ['Super Admin', 'Admin', 'Installer'] },
  { to: '/dealers', icon: BriefcaseBusiness, label: 'Dealer Network', roles: ['Super Admin', 'Admin', 'Dealer'] },

  { to: '/roles-permissions', icon: ShieldCheck, label: 'Roles & Permissions', roles: ['Super Admin'] },
  { to: '/reports', icon: BarChart3, label: 'Solar Reports', roles: ['Super Admin', 'Admin'] },
  { to: '/settings', icon: Settings, label: 'Settings', roles: ['Super Admin', 'Admin', 'Sales Executive', 'Dealer', 'Installer'] },
];

export default function Sidebar({ open, onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const hasImage = !!currentUser?.profileImage;

  const userRole = currentUser?.role || 'Super Admin';
  const navItems = allNavItems.filter(item => 
    item.roles.includes(userRole) || userRole === 'Super Admin'
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 bg-black/30 z-30 lg:hidden" onClick={onClose} />}

      {/* Classic Clean White & Sky Blue Border Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200/80 z-40 flex flex-col transition-transform duration-300 shadow-sm print:hidden
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>

        {/* Brand Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#166534] via-[#22C55E] to-[#FACC15] p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
                <Sun className="w-5 h-5 text-[#166534] animate-[spin_12s_linear_infinite]" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-xs tracking-wider uppercase bg-gradient-to-r from-[#166534] via-[#15803d] to-[#22C55E] bg-clip-text text-transparent">
                DEVAGYADI BHARAT
              </div>
              <div className="text-[11px] font-bold text-[#166534] tracking-wide flex items-center gap-1">
                <Zap size={11} className="text-[#FACC15] fill-[#FACC15]" /> SOLAR CRM
              </div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-emerald-50 text-slate-500 hover:text-slate-800">
            <X size={18} />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            Solar Operations
          </div>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all group
                ${isActive 
                  ? 'bg-emerald-50 text-[#166534] shadow-xs border border-emerald-200/80 font-extrabold' 
                  : 'text-slate-600 hover:bg-emerald-50/50 hover:text-[#166534]'}`
              }>
              {({ isActive }) => (
                <>
                  <Icon size={18} className={`transition-transform group-hover:scale-110 ${isActive ? 'text-[#166534]' : 'text-slate-400 group-hover:text-[#22C55E]'}`} />
                  <span className="truncate">{label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-[#22C55E] ring-2 ring-emerald-200 animate-pulse"></span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* PM Surya Ghar Mini Badge in Green & Yellow */}
        <div className="mx-3 my-2 p-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-amber-50/60 border border-emerald-200/70 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#166534] text-[#FACC15] flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs">
            ☀️
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-extrabold text-[#166534] truncate">PM Surya Ghar Yojana</p>
            <p className="text-[9px] text-[#22C55E] font-bold">Portal Sync Active</p>
          </div>
        </div>

        {/* User profile footer */}
        <div className="px-3 py-3 border-t border-blue-50">
          <button
            onClick={() => { navigate('/settings'); onClose?.(); }}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-sky-50/60 cursor-pointer transition-colors group text-left">
            <div className="w-9 h-9 rounded-full ring-2 ring-sky-200 overflow-hidden flex-shrink-0 flex items-center justify-center bg-blue-600 text-white text-xs font-bold shadow-xs">
              {hasImage
                ? <img src={currentUser.profileImage} alt={currentUser.name} className="w-full h-full object-cover" />
                : (currentUser?.avatar || 'DB')
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-600 transition-colors">
                {currentUser?.name || 'Devagyadi Admin'}
              </p>
              <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-50 text-blue-700 border border-sky-200">
                {currentUser?.role || 'Super Admin'}
              </span>
            </div>
            <Settings size={15} className="text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
          </button>
        </div>
      </aside>
    </>
  );
}
