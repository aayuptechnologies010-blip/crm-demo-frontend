import { useState, useEffect } from 'react';
import { DashboardSkeleton } from '../components/shared/Skeleton';
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
  LineChart, 
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  Sun, 
  Zap, 
  TrendingUp, 
  CreditCard, 
  ShieldCheck, 
  Wrench, 
  Users, 
  MapPin, 
  BriefcaseBusiness, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock,
  Calendar,
  IndianRupee,
  LifeBuoy,
  UserCheck,
  AlertCircle,
  FileText,
  Filter,
  CheckCircle
} from 'lucide-react';
import { 
  SAMPLE_SOLAR_PROJECTS, 
  SAMPLE_DEALERS, 
  SAMPLE_SOLAR_LEADS, 
  SAMPLE_COMPLAINTS 
} from '../data/solarData';

// Daily & Monthly Sales Data
const DAILY_SALES_DATA = [
  { date: '06 Oct', salesKw: 8, amountLakh: 4.3, inquiries: 7 },
  { date: '07 Oct', salesKw: 12, amountLakh: 6.5, inquiries: 9 },
  { date: '08 Oct', salesKw: 5, amountLakh: 2.7, inquiries: 6 },
  { date: '09 Oct', salesKw: 15, amountLakh: 8.1, inquiries: 11 },
  { date: '10 Oct', salesKw: 10, amountLakh: 5.4, inquiries: 8 },
  { date: '11 Oct', salesKw: 17, amountLakh: 9.2, inquiries: 14 },
  { date: '12 Oct (Today)', salesKw: 14, amountLakh: 7.6, inquiries: 10 }
];

const MONTHLY_SALES_KW = [
  { month: 'May 2026', kw: 45, salesLakh: 24.3, projects: 8 },
  { month: 'Jun 2026', kw: 72, salesLakh: 38.8, projects: 12 },
  { month: 'Jul 2026', kw: 95, salesLakh: 51.3, projects: 16 },
  { month: 'Aug 2026', kw: 130, salesLakh: 70.2, projects: 22 },
  { month: 'Sep 2026', kw: 160, salesLakh: 86.4, projects: 26 },
  { month: 'Oct 2026', kw: 210, salesLakh: 113.4, projects: 34 }
];

// District-wise Sales Breakdown
const DISTRICT_SALES = [
  { district: 'Lucknow', count: 48, kw: 280, salesLakh: 151.2, color: '#166534' },
  { district: 'Kanpur Nagar', count: 32, kw: 190, salesLakh: 102.6, color: '#22c55e' },
  { district: 'Varanasi', count: 24, kw: 145, salesLakh: 78.3, color: '#f59e0b' },
  { district: 'Prayagraj', count: 18, kw: 110, salesLakh: 59.4, color: '#0ea5e9' },
  { district: 'Ayodhya', count: 14, kw: 85, salesLakh: 45.9, color: '#8b5cf6' },
  { district: 'Gorakhpur', count: 12, kw: 70, salesLakh: 37.8, color: '#ec4899' }
];

// Employee / Sales Executive Performance Data
const EMPLOYEE_PERFORMANCE = [
  { name: 'Amit Verma', role: 'Senior Solar Consultant', assignedLeads: 42, closedKw: 125, conversionRate: '45%', revenueLakh: 67.5, commission: '₹1,25,000' },
  { name: 'Sneha Patel', role: 'Sales Executive', assignedLeads: 36, closedKw: 92, conversionRate: '38%', revenueLakh: 49.6, commission: '₹92,000' },
  { name: 'Rohan Gupta', role: 'Business Development', assignedLeads: 28, closedKw: 74, conversionRate: '35%', revenueLakh: 39.9, commission: '₹74,000' },
  { name: 'Vikram Yadav', role: 'Technical Consultant', assignedLeads: 24, closedKw: 58, conversionRate: '33%', revenueLakh: 31.3, commission: '₹58,000' }
];

// Lead Funnel & Sources
const LEAD_SOURCES_DATA = [
  { name: 'PM Surya Ghar Portal', value: 45, color: '#166534' },
  { name: 'Dealer Network', value: 28, color: '#22c55e' },
  { name: 'Website & Digital Ads', value: 20, color: '#f59e0b' },
  { name: 'Referral & Direct', value: 17, color: '#0ea5e9' }
];

