import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Calendar, 
  Download, 
  Eye, 
  MessageSquare, 
  Sun, 
  FileText,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { LEAD_STATUSES } from '../data/solarData';
import DataTable from '../components/shared/DataTable';
import { api } from '../utils/api';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewLead, setViewLead] = useState(null);

  const loadLeads = async () => {
    try {
      const data = await api.get('/leads');
      const normalized = (Array.isArray(data) ? data : []).map(l => ({
        ...l,
        id: l.id || l._id,
        customerName: l.customerName || l.name,
        mobile: l.mobile || l.phone,
        location: l.location || l.company || 'Lucknow',
        district: l.district || 'Lucknow',
        requiredKw: l.requiredKw || l.value || '3 kW',
        status: l.status || 'New',
        followUpDate: l.followUpDate || '',
        electricityBillAvg: l.electricityBillAvg || '',
        consumerNumber: l.consumerNumber || '',
        leadSource: l.leadSource || l.source || 'Website'
      }));
      setLeads(normalized);
    } catch (err) {
      console.error('Failed to load leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // New Lead Form State
  const [newLead, setNewLead] = useState({
    customerName: '',
    mobile: '',
    location: '',
    district: 'Lucknow',
    electricityBillAvg: '',
    consumerNumber: '',
    requiredKw: '3 kW',
    leadSource: 'PM Surya Ghar Campaign',
    dealerName: 'Direct',
    salesExecutive: 'Amit Verma',
    followUpDate: '',
    roofType: 'RCC Flat',
    roofArea: '',
    notes: ''
  });

  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.mobile.includes(searchTerm) ||
      l.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.district.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || l.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateLead = async (e) => {
    e.preventDefault();
    if (!newLead.customerName || !newLead.mobile) return;
    
    const kwVal = parseInt(newLead.requiredKw) || 3;
    const createdPayload = {
      name: newLead.customerName,
      customerName: newLead.customerName,
      phone: newLead.mobile,
      mobile: newLead.mobile,
      company: newLead.location,
      location: newLead.location,
      district: newLead.district,
      value: newLead.requiredKw,
      requiredKw: newLead.requiredKw,
      status: 'New',
      source: newLead.leadSource,
      leadSource: newLead.leadSource,
      dealerName: newLead.dealerName,
      assignedTo: newLead.salesExecutive,
      followUpDate: newLead.followUpDate,
      roofType: newLead.roofType,
      roofArea: newLead.roofArea,
      consumerNumber: newLead.consumerNumber,
      electricityBillAvg: newLead.electricityBillAvg,
      estimatedAmount: kwVal * 55000,
      subsidyAmount: kwVal <= 2 ? 60000 : 78000,
      payableAmount: (kwVal * 55000) - 78000
    };

    try {
      const saved = await api.post('/leads', createdPayload);
      const normalized = {
        ...saved,
        id: saved._id || saved.id,
        customerName: saved.customerName || saved.name,
        mobile: saved.mobile || saved.phone,
        location: saved.location || saved.company,
        requiredKw: saved.requiredKw || saved.value || '3 kW'
      };
      setLeads([normalized, ...leads]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to create lead:', err);
      alert('Error creating lead: ' + err.message);
    }
    setNewLead({
      customerName: '',
      mobile: '',
      location: '',
      district: 'Lucknow',
      electricityBillAvg: '',
      consumerNumber: '',
      requiredKw: '3 kW',
      leadSource: 'PM Surya Ghar Campaign',
      dealerName: 'Direct',
      salesExecutive: 'Amit Verma',
      followUpDate: '',
      roofType: 'RCC Flat',
      roofArea: '',
      notes: ''
    });
  };

  const handleStatusChange = (id, newStatus) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (viewLead && viewLead.id === id) {
      setViewLead({ ...viewLead, status: newStatus });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Sun className="text-sun-500" size={24} /> Solar Lead Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage inquiries from initial contact to site survey, quotation, and project booking
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-solar-700 hover:bg-solar-800 text-white font-bold text-xs shadow-md shadow-solar-900/20 transition-all">
            <Plus size={16} /> Register New Solar Lead
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, phone, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-solar-500/20 focus:border-solar-600 outline-none transition-all"
          />
        </div>

        {/* Lead Status Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedStatus('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStatus === 'All' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}>
            All ({leads.length})
          </button>
          {LEAD_STATUSES.map(st => {
            const count = leads.filter(l => l.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === st 
                    ? 'bg-solar-700 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}>
                {st} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads Table using DataTable with Chakra-styled Pagination & Skeleton Loader */}
      <DataTable
        loading={loading}
        data={filteredLeads}
        columns={[
          {
            key: 'customerName',
            label: 'Customer & Contact',
            sortable: true,
            render: (_, lead) => (
              <div>
                <div className="font-bold text-slate-900">{lead.customerName}</div>
                <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-0.5">
                  <Phone size={11} className="text-blue-600" />
                  <span>{lead.mobile}</span>
                  <a
                    href={`https://wa.me/91${lead.mobile}?text=${encodeURIComponent(`Namaste ${lead.customerName} ji, Devagyadi Bharat Solar Private Limited se solar rooftop inquiry ke regarding.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[9px] hover:bg-emerald-200">
                    WhatsApp
                  </a>
                </div>
              </div>
            )
          },
          {
            key: 'district',
            label: 'Location / District',
            sortable: true,
            render: (_, lead) => (
              <div>
                <div className="font-semibold text-slate-700">{lead.district}</div>
                <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{lead.location}</div>
              </div>
            )
          },
          {
            key: 'requiredKw',
            label: 'Required kW & Bill',
            sortable: true,
            render: (_, lead) => (
              <div>
                <div className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg inline-block border border-amber-200">
                  ⚡ {lead.requiredKw}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Bill: {lead.electricityBillAvg}</div>
              </div>
            )
          },
          {
            key: 'leadSource',
            label: 'Lead Source / Dealer',
            render: (_, lead) => (
              <div>
                <div className="font-semibold text-slate-700">{lead.leadSource}</div>
                <div className="text-[11px] text-slate-400">{lead.dealerName}</div>
              </div>
            )
          },
          {
            key: 'followUpDate',
            label: 'Follow-up Date',
            sortable: true,
            render: (_, lead) => (
              <div>
                <div className="font-semibold text-slate-700 flex items-center gap-1">
                  <Calendar size={12} className="text-slate-400" /> {lead.followUpDate || 'Not set'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Assignee: {lead.salesExecutive}</div>
              </div>
            )
          },
          {
            key: 'status',
            label: 'Stage / Status',
            sortable: true,
            render: (_, lead) => (
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                className={`text-xs font-bold rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                  lead.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                  lead.status === 'Installation' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                  lead.status === 'Booking' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                  lead.status === 'Quotation' ? 'bg-indigo-50 text-indigo-800 border-indigo-300' :
                  lead.status === 'Site Survey' ? 'bg-amber-50 text-amber-800 border-amber-300' :
                  lead.status === 'Contacted' ? 'bg-sky-50 text-sky-800 border-sky-300' :
                  lead.status === 'Lost' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                  'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                {LEAD_STATUSES.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            )
          },
          {
            key: 'actions',
            label: 'Actions',
            render: (_, lead) => (
              <div className="inline-flex items-center gap-1">
                <button
                  onClick={() => setViewLead(lead)}
                  title="View Full Details"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-blue-700 hover:bg-blue-50 transition-colors">
                  <Eye size={15} />
                </button>
                <a
                  href="/quotations"
                  title="Generate Quotation"
                  className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                  <FileText size={15} />
                </a>
              </div>
            )
          }
        ]}
      />

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Register New Solar Lead</h3>
                <p className="text-xs text-slate-500">Devagyadi Bharat Solar Rooftop Customer Intake Form</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newLead.customerName}
                    onChange={(e) => setNewLead({ ...newLead, customerName: e.target.value })}
                    placeholder="e.g. Ramesh Chandra Verma"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp No. *</label>
                  <input
                    type="tel"
                    required
                    value={newLead.mobile}
                    onChange={(e) => setNewLead({ ...newLead, mobile: e.target.value })}
                    placeholder="e.g. 9876543210"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">District / Region</label>
                  <input
                    type="text"
                    value={newLead.district}
                    onChange={(e) => setNewLead({ ...newLead, district: e.target.value })}
                    placeholder="e.g. Lucknow, Kanpur, Varanasi"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Complete Address / Colony</label>
                  <input
                    type="text"
                    value={newLead.location}
                    onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                    placeholder="e.g. House No. 24, Vikas Nagar"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Required System Capacity (kW)</label>
                  <select
                    value={newLead.requiredKw}
                    onChange={(e) => setNewLead({ ...newLead, requiredKw: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500">
                    <option value="1 kW">1 kW (Single Phase)</option>
                    <option value="2 kW">2 kW (Single Phase)</option>
                    <option value="3 kW">3 kW (Single Phase / 3 Phase)</option>
                    <option value="4 kW">4 kW</option>
                    <option value="5 kW">5 kW (3 Phase)</option>
                    <option value="7 kW">7 kW (3 Phase)</option>
                    <option value="10 kW">10 kW (3 Phase)</option>
                    <option value="15 kW+">15 kW+ (Commercial)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Monthly Electricity Bill</label>
                  <input
                    type="text"
                    value={newLead.electricityBillAvg}
                    onChange={(e) => setNewLead({ ...newLead, electricityBillAvg: e.target.value })}
                    placeholder="e.g. ₹3,500 / month"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Electricity Consumer Number (DISCOM)</label>
                  <input
                    type="text"
                    value={newLead.consumerNumber}
                    onChange={(e) => setNewLead({ ...newLead, consumerNumber: e.target.value })}
                    placeholder="e.g. PU-10928374"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roof Type</label>
                  <select
                    value={newLead.roofType}
                    onChange={(e) => setNewLead({ ...newLead, roofType: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500">
                    <option value="RCC Flat">RCC Flat (Standard)</option>
                    <option value="RCC Elevated">RCC Elevated (Space Saver)</option>
                    <option value="Tin Shed">Tin / Metal Shed</option>
                    <option value="Tile Roof">Mangalore / Tile Roof</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={newLead.leadSource}
                    onChange={(e) => setNewLead({ ...newLead, leadSource: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500">
                    <option value="PM Surya Ghar Campaign">PM Surya Ghar Campaign</option>
                    <option value="Dealer Network">Dealer Network</option>
                    <option value="Website Inquiry">Website Inquiry</option>
                    <option value="Referral">Customer Referral</option>
                    <option value="Canvassing">Direct Field Canvassing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={newLead.followUpDate}
                    onChange={(e) => setNewLead({ ...newLead, followUpDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Notes / Remarks</label>
                <textarea
                  rows={2}
                  value={newLead.notes}
                  onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
                  placeholder="e.g. Customer wants Mono PERC bifacial modules, loan assistance required..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-solar-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-solar-700 hover:bg-solar-800 text-white rounded-xl shadow-md shadow-solar-900/20">
                  Save Lead & Schedule Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lead Detail Drawer / Modal */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-slate-900">{viewLead.customerName}</h3>
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {viewLead.requiredKw}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{viewLead.district} • {viewLead.location}</p>
              </div>
              <button
                onClick={() => setViewLead(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500">
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl">
                <div>
                  <span className="text-slate-400">Mobile:</span>
                  <p className="font-bold text-slate-800">{viewLead.mobile}</p>
                </div>
                <div>
                  <span className="text-slate-400">Electricity Consumer No:</span>
                  <p className="font-bold text-slate-800">{viewLead.consumerNumber || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Avg Monthly Bill:</span>
                  <p className="font-bold text-slate-800">{viewLead.electricityBillAvg || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-slate-400">Roof Specification:</span>
                  <p className="font-bold text-slate-800">{viewLead.roofType} ({viewLead.roofArea || 'Area TBD'})</p>
                </div>
              </div>

              {/* Estimated Pricing & Subsidy Summary */}
              <div className="p-3 bg-solar-50 border border-solar-200 rounded-2xl">
                <div className="text-xs font-bold text-solar-900 mb-1">Financial & PM Surya Ghar Subsidy Breakdown</div>
                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                  <div className="bg-white p-2 rounded-xl">
                    <div className="text-[10px] text-slate-400">Total System Est.</div>
                    <div className="font-bold text-slate-800">₹{(viewLead.estimatedAmount || 180000).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl">
                    <div className="text-[10px] text-emerald-600 font-bold">Central Subsidy</div>
                    <div className="font-extrabold text-emerald-700">- ₹{(viewLead.subsidyAmount || 78000).toLocaleString('en-IN')}</div>
                  </div>
                  <div className="bg-white p-2 rounded-xl">
                    <div className="text-[10px] text-amber-700 font-bold">Payable by Client</div>
                    <div className="font-extrabold text-amber-800">₹{(viewLead.payableAmount || 102000).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400">Sales Notes & Remarks:</span>
                <p className="mt-1 p-2 bg-slate-50 rounded-xl text-slate-700 font-medium">
                  {viewLead.notes || 'No remarks added yet.'}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <a
                href="/site-surveys"
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs">
                Schedule Site Survey
              </a>
              <a
                href="/quotations"
                className="px-4 py-2 bg-solar-700 hover:bg-solar-800 text-white font-bold rounded-xl text-xs">
                Create Solar Quotation
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
