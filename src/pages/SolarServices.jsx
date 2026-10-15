import { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  Plus, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Wrench, 
  Camera, 
  Sun,
  UserCheck,
  Calendar,
  Filter,
  Eye,
  CheckCircle,
  AlertTriangle,
  X,
  Image,
  Upload,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Zap,
  Building,
  FileText
} from 'lucide-react';
import { api } from '../utils/api';
import DataTable from '../components/shared/DataTable';
import { CardSkeleton } from '../components/shared/Skeleton';

export default function SolarServices() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null); // For Detail Drawer / Photo inspection
  const [photoViewer, setPhotoViewer] = useState(null); // Full photo preview modal

  // Raise Complaint Form State matching exact 8 fields
  const [form, setForm] = useState({
    customerName: '',
    projectId: '',
    mobile: '',
    consumerNo: '',
    complaintType: 'Inverter Grid Error / Generation Drop',
    priority: 'Medium',
    technicianAssignment: 'Vikram Yadav (Lead Solar Tech)',
    visitDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    description: '',
    resolution: '',
    beforePhotoUrl: '',
    afterPhotoUrl: '',
    complaintStatus: 'In Progress'
  });

  const loadComplaints = async () => {
    try {
      const data = await api.get('/solar/complaints');
      setComplaints(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const techName = form.technicianAssignment.split(' (')[0];
    const createdPayload = {
      customerName: form.customerName,
      projectId: form.projectId || 'DBPL-2026-00009',
      consumerNo: form.consumerNo || 'PU-78392104',
      mobile: form.mobile,
      complaintType: form.complaintType,
      priority: form.priority,
      technicianName: techName,
      technicianAssignment: form.technicianAssignment,
      visitDate: form.visitDate,
      resolution: form.resolution || 'Assigned to site technician for initial diagnosis.',
      beforePhotos: form.beforePhotoUrl ? [form.beforePhotoUrl] : [],
      afterPhotos: form.afterPhotoUrl ? [form.afterPhotoUrl] : [],
      complaintStatus: form.complaintStatus,
      description: form.description
    };

    try {
      const saved = await api.post('/solar/complaints', createdPayload);
      setComplaints([saved, ...complaints]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to register complaint:', err);
      alert('Error registering complaint: ' + err.message);
    }
    // Reset form
    setForm({
      customerName: '',
      projectId: '',
      mobile: '',
      consumerNo: '',
      complaintType: 'Inverter Grid Error / Generation Drop',
      priority: 'Medium',
      technicianAssignment: 'Vikram Yadav (Lead Solar Tech)',
      visitDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      description: '',
      resolution: '',
      beforePhotoUrl: '',
      afterPhotoUrl: '',
      complaintStatus: 'Open'
    });
  };

  const handleUpdateStatus = (id, newStatus, newResolution) => {
    setComplaints(complaints.map(c => {
      if (c.id === id || c.complaintNumber === id) {
        return {
          ...c,
          complaintStatus: newStatus,
          status: newStatus,
          resolution: newResolution !== undefined ? newResolution : c.resolution
        };
      }
      return c;
    }));
    if (selectedTicket && (selectedTicket.id === id || selectedTicket.complaintNumber === id)) {
      setSelectedTicket(prev => ({
        ...prev,
        complaintStatus: newStatus,
        status: newStatus,
        resolution: newResolution !== undefined ? newResolution : prev.resolution
      }));
    }
  };

  const filtered = complaints.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      c.complaintNumber?.toLowerCase().includes(term) ||
      c.customerName?.toLowerCase().includes(term) ||
      c.projectId?.toLowerCase().includes(term) ||
      c.consumerNo?.toLowerCase().includes(term) ||
      c.complaintType?.toLowerCase().includes(term) ||
      c.technicianName?.toLowerCase().includes(term);

    const matchStatus = 
      statusFilter === 'ALL' || 
      c.complaintStatus?.toUpperCase() === statusFilter ||
      c.status?.toUpperCase() === statusFilter;

    const matchPriority =
      priorityFilter === 'ALL' ||
      c.priority?.toUpperCase() === priorityFilter;

    return matchSearch && matchStatus && matchPriority;
  });

  // KPI Calculations
  const totalTickets = complaints.length;
  const openCount = complaints.filter(c => c.complaintStatus === 'Open' || c.complaintStatus === 'Assigned' || c.status === 'Open').length;
  const inProgressCount = complaints.filter(c => c.complaintStatus === 'In Progress' || c.status === 'In Progress' || c.complaintStatus === 'Scheduled').length;
  const resolvedCount = complaints.filter(c => c.complaintStatus === 'Resolved' || c.complaintStatus === 'Closed' || c.status === 'Resolved').length;

  // Exact 8 Fields matching user prompt 4.J:
  // 1. Complaint Number
  // 2. Complaint Type
  // 3. Priority
  // 4. Technician Assignment
  // 5. Visit Date
  // 6. Resolution
  // 7. Before/After Photos
  // 8. Complaint Status
  const columns = [
    {
      key: 'complaintNumber',
      label: '1. Complaint Number',
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="font-mono font-bold text-xs text-[#166534] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 inline-block shadow-2xs">
            {row.complaintNumber || row.id}
          </span>
          <div className="text-[11px] font-mono text-slate-500 font-semibold mt-1">
            {row.projectId}
          </div>
          <div className="text-[10px] text-slate-400">
            Rep: {row.reportedDate}
          </div>
        </div>
      )
    },
    {
      key: 'customerName',
      label: 'Customer & Project',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-extrabold text-xs text-slate-900">{row.customerName}</div>
          <div className="text-[11px] text-slate-500 font-medium">📞 +91 {row.mobile}</div>
          <div className="text-[10px] font-mono text-slate-400">⚡ Cons: {row.consumerNo || '—'}</div>
        </div>
      )
    },
    {
      key: 'complaintType',
      label: '2. Complaint Type',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-bold text-xs text-slate-800 leading-snug">
            {row.complaintType}
          </div>
          <div className="text-[10.5px] text-slate-500 line-clamp-1 mt-0.5" title={row.description}>
            {row.description}
          </div>
        </div>
      )
    },
    {
      key: 'priority',
      label: '3. Priority',
      sortable: true,
      render: (_, row) => {
        const p = row.priority;
        let badge = 'bg-slate-100 text-slate-700 border-slate-200';
        if (p === 'Urgent') badge = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
        else if (p === 'High') badge = 'bg-rose-50 text-rose-700 border-rose-200 font-black';
        else if (p === 'Medium') badge = 'bg-amber-50 text-amber-800 border-amber-200 font-bold';
        else if (p === 'Low') badge = 'bg-emerald-50 text-emerald-800 border-emerald-200';

        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badge}`}>
            {p === 'Urgent' && <AlertCircle size={10} />}
            {p}
          </span>
        );
      }
    },
    {
      key: 'technicianAssignment',
      label: '4. Technician Assignment',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
            <UserCheck size={13} className="text-[#166534]" />
            {row.technicianName || row.technicianAssignment}
          </div>
          <div className="text-[10.5px] text-slate-500 mt-0.5">
            {row.technicianAssignment ? row.technicianAssignment.split('(')[1]?.replace(')', '') : 'Field Service'}
          </div>
        </div>
      )
    },
    {
      key: 'visitDate',
      label: '5. Visit Date',
      sortable: true,
      render: (_, row) => (
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 font-semibold bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            <Calendar size={12} className="text-slate-400" />
            {row.visitDate || 'TBD'}
          </span>
        </div>
      )
    },
    {
      key: 'resolution',
      label: '6. Resolution',
      render: (_, row) => (
        <div className="max-w-[210px]">
          {row.resolution ? (
            <div className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed bg-slate-50 p-1.5 rounded-lg border border-slate-200/80" title={row.resolution}>
              {row.resolution}
            </div>
          ) : (
            <span className="text-[11px] text-amber-600 font-semibold italic">
              Pending site diagnosis
            </span>
          )}
        </div>
      )
    },
    {
      key: 'photos',
      label: '7. Before/After Photos',
      render: (_, row) => {
        const hasBefore = row.beforePhotos && row.beforePhotos.length > 0;
        const hasAfter = row.afterPhotos && row.afterPhotos.length > 0;

        return (
          <div className="flex items-center gap-2">
            {/* Before Photo Badge */}
            {hasBefore ? (
              <button
                onClick={() => setPhotoViewer({ title: `Before Photo - ${row.complaintNumber}`, url: row.beforePhotos[0], tag: 'BEFORE REPAIR' })}
                className="relative group w-8 h-8 rounded-lg overflow-hidden border border-rose-300 ring-1 ring-rose-200 shadow-2xs hover:scale-105 transition-transform"
                title="View Before Photo">
                <img src={row.beforePhotos[0]} alt="Before" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-rose-600/90 text-white text-[7.5px] font-black text-center py-0.2">
                  BEF
                </span>
              </button>
            ) : (
              <span className="w-8 h-8 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-[8px] text-slate-300">
                No B
              </span>
            )}

            {/* After Photo Badge */}
            {hasAfter ? (
              <button
                onClick={() => setPhotoViewer({ title: `After Photo - ${row.complaintNumber}`, url: row.afterPhotos[0], tag: 'AFTER REPAIR' })}
                className="relative group w-8 h-8 rounded-lg overflow-hidden border border-emerald-300 ring-1 ring-emerald-200 shadow-2xs hover:scale-105 transition-transform"
                title="View After Photo">
                <img src={row.afterPhotos[0]} alt="After" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-[#166534]/90 text-white text-[7.5px] font-black text-center py-0.2">
                  AFT
                </span>
              </button>
            ) : (
              <span className="w-8 h-8 rounded-lg border border-dashed border-slate-200 flex items-center justify-center text-[8px] text-slate-300">
                No A
              </span>
            )}

            <button
              onClick={() => setSelectedTicket(row)}
              className="p-1 rounded-md text-slate-400 hover:text-[#166534] hover:bg-emerald-50 transition-colors"
              title="Inspect Full Complaint Dossier">
              <Eye size={14} />
            </button>
          </div>
        );
      }
    },
    {
      key: 'complaintStatus',
      label: '8. Complaint Status',
      sortable: true,
      render: (_, row) => {
        const st = row.complaintStatus || row.status;
        let badge = 'bg-slate-100 text-slate-700 border-slate-200';
        if (st === 'Resolved' || st === 'Closed') badge = 'bg-emerald-50 text-[#166534] border-emerald-200 font-black';
        else if (st === 'In Progress') badge = 'bg-sky-50 text-sky-800 border-sky-200 font-bold';
        else if (st === 'Assigned' || st === 'Scheduled') badge = 'bg-indigo-50 text-indigo-800 border-indigo-200';
        else if (st === 'Open') badge = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';

        return (
          <div className="space-y-1">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${badge}`}>
              {(st === 'Resolved' || st === 'Closed') ? <CheckCircle size={10} /> : <Clock size={10} />}
              {st}
            </span>
            <div className="flex gap-1">
              {st !== 'Resolved' && (
                <button
                  onClick={() => handleUpdateStatus(row.id, 'Resolved')}
                  className="text-[9.5px] font-bold text-emerald-700 hover:underline">
                  Mark Done
                </button>
              )}
            </div>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <LifeBuoy className="text-[#166534]" size={24} /> J. Service & Complaint Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customer complaint raising, technician field assignment, visit schedule, resolution notes & before/after site photos
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-all active:scale-95">
          <Plus size={16} /> Raise New Solar Complaint
        </button>
      </div>

      {/* KPI Stats Strip */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <CardSkeleton /><CardSkeleton /><CardSkeleton /><CardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[11px] font-black uppercase tracking-wider text-slate-400">Total Solar Tickets</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalTickets}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">All customer inquiries</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs border-l-4 border-l-rose-500">
            <div className="text-[11px] font-black uppercase tracking-wider text-rose-600">Open / Pending Visits</div>
            <div className="text-2xl font-black text-rose-700 mt-1">{openCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Awaiting technician visit</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs border-l-4 border-l-sky-500">
            <div className="text-[11px] font-black uppercase tracking-wider text-sky-700">In Progress / Field Trips</div>
            <div className="text-2xl font-black text-sky-800 mt-1">{inProgressCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Under technician inspection</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs border-l-4 border-l-emerald-600">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#166534]">Resolved & Restored</div>
            <div className="text-2xl font-black text-[#166534] mt-1">{resolvedCount}</div>
            <div className="text-[10px] text-slate-500 mt-0.5">Generation restored & closed</div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search complaint no, customer, project, technician or fault..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] text-xs font-semibold text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Quick Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 outline-none">
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Pills */}
          {[
            { id: 'ALL', label: 'All Statuses' },
            { id: 'OPEN', label: 'Open' },
            { id: 'ASSIGNED', label: 'Assigned' },
            { id: 'IN PROGRESS', label: 'In Progress' },
            { id: 'RESOLVED', label: 'Resolved' },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => setStatusFilter(s.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                statusFilter === s.id
                  ? 'bg-[#166534] text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Complaints DataTable */}
      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        skeletonRows={5}
        skeletonCols={9}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />

      {/* Raise Customer Complaint Modal (4.J Customer complaint raise kar sake) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <LifeBuoy className="text-[#166534]" size={20} /> Raise Solar Service Complaint (4.J)
              </h3>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 py-4 text-xs">
              {/* Customer Selector / Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E]"
                    placeholder="Enter customer name"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp *</label>
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
                  <label className="block font-bold text-slate-700 mb-1">Project ID</label>
                  <input
                    type="text"
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-mono"
                    placeholder="e.g. DBPL-2026-00001"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Electricity Consumer No</label>
                  <input
                    type="text"
                    value={form.consumerNo}
                    onChange={(e) => setForm({ ...form, consumerNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-mono"
                    placeholder="e.g. PU-12093485"
                  />
                </div>
              </div>

              {/* 2. Complaint Type & 3. Priority */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">2. Complaint Type *</label>
                  <select
                    value={form.complaintType}
                    onChange={(e) => setForm({ ...form, complaintType: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold">
                    <option value="Inverter Grid Error / Generation Drop">Inverter Grid Error / Generation Drop</option>
                    <option value="Net Meter Reading Mismatch">Net Meter Reading Mismatch</option>
                    <option value="Earthing Pit Resistance Issue">Earthing Pit Resistance Issue</option>
                    <option value="Wi-Fi Dongle / App Offline">Wi-Fi Dongle / App Offline</option>
                    <option value="Solar Panel Physical Damage / Hotspot">Solar Panel Physical Damage / Hotspot</option>
                    <option value="Wiring / MC4 Connector Loose">Wiring / MC4 Connector Loose</option>
                    <option value="Routine Maintenance / Panel Cleaning Service">Routine Maintenance / Panel Cleaning Service</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">3. Priority *</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
                    <option value="Urgent">Urgent (Plant Completely Shut)</option>
                    <option value="High">High (High Generation Loss)</option>
                    <option value="Medium">Medium (App or Minor Issue)</option>
                    <option value="Low">Low (Routine AMC / Cleaning)</option>
                  </select>
                </div>
              </div>

              {/* 4. Technician Assignment & 5. Visit Date */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">4. Technician Assignment *</label>
                  <select
                    value={form.technicianAssignment}
                    onChange={(e) => setForm({ ...form, technicianAssignment: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold">
                    <option value="Vikram Yadav (Lead Solar Tech)">Vikram Yadav (Lead Solar Tech)</option>
                    <option value="Rameshwar Sharma (O&M Specialist)">Rameshwar Sharma (O&M Specialist)</option>
                    <option value="Mahesh Chauhan (Electrical Engineer)">Mahesh Chauhan (Electrical Engineer)</option>
                    <option value="Amit Tiwari (Earthing & Safety Tech)">Amit Tiwari (Earthing & Safety Tech)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">5. Visit Date *</label>
                  <input
                    type="date"
                    required
                    value={form.visitDate}
                    onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Customer Issue Description *</label>
                <textarea
                  required
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detail symptoms, error code on inverter display (e.g. Fault 04) or generation drop..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E]"
                />
              </div>

              {/* 6. Resolution Notes */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">6. Resolution Plan / Technician Diagnosis</label>
                <input
                  type="text"
                  value={form.resolution}
                  onChange={(e) => setForm({ ...form, resolution: e.target.value })}
                  placeholder="Initial diagnosis plan or replacement action items..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E]"
                />
              </div>

              {/* 7. Before & After Photo URLs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">7. Before Photo (Image URL)</label>
                  <input
                    type="url"
                    value={form.beforePhotoUrl}
                    onChange={(e) => setForm({ ...form, beforePhotoUrl: e.target.value })}
                    placeholder="https://... faulty part photo"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] text-[11px]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">After Photo (Image URL)</label>
                  <input
                    type="url"
                    value={form.afterPhotoUrl}
                    onChange={(e) => setForm({ ...form, afterPhotoUrl: e.target.value })}
                    placeholder="https://... resolved photo"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] text-[11px]"
                  />
                </div>
              </div>

              {/* 8. Complaint Status */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">8. Initial Complaint Status</label>
                <select
                  value={form.complaintStatus}
                  onChange={(e) => setForm({ ...form, complaintStatus: e.target.value })}
                  className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
                  <option value="Open">Open (Ticket Logged)</option>
                  <option value="Assigned">Assigned (Tech Dispatched)</option>
                  <option value="In Progress">In Progress (At Site)</option>
                  <option value="Resolved">Resolved (System Restored)</option>
                </select>
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
                  Save & Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Drawer */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#166534] bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    {selectedTicket.complaintNumber || selectedTicket.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    selectedTicket.priority === 'High' || selectedTicket.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {selectedTicket.priority}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                    {selectedTicket.complaintStatus || selectedTicket.status}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-1.5">
                  {selectedTicket.complaintType}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedTicket(null)} 
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            {/* Customer & Technical Profile */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Customer Profile</div>
                <div className="font-black text-slate-900 text-sm mt-0.5">{selectedTicket.customerName}</div>
                <div className="text-slate-600 mt-0.5">📞 +91 {selectedTicket.mobile}</div>
                <div className="text-slate-500 font-mono mt-0.5">Cons ID: {selectedTicket.consumerNo || 'PU-78392104'}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Field Assignment</div>
                <div className="font-black text-[#166534] text-sm mt-0.5">{selectedTicket.technicianName}</div>
                <div className="text-slate-600 mt-0.5">📅 Visit Date: {selectedTicket.visitDate}</div>
                <div className="text-slate-500 font-mono mt-0.5">Project: {selectedTicket.projectId}</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Issue Description</div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                {selectedTicket.description}
              </div>
            </div>

            {/* Resolution Section */}
            <div>
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-1">Resolution & Service Action</div>
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
                {selectedTicket.resolution || 'Awaiting site inspection and diagnosis notes from technician.'}
              </div>
            </div>

            {/* Before / After Photos Showcase (User Field 7) */}
            <div>
              <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>7. Before & After Inspection Photos</span>
                <span className="text-[10px] text-slate-400 font-medium">Click image to enlarge</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Before Photos */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-rose-700 flex items-center gap-1">
                    <AlertTriangle size={13} /> BEFORE REPAIR
                  </div>
                  {selectedTicket.beforePhotos && selectedTicket.beforePhotos.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTicket.beforePhotos.map((url, i) => (
                        <div
                          key={i}
                          onClick={() => setPhotoViewer({ title: `Before Repair (${i + 1})`, url, tag: 'BEFORE REPAIR' })}
                          className="relative h-40 rounded-xl overflow-hidden border-2 border-rose-200 cursor-pointer group shadow-xs">
                          <img src={url} alt="Before" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                            <Eye size={14} /> Enlarge Photo
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                      <Camera size={24} className="mb-1 text-slate-300" />
                      No before photo uploaded
                    </div>
                  )}
                </div>

                {/* After Photos */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-bold text-[#166534] flex items-center gap-1">
                    <CheckCircle2 size={13} /> AFTER REPAIR / RESTORATION
                  </div>
                  {selectedTicket.afterPhotos && selectedTicket.afterPhotos.length > 0 ? (
                    <div className="space-y-2">
                      {selectedTicket.afterPhotos.map((url, i) => (
                        <div
                          key={i}
                          onClick={() => setPhotoViewer({ title: `After Repair (${i + 1})`, url, tag: 'AFTER REPAIR' })}
                          className="relative h-40 rounded-xl overflow-hidden border-2 border-emerald-200 cursor-pointer group shadow-xs">
                          <img src={url} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
                            <Eye size={14} /> Enlarge Photo
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-40 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 text-xs">
                      <Camera size={24} className="mb-1 text-slate-300" />
                      No after photo uploaded yet
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Status Toggles */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Update Status:</span>
                {['Open', 'In Progress', 'Resolved', 'Closed'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedTicket.id, st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                      (selectedTicket.complaintStatus === st || selectedTicket.status === st)
                        ? 'bg-[#166534] text-white border-[#166534]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                    {st}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Preview Lightbox */}
      {photoViewer && (
        <div 
          onClick={() => setPhotoViewer(null)}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-4 shadow-2xl overflow-hidden border border-slate-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${
                  photoViewer.tag.includes('BEFORE') ? 'bg-rose-600' : 'bg-[#166534]'
                }`}>
                  {photoViewer.tag}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">{photoViewer.title}</h4>
              </div>
              <button 
                onClick={() => setPhotoViewer(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="h-96 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <img src={photoViewer.url} alt={photoViewer.title} className="max-h-full max-w-full object-contain" />
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setPhotoViewer(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold">
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
