import { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  ExternalLink,
  Sun,
  IndianRupee,
  Building,
  Filter,
  Eye,
  Plus,
  X,
  Phone,
  Zap,
  CheckCircle,
  FileCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import DataTable from '../components/shared/DataTable';
import { CardSkeleton } from '../components/shared/Skeleton';
import { api } from '../utils/api';

export default function SubsidyTracking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [records, setRecords] = useState([]);

  const loadSubsidies = async () => {
    try {
      const data = await api.get('/solar/subsidies');
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load subsidies:', err);
    } finally {
      setLoading(false);
    }
  };

  const [initialSeed] = useState([
    {
      id: 'SUB-2026-001',
      projectId: 'DBPL-2026-00001',
      customerName: 'Dr. Anand Swaroop Mishra',
      mobile: '9935678901',
      consumerNo: 'PU-12093485',
      discom: 'MVVNL (Lucknow)',
      capacity: '10 kW',
      applicationNo: 'UP-LKO-2026-99382',
      subsidyAmount: 78000,
      
      applicationStatus: 'Approved & Active',  // Submitted, In Review, Approved & Active, Rejected
      documentStatus: 'Verified',             // Uploaded, Pending Verification, Verified, Re-upload Required
      discomStatus: 'Feasibility Cleared',    // Feasibility Applied, In Progress, Feasibility Cleared
      installationStatus: 'Commissioned',     // Work Order Issued, Structure Ready, Commissioned
      inspectionStatus: 'Passed & Signed',    // Inspector Appointed, Scheduled, Passed & Signed
      subsidyApproval: 'Approved by MNRE',    // In Processing, Approved by MNRE, Hold
      subsidyReceived: 'Yes (Credited via DBT)', // No, Processing, Yes (Credited via DBT)
      pendingReason: 'None (Subsidy successfully disbursed into bank account)',
      disbursedDate: '2026-10-04'
    },
    {
      id: 'SUB-2026-002',
      projectId: 'DBPL-2026-00002',
      customerName: 'Sunita Devi Agrawal',
      mobile: '9788112245',
      consumerNo: 'PU-99382012',
      discom: 'MVVNL (Lucknow)',
      capacity: '7 kW',
      applicationNo: 'UP-LKO-2026-10293',
      subsidyAmount: 78000,

      applicationStatus: 'Approved & Active',
      documentStatus: 'Verified',
      discomStatus: 'Feasibility Cleared',
      installationStatus: 'Commissioned',
      inspectionStatus: 'Passed & Signed',
      subsidyApproval: 'In Processing',
      subsidyReceived: 'No',
      pendingReason: 'Awaiting DBT bank account IFSC re-validation on PFMS portal',
      disbursedDate: 'Pending'
    },
    {
      id: 'SUB-2026-003',
      projectId: 'DBPL-2026-00003',
      customerName: 'Dinesh Kumar Maurya',
      mobile: '9450123456',
      consumerNo: 'VU-10293847',
      discom: 'PuVVNL (Varanasi)',
      capacity: '2 kW',
      applicationNo: 'UP-VNS-2026-44391',
      subsidyAmount: 60000,

      applicationStatus: 'Submitted',
      documentStatus: 'Verified',
      discomStatus: 'Feasibility Cleared',
      installationStatus: 'Structure Ready',
      inspectionStatus: 'Scheduled',
      subsidyApproval: 'Pending Inspection',
      subsidyReceived: 'No',
      pendingReason: 'DISCOM Joint Inspection team visit pending for Bi-directional Net Meter sealing',
      disbursedDate: 'Pending'
    },
    {
      id: 'SUB-2026-004',
      projectId: 'DBPL-2026-00004',
      customerName: 'Vikram Singh Chauhan',
      mobile: '9811223344',
      consumerNo: 'KU-44589211',
      discom: 'KESCO (Kanpur)',
      capacity: '3 kW',
      applicationNo: 'UP-KNP-2026-38291',
      subsidyAmount: 78000,

      applicationStatus: 'Submitted',
      documentStatus: 'Re-upload Required',
      discomStatus: 'In Progress',
      installationStatus: 'Work Order Issued',
      inspectionStatus: 'Pending',
      subsidyApproval: 'Hold',
      subsidyReceived: 'No',
      pendingReason: 'Electricity bill name mismatch with Aadhaar card (Spelling issue in surname)',
      disbursedDate: 'Pending'
    },
    {
      id: 'SUB-2026-005',
      projectId: 'DBPL-2026-00005',
      customerName: 'Rajendra Prasad Sharma',
      mobile: '9876543210',
      consumerNo: 'PU-78392104',
      discom: 'MVVNL (Lucknow)',
      capacity: '5 kW',
      applicationNo: 'UP-LKO-2026-88741',
      subsidyAmount: 78000,

      applicationStatus: 'Submitted',
      documentStatus: 'Verified',
      discomStatus: 'Feasibility Cleared',
      installationStatus: 'Commissioned',
      inspectionStatus: 'Inspector Appointed',
      subsidyApproval: 'Pending Inspection',
      subsidyReceived: 'No',
      pendingReason: 'Joint inspection scheduled for 14th Oct with Sub-divisional SDO',
      disbursedDate: 'Pending'
    }
  ]);

  // Form State for manual record addition
  const [form, setForm] = useState({
    customerName: '',
    mobile: '',
    consumerNo: '',
    discom: 'MVVNL (Lucknow)',
    capacity: '5 kW',
    applicationNo: '',
    subsidyAmount: 78000,
    applicationStatus: 'Submitted',
    documentStatus: 'Verified',
    discomStatus: 'Feasibility Cleared',
    installationStatus: 'Work Order Issued',
    inspectionStatus: 'Pending',
    subsidyApproval: 'In Processing',
    subsidyReceived: 'No',
    pendingReason: 'Initial documents submitted under review'
  });

  useEffect(() => {
    loadSubsidies();
  }, []);

  const handleAddRecord = async (e) => {
    e.preventDefault();
    try {
      const saved = await api.post('/solar/subsidies', {
        ...form,
        projectId: `DBPL-2026-0000${records.length + 1}`,
        disbursedDate: 'Pending'
      });
      setRecords([saved, ...records]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add subsidy record:', err);
      alert('Error saving subsidy: ' + err.message);
    }
  };

  const filtered = records.filter(p => {
    const matchSearch =
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.applicationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.consumerNo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'RECEIVED' && p.subsidyReceived.includes('Yes')) ||
      (statusFilter === 'APPROVED' && p.subsidyApproval.includes('Approved')) ||
      (statusFilter === 'PENDING' && p.subsidyReceived === 'No') ||
      (statusFilter === 'ISSUE' && (p.documentStatus.includes('Re-upload') || p.subsidyApproval.includes('Hold')));

    return matchSearch && matchStatus;
  });

  // Badge helpers
  const getDocBadge = (status) => {
    if (status === 'Verified') return 'bg-emerald-50 text-[#166534] border-emerald-200';
    if (status.includes('Re-upload')) return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  const getDiscomBadge = (status) => {
    if (status.includes('Cleared')) return 'bg-emerald-50 text-[#166534] border-emerald-200';
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  const getReceivedBadge = (status) => {
    if (status.includes('Yes')) return 'bg-emerald-100 text-[#166534] font-black border-emerald-300';
    return 'bg-amber-100 text-amber-900 font-bold border-yellow-300';
  };

  const columns = [
    {
      key: 'applicationNo',
      label: 'Application & Project',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-mono font-bold text-xs text-[#166534]">{row.applicationNo}</div>
          <div className="text-[11px] font-mono text-slate-500 font-semibold">{row.projectId}</div>
          <span className="text-[10px] text-slate-400">{row.discom}</span>
        </div>
      )
    },
    {
      key: 'customerName',
      label: 'Customer Details',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-extrabold text-xs text-slate-900">{row.customerName}</div>
          <div className="text-[11px] text-slate-500">📞 +91 {row.mobile}</div>
          <div className="text-[10px] font-mono text-slate-500">Cons: {row.consumerNo}</div>
        </div>
      )
    },
    {
      key: 'capacity',
      label: 'System & Subsidy',
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 text-amber-900 font-black text-xs border border-yellow-300">
            ⚡ {row.capacity}
          </span>
          <div className="text-xs font-black text-[#166534] mt-1">₹{row.subsidyAmount.toLocaleString('en-IN')}</div>
        </div>
      )
    },
    {
      key: 'documentStatus',
      label: 'Document Status',
      render: (_, row) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${getDocBadge(row.documentStatus)}`}>
          {row.documentStatus === 'Verified' ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
          {row.documentStatus}
        </span>
      )
    },
    {
      key: 'discomStatus',
      label: 'DISCOM Status',
      render: (_, row) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${getDiscomBadge(row.discomStatus)}`}>
          <Building size={11} /> {row.discomStatus}
        </span>
      )
    },
    {
      key: 'inspectionStatus',
      label: 'Inspection Status',
      render: (_, row) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock size={11} /> {row.inspectionStatus}
        </span>
      )
    },
    {
      key: 'subsidyApproval',
      label: 'Subsidy Approval',
      render: (_, row) => (
        <span className="font-bold text-xs text-slate-800">
          {row.subsidyApproval}
        </span>
      )
    },
    {
      key: 'subsidyReceived',
      label: 'Subsidy Received',
      render: (_, row) => (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] border ${getReceivedBadge(row.subsidyReceived)}`}>
          {row.subsidyReceived.includes('Yes') ? <CheckCircle size={11} /> : <Clock size={11} />}
          {row.subsidyReceived}
        </span>
      )
    },
    {
      key: 'pendingReason',
      label: 'Pending Reason / Remarks',
      render: (_, row) => (
        <div className="max-w-xs text-[11px] text-slate-600 truncate" title={row.pendingReason}>
          {row.pendingReason}
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={() => setSelectedItem(row)}
          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-[#166534] text-[#166534] hover:text-white transition-colors">
          <Eye size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShieldCheck className="text-[#166534]" size={24} /> PM Surya Ghar / Subsidy Tracking (4.H)
          </h1>
          <p className="text-xs text-slate-500">
            Real-time verification of National Portal applications, Document clearance, DISCOM feasibility, Inspection & DBT Disbursal
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-xs">
            <Plus size={16} /> Track New Application
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Subsidy Claims</span>
            <ShieldCheck size={16} className="text-[#166534]" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2 font-display">{records.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">₹3,72,000 Pipeline Value</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Subsidy Received (DBT)</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#166534] mt-2 font-display">
            ₹{records.filter(r => r.subsidyReceived.includes('Yes')).reduce((s, r) => s + r.subsidyAmount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Direct to Client Bank A/c</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Inspection & SDO Cleared</span>
            <FileCheck size={16} className="text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-800 mt-2 font-display">
            {records.filter(r => r.inspectionStatus.includes('Passed')).length}
          </div>
          <div className="text-[11px] text-sky-600 font-semibold mt-1">Net Meter Sealing Done</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Pending or Hold Issues</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-2 font-display">
            {records.filter(r => r.documentStatus.includes('Re-upload') || r.subsidyApproval.includes('Hold')).length}
          </div>
          <div className="text-[11px] text-amber-600 font-bold mt-1">Action Required</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Application No (e.g. UP-LKO-2026), Project ID, Customer or Consumer No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#22C55E] text-xs font-medium text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {[
            { id: 'ALL', label: 'All Applications' },
            { id: 'RECEIVED', label: 'Subsidy Received (DBT)' },
            { id: 'APPROVED', label: 'Approved by MNRE' },
            { id: 'PENDING', label: 'Pending Disbursal' },
            { id: 'ISSUE', label: 'Document/Hold Issues' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === f.id
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table with Chakra-Style Pagination */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        skeletonRows={5}
        skeletonCols={8}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />

      {/* Comprehensive Dossier Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center font-black">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 font-mono">{selectedItem.applicationNo}</h3>
                  <p className="text-xs text-slate-500">PM Surya Ghar Subsidy Dossier • {selectedItem.projectId}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Applicant Profile</div>
                <div className="font-black text-sm text-slate-900">{selectedItem.customerName}</div>
                <div className="text-slate-600 mt-0.5">📞 +91 {selectedItem.mobile} | ⚡ Consumer: {selectedItem.consumerNo}</div>
                <div className="text-slate-600 mt-0.5">DISCOM: {selectedItem.discom} | Plant: {selectedItem.capacity}</div>
              </div>

              {/* 8 Field Verification Status Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">1. Application Status</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedItem.applicationStatus}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">2. Document Status</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedItem.documentStatus}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">3. DISCOM Feasibility</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedItem.discomStatus}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">4. Installation Status</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedItem.installationStatus}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">5. Inspection Status</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedItem.inspectionStatus}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">6. Subsidy Approval</span>
                  <div className="font-bold text-[#166534] mt-0.5">{selectedItem.subsidyApproval}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">7. Subsidy Received Status</span>
                  <div className="text-sm font-black text-[#166534] mt-0.5">{selectedItem.subsidyReceived}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase">Approved Amount</span>
                  <div className="text-base font-black text-emerald-800">₹{selectedItem.subsidyAmount.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase flex items-center gap-1">
                  <AlertCircle size={12} /> 8. Pending Reason / Remarks
                </span>
                <p className="text-xs text-amber-950 font-semibold mt-1">
                  {selectedItem.pendingReason}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800">
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Application Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <ShieldCheck className="text-[#166534]" size={20} /> Track New PM Surya Ghar Application
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-3.5 py-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E]"
                    placeholder="Applicant full name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E]"
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Portal Application No *</label>
                  <input
                    type="text"
                    required
                    value={form.applicationNo}
                    onChange={(e) => setForm({ ...form, applicationNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-mono"
                    placeholder="e.g. UP-LKO-2026-99382"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Consumer Number *</label>
                  <input
                    type="text"
                    required
                    value={form.consumerNo}
                    onChange={(e) => setForm({ ...form, consumerNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-mono"
                    placeholder="Electricity consumer no"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity (kW)</label>
                  <select
                    value={form.capacity}
                    onChange={(e) => {
                      const cap = e.target.value;
                      const kw = parseInt(cap);
                      const sub = kw === 1 ? 30000 : kw === 2 ? 60000 : 78000;
                      setForm({ ...form, capacity: cap, subsidyAmount: sub });
                    }}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-bold">
                    <option value="1 kW">1 kW</option>
                    <option value="2 kW">2 kW</option>
                    <option value="3 kW">3 kW</option>
                    <option value="5 kW">5 kW</option>
                    <option value="7 kW">7 kW</option>
                    <option value="10 kW">10 kW</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subsidy (₹)</label>
                  <input
                    type="number"
                    value={form.subsidyAmount}
                    onChange={(e) => setForm({ ...form, subsidyAmount: Number(e.target.value) })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-[#166534]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DISCOM</label>
                  <select
                    value={form.discom}
                    onChange={(e) => setForm({ ...form, discom: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="MVVNL (Lucknow)">MVVNL (Lucknow)</option>
                    <option value="PuVVNL (Varanasi)">PuVVNL (Varanasi)</option>
                    <option value="KESCO (Kanpur)">KESCO (Kanpur)</option>
                    <option value="DVVNL (Agra)">DVVNL (Agra)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Document Status</label>
                  <select
                    value={form.documentStatus}
                    onChange={(e) => setForm({ ...form, documentStatus: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="Verified">Verified</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Re-upload Required">Re-upload Required</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">DISCOM Status</label>
                  <select
                    value={form.discomStatus}
                    onChange={(e) => setForm({ ...form, discomStatus: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="Feasibility Cleared">Feasibility Cleared</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Feasibility Applied">Feasibility Applied</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Inspection Status</label>
                  <select
                    value={form.inspectionStatus}
                    onChange={(e) => setForm({ ...form, inspectionStatus: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="Pending">Pending</option>
                    <option value="Inspector Appointed">Inspector Appointed</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Passed & Signed">Passed & Signed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subsidy Received</label>
                  <select
                    value={form.subsidyReceived}
                    onChange={(e) => setForm({ ...form, subsidyReceived: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="No">No</option>
                    <option value="Yes (Credited via DBT)">Yes (Credited via DBT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pending Reason / Remarks</label>
                <textarea
                  rows={2}
                  value={form.pendingReason}
                  onChange={(e) => setForm({ ...form, pendingReason: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E]"
                  placeholder="Reason for any delay, inspection date, or pending task..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#166534] hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs">
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
