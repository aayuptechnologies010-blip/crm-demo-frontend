import { useState, useEffect } from 'react';
import { 
  BriefcaseBusiness, 
  Plus, 
  Search, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  IndianRupee, 
  TrendingUp, 
  Sun,
  Users,
  Eye,
  CreditCard,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Building,
  LogIn,
  Key,
  ShieldCheck,
  FileText,
  X,
  Filter,
  ArrowUpRight,
  Send,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { api } from '../utils/api';
import DataTable from '../components/shared/DataTable';
import { CardSkeleton } from '../components/shared/Skeleton';

export default function SolarDealers() {
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  
  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewDealer, setViewDealer] = useState(null);
  const [dealerLoginModal, setDealerLoginModal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(null);

  // Registration Form state
  const [form, setForm] = useState({
    name: '',
    contactPerson: '',
    mobile: '',
    email: '',
    district: 'Lucknow',
    address: '',
    gstin: '',
    panNumber: '',
    commissionRateKw: 1500,
    password: '',
    bankAccountHolder: '',
    bankAccountNumber: '',
    bankIfsc: '',
    bankName: ''
  });

  // Commission Payment Form state
  const [payoutForm, setPayoutForm] = useState({
    amount: '',
    mode: 'NEFT / Bank Transfer',
    txnId: '',
    remarks: 'Commission payout against verified solar installations'
  });

  const loadDealers = async () => {
    try {
      const data = await api.get('/solar/dealers');
      setDealers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load dealers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDealers();
  }, []);

  // Filter Dealers
  const filteredDealers = dealers.filter(d => {
    const matchesSearch = 
      (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.contactPerson || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.mobile || '').includes(searchTerm) ||
      (d.email && d.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (d.district || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrict = selectedDistrict === 'All' || (d.district || '').includes(selectedDistrict);
    return matchesSearch && matchesDistrict;
  });

  // Total KPIs
  const totalCommissionEarned = dealers.reduce((acc, d) => acc + (d.commissionEarned || 0), 0);
  const totalCommissionPaid = dealers.reduce((acc, d) => acc + (d.commissionPaid || 0), 0);
  const totalCommissionPending = dealers.reduce((acc, d) => acc + (d.commissionPending || 0), 0);
  const totalDealersLeads = dealers.reduce((acc, d) => acc + (d.totalLeads || 0), 0);

  // Handle Dealer Registration
  const handleRegisterDealer = async (e) => {
    e.preventDefault();
    const newDealerPayload = {
      name: form.name,
      contactPerson: form.contactPerson,
      mobile: form.mobile,
      email: form.email || `${form.contactPerson.toLowerCase().replace(/\s+/g, '')}@dealernetwork.in`,
      district: form.district,
      address: form.address || `${form.district}, Uttar Pradesh`,
      gstin: form.gstin || '09AAAAA0000A1Z5',
      panNumber: form.panNumber || 'AAAAA0000A',
      commissionRateKw: Number(form.commissionRateKw) || 1500,
      totalLeads: 0,
      convertedLeads: 0,
      closedSalesKw: '0 kW',
      totalSalesValue: 0,
      commissionEarned: 0,
      commissionPaid: 0,
      commissionPending: 0,
      rating: '5.0 ★',
      status: 'Active',
      bankDetails: {
        accountHolder: form.bankAccountHolder || form.name,
        accountNumber: form.bankAccountNumber || 'Pending Update',
        ifsc: form.bankIfsc || 'Pending Update',
        bankName: form.bankName || 'Pending Update'
      },
      paymentsHistory: []
    };

    try {
      const saved = await api.post('/solar/dealers', newDealerPayload);
      setDealers([saved, ...dealers]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to register dealer:', err);
      alert('Error saving dealer: ' + err.message);
    }
    // Reset Form
    setForm({
      name: '',
      contactPerson: '',
      mobile: '',
      email: '',
      district: 'Lucknow',
      address: '',
      gstin: '',
      panNumber: '',
      commissionRateKw: 1500,
      password: '',
      bankAccountHolder: '',
      bankAccountNumber: '',
      bankIfsc: '',
      bankName: ''
    });
  };

  // Handle Record Commission Payment
  const handleRecordPayout = (e) => {
    e.preventDefault();
    if (!showPaymentModal) return;

    const payAmount = Number(payoutForm.amount);
    if (!payAmount || payAmount <= 0) return;

    const newPaymentRecord = {
      id: `PAY-DLR-00${(showPaymentModal.paymentsHistory?.length || 0) + 1}`,
      date: new Date().toISOString().split('T')[0],
      amount: payAmount,
      mode: payoutForm.mode,
      txnId: payoutForm.txnId || `TXN${Date.now().toString().slice(-8)}`,
      status: 'Paid',
      remarks: payoutForm.remarks
    };

    const updatedDealer = {
      ...showPaymentModal,
      commissionPaid: (showPaymentModal.commissionPaid || 0) + payAmount,
      commissionPending: Math.max(0, (showPaymentModal.commissionPending || 0) - payAmount),
      paymentsHistory: [newPaymentRecord, ...(showPaymentModal.paymentsHistory || [])]
    };

    setDealers(dealers.map(d => d.id === showPaymentModal.id ? updatedDealer : d));
    if (viewDealer?.id === showPaymentModal.id) {
      setViewDealer(updatedDealer);
    }
    setShowPaymentModal(null);
    setPayoutForm({
      amount: '',
      mode: 'NEFT / Bank Transfer',
      txnId: '',
      remarks: 'Commission payout against verified solar installations'
    });
  };

  // Helper to get dealer-specific leads
  const getDealerLeads = (dealerName) => {
    return SAMPLE_SOLAR_LEADS.filter(l => 
      l.dealerName?.toLowerCase().includes(dealerName.toLowerCase()) || 
      dealerName.toLowerCase().includes(l.dealerName?.toLowerCase())
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BriefcaseBusiness className="text-[#166534]" size={24} /> Dealer & Channel Partner Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dealer onboarding, secure login credentials, dealer-wise lead attribution, sales commission & performance metrics
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.02] active:scale-95">
          <Plus size={16} /> Register New Solar Dealer
        </button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 font-bold">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase">Active Dealers</div>
            <div className="text-lg font-black text-slate-800">{dealers.length} Partners</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/60 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
            <Users size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-700 uppercase">Dealer Leads Sourced</div>
            <div className="text-lg font-black text-amber-900">{totalDealersLeads} Leads</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/60 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
            <IndianRupee size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-emerald-700 uppercase">Total Commission Earned</div>
            <div className="text-lg font-black text-emerald-900">₹{totalCommissionEarned.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/60 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-bold">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-[11px] font-bold text-rose-700 uppercase">Pending Payouts</div>
            <div className="text-lg font-black text-rose-900">₹{totalCommissionPending.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Dealer Firm Name, Contact Person, Mobile, Email or District..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#166534] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 font-bold flex items-center gap-1">
            <Filter size={13} className="text-slate-400" /> Region:
          </div>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="px-3 py-1.5 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none">
            <option value="All">All Districts / Territories</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Varanasi">Varanasi</option>
            <option value="Mathura">Mathura & Agra</option>
            <option value="Kanpur">Kanpur</option>
          </select>
        </div>
      </div>

      {/* Dealer Cards Grid (Visual Performance Cards) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {filteredDealers.map(d => {
            const conversionRate = d.totalLeads > 0 
              ? Math.round(((d.convertedLeads || 0) / d.totalLeads) * 100) 
              : 0;
            
            return (
              <div 
                key={d.id} 
                className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  {/* Dealer Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {d.id}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {d.status || 'Active'}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-1.5">{d.name}</h3>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-slate-400" /> {d.district}
                      </div>
                    </div>
                    <span className="px-2 py-1 rounded-xl text-xs font-black bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-500" /> {d.rating}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="p-3 bg-slate-50 rounded-2xl space-y-1.5 text-xs mb-3 border border-slate-100">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Partner:</span>
                      <span className="font-bold text-slate-800">{d.contactPerson}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Mobile:</span>
                      <span className="font-mono font-semibold text-slate-800 flex items-center gap-1">
                        <Phone size={10} className="text-[#166534]" /> {d.mobile}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">Login ID:</span>
                      <span className="font-mono text-[11px] text-slate-600 truncate max-w-[150px]">
                        {d.email}
                      </span>
                    </div>
                  </div>

                  {/* Performance & Sales Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100">
                      <div className="text-[10px] font-bold text-emerald-700 uppercase">Closed Sales</div>
                      <div className="text-sm font-black text-emerald-950 flex items-center gap-1 mt-0.5">
                        <Zap size={14} className="text-amber-500 fill-amber-500" /> {d.closedSalesKw}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {d.convertedLeads || 0} Projects Installed
                      </div>
                    </div>

                    <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-100">
                      <div className="text-[10px] font-bold text-amber-700 uppercase">Conversion Rate</div>
                      <div className="text-sm font-black text-amber-950 flex items-center gap-1 mt-0.5">
                        <TrendingUp size={14} className="text-amber-600" /> {conversionRate}%
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        From {d.totalLeads} total leads
                      </div>
                    </div>
                  </div>

                  {/* Commission Details */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Commission Earned:</span>
                      <span className="font-black text-slate-900">₹{(d.commissionEarned || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Paid to Date:</span>
                      <span className="font-bold text-emerald-700">₹{(d.commissionPaid || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                      <span className="text-slate-700 font-bold">Pending Balance:</span>
                      <span className="font-extrabold text-rose-700">₹{(d.commissionPending || 0).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDealerLoginModal(d)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors">
                    <LogIn size={13} className="text-slate-600" /> Portal Login
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowPaymentModal(d)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#166534] text-xs font-bold transition-colors">
                      <CreditCard size={13} /> Pay Payout
                    </button>
                    <button
                      onClick={() => setViewDealer(d)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-xs font-bold transition-colors">
                      <Eye size={13} /> View 360°
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. Modal: Register New Dealer */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8 border border-slate-100 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#166534]">
                  <BriefcaseBusiness size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Register New Channel Partner / Dealer</h3>
                  <p className="text-xs text-slate-500">Onboard solar authorized dealer, commission rate & create portal login</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterDealer} className="space-y-4">
              {/* Dealer Business Profile */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Building size={14} className="text-[#166534]" /> Dealer Firm & Contact Details
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dealer Firm / Shop Name *</label>
                    <input
                      required
                      placeholder="e.g. Awadh Solar Point"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Key Contact Person / Owner *</label>
                    <input
                      required
                      placeholder="e.g. Sandeep Tiwari"
                      value={form.contactPerson}
                      onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (WhatsApp) *</label>
                    <input
                      required
                      placeholder="10-digit mobile number"
                      value={form.mobile}
                      onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Operating Territory / District *</label>
                    <select
                      value={form.district}
                      onChange={(e) => setForm({ ...form, district: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:border-[#166534] outline-none font-medium">
                      <option value="Lucknow">Lucknow</option>
                      <option value="Kanpur Nagar">Kanpur Nagar</option>
                      <option value="Varanasi">Varanasi</option>
                      <option value="Mathura & Agra">Mathura & Agra</option>
                      <option value="Prayagraj">Prayagraj</option>
                      <option value="Gorakhpur">Gorakhpur</option>
                      <option value="Ayodhya">Ayodhya</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Store / Office Address</label>
                    <input
                      placeholder="Shop No, Road, Landmark, District, Pincode"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Login Credentials & Commission Agreement */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Key size={14} className="text-amber-600" /> Dealer Portal Login & Commission Slabs
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Dealer Login Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="dealer@solarpower.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Portal Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Secure password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Commission Rate (₹ per kW) *</label>
                    <input
                      type="number"
                      required
                      value={form.commissionRateKw}
                      onChange={(e) => setForm({ ...form, commissionRateKw: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none font-bold text-[#166534]"
                    />
                  </div>
                </div>
              </div>

              {/* Bank & Tax Details for Commission Disbursal */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard size={14} className="text-sky-600" /> Bank & Tax Details (For Commission Payouts)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Bank Account Holder Name</label>
                    <input
                      placeholder="Name as per Bank Passbook"
                      value={form.bankAccountHolder}
                      onChange={(e) => setForm({ ...form, bankAccountHolder: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Account Number</label>
                    <input
                      placeholder="Bank Account Number"
                      value={form.bankAccountNumber}
                      onChange={(e) => setForm({ ...form, bankAccountNumber: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">IFSC Code & Bank Name</label>
                    <input
                      placeholder="e.g. HDFC0001234 (HDFC Bank)"
                      value={form.bankIfsc}
                      onChange={(e) => setForm({ ...form, bankIfsc: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN / PAN</label>
                    <input
                      placeholder="09AAAAA0000A1Z5"
                      value={form.gstin}
                      onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold bg-[#166534] hover:bg-emerald-900 text-white rounded-xl shadow-md transition-all">
                  Onboard & Save Dealer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. Modal: Dealer Login / Impersonate Portal View */}
      {/* ======================================================== */}
      {dealerLoginModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                  <Key size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Dealer Portal Login Credentials</h3>
                  <p className="text-[11px] text-slate-500">{dealerLoginModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setDealerLoginModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-4 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Dealer ID:</span>
                <span className="font-mono font-bold text-[#166534]">{dealerLoginModal.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Login Email:</span>
                <span className="font-bold text-slate-800">{dealerLoginModal.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Password:</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300 font-bold">
                  Dealer@2026#
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Last Active:</span>
                <span className="text-slate-600">{dealerLoginModal.lastLogin || 'Recently'}</span>
              </div>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-[#166534] font-medium mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="shrink-0" />
              <span>Dealers can log in from the main Login screen using the <strong>Dealer</strong> role to view only their assigned leads and commission statements.</span>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDealerLoginModal(null)}
                className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50">
                Close
              </button>
              <button
                onClick={() => {
                  alert(`Direct login session for dealer: ${dealerLoginModal.name} (${dealerLoginModal.email})`);
                  setDealerLoginModal(null);
                }}
                className="px-5 py-2 text-xs font-bold bg-[#166534] text-white rounded-xl shadow-md hover:bg-emerald-900 transition-all flex items-center gap-1.5">
                <LogIn size={13} /> Switch To Dealer Portal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. Modal: Dealer 360° Profile (Leads, Sales, Commission, Bank) */}
      {/* ======================================================== */}
      {viewDealer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl my-8 border border-slate-100 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-emerald-50 text-[#166534] border border-emerald-200">
                    {viewDealer.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {viewDealer.status} Partner
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                    <Star size={10} className="fill-amber-400 text-amber-500" /> {viewDealer.rating}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 mt-1">{viewDealer.name}</h3>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                  <span>Territory: <strong>{viewDealer.district}</strong></span>
                  <span>Joined: <strong>{viewDealer.joinedDate}</strong></span>
                </div>
              </div>
              <button
                onClick={() => setViewDealer(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Sales & Commission Performance Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Dealer Sourced Leads</div>
                  <div className="text-base font-black text-slate-900 mt-0.5">{viewDealer.totalLeads} Leads</div>
                  <div className="text-[10px] text-slate-500">{viewDealer.convertedLeads || 0} Converted</div>
                </div>

                <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
                  <div className="text-[10px] font-bold text-amber-800 uppercase">Total Sales Capacity</div>
                  <div className="text-base font-black text-amber-950 mt-0.5">⚡ {viewDealer.closedSalesKw}</div>
                  <div className="text-[10px] text-amber-700">₹{((viewDealer.totalSalesValue || 0) / 100000).toFixed(1)} Lakhs Revenue</div>
                </div>

                <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Total Commission</div>
                  <div className="text-base font-black text-emerald-950 mt-0.5">₹{(viewDealer.commissionEarned || 0).toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-emerald-700">@ ₹{viewDealer.commissionRateKw || 1500}/kW</div>
                </div>

                <div className="bg-rose-50/60 p-3 rounded-2xl border border-rose-200">
                  <div className="text-[10px] font-bold text-rose-800 uppercase">Pending Commission</div>
                  <div className="text-base font-black text-rose-950 mt-0.5">₹{(viewDealer.commissionPending || 0).toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-rose-700">Paid: ₹{(viewDealer.commissionPaid || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Dealer-wise Leads Table */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Users size={14} className="text-[#166534]" /> Dealer-Wise Leads Generated
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">
                    Attributed: {getDealerLeads(viewDealer.name).length} Leads in System
                  </span>
                </div>

                {getDealerLeads(viewDealer.name).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <thead className="bg-slate-100 text-slate-600 font-bold">
                        <tr>
                          <th className="p-2.5">Lead ID</th>
                          <th className="p-2.5">Customer Name</th>
                          <th className="p-2.5">Capacity</th>
                          <th className="p-2.5">Quoted Amount</th>
                          <th className="p-2.5">Lead Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {getDealerLeads(viewDealer.name).map(l => (
                          <tr key={l.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-bold text-[#166534]">{l.id}</td>
                            <td className="p-2.5 font-semibold text-slate-800">{l.customerName}</td>
                            <td className="p-2.5 font-bold text-amber-700">{l.requiredKw}</td>
                            <td className="p-2.5 font-mono">₹{l.estimatedAmount?.toLocaleString('en-IN')}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                {l.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    No active sample leads currently tagged to this dealer. New leads added with lead source "Dealer Network" will display here automatically.
                  </div>
                )}
              </div>

              {/* Commission Payment History & Bank Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Bank Details */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Building size={14} className="text-sky-600" /> Bank & Payout Details
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="font-semibold text-slate-800">{viewDealer.bankDetails?.accountHolder || viewDealer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">A/C Number:</span>
                      <span className="font-mono font-bold text-slate-800">{viewDealer.bankDetails?.accountNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Bank & IFSC:</span>
                      <span className="font-mono text-slate-700">{viewDealer.bankDetails?.ifsc} ({viewDealer.bankDetails?.bankName})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">GSTIN:</span>
                      <span className="font-mono text-slate-700">{viewDealer.gstin}</span>
                    </div>
                  </div>
                </div>

                {/* Payment History */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard size={14} className="text-emerald-700" /> Commission Payout History
                    </div>
                    <button
                      onClick={() => {
                        setShowPaymentModal(viewDealer);
                      }}
                      className="text-[11px] font-bold text-[#166534] hover:underline flex items-center gap-1">
                      <Plus size={11} /> Add Payout
                    </button>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {viewDealer.paymentsHistory && viewDealer.paymentsHistory.length > 0 ? (
                      viewDealer.paymentsHistory.map(p => (
                        <div key={p.id} className="p-2 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-emerald-800">₹{p.amount?.toLocaleString('en-IN')}</div>
                            <div className="text-[10px] text-slate-400">{p.date} • {p.mode}</div>
                          </div>
                          <div className="text-right">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {p.status}
                            </span>
                            <div className="font-mono text-[9px] text-slate-400 mt-0.5">{p.txnId}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-slate-400">No payouts recorded yet.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={() => setShowPaymentModal(viewDealer)}
                className="px-4 py-2 text-xs font-bold bg-[#166534] hover:bg-emerald-900 text-white rounded-xl shadow-md transition-all flex items-center gap-1.5">
                <CreditCard size={13} /> Disburse Commission Payout
              </button>
              <button
                onClick={() => setViewDealer(null)}
                className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors">
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. Modal: Record Commission Payment */}
      {/* ======================================================== */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center">
                  <IndianRupee size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Record Commission Payment</h3>
                  <p className="text-[11px] text-slate-500">Payee: {showPaymentModal.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPaymentModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 mb-4 text-xs">
              <div className="flex justify-between items-center text-amber-900">
                <span className="font-bold">Pending Balance:</span>
                <span className="font-black text-sm">₹{(showPaymentModal.commissionPending || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="text-[11px] text-amber-700 mt-1">
                Bank: {showPaymentModal.bankDetails?.bankName || 'HDFC Bank'} • A/C: {showPaymentModal.bankDetails?.accountNumber}
              </div>
            </div>

            <form onSubmit={handleRecordPayout} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payout Amount (₹) *</label>
                <input
                  type="number"
                  required
                  placeholder="Enter amount to disburse"
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-bold text-[#166534] text-sm focus:border-[#166534] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Payment Mode *</label>
                <select
                  value={payoutForm.mode}
                  onChange={(e) => setPayoutForm({ ...payoutForm, mode: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white font-medium">
                  <option value="NEFT / Bank Transfer">NEFT / Bank Transfer</option>
                  <option value="RTGS">RTGS</option>
                  <option value="IMPS / UPI">IMPS / UPI</option>
                  <option value="Cheque">Account Payee Cheque</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bank Reference / UTR Number</label>
                <input
                  placeholder="e.g. UTR102938482910"
                  value={payoutForm.txnId}
                  onChange={(e) => setPayoutForm({ ...payoutForm, txnId: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl font-mono focus:border-[#166534] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Remarks / Note</label>
                <input
                  placeholder="Remarks"
                  value={payoutForm.remarks}
                  onChange={(e) => setPayoutForm({ ...payoutForm, remarks: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:border-[#166534] outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(null)}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-[#166534] text-white rounded-xl shadow-md hover:bg-emerald-900 transition-all">
                  Confirm & Disburse Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