export default function Reports() {
  const [activeTab, setActiveTab] = useState('all'); // all, sales, leads, customers, districts, employee, dealers, financial, pending, service
  const [salesTimeframe, setSalesTimeframe] = useState('monthly'); // daily, monthly
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  // Aggregate stats across project database
  const totalInstalledKw = 840; // 840 kW commissioned across DBPL
  const totalOutstandingPayment = SAMPLE_SOLAR_PROJECTS.reduce((acc, p) => acc + (p.dueAmount || 0), 0) + 1555000;
  const subsidyPendingCount = 19;
  const subsidyPendingAmountLakh = 14.82;
  const installationPendingCount = 14;
  const openComplaintsCount = SAMPLE_COMPLAINTS.filter(c => c.status !== 'Resolved').length;

  // Export Comprehensive CSV
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Project ID,Customer Name,District,Solar Capacity,Total Amount,Paid Amount,Due Amount,Subsidy Status,Subsidy Amount,Installation Status\n" +
      SAMPLE_SOLAR_PROJECTS.map(p => 
        `"${p.projectId}","${p.customerName}","${p.district}","${p.solarCapacity}",${p.totalAmount},${p.paidAmount},${p.dueAmount},"${p.subsidyStatus}",${p.subsidyAmount},"${p.installationStatus}"`
      ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `solar_crm_comprehensive_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navTabs = [
    { id: 'all', label: 'Overview Dashboard' },
    { id: 'sales', label: 'Daily / Monthly Sales' },
    { id: 'leads', label: 'Lead & Funnel Report' },
    { id: 'customers', label: 'Customer & Projects' },
    { id: 'districts', label: 'District-wise Sales' },
    { id: 'employees', label: 'Employee Performance' },
    { id: 'dealers', label: 'Dealer Performance' },
    { id: 'financial', label: 'Payment Outstanding' },
    { id: 'subsidy', label: 'Subsidy Pending' },
    { id: 'installations', label: 'Installation Pending' },
    { id: 'service', label: 'Service & Complaints' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Sun className="text-amber-500 fill-amber-500" size={24} /> Solar Analytics & Business Intelligence Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time MIS reports covering sales, installed kW, district distribution, dealers, employees, pending subsidies & service audit
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={exportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs transition-colors">
            <FileSpreadsheet size={15} className="text-emerald-700" /> Export All (CSV)
          </button>
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-900/10 transition-colors">
            <Download size={15} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* Primary KPI Ribbon (Requirement L: Installed kW, Outstanding, Subsidy, Installation) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#166534] font-bold">
            <Zap size={22} className="text-amber-500 fill-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Total Installed kW</div>
            <div className="text-xl font-black text-slate-900">{totalInstalledKw} kW</div>
            <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">+45 kW this month</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-rose-200/60 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold">
            <CreditCard size={22} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-rose-700 uppercase">Payment Outstanding</div>
            <div className="text-xl font-black text-rose-950">₹{(totalOutstandingPayment / 100000).toFixed(2)} Lakh</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Across 8 customer milestones</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-amber-200/60 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-700 uppercase">Subsidy Pending</div>
            <div className="text-xl font-black text-amber-950">{subsidyPendingCount} Claims</div>
            <div className="text-[11px] font-semibold text-amber-800 mt-0.5">₹{subsidyPendingAmountLakh} Lakh in DISCOM pipeline</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-purple-200/60 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-bold">
            <Wrench size={22} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-purple-700 uppercase">Installation Pending</div>
            <div className="text-xl font-black text-purple-950">{installationPendingCount} Sites</div>
            <div className="text-[11px] font-medium text-slate-500 mt-0.5">Under structure & BOS erection</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs for 11 Mandatory Sub-Reports */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200/80">
        {navTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#166534] text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================== */}
      {/* 1. Daily / Monthly Sales Report (Section L.1) */}
      {/* ========================================================== */}
      {(activeTab === 'all' || activeTab === 'sales') && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-[#166534]" /> Daily / Monthly Solar Sales Performance
              </h2>
              <p className="text-xs text-slate-400">Total capacity booked & revenue inflow trends</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setSalesTimeframe('monthly')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  salesTimeframe === 'monthly' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600'
                }`}>
                Monthly Growth (6 Months)
              </button>
              <button
                onClick={() => setSalesTimeframe('daily')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  salesTimeframe === 'daily' ? 'bg-white text-[#166534] shadow-xs' : 'text-slate-600'
                }`}>
                Daily Sales (Last 7 Days)
              </button>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {salesTimeframe === 'monthly' ? (
                <BarChart data={MONTHLY_SALES_KW}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" kW" />
                  <Tooltip 
                    formatter={(val, name) => [name === 'kw' ? `${val} kW` : `₹${val} Lakh`, name === 'kw' ? 'Solar Capacity' : 'Revenue']}
                    contentStyle={{ borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 'bold' }} 
                  />
                  <Legend />
                  <Bar dataKey="kw" fill="#166534" radius={[6, 6, 0, 0]} name="Capacity (kW)" />
                  <Bar dataKey="salesLakh" fill="#22c55e" radius={[6, 6, 0, 0]} name="Revenue (₹ Lakh)" />
                </BarChart>
              ) : (
                <LineChart data={DAILY_SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} unit=" kW" />
                  <Tooltip 
                    contentStyle={{ borderRadius: '14px', border: '1px solid #E2E8F0', fontSize: 12, fontWeight: 'bold' }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="salesKw" stroke="#166534" strokeWidth={3} dot={{ r: 4 }} name="Daily kW Booked" />
                  <Line type="monotone" dataKey="amountLakh" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="Revenue (₹ Lakh)" />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 2. District-wise Sales & Installed kW (Section L.4 & L.5) */}
      {/* ========================================================== */}
      {(activeTab === 'all' || activeTab === 'districts') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin size={16} className="text-[#166534]" /> District-wise Sales & Capacity (kW)
              </h2>
              <p className="text-xs text-slate-400">Solar rooftop projects distribution across Uttar Pradesh</p>
            </div>
            <div className="space-y-3 pt-2">
              {DISTRICT_SALES.map((d) => (
                <div key={d.district} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span className="flex items-center gap-1.5 font-extrabold">
                      <MapPin size={13} className="text-slate-400" /> {d.district}
                    </span>
                    <span className="font-mono text-slate-900">
                      {d.kw} kW • {d.count} Projects (₹{d.salesLakh}L)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(d.kw / 280) * 100}%`, backgroundColor: d.color }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Installed Capacity Summary & Specs */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Sun size={16} className="text-amber-500" /> Installed Solar Capacity Breakdown
              </h2>
              <p className="text-xs text-slate-400">Residential vs Commercial & Rooftop types</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100">
                <div className="text-[11px] font-bold text-emerald-800 uppercase">Residential (PM Surya Ghar)</div>
                <div className="text-xl font-black text-emerald-950 mt-1">620 kW</div>
                <div className="text-[10px] text-emerald-700 mt-0.5">142 Rooftop Families Energized</div>
              </div>

              <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-100">
                <div className="text-[11px] font-bold text-amber-800 uppercase">Commercial & Industrial</div>
                <div className="text-xl font-black text-amber-950 mt-1">220 kW</div>
                <div className="text-[10px] text-amber-700 mt-0.5">12 Cold Storage & MSME Units</div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-2">
              <div className="font-extrabold text-slate-800">Key Generation Statistics:</div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Annual Generation:</span>
                <span className="font-bold text-emerald-800 font-mono">11,76,000 Units (kWh)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Annual Electricity Savings:</span>
                <span className="font-bold text-emerald-800 font-mono">₹82,32,000 / Year</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CO₂ Carbon Offset:</span>
                <span className="font-bold text-slate-800 font-mono">980 Metric Tons / Year</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 3. Lead & Customer Report (Section L.2 & L.3) */}
      {/* ========================================================== */}
      {(activeTab === 'all' || activeTab === 'leads' || activeTab === 'customers') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Source Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <Users size={16} className="text-[#166534]" /> Lead Attribution & Source Report
              </h2>
              <p className="text-xs text-slate-400">Source channel contribution to customer inquiries</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={LEAD_SOURCES_DATA} innerRadius={42} outerRadius={68} dataKey="value">
                      {LEAD_SOURCES_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 flex-1 w-full text-xs">
                {LEAD_SOURCES_DATA.map(s => (
                  <div key={s.name} className="flex justify-between items-center p-1.5 rounded-lg bg-slate-50">
                    <span className="flex items-center gap-2 font-semibold text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                      {s.name}
                    </span>
                    <span className="font-mono font-bold text-slate-900">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Projects Conversion Status */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-700" /> Active Customers & Projects Table
              </h2>
              <p className="text-xs text-slate-400">Live projects status under DBPL supervision</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-extrabold">
                    <th className="pb-2">Project ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Capacity</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {SAMPLE_SOLAR_PROJECTS.map(p => (
                    <tr key={p.projectId} className="hover:bg-slate-50">
                      <td className="py-2 font-mono font-bold text-[#166534]">{p.projectId}</td>
                      <td className="py-2 font-semibold text-slate-800">{p.customerName}</td>
                      <td className="py-2 font-bold text-amber-700">{p.solarCapacity}</td>
                      <td className="py-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {p.installationStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 4. Employee & Dealer Performance (Section L.6 & L.7) */}
      {/* ========================================================== */}
      {(activeTab === 'all' || activeTab === 'employees' || activeTab === 'dealers') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Performance Report */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck size={16} className="text-[#166534]" /> Employee Sales Performance
                </h2>
                <p className="text-xs text-slate-400">Sales Executive lead conversion & closed kW</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-[#166534] font-black px-2 py-1 rounded-lg border border-emerald-200">
                Sales Team
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-extrabold">
                    <th className="text-left pb-2">Sales Consultant</th>
                    <th className="text-center pb-2">Closed kW</th>
                    <th className="text-center pb-2">Conv. %</th>
                    <th className="text-right pb-2">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {EMPLOYEE_PERFORMANCE.map(emp => (
                    <tr key={emp.name} className="hover:bg-slate-50/50">
                      <td className="py-2.5">
                        <div className="font-bold text-slate-900">{emp.name}</div>
                        <div className="text-[10px] text-slate-400">{emp.role}</div>
                      </td>
                      <td className="py-2.5 text-center font-bold text-amber-700">{emp.closedKw} kW</td>
                      <td className="py-2.5 text-center font-semibold text-emerald-700">{emp.conversionRate}</td>
                      <td className="py-2.5 text-right font-mono font-bold text-slate-900">₹{emp.revenueLakh}L</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dealer Performance Report */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BriefcaseBusiness size={16} className="text-[#166534]" /> Dealer Channel Performance
                </h2>
                <p className="text-xs text-slate-400">Channel partner sales kW & commission payouts</p>
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-800 font-black px-2 py-1 rounded-lg border border-amber-200">
                Dealer Network
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-extrabold">
                    <th className="text-left pb-2">Dealer Firm</th>
                    <th className="text-left pb-2">District</th>
                    <th className="text-center pb-2">Sales kW</th>
                    <th className="text-right pb-2">Commission Earned</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {SAMPLE_DEALERS.map((dlr) => (
                    <tr key={dlr.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5">
                        <div className="font-bold text-slate-900">{dlr.name}</div>
                        <div className="text-[10px] text-slate-400">{dlr.contactPerson}</div>
                      </td>
                      <td className="py-2.5 text-slate-600 font-medium">{dlr.district}</td>
                      <td className="py-2.5 text-center font-bold text-amber-700">{dlr.closedSalesKw}</td>
                      <td className="py-2.5 text-right font-black text-emerald-800">
                        ₹{(dlr.commissionEarned || 0).toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================== */}
      {/* 5. Financial, Subsidy, Installation & Service Pending Audit (L.8 - L.11) */}
      {/* ========================================================== */}
      {(activeTab === 'all' || activeTab === 'financial' || activeTab === 'subsidy' || activeTab === 'installations' || activeTab === 'service') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Payment Outstanding Card */}
          <div className="bg-white p-4 rounded-3xl border border-rose-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-rose-800 uppercase flex items-center gap-1">
                <CreditCard size={14} /> Payment Outstanding
              </span>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                Action Req.
              </span>
            </div>
            <div className="text-xl font-black text-rose-950">
              ₹{(totalOutstandingPayment / 100000).toFixed(2)} Lakh
            </div>
            <p className="text-[11px] text-slate-500">
              Outstanding balances on structure erection & meter synchronization tranches.
            </p>
          </div>

          {/* Subsidy Pending Card */}
          <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-800 uppercase flex items-center gap-1">
                <ShieldCheck size={14} /> Subsidy Pending
              </span>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded border border-amber-200">
                19 Files
              </span>
            </div>
            <div className="text-xl font-black text-amber-950">
              ₹14.82 Lakh
            </div>
            <p className="text-[11px] text-slate-500">
              PM Surya Ghar National Portal claims undergoing DISCOM joint inspection clearance.
            </p>
          </div>

          {/* Installation Pending Card */}
          <div className="bg-white p-4 rounded-3xl border border-purple-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-800 uppercase flex items-center gap-1">
                <Wrench size={14} /> Installation Pending
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded border border-purple-200">
                14 Sites
              </span>
            </div>
            <div className="text-xl font-black text-purple-950">
              68 kW Capacity
            </div>
            <p className="text-[11px] text-slate-500">
              Warehouses have dispatched solar modules; field installer teams allocated for mounting.
            </p>
          </div>

          {/* Service & Complaint Report Card */}
          <div className="bg-white p-4 rounded-3xl border border-emerald-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-800 uppercase flex items-center gap-1">
                <LifeBuoy size={14} /> Service & AMC Tickets
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                Active Audit
              </span>
            </div>
            <div className="text-xl font-black text-emerald-950">
              {openComplaintsCount} Active Complaints
            </div>
            <p className="text-[11px] text-slate-500">
              Technician dispatches scheduled with before/after photos and grid inverter calibration.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
