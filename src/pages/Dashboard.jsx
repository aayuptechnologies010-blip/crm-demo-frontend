import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../components/shared/Skeleton';
import {
  Users,
  Sun,
  Wrench,
  CreditCard,
  ShieldCheck,
  LifeBuoy,
  TrendingUp,
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  MapPin,
  FileText
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import Card from '../components/shared/Card';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_SOLAR_LEADS, SAMPLE_SOLAR_PROJECTS } from '../data/solarData';

const KPI_DATA = [
  { label: 'Total Leads', val: '148', change: '+12% this week', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { label: 'Total Installed kW', val: '840 kW', change: '+45 kW this month', icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { label: 'Active Projects', val: '32', change: '8 in commissioning', icon: Zap, color: 'text-solar-700', bg: 'bg-solar-50 border-solar-200' },
  { label: 'Installation Pending', val: '14 Sites', change: 'Avg 4 days ETA', icon: Wrench, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  { label: 'Subsidy Pending', val: '19 Claims', change: '₹14.82 Lakh', icon: ShieldCheck, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  { label: 'Payment Pending', val: '₹18.4 Lakh', change: '6 Overdue tokens', icon: CreditCard, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  { label: 'Open Complaints', val: '3 Tickets', change: 'All within SLA', icon: LifeBuoy, color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
  { label: 'Dealer Network', val: '24 Partners', change: '3 Top performers', icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
];

const MONTHLY_KW_DATA = [
  { month: 'May', kw: 45, projects: 8 },
  { month: 'Jun', kw: 72, projects: 12 },
  { month: 'Jul', kw: 95, projects: 16 },
  { month: 'Aug', kw: 130, projects: 22 },
  { month: 'Sep', kw: 160, projects: 26 },
  { month: 'Oct', kw: 210, projects: 34 },
];

const CAPACITY_DISTRIBUTION = [
  { name: '2 kW - 3 kW (Domestic)', value: 45, color: '#16a34a' },
  { name: '4 kW - 5 kW (Residential High)', value: 30, color: '#f59e0b' },
  { name: '6 kW - 10 kW (Villas/Small Com)', value: 15, color: '#0284c7' },
  { name: '10 kW+ (Commercial/Instit.)', value: 10, color: '#9333ea' },
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [selectedRange, setSelectedRange] = useState('This Month');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Smooth initial data skeleton resolution
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome in Green #166534, Emerald #22C55E & Solar Yellow #FACC15 */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#166534] via-[#15803d] to-[#22C55E] border border-emerald-500/30 p-6 shadow-md text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#FACC15]/20 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-[#FACC15] text-xs font-black mb-2 shadow-xs">
              <Sun size={14} className="text-[#FACC15] animate-spin fill-[#FACC15]" /> PM Surya Ghar Muft Bijli Yojana Partner
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight font-display">
              Devagyadi Bharat Solar Operations Hub
            </h1>
            <p className="text-xs text-emerald-100 font-medium mt-1 max-w-xl">
              Namaste, <span className="text-[#FACC15] font-extrabold">{currentUser?.name || 'Director'}</span>. Real-time solar project execution, site surveys, PM Surya Ghar subsidy pipeline, and technician logistics monitor.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-100 font-semibold hidden sm:inline">Timeframe:</span>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="bg-black/20 backdrop-blur-md text-white border border-white/30 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FACC15]">
              <option className="text-slate-800">Today</option>
              <option className="text-slate-800">This Week</option>
              <option className="text-slate-800">This Month</option>
              <option className="text-slate-800">FY 2026-27</option>
            </select>
            <a
              href="/quotations"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FACC15] hover:bg-yellow-400 text-[#166534] font-black text-xs shadow-md transition-all">
              <Zap size={14} className="text-[#166534] fill-[#166534]" /> Quick Quotation
            </a>
          </div>
        </div>
      </div>

      {/* 8 Primary Solar KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-200 ${kpi.bg}`}>
                  <Icon size={18} className={kpi.color} />
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900 font-display tracking-tight">{kpi.val}</div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] font-semibold text-slate-500">
                <span className="inline-flex items-center text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-bold">
                  <ArrowUpRight size={12} className="mr-0.5" />
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Section: Installed kW Velocity & Solar Capacity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* kW Generation / Commissioning Growth */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800">Installed Solar Capacity (kW Growth)</h2>
              <p className="text-xs text-slate-400">Total kW commissioned month-by-month across UP districts</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-solar-100 text-solar-800 border border-solar-200">
              ⚡ 840 kW Cumulative
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_KW_DATA}>
                <defs>
                  <linearGradient id="solarGreenGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit=" kW" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                  formatter={(val) => [`${val} kW Installed`, 'Capacity']}
                />
                <Area type="monotone" dataKey="kw" stroke="#15803d" strokeWidth={3} fillOpacity={1} fill="url(#solarGreenGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Capacity Slabs Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-800">Consumer Segment Mix</h2>
            <p className="text-xs text-slate-400">Rooftop installations by capacity tier</p>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={CAPACITY_DISTRIBUTION}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value">
                  {CAPACITY_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-auto pt-2 border-t border-slate-100">
            {CAPACITY_DISTRIBUTION.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 truncate max-w-[170px]">{item.name}</span>
                </div>
                <span className="font-bold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Solar Leads Pipeline & Live Project Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Solar Leads */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-solar-50 rounded-xl text-solar-700">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Recent Solar Leads</h3>
                <p className="text-[11px] text-slate-400">Incoming inquiries for rooftop survey & solar estimation</p>
              </div>
            </div>
            <a href="/leads" className="text-xs font-semibold text-solar-700 hover:text-solar-800">View All →</a>
          </div>

          <div className="divide-y divide-slate-100">
            {SAMPLE_SOLAR_LEADS.slice(0, 4).map(lead => (
              <div key={lead.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 truncate">{lead.customerName}</span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {lead.requiredKw}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {lead.district}</span>
                    <span>• Bill: {lead.electricityBillAvg}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${lead.status === 'Installation' ? 'bg-purple-100 text-purple-700' :
                      lead.status === 'Booking' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'Site Survey' ? 'bg-amber-100 text-amber-800' :
                          lead.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                    {lead.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">Due: {lead.followUpDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Project Execution & Subsidy Tracker */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-700">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">PM Surya Ghar Projects Active</h3>
                <p className="text-[11px] text-slate-400">Live DISCOM net meter & subsidy clearance pipeline</p>
              </div>
            </div>
            <a href="/subsidy" className="text-xs font-semibold text-amber-700 hover:text-amber-800">Track All →</a>
          </div>

          <div className="space-y-3">
            {SAMPLE_SOLAR_PROJECTS.map(proj => (
              <div key={proj.projectId} className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{proj.customerName}</span>
                      <span className="text-[10px] font-mono font-bold text-solar-800 bg-solar-100 px-1.5 py-0.5 rounded">
                        {proj.projectId}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {proj.solarCapacity} • {proj.panelBrand}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {proj.subsidyStatus}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tech: <strong className="text-slate-700">{proj.assignedInstaller}</strong></span>
                  <span>Net Meter: <strong className="text-slate-700">{proj.netMeterStatus}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
