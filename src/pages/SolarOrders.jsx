import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Zap, 
  Truck, 
  CreditCard, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  Phone, 
  Download, 
  X,
  Building,
  User,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { CardSkeleton } from '../components/shared/Skeleton';
import DataTable from '../components/shared/DataTable';
import { api } from '../utils/api';

export default function SolarOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Form State for new order creation
  const [form, setForm] = useState({
    customerName: '',
    mobile: '',
    orderDate: new Date().toISOString().split('T')[0],
    systemCapacity: '5 kW',
    totalAmount: 318000,
    bookingAmount: 50000,
    materialStatus: 'Ordered',
    paymentStatus: 'Token Received (20%)',
    installationStatus: 'Scheduled',
    consumerNumber: '',
    district: 'Lucknow',
    panelBrand: 'Waaree 550W TopCon (9 Nos.)',
    inverterBrand: 'Growatt 5kW 3-Phase',
    assignedInstaller: 'Rameshwar Sharma'
  });

  const loadOrders = async () => {
    try {
      const data = await api.get('/solar/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load solar orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      const saved = await api.post('/solar/orders', form);
      setOrders([saved, ...orders]);
      setShowAddModal(false);
    } catch (err) {
      console.error('Failed to save order:', err);
      alert('Order save failed: ' + err.message);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchSearch = 
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.mobile.includes(searchTerm) ||
      o.consumerNumber?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchFilter = 
      statusFilter === 'ALL' ||
      (statusFilter === 'DISPATCHED' && o.materialStatus.toLowerCase().includes('dispatch')) ||
      (statusFilter === 'DELIVERED' && o.materialStatus.toLowerCase().includes('deliver')) ||
      (statusFilter === 'PAID' && o.paymentStatus.toLowerCase().includes('full')) ||
      (statusFilter === 'INSTALLING' && o.installationStatus.toLowerCase().includes('progress'));

    return matchSearch && matchFilter;
  });

  const getMaterialBadge = (status) => {
    if (status.includes('Delivered')) {
      return 'bg-emerald-50 text-[#166534] border-emerald-200';
    }
    if (status.includes('Dispatched') || status.includes('Transit')) {
      return 'bg-sky-50 text-sky-800 border-sky-200';
    }
    return 'bg-amber-50 text-amber-800 border-amber-200';
  };

  const getPaymentBadge = (status) => {
    if (status.includes('100%') || status.includes('Full')) {
      return 'bg-emerald-100 text-[#166534] font-black border-emerald-300';
    }
    if (status.includes('70%')) {
      return 'bg-blue-100 text-blue-800 font-bold border-blue-200';
    }
    return 'bg-amber-100 text-amber-900 font-bold border-yellow-300';
  };

  const getInstallationBadge = (status) => {
    if (status.includes('Commissioned')) {
      return 'bg-emerald-50 text-[#166534] border-emerald-200';
    }
    if (status.includes('In Progress')) {
      return 'bg-purple-50 text-purple-800 border-purple-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const columns = [
    {
      key: 'orderId',
      label: 'Order Details',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-extrabold text-xs text-slate-900 font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
            {row.orderId}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <Calendar size={12} className="text-slate-400" /> {row.orderDate}
          </div>
        </div>
      )
    },
    {
      key: 'customerName',
      label: 'Customer & Contact',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-bold text-xs text-slate-900">{row.customerName}</div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
            <Phone size={11} className="text-slate-400" /> +91 {row.mobile}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Cons: {row.consumerNumber}</div>
        </div>
      )
    },
    {
      key: 'systemCapacity',
      label: 'Capacity (kW)',
      sortable: true,
      render: (_, row) => (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 text-amber-900 font-black text-xs border border-yellow-300 shadow-2xs">
          <Zap size={12} className="text-[#166534] fill-[#FACC15]" /> {row.systemCapacity}
        </span>
      )
    },
    {
      key: 'bookingAmount',
      label: 'Booking Amount & Total',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-black text-xs text-[#166534]">
            ₹{row.bookingAmount.toLocaleString('en-IN')} <span className="text-[10px] text-slate-400 font-normal">(Advance)</span>
          </div>
          <div className="text-[11px] text-slate-500 font-semibold">
            Total: ₹{row.totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      )
    },
    {
      key: 'materialStatus',
      label: 'Material Status',
      render: (_, row) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${getMaterialBadge(row.materialStatus)}`}>
          <Truck size={12} /> {row.materialStatus}
        </span>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (_, row) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] border ${getPaymentBadge(row.paymentStatus)}`}>
          <CreditCard size={12} /> {row.paymentStatus}
        </span>
      )
    },
    {
      key: 'installationStatus',
      label: 'Installation Status',
      render: (_, row) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${getInstallationBadge(row.installationStatus)}`}>
          <Wrench size={12} /> {row.installationStatus}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Action',
      render: (_, row) => (
        <button
          onClick={() => setSelectedOrder(row)}
          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-[#166534] text-[#166534] hover:text-white transition-colors">
          <Eye size={15} />
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-[#166534]" size={24} /> Solar Order Management (4.F)
          </h1>
          <p className="text-xs text-slate-500">
            Booking Amount, System Capacity, Material Tracking, Milestone Payments & Installation Synchronization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-xs">
            <Plus size={16} /> Book New Order
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Booked Orders</span>
            <ShoppingBag size={16} className="text-[#166534]" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2 font-display">{orders.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">27 kW Pipeline</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Booking Token Collected</span>
            <CreditCard size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#166534] mt-2 font-display">
            ₹{orders.reduce((sum, o) => sum + o.bookingAmount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Token Advance Stage</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Material in Transit / Site</span>
            <Truck size={16} className="text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-800 mt-2 font-display">
            {orders.filter(o => o.materialStatus.includes('Transit') || o.materialStatus.includes('Deliver')).length}
          </div>
          <div className="text-[11px] text-sky-600 font-semibold mt-1">Modules & Inverters En Route</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Commissioned & Synced</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-2 font-display">
            {orders.filter(o => o.installationStatus.includes('Commissioned')).length}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Net Meter Active</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search order ID, customer name, mobile, consumer no..."
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
            { id: 'ALL', label: 'All Orders' },
            { id: 'DISPATCHED', label: 'Dispatched' },
            { id: 'DELIVERED', label: 'Delivered at Site' },
            { id: 'PAID', label: '100% Paid' },
            { id: 'INSTALLING', label: 'In Progress' }
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

      {/* Orders DataTable with Chakra-Style Pagination */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        loading={loading}
        skeletonRows={5}
        skeletonCols={7}
        initialPageSize={10}
        pageSizeOptions={[5, 10, 20, 50]}
      />

      {/* Order Details Drawer / Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#166534] flex items-center justify-center font-black">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 font-mono">{selectedOrder.orderId}</h3>
                  <p className="text-xs text-slate-500">Order Booking Dossier</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-400 uppercase text-[10px] mb-1">Customer Profile</div>
                <div className="font-black text-sm text-slate-900">{selectedOrder.customerName}</div>
                <div className="text-slate-600 mt-0.5">📞 +91 {selectedOrder.mobile} | ⚡ {selectedOrder.consumerNumber}</div>
                <div className="text-slate-600 mt-0.5">📍 {selectedOrder.district}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-yellow-50/50 border border-yellow-200">
                  <div className="text-[10px] font-bold text-yellow-800 uppercase">System Capacity</div>
                  <div className="text-sm font-black text-slate-900 mt-0.5">{selectedOrder.systemCapacity}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{selectedOrder.panelBrand}</div>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">Booking Advance</div>
                  <div className="text-sm font-black text-[#166534] mt-0.5">₹{selectedOrder.bookingAmount.toLocaleString('en-IN')}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Total: ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Order Date:</span>
                  <span className="font-semibold text-slate-900">{selectedOrder.orderDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Material Status:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getMaterialBadge(selectedOrder.materialStatus)}`}>
                    {selectedOrder.materialStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Payment Status:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getPaymentBadge(selectedOrder.paymentStatus)}`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Installation Status:</span>
                  <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${getInstallationBadge(selectedOrder.installationStatus)}`}>
                    {selectedOrder.installationStatus}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600">Chief Installer:</span>
                  <span className="font-semibold text-slate-900">{selectedOrder.assignedInstaller}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800">
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Book New Order Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <ShoppingBag className="text-[#166534]" size={20} /> New Solar Order Booking
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3.5 py-4 text-xs">
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
                  <label className="block font-bold text-slate-700 mb-1">Order Date *</label>
                  <input
                    type="date"
                    required
                    value={form.orderDate}
                    onChange={(e) => setForm({ ...form, orderDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">System Capacity (kW) *</label>
                  <select
                    value={form.systemCapacity}
                    onChange={(e) => setForm({ ...form, systemCapacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-bold">
                    <option value="2 kW">2 kW (Residential)</option>
                    <option value="3 kW">3 kW (Residential)</option>
                    <option value="5 kW">5 kW (Residential / Villa)</option>
                    <option value="7 kW">7 kW (3-Phase Domestic)</option>
                    <option value="10 kW">10 kW (Commercial)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Booking Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.bookingAmount}
                    onChange={(e) => setForm({ ...form, bookingAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-bold text-[#166534]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Project Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.totalAmount}
                    onChange={(e) => setForm({ ...form, totalAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Material Status</label>
                  <select
                    value={form.materialStatus}
                    onChange={(e) => setForm({ ...form, materialStatus: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="Ordered">Ordered</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Dispatched from Warehouse">Dispatched</option>
                    <option value="Delivered at Site">Delivered at Site</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={form.paymentStatus}
                    onChange={(e) => setForm({ ...form, paymentStatus: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="Token Received (20%)">Token Received (20%)</option>
                    <option value="70% Cleared (Material Stage)">70% Cleared</option>
                    <option value="Fully Paid (100%)">Fully Paid (100%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Installation Status</label>
                  <select
                    value={form.installationStatus}
                    onChange={(e) => setForm({ ...form, installationStatus: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs">
                    <option value="Pending Survey">Pending Survey</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress (Structure Erected)">In Progress</option>
                    <option value="Commissioned & Net Meter Synced">Commissioned</option>
                  </select>
                </div>
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
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
