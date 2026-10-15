import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Download, 
  Printer, 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Sun,
  ShieldCheck,
  FileText,
  Eye,
  Filter,
  X,
  Share2,
  Building,
  UserCheck,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import DataTable from '../components/shared/DataTable';
import { CardSkeleton } from '../components/shared/Skeleton';

export default function SolarPayments() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showAddReceipt, setShowAddReceipt] = useState(false);
  const [printableReceipt, setPrintableReceipt] = useState(null);

  // Exact 8 Fields matching User Requirement 4.I:
  // - Total Project Amount
  // - Advance
  // - Installment
  // - Amount Received
  // - Outstanding Amount
  // - Payment Date
  // - Payment Mode
  // - Receipt Generation
  const [paymentLedger, setPaymentLedger] = useState([
    {
      id: 'RCP-2026-0091',
      receiptNo: 'RCP-2026-0091',
      projectId: 'DBPL-2026-00001',
      customerName: 'Dr. Anand Swaroop Mishra',
      mobile: '9935678901',
      consumerNo: 'PU-12093485',
      systemCapacity: '10 kW',
      
      totalProjectAmount: 540000,
      advanceAmount: 100000,
      installmentType: 'Final Settlement (Milestone 3)',
      amountReceived: 54000,
      totalReceivedToDate: 540000,
      outstandingAmount: 0,
      paymentDate: '2026-10-04',
      paymentMode: 'Bank RTGS / NEFT',
      transactionRef: 'HDFCR5202610049921',
      receivedBy: 'Amit Verma'
    },
    {
      id: 'RCP-2026-0092',
      receiptNo: 'RCP-2026-0092',
      projectId: 'DBPL-2026-00002',
      customerName: 'Sunita Devi Agrawal',
      mobile: '9788112245',
      consumerNo: 'PU-99382012',
      systemCapacity: '7 kW',

      totalProjectAmount: 395000,
      advanceAmount: 75000,
      installmentType: 'Material Delivery (Milestone 2 - 70%)',
      amountReceived: 150000,
      totalReceivedToDate: 225000,
      outstandingAmount: 170000,
      paymentDate: '2026-10-06',
      paymentMode: 'Cheque Clearance',
      transactionRef: 'CHQ-882910 (SBI)',
      receivedBy: 'Amit Verma'
    },
    {
      id: 'RCP-2026-0093',
      receiptNo: 'RCP-2026-0093',
      projectId: 'DBPL-2026-00003',
      customerName: 'Dinesh Kumar Maurya',
      mobile: '9450123456',
      consumerNo: 'VU-10293847',
      systemCapacity: '2 kW',

      totalProjectAmount: 130000,
      advanceAmount: 25000,
      installmentType: 'Booking Advance Token (20%)',
      amountReceived: 25000,
      totalReceivedToDate: 25000,
      outstandingAmount: 105000,
      paymentDate: '2026-10-02',
      paymentMode: 'UPI / QR Code',
      transactionRef: 'UPI/261002998124',
      receivedBy: 'Rohan Gupta'
    },
    {
      id: 'RCP-2026-0094',
      receiptNo: 'RCP-2026-0094',
      projectId: 'DBPL-2026-00004',
      customerName: 'Vikram Singh Chauhan',
      mobile: '9811223344',
      consumerNo: 'KU-44589211',
      systemCapacity: '3 kW',

      totalProjectAmount: 180000,
      advanceAmount: 36000,
      installmentType: 'Booking Advance Token (20%)',
      amountReceived: 36000,
      totalReceivedToDate: 36000,
      outstandingAmount: 144000,
      paymentDate: '2026-10-09',
      paymentMode: 'Bank RTGS / NEFT',
      transactionRef: 'ICICR202610091104',
      receivedBy: 'Sneha Patel'
    },
    {
      id: 'RCP-2026-0095',
      receiptNo: 'RCP-2026-0095',
      projectId: 'DBPL-2026-00005',
      customerName: 'Rajendra Prasad Sharma',
      mobile: '9876543210',
      consumerNo: 'PU-78392104',
      systemCapacity: '5 kW',

      totalProjectAmount: 318640,
      advanceAmount: 50000,
      installmentType: 'Material Delivery (Milestone 2 - 70%)',
      amountReceived: 173000,
      totalReceivedToDate: 223000,
      outstandingAmount: 95640,
      paymentDate: '2026-10-10',
      paymentMode: 'UPI / QR Code',
      transactionRef: 'UPI/261010887123',
      receivedBy: 'Amit Verma'
    }
  ]);

  // Form State for creating a new Payment & Receipt
  const [form, setForm] = useState({
    customerName: '',
    mobile: '',
    consumerNo: '',
    projectId: 'DBPL-2026-00006',
    systemCapacity: '5 kW',
    totalProjectAmount: 318000,
    advanceAmount: 50000,
    installmentType: 'Booking Advance Token (20%)',
    amountReceived: 50000,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'UPI / QR Code',
    transactionRef: '',
    receivedBy: 'Amit Verma'
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const handleAddReceipt = (e) => {
    e.preventDefault();
    const total = Number(form.totalProjectAmount);
    const receivedNow = Number(form.amountReceived);
    const advance = Number(form.advanceAmount);
    const item = {
      id: `RCP-2026-00${paymentLedger.length + 96}`,
      receiptNo: `RCP-2026-00${paymentLedger.length + 96}`,
      ...form,
      totalProjectAmount: total,
      advanceAmount: advance,
      amountReceived: receivedNow,
      totalReceivedToDate: advance + receivedNow,
      outstandingAmount: Math.max(0, total - (advance + receivedNow))
    };
    setPaymentLedger([item, ...paymentLedger]);
    setShowAddReceipt(false);
  };

  const filtered = paymentLedger.filter(p => {
    const matchSearch =
      p.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.consumerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mobile.includes(searchTerm);

    const matchStatus = 
      statusFilter === 'ALL' ||
      (statusFilter === 'CLEAR' && p.outstandingAmount === 0) ||
      (statusFilter === 'DUE' && p.outstandingAmount > 0) ||
      (statusFilter === 'ADVANCE' && p.installmentType.includes('Advance'));

    return matchSearch && matchStatus;
  });

  const getModeBadge = (mode) => {
    if (mode.includes('UPI')) return 'bg-emerald-50 text-[#166534] border-emerald-200';
    if (mode.includes('RTGS') || mode.includes('NEFT')) return 'bg-sky-50 text-sky-800 border-sky-200';
    if (mode.includes('Cheque')) return 'bg-amber-50 text-amber-900 border-amber-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const columns = [
    {
      key: 'receiptNo',
      label: 'Receipt & Project',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="font-mono font-bold text-xs text-[#166534] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
            {row.receiptNo}
          </div>
          <div className="text-[11px] font-mono text-slate-500 font-semibold mt-1">{row.projectId}</div>
          <div className="text-[10px] text-slate-400">{row.installmentType}</div>
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
          <div className="text-[10px] font-mono text-slate-400">Cons: {row.consumerNo} • ⚡ {row.systemCapacity}</div>
        </div>
      )
    },
    {
      key: 'totalProjectAmount',
      label: 'Total Project Amount',
      sortable: true,
      render: (_, row) => (
        <div className="font-black text-xs text-slate-900">
          ₹{row.totalProjectAmount.toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'advanceAmount',
      label: 'Advance (Token)',
      sortable: true,
      render: (_, row) => (
        <div className="font-bold text-xs text-slate-700">
          ₹{row.advanceAmount.toLocaleString('en-IN')}
        </div>
      )
    },
    {
      key: 'amountReceived',
      label: 'Amount Received (Now)',
      sortable: true,
      render: (_, row) => (
        <div>
          <div className="text-xs font-black text-[#166534]">
            ₹{row.amountReceived.toLocaleString('en-IN')}
          </div>
          <div className="text-[10px] text-slate-400">
            Total Paid: ₹{row.totalReceivedToDate.toLocaleString('en-IN')}
          </div>
        </div>
      )
    },
    {
      key: 'outstandingAmount',
      label: 'Outstanding Amount',
      sortable: true,
      render: (_, row) => (
        <div>
          {row.outstandingAmount === 0 ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 size={12} /> Settled (100%)
            </span>
          ) : (
            <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
              ₹{row.outstandingAmount.toLocaleString('en-IN')} Due
            </span>
          )}
        </div>
      )
    },
    {
      key: 'paymentDate',
      label: 'Payment Date',
      sortable: true,
      render: (_, row) => (
        <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
          <Calendar size={12} className="text-slate-400" /> {row.paymentDate}
        </span>
      )
    },
    {
      key: 'paymentMode',
      label: 'Payment Mode',
      render: (_, row) => (
        <div>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold border ${getModeBadge(row.paymentMode)}`}>
            {row.paymentMode}
          </span>
          <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate max-w-[120px]" title={row.transactionRef}>
            {row.transactionRef}
          </div>
        </div>
      )
    },
    {
      key: 'actions',
      label: 'Receipt Generation',
      render: (_, row) => (
        <button
          onClick={() => {
            setPrintableReceipt(row);
            setTimeout(() => {
              window.print();
            }, 50);
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white text-[11px] font-bold transition-all shadow-xs">
          <Printer size={13} /> Direct Print Receipt
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Strip */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <CreditCard className="text-[#166534]" size={24} /> Solar Payment Ledger & Receipts (4.I)
          </h1>
          <p className="text-xs text-slate-500">
            Total Project Amount, Advance, Milestone Installments, Outstanding Balance & Official GST Receipt Generation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddReceipt(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-xs">
            <Plus size={16} /> Record Payment & Issue Receipt
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:hidden">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Projects Value</span>
            <IndianRupee size={16} className="text-[#166534]" />
          </div>
          <div className="text-2xl font-black text-slate-800 mt-2 font-display">
            ₹{paymentLedger.reduce((sum, p) => sum + p.totalProjectAmount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Booked Solar Capacity</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Amount Received</span>
            <CheckCircle2 size={16} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#166534] mt-2 font-display">
            ₹{paymentLedger.reduce((sum, p) => sum + p.totalReceivedToDate, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Advance + Milestones Cleared</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Outstanding Amount</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <div className="text-2xl font-black text-rose-600 mt-2 font-display">
            ₹{paymentLedger.reduce((sum, p) => sum + p.outstandingAmount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-rose-600 font-bold mt-1">Pending Balance to Collect</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Advance Token Collected</span>
            <ShieldCheck size={16} className="text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-800 mt-2 font-display">
            ₹{paymentLedger.reduce((sum, p) => sum + p.advanceAmount, 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-sky-600 font-semibold mt-1">Booking Stage (20%)</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search receipt no, customer name, mobile, project ID..."
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
            { id: 'ALL', label: 'All Receipts' },
            { id: 'CLEAR', label: '100% Settled' },
            { id: 'DUE', label: 'Balance Outstanding' },
            { id: 'ADVANCE', label: 'Token Advance' }
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

      {/* DataTable */}
      <div className="print:hidden">
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          skeletonRows={5}
          skeletonCols={8}
          initialPageSize={10}
          pageSizeOptions={[5, 10, 20, 50]}
        />
      </div>

      {/* Official Printable Money Receipt (Clean Direct Print, Hidden from screen, Visible in Print) */}
      {printableReceipt && (
        <div className="hidden print:block print:w-full print:h-full">
          <div 
            id="printable-receipt"
            className="bg-white print:p-2 print:m-0 print:border-none print:shadow-none print:w-full print:max-w-none print:flex-1 print:flex print:flex-col print:justify-between">
            {/* Header */}
            <div className="flex items-start justify-between border-b-2 border-[#166534] pb-3 mb-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#166534] border-2 border-[#22C55E] flex items-center justify-center text-[#FACC15] shadow-sm">
                  <Sun size={28} />
                </div>
                <div>
                  <h2 className="text-base font-black text-[#166534] uppercase font-display tracking-tight">
                    DEVAGYADI BHARAT PRIVATE LIMITED
                  </h2>
                  <p className="text-[11px] font-bold text-emerald-800">
                    Rooftop Solar EPC • PM Surya Ghar Registered Partner
                  </p>
                  <p className="text-[9.5px] text-slate-500 mt-0.5">
                    Reg. Office: Hazratganj, Lucknow, Uttar Pradesh – 226001 | CIN: U40106UP2024PTC198274
                  </p>
                  <p className="text-[9px] text-slate-400">
                    Email: info@devagyadibharat.com | Phone: +91 9876543210 | Web: devagyadibharat.com
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">OFFICIAL MONEY RECEIPT</div>
                <div className="text-sm font-black text-[#166534] font-mono">{printableReceipt.receiptNo}</div>
                <div className="text-[10px] text-slate-500 mt-1">Date: {printableReceipt.paymentDate}</div>
                <div className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-200 inline-block">
                  GST Tax Paid
                </div>
              </div>
            </div>

            {/* Customer & Project Box */}
            <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 mb-3 text-[11px]">
              <div>
                <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Received With Thanks From:</div>
                <div className="font-black text-xs text-slate-900 mt-0.5">{printableReceipt.customerName}</div>
                <div className="text-slate-600 mt-0.5">Mobile: +91 {printableReceipt.mobile}</div>
                <div className="text-slate-600 font-mono mt-0.5">Consumer ID: {printableReceipt.consumerNo}</div>
              </div>
              <div>
                <div className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wide">Solar Plant Reference:</div>
                <div className="font-mono font-bold text-xs text-[#166534] mt-0.5">{printableReceipt.projectId}</div>
                <div className="text-slate-800 font-semibold mt-0.5">⚡ {printableReceipt.systemCapacity} On-Grid Rooftop Plant</div>
                <div className="text-slate-600 mt-0.5">Milestone: <strong>{printableReceipt.installmentType}</strong></div>
              </div>
            </div>

            {/* Amount Breakdown Table */}
            <div className="mb-3">
              <div className="text-[11px] font-black text-slate-800 uppercase tracking-wider mb-1.5">Payment Ledger Breakdown</div>
              <table className="w-full text-[10.5px] border border-slate-200 rounded-xl overflow-hidden bg-white">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5 text-left">Billing Description</th>
                    <th className="py-2 px-2.5 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="py-2 px-2.5">Total Solar Project Contract Value</td>
                    <td className="py-2 px-2.5 text-right font-bold text-slate-900">₹{printableReceipt.totalProjectAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5">Advance Token Amount (Milestone 1)</td>
                    <td className="py-2 px-2.5 text-right font-semibold">₹{printableReceipt.advanceAmount.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="bg-emerald-50/70 font-bold text-[#166534]">
                    <td className="py-2 px-2.5">
                      <strong>Current Amount Received (This Receipt)</strong>
                      <div className="text-[10px] text-emerald-800 font-medium">{printableReceipt.installmentType}</div>
                    </td>
                    <td className="py-2 px-2.5 text-right font-black text-sm text-[#166534]">
                      ₹{printableReceipt.amountReceived.toLocaleString('en-IN')}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2.5">Total Cumulative Payments Cleared Till Date</td>
                    <td className="py-2 px-2.5 text-right font-black text-emerald-700">₹{printableReceipt.totalReceivedToDate.toLocaleString('en-IN')}</td>
                  </tr>
                  <tr className="border-t-2 border-slate-300 font-bold bg-slate-50/50">
                    <td className="py-2 px-2.5 text-slate-900">Remaining Balance / Outstanding Amount</td>
                    <td className="py-2 px-2.5 text-right font-black text-xs text-rose-600">
                      {printableReceipt.outstandingAmount === 0 ? '₹0 (100% Settled)' : `₹${printableReceipt.outstandingAmount.toLocaleString('en-IN')} Due`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mode & Transaction Details */}
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-[10.5px] mb-3">
              <div>
                <span className="text-slate-500">Payment Mode: </span>
                <strong className="text-slate-900">{printableReceipt.paymentMode}</strong>
              </div>
              <div>
                <span className="text-slate-500">Txn / UTR Reference: </span>
                <strong className="font-mono text-slate-900 font-bold">{printableReceipt.transactionRef}</strong>
              </div>
            </div>

            {/* Signatures & Declarations */}
            <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-slate-200 text-[10px] mt-auto">
              <div className="text-slate-500 space-y-0.5">
                <div>Receipt authorized by: <strong className="text-slate-800">{printableReceipt.receivedBy}</strong></div>
                <div className="text-[9px] text-slate-400">
                  *This is a computer generated official payment receipt, subject to realization of clearing cheques/RTGS funds.
                </div>
              </div>
              <div className="text-right flex flex-col justify-end">
                <div className="font-black text-[#166534] text-xs">For DEVAGYADI BHARAT PRIVATE LIMITED</div>
                <div className="text-slate-400 text-[10px] mt-6">Authorized Signatory & Seal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record New Payment Modal */}
      {showAddReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                <CreditCard className="text-[#166534]" size={20} /> Record Customer Payment
              </h3>
              <button onClick={() => setShowAddReceipt(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddReceipt} className="space-y-3.5 py-4 text-xs">
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
                  <label className="block font-bold text-slate-700 mb-1">Consumer Number</label>
                  <input
                    type="text"
                    value={form.consumerNo}
                    onChange={(e) => setForm({ ...form, consumerNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-mono"
                    placeholder="Electricity consumer ID"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity (kW)</label>
                  <select
                    value={form.systemCapacity}
                    onChange={(e) => setForm({ ...form, systemCapacity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-bold">
                    <option value="2 kW">2 kW</option>
                    <option value="3 kW">3 kW</option>
                    <option value="5 kW">5 kW</option>
                    <option value="7 kW">7 kW</option>
                    <option value="10 kW">10 kW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Project Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.totalProjectAmount}
                    onChange={(e) => setForm({ ...form, totalProjectAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Advance Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.advanceAmount}
                    onChange={(e) => setForm({ ...form, advanceAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Installment / Milestone Stage</label>
                  <select
                    value={form.installmentType}
                    onChange={(e) => setForm({ ...form, installmentType: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold">
                    <option value="Booking Advance Token (20%)">Booking Advance Token (20%)</option>
                    <option value="Material Delivery (Milestone 2 - 70%)">Material Delivery (Milestone 2 - 70%)</option>
                    <option value="Final Settlement (Milestone 3)">Final Settlement (Milestone 3)</option>
                    <option value="Net Meter Commissioning (10%)">Net Meter Commissioning (10%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Amount Received Now (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.amountReceived}
                    onChange={(e) => setForm({ ...form, amountReceived: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] font-black text-[#166534]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Date *</label>
                  <input
                    type="date"
                    required
                    value={form.paymentDate}
                    onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Payment Mode *</label>
                  <select
                    value={form.paymentMode}
                    onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-semibold">
                    <option value="UPI / QR Code">UPI / QR Code</option>
                    <option value="Bank RTGS / NEFT">Bank RTGS / NEFT</option>
                    <option value="Cheque Clearance">Cheque Clearance</option>
                    <option value="Cash Deposit">Cash Deposit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Txn / UTR Reference</label>
                  <input
                    type="text"
                    value={form.transactionRef}
                    onChange={(e) => setForm({ ...form, transactionRef: e.target.value })}
                    className="w-full px-2.5 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                    placeholder="e.g. UPI/26101298"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddReceipt(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#166534] hover:bg-emerald-900 text-white rounded-xl font-bold shadow-xs">
                  Save & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
