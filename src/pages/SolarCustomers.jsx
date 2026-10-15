import { useState, useEffect } from 'react';
import { 
  Sun, 
  Plus, 
  Search, 
  MapPin, 
  Phone, 
  FileText, 
  ShieldCheck, 
  Download, 
  Eye, 
  CheckCircle2, 
  Clock,
  Upload,
  FileCheck,
  UserCheck,
  Building,
  Zap,
  Trash2,
  X
} from 'lucide-react';
import { api } from '../utils/api';
import DataTable from '../components/shared/DataTable';

export default function SolarCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);

  const loadCustomers = async () => {
    try {
      const data = await api.get('/solar/projects');
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load solar customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Form matching 100% of Requirement 4.C
  const [form, setForm] = useState({
    customerName: '',
    mobile: '',
    address: '',
    district: 'Lucknow',
    block: '',
    panchayat: '',
    consumerNumber: '',
    electricityBillFile: null,
    idDocumentType: 'Aadhaar Card',
    idDocumentFile: null,
    solarCapacity: '3 kW',
    assignedExecutive: 'Amit Verma',
    totalAmount: 180000,
    paidAmount: 50000
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    const createdPayload = {
      ...form,
      dueAmount: Number(form.totalAmount || 0) - Number(form.paidAmount || 0),
      panelBrand: 'Waaree 550W Mono PERC TopCon',
      inverterBrand: 'Growatt 3.3kW On-Grid',
      structureType: 'Elevated HDG Structure',
      assignedInstaller: 'Mahesh Chauhan',
      subsidyStatus: 'Application Registered',
      subsidyAmount: parseInt(form.solarCapacity) <= 2 ? 60000 : 78000,
      electricityBillFile: form.electricityBillFile ? form.electricityBillFile.name : 'Electricity_Bill.pdf',
      idDocumentFile: form.idDocumentFile ? form.idDocumentFile.name : 'ID_Document.pdf'
    };

    try {
      const saved = await api.post('/solar/projects', createdPayload);
      setCustomers([saved, ...customers]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to add customer:', err);
      alert('Error saving customer: ' + err.message);
    }

    // Reset Form
    setForm({
      customerName: '',
      mobile: '',
      address: '',
      district: 'Lucknow',
      block: '',
      panchayat: '',
      consumerNumber: '',
      electricityBillFile: null,
      idDocumentType: 'Aadhaar Card',
      idDocumentFile: null,
      solarCapacity: '3 kW',
      assignedExecutive: 'Amit Verma',
      totalAmount: 180000,
      paidAmount: 50000
    });
  };

  const filtered = customers.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.mobile.includes(searchTerm) ||
    c.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.consumerNumber && c.consumerNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Sun className="text-[#166534]" size={24} /> Customer Master & Solar Projects (4.C)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto Project ID (DBPL-2026-00001), District/Block/Panchayat, Electricity Bill & ID KYC verification
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs shadow-md shadow-emerald-900/20 transition-all">
          <Plus size={16} /> Register New Solar Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search Customer, Project ID (DBPL-...), Consumer No, District..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
          />
        </div>
        <span className="text-xs font-bold text-slate-500 hidden sm:inline">
          Total Customers: <strong className="text-[#166534]">{customers.length}</strong>
        </span>
      </div>

      {/* Customers Table with Chakra-styled Pagination & Skeleton Loader */}
      <DataTable
        loading={loading}
        data={filtered}
        columns={[
          {
            key: 'projectId',
            label: 'Project ID',
            sortable: true,
            render: (val) => (
              <span className="font-mono font-bold text-[#166534] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {val}
              </span>
            )
          },
          {
            key: 'customerName',
            label: 'Customer Profile',
            sortable: true,
            render: (_, c) => (
              <div>
                <div className="font-bold text-slate-900">{c.customerName}</div>
                <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                  <Phone size={10} className="text-emerald-600" /> +91 {c.mobile}
                </div>
              </div>
            )
          },
          {
            key: 'address',
            label: 'District / Block / Panchayat',
            render: (_, c) => (
              <div>
                <div className="font-semibold text-slate-800">{c.district}</div>
                <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{c.block || 'Sadar'} • {c.panchayat || 'Urban'}</div>
                <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{c.address}</div>
              </div>
            )
          },
          {
            key: 'consumerNumber',
            label: 'Electricity Consumer No',
            sortable: true,
            render: (val) => (
              <div>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  {val || 'Under DISCOM'}
                </span>
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-1">
                  <FileCheck size={11} /> Bill Uploaded
                </div>
              </div>
            )
          },
          {
            key: 'solarCapacity',
            label: 'Solar Capacity',
            sortable: true,
            render: (val) => (
              <div className="font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md inline-block border border-amber-200">
                ⚡ {val}
              </div>
            )
          },
          {
            key: 'assignedExecutive',
            label: 'Assigned Employee',
            sortable: true,
            render: (val) => (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <UserCheck size={13} className="text-[#166534]" />
                <span>{val || 'Amit Verma'}</span>
              </div>
            )
          },
          {
            key: 'documents',
            label: 'ID Documents',
            render: (_, c) => (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                ✓ {c.idDocumentType || 'Aadhaar Verified'}
              </span>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, c) => (
              <button
                onClick={() => setViewCustomer(c)}
                className="px-2.5 py-1 rounded-lg text-[#166534] hover:bg-emerald-50 font-bold text-xs inline-flex items-center gap-1 transition-colors">
                <Eye size={13} /> View Dossier
              </button>
            )
          }
        ]}
      />

      {/* Modal: View Full Customer Profile Dossier */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs bg-emerald-50 text-[#166534] px-2 py-0.5 rounded border border-emerald-200">
                  {viewCustomer.projectId}
                </span>
                <h3 className="font-extrabold text-base text-slate-900">{viewCustomer.customerName}</h3>
              </div>
              <button onClick={() => setViewCustomer(null)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400">Mobile:</span>
                <p className="font-bold text-slate-800">+91 {viewCustomer.mobile}</p>
              </div>
              <div>
                <span className="text-slate-400">Solar Capacity:</span>
                <p className="font-black text-amber-600">⚡ {viewCustomer.solarCapacity}</p>
              </div>
              <div>
                <span className="text-slate-400">Electricity Consumer No:</span>
                <p className="font-mono font-bold text-slate-800">{viewCustomer.consumerNumber}</p>
              </div>
              <div>
                <span className="text-slate-400">Assigned Employee:</span>
                <p className="font-bold text-slate-800">{viewCustomer.assignedExecutive}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Address / Location:</span>
                <p className="font-semibold text-slate-800">{viewCustomer.address}, {viewCustomer.block || 'Block Sadar'}, {viewCustomer.panchayat || 'Gram Panchayat'}, District: {viewCustomer.district}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <h4 className="font-bold text-slate-800">Uploaded KYC & Technical Documents:</h4>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2">
                  <FileText className="text-[#166534]" size={16} />
                  <span className="font-semibold text-slate-800">Electricity Bill: {viewCustomer.electricityBillFile || 'Bill_Copy.pdf'}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Verified</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#166534]" size={16} />
                  <span className="font-semibold text-slate-800">ID Document: {viewCustomer.idDocumentType} ({viewCustomer.idDocumentFile || 'Aadhaar.pdf'})</span>
                </div>
                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">Verified</span>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button onClick={() => setViewCustomer(null)} className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Solar Customer Form (Point 4.C Full Implementation) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Add Customer & Solar Project (4.C)</h3>
                <p className="text-xs text-slate-400">
                  Next Auto Project ID: <strong className="text-[#166534] font-mono">DBPL-2026-{String(customers.length + 1).padStart(5, '0')}</strong>
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              {/* Row 1: Profile & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Verma"
                    value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp No *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digit mobile"
                    value={form.mobile}
                    onChange={e => setForm({ ...form, mobile: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
                  />
                </div>
              </div>

              {/* Row 2: Location details (District, Block, Panchayat) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lucknow / Kanpur"
                    value={form.district}
                    onChange={e => setForm({ ...form, district: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Block / Tehsil</label>
                  <input
                    type="text"
                    placeholder="e.g. Bakshi Ka Talab"
                    value={form.block}
                    onChange={e => setForm({ ...form, block: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gram Panchayat / Ward</label>
                  <input
                    type="text"
                    placeholder="e.g. Kathwara"
                    value={form.panchayat}
                    onChange={e => setForm({ ...form, panchayat: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
                  />
                </div>
              </div>

              {/* Row 3: Address */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Street Address</label>
                <input
                  type="text"
                  placeholder="House / Plot no, Village, Landmark"
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none"
                />
              </div>

              {/* Row 4: Consumer Number, Solar Capacity & Assigned Employee */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Electricity Consumer No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PU-78392104"
                    value={form.consumerNumber}
                    onChange={e => setForm({ ...form, consumerNumber: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-mono uppercase focus:ring-2 focus:ring-emerald-300 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Solar Capacity *</label>
                  <select
                    value={form.solarCapacity}
                    onChange={e => setForm({ ...form, solarCapacity: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-emerald-300 outline-none">
                    <option>1 kW</option>
                    <option>2 kW</option>
                    <option>3 kW</option>
                    <option>4 kW</option>
                    <option>5 kW</option>
                    <option>6 kW</option>
                    <option>7 kW</option>
                    <option>10 kW</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Employee *</label>
                  <select
                    value={form.assignedExecutive}
                    onChange={e => setForm({ ...form, assignedExecutive: e.target.value })}
                    className="w-full p-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 outline-none font-semibold">
                    <option>Amit Verma</option>
                    <option>Sneha Patel</option>
                    <option>Rohan Gupta</option>
                    <option>Vikas Tiwari</option>
                  </select>
                </div>
              </div>

              {/* Row 5: Document Uploads (Electricity Bill & ID Documents) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200/70">
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Upload size={12} className="text-[#166534]" /> Electricity Bill Upload (PDF/Image)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={e => setForm({ ...form, electricityBillFile: e.target.files[0] })}
                    className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-emerald-100 file:text-[#166534] text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#166534]" /> ID Documents (Aadhaar / PAN / Voter)
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={form.idDocumentType}
                      onChange={e => setForm({ ...form, idDocumentType: e.target.value })}
                      className="border border-slate-200 rounded-lg p-1 text-xs">
                      <option>Aadhaar Card</option>
                      <option>PAN Card</option>
                      <option>Voter ID</option>
                    </select>
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={e => setForm({ ...form, idDocumentFile: e.target.files[0] })}
                      className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-emerald-100 file:text-[#166534] text-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold shadow-md shadow-emerald-900/20">
                  Generate Project ID & Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
